#!/usr/bin/env python3
"""
Le Filtre — Serveur Local  v0.2
═══════════════════════════════════════════════════════════════
Permet d'utiliser Le Filtre.html avec ta propre clé API Anthropic,
sans passer par Claude Design ni ses limites d'usage.

DÉMARRAGE :
  python3 le-filtre-server.py

PRÉREQUIS :
  1. Télécharger "Le Filtre.html" depuis Claude Design
     → bouton Share → Download (ou Ctrl+S sur la prévisualisation)
  2. Placer "Le Filtre.html" dans ce même dossier
  3. Ouvrir http://localhost:8765 dans ton navigateur
  4. Coller ta clé API Anthropic (sk-ant-...) dans la barre verte
  5. Lancer l'analyse ✓

Clé API : https://console.anthropic.com/settings/keys
Modèle  : claude-haiku-4-5-20251001 (rapide, économique)
Débit   : 1 requête / 1.2 secondes (≈ 52 items en ~65 secondes)
═══════════════════════════════════════════════════════════════
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.error
import time
import threading
import os
import sys

# ── Configuration ──────────────────────────────────────────────
PORT = 8765
HTML_FILE = "Le Filtre.html"
MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 1024
MIN_DELAY = 1.2  # secondes entre chaque appel API (rate limiting)

# ── État global du rate limiter ─────────────────────────────────
_lock = threading.Lock()
_last_call = 0.0

# ── Script JS injecté dans le HTML ─────────────────────────────
# Ce patch intercepte window.cowork.askClaude et redirige vers
# notre proxy local, en ajoutant une interface pour la clé API.
PATCH_JS = """
<script>
/* ═══════════════════════════════════════════════════════════════
   Le Filtre — Patch API Local
   Injecté automatiquement par le-filtre-server.py
   Remplace window.cowork.askClaude par des appels au proxy local.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'lf_api_key_v1';
  let apiKey = '';
  try { apiKey = localStorage.getItem(STORAGE_KEY) || ''; } catch(e) {}

  /* ── Bannière de configuration ── */
  function buildBanner() {
    const bar = document.createElement('div');
    bar.id = 'lf-local-bar';
    bar.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:999999',
      'background:#1c2b1e', 'color:#9bbf9e',
      'padding:6px 14px', 'display:flex', 'align-items:center', 'gap:10px',
      'font:12px/1.4 ui-monospace,SFMono-Regular,monospace',
      'border-bottom:2px solid #3a5c3e',
      'box-shadow:0 2px 10px rgba(0,0,0,.5)'
    ].join(';');

    bar.innerHTML = [
      '<span style="color:#6e9e72;font-weight:700;letter-spacing:.05em">⚡ MODE LOCAL</span>',
      '<input id="lf-key-input" type="password" autocomplete="off"',
      '  placeholder="sk-ant-api03-… — colle ta clé API Anthropic"',
      '  style="flex:1;max-width:440px;background:#0f1a11;border:1px solid #3a5c3e;',
      '         color:#c8e6c9;padding:4px 10px;border-radius:4px;',
      '         font:12px ui-monospace,monospace;outline:none">',
      '<span id="lf-status" style="white-space:nowrap">○ clé requise</span>',
      '<span id="lf-progress" style="margin-left:auto;white-space:nowrap;color:#6e9e72"></span>'
    ].join('');

    document.body.prepend(bar);
    document.body.style.paddingTop = (parseInt(document.body.style.paddingTop) || 0) + 38 + 'px';

    const input = document.getElementById('lf-key-input');
    input.value = apiKey;

    function saveKey() {
      apiKey = input.value.trim();
      try { localStorage.setItem(STORAGE_KEY, apiKey); } catch(e) {}
      setStatus(apiKey ? '● prête' : '○ clé requise', apiKey ? '#6e9e72' : '#c47050');
    }
    input.addEventListener('change', saveKey);
    input.addEventListener('blur', saveKey);

    setStatus(apiKey ? '● prête' : '○ clé requise', apiKey ? '#6e9e72' : '#c47050');
  }

  function setStatus(msg, color) {
    const el = document.getElementById('lf-status');
    if (el) { el.textContent = msg; el.style.color = color || '#6e9e72'; }
  }
  function setProgress(msg) {
    const el = document.getElementById('lf-progress');
    if (el) el.textContent = msg;
  }

  /* ── Queue sérialisée avec délai ── */
  let callQueue = Promise.resolve();
  let totalCalls = 0;
  let doneCalls = 0;

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── Override de window.cowork.askClaude ── */
  function patchCowork() {
    const original = window.cowork || {};
    window.cowork = Object.assign(Object.create(null), original, {

      askClaude: function (prompt, data) {
        totalCalls++;
        const idx = totalCalls;

        callQueue = callQueue.then(async () => {
          // Délai anti-rate-limit (géré aussi côté serveur)
          await sleep(1250);

          setStatus('● analyse…', '#c9a84c');
          setProgress('⏳ ' + idx + ' en cours…');

          if (!apiKey) {
            const input = document.getElementById('lf-key-input');
            if (input) { input.style.borderColor = '#c47050'; input.focus(); }
            throw new Error('[Le Filtre Local] Clé API manquante — colle ta clé sk-ant- dans la barre en haut');
          }

          // Construire le payload
          const payload = { apiKey, prompt, data: data || [] };

          const resp = await fetch('/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            const msg = (typeof err.error === 'object' ? err.error.error?.message : err.error) || ('HTTP ' + resp.status);
            setStatus('✗ erreur', '#c47050');
            throw new Error('[Le Filtre Local] ' + msg);
          }

          const result = await resp.json();
          doneCalls++;
          setStatus('● prête', '#6e9e72');
          setProgress('✓ ' + doneCalls + '/' + idx + ' traité' + (doneCalls > 1 ? 's' : ''));
          return result.content;
        });

        return callQueue;
      }

    });

    console.info('[Le Filtre Local] ✓ window.cowork.askClaude → proxy local http://localhost:' + location.port);
  }

  /* ── Initialisation ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { buildBanner(); patchCowork(); });
  } else {
    buildBanner(); patchCowork();
  }

})();
</script>
"""


# ── Gestionnaire HTTP ───────────────────────────────────────────
class Handler(http.server.BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        # On ne logge que les erreurs et les appels API
        if args and (str(args[1]) not in ('200',) or '/api/' in str(args[0])):
            sys.stdout.write(f"  [{time.strftime('%H:%M:%S')}] {fmt % args}\n")
            sys.stdout.flush()

    # ── GET ────────────────────────────────────────────────────
    def do_GET(self):
        path = self.path.split('?')[0]

        if path in ('/', f'/{HTML_FILE}', '/index.html'):
            self._serve_html()
        else:
            # Servir les autres fichiers statiques (images, fonts…)
            handler = http.server.SimpleHTTPRequestHandler(
                self.request, self.client_address, self.server
            )
            # Fallback simple
            self.send_error(404, "Fichier non trouvé")

    def _serve_html(self):
        try:
            with open(HTML_FILE, 'r', encoding='utf-8') as f:
                html = f.read()
        except FileNotFoundError:
            self.send_error(
                404,
                f"'{HTML_FILE}' introuvable — télécharge-le depuis Claude Design et place-le ici"
            )
            return

        # Injecter le patch dès le début du <head> pour s'assurer
        # qu'il s'exécute avant tout autre script de la page.
        if '<head>' in html:
            html = html.replace('<head>', '<head>\n' + PATCH_JS, 1)
        else:
            html = PATCH_JS + html

        encoded = html.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(encoded)))
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(encoded)

    # ── POST ───────────────────────────────────────────────────
    def do_POST(self):
        if self.path == '/api/claude':
            self._handle_claude()
        else:
            self.send_error(404)

    def _handle_claude(self):
        global _last_call

        length = int(self.headers.get('Content-Length', 0))
        try:
            body = json.loads(self.rfile.read(length))
        except Exception:
            self._json(400, {'error': 'JSON invalide'})
            return

        api_key = body.get('apiKey', '').strip()
        prompt = str(body.get('prompt', ''))
        data = body.get('data') or []

        if not api_key:
            self._json(401, {'error': 'Clé API manquante'})
            return

        # ── Rate limiting côté serveur ──────────────────────────
        with _lock:
            now = time.time()
            wait = MIN_DELAY - (now - _last_call)
            if wait > 0:
                time.sleep(wait)
            _last_call = time.time()

        # ── Construire le contenu multi-part ───────────────────
        content = []
        for item in data:
            if not item:
                continue
            if isinstance(item, str):
                if item.startswith('data:image/'):
                    # Image base64 (ex : PNG/JPG capturé localement)
                    parts = item.split(',', 1)
                    media_type = parts[0].split(':')[1].split(';')[0]
                    content.append({
                        'type': 'image',
                        'source': {
                            'type': 'base64',
                            'media_type': media_type,
                            'data': parts[1] if len(parts) > 1 else ''
                        }
                    })
                else:
                    content.append({'type': 'text', 'text': item})
            elif isinstance(item, dict):
                content.append({'type': 'text', 'text': json.dumps(item, ensure_ascii=False)})

        content.append({'type': 'text', 'text': prompt})

        payload = json.dumps({
            'model': MODEL,
            'max_tokens': MAX_TOKENS,
            'messages': [{'role': 'user', 'content': content}]
        }, ensure_ascii=False).encode('utf-8')

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=payload,
            headers={
                'x-api-key': api_key,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
                'user-agent': 'le-filtre-local/0.2'
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read())
                text = result['content'][0]['text']
                print(f"  ✓  [{time.strftime('%H:%M:%S')}] {len(text)} chars retournés")
                self._json(200, {'content': text})

        except urllib.error.HTTPError as e:
            err_raw = e.read().decode('utf-8', errors='replace')
            print(f"  ✗  [{time.strftime('%H:%M:%S')}] HTTP {e.code}: {err_raw[:200]}")
            try:
                err_obj = json.loads(err_raw)
            except Exception:
                err_obj = err_raw
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            self.wfile.write(json.dumps({'error': err_obj}).encode())

        except Exception as e:
            print(f"  ✗  [{time.strftime('%H:%M:%S')}] Erreur: {e}")
            self._json(500, {'error': str(e)})

    def _json(self, code, data):
        encoded = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


# ── Point d'entrée ─────────────────────────────────────────────
def main():
    banner = f"""
╔══════════════════════════════════════════════════════╗
║      Le Filtre — Serveur Local  v0.2                 ║
║      Proxy API Anthropic · Rate-limited · Local      ║
╚══════════════════════════════════════════════════════╝

  Fichier HTML  : {HTML_FILE}
  Modèle Claude : {MODEL}
  Débit max     : 1 requête / {MIN_DELAY}s  (~{int(52 * MIN_DELAY)}s pour 52 items)
  Interface     : http://localhost:{PORT}

  ────────────────────────────────────────────────────
  ÉTAPES :
  1. Télécharge "Le Filtre.html" depuis Claude Design
     → Share → Download  (ou Ctrl+S sur l'aperçu)
  2. Place-le dans ce dossier : {os.getcwd()}
  3. Ouvre  http://localhost:{PORT}  dans ton navigateur
  4. Colle ta clé API Anthropic (sk-ant-…) dans la barre verte
  5. Lance l'analyse  ✓
  ────────────────────────────────────────────────────
  Clé API  → https://console.anthropic.com/settings/keys
  Ctrl+C pour arrêter le serveur.
"""
    print(banner)

    if not os.path.exists(HTML_FILE):
        print(f"  ⚠  '{HTML_FILE}' pas encore présent dans ce dossier.")
        print(f"     Télécharge-le depuis Claude Design puis relance si besoin.\n")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(('', PORT), Handler) as httpd:
        print(f"  Serveur démarré → http://localhost:{PORT}\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n\n  Serveur arrêté. À bientôt !')


if __name__ == '__main__':
    main()

// extractors.jsx — Lazy-loaded extractors for PDF / OCR / audio / link metadata
// All run locally in the browser. External libs are loaded on demand to keep
// the cold-start cost at zero.
/* global window, document */

const LIBS = {
  pdf: { src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", check: () => !!window.pdfjsLib },
  pdfWorker: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  tesseract: { src: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js", check: () => !!window.Tesseract },
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-lazy="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load " + src)));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.lazy = src;
    s.onload = () => { s.dataset.loaded = "1"; resolve(); };
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}

async function ensure(lib) {
  if (lib.check && lib.check()) return;
  await loadScript(lib.src);
}

// ─── PDF extraction (pdfjs-dist) ──────────────────────────────────────
async function extractPdfText(file, onProgress) {
  await ensure(LIBS.pdf);
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = LIBS.pdfWorker;
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  let text = "";
  const total = pdf.numPages;
  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    text += tc.items.map(it => it.str).join(" ") + "\n\n";
    if (onProgress) onProgress(i / total);
  }
  return { text, pages: total };
}

// ─── DOCX extraction (very light — strips XML tags from word/document.xml) ─
async function extractDocxText(file) {
  // We won't ship JSZip; instead we try a fetch-and-parse via a tiny shim.
  // Real solution would be JSZip — for demo we fall back to a description.
  try {
    const buf = await file.arrayBuffer();
    // crude: look for runs of text in the binary; many short fragments will
    // bleed through. This is intentionally minimal — for a real partner demo,
    // load JSZip + parse properly.
    const td = new TextDecoder("utf-8", { fatal: false });
    const raw = td.decode(buf);
    const matches = raw.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    if (matches.length === 0) return null;
    const text = matches.map(m => m.replace(/<[^>]+>/g, "")).join(" ");
    return { text };
  } catch (e) { return null; }
}

// ─── OCR (Tesseract.js, fr+eng) ───────────────────────────────────────
async function ocrImage(file, onProgress) {
  await ensure(LIBS.tesseract);
  const url = URL.createObjectURL(file);
  try {
    const result = await window.Tesseract.recognize(url, "fra+eng", {
      logger: (m) => {
        if (onProgress && m.status === "recognizing text") onProgress(m.progress);
      },
    });
    return { text: result.data.text, confidence: result.data.confidence };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ─── Link metadata (noembed.com — CORS friendly oEmbed proxy) ─────────
async function fetchLinkMeta(url) {
  try {
    const r = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`, { mode: "cors" });
    if (!r.ok) throw new Error("noembed " + r.status);
    const data = await r.json();
    return {
      ok: !data.error,
      title: data.title || null,
      author: data.author_name || null,
      provider: data.provider_name || null,
      thumbnail: data.thumbnail_url || null,
      description: data.description || null,
      html: data.html || null,
      url,
      error: data.error || null,
    };
  } catch (e) {
    return { ok: false, error: e.message, url };
  }
}

// ─── Web Speech API (live transcription, fr-FR) ──────────────────────
function getSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = "fr-FR";
  r.continuous = true;
  r.interimResults = true;
  return r;
}

// ─── MediaRecorder (audio capture) ────────────────────────────────────
async function recordAudio({ onStart, onChunk, onStop }) {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("Pas d'accès microphone");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data?.size > 0) { chunks.push(e.data); onChunk?.(e.data); } };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    stream.getTracks().forEach(t => t.stop());
    onStop?.(blob);
  };
  recorder.start();
  onStart?.(recorder, stream);
  return recorder;
}

// ─── SVG → PNG export helper (used by studio) ─────────────────────────
function svgToPng(svgEl, scale = 2) {
  return new Promise((resolve, reject) => {
    const rect = svgEl.getBoundingClientRect();
    const w = (svgEl.viewBox?.baseVal?.width || rect.width) * scale;
    const h = (svgEl.viewBox?.baseVal?.height || rect.height) * scale;
    // ensure xmlns on the svg
    const clone = svgEl.cloneNode(true);
    if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    // inline current computed styles for shapes
    const css = `<style>${[...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules].map(r => r.cssText); } catch (e) { return []; } }).join("\n")}</style>`;
    clone.insertAdjacentHTML("afterbegin", css);
    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      // paint bg
      const bgVar = getComputedStyle(document.documentElement).getPropertyValue("--card").trim();
      ctx.fillStyle = bgVar || "#fff"; ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => resolve(b), "image/png");
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(new Error("SVG render failed")); };
    img.src = url;
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 100);
}

function svgString(svgEl) {
  const clone = svgEl.cloneNode(true);
  if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

Object.assign(window, {
  extractPdfText, extractDocxText, ocrImage, fetchLinkMeta,
  getSpeechRecognition, recordAudio,
  svgToPng, svgString, downloadBlob,
});

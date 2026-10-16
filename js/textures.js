// Procedural textures and canvas text helpers. No image files are needed.
import * as THREE from 'three';

export const SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
export const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export function toTexture(canvas, { aniso = 4, repeat = null } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

// Seeded random so the room looks the same on every load.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Polished concrete: soft clouds, fine grain and saw-cut joints on the tile edge.
export function concreteTexture(aniso) {
  const S = 1024, c = makeCanvas(S, S), g = c.getContext('2d'), r = rng(7);
  g.fillStyle = '#8f8f8c';
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 260; i++) {
    const x = r() * S, y = r() * S, rad = 40 + r() * 190, a = 0.035 + r() * 0.05;
    const dark = r() < 0.5;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, dark ? `rgba(60,60,58,${a})` : `rgba(215,215,210,${a})`);
    gr.addColorStop(1, 'rgba(128,128,126,0)');
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  const d = g.getImageData(0, 0, S, S), px = d.data, n = rng(19);
  for (let i = 0; i < px.length; i += 4) {
    const v = (n() - 0.5) * 12;
    px[i] += v; px[i + 1] += v; px[i + 2] += v;
  }
  g.putImageData(d, 0, 0);
  g.strokeStyle = 'rgba(40,40,38,0.55)';
  g.lineWidth = 3;
  g.strokeRect(0, 0, S, S);
  return toTexture(c, { aniso, repeat: [3, 4] });
}

// Warm oiled wood grain for frames and the bench.
export function woodTexture(aniso, base = '#6a4528', seed = 3) {
  const W = 256, H = 512, c = makeCanvas(W, H), g = c.getContext('2d'), r = rng(seed);
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) {
    const x = r() * W, w = 1 + r() * 4, a = 0.05 + r() * 0.12;
    g.fillStyle = r() < 0.5 ? `rgba(20,10,0,${a})` : `rgba(255,220,170,${a * 0.6})`;
    g.fillRect(x, 0, w, H);
  }
  return toTexture(c, { aniso });
}

// Soft blurred rectangle used as a fake contact shadow under frames and furniture.
let _shadowTex = null;
export function softShadowTexture() {
  if (_shadowTex) return _shadowTex;
  const S = 128, c = makeCanvas(S, S), g = c.getContext('2d');
  g.shadowColor = 'rgba(0,0,0,0.9)';
  g.shadowBlur = 22;
  g.shadowOffsetX = 1000;
  g.fillStyle = '#000';
  g.fillRect(34 - 1000, 34, S - 68, S - 68);
  _shadowTex = new THREE.CanvasTexture(c);
  return _shadowTex;
}

// Wraps text inside a box. Returns the y position after the last line.
export function wrapText(g, text, x, y, maxW, lineH, maxLines = 99) {
  const words = text.split(/\s+/);
  let line = '', lines = 0;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (g.measureText(test).width > maxW && line) {
      if (lines + 1 >= maxLines) {
        g.fillText(line.replace(/[ ,.;:]+$/, '') + '…', x, y);
        return y + lineH;
      }
      g.fillText(line, x, y);
      y += lineH;
      lines++;
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) { g.fillText(line, x, y); y += lineH; }
  return y;
}

export function spaced(g, text, x, y, spacing) {
  // letter-spaced text for small caps labels
  let cx = x;
  for (const ch of text) {
    g.fillText(ch, cx, y);
    cx += g.measureText(ch).width + spacing;
  }
  return cx;
}

// Draws paragraphs in a column; returns the y after the last line.
function paragraphs(g, list, x, y, maxW, lineH, gap) {
  list.forEach((p) => { y = wrapText(g, p, x, y, maxW, lineH) + gap; });
  return y;
}

// Number of lines wrapText would use for this text at the current font.
function countLines(g, text, maxW) {
  let line = '', n = 0;
  for (const w of text.split(/\s+/)) {
    const test = line ? line + ' ' + w : w;
    if (g.measureText(test).width > maxW && line) { n++; line = w; } else line = test;
  }
  return n + (line ? 1 : 0);
}

// Like paragraphs(), but shrinks the serif type (down to 70%) until the text ends above `bottom`.
function fitParagraphs(g, list, x, y, maxW, size, lineH, gap, bottom) {
  let k = 1;
  for (; k > 0.7; k -= 0.02) {
    g.font = `${size * k}px ${SERIF}`;
    const end = list.reduce((yy, p) => yy + countLines(g, p, maxW) * lineH * k + gap * k, y);
    if (end <= bottom) break;
  }
  return paragraphs(g, list, x, y, maxW, lineH * k, gap * k);
}

// The text panel on the information stand (John Thomson). Drawn at 2x for crisp small type.
export function bioPanelCanvas(bio, number) {
  const W = 820, H = 1560, S = 2, c = makeCanvas(W * S, H * S), g = c.getContext('2d');
  g.scale(S, S);
  g.fillStyle = '#e4dfd3';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(40,30,20,0.25)';
  g.lineWidth = 3;
  g.strokeRect(24, 24, W - 48, H - 48);
  g.fillStyle = '#7c2d1d';
  g.font = `700 26px ${SANS}`;
  g.textBaseline = 'alphabetic';
  spaced(g, bio.kicker.split('·')[1].trim().toUpperCase(), 64, 100, 4);
  g.fillStyle = 'rgba(124,45,29,0.16)';
  g.font = `700 200px ${SERIF}`;
  g.fillText(number, 600, 230);
  g.fillStyle = '#1f1a16';
  g.font = `700 78px ${SERIF}`;
  g.fillText(bio.name, 64, 215);
  g.fillStyle = '#5a4f44';
  g.font = `italic 38px ${SERIF}`;
  g.fillText(bio.dates, 64, 275);
  g.fillStyle = '#7c2d1d';
  g.fillRect(64, 308, 110, 5);
  g.fillStyle = '#2b2520';
  const end = fitParagraphs(g, bio.panel, 64, 372, W - 128, 27, 38, 18, H - 60);
  if (end > H - 60) console.warn('Stand text overflows the panel by', Math.round(end - (H - 60)), 'px');
  return c;
}

// A text panel for a wall (Jane Dieulafoy): canvas 1200 x 1600 for a 1.5 m x 2.0 m panel.
export function wallPanelCanvas(bio, number) {
  const W = 1200, H = 1600, c = makeCanvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#e4dfd3';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(40,30,20,0.25)';
  g.lineWidth = 4;
  g.strokeRect(28, 28, W - 56, H - 56);
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#7c2d1d';
  g.font = `700 30px ${SANS}`;
  spaced(g, bio.kicker.split('·')[1].trim().toUpperCase(), 80, 120, 4);
  g.fillStyle = 'rgba(124,45,29,0.16)';
  g.font = `700 260px ${SERIF}`;
  g.fillText(number, 900, 290);
  g.fillStyle = '#1f1a16';
  g.font = `700 100px ${SERIF}`;
  g.fillText(bio.name, 80, 270);
  g.fillStyle = '#5a4f44';
  g.font = `italic 46px ${SERIF}`;
  g.fillText(bio.dates, 80, 340);
  g.fillStyle = '#7c2d1d';
  g.fillRect(80, 380, 140, 6);
  g.fillStyle = '#2b2520';
  const end = fitParagraphs(g, bio.panel, 80, 460, W - 160, 30, 42, 20, H - 60);
  if (end > H - 60) console.warn('Wall panel text overflows by', Math.round(end - (H - 60)), 'px');
  return c;
}

// Large wall text on the entrance wall.
export function wallTextCanvas(ex) {
  const W = 1500, H = 1000, c = makeCanvas(W, H), g = c.getContext('2d');
  g.clearRect(0, 0, W, H);
  g.fillStyle = '#1f1a16';
  g.textBaseline = 'alphabetic';
  g.font = `700 150px ${SERIF}`;
  g.fillText(ex.title, 20, 150);
  g.fillStyle = '#7c2d1d';
  g.font = `italic 120px ${SERIF}`;
  g.fillText(ex.qualifier, 20, 290);
  g.fillStyle = '#5a4f44';
  g.font = `700 32px ${SANS}`;
  spaced(g, ex.subtitle.toUpperCase(), 24, 370, 4);
  g.fillStyle = '#7c2d1d';
  g.fillRect(24, 410, 140, 6);
  g.fillStyle = '#2b2520';
  g.font = `44px ${SERIF}`;
  wrapText(g, ex.wall, 24, 500, 1380, 66, 9);
  g.fillStyle = '#7c2d1d';
  g.font = `700 32px ${SANS}`;
  spaced(g, 'ABOUT THE ROOM  →', 24, 940, 3);
  return c;
}

// Label beside each frame: plate number and figure number.
export function plateCanvas(n, fig = '') {
  const c = makeCanvas(256, 96), g = c.getContext('2d');
  g.fillStyle = '#f7f5f0';
  g.fillRect(0, 0, 256, 96);
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 3;
  g.strokeRect(1.5, 1.5, 253, 93);
  g.fillStyle = '#2a2622';
  g.font = `700 22px ${SANS}`;
  g.textBaseline = 'middle';
  spaced(g, 'PLATE', 20, 36, 4);
  g.font = `700 44px ${SERIF}`;
  g.fillText(String(n).padStart(2, '0'), 20, 68);
  g.fillStyle = '#7c2d1d';
  g.font = `italic 700 26px ${SERIF}`;
  g.fillText(fig ? 'Fig. ' + fig : '', 112, 68);
  return c;
}

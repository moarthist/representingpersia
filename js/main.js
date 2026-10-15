import { Renderer, m4, boxData, planeData, rgb } from './engine.js';

/* =========================================================
   Representing Persia (the Qajars): a 3D micromuseum
   One room. Photographs on the walls, a stand with the biography
   of Jane Dieulafoy, and a touch screen showing the INHA archive.
   ========================================================= */

const ROOM = { w: 10, d: 8, h: 3.6 };           // metres; x: -5..5, z: -4..4
const PHOTO_Y = 1.55;
const $ = (s) => document.querySelector(s);

const BIO = {
  title: 'Jane Dieulafoy',
  dates: '1851 – 1916',
  short: 'Traveller, archaeologist, photographer and writer. Born in Toulouse, she travelled through Persia with her husband Marcel and kept a visual diary of the expedition.',
  paras: [
    'Jane Dieulafoy was born in Toulouse in 1851. She was one of the most famous travellers of her time: an archaeologist, a photographer and a writer.',
    'With her husband Marcel Dieulafoy (1844–1920), an archaeologist, she spent more than five years travelling in the East to explore the roots of European architecture and to excavate. Their first journey through Persia ran from 1881 to 1884; the excavations at Susa followed from 1884 to 1886 and gave the book <em>À Suse: journal des fouilles</em> (1888).',
    'Jane kept a visual diary of the adventure. Her photographs, platinum prints made around 1884–1886, are preserved in the Dieulafoy albums at the Institut national d’histoire de l’art (INHA) in Paris, and form the heart of this micromuseum.',
    'She travelled in men’s clothing with short hair, a choice that defied the conventions of the 19th century and probably made travelling easier. She also wrote a novel, <em>Parysatis</em>, later adapted into an opera.',
    'Nearly 40 tons of archaeological pieces were exported to France, where the Salle Dieulafoy opened at the Louvre. How these finds were obtained is still debated. The couple’s notes and images remain first-hand sources for the history of Persia; they are read here critically, aware of the European gaze behind the camera.'
  ],
  source: 'Source: M. Mohammadi, Re-presenting Persia: micromuseum practices in the photographic collection of INHA (University of Bologna, 2026).'
};

/* ---------------- loading ---------------- */
const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Cannot load ' + src)); i.src = src; });

async function boot() {
  let renderer;
  try { renderer = new Renderer($('#view')); }
  catch (e) { $('#loading').innerHTML = '<p>This 3D room needs WebGL2. Please open the page in a recent version of Chrome, Edge, Firefox or Safari.</p>'; return; }

  const data = await (await fetch('data/photos.json')).json();
  let done = 0;
  const imgs = await Promise.all(data.photos.map(p => load('assets/photos/' + p.file).then(i => { $('#bar').style.width = (++done / data.photos.length * 100) + '%'; return i; })));
  buildScene(renderer, data, imgs);
}

/* ---------------- canvas helpers ---------------- */
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function wrapText(ctx, text, x, y, maxW, lh, maxLines = 99) {
  const words = text.split(' '); let line = '', n = 0;
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); y += lh; line = w; if (++n >= maxLines) return y; }
    else line = t;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lh;
}

function parquetTexture() {
  const c = canvas(512, 512), g = c.getContext('2d');
  const tones = ['#8a6a4a', '#7d5f42', '#94724f', '#86664a', '#9a7a58'];
  const pw = 64, ph = 256;
  for (let col = 0; col < 8; col++) {
    let y = -((col * 97) % ph);
    while (y < 512) {
      g.fillStyle = tones[Math.floor(Math.random() * tones.length)];
      g.fillRect(col * pw, y, pw, ph);
      for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(60,40,20,${Math.random() * 0.06})`; g.fillRect(col * pw + Math.random() * pw, y + Math.random() * ph, 1 + Math.random() * 2, 8 + Math.random() * 40); }
      g.strokeStyle = 'rgba(40,25,10,0.55)'; g.lineWidth = 1.5; g.strokeRect(col * pw + 0.5, y + 0.5, pw, ph);
      y += ph;
    }
  }
  return c;
}

function plasterTexture() {
  const c = canvas(256, 256), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2500; i++) { const v = 235 + Math.random() * 20; g.fillStyle = `rgba(${v},${v - 2},${v - 6},0.55)`; g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
  return c;
}

function radialTexture(stops) {
  const c = canvas(128, 128), g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return c;
}

/* =========================================================
   Scene
   ========================================================= */
function buildScene(R, data, imgs) {
  const geoCache = new Map();
  const box = (w, h, d, uvs = 0) => { const k = `b${w}|${h}|${d}|${uvs}`; if (!geoCache.has(k)) geoCache.set(k, R.geometry(boxData(w, h, d, uvs))); return geoCache.get(k); };
  const plane = (w, h, u = 1, v = 1) => { const k = `p${w}|${h}|${u}|${v}`; if (!geoCache.has(k)) geoCache.set(k, R.geometry(planeData(w, h, u, v))); return geoCache.get(k); };

  const picks = [];                       // interactive things
  const tex = {
    floor: R.texture(parquetTexture(), { repeat: true }),
    plaster: R.texture(plasterTexture(), { repeat: true }),
    glow: R.texture(radialTexture([[0, 'rgba(255,255,255,1)'], [0.45, 'rgba(255,255,255,0.35)'], [1, 'rgba(255,255,255,0)']])),
    shade: R.texture(radialTexture([[0, 'rgba(0,0,0,0.65)'], [0.6, 'rgba(0,0,0,0.25)'], [1, 'rgba(0,0,0,0)']]))
  };

  R.ambient = [0.17, 0.16, 0.15];
  R.clear = [0.02, 0.02, 0.025];

  /* ---------- room shell ---------- */
  const WALL = rgb('#cfc6b6'), TRIM = rgb('#bdb4a4');
  R.add({ geo: plane(ROOM.w, ROOM.d, ROOM.w / 2.2, ROOM.d / 2.2), tex: tex.floor, model: m4.xf(['rx', -Math.PI / 2]), spec: 0.55 });          // floor
  R.add({ geo: plane(ROOM.w, ROOM.d), model: m4.xf(['t', 0, ROOM.h, 0], ['rx', Math.PI / 2]), color: rgb('#d8d3c8') });                         // ceiling
  const wall = (w, h, d, x, y, z) => R.add({ geo: box(w, h, d, 0.5), tex: tex.plaster, model: m4.t(x, y, z), color: WALL });
  wall(ROOM.w + 0.4, ROOM.h, 0.2, 0, ROOM.h / 2, -ROOM.d / 2 - 0.1);        // north
  wall(0.2, ROOM.h, ROOM.d, -ROOM.w / 2 - 0.1, ROOM.h / 2, 0);              // west
  wall(0.2, ROOM.h, ROOM.d, ROOM.w / 2 + 0.1, ROOM.h / 2, 0);               // east
  const doorW = 1.7, doorH = 2.5, sideW = (ROOM.w - doorW) / 2;
  wall(sideW, ROOM.h, 0.2, -(doorW / 2 + sideW / 2), ROOM.h / 2, ROOM.d / 2 + 0.1);   // south left
  wall(sideW, ROOM.h, 0.2, (doorW / 2 + sideW / 2), ROOM.h / 2, ROOM.d / 2 + 0.1);    // south right
  wall(doorW, ROOM.h - doorH, 0.2, 0, doorH + (ROOM.h - doorH) / 2, ROOM.d / 2 + 0.1); // lintel
  R.add({ geo: plane(doorW + 4, doorH + 2), model: m4.t(0, doorH / 2, ROOM.d / 2 + 1.2), color: rgb('#fff2d6'), emis: 1.6 });   // bright outside
  // door frame
  const DF = rgb('#cfc7b8');
  R.add({ geo: box(0.08, doorH, 0.26), model: m4.t(-doorW / 2 - 0.04, doorH / 2, ROOM.d / 2 + 0.1), color: DF });
  R.add({ geo: box(0.08, doorH, 0.26), model: m4.t(doorW / 2 + 0.04, doorH / 2, ROOM.d / 2 + 0.1), color: DF });
  // skirting
  const skirt = (w, d, x, z) => R.add({ geo: box(w, 0.12, d), model: m4.t(x, 0.06, z), color: TRIM });
  skirt(ROOM.w, 0.03, 0, -ROOM.d / 2 + 0.015);
  skirt(0.03, ROOM.d, -ROOM.w / 2 + 0.015, 0); skirt(0.03, ROOM.d, ROOM.w / 2 - 0.015, 0);
  skirt(sideW, 0.03, -(doorW / 2 + sideW / 2), ROOM.d / 2 - 0.015); skirt(sideW, 0.03, (doorW / 2 + sideW / 2), ROOM.d / 2 - 0.015);

  /* ---------- ceiling lights ---------- */
  const lightPos = [];
  for (const z of [-1.9, 1.5]) for (const x of [-3, 0, 3]) {
    R.add({ geo: box(1.4, 0.04, 0.12), model: m4.t(x, ROOM.h - 0.03, z), color: [1, 0.95, 0.85, 1], emis: 3 });
    lightPos.push([x, ROOM.h - 0.5, z]);
  }
  lightPos.forEach((p) => R.lights.push({ pos: p, color: [0.38, 0.34, 0.28] }));
  R.lights.push({ pos: [-4.0, 2.7, 2.4], color: [0.45, 0.38, 0.28] });   // over the stand
  R.lights.push({ pos: [4.0, 2.7, 2.4], color: [0.35, 0.38, 0.45] });    // near the screen

  /* ---------- title wall graphic ---------- */
  {
    const c = canvas(2048, 480), g = c.getContext('2d');
    g.textAlign = 'center'; g.fillStyle = '#2b2623';
    g.font = '300 150px "Times New Roman", Georgia, serif'; g.fillText('REPRESENTING PERSIA', 1024, 190);
    g.font = 'italic 80px Georgia, "Times New Roman", serif'; g.fillStyle = '#7a1f2b'; g.fillText('The Qajars', 1024, 310);
    g.font = '34px Arial, sans-serif'; g.fillStyle = '#6b645d'; g.fillText('A MICROMUSEUM OF THE INHA PHOTOGRAPHIC COLLECTION  ·  DIEULAFOY ALBUMS', 1024, 400);
    R.add({ geo: plane(6.4, 1.5), tex: R.texture(c), model: m4.t(0, 3.0, -ROOM.d / 2 + 0.012), blend: 'alpha', emis: 0.4 });
  }

  /* ---------- photographs ---------- */
  const walls = {
    north: { origin: (s) => [-3.75 + s * 1.5, PHOTO_Y, -ROOM.d / 2], ry: 0 },
    west:  { origin: (s) => [-ROOM.w / 2, PHOTO_Y, -2.7 + s * 1.5], ry: Math.PI / 2 },
    east:  { origin: (s) => [ROOM.w / 2, PHOTO_Y, -2.7 + s * 1.5], ry: -Math.PI / 2 }
  };
  const layout = [['north', 0], ['north', 1], ['north', 2], ['north', 3], ['north', 4], ['north', 5],
                  ['west', 0], ['west', 1], ['west', 2], ['east', 0], ['east', 1], ['east', 2]];

  data.photos.forEach((p, i) => {
    const img = imgs[i], a = img.width / img.height;
    const w = a >= 1 ? 1.2 : 1.25 * a, h = a >= 1 ? 1.2 / a : 1.25;
    const [wx, wy, wz] = walls[layout[i][0]].origin(layout[i][1]), ry = walls[layout[i][0]].ry;
    const place = (lx, ly, lz) => m4.xf(['t', wx, wy, wz], ['ry', ry], ['t', lx, ly, lz]);
    R.add({ geo: plane(w + 1.0, h + 1.2), tex: tex.glow, model: place(0, 0.1, 0.006), color: [1, 0.86, 0.6, 0.3], blend: 'add' });
    R.add({ geo: box(w + 0.14, h + 0.14, 0.06), model: place(0, 0, 0.03), color: rgb('#3a2a1f'), spec: 0.25 });
    R.add({ geo: plane(w + 0.08, h + 0.08), model: place(0, 0, 0.061), color: rgb('#f6f3ec') });
    const photo = R.add({ geo: plane(w, h), tex: R.texture(img), model: place(0, 0, 0.0625), emis: 0.62 });
    // plaque
    const pc = canvas(768, 192), g = pc.getContext('2d');
    g.fillStyle = '#f5f2ea'; g.fillRect(0, 0, 768, 192);
    g.fillStyle = '#7a1f2b'; g.font = 'bold 72px Georgia, serif'; g.fillText(String(i + 1).padStart(2, '0'), 24, 112);
    g.fillStyle = '#2b2623'; g.font = '46px Georgia, serif'; wrapText(g, p.title, 150, 82, 600, 52, 2);
    R.add({ geo: plane(1.12, 0.28), tex: R.texture(pc), model: place(0, -(h / 2) - 0.3, 0.012), emis: 0.5 });
    // pick area
    const n = [Math.sin(ry), 0, Math.cos(ry)], right = [Math.cos(ry), 0, -Math.sin(ry)];
    picks.push({ kind: 'quad', type: 'photo', index: i, label: `Photograph ${i + 1}: ${p.title}`, c: [wx + n[0] * 0.07, wy, wz + n[2] * 0.07], n, r: right, u: [0, 1, 0], hw: (w + 0.14) / 2, hh: (h + 0.14) / 2 });
  });

  /* ---------- bench ---------- */
  {
    const leather = rgb('#2d2623');
    R.add({ geo: box(1.9, 0.09, 0.55), model: m4.t(0, 0.46, 0.2), color: leather, spec: 0.3 });
    R.add({ geo: box(0.07, 0.42, 0.45), model: m4.t(-0.8, 0.21, 0.2), color: rgb('#1d1a18') });
    R.add({ geo: box(0.07, 0.42, 0.45), model: m4.t(0.8, 0.21, 0.2), color: rgb('#1d1a18') });
    R.add({ geo: plane(2.8, 1.3), tex: tex.shade, model: m4.xf(['t', 0, 0.004, 0.2], ['rx', -Math.PI / 2]), blend: 'alpha' });
  }

  /* ---------- the stand with Jane Dieulafoy's biography ---------- */
  const STAND = { x: -4.15, z: 2.4 };
  {
    const stone = rgb('#ece8e0');
    R.add({ geo: box(0.5, 0.96, 0.8), model: m4.t(STAND.x, 0.48, STAND.z), color: stone, spec: 0.15 });
    R.add({ geo: box(0.58, 0.05, 0.9), model: m4.t(STAND.x, 0.025, STAND.z), color: rgb('#bdb6a8') });
    const tilt = -25 * Math.PI / 180, top = [STAND.x, 1.0, STAND.z];
    R.add({ geo: box(0.58, 0.04, 0.86), model: m4.xf(['t', ...top], ['rz', tilt]), color: rgb('#2f2a27'), spec: 0.3 });
    // text on the sloped top
    const c = canvas(1180, 800), g = c.getContext('2d');
    g.fillStyle = '#f6f2ea'; g.fillRect(0, 0, 1180, 800);
    g.fillStyle = '#7a1f2b'; g.font = 'bold 40px Arial, sans-serif'; g.fillText('BIOGRAPHY', 60, 80);
    g.fillStyle = '#2b2623'; g.font = 'bold 96px Georgia, serif'; g.fillText(BIO.title, 60, 190);
    g.fillStyle = '#6b645d'; g.font = 'italic 52px Georgia, serif'; g.fillText(BIO.dates, 60, 258);
    g.fillStyle = '#2b2623'; g.font = '44px Georgia, serif'; wrapText(g, BIO.short, 60, 350, 1060, 58, 5);
    g.fillStyle = '#7a1f2b'; g.font = 'bold 40px Arial, sans-serif'; g.fillText('Click to read the full biography  ›', 60, 735);
    const tn = [Math.sin(-tilt), Math.cos(tilt), 0];       // surface normal after tilt
    const cp = [top[0] + tn[0] * 0.023, top[1] + tn[1] * 0.023, top[2] + tn[2] * 0.023];
    const model = m4.xf(['t', ...cp], ['rz', tilt], ['ry', Math.PI / 2], ['rx', -Math.PI / 2]);
    R.add({ geo: plane(0.8, 0.5436), tex: R.texture(c), model, emis: 0.55 });
    R.add({ geo: plane(1.6, 1.9), tex: tex.shade, model: m4.xf(['t', STAND.x, 0.004, STAND.z], ['rx', -Math.PI / 2]), blend: 'alpha' });
    picks.push({ kind: 'aabb', type: 'bio', label: 'Biography of Jane Dieulafoy', min: [STAND.x - 0.35, 0, STAND.z - 0.5], max: [STAND.x + 0.35, 1.15, STAND.z + 0.5] });
    // wall caption behind the stand
    const wc = canvas(1400, 760), w2 = wc.getContext('2d');
    w2.fillStyle = '#2b2623'; w2.font = '300 150px "Times New Roman", Georgia, serif'; w2.fillText('Jane Dieulafoy', 60, 230);
    w2.fillStyle = '#7a1f2b'; w2.font = 'italic 76px Georgia, serif'; w2.fillText('1851 – 1916', 60, 340);
    w2.fillStyle = '#6b645d'; w2.font = '46px Arial, sans-serif';
    w2.fillText('Photographer  ·  Archaeologist  ·  Writer', 60, 450);
    w2.fillText('Read her biography on the stand.', 60, 530);
    R.add({ geo: plane(1.7, 0.92), tex: R.texture(wc), model: m4.xf(['t', -ROOM.w / 2 + 0.012, 1.85, STAND.z], ['ry', Math.PI / 2]), blend: 'alpha', emis: 0.4 });
  }

  /* ---------- touch screen showing the INHA photo archive ---------- */
  const SCREEN = { x: ROOM.w / 2, z: 2.4, y: 1.45, w: 1.7, h: 1.0 };
  let screenTex, screenCanvas;
  {
    screenCanvas = canvas(1360, 800);
    drawScreen(screenCanvas, imgs, data.photos);
    screenTex = R.texture(screenCanvas);
    const place = (lx, ly, lz) => m4.xf(['t', SCREEN.x, SCREEN.y, SCREEN.z], ['ry', -Math.PI / 2], ['t', lx, ly, lz]);
    R.add({ geo: plane(SCREEN.w + 1.4, SCREEN.h + 1.4), tex: tex.glow, model: place(0, 0, 0.006), color: [0.55, 0.7, 1, 0.22], blend: 'add' });
    R.add({ geo: box(SCREEN.w + 0.1, SCREEN.h + 0.1, 0.07), model: place(0, 0, 0.035), color: rgb('#16181b'), spec: 0.4 });
    R.add({ geo: plane(SCREEN.w, SCREEN.h), tex: screenTex, model: place(0, 0, 0.0715), emis: 0.95 });
    const sc = canvas(1024, 160), g = sc.getContext('2d');
    g.fillStyle = '#f5f2ea'; g.fillRect(0, 0, 1024, 160);
    g.fillStyle = '#7a1f2b'; g.font = 'bold 52px Georgia, serif'; g.fillText('Touch screen', 30, 70);
    g.fillStyle = '#2b2623'; g.font = '36px Georgia, serif'; g.fillText('INHA photographic archive: click to explore', 30, 124);
    R.add({ geo: plane(1.2, 0.1875), tex: R.texture(sc), model: place(0, -SCREEN.h / 2 - 0.22, 0.012), emis: 0.5 });
    picks.push({ kind: 'quad', type: 'screen', label: 'Touch screen: INHA photographic archive', c: [SCREEN.x - 0.08, SCREEN.y, SCREEN.z], n: [-1, 0, 0], r: [0, 0, 1], u: [0, 1, 0], hw: SCREEN.w / 2, hh: SCREEN.h / 2 });
  }

  /* ---------- camera + controls ---------- */
  const cam = { pos: [0, 1.62, 3.0], yaw: 0, pitch: -0.02, fov: 68 * Math.PI / 180 };
  const stops = {
    entrance: { pos: [0, 1.62, 3.1], yaw: 0, pitch: -0.02 },
    north:    { pos: [0, 1.62, -0.9], yaw: 0, pitch: 0.02 },
    west:     { pos: [-2.2, 1.62, -0.6], yaw: Math.PI / 2, pitch: 0.0 },
    east:     { pos: [2.2, 1.62, -0.6], yaw: -Math.PI / 2, pitch: 0.0 },
    bio:      { pos: [-2.55, 1.62, 2.4], yaw: Math.PI / 2, pitch: -0.18 },
    screen:   { pos: [2.55, 1.62, 2.4], yaw: -Math.PI / 2, pitch: -0.04 }
  };
  let tween = null;
  const goTo = (name) => {
    const s = stops[name]; if (!s) return;
    let dy = s.yaw - cam.yaw; while (dy > Math.PI) dy -= 2 * Math.PI; while (dy < -Math.PI) dy += 2 * Math.PI;
    tween = { t: 0, dur: 1.4, from: { pos: [...cam.pos], yaw: cam.yaw, pitch: cam.pitch }, to: { pos: s.pos, yaw: cam.yaw + dy, pitch: s.pitch } };
    document.querySelectorAll('#tour button').forEach(b => b.classList.toggle('on', b.dataset.go === name));
  };
  document.querySelectorAll('#tour button').forEach(b => b.addEventListener('click', () => goTo(b.dataset.go)));

  // collision (room bounds + two obstacles)
  const obstacles = [{ min: [-1.25, -0.3], max: [1.25, 0.75] }, { min: [STAND.x - 0.6, STAND.z - 0.75], max: [STAND.x + 0.6, STAND.z + 0.75] }];
  const bounds = { x: ROOM.w / 2 - 0.45, zMin: -ROOM.d / 2 + 0.55, zMax: ROOM.d / 2 - 0.45 };
  const blocked = (x, z) => x < -bounds.x || x > bounds.x || z < bounds.zMin || z > bounds.zMax ||
    obstacles.some(o => x > o.min[0] && x < o.max[0] && z > o.min[1] && z < o.max[1]);
  const tryMove = (dx, dz) => {
    if (!blocked(cam.pos[0] + dx, cam.pos[2])) cam.pos[0] += dx;
    if (!blocked(cam.pos[0], cam.pos[2] + dz)) cam.pos[2] += dz;
  };

  const keys = new Set(); const hold = new Set();
  addEventListener('keydown', (e) => {
    if (document.body.classList.contains('modal')) { if (e.key === 'Escape') closeModals(); return; }
    keys.add(e.key.toLowerCase());
    if (e.key >= '1' && e.key <= '6') goTo(['entrance', 'north', 'west', 'east', 'bio', 'screen'][+e.key - 1]);
  });
  addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  addEventListener('blur', () => keys.clear());
  document.querySelectorAll('#pad button').forEach(b => {
    const on = (e) => { e.preventDefault(); hold.add(b.dataset.k); }, off = () => hold.delete(b.dataset.k);
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
  });

  // pointer: drag to look, click to interact
  const cv = R.canvas; let drag = null;
  cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: 0 }; tween = null; });
  cv.addEventListener('pointermove', (e) => {
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      cam.yaw += dx * 0.0042 * (cam.fov / 1.19); cam.pitch = Math.max(-1.2, Math.min(1.2, cam.pitch + dy * 0.0042 * (cam.fov / 1.19)));
    } else hover(e);
  });
  cv.addEventListener('pointerup', (e) => { const wasClick = drag && drag.moved < 6; drag = null; if (wasClick) activate(pickAt(e)); });
  const FOV_MIN = 44 * Math.PI / 180, FOV_MAX = 80 * Math.PI / 180;
  cv.addEventListener('wheel', (e) => { e.preventDefault(); cam.fov = Math.max(FOV_MIN, Math.min(FOV_MAX, cam.fov * (1 + e.deltaY * 0.0008))); }, { passive: false });

  // picking
  function rayFrom(e) {
    const r = cv.getBoundingClientRect(), aspect = r.width / r.height;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    const t = Math.tan(cam.fov / 2);
    let d = [nx * t * aspect, ny * t, -1];
    // rotate by pitch (x) then yaw (y)
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    d = [d[0], d[1] * cp - d[2] * sp, d[1] * sp + d[2] * cp];
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    d = [d[0] * cy + d[2] * sy, d[1], -d[0] * sy + d[2] * cy];
    const l = Math.hypot(...d); return { o: cam.pos, d: d.map(v => v / l) };
  }
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function hit(p, ray) {
    if (p.kind === 'quad') {
      const dn = dot(ray.d, p.n); if (dn >= -1e-4) return Infinity;
      const t = dot([p.c[0] - ray.o[0], p.c[1] - ray.o[1], p.c[2] - ray.o[2]], p.n) / dn; if (t < 0) return Infinity;
      const q = [ray.o[0] + ray.d[0] * t - p.c[0], ray.o[1] + ray.d[1] * t - p.c[1], ray.o[2] + ray.d[2] * t - p.c[2]];
      return (Math.abs(dot(q, p.r)) <= p.hw && Math.abs(dot(q, p.u)) <= p.hh) ? t : Infinity;
    }
    let t0 = 0, t1 = Infinity;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(ray.d[a]) < 1e-8) { if (ray.o[a] < p.min[a] || ray.o[a] > p.max[a]) return Infinity; continue; }
      let ta = (p.min[a] - ray.o[a]) / ray.d[a], tb = (p.max[a] - ray.o[a]) / ray.d[a];
      if (ta > tb) [ta, tb] = [tb, ta];
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb); if (t0 > t1) return Infinity;
    }
    return t0;
  }
  function pickAt(e) {
    const ray = rayFrom(e); let best = null, bt = 9;
    for (const p of picks) { const t = hit(p, ray); if (t < bt) { bt = t; best = p; } }
    return best;
  }
  const tip = $('#tip');
  function hover(e) {
    const p = pickAt(e);
    cv.style.cursor = p ? 'pointer' : 'grab';
    if (p) { tip.textContent = p.label; tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = (e.clientY + 14) + 'px'; tip.hidden = false; } else tip.hidden = true;
  }

  /* ---------- modals ---------- */
  let current = 0;
  const photos = data.photos;
  function closeModals() { document.querySelectorAll('.modal-box').forEach(m => m.hidden = true); $('#veil').hidden = true; document.body.classList.remove('modal'); }
  function openModal(id) { closeModals(); $('#' + id).hidden = false; $('#veil').hidden = false; document.body.classList.add('modal'); $('#' + id).querySelector('.close').focus(); }
  function showPhoto(i) {
    current = (i + photos.length) % photos.length; const p = photos[current];
    $('#pm-img').src = 'assets/photos/' + p.file; $('#pm-img').alt = p.title;
    $('#pm-title').textContent = p.title; $('#pm-cap').textContent = p.caption;
    $('#pm-credit').textContent = `Photograph ${current + 1} of ${photos.length}  ·  ${p.credit}`;
    openModal('photoModal');
  }
  function showBio() {
    $('#bio-title').textContent = BIO.title; $('#bio-dates').textContent = BIO.dates;
    $('#bio-text').innerHTML = BIO.paras.map(t => `<p>${t}</p>`).join('');
    $('#bio-src').textContent = BIO.source; openModal('bioModal');
  }
  function showScreen() {
    const grid = $('#sc-grid'); grid.innerHTML = '';
    photos.forEach((p, i) => {
      const b = document.createElement('button'); b.className = 'thumb'; b.dataset.i = i; b.dataset.text = (p.title + ' ' + p.caption).toLowerCase();
      b.innerHTML = `<img src="assets/photos/${p.file}" alt="${p.title}" loading="lazy"><span>${p.title}</span>`;
      b.addEventListener('click', () => showPhoto(i)); grid.appendChild(b);
    });
    $('#sc-q').value = ''; $('#sc-link').href = data.museum.archiveUrl; openModal('screenModal');
  }
  $('#sc-q').addEventListener('input', (e) => { const q = e.target.value.trim().toLowerCase(); document.querySelectorAll('#sc-grid .thumb').forEach(b => b.hidden = q && !b.dataset.text.includes(q)); });
  $('#pm-prev').addEventListener('click', () => showPhoto(current - 1));
  $('#pm-next').addEventListener('click', () => showPhoto(current + 1));
  document.querySelectorAll('.close').forEach(b => b.addEventListener('click', closeModals));
  $('#veil').addEventListener('click', closeModals);
  addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('modal') || $('#photoModal').hidden) return;
    if (e.key === 'ArrowLeft') showPhoto(current - 1); if (e.key === 'ArrowRight') showPhoto(current + 1);
  });
  function activate(p) {
    if (!p) return;
    if (p.type === 'photo') showPhoto(p.index); else if (p.type === 'bio') showBio(); else if (p.type === 'screen') showScreen();
  }
  $('#help-btn').addEventListener('click', () => { $('#help').hidden = !$('#help').hidden; });
  $('#start').addEventListener('click', () => { $('#intro').hidden = true; goTo('north'); });

  /* ---------- main loop ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (tween) {
      tween.t += dt / tween.dur; const k = Math.min(1, tween.t), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      cam.pos = tween.from.pos.map((v, i) => v + (tween.to.pos[i] - v) * e);
      cam.yaw = tween.from.yaw + (tween.to.yaw - tween.from.yaw) * e; cam.pitch = tween.from.pitch + (tween.to.pitch - tween.from.pitch) * e;
      if (k >= 1) tween = null;
    }
    const down = (k) => keys.has(k) || hold.has(k);
    const fwd = (down('w') || down('arrowup') ? 1 : 0) - (down('s') || down('arrowdown') ? 1 : 0);
    const str = (down('d') ? 1 : 0) - (down('a') ? 1 : 0);
    const turn = (down('arrowleft') || down('q') ? 1 : 0) - (down('arrowright') || down('e') ? 1 : 0);
    if (fwd || str || turn) tween = null;
    cam.yaw += turn * 1.6 * dt;
    if (fwd || str) {
      const sp = 2.0 * dt, fx = -Math.sin(cam.yaw), fz = -Math.cos(cam.yaw), rx = Math.cos(cam.yaw), rz = -Math.sin(cam.yaw);
      tryMove((fx * fwd + rx * str) * sp, (fz * fwd + rz * str) * sp);
    }
    R.render(cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  $('#loading').hidden = true;
  $('#intro').hidden = false;
  // test hooks (also handy for debugging in the console)
  window.__museum = { cam, goTo, showPhoto, showBio, showScreen, picks };
}

/* ---------- the touch screen UI, drawn on a canvas ---------- */
function drawScreen(c, imgs, photos) {
  const g = c.getContext('2d'), W = c.width, H = c.height;
  g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1d1d1f'; g.fillRect(0, 0, W, 110);
  g.fillStyle = '#ffffff'; g.font = 'bold 54px Georgia, serif'; g.fillText('INHA', 40, 72);
  g.font = '26px Arial, sans-serif'; g.fillStyle = '#d6d2cb';
  g.fillText('Institut national d’histoire de l’art', 190, 52); g.fillText('Bibliothèque numérique  ›  Archives photographiques', 190, 88);
  g.fillStyle = '#ffffff'; g.fillRect(40, 134, W - 80, 62);
  g.strokeStyle = '#c9c4ba'; g.lineWidth = 2; g.strokeRect(40, 134, W - 80, 62);
  g.fillStyle = '#7b756c'; g.font = '28px Arial, sans-serif'; g.fillText('Search the Dieulafoy albums  (NUM 4 PHOT 018)…', 64, 175);
  g.fillStyle = '#7a1f2b'; g.fillRect(W - 220, 134, 180, 62); g.fillStyle = '#fff'; g.font = 'bold 28px Arial, sans-serif'; g.fillText('SEARCH', W - 190, 175);
  const cols = 6, rows = 2, gap = 18, gx = 40, gy = 226, cw = (W - 80 - gap * (cols - 1)) / cols, ch = 255;
  imgs.forEach((im, i) => {
    const col = i % cols, row = Math.floor(i / cols), x = gx + col * (cw + gap), y = gy + row * (ch + 62 + gap);
    g.save(); g.beginPath(); g.rect(x, y, cw, ch); g.clip();
    const s = Math.max(cw / im.width, ch / im.height), dw = im.width * s, dh = im.height * s;
    g.drawImage(im, x + (cw - dw) / 2, y + (ch - dh) * 0.25, dw, dh); g.restore();
    g.fillStyle = '#2b2623'; g.font = '21px Arial, sans-serif';
    wrapText(g, photos[i].title, x, y + ch + 26, cw, 25, 2);
  });
  g.fillStyle = '#7b756c'; g.font = '24px Arial, sans-serif';
  g.fillText('Tap the screen to browse the photographs and open the INHA digital library', 40, H - 22);
}

boot().catch((e) => { console.error(e); const l = document.querySelector('#loading'); if (l) l.innerHTML = '<p>Something went wrong while loading the room.</p>'; });

// A Persian carpet on the floor in the middle of the room, drawn procedurally (no image file).
// Medallion field, spandrels, three-band border, short fringes at both ends.
import * as THREE from 'three';
import { makeCanvas, rng } from './textures.js';

const BODY_W = 1.5, BODY_L = 2.4, FRINGE = 0.09;

const C = { red: '#7b1d1a', deep: '#5a1210', navy: '#16294a', ivory: '#e8dcc0', gold: '#c9973a', teal: '#2c6a6b', rose: '#b24a3c' };

function carpetCanvas() {
  const PX = 700, // pixels per metre
    W = Math.round(BODY_W * PX), L = Math.round(BODY_L * PX), F = Math.round(FRINGE * PX);
  const c = makeCanvas(W, L + 2 * F), g = c.getContext('2d'), r = rng(31);
  g.clearRect(0, 0, c.width, c.height);

  // fringe: warp threads sticking out of both ends
  g.strokeStyle = '#e9e0cc';
  g.lineWidth = 3;
  for (let x = 4; x < W; x += 7) {
    for (const [y0, y1] of [[F, 0], [F + L, L + 2 * F]]) {
      g.beginPath();
      g.moveTo(x, y0);
      g.quadraticCurveTo(x + (r() - 0.5) * 12, (y0 + y1) / 2, x + (r() - 0.5) * 16, y1 - Math.sign(y1 - y0) * r() * 8);
      g.stroke();
    }
  }
  g.translate(0, F);

  const rect = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  rect(0, 0, W, L, C.navy);
  // border bands (outer to inner)
  const b1 = 18, b2 = 120, b3 = 14; // guard, main band, inner guard
  rect(b1 * 0.5, b1 * 0.5, W - b1, L - b1, C.ivory);
  rect(b1, b1, W - 2 * b1, L - 2 * b1, C.navy);
  const mx = b1, my = b1;
  const fx = mx + b2, fy = my + b2; // field origin
  const fw = W - 2 * fx, fl = L - 2 * fy;

  // main border: dark red with a running rosette and leaf pattern
  rect(mx + 6, my + 6, W - 2 * mx - 12, L - 2 * my - 12, C.deep);
  const rosette = (x, y, rad, a, b) => {
    g.fillStyle = a; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * Math.PI * 2;
      g.fillStyle = b; g.beginPath(); g.ellipse(x + Math.cos(t) * rad * 0.55, y + Math.sin(t) * rad * 0.55, rad * 0.32, rad * 0.16, t, 0, 7); g.fill();
    }
    g.fillStyle = C.gold; g.beginPath(); g.arc(x, y, rad * 0.2, 0, 7); g.fill();
  };
  const leaf = (x, y, len, ang, col) => {
    g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col;
    g.beginPath(); g.moveTo(-len / 2, 0); g.quadraticCurveTo(0, -len * 0.3, len / 2, 0); g.quadraticCurveTo(0, len * 0.3, -len / 2, 0); g.fill(); g.restore();
  };
  const step = 64, half = (b2 - 12) / 2;
  const cx0 = mx + 6 + half + 3, cy0 = my + 6 + half + 3;
  for (let x = cx0; x < W - mx - 10; x += step) {
    rosette(x, cy0, 21, C.ivory, C.teal); rosette(x, L - cy0, 21, C.ivory, C.teal);
    leaf(x + step / 2, cy0, 30, 0.6, C.gold); leaf(x + step / 2, L - cy0, 30, -0.6, C.gold);
  }
  for (let y = cy0; y < L - my - 10; y += step) {
    rosette(cx0, y, 21, C.ivory, C.teal); rosette(W - cx0, y, 21, C.ivory, C.teal);
    leaf(cx0, y + step / 2, 30, 1.0, C.gold); leaf(W - cx0, y + step / 2, 30, -1.0, C.gold);
  }
  // inner guard stripes
  g.strokeStyle = C.ivory; g.lineWidth = 4; g.strokeRect(fx - b3, fy - b3, fw + 2 * b3, fl + 2 * b3);
  g.strokeStyle = C.gold; g.lineWidth = 3; g.strokeRect(fx - b3 + 8, fy - b3 + 8, fw + 2 * b3 - 16, fl + 2 * b3 - 16);

  // field
  rect(fx, fy, fw, fl, C.red);
  g.save(); g.beginPath(); g.rect(fx, fy, fw, fl); g.clip();
  // fine lattice of small flowers and vines
  for (let y = fy - 20, row = 0; y < fy + fl + 40; y += 56, row++) {
    for (let x = fx - 20 + (row % 2) * 30; x < fx + fw + 40; x += 60) {
      g.strokeStyle = 'rgba(232,220,192,0.22)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 25, y - 22, x + 35, y + 20, x + 60, y + 6); g.stroke();
      rosette(x + 30, y + 28, 9, row % 2 ? C.ivory : C.gold, row % 2 ? C.navy : C.teal);
      leaf(x + 10, y + 12, 18, 0.9, C.navy);
    }
  }
  const mcx = fx + fw / 2, mcy = fy + fl / 2;
  // corner spandrels
  [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fl, 1, -1], [fx + fw, fy + fl, -1, -1]].forEach(([x, y, sx, sy]) => {
    g.fillStyle = C.navy; g.beginPath(); g.moveTo(x, y); g.lineTo(x + sx * 210, y); g.quadraticCurveTo(x + sx * 90, y + sy * 90, x, y + sy * 270); g.fill();
    g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.moveTo(x + sx * 195, y); g.quadraticCurveTo(x + sx * 85, y + sy * 85, x, y + sy * 252); g.stroke();
    rosette(x + sx * 62, y + sy * 62, 22, C.ivory, C.rose);
  });
  // central medallion: nested lobed lozenges with pendants
  const lozenge = (rx, ry, col) => {
    g.fillStyle = col; g.beginPath();
    g.moveTo(mcx, mcy - ry);
    g.quadraticCurveTo(mcx + rx * 0.35, mcy - ry * 0.35, mcx + rx, mcy);
    g.quadraticCurveTo(mcx + rx * 0.35, mcy + ry * 0.35, mcx, mcy + ry);
    g.quadraticCurveTo(mcx - rx * 0.35, mcy + ry * 0.35, mcx - rx, mcy);
    g.quadraticCurveTo(mcx - rx * 0.35, mcy - ry * 0.35, mcx, mcy - ry);
    g.fill();
  };
  const pend = (dir) => { // pendants at the long ends
    for (let k = 0; k < 3; k++) { const yy = mcy + dir * (fl * 0.34 + k * 52); leaf(mcx, yy, 70 - k * 14, Math.PI / 2, k % 2 ? C.gold : C.ivory); }
  };
  pend(-1); pend(1);
  lozenge(fw * 0.47, fl * 0.3, C.gold);
  lozenge(fw * 0.44, fl * 0.28, C.navy);
  lozenge(fw * 0.36, fl * 0.22, C.ivory);
  lozenge(fw * 0.33, fl * 0.2, C.teal);
  lozenge(fw * 0.25, fl * 0.14, C.deep);
  for (let k = 0; k < 12; k++) {
    const t = (k / 12) * Math.PI * 2;
    leaf(mcx + Math.cos(t) * fw * 0.17, mcy + Math.sin(t) * fl * 0.095, 34, t + Math.PI / 2, k % 2 ? C.gold : C.ivory);
  }
  rosette(mcx, mcy, 38, C.gold, C.navy);
  g.restore();

  // woven texture: pile noise and a soft worn vignette
  const d = g.getImageData(0, 0, c.width, c.height), px = d.data, n = rng(5);
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    const v = (n() - 0.5) * 26;
    px[i] += v; px[i + 1] += v; px[i + 2] += v;
  }
  g.putImageData(d, 0, 0);
  g.strokeStyle = 'rgba(0,0,0,0.07)'; g.lineWidth = 1;
  for (let y = 0; y < L; y += 3) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
  return c;
}

export function buildCarpet(scene, { aniso = 4 } = {}) {
  const tex = new THREE.CanvasTexture(carpetCanvas());
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  const group = new THREE.Group();
  group.name = 'carpet';
  group.position.set(0, 0, 0.1);
  scene.add(group);
  // body: a thin slab so the edge has thickness
  const edge = new THREE.MeshStandardMaterial({ color: 0x4a1210, roughness: 1, envMapIntensity: 0.1 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(BODY_W, 0.012, BODY_L), edge);
  body.position.y = 0.006;
  group.add(body);
  // printed top with the fringes (alpha-tested corners)
  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(BODY_W, BODY_L + 2 * FRINGE),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 1, metalness: 0, envMapIntensity: 0.25, alphaTest: 0.5, transparent: false }),
  );
  top.rotation.x = -Math.PI / 2;
  top.position.y = 0.0125;
  group.add(top);
  return group;
}

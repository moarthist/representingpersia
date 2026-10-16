// A Persian carpet on the floor in the middle of the room, from the photograph in assets/carpet.jpg.
// The rug body is cut out of the photo (CROP, in image pixels); short fringes are drawn at both ends.
import * as THREE from 'three';
import { makeCanvas, rng } from './textures.js';

const SRC = 'assets/carpet.jpg';
const CROP = { x: 3, y: 14, w: 467, h: 621 }; // the rug body inside the photo, without its white margin
const BODY_W = 1.5, BODY_L = BODY_W * (CROP.h / CROP.w), FRINGE = 0.09; // about 1.5 x 2.0 m, clear of the stand and screen

// Canvas with the fringes drawn and the body left for the photo.
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
  // placeholder body until the photo arrives
  g.fillStyle = '#7b1d1a';
  g.fillRect(0, F, W, L);
  return { c, g, W, L, F };
}

export function buildCarpet(scene, { aniso = 4 } = {}) {
  const { c, g, W, L, F } = carpetCanvas();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = aniso;
  const img = new Image();
  img.onload = () => {
    g.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, F, W, L);
    tex.needsUpdate = true;
  };
  img.src = SRC;

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

// The architectural shell: floor, walls, ceiling, door, skirting, track lighting.
// Walls, floor and ceiling are single-sided planes that face INTO the room. Seen from outside
// they disappear, so you can look into the room from above like a section model.
import * as THREE from 'three';
import { ROOM } from './config.js';
import { concreteTexture } from './textures.js';

export function buildRoom(scene, { aniso = 4, slots = [] } = {}) {
  const { W, D, H, wallT } = ROOM;
  const group = new THREE.Group();
  group.name = 'room';
  scene.add(group);
  const blockers = []; // meshes that can block a click (anything solid)

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.96, metalness: 0, envMapIntensity: 0.25 });
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf8f7f4, roughness: 1, envMapIntensity: 0.2, emissive: 0xf4f1ea, emissiveIntensity: 0.4 });
  const floorTex = concreteTexture(aniso);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.42, metalness: 0.05, envMapIntensity: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2c, roughness: 0.85, envMapIntensity: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.8, envMapIntensity: 0.25 });

  const plane = (w, h, mat, pos, rot, name) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.name = name;
    group.add(m);
    blockers.push(m);
    return m;
  };
  plane(W, D, floorMat, [0, 0, 0], [-Math.PI / 2, 0, 0], 'floor');
  plane(W, D, ceilMat, [0, H, 0], [Math.PI / 2, 0, 0], 'ceiling');
  plane(W, H, wallMat, [0, H / 2, -D / 2], [0, 0, 0], 'wall-back');
  plane(W, H, wallMat, [0, H / 2, D / 2], [0, Math.PI, 0], 'wall-front');
  plane(D, H, wallMat, [-W / 2, H / 2, 0], [0, Math.PI / 2, 0], 'wall-left');
  plane(D, H, wallMat, [W / 2, H / 2, 0], [0, -Math.PI / 2, 0], 'wall-right');

  const box = (w, h, d, mat, pos, name) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(...pos);
    if (name) m.name = name;
    group.add(m);
    return m;
  };

  // Floor slab and wall caps, drawn dark like a section cut.
  box(W + 2 * wallT, 0.12, D + 2 * wallT, darkMat, [0, -0.07, 0], 'slab'); // top sits just below the floor plane, so they never z-fight
  box(W + 2 * wallT, 0.04, wallT, darkMat, [0, H + 0.02, -D / 2 - wallT / 2]);
  box(W + 2 * wallT, 0.04, wallT, darkMat, [0, H + 0.02, D / 2 + wallT / 2]);
  box(wallT, 0.04, D, darkMat, [-W / 2 - wallT / 2, H + 0.02, 0]);
  box(wallT, 0.04, D, darkMat, [W / 2 + wallT / 2, H + 0.02, 0]);

  // Skirting.
  const sk = 0.08, st = 0.015;
  box(W, sk, st, trimMat, [0, sk / 2, -D / 2 + st / 2]);
  box(W, sk, st, trimMat, [0, sk / 2, D / 2 - st / 2]);
  box(st, sk, D, trimMat, [-W / 2 + st / 2, sk / 2, 0]);
  box(st, sk, D, trimMat, [W / 2 - st / 2, sk / 2, 0]);

  // Door on the right wall, near the back corner.
  const door = new THREE.Group();
  door.name = 'door';
  door.position.set(W / 2 - 0.01, 0, -2.45);
  door.rotation.y = -Math.PI / 2; // local +z faces into the room
  group.add(door);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xe6e3dc, roughness: 0.75, envMapIntensity: 0.25 });
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    door.add(m);
    return m;
  };
  add(new THREE.BoxGeometry(0.9, 2.08, 0.04), doorMat, 0, 1.04, 0.02);
  add(new THREE.BoxGeometry(0.07, 2.16, 0.06), trimMat, -0.485, 1.08, 0.03);
  add(new THREE.BoxGeometry(0.07, 2.16, 0.06), trimMat, 0.485, 1.08, 0.03);
  add(new THREE.BoxGeometry(1.04, 0.07, 0.06), trimMat, 0, 2.12, 0.03);
  const handle = add(new THREE.CylinderGeometry(0.012, 0.012, 0.13, 10), new THREE.MeshStandardMaterial({ color: 0x9a9da1, metalness: 0.9, roughness: 0.3 }), 0.33, 1.02, 0.07);
  handle.rotation.z = Math.PI / 2;
  door.traverse((o) => o.isMesh && blockers.push(o));

  // ---- Track lighting -------------------------------------------------------------
  const railMat = new THREE.MeshStandardMaterial({ color: 0xf1f1ef, roughness: 0.5, envMapIntensity: 0.3 });
  const fixMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.4, metalness: 0.1, envMapIntensity: 0.4 });
  const lensMat = new THREE.MeshBasicMaterial({ color: 0xfff4dc });
  const railY = H - 0.03;
  const rail = (w, d, x, z) => box(w, 0.035, d, railMat, [x, railY, z]);
  rail(0.04, 4.6, -0.9, 0.3);
  rail(0.04, 4.6, 0.9, 0.3);
  rail(3.4, 0.04, 0, -2.0);

  const spots = [];
  const up = new THREE.Vector3(0, -1, 0);
  const fixture = (pos, target, { intensity = 9, angle = 0.42 } = {}) => {
    const p = new THREE.Vector3(...pos), t = new THREE.Vector3(...target);
    const dir = t.clone().sub(p).normalize();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 8), fixMat);
    stem.position.set(p.x, railY - 0.07, p.z);
    group.add(stem);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.2, 14), fixMat);
    body.position.copy(p).addScaledVector(dir, 0.1);
    body.quaternion.setFromUnitVectors(up, dir);
    group.add(body);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.038, 14), lensMat);
    lens.position.copy(p).addScaledVector(dir, 0.201);
    lens.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    group.add(lens);
    const light = new THREE.SpotLight(0xfff0d8, intensity, 0, angle, 0.65, 2);
    light.position.copy(p).addScaledVector(dir, 0.2);
    light.target.position.copy(t);
    scene.add(light, light.target);
    spots.push(light);
  };
  const fy = railY - 0.12;
  // one beam for each group of frames (slot.light names the group)
  const groups = {};
  slots.forEach((s) => (groups[s.light] = groups[s.light] || []).push(s));
  Object.values(groups).forEach((g) => {
    const wall = g[0].wall;
    const u = g.reduce((a, s) => a + s.u, 0) / g.length, y = g.reduce((a, s) => a + s.y, 0) / g.length;
    const opts = { intensity: 13, angle: 0.74 };
    if (wall === 'back') fixture([u, fy, -2.0], [u, y, -D / 2], opts);
    else if (wall === 'left') fixture([-0.9, fy, u + 0.2], [-W / 2, y, u], opts);
    else fixture([0.9, fy, u + 0.2], [W / 2, y, u], opts);
  });
  // Thomson panel on the left wall
  fixture([-0.9, fy, 2.2], [-W / 2, 1.5, 1.45], { intensity: 9, angle: 0.55 });
  // information stand and kiosk
  fixture([-0.9, fy, 0.9], [-1.15, 1.3, -0.1], { intensity: 7, angle: 0.5 });
  fixture([0.9, fy, 1.5], [1.45, 0.95, 0.9], { intensity: 6, angle: 0.5 });
  fixture([0.9, fy, 2.4], [0.5, 1.6, 3.0], { intensity: 7, angle: 0.55 }); // entrance wall text
  fixture([-0.9, fy, 2.4], [-0.5, 1.6, 3.0], { intensity: 7, angle: 0.55 });

  const hemi = new THREE.HemisphereLight(0xffffff, 0xe6e0d4, 1.25);
  scene.add(hemi);

  return { group, blockers, spots, hemi };
}

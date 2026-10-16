// Information stand (two biographies), interactive kiosk, bench, and the text on the entrance wall.
import * as THREE from 'three';
import { BIOS, EXHIBITION } from './content.js';
import { ROOM } from './config.js';
import { bioPanelCanvas, softShadowTexture, toTexture, wallPanelCanvas, wallTextCanvas, woodTexture } from './textures.js';

export function buildFurniture(scene, { aniso = 4, screenTexture }) {
  const { D } = ROOM;
  const group = new THREE.Group();
  group.name = 'furniture';
  scene.add(group);
  const blockers = [];
  const hotspots = []; // { id, type, meshes[], pin:{pos,normal}, label, setHover }

  const stdMat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0, envMapIntensity: 0.4, ...opts });
  const shadowMat = new THREE.MeshBasicMaterial({ map: softShadowTexture(), transparent: true, opacity: 0.5, depthWrite: false });
  const addShadow = (parent, w, d, x = 0, z = 0, y = 0.003) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(w, d), shadowMat);
    s.rotation.x = -Math.PI / 2;
    s.position.set(x, y, z);
    parent.add(s);
  };

  // ---- Information stand ------------------------------------------------------------
  const stand = new THREE.Group();
  stand.name = 'info-stand';
  stand.position.set(-1.15, 0, -0.1);
  stand.rotation.y = 0.32;
  group.add(stand);
  addShadow(stand, 1.7, 1.3);

  const baseMat = stdMat(0x2e2e30, { roughness: 0.7 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.025, 0.55), baseMat);
  base.position.y = 0.0125;
  stand.add(base);
  const PW = 0.92, PH = 1.7, PT = 0.05;
  const panel = new THREE.Mesh(new THREE.BoxGeometry(PW, PH, PT), stdMat(0xd8d2c4, { roughness: 0.8 }));
  panel.position.y = 0.025 + PH / 2;
  stand.add(panel);
  blockers.push(base, panel);

  const faceW = PW - 0.08, faceH = PH - 0.1;
  const makeFace = (bio, number, side) => {
    const tex = toTexture(bioPanelCanvas(bio, number), { aniso });
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.0, envMapIntensity: 0.2 });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(faceW, faceH), mat);
    m.position.set(0, panel.position.y, side * (PT / 2 + 0.002));
    if (side < 0) m.rotation.y = Math.PI;
    stand.add(m);
    return m;
  };
  const janeFace = makeFace(BIOS.jane, '01', 1);

  stand.updateMatrixWorld(true);
  const worldPoint = (obj, v) => obj.localToWorld(v.clone());
  const worldNormal = (obj, v) => v.clone().transformDirection(obj.matrixWorld);

  const faceHot = (face, id, label, side) => {
    const set = (on) => { face.material.emissiveIntensity = on ? 0.18 : 0; };
    hotspots.push({
      id, type: 'bio', label, meshes: [face], setHover: set,
      pin: { pos: worldPoint(stand, new THREE.Vector3(0, 1.86, side * (PT / 2 + 0.03))), normal: worldNormal(stand, new THREE.Vector3(0, 0, side)) },
    });
  };
  faceHot(janeFace, 'jane', 'Jane Dieulafoy', 1);

  // ---- John Thomson: a text panel on the left wall, next to the stand ---------------------
  const { W } = ROOM;
  const thTex = toTexture(wallPanelCanvas(BIOS.thomson, '02'), { aniso });
  const thMat = new THREE.MeshStandardMaterial({ map: thTex, roughness: 0.9, emissive: 0xffffff, emissiveMap: thTex, emissiveIntensity: 0, envMapIntensity: 0.15 });
  const thPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.0), thMat);
  thPanel.position.set(-W / 2 + 0.006, 1.5, 1.45);
  thPanel.rotation.y = Math.PI / 2;
  group.add(thPanel);
  const thShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.2), shadowMat);
  thShadow.position.set(-W / 2 + 0.003, 1.47, 1.46);
  thShadow.rotation.y = Math.PI / 2;
  group.add(thShadow);
  thPanel.updateMatrixWorld(true);
  hotspots.push({
    id: 'thomson', type: 'bio', label: 'John Thomson', meshes: [thPanel],
    setHover: (on) => { thMat.emissiveIntensity = on ? 0.12 : 0; },
    pin: { pos: new THREE.Vector3(-W / 2 + 0.03, 2.64, 1.45), normal: new THREE.Vector3(1, 0, 0) },
  });

  // ---- Interactive kiosk ------------------------------------------------------------
  const kiosk = new THREE.Group();
  kiosk.name = 'kiosk';
  kiosk.position.set(1.45, 0, 0.9);
  kiosk.rotation.y = -0.5;
  group.add(kiosk);
  addShadow(kiosk, 1.5, 1.3, 0, 0.05);

  const steel = stdMat(0xa9aeb3, { metalness: 0.75, roughness: 0.32, envMapIntensity: 0.9 });
  const darkSteel = stdMat(0x2b2e33, { metalness: 0.4, roughness: 0.5, envMapIntensity: 0.6 });
  const kbase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.7), steel);
  kbase.position.y = 0.0125;
  kiosk.add(kbase);
  const col = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.26), steel);
  col.position.set(0, 0.425, -0.02);
  kiosk.add(col);
  // a slanted head carries the screen
  const head = new THREE.Group();
  head.position.set(0, 0.88, 0.02);
  head.rotation.x = -0.95; // tilt back so the screen faces up and toward the visitor
  kiosk.add(head);
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.58, 0.05), darkSteel);
  head.add(housing);
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.5), screenMat);
  screen.position.z = 0.0265;
  head.add(screen);
  blockers.push(kbase, col, housing);

  kiosk.updateMatrixWorld(true);
  hotspots.push({
    id: 'screen', type: 'screen', label: 'Interactive screen', meshes: [screen, housing],
    setHover: (on) => { screenMat.color.setScalar(on ? 1.18 : 1); },
    pin: { pos: worldPoint(screen, new THREE.Vector3(0, 0.38, 0.05)), normal: worldNormal(screen, new THREE.Vector3(0, 0, 1)) },
  });

  // ---- Bench ------------------------------------------------------------------------
  const wood = woodTexture(aniso, '#7a5232', 11);
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  const woodMat = stdMat(0xffffff, { map: wood, roughness: 0.5 });
  const bench = new THREE.Group();
  bench.position.set(2.0, 0, -0.35);
  group.add(bench);
  addShadow(bench, 0.8, 1.6);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 1.3), woodMat);
  seat.position.y = 0.43;
  bench.add(seat);
  [-0.55, 0.55].forEach((z) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.4, 0.07), woodMat);
    leg.position.set(0, 0.2, z);
    bench.add(leg);
    blockers.push(leg);
  });
  blockers.push(seat);

  // ---- Wall text on the entrance wall ------------------------------------------------
  const wtTex = toTexture(wallTextCanvas(EXHIBITION), { aniso });
  const wtMat = new THREE.MeshStandardMaterial({ map: wtTex, transparent: true, roughness: 1, emissive: 0xffffff, emissiveMap: wtTex, emissiveIntensity: 0, envMapIntensity: 0.1 });
  const wallText = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.4), wtMat);
  wallText.position.set(0, 1.55, D / 2 - 0.004);
  wallText.rotation.y = Math.PI;
  group.add(wallText);
  wallText.updateMatrixWorld(true);
  hotspots.push({
    id: 'intro', type: 'intro', label: 'About the room', meshes: [wallText],
    setHover: (on) => { wtMat.emissiveIntensity = on ? 0.12 : 0; },
    pin: { pos: new THREE.Vector3(0, 2.42, D / 2 - 0.03), normal: new THREE.Vector3(0, 0, -1) },
  });

  return { group, blockers, hotspots, stand, kiosk, screen };
}

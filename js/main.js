// Entry point: renderer, camera, interaction.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VIEWS, ROOM } from './config.js';
import { SLOTS } from './photos.js';
import { buildRoom } from './room.js';
import { buildFrames } from './frames.js';
import { buildCarpet } from './carpet.js';
import { buildFurniture } from './furniture.js';
import { createAttractScreen, ScreenUI } from './screen.js';
import { UI } from './ui.js';

const canvas = document.getElementById('scene');
const stage = document.getElementById('stage');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (err) {
  document.getElementById('fallback').hidden = false;
  document.getElementById('loading').remove();
  throw err;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 0.4;
controls.maxDistance = 16;
controls.maxPolarAngle = Math.PI * 0.499;
controls.rotateSpeed = 0.6;
controls.panSpeed = 0.7;
controls.screenSpacePanning = true;
controls.listenToKeyEvents(window);
controls.keyPanSpeed = 14;

// ---- Build the world ---------------------------------------------------------------
const room = buildRoom(scene, { aniso, slots: SLOTS });
buildCarpet(scene, { aniso });
const attract = createAttractScreen();
const screenTexture = new THREE.CanvasTexture(attract.canvas);
screenTexture.colorSpace = THREE.SRGBColorSpace;
screenTexture.anisotropy = aniso;
const furniture = buildFurniture(scene, { aniso, screenTexture });
const frames = buildFrames(scene, SLOTS, { aniso });

// ---- Interaction registry ----------------------------------------------------------
const hotspots = [...furniture.hotspots];
frames.forEach((f) => {
  const hot = {
    id: `frame-${f.slot.id}`, type: 'frame', label: `Plate ${f.slot.id}`, frame: f,
    meshes: f.meshes, setHover: f.setHover,
  };
  hotspots.push(hot);
  f.meshes.forEach((m) => (m.userData.hot = hot));
});
furniture.hotspots.forEach((h) => h.meshes.forEach((m) => (m.userData.hot = h)));
const pickTargets = [...room.blockers, ...furniture.blockers, ...hotspots.flatMap((h) => h.meshes)];

// ---- UI ----------------------------------------------------------------------------
const screenUI = new ScreenUI(document.getElementById('screen-ui'));
const ui = new UI({
  onView: (id) => goTo(id),
  onOpenScreen: (opener) => openScreen(opener),
});
ui.setPlates(frames);
function openScreen(opener) {
  ui.closeReader();
  ui.closeCard();
  screenUI.open(opener);
}

furniture.hotspots.forEach((h) => {
  ui.addPin({
    id: h.id, label: h.label, pos: h.pin.pos, normal: h.pin.normal,
    activate: (btn) => activate(h, btn),
  });
});

function activate(h, opener) {
  if (h.type === 'bio') ui.openReader(h.id, opener);
  else if (h.type === 'intro') ui.openReader('intro', opener);
  else if (h.type === 'screen') openScreen(opener);
  else if (h.type === 'frame') openFrame(h.frame);
}

// A preview image chosen from the visitor's own disk; it is not saved anywhere.
const fileInput = document.getElementById('preview-file');
let previewTarget = null;
fileInput.addEventListener('change', () => {
  const file = fileInput.files && fileInput.files[0];
  if (!file || !previewTarget) return;
  const url = URL.createObjectURL(file);
  const target = previewTarget;
  target.loadUrl(url).then(() => {
    URL.revokeObjectURL(url);
    openFrame(target);
  });
  fileInput.value = '';
});
function openFrame(f) {
  if (f.slot.title) { ui.openPlate(f, canvas); return; }
  ui.openFrame(f, {
    onPreview: (fr) => { previewTarget = fr; fileInput.click(); },
    onClear: (fr) => fr.setTexture(null),
  });
}

// ---- Camera views --------------------------------------------------------------------
let aspect = 1;
function fovFor(base) {
  // keep the horizontal field of view reasonable on tall (phone) screens
  const ref = 1.35;
  if (aspect >= ref) return base;
  const v = 2 * Math.atan(Math.tan((base * Math.PI) / 360) * (ref / aspect)) * (180 / Math.PI);
  return Math.min(88, v);
}
let tween = null, currentView = 'overview', baseFov = VIEWS.overview.fov;

function goTo(id, instant = false) {
  const v = VIEWS[id];
  if (!v) return;
  currentView = id;
  baseFov = v.fov;
  ui.setActiveView(id);
  const to = { pos: new THREE.Vector3(...v.pos), target: new THREE.Vector3(...v.target), fov: fovFor(v.fov) };
  if (instant || reduceMotion) {
    camera.position.copy(to.pos);
    controls.target.copy(to.target);
    camera.fov = to.fov;
    camera.updateProjectionMatrix();
    controls.update();
    tween = null;
    return;
  }
  tween = {
    t0: performance.now(), dur: 1100,
    from: { pos: camera.position.clone(), target: controls.target.clone(), fov: camera.fov },
    to,
  };
}
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
controls.addEventListener('start', () => { tween = null; });

// ---- Picking -------------------------------------------------------------------------
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hits = ray.intersectObjects(pickTargets, false);
  for (const h of hits) {
    if (h.object.userData.hot) return h.object.userData.hot;
    if (h.object.isMesh) return null; // something solid is in front
  }
  return null;
}

let down = null, hovered = null;
canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
canvas.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  const dt = performance.now() - down.t;
  down = null;
  if (moved > 6 || dt > 500) return;
  const h = pick(e);
  if (h) activate(h, canvas);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || e.buttons) return;
  const h = pick(e);
  if (h === hovered) return;
  if (hovered) hovered.setHover(false);
  hovered = h;
  if (h) h.setHover(true);
  canvas.style.cursor = h ? 'pointer' : '';
});
canvas.addEventListener('pointerleave', () => {
  if (hovered) hovered.setHover(false);
  hovered = null;
  canvas.style.cursor = '';
});

// ---- Size and loop ---------------------------------------------------------------------
function resize() {
  const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight);
  renderer.setSize(w, h, false);
  aspect = w / h;
  camera.aspect = aspect;
  if (!tween) camera.fov = fovFor(baseFov);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

const clock = new THREE.Clock();
const bounds = { x: ROOM.W / 2 + 7, z: ROOM.D / 2 + 7 };
function frame(now) {
  requestAnimationFrame(frame);
  if (tween) {
    const k = Math.min(1, (now - tween.t0) / tween.dur), e = ease(k);
    camera.position.lerpVectors(tween.from.pos, tween.to.pos, e);
    controls.target.lerpVectors(tween.from.target, tween.to.target, e);
    camera.fov = tween.from.fov + (tween.to.fov - tween.from.fov) * e;
    camera.updateProjectionMatrix();
    if (k >= 1) { tween = null; camera.fov = fovFor(baseFov); camera.updateProjectionMatrix(); }
  }
  controls.target.x = THREE.MathUtils.clamp(controls.target.x, -bounds.x, bounds.x);
  controls.target.z = THREE.MathUtils.clamp(controls.target.z, -bounds.z, bounds.z);
  controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, ROOM.H);
  controls.update();
  if (camera.position.y < 0.12) camera.position.y = 0.12;

  if (attract.update(clock.getElapsedTime())) screenTexture.needsUpdate = true;
  renderer.render(scene, camera);
  ui.updatePins(camera, stage.clientWidth, stage.clientHeight);
}

// ---- Start -----------------------------------------------------------------------------
goTo('overview', true);
requestAnimationFrame(frame);
requestAnimationFrame(() => requestAnimationFrame(() => {
  document.getElementById('loading').classList.add('is-done');
  setTimeout(() => document.getElementById('loading')?.remove(), 600);
}));

document.getElementById('enter').addEventListener('click', () => {
  document.getElementById('welcome').classList.add('is-done');
  setTimeout(() => document.getElementById('welcome').remove(), 500);
  goTo('entrance');
  document.getElementById('views').querySelector('[data-view="entrance"]').focus({ preventScroll: true });
});

// Handy for debugging and for the automated check.
window.__museum = { goTo, camera, controls, scene, frames, openScreen, ui, screenUI, THREE };

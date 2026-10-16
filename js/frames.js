// Empty photograph frames. Each frame has a wooden border, a mat, an empty picture window and a
// numbered plate on the wall. When a slot has `src` (see photos.js) the image is loaded into the window.
import * as THREE from 'three';
import { ROOM } from './config.js';
import { plateCanvas, softShadowTexture, toTexture, woodTexture } from './textures.js';

const BORDER = 0.06;
const MAT = 0.07;
const DEPTH = 0.045;

function wallPlacement(slot) {
  const { W, D } = ROOM;
  if (slot.wall === 'back') return { pos: [slot.u, slot.y, -D / 2], rotY: 0 };
  if (slot.wall === 'left') return { pos: [-W / 2, slot.y, slot.u], rotY: Math.PI / 2 };
  return { pos: [W / 2, slot.y, slot.u], rotY: -Math.PI / 2 };
}

export function buildFrames(scene, slots, { aniso = 4 } = {}) {
  const woodMap = woodTexture(aniso);
  const woodMat = new THREE.MeshStandardMaterial({ map: woodMap, roughness: 0.55, metalness: 0, envMapIntensity: 0.45 });
  const matMat = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 1, envMapIntensity: 0.2 });
  const shadowMat = new THREE.MeshBasicMaterial({ map: softShadowTexture(), transparent: true, opacity: 0.42, depthWrite: false });
  const loader = new THREE.TextureLoader();

  const frames = slots.map((slot) => {
    const g = new THREE.Group();
    g.name = `frame-${slot.id}`;
    const { pos, rotY } = wallPlacement(slot);
    g.position.set(...pos);
    g.rotation.y = rotY;

    const meshes = [];
    const add = (geo, mat, x, y, z) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      g.add(m);
      meshes.push(m);
      return m;
    };

    const { w, h } = slot;
    const iw = w - 2 * BORDER - 2 * MAT; // picture window
    const ih = h - 2 * BORDER - 2 * MAT;

    // soft shadow on the wall (slightly offset down and to the right)
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.2, h + 0.2), shadowMat);
    sh.position.set(0.012, -0.03, 0.002);
    g.add(sh);

    // hover glow behind the frame
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.1, h + 0.1),
      new THREE.MeshBasicMaterial({ color: 0xd9a441, transparent: true, opacity: 0, depthWrite: false }),
    );
    glow.position.z = 0.004;
    g.add(glow);

    // border: four bars with a mitred look
    add(new THREE.BoxGeometry(w, BORDER, DEPTH), woodMat, 0, h / 2 - BORDER / 2, DEPTH / 2);
    add(new THREE.BoxGeometry(w, BORDER, DEPTH), woodMat, 0, -h / 2 + BORDER / 2, DEPTH / 2);
    add(new THREE.BoxGeometry(BORDER, h - 2 * BORDER, DEPTH), woodMat, -w / 2 + BORDER / 2, 0, DEPTH / 2);
    add(new THREE.BoxGeometry(BORDER, h - 2 * BORDER, DEPTH), woodMat, w / 2 - BORDER / 2, 0, DEPTH / 2);
    // inner lip of the border
    const lip = 0.012;
    add(new THREE.BoxGeometry(w - 2 * BORDER, lip, 0.012), woodMat, 0, h / 2 - BORDER - lip / 2, 0.024);
    add(new THREE.BoxGeometry(w - 2 * BORDER, lip, 0.012), woodMat, 0, -h / 2 + BORDER + lip / 2, 0.024);

    // mat board and the empty picture window
    add(new THREE.PlaneGeometry(w - 2 * BORDER, h - 2 * BORDER), matMat, 0, 0, 0.016);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xdcd8ce, roughness: 1, envMapIntensity: 0.1 });
    const win = add(new THREE.PlaneGeometry(iw, ih), windowMat, 0, 0, 0.0175);
    // fine bevel line around the window
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(iw, ih)),
      new THREE.LineBasicMaterial({ color: 0xb4ae9f }),
    );
    edge.position.z = 0.018;
    g.add(edge);

    // numbered plate on the wall, to the right of the lower edge
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.12, 0.045),
      new THREE.MeshBasicMaterial({ map: toTexture(plateCanvas(slot.id, slot.fig), { aniso }) }),
    );
    plate.position.set(w / 2 - 0.06, -h / 2 - 0.085, 0.003);
    g.add(plate);

    scene.add(g);

    const state = { slot, group: g, window: win, glow, meshes, photo: null, hasImage: false, size: { iw, ih } };

    state.setHover = (on) => { glow.material.opacity = on ? 0.5 : 0; };

    // Show an image in the picture window, keeping its aspect ratio.
    state.setTexture = (tex) => {
      if (state.photo) {
        g.remove(state.photo);
        state.photo.material.map?.dispose();
        state.photo.material.dispose();
        state.photo.geometry.dispose();
        state.photo = null;
      }
      state.hasImage = !!tex;
      win.visible = !tex;
      edge.visible = !tex;
      if (!tex) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = aniso;
      const ar = tex.image.width / tex.image.height;
      let pw = iw, ph = iw / ar;
      if (ph > ih) { ph = ih; pw = ih * ar; }
      const photo = new THREE.Mesh(
        new THREE.PlaneGeometry(pw, ph),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.3 }),
      );
      photo.position.z = 0.019;
      g.add(photo);
      state.photo = photo;
      meshes.push(photo);
      photo.userData.hot = win.userData.hot;
    };

    state.loadUrl = (url) => new Promise((resolve) => {
      loader.load(url, (t) => { state.setTexture(t); resolve(true); }, undefined, () => {
        console.warn('Could not load', url);
        resolve(false);
      });
    });

    if (slot.src) state.loadUrl(slot.src);
    return state;
  });

  return frames;
}

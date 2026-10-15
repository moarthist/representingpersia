/* Minimal WebGL2 scene engine (no dependencies).
   Draws textured boxes/planes with ambient + point-light shading.
   Written for the "Representing Persia" micromuseum so the site runs on
   GitHub Pages without any build step or external library. */

/* ---------- tiny matrix helpers (column-major, like OpenGL) ---------- */
export const m4 = {
  ident() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
  mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += a[k*4 + r] * b[c*4 + k];
        o[c*4 + r] = s;
      }
    return o;
  },
  t(x, y, z) { const m = m4.ident(); m[12] = x; m[13] = y; m[14] = z; return m; },
  rx(a) { const c = Math.cos(a), s = Math.sin(a), m = m4.ident(); m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m; },
  ry(a) { const c = Math.cos(a), s = Math.sin(a), m = m4.ident(); m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m; },
  rz(a) { const c = Math.cos(a), s = Math.sin(a), m = m4.ident(); m[0] = c; m[1] = s; m[4] = -s; m[5] = c; return m; },
  persp(fovy, aspect, n, f) {
    const t = 1 / Math.tan(fovy / 2), m = new Float32Array(16);
    m[0] = t / aspect; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f);
    return m;
  },
  /** Compose a chain of ops, applied right-to-left: xf(['t',x,y,z], ['ry',a]) = T * Ry */
  xf(...ops) {
    let m = m4.ident();
    for (const [k, ...v] of ops) m = m4.mul(m, m4[k](...v));
    return m;
  }
};

/* ---------- geometry ---------- */
function pushFace(out, p0, p1, p2, p3, n, uMax, vMax) {
  const base = out.pos.length / 3;
  [p0, p1, p2, p3].forEach(p => { out.pos.push(...p); out.nor.push(...n); });
  out.uv.push(0, 0,  uMax, 0,  uMax, vMax,  0, vMax);
  out.idx.push(base, base+1, base+2, base, base+2, base+3);
}

/** Box centred on the origin. uvScale = texture repeats per world unit (0 = 0..1 per face). */
export function boxData(w, h, d, uvScale = 0) {
  const x = w/2, y = h/2, z = d/2, o = { pos: [], nor: [], uv: [], idx: [] };
  const U = (s) => uvScale ? s * uvScale : 1;
  pushFace(o, [-x,-y, z], [ x,-y, z], [ x, y, z], [-x, y, z], [0,0, 1], U(w), U(h));
  pushFace(o, [ x,-y,-z], [-x,-y,-z], [-x, y,-z], [ x, y,-z], [0,0,-1], U(w), U(h));
  pushFace(o, [ x,-y, z], [ x,-y,-z], [ x, y,-z], [ x, y, z], [1,0,0], U(d), U(h));
  pushFace(o, [-x,-y,-z], [-x,-y, z], [-x, y, z], [-x, y,-z], [-1,0,0], U(d), U(h));
  pushFace(o, [-x, y, z], [ x, y, z], [ x, y,-z], [-x, y,-z], [0,1,0], U(w), U(d));
  pushFace(o, [-x,-y,-z], [ x,-y,-z], [ x,-y, z], [-x,-y, z], [0,-1,0], U(w), U(d));
  return o;
}

/** Plane in the XY plane facing +Z. */
export function planeData(w, h, uMax = 1, vMax = 1) {
  const x = w/2, y = h/2, o = { pos: [], nor: [], uv: [], idx: [] };
  pushFace(o, [-x,-y,0], [x,-y,0], [x,y,0], [-x,y,0], [0,0,1], uMax, vMax);
  return o;
}

/* ---------- shaders ---------- */
const NL = 8;
const VS = `#version 300 es
in vec3 aPos; in vec3 aNor; in vec2 aUV;
uniform mat4 uModel; uniform mat4 uVP;
out vec3 vW; out vec3 vN; out vec2 vUV;
void main(){
  vec4 w = uModel * vec4(aPos,1.0);
  vW = w.xyz;
  vN = mat3(uModel) * aNor;
  vUV = aUV;
  gl_Position = uVP * w;
}`;
const FS = `#version 300 es
precision highp float;
in vec3 vW; in vec3 vN; in vec2 vUV;
uniform sampler2D uTex;
uniform vec4 uColor;
uniform float uEmis;      // 0 = fully lit by lights, 1 = self-lit
uniform float uSpec;
uniform vec3 uAmb;
uniform vec3 uCam;
uniform vec3 uLP[${NL}];
uniform vec3 uLC[${NL}];
out vec4 outC;
void main(){
  vec4 t = texture(uTex, vUV) * uColor;
  vec3 n = normalize(vN);
  if(!gl_FrontFacing) n = -n;
  vec3 v = normalize(uCam - vW);
  vec3 diff = uAmb * (0.75 + 0.25 * n.y);
  vec3 spec = vec3(0.0);
  for(int i=0;i<${NL};i++){
    vec3 d = uLP[i] - vW;
    float dist = length(d);
    vec3 l = d / dist;
    float att = 1.0 / (1.0 + 0.06*dist + 0.035*dist*dist);
    float nl = max(dot(n,l), 0.0);
    diff += uLC[i] * nl * att;
    vec3 h = normalize(l + v);
    spec += uLC[i] * att * pow(max(dot(n,h),0.0), 48.0) * uSpec * nl;
  }
  vec3 col = t.rgb * (diff + uEmis) + spec;
  col = col / (1.0 + 0.15*col);                 // soft tone map
  col = pow(col, vec3(1.0/2.2));
  outC = vec4(col, t.a);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

/* ---------- renderer ---------- */
export class Renderer {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: true, alpha: false });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl; this.canvas = canvas;
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VS));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    this.prog = p; gl.useProgram(p);
    this.loc = {};
    ['uModel','uVP','uTex','uColor','uEmis','uSpec','uAmb','uCam','uLP','uLC'].forEach(n => this.loc[n] = gl.getUniformLocation(p, n));
    this.attr = { aPos: gl.getAttribLocation(p, 'aPos'), aNor: gl.getAttribLocation(p, 'aNor'), aUV: gl.getAttribLocation(p, 'aUV') };
    this.objects = [];
    this.lights = [];
    this.ambient = [0.3, 0.3, 0.3];
    this.clear = [0.05, 0.05, 0.06];
    this.aniso = gl.getExtension('EXT_texture_filter_anisotropic');
    this.white = this.texture(Object.assign(document.createElement('canvas'), { width: 2, height: 2 }), { fill: '#fff' });
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE);
  }

  geometry(data) {
    const gl = this.gl, vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    const buf = (arr, loc, size) => {
      const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    buf(data.pos, this.attr.aPos, 3); buf(data.nor, this.attr.aNor, 3); buf(data.uv, this.attr.aUV, 2);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.idx), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, count: data.idx.length };
  }

  /** Texture from an <img>/<canvas>. Uploaded as sRGB so lighting is done in linear space. */
  texture(src, { repeat = false, fill = null } = {}) {
    const gl = this.gl, tex = gl.createTexture();
    if (fill) { const c = src.getContext('2d'); c.fillStyle = fill; c.fillRect(0, 0, src.width, src.height); }
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const w = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, w);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, w);
    if (this.aniso) gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    return tex;
  }

  /** Add a drawable. blend: 'none' | 'alpha' | 'add' */
  add({ geo, tex, model, color = [1,1,1,1], emis = 0, spec = 0, blend = 'none', cull = true, pick = null, tag = '' }) {
    const o = { geo, tex: tex || this.white, model, color, emis, spec, blend, cull, pick, tag };
    this.objects.push(o);
    return o;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(this.canvas.clientWidth * dpr), h = Math.floor(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    this.gl.viewport(0, 0, w, h);
    return w / h;
  }

  render(cam) {
    const gl = this.gl, L = this.loc, aspect = this.resize();
    gl.clearColor(...this.clear, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const view = m4.xf(['rx', -cam.pitch], ['ry', -cam.yaw], ['t', -cam.pos[0], -cam.pos[1], -cam.pos[2]]);
    const vp = m4.mul(m4.persp(cam.fov, aspect, 0.05, 60), view);
    gl.uniformMatrix4fv(L.uVP, false, vp);
    gl.uniform3fv(L.uAmb, this.ambient);
    gl.uniform3fv(L.uCam, cam.pos);
    const lp = new Float32Array(NL * 3), lc = new Float32Array(NL * 3);
    this.lights.slice(0, NL).forEach((l, i) => { lp.set(l.pos, i*3); lc.set(l.color, i*3); });
    gl.uniform3fv(L.uLP, lp); gl.uniform3fv(L.uLC, lc);
    gl.uniform1i(L.uTex, 0); gl.activeTexture(gl.TEXTURE0);
    const draw = (o) => {
      gl.uniformMatrix4fv(L.uModel, false, o.model);
      gl.uniform4fv(L.uColor, o.color);
      gl.uniform1f(L.uEmis, o.emis); gl.uniform1f(L.uSpec, o.spec);
      gl.bindTexture(gl.TEXTURE_2D, o.tex);
      if (o.cull) gl.enable(gl.CULL_FACE); else gl.disable(gl.CULL_FACE);
      gl.bindVertexArray(o.geo.vao);
      gl.drawElements(gl.TRIANGLES, o.geo.count, gl.UNSIGNED_SHORT, 0);
    };
    gl.disable(gl.BLEND); gl.depthMask(true);
    for (const o of this.objects) if (o.blend === 'none') draw(o);
    gl.enable(gl.BLEND); gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    for (const o of this.objects) if (o.blend === 'alpha') draw(o);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    for (const o of this.objects) if (o.blend === 'add') draw(o);
    gl.depthMask(true); gl.disable(gl.BLEND);
  }
}

/* ---------- colour helper: hex -> linear rgba ---------- */
export function rgb(hex, a = 1) {
  const n = parseInt(hex.replace('#', ''), 16);
  const lin = (v) => Math.pow(v / 255, 2.2);
  return [lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255), a];
}

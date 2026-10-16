// Interface layer: reading panel, frame card, pins over the 3D scene, view buttons.
import * as THREE from 'three';
import { BIOS, EXHIBITION } from './content.js';
import { VIEWS } from './config.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mm = (m) => Math.round(m * 1000);

export class UI {
  constructor({ onView, onOpenScreen }) {
    this.onView = onView;
    this.onOpenScreen = onOpenScreen;
    this.reader = $('reader');
    this.card = $('frame-card');
    this.pinLayer = $('pins');
    this.pins = [];
    this.readerId = null;
    this.readerOpener = null;
    this.plates = [];
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();
    this.buildToolbar();
    this.buildReaderChrome();
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if ($('screen-ui') && !$('screen-ui').hidden) return; // the screen handles its own Escape
      if (!this.reader.hidden) this.closeReader();
      else if (!this.card.hidden) this.closeCard();
    });
  }

  // ------------------------------------------------------------ toolbar
  buildToolbar() {
    const bar = $('views');
    Object.entries(VIEWS).forEach(([id, v]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn view-btn';
      b.dataset.view = id;
      b.textContent = v.label;
      b.addEventListener('click', () => this.onView(id));
      bar.append(b);
    });
    $('read-menu').querySelectorAll('[data-read]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.read;
        if (id === 'screen') this.onOpenScreen(b);
        else this.openReader(id, b);
      });
    });
  }

  setActiveView(id) {
    $('views').querySelectorAll('.view-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === id)));
  }

  // ------------------------------------------------------------ reading panel
  buildReaderChrome() {
    this.reader.innerHTML = `
      <div class="reader-bar">
        <div class="reader-tabs" role="tablist" aria-label="Texts"></div>
        <button type="button" class="reader-close" aria-label="Close text">✕</button>
      </div>
      <div class="reader-body" tabindex="-1"></div>`;
    const tabs = this.reader.querySelector('.reader-tabs');
    [['intro', 'The room'], ['jane', 'Jane Dieulafoy'], ['thomson', 'John Thomson']].forEach(([id, label]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'reader-tab';
      b.setAttribute('role', 'tab');
      b.dataset.id = id;
      b.textContent = label;
      b.addEventListener('click', () => this.openReader(id, this.readerOpener));
      tabs.append(b);
    });
    this.reader.querySelector('.reader-close').addEventListener('click', () => this.closeReader());
  }

  openReader(id, opener) {
    this.closeCard();
    this.readerOpener = opener || this.readerOpener || document.activeElement;
    this.readerId = id;
    const body = this.reader.querySelector('.reader-body');
    body.innerHTML = id === 'intro' ? this.introHtml() : this.bioHtml(BIOS[id]);
    body.scrollTop = 0;
    this.reader.querySelectorAll('.reader-tab').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.id === id)));
    this.reader.hidden = false;
    void this.reader.offsetWidth; // force a reflow so the transition runs
    this.reader.classList.add('is-open');
    document.body.classList.add('reader-open');
    body.focus({ preventScroll: true });
  }

  closeReader() {
    if (this.reader.hidden) return;
    this.reader.classList.remove('is-open');
    this.reader.hidden = true;
    document.body.classList.remove('reader-open');
    this.readerId = null;
    const o = this.readerOpener;
    this.readerOpener = null;
    o && o.focus && o.focus({ preventScroll: true });
  }

  introHtml() {
    const ex = EXHIBITION;
    return `
      <p class="kicker">${esc(ex.subtitle)}</p>
      <h2 class="r-title">${esc(ex.title)} <em>${esc(ex.qualifier)}</em></h2>
      ${ex.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      <h3>Moving around</h3>
      <ul class="plain">${ex.howTo.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      <p class="proto">${esc(ex.prototypeNote)}</p>`;
  }

  bioHtml(b) {
    return `
      <p class="kicker">${esc(b.kicker)}</p>
      <h2 class="r-title">${esc(b.name)}</h2>
      <p class="r-dates">${esc(b.dates)}</p>
      <p class="r-born">${esc(b.born)}</p>
      ${b.panel.map((p) => `<p class="r-panel">${esc(p)}</p>`).join('')}
      <p class="r-lead">${esc(b.lead)}</p>
      ${b.sections.map((s) => `<h3>${esc(s.h)}</h3>${s.p.map((t) => `<p>${esc(t)}</p>`).join('')}`).join('')}
      <h3>Key dates</h3>
      <dl class="dates">${b.keyDates.map(([y, t]) => `<dt>${esc(y)}</dt><dd>${esc(t)}</dd>`).join('')}</dl>
      <h3>Sources</h3>
      <ul class="plain sources">${b.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>`;
  }

  // ------------------------------------------------------------ plate reader
  setPlates(frames) { this.plates = frames; }

  openPlate(f, opener) {
    this.closeCard();
    this.readerOpener = opener || this.readerOpener || document.activeElement;
    const s = f.slot;
    this.readerId = 'plate-' + s.id;
    const i = this.plates.indexOf(f);
    const prev = this.plates[(i + this.plates.length - 1) % this.plates.length];
    const next = this.plates[(i + 1) % this.plates.length];
    const body = this.reader.querySelector('.reader-body');
    const wallName = { back: 'back wall', left: 'left wall', right: 'right wall' }[s.wall];
    body.innerHTML = `
      <p class="kicker">Plate ${String(s.id).padStart(2, '0')} of ${this.plates.length} · ${esc(wallName)}</p>
      <h2 class="r-title">${esc(s.title)}</h2>
      ${s.src
        ? `<figure class="r-fig"><img src="${esc(s.src)}" alt="${esc(s.title)}"></figure>`
        : '<p class="r-empty">The scan for this plate has not been hung yet. The frame is empty.</p>'}
      ${s.text.map((p) => `<p>${esc(p)}</p>`).join('')}
      <p class="r-ref">${esc(s.ref)}</p>
      <div class="r-nav">
        <button type="button" class="btn ghost" data-go="${prev.slot.id}">← Plate ${String(prev.slot.id).padStart(2, '0')}</button>
        <button type="button" class="btn ghost" data-go="${next.slot.id}">Plate ${String(next.slot.id).padStart(2, '0')} →</button>
      </div>`;
    body.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      const t = this.plates.find((p) => p.slot.id === +b.dataset.go);
      this.openPlate(t, this.readerOpener);
      this.onPlate && this.onPlate(t);
    }));
    body.scrollTop = 0;
    this.reader.querySelectorAll('.reader-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
    this.reader.hidden = false;
    void this.reader.offsetWidth;
    this.reader.classList.add('is-open');
    document.body.classList.add('reader-open');
    body.focus({ preventScroll: true });
  }

  // ------------------------------------------------------------ frame card
  openFrame(f, { onPreview, onClear } = {}) {
    const s = f.slot;
    const pad = String(s.id).padStart(2, '0');
    const wallName = { back: 'back wall', left: 'left wall', right: 'right wall' }[s.wall];
    this.card.innerHTML = `
      <button type="button" class="card-close" aria-label="Close">✕</button>
      <p class="kicker">Plate ${pad} · ${esc(wallName)}</p>
      <h3>${f.hasImage ? esc(s.title || 'Photograph') : 'An empty frame'}</h3>
      ${f.hasImage
        ? `<p>${esc(s.caption || '')}</p>${s.credit ? `<p class="credit">${esc(s.credit)}</p>` : ''}`
        : '<p>Waiting for a photograph. Add a file path to this plate in <code>js/photos.js</code> and it will appear here.</p>'}
      <dl class="specs">
        <dt>Frame</dt><dd>${mm(s.w)} × ${mm(s.h)} mm</dd>
        <dt>Window</dt><dd>${mm(f.size.iw)} × ${mm(f.size.ih)} mm</dd>
        <dt>Centre</dt><dd>${mm(s.y)} mm from the floor</dd>
      </dl>
      <div class="card-actions">
        <button type="button" class="btn" data-act="preview">Preview an image…</button>
        ${f.hasImage ? '<button type="button" class="btn ghost" data-act="clear">Empty the frame</button>' : ''}
      </div>
      <p class="fine">A preview stays in your browser only. To keep it, set <code>src</code> in <code>js/photos.js</code>.</p>`;
    this.card.querySelector('.card-close').addEventListener('click', () => this.closeCard());
    this.card.querySelector('[data-act="preview"]').addEventListener('click', () => onPreview && onPreview(f));
    const clear = this.card.querySelector('[data-act="clear"]');
    clear && clear.addEventListener('click', () => { onClear && onClear(f); this.openFrame(f, { onPreview, onClear }); });
    this.card.hidden = false;
    document.body.classList.add('card-open');
  }

  closeCard() {
    this.card.hidden = true;
    document.body.classList.remove('card-open');
  }

  // ------------------------------------------------------------ pins
  addPin({ id, label, pos, normal, activate }) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pin';
    b.setAttribute('aria-label', label);
    b.innerHTML = `<span class="pin-dot" aria-hidden="true"></span><span class="pin-label">${esc(label)}</span>`;
    b.addEventListener('click', () => activate(b));
    this.pinLayer.append(b);
    this.pins.push({ id, el: b, pos, normal });
  }

  updatePins(camera, width, height) {
    const cam = camera.position;
    for (const p of this.pins) {
      this.tmp.copy(p.pos).project(camera);
      const toCam = this.tmp2.copy(cam).sub(p.pos);
      const facing = toCam.dot(p.normal) > 0.05;
      const visible = facing && this.tmp.z < 1 && Math.abs(this.tmp.x) < 1.05 && Math.abs(this.tmp.y) < 1.05;
      if (!visible) {
        if (!p.hidden) { p.el.classList.add('is-hidden'); p.hidden = true; }
        continue;
      }
      if (p.hidden) { p.el.classList.remove('is-hidden'); p.hidden = false; }
      const x = (this.tmp.x * 0.5 + 0.5) * width, y = (-this.tmp.y * 0.5 + 0.5) * height;
      p.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      const d = toCam.length();
      p.el.classList.toggle('is-far', d > 7.5);
    }
  }
}

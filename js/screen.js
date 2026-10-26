// The interactive screen.
//  1. attract(): a canvas texture drawn on the 3D kiosk (empty scan tiles, cycling highlight).
//  2. ScreenUI: the full touch interface that opens in front of the page when the screen is clicked.
import { INHA } from './content.js';
import { SANS, SERIF, makeCanvas, spaced } from './textures.js';

// ---------------------------------------------------------------- 3D attract screen
export function createAttractScreen() {
  const W = 1024, H = 610;
  const canvas = makeCanvas(W, H);
  const g = canvas.getContext('2d');
  let last = -1;

  function draw(step) {
    g.fillStyle = '#0e1a2b';
    g.fillRect(0, 0, W, H);
    // header
    g.fillStyle = '#16294a';
    g.fillRect(0, 0, W, 86);
    g.fillStyle = '#d9a441';
    g.fillRect(0, 86, W, 4);
    g.textBaseline = 'alphabetic';
    g.fillStyle = '#f2ead8';
    g.font = `700 34px ${SERIF}`;
    g.fillText('Perse 1–6', 36, 54);
    g.fillStyle = '#9fb3d4';
    g.font = `600 20px ${SANS}`;
    spaced(g, 'INHA · DIGITAL SCANS', 215, 52, 3);
    // tiles
    const cols = 4, rows = 2, pad = 28, top = 120, tw = (W - pad * (cols + 1)) / cols, th = 176;
    for (let i = 0; i < cols * rows; i++) {
      const x = pad + (i % cols) * (tw + pad), y = top + Math.floor(i / cols) * (th + pad);
      const on = i === step % (cols * rows);
      g.fillStyle = on ? '#233a63' : '#15233c';
      g.fillRect(x, y, tw, th);
      g.strokeStyle = on ? '#d9a441' : '#2c4068';
      g.lineWidth = on ? 4 : 2;
      g.strokeRect(x + 1, y + 1, tw - 2, th - 2);
      g.fillStyle = on ? '#d9a441' : '#4b608a';
      g.font = `600 22px ${SANS}`;
      g.fillText(`Scan ${String(i + 1).padStart(3, '0')}`, x + 14, y + th - 16);
      // viewfinder corners
      g.strokeStyle = on ? '#f2ead8' : '#3a5078';
      g.lineWidth = 3;
      const m = 14, L = 22;
      [[x + m, y + m, 1, 1], [x + tw - m, y + m, -1, 1], [x + m, y + th - 48, 1, -1], [x + tw - m, y + th - 48, -1, -1]].forEach(([cx, cy, sx, sy]) => {
        g.beginPath();
        g.moveTo(cx + sx * L, cy);
        g.lineTo(cx, cy);
        g.lineTo(cx, cy + sy * L);
        g.stroke();
      });
    }
    // call to action
    g.fillStyle = '#d9a441';
    g.fillRect(W / 2 - 170, H - 82, 340, 54);
    g.fillStyle = '#10213d';
    g.font = `700 24px ${SANS}`;
    g.textAlign = 'center';
    g.fillText('TOUCH TO EXPLORE', W / 2, H - 46);
    g.textAlign = 'left';
  }

  draw(0);
  return {
    canvas,
    // call every frame with a time in seconds; redraws about twice a second
    update(t) {
      const step = Math.floor(t * 1.6);
      if (step !== last) { last = step; draw(step); return true; }
      return false;
    },
  };
}

// ---------------------------------------------------------------- DOM interface
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export class ScreenUI {
  constructor(root) {
    this.root = root;
    this.tab = 'albums';
    this.album = 0;
    this.tile = -1;
    this.opener = null;
    root.innerHTML = '';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Interactive screen: INHA digital scans');
    this.device = el('div', 'kiosk-ui');
    root.append(this.device);
    root.addEventListener('click', (e) => { if (e.target === root) this.close(); });
    this.keyHandler = (e) => {
      if (e.key === 'Escape') { this.close(); return; }
      if (e.key === 'Tab') this.trapFocus(e);
    };
    this.render();
  }

  get isOpen() { return !this.root.hidden; }

  open(opener) {
    this.opener = opener || document.activeElement;
    this.root.hidden = false;
    document.addEventListener('keydown', this.keyHandler);
    void this.root.offsetWidth; // force a reflow so the fade runs
    this.root.classList.add('is-open');
    const first = this.device.querySelector('.k-close');
    first && first.focus();
  }

  close() {
    if (!this.isOpen) return;
    this.root.classList.remove('is-open');
    this.root.hidden = true;
    document.removeEventListener('keydown', this.keyHandler);
    this.opener && this.opener.focus && this.opener.focus();
    this.onClose && this.onClose();
  }

  trapFocus(e) {
    const f = [...this.device.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((n) => !n.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  render() {
    const d = this.device;
    d.innerHTML = '';
    const head = el('header', 'k-head');
    head.append(el('div', 'k-brand', `<span class="k-mark" aria-hidden="true">INHA</span><span><strong>${esc(INHA.title)}</strong><small>${esc(INHA.org)}</small></span>`));
    const tabs = el('nav', 'k-tabs');
    tabs.setAttribute('role', 'tablist');
    [['albums', 'Albums'], ['route', 'Route'], ['about', 'About the scans']].forEach(([id, label]) => {
      const b = el('button', 'k-tab', esc(label));
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(this.tab === id));
      b.addEventListener('click', () => { this.tab = id; this.render(); this.focusTab(id); });
      b.dataset.tab = id;
      tabs.append(b);
    });
    const close = el('button', 'k-close', 'Close ✕');
    close.type = 'button';
    close.addEventListener('click', () => this.close());
    head.append(tabs, close);
    d.append(head);

    const body = el('div', 'k-body');
    if (this.tab === 'albums') this.renderAlbums(body);
    else if (this.tab === 'route') this.renderRoute(body);
    else this.renderAbout(body);
    d.append(body);
  }

  focusTab(id) {
    const t = this.device.querySelector(`.k-tab[data-tab="${id}"]`);
    t && t.focus();
  }

  renderAlbums(body) {
    body.classList.add('k-albums');
    const list = el('ul', 'k-list');
    INHA.albums.forEach((a, i) => {
      if (a.group) list.append(el('li', 'k-group', esc(a.group))); // a heading before the first album of each group
      const li = el('li');
      const b = el('button', 'k-album', `<span>${esc(a.id)}</span>`);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(i === this.album));
      b.addEventListener('click', () => { this.album = i; this.tile = -1; this.render(); this.device.querySelectorAll('.k-album')[i].focus(); });
      li.append(b);
      list.append(li);
    });
    const album = INHA.albums[this.album];
    const scans = (INHA.scans && INHA.scans[album.id]) || [];
    const main = el('section', 'k-main');
    main.append(el('h3', '', esc(album.id)));
    main.append(el('p', 'k-note', esc(album.note)));

    const grid = el('div', 'k-grid');
    const count = scans.length || INHA.placeholderTiles;
    for (let i = 0; i < count; i++) {
      const s = scans[i];
      const b = el('button', 'k-tile');
      b.type = 'button';
      b.setAttribute('aria-pressed', String(i === this.tile));
      b.setAttribute('aria-label', s ? (s.title || `Scan ${i + 1}`) : `Empty scan placeholder ${i + 1}`);
      if (s && s.src) b.innerHTML = `<img src="${esc(s.src)}" alt="${esc(s.title || '')}" loading="lazy">`;
      else b.innerHTML = `<span class="k-ph" aria-hidden="true"></span><span class="k-tn">Scan ${String(i + 1).padStart(3, '0')}</span>`;
      b.addEventListener('click', () => {
        this.tile = i;
        this.render();
        this.device.querySelectorAll('.k-tile')[i].focus();
      });
      grid.append(b);
    }
    main.append(grid);

    const detail = el('div', 'k-detail');
    detail.setAttribute('aria-live', 'polite');
    if (this.tile >= 0) {
      const s = scans[this.tile];
      if (s) {
        detail.innerHTML = `<strong>${esc(s.title || 'Scan ' + (this.tile + 1))}</strong><span>${esc(s.caption || '')}</span>` + (s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">Open this page at INHA ↗</a>` : '');
      } else {
        detail.innerHTML = `<strong>Scan ${String(this.tile + 1).padStart(3, '0')}, ${esc(album.id)}</strong><span>Placeholder. When the real scan is linked in <code>js/content.js</code> its image, caption and INHA link appear here.</span>`;
      }
    } else {
      detail.innerHTML = '<span>Select a tile to see its details.</span>';
    }
    main.append(detail);
    main.append(el('a', 'k-link', album.url ? `Open ${esc(album.id)} at INHA ↗` : 'Open the INHA digital library ↗'));
    const link = main.querySelector('.k-link');
    link.href = album.url || INHA.url;
    link.target = '_blank';
    link.rel = 'noopener';
    body.append(list, main);
  }

  renderRoute(body) {
    body.classList.add('k-routeview');
    const pts = [...INHA.route, INHA.susa];
    const lats = pts.map((p) => p.lat), lons = pts.map((p) => p.lon);
    const minLon = Math.min(...lons) - 4, maxLon = Math.max(...lons) + 10;
    const minLat = Math.min(...lats) - 3, maxLat = Math.max(...lats) + 3;
    const midLat = ((minLat + maxLat) / 2) * Math.PI / 180;
    const kx = Math.cos(midLat);
    const W = 760, H = Math.round(W * ((maxLat - minLat) / ((maxLon - minLon) * kx)));
    const X = (lon) => ((lon - minLon) / (maxLon - minLon)) * W;
    const Y = (lat) => (1 - (lat - minLat) / (maxLat - minLat)) * H;
    const path = INHA.route.map((p, i) => `${i ? 'L' : 'M'}${X(p.lon).toFixed(1)},${Y(p.lat).toFixed(1)}`).join(' ');
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Simplified map of the 1881 to 1882 route from Marseille to Shiraz, with Susa marked" class="k-map">`;
    for (let i = 1; i < 6; i++) svg += `<line x1="${(W / 6) * i}" y1="0" x2="${(W / 6) * i}" y2="${H}" class="k-gridline"/>`;
    for (let i = 1; i < 4; i++) svg += `<line x1="0" y1="${(H / 4) * i}" x2="${W}" y2="${(H / 4) * i}" class="k-gridline"/>`;
    svg += `<path d="${path}" class="k-path"/>`;
    pts.forEach((p, i) => {
      const susa = p === INHA.susa;
      const left = susa;                       // keep Susa's label clear of Isfahan
      const above = p.name === 'Marseille';    // Marseille sits at the left edge
      const dx = above ? 0 : left ? -13 : 13;
      const dy = above ? -16 : 5;
      const anchor = above ? 'middle' : left ? 'end' : 'start';
      svg += `<g class="k-node${susa ? ' is-susa' : ''}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(p.name)}: ${esc(p.note)}"><circle cx="${X(p.lon).toFixed(1)}" cy="${Y(p.lat).toFixed(1)}" r="${susa ? 9 : 7}"/><text x="${(X(p.lon) + dx).toFixed(1)}" y="${(Y(p.lat) + dy).toFixed(1)}" text-anchor="${anchor}">${esc(p.name)}</text></g>`;
    });
    svg += '</svg>';
    const wrap = el('div', 'k-mapwrap', svg);
    const info = el('div', 'k-routeinfo');
    info.setAttribute('aria-live', 'polite');
    info.innerHTML = '<strong>The route, 1881–82</strong><span>Select a place to read a note. The map is simplified: coastlines are left out and distances are only approximate.</span>';
    const show = (i) => {
      const p = pts[i];
      info.innerHTML = `<strong>${esc(p.name)}</strong><span>${esc(p.note)}</span>`;
    };
    wrap.querySelectorAll('.k-node').forEach((n) => {
      const i = Number(n.dataset.i);
      n.addEventListener('click', () => show(i));
      n.addEventListener('mouseenter', () => show(i));
      n.addEventListener('focus', () => show(i));
      n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); } });
    });
    const side = el('div', 'k-routeside');
    side.append(wrap, info);
    const m = INHA.routeMap;
    if (m) {
      const fig = el('figure', 'k-oldmap', `<a href="${esc(m.src)}" target="_blank" rel="noopener" aria-label="Open the map full size"><img src="${esc(m.src)}" alt="${esc(m.title)}"></a><figcaption>${esc(m.caption)}</figcaption>`);
      body.append(fig);
    }
    body.append(side);
  }

  renderAbout(body) {
    body.classList.add('k-aboutview');
    const wrap = el('section', 'k-about');
    wrap.append(el('h3', '', 'About the scans'));
    INHA.about.forEach((t) => wrap.append(el('p', '', esc(t))));
    const link = el('a', 'k-link', 'Open the INHA digital library ↗');
    link.href = INHA.url;
    link.target = '_blank';
    link.rel = 'noopener';
    wrap.append(link);
    body.append(wrap);
  }
}

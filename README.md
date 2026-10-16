# Representing Persia (Qajar): a 3D micromuseum

An interactive 3D room for photographs of Qajar Iran. It is a plain static website: no build step, no
framework, nothing to install. It runs on GitHub Pages as it is.

What is in the room

- A normal room, 4.6 m wide, 6.0 m deep and 2.9 m high, with a door, track lighting and a polished concrete floor.
- Twelve **plates** (4 on the back wall, a 2 x 2 group on the left, 4 on the right), each with a numbered label and figure number. All twelve hold INHA scans. Click a plate to read its title, text and reference.
- A **Persian carpet** (1.5 x 2.0 m, from the photo `assets/carpet.jpg`) in the middle of the floor.
- An information stand with the text on the Scottish geographer and photographer **John Thomson**, and a wall panel next to it on the left wall for **Jane Dieulafoy**.
- An **interactive screen** for the INHA scans (albums, route map, notes about the scans).
- Entrance wall text, seven camera views (overview, entrance, each wall, wall text, screen, plan) and a reading panel.

## Run it on your computer

The page uses ES modules, so open it through a local server, not by double-clicking `index.html`.

```bash
cd micromuseum        # the folder that holds index.html
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish it as a GitHub page

1. Create a new repository on GitHub (for example `representing-persia`) and upload everything in this folder,
   keeping the folder structure. `index.html` must be at the top level.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the
   `/ (root)` folder, then save.
4. After a minute the site is live at `https://YOUR-NAME.github.io/representing-persia/`.

The empty file `.nojekyll` tells GitHub not to process the site, so the `vendor/` folder is served untouched.

## Hang your photographs

Every plate is defined in `js/photos.js` (title, text, reference, `src`). Plates with `src: null` are empty frames. To hang a scan:

1. Copy your image files into `assets/photos/` (JPG or PNG; about 2000 px on the long side is plenty).
2. Open `js/photos.js` and set `src` on the frame, for example:

   ```js
   { id: 1, wall: 'back', u: -0.95, y: 1.55, w: 0.78, h: 0.98,
     src: 'assets/photos/plate-01.jpg',
     title: 'Title of the photograph',
     caption: 'Place, date, album and page.',
     credit: 'INHA, Perse 1' },
   ```

3. Reload. The image appears inside the frame, keeping its proportions, and a click on the frame shows the caption.

You can also move or resize frames in the same file (`wall`, `u`, `y`, `w`, `h`). To try an image without editing
anything, click an empty frame and choose **Preview an image**; that preview stays in your browser only.

## Put the real scans on the screen

Open `js/content.js`, find `INHA`, and:

- set `url` to the exact address of the digitised albums on the INHA site (it is a placeholder at the moment);
- replace the "Add a description" notes with text from the INHA catalogue;
- add scans per album:

  ```js
  scans: {
    'Perse 1': [
      { title: 'View of …', src: 'assets/scans/perse1-001.jpg', caption: '…', url: 'https://…' },
    ],
  },
  ```

Until you do, the screen shows empty placeholder tiles.

## Edit the text

Everything written in the room is in `js/content.js`: the entrance wall text and introduction (`EXHIBITION`), the two
biographies (`BIOS`, with key dates and sources) and the screen (`INHA`).

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure and the import map for three.js |
| `css/style.css` | Interface styles (panels, pins, toolbar, screen) |
| `js/main.js` | Renderer, camera, views, clicking and hovering |
| `js/config.js` | Room size and camera views |
| `js/room.js` | Walls, floor, ceiling, door, track lights |
| `js/frames.js` | The frames and the loading of photographs |
| `js/carpet.js` | The Persian carpet (texture from `assets/carpet.jpg`) |
| `js/furniture.js` | Information stand, kiosk, bench, entrance wall text |
| `js/screen.js` | The 3D screen picture and the full interactive screen |
| `js/ui.js` | Reading panel, frame card, pins |
| `js/textures.js` | Procedural textures (concrete, wood) and text drawn on canvases |
| `js/photos.js` | **Plates: photographs, titles, texts, references, layout** |
| `js/content.js` | **All the text** |
| `vendor/` | three.js r160 (MIT licence), so no CDN is needed |

## Notes on the content

- The biographies were written from published sources, listed at the end of each one in the reading panel. Please
  check dates and wording against your own references before you cite them.
- The stand and wall texts for Dieulafoy and Thomson, and the plate texts, are the author's own wording and are shown as supplied. The longer biographies in the reading panel come from published sources; those sources do not mention a Persian journey for Thomson, so check that attribution against the INHA catalogue before citing it.
- That Dieulafoy followed her husband to the front in 1870 dressed as a soldier rests largely on obituaries and later
  accounts, and the text signals this.

## Credits

Built with [three.js](https://threejs.org/) (MIT). The INHA name belongs to the Institut national d’histoire de l’art;
this project is independent and is not affiliated with it.

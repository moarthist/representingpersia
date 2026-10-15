# Representing Persia — The Qajars
An explorable 3D micromuseum (pure WebGL2, no dependencies, no build step) based on the thesis
*Re-presenting Persia: Micromuseum practices in the photographic collection of INHA* (University of Bologna, AMAC).

A single room: 12 photographs on the walls, a stand with the biography of Jane Dieulafoy, and a touch screen
showing the INHA photographic archive.

## Controls
Drag to look · WASD / arrows to walk · mouse wheel to zoom · click a photo, the stand or the screen · buttons / keys 1–6 for viewpoints.
Touch devices: drag to look, on-screen pad to walk.

## Publish on GitHub Pages
1. Create a repository and upload **the contents of this folder** (keep `.nojekyll`).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. After a minute the site is at `https://<user>.github.io/<repo>/`.

## Run locally
ES modules need http, not `file://`:
`python3 -m http.server 8000` then open http://localhost:8000

## Edit content
`data/photos.json` holds titles, captions and credits (the hidden `note` field has probable thesis figure IDs to verify).
Biography text: `BIO` in `js/main.js`. Replace images in `assets/photos/`.

## Notes
- The touch screen is a simulation of the INHA archive with a link to https://bibliotheque-numerique.inha.fr/.
- Check INHA's reuse conditions before publishing the images publicly.
- Requires a browser with WebGL2.

// Room dimensions (metres) and camera views.
// The room is an ordinary gallery-sized room: 4.6 m wide, 6.0 m deep, 2.9 m high.
// Axes: +x to the right, +y up, +z toward the entrance. The back wall is at z = -D/2.

export const ROOM = { W: 4.6, D: 6.0, H: 2.9, wallT: 0.14 };

// Camera views. `pos` and `target` are in metres; `fov` is the vertical field of view in degrees.
export const VIEWS = {
  overview: { label: 'Overview', pos: [0.3, 5.4, 9.0], target: [0, 1.15, -0.4], fov: 40 },
  entrance: { label: 'Entrance', pos: [0.55, 1.6, 2.75], target: [-0.1, 1.45, -3.0], fov: 64 },
  back:     { label: 'Back wall', pos: [0.1, 1.55, 0.9], target: [0, 1.5, -3.0], fov: 58 },
  left:     { label: 'Left wall', pos: [1.9, 1.6, 0.2], target: [-2.3, 1.5, -0.1], fov: 72 },
  right:    { label: 'Right wall', pos: [-0.7, 1.55, -0.8], target: [2.3, 1.5, -0.8], fov: 62 },
  text:     { label: 'Wall text', pos: [-0.3, 1.55, -0.1], target: [0, 1.6, 3.0], fov: 58 },
  screen:   { label: 'Screen', pos: [0.82, 1.5, 1.92], target: [1.45, 0.98, 0.9], fov: 52 },
  plan:     { label: 'Plan', pos: [0, 11.5, 0.05], target: [0, 0, 0], fov: 32 },
};

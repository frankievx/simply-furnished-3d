# Storefront themes (pre-rendered)

The carousel camera never moves, so each storefront theme is rendered once in
Blender and shipped as two small files in `public/storefront/<theme>/`:

- `backplate.webp`: the room as the app camera sees it, 3840 × 1600 (aspect
  2.4). Narrower windows crop the sides; the vertical field of view always
  matches.
- `probe.hdr`: a 256 × 128 lighting map taken where the chairs stand. The app
  uses it as the scene environment, so the real-time chairs are lit by the room.

The chairs stay real-time. In the app (`src/app/@canvas/components/themes/ThemeScene.tsx`)
invisible floor and wall planes catch their shadows from a sun aimed the same
way as the render's sun, and a contact shadow darkens the platform under each
foot.

## Rebuilding a theme

Needs Blender 5.2 (`/Applications/Blender.app`) and Pillow.

```sh
python3 art/storefront/fetch_assets.py   # CC0 textures and sky, about 180 MB, gitignored
/Applications/Blender.app/Contents/MacOS/Blender --factory-startup -b \
  -P art/storefront/build_scene.py -- --theme scandi --exposure 0.4
/Applications/Blender.app/Contents/MacOS/Blender --factory-startup -b \
  -P art/storefront/build_scene.py -- --theme japandi --exposure 0.2
python3 art/storefront/export.py         # PNG -> WebP, prints the shipped sizes
```

Each run also saves `art/storefront/<theme>.blend` for editing by hand. Useful
options: `--samples 48 --height 720` for quick tests, `--no-render` to only
build the `.blend`, `--only backplate` or `--only probe`.

Scene frame: x across, y towards the back wall (wall face at y 0), z up from
the floor. The app's world is the same with the floor at z -9.987, where the
chairs' feet rest (between y -1.5 and -0.9). The camera matches
`src/state/camera.ts` with a vertical field of view of 75°. Whatever the chairs
stand on must cover that footprint, or they look like they hover. Nothing may
stand in front of the chairs (y below about -1.6), because the chairs are
always drawn over the backplate.

## Adding a theme

1. Add a function to `THEMES` in `build_scene.py` and render it.
2. Add it to `themes` in `src/app/@canvas/components/themes/themeState.ts` and
   to `prerendered` in `ThemeScene.tsx` (platform lift, shadow strength, sun).

## Sources and licences

Everything is from [Poly Haven](https://polyhaven.com) under CC0. Only the
renders ship; the source files stay local.

| Asset | Use | Author |
| --- | --- | --- |
| painted_plaster_wall | Scandi wall | Amal Kumar |
| ash_veneer | Scandi floorboards | Jenelle van Heerden |
| plywood | Scandi platform | Rob Tuytel |
| clay_plaster | Japandi wall | Amal Kumar |
| tatami_mat | Japandi floor | Charlotte Baglioni |
| oak_veneer_01 | Japandi slats, lantern frames | Jenelle van Heerden |
| walnut_veneer | Japandi plinth, skirting | Jenelle van Heerden |
| rough_linen | Japandi noren | colormass, Rico Cilliers |
| kloofendal_48d_partly_cloudy_puresky | Sky and daylight | Greg Zaal, Jarod Guest (sky edits) |

Fonts on the wall are the app's own (`public/fonts`). All geometry is built by
`build_scene.py`.

import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

// Every surface in the theme mock-ups is drawn here on a canvas, so the
// options cost no downloads. Seeded, so screenshots repeat exactly.
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, rand: () => number) => void;

const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function canvasTexture(
  w: number,
  h: number,
  draw: Draw,
  repeat: [number, number] = [1, 1],
  seed = 7
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!, w, h, seeded(seed));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(...repeat);
  texture.anisotropy = 8;
  return texture;
}

const blotches = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  colors: string[],
  count: number,
  size: number
) => {
  for (let i = 0; i < count; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = size * (0.4 + rand());
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colors[i % colors.length]);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
};

/** Soft painted plaster or limewash. */
export const plaster = (base: string, light: string, dark: string, repeat: [number, number] = [2, 1]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.3;
    blotches(ctx, w, h, rand, [light, dark], 50, 70);
    ctx.globalAlpha = 1;
  }, repeat);

/** Floorboards running towards the camera. */
export const boards = (colors: string[], seam: string, repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    const count = 8;
    const bw = w / count;
    for (let i = 0; i < count; i++) {
      let y = -rand() * h;
      while (y < h) {
        const len = h * (0.5 + rand() * 0.6);
        ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
        ctx.fillRect(i * bw, y, bw, len);
        ctx.globalAlpha = 0.08;
        for (let g = 0; g < 14; g++) {
          ctx.fillStyle = rand() > 0.5 ? "#000" : "#fff";
          ctx.fillRect(i * bw + rand() * bw, y, 1 + rand() * 2, len);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = seam;
        ctx.fillRect(i * bw, y, bw, 2);
        y += len;
      }
      ctx.fillStyle = seam;
      ctx.fillRect(i * bw, 0, 2, h);
    }
  }, repeat);

/** Black and white marble checkerboard, set on the diagonal. */
export const checker = (a: string, b: string, repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    const n = 4;
    const s = w / n;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = (i + j) % 2 ? a : b;
        ctx.fillRect(i * s, j * s, s, s);
      }
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#9a958c";
    for (let v = 0; v < 18; v++) {
      ctx.lineWidth = 0.5 + rand() * 1.5;
      ctx.beginPath();
      let x = rand() * w;
      let y = rand() * h;
      ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) {
        x += (rand() - 0.3) * 60;
        y += (rand() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(120,115,105,0.6)";
    for (let i = 0; i <= n; i++) {
      ctx.fillRect(i * s - 1, 0, 2, h);
      ctx.fillRect(0, i * s - 1, w, 2);
    }
  }, repeat);

/** Whitewashed brick. */
export const brick = (repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = "#d9d2c6";
    ctx.fillRect(0, 0, w, h);
    const rows = 16;
    const bh = h / rows;
    const bw = w / 4;
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? bw / 2 : 0;
      for (let c = -1; c < 5; c++) {
        const tone = 225 + Math.floor(rand() * 22);
        const warm = Math.floor(rand() * 18);
        ctx.fillStyle = `rgb(${tone},${tone - 6 - warm / 3},${tone - 14 - warm})`;
        ctx.fillRect(c * bw + offset + 3, r * bh + 3, bw - 6, bh - 6);
        if (rand() > 0.7) {
          ctx.fillStyle = `rgba(176,110,86,${0.12 + rand() * 0.2})`;
          ctx.fillRect(c * bw + offset + 3 + rand() * bw * 0.5, r * bh + 3, bw * 0.4, bh - 6);
        }
      }
    }
  }, repeat);

/** Polished concrete with saw cuts. */
export const concrete = (repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = "#bdb8b0";
    ctx.fillRect(0, 0, w, h);
    blotches(ctx, w, h, rand, ["rgba(150,145,138,0.35)", "rgba(220,216,208,0.35)"], 80, 60);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = rand() > 0.5 ? "rgba(90,88,84,0.25)" : "rgba(240,238,232,0.25)";
      ctx.fillRect(rand() * w, rand() * h, 1.5, 1.5);
    }
    ctx.fillStyle = "rgba(95,92,88,0.45)";
    ctx.fillRect(0, h / 2, w, 2);
    ctx.fillRect(w / 2, 0, 2, h);
  }, repeat);

/** Terrazzo with coloured chips. */
export const terrazzo = (repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = "#ece4d6";
    ctx.fillRect(0, 0, w, h);
    const chips = ["#c8673d", "#2f6f6a", "#d9a441", "#8c8579", "#fbf8f2", "#b3a998"];
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = chips[Math.floor(rand() * chips.length)];
      ctx.beginPath();
      const x = rand() * w;
      const y = rand() * h;
      const r = 1.5 + rand() * (rand() > 0.9 ? 9 : 4);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        const rr = r * (0.6 + rand() * 0.6);
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.fill();
    }
  }, repeat);

/** Terracotta tiles with a lime grout. */
export const cotto = (repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = "#e9dcc7";
    ctx.fillRect(0, 0, w, h);
    const n = 4;
    const s = w / n;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const r = 196 + Math.floor(rand() * 22);
        ctx.fillStyle = `rgb(${r},${Math.floor(r * 0.62)},${Math.floor(r * 0.47)})`;
        ctx.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
        blotches(ctx, s, s, rand, ["rgba(120,55,30,0.12)", "rgba(240,190,150,0.12)"], 3, 30);
      }
  }, repeat);

/** Woven tatami with dark cloth borders. */
export const tatami = (repeat: [number, number]) =>
  canvasTexture(512, 512, (ctx, w, h, rand) => {
    ctx.fillStyle = "#cbbd8f";
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = `rgba(${150 + rand() * 40},${140 + rand() * 30},90,0.35)`;
      ctx.fillRect(0, y, w, 2);
    }
    ctx.fillStyle = "#3a332a";
    ctx.fillRect(w / 4 - 7, 0, 14, h);
    ctx.fillRect((3 * w) / 4 - 7, 0, 14, h);
  }, repeat);

/** A soft round glow, for lamps and light pools. */
export const glow = (color: string) =>
  canvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

/** A blurred street outside: sky, facades across the road, a kerb. */
export const street = (sky: [string, string], facades: string[]) =>
  canvasTexture(512, 1024, (ctx, w, h, rand) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, sky[0]);
    g.addColorStop(0.6, sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.filter = "blur(3px)";
    let x = -20;
    while (x < w) {
      const bw = 140 + rand() * 120;
      const top = h * (0.12 + rand() * 0.18);
      ctx.fillStyle = facades[Math.floor(rand() * facades.length)];
      ctx.fillRect(x, top, bw, h);
      ctx.fillStyle = "rgba(60,70,80,0.35)";
      for (let wy = top + 40; wy < h * 0.75; wy += 90)
        for (let wx = x + 22; wx < x + bw - 30; wx += 52) ctx.fillRect(wx, wy, 26, 48);
      x += bw + 4;
    }
    ctx.fillStyle = "#8d8a84";
    ctx.fillRect(0, h * 0.82, w, h);
    ctx.fillStyle = "#6f6c67";
    ctx.fillRect(0, h * 0.8, w, h * 0.02);
    ctx.filter = "none";
  });

/** Sea and sky through an arch. */
export const seaView = () =>
  canvasTexture(512, 1024, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    sky.addColorStop(0, "#7fb3d9");
    sky.addColorStop(1, "#d8ecf4");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const sea = ctx.createLinearGradient(0, h * 0.62, 0, h);
    sea.addColorStop(0, "#3f8db8");
    sea.addColorStop(1, "#2a6e98");
    ctx.fillStyle = sea;
    ctx.fillRect(0, h * 0.62, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(0, h * 0.62, w, 3);
    ctx.fillStyle = "#e6d6b8";
    ctx.fillRect(0, h * 0.86, w, h);
  });

/** Blue and white azulejo tiles. */
export const azulejo = (repeat: [number, number]) =>
  canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#f6f1e6";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#2a4f8f";
    ctx.fillStyle = "#2a4f8f";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    for (let k = 0; k < 4; k++) {
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate((k * Math.PI) / 2);
      ctx.beginPath();
      ctx.ellipse(0, -w * 0.28, w * 0.06, w * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    [0, w].forEach((cx) =>
      [0, h].forEach((cy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, w * 0.16, 0, Math.PI * 2);
        ctx.fill();
      })
    );
    ctx.strokeStyle = "#cfc6b4";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, w, h);
  }, repeat);

#!/usr/bin/env node
// preview-shot: open a URL in headless Chromium, run a few steps, and write
// JPEG screenshots plus a contact sheet, so a deployed page can be reviewed
// from a phone. Works for any site; WebGL pages are fine (software rendering).
//
//   node preview-shot.mjs --url <url> [--recipe file.json] [--out dir]
//
// Prints one JSON report on stdout (progress goes to stderr). Exit code 0 only
// if every step ran. Secrets in URLs (`_vercel_share`, bypass params) are
// never printed or written.
//
// Recipe (JSON): { "path": "/modesto", "viewport": {"width":1440,"height":900},
//   "steps": [ {"click":"Enter showroom"}, {"settle":true}, {"shot":"default"},
//              {"press":"ArrowRight"}, {"settle":true}, {"shot":"next"} ] }
// Steps: click (text, or {text|selector, timeout}), press (key), wait (ms),
// settle (true or {interval, max}), shot (name), goto (path), viewport.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const SECRET_PARAMS = [
  "_vercel_share",
  "x-vercel-protection-bypass",
  "x-vercel-set-bypass-cookie",
];
const redact = (value) => {
  try {
    const u = new URL(value);
    SECRET_PARAMS.forEach((p) => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return String(value).slice(0, 200);
  }
};
const log = (...a) => console.error("[preview-shot]", ...a);

function parseArgs(argv) {
  const out = { flags: new Set() };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    if (["gpu", "no-sheet", "help"].includes(key)) out.flags.add(key);
    else out[key] = argv[++i];
  }
  return out;
}

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const roots = [
    "/opt/pw-browsers",
    path.join(os.homedir(), "Library/Caches/ms-playwright"),
    path.join(os.homedir(), ".cache/ms-playwright"),
  ];
  const rel = [
    "chrome-linux/chrome",
    "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    "chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  ];
  const found = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const dir of fs.readdirSync(root)) {
      if (!/^chromium-\d+$/.test(dir)) continue;
      for (const r of rel) {
        const p = path.join(root, dir, r);
        if (fs.existsSync(p)) found.push({ n: Number(dir.split("-")[1]), p });
      }
    }
  }
  found.sort((a, b) => b.n - a.n);
  return found[0]?.p;
}

const args = parseArgs(process.argv.slice(2));
if (args.flags.has("help") || !args.url) {
  console.error(
    "usage: preview-shot.mjs --url <url> [--recipe file.json] [--out dir] [--viewport 1440x900] [--quality 80] [--max-kb 450] [--gpu] [--no-sheet]"
  );
  process.exit(args.url ? 0 : 2);
}

const recipe = args.recipe
  ? JSON.parse(fs.readFileSync(args.recipe, "utf8"))
  : { steps: [{ settle: { max: 15 } }, { shot: "page" }] };
const [vw, vh] = (args.viewport || "").split("x").map(Number);
const viewport = {
  width: vw || recipe.viewport?.width || 1440,
  height: vh || recipe.viewport?.height || 900,
};
const quality = Number(args.quality || 80);
const maxKb = Number(args["max-kb"] || 450);
const outDir = path.resolve(args.out || "preview-shots");
fs.mkdirSync(outDir, { recursive: true });

const report = {
  ok: false,
  url: redact(args.url),
  viewport,
  shots: [],
  sheet: null,
  steps: [],
  consoleErrors: [],
  failedRequests: [],
  timings: {},
  error: null,
};
const cap = (list, item) => list.length < 20 && list.push(item);
const t0 = Date.now();
const finish = (code) => {
  report.timings.totalSeconds = Math.round((Date.now() - t0) / 1000);
  console.log(JSON.stringify(report, null, 2));
  process.exit(code);
};

let playwright;
try {
  playwright = require("playwright-core");
} catch {
  report.error =
    "playwright-core is not installed next to this script (run `npm install playwright-core` in its folder)";
  finish(1);
}
const executablePath = findChromium();
if (!executablePath) {
  report.error =
    "No Chromium found. Set CHROMIUM_PATH, or install one (`npx playwright-core install chromium`) where downloads are allowed.";
  finish(1);
}

const flags = ["--ignore-gpu-blocklist"];
if (!args.flags.has("gpu"))
  flags.push("--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader");
if (process.platform === "linux") flags.push("--no-sandbox");

const browser = await playwright.chromium.launch({ executablePath, args: flags });
const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });

// An automation bypass secret, if one is set, goes only to *.vercel.app.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (bypass) {
  await context.route(/^https:\/\/[^/]+\.vercel\.app\//, (route) =>
    route.continue({
      headers: {
        ...route.request().headers(),
        "x-vercel-protection-bypass": bypass,
        "x-vercel-set-bypass-cookie": "true",
      },
    })
  );
}

const page = await context.newPage();
page.on("console", (m) => {
  if (m.type() === "error") cap(report.consoleErrors, m.text().slice(0, 300));
});
page.on("pageerror", (e) => cap(report.consoleErrors, String(e).slice(0, 300)));
page.on("requestfailed", (r) =>
  cap(report.failedRequests, {
    url: redact(r.url()),
    error: r.failure()?.errorText,
  })
);
page.on("response", (r) => {
  if (r.status() >= 400)
    cap(report.failedRequests, { url: redact(r.url()), status: r.status() });
});

async function settle(opts = {}) {
  const interval = opts.interval || 1500;
  const max = opts.max || 30;
  let last = null;
  for (let i = 0; i < max; i++) {
    await page.waitForTimeout(interval);
    const shot = (await page.screenshot({ type: "png" })).toString("base64");
    if (shot === last) return i + 1;
    last = shot;
  }
  report.notes = [...(report.notes || []), "scene did not fully settle"];
  return max;
}

async function shot(name) {
  let q = quality;
  let buf;
  do {
    buf = await page.screenshot({ type: "jpeg", quality: q });
    q -= 10;
  } while (buf.length > maxKb * 1024 && q >= 50);
  const file = path.join(outDir, `${String(report.shots.length + 1).padStart(2, "0")}-${name}.jpg`);
  fs.writeFileSync(file, buf);
  report.shots.push({ name, file, kb: Math.round(buf.length / 1024) });
}

async function runStep(step) {
  if (step.goto) {
    const u = new URL(page.url());
    u.pathname = step.goto;
    await page.goto(u.toString(), { waitUntil: "domcontentloaded", timeout: 60000 });
  } else if (step.click) {
    const c = typeof step.click === "string" ? { text: step.click } : step.click;
    const target = c.selector
      ? page.locator(c.selector).first()
      : page.getByText(new RegExp(c.text, "i")).first();
    await target.click({ timeout: c.timeout || 180000 });
    report.timings.firstClickSeconds ??= Math.round((Date.now() - t0) / 1000);
  } else if (step.press) await page.keyboard.press(step.press);
  else if (step.wait) await page.waitForTimeout(step.wait);
  else if (step.settle) await settle(step.settle === true ? {} : step.settle);
  else if (step.shot) await shot(step.shot);
  else if (step.viewport) await page.setViewportSize(step.viewport);
  else throw new Error(`unknown step ${JSON.stringify(step)}`);
}

try {
  const target = new URL(args.url);
  if (recipe.path) target.pathname = recipe.path;
  const res = await page.goto(target.toString(), { waitUntil: "domcontentloaded", timeout: 60000 });
  report.status = res?.status();
  report.finalPath = new URL(page.url()).pathname;
  if (res && res.status() >= 400) throw new Error(`page answered HTTP ${res.status()}`);

  for (const step of recipe.steps || []) {
    const label = JSON.stringify(step).slice(0, 80);
    try {
      await runStep(step);
      report.steps.push({ step: label, ok: true });
    } catch (e) {
      report.steps.push({ step: label, ok: false, error: String(e.message).split("\n")[0] });
      report.error = `step failed: ${label}: ${String(e.message).split("\n")[0]}`;
      await shot("failure").catch(() => {});
      break;
    }
  }
  report.ok = !report.error;

  if (report.shots.length && !args.flags.has("no-sheet")) {
    const cols = Math.min(report.shots.length, 2);
    const cell = 720;
    // The page is sized to the grid exactly: fullPage screenshots of a tall
    // page are unreliable under software rendering.
    const rows = Math.ceil(report.shots.length / cols);
    const cellHeight = Math.round(((cell - 16) * viewport.height) / viewport.width) + 16 + 34;
    const sheetPage = await browser.newPage({
      viewport: { width: cols * cell, height: rows * cellHeight },
    });
    const cells = report.shots
      .map((s) => {
        const b64 = fs.readFileSync(s.file).toString("base64");
        return `<figure><img src="data:image/jpeg;base64,${b64}"><figcaption>${s.name}</figcaption></figure>`;
      })
      .join("");
    await sheetPage.setContent(
      `<style>body{margin:0;background:#1d1c18;display:grid;grid-template-columns:repeat(${cols},${cell}px);font:600 14px system-ui;color:#f4efe0}
       figure{margin:0;padding:8px}img{width:${cell - 16}px;display:block;border-radius:6px}figcaption{padding:6px 2px}</style>${cells}`
    );
    let q = 80;
    let buf;
    do {
      buf = await sheetPage.screenshot({ type: "jpeg", quality: q });
      q -= 10;
    } while (buf.length > maxKb * 2 * 1024 && q >= 50);
    report.sheet = path.join(outDir, "sheet.jpg");
    fs.writeFileSync(report.sheet, buf);
  }
} catch (e) {
  report.error = report.error || String(e.message).split("\n")[0];
  await shot("failure").catch(() => {});
}

await browser.close();
finish(report.ok ? 0 : 1);

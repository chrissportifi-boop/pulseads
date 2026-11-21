// node build.mjs <id> [sheet t1,t2,...] | [full]
import { createRequire } from "module";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { makeMusic } from "./synth.mjs";
const require = createRequire(import.meta.url);
const puppeteer = require("../node_modules/puppeteer-core");
const sharp = require("sharp");
const ffmpeg = require("ffmpeg-static");

const [, , id, mode = "sheet", arg] = process.argv;
const html = path.resolve(`ads/${id}.html`);
fs.mkdirSync("out", { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--force-color-profile=srgb", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 720, height: 1280, deviceScaleFactor: 1.5 });
page.on("console", m => console.log("[page]", m.text()));
page.on("pageerror", e => console.log("[pageerror]", e.message));
await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle0" });
await page.evaluate(() => window.ready);
const info = await page.evaluate(() => ({ total: window.TOTAL, cuts: window.CUTS, beat: window.BEAT, bpm: +document.body.dataset.bpm, style: document.body.dataset.style }));
console.log(id, JSON.stringify(info));
const shot = async t => { await page.evaluate(s => window.seek(s), t); return page.screenshot({ type: "jpeg", quality: 94 }); };

if (mode === "sheet") {
  const times = arg ? arg.split(",").map(Number) : info.cuts.map(c => c + info.beat * 1.6).concat([info.total - .3]);
  const imgs = await Promise.all([]);
  for (const t of times) imgs.push(await sharp(await shot(t)).resize(270, 480).toBuffer());
  const cols = Math.min(6, imgs.length), rows = Math.ceil(imgs.length / cols);
  await sharp({ create: { width: cols * 270, height: rows * 480, channels: 3, background: "#222" } })
    .composite(imgs.map((b, i) => ({ input: b, left: (i % cols) * 270, top: Math.floor(i / cols) * 480 }))).png().toFile(`out/${id}_sheet.png`);
  console.log("sheet", times.map(t => t.toFixed(2)).join(","));
} else if (mode === "frame") {
  fs.writeFileSync(`out/${id}_frame.jpg`, await shot(+arg));
} else {
  const endAt = info.cuts[info.cuts.length - 1];
  makeMusic({ style: info.style, bpm: info.bpm, total: info.total, cuts: info.cuts, endAt, out: `out/${id}.wav` });
  const fps = 30, N = Math.round(info.total * fps);
  const ff = spawn(ffmpeg, ["-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-", "-i", `out/${id}.wav`,
    "-vf", "scale=720:1280:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", `out/${id}.mp4`], { stdio: ["pipe", "ignore", "pipe"] });
  let err = ""; ff.stderr.on("data", d => err += d);
  for (let f = 0; f < N; f++) {
    const buf = await shot(f / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (f % 60 === 0) process.stdout.write(`${f}/${N} `);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on("close", r));
  console.log("\nffmpeg", code, code ? err.slice(-800) : "");
  // póster: fotograma elegido
  const pt = arg ? +arg : info.cuts[1] + info.beat * 2;
  await sharp(await shot(pt)).resize(720, 1280).webp({ quality: 80 }).toFile(`out/${id}.webp`);
}
await browser.close();

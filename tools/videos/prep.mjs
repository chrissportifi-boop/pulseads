import sharp from "sharp"; import fs from "fs";
fs.mkdirSync("ai/c",{recursive:true});
for (const f of fs.readdirSync("ai")) {
  const m = f.match(/^(\w+)\.(webp|jpg)$/); if (!m || m[1].startsWith("_") || m[1]==="test") continue;
  const out = `ai/c/${m[1]}.jpg`; if (fs.existsSync(out)) continue;
  const img = sharp(`ai/${f}`); const { width: w, height: h } = await img.metadata();
  let p = m[2] === "jpg" ? img.extract({ left: 0, top: 0, width: w, height: Math.round(h * .93) }) : img;
  await p.resize(1080, 1920, { fit: "cover", position: "top" }).jpeg({ quality: 92 }).toFile(out);
  console.log(out, w, h);
}

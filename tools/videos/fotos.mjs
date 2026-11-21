import { Client } from "@gradio/client";
import fs from "fs";
const j = JSON.parse(fs.readFileSync(process.env.USERPROFILE + "/.claude.json", "utf8"));
const tok = JSON.stringify(j).match(/hf_[A-Za-z0-9]{20,}/)[0];
const P = {
 cafe2: "fresh golden butter croissant on a small plate next to a cup of coffee on a white marble cafe table, soft morning sunlight through window, shallow depth of field, commercial food photography, ultra detailed",
 cafe3: "avocado toast with poached egg and cherry tomatoes on sourdough bread on a ceramic plate, top-down view, light oak table, natural morning light, food magazine photography, ultra detailed",
 cafe4: "close-up of barista hands pouring steamed milk into a cappuccino cup creating latte art heart, warm cafe light, cinematic shallow depth of field, commercial photography",
 barber1: "barber giving a clean skin fade haircut to a young man with electric clippers, close-up from behind, modern dark barbershop, moody cinematic lighting, editorial photography, ultra detailed",
 barber2: "classic barber tools flat lay on dark walnut wood: straight razor, black comb, steel scissors, shaving brush, top-down, dramatic directional light, commercial product photography",
 barber3: "empty vintage leather barber chair in a stylish dark barbershop with warm edison bulbs and mirrors, cinematic, wide shot, no people",
 barber4: "barber shaping a man's beard with a straight razor, close-up profile, moody warm light, cinematic photography, ultra detailed",
 gym1: "athletic woman doing battle ropes workout in a dark industrial gym, motion, sweat, dramatic side light, sports commercial photography, ultra detailed",
 gym2: "close-up of hands with chalk gripping a loaded barbell, chalk dust in the air, dark gym, dramatic rim lighting, sports commercial photography",
 gym3: "modern spacious gym interior with squat racks, dumbbells and kettlebells, dark moody lighting with red neon accents, wide angle, no people, architectural photography",
 gym4: "muscular man doing a box jump in a crossfit gym, mid-air, dramatic rim light, dark background, cinematic sports photography"
};
const only = process.argv.slice(2);
const c = await Client.connect("black-forest-labs/FLUX.1-schnell", { hf_token: tok, token: tok });
for (const [k, p] of Object.entries(P)) {
  if (only.length && !only.includes(k)) continue;
  if (!only.length && fs.existsSync(`ai/${k}.webp`)) continue;
  try {
    const r = await c.predict("/infer", { prompt: p, seed: 11, randomize_seed: false, width: 768, height: 1344, num_inference_steps: 4 });
    fs.writeFileSync(`ai/${k}.webp`, Buffer.from(await (await fetch(r.data[0].url)).arrayBuffer()));
    console.log("ok", k);
  } catch (e) { console.log("FAIL", k, String(e.message || e).slice(0, 160)); if (/quota|limit/i.test(String(e.message))) break; }
}

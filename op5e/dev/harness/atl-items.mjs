// Token-effect items (#40): the light, night-vision and disguise items carry switched-off ATL effects; switching one on changes the token itself.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const x of game.actors.filter((y) => y.name === "[ATL] Test")) await x.delete();
  for (const s of game.scenes.filter((y) => y.name === "[ATL] Scene")) await s.delete();
  let a, scene;
  try {
    ok("ATL is active", !!game.modules.get("ATL")?.active);
    const pack = game.packs.get("op5e.items"), idx = await pack.getIndex();
    a = await Actor.create({ name: "[ATL] Test", type: "character", prototypeToken: { actorLink: true } });
    scene = await Scene.create({ name: "[ATL] Scene", width: 1000, height: 1000, grid: { size: 100 } });
    const [tok] = await scene.createEmbeddedDocuments("Token", [{ name: "[ATL] Test", actorId: a.id, actorLink: true, x: 200, y: 200 }]);
    const CASES = [
      ["Torch", (t) => t.light.bright === 20 && t.light.dim === 40, "bright 20, dim 40"],
      ["Candle", (t) => t.light.bright === 5 && t.light.dim === 10, "bright 5, dim 10"],
      ["Lantern", (t) => t.light.bright === 30 && t.light.dim === 60, "bright 30, dim 60"],
      ["Night Vision Goggles (Goggles of Night)", (t) => t.sight.visionMode === "darkvision" && t.sight.range >= 60, "darkvision 60"],
    ];
    for (const [name, check, what] of CASES) {
      const e = idx.find((x) => x.name === name); if (!e) { ok(`${name} exists`, false); continue; }
      const [item] = await a.createEmbeddedDocuments("Item", [(await pack.getDocument(e._id)).toObject()]);
      const eff = [...item.effects][0];
      ok(`${name}: starts switched off`, eff?.disabled === true && !check(tok));
      await eff.update({ disabled: false }); await wait(1500);
      ok(`${name}: switched on gives the token ${what}`, check(scene.tokens.get(tok.id)), `light ${tok.light.bright}/${tok.light.dim}, vision ${tok.sight.visionMode} ${tok.sight.range}`);
      await eff.update({ disabled: true }); await wait(1500);
      ok(`${name}: switched off puts the token back`, !check(scene.tokens.get(tok.id)));
      await item.delete();
    }
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await scene?.delete().catch(() => {}); await a?.delete().catch(() => {});
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } }, { extraModules: ["ATL"] });

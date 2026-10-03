// Executes every activity of every compendium item against a target in the test world.
// Usage: node dev/harness/sweep.mjs [pack ...]   -> reports/execution-<stamp>.json (+ latest)
import { writeFileSync, mkdirSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
const packs = process.argv.slice(2).length ? process.argv.slice(2) : ["class-features", "feats", "racial-features", "items", "creations"];
const out = {};
try {
  await withFoundry(async (page, { evaluate }) => {
    page.setDefaultTimeout(120000);
    for (const pack of packs) {
      const ids = await evaluate((p) => game.packs.get(`op5e.${p}`).index.map((i) => i._id), pack);
      out[pack] = [];
      for (let i = 0; i < ids.length; i += 10) {
        const rows = await evaluate(async ({ pack, ids }) => {
          const H = game.op5eHarness, res = [];
          const atk = await H.createActor({ name: "Atk", abilities: { str: 16, dex: 14, con: 14, int: 12, wis: 12, cha: 12 }, hp: 60 });
          const tgt = await H.createActor({ name: "Tgt", hp: 200 });
          const tok = await H.createToken(tgt).catch(() => null); if (tok) H.targetToken(tok);
          for (const id of ids) {
            const doc = await game.packs.get(`op5e.${pack}`).getDocument(id); const r = { id, name: doc.name, type: doc.type, activities: [] };
            if (!doc.system.activities?.size) { r.status = "NO_ACTIVITY"; res.push(r); continue; }
            let it; try { it = await H.giveItem(atk, doc.uuid); } catch (e) { r.status = "GIVE_FAIL"; r.error = e.message; res.push(r); continue; }
            for (const a of it.system.activities) {
              H.clearConsoleErrors(); const hp0 = H.getHP(tgt).value; const x = { id: a.id, type: a.type };
              try { await Promise.race([H.executeActivity(it, a.id), new Promise((_, rej) => setTimeout(() => rej(new Error("TIMEOUT")), 8000))]); x.msgs = game.messages.size; x.targetHpDelta = H.getHP(tgt).value - hp0; x.pass = true; }
              catch (e) { x.pass = false; x.error = e.message.slice(0, 200); Object.values(ui.windows).forEach((w) => w.close({ force: true })); document.querySelectorAll("dialog[open]").forEach((d) => d.close()); }
              x.consoleErrors = H.getConsoleErrors().slice(0, 3).map((s) => s.slice(0, 200)); r.activities.push(x);
            }
            r.status = r.activities.every((x) => x.pass) ? (r.activities.some((x) => x.consoleErrors.length) ? "WARN" : "PASS") : "FAIL"; res.push(r);
            await it.delete().catch(() => {});
          }
          await H.cleanup(); return res;
        }, { pack, ids: ids.slice(i, i + 10) });
        out[pack].push(...rows); process.stdout.write(`${pack} ${out[pack].length}/${ids.length}\r`);
      }
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
mkdirSync("reports", { recursive: true });
writeFileSync("reports/execution-latest.json", JSON.stringify(out, null, 1));
const t = {}; for (const p of Object.values(out)) for (const r of p) t[r.status] = (t[r.status] ?? 0) + 1; console.log("\n", t);

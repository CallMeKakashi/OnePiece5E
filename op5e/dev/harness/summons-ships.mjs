// Assertions for summons, ships and cannons across the packs (issue #25): every summon profile resolves to a stat block, every cannon can attack and deal damage,
// every ship has hit points and armor class and links to cannons that exist. Test world, Automation user, read-only.
import { withFoundry } from "./drive.mjs";
const run = async () => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  // summons: every summon activity points at stat blocks that exist
  let acts = 0; const broken = [];
  for (const id of ["creations", "class-features", "feats", "items", "spell-lists"].map((p) => `op5e.${p}`)) {
    const pack = game.packs.get(id); if (!pack) continue;
    for (const doc of await pack.getDocuments()) for (const a of doc.system?.activities ?? []) {
      if (a.type !== "summon") continue; acts++;
      if (!a.profiles?.length) { broken.push(`${doc.name}: no profiles`); continue; }
      for (const p of a.profiles) if (p.uuid && !(await fromUuid(p.uuid))) broken.push(`${doc.name}: ${p.uuid}`);
    }
  }
  ok(`Summons: every profile of ${acts} summon activities resolves to a stat block`, acts > 0 && broken.length === 0, broken.slice(0, 5).join("; "));
  // cannons
  const cannons = await game.packs.get("op5e.ship-weapons").getDocuments(), bad = [];
  for (const c of cannons) {
    const atk = [...c.system.activities].find((a) => a.type === "attack");
    const hasDmg = atk && (atk.damage?.parts?.length || c.system.damage?.base?.number || c.system.damage?.base?.custom?.enabled);
    if (!atk || !hasDmg) bad.push(c.name);
  }
  ok(`Cannons: all ${cannons.length} have an attack activity with damage`, cannons.length >= 8 && bad.length === 0, bad.join(", "));
  const ranged = cannons.filter((c) => !c.system.range?.value && !c.system.range?.long);
  ok("Cannons: all have a range", ranged.length === 0, ranged.map((c) => c.name).join(", "));
  // ships
  const ships = await game.packs.get("op5e.ships").getDocuments(), noStats = ships.filter((s) => !(s.system.attributes?.hp?.max > 0) || !(s.system.attributes?.ac?.flat > 0 || s.system.attributes?.ac?.value > 0));
  ok(`Ships: all ${ships.length} have HP and AC`, ships.length >= 8 && noStats.length === 0, noStats.map((s) => s.name).join(", "));
  const names = new Set(cannons.map((c) => c.name)), dangling = [];
  for (const s of ships) for (const u of s.flags?.op5e?.ship?.cannons ?? []) if (!(await fromUuid(u))) dangling.push(`${s.name}: ${u}`);
  ok("Ships: every linked cannon exists", dangling.length === 0, dangling.slice(0, 3).join("; "));
  return out;
};
await withFoundry(async (page) => { for (const l of await page.evaluate(`(${run.toString()})()`)) { console.log(l); if (l.startsWith("FAIL")) process.exitCode = 1; } });

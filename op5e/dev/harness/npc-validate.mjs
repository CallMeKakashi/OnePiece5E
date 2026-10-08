// Validates the Meridian Island NPCs in the world (read-only): stats against the DMG band for their CR, every activity formula, uses, effects that really apply,
// spellcasting, boss resources, transforms, summons, and every image path (portrait, token, items, effects) with a HEAD request.
// Also lists world-wide problems (invalid documents, broken art on actors). Usage: node dev/harness/npc-validate.mjs [--world]   Test or bb-rehearsal world only.
import { withFoundry } from "./drive.mjs";
const WORLD = process.argv.includes("--world");
const run = async (WORLD) => {
  // DMG "Monster Statistics by Challenge Rating": hp min-max, armor class, damage per round
  const BAND = { 0.5: [36, 49, 13, 9, 14], 3: [101, 115, 13, 21, 26], 5: [131, 145, 15, 33, 38], 6: [146, 160, 15, 39, 44], 8: [176, 190, 16, 51, 56], 12: [236, 250, 17, 75, 80], 13: [251, 265, 18, 81, 86], 14: [266, 280, 18, 87, 92] };
  const out = { actors: [], world: {} }, probeCache = new Map();
  const probe = async (src) => { if (!src) return "none"; if (probeCache.has(src)) return probeCache.get(src); let r; try { r = (await fetch(src, { method: "HEAD" })).status; } catch { r = "err"; } probeCache.set(src, r); return r; };
  const isDefault = (s) => !s || /icons\/svg\/(mystery-man|item-bag|d20|upgrade|aura)\.svg$|systems\/dnd5e\/icons\/svg\/(actors|items)\//.test(s);
  const folder = game.folders.find((f) => f.type === "Actor" && f.name === "Meridian Island");
  const actors = WORLD ? game.actors.contents : folder.contents;
  for (const a of actors) {
    const r = { name: a.name, type: a.type, issues: [], notes: [] };
    const s = a.system, cr = s.details?.cr, hp = s.attributes.hp.max, ac = s.attributes.ac.value;
    r.stats = { level: s.details?.level, cr, ac, hp, prof: s.attributes.prof };
    if (a.items.invalidDocumentIds?.size) r.issues.push(`invalid items: ${[...a.items.invalidDocumentIds].map((id) => a.items.getInvalid(id)?.name ?? id).join(", ")}`);
    const b = BAND[cr]; if (b && !WORLD) { if (hp < b[0] || hp > b[1]) r.issues.push(`HP ${hp} outside the CR ${cr} band ${b[0]}-${b[1]}`); if (Math.abs(ac - b[2]) > 1) r.issues.push(`AC ${ac} is ${ac > b[2] ? "above" : "below"} the CR ${cr} figure ${b[2]}`); }
    // images: portrait, token, items, effects
    const imgs = new Map([[a.img, "portrait"], [a.prototypeToken.texture.src, "token"]]);
    for (const i of a.items) { imgs.set(i.img, `item ${i.name}`); for (const e of i.effects) imgs.set(e.img, `effect ${e.name}`); }
    for (const e of a.effects) imgs.set(e.img, `effect ${e.name}`);
    const bad = [], dflt = [];
    for (const [src, what] of imgs) { const st = await probe(src); if (st !== 200) bad.push(`${what}: ${src} -> ${st}`); else if (isDefault(src) && /portrait|token/.test(what)) dflt.push(what); }
    if (bad.length) r.issues.push(`broken images (${bad.length}): ${bad.slice(0, 4).join(" | ")}`);
    if (dflt.length) r.notes.push(`default ${dflt.join("/")}`);
    const dfltItems = [...a.items].filter((i) => isDefault(i.img)).map((i) => i.name); if (dfltItems.length) r.notes.push(`${dfltItems.length} items with a default icon: ${dfltItems.slice(0, 6).join(", ")}`);
    if (!WORLD) {
      // activities, uses and formulas
      const rd = a.getRollData(), badF = [];
      for (const i of a.items) {
        const um = i.system.uses?.max; if (um !== undefined && um !== "" && um !== null && !Number.isFinite(Number(i.system.uses.max))) badF.push(`${i.name} uses.max "${um}"`);
        for (const act of i.system.activities ?? []) {
          for (const p of act.damage?.parts ?? []) { const f = p.custom?.enabled ? p.custom.formula : `${p.number ?? 0}d${p.denomination ?? 0}+${p.bonus || 0}`; try { await new Roll(f, rd).evaluate({ minimize: true }); } catch { badF.push(`${i.name}/${act.name}: ${f}`); } }
          if (act.type === "save" && !(Number(act.save?.dc?.value ?? act.save?.dc?.formula) > 0) && !act.save?.dc?.calculation) badF.push(`${i.name}/${act.name}: no save DC`);
        }
      }
      if (badF.length) r.issues.push(`formula problems: ${badF.slice(0, 5).join(" | ")}`);
      // effects: every change has key and value; enabled transfer effects reach the actor
      const badE = [];
      for (const e of [...a.effects, ...[...a.items].flatMap((i) => [...i.effects])]) for (const c of e.changes) if (!c.key || c.value === undefined || c.value === "") badE.push(`${e.name}`);
      if (badE.length) r.issues.push(`effects with an empty change: ${[...new Set(badE)].join(", ")}`);
      for (const e of a.allApplicableEffects()) if (e.name === "Veteran's Edge" || e.name === "Bodyguard's Build") { const dmg = foundry.utils.getProperty(a, "system.bonuses.mwak.damage"); if (!String(dmg ?? "").includes("d")) r.issues.push(`${e.name} is on the sheet but system.bonuses.mwak.damage is "${dmg}"`); else r.notes.push(`${e.name} applies: melee damage bonus ${dmg}`); }
      // spellcasting
      const spells = a.items.filter((i) => i.type === "spell"); if (spells.length) { const sl = Object.entries(s.spells).filter(([, v]) => v.max).map(([k, v]) => `${k.replace("spell", "L")}:${v.max}`).join(" "); r.notes.push(`${spells.length} spells, DC ${s.attributes.spell.dc}, slots ${sl}`); if (!s.attributes.spellcasting) r.issues.push("spells but no spellcasting ability"); if (spells.some((sp) => !sp.system.activities?.size)) r.issues.push(`spells without a Use button: ${spells.filter((sp) => !sp.system.activities?.size).map((sp) => sp.name).join(", ")}`); }
      // boss kit
      const res = s.resources ?? {}; if (a.items.some((i) => /^Legendary Resistance/.test(i.name))) { if (!(res.legres?.max > 0) || !(res.legact?.max > 0)) r.issues.push(`legendary items but resources legres ${res.legres?.max}, legact ${res.legact?.max}`); else r.notes.push(`legendary resistance ${res.legres.max}, legendary actions ${res.legact.max}${res.lair?.value ? ", lair" : ""}`); }
      // transforms and summons point at actors that exist
      for (const i of a.items) for (const act of i.system.activities ?? []) for (const p of act.profiles ?? []) { const t = p.uuid ? await fromUuid(p.uuid) : null; if (!t) r.issues.push(`${i.name}/${act.name} points at ${p.uuid}, which does not resolve`); else r.notes.push(`${act.type} "${act.name}" -> ${t.name}`); }
      // weapons are wielded, armour is one piece
      const body = a.items.filter((i) => i.type === "equipment" && ["light", "medium", "heavy"].includes(i.system.type?.value) && i.system.equipped); if (body.length > 1) r.issues.push(`more than one body armour equipped: ${body.map((i) => i.name).join(", ")}`);
      const wielded = a.items.filter((i) => i.type === "weapon" && i.system.equipped).map((i) => i.name); r.notes.push(`wielding ${wielded.join(", ") || "nothing (natural/unarmed)"}`);
      const enc = s.attributes.encumbrance; if (enc && a.effects.has("dnd5eencumbered0")) r.issues.push("has the encumbered status effect");
    }
    out.actors.push(r);
  }
  if (WORLD) { out.world = { invalid: { actors: [...game.actors.invalidDocumentIds].map((id) => game.actors.getInvalid(id)?.name ?? id), items: [...game.items.invalidDocumentIds].map((id) => game.items.getInvalid(id)?.name ?? id), scenes: [...game.scenes.invalidDocumentIds].map((id) => game.scenes.getInvalid(id)?.name ?? id) }, summary: `${out.actors.filter((r) => r.issues.length).length} of ${out.actors.length} actors have issues` }; }
  return out;
};
await withFoundry(async (page) => {
  const res = await page.evaluate(`(${run.toString()})(${WORLD})`);
  for (const r of res.actors) { if (!r.issues.length && WORLD) continue; console.log(`\n${r.issues.length ? "FAIL" : "ok  "} ${r.name} [${r.type}] ${JSON.stringify(r.stats)}`); for (const i of r.issues) console.log("   ISSUE", i); for (const n of r.notes) console.log("   note ", n); }
  if (WORLD) console.log("\nWORLD:", JSON.stringify(res.world));
  process.exitCode = res.actors.some((r) => r.issues.length) ? 1 : 0;
});

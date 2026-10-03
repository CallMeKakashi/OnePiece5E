// Headless test of the Create-OPC wizard back end: for every class (3 species/backgrounds rotated) builds a draft and calls
// game.op5eCharacterCreator.createFromDraft(draft, {auto:true}) at levels 1, 5 and 12 (Haki), then asserts the character:
//  - exists, has race / background / class items, class level and character level as requested,
//  - has the subclass when the level reached the class's Subclass advancement level, HP > 0,
//  - point-buy abilities do not end below what was bought (species bonuses add on top),
//  - no errors were thrown and no advancement note() was raised,
// plus: an Additional Power whose ability prerequisite the draft fails is refused (nothing created).
// Usage: node dev/harness/wizard.mjs [Class ...]    env LEVELS=1,5,12 to override.   Writes reports/execution-wizard.json (test world only).
import { writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT } from "./advance-lib.mjs";

const only = process.argv.slice(2);
const levels = (process.env.LEVELS ?? "1,5,12").split(",").map(Number);
const classNames = Object.values(BUILT.classes).map((c) => c.name).filter((n) => !only.length || only.includes(n));
const plan = classNames.flatMap((cls, i) => levels.map((level) => ({ cls, level, pick: i % 3 })));

const run = async (p) => {
  const API = game.op5eCharacterCreator;
  const out = { cls: p.cls, level: p.level, fails: [], notes: [] };
  const byName = async (pack, name, type) => {
    const idx = await game.packs.get(`op5e.${pack}`).getIndex({ fields: ["type", "system.identifier", "system.classIdentifier"] });
    return idx.find((e) => e.name === name && (!type || e.type === type));
  };
  const firstOf = async (pack, type) => (await game.packs.get(`op5e.${pack}`).getIndex({ fields: ["type"] })).filter((e) => e.type === type);
  let actor = null;
  try {
    const species = (await firstOf("races", "race"))[p.pick], bg = (await firstOf("backgrounds", "background"))[p.pick];
    const cls = await byName("classes", p.cls, "class");
    const clsDoc = await game.packs.get("op5e.classes").getDocument(cls._id);
    const subLevel = clsDoc.toObject().system.advancement.find((a) => a.type === "Subclass")?.level ?? null;
    const subIdx = (await game.packs.get("op5e.subclasses").getIndex({ fields: ["type", "system.classIdentifier"] })).filter((e) => e.system?.classIdentifier === cls.system.identifier);
    const wantSub = subLevel && p.level >= subLevel && subIdx.length ? subIdx[0] : null;
    out.setup = { species: species.name, background: bg.name, subLevel, sub: wantSub?.name ?? null };

    const abilities = { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }; // point buy: 9+9+9 = 27
    const draft = {
      actorKind: "pc",
      data: {
        name: `[WZ] ${p.cls} L${p.level}`, speciesId: species._id, backgroundId: bg._id, classId: cls._id, level: p.level,
        subclassId: wantSub?._id ?? "", abilities, abilityMethod: "pointBuy", hpMode: "avg",
        haki: p.level >= 8 ? { 8: "armament", 10: "observation", 12: "conqueror" } : {},
        fork: { kind: "devilFruitLater", additionalPowerFeatId: "" },
      },
    };
    const notes = [];
    actor = await API.createFromDraft(draft, { auto: true, notes, noSheet: true });
    out.notes = notes;
    for (const n of notes) out.fails.push(`note: ${n}`);
    actor = game.actors.get(actor.id);
    const has = (type) => actor.items.some((i) => i.type === type);
    for (const t of ["race", "background", "class"]) if (!has(t)) out.fails.push(`missing ${t} item`);
    const c = actor.items.find((i) => i.type === "class");
    if (c?.system.levels !== p.level) out.fails.push(`class level ${c?.system.levels}, expected ${p.level}`);
    if (actor.system.details.level !== p.level) out.fails.push(`character level ${actor.system.details.level}, expected ${p.level}`);
    if (wantSub && !actor.items.some((i) => i.type === "subclass")) out.fails.push(`subclass ${wantSub.name} missing at level ${p.level}`);
    if (!wantSub && actor.items.some((i) => i.type === "subclass")) out.fails.push("unexpected subclass");
    if (!(actor.system.attributes.hp.max > 0)) out.fails.push(`hp max ${actor.system.attributes.hp.max}`);
    const total = Object.values(actor.system.abilities).reduce((s, a) => s + a.value, 0);
    if (total < 69) out.fails.push(`ability total ${total} below the 69 bought`);
    for (const k of ["str", "dex", "con"]) if (actor.system.abilities[k].value < 15) out.fails.push(`${k} ${actor.system.abilities[k].value} below bought 15`);
    const haki = actor.items.filter((i) => /armament|observation|conqueror/i.test(i.name) && /haki/i.test(`${i.name} ${i.system?.requirements ?? ""} ${i.system?.type?.subtype ?? ""}`)).length;
    out.haki = haki;
    out.row = { hp: actor.system.attributes.hp.max, total, items: actor.items.size, subclass: actor.items.find((i) => i.type === "subclass")?.name ?? null };
  } catch (e) {
    out.fails.push(`threw: ${String(e.message).slice(0, 200)}`);
  }
  if (actor) await game.actors.get(actor.id)?.delete().catch(() => {});
  return out;
};

const refusal = async () => {
  const API = game.op5eCharacterCreator, out = { cls: "(Additional Power refusal)", level: 1, fails: [], notes: [] };
  try {
    const idx = await game.packs.get("op5e.class-features").getIndex({ fields: ["type", "name", "flags.op5e"] });
    const roots = idx.filter((e) => e.type === "feat" && e.flags?.op5e?.additionalPowerRoot === true && e.flags?.op5e?.prereq?.abilities?.length);
    const species = (await game.packs.get("op5e.races").getIndex({ fields: ["type"] })).find((e) => e.type === "race");
    const cls = (await game.packs.get("op5e.classes").getIndex({ fields: ["type"] })).find((e) => e.type === "class");
    const abilities = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    const bad = roots.find((r) => r.flags.op5e.prereq.abilities.every((a) => a.min > 8));
    if (!bad) { out.notes.push("skipped: no Additional Power root with an ability prerequisite found"); return out; }
    const before = game.actors.size;
    let threw = null;
    try {
      const a = await API.createFromDraft({ data: { name: "[WZ] refusal", speciesId: species._id, classId: cls._id, abilities, abilityMethod: "roll", fork: { kind: "additionalPower", additionalPowerFeatId: bad._id } } }, { auto: true, noSheet: true });
      await a?.delete();
    } catch (e) { threw = String(e.message); }
    out.notes.push(`root ${bad.name}: ${threw ?? "NOT refused"}`);
    if (!threw || !/refused/i.test(threw)) out.fails.push(`unmet Additional Power ${bad.name} was not refused (${threw})`);
    if (game.actors.size !== before) { out.fails.push("an actor was left behind after the refusal"); for (const a of game.actors.filter((x) => x.name === "[WZ] refusal")) await a.delete(); }
  } catch (e) { out.fails.push(`threw: ${String(e.message).slice(0, 200)}`); }
  return out;
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(1800000);
    for (const p of plan) {
      const r = await page.evaluate(`(${run.toString()})(${JSON.stringify(p)})`).catch((e) => ({ cls: p.cls, level: p.level, fails: [`harness: ${String(e.message).slice(0, 160)}`], notes: [] }));
      results.push(r);
      console.log(`${r.fails.length ? "FAIL" : "ok  "} ${r.cls} L${r.level}${r.setup ? ` (${r.setup.species}/${r.setup.background}${r.setup.sub ? `/${r.setup.sub}` : ""})` : ""}${r.row ? ` hp ${r.row.hp} haki ${r.haki}` : ""}${r.fails.length ? `: ${r.fails.slice(0, 3).join(" | ")}` : ""}`);
    }
    const r = await page.evaluate(`(${refusal.toString()})()`).catch((e) => ({ cls: "(Additional Power refusal)", level: 1, fails: [`harness: ${String(e.message).slice(0, 160)}`], notes: [] }));
    results.push(r);
    console.log(`${r.fails.length ? "FAIL" : "ok  "} ${r.cls}: ${r.notes.join(" ")}${r.fails.length ? ` ${r.fails.join(" | ")}` : ""}`);
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-wizard.json", JSON.stringify(results, null, 1));
console.log(`== wizard: ${results.length} cases, ${results.filter((r) => r.fails.length).length} with issues`);

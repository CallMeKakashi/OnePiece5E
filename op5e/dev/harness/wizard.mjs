// Headless test of the Create-OPC wizard back end: for every class (3 species/backgrounds rotated) builds a draft and calls
// game.op5eCharacterCreator.createFromDraft(draft, {auto:true}) at levels 1, 5 and 12 (Haki), then asserts the character:
//  - exists, has race / background / class items, class level and character level as requested, exactly one role (flags.op5e.shipRole),
//  - has the subclass when the level reached the class's Subclass advancement level, HP > 0,
//  - point-buy abilities do not end below what was bought (species bonuses add on top),
//  - no errors were thrown and no advancement note() was raised.
// Role, devil fruit and Haki are class advancement choices (picked by the auto-advancer), not wizard steps.
// Usage: node dev/harness/wizard.mjs [Class ...]    env LEVELS=1,5,12 to override.   Writes reports/execution-wizard.json (test world only).
import { writeFileSync } from "node:fs";
import { withFoundry, postToGM } from "./drive.mjs";
import { BUILT } from "./advance-lib.mjs";

const only = process.argv.slice(2);
const levels = (process.env.LEVELS ?? "1,5,12").split(",").map(Number);
const classNames = Object.values(BUILT.classes).map((c) => c.name).filter((n) => !only.length || only.includes(n));
const plan = classNames.flatMap((cls, i) => levels.map((level) => ({ cls, level, pick: i % 3 })));
// dream is asserted on every case; the first two classes also run a hybrid (appearance, then combined traits)
for (const [i, hybrid] of ["appearance", "traits"].entries()) if (plan[i * levels.length]) plan.push({ ...plan[i * levels.length], hybrid });

// Starting Rules: default level 3 (level omitted from the draft) plus the free starting feat: qualifying, no prerequisite, refused (Skulker needs Dex 13, here Dex 8)
const firstCls = classNames[0];
if (firstCls) {
  plan.push({ cls: firstCls, level: 3, pick: 0, omitLevel: true, feat: "Alert" });
  plan.push({ cls: firstCls, level: 3, pick: 0, feat: "Skulker", qualifies: true });
  plan.push({ cls: firstCls, level: 3, pick: 0, feat: "Skulker", dex8: true, expectRefuse: true });
}

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

    // p.hybrid: "appearance" (note only) or "traits" (first two racial features of a second species) on top of the dream
    const speciesAll = await firstOf("races", "race");
    const hybridSecond = p.hybrid === "traits" ? speciesAll.find((s) => s._id !== species._id && (s.name !== species.name)) : null;
    let hybridFeats = [];
    if (hybridSecond) {
      const featIdx = await game.packs.get("op5e.racial-features").getIndex({ fields: ["system.requirements"] });
      hybridFeats = featIdx.filter((e) => String(e.system?.requirements ?? "").toLowerCase().startsWith(hybridSecond.name.toLowerCase())).slice(0, 2);
    }
    const abilities = p.dex8 ? { str: 15, dex: 8, con: 15, int: 15, wis: 8, cha: 8 } : { str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }; // point buy: 9+9+9 = 27
    const featDoc = p.feat ? (await game.packs.get("op5e.feats").getIndex({ fields: ["type"] })).find((e) => e.name === p.feat && e.type === "feat") : null;
    if (p.feat && !featDoc) throw new Error(`feat ${p.feat} not found in op5e.feats`);
    const draft = {
      actorKind: "pc",
      data: {
        name: `[WZ] ${p.cls} L${p.level}${p.feat ? ` ${p.feat}` : ""}`, speciesId: species._id, backgroundId: bg._id, classId: cls._id,
        ...(p.omitLevel ? {} : { level: p.level }), // omitted: the wizard default must be 3
        ...(featDoc ? { freeFeatId: featDoc._id } : {}),
        subclassId: wantSub?._id ?? "", abilities, abilityMethod: p.dex8 ? "array" : "pointBuy", hpMode: "avg",
        dream: "I want to find the All Blue <test>.",
        ...(p.hybrid === "appearance" ? { hybridMode: "appearance", hybridNote: "looks part human" } : {}),
        ...(hybridSecond ? { hybridMode: "traits", hybridSpeciesId: hybridSecond._id, hybridFeatIds: hybridFeats.map((f) => f._id) } : {}),
      },
    };
    const notes = [];
    if (p.expectRefuse) {
      let refused = null;
      try { actor = await API.createFromDraft(draft, { auto: true, notes, noSheet: true }); } catch (e) { refused = String(e.message); }
      if (!refused) out.fails.push("unmet-prerequisite free feat was not refused");
      else if (!/does not meet the requirements/.test(refused)) out.fails.push(`refusal message unclear: ${refused.slice(0, 120)}`);
      if (game.actors.some((a) => a.name === draft.data.name)) out.fails.push("half-built character left behind after refusal");
      out.refused = refused;
      actor = game.actors.find((a) => a.name === draft.data.name) ?? null;
      return out;
    }
    actor = await API.createFromDraft(draft, { auto: true, notes, noSheet: true, haki: { 8: "armament", 10: "observation", 12: "conqueror" } });
    out.notes = notes;
    for (const n of notes) out.fails.push(`note: ${n}`);
    actor = game.actors.get(actor.id);
    if (p.omitLevel && actor.system.details.level !== 3) out.fails.push(`default level ${actor.system.details.level}, expected 3`);
    if (featDoc && !actor.items.some((i) => i.type === "feat" && i.name === p.feat)) out.fails.push(`free feat ${p.feat} missing`);
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
    if (actor.flags?.op5e?.dream !== draft.data.dream) out.fails.push(`flags.op5e.dream is ${JSON.stringify(actor.flags?.op5e?.dream)}`);
    const bio = actor.system.details.biography.value ?? "";
    if (!bio.includes("<strong>Dream:</strong> I want to find the All Blue &lt;test&gt;.")) out.fails.push("biography lacks the escaped Dream paragraph");
    if (hybridFeats.length) {
      for (const f of hybridFeats) if (!actor.items.some((i) => i.name === f.name)) out.fails.push(`hybrid feature ${f.name} not imported`);
      if (!bio.includes("Hybrid (combined traits")) out.fails.push("biography lacks the combined-traits paragraph");
    } else if (draft.data.hybridMode === "appearance" && !bio.includes("Hybrid (appearance only):")) out.fails.push("biography lacks the appearance note");
    else if (draft.data.hybridMode === "traits") out.fails.push(`no racial features found for second species ${hybridSecond?.name}`);
    const roles = actor.items.filter((i) => i.flags?.op5e?.shipRole).length;
    if (roles !== 1) out.fails.push(`${roles} role feat(s), expected 1`);
    // Haki tiers are named "Color of Armament/Observation <Tier>" and "Conqueror's Haki <Tier>"; one is chosen at each of levels 8, 10, 12, 14, 16
    const haki = actor.items.filter((i) => /^(color of (armament|observation)|conqueror's haki) (novice|apprentice|journeyman|adept|master)$/i.test(i.name)).length;
    out.haki = haki;
    const wantHaki = [8, 10, 12, 14, 16].filter((l) => l <= p.level).length;
    if (haki !== wantHaki) out.fails.push(`haki: ${haki} tier(s) granted, expected ${wantHaki} by level ${p.level}`);
    out.row = { hp: actor.system.attributes.hp.max, total, items: actor.items.size, subclass: actor.items.find((i) => i.type === "subclass")?.name ?? null };
  } catch (e) {
    out.fails.push(`threw: ${String(e.message).slice(0, 200)}`);
  }
  if (actor) await game.actors.get(actor.id)?.delete().catch(() => {});
  return out;
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(1800000);
    for (const p of plan) {
      const r = await page.evaluate(`(${run.toString()})(${JSON.stringify(p)})`).catch((e) => ({ cls: p.cls, level: p.level, fails: [`harness: ${String(e.message).slice(0, 160)}`], notes: [] }));
      results.push(r);
      await postToGM(page, `<p>${r.fails.length ? "❌" : "✅"} <b>Create OPC</b> ${r.cls} level ${r.level}${r.fails.length ? ` — ${r.fails.slice(0, 2).join(" | ")}` : " ok"}</p>`);
      console.log(`${r.fails.length ? "FAIL" : "ok  "} ${r.cls} L${r.level}${r.setup ? ` (${r.setup.species}/${r.setup.background}${r.setup.sub ? `/${r.setup.sub}` : ""})` : ""}${r.row ? ` hp ${r.row.hp} haki ${r.haki}` : ""}${r.fails.length ? `: ${r.fails.slice(0, 3).join(" | ")}` : ""}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-wizard.json", JSON.stringify(results, null, 1));
console.log(`== wizard: ${results.length} cases, ${results.filter((r) => r.fails.length).length} with issues`);

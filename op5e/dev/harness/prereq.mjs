// Live test of the feat prerequisite check (scripts/prerequisites.mjs wraps FeatData#validatePrerequisites).
// Builds throw-away actors with chosen ability scores / proficiencies / race / creations and asks the real built feats whether the actor qualifies.
// Usage: node dev/harness/prereq.mjs      Writes reports/execution-prereq.json (test world only).
import { writeFileSync } from "node:fs";
import { withFoundry, postToGM } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

const cases = [
  // [feat, setup, expect (true = qualifies), label]
  ["Skulker", { dex: 12 }, false, "Dex 12 fails Dexterity 13"],
  ["Skulker", { dex: 13 }, true, "Dex 13 qualifies"],
  ["Flying Strikes", { str: 8, dex: 8 }, false, "Str 8 / Dex 8 fails Str or Dex 13"],
  ["Flying Strikes", { str: 14, dex: 8 }, true, "Str 14 satisfies the 'or'"],
  ["Inspiring Leader", { cha: 12 }, false, "Cha 12 fails"],
  ["Inspiring Leader", { cha: 13 }, true, "Cha 13 qualifies"],
  ["Cannon Master", { dex: 13 }, false, "Dex ok but no cannon proficiency"],
  ["Cannon Master", { dex: 13, weaponProf: ["cannon"] }, true, "Dex 13 + cannon proficiency"],
  ["Heavily Armored", {}, false, "no medium armor proficiency"],
  ["Heavily Armored", { armorProf: ["med"] }, true, "medium armor proficiency"],
  ["Heavy Armor Master", { armorProf: ["lgt", "med"] }, false, "light and medium only"],
  ["Heavy Armor Master", { armorProf: ["hvy"] }, true, "heavy armor proficiency"],
  ["Rapier Mastery", {}, false, "no rapier proficiency"],
  ["Rapier Mastery", { weaponProf: ["mar"] }, true, "martial category covers the rapier"],
  ["Rapier Mastery", { weaponProf: ["rapier"] }, true, "rapier proficiency by name"],
  ["Rapier Mastery", { weaponProf: ["sim"] }, false, "simple only does not cover the rapier"],
  ["Axe Mastery", { weaponProf: ["handaxe"] }, true, "any one of the listed axes is enough"],
  ["Fighting Initiate", { weaponProf: ["mar"] }, true, "martial weapon proficiency"],
  ["Fighting Initiate", { weaponProf: ["sim"] }, false, "simple is not martial"],
  ["Sea Sovereignty", { race: "Human" }, false, "Merfolk only"],
  ["Sea Sovereignty", { race: "Merfolk" }, true, "Merfolk qualifies"],
  ["Ominous Toxin", { race: "Fishman" }, true, "Fishman or Merfolk"],
  ["Electro Expert", { race: "Mink" }, true, "Mink qualifies"],
  ["Electro Expert", { race: "Human" }, false, "Human is not a Mink"],
  ["Iron-Willed", { race: "Human" }, true, "Human qualifies (sub-type left for the DM)"],
  ["Iron-Willed", { race: "Mink" }, false, "Mink is not Human"],
  ["Hulking Monolith", { str: 17, race: "Human" }, true, "Str 17, not Dwarf/Giant"],
  ["Hulking Monolith", { str: 17, race: "Giant" }, false, "Giants are excluded"],
  ["Hulking Monolith", { str: 14, race: "Human" }, false, "Str 14 fails 17"],
  ["Heightened Innovation", {}, false, "no creations"],
  ["Heightened Innovation", { spell: true }, true, "knows a creation"],
  ["Serpent’s Pact", { race: "Human", skill: "ani" }, true, "Human + Animal Handling"],
  ["Serpent’s Pact", { race: "Human" }, false, "needs Animal Handling proficiency"],
  ["Dead Man’s Grip", { race: "Augmented", str: 16 }, true, "Augmented with Str 16"],
  ["Dead Man’s Grip", { race: "Augmented", str: 14 }, false, "Str 14 fails 16"],
  ["Short Blade Master", { weaponProf: ["dagger"] }, true, "dagger"],
  ["Short Blade Master", { weaponProf: ["shortsword"] }, true, "shortsword"],
  ["Short Blade Master", {}, false, "neither"],
  ["Light Armor Master", {}, true, "requirement '3' is a source data error: not enforced"],
  ["Alert", {}, true, "no prerequisites"],
];

const run = async (spec) => {
  const out = { results: [], notes: [] };
  const mode = (m) => game.settings.set("op5e", "prerequisiteMode", m);
  const by = (n) => __op5eBuilt("feats").find((d) => d.name === n);
  const FeatData = CONFIG.Item.dataModels?.feat;
  out.wrapped = !!FeatData?.prototype?.validatePrerequisites?.__op5e;
  out.setting = game.settings.settings.has("op5e.prerequisiteMode");
  await mode("enforce");
  for (const [feat, setup, expect, label] of spec.cases) {
    const doc = by(feat);
    if (!doc) { out.results.push({ feat, label, pass: false, got: "feat not found" }); continue; }
    const sys = { abilities: Object.fromEntries(["str", "dex", "con", "int", "wis", "cha"].map((k) => [k, { value: setup[k] ?? 10 }])) };
    if (setup.skill) sys.skills = { [setup.skill]: { value: 1 } };
    const actor = await Actor.create({ name: "[PQ]", type: "character", system: sys });
    try {
      const items = [];
      if (setup.race) items.push({ name: setup.race, type: "race", system: { identifier: setup.race.toLowerCase() } });
      if (setup.spell) items.push({ name: "Test Creation", type: "spell", system: { level: 1 } });
      if (items.length) await actor.createEmbeddedDocuments("Item", items);
      const upd = {};
      if (setup.weaponProf) upd["system.traits.weaponProf.value"] = setup.weaponProf;
      if (setup.armorProf) upd["system.traits.armorProf.value"] = setup.armorProf;
      if (Object.keys(upd).length) await actor.update(upd);
      const got = doc.system.validatePrerequisites(actor);
      const ok = got === true;
      out.results.push({ feat, label, pass: ok === expect, got: ok ? true : got });
    } catch (e) { out.results.push({ feat, label, pass: false, got: `error: ${String(e.message).slice(0, 100)}` }); }
    await actor.delete().catch(() => {});
  }
  // level prerequisite on a class feature (Haki)
  const haki = __op5eBuilt("class-features").find((d) => d.name === "Color of Armament Novice");
  const a2 = await Actor.create({ name: "[PQ]", type: "character" });
  const low = haki.system.validatePrerequisites(a2, { level: 5 }), high = haki.system.validatePrerequisites(a2, { level: 8 });
  out.results.push({ feat: "Color of Armament Novice", label: "level 5 fails, level 8 qualifies", pass: low !== true && high === true, got: { low, high } });
  // modes: warn lets it through, off ignores
  const skulker = by("Skulker");
  await mode("warn"); const warn = skulker.system.validatePrerequisites(a2);
  await mode("off"); const off = skulker.system.validatePrerequisites(a2);
  await mode("enforce"); const enforce = skulker.system.validatePrerequisites(a2);
  out.results.push({ feat: "Skulker", label: "modes: warn=true, off=true, enforce=blocked", pass: warn === true && off === true && enforce !== true, got: { warn, off, enforce: enforce === true ? true : "blocked" } });
  await a2.delete().catch(() => {});
  return out;
};

const results = { rows: [] };
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(300000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    const r = await page.evaluate(`(${run.toString()})(${JSON.stringify({ cases })})`);
    Object.assign(results, r);
    console.log(`wrapper installed: ${r.wrapped}, setting registered: ${r.setting}`);
    for (const x of r.results) if (!x.pass) console.log(`FAIL ${x.feat}: ${x.label} -> ${JSON.stringify(x.got)}`);
    await postToGM(page, `<p>${r.results.every((x) => x.pass) ? "✅" : "❌"} <b>Prerequisites</b>: ${r.results.filter((x) => x.pass).length}/${r.results.length} cases pass</p>`);
    console.log(`== prerequisites: ${r.results.filter((x) => x.pass).length}/${r.results.length} pass`);
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/execution-prereq.json", JSON.stringify(results, null, 1));

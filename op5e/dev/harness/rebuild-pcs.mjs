// Rebuilds the DM-chosen player characters from the new op5e compendium (classes, race, background, subclass, feats) in the TEST world.
// Old sheet data (campaign world, read-only copy in reports/campaign-pcs-raw.json) only supplies: levels, ability scores, skill proficiencies,
// feats/gear that have an op5e equivalent. Nothing is copied one-to-one. Usage: node dev/harness/rebuild-pcs.mjs [Name ...]
import { readFileSync, writeFileSync } from "node:fs";
import { withFoundry } from "./drive.mjs";
import { BUILT, pageLib } from "./advance-lib.mjs";

// What the old sheets had that the class/race/background rebuild does not produce: art (existing files in the old one-piece-5e module folder,
// copied into modules/op5e/assets/players), Haki tiers the player actually trained, the devil fruit kind, and size.
const ART = "modules/op5e/assets/players/";
const EXTRA = {
  'Matthew "The Jack" Burgess': { art: ["the-jack.webp", "jack-token.png"], haki: ["Color of Observation Novice", "Color of Observation Apprentice"], extras: ["Six Powers Adept"] },
  Baptiste: { art: ["IMG_2905.webp", "token_1.png"], haki: ["Conqueror's Haki Novice", "Conqueror's Haki Apprentice"], fruit: "logia" },
  Malphas: { art: ["Malphas.png", "Malphas_Token.png"], haki: [], fruit: "zoan" },
  "B.O.B": { art: ["bob.png", "bob_token.png"], haki: ["Color of Armament Novice"], extras: ["Six Powers Adept"] },
  Roma: { art: ["Roma.png", "roma-token.png"], haki: ["Color of Armament Novice"], fruit: "zoan" },
  Hybrid: { art: ["Roma-Hybrid.png", "roma-hybrid-token.png"], haki: ["Color of Armament Novice"], fruit: "zoan" },
  Sulong: { art: ["roma-sulong-full.png", "sulong-roma-token.png"], haki: ["Color of Armament Novice"], fruit: "zoan", size: "huge" },
};
const OLD = JSON.parse(readFileSync("reports/campaign-pcs-raw.json", "utf8"));
const SPECS = [
  { old: 'Matthew "The Jack" Burgess', name: "Matthew \"The Jack\" Burgess", race: "Human", background: "Gambler", classes: [{ name: "Fighter", levels: 10, sub: "Gunslinger" }], note: "old Gunslinger/High Roller -> Fighter (Gunslinger)" },
  { old: 'Matthew "The Jack" Burgess', name: 'Matthew "The Jack" Burgess (Marksman)', race: "Human", background: "Gambler", classes: [{ name: "Marksman", levels: 10, sub: "Sniper" }], note: "alternate build: Marksman (Sniper) instead of Fighter (Gunslinger)" },
  { old: "Baptiste", name: "Baptiste", race: "Lunarian", background: "Boxer", classes: [{ name: "Brawler", levels: 10, sub: "Chromatic Commandment" }], note: "old Way of the Astral Self -> Chromatic Commandment (DM confirmed)" },
  { old: "Malphas", name: "Malphas", race: "Lunarian", background: "Wanderer", classes: [{ name: "Brawler", levels: 8, sub: "Drunken Master" }] },
  { old: "Thunderbird Form 1", name: "Thunderbird (Form 1)", race: "Lunarian", background: "Wanderer", classes: [{ name: "Brawler", levels: 4, sub: "Drunken Master" }] },
  { old: "Thunderbird Form 2", name: "Thunderbird (Form 2)", race: "Lunarian", background: "Wanderer", classes: [{ name: "Brawler", levels: 8, sub: "Drunken Master" }] },
  { old: "B.O.B", name: "B.O.B", race: "Augmented", background: "Scientist", classes: [{ name: "Savant", levels: 10, sub: "Necrotic Mania" }], note: "old Paladin -> Savant (Necrotic Mania)" },
  { old: "Roma", name: "Roma", race: "Mink", background: "Cook", classes: [{ name: "Fighter", levels: 3, sub: "Brute" }, { name: "Barbarian", levels: 7, sub: "Path of the Berserker" }] },
  { old: "Hybrid", name: "Hybrid", race: "Mink", background: "Cook", classes: [{ name: "Fighter", levels: 3, sub: "Brute" }, { name: "Barbarian", levels: 5, sub: "Path of the Berserker" }] },
  { old: "Sulong", name: "Sulong", race: "Mink", background: "Cook", classes: [{ name: "Fighter", levels: 3, sub: "Brute" }, { name: "Barbarian", levels: 5, sub: "Path of the Berserker" }] },
].map((s) => ({ ...s, ...EXTRA[s.name === 'Matthew "The Jack" Burgess (Marksman)' ? 'Matthew "The Jack" Burgess' : s.name === "Thunderbird (Form 1)" || s.name === "Thunderbird (Form 2)" ? "Malphas" : s.name] })).filter((s) => !process.argv.slice(2).length || process.argv.slice(2).includes(s.name));


const prefs = SPECS.map((s) => {
  const o = OLD.find((a) => a.name === s.old);
  const ab = o.system.abilities, abilities = Object.fromEntries(["str", "dex", "con", "int", "wis", "cha"].map((k) => [k, ab[k].value]));
  const skills = Object.fromEntries(Object.entries(o.system.skills ?? {}).filter(([, v]) => v.value).map(([k, v]) => [k, v.value]));
  const feats = o.items.filter((i) => i.type === "feat" && i.system?.type?.value === "feat").map((i) => i.name);
  const gear = o.items.filter((i) => ["weapon", "equipment", "consumable", "tool", "loot"].includes(i.type)).map((i) => ({ name: i.name, qty: i.system?.quantity ?? 1, equipped: !!i.system?.equipped, type: i.type }));
  const pouches = o.items.filter((i) => /^pouch of berries/i.test(i.name)).reduce((n, i) => n + (/\((\d+)K\)/i.exec(i.name) ? Number(/\((\d+)K\)/i.exec(i.name)[1]) * 1000 : 0), 0);
  const berries = (o.system.currency?.gp ?? 0) + pouches;
  return { ...s, art: s.art?.map((f) => ART + f), abilities, skills, oldFeats: feats, gear, berries, oldFeatureNames: o.items.filter((i) => i.type === "feat").map((i) => i.name) };
});

const build = async (spec) => {
  const AM = dnd5e.applications.advancement.AdvancementManager, H = game.op5eHarness;
  const log = [], issues = [], by = (pack, name) => __op5eBuilt(pack).find((d) => d.name === name);
  const persist = async (clone, name, prev) => {
    const d = clone.toObject(); delete d._id; delete d._stats; d.name = name; d.flags = { ...(d.flags ?? {}), op5e: { rebuiltFromOldSheet: true } };
    const a = await Actor.create(d, { keepId: false }); if (prev) await prev.delete(); return a;
  };
  const note = (m) => issues.push(m);
  for (const old of game.actors.filter((a) => a.name === spec.name && a.flags?.op5e?.rebuiltFromOldSheet)) await old.delete();   // replace an earlier rebuild
  let actor = await Actor.create({ name: spec.name, type: "character", flags: { op5e: { rebuiltFromOldSheet: true } }, system: { abilities: Object.fromEntries(Object.entries(spec.abilities).map(([k, v]) => [k, { value: 10 }])) } });
  // feats the old sheet had that exist in op5e (queued for class ASI levels)
  const featQueue = spec.oldFeats.map((n) => by("feats", n)).filter(Boolean);
  log.push(`feats matched: ${featQueue.map((f) => f.name).join(", ") || "none"}; no op5e equivalent: ${spec.oldFeats.filter((n) => !by("feats", n)).join(", ") || "-"}`);

  const apply = async (itemDoc, ctx, afterClone) => {
    const mgr = AM.forNewItem(actor, itemDoc.toObject(), { automaticApplication: true });
    await __op5eRun(mgr, { level: ctx.level, sub: ctx.sub ?? null, note, granted: [], featQueue });
    mgr.clone.reset(); afterClone?.(mgr.clone);
    actor = await persist(mgr.clone, spec.name, actor);
  };
  const race = by("races", spec.race), bg = by("backgrounds", spec.background);
  if (!race) note(`race ${spec.race} not found`); if (!bg) note(`background ${spec.background} not found`);
  // a level-1 class first so level-based origin advancement has a character level
  let first = true;
  for (const c of spec.classes) {
    const cls = by("classes", c.name), sub = by("subclasses", c.sub);
    if (!sub) note(`subclass ${c.sub} not found`);
    const data = cls.toObject(); data.system.levels = c.levels;
    const mgr = AM.forNewItem(actor, data, { automaticApplication: true });
    await __op5eRun(mgr, { level: c.levels, sub, note, granted: [], featQueue }); mgr.clone.reset();
    actor = await persist(mgr.clone, spec.name, actor);
    if (first) {
      first = false;
      await apply(race, { level: 1 }, (cl) => { const ri = cl.items.find((i) => i.type === "race"); if (ri) cl.updateSource({ "system.details.race": ri.id }); });
      await apply(bg, { level: 1 });
    }
  }
  // sheet-level data from the old character: final ability scores and skill proficiencies, plus gear that exists in op5e
  const upd = { "system.abilities": Object.fromEntries(Object.entries(spec.abilities).map(([k, v]) => [k, { value: v }])) };
  for (const [k, v] of Object.entries(spec.skills)) upd[`system.skills.${k}.value`] = v;
  await actor.update(upd);
  const ALIAS = [[/^death chal[ai]ce/i, "Death Chalice"], [/^green vile/i, "Green Vial (With Ace)"], [/^rolling pin - kura3.?$/i, "Rolling Pin: Kura3 (Base)"]];
  const gearAdded = [], gearMissing = [], gearStd = [];
  for (const g of spec.gear) {
    const gname = ALIAS.find(([re]) => re.test(g.name))?.[1] ?? g.name;
    const it = by("campaign-items", gname) ?? __op5eBuilt("campaign-items").find((d) => d.name.toLowerCase().replace(/[^a-z0-9]/g, "") === gname.toLowerCase().replace(/[^a-z0-9]/g, "")) ?? by("items", g.name) ?? __op5eBuilt("items").find((d) => d.name.toLowerCase() === g.name.toLowerCase());
    let it2 = it;
    if (!it2) {   // standard DMG/PHB item from the dnd5e compendiums (exact name, or the name before a "(...)" qualifier)
      const norm = (n) => n.toLowerCase().replace(/[’']/g, "'").replace(/\s*\(.*\)\s*$/, "").trim();
      const want = norm(g.name);
      for (const pk of ["dnd5e.items", "dnd5e.equipment24", "dnd5e.tradegoods"]) {
        const ent = game.packs.get(pk)?.index.contents.find((e) => norm(e.name) === want && ["weapon", "equipment", "consumable", "tool", "loot", "container"].includes(e.type));
        if (ent) { it2 = await fromUuid(ent.uuid); break; }
      }
      if (it2) gearStd.push(it2.name);
    }
    if (!it2) { gearMissing.push(g.name); continue; }
    if (actor.items.some((i) => i.name === it2.name)) continue;
    const d = it2.toObject(); delete d._id; d.system.quantity = g.qty; if ("equipped" in d.system) d.system.equipped = g.equipped;
    await actor.createEmbeddedDocuments("Item", [d], { keepId: false }); gearAdded.push(it2.name);
  }
  // ---- campaign fixes: Haki as trained, devil fruit + its forms, extras, size, Berries, art, notes
  const gone = [];
  if (spec.haki) {
    for (const it of actor.items.filter((i) => /^(Color of (Armament|Observation)|Conqueror's Haki) /.test(i.name))) { gone.push(it.name); await it.delete(); }
    for (const n of spec.haki) { const d = by("class-features", n); if (d) await actor.createEmbeddedDocuments("Item", [d.toObject()], { keepId: false }); else note(`haki ${n} missing`); }
  }
  const grant = async (pack, name) => { const d = by(pack, name); if (!d) return note(`${pack}/${name} missing`); if (!actor.items.some((i) => i.name === d.name)) await actor.createEmbeddedDocuments("Item", [d.toObject()], { keepId: false }); };
  if (spec.fruit) {
    for (const it of actor.items.filter((i) => i.name === "No Devil Fruit (yet)" || i.flags?.op5e?.devilFruitTemplate)) await it.delete();
    await grant("devil-fruits", `${spec.fruit[0].toUpperCase()}${spec.fruit.slice(1)} Devil Fruit (Template)`);
    await grant("feats", "Devil Fruit Uses");
    if (spec.fruit === "zoan") { await grant("feats", "Zoan Hybrid Form"); await grant("feats", "Zoan Full Beast Form"); }
  }
  for (const n of spec.extras ?? []) await grant("class-features", n);
  const notes = spec.oldFeatureNames.filter((n) => !actor.items.some((i) => i.name === n)).sort();
  const upd2 = { "system.traits.size": spec.size ?? "med", "system.currency.gp": spec.berries, img: spec.art ? spec.art[0] : actor.img, "prototypeToken.texture.src": spec.art ? spec.art[1] : actor.prototypeToken.texture.src,
    "system.details.biography.value": `${actor.system.details.biography.value ?? ""}<h3>Rebuilt from the old campaign sheet</h3><p>Old features without a direct equivalent (re-add by hand if still used): ${notes.join(", ")}.</p><p>Old items not found in any compendium: ${gearMissing.join(", ") || "none"}.</p>` };
  await actor.update(upd2);
  log.push(`haki replaced: ${gone.join(", ") || "-"}; berries ${spec.berries}`);
  actor.reset();
  const s = actor.system, classes = actor.items.filter((i) => i.type === "class").map((c) => `${c.name} ${c.system.levels}`), subs = actor.items.filter((i) => i.type === "subclass").map((c) => c.name);
  return {
    name: actor.name, id: actor.id, race: actor.items.find((i) => i.type === "race")?.name, background: actor.items.find((i) => i.type === "background")?.name,
    classes, subs, level: s.details.level, hp: s.attributes.hp.max, ac: s.attributes.ac.value, prof: s.attributes.prof, abilities: Object.fromEntries(Object.entries(s.abilities).map(([k, v]) => [k, v.value])),
    features: actor.items.filter((i) => i.type === "feat").length, feats: actor.items.filter((i) => i.type === "feat" && i.system.type?.value === "feat").map((i) => i.name),
    skillsProf: Object.entries(s.skills).filter(([, v]) => v.value).length, gearAdded: gearAdded.length, gearStd, gearMissing, issues, log,
  };
};

const results = [];
try {
  await withFoundry(async (page) => {
    page.setDefaultTimeout(600000);
    await page.evaluate(`(${pageLib.toString()})(${JSON.stringify(BUILT)})`);
    for (const p of prefs) {
      const r = await page.evaluate(`(${build.toString()})(${JSON.stringify(p)})`).catch((e) => ({ name: p.name, fatal: String(e.message).slice(0, 300) }));
      r.note = p.note; results.push(r);
      console.log(r.fatal ? `FAIL ${p.name}: ${r.fatal}` : `${r.name}: ${r.race} / ${r.background} / ${r.classes.join(" + ")} (${r.subs.join(", ")}) L${r.level} hp ${r.hp} ac ${r.ac}, ${r.features} features, feats [${r.feats.join(", ")}], gear +${r.gearAdded}, issues ${r.issues.length}`);
    }
  });
} catch (e) { console.log(e.code ?? e.stack); process.exit(2); }
writeFileSync("reports/rebuilt-pcs.json", JSON.stringify(results, null, 1));

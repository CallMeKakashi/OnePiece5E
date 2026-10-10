// Serica and Veyl Corven (Sixfold): Human, level 12, bonded siblings. Built 2026-10-10 from the real pipeline.
//  Serica: Barbarian 8 (Cannoneer) / Rogue 4 (Swashbuckler), Mercenary, Master at Arms, Buki Buki no Mi.
//  Veyl:   Rogue 8 (Swashbuckler) / Brawler 4 (Six Powers Master), Acrobat, Helmsman, Soku Soku no Mi.
// Chassis halves: specs/serica-spec.json + serica-rogue-spec.json, specs/veyl-spec.json + veyl-brawler-spec.json.
// Fruit powers map to compendium items where one exists; Snatch, Freight Train, Call and Response and the Speed-Speed passive are homebrew.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { embedOwnedItem } from "./compendium-resolver.js";
import { refreshFromPacks, standaloneSummons, wireSpirit, limitedUse } from "./refresh-from-packs.js";
import { ensureFeatureActivities, ensureItemActivities } from "../../data/helpers/activities.js";
import { generateId } from "../../data/helpers/id.js";
import creations from "../../data/src/creations/index.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

type Doc = { _id: string; name?: string; type?: string; system: Record<string, any> } & Record<string, any>;
const ACTORS = "../Foundry/actors-json";
const read = (f: string) => JSON.parse(readFileSync(`${ACTORS}/${f}.json`, "utf-8"));
const pack = (p: string, name: string): Doc => {
  for (const f of readdirSync(`packs-src/${p}`)) { const d = JSON.parse(readFileSync(`packs-src/${p}/${f}`, "utf-8")); if (d.name === name) return d; }
  throw new Error(`${p}/${name} not found`);
};
const emb = (p: string, name: string) => embedOwnedItem(pack(p, name) as never) as Doc;
const creation = (name: string) => {
  const c = (creations as Doc[]).find((x) => x.name === name);
  if (!c) throw new Error(`Creation not found: ${name}`);
  return embedOwnedItem(ensureItemActivities({ ...structuredClone(c), system: { ...structuredClone(c.system), preparation: { mode: "always", prepared: true } } } as never) as never) as Doc;
};
const SKILL_ABILITY: Record<string, string> = { acr: "dex", ani: "wis", arc: "int", ath: "str", dec: "cha", his: "int", ins: "wis", itm: "cha", inv: "int", med: "wis", nat: "int", prc: "wis", prf: "cha", per: "cha", rel: "int", slt: "dex", ste: "dex", sur: "wis" };

// homebrew feature through op5e's own schema helper (same shape as build-cadence-custom.ts)
function feat(idPath: string, name: string, img: string, description: string, requirements: string, o: {
  activation: { type: string; cost: number | null; condition?: string };
  actionType?: string; damage?: [string, string][]; save?: { ability: string; dc: number };
  uses?: Doc; range?: Doc; target?: Doc; effects?: Doc[];
}): Doc {
  return embedOwnedItem(ensureFeatureActivities({
    _id: generateId(idPath), name, type: "feat", img,
    system: {
      description: { value: description, chat: "" }, source: { book: "Blood & Brine homebrew", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" }, requirements,
      activation: { type: o.activation.type, cost: o.activation.cost, condition: o.activation.condition ?? "" },
      duration: { value: null, units: "" }, target: o.target ?? { value: null, width: null, units: "", type: "" },
      range: o.range ?? { value: null, long: null, units: "" }, uses: o.uses ?? { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: o.actionType ?? "", damage: { parts: o.damage ?? [], versatile: "" },
      save: o.save ? { ability: o.save.ability, dc: o.save.dc, scaling: "flat" } : { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "", recharge: { value: null, charged: false },
    },
    effects: o.effects ?? [], flags: {}, folder: null, sort: 0, ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem) as never) as Doc;
}
const one = { value: 1, width: null, units: "ft", type: "creature" };

interface Cfg {
  slug: string; name: string; chassis: string; part: string; partKeep: string[]; drop: string[]; equip: string[];
  fruitId: string; fruitName: string; fruitText: string; dfuMax: number; dfuNote: string; spellAbility: string; saves: string[];
  armor: string[]; abil: Record<string, number>; skills: Record<string, number>; tools: Record<string, number>;
  hp: number; hpFormula: string; cr: number; bio: string; img: string; token: string; ability: string; dc: number;
  extra: (items: Doc[], spend: (n: string, text: string) => Doc, dfu: Doc) => void;
}

function build(c: Cfg) {
  const ch = read(c.chassis), part = read(c.part);
  // ---- merge the second class's half: class, subclass and the features named in partKeep
  const fromPart = (part.items as Doc[]).filter((i) => i.type === "class" || i.type === "subclass" || c.partKeep.includes(i.name ?? ""));
  const seenExp = new Set<string>();
  const items: Doc[] = [...(ch.items as Doc[]).filter((i) => !c.drop.includes(i.name ?? "")), ...fromPart];
  for (const i of items) if (i.name === "Expertise") i.name = seenExp.size ? "Expertise (Rogue, level 6)" : (seenExp.add("x"), "Expertise (Rogue)");
  // one of each Role, one of each Haki, no fruit placeholder
  const seen = new Set<string>();
  const clean = items.filter((i) => {
    if (i.name === "No Devil Fruit (yet)") return false;
    if (!i.name || !(i.name.startsWith("Role: ") || /^Color of (Observation|Armament) Novice$/.test(i.name) || ["Martial Adept", "Dual Wielder", "Playing Card Set", "Thieves' Tools", "Disguise Kit"].includes(i.name))) return true;
    if (seen.has(i.name)) return false;
    seen.add(i.name); return true;
  });
  items.length = 0; items.push(...clean);

  // ---- fruit, Fruit Uses and the standard Paramecia features
  items.push(emb("devil-fruits", c.fruitName));
  const dfu = emb("feats", "Devil Fruit Uses");
  dfu.system.uses = { spent: 0, max: String(c.dfuMax), recovery: [{ period: "lr", type: "recoverAll" }] };
  dfu.system.description.value += `<p>${c.dfuNote} Regain all on a long rest.</p>`;
  items.push(dfu);
  for (const n of ["Devil Fruit Ability Check, Fruit-Fruit DC and Attack", "Ocean's Scorn", "Paramecia Improved Usage"]) items.push(emb("feats", n));
  const fruit = items.find((i) => i.name === c.fruitName)!;
  fruit.system.description.value = c.fruitText + fruit.system.description.value;

  // limited-use features: legacy uses.per -> uses.recovery
  const recover = (list: Doc[]) => { for (const i of list) { const u = i.system?.uses; if (u?.max && ["sr", "lr"].includes(u.per)) { u.recovery = [{ period: u.per, type: "recoverAll" }]; u.per = null; } } };
  const spend = (n: string, text: string) => {
    const it = items.find((i) => i.name === n);
    if (!it) throw new Error(`spend: ${n} missing`);
    it.system.uses = { spent: 0, max: "", recovery: [] };
    it.system.description.value = `<p>${text}</p>` + it.system.description.value;
    for (const a of Object.values(it.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] };
    return it;
  };
  c.extra(items, spend, dfu);
  recover(items);
  const auto = refreshFromPacks(items);
  if (c.slug === "serica") { // Martial Adept: two superiority dice (d8, short rest) and the maneuver Precision Attack, spending those dice
    const ma = items.find((i) => i.name === "Martial Adept"); if (ma) limitedUse(ma, { max: "2", per: "sr", condition: "a superiority die, used by a maneuver" });
    for (const mv of ["Precision Attack", "Menacing Attack"]) { // the two maneuvers the user picked
      const pf = readdirSync("packs-src/class-features").find((f) => JSON.parse(readFileSync(`packs-src/class-features/${f}`, "utf-8")).name === mv);
      if (!pf) continue;
      const m = embedOwnedItem(JSON.parse(readFileSync(`packs-src/class-features/${pf}`, "utf-8")) as never) as Doc;
      for (const a of Object.values(m.system.activities ?? {}) as Doc[]) for (const t of a.consumption?.targets ?? []) t.target = "martial-adept";
      items.push(m);
    }
  }
  const spiritWired = wireSpirit(items); if (spiritWired.length) console.log(`${c.name}: spirit cost wired on ${spiritWired.join(", ")}`);
  console.log(`${c.name}: automation copied onto ${auto.refreshed.length} features; no pack match for: ${auto.unmatched.join(", ") || "none"}`);
  const summons = standaloneSummons(items, ACTORS, c.slug);
  if (summons.length) console.log(`summon actors written: ${summons.join(", ")}`);

  for (const i of items) {
    if (c.equip.includes(i.name ?? "") && i.system) i.system.equipped = true;
    if (i.type === "tool") i.system.proficient = i.name === "Thieves' Tools" ? 2 : (c.tools[i.name ?? ""] ?? 1);
  }

  // no legacy damage.parts holding @scale (Foundry refuses it as an unresolved term; the real formula is in the activity)
  for (const i of items) { const parts = i.system?.damage?.parts; if (Array.isArray(parts) && JSON.stringify(parts).includes("@scale") && Object.keys(i.system.activities ?? {}).length) i.system.damage.parts = []; }

  // ---- numbers
  const sys = ch.system;
  for (const [k, v] of Object.entries(c.abil)) sys.abilities[k].value = v;
  for (const k of Object.keys(c.abil)) sys.abilities[k].proficient = c.saves.includes(k) ? 1 : 0;
  sys.skills = Object.fromEntries(Object.entries(SKILL_ABILITY).map(([k, ab]) => [k, { value: c.skills[k] ?? 0, ability: ab }]));
  sys.traits.armorProf = { value: c.armor, custom: "" };
  sys.traits.weaponProf = { value: ["sim", "mar"], custom: "" };
  sys.attributes.spellcasting = c.spellAbility;
  sys.attributes.hp = { value: c.hp, max: c.hp, temp: 0, tempmax: 0, formula: c.hpFormula };
  sys.details.cr = c.cr; sys.details.level = 12;
  sys.attributes.prof = 4; sys.attributes.movement.swim = 0; // Sourcebook: +4 at levels 9-12; Ocean's Scorn
  sys.details.biography.value = c.bio;
  ch.items = items; ch.name = c.name;
  if (c.img) { ch.img = c.img; ch.prototypeToken = { ...(ch.prototypeToken ?? {}), texture: { ...(ch.prototypeToken?.texture ?? {}), src: c.token } }; }
  writeFileSync(`${ACTORS}/${c.slug}.json`, JSON.stringify(ch, null, 2), "utf-8");
  console.log(`Wrote ${ACTORS}/${c.slug}.json (${items.length} items)`);
}

const ICON_FIRE = "icons/magic/fire/projectile-fireball-orange.webp";
const ICON_WIND = "icons/magic/air/wind-tornado-wall-blue.webp";
const sericaBio = "<p>Serica Corven, a muscular woman with warm tan skin, vivid green eyes and thick purple hair in a high, messy ponytail, with unruly strands framing her face. Strong eyebrows, a few small scars and scratches across her face and arms, and a wide, mischievous grin. She wears a dark, sleeveless charcoal-green top with sturdy brown leather harness straps across her shoulders and chest. Broad shoulders and heavily developed arms give her a powerful, athletic build.</p><p>Mercenary of the Sixfold and bonded sibling (not by blood) of Veyl. Eater of the Buki Buki no Mi: she carries no weapons because she forms them from her own body.</p>";
const veylBio = "<p>Veyl Corven, a lean, athletic man with warm tan skin, sharp features, narrow expressive eyes and tousled purple hair tied back in a loose ponytail, long strands falling around his face. Light stubble along his jaw and chin, a few subtle facial marks, and a confident, crooked smirk. He wears a weathered brown leather jacket with a raised collar and brass buttons over a loose, off-white shirt with an open neckline. His relaxed posture and slightly dishevelled look suit a roguish, self-assured adventurer.</p><p>Mercenary of the Sixfold and bonded sibling (not by blood) of Serica. Eater of the Soku Soku no Mi.</p>";

// ===================== Serica =====================
build({
  slug: "serica", name: "Serica Corven", chassis: "serica-chassis", part: "serica-rogue-part", ability: "str", dc: 16,
  partKeep: ["Fancy Footwork", "Rakish Audacity", "Expertise", "Sneak Attack", "Thieves' Cant", "Cunning Action", "Steady Aim", "Thieves' Tools"],
  drop: ["Javelin", "Handaxe", "Greataxe"],
  equip: ["Glaive (formed, primary)", "Glaive (formed, secondary)", "Pon Pon Pon (formed Pistol)"],
  fruitId: "6280dd1ec0742cba", fruitName: "Buki Buki no Mi",
  fruitText: "<p><strong>Weapon-Weapon Fruit (Paramecia).</strong> Serica carries no weapons: her two Glaives, her Pistol and her cannon are her own body, formed on demand. Basic formed-weapon attacks (Glaives, Pon Pon Pon, Play with Fire) cost no Fruit Use; Bang Bang, Cannonball and Snatch each spend one. Ammo capacity (trained): more conjured bullets for the ranged weapons she is proficient with; Cannonball becomes a rotating cannon that fires three times, and she must compose herself afterward.</p>",
  dfuMax: 7, dfuNote: "Serica (level 12): 6 uses from level (one per odd level) + 1 for Paramecia = 7.",
  spellAbility: "str", saves: ["str", "con"], armor: ["lgt", "med", "shl"],
  abil: { str: 19, dex: 16, con: 16, int: 8, wis: 12, cha: 10 }, // base 16/14/15/8/12/10; Human +1 Str/Dex/Con; ASI +2 Str; Cannon Master +1 Dex
  skills: { prc: 1, sur: 1, ath: 2, itm: 2, ins: 1, per: 1, acr: 1, slt: 1, inv: 1, prf: 1 },
  tools: { "Playing Card Set": 1 },
  hp: 161, hpFormula: "8d12 + 4d8 + 36", cr: 7, bio: sericaBio + "<p><strong>Balance note (CR 7):</strong> the real formula (8d12 + 4d8 + 36) gives 117 hit points, below the CR 7 band, so hit points are overridden to 161. No bonus feature was added.</p>", img: "one-piece-5e/npcs/Sixfolds/serica-new.jpg", token: "one-piece-5e/npcs/Sixfolds/serica-new-token.png",
  extra(items, spend) {
    // two formed Glaives
    const g1 = items.find((i) => i.name === "Glaive")!;
    g1.name = "Glaive (formed, primary)";
    const g2 = { ...structuredClone(g1), _id: generateId("homebrew/serica/glaive-secondary"), name: "Glaive (formed, secondary)" } as Doc;
    for (const g of [g1, g2]) g.system.description.value = "<p>Formed from Serica's body by the Buki Buki no Mi; she carries no actual weapon.</p>" + g.system.description.value;
    items.push(g2);
    // feats (ASI levels: Barbarian 4 Cannon Master, Barbarian 8 +2 Str, Rogue 4 Savage Attacker)
    for (const n of ["Cannon Master", "Savage Attacker"]) items.push(emb("feats", n));
    // Haki: Armament Apprentice (level 10), Observation Novice (level 12)
    for (const n of ["Color of Armament Apprentice", "Color of Observation Novice"]) items.push(emb("class-features", n));
    // fruit powers mapped to compendium items
    const pistol = emb("items", "Pistol"); pistol.name = "Pon Pon Pon (formed Pistol)";
    pistol.system.description.value = "<p><strong>Pon Pon Pon (Buki Buki no Mi).</strong> A limb becomes a pistol and fires conjured bullets. No Fruit Use.</p>" + pistol.system.description.value;
    items.push(pistol);
    items.push(creation("Barrage"), creation("Construct Cannon"), creation("Burning Blade"));
    spend("Barrage", "<strong>Bang Bang (Buki Buki no Mi).</strong> A limb becomes a machine gun and sprays conjured bullets in a cone. Spends one Devil Fruit Use.");
    spend("Construct Cannon", "<strong>Cannonball (Buki Buki no Mi).</strong> A limb becomes a cannon; trained, it rotates and fires three times, after which she must compose herself. Spends one Devil Fruit Use.");
    const pw = items.find((i) => i.name === "Burning Blade")!;
    pw.system.description.value = "<p><strong>Play with Fire (Buki Buki no Mi).</strong> A limb becomes a blade and she superheats it. At will, no Fruit Use.</p>" + pw.system.description.value;
    // homebrew: Snatch (Action, 30 ft, Str save vs Fruit-Fruit DC 16, 1 use)
    const dfu = items.find((i) => i.name === "Devil Fruit Uses")!;
    const snatch = feat("homebrew/serica/snatch", "Snatch (Buki Buki no Mi)", "icons/magic/control/silhouette-grow-shrink-tan.webp",
      "<p><strong>Pop-Off Style: Snatch.</strong> Action. A limb becomes a grappling arm that lashes out at one creature within 30 feet. It makes a Strength saving throw against the Fruit-Fruit DC (16). On a failure it is pulled up to 30 feet to an unoccupied space adjacent to Serica and is grappled by her. Spends one Devil Fruit Use. <em>Homebrew: the Sourcebook gives fruit abilities no stats.</em></p>",
      "Buki Buki no Mi", { activation: { type: "action", cost: 1 }, actionType: "save", save: { ability: "str", dc: 16 }, range: { value: 30, long: null, units: "ft" }, target: one });
    items.push(snatch);
    for (const a of Object.values(snatch.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] };
  },
});

// ===================== Veyl =====================
build({
  slug: "veyl", name: "Veyl Corven", chassis: "veyl-chassis", part: "veyl-brawler-part", ability: "dex", dc: 17,
  partKeep: ["Six Techniques", "Brawling", "Unarmored Defense", "Brawler Unarmed Strike", "Spirit", "Flurry of Blows", "Patient Defense", "Deft Escape", "Unarmored Movement", "Deflect Missiles", "Brace for Impact"],
  drop: ["Leather Armor", "Rapier", "Shortsword", "Arrows (20)"],
  equip: ["Thumb Daggers (Dagger)"],
  fruitId: "0be63bfbf040bb43", fruitName: "Soku Soku no Mi",
  fruitText: "<p><strong>Speed-Speed Fruit (Paramecia).</strong> Veyl's base walking speed is 120 feet (Speed-Speed passive). Jazz Styles Skimming the Surface, Upper Air, Double Time, Freight Train and Shadow Play, and Rim Shot each spend one Fruit Use; Call and Response is once per long rest. Tempo Fuerte (trained): baseline speed and reach across all Jazz Style techniques; Caravan: carry more allies at once at full speed.</p>",
  dfuMax: 7, dfuNote: "Veyl (level 12): 6 uses from level (one per odd level) + 1 for Paramecia = 7.",
  spellAbility: "dex", saves: ["dex", "int"], armor: [],
  abil: { str: 10, dex: 20, con: 14, int: 10, wis: 16, cha: 12 }, // base 10/16/14/10/13/12; Human +2 Dex +1 Wis; Graceful Dexterity +1 Dex; ASI +1 Dex +1 Wis; Alert +1 Wis
  skills: { acr: 2, ath: 2, slt: 1, ins: 1, ste: 2, prc: 1, inv: 1, per: 1, itm: 1, sur: 1 },
  tools: {},
  hp: 146, hpFormula: "12d8 + 24", cr: 6, bio: veylBio + "<p><strong>Balance note (CR 6):</strong> the real formula (12d8 + 24) gives 87 hit points, below the CR 6 band, so hit points are overridden to 146. No bonus feature was added.</p>", img: "one-piece-5e/npcs/Sixfolds/veyl-new.jpg", token: "one-piece-5e/npcs/Sixfolds/veyl-new-token.png",
  extra(items, spend) {
    const dag = items.find((i) => i.name === "Dagger"); if (dag) dag.name = "Thumb Daggers (Dagger)";
    for (const n of ["Mobile", "Alert"]) items.push(emb("feats", n));
    // Haki: Armament Novice (level 10), Armament Apprentice (level 12); Observation Novice is level 8
    for (const n of ["Color of Armament Novice", "Color of Armament Apprentice"]) items.push(emb("class-features", n));
    // fruit powers mapped to compendium items
    items.push(creation("Water Walk (R)"), creation("Fly"), creation("Haste"), creation("Thunderwave"), emb("class-features", "Afterimage"));
    spend("Water Walk (R)", "<strong>Jazz Style: Skimming the Surface (Soku Soku no Mi).</strong> Run across open water as if it were solid ground. Spends one Devil Fruit Use.");
    spend("Fly", "<strong>Jazz Style: Upper Air (Soku Soku no Mi).</strong> Sky-walk through open air by combining armament Haki footing with fruit momentum. Spends one Devil Fruit Use.");
    spend("Haste", "<strong>Jazz Style: Double Time (Soku Soku no Mi).</strong> The fruit compresses his tempo, so his bonus actions, reactions and turn structure effectively run at a higher action economy. Spends one Devil Fruit Use.");
    spend("Thunderwave", "<strong>Jazz Style: Rim Shot (Soku Soku no Mi).</strong> When he snaps past the sound barrier, the passage detonates a concussive sonic boom along his line of movement. Spends one Devil Fruit Use.");
    spend("Afterimage", "<strong>Jazz Style: Shadow Play (Soku Soku no Mi).</strong> At full tempo he leaves speed-blurred afterimages in his wake that confuse pursuit and targeting. Spends one Devil Fruit Use.");
    const dfu = items.find((i) => i.name === "Devil Fruit Uses")!;
    const spendOn = (it: Doc) => { for (const a of Object.values(it.system.activities ?? {}) as any[]) a.consumption = { ...(a.consumption ?? {}), targets: [{ type: "itemUses", target: dfu._id, value: "1", scaling: {} }] }; };
    // homebrew: Speed-Speed passive (base walk 120 ft)
    items.push(feat("homebrew/veyl/speed-speed", "Speed-Speed (Soku Soku no Mi)", "icons/skills/movement/feet-winged-boots-brown.webp",
      "<p>Passive. Veyl's walking speed is 120 feet (the fruit's table value), before Mobile and Unarmored Movement. <em>Homebrew: set by an effect adding 90 feet to the base 30.</em></p>", "Soku Soku no Mi",
      { activation: { type: "special", cost: null, condition: "Passive" }, effects: [{
        _id: generateId("effect/veyl/speed-speed"), name: "Speed-Speed", img: "icons/skills/movement/feet-winged-boots-brown.webp", disabled: false, transfer: true,
        changes: [{ key: "system.attributes.movement.walk", mode: 2, value: "90", priority: 20 }],
        duration: { startTime: null, seconds: null, rounds: null, turns: null, combat: null }, origin: null, flags: {}, statuses: [], tint: null }] }));
    // homebrew: Freight Train (Action, 1 use, Str save vs 17, 4d8 bludgeoning)
    const train = feat("homebrew/veyl/freight-train", "Jazz Style: Freight Train (Soku Soku no Mi)", "icons/skills/movement/arrow-upward-yellow.webp",
      "<p>Action. Veyl moves up to his full speed in a straight line and barrels through every creature in his path. Each makes a Strength saving throw against the Fruit-Fruit DC (17), taking 4d8 bludgeoning damage on a failure or half as much on a success. Spends one Devil Fruit Use. <em>Homebrew: the Sourcebook gives fruit abilities no stats.</em></p>",
      "Soku Soku no Mi", { activation: { type: "action", cost: 1 }, actionType: "save", save: { ability: "str", dc: 17 }, damage: [["4d8", "bludgeoning"]], range: { value: null, long: null, units: "self" } });
    items.push(train); spendOn(train);
    // homebrew: Call and Response (Action, once per long rest, loan his speed to an ally for one turn)
    items.push(feat("homebrew/veyl/call-and-response", "Jazz Style: Call and Response (Soku Soku no Mi)", "icons/magic/time/hourglass-tilted-glowing-gold.webp",
      "<p>Action, once per long rest. Veyl pushes the fruit to its limit and loans his speed to one willing creature within 30 feet for one turn: its speed doubles and it takes one additional action on its turn (Attack with one weapon attack only, Dash, Disengage, Hide or Use an Object). <em>Homebrew: the Sourcebook gives fruit abilities no stats.</em></p>",
      "Soku Soku no Mi", { activation: { type: "action", cost: 1 }, uses: { value: 1, max: "1", per: "lr", recovery: "", prompt: true }, range: { value: 30, long: null, units: "ft" }, target: one }));
  },
});

import { MODULE_ID } from "./constants.mjs";

/**
 * Prerequisite checks for feats and features (the book's "you must meet any prerequisite").
 *
 * dnd5e natively validates only item presence, level and repeatability. The build parses each requirement into
 * flags.op5e.prereq (data/helpers/prereq.ts): ability scores, weapon/armor/tool/skill proficiency, race, creation use, level.
 * This wraps FeatData#validatePrerequisites so every flow that already asks it - the ASI feat picker, Item Choice pools,
 * Foundry's level-up, the character wizard - also enforces these. Requirements we cannot check (sub-race, size, horns...)
 * are listed as notes for the DM and never block.
 */

const SETTING = "prerequisiteMode";
const SKILL_ABBR = { acrobatics: "acr", "animal handling": "ani", arcana: "arc", athletics: "ath", deception: "dec", history: "his", insight: "ins", intimidation: "itm", investigation: "inv", medicine: "med", nature: "nat", perception: "prc", performance: "prf", persuasion: "per", religion: "rel", "sleight of hand": "slt", stealth: "ste", survival: "sur" };
const ABILITY_LABEL = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };

// weapon names in the book are plural ("handaxes", "glaives", "quarterstaffs"): strip one trailing "s", keep "cutlass"/"lance"
const singular = (s) => String(s).toLowerCase().replace(/[’']/g, "'").trim().replace(/ies$/, "y").replace(/([^s])s$/, "$1");
const slug = (s) => singular(s).replace(/[^a-z0-9]/g, "");

let weaponTypes = null; // slug -> "sim" | "mar", read once from the op5e items pack index
async function loadWeaponTypes() {
  if (weaponTypes) return weaponTypes;
  weaponTypes = new Map();
  for (const pack of [game.packs.get("op5e.items"), game.packs.get("dnd5e.items")]) {
    if (!pack) continue;
    const index = await pack.getIndex({ fields: ["system.type.value", "system.type.baseItem"] }).catch(() => []);
    for (const e of index) {
      const t = e.system?.type?.value;
      if (!/^(simple|martial)[MR]$/.test(t ?? "")) continue;
      const cat = t.startsWith("simple") ? "sim" : "mar";
      weaponTypes.set(slug(e.name), cat);
      if (e.system?.type?.baseItem) weaponTypes.set(e.system.type.baseItem, cat);
    }
  }
  return weaponTypes;
}

function hasWeaponProficiency(actor, name) {
  const prof = actor.system.traits?.weaponProf;
  const have = new Set(prof?.value ?? []);
  const custom = String(prof?.custom ?? "").toLowerCase();
  const n = singular(name);
  if (/^(martial|simple)\b/.test(n)) return have.has(n.startsWith("martial") ? "mar" : "sim");
  const s = slug(name);
  if (have.has(s) || custom.includes(n)) return true;
  const cat = weaponTypes?.get(s);
  if (cat && have.has(cat)) return true;
  // dnd5e lists the three crossbows separately
  if (s === "crossbow") return ["lightcrossbow", "handcrossbow", "heavycrossbow"].some((x) => have.has(x));
  return false;
}

function hasArmorProficiency(actor, name) {
  const code = { light: "lgt", medium: "med", heavy: "hvy", shield: "shl" }[singular(name)];
  return !!code && (actor.system.traits?.armorProf?.value ?? new Set()).has(code);
}

function raceName(actor) {
  return actor.items.find((i) => i.type === "race")?.name ?? "";
}

/** @returns {{unmet: string[], notes: string[]}} */
const cap = (x) => x[0].toUpperCase() + x.slice(1);

export function checkPrereq(prereq, actor, { level, added = [] } = {}) {
  const unmet = [], notes = [...(prereq?.manual ?? [])];
  if (!prereq) return { unmet, notes };
  for (const a of prereq.abilities ?? []) {
    if (!a.any.some((k) => (actor.system.abilities?.[k]?.value ?? 0) >= a.min)) unmet.push(`${a.any.map((k) => ABILITY_LABEL[k]).join(" or ")} ${a.min} or higher`);
  }
  for (const p of prereq.proficiencies ?? []) {
    let ok = false;
    if (p.kind === "weapon") ok = p.names.some((n) => hasWeaponProficiency(actor, n));
    else if (p.kind === "armor") ok = p.names.some((n) => hasArmorProficiency(actor, n));
    else if (p.kind === "skill") ok = p.names.some((n) => (actor.system.skills?.[SKILL_ABBR[n]]?.value ?? 0) >= 1);
    else {   // tools: match a proficient tool by name; a category such as "musical instrument" matches any proficient tool of that category
      const have = Object.entries(actor.system.tools ?? {}).filter(([, t]) => (t?.value ?? 0) > 0).map(([k]) => k.toLowerCase());
      const trait = [...(actor.system.traits?.toolProf?.value ?? [])].map((x) => String(x).toLowerCase());
      ok = p.names.some((n) => [...have, ...trait].some((h) => h.includes(slug(n)) || slug(n).includes(h) || (/instrument/.test(n) && /music|instrument|lute|flute|drum|lyre|horn|viol|shawm|\bpan\b|bagpipe|dulcimer|piano|guitar/.test(h))));
    }
    if (!ok) unmet.push(`${p.kind} proficiency: ${p.names.join(" or ")}`);
  }
  if (prereq.races?.length) {
    const r = raceName(actor).toLowerCase();
    if (!prereq.races.some((x) => r.includes(x.toLowerCase()))) unmet.push(`${prereq.races.join(" or ")} race`);
  }
  if (prereq.notRaces?.length) {
    const r = raceName(actor).toLowerCase();
    const bad = prereq.notRaces.find((x) => r.includes(x.toLowerCase()));
    if (bad) unmet.push(`not a ${cap(bad)}`);
  }
  if (prereq.creation) {
    const can = actor.items.some((i) => i.type === "spell") || actor.items.some((i) => i.type === "class" && i.system.spellcasting?.progression && i.system.spellcasting.progression !== "none")
      || added.some((i) => i.type === "spell");
    if (!can) unmet.push("the ability to use creations");
  }
  if (prereq.devilFruit) {
    // the template and the fruits made from it carry flags.op5e.devilFruitTemplate; a renamed fruit keeps it
    const kind = prereq.devilFruit, fruits = [...actor.items, ...added];
    const has = fruits.some((i) => i.flags?.op5e?.devilFruitTemplate === kind || new RegExp(`devil fruit:\\s*${kind}`, "i").test(i.name));
    if (!has) unmet.push(`a ${cap(kind)} devil fruit`);
  }
  if (prereq.level && (level ?? actor.system.details?.level ?? 0) < prereq.level) unmet.push(`level ${prereq.level}`);
  return { unmet, notes };
}

/** Unmet op5e prerequisites for an item (document or data) on an actor; empty when it qualifies. */
export function unmetPrerequisites(item, actor, opts = {}) {
  const prereq = item?.flags?.op5e?.prereq ?? item?.getFlag?.(MODULE_ID, "prereq");
  return checkPrereq(prereq, actor, opts).unmet;
}

function notify(actor, item, unmet, notes, mode) {
  const parts = [...unmet, ...(notes.length ? [`DM to confirm: ${notes.join("; ")}`] : [])];
  if (!parts.length) return;
  const msg = `${actor.name} ${unmet.length ? "does not meet the requirements for" : "should be checked for"} ${item.name}: ${parts.join("; ")}.`;
  if (mode === "warn" || !unmet.length) ui.notifications?.warn(msg); else ui.notifications?.error(msg);
}

export function registerPrerequisites() {
  game.settings.register(MODULE_ID, SETTING, {
    name: "Feat prerequisites",
    hint: "Enforce: a feat or feature whose book prerequisites (ability scores, proficiencies, race, creations) are not met cannot be chosen. Warn: it can be chosen with a warning. Off: no checks.",
    scope: "world", config: true, type: String, default: "enforce",
    choices: { enforce: "Enforce", warn: "Warn only", off: "Off" },
  });

  // wrap at "setup" (data models exist, before any actor is prepared) so nothing can validate unwrapped; the weapon table loads after
  Hooks.once("setup", () => {
    const FeatData = CONFIG.Item.dataModels?.feat;
    if (!FeatData?.prototype?.validatePrerequisites || FeatData.prototype.validatePrerequisites.__op5e) return;
    const original = FeatData.prototype.validatePrerequisites;
    const wrapped = function (actor, options = {}) {
      const base = original.call(this, actor, { ...options, showMessage: false, throwError: false });
      const mode = game.settings.get(MODULE_ID, SETTING);
      const messages = base === true ? [] : [...base];
      let notes = [];
      if (mode !== "off") {
        const prereq = this.parent?.flags?.op5e?.prereq;
        const r = checkPrereq(prereq, actor, { level: options.level, added: options.added });
        messages.push(...r.unmet); notes = r.notes;
      }
      const blocking = mode === "warn" ? [] : messages;
      if (!messages.length && !notes.length) return true;
      if (options.showMessage) notify(actor, this.parent, messages, notes, mode);
      if (options.throwError && blocking.length) throw new Error(`${actor.name} does not meet the requirements for ${this.parent.name}: ${blocking.join("; ")}`);
      return blocking.length ? blocking : true;
    };
    wrapped.__op5e = true;
    FeatData.prototype.validatePrerequisites = wrapped;
  });
  Hooks.once("ready", () => { loadWeaponTypes().catch(() => {}); });
}

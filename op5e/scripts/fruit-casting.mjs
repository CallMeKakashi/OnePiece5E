// Devil Fruit casting (issue #20). A Devil Fruit user casts spells and creations with Devil Fruit Uses as spell points.
// DM rules: a spell of level N costs N uses, cantrips are free, spells are learned freely from any pack (not limited to op5e),
// Zoans can cast only while transformed (Hybrid Form / Full Beast Form) until they reach ZOAN_FREE_LEVEL.
// Assumptions where the DM has not answered yet (docs/FUTURE-WORK.md 1b), kept as constants so they are one-line changes:
//   a) a user knows CANTRIPS_KNOWN cantrips plus (character level) leveled spells   b) the highest spell level they can learn or cast is their Uses maximum
//   c) learned spells need no preparing; concentration works as usual              d) Zoans cast too, but only in a form until level 20
//   e) a spell costing more than the Uses left cannot be cast
import { MODULE_ID } from "./constants.mjs";

export const CANTRIPS_KNOWN = 3, ZOAN_FREE_LEVEL = 20, USES_NAME = "Devil Fruit Uses";
const FLAG = "fruitSpell";

const usesItem = (actor) => actor.items.find((i) => i.name === USES_NAME);
export const isZoan = (actor) => actor.items.some((i) => /^Zoan (Hybrid|Full Beast)/.test(i.name) || /^Zoan Devil Fruit/.test(i.name));
export const isTransformed = (actor) => actor.isPolymorphed || actor.effects.some((e) => !e.disabled && /Hybrid Form|Full Beast/i.test(e.name));
export const usesMax = (actor) => usesItem(actor)?.system.uses?.max ?? 0;
export const usesLeft = (actor) => usesItem(actor)?.system.uses?.value ?? 0;

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];
/** Spell DC and attack ability: the spellcasting ability of the character's highest-level class that has one (Bard cha, Medic wis, Gadgeteer int ...).
 *  Classes without spellcasting (Brawler, Barbarian, Fighter, Rogue) use the sourcebook's rule for devil fruit DCs: the highest ability modifier. */
export function fruitCastingAbility(actor) {
  const classes = actor.items.filter((i) => i.type === "class").sort((a, b) => (b.system.levels ?? 0) - (a.system.levels ?? 0));
  const own = classes.map((c) => c.system.spellcasting?.ability).find((a) => a && ABILITIES.includes(a));
  if (own) return own;
  return [...ABILITIES].sort((a, b) => (actor.system.abilities[b]?.mod ?? 0) - (actor.system.abilities[a]?.mod ?? 0))[0];
}

/** Learn a spell from any pack or the world (uuid) as a fruit spell. Returns the created item. */
export async function learnFruitSpell(actor, uuid) {
  const src = await fromUuid(uuid); if (!src || src.type !== "spell") throw new Error("That is not a spell.");
  const level = src.system.level ?? 0, cap = usesMax(actor);
  if (!usesItem(actor)) throw new Error(`${actor.name} has no ${USES_NAME} feature.`);
  if (level > cap) throw new Error(`${src.name} is level ${level}; ${actor.name} can learn up to level ${cap} (their Devil Fruit Uses maximum).`);
  const mine = actor.items.filter((i) => i.type === "spell" && i.getFlag(MODULE_ID, FLAG));
  const cantrips = mine.filter((i) => i.system.level === 0).length, leveled = mine.length - cantrips, charLevel = actor.system.details.level ?? 1;
  if (level === 0 && cantrips >= CANTRIPS_KNOWN) throw new Error(`${actor.name} already knows ${CANTRIPS_KNOWN} cantrips.`);
  if (level > 0 && leveled >= charLevel) throw new Error(`${actor.name} already knows ${charLevel} leveled spells (one per character level).`);
  if (mine.some((i) => i.name === src.name)) throw new Error(`${actor.name} already knows ${src.name}.`);
  const data = src.toObject(); delete data._id;
  data.system.ability = fruitCastingAbility(actor);   // drives the spell save DC and attack bonus
  data.system.method = "spell"; data.system.prepared = 1;   // always available; no slots are used (see the pre-use hook)
  data.flags = { ...data.flags, [MODULE_ID]: { ...data.flags?.[MODULE_ID], [FLAG]: true } };
  const [made] = await actor.createEmbeddedDocuments("Item", [data]);
  return made;
}

function onPreUse(activity, usageConfig) {
  const item = activity?.item;
  if (item?.type !== "spell" || !item.getFlag(MODULE_ID, FLAG)) return;
  const actor = item.actor, level = item.system.level ?? 0;
  if (isZoan(actor) && (actor.system.details.level ?? 1) < ZOAN_FREE_LEVEL && !isTransformed(actor)) {
    ui.notifications.warn(`${actor.name} can cast ${item.name} only while in Hybrid Form or Full Beast Form.`); return false;
  }
  if (level > usesLeft(actor)) { ui.notifications.warn(`${item.name} costs ${level} Devil Fruit Uses; ${actor.name} has ${usesLeft(actor)}.`); return false; }
  usageConfig.consume = false;               // no spell slot and no activity consumption: the cost is paid from the Uses below
  usageConfig.op5eFruitCost = level;
}

async function onPostUse(activity, usageConfig) {
  const cost = usageConfig?.op5eFruitCost; if (!cost) return;
  const uses = usesItem(activity.item.actor);
  if (uses) await uses.update({ "system.uses.spent": (uses.system.uses.spent ?? 0) + cost });
}

/** Keep every fruit spell's ability in step when ability scores or classes change. */
async function syncAbilities(actor) {
  const ab = fruitCastingAbility(actor);
  const stale = actor.items.filter((i) => i.type === "spell" && i.getFlag(MODULE_ID, FLAG) && i.system.ability !== ab);
  if (stale.length) await actor.updateEmbeddedDocuments("Item", stale.map((i) => ({ _id: i.id, "system.ability": ab })));
}

// What choosing a devil fruit template (Paramecia, Zoan or Logia; "No Devil Fruit" carries no kind) grants: the Devil Fruit Uses pool, and for a Zoan its forms.
const TEMPLATE_GRANTS = { paramecia: [USES_NAME], logia: [USES_NAME], zoan: [USES_NAME, "Zoan Hybrid Form", "Zoan Full Beast Form"] };
const granting = new Map();   // actor id -> running grant, so the hook and createFromDraft never create the same feature twice
function grantTemplateFeatures(item) {
  const actor = item.parent, kind = item.flags?.[MODULE_ID]?.devilFruitTemplate;
  if (actor?.documentName !== "Actor" || !TEMPLATE_GRANTS[kind]) return Promise.resolve();
  const run = (granting.get(actor.id) ?? Promise.resolve()).catch(() => {}).then(() => grantFor(actor, kind));
  granting.set(actor.id, run);
  return run;
}
/** Make sure a character with a devil fruit template has the features it grants (createFromDraft calls this before it returns). */
export async function ensureFruitFeatures(actor) {
  for (const item of actor.items.filter((i) => i.flags?.[MODULE_ID]?.devilFruitTemplate)) await grantTemplateFeatures(item);
}
async function grantFor(actor, kind) {
  const pack = game.packs.get(`${MODULE_ID}.feats`), index = await pack.getIndex(), made = [];
  for (const name of TEMPLATE_GRANTS[kind]) {
    if (actor.items.some((i) => i.name === name)) continue;
    const e = index.find((x) => x.name === name); if (!e) continue;
    const d = (await pack.getDocument(e._id)).toObject(); delete d._id; d._stats = { ...d._stats, compendiumSource: `Compendium.${MODULE_ID}.feats.Item.${e._id}` }; made.push(d);
  }
  if (made.length) await actor.createEmbeddedDocuments("Item", made);
}

export function registerFruitCasting() {
  Hooks.on("createItem", (item, _o, userId) => { if (userId === game.user.id) grantTemplateFeatures(item).catch((e) => console.error(`${MODULE_ID} | fruit template grants failed`, e)); });
  Hooks.on("updateActor", (actor, changes, _o, userId) => { if (userId === game.user.id && changes.system?.abilities) syncAbilities(actor).catch(() => {}); });
  Hooks.on("createItem", (item, _o, userId) => { if (userId === game.user.id && item.type === "class" && item.parent) syncAbilities(item.parent).catch(() => {}); });
  Hooks.on("updateItem", (item, changes, _o, userId) => { if (userId === game.user.id && item.type === "class" && item.parent && changes.system?.levels !== undefined) syncAbilities(item.parent).catch(() => {}); });
  Hooks.on("dnd5e.preUseActivity", onPreUse);
  Hooks.on("dnd5e.postUseActivity", (activity, usageConfig) => onPostUse(activity, usageConfig).catch((e) => console.error(`${MODULE_ID} | fruit spell cost failed`, e)));
  game.op5eFruitCasting = { learn: (actor, uuid) => game.user.isGM || actor.isOwner ? learnFruitSpell(actor, uuid) : Promise.reject(new Error("Not your character")), usesMax, usesLeft, isZoan, isTransformed, fruitCastingAbility };
}

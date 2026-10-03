import { checkPrereq, unmetPrerequisites } from "../prerequisites.mjs";
import { setHakiPreselection } from "../haki-advancement.mjs";
import {
  applyStartingBeri,
  importFromPackWithAdvancements,
  levelClassTo,
} from "./apply-advancements.mjs";
import { isValidPointBuy } from "./pointBuy.mjs";

const OP5E = "op5e";

export const PACKS = {
  species: `${OP5E}.races`,
  racialFeatures: `${OP5E}.racial-features`,
  backgroundsAndRoles: `${OP5E}.backgrounds`,
  classes: `${OP5E}.classes`,
  subclasses: `${OP5E}.subclasses`,
  classFeatures: `${OP5E}.class-features`,
  feats: `${OP5E}.feats`,
};

export const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
/** Book variant: Appendix B, Suggested Rulings, "Ursa Array (Variant Standard Array)". */
export const URSA_ARRAY = [16, 16, 14, 12, 12, 8];
export const ABILITY_METHODS = ["roll", "array", "ursa", "pointBuy"];
export const MAX_LEVEL = 20;

export async function indexPack(packCollection, fields = ["type", "name", "img", "system.identifier"]) {
  const pack = game.packs.get(packCollection);
  if (!pack) throw new Error(`Missing compendium pack: ${packCollection}`);
  return pack.getIndex({ fields });
}

export function defaultAbilities() {
  return { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
}

export function defaultData() {
  return {
    name: "",
    portraitImg: "",
    tokenImg: "",
    speciesId: "",
    backgroundId: "",
    roleFeatId: "",
    classId: "",
    level: 1,
    subclassId: "",
    classId2: "",
    level2: 1,
    subclassId2: "",
    hpMode: "avg", // avg | roll (roll, but never below the average)
    autoApply: false, // testing: auto-apply default advancement choices
    haki: {}, // choice level -> armament|observation|conqueror
    abilities: defaultAbilities(),
    abilityMethod: "pointBuy", // roll|array|ursa|pointBuy
    fork: { kind: "additionalPower", additionalPowerFeatId: "" },
  };
}

/** Draft data with every field present (older drafts predate the level/subclass/haki fields). */
export function withDefaults(data) {
  const base = defaultData();
  const out = { ...base, ...(data ?? {}) };
  out.fork = { ...base.fork, ...(data?.fork ?? {}) };
  out.abilities = { ...base.abilities, ...(data?.abilities ?? {}) };
  out.haki = { ...(data?.haki ?? {}) };
  return out;
}

const sortedNums = (ab) => ABILITY_KEYS.map((k) => Number(ab?.[k])).sort((a, b) => a - b);
const sameArray = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

export function abilitiesValid(method, abilities) {
  if (method === "pointBuy") return isValidPointBuy(abilities);
  if (method === "ursa") return sameArray(sortedNums(abilities), [...URSA_ARRAY].sort((a, b) => a - b));
  return true;
}

/** Character level at which the class asks for a subclass, read from the class's own Subclass advancement. */
export function subclassLevelOf(classSource) {
  const src = classSource?.toObject ? classSource.toObject() : classSource;
  const adv = (src?.system?.advancement ?? []).find((a) => a.type === "Subclass");
  return adv?.level ?? null;
}

/** Subclass index entries for a class identifier (op5e.subclasses, system.classIdentifier). */
export async function subclassesForClass(classIdentifier) {
  if (!classIdentifier) return [];
  const idx = await indexPack(PACKS.subclasses, ["type", "name", "img", "system.classIdentifier"]);
  return idx
    .filter((e) => e.type === "subclass" && e.system?.classIdentifier === classIdentifier)
    .map((e) => ({ _id: e._id, name: e.name, img: e.img }));
}

/** Class summary for the wizard: identifier, subclass level, subclass choices. */
export async function classInfo(classId) {
  if (!classId) return null;
  const doc = await game.packs.get(PACKS.classes)?.getDocument(classId);
  if (!doc) return null;
  const identifier = doc.system.identifier;
  return { id: classId, name: doc.name, identifier, subclassLevel: subclassLevelOf(doc), subclasses: await subclassesForClass(identifier) };
}

/** Unsaved actor built from the draft (abilities, species, class) for checking prerequisites before anything is created. */
export async function buildProspectiveActor(data) {
  const items = [];
  for (const [pack, id] of [[PACKS.species, data.speciesId], [PACKS.classes, data.classId]]) {
    const doc = id ? await game.packs.get(pack)?.getDocument(id) : null;
    if (doc) items.push(doc.toObject());
  }
  const abilities = Object.fromEntries(ABILITY_KEYS.map((k) => [k, { value: Number(data.abilities?.[k] ?? 8) }]));
  return new Actor.implementation({ name: "Prospective", type: "character", system: { abilities }, items });
}

/**
 * Unmet prerequisites decidable before the character exists (ability scores, race, level). Proficiency and creation
 * requirements come from advancements that have not run yet, so they are checked on the real actor later.
 */
export function prospectiveUnmet(root, prospective, level = 1) {
  const prereq = root?.flags?.op5e?.prereq;
  if (!prereq) return [];
  const { abilities, races, notRaces } = prereq;
  return checkPrereq({ abilities, races, notRaces, level: prereq.level }, prospective, { level }).unmet;
}

/** Additional Power roots with unmet-prerequisite reasons (empty `unmet` = selectable). */
export async function additionalPowerRootsWithStatus(data, roots) {
  const prospective = await buildProspectiveActor(data);
  const total = totalLevels(data);
  const idx = await indexPack(PACKS.classFeatures, ["type", "name", "flags.op5e"]);
  const byId = new Map(idx.map((e) => [e._id, e]));
  return roots.map((r) => ({ ...r, unmet: prospectiveUnmet(byId.get(r._id), prospective, total) }));
}

function clampLevel(v) {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(Number(v)) || 1));
}

export function totalLevels(data) {
  return clampLevel(data.level) + (data.classId2 ? clampLevel(data.level2) : 0);
}

async function importAdditionalPowerTree(actor, rootFeatId, opts) {
  const pack = game.packs.get(PACKS.classFeatures);
  if (!pack || !rootFeatId) return [];
  const rootDoc = await pack.getDocument(rootFeatId);
  if (!rootDoc) return [];

  const imported = [];
  await importFromPackWithAdvancements(actor, PACKS.classFeatures, rootFeatId, opts);
  imported.push(rootDoc);

  const index = await indexPack(PACKS.classFeatures, ["type", "name", "system.requirements", "flags.op5e"]);
  for (const entry of index) {
    if (entry._id === rootFeatId || entry.type !== "feat") continue;
    if (String(entry.system?.requirements ?? "").trim() !== rootDoc.name) continue;
    const subDoc = await importFromPackWithAdvancements(actor, PACKS.classFeatures, entry._id, opts);
    if (subDoc) imported.push(subDoc);
  }
  return imported;
}

/**
 * Build a character from a draft: create at level 1, import species/background/role/class(es) through
 * AdvancementManager, then level each class one level at a time with AdvancementManager.forLevelChange.
 *
 * @param {object} draft  {actorKind?, data:{...}} or the bare data object
 * @param {object} [opts]
 * @param {boolean} [opts.auto]   auto-apply default choices (testing); otherwise the player sees each manager UI
 * @param {string}  [opts.hpMode] "avg" (default) | "roll" (roll, never below the average); auto mode only
 * @param {string[]} [opts.notes] receives silent-failure and refusal messages
 * @returns {Promise<Actor>}
 */
export async function createFromDraft(draft, opts = {}) {
  const data = withDefaults(draft?.data ?? draft);
  const kind = draft?.actorKind ?? draft?.data?.actorKind ?? data.actorKind ?? "pc";
  const auto = !!(opts.auto ?? data.autoApply);
  const hpMode = opts.hpMode ?? data.hpMode ?? "avg";
  const notes = opts.notes ?? [];
  const fail = (msg) => {
    ui.notifications?.error(msg);
    const e = new Error(msg);
    e.notified = true;
    throw e;
  };

  if (!data.name) fail("Name is required.");
  if (!abilitiesValid(data.abilityMethod, data.abilities)) {
    fail(data.abilityMethod === "ursa" ? "Ursa Array must use exactly 16, 16, 14, 12, 12, 8." : "Point-buy must spend exactly 27 points.");
  }
  if (data.classId2 && !data.classId) fail("Choose a first class before a second class.");
  if (data.classId2 && data.classId2 === data.classId) fail("The second class must differ from the first.");
  const level1 = clampLevel(data.level);
  const level2 = data.classId2 ? clampLevel(data.level2) : 0;
  if (level1 + level2 > MAX_LEVEL) fail(`Total level ${level1 + level2} exceeds ${MAX_LEVEL}.`);

  // Refuse an Additional Power whose prerequisites the draft already fails, before anything is created.
  const rootId = data.fork?.kind === "additionalPower" ? data.fork.additionalPowerFeatId : "";
  if (rootId) {
    const root = await game.packs.get(PACKS.classFeatures)?.getDocument(rootId);
    const unmet = root ? prospectiveUnmet(root, await buildProspectiveActor(data), level1 + level2) : [];
    if (unmet.length) fail(`Additional Power ${root.name} refused, requirements not met: ${unmet.join("; ")}.`);
  }

  const classes = [];
  for (const [id, level, subId] of [[data.classId, level1, data.subclassId], [data.classId2, level2, data.subclassId2]]) {
    if (!id) continue;
    const doc = await game.packs.get(PACKS.classes)?.getDocument(id);
    if (!doc) fail(`Class ${id} not found.`);
    const subLevel = subclassLevelOf(doc);
    let sub = null;
    if (subId && subLevel && level >= subLevel) sub = await game.packs.get(PACKS.subclasses)?.getDocument(subId);
    else if (subId) notes.push(`${doc.name}: subclass ignored, it is chosen at level ${subLevel ?? "?"} and the target is ${level}.`);
    classes.push({ id, name: doc.name, identifier: doc.system.identifier, level, sub });
  }

  const actor = await Actor.create(
    {
      name: data.name,
      type: kind === "npc" ? "npc" : "character",
      img: data.portraitImg || undefined,
      system: { abilities: Object.fromEntries(ABILITY_KEYS.map((k) => [k, { value: Number(data.abilities?.[k] ?? 8) }])) },
      ...(data.tokenImg ? { prototypeToken: { texture: { src: data.tokenImg } } } : {}),
    },
    { renderSheet: !auto && !opts.noSheet }
  );
  if (!actor) throw new Error("Actor creation failed.");

  const run = { auto, hpMode, notes, haki: data.haki };
  const imported = [];
  setHakiPreselection(data.haki);
  try {
    for (const [pack, id] of [
      [PACKS.species, data.speciesId],
      [PACKS.backgroundsAndRoles, data.backgroundId],
      [PACKS.backgroundsAndRoles, data.roleFeatId],
    ]) {
      const doc = await importFromPackWithAdvancements(actor, pack, id, run);
      if (doc) imported.push(doc);
    }

    // Both classes enter at level 1 (class 1 first, so it is the starting class that grants starting equipment).
    for (const c of classes) {
      const doc = await importFromPackWithAdvancements(actor, PACKS.classes, c.id, run);
      if (doc) imported.push(doc);
      c.item = actor.items.find((i) => i.type === "class" && i.system.identifier === c.identifier);
    }

    if (!auto && classes.some((c) => c.level > 1)) {
      const hints = classes.filter((c) => c.sub).map((c) => `subclass ${c.sub.name} (${c.name})`);
      const haki = Object.entries(data.haki).filter(([, b]) => b).map(([l, b]) => `L${l} ${b}`);
      ui.notifications?.info(`Level-up will prompt in turn. Chosen: ${[...hints, ...(haki.length ? [`Haki ${haki.join(", ")}`] : [])].join("; ") || "no presets"}.`);
    }
    for (const c of classes) {
      if (!c.item) { notes.push(`${c.name}: class item missing after import.`); continue; }
      await levelClassTo(actor, c.item.id, c.level, { ...run, subUuid: c.sub?.uuid });
    }

    if (rootId) {
      const root = await game.packs.get(PACKS.classFeatures)?.getDocument(rootId);
      const unmet = root ? unmetPrerequisites(root, actor) : [];
      if (unmet.length) {
        const msg = `Additional Power ${root.name} refused, requirements not met: ${unmet.join("; ")}.`;
        notes.push(`REFUSED: ${msg}`);
        ui.notifications?.error(msg);
      } else {
        imported.push(...(await importAdditionalPowerTree(actor, rootId, run)));
      }
    }

    await applyStartingBeri(actor, imported);
  } finally {
    setHakiPreselection({});
  }
  return actor;
}

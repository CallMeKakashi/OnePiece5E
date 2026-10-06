import { advancementList } from "../advancement-list.mjs";
import {
  applyStartingBeri,
  importFromPackWithAdvancements,
  levelClassTo,
} from "./apply-advancements.mjs";
import { isValidPointBuy } from "./pointBuy.mjs";
import { unmetPrerequisites } from "../prerequisites.mjs";
import { ensureFruitFeatures } from "../fruit-casting.mjs";
import { parseSourceId } from "../extra-sources-lib.mjs";

const OP5E = "op5e";
/** Appendix B, Suggested Rulings, Starting Rules: start at 3rd level (level 1 stays allowed). */
export const DEFAULT_START_LEVEL = 3;

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
    dream: "", // Sourcebook, Dreams: every character has one; written to the biography and flags.op5e.dream
    hybridMode: "", // "" | "appearance" | "traits" (Appendix B, Hybrid Races; DM approval)
    hybridNote: "",
    hybridSpeciesId: "",
    hybridFeatIds: [],
    classId: "",
    level: DEFAULT_START_LEVEL,
    subclassId: "",
    freeFeatId: "", // Starting Rules: a free starting feat on top of role/background feats (op5e.feats, general feats)
    classId2: "",
    level2: 1,
    subclassId2: "",
    hpMode: "avg", // avg | roll (roll, but never below the average)
    autoApply: false, // testing: auto-apply default advancement choices
    abilities: defaultAbilities(),
    abilityMethod: "pointBuy", // roll|array|ursa|pointBuy
  };
}

/** Draft data with every field present (older drafts predate the level/subclass fields). */
export function withDefaults(data) {
  const base = defaultData();
  const out = { ...base, ...(data ?? {}) };
  out.abilities = { ...base.abilities, ...(data?.abilities ?? {}) };
  if (!Array.isArray(out.hybridFeatIds)) out.hybridFeatIds = [];
  // drafts from before role/fruit/Haki became class advancement choices carry dead fields
  for (const k of ["roleFeatId", "fork", "haki"]) delete out[k];
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
  const adv = advancementList(src?.system?.advancement).find((a) => a.type === "Subclass");
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

function clampLevel(v) {
  return Math.min(MAX_LEVEL, Math.max(1, Math.floor(Number(v)) || 1));
}

export function totalLevels(data) {
  return clampLevel(data.level) + (data.classId2 ? clampLevel(data.level2) : 0);
}

/**
 * Build a character from a draft: create at level 1, import species/background/class(es) through
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

  // opts.haki (choice level -> branch) and opts.fruit (template name) only steer the headless auto mode
  const run = { auto, hpMode, notes, haki: opts.haki, fruit: opts.fruit, prefer: opts.prefer };
  const imported = [];
  {
    for (const [pack, id] of [
      [PACKS.species, data.speciesId],
      [PACKS.backgroundsAndRoles, data.backgroundId],
    ]) {
      const doc = await importFromPackWithAdvancements(actor, pack, id, run);
      if (doc) imported.push(doc);
      if (pack === PACKS.species) await importHybridFeatures(actor, data, run);
    }
    // dnd5e fills the Species slot by itself, but the Background slot stays empty until system.details.background points at the item
    for (const type of ["race", "background"]) {
      const item = actor.items.find((i) => i.type === type);
      if (item && !actor._source.system.details?.[type]) await actor.update({ [`system.details.${type}`]: item.id });
    }

    // The free starting feat goes in BEFORE the class when its requirements are already met, so the Role's bonus-feat choice (and any other feat choice)
    // sees it as taken and cannot offer the same feat again. A feat that needs class levels or proficiencies waits until the end.
    const importFreeFeat = async () => {
      if (data.freeFeatId) {
      const ff = parseSourceId(data.freeFeatId, PACKS.feats);
      const feat = await game.packs.get(ff.collection)?.getDocument(ff.id);
      const unmet = feat ? unmetPrerequisites(feat, actor) : [];
      const mode = game.settings.get(OP5E, "prerequisiteMode");
      if (!feat || feat.system?.type?.value !== "feat") {
        await actor.delete().catch(() => {});
        fail(`Free starting feat ${data.freeFeatId} is not a general feat from the op5e feats pack or an extra source.`);
      }
      if (unmet.length && mode === "enforce") {
        await actor.delete().catch(() => {}); // never leave a half-built character behind
        fail(`${data.name} does not meet the requirements for the free starting feat ${feat.name}: ${unmet.join("; ")}. No character was created.`);
      }
      if (unmet.length) notes.push(`${feat.name}: unmet requirements (${unmet.join("; ")}) allowed by the prerequisite setting.`);
      await importFromPackWithAdvancements(actor, ff.collection, ff.id, run);
    }
    };
    const ffEarly = parseSourceId(data.freeFeatId, PACKS.feats);
    const freeFeatDoc = data.freeFeatId ? await game.packs.get(ffEarly.collection)?.getDocument(ffEarly.id) : null;
    const freeFeatEarly = !!freeFeatDoc && unmetPrerequisites(freeFeatDoc, actor).length === 0;
    if (freeFeatEarly) await importFreeFeat();

    // Both classes enter at level 1 (class 1 first, so it is the starting class that grants starting equipment).
    for (const c of classes) {
      // a class that picks its subclass at level 1 (Savant) shows the Subclass step during this very import
      const doc = await importFromPackWithAdvancements(actor, PACKS.classes, c.id, { ...run, subUuid: c.sub?.uuid });
      if (doc) imported.push(doc);
      c.item = actor.items.find((i) => i.type === "class" && i.system.identifier === c.identifier);
    }

    if (!auto && classes.some((c) => c.level > 1)) {
      const hints = classes.filter((c) => c.sub).map((c) => `subclass ${c.sub.name} (${c.name})`);
      ui.notifications?.info(`Level-up will prompt in turn (role, devil fruit and Haki are class choices). ${hints.join("; ")}`.trim());
    }
    for (const c of classes) {
      if (!c.item) { notes.push(`${c.name}: class item missing after import.`); continue; }
      await levelClassTo(actor, c.item.id, c.level, { ...run, subUuid: c.sub?.uuid });
    }

    if (freeFeatEarly) { /* already imported before the class */ } else await importFreeFeat();

    await ensureFruitFeatures(actor);   // Devil Fruit Uses and the Zoan forms come with the template
    await applyStartingBeri(actor, imported);
    await writeBiography(actor, data);
    // dnd5e refills spell slots only on a rest, so a new caster would start with none: begin the game with full slots (and full hit points)
    const fill = {};
    for (const [key, slot] of Object.entries(actor.system.spells ?? {})) if (slot?.max) fill[`system.spells.${key}.value`] = slot.max;
    if (actor.system.attributes?.hp?.max) fill["system.attributes.hp.value"] = actor.system.attributes.hp.max;
    if (Object.keys(fill).length) await actor.update(fill);
  }
  return actor;
}

/** Hybrid Races, "Combine traits": import the ticked racial features of the second species (never more than the player ticked). */
async function importHybridFeatures(actor, data, run) {
  if (data.hybridMode !== "traits" || !data.hybridSpeciesId || data.hybridSpeciesId === data.speciesId) return;
  for (const id of data.hybridFeatIds) await importFromPackWithAdvancements(actor, PACKS.racialFeatures, id, run);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Dream and hybrid notes go into the biography (as paragraphs); the dream is also stored in flags.op5e.dream. */
async function writeBiography(actor, data) {
  const paras = [];
  const dream = String(data.dream ?? "").trim();
  if (dream) paras.push(`<p><strong>Dream:</strong> ${esc(dream)}</p>`);
  const note = String(data.hybridNote ?? "").trim();
  if (data.hybridMode === "appearance" && note) paras.push(`<p><strong>Hybrid (appearance only):</strong> ${esc(note)}</p>`);
  if (data.hybridMode === "traits" && data.hybridSpeciesId && data.hybridSpeciesId !== data.speciesId) {
    const second = (await game.packs.get(PACKS.species)?.getDocument(data.hybridSpeciesId))?.name ?? "second species";
    const idx = await game.packs.get(PACKS.racialFeatures)?.getIndex();
    const names = data.hybridFeatIds.map((id) => idx?.get(id)?.name).filter(Boolean);
    paras.push(`<p><strong>Hybrid (combined traits, ${esc(second)}):</strong> ${esc(names.join(", ") || "no features chosen")}${note ? `. ${esc(note)}` : ""}</p>`);
  }
  if (!paras.length) return;
  const update = { "system.details.biography.value": `${actor.system.details?.biography?.value ?? ""}${paras.join("")}` };
  if (dream) update["flags.op5e.dream"] = dream;
  await actor.update(update);
}

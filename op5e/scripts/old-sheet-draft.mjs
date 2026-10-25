// Map an old-campaign actor onto a Create OPC draft (class, levels, subclass, species, background, ability scores).
// Pure: `find(kind, name)` returns a compendium id or null (kind: classes | subclasses | species | backgrounds), so it runs without Foundry.
import { MODULE_ID } from "./constants.mjs";
import { withDefaults, ABILITY_KEYS, MAX_LEVEL } from "./wizard/create.mjs";

const byType = (items, type) => items.filter((i) => i.type === type);

/** {draft, unmapped}: `unmapped` lists old parts with no op5e equivalent so the report can say what was left behind.
 *  `classMap` renames old classes per run (for example { Paladin: "Savant" }); there is no default table, so the DM picks every mapping. */
export function draftFromOldSheet(old, find, classMap = {}) {
  const unmapped = [], items = old.items ?? [];
  const classes = byType(items, "class").sort((a, b) => (b.system?.levels ?? 0) - (a.system?.levels ?? 0)).slice(0, 2);
  const subs = byType(items, "subclass");
  const pick = (kind, name, label) => { const id = find(kind, name); if (!id) unmapped.push(`${label}: ${name}`); return id ?? ""; };
  const draft = withDefaults({ name: old.name, abilityMethod: "roll", autoApply: true, portraitImg: old.img ?? "" });
  let left = MAX_LEVEL;
  classes.forEach((c, n) => {
    const level = Math.min(left, Math.max(1, c.system?.levels ?? 1)); left -= level;
    const sub = subs.find((s) => s.system?.classIdentifier === c.system?.identifier);
    const suffix = n ? "2" : "";
    draft[`classId${suffix}`] = pick("classes", classMap[c.name] ?? c.name, "class");
    draft[n ? "level2" : "level"] = level;
    if (sub) draft[`subclassId${suffix}`] = pick("subclasses", sub.name, "subclass");
  });
  const race = byType(items, "race")[0], bg = byType(items, "background")[0];
  if (race) draft.speciesId = pick("species", race.name, "species");
  if (bg) draft.backgroundId = pick("backgrounds", bg.name, "background");
  for (const k of ABILITY_KEYS) draft.abilities[k] = old.system?.abilities?.[k]?.value ?? 10;
  return { draft, unmapped };
}

const PACK_OF = { classes: "classes", subclasses: "subclasses", species: "races", backgrounds: "backgrounds" };
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

/** GM only: build a new actor through Create OPC from an old sheet, then carry gear, spells, feats and berries over. Dry run unless apply is true. */
export function registerRebuildOldCharacter() {
  game.op5eRebuildOldCharacter = async (source, { apply = false, classMap = {} } = {}) => {
    if (!game.user.isGM) throw new Error("GM only");
    const idx = {};
    for (const [kind, pack] of Object.entries(PACK_OF)) idx[kind] = [...(await game.packs.get(`${MODULE_ID}.${pack}`).getIndex())];
    const find = (kind, name) => idx[kind].find((e) => norm(e.name) === norm(name))?._id ?? null;
    const { draft, unmapped } = draftFromOldSheet(source.toObject(), find, classMap);
    if (!apply) return { applied: false, draft, unmapped };
    const actor = await game.op5eCharacterCreator.createFromDraft(draft, { auto: true });
    const carried = await game.op5eCarryOldCharacter(source, actor, { apply: true });
    return { applied: true, actor, unmapped, carried };
  };
}

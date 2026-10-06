// Extra compendium sources (issue #48): the GM picks installed Item compendiums (for example a D&D Beyond import) that players may also choose from, next to
// the op5e content. They are only referenced at run time, never copied or shipped. Today they feed the free starting feat in Create OPC; entries show their
// source (the compendium's label). An id from an extra source is "<pack collection>|<document id>", an op5e id stays a plain id.
import { MODULE_ID } from "./constants.mjs";
import { parseSourceId } from "./extra-sources-lib.mjs";

const SETTING = "extraSources";

/** Item compendiums the GM can add: everything installed that is not op5e's own content or the core dnd5e packs. */
export function candidatePacks() {
  return game.packs.filter((p) => p.documentName === "Item" && p.metadata.packageName !== MODULE_ID && p.metadata.packageName !== "dnd5e")
    .map((p) => ({ collection: p.collection, label: `${p.metadata.label}${p.metadata.packageType === "world" ? " (world)" : ` (${p.metadata.packageName})`}` }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** The enabled extra sources that are still installed. */
export const extraPacks = () => (game.settings.get(MODULE_ID, SETTING) ?? []).map((id) => game.packs.get(id)).filter(Boolean);

/** Index entries of one item type from every extra source, tagged with their source and a pack-carrying id. */
export async function extraEntries(fields, keep = () => true) {
  const out = [];
  for (const pack of extraPacks()) {
    const idx = await pack.getIndex({ fields }).catch(() => []);
    for (const e of idx) if (keep(e)) out.push({ ...e, _id: `${pack.collection}|${e._id}`, source: pack.metadata.label });
  }
  return out;
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class ExtraSourcesApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "op5e-extra-sources", tag: "form", window: { title: "OP5e extra sources", icon: "fa-solid fa-books" }, position: { width: 520 },
    form: { handler: ExtraSourcesApp.#save, closeOnSubmit: true },
  };
  static PARTS = { form: { template: `modules/${MODULE_ID}/templates/extra-sources.hbs` } };
  async _prepareContext() {
    const on = new Set(game.settings.get(MODULE_ID, SETTING) ?? []);
    return { packs: candidatePacks().map((p) => ({ ...p, field: p.collection.replace(/\./g, "__"), checked: on.has(p.collection) })) };
  }
  static async #save(_event, _form, formData) {
    const picked = Object.entries(formData.object).filter(([, v]) => v).map(([k]) => k.replace(/__/g, "."));   // checkbox names cannot hold dots
    await game.settings.set(MODULE_ID, SETTING, picked);
  }
}

export function registerExtraSources() {
  game.settings.register(MODULE_ID, SETTING, { scope: "world", config: false, type: Array, default: [] });
  game.settings.registerMenu(MODULE_ID, "extraSourcesMenu", {
    name: `${MODULE_ID}.settings.extraSources.name`, label: `${MODULE_ID}.settings.extraSources.label`, hint: `${MODULE_ID}.settings.extraSources.hint`,
    icon: "fa-solid fa-books", type: ExtraSourcesApp, restricted: true,
  });
  game.op5eSources = { candidatePacks, extraPacks, extraEntries, parseSourceId };
}

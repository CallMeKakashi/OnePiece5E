// Extra compendium sources (issue #48): the GM picks installed Item compendiums (for example a D&D Beyond import) that players may also choose from, next to
// the op5e content. They are only referenced at run time, never copied or shipped. They feed Create OPC (free starting feat, species, background, class, subclass), the shop's Find item search and dnd5e's own browser (level-up choices); entries show their
// source (the compendium's label). An id from an extra source is "<pack collection>|<document id>", an op5e id stays a plain id.
import { MODULE_ID } from "./constants.mjs";
import { parseSourceId, extraPacks, extraEntries, docFromSourceId, EXTRA_SETTING } from "./extra-sources-lib.mjs";

const SETTING = EXTRA_SETTING;

/** Item compendiums the GM can add: everything installed that is not op5e's own content or the core dnd5e packs. */
export function candidatePacks() {
  return game.packs.filter((p) => p.documentName === "Item" && p.metadata.packageName !== MODULE_ID && p.metadata.packageName !== "dnd5e")
    .map((p) => ({ collection: p.collection, label: `${p.metadata.label}${p.metadata.packageType === "world" ? " (world)" : ` (${p.metadata.packageName})`}` }))
    .sort((a, b) => Number(b.label.endsWith("(world)")) - Number(a.label.endsWith("(world)")) || a.label.localeCompare(b.label));   // the world's own imports (a D&D Beyond import) first
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class ExtraSourcesApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "op5e-extra-sources", tag: "form", window: { title: "OP5e extra sources", icon: "fa-solid fa-books" }, position: { width: 520 },
    form: { handler: ExtraSourcesApp.#save, closeOnSubmit: true },
  };
  static PARTS = { form: { template: `modules/${MODULE_ID}/templates/extra-sources.hbs` } };
  _onRender() {   // a filter box: the list can be long
    const q = this.element.querySelector("input[name=filter]");
    q?.addEventListener("input", () => { const t = q.value.trim().toLowerCase(); for (const l of this.element.querySelectorAll("label.checkbox")) l.hidden = !!t && !l.textContent.toLowerCase().includes(t); });
  }
  async _prepareContext() {
    const on = new Set(game.settings.get(MODULE_ID, SETTING) ?? []);
    return { packs: candidatePacks().map((p) => ({ ...p, field: p.collection.replace(/\./g, "__"), checked: on.has(p.collection) })) };
  }
  static async #save(_event, _form, formData) {
    const picked = Object.entries(formData.object).filter(([, v]) => v).map(([k]) => k.replace(/__/g, "."));   // checkbox names cannot hold dots
    await game.settings.set(MODULE_ID, SETTING, picked);
  }
}

/**
 * Level-up choices (feats, spells, gear) go through dnd5e's own compendium browser, which only offers compendiums enabled in its "Compendium Browser Sources"
 * setting. Switching an extra source on here switches it on there too, and off again when it is removed (only the ones op5e itself enabled).
 */
export async function syncBrowserSources() {
  if (!game.user.isGM || !game.settings.settings.has("dnd5e.packSourceConfiguration")) return;
  const cfg = foundry.utils.deepClone(game.settings.get("dnd5e", "packSourceConfiguration") ?? {});
  const on = new Set(game.settings.get(MODULE_ID, SETTING) ?? []), applied = new Set(game.settings.get(MODULE_ID, "extraSourcesApplied") ?? []);
  let changed = false;
  for (const id of on) { if (cfg[id] !== true) { cfg[id] = true; changed = true; } applied.add(id); }
  for (const id of [...applied]) if (!on.has(id)) { if (cfg[id] === true) { cfg[id] = false; changed = true; } applied.delete(id); }
  if (changed) await game.settings.set("dnd5e", "packSourceConfiguration", cfg);
  await game.settings.set(MODULE_ID, "extraSourcesApplied", [...applied]);
}

export function registerExtraSources() {
  game.settings.register(MODULE_ID, SETTING, { scope: "world", config: false, type: Array, default: [], onChange: () => syncBrowserSources().catch((e) => console.error(`${MODULE_ID} | extra sources sync failed`, e)) });
  game.settings.register(MODULE_ID, "extraSourcesApplied", { scope: "world", config: false, type: Array, default: [] });
  Hooks.once("ready", () => syncBrowserSources().catch(() => {}));
  game.settings.registerMenu(MODULE_ID, "extraSourcesMenu", {
    name: `${MODULE_ID}.settings.extraSources.name`, label: `${MODULE_ID}.settings.extraSources.label`, hint: `${MODULE_ID}.settings.extraSources.hint`,
    icon: "fa-solid fa-books", type: ExtraSourcesApp, restricted: true,
  });
  game.op5eSources = { candidatePacks, extraPacks, extraEntries, parseSourceId, docFromSourceId, syncBrowserSources };
}

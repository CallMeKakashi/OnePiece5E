// One-time copy of the shop data the op5e module used to keep (world settings under "op5e") into this module's own settings. The old values are never changed or removed.
import { MODULE_ID } from "./constants.mjs";

const KEYS = ["shops", "shopRequests", "usedShopNames", "currencyMode", "singleCurrency", "sellRatio", "shopTemplateSet", "shopCompendium"];
const parse = (v) => { if (typeof v !== "string") return v; try { return JSON.parse(v); } catch { return v; } };
const isEmpty = (v) => v == null || v === "" || (Array.isArray(v) ? !v.length : typeof v === "object" && !Object.keys(v).length);

/** { key: value } to write. `raw(key)` is op5e's stored value (or undefined), `current(key)` this module's. Shops and the name list are copied only into an empty module; plain settings only while still at their default. */
export function planMigration(raw, current, defaults) {
  const out = {};
  for (const k of KEYS) {
    const old = parse(raw(k)); if (old === undefined || old === null) continue;
    const data = ["shops", "shopRequests", "usedShopNames"].includes(k);
    if (data ? isEmpty(current(k)) && !isEmpty(old) : JSON.stringify(current(k)) === JSON.stringify(defaults[k]) && JSON.stringify(old) !== JSON.stringify(defaults[k])) out[k] = old;
  }
  return out;
}

/** GM client, once per world. Returns the keys it copied. */
export async function migrateFromOp5e() {
  if (!game.user.isGM || game.settings.get(MODULE_ID, "migratedFromOp5e")) return [];
  const store = game.settings.storage.get("world"), raw = (k) => store.getSetting(`op5e.${k}`)?.value;
  const defaults = Object.fromEntries(KEYS.map((k) => [k, game.settings.settings.get(`${MODULE_ID}.${k}`)?.default]));
  const plan = planMigration(raw, (k) => game.settings.get(MODULE_ID, k), defaults);
  for (const [k, v] of Object.entries(plan)) await game.settings.set(MODULE_ID, k, v);
  await game.settings.set(MODULE_ID, "migratedFromOp5e", true);
  const n = Object.keys(plan).length; if (n) ui.notifications.info(`Shop & Trade: copied ${n} setting${n > 1 ? "s" : ""} from the op5e module.`);
  return Object.keys(plan);
}

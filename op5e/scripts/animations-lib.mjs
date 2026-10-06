// Pure helpers for OP5e -> Automated Animations autorec support (no Foundry globals; unit-testable).

export const AA_MENUS = ["melee", "range", "ontoken", "templatefx", "preset", "aura", "aefx"];
export const TARGET_ACTIVITIES = ["attack", "save", "damage", "heal", "summon"];
const PRIORITY = ["attack", "save", "damage", "heal", "summon", "template"];

/** Same normalisation Automated Animations uses (AAAutorecFunctions.rinseName). */
export const rinse = (name) => (name ? String(name).replace(/\s+/g, "").toLowerCase() : "");

/** Index autorec menus: exact set of rinsed labels, plus a longest-first list for AA's substring search. */
export function buildLabelIndex(menus) {
  const exact = new Set();
  const best = [];
  for (const menu of AA_MENUS) {
    for (const e of menus[menu] ?? []) {
      if (!e.label) continue;
      exact.add(rinse(e.label));
      if (!e.advanced?.exactMatch) best.push({ menu, label: e.label, r: rinse(e.label), excluded: e.advanced?.excludedTerms ?? [] });
    }
  }
  best.sort((a, b) => b.r.length - a.r.length);
  return { exact, best };
}

/** Mimics AA's allMenuSearch: returns {kind: "exact"|"substring", label, menu} or null. */
export function matchAutorec(index, name) {
  const r = rinse(name);
  if (!r) return null;
  if (index.exact.has(r)) return { kind: "exact", label: name };
  for (const b of index.best) {
    if (!b.r || !r.includes(b.r)) continue;
    if (b.excluded.some((t) => r.includes(rinse(t)))) continue;
    return { kind: "substring", label: b.label, menu: b.menu };
  }
  return null;
}

/** The module already does a good job if the match is exact, a weapon-menu substring ("Battleaxe" -> Axe), or a substring covering most of the name. */
export function isCoveredByModule(index, name) {
  const m = matchAutorec(index, name);
  if (!m) return false;
  if (m.kind === "exact" || ((m.menu === "melee" || m.menu === "range") && rinse(m.label).length >= 3)) return true;
  return rinse(m.label).length >= 0.6 * rinse(name).length;
}

/** Describe the animation-relevant facts of a built pack doc, or null if it has none. */
export function describeDoc(doc) {
  const acts = Object.values(doc?.system?.activities ?? {});
  if (!acts.length) return null;
  const types = new Set();
  const dtypes = [];
  let shape = "";
  let style = "";
  const baseTypes = [...(doc.system?.damage?.base?.types ?? [])];
  for (const a of acts) {
    if (TARGET_ACTIVITIES.includes(a.type)) types.add(a.type);
    const tpl = a.target?.template?.type;
    if (tpl) {
      types.add("template");
      shape ||= tpl;
    }
    for (const p of a.damage?.parts ?? []) dtypes.push(...(p.types ?? []));
    if (a.type === "attack" && a.damage?.includeBase) dtypes.push(...baseTypes);
    if (a.type === "heal") dtypes.push("healing");
    if (a.type === "attack") style ||= a.attack?.type?.value || "";
  }
  if (!types.size) return null;
  if (types.has("attack") && !dtypes.length) dtypes.push(...baseTypes);
  const wt = doc.system?.type?.value ?? "";
  if (!style) style = /R$|^siege$/.test(wt) ? "ranged" : "melee";
  return {
    activityTypes: [...types].sort(),
    primary: PRIORITY.find((t) => types.has(t)),
    damageType: dtypes.find((d) => d !== "healing") ?? dtypes[0] ?? "",
    shape,
    style,
    school: doc.type === "spell" ? doc.system?.school ?? "" : "",
    isSpell: doc.type === "spell",
  };
}

/** Candidate mapping-table keys, most specific first. */
export function categoryKeys(d) {
  let base;
  switch (d.primary) {
    case "attack": base = d.isSpell ? "attack:spell" : `attack:${d.style}`; break;
    case "heal": base = "heal"; break;
    case "summon": base = "summon"; break;
    case "template": base = "template"; break;
    default: base = d.shape ? "template" : "target"; // save / damage
  }
  const keys = [];
  if (d.shape) keys.push(`${base}:${d.shape}:${d.damageType}`);
  if (d.damageType) keys.push(`${base}:${d.damageType}`);
  if (d.school) keys.push(`${base}:school:${d.school}`);
  if (d.shape) keys.push(`${base}:${d.shape}`);
  keys.push(base);
  return [...new Set(keys)];
}

/** Resolve a doc to a "menu:Label" reference via overrides, patterns, then the category table. */
export function resolveRef(map, doc, d) {
  const o = map.overrides?.[doc.name];
  if (o) return { ref: o, via: "override" };
  for (const p of map.overridePatterns ?? []) {
    if (p.packs && !p.packs.includes(doc._pack)) continue;
    if (new RegExp(p.match, "i").test(doc.name)) return { ref: p.ref, via: `pattern:${p.match}` };
  }
  for (const k of categoryKeys(d)) if (map.categories?.[k]) return { ref: map.categories[k], via: k };
  return null;
}

export function findSource(autorec, ref) {
  const i = ref.indexOf(":");
  const menu = ref.slice(0, i);
  const label = ref.slice(i + 1);
  return (autorec[menu] ?? []).find((e) => e.label === label) ?? null;
}

const slug = (s) => rinse(s).replace(/[^a-z0-9]/g, "") || "x";

/** Build one autorec entry cloned from a module entry, matched by exact item name. */
export function buildEntry(source, name, { version = 1, moduleVersion = "0" } = {}) {
  const e = structuredClone(source);
  e.id = `op5e-${source.menu}-${slug(name)}`;
  e.label = name;
  e.advanced = { ...(e.advanced ?? {}), exactMatch: true, excludedTerms: [] };
  e.metaData = { label: name, menu: source.menu, name: "OP5e Animations", moduleVersion, version, op5e: true, source: `${source.menu}:${source.label}` };
  return e;
}

/** Generate entries for uncovered docs. Returns {menus, unmapped, entries}. */
export function generate({ docs, autorec, map, version, moduleVersion }) {
  const index = buildLabelIndex(autorec);
  const menus = Object.fromEntries(AA_MENUS.map((m) => [m, []]));
  const seen = new Set();
  const unmapped = [];
  const entries = [];
  for (const doc of docs) {
    const d = describeDoc(doc);
    if (!d || isCoveredByModule(index, doc.name) || seen.has(rinse(doc.name))) continue;
    const r = resolveRef(map, doc, d);
    const src = r && findSource(autorec, r.ref);
    if (!src) {
      unmapped.push({ name: doc.name, pack: doc._pack, ref: r?.ref ?? null });
      continue;
    }
    seen.add(rinse(doc.name));
    const e = buildEntry(src, doc.name, { version, moduleVersion });
    menus[e.menu].push(e);
    entries.push({ name: doc.name, pack: doc._pack, menu: e.menu, ref: r.ref, via: r.via });
  }
  return { menus, unmapped, entries };
}

/**
 * Merge incoming autorec entries into current menus without overwriting anything.
 * An incoming entry is skipped if any existing entry (any menu) has the same rinsed label or id.
 * Input arrays are not mutated. Returns {menus, added, changed}.
 */
export function mergeAutorec(current, incoming) {
  const labels = new Set();
  const ids = new Set();
  for (const m of AA_MENUS) for (const e of current[m] ?? []) { labels.add(rinse(e.label)); ids.add(e.id); }
  const out = {};
  const changed = [];
  let added = 0;
  for (const m of AA_MENUS) {
    const list = [...(current[m] ?? [])];
    for (const e of incoming[m] ?? []) {
      if (labels.has(rinse(e.label)) || ids.has(e.id)) continue;
      list.push(structuredClone(e));
      labels.add(rinse(e.label));
      ids.add(e.id);
      added++;
      if (!changed.includes(m)) changed.push(m);
    }
    out[m] = list;
  }
  return { menus: out, added, changed };
}

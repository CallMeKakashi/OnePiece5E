import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AA_MENUS, rinse, buildLabelIndex, describeDoc, categoryKeys, generate, mergeAutorec, buildEntry } from "../scripts/animations-lib.mjs";

const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const json = (p) => JSON.parse(readFileSync(root(p), "utf8"));

const map = json("data/animation-map.json");
const labelIndex = json("data/autorec-index.json"); // {menu: [labels]} snapshot of dnd5e-animations' autorec
const generated = json("assets/autorec-op5e.json");
const realPath = process.env.OP5E_AUTOREC ?? "D:/foundry-pi/Foundry/foundrydata/Data/modules/dnd5e-animations/module/autorec.json";
const real = existsSync(realPath) ? JSON.parse(readFileSync(realPath, "utf8")) : null;

const allEntries = AA_MENUS.flatMap((m) => generated[m] ?? []);

describe("animation map", () => {
  it("only references entries that exist in dnd5e-animations' autorec", () => {
    const refs = [...Object.values(map.categories), ...map.overridePatterns.map((p) => p.ref), ...Object.values(map.overrides)];
    for (const ref of refs) {
      const i = ref.indexOf(":");
      expect(labelIndex[ref.slice(0, i)], ref).toContain(ref.slice(i + 1));
    }
  });
});

describe("generated assets/autorec-op5e.json", () => {
  it("has entries", () => expect(allEntries.length).toBeGreaterThan(100));

  it("every entry points at an existing module animation", () => {
    for (const e of allEntries) {
      const [menu, label] = [e.metaData.source.split(":")[0], e.metaData.source.slice(e.metaData.source.indexOf(":") + 1)];
      expect(labelIndex[menu], e.label).toContain(label);
      if (real) {
        const src = real[menu].find((s) => s.label === label);
        expect(src, e.label).toBeTruthy();
        const strip = ({ id, label: _l, metaData, advanced, ...rest }) => rest;
        expect(strip(e)).toEqual(strip(src));
      }
    }
  });

  it("has no duplicate labels or ids and matches by exact name", () => {
    const labels = allEntries.map((e) => rinse(e.label));
    expect(new Set(labels).size).toBe(labels.length);
    const ids = allEntries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of allEntries) expect(e.advanced.exactMatch).toBe(true);
  });

  it("no entry label collides with the module's own labels", () => {
    const module = buildLabelIndex(Object.fromEntries(AA_MENUS.map((m) => [m, (labelIndex[m] ?? []).map((label) => ({ label }))])));
    for (const e of allEntries) expect(module.exact.has(rinse(e.label)), e.label).toBe(false);
  });
});

describe("generator", () => {
  const autorec = {
    melee: [{ id: "1", label: "Longsword", menu: "melee", primary: { x: 1 } }],
    range: [], ontoken: [{ id: "2", label: "Cure Wounds", menu: "ontoken", primary: { y: 2 } }],
    templatefx: [], preset: [], aura: [], aefx: [],
  };
  const m = { categories: { "attack:melee": "melee:Longsword", heal: "ontoken:Cure Wounds" }, overridePatterns: [], overrides: {} };
  const heal = { name: "Patch Up", _pack: "feats", type: "feat", system: { activities: { a: { type: "heal" } } } };
  const hit = { name: "Cleaver", _pack: "items", type: "weapon", system: { type: { value: "martialM" }, activities: { a: { type: "attack", attack: { type: {} }, damage: { parts: [] } } } } };
  const plain = { name: "Boring", _pack: "feats", type: "feat", system: { activities: { a: { type: "utility" } } } };

  it("maps uncovered docs, skips covered, plain and duplicates", () => {
    const { menus, entries, unmapped } = generate({ docs: [heal, hit, plain, { ...heal, _pack: "x" }, { ...hit, name: "Longsword" }], autorec, map: m });
    expect(entries.map((e) => e.name)).toEqual(["Patch Up", "Cleaver"]);
    expect(menus.ontoken[0].primary).toEqual({ y: 2 });
    expect(menus.melee[0].label).toBe("Cleaver");
    expect(unmapped).toEqual([]);
  });

  it("reports unmapped categories instead of inventing entries", () => {
    const { entries, unmapped } = generate({ docs: [heal], autorec, map: { categories: {}, overridePatterns: [] } });
    expect(entries).toEqual([]);
    expect(unmapped).toHaveLength(1);
  });

  it("classifies activities", () => {
    expect(categoryKeys(describeDoc(hit))).toContain("attack:melee");
    expect(describeDoc(plain)).toBeNull();
  });
});

describe("mergeAutorec", () => {
  const mine = { id: "user1", label: "My Rolling Pin", menu: "melee", note: "user" };
  const current = { melee: [mine], range: [], ontoken: [], templatefx: [], preset: [], aura: [], aefx: [] };
  const incoming = {
    melee: [buildEntry({ id: "s", label: "Warhammer", menu: "melee", primary: {} }, "Rolling Pin"), buildEntry({ id: "s", label: "Warhammer", menu: "melee", primary: {} }, "My  Rolling Pin")],
    ontoken: [buildEntry({ id: "s", label: "Bane", menu: "ontoken", primary: {} }, "Hex Fruit")],
  };

  it("adds new entries and never overwrites existing ones", () => {
    const { menus, added, changed } = mergeAutorec(current, incoming);
    expect(added).toBe(2);
    expect(changed.sort()).toEqual(["melee", "ontoken"]);
    expect(menus.melee[0]).toBe(mine);
    expect(menus.melee).toHaveLength(2);
    expect(current.melee).toHaveLength(1); // input not mutated
  });

  it("is idempotent", () => {
    const first = mergeAutorec(current, incoming);
    const second = mergeAutorec(first.menus, incoming);
    expect(second.added).toBe(0);
    expect(second.changed).toEqual([]);
    expect(second.menus).toEqual(first.menus);
  });
});

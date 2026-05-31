import { describe, it, expect } from "vitest";
import { generateId } from "../data/helpers/id.js";
import { compendiumUuid } from "../data/helpers/uuid.js";
import {
  parseBackgroundEquipment,
  roleEquipmentAdvancement,
  backgroundEquipmentAdvancement,
} from "../data/src/backgrounds/equipment-grants.js";
import { classStartingEquipmentAdvancement } from "../data/src/classes/class-equipment-grants.js";
import { backgrounds } from "../data/src/backgrounds/backgrounds.js";
import { roles } from "../data/src/backgrounds/roles.js";
import { items as classes } from "../data/src/classes/index.js";
import { items as compendiumItems } from "../data/src/items/index.js";

const medUuid = compendiumUuid("items", generateId("items/magic/medkit-common"));
const ratUuid = compendiumUuid("items", generateId("items/gear/rations"));
const gloveUuid = compendiumUuid("items", generateId("items/gear/boxing-gloves"));
const trophyUuid = compendiumUuid("items", generateId("items/gear/trophy"));
const chartsUuid = compendiumUuid("items", generateId("items/gear/sea-charts-local"));
const itemIds = new Set(compendiumItems.map((i) => i._id));

function startingEquipmentAdv(advancement) {
  return advancement.find((a) => a.title === "starting-equipment");
}

function grantItems(advancement) {
  return startingEquipmentAdv(advancement)?.configuration?.items ?? [];
}

describe("equipment-grants parsing", () => {
  it("parses suffix quantities for boxer gear", () => {
    const desc = `<p><strong>Equipment:</strong> 150,000 Berries; Small Medkits &times;3; Rations &times;5, a set of boxing gloves, and a trophy from a past victory</p>`;
    const pack = parseBackgroundEquipment(desc);
    expect(pack.beri).toBe(150_000);
    expect(pack.grants.filter((g) => g.uuid === medUuid)).toEqual([
      { uuid: medUuid, quantity: 3 },
    ]);
    expect(pack.grants.filter((g) => g.uuid === ratUuid)).toEqual([
      { uuid: ratUuid, quantity: 5 },
    ]);
    expect(pack.grants.some((g) => g.uuid === gloveUuid)).toBe(true);
    expect(pack.grants.some((g) => g.uuid === trophyUuid)).toBe(true);
  });

  it("parses prefix quantities for bounty hunter gear", () => {
    const desc = `<p><strong>Equipment:</strong> 100,000 Berries; 3 Small Medkits; 5 Rations, Thieves' Tools</p>`;
    const pack = parseBackgroundEquipment(desc);
    expect(pack.grants.filter((g) => g.uuid === medUuid)).toEqual([
      { uuid: medUuid, quantity: 3 },
    ]);
    expect(pack.grants.filter((g) => g.uuid === ratUuid)).toEqual([
      { uuid: ratUuid, quantity: 5 },
    ]);
  });

  it("parses bare ration counts like cook (15 Rations)", () => {
    const desc = `<p><strong>Equipment:</strong> 100,000 Berries; Mess kit; 15 Rations; a recipe book; Cook's Utensils</p>`;
    const pack = parseBackgroundEquipment(desc);
    expect(pack.grants.filter((g) => g.uuid === ratUuid)).toEqual([
      { uuid: ratUuid, quantity: 15 },
    ]);
  });

  it("wires valid compendium UUIDs for all backgrounds", () => {
    for (const bg of backgrounds) {
      const adv = bg.system.advancement.filter((a) => a.title === "starting-equipment");
      expect(adv.length, bg.name).toBe(1);
      for (const item of adv[0].configuration.items) {
        const id = item.uuid.split(".").pop();
        expect(itemIds.has(id), `${bg.name} → ${item.uuid}`).toBe(true);
      }
    }
  });
});

describe("starting-equipment advancement output", () => {
  it("emits single ItemGrant entries with quantity for boxer", () => {
    const boxer = backgrounds.find((b) => b.name === "Boxer");
    expect(boxer).toBeDefined();
    const adv = startingEquipmentAdv(boxer.system.advancement);
    expect(adv).toBeDefined();

    const med = grantItems(boxer.system.advancement).find((i) => i.uuid === medUuid);
    const rat = grantItems(boxer.system.advancement).find((i) => i.uuid === ratUuid);
    expect(med).toEqual({ uuid: medUuid, optional: false, quantity: 3 });
    expect(rat).toEqual({ uuid: ratUuid, optional: false, quantity: 5 });
    expect(adv.configuration.op5eGrantQuantities).toEqual({
      [medUuid]: 3,
      [ratUuid]: 5,
    });
    expect(boxer.flags.op5e.grantQuantities).toEqual({
      [medUuid]: 3,
      [ratUuid]: 5,
    });
  });

  it("does not duplicate UUID rows for stacked navigator charts", () => {
    const { advancement } = roleEquipmentAdvancement("navigator");
    const charts = grantItems(advancement).filter((i) => i.uuid === chartsUuid);
    expect(charts).toHaveLength(1);
    expect(charts[0].quantity).toBe(5);
  });

  it("class starting equipment uses quantity for repeated gear", () => {
    const axeUuid = compendiumUuid("items", generateId("items/weapons/handaxe"));
    const adv = startingEquipmentAdv(classStartingEquipmentAdvancement("barbarian"));
    const handaxes = grantItems(classStartingEquipmentAdvancement("barbarian")).filter(
      (i) => i.uuid === axeUuid,
    );
    expect(handaxes).toHaveLength(1);
    expect(handaxes[0].quantity).toBe(2);
    expect(adv.configuration.op5eGrantQuantities[axeUuid]).toBe(2);
  });

  it("brawler starting equipment grants gear and a simple weapon choice at level 1", () => {
    const clothesUuid = compendiumUuid("items", generateId("items/gear/clothes-common"));
    const backpackUuid = compendiumUuid("items", generateId("items/gear/backpack"));
    const staffUuid = compendiumUuid("items", generateId("items/weapons/quarterstaff"));
    const bulletsUuid = compendiumUuid("items", generateId("items/gear/sling-bullets-20"));
    const rationsUuid = compendiumUuid("items", generateId("items/gear/rations"));
    const advancement = classStartingEquipmentAdvancement("brawler");
    const grant = startingEquipmentAdv(advancement);
    expect(grant.level).toBe(1);
    const uuids = grantItems(advancement).map((i) => i.uuid);
    expect(uuids).toEqual([
      clothesUuid,
      backpackUuid,
      staffUuid,
      bulletsUuid,
      rationsUuid,
    ]);
    const weaponChoice = advancement.find((a) => a.title === "Simple Weapon");
    expect(weaponChoice?.type).toBe("ItemChoice");
    expect(weaponChoice?.level).toBe(1);
    expect(weaponChoice?.configuration.choices).toEqual({ 1: { count: 1, replacement: false } });
  });

  it("class starting equipment uses level 1 (dnd5e class import skips level 0)", () => {
    for (const id of [
      "barbarian", "bard", "brawler", "fighter", "gadgeteer",
      "marksman", "medic", "rogue", "savant",
    ]) {
      const advancement = classStartingEquipmentAdvancement(id);
      const grant = startingEquipmentAdv(advancement);
      expect(grant?.level, id).toBe(1);
      for (const choice of advancement.filter((a) => a.type === "ItemChoice")) {
        expect(choice.level, `${id}:${choice.title}`).toBe(1);
        expect(choice.configuration.choices[1], `${id}:${choice.title}`).toBeDefined();
      }
    }
  });
});

describe("role and class starting equipment", () => {
  it("grants captain role gear including pirate flag", () => {
    const { advancement } = roleEquipmentAdvancement("captain");
    const uuids = grantItems(advancement).map((i) => i.uuid);
    expect(uuids.length).toBeGreaterThanOrEqual(3);
    expect(uuids.every((u) => itemIds.has(u.split(".").pop()))).toBe(true);
  });

  it("adds instrument choice for musician role", () => {
    const { advancement } = roleEquipmentAdvancement("musician");
    expect(advancement.some((a) => a.type === "ItemChoice" && a.title === "Instrument")).toBe(true);
  });

  it("adds starting-equipment ItemGrant for every class", () => {
    for (const cls of classes) {
      const id = cls.system.identifier;
      const wired = cls.system.advancement.some((a) => a.title === "starting-equipment");
      expect(wired, id).toBe(true);
      const standalone = classStartingEquipmentAdvancement(id);
      expect(standalone.some((a) => a.title === "starting-equipment"), id).toBe(true);
    }
  });

  it("wires role starting equipment on role feats", () => {
    for (const role of roles) {
      const adv = role.system.advancement.filter((a) => a.type === "ItemGrant" && a.level === 0);
      expect(adv.length, role.name).toBeGreaterThan(0);
    }
  });

  it("backgroundEquipmentAdvancement exposes grantQuantities map", () => {
    const boxerDesc = backgrounds.find((b) => b.name === "Boxer").system.description.value;
    const { grantQuantities } = backgroundEquipmentAdvancement("boxer", boxerDesc);
    expect(grantQuantities[medUuid]).toBe(3);
    expect(grantQuantities[ratUuid]).toBe(5);
  });
});

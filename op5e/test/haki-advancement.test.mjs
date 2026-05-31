import { describe, it, expect } from "vitest";
import {
  collectOwnedHakiSlugs,
  collectPriorHakiSlugsForChoiceLevel,
  filterHakiPoolForAdvancementStep,
  getAvailableHakiSlugs,
  hakiSlugFromItem,
  hakiUuid,
  HAKI_FEAT_IDS,
  isHakiItemChoiceConfig,
} from "../scripts/haki-advancement-lib.mjs";

function mockActor(items = []) {
  return {
    items: items.map((item) => ({
      id: item.id,
      _id: item.id,
      flags: item.flags,
      _stats: item._stats,
    })),
  };
}

describe("Haki tier tree", () => {
  it("exposes 3 branches × 5 tiers", () => {
    expect(Object.keys(HAKI_FEAT_IDS)).toHaveLength(15);
    expect(hakiUuid("observation-novice")).toBe(
      "Compendium.op5e.class-features.96dcda2a40ae256f",
    );
  });
});

describe("getAvailableHakiSlugs", () => {
  it("offers all three novices when no Haki is owned", () => {
    expect(getAvailableHakiSlugs([])).toEqual([
      "armament-novice",
      "observation-novice",
      "conqueror-novice",
    ]);
  });

  it("offers next tier for started branch and novices for others", () => {
    expect(getAvailableHakiSlugs(["observation-novice"])).toEqual([
      "armament-novice",
      "observation-apprentice",
      "conqueror-novice",
    ]);
  });

  it("offers multiple upgrades when multiple branches are started", () => {
    expect(getAvailableHakiSlugs(["observation-novice", "armament-apprentice"])).toEqual([
      "armament-journeyman",
      "observation-apprentice",
      "conqueror-novice",
    ]);
  });

  it("omits maxed branches", () => {
    expect(getAvailableHakiSlugs(["observation-master"])).toEqual([
      "armament-novice",
      "conqueror-novice",
    ]);
  });

  it("returns empty pool when all branches are mastered", () => {
    expect(
      getAvailableHakiSlugs([
        "armament-master",
        "observation-master",
        "conqueror-master",
      ]),
    ).toEqual([]);
  });
});

describe("collectOwnedHakiSlugs", () => {
  it("reads haki slugs from actor item ids", () => {
    const actor = mockActor([{ id: HAKI_FEAT_IDS["observation-novice"] }]);
    expect(collectOwnedHakiSlugs(actor)).toEqual(new Set(["observation-novice"]));
  });

  it("reads haki slugs from compendium source ids", () => {
    const actor = mockActor([
      {
        id: "local-item-id",
        _stats: {
          compendiumSource: "Compendium.op5e.class-features.c04321ae3bf3215f",
        },
      },
    ]);
    expect(collectOwnedHakiSlugs(actor)).toEqual(new Set(["armament-apprentice"]));
  });
});

describe("collectPriorHakiSlugsForChoiceLevel", () => {
  it("ignores choices at the same or later Haki level", () => {
    const manager = {
      steps: [
        {
          advancement: {
            level: 8,
            configuration: { op5eHakiChoice: true },
            value: {
              added: {
                8: { item1: hakiUuid("observation-novice") },
              },
            },
          },
        },
        {
          advancement: {
            level: 10,
            configuration: { op5eHakiChoice: true },
            value: {
              added: {
                10: { item2: hakiUuid("observation-apprentice") },
              },
            },
          },
        },
      ],
    };

    expect(collectPriorHakiSlugsForChoiceLevel(manager, 8)).toEqual(new Set());
    expect(collectPriorHakiSlugsForChoiceLevel(manager, 10)).toEqual(
      new Set(["observation-novice"]),
    );
    expect(collectPriorHakiSlugsForChoiceLevel(manager, 12)).toEqual(
      new Set(["observation-novice", "observation-apprentice"]),
    );
  });
});

describe("filterHakiPoolForAdvancementStep", () => {
  it("filters ItemChoice pool entries to valid branches", () => {
    const pool = [
      { uuid: hakiUuid("observation-apprentice") },
      { uuid: hakiUuid("observation-novice") },
      { uuid: hakiUuid("armament-novice") },
    ];
    const manager = {
      steps: [
        {
          advancement: {
            level: 8,
            configuration: { op5eHakiChoice: true },
            value: {
              added: {
                8: { item1: hakiUuid("observation-novice") },
              },
            },
          },
        },
        {
          advancement: {
            level: 10,
            configuration: { op5eHakiChoice: true },
            value: { added: {} },
          },
        },
      ],
      step: {
        advancement: {
          level: 10,
          configuration: { op5eHakiChoice: true },
        },
      },
    };

    expect(filterHakiPoolForAdvancementStep(pool, manager, 10)).toEqual([
      { uuid: hakiUuid("observation-apprentice") },
      { uuid: hakiUuid("armament-novice") },
    ]);
  });
});

describe("isHakiItemChoiceConfig", () => {
  it("detects op5e Haki ItemChoice configuration", () => {
    expect(isHakiItemChoiceConfig({ op5eHakiChoice: true })).toBe(true);
    expect(isHakiItemChoiceConfig({})).toBe(false);
  });
});

describe("hakiSlugFromItem", () => {
  it("maps known haki item data to slug", () => {
    expect(
      hakiSlugFromItem({ id: HAKI_FEAT_IDS["conqueror-journeyman"] }),
    ).toBe("conqueror-journeyman");
  });
});

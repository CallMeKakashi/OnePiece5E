import { describe, it, expect } from "vitest";
import {
  allHakiSlugs,
  createHakiAdvancementChoices,
  createHakiItemChoice,
  getAvailableHakiSlugs,
  HAKI_BRANCHES,
  HAKI_CHOICE_LEVELS,
  HAKI_TIERS,
} from "../data/helpers/haki-advancement.ts";

describe("haki-advancement data helper", () => {
  it("defines the full 3×5 tier tree", () => {
    expect(HAKI_BRANCHES).toEqual(["armament", "observation", "conqueror"]);
    expect(HAKI_TIERS).toEqual([
      "novice",
      "apprentice",
      "journeyman",
      "adept",
      "master",
    ]);
    expect(allHakiSlugs()).toHaveLength(15);
  });

  it("creates five ItemChoices at class Haki levels", () => {
    const choices = createHakiAdvancementChoices("class/fighter");
    expect(choices).toHaveLength(HAKI_CHOICE_LEVELS.length);
    expect(choices.map((c) => c.level)).toEqual([...HAKI_CHOICE_LEVELS]);
    for (const choice of choices) {
      expect(choice.type).toBe("ItemChoice");
      expect(choice.configuration.op5eHakiChoice).toBe(true);
      expect(choice.configuration.pool).toHaveLength(15);
    }
  });

  it("marks individual Haki choices with branching hint", () => {
    const choice = createHakiItemChoice("class/fighter", 10);
    expect(choice.title).toBe("Haki (Apprentice)");
    expect(choice.hint).toContain("Upgrade a branch");
  });

  it("matches runtime branching rules", () => {
    expect(getAvailableHakiSlugs(["observation-novice"])).toEqual([
      "armament-novice",
      "observation-apprentice",
      "conqueror-novice",
    ]);
  });
});

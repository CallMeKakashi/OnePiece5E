import { describe, it, expect } from "vitest";
import { items as classes } from "../data/src/classes/index.js";

function traitAdvancement(cls, label) {
  return cls.system.advancement.find(
    (a) => a.type === "Trait" && a.title === label,
  );
}

function itemChoices(cls) {
  return cls.system.advancement.filter((a) => a.type === "ItemChoice");
}

describe("class proficiencies vs source", () => {
  it("brawler has no tool proficiency and correct skills", () => {
    const brawler = classes.find((c) => c.system.identifier === "brawler");
    expect(traitAdvancement(brawler, "tools")).toBeUndefined();

    const skills = traitAdvancement(brawler, "skills");
    expect(skills.configuration.choices[0].pool).toContain("skills:ani");
    expect(skills.configuration.choices[0].pool).toContain("skills:itm");
    expect(skills.configuration.choices[0].pool).not.toContain("skills:his");
  });

  it("brawler starting equipment includes fixed gear and simple weapon choice", () => {
    const brawler = classes.find((c) => c.system.identifier === "brawler");
    const grant = brawler.system.advancement.find((a) => a.title === "starting-equipment");
    expect(grant).toBeDefined();
    expect(grant.level).toBe(1);
    const choices = itemChoices(brawler).map((c) => c.title);
    expect(choices).toContain("Simple Weapon");
    expect(choices).not.toContain("Adventuring Pack");
  });

  it("bard and gadgeteer use dnd5e tool trait wildcards", () => {
    const bard = classes.find((c) => c.system.identifier === "bard");
    const bardTools = traitAdvancement(bard, "tools");
    expect(bardTools.configuration.choices[0].pool).toEqual(["tool:music:*"]);

    const gadgeteer = classes.find((c) => c.system.identifier === "gadgeteer");
    const tools = traitAdvancement(gadgeteer, "tools");
    expect(tools.configuration.choices[0].pool).toEqual(["tool:art:*"]);
  });

  it("gadgeteer has no armor and an artisan tool choice", () => {
    const gadgeteer = classes.find((c) => c.system.identifier === "gadgeteer");
    expect(traitAdvancement(gadgeteer, "armor")).toBeUndefined();
    const tools = traitAdvancement(gadgeteer, "tools");
    expect(tools.configuration.choices[0].count).toBe(1);
    const saves = traitAdvancement(gadgeteer, "saves");
    expect(saves.configuration.grants).toEqual(["saves:int", "saves:wis"]);
  });

  it("medic has medium armor and expanded skill list", () => {
    const medic = classes.find((c) => c.system.identifier === "medic");
    const armor = traitAdvancement(medic, "armor");
    expect(armor.configuration.grants).toContain("armor:med");
    expect(armor.configuration.grants).toContain("armor:shl");
    const skills = traitAdvancement(medic, "skills");
    expect(skills.configuration.choices[0].pool).toContain("skills:inv");
    expect(skills.configuration.choices[0].pool).toContain("skills:per");
  });

  it("marksman grants gunsmith and tinker tools", () => {
    const marksman = classes.find((c) => c.system.identifier === "marksman");
    const tools = traitAdvancement(marksman, "tools");
    expect(tools.configuration.grants).toContain("tool:tinker");
    expect(tools.configuration.grants).toContain("tool:smith");
  });

  it("every class has starting-equipment advancement", () => {
    for (const cls of classes) {
      const wired = cls.system.advancement.some((a) => a.title === "starting-equipment");
      expect(wired, cls.system.identifier).toBe(true);
      expect(itemChoices(cls).length, cls.system.identifier).toBeGreaterThan(0);
    }
  });
});

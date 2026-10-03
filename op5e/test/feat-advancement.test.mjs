import { describe, it, expect } from "vitest";
import { featAutomation } from "../data/helpers/feat-advancement.js";
import { backgroundOriginAdvancement } from "../data/src/backgrounds/origin-advancement.js";

const asi = (html) => featAutomation("t", html).advancement.find((a) => a.type === "AbilityScoreImprovement")?.configuration;
const trait = (html, opts) => featAutomation("t", html, () => {}, opts).advancement.find((a) => a.type === "Trait")?.configuration;

describe("feat description -> automation", () => {
  it("single ability increase is fixed and locks the rest", () => {
    const c = asi("<p>Increase your Constitution score by 1, to a maximum of 20.</p>");
    expect(c).toMatchObject({ fixed: { con: 1 }, points: 0, cap: 1 });
    expect(c.locked).not.toContain("con");
    expect(c.locked).toHaveLength(5);
  });
  it("a choice of abilities gives one point and locks the others", () => {
    const c = asi("<p>Increase your Intelligence or Wisdom score by 1, up to a maximum of 20.</p>");
    expect(c).toMatchObject({ fixed: {}, points: 1 });
    expect(c.locked.sort()).toEqual(["cha", "con", "dex", "str"]);
  });
  it("named skill, tool and save proficiencies become Trait grants", () => {
    expect(trait("<p>You gain proficiency in the Insight skill.</p>").grants).toEqual(["skills:ins"]);
    expect(trait("<p>You gain proficiency in Constitution saving throws.</p>").grants).toEqual(["saves:con"]);
    expect(trait("<p>You gain proficiency in Mason’s tools, or expertise if you were already proficient.</p>").grants).toEqual(["tool:mason"]);
  });
  it("never grants expertise outright (dnd5e upgrade mode would for tools the actor lacks)", () => {
    expect(trait("<p>You gain proficiency in Mason’s tools, or expertise if you were already proficient.</p>").mode).toBe("default");
  });
  it("racial wording and skill lists", () => {
    expect(trait("<p>You have proficiency in the Deception and Insight skills.</p>", { proficienciesOnly: true }).grants).toEqual(["skills:dec", "skills:ins"]);
    expect(trait("<p>You are proficient in Acrobatics and Stealth.</p>", { proficienciesOnly: true }).grants).toEqual(["skills:acr", "skills:ste"]);
    expect(trait("<p>You are proficient in Dexterity (Stealth) and Dexterity (Acrobatics) checks.</p>", { proficienciesOnly: true }).grants).toEqual(["skills:ste", "skills:acr"]);
  });
  it("proficienciesOnly skips ability increases", () => {
    expect(featAutomation("t", "<p>Increase your Strength score by 1.</p>", () => {}, { proficienciesOnly: true }).advancement).toHaveLength(0);
  });
  it("flat bonuses become effects", () => {
    const fx = featAutomation("t", "<p>You gain a +5 bonus to initiative.</p>").effects[0];
    expect(fx.changes[0]).toMatchObject({ key: "system.attributes.init.bonus", value: "5" });
  });
  it("does not invent anything from ambiguous text", () => {
    const a = featAutomation("t", "<p>You gain proficiency in one tool of your choice or improvised weapons.</p>");
    expect(a.advancement).toHaveLength(0);
  });
});

describe("background text -> advancement", () => {
  it("parses '2 from' skill pools and fixed-plus-choice role skills", () => {
    const a = backgroundOriginAdvancement("x", "<p><strong>Skill Proficiencies:</strong> 2 from Athletics, Stealth, and Survival</p>");
    expect(a[0].configuration.choices).toEqual([{ count: 2, pool: ["skills:ath", "skills:ste", "skills:sur"] }]);
    const r = backgroundOriginAdvancement("y", "<p><strong>Skill Proficiencies:</strong> Persuasion, choose two from Acrobatics, Athletics, Insight</p>");
    expect(r[0].configuration.grants).toEqual(["skills:per"]);
    expect(r[0].configuration.choices[0].count).toBe(2);
  });
  it("maps homebrew tools, generic tool phrases and weapon-mastery feat pools", () => {
    const tools = (t) => backgroundOriginAdvancement("t", `<p><strong>Tool Proficiencies:</strong> ${t}</p>`).find((a) => a.title === "tools").configuration;
    expect(tools("Fishing Tackle").grants).toEqual(["tool:fishing"]);
    expect(tools("Your choice of 2 tool kits").choices[0]).toMatchObject({ count: 2 });
    expect(tools("1 tool of your choosing").choices[0].pool).toContain("tool:thief");
    const feat = (t) => backgroundOriginAdvancement("t", `<h4>Feature: X</h4><p>You gain your choice of ${t}.</p>`).find((a) => a.type === "ItemChoice");
    expect(Object.keys(feat("a weapon mastery feat with a simple or martial ranged weapon").configuration.pool)).toHaveLength(6);
    expect(feat("a weapon mastery feat with a simple or martial melee weapon that deals piercing or slashing damage").configuration.pool).toHaveLength(12);
  });
  it("uses dnd5e tool keys, never invented prefixes", () => {
    const a = backgroundOriginAdvancement("z", "<p><strong>Tool Proficiencies:</strong> Disguise kit, Gaming set</p>");
    const keys = [...a[0].configuration.grants, ...a[0].configuration.choices.flatMap((c) => c.pool)];
    for (const k of keys) expect(k).toMatch(/^tool:/);
  });
});

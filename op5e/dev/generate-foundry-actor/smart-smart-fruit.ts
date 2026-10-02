/** Smart Smart no Mi — campaign devil fruit items with DAE + activities. */
import { generateId } from "../../data/helpers/id.js";
import { createDAEEffect, addBonus } from "../../data/helpers/effects.js";
import { ensureFeatureActivities } from "../../data/helpers/activities.ts";
import { DAE_MODES } from "../../data/schemas/common.js";
import type { FeatureItem } from "../../data/schemas/feature.js";

const FRUIT_IMG = "icons/magic/symbols/star-rising-purple.webp";
const DRAWBACK_IMG = "icons/magic/water/wave-water-blue.webp";

function effect(idPath: string, name: string, img: string, changes: { key: string; mode: number; value: string }[]) {
  const e = createDAEEffect(`devil-fruit/smart-smart/${idPath}`, name, changes, { img });
  return { ...e, img: e.img || img };
}

function fruitFeat(
  idPath: string,
  name: string,
  html: string,
  opts: { effects?: ReturnType<typeof effect>[]; system?: Partial<FeatureItem["system"]>; img?: string } = {},
): FeatureItem {
  const img = opts.img ?? FRUIT_IMG;
  const effects = (opts.effects ?? []).map((e) => ({ ...e, img: e.img || img }));
  return ensureFeatureActivities({
    _id: generateId(idPath),
    name,
    type: "feat",
    img,
    system: {
      description: { value: html, chat: "" },
      source: { book: "Blood & Brine", page: "", custom: "", license: "" },
      type: { value: "feat", subtype: opts.system?.type ? (opts.system.type as { subtype?: string }).subtype ?? "" : "" },
      requirements: "",
      activation: { type: "", cost: null, condition: "" },
      duration: { value: null, units: "" },
      target: { value: null, width: null, units: "", type: "" },
      range: { value: null, long: null, units: "" },
      uses: { value: null, max: "", per: null, recovery: "", prompt: true },
      actionType: "",
      damage: { parts: [], versatile: "" },
      save: { ability: "", dc: null, scaling: "spell" },
      chatFlavor: "",
      recharge: { value: null, charged: false },
      ...(opts.system ?? {}),
    },
    effects,
    flags: { op5e: { devilFruit: true } },
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "13",
      systemId: "dnd5e",
      systemVersion: "5.1.10",
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
    },
  } as FeatureItem);
}

export function buildSmartSmartFruitItems(): FeatureItem[] {
  const ADD = DAE_MODES.ADD;

  const root = fruitFeat(
    "devil-fruit/smart-smart/root",
    "Smart Smart no Mi",
    `<p><strong>Paramecia-type Devil Fruit.</strong> Enhances intelligence and comprehension — an Intelligence Human. Vast knowledge, sharpened perception, tactical planning, language mastery, and technological aptitude.</p>
<p><strong>Weaknesses:</strong> No physical enhancement; overconfidence risk; standard Ocean's Scorn drawbacks.</p>`,
    { system: { type: { value: "feat", subtype: "devil-fruit" } } },
  );
  (root.flags as Record<string, unknown>).op5e = { devilFruitRoot: true, fruitType: "Paramecia" };

  const oceanScorn = fruitFeat(
    "devil-fruit/smart-smart/oceans-scorn",
    "Ocean's Scorn",
    `<p>Consuming a devil fruit grants this feature. You lose swimming speed and cannot gain it. Partial submersion in running water above the knees imposes disadvantage on Strength and Dexterity checks and prevents devil fruit activation until contact is broken. Waist-deep water applies additional penalties per OP5e rules. Vulnerability to seastone applies.</p>`,
    { img: DRAWBACK_IMG, effects: [effect("swim", "No Swim Speed", DRAWBACK_IMG, [addBonus("system.attributes.movement.swim", 0)])] },
  );

  const intelligenceHuman = fruitFeat(
    "devil-fruit/smart-smart/intelligence-human",
    "Intelligence Human",
    `<p>Your cognitive abilities are significantly augmented: advanced problem-solving, analytical thinking, and superior memory retention.</p>`,
    {
      effects: [
        effect("int", "+2 Intelligence", FRUIT_IMG, [addBonus("system.abilities.int.value", 2)]),
      ],
    },
  );

  const comprehensiveKnowledge = fruitFeat(
    "devil-fruit/smart-smart/comprehensive-knowledge",
    "Comprehensive Knowledge",
    `<p>Expertise-grade mastery across Arcana, History, Investigation, Nature, and Religion.</p>`,
    {
      effects: [
        effect("know", "Knowledge Expertise", FRUIT_IMG, [
          { key: "system.skills.arc.value", mode: 2, value: "0.5" },
          { key: "system.skills.his.value", mode: 2, value: "0.5" },
          { key: "system.skills.inv.value", mode: 2, value: "0.5" },
          { key: "system.skills.nat.value", mode: 2, value: "0.5" },
          { key: "system.skills.rel.value", mode: 2, value: "0.5" },
        ]),
      ],
    },
  );

  const enhancedPerception = fruitFeat(
    "devil-fruit/smart-smart/enhanced-perception",
    "Enhanced Perception",
    `<p>Advantage on Perception and Investigation; subtle details and patterns stand out.</p>`,
    {
      effects: [
        effect("perc", "Enhanced Perception", FRUIT_IMG, [
          { key: "flags.midi-qol.advantage.skill.prc", mode: ADD, value: "1" },
          { key: "flags.midi-qol.advantage.skill.inv", mode: ADD, value: "1" },
        ]),
      ],
    },
  );

  const tacticalPlanning = fruitFeat(
    "devil-fruit/smart-smart/tactical-planning",
    "Tactical Planning",
    `<p>Initiative advantage; excels at reading opponents and countering plans in combat and competition.</p>`,
    {
      effects: [
        effect("tact", "Tactical Planning", FRUIT_IMG, [
          { key: "flags.dnd5e.initiativeAdv", mode: ADD, value: "1" },
        ]),
      ],
    },
  );

  const polyglot = ensureFeatureActivities(
    fruitFeat(
      "devil-fruit/smart-smart/polyglot",
      "Polyglot",
      `<p>Comprehend Languages — speak and understand languages you hear (3/long rest).</p>`,
      {
        system: {
          activation: { type: "action", cost: 1, condition: "" },
          uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true },
          actionType: "util",
          type: { value: "feat", subtype: "" },
        },
      },
    ) as FeatureItem,
  );

  const techAptitude = fruitFeat(
    "devil-fruit/smart-smart/technological-aptitude",
    "Technological Aptitude",
    `<p>Proficiency and expertise with tinker’s and artisan’s tools; rapid grasp of complex technology.</p>`,
    {
      effects: [
        effect("tools", "Technological Aptitude", FRUIT_IMG, [
          { key: "system.tool.tinker.value", mode: ADD, value: "1" },
          { key: "system.tool.art.value", mode: ADD, value: "1" },
        ]),
      ],
    },
  );

  return [
    root,
    oceanScorn,
    intelligenceHuman,
    comprehensiveKnowledge,
    enhancedPerception,
    tacticalPlanning,
    polyglot,
    techAptitude,
  ];
}

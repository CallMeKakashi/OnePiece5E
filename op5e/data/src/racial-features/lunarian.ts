import { generateId } from "../../helpers/id.js";
import { buildFlamingDualityActivities } from "../../helpers/activities.js";
import { createDAEEffect, customChange, upgradeValue } from "../../helpers/effects.js";
import type { FeatureItem } from "../../schemas/feature.js";

function rf(
  idPath: string,
  name: string,
  desc: string,
  req: string,
  extra: Partial<FeatureItem["system"]> = {},
  effects: FeatureItem["effects"] = [],
): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "race", subtype: "" },
      requirements: req,
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
      ...extra,
    },
    effects,
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: {
      compendiumSource: null, duplicateSource: null,
      coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
      createdTime: null, modifiedTime: null, lastModifiedBy: null,
    },
  } as unknown as FeatureItem;
}

export const lunarianDarkvision = rf(
  "feature/race/lunarian/darkvision",
  "Darkvision",
  `<p>Able to survive anywhere, the dark is no exception. You have darkvision out to 60 feet and can see in dim light as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray.</p>`,
  "Lunarian",
  {},
  [createDAEEffect("race/lunarian/darkvision", "Darkvision", [
    upgradeValue("system.attributes.senses.darkvision", 60),
  ])],
);

export const omniAdapted = rf(
  "feature/race/lunarian/omni-adapted",
  "Omni-Adapted",
  `<p>Lunarians can withstand any and all extreme weather without any debuffs, as well as any climates and altitudes. In addition, you are resistant to fire damage.</p>`,
  "Lunarian",
  {},
  [createDAEEffect("race/lunarian/omni-adapted", "Omni-Adapted", [
    customChange("system.traits.dr.value", "fire"),
  ])],
);

const flamingDualityBase = rf(
  "feature/race/lunarian/flaming-duality",
  "Flaming Duality",
  `<p>At 1st level, you can invoke the flames within. As a bonus action, you can gain access to one of two forms that you can switch between as a bonus action for one minute:</p>
<ul>
<li><strong>Ignited:</strong> Flames erupt from your back and you gain resistance to bludgeoning, piercing, and slashing damage.</li>
<li><strong>Godspeed:</strong> Your movement speed increases by 10.</li>
</ul>
<p>You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a long rest.</p>`,
  "Lunarian",
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
    target: { value: null, width: null, units: "", type: "self" },
    range: { value: null, long: null, units: "self" },
    uses: { value: null, max: "@prof", per: "lr", recovery: "", prompt: true },
  },
);

export const flamingDuality: FeatureItem = {
  ...flamingDualityBase,
  system: {
    ...flamingDualityBase.system,
    activities: buildFlamingDualityActivities({
      name: flamingDualityBase.name,
      type: flamingDualityBase.type,
      effects: flamingDualityBase.effects,
      system: flamingDualityBase.system,
    }),
  },
};

export const empoweredGodspeed = rf(
  "feature/race/lunarian/empowered-godspeed",
  "Empowered Godspeed",
  `<p>At 5th level, your Godspeed form becomes more powerful. While you are in your Godspeed form, opportunity attacks are made against you with disadvantage.</p>`,
  "Lunarian 5",
);

export const improvedIgnite = rf(
  "feature/race/lunarian/improved-ignite",
  "Improved Ignite",
  `<p>At 10th level, your Ignited form becomes more powerful. While you are in your Ignited form, you gain resistance to all damage except psychic.</p>`,
  "Lunarian 10",
);

export const ultimateDuality = rf(
  "feature/race/lunarian/ultimate-duality",
  "Ultimate Duality",
  `<p>At 15th level, you have mastered your Lunarian Physiology. While in your Godspeed form, your movement speed doubles rather than increases by 10. You can now use your Flaming Duality transformation as many times as you want.</p>`,
  "Lunarian 15",
);

export const flameInvesture = rf(
  "feature/race/lunarian/flame-investure",
  "Flame Investure",
  `<p>Lunarians are able to use flames in combat. You know the Fire Bolt trick. Starting at 3rd level, you can use Elemental Armor (fire only) with this trait. Starting at 5th level, you can use the Fireball creation. You cannot use the same creation again until you finish a long rest.</p>
<p>If you have the Creativity feature, these creations are added to your creation lists, allowing you to use these creations with any creation slots you have.</p>
<p>Your creative ability score for these creations is your Constitution score.</p>`,
  "Lunarian",
  {
    activation: { type: "action", cost: 1, condition: "" },
    uses: { value: null, max: "1", per: "lr", recovery: "", prompt: true },
    chatFlavor:
      "Use: cast Fire Bolt (always), Elemental Armor (L3+, fire only), or Fireball (L5+, consumes 1/LR use on this trait). Creations are granted on your sheet (OP5e module).",
  },
);

export const lunarianFeatures: FeatureItem[] = [
  lunarianDarkvision, omniAdapted,
  flamingDuality, empoweredGodspeed, improvedIgnite, ultimateDuality,
  flameInvesture,
];

import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/six-powers-master";

function feat(idPath: string, name: string, level: number, description: string, extra: any = {}): FeatureItem {
  return {
    _id: generateId(idPath),
    name,
    type: "feat",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: description, chat: "" },
      source: { book: "OP5e", page: "", custom: "", license: "" },
      type: { value: "class", subtype: "" },
      requirements: `Brawler (Six Powers Master) ${level}`,
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
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
  } as unknown as FeatureItem;
}

export const sixTechniques = feat(
  "feature/brawler/six-powers-master/six-techniques", "Six Techniques", 3,
  `<p>Beginning at 3rd level, you've mastered a few of the signature techniques of Rokushiki. Choose three of the following techniques. You gain the benefits of the chosen techniques immediately.</p>
<ul>
<li><strong>Moon Walk.</strong> As a bonus action, you can spend 1 spirit point to grant yourself a flight speed equal to half walking speed for one minute.</li>
<li><strong>Iron Body.</strong> As a reaction to taking damage, you can halve it. Afterwards, your movement speed becomes 0 until the end of your next turn.</li>
<li><strong>Finger Pistol.</strong> As part of making an unarmed strike, you can make the attack deal piercing damage, and you increase the size of the damage dice roll (e.g. 1d6 becomes 1d8, 1d10 becomes 1d12).</li>
<li><strong>Tempest Kick.</strong> In place of an unarmed strike, you can instead make a ranged attack with a range of 60 feet. You are proficient with it, and you add your Dexterity to its attack and damage rolls. Its damage is slashing, and its damage die matches the Brawling column of the Brawler table.</li>
<li><strong>Shave.</strong> As a bonus action on your turn you can teleport 15 ft. Alternatively, you can use a reaction when a creature targets you with an attack to spend 1 spirit point to impose disadvantage on the attack and then teleport 15 ft. You cannot use this feature if your movement speed is 0.</li>
<li><strong>Paper Art.</strong> As a reaction when a creature hits you with an attack, you can add your proficiency bonus to your AC against the triggering attack, potentially causing the attack to miss.</li>
</ul>
<p>When you reach 6th level in this class, you gain the remaining 3 techniques you didn't choose at 3rd level.</p>`,
);

export const sixTechniquesRemaining = feat(
  "feature/brawler/six-powers-master/six-techniques-remaining", "Six Techniques (Remaining)", 6,
  `<p>At 6th level, you gain the remaining three techniques from Six Techniques that you didn't choose at 3rd level.</p>`,
);

export const enhancedTechnique = feat(
  "feature/brawler/six-powers-master/enhanced-technique", "Enhanced Technique", 11,
  `<p>At 11th level, you choose two of the six techniques you've mastered to make your specialties. The chosen technique grows stronger as shown below:</p>
<ul>
<li><strong>Moon Walk.</strong> You can now use your full movement speed when flying. While flying this way, opportunity attacks against you are made at disadvantage.</li>
<li><strong>Iron Body.</strong> You can now use any of your movement and still retain the benefits. Your unarmed strikes also harden, allowing you to add half your proficiency bonus (rounded down) to your attack and damage rolls.</li>
<li><strong>Finger Pistol.</strong> You now score a critical hit on a roll of 19 or 20 with unarmed strikes, and Finger Pistol can now work with any weapon that you wield and are proficient in.</li>
<li><strong>Tempest Kick.</strong> The range increases to 120 and ignores any resistance to slashing damage. The attack now deals double damage to objects and structures.</li>
<li><strong>Shave.</strong> The teleport distance increases to 30 feet, and you have advantage on the first attack roll you make after teleporting.</li>
<li><strong>Paper Art.</strong> You can spend a spirit point to make the AC bonus persist until the start of your next turn, not only against the triggering attack.</li>
</ul>
<p>When you reach 17th level, you gain the remaining four enhanced techniques you didn't choose at 11th level.</p>`,
);

export const sixKingGun = feat(
  "feature/brawler/six-powers-master/six-king-gun", "Six King Gun", 17,
  `<p>At 17th level, you learn the secret seventh technique of Six Powers, available only to those who master the common six techniques.</p>
<p>As an action, you exert a blast of force from your hands that is 5 ft wide and 30 ft long, expending up to 10 spirit points. Any creatures within this area must make a Constitution saving throw against your Spirit DC, taking 2d10 force damage per spirit point spent on a failed save, and half that on a successful one. If this damage reduces a creature to 0 hit points, it dies immediately.</p>`,
  {
    activation: { type: "action", cost: 1, condition: "" },
    target: { value: 30, width: 5, units: "ft", type: "line" },
    save: { ability: "con", dc: null, scaling: "wis" },
    actionType: "save",
  },
);

export const features: FeatureItem[] = [
  sixTechniques, sixTechniquesRemaining, enhancedTechnique, sixKingGun,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Six Powers Master",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Six Powers is a classified martial art practiced by the Navy and World Government, allowing the practitioner to move and strike at superhuman levels, having six primary techniques revolving around offense, defense, and mobility in combat.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "six-powers-master",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(sixTechniques) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(sixTechniquesRemaining) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(enhancedTechnique) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(sixKingGun) }]),
    ) as any,
    spellcasting: { progression: "none", ability: "" },
  },
  effects: [],
  flags: {},
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  _stats: { compendiumSource: null, duplicateSource: null, coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10", createdTime: null, modifiedTime: null, lastModifiedBy: null },
} as unknown as SubclassItem;

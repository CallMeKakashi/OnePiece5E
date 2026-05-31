import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/legends";

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
      requirements: `Bard (Legends) ${level}`,
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

export const alluringWarrior = feat(
  "feature/bard/legends/alluring-warrior", "Alluring Warrior", 3,
  `<p>Beginning when you join this college at 3rd level, you gain proficiency with martial weapons, and can use any martial weapon you wield as an apparatus for your Bard Creations.</p>
<p>Additionally, when you attack with any weapon that you are proficient with, you can use your Charisma modifier, instead of Strength or Dexterity, for the attack and damage rolls.</p>`,
);

export const legendaryFlourish = feat(
  "feature/bard/legends/legendary-flourish", "Legendary Flourish", 3,
  `<p>Also at 3rd level, you learn how to weave music into melodic battle cries, unleashing an orchestral flourish mixed with clashing blades. While you are wielding a simple or martial weapon, you can use any of the following Legendary Flourishes:</p>
<ul>
<li><strong>Shielding Hymn.</strong> As a reaction to a creature within 5 ft of you being hit by an attack (can include yourself), you can expend a use of your Bardic Inspiration to block the attack. The damage is reduced by a roll of your Bardic Inspiration die + your Charisma modifier + your bard level.</li>
<li><strong>Stampeding Anthem.</strong> As part of making an attack with a simple or martial weapon, you can expend a use of your Bardic Inspiration to charge the target. Your movement speed increases by 20 ft until the end of your turn, and your attack deals additional damage equal to a roll of your Bardic Inspiration die + your Charisma modifier.</li>
<li><strong>Piercing Ballad.</strong> As part of making an attack with a simple or martial weapon, you can expend a use of your Bardic Inspiration to add a roll of your Bardic Inspiration to the attack roll.</li>
</ul>
<p>When you use one of these flourishes, you gain a number of temporary hit points equal to one roll of your Bardic Inspiration die + your Charisma modifier.</p>`,
);

export const battleMusician = feat(
  "feature/bard/legends/battle-musician", "Battle Musician", 6,
  `<p>Starting at 6th level, you can attack twice, instead of once, whenever you take the Attack action on your turn. You can replace one of these attacks with a trick.</p>
<p>If you ready your action to make an attack, you can attack the same number of times you would if you had taken the attack action on your turn.</p>`,
);

export const bandTogether = feat(
  "feature/bard/legends/band-together", "Band Together", 6,
  `<p>Also at 6th level, you and your team work together to form a truly harmonious performance in battle, moving as one, utilizing similar techniques to great effectiveness.</p>
<p>When a creature has one of your Bardic Inspiration dice, they can expend the die and use one of your Legendary Flourishes, using your Charisma modifier.</p>`,
);

export const rallyingEncore = feat(
  "feature/bard/legends/rallying-encore", "Rallying Encore", 14,
  `<p>At 14th level, your music can inspire allies to fight on even as death encroaches upon them.</p>
<p>When you see a friendly creature be reduced to 0 hit points, you can use your reaction to sound a majestic melody that resonates with their spirit. The target instead falls to 1 hit point before it regains a number of hit points equal to your bard level, even if it normally would have died. Any negative effects caused by falling to 0 hit points are negated.</p>
<p>Once you use this feature, you must finish a short or long rest before you can do so again or by expending a Bard creation slot of 5th level or higher.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Friendly creature reduced to 0 HP" },
    uses: { value: 1, max: "1", per: "sr", recovery: "", prompt: true },
  },
);

export const features: FeatureItem[] = [
  alluringWarrior, legendaryFlourish, battleMusician, bandTogether, rallyingEncore,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of Legends",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards belonging to the college of legends are drawn to powerful personalities, intent on recording the life of extraordinary individuals and immortalizing them through song and music. These daring bards believe that a single powerful will can change the course of history and dedicate themselves to seeing their muse's ambition come true.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "legends",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(alluringWarrior) }, { uuid: fUuid(legendaryFlourish) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(battleMusician) }, { uuid: fUuid(bandTogether) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(rallyingEncore) }]),
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

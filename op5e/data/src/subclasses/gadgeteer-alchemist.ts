import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/gadgeteer/alchemist";

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
      requirements: `Gadgeteer (Alchemist) ${level}`,
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

export const periodicProficiency = feat(
  "feature/gadgeteer/alchemist/periodic-proficiency", "Periodic Proficiency", 3,
  `<p>When you adopt this specialization at 3rd level, you gain proficiency with alchemist's supplies. If you already have this proficiency, you gain proficiency with one other type of artisan's tools of your choice.</p>
<p>In addition, you can choose to prepare creations and tricks from the Medic creation list. You must otherwise obey all the restrictions for selecting the creation, and it becomes a Gadgeteer creation for you.</p>`,
);

export const chemicalCocktail = feat(
  "feature/gadgeteer/alchemist/chemical-cocktail", "Chemical Cocktail", 3,
  `<p>Beginning at 3rd level, whenever you finish a long rest, you can quickly produce a chemical cocktail in an empty flask you touch. Choose from the Chemical Cocktail table for the cocktail's effect, which is triggered when someone drinks it. As a bonus action, a creature can drink it or administer it to an incapacitated creature.</p>
<p>You can create additional chemical cocktails by expending a creation slot of 1st level or higher for each one. Creating a Chemical Cocktail requires you to have alchemist supplies on your person, and any cocktail you create with this feature lasts until it is drunk or until the end of your next long rest.</p>
<p>When you reach certain levels in this class, you can make more cocktails at the end of a long rest: two at 6th level and three at 15th level.</p>
<ul>
<li><strong>Healing.</strong> The drinker regains hit points equal to 4d4 + your Intelligence modifier.</li>
<li><strong>Swiftness.</strong> The drinker's walking speed increases by 10 feet for 1 hour.</li>
<li><strong>Resilience.</strong> The drinker gains a +1 bonus to AC for 10 minutes.</li>
<li><strong>Boldness.</strong> The drinker can roll a d4 and add the number rolled to every attack roll and saving throw they make for the next minute.</li>
<li><strong>Strength.</strong> The drinker, for 1 minute, deals extra damage with melee attacks equal to your Intelligence modifier.</li>
<li><strong>Transformation.</strong> The drinker's body is transformed as if by the Alter Self creation. The effects last for 10 minutes.</li>
</ul>`,
);

export const alchemicalSavant = feat(
  "feature/gadgeteer/alchemist/alchemical-savant", "Alchemical Savant", 5,
  `<p>At 5th level, you've developed a masterful command over chemicals, enhancing the healing and damage you create through them. Whenever you use a creation using your alchemist's supplies as the creation focus, you gain a bonus to one roll of the creation. That roll must restore hit points or be a damage roll that deals acid, fire, necrotic, or poison damage, and the bonus equals your Intelligence modifier (minimum of +1).</p>`,
);

export const restorativeAgents = feat(
  "feature/gadgeteer/alchemist/restorative-agents", "Restorative Agents", 9,
  `<p>Starting at 9th level, you can incorporate restorative reagents into some of your works:</p>
<ul>
<li>Whenever a creature drinks a Chemical Cocktail you created, the creature gains temporary hit points equal to 2d6 + your Intelligence modifier (minimum of 1 temporary hit point).</li>
<li>You can use the Lesser Restoration creation without expending a creation slot and without preparing the creation, provided you use alchemist's supplies as the creation focus. You can do so a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a long rest.</li>
</ul>`,
  { uses: { value: null, max: "@abilities.int.mod", per: "lr", recovery: "", prompt: true } },
);

export const chemicalMastery = feat(
  "feature/gadgeteer/alchemist/chemical-mastery", "Chemical Mastery", 15,
  `<p>By 15th level, you have been exposed to so many chemicals that they pose little risk to you, and you can use them to quickly end certain ailments:</p>
<ul>
<li>You gain resistance to acid damage and poison damage, and you are now immune to the poisoned condition.</li>
<li>You can cast Greater Restoration and Heal without expending a creation slot, without preparing the creation, and without providing the material component, provided you use alchemist's supplies as the creation focus. Once you cast either creation with this feature three times, you can't do it again until you finish a long rest.</li>
</ul>`,
  { uses: { value: 3, max: "3", per: "lr", recovery: "", prompt: true } },
);

export const features: FeatureItem[] = [
  periodicProficiency, chemicalCocktail, alchemicalSavant, restorativeAgents, chemicalMastery,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Alchemist",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>An Alchemist is an expert at combining reagents to produce chemical effects. Alchemists use their creations to give life and to leech it away. Its versatility has long been valued during times of war and peace.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "alchemist",
    classIdentifier: "gadgeteer",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(periodicProficiency) }, { uuid: fUuid(chemicalCocktail) }]),
      createItemGrant(SC_ID, 5, [{ uuid: fUuid(alchemicalSavant) }]),
      createItemGrant(SC_ID, 9, [{ uuid: fUuid(restorativeAgents) }]),
      createItemGrant(SC_ID, 15, [{ uuid: fUuid(chemicalMastery) }]),
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

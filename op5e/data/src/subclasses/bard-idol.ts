import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/bard/idol";

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
      requirements: `Bard (Idol) ${level}`,
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

export const encourageEntourage = feat(
  "feature/bard/idol/encourage-entourage", "Encourage Entourage", 3,
  `<p>When you join the College of The Idol at 3rd level, you can use your performance to cover for your allies. When a creature you can see within 30 feet of you makes an attack roll or ability check, you can use your reaction to perform, allowing them to push forward. Make a Charisma (Performance) check and replace the original attack roll or ability check with the result, unless the original was higher.</p>
<p>You have a number of uses of this ability equal to 1 + your Charisma modifier. All these uses replenish on a long rest.</p>`,
  {
    activation: { type: "reaction", cost: 1, condition: "Creature within 30 ft makes attack roll or ability check" },
    range: { value: 30, long: null, units: "ft" },
    uses: { value: null, max: "1 + @abilities.cha.mod", per: "lr", recovery: "", prompt: true },
  },
);

export const starOfTheShow = feat(
  "feature/bard/idol/star-of-the-show", "Star of the Show", 3,
  `<p>Starting at 3rd level, you become an idol that inspires all who bask in your presence. You exude a 10 ft aura centered on yourself. Each creature of your choice within the radius (can include yourself) that starts their turn in your aura gains a number of temporary hit points equal to your Charisma modifier (minimum of 1) while you are conscious. These temporary hit points last until the creature leaves your aura.</p>`,
);

export const expandedInfluence = feat(
  "feature/bard/idol/expanded-influence", "Expanded Influence", 6,
  `<p>At 6th level, your following and charm becomes more potent, expanding your inspirational aura. Your aura increases to 20 ft. In addition, each creature of your choice within your aura (can include yourself) can't be charmed while you are conscious.</p>`,
);

export const invincibleIcon = feat(
  "feature/bard/idol/invincible-icon", "Invincible Icon", 6,
  `<p>Also at 6th level, your enthralling aura bolsters all of those around you. The temporary hit points you grant to creatures of your choice within your aura is now equal to double your Charisma modifier (minimum of 2).</p>`,
);

export const setTheStage = feat(
  "feature/bard/idol/set-the-stage", "Set the Stage", 14,
  `<p>At 14th level, your mere presence is enough to sweep most off their feet. Your aura increases to 30 ft. When you grant a creature a Bardic Inspiration while within your aura, each creature of your choice also gains a Bardic Inspiration (at no extra cost).</p>
<p>In addition, each creature of your choice within your aura gains a bonus to their saving throws equal to your Charisma modifier (minimum of 1) while you are conscious.</p>`,
);

export const features: FeatureItem[] = [
  encourageEntourage, starOfTheShow, expandedInfluence, invincibleIcon, setTheStage,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "College of The Idol",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Bards of the college of the idol harbor more ambition in their pursuit of their performance. These bards are most often regarded as superstars, and world-renowned idols, dazzling and capturing the hearts and minds of the audience all around the world.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "idol",
    classIdentifier: "bard",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(encourageEntourage) }, { uuid: fUuid(starOfTheShow) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(expandedInfluence) }, { uuid: fUuid(invincibleIcon) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(setTheStage) }]),
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

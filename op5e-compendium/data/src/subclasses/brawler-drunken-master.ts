import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/brawler/drunken-master";

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
      requirements: `Brawler (Drunken Master) ${level}`,
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

export const drunkenArts = feat(
  "feature/brawler/drunken-master/drunken-arts", "Drunken Arts", 3,
  `<p>When you choose this tradition at 3rd level, your drunken state allows you to always be ready to avoid the full brunt, either by dulling your pain, or to move with chaotic ebb and flow.</p>
<p>At the start of each of your turns, and if you have at least 1 hit point, you gain a number of temporary hit points equal to your Wisdom modifier. This amount of temporary hit points doubles when you reach 6th level.</p>`,
);

export const swingingStance = feat(
  "feature/brawler/drunken-master/swinging-stance", "Swinging Stance", 3,
  `<p>Also at 3rd level, you have sharpened your drunken stupors into a deadly and drunken combative state.</p>
<p>As a bonus action, you can expend a spirit point to enter a Swinging Stance for 1 minute with concentration. When you enter this state, and each time you start your turn while in this stance, roll a d8. This d8 determines a specific benefit you gain that lasts until the start of your next turn:</p>
<ul>
<li><strong>1 — Drunken Rage.</strong> You gain a bonus to all of your damage rolls with weapon attacks and unarmed strikes equal to your Wisdom modifier.</li>
<li><strong>2 — Completely Hammered.</strong> You gain resistance to all bludgeoning, piercing, and slashing damage.</li>
<li><strong>3 — Drowning Sorrow.</strong> If an enemy creature within 30 ft of you makes an attack roll against any creature other than you, they do so at disadvantage.</li>
<li><strong>4 — Slippery Drunk.</strong> Your movement speed increases by 10 ft and you don't provoke opportunity attacks.</li>
<li><strong>5 — Cackling Stupor.</strong> When you use Flurry of Blows, you ignore the Spirit Point cost.</li>
<li><strong>6 — Reckless Abandonment.</strong> All of your attacks are made at advantage.</li>
<li><strong>7 — Flirtatious Facade.</strong> All attack rolls against you are made at disadvantage.</li>
<li><strong>8 — Blacked Out.</strong> Roll twice on this table, and you gain both benefits. Reroll any 8s or duplicates.</li>
</ul>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
  },
);

export const tipsyBalance = feat(
  "feature/brawler/drunken-master/tipsy-balance", "Tipsy Balance", 6,
  `<p>Starting at 6th level, you gain the following benefits:</p>
<ul>
<li>As an attack action, you can make a single melee attack against any number of creatures within melee range of you, with a separate attack roll for each target.</li>
<li>When you're prone, you can stand up by spending 5 feet of movement, rather than half your speed.</li>
<li>When a creature misses you with a melee attack roll, you can use your reaction to cause that attack to hit one creature of your choice, other than the attacker, that you can see within the attacker's melee range.</li>
</ul>`,
);

export const hardyResolution = feat(
  "feature/brawler/drunken-master/hardy-resolution", "Hardy Resolution", 11,
  `<p>Starting at 11th level, your drunken stupor is your safe haven, and unbreakable state of mind. While you are under the effects of your Swinging Stance feature, you have advantage on all saving throws against charmed, fear, restrained, stunned, and paralyzed.</p>`,
);

export const liquorLord = feat(
  "feature/brawler/drunken-master/liquor-lord", "Liquor Lord", 17,
  `<p>By 17th level, you have mastered the art of your unpredictable sways. As a bonus action, instead of spending 1 spirit point to access your Swinging Stance feature, you can instead spend 6 spirit points to gain all the benefits simultaneously for 1 minute, without concentration.</p>`,
  {
    activation: { type: "bonus", cost: 1, condition: "" },
    duration: { value: 1, units: "minute" },
  },
);

export const features: FeatureItem[] = [
  drunkenArts, swingingStance, tipsyBalance, hardyResolution, liquorLord,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Drunken Master",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>Often seen as unassuming drunkards, the Drunken Masters are a force to be reckoned with. Due to their drunken stance, they can move unpredictably, and strike with deadly fury, all the while their opponent is both beaten and baffled.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "drunken-master",
    classIdentifier: "brawler",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 3, [{ uuid: fUuid(drunkenArts) }, { uuid: fUuid(swingingStance) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(tipsyBalance) }]),
      createItemGrant(SC_ID, 11, [{ uuid: fUuid(hardyResolution) }]),
      createItemGrant(SC_ID, 17, [{ uuid: fUuid(liquorLord) }]),
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

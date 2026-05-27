import { generateId } from "../../helpers/id.js";
import { compendiumUuid } from "../../helpers/uuid.js";
import { createItemGrant, mergeAdvancements } from "../../helpers/advancement.js";
import type { SubclassItem } from "../../schemas/subclass.js";
import type { FeatureItem } from "../../schemas/feature.js";

const SC_ID = "subclass/medic/bio-engineer";

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
      requirements: `Medic (Bio-Engineer) ${level}`,
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

export const testSubject = feat(
  "feature/medic/bio-engineer/test-subject", "Test Subject", 2,
  `<p>When you choose this archetype at 2nd level, you create a test subject that will follow your every whim. Choose either the Amalgamation, Flora, or Clone to be your test subject.</p>
<p>In combat, the test subject acts during your turn. It can move and use its reaction on its own, but the only action it takes is the Dodge action, unless you take a bonus action on your turn to command it to take another action. If you are incapacitated, it can take any action of its choice.</p>
<p>If your test subject is reduced to 0 hit points, it falls unconscious and makes death saving throws. As an action, you can touch an unconscious or dead test subject and expend one creation slot of 1st level or higher. If unconscious, it regains 1d8 hit points per creation slot level instantly. If dead, it regains consciousness after 1 minute with all its maximum hit points restored.</p>`,
);

export const experimentalAugmentations = feat(
  "feature/medic/bio-engineer/experimental-augmentations", "Experimental Augmentations", 2,
  `<p>Also at 2nd level, you can further customize your Test Subject with a number of upgrades equal to your Proficiency Bonus. You can change these Experimental Augmentations at the end of a long rest. Available augmentations include:</p>
<ul>
<li><strong>Amphibious Lineage</strong> — swimming speed and water breathing</li>
<li><strong>Brainy Lineage</strong> — +2 INT, speech, proficiencies</li>
<li><strong>Camouflage Lineage</strong> — Hide as bonus action, Stealth proficiency/expertise</li>
<li><strong>Carnivorous Lineage</strong> — bonus damage vs. wounded targets</li>
<li><strong>Clawed Lineage</strong> (Amalgamation) — 1d10 melee, climbing speed, pounce</li>
<li><strong>Conduit Lineage</strong> — creations originate from Test Subject</li>
<li><strong>Corrosive Lineage</strong> — acid resistance, new attacks</li>
<li><strong>Devil Fruit Lineage</strong> — shares Devil Fruit abilities</li>
<li><strong>Echoing Lineage</strong> — 30ft blindsight</li>
<li><strong>Evasive Lineage</strong> — Evasion trait</li>
<li><strong>Giant Lineage</strong> — size increase, Siege property</li>
<li><strong>Hydra Lineage</strong> (Amalgamation) — multiple heads, advantage on Perception</li>
<li><strong>Nimble Lineage</strong> — +10ft speed, disadvantage on opportunity attacks</li>
<li><strong>Pack Lineage</strong> (Amalgamation) — pack tactics</li>
<li><strong>Relentless Lineage</strong> — drop to 1 HP instead of 0</li>
<li><strong>Reviving Lineage</strong> — bonus healing equal to WIS mod</li>
<li><strong>Shelled Lineage</strong> — +1 AC</li>
<li><strong>Tough Lineage</strong> — bonus HP equal to 2x level</li>
</ul>
<p>Additional augmentations are available at higher levels and for specific test subject types.</p>`,
);

export const phaseTwo = feat(
  "feature/medic/bio-engineer/phase-two", "Phase Two", 6,
  `<p>Beginning at 6th level, you develop a connection with your Test Subject, enabling you to better coordinate with it. You gain the following benefits:</p>
<ul>
<li>You can communicate telepathically with your Test Subject and perceive through its senses as long as you are on the same plane of existence. While perceiving through its senses, you can also speak through your Test Subject in your own voice.</li>
<li>When you use a creation with a range of self, you can choose to have the creation affect both yourself and your Test Subject.</li>
<li>Your Test Subject shares any Haki features that you have.</li>
</ul>`,
);

export const mutantMethod = feat(
  "feature/medic/bio-engineer/mutant-method", "Mutant Method", 10,
  `<p>At 10th level, your experiments with your Test Subject has rendered them resilient to all punishment. When you command your Test Subject to take the Attack action, your Test Subject can make two attacks instead of one.</p>
<p>In addition, your Test Subject gains resistance to bludgeoning, piercing, and slashing damage.</p>`,
);

export const perfectedSubject = feat(
  "feature/medic/bio-engineer/perfected-subject", "Perfected Subject", 14,
  `<p>At 14th level, you have perfected the art of engineering living organisms. You gain the following benefits:</p>
<ul>
<li>You no longer need to use a bonus action to command your Test Subject, and it can take actions other than Dodge when not commanded. It still remains subservient to you.</li>
<li>Your Test Subject's hit point maximum increases by your level, and by 1 each level thereafter.</li>
</ul>`,
);

export const features: FeatureItem[] = [
  testSubject, experimentalAugmentations, phaseTwo, mutantMethod, perfectedSubject,
];

function fUuid(f: FeatureItem): string {
  return compendiumUuid("class-features", f._id);
}

export const subclass: SubclassItem = {
  _id: generateId(SC_ID),
  name: "Bio-Engineer",
  type: "subclass",
  img: "icons/svg/item-bag.svg",
  system: {
    description: { value: `<p>The Bio-Engineer is a medic that toys with life, playing god. Performing experiments and tests that result in the creation of a whole new being, their test subject, a companion through each phase of experimentation.</p>`, chat: "" },
    source: { book: "OP5e", page: "", custom: "", license: "" },
    identifier: "bio-engineer",
    classIdentifier: "medic",
    advancement: mergeAdvancements(
      createItemGrant(SC_ID, 2, [{ uuid: fUuid(testSubject) }, { uuid: fUuid(experimentalAugmentations) }]),
      createItemGrant(SC_ID, 6, [{ uuid: fUuid(phaseTwo) }]),
      createItemGrant(SC_ID, 10, [{ uuid: fUuid(mutantMethod) }]),
      createItemGrant(SC_ID, 14, [{ uuid: fUuid(perfectedSubject) }]),
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

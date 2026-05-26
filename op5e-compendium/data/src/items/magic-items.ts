import { generateId } from "../../helpers/id.js";
import type { FoundryItem } from "../../schemas/common.js";

const STATS = {
  compendiumSource: null, duplicateSource: null,
  coreVersion: "13", systemId: "dnd5e", systemVersion: "5.1.10",
  createdTime: null, modifiedTime: null, lastModifiedBy: null,
};
const SRC = { book: "OP5e", page: "", custom: "", license: "" };

function magicEquip(
  id: string, name: string, rarity: string, desc: string,
  subtype = "trinket", attunement = false,
): FoundryItem {
  return {
    _id: generateId(`items/magic/${id}`),
    name,
    type: "equipment",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      rarity,
      type: { value: subtype },
      attunement: attunement ? "required" : "",
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function magicWeapon(
  id: string, name: string, rarity: string, desc: string,
  attunement = false,
): FoundryItem {
  return {
    _id: generateId(`items/magic/${id}`),
    name,
    type: "weapon",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      rarity,
      attunement: attunement ? "required" : "",
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function consumableItem(
  id: string, name: string, rarity: string, desc: string,
  subtype = "potion",
): FoundryItem {
  return {
    _id: generateId(`items/magic/${id}`),
    name,
    type: "consumable",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      rarity,
      type: { value: subtype },
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

function lootItem(
  id: string, name: string, rarity: string, desc: string,
): FoundryItem {
  return {
    _id: generateId(`items/magic/${id}`),
    name,
    type: "loot",
    img: "icons/svg/item-bag.svg",
    system: {
      description: { value: desc, chat: "" },
      source: SRC,
      rarity,
    },
    effects: [],
    flags: {},
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    _stats: STATS,
  } as unknown as FoundryItem;
}

export const magicItems: FoundryItem[] = [
  // ═══════════════════════════════════
  // ARMOR
  // ═══════════════════════════════════
  magicEquip("serpent-armor", "Serpent Armor (Serpent Scale)", "uncommon",
    `<p>This set of armor has been crafted from the remains of a rare species of snake whose scales were tough as steel, but as light as leather.</p>
<p>This armor acts like a set of scale mail. However, you may add your full Dexterity modifier to your AC instead of just 2. In addition, it doesn't grant disadvantage on Stealth checks.</p>`,
    "medium"),

  magicEquip("raid-suit", "Raid Suit", "rare",
    `<p>Raid Suits are a special type of armor used by the Germa to enhance their soldiers. While wearing this armor, you gain the following benefits:</p>
<ul>
<li>+2 bonus to AC</li>
<li>10 ft increase to movement speed</li>
<li>Additional abilities such as being able to use a creation</li>
<li>No Stealth disadvantage from heavy armor</li>
<li>The gloves of the suit count as simple weapons, each a +2 that deals 1d6 damage</li>
</ul>`,
    "heavy", true),

  magicEquip("seastone-armor", "Seastone Armor", "legendary",
    `<p>Seastone armor is +3 armor. When the wearer is grappling a devil fruit user, the target must make a Constitution Saving Throw (DC 20) both when grappled and at the end of each of their turns while grappled.</p>
<p>If the wearer is a devil fruit user, they are also subject to the Constitution Saving Throw at the end of each of their turns.</p>`,
    "heavy", true),

  // ═══════════════════════════════════
  // WONDROUS ITEMS
  // ═══════════════════════════════════
  magicEquip("boots-of-speed", "Boots of Speed", "rare",
    `<p>This pair of boots are equipped with an apparatus that allows for propulsion. While you wear these boots, you can use a bonus action and click the boots' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. If you click your heels together again, you end the effect.</p>
<p>When the boots' property has been used for a total of 10 minutes, the effect ceases to function until you finish a long rest.</p>`,
    "trinket", true),

  magicEquip("bracers-of-defense", "Bracers of Defense", "rare",
    `<p>This set of bracers is likely made from the durable hide of a giant beast. While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield.</p>`,
    "trinket", true),

  magicEquip("night-vision-goggles", "Night Vision Goggles (Goggles of Night)", "uncommon",
    `<p>A specially designed set of goggles that grant the wearer the ability to see in the dark.</p>
<p>While wearing these lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet.</p>`,
    "trinket"),

  magicEquip("prosthetic-limb", "Prosthetic Limb", "common",
    `<p>Limbs are lost all the time at sea, especially in large-scale naval battles. Luckily, science has enabled those who have lost their limbs to regain their previous function.</p>
<p>This item replaces a lost limb&mdash;a hand, arm, foot, leg, or similar. While attached, it functions identically to the part it replaces. You can detach or reattach it as an action, and it can't be removed against your will. It detaches if you die.</p>`,
    "trinket"),

  magicEquip("jet-dial-bracers", "Jet Dial Bracers", "very rare",
    `<p>This set of bracers has within it two Jet Dials hidden within the elbows of the wearer. These bracers increase the power of the wearer's attacks utilizing the force of the near extinct Jet Dial.</p>
<p>While wearing these bracers, any weapon attack or unarmed strike counts as a +2 weapon and deals an extra 1d6 damage.</p>
<p>Additionally, you have advantage on shove attempts and can shove a creature that is two sizes larger than yourself.</p>`,
    "trinket", true),

  magicEquip("pocket-hospital", "Pocket Hospital", "rare",
    `<p>A small, handheld device in the shape of a heart with a plus sign, loaded with the ability to manufacture chemicals. When wielded by a Medic, it allows them to form chemicals into fast acting medicine.</p>
<p>The device has 10 charges. While holding it, you can use an action to expend charges to use the following creations (using your creativity save DC): Cure Wounds (1 charge per level, up to 4th), Lesser Restoration (2 charges), or Mass Cure Wounds (5 charges).</p>
<p>The device regains all expended charges daily at dawn.</p>`,
    "trinket", true),

  magicEquip("bubble-coral", "Bubble Coral", "uncommon",
    `<p>Bubble Corals allow the user to push water and produce air for humans to breathe in underwater areas.</p>
<p>As an action, you can create a 30 ft radius sphere of air within a water-logged area, pushing all water out while not affecting creatures. The bubble can be popped if it takes over 30 damage.</p>`,
    "trinket"),

  // ═══════════════════════════════════
  // RINGS
  // ═══════════════════════════════════
  magicEquip("rocket-ring", "Rocket Ring (Ring of Jumping)", "uncommon",
    `<p>This ring holds within it a small rocket engine that can generate enough lift to launch the wearer into the air at will.</p>
<p>While wearing this ring, you can use the Jump creation from it as a bonus action at will, but can target only yourself.</p>`,
    "trinket", true),

  // ═══════════════════════════════════
  // STAFF AND WANDS
  // ═══════════════════════════════════
  magicEquip("force-gun", "Force Gun (Wand of Magic Missiles)", "uncommon",
    `<p>This small, handheld gadget allows the user to unleash a barrage of bullets made out of pure force.</p>
<p>This gun has 7 charges. While holding it, you can use an action to expend 1 or more charges to use the Missiles creation. For 1 charge, you cast the 1st-level version. You can increase the creation slot level by one for each additional charge.</p>
<p>The gun regains 1d6 + 1 expended charges daily at dawn. If you expend the last charge, roll a d20. On a 1, the gun becomes unsalvageable.</p>`,
    "trinket"),

  magicEquip("defender-field", "Defender Field (Staff of Defense)", "uncommon",
    `<p>This small, handheld gadget emanates a constant field of protection around the user.</p>
<p>While holding the gadget, you have a +1 bonus to AC.</p>
<p>The gadget has 10 charges. With the gadget in hand, you can use your action to use: Gadget Armor (1 charge) or Shield (2 charges). No components required.</p>
<p>The gadget regains 1d6 + 4 expended charges each day at dawn. If you expend the last charge, roll a d20. On a 1, the gadget becomes unsalvageable.</p>`,
    "trinket", true),

  magicEquip("the-raging-drum", "The Raging Drum", "very rare",
    `<p>A small, portable drum bound with some kind of red hide. Wielded by talented bards, it has seen some of the most devastating wars.</p>
<p>This drum counts as a Bard Apparatus that grants +2 to creative attack rolls and DCs for Bard Creations.</p>
<p>Whenever you roll initiative with no uses of Bardic Inspiration remaining, you regain 1 usage.</p>
<p>This drum has 7 charges, regaining all at dawn.</p>
<ul>
<li><strong>Commanding Beat (1 charge):</strong> Use an action to use the Command creation using your Creativity DC.</li>
<li><strong>Broken Battle Bridge (3 charges):</strong> Use an action to use the Fear creation using your Creativity DC.</li>
</ul>`,
    "trinket", true),

  magicEquip("the-silver-seer", "The Silver Seer", "legendary",
    `<p>Forged during the Void Century, the Silver Seer is a sentient shield with an intelligence of 16, wisdom of 18, and charisma of 22. It is Chaotic Good. It has expertise in all Wisdom and Charisma skill checks.</p>
<p>A creature with Charisma less than 18 that attempts to don it must make a CHA save (DC 18) or take 3d10 psychic damage and become blinded for 1 minute. On success, half damage.</p>
<h4>Stirring</h4>
<p>+1 shield. When rolling initiative or Perception checks, make a CHA save (DC 18). Fail: disadvantage for 1 hour. Success: advantage for 1 hour. You learn the Protection Fighting Style.</p>
<h4>Wakened</h4>
<p>+2 shield. Advantage on initiative and Perception by default. At dawn, the shield picks a random ability score; on saves with that score, make a CHA save (DC 18). Fail: auto-fail the save. Success: half damage on fail, no damage on success. Protection Fighting Style grants shield AC to protected creatures.</p>
<h4>Ascendant</h4>
<p>+3 shield. You choose the ability score. No CHA save needed. Half damage on fail, none on success. This effect extends to allies within 10 ft.</p>`,
    "trinket", true),

  // ═══════════════════════════════════
  // NAMED WEAPONS — Ranked & Cursed
  // ═══════════════════════════════════
  magicWeapon("orange-mile", "Orange Mile", "uncommon",
    `<p>A Grade glaive with an orange and black color scheme. Fierce like a tiger, able to slash through the wielder's enemies.</p>
<p>This weapon is a +1 Glaive.</p>`),

  magicWeapon("arched-horn", "Arched Horn", "uncommon",
    `<p>A Grade sickle with a glossy, dark brown blade. It is jagged, yet razor sharp.</p>
<p>This weapon is a +1 Sickle.</p>`),

  magicWeapon("oceans-mourning", "Ocean's Mourning", "rare",
    `<p>A Skillful Grade cutlass whose blade is tipped with seastone. The metal is sea blue and decorated with ornate ivory.</p>
<p>This weapon is a +2 Sickle. This blade ignores devil fruit resistances and immunities.</p>`,
    true),

  magicWeapon("distortion", "Distortion", "rare",
    `<p>A Skillful Grade rapier with a purple guard and dark gray blade. This blade is a +2 Rapier and is cursed.</p>
<p><strong>Curse:</strong> The wielder's vision is distorted when holding this weapon. All attacks against the wielder are made at advantage.</p>
<p><strong>Curse Overcome:</strong> Once per turn, when you hit a creature, it must make a WIS save (DC 8 + Proficiency + WIS mod). On failure, that creature has disadvantage on attacks against you. On success, no effect that turn.</p>`,
    true),

  magicWeapon("mountain-mist", "Mountain Mist", "very rare",
    `<p>A Great Grade katana with a gray blade and green, rose thorn-like guard and handle.</p>
<p>This blade is a +3 katana. It deals 3d4 slashing instead of 2d4 slashing.</p>`,
    true),

  magicWeapon("the-faithful-one", "The Faithful One", "very rare",
    `<p>A Great Grade dagger with a blue hilt and a repeating pattern of wings and feathers.</p>
<p>This blade is a +3 dagger but is cursed. Any time the blade is used to attack, roll 1d20. On a 1, the blade vanishes and hides within 120 ft of the wielder.</p>
<p><strong>Curse Overcome:</strong> The blade always returns to the wielder's hand as a free action.</p>`,
    true),

  magicWeapon("lucky-day", "Lucky Day", "legendary",
    `<p>A Great Grade Longsword with a Gaelic design and a clover-shaped pommel. It is a +3 Longsword.</p>
<p>This sword was fed the Human-Human Fruit Model Leprechaun, allowing it to transform into a Leprechaun and a Leprechaun-Sword hybrid. The sword is sentient and counts as a Small Humanoid. It is proficient in Stealth, and its unarmed strikes deal the same damage as its blade.</p>
<p>As a bonus action, the sword can create lucky clovers that can be used to reroll attack rolls, skill checks, and saving throws (like the Lucky feat), limited by Devil Fruit Uses remaining.</p>`,
    true),

  magicWeapon("kopesh", "Kopesh", "legendary",
    `<p>A Supreme Grade scimitar that has become a black blade. It shines as if brand new, yet black as night. The handle and guard are golden and decorated with eye-like patterns.</p>
<p>This is a +3 Scimitar with a +2 bonus to damage rolls, effectively unbreakable, dealing 2d6 slashing instead of 1d6 slashing.</p>`,
    true),

  magicWeapon("wyverns-wrath", "Wyvern's Wrath", "legendary",
    `<p>A Supreme Grade Greatsword with a scale-like pattern across its blade and a green handle with a claw motif.</p>
<p>This is a +3 Greatsword dealing 2d8 slashing instead of 2d6, and is cursed.</p>
<p><strong>Curse:</strong> At the start of each of the wielder's turns, they take 1d8 psychic damage.</p>
<p><strong>Curse Overcome:</strong> The weapon deals an extra 1d8 psychic damage instead.</p>`,
    true),

  magicWeapon("dead-mans-blade", "Dead Man's Blade (Gambler Blade/Defender)", "very rare",
    `<p>This melee weapon was once wielded by Captain Bill of the Wild Pirates. It bestowed bountiful luck in combat, but not without cost.</p>
<p>When you make your first attack using this weapon, you can choose a mastercraft bonus of +1 to +3. This sword gains that bonus to attack and damage rolls. However, for each point of bonus, you take a corresponding penalty (&minus;1 to &minus;3) to your AC until the start of your next turn.</p>
<h4>Curse Overcome</h4>
<p>You gain a +3 bonus to attack and damage rolls. The first time you attack on each of your turns, you can transfer some or all of the sword's bonus to your AC, instead of using the bonus on attacks. The adjusted bonuses remain until the start of your next turn.</p>`,
    true),

  magicWeapon("defiance-of-the-red-world", "Defiance of the Red World", "legendary",
    `<p>An award for defeating Warlord of the Sea, Red World, who used the Smith-Smith Fruit to transform his dying body into a sniper rifle.</p>
<h4>Dormant</h4>
<ul><li>Rifle dealing 2d8 piercing + 1d6 necrotic damage</li>
<li>+1 to attack and damage rolls</li>
<li>Ignores reload (produces bone bullets)</li></ul>
<h4>Wakened</h4>
<ul><li>2d10 piercing + 1d8 necrotic damage</li>
<li>+2 to attack and damage rolls</li>
<li>Bonus action: mark a creature for 1 hour (concentration). The marked creature has disadvantage on ability checks and saving throws of a chosen ability score. Uses equal proficiency bonus, recharging on long rest.</li></ul>
<h4>Exalted</h4>
<ul><li>2d12 piercing + 1d10 necrotic damage</li>
<li>+3 to attack and damage rolls</li>
<li>Cannot be disarmed; extends/retracts from the user's body</li>
<li>The wielder regains hit points equal to the necrotic damage dealt</li></ul>`,
    true),

  // ═══════════════════════════════════
  // SEASTONE ITEMS
  // ═══════════════════════════════════
  magicWeapon("seastone-weapon-tipped", "Seastone Weapon (Tipped)", "rare",
    `<p>A weapon tipped with seastone, the immensely rare substance that negates Devil Fruit abilities.</p>
<p>This is a +2 weapon. Any creature hit has their devil fruit immunities and resistances ignored.</p>
<p>When the weapon deals damage to a devil fruit user, they must make a CON save (DC 20). On failure, they suffer the knee-deep weakness per Ocean's Scorn. On success, unaffected. The effect is continuous if the weapon is embedded or used in a grapple.</p>
<p>If armament haki is used to reduce damage or grant advantage on the save, the target automatically succeeds.</p>`,
    true),

  magicWeapon("seastone-weapon-full", "Seastone Weapon (Full)", "very rare",
    `<p>A weapon made entirely from seastone.</p>
<p>Functions like a Tipped Seastone weapon, but with a +3 modifier.</p>`,
    true),

  magicEquip("seastone-handcuffs", "Seastone Handcuffs", "very rare",
    `<p>Seastone handcuffs are manacles that cannot take damage or be broken unless the creature has the Color of Armament Master haki ability.</p>
<p>While bound, the creature suffers the waist-deep weakness of Ocean's Scorn, ending when freed. A creature can attempt a CON save (DC 20) at the end of their turns, but only in combat.</p>`,
    "trinket"),

  // ═══════════════════════════════════
  // SPECIAL AMMUNITION
  // ═══════════════════════════════════
  consumableItem("acid-ammo", "Acid Ammo", "uncommon",
    `<p>A single piece of ammunition with an internal chamber filled with acid. This is a +1 ammo that deals an additional 1d12 acid damage on hit.</p>`, "ammo"),

  consumableItem("boxing-ammo", "Boxing Ammo", "uncommon",
    `<p>A single piece of ammunition that knocks back the enemy on contact. This is a +1 ammo, and the target must make a STR save (DC = 8 + Mental Ability Score Modifier + Proficiency). On failure, the creature is knocked prone or knocked back 10 ft.</p>`, "ammo"),

  consumableItem("cold-ammo", "Cold Ammo", "uncommon",
    `<p>A single piece of ammunition that freezes the enemy. This is a +1 ammo dealing an additional 1d6 cold damage. The target must make a CON save (DC = 8 + Mental Ability Mod + Prof). On failure, speed is reduced by 10 ft and disadvantage on ability checks or attack rolls for 1 minute (save each turn).</p>`, "ammo"),

  consumableItem("shock-ammo", "Shock Ammo", "uncommon",
    `<p>A single piece of ammunition that shocks the enemy. This is a +1 ammo dealing an additional 1d6 lightning damage. CON save or be stunned for 1 minute (save each turn).</p>`, "ammo"),

  consumableItem("incendiary-ammo", "Incendiary Ammo", "uncommon",
    `<p>A single piece of ammunition that burns the enemy. This is a +1 ammo dealing an additional 1d6 fire damage. CON save or ignite for 1 minute, taking 1d6 fire at the end of each turn unless an action is used to extinguish.</p>`, "ammo"),

  consumableItem("ensnarement-ammo", "Ensnarement Ammo", "uncommon",
    `<p>A single piece of ammunition that ensnares the target. This is a +1 ammo. STR save or the creature becomes restrained. The creature can use their action to repeat the save each turn.</p>`, "ammo"),

  consumableItem("shrapnel-ammo", "Shrapnel Ammo", "uncommon",
    `<p>A single piece of ammunition that explodes into metal shards. This is a +1 ammo. The target and all creatures within 10 ft must make a DEX save. On failure, 3d6 piercing damage. On success, half damage.</p>`, "ammo"),

  consumableItem("thunder-ammo", "Thunder Ammo", "uncommon",
    `<p>A single piece of ammunition emitting a thunderous shockwave. This is a +1 ammo (damage type becomes thunder). CON save: on failure, additional 2d6 thunder damage and deafened for 1 minute (save each turn). On success, half damage.</p>`, "ammo"),

  consumableItem("tranquilization-ammo", "Tranquilization Ammo", "rare",
    `<p>A single piece of ammunition laced with a tranquilizer. This is a +1 ammo. CON save or the creature falls asleep (as Sleep), awakening on taking damage or if immune to charmed.</p>`, "ammo"),

  consumableItem("invisible-ammo", "Invisible Ammo", "rare",
    `<p>A single piece of invisible ammunition. This is a +1 ammo. Attack rolls made with this are made with advantage, unless the target has another means to see (like blindsight).</p>`, "ammo"),

  consumableItem("torpedo-ammo", "Torpedo Ammo", "uncommon",
    `<p>A single piece of ammunition shaped like a torpedo. This is a +1 ammo that can be used normally when fired underwater.</p>`, "ammo"),

  consumableItem("flash-ammo", "Flash Ammo", "uncommon",
    `<p>A single piece of extremely radioactive, glowing ammunition. This is a +1 ammo dealing an additional 1d6 radiant damage. CON save or be blinded for 1 minute (save each turn).</p>`, "ammo"),

  consumableItem("homing-ammo", "Homing Ammo", "rare",
    `<p>A single piece of ammunition that homes in on the target. This is a +1 ammo. When this ammo misses, it rerolls, and if it misses again, it rerolls a third and final time. Ignores invisibility disadvantage.</p>`, "ammo"),

  // ═══════════════════════════════════
  // CONSUMABLES
  // ═══════════════════════════════════
  consumableItem("adrenaline-injection", "Adrenaline Injection (Potion of Speed)", "very rare",
    `<p>A syringe containing chemicals that place the body into a state of heightened speed.</p>
<p>When you use this injection, you gain the effect of the Haste creation for 1 minute (no concentration required).</p>`, "potion"),

  consumableItem("medkit-common", "Small Medkit", "common",
    `<p>A very useful tool for combat and treating wounds. When you use a medkit, the target regains 2d4 + 2 hit points.</p>`, "potion"),

  consumableItem("medkit-uncommon", "Medkit (Uncommon)", "uncommon",
    `<p>A higher-quality medkit. When used, the target regains 4d4 + 4 hit points.</p>`, "potion"),

  consumableItem("medkit-rare", "Medkit (Rare)", "rare",
    `<p>A superior medkit. When used, the target regains 8d4 + 8 hit points.</p>`, "potion"),

  consumableItem("medkit-very-rare", "Medkit (Very Rare)", "very rare",
    `<p>The finest medkit available. When used, the target regains 10d4 + 20 hit points.</p>`, "potion"),

  // ─── Drugs ───
  consumableItem("energy-steroids", "Energy Steroids", "rare",
    `<p>Energy Steroids are a special drug that multiplies the consumer's strength, doubling it. However, it also destroys your youth after the effects.</p>
<ul>
<li>All physical ability scores increase by 2 for 10 minutes. Taking multiple resets the duration and increases by another 2, to a maximum of 30.</li>
<li>Once the duration wears off, the user gains 5 levels of exhaustion and has their natural life reduced by 2^(number of steroids taken) years.</li>
</ul>`, "potion"),

  // ─── Smiles ───
  consumableItem("smile-fruit", "SMILE Fruit", "rare",
    `<p>Smiles are artificial Devil Fruits with a 10% chance of granting a slight, permanent zoan transformation.</p>
<p>Roll 1d10. On a 10, you gain Ocean's Scorn and the abilities listed below. Any other number, you get Ocean's Scorn and are permanently smiling.</p>
<ul>
<li><strong>Natural Weapon:</strong> A permanent +2 natural weapon based on a random animal</li>
<li><strong>Enhanced Speed:</strong> Speed enhancement from the animal (e.g., owl wings grant 30 ft fly)</li>
<li><strong>Extra Head:</strong> Some manifest an actual sapient animal head with its own action</li>
<li><strong>Ability Score Increase:</strong> Increases an ability score by 2</li>
</ul>`, "potion"),

  // ─── Attack Cuisine ───
  consumableItem("sea-pork-offal", "Sea Pork Offal", "common",
    `<p>A pork offal rich in protein and growth hormones. When consumed, restores 2d4 + Chef's Tools Modifier + Proficiency hit points. Costs 350,000 Berries to make. Requires Cook's Utensils proficiency.</p>`, "potion"),

  consumableItem("charcoal-burner-coffee", "Charcoal Burner Coffee", "uncommon",
    `<p>A silky smooth drink of coffee. For 1 hour after drinking, you gain 10 + Chef's Tools Modifier + Proficiency temporary hit points. For the same duration, you are under the effect of the Bless creation (no concentration). Costs 500,000 Berries.</p>`, "potion"),

  consumableItem("silver-tongue-sarsaparilla", "Silver Tongue Sarsaparilla", "uncommon",
    `<p>A gleaming alcoholic drink. For 1 hour after drinking, you gain a bonus to Charisma-based skills equal to the Chef's Tools Modifier. Costs 800,000 Berries.</p>`, "potion"),

  consumableItem("mighty-bull-roast", "Mighty Bull Roast", "rare",
    `<p>A roast filled with powerful proteins and hormones. When consumed, your Strength score is replaced for 1 hour based on potency:</p>
<table>
<tr><th>Potency</th><th>STR Score</th><th>Cost</th><th>Min Level</th></tr>
<tr><td>Common</td><td>21</td><td>100 GP</td><td>3rd</td></tr>
<tr><td>Uncommon</td><td>23</td><td>500 GP</td><td>3rd</td></tr>
<tr><td>Potent</td><td>25</td><td>5,000 GP</td><td>6th</td></tr>
<tr><td>Very Potent</td><td>27</td><td>50,000 GP</td><td>11th</td></tr>
<tr><td>Legendary</td><td>29</td><td>500,000 GP</td><td>17th</td></tr>
</table>`, "potion"),

  consumableItem("king-crab-casserole", "King Crab Casserole", "very rare",
    `<p>A dish chock full of nutrients derived from the heavily armored king crab. After eating, the consumer gains resistance to bludgeoning, piercing and slashing damage for 1 hour. Costs 10,000,000 Berries.</p>`, "potion"),

  // ═══════════════════════════════════
  // DIALS AND DIAL EQUIPMENT
  // ═══════════════════════════════════
  magicEquip("axe-dial", "Axe Dial", "uncommon",
    `<p>Launches an X-shaped blade of wind when activated. Counts as a one-handed, simple ranged weapon (30/120 ft). Deals 2d6 + Dexterity slashing damage.</p>`, "trinket"),

  magicEquip("ball-dial", "Ball Dial", "uncommon",
    `<p>Produces ball clouds&mdash;sturdy spheres (5 ft radius) that can be walked on and last 1 hour in sky island atmosphere. They are hollow and can store things like traps.</p>`, "trinket"),

  magicEquip("breath-dial", "Breath Dial", "common",
    `<p>Stores gases and wind. Cast the Wind Blast trick using WIS, INT, or CHA. Can be used to propel ships and sky vehicles.</p>`, "trinket"),

  magicEquip("flame-dial", "Flame Dial", "uncommon",
    `<p>Unleashes fire. Cast the Fire Bolt trick using WIS, INT, or CHA.</p>`, "trinket"),

  magicEquip("flash-dial", "Flash Dial", "uncommon",
    `<p>Stores and releases light as a flash. Cast Blindness/Deafness (Blindness only) using WIS, INT, or CHA. Has 3 charges, regaining them at the end of a long rest.</p>`, "trinket"),

  magicEquip("flavor-dial", "Flavor Dial", "common",
    `<p>Flavor food, store smells, and store gases. Cast the Prestidigitation trick using WIS, INT, or CHA.</p>`, "trinket"),

  magicEquip("heat-dial", "Heat Dial", "uncommon",
    `<p>Produces pure heat energy. If attached to a weapon, it deals fire damage instead of normal and becomes a +1 mastercraft weapon (doesn't stack with existing +1).</p>`, "trinket"),

  magicEquip("impact-dial", "Impact Dial", "rare",
    `<p>As a reaction to being hit by a weapon attack (bludgeoning, piercing, or slashing), absorb the impact taking no damage. Can store 1 attack at a time.</p>
<p>As an action, release the impact as an unarmed strike dealing the absorbed damage as force. However, you take half that damage. Can take 3 hits before losing uses (repair with a DC 16 dial kit check during a long rest). On a 1 when using last charge, destroyed.</p>`, "trinket"),

  magicEquip("reject-dial", "Reject Dial", "very rare",
    `<p>Functions like an Impact Dial, but released damage is doubled and the user gains 2 levels of exhaustion per use. Repair DC 22. Same destruction rules apply.</p>`, "trinket"),

  magicEquip("jet-dial", "Jet Dial", "rare",
    `<p>Nearly extinct. A more powerful Breath Dial. Cast Gust of Wind using WIS, INT, or CHA. Has 3 charges, regaining them at long rest. Can be placed on weapons making them +1 and raising damage dice by 1.</p>`, "trinket"),

  magicEquip("lamp-dial", "Lamp Dial", "common",
    `<p>Steadily produces light like a lamp. Use the Light trick.</p>`, "trinket"),

  magicEquip("milky-dial", "Milky Dial", "uncommon",
    `<p>Creates sea clouds. As an action, create a 10 ft &times; 10 ft &times; 10 ft area of sea clouds that can be used for skating with dial vehicles.</p>`, "trinket"),

  magicEquip("eisen-dial", "Eisen Dial", "rare",
    `<p>Produces iron clouds, hard as iron but limited to forming walls. Cast Wall of Stone using WIS, INT, or CHA. Has 3 uses, regaining them after a long rest.</p>`, "trinket"),

  magicEquip("tone-dial", "Tone Dial", "common",
    `<p>Records and stores up to 1 hour of sound. Activate or stop as a free action.</p>`, "trinket"),

  magicEquip("vision-dial", "Vision Dial", "common",
    `<p>Stores light&mdash;the sky island equivalent of cameras. Records up to 300 images. Can be modified for video and paired with a Tone Dial for audio. Activate as a free action.</p>`, "trinket"),

  magicEquip("water-dial", "Water Dial", "uncommon",
    `<p>Stores water. Cast Create/Destroy Water using WIS, INT, or CHA. Has 3 uses, regaining them after a long rest.</p>`, "trinket"),

  magicEquip("thunder-dial", "Thunder Dial", "rare",
    `<p>Produces and stores electricity. Cast Shocking Grasp using WIS, INT, or CHA.</p>`, "trinket"),

  // ─── Dial Weapons ───
  magicWeapon("burn-bazooka", "Burn Bazooka", "rare",
    `<p>A special weapon utilizing flame dials to create a flamethrower and portable swivel gun.</p>
<p>Can be used as a swivel gun, or as an action, use the Elemental Blast creation (fire only) using WIS, INT, or CHA. Has 3 uses, regaining them at long rest.</p>`),

  magicWeapon("burn-blade", "Burn Blade", "rare",
    `<p>A blade of fire created using flame and breath dials. Cast the Ardent Blade creation (fire damage) using WIS, INT, or CHA. Has 3 uses, regaining them at long rest.</p>`),

  magicWeapon("eisen-whip", "Eisen Whip", "very rare",
    `<p>A rare and powerful weapon enabling a wide variety of weapon shapes and defensive capabilities.</p>
<p>As a bonus action, change shape to any melee weapon. It is a +1 weapon with a 60 ft range that can travel around corners. Cast the Shield creation using WIS, INT, or CHA (3 uses, recharging on long rest).</p>`,
    true),

  magicWeapon("flash-gun", "Flash Gun", "uncommon",
    `<p>Fires a bright flash from a flash dial while also firing a gun.</p>
<p>This +1 gun fires its first bullet each turn with advantage against an enemy that sees the flash. Enemies with non-visual sight are unaffected.</p>`),

  magicWeapon("heat-javelin", "Heat Javelin", "uncommon",
    `<p>A javelin enhanced with a heat dial.</p>
<p>This weapon is a +1 lance. As a bonus action, heat it up to deal an extra 2d6 fire damage (toggle off as bonus action).</p>`),

  consumableItem("milky-arrows", "Milky Arrows", "uncommon",
    `<p>Arrows with embedded milky dials. When fired, they create a 5 ft wide path of sea clouds equal to the weapon's range. The clouds can be sailed on and last 1 hour (less outside sky island atmosphere).</p>`, "ammo"),

  // ═══════════════════════════════════
  // MISCELLANEOUS SPECIAL ITEMS
  // ═══════════════════════════════════
  lootItem("vivre-card", "Vivre Card", "uncommon",
    `<p>A piece of paper made from a clipping of a person's fingernail. Completely waterproof and fireproof but can be torn.</p>
<p>The torn pieces point to and move towards each other no matter where they are in the world, allowing one to always tell the direction of the other person. It does not indicate distance or obstacles.</p>
<p>The life force of the owner is reflected on the paper. If weakening, the card begins to burn away. It vanishes if they die.</p>`),

  lootItem("wapometal-item", "Wapometal", "rare",
    `<p>Wapometal is a shape-retaining metal made using the Munch-Munch Fruit. Any object or weapon made from it cannot be permanently destroyed unless annihilated. At the start of each day, it repairs itself to its former glory.</p>`),

  lootItem("black-blade-template", "Black Blade", "very rare",
    `<p>Black Blades are weapons wielded by some of the greatest swordsmen, infused with years of potent armament haki. They are virtually indestructible. Black Blades deal an extra +2 damage by default. While made with haki, they are not haki-imbued and do not bypass resistances and immunities.</p>`),

  lootItem("white-weapon-template", "White Weapon (Non-Canon)", "very rare",
    `<p>White Weapons utilize the investment of high-level observation haki. They glow faintly white and naturally follow the will of the wielder, striking at the best angles possible.</p>
<p>White Weapons permanently have a +2 bonus to attack rolls.</p>`),

  lootItem("special-book", "Special Book (Non-Canon)", "very rare",
    `<p>Created using the awakened powers of the Book-Book Fruit. Holds the knowledge of others within books that can be absorbed once read. Can store proficiency and expertise in skills, weapons, armor, tools, languages, feats, and additional abilities.</p>
<p>Once a book is read by one creature, it loses its ability and turns to dust.</p>`),

  lootItem("devil-fruit-object", "Devil Fruit Object", "legendary",
    `<p>By some miracle of science, someone discovered the ability to feed objects zoan-type devil fruits. The object gains the ability scores of the animal, intelligence, and autonomy. It can use its bonus action to transform. As objects, they do not need to breathe, but still get weakened by seastone and water.</p>`),

  lootItem("cursed-weapon-template", "Cursed Weapon (Template)", "rare",
    `<p>All weapons that are expertly crafted house their own "personality." Most swordsmen that wield these weapons have the impression that they are cursed, as they are not skilled enough to fit the strong personality. In D&amp;D terms, they provide an initial debuff, but if overcome through repeated usage, that debuff becomes an ability of the sword.</p>`),

  lootItem("ranked-weapon-template", "Ranked Weapon (Template)", "rare",
    `<p>Ranked Weapons are among the rarest and most powerful blades ever forged, separated into 4 distinct ranks:</p>
<ul>
<li><strong>Grade:</strong> +1 to attack and damage rolls</li>
<li><strong>Skillful Grade:</strong> +2 to attack and damage rolls (may have extra benefits or curses)</li>
<li><strong>Great Grade:</strong> +3 to attack and damage rolls</li>
<li><strong>Supreme Grade:</strong> +3 to attack and damage rolls, with an additional ability; most black blades fall here</li>
</ul>`),

  // ─── Crafting Materials ───
  lootItem("crafting-materials-guide", "Crafting Materials Guide", "common",
    `<p>Crafting special items requires materials. The cost varies by rarity:</p>
<table>
<tr><th>Rarity</th><th>Berry Cost</th></tr>
<tr><td>Common</td><td>1 Million Berries</td></tr>
<tr><td>Uncommon</td><td>5 Million Berries</td></tr>
<tr><td>Rare</td><td>50 Million Berries</td></tr>
<tr><td>Very Rare</td><td>500 Million Berries</td></tr>
<tr><td>Legendary</td><td>5 Billion Berries</td></tr>
</table>
<p>Some items may substitute valuable materials in place of Berry cost. Certain roles and classes can halve crafting time and cost.</p>`),

  // ─── Scrolls ───
  lootItem("scrolls-guide", "Scrolls (Creation Scrolls)", "common",
    `<p>Scrolls take the form of gadgets created by characters that can use creativity and cast creations. For gadgeteers, they may be seen as single-charge gadgets, or medicine brewed by a medic.</p>`),
];

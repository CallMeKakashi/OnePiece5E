// Foundry VTT v13 icon assignment for OP5e compendium items.
// Maps items to built-in Foundry icons based on type, name keywords, and context.

const BAG = "icons/svg/item-bag.svg";

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick(name: string, pool: readonly string[]): string {
  return pool[nameHash(name) % pool.length];
}

function has(name: string, ...kws: string[]): boolean {
  return kws.some(k => name.includes(k));
}

// ─── Icon palette ────────────────────────────────────────────────

const MELEE = [
  "icons/skills/melee/hand-grip-sword-red.webp",
  "icons/skills/melee/blade-tip-orange.webp",
  "icons/skills/melee/strike-blade-blood-red.webp",
  "icons/skills/melee/strike-sword-gray.webp",
  "icons/skills/melee/swords-parry-block-yellow.webp",
  "icons/skills/melee/strike-slashes-orange.webp",
  "icons/skills/melee/strike-hammer-destructive-orange.webp",
  "icons/skills/melee/blood-slash-foam-red.webp",
] as const;

const UNARMED = [
  "icons/skills/melee/unarmed-punch-fist.webp",
  "icons/skills/melee/unarmed-punch-fist-yellow-red.webp",
  "icons/skills/melee/strike-hammer-destructive-orange.webp",
  "icons/skills/melee/blood-slash-foam-red.webp",
] as const;

const RANGED = [
  "icons/skills/ranged/arrow-strike-glowing-teal.webp",
  "icons/skills/ranged/target-bullseye-arrow-blue.webp",
  "icons/skills/ranged/arrows-flying-salvo-blue.webp",
  "icons/skills/ranged/arrows-flying-triple-gray.webp",
] as const;

const SOCIAL = [
  "icons/skills/social/diplomacy-handshake-yellow.webp",
  "icons/skills/social/wave-halt-stop.webp",
  "icons/skills/social/trading-justice-scale-gold.webp",
] as const;

const STEALTH = [
  "icons/skills/social/theft-pickpocket-bribery-brown.webp",
  "icons/weapons/daggers/dagger-glowing-white.webp",
  "icons/weapons/daggers/dagger-curved-blue.webp",
  "icons/magic/perception/eye-ringed-glow-angry-red.webp",
] as const;

const FIRE = [
  "icons/magic/fire/projectile-meteor-salvo-heavy-red.webp",
  "icons/magic/fire/beam-jet-stream-trails-orange.webp",
  "icons/magic/fire/flame-burning-creature-skeleton.webp",
  "icons/magic/fire/barrier-wall-flame-ring-yellow.webp",
  "icons/magic/fire/explosion-fireball-large-orange.webp",
  "icons/magic/fire/projectile-fireball-orange.webp",
] as const;

const LIGHTNING = [
  "icons/magic/lightning/bolt-blue.webp",
  "icons/magic/lightning/bolt-strike-blue.webp",
  "icons/magic/lightning/bolt-forked-blue.webp",
] as const;

const HOLY = [
  "icons/magic/holy/chalice-glowing-gold.webp",
  "icons/magic/holy/barrier-shield-winged-cross.webp",
  "icons/magic/light/explosion-star-glow-yellow.webp",
  "icons/magic/holy/projectiles-blades-salvo-yellow.webp",
] as const;

const HEAL = [
  "icons/magic/life/heart-cross-green.webp",
  "icons/magic/holy/chalice-glowing-gold.webp",
  "icons/magic/light/explosion-star-glow-yellow.webp",
  "icons/consumables/potions/bottle-round-corked-red.webp",
] as const;

const DEFENSIVE = [
  "icons/magic/defensive/shield-barrier-glowing-blue.webp",
  "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
  "icons/magic/holy/barrier-shield-winged-cross.webp",
  "icons/equipment/shield/heater-steel-grey.webp",
] as const;

const CONTROL = [
  "icons/magic/control/debuff-chains-ropes-blue.webp",
  "icons/magic/control/silhouette-hold-change-blue.webp",
] as const;

const NATURE = [
  "icons/magic/nature/root-vines-grow-brown.webp",
  "icons/magic/nature/leaf-glow-green.webp",
  "icons/magic/nature/plant-sproutdirt-green.webp",
] as const;

const WIND = [
  "icons/magic/air/wind-tornado-funnel-green.webp",
] as const;

const WATER = [
  "icons/magic/water/wave-water-blue.webp",
  "icons/magic/water/projectile-ice-faceted-blue.webp",
  "icons/magic/water/ice-crystal-white.webp",
  "icons/magic/water/barrier-ice-crystal-wall-faceted-blue.webp",
] as const;

const UNHOLY = [
  "icons/magic/unholy/hand-fire-skeleton-pink.webp",
  "icons/magic/unholy/orb-smoking-green.webp",
  "icons/magic/unholy/beam-ringed-impact-purple.webp",
  "icons/magic/unholy/strike-body-life-soul-purple.webp",
  "icons/magic/fire/projectile-smoke-swirl-red.webp",
] as const;

const PERCEPTION = [
  "icons/magic/perception/eye-ringed-glow-angry-red.webp",
  "icons/magic/perception/third-eye-blue-red.webp",
  "icons/magic/perception/orb-crystal-ball-scrying.webp",
] as const;

const SYMBOLS = [
  "icons/magic/symbols/star-rising-purple.webp",
  "icons/magic/symbols/runes-star-blue.webp",
  "icons/magic/symbols/question-stone-yellow.webp",
  "icons/magic/symbols/runes-star-pentagon-blue.webp",
] as const;

const TIME = [
  "icons/magic/time/clock-stopwatch-white-blue.webp",
  "icons/magic/time/arrows-circling-green.webp",
] as const;

const MUSIC = [
  "icons/skills/trades/music-notes-sound-blue.webp",
] as const;

const TOOLS = [
  "icons/tools/smithing/anvil.webp",
  "icons/skills/trades/construction-mason-bricklayer-red.webp",
] as const;

const BOOKS = [
  "icons/sundries/books/book-tooled-gold-brown.webp",
  "icons/sundries/documents/document-sealed-brown-red.webp",
] as const;

// ─── Class-themed icon pools ─────────────────────────────────────

const CLASS_POOLS: Record<string, readonly string[]> = {
  fighter: [
    "icons/skills/melee/hand-grip-sword-red.webp",
    "icons/skills/melee/blade-tip-orange.webp",
    "icons/skills/melee/strike-blade-blood-red.webp",
    "icons/skills/melee/strike-sword-gray.webp",
    "icons/skills/melee/swords-parry-block-yellow.webp",
    "icons/skills/melee/strike-slashes-orange.webp",
    "icons/weapons/swords/sword-guard.webp",
    "icons/weapons/swords/greatsword-blue.webp",
  ],
  brawler: [
    "icons/skills/melee/unarmed-punch-fist.webp",
    "icons/skills/melee/unarmed-punch-fist-yellow-red.webp",
    "icons/skills/melee/strike-hammer-destructive-orange.webp",
    "icons/skills/melee/blood-slash-foam-red.webp",
    "icons/skills/melee/swords-parry-block-yellow.webp",
    "icons/magic/control/silhouette-hold-change-blue.webp",
  ],
  marksman: [
    "icons/skills/ranged/arrow-strike-glowing-teal.webp",
    "icons/skills/ranged/target-bullseye-arrow-blue.webp",
    "icons/skills/ranged/arrows-flying-salvo-blue.webp",
    "icons/skills/ranged/arrows-flying-triple-gray.webp",
    "icons/weapons/guns/gun-pistol-flintlock.webp",
    "icons/magic/perception/eye-ringed-glow-angry-red.webp",
  ],
  medic: [
    "icons/magic/life/heart-cross-green.webp",
    "icons/magic/holy/chalice-glowing-gold.webp",
    "icons/magic/light/explosion-star-glow-yellow.webp",
    "icons/consumables/potions/bottle-round-corked-red.webp",
    "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp",
    "icons/magic/holy/barrier-shield-winged-cross.webp",
  ],
  rogue: [
    "icons/weapons/daggers/dagger-glowing-white.webp",
    "icons/weapons/daggers/dagger-curved-blue.webp",
    "icons/skills/social/theft-pickpocket-bribery-brown.webp",
    "icons/magic/perception/eye-ringed-glow-angry-red.webp",
    "icons/skills/melee/blade-tip-orange.webp",
    "icons/skills/melee/strike-blade-blood-red.webp",
  ],
  bard: [
    "icons/skills/trades/music-notes-sound-blue.webp",
    "icons/skills/social/diplomacy-handshake-yellow.webp",
    "icons/skills/social/wave-halt-stop.webp",
    "icons/magic/control/silhouette-hold-change-blue.webp",
    "icons/magic/symbols/star-rising-purple.webp",
    "icons/magic/light/explosion-star-glow-yellow.webp",
  ],
  barbarian: [
    "icons/skills/melee/blood-slash-foam-red.webp",
    "icons/skills/melee/strike-hammer-destructive-orange.webp",
    "icons/skills/melee/strike-slashes-orange.webp",
    "icons/skills/melee/unarmed-punch-fist-yellow-red.webp",
    "icons/magic/fire/flame-burning-creature-skeleton.webp",
    "icons/skills/melee/hand-grip-sword-red.webp",
  ],
  gadgeteer: [
    "icons/tools/smithing/anvil.webp",
    "icons/skills/trades/construction-mason-bricklayer-red.webp",
    "icons/magic/symbols/runes-star-blue.webp",
    "icons/magic/lightning/bolt-blue.webp",
    "icons/magic/fire/explosion-fireball-large-orange.webp",
    "icons/magic/defensive/shield-barrier-glowing-blue.webp",
  ],
  savant: [
    "icons/magic/holy/projectiles-blades-salvo-yellow.webp",
    "icons/magic/holy/barrier-shield-winged-cross.webp",
    "icons/magic/light/explosion-star-glow-yellow.webp",
    "icons/magic/symbols/star-rising-purple.webp",
    "icons/magic/holy/chalice-glowing-gold.webp",
    "icons/skills/melee/swords-parry-block-yellow.webp",
  ],
};

// ─── Race-themed icon pools ──────────────────────────────────────

const RACE_POOLS: Record<string, readonly string[]> = {
  human: [
    "icons/skills/social/diplomacy-handshake-yellow.webp",
    "icons/skills/melee/swords-parry-block-yellow.webp",
    "icons/magic/light/explosion-star-glow-yellow.webp",
    "icons/skills/social/wave-halt-stop.webp",
  ],
  fishman: [
    "icons/magic/water/wave-water-blue.webp",
    "icons/magic/water/projectile-ice-faceted-blue.webp",
    "icons/creatures/fish/fish-marlin-swordfight-blue.webp",
    "icons/magic/water/barrier-ice-crystal-wall-faceted-blue.webp",
  ],
  mink: [
    "icons/creatures/mammals/wolf-howl-moon-gray.webp",
    "icons/magic/lightning/bolt-blue.webp",
    "icons/magic/lightning/bolt-strike-blue.webp",
    "icons/skills/melee/unarmed-punch-fist-yellow-red.webp",
  ],
  giant: [
    "icons/skills/melee/strike-hammer-destructive-orange.webp",
    "icons/skills/melee/blood-slash-foam-red.webp",
    "icons/skills/melee/unarmed-punch-fist.webp",
    "icons/equipment/chest/breastplate-banded-steel-grey.webp",
  ],
  "sky islander": [
    "icons/magic/air/wind-tornado-funnel-green.webp",
    "icons/magic/light/explosion-star-glow-yellow.webp",
    "icons/skills/ranged/arrow-strike-glowing-teal.webp",
    "icons/magic/symbols/star-rising-purple.webp",
  ],
  dwarf: [
    "icons/skills/trades/construction-mason-bricklayer-red.webp",
    "icons/tools/smithing/anvil.webp",
    "icons/weapons/hammers/hammer-war-spiked.webp",
    "icons/equipment/chest/breastplate-banded-steel-grey.webp",
  ],
  merfolk: [
    "icons/magic/water/wave-water-blue.webp",
    "icons/magic/water/ice-crystal-white.webp",
    "icons/magic/water/projectile-ice-faceted-blue.webp",
    "icons/creatures/fish/fish-marlin-swordfight-blue.webp",
  ],
  lunarian: [
    "icons/magic/fire/flame-burning-creature-skeleton.webp",
    "icons/magic/fire/projectile-meteor-salvo-heavy-red.webp",
    "icons/magic/holy/projectiles-blades-salvo-yellow.webp",
    "icons/magic/fire/barrier-wall-flame-ring-yellow.webp",
  ],
  augmented: [
    "icons/tools/smithing/anvil.webp",
    "icons/skills/trades/construction-mason-bricklayer-red.webp",
    "icons/magic/lightning/bolt-blue.webp",
    "icons/equipment/chest/breastplate-banded-steel-grey.webp",
  ],
};

// ─── Keyword matching ────────────────────────────────────────────
// Priority ordered: first match wins. Use specific keywords before broad ones.

interface KWRule { kw: string[]; icon: string | readonly string[] }

const KEYWORD_RULES: KWRule[] = [
  // Weapon-specific
  { kw: ["greatsword", "great sword"], icon: "icons/weapons/swords/greatsword-blue.webp" },
  { kw: ["longsword", "broadsword", "claymore"], icon: "icons/weapons/swords/sword-guard.webp" },
  { kw: ["rapier", "scimitar", "cutlass", "saber", "sabre"], icon: "icons/weapons/swords/scimitar-guard-gold.webp" },
  { kw: ["dagger", "stiletto", "knife", "shiv", "dirk"], icon: "icons/weapons/daggers/dagger-glowing-white.webp" },
  { kw: ["axe", "hatchet", "tomahawk"], icon: "icons/weapons/axes/axe-broad-grey.webp" },
  { kw: ["hammer", "mace", "maul", "flail", "morningstar", "warhammer"], icon: "icons/weapons/hammers/hammer-war-spiked.webp" },
  { kw: ["spear", "javelin", "trident", "pike", "lance", "halberd", "glaive", "naginata"], icon: "icons/weapons/polearms/spear-flared-blue.webp" },
  { kw: ["bow", "longbow", "shortbow"], icon: "icons/weapons/bows/shortbow-recurve-yellow.webp" },
  { kw: ["crossbow"], icon: "icons/weapons/bows/shortbow-recurve-yellow.webp" },
  { kw: ["gun", "pistol", "rifle", "musket", "flintlock", "firearm", "cannon", "revolver", "blunderbuss"], icon: "icons/weapons/guns/gun-pistol-flintlock.webp" },
  { kw: ["staff", "quarterstaff", "bo staff"], icon: "icons/skills/melee/hand-grip-staff-yellow-brown.webp" },
  { kw: ["club", "baton", "tonfa"], icon: "icons/skills/melee/strike-hammer-destructive-orange.webp" },
  { kw: ["whip", "chain"], icon: "icons/magic/control/debuff-chains-ropes-blue.webp" },
  { kw: ["net", "rope", "lasso"], icon: "icons/magic/control/debuff-chains-ropes-blue.webp" },

  // Combat actions
  { kw: ["critical", "crit"], icon: "icons/skills/melee/blood-slash-foam-red.webp" },
  { kw: ["extra attack", "multiattack"], icon: "icons/skills/melee/strike-slashes-orange.webp" },
  { kw: ["action surge"], icon: "icons/magic/time/arrows-circling-green.webp" },
  { kw: ["fighting style"], icon: "icons/skills/melee/swords-parry-block-yellow.webp" },
  { kw: ["second wind"], icon: "icons/magic/life/heart-cross-green.webp" },
  { kw: ["indomitable", "invulnerable", "invincible"], icon: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp" },
  { kw: ["sneak attack", "devious strike", "duplicitous strike"], icon: "icons/weapons/daggers/dagger-curved-blue.webp" },
  { kw: ["cunning action", "cunning"], icon: "icons/skills/social/theft-pickpocket-bribery-brown.webp" },
  { kw: ["uncanny dodge", "dodge"], icon: "icons/skills/melee/swords-parry-block-yellow.webp" },
  { kw: ["evasion", "evade", "evasive"], icon: "icons/skills/melee/swords-parry-block-yellow.webp" },
  { kw: ["rage", "raging", "frenzy", "fury"], icon: "icons/skills/melee/blood-slash-foam-red.webp" },
  { kw: ["reckless"], icon: "icons/skills/melee/strike-slashes-orange.webp" },
  { kw: ["brutal critical"], icon: "icons/skills/melee/blood-slash-foam-red.webp" },
  { kw: ["smite", "ardent smite"], icon: "icons/magic/holy/projectiles-blades-salvo-yellow.webp" },
  { kw: ["stun", "stunning"], icon: "icons/magic/control/silhouette-hold-change-blue.webp" },
  { kw: ["deflect", "parry", "riposte"], icon: "icons/skills/melee/swords-parry-block-yellow.webp" },

  // Elements and magic keywords
  { kw: ["fire", "flame", "burn", "blaze", "inferno", "ember", "scorch", "ignite", "incinerate", "conflagration", "pyro", "magma", "lava", "volcano"], icon: FIRE },
  { kw: ["lightning", "thunder", "bolt", "shock", "storm", "electric", "electro", "static", "tempest", "fulminat"], icon: LIGHTNING },
  { kw: ["ice", "frost", "freeze", "cold", "blizzard", "glacier", "chill", "frigid", "winter", "cryo"], icon: WATER },
  { kw: ["water", "wave", "tide", "ocean", "sea", "aqua", "rain", "flood", "torrent", "deluge", "drown", "swim", "hydro"], icon: WATER },
  { kw: ["acid", "corrosive", "dissolve", "caustic", "melt"], icon: "icons/magic/unholy/orb-smoking-green.webp" },
  { kw: ["poison", "venom", "toxic", "plague", "disease", "infect", "pathogen", "blight", "pestilen"], icon: "icons/magic/unholy/orb-smoking-green.webp" },
  { kw: ["necrotic", "necro", "death", "undead", "wither", "decay", "rot", "corpse", "soul steal", "life drain"], icon: UNHOLY },
  { kw: ["radiant", "divine", "celestial", "sacred"], icon: HOLY },
  { kw: ["psychic", "mental", "mind", "psionic", "telepat", "thought"], icon: PERCEPTION },
  { kw: ["force", "arcane force", "kinetic"], icon: "icons/magic/symbols/runes-star-pentagon-blue.webp" },
  { kw: ["wind", "gust", "tornado", "hurricane", "cyclone", "breeze", "air", "aerial"], icon: WIND },
  { kw: ["earth", "stone", "rock", "boulder", "quake", "seismic", "geo"], icon: "icons/skills/trades/construction-mason-bricklayer-red.webp" },
  { kw: ["nature", "plant", "vine", "tree", "thorn", "root", "flora", "botanical", "verdant"], icon: NATURE },
  { kw: ["shadow", "dark", "darkness", "night", "shade", "gloom", "umbra", "void"], icon: "icons/magic/unholy/beam-ringed-impact-purple.webp" },
  { kw: ["light", "glow", "shine", "bright", "lumino", "radiance", "illuminat"], icon: "icons/magic/light/explosion-star-glow-yellow.webp" },

  // Healing and support
  { kw: ["heal", "healing", "cure", "restore", "revive", "resurrect", "mend", "bandage", "first aid", "remedy", "medicine", "medical", "overheal"], icon: HEAL },
  { kw: ["potion", "elixir", "tonic", "serum", "concoction", "brew", "tincture"], icon: "icons/consumables/potions/bottle-round-corked-red.webp" },
  { kw: ["experiment", "formula", "chemical", "chemist", "alchemy", "alchemist", "concoct"], icon: "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp" },

  // Defense
  { kw: ["shield", "barrier", "ward", "protect", "guard", "fortif", "bulwark", "aegis", "bastion"], icon: DEFENSIVE },
  { kw: ["armor", "armored", "armour", "fortif", "resistance", "resilient"], icon: "icons/equipment/chest/breastplate-banded-steel-grey.webp" },
  { kw: ["unarmored defense"], icon: "icons/skills/melee/swords-parry-block-yellow.webp" },

  // Mobility/movement
  { kw: ["speed", "fast", "swift", "haste", "dash", "sprint", "quick", "fleet", "agile", "acrobat", "nimble"], icon: "icons/magic/time/arrows-circling-green.webp" },
  { kw: ["teleport", "blink", "misty step", "dimension"], icon: "icons/magic/symbols/runes-star-pentagon-blue.webp" },
  { kw: ["fly", "flight", "levitat", "hover", "wing", "soar", "glide"], icon: "icons/magic/air/wind-tornado-funnel-green.webp" },
  { kw: ["climb", "spider climb"], icon: "icons/magic/nature/root-vines-grow-brown.webp" },

  // Stealth and perception
  { kw: ["stealth", "sneak", "hide", "invisible", "vanish", "conceal", "camouflage", "skulk"], icon: STEALTH },
  { kw: ["eye", "sight", "vision", "see", "perceiv", "percept", "observ", "watch", "gaze", "blindsense", "blindsight"], icon: PERCEPTION },
  { kw: ["insight", "intuition", "sense", "detect", "discern"], icon: "icons/magic/perception/orb-crystal-ball-scrying.webp" },

  // Social
  { kw: ["inspire", "inspiration", "rally", "command", "leader", "morale", "courage", "brave", "valor"], icon: "icons/skills/social/diplomacy-handshake-yellow.webp" },
  { kw: ["charm", "enchant", "fascinate", "bewitch", "enthrall", "captivat", "mesmer"], icon: "icons/magic/control/silhouette-hold-change-blue.webp" },
  { kw: ["intimidat", "frighten", "fear", "terrif", "menac", "dread"], icon: "icons/magic/perception/eye-ringed-glow-angry-red.webp" },
  { kw: ["persuad", "diplomac", "negotiat", "bargain", "silver tongue"], icon: "icons/skills/social/diplomacy-handshake-yellow.webp" },
  { kw: ["deceiv", "deception", "trick", "bluff", "lie", "disguise", "illusory"], icon: "icons/skills/social/theft-pickpocket-bribery-brown.webp" },

  // Music/performance
  { kw: ["song", "music", "melody", "harmony", "bardic", "perform", "sing", "tune", "rhythm", "chord", "voice"], icon: MUSIC },

  // Knowledge and crafting
  { kw: ["book", "lore", "knowledge", "scholar", "study", "learn", "librar", "tome", "read", "writ"], icon: BOOKS },
  { kw: ["craft", "build", "create", "forge", "smith", "tinker", "engineer", "construct", "invent", "fabricat", "gadget", "device", "machine", "mech", "mastercraft"], icon: TOOLS },
  { kw: ["rune", "sigil", "glyph", "symbol", "seal", "inscri"], icon: "icons/magic/symbols/runes-star-blue.webp" },

  // Haki (One Piece specific)
  { kw: ["haki", "observation haki", "armament haki", "conqueror"], icon: "icons/magic/symbols/star-rising-purple.webp" },

  // Six Powers / Rokushiki
  { kw: ["six powers", "rokushiki", "soru", "tekkai", "geppo", "shigan", "rankyaku", "kami-e", "rokuogan"], icon: "icons/skills/melee/unarmed-punch-fist.webp" },

  // Fishman/water combat
  { kw: ["fishman karate", "fish-man", "fishman", "merman combat"], icon: "icons/magic/water/wave-water-blue.webp" },

  // Beast/animal
  { kw: ["beast", "animal", "creature", "summon", "companion", "tame", "wild", "feral", "primal", "spirit animal", "totem"], icon: "icons/creatures/mammals/wolf-howl-moon-gray.webp" },

  // Time
  { kw: ["time", "temporal", "chronos", "age", "timeless"], icon: TIME },

  // Expertise / proficiency
  { kw: ["expertise", "proficien", "master", "adept", "expert"], icon: "icons/magic/symbols/question-stone-yellow.webp" },
  { kw: ["reliable talent", "talent"], icon: "icons/magic/symbols/star-rising-purple.webp" },

  // Aura
  { kw: ["aura", "presence", "emanat"], icon: "icons/magic/holy/barrier-shield-winged-cross.webp" },

  // Survival
  { kw: ["survival", "endur", "tough", "durable", "stamina", "hardy", "persist", "relentless"], icon: "icons/skills/melee/strike-hammer-destructive-orange.webp" },

  // Luck
  { kw: ["luck", "fortune", "fate", "chance"], icon: "icons/skills/social/trading-justice-scale-gold.webp" },

  // Surgery/amputation
  { kw: ["surgeo", "surgery", "amputat", "scalpel", "dissect", "incision", "operation"], icon: "icons/weapons/daggers/dagger-curved-blue.webp" },

  // Explosion/destruction
  { kw: ["explo", "detonate", "blast", "bomb", "demolit", "destruct", "shatter"], icon: "icons/magic/fire/explosion-fireball-large-orange.webp" },
];

function matchKeyword(name: string): string | null {
  for (const rule of KEYWORD_RULES) {
    if (has(name, ...rule.kw)) {
      if (typeof rule.icon === "string") return rule.icon;
      return pick(name, rule.icon);
    }
  }
  return null;
}

// ─── Spell / Creation icon resolver ──────────────────────────────

const SCHOOL_ICONS: Record<string, readonly string[]> = {
  evo: FIRE,
  abj: DEFENSIVE,
  con: NATURE,
  div: PERCEPTION,
  enc: CONTROL,
  ill: [...PERCEPTION, ...STEALTH],
  nec: UNHOLY,
  tra: [...NATURE, ...SYMBOLS],
};

const DMG_TYPE_ICONS: Record<string, readonly string[]> = {
  fire: FIRE,
  lightning: LIGHTNING,
  thunder: LIGHTNING,
  cold: WATER,
  acid: ["icons/magic/unholy/orb-smoking-green.webp", "icons/magic/nature/leaf-glow-green.webp"],
  poison: ["icons/magic/unholy/orb-smoking-green.webp", "icons/magic/fire/projectile-smoke-swirl-red.webp"],
  necrotic: UNHOLY,
  radiant: HOLY,
  psychic: PERCEPTION,
  force: SYMBOLS,
  bludgeoning: UNARMED,
  piercing: ["icons/skills/ranged/arrows-flying-triple-gray.webp", "icons/weapons/daggers/dagger-glowing-white.webp"],
  slashing: MELEE,
  healing: HEAL,
};

function getSpellIcon(item: any): string {
  const name = (item.name as string).toLowerCase();

  const kw = matchKeyword(name);
  if (kw) return kw;

  const sys = item.system ?? {};
  const parts: any[] = sys.damage?.parts ?? [];
  if (parts.length > 0) {
    const dmgType = (parts[0][1] ?? "").toLowerCase();
    const pool = DMG_TYPE_ICONS[dmgType];
    if (pool) return pick(name, pool);
  }

  const school = (sys.school ?? "").toLowerCase();
  const pool = SCHOOL_ICONS[school];
  if (pool) return pick(name, pool);

  return pick(name, [...SYMBOLS, ...FIRE, ...NATURE]);
}

// ─── Weapon icon resolver ────────────────────────────────────────

function getWeaponIcon(item: any): string {
  const name = (item.name as string).toLowerCase();

  const kw = matchKeyword(name);
  if (kw) return kw;

  const cat = item.system?.type?.value ?? "";
  if (cat.endsWith("R")) {
    if (has(name, "gun", "pistol", "rifle", "musket", "flintlock", "cannon", "blunderbuss", "revolver")) {
      return pick(name, ["icons/weapons/guns/gun-pistol-flintlock.webp"]);
    }
    return pick(name, RANGED);
  }

  const parts: any[] = item.system?.damage?.parts ?? [];
  if (parts.length > 0) {
    const dmgType = (parts[0][1] ?? "").toLowerCase();
    if (dmgType === "bludgeoning") return pick(name, ["icons/weapons/hammers/hammer-war-spiked.webp", "icons/skills/melee/strike-hammer-destructive-orange.webp"]);
    if (dmgType === "piercing") return pick(name, ["icons/weapons/daggers/dagger-glowing-white.webp", "icons/weapons/polearms/spear-flared-blue.webp"]);
    if (dmgType === "slashing") return pick(name, ["icons/weapons/swords/sword-guard.webp", "icons/weapons/axes/axe-broad-grey.webp"]);
  }

  return pick(name, MELEE);
}

// ─── Equipment icon resolver ────────────────────────────────────

function getEquipmentIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  const subtype = item.system?.type?.value ?? "";

  if (subtype === "shield") return "icons/equipment/shield/heater-steel-grey.webp";
  if (subtype === "heavy") return pick(name, ["icons/equipment/chest/breastplate-banded-steel-grey.webp", "icons/equipment/head/helm-barbute-steel-grey.webp"]);
  if (subtype === "medium") return pick(name, ["icons/equipment/chest/breastplate-banded-steel-grey.webp"]);
  if (subtype === "light") return pick(name, ["icons/equipment/chest/breastplate-banded-steel-grey.webp", "icons/equipment/feet/boots-leather-brown.webp"]);

  if (has(name, "ring", "amulet", "necklace", "pendant", "bracelet", "charm", "talisman")) return pick(name, SYMBOLS);
  if (has(name, "cloak", "cape", "mantle", "robe")) return pick(name, [...DEFENSIVE, ...SYMBOLS]);
  if (has(name, "glove", "gauntlet", "bracer")) return "icons/equipment/hand/glove-tooled-leather-brown.webp";
  if (has(name, "boot", "shoe", "sandal", "greave")) return "icons/equipment/feet/boots-leather-brown.webp";
  if (has(name, "helm", "helmet", "crown", "hat", "headband", "circlet")) return "icons/equipment/head/helm-barbute-steel-grey.webp";
  if (has(name, "belt", "sash", "girdle")) return "icons/equipment/chest/breastplate-banded-steel-grey.webp";

  const kw = matchKeyword(name);
  if (kw) return kw;

  return pick(name, [...SYMBOLS, "icons/equipment/chest/breastplate-banded-steel-grey.webp"]);
}

// ─── Feature icon resolver (class features, subclass features) ──

function extractClassName(requirements: string): string {
  const req = requirements.toLowerCase();
  for (const cls of Object.keys(CLASS_POOLS)) {
    if (req.includes(cls)) return cls;
  }
  return "";
}

function extractRaceName(requirements: string): string {
  const req = requirements.toLowerCase();
  for (const race of Object.keys(RACE_POOLS)) {
    if (req.includes(race)) return race;
  }
  return "";
}

function getFeatureIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  const sys = item.system ?? {};
  const featureType = sys.type?.value ?? "";
  const req = sys.requirements ?? "";

  const kw = matchKeyword(name);
  if (kw) return kw;

  if (featureType === "class") {
    const cls = extractClassName(req);
    const pool = CLASS_POOLS[cls];
    if (pool) return pick(name, pool);
    return pick(name, MELEE);
  }

  if (featureType === "race") {
    const race = extractRaceName(req);
    const pool = RACE_POOLS[race];
    if (pool) return pick(name, pool);
    return pick(name, [...SOCIAL, ...SYMBOLS]);
  }

  return pick(name, [...MELEE, ...SOCIAL, ...SYMBOLS]);
}

// ─── Background icon resolver ───────────────────────────────────

const BG_ICONS: Record<string, string> = {
  acrobat: "icons/skills/melee/swords-parry-block-yellow.webp",
  archaeologist: "icons/sundries/documents/document-sealed-brown-red.webp",
  artist: "icons/skills/social/trading-justice-scale-gold.webp",
  author: "icons/sundries/books/book-tooled-gold-brown.webp",
  blacksmith: "icons/tools/smithing/anvil.webp",
  "bounty hunter": "icons/skills/ranged/target-bullseye-arrow-blue.webp",
  boxer: "icons/skills/melee/unarmed-punch-fist.webp",
  carpenter: "icons/skills/trades/construction-mason-bricklayer-red.webp",
  cook: "icons/consumables/potions/bottle-round-corked-red.webp",
  detective: "icons/magic/perception/orb-crystal-ball-scrying.webp",
  doctor: "icons/magic/life/heart-cross-green.webp",
  drunkard: "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp",
  entertainer: "icons/skills/trades/music-notes-sound-blue.webp",
  faceless: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
  farmer: "icons/magic/nature/leaf-glow-green.webp",
  fisherman: "icons/creatures/fish/fish-marlin-swordfight-blue.webp",
  "folk hero": "icons/skills/social/diplomacy-handshake-yellow.webp",
  gambler: "icons/skills/social/trading-justice-scale-gold.webp",
  gladiator: "icons/skills/melee/blood-slash-foam-red.webp",
  glutton: "icons/consumables/potions/bottle-round-corked-red.webp",
  hermit: "icons/magic/nature/plant-sproutdirt-green.webp",
  jeweler: "icons/magic/symbols/runes-star-blue.webp",
  knight: "icons/equipment/shield/heater-steel-grey.webp",
  leatherworker: "icons/equipment/chest/breastplate-banded-steel-grey.webp",
  librarian: "icons/sundries/books/book-tooled-gold-brown.webp",
  lumberjack: "icons/weapons/axes/axe-broad-grey.webp",
  "marine/soldier": "icons/equipment/shield/heater-steel-grey.webp",
  "marine": "icons/equipment/shield/heater-steel-grey.webp",
  soldier: "icons/equipment/shield/heater-steel-grey.webp",
  mason: "icons/skills/trades/construction-mason-bricklayer-red.webp",
  mercenary: "icons/skills/melee/hand-grip-sword-red.webp",
  merchant: "icons/skills/social/trading-justice-scale-gold.webp",
  miner: "icons/weapons/hammers/hammer-war-spiked.webp",
  navigator: "icons/sundries/documents/document-sealed-brown-red.webp",
  noble: "icons/skills/social/diplomacy-handshake-yellow.webp",
  pirate: "icons/weapons/swords/scimitar-guard-gold.webp",
  priest: "icons/magic/holy/chalice-glowing-gold.webp",
  revolutionary: "icons/magic/fire/flame-burning-creature-skeleton.webp",
  sailor: "icons/magic/water/wave-water-blue.webp",
  scientist: "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp",
  shipwright: "icons/skills/trades/construction-mason-bricklayer-red.webp",
  slave: "icons/magic/control/debuff-chains-ropes-blue.webp",
  smuggler: "icons/skills/social/theft-pickpocket-bribery-brown.webp",
  sniper: "icons/skills/ranged/target-bullseye-arrow-blue.webp",
  swordsman: "icons/weapons/swords/sword-guard.webp",
  tailor: "icons/equipment/chest/breastplate-banded-steel-grey.webp",
  urchin: "icons/skills/social/theft-pickpocket-bribery-brown.webp",
  wanderer: "icons/magic/air/wind-tornado-funnel-green.webp",
};

function getBackgroundIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  return BG_ICONS[name] ?? pick(name, [...SOCIAL, ...MELEE, ...BOOKS]);
}

// ─── Subclass icon resolver ─────────────────────────────────────

function getSubclassIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  const classId = (item.system?.classIdentifier ?? "").toLowerCase();

  const kw = matchKeyword(name);
  if (kw) return kw;

  const pool = CLASS_POOLS[classId];
  if (pool) return pick(name, pool);

  return pick(name, [...MELEE, ...SYMBOLS]);
}

// ─── Tool icon resolver ─────────────────────────────────────────

function getToolIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  if (has(name, "music", "drum", "flute", "lute", "horn", "fiddle", "pan pipe", "lyre", "viol", "bagpipe", "shawm")) return "icons/skills/trades/music-notes-sound-blue.webp";
  if (has(name, "game", "chess", "dice", "card", "playing")) return "icons/skills/social/trading-justice-scale-gold.webp";
  if (has(name, "navigator", "cartograph")) return "icons/sundries/documents/document-sealed-brown-red.webp";
  if (has(name, "herb", "poison")) return "icons/magic/nature/leaf-glow-green.webp";
  if (has(name, "cook", "brewer")) return "icons/consumables/potions/bottle-round-corked-red.webp";
  if (has(name, "calligraph", "forgery")) return "icons/sundries/books/book-tooled-gold-brown.webp";
  if (has(name, "disguise")) return "icons/magic/perception/eye-ringed-glow-angry-red.webp";
  if (has(name, "thiev")) return "icons/skills/social/theft-pickpocket-bribery-brown.webp";
  return pick(name, TOOLS);
}

// ─── Consumable / Gear icon resolver ─────────────────────────────

function getConsumableIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  const subtype = item.system?.type?.value ?? "";

  if (subtype === "ammo") {
    if (has(name, "bullet", "round", "shot", "cartridge")) return "icons/weapons/guns/gun-pistol-flintlock.webp";
    if (has(name, "arrow")) return "icons/skills/ranged/arrows-flying-triple-gray.webp";
    if (has(name, "bolt")) return "icons/skills/ranged/arrows-flying-triple-gray.webp";
    return "icons/skills/ranged/arrows-flying-triple-gray.webp";
  }

  if (subtype === "potion" || has(name, "potion", "elixir", "tonic")) return pick(name, ["icons/consumables/potions/bottle-round-corked-red.webp", "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp"]);

  if (has(name, "scroll")) return "icons/sundries/documents/document-sealed-brown-red.webp";
  if (has(name, "bomb", "grenade", "explosive")) return "icons/magic/fire/explosion-fireball-large-orange.webp";
  if (has(name, "medkit", "bandage", "heal")) return "icons/magic/life/heart-cross-green.webp";
  if (has(name, "food", "ration", "meal")) return "icons/consumables/potions/bottle-round-corked-red.webp";

  const kw = matchKeyword(name);
  if (kw) return kw;

  return pick(name, ["icons/consumables/potions/bottle-round-corked-red.webp", "icons/consumables/potions/potion-bottle-corked-fancy-blue.webp"]);
}

function getLootIcon(item: any): string {
  const name = (item.name as string).toLowerCase();

  if (has(name, "rope", "chain")) return "icons/magic/control/debuff-chains-ropes-blue.webp";
  if (has(name, "book", "tome", "journal", "manual")) return "icons/sundries/books/book-tooled-gold-brown.webp";
  if (has(name, "map", "chart", "compass", "spyglass", "telescope", "lantern", "lamp", "torch")) return "icons/sundries/documents/document-sealed-brown-red.webp";
  if (has(name, "gem", "jewel", "diamond", "ruby", "sapphire", "emerald")) return "icons/magic/symbols/runes-star-blue.webp";
  if (has(name, "tent", "bedroll", "blanket", "camp")) return "icons/magic/nature/plant-sproutdirt-green.webp";
  if (has(name, "lock", "key", "manacle", "shackle")) return "icons/skills/social/theft-pickpocket-bribery-brown.webp";
  if (has(name, "mirror", "glass", "lens")) return "icons/magic/perception/orb-crystal-ball-scrying.webp";

  const kw = matchKeyword(name);
  if (kw) return kw;

  return pick(name, ["icons/sundries/documents/document-sealed-brown-red.webp", "icons/sundries/books/book-tooled-gold-brown.webp", "icons/skills/social/trading-justice-scale-gold.webp"]);
}

// ─── Race icon resolver ─────────────────────────────────────────

const RACE_ICONS: Record<string, string> = {
  human: "icons/skills/social/diplomacy-handshake-yellow.webp",
  fishman: "icons/creatures/fish/fish-marlin-swordfight-blue.webp",
  "fish-man": "icons/creatures/fish/fish-marlin-swordfight-blue.webp",
  mink: "icons/creatures/mammals/wolf-howl-moon-gray.webp",
  giant: "icons/skills/melee/strike-hammer-destructive-orange.webp",
  "sky islander": "icons/magic/air/wind-tornado-funnel-green.webp",
  skypiean: "icons/magic/air/wind-tornado-funnel-green.webp",
  dwarf: "icons/tools/smithing/anvil.webp",
  dwarves: "icons/tools/smithing/anvil.webp",
  merfolk: "icons/magic/water/wave-water-blue.webp",
  lunarian: "icons/magic/fire/projectile-meteor-salvo-heavy-red.webp",
  augmented: "icons/skills/trades/construction-mason-bricklayer-red.webp",
};

function getRaceIcon(item: any): string {
  const name = (item.name as string).toLowerCase();
  return RACE_ICONS[name] ?? pick(name, [...SOCIAL, ...SYMBOLS]);
}

// ─── Main entry point ───────────────────────────────────────────

export function assignIcon(item: any): void {
  if (!item || typeof item !== "object") return;
  if (item.img && item.img !== BAG) return;

  const type = item.type ?? "";

  switch (type) {
    case "spell":
      item.img = getSpellIcon(item);
      break;
    case "weapon":
      item.img = getWeaponIcon(item);
      break;
    case "equipment":
      item.img = getEquipmentIcon(item);
      break;
    case "tool":
      item.img = getToolIcon(item);
      break;
    case "consumable":
      item.img = getConsumableIcon(item);
      break;
    case "loot":
      item.img = getLootIcon(item);
      break;
    case "feat":
      item.img = getFeatureIcon(item);
      break;
    case "subclass":
      item.img = getSubclassIcon(item);
      break;
    case "class":
      item.img = pick(item.name ?? "", MELEE);
      break;
    case "race":
      item.img = getRaceIcon(item);
      break;
    case "background":
      item.img = getBackgroundIcon(item);
      break;
    default:
      item.img = pick(item.name ?? "", [...MELEE, ...SYMBOLS, ...SOCIAL]);
      break;
  }
}

export function assignIcons<T>(items: T[]): T[] {
  for (const item of items) assignIcon(item);
  return items;
}

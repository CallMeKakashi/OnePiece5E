/** Phase 1 = combat sheet wiring (grants, scales, uses, attacks). Phase 2 = DAE passives. */

export type IssuePhase = "phase1" | "phase2" | "narrative" | "caster-progression";

export const CASTER_CLASS_IDS = new Set(["gadgeteer", "medic", "savant"]);

/** Purely narrative, proficiency, social, or choice-only — no Phase 1 wiring expected. */
export const NARRATIVE_FEATURE_NAMES = new Set([
  "Thieves' Cant",
  "Primal Knowledge",
  "Bonus Proficiencies",
  "Expertise",
  "Musical Secrets",
  "Additional Musical Secrets",
  "Six Powers Adept",
  "Mutant Metamorphosis",
  "Perfected Fighting Styles",
  "Periodic Proficiency",
  "The Right Tool",
  "Tool Expertise",
  "Animal Spirit",
  "Timeless Body",
  "Tranquility",
  "Purity of the Body",
  "Peerless Understanding",
  "Brutal Critical",
  "Reckless Attack",
  "Mindless Rage",
  "Persistent Rage",
  "Relentless Rage",
  "Indomitable Might",
  "Font of Inspiration",
  "Font of Vitality",
  "Limitless Inspiration",
  "Countercharm Improvement",
  "Phase Two",
  "Mutant Method",
  "Test Subject",
  "Alchemical Savant",
  "Mastercraft Novice",
  "Mastercraft Adept",
  "Mastercraft Savant",
  "Mastercraft Master",
  "Sniper Creations",
  "Killer's Toolkit",
  "Combat Expert",
  "Physical Superiority",
  "Combat Master",
  "Quick On The Draw",
  "Eagle Eyes",
  "Deadly Mark",
  "Killshot",
  "Volley",
  "Crackshot",
  "Opportunist",
  "Cutthroat Tactics",
  "Invulnerable",
  "Enhanced Forms",
  "Greater Enhancements",
  "Improved Ardent Smite",
  "Ardent Smite",
  "Fiery Soul",
  "Aura of Courage",
  "Aura of Devotion",
  "Aura of Protection",
  "Aura Improvements",
  "Reckless Severity",
  "Overheal",
  "Miracle Worker",
  "Medical Expertise",
  "Secrets of Medicine",
  "Extended Release",
  "Mods",
  "Creativity",
  "Creativity (Spellcasting)",
  "Tinkering",
  "Endless Spirit",
  "Contained Rampage",
  "Palm Strikes",
]);

/** Passive mechanics requiring DAE — Phase 2 backlog. */
export const PHASE2_PASSIVE_NAMES = new Set([
  "Unarmored Defense",
  "Unarmored Movement",
  "Unarmored Movement Improvement",
  "Fast Movement",
  "Jack of All Trades",
  "Feral Instinct",
  "Combat Medicine", // modifies Experimental Medicine + natural armor DAE
  "Perfected Subject",
]);

/** Phase 2b: wired or explicitly deferred with documented reason. */
export const PHASE2B_STATUS: Record<
  string,
  { status: "wired" | "partial" | "deferred"; wiring?: string; reason?: string }
> = {
  "Diamond Soul": {
    status: "partial",
    wiring: "DAE addBonus on con/int/wis/cha save proficiency (str/dex from class L1)",
    reason: "Spirit-point save reroll on failure needs custom module — no stock DAE",
  },
  "Danger Sense": {
    status: "partial",
    wiring:
      "Reaction activation for rage redirect; chatFlavor documents conditional Dex-save advantage",
    reason: "Conditional Dex-save advantage vs visible effects — no stock DAE; apply manually",
  },
  "Combat Medicine": {
    status: "partial",
    wiring:
      "Natural armor DAE; bonus-action heal/temphp on Combat Medicine item (4×level + WIS); shares EM use pool",
    reason: "Enhancement swap + shared use sync with base EM item need custom module",
  },
  "Brutal Critical": {
    status: "wired",
    wiring: "chatFlavor references @scale.barbarian.brutal-critical (roll-time; informational on sheet)",
  },
  "Extra Attack": {
    status: "wired",
    wiring: "Fighter chatFlavor references @scale.fighter.extra-attack (Attack action rule; informational)",
  },
  Expertise: {
    status: "wired",
    wiring: "Trait advancement mode: expertise on rogue/bard class",
  },
  "Unarmored Movement Improvement": {
    status: "deferred",
    reason: "Vertical-surface movement — no clean DAE; narrative only",
  },
  "Perfected Subject": {
    status: "deferred",
    reason: "Test Subject companion autonomy — requires companion actor module",
  },
  "Quick On The Draw": {
    status: "wired",
    wiring: "flags.dnd5e.initiativeAdv DAE",
  },
};
export const INFORMATIONAL_SCALES = new Set(["haki-tier"]);

/** ItemChoice / style pick features — granted but chosen at level-up, not button-wired. */
export const ITEM_CHOICE_NAMES = new Set([
  "Fighting Style",
  "Signature Fighting Style",
]);

/** Attack-action rule text, not an activatable feature. */
export const EXTRA_ATTACK_NAMES = new Set(["Extra Attack"]);

/** Activation keywords in description refer to sub-options, not the parent grant. */
export const SUB_ABILITY_ACTIVATION_NAMES = new Set([
  "Fighting Style",
  "Brawling",
  "Spirit",
  "Danger Sense",
  "Customized Creativity",
  "Experimental Augmentations",
  "Test Subject",
  "Perfected Subject",
  "Chemical Cocktail",
  "Creative Arsenal",
  "Channel Conviction: Burning Passion",
  "Channel Conviction: Caustic Spite",
  "Channel Conviction: Cold Indifference",
  "Channel Conviction: Fulminating Glee",
  "Channel Conviction: Radiant Superiority",
  "Channel Conviction: Thundering Resolve",
]);

/** Caster class features where Phase 1 only requires progression/scales, not per-mod automation. */
export const CASTER_PROGRESSION_NAMES = new Set([
  "Mods",
  "Creativity",
  "Creativity (Spellcasting)",
  "Medical Expertise",
  "Experimental Medicine",
  "Secrets of Medicine",
  "Mastercraft Novice",
  "Mastercraft Adept",
  "Mastercraft Savant",
  "Mastercraft Master",
  "Tinkering",
  "The Right Tool",
  "Tool Expertise",
  "Flash of Genius",
  "Creation Storage",
  "High-Tech Development",
  "Soul of Artifice",
  "Alchemical Savant",
  "Extended Release",
  "Overheal",
  "Miracle Worker",
  "Rapid Remedy",
  "Periodic Proficiency",
  "Ardent Smite",
  "Improved Ardent Smite",
  "Aura Improvements",
  "Aura of Courage",
  "Aura of Devotion",
  "Aura of Protection",
  "Fiery Soul",
  "Chemical Cocktail",
  "Restorative Agents",
  "Chemical Mastery",
  "Experimental Augmentations",
  "Phase Two",
  "Mutant Method",
  "Test Subject",
  "Perfected Subject",
]);

export function classifyFeaturePhase(
  featureName: string,
  classIdentifier: string,
): IssuePhase | null {
  if (NARRATIVE_FEATURE_NAMES.has(featureName)) return "narrative";
  if (PHASE2_PASSIVE_NAMES.has(featureName)) return "phase2";
  if (ITEM_CHOICE_NAMES.has(featureName)) return "narrative";
  if (EXTRA_ATTACK_NAMES.has(featureName)) return "narrative";
  if (SUB_ABILITY_ACTIVATION_NAMES.has(featureName)) return "narrative";
  if (featureName.startsWith("Channel Conviction:")) return "narrative";
  if (CASTER_CLASS_IDS.has(classIdentifier) && CASTER_PROGRESSION_NAMES.has(featureName)) {
    return "caster-progression";
  }
  return null;
}

/** Description mentions Attack action as a rule modifier, not feature activation. */
export function mentionsAttackActionRule(desc: string): boolean {
  return /\bAttack action\b/i.test(desc) && /\b(take the|whenever you take|when you take)\b/i.test(desc);
}

/** Description mentions limited uses in attack-count or pool context, not uses.max. */
export function isFalsePositiveUses(desc: string, featureName: string): boolean {
  if (EXTRA_ATTACK_NAMES.has(featureName)) return true;
  if (featureName === "Endless Spirit") return true;
  if (/\bexpended (?:spirit points?|uses of)\b/i.test(desc) && !/\buse this feature\b/i.test(desc)) {
    return true;
  }
  if (/\bsame number of times\b/i.test(desc)) return true;
  if (/\bnumber of upgrades equal\b/i.test(desc)) return true;
  return false;
}

/** Description mentions reaction/bonus/action for a sub-option in a list, not the feature itself. */
export function isFalsePositiveActivation(desc: string, featureName: string): boolean {
  if (SUB_ABILITY_ACTIVATION_NAMES.has(featureName)) return true;
  if (ITEM_CHOICE_NAMES.has(featureName)) return true;
  if (EXTRA_ATTACK_NAMES.has(featureName)) return true;
  if (mentionsAttackActionRule(desc)) return true;
  if (featureName === "Combat Medicine") return true;
  if (featureName === "Feral Instinct" && /\bbonus action you take to enter your rage\b/i.test(desc)) {
    return true;
  }
  if (featureName === "Unarmored Movement" && /\bbonus action\b/i.test(desc)) return true;
  return false;
}

export function phaseSeverity(phase: IssuePhase): "error" | "warn" | "info" {
  switch (phase) {
    case "phase1":
      return "warn";
    case "phase2":
    case "narrative":
    case "caster-progression":
      return "info";
  }
}

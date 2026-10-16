import type { Spec, EffectSpec } from "../../helpers/spec.js";

// Eight Impacts Fist (Sourcebook ch. 7). Unarmed strikes are melee weapon attacks, so the bonuses ride on mwak.
const ch = (key: string, value: string, mode = 2) => ({ key, mode, value });
const thunder = (name: string, extra: ReturnType<typeof ch>[] = []): EffectSpec => ({
  name, rounds: 1, specialDuration: ["turnEndSource"],
  changes: [ch("system.bonuses.mwak.damage", "+1d8 [thunder]"), ch("flags.midi-qol.advantage.attack.mwak", "1", 5), ...extra],
});
const DC = "8 + @prof + max(@abilities.str.mod, @abilities.dex.mod)";

export const eightImpactsSpecs: Record<string, Spec> = {
  "class-features/First Impacts": {
    activities: [{ name: "Thunder Strike", type: "utility", activation: "special", note: "When you make an unarmed strike you can deal thunder damage instead. The attack has the Siege property: double damage to objects and structures, ignoring an object's damage threshold." }],
  },
  "class-features/Thunderstruck": {
    activities: [{ name: "Thunderstruck", type: "utility", activation: "special", consumeUse: true, effects: [thunder("Thunderstruck (next unarmed strike)")],
      note: "Imbue an unarmed strike with thunder: advantage on the attack and an extra 1d8 thunder damage. Uses: proficiency bonus, regained on a short or long rest." }],
  },
  "class-features/Thunderous Blows": {
    activities: [{ name: "Thunderous Blows", type: "utility", activation: "special", consumeUse: true, effects: [thunder("Thunderous Blows (until the end of your turn)")],
      note: "Use at the start of your turn. All your unarmed strikes this turn have advantage, ignore half and three-quarters cover that is not haki imbued (shields included) and deal an extra 1d8 thunder damage. Replaces Thunderstruck." }],
  },
  "class-features/Deep Impact": {
    activities: [{ name: "Shockwave Spread", type: "save", activation: "special", area: { type: "radius", size: 5 }, targets: { type: "creature" },
      save: { ability: "dex", dc: DC, onSave: "half" },
      note: "Once per turn, when you use First Impacts, give the unarmed strike a 5 ft damage spread. Creatures in the spread take the strike's damage (half on a success) unless they succeed on the save (DC 8 + Strength or Dexterity modifier + proficiency bonus, ability not named in the Sourcebook, Dexterity assumed). You are unaffected." }],
  },
  "class-features/Eighth Impact": {
    activities: [{ name: "Regain Thunderous Blows (short rest)", type: "utility", activation: "special", consumeUse: true, consumeTarget: "thunderous-blows", consumeAmount: "-@prof",
      note: "Thunderous Blows uses now come back on a short or long rest: use this after a short rest to restore them. It spends no use of its own." }],
    extraEffects: [{ name: "Eighth Impact: First Impacts strike (crit on 19-20)", transfer: true, disabled: true, changes: [ch("flags.dnd5e.weaponCriticalThreshold", "19", 4)] }],
  },
};

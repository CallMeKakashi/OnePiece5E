import { describe, it, expect } from "vitest";
import { OP5E_FEATURE_IDS } from "../scripts/feature-ids.mjs";
import {
  buildRageChanges,
  isRageItem,
  actorHasBlockingConditionForDangerSense,
  actorHasDangerSense,
  actorHasDiamondSoul,
  actorHasRelentlessRage,
  actorIsRaging,
  applyDexSaveAdvantage,
  canSpendSpiritPoint,
  droppedToZeroHitPoints,
  getRelentlessRageDcFromActor,
  getSpiritUsesRemaining,
  hasDangerSenseBlockingStatus,
  isExperimentalMedicineItem,
  isExperimentalMedicinePoolItem,
  nextRelentlessRageDc,
  RELENTLESS_RAGE_BASE_DC,
  resolveRelentlessRageDc,
  savingThrowFailed,
  shouldApplyDangerSenseDexAdvantage,
  shouldOfferRelentlessRage,
  shouldRedirectExperimentalMedicineToCombat,
} from "../scripts/feature-hooks-lib.mjs";

function mockActor({ items = [], statuses = [], conditions = [], effects = [] } = {}) {
  return {
    items: items.map(i => ({
      id: i.id ?? i,
      _id: i.id ?? i,
      name: i.name ?? String(i.id ?? i),
      system: i.system ?? {},
    })),
    statuses,
    effects,
    system: { conditions },
  };
}

describe("Danger Sense conditions", () => {
  it("detects blocking statuses", () => {
    expect(hasDangerSenseBlockingStatus(["blinded"])).toBe(true);
    expect(hasDangerSenseBlockingStatus(["poisoned"])).toBe(false);
  });

  it("blocks advantage when actor is incapacitated", () => {
    const actor = mockActor({ statuses: ["incapacitated"], items: [{ id: OP5E_FEATURE_IDS.dangerSense }] });
    expect(actorHasBlockingConditionForDangerSense(actor)).toBe(true);
    expect(shouldApplyDangerSenseDexAdvantage({ subject: actor, ability: "dex" }, "dex")).toBe(false);
  });

  it("applies advantage on dex save for barbarian with Danger Sense", () => {
    const actor = mockActor({ items: [{ id: OP5E_FEATURE_IDS.dangerSense }] });
    expect(actorHasDangerSense(actor)).toBe(true);
    expect(shouldApplyDangerSenseDexAdvantage({ subject: actor, ability: "dex" }, "dex")).toBe(true);
  });

  it("ignores non-dex saves", () => {
    const actor = mockActor({ items: [{ id: OP5E_FEATURE_IDS.dangerSense }] });
    expect(shouldApplyDangerSenseDexAdvantage({ subject: actor, ability: "wis" }, "wis")).toBe(false);
  });
});

describe("applyDexSaveAdvantage", () => {
  it("sets advantage on roll options without overriding disadvantage", () => {
    const config = {
      rolls: [{ options: { disadvantage: true } }, { options: {} }],
    };
    applyDexSaveAdvantage(config);
    expect(config.rolls[0].options.advantage).toBeUndefined();
    expect(config.rolls[1].options.advantage).toBe(true);
  });

  it("creates a roll entry when missing", () => {
    const config = {};
    applyDexSaveAdvantage(config);
    expect(config.rolls[0].options.advantage).toBe(true);
  });
});

describe("Diamond Soul helpers", () => {
  it("detects diamond soul feature on actor", () => {
    const actor = mockActor({ items: [{ id: OP5E_FEATURE_IDS.diamondSoul }] });
    expect(actorHasDiamondSoul(actor)).toBe(true);
  });

  it("detects failed save against DC", () => {
    expect(savingThrowFailed([{ total: 8 }], 12)).toBe(true);
    expect(savingThrowFailed([{ total: 14 }], 12)).toBe(false);
    expect(savingThrowFailed([{ total: 3 }], undefined)).toBe(false);
  });

  it("tracks spirit uses", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.spirit, system: { uses: { value: 2 } } }],
    });
    const spirit = actor.items[0];
    expect(getSpiritUsesRemaining(spirit)).toBe(2);
    expect(canSpendSpiritPoint({ items: [spirit] })).toBe(true);
  });
});

describe("Combat Medicine pool ids", () => {
  it("recognizes paired EM items", () => {
    expect(isExperimentalMedicinePoolItem(OP5E_FEATURE_IDS.combatMedicine)).toBe(true);
    expect(isExperimentalMedicinePoolItem(OP5E_FEATURE_IDS.experimentalMedicine)).toBe(true);
    expect(isExperimentalMedicinePoolItem("other")).toBe(false);
  });

  it("redirects base EM when Combat Medicine is present", () => {
    const actor = mockActor({
      items: [
        { id: OP5E_FEATURE_IDS.experimentalMedicine },
        { id: OP5E_FEATURE_IDS.combatMedicine },
      ],
    });
    expect(isExperimentalMedicineItem(OP5E_FEATURE_IDS.experimentalMedicine)).toBe(true);
    expect(shouldRedirectExperimentalMedicineToCombat(actor)).toBe(true);
  });

  it("does not redirect without Combat Medicine", () => {
    const actor = mockActor({ items: [{ id: OP5E_FEATURE_IDS.experimentalMedicine }] });
    expect(shouldRedirectExperimentalMedicineToCombat(actor)).toBe(false);
  });
});

describe("Rage automation helpers", () => {
  it("recognizes rage item id", () => {
    expect(isRageItem(OP5E_FEATURE_IDS.rage)).toBe(true);
  });

  it("builds rage active effect changes", () => {
    const changes = buildRageChanges();
    expect(changes.some(c => c.value === "bludgeoning")).toBe(true);
    expect(changes.some(c => c.key.includes("advantage.ability.check.str"))).toBe(true);
    expect(changes.some(c => c.value === "@prof")).toBe(true);
  });
});

describe("Relentless Rage helpers", () => {
  it("tracks escalating DC", () => {
    expect(resolveRelentlessRageDc(undefined)).toBe(RELENTLESS_RAGE_BASE_DC);
    expect(nextRelentlessRageDc(10)).toBe(15);
    expect(nextRelentlessRageDc(15)).toBe(20);
  });

  it("reads DC from actor flags", () => {
    const actor = { flags: { op5e: { relentlessRageDc: 20 } } };
    expect(getRelentlessRageDcFromActor(actor)).toBe(20);
  });

  it("detects raging via statuses or effects", () => {
    expect(actorIsRaging(mockActor({ statuses: ["rage"] }))).toBe(true);
    expect(actorIsRaging(mockActor({
      effects: [{ active: true, name: "Rage", origin: `Item.${OP5E_FEATURE_IDS.rage}` }],
    }))).toBe(true);
    expect(actorIsRaging(mockActor({}))).toBe(false);
  });

  it("offers save when raging barbarian drops to 0 HP", () => {
    const actor = mockActor({
      items: [{ id: OP5E_FEATURE_IDS.relentlessRage }],
      statuses: ["rage"],
    });
    expect(actorHasRelentlessRage(actor)).toBe(true);
    expect(droppedToZeroHitPoints(-12, 0)).toBe(true);
    expect(shouldOfferRelentlessRage(actor, -12, 0)).toBe(true);
    expect(shouldOfferRelentlessRage(actor, -5, 3)).toBe(false);
  });
});

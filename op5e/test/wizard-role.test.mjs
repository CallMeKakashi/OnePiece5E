import { describe, it, expect } from "vitest";
import { isBackgroundEntry, isRoleEntry } from "../scripts/wizard/background-role.mjs";

describe("wizard background vs role compendium filters", () => {
  const background = { type: "background", name: "Sailor" };
  const roleFeat = {
    type: "feat",
    name: "Role: Captain",
    flags: { op5e: { shipRole: true } },
  };
  const generalFeat = { type: "feat", name: "Alert" };

  it("treats ship roles as feats, not backgrounds", () => {
    expect(isRoleEntry(roleFeat)).toBe(true);
    expect(isBackgroundEntry(roleFeat)).toBe(false);
  });

  it("treats real backgrounds separately from roles", () => {
    expect(isBackgroundEntry(background)).toBe(true);
    expect(isRoleEntry(background)).toBe(false);
  });

  it("does not classify general feats as ship roles", () => {
    expect(isRoleEntry(generalFeat)).toBe(false);
    expect(isBackgroundEntry(generalFeat)).toBe(false);
  });

  it("supports legacy role entries identified by name prefix", () => {
    const legacyRole = { type: "feat", name: "Role: Navigator" };
    expect(isRoleEntry(legacyRole)).toBe(true);
    expect(isBackgroundEntry(legacyRole)).toBe(false);
  });
});

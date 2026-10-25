import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
// the Burning effect must carry the OverTime line the Sourcebook text calls for: start of turn, 1d6 fire, Con save, ends on a success
const src = readFileSync(new URL("../data/src/automation/creations-1.ts", import.meta.url), "utf8");
test("Blazing Bullet burns through a midi-qol OverTime effect", () => {
  const line = /key: "flags\.midi-qol\.OverTime", mode: 5, value: "([^"]+)"/.exec(src.slice(src.indexOf('"creations/Blazing Bullet"')))?.[1];
  expect(Object.fromEntries(line.split(",").map((p) => p.split("=")))).toMatchObject({ turn: "start", damageRoll: "1d6", damageType: "fire", saveAbility: "con", saveRemove: "true", saveDC: "@attributes.spelldc" });
});

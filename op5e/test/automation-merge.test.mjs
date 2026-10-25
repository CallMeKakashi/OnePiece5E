import { test, expect } from "vitest";
import { AUTOMATION } from "../data/src/automation/index.ts";
// an audit fix that only adds activities must not drop the flat bonus an earlier spec gave the same feat
test.each(["Charger", "Enhanced Circuitry", "Buck-Toothed", "Gliding Skin", "Renegade Rodent"])("%s keeps its effect and its activity", (name) => {
  const s = AUTOMATION[`feats/${name}`];
  expect(s.extraEffects?.length).toBeGreaterThan(0);
  expect(s.activities?.length).toBeGreaterThan(0);
});

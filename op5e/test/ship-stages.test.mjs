import { test, expect } from "vitest";
import { STAGES, POOL } from "../scripts/ship-stages.mjs";
test("every pooled ship-check stage exists and each command points at a real file", async () => {
  const names = STAGES.map(([n]) => n);
  expect([...POOL].filter((n) => !names.includes(n))).toEqual([]);
  const { existsSync } = await import("node:fs");
  for (const [, cmd] of STAGES) for (const f of cmd.match(/(?:scripts|dev\/harness)\/[\w./-]+\.(?:mjs|ts)/g) ?? []) expect(existsSync(new URL(`../${f}`, import.meta.url)), f).toBe(true);
});

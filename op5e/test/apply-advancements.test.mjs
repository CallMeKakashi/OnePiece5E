import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { applyStartingBeri, importItemWithAdvancements } from "../scripts/wizard/apply-advancements.mjs";

describe("apply-advancements (no Foundry runtime)", () => {
  const original = {
    game: globalThis.game,
    dnd5e: globalThis.dnd5e,
    foundry: globalThis.foundry,
  };

  beforeEach(() => {
    globalThis.game = { dnd5e: undefined, packs: new Map() };
    globalThis.dnd5e = undefined;
    globalThis.foundry = {
      utils: {
        deepClone: (x) => structuredClone(x),
        setProperty: (obj, path, value) => {
          const parts = String(path).split(".");
          let cur = obj;
          for (let i = 0; i < parts.length - 1; i++) {
            cur[parts[i]] ??= {};
            cur = cur[parts[i]];
          }
          cur[parts.at(-1)] = value;
        },
      },
    };
  });

  afterEach(() => {
    globalThis.game = original.game;
    globalThis.dnd5e = original.dnd5e;
    globalThis.foundry = original.foundry;
    vi.restoreAllMocks();
  });

  it("applyStartingBeri adds up positive flags.op5e.startingBeri", async () => {
    const actor = {
      system: { currency: { gp: 2 } },
      update: vi.fn(async () => {}),
    };

    await applyStartingBeri(actor, [
      { flags: { op5e: { startingBeri: 10 } } },
      { flags: { op5e: { startingBeri: 0 } } },
      { flags: { op5e: { startingBeri: -5 } } },
      { flags: { op5e: { startingBeri: 7 } } },
    ]);

    expect(actor.update).toHaveBeenCalledTimes(1);
    expect(actor.update).toHaveBeenCalledWith({ "system.currency": { gp: 19 } });
  });

  it("importItemWithAdvancements falls back to createEmbeddedDocuments when AdvancementManager missing", async () => {
    const actor = {
      createEmbeddedDocuments: vi.fn(async () => []),
    };

    const itemData = { name: "Test Class", type: "class", system: {} };
    await importItemWithAdvancements(actor, itemData);

    expect(actor.createEmbeddedDocuments).toHaveBeenCalledWith("Item", [itemData]);
  });
});


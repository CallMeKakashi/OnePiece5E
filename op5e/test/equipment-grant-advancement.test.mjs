import { describe, it, expect } from "vitest";
import {
  applyGrantQuantitiesToItems,
  collectGrantQuantitiesFromManager,
  itemSourceUuid,
  mergeQuantitiesFromItemGrantConfig,
  mergeQuantitiesFromManagerStep,
} from "../scripts/equipment-grant-advancement-lib.mjs";

describe("equipment-grant-advancement-lib", () => {
  const medUuid = "Compendium.op5e.items.abc123";
  const ratUuid = "Compendium.op5e.items.rations";

  it("reads quantity from ItemGrant configuration", () => {
    const quantities = new Map();
    mergeQuantitiesFromItemGrantConfig({
      items: [{ uuid: medUuid, optional: false, quantity: 3 }],
      op5eGrantQuantities: { [medUuid]: 3 },
    }, quantities);
    expect(quantities.get(medUuid)).toBe(3);
  });

  it("collects quantities from manager steps and parent flags", () => {
    const quantities = collectGrantQuantitiesFromManager({
      item: {
        flags: { op5e: { grantQuantities: { [medUuid]: 3 } } },
      },
      steps: [{
        advancement: {
          type: "ItemGrant",
          configuration: {
            items: [{ uuid: ratUuid, quantity: 5 }],
            op5eGrantQuantities: { [ratUuid]: 5 },
          },
        },
      }],
    });
    expect(quantities.get(medUuid)).toBe(3);
    expect(quantities.get(ratUuid)).toBe(5);
  });

  it("collects from dnd5e manager shape (flow + clone only)", () => {
    const quantities = collectGrantQuantitiesFromManager({
      steps: [{
        type: "forward",
        flow: {
          item: {
            getFlag(namespace, key) {
              if (namespace === "op5e" && key === "grantQuantities") {
                return { [medUuid]: 3, [ratUuid]: 5 };
              }
              return undefined;
            },
            toObject() {
              return {
                flags: { op5e: { grantQuantities: { [medUuid]: 3, [ratUuid]: 5 } } },
                system: {
                  advancement: [{
                    type: "ItemGrant",
                    configuration: {
                      op5eGrantQuantities: { [medUuid]: 3, [ratUuid]: 5 },
                    },
                  }],
                },
              };
            },
          },
          advancement: {
            type: "ItemGrant",
            configuration: {
              items: [{ uuid: ratUuid, quantity: 5 }],
              op5eGrantQuantities: { [ratUuid]: 5 },
            },
          },
        },
      }],
      clone: {
        items: [{
          flags: { op5e: { grantQuantities: { [medUuid]: 3, [ratUuid]: 5 } } },
          system: {
            advancement: [{
              type: "ItemGrant",
              title: "starting-equipment",
              configuration: {
                op5eGrantQuantities: { [medUuid]: 3, [ratUuid]: 5 },
              },
            }],
          },
        }],
      },
    });
    expect(quantities.get(medUuid)).toBe(3);
    expect(quantities.get(ratUuid)).toBe(5);
  });

  it("reads grant config from advancement _source when schema strips extras", () => {
    const quantities = new Map();
    mergeQuantitiesFromManagerStep({
      flow: {
        advancement: {
          type: "ItemGrant",
          configuration: { items: [{ uuid: medUuid }] },
          _source: {
            configuration: {
              op5eGrantQuantities: { [medUuid]: 3 },
            },
          },
        },
      },
    }, quantities);
    expect(quantities.get(medUuid)).toBe(3);
  });

  it("sets system.quantity on granted items before create", () => {
    const toCreate = [{
      _id: "item1",
      flags: { dnd5e: { sourceId: medUuid } },
      system: { quantity: 1 },
    }];
    applyGrantQuantitiesToItems(toCreate, new Map([[medUuid, 3]]));
    expect(toCreate[0].system.quantity).toBe(3);
  });

  it("sets system.quantity on toUpdate stacks (deduped grants)", () => {
    const toUpdate = [{
      _id: "existing",
      flags: { dnd5e: { sourceId: ratUuid } },
      system: { quantity: 1 },
    }];
    applyGrantQuantitiesToItems([toUpdate], new Map([[ratUuid, 5]]));
    expect(toUpdate[0].system.quantity).toBe(5);
  });

  it("resolves source uuid from compendium metadata", () => {
    expect(itemSourceUuid({
      _stats: { compendiumSource: medUuid },
    })).toBe(medUuid);
  });
});

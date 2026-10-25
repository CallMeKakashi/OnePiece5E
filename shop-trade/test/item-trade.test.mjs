import { describe, it, expect } from "vitest";
import { tradeBlocker, cleanOffer, cleanPrice, tradeMessage, offerSummary, itemLine } from "../scripts/item-trade-lib.mjs";

const held = new Map([
  ["a", { name: "Flintlock", type: "weapon", quantity: 1 }],
  ["b", { name: "Potion of Healing", type: "consumable", quantity: 3 }],
  ["c", { name: "Backpack", type: "container", quantity: 1, contentsSize: 2 }],
  ["d", { name: "Second Wind", type: "feat", quantity: 1 }],
  ["e", { name: "Empty Chest", type: "container", quantity: 1, contentsSize: 0 }],
]);

describe("tradeBlocker", () => {
  it("allows physical items and empty containers", () => {
    for (const t of ["weapon", "equipment", "consumable", "tool", "loot"]) expect(tradeBlocker({ type: t })).toBe("");
    expect(tradeBlocker({ type: "container", contentsSize: 0 })).toBe("");
  });
  it("refuses features and filled containers", () => {
    expect(tradeBlocker({ type: "feat" })).toMatch(/not an item/);
    expect(tradeBlocker({ type: "spell" })).not.toBe("");
    expect(tradeBlocker({ type: "container", contentsSize: 1 })).toMatch(/Empty the container/);
    expect(tradeBlocker(null)).not.toBe("");
  });
});

describe("cleanOffer", () => {
  it("accepts several items and clamps quantity to what is held", () => {
    const out = cleanOffer([{ itemId: "a", qty: 5 }, { itemId: "b", qty: 2 }, { itemId: "e", qty: 1 }], held);
    expect(out.map((o) => [o.name, o.qty])).toEqual([["Flintlock", 1], ["Potion of Healing", 2], ["Empty Chest", 1]]);
  });
  it("drops duplicates and treats a bad quantity as 1", () => {
    expect(cleanOffer([{ itemId: "b", qty: 0 }, { itemId: "b", qty: 3 }], held)).toEqual([{ itemId: "b", qty: 1, name: "Potion of Healing" }]);
    expect(cleanOffer([{ itemId: "b", qty: "x" }], held)[0].qty).toBe(1);
  });
  it("throws for nothing, a missing item, a feature or a filled container", () => {
    expect(() => cleanOffer([], held)).toThrow(/at least one/);
    expect(() => cleanOffer([{ itemId: "zzz", qty: 1 }], held)).toThrow(/no longer have/);
    expect(() => cleanOffer([{ itemId: "d", qty: 1 }], held)).toThrow(/Second Wind/);
    expect(() => cleanOffer([{ itemId: "c", qty: 1 }], held)).toThrow(/Backpack: Empty the container/);
  });
});

describe("price and messages", () => {
  it("cleans the price to a whole number of at least 0", () => {
    expect([cleanPrice(1500), cleanPrice("250.6"), cleanPrice(-3), cleanPrice(""), cleanPrice("abc"), cleanPrice(0)]).toEqual([1500, 251, 0, 0, 0, 0]);
  });
  it("names what was traded, to whom, and for how much", () => {
    const html = tradeMessage({ from: "Roma", to: "Baptiste", items: [{ name: "Flintlock", qty: 1 }, { name: "Potion of Healing", qty: 2 }], price: 1500, currency: "Berries", fmt: (n) => n.toLocaleString("en-US") });
    expect(html).toContain("<strong>Roma</strong> traded <strong>Flintlock, 2× Potion of Healing</strong> to <strong>Baptiste</strong> for <strong>1,500 Berries</strong>.");
  });
  it("says free for a gift and escapes names", () => {
    const html = tradeMessage({ from: "A<b>", to: "B", items: [{ name: "Rope", qty: 1 }], price: 0, currency: "Berries" });
    expect(html).toContain("for <strong>free</strong>");
    expect(html).toContain("A&lt;b&gt;");
    expect(html).not.toContain("<b>");
  });
  it("summarises an offer for the receiver", () => {
    const s = offerSummary({ from: "Roma", to: "Jack", items: [{ name: "Rope", qty: 2 }], price: 20, currency: "Berries" });
    expect(s.lines).toEqual(["2× Rope"]); expect(s.cost).toBe("for 20 Berries");
    expect(offerSummary({ from: "a", to: "b", items: [], price: 0, currency: "x" }).cost).toBe("for free");
  });
  it("itemLine shows the count only above one", () => { expect(itemLine("Rope", 1)).toBe("Rope"); expect(itemLine("Rope", 4)).toBe("4× Rope"); });
});

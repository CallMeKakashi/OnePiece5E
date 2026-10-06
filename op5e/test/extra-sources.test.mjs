import { describe, it, expect } from "vitest";
import { parseSourceId } from "../scripts/extra-sources-lib.mjs";

describe("extra source ids", () => {
  it("a plain id uses the fallback pack", () => { expect(parseSourceId("abc123", "op5e.feats")).toEqual({ collection: "op5e.feats", id: "abc123" }); });
  it("an id from an extra source carries its pack", () => { expect(parseSourceId("world.ddb-feats|XyZ", "op5e.feats")).toEqual({ collection: "world.ddb-feats", id: "XyZ" }); });
  it("handles empty and missing values", () => { expect(parseSourceId("", "op5e.feats")).toEqual({ collection: "op5e.feats", id: "" }); expect(parseSourceId(undefined, "p")).toEqual({ collection: "p", id: "" }); });
});

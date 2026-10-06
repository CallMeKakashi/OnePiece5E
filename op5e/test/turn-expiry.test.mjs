import { describe, it, expect } from "vitest";
import { turnExpiry } from "../data/helpers/spec.ts";

describe("turn-based effect expiry", () => {
  it("ends at the start of the source's next turn", () => { expect(turnExpiry({ rounds: 1 }, "AC is reduced by 2 until the start of your next turn.")).toEqual(["turnStartSource"]); });
  it("ends at the end of the source's turn", () => { expect(turnExpiry({ rounds: 1 }, "advantage until the end of your turn.")).toEqual(["turnEndSource"]); });
  it("uses the target's own turn when the text says its turn", () => { expect(turnExpiry({ rounds: 1 }, "until the end of its next turn")).toEqual(["turnEnd"]); expect(turnExpiry({ rounds: 1 }, "until the start of its next turn")).toEqual(["turnStart"]); });
  it("leaves longer effects and plain text alone", () => { expect(turnExpiry({ seconds: 3600 }, "until the start of your next turn")).toBeUndefined(); expect(turnExpiry({ rounds: 1 }, "for one minute")).toBeUndefined(); });
});

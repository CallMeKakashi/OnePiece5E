// Keeps parallel test browsers from starving the machine: a headless Foundry browser costs about PER_BROWSER_GB and RESERVE_GB must stay free for everything else.
import { freemem } from "node:os";
export const PER_BROWSER_GB = 2.5, RESERVE_GB = 6;
const freeGb = () => freemem() / 2 ** 30;
/** How many browsers could start right now (at least 1, at most `max`). */
export const shardsFor = (max) => Math.max(1, Math.min(max, Math.floor((freeGb() - RESERVE_GB) / PER_BROWSER_GB)));
/** Resolves once one more browser fits in memory. */
export const waitForRoom = async () => { while (freeGb() - PER_BROWSER_GB < RESERVE_GB) await new Promise((r) => setTimeout(r, 5000)); };

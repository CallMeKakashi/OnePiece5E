// Node driver: joins the *test* world in headless Edge, ensures required modules, runs fn(page, H).
// Refuses to run unless world id is "test". Returns FOUNDRY_UNAVAILABLE if the server is down.
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";
const REQUIRED = ["lib-wrapper", "socketlib", "dae", "op5e"]; // midi-qol/CPR need dnd5e>=5.2, world is 5.1.10
const HARNESS = readFileSync(new URL("./scripts/harness.mjs", import.meta.url), "utf8");

export async function foundryStatus() {
  try { return await (await fetch(`${BASE}/api/status`)).json(); } catch { return null; }
}

/** Whisper a test result to the real Gamemaster(s) so a run is visible in the GM's chat (not just in the terminal log). */
export async function postToGM(page, html) {
  await page.evaluate(async (html) => {
    const gms = game.users.filter((u) => u.isGM && u.name !== "Automation").map((u) => u.id);
    await ChatMessage.create({ speaker: { alias: "OP5e Test Run" }, content: html, whisper: gms.length ? gms : [game.user.id], flags: { op5eTestLog: true } });
  }, html).catch(() => {});
}

export async function withFoundry(fn, { headless = true, extraModules = [] } = {}) {
  const st = await foundryStatus();
  if (!st?.active) { const e = new Error("FOUNDRY_UNAVAILABLE"); e.code = "FOUNDRY_UNAVAILABLE"; throw e; }
  if (st.world !== "test") throw new Error(`refusing: active world is "${st.world}", not "test"`);
  const browser = await chromium.launch({ channel: "msedge", headless });
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
  const logs = []; page.on("console", (m) => m.type() === "error" && logs.push(m.text())); page.on("pageerror", (e) => logs.push(String(e)));
  const join = async () => {
    await page.goto(`${BASE}/join`);
    await page.selectOption("select[name=userid]", { label: "Automation" });
    await page.click("button[name=join]");
    await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 });
  };
  try {
    await join();
    const need = [...REQUIRED, ...extraModules];
    const changed = await page.evaluate(async (need) => {
      const cfg = foundry.utils.deepClone(game.settings.get("core", "moduleConfiguration"));
      let ch = false; for (const id of need) if (game.modules.get(id) && !cfg[id]) { cfg[id] = true; ch = true; }
      if (ch) await game.settings.set("core", "moduleConfiguration", cfg);
      return ch;
    }, need);
    if (changed) { await page.reload(); await join(); }
    await page.evaluate((src) => { if (!game.op5eHarness) { const u = URL.createObjectURL(new Blob([src.replace(/Hooks\.once\("ready".*$/m, "game.op5eHarness = H;")], { type: "text/javascript" })); return import(u); } }, HARNESS);
    return await fn(page, { logs, evaluate: (f, a) => page.evaluate(f, a) });
  } finally { await browser.close(); }
}

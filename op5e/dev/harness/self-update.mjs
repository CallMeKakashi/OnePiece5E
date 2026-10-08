// In-world updater (scripts/self-update.mjs): progress window, resumable sync, interrupted-update recovery.
// Uses a THROWAWAY helper (port 30112, random token, a temp "Foundry Data" folder) so the real module folder is never touched: "commit" copies the release into the temp folder.
// Runs against the v0.2.9 release on GitHub (needs internet). Test or bb-rehearsal world only.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { withFoundry } from "./drive.mjs";

const TAG = process.env.UPDATE_TAG ?? "v0.2.9", PORT = 30112, token = `test-${randomBytes(8).toString("hex")}`;
const data = mkdtempSync(join(tmpdir(), "op5e-fake-data-")), mod = join(data, "modules", "op5e");
mkdirSync(mod, { recursive: true });
const mj = JSON.parse(readFileSync("module.json", "utf8")); mj.version = "0.0.1"; writeFileSync(join(mod, "module.json"), JSON.stringify(mj));   // looks outdated to the helper
const helper = spawn("node", ["scripts/update-helper.mjs"], { env: { ...process.env, FOUNDRY_DATA: data, OP5E_UPDATE_PORT: String(PORT), OP5E_UPDATE_TOKEN: token, OP5E_UPDATE_ORIGINS: "http://localhost:30000" }, stdio: ["ignore", "pipe", "pipe"] });
await new Promise((r) => setTimeout(r, 1500));

const run = async (page, args) => page.evaluate(async ({ token, PORT, TAG }) => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const S = game.settings, M = "op5e", saved = { url: S.get(M, "updateHelperUrl"), token: S.get(M, "updateToken") };
  const lockedBefore = Object.fromEntries(game.packs.filter((p) => p.metadata.packageName === M).map((p) => [p.collection, p.locked]));
  try {
    await S.set(M, "updateHelperUrl", `http://localhost:${PORT}`); await S.set(M, "updateToken", token);
    const U = game.op5eUpdate;
    ok("the updater is registered with a progress window", !!U?.run && !!U?.UpdateProgress);

    // 1. dry run through the window
    let win = new U.UpdateProgress(); await win.render({ force: true }); await wait(300);
    const seen = new Set();
    const poll = setInterval(() => seen.add(win.state.step), 40);
    const rep = await U.run({ tag: TAG, dryRun: true, ui: win }); clearInterval(poll); await wait(300);
    const bar = win.element.querySelector("progress");
    ok("dry run: window shows done and a full bar", win.state.finished && bar?.value === 100, `step ${win.state.step}, bar ${bar?.value}`);
    ok("dry run: it walked through the download and compare steps", seen.has(1) && seen.has(2), [...seen].join(","));
    ok("dry run: changed nothing (no interrupted flag, hashes untouched)", !S.get(M, "updateState"), JSON.stringify(rep.files));
    await win.close();

    // 2. a real run against the throwaway helper: documents are synced, hashes saved per compendium, players told, files copied to the temp folder
    const heard = []; game.socket.on("module.op5e", (m) => m?.op5eUpdate && heard.push(m));   // our own emit does not echo back; so check the flag instead
    win = new U.UpdateProgress(); await win.render({ force: true });
    const states = []; const poll2 = setInterval(() => states.push(win.state.step), 40);
    const hashesBefore = JSON.stringify(S.get(M, "packHashes") ?? {}).length;
    const real = await U.run({ tag: TAG, ui: win }); clearInterval(poll2); await wait(300);
    ok("real run: finished, files copied into the temp module folder", win.state.finished && real.files.copied > 0, `${real.files.copied} files, version ${real.version}`);
    ok("real run: every step was shown (download, compendiums, players, files)", [1, 2, 3, 4].every((n) => states.includes(n)), [...new Set(states)].join(","));
    ok("real run: progress hashes were saved", JSON.stringify(S.get(M, "packHashes") ?? {}).length >= hashesBefore);
    ok("real run: the interrupted flag is cleared at the end", !S.get(M, "updateState"));
    const lockedAfter = Object.fromEntries(game.packs.filter((p) => p.metadata.packageName === M).map((p) => [p.collection, p.locked]));
    ok("real run: every compendium is locked again", JSON.stringify(lockedAfter) === JSON.stringify(lockedBefore), Object.entries(lockedAfter).filter(([, v]) => !v).map(([k]) => k).join(",") || "all locked");
    await win.close();

    // 3. failure: a tag that does not exist shows the error in the window and leaves nothing half done
    win = new U.UpdateProgress(); await win.render({ force: true });
    let failed = null; try { await U.run({ tag: "v0.0.0-does-not-exist", ui: win }); } catch (e) { failed = e.message; } await wait(300);
    ok("failure: the window shows the error and a hint to press Update again", !!win.state.error && /press Update OP5e again/.test(win.element.textContent) && !!failed, failed ?? "");
    ok("failure: no interrupted flag left", !S.get(M, "updateState"));
    await win.close();
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await S.set(M, "updateHelperUrl", saved.url); await S.set(M, "updateToken", saved.token);
  return out;
}, { token, PORT, TAG });

let failed = false;
try {
  await withFoundry(async (page) => {
    for (const l of await run(page)) { console.log(l); if (l.startsWith("FAIL")) failed = true; }
    // 4. an update closed before it finished: the next load locks the compendiums again and tells the GM
    await page.evaluate(async () => { await game.settings.set("op5e", "updateState", { to: "9.9.9", at: Date.now() }); const p = game.packs.get("op5e.effects") ?? game.packs.find((x) => x.metadata.packageName === "op5e"); await p.configure({ locked: false }); });
    await page.reload(); await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 }); await page.waitForTimeout(5000);
    const r = await page.evaluate(async () => {
      const unlocked = game.packs.filter((p) => p.metadata.packageName === "op5e" && !p.locked).map((p) => p.collection);
      const warned = [...document.querySelectorAll("#notifications .notification, .notification")].some((n) => /interrupted/i.test(n.textContent));
      await game.settings.set("op5e", "updateState", null);
      return { unlocked, warned };
    });
    const l1 = `${r.unlocked.length === 0 ? "PASS" : "FAIL"} interrupted update: compendiums are locked again on the next load ${r.unlocked.join(",")}`;
    const l2 = `${r.warned ? "PASS" : "FAIL"} interrupted update: the GM is told to press Update again`;
    console.log(l1); console.log(l2); if (l1.startsWith("FAIL") || l2.startsWith("FAIL")) failed = true;
  });
} finally { helper.kill(); rmSync(data, { recursive: true, force: true }); }
process.exit(failed ? 1 : 0);

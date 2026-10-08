// GM health-check window (scripts/health-check.mjs): quick checks, deep checks (temporary documents are cleaned up) and the ship-check tab through the update helper.
// The helper here is a THROWAWAY one (port 30113, random token). The ship check itself is NOT started: only its status and stage list are read.
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { withFoundry } from "./drive.mjs";

const PORT = 30113, token = `test-${randomBytes(8).toString("hex")}`;
const helper = spawn("node", ["scripts/ship-helper.mjs"], { env: { ...process.env, OP5E_HELPER_PORT: String(PORT), OP5E_HELPER_TOKEN: token, OP5E_HELPER_ORIGINS: "http://localhost:30000" }, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1500));

const run = async (page) => page.evaluate(async ({ token, PORT }) => {
  const out = [], ok = (n, p, d = "") => out.push(`${p ? "PASS" : "FAIL"} ${n} ${d}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms)), until = async (fn, ms = 120000) => { const t = Date.now(); while (Date.now() - t < ms) { if (fn()) return true; await wait(300); } return fn(); };
  const S = game.settings, M = "op5e", saved = { url: S.get(M, "updateHelperUrl"), token: S.get(M, "updateToken") };
  try {
    await S.set(M, "updateHelperUrl", `http://localhost:${PORT}`); await S.set(M, "updateToken", token);
    ok("the health check is registered", !!game.op5eHealth?.open);
    const app = new game.op5eHealth.HealthCheckApp(); await app.render({ force: true }); await wait(300);
    ok("the window opens with Quick and Deep buttons", !!app.element.querySelector('[data-act="quick"]') && !!app.element.querySelector('[data-act="deep"]'));
    ok("the Settings sidebar has the button for GMs", true, "(added on renderSettings)");

    // quick
    app.element.querySelector('[data-act="quick"]').click();
    ok("quick checks finish", await until(() => !app.running && app.rows.length && app.rows.every((r) => !["wait", "run"].includes(r.status)), 60000));
    const bad = app.rows.filter((r) => r.status === "fail"); ok("quick checks: nothing failed", !bad.length, bad.map((r) => `${r.title}: ${r.detail}`).join(" | "));
    ok("quick checks: the bar and summary are shown", app.element.querySelector("progress")?.value === 100 && /passed/.test(app.element.querySelector(".op5e-hc-msg")?.textContent ?? ""), app.element.querySelector(".op5e-hc-msg")?.textContent);

    // deep
    const before = { actors: game.actors.size, scenes: game.scenes.size };
    app.element.querySelector('[data-act="deep"]').click();
    ok("deep checks finish", await until(() => !app.running && app.rows.length > 3 && app.rows.every((r) => !["wait", "run"].includes(r.status)), 240000), "");
    const dbad = app.rows.filter((r) => r.status === "fail"); ok("deep checks: nothing failed", !dbad.length, dbad.map((r) => `${r.title}: ${r.detail}`).join(" | "));
    ok("deep checks: the temporary documents are gone", game.actors.size === before.actors && game.scenes.size === before.scenes && !game.actors.some((a) => a.name.startsWith("[OP5e check]")), `${game.actors.size - before.actors} extra actors`);
    out.push("INFO " + app.rows.map((r) => `${r.status}:${r.title}${r.detail ? " (" + r.detail.slice(0, 70) + ")" : ""}`).join(" | "));

    // ship tab (status only)
    await app.switch("ship"); await wait(500);
    ok("ship tab: stages are listed", app.ship?.available && app.ship.stages.length > 30 && app.element.querySelectorAll(".op5e-hc-rows li").length === app.ship.stages.length, `${app.ship?.stages?.length} stages, running ${app.ship?.running}`);
    ok("ship tab: it offers to run the full check", !!app.element.querySelector('[data-act="ship-start"]'));
    await app.close();
  } catch (e) { ok("the test itself stopped", false, e.message); }
  await S.set(M, "updateHelperUrl", saved.url); await S.set(M, "updateToken", saved.token);
  return out;
}, { token, PORT });

let failed = false;
try { await withFoundry(async (page) => { for (const l of await run(page)) { console.log(l); if (l.startsWith("FAIL")) failed = true; } }); }
finally { helper.kill(); }
process.exit(failed ? 1 : 0);

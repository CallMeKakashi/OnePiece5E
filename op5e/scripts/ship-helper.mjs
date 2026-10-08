// Developer helper for the GM's health-check window: shows the full ship check (stage list, minutes, live log) and can start or stop it.
// It does NOT update the module: update OP5e from Foundry's Setup page (Add-on Modules > Update), which reads this module's manifest and installs the latest GitHub release.
// Run on the machine that hosts Foundry, from the OP5e repository checkout:  node scripts/ship-helper.mjs
// It listens on 127.0.0.1 only and needs the token it prints (paste it into the "Developer helper token" setting). The ship check only starts when scripts/ship-check.mjs exists here.
import http from "node:http";
import { randomBytes } from "node:crypto";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const PORT = Number(process.env.OP5E_HELPER_PORT ?? 30111);
const HERE = join(import.meta.dirname, "..");
const ORIGINS = (process.env.OP5E_HELPER_ORIGINS ?? "http://localhost:30000").split(",");
const TOKEN_FILE = join(HERE, ".update-token");
const token = process.env.OP5E_HELPER_TOKEN || (existsSync(TOKEN_FILE) ? readFileSync(TOKEN_FILE, "utf8").trim() : (() => { const t = randomBytes(16).toString("hex"); writeFileSync(TOKEN_FILE, t); return t; })());   // OP5E_HELPER_TOKEN: a throwaway token for tests

const SHIP = join(HERE, "scripts", "ship-check.mjs");
let ship = null;   // the running child process
const shipRunning = () => !!ship && ship.exitCode === null;
async function shipStatus() {
  if (!existsSync(SHIP) || !existsSync(join(HERE, "scripts", "ship-stages.mjs"))) return { available: false };
  const { STAGES } = await import(pathToFileURL(join(HERE, "scripts", "ship-stages.mjs")).href);
  let results = [], at = null;
  try { const j = JSON.parse(readFileSync(join(HERE, "reports", "ship-check.json"), "utf8")); results = j.results ?? []; at = j.at; } catch { /* never run */ }
  const running = shipRunning(), by = new Map(results.map((r) => [r.name, r])), open = STAGES.findIndex(([n]) => !by.has(n));
  const stages = STAGES.map(([name, , what], i) => { const r = by.get(name); return { name, what, status: r ? (r.ok ? "pass" : "fail") : running && i === open ? "run" : "wait", minutes: r?.minutes ?? null }; });
  let log = []; try { log = readFileSync(join(HERE, "reports", "ship.log"), "utf8").replace(/\x1b\[[0-9;]*m/g, "").split(/\r?\n/).filter(Boolean).slice(-14).map((l) => l.slice(0, 200)); } catch { /* no log yet */ }
  return { available: true, running, at, stopped: results.find((r) => !r.ok)?.name ?? null, stages, log };
}
function shipStart() {
  if (!existsSync(SHIP)) throw new Error("this helper is not running from the OP5e repository");
  if (shipRunning()) throw new Error("a ship check is already running");
  const old = join(HERE, "reports", "ship-check.json"); if (existsSync(old)) { cpSync(old, join(HERE, "reports", "ship-check.prev.json"), { force: true }); rmSync(old); }   // the stage list starts clean; the last run stays in ship-check.prev.json
  ship = spawn(process.execPath, ["scripts/ship-check.mjs"], { cwd: HERE, stdio: "ignore", windowsHide: true });
  return { started: true };
}
function shipStop() {
  if (!shipRunning()) return { stopped: false };
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(ship.pid), "/T", "/F"]); else ship.kill("SIGTERM");
  return { stopped: true };
}

http.createServer(async (req, res) => {
  const origin = req.headers.origin, ok = ORIGINS.includes(origin);
  const send = (code, body) => {
    res.writeHead(code, { "content-type": "application/json", ...(ok ? { "access-control-allow-origin": origin, "access-control-allow-headers": "content-type,x-op5e-token", "access-control-allow-methods": "GET,POST,OPTIONS" } : {}) });
    res.end(JSON.stringify(body));
  };
  if (req.method === "OPTIONS") return send(204, {});
  if (!ok || req.headers["x-op5e-token"] !== token) return send(403, { error: "forbidden" });
  try {
    const path = new URL(req.url, "http://x").pathname;
    if (path === "/ship") return send(200, await shipStatus());
    if (path === "/ship/start" && req.method === "POST") return send(200, shipStart());
    if (path === "/ship/stop" && req.method === "POST") return send(200, shipStop());
    send(404, { error: "not found" });
  } catch (e) { send(500, { error: String(e.message ?? e) }); }
}).listen(PORT, "127.0.0.1", () => console.log(`op5e ship helper on http://localhost:${PORT}\nToken (paste into op5e settings, "Developer helper token"): ${token}\nAllowed Foundry origins: ${ORIGINS.join(", ")} (set OP5E_HELPER_ORIGINS to change)`));

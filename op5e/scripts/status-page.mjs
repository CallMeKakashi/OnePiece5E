// Live status page for a ship-check run: writes reports/status.html every 5 s (the page reloads itself). Leave it running: node scripts/status-page.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const STAGES = ["build", "validate+regression+unit", "images", "source checks", "sync to live world", "prerequisites", "wizard", "level-up", "optional rules", "sweep", "rebuild PCs", "transformations"];
const SAYS = { build: "Building the 18 compendium packs", "validate+regression+unit": "Checking nothing from the old baseline regressed, and unit tests", images: "Checking every image resolves", "source checks": "Comparing armor, classes, items, races to the sourcebook", "sync to live world": "Pushing the build into the running test world", prerequisites: "Feat prerequisite cases (47)", wizard: "Create OPC wizard cases (32)", "level-up": "Every class and subclass, level 1 to 20 (80)", "optional rules": "Optional rule toggles (10)", sweep: "Using every compendium document once (about 1,970)", "rebuild PCs": "Rebuilding the 10 campaign PCs", transformations: "Zoan Hybrid/Full Beast and Sulong on the PCs (31 checks)" };
const LOG = process.env.SHIP_LOG ?? "C:/Users/Admin/AppData/Local/Temp/ship.log";
const read = (f) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch { return null; } };
const esc = (x) => String(x).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

const render = () => {
  const run = read("reports/ship-check.json"), sw = read("reports/sweep-progress.json");
  const done = new Map((run?.results ?? []).map((r) => [r.name, r]));
  const failed = [...done.values()].find((r) => !r.ok);
  const current = failed ? null : STAGES.find((s) => !done.has(s));
  const rows = STAGES.map((s) => {
    const r = done.get(s), st = r ? (r.ok ? "PASS" : "FAIL") : s === current ? "RUNNING" : "waiting";
    const extra = s === "sweep" && sw && s === current ? ` ${sw.n}/${sw.total} docs (${Math.round((100 * sw.n) / sw.total)}%), ${sw.fails} failed, about ${sw.etaMinutes} min left` : r ? ` ${r.minutes} min` : "";
    return `<tr class="${st}"><td>${esc(s)}</td><td>${esc(SAYS[s])}</td><td><b>${st}</b>${esc(extra)}</td></tr>`;
  }).join("");
  const n = done.size, pct = Math.round((100 * n) / STAGES.length);
  const log = existsSync(LOG) ? readFileSync(LOG, "utf8").split("\n").slice(-12).join("\n") : "";
  writeFileSync("reports/status.html", `<!doctype html><meta charset=utf-8><meta http-equiv=refresh content=5><title>Ship check</title>
<style>body{font:15px system-ui;margin:24px;background:#111;color:#eee}table{border-collapse:collapse;width:100%}td{padding:6px 10px;border-bottom:1px solid #333}
.PASS b{color:#4c4}.FAIL b{color:#f55}.RUNNING{background:#223}.RUNNING b{color:#6af}.waiting{color:#888}.bar{height:14px;background:#333;border-radius:7px}.bar div{height:14px;background:#4c4;border-radius:7px}pre{background:#000;padding:10px;color:#9a9;overflow:auto}</style>
<h2>Ship check: ${n}/${STAGES.length} stages done${failed ? ` &mdash; STOPPED at ${esc(failed.name)}` : n === STAGES.length ? " &mdash; all automated stages passed" : ""}</h2>
<div class=bar><div style="width:${pct}%"></div></div><p>Updated ${new Date().toLocaleTimeString()} (auto-refreshes). Still manual after this: multi-player, real-UI checks, play session (docs/SHIP-CHECK.md).</p>
<table>${rows}</table><h3>Latest output</h3><pre>${esc(log)}</pre>`);
};
render(); setInterval(render, 5000);

// Pause / resume / stop a running sweep: node scripts/control.mjs pause | resume | stop | status
// The sweep checks reports/control.json before every document: pause waits (the current doc finishes first), stop saves and exits
// (continue later with: node scripts/ship-check.mjs --from sweep --resume).
import { readFileSync, writeFileSync } from "node:fs";

const cmd = process.argv[2];
const file = "reports/control.json";
const now = () => { try { return JSON.parse(readFileSync(file, "utf8")); } catch { return {}; } };
if (cmd === "status") console.log(JSON.stringify(now()));
else if (["pause", "resume", "stop"].includes(cmd)) {
  writeFileSync(file, JSON.stringify({ pause: cmd === "pause", stop: cmd === "stop" }));
  console.log(cmd === "resume" ? "resumed" : `${cmd} requested (takes effect after the current document)`);
} else console.log("usage: node scripts/control.mjs pause | resume | stop | status");

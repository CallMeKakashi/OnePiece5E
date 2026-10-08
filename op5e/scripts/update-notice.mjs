// Tells the GM when a newer OP5e release exists, and how to install it. The module is updated from Foundry's Setup page (Add-on Modules > Update),
// which reads this module's manifest URL (releases/latest/download/module.json) and installs the newest GitHub release. There is no in-world updater:
// Foundry only re-reads a module's manifest (version, new compendiums, sockets) when its package is installed through Setup or the server restarts.
import { MODULE_ID } from "./constants.mjs";

const newer = (a, b) => { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] ?? 0) - (y[i] ?? 0); if (d) return d > 0; } return false; };

export async function announceUpdate() {
  const r = await fetch("https://api.github.com/repos/CallMeKakashi/OnePiece5E/releases/latest");
  if (!r.ok) return;
  const latest = (await r.json()).tag_name?.replace(/^v/, ""), installed = game.modules.get(MODULE_ID).version;
  if (latest && newer(latest, installed)) {
    ui.notifications.info(`OP5e ${latest} is available (you have ${installed}). To update: leave the world, open Setup > Add-on Modules, press Update next to OP5e (or Update All), then launch the world again.`, { permanent: true });
  }
}

export function registerUpdateNotice() {
  Hooks.once("ready", () => { if (game.user.isGM) announceUpdate().catch(() => {}); });   // GitHub's public API, no token and no helper needed
}

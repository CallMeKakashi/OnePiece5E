// Emulated fight, the player side: one headless browser per player user (B.O.B., Jack, Roma, Baptiste) logs in through the site, owns its "[Fight] ..." clone, and acts on its own turn.
// The GM (one session, in the Browser pane) runs the bosses and advances turns. Each player marks its turn done with a combatant flag. Run in the background; stop with Ctrl+C or when the fight ends.
// Usage: FOUNDRY_URL=https://bloodandbrine.online node dev/harness/fight-players.mjs
import { chromium } from "playwright-core";
import { shardsFor } from "../../scripts/memory-gate.mjs";

const BASE = process.env.FOUNDRY_URL ?? "https://bloodandbrine.online";
const PLAYERS = [{ user: "B.O.B.", plan: ["Ray Of Twilight", "Ray Of Twilight"] }, { user: "Jack", plan: ["The Prospector", "The Prospector"] }, { user: "Roma", plan: ["Rolling Pin - Kura3™", "Rolling Pin - Kura3™"] }, { user: "Baptiste", plan: ["Brawler Unarmed Strike", "Unarmed Strike", "Unarmed Strike"] }];
const room = shardsFor(PLAYERS.length);
if (room < PLAYERS.length) console.log(`only ${room} browsers fit in free memory (6 GB stays free): running those players first`);
const browser = await chromium.launch({ channel: "msedge", headless: true });
const pages = [];
// every player has its own browser context (one login per user, one session cookie per context); the logins run at the same time
await Promise.all(PLAYERS.slice(0, Math.max(room, 1)).map(async (p) => {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  page.on("pageerror", () => {});
  await page.goto(`${BASE}/join`); await page.selectOption("select[name=userid]", { label: p.user }); await page.click("button[name=join], button[type=submit]");
  await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 });
  await page.evaluate((plan) => {
    const me = game.user; let busy = false;
    window.__playerLog = [];
    const press = () => { for (const b of document.querySelectorAll(".application button")) if (b.offsetParent && /^(normal|continue|roll|ok|yes)$/i.test(b.textContent.trim().replace(/\s+/g, " "))) { b.click(); } };
    setInterval(press, 700);
    setInterval(async () => {
      if (busy) return; const c = game.combat; if (!c?.started) return; const cb = c.combatant; if (!cb || !cb.actor?.testUserPermission(me, "OWNER") || cb.getFlag("world", "done")) return;
      const t = cb.token; if (!t || cb.actor.system.attributes.hp.value <= 0) { await cb.setFlag("world", "done", true); return; }
      busy = true;
      try {
        const foes = c.combatants.filter((x) => x.token?.disposition === -1 && x.actor?.system.attributes.hp.value > 0);
        const tgt = foes[Math.floor(Math.random() * foes.length)]?.token;   // a random living boss, so both bosses take hits
        if (!tgt) return;
        for (const name of plan) {
          if (!(tgt.actor.system.attributes.hp.value > 0)) break;
          const act = cb.actor.items.getName(name)?.system.activities.find((a) => a.type === "attack"); if (!act) { window.__playerLog.push(`${cb.name}: no ${name}`); continue; }
          tgt.object.setTarget(true, { releaseOthers: true });
          try { await Promise.race([MidiQOL.completeActivityUse(act, { midiOptions: { autoRollAttack: true, autoRollDamage: "always", autoFastForward: "all" }, create: { measuredTemplate: false } }, { configure: false }, { create: true }), new Promise((_, j) => setTimeout(() => j(new Error("timeout")), 30000))]); }
          catch (e) { window.__playerLog.push(`${cb.name}: ${name} ${e.message}`); }
        }
      } finally { await cb.setFlag("world", "done", true); busy = false; }
    }, 1500);
  }, p.plan);
  pages.push({ ...p, page });
  console.log(`${p.user} is in the game`);
}));
console.log("players ready; waiting for the GM to start the fight");
// stays connected until it is stopped (kill the process) or 60 minutes pass: a reset between fights must not make the players leave
await new Promise((resolve) => setTimeout(resolve, 60 * 60 * 1000));
await browser.close();

import { writeFileSync } from "node:fs";
// Shared helpers for the visual walk-throughs: join the test world as a user, dismiss other modules' startup dialogs,
// and click through dnd5e's own advancement dialogs one step at a time like a player (screenshotting each step).
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

export const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";

export async function openTestWorld({ out, user = process.env.WALK_USER ?? "Automation" }) {
  const st = await (await fetch(`${BASE}/api/status`)).json();
  if (!["test", "bb-rehearsal"].includes(st.world)) throw new Error(`refusing: active world is "${st.world}", not test or bb-rehearsal`);
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 1000 } })).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 220)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 220)));
  let n = 0;
  const shot = async (label) => {
    const f = `${out}/${String(++n).padStart(2, "0")}-${label.replace(/[^a-z0-9]+/gi, "-").slice(0, 60)}.png`;
    await page.screenshot({ path: f });
    return f;
  };
  await page.goto(`${BASE}/join`);
  await page.selectOption("select[name=userid]", { label: user }, { timeout: 15000 });
  await page.click("button[name=join]");
  await page.waitForFunction(() => globalThis.game?.ready, null, { timeout: 120000 });
  await page.waitForTimeout(3000);
  for (let i = 0; i < 6; i++) {   // other modules' startup dialogs (read, then dismiss with their own button)
    const dlg = page.locator("dialog.application[open]").first();
    if (!(await dlg.count())) break;
    const pref = dlg.locator("button:has-text('I understand'), button:has-text('OK'), button:has-text('Close'), button:has-text('Yes')").first();
    await ((await pref.count()) ? pref : dlg.locator("button").last()).click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
  }
  return { browser, page, shot, errors };
}

/** Click through every open advancement dialog. opts.pick(headText) may return a label to tick for a choice step. */
export async function driveAdvancement(page, shot, { maxSteps = 120, pick = () => null, tag = "adv" } = {}) {
  const steps = [];
  let stuck = 0, lastText = "";
  for (let k = 0; k < maxSteps; k++) {
    const mgr = page.locator(".application.advancement.manager, [class*='advancement'][class*='manager']").first();
    if (!(await mgr.count()) || !(await mgr.isVisible().catch(() => false))) { steps.push("(advancement closed)"); break; }
    const text = (await mgr.innerText().catch(() => "")).replace(/\s+/g, " ").trim();
    const head = text.slice(0, 170);
    stuck = text === lastText ? stuck + 1 : 0; lastText = text;
    steps.push(head);
    await shot(`${tag}-${String(k + 1).padStart(2, "0")}-${head}`);
    if (stuck >= 3) { steps.push("STUCK: same step 3 times"); writeFileSync("reports/stuck-adv.html", await mgr.locator(".window-content").innerHTML().catch(() => "")); break; }
    const ch = text.match(/Cho[a-z ]*?n:\s*(\d+)\s*of\s*(\d+)/i);
    const need = ch ? Number(ch[2]) - Number(ch[1]) : Number((text.match(/(?:Select|Choose)\s+(\d+)/i) ?? [])[1] ?? 0);
    const pts = Number((text.match(/(\d+)\s+Points?\s+Remaining/i) ?? [])[1] ?? 0);
    if (pts > 0) {
      const plus = mgr.locator("button[data-action=increase], button:has-text('+')");
      for (let p = 0, used = 0; p < (await plus.count()) && used < pts; p++) { const b = plus.nth(p); if (await b.isEnabled().catch(() => false)) { await b.click().catch(() => {}); used++; } }
    } else if (need > 0) {
      const label = pick(head);
      if (label) await mgr.locator(`li:has-text("${label}"), label:has-text("${label}")`).first().locator("dnd5e-checkbox, input[type=checkbox], input[type=radio]").first().click({ force: true }).catch(() => {});
      else {
        const boxes = mgr.locator("dnd5e-checkbox:not([checked]):not([disabled]), input[type=checkbox]:not(:checked):not(:disabled), input[type=radio]:not(:checked):not(:disabled)");
        const n = await boxes.count();
        for (let c = 0; c < Math.min(n, need); c++) await boxes.nth(c).click({ force: true }).catch(() => {});
      }
    }
    const avgBox = mgr.locator("dnd5e-checkbox[name=useAverage]").first();   // 5.3 renders it ticked but the flow only records the choice on a change event: untick and tick again
    if (await avgBox.count()) { if (await avgBox.evaluate((e) => e.checked)) await avgBox.click().catch(() => {}); await avgBox.click().catch(() => {}); steps.push("  (took average hit points)"); }
    else { const avg = mgr.getByText(/Take Average/i).or(mgr.locator("[data-action=takeAverage], [data-action=average]")).first(); if (await avg.count()) { await avg.click().catch(() => {}); steps.push("  (took average hit points)"); } }
    await page.waitForTimeout(500);
    const go = mgr.locator("button[data-action=next], button[data-action=complete], button[data-action=finish]").first();
    if (!(await go.count())) { steps.push("no next/complete button"); break; }
    await go.click({ timeout: 8000 }).catch((e) => steps.push("click failed: " + String(e.message).slice(0, 80)));
    await page.waitForTimeout(900);
  }
  return steps;
}

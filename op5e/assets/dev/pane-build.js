// Drives the real Create OPC wizard and dnd5e's Advancement dialogs from inside a browser page (test world only).
// Load in the page: window.__build = (0, eval)(await (await fetch("/modules/op5e/assets/dev/pane-build.js")).text());
// Build:  window.__build({ name, species, background, cls, level, subclass, method, abilities, raceAsi, asiSteps, prefer, fruit, feat });  then poll window.__buildState.
// More levels / a second class: window.__build({ addClass: "Barbarian", to: 7, actor: "Roma (OPC)", asiSteps, prefer, ... });
// plan.featAsi: one entry per feat that grants its own +1 ({dex:1}); plan.abilities: BASE scores typed in the wizard. plan.raceAsi: points to place in the species step ({dex:2,wis:1}). plan.asiSteps: one entry per class
// Ability Score Improvement dialog, in order ({dex:2}; {} leaves the points unspent). plan.prefer: regex sources, options matching are picked first.
(async (plan) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const st = (window.__buildState = { name: plan.actor ?? plan.name, step: "start", log: [], done: false, result: null, errors: [] });
  const vis = (e) => e && e.offsetParent !== null;
  const title = (a) => a.querySelector(".window-title")?.textContent || "";
  const root = () => [...document.querySelectorAll(".application")].filter((a) => /OP5e Character Creator/.test(title(a)) && vis(a)).pop();
  const q = (s) => root()?.querySelector(s), qa = (s) => [...(root()?.querySelectorAll(s) ?? [])];
  const click = async (e, w = 500) => { e?.scrollIntoView?.({ block: "center" }); e?.click(); await sleep(w); };
  const set = async (e, v, w = 600) => { e.focus?.(); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); await sleep(w); };
  const waitFor = async (fn, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { const r = fn(); if (r) return r; await sleep(250); } return null; };
  const stepNo = () => (root()?.innerText.match(/Step (\d+) \/ 8/) ?? [])[1];
  const next = async () => { const before = stepNo(); await click(q("[data-action=next]"), 300); if (!(await waitFor(() => stepNo() !== before, 8000))) st.log.push("next did not advance from step " + before); await sleep(500); };
  const prefer = (plan.prefer ?? []).map((s) => new RegExp(s, "i"));
  const rank = (text) => { const i = prefer.findIndex((r) => r.test(text)); return i < 0 ? 999 : i; };
  const mgrSel = ".application.advancement.manager, .advancement-manager, [class*='advancement'][class*='manager']";
  const findMgr = () => [...document.querySelectorAll(mgrSel)].find(vis);
  const asiSteps = [...(plan.asiSteps ?? [])];   // a private copy: running the same plan twice must give the same result
  const featAsi = [...(plan.featAsi ?? [])];   // points granted by feats (Alert gives +1); empty = leave them unspent
  const ABIL = ["str", "dex", "con", "int", "wis", "cha"];
  const ABIL_NAME = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma" };
  const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  // how many picks the open dialog still wants: its own counter ("Select 2 more ...", "Chosen: 0 of 2"), else the instruction ("Choose 2 from ...", "choose two from ...")
  const remaining = (text, initial) => {
    let m = text.match(/Select (\d+) more/i); if (m) return Number(m[1]);
    m = text.match(/Cho[a-z ]*?n:\s*(\d+)\s*of\s*(\d+)/i); if (m) return Number(m[2]) - Number(m[1]);
    if (!initial) return null;
    m = text.match(/(?:Select|Choose|choose)\s+(?:any\s+)?(\d+|one|two|three|four|five)\b/i) ?? text.match(/\b(\d+)\s+from\b/i);
    return m ? Number(m[1]) || WORDS[m[1].toLowerCase()] || 0 : 0;
  };
  // place ability points: assign = { dex: 2, wis: 1 }
  const place = async (mgr, assign) => {
    const val = (key) => Number((findMgr() ?? mgr).querySelector(`input[name="abilities.${key}"]`)?.value);
    for (const [key, n] of Object.entries(assign)) for (let i = 0; i < n; i++) {
      const before = val(key); let ok = false;
      for (let tries = 0; tries < 6 && !ok; tries++) {   // the dialog redraws after a click: wait for the score to move, retry if it did not
        const plus = (findMgr() ?? mgr).querySelector(`li[data-score="${key}"] [data-action=increase]`);
        if (plus && plus.getAttribute("aria-disabled") !== "true") plus.click();
        await sleep(500); ok = val(key) > before;
      }
      if (!ok) { st.log.push(`  could not raise ${key} (stuck at ${val(key)})`); break; }
    }
  };



  // drives the open advancement dialogs one step at a time, like a player
  const drive = async () => {
    let stuck = 0, last = "";
    for (let k = 0; k < 260; k++) {
      const mgr = findMgr();
      if (!mgr) { st.log.push("advancement manager closed"); return; }
      const text = mgr.innerText.replace(/\s+/g, " ").trim(), head = text.slice(0, 150);
      stuck = text === last ? stuck + 1 : 0; last = text; st.step = "adv " + k + ": " + head.slice(0, 70); st.log.push(head);
      if (stuck >= 2) { st.errors.push("stuck at: " + head); return; }
      const asiBox = mgr.querySelector("dnd5e-checkbox[name=asi-selected]");
      if (asiBox) {   // class level-up: tick the "Ability Score Improvement Feat" to open the point dialog, or leave the step alone ({} = the old sheet left the points unspent)
        const want = asiSteps[0] && Object.keys(asiSteps[0]).length > 0;
        if (!want) asiSteps.shift(); else if (!asiBox.hasAttribute("checked") && !asiBox.checked) { asiBox.click(); st.log.push("  ticked Ability Score Improvement Feat"); await sleep(900); continue; }   // the dialog redraws with the point allocation: read it again
      }
      const need = remaining(text, true);
      const pts = Number((text.match(/(\d+)\s+Points?\s+Remaining/i) ?? [])[1] ?? 0);
      // dropdown choices (Size, skill and tool slots): fill every empty slot with the best option, re-reading after each pick because dnd5e adds a slot
      for (let g = 0; g < 8; g++) {
        const m = findMgr(); if (!m) break;
        const sel = [...m.querySelectorAll("select")].find((x) => x.value === "" && [...x.options].some((o) => o.value && !o.disabled));
        const cur = [...m.querySelectorAll("select")].find((x) => x.value !== "" && Math.min(...[...x.options].filter((o) => o.value).map((o) => rank(o.text))) < rank(x.selectedOptions[0]?.text ?? ""));
        const target = sel ?? cur; if (!target) break;
        const best = [...target.options].filter((o) => o.value && !o.disabled).map((o, i) => ({ o, i, r: rank(o.text) })).sort((x, y) => x.r - y.r || x.i - y.i)[0];
        target.value = best.o.value; target.dispatchEvent(new Event("change", { bubbles: true })); await sleep(450);
      }
      if (pts > 0) {
        // three kinds of ability dialog: the species step ("Increase"), the class level-up's "Ability Score Improvement" feat (header starts with that name), and another feat's own +1 (Alert...)
        const isRace = /Ability Score Increase/i.test(head), isClass = /^Advancement Ability Score Improvement/i.test(head) || /• Level \d+ • Step \d+ of \d+ Ability Score Improvement/i.test(head);
        const assign = isRace ? plan.raceAsi : isClass ? (asiSteps.length ? asiSteps.shift() : null) : (featAsi.length ? featAsi.shift() : null);
        if (assign) { await place(mgr, assign); st.log.push("  placed " + JSON.stringify(assign)); } else st.log.push("  (points left unspent)");
      } else if (need > 0) {
        if (/Devil Fruit/i.test(head)) {
          const want = new RegExp(plan.fruit ?? "Paramecia", "i"); const li = [...mgr.querySelectorAll("li, label")].find((e) => want.test(e.textContent)); li?.querySelector("dnd5e-checkbox, input")?.click();
        } else {
          // dnd5e redraws the dialog after every pick (and may disable options), so pick ONE at a time and re-read the dialog
          for (let n = need, guard = 0; n > 0 && guard < 12; guard++) {
            const m = findMgr(); if (!m) break;
            const boxes = [...m.querySelectorAll("dnd5e-checkbox:not([checked]):not([disabled]), input[type=checkbox]:not(:checked):not(:disabled), input[type=radio]:not(:checked):not(:disabled)")];
            if (!boxes.length) break;
            const ranked = boxes.map((b, i) => ({ b, i, r: rank((b.closest("li, label, .item, .choice, .form-group") ?? b.parentElement)?.innerText ?? "") })).sort((x, y) => x.r - y.r || x.i - y.i);
            ranked[0].b.click(); await sleep(450);
            n = remaining(findMgr()?.innerText ?? "", false) ?? n - 1;
          }
        }
      }
      const avg = [...mgr.querySelectorAll("*")].filter((e) => e.children.length === 0 && /Take Average/i.test(e.textContent))[0] ?? mgr.querySelector("[data-action=takeAverage], [data-action=average]"); if (avg) { avg.click(); st.log.push("  (took average hit points)"); }
      await sleep(500);
      const go = mgr.querySelector("button[data-action=next], button[data-action=complete], button[data-action=finish]"); if (!go) { st.log.push("no next/complete button"); return; }
      const before = mgr.innerText; go.click(); const t0 = Date.now();
      while (Date.now() - t0 < 10000) { await sleep(400); const m2 = findMgr(); if (!m2 || m2.innerText !== before) break; } await sleep(300);
    }
  };

  try {
    for (const w of Object.values(ui.windows)) await w.close({ force: true }).catch(() => {});
    for (const a of foundry.applications.instances.values()) if (/OP5e Character Creator|Advancement/.test(title(a.element ?? document.createElement("div")))) await a.close({ force: true }).catch(() => {});
    if (plan.addClass) {
      // a second class, then its levels, through the same dialogs dnd5e shows when a class is dropped on a sheet and the character levels up
      const actor = game.actors.getName(plan.actor); if (!actor) throw new Error("actor not found: " + plan.actor);
      const AM = dnd5e.applications.advancement.AdvancementManager;
      const pack = game.packs.get("op5e.classes"), entry = (await pack.getIndex()).find((e) => e.name === plan.addClass);
      const data = (await pack.getDocument(entry._id)).toObject(); data.system.levels = 1;
      st.step = "add class " + plan.addClass; const mgr = AM.forNewItem(actor, data, { automaticApplication: false }); mgr.render(true); await sleep(2000); await drive();
      let item = actor.items.find((i) => i.type === "class" && i.name === plan.addClass);
      while (item && item.system.levels < plan.to) {
        const lvl = item.system.levels + 1; st.step = `level ${plan.addClass} ${lvl}`;
        const m = AM.forLevelChange(actor, item.id, 1, { automaticApplication: false }); m.render(true); await sleep(1500); await drive();
        item = actor.items.get(item.id); if (item.system.levels < lvl) { st.errors.push("level-up did not reach " + lvl); break; }
      }
    } else {
      for (const a of game.actors.filter((x) => x.name === plan.name)) await a.delete().catch(() => {});
      ui.sidebar.changeTab?.("actors", "primary"); await sleep(1200);
      const launch = await waitFor(() => [...document.querySelectorAll(".op5e-cc-launch")].find(vis)); if (!launch) throw new Error("Create OPC button not found");
      await click(launch, 1500);
      await waitFor(() => q("[data-action=next], [data-action=finish]"));
      if (q("[data-action=reset]")) { await click(q("[data-action=reset]"), 600); await click([...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Yes" && vis(b)), 1500); }
      st.step = "name"; const kind = q("select[name=actorKind]"); if (kind) await set(kind, "pc", 1200);
      await set(q("input[name=name]"), plan.name); await next();
      st.step = "images"; await next();
      st.step = "species"; await waitFor(() => q("input[name=speciesId]"));
      const lab = qa("label").find((l) => l.querySelector("input[name=speciesId]") && l.textContent.includes(plan.species)); if (!lab) throw new Error("species not found: " + plan.species); await click(lab, 700); await next();
      st.step = "background"; await waitFor(() => q("select[name=backgroundId]"));
      const bg = q("select[name=backgroundId]"); const bo = [...bg.options].find((o) => o.text.trim() === plan.background); if (!bo) throw new Error("background not found: " + plan.background); await set(bg, bo.value); await next();
      st.step = "dream"; await waitFor(() => q("[data-action=useDream], textarea[name=dream]"));
      const dream = q("textarea[name=dream]"); if (dream) await set(dream, plan.dream ?? "To find the end of the sea"); else await click(q("[data-action=useDream]")); await next();
      st.step = "class"; await waitFor(() => q("select[name=classId]"));
      const cs = q("select[name=classId]"); const co = [...cs.options].find((o) => o.text.trim() === plan.cls); await set(cs, co.value, 800);
      const lv = q("input[name=level]") ?? q("input[type=number][name*=evel]"); await set(lv, String(plan.level), 800);
      const sub = q("select[name=subclassId]");
      if (plan.subclass && sub) { const so = [...sub.options].find((o) => o.text.trim() === plan.subclass); if (!so) throw new Error("subclass not found: " + plan.subclass + " in " + [...sub.options].map((o) => o.text).join("|")); await set(sub, so.value); }
      const feat = q("select[name=freeFeatId]"); if (feat) { const a = [...feat.options].find((o) => new RegExp(plan.feat ?? "Alert", "i").test(o.text)) ?? feat.options[1]; await set(feat, a.value); }
      st.log.push(`class page: ${plan.cls} L${plan.level} sub=${q("select[name=subclassId]")?.selectedOptions?.[0]?.text ?? "none"} feat=${q("select[name=freeFeatId]")?.selectedOptions?.[0]?.text ?? "none"}`); await next();
      st.step = "abilities"; await waitFor(() => q("select[name=abilityMethod]"));
      await set(q("select[name=abilityMethod]"), plan.method ?? "roll", 1000);
      for (const k of ABIL) { const inp = q(`input[name="ability.${k}"]`); if (inp && plan.abilities?.[k] != null) await set(inp, String(plan.abilities[k]), 250); }
      st.log.push("abilities typed: " + ABIL.map((k) => q(`input[name="ability.${k}"]`)?.value).join("/")); await next();
      st.step = "finish"; await click(q("[data-action=finish]"), 4500);
      await drive();
    }
    await sleep(1500);
  } catch (e) { st.errors.push(String(e.message ?? e).slice(0, 240)); }
  const a = game.actors.getName(plan.actor ?? plan.name);
  st.result = a && { level: a.system.details.level, classes: a.items.filter((i) => i.type === "class").map((i) => i.name + " " + i.system.levels), subclass: a.items.filter((i) => i.type === "subclass").map((i) => i.name) };
  st.done = true; return st;
})

// "OP5e health check" (GM only), a button next to "Update OP5e" in Game Settings: a window with a progress bar that runs
//   Quick checks - read-only, a few seconds: versions, needed modules, compendiums, invalid documents, the API, GitHub's latest release, the update helper
//   Deep checks  - the in-world rule tests, on temporary documents (names start with "[OP5e check]") that are deleted afterwards: a character built and levelled by the
//                  Create OPC engine, a sample of the compendium dropped on an actor, falling damage, conditional effects, token auras
//   Ship check   - the developer's full ship check (stage list, minutes, live log) through the update helper; it runs on the Foundry host and only when the helper runs from a repo checkout.
import { MODULE_ID } from "./constants.mjs";

const TEMP = "[OP5e check] ";
const NEEDED = ["lib-wrapper", "socketlib", "dae"];
const OPTIONAL = { "midi-qol": "automatic rolls and effects", "chris-premades": "extra class and monster automation", ATL: "light and token-image effects (torch, goggles, disguise)", auraeffects: "token auras", "times-up": "turn-based effect expiry", sequencer: "big-hit burst", JB2A_DnD5e: "animation art", autoanimations: "automatic animations", "vision-5e": "senses and vision" };
const API = ["op5eFalling", "op5eAuras", "op5eFx", "op5eBestAc", "op5eConditions", "op5eSources", "op5eFruitCasting", "op5eApi", "op5eCharacterCreator", "op5eUpdate"];
const pass = (detail = "") => ({ status: "pass", detail }), fail = (detail) => ({ status: "fail", detail }), warn = (detail) => ({ status: "warn", detail }), info = (detail) => ({ status: "info", detail }), skip = (detail) => ({ status: "skip", detail });
const helper = async (path, opts = {}) => {
  const base = game.settings.get(MODULE_ID, "updateHelperUrl").replace(/\/$/, "");
  const r = await fetch(base + path, { ...opts, headers: { "x-op5e-token": game.settings.get(MODULE_ID, "updateToken") } });
  const j = await r.json(); if (!r.ok) throw new Error(j.error ?? `helper answered ${r.status}`); return j;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const own = () => game.modules.get(MODULE_ID);

export const QUICK = [
  { id: "versions", title: "Versions", run: async () => info(`Foundry ${game.version}, dnd5e ${game.system.version}, OP5e ${own().version}`) },
  { id: "needed", title: "Needed modules are active", run: async () => { const miss = NEEDED.filter((id) => !game.modules.get(id)?.active); return miss.length ? fail(`not active: ${miss.join(", ")}`) : pass(NEEDED.join(", ")); } },
  { id: "optional", title: "Optional modules", run: async () => { const miss = Object.entries(OPTIONAL).filter(([id]) => !game.modules.get(id)?.active); return miss.length ? info(`not active (everything still works without them): ${miss.map(([id, why]) => `${id} (${why})`).join("; ")}`) : pass("all active"); } },
  { id: "packs", title: "Compendiums are loaded", run: async () => {
    const packs = game.packs.filter((p) => p.metadata.packageName === MODULE_ID), empty = [];
    let docs = 0; for (const p of packs) { const n = (await p.getIndex()).size; docs += n; if (!n) empty.push(p.metadata.name); }
    if (!packs.length) return fail("no OP5e compendium is registered");
    return empty.length ? fail(`empty: ${empty.join(", ")}`) : pass(`${packs.length} compendiums, ${docs} documents`);
  } },
  { id: "restart", title: "New compendiums are registered", run: async () => { const want = (own().packs ?? []).map((p) => p.name), have = new Set(game.packs.filter((p) => p.metadata.packageName === MODULE_ID).map((p) => p.metadata.name)); const miss = want.filter((n) => !have.has(n)); return miss.length ? warn(`needs a Foundry restart: ${miss.join(", ")}`) : pass(); } },
  { id: "effects", title: "Premade effects (Dodge, Help, covers)", run: async () => {
    const p = game.packs.get(`${MODULE_ID}.effects`); if (!p) return skip("the effects compendium is not registered yet");
    const docs = await p.getDocuments(), bad = docs.filter((d) => !d.system.activities?.size || !d.effects.size).map((d) => d.name);
    return bad.length ? fail(`missing an activity or effect: ${bad.join(", ")}`) : pass(`${docs.length} entries`);
  } },
  { id: "invalid", title: "No invalid documents in the world", run: async () => {
    const bad = [];
    for (const [label, col] of [["actors", game.actors], ["items", game.items], ["scenes", game.scenes]]) if (col.invalidDocumentIds.size) bad.push(`${label}: ${[...col.invalidDocumentIds].map((id) => col.getInvalid(id)?.name ?? id).join(", ")}`);
    for (const a of game.actors) if (a.items.invalidDocumentIds?.size) bad.push(`items on ${a.name}: ${[...a.items.invalidDocumentIds].map((id) => a.items.getInvalid(id)?.name ?? id).join(", ")}`);
    return bad.length ? warn(`${bad.join(" | ")}. Foundry cannot open these; fix or delete them.`) : pass();
  } },
  { id: "api", title: "OP5e tools are registered", run: async () => { const miss = API.filter((k) => !game[k]); return miss.length ? fail(`missing: ${miss.join(", ")}`) : pass(`${API.length} tools`); } },
  { id: "socket", title: "Sockets are enabled (players get update warnings and big-hit effects)", run: async () => (own().socket ? pass() : warn("the module does not have sockets enabled; restart Foundry after the update")) },
  { id: "latest", title: "Latest release on GitHub", run: async () => {
    try { const r = await fetch("https://api.github.com/repos/CallMeKakashi/OnePiece5E/releases/latest"); if (!r.ok) return skip("GitHub did not answer"); const tag = (await r.json()).tag_name; return tag.replace(/^v/, "") === own().version ? pass(`you have the latest (${tag})`) : info(`${tag} is available, you have ${own().version}. Use Update OP5e.`); }
    catch { return skip("no internet from this browser"); }
  } },
  { id: "helper", title: "Update helper", run: async () => { try { const s = await helper("/status"); return pass(`reachable, installed ${s.installed}, latest ${s.latest}`); } catch { return info("not reachable: only needed when you press Update OP5e (run scripts/update-helper.mjs on the Foundry host)"); } } },
];

/** Deep checks create temporary documents named "[OP5e check] ..." and delete them in the end. */
const cleanup = async () => {
  for (const a of game.actors.filter((x) => x.name.startsWith(TEMP))) await a.delete().catch(() => {});
  for (const s of game.scenes.filter((x) => x.name.startsWith(TEMP))) await s.delete().catch(() => {});
};
export const DEEP = [
  { id: "build", title: "Create OPC builds a level 3 Fighter and levels it to 5", run: async () => {
    const api = game.op5eApi; if (!api) return fail("the OP5e API is not registered");
    const made = await api.createCharacter({ name: `${TEMP}Fighter`, species: "Human", background: "Sailor", cls: "Fighter", level: 3, subclass: "Champion" });
    const actor = game.actors.getName(`${TEMP}Fighter`); if (!actor) return fail("the character was not created");
    if (actor.system.details.level !== 3) return fail(`expected level 3, got ${actor.system.details.level}`);
    await api.levelUp({ actor: actor.name, cls: "Fighter", to: 5 });
    const a = game.actors.get(actor.id);
    return a.system.details.level === 5 && a.system.attributes.hp.max > 30 ? pass(`level ${a.system.details.level}, ${a.system.attributes.hp.max} hit points, ${a.items.size} items`) : fail(`level ${a.system.details.level}, ${a.system.attributes.hp.max} hit points ${made ? "" : ""}`);
  } },
  { id: "sample", title: "A sample of the compendium drops onto an actor", run: async () => {
    const actor = await Actor.create({ name: `${TEMP}Sample`, type: "character" });
    const packs = ["feats", "class-features", "racial-features", "items", "backgrounds"].map((n) => game.packs.get(`${MODULE_ID}.${n}`)).filter(Boolean);
    const picks = []; for (const p of packs) { const idx = [...(await p.getIndex())]; for (let i = 0; i < 12 && idx.length; i++) picks.push([p, idx.splice(Math.floor(Math.random() * idx.length), 1)[0]]); }
    const bad = []; for (const [p, e] of picks) { try { const d = await p.getDocument(e._id); await actor.createEmbeddedDocuments("Item", [d.toObject()]); } catch (err) { bad.push(`${e.name}: ${String(err.message).slice(0, 60)}`); } }
    return bad.length ? fail(`${bad.length} of ${picks.length} failed: ${bad.slice(0, 3).join(" | ")}`) : pass(`${picks.length} random documents from ${packs.length} compendiums`);
  } },
  { id: "falling", title: "Falling damage", run: async () => {
    const actor = await Actor.create({ name: `${TEMP}Faller`, type: "character", system: { attributes: { hp: { value: 80, max: 80 } } } });
    const scene = await Scene.create({ name: `${TEMP}Scene`, width: 1000, height: 1000, grid: { size: 100 } });
    const [tok] = await scene.createEmbeddedDocuments("Token", [{ name: "Faller", actorId: actor.id, actorLink: true, x: 100, y: 100 }]);
    const hp0 = actor.system.attributes.hp.value; await game.op5eFalling.fall([tok], 40); await wait(600);
    const a = game.actors.get(actor.id), hurt = a.system.attributes.hp.value < hp0, prone = a.statuses.has("prone");
    const none = (() => { const v = actor.system.attributes.hp.value; return v; })(); void none;
    return hurt && prone ? pass(`40 ft: ${hp0 - a.system.attributes.hp.value} damage and prone`) : fail(`damage ${hurt}, prone ${prone}`);
  } },
  { id: "conditional", title: "Conditional effects switch on and off", run: async () => {
    const actor = await Actor.create({ name: `${TEMP}Conditional`, type: "character", system: { abilities: { str: { value: 16 } } } });
    const [fx] = await actor.createEmbeddedDocuments("ActiveEffect", [{ name: "check", disabled: true, changes: [{ key: "system.bonuses.mwak.damage", mode: 2, value: "2" }], flags: { op5e: { condition: "@abilities.str.value < 10" } } }]);
    await actor.update({ "system.abilities.str.value": 8 }); await game.op5eConditions.refresh(actor); const on = !actor.effects.get(fx.id).disabled;
    await actor.update({ "system.abilities.str.value": 16 }); await game.op5eConditions.refresh(actor); const off = actor.effects.get(fx.id).disabled;
    return on && off ? pass() : fail(`on ${on}, off ${off}`);
  } },
  { id: "auras", title: "Token auras (Aura Effects)", run: async () => {
    if (!game.modules.get("auraeffects")?.active) return skip("Aura Effects is not active");
    const actor = await Actor.create({ name: `${TEMP}Aura`, type: "character" });
    const pack = game.packs.get(`${MODULE_ID}.class-features`), e = [...(await pack.getIndex())].find((x) => x.name === "Aura of Courage"); if (!e) return skip("Aura of Courage is not in the compendium");
    const [item] = await actor.createEmbeddedDocuments("Item", [(await pack.getDocument(e._id)).toObject()]); await wait(1500);
    const fx = [...game.actors.get(actor.id).items.get(item.id).effects].find((x) => x.flags?.op5e?.aura);
    return fx ? pass("the aura effect was created on the feature") : fail("no aura effect appeared");
  } },
];

const ICON = { pass: "fa-circle-check", warn: "fa-triangle-exclamation", fail: "fa-circle-xmark", info: "fa-circle-info", skip: "fa-forward", wait: "fa-circle", run: "fa-spinner fa-spin" };
const esc = (t) => foundry.utils.escapeHTML(String(t ?? ""));

class HealthCheckApp extends foundry.applications.api.ApplicationV2 {
  static DEFAULT_OPTIONS = { id: "op5e-health-check", classes: ["op5e-health"], window: { title: "OP5e health check", icon: "fa-solid fa-heart-pulse", resizable: true }, position: { width: 620, height: 640 } };
  tab = "health"; running = false; rows = []; message = "Press Quick checks (read-only, a few seconds) or Deep checks (temporary documents, a few minutes).";
  ship = null; shipError = null; timer = null;
  async _renderHTML() { return null; }
  _replaceHTML(_r, content) {
    const counts = this.rows.reduce((c, r) => ((c[r.status] = (c[r.status] ?? 0) + 1), c), {});
    const done = this.rows.filter((r) => !["wait", "run"].includes(r.status)).length, pct = this.rows.length ? Math.round((100 * done) / this.rows.length) : 0;
    const summary = this.rows.length && done === this.rows.length ? `${counts.pass ?? 0} passed${counts.warn ? `, ${counts.warn} warning${counts.warn > 1 ? "s" : ""}` : ""}${counts.fail ? `, ${counts.fail} failed` : ""}${counts.info ? `, ${counts.info} for your information` : ""}${counts.skip ? `, ${counts.skip} skipped` : ""}` : "";
    const rows = this.rows.map((r) => `<li class="${r.status}"><i class="fa-solid ${ICON[r.status]}"></i><div><b>${esc(r.title)}</b>${r.detail ? `<small>${esc(r.detail)}</small>` : ""}</div></li>`).join("");
    const health = `<div class="op5e-hc-bar"><button data-act="quick" ${this.running ? "disabled" : ""}><i class="fa-solid fa-bolt"></i> Quick checks</button><button data-act="deep" ${this.running ? "disabled" : ""}><i class="fa-solid fa-flask"></i> Deep checks</button><button data-act="copy" ${this.rows.length ? "" : "disabled"}><i class="fa-solid fa-copy"></i> Copy report</button></div>
      ${this.running || this.rows.length ? `<progress max="100" value="${pct}"></progress>` : ""}
      <p class="op5e-hc-msg ${counts.fail ? "fail" : ""}">${esc(summary || this.message)}</p><ul class="op5e-hc-rows">${rows}</ul>`;
    content.innerHTML = `<section class="op5e-hc"><nav class="op5e-hc-tabs"><a data-tab="health" class="${this.tab === "health" ? "active" : ""}">Health check</a><a data-tab="ship" class="${this.tab === "ship" ? "active" : ""}">Ship check (developer)</a></nav>${this.tab === "health" ? health : this.shipHtml()}</section>`;
    content.querySelectorAll("[data-tab]").forEach((a) => a.addEventListener("click", () => this.switch(a.dataset.tab)));
    content.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => this.act(b.dataset.act)));
  }
  shipHtml() {
    if (this.shipError) return `<p class="op5e-hc-msg">${esc(this.shipError)}</p><div class="op5e-hc-bar"><button data-act="ship-refresh">Try again</button></div>`;
    const s = this.ship; if (!s) return `<p class="op5e-hc-msg">Loading...</p>`;
    if (!s.available) return `<p class="op5e-hc-msg">The full ship check is a developer tool. It is available here when the update helper runs from the OP5e repository on the Foundry host (node scripts/update-helper.mjs).</p>`;
    const done = s.stages.filter((x) => x.status === "pass" || x.status === "fail").length, pct = Math.round((100 * done) / s.stages.length);
    const rows = s.stages.map((x) => `<li class="${x.status}"><i class="fa-solid ${x.status === "pass" ? ICON.pass : x.status === "fail" ? ICON.fail : x.status === "run" ? ICON.run : ICON.wait}"></i><div><b>${esc(x.name)}</b><small>${esc(x.what)}${x.minutes != null ? ` · ${x.minutes} min` : ""}</small></div></li>`).join("");
    const state = s.running ? "Running..." : s.stopped ? `Stopped at "${esc(s.stopped)}".` : done === s.stages.length ? "All automated stages passed." : s.at ? `Last run ${new Date(s.at).toLocaleString()}.` : "Never run on this machine.";
    return `<div class="op5e-hc-bar">${s.running ? `<button data-act="ship-stop"><i class="fa-solid fa-stop"></i> Stop</button>` : `<button data-act="ship-start"><i class="fa-solid fa-play"></i> Run the full ship check</button>`}<button data-act="ship-refresh"><i class="fa-solid fa-rotate"></i> Refresh</button></div>
      <progress max="100" value="${pct}"></progress><p class="op5e-hc-msg">${state} ${done}/${s.stages.length} stages.${s.running ? " It takes about an hour; you can keep this window open or close it." : ""}</p>
      <ul class="op5e-hc-rows">${rows}</ul>${s.log?.length ? `<pre class="op5e-hc-log">${esc(s.log.join("\n"))}</pre>` : ""}`;
  }
  async switch(tab) { this.tab = tab; if (tab === "ship") await this.loadShip(); this.render(); if (tab !== "ship") this.stopPoll(); }
  async loadShip() { try { this.ship = await helper("/ship"); this.shipError = null; } catch (e) { this.shipError = `The update helper is not reachable (${e.message}). Start it with: node scripts/update-helper.mjs on the Foundry host, and set its URL and token in the OP5e settings.`; } this.poll(); }
  poll() { this.stopPoll(); if (this.tab === "ship" && this.ship?.running) this.timer = setInterval(async () => { await this.loadShip(); this.render(); if (!this.ship?.running) this.stopPoll(); }, 4000); }
  stopPoll() { if (this.timer) clearInterval(this.timer); this.timer = null; }
  async close(o) { this.stopPoll(); return super.close(o); }
  async act(a) {
    if (a === "quick") return this.run(QUICK, false);
    if (a === "deep") return this.run(DEEP, true);
    if (a === "copy") { await game.clipboard.copyPlainText(`OP5e health check ${new Date().toISOString()}\n` + this.rows.map((r) => `[${r.status}] ${r.title}${r.detail ? ": " + r.detail : ""}`).join("\n")); return ui.notifications.info("Report copied."); }
    if (a === "ship-refresh") { await this.loadShip(); return this.render(); }
    if (a === "ship-start") { try { await helper("/ship/start", { method: "POST" }); } catch (e) { ui.notifications.error(e.message); } await this.loadShip(); return this.render(); }
    if (a === "ship-stop") { if (!(await foundry.applications.api.DialogV2.confirm({ window: { title: "Stop the ship check" }, content: "<p>Stop the running ship check? You can start it again; finished stages are kept in the report.</p>" }))) return; try { await helper("/ship/stop", { method: "POST" }); } catch (e) { ui.notifications.error(e.message); } await this.loadShip(); return this.render(); }
  }
  async run(list, deep) {
    if (this.running) return;
    this.running = true; this.rows = list.map((c) => ({ title: c.title, status: "wait", detail: "" })); this.message = ""; this.render();
    if (deep) { await cleanup(); this.message = ""; }
    for (let i = 0; i < list.length; i++) {
      this.rows[i].status = "run"; this.render();
      try { const r = await list[i].run(); Object.assign(this.rows[i], r); } catch (e) { Object.assign(this.rows[i], fail(String(e.message ?? e).slice(0, 200))); }
      this.render();
    }
    if (deep) { this.rows.push({ title: "Temporary documents removed", status: "run", detail: "" }); this.render(); await cleanup(); Object.assign(this.rows.at(-1), pass()); }
    this.running = false; this.render();
  }
}

export function registerHealthCheck() {
  game.op5eHealth = { open: () => new HealthCheckApp().render({ force: true }), QUICK, DEEP, HealthCheckApp, cleanup };
  Hooks.on("renderSettings", (_app, html) => {
    if (!game.user.isGM) return;
    const root = html instanceof HTMLElement ? html : html[0];
    if (root.querySelector(".op5e-health-open")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "op5e-health-open"; b.innerHTML = '<i class="fa-solid fa-heart-pulse"></i> OP5e health check';
    b.addEventListener("click", () => game.op5eHealth.open());
    (root.querySelector("section.info") ?? root.querySelector(".settings-sidebar") ?? root).append(b);
  });
}

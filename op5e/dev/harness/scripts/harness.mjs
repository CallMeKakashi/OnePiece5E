// game.op5eHarness — programmatic test API. Everything it creates carries flags.op5e-harness.test so cleanup is exact.
const FLAG = ["op5e", "harnessTest"];
const errors = [];
const origError = console.error.bind(console);
console.error = (...a) => { errors.push(a.map((x) => x?.stack ?? x?.message ?? String(x)).join(" ")); origError(...a); };
window.addEventListener("error", (e) => errors.push(`window: ${e.message}`));
window.addEventListener("unhandledrejection", (e) => errors.push(`rejection: ${e.reason?.stack ?? e.reason}`));

const tag = (d) => foundry.utils.mergeObject(d, { flags: { op5e: { harnessTest: true } } });
const isTest = (d) => d.getFlag(...FLAG) === true;

const H = {
  assert(cond, msg) { if (!cond) throw new Error(`ASSERT: ${msg}`); return true; },
  getConsoleErrors: () => [...errors],
  clearConsoleErrors: () => { errors.length = 0; },

  async resetWorld() {
    await H.cleanup();
    for (const s of game.scenes.filter(isTest)) await s.delete();
    for (const a of game.actors.filter((a) => a.name.startsWith("[T] "))) await a.delete();
    H.clearConsoleErrors();
  },
  async cleanup() {
    for (const a of game.actors.filter(isTest)) await a.delete();
    for (const i of game.items.filter(isTest)) await i.delete();
    for (const m of game.messages.filter(isTest)) await m.delete();
  },
  loadCompendium: async (id) => (await game.packs.get(id)?.getDocuments()) ?? [],
  packsLoaded: () => game.packs.filter((p) => p.collection.startsWith("op5e.")).map((p) => ({ id: p.collection, count: p.index.size })),

  async createActor({ name = "Tester", type = "character", abilities = {}, hp, level, ac } = {}) {
    const system = { abilities: Object.fromEntries(Object.entries(abilities).map(([k, v]) => [k, { value: v }])) };
    if (hp) system.attributes = { hp: { value: hp, max: hp } };
    const a = await Actor.create(tag({ name: `[T] ${name}`, type, system }));
    if (hp) await a.update({ "system.attributes.hp": { value: hp, max: hp } });
    return a;
  },
  deleteActor: (a) => a.delete(),
  createItem: (data) => Item.create(tag(data)),
  async giveItem(actor, uuidOrData) {
    const src = typeof uuidOrData === "string" ? (await fromUuid(uuidOrData))?.toObject() : uuidOrData;
    H.assert(src, `item not found: ${uuidOrData}`);
    const [it] = await actor.createEmbeddedDocuments("Item", [src]);
    return it;
  },
  equipItem: (item) => item.update({ "system.equipped": true }),

  async createToken(actor, { x = 1000, y = 1000, scene } = {}) {
    scene ??= game.scenes.find(isTest) ?? (await Scene.create(tag({ name: "[T] Scene", width: 4000, height: 3000, grid: { size: 100 } })));
    if (canvas.scene?.id !== scene.id) await scene.view();
    const [t] = await scene.createEmbeddedDocuments("Token", [{ ...(await actor.getTokenDocument({ x, y })).toObject() }]);
    return t;
  },
  targetToken(token) { token.object?.setTarget(true, { releaseOthers: true, groupSelection: false }); return token; },

  findActivity(item, key) {
    const acts = item.system.activities;
    return acts.get(key) ?? acts.find((a) => a.type === key || a.name === key);
  },
  async executeActivity(item, key, { configure = false } = {}) {
    const act = H.findActivity(item, key);
    H.assert(act, `activity ${key} not on ${item.name}`);
    return act.use({ create: { measuredTemplate: false } }, { configure }, { create: true });
  },
  async rollAttack(item, key = "attack") { const a = H.findActivity(item, key); return a.rollAttack({}, { configure: false }, {}); },
  async rollDamage(item, key = "attack", opts = {}) { const a = H.findActivity(item, key); return a.rollDamage(opts, { configure: false }, {}); },
  rollSave: (actor, ability, opts = {}) => actor.rollSavingThrow({ ability, ...opts }, { configure: false }, {}),

  getActorData: (a) => a.toObject(),
  getItemData: (i) => i.toObject(),
  getEffects: (a) => a.appliedEffects.map((e) => ({ name: e.name, changes: e.changes, statuses: [...e.statuses], duration: e.duration?.remaining })),
  getHP: (a) => ({ value: a.system.attributes.hp.value, max: a.system.attributes.hp.max, temp: a.system.attributes.hp.temp }),
  getResources: (a) => ({ items: a.items.filter((i) => i.system.uses?.max).map((i) => ({ name: i.name, value: i.system.uses.value, max: i.system.uses.max })), spells: a.system.spells }),
  getChatMessages: (n = 10) => game.messages.contents.slice(-n).map((m) => ({ speaker: m.speaker?.alias, content: m.content?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), rolls: m.rolls.map((r) => ({ formula: r.formula, total: r.total })) })),
  async advanceTime(seconds) { await game.time.advance(seconds); },
};

Hooks.once("ready", () => { game.op5eHarness = H; console.log("op5e-harness ready"); });

import { MODULE_ID, MODULE_VERSION } from "./constants.mjs";
import { AA_MENUS, mergeAutorec, dropInvalidOp5e, isUuid4 } from "./animations-lib.mjs";

function hasSequencer() {
  return !!globalThis.Sequencer?.Database && !!globalThis.Sequence;
}

function getFlag(item) {
  return item?.flags?.op5eAnimations ?? null;
}

function dbFirst(paths) {
  for (const p of paths) {
    try {
      if (globalThis.Sequencer?.Database?.entryExists?.(p)) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

function inferWeaponFile(kind) {
  switch (kind) {
    case "melee":
      return dbFirst([
        "jb2a.melee_attack.slash.01.white",
        "jb2a.melee_attack.slash.white",
        "jb2a.melee_attack.slash.01",
        "jb2a.melee_attack.slash",
      ]);
    case "unarmed":
      return dbFirst([
        "jb2a.unarmed_strike.01.white",
        "jb2a.unarmed_strike.white",
        "jb2a.unarmed_strike.01",
        "jb2a.unarmed_strike",
      ]);
    case "thrown":
      return dbFirst([
        "jb2a.throwing_knife.01.white",
        "jb2a.throwing_knife.white",
        "jb2a.throwing_knife",
        "jb2a.arrow.physical.white",
        "jb2a.arrow.physical",
      ]);
    case "arrow":
      return dbFirst([
        "jb2a.arrow.physical.white",
        "jb2a.arrow.physical",
        "jb2a.arrow.01.white",
        "jb2a.arrow.01",
      ]);
    case "bolt":
      return dbFirst([
        "jb2a.bolt.physical.white",
        "jb2a.bolt.physical",
        "jb2a.arrow.physical.white",
        "jb2a.arrow.physical",
      ]);
    case "bullet":
      return dbFirst([
        "jb2a.bullet.01.white",
        "jb2a.bullet.white",
        "jb2a.bullet.01",
        "jb2a.bullet",
      ]);
    default:
      return null;
  }
}

function inferSpellFile(kind, element) {
  const e = element ?? "force";

  if (kind === "spell-utility" || kind === "spell-aura") {
    return dbFirst([
      "jb2a.magic_signs.circle.02.divination.loop.blue",
      "jb2a.magic_signs.circle.02.evocation.loop.red",
      "jb2a.magic_signs.circle.02.conjuration.loop.green",
      "jb2a.magic_signs.circle.02",
      "jb2a.magic_signs.circle",
    ]);
  }

  if (kind === "spell-beam") {
    return dbFirst([
      `jb2a.lighting_bolt.line.${e}`,
      `jb2a.lightning_bolt.line.${e}`,
      "jb2a.lightning_bolt.line.blue",
      "jb2a.ray_of_frost.blue",
      "jb2a.eldritch_blast.purple",
    ]);
  }

  if (kind === "spell-burst") {
    return dbFirst([
      `jb2a.explosion.${e}`,
      "jb2a.fireball.explosion.orange",
      "jb2a.thunderwave.center.blue",
      "jb2a.ice_explosion.blue",
      "jb2a.explosion.01.orange",
      "jb2a.explosion",
    ]);
  }

  if (e === "fire") {
    return dbFirst(["jb2a.fire_bolt.orange", "jb2a.scorching_ray.orange", "jb2a.fireball.beam.orange"]);
  }
  if (e === "cold") {
    return dbFirst(["jb2a.ray_of_frost.blue", "jb2a.ice_knife.blue", "jb2a.ice_spike.blue"]);
  }
  if (e === "lightning" || e === "thunder") {
    return dbFirst(["jb2a.chain_lightning.primary.blue", "jb2a.lightning_bolt.line.blue", "jb2a.lightning_strike.blue"]);
  }
  if (e === "acid" || e === "poison") {
    return dbFirst(["jb2a.acid_splash.green", "jb2a.poison_spray.green", "jb2a.breath_weapon.acid.green"]);
  }
  if (e === "radiant") {
    return dbFirst(["jb2a.guiding_bolt.yellow", "jb2a.divine_smite.yellow", "jb2a.sunbeam.yellow"]);
  }
  if (e === "necrotic") {
    return dbFirst(["jb2a.eldritch_blast.purple", "jb2a.necromancy.projectile.purple", "jb2a.magic_missile.purple"]);
  }

  return dbFirst([
    "jb2a.magic_missile.blue",
    "jb2a.magic_missile",
    "jb2a.eldritch_blast.purple",
    "jb2a.fire_bolt.orange",
  ]);
}

async function playAnimation({ item, token, targets }) {
  if (!hasSequencer()) return;
  if (!item || !token) return;

  const flag = getFlag(item);
  if (!flag?.kind) return;

  const isSpell = item.type === "spell";
  const file = isSpell
    ? inferSpellFile(flag.kind, flag.element)
    : inferWeaponFile(flag.kind);

  if (!file) return;

  const t = targets?.first?.() ?? targets?.[0] ?? null;
  const seq = new globalThis.Sequence();

  if (
    t &&
    (flag.kind === "arrow" ||
      flag.kind === "bolt" ||
      flag.kind === "bullet" ||
      flag.kind === "thrown" ||
      flag.kind === "spell-projectile" ||
      flag.kind === "spell-beam")
  ) {
    seq.effect().file(file).atLocation(token).stretchTo(t, { cacheLocation: true }).belowTokens(false);
  } else {
    seq.effect().file(file).atLocation(token).scale(0.9).belowTokens(false);
  }

  try {
    await seq.play();
  } catch (err) {
    console.warn(`${MODULE_ID} | animation playback failed`, err);
  }
}

function registerMidiQolHook() {
  if (!globalThis.Hooks) return;

  globalThis.Hooks.on("midi-qol.RollComplete", async (workflow) => {
    try {
      await playAnimation({
        item: workflow?.item,
        token: workflow?.token,
        targets: workflow?.targets,
      });
    } catch (err) {
      console.warn(`${MODULE_ID} | midi-qol.RollComplete handler failed`, err);
    }
  });
}

export function initOp5eAnimations() {
  if (!hasSequencer()) {
    console.warn(`${MODULE_ID} | Sequencer missing; OP5e animations disabled`);
    return;
  }
  registerMidiQolHook();
}

// Automated Animations autorec merge (issue #29). Pure logic lives in animations-lib.mjs.
const AUTOREC_ENABLED = "animationsAutorec";
const AUTOREC_VERSION = "animationsAutorecVersion";

const modActive = (id) => !!game.modules.get(id)?.active;

/** Merge assets/autorec-op5e.json into Automated Animations' menus (GM only, once per op5e version). */
export async function mergeOp5eAutorec({ force = false } = {}) {
  if (!game.user.isGM) return null;
  if (!force && !game.settings.get(MODULE_ID, AUTOREC_ENABLED)) return null;
  if (!modActive("autoanimations") || !modActive("dnd5e-animations")) return null;
  if (!force && game.settings.get(MODULE_ID, AUTOREC_VERSION) === MODULE_VERSION) return null;

  const isRegistered = (m) => game.settings.settings.has(`autoanimations.aaAutorec-${m}`);
  // repair first: an earlier build wrote entries with ids Automated Animations rejects, which makes it stop loading its menus (only "melee" registers)
  const present = AA_MENUS.filter(isRegistered);
  const fixed = dropInvalidOp5e(Object.fromEntries(present.map((m) => [m, game.settings.get("autoanimations", `aaAutorec-${m}`) ?? []])));
  for (const m of fixed.changed) await game.settings.set("autoanimations", `aaAutorec-${m}`, fixed.menus[m]);
  if (fixed.removed) { ui.notifications.warn(`OP5e removed ${fixed.removed} animation entries that Automated Animations could not read. Reload the world (F5) to finish repairing it.`); return null; }
  if (present.length < AA_MENUS.length) { console.warn(`${MODULE_ID} | Automated Animations has only registered ${present.join(", ") || "no"} autorec menus; autorec merge skipped`); return null; }

  try {
    const res = await fetch(`modules/${MODULE_ID}/assets/autorec-op5e.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const incoming = await res.json();
    const current = Object.fromEntries(AA_MENUS.map((m) => [m, game.settings.get("autoanimations", `aaAutorec-${m}`) ?? []]));
    const bad = Object.values(incoming).filter(Array.isArray).flat().filter((e) => !isUuid4(e.id));
    if (bad.length) throw new Error(`${bad.length} OP5e entries have ids Automated Animations cannot read; regenerate assets/autorec-op5e.json`);
    const { menus, added, changed } = mergeAutorec(current, incoming);
    for (const m of changed) await game.settings.set("autoanimations", `aaAutorec-${m}`, menus[m]);
    await game.settings.set(MODULE_ID, AUTOREC_VERSION, MODULE_VERSION);
    const msg = `${MODULE_ID} | Automated Animations: added ${added} OP5e autorec entries (${changed.join(", ") || "none"}).`;
    console.log(msg);
    if (added) ui.notifications.info(msg);
    return { added, changed };
  } catch (err) {
    console.warn(`${MODULE_ID} | autorec merge failed`, err);
    return null;
  }
}

/** Call from the `init` hook: registers settings and schedules the merge on `ready`. */
export function registerOp5eAnimationsAutorec() {
  game.settings.register(MODULE_ID, AUTOREC_ENABLED, {
    name: `${MODULE_ID}.settings.animationsAutorec.name`,
    hint: `${MODULE_ID}.settings.animationsAutorec.hint`,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });
  game.settings.register(MODULE_ID, AUTOREC_VERSION, { scope: "world", config: false, type: String, default: "" });
  Hooks.once("ready", () => mergeOp5eAutorec());
}

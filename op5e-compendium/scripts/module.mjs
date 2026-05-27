const MODULE_ID = "op5e-compendium";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing One Piece 5e Compendium`);

  game.settings.register(MODULE_ID, "critMaxPlusRoll", {
    name: "Critical Damage: Max + Roll",
    hint: "When enabled, critical hit damage adds the maximum of the extra critical dice instead of rolling them (max extra dice + normal roll).",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  CONFIG.DND5E.sourceBooks ??= {};
  CONFIG.DND5E.sourceBooks.OP5e = {
    label: "One Piece 5e",
    abbreviation: "OP5e",
  };
});

Hooks.on("dnd5e.preRollDamageV2", (_item, config) => {
  try {
    if (!game.settings.get(MODULE_ID, "critMaxPlusRoll")) return;
    if (!config || typeof config !== "object") return;

    const enablePowerfulCrit = (opts) => {
      if (!opts || typeof opts !== "object") return;
      if (opts.isCritical !== true) return;
      opts.critical ??= {};
      if (opts.critical && typeof opts.critical === "object") {
        // Force "max extra dice + normal roll" by ensuring the multiplier does not add extra dice.
        // DamageRoll.configureDamage will still add a flat maximized bonus when powerfulCritical is enabled.
        opts.critical.multiplier = 1;
        opts.critical.powerfulCritical = true;
      }
    };

    // Process-level
    enablePowerfulCrit(config);

    // Per-roll configs
    if (Array.isArray(config.rolls)) {
      for (const roll of config.rolls) {
        if (!roll || typeof roll !== "object") continue;
        roll.options ??= {};
        enablePowerfulCrit(roll.options);
      }
    }
  } catch (err) {
    console.error(`${MODULE_ID} | crit damage override failed`, err);
  }
});

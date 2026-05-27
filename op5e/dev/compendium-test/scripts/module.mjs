import { runCritDamageTests } from "./crit-damage-tests.mjs";

const MODULE_ID = "op5e-compendium-test";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "autoRunCritTests", {
    name: "Auto-run crit damage tests on world ready",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
});

Hooks.once("ready", () => {
  game.op5eCompendiumTest = {
    runCritDamageTests: () => runCritDamageTests(),
    runCritConfigureDamageTest: () => import("./crit-damage-tests.mjs").then(m => m.runCritConfigureDamageTest()),
    runCritDamageRollBuildTest: () => import("./crit-damage-tests.mjs").then(m => m.runCritDamageRollBuildTest()),
    runCritVanillaContrastTest: () => import("./crit-damage-tests.mjs").then(m => m.runCritVanillaContrastTest()),
  };

  if (game.settings.get(MODULE_ID, "autoRunCritTests")) {
    runCritDamageTests();
  }
});

Hooks.on("renderActorDirectory", (_app, html) => {
  if (!game.user?.isGM) return;

  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root || root.querySelector(".op5e-comp-test-launch")) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "op5e-comp-test-launch";
  btn.innerHTML = `<i class="fas fa-vial"></i> Test OP5e Crit`;
  btn.title = "Run OP5e critical damage tests (1d6+6 must not become 2d6)";
  btn.addEventListener("click", () => runCritDamageTests());

  const header =
    root.querySelector(".directory-header .header-actions") ??
    root.querySelector(".header-actions") ??
    root.querySelector(".directory-header") ??
    root;
  header.prepend(btn);
});

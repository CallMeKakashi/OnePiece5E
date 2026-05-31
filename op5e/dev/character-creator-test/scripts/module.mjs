import { installMockCompendiumPacks } from "./mock-compendium.mjs";
import { runAllTests, runWizardFormTest, runWizardSubmitApiTest } from "./test-harness.mjs";

const MODULE_ID = "op5e-character-creator-test";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "autoRunTests", {
    name: "Auto-run wizard tests on world ready",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });
});

Hooks.once("ready", () => {
  installMockCompendiumPacks();

  game.op5eCharacterCreatorTest = {
    runAll: () => runAllTests(),
    runWizardFormTest: () => runWizardFormTest(),
    runWizardSubmitApiTest: () => runWizardSubmitApiTest(),
    launchWizard: () => game.op5eCharacterCreator?.launch?.()
  };

  if (game.settings.get(MODULE_ID, "autoRunTests")) {
    runAllTests();
  }
});

Hooks.on("renderActorDirectory", (_app, html) => {
  if (!game.user?.isGM) return;

  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root || root.querySelector(".op5e-cc-test-launch")) return;

  const wrap = document.createElement("div");
  wrap.className = "op5e-cc-test-launch";
  wrap.style.display = "inline-flex";
  wrap.style.gap = "4px";

  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.innerHTML = `<i class="fas fa-vial"></i> Test CC Wizard`;
  runBtn.title = "Run OP5e Character Creator wizard tests (mock compendium)";
  runBtn.addEventListener("click", () => runAllTests());

  const openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.innerHTML = `<i class="fas fa-hat-wizard"></i> Open CC (mock)`;
  openBtn.title = "Open wizard with mock compendium data";
  openBtn.addEventListener("click", () => {
    installMockCompendiumPacks();
    game.op5eCharacterCreator?.launch?.();
  });

  wrap.append(runBtn, openBtn);

  const header =
    root.querySelector(".directory-header .header-actions") ??
    root.querySelector(".header-actions") ??
    root.querySelector(".directory-header") ??
    root;
  header.prepend(wrap);
});

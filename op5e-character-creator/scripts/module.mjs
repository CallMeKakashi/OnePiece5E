import { registerSettings } from "./settings.mjs";
import { OP5eCharacterCreatorWizard } from "./wizard/WizardApp.mjs";

Hooks.once("init", () => {
  registerSettings();

  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("inc", (n) => Number(n ?? 0) + 1);
});

Hooks.once("ready", () => {
  // Provide a stable API surface for macros and other modules.
  game.op5eCharacterCreator = {
    WizardApp: OP5eCharacterCreatorWizard,
    launch: () => OP5eCharacterCreatorWizard.launch(),
  };
});

Hooks.on("renderActorDirectory", (_app, html) => {
  // Simple launch point: a header button in the Actors sidebar.
  const canCreate = game.user?.isGM || game.user?.role >= CONST.USER_ROLES.PLAYER;
  if (!canCreate) return;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("op5e-cc-launch");
  button.innerHTML = `<i class="fas fa-hat-wizard"></i> OP5e Creator`;
  button.addEventListener("click", () => OP5eCharacterCreatorWizard.launch());

  const header = html[0]?.querySelector(".directory-header .header-actions");
  if (header) header.prepend(button);
});


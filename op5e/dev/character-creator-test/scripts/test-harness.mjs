import { installMockCompendiumPacks } from "./mock-compendium.mjs";

const MODULE_ID = "op5e-character-creator-test";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getWizardClass() {
  return game.op5eCharacterCreator?.WizardApp;
}

async function clearDrafts() {
  await game.settings.set("op5e", "drafts", {});
}

async function waitForRender(app, ms = 250) {
  await sleep(ms);
  assert(app.rendered, "Wizard did not render.");
}

export async function runWizardFormTest() {
  installMockCompendiumPacks();

  const Wizard = getWizardClass();
  assert(Wizard, "game.op5eCharacterCreator.WizardApp is unavailable. Enable op5e.");

  await clearDrafts();
  const app = await Wizard.launch();
  await waitForRender(app);

  assert(app.form instanceof HTMLFormElement, `Expected app.form to be HTMLFormElement, got ${app.form}`);

  const nameInput = app.element.querySelector('input[name="name"]');
  assert(nameInput, "Name input not found on first step.");
  nameInput.value = "Test Pirate";
  nameInput.dispatchEvent(new Event("input", { bubbles: true }));

  const nextBtn = app.element.querySelector('[data-action="next"]');
  assert(nextBtn, "Next button not found.");
  nextBtn.click();

  await sleep(400);

  const draft = Object.values(game.settings.get("op5e", "drafts") ?? {})[0];
  assert(draft?.step === "images", `Expected step "images" after Next, got "${draft?.step}".`);
  assert(draft?.data?.name === "Test Pirate", `Name not persisted; got "${draft?.data?.name}".`);

  app.close();
  return {
    passed: true,
    message: "Wizard Next persisted name and advanced to images without form/submit errors."
  };
}

export async function runWizardSubmitApiTest() {
  installMockCompendiumPacks();

  const Wizard = getWizardClass();
  assert(Wizard, "game.op5eCharacterCreator.WizardApp is unavailable.");

  await clearDrafts();
  const app = await Wizard.launch();
  await waitForRender(app);

  assert(app.form instanceof HTMLFormElement, "app.form must exist for programmatic submit support.");

  let submitError = null;
  try {
    await app.submit();
  } catch (err) {
    submitError = err;
  }

  assert(!submitError, `app.submit() threw: ${submitError?.message ?? submitError}`);

  app.close();
  return {
    passed: true,
    message: "ApplicationV2.submit() works with window.contentTag form configuration."
  };
}

export async function runAllTests() {
  const results = [];
  const tests = [
    ["Wizard form + Next", runWizardFormTest],
    ["ApplicationV2.submit()", runWizardSubmitApiTest]
  ];

  for (const [label, fn] of tests) {
    try {
      const result = await fn();
      results.push({ label, ok: true, message: result.message });
      ui.notifications?.info(`${MODULE_ID}: PASS — ${label}`);
      console.log(`${MODULE_ID} | PASS — ${label}: ${result.message}`);
    } catch (err) {
      results.push({ label, ok: false, message: err.message ?? String(err) });
      ui.notifications?.error(`${MODULE_ID}: FAIL — ${label}: ${err.message ?? err}`);
      console.error(`${MODULE_ID} | FAIL — ${label}`, err);
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const summary = `${passed}/${results.length} tests passed`;
  ui.notifications?.info(`${MODULE_ID}: ${summary}`);
  console.table(results);
  return { summary, results };
}

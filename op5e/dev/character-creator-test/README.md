# OP5e Character Creator — Test Harness

Dev-only Foundry v13 module that **stubs `op5e-compendium` packs** and validates the Character Creator wizard without installing the full compendium module.

## What it validates

1. **Wizard form + Next** — `app.form` exists, Next persists the name field, step advances to `images` (no `submit()` / top-level form error).
2. **ApplicationV2.submit()** — programmatic submit works with `window.contentTag: "form"`.

## Prerequisites

- Foundry v13 world using **dnd5e**
- **op5e-character-creator** installed and enabled (localhost manifest below)
- **op5e-compendium is not required** — this module patches `game.packs.get` with mock entries

## Install

1. Serve this module:

   ```bash
   cd op5e-character-creator-test
   npm install
   npm run package
   npm run serve
   ```

2. In Foundry **Setup → Install Module**, paste:

   ```
   http://localhost:8083/module.json
   ```

3. Enable **OP5e Character Creator** and **OP5e Character Creator — Test Harness** in your world.

## Run tests

### In-world (GM)

Open the **Actors** sidebar. Two extra buttons appear:

- **Test CC Wizard** — runs both automated tests; results in notifications + browser console
- **Open CC (mock)** — opens the wizard with mock compendium choices

### Console / macro

```js
await game.op5eCharacterCreatorTest.runAll();
// or individually:
await game.op5eCharacterCreatorTest.runWizardFormTest();
await game.op5eCharacterCreatorTest.runWizardSubmitApiTest();
await game.op5eCharacterCreatorTest.launchWizard();
```

### Auto-run on world load

**Settings → Configure Settings → OP5e Character Creator — Test Harness → Auto-run wizard tests on world ready**

## Port layout

| Module | Port | Manifest |
|--------|------|----------|
| op5e-compendium | 8080 | `http://localhost:8080/module.json` |
| op5e-character-creator | 8081 | `http://localhost:8081/module.json` |
| **op5e-character-creator-test** | **8083** | `http://localhost:8083/module.json` |

## Mock data

Stub packs (via `game.packs.get` override):

- `op5e-compendium.races` — 2 species
- `op5e-compendium.backgrounds` — 1 background + 1 role feat
- `op5e-compendium.classes` — 2 classes
- `op5e-compendium.feats` — 2 additional-power feats

`Actor.create` is **not** stubbed; Finish-step tests are out of scope for this harness.

# OP5e Compendium — Test Harness

Dev-only Foundry v13 module that **automates critical-damage verification** for `op5e-compendium` without manual attack rolls.

## What it validates

For weapon damage **`1d6+6`** on a critical hit:

| Mode | Expected |
|------|----------|
| **OP5e (default)** | Formula keeps **one** `1d6` (not `2d6`); flat max die bonus added |
| **Vanilla 5e** (compendium setting on) | `2d6` doubling (contrast test) |

Tests use dnd5e `DamageRoll.configureDamage` and `DamageRoll.build` with `isCritical: true`.

## Prerequisites

- Foundry v13 world using **dnd5e** 5.1.10+
- **op5e-compendium** installed and enabled

## Install

1. Serve compendium and test modules (two terminals):

   ```bash
   cd op5e-compendium
   npm run serve
   ```

   ```bash
   cd op5e-compendium-test
   npm install
   npm run package
   npm run serve
   ```

2. In Foundry **Setup → Install Module**, add:

   - `http://localhost:8080/module.json` (compendium)
   - `http://localhost:8084/module.json` (this harness)

3. Enable **One Piece 5e Compendium** and **OP5e Compendium — Test Harness** in your world.

## Run tests

### In-world (GM)

Open the **Actors** sidebar → **Test OP5e Crit** button. Results appear in notifications and the browser console.

### Console / macro

```js
await game.op5eCompendiumTest.runCritDamageTests();
```

### Auto-run on world load

**Settings → Configure Settings → OP5e Compendium — Test Harness → Auto-run crit damage tests on world ready**

## Port layout

| Module | Port | Manifest |
|--------|------|----------|
| op5e-compendium | 8080 | `http://localhost:8080/module.json` |
| op5e-character-creator | 8081 | `http://localhost:8081/module.json` |
| op5e-character-creator-test | 8083 | `http://localhost:8083/module.json` |
| **op5e-compendium-test** | **8084** | `http://localhost:8084/module.json` |

## Command-line tests (no Foundry)

Pure crit-config logic is also covered in the compendium package:

```bash
cd op5e-compendium
npm test
```

Expected: all tests pass (patch config, dice multiplier contract, formula assertions).

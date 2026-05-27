# Module Update Notifier

Foundry VTT v13 module that compares **installed** module versions against **remote manifest** versions and shows in-world notifications when an update is available.

Works for any installed module that declares a `manifest` URL in its `module.json` (stored on `game.modules.get(id)` as `manifest`).

## Features

- Checks on world ready and on a configurable interval (default 5 minutes)
- World settings: enable/disable, interval, GM-only vs all clients
- De-duplication: remembers the last notified remote version per module (client setting) so you are not spammed on every poll
- Uses Foundry APIs: `foundry.packages.Module.fromRemoteManifest()` and `foundry.utils.isNewerVersion()`
- Manual **Check now** toggle in module settings (GM)

## Port layout (localhost dev)

| Module | Serve port | Manifest URL |
|--------|------------|----------------|
| op5e-compendium | 8080 | `http://localhost:8080/module.json` |
| op5e-character-creator | 8081 | `http://localhost:8081/module.json` |
| **foundry-module-update-notifier** | **8082** | `http://localhost:8082/module.json` |

## Installation

### Option A: Symlink / copy (development)

Copy or symlink `foundry-module-update-notifier/` into `FoundryVTT/Data/modules/` so the folder name matches the module id:

```
Data/modules/foundry-module-update-notifier/
├── module.json
├── scripts/
└── lang/
```

Enable **Module Update Notifier** under **Settings → Manage Modules**.

### Option B: Install via manifest URL (localhost)

1. Package and serve:

   ```bash
   cd foundry-module-update-notifier
   npm install
   npm run package
   npm run serve
   ```

2. In Foundry **Setup**, choose **Install Module** and paste:

   ```
   http://localhost:8082/module.json
   ```

3. Install or update from **Setup → Update Modules** when you change versions.

## Module settings

Open **Settings → Configure Settings → Module Update Notifier**:

| Setting | Default | Description |
|---------|---------|-------------|
| Check for module updates | on | Master switch |
| Check interval (minutes) | 5 | Periodic re-check; `0` = only on world load + Check now |
| GM clients only | on | Only GM clients fetch manifests and see notifications |
| Check now | off | GM toggle to run an immediate check |

## How update detection works

1. Iterate `game.modules` (all installed modules).
2. Skip modules without a non-empty `manifest` URL (also checks `_source.manifest` and `flags.manifest`).
3. Fetch remote JSON via `foundry.packages.Module.fromRemoteManifest(url)`.
4. Compare `remote.version` vs installed `mod.version` with `foundry.utils.isNewerVersion(remote, installed)`.
5. If newer and not already notified for that remote version, show `ui.notifications.warn` and store the remote version in client setting `lastNotifiedVersions`.

## Manual test plan

1. **Install notifier** (symlink or `http://localhost:8082/module.json`), enable in a test world as GM.
2. **Baseline:** Open world — should run one check; no notifications if all modules are up to date.
3. **Simulate update:** In another module’s served `dist/module.json`, bump `version` (e.g. `0.1.0` → `0.1.1`) while Foundry still has the old version installed. Wait for interval or use **Check now**.
4. **Expect:** Warning notification with module title and version arrow; Setup → Update Modules should list the update.
5. **De-dupe:** Stay in world across two interval ticks — only one notification per remote version.
6. **After update:** Install update, reload — notification should stop until manifest version bumps again.
7. **GM-only:** With **GM clients only** on, connect as player — no checks/notifications. Turn off — players may see notifications on their clients.
8. **Interval 0:** Set interval to 0 — only checks on world load and Check now.

## License

Same as the Blood & Brine campaign vault (see repo root).

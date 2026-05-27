# One Piece 5e — Foundry Module (`op5e`)

Unified Foundry VTT v13 module for the **Blood & Brine** One Piece 5e homebrew: compendium packs, character creator wizard, OP5e critical-damage rules, and optional JB2A/Sequencer animations.

Replaces the separate **`op5e-compendium`** and **`op5e-character-creator`** modules (module id is now **`op5e`**).

## Requirements

- Foundry VTT v13+
- dnd5e system 5.1.10+
- **DAE** and **Midi-QoL** recommended for compendium automation
- **Sequencer** + **JB2A** free module (`JB2A_DnD5e`) optional for `flags.op5eAnimations` playback

## Installation

Symlink or copy this folder into Foundry’s `Data/modules/` as **`op5e`** (folder name must match module id):

```bash
# Windows (admin)
mklink /D "%LOCALAPPDATA%\FoundryVTT\Data\modules\op5e" "D:\Documents\GitHub\blood&brine\op5e"

# macOS / Linux
ln -s /path/to/blood\&brine/op5e ~/foundrydata/Data/modules/op5e
```

Enable **One Piece 5e (Blood & Brine)** in **Manage Modules**. No second OP5e module is required.

### Migrating from split modules

1. Disable and remove **`op5e-compendium`** and **`op5e-character-creator`** from `Data/modules/`.
2. Install **`op5e`** as above and enable it.
3. Compendium collections are now `op5e.classes`, `op5e.races`, etc. (was `op5e-compendium.*`). Re-import actors or update macros that referenced the old collection ids.
4. Character creator drafts were stored under module `op5e-character-creator` → setting `drafts`. New storage is module **`op5e`** → `drafts`. Copy the setting JSON in **Configure Settings** if you need to preserve in-progress drafts.

## Character creator

Open the **Actors** sidebar → **Create OPC** (wizard). API: `game.op5eCharacterCreator.launch()`.

## Build (compendium packs)

From this directory:

```bash
npm install
npm run build
```

On Windows, if the repo path contains `&`, npm’s `npx` shim may fail — this project’s `package.json` uses direct Node entrypoints:

```bash
node node_modules/tsx/dist/cli.mjs data/build.ts
node node_modules/tsx/dist/cli.mjs data/compile.ts
```

Package for local manifest hosting:

```bash
npm run package
npm run serve
# Foundry manifest URL: http://localhost:8080/module.json
```

## Tests

```bash
npm test
```

Foundry-only dev harnesses (crit damage UI test, wizard mock compendium) live under [`dev/`](./dev/).

## Layout

```
op5e/
├── module.json
├── scripts/
│   ├── compendium.mjs      # Berries, crit damage, dnd5e hooks
│   ├── character-creator.mjs
│   ├── animations.mjs      # Sequencer + Midi-QoL (optional)
│   └── wizard/
├── data/                   # TypeScript compendium build
├── packs/                  # Built LevelDB (gitignored)
├── templates/              # Creator wizard
└── dev/                    # Optional Foundry test modules
```

## License

Homebrew content for the Blood & Brine campaign. Not affiliated with Wizards of the Coast or Eiichiro Oda.

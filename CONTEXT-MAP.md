# Context map — Blood & Brine

This repo holds three loosely-related contexts sharing one git history. Read the glossary for the context you're working in.

| Context | Glossary | What |
|---------|----------|------|
| Campaign vault | [CONTEXT.md](./CONTEXT.md) | Sessions, World, Timeline, Factions, Devil Fruits — the campaign content |
| op5e | [op5e/CONTEXT.md](./op5e/CONTEXT.md) | Standalone FoundryVTT module (TypeScript) |
| Sync scripts | [scripts/CONTEXT.md](./scripts/CONTEXT.md) | Python automation: Discord export, Foundry sync, Quartz publish |

Each context has two files: `CONTEXT.md` (terms) and `CLAUDE.md` (rules and danger zones): [root](./CLAUDE.md), [op5e/CLAUDE.md](./op5e/CLAUDE.md), [scripts/CLAUDE.md](./scripts/CLAUDE.md). Prior agent conversations and handoffs are archived in `Agent Threads/`. Knowledge graphs are separate per context (`graphify-out/` at the root for the vault, `op5e/graphify-out/` for op5e); never merge them.

## How they touch

- **Sync scripts** read the **vault** and publish it (Quartz → `v4` branch) and reconcile it against Discord and Foundry.
- **op5e** tests write fixtures into the vault's `Foundry/actors-json/` — op5e is not fully self-contained.

## Shared terms

**Foundry (live)**:
Current FoundryVTT game-server state — actual PC/NPC stats as played at the table. Bridged into the vault via the `Foundry/world-actors` junction. See [[Foundry/_index|Foundry/_index]].
_Avoid_: Foundry (workshop)

**Foundry (workshop)**:
Draft/import actor JSON used to build or template characters; does not necessarily reflect current in-game state. Bridged via the `Foundry/actors-json` junction.
_Avoid_: Foundry (live), treating workshop JSON as current stats

## Flagged ambiguities

- "Foundry" alone is ambiguous between the live game state and the workshop/import templates — always qualify as Foundry (live) or Foundry (workshop).
- "scripts/" exists at both the vault root and inside `op5e/scripts/` — same name, unrelated projects. Confirm which one before running or editing anything.

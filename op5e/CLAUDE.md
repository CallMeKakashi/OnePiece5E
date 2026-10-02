# Claude Code — op5e

Standalone FoundryVTT module (TypeScript, npm, vitest, its own build/release pipeline). Not the campaign vault: see [../CONTEXT-MAP.md](../CONTEXT-MAP.md), [CONTEXT.md](./CONTEXT.md), and the root [../CLAUDE.md](../CLAUDE.md) for repo-wide rules.

## Danger zones

- **Broad pattern edits can silently touch unrelated entries.** A content-based regex patch aimed at 3 named tricks once blanked unrelated compendium entries. Patch by exact name/context, never by broad pattern, and run `npm test` after.
- **The test suite has a hidden dependency on the vault.** Its actor-export fixtures write into the vault's `Foundry/actors-json/`; tests fail if that folder/junction doesn't exist in the current checkout. Do not assume `op5e/` is self-contained.
- **Foundry workshop vs live.** `Foundry/actors-json` is workshop (build/import templates, not current); `Foundry/world-actors` is the live world. Never treat workshop JSON as current PC/NPC state. See [../Foundry/_index.md](../Foundry/_index.md).
- `op5e/scripts/` are this module's build scripts, unrelated to the vault-root `scripts/`.

## Graphify

Own graph in `op5e/graphify-out/` (local AST only, `--code-only`). Never merge it with the vault graph.

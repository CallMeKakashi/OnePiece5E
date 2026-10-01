# op5e

Standalone FoundryVTT module for One Piece 5e. Part of the multi-context Blood & Brine repo — see [CONTEXT-MAP.md](../CONTEXT-MAP.md).

## Language

**op5e**:
The standalone FoundryVTT module for One Piece 5e (compendium, character creator, runtime hooks) in `op5e/`; a separate software project from the campaign vault with its own TypeScript build, tests, and release pipeline.
_Avoid_: Source (op5e is compiled software; Sourcebook is imported reference text), treating it as just "the compendium"

## Flagged ambiguities

- "scripts/" exists at both the vault root and inside `op5e/scripts/` — same name, unrelated projects. `op5e/scripts/` are this module's own build scripts.

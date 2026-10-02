# Claude Code — sync scripts

Python automation: Discord export, Foundry sync, Quartz publish, plus one-time migrations (check the script before assuming recurring vs one-off). See [../CONTEXT-MAP.md](../CONTEXT-MAP.md), [CONTEXT.md](./CONTEXT.md), and the root [../CLAUDE.md](../CLAUDE.md).

## Danger zones

- **Sync scripts can drop or corrupt existing note content.** `discord_vault_sync_full.py` once dropped portraits and corrupted a note mid-run. After running any `sync_*.py`, diff the affected notes before trusting the result.
- **The `&` in the repo path (`blood&brine`) breaks shell invocations on Windows** when a script runs with `shell: true` and a non-absolute interpreter path (cmd.exe treats `&` as a separator). Use `shell: false` and absolute paths.
- **`planning` and `v4` are unrelated git histories.** `v4` is the Quartz/GitHub Pages branch, synced by content-copy (`sync_quartz_content.py`). Never merge, fast-forward or reset between them. A separate `v4` worktree may exist elsewhere on disk.
- `scripts/` here is not `op5e/scripts/` (that module's own build scripts).

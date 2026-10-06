# op5e MCP server

Lets Claude create and edit characters and NPCs through the module's own code (Create OPC, advancement, compendium packs).

**How it works:** `mcp/server.mjs` (stdio) joins Foundry in headless Edge as a GM user and calls `game.op5eApi` (`scripts/mcp-api.mjs`). It opens no network port and never uses the admin key.

**Safety:** it only touches worlds listed in `OP5E_MCP_WORLDS` (default `test`), re-checks the active world before every call, and `delete_actor` needs `confirm: true`. Use a dedicated GM user, not your own login.

## Connect Claude
Claude Code / Desktop config (`.mcp.json` or Claude Desktop `mcpServers`):
```json
{ "mcpServers": { "op5e": {
  "command": "node", "args": ["F:/Documents/GitHub/blood&brine/op5e/mcp/server.mjs"],
  "env": { "FOUNDRY_USER": "Automation", "OP5E_MCP_WORLDS": "test" } } } }
```
Foundry must be running with the world launched and op5e enabled; the user must exist in that world (GM role, no password).
To allow another world, add it: `"OP5E_MCP_WORLDS": "test,my-world"`. Never list `blood-and-brine` unless you mean it.

## Tools
`search_compendium`, `create_character` (kind `pc` or `npc`, species/background/class/subclass/second class/free feat/fruit/abilities by name), `level_up`, `add_item`, `set_actor`, `list_actors`, `get_actor`, `refresh_actor`, `delete_actor`.

## Test
`node dev/harness/mcp-smoke.mjs` (test world): search, create an NPC, level up, add item, refuse then confirm delete.

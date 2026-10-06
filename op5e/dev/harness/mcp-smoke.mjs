// Smoke test for the MCP server: starts it over stdio, creates an NPC, levels it, adds an item, then deletes it (test world only).
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
const c = new Client({ name: "smoke", version: "1" });
await c.connect(new StdioClientTransport({ command: "node", args: ["mcp/server.mjs"] }));
const run = async (name, args) => { const r = await c.callTool({ name, arguments: args }); const t = r.content[0].text; console.log(r.isError ? "ERR " : "OK  ", name, t.replace(/\s+/g, " ").slice(0, 260)); return { err: !!r.isError, t }; };
console.log("tools:", (await c.listTools()).tools.map((t) => t.name).join(", "));
let bad = 0; const chk = (r) => { if (r.err) bad++; return r; };
chk(await run("search_compendium", { query: "Alert", pack: "op5e.feats" }));
chk(await run("create_character", { name: "[MCP] Test NPC", species: "Human", background: "Boxer", cls: "Brawler", level: 3, kind: "npc", fruit: "No Devil Fruit (yet)" }));
chk(await run("level_up", { actor: "[MCP] Test NPC", cls: "Brawler", to: 5 }));
chk(await run("add_item", { actor: "[MCP] Test NPC", name: "Longsword" }));
chk(await run("get_actor", { actor: "[MCP] Test NPC" }));
chk(await run("delete_actor", { actor: "[MCP] Test NPC", confirm: false }).then((r) => ({ err: !r.err })));   // must refuse without confirm
chk(await run("delete_actor", { actor: "[MCP] Test NPC", confirm: true }));
console.log(bad ? `MCP SMOKE: ${bad} FAIL` : "MCP SMOKE: all pass");
await c.close(); process.exit(bad ? 1 : 0);

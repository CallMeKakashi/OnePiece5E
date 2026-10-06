// op5e MCP server: lets Claude create and edit characters/NPCs through the module's own code (Create OPC, advancement, packs).
// It joins Foundry in headless Edge as a GM user and calls game.op5eApi (scripts/mcp-api.mjs). No admin key, no network port: stdio only.
// Config (env): FOUNDRY_URL (http://localhost:30000), FOUNDRY_USER (default "Automation"), OP5E_MCP_WORLDS (default "test": the only worlds it may touch).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { chromium } from "playwright-core";

const BASE = process.env.FOUNDRY_URL ?? "http://localhost:30000";
const USER = process.env.FOUNDRY_USER ?? "Automation";
const WORLDS = (process.env.OP5E_MCP_WORLDS ?? "test").split(",").map((s) => s.trim());
let browser, page;

async function session() {
  if (page && !page.isClosed()) return page;
  const st = await (await fetch(`${BASE}/api/status`)).json().catch(() => null);
  if (!st?.active) throw new Error("Foundry is not running with a world launched.");
  if (!WORLDS.includes(st.world)) throw new Error(`refusing: world "${st.world}" is not in OP5E_MCP_WORLDS (${WORLDS.join(", ")})`);
  browser ??= await chromium.launch({ channel: "msedge", headless: true });
  page = await (await browser.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  await page.goto(`${BASE}/join`);
  await page.selectOption("select[name=userid]", { label: USER });
  await page.click("button[name=join]");
  await page.waitForFunction(() => globalThis.game?.ready && game.op5eApi, null, { timeout: 120000 });
  await page.evaluate(() => { for (const w of Object.values(ui.windows)) w.close({ force: true }); });
  return page;
}
// the world can change under us (relaunch): re-check before every call, drop the page if it moved
async function call(method, args = {}) {
  const st = await (await fetch(`${BASE}/api/status`)).json().catch(() => null);
  if (!st?.active || !WORLDS.includes(st.world)) { page = undefined; throw new Error(`refusing: active world is "${st?.world}"`); }
  const p = await session();
  const r = await p.evaluate(async ([m, a]) => { try { return { ok: await game.op5eApi[m](a) }; } catch (e) { return { err: e.message }; } }, [method, args]);
  if (r.err) throw new Error(r.err);
  return r.ok;
}
const tool = (server, name, description, shape, method) => server.tool(name, description, shape, async (args) => {
  try { return { content: [{ type: "text", text: JSON.stringify(await call(method, args), null, 1) }] }; }
  catch (e) { return { isError: true, content: [{ type: "text", text: String(e.message) }] }; }
});

const server = new McpServer({ name: "op5e", version: "0.1.0" });
tool(server, "search_compendium", "Search the OP5e packs (classes, species, backgrounds, feats, items, creations, devil fruits, monsters) by name.",
  { query: z.string(), pack: z.string().optional().describe("e.g. op5e.feats"), type: z.string().optional(), limit: z.number().optional() }, "search");
tool(server, "create_character", "Create a PC or NPC through Create OPC with all advancement auto-applied. Names, not ids. Abilities default to the standard array (str,dex,con,int,wis,cha order).",
  { name: z.string(), species: z.string(), background: z.string().describe("background or role"), cls: z.string(), level: z.number().optional(), subclass: z.string().optional(),
    cls2: z.string().optional(), level2: z.number().optional(), subclass2: z.string().optional(), feat: z.string().optional().describe("free starting feat"),
    fruit: z.string().optional().describe("devil fruit template, e.g. Logia"), abilities: z.object({ str: z.number(), dex: z.number(), con: z.number(), int: z.number(), wis: z.number(), cha: z.number() }).optional(),
    kind: z.enum(["pc", "npc"]).optional(), dream: z.string().optional() }, "createCharacter");
tool(server, "level_up", "Raise one class of an existing actor to a level (advancement auto-applied).", { actor: z.string(), cls: z.string(), to: z.number() }, "levelUp");
tool(server, "add_item", "Add an item, creation or spell by name from the OP5e/dnd5e packs to an actor.", { actor: z.string(), name: z.string(), pack: z.string().optional(), quantity: z.number().optional() }, "addItem");
tool(server, "learn_fruit_spell", "Teach a Devil Fruit user a spell or creation from any pack (op5e or dnd5e). Costs Devil Fruit Uses when cast.", { actor: z.string(), spell: z.string() }, "learnFruitSpell");
tool(server, "set_actor", "Update actor data with a Foundry update object, e.g. {\"system.attributes.hp.value\": 10}.", { actor: z.string(), set: z.record(z.any()) }, "setActor");
tool(server, "list_actors", "List world actors.", { type: z.string().optional() }, "listActors");
tool(server, "get_actor", "Summary of one actor: classes, abilities, items.", { actor: z.string() }, "getActor");
tool(server, "refresh_actor", "Update an actor's op5e items from the current compendium (dry run unless apply is true).", { actor: z.string(), apply: z.boolean().optional() }, "refreshActor");
tool(server, "delete_actor", "Delete an actor. Requires confirm: true.", { actor: z.string(), confirm: z.boolean() }, "deleteActor");

await server.connect(new StdioServerTransport());
process.on("exit", () => browser?.close());

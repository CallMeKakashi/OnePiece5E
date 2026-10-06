// Local update helper: lets a GM update op5e from inside a running world (no trip back to the setup screen).
// Run on the machine that hosts Foundry, from the installed module:  node <Foundry Data>/modules/op5e/scripts/update-helper.mjs
// (it ships inside the module zip, so after the first install it is always there; it must be running while you press Update).
// It listens on 127.0.0.1 only, needs the token it prints (paste it into op5e's "Update helper token" setting), and only ever downloads
// the op5e release zip from github.com/CallMeKakashi/OnePiece5E. It updates the module folder it is run from; run from a repo checkout it needs FOUNDRY_DATA=<Foundry Data folder>.
// Flow: POST /stage (download + unpack to a temp folder) -> the client syncs the compendium documents through Foundry's API -> POST /commit (copies the module files; Foundry hot-reloads).
import http from "node:http";
import { randomBytes } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO = "CallMeKakashi/OnePiece5E", PORT = Number(process.env.OP5E_UPDATE_PORT ?? 30111);
const HERE = join(import.meta.dirname, "..");
const MOD = process.env.FOUNDRY_DATA ? join(process.env.FOUNDRY_DATA, "modules", "op5e") : HERE;
if (!/[\\/]modules[\\/]op5e$/.test(MOD.replace(/[\\/]+$/, ""))) { console.error("Refusing to run: this is not an installed Foundry module folder. Run it from <Data>/modules/op5e/scripts or set FOUNDRY_DATA."); process.exit(1); }
const ORIGINS = (process.env.OP5E_UPDATE_ORIGINS ?? "http://localhost:30000").split(",");
const TOKEN_FILE = join(import.meta.dirname, "..", ".update-token");
const token = existsSync(TOKEN_FILE) ? readFileSync(TOKEN_FILE, "utf8").trim() : (() => { const t = randomBytes(16).toString("hex"); writeFileSync(TOKEN_FILE, t); return t; })();
let staged = null;   // { dir, root, tag, version }

const gh = async (path) => (await fetch(`https://api.github.com/repos/${REPO}/${path}`, { headers: { "user-agent": "op5e-update-helper" } })).json();

async function stage(tag) {
  const rel = tag ? await gh(`releases/tags/${tag}`) : await gh("releases/latest");
  if (!rel.tag_name) throw new Error("no suitable release found");
  const asset = rel.assets?.find((a) => a.name === "op5e.zip");
  if (!asset) throw new Error("release has no op5e.zip");
  if (!asset.browser_download_url.startsWith(`https://github.com/${REPO}/releases/download/`)) throw new Error("unexpected download url");
  const dir = mkdtempSync(join(tmpdir(), "op5e-update-")), zip = join(dir, "op5e.zip"), unpack = join(dir, "x");
  writeFileSync(zip, Buffer.from(await (await fetch(asset.browser_download_url)).arrayBuffer()));
  mkdirSync(unpack);
  if (spawnSync("tar", ["-xf", zip, "-C", unpack]).status && spawnSync("unzip", ["-q", zip, "-d", unpack]).status) throw new Error("could not unpack the zip (need tar or unzip)");
  const root = existsSync(join(unpack, "module.json")) ? unpack : join(unpack, readdirSync(unpack)[0]);
  const version = JSON.parse(readFileSync(join(root, "module.json"), "utf8")).version;
  staged = { dir, root, tag: rel.tag_name, version };
  return { tag: rel.tag_name, version, packs: existsSync(join(root, "packs-src")) ? readdirSync(join(root, "packs-src")) : [] };
}

const packDocs = (name) => {
  const d = join(staged.root, "packs-src", name);
  return readdirSync(d).map((f) => { const o = JSON.parse(readFileSync(join(d, f), "utf8")); delete o._key; delete o._stats; return o; });
};

function commit() {
  let n = 0;
  const same = (a, b) => existsSync(b) && statSync(a).size === statSync(b).size && readFileSync(a).equals(readFileSync(b));
  const copy = (from, to) => {
    if (statSync(from).isDirectory()) { mkdirSync(to, { recursive: true }); for (const f of readdirSync(from)) copy(join(from, f), join(to, f)); }
    else if (!same(from, to)) { cpSync(from, to); n++; }
  };
  // packs/ (live LevelDB) and packs-src are never copied: the documents were synced through Foundry's API. module.json goes last.
  for (const f of ["scripts", "templates", "styles", "lang", "assets", "data"]) if (existsSync(join(staged.root, f))) copy(join(staged.root, f), join(MOD, f));
  copy(join(staged.root, "module.json"), join(MOD, "module.json"));
  const out = { copied: n, version: staged.version };
  rmSync(staged.dir, { recursive: true, force: true }); staged = null;
  return out;
}

http.createServer(async (req, res) => {
  const origin = req.headers.origin, ok = ORIGINS.includes(origin);
  const send = (code, body) => {
    res.writeHead(code, { "content-type": "application/json", ...(ok ? { "access-control-allow-origin": origin, "access-control-allow-headers": "content-type,x-op5e-token", "access-control-allow-methods": "GET,POST,OPTIONS" } : {}) });
    res.end(JSON.stringify(body));
  };
  if (req.method === "OPTIONS") return send(204, {});
  if (!ok || req.headers["x-op5e-token"] !== token) return send(403, { error: "forbidden" });
  try {
    const url = new URL(req.url, "http://x");
    if (url.pathname === "/status") return send(200, { installed: JSON.parse(readFileSync(join(MOD, "module.json"), "utf8")).version, latest: (await gh("releases/latest")).tag_name });
    if (url.pathname === "/stage" && req.method === "POST") return send(200, await stage(url.searchParams.get("tag")));
    if (url.pathname.startsWith("/packs/") && staged) return send(200, packDocs(url.pathname.slice(7).replace(/[^a-z0-9-]/g, "")));
    if (url.pathname === "/commit" && req.method === "POST" && staged) return send(200, commit());
    send(404, { error: "not found" });
  } catch (e) { send(500, { error: e.message }); }
}).listen(PORT, "127.0.0.1", () => console.log(`op5e update helper on http://localhost:${PORT}\nToken (paste into op5e settings, "Update helper token"): ${token}\nAllowed Foundry origins: ${ORIGINS.join(", ")} (set OP5E_UPDATE_ORIGINS to change)`));

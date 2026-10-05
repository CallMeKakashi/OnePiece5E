# Compares the OLD campaign sheets (reports/campaign-pcs-raw.json) with the rebuilt actors in reports/live-actors-full.json, item by item.
# Usage: python dev/compare-pcs.py "<old name>" "<new name>" [--all]
import json, re, sys
old = {a["name"]: a for a in json.load(open("reports/campaign-pcs-raw.json", encoding="utf8"))}
new = {a["name"]: a for a in json.load(open("reports/live-actors-full.json", encoding="utf8"))}
norm = lambda s: re.sub(r"[^a-z0-9]", "", re.sub(r"\(.*?\)", "", s.lower()))
def dmg(it):
    s = it.get("system", {}); d = s.get("damage") or {}
    parts = []
    b = d.get("base")
    if b:
        f = b["custom"]["formula"] if b.get("custom", {}).get("enabled") else (f"{b.get('number')}d{b.get('denomination')}" if b.get("number") else "")
        if b.get("bonus"): f += "+" + str(b["bonus"]).lstrip("+")
        parts.append((f.replace(" ", ""), ",".join(b.get("types") or [])))
    for p in d.get("parts") or []:
        parts.append((str(p[0]).replace(" ", ""), str(p[1])))
    ver = d.get("versatile"); ver = (ver.get("custom", {}).get("formula") if isinstance(ver, dict) and ver.get("custom", {}).get("enabled") else (f"{ver.get('number')}d{ver.get('denomination')}" if isinstance(ver, dict) and ver.get("number") else (ver if isinstance(ver, str) else "")))
    acts = []
    for a in (s.get("activities") or {}).values():
        for p in (a.get("damage", {}) or {}).get("parts", []) or []:
            f = p["custom"]["formula"] if p.get("custom", {}).get("enabled") else (f"{p.get('number')}d{p.get('denomination')}" if p.get("number") else "")
            if p.get("bonus"): f += "+" + str(p["bonus"]).lstrip("+")
            acts.append(f"{a.get('name','')}:{f}[{','.join(p.get('types') or [])}]")
        at = a.get("attack") or {}
        if at.get("bonus"): acts.append(f"{a.get('name','')}:atk{at['bonus']}")
    return parts, ver, acts
def run(o, n, show_all=False):
    O, N = old[o], new[n]
    ni = {}
    for it in N["items"]: ni.setdefault(norm(it["name"]), []).append(it)
    rows = {"match": [], "dmgdiff": [], "missing": []}
    for it in O["items"]:
        if it["type"] in ("class", "subclass", "race", "background"): continue
        k = norm(it["name"]); hit = ni.get(k)
        if not hit: rows["missing"].append(it); continue
        if it["type"] in ("weapon", "equipment", "feat") and (dmg(it)[0] or dmg(it)[2]):
            a, b = dmg(it), dmg(hit[0])
            if (a[0], a[1]) != (b[0], b[1]): rows["dmgdiff"].append((it["name"], a, b))
        rows["match"].append(it["name"])
    return rows
if __name__ == "__main__":
    o, n = sys.argv[1], sys.argv[2]; r = run(o, n)
    print(f"== {o}  vs  {n}\n  old items (excluding class/race/background): {len(r['match'])+len(r['missing'])}; matched by name: {len(r['match'])}; missing in new: {len(r['missing'])}; damage differs: {len(r['dmgdiff'])}")
    by = {}
    for it in r["missing"]: by.setdefault(it["type"], []).append(it["name"])
    for t, names in by.items(): print(f"  missing {t} ({len(names)}):", "; ".join(sorted(names))[:900])
    for name, a, b in r["dmgdiff"]: print("  DAMAGE", name, "| old", a[0], a[1], a[2][:2], "| new", b[0], b[1], b[2][:2])

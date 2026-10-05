# Old weapon/equipment damage vs the OP5e compendium counterparts (items + campaign-items), for the nine rebuilt characters. Prints what differs or has no OP5e match.
import json, re, glob
old = json.load(open("reports/campaign-pcs-raw.json", encoding="utf8"))
WANT = ["Baptiste", 'Matthew "The Jack" Burgess', "B.O.B", "Roma", "Hybrid", "Sulong", "Malphas", "Thunderbird Form 1", "Thunderbird Form 2"]
norm = lambda s: re.sub(r"[^a-z0-9]", "", re.sub(r"\(.*?\)", "", s.lower()))
def base_formula(s):
    d = s.get("damage") or {}; out = []
    b = d.get("base")
    if b:
        f = b["custom"]["formula"] if b.get("custom", {}).get("enabled") else (f"{b.get('number')}d{b.get('denomination')}" if b.get("number") else "")
        if b.get("bonus"): f += "+" + str(b["bonus"]).lstrip("+")
        out.append((re.sub(r"\s", "", f), ",".join(b.get("types") or [])))
    for p in d.get("parts") or []: out.append((re.sub(r"\s", "", str(p[0])), str(p[1])))
    return out
new = {}
for pk in ("items", "campaign-items"):
    for f in glob.glob(f"packs-src/{pk}/*.json"):
        d = json.load(open(f, encoding="utf8")); new.setdefault(norm(d["name"]), []).append((pk, d))
rows = {}
for a in old:
    if a["name"] not in WANT: continue
    for it in a["items"]:
        if it["type"] != "weapon": continue
        k = norm(it["name"]); rows.setdefault(it["name"], {"chars": set(), "old": base_formula(it["system"]), "has": k in new})
        rows[it["name"]]["chars"].add(a["name"].split()[0])
for name, r in sorted(rows.items()):
    hit = new.get(norm(name)); nd = base_formula(hit[0][1]["system"]) if hit else None
    flag = "NO OP5E MATCH" if not hit else ("same" if nd == r["old"] else "DIFF")
    print(f"{flag:14} {name[:34]:34} old={r['old']}  new={nd}  [{','.join(sorted(r['chars']))}]")

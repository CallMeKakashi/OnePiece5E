# Old sheet vs rebuilt actor: abilities, saves, skills, tools, languages, speed, size, currency, HP (from the live dump and the old raw copy).
import json, sys
old = {a["name"]: a for a in json.load(open("reports/campaign-pcs-raw.json", encoding="utf8"))}
new = {a["name"]: a for a in json.load(open("reports/live-actors-full.json", encoding="utf8"))}
def facts(a):
    s = a["system"]
    return {"abilities": {k: v["value"] for k, v in s["abilities"].items()},
            "saves": sorted(k for k, v in s["abilities"].items() if v.get("proficient")),
            "skills": sorted(k + ("*" if v["value"] == 2 else "") for k, v in s["skills"].items() if v["value"]),
            "tools": sorted(k for k, v in (s.get("tools") or {}).items() if v.get("value")),
            "langs": sorted(s["traits"]["languages"]["value"]), "size": s["traits"]["size"], "speed": s["attributes"]["movement"]["walk"], "gp": s["currency"]["gp"],
            "hpmax": s["attributes"]["hp"].get("max"), "hpvalue": s["attributes"]["hp"].get("value")}
for o, n in [x.split("|") for x in sys.argv[1:]]:
    A, B = facts(old[o]), facts(new[n]); print(f"== {o} vs {n}")
    for k in A:
        if A[k] != B[k]:
            if isinstance(A[k], list): print(f"  {k}: only old {sorted(set(A[k])-set(B[k]))} | only new {sorted(set(B[k])-set(A[k]))}")
            else: print(f"  {k}: old {A[k]} | new {B[k]}")

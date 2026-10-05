# Builds assets/dev/plans.json (git-ignored): a Create OPC plan per old PC, from the choices recorded on the old sheet itself (advancement values).
import json, re
old = {a["name"]: a for a in json.load(open("reports/campaign-pcs-raw.json", encoding="utf8"))}
SKILL = {"acr":"Acrobatics","ani":"Animal Handling","arc":"Arcana","ath":"Athletics","dec":"Deception","his":"History","ins":"Insight","itm":"Intimidation","inv":"Investigation","med":"Medicine","nat":"Nature","prc":"Perception","prf":"Performance","per":"Persuasion","rel":"Religion","slt":"Sleight","ste":"Stealth","sur":"Survival"}
TOOL = {"smith":"Smith","cook":"Cook","card":"Card","dice":"Dice","game":"Game","land":"Land","thief":"Thieves","cartographer":"Cartographer","navg":"Navigator","tinker":"Tinker","disg":"Disguise","forg":"Forger","navigator":"Navigator","alchemist":"Alchemist"}
RACE = {"Lunarians":"Lunarian","Three-eye Tribe":"Human","Augmented":"Augmented","Mink":"Mink"}
BG = {"Boxer":"Boxer","Gambler":"Gambler","Scientist":"Scientist","Cook":"Cook","Wanderer":"Wanderer"}
CLS = {"Brawler":"Brawler","Gunslinger":"Marksman","Paladin":"Savant","Fighter":"Fighter","Barbarian":"Barbarian"}
SUB = {"Way of the Astral Self":"Chromatic Commandment","High Roller":"Sniper","Necrotic Mania":"Necrotic Mania","Brute":"Brute","Path of the Berserker":"Path of the Berserker","Way of the Drunken Master":"Drunken Master"}
SPEC = {  # key: (old name, new actor name, fruit, subclass override by class)
 "Baptiste": ("Baptiste","Baptiste (OPC)","Logia"), "Matthew": ('Matthew "The Jack" Burgess',"Matthew (OPC)","No Devil Fruit"), "BOB": ("B.O.B","B.O.B (OPC)","No Devil Fruit"),
 "Roma": ("Roma","Roma (OPC)","Zoan"), "Hybrid": ("Hybrid","Hybrid (OPC)","Zoan"), "Sulong": ("Sulong","Sulong (OPC)","Zoan"),
 "Malphas": ("Malphas","Malphas (OPC)","Zoan"), "T1": ("Thunderbird Form 1","Thunderbird 1 (OPC)","Zoan"), "T2": ("Thunderbird Form 2","Thunderbird 2 (OPC)","Zoan"),
}
plans = {}
for key, (oname, nname, fruit) in SPEC.items():
    a = old[oname]; items = a["items"]
    final = {k: v["value"] for k, v in a["system"]["abilities"].items()}
    race = next(i for i in items if i["type"] == "race"); bg = next(i for i in items if i["type"] == "background")
    classes = [i for i in items if i["type"] == "class"]
    subs = [i for i in items if i["type"] == "subclass"]
    def asis(it):
        out = []
        for ad in sorted([x for x in it["system"].get("advancement", []) if x["type"] == "AbilityScoreImprovement"], key=lambda x: x.get("level") or 0):
            v = ad.get("value") or {}
            out.append((ad.get("level") or 0, v.get("assignments") or {} if v.get("type", "asi") == "asi" else {}))
        return out
    race_asi = {}
    for lvl, asg in asis(race): race_asi = asg if lvl == 0 else race_asi
    cls_asi = {c["name"]: [asg for lvl, asg in asis(c) if lvl > 0] for c in classes}
    base = dict(final)
    for k, n in race_asi.items(): base[k] -= n
    for c in classes:
        for asg in cls_asi[c["name"]]:
            for k, n in asg.items(): base[k] -= n
    chosen = []
    for it in [race, bg] + classes:
        for ad in it["system"].get("advancement", []):
            if ad["type"] == "Trait" and (ad.get("value") or {}).get("chosen"): chosen += ad["value"]["chosen"]
    skills = [SKILL[c.split(":")[1]] for c in chosen if c.startswith("skills:") and c.split(":")[1] in SKILL]
    tools = [TOOL.get(c.split(":")[-1], c.split(":")[-1]) for c in chosen if c.startswith("tool:")]
    feats = [i["name"] for i in items if i["type"] == "feat"]
    haki = [f for f in feats if re.search(r"Haki (Novice|Apprentice|Journeyman|Adept|Master)|Color of", f)]
    prefer = ["Medium"] + skills + tools + [re.sub(r"'", ".", h) for h in haki]
    first = classes[0]
    sub = next((SUB[s["name"]] for s in subs if s["name"] in SUB and s["name"] != "Brute"), None)
    p = {"name": nname, "species": RACE[race["name"]], "background": BG[bg["name"]], "cls": CLS[first["name"]], "level": first["system"]["levels"], "subclass": SUB.get(next((s["name"] for s in subs), ""), None) if len(classes) == 1 else "Brute",
         "method": "roll", "abilities": base, "raceAsi": race_asi, "asiSteps": cls_asi[first["name"]], "fruit": fruit, "feat": "Alert", "prefer": prefer, "dream": "(from the old sheet)"}
    if len(classes) == 1: p["subclass"] = next((SUB[s["name"]] for s in subs if s["name"] in SUB), None)
    plans[key] = {"build": p}
    if len(classes) > 1:
        second = classes[1]
        plans[key]["addClass"] = {"addClass": CLS[second["name"]], "to": second["system"]["levels"], "actor": nname, "subclass": "Path of the Berserker", "asiSteps": cls_asi[second["name"]], "prefer": prefer, "fruit": fruit}
    print(key.ljust(8), p["species"], p["background"], p["cls"], p["level"], p["subclass"], "base", [base[k] for k in "str dex con int wis cha".split()], "raceAsi", race_asi, "asi", cls_asi[first["name"]], "skills", skills, "tools", tools)
json.dump(plans, open("assets/dev/plans.json", "w", encoding="utf8"))

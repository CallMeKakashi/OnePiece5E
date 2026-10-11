# Builds data/src/playlists/music.json (the source for the op5e "playlists" pack) from docs/MUSIC-MOODS.md (mood groups, with your corrections in the
# last column) and the actor themes. Songs stay in Data/music; only their paths are stored. Usage: python music-build-playlists.py
import json, os, re
J = "../Foundry/actors-json/"
dump = json.load(open(J + "playlists-dump.json", encoding="utf8"))
vol = {s["path"].split("music/", 1)[-1]: s["volume"] for p in dump for s in p["sounds"]}
md = open("docs/MUSIC-MOODS.md", encoding="utf8").read().split("\n")
MOODS = ["Combat", "Epic", "Tension", "Travel", "Calm", "Sad", "Vocal"]
groups = {m: [] for m in MOODS}; themes = {}
cur = None
for line in md:
    h = re.match(r"## (.+?)(?: \(\d+\))?$", line)
    if h: cur = h.group(1); continue
    if not line.startswith("| ") or line.startswith("| Song") or line.startswith("|---"): continue
    c = [x.strip() for x in line.strip().strip("|").split("|")]
    if cur in MOODS:
        override = c[-1].strip().capitalize() if len(c) >= 4 else ""
        groups[override if override in MOODS else cur].append(c[0])
    elif cur == "Actor themes (not sorted)":
        themes.setdefault(c[1], []).append(c[0])
def title(rel):
    n = os.path.splitext(os.path.basename(rel))[0]
    return re.sub(r"_spotdown\.org$", "", n).replace("_", " ").strip()
def sound(rel, repeat): return {"name": title(rel), "path": "music/" + rel, "volume": round(vol.get(rel, 0.5), 2), "repeat": repeat}
lists = []
for m in MOODS:
    if not groups[m]: continue
    name = "Vocal: songs with lyrics" if m == "Vocal" else f"Mood: {m}"
    lists.append({"name": name, "mode": 0 if m == "Vocal" else 1, "description": "Songs with sung lyrics, kept out of the session moods." if m == "Vocal" else f"{m} music, instrumental, shuffled.", "sounds": [sound(r, False) for r in sorted(groups[m], key=title)]})
for actor, files in sorted(themes.items()):
    lists.append({"name": f"Theme: {actor}", "mode": 0, "description": f"Theme for {actor}.", "sounds": [sound(r, True) for r in files]})
json.dump(lists, open("data/src/playlists/music.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(lists), "playlists,", sum(len(l["sounds"]) for l in lists), "sounds")
for l in lists: print(" ", l["name"], len(l["sounds"]))

# Classifies the songs used by playlists + Data/music/Characters as vocal / instrumental / unknown.
# Source: embedded tags (artist, title, duration) then an exact LRCLIB lookup (https://lrclib.net, free): lyrics found = vocal, instrumental flag = instrumental.
import json, sys, time, urllib.parse, urllib.request
tags = {t["file"]: t for t in json.load(open("../Foundry/actors-json/music-tags.json", encoding="utf8"))}
dump = json.load(open("../Foundry/actors-json/playlists-dump.json", encoding="utf8"))
used = {}  # relative file -> playlists
for p in dump:
    for s in p["sounds"]:
        rel = s["path"].split("music/", 1)[-1]; used.setdefault(rel, []).append(p["playlist"])
for rel in tags:
    if rel.startswith("Characters/"): used.setdefault(rel, []).append("(Characters)")
def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "op5e-music-tagger"}), timeout=20) as r: return json.load(r)
    except Exception: return None
res = []
for rel, pls in sorted(used.items()):
    t = tags.get(rel)
    row = {"file": rel, "playlists": pls, "artist": t and t["artist"], "title": t and t["title"], "duration": t and t["duration"], "verdict": "unknown", "why": "no tags"}
    if t and t["title"] and t["artist"]:
        q = urllib.parse.urlencode({"track_name": t["title"], "artist_name": t["artist"].split(",")[0], "duration": int(t["duration"] or 0)})
        r = get("https://lrclib.net/api/get?" + q)
        if r and abs((r.get("duration") or 0) - (t["duration"] or 0)) <= 5:
            if r.get("instrumental"): row.update(verdict="instrumental", why="LRCLIB: instrumental")
            elif (r.get("plainLyrics") or "").strip(): row.update(verdict="vocal", why="LRCLIB: has lyrics")
            else: row.update(verdict="unknown", why="LRCLIB entry without lyrics")
        else: row["why"] = "not in LRCLIB"
        time.sleep(0.15)
    res.append(row)
json.dump(res, open(sys.argv[1], "w", encoding="utf8"), ensure_ascii=False, indent=1)
from collections import Counter; print(len(res), dict(Counter(r["verdict"] for r in res)))

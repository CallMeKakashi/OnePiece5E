# Read-only: dumps title/artist/duration/genre/embedded-lyrics flag for every audio file under Data/music (mutagen).
import json, os, sys
from mutagen import File
root = "D:/foundry-pi/Foundry/foundrydata/Data/music"; out = sys.argv[1]
rows = []
for d, _, fs in os.walk(root):
    for f in fs:
        if not f.lower().endswith((".mp3", ".webm", ".ogg", ".wav", ".flac", ".m4a")): continue
        p = os.path.join(d, f); rel = os.path.relpath(p, root).replace("\\", "/")
        r = {"file": rel, "title": None, "artist": None, "genre": None, "lyrics": False, "duration": None}
        try:
            m = File(p, easy=False)
            if m is not None:
                r["duration"] = round(m.info.length, 1)
                tags = m.tags or {}
                keys = {k.split(":")[0]: k for k in tags.keys()} if hasattr(tags, "keys") else {}
                g = lambda k: (str(tags[keys[k]].text[0]) if k in keys and hasattr(tags[keys[k]], "text") and tags[keys[k]].text else None)
                r["title"], r["artist"], r["genre"] = g("TIT2"), g("TPE1"), g("TCON")
                r["lyrics"] = any(k.startswith("USLT") for k in tags.keys())
        except Exception as e: r["err"] = str(e)[:80]
        rows.append(r)
json.dump(rows, open(out, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(rows), "files;", sum(1 for r in rows if r["artist"]), "with artist;", sum(1 for r in rows if r["lyrics"]), "with embedded lyrics")

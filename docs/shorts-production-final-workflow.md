# Blood & Brine — YouTube Shorts Production (Final v4 Workflow)

> **Authoritative end-to-end guide** for rendering campaign Shorts.  
> Supersedes v1/v2/v3 steps. Historical notes remain in [`shorts-production-v2-guide.md`](./shorts-production-v2-guide.md).  
> Campaign content plan: [`youtube-shorts-campaign-plan.md`](./youtube-shorts-campaign-plan.md).

---

## Overview

Every deliverable Short is a **v4 render**: vertical 1080×1920 clip with **Whisper-synced word captions**, **speaker portraits**, **sidechain-ducked background music** (comedy vs shanty), and **overlap-safe dual-position captions** when two speakers talk at once.

```
Episode VOD → produce-shorts.sh (raw clip) → speaker confirm → Whisper → build-short-v4.py → render-short-v4.sh → *-v4.mp4
```

**Tooling root:** `D:/One Piece DND - Blood and Brine/Campaign 2/Lunarfold/shorts/`  
**Transcripts:** `blood&brine/Transcripts/{date}/Episode NN *.srt`

---

## Folder layout

```
shorts/
├── phase-1/              # Approved v4 deliverables + posting calendar
├── phase-2/              # WIP, trashed re-edits, new candidates
├── trashed/              # Rejected v4 renders (source for re-work)
├── configs/              # Per-short JSON (lines, music, trim meta)
├── music/                # Beds + music-map.json
├── portraits/            # 260px circle avatars (generated)
├── .tmp/                 # Whisper JSON, burn ASS copies, stitch parts
├── build-short-v4.py     # ASS + speaker-window JSON generator
├── render-short-v4.sh    # Full v4 ffmpeg pipeline
├── produce-shorts.sh     # Raw clip extraction from episode VODs
└── speaker-review-needed.json
```

Raw clips (`short-XX-*.mp4` without `-v4`) stay at root until re-rendered. **Do not delete** configs or Whisper JSON when moving phase-1 deliverables.

---

## Stage 1 — Clip extraction (`produce-shorts.sh`)

1. Pick segment from [`youtube-shorts-campaign-plan.md`](./youtube-shorts-campaign-plan.md) (start/end timestamps).
2. Run or extend `produce-shorts.sh`:
   - **Single segment:** `clip()` — one `-ss`/`-to` extract.
   - **Stitched:** `stitch()` — multiple beats (Shorts 03, 13, 16).
3. **Video filter:** `scale=-2:1920,crop=1080:1920,eq=contrast=1.05:brightness=0.02:saturation=1.08`
4. **Audio:** `loudnorm=I=-14:TP=-1.5:LRA=11`
5. Writes sidecar `short-XX-{slug}.txt` (title, description, source, timestamps).

### Trim rules

| Rule | Detail |
|------|--------|
| **Target length** | 35–58 s for most Shorts; never exceed 60 s upload cap without YouTube Shorts tolerance check |
| **One beat** | Cut table chatter, rules talk, and dead air unless the joke *is* the table reaction |
| **Hook first** | First spoken line should land within 3 s of clip start; trim pre-roll silence |
| **Stitched shorts** | Keep 0.3–0.8 s breathing room between stitched parts; re-normalize audio after concat |
| **Combat montages** | Structure: setup → action → payoff KO; drop repeated loops (e.g. Short 03 "As this one, I'm tired") |
| **Drama cold open** | Optional 1–2 s muted setup card, then unmute on punch line (Short 05, 13) |
| **End card** | Leave 1–2 s after last line for optional "Full episode ▶ Ep N" overlay in upload tool |

---

## Stage 2 — Speaker confirmation

**Before** generating ASS or running Whisper for final timings:

1. Pull dialogue from vault SRT for the clipped window.
2. **Listen** to the raw MP4 — assign every line: Bob / Roma / Baptiste / Linus / Malfus / DM / NPC.
3. Fix transcript errors against audio (Whisper and SRT both lie).
4. Record in `configs/short-XX-lines.json` or inline in `build-short-v4.py`.
5. Flag ambiguous lines in `speaker-review-needed.json`.

Common pitfalls (from batch review):

| Short | Issue |
|-------|-------|
| 02 | "I'm going to kill" — Roma vs Baptiste; "rules?" line paraphrased |
| 05 | Villain vs player reaction speaker |
| 09 | Recap line speaker; Tegor uses NPC portrait |
| 14 | Clip may end before Bob's "You want some?" — extend or accept trim |
| 16 | Hook "kiss of death from a zombie" may be trimmed from clip start |

---

## Stage 3 — Whisper word sync

Episode SRT blocks start **300–1500 ms before** speech → joke spoilers if used for caption timing.

```bash
cd "D:/One Piece DND - Blood and Brine/Campaign 2/Lunarfold/shorts"
ffmpeg -y -i short-XX-{slug}.mp4 -vn -ac 1 -ar 16000 .tmp/shortXX.wav
"/c/Program Files/Python311/python.exe" -m whisper .tmp/shortXX.wav \
  --model tiny --language en --word_timestamps True --output_format json --output_dir .tmp
# → .tmp/shortXX.json (or rename from whisper output)
```

**Use Whisper for timing only.** Override all display text with corrected campaign dialogue in the config/Python lines list.

### Fallback offsets (if Whisper unavailable)

| Symptom | Fix |
|---------|-----|
| All subs early ~0.5 s | Add +500 ms to every line start |
| First line only off | Per-line offset in config |
| Dead air in clip | Line 4+ may need +1–2 s vs SRT (see Short 01 table in v2 guide) |

---

## Stage 4 — v4 captions (`build-short-v4.py`)

### Shorts-style word captions (not TV captions)

| Aspect | v4 behavior |
|--------|-------------|
| Visibility | **One chunk at a time** (1–3 words); never full sentence on screen |
| Font | Impact 108 px, 8 px outline |
| Animation | Per-word pop `\fscx125` bounce — **no `\k` karaoke** |
| Speaker ID | **Portrait badge** top-left + word color (not `Bob:` prefix) |
| Overlap | Dual-position: earlier speaker **above** center, active speaker **center** |

### Chunking rules

- **1 word:** punchlines, reactions (`Nahh!`)
- **2 words:** natural pairs (`Are you`, `devil fruit`)
- **3–4 words:** fast clauses only
- Each event `End` = next chunk `Start`; hold last word ~80 ms

### Overlap detection

`build-short-v4.py` → `events_overlap()`:

1. Timestamp overlap > **0.35 s** between different speakers → secondary goes to `ShortsWordOverlap` (top, 80 px, MarginV=520).
2. **Linger handoff:** previous chunk still visible when new speaker starts → earlier = secondary.

Reference: Short 02 — Bob `"rules?"` lingers while Roma `"You ready"` starts.

```bash
python build-short-v4.py --short 01          # one short
python build-short-v4.py --short 08 --build-only   # ASS only, no render
python build-short-v4.py --all               # batch ASS generation
```

Outputs per short:

- `{slug}-v4.ass`
- `{slug}-v4-speakers.json` (portrait visibility windows for ffmpeg)

Configs live in `configs/short-XX.json` + `configs/short-XX-lines.json`.

---

## Stage 5 — Portraits (`prepare-portraits.sh`)

Sources: vault `Attachments/{bob,roma,baptiste}-portrait.png` (+ DM avatar for NPCs).

Generates 260 px circles in `portraits/` (`bob_avatar.png`, etc.).

Portrait map in `build-short-v4.py`: Bob, Roma, Baptiste, Linus, Malfus, DM/NPC fallbacks.

Overlay position: top-left, 48×400 region; swaps on active speaker from `-v4-speakers.json`.

---

## Stage 6 — Music (comedy vs shanty)

| Track | File | License | Use on |
|-------|------|---------|--------|
| **Comical** | `music/mixkit-comical-2.mp3` | [Mixkit](https://mixkit.co/license/) — no attribution | 01, 02, 04, 08, 16 — debate, table comedy, Bob fails |
| **Shanty / pirate** | `music/shanty-irate.mp3` | Kevin MacLeod *Netherworld Shanty* [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) — credit in YT description | 03, 05, 09, 11–15 — bounty, combat, villain |

Assignment: `music/music-map.json` → overridable via `configs/short-XX.json` `meta.music` or env:

```bash
MUSIC="$DIR/music/shanty-irate.mp3" ./render-short-v4.sh 11
```

### Mix levels (`render-short-v4.sh`)

- Music volume: **0.48** first 3.5 s (hook bed), **0.34** after (frame eval)
- Sidechain: `threshold=0.02 ratio=8 attack=50 release=400`
- Dialogue + music → `amix` → `alimiter=0.95`
- Fade out: last 1.2 s of clip

---

## Stage 7 — Final render (`render-short-v4.sh`)

```bash
./render-short-v4.sh 01    # by short number (zero-padded)
FORCE_ASS=1 ./render-short-v4.sh 08   # regenerate ASS before burn
DURATION=45 ./render-short-v4.sh 14  # override probe length
```

Pipeline steps:

1. Resolve slug + music from config/map
2. `prepare-portraits.sh`
3. `build-short-v4.py` (if ASS/speakers missing or `FORCE_ASS=1`)
4. ffmpeg: loop/trim music → sidechain duck → ASS burn-in → portrait overlay chain
5. Output: `{slug}-v4.mp4`

Encoder: `libx264 crf=20`, AAC 192k, `faststart`.

---

## Per-short checklist

```
[ ] Raw clip exists (produce-shorts.sh)
[ ] Trim verified ≤60 s, hook in first 3 s
[ ] Speakers confirmed + ambiguous lines resolved
[ ] Whisper JSON in .tmp/
[ ] configs/short-XX-lines.json corrected
[ ] build-short-v4.py → *-v4.ass + *-v4-speakers.json
[ ] Music assigned (comedy vs shanty)
[ ] render-short-v4.sh → *-v4.mp4
[ ] Spot-check: hook text, no sub spoilers, overlap positions, portrait swaps, music ducks
[ ] Sidecar .txt title/description for upload
[ ] Move approved file to phase-1/ with date prefix
```

---

## Batch commands

```bash
# Render all existing raw clips (02–16)
for n in $(seq -w 2 16); do ./render-short-v4.sh "$n" || true; done

# Rebuild lines from Whisper for one short
python rebuild-short-08.py   # short-specific helpers where present
./render-short-v4.sh 08
```

---

## Upload notes

- **Title/description:** from `short-XX-*.txt` sidecar or campaign plan
- **Hashtags:** rotate 3–5 from plan (`#BloodAndBrine` `#OnePieceDnD` `#ActualPlay` …)
- **Shanty shorts:** add Kevin MacLeod credit in description when using `shanty-irate.mp3`
- **End CTA:** "Full episode ▶ Episode [N] — [Title]" in last 2 s or YT description

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [`youtube-shorts-campaign-plan.md`](./youtube-shorts-campaign-plan.md) | Phase 1/2 inventory, posting schedule, new candidates |
| [`shorts-production-v2-guide.md`](./shorts-production-v2-guide.md) | v2 history, ASS style reference, Short 01 decisions |
| `shorts/phase-1/POSTING-SCHEDULE.md` | Dated upload calendar (on disk at Lunarfold) |

---

*Last updated: 2026-06-06 — v4 authoritative workflow (Whisper, word captions, portraits, overlap, trim rules, comedy/shanty music).*

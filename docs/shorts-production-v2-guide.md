# Blood & Brine — YouTube Shorts Production v2 Guide

> **Superseded for final renders** — use [`shorts-production-final-workflow.md`](./shorts-production-final-workflow.md) for the authoritative v4 pipeline (Whisper sync, word captions, portraits, overlap fixes). This doc retains v2 history and style reference.

> Proof of concept: **Short 01** (`short-01-devil-fruit-debate-v2.mp4`)  
> Applies to all 16 shorts in [`youtube-shorts-campaign-plan.md`](./youtube-shorts-campaign-plan.md).

---

## What v1 Was Missing (Short 01 Analysis)

| Area | v1 state | v2 fix |
|------|----------|--------|
| **Hook (0–3 s)** | Jumped straight to dialogue | Top overlay: *"He researches devil fruits… but never asked THIS"* |
| **Pacing** | 37 s raw clip, flat cut | Same trim; subs now land on speech beats (Whisper word timing) |
| **Audio** | Dialogue only, no bed | Sidechain-ducked background music at ~14% under speech |
| **Subtitles — size** | 52 px, bottom (`Alignment=2`) | 84 px, **center screen** (`Alignment=5`) |
| **Subtitles — sync** | SRT block starts (~0.5–1.5 s early) | Whisper word timestamps; line starts at first spoken word |
| **Subtitles — animation** | Static burn-in | Pop-in scale (`\t` 108→100%) + fade; karaoke `\k` on Bob's opening line |
| **Visual engagement** | Static crop | Hook text + speaker color coding; optional future: zoom on punchlines |
| **SEO / clarity** | Speaker names in text | Retained: `Bob:` / `Roma:` / `Baptiste:` with brand colors |

### Recommended adds by short type

| Type | Shorts | Checklist beyond subs + music |
|------|--------|----------------------------|
| **Comedy / debate** | 01, 02, 04, 08, 16 | Hook text card, pop/karaoke subs, subtle quirky bed, trim dead air |
| **Combat / hype** | 03, 09, 14, 15 | Impact SFX (bonk, gunshot, CRITICAL), damage/bounty overlays, faster cuts, tense/epic bed |
| **Drama / villain** | 05, 13, 12 | Muted cold open → unmute punch line, dark ambient bed, minimal motion on subs |
| **Reveal / flex** | 07, 11 | Cash-register / stamp SFX, on-screen belly numbers, brief freeze on poster |

---

## Music Selection Guide

### Short 01 choice (comedy / debate)

| Track | Source | URL | Notes |
|-------|--------|-----|-------|
| **Comical** (primary) | Mixkit | https://mixkit.co/free-stock-music/comical/ | Playful pizzicato; 1:54; Mixkit License, free commercial use |
| Comedy Funny Quirky | Pixabay | https://pixabay.com/music/comedy-comedy-funny-quirky-background-music-425358/ | STAROSTIN; 1:14; Pixabay Content License |
| Comedy Quirky Sneaky | Pixabay | https://pixabay.com/music/search/quirky%20comedy/ | Good for table-reaction beats |

**Download:** Save manually to `shorts/music/comical-mixkit.mp3` (CDN blocks headless curl). Re-run `render-short01-v2.sh` to swap placeholder bed for real track.

### Comedy vs shanty beds (v4)

| Track | File | License | Use on |
|-------|------|---------|--------|
| **Comical** (Mixkit) | `music/mixkit-comical-2.mp3` | [Mixkit License](https://mixkit.co/license/) — free commercial, no attribution | 01, 02, 04, 08, 16 — debate, table comedy, Bob fails |
| **Shanty / pirate** (Incompetech) | `music/shanty-irate.mp3` | Kevin MacLeod — **Netherworld Shanty**, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) (credit in description) | 03, 09, 11, 12, 13, 14, 15 — bounty reveals, combat, villain calls |

Per-short assignment lives in `shorts/music/music-map.json`. Override at render time:

```bash
MUSIC="$DIR/music/shanty-irate.mp3" ./render-short-v4.sh 11
# or rely on map + config meta.music (Short 11 sets shanty in configs/short-11.json)
./render-short-v4.sh 11
```

`render-short-v4.sh` resolves music in order: **`MUSIC=` env** → **`meta.music` in config** → **`music-map.json`** → Mixkit default.

**Short 11** (`bounty reveal`): all lines are **DM** narration (Obsidian 600M centerpiece, crew poster readout). Player reaction *"Can I take the poster with me?"* is **after** the 60 s clip trim — not in this Short.

### Mood → search terms

| Mood | Search terms | Use on |
|------|--------------|--------|
| Quirky comedy | `quirky comedy`, `playful`, `cartoon funny` | 01, 02, 16 |
| Sneaky / mischief | `sneaky comedy`, `mischief` | 08, 09 |
| Combat tension | `action percussion`, `epic battle short` | 03, 14, 15 |
| Dark drama | `dark ambient`, `suspense minimal` | 05, 13 |
| One Piece hype | `adventure brass`, `pirate epic` | 11, 12 |
| Villain call | `den den mushi`, `villain phone`, `dark mystery` | 13 |

### Mix levels (ffmpeg sidechain)

```
Music base volume: 0.12–0.16 (before compressor)
sidechaincompress: threshold=0.02 ratio=8 attack=80 release=600
Dialogue: unchanged (normalized at clip stage, I=-14 LUFS)
```

---

## Subtitle Sync Workflow (Fix Early Subs)

### Why SRT blocks lie

Episode SRT timestamps mark **caption block boundaries**, not first spoken phoneme. Blocks often start 300–1500 ms before speech → **joke spoilers**.

### Three-tier sync (use in order)

#### Tier 1 — Whisper word alignment (preferred)

```bash
# Extract mono 16 kHz from finished short clip
ffmpeg -y -i short-XX.mp4 -vn -ac 1 -ar 16000 .tmp/short.wav

# Requires: Python 3.11 + openai-whisper + numpy<2.4
"/c/Program Files/Python311/python.exe" -m pip install "numpy<2.4" openai-whisper
"/c/Program Files/Python311/python.exe" -m whisper .tmp/short.wav \
  --model tiny --language en --word_timestamps True --output_format json
```

Use `segments[].words[].start/end` for line and `\k` karaoke timing. **Always override** Whisper text with corrected campaign dialogue.

#### Tier 2 — Global offset table

When Whisper unavailable, shift all lines after listening once:

| Symptom | Fix |
|---------|-----|
| All subs early ~0.5 s | Add `+500ms` to every `Start` |
| All subs late | Subtract offset |
| First line only off | Per-line `start += 0.3` in ASS builder |

Short 01 reference offsets (SRT block → speech):

| Line | SRT-relative start | Whisper speech start | Delta |
|------|-------------------|----------------------|-------|
| Bob opener | 0.00 | 0.96 | **+960 ms** |
| Roma "Nahh!" | 7.00 | 7.86 | +860 ms |
| Baptiste | 9.00 | 9.00 | ~0 ms |
| Roma "It was food" | 11.00 | 13.10 | **+2100 ms** (dead air in clip) |

#### Tier 3 — Manual `\k` karaoke

For punchlines, split words with centisecond durations:

```
{\k16}Are {\k20}you {\k18}guys …
```

Formula: `dur_cs = round((word_end - word_start) * 100)`.

---

## ASS Template & Styles

### Play resolution

All shorts: **1080×1920** (`PlayResX/Y` must match video).

### Speaker colors (`&HAABBGGRR`)

| Speaker | Color | ASS value |
|---------|-------|-----------|
| Bob | Cyan | `&H00E5FF00` |
| Roma | Orange | `&H008CFF00` |
| Baptiste | Purple | `&H00C084C0` |
| DM | Pale gold | `&H0099FFFF` |
| Hook / neutral | White | `&H00FFFFFF` |

### Style definitions (copy into every short ASS)

```ass
Style: Hook,Arial Black,58,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,4,2,8,80,80,280,1
Style: Dialogue,Arial Black,84,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,5,2,5,60,60,0,1
```

| Style | Font | Align | Position |
|-------|------|-------|----------|
| Hook | 58 px | 8 (top center) | `MarginV=280` — below Shorts UI |
| Dialogue | 84 px | 5 (middle center) | Dead center for mobile readability |

### Animation tags

```ass
; Pop-in (prepend to every dialogue line)
{\fad(60,120)\t(0,100,\fscx108\fscy108)\t(100,220,\fscx100\fscy100)}

; Speaker prefix
{\c&H00E5FF00}Bob:{\c&H00FFFFFF} line text

; Karaoke highlight (SecondaryColour = highlight fill)
{\k42}word
```

**Comedy:** pop + karaoke on setup lines; plain pop on reactions (`Nahh!`).  
**Combat:** larger pop (`\fscx115`), shorter fade.  
**Drama:** fade only, no bounce.

---

## ffmpeg Commands

### Burn-in subs only

```bash
ASS_ESC=$(echo "$ASS_PATH" | sed 's/\\/\\\\/g' | sed 's/:/\\:/g')
ffmpeg -y -i input.mp4 -vf "ass='${ASS_ESC}'" -c:v libx264 -crf 20 -c:a copy output-subs.mp4
```

### Music mix + subs (v2 pipeline)

See [`render-short01-v2.sh`](file:///D:/One%20Piece%20DND%20-%20Blood%20and%20Brine/Campaign%202/Lunarfold/shorts/render-short01-v2.sh):

```bash
ffmpeg -y -i short.mp4 -i music.mp3 \
  -filter_complex "\
[1:a]aloop=loop=-1:size=2e+09,atrim=0:DURATION,asetpts=N/SR/TB,volume=0.14[music];\
[0:a][music]sidechaincompress=threshold=0.02:ratio=8:attack=80:release=600:makeup=2[ducked];\
[0:v]ass='ASS_PATH'[vout]" \
  -map "[vout]" -map "[ducked]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart \
  -shortest short-v2.mp4
```

---

## Speaker Confirmation Workflow

Before generating ASS for any short:

1. **Pull SRT segment** from episode transcript (vault `Transcripts/`).
2. **Listen to clipped MP4** — assign each line to Bob / Roma / Baptiste / DM / NPC.
3. **Flag ambiguous lines** (Short 01: line 3 = Roma "Nahh!", line 4 = Baptiste).
4. **Fix transcript errors** against audio (Short 01: "your devil fruit", not "you devil fruit").
5. **Record speakers** in a `{short-id}-speakers.json` or inline in ASS builder script.
6. **Run Whisper** — verify word timings match expected speaker (catches wrong line splits).

---

## Batch Processing: Shorts 02–16

### Per-short checklist

```
[ ] Clip exists (produce-shorts.sh output)
[ ] Speakers confirmed
[ ] Whisper JSON generated (.tmp/shortXX.json)
[ ] Dialogue corrected in build script
[ ] ASS generated (short-XX-v2.ass)
[ ] Music picked + saved to shorts/music/
[ ] render-short-v2.sh → short-XX-v2.mp4
[ ] Spot-check: hook visible 0–3 s, no sub spoilers, music ducks under speech
```

### Suggested batch order

Same as campaign plan posting order — refine 01 first, then 14, 11, 10…

### File naming

```
short-XX-{slug}.mp4          # v1 clip (no subs/music)
short-XX-{slug}-v2.mp4       # final deliverable
short-XX-{slug}-v2.ass       # styled subs
short-XX-{slug}-speakers.json
.tmp/shortXX.json            # Whisper alignment
music/{mood}-{source}.mp3
```

### Generalize render script

Copy `build-short01-v2-ass.py` → per-short dialogue list + `render-short-v2.sh` with env vars:

```bash
SHORT_ID=02
DURATION=14   # ffprobe -show_entries format=duration
MUSIC=music/sneaky-comedy.mp3
```

Future: one `build_short_ass.py --whisper .tmp/short02.json --speakers short-02-speakers.json`.

---

## Short 01 v2 — Key Decisions (reference for batch)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Sync source | Whisper `tiny` word timestamps | SRT was 0.96–2.1 s early on several lines |
| Bob opener | Full karaoke `\k` chain | Prevents whole sentence appearing before "Are you guys…" |
| Reaction lines | Plain pop-in, no karaoke | "Nahh!" is 0.5 s — karaoke overkill |
| Placement | Center (84 px) | Shorts convention; bottom subs too small on mobile |
| Hook | Top overlay, 3.5 s | Campaign plan hook text |
| Music | Mixkit "Comical" (placeholder synth if not downloaded) | Quirky debate tone; ducking preserves dialogue |
| Speakers | Bob / Roma / Baptiste per user confirmation | Line 3 Roma, line 4 Baptiste, "your devil fruit" |

---

## Tooling paths

| Tool | Path / note |
|------|-------------|
| ffmpeg | `chocolatey/bin/ffmpeg` (v8) |
| Whisper | `Python311` + `openai-whisper`; needs `numpy<2.4` for numba |
| Clips | `D:\One Piece DND - Blood and Brine\Campaign 2\Lunarfold\shorts\` |
| Transcripts | `blood&brine/Transcripts/{date}/Episode NN *.srt` |
| v2 scripts | `build-short01-v2-ass.py`, `render-short01-v2.sh` in shorts folder |

---

---

## Shorts-style captions (v4)

v2/v3 subtitles still behave like **TV captions**: full lines (or full karaoke chains) sit on screen while words highlight. Viral Shorts captions show **1–3 words at a time**, each popping in exactly when spoken, then replaced by the next chunk.

### v2 vs v4

| Aspect | v2/v3 | v4 (Shorts) |
|--------|-------|-------------|
| Events per line | 1 Dialogue (all words visible) | 1 Dialogue **per word/phrase** |
| Visibility | Karaoke `\k` fills whole sentence | Only current chunk on screen |
| Font | Arial Black 84 px | **Impact 108 px** (96–120 px range) |
| Animation | Line-level pop | **Per-word pop** `\fscx125` bounce |
| Speaker ID | `Bob:` text prefix | **Portrait badge** + word color |
| Outline | 5 px | **8 px** (mobile contrast) |

### Word-by-word vs phrase chunks

| Strategy | When to use | Example |
|----------|-------------|---------|
| **1 word** | Punchlines, reactions | `Nahh!` |
| **2 words** | Natural pairs, flow | `Are you`, `devil fruit` |
| **3–4 words** | Fast rants, short clauses | `you chew it up,` |

**Rule:** Never show more than one chunk at a time. Each event's `End` = next chunk's `Start` (hold ~80 ms on last word of clip).

Chunking is manual in the dialogue config for Short 01; future shorts can auto-chunk Whisper output with `chunk_whisper_words()` in `build-short-v4.py` (`max_chunk=2`, split on gaps > 350 ms).

### ASS template — one chunk at a time

```ass
Style: ShortsWord,Impact,108,&H00FFFFFF,&H000000FF,&H00000000,&HC0000000,-1,0,0,0,100,100,0,0,1,8,4,5,40,40,120,1
```

| Field | Value | Why |
|-------|-------|-----|
| Font | Impact (fallback Arial Black) | Bold Shorts look |
| Size | 108 px | Readable on mobile |
| Alignment | 5 (center) | Shorts convention |
| MarginV | 120 | Slightly above dead center (room for portrait top-left) |
| Outline / Shadow | 8 / 4 | High contrast on gameplay footage |

**Single-word event** (Bob says "never" at 2.14 s):

```ass
Dialogue: 0,0:00:02.14,0:00:02.64,ShortsWord,,0,0,0,,{\fad(40,100)\t(0,90,\fscx125\fscy125)\t(90,200,\fscx100\fscy100)}{\c&H00E5FF00}never
```

**Two-word chunk** (Roma "It was"):

```ass
Dialogue: 0,0:00:13.10,0:00:13.96,ShortsWord,,0,0,0,,{\fad(40,100)\t(0,90,\fscx125\fscy125)\t(90,200,\fscx100\fscy100)}{\c&H008CFF00}It was
```

Do **not** use `\k` karaoke on v4 — it keeps the full sentence visible. Use separate Dialogue rows instead.

### Overlapping dialogue (dual-position captions)

When two speakers talk at the same time — or a held caption from speaker A is still on screen when speaker B starts — v4 places them at **different vertical positions** instead of stacking at center.

| Role | Style | Alignment | MarginV | Font |
|------|-------|-----------|---------|------|
| **Primary** (active / later speaker) | `ShortsWord` | 5 (middle center) | 120 | 108 px |
| **Secondary** (overlapping / earlier speaker) | `ShortsWordOverlap` | 8 (top center) | 520 | 80 px |

**Position choice:** secondary goes **above** center (not below). Bottom placement fights YouTube Shorts UI chrome; top hook clears after ~3 s.

**Detection** (`build-short-v4.py` → `events_overlap()`):

1. **Timestamp overlap** — two different speakers' visibility windows intersect for **> 0.3 s** (`OVERLAP_THRESHOLD_S`).
2. **Linger handoff** — speaker changes while the previous chunk is still held (`visible_end > spoken end` by ≥ 50 ms) and the new line starts before/at the previous `visible_end`.

**Role assignment:** when overlap is detected, the caption that **started earlier** becomes secondary (above); the **newer** speaker stays at center.

Single-speaker segments are unchanged — one center caption at a time.

**Short 02 example:** Bob's `"rules?"` lingers until Roma's `"You ready"` at 3.48 s → Bob above, Roma center.

```ass
Style: ShortsWordOverlap,Impact,80,...,Alignment=8,MarginV=520,...
Dialogue: 0,0:00:01.98,0:00:03.48,ShortsWordOverlap,,0,0,0,,{\fad...}{\c&H00E5FF00}rules?
Dialogue: 0,0:00:03.48,0:00:03.72,ShortsWord,,0,0,0,,{\fad...}{\c&H008CFF00}You ready
```

### Generate from Whisper word timestamps

```bash
# 1. Whisper alignment (once per clip)
ffmpeg -y -i short-01-devil-fruit-debate.mp4 -vn -ac 1 -ar 16000 .tmp/short01.wav
python -m whisper .tmp/short01.wav --model tiny --language en \
  --word_timestamps True --output_format json --output_dir .tmp
mv .tmp/short01.json .tmp/short01.json  # or rename whisper output

# 2. Build v4 ASS (corrected dialogue + chunk timings in build-short-v4.py)
python build-short-v4.py --short 01
# → short-01-devil-fruit-debate-v4.ass
# → short-01-devil-fruit-debate-v4-speakers.json (ffmpeg portrait windows)

# 3. Portraits + music + render
bash prepare-portraits.sh   # vault → 260px circles (bob-circle.png)
bash render-short01-v4.sh   # full v4 pipeline
```

Override text always in the Python `SHORT_XX_LINES` list or a `--config short-XX-speakers.json` — Whisper timings only, not transcript.

### Portrait + music + subs combined (v4)

Music file: `shorts/music/mixkit-comical-2.mp3` (Mixkit "Comical" — no placeholder in v4).

```bash
bash render-short01-v4.sh
```

Pipeline inside `render-short01-v4.sh`:

1. `prepare-portraits.sh` — Bob/Roma/Baptiste 260 px circles from vault `Attachments/`
2. `build-short-v4.py` — ASS + speaker-window JSON
3. ffmpeg — sidechain music + `ass` burn-in + portrait overlay (top-left 48×400, swap on speaker)

Portrait source: `blood&brine/Attachments/bob-portrait.png` (and roma/baptiste portraits).

### Batch script (shorts 02–16)

Use `build-short-v4.py` with per-short JSON:

```json
{
  "lines": [
    {
      "speaker": "Skillet",
      "words": [["CRITICAL", 1.2, 1.8], ["HIT!", 1.8, 2.1]]
    }
  ]
}
```

```bash
python build-short-v4.py --config short-02-speakers.json --out short-02-tournament-trash-talk-v4.ass
# Copy render-short01-v4.sh → render-short-v4.sh with SHORT_ID / DURATION env vars
```

---

*Last updated: 2026-06-06 — v4 overlap dual-position captions + Short 02 speaker confirm.*

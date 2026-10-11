# Scores every song used by playlists + Data/music/Characters for vocal content with Demucs (htdemucs, vocals stem), read-only on the audio.
# Per track: share of 1-second windows where the vocal stem is loud relative to the full mix. Stems are written to a temp folder and deleted per batch.
# Usage (inside the demucs venv): python music-demucs.py <music-vocals.json> <out.json> <tmp dir>
import json, os, shutil, subprocess, sys
import numpy as np, soundfile as sf
src, out, tmp = sys.argv[1:4]
ROOT = "D:/foundry-pi/Foundry/foundrydata/Data/music"
rows = json.load(open(src, encoding="utf8"))
done = json.load(open(out, encoding="utf8")) if os.path.exists(out) else {}
todo = [r["file"] for r in rows if r["file"] not in done]
BATCH = 8
def score(mix_path, voc_path):
    mix, sr = sf.read(mix_path, always_2d=True); voc, sr2 = sf.read(voc_path, always_2d=True)
    n = min(len(mix), len(voc)); mix = mix[:n].mean(1); voc = voc[:n].mean(1)
    w = sr  # 1 s windows
    k = n // w
    if k == 0: return None
    m = np.sqrt((mix[: k * w].reshape(k, w) ** 2).mean(1) + 1e-12); v = np.sqrt((voc[: k * w].reshape(k, w) ** 2).mean(1) + 1e-12)
    ratio = v / m
    audible = m > 10 ** (-45 / 20)  # skip near-silence
    if audible.sum() == 0: return None
    r = ratio[audible]
    return {"mean_ratio": float(r.mean()), "frac_gt_025": float((r > 0.25).mean()), "frac_gt_040": float((r > 0.40).mean()), "seconds": int(audible.sum())}
for i in range(0, len(todo), BATCH):
    batch = todo[i : i + BATCH]
    if os.path.exists(tmp): shutil.rmtree(tmp)
    os.makedirs(tmp)
    paths = [os.path.join(ROOT, f) for f in batch]
    p = subprocess.run([sys.executable, "-m", "demucs.separate", "-n", "htdemucs", "--two-stems", "vocals", "-d", "cuda", "-o", tmp, "--float32"] + paths, capture_output=True, text=True)
    for f in batch:
        stem = os.path.splitext(os.path.basename(f))[0]
        voc = os.path.join(tmp, "htdemucs", stem, "vocals.wav")
        mix = os.path.join(tmp, "htdemucs", stem, "no_vocals.wav")
        try:
            # vocals + no_vocals = original, so the full mix is their sum; avoids decoding webm/mp3 again
            a, sr = sf.read(voc, always_2d=True); b, _ = sf.read(mix, always_2d=True); n = min(len(a), len(b))
            sf.write(os.path.join(tmp, "mix.wav"), (a[:n] + b[:n]), sr)
            done[f] = score(os.path.join(tmp, "mix.wav"), voc)
        except Exception as e:
            done[f] = {"error": str(e)[:120], "demucs": p.stderr[-200:] if p.returncode else ""}
    json.dump(done, open(out, "w", encoding="utf8"), indent=1)
    print(f"{min(i + BATCH, len(todo))}/{len(todo)}", flush=True)
shutil.rmtree(tmp, ignore_errors=True)

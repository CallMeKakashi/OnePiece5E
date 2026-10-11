# Audio features per song (tempo, loudness, onset density, brightness, major/minor feel) for mood sorting. Read-only on the audio; needs librosa + ffmpeg.
# Usage: python music-features.py <music-vocals.json (file list)> <out.json>
import json, os, subprocess, sys, tempfile
import numpy as np, librosa
ROOT = "D:/foundry-pi/Foundry/foundrydata/Data/music"
files = [r["file"] for r in json.load(open(sys.argv[1], encoding="utf8"))]
out = {}
MAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); MIN = np.array([6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
for i, f in enumerate(files):
    try:
        wav = os.path.join(tempfile.gettempdir(), "mf.wav")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(ROOT, f), "-ac", "1", "-ar", "22050", "-t", "240", wav], check=True)
        y, sr = librosa.load(wav, sr=22050)
        rms = librosa.feature.rms(y=y)[0]; db = 20 * np.log10(rms + 1e-6)
        tempo = float(np.atleast_1d(librosa.beat.beat_track(y=y, sr=sr)[0])[0])
        on = librosa.onset.onset_strength(y=y, sr=sr)
        cent = float(librosa.feature.spectral_centroid(y=y, sr=sr).mean())
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr).mean(1)
        best = lambda prof: max(np.corrcoef(np.roll(prof, k), chroma)[0, 1] for k in range(12))
        out[f] = {"tempo": round(tempo), "loud_db": round(float(db.mean()), 1), "dyn_db": round(float(np.percentile(db, 95) - np.percentile(db, 10)), 1),
                  "onset": round(float(on.mean()), 2), "centroid": round(cent), "minor": round(float(best(MIN) - best(MAJ)), 3)}
    except Exception as e: out[f] = {"error": str(e)[:100]}
    if i % 20 == 0: json.dump(out, open(sys.argv[2], "w"), indent=1); print(i, len(files), flush=True)
json.dump(out, open(sys.argv[2], "w"), indent=1); print("done", len(out))

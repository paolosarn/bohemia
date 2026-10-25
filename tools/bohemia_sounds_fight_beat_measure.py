#!/usr/bin/env python3
"""THE EAR FOR THE FIGHT'S BEAT (SOUNDS, rules 167(e), 168(a)): one recording of a song at one level, measured.

  loud_db      the whole recording's RMS (dBFS)
  phone_db     the same through a phone speaker's band (150 Hz to 7 kHz), the band a phone plays
  pulse        the onset envelope of the phone band (10 ms frames, the rise of log energy) folded on the 500 ms beat,
               its peak (30 ms) over its median, against the same at 430 and 580 ms (two periods that are not the beat):
               'clarity' is the ratio; a beatless hum reads about 1
  onbeat       the mean onset strength within 20 ms of the song's own beats against the same on the other three
               sixteenths: how much more happens ON the beat (a line on the sixteenths with no beat reads 1)
  drums_top_db the energy above 2 kHz minus the energy under 400 Hz (a kit with snares and shakers lifts it)
Reads <file>.s16 (mono int16) with <file>.s16.json beside it; prints one JSON object keyed by file stem.
"""
import json, os, sys
import numpy as np
from scipy.signal import butter, sosfilt


def frames_db(x, sr, hop):
    n = len(x) // hop
    e = (x[:n * hop].reshape(n, hop) ** 2).mean(1)
    return 10 * np.log10(e + 1e-12)


def fold(on, per_ms, hop_ms=10):
    nb = int(round(per_ms / hop_ms)); bins = np.zeros(nb)
    for i, v in enumerate(on): bins[int((i * hop_ms) % per_ms // hop_ms) % nb] += v
    best = max(bins[b] + bins[(b + 1) % nb] + bins[(b - 1) % nb] for b in range(nb))
    return best / (np.median(bins) * 3 + 1e-9)


def one(f):
    meta = json.load(open(f + '.json')); sr = meta['sr']
    x = np.fromfile(f, dtype=np.int16).astype(np.float64) / 32767.0
    g0 = int(meta['grid0'] * sr); x = x[g0:]          # from the first booked step
    x = x[:int(len(x) - 1.4 * sr)] if len(x) > 3 * sr else x
    dc = float(np.mean(x))
    x = sosfilt(butter(2, 20, 'high', fs=sr, output='sos'), x)   # the live chain's DC blocker (__THE_FIGHTS_BEAT__'s lift)
    loud = 10 * np.log10(np.mean(x ** 2) + 1e-12)
    ph = sosfilt(butter(2, [150, 7000], 'band', fs=sr, output='sos'), x)
    phone = 10 * np.log10(np.mean(ph ** 2) + 1e-12)
    hop = sr // 100
    d = frames_db(ph, sr, hop)
    on = np.maximum(0, np.diff(d, prepend=d[0])); on[d < -75] = 0
    at, c1, c2 = fold(on, 500), fold(on, 430), fold(on, 580)
    beat = int(round(meta['sd'] * 4 * 100))           # frames a beat (50)
    # on the beat against the other three sixteenths of the same beat (25 ms either side of each grid point)
    idx = np.arange(len(on)); ph = idx % beat; six = beat / 4.0
    q = np.abs(ph - six * np.round(ph / six)); k = np.round(ph / six).astype(int) % 4
    near = (q <= 2) & (k == 0); off = (q <= 2) & (k != 0)
    onbeat = float(on[near].mean() / (on[off].mean() + 1e-9))
    hi = sosfilt(butter(4, 2000, 'high', fs=sr, output='sos'), x); lo = sosfilt(butter(4, 400, 'low', fs=sr, output='sos'), x)
    top = 10 * np.log10(np.mean(hi ** 2) + 1e-12) - 10 * np.log10(np.mean(lo ** 2) + 1e-12)
    return {'name': meta['name'], 'level': meta['level'], 'alone': meta['alone'], 'loud_db': round(loud, 2), 'phone_db': round(phone, 2),
            'pulse': {'at500': round(at, 2), 'control': round(max(c1, c2), 2), 'clarity': round(at / max(c1, c2, 1e-9), 2)},
            'onbeat': round(onbeat, 2), 'dc': round(dc, 4), 'drums_top_db': round(top, 2), 'peak_db': round(20 * np.log10(np.max(np.abs(x)) + 1e-12), 2)}


if __name__ == '__main__':
    out = {}
    for f in sys.argv[1:]: out[os.path.basename(f).replace('.s16', '')] = one(f)
    print(json.dumps(out))

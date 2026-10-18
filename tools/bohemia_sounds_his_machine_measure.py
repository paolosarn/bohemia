#!/usr/bin/env python3
"""BOHEMIA -- the numbers for tools/bohemia_sounds_his_machine.js (SOUNDS, 10/18/26, row [his sound, not a revamp]).

Reads 16-bit mono PCM at 44.1 kHz (one file per argument) and prints one JSON list, one object per file: peak and rms
in dBFS, the largest sample-to-sample jump (a click is a jump), the share of energy above 5 kHz (an AM broadcast's
top, this lane's 9/21 rule 4) and above 8 kHz, the spectral centroid, the level through a phone's speaker (two
second-order high-passes at 350 Hz, applied to the averaged power spectrum, so it is Parseval and not a guess), and
the rms of every bar so the parts of his form can be read. Numbers only; nobody's ear is claimed.
"""
import json
import sys

import numpy as np

SR = 44100
BAR = 2.0  # 120 BPM, 4/4


def db(x):
    return float(20 * np.log10(max(x, 1e-12)))


def one(path):
    x = np.fromfile(path, dtype='<i2').astype(np.float64) / 32767.0
    pk = float(np.max(np.abs(x))) if x.size else 0.0
    rms = float(np.sqrt(np.mean(x * x))) if x.size else 0.0
    jump = float(np.max(np.abs(np.diff(x)))) if x.size > 1 else 0.0
    n = 4096
    hop = n // 2
    win = np.hanning(n)
    frames = max(1, (x.size - n) // hop)
    P = np.zeros(n // 2 + 1)
    for i in range(frames):
        seg = x[i * hop:i * hop + n]
        if seg.size < n:
            break
        P += np.abs(np.fft.rfft(seg * win)) ** 2
    f = np.fft.rfftfreq(n, 1.0 / SR)
    tot = float(P.sum()) or 1e-30
    w = 2 * np.pi * f / SR
    # second-order Butterworth high-pass at 350 Hz, |H|^2, applied twice (|H|^4)
    w0 = 2 * np.pi * 350.0 / SR
    k = np.tan(w0 / 2)
    z = np.exp(-1j * w)
    q = 1 / np.sqrt(2)
    norm = 1 / (1 + k / q + k * k)
    b0, b1, b2 = norm, -2 * norm, norm
    a1, a2 = 2 * (k * k - 1) * norm, (1 - k / q + k * k) * norm
    H = (b0 + b1 * z + b2 * z * z) / (1 + a1 * z + a2 * z * z)
    Hp = np.abs(H) ** 4
    phone_ratio = float((P * Hp).sum()) / tot
    bars = []
    step = int(BAR * SR)
    off = int(0.05 * SR)
    for i in range(int((x.size - off) // step)):
        s = x[off + i * step: off + (i + 1) * step]
        bars.append(round(db(float(np.sqrt(np.mean(s * s)))), 1))
    return {
        'seconds': round(x.size / SR, 2),
        'peak': round(pk, 4), 'peak_db': round(db(pk), 2), 'rms_db': round(db(rms), 2),
        'largest_jump': round(jump, 4),
        'above_5k_pct': round(100 * float(P[f > 5000].sum()) / tot, 3),
        'above_8k_pct': round(100 * float(P[f > 8000].sum()) / tot, 3),
        'centroid_hz': round(float((P * f).sum()) / tot, 1),
        'phone_rms_db': round(db(rms * np.sqrt(phone_ratio)), 2),
        'bar_rms_db': bars,
    }


if __name__ == '__main__':
    print(json.dumps([one(p) for p in sys.argv[1:]]))

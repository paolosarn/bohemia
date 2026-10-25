#!/usr/bin/env python3
"""ONE REAL INSTRUMENT AS ONE SPRITE (SOUNDS, rules 166(e), 167, 168: 'more instruments, from real material', NO SAND).

A recorded instrument from VSCO-2-CE (CC0 1.0) becomes one mp3 the game decodes once: every note the library recorded,
trimmed from its attack, through the same worn tape once at the source, peak-normalised, with its TRUE pitch measured
(the file name is checked against the recording, never trusted: the library names some octaves one lower than the
scientific C4 = 261.6 Hz). The player picks the recorded note nearest the one asked for and moves it by playbackRate,
never more than two semitones on a library sampled every third.

  python3 tools/bohemia_sounds_instrument_sprite.py <name> <seconds kept> <dir or files...> [--src <checkout>]
writes slices/music_kit/<name>.mp3 and <name>.json ({notes: [{at, dur, hz, midi}]}) and keeps the trimmed notes as FLAC
in reference/library/sound_bank/vsco2ce_cc0/<name>/, so it rebuilds with no network.
"""
import json, os, re, subprocess, sys, tempfile, glob
import numpy as np
import soundfile as sf
from scipy.signal import butter, lfilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/library/sound_bank/vsco2ce_cc0')
OUT = os.path.join(ROOT, 'slices/music_kit')
SR = 44100
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def tape(x, top=8500):
    pk = np.max(np.abs(x)) + 1e-9
    y = np.tanh(1.3 * x / pk) / np.tanh(1.3)
    b, a = butter(2, top / (SR / 2), 'low'); y = lfilter(b, a, y)
    b, a = butter(1, 30 / (SR / 2), 'high'); y = lfilter(b, a, y)
    return y


def f0(x):
    """YIN-style difference function on the steady part of the note, 30 to 1500 Hz"""
    seg = x[int(0.04 * SR):int(0.04 * SR) + 4096]
    if len(seg) < 4096: seg = np.pad(seg, (0, 4096 - len(seg)))
    seg = seg - seg.mean()
    W = 2048; d = np.zeros(W)
    for tau in range(1, W): d[tau] = np.sum((seg[:W] - seg[tau:tau + W]) ** 2)
    cm = d[1:] * np.arange(1, W) / (np.cumsum(d[1:]) + 1e-12)
    lo, hi = int(SR / 1500), int(SR / 30)
    c = cm[lo:hi]; th = np.where(c < 0.15)[0]
    tau = (th[0] if len(th) else np.argmin(c)) + lo
    # walk to the local minimum
    while tau + 1 < hi and cm[tau] < cm[tau - 1] if tau - 1 >= 0 else False: tau += 1
    return SR / (tau + 1)


def name_midi(fn):
    m = re.search(r'_([A-G])(#?)(-?\d)_', os.path.basename(fn) + '_')
    if not m: return None
    return 12 * (int(m.group(3)) + 1) + NOTE[m.group(1)] + (1 if m.group(2) else 0)


def main():
    a = sys.argv[1:]
    src = None
    if '--src' in a: i = a.index('--src'); src = a[i + 1]; del a[i:i + 2]
    name, keep, paths = a[0], float(a[1]), a[2:]
    files = []
    for p in paths:
        q = os.path.join(src, p) if src and not os.path.isabs(p) else p
        files += sorted(glob.glob(os.path.join(q, '*.wav'))) if os.path.isdir(q) else [q]
    bank = os.path.join(BANK, name); os.makedirs(bank, exist_ok=True); os.makedirs(OUT, exist_ok=True)
    flacs = sorted(glob.glob(os.path.join(bank, '*.flac')))
    if files:
        for fn in files:
            x, sr = sf.read(fn, always_2d=True); assert sr == SR, (fn, sr); x = x.mean(1)
            ax = np.abs(x); on = max(0, int(np.argmax(ax > ax.max() * 0.05)) - int(0.003 * SR))
            y = x[on:on + int(keep * SR)].copy(); f = min(int(0.04 * SR), len(y) // 4); y[-f:] *= np.linspace(1, 0, f) ** 2
            sf.write(os.path.join(bank, os.path.basename(fn).replace('.wav', '.flac')), (y / (np.max(np.abs(y)) + 1e-9) * 0.97).astype(np.float32), SR, subtype='PCM_16')
        flacs = sorted(glob.glob(os.path.join(bank, '*.flac')))
    notes, pieces, cur = [], [np.zeros(int(0.1 * SR))], 0.1
    for fl in flacs:
        y, _ = sf.read(fl)
        hz = f0(y)
        nm = name_midi(fl)
        midi_meas = 69 + 12 * np.log2(hz / 440)
        midi = None
        if nm is not None:
            cands = [nm + 12 * k for k in (-1, 0, 1, 2)]
            best = min(cands, key=lambda c: abs(c - midi_meas))
            if abs(best - midi_meas) < 1.0: midi = best
        if midi is None: midi = int(round(midi_meas))
        z = tape(y); z = z / (np.max(np.abs(z)) + 1e-9) * 0.89
        notes.append({'at': round(cur, 5), 'dur': round(len(z) / SR, 4), 'midi': int(midi), 'hz': round(440 * 2 ** ((midi - 69) / 12), 3), 'measured_hz': round(float(hz), 2), 'file': os.path.basename(fl)})
        pieces += [z, np.zeros(int(0.1 * SR))]; cur += len(z) / SR + 0.1
    notes.sort(key=lambda n: n['midi'])
    allx = np.concatenate(pieces).astype(np.float32)
    with tempfile.TemporaryDirectory() as td:
        w = os.path.join(td, 'x.wav'); sf.write(w, allx, SR, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', w, '-ac', '1', '-ar', str(SR), '-codec:a', 'libmp3lame', '-b:a', '112k', os.path.join(OUT, name + '.mp3')], check=True)
    json.dump({'what': name + ': a real instrument (VSCO-2-CE, CC0 1.0), one worn tape at the source', 'source': 'https://github.com/sgossner/VSCO-2-CE (CC0 1.0)',
               'sr': SR, 'notes': notes}, open(os.path.join(OUT, name + '.json'), 'w'), indent=1)
    print(json.dumps({'name': name, 'notes': [(n['midi'], n['measured_hz']) for n in notes], 'kb': os.path.getsize(os.path.join(OUT, name + '.mp3')) // 1024}))


if __name__ == '__main__':
    main()

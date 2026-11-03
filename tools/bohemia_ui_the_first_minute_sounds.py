#!/usr/bin/env python3
"""BOHEMIA -- UI 5, THE FIRST MINUTE: EACH LOADING SCREEN'S OWN SOUND, FROM REAL RECORDINGS (asks 338 and 340; the 9/20 law:
analog horror at the source; the second votes 9/23: NO SAND, sounds from real material, the noise recipe is dead).

Every source is a CC0 Freesound recording through ESC-50 (the licence lines in reference/library/sound_bank/esc50_cc0/LICENCES.md;
the two diesel recordings this round adds are frozen there too). Nothing is synthesised; the chain is what the camera's own
microphone would do to the room: a small mic's band, a cab's walls, a tape's top end. Ten seconds, five bars at 120 BPM; the
title's own player (__THE_TITLE_IS_THE_DESERT__, TITLEWIND) loops it with its one-second crossfade, so no seam is cut here.

  A  the fire in the barrel (kingsrow x2) over the desert wind (toiletrolltube), through a camcorder's mic
  B  crickets (rayjensen), the sodium lamp's ballast ticking as it drops out (a real click, davidkyoku, slowed), and the valley's
     old civil-defence siren far off once (guitarguy1985), through a security camera's tiny mic
  C  a diesel truck driving (fastson) with the wind on the glass, heard from inside the cab

    python3 tools/bohemia_ui_the_first_minute_sounds.py <out_dir>
"""
import os, sys, json, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/library/sound_bank/esc50_cc0')
SR = 44100
SECONDS = 10.0


def load(stem, speed=1.0):
    p = os.path.join(BANK, stem + '.flac')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(int(SR / speed)), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).astype(float)
    return a   # read at SR/speed and played at SR: slowed by 'speed' (an octave down at 0.5), the tape's own way


def rms_db(a): return 20 * np.log10(np.sqrt(np.mean(a ** 2)) + 1e-12)


def gain(a, db): return a * 10 ** (db / 20)


def fit(a, n):
    """a recording laid end to end until it is n long, each join crossfaded 0.4 s (equal power)"""
    xf = int(0.4 * SR); out = np.zeros(n); at = 0; first = True
    while at < n:
        seg = a.copy()
        if not first:
            ramp = np.sin(np.linspace(0, np.pi / 2, xf)); seg[:xf] *= ramp
            out[at:at + xf] *= np.cos(np.linspace(0, np.pi / 2, min(xf, n - at)))[:len(out[at:at + xf])]
        end = min(n, at + len(seg)); out[at:end] += seg[:end - at]
        at = end - xf; first = False
        if end == n: break
    return out


def onepole(a, hz, high=False):
    k = np.exp(-2 * np.pi * hz / SR); y = np.zeros_like(a); s = 0.0
    for i in range(len(a)): s = (1 - k) * a[i] + k * s; y[i] = s
    return a - y if high else y


def band(a, lo, hi):
    return onepole(onepole(onepole(a, hi), hi), lo, True)


def level(a, db):
    a = a - a.mean(); return gain(a, db - rms_db(a))


def make(out):
    N = int(SECONDS * SR)
    made = {}
    # A: THE CAMP ON TAPE
    fire = fit(np.concatenate([load('4-181563-A-12'), load('4-182369-A-12')]), N)
    wind = fit(load('5-179496-A-16'), N)
    a = level(fire, -27) + level(wind, -36)
    a = band(a, 120, 7500)   # the camcorder's mic: no deep low, the top gone with the tape
    made['a'] = (level(a, -27), ['4-181563-A-12', '4-182369-A-12', '5-179496-A-16'])
    # B: THE NIGHT CAMERA
    cr = fit(load('4-202749-A-13'), N)
    clk = load('2-152895-A-31', 0.5)
    on = np.argmax(np.abs(clk) > 0.2 * np.abs(clk).max()); clk = clk[max(0, on - 200):on + int(0.25 * SR)]
    tick = np.zeros(N)
    for bar in range(int(SECONDS / 2)):   # the lamp drops out twice a bar (keys 4 and 9): its ballast ticks each time
        for key in (4, 9):
            t = int((bar * 2 + key / 6.0) * SR); e = min(N, t + len(clk)); tick[t:e] += clk[:e - t]
    sir = load('1-54084-A-42'); sir = sir[:int(4.5 * SR)] * np.sin(np.linspace(0, np.pi, int(4.5 * SR)))[:len(sir[:int(4.5 * SR)])]
    far = np.zeros(N); s0 = int(3.0 * SR); far[s0:s0 + len(sir)] += sir[:N - s0]
    far = onepole(onepole(far, 900), 900)   # a mile off: the top end gone in the air
    b = level(cr, -30) + level(tick, -31) + level(far, -38)
    b = band(b, 350, 5000)   # a security camera's tiny mic
    made['b'] = (level(b, -28), ['4-202749-A-13', '2-152895-A-31', '1-54084-A-42'])
    # C: THE ROAD IN
    dz = fit(np.concatenate([load('5-243783-A-44'), load('5-243773-A-44')]), N)
    wn = fit(load('3-117504-A-16'), N)
    c = level(dz, -26) + level(onepole(wn, 1800), -34)
    c = band(c, 60, 3800)   # inside the cab, the walls take the top
    made['c'] = (level(c, -27), ['5-243783-A-44', '5-243773-A-44', '3-117504-A-16'])
    os.makedirs(out, exist_ok=True)
    lic = open(os.path.join(BANK, 'LICENCES.md')).read()
    rows = {}
    for k, (sig, stems) in made.items():
        pk = 20 * np.log10(np.abs(sig).max() + 1e-12)
        if pk > -1: sig = gain(sig, -1 - pk)
        f = os.path.join(out, 'feed_%s.mp3' % k)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-b:a', '64k', f],
                       input=sig.astype(np.float32).tobytes(), check=True)
        src = []
        for s in stems:
            line = [l for l in lic.splitlines() if l.startswith('| ' + s + ' |')]
            src.append(line[0] if line else s + ' (licence line missing)')
        rows[k] = {'file': os.path.basename(f), 'seconds': SECONDS, 'rms_db': round(rms_db(sig), 1), 'peak_db': round(20 * np.log10(np.abs(sig).max() + 1e-12), 1),
                   'bytes': os.path.getsize(f), 'sources': src}
        print(f, rows[k]['rms_db'], 'dB rms', rows[k]['bytes'], 'bytes')
    json.dump({'_readme': 'THE LOADING SCREENS HEARD (UI 5, 11/3/26, asks 338 and 340): each option of the loading screen has its own sound, cut from CC0 recordings (Freesound via ESC-50); tools/bohemia_ui_the_first_minute_sounds.py.',
               'draft': True, 'feeds': rows}, open(os.path.join(out, 'feed_sounds.json'), 'w'), indent=1)


if __name__ == '__main__':
    make(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'slices/crashbox'))

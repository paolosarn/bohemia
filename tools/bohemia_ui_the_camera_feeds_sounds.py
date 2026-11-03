#!/usr/bin/env python3
"""BOHEMIA -- UI 6, THE CAMERA FEEDS HEARD: each new feed its own sound, from real recordings, QUIET (rule 342 (b): 'each with its
own sound from real recordings'; rule 348 (d), Paolo 11/3: 'not super loud'; his 9/21 word on the room tone: 'very, very low';
the second votes 9/23: NO SAND, sounds from real material, the noise recipe is dead).

UI 5's way (tools/bohemia_ui_the_first_minute_sounds.py, whose helpers this imports): every source a CC0 recording (Freesound via
ESC-50, reference/library/sound_bank/esc50_cc0, and the Free Firearm Sound Library's far shots, reference/library/sound_bank/ffsl_cc0),
nothing synthesised; the chain is what the camera's own microphone would do to the place. Ten seconds, five bars at 120 BPM; the
title's own player loops it with its one-second crossfade. EVERY FEED SITS AT -33 dB RMS (UI 5's three were -27 to -29; they are
brought down by the same 6 dB here so all ten sit together, under everything).

  d  THE INTAKE    the lake slapping the tower's foot (two splashes, slowed to the weight of a lake), the wind over the dam, one
                   rifle shot far across the water, through a security camera's mic
  e  THE PENS      something breathing and sniffing at the trail camera (kd_jack's recording, close), the reefer's compressor
                   still running behind the cages (a motor, far), the flies
  f  THE APRON     the wind across the concrete and a helicopter somewhere over the valley that never comes closer
  g  THE FLARE     the flare's roar (a fire, slowed to the roar of a gas flame), the dogs fighting once far off, the camcorder's mic
  h  THE MARKET    the moths at the one lit bulb, a stall's board creaking in the wind, a cat far down the street
  i  THE PYLON     the wind on a dropped camcorder's mic, and the buried car's horn, once, weak, its battery going
  j  THE FOUNTAIN  the freight line behind the Strip, a train's metal far off, and the wind down the boulevard

    python3 tools/bohemia_ui_the_camera_feeds_sounds.py [out_dir]
"""
import os, sys, json, subprocess
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_ui_the_first_minute_sounds as U5   # load, fit, band, onepole, level, gain, rms_db: UI 5's own chain
SR, N = U5.SR, int(U5.SECONDS * U5.SR)
FFSL = os.path.join(ROOT, 'reference/library/sound_bank/ffsl_cc0')
TARGET = -33.0


def ffsl(stem):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(FFSL, stem + '.flac'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(float)


def at(sig, t, n=N):
    """one recording laid once into the ten seconds at t seconds"""
    out = np.zeros(n); s0 = int(t * SR); e = min(n, s0 + len(sig)); out[s0:e] += sig[:e - s0]; return out


def trim(a, sec, fade=0.3):
    a = a[:int(sec * SR)].copy(); f = int(fade * SR)
    if len(a) > 2 * f: a[:f] *= np.linspace(0, 1, f); a[-f:] *= np.linspace(1, 0, f)
    return a


def stem_of(category):
    for l in open(os.path.join(U5.BANK, 'LICENCES.md')).read().splitlines():
        p = [x.strip() for x in l.split('|')]
        if len(p) > 3 and p[2] == category: return p[1]
    raise SystemExit('no ' + category)


def make(out):
    L, fit, band, lp, lev = U5.load, U5.fit, U5.band, U5.onepole, U5.level
    made = {}
    # d THE INTAKE
    sp = L('3-164593-A-15', 0.45); sp2 = L('3-164594-A-15', 0.45)
    lap = at(trim(sp, 2.2), 0.6) + at(trim(sp2, 2.2), 5.1) + at(trim(sp, 2.2) * 0.7, 8.0)
    wind = fit(L('5-179496-A-16'), N)
    shot = lp(lp(at(trim(ffsl('X_31_0_far'), 2.5, 0.05), 3.4), 1400), 1400)
    d = lev(lap, -33) + lev(wind, -37) + lev(shot, -40)
    made['d'] = (band(d, 300, 5000), ['3-164593-A-15', '3-164594-A-15', '5-179496-A-16', 'ffsl X_31_0_far'])
    # e THE PENS
    br = L('5-261464-A-23'); br = fit(trim(br, min(len(br) / SR, 5.0), 0.4), N)
    hum = lp(lp(fit(L('5-231551-A-36', 0.7), N), 380), 380)
    fl = fit(L(stem_of('Insects (flying)')), N)
    e = lev(br, -32) + lev(hum, -40) + lev(fl, -44)
    made['e'] = (band(e, 150, 6000), ['5-261464-A-23', '5-231551-A-36', stem_of('Insects (flying)')])
    # f THE APRON
    wd = fit(L('5-179496-A-16'), N); hel = lp(lp(fit(L('3-154926-A-40', 0.85), N), 1100), 1100)
    f = lev(wd, -34) + lev(hel, -39)
    made['f'] = (band(f, 300, 5000), ['5-179496-A-16', '3-154926-A-40'])
    # g THE FLARE
    roar = lp(fit(np.concatenate([L('4-181563-A-12', 0.55), L('4-182369-A-12', 0.55)]), N), 2400)
    dogs = lp(lp(at(trim(L('2-117271-A-0'), 2.8), 4.2), 1600), 1600)
    wd2 = fit(L('3-117504-A-16'), N)
    g = lev(roar, -32) + lev(dogs, -40) + lev(wd2, -40)
    made['g'] = (band(g, 120, 7500), ['4-181563-A-12', '4-182369-A-12', '2-117271-A-0', '3-117504-A-16'])
    # h THE MARKET
    moth = fit(L(stem_of('Insects (flying)'), 1.15), N)
    creak = at(trim(L('3-94355-A-33'), 2.0), 2.5)
    cat = lp(lp(at(trim(L('3-146964-A-5'), 2.5), 6.4), 1500), 1500)
    wd3 = fit(L('5-179496-A-16'), N)
    h = lev(moth, -38) + lev(creak, -38) + lev(cat, -42) + lev(wd3, -38)
    made['h'] = (band(h, 300, 5000), [stem_of('Insects (flying)'), '3-94355-A-33', '3-146964-A-5', '5-179496-A-16'])
    # i THE PYLON
    gust = fit(L('3-117504-A-16'), N); rumble = lp(lp(gust, 160), 160) * 3.0
    horn = lp(at(trim(L('5-179860-A-43', 0.85), 1.6, 0.08), 5.6), 2200)
    i = lev(gust, -34) + lev(rumble, -37) + lev(horn, -39)
    made['i'] = (band(i, 50, 7500), ['3-117504-A-16', '5-179860-A-43'])
    # j THE FOUNTAIN
    tr = lp(lp(fit(np.concatenate([L('4-165845-A-45'), L('4-165845-B-45')]), N), 1500), 1500)
    wd4 = fit(L('5-179496-A-16'), N)
    j = lev(tr, -35) + lev(wd4, -37)
    made['j'] = (band(j, 300, 5000), ['4-165845-A-45', '4-165845-B-45', '5-179496-A-16'])
    os.makedirs(out, exist_ok=True)
    lic = open(os.path.join(U5.BANK, 'LICENCES.md')).read()
    rows = {}
    # UI 5's three, the same files brought down to the same quiet (decoded, scaled, encoded once)
    for k in 'abc':
        f0 = os.path.join(out, 'feed_%s.mp3' % k)
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f0, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
        a = np.frombuffer(raw, np.float32).astype(float)
        if U5.rms_db(a) > TARGET + 1: made[k] = (a, ['UI 5: tools/bohemia_ui_the_first_minute_sounds.py'])
    for k, (sig, stems) in sorted(made.items()):
        sig = lev(sig, TARGET)
        pk = 20 * np.log10(np.abs(sig).max() + 1e-12)
        if pk > -3: sig = U5.gain(sig, -3 - pk)
        f = os.path.join(out, 'feed_%s.mp3' % k)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-b:a', '64k', f],
                       input=sig.astype(np.float32).tobytes(), check=True)
        src = []
        for s in stems:
            line = [l for l in lic.splitlines() if l.startswith('| ' + s + ' |')]
            src.append(line[0] if line else s + (' (Free Firearm Sound Library, Still North Media, CC0 1.0)' if s.startswith('ffsl') else ''))
        rows[k] = {'file': os.path.basename(f), 'seconds': U5.SECONDS, 'rms_db': round(U5.rms_db(sig), 1), 'peak_db': round(20 * np.log10(np.abs(sig).max() + 1e-12), 1),
                   'bytes': os.path.getsize(f), 'sources': src}
        print(f, rows[k]['rms_db'], 'dB rms', rows[k]['bytes'], 'bytes')
    p = os.path.join(out, 'feed_sounds.json'); old = json.load(open(p)) if os.path.exists(p) else {'feeds': {}}
    old['feeds'].update(rows)
    old['_readme'] = 'THE CAMERA FEEDS HEARD (UI 5 11/3 made a, b, c; UI 6 11/3 made d to j and brought all ten to -33 dB rms, rule 348 (d) quiet): each feed its own sound, cut from CC0 recordings; tools/bohemia_ui_the_first_minute_sounds.py and tools/bohemia_ui_the_camera_feeds_sounds.py.'
    json.dump(old, open(p, 'w'), indent=1)


if __name__ == '__main__':
    make(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'slices/crashbox'))

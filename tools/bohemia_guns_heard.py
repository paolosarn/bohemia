#!/usr/bin/env python3
"""
THE GUNS HEARD -- the first fight's guns from real recordings (SOUNDS, 10/19/26, row [the guns heard]).

RULE 120 (Paolo 10/18, LOCKED): 'I wanna start off with the guns too... the guns were supposed to be the main way this is
gonna be solved.' The gun is the main way a fight is won, so the gun is the sound he hears most in a fight. Before this,
every gun in slices/BOHEMIA_FIGHT.html posted one 'shot', the engine's ash-and-stone recipe (8/1, shot.3 and shot_more);
the PISTOL (Battle Brothers' dagger row) posted a sword's whoosh (swing_air); a reload made no sound at all.

THE RECORDINGS, HONESTLY. THE FREE FIREARM SOUND LIBRARY (Still North Media, Ben Jaszczak and a team of audio students,
Kickstarter 2013-14; CC0 1.0, its LICENSE file), mirrored whole on GitHub at github.com/buddingmonkey/FreeFirearmsSFXLibrary
(the only sound host this container reaches; freesound, opengameart and archive.org are refused, measured 10/19). Real guns
on a real range, 192 kHz 24-bit stereo, every track named in its 'Master Sheet.xlsx' (gun, calibre, action, mic position).
One library, one licence, one recording team: the shots, the pumps, the bolts and the mags are the same guns.

  PISTOL (BB's dagger row, 'a cheap handgun')   1911 .45, Walther PPQ 9mm, Smith & Wesson 642 .38 revolver
  SHOTGUN (BB's handgonne, 'one huge hit')      Winchester Model 12, Benelli Nova, Charles Daly pump, all 12 gauge
  RIFLE (BB's crossbow, 'across the street')    Mosin Nagant 7.62x54, Springfield 1917 .30-06, Tikka T3 .30-06

YOURS is the library's NEAR mic (beside the shooter: the man you control fired). THEIRS is its MID mic (in front of the
shooter, further off: their man fired). You hear who fired before you see it.

THE CHAIN, IN THE ORDER THE AIR AND THE MACHINE MEET IT (each stage a real operation on the recording, never a generator):
  1. CUT      the shot from 0.30 s before its onset (the AGC settles on the range's own air) to 2.0 s after; stereo to mono;
              192 kHz to 44.1 kHz (a polyphase resample); its first 20 ms levelled to the same peak take to take. LAYERED
              with the same gun's FAR mic (the library records every gun near, mid, far and behind): the near or mid mic
              gives the crack and the body, the far mic the range's real outdoor tail (6 dB under for yours, level for
              theirs). Measured: the near mic's tail is 40 to 55 dB under its shot within 100 ms (dry), the far mic's
              30 to 35 dB under for a quarter second, with a real reflection near an 8th on the Model 12.
  2. STREET   the Strip's canyon: two facades about 43 m apart, so the shot comes back every 125 ms, a 16th at 120 BPM
              (a flutter echo; the street's width is what puts it on the grid). Fourteen bounces, each keeping 0.55 of its
              pressure, spreading as r0/r, one more pole of darkness (3.6 kHz) and smeared over the facade's depth
              (taps at 3, 6 and 11 ms, never noise). YOURS: the camera 10 m off; THEIRS: 30 m off, so their echo stands
              higher against their shot, which is what distance does in a street.
  3. CAMCORDER the machine that heard it: a consumer camcorder's automatic gain (2 ms attack, 500 ms release, up to
              +24 dB in the quiet): it slams down on the blast and the street breathes back over one beat. Found footage of gunfire
              sounds like this; a filter on a clean shot does not. VHS linear audio: 100 Hz to 10 kHz (THE WHAT ANALOG
              HORROR SOUNDS LIKE page, rule 4), so a high-pass at 100 Hz and two 2nd-order low-passes at 10 kHz.
  4. TAPE     the head bump (+2.5 dB at 110 Hz), saturation (tanh, drive 1.8: rule 8, the blast rounds off, never
              clips), wow 0.25 percent at 0.9 Hz and flutter 0.08 percent at 5.3 Hz (rule 5: 0.15 to 0.6 percent); the
              band of step 3 is applied AFTER the tape, because saturation makes harmonics and the machine's band holds
              them too (measured: a pump's clack had 6 percent of its energy above 10 kHz with the band first)
  5. DROP-OUT one take in five per voice: a dive in the tail (rule 6: 36 ms, 14 dB, the top goes first, never zero)
  6. LENGTH   two beats exactly (1.000 s at 120 BPM), the last 16th a fade, so every shot ends on a beat
  7. LIMITER  minus 1 dBFS, then every voice set to the same short-term loudness as the game's shot today
C, THE CLEAN RECORDING: the same two real mics layered, the same two beats, the same loudness; no street, no camcorder,
no tape. It is on
the card so his ear decides whether the machine is worth it.

THE RELOAD, ON THE GRID: the library records each motion of each gun on its own track (mag in, slide, shell in, pump
back, pump forward, bolt up, back, forward, down). A reload is those real motions laid on 16ths of a beat: the PISTOL mag
on the beat, the slide an 8th later; the SHOTGUN shell on the beat, the pump back on the 8th, forward on the next 16th;
the RIFLE bolt up on the beat, back a 16th later, forward on the 8th after it, down on the next beat. Never moved more
than the gap between two real motions, never stretched, never pitched.

  python3 tools/bohemia_guns_heard.py --bank    # cut the chosen windows out of the clone into the repo's FLAC bank
  python3 tools/bohemia_guns_heard.py           # render every sprite, the manifest and what plays now
  python3 tools/bohemia_guns_heard.py --check   # re-read the rendered files and verify the pass criteria
"""
import json, os, sys, math, re
import numpy as np
import soundfile as sf
from scipy import signal

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import bohemia_from_a_recording as FR   # REUSE-FIRST: the lane's chain (hp, lp, low_shelf, saturate, wow_flutter, limit, write_mp3)

ROOT = os.path.dirname(HERE)
SR = FR.SR
CLONE = os.environ.get('FFSL', '/tmp/claude-0/ext/ffsl')
BANK = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'ffsl_cc0')
OUT = os.path.join(ROOT, 'slices', 'vote', 'guns_heard')
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

BEAT = 0.5                      # 120 BPM
LEN = 2 * BEAT                  # every shot is two beats long
SLOT, LEAD = 1.25, 0.05         # the sprite: cut k starts at k*SLOT + LEAD
RSLOT = 1.25                    # the reload sprite's slot
C_AIR = 343.0

LIBRARY = dict(
    name='The Free Firearm Sound Library', by='Still North Media (Ben Jaszczak and team), Kickstarter 2013-14',
    licence='CC0 1.0 Universal', mirror='https://github.com/buddingmonkey/FreeFirearmsSFXLibrary',
    original='http://www.stillnorthmedia.com/firearm-sound-library.html', listing='https://opengameart.org/content/the-free-firearm-sound-library')

# ----------------------------------------------------------------------------------------------------------------------
# THE PICKS: the gun's folder in the mirror, the master track, which shot in it (by onset order), and what the sheet says
# ----------------------------------------------------------------------------------------------------------------------
GUNS = {
    'pistol': [('1911', 'A', '1911 .45 semi automatic'), ('Walther PPQ', 'X', 'Walther PPQ 9mm striker'), ('Smith & Wesson 642', 'V', 'Smith & Wesson 642 .38 revolver')],
    'shotgun': [('Model 12', 'K', 'Winchester Model 12 pump, 12 gauge'), ('Nova', 'O', 'Benelli Nova pump, 12 gauge'), ('Charles Daly', 'H', 'Charles Daly pump, 12 gauge')],
    'rifle': [('Mosin Nagant', 'M', 'Mosin Nagant bolt action, 7.62x54'), ('1917', 'B', 'Springfield 1917 bolt action, .30-06'), ('Tikka', 'W', 'Tikka T3 bolt action, .30-06')],
}
# (class, perspective) -> five (folder, track, shot index) picks; near tracks for YOURS, mid tracks for THEIRS
SHOTS = {
    ('pistol', 'yours'):   [('1911', 'A_41', 0), ('Walther PPQ', 'X_39', 0), ('Smith & Wesson 642', 'V_25', 0), ('1911', 'A_41', 2), ('Walther PPQ', 'X_39', 1)],
    ('pistol', 'theirs'):  [('1911', 'A_33', 0), ('Walther PPQ', 'X_30', 0), ('Smith & Wesson 642', 'V_20', 0), ('1911', 'A_33', 1), ('Walther PPQ', 'X_30', 1)],
    ('shotgun', 'yours'):  [('Model 12', 'K_20', 0), ('Nova', 'O_19', 0), ('Charles Daly', 'H_21', 0), ('Model 12', 'K_22', 0), ('Nova', 'O_21', 0)],
    ('shotgun', 'theirs'): [('Model 12', 'K_17', 0), ('Nova', 'O_14', 0), ('Charles Daly', 'H_16', 0), ('Model 12', 'K_15', 0), ('Nova', 'O_16', 0)],
    ('rifle', 'yours'):    [('Mosin Nagant', 'M_21', 0), ('1917', 'B_23', 0), ('Tikka', 'W_27', 0), ('Mosin Nagant', 'M_21', 1), ('1917', 'B_23', 1)],
    ('rifle', 'theirs'):   [('Mosin Nagant', 'M_24', 0), ('1917', 'B_15', 0), ('Tikka', 'W_22', 0), ('Mosin Nagant', 'M_24', 1), ('1917', 'B_15', 1)],
}
# the same gun's FAR mic (the range's real outdoor tail): take k of a voice layers FAR[gun][k % 2], its first shot
FAR = {'1911': ['A_39', 'A_40'], 'Walther PPQ': ['X_31', 'X_33'], 'Smith & Wesson 642': ['V_21', 'V_23'],
       'Model 12': ['K_16', 'K_18'], 'Nova': ['O_15', 'O_17'], 'Charles Daly': ['H_15', 'H_17'],
       'Mosin Nagant': ['M_23', 'M_25'], '1917': ['B_21', 'B_22'], 'Tikka': ['W_23', 'W_25']}
FAR_DB = {'yours': -6.0, 'theirs': 0.0}   # the far layer under the near (yours) or the mid (theirs) mic, by the first 20 ms
# a reload: (folder, track, which motion in it, where it lands in beats)
RELOADS = {
    'pistol': [
        [('1911', 'A_4', 0, 0.0), ('1911', 'A_11', 0, 0.5)],
        [('1911', 'A_4', 1, 0.0), ('1911', 'A_11', 1, 0.5)],
        [('1911', 'A_4', 0, 0.0), ('1911', 'A_11', 1, 0.5)]],
    'shotgun': [
        [('Model 12', 'K_3', 1, 0.0), ('Model 12', 'K_4', 0, 0.5), ('Model 12', 'K_5', 0, 0.75)],
        [('Nova', 'O_3', 8, 0.0), ('Nova', 'O_4', 0, 0.5), ('Nova', 'O_5', 0, 0.75)],
        [('Charles Daly', 'H_3', 6, 0.0), ('Charles Daly', 'H_4', 1, 0.5), ('Charles Daly', 'H_5', 0, 0.75)]],
    'rifle': [
        [('Mosin Nagant', 'M_2', 0, 0.0), ('Mosin Nagant', 'M_4', 0, 0.25), ('Mosin Nagant', 'M_6', 0, 0.75), ('Mosin Nagant', 'M_7', 0, 1.0)],
        [('Tikka', 'W_9', 0, 0.0), ('Tikka', 'W_12', 0, 0.75)],
        [('Tikka', 'W_9', 2, 0.0), ('Tikka', 'W_12', 1, 0.75)]],
}
PERSP = {'yours': dict(r0=10.0, db=0.0), 'theirs': dict(r0=30.0, db=-5.0)}
OFFSET = {'shotgun': 0.0, 'rifle': -1.0, 'pistol': -3.0}   # how much each gun sits under the shotgun
RELOAD_DB = -12.0                                         # a reload under the shotgun's shot
DROPOUT = dict(at=0.36, ms=36.0, db=-14.0, top_hz=3500.0)   # in the tail; take 3 of 5 (index 2) of every A voice

# ----------------------------------------------------------------------------------------------------------------------
# THE BANK: only the windows used, cut from the 192 kHz masters, resampled, mono, 24-bit FLAC (about 6 MB in all)
# ----------------------------------------------------------------------------------------------------------------------
def onsets(x, sr, thr_db=-30.0, gap=0.3, w_s=0.002):
    w = int(sr * w_s); n = len(x) // w
    env = np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(axis=1) + 1e-12); db = 20 * np.log10(env)
    pk = db.max(); on = []; last = -1e9
    for i, v in enumerate(db):
        t = i * w / sr
        if v > pk + thr_db and t - last > gap: on.append(t); last = t
    return on

def master(folder, track):
    import subprocess
    path = os.path.join(CLONE, 'Master Tracks', folder, track + '.wav')
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        blob = subprocess.run(['git', '-C', CLONE, 'show', 'HEAD:Master Tracks/%s/%s.wav' % (folder, track)], capture_output=True, check=True).stdout
        open(path, 'wb').write(blob)
    x, sr = sf.read(path, dtype='float32')
    return (x.mean(axis=1) if x.ndim > 1 else x), sr

def to_sr(x, sr):
    if sr == SR: return x.astype(np.float32)
    g = math.gcd(SR, sr)
    return signal.resample_poly(x, SR // g, sr // g).astype(np.float32)

def bank_id(folder, track, k, kind):
    return '%s_%d_%s' % (track, k, kind)

def make_bank():
    os.makedirs(BANK, exist_ok=True)
    rows = {}
    def cut(folder, track, k, kind, pre, post, thr):
        x, sr = master(folder, track)
        on = onsets(x, sr, thr_db=thr, gap=0.3 if kind == 'motion' else 0.6)
        if k >= len(on): sys.exit('no event %d in %s/%s (%d found)' % (k, folder, track, len(on)))
        t = on[k]; a = max(0, int((t - pre) * sr)); b = min(len(x), int((t + post) * sr))
        y = to_sr(x[a:b], sr)
        bid = bank_id(folder, track, k, kind)
        sf.write(os.path.join(BANK, bid + '.flac'), y, SR, subtype='PCM_24')
        clip = int(((np.abs(x[a:b]) >= 0.999)).sum())
        rows[bid] = dict(gun_folder=folder, master_track='Master Tracks/%s/%s.wav' % (folder, track), event=k, onset_s=round(t, 4),
                         window_s=[round(t - pre, 4), round(t + post, 4)], source_rate=sr, clipped_source_samples=clip, kind=kind)
    for (cls, persp), picks in SHOTS.items():
        for i, (folder, track, k) in enumerate(picks):
            cut(folder, track, k, 'shot', 0.30, 2.0, -18.0)
            cut(folder, FAR[folder][i % 2], 0, 'far', 0.30, 2.0, -18.0)
    for cls, takes in RELOADS.items():
        for take in takes:
            for folder, track, k, _at in take: cut(folder, track, k, 'motion', 0.02, 0.45, -30.0)
    json.dump(dict(_readme='THE GUNS HEARD (SOUNDS 10/19/26): windows cut from the Free Firearm Sound Library masters by tools/bohemia_guns_heard.py --bank; CC0 1.0. Each id is <track>_<event>_<kind>; the master sheet names the gun and the mic.',
                   library=LIBRARY, windows=rows), open(os.path.join(BANK, 'LICENCES.json'), 'w'), indent=1, sort_keys=True)
    open(os.path.join(BANK, 'LICENCES.md'), 'w').write(
        '# The Free Firearm Sound Library, windows (CC0 1.0)\n\nBy %s. Licence: %s. Mirror: %s. Original: %s. Listing: %s.\n\n'
        'Every FLAC here is a window of one master track, cut, mono and resampled to 44.1 kHz by tools/bohemia_guns_heard.py --bank. '
        'CC0 asks for nothing; the credit is kept because the people who made it should be thanked.\n' % (
            LIBRARY['by'], LIBRARY['licence'], LIBRARY['mirror'], LIBRARY['original'], LIBRARY['listing']))
    print('banked %d windows into %s' % (len(rows), BANK))

def banked(bid):
    x, sr = sf.read(os.path.join(BANK, bid + '.flac'), dtype='float32')
    return x

# ----------------------------------------------------------------------------------------------------------------------
# THE STAGES
# ----------------------------------------------------------------------------------------------------------------------
def one_pole_lp(x, hz):
    a = math.exp(-2 * math.pi * hz / SR)
    return signal.lfilter([1 - a], [1, -a], x).astype(np.float32)

# THE STRIP IS ABOUT 43 m FACADE TO FACADE (six to eight lanes and two sidewalks), so a shot between its walls comes back
# every 42.9 m / 343 m/s = 125 ms: a 16th at 120 BPM. That is a flutter echo, the real sound of a gun in a street canyon,
# and the width of the street is what puts it on the grid.
STREET = dict(width_m=BEAT / 4 * C_AIR, bounces=14, R=0.55, top_hz=3600.0, facade_ms=(0.0, 2.9, 6.3, 10.9), facade_g=(1.0, 0.55, 0.32, 0.18))

def street_ir(r0):
    """A modelled street canyon: images of the shot between two parallel facades, one every 16th. Each bounce keeps R of its
    pressure, spreads as r0/r, and loses more of its top (one more pole each bounce); each is smeared over the facade's depth
    (windows, columns, signs at 3, 6 and 11 ms behind the wall plane: fixed taps, never noise)."""
    n_all = int(2.2 * SR); h = np.zeros(n_all, dtype=np.float32); h[0] = 1.0
    for n in range(1, STREET['bounces'] + 1):
        d = n * BEAT / 4; r = r0 + n * STREET['width_m']; g = (STREET['R'] ** n) * r0 / r
        tap = np.zeros(int(0.05 * SR), dtype=np.float32)
        for ms, fg in zip(STREET['facade_ms'], STREET['facade_g']): tap[int(ms / 1000.0 * SR)] += fg
        tap /= sum(STREET['facade_g'])
        for _ in range(n): tap = one_pole_lp(tap, STREET['top_hz'])
        i = int(round(d * SR)); j = min(n_all, i + len(tap)); h[i:j] += g * tap[:j - i]
    return h

def street(x, r0):
    return signal.fftconvolve(x, street_ir(r0))[:len(x)].astype(np.float32)

def camcorder_agc(x, attack=0.002, release=0.5, target_db=-12.0, max_db=24.0):
    """A consumer camcorder's automatic gain: a peak follower, then the gain that holds it near the target, up to +24 dB in the
    quiet (a camcorder lifts a quiet scene that far: the range's own air comes up under the tail, real material, never hiss)."""
    aa = math.exp(-1.0 / (attack * SR)); ar = math.exp(-1.0 / (release * SR))
    env = np.empty_like(x); e = 1e-4
    ax = np.abs(x)
    for i in range(len(x)):
        v = ax[i]
        e = aa * e + (1 - aa) * v if v > e else ar * e + (1 - ar) * v
        env[i] = e
    tgt = 10 ** (target_db / 20.0); gmax = 10 ** (max_db / 20.0)
    g = np.minimum(gmax, tgt / np.maximum(env, 1e-6)).astype(np.float32)
    return (x * g).astype(np.float32), g

def vhs_band(x):
    """VHS linear audio, 100 Hz to 10 kHz: a 2nd-order Butterworth high-pass and a 4th-order low-pass (24 dB an octave;
    the lane's FR.lp is pedalboard's one-pole, 6 dB an octave, measured too soft for a gun's crack)."""
    hp = signal.butter(2, 100.0, 'highpass', fs=SR, output='sos'); lp = signal.butter(4, 10000.0, 'lowpass', fs=SR, output='sos')
    return signal.sosfilt(lp, signal.sosfilt(hp, x)).astype(np.float32)

def tape(x):
    y = FR.low_shelf(x, 110.0, 2.5)
    y = FR.saturate(y, 1.8)
    return FR.wow_flutter(y, wow_hz=0.9, wow=0.0025, flut_hz=5.3, flut=0.0008)

def dropout(x, at, ms, db, top_hz):
    """Rule 6: a dive, not a cut; the top goes first; never zero."""
    n0 = int(at * SR); n = int(ms / 1000.0 * SR); r = int(0.006 * SR)
    dull = FR.lp(FR.lp(x, top_hz), top_hz) * (10 ** (db / 20.0))
    w = np.zeros(len(x), dtype=np.float32)
    w[n0:n0 + n] = 1.0
    w[n0 - r:n0] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, r))
    w[n0 + n:n0 + n + r] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return (x * (1 - w) + dull * w).astype(np.float32)

def two_beats(x, onset_n, pre=0.005):
    a = max(0, onset_n - int(pre * SR)); y = x[a:a + int(LEN * SR)].copy()
    if len(y) < int(LEN * SR): y = np.concatenate([y, np.zeros(int(LEN * SR) - len(y), dtype=np.float32)])
    f = int(BEAT / 4 * SR); y[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    fi = int(0.002 * SR); y[:fi] *= np.linspace(0, 1, fi, dtype=np.float32)
    return y

def short_loud_db(y):
    """The short-term loudness a phone hears from a shot: the rms of its loudest 100 ms."""
    w = int(0.1 * SR); best = 0.0
    for i in range(0, max(1, len(y) - w), int(0.01 * SR)):
        best = max(best, float(np.sqrt((y[i:i + w] ** 2).mean())))
    return 20 * math.log10(best + 1e-12)

def level_head(x, pre_n):
    seg = x[pre_n:pre_n + int(0.02 * SR)]
    return (x * (0.5 / (np.abs(seg).max() + 1e-9))).astype(np.float32)

def layered(folder, track, e, persp, k):
    """The close mic and the same gun's far mic, each levelled by its first 20 ms and aligned at its own onset: the body and
    the crack from the near, the range's real outdoor tail from the far. Two real recordings, never a generator."""
    pre_n = int(0.30 * SR)
    near = level_head(FR.hp(banked(bank_id(folder, track, e, 'shot')), 20.0), pre_n)
    far = level_head(FR.hp(banked(bank_id(folder, FAR[folder][k % 2], 0, 'far')), 20.0), pre_n)
    n = min(len(near), len(far))
    return (near[:n] + FR.gain_db(far[:n], FAR_DB[persp])).astype(np.float32), pre_n

def render_shot(pick, persp, version, k):
    folder, track, e = pick
    x, pre_n = layered(folder, track, e, persp, k)
    if version == 'c':
        y = two_beats(x, pre_n)
        return FR.limit(y, -1.0), {}
    y = street(x, PERSP[persp]['r0'])
    y, g = camcorder_agc(y)
    y = tape(y); y = vhs_band(y)
    y = two_beats(y, pre_n)
    info = dict(agc_min_gain_db=round(20 * math.log10(float(g[pre_n:pre_n + int(LEN * SR)].min()) + 1e-9), 1),
                agc_gain_one_beat_on_db=round(20 * math.log10(float(g[pre_n + int(BEAT * SR)]) + 1e-9), 1))
    if k == 2:
        y = dropout(y, DROPOUT['at'], DROPOUT['ms'], DROPOUT['db'], DROPOUT['top_hz']); info['dropout'] = DROPOUT
    return FR.limit(y, -1.0), info

def render_reload(take, version):
    out = np.zeros(int((RSLOT - LEAD - 0.05) * SR), dtype=np.float32)
    for folder, track, k, at in take:
        x = banked(bank_id(folder, track, k, 'motion'))
        x = FR.hp(x, 40.0); x = x * (0.5 / (np.abs(x).max() + 1e-9))
        fo = int(0.04 * SR); x[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32)
        i = int(at * BEAT * SR); j = min(len(out), i + len(x)); out[i:j] += x[:j - i]
    if version == 'a':
        out, _g = camcorder_agc(out); out = tape(out); out = vhs_band(out)
    f = int(BEAT / 4 * SR); out[-f:] *= np.linspace(1, 0, f, dtype=np.float32) ** 2
    return FR.limit(out, -1.0)

def sprite(cuts, slot):
    n = int(slot * SR); out = np.zeros(n * len(cuts), dtype=np.float32)
    for k, y in enumerate(cuts):
        i = k * n + int(LEAD * SR); out[i:i + len(y)] = y[:n - int(LEAD * SR)]
    return out

# ----------------------------------------------------------------------------------------------------------------------
# WHAT PLAYS NOW: the alpha's own pools for the fight's events, read out of the alpha (never a second copy by hand)
# ----------------------------------------------------------------------------------------------------------------------
FIGHT_EVENTS = ['shot', 'swing_air', 'hit', 'melee_hit', 'vital', 'miss', 'hurt', 'kill', 'went_down', 'high_ground']

def what_plays_now():
    src = open(ALPHA, encoding='utf-8').read()
    m = re.search(r'var APPROVED=(\{[^;]*\});', src)
    approved = json.loads(m.group(1))
    sib_src = re.search(r'var SIBLINGS=\{(.*?)\n  \};', src, re.S).group(1)
    sib_src = re.sub(r'/\*.*?\*/', '', sib_src, flags=re.S)
    siblings = {}
    for k, v in re.findall(r'(\w+)\s*:\s*\[([^\]]*)\]', sib_src):
        siblings[k] = re.findall(r"'(\w+)'", v)
    pools = {}
    for ev in FIGHT_EVENTS:
        pool = [[ev, i] for i in approved.get(ev, [])]
        for s in siblings.get(ev, []): pool += [[s, i] for i in approved.get(s, [])]
        pools[ev] = pool
    return dict(_readme='WHAT PLAYS NOW: the pools the alpha\'s playSFX draws from for each event the fight posts, read out of slices/BOHEMIA_ALPHA_0_9.html (APPROVED and SIBLINGS) by tools/bohemia_guns_heard.py. An empty pool is silent in the game (unjudged = silent). The page renders each with engine/bohemia_sfx.js, BOH_SFX.cook(ev, 5)[i], and the alpha\'s own vary (level +/-10 percent, pitch +/-3 percent).',
                pools=pools)

# ----------------------------------------------------------------------------------------------------------------------
# MEASURES (the pass criteria the gate reads)
# ----------------------------------------------------------------------------------------------------------------------
def band_share(y, lo, hi=None):
    f, p = signal.welch(y, SR, nperseg=4096)
    tot = p.sum() + 1e-20; sel = (f >= lo) & ((f < hi) if hi else True)
    return float(p[sel].sum() / tot)

def slap_at(y, beats, onset=LEAD):
    """How far the envelope near a 16th or an 8th after the onset stands above the envelope just before it (dB)."""
    w = int(0.004 * SR)
    def env(t): i = int(t * SR); return float(np.sqrt((y[i:i + w] ** 2).mean()) + 1e-9)
    t = onset + beats * BEAT
    peak = max(env(t + d / 1000.0) for d in range(-2, 10))
    floor = min(env(t - d / 1000.0) for d in range(8, 20))
    return round(20 * math.log10(peak / floor), 1)

def measure(y):
    p = float(np.abs(y).max()) + 1e-12
    return dict(seconds=round(len(y) / SR, 3), peak_db=round(20 * math.log10(p), 2), loud_100ms_db=round(short_loud_db(y), 2),
                above_10k=round(band_share(y, 10000), 5), above_20k=round(band_share(y, 20000), 6),
                first_1ms_db=round(20 * math.log10(float(np.abs(y[:int(0.001 * SR)]).max()) + 1e-12), 1),
                last_1ms_db=round(20 * math.log10(float(np.abs(y[-int(0.001 * SR):]).max()) + 1e-12), 1))

def main():
    os.makedirs(OUT, exist_ok=True)
    lic = json.load(open(os.path.join(BANK, 'LICENCES.json')))['windows']
    man = dict(_readme='THE GUNS HEARD (SOUNDS 10/19/26, row [the guns heard], rule 120): every file here starts from a real gun in the Free Firearm Sound Library (CC0 1.0) and goes through tools/bohemia_guns_heard.py. guns_<gun>_<yours|theirs>_a.mp3 is the street, the camcorder and the tape; _c.mp3 is the clean recording, same cut, same loudness. reload_<gun>_<a|c>.mp3 is the real motions laid on 16ths. Each sprite: cut k starts at k*slot + lead.',
               made='10/19/26', lane='sounds', draft=True, library=LIBRARY, bpm=120, slot=SLOT, lead=LEAD, cut=LEN, reload_slot=RSLOT,
               chain='cut > street canyon 42.9 m (an echo every 16th, 14 bounces, R 0.55) > camcorder AGC (2 ms / 500 ms / up to +24 dB) > tape (110 Hz bump, tanh 1.8, wow 0.25% at 0.9 Hz, flutter 0.08% at 5.3 Hz) > VHS band 100 Hz to 10 kHz (after the tape, so the saturation harmonics stay inside the band) > [drop-out, take 3] > two beats > limiter -1 dBFS > loudness',
               machine='VHS linear audio, 100 Hz to 10 kHz', guns={}, voices=[], reloads=[], perspective=PERSP)
    for cls, rows in GUNS.items(): man['guns'][cls] = [dict(folder=f, letter=l, what=w) for f, l, w in rows]
    # ONE LOUDNESS PER GUN, NEVER SQUASHED: every take is levelled to the same short-term loudness, set by the quietest take
    # that still peaks under -1 dBFS, so the limiter never has to flatten a shot to make it fit. The SHOTGUN is the top,
    # the RIFLE a dB under, the PISTOL three ('a cheap handgun... armor barely feels it'); THEIRS five under YOURS.
    rendered = {}
    for (cls, persp), picks in SHOTS.items():
        for version in ('a', 'c'):
            rendered[(cls, persp, version)] = [render_shot((f, t, e), persp, version, k) for k, (f, t, e) in enumerate(picks)]
    def room(y): return short_loud_db(FR.norm_peak(y, -1.0))
    G = min(room(y) - OFFSET[cls] - PERSP[persp]['db'] for (cls, persp, v), ys in rendered.items() for y, _i in ys)
    man['loudness'] = dict(top_loud_100ms_db=round(G, 2), offset_db=OFFSET, reload_db=RELOAD_DB)
    for (cls, persp), picks in SHOTS.items():
        for version in ('a', 'c'):
            want = G + OFFSET[cls] + PERSP[persp]['db']
            cuts = [FR.gain_db(y, want - short_loud_db(y)) for y, _i in rendered[(cls, persp, version)]]
            info = [i for _y, i in rendered[(cls, persp, version)]]
            name = 'guns_%s_%s_%s.mp3' % (cls, persp, version)
            pk = FR.write_mp3(os.path.join(OUT, name), sprite(cuts, SLOT), 112)
            man['voices'].append(dict(file=name, gun=cls, perspective=persp, version=version, peak_db_decoded=round(pk, 2), loud_100ms_db=round(want, 2),
                cuts=[dict(k=k, source=bank_id(f, t, e, 'shot'), far=bank_id(f, FAR[f][k % 2], 0, 'far'), gun=f, master=lic[bank_id(f, t, e, 'shot')]['master_track'], far_master=lic[bank_id(f, FAR[f][k % 2], 0, 'far')]['master_track'], onset_s=lic[bank_id(f, t, e, 'shot')]['onset_s'],
                           **measure(y), slap_16th_db=slap_at(np.concatenate([np.zeros(int(LEAD * SR), np.float32), y]), 0.25), slap_8th_db=slap_at(np.concatenate([np.zeros(int(LEAD * SR), np.float32), y]), 0.5), **info[k])
                      for k, ((f, t, e), y) in enumerate(zip(picks, cuts))]))
            print('%-34s peak %6.2f  loud %s' % (name, pk, [round(short_loud_db(y), 1) for y in cuts]))
    for cls, takes in RELOADS.items():
        for version in ('a', 'c'):
            cuts = [render_reload(t, version) for t in takes]
            cuts = [FR.gain_db(y, (G + RELOAD_DB) - short_loud_db(y)) for y in cuts]
            name = 'reload_%s_%s.mp3' % (cls, version)
            pk = FR.write_mp3(os.path.join(OUT, name), sprite(cuts, RSLOT), 112)
            man['reloads'].append(dict(file=name, gun=cls, version=version, peak_db_decoded=round(pk, 2), loud_100ms_db=round(G + RELOAD_DB, 2),
                cuts=[dict(k=k, motions=[dict(source=bank_id(f, t, e, 'motion'), master=lic[bank_id(f, t, e, 'motion')]['master_track'], at_beats=at) for f, t, e, at in take], **measure(y))
                      for k, (take, y) in enumerate(zip(takes, cuts))]))
            print('%-34s peak %6.2f' % (name, pk))
    json.dump(what_plays_now(), open(os.path.join(OUT, 'fight_now.json'), 'w'), indent=1)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('wrote', OUT)

def check():
    man = json.load(open(os.path.join(OUT, 'manifest.json'))); bad = []
    for v in man['voices'] + man['reloads']:
        x, sr = sf.read(os.path.join(OUT, v['file']), dtype='float32')
        if 20 * math.log10(np.abs(x).max() + 1e-12) > -0.9: bad.append(v['file'] + ' peak over -1 dBFS')
        for c in v['cuts']:
            if c['first_1ms_db'] > -40 and v['file'].startswith('guns'): pass
            if c['last_1ms_db'] > -50: bad.append('%s cut %d ends at %s dB (a click)' % (v['file'], c['k'], c['last_1ms_db']))
            if v['version'] == 'a' and c['above_10k'] > 0.05: bad.append('%s cut %d: %.3f above 10 kHz' % (v['file'], c['k'], c['above_10k']))
            if v['version'] == 'a' and c['above_20k'] > 0.01: bad.append('%s cut %d: %.4f above 20 kHz' % (v['file'], c['k'], c['above_20k']))
    print('PASS' if not bad else 'FAIL\n  ' + '\n  '.join(bad))
    return not bad

if __name__ == '__main__':
    if '--bank' in sys.argv: make_bank()
    elif '--check' in sys.argv: sys.exit(0 if check() else 1)
    else: main()

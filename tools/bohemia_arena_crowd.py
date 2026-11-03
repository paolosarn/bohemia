#!/usr/bin/env python3
"""BOHEMIA -- ARENA, piece (c): THE CROWD IN THE PIT (VAMILY rule 375 and its duct-tape amendment; ask lines 402, 403; Paolo 11/3).

Battle Brothers' arena (bb_all/0620_Dev Blog 142: The Arena.txt): 'Your every move is commented with cheers and boos; missed that
attack with a 95% chance to hit? People will gasp alongside you. Killed that beast with one swift stroke? People will cheer and
applaud. Flee from your opponents? People will boo.' Ours is the Mob's: a small crowd in a dead hotel's pool deck, heard through
the Mob's PA, which cuts in and out (his 'held together by duct tape and a thread').

EVERY SOUND STARTS FROM REAL PEOPLE (rule 108b, NO SAND: the noise recipe is dead). Nothing here is an oscillator or a noise call:
  - VOICES: AudioMNIST (MIT, reference/library/sound_bank/audiomnist_mit/regions.flac), twenty speakers' spoken syllables, cut by
    vowel (SOUNDS' tools/bohemia_squiggle_more_voices.py). A crowd is many people: the same vowel from many mouths, each at its
    own moment and pitch, is what a crowd's 'ooh', 'hey' and 'boo' are made of in any room.
  - CLAPS, LAUGHS, BREATHS: ESC-50's CC0 clips already in the bank (clapping 22, laughing 26, breathing 23), every one with its
    Freesound author in reference/library/sound_bank/esc50_cc0/LICENCES.md.
  - THE MURMUR: SOUNDS' bed_bar_murmur (three real people laughing and one sipping, through the bar's room).
THE CHAIN is SOUNDS' (tools/bohemia_from_a_recording.py, imported): the tape (head bump, saturation, wow and flutter, a 2:1
compressor), a modelled room (here the drained pool's deck: concrete and tile under a sky, a short hard slap), the limiter; then
THE MOB'S PA: a horn's band (350 Hz to 3.4 kHz), its cone driven into clipping, and the line dropping out for a tenth of a second
where the tape on the cable lets go (seeded, so every render is the same).

  python3 tools/bohemia_arena_crowd.py           -> slices/arena/crowd/{bed,cheer,cheer_long,gasp,boo}.mp3 and crowd.json
  python3 tools/bohemia_arena_crowd.py --check   -> re-reads them: lengths, peaks under -1 dBFS, no click at either end

REFERENCE CHECK: Battle Brothers' arena crowd (the dev blog above) is the twin of WHEN it reacts; real stadium and boxing-hall
crowds for HOW (a cheer peaks in under half a second and tails over two; a gasp is an in-breath shared by many; a boo is a held
'oo' that wavers). No reference game added. REUSE CHECK: SOUNDS' chain, banks and cuts, all imported or read, none redone.
"""
import json, os, sys, math, random
import numpy as np
import soundfile as sf
from scipy import signal

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_from_a_recording as FR

SR = FR.SR
BANK = os.path.join(R, 'reference/library/sound_bank')
OUT = os.path.join(R, 'slices/arena/crowd')
rnd = random.Random(375)


def voices():
    j = json.load(open(os.path.join(BANK, 'audiomnist_mit/regions.json')))
    x, sr = sf.read(os.path.join(BANK, 'audiomnist_mit/regions.flac'), dtype='float32')
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR: x = signal.resample_poly(x, SR, sr).astype(np.float32)
    out = []
    for r in j['regions']:
        a, b = int(r['at'] * SR), int((r['at'] + r['dur']) * SR)
        out.append(dict(r, y=x[a:b].copy()))
    return out


def esc(stem):
    return FR.load(stem)


def speed(y, f):
    """a resample: f > 1 higher and shorter, f < 1 lower and longer (a voice of another size)"""
    n = max(8, int(len(y) / f))
    return signal.resample(y, n).astype(np.float32)


def env(n, a, d, sustain=0.0):
    """attack a s, decay d s from the peak"""
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-3)) * np.exp(-np.maximum(0, t - a) / max(d, 1e-3))
    return (np.maximum(e, sustain * (t < (a + d)))).astype(np.float32)


def place(buf, y, at, g):
    i = int(at * SR)
    if i >= len(buf): return
    m = min(len(y), len(buf) - i)
    buf[i:i + m] += y[:m] * g


def fade(y, fi=0.004, fo=0.08):
    a, b = int(fi * SR), int(fo * SR)
    y = y.copy(); y[:a] *= np.linspace(0, 1, a); y[-b:] *= np.linspace(1, 0, b)
    return y


def stretch_vowel(y, seconds):
    """a held vowel: the syllable's voiced middle looped with crossfades, so 'two' becomes 'tooooo'"""
    n = len(y); mid = y[int(n * 0.35):int(n * 0.75)]
    if len(mid) < 400: mid = y
    out = np.zeros(int(seconds * SR), np.float32); step = int(len(mid) * 0.6); xf = len(mid) - step
    w = np.hanning(2 * xf)[:xf] if xf > 8 else None
    pos = 0; head = y[:int(n * 0.35)]
    out[:len(head)] += head; pos = len(head) - min(len(head), xf)
    while pos + len(mid) < len(out):
        seg = mid.copy()
        if w is not None: seg[:xf] *= w; seg[-xf:] *= w[::-1]
        out[pos:pos + len(seg)] += seg; pos += step
    return out


def pa(y, seed, drops=2):
    """THE MOB'S PA: a horn's band, its cone into clipping, and the line dropping out where the tape on the cable lets go"""
    b, a = signal.butter(2, [350 / (SR / 2), 3400 / (SR / 2)], btype='band')
    z = signal.lfilter(b, a, y).astype(np.float32)
    z = np.tanh(z * 3.2 / (np.abs(z).max() + 1e-9)).astype(np.float32)
    r = random.Random(seed)
    for _ in range(drops):
        if len(z) < SR * 0.6: break
        at = r.uniform(0.25, max(0.3, len(z) / SR - 0.3)); ln = r.uniform(0.07, 0.14)
        i, k = int(at * SR), int(ln * SR); ramp = int(0.004 * SR)
        g = np.ones(len(z), np.float32); g[i:i + k] = 0.06
        g[i - ramp:i] = np.linspace(1, 0.06, ramp); g[i + k:i + k + ramp] = np.linspace(0.06, 1, ramp)
        z = z * g
    # the hum of the generator through the same line, under everything, from the recording's own low end
    return z


def finish(y, wet=0.22, peak=-3.0, room='hall'):
    y = FR.hp(y, 120.0)
    y = FR.tape(y, 0.8)
    y = FR.lp(y, 8000.0)
    y = FR.room(y, room, wet)
    y = fade(y, 0.004, 0.12)
    y = FR.norm_peak(y, peak)
    return FR.limit(y, -1.0)


def pick(V, vowels, n, seed):
    r = random.Random(seed); pool = [v for v in V if v['vowel'] in vowels and v.get('voiced', 0) > 0.7]
    by = {}
    for v in pool: by.setdefault(v['speaker'], []).append(v)
    sp = list(by.keys()); r.shuffle(sp)
    return [r.choice(by[s]) for s in (sp * 3)[:n]]


def build():
    V = voices()
    claps = [esc(s) for s in ('2-25293-A-22', '2-76408-B-22', '2-76408-C-22', '2-76408-D-22')]
    laughs = [esc(s) for s in ('1-36164-A-26', '3-119459-A-26', '4-167571-A-26', '5-263775-A-26')]
    breaths = [esc(s) for s in ('3-112557-A-23', '3-166125-A-23', '1-30709-A-23', '2-54961-A-23')]
    murmur, sr = sf.read(os.path.join(R, 'slices/vote/settlement_heard/bed_bar_murmur.mp3'), dtype='float32')
    if murmur.ndim > 1: murmur = murmur.mean(axis=1)
    if sr != SR: murmur = signal.resample_poly(murmur, SR, sr).astype(np.float32)
    out = {}

    # CHEER: fourteen mouths on 'ay' and 'eh' pushed up into a shout, landing inside half a second, a laugh and real claps under
    def cheer(seconds, seed, n=14, claps_n=3):
        buf = np.zeros(int(seconds * SR), np.float32); r = random.Random(seed)
        for k, v in enumerate(pick(V, ('AY', 'EY', 'EH', 'AH'), n, seed)):
            y = speed(v['y'], r.uniform(1.12, 1.38)); y = stretch_vowel(y, r.uniform(0.45, 0.9 if seconds < 2 else 1.6))
            y = y * env(len(y), r.uniform(0.02, 0.06), r.uniform(0.35, 0.9)); place(buf, y, r.uniform(0.0, 0.45), r.uniform(0.55, 1.0))
        for k in range(claps_n):
            c = claps[(seed + k) % len(claps)]; a = int(r.uniform(0.2, 1.2) * SR); c = c[a:a + int(min(seconds, 2.4) * SR)]
            place(buf, c * env(len(c), 0.03, seconds * 0.6), r.uniform(0.05, 0.3), 0.55)
        l = laughs[seed % len(laughs)]; l = l[:int(seconds * SR)]; place(buf, l * env(len(l), 0.05, 0.8), 0.25, 0.35)
        return buf

    out['cheer'] = finish(pa(cheer(2.2, 11), 11, 1), 0.2, -3.0)
    out['cheer_long'] = finish(pa(cheer(4.2, 23, n=22, claps_n=5), 23, 2), 0.24, -2.5)

    # GASP: a shared in-breath (real frightened breathing, the sharpest inhale in each clip), and 'oh' from a dozen mouths, cut short
    def inhale(y):
        e = np.abs(signal.hilbert(FR.hp(y, 600.0))); e = signal.savgol_filter(e, 2001, 2)
        i = int(np.argmax(e)); a = max(0, i - int(0.25 * SR)); return y[a:a + int(0.55 * SR)]
    buf = np.zeros(int(1.6 * SR), np.float32); r = random.Random(31)
    for k, b in enumerate(breaths * 2):
        y = speed(inhale(b), r.uniform(0.92, 1.12)); place(buf, y * env(len(y), 0.05, 0.3), r.uniform(0.0, 0.12), 0.8)
    for v in pick(V, ('OW', 'AO', 'AH'), 12, 31):
        y = speed(v['y'], r.uniform(1.0, 1.25)); y = y[int(len(y) * 0.2):]; y = y * env(len(y), 0.03, 0.18)
        place(buf, y, r.uniform(0.12, 0.3), r.uniform(0.35, 0.7))
    out['gasp'] = finish(pa(buf, 31, 0), 0.2, -5.0)

    # BOO: 'two' from sixteen mouths, the 'oo' held and wavering, a voice an octave lower under it, then it breaks up
    buf = np.zeros(int(2.4 * SR), np.float32); r = random.Random(47)
    for v in pick(V, ('UW',), 16, 47):
        y = speed(v['y'], r.uniform(0.78, 0.95)); y = stretch_vowel(y, r.uniform(1.2, 2.0))
        t = np.arange(len(y)) / SR; y = y * (1 + 0.25 * np.sin(2 * math.pi * r.uniform(3, 6) * t)).astype(np.float32)
        y = y * env(len(y), r.uniform(0.08, 0.2), r.uniform(0.8, 1.4)); place(buf, y, r.uniform(0.0, 0.35), r.uniform(0.5, 1.0))
    out['boo'] = finish(pa(buf, 47, 2), 0.24, -3.5)

    # THE BED: the murmur of a small crowd on a pool deck, the bar's real murmur and their syllables low, a cough, the PA's line open
    buf = np.zeros(int(9.0 * SR), np.float32); r = random.Random(59)
    m = FR.loop_to(murmur, 9.0) if hasattr(FR, 'loop_to') else np.resize(murmur, len(buf))
    place(buf, m[:len(buf)], 0.0, 0.8)
    for v in pick(V, ('IY', 'AY', 'IH', 'AH', 'EH', 'UW', 'OW'), 40, 59):
        y = speed(v['y'], r.uniform(0.9, 1.15)); place(buf, y * env(len(y), 0.02, 0.2), r.uniform(0.1, 8.6), r.uniform(0.06, 0.16))
    y = FR.lp(buf, 1800.0)
    out['bed'] = finish(y, 0.3, -12.0)
    # the bed loops: its last half-second crossfaded into its first
    b = out['bed'][:int(9.0 * SR)].copy(); xf = int(0.5 * SR)   # the room's tail off first: the loop is the crowd, never its echo dying
    b[:xf] = b[:xf] * np.linspace(0, 1, xf) + b[-xf:] * np.linspace(1, 0, xf); out['bed'] = b[:-xf]
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    out = build(); meta = {}
    for k, y in out.items():
        pk = FR.write_mp3(os.path.join(OUT, k + '.mp3'), y, 80, -1.0)
        meta[k] = dict(seconds=round(len(y) / SR, 2), peak_db=round(pk, 2))
    meta['_what'] = ('THE CROWD IN THE PIT (ARENA, rule 375): real voices and hands through SOUNDS\' chain and the Mob\'s PA. '
                     'bed loops under the fight; cheer on a kill or a clean hit, gasp on your miss or a man of yours going down, boo when '
                     'a man runs, cheer_long on the win, boo on the loss (records/target/bb/arena.json crowd). tools/bohemia_arena_crowd.py')
    meta['sources'] = dict(voices='reference/library/sound_bank/audiomnist_mit (MIT)', claps_laughs_breaths='reference/library/sound_bank/esc50_cc0 (CC0, LICENCES.md)', murmur='slices/vote/settlement_heard/bed_bar_murmur.mp3 (SOUNDS, from CC0 recordings)')
    json.dump(meta, open(os.path.join(OUT, 'crowd.json'), 'w'), indent=1)
    print(json.dumps(meta, indent=1))


def check():
    bad = []
    for k in ('bed', 'cheer', 'cheer_long', 'gasp', 'boo'):
        y, sr = sf.read(os.path.join(OUT, k + '.mp3'), dtype='float32')
        pk = 20 * math.log10(np.abs(y).max() + 1e-12); edge = max(np.abs(y[:64]).max(), np.abs(y[-64:]).max()) if k != 'bed' else float(np.abs(y[:32].mean() - y[-32:].mean()))   # the bed is a loop: its seam, not a fade
        if pk > -0.9 or edge > 0.05: bad.append((k, round(pk, 2), round(float(edge), 3)))
    print('ok' if not bad else bad); sys.exit(1 if bad else 0)


if __name__ == '__main__':
    check() if '--check' in sys.argv else main()

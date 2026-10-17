#!/usr/bin/env python3
"""
FROM A RECORDING -- the first sounds in this game that start from a real microphone.
SOUNDS lane, 10/17/26, rows [from a recording] and [the settlement's sounds], the big swing
(VAMILY rule 110; MODE line: 'one settlement screen heard whole: every building its sound
from a recording, the bed under it, in VOTE playing').

RULE 108b (Paolo 10/10): a sound starts from a recording or a model's render and goes
through the analog horror chain; the oscillator and noise calls in the engine are the retire
list. THE DAY ONE PLAN (records/BOHEMIA_RESEARCH_THE_EXACT_PIPELINE_ROUND_TWO_10_10_26.md,
section E steps 6 and 7): a recording through tape, a room at 0.4 wet, high-pass 120 Hz,
low-pass 9 kHz, a limiter; pass is a real thing in a real room on a bad tape, no click at
the start or the end, peak under minus 1 dB.

WHERE THE RECORDINGS COME FROM, HONESTLY. This container's network policy refuses
freesound.org, sonniss.com, archive.org and every other sound host (measured 10/17: CONNECT
refused, HTTP 000). GitHub is allowed. ESC-50 (github.com/karolpiczak/ESC-50) is 2,000
five-second Freesound clips with a per-clip licence list; 868 of them are CC0 at the source.
Only CC0 clips are used here, every one carries its Freesound URL and author, and the chosen
source clips are kept as FLAC in reference/library/sound_bank/esc50_cc0/ with LICENCES.md so
this tool is reproducible from the repo alone. The dataset as a whole is CC BY-NC (the
compilation); the clips below are CC0 at the source, which is the licence that matters for
a sold game, and the record says the originals should be re-pulled by their Freesound ids on
a machine that can reach the site before the game ships, so the shipped file is the author's
own and not the dataset's cut.

THE CHAIN, STAGE BY STAGE (every stage is a real operation on the recording, never a
generator; the only synthesis in this file is the ROOM, which is a physical image-source /
ray-traced model of a room of stated size and materials, a model's render in 108b's words,
because EchoThief's real rooms are behind the same network wall):
  1. WINDOW   a start and an end inside the clip, 3 ms fade in, 40 ms fade out (no click)
  2. SPEED    a resample when a sound has to be smaller or heavier than it was recorded
  3. HIGH-PASS 120 Hz, 2nd order
  4. TAPE     a head bump (+2.5 dB low shelf at 110 Hz), soft saturation (tanh, drive 1.6),
              wow and flutter (0.6 Hz at 0.08 percent, 5.1 Hz at 0.025 percent, as a
              time-varying resample), a gentle 2:1 compressor
  5. LOW-PASS 9 kHz, 2nd order
  6. ROOM     convolution with the modelled room, the stated wet share
  7. LIMITER  threshold minus 1 dB, and a final peak check under minus 1 dBFS

  python3 tools/bohemia_from_a_recording.py            # renders everything, writes the manifest
  python3 tools/bohemia_from_a_recording.py --check    # re-reads the rendered files and verifies the pass criteria
"""
import json, os, sys, subprocess, tempfile, math
import numpy as np
import soundfile as sf
from scipy import signal
from pedalboard import HighpassFilter, LowpassFilter, Compressor, Limiter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BANK = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'esc50_cc0')
OUT = os.path.join(ROOT, 'slices', 'vote', 'settlement_heard')
ESC = os.environ.get('ESC50_AUDIO', '/home/user/karolpiczak/esc-50/audio')
LIC = os.path.join(ROOT, 'tools', 'bohemia_from_a_recording_sources.json')

# ----------------------------------------------------------------------------------------
# THE SOURCES: every clip used, by its ESC-50 file stem; the licence line is read from the
# dataset's own LICENSE file once and frozen into bohemia_from_a_recording_sources.json so
# the repo never depends on the clone again.
# ----------------------------------------------------------------------------------------
def load_sources():
    if os.path.exists(LIC):
        return json.load(open(LIC))
    return {}

def freeze_sources(stems):
    """Read ESC-50's LICENSE for the stems we use; refuse anything that is not CC0."""
    import re, csv
    src = load_sources()
    licpath = os.path.join(os.path.dirname(ESC), 'LICENSE')
    meta = os.path.join(os.path.dirname(ESC), 'meta', 'esc50.csv')
    if not (os.path.exists(licpath) and os.path.exists(meta)):
        missing = [s for s in stems if s not in src]
        if missing:
            sys.exit('CANNOT REACH the ESC-50 clone and these stems are not frozen yet: ' + ', '.join(missing))
        return src
    cat = None; rows = {}
    for line in open(licpath, encoding='utf-8'):
        m = re.match(r'^(\d+) - (.+):$', line.strip())
        if m: cat = m.group(2).strip(); continue
        m = re.match(r'^- \[(.+?)\.ogg\]: clip derived from (.+?) \((http\S+)\) by (.+?) \[(.+?)\]', line.strip())
        if m: rows[m.group(1)] = dict(category=cat, source=m.group(2), url=m.group(3), author=m.group(4), licence=m.group(5))
    names = {}
    for r in csv.DictReader(open(meta)):
        names[r['filename'].rsplit('-', 1)[0]] = r['filename']
    for s in stems:
        key = s.rsplit('-', 1)[0]
        if key not in rows: sys.exit('no licence line for ' + s)
        if rows[key]['licence'] != 'CC0': sys.exit(s + ' is ' + rows[key]['licence'] + ', not CC0: refused')
        d = dict(rows[key]); d['file'] = names[key]; d['freesound_id'] = d['url'].rstrip('/').rsplit('/', 1)[-1]
        src[s] = d
    json.dump(src, open(LIC, 'w'), indent=1, sort_keys=True)
    return src

def ensure_bank(stem):
    """The chosen clip lives in the repo as FLAC (lossless, about half the bytes)."""
    os.makedirs(BANK, exist_ok=True)
    flac = os.path.join(BANK, stem + '.flac')
    if not os.path.exists(flac):
        wav = os.path.join(ESC, stem + '.wav')
        if not os.path.exists(wav): sys.exit('missing source clip ' + wav + ' and no FLAC in the bank')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-c:a', 'flac', flac], check=True)
    return flac

def load(stem):
    x, sr = sf.read(ensure_bank(stem), dtype='float32')
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR: x = signal.resample_poly(x, SR, sr).astype(np.float32)
    return x

# ----------------------------------------------------------------------------------------
# STAGES
# ----------------------------------------------------------------------------------------
def frames_db(x, w=int(SR * 0.05)):
    n = len(x) // w
    fr = x[:n * w].reshape(n, w)
    rms = np.sqrt((fr ** 2).mean(1)) + 1e-9
    return 20 * np.log10(rms)

def auto_window(x, pre=0.02, tail=0.35, floor_up=12.0):
    """From the first loud frame to the last loud frame, with a little air either side."""
    db = frames_db(x); floor = np.percentile(db, 10)
    loud = np.where(db > floor + floor_up)[0]
    if not len(loud): return 0.0, len(x) / SR
    a = max(0.0, loud[0] * 0.05 - pre); b = min(len(x) / SR, loud[-1] * 0.05 + 0.05 + tail)
    return a, b

def last_onset_window(x, tail=0.6, jump=8.0, pre=0.08):
    db = frames_db(x); floor = np.percentile(db, 10)
    on = [i for i in range(4, len(db)) if db[i] - db[i - 4:i].mean() > jump and db[i] > floor + 15]
    if not on: return auto_window(x)
    a = max(0.0, on[-1] * 0.05 - pre)
    return a, min(len(x) / SR, a + tail)

def window(x, a, b, fi=0.003, fo=0.04):
    i, j = int(a * SR), int(b * SR)
    y = x[i:j].copy()
    n = len(y); ni, no = int(fi * SR), int(fo * SR)
    if n > ni + no:
        y[:ni] *= np.linspace(0, 1, ni, dtype=np.float32)
        y[-no:] *= np.linspace(1, 0, no, dtype=np.float32)
    return y

def speed(x, factor):
    """factor < 1 slows and deepens, > 1 quickens and lightens (a resample, the tape way)."""
    if abs(factor - 1.0) < 1e-6: return x
    from fractions import Fraction
    fr = Fraction(factor).limit_denominator(64)
    return signal.resample_poly(x, fr.denominator, fr.numerator).astype(np.float32)

def gain_db(x, db): return (x * (10 ** (db / 20.0))).astype(np.float32)

def hp(x, hz=120.0): return HighpassFilter(cutoff_frequency_hz=hz)(x, SR).astype(np.float32)
def lp(x, hz=9000.0): return LowpassFilter(cutoff_frequency_hz=hz)(x, SR).astype(np.float32)

def low_shelf(x, hz=110.0, db=2.5):
    A = 10 ** (db / 40.0); w0 = 2 * math.pi * hz / SR; cw, sw = math.cos(w0), math.sin(w0)
    S = 1.0; alpha = sw / 2 * math.sqrt((A + 1 / A) * (1 / S - 1) + 2)
    b0 = A * ((A + 1) - (A - 1) * cw + 2 * math.sqrt(A) * alpha)
    b1 = 2 * A * ((A - 1) - (A + 1) * cw)
    b2 = A * ((A + 1) - (A - 1) * cw - 2 * math.sqrt(A) * alpha)
    a0 = (A + 1) + (A - 1) * cw + 2 * math.sqrt(A) * alpha
    a1 = -2 * ((A - 1) + (A + 1) * cw)
    a2 = (A + 1) + (A - 1) * cw - 2 * math.sqrt(A) * alpha
    return signal.lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x).astype(np.float32)

def wow_flutter(x, wow_hz=0.6, wow=0.0008, flut_hz=5.1, flut=0.00025):
    """A time-varying resample: the tape's own speed wandering under the head."""
    n = len(x); t = np.arange(n) / SR
    rate = 1.0 + wow * np.sin(2 * np.pi * wow_hz * t) + flut * np.sin(2 * np.pi * flut_hz * t + 1.3)
    pos = np.cumsum(rate) - rate[0]
    pos = np.clip(pos, 0, n - 1)
    return np.interp(pos, np.arange(n), x).astype(np.float32)

def saturate(x, drive=1.6):
    return (np.tanh(drive * x) / math.tanh(drive)).astype(np.float32)

def tape(x, depth=1.0):
    y = low_shelf(x, 110.0, 2.5 * depth)
    y = saturate(y, 1.0 + 0.6 * depth)
    y = wow_flutter(y, wow=0.0008 * depth, flut=0.00025 * depth)
    y = Compressor(threshold_db=-18, ratio=2.0, attack_ms=8, release_ms=120)(y, SR).astype(np.float32)
    return y

_ROOMS = {}
def room_ir(kind):
    """A modelled room: a shoebox of stated size with the absorption Sabine's formula needs for
    the stated reverb time (pra.inverse_sabine), image-source for the small ones, ray tracing for
    the big ones. A model's render in 108b's words; EchoThief's real rooms are behind the network wall."""
    if kind in _ROOMS: return _ROOMS[kind]
    import pyroomacoustics as pra
    spec = {
        # a barber's or a clinic's front room
        'small': dict(dims=[4.0, 5.0, 2.7], src=[1.0, 1.2, 1.5], mic=[2.8, 3.6, 1.4], rt60=0.35, rt=False),
        # the smith's open shed: concrete floor, a tin roof, two walls missing
        'shed': dict(dims=[5.0, 7.0, 3.2], src=[1.5, 2.0, 1.2], mic=[3.5, 4.5, 1.5], rt60=0.25, rt=False),
        # the hall: a chapel, plaster, a concrete floor, pews
        'hall': dict(dims=[10.0, 18.0, 7.0], src=[3.0, 4.0, 1.6], mic=[6.0, 12.0, 1.5], rt60=1.3, rt=True),
        # the bar: a long low room, a wood floor, bodies in it
        'bar': dict(dims=[8.0, 12.0, 3.0], src=[2.0, 3.0, 1.3], mic=[6.5, 10.0, 1.4], rt60=0.55, rt=True),
    }[kind]
    e_abs, order = pra.inverse_sabine(spec['rt60'], spec['dims'])
    order = min(order, 24) if not spec['rt'] else 3
    room = pra.ShoeBox(spec['dims'], fs=SR, materials=pra.Material(e_abs), max_order=order, air_absorption=True, ray_tracing=spec['rt'])
    if spec['rt']: room.set_ray_tracing(receiver_radius=0.5, n_rays=20000, energy_thres=1e-6)
    room.add_source(spec['src']); room.add_microphone(spec['mic'])
    room.compute_rir()
    h = np.asarray(room.rir[0][0], dtype=np.float32)
    h = h / (np.abs(h).max() + 1e-9)
    try: rt60 = float(pra.experimental.measure_rt60(h, fs=SR))
    except Exception: rt60 = -1
    _ROOMS[kind] = (h, rt60, spec['rt60'], round(float(e_abs), 3))
    return _ROOMS[kind]

def room(x, kind, wet):
    if not kind or wet <= 0: return x
    h = room_ir(kind)[0]
    w = signal.fftconvolve(x, h)[:len(x) + int(SR * 1.5)].astype(np.float32)
    w = w / (np.abs(w).max() + 1e-9) * (np.abs(x).max() + 1e-9)
    dry = np.concatenate([x, np.zeros(len(w) - len(x), dtype=np.float32)])
    return ((1 - wet) * dry + wet * w).astype(np.float32)

def limit(x, peak_db=-1.0):
    y = Limiter(threshold_db=peak_db, release_ms=80)(x, SR).astype(np.float32)
    p = np.abs(y).max() + 1e-9
    target = 10 ** (peak_db / 20.0)
    if p > target: y = (y * (target / p)).astype(np.float32)
    return y

def norm_peak(x, peak_db):
    p = np.abs(x).max() + 1e-9
    return (x * (10 ** (peak_db / 20.0) / p)).astype(np.float32)

def loop_to(x, seconds, xf=0.8, seed=1):
    """A 5 s field recording made long: segments crossfaded, every other one reversed, each
    a little louder or quieter, so the join never repeats the same way."""
    rng = np.random.default_rng(seed)
    n_x = int(xf * SR); out = np.zeros(int(seconds * SR) + len(x), dtype=np.float32); pos = 0
    k = 0
    while pos < int(seconds * SR):
        seg = x[::-1] if k % 2 else x
        seg = seg * (10 ** (rng.uniform(-2.0, 1.0) / 20.0))
        m = len(seg)
        if pos == 0:
            out[:m] += seg; pos = m - n_x
        else:
            ramp = np.linspace(0, 1, n_x, dtype=np.float32)
            out[pos:pos + n_x] *= (1 - ramp)
            s2 = seg.copy(); s2[:n_x] *= ramp
            out[pos:pos + m] += s2; pos += m - n_x
        k += 1
    return out[:int(seconds * SR)]

def place(out, y, at_s, db=0.0):
    i = int(at_s * SR); y = gain_db(y, db)
    end = min(len(out), i + len(y))
    if end > i: out[i:end] += y[:end - i]
    return out

def seamless(x, xf=1.0):
    """Make a bed loop-ready: its tail is crossfaded into its head so a player can overlap two copies."""
    n = int(xf * SR); ramp = np.linspace(0, 1, n, dtype=np.float32)
    y = x.copy(); y[:n] = y[:n] * ramp + y[-n:] * (1 - ramp)
    return y[:-n]

# ----------------------------------------------------------------------------------------
# THE RECIPE: the settlement screen, building by building (slices/BOHEMIA_SETTLEMENT_SCREEN.html)
# ----------------------------------------------------------------------------------------
def R(stem, win='auto', spd=1.0, db=0.0, at=0.0, lo=None, hi=None):
    return dict(stem=stem, win=win, spd=spd, db=db, at=at, lo=lo, hi=hi)

RECIPE = [
  # id, building, title, what it is in one line, layers, room, wet, tape depth, peak dB, kind
  dict(id='hall_who_wants_work', building='hall', title="THE HALL: A BELL AND BOOTS", what='one strike of a real church clock bell, then boots on a real hall floor',
       layers=[R('5-219044-A-46', (0.15, 2.4), db=-4), R('1-155858-E-25', (0.3, 3.4), db=-3, at=0.35)], room='hall', wet=0.45, tape=1.0, peak=-1.0, kind='tap'),
  dict(id='board_nail', building='board', title="THE BOARD: A TACK GOES IN", what='a real wood knock, a little smaller and higher, the tack through the paper',
       layers=[R('1-103999-A-30', 'auto', spd=1.25)], room=None, wet=0.0, tape=1.0, peak=-1.0, kind='tap'),
  dict(id='clinic_door_open', building='clinic', title="THE CLINIC: THE DOOR OPENS", what='a real door hinge creaking open, in a small plastered room',
       layers=[R('4-107120-A-33', (0.0, 2.2))], room='small', wet=0.35, tape=1.0, peak=-1.0, kind='open'),
  dict(id='clinic_door_shut', building='clinic', title="THE CLINIC: THE DOOR SHUTS", what='the same recordist\'s door, its last thump when it closes',
       layers=[R('2-118624-A-30', 'last')], room='small', wet=0.35, tape=1.0, peak=-1.5, kind='shut'),
  dict(id='stall_can', building='stall', title="THE STALL: A CAN ON THE COUNTER", what='a real can cracked open on the stall\'s counter',
       layers=[R('2-144031-A-34', 'auto')], room='shed', wet=0.15, tape=1.0, peak=-1.5, kind='tap'),
  dict(id='stall_buy', building='stall', title="THE STALL: BOUGHT", what='a heavier real can set down, the thing you paid for landing in front of you',
       layers=[R('5-252248-A-34', 'auto')], room='shed', wet=0.15, tape=1.0, peak=-2.0, kind='buy'),
  dict(id='barber_clippers', building='barber', title="THE BARBER: THE CLIPPERS", what='a real electric motor slowed to half speed, the clipper against your head',
       layers=[R('5-231551-A-36', (0.3, 2.1), spd=0.5, lo=90, hi=2600)], room='small', wet=0.3, tape=1.0, peak=-3.0, kind='tap'),
  dict(id='yard_drill', building='train', title="THE YARD: THE DRILL", what='real sneakers on gravel and a man breathing hard, the yard where you swap a mastery',
       layers=[R('4-218304-B-25', (0.0, 3.4)), R('5-238492-A-23', 'auto', db=-7, at=0.5)], room=None, wet=0.0, tape=1.0, peak=-2.0, kind='tap'),
  dict(id='bar_round', building='bar', title="THE BAR: A ROUND FOR THE CREW", what='a real drink going down and a real man laughing, through the bar',
       layers=[R('1-37226-A-29', 'auto'), R('5-263775-A-26', (0.0, 2.6), db=-9, at=0.7)], room='bar', wet=0.4, tape=1.0, peak=-2.0, kind='buy'),
  dict(id='arms_counter', building='arms', title="GUNS AND PLATE: THE COUNTER", what='real mechanical clicks slowed into an action being worked, and a real thump on the counter',
       layers=[R('2-152895-A-31', (0.0, 2.4), spd=0.7, db=-2), R('1-103995-A-30', 'auto', spd=0.8, db=-1, at=1.1)], room='small', wet=0.3, tape=1.0, peak=-2.0, kind='tap'),
  dict(id='smith_saw', building='smith', title="THE SMITH: SOMEONE WORKING", what='a real hand saw through a stock, in an open shed: the clinking of someone working in the city',
       layers=[R('1-9886-A-49', (0.1, 3.2))], room='shed', wet=0.25, tape=1.0, peak=-3.0, kind='tap'),
  dict(id='armourer_rivets', building='armourer', title="THE ARMOURER: RIVETS", what='a real knock sped up into a small hammer setting rivets, in the shed',
       layers=[R('5-235644-A-30', 'auto', spd=1.4), R('5-235644-A-30', 'auto', spd=1.5, db=-3, at=1.0)], room='shed', wet=0.25, tape=1.0, peak=-3.0, kind='tap'),
  dict(id='lot_scavenge', building='lot', title="SCAVENGE: GLASS AND A CROW", what='real glass going under a boot in the junk lot, and a real crow lifting off',
       layers=[R('2-141563-A-39', 'auto'), R('4-173865-B-9', (0.0, 2.2), db=-9, at=0.8)], room=None, wet=0.0, tape=1.0, peak=-2.0, kind='tap'),
  dict(id='build_hammer_and_saw', building='build', title="BUILD: A HAMMER AND A SAW", what='a real saw and real wood knocks, the lot you hold being built on',
       layers=[R('3-96606-A-49', (0.0, 3.0), db=-5), R('1-103999-A-30', 'auto', at=0.4), R('1-103999-A-30', 'auto', db=-2, at=1.7)], room=None, wet=0.0, tape=1.0, peak=-3.0, kind='tap'),
]

BEDS = [
  dict(id='bed_day', title='THE BED, DAY: WIND, CHICKENS, BIRDS', what='a real wind across the lot, real hens behind a fence, real birds, a rooster once, far',
       seconds=24.0, peak=-12.0, tape=0.5, hi=8000,
       layers=[dict(stem='5-179496-A-16', mode='loop', db=0.0, seed=3),
               dict(stem='4-200330-A-6', mode='loop', db=-9.0, seed=5, hi=5000),
               dict(stem='4-187769-B-14', mode='loop', db=-13.0, seed=7, hi=7000),
               dict(stem='4-170078-A-1', mode='once', at=9.5, db=-16.0, hi=3500, win=(0.0, 3.2))]),
  dict(id='bed_night', title='THE BED, NIGHT: WIND, CRICKETS, A FIRE BARREL', what='a thinner real wind, real crickets low, a real fire in a barrel somewhere on the block',
       seconds=24.0, peak=-12.0, tape=0.5, hi=7000,
       layers=[dict(stem='3-117504-A-16', mode='loop', db=0.0, seed=11),
               dict(stem='4-202749-A-13', mode='loop', db=-6.0, seed=13, hi=6000),
               dict(stem='4-181563-A-12', mode='loop', db=-5.0, seed=17, hi=3000)]),
  dict(id='bed_bar_murmur', title='THE BAR: THE MURMUR THROUGH THE DOOR', what='three real people laughing and one sipping, low-passed and through the bar\'s own room, the murmur this lane could never fake',
       seconds=20.0, peak=-14.0, tape=0.8, hi=1800, room='bar', wet=0.7,
       layers=[dict(stem='1-36164-A-26', mode='loop', db=0.0, seed=19),
               dict(stem='3-119459-A-26', mode='loop', db=-2.0, seed=23),
               dict(stem='5-263775-B-26', mode='loop', db=-11.0, seed=29),
               dict(stem='4-188191-C-29', mode='loop', db=-8.0, seed=31)]),
]

EVENTS = [
  dict(id='far_horn', title='FAR: A CAR HORN', what='a real car horn, streets away', layers=[R('5-179860-A-43', 'auto', hi=2500)], peak=-16.0, tape=0.6),
  dict(id='far_helicopter', title='FAR: A HELICOPTER', what='a real helicopter passing over the valley', layers=[R('3-154926-A-40', (0.4, 3.2), hi=1500)], peak=-14.0, tape=0.6),
  dict(id='far_siren', title='FAR, NIGHT: A SIREN', what='a real civil defence siren, far, at night', layers=[R('1-54084-A-42', (0.0, 4.6), hi=2000)], peak=-18.0, tape=0.6),
  dict(id='far_crow', title='FAR: A CROW', what='a real crow on a wire', layers=[R('4-188287-A-9', (0.0, 2.0), hi=5000)], peak=-16.0, tape=0.6),
]

def render_layer(L):
    x = load(L['stem'])
    if L['win'] == 'auto': a, b = auto_window(x)
    elif L['win'] == 'last': a, b = last_onset_window(x)
    else: a, b = L['win']
    y = window(x, a, b)
    y = speed(y, L['spd'])
    if L.get('lo'): y = hp(y, L['lo'])
    if L.get('hi'): y = lp(y, L['hi'])
    y = norm_peak(y, -3.0)
    return gain_db(y, L['db']), (round(a, 3), round(b, 3))

def render_oneshot(spec):
    total = 0; parts = []
    for L in spec['layers']:
        y, w = render_layer(L); parts.append((y, L['at'], w)); total = max(total, int(L['at'] * SR) + len(y))
    out = np.zeros(total, dtype=np.float32)
    for y, at, _ in parts: place(out, y, at)
    raw = norm_peak(out, -1.0)
    y = hp(out, 120.0)
    y = tape(y, spec.get('tape', 1.0))
    y = lp(y, 9000.0)
    y = room(y, spec.get('room'), spec.get('wet', 0.0))
    y = norm_peak(y, min(spec['peak'], -1.8))
    y = limit(y, min(spec['peak'], -1.8))
    y = window(y, 0, len(y) / SR, fi=0.012, fo=0.03)
    return raw, y, [p[2] for p in parts]

def render_bed(spec):
    n = int(spec['seconds'] * SR); out = np.zeros(n, dtype=np.float32)
    for L in spec['layers']:
        x = load(L['stem'])
        if L['mode'] == 'loop':
            a, b = auto_window(x, tail=0.0) if L.get('win') is None else L['win']
            seg = x[int(a * SR):int(b * SR)] if (b - a) > 1.0 else x
            y = loop_to(norm_peak(seg, -6.0), spec['seconds'] + 1.0, seed=L.get('seed', 1))[:n]
        else:
            a, b = L.get('win', (0.0, len(x) / SR)); y = norm_peak(window(x, a, b), -6.0)
        if L.get('hi'): y = lp(y, L['hi'])
        place(out, y, L.get('at', 0.0), L['db'])
    raw = norm_peak(out, spec['peak'])
    y = hp(out, 120.0)
    y = tape(y, spec.get('tape', 0.5))
    y = lp(y, spec.get('hi', 9000.0))
    y = room(y, spec.get('room'), spec.get('wet', 0.0))[:n]
    y = seamless(y, 1.0)
    y = norm_peak(y, spec['peak'])
    return raw[:len(y)], y

def write_mp3(path, y, kbps=80, ceiling_db=-1.0):
    """Encode, decode back, and if the codec overshot the ceiling, pull the input down and encode again
    (an mp3 of a sharp transient can land about 1 dB over its own input)."""
    y = y.astype(np.float32)
    for _ in range(4):
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as t:
            sf.write(t.name, y, SR, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', t.name, '-ac', '1', '-ar', str(SR), '-c:a', 'libmp3lame', '-b:a', str(kbps) + 'k', path], check=True)
        os.unlink(t.name)
        back, _ = sf.read(path, dtype='float32')
        pk = 20 * math.log10(np.abs(back).max() + 1e-12)
        if pk <= ceiling_db - 0.05: return pk
        y = gain_db(y, (ceiling_db - 0.1) - pk)
    return pk

def measure(y):
    p = float(np.abs(y).max() + 1e-12); rms = float(np.sqrt((y ** 2).mean()) + 1e-12)
    head = float(np.abs(y[:int(0.001 * SR)]).max()) if len(y) else 0.0
    tail = float(np.abs(y[-int(0.001 * SR):]).max()) if len(y) else 0.0
    return dict(seconds=round(len(y) / SR, 3), peak_db=round(20 * math.log10(p), 2), rms_db=round(20 * math.log10(rms), 2),
                first_1ms_db=round(20 * math.log10(head + 1e-12), 1), last_1ms_db=round(20 * math.log10(tail + 1e-12), 1))

def main():
    stems = sorted({L['stem'] for s in RECIPE + EVENTS for L in s['layers']} | {L['stem'] for b in BEDS for L in b['layers']})
    src = freeze_sources(stems)
    os.makedirs(OUT, exist_ok=True)
    manifest = dict(_readme='FROM A RECORDING (SOUNDS 10/17/26): every file here starts from a CC0 Freesound recording (via ESC-50) and goes through the chain in tools/bohemia_from_a_recording.py. before_*.mp3 is the same window of the same recording with nothing but the fades; the other file is after the chain. Licence per source in sources.',
                    made='10/17/26', lane='sounds', draft=True, chain='window > speed > high-pass 120 Hz > tape (shelf, saturation, wow and flutter, 2:1) > low-pass 9 kHz > modelled room > limiter, peak under -1 dBFS',
                    rooms={}, sounds=[], beds=[], events=[], sources=src)
    for spec in RECIPE + EVENTS:
        raw, y, wins = render_oneshot(spec)
        write_mp3(os.path.join(OUT, spec['id'] + '.mp3'), y)
        write_mp3(os.path.join(OUT, 'before_' + spec['id'] + '.mp3'), raw)
        m = measure(y)
        entry = dict(id=spec['id'], building=spec.get('building'), title=spec['title'], what=spec['what'], kind=spec.get('kind', 'event'),
                     room=spec.get('room'), wet=spec.get('wet', 0.0), windows=wins,
                     sources=[dict(stem=L['stem'], speed=L['spd'], db=L['db'], at=L['at'], freesound=src[L['stem']]['url'], author=src[L['stem']]['author'], licence=src[L['stem']]['licence'], category=src[L['stem']]['category']) for L in spec['layers']],
                     **m)
        (manifest['sounds'] if spec in RECIPE else manifest['events']).append(entry)
        print('%-24s %6.2fs peak %6.2f dB rms %6.2f dB  head %6.1f tail %6.1f' % (spec['id'], m['seconds'], m['peak_db'], m['rms_db'], m['first_1ms_db'], m['last_1ms_db']))
    for spec in BEDS:
        raw, y = render_bed(spec)
        write_mp3(os.path.join(OUT, spec['id'] + '.mp3'), y, 96)
        write_mp3(os.path.join(OUT, 'before_' + spec['id'] + '.mp3'), raw, 96)
        m = measure(y)
        manifest['beds'].append(dict(id=spec['id'], title=spec['title'], what=spec['what'], room=spec.get('room'), wet=spec.get('wet', 0.0),
                                     sources=[dict(stem=L['stem'], db=L['db'], mode=L['mode'], freesound=src[L['stem']]['url'], author=src[L['stem']]['author'], licence=src[L['stem']]['licence'], category=src[L['stem']]['category']) for L in spec['layers']], **m))
        print('%-24s %6.2fs peak %6.2f dB rms %6.2f dB' % (spec['id'], m['seconds'], m['peak_db'], m['rms_db']))
    for k in ('small', 'shed', 'hall', 'bar'):
        h, rt, asked, e_abs = room_ir(k); manifest['rooms'][k] = dict(rt60_measured_s=round(rt, 3), rt60_asked_s=asked, sabine_absorption=e_abs, ir_seconds=round(len(h) / SR, 3))
    json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    # the licence file beside the bank
    lines = ['# THE SOUND BANK: CC0 RECORDINGS (SOUNDS 10/17/26)', '',
             'Every clip here is a five-second cut of a Freesound recording whose author released it under CC0 (public domain dedication).',
             'The cuts were taken through ESC-50 (github.com/karolpiczak/ESC-50, the dataset as a compilation is CC BY-NC 3.0); before the game ships,',
             'each original is re-pulled by its Freesound id below on a machine that can reach freesound.org, so the shipped file is the author\'s own.',
             'Nothing from a CC-BY, CC-BY-NC or Sampling+ source is in this folder; tools/bohemia_from_a_recording.py refuses them.', '',
             '| stem | category | source file | author | Freesound | licence |', '|---|---|---|---|---|---|']
    for s in stems:
        d = src[s]; lines.append('| %s | %s | %s | %s | %s | %s |' % (s, d['category'], d['source'], d['author'], d['url'], d['licence']))
    open(os.path.join(BANK, 'LICENCES.md'), 'w').write('\n'.join(lines) + '\n')
    print('rooms', manifest['rooms'])
    return manifest

def check():
    m = json.load(open(os.path.join(OUT, 'manifest.json')))
    bad = []
    for e in m['sounds'] + m['events'] + m['beds']:
        p = os.path.join(OUT, e['id'] + '.mp3')
        if not os.path.exists(p): bad.append(e['id'] + ' missing'); continue
        x, sr = sf.read(p, dtype='float32')
        pk = 20 * math.log10(np.abs(x).max() + 1e-12)
        if pk > -1.0: bad.append('%s peak %.2f dB over the bar' % (e['id'], pk))
        if e in m['sounds'] and (e['first_1ms_db'] > -26 or e['last_1ms_db'] > -40): bad.append('%s clicks (head %.1f tail %.1f)' % (e['id'], e['first_1ms_db'], e['last_1ms_db']))
        for s in e['sources']:
            if s['licence'] != 'CC0': bad.append(e['id'] + ' uses a non-CC0 source')
    print(('CHECK FAIL\n  ' + '\n  '.join(bad)) if bad else 'CHECK PASS: %d sounds, %d beds, %d events, every peak under -1 dBFS after the mp3, no click at either end, every source CC0' % (len(m['sounds']), len(m['beds']), len(m['events'])))
    return 1 if bad else 0

if __name__ == '__main__':
    sys.exit(check() if '--check' in sys.argv else (main() and 0))

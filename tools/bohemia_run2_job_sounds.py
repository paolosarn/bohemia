#!/usr/bin/env python3
"""
THE BUSY TOWN TALKS: THE SOUNDS OF THE JOBS (RUN TWO, 10/24/26, row [the busy town talks], rules 131 and 135).

Paolo 10/23 (rule 131): 'I would like to see characters you can't even interact with walking around the settlement,
doing something, doing important things.' The row: 'the background walkers at their jobs make the small sounds of the
job (a crate set down, a hammer, a pot, a broom)... sounds from SOUNDS' bank; you place and time them.'

REUSE-FIRST: every clip here is a window of a CC0 recording already in SOUNDS' bank
(reference/library/sound_bank/esc50_cc0/, its licence lines frozen in tools/bohemia_from_a_recording_sources.json),
rendered by SOUNDS' own chain (tools/bohemia_from_a_recording.py: window, speed, high-pass, tape, low-pass, limiter),
outdoors (no room: a man working in the street, not in a shed). Nothing is generated (9/23: no sand). Each clip is ONE
event (one crate down, one hammer strike, one broom stroke, one boot); the screen plays it on the beat, as many times as
the job takes, pitched a little each time so a hammer never sounds like a loop.

  python3 tools/bohemia_run2_job_sounds.py           # renders every clip into slices/settlement/heard_jobs/ + manifest
  python3 tools/bohemia_run2_job_sounds.py --check   # re-reads the files: no click at either end, peak under -1 dBFS
"""
import json, os, sys, math
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_from_a_recording as F   # SOUNDS' chain, unchanged

ROOT = F.ROOT
OUT = os.path.join(ROOT, 'slices', 'settlement', 'heard_jobs')
R = F.R

# id, the job it belongs to, what it is in one line, its layers (stem, window s, speed, lo/hi), tape depth, peak dB
RECIPE = [
  dict(id='crate_a', job='crate', what='a crate set down on dirt: a real big wood door knock, slowed into a heavy box landing',
       layers=[R('2-133889-A-30', (0.20, 0.80), spd=0.62, lo=60, hi=3200)], tape=1.0, peak=-3.0),
  dict(id='crate_b', job='crate', what='a second crate, a real knock on a drum shell slowed into a lighter box',
       layers=[R('1-103995-A-30', (0.00, 0.20), spd=0.58, lo=60, hi=3000)], tape=1.0, peak=-3.0),
  dict(id='hammer_a', job='hammer', what='one hammer strike on a board: a real door knock, the first of four',
       layers=[R('5-235644-A-30', (0.13, 0.33), spd=1.0, lo=150)], tape=1.0, peak=-3.0),
  dict(id='hammer_b', job='hammer', what='one hammer strike, a different knock of the same hand, so two strikes never match',
       layers=[R('5-235644-A-30', (0.50, 0.69), spd=1.06, lo=150)], tape=1.0, peak=-3.0),
  dict(id='pot_a', job='pot', what='a pot on a grate: a real heavy can set down, slowed into a cooking pot',
       layers=[R('5-252248-A-34', (0.05, 0.45), spd=0.78, lo=120)], tape=1.0, peak=-3.0),
  dict(id='pot_b', job='pot', what="a lid on the pot: a real soda can's tab, slowed into a tin lid",
       layers=[R('2-144031-A-34', (0.02, 0.24), spd=0.72, lo=160)], tape=1.0, peak=-3.0),
  dict(id='broom_a', job='broom', what='one broom stroke: a real sneaker scuffing gravel, the low end taken off so it is bristles',
       layers=[R('4-218304-B-25', (1.10, 1.42), spd=1.0, lo=1400, hi=8000)], tape=0.7, peak=-4.0),
  dict(id='broom_b', job='broom', what='the stroke back, another scuff of the same gravel',
       layers=[R('4-218304-B-25', (2.04, 2.38), spd=0.94, lo=1400, hi=8000)], tape=0.7, peak=-4.0),
  dict(id='boot_a', job='guard', what="the night guard's boot: a real step on a factory hall's concrete",
       layers=[R('1-155858-E-25', (0.36, 0.62), spd=0.92, lo=90)], tape=1.0, peak=-3.0),
  dict(id='boot_b', job='guard', what='his other boot, the next step of the same walker',
       layers=[R('1-155858-E-25', (0.90, 1.16), spd=0.92, lo=90)], tape=1.0, peak=-3.0),
  dict(id='fire', job='fire', what='a cook fire after dark: a real fire crackling, two seconds of it',
       layers=[R('4-181563-A-12', (0.40, 2.60), spd=1.0, lo=200, hi=6500)], tape=0.8, peak=-6.0),
]


def render():
    os.makedirs(OUT, exist_ok=True)
    src = F.load_sources()
    out = []
    for spec in RECIPE:
        spec = dict(spec, room=None, wet=0.0)
        raw, y, wins = F.render_oneshot(spec)
        pk = F.write_mp3(os.path.join(OUT, spec['id'] + '.mp3'), y, kbps=64, ceiling_db=-1.0)
        st = spec['layers'][0]['stem']; s = src.get(st, {})
        out.append(dict(id=spec['id'], job=spec['job'], what=spec['what'], seconds=round(len(y) / F.SR, 3), peak_db=round(pk, 2),
                        sources=[dict(stem=L['stem'], window=list(w), speed=L['spd'], author=src.get(L['stem'], {}).get('author'),
                                      freesound=src.get(L['stem'], {}).get('url'), licence=src.get(L['stem'], {}).get('licence'))
                                 for L, w in zip(spec['layers'], wins)]))
        if s.get('licence') != 'CC0': sys.exit(st + ' is not CC0 in the frozen list: refused')
        print('%-9s %-7s %.2f s  peak %.1f dB' % (spec['id'], spec['job'], len(y) / F.SR, pk))
    man = dict(_readme='RUN TWO [the busy town talks] 10/24: one event per file, played on the beat by slices/BOHEMIA_SETTLEMENT_SCREEN.html '
                       '(BUSY_HEARD). Every source is CC0 at Freesound through ESC-50, from SOUNDS\' bank, through SOUNDS\' chain '
                       '(tools/bohemia_from_a_recording.py), outdoors. Made by tools/bohemia_run2_job_sounds.py.',
               lane='RUN TWO', made='10/24/26', clips=out)
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)


def check():
    bad = 0
    man = json.load(open(os.path.join(OUT, 'manifest.json')))
    for c in man['clips']:
        y, sr = sf.read(os.path.join(OUT, c['id'] + '.mp3'), dtype='float32')
        if y.ndim > 1: y = y.mean(1)
        pk = 20 * math.log10(np.abs(y).max() + 1e-12)
        n = int(sr * 0.003)
        head = 20 * math.log10(np.abs(y[:n]).max() + 1e-12); tail = 20 * math.log10(np.abs(y[-n:]).max() + 1e-12)
        ok = pk <= -1.0 and head < pk - 20 and tail < pk - 20
        bad += 0 if ok else 1
        print('%s %-9s peak %.1f  first 3 ms %.1f  last 3 ms %.1f' % ('ok ' if ok else 'BAD', c['id'], pk, head, tail))
    print('%d of %d clean' % (len(man['clips']) - bad, len(man['clips'])))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    check() if '--check' in sys.argv else render()

#!/usr/bin/env python3
"""
THE MACHINE PARTY -- the machine that plays inside his songs (SOUNDS, 10/19/26, row [the machine party]).

RULE 121(k), Paolo 10/19: 'Remodel everything 3D grimey Crashbox analog horror machine party vibes. And the music too
man.' Rule 119: a song is made with his songs' own machine (MLOOPS, synthV, drumV, SONG_ARR), read and reused, never
edited. The bar: his REPO MAN and NIGHT FREIGHT (his 10/18 YES: 'good direction, I still like REPO MAN a lot, but I'm
fucking with it heavy').

SO THE SONG IS HIS AND THE MACHINE IS REAL. His engine plays his row note for note; this tool cuts the machine that
plays along with it, every piece from a real recording of a real machine (CC0 at the source, through ESC-50 on GitHub,
the one sound host this box reaches), and nothing synthesised:

  press   his kick, doubled: a coupling slamming between two train wagons (felix.blume, Argentina), two strikes so no
          two land the same, each chosen because it peaks inside 12 ms and a third of it sits above 350 Hz. His BOOM
          kick is a sine falling 55 to 30 Hz: on a phone's speaker it is nearly not there; the press is what the phone
          hears. (A door slam from the same series was cut first and dropped: 95 percent of it is under 350 Hz.)
  relay   his hat, doubled: the ticks of a Soviet electromechanical clock, the 'Yantar' (ST303), three takes.
  clank   the party's stroke in his D sections: steel on steel between the same wagons, two takes.
  bed     the room the song plays in: a washing machine's drum on its spin cycle (GJOS), a motor whining at 199.73 Hz,
          steady to the hundredth of a hertz for five seconds; slowed 1.9 percent so it whines on G3 (196.00 Hz), REPO
          MAN's own G, and made loop-ready. The engine moves its speed with his key moves, so the machine changes gear
          when his song does.
  hall    a modelled room the whole song plays inside (the from-a-recording tool's own 'hall': 10 x 18 x 7 m, concrete,
          RT60 1.3 s, ray traced), one grime over everything (Klubnika's rule: 'dirty and grimy leaks to every corner,
          which blends everything together').

  python3 tools/bohemia_sounds_machine_party.py           # cuts the kit into slices/vote/songs/machine_party_kit/
  python3 tools/bohemia_sounds_machine_party.py --check   # re-reads the kit and its manifest, exits 1 on any drift

The clips are banked as FLAC in reference/library/sound_bank/esc50_cc0/ with their licence lines (LICENCES.md), so
the kit is reproducible from the repo alone. ESC50_AUDIO points at a folder of ESC-50 WAVs only the first time.
"""
import json, os, sys, hashlib
import numpy as np
import soundfile as sf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_from_a_recording as R   # REUSE-FIRST: the bank, the licences, the window, the speed, the room

ROOT = R.ROOT
SR = R.SR
KIT = os.path.join(ROOT, 'slices', 'vote', 'songs', 'machine_party_kit')

# Each hit: the clip, where its onset was found (seconds, by the onset search below), and how long it rings.
HITS = {
    'press_1': dict(stem='4-165845-B-45', near=1.906, ring=0.34, why='a coupling slamming between two wagons'),
    'press_2': dict(stem='4-165845-B-45', near=3.357, ring=0.34, why='the same coupling, the next slam'),
    'relay_1': dict(stem='3-171041-A-38', near=0.155, ring=0.11, why='the Yantar clock, a tick'),
    'relay_2': dict(stem='3-171041-A-38', near=0.544, ring=0.11, why='the Yantar clock, the next tick'),
    'relay_3': dict(stem='3-171041-A-38', near=0.953, ring=0.11, why='the Yantar clock, a heavier tick'),
    'clank_1': dict(stem='4-165845-B-45', near=3.741, ring=0.30, why='steel on steel between two wagons'),
    'clank_2': dict(stem='4-165845-A-45', near=0.020, ring=0.30, why='steel on steel, the other wagon'),
}
BED = dict(stem='5-207811-A-35', whine=199.73, target=196.00, a=0.2, b=4.9, hp=90.0, lp=6000.0,
           why='a washing machine on its spin cycle, the motor whining at 199.73 Hz, slowed onto G3')
STEMS = sorted({h['stem'] for h in HITS.values()} | {BED['stem']})


def onset(x, near, search=0.03):
    """The sample where the hit starts: the steepest rise of a 2 ms envelope within 30 ms of where it was found."""
    a, b = int(max(0.0, near - search) * SR), int((near + search) * SR)
    seg = np.abs(x[a:b]); w = int(0.002 * SR)
    env = np.convolve(seg, np.ones(w) / w, 'same')
    rise = np.diff(env)
    return a + int(np.argmax(rise))


def cut_hit(spec):
    x = R.load(spec['stem'])
    if spec['stem'].endswith('-45'):
        # A train is never quiet between strikes, so the steepest rise can be a rattle before the slam; the slam is the
        # loudest sample within 40 ms, and the cut starts 6 ms before it, so the press lands with his kick, not a flam.
        a0, b0 = int((spec['near'] - 0.01) * SR), int((spec['near'] + 0.04) * SR)
        i = a0 + int(np.argmax(np.abs(x[a0:b0])))
        a = max(0, i - int(0.006 * SR))
    else:
        i = onset(x, spec['near'])
        a = max(0, i - int(0.004 * SR))                 # 4 ms of air before the strike
    y = R.window(x, a / SR, a / SR + spec['ring'], fi=0.002, fo=min(0.08, spec['ring'] * 0.4))
    y = R.hp(y, 40.0)
    return R.norm_peak(y, -1.0), a / SR


def cut_bed():
    x = R.load(BED['stem'])
    y = R.window(x, BED['a'], BED['b'], fi=0.01, fo=0.01)
    y = R.speed(y, BED['target'] / BED['whine'])        # slower and lower, the tape way: the whine lands on G3
    y = R.lp(R.hp(y, BED['hp']), BED['lp'])
    y = R.seamless(y, 0.6)
    return R.norm_peak(y, -6.0)


def whine_hz(y):
    N = 1 << 20; X = np.abs(np.fft.rfft(y * np.hanning(len(y)), N)); F = np.fft.rfftfreq(N, 1 / SR)
    m = (F > 170) & (F < 230)
    return float(F[m][np.argmax(X[m])])


def md5(p): return hashlib.md5(open(p, 'rb').read()).hexdigest()


def write_wav(name, y):
    p = os.path.join(KIT, name + '.wav')
    sf.write(p, y.astype(np.float32), SR, subtype='PCM_16')
    return p


def build():
    os.makedirs(KIT, exist_ok=True)
    src = R.freeze_sources(STEMS)
    R.write_licences(src)
    man = dict(_readme='THE MACHINE PARTY KIT (SOUNDS 10/19/26, row [the machine party]): real machines cut from CC0 '
                       'recordings, played by engine/bohemia_machine_party.js on his own engine\'s drum calls. Made by '
                       'tools/bohemia_sounds_machine_party.py; --check re-reads every file.',
               made='10/19/26', lane='sounds', draft=True, sr=SR, files={})
    for name, spec in HITS.items():
        y, at = cut_hit(spec)
        p = write_wav(name, y)
        d = src[spec['stem']]
        man['files'][name] = dict(stem=spec['stem'], at=round(at, 4), seconds=round(len(y) / SR, 3), why=spec['why'],
                                  author=d['author'], url=d['url'], licence=d['licence'], md5=md5(p))
    bed = cut_bed()
    p = write_wav('bed', bed)
    d = src[BED['stem']]
    man['files']['bed'] = dict(stem=BED['stem'], seconds=round(len(bed) / SR, 3), why=BED['why'],
                               whine_hz=round(whine_hz(bed), 2), speed=round(BED['target'] / BED['whine'], 5),
                               author=d['author'], url=d['url'], licence=d['licence'], md5=md5(p))
    h, rt60, want, absorb = R.room_ir('hall')
    h = h[:int(SR * 2.0)].copy(); h[-int(0.2 * SR):] *= np.linspace(1, 0, int(0.2 * SR), dtype=np.float32)
    p = write_wav('hall', R.norm_peak(h, -1.0))
    man['files']['hall'] = dict(model='pyroomacoustics shoebox, 10 x 18 x 7 m, ray traced', rt60_wanted=want,
                                rt60_measured=round(rt60, 3), seconds=2.0, md5=md5(p))
    json.dump(man, open(os.path.join(KIT, 'manifest.json'), 'w'), indent=1)
    for k, v in man['files'].items():
        print('%-8s %s' % (k, {kk: vv for kk, vv in v.items() if kk in ('stem', 'at', 'seconds', 'whine_hz', 'rt60_measured')}))
    return man


def check():
    man = json.load(open(os.path.join(KIT, 'manifest.json')))
    src = R.load_sources(); bad = 0
    for k, v in man['files'].items():
        p = os.path.join(KIT, k + '.wav')
        if not os.path.exists(p) or md5(p) != v['md5']:
            print('DRIFT ' + k); bad += 1; continue
        if 'stem' in v and src.get(v['stem'], {}).get('licence') != 'CC0':
            print('NOT CC0 ' + k); bad += 1
        y, sr = sf.read(p, dtype='float32')
        if sr != SR or np.abs(y).max() > 10 ** (-0.9 / 20): print('LEVEL ' + k); bad += 1
    print('kit check: %d files, %d bad' % (len(man['files']), bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(check() if '--check' in sys.argv else (build() and 0))

#!/usr/bin/env python3
"""
THE SQUIGGLE, MANY MORE VOICES, EACH A REAL PERSON (SOUNDS 10/25/26, row [the PC playtest: the sound's part], rule 164 item
20; Paolo on his PC, 10/24: 'they're getting repetitive, not that different from each other').

MEASURED BEFORE: every squiggle in the game was ONE woman (LJ Speech), moved by Praat into his six families of 8/11, every
one pitched between 168 and 252 Hz (the 8/11 envelope). Seven lines in a town drew two of the six. So a cartel boss, a kid
and the woman at the stall were the same reader a few semitones apart: of course they were not that different.

THE FIX IS MORE REAL PEOPLE, NOT MORE KNOBS. The ear tells people apart by pitch first, then the vocal tract (formant
dispersion), then voice quality (the research the 8/12 casting already cites); a playback rate moves the first only. So
the new voices are new PEOPLE: AudioMNIST (Becker et al. 2018, github.com/soerenab/AudioMNIST, MIT licence, 60 speakers
each saying the ten digits fifty times, 48 kHz), the one multi-speaker set this box reaches (github only; huggingface,
openslr, festvox, zenodo refused, measured 10/25). Twenty of the sixty, picked by MEASURE for spread (pitch 77 to 247 Hz,
F2 1,280 to 1,990 Hz) and by where they come from: fourteen men and six women, from Germany (one of them 61), Italy, South
Africa, Korea, Spain, Chennai, Egypt, China, Delhi, Syria, Brazil, Denmark, France, a Tamil woman. Their own voices are
kept (no 'Change gender'): a low man is a low man.

  --cut     AM_SRC=<a folder of AudioMNIST speaker folders NN/D_NN_K.wav>
            1. ALIGN: each digit's phones with PocketSphinx (its own English model, the word known), 10 ms frames.
            2. CHOOSE: every syllable a digit holds (a consonant and the vowel it opens, 'th r' and 's' clusters kept whole,
               a word that opens on a vowel is the vowel), voiced (Praat finds a pitch in 60 percent of it); then each of
               the 26 letters takes TAKES_NEW of them by the sound nearest its own (z is zero's 'zi', t is two's 'tu', a is
               eight's 'ei', b and p fall to the lips of 'one', d g k q to the 't' of two, m to the 'n' of nine), the
               rarest letter first, a take shared by two letters only when the digits hold no other.
            3. BANK: each syllable with 40 ms of its own recording either side, one FLAC per run and its JSON, in
               reference/library/sound_bank/audiomnist_mit/ with LICENCES.md (the MIT notice and every speaker).
  (no flag) RENDER: per speaker, its OWN voice: re-timed to its letter slot (Praat's PSOLA 'Lengthen', pitch kept), the
            lane's tape and the small room (tools/bohemia_from_a_recording.py, REUSE-FIRST, as the six), the band shut at
            7.2 kHz so the game hears a click as energy where a voice has none, true zero at both ends, one loudness;
            his own tape colour (a tilt at 2.5 kHz from the six's range, the band's top at 4.2, 4.7 or 5.2 kHz: darker than the
            six's, because the browser's resampler folds a real fricative's brightness into a click when it slows one),
            seeded from his id,
            one sprite slices/voice_heard/squiggle_more.mp3, its takes written into index.json under 'more' (the first
            sprite and his six are untouched, so the first voices load exactly as before and the more come after).
  --check   re-reads the more sprite: every take there, ends on zero, nothing over -1 dBFS, every letter in every family.
"""
import json, math, os, re, sys
import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_from_a_recording as R                  # the lane's own chain (REUSE-FIRST); SR 44100
import bohemia_squiggle_from_a_recording as Q         # the six's own stages: high_shelf, band_off, zero_ends, loud_rms_db

SR = R.SR
BANK = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'audiomnist_mit')
OUT = os.path.join(ROOT, 'slices', 'voice_heard')
AM_SRC = os.environ.get('AM_SRC', '')
MARGIN = 0.040
TAKES_NEW = 2
WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
# the twenty, by measure (pitch, F2) and by where they are from; f0/F2 are the probe's medians (two digits each)
SPEAKERS = [
    ('46', 'm', 30, 'Germany'), ('27', 'm', 31, 'Italy'), ('41', 'm', 30, 'South Africa'), ('09', 'm', 35, 'South Korea'),
    ('44', 'm', 61, 'Germany'), ('38', 'm', 32, 'Spain'), ('15', 'm', 28, 'Chennai'), ('32', 'm', 23, 'Egypt'),
    ('24', 'm', 26, 'China'), ('19', 'm', 23, 'Delhi'), ('18', 'm', 25, 'Syria'), ('25', 'm', 22, 'Brazil'),
    ('42', 'm', 29, 'Syria'), ('51', 'm', 26, 'Germany'),
    ('60', 'f', 27, 'Chennai, Tamil'), ('47', 'f', 23, 'Denmark'), ('26', 'f', 22, 'China'), ('52', 'f', 34, 'France'),
    ('28', 'f', 28, 'Germany'), ('56', 'f', 24, 'Germany'),
]
VOWELS = Q.VOWELS
# the sound nearest each letter in what ten digits hold: onsets first (by preference), then a vowel fallback
NEAR = {
    'a': ['EY', 'AH', 'AY'], 'e': ['IY', 'EH'], 'i': ['IH', 'AY'], 'o': ['OW', 'AO'], 'u': ['UW', 'AH'], 'y': ['IY', 'Z'],
    'b': ['W', 'F'], 'p': ['F', 'W'], 'm': ['N', 'W'], 'n': ['N'], 'w': ['W'], 'v': ['V', 'F'], 'f': ['F'],
    'z': ['Z'], 's': ['S'], 'c': ['S', 'T'], 'x': ['S', 'Z'], 'k': ['T', 'TH'], 'q': ['T'], 'g': ['T', 'Z'], 'd': ['T'],
    't': ['T'], 'h': ['TH', 'F'], 'j': ['Z', 'S'], 'l': ['R', 'W'], 'r': ['R'],
}
CLUSTER = {'R', 'L', 'W', 'Y'}
# THE TOP OF A REAL VOICE'S BAND, darker than the six's (5.2, 6.2, 7.2 kHz). MEASURED 10/25 by the six's own click ruler:
# these recordings' consonants are mostly the digits' fricatives (s, z, f, th, v), bright up to the top of the band, and
# when the game slows a syllable (the sag at a line's end, a calm man's mood: rates near 0.7) the browser's own resampler
# mirrors that brightness up past 13 kHz: 6 'clicks' in 60 lines at a 7.2 kHz top, 0 at these. A worn radio, in the law.
REAL_TOP = {'triangle': 4200.0, 'square': 4700.0, 'sawtooth': 5200.0}       # a consonant before one of these still opens the vowel after it ('th r ee')


def die(msg):
    print('THE SQUIGGLE, MORE VOICES: ' + msg); sys.exit(2)


def align16(y16, word):
    from pocketsphinx import Decoder
    pcm = (np.clip(y16, -1, 1) * 32767).astype('<i2').tobytes()
    d = Decoder(samprate=16000, bestpath=False, loglevel='ERROR')
    d.set_align_text(word)
    d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
    d.set_alignment()
    d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
    out = []
    for w in d.get_alignment():
        for p in w:
            if w.name in ('<sil>', '<s>', '</s>') or p.name == 'SIL': continue
            out.append((p.name, p.start / 100.0, (p.start + p.duration) / 100.0))
    return out


def syllables(ph):
    """every syllable a word holds: (onset phone, vowel phone, start, vowel start, vowel end)"""
    out = []
    for j, (name, a, b) in enumerate(ph):
        if name in VOWELS:
            if j == 0: out.append((name, name, a, a, b))        # a word that opens on its vowel ('eight')
            continue
        k = j + 1
        if k < len(ph) and ph[k][0] in CLUSTER and ph[k][0] != name and k + 1 < len(ph) and ph[k + 1][0] in VOWELS: k += 1
        if k < len(ph) and ph[k][0] in VOWELS and (k == j + 1 or ph[j + 1][0] in CLUSTER):
            out.append((name, ph[k][0], a, ph[k][1], ph[k][2]))
    return out


def padded(p):
    """an AudioMNIST file is cut tight to the word: 60 ms of true silence either side, so a word's first consonant keeps
       its 40 ms margin (measured 10/25: without it the onset of 'two', 'four', 'five' and 'three' was dropped in 9 of 10)"""
    x, sr = sf.read(p, dtype='float32')
    if x.ndim > 1: x = x[:, 0]
    z = np.zeros(int(0.06 * sr), dtype=np.float32)
    return np.concatenate([z, x, z]), sr


def candidates_of(spk):
    import parselmouth
    cands = []
    for dg, word in enumerate(WORDS):
        for k in range(0, 50):
            p = os.path.join(AM_SRC, spk, '%d_%s_%d.wav' % (dg, spk, k))
            if not os.path.exists(p): continue
            x, sr = padded(p)
            y16 = signal.resample_poly(x, 16000, sr)
            try: ph = align16(y16, word)
            except Exception: continue
            snd = parselmouth.Sound(x.astype(np.float64), sr)
            for (on, vow, s, va, vb) in syllables(ph):
                e = va + min(0.16, (vb - va) * 0.85) if on != vow else min(vb, s + 0.18)
                if vb - va < 0.05 or s - MARGIN < 0 or e + MARGIN > snd.duration: continue
                vs = Q.voiced_share(snd, va, e)
                if vs < 0.6: continue
                cands.append(dict(file=os.path.basename(p), word=word, take=k, onset=on, vowel=vow, s=round(s, 3), e=round(e, 3),
                                  voiced=round(vs, 2), src_sr=sr))
    return cands


def cut():
    import parselmouth
    if not AM_SRC or not os.path.isdir(AM_SRC): die('AM_SRC is not a folder of AudioMNIST speaker folders')
    meta = json.load(open(os.path.join(AM_SRC, 'audioMNIST_meta.txt'))) if os.path.exists(os.path.join(AM_SRC, 'audioMNIST_meta.txt')) else {}
    os.makedirs(BANK, exist_ok=True)
    allreg, pieces, at = [], [], 0.0
    gap = np.zeros(int(0.05 * SR), dtype=np.float32)
    report = []
    from multiprocessing import Pool
    with Pool(max(1, (os.cpu_count() or 2))) as pool:
        ALL = dict(zip([s[0] for s in SPEAKERS], pool.map(candidates_of, [s[0] for s in SPEAKERS])))
    for spk, sex, age, where in SPEAKERS:
        cands = ALL[spk]
        if not cands: die('no syllable for speaker ' + spk)
        by_on = {}
        for c in cands: by_on.setdefault(c['onset'], []).append(c)
        for v in by_on.values(): v.sort(key=lambda c: (-c['voiced'], abs((c['e'] - c['s']) - 0.17), c['file']))
        chosen, used = {}, {}
        for letter in sorted(NEAR, key=lambda L: sum(len(by_on.get(o, [])) for o in NEAR[L])):
            got = []
            for o in NEAR[letter]:
                for c in by_on.get(o, []):
                    tag = (c['file'], c['s'])
                    if tag in used or any(g['file'] == c['file'] for g in got): continue
                    got.append(c); used[tag] = letter
                    if len(got) == TAKES_NEW: break
                if len(got) == TAKES_NEW: break
            if len(got) < TAKES_NEW:     # the digits hold no other: share a take another letter has, never the same one twice here
                pool = [c for o in NEAR[letter] for c in by_on.get(o, [])] or [c for v in by_on.values() for c in v]
                for c in pool:
                    if any(g is c for g in got): continue
                    got.append(c)
                    if len(got) == TAKES_NEW: break
            chosen[letter] = got
        # bank: every distinct syllable once; letters point at them
        ids = {}
        for letter in sorted(chosen):
            for c in chosen[letter]:
                tag = (c['file'], c['s'])
                if tag not in ids:
                    x, sr = padded(os.path.join(AM_SRC, spk, c['file']))
                    x = R.speed(x, sr / float(SR)) if sr != SR else x
                    i, j = int((c['s'] - MARGIN) * SR), int((c['e'] + MARGIN) * SR)
                    seg = x[i:j].copy()
                    ids[tag] = len(allreg)
                    allreg.append(dict(speaker=spk, at=round(at, 4), dur=round(len(seg) / SR, 4), margin=MARGIN, letters=[], **c))
                    pieces += [seg, gap]; at += (len(seg) + len(gap)) / SR
                allreg[ids[tag]]['letters'].append(letter)
        m = meta.get(spk, {})
        report.append('  %s %s %s %s: %d syllables from %d candidates, onsets %s' % (spk, sex, age, where, len(ids), len(cands),
                      ' '.join('%s:%d' % (o, len(v)) for o, v in sorted(by_on.items()))))
    sf.write(os.path.join(BANK, 'regions.flac'), np.concatenate(pieces), SR, subtype='PCM_16')
    json.dump(dict(_readme='THE SQUIGGLE, MORE VOICES: the syllables cut from AudioMNIST (MIT), each with 40 ms of its own recording '
                   'either side; at/dur in regions.flac, s/e in the source file with 60 ms of silence before it (tools/bohemia_squiggle_more_voices.py --cut)',
                   sr=SR, takes=TAKES_NEW, speakers=[dict(id=s, sex=x, age=a, where=w) for s, x, a, w in SPEAKERS], regions=allreg),
              open(os.path.join(BANK, 'regions.json'), 'w'), indent=1)
    with open(os.path.join(BANK, 'LICENCES.md'), 'w') as f:
        f.write('# AUDIOMNIST, MIT LICENCE (the squiggle\'s twenty more voices, SOUNDS 10/25/26)\n\n'
                'Source: AudioMNIST, S. Becker, M. Ackermann, S. Lapuschkin, K.-R. Mueller, W. Samek, "Interpreting and '
                'Explaining Deep Neural Networks for Classification of Audio Signals", 2018; github.com/soerenab/AudioMNIST '
                '(read from raw.githubusercontent.com, the only host this box reaches). 60 speakers, the ten English digits, '
                'fifty times each, recorded at 48 kHz.\n\n'
                'MIT License\n\nCopyright (c) 2018 soerenab\n\n'
                'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated '
                'documentation files (the "Software"), to deal in the Software without restriction, including without limitation '
                'the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and '
                'to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\n'
                'The above copyright notice and this permission notice shall be included in all copies or substantial portions '
                'of the Software.\n\n'
                'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO '
                'THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE '
                'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF '
                'CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER '
                'DEALINGS IN THE SOFTWARE.\n\n'
                '| speaker | sex | age | from |\n|---|---|---|---|\n')
        for s, x, a, w in SPEAKERS: f.write('| %s | %s | %s | %s |\n' % (s, x, a, w))
    print('CUT: %d syllables for %d speakers -> %s' % (len(allreg), len(SPEAKERS), os.path.relpath(BANK, ROOT)))
    print('\n'.join(report))


def family_of(spk, sex):
    """his own numbers, from the seed of his id (seeded, the same every render): his speed on the 120 BPM grid, his
       declination, his tape, his wobble inside the one hard law (8/11: never past 0.73 Hz, never deeper than 2.09 percent)"""
    import hashlib
    u = lambda k: int(hashlib.md5(('am|%s|%d' % (spk, k)).encode()).hexdigest()[:8], 16) / 4294967296.0
    # HIS OWN TAPE TOO (measured 10/25: by the long-term spectrum alone the twenty sat CLOSER together than the six, 6.74
    # against 8.67, because the six differ mostly by the colour his 8/11 voices gave them, a tilt at 2.5 kHz and the top of
    # the band; a real person through the same tape as nineteen others reads as one radio). So each gets a tilt and a top
    # from the six's own ranges (tilt 0.604 to 1.426, the three tops 5.2, 6.2, 7.2 kHz), seeded from his id.
    return dict(id='am-' + spk, sex=sex, rate=[8.0, 10.0, 12.0][int(u(1) * 3) % 3], drop=round(0.16 + 0.09 * u(2), 3),
                gruff=round(0.08 + 0.45 * u(3), 3), vib=round(0.2 + 0.5 * u(4), 2), vibA=round(0.005 + 0.009 * u(5), 4),
                tilt=round(0.604 * (1.426 / 0.604) ** u(6), 3), wave=['triangle', 'square', 'sawtooth'][int(u(0) * 3) % 3])


def render():
    import parselmouth
    from parselmouth.praat import call
    meta = json.load(open(os.path.join(BANK, 'regions.json')))
    src, sr = sf.read(os.path.join(BANK, 'regions.flac'), dtype='float32')
    if sr != SR: die('the bank is not at the chain\'s rate')
    idx = json.load(open(os.path.join(OUT, 'index.json')))
    room_h = R.room_ir('small')
    gap = np.zeros(int(0.03 * SR), dtype=np.float32)
    pieces = [np.zeros(int(0.10 * SR), dtype=np.float32)]
    at = 0.10
    more = dict(file='squiggle_more.mp3', families=[], clips={}, made='10/25/26', source='AudioMNIST (MIT)')
    for spk, sex, age, where in SPEAKERS:
        fam = family_of(spk, sex)
        lpb, slot = Q.slot_of(fam)
        wet = round(0.14 + 0.13 * fam['gruff'], 3)
        drive = 0.7 + 1.2 * fam['gruff']
        tilt_db = round(6.0 * math.log2(fam['tilt']), 2)
        top = REAL_TOP[fam['wave']]
        regs = [r for r in meta['regions'] if r['speaker'] == spk]
        out, f0s = {}, []
        for r in regs:
            i = int(r['at'] * SR); seg = src[i:i + int(r['dur'] * SR)]
            body = r['dur'] - 2 * r['margin']
            want = slot * (1.05 if r['onset'] == r['vowel'] else 1.25)
            df = float(min(1.15, max(0.45, want / body)))
            snd = parselmouth.Sound(seg.astype(np.float64), SR)
            pit = snd.to_pitch(pitch_floor=60, pitch_ceiling=500).selected_array['frequency']; f0s += list(pit[pit > 0])
            lo = call(snd, 'Lengthen (overlap-add)', 60, 500, df)
            y = np.asarray(lo.values[0], dtype=np.float32)
            a, b = int(r['margin'] * df * SR), int((r['margin'] + body) * df * SR)
            y = y[a:b].copy()
            y = R.hp(y, 140.0 if sex == 'f' else 90.0)
            y = Q.high_shelf(y, 2500.0, tilt_db)
            y = R.tape(y, depth=drive)
            y = np.concatenate([y, np.zeros(int(0.11 * SR), dtype=np.float32)])
            w = signal.fftconvolve(y, room_h[0])[:len(y)].astype(np.float32)
            w = w / (np.abs(w).max() + 1e-9) * (np.abs(y).max() + 1e-9)
            y = ((1 - wet) * y + wet * w).astype(np.float32)
            y = Q.band_off(y, min(top, Q.BAND_TOP))
            y = Q.zero_ends(y)
            g = -16.0 - Q.loud_rms_db(y)
            y2 = R.gain_db(y, g)
            pk = 20 * math.log10(np.abs(y2).max() + 1e-12)
            if pk > -3.0: y2 = R.gain_db(y2, -3.0 - pk)
            y2[0] = 0.0; y2[-1] = 0.0
            pos = [round(at, 4), round(len(y2) / SR, 4)]
            for L in r['letters']: out.setdefault(L, []).append(pos)
            pieces += [y2, gap]; at += (len(y2) + len(gap)) / SR
        f0 = float(np.median(f0s)) if f0s else 120.0
        more['clips'][fam['id']] = out
        more['families'].append(dict(id=fam['id'], real=True, sex=sex, age=age, where=where, f0=round(f0), tract=1.0, rate=fam['rate'],
                                     lpb=lpb, slot=round(slot, 4), drop=fam['drop'], vib=fam['vib'], vibA=fam['vibA'], wet=wet,
                                     drive=round(drive, 3), tilt_db=tilt_db, top_hz=top))
        print('  %s (%s %s, %s): %d letters, %d syllables, f0 %d Hz, %d a beat, the room %d%% wet, tilt %+.1f dB, top %d Hz' % (
            fam['id'], sex, age, where, len(out), len(regs), f0, lpb, wet * 100, tilt_db, top))
    full = np.concatenate(pieces).astype(np.float32)
    path = os.path.join(OUT, more['file'])
    pk = R.write_mp3(path, full, kbps=48, ceiling_db=-1.0)
    first_fam = more['families'][0]['id']; first = min(t[0] for v in more['clips'][first_fam].values() for t in v)
    k0 = int(first * SR); hit = np.nonzero(np.abs(full[k0:k0 + int(0.2 * SR)]) > 0.01)[0]
    more.update(onset=round((k0 + int(hit[0])) / SR, 5) if len(hit) else first, seconds=round(len(full) / SR, 3), peak_db=round(pk, 2))
    idx['more'] = more
    json.dump(idx, open(os.path.join(OUT, 'index.json'), 'w'), separators=(',', ':'))
    print('RENDER: %d families, %.1f s, %.0f KB, peak %.2f dBFS -> %s (index.json more)' % (
        len(more['families']), len(full) / SR, os.path.getsize(path) / 1024.0, pk, os.path.relpath(path, ROOT)))


def check():
    idx = json.load(open(os.path.join(OUT, 'index.json')))
    M = idx.get('more')
    if not M: print('CHECK FAIL\n  no more voices in index.json'); return 1
    y, sr = sf.read(os.path.join(OUT, M['file']), dtype='float32')
    bad = []
    pk = 20 * math.log10(np.abs(y).max() + 1e-12)
    if pk > -1.0: bad.append('peak %.2f dBFS' % pk)
    n = 0
    for fam, letters in M['clips'].items():
        if sorted(letters) != sorted(NEAR): bad.append(fam + ' is missing letters')
        for L, takes in letters.items():
            if len(takes) < 2: bad.append('%s %s has %d takes' % (fam, L, len(takes)))
            for a, d in takes:
                if a + d > len(y) / sr + 0.05: bad.append('%s %s runs past the sprite' % (fam, L))
            n += len(takes)
    print(('CHECK FAIL\n  ' + '\n  '.join(bad)) if bad else
          'CHECK PASS: %d letter takes in %d real speakers (%d men, %d women), peak %.2f dBFS' % (
              n, len(M['families']), sum(1 for f in M['families'] if f['sex'] == 'm'), sum(1 for f in M['families'] if f['sex'] == 'f'), pk))
    return 1 if bad else 0


if __name__ == '__main__':
    if '--cut' in sys.argv: cut()
    elif '--check' in sys.argv: sys.exit(check())
    else: render()

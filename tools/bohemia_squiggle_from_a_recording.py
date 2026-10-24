#!/usr/bin/env python3
"""
THE SQUIGGLE, FROM A RECORDING (SOUNDS 10/24/26, row [the squiggle, creepier], rule 135).

Paolo 10/24: 'we have squiggle voices... every time people speak... we might have to revamp or upgrade or remake from scratch
the squiggle voices; it's supposed to be this Animal Crossing style squiggle voice, but maybe it could be more creepy.'

ANIMALESE'S OWN METHOD, NOW THAT REAL RECORDINGS ARE ALLOWED (9/23, 'no sand, sounds from real material'). Nintendo recorded a
human saying the sounds of the letters, and the game plays one short clip per letter as the text goes, re-timed and pitched per
villager. That is this tool: a real woman's voice cut into one syllable per letter, rendered as his six voice families (the six
he passed 8/11), and the game (engine/bohemia_voice_recorded.js) plays them per letter, pitched and timed per person from his seed.

WHERE THE VOICE COMES FROM, HONESTLY. This box reaches GitHub and nothing else (freesound, archive.org, huggingface, wikimedia,
openslr: CONNECT refused, measured 10/24). LJ Speech (Keith Ito, 2017) is 13,100 clips of one woman reading public-domain
LibriVox books, and the dataset itself is public domain ('This dataset is in the public domain in the USA (and likely other
countries too). There are no restrictions on its use.'). 32 of its clips (LJ001-0001 to 0032, 222 s) ride in coqui-ai/TTS's own
test data on GitHub; their words are in NVIDIA/tacotron2's file lists. A public domain recording is the CC0 case: nobody owns it.

  --cut     (needs the clips: LJ_SRC=<coqui>/tests/data/ljspeech/wavs, LJ_TEXT=<dir with the tacotron2 file lists>)
            1. ALIGN: every clip's words to its phones with CMU PocketSphinx's own English model and dictionary (pip
               pocketsphinx 5, `set_align_text`), 10 ms frames. A clip with a word the dictionary does not know is skipped.
            2. CHOOSE: three syllables per letter, each from a different word: a consonant letter is that consonant and the
               vowel it opens (b is 'B'+vowel, h is 'HH'+vowel, c a 'K' or an 'S'), a vowel letter is its vowel (a is AA or AE,
               o is OW or AO); the vowel must be voiced (Praat finds a pitch in it) and the take never used for another letter.
            3. BANK: each syllable with 40 ms of its own recording either side, as one FLAC and its JSON, in
               reference/library/sound_bank/ljspeech_pd/ with LICENCES.md, so the render needs nothing but the repo.
  (no flag) RENDER from the bank: per family (his six, their numbers from his 8/11 export):
            4. THE PERSON: Praat's 'Change gender' (parselmouth, Praat 6.1): the formants moved by the family's vocal tract
               against hers (1.17 on the engine's scale, measured: her F1 1.24 and F2 1.11 of Peterson & Barney's men), the
               pitch set to the family's own (hers 223 Hz median), its range halved so the game's contour leads, and the
               syllable re-timed to the family's letter slot (PSOLA, pitch kept): a fast voice is quick, never a chipmunk.
            5. THE TAPE AND THE ROOM (tools/bohemia_from_a_recording.py's own stages, REUSE-FIRST): high-pass 140 Hz, the
               family's colour (his 'tilt' a high shelf at 2.5 kHz, his 'wave' the top of the band: triangle 5.2 kHz, square
               6.2, sawtooth 7.2), the tape (head bump, saturation by his 'gruff', the slow wow, a 2:1 compressor), a small
               front room (4 x 5 x 2.7 m, RT60 0.35 s) at 14 to 21 percent wet, baked into every syllable with 110 ms of its
               tail, so the game needs no convolver (the SCREECH LAW) and the room is still on it.
            6. NO CLICK: every take starts and ends on true zero, 4 ms in, 30 ms out, and everything above 7.2 kHz is gone
               before the game ever plays it, so the gate can hear a click as energy where the voice has none.
            7. THE BREATH THAT SHOULD NOT BE THERE: two real frightened breaths in (ESC-50 3-166125-A-23, Adam_N, CC0), the
               same room and tape.
            8. ONE SPRITE: slices/voice_heard/squiggle.mp3 (mono, 44.1 kHz, 48 kbps) and index.json, every take [at, dur].
  --check   re-reads the sprite and verifies: every take there, ends on zero, nothing over -1 dBFS, nothing above the band.

  python3 tools/bohemia_squiggle_from_a_recording.py --cut
  python3 tools/bohemia_squiggle_from_a_recording.py
  python3 tools/bohemia_squiggle_from_a_recording.py --check
"""
import json, math, os, re, sys
import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_from_a_recording as R      # the lane's own chain stages (REUSE-FIRST); its SR is 44100

SR = R.SR
BANK = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'ljspeech_pd')
ESC = os.path.join(ROOT, 'reference', 'library', 'sound_bank', 'esc50_cc0')
OUT = os.path.join(ROOT, 'slices', 'voice_heard')
LJ_SRC = os.environ.get('LJ_SRC', '')
LJ_TEXT = os.environ.get('LJ_TEXT', '')
MARGIN = 0.040
TAKES = 3
SRC_TRACT = 1.17         # hers, on the engine's scale (Peterson & Barney's men = 1.0), measured on 309 vowels
SRC_F0 = 223.0           # hers, the median of every voiced frame of the 25 aligned clips

# HIS SIX (records/BOHEMIA_VOICE_VERDICT_8_11_26.txt, banks/BOHEMIA_VOICES_APPROVED_8_11_26.json), as he heard them
FAMILIES = [
    dict(id='cand-1', f0=252, tract=1.07, rate=10.74, wave='triangle', gruff=0.302, vib=0.73, vibA=0.0181, tilt=1.426, drop=0.221),
    dict(id='cand-2', f0=212, tract=1.225, rate=8.82, wave='triangle', gruff=0.155, vib=0.38, vibA=0.017, tilt=1.404, drop=0.24),
    dict(id='cand-3', f0=168, tract=1.032, rate=10.13, wave='square', gruff=0.055, vib=0.43, vibA=0.0078, tilt=0.895, drop=0.22),
    dict(id='cand-4', f0=195, tract=0.963, rate=7.55, wave='sawtooth', gruff=0.44, vib=0.05, vibA=0.0079, tilt=0.718, drop=0.249),
    dict(id='cand-6', f0=226, tract=0.996, rate=9.16, wave='sawtooth', gruff=0.17, vib=0.17, vibA=0.0209, tilt=0.939, drop=0.167),
    dict(id='cand-7', f0=229, tract=0.943, rate=12.35, wave='sawtooth', gruff=0.527, vib=0.73, vibA=0.0049, tilt=0.604, drop=0.254),
]
TOP = {'triangle': 5200.0, 'square': 6200.0, 'sawtooth': 7200.0}
BAND_TOP = 7200.0

VOWELS = set('AA AE AH AO AW AY EH ER EY IH IY OW OY UH UW'.split())
# a letter is the sound a mouth makes for it: a consonant opens a vowel, a vowel is itself
LETTERS = {
    'a': ('V', ['AA', 'AE', 'AH']), 'e': ('V', ['EH', 'IY', 'EY']), 'i': ('V', ['IH', 'IY', 'AY']),
    'o': ('V', ['OW', 'AO', 'AA']), 'u': ('V', ['UW', 'UH', 'AH']), 'y': ('CV', ['Y', 'IY']),
    'b': ('CV', ['B']), 'c': ('CV', ['K', 'S', 'CH']), 'd': ('CV', ['D']), 'f': ('CV', ['F']), 'g': ('CV', ['G']),
    'h': ('CV', ['HH']), 'j': ('CV', ['JH', 'CH']), 'k': ('CV', ['K']), 'l': ('CV', ['L']), 'm': ('CV', ['M']),
    'n': ('CV', ['N']), 'p': ('CV', ['P']), 'q': ('CV', ['K']), 'r': ('CV', ['R']), 's': ('CV', ['S', 'SH']),
    't': ('CV', ['T']), 'v': ('CV', ['V', 'F']), 'w': ('CV', ['W']), 'x': ('CV', ['Z', 'S']), 'z': ('CV', ['Z']),
}
# the clearest vowels first: a take on a long open vowel reads as a syllable, a schwa reads as a mumble
VPREF = {'AA': 0, 'AE': 0, 'IY': 0, 'OW': 0, 'UW': 0, 'EY': 0, 'AO': 1, 'EH': 1, 'AY': 1, 'IH': 2, 'UH': 2, 'ER': 2, 'AH': 3}


def die(msg):
    print('THE SQUIGGLE FROM A RECORDING: ' + msg); sys.exit(2)


# ---------------------------------------------------------------- 1-3. CUT ----
def transcripts():
    T = {}
    for f in ('ljs_audio_text_train_filelist.txt', 'ljs_audio_text_val_filelist.txt', 'ljs_audio_text_test_filelist.txt'):
        p = os.path.join(LJ_TEXT, f)
        if not os.path.exists(p): die('no ' + p + ' (LJ_TEXT: NVIDIA/tacotron2 filelists/)')
        for l in open(p, encoding='utf8'):
            a, b = l.rstrip('\n').split('|', 1); T[os.path.basename(a)[:-4]] = b
    return T


def align(key, text):
    import pocketsphinx
    from pocketsphinx import Decoder
    dic = align.dic = getattr(align, 'dic', None) or set(
        l.split()[0] for l in open(os.path.join(os.path.dirname(pocketsphinx.__file__), 'model', 'en-us', 'cmudict-en-us.dict')))
    words = re.sub(r"[^a-z' ]", ' ', text.lower().replace('-', ' ')).split()
    if any(w not in dic for w in words): return None
    x, sr = sf.read(os.path.join(LJ_SRC, key + '.wav'), dtype='float32')
    y = signal.resample_poly(x, 160, 221) if sr == 22050 else signal.resample_poly(x, 16000, sr)
    pcm = (np.clip(y, -1, 1) * 32767).astype('<i2').tobytes()
    d = Decoder(samprate=16000, bestpath=False, loglevel='ERROR')
    d.set_align_text(' '.join(words))
    d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
    d.set_alignment()
    d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
    return [[w.name, [[p.name, p.start / 100.0, (p.start + p.duration) / 100.0] for p in w]] for w in d.get_alignment()]


def voiced_share(snd, a, b):
    pit = snd.to_pitch(time_step=0.005, pitch_floor=75, pitch_ceiling=600)
    f = [pit.get_value_at_time(t) for t in np.arange(a + 0.005, b, 0.005)]
    return (sum(1 for v in f if v == v and v > 0) / max(1, len(f)))


def cut():
    import parselmouth
    if not LJ_SRC or not os.path.isdir(LJ_SRC): die('LJ_SRC is not a folder of LJ Speech wavs (coqui-ai/TTS tests/data/ljspeech/wavs)')
    T = transcripts()
    cands = {k: [] for k in LETTERS}
    used_clips = {}
    for i in range(1, 33):
        key = 'LJ001-%04d' % i
        al = align(key, T[key])
        if al is None: print('  skip %s: a word the dictionary does not know' % key); continue
        snd = parselmouth.Sound(os.path.join(LJ_SRC, key + '.wav'))
        ph = []
        for wi, (wname, phones) in enumerate(al):
            for p in phones: ph.append((p[0], p[1], p[2], wi, wname))
        for j, (name, a, b, wi, wname) in enumerate(ph):
            if wname in ('<sil>', '<s>', '</s>') or name == 'SIL': continue
            for letter, (kind, want) in LETTERS.items():
                if name not in want: continue
                if kind == 'V' or name in VOWELS:
                    if name not in VOWELS or b - a < 0.07: continue
                    s, e, vow, v0 = a, min(b, a + 0.17), name, a
                else:
                    if j + 1 >= len(ph) or ph[j + 1][0] not in VOWELS or abs(ph[j + 1][1] - b) > 0.001: continue
                    va, vb = ph[j + 1][1], ph[j + 1][2]
                    if vb - va < 0.05 or b - a > 0.16: continue
                    s, e, vow, v0 = a, va + min(0.13, (vb - va) * 0.8), ph[j + 1][0], va
                if s - MARGIN < 0 or e + MARGIN > snd.duration: continue
                vs = voiced_share(snd, v0, e)
                if vs < 0.6: continue
                pref = want.index(name) * 2 + VPREF.get(vow, 3)
                cands[letter].append(dict(clip=key, word=wname.split('(')[0], wi=wi, phone=name, vowel=vow,
                                          s=round(s, 3), e=round(e, 3), voiced=round(vs, 2), score=pref + abs((e - s) - 0.16) * 10))
    taken = set(); chosen = {}
    # the rarest letters choose first, so a common one never eats the only 'g' or 'j'
    for letter in sorted(LETTERS, key=lambda L: len(cands[L])):
        pool = sorted(cands[letter], key=lambda c: (c['score'], c['clip'], c['s']))
        got, words = [], set()
        for c in pool:
            tag = (c['clip'], c['s'])
            if tag in taken or (c['clip'], c['wi']) in words: continue
            got.append(c); taken.add(tag); words.add((c['clip'], c['wi']))
            if len(got) == TAKES: break
        if len(got) < TAKES:
            for c in pool:      # a letter short of words may take a second syllable from one word, never a used one
                if (c['clip'], c['s']) in taken: continue
                got.append(c); taken.add((c['clip'], c['s']))
                if len(got) == TAKES: break
        if not got: die('no take for the letter ' + letter)
        chosen[letter] = got
    # 3. bank: every chosen syllable with its own recording either side, one FLAC
    os.makedirs(BANK, exist_ok=True)
    pieces, at, regions = [], 0.0, []
    gap = np.zeros(int(0.05 * SR), dtype=np.float32)
    for letter in sorted(chosen):
        for k, c in enumerate(chosen[letter]):
            x, sr = sf.read(os.path.join(LJ_SRC, c['clip'] + '.wav'), dtype='float32')
            x = R.speed(x, sr / float(SR)) if sr != SR else x      # 22.05 kHz to the chain's 44.1 kHz, a resample
            i, j = int((c['s'] - MARGIN) * SR), int((c['e'] + MARGIN) * SR)
            seg = x[i:j].copy()
            regions.append(dict(letter=letter, take=k, at=round(at, 4), dur=round(len(seg) / SR, 4), margin=MARGIN, **c))
            pieces += [seg, gap]; at += (len(seg) + len(gap)) / SR
            used_clips[c['clip']] = T[c['clip']]
    sf.write(os.path.join(BANK, 'regions.flac'), np.concatenate(pieces), SR, subtype='PCM_16')
    json.dump(dict(_readme='THE SQUIGGLE FROM A RECORDING: the syllables cut from LJ Speech (public domain), each with 40 ms of its '
                   'own recording either side; at/dur in regions.flac, s/e in the source clip (tools/bohemia_squiggle_from_a_recording.py --cut)',
                   sr=SR, takes=TAKES, regions=regions, clips=used_clips), open(os.path.join(BANK, 'regions.json'), 'w'), indent=1)
    with open(os.path.join(BANK, 'LICENCES.md'), 'w') as f:
        f.write('# LJ SPEECH, PUBLIC DOMAIN (the squiggle\'s syllables, SOUNDS 10/24/26)\n\n'
                'Source: The LJ Speech Dataset, Keith Ito and Linda Johnson, 2017, https://keithito.com/LJ-Speech-Dataset/ -- '
                '"This dataset is in the public domain in the USA (and likely other countries too). There are no restrictions on '
                'its use." The reader is Linda Johnson reading public-domain books for LibriVox (all LibriVox recordings are public '
                'domain). The 32 clips LJ001-0001 to LJ001-0032 were read from github.com/coqui-ai/TTS tests/data/ljspeech/wavs '
                '(the only host this box reaches); the words from github.com/NVIDIA/tacotron2 filelists/.\n\n'
                '| clip | the words |\n|---|---|\n')
        for k in sorted(used_clips): f.write('| %s | %s |\n' % (k, used_clips[k].replace('|', '/')))
    n = sum(len(v) for v in chosen.values())
    print('CUT: %d syllables, %d letters x %d takes, from %d clips -> %s' % (n, len(chosen), TAKES, len(used_clips),
                                                                          os.path.relpath(BANK, ROOT)))
    for L in sorted(chosen): print('  %s  %s' % (L, '  '.join('%s/%s+%s' % (c['word'], c['phone'], c['vowel']) for c in chosen[L])))


# ------------------------------------------------------------- 4-8. RENDER ----
def high_shelf(x, hz, db):
    A = 10 ** (db / 40.0); w0 = 2 * math.pi * hz / SR; cw, sw = math.cos(w0), math.sin(w0)
    alpha = sw / 2 * math.sqrt(2)
    b0 = A * ((A + 1) + (A - 1) * cw + 2 * math.sqrt(A) * alpha); b1 = -2 * A * ((A - 1) + (A + 1) * cw)
    b2 = A * ((A + 1) + (A - 1) * cw - 2 * math.sqrt(A) * alpha); a0 = (A + 1) - (A - 1) * cw + 2 * math.sqrt(A) * alpha
    a1 = 2 * ((A - 1) - (A + 1) * cw); a2 = (A + 1) - (A - 1) * cw - 2 * math.sqrt(A) * alpha
    return signal.lfilter([b0 / a0, b1 / a0, b2 / a0], [1, a1 / a0, a2 / a0], x).astype(np.float32)


def band_off(x, top):
    """everything above the family's top gone, steeply (8th order), so a click in the game is the only thing up there"""
    sos = signal.butter(8, top / (SR / 2), 'low', output='sos')
    return signal.sosfiltfilt(sos, x).astype(np.float32)


def zero_ends(y, fi=0.004, fo=0.030):
    n = len(y); ni, no = int(fi * SR), int(fo * SR)
    if n > ni + no:
        y[:ni] *= (np.sin(np.linspace(0, np.pi / 2, ni)) ** 2).astype(np.float32)
        y[-no:] *= (np.cos(np.linspace(0, np.pi / 2, no)) ** 2).astype(np.float32)
    y[0] = 0.0; y[-1] = 0.0
    return y


def loud_rms_db(y, w=0.05):
    n = int(w * SR); best = 1e-12
    for i in range(0, max(1, len(y) - n), n // 4):
        best = max(best, float(np.sqrt(np.mean(y[i:i + n] ** 2))))
    return 20 * math.log10(best)


def slot_of(fam):
    """the letter slot on the 120 BPM grid: his rate rounded to letters a beat (4, 5 or 6 a beat = 8, 10, 12 a second)"""
    lpb = int(min(6, max(4, round(fam['rate'] / 2.0))))
    return lpb, 0.5 / lpb


def person(snd, fam, dur_factor):
    from parselmouth.praat import call
    ratio = fam['tract'] / SRC_TRACT
    out = call(snd, 'Change gender', 75, 600, ratio, float(fam['f0']), 0.5, dur_factor)
    return np.asarray(out.values[0], dtype=np.float32), out.sampling_frequency


def render():
    import parselmouth
    meta = json.load(open(os.path.join(BANK, 'regions.json')))
    src, sr = sf.read(os.path.join(BANK, 'regions.flac'), dtype='float32')
    if sr != SR: die('the bank is not at the chain\'s rate')
    room_h = R.room_ir('small')
    os.makedirs(OUT, exist_ok=True)
    gap = np.zeros(int(0.03 * SR), dtype=np.float32)
    pieces = [np.zeros(int(0.10 * SR), dtype=np.float32)]
    at = 0.10
    index = dict(families=[], clips={}, breaths=[])
    levels = []
    for fam in FAMILIES:
        lpb, slot = slot_of(fam)
        wet = round(0.14 + 0.13 * fam['gruff'], 3)
        drive = 0.7 + 1.2 * fam['gruff']
        tilt_db = round(6.0 * math.log2(fam['tilt']), 2)
        top = TOP[fam['wave']]
        clips = {}
        for r in meta['regions']:
            i = int(r['at'] * SR); seg = src[i:i + int(r['dur'] * SR)]
            body = r['dur'] - 2 * r['margin']
            want = slot * (1.25 if LETTERS[r['letter']][0] == 'CV' else 1.05)
            df = float(min(1.15, max(0.45, want / body)))
            y, ysr = person(parselmouth.Sound(seg.astype(np.float64), SR), fam, df)
            if int(round(ysr)) != SR: die('Praat handed back %s Hz' % ysr)
            a, b = int(r['margin'] * df * SR), int((r['margin'] + body) * df * SR)
            y = y[a:b].copy()
            y = R.hp(y, 140.0)
            y = high_shelf(y, 2500.0, tilt_db)
            y = R.tape(y, depth=drive)
            y = np.concatenate([y, np.zeros(int(0.11 * SR), dtype=np.float32)])
            w = signal.fftconvolve(y, room_h[0])[:len(y)].astype(np.float32)
            w = w / (np.abs(w).max() + 1e-9) * (np.abs(y).max() + 1e-9)
            y = ((1 - wet) * y + wet * w).astype(np.float32)
            y = band_off(y, min(top, BAND_TOP))
            y = zero_ends(y)
            clips.setdefault(r['letter'], []).append(y)
        # one loudness for the family: every syllable's loudest 50 ms at -16 dBFS, so no letter jumps out of a line
        out = {}
        for L in sorted(clips):
            for y in clips[L]:
                g = -16.0 - loud_rms_db(y)
                y2 = R.gain_db(y, g)
                pk = 20 * math.log10(np.abs(y2).max() + 1e-12)
                if pk > -3.0: y2 = R.gain_db(y2, -3.0 - pk)
                y2[0] = 0.0; y2[-1] = 0.0
                out.setdefault(L, []).append([round(at, 4), round(len(y2) / SR, 4)])
                levels.append(round(loud_rms_db(y2), 2))
                pieces += [y2, gap]; at += (len(y2) + len(gap)) / SR
        index['clips'][fam['id']] = out
        index['families'].append(dict(id=fam['id'], f0=fam['f0'], tract=fam['tract'], rate=fam['rate'], lpb=lpb,
                                      slot=round(slot, 4), drop=fam['drop'], vib=fam['vib'], vibA=fam['vibA'],
                                      wet=wet, tilt_db=tilt_db, top_hz=top, drive=round(drive, 3)))
        print('  %s: %d letters, %d a beat (%.0f ms a letter), the room %d%% wet, the top %d Hz, tilt %+.1f dB' % (
            fam['id'], len(out), lpb, slot * 1000, wet * 100, top, tilt_db))
    # 7. the breaths: two real frightened breaths in, the same room and tape, one take for every family
    bx, bsr = sf.read(os.path.join(ESC, '3-166125-A-23.flac'), dtype='float32')
    for (a, b) in ((1.10, 1.95), (3.20, 3.90)):
        y = R.window(bx, a, b, fi=0.03, fo=0.12)
        y = R.hp(y, 160.0); y = R.tape(y, depth=1.0)
        y = np.concatenate([y, np.zeros(int(0.15 * SR), dtype=np.float32)])
        w = signal.fftconvolve(y, room_h[0])[:len(y)].astype(np.float32)
        w = w / (np.abs(w).max() + 1e-9) * (np.abs(y).max() + 1e-9)
        y = band_off(((0.8 * y) + 0.2 * w).astype(np.float32), BAND_TOP)
        y = zero_ends(y, 0.02, 0.06)
        y = R.gain_db(y, -24.0 - loud_rms_db(y)); y[0] = 0.0; y[-1] = 0.0
        index['breaths'].append([round(at, 4), round(len(y) / SR, 4)])
        pieces += [y, gap]; at += (len(y) + len(gap)) / SR
    full = np.concatenate(pieces).astype(np.float32)
    path = os.path.join(OUT, 'squiggle.mp3')
    pk = R.write_mp3(path, full, kbps=48, ceiling_db=-1.0)
    # the decoder's own start: the first take's first sample over -40 dBFS, measured on our side, so the game can find its
    # offset in whatever its browser's mp3 decoder hands back (an mp3 carries an encoder delay some decoders keep)
    first = index['clips'][FAMILIES[0]['id']][sorted(index['clips'][FAMILIES[0]['id']])[0]][0][0]
    k0 = int(first * SR); k1 = k0 + int(0.2 * SR)
    hit = np.nonzero(np.abs(full[k0:k1]) > 0.01)[0]
    index.update(_readme='THE SQUIGGLE FROM A RECORDING, WHAT THE GAME READS (SOUNDS 10/24/26, rule 135): the sprite, every '
                 'family\'s takes per letter as [at, dur] seconds, the two breaths, and onset (the first take\'s first sample '
                 'over -40 dBFS) so the player can line the decoded sprite up. Families are his six of 8/11; the speaker LJ Speech '
                 '(public domain); tools/bohemia_squiggle_from_a_recording.py.',
                 made='10/24/26', file='squiggle.mp3', sr=SR, takes=TAKES, src_f0=SRC_F0, src_tract=SRC_TRACT,
                 band_top_hz=BAND_TOP, onset=round((k0 + int(hit[0])) / SR, 5) if len(hit) else first,
                 level_db=-16.0, breath_db=-24.0, seconds=round(len(full) / SR, 3), peak_db=round(pk, 2))
    json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), separators=(',', ':'))
    kb = os.path.getsize(path) / 1024.0
    print('RENDER: %d takes in %d families + %d breaths, %.1f s, %.0f KB, peak %.2f dBFS after the mp3 -> %s' % (
        sum(len(v) for f in index['clips'].values() for v in f.values()), len(FAMILIES), len(index['breaths']),
        len(full) / SR, kb, pk, os.path.relpath(path, ROOT)))
    return 0


def check():
    idx = json.load(open(os.path.join(OUT, 'index.json')))
    y, sr = sf.read(os.path.join(OUT, idx['file']), dtype='float32')
    bad = []
    if sr != idx['sr']: bad.append('the sprite is %d Hz' % sr)
    pk = 20 * math.log10(np.abs(y).max() + 1e-12)
    if pk > -1.0: bad.append('peak %.2f dBFS' % pk)
    sos = signal.butter(8, 9500.0 / (sr / 2), 'high', output='sos')
    hi = signal.sosfiltfilt(sos, y)
    above = 20 * math.log10(np.abs(hi).max() + 1e-12)
    n = 0
    for fam, letters in idx['clips'].items():
        if sorted(letters) != sorted(LETTERS): bad.append(fam + ' is missing letters')
        for L, takes in letters.items():
            if len(takes) < 2: bad.append('%s %s has %d takes (a letter said the same way twice running is a loop)' % (fam, L, len(takes)))
            n += len(takes)
    print(('CHECK FAIL\n  ' + '\n  '.join(bad)) if bad else
          'CHECK PASS: %d takes in %d families, %d breaths, peak %.2f dBFS, the most above 9.5 kHz %.1f dBFS (the mp3\'s own '
          'edge; the game hears clicks above the band)' % (n, len(idx['clips']), len(idx['breaths']), pk, above))
    return 1 if bad else 0


if __name__ == '__main__':
    if '--cut' in sys.argv: cut()
    elif '--check' in sys.argv: sys.exit(check())
    else: sys.exit(render())

#!/usr/bin/env python3
"""
BOHEMIA -- FOUR NEW SONGS, EACH ITS OWN SONG (SOUNDS 10/25/26, row [every song its own song], rule 166(h)).

Rule 166(h): a gate measures every new song against the others and his. (b) its own lead, instrument set, key or mode,
groove, a melody you can hum, a form; no two share more than one of lead, bass, drums, pad, key. (c) the tune and the
beat lead the mix. (d) no machine party. (g) THE TEST: ten seconds of each back to back, and a stranger tells them apart.
181: in the VOTE tab, playing levels 1, 2, 3 and a fight's turns, never wired.

For every song in slices/vote/songs/new_four/index.json (the ones with a card):
  1  its four files are the ones measured (md5), none clipped
  2  NO TWO SHARE MORE THAN ONE of lead, bass, drums (the three real hits), pad, key (its root and mode)
  3  THE TUNE LEADS: the tune alone, through a phone's speaker, no more than 6 dB under the whole mix
  4  THE BEAT AT EVERY LEVEL: the high-passed onset repeats at one beat (0.5 s) with at least 0.15 of its energy
  5  IT CLIMBS: level 2 at least 0.5 dB and level 3 at least 2 dB over level 1 through a phone (the tune leads every level,
     so the whole climbs little), and THE BEAT ALONE climbs at least 6 dB from level 1 to level 3
  6  A STRANGER TELLS THEM APART, measured: the pitch-class fingerprint (a 12-bin chroma) of ten seconds of level 1 from
     the bar the tune comes in, against every other new song's and against ten seconds of each of his night songs (from
     the bar his beat arrives): cosine under 0.95 for every pair, and the pairs' mean reported
  7  NEVER WIRED: its name in no song row of the alpha or the demo; no machine party in the tool
  8  THE CARD: in the registry, its page exists and names this song and this list
  python3 gates/four_new_songs_gate.py
"""
import hashlib
import json
import os
import re
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, 'slices')
IDX = os.path.join(SL, 'vote', 'songs', 'new_four', 'index.json')
HIS = os.path.join(SL, 'vote', 'songs', 'his_night_songs')
P = F = 0


def ok(c, m):
    global P, F
    if c:
        P += 1
    else:
        F += 1
        print('  FAIL ' + m)


def pcm(f, sr=22050):
    b = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, dtype=np.int16).astype(np.float32) / 32768.0


def pulse(x):
    fr = 220
    n = len(x) // fr
    d = np.diff(x, prepend=0.0)
    e = np.sqrt(np.mean(d[:n * fr].reshape(n, fr) ** 2, axis=1))
    o = np.maximum(0, np.diff(e, prepend=e[0]))
    o = o - o.mean()
    ac = lambda l: float(np.dot(o[:n - l], o[l:]) / (n - l))
    return max(ac(49), ac(50), ac(51)) / ac(0)


def chroma(x, sr=22050):
    """12 pitch classes from 55 Hz to 2 kHz, 4096-point frames"""
    N = 4096
    f = np.fft.rfftfreq(N, 1 / sr)
    m = (f > 55) & (f < 2000)
    pc = np.round(12 * np.log2(f[m] / 440.0)).astype(int) % 12
    c = np.zeros(12)
    w = np.hanning(N)
    for i in range(0, len(x) - N, N // 2):
        S = np.abs(np.fft.rfft(x[i:i + N] * w))[m] ** 2
        np.add.at(c, pc, S)
    return c / (np.linalg.norm(c) or 1)


def main():
    idx = json.load(open(IDX))
    reg = json.load(open(os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')))
    alpha = open(os.path.join(SL, 'BOHEMIA_ALPHA_0_9.html'), encoding='utf-8').read()
    demo = open(os.path.join(SL, 'BOHEMIA_DEMO.html'), encoding='utf-8').read()
    tool = open(os.path.join(ROOT, 'tools', 'bohemia_sounds_four_new_songs.js'), encoding='utf-8').read()
    ok(len(idx['songs']) >= 1, 'no new song in the list')
    ok('MACHINEPARTY' not in tool and 'machine_party' not in tool, 'the new songs tool reaches for the machine party (166(d): REPO MAN only)')
    M = {}
    for S in idx['songs']:
        d = os.path.join(SL, S['dir'])
        m = json.load(open(os.path.join(d, 'measured.json')))
        M[S['name']] = m
        files = [l['file'] for l in m['levels']] + [m['a_fight']['file']]
        sums = [l['mp3_md5'] for l in m['levels']] + [m['a_fight']['mp3_md5']]
        for f, s in zip(files, sums):
            p = os.path.join(ROOT, f)
            ok(os.path.exists(p) and hashlib.md5(open(p, 'rb').read()).hexdigest() == s, S['name'] + ': ' + f + ' is not the file measured')
        ok(all(l['clipped_samples'] == 0 for l in m['levels']), S['name'] + ': clipped')
        ok(m['tune_on_a_phone_vs_the_mix_db'] >= -6, S['name'] + ': the tune is buried (%s dB under the mix on a phone)' % m['tune_on_a_phone_vs_the_mix_db'])
        x = [pcm(os.path.join(ROOT, f)) for f in files]
        pl = [pulse(a) for a in x]
        for i, v in enumerate(pl):
            ok(v >= 0.15, S['name'] + ': no 120 BPM pulse at ' + (['level 1', 'level 2', 'level 3', 'the fight'][i]) + ' (%.3f)' % v)
        a, b, c = [l['audio']['phone_rms_db'] for l in m['levels']]
        # the whole mix climbs (a tune that leads every level keeps the climb small: THE CHURCH CLOCK's bell measured
        # +0.9 and +2.6), and the beat itself climbs hard to level 3 (167(c): drums and drive on your turn)
        ok(b - a >= 0.5 and c - a >= 2, S['name'] + ': it does not climb (%s / %s / %s dB)' % (a, b, c))
        ok(m.get('beat_climbs_level_1_to_3_db', 0) >= 6, S['name'] + ': the beat does not come in on your turn (%s dB from level 1 to 3)' % m.get('beat_climbs_level_1_to_3_db'))
        # 207 (Paolo 10/25: 'I like the songs, I want you to implement them'): his yes came; the game's book names it now
        book = re.compile(r'/\*BOOK\*/.*"' + re.escape(S['name']) + r'":\{')
        ok(bool(book.search(alpha)) and bool(book.search(demo)), S['name'] + ': not in the game (rule 207: the songs go in)')
        card = next((it for it in reg['items'] if it['id'] == S['id']), None)
        ok(card is not None, S['name'] + ': no card')
        if card:
            pg = os.path.join(SL, card['show']['src'])
            t = open(pg, encoding='utf-8').read() if os.path.exists(pg) else ''
            ok('<meta name="song" content="%s">' % S['slug'] in t and 'vote/songs/new_four/index.json' in t, S['name'] + ': its page does not name it and its list')
        M[S['name']]['_chroma'] = chroma(x[0][int(22050 * 8.05):int(22050 * 18.05)])
        M[S['name']]['_pulse'] = pl
    # 2: no two share more than one
    names = list(M)
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            A, B = M[names[i]], M[names[j]]
            shared = [k for k, v in (('lead', A['lead'] == B['lead']), ('bass', A['bass'] == B['bass']), ('drums', bool(set(A['drums']) & set(B['drums']))),
                                     ('pad', A['pad'] is not None and A['pad'] == B['pad']), ('key', A['root'] == B['root'] and A['mode'] == B['mode'])) if v]
            ok(len(shared) <= 1, names[i] + ' and ' + names[j] + ' share ' + ', '.join(shared))
    # 6: a stranger tells them apart
    his = {}
    for f in sorted(os.listdir(HIS)):
        if f.endswith('.mp3'):
            his[f[4:-4].replace('_', ' ').upper()] = chroma(pcm(os.path.join(HIS, f))[int(22050 * 16.05):int(22050 * 26.05)])
    worst, pairs = 0, []
    for i, n in enumerate(names):
        for o in names[i + 1:]:
            cs = float(np.dot(M[n]['_chroma'], M[o]['_chroma']))
            pairs.append(cs); worst = max(worst, cs)
            ok(cs < 0.95, n + ' and ' + o + ' sound alike (pitch fingerprint %.3f)' % cs)
        for h, hc in his.items():
            cs = float(np.dot(M[n]['_chroma'], hc))
            ok(cs < 0.95, n + ' sounds like his ' + h + ' (pitch fingerprint %.3f)' % cs)
    for n in names:
        print('  %s: pulse %s, phone dB %s, tune vs mix %s dB, its closest of his %s' % (n, '/'.join('%.2f' % v for v in M[n]['_pulse']),
              '/'.join(str(l['audio']['phone_rms_db']) for l in M[n]['levels']), M[n]['tune_on_a_phone_vs_the_mix_db'],
              max(((float(np.dot(M[n]['_chroma'], hc)), h) for h, hc in his.items()), default=(0, ''))))
    if pairs:
        print('  the new songs against each other: mean %.3f, closest %.3f' % (sum(pairs) / len(pairs), worst))
    print('FOUR NEW SONGS, EACH ITS OWN: %d passed, %d failed' % (P, F))
    sys.exit(1 if F else 0)


if __name__ == '__main__':
    main()

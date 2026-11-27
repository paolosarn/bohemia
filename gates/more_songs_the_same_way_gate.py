#!/usr/bin/env python3
"""
BOHEMIA -- MORE SONGS, MADE THE SAME WAY AS THE LAST GOOD ONES (SOUNDS THREE 11/27/26, rule 488).

PAOLO 11/27: 'we need more music please, the good way you did, the exact same way that you made it last time, it was
doing good. We need more tunes... I keep hearing the same songs.' The recipe is the four of 10/25 (his UP on all four),
held here by the four's own measures (gates/four_new_songs_gate.py), across this batch AND the four together:

For every song in slices/vote/songs/more_songs/index.json:
  M1  THE SAME WAY: the batch's tool has no render of its own; it goes through tools/bohemia_sounds_four_new_songs.js's
      render and record (the 32-bar form, the worn tape, the measured gap, the hit); no machine party (REPO MAN only)
  M2  its five files are the ones measured (md5), none clipped; every level is the song's whole 32-bar pass
  M3  THE TUNE LEADS: the tune alone, through a phone's speaker, no more than 6 dB under the whole mix
  M4  THE BEAT AT EVERY LEVEL: the high-passed onset repeats at one beat (0.5 s) with at least 0.15 of its energy
  M5  HIS TURN HITS HARD: level 2 at least 3 dB over level 1 and level 3 at least 6 dB over level 2 through a phone, and
      the beat alone climbs at least 6 dB from level 1 to level 3
  M6  EACH ITS OWN: no two songs of the sixteen (this batch and the four) share more than one of lead, bass, drums (any
      of the three real hits), pad, key (root and mode)
  M7  A STRANGER TELLS THEM APART: a 12-bin chroma of ten seconds of level 1 from the bar the tune comes in, against every
      other song of the sixteen and his eight night songs: cosine under 0.95
  M8  IN THE GAME: its name in the alpha's and the demo's book (THE SONGS GO IN plays it, the rotation reaches it)
  M9  ITS CARD PLAYS IT (488(c)): in the VOTE registry, its page exists and names this song and this list
  python3 gates/more_songs_the_same_way_gate.py
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
IDX = os.path.join(SL, 'vote', 'songs', 'more_songs', 'index.json')
FOUR = os.path.join(SL, 'vote', 'songs', 'new_four', 'index.json')
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
    if not os.path.exists(IDX):
        print('  FAIL no slices/vote/songs/more_songs/index.json')
        print('MORE SONGS, THE SAME WAY: 0 passed, 1 failed')
        sys.exit(1)
    idx = json.load(open(IDX))
    four = json.load(open(FOUR))
    reg = json.load(open(os.path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json')))
    alpha = open(os.path.join(SL, 'BOHEMIA_ALPHA_0_9.html'), encoding='utf-8').read()
    demo = open(os.path.join(SL, 'BOHEMIA_DEMO.html'), encoding='utf-8').read()
    tool = open(os.path.join(ROOT, 'tools', 'bohemia_sounds_more_songs.js'), encoding='utf-8').read()
    # M1: the same way
    ok("require(path.join(ROOT, 'tools', 'bohemia_sounds_four_new_songs.js'))" in tool and 'F.record(' in tool and 'OfflineAudioContext' not in tool and 'synthV(' not in tool,
       'M1 the batch\'s tool renders on its own instead of through the four\'s render and record')
    ok('MACHINEPARTY' not in tool and 'machine_party' not in tool, 'M1 the batch reaches for the machine party (166(d): REPO MAN only)')
    ok(len(idx['songs']) >= 12, 'M1 a real batch (488(b)): %d songs' % len(idx['songs']))
    M = {}
    for S in idx['songs']:
        d = os.path.join(SL, S['dir'])
        m = json.load(open(os.path.join(d, 'measured.json')))
        M[S['name']] = m
        ok(m.get('tool') == 'tools/bohemia_sounds_more_songs.js' and m.get('bars') == 32 and m.get('bpm') == 120, S['name'] + ': not the recipe\'s 32 bars at 120 (M1)')
        files = [l['file'] for l in m['levels']] + [m['a_fight']['file'], m['hit']['file']]
        sums = [l['mp3_md5'] for l in m['levels']] + [m['a_fight']['mp3_md5'], m['hit']['mp3_md5']]
        for f, s in zip(files, sums):
            p = os.path.join(ROOT, f)
            ok(os.path.exists(p) and hashlib.md5(open(p, 'rb').read()).hexdigest() == s, S['name'] + ': ' + f + ' is not the file measured (M2)')
        ok(all(l['clipped_samples'] == 0 for l in m['levels']), S['name'] + ': clipped (M2)')
        x = [pcm(os.path.join(ROOT, f)) for f in files[:4]]
        ok(all(abs(len(a) / 22050.0 - (64 + 3)) < 1.5 for a in x[:3]), S['name'] + ': a level is not the whole pass (%s s)' % [round(len(a) / 22050.0, 1) for a in x[:3]])
        ok(m['tune_on_a_phone_vs_the_mix_db'] >= -6, S['name'] + ': the tune is buried (%s dB under the mix on a phone) (M3)' % m['tune_on_a_phone_vs_the_mix_db'])
        pl = [pulse(a) for a in x]
        for i, v in enumerate(pl):
            ok(v >= 0.15, S['name'] + ': no 120 BPM pulse at ' + (['level 1', 'level 2', 'level 3', 'the fight'][i]) + ' (%.3f) (M4)' % v)
        a, b, c = [l['audio']['phone_rms_db'] for l in m['levels']]
        ok(b - a >= 3 and c - b >= 6, S['name'] + ': his turn does not hit hard (%s / %s / %s dB) (M5)' % (a, b, c))
        ok(m.get('beat_climbs_level_1_to_3_db', 0) >= 6, S['name'] + ': the beat does not come in on your turn (%s dB from level 1 to 3) (M5)' % m.get('beat_climbs_level_1_to_3_db'))
        book = re.compile(r'/\*BOOK\*/.*"' + re.escape(S['name']) + r'":\{')
        ok(bool(book.search(alpha)) and bool(book.search(demo)), S['name'] + ': not in the game\'s book (M8)')
        card = next((it for it in reg['items'] if it['id'] == S['id']), None)
        ok(card is not None, S['name'] + ': no card (M9)')
        if card:
            pg = os.path.join(SL, card['show']['src'])
            t = open(pg, encoding='utf-8').read() if os.path.exists(pg) else ''
            ok('<meta name="song" content="%s">' % S['slug'] in t and 'vote/songs/more_songs/index.json' in t, S['name'] + ': its card\'s page does not name it and its list (M9)')
        m['_chroma'] = chroma(x[0][int(22050 * 8.05):int(22050 * 18.05)])
        m['_pulse'] = pl
    # the four, for M6 and M7
    for S in four['songs']:
        m = json.load(open(os.path.join(SL, S['dir'], 'measured.json')))
        m['_chroma'] = chroma(pcm(os.path.join(ROOT, m['levels'][0]['file']))[int(22050 * 8.05):int(22050 * 18.05)])
        m['_four'] = True
        M[S['name']] = m
    names = list(M)
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            A, B = M[names[i]], M[names[j]]
            shared = [k for k, v in (('lead', A['lead'] == B['lead']), ('bass', A['bass'] == B['bass']), ('drums', bool(set(A['drums']) & set(B['drums']))),
                                     ('pad', A['pad'] is not None and A['pad'] == B['pad']), ('key', A['root'] == B['root'] and A['mode'] == B['mode'])) if v]
            ok(len(shared) <= 1, names[i] + ' and ' + names[j] + ' share ' + ', '.join(shared) + ' (M6)')
    his = {}
    for f in sorted(os.listdir(HIS)):
        if f.endswith('.mp3'):
            his[f[4:-4].replace('_', ' ').upper()] = chroma(pcm(os.path.join(HIS, f))[int(22050 * 16.05):int(22050 * 26.05)])
    pairs, worst = [], (0, '')
    for i, n in enumerate(names):
        for o in names[i + 1:]:
            cs = float(np.dot(M[n]['_chroma'], M[o]['_chroma']))
            pairs.append(cs)
            worst = max(worst, (cs, n + ' / ' + o))
            ok(cs < 0.95, n + ' and ' + o + ' sound alike (pitch fingerprint %.3f) (M7)' % cs)
        if M[n].get('_four'):
            continue
        for h, hc in his.items():
            cs = float(np.dot(M[n]['_chroma'], hc))
            ok(cs < 0.95, n + ' sounds like his ' + h + ' (pitch fingerprint %.3f) (M7)' % cs)
    for n in names:
        if M[n].get('_four'):
            continue
        print('  %s: pulse %s, phone dB %s, tune vs mix %s dB, beat climbs %s dB, closest of his %s' % (n, '/'.join('%.2f' % v for v in M[n]['_pulse']),
              '/'.join(str(l['audio']['phone_rms_db']) for l in M[n]['levels']), M[n]['tune_on_a_phone_vs_the_mix_db'], M[n].get('beat_climbs_level_1_to_3_db'),
              max(((round(float(np.dot(M[n]['_chroma'], hc)), 3), h) for h, hc in his.items()), default=(0, ''))))
    if pairs:
        print('  the sixteen against each other: mean %.3f, closest %.3f (%s)' % (sum(pairs) / len(pairs), worst[0], worst[1]))
    print('MORE SONGS, THE SAME WAY: %d passed, %d failed' % (P, F))
    sys.exit(1 if F else 0)


if __name__ == '__main__':
    main()

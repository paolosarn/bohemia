#!/usr/bin/env python3
"""BOHEMIA -- THE MIDDLE GROUND (SOUNDS, 10/18/26, row [the middle ground], round three of [a new song every round]).

PAOLO 10/18, his YES on OVER THE RIDGE: 'Awesome I like it, but I just questioned like the aesthetic inspiration of
what I'm hearing... whether it really goes with the vibe of bohemia... it sounds very different than the rest of our
songs... they're still 120 BPM... so I wonder if there's like a middleground to reach for all of this, but yeah, like
I like it.' The coordinator (sweep AT): 'his canon songs' own style and arrangement played the clean 8-bit way, so old
and new sound like one game.'

WHAT THIS WRITES: slices/vote/songs/night_freight.json, NIGHT FREIGHT (a name, draft), the map's song, played by
engine/bohemia_chip_song.js. Every choice below is read off his canon songs (records/BOHEMIA_WHAT_MAKES_HIS_SONGS_HIS_
10_18_26.md is the page), never edited, never copied note for note:

  THE FORM IS HIS, BYTE FOR BYTE: SONG_ARR and SONG_ROOT (the 7/3 TWO MINUTE LAW and the AUDITION LAW: 16 sections of
    4 bars, 64 bars, 2:08, A core / B lift / C strip / D full, the root moving per section by a degree of the scale).
    The gate reads both out of the alpha and refuses this song if they differ.
  THE KEY AND SCALE: G on [0,2,3,7,8] (G A Bb D Eb), the map's most common key (three of his six night songs sit on
    G) and the scale of REPO MAN and THE PIT BOSS IS GONE; five notes, like all six.
  THE GROOVE: half time like all six; the kick on 1 and 3 (steps 0 and 8, four of six); the hat soft on 2 and 4
    (steps 4 and 12, four of six); no snare (none of the six has one); no swing (none of the six); the fill is his:
    the kick on the last four sixteenths of every section's last bar; THE BEAT ARRIVES LATE: no drums for the first
    eight bars, the way the map holds the kit on every one of his songs (MUS.drumsHeld, step < 128).
  THE BASS: his engine's own rule, the degree is the step's place in the scale (scale[s % 5]), on steps of my own
    (0, 6, 10, 14: G, A, G, E flat), and his B-section lift, the second half of every half bar an octave up.
  THE SECTIONS: A is the bass, the kit and a thin motif on beat one (his 'bar-zero identity': the first four seconds
    already sound like the song), B the tune enters, C kick and bass only, D the tune with the high line an octave up.
  THE TUNE: his two map shapes, CALL (a bar of eighths) and LONGS (two half notes), one after the other, so the
    silence of his call bar is filled with his longs; written by hand from the five notes so a person can hum it,
    where his engine draws the degrees from a hash.

THE 8-BIT WAY (his 'he likes 8-bit', the row): the four voices at the 2A03's own numbers (the engine), the tune on a
50 percent pulse (round, the closest the chip has to his soft leads), the echo and the motif on a 12.5 percent pulse
(the NES echo, three sixteenths late, the way the console's composers made a room with two channels), the triangle
bass, the noise kit with his kick's character as chip hits (his BOOM is a sine falling 55 to 30 Hz over 0.3 s; here
the triangle falls 110 to 34 Hz over 0.28 s with a low noise thump, an octave up so a phone can hear it). NO crush, no
compressor, no sand.

    python3 tools/bohemia_sounds_middle_ground.py           write the song (same bytes every run)
    python3 tools/bohemia_sounds_middle_ground.py --check   exit 1 if the file on disk is not what this writes
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'vote', 'songs', 'night_freight.json')

# HIS, READ (gates/song_lock_gate.js locks both; the song's gate re-reads them from the alpha and compares)
SONG_ARR = ['A', 'B', 'B', 'A', 'C', 'B', 'D', 'B', 'A', 'B', 'C', 'A', 'D', 'D', 'B', 'A']
SONG_ROOT = [0, 0, 2, 0, 3, 2, 0, 1, 0, 2, 3, 0, 1, 2, 0, 0]
SCALE = [0, 2, 3, 7, 8]          # REPO MAN's and THE PIT BOSS IS GONE's
HELD_BARS = 8                    # MUS.drumsHeld: step < 128 on the map, eight bars

NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']


def note(m):
    return NAMES[m % 12] + str(m // 12 - 1)


def grid(events, steps=16):
    """events: {step: (midi, length)} -> a tracker line; a note holds through dots, '-' stops it"""
    cells = ['.'] * steps
    for s in sorted(events):
        m, ln = events[s]
        cells[s] = note(m)
        if s + ln < steps and cells[s + ln] == '.':
            cells[s + ln] = '-'
    return ' '.join(cells)


G2, G4 = 43, 67
def deg(d, base):                # a degree of the scale over a base, the octave carried
    return base + SCALE[d % 5] + 12 * (d // 5)

# THE TUNE, by hand, from the five notes (G A Bb D Eb). CALL, LONGS, CALL, LONGS.
#   bar 1  D5 . Eb5 D5 Bb4 . A4 Bb4      the call
#   bar 2  G4 ............ D4 .......    the long answer, home and down a fourth
#   bar 3  D5 . Eb5 D5 Bb4 D5 Eb5 G5     the call again, climbing
#   bar 4  Eb5 ........... D5 .......    the flat sixth hangs, the fifth answers: a question into the next section
TUNE = [
    {0: (74, 2), 4: (75, 2), 6: (74, 2), 8: (70, 4), 12: (69, 2), 14: (70, 2)},
    {0: (67, 7), 8: (62, 7)},
    {0: (74, 2), 4: (75, 2), 6: (74, 2), 8: (70, 2), 10: (74, 2), 12: (75, 2), 14: (79, 2)},
    {0: (75, 7), 8: (74, 7)},
]
# THE MOTIF in A (his bar-zero identity: the lead states a thin note on beat one, and on step 10 every other bar)
MOTIF = [{0: (79, 1)}, {0: (74, 1), 10: (75, 1)}, {0: (82, 1)}, {0: (81, 1), 10: (79, 1)}]
# THE BASS: his rule, the degree is scale[s % 5]; my steps; his B lift (s % 8 >= 4 an octave up)
BASS_STEPS = [(0, 3), (6, 2), (10, 2), (14, 2)]
ECHO = 3                         # the NES echo: the same line three sixteenths late, quieter


def bass(sec):
    ev = {}
    for s, ln in BASS_STEPS:
        m = G2 + SCALE[s % 5] - (12 if SCALE[s % 5] > 7 else 0)   # E flat under the G, the riff's low turn
        if sec == 'B' and s % 8 >= 4:
            m += 12
        ev[s] = (m, ln)
    return grid(ev)


def drums(sec, bar_in, held):
    if held:
        return ''
    c = ['.'] * 16
    c[0] = c[8] = 'b'
    if sec != 'C':
        c[4] = c[12] = 'c'               # his hat, soft on 2 and 4, gone in the strip
    if bar_in == 3:                      # his fill: the kick on the last four sixteenths
        for s in (12, 13, 14, 15):
            c[s] = ('f' + c[s].replace('.', '').replace('b', '')) if c[s] != '.' else 'f'
    return ' '.join(c)


def echo_line(bar_in):
    """the tune three sixteenths late; what spills past the bar's end is the next bar's head"""
    ev = {}
    for s, (m, ln) in TUNE[bar_in].items():
        t = s + ECHO
        if t < 16:
            ev[t] = (m, min(ln, 16 - t))
    prev = TUNE[bar_in - 1] if bar_in > 0 else {}
    for s, (m, ln) in prev.items():
        t = s + ECHO - 16
        if 0 <= t < 16 and s + ln > 16 - ECHO:
            ev[t] = (m, min(ln - (16 - ECHO - s) if s < 16 - ECHO else ln, 16 - t))
    return grid(ev)


def pattern(sec, bar_in, held):
    P = {'part': {'A': 'core', 'B': 'lift: the tune', 'C': 'strip: kick and bass', 'D': 'full: the high line'}[sec],
         'lead': '', 'echo': '', 'bass': bass(sec), 'drums': drums(sec, bar_in, held)}
    if sec == 'A':
        P['echo'] = grid(MOTIF[bar_in])
    elif sec == 'B':
        P['lead'] = grid(TUNE[bar_in])
        P['echo'] = echo_line(bar_in)
    elif sec == 'D':
        P['lead'] = grid(TUNE[bar_in])
        P['echo'] = grid({s: (m + 12, ln) for s, (m, ln) in TUNE[bar_in].items()})
    return P


def build():
    patterns, order, parts = {}, [], []
    for si, sec in enumerate(SONG_ARR):
        shift = SCALE[SONG_ROOT[si] % 5]
        for bi in range(4):
            bar = si * 4 + bi
            held = bar < HELD_BARS
            name = sec + str(bi + 1) + ('h' if held else '')
            if name not in patterns:
                patterns[name] = pattern(sec, bi, held)
            order.append(name + ('@' + str(shift) if shift else ''))
        parts.append([si * 4 + 1, sec, shift])
    return {
        '_readme': ("A CHIP SONG IN HIS FORM (SOUNDS 10/18/26, row [the middle ground]): played by "
                    "engine/bohemia_chip_song.js, written by tools/bohemia_sounds_middle_ground.py (edit the tool, or "
                    "edit this and the tool's --check will say so). A bar is 16 steps at 120 BPM (a step is a sixteenth, "
                    "125 ms). In a voice's line a token is a note (C#5, Bb3) that holds through the dots after it, '-' "
                    "stops it; the drums line names hits (b his boom as a chip kick, f the fill's short boom, c his soft "
                    "hat). order is one pattern per bar; 'name@3' plays that bar's pitched voices 3 semitones up, which "
                    "is his form moving the root (SONG_ROOT). Four voices like the NES's four channels: the tune (a 50 "
                    "percent pulse), the echo and the motif (a 12.5 percent pulse), the bass (the triangle), the drums "
                    "(the noise). env is the volume sequence, one of the 16 levels a frame at 60 Hz. draft:true until "
                    "his vote."),
        'id': 'night-freight',
        'title': 'NIGHT FREIGHT',
        'draft': True,
        'made': '10/18/26',
        'lane': 'sounds',
        'screen': 'the map, the party travelling at night',
        'bpm': 120,
        'steps_per_bar': 16,
        'key': 'G on his [0,2,3,7,8] (G A Bb D Eb), the scale of REPO MAN; the root moves by his SONG_ROOT: G, Bb, D, A',
        'his_form': {'SONG_ARR': SONG_ARR, 'SONG_ROOT': SONG_ROOT, 'scale': SCALE, 'held_bars': HELD_BARS,
                     'sections': parts},
        'voices': {
            'lead': {'kind': 'pulse', 'duty': 0.5, 'vol': 0.16,
                     'env': [15, 14, 13, 12, 11, 10, 10, 9, 9, 8, 8, 7, 7, 7, 6, 6, 6, 5],
                     'legato': 0.92, 'vibrato': {'after': 0.35, 'hz': 5, 'cents': 9}},
            'echo': {'kind': 'pulse', 'duty': 0.125, 'vol': 0.2,
                     'env': [11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 3], 'legato': 0.9},
            'bass': {'kind': 'triangle', 'vol': 0.3, 'legato': 0.9},
            'drums': {'kind': 'noise', 'vol': 0.2},
        },
        'kit': {
            'b': {'noise': 12, 'short': False, 'env': [12, 7, 4, 2, 1], 'tri': [110, 34, 0.28]},
            'f': {'noise': 12, 'short': False, 'env': [8, 4, 2], 'tri': [120, 50, 0.1]},
            'c': {'noise': 0, 'short': False, 'env': [6, 3, 1]},
        },
        'patterns': patterns,
        'order': order,
    }


def main():
    text = json.dumps(build(), indent=1, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        have = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        print('NIGHT FREIGHT --check: ' + ('the file is what the tool writes' if have == text else 'DIFFERS from the tool'))
        sys.exit(0 if have == text else 1)
    open(OUT, 'w', encoding='utf-8').write(text)
    S = build()
    print('wrote ' + os.path.relpath(OUT, ROOT) + ': ' + str(len(S['order'])) + ' bars, ' +
          str(len(S['patterns'])) + ' patterns')


if __name__ == '__main__':
    main()

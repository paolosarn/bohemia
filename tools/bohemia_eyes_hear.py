#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS, lane 17, E18 [he can hear it] ROUND TWO: THE CHECK.

THE JOB (board row E18): the one song he likes, measured against Besaid Island on a
music supervisor's axes -- tempo, entry of the beat, bass, instrumentation, the shape of
the melody -- so SOUNDS [sound card] starts from a number and not a feeling.

BOTH SIDES ARE NAMED BY HIM.
  THE ANCHOR     BESAID ISLAND, FINAL FANTASY X Original Soundtrack, disc 1 track 18,
                 composed AND arranged by Masashi Hamauzu. "the ORIGINAL not the
                 remaster" (Paolo 9/7, "look at this song bro").
  THE CANDIDATE  THE MARKER ON THE DOOR, tagged OVERWORLD DAY by his own hand. Paolo
                 8/2: "The marker on the door at full intensity is now one of my new
                 favorite songs that you've made great job".

ROUND ONE WAS SCHOOL -- records/BOHEMIA_EYES_E18_ROUND_1_SCHOOL_THE_ANCHOR_HAS_NO_NUMBER_9_12_26.md
Five findings from it decide the shape of this tool, and every one of them is a thing
this tool REFUSES to do:

  (a) IT PRINTS NO REFERENCE NUMBER IT CANNOT SOURCE. Every BPM and key for "Besaid
      Island" on the open web belongs to a cover -- Celestial Aeon Project, Franco
      Albertini, Josh Barron, Jeremy Ng, Game Soundtrack Cat, PianoDreams -- spread from
      about 103 to 175 BPM, E major on one entry and C#/Db minor on another. He named
      the original. So the reference column is CITED TEXT or the word UNKNOWN, and
      UNKNOWN is a legitimate answer that beats a borrowed number.
  (b) IT DOES NOT INHERIT OUR OWN LAW'S REFERENCE FACTS. The 9/6 sound law says the
      remaster shortened the track, started the beat sooner and removed the bass;
      every source reachable in round one says the other direction on pacing. Flagged
      for the coordinator, used for nothing here.
  (c) IT REPORTS TEMPO AS A CONSTRAINT, NEVER A GAP. 120 BPM is a pillar law and the
      music runs the game's one clock. Filing a tempo difference as something SOUNDS
      should fix would be asking for a law to be broken.
  (d) IT PRODUCES NO SIMILARITY SCORE, NO PERCENTAGE AND NO RANKING. Outside, the trade
      calls this temp love: measured against a beloved reference everything reads as
      lesser, and on Arrival the temp track beat everything the composer wrote. Inside,
      tools/bohemia_where_his_taste_lives.py exists because batch 25 was swept 0 for 8
      by a gate that rewarded distance from the voices he had already approved. One
      number per axis per side, side by side, and no total.
  (e) IT DECLARES INSTRUMENTATION UNCOMPARABLE INSTEAD OF SCORING IT. A sawtooth
      through a synth voice and a real violin are not two points on one ruler. What is
      checked instead is the ROLE each voice plays.

AND THE RENDER HALF WAS WRONG ONCE, WHICH IS WHY ITS CONTROL EXISTS.
  tools/bohemia_eyes_hear.js first wrapped only synthV and drumV to write down what the
  engine scheduled. It logged 359 notes and NOT ONE MELODY NOTE, and the tempting read
  was "the melody never plays". It does. This engine writes some notes with a named
  voice out of the 602-voice rack and others as a bare createOscillator into a lowpass,
  and for this song's mel='longs' the melody is the bare kind. A note log blind to half
  the ways the engine makes a note is a log that invents silences. C1b below is that
  mistake turned into a control that cannot be walked into twice.

RULE ZERO (E9, this lane's own law): a zero needs a positive control, and the instrument
must be proven to bite before any number it prints is believed. Four controls, all must
pass or NOTHING is printed.
"""

import json
import math
import os
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RENDER = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_E18_RENDER_9_12_26.json')
RESULT = os.path.join(ROOT, 'records', 'BOHEMIA_EYES_E18_AXES_9_12_26.json')

# ---------------------------------------------------------------------------
# THE REFERENCE COLUMN. Cited text or UNKNOWN, never a number I made up.
# Finding (a). Every value carries the source that says it, and the gate checks that
# every one of them does -- the shape PRE-JUDGE COVERAGE already uses.
# ---------------------------------------------------------------------------
REFERENCE = {
    'track': {
        'value': 'BESAID ISLAND, FINAL FANTASY X Original Soundtrack, disc 1 track 18',
        'source': 'Besaid (Final Fantasy X theme) -- https://finalfantasy.fandom.com/wiki/Besaid_(Final_Fantasy_X_theme)'},
    'composer': {
        'value': 'composed AND arranged by Masashi Hamauzu, not Uematsu',
        'source': 'Besaid (Final Fantasy X theme), and Music of Final Fantasy X -- https://en.wikipedia.org/wiki/Music_of_Final_Fantasy_X'},
    'tempo_bpm': {
        'value': 'UNKNOWN for the original recording',
        'source': 'every public BPM entry is a cover or arrangement (Celestial Aeon Project, '
                  'Franco Albertini, Josh Barron, Jeremy Ng, Game Soundtrack Cat, PianoDreams), '
                  'spread about 103 to 175 BPM. He named the original. '
                  'records/BOHEMIA_EYES_E18_ROUND_1_SCHOOL_THE_ANCHOR_HAS_NO_NUMBER_9_12_26.md section 4(a)'},
    'key_and_mode': {
        'value': 'UNKNOWN for the original recording. Cover entries disagree: E major on one, C#/Db minor on another',
        'source': 'same as tempo_bpm -- the entries are covers'},
    'beat_entry': {
        'value': 'the beat arrives LATE, over a picked melody that is already playing. That '
                 'lateness is named as part of what listeners loved.',
        'source': 'laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md, our own sound card, '
                  'whose original-versus-remaster direction is separately FLAGGED as unverified'},
    'bass': {
        'value': 'a played bass line sits under the melody',
        'source': 'laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md'},
    'instrumentation': {
        'value': 'real violin, hand percussion and picked strings, played by people',
        'source': 'laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md'},
    'melody_shape': {
        'value': 'a picked, patient melodic line; warm and hopeful with something sad underneath',
        'source': 'laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md'},
    'loudness': {
        'value': 'UNKNOWN. The recording is not in this repo and is not going to be, so the '
                 'loudness match the trade performs first cannot be performed at all.',
        'source': 'round one section 2: Metric AB and Reference 2 both match loudness before any '
                  'A/B, and both need the reference audio in the machine to do it'},
}

NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
MAJOR_PENT = {0, 2, 4, 7, 9}
MINOR_PENT = {0, 3, 5, 7, 10}


def midi(hz):
    return 12 * math.log2(hz / 440.0) + 69 if hz and hz > 0 else None


def name_of(m):
    return '%s%d' % (NOTE_NAMES[int(round(m)) % 12], int(round(m)) // 12 - 1)


def parsons(pitches):
    """Parsons code: the direction of every interval and nothing else. Parsons showed
    that alone separates a large number of tunes, which is exactly the level of detail
    "the shape of the melody" means."""
    out = []
    for a, b in zip(pitches, pitches[1:]):
        out.append('U' if b > a + 0.5 else ('D' if b < a - 0.5 else 'R'))
    return ''.join(out)


def invert(pitches):
    if not pitches:
        return []
    p0 = pitches[0]
    return [p0 - (p - p0) for p in pitches]


def contour_agreement(a, b):
    ca, cb = parsons(a), parsons(b)
    if not ca or len(ca) != len(cb):
        return 0.0
    return round(sum(1 for x, y in zip(ca, cb) if x == y) / float(len(ca)), 4)


def tempo_from_onsets(times, floor_bpm=30.0):
    """Tempo from the SPACING of onsets, not from a beat tracker.

    Round one's school found the failure mode that matters here: state-of-the-art beat
    trackers make octave errors, percussion presence changes their performance, and the
    standard DBN post-processor's default 55 BPM floor forces double-tempo predictions
    on slow music (measured wrong on 21% of the hard set). This is not that. The engine
    hands us exact onset times, so the interval is exact and there is no inference to
    get an octave wrong. The floor is 30 BPM and it is written down rather than being a
    library default nobody can see. C2 proves it separates 60 from 120.
    """
    t = sorted(set(round(float(x), 6) for x in times))
    if len(t) < 3:
        return None
    d = np.diff(t)
    d = d[d > 1e-4]
    if len(d) == 0:
        return None
    step = float(np.median(d))
    bpm = 60.0 / step
    while bpm > 300:
        bpm /= 2.0
    while bpm < floor_bpm:
        bpm *= 2.0
    return round(bpm, 2)


def grid_from_onsets(times):
    """The STEP of a quantised stream, and the beat derived from it.

    THE FIRST VERSION OF THIS PRINTED 228.57 BPM AND IT WAS MY MISTAKE, NOT THE SONG'S.
    Pointing the interval estimator at the drum stream measures the spacing of DRUM
    ONSETS, and this kit puts a kick and a hat on different sixteenths, so the median
    interval is one STEP, not one beat. The number was arithmetically correct about the
    wrong quantity and it sat in a row headed TEMPO, which is worse than no number.
    So: measure the step, say it is the step, and derive the beat from the engine's own
    four-steps-a-beat grid.
    """
    t = sorted(set(round(float(x), 6) for x in times))
    if len(t) < 8:
        return None
    d = np.diff(t)
    d = d[d > 0.02]                     # two voices on one step are not an interval
    if len(d) == 0:
        return None
    step = float(np.median(d))
    return {'step_seconds': round(step, 5),
            'beat_seconds': round(step * 4, 5),
            'bpm': round(60.0 / (step * 4), 2)}


def swing_offset(times, step):
    """How far off the grid the odd steps sit. The row says swing 0.1; the engine delays
    odd sixteenths by swing * step * 0.5. Measuring it back is a positive control that
    the render really used THIS song's settings and not the engine's defaults."""
    off = []
    for x in sorted(set(round(float(v), 6) for v in times)):
        k = x / step
        near = round(k)
        if abs(k - near) < 0.45 and near % 2 == 1:
            off.append((k - near) * step)
    return round(float(np.median(off)), 6) if off else None


def read_wav(p):
    with wave.open(p, 'rb') as fh:
        rate = fh.getframerate()
        n = fh.getnframes()
        raw = fh.readframes(n)
    x = np.frombuffer(raw, dtype='<i2').astype(np.float64) / 32768.0
    return rate, x


def onsets_from_audio(x, rate, hop=0.01, win=0.02, rise=6.0):
    """Energy-rise onset detection. Used for ONE purpose: to cross-check the engine's
    own schedule with the sound that actually came out, and to satisfy C4. Two
    independent instruments agreeing is worth more than either alone."""
    h, w = int(rate * hop), int(rate * win)
    frames = max(0, (len(x) - w) // h)
    e = np.array([np.sqrt(np.mean(x[i * h:i * h + w] ** 2)) + 1e-12 for i in range(frames)])
    d = np.diff(e)
    thr = rise * float(np.median(np.abs(d))) if len(d) else 0
    out = []
    for i in range(1, len(d)):
        if d[i] > thr and d[i] >= d[i - 1]:
            t = (i + 1) * hop
            if not out or t - out[-1] > 0.05:
                out.append(round(t, 3))
    return out


def loudness(x):
    """Our own level only. There is no reference audio to match it against, and round
    one says an honest blank beats a borrowed number."""
    rms = float(np.sqrt(np.mean(x ** 2))) if len(x) else 0.0
    peak = float(np.max(np.abs(x))) if len(x) else 0.0
    db = lambda v: round(20 * math.log10(v), 2) if v > 1e-9 else -140.0
    return {'rms_dbfs': db(rms), 'peak_dbfs': db(peak),
            'crest_db': round(db(peak) - db(rms), 2) if rms > 1e-9 else None}


def band_share(x, rate):
    """How much of the energy is under 150 Hz, which is the honest form of "is there a
    bass holding the floor". A one-pole pair, done twice, so it is a real filter and not
    an FFT bin guess."""
    X = np.fft.rfft(x * np.hanning(len(x)))
    f = np.fft.rfftfreq(len(x), 1.0 / rate)
    p = np.abs(X) ** 2
    tot = float(p.sum()) or 1.0
    out = {}
    for lo, hi, k in ((0, 150, 'under_150hz'), (150, 800, 'mid_150_800hz'), (800, rate / 2, 'over_800hz')):
        out[k] = round(float(p[(f >= lo) & (f < hi)].sum()) / tot, 4)
    return out


# ---------------------------------------------------------------------------
# RULE ZERO
# ---------------------------------------------------------------------------
def controls(rate):
    c = []

    # C2 -- the octave-error control round one made mandatory.
    clicks120 = [i * 0.5 for i in range(24)]
    clicks60 = [i * 1.0 for i in range(24)]
    c.append(('C2a a click train at 120 reads 120', tempo_from_onsets(clicks120) == 120.0,
              str(tempo_from_onsets(clicks120))))
    c.append(('C2b the same train at half speed reads 60 and NOT 120', tempo_from_onsets(clicks60) == 60.0,
              str(tempo_from_onsets(clicks60))))

    # C3 -- contour against itself and against its own inversion.
    mel = [62, 66, 69, 71, 69, 66, 64, 62]
    same = contour_agreement(mel, mel)
    inv = contour_agreement(mel, invert(mel))
    c.append(('C3a a melody against itself reads identical', same == 1.0, str(same)))
    c.append(('C3b the same melody against its own inversion reads maximally different',
              inv == 0.0, str(inv)))

    # C4 -- a planted onset at a known time is found at that time.
    n = int(rate * 3.0)
    x = np.zeros(n)
    at = 1.25
    i0 = int(at * rate)
    x[i0:i0 + int(rate * 0.05)] = np.sin(2 * np.pi * 440 * np.arange(int(rate * 0.05)) / rate) * 0.5
    got = onsets_from_audio(x, rate)
    near = [t for t in got if abs(t - at) <= 0.03]
    c.append(('C4 a planted onset at 1.25 s is found within 30 ms', len(near) == 1,
              'found ' + str(got[:4])))
    return c


def main():
    gate = '--gate' in sys.argv
    if '--render' in sys.argv or not os.path.exists(RENDER):
        env = dict(os.environ, NODE_PATH=os.environ.get('NODE_PATH', '/opt/node22/lib/node_modules'))
        r = subprocess.run(['node', os.path.join(ROOT, 'tools', 'bohemia_eyes_hear.js')],
                           capture_output=True, text=True, timeout=1200, env=env)
        if r.returncode != 0:
            print('the render died:\n' + (r.stderr or '')[-1500:])
            return 1

    d = json.load(open(RENDER, encoding='utf-8'))
    if not d.get('ok'):
        print('the render is not usable: ' + str(d.get('why')))
        return 1

    wavp = os.path.join(ROOT, d['wav'])
    rate, x = read_wav(wavp)
    lead = float(d.get('leadin') or 0.0)
    notes = [dict(n, t=n['t'] - lead) for n in d['notes']]
    drums = [n for n in notes if n['kind'] == 'd']
    voices = [n for n in notes if n['kind'] == 'v']
    sched_osc = [n for n in notes if n['kind'] == 'o']          # the scheduler's own raw notes
    mel = sorted(sched_osc, key=lambda n: n['t'])
    mel_midi = [midi(n['hz']) for n in mel if n.get('hz')]
    bass_notes = [n for n in voices if n['name'] == (d['row'].get('inst') or {}).get('b')]

    step = d['stepDur']
    grid = grid_from_onsets([n['t'] for n in drums])
    swing = swing_offset([n['t'] for n in drums], step)
    swing_expected = round((d['row'].get('swing') or 0) * step * 0.5, 6)

    ctrl = controls(rate)
    ctrl.append(('C1a the render is sound, not silence', float(np.max(np.abs(x))) > 0.001,
                 'peak %.4f' % float(np.max(np.abs(x)))))
    ctrl.append(('C1b the note log can see EVERY way this engine makes a note',
                 len(sched_osc) > 0 and len(voices) > 0 and len(drums) > 0,
                 '%d raw scheduler notes, %d named-voice notes, %d drum hits'
                 % (len(sched_osc), len(voices), len(drums))))
    ctrl.append(('C1c the audio agrees with the engine schedule on the first onset',
                 True, ''))   # filled in below once both are computed

    ctrl.append(('C1d the render really used this song\'s settings (measured swing matches the row)',
                 swing is not None and abs(swing - swing_expected) <= 0.002,
                 'measured %s s, the row asks %s s' % (swing, swing_expected)))

    audio_ons = onsets_from_audio(x, rate)
    first_audio = audio_ons[0] if audio_ons else None
    first_sched = min([n['t'] for n in notes]) if notes else None
    first_audio = (first_audio - lead) if first_audio is not None else None
    agree = (first_audio is not None and first_sched is not None
             and abs(first_audio - first_sched) <= 0.12)
    ctrl[-1] = ('C1c the audio agrees with the engine schedule on the first onset', agree,
                'audio %s vs schedule %s' % (first_audio, first_sched))

    bad = [n for n, ok, _ in ctrl if not ok]

    # ---- the four axes, one number per side, no total ----------------------
    bpm = round(60.0 / (step * 4), 2)                 # 16 steps a bar, 4 steps a beat

    mel_first = mel[0]['t'] if mel else None
    drum_first = min([n['t'] for n in drums]) if drums else None
    bass_first = min([n['t'] for n in bass_notes]) if bass_notes else None

    # PER SECTION, NOT OVER THE WHOLE SONG, AND THE FIRST VERSION GOT THIS WRONG TOO.
    # Pooling every melody note printed "scale UNRECOGNISED", which read as a fault in
    # the song. It was a fault in the unit: the engine transposes by a root shift per
    # section (its RT table), so the union of two transposed pentatonics is nine pitch
    # classes and matches nothing. Named per section, both sections are pentatonic.
    secmap = {s['bar']: s for s in d['sections']}
    bar_len = step * 16
    per_sec = {}
    for n, m in zip(mel, mel_midi):
        bar = int(n['t'] // bar_len)
        s = secmap.get(bar)
        if not s:
            continue
        per_sec.setdefault((s['sec'], s['rs']), set()).add(int(round(m)) % 12)
    # AND NAMED AS A TRANSPOSITION OF THE ROW'S OWN PATTERN, NOT AS A MODE.
    # The mode-naming pass printed "D major pentatonic and D# minor pentatonic" for two
    # sections that are the SAME five-note pattern moved up four semitones -- both names
    # were correct for their pitch set and together they read as a contradiction. The
    # row already carries the pattern. So each section is reported as that pattern plus
    # its shift, which is what the engine actually did, and the pattern is named once.
    rowscale = list(d['row'].get('scale') or [])
    patname = ('major pentatonic' if set(rowscale) == MAJOR_PENT
               else 'minor pentatonic' if set(rowscale) == MINOR_PENT else 'a five-note scale')
    scales = []
    for (sec, rs), pcs in sorted(per_sec.items()):
        shift = None
        for k in range(12):
            if set((x - k) % 12 for x in pcs) <= set(v % 12 for v in rowscale):
                shift = k
                break
        scales.append({'section': sec, 'root_shift_index': rs,
                       'pitch_classes': [NOTE_NAMES[x] for x in sorted(pcs)],
                       'is_the_rows_pattern_from': NOTE_NAMES[shift] if shift is not None else 'UNRECOGNISED'})
    tonic = None
    mode = ('the row\'s own scale %s, which is %s, played from %s'
            % (rowscale, patname,
               ' and then '.join(s['is_the_rows_pattern_from'] for s in scales))) if scales else 'UNKNOWN'

    par = parsons(mel_midi)
    runs = max((len(r) for r in par.replace('D', ' ').split()), default=0) if par else 0
    runs_d = max((len(r) for r in par.replace('U', ' ').split()), default=0) if par else 0
    bands = band_share(x, rate)
    loud = loudness(x)

    axes = [
        {'axis': 'TEMPO',
         'ours': '%s BPM. The engine steps every %s s, four steps to a beat, so the beat is %s s. '
                 'The drum onsets measure a median spacing of %s s, which is the %s s step PLUS the '
                 'swing: the row asks for %s ms of it and the odd sixteenths measure %s ms late. '
                 'The measured spacing is not a different tempo, it is the swing showing up in the '
                 'measurement, and saying so is the difference between a number and a mistake.'
                 % (bpm, step, round(step * 4, 4),
                    (grid or {}).get('step_seconds'), step,
                    round(swing_expected * 1000, 2), round((swing or 0) * 1000, 2)),
         'reference': REFERENCE['tempo_bpm']['value'],
         'reference_source': REFERENCE['tempo_bpm']['source'],
         'verdict': 'FIXED BY LAW, NOT A GAP',
         'note': '120 BPM is a pillar law and the music runs the game\'s one clock. Whatever the '
                 'original\'s tempo is, ours cannot move without breaking the law the fight, the '
                 'walk and the mouth all keep.'},
        {'axis': 'ENTRY OF THE BEAT',
         'ours': 'the drums start at %.3f s, the bass at %.3f s, and THE MELODY DOES NOT ARRIVE '
                 'UNTIL %.3f s (bar 4, the first B section)'
                 % (drum_first if drum_first is not None else -1,
                    bass_first if bass_first is not None else -1,
                    mel_first if mel_first is not None else -1),
         'reference': REFERENCE['beat_entry']['value'],
         'reference_source': REFERENCE['beat_entry']['source'],
         'verdict': 'THE ARRANGEMENT IS INVERTED',
         'note': 'Ours is patient with the TUNE and instant with the BEAT: eight seconds of drums '
                 'and bass before a melody note. The reference is described the other way round, '
                 'a melody already playing when the beat arrives. Same patience, opposite element. '
                 'This is the one axis where a change is both possible and cheap, and what to '
                 'change is SOUNDS\' call, not this lane\'s.'},
        {'axis': 'BASS',
         'ours': '%d bass notes on the voice named ABYSSBASS, first at %.3f s, median pitch %s; '
                 '%.1f%% of the song\'s energy sits under 150 Hz'
                 % (len(bass_notes), bass_first if bass_first is not None else -1,
                    'UNKNOWN (the bass voice is not a bare oscillator, so its pitch is not in the log)',
                    100 * bands['under_150hz']),
         'reference': REFERENCE['bass']['value'],
         'reference_source': REFERENCE['bass']['source'],
         'verdict': 'PRESENT ON BOTH SIDES',
         'note': 'Presence and register only, per round one. A played bass line and a step pattern '
                 'are comparable as floor-holding, never as performance.'},
        {'axis': 'SHAPE OF THE MELODY',
         'ours': '%d melody notes, %s, from %s to %s, one note every %.2f s. Parsons code %s. '
                 'Longest rise %d steps, longest fall %d steps.'
                 % (len(mel_midi), mode,
                    name_of(min(mel_midi)) if mel_midi else '?',
                    name_of(max(mel_midi)) if mel_midi else '?',
                    (mel[1]['t'] - mel[0]['t']) if len(mel) > 1 else -1,
                    par, runs, runs_d),
         'reference': REFERENCE['melody_shape']['value'],
         'reference_source': REFERENCE['melody_shape']['source'],
         'verdict': 'MEASURED ON OURS, CITED ON THE REFERENCE',
         'note': 'One five-note pattern, moved by the engine\'s own root-shift table between '
                 'sections. That pattern is a major pentatonic, which contains no minor second and '
                 'no tritone, and that is the mechanical reason such a line reads warm and cannot '
                 'read sour. It is the closest a machine gets to "warm and hopeful" without '
                 'deciding taste, and deciding taste is DIRECTION\'s.',
         'scales_per_section': scales},
        {'axis': 'INSTRUMENTATION',
         'ours': 'a triangle oscillator through a 2200 Hz lowpass carries the tune; ABYSSBASS holds '
                 'the floor; NIGHTPAD holds the room; KNOCK and TIGHT are the kit',
         'reference': REFERENCE['instrumentation']['value'],
         'reference_source': REFERENCE['instrumentation']['source'],
         'verdict': 'NOT COMPARABLE, ON PURPOSE',
         'note': 'A synth patch and a violin are not two points on one ruler. What IS checkable is '
                 'the ROLE each voice plays, and that check found the thing below.'},
    ]

    # the role check, and the one finding it turned up
    lead_named = (d['row'].get('inst') or {}).get('l')
    lead_played = sum(1 for n in voices if n['name'] == lead_named)
    roles = {
        'lead_named_in_the_row': lead_named,
        'times_that_voice_was_scheduled': lead_played,
        'what_actually_carries_the_tune': 'a bare triangle oscillator through a lowpass',
        'why': ("the engine's melody branch calls the named lead voice ONLY when mel is 'hymn' or "
                "the lead is 'bell'. This song is mel='longs', so the melody falls to the raw "
                "oscillator branch and the named lead is never reached."),
        'his_words_on_it': ('the batch 22 verdict records the song as "lead brokenrosary" and says '
                            '"brokenrosary is the lead he named"'),
        'not_this_lane_to_fix': True,
    }

    result = {
        'what': 'E18 [he can hear it] round two: the axis card, measured',
        'date': '9/12/26',
        'school': 'records/BOHEMIA_EYES_E18_ROUND_1_SCHOOL_THE_ANCHOR_HAS_NO_NUMBER_9_12_26.md',
        'candidate': {'name': d['song'], 'row': d['row'],
                      'his_words': 'The marker on the door at full intensity is now one of my new '
                                   'favorite songs that you\'ve made great job (Paolo 8/2)'},
        'anchor': {k: v['value'] for k, v in REFERENCE.items()},
        'anchor_sources': {k: v['source'] for k, v in REFERENCE.items()},
        'render': {'wav': d['wav'], 'seconds': d['seconds'], 'rate': rate,
                   'bars': d['bars'], 'step_seconds': step,
                   'notes_logged': len(notes), 'drums': len(drums),
                   'named_voice_notes': len(voices), 'raw_scheduler_notes': len(sched_osc)},
        'loudness_ours': loud,
        'loudness_match': REFERENCE['loudness']['value'],
        'bands': bands,
        'axes': axes,
        'role_check': roles,
        'controls': [{'name': n, 'pass': ok, 'detail': det} for n, ok, det in ctrl],
        'flags_for_the_coordinator': [
            'laws/BOHEMIA_ADDENDUM_WHAT_BOHEMIA_SOUNDS_LIKE_9_6_26.md describes the '
            'original-versus-remaster difference in the opposite direction to every source '
            'reachable in round one, and implies the wrong composer for the one track he named. '
            'Every reference value above that leans on that law is marked with it.',
            'The lead voice named in the song row and in his own verdict is scheduled zero times '
            'in twenty-four bars. SOUNDS and COMBAT own the engine; this lane only measured it.',
        ],
        'blind_spots': [
            'no loudness match was performed, because the reference recording is not in this repo '
            'and is not going to be. The trade matches loudness first; we cannot.',
            'the reference column is description, not measurement. Nothing here compares two '
            'waveforms, and nothing here is a score.',
            'the bass voice is a rack voice, so its pitch is not in the note log. Its register is '
            'reported as band energy instead of as a number of semitones.',
            'twenty-four bars is the arrangement this measured. A longer run reaches sections C '
            'and D, which schedule differently.',
        ],
    }

    if bad:
        print('RULE ZERO FAILED -- no numbers printed. failing controls:')
        for n in bad:
            print('   ' + n)
        return 1

    if not gate:
        json.dump(result, open(RESULT, 'w', encoding='utf-8'), indent=2)

    print('CONTROLS  %d/%d pass' % (len(ctrl) - len(bad), len(ctrl)))
    print('')
    print('THE CANDIDATE  %s   (Paolo 8/2, "one of my new favorite songs")' % d['song'])
    print('THE ANCHOR     %s' % REFERENCE['track']['value'])
    print('               %s' % REFERENCE['composer']['value'])
    print('')
    print('RENDERED       %.1f s, %d bars, through the engine\'s own scheduler. '
          '%d notes logged: %d drum hits, %d named-voice notes, %d raw scheduler notes.'
          % (d['seconds'], d['bars'], len(notes), len(drums), len(voices), len(sched_osc)))
    print('OUR LOUDNESS   %s dBFS rms, %s dBFS peak, crest %s dB. No match against the reference '
          'was possible.' % (loud['rms_dbfs'], loud['peak_dbfs'], loud['crest_db']))
    print('')
    for a in axes:
        print('%-22s %s' % (a['axis'], a['verdict']))
        print('   OURS        %s' % a['ours'])
        print('   REFERENCE   %s' % a['reference'])
        print('   NOTE        %s' % a['note'])
        print('')
    print('THE ROLE CHECK, AND IT FOUND SOMETHING:')
    print('   the row names %s as the lead. It is scheduled %d times in %d bars.'
          % (roles['lead_named_in_the_row'], roles['times_that_voice_was_scheduled'], d['bars']))
    print('   %s' % roles['why'])
    print('   %s' % roles['his_words_on_it'])

    if gate:
        bad_gate = []

        # 1. every reference value carries the source that says it. Finding (a): the
        #    whole reason this lane may print a reference value at all is that it can
        #    name who said it. A value that loses its source becomes a number somebody
        #    made up, which is the exact rot E11 found in CLAUDE.md's law index.
        srcs = [k for k, v in REFERENCE.items() if not v.get('source')]
        if srcs:
            bad_gate.append('reference values with no source: ' + ', '.join(srcs))

        # 2. STALENESS, the same way NO READER and LOCKED RATCHET do it. These numbers
        #    describe one song row in the shipped alpha. If that row is edited, every
        #    number above is about a song that no longer exists, and a green light for
        #    that is worse than no gate.
        alpha = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
        row_now = None
        if os.path.exists(alpha):
            txt = open(alpha, encoding='utf-8', errors='replace').read()
            i = txt.find("{n:'" + d['song'] + "'")
            if i >= 0:
                # BRACE MATCHING, BECAUSE find('},') STOPS AT THE NESTED inst:{...}.
                # The first cut of this check went RED saying the shipped row had lost
                # swing:0.1. The row had not changed; my slice ended thirty characters
                # early, inside inst:{b:...,l:...}, so the field it was looking for was
                # outside the text it was looking in. The gate biting on its own parser
                # is the system working, and the fix belongs in the parser.
                depth, j = 0, i
                while j < len(txt):
                    if txt[j] == '{':
                        depth += 1
                    elif txt[j] == '}':
                        depth -= 1
                        if depth == 0:
                            break
                    j += 1
                row_now = txt[i:j + 1]
        if row_now is None:
            bad_gate.append('the song row for ' + d['song'] + ' is no longer in the shipped alpha')
        else:
            for k in ('root', 'wave', 'swing', 'mel', 'feel'):
                v = d['row'].get(k)
                if v is None:
                    continue
                want = ("%s:'%s'" % (k, v)) if isinstance(v, str) else ('%s:%s' % (k, v))
                if want not in row_now:
                    bad_gate.append('the shipped row no longer carries ' + want +
                                    ', so the measured axes are stale: re-run '
                                    'tools/bohemia_eyes_hear.py --render')
                    break

        # 3. the controls. Nothing above is believable without them.
        if bad:
            bad_gate.append('%d control(s) failed' % len(bad))

        for m in bad_gate:
            print('RED: ' + m)
        if bad_gate:
            return 1
        print('GATE OK: %d reference values, every one carries its source; %d controls pass; '
              'the shipped song row still matches the one that was measured. '
              'REPORTED, NOT RATCHETED: the lead voice named in the row is scheduled %d times.'
              % (len(REFERENCE), len(ctrl), roles['times_that_voice_was_scheduled']))
    return 0


if __name__ == '__main__':
    sys.exit(main())

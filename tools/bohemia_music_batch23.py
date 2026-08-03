#!/usr/bin/env python3
"""
BOHEMIA - MUSIC BATCH 23. TWO SONGS FOR THE TWO SLOTS BATCH 22 OPENED.

WHICH THEORY THIS BATCH IS BUILT ON, said out loud because the graveyard now
demands it: THE PITCH-STABILITY READING. Across the seven songs he has judged in
batches 21 and 22, every survivor (lastrites, tithebell, brokenrosary) holds and
ARTICULATES a pitch you can follow, and every casualty (ossuary, dyingfilament,
saltpsalm, tollhouse) is built on instability -- no oscillator at all, a flutter
slowing to a stop, an interval sliding to unison, a sideband that moves with
register. It is a correlation on seven songs and it is written down as a
hypothesis, not a law. The batch before this one was built on a theory that
turned out to be false (semitone adjacency), so this one names its theory in
public and will be judged on it.

AND THE ONE THING THAT IS NOT A THEORY. He said, in his own words, unprompted:

  "The marker on the door at full intensity is now one of my new favorite songs
   that you've made great job"

That is the only positive ruling on a cooked song in the entire music record. It
names a lead (BROKENROSARY) and an intensity (FULL). What brokenrosary actually
does is ARTICULATE -- one pitch, struck and re-struck, the ear given an event to
follow instead of a texture to sit in. So both voices here articulate too, by
mechanisms the rack has never used. This is not a remake of brokenrosary: it is
the PROPERTY he liked, carried into two different machines.

VOICE LEDGER - two births, two mechanisms:
  splinterbell  A BELL WHOSE OVERTONES ARE MUSIC. Real bells are inharmonic
                because physics puts their partials at ugly ratios. This one
                puts them at SEMITONES -- +3, +7, +10, +15 above the fundamental,
                each with its own decay -- so every single note is a chord of
                itself, in tune with the song, and the strike is unmistakably
                pitched. Nothing else in the rack places partials in MUSICAL
                space instead of ratio space.
  onebreath     A SINGER RUNNING OUT OF AIR. The pitch never moves. The
                ENVELOPE is the instrument: attack, plateau, a sag as the breath
                fails, a sharp catch-breath, then a shorter second plateau that
                gives out. Six scheduled amplitude points on one steady tone. The
                rack has attack/decay voices and it has tremolo voices; it has
                nothing where PHRASING is the whole idea and the pitch is a rock.

VARIETY LAW, checked against each other AND against the three living songs from
batches 21-22 (the gate only checks the fresh pair, so the wider check is mine):
  NOBODY LOCKS UP ANYMORE      root 43  [0,2,5,7,9]   drive   kick [0,2,7,10]
  WHAT THE METER STILL READS   root 34  [0,1,5,8]     half    kick [0,5,10]
  (living) NOBODY CASHES OUT   root 50  [0,2,3,6,7,9] normal  kick [0,6,8,14]
  (living) TITHE FOR THE PEWS  root 38  [0,3,5,8,11]  half    kick [0,4,8,12]
  (living) THE MARKER ON DOOR  root 48  [0,2,4,7,9]   normal  kick [0,4,8,11]
Two roots nobody uses, two scales nobody uses, two kick placements nobody uses,
two melody engines (drive16 / hymn is taken, so seed8 and drive16), two klay
intensification styles that are not MELODY, so they do not intensify the way the
song he just praised does.

SCREECH LAW: no createDelay, no createConvolver, no feedback path. Both voices
are excited-and-decaying: finite nodes, scheduled stops, everything lands on
MAST.

GRAVEYARD CHECKED: neither name is in gates/bohemia_graveyard.txt, and neither
shape is a dead song's. NO REMAKES.

REUSE CHECK: zero graphic pixels are cooked here, so no banks/ art bank applies
and none was opened. On the audio side the reuse is real and deliberate: bass,
pad and kit all come from the CANON RACK (abyssbass/gravechoir, cryptorgan/
dreadbed, existing drum kinds) rather than being newly synthesised, because the
living-orchestra rule says a new song is a new LEAD wearing the house band. Only
the two leads are new code.

  python3 tools/bohemia_music_batch23.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

V_BEGIN = '  /* ===== BATCH 23 VOICES (8/2/26) ============================='
V_END = '  /* ===== end batch 23 voices ==================================== */'

VOICES = V_BEGIN + r"""
     Two mechanisms the rack has never used, both of them ARTICULATED on
     purpose: a pitch you can follow is the one property every song he has kept
     shares. Excited-and-decaying, finite nodes, scheduled stops, no delay, no
     convolver, no feedback. */

  /* SPLINTERBELL -- A BELL WHOSE OVERTONES ARE MUSIC. A real bell is inharmonic
     because physics puts its partials at ratios like 2.76 and 5.40. This one
     puts them at SEMITONES above the fundamental, so the strike is a chord of
     itself and it is always in tune with the song. Partials in MUSICAL space,
     not ratio space -- the rack has nothing else that does this. */
  if(kind==='splinterbell'){
    const f0=hz(semi);
    /* semitone offset, level, how long it rings. Higher splinters die first,
       which is what makes it read as one bell and not four organ pipes. */
    const P=[[0,0.40,1.00],[3,0.20,0.72],[7,0.16,0.55],[10,0.11,0.40],[15,0.07,0.28]];
    const dur=sd*2.4;
    for(let i=0;i<P.length;i++){
      const o=AC.createOscillator(), g=AC.createGain();
      o.type = i? 'sine' : 'triangle';        /* fundamental has a body, splinters are pure */
      o.frequency.value=f0*Math.pow(2,P[i][0]/12);
      o.detune.value=(i%2?7:-7);              /* never dead unison between splinters */
      const amp=g0*P[i][1], d=dur*P[i][2];
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(amp,t+0.006+i*0.004);   /* the strike spreads upward */
      g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      o.connect(g); g.connect(MAST);
      o.start(t); o.stop(t+d+0.03);
    }
    return;
  }

  /* ONEBREATH -- A SINGER RUNNING OUT OF AIR. The PITCH NEVER MOVES; the
     envelope is the entire instrument. Attack, plateau, a sag as the breath
     fails, a sharp catch, a shorter second plateau, gone. The rack has attack/
     decay voices and it has tremolo voices. It has nothing where PHRASING is
     the idea and the pitch is a rock. */
  if(kind==='onebreath'){
    const f0=hz(semi), dur=sd*3.2;
    const o=AC.createOscillator(), g=AC.createGain(), lp=AC.createBiquadFilter();
    o.type='sawtooth'; o.frequency.value=f0; o.detune.value=-6;
    lp.type='lowpass'; lp.frequency.setValueAtTime(1900,t);
    /* the tone also CLOSES as the breath fails, so the sag is heard twice */
    lp.frequency.linearRampToValueAtTime(1150,t+dur*0.46);
    lp.frequency.linearRampToValueAtTime(1700,t+dur*0.60);   /* the catch */
    lp.frequency.linearRampToValueAtTime(820,t+dur);
    const A=g0*0.36;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(A,t+0.09);                /* breath in */
    g.gain.setValueAtTime(A,t+dur*0.30);                     /* held */
    g.gain.linearRampToValueAtTime(A*0.34,t+dur*0.52);       /* running out */
    g.gain.linearRampToValueAtTime(A*0.92,t+dur*0.60);       /* the catch-breath */
    g.gain.setValueAtTime(A*0.92,t+dur*0.78);                /* second, shorter hold */
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);       /* gives out */
    /* a quiet octave under it so the rock-steady pitch reads as deliberate */
    const sub=AC.createOscillator(), sg=AC.createGain();
    sub.type='sine'; sub.frequency.value=f0*0.5; sub.detune.value=5;
    sg.gain.setValueAtTime(0.0001,t);
    sg.gain.linearRampToValueAtTime(g0*0.15,t+0.12);
    sg.gain.exponentialRampToValueAtTime(0.0001,t+dur*0.95);
    o.connect(lp); lp.connect(g); g.connect(MAST);
    sub.connect(sg); sg.connect(MAST);
    o.start(t); sub.start(t);
    o.stop(t+dur+0.04); sub.stop(t+dur+0.04);
    return;
  }
""" + V_END + "\n"

SONGS = [
 # BOTH SONGS WERE JUDGED DOWN THE SAME DAY THEY SHIPPED, so their literals are
 # DELETED rather than commented: a cook tool that can still emit a buried song
 # is a remake waiting for a re-run, and a commented dead name is still a live
 # reference to the graveyard gate. Re-running this tool now injects the two
 # VOICES and no songs, which is correct - splinterbell and onebreath live on
 # (song-dead-not-voices, 7/20) and are free to wear a different fashion.
 # AND READ THE DOCSTRING BEFORE REUSING THIS FILE AS A TEMPLATE: the theory it
 # was built on (pitch stability) was disproved by these two kills.
]
NEW_NAMES = [s.split("'")[1] for s in SONGS]

REPO_ENTRY = """
=== BATCH 23 (8/2/26) - TWO SONGS FOR THE TWO SLOTS BATCH 22 OPENED ===
BUILT ON A NAMED THEORY, so it can be proved wrong: PITCH STABILITY. All three
songs he has kept articulate a pitch you can follow; all four he has killed are
built on instability. Seven data points, stated as a hypothesis, not a law.
AND ON THE ONE THING HE ACTUALLY SAID: "The marker on the door at full intensity
is now one of my new favorite songs that you've made great job". That names
BROKENROSARY, whose whole idea is ARTICULATION. Both leads here articulate by
machines the rack has never used -- not a remake of that voice, the property of
it.
  NOBODY LOCKS UP ANYMORE     lead SPLINTERBELL  a bell whose overtones sit at
                              SEMITONES instead of physics ratios, so every note
                              is a chord of itself and always in tune.
  WHAT THE METER STILL READS  lead ONEBREATH     the pitch never moves and the
                              ENVELOPE is the instrument: a singer running out of
                              air, sagging, catching a breath, giving out.
Screech law clean, graveyard checked, house band on bass/pad/kit.

"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    if V_BEGIN in s:
        i = s.index(V_BEGIN); j = s.index(V_END) + len(V_END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  batch 23 voices removed (idempotent re-inject)')
    host = 'function synthV(kind,AC,MAST,hz,sd,semi,t,g0){\n'
    if host not in s:
        print('FAIL: synthV host not found')
        return 1
    s = s.replace(host, host + VOICES, 1)

    # songs: idempotent BY NAME, and MLOOPS rebuilt from PARSED ENTRIES so a
    # stray comma cannot leave an array hole (that bug bit twice on 8/2).
    i = s.index('const MLOOPS=['); j = s.index('\n];', i)
    head = 'const MLOOPS=['
    entries = [ln.strip().rstrip(',') for ln in s[i + len(head):j].split('\n')
               if ln.strip().startswith("{n:'")]
    mine = set(NEW_NAMES)
    kept = [e for e in entries if e.split("'")[1] not in mine]
    if len(entries) - len(kept):
        print('  dropped %d existing copy/copies before re-adding'
              % (len(entries) - len(kept)))
    s = s[:i] + head + '\n ' + ',\n '.join(kept + SONGS) + s[j:]

    m = re.search(r'const NEW_VIBES=\[[^\]]*\];', s)
    s = s[:m.start()] + 'const NEW_VIBES=[' + \
        ','.join("'" + n + "'" for n in NEW_NAMES) + '];' + s[m.end():]

    anchor = '<script type="text/plain" id="BOHEMIA_MUSIC_REPO">\n'
    if '=== BATCH 23 (8/2/26)' not in s:
        s = s.replace(anchor, anchor + REPO_ENTRY, 1)

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('BATCH 23 IS IN THE ALPHA.')
    for n in NEW_NAMES:
        print('  song  ' + n)
    for v in ('splinterbell', 'onebreath'):
        print('  voice ' + v + ' (newborn topology, articulated on purpose)')
    return 0


if __name__ == '__main__':
    sys.exit(main())

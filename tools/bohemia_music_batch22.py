#!/usr/bin/env python3
"""
BOHEMIA MUSIC BATCH 22 — THREE SONGS ANSWERING THE THREE DEAD SLOTS (8/2/26)

GRAVEYARD IS FINAL says fresh cooks answer dead slots. Batch 21 lost three
(THE HOUSE ALWAYS REMEMBERS, THE LAST LIGHT ON THE STRIP, WHAT THE PIT BOSS
BURIED), so three come back -- new names, new voices, nothing revived.

A THEORY I TESTED AND THREW AWAY, because it matters that this batch is not
built on it. After batch 21 I inferred that the casualties failed because their
LEADS could not hold a singable line. Refining that, I predicted the real
mechanism was SCALE: the melody engine picks scale degrees by hash, so a scale
containing adjacent semitones should throw random dissonant rubs and read as
texture. I measured it across all 131 songs with scales:

    NOBODY CASHES OUT       LIVED   2 semitone-adjacent pairs
    TITHE FOR THE EMPTY PEWS LIVED  1
    THE HOUSE ALWAYS REMEMBERS DIED 2      <- same as a survivor
    THE LAST LIGHT ON THE STRIP DIED 3
    canon corpus average: 1.19, and only 28% of canon songs have zero

THE THEORY IS DEAD. A survivor and a casualty share the same count. I am
recording this because the tempting move was to quietly build the batch on a
tidy rule and present it as insight; the rule does not survive its own data, and
a batch built on a disproved theory is worse than one built on the plain laws.

SO WHAT THIS BATCH IS ACTUALLY BUILT ON, all of it checkable:
  1. THE LAWS. New topologies, no two songs sharing scale+feel+kick, melodic
     under dread, screech law, no remakes.
  2. THE TWO SURVIVORS AS THE ONLY HARD EVIDENCE. He kept a 6-note scale at
     'normal'/'call' and a 5-note scale at 'half'/'hymn'. Both leads SUSTAIN a
     clear pitch for the length of a note. All three leads below sustain too --
     not because a theory says so, but because the two things he actually kept
     do, and that is the only signal in the data.
  3. NOT REUSING EITHER SURVIVOR'S IDENTITY. Different scales, feels, kicks and
     roots from both, so this batch is an answer rather than a variation.

THE THREE NEWBORN TOPOLOGIES (none in the 607-voice rack, none of them batch
21's four):

  brokenrosary  RHYTHM INSIDE ONE NOTE. A single pitch re-struck several times
                WITHIN its own duration, the gaps stretching as it goes and each
                strike quieter -- a rosary being counted by someone losing the
                thread. Every other voice in the rack is one attack per note;
                this one carries a pattern inside the note itself.
  saltpsalm     AN INTERVAL THAT RESOLVES WHILE IT SOUNDS. Two oscillators open
                a fifth apart and glide TOGETHER into unison across the note, so
                the consonance ARRIVES instead of being stated. subharmglide
                glides a pitch; this glides the DISTANCE BETWEEN two pitches to
                nothing.
  tollhouse     TIMBRE THAT CHANGES WITH REGISTER. Ring modulation where the
                modulator is a fixed offset in HZ rather than a ratio, so low
                notes beat slowly and sweetly and high notes turn clangorous.
                The instrument is a different instrument at each end of the
                keyboard, from one rule.

SCREECH LAW: no createDelay, no createConvolver, no feedback. All three are
excited-and-decaying with scheduled stops.

VARIETY LAW, and against the two living batch-21 songs as well:
  A BELL FOR NOBODY'S SHIFT     root 41  [0,2,5,7,10]     half    kick [0,6]
  THE MARKER ON THE DOOR        root 48  [0,2,4,7,9]      normal  kick [0,4,8,11]
  COUNTING WHAT IS LEFT         root 55  [0,3,7,10]       drive   kick [0,3,8,12]
Three roots, three feels, three kick placements, three scales, three melody
engines (call / longs / seed8).

GRAVEYARD CHECKED: none of these three names, and no dead song's shape, returns.

REUSE CHECK: zero graphic pixels, so no banks/ art bank applies and none was
opened. Canon rack voices carry bass/pad/kit on purpose (living orchestra,
song-dead-not-voices); only each LEAD is newborn, which is what the NEW VOICES
LAW asks. No new engine, no second AudioContext, no new master chain.

TASTE CHECK (sec 4 MUSIC): screech law held and gate-swept; no reused synthesis
skeleton (three different mechanisms); no shared scale+feel+kick; melody leads
rather than reading as texture -- each song carries a melody engine and a
sustaining named lead.

Idempotent BY SONG NAME, not by marker: the verdict tool rebuilds MLOOPS and
legitimately strips comment markers, which is how batch 21 got injected twice.

  python3 tools/bohemia_music_batch22.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
V_BEGIN = '  /* === BATCH 22 VOICES (8/2/26) ==='
V_END = '  /* === /BATCH 22 VOICES === */'

VOICES = V_BEGIN + r"""
     Three mechanisms the rack has never used. Excited-and-decaying, all of
     them: finite nodes, scheduled stops, no delay, no convolver, no feedback. */

  /* BROKENROSARY -- RHYTHM INSIDE ONE NOTE. The same pitch re-struck within its
     own duration, gaps stretching, each strike quieter. Somebody counting a
     rosary and losing the thread. Every other voice is one attack per note. */
  if(kind==='brokenrosary'){
    const f0=hz(semi), beads=5;
    let off=0, gap=sd*0.16;
    for(let i=0;i<beads;i++){
      const o=AC.createOscillator(), g=AC.createGain(), lp=AC.createBiquadFilter();
      o.type='triangle'; o.frequency.value=f0;
      o.detune.value=(i%2?6:-6);
      lp.type='lowpass'; lp.frequency.value=2600-i*280;   /* each bead duller */
      const amp=g0*0.34*Math.pow(0.72,i);
      const t0=t+off, dur=sd*0.55;
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.linearRampToValueAtTime(amp,t0+0.008);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
      o.connect(lp); lp.connect(g); g.connect(MAST);
      o.start(t0); o.stop(t0+dur+0.02);
      off+=gap; gap*=1.35;                                  /* the thread slipping */
    }
    return;
  }

  /* SALTPSALM -- AN INTERVAL THAT RESOLVES WHILE IT SOUNDS. Two voices open a
     fifth apart and glide together into unison across the note, so the
     consonance ARRIVES rather than being stated. subharmglide glides a pitch;
     this glides the DISTANCE between two pitches to nothing. */
  if(kind==='saltpsalm'){
    const f0=hz(semi), dur=sd*3.0;
    const parts=[[0,0],[7,0]];                    /* unison and a fifth above */
    for(const [openSemis] of parts.map(p=>[p[0]])){
      const o=AC.createOscillator(), g=AC.createGain();
      o.type = openSemis? 'triangle' : 'sawtooth';
      const start=f0*Math.pow(2,openSemis/12);
      o.frequency.setValueAtTime(start,t);
      o.frequency.exponentialRampToValueAtTime(f0,t+dur*0.72);   /* they meet */
      o.detune.value = openSemis? 4 : -4;         /* never dead unison */
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(g0*(openSemis?0.22:0.3),t+0.14);
      g.gain.setValueAtTime(g0*(openSemis?0.22:0.3),t+dur*0.6);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(g); g.connect(MAST); o.start(t); o.stop(t+dur+0.04);
    }
    return;
  }

  /* TOLLHOUSE -- TIMBRE THAT CHANGES WITH REGISTER. Ring modulation with the
     modulator at a fixed HZ OFFSET instead of a ratio: low notes beat slowly and
     sweetly, high notes go clangorous, from one rule. The instrument is a
     different instrument at each end of the keyboard. */
  if(kind==='tollhouse'){
    const f0=hz(semi), dur=sd*2.6;
    const car=AC.createOscillator(), mod=AC.createOscillator();
    const ring=AC.createGain(), g=AC.createGain();
    car.type='sine'; car.frequency.value=f0;
    mod.type='sine'; mod.frequency.value=f0+63;   /* FIXED Hz, never a ratio */
    ring.gain.value=0;                            /* modulator drives the gain */
    mod.connect(ring.gain);
    car.connect(ring); ring.connect(g); g.connect(MAST);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(g0*0.5,t+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    /* a plain carrier under it so the note still has a fundamental to sing */
    const sub=AC.createOscillator(), sg=AC.createGain();
    sub.type='triangle'; sub.frequency.value=f0; sub.detune.value=-5;
    sg.gain.setValueAtTime(0.0001,t);
    sg.gain.linearRampToValueAtTime(g0*0.2,t+0.03);
    sg.gain.exponentialRampToValueAtTime(0.0001,t+dur*0.9);
    sub.connect(sg); sg.connect(MAST);
    car.start(t); mod.start(t); sub.start(t);
    car.stop(t+dur+0.04); mod.stop(t+dur+0.04); sub.stop(t+dur+0.04);
    return;
  }
""" + V_END + "\n"

SONGS = [
 # BATCH 22 WAS JUDGED THE SAME DAY IT SHIPPED, AND TWO OF THREE WENT DOWN.
 # Their literals are DELETED from this tool, not commented out: a commented
 # `{n:'DEAD NAME'` is still a live reference to the graveyard gate, and a tool
 # that can still emit a buried song is a remake waiting for a re-run.
 # BURIED 8/2/26: A BELL FOR NOBODY'S SHIFT (lead saltpsalm) and COUNTING WHAT
 # IS LEFT (lead tollhouse). Both LEADS live on (song-dead-not-voices, 7/20) and
 # are still injected by the VOICES block above -- only the SONGS are gone.
 # Re-running this tool now re-injects the three voices and the ONE survivor.
 "{n:'THE MARKER ON THE DOOR',acc:'#a06a5a',root:48,scale:[0,2,4,7,9],wave:'sawtooth',kick:[0,4,8,11],bass:[0,4,9,12],hat:[2,6,10,14],inst:{b:'abyssbass',l:'brokenrosary'},am:'nightpad',kit:{k:'knock',h:'tight'},mel:'longs',swing:0.1,feel:'normal',klay:'melody',ff:true,bt:22}",
]
NEW_NAMES = [s.split("'")[1] for s in SONGS]

REPO_ENTRY = """
=== BATCH 22 (8/2/26) — THREE SONGS ANSWERING THE THREE DEAD SLOTS ===
  A BELL FOR NOBODYS SHIFT  41 [0,2,5,7,10]  half   [0,6]       lead SALTPSALM
  THE MARKER ON THE DOOR    48 [0,2,4,7,9]   normal [0,4,8,11]  lead BROKENROSARY
  COUNTING WHAT IS LEFT     55 [0,3,7,10]    drive  [0,3,8,12]  lead TOLLHOUSE

VOICE LEDGER — three births, three mechanisms:
  brokenrosary  rhythm INSIDE one note: the same pitch re-struck within its own
                duration, gaps stretching, each strike quieter and duller.
  saltpsalm     an interval that RESOLVES while it sounds: two voices open a
                fifth apart and glide together into unison across the note.
  tollhouse     ring modulation at a fixed HZ offset rather than a ratio, so low
                notes beat slowly and high notes go clangorous -- one rule, a
                different instrument at each end of the keyboard.

A THEORY TESTED AND DISCARDED, recorded so nobody rebuilds on it: after batch 21
I predicted the casualties died because their SCALES contained adjacent
semitones, which the hash-driven melody engine would turn into random rubs. It
does not hold -- NOBODY CASHES OUT survived with 2 semitone-adjacent pairs and
THE HOUSE ALWAYS REMEMBERS died with the same 2, and the canon corpus averages
1.19 with only 28% at zero. A survivor and a casualty share the count, so the
rule is dead. This batch is built on the LAWS plus the one real signal in the
data: both songs he kept have leads that SUSTAIN a clear pitch for the length of
a note, so all three leads here do too.
"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    if V_BEGIN in s:
        i = s.index(V_BEGIN); j = s.index(V_END) + len(V_END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  batch 22 voices removed (idempotent re-inject)')
    host = 'function synthV(kind,AC,MAST,hz,sd,semi,t,g0){\n'
    if host not in s:
        print('FAIL: synthV host not found')
        return 1
    s = s.replace(host, host + VOICES, 1)

    # songs: idempotent BY NAME (batch 21's marker approach double-injected)
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
    if '=== BATCH 22 (8/2/26)' not in s:
        s = s.replace(anchor, anchor + REPO_ENTRY, 1)

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('BATCH 22 IS IN THE ALPHA.')
    for n in NEW_NAMES:
        print('  song  ' + n)
    for v in ('brokenrosary', 'saltpsalm', 'tollhouse'):
        print('  voice ' + v + ' (newborn topology)')
    return 0


if __name__ == '__main__':
    sys.exit(main())

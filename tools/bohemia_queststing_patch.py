#!/usr/bin/env python3
"""
BOHEMIA — IT IS DONE IS A MUSICAL CUE, NOT A SOUND EFFECT (8/20/26, SOUND lane).

REUSE CHECK: cooks NO new voices and NO new candidates. It adds one FIGURE to
the STING system that already ships (win / loss / paid), played on `bell`, a
voice already in the rack. Measured before use: bell renders rms 0.020 / peak
0.219 through the real synthV in an OfflineAudioContext. Nothing new was
synthesised for this.

WHY. IT IS DONE was offered to Paolo TWENTY times across two ids and every one
died:

    quest_done  "the run completed. the one moment that earns the whole room"
    done_ring   "his own words: the one moment that earns the whole room"

0 UP / 20 DOWN. And the brief is the tell, in his own words: a moment that
"earns the whole room" needs HARMONY, a KEY and a LENGTH, and a 200-millisecond
one-shot has none of those. Twenty candidates died trying to be a fanfare
without being music. This is the no-paper-no-coins lesson one moment over --
see records/BOHEMIA_THE_BRIEF_WAS_WRONG_NINE_MORE_8_20_26.md -- and the fix is
not a twenty-first candidate, it is putting the moment in the system that can
actually carry it.

WHAT THE FIGURE IS. A PLAGAL CADENCE: the fourth resolving down to the root,
landing on root and octave together. Plagal resolves without triumph -- it is
the "settled" cadence, not the "victory" one -- and that is the right feeling
for finishing a job in a dead valley. `win` already owns triumph (four notes
rising an octave up) and it should keep owning it, or neither means anything.

    paid   2 notes, root and fifth       a water run
    done   4 notes, IV resolving to I    a job finished
    win    4 notes rising, +12           you lived through a fight

A FAILED quest plays the EXISTING `loss` figure. Falling, landing heavy, already
built and already measured. Failing a job and losing a fight are the same shape
of moment and there is no reason to author a second way to say it.

HOW IT IS WIRED, AND WHY IT TOUCHES NOBODY ELSE'S FILES. The city already
broadcasts its whole state to the parent every 800ms as `bohemiaCityState`, and
`citySnapshot()` carries `quest: DQ.serialize()`, which carries `state.done` and
`state.outcome`. So the parent can hear a quest finish by DIFFING state it is
already being handed -- exactly how PAYSTING hears a payday. No edit to the run,
no edit to the city world, ONE SYSTEM ONE SESSION intact.

WHAT IS NOT SHIPPED HERE, AND WHY: YOU OWN IT NOW (`deed`, `deed_stamp`, also
0 UP / 20 DOWN) is the same kind of moment and wants the same kind of answer.
It is NOT buildable from this lane today: `citySnapshot()` has no ownership
field, so there is nothing for the parent to diff. Wiring it would mean editing
the city world, which is another session's system. Recorded rather than faked.

  python3 tools/bohemia_queststing_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

FIG_ANCHOR = """    paid: { v:'coldpiano', g:0.20, sd:0.22, oct:0,
            n:[[0,0],[7,3]] }"""

FIG_NEW = """    paid: { v:'coldpiano', g:0.20, sd:0.22, oct:0,
            n:[[0,0],[7,3]] },
    /* IT IS DONE (8/20). Twenty candidates died as SOUND EFFECTS on this
       moment, and his own brief says why: "the one moment that earns the whole
       room" needs a key and a length, which a one-shot does not have.
       A PLAGAL CADENCE -- the fourth resolving to the root, landing on root and
       octave together. Plagal settles instead of celebrating, which is the
       right feeling for finishing a job in a dead valley; `win` keeps triumph,
       or neither of them means anything. `bell` measured rms 0.020 / peak 0.219
       through the real synthV before it was chosen. */
    done: { v:'bell',      g:0.20, sd:0.34, oct:0,
            n:[[5,0],[0,2],[0,5],[12,5]] }"""

STING_ANCHOR = "window.PAYSTING=PAYSTING;"

QUESTSTING = """window.PAYSTING=PAYSTING;

/* ===== QUESTSTING (8/20/26) -- FINISHING A JOB SOUNDS LIKE SOMETHING =====
   IT IS DONE went 0 UP / 20 DOWN across quest_done and done_ring, and it was
   never a synthesis failure: it was a MUSICAL CUE filed as a sound effect. See
   records/BOHEMIA_THE_BRIEF_WAS_WRONG_NINE_MORE_8_20_26.md.

   IT READS STATE IT IS ALREADY BEING HANDED. The city posts bohemiaCityState
   every 800ms and citySnapshot() carries quest:DQ.serialize(), which carries
   state.done and state.outcome. So this hears a quest finish by DIFFING, the
   same way PAYSTING hears a payday -- no edit to the run, no edit to the city
   world, nobody else's system touched.

   THE BASELINE NEVER SOUNDS, same rule as PAYSTING: loading a save whose quest
   is already finished is not the moment of finishing it, and a sting on reload
   would be a lie. The first report only records where we are. And the id is
   part of the identity, so finishing DAY TWO's quest still sounds even though
   `done` was already true for day one's. */
const QUESTSTING={
  seen:null,                       /* 'questid|done' as of the last report */
  key(q){
    try{
      if(!q) return null;
      var id=q.id||(q.state&&q.state.id)||'?';
      var st=q.state||{};
      return id+'|'+(st.done?'1':'0')+'|'+(st.outcome||'');
    }catch(e){ return null; }
  },
  onState(st){
    try{
      var q=st&&st.quest; if(!q) return;
      var k=this.key(q); if(k===null) return;
      if(this.seen===null){ this.seen=k; return; }   /* the baseline never sounds */
      if(k===this.seen) return;
      var was=this.seen; this.seen=k;
      var a=was.split('|'), b=k.split('|');
      /* A JOB ARRIVING IS A JOB TAKEN (8/25). MEASURED on the real walk: quest.id
         is null right up to and including the phone being OPEN, and becomes the
         quest's id the instant TAKE IT is tapped. `key` maps a null id to '?',
         so '?' -> a real id is exactly the moment he commits, and nothing else
         produces that transition.
         THE BASELINE GUARD ABOVE ALREADY COVERS A RELOAD: a save whose job is
         already active records that on the first report and stays silent,
         because starting the game is not taking a job. A day-2 job arriving does
         not fire either -- that is id -> id, never '?' -> id. */
      if(a[0]==='?' && b[0]!=='?' && b[1]!=='1'){
        if(window.STING)STING.play('taken');
        return;
      }
      /* only a transition INTO done, on the SAME quest, is the moment */
      if(a[0]!==b[0]) return;                        /* a different job entirely */
      if(a[1]==='1'||b[1]!=='1') return;             /* was already done, or still is not */
      if(!window.STING) return;
      /* FAILING A JOB AND LOSING A FIGHT ARE THE SAME SHAPE OF MOMENT, and
         `loss` is already built, already measured and already his. */
      STING.play((b[2]==='COMPLETE')?'done':'loss');
    }catch(err){}
  }
};
window.QUESTSTING=QUESTSTING;"""

WIRE_ANCHOR = """    try{ if(window.PAYSTING)PAYSTING.onState(d.bohemiaCityState); }catch(_e){}"""

WIRE_NEW = """    try{ if(window.PAYSTING)PAYSTING.onState(d.bohemiaCityState); }catch(_e){}
    /* 8/20: and the job finishing. Same message, same diff-the-state pattern. */
    try{ if(window.QUESTSTING)QUESTSTING.onState(d.bohemiaCityState); }catch(_e){}"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if "done: { v:'bell'" not in s:
        if FIG_ANCHOR not in s:
            print('FAIL: the STING figure table is not where this tool expects it')
            return 1
        s = s.replace(FIG_ANCHOR, FIG_NEW, 1)
        changed.append('STING.FIG.done added: a plagal cadence on bell')

    if 'const QUESTSTING=' not in s:
        if STING_ANCHOR not in s:
            print('FAIL: could not find PAYSTING to sit beside')
            return 1
        s = s.replace(STING_ANCHOR, QUESTSTING, 1)
        changed.append('QUESTSTING added: it diffs the quest state the city already posts')

    if 'QUESTSTING.onState' not in s.split('const QUESTSTING=')[-1][:4000] or \
       WIRE_NEW.split('\n')[-1] not in s:
        if WIRE_ANCHOR in s and 'QUESTSTING)QUESTSTING.onState' not in s:
            s = s.replace(WIRE_ANCHOR, WIRE_NEW, 1)
            changed.append('and the city-state message feeds it, beside PAYSTING')

    if not changed:
        print('  the alpha already has all of it')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    print('  NEXT: python3 gates/sting_audible_gate.py')
    return 0


if __name__ == '__main__':
    sys.exit(main())

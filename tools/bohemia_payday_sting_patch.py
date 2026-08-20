#!/usr/bin/env python3
"""
BOHEMIA — GETTING PAID SOUNDS LIKE SOMETHING (8/20/26, SOUND lane).

REUSE CHECK: cooks nothing. No voice, no song, no note, no new figure type. It
adds one entry to the STING figure table that shipped 8/19 and reuses `coldpiano`
out of his rack. Banks opened: none needed. The signal it listens to already
crosses into the alpha on its own.

THE MOMENT. The demo board's re-audit, hours ago, closed two rows: "getting paid
and spending both went live off his costs-one ruling". So a job now ends, the
purse gets credited, and the number in his phone goes up. IT MAKES NO SOUND. In
a game whose whole subject is a collapsed economy, money arriving is the most
loaded event there is, and it lands in silence.

`quest_done` exists as a cooked SFX moment -- "the run completed. the one moment
that earns the whole room" -- and it is NOT APPROVED, so today it plays exactly
nothing and will keep playing nothing until he thumbs it. A sting needs no thumb:
it is derived from the key of the song already running, so there is no candidate
to judge and nothing of his to wait on.

AND IT DOES NOT TOUCH ANOTHER LANE'S FILE. The obvious wiring is a postMessage
inside the city world's payForToday(), and the city world belongs to the WORLD
lane, which shipped into it today. ONE SYSTEM, ONE SESSION. It turns out none of
that is necessary: citySnapshot() already carries `purse`, reportState() already
posts it to the parent as bohemiaCityState, and the parent already handles that
message. The purse is a LEDGER -- {id, day, entries[]} -- so a payday is visible
from here as new `kind:'source'` entries appended to it. Nothing to add anywhere
but this side.

WHAT IT WILL AND WILL NOT SOUND ON, because a false positive here is worse than
silence:
  * a CREDIT arriving  ->  sting. That is being paid.
  * spending at a hub  ->  nothing. Those entries are 'drain', and losing money
                           in this game does not deserve a flourish.
  * a save being RESTORED -> nothing. A restore arrives as a whole ledger at
                           once and would otherwise sting for every credit the
                           player ever earned. The first snapshot of a session is
                           read as the baseline and never sounds.
  * the same snapshot twice -> nothing. reportState is debounced and re-fires.

IT IS DELIBERATELY MODEST. Two notes, root and fifth, on `coldpiano`. This is a
water run in a dead valley, not a boss kill, and the win sting for surviving a
firefight is a four-note rise -- if getting paid were as big as that, neither
would mean anything.

Idempotent: keyed on `PAYSTING`.

  python3 tools/bohemia_payday_sting_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- 1. the figure, added to the table STING already owns -----------------
OLD_FIG = """    loss: { v:'subboom',   g:0.26, sd:0.34, oct:-12,
            n:[[12,0],[7,4],[0,9]] }             /* falling, and it lands heavy */"""
NEW_FIG = """    loss: { v:'subboom',   g:0.26, sd:0.34, oct:-12,
            n:[[12,0],[7,4],[0,9]] },            /* falling, and it lands heavy */
    /* GETTING PAID (8/20). Deliberately the smallest of the three: two notes,
       root and fifth, no octave. A water run in a dead valley is not a boss
       kill, and if it were scored like one then neither would mean anything. */
    paid: { v:'coldpiano', g:0.20, sd:0.22, oct:0,
            n:[[0,0],[7,3]] }"""

# ---- 2. the watcher, beside STING -----------------------------------------
ANCHOR = "window.STING=STING;"

WATCH = r"""
/* ===== PAYSTING (8/20/26) -- GETTING PAID SOUNDS LIKE SOMETHING ==========
   A job ends, the purse is credited, the number in his phone goes up, and it
   makes no sound. In a game whose whole subject is a collapsed economy, money
   arriving is the most loaded event there is.

   IT READS A SIGNAL THAT ALREADY ARRIVES. The city world posts its whole state
   up here as bohemiaCityState for the autosave, and that snapshot carries the
   purse -- which is a LEDGER, {id, day, entries[]}, not a total. So a payday is
   visible from this side as new entries with kind 'source'. Nothing had to be
   added to the city world, which belongs to another lane and shipped into today.

   THE THREE FALSE POSITIVES IT REFUSES, because a sting that fires wrongly is
   worse than one that never fires:
     a RESTORE hands over a whole ledger at once -- the first snapshot of a
       session is the baseline and never sounds;
     SPENDING appends 'drain' entries -- losing money gets no flourish;
     the report is DEBOUNCED and re-fires the same state -- only growth counts. */
const PAYSTING={
  seen:null,                      /* how many entries we had last time */
  onState(st){
    try{
      var e=(st&&st.purse&&st.purse.entries)||null;
      if(!e||!e.length){ if(st&&st.purse)this.seen=0; return; }
      if(this.seen===null){ this.seen=e.length; return; }   /* the baseline never sounds */
      if(e.length<=this.seen){ this.seen=e.length; return; } /* debounce, or a load */
      var fresh=e.slice(this.seen);
      this.seen=e.length;
      for(var i=0;i<fresh.length;i++){
        if(fresh[i]&&fresh[i].kind==='source'&&fresh[i].amount>0){
          if(window.STING)STING.play('paid');
          return;                                   /* one payday is ONE sound */
        }
      }
    }catch(err){}
  }
};
window.PAYSTING=PAYSTING;
"""

OLD_STATE = """  if(d.bohemiaCityState!==undefined){
    CITYSAVE.save(d.bohemiaCityState);
    return true;
  }"""
NEW_STATE = """  if(d.bohemiaCityState!==undefined){
    CITYSAVE.save(d.bohemiaCityState);
    /* AND THE MUSIC HEARS A PAYDAY (8/20). This snapshot already carries the
       purse ledger, so being paid is visible from here without the city world
       having to say anything. See PAYSTING. */
    try{ if(window.PAYSTING)PAYSTING.onState(d.bohemiaCityState); }catch(_e){}
    return true;
  }"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if "paid: { v:'coldpiano'" not in s:
        if OLD_FIG not in s:
            print('FAIL: the STING figure table is not the shape this patch knows')
            return 1
        s = s.replace(OLD_FIG, NEW_FIG, 1)
        changed.append('a PAID figure added to the sting table')

    if 'const PAYSTING=' not in s:
        if ANCHOR not in s:
            print('FAIL: STING is not there to sit beside')
            return 1
        s = s.replace(ANCHOR, ANCHOR + WATCH, 1)
        changed.append('PAYSTING installed beside STING')

    if 'PAYSTING.onState(' not in s:
        if OLD_STATE not in s:
            print('FAIL: the city-state handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_STATE, NEW_STATE, 1)
        changed.append('a payday now reaches the music')

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())

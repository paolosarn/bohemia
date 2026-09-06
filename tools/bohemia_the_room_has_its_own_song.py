#!/usr/bin/env python3
"""
THE ROOM HAS ITS OWN SONG (9/6/26, SOUNDS lane) - [music owned], round 1.

*** MEASURED ON THE REAL SURFACE, ASKING THE GAME'S OWN FUNCTIONS: 82 SONGS
PAOLO THUMBED CANON PLAY NOWHERE IN THIS GAME. ***

The row says this lane owns the MUSIC, not only the sounds, and asks what the
valley's music still needs. So the round started the way THE-OTHER-51 ended:
not by reading a table, but by booting the alpha and asking CITYMUS.candidates()
what it can hand you, phase by phase, then drawing 200 picks from each pool.

    songs in the shelf              128
    the street can ever reach        16   (night 9, day 5, dusk/dawn 2)
    combat can ever reach            15   (the faction-tagged ones)
    the opening can ever reach        6   (MENU)
    ---------------------------------------
    CAN BE HEARD NOWHERE             91
      of those, thumbed CANON        82
      of those, graveyarded           9   (correct: a buried song stays buried)

**82 songs he approved, finished, in the build, silent.** That is not a taste
question and it is not 51-unused-sounds again: those were sounds with no moment.
These are finished songs with no ROOM.

*** AND HIS OWN LAW ALREADY NAMES THE ROOM, AND NOBODY BUILT IT. ***
The OVERWORLD PLAYLIST LAW (Paolo 7/7) is two sentences, and the fleet has only
ever obeyed the first one:

    "the overworld plays ONLY the creepers. Faction/action themes are for
     scenes, dialogue, INTERIORS."

Scenes exist -- that is combat, and it is why 15 songs have a home. Interiors
exist too: the walked city has an INSIDE state, you go through doors, and since
9/5 the city reports `inside` to this shell every four seconds. MEASURED: walk
into a shop and the AMBIENCE BED changes to `air_inside` correctly, and the
music does not move at all --

    on the street   THE WIND LEARNS WORDS
    inside a shop   THE WIND LEARNS WORDS
    back outside    THE WIND LEARNS WORDS

and `typeof INTERIORMUS` is undefined. There are three music players in this
game (street, opening, fight) and the third room in his law has none.

THE POOL IS DEFINED BY ABSENCE, WHICH IS WHY IT CHOOSES NOTHING FOR HIM.
MECHANISM-MINE / CONTENTS-PAOLO'S: I may not sit down and decide that 82 songs
are "interior songs" -- that is tagging, and tagging is his, done in the MUSIC
tab. So the interior pool is not a list. It is a RULE:

    a song with NO category at all is a song nobody has placed yet,
    and a song nobody has placed is heard indoors.

Nothing is typed, nothing is assigned, and the moment he tags one of them in the
MUSIC tab it LEAVES this pool by itself, because having a category is the exact
thing that takes it out. The pool empties as he fills the tab in. A table of 82
names would have to be maintained against his every verdict; a rule cannot go
stale.

GRAVEYARD IS FINAL, enforced here and not assumed: V===0 never enters, so the 9
buried songs stay buried. Weighting is the same one the street and the opening
already use, canon 8x and unjudged 4x, so nothing about how a song is chosen is
new either.

*** BOTH TRANSITIONS WAIT FOR THE PHRASE, AND THAT IS NOT A COPY OF FIGHTMUS. ***
FIGHTMUS is deliberately asymmetric: immediate going in, a phrase coming out,
because danger is now and making a player wait a bar line to learn they are
being shot at is information arriving late. A DOOR IS NOT DANGER. Nothing is
being announced and nothing is urgent, so both directions land on the next
8-bar phrase (128 steps at 120 BPM, 16 seconds), which is the same unit CITYMUS
turns its time-of-day pool on and MENUMUS hands the opening over on.

THE DEBOUNCE IS A SECOND CONDITION, NOT THE SAME ONE, AND MEASURING TAUGHT ME
THAT. Doorways in this city are one tile: you can be in and out of a shop in
three seconds, and an immediate swap would make the music stutter every time
somebody brushes a door -- the 8/4 two-sounds complaint wearing a different hat.
The obvious answer is "the phrase wait IS the debounce, for free", and it is
WRONG, because a song change resets MUS.step to 0 and the wrap has to count as
arrival or the wait hangs forever the first time the shuffle picks a new track.
So a song changing during those three seconds would fire the swap after all.
Wall time cannot be wrapped: the room needs one phrase of DWELL as well as the
phrase boundary. Never sooner than 16 seconds, and always on a phrase.

*** IT TOOK THREE CUTS AND THE PROBE CAUGHT BOTH FAILURES. ***
CUT ONE armed once, on the doorway, and gave up if anything else owned the music
at that instant. Measured: the opening song was still playing, busy() was true,
and forty seconds indoors produced no switch and no second chance, because
arming only ever happened when `inside` CHANGED. BEING INDOORS IS A STATE, NOT
AN EDGE. A player who walks into a shop while the opening is still going, or who
is already inside when a fight ends, would simply never hear the room.
CUT TWO polled, but with TWO timers, one per direction -- and the way out was
dead. where() always installed the going-IN poll, whose first line is "if he is
not inside, stop", so stepping outdoors replaced the going-OUT watcher with one
that instantly cancelled itself. Measured on a real garage door: he walked in and
the room took over at 15.8 seconds, then he walked out and the room played on
forever. TWO TIMERS FOR ONE STATE IS THE BUG, not whichever handler ran.
CUT THREE is one pump, routed by what is true right now, that stops itself the
moment the music already matches where he is standing.

IT NEVER FIGHTS THE OTHER TWO PLAYERS, and that was the whole lesson of the
8/19 FIGHTMUS record (two systems, one clock, neither aware of the other):
  * a fight beats a room. If FIGHTMUS is on, the room waits it out.
  * the opening beats a room. While MENUMUS still owns its phrase, this waits.
    WAITS, not gives up -- see the paragraph above; that distinction is the
    whole difference between this working and this never firing.
  * leaving hands back to CITYMUS.startShuffle(), the one door back to the
    street, exactly the way MENUMUS and FIGHTMUS both hand back.

FAILSAFE, because the streets must never go silent (the reason candidates()
falls back to any-overworld in the first place): an empty pool ARMS NOTHING.
If every song ever gets tagged, this system quietly stops existing and the
street music keeps playing indoors, which is today's behaviour.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new message. It is one player built out of the two that already exist,
fed by the `inside` flag the city has been sending since 9/5.

  python3 tools/bohemia_the_room_has_its_own_song.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_ROOM_HAS_ITS_OWN_SONG__'

PLAYER_ANCHOR = "window.MENUMUS=MENUMUS;"

PLAYER = r"""window.MENUMUS=MENUMUS;
/* ===== INTERIORMUS (9/6/26, SOUNDS lane) -- THE ROOM HAS ITS OWN SONG =====
   __THE_ROOM_HAS_ITS_OWN_SONG__
   MEASURED ON THE REAL SURFACE by asking the game's own functions: of the 128
   songs in this shelf the street can ever reach 16, combat 15, the opening 6,
   and NINETY-ONE CAN BE HEARD NOWHERE. Eighty-two of those he thumbed CANON.
   Finished songs, in the build, silent -- and the ambience bed already knows
   you walked indoors (it swaps to air_inside) while the music does not move.

   HIS OWN LAW ALREADY NAMED THE ROOM. The OVERWORLD PLAYLIST LAW (7/7) says
   the overworld plays only the creepers, and that "faction/action themes are
   for scenes, dialogue, INTERIORS". Scenes were built -- that is combat, and it
   is why 15 songs have a home. The interior never was.

   THE POOL IS A RULE, NOT A LIST, AND THAT IS THE POINT. Tagging is HIS, in the
   MUSIC tab (MECHANISM-MINE / CONTENTS-PAOLO'S), so this cannot contain a list
   of songs I decided are indoor songs. It contains one sentence instead: a song
   with NO category is a song nobody has placed, and a song nobody has placed is
   heard indoors. Tag one in the MUSIC tab and it leaves this pool by itself,
   because having a category is the exact thing that removes it. The pool
   shrinks as he fills the tab in, and a rule cannot go stale the way a table
   of 82 names would.
   GRAVEYARD IS FINAL: V===0 never enters. Weighting is the street's own,
   canon 8x and unjudged 4x, so nothing about how a song is chosen is new.

   BOTH TRANSITIONS WAIT FOR THE PHRASE, AND THAT IS NOT FIGHTMUS COPIED.
   FIGHTMUS is asymmetric on purpose: immediate in, phrase out, because danger
   is now. A DOOR IS NOT DANGER, so both directions land on the next 8-bar
   phrase -- the unit CITYMUS turns its pool on and MENUMUS hands over on.
   AND THE WAIT IS THE DEBOUNCE. A doorway here is one tile and you can be in
   and out in three seconds; swapping instantly would make the music stutter
   every time somebody brushes a door. Waiting a phrase means a quick in-and-out
   never disturbs the music, and only really being indoors changes it. */
const INTERIORMUS={
  on:false, watch:null, armed:null, inside:false,
  PHRASE:128,                              /* 8 bars x 16 steps, 16s at 120 BPM */
  /* A SONG NOBODY HAS PLACED. Not a list -- the absence of a tag IS the test. */
  candidates(){ const out=[];
    for(let mi=0;mi<MLOOPS.length;mi++){ const n=MLOOPS[mi].n;
      if(MUS.V[n+'#1']===0)continue;                      /* graveyard is final */
      const cs=(MUS.cats&&MUS.cats[n+'#1'])||[];
      if(cs.length)continue;                              /* he placed it: not ours */
      if(CITYMUS.OVERWORLD.has(n))continue;               /* the hardcoded creepers */
      out.push({fi:MFACTIONS.length+mi,slot:1}); }
    return out; },
  pick(){ let cs=this.candidates(); if(!cs.length)return null;
    /* no repeat back to back, the 8/7 rule, and only when there IS something
       else -- a one-song pool must not filter itself empty and go silent. */
    if(cs.length>1){ const fresh=cs.filter(c=>!(c.fi===MUS.cur&&c.slot===MUS.curSlot));
      if(fresh.length)cs=fresh; }
    const w=cs.map(c=>{ const f=MLOOPS[c.fi-MFACTIONS.length];
      return MUS.V[f.n+'#1']===2?8:4; });                 /* canon 8x, unjudged 4x */
    let t=w.reduce((a,b)=>a+b,0), r=Math.random()*t;
    for(let i=0;i<cs.length;i++){ r-=w[i]; if(r<=0)return cs[i]; } return cs[0]; },
  /* ANOTHER PLAYER IS ALWAYS ALLOWED TO WIN. A fight beats a room; the opening
     owns its phrase. Neither is interrupted, and neither is fought over. */
  busy(){ try{ if(window.FIGHTMUS&&FIGHTMUS.on)return true; }catch(e){}
          try{ if(window.MENUMUS&&MENUMUS.on)return true; }catch(e){}
          return false; },
  /* THE ONLY DOOR IN. The city's `inside` flag, already arriving every 4s. */
  where(inside){ inside=!!inside;
    if(inside===this.inside)return; this.inside=inside; this.armed=null;
    if(!this.watch) this.watch=setInterval(()=>{ INTERIORMUS.pump(); },250); },
  idle(){ if(this.watch){clearInterval(this.watch); this.watch=null;} this.armed=null; },
  /* ONE POLL AND ONE ROUTER, AND THE SECOND CUT OF THIS IS WHY.
     BEING INDOORS IS A STATE, NOT AN EDGE. The first cut armed once on the
     doorway and gave up if anything else owned the music at that instant --
     measured, the opening was still playing, busy() was true, and forty seconds
     indoors produced no switch and no second chance, because arming only
     happened when `inside` CHANGED. A player who walks into a shop during the
     opening, or who is already inside when a fight ends, would never hear the
     room. So it polls while there is a difference to close.
     THE SECOND CUT THEN HAD TWO POLLS, ONE PER DIRECTION, AND THE WAY OUT WAS
     DEAD: where() always installed the going-IN poll, whose first line is "if
     he is not inside, stop" -- so stepping outdoors replaced the going-OUT
     watcher with one that immediately cancelled itself. Measured on a real
     door: he walked in and the room took over at 15.8s, he walked out and the
     room played on forever. TWO TIMERS FOR ONE STATE IS THE BUG, not the
     handler that ran. One pump, routed by what is true right now, and it stops
     itself the moment the music already matches where he is standing. */
  pump(){
    let s=0; try{ s=MUS.step; }catch(e){}
    if(this.on === this.inside){ this.idle(); return; }   /* already right */
    if(!this.on && this.busy()){ this.armed=null; return; }  /* wait, do not give up */
    if(!this.on && !this.candidates().length){ this.armed=null; return; }
    if(this.armed==null){
      this.armed={from:s, at:(Math.floor(s/this.PHRASE)+1)*this.PHRASE, t:Date.now()};
      return; }
    /* TWO CONDITIONS, AND BOTH ARE LOAD-BEARING.
       THE PHRASE is the musical landing: 128 steps at 120 BPM, the unit CITYMUS
       turns its pool on and MENUMUS hands the opening over on. A song change
       resets step to 0, so a WRAPPED clock counts as arrived -- without that
       guard the wait hangs forever the first time the shuffle picks a new
       track, the same guard FIGHTMUS.leave() carries.
       THE DWELL is the debounce, and it has to be SEPARATE because of that wrap
       rule. A doorway here is one tile and you can be in and out in three
       seconds; if a song happened to change in those three seconds the wrap
       would count as arrival and the music would stutter on a brush past a
       door. Wall time cannot be wrapped, so one phrase of it is a promise the
       step counter cannot break: never sooner than 16 seconds, always on a
       phrase. */
    const musical = (s>=this.armed.at || s<this.armed.from);
    const dwelt = (Date.now()-this.armed.t) >= (this.PHRASE/16)*(60/120)*1000;
    if(!(musical&&dwelt))return;
    this.armed=null;
    if(this.inside) this.takeOver(); else this.handBack();
    /* AND STAND DOWN IN THE SAME TICK. After either move the music matches
       where he is standing, so there is nothing left to poll for. Leaving it to
       the next tick left a timer alive for 250ms after the work was done, which
       is harmless in the game and a LIE TO A CHECKER, which is worse: a gate
       that reads "is a timer running" right after the handback would see one. */
    this.idle(); },
  takeOver(){ const c=this.pick(); if(!c)return;
    this.on=true;
    /* STAND CITYMUS DOWN, DO NOT STOP IT. Stopping would cut the transport the
       player is hearing; the street shuffle just stops reaching in. */
    try{ CITYMUS.on=false; CITYMUS.pend=false; CITYMUS.pendAt=null;
      if(CITYMUS.watch){clearInterval(CITYMUS.watch); CITYMUS.watch=null;} }catch(e){}
    MUS.cur=c.fi; MUS.curSlot=1;
    try{ if(MUS.playing){ MUS.step=0; MUS.uiBar=0; MUS.nextT=MUS.AC.currentTime+0.06; }
         else MUS.start(); }catch(e){}
    this.tellCity(MLOOPS[c.fi-MFACTIONS.length].n); },
  handBack(){ this.on=false;
    try{ CITYMUS.startShuffle(); }catch(e){} },      /* the streets take it back */
  tellCity(now){ const fr=document.getElementById('cityFrame');
    if(fr&&fr.contentWindow)try{fr.contentWindow.postMessage({bohemiaCityMusicState:{on:true,now:now}},'*');}catch(e){} }
};
window.INTERIORMUS=INTERIORMUS;"""

WHERE_ANCHOR = ("        if(d.space && SPACES[d.space]) SPACE=d.space;"
                "   /* the run says where you stand */ musicPhase(d); timePass(d); return; }")

WHERE_REPLACE = (
    "        if(d.space && SPACES[d.space]) SPACE=d.space;"
    "   /* the run says where you stand */ musicPhase(d); timePass(d);\n"
    "        /* __THE_ROOM_HAS_ITS_OWN_SONG__ -- the music learns you went indoors.\n"
    "           The bed has swapped to air_inside on this exact flag since 8/14 and\n"
    "           the music never moved. No new message and no new run code: the fact\n"
    "           was already arriving four times a minute. */\n"
    "        try{ INTERIORMUS.where(d.inside); }catch(_e){}\n"
    "        return; }")


def main():
    print('=== THE ROOM HAS ITS OWN SONG ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor in (('the player site', PLAYER_ANCHOR),
                         ('the WHERE handler', WHERE_ANCHOR)):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)'
                  % (what, src.count(anchor)))
            return 1

    # POSITIVE CONTROL ON THE PREMISE. This wire only makes sense if the two
    # things it stands between are really there: a street shuffle to stand down,
    # and his 7/7 hardcoded creeper set the pool has to exclude.
    if 'const CITYMUS={' not in src or "OVERWORLD:new Set([" not in src:
        print('FAIL: CITYMUS or its OVERWORLD set is not where this expects it, '
              'so the premise of the pool rule is false')
        return 1

    src = src.replace(PLAYER_ANCHOR, PLAYER, 1)
    print('  BUILT  INTERIORMUS -- the third room in his 7/7 law finally has a player')
    src = src.replace(WHERE_ANCHOR, WHERE_REPLACE, 1)
    print('  WIRED  the city\'s `inside` flag now moves the music, not just the bed')

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  82 songs he thumbed CANON could be heard NOWHERE in this game.')
    print('  The pool is a RULE, not a list: a song with no category is a song '
          'nobody placed, and it leaves the pool the moment he tags it in the '
          'MUSIC tab. Nothing was assigned and nothing was chosen for him.')
    return 0


if __name__ == '__main__':
    sys.exit(main())

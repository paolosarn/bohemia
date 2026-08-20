#!/usr/bin/env python3
"""
BOHEMIA — THE GAME HAS A VOICE WHEN YOU OPEN IT (8/19/26, SOUND lane).

REUSE CHECK: cooks nothing. Every note this ships is a song Paolo already wrote
and already approved, played by voices already in his rack. Banks opened: none,
because there is nothing to cook -- the whole point is that 124 finished songs
were sitting in the file unheard. Writing a new song to solve this would have
been the violation.

WHAT WAS ACTUALLY WRONG, and it is worse than the thing on the board.
The board said: "MENU music is a named waiver: 2 canon songs, no player, his
design call." Fifteen days old, printed by music_reach_gate on every run.
Going to wire it turned up the real state of music in this game:

    slices/BOHEMIA_CITY_WORLD.html:27496    let CITYMUS_ON=false;

THE MUSIC SHIPS OFF. You open the link, you tap in, and the game is SILENT --
and stays silent until you find a small button in the city toolbar. One hundred
and twenty-four finished songs, a 602-voice rack, twenty batches of work, and
the default is off. The MENU waiver was a hole in the wall of a house with no
roof.

WHY IT WAS OFF, and why that reason no longer applies: browsers refuse to start
audio without a user gesture, so an autostart on load fails, and can leave the
AudioContext suspended in a way that poisons the first real press. But there IS
a gesture, and it is the most reliable one in the whole product: TAP TO ENTER.
CITYMUS's own comment already says the same thing about iframes calling it
"DIRECTLY inside the tap gesture, keeping the audio-activation stack alive (iOS
law)". Nobody had used the splash tap for it.

WHAT SHIPS
  1. Tapping into the game starts the music. Every song he has approved is
     audible from the first second instead of behind a button.
  2. IT OPENS ON A MENU SONG. That is what the MENU category was always for, and
     with no menu screen to sit on, the honest home for it is the way in: one
     phrase of the front-door theme, then the streets take over on the phrase
     boundary. Sixteen seconds, quantised, per the 120 BPM LAW -- an opening
     sting, not a whole song you have to sit through.
  3. It hands over to the overworld shuffle cleanly and never fights it, and the
     city's own MUSIC button shows ON so the UI is not lying about the state.
  4. If the MENU pool is ever empty, it goes straight to the streets. The game
     is never silent because a category is.

WHAT IT DOES NOT DECIDE: which songs those are. The pool is whatever is tagged
MENU and not buried, weighted by his verdicts exactly the way CITYMUS weights
the overworld (canon 8x, unjudged 4x, buried never). MECHANISM-MINE,
CONTENTS-PAOLO'S.

Idempotent: keyed on `const MENUMUS=`, safe to run any number of times.

  python3 tools/bohemia_menu_music_patch.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = "window.CITYMUS=CITYMUS;"

PLAYER = r"""
/* ===== MENUMUS (8/19/26) -- THE GAME HAS A VOICE WHEN YOU OPEN IT ==========
   The music used to ship OFF (`let CITYMUS_ON=false` in the city world), so the
   game opened silent and stayed silent until you found a button. 124 finished
   songs behind a toggle. This is the other half of the tap that enters the
   game: the gesture that opens the door also turns the sound on, which is the
   one moment a browser will let audio start.
   IT OPENS ON A MENU SONG because that is what the MENU category has always
   been for. There is no menu SCREEN to sit on -- the splash is one tap -- so
   the honest home for those songs is the WAY IN: one phrase of the front-door
   theme, then the streets take it on the phrase boundary. 8 bars at 120 BPM is
   16 seconds, the same unit CITYMUS already turns the time-of-day pool on, so
   the hand-off lands where the music expects it instead of cutting.
   It chooses nothing for him: same verdict weighting as the overworld shuffle,
   canon 8x, unjudged 4x, and a buried song never plays at all. */
const MENUMUS={on:false,watch:null,
  HANDOFF_STEPS:128,                       /* 8 bars x 16 steps = one phrase */
  candidates(){ const out=[];
    for(let mi=0;mi<MLOOPS.length;mi++){ const n=MLOOPS[mi].n;
      const cs=(MUS.cats&&MUS.cats[n+'#1'])||[];
      if(cs.indexOf('MENU')<0&&!MLOOPS[mi].menu)continue;
      /* GRAVEYARD IS FINAL: 0 is buried and a buried song does not get a turn.
         The overworld shuffle weights a 0 at 1x, which is how a song Paolo
         killed on 7/8 stayed in the streets for six weeks. Not here. */
      if(MUS.V[n+'#1']===0)continue;
      out.push({fi:MFACTIONS.length+mi,slot:1}); }
    return out; },
  pick(){ const cs=this.candidates(); if(!cs.length)return null;
    const w=cs.map(c=>{ const f=MLOOPS[c.fi-MFACTIONS.length];
      return MUS.V[f.n+'#1']===2?8:4; });     /* canon 8x, unjudged 4x */
    let t=w.reduce((a,b)=>a+b,0), r=Math.random()*t;
    for(let i=0;i<cs.length;i++){ r-=w[i]; if(r<=0)return cs[i]; } return cs[0]; },
  /* CALL THIS INSIDE THE TAP. Not after a timeout, not on load: the whole
     mechanism is that a user gesture is on the stack. */
  open(){ if(this.on)return;
    try{MUS.build();}catch(e){}
    const c=this.pick();
    if(!c){ try{CITYMUS.startShuffle();}catch(e){} return; }   /* never silent because a pool is empty */
    this.on=true;
    MUS.cur=c.fi; MUS.curSlot=1;
    try{ MUS.start(); }catch(e){ this.on=false; try{CITYMUS.startShuffle();}catch(_e){} return; }
    this.tellCity(true, MLOOPS[c.fi-MFACTIONS.length].n);
    if(this.watch)clearInterval(this.watch);
    this.watch=setInterval(()=>{ if(!MENUMUS.on)return;
      /* if anything else stopped the transport -- a tab switch, the studio, the
         off button -- the opening is over and it does not get to restart. */
      if(!MUS.playing){ MENUMUS.on=false; clearInterval(MENUMUS.watch); MENUMUS.watch=null; return; }
      if(MUS.step>=MENUMUS.HANDOFF_STEPS) MENUMUS.handOff(); },300); },
  handOff(){ if(!this.on)return; this.on=false;
    if(this.watch)clearInterval(this.watch); this.watch=null;
    try{ CITYMUS.startShuffle(); }catch(e){} },   /* the streets take it */
  stop(){ this.on=false; if(this.watch)clearInterval(this.watch); this.watch=null;
    try{MUS.stop();}catch(e){} this.tellCity(false,null); },
  tellCity(on,now){ const fr=document.getElementById('cityFrame');
    if(fr&&fr.contentWindow)try{fr.contentWindow.postMessage({bohemiaCityMusicState:{on:on,now:now}},'*');}catch(e){} }
};
window.MENUMUS=MENUMUS;
"""

# the opening starts AFTER the run tab is clicked, on purpose: that click runs
# the tab handler, which calls MUS.stop() on the way out of the studio. Starting
# first and clicking second would have the game silence its own opening.
# THE OPENING OWNS ITS SIXTEEN SECONDS. warmTheFight builds the combat iframe
# ~600 ms after the tap, and that iframe picks a faction for its encounter
# ROTATION and posts it up -- whereupon the alpha sets MUS.cur to it. No fight is
# happening; it is a warm-up reporting a default. Measured on the real surface:
# the opening started on MENU -- DEAD VALLEY DAWN and was playing REMNANTS
# fourteen seconds later. That bug is not mine and not new -- it would hijack the
# street shuffle exactly the same way -- but the fix is scoped as tightly as the
# evidence: for the length of the opening ONLY, a warm-up's pick does not get to
# move the transport. A real fight comes through startEncounter, later, and is
# untouched.
OLD_PICK = """      MUS.cur=ev.data.bohemiaFactionPicked; MUS.userPicked=true; MUS._audit=false;"""
NEW_PICK = """      /* NOT DURING THE OPENING (8/19). See MENUMUS: the combat iframe is WARMED
         seconds after entry and reports a faction from its rotation with no
         fight in progress, which used to reassign whatever was playing. */
      if(window.MENUMUS&&MENUMUS.on)return;
      MUS.cur=ev.data.bohemiaFactionPicked; MUS.userPicked=true; MUS._audit=false;"""

OLD_TAP = """  else { runTab.click(); window.__OPENED_ON_THE_GAME=(window.__OPENED_ON_THE_GAME||0)+1; }
});"""
NEW_TAP = """  else { runTab.click(); window.__OPENED_ON_THE_GAME=(window.__OPENED_ON_THE_GAME||0)+1; }
  /* AND THE MUSIC COMES ON (8/19). This tap is the only gesture guaranteed to
     exist before anything else happens, which is exactly what a browser wants
     before it will let audio start -- so it is where the sound turns on. AFTER
     runTab.click(), because that click runs the tab handler and the tab handler
     calls MUS.stop() on the way out of the studio: starting first would have
     the game silence its own opening one line later. */
  try{ if(window.MENUMUS)MENUMUS.open(); }catch(_e){}
});"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if 'const MENUMUS=' not in s:
        if ANCHOR not in s:
            print('FAIL: could not find CITYMUS to sit beside')
            return 1
        s = s.replace(ANCHOR, ANCHOR + PLAYER, 1)
        changed.append('MENUMUS player installed beside CITYMUS')

    if 'if(window.MENUMUS)MENUMUS.open();' not in s:
        if OLD_TAP not in s:
            print('FAIL: the splash tap handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_TAP, NEW_TAP, 1)
        changed.append('the splash tap now turns the music on')

    if 'if(window.MENUMUS&&MENUMUS.on)return;' not in s:
        if OLD_PICK not in s:
            print('FAIL: the faction-pick handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_PICK, NEW_PICK, 1)
        changed.append('a combat warm-up can no longer hijack the opening')

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
"""
BOHEMIA — THE MUSIC KNOWS WHEN YOU ARE IN A FIGHT (8/19/26, SOUND lane).

REUSE CHECK: cooks nothing, draws nothing, writes no note. Every song involved
is one Paolo already wrote and already ruled on. Banks opened: none needed --
the defect is that the songs he has are played by two systems that cannot see
each other. This is wiring, not content.

MEASURED, NOT READ. Drove the real alpha, tapped in, let the opening hand over
to the streets, then called startColdOpen -- which is THE COLD OPEN, the first
fight in the game, the one the demo opens on:

    BEFORE THE FIGHT   city:true   playing THE WIND LEARNS WORDS
    IN THE FIGHT       city:true   playing HOMELESS
    AFTER 64 BARS      city:true   playing TWO COINS FOR THE FERRYMAN   <-- !!

TWO BUGS, BOTH ON THE DEMO PATH.

(1) NOBODY OWNS THE MUSIC DURING A FIGHT. CITYMUS.on stays TRUE and its watchdog
    keeps running while combat drives the same transport, so at the end of a
    64-bar pass -- 128 seconds, which any real fight outlasts -- the STREET
    SHUFFLE picks an overworld song and takes the music back MID-FIGHT. Measured
    above: the player is in a firefight and the score cuts to a calm dusk track.
    Two systems, one transport, neither aware of the other.

(2) THE FIGHT MUSIC CAN BE THE SCRATCH PATCH. Combat's pickRandomFaction does
    Math.floor(Math.random()*FACTIONS.length) -- uniform, no weighting -- and
    FACTIONS[0] is CUSTOM: the music studio's blank sandbox slot, motif 'plain',
    inst {b:'osc', l:'pluck'}. It is not a song anybody wrote. One fight in
    fourteen is scored by it, and the first probe run above drew exactly that.
    It is also unweighted by his verdicts, unlike the street shuffle, which
    weights canon 8x.

WHAT THE RESEARCH SAYS, and it is not what I would have guessed. Practitioner
consensus on adaptive scoring (vertical remixing / horizontal re-sequencing) is
that the transitions are ASYMMETRIC:
  * INTO combat: IMMEDIATE. Danger is now; making the player wait for a bar line
    to learn they are being shot at is information arriving late.
  * OUT OF combat: at a musical END -- a phrase boundary -- because leaving is
    not an emergency and a hard cut back to calm is the thing that reads cheap.
  * NEVER REDUNDANT-SWITCH. Back-to-back encounters must not machine-gun the
    score, so the return is held behind a cooldown.
Bohemia already has the machinery for all of it: everything quantises to 120 BPM
(BEAT 0.5s, 16 steps a bar) and CITYMUS already turns its time-of-day pool on an
8-bar phrase for exactly this reason. So none of this is imported; it is the
engine's own unit applied to a transition nobody had written yet.
  https://www.thegameaudioco.com/making-your-game-s-music-more-dynamic-vertical-layering-vs-horizontal-resequencing
  https://splice.com/blog/interactive-music-system-video-games/
  https://www.gamejournal.it/killing-off-the-crossfade-achieving-seamless-transitions-with-imbricate-audio/

WHAT SHIPS
  FIGHTMUS.enter()  the streets STAND DOWN, immediately, and the fight owns the
                    transport. Nothing is stopped and nothing restarts -- combat
                    swaps the song in place on the running clock, which is
                    already correct; the only change is that the shuffle can no
                    longer reach in and take it back.
  FIGHTMUS.leave()  the streets come back AT THE NEXT 8-BAR PHRASE, never on the
                    frame the last hostile drops, and never inside the cooldown.
  and the fight never draws CUSTOM, and picks with his verdict weighting.

WHAT IT DOES NOT DECIDE: which song plays a fight. That is his faction canon and
his thumbs, untouched -- the only name removed from the draw is the studio's
empty scratch slot, which is not a song and was never a verdict.

Idempotent: keyed on `const FIGHTMUS=`.

  python3 tools/bohemia_fight_music_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = "window.MENUMUS=MENUMUS;"

PLAYER = r"""
/* ===== FIGHTMUS (8/19/26) -- THE MUSIC KNOWS WHEN YOU ARE IN A FIGHT ======
   MEASURED on the real alpha before this existed: tap in, let the opening hand
   over to the streets, call startColdOpen -- the first fight in the game --
   and 64 bars later the STREET SHUFFLE takes the music back mid-fight, because
   CITYMUS.on was still true and its watchdog was still running while combat
   drove the same transport. Two systems, one clock, neither aware of the other.
   THE TRANSITIONS ARE ASYMMETRIC ON PURPOSE, which is the practitioner
   consensus and not what I would have guessed: IMMEDIATE going in, because
   danger is now and making the player wait for a bar line to learn they are
   being shot at is information arriving late; a PHRASE END coming out, because
   leaving a fight is not an emergency and a hard cut back to calm reads cheap.
   8 bars is the unit CITYMUS already turns its time-of-day pool on, so this is
   the engine's own quantisation applied to a transition nobody had written.
   NOTHING IS STOPPED AND NOTHING RESTARTS. Combat swaps the song in place on
   the running clock and that was always right; the only thing that changes is
   that the shuffle can no longer reach in and take it back. */
const FIGHTMUS={
  on:false, watch:null, cameBack:0, cityWas:false,
  PHRASE:128,                              /* 8 bars x 16 steps */
  COOLDOWN:6000,                           /* no redundant switch between fights */
  enter(){
    /* the opening is over the moment a fight starts, and it does NOT get to
       hand off to the streets on its way out -- that hand-off is what would
       start the shuffle underneath the fight. */
    try{ if(window.MENUMUS&&MENUMUS.on){ MENUMUS.on=false;
      if(MENUMUS.watch){clearInterval(MENUMUS.watch); MENUMUS.watch=null;} } }catch(e){}
    if(this.on)return;
    this.on=true;
    if(this.watch){clearInterval(this.watch); this.watch=null;}
    try{
      this.cityWas=!!CITYMUS.on;
      /* STAND DOWN, do not STOP. Silencing here would cut the music the player
         is already hearing at the exact instant the fight starts, which is a
         worse artefact than the bug being fixed. */
      CITYMUS.on=false; CITYMUS.pend=false; CITYMUS.pendAt=null;
      if(CITYMUS.watch){clearInterval(CITYMUS.watch); CITYMUS.watch=null;}
    }catch(e){}
  },
  leave(){
    if(!this.on)return;
    this.on=false;
    if(!this.cityWas)return;               /* the streets were not playing; nothing to give back */
    const now=Date.now();
    if(now<this.cameBack+this.COOLDOWN)return;   /* two fights in a row is ONE musical event */
    if(this.watch){clearInterval(this.watch); this.watch=null;}
    /* AT THE NEXT PHRASE, not on the frame the last hostile drops. */
    const from=(typeof MUS!=='undefined')?MUS.step:0;
    const at=(Math.floor(from/this.PHRASE)+1)*this.PHRASE;
    this.watch=setInterval(()=>{
      if(FIGHTMUS.on){ clearInterval(FIGHTMUS.watch); FIGHTMUS.watch=null; return; }
      let s=0; try{ s=MUS.step; }catch(e){}
      /* a song change resets step to 0, so a wrapped clock counts as arrived */
      if(s>=at||s<from){
        clearInterval(FIGHTMUS.watch); FIGHTMUS.watch=null;
        FIGHTMUS.cameBack=Date.now();
        try{ CITYMUS.startShuffle(); }catch(e){}
      } },250);
  },
  /* NOT THE SCRATCH PATCH (8/19). Combat's pickRandomFaction draws uniformly
     across FACTIONS and FACTIONS[0] is CUSTOM -- the studio's blank sandbox
     slot, motif 'plain', osc and pluck. It is not a song anybody wrote, and one
     fight in fourteen was being scored by it. Redrawn here rather than in the
     combat module because combat uses that index for its PALETTE as well, and
     the palette is not this lane's to move.
     THE REDRAW CHOOSES NOTHING FOR HIM: same weighting as the street shuffle,
     canon 8x, unjudged 4x, a song he buried never. */
  realFaction(i){
    try{
      if(i!==0||typeof MFACTIONS==='undefined')return i;
      const cs=[];
      for(let k=1;k<MFACTIONS.length;k++){
        const v=MUS.V[MFACTIONS[k].n+'#1'];
        if(v===0)continue;
        cs.push([k, v===2?8:4]);
      }
      if(!cs.length)return i;
      let t=0; for(const c of cs)t+=c[1];
      let r=Math.random()*t;
      for(const c of cs){ r-=c[1]; if(r<=0)return c[0]; }
      return cs[0][0];
    }catch(e){ return i; }
  }
};
window.FIGHTMUS=FIGHTMUS;
"""

OLD_PICK = """      if(window.MENUMUS&&MENUMUS.on)return;
      MUS.cur=ev.data.bohemiaFactionPicked; MUS.userPicked=true; MUS._audit=false;"""
NEW_PICK = """      if(window.MENUMUS&&MENUMUS.on)return;
      /* NEVER THE SCRATCH PATCH (8/19). See FIGHTMUS.realFaction. */
      MUS.cur=(window.FIGHTMUS?FIGHTMUS.realFaction(ev.data.bohemiaFactionPicked)
                              :ev.data.bohemiaFactionPicked);
      MUS.userPicked=true; MUS._audit=false;"""

OLD_START = """  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,"""
NEW_START = """  /* THE STREETS STAND DOWN (8/19). Immediate, because danger is now. See
     FIGHTMUS: without this the overworld shuffle takes the music back 64 bars
     into any fight, measured on the cold open. */
  try{ if(window.FIGHTMUS)FIGHTMUS.enter(); }catch(_e){}
  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,"""

OLD_END = """      G.lastEncounter=enc.outcome;
      if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}"""
NEW_END = """      G.lastEncounter=enc.outcome;
      /* AND THE STREETS COME BACK, at the next 8-bar phrase and never inside
         the cooldown, so two fights in a row stay ONE musical event. */
      try{ if(window.FIGHTMUS)FIGHTMUS.leave(); }catch(_e){}
      if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if 'const FIGHTMUS=' not in s:
        if ANCHOR not in s:
            print('FAIL: MENUMUS is not there to sit beside')
            return 1
        s = s.replace(ANCHOR, ANCHOR + PLAYER, 1)
        changed.append('FIGHTMUS installed beside MENUMUS')

    if 'FIGHTMUS.realFaction(' not in s:
        if OLD_PICK not in s:
            print('FAIL: the faction-pick handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_PICK, NEW_PICK, 1)
        changed.append('a fight can no longer be scored by the scratch patch')

    if 'FIGHTMUS.enter()' not in s:
        if OLD_START not in s:
            print('FAIL: startEncounter is not the shape this patch knows')
            return 1
        s = s.replace(OLD_START, NEW_START, 1)
        changed.append('the streets stand down when a fight starts')

    if 'FIGHTMUS.leave()' not in s:
        if OLD_END not in s:
            print('FAIL: the combat-end handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_END, NEW_END, 1)
        changed.append('the streets come back on a phrase boundary when it ends')

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())

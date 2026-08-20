#!/usr/bin/env python3
"""
BOHEMIA — THE FIGHT INTENSIFIES AS YOU KILL (8/20/26, SOUND lane).

REUSE CHECK: cooks NOTHING. No voice, no song, no note. Every part this makes
audible was written on 7/3/26 and has been sitting in the file unplayed for
seven weeks. Banks opened: none, because the thing being reused is not a bank,
it is an entire finished SYSTEM. Writing a new intensity layer would have been
the violation twice over -- once for cooking, once for cooking a second copy of
something that already exists.

WHAT WAS ALREADY THERE, AND WHAT NOBODY WAS CALLING.
MUS.playStep reads `const sk=this.layers;` and then gates a whole second and
third tier of arrangement behind `sk>=2` and `sk>=4`. Every faction intensifies
in its OWN way, chosen by f.klay -- drive, stabs, melody, drums, bassrise -- and
the comment above it names the ruling it was built for:

    KILL-LAYER STYLES (Paolo 7/3/26: "the progression of four kills all
    sound like the same progression")

The MUSIC tab even carries the control, labelled in his own terms:

    KILL LAYERS:   [CALM]  [2 KILLS]  [4 KILLS]

THAT BUTTON IS THE ONLY WRITER OF MUS.layers IN THE ENTIRE ALPHA. Grepped it:
one assignment, at the click handler, and nothing else anywhere. So the game has
never once set it. MUS.layers is 0 for the whole of every fight that has ever
been played, and every fight is the base arrangement, flat, from first shot to
last. A five-style intensity system, built to his own ruling, labelled with his
own words, with no caller. Tenth time this fleet has found that exact shape.

WHAT SHIPS. The fight drives the layers, off the signal combat already sends:
BOHEMIA_SHOT_RESULT carries outcome:'killshot'. Zero kills is CALM, two kills
lifts to layer 2, four lifts to layer 4, exactly the thresholds his own button
offers. It resets to CALM when the encounter starts and again when it settles.

AND IT LANDS ON THE BAR LINE. A layer that appears halfway through a bar does
not read as the music intensifying, it reads as a mistake -- the practitioner
literature on vertical remixing is consistent that parts enter on a musical
boundary, and this engine quantises everything to 120 BPM already. The lift is
held and applied at the top of the next bar, which is at most two seconds and
usually less. Same pend/apply shape CITYMUS already uses for its time-of-day
turn, so it is the codebase's own idiom rather than a new one.
  https://www.thegameaudioco.com/making-your-game-s-music-more-dynamic-vertical-layering-vs-horizontal-resequencing
  https://splice.com/blog/interactive-music-system-video-games/

WHAT IT DOES NOT DECIDE: what the layers SOUND like. That is his 7/3 arrangement
work, untouched, and the thresholds are the ones printed on his own button.
MECHANISM-MINE / CONTENTS-PAOLO'S.

Idempotent: keyed on `const KILLMUS=`.

  python3 tools/bohemia_kill_layers_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = "window.STING=STING;"

PLAYER = r"""
/* ===== KILLMUS (8/20/26) -- THE FIGHT INTENSIFIES AS YOU KILL ============
   MUS.playStep has gated a second and third tier of arrangement behind
   `sk>=2` and `sk>=4` since 7/3, with a different intensification style per
   faction (drive / stabs / melody / drums / bassrise), built for Paolo's own
   ruling: "the progression of four kills all sound like the same progression".
   The MUSIC tab even carries the control, labelled KILL LAYERS: CALM / 2 KILLS
   / 4 KILLS.
   THAT BUTTON WAS THE ONLY WRITER OF MUS.layers IN THE WHOLE ALPHA. The game
   never set it, so every fight ever played ran at the base arrangement, flat,
   first shot to last. This is the caller.

   IT LANDS ON THE BAR LINE. A part that appears halfway through a bar does not
   read as the music intensifying, it reads as a mistake. The lift is held and
   applied at the top of the next bar -- at most two seconds at 120 BPM, and
   the same pend/apply shape CITYMUS already uses for its time-of-day turn. */
const KILLMUS={
  kills:0, want:0, watch:null,
  /* his own button's thresholds, in his own words */
  TIERS:[[4,4],[2,2],[0,0]],
  tierFor(k){ for(var i=0;i<this.TIERS.length;i++) if(k>=this.TIERS[i][0])return this.TIERS[i][1]; return 0; },
  reset(){ this.kills=0; this.want=0;
    if(this.watch){clearInterval(this.watch); this.watch=null;}
    try{ MUS.layers=0; }catch(e){} },
  killed(){
    this.kills++;
    var w=this.tierFor(this.kills);
    if(w===this.want)return;                       /* already heading there */
    this.want=w;
    this.arm();
  },
  arm(){
    if(this.watch)return;
    this.watch=setInterval(()=>{
      var m; try{ m=MUS; }catch(e){ return; }
      if(!m){ return; }
      if(m.layers===KILLMUS.want){
        clearInterval(KILLMUS.watch); KILLMUS.watch=null; return; }
      /* THE TOP OF A BAR. 16 steps to a bar; if the transport is not running
         there is no bar to wait for, so it takes effect immediately. */
      if(!m.playing || (m.step%16)===0){
        m.layers=KILLMUS.want;
        clearInterval(KILLMUS.watch); KILLMUS.watch=null;
      } },60);
  }
};
window.KILLMUS=KILLMUS;
"""

OLD_SHOT = """  if(d.type==='BOHEMIA_SHOT_RESULT'){
    if(!CSHOT)CSHOT=CBRIDGE.beginShot({shooter:'player',target:d.patMeta&&d.patMeta.target,weapon:d.patMeta&&d.patMeta.weapon,packageId:d.patMeta&&d.patMeta.pkg});"""
NEW_SHOT = """  if(d.type==='BOHEMIA_SHOT_RESULT'){
    /* THE MUSIC HEARS IT (8/20). A killshot lifts the arrangement at the top of
       the next bar. See KILLMUS: the layers have existed since 7/3 and nothing
       in the game had ever set them. */
    try{ if(d.outcome==='killshot'&&window.KILLMUS)KILLMUS.killed(); }catch(_e){}
    if(!CSHOT)CSHOT=CBRIDGE.beginShot({shooter:'player',target:d.patMeta&&d.patMeta.target,weapon:d.patMeta&&d.patMeta.weapon,packageId:d.patMeta&&d.patMeta.pkg});"""

OLD_START = """  /* THE STREETS STAND DOWN (8/19). Immediate, because danger is now. See
     FIGHTMUS: without this the overworld shuffle takes the music back 64 bars
     into any fight, measured on the cold open. */
  try{ if(window.FIGHTMUS)FIGHTMUS.enter(); }catch(_e){}"""
NEW_START = """  /* THE STREETS STAND DOWN (8/19). Immediate, because danger is now. See
     FIGHTMUS: without this the overworld shuffle takes the music back 64 bars
     into any fight, measured on the cold open. */
  try{ if(window.FIGHTMUS)FIGHTMUS.enter(); }catch(_e){}
  /* and every fight starts CALM, whatever the last one ended on */
  try{ if(window.KILLMUS)KILLMUS.reset(); }catch(_e){}"""

OLD_END = """      /* AND IT SOUNDS LIKE SOMETHING (8/19). The two biggest moments the demo
         has had nothing musical on them at all. In the key of whatever is
         playing, on the next beat. See STING. */
      try{ if(window.STING)STING.play(enc.victory?'win':'loss'); }catch(_e){}"""
NEW_END = """      /* AND IT SOUNDS LIKE SOMETHING (8/19). The two biggest moments the demo
         has had nothing musical on them at all. In the key of whatever is
         playing, on the next beat. See STING. */
      try{ if(window.STING)STING.play(enc.victory?'win':'loss'); }catch(_e){}
      /* the fight is over, so the arrangement comes back down */
      try{ if(window.KILLMUS)KILLMUS.reset(); }catch(_e){}"""


def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    if 'const KILLMUS=' not in s:
        if ANCHOR not in s:
            print('FAIL: STING is not there to sit beside')
            return 1
        s = s.replace(ANCHOR, ANCHOR + PLAYER, 1)
        changed.append('KILLMUS installed beside STING')

    if 'KILLMUS.killed()' not in s:
        if OLD_SHOT not in s:
            print('FAIL: the shot-result handler is not the shape this patch knows')
            return 1
        s = s.replace(OLD_SHOT, NEW_SHOT, 1)
        changed.append('a killshot now lifts the arrangement')

    if 'KILLMUS.reset()' not in s:
        if OLD_START not in s or OLD_END not in s:
            print('FAIL: the encounter start/end hooks are not the shape this patch knows')
            return 1
        s = s.replace(OLD_START, NEW_START, 1)
        s = s.replace(OLD_END, NEW_END, 1)
        changed.append('every fight starts and finishes CALM')

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())

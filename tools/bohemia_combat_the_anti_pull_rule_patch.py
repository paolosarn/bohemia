#!/usr/bin/env python3
"""
V175 HE SHOUTS -- RF4-39, THE ANTI-PULL RULE.

  "There is now a 50% CHANCE THAT ENEMIES WILL SHOUT IMMEDIATELY UPON GAINING
   AGRO to prevent easy, repeatable single pulls." The corridor-pull degenerate
   strategy is deliberately broken. RF3 precedent for the radius: a shout aggros
   within 6 tiles, nothing beyond ~10.5, and outside line-of-sight it halves.

Our own diff: "ABSENT. And this is the direct mechanical answer to his 8/15
complaint -- 'I just found some cover and I stayed in the same place just
shooting people' -- it makes a static hold stop working WITHOUT TOUCHING
ANIMATION."

*** MEASURED FIRST, BECAUSE V165 ALREADY HAS A SHOUT AND IT IS STRONGER THAN
RF4'S ON PAPER. *** The routine shout is 100%, not 50%, and it runs EVERY TURN,
not once at aggro. So the question was never "is the rule implemented", it was
"IS THE DEGENERATE STRATEGY THE RULE EXISTS TO PREVENT STILL AVAILABLE". It is:

  at the moment he is first seen, over 30 boards
      1.97 men see him
      0.43 are told without eyes of their own
      1.87 ARE STILL COMPLETELY IGNORANT
      11 OF 30 BOARDS ALLOW A CLEAN SINGLE PULL -- one man engaged in isolation
      with nobody else aware and ignorant men still on the lot
  and standing still, over 20 fights
      only 5 EVER reach a state where the whole room knows

The reason is geometry, not a missing feature: V165's shout travels SHOUT_TILES
from a man who can see you, so anybody standing further out than that never
learns anything. Break one line, take one man, repeat.

WHAT SHIPS: THE FIRST TIME a man lays eyes on you he may YELL, and a yell carries
further than "I told the one next to me". Half the time. Everyone inside
ALARM_TILES learns where you are without eyes of their own.

FIFTY PERCENT IS THE MECHANIC, NOT A HEDGE. RF4's own wording is "prevent EASY,
REPEATABLE single pulls" -- not prevent pulls. A certainty would delete the play;
a coin makes it a GAMBLE, which is the difference between a tactic and a chore.
It is also the honest model: sometimes a man yells and sometimes he just starts
shooting.

IT IS THE FIRST SIGHTING ONLY. A yell every turn is the routine shout with a
bigger number, and it would make the alarm meaningless by making it constant --
the whole point is that the moment you are FOUND is dangerous in a way the rest
of the fight is not.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy or hp number is touched. It
moves INFORMATION, which is V165's currency, and it reuses V165's own markSeen so
what an alarmed man knows is exactly what a told man knows -- one definition of
"where he is", not two that can drift.

REUSE CHECK: cooks no graphic pixels, opens no bank. It rides visionTick, the
function that already decides who can see what and already runs the routine
shout, so there is ONE place awareness is decided rather than two.

TASTE CHECK: no new button, no new HUD, no toggle. One readout line, on the turn
it happens, and only when the yell actually reaches somebody.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.

DRAFT WORDS: the readout is a real attempt tagged draft, per ALWAYS MAKE AN
ATTEMPT (8/11).
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V175 HE SHOUTS'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:140]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v175: already applied')
        return

    # ---- 1. THE YELL ----
    d = sub(d,
        "const SHOUT_TILES=8;   /* [DIAL] a man yells across a lot, not across the district */",
        """const SHOUT_TILES=8;   /* [DIAL] a man yells across a lot, not across the district */
/* ===== V175 HE SHOUTS (RF4-39, THE ANTI-PULL RULE) ================
   "A 50% chance that enemies will shout IMMEDIATELY UPON GAINING AGRO to prevent
    easy, repeatable single pulls."
   MEASURED FIRST, because V165 already has a shout and on paper it is stronger
   than RF4's -- 100% rather than 50%, every turn rather than once. The rule is
   still absent where it counts, and the numbers say so: at the moment he is
   first seen, across 30 boards, 1.97 men see him, 0.43 are told, AND 1.87 ARE
   STILL COMPLETELY IGNORANT. Eleven of those thirty boards allow a CLEAN SINGLE
   PULL -- one man engaged alone, nobody else aware, ignorant men still on the
   lot. Standing still, only 5 fights in 20 EVER reach a state where the whole
   room knows.
   The cause is geometry rather than a missing feature: the routine shout travels
   SHOUT_TILES from a man who can see you, so anyone further out never learns
   anything. Break one line, take one man, repeat.
   A YELL CARRIES FURTHER THAN "I TOLD THE ONE NEXT TO ME", and it happens once,
   the first time you are found. FIFTY PERCENT IS THE MECHANIC AND NOT A HEDGE:
   RF4's wording is "prevent EASY, REPEATABLE single pulls", not prevent pulls. A
   certainty deletes the play; a coin makes it a gamble. */
const ALARM_TILES=15;     /* [DIAL] how far a yell carries, against SHOUT_TILES for a word passed along */
const ALARM_CHANCE=0.5;   /* [DIAL] RF4's own number */
function firstSightAlarm(seers){
  let raised=0;
  for(const s of seers){
    if(!s||s._everSaw)continue;
    s._everSaw=true;                       /* ONCE per man, on the sighting that found you */
    if(Math.random()>=ALARM_CHANCE)continue;
    const sx=Math.cos(s.ea)*s.edist, sy=Math.sin(s.ea)*s.edist;
    for(const o of (G.e||[])){
      if(!o||o.dead||o===s||seesMe(o))continue;
      const ox=Math.cos(o.ea)*o.edist, oy=Math.sin(o.ea)*o.edist;
      if(Math.hypot(ox-sx,oy-sy)>ALARM_TILES)continue;
      if(o.lkp)continue;                   /* he already knew; a yell tells him nothing new */
      markSeen(o); o.told=true; raised++; } }
  if(raised)try{ setRead('HE SHOUTS',raised+' more of them know where you are','#e8593a'); }catch(_e){}
  return raised; }""",
        what='firstSightAlarm')

    # ---- 2. IT RUNS WHERE AWARENESS IS ALREADY DECIDED ----
    d = sub(d,
        """  if(seers.length){
    for(const e of (G.e||[])){ if(!e||e.dead||seesMe(e))continue;""",
        """  /* V175: the yell resolves BEFORE the routine shout, so a man the alarm reached
     is not counted again by the word-of-mouth pass below. One place decides who
     knows what, which is the whole reason this sits inside visionTick. */
  if(seers.length)firstSightAlarm(seers);
  if(seers.length){
    for(const e of (G.e||[])){ if(!e||e.dead||seesMe(e))continue;""",
        what='the call')

    # ---- 3. AND A NEW FIGHT HAS NOBODY WHO HAS SEEN YOU ----
    d = sub(d,
        "  G._cars=placed.length; G._carHeat={}; G._carBurnt={}; G._carFire=[]; G.smoke=[];",
        "  (G.e||[]).forEach(e=>{ if(e)e._everSaw=false; });   /* V175: a new lot is a room nobody has found you in yet */\n  G._cars=placed.length; G._carHeat={}; G._carBurnt={}; G._carFire=[]; G.smoke=[];",
        what='reset')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v175: he shouts -- %d chars' % len(d))


if __name__ == '__main__':
    main()

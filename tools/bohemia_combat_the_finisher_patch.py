#!/usr/bin/env python3
"""
V176 THE FINISHER -- RF4-12, RANDOM PROCS BECOME CHARGE-UP ABILITIES.

  "Charge up a more impactful ability after say 10 attacks, WHICH TAKES SOMETHING
   UNCONTROLLABLE AND GIVES IT TO THE PLAYER TO USE TACTICALLY."

Our own diff: "THE MOST TRANSFERABLE IDEA IN THIS FILE: it converts luck into
agency, and it costs no new UI -- a counter and a ready state."

*** WHICH UNCONTROLLABLE THING? THE BIGGEST ONE IN THE FIGHT. *** V32's
weapon-gated lethality: you dial a PERFECT killshot, the game says you hit him
exactly where you aimed, and then a coin decides whether he dies or lies there at
1hp. With a pistol that coin comes up "he is still alive" EIGHTY PERCENT OF THE
TIME (WEAPON_LETHAL: pistol 0.20, smg 0.35, rifle 0.55, shotgun 1.0). And since
V173 there is a medic on the lot whose whole job is standing those bodies back
up. So the most skilful thing the player can do -- a perfect dial -- is also the
thing luck most often takes away from him.

WHAT SHIPS: every shot that CONNECTS fills a counter. At FINISH_AT the next
killshot you land SKIPS THE LETHALITY ROLL. Nothing else changes: same damage,
same dial, same everything. You just get to decide which body stays down.

FILLED BY ATTACKS, NOT BY KILLS, and that is Wang's own wording ("after say 10
attacks"). Measured before choosing the number: a fight runs about 12.4 turns and
drops only 2.3 bodies, so a kill-fed charge would fire roughly never. Landed
shots are the common event, which is exactly why they are the currency.

IT IS THE VERB THE ABILITY IS FOR (RF4-13: "the item recharges by doing the thing
the item is for"). You earn a finisher by putting rounds into people.

*** AND ON THE SHOTGUN IT DOES NOTHING, WHICH IS THE POINT, NOT THE BUG. *** The
shotgun is already 1.0 lethal by his own ruling -- "this weapon finishes the job,
no downed state" -- so a finisher there would be a bonus for a problem that
weapon does not have. THIS IS THE INVERSE OF WHY V175's WIDE-OPEN BONUS WAS CUT
YESTERDAY: that one was worthless on three weapons of four and paid out only on
the pistol, so the rule was unlearnable. This is worth a great deal on the pistol
(80% of killshots), most of it on the smg (65%) and the rifle (45%), and nothing
on the one weapon that never needed it. A rule that is redundant exactly where it
is redundant is a rule you can learn in one fight.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy or hp number is touched.
Lethality is already a boolean the game rolls; this replaces one roll of it with
a thing the player earned. RF4-17 ("determinism where it counts") is the same
idea from the other end.

REUSE CHECK: cooks no graphic pixels, opens no bank. It rides the single
_lethalRoll line V32 already owns, counts on the existing shot resolution, and
reports through setRead like everything else.

TASTE CHECK: no new button, no new HUD, no toggle. A counter and a ready state,
exactly as the diff column asked -- it says so when it fills and says so when it
spends, in the readout he already reads.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.

DRAFT WORDS: the two readout lines are a real attempt tagged draft (8/11).
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V176 THE FINISHER'


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
        print('v176: already applied')
        return

    # ---- 1. THE COUNTER AND THE READY STATE ----
    d = sub(d,
        "const WEAPON_LETHAL={pistol:0.20,smg:0.35,rifle:0.55,shotgun:1.0};",
        """/* ===== V176 THE FINISHER (RF4-12) =================================
   "Charge up a more impactful ability after say 10 attacks, WHICH TAKES
    SOMETHING UNCONTROLLABLE AND GIVES IT TO THE PLAYER TO USE TACTICALLY."
   The uncontrollable thing is the line directly below. You dial a PERFECT
   killshot -- the most skilful thing in the game -- and then a coin decides
   whether he dies or lies there at 1hp, and with a pistol that coin says "still
   alive" EIGHTY PERCENT OF THE TIME. Since V173 there is a medic whose whole job
   is standing those bodies back up.
   FILLED BY ATTACKS, NOT KILLS, which is Wang's own wording and also the only
   thing that works here: measured, a fight runs about 12.4 turns and drops 2.3
   bodies, so a kill-fed charge would fire roughly never. */
const FINISH_AT=6;   /* [DIAL] landed shots to earn one, against a fight of about 12 turns */
function finisherReady(){ return (G._finCharge||0)>=FINISH_AT; }
function finisherFeed(){
  if(G.over||finisherReady())return;
  G._finCharge=(G._finCharge||0)+1;
  if(finisherReady())try{ setRead('FINISHER READY',
    'the next one you dial stays down','#8fe89a'); }catch(_e){} }
const WEAPON_LETHAL={pistol:0.20,smg:0.35,rifle:0.55,shotgun:1.0};""",
        what='the counter')

    # ---- 2. EVERY SHOT THAT CONNECTS FEEDS IT ----
    d = sub(d,
        "  if(kind==='kill')G._nearMiss=null;",
        """  if(kind!=='miss')finisherFeed();   /* V176: the verb the ability is for -- rounds into people */
  if(kind==='kill')G._nearMiss=null;""",
        what='the feed')

    # ---- 3. AND IT SPENDS ON THE LETHALITY ROLL ----
    d = sub(d,
        "      const _lethalRoll=(WEAPON==='shotgun')||(Math.random()<(WEAPON_LETHAL[WEAPON]||0));   /* V32 WEAPON-GATED LETHALITY */",
        """      /* V176 THE FINISHER SPENDS HERE, and it is the only line it touches. It
         does not change the damage, the dial or the odds of landing -- it
         replaces ONE roll of a coin the game was already flipping with a thing
         the player earned by fighting. On the shotgun this is a no-op and that
         is deliberate: 1.0 lethal is his own ruling, "this weapon finishes the
         job", so a finisher there would be a bonus for a problem it does not
         have. That is the INVERSE of the wide-open bonus cut yesterday, which
         paid out on one weapon of four; this one is worth 80% of your killshots
         on the pistol, 65% on the smg, 45% on the rifle, and is redundant
         exactly where it is redundant. */
      const _fin=finisherReady()&&WEAPON!=='shotgun';
      if(_fin){ G._finCharge=0;
        try{ setRead('THAT ONE STAYS DOWN','the finisher is spent \\u2014 earn another','#e8593a'); }catch(_e){} }
      const _lethalRoll=_fin||(WEAPON==='shotgun')||(Math.random()<(WEAPON_LETHAL[WEAPON]||0));   /* V32 WEAPON-GATED LETHALITY */""",
        what='the spend')

    # ---- 4. A NEW FIGHT STARTS UNEARNED ----
    d = sub(d,
        "  G.steady=0; G._steadyAtPop=0; G._poppedOut=false; G._chainN=1; G._chainWait=false; G._muzzleA=null; G._sweepUsed=0;",
        "  G.steady=0; G._steadyAtPop=0; G._poppedOut=false; G._chainN=1; G._chainWait=false; G._muzzleA=null; G._sweepUsed=0; G._finCharge=0;   /* V176: a finisher is earned in the fight you spend it in */",
        what='reset')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v176: the finisher -- %d chars' % len(d))


if __name__ == '__main__':
    main()

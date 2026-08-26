#!/usr/bin/env python3
"""
V182 THE TWO MISSING BARS -- RF4-05 PROTECTION POINTS and RF4-07/42 POWER.

  PAOLO 8/26, after saying the combat is "VERY FAR OFF" for the fourth time and
  then suspending the one-question rule to answer everything at once:
      "ALL THREE BARS"
      "JUST IMAGINE ROGUE FABLE 4 WITH 120 BPM EVERYTHING BRO LIEK THATS ALL?"

*** IT IS TWO BARS, NOT THREE, AND THE THIRD IS ALREADY BUILT. ***
Before writing a line: SPEED POINTS ALREADY EXIST IN THIS GAME UNDER THE NAME
STAMINA. G.stam is a THREE PIP bar; sprint spends 1 and YOUR TURN KEEPS GOING
(which is RF4-08's "mobility that BUYS ACTIONS", word for word); dash spends 2; a
PERFECT press refunds a pip ("IN THE POCKET"); and it refills on a turn clock
whose constant is LITERALLY CALLED SP_TICK. STAM_MAX=3 is RF4-09's "deliberately
hard to stack". The bar he asked for is shipped, wired to the beat, and was never
recognised as the thing it already is.
So building a second speed bar beside it would be the duplicate-system disease
this project keeps paying for. SPEED POINTS ARE RENAMED AND CREDITED, NOT REBUILT.
WHAT IS ACTUALLY MISSING IS PROTECTION AND POWER, and this ships both.

-------------------------------------------------------------------------
PROTECTION POINTS (RF4-05), and it needed ONE OWNER FIRST
-------------------------------------------------------------------------
  "Protection Points act as a separate HP bar which CANNOT BE PUNCHED THROUGH
   while a single point still stands."

That rule is the whole character of the bar: a hit that lands on 1 PP is fully
eaten, however big it was. It makes the bar a TIMER YOU MANAGE rather than a
damage sponge, and it is why RF4 players count turns instead of hit points.

*** AND THE PLAYER HAD NO SINGLE PLACE HE TAKES DAMAGE. *** Eight separate sites
do `G.pHP=Math.max(0,G.pHP-dmg)` -- the volley, the holders, the peekers, melee,
the grenade, the car blast, the self-blast band. A bar that sits ABOVE hp has to
be in front of ALL of them or it is decoration, so this adds hurtPlayer() and
routes every one through it. Same repair as V181's bodyFell(), which found five
of six deaths dropping nothing: A RULE WITH SEVEN DOORS AND ONE LOCK IS NOT A RULE.

It regenerates on the SAME CLOCK the speed bar already uses (SP_TICK), because
"RF4 with 120 BPM everything" means the beat owns every clock in the fight, and
there was already exactly one.

-------------------------------------------------------------------------
POWER (RF4-07 + RF4-42), AND IT MODIFIES THE DIAL, NEVER THE DAMAGE
-------------------------------------------------------------------------
  "One unified offensive stat... anything modifying Power now modifies ALL power."

NO DAMAGE BEFORE THE DIAL. EVER. So Power is NOT a flat damage adder sitting
beside the dial -- it is a term IN the dial, joining fg, _ww, _grW and _pinW on the
line that already decides how wide the kill window is. That is the reading that
satisfies both his ruling and his law at once, and it is the more RF4 answer
anyway: one stat, every weapon, "modifies ALL power" -- our power is the window.

Raising Power makes every gun easier to kill with WITHOUT changing what any gun
hits for, so not one damage number moves and the dial stays the only thing that
decides how hard you hit.

-------------------------------------------------------------------------
NO DAMAGE BEFORE THE DIAL: not one damage, accuracy, hp or armour value moves.
PP re-routes damage that already existed; POWER widens a window that already
existed. Every number introduced is a [DIAL].

REUSE CHECK: cooks no graphic pixels, opens no bank. PP regenerates on SP_TICK,
the clock the stamina bar already runs on. POWER joins the existing multiplier
chain on the existing hz/vz/hitz line rather than adding a second one. Speed
Points are not rebuilt because they already exist.

TASTE CHECK: no new button and no menu. PP announces itself only when it breaks or
comes back, in the voice SECOND WIND already uses.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V182 THE TWO MISSING BARS'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v182: already applied')
        return

    # ---- 1. THE BARS, AND ONE DOOR FOR EVERY HIT THE PLAYER TAKES ----
    d = sub(d,
        "const SP_TICK=5;",
        """const SP_TICK=5;
/* ===== V182 THE TWO MISSING BARS (RF4-05, RF4-07, RF4-42) ==========
   Paolo 8/26: "ALL THREE BARS" -- and "JUST IMAGINE ROGUE FABLE 4 WITH 120 BPM
   EVERYTHING BRO LIEK THATS ALL?"
   *** IT IS TWO BARS. THE THIRD WAS ALREADY BUILT AND NOBODY NOTICED. ***
   SPEED POINTS ARE G.stam. Sprint spends one pip AND YOUR TURN KEEPS GOING,
   which is RF4-08's "mobility as a spendable resource that BUYS ACTIONS" word
   for word; dash spends two; a PERFECT press refunds one; it refills on the
   clock above, whose constant is LITERALLY NAMED SP_TICK; and STAM_MAX=3 is
   RF4-09's "deliberately hard to stack". Building a second speed bar beside it
   would be the duplicate-system disease. It is credited, not rebuilt.
   WHAT WAS ACTUALLY MISSING IS PROTECTION AND POWER. */
const PP_MAX=20;      /* [DIAL] the shield above your hp */
const PP_REGEN=5;     /* [DIAL] RF4's number: 5 back every 5 turns, on the beat clock we already have */
/* RF4-05: "a separate HP bar which CANNOT BE PUNCHED THROUGH while a single
   point still stands." That clause IS the bar's character -- a hit that lands on
   one remaining point is eaten whole, however big it was -- and it turns the bar
   into a TIMER YOU MANAGE instead of a sponge. It is why RF4 players count turns
   rather than hit points. */
function ppAbsorb(dmg){
  if(dmg<=0)return 0;
  const have=G.pp||0;
  if(have<=0)return dmg;
  G.pp=Math.max(0,have-dmg);
  if(G.pp<=0)try{ setRead('PLATE GONE','the vest is done \\u2014 the next one is yours','#e8593a'); }catch(_e){}
  return 0; }                    /* UNBREACHABLE: nothing spills through in the same hit */
/* *** ONE DOOR FOR EVERY HIT THE PLAYER TAKES, AND THERE WERE EIGHT. ***
   The volley, the holders, the peekers, melee, the grenade, the car blast and the
   self-blast band each did their own G.pHP=Math.max(0,G.pHP-dmg). A bar that sits
   ABOVE hp has to stand in front of ALL of them or it is decoration. Same repair
   as V181's bodyFell, which found five deaths in six dropping nothing: A RULE
   WITH SEVEN DOORS AND ONE LOCK IS NOT A RULE. */
function hurtPlayer(dmg){
  dmg=Math.max(0,dmg|0); if(!dmg)return 0;
  const through=ppAbsorb(dmg);
  if(through>0)G.pHP=Math.max(0,G.pHP-through);
  try{ updPP(); }catch(_e){}
  return through; }
function updPP(){ const el=D('pppips'); if(!el)return;
  const n=Math.max(0,Math.min(PP_MAX,G.pp||0));
  el.textContent='PLATE '+n+'/'+PP_MAX; }
/* POWER (RF4-07, RF4-42): "one unified offensive stat... anything modifying
   Power now modifies ALL power."
   *** AND IT MODIFIES THE DIAL, NEVER THE DAMAGE. *** NO DAMAGE BEFORE THE DIAL
   is law, so Power is not a flat adder sitting beside the dial -- it is a term
   IN it, joining fg, _ww, _grW and _pinW on the line that already decides how
   wide the kill window is. That satisfies his ruling and his law at once, and it
   is the more RF4 answer anyway: one stat, every weapon. Raising Power makes
   every gun easier to KILL with without changing what any gun HITS for. */
const POWER_BASE=0;      /* [DIAL] where a fresh character stands */
const POWER_STEP=0.08;   /* [DIAL] what one point of Power is worth to the window */
function powerMult(){ return 1+((G.power||0)*POWER_STEP); }""",
        what='the bars')

    # ---- 2. EVERY HIT GOES THROUGH THE ONE DOOR ----
    d = sub(d, "G.pHP=Math.max(0,G.pHP-dmg);", "hurtPlayer(dmg);", n=6, what='pHP dmg x6')
    d = sub(d, "G.pHP=Math.max(0,G.pHP-sd);", "hurtPlayer(sd);", n=2, what='pHP sd x2')

    # ---- 3. POWER IS A TERM IN THE DIAL ----
    d = sub(d,
        "const hz=z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*(G.inFU?1.18:1)*(G.execWindow?1.35:1)",
        "const _pwr=powerMult();   /* V182 RF4-07/42: one stat, every weapon, and it moves the WINDOW not the damage */\n  const hz=z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*_pwr*(G.inFU?1.18:1)*(G.execWindow?1.35:1)",
        what='power in the dial')

    # ---- 4. THE PLATE COMES BACK ON THE BEAT CLOCK ----
    # AFTER updStam(), NOT INSIDE THE CLOCK BLOCK, AND V163's GATE IS WHY.
    # That gate does not read this block as a string -- it SLICES it out (from the
    # `if` to the first updStam()) and EXECUTES it in a new Function with only
    # G/STAM_MAX/SP_TICK/setRead/updStam bound, because a per-use refund and a
    # global clock are indistinguishable by string and the whole ruling is which
    # one it is. Code put inside that slice referencing PP_MAX or updPP throws
    # ReferenceError in the harness and takes a correct, unrelated claim red.
    # The plate still mends on the same tick -- it just does it one line later.
    # AFTER updStam(), OUTSIDE THE CLOCK BLOCK, AND V163's GATE IS WHY.
    # That gate does not read the block as a string -- it SLICES it (from the `if`
    # to the first updStam()) and EXECUTES it in a new Function bound only to
    # G/STAM_MAX/SP_TICK/setRead/updStam, because a per-use refund and a global
    # clock are indistinguishable by string and the whole ruling is WHICH ONE IT
    # IS. Anything inside that slice touching PP_MAX or updPP throws
    # ReferenceError in the harness and takes a correct, unrelated claim red.
    # So the plate mends on the same tick from its OWN guarded block, one line
    # later, carrying its own copy of the condition.
    d = sub(d,
        "}catch(_e){} }\n  updStam();",
        """}catch(_e){} }
  updStam();
  /* V182: the plate mends on THE SAME CLOCK the legs do. "RF4 with 120 BPM
     everything" means the beat owns every clock in the fight, and there was
     already exactly one -- so this does not get a second, it reads the same tick.
     It sits OUTSIDE the block above on purpose: V163's gate slices that block out
     and RUNS it, so code in there referencing PP_MAX reds a claim about stamina. */
  if(((G.mTurn||0)%SP_TICK)===0){ const _wasPP=G.pp||0;
    G.pp=Math.min(PP_MAX,_wasPP+PP_REGEN);
    if(G.pp>_wasPP){ try{ updPP(); }catch(_e){}
      if(_wasPP<=0)try{ setRead('PLATE BACK','the vest has something in it again','#8fe89a'); }catch(_e){} } }""",
        what='pp regen')

    # ---- 5. A FRESH FIGHT ----
    d = sub(d,
        "G.stam=STAM_MAX; G.handPeek=false;",
        "G.pp=PP_MAX; G.power=POWER_BASE;   /* V182: the plate and the stat start every fight known */\n  G.stam=STAM_MAX; G.handPeek=false;",
        what='reset')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v182: the two missing bars -- %d chars' % len(d))


if __name__ == '__main__':
    main()

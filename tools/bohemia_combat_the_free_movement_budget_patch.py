#!/usr/bin/env python3
"""V163 THE FREE-MOVEMENT BUDGET. RF4-08, machine 1.

SPEC ITEM: RF4-08 (SPEED POINTS — mobility as a spendable resource), status
SPECED -> BUILT. Routed by laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md section
6: "COMBAT owns machines 1, 3, 4, 7, 8, 9... START WITH THE FREE-MOVEMENT
BUDGET; it is the one he will feel first."

Paolo's own synthesis, machine 1, in his words:

  "The base rule. One action per turn. Attacking ends your turn. MOVING ENDS
   YOUR TURN. Waiting is a legal action and is frequently the correct one.
   The exception that makes the game. Speed Points. Sprinting moves you WITHOUT
   ending your turn. That means SP is not movement, it is a currency that buys
   free actions outside the turn economy entirely.
   The regen rule is the sharp part. SP regenerates on every 5th global game
   turn, ON A FIXED WORLD CLOCK. It is NOT a per-use cooldown that starts when
   you spend. Spend on turn 4 and it refunds on turn 5, one turn later, free.
   It rewards clock-reading, not hoarding... It creates a rhythm to the whole
   fight. The fight has a heartbeat, and skilled play means acting on the beat."

--------------------------------------------------------------------------
WHAT WE HAD, MEASURED
--------------------------------------------------------------------------
Twelve arenas, ten steps each, driving the real doMove:

  PLAYER MOVES made:              120
  ...that advanced the turn:       70
  ...that any enemy reacted to:    73

So movement was PARTLY free and inconsistently so, which is the worst of both:
he cannot learn a rule that only applies 58% of the time.

AND THE REGEN WAS EXACTLY THE SHAPE RF4 REJECTS. The line was

    if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);

-- a pip back only on a turn you spent nothing. That is a per-use cooldown
wearing a clock's clothes: it PUNISHES spending and REWARDS hoarding, which is
the precise inversion of the thing his synthesis calls "the sharp part."

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
1. MOVING ENDS YOUR TURN. One action per turn, all the time, not 58% of the
   time. This is the base rule everything else stands on.
2. SPEED POINTS BUY FREE ACTIONS. Unchanged and now load-bearing: the sprint,
   the run and the dash already cost pips and already do NOT end the turn
   (V54's own comment says so: "stamina actions DON'T end your turn"). Bohemia
   had the exception without the rule, so the exception meant nothing.
3. THE CLOCK IS GLOBAL AND IT REFUNDS. Every SP_TICK turns the budget refills,
   whatever he spent and whenever he spent it. Hoarding earns nothing; spending
   just before the tick is the play, and learning where the tick falls is the
   skill.

*** AND IT LANDS ON A LAW WE ALREADY HAVE. *** 120 BPM: "everything quantizes
to the beat... I-MOVE-YOU-MOVE." His synthesis says the SP clock "creates a
rhythm to the whole fight. The fight has a heartbeat, and skilled play means
acting on the beat." That is the same sentence twice, from two directions, and
the tick is now the thing that makes Bohemia's heartbeat cost something.

WHAT I AM NOT DECIDING: SP_TICK is 5 because his corpus says every 5th global
turn. If it should be 4 or 6 in a gun fight that is a feel call and his.

REUSE CHECK: cooks NO graphic pixels. Reuses G.stam, STAM_MAX, spendStam,
spendMove, tickTurnEnd and endTurnReturn -- every piece already existed. Nothing
authored, no bank opened, no second resource.

TASTE CHECK: authors no art. The taste rule is his synthesis: a budget that
rewards clock-reading rather than hoarding. The restraint is that no number
about damage moves, and the sprint/run/dash verbs are untouched -- they simply
start meaning something now that the base rule exists to be the exception to.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V163 THE FREE-MOVEMENT BUDGET'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v163 already in; nothing to do')
        return

    # ---- 1. the clock, and the regen that stops punishing him ---------
    old = """  /* V54 + V67: a pip back for a turn you spent NOTHING on. The old
     unconditional refill cancelled every cost in the same turn it was paid. */
  if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);
  G._stamSpent=false; updStam();"""
    new = """  /* ===== V163 THE FREE-MOVEMENT BUDGET (RF4-08, machine 1) =====
     Paolo's own synthesis: "The regen rule is the sharp part. SP regenerates on
     every 5th global game turn, ON A FIXED WORLD CLOCK. It is NOT a per-use
     cooldown that starts when you spend. Spend on turn 4 and it refunds on turn
     5, one turn later, for free. It rewards clock-reading, not hoarding."
     WHAT WAS HERE WAS THE EXACT INVERSION:
         if(!G._stamSpent)G.stam=...+1;
     a pip back ONLY on a turn you spent nothing. That is a per-use cooldown in a
     clock's clothes -- it punished spending and paid him to hoard, which is the
     opposite of the mechanic and the opposite of the movement he keeps asking
     for.
     THE CLOCK IS GLOBAL AND IT REFUNDS, whatever he spent and whenever. Hoarding
     earns nothing. Spending just before the tick is the play, and knowing where
     the tick falls is the skill.
     AND IT LANDS ON A LAW WE ALREADY HAVE -- 120 BPM, "everything quantizes to
     the beat". His synthesis: "it creates a rhythm to the whole fight. The fight
     has a heartbeat, and skilled play means acting on the beat." Same sentence
     from two directions. */
  if(((G.mTurn||0)%SP_TICK)===0){
    const _was=G.stam||0;
    G.stam=STAM_MAX;
    if(G.stam>_was)try{ setRead('SECOND WIND','the clock came round \\u2014 your legs are back','#8fe89a'); }catch(_e){} }
  updStam();"""
    js = subN(js, old, new)

    old = """const STAM_MAX=3;   /* V54 STAMINA (Paolo, Fable model): stamina actions DON'T end your turn */"""
    new = """const STAM_MAX=3;   /* V54 STAMINA (Paolo, Fable model): stamina actions DON'T end your turn */
const SP_TICK=5;    /* V163 [DIAL] RF4-08: the budget refills every Nth GLOBAL turn. 5 is his corpus's number ("every 5th global game turn"); whether a gun fight wants 4 or 6 is a feel call and HIS. */"""
    js = subN(js, old, new)

    # ---- 2. the base rule: a step is your turn ------------------------
    old = """  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now();
  G.moveArm=false; updMoveUI();"""
    new = """  worldShift(sx,sy); updateGeomCover(); G._stepAt=performance.now();
  G.moveArm=false; updMoveUI();
  /* ===== V163 MOVING ENDS YOUR TURN (RF4-08, machine 1) ========
     His synthesis, the base rule: "One action per turn. Attacking ends your
     turn. MOVING ENDS YOUR TURN. Waiting is a legal action and is frequently
     the correct one. The exception that makes the game: Speed Points. Sprinting
     moves you WITHOUT ending your turn."
     MEASURED BEFORE THIS: of 120 real steps, 70 advanced the turn. Movement was
     partly free and inconsistently so, which is the worst of both -- he cannot
     learn a rule that holds 58% of the time.
     BOHEMIA HAD THE EXCEPTION WITHOUT THE RULE. V54 already says "stamina
     actions DON'T end your turn", and the sprint, run and dash already cost pips
     and already end no turn. But if a plain step was free too, then the
     exception bought nothing and the budget meant nothing. This is the rule that
     makes the exception worth paying for.
     A SPRINT IS STILL FREE: this is the plain step only, and _sprinting returns
     through the pip path below without ever reaching here. */
  if(!_sprinting){ return endTurnReturn(false); }"""
    js = subN(js, old, new)

    # ---- 3. and the flag the old rule needed is DEAD, so it goes -------
    old = """function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; G._stamSpent=true; updStam(); return true; }"""
    new = """/* V163: _stamSpent IS GONE. It existed only to answer "did he spend this turn",
   which was the per-use question the old regen asked. The clock does not care
   who spent what, so the flag is unread -- and an unread flag that three gate
   checks were pinned to is exactly the present-and-dead shape that has cost this
   project inMyRange, the damage faces and PRESS_STEP. */
function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; updStam(); return true; }"""
    js = subN(js, old, new)

    old = """    G.stam=Math.min(STAM_MAX,(G.stam||0)+n); G._stamSpent=false; updStam();"""
    new = """    G.stam=Math.min(STAM_MAX,(G.stam||0)+n); updStam();"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v163: the free-movement budget -- %d chars' % len(js))


if __name__ == '__main__':
    main()

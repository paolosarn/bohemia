#!/usr/bin/env python3
"""
V180 STAND WHERE THEY CAN SEE YOU -- RF4-18, walls are mechanics, not scenery.

  "WALLS ARE MECHANICS, NOT SCENERY. Infusion-of-Storms grants +1 for ENDING A
   TURN WIDE OPEN, meaning NOT ADJACENT TO ANY WALLS -- and depending on balance,
   pillar type objects may also be included in that definition. ABILITIES READ
   THE ROOM."

Our diff: "ABSENT as a rule. Cover and LOS are read, but nothing keys off wall
adjacency or open-ness. THIS IS THE ITEM THAT JUSTIFIES HIS INDOOR INSTINCT."

*** THIS ROW WAS BUILT AND CUT ON 8/21, AND THE REASON IT COMES BACK IS THAT THE
BLOCKER IS GONE. *** That version paid +1 killshot on the chain, and V62's
per-weapon cap (pistol 8, smg 2, shotgun 2, rifle 1) swallowed it whole on three
guns of four -- the readout would have promised "out here the rifle gets one more
this turn" and handed over nothing. The record named exactly what it needed: A
REWARD CURRENCY THAT IS NOT WEAPON-CAPPED. V176 then shipped one. THE FINISHER
CHARGE FILLS IDENTICALLY WHATEVER YOU ARE HOLDING.

MEASURED BEFORE WIRING THEM TOGETHER, AND THE FIRST CONDITION WAS TOO CHEAP:

  WIDE OPEN ALONE is 55% of turns -- 7 a fight -- and at one charge a turn that
  is 1.33 FREE FINISHERS PER FIGHT in 16 fights of 24. It would have made V176's
  "you earn it by shooting" mean nothing.

  OPEN GROUND UNDER THEIR EYES -- no stone near you AND at least one man who can
  actually see you -- is 32% of turns, 3.8 a fight, 0.54 finishers, in 10 fights
  of 24. Earned, not free, and it stacks with the shooting feed rather than
  replacing it.

AND IT IS GENUINELY THE RISKY SPOT, which took two measurements to establish.
HP-per-turn came back BACKWARDS twice -- open ground reads CHEAPER than standing
near stone -- because that number is confounded by everything else a turn
contains: he is walking away while open, and men are pressing him while he is
tucked. Asked directly instead, with exposedToMe(), which is not a proxy for
anything:

    OPEN GROUND UNDER THEIR EYES   0.56 guns can reach you
    EVERY OTHER TURN               0.22
    TWO AND A HALF TIMES THE EXPOSURE.

*** AND THE CONDITION IS THE ONE V179 ALREADY DRAWS. *** Yesterday's rings light
up under every man who can see you. This pays you for standing on open ground
while they are lit. THE INFORMATION AND THE REWARD ARE THE SAME THING, which is
the difference between a rule a player can act on and a rule he has to be told.

NO DAMAGE BEFORE THE DIAL: not one damage, accuracy or hp number moves. It feeds
a counter V176 already owns, through the function V176 already wrote, which
refuses to fill past the threshold -- so this cannot stockpile either.

REUSE CHECK: cooks no graphic pixels, opens no bank. wideOpen() reads G.pillars
and pXY, the geometry the whole fight runs on; the eyes half is seesMe(), the
predicate five systems already share; the payout is finisherFeed(), called and
not reimplemented.

TASTE CHECK: no new button, no new HUD, no second counter. The charge already
announces itself when it is ready, and the rings already show the condition. One
readout line, only on the turn it actually feeds.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V180 STAND WHERE THEY CAN SEE YOU'


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
        print('v180: already applied')
        return

    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn();",
        """/* ===== V180 STAND WHERE THEY CAN SEE YOU (RF4-18) =================
   "Walls are mechanics, not scenery. +1 for ENDING A TURN WIDE OPEN, meaning NOT
    ADJACENT TO ANY WALLS. Abilities read the room."
   CUT ON 8/21 AND BACK BECAUSE THE BLOCKER IS GONE. That version paid a killshot
   on the chain and V62's per-weapon cap swallowed it on three guns of four; the
   record named what it needed -- a currency that is not weapon-capped -- and
   V176 shipped one. The finisher charge fills identically whatever you hold.
   NOT MERELY OUTDOORS. Wide open alone is 55% of turns and would hand out 1.33
   FREE finishers a fight. OPEN GROUND UNDER THEIR EYES is 32%, 0.54 a fight, and
   it is 2.5x the exposure: 0.56 guns can reach you there against 0.22 on every
   other turn, measured with exposedToMe rather than an HP proxy -- HP came back
   BACKWARDS twice, because a turn spent open is also a turn spent walking away.
   AND IT IS THE STATE V179 ALREADY DRAWS: the rings under their feet ARE the
   condition. The information and the reward are the same thing. */
/* [DIAL] how close a rock has to be to stop counting as open. 1.6 IS LOAD-BEARING
   AND THE MUTATION TEST IS WHY: at 0.8 or 0.2 the state covers HALF of all turns
   and the turns that are NOT open stop having any guns on them at all -- there is
   no safer place left that does not also pay, so the rule stops being a choice.
   1.6 -> 35% of turns; 0.8 -> 50%; 0.2 -> 48%; 2.4 -> 18%. */
const WIDE_OPEN_R=1.6;
function wideOpen(){
  for(const P of (G.pillars||[])){ const q=pXY(P);
    if(Math.hypot(q[0],q[1])<=WIDE_OPEN_R)return false; }
  return true; }
function eyesOnMe(){
  for(const e of (G.e||[])){ if(!e||e.dead||e.downed)continue;
    try{ if(seesMe(e))return true; }catch(_x){} }
  return false; }
function openGroundTick(){
  /* NO SECOND CAP HERE. The first write also checked finisherReady() -- and a
     mutation test that deleted that check left the gate FULLY GREEN, because
     finisherFeed already refuses to fill past the threshold and the readout
     below already asks the same question. A term that changes nothing is the
     MEDIC_SHY defect, so it came out. The cap is V176's, and V176 gates it. */
  if(G.over)return;
  if(!wideOpen()||!eyesOnMe())return;
  finisherFeed();
  if(!finisherReady())try{ setRead('OUT IN THE OPEN','they can see you, and the gun is learning something','#e8b04a'); }catch(_e){} }
function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn(); openGroundTick();""",
        what='openGroundTick')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v180: stand where they can see you -- %d chars' % len(d))


if __name__ == '__main__':
    main()

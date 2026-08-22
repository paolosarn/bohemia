#!/usr/bin/env python3
"""
V177 THE BREACHER -- RF4-28, enemies designed as counters to effective player
actions, and the repair of a mechanic that could never fire.

  "ENEMIES ARE DESIGNED AS COUNTERS TO EFFECTIVE PLAYER ACTIONS, deliberately,
   to force tactical adaptation and increase the overall tactical scope of
   gameplay."

Our own diff: "ABSENT as a design rule. Nothing in the roster is built to punish
a specific player habit. OUR COVER SYSTEM IS STRONG ENOUGH THAT A COVER-DESTROYING
OR COVER-IGNORING BODY WOULD BE A REAL COUNTER."

*** THE EFFECTIVE PLAYER ACTION IS ALREADY MEASURED: THE STONE TAKES 73% OF THE
GUNS OFF YOU. *** Asked causally on 280 frozen fight states the day before --
count the guns with a clean line, take every rock away, count again. Cover is the
single largest system in the fight, so it is the thing RF4-28 says to counter.

*** AND WHILE MEASURING WHETHER IT NEEDED ONE, A SHIPPED MECHANIC TURNED OUT TO
BE STRUCTURALLY UNREACHABLE. *** V152 added `if(covP)chewCover(covP)` -- "and the
stone takes it too" -- so cover has hp and is eaten by the rounds it stops.
Measured: ZERO calls across 309 turns of real play, and 0 pillars destroyed or
even knocked down across 24 fights. Not rare. IMPOSSIBLE:

    264 real fight states, 85 guns in the volley,
    OF THOSE, WITH A PILLAR COVERING YOU FROM THEM: 0

because a pillar that covers you is exactly what takes a man OUT of the volley.
The chew waits on a condition its own geometry forbids. So cover in this game has
never once degraded, and that 73% holds for the whole fight, forever.

WHAT SHIPS: a body whose turn is spent shooting THE STONE YOU ARE BEHIND rather
than you. He is the counter RF4-28 asks for, and he is also the only caller
chewCover can ever have -- suppressing a position you cannot see into is what
that fire IS, and it is the one case the volley's line-of-sight test was never
going to cover.

HE IS A GOON WITH A JOB, the V173 pattern: hp, accuracy and damage copied from
ARCH.human, not chosen. A whole new archetype that sets no damage number, and a
measurement with nothing to point at except behaviour.

HE COSTS NO DAMAGE EITHER. He spends his turn on the rock instead of on you, so
while he is working you are taking LESS incoming fire, not more -- the price is
paid in geometry when the stone finally goes, which is the honest shape of the
threat and keeps NO DAMAGE BEFORE THE DIAL untouched.

AND THE ANSWERS ARE THE ONES ALREADY BUILT: shoot him, pin him with SUPPRESS
(a head-down man does no work, same as the medic), or move to another rock -- of
which there are about 65 an arena.

REUSE CHECK: cooks no graphic pixels, opens no bank. It calls chewCover, which
already knocks a pillar from tall to low to gone and already says so in the
readout, and finds the target with coverPillarAgainst, the same predicate the
volley uses. Nothing new is drawn because V152 already drew all of it.

TASTE CHECK: no new button, no new HUD. chewCover's own readouts already say
"COVER IS GOING" and "COVER IS GONE"; they have simply never been reachable.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V177 THE BREACHER'


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
        print('v177: already applied')
        return

    # ---- 1. THE BODY ----
    d = sub(d,
        "  medic:{n:'MEDIC', hp:60,  acc:0.55, dmg:[14,26], bot:false, melee:false, medic:true, draft:true},",
        """  medic:{n:'MEDIC', hp:60,  acc:0.55, dmg:[14,26], bot:false, melee:false, medic:true, draft:true},
  /* ===== V177 THE BREACHER (RF4-28) =============================
     "Enemies are designed as COUNTERS TO EFFECTIVE PLAYER ACTIONS, deliberately."
     The effective player action is measured: THE STONE TAKES 73% OF THE GUNS OFF
     YOU (280 frozen states, rocks in against rocks out). So this is the body
     that shoots the rock. Numbers copied from ARCH.human like the medic's, so a
     new archetype sets no damage number and the only difference is the job.
     [draft:true] on the NAME only -- what these people are called is his. */
  breacher:{n:'BREACHER', hp:60, acc:0.55, dmg:[14,26], bot:false, melee:false, breach:true, draft:true},""",
        what='ARCH.breacher')

    # ---- 2. HE SHOOTS THE STONE ----
    d = sub(d,
        "function tickTurnEnd(){ meleeTurnRun(); medicTurn();",
        """const BREACH_BITE=2;   /* [DIAL] how fast he eats a rock, against COVER_BITE=1 for a stray round */
/* ===== V177 THE BREACHER: THE ONLY CALLER chewCover CAN EVER HAVE ==========
   V152 shipped "and the stone takes it too" as `if(covP)chewCover(covP)` inside
   the volley -- a round of theirs that YOUR COVER ATE takes a bite out of it.
   MEASURED: zero calls across 309 turns of real play, and zero pillars destroyed
   or even knocked down across 24 fights. Not rare, IMPOSSIBLE: 264 states, 85
   guns in the volley, and NOT ONE of them had a pillar covering you -- because a
   pillar that covers you is precisely what removes a man from the volley. The
   chew waits on a condition its own geometry forbids, so cover in this game has
   never once degraded and that 73% holds for the entire fight.
   THIS MAN IS THE CASE THAT WAS MISSING. He does not need a line on you; he
   needs the rock, and putting rounds into a position you cannot see into is what
   suppressing IS. He spends his turn on the stone instead of on you, so while he
   works you take LESS fire, not more -- the bill arrives as geometry when the
   cover goes. The answers are the ones already built: shoot him, pin him, or
   move to one of the other sixty-odd rocks. */
function breachTurn(){
  if(G.over)return;
  for(const e of (G.e||[])){
    if(!e||e.dead||e.downed||e.broken||e.fleeing)continue;
    if(!(e.E&&e.E.breach))continue;
    if(pinned(e)||(e.stun||0)>0||(e.prone||0)>0)continue;   /* head-down men do no work */
    if(!inHisRange(e))continue;                             /* he has to be able to reach the rock */
    const P=coverPillarAgainst(e.ea,e.edist,e.lvl,false);
    if(!P)continue;                                         /* nothing between you and him to work on */
    for(let k=0;k<BREACH_BITE;k++){ try{ chewCover(P); }catch(_x){} }
    e._breachAt=performance.now(); }
}
function tickTurnEnd(){ meleeTurnRun(); medicTurn(); breachTurn();""",
        what='breachTurn')

    # ---- 3. AND HE IS IN THE ROOM, after the blades like the medic ----
    d = sub(d,
        "  if(N>=4&&out.length<N)out.push('medic');",
        """  if(N>=4&&out.length<N)out.push('medic');
  if(N>=5&&out.length<N)out.push('breacher');   /* V177 RF4-28: the answer to a lot with 65 rocks on it */""",
        what='roster')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v177: the breacher -- %d chars' % len(d))


if __name__ == '__main__':
    main()

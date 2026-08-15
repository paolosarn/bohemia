# THE GUN ONLY SWINGS SO FAR (COMBAT, 8/15/26, v155)

Paolo, 8/15, for the **second** time: *"I already told you if I'm facing one way
the next person that I can kill shot can't be like directly on the other side
like bumping to shoot someone."*

He had told me. Nothing in the code had ever asked.

## WHAT THE CHAIN ACTUALLY WAS

```js
function nextChainTarget(){ return pickTarget(); }
```

That is the whole thing. Pure threat order, closest first, all 360 degrees of the
board. So a killshot could hand you the man standing at your back and call it one
continuous motion. That is not a chain, it is a pirouette.

## A CHAIN IS ONE MOTION

The muzzle comes off the man who just dropped and swings onto the next one. The
next victim now has to be inside the arc the gun can traverse in that beat.
Outside it there is no chain: the turn ends, and lining the next one up costs a
reposition.

**That is the movement he keeps asking for**, and it arrives out of the fight
instead of out of a rule. Where he stands before the first shot now decides how
much of the board that turn can reach.

## AND THE ARC BELONGS TO THE GUN

Which answers the other half of what he said that day, *"maybe depending on the
gun type"*:

| gun | swing per hop |
|---|---|
| pistol | ±75° — whips, lightest thing you can carry |
| smg | ±60° |
| shotgun | ±55° — heavy at the muzzle |
| rifle | ±40° — long, slow to traverse |
| sniper | ±20° — a scope sees almost nothing beside itself |

**The gun that gives the most shots gives the least ground.** A pistol's eight
killshots a turn are worth less than they look if the men are spread out; the
rifle that reaches the whole field only chains what is nearly in front of it.
Two guns are carried at once now (v149), so that is a live trade every turn.

## THE PART THAT NEARLY SHIPPED AS COSMETIC

I measured the per-hop arc on its own before believing it:

```
pistol   63.9% of the men left are in the swing   chain dies at the arc on 2.1% of kills
```

**2.1% is nothing.** Eight hops of 75 degrees is 600 degrees of rotation, so he
could still sweep the entire board inside one turn, one hop at a time. The
pirouette he complained about, arriving in slow motion.

So the turn has a **total traverse budget** — `SWEEP_TURNS` arcs' worth and no
more. A long chain has to be a chain *through* the field rather than a circle
around him.

## MEASURED, 60 REAL ARENAS, EVERY STARTING VICTIM

How many men one turn can even reach, geometrically:

```
gun        men on board    OLD (any angle)    arc only    ARC + TURN BUDGET
pistol         8.0              8.00            6.57            5.83
smg            8.0              8.00            6.35            5.42
shotgun        8.0              8.00            6.23            5.28
rifle          8.0              8.00            4.41            4.36
sniper         8.0              8.00            3.22            3.14
```

A turn used to be able to reach every man alive. It cannot any more.

## THE BUG I DID NOT SHIP

The obvious angle to measure from is `G.faceAng`. It is also **wrong**:
`G.faceAng` is written a second time by `updateStanceFacing` every time the phase
returns to cover, from the weighted threat facing. Reading it in the chain would
have measured the swing from wherever the body ended up after the kill camera,
not from where the shot was taken — a rule that looks right in the source and
does something else on screen. That is the same shape as `inMyRange` and the
damage faces.

So the shot stamps its own angle (`G._muzzleA`) and the chain measures off that.

## GATE

`gates/combat_lab_gate.js` — **795 pass / 0 fail**, and the v155 checks **run the
real selection** rather than reading it. A string check passes on a swing filter
that is defined and never reaches the selection, which is exactly what cost him
three sessions. The harness builds a board with a man dead ahead, one 60° out,
one 100° out and one directly behind (and closest), and asserts the man at his
back is never returned, that the threat order inside the arc is untouched, that
the angle wraps, that the arc is direction and not distance, that the per-gun
ordering holds, and that the turn budget runs down.

**Mutation-tested both ways.** Opening the arc to 999 takes three checks red;
spending the turn's traverse makes the same man at the same angle stop being
chainable. COMBAT RUNS (the real-browser smoke) drove a live killshot through
with zero errors.

Two existing checks were re-pointed, and one of them was the ruler being wrong:
`and every fight starts on the lot` was a fixed 1200-character window after
`function resetFightState(){`, so any correct line added to the reset eventually
pushed `G.lvl=0;` out of view and took the gate red for a reason with nothing to
do with the law. It reads the function body now, whatever length it grows to.
**Fix the ruler, never the target.**

## WHAT I DID NOT DECIDE

The range numbers. *"this isn't the final range version of the guns"* — his
debate, still open, nothing here touches `WEAPON_RANGE`.

TOOL: `tools/bohemia_combat_the_gun_only_swings_so_far_patch.py`

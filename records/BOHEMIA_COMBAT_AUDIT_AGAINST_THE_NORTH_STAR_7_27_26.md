# BOHEMIA — COMBAT AUDIT AGAINST THE NORTH STAR (7/27/26)

Measuring the shipping combat demo against Paolo's own sentence, line by line,
with the real numbers out of `COMBAT_B64`. No proposals in this file. Just what
the code does today.

> "the strategy choice to deal the most damage and take the least amount of damage
> by positioning and abilities and deeper understanding of mechanics. gameplay.
> feeling snappy and violent and human and fun."

---

## THE SCORECARD

| his lever | direction | state | the number |
|---|---|---|---|
| positioning | damage TAKEN | **strong, but binary** | cover 0% or 100%; range 0.97 → 0.37 |
| positioning | damage DEALT | **absent** | 100 flat, from anywhere |
| abilities | damage TAKEN | **strong** | 7 verbs, 3 pips, no turn cost |
| abilities | damage DEALT | **absent** | no verb raises output |
| understanding | both | **present, unlabelled** | patterns, band widths, lethality gates |

---

## 1. DAMAGE YOU TAKE — POSITION DECIDES IT

### Cover is a switch, not a dial

```js
function myCoverAgainst(ang,dist){
  const md=(dist==null?MAX_RANGE:dist);
  return (G.pillars||[]).some(P=>{ if(P.edist>md||P.edist<0.8)return false;
    let dA=Math.abs(((ang-P.ea+Math.PI*3)%(Math.PI*2))-Math.PI);
    return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; }); }
```

Every incoming-fire path filters on this predicate, e.g. `mobExposeFire`:

```js
const holders=G.e.filter(e=>...&&!myCoverAgainst(e.ea,e.edist));
```

An enemy you have cover against is **removed from the volley entirely**. Not
reduced. Removed. So per enemy, position gives you **0% or 100% mitigation and
nothing in between.**

This is a deliberate, recorded design (V7: "the magic arcs are dead — cover is
GEOMETRY on tiles only"). It is not a bug. It is noted here because a switch makes
a thinner decision than a gradient: the question "where do I stand" has exactly
two answers per enemy.

### Range is a real curve

```js
const PT_BLANK=4, FAR_TILE=26, MAX_RANGE=42;
function distT(e){ const d=Math.max(1,e.edist||10);
  return Math.min(1,Math.max(0,(d-PT_BLANK)/(FAR_TILE-PT_BLANK))); }
function distAccuracy(e){ return 0.97 - distT(e)*0.60; }
```

| your distance | their accuracy |
|---|---|
| ≤ 4 tiles (point blank) | **0.97** |
| 15 tiles (mid) | 0.67 |
| ≥ 26 tiles (long) | **0.37** |

A **2.6x swing**, scaled further by each enemy's own `E.acc/0.55`. Standing far
away genuinely and legibly halves what you eat.

**VERDICT: "take the least amount of damage by positioning" is IMPLEMENTED.**

---

## 2. DAMAGE YOU DEAL — POSITION DOES NOT TOUCH IT

```js
const KILL_DMG=100;
function applyDamage(tgt,raw){ const mit=Math.max(0,raw-(tgt.armor||0));
  tgt.hp=Math.max(0,tgt.hp-mit); return mit; }
...
applyDamage(tgt,KILL_DMG);   /* 100 base, minus armor */
```

There is **no positional term anywhere in the player's damage path.** No flank
bonus, no angle multiplier, no point-blank lethality, no elevation, no exposure
bonus. A kill press from the far corner and a kill press from one tile away
deliver the identical 100.

The one thing range touches is which needle pattern you are given:

```js
function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); }
// "point blank pulls EASIER patterns, even on Bohemian"
```

That is an indirect *execution* effect (an easier pattern is easier to hit the kill
band on), not a damage effect. And it points the wrong way for tension: it makes
the safest-to-be-shot-at position also the easiest to shoot from.

The dial's band widths, which ARE the real hit model, scale on difficulty, steady
aim and streak — never on where you are standing:

```js
const fgv=(G.pkgDiff>=1?1.10:1)*(G.pkgDiff===4?1.10:G.pkgDiff===3?1.05:1)
        *(1+((G._steadyAtPop||0)*0.05))
        *(1+Math.min(0.15,(JUICE.AW?(G.killStreak||0):0)*0.03));
```

**VERDICT: "deal the most damage by positioning" is NOT IMPLEMENTED.** Half of the
north-star sentence has no code behind it.

---

## 3. ABILITIES — SEVEN VERBS, THREE PIPS, ALL DEFENSIVE

```js
const STAM_MAX=3;   /* stamina actions DON'T end your turn */
function spendStam(n){ if((G.stam||0)<n)return false;
  G.stam-=n; G._stamSpent=true; updStam(); return true; }
// +1 per turn if you spent none
if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);
```

Live verbs: **MOVE, DASH, VAULT, SPRINT, SUPPRESS, SHOVE, GRENADE**, plus WAIT and
HAND-PEEK. Suppress runs on its own turn cooldown (`SUPP_TURNS=1`, `SUPP_CD=1`).
Shove always stuns 1 (2 with Iron Shoulder) with a 65% topple against a pillar.

A real spend economy exists and it is well-shaped: three pips, regenerating only if
you hoard, and no turn cost (Paolo 7/26, LOCKED, the Rogue Fable IV rule).

But sort them by what they do to the two numbers:

| verb | damage taken | damage dealt |
|---|---|---|
| move / dash / vault / sprint | **down** (reach cover, break lines) | — |
| suppress | **down** (gun goes down) | — |
| shove | **down** (stun, topple) | — |
| grenade | — | some |

**Every ability except the grenade is a defensive verb.** There is nothing you can
spend to hit harder.

---

## 4. DEEPER UNDERSTANDING — THE STRONGEST LEG, AND THE QUIETEST

Genuinely learnable systems already in: per-enemy needle patterns pulled by range
and difficulty; band widths that widen with steady aim and with a kill streak;
per-weapon lethality gates (`WEAPON_LETHAL`); enemy fire cycles you can read
(`firing()` on `efrac` windows); pillar geometry that both blocks and must sit near
the man to count (`realCoverPillar`); melee windups that always telegraph.

That is a real skill ceiling. Most of it is unlabelled, which is a **legibility**
problem rather than a missing mechanic — and it is the same complaint Paolo has
made three times about SUPPRESS.

---

## 5. THE ONE ASYMMETRY

**POSITION CONTROLS WHAT YOU SUFFER AND NOTHING ABOUT WHAT YOU DELIVER.**

So moving is housekeeping, not offence. Optimal play is: get behind stone, get far
away, press well. The ground never argues for attacking from a particular place,
because no place is better to attack from.

What to do about it is a design ruling and it is Paolo's. This file states the
measurement and stops.

---

## SOURCE OF TRUTH

Every number above is asserted against the live `COMBAT_B64` by
`gates/combat_lab_gate.js` section 23. If the model changes and this document is
not updated, the gate fails.

# THE VALLEY ALREADY HAD HOUSEHOLDS, AND I BUILT A SECOND SET (8/21/26)

Paolo ruled it: **"people share houses yes bro"**. The ruling is right and it is
the unblock the faction system needed. **Everything below is about my
implementation being wrong three times, and what is now actually known.**

Main is **green** and households are **not** in it. The work is on
`claude/factions-ovkjpf`.

---

## 1. THE THING I SHOULD HAVE FOUND FIRST

`slices/BOHEMIA_CITY_WORLD.html` already contains a researched household model,
**used in four places**:

```js
// ---- HOUSEHOLD ----
// weights: 1 person 30% / 2 35% / 3 20% / 4 15% -> mean ~2.2 (see header).
function household(seed){ var r=rng(seed)(),c=[0.30,0.65,0.85,1.0];
  for(var i=0;i<4;i++) if(r<c[i]) return i+1; return 4; }
```

with its grounding written above it:

> *Household size: Las Vegas averaged ~2.6 persons/household pre-collapse (ACS).
> Post-collapse populations consolidate for safety/heat **but also lose
> members**; survivor settlements historically trend to small kin groups of 1-4.*

**That is better grounded than the table I wrote.** I reasoned only about
consolidation (job loss triples house-sharing, doubling-up 6% vs 2%) and got a
mean of ~3.1. This one also accounts for the **die-off removing people**, which
pulls the other way, and lands at ~2.2. It was already here, already researched,
already used.

> **REUSE-FIRST is not only for cooked pixels.** I checked whether an *organ*
> existed and never checked whether the *content* did.

## 2. SO THE REAL FINDING IS NOT "THERE ARE NO HOUSEHOLDS"

**The city has two population concepts and they do not know about each other.**
One generates households and is used four times. The other —
`bohemia_population.homesIn()`, which is what the faction roster actually reads —
seats **one person per fine cell** and refuses duplicates:

```js
if (dup) continue;          // one person per cell, forever
```

That is why `bohemia_ties` saw 298 homes for 298 people while a household model
sat in the same file. **Not a missing feature — two systems, one of them unaware
of the other.** Whoever picks this up should start there, not from my patch.

## 3. THREE WRONG EXPLANATIONS, IN ORDER, ALL MINE

1. **"Seating members around a head costs coverage."** Plausible, and I shipped
   on it. The label-only version **moves nobody** and G1 went red anyway, so this
   was a story, not a mechanism.
2. **"BohemiaTies and whoHears disagree."** M5 said cross-outfit ties 0 while
   whoHears returned 2 lines, and I could not explain it — **so I pulled a
   correct change out of main over it.** `whoHears` is a **three-hop BFS** that
   explicitly treats a step through home or work as the crossing; a line through
   an unaffiliated neighbour needs no direct cross-outfit tie. **The false premise
   was in my claim.** M5 is fixed on main.
3. **"Overwriting `home.building` is harmless."** It is not — `bohemia_agents`
   keys off it, so the household id **reshuffled who is affiliated**: still 33
   people, a *different* 33, none near the spawn. **The rate survived and the
   identities did not**, which is exactly why it stayed invisible: the headline
   number looked unchanged.

## 4. WHAT IS ACTUALLY KNOWN, MEASURED

| | without households | with (label-only) |
|---|---|---|
| people who know nobody | 199 of 298 | **139 of 298** |
| whoHears lines in the valley | 0 | **2** |
| households (mean) | 298 (1.00) | 230 (1.30) |
| faction_arc | 91/0 | 93/1 — **G1 red** |

The win is **real**: before this, `whoHears` answered NOBODY for every outfit, so
*WHO WILL HEAR*, *AND IT COSTS YOU* and tertius **dolens** could never fire and
**every commitment in the game was free.**

**G1 is real too, and its cause is #3 above, not #1.** Fixing it means giving the
household its **own field** instead of overwriting `home.building` — started, not
verified, and not shipped.

## 5. THE LESSON THAT COST THE MOST

> **A GREEN CLAIM IS NOT A TRUE CLAIM WHEN BOTH SIDES ARE ZERO.**

M5 was an implication whose antecedent had never once been satisfied. It reported
itself as passing for days without ever having been tested, and the first time it
fired it was wrong — and it was believed, because it had a long green history.
Same family as a mutation that never applied and a sweep that measured one lucky
sample: **three shapes of untested-but-green in one week, and this is the one that
reached far enough to undo shipped work.**

---

Ruling: Paolo 8/21, "people share houses yes bro" — **stands, unbuilt**
Branch: `claude/factions-ovkjpf` · Gate: `faction_arc_gate.js` G1, M5

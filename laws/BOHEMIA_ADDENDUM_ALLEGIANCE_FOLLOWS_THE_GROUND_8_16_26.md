# BOHEMIA ADDENDUM — ALLEGIANCE FOLLOWS THE GROUND (8/16/26, FACTIONS lane, LOCKED)

## 1. TWO BUGS IN THE SAME FUNCTION, AND ONE OF THEM WAS MINE

`bohemia_agents.factionOf()` decides who in the valley runs with whom. It had
two defects that had never been measured because both fail *silently and
plausibly* — the wrong answer looks exactly like an honest "they run with
nobody".

### 1a. HALF THE VALLEY'S COMMUTE WAS BEING THROWN AWAY

`jobCell()` mapped four bearings:

```js
var d = {N:[0,-1], S:[0,1], W:[-1,0], E:[1,0]}[j.dir];
```

That was correct for its only original producer: `jobsNear()` scans a **cardinal
ring** and can never emit a diagonal. Then, on 8/15, **I** made the city's
adapter pass through `workDir` from `bohemia_population.personFields` — the 7/31
address book — which draws from **eight** directions.

**Measured: 49% of the valley draws a diagonal**, and every one of them fell
through the lookup to `null`.

What that silently cost: `factionOf` uses `jobCell` as its **second origin** —
the 8/11 ruling that *you run with whoever your living depends on, not just
whoever is nearest your bed*. For half the valley that ruling was not running at
all. A missing key here reads exactly like an unemployed person, so nothing
anywhere went red.

**FIXED, STRICTLY ADDITIVELY:** the four cardinal answers are byte-identical
(gated), so the run's roster cannot move; the four diagonals go from `null` to a
real cell. Valley affiliation 27 → 31, outfits 10 → 11.

### 1b. ALLEGIANCE IGNORED DISTANCE ENTIRELY

The pick was **uniform over everything in reach**:

```js
near.sort(alphabetically);
return near[pickRoll % near.length].name;
```

So somebody living **next door to the Church** was exactly as likely to run with
a **Cartel twelve cells away**. Allegiance was a coin flip over whoever happened
to be inside the radius, and the radius was the only geography in it.

**KALYVAS 2006, *The Logic of Violence in Civil War*:** territorial control is a
**continuum, not a radius**, and **collaboration follows control** — the
population's alignment tracks who actually holds the ground it stands on.

So the draw is now weighted by distance, linearly, off `REACH_CELLS` itself:
`weight = REACH_CELLS + 1 - d`. **No new dial** — that is his own number and
nothing else — and a base at the very edge of reach keeps a real, small share
rather than being cut off.

**MEASURED ON THE WALKED SURFACE:** standing on a base, **11 of 16 affiliated
people (69%) run with that outfit**. And the Mob and Network bases sit 12 cells
apart, so their territories overlap and you find **both** outfits on that ground
— a contested zone appearing out of the geometry rather than being authored.

## 2. THE GATE CLAIM I HAD TO REWRITE, AND WHY THAT IS NOT CHEATING

`faction_membership_gate` asserted:

> EVERY FACTION IN REACH GETS A REAL SHARE … no faction over 45%, none under 20%

measured across bases at **2, 8 and 12 cells** from the test block. That claim
was written to catch a **correlated-hash bug** that had twice given one faction
63% and 48%. It was right while the pick was uniform.

Under distance weighting an uneven split across unequal distances is the
**correct** answer — so the old claim would have forbidden the fix. **A GATE MUST
NEVER OUTRANK A RULING (8/1), and it must never outrank a measurement either.**

The rewrite keeps the thing it was really for and adds the thing that is new:

- **hash fairness is measured at EQUAL distance**, where any imbalance can only
  come from the draw. Result: 34.1% / 33.5% / 32.4%. The original 63% bug would
  still be caught.
- **a new claim locks the new behaviour**: the base you stand on takes more than
  3× the one at the edge of reach…
- **…and another locks that the far one is never cut off**, because the edge of
  reach is still reach.
- **and one asserts the unequal-distance split IS uneven**, so nobody
  "restores" the old claim later without seeing why it went.

## 3. THE LAW

**1. A LOOKUP TABLE MUST COVER ITS PRODUCER'S FULL RANGE.** If one module emits
eight values and another maps four, the gap is invisible until somebody counts.
When a consumer's table is narrower than its producer's alphabet, that is a bug
even while every existing caller happens to be safe.

**2. AN ANSWER THAT IS ALSO THE ERROR VALUE MUST BE MEASURED, NOT TRUSTED.**
`null` from `jobCell` means "no job" and it meant "I cannot read your bearing",
and those must never be the same value without something counting them. Third
time this class has cost this lane a silent outage.

**3. GEOGRAPHY DECIDES ALLEGIANCE, NOT A RADIUS.** Anything that models control
decays with distance. A hard edge where a property switches off is a placeholder,
not a world.

## 4. WHAT IS STILL TRUE AND STILL NOT MINE

Neither fix moves the reachability finding: from the spawn cell (48,48) the
nearest **1,438 people still include zero** who run with anybody, and the first
affiliated person is still **9 cells** away. Both fixes change *who* and *how
well*, not *where the bases are* — that is MAP LAW, and `REACH_CELLS` /
`AFFILIATED_RATE` remain [PENDING Paolo]. Routing the demo past an outfit is
QUESTS/RUN.

## 5. THE MACHINE

`gates/faction_membership_gate.js`, 60 claims (was 55): the draw is fair at equal
distance, allegiance follows the ground, the far base is never cut off, the
uneven split across unequal distances is asserted rather than forbidden, all
eight bearings resolve, and the four cardinal answers are byte-identical.

# THE MAN WHO GAVE YOU THE JOB NEVER FOUND OUT HOW YOU DID IT
## 8/30/26, FACTIONS lane

TAB: **RUN** (the demo's only screen). Play the day, resolve the job, then open
the ⚔ OUTFIT board or read the card of anybody who runs with that outfit.

---

## 1. THE MEASUREMENT THAT MADE THE TURN

Taken on `slices/BOHEMIA_DEMO.html` — **the file a stranger actually gets**, not
the workshop:

```
34   people within six cells of the spawn        0 affiliated
61   people loaded in the whole valley           0 affiliated
30   cells to the nearest faction base
```

So a demo player could do the Trades' job perfectly and the Trades would never
hear of it. Everything this lane shipped on 8/27 and 8/28 — the outfit's view of
you, the quest deeds, the card, the OUTFIT board — was **unreachable in the
demo**. That is not a faction being unimpressed. It is a system nobody can reach.

**Measuring the demo rather than the bench is the whole reason this was found.**
The UI lane's 8/30 turn is the precedent: twelve of thirteen controls were under
the thumb minimum *on the demo* while the workshop looked fine.

---

## 2. HIS FILES ALREADY SAID WHO IS IN THE SCENE

```
@ROLE lineman  REQ  faction=TRADES   block=browned
@ROLE fixer    OPT  faction=NETWORK  met_before=false
```

**53 of the 66 `@ROLE` lines** across `quests/bq` carry an authored faction. He
has already written which outfit every quest character runs with.

`REQ` is not decoration: `bohemia_bq.js` **fails the build** on an unfilled REQ
role ("An unfilled REQ role fails the WHOLE quest silently. Bethesda shipped a
debug flag for this; we fail the build."). And `block=browned` binds the lineman
to the very block the job happens on. **A required character bound to the place
is in the scene.**

And the casting layer already existed and already works. Measured:

```
origin for `lineman`  = the Trades' own ground
380 people around it, 109 of them Trades
both roles filled: a real Trades lineman, a real Network fixer
```

`ctDayCast` had been casting his roles onto real people all along. **Nothing had
ever made them witnesses.**

---

## 3. WHAT SHIPPED

When a quest stage resolves, its **required** cast witness it, with the outfit
stamped on their mind the same way `ctWitnessPass` stamps it. Proved on the demo:

```
before   members 0, whoSaw 0, rung null
publish  witnesses 1
after    value 0.8, rung NEUTRAL, members 1, whoSaw 1
why      "watched it: Handed the tap to the trades. Daylight patch,
          every name on the work order."
```

That last line is **his own `@LOG` sentence**, on a card, in the demo.

### Why this is not the karma it replaces

The 8/28 rule is that a faction learns nothing it did not witness, and that
stands. This does not widen it to the valley — it adds **exactly the people his
own file marks REQUIRED for the scene**. Optional roles are not added: you may
never have met them, and a faction learning through somebody the player never
encountered is precisely the omniscient karma this all replaces.

### What I did not do

`engine/bohemia_agents.js` states its own honest limit: the job-site widening
"does NOT rescue a block 20 cells from everything — that is a fact about the
map, and papering over it here would be fitting the world to a screenshot."
That is right. **No base moved, no map touched**, `AFFILIATED_RATE` (0.30) and
`REACH_CELLS` (12) remain [PENDING Paolo].

---

## 4. TWO BUGS, BOTH MINE, BOTH FOUND BY PROBING THE REAL SURFACE

**A. I read the cast one level too shallow.** `ctDayCast` returns
`{ q, day, cast:{role -> person} }`. I read `cast[role]`, found nobody, and
published `witnesses:0` — **the same answer as "there is no cast"**, which is
exactly the ambiguity this feature exists to end. A direct `castAddresses` call
had been filling both roles the whole time.

**B. I stamped the quest's spelling on the mind.** The cast entry carries the
role's *required* faction, `TRADES`; every mind in the city is stamped with
`ctFactionOf`'s answer, the canon id `Trades`; and `standingOf` compares those
**strictly**. So the deed landed, `witnesses:1`, and `whoSaw` stayed `0` — the
faction filtered its own brand-new witness straight back out.

Same case gap as `publish()` had, one layer up. Fixed with `ctCanonFaction`, and
**the fix belongs at the stamp, not in `standingOf`**: both sides of that compare
are city ids by construction, and loosening it would only hide the next
mis-stamp. `ctCanonFaction` answers `null` for a name no outfit has, so a typo in
a quest stays visible instead of quietly becoming somebody.

---

## 5. GATES

```
FACTION BETWEEN   149 passed, 0 failed   (was 137)
THE WHOLE DEMO     23 / 0
DEMO BUILD         25 / 0
ALPHA LOADS        20 / 0
FACTION ARC        91 / 0
STANDING           35 / 0
CITY BARKS         13 / 0
```

Gate S runs **on the demo file**, and does what the splash does (taps the real
RUN tab) because the demo has no tab bar.

**S4 asserts the premise rather than remembering it:** the demo player can reach
zero affiliated people on their own and the nearest base is 30 cells. If that
ever stops being true, the reason for the cast-witness goes away and a red gate
should say so rather than a record nobody re-reads.

**Three mutations, all bite:**

| mutation | dies |
|---|---|
| stop making the required cast a witness | S6, S7, S8 |
| stamp the quest's spelling instead of the city's | S7, S8 |
| drag optional roles into the scene too | S11, alone |

`dayloop_gate` is 57/2 and **that predates this** — verified by running it
against origin/main's own city, which gives the identical 57/2.

---

## 6. WHAT I FOUND AND DID NOT FIX, NAMED SO IT IS NOT INVISIBLE

- **The demo draws one person at a time.** `maxDrewAtOnce: 1` over a walk, with
  34 people within six cells. The draw loop has no cap, so this is the city
  reading as empty, not a faction bug. That is playtest-dispatch item 5 ("the
  city is dead and DEAD IS NOT THE DEFAULT") and it belongs to RUN/WORLD. It
  also caps every witness set in the game at one person, which is worth somebody
  taking seriously.
- `BohemiaStanding.inherit` / `legendOf` — the dynasty handoff. Still dead, still
  needs a story moment the demo does not have, and the top of CLAUDE.md has an
  open [PENDING PAOLO] on whether the dynasty lives at all. Not for a session to
  resolve in passing.

---

## 7. WHAT IS PENDING HIM

Nothing new. `AFFILIATED_RATE` (0.30) and `REACH_CELLS` (12) stay his. The
STANDING dial in **DIRECT** still overrides anything he wants and still lands on
top of his quest corpus rather than erasing it.

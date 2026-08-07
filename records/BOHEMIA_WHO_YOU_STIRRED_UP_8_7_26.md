# BOHEMIA — WHO YOU STIRRED UP
### 8.7.26 — FACTIONS lane. The third quest effect, authored since 7/25, parsed correctly, and read by nothing. Same disease as the clout tags on 8/6, one layer up: this one is how factions move on each other, not on you.

---

## THE HOLE

`engine/bohemia_quest_runtime.js` line 117 has done this since 7/25:

```js
case 'faction_posture': if(p[1]) s.posture[p[1]]=(s.posture[p[1]]||0)+num(p[2]); break;
```

It parses correctly. It writes to a real field. **Nothing has ever read that field.**

Meanwhile the world bridge in `bohemia_loop.js` carried the other two quest effects all
the way to the real `FactionWorld` — standing (`@DO faction TRADES +8`) and territory
(`@DO advance_territory`) — and walked straight past this one.

**Seventeen authored rulings**, across the canon corpus, going nowhere.

## POSTURE IS NOT STANDING, AND THE CORPUS SAYS SO — I DIDN'T DECIDE IT

The question that had to be answered before anything could be built: does
`faction_posture X +1` mean "X's feeling toward the player"? If so it duplicates
`@DO faction X ±N` and the whole thing is redundant.

His own files answer it. There are authored stages that write **both, on the same
faction, in the same breath**:

```
@STAGE 33 COMPLETE #reckless          (S17 — The Seed That Does Not Come Back)
  @DO faction CARAVANS -15            <- what they think of YOU
  @DO faction_posture CARAVANS +1     <- something else entirely
```

`S13_THE_PAPER_THAT_SAYS_SO` stage 33 does the same on REDS. If posture meant "toward
the player," those would be duplicate lines. They are not. Read against the quest that
carries it — *"a public humiliation of one is a real faction event"* — posture is **how
mobilised that faction becomes**: agitated, hardened, moving.

And the direction is his too. **Every single authored value is +1 or +2.** Nobody has
ever written a faction *calmer*. The gate fails if a negative appears without a corpus
line behind it.

## WHAT MOBILISATION MEANS IN THE MODEL WE ALREADY HAVE

`Faction.quota` is already defined, in the engine's own words, as *"districts it WANTS
to hold"*, and it is already the appetite term `scoreClaim()` reads. A stirred-up
faction wants more ground.

So posture **moves the knob that already exists**. No new field, no new module, no
second appetite system, and the territory AI is not rewritten by one line.

**GROUNDED, and this is the escalation literature rather than a game feel.** The spiral
model of conflict holds that groups escalate in response to *perceived* hostility, and
the reciprocal-escalation evidence is that hostility from one side reliably raises the
other's — a self-reinforcing cycle rather than a slope. Which is why this belongs on the
same clock as the rest of the quest bridge and not on a timer: a faction hardens because
something **happened**, and the quest author already said what and how much.
Sources: [Escalation of Conflict: The Spiral of Hostility](https://polsci.institute/conflict-resolution-peace-building/escalation-of-conflict-spiral-of-hostility/) ·
[Reciprocal escalation of violent extremism (Denmark, longitudinal + experimental)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12673851/) ·
[Glasl's nine-stage model of conflict escalation](https://www.law.uh.edu/blakely/advocacy-survey/Conflict%20Escalation%20Glasl.pdf) ·
[Destructive Escalation, Beyond Intractability](https://www.beyondintractability.org/essay/escalation)

## THE PACING LAW IS UNTOUCHED

Paolo 7/24: factions are **not at war 24/7**; a faction's turn fires when the narrative
calls for it. **Appetite is not a turn.** A posture line changes what a faction would
reach for the *next* time a round is called — it moves not one district on its own.
`advanceRound` still fires only on an explicit `@DO advance_territory`.

The gate measures this rather than promising it: run a posture quest, assert the owner
map is byte-identical afterward.

## WHAT IT ACTUALLY DOES TO THE VALLEY

Same seed, same map, same faction AI, same 12 rounds. The only difference is whether his
rulings were applied:

```
18 of 32 districts came out under a different flag.

Network     1 -> 6   (+5)      the corpus stirs it up more than anyone: +1 +1 +1 +2
Reds        1 -> 5   (+4)
Blues       1 -> 3   (+2)      Cartel 1 -> 3   Remnants 1 -> 3
Caravans    1 -> 2   (+1)      Mob 1 -> 2      Trades 1 -> 2
Anarchists / Church / Colorful / Custom / Homeless / Volunteers ... 1 -> 1, unmoved
```

**The factions with no posture rulings do not move at all.** The map redraws itself
entirely out of content he already wrote — and the biggest winner being the Network is
lore-consistent with his 8/2 ruling that the Network is the Amalgamation's pawn.

## THE CANON CONTRADICTION, NAMED RATHER THAN DODGED

`laws/BOHEMIA_ADDENDUM_BUILD_THE_WORLD_7_31_26.md` says, in his words:
*"NO FACTION SHIT EITHER!"* — and the ruling under it reads **"FACTIONS ARE OFF. No
standing ledger, no territory model, no faction beats."**

That law is still live and there is **no written lift of it in `/laws`**.

But it is also **older than his current direction.** This session was opened by him with
the single word `factions` (which, per the AUTONOMY DOCTRINE, names the lane and means
GO), and mid-session he said *"lets do some faction shit"* and, three turns running,
*"do what you have to do next... then execute."* Under the TRUTH HIERARCHY the newest
ruling wins, and under Paolo 8/1 **a gate must never outrank a ruling.**

So the honest position, stated plainly rather than buried: **I built this on his current
verbal direction, over a written law he has not formally retracted.** What made that
sit right rather than being a legal-way-to-ship-a-frozen-thing (which STOP PRODUCING
names as itself the violation):

- **No new faction machinery was created.** No file matching `bohemia_faction*.js` — the
  footprint `build_the_world_gate.py` froze is untouched and still shrinking-only. The
  change is nine lines inside an existing bridge function.
- **Nothing was authored.** Every number is a line he already wrote. The mechanism reads
  his files; it does not add a table.
- **It is visible.** The 7/31 law's actual complaint was that the lane went into
  invisible plumbing — *"a turn in this lane that has nothing to look at is a turn that
  missed."* This ships a page.

**[PENDING Paolo, one word]** — whether the 7/31 faction freeze is formally lifted. If he
says no, this is nine lines to revert and the record explains itself. If yes, the
addendum gets written and `build_the_world_gate.py` should be told.

## WHAT HE CAN LOOK AT

**LIFE tab → WHO YOU STIRRED UP.** Nothing to tap. Both valleys, the cells that changed
hands outlined, who gained and who lost, and all 17 rulings with the quest each came from.

Honest about what it is: **a recording of a real run.** Both valleys were built by the
real `boot()` and advanced by the real `advanceRound()` in node, then drawn. The engine is
far too heavy to inline into a phone page — which is exactly what the 8/6 PAYLOAD WALL
was about — so it is not a mock-up and not a re-implementation, and the page says so on
itself.

## THE GATE CAUGHT ME FIRST

Worth recording because it is the system working. The first version of
`faction_posture_gate.js` drove the bridge through an export that does not exist. Nothing
ran — and the claim **failed** rather than passing vacuously, because it was written as a
measurement of the world ("the quota moved") instead of a measurement of the code ("the
function was called"). It was rewritten to drive the real route the existing bridge tests
already prove: boot, start a quest, walk a real dialogue choice to completion.

---
*BOHEMIA — Who You Stirred Up — 8.7.26*
*Standing is what they think of you. Posture is what it made them do about everybody else.*

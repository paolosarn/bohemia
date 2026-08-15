# BOHEMIA ADDENDUM — THE WALL, AND WHO FINDS OUT (8/15/26, FACTIONS lane, LOCKED)

## 1. WHAT WAS WRONG

On 8/12 this lane shipped a five-rung ladder — stranger, showed up, useful,
counted, inside — and **you could climb the whole thing by pressing one button
ten times.** Nothing stopped you, nothing noticed, and no other outfit in the
valley ever heard about it.

A ladder with no wall is a progress bar. A progress bar is not a decision.

## 2. THE MECHANISM WAS ALREADY BUILT, APPROVED, AND UNCALLED FOR TWENTY DAYS

`engine/bohemia_resolve.js` `makeCeiling()` — Paolo APPROVED it on 7/26
(`records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt`):

> "CEILING — a cap that only moves on a COMMITMENT, never on more points, with
> neglect allowed to grow as you get closer."
> "APPROVE unlocks volume: the owning lanes may now adopt these without asking
> again."

Zero callers, verified by sweep rather than assumed. **This module CALLS it**
rather than writing a second clamp — two clamps is the two-systems-disagreeing
bug this lane has now fixed five times. The gate proves the adoption by
DELETING the dependency and asserting a refusal, because every other check would
still pass if a private fallback clamp existed.

## 3. THE FOUR THINGS THE VERDICT PARKED, AND WHY NONE IS INVENTED HERE

The 7/26 verdict parked "(d) THE STANDING LADDER. The faction states, where each
wall sits, what commitment moves it, and what neglect costs at each rung." Read
as one blob it says *build nothing*. Split into its four parts, three were never
numbers:

| part | answer | where it came from |
|---|---|---|
| the faction states | a SHAPE, not a number | his own approved sentence names two acts: "taking a side, burning a bridge" → three states |
| where each wall sits | DERIVED | each commitment buys exactly one more rung, computed from the shipped gated `RUNGS` table; **not one number is typed** |
| what commitment moves it | his words again | same sentence |
| what neglect costs | **the only real number** | EVERYTHING COSTS ONE (Paolo 8/15, LOCKED) — 1 per stage, tagged `placeholder`, enumerable |

TRUTH HIERARCHY: 8/15 is newer than 7/26 and the newest date wins. Nothing here
decided a number; one law answered the only one, and the rest were never numbers.

## 4. THE RESEARCH, BECAUSE THE WALL ALONE IS JUST A GATE WITH EXTRA STEPS

What makes committing a DECISION is that it is visible to people not in the room.

- **PORTES 1998**, *Social Capital: Its Origins and Applications in Modern
  Sociology* (Annu. Rev. Sociol. 24:1–24). The four dark sides: exclusion of
  outsiders, **excess claims on group members**, restriction of individual
  freedom, downward levelling norms. Being inside is a relationship with
  obligations, never a prize you collect.
- **BURT / SIMMEL, TERTIUS GAUDENS** — "the third who benefits." Spanning a
  structural hole between two disconnected outfits is a real advantage.
- **TERTIUS DOLENS** (*Organization Science*, 2024) — "the third who **suffers**."
  When the two sides you span are connected and in conflict, the identical
  position costs you instead. Same standing, opposite sign. This is the
  correction that makes brokerage a game and not a free lunch.
- **LIPSET & ROKKAN 1967 / COSER 1956 / DAHRENDORF 1959, CROSS-CUTTING
  CLEAVAGES** — when opponents on one dimension are allies on another,
  polarisation drops. `bohemia_ties` already carries three foci (home, work,
  faction), so a home or work tie IS a cross-cut against the faction split.

## 5. A BRANCH THAT COULD NEVER FIRE, AND WHY IT IS WRITTEN DOWN

The first landing rule split news into cross-cutting (soft) and reinforcing
(hard), straight out of the cleavage literature. Run on a real roster,
**`reinforced` could not fire once** — a faction focus only ever links two
people in the SAME faction, so no path crosses a faction line without stepping
through a home or work tie. **Every bridge between two outfits is cross-cutting
by construction.**

That is Feld 1981 being right, not a bug to patch around. But a mechanic that
can never fire is the authored-but-unread disease, so the label moved to the
thing that actually varies — DISTANCE (one hop is a witness, further is a
rumour: Granovetter 1973) — and **the cross-cutting property is now asserted by
the gate as a theorem** instead of pretended to be a dial.

## 6. THE THING THIS TURN ACTUALLY FOUND, AND IT IS BIGGER THAN THE FEATURE

Building the wall meant asking a question nobody had asked on the real surface:
**how many people in the city actually run with anybody?**

**ZERO.** Not few. None, ever, anywhere. Measured: 166 people across 40
locations, then all 56 people standing on all 14 faction bases in turn.

Two failures stacked so neither showed:

1. **THE CITY CARRIED A 7/29 SNAPSHOT OF `engine/bohemia_agents.js`** under a
   banner reading "inlined VERBATIM". It was verbatim on 7/29. The faction half
   of that module (`factionOf`, `normalizeBases`, `jobCell`, `AFFILIATED_RATE`,
   `REACH_CELLS`) was written on 8/11, **thirteen days later**, and the snapshot
   never moved. ENGINE SYNC LAW says one canonical body per module; this was a
   fork nobody could see.
2. **THIS LANE'S OWN BRIDGE SWALLOWED THE EVIDENCE.** `ctFactionOf` was
   `try { ... } catch(_e){ return null; }`. A bare catch returning null turned
   "this module is thirteen days stale" into "nobody in Las Vegas runs with
   anybody", silently, forever. **Null was already a real answer here** — most
   of the valley belongs to no outfit — which is exactly why it must never also
   be the error answer.

**AND THE GATES AGREED WITH ME INSTEAD OF WITH THE GAME.** `walked_surface_gate`
part C proves a Church member's card carries his canon — by **stubbing**
`window.ctFactionOf` to return `'Church'`. Every faction claim this lane has
made about the walked surface was true about a stub.

> **A TEST THAT MOCKS THE BROKEN THING CANNOT SEE THAT IT IS BROKEN.**
> I mocked the dependency instead of asserting it existed. That is the lesson,
> and it belongs beside "a checker that cannot tell a mention from a use is the
> broken one" (8/1).

## 7. THREE MORE BUGS THE GATE FOUND, NOT A PERSON

- **THE CARD WAS LYING.** With five acts done and nothing committed it read
  "1 MORE TO COUNTED". One more does nothing. The ladder half could not see the
  wall half; the wall answers first now.
- **ALLEGIANCE WAS A FACT ABOUT WHERE *I* WAS STANDING.** `ctFactionOf` passed
  `ctCell()` — the PLAYER's cell — so walking one cell east could change who
  somebody runs with. It uses their own cell, off their own home, now.
- **THE "VALLEY" FOLLOWED THE PLAYER.** The roster walked ±10 neighbourhoods
  around `hx,hy` and cached that, so standing near the map edge when the cache
  was built gave a 119-person valley with one affiliated body. The valley does
  not move; the walk is the whole fixed grid from a fixed origin now.

## 7b. AND I OVERWROTE A SHIPPED MODULE DOING IT

This organ was first called `bohemia_standing.js`. **`engine/bohemia_standing.js`
already existed** — shipped 8/2 by the PEOPLE lane, gated 35/35, with a commit
titled **"WORD TRAVELS"**. It is a witness-based reputation organ built on
`bohemia_memory`: deeds are seen not announced, opinions are derived from
decaying memories (which buys redemption for free), hearsay costs a penalty per
hop and dies at a hop limit, and a faction's view is its members' views with no
ledger anywhere.

**I overwrote it, and its gate, and only found out because `git status` said
`M` where I expected `??`.** Both restored from git the same turn; the original
gate passes 35/35 untouched.

My generator's own REUSE CHECK block said the duty was "do not build a second
one" — and then swept for a *caller of `makeCeiling`* instead of asking the only
question that mattered: **does a module for this already exist?** A reuse check
that greps for the thing you are about to use, rather than the thing you are
about to build, is decorative.

**THE BOUNDARY, so nobody builds a third:**

| module | question it answers |
|---|---|
| `bohemia_standing.js` (8/2, PEOPLE) | **what people THINK of you** — deeds they personally saw, fading, retold at a cost |
| `bohemia_commitment.js` (8/15, this) | **how far IN you are with an outfit** — the ceiling on what turning up buys, and who can see you declare |

Different questions, but they overlap on the words "standing" and "word
travels", and **both now carry a `RUNGS` table**. FLAGGED FOR CONSOLIDATION —
not merged blind on the turn I found it.

## 8. THE LAW

**1. A LADDER GETS A WALL, OR IT IS A PROGRESS BAR.** Repeating one act must run
out of road. What passes the wall is a COMMITMENT, never more of the same.

**2. THE CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER.** Where the wall
is, what it blocks, what passes it, and who will hear — all on the card before
you press. *A consequence you discover afterwards is a trap. A consequence
printed next to the button is a decision, and that difference is the whole
distance between hardcore and unfair.*

**3. NULL IS NEVER THE ERROR ANSWER WHEN NULL IS ALSO A REAL ANSWER.** A bare
catch over a cross-module call is banned where the fallback is indistinguishable
from valid data. A missing dependency says so, once, loudly.

**4. A GATE MAY NOT MOCK THE DEPENDENCY IT IS THERE TO PROVE.** If a probe needs
a faction, it walks the world and finds a real one, or it fails and says the
world has none.

**5. ONE CANONICAL BODY, AND THE INLINE COPIES ARE RE-DERIVED BY A TOOL.** An
inlined engine module is refreshed by a re-runnable patch tool, never
hand-pasted with a date in the banner.

**6. A REUSE CHECK ASKS WHETHER THE THING YOU ARE BUILDING EXISTS, NOT WHETHER
THE THING YOU ARE USING EXISTS.** Before a new `engine/*.js`, list the directory
and read any file whose name is close. `git status` showing `M` on a file you
believe you just created is a STOP, not a curiosity.

## 9. THE MACHINE

`gates/standing_gate.js`, 47 claims:

- **A** — the wall is the APPROVED one: the dependency is deleted in a child
  process and a refusal demanded; every ceiling is re-derived from the shipped
  `RUNGS` and compared; the clamp bites; only a commitment passes it; neglect is
  tagged and enumerable.
- **B** — word travels only where there is a line: the structural hole holds, a
  shared roof leaks at one hop, distance turns fact into rumour, **the
  cross-cutting theorem is asserted**, and the answer discriminates at three
  scales rather than being all-or-nothing.
- **C** — the broker's sign flips on the graph, not on an opinion about who
  hates whom.
- **D** — the real city in a real browser, **with no stub**: real people run with
  real outfits, the wall reads, who-will-hear reads, committing moves the state.
  D10/D11 lock the measured shape of the valley so it can never silently fall to
  zero again.
- **E** — the organ is generated and the anchors still resolve; a stale citation
  makes the generator REFUSE.

## 10. WHAT IS THIN, NAMED SO NOBODY CLAIMS IT

Measured on the walked surface after the fix: **298 people, 27 affiliated across
10 outfits, 3 of those 10 with any line to another.**

Affiliation is 9%, not the 30% `AFFILIATED_RATE` names, because most cells are
further than `REACH_CELLS` (12) from any base. **That is a MAP fact and a
[PENDING Paolo] dial, and neither is this lane's to move** — MAP LAW: Claude
never designs map layouts. The seven outfits with no line out are genuine
structural holes, which is a real result in a shattered valley and reads as one
on the card ("NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM"). Stated
rather than tuned, because tuning it would mean inventing density.

# RESEARCH — THE SAVE SURVIVES THE PHONE, NOT US (8/15/26, coordinator
# sweep 12 catch; doctrine §4b — both aisles, anti-yes-man, measured in
# our own build, and it corrects my own 8/14 audit)

## THE FALSIFIABLE QUESTION
The save is the most hardened system in this repo: two slots, generation
counters, FNV checksums, tombstones, poisoned-slot recovery, 40+ hostile-
browser assertions in gates/save_iphone_gate.js. Question: hardened
against WHAT? It was built against a hostile browser. What happens when
the threat is US — when a lane changes the shape of the state next
Tuesday and a playtester opens a world saved last Tuesday?

## THE MEASUREMENT, AND IT IS A PHANTOM IN THE ONE PLACE FAILURE IS FINAL
1. THE MIGRATION MACHINE EXISTS AND IT IS GOOD. engine/bohemia_engine.js
   carries `const CURRENT_SAVE_VERSION = 7` and a full ordered MIGRATIONS
   chain — pure functions, one step each (v1->v2, v2->v3...), applied in
   order until the save reaches current. Its own doc comments state the
   right discipline unprompted: "Adding a field = give it a default here.
   Renaming = copy old->new here (NEVER RENAME IN PLACE, keep old
   readable)." Somebody thought about this properly.
2. IT IS CONNECTED TO NOTHING. `CURRENT_SAVE_VERSION`, `MIGRATIONS` and
   `migrate(` appear ZERO times in slices/BOHEMIA_CITY_WORLD.html (the
   surface he actually plays) and ZERO times in engine/bohemia_save.js
   (the storage layer that writes the bytes).
3. THE VERSION NUMBERS ALREADY DISAGREE. The city stamps `v:1`. The save
   module carries `V = 2` and writes `v:1`. The engine believes the world
   is at 7. Three components, three answers, no authority.
So the single system whose failure is UNRECOVERABLE — a dead save is not
a bug you retry, it is somebody's world gone — is the one running with
its safety mechanism unplugged. Every other phantom this month cost us
dormant features. This one costs a stranger their game.

## THE TIMING IS THE POINT (why this is urgent and not merely true)
- THE CLOSED PLAYTEST IS IMMINENT (records/BOHEMIA_CLOSED_PLAYTEST_
  PROTOCOL_8_11_26.md: friends round, instrumented, then fresh eyes).
  Their saves must survive the days between their sessions and OUR
  pushes, or the feedback dies with the worlds.
- THE SITE AUTO-DEPLOYS. Measured 8/6: the lanes push to main roughly
  every THIRTEEN MINUTES, and Pages redeploys. So the shape can change
  under a live player between one session and the next, without anybody
  intending a "release". WE ARE A MORE FREQUENT THREAT TO THE SAVE THAN
  iOS IS, and iOS is the one we built the armour for.
- ELEVEN MONTHS OF SCHEMA CHANGE ARE AHEAD, plus the REWIND, whose ring
  buffer is explicitly made of the same state snapshots.

## AISLE 1 — GAMES: THE BIGGEST GAME EVER MADE BUILT A WHOLE LIBRARY FOR THIS
Mojang's DataFixerUpper (DFU) is a dedicated open-source system whose
entire job is migrating Minecraft world data across versions. Its shape
is exactly the shape of the problem: SCHEMAS (typed descriptions of what
the data looks like at a given version) plus DATAFIXES (rewrite rules
between two schemas), composed by a builder into an optimised converter,
applied incrementally across many versions. Minecraft can open worlds
saved by builds from a decade ago. That is not sentiment; it is the
reason people keep worlds, and keeping worlds is why they keep playing.
THE LESSON FOR US IS THE SIZE OF THE COMMITMENT: the best-selling game in
history concluded that ordered, tested, incremental save migration
deserved its own library and its own maintenance forever. We wrote the
same idea in one file and did not call it.

## AISLE 2 — THE REAL WORLD: EXPAND / CONTRACT IS THE SETTLED DISCIPLINE
Backend engineering solved "change the shape without breaking what is
already out there" and named it EXPAND/CONTRACT (a.k.a. parallel change):
- EXPAND: add the new shape ALONGSIDE the old. Nothing is removed or
  renamed. Every change in this phase is backwards compatible.
- MIGRATE: move readers and writers over; for a period, BOTH shapes are
  written, so the new one is never behind.
- CONTRACT: only after the old shape is provably unused, remove it.
Each stage is independently deployable and reversible, and the discipline
makes "backward and forward compatibility non-negotiable design
constraints" rather than good intentions. Our own engine comment already
arrived at the core rule ("never rename in place") — we simply never made
it a practice with a machine behind it.

## THE CHALLENGE FINDING (against a belief I helped write)
MY OWN 8/14 DEMO STATUS BOARD MARKED ROW 6 — SAVE DURABILITY — **CLOSED**.
That was wrong twice over, and the second one is the interesting one:
1. It was not even closed on its own terms. This week a lane found "THE
   CITY COULD NOT TALK TO THE SHELL: the autosave has never arrived" and
   "THE CITY WAS NEVER INTRODUCED TO ITS OWN SAVE." The storage layer was
   immaculate and the message never got to it — the two-surfaces disease
   again, in the save.
2. DURABILITY IS NOT COMPATIBILITY, and my audit only checked the first.
   I verified that the bytes survive the browser. Nobody asked whether
   the bytes survive US. A save can be perfectly persisted, checksum-
   verified, restored from the older slot — and still be unreadable
   because we renamed a field on Tuesday.
The general form, and it is the fourth instance this month: WE KEEP
VERIFYING THE LAYER WE BUILT AND NOT THE PATH THE PLAYER TAKES.

## THE DECISION / WORK ORDER (routed to RUN; before the friends round)
1. ONE VERSION, ONE AUTHORITY: reconcile city `v:1`, save `V=2` and
   engine `CURRENT_SAVE_VERSION=7` into a single number the writer stamps
   and the reader checks. Three answers is the bug.
2. WIRE THE CHAIN: the playable load path runs MIGRATIONS to current
   before handing state to the game. The machine exists; connect it.
3. EXPAND/CONTRACT BECOMES THE STANDING RULE for any state-shape change,
   fleet-wide: add alongside, default the new field in a migration, never
   rename in place (the engine comment already says it), remove only when
   provably unread.
4. THE GATE THAT MAKES IT REAL — SAVE FIXTURES: check in a corpus of real
   save blobs, one captured from each shipped build, and assert THE
   CURRENT BUILD OPENS EVERY ONE. This is how DFU is kept honest, and it
   is the only version of this that cannot rot: the corpus grows by
   itself every ship, and a lane that changes the shape without a
   migration goes RED on somebody's real world, not a hypothetical.
5. CAPTURE THE FIRST FIXTURES NOW, before the friends round, so the
   playtest's own saves are covered from day one.
6. THE REWIND INHERITS THIS (laws/BOHEMIA_ADDENDUM_THE_REWIND_8_15_26.md):
   its ring buffer is made of these snapshots. In-memory buffers die on
   reload and are fine; anything persisted is not, and must migrate.

## CONFIDENCE
Our own wiring: read directly from the shipped files (zero references is
a grep, not a judgement), high. The version disagreement: read from the
three files, high. DFU's design and purpose: Mojang's own repository and
documentation, high. Expand/contract: standard, widely documented
engineering practice, high. The claim that a schema change WILL break a
playtester's save is a prediction, not a measurement — but it is the
default outcome of shipping shape changes with no migration path, which
is exactly what the greps show we do today.

Sources: github.com/Mojang/DataFixerUpper (README + DataFixerBuilder) and
minecraft.wiki/w/DataFixerUpper (schemas, datafixes, world upgrades);
blog.thepete.net/blog/2023/12/05/expand/contract-making-a-breaking-
change-without-a-big-bang (Pete Hodgson, parallel change);
xata.io/blog/pgroll-expand-contract and en.wikipedia.org/wiki/
Schema_migration (the three phases, backward/forward compatibility as
design constraints); plus our own engine/bohemia_engine.js migration
chain, gates/save_iphone_gate.js, and this week's lane commits acd7b85 /
0ff4947.

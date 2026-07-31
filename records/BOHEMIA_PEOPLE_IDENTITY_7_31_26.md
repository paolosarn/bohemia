# THE NEIGHBOURS ARE PEOPLE (7/31/26, PEOPLE lane — first session of the lane)

BACKLOG ITEM: PEOPLE 1, NPC IDENTITY MECHANISM. Source of truth:
records/BOHEMIA_THE_BIG_MISSING_7_29_26.md item 6, whose whole complaint is one
sentence: "28 scheduled bodies walk the block; none has a name, a face bound to
a schedule, a memory, or anything to say."

## WHY ITEM 1 AND NOT ITEM 0
PEOPLE 0 is THE DIALOGUE SYSTEM v1. It is already built and it is not this
lane's — the run has a full .bq dialogue runtime (engine/bohemia_quest_runtime.js
plus the run's own TALK sheet: speaker, portrait, says, choices, silences,
noverbs). REUSE-FIRST says find that before cooking, and it was there. What was
missing was the other half: the sheet only ever opened for the ONE quest speaker.
The 28 people living on the block could not be spoken to at all.

## THE ONE DISTINCTION EVERYTHING HANGS OFF
    an AGENT is a BODY.      Where it is standing, what it is doing this minute.
    a  PERSON is an IDENTITY. Who that is, forever.
bohemia_agents.js owns the body. Nobody owned the identity, so there was nobody
to remember.

AND THE BODY IS DISPOSABLE BY DESIGN. The run's own applyBlob() throws every
agent away on a save load and rebuilds them from the seed
(`agentsForBlock(SEED,feet,[],fpOf)` then re-steps to the saved turn). An
identity STORED on an agent dies every single time the player loads.

    THEREFORE: IDENTITY IS DERIVED, NEVER STORED. The same three numbers the body
    is derived from — (blockSeed, house, slot) — resolve to the same person on
    any device, on any load, forever. Persistence with nothing persisted.

That is the whole design, and it is why the meeting ledger is keyed by a derived
key instead of by an agent object.

## WHAT SHIPPED
- **engine/bohemia_people.js** — the identity layer. personOf / peopleOf /
  headingOf / seatLineOf / cardFor / workLineOf / dayLineOf / makeLedger.
  Pure, no DOM, node + browser.
- **The card, on the RUN tab.** Walk up to any scheduled body: the one button
  reads TALK TO THE SCAVENGER. Tapping it opens the run's existing dialogue sheet
  with that person's own face and six rows — NAME, LIVES, WORKS, RIGHT NOW,
  THEIR DAY, YOU HAVE MET. Every row is a fact the sim already knew.
- **HANG OUT was not deleted.** The neighbour branch used to be an anonymous
  HANG OUT (1 HOUR) — you spent an hour with "a neighbour" and never learned
  which one. The hour is now an option INSIDE the conversation, which is where
  hanging out with somebody belongs once you know who they are. Still exactly one
  verb; the one-button law is untouched.
- **A memory that survives the save.** How many times you have met each person,
  and on which world-days, riding in the run's existing save blob. Additive: an
  old save with no `met` key loads into an empty ledger, so no SAVE_ENV_VERSION
  bump — nothing about an existing save became invalid.
- **gates/people_gate.js** (registered as PEOPLE), 63 checks in three parts.
- **tools/bohemia_people_identity_patch.py** — the run wiring, idempotent and
  fully reversible (proved byte-for-byte both ways).
- **tools/bohemia_people_proof.js** — the ship shot, through the real alpha.

## WHAT IS HIS, AND IS EMPTY
Two tables ship empty and the gate fails if either gains a row:
- **NAMED_CAST** — who the valley's named people are. [PENDING Paolo]
- **LINES** — what anybody says when no quest is talking. This lane builds the
  MOUTH, not the words (doctrine section 6).
There is NO procedural name generator and the gate sweeps the module for a name
bank. bohemia_agents.js:24 has said since 7/19 that "character names are Paolo's"
and nothing has repealed it. So below the named tier a person is addressed by the
engine's OWN role word — WORKER / SCAVENGER / KEEPER / WATCH — and the card says
NOT NAMED YET in place of a name, because silence is honest and a placeholder
becomes canon by shipping.

Both tables are LOAD-BEARING, not decorative: gate claims A9 and A10 plant a row
and prove it would be used the moment he writes one.

## TWO REAL BUGS, BOTH FOUND BY THE GATE, BOTH MEASURED

### 1. HALF OF PAOLO'S TOWNSFOLK BODIES HAVE NEVER BEEN ON SCREEN
The alpha bakes RUN_LOOKS = 6 townsfolk bodies. The run draws every scheduled
body with `looks[agent.seed % 6]`.

    MEASURED OVER 528 BODIES ON 40 GENERATED BLOCKS:
      agent.seed % 6  reaches  0, 2, 4.      NEVER 1, 3 or 5.

Three of the six bodies Paolo's cast bakes have never once been drawn.

ROOT CAUSE, a JavaScript trap rather than a typo: bohemia_agents.js's hash ends
with `(h * 2654435761) >>> 0`. That multiply is float64 — h up to 4.3e9 times
2.65e9 is ~1.1e19, well past the 9.0e15 where a double stops being exact — so the
low ~11 bits are ROUNDED AWAY and every seed lands on a multiple of 512. Dead low
bits means `% smallNumber` is dead.

WHAT I DID NOT DO: fix that hash. It also decides which houses are occupied, how
big each household is, and every schedule in the valley. Changing it reshuffles
the entire population and breaks "the same cell is the same people" for every
save that exists. Its low bits are never used for anything small — this was the
only consumer. So the fix lives where the small modulus is taken: mix32() in
bohemia_people.js, on Math.imul, which is exact 32-bit. All six looks now appear.
Gate B9 keeps the ORIGINAL measurement red-able: if somebody puts the raw seed
back, B9 and B10 fail on the same numbers.

### 2. MY OWN: THE IDENTITY KEY WAS THE VALLEY'S, NOT THE BLOCK'S
Caught by part C's first real-surface run, and invisible headless. `SEED` in the
run is the whole world and it is literally 7; the people on a cell are built from
a per-cell mix of it. Keying identity off SEED gave house 3's second resident the
SAME KEY in every cell in the valley — one identity worn by hundreds of
strangers, and a meeting ledger that "remembers" people you have never met. The
block seed is the one that made these bodies, so it is the one that names them.
Gate claim C4b.

## THE GATE
`node gates/people_gate.js` — 63 checks, registered as PEOPLE.
- **A (12)** the tables are his and empty, no name bank, the empty state visible.
- **B (23)** identity derived and stable: two independent builds of a block agree
  on every key, look and heading; keys unique; another block is other people; the
  people survive the sim being thrown away and rebuilt; the card is a pure
  function of the world; the ledger round-trips through JSON.
- **C (28)** THE REAL RUN IN A REAL BROWSER at 390x844: out of the player's own
  front door, chase a real scheduled body across the block by tapping the real
  arrows, tap the real action button, read the card the player sees, check the
  portrait's PIXELS, walk away, come back and be remembered, export the save,
  load it on a fresh page and still be remembered.

EIGHT MUTATIONS, ALL CAUGHT (a gate green on the first try has not been tested):
a placeholder name in the cast; a placeholder line in LINES; a name bank added;
the raw seed put back (half the cast vanishes); the NAME row quietly hiding the
empty table; the ledger no longer surviving JSON; identity keyed to the valley;
the body drawn from the raw seed. Two of them (C11, C25) are caught ONLY by the
real-browser half.

## HONEST LIMITS
- The gate's portrait assertion posts a SYNTHETIC cast (flat colours) because it
  needs faces it can tell apart by pixel. The art is stood in for; the INDEXING
  is not. The ship shot (slices/BOHEMIA_PEOPLE_CARD_ALPHA_7_31_26.png) is taken
  through the real alpha with Paolo's real baked cast, because a picture he looks
  at must not contain a stand-in.
- NOBODY SAYS ANYTHING YET, on purpose. The mouth is built and his table is
  empty.
- The faces themselves come from CHARACTER's portrait baker and vary by colourway
  and hat, not by facial structure. Not this lane's system; flagged, not claimed.
- Identity is per BLOCK. Walk to another cell and those are different people, as
  they should be — but a person does not yet FOLLOW you between cells, and the
  valley-level census (bohemia_population.js) is still numbers, not identities.

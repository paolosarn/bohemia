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

## THEN HE RULED, AND HALF THIS FILE CHANGED THE SAME DAY

Paolo, hours after the above shipped: "Nobody will have a name unless you talk to
them and ask them for their name... I hate how in other games you know everyone's
name off the bat and I think it's complete bullshit... once you ask their name, if
you see them again, then they would be named."

Law: laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md. It is a BETTER answer than
any of the three options he was offered, and it reverses this file's own first
design, which asserted no names anywhere and had a gate sweeping the module for a
name bank. That gate was rewritten the same turn. A GATE MUST NEVER OUTRANK A
RULING.

HE GAVE THIS RULING TO TWO SESSIONS AT ONCE, in different words, and both wrote it
down. Theirs is canon (it carries a second ruling this session never heard) and the
duplicate addendum this session wrote is archived. TWO THINGS THAT EXISTED ONLY IN
THE ARCHIVED COPY, kept here so they are not lost:
  - THE PLAYER IS ~24-25 AT ACT 1. He said "probably", so it is HEDGED, not canon,
    and nothing may be built on it without asking him to confirm. It is the first
    age the player character has ever had, and it dates the backstory tier: a
    24-year-old ten years after the crash (TEN YEARS COLD, 7/31) was about fourteen
    when it happened - old enough to remember everything, young enough to have been
    raised by it.
  - KNOWN_AT_START is for the people "you're personally assigned to know story
    wise". The lineman is the obvious first candidate (the run's own words: "he is
    your neighbour, one door down, nothing closer is possible") and he is
    deliberately NOT in it, because naming him is a ruling and not an inference.

AND A SECOND RULING CAME WITH IT, WHICH COST THIS LANE A FEATURE:
A ROUTINE IS INVISIBLE INFORMATION. "it will all be invisible information." The card
shipped a THEIR DAY row reading "OUT 06:25 · HOME 16:58" about an hour before he
ruled it out. IT IS DELETED, not hidden - there is no day-line helper in the module
at all now. The people still have different days; you learn them by being on the
street at different hours, which is the only way anybody ever learned a neighbour's
hours in real life. WHAT SURVIVES is RIGHT NOW, because present tense is eyesight
and not a timetable. The other lane's gate (invisible_schedule_gate.js) had written
a DATED WAIVER for this exact row; the row and the waiver were removed together,
because a waiver for something that no longer exists is a lie the next reader
inherits.

THREE WAYS TO KNOW SOMEBODY, now:
  known    - story and backstory people. Named from the first frame, because you
             have known them your whole life. HIS TABLE, EMPTY.
  asked    - you walked up, asked, and the game remembered. Forever, across saves.
  stranger - everyone else, until you ask. Called by their trade.

The card says YOU HAVE NOT ASKED where the name goes — visible, not hidden,
because the missing thing IS the mechanic. Tap "Ask their name" and they are
named on the card, on the one action button (TALK TO RUBEN, not TALK TO THE
SCAVENGER), and on every future load of that save.

THE NAME ITSELF IS DERIVED, NOT STORED. The ledger persists one bit — you asked —
and the name regenerates from the identity key, exactly like every other fact in
this module. Pool: 64 given names x 64 surnames, weighted to the real Clark
County the valley is a corpse of (~30% Hispanic, ~12% Black, ~10% Asian/PI),
because an all-Anglo pool would be a lie about Las Vegas. No calendar year is
assumed; the game has never locked one. THE POOL IS REPLACEABLE BY HIM at any
time — the mechanic is the ruling, the strings are just strings.

TWO MORE BUGS THE GATE CAUGHT, both only visible on the real surface:
  - the one button read "TALK TO THE RUBEN". The run was building that sentence
    itself; grammar now lives in one place (addressOf) and the run stopped doing it.
  - asking somebody their name counted as a second MEETING, so the card claimed you
    had met them before when you had not. Opening a conversation is a meeting;
    redrawing the card is not.

PROOF, through the real alpha with the real cast:
  slices/BOHEMIA_PEOPLE_NAMED_ALPHA_7_31_26_STRANGER.png  (SCAVENGER / YOU HAVE NOT ASKED)
  slices/BOHEMIA_PEOPLE_NAMED_ALPHA_7_31_26.png           (RUBEN / Ruben Nguyen)

## WHAT IS HIS, AND IS EMPTY
Two tables ship empty and the gate fails if either gains a row:
- **KNOWN_AT_START** — who you already know: main-quest and backstory people.
  **PARKED BY PAOLO 8/1, NOT PENDING.** Asked once; his answer was "Don't worry
  about that right now don't worry at all about that right now." The table stays
  empty, the game ships with nobody known from the first frame, and asking
  everybody their name is the complete mechanic. Do not re-surface it. The lineman is the obvious first candidate (the run's own
  words: "he is your neighbour, one door down, nothing closer is possible") and he
  is deliberately NOT in it, because naming him is a ruling and not an inference.
- **LINES** — what anybody says when no quest is talking. This lane builds the
  MOUTH, not the words (doctrine section 6).
A stranger is addressed by the engine's OWN role word — WORKER / SCAVENGER /
KEEPER / WATCH — until the player asks. (This paragraph used to say there was no
name generator and never could be; his 7/31 ruling replaced that, and the pool
above is the mechanism half of it. What stays his is WHO THE STORY PEOPLE ARE.)

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
  empty. Asking a name is a mechanical action; no words were put in anyone's mouth
  to do it.
- THE NAME POOL IS 64x64. Over ~500 people that is a birthday problem and a
  handful share a name, which is true of real neighbourhoods and is gated at 85%
  distinct rather than pretended away.
- PURPLE, FLAGGED NOT FIXED: the alpha bakes NPC colourways with Math.random(),
  so a townsfolk body can come out purple on any load — including in the proof
  shot. PURPLE RESERVATION says purple is the Amalgamation's alone. This predates
  this lane (the tints are re-rolled every page load and have nothing to do with
  which look index is chosen) and the purity gate cannot see it because the cast
  is generated at runtime rather than banked as an image. CHARACTER/alpha's.
- The faces themselves come from CHARACTER's portrait baker and vary by colourway
  and hat, not by facial structure. Not this lane's system; flagged, not claimed.
- Identity is per BLOCK. Walk to another cell and those are different people, as
  they should be — but a person does not yet FOLLOW you between cells, and the
  valley-level census (bohemia_population.js) is still numbers, not identities.

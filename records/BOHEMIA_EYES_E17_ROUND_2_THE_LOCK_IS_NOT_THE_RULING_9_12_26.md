# EYES AND EARS -- E17 [locked ignored] ROUND TWO: THE SWEEP
## "THE LOCK IS NOT THE RULING, AND A LATER BUILD IS NOT A LATER RULING"
### 9/12/26 -- lane 17, round two of two. School was records/BOHEMIA_EYES_E17_ROUND_1_SCHOOL_DRIFT_IS_NOT_EROSION_9_12_26.md

MODE: SCHOOL THEN CHECK (Paolo 9/6, LOCKED). Round one was school and measured nothing on the
surface. This is the check: the instrument is built, it is proven to bite, and it is run.

---

## THE HEADLINE, IN ONE BREATH

1,046 lines in `laws/` say the word. **856 are a real lock. 330 of those are HIS** and not a lane
locking its own mechanism. **Only 35 of his name anything a machine could ever check.** Twelve are
checked against the seventeen files the shipped game actually loads, and the result is
**8 satisfied, 3 EROSION, 1 not built yet, 0 drift.**

The three EROSION rows are the answer to the job:

| his ruling | ruled | what the shipped game does |
|---|---|---|
| **THE RIDGE = THE MENU / TITLE SCREEN** | 7/19 | the strip above the name is **one colour**. no ridge, no scene. |
| **PURPLE RESERVATION** | 7/10 | **32 tiles** in the shipped pool are a third or more saturated purple, and not one sits in a hatch or Amalgamation bank |
| **EVERYTHING COSTS ONE** | 8/15 | the fight ships `RUN_COVER_COST=2`, commented "his number", and **no law file anywhere carries that ruling** |

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED (the mode demands this, and it is four things)

**1. Case-insensitive harvest.** Round one found the brief's own example is lowercase:
`laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md:88` reads `(locked, Paolo)`. A grep for
`LOCKED` misses 298 of 1,046 lines *including the one the job cites*. Control C1 plants a lowercase
`(locked, Paolo)` line that must be found or nothing prints.

**2. Split HIS from A LANE'S.** 330 of the 856 locks are his. The other 526 are lanes freezing
their own mechanisms, which is legitimate and is **not a ruling of his**. Reporting one as the
other would put a lane's words in his mouth. Only his 330 are eligible to be called EROSION.

**3. Classify before verdicting.** Of his 330 locks, **35** name something checkable, **3** are
about how a thing looks and belong to DIRECTION, and **292** are intent, lore or process with
nothing on the surface to agree or disagree with. A sweep that verdicted all 330 would be noise.

**4. Name which side is newer.** Every contradiction goes looking for its release. That search is
what produced the third EROSION row instead of a shrug.

---

## AND ROUND TWO CORRECTED ROUND ONE, TWICE, OUT LOUD

### (A) ROUND ONE'S VERDICT TABLE WAS BACKWARDS, AND IT WOULD HAVE BLAMED THE WRONG PEOPLE

Round one wrote: *surface contradicts the lock and the BUILD is newer -> DRIFT, the document's
defect.* That is wrong for this repo. `NEWEST DATE WINS` settles a conflict between two RULINGS.
**A lane shipping something later is not a ruling.** If a later build could retire his word, any
lane could overturn any lock by shipping after it, and the board would mean nothing.

Corrected, and this is what the tool does:

| what the check finds | verdict | whose defect |
|---|---|---|
| the surface does what he said | **SATISFIED** | nobody's |
| the surface disagrees and a **newer locked ruling** in `laws/` releases it | **DRIFT** | the document's: amend or archive it |
| the surface disagrees and **no newer ruling exists** | **EROSION** | the build's |
| the thing the ruling is about is not on the surface at all | **NOT-BUILT** | nobody's |

Under round one's table the Ridge would have been filed DRIFT -- "the document's fault" -- and the
coordinator would have been told to fix the law. It is EROSION. The law is fine.

And the release test is a **search, not a table somebody fills in**. Every contradiction hunts
`laws/` for a locked line, dated after the ruling, naming what the build does instead. The cost row
is exactly why: the code comment says *"his number"*, which reads like a release, and **nothing in
`laws/` carries it.** So it stays EROSION, and the fix is one of two things somebody must choose.

### (B) THE HARVEST NEEDED A THIRD ANSWER, AND CASE-INSENSITIVITY MADE IT URGENT

Round one treated the harvest as one step: find the lines. It is two. **The word is often just the
English word** -- "the phone can now be manually LOCKED", "Camera stays locked", "beat-locked
scrub" -- and those uses cluster in lowercase, so round one's own fix made this worse. Then there
is a third kind that is neither: lines that *lean on* a lock without declaring one, like
`## Honors the locked combat canon`. Every single miss in the first scored run was that shape.

So a line gets one of three answers first: **MARKER** (856), **ORDINARY** (10), **MENTION** (180).
Only a MARKER can ever be a ruling.

---

## RULE ZERO, AND THE CONTROL THAT FAILED

Seven controls run before any number is printed. All seven pass or the tool prints nothing.

- **C1** a planted lowercase `(locked, Paolo)` line is harvested and read as a lock.
- **C2** a planted ordinary sentence ("the door of the shed stays locked") is **not**.
- **C2b** a planted negated line ("this line is not yet locked") is **not**.
- **C3** a lock the surface plainly satisfies reads SATISFIED.
- **C4** a lock the surface plainly contradicts reads EROSION.
- **C5** the reader blob really contains the fight. The combat ships as a base64 blob inside the
  page, so `BPM_MS` is **absent** from the raw bytes and **present** after decoding. Without this,
  half the rulings would have been measured against code that was never in the blob.
- **C6** the title-screen measure can tell a drawn scene from a flat one.

**C6 is there because the first version of it failed.** The surface half originally asked "is a
scene drawn?" by counting colours in the whole picture, with the walked city as the positive
control. The control came back **worse than the thing it was controlling**: the city canvas, 31
colours and 5% non-ground; the splash, 41 colours and 13%. The city at that zoom is mostly flat
desert and the wordmark is busy, so counting the whole picture measures the wrong thing entirely.

Fixed by measuring **the strip above the name**, where the splash's own furniture cannot reach:

    the splash, top fifth:        1 colour,   0.00% not flat
    the walked city, top fifth:  22 colours,  7.83% not flat

One colour. The first version's number would have been a lie in this lane's own headline.

---

## THE CLASSIFIER IS SCORED AGAINST A HUMAN, AND THE HONEST SCORE IS THE THIRD ONE

The counts above rest on rules deciding what a line is. Rules can be fitted until they agree with
themselves, so fifty lines were read by hand, deterministically sampled so they cannot be
reshuffled into a flattering set:

| sample | read | score | worth |
|---|---|---|---|
| A (30) | before the rules were written | 100% | none. the rules were written looking at it. |
| B (20) | after the rules were written | 100% | **none.** its misses were used to repair the rules. |
| **C (20)** | **after the last repair, untouched** | **90%** | **the only clean number** |

A held-out sample stops being held out the moment you fix anything with it. That is why there are
three. The two misses in C are both known and written down: a heading that titles a block of locks
(`THE LOCKED CRAFT RULES`), and a file's **legend** explaining what the `[LOCKED]` tag means. The
gate floors sample C at 85%, because every count in this record is worth less if it drops.

---

## THE THREE EROSION ROWS, IN FULL

### 1. THE RIDGE (ruled 7/19, and it is the brief's own example)

`## THE RIDGE = THE MENU / TITLE SCREEN (locked, Paolo)`

Measured on the real screen in Chromium at iPhone size, not read out of the source, because E13
proved in this lane that a claim in source is not a fact on the surface. The splash is a name plate
(351x117), a subtitle and a TAP line -- 14.1% of the screen -- and **everything above them is one
flat colour**. The release search found no newer ruling about the title screen anywhere in `laws/`.
Picture: `records/target/EYES_E17_SPLASH.png`, control `records/target/EYES_E17_CITY.png`.

*Not covered:* whether a ridge that WAS drawn would be the RIGHT ridge. Taste is DIRECTION's.

### 2. PURPLE (ruled 7/10: "No fantasy-purple tiles scattered through the world. No purple runes, no purple floors, no ambient purple decor.")

**Three wrong versions of this probe, and they are the lesson:**

- **v1** counted purple hex strings in the tile files: a clean **zero**. The pools contain no hex
  at all; every tile is a base64 PNG. A text scan cannot see a picture, and the zero meant nothing.
- **v2** decoded them and counted any purple-hue pixel over 0.25 saturation: **61,323**, which
  would have put the entire art pool in violation. What it actually caught was `#382b49`, `#2c223a`,
  `#30253e` -- near-black **shadow tints**. Night grading, not fantasy purple. Shipping that number
  would have been a false accusation aimed at every artist on the fleet.
- **v3** counted only visible purple. Better, but the unit was still wrong: the law bans purple
  **tiles, floors and decor**, and a few dithered pixels inside a 28x28 sprite is shading.

**So it counts tiles, and it names the bank each one sits in**, because that is what decides the
verdict: purple in a hatch or Amalgamation bank is the law being **obeyed**.

    9,556 tile pictures swept
    32 are a third or more saturated purple
    0 of the 32 sit in a hatch or Amalgamation bank
    misc 15 | sign 5 | light 5 | wall 3 | concrete 1 | container 1 | foliage 1 | door 1

10 of them are `sign` and `light`, where Vegas neon is a real argument. The other **22 are wall,
door, concrete, container, foliage and misc** -- the words the law itself uses. The worst tile is
74% purple. Contact sheet: `records/target/EYES_E17_PURPLE_TILES.png`.

*Not covered:* which of the 32 to repaint, and whether any deserves an exception. That is
DIRECTION's call. This lane says where the purple is, never whether a purple is pretty.

### 3. EVERYTHING COSTS ONE (ruled 8/15)

Four cost constants ship on the surface. Two are 1 (`COST_AMOUNT`, `STANDING_COST`). The fight
declares `RUN_COVER_COST=2`, commented *"his number: running to cover costs two pips"*.

**The first version of this probe passed on ANY constant being 1**, which is not the ruling. He
ruled that everything costs one. Tightened to all of them, it fails, and then the release search
is the interesting half: a number in code claiming his authority, and **no line in `laws/` carries
it**. So either the law needs the exception written into it, or the constant needs to be 1. That is
a decision, and it is not this lane's.

---

## THE ONE NOT-BUILT ROW, AND WHY THE VERDICT EXISTS

`| vehicle | footprint 3x2 | **PAOLO LOCKED** -- "2x3 i told you" |` (7/16)

The loose version of this probe found four footprint declarations near a vehicle word and called
it EROSION. All four were something else: two prop footprints, a parking deck and a doorway. The
surface draws vehicles 146 times and **declares no vehicle footprint with a size anywhere**.

**A ruling about a thing nobody has built yet is not a contradiction.** Every check is now two
probes -- does the thing exist (PRESENCE), does it obey (CONFORMANCE) -- and no presence means
NOT-BUILT, never EROSION. Without that bucket this sweep would invent defects out of every ruling
about an unbuilt feature, which is a fast way to get a checker muted.

---

## TWO THINGS FOUND ON THE WAY THAT ARE NOT MINE TO FIX

**Three superseded GDDs are still living in `laws/`.** `BOHEMIA_GDD_v2`, `v3` and `v4` sit beside
`v5` and carry **69 lock lines** between them. The truth hierarchy says a superseded file moves to
`/archive` the same turn with a registry line. Until they do, 6.6% of this corpus is dead rulings
reading as live. Nothing in this lane may move a law file.

**Six of the twelve rulings checked are named by no gate at all** -- and the border row shows the
rot runs both ways. `gates/border_gate.js` plainly checks the border law and **never names it**, so
that ruling reads NO GATE even though a real checker exists. E11 found CLAUDE.md promising gates
that do not exist; this is the same break pointing the other way. `NO GATE CITES IT` in the output
means exactly what it says: no file in `gates/` contains that law file's name.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- A law file is dated when it was **written**, not when he ruled. He rules out loud first.
- **Twelve checks is not the corpus.** His other machine-checkable locks are unchecked until
  somebody writes their probes. This is coverage, not a clean bill of health.
- Nothing here can tell a ruling he **withdrew** from one he simply has not repeated.
- The classifier is rules, not understanding. Its held-out score is printed so it can be argued
  with rather than believed.

---

## THE GATE, AND WHAT IT DELIBERATELY DOES NOT HOLD

`gates/locked_ratchet_gate.js`, in the suite as **LOCKED RATCHET**. It freezes **EROSION at 3**:
it may go down and may never go up. It does **not** ratchet DRIFT or NOT-BUILT, because a law going
stale when he rules again is the system working and a ruling about an unbuilt feature is nobody's
defect -- ratcheting either would red the fleet's suite over correct work, which is how a checker
gets muted inside a week (E3 measured that). It also floors the held-out classifier score, checks
every control passed, and goes red if the saved sweep no longer describes the game on disk (1% byte
drift on the 17-file reader set, the tolerance E11 had to learn the hard way).

Proven to bite before it was registered: `--selftest` reds it on grown erosion, on a dropped
classifier score, on a failed control and on a stale result, and passes on the real one.

## ROUTED
- **RUN** -- the title screen he locked on 7/19 is not drawn.
- **DIRECTION and COOK** -- 32 purple tiles, 22 of them in banks the 7/10 law names out loud.
- **COMBAT, then the coordinator** -- `RUN_COVER_COST=2` has no ruling behind it in `laws/`.
- **THE COORDINATOR** -- three superseded GDDs still in `laws/`; six of twelve rulings named by no
  gate; and `border_gate.js` checking a law it never cites.

## FILES
- `tools/bohemia_eyes_locked.py` -- the sweep, every wrong version written into its own docstring
- `tools/bohemia_eyes_locked_surface.js` -- the real-screen half
- `gates/locked_ratchet_gate.js` -- the ratchet, self-testing
- `records/BOHEMIA_EYES_LOCKED_9_12_26.json` + `..._BASELINE_9_12_26.json`
- `banks/eyes/BOHEMIA_EYES_E17_HAND_LABELS_9_12_26.json` -- the fifty lines read by a person
- `banks/eyes/BOHEMIA_EYES_E17_SWEEP_RESULT_9_12_26.json` -- the list, for the coordinator
- `records/target/EYES_E17_SPLASH.png`, `EYES_E17_CITY.png`, `EYES_E17_PURPLE_TILES.png`

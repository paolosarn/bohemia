# EYES AND EARS -- E11 [pixels only] -- ROUND TWO OF TWO: THE CHECK
## THE NO-READER SWEEP
### 9/6/26 -- session eyes-5vql33 -- the instrument is built, self-tested, and run

School: `records/BOHEMIA_EYES_E11_ROUND_1_SCHOOL_THE_ARTIFACT_GAP_9_6_26.md`
Machine: `tools/bohemia_eyes_bundle.js` (catch) + `tools/bohemia_eyes_no_reader.py` (measure)
Gate: `gates/no_reader_ratchet_gate.js`, registered in the suite as NO READER
Data: `records/BOHEMIA_EYES_NO_READER_9_6_26.json`, baseline `..._BASELINE_9_6_26.json`

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED
The lane's MODE requires this sentence, so here it is first, and it is not a formality.
It changed the answer.

**School's counter-finding: the defect is not the container, the defect is NO READER.**
Round one proved the job's own title wrong. Encoding data in an image is an established
practice, and Aseprite and Lospec both treat a PNG as a first-class palette container
beside `.gpl` and `.pal`. So this sweep never asks "is it a picture". It asks whether
anything the shipped game LOADS can turn the thing into a value.

Two things fell out of that, and both flipped a result:

1. It forced the reader set to be measured **live in a browser** instead of grepped. A
   grep cannot tell a loaded file from a file that merely exists, and that difference is
   the entire job. The shipped game turns out to fetch **17 files**. Everything else in
   this repo, all 496 MB of it, is unreachable at runtime.
2. It forced a verdict word for the case school warned about: a data file that exists,
   looks answered, and nothing reads. **ORPHAN.** Without that word the sweep would have
   passed the repo simply by finding files, which is the failure mode the ORPHAN control
   exists to catch.

---

## THE ANSWER, IN ONE TABLE

| census | what it asks | result |
|---|---|---|
| A engine modules | is this code inside what the game loads | 123 LIVE, 29 ORPHAN, 14 ignored |
| B laws | does any checker name this law file | 428 laws, 143 named, 285 not |
| C data banks | is this bank read, superseded, draft, or nothing | 53 read, 5 superseded, 8 draft, **1 orphan** |
| D promised gates | the law index names a gate: is it there | 23 promised, 22 real, **1 missing** |
| the named case | COLOUR IS TERRITORY, 8/26 LOCKED | **LIVE as of 9/6.** No longer stranded. |

---

## FINDING 1 -- THE SHARPEST ONE, AND IT WAS NOT WHAT I WENT LOOKING FOR

**`reference_check_gate` does not exist.**

`CLAUDE.md`'s master law index carries this line:

```
- COMPARE EVERY PIECE OF ART TO THE WORLD BEFORE CALLING IT DONE
  -> laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md | gate reference_check_gate
```

There is no `gates/reference_check_gate`, `.js` or `.py`. The suite has never run it.
`tools/bohemia_reference_index.py` refers to it in a comment as if it were somebody's.
And DIRECTION's own SHIPPED line from 9/5 reads:

> `[reference index] REFERENCE-INDEX ... an index file the reference_check_gate can
> resolve a REFERENCE CHECK against, so a cook that names a reference names a real one`

So the index was built for a reader that is not there. That is the purest example of the
thing E11 was created to find, and it is worse than a law with no gate at all: a law with
no gate is honestly unenforced, while this one is **advertised as checked** in the file
every chat reads first, every session. By the repo's own pillar law, A LAW WITHOUT A
MACHINE GATE IS NOT ENFORCED, the 9/4 compare law is not enforced.

It matters more than the other 22 because of who it governs. That law is this lane's own
bar, it is DIRECTION's and COOK's standing duty on every cook, and ANIMATION carries it
as a standing duty on every clip. Three lanes are running a check that has no checker.

**Routed:** one `[eyes: gate missing]` line into DIRECTION's section, which is the single
bounce-back this lane is allowed. Not built by me; this lane never writes another lane's
code. The ratchet freezes this count at 1 and it can never grow.

---

## FINDING 2 -- THE NAMED CASE IS FIXED, AND THE BOARD DOES NOT KNOW

The job brief says the faction colours are the reason E11 exists: "his faction colours
were one and they blocked three lanes for weeks."

**Measured: they are LIVE.** `engine/BOHEMIA_faction_colours.json` exists, and its values
are inside the shipped bundle. All seven factions I probed resolve to a real hex within
the shipped city world: Mob `#572f2a`, Cartel `#434042`, Colorful `#60a136`, and so on,
each with rgb, hue, drab, strength and share beside it. COOK shipped it on 9/6.

Two things follow, and the second is the useful one.

**a) WORLD's STATE line on the board is now false.** It still ends: *"there is no faction
colour table the walked surface can reach, so the tell is the light and the name arrives
in words."* There is one, and the walked surface reaches it. That sentence is the exact
kind of stale truth this sweep exists to catch, and it will send the next chat that reads
it down a road that closed. Not mine to edit (lanes change status words only), so it goes
to the coordinator in my handoff.

**b) The value is `draft:true` and it was MEASURED OFF THE WARDROBE, not ruled.** Nobody
has recorded that Paolo picked `#572f2a` for the Mob; a machine sampled it from clothes.
That is correct behaviour under MECHANISM-MINE / CONTENTS-PAOLO'S and it is not a defect.
But it is exactly school's **context gap**: the value transferred and the intent did not.
So the honest verdict on the named case is not "solved". It is: **the artifact gap closed,
the context gap is open, and what is missing is a thumb, not a file.**

---

## FINDING 3 -- HIS SOUND APPROVALS ARE ALL THERE. A NEGATIVE RESULT, REPORTED ON PURPOSE

The first run flagged five approved-sound banks as ORPHAN. His thumbs, in a file, unread.
That would have been the loudest finding of the round.

It was false, and I checked it before writing it down. Measured pick by pick: the newest
bank holds **185 approved picks across 65 sounds**, and of the 132 picks in the five
unread banks, **0** are missing from it. They are superseded snapshots, not lost rulings.

A sweep that only ever reports alarming things is not a trustworthy sweep, so this stays
in the record as a clean result: **not one of Paolo's sound approvals has been dropped.**
The tool now has a SUPERSEDED verdict so this class never gets reported as a defect again.

---

## FINDING 4 -- 29 ENGINE MODULES ARE NOT IN THE GAME, AND THAT IS THE PLUMBER'S, NOT MINE

29 non-test modules in `engine/` have no code inside the 17 files the game fetches. The
biggest is `bohemia_engine.js` at 281 KB, whose own header says it is "All 19 engine
modules stitched into one file for handoff" -- a duplicate of things that also live
separately, which is the ADR literature's classic symptom of a lost decision: two
competing implementations of the same thing. Others (`bohemia_valleymap.js`,
`bohemia_dress.js`, `bohemia_loop.js`) are named in older slices that the alpha no longer
loads.

**This is dead weight, not a stranded ruling.** It belongs to the PLUMBER, whose whole
job is keeping the game small and fast, and I am not routing it as a defect in anyone's
art or sound. It is reported, not ratcheted, because a lane writing a module before
wiring it is honest work in progress and a gate that reds the suite for that gets muted.

---

## FINDING 5 -- 285 OF 428 LAWS ARE NOT NAMED BY ANY CHECKER, AND THAT NUMBER IS AN UPPER BOUND

By the repo's own pillar law this would mean two thirds of the written rules are
unenforced. I will not claim that, because my check is narrow and I would rather report a
smaller true thing than a bigger shaky one: I asked whether any file under `gates/`
contains the law's FILENAME. A gate can enforce a law perfectly well without citing its
filename. So 285 is the ceiling of the problem, not its size.

It is reported, never ratcheted, for the same reason as finding 4: a new law is ungated
the moment it is written, and that is normal.

The finding that does stand up is finding 1, which needs no interpretation at all: the
index names a gate, and the gate is either there or it is not.

---

## THE INSTRUMENT'S OWN FOUR BUGS, ALL FOUND BEFORE PUBLISHING A NUMBER

This lane's rule is that a detector must be proven to bite before a green is believed, and
that every wrong version goes in the tool's docstring. Four this round:

1. **v1 keyed on the build banner** `/* ==== engine/x.js ==== */` and reported 65 orphans.
   False. `bohemia_coalition.js` shipped one round ago and was on the list, because its
   real banner reads `/* ==== engine/bohemia_coalition.js (COALITION, 9/6) ==== */` and
   the regex demanded `====` immediately after `.js`.
2. **v2 fixed the regex** and reported 30. Still false. `bohemia_sfx.js` was on the list
   while the game plainly plays sounds; the alpha inlines it under a completely different
   marker, `/* ENGINE SYNC LAW: this body is engine/bohemia_sfx.js, inlined verbatim.`
   Two conventions, and a third would have broken it again. **v3 ignores markers and
   matches the CODE**: eight long non-comment lines out of the module, three verbatim hits
   in the bundle is LIVE. A build convention can change; the body cannot.
3. **The reader globs were not recursive.** `tools/*` and `gates/*` missed
   `tools/tfcook/TF-XXX_cook.py`, so three tileform banks read as ORPHAN while a tool was
   opening them by name the whole time.
4. **The named case asked for the filename, not the content.** It globbed `engine/*.js`
   only, missed `engine/BOHEMIA_faction_colours.json`, and printed **"STRANDED. No colour
   carrier file exists at all"** about a table that had shipped that same round. Then,
   once found, it asked whether the FILENAME appeared in the bundle and got False, because
   this repo ships data by inlining it. Both halves fixed: scan every data file, and match
   the values.

Every one of those would have been a confident, specific, wrong sentence in front of
Paolo. Three of the four were caught by the same habit: check a result that sounds
dramatic before you write it down.

---

## RULE ZERO: THE CONTROLS

`--selftest` plants four known cases and the sweep refuses to print a single number unless
all four land right:

```
PASS  a planted module nothing loads reads ORPHAN
PASS  a planted module made of shipped code reads LIVE
PASS  a planted law no gate names reads UNGATED
PASS  a promised gate that does not exist reads PROMISED BUT MISSING
```

The ORPHAN control is the one that matters. Without it a sweep can pass every check just
by finding files, and would report a clean repo forever.

The gate has its own two controls, and it refuses to report if either fails:
one more stranded bank than the baseline must go red, and a saved result that no longer
matches the bundle on disk must go red.

---

## THE RATCHET, AND WHAT IT DELIBERATELY DOES NOT HOLD

Frozen, may only go down, never up:

| number | frozen at |
|---|---|
| gates_broken | 1 |
| banks_orphan | 1 |

Reported every run, never ratcheted: `engine_orphan` 29, `laws_ungated` 285. Both grow
from honest work in progress, and school's clearest practical warning was that a checker
which cries wolf gets muted in week one. Two numbers that mean something beat four that
get ignored.

The gate also re-measures one thing itself: the byte size of the 17-file reader set. If
that moved, the saved sweep is stale and the gate goes red rather than handing out a green
light for a game that no longer exists.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- A value the code assembles at runtime out of pieces is invisible to any text scan. Every
  mature hardcoded-value linter has this hole and says so.
- A module reached only on a path the bundle walk never takes reads as unfetched. The walk
  is written into the bundle record: front door, splash tapped as a finger taps it, twelve
  steps, both surfaces.
- Whether a value that IS read still matches what Paolo ruled. That is Q3, DRIFTED, and it
  is specified and not built. It needs the live surface and a screenshot, and a drift
  checker that is only sometimes right is worse than none.

---

## ROUTED

- **DIRECTION** -- `[eyes: gate missing]`, one line, the only bounce-back this lane may
  write. The compare law's gate is named in the master index and does not exist, and the
  reference index shipped 9/5 was built for it.
- **THE COORDINATOR** (not mine to edit) -- WORLD's STATE line still says no faction
  colour table can be reached; one exists and the shipped surface reads it. And this
  lane's own STATE line still says "nothing exists" while twelve instruments and two
  suite gates do.
- **THE PLUMBER** -- 29 engine modules with no reader, 281 KB of stitched duplicate at the
  top of the list. Not routed as a defect line; it is in this record for whoever wants it.

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job said: list them, name which lane owes the file, and re-run the sweep on every
ship. All three are met. The list is in the data file, the one lane that owes something
has its line, and the sweep re-runs behind a registered gate that goes red if its answer
goes stale. **E11 is SHIPPED with both rounds.**

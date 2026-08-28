# BOHEMIA LAW — A HAIRCUT READS FROM EVERY ANGLE OR IT IS NOT A HAIRCUT (8/28/26, LOCKED)

## HIS WORDS

> "Cool I like it, but **it's tough to analyze without implementing all the new hairstyles
> and shit**"

He is right and the number said so before he did: the portrait could draw **92 distinct
haircuts** and the city owned **fifteen**. A face maker with fifteen cuts in it is a demo
of a face maker.

---

## FIRST: EVERY DEAD SLOT WAS CHECKED, AND NOT ONE WAS REVIVED

The graveyard's HAIR WAVE 2 block says, in plain words:

> "REOPENING EARNED ITS KEEP THOUGH: 4 of the 7 came back as KEEPS — **SIDE PART, LIBERTY
> SPIKES, PONYTAIL and TOP KNOT are canon now.**"

and of CORNROWS: *"which he approved: 'The cornrows is so much better very good.'"*

Read alone, that says **five approved haircuts have been sitting switched off in the
wardrobe** — which is the shape of the seventeen invisible hats and the colours nobody
wore, and it is what I expected to find.

**Read to the end of the file, it does not.** HAIR WAVE 3, one day later, killed all five
— most of them for the second or third time — and a second kill is permanent with no third
look. **NEWEST DATE WINS** (truth hierarchy) and **GRAVEYARD IS FINAL.**

> A confident YES is as expensive as a confident NO. Yesterday's law says *when you write
> down that something does not exist, say where you looked*; this is the same rule with
> the sign flipped. **Read to the end of the record before you act on the middle of it.**

Every name in this batch is new. None is a burned token. None is a retune of a dead shape.

## AND THE SLOTS ARE OPEN BECAUSE THE MACHINE IS DIFFERENT NOW

Wave 3's own header names the common cause of its eight kills: *"A lot of the sideways
shit still fucked up."* That is the exact thing that got fixed yesterday — hair covers the
side of the head behind a real hairline instead of a four-pixel strip. Since those kills:
the crest tapers, the fall hangs behind the head in profile instead of down the middle, the
2px bulb was halved, and long hair no longer lets go of the head at the jaw.

The graveyard says of CORNROWS that *"its 2:1 texture mechanism LIVES and carries any
future weave."* This is that future weave, in shapes he has never seen.

---

## WHAT SHIPPED: NINE, NOT TWENTY-THREE

Twenty-three were cooked. **Nine shipped. Fourteen were cut in the same turn, by looking
and by the gates**, and that is the kill/approve pipeline FACTORY LAW asks for rather than
a failure of it.

**SHIPPED (15 canon → 24):** ROPE LOCKS, SHORT ROPES, DUST WEAVE (the first textured
haircuts in the game), COIL CROWN, LAYERED FALL, CURTAIN CUT, HEAVY FRINGE, DRY TAPER,
DEEP TAPER.

**CUT, WITH THE REASON:**

| | why |
|---|---|
| RIDGE CREST, SPIKED CREST, WIDE CREST | head-on the crest is a **hard rectangle**, which is the exact sentence MOHAWK was killed for in wave 3. The taper that fixes it lives inside `if(strip&&prof)` — **profile only**; head-on and from behind the crest has never had a shape. |
| WORK KNOT, NAPE TAIL, DESERT COIL, TIED ROPES | a ponytail is drawn `if(tie==='pony'&&!front)`, so the tail **exists from the side and not head-on**: the fall changed 1.05 head-heights between SE and E. That is clause 1 exactly. The knot and tail are also literal rectangles; the longest straight edge in the game went to 18 rows. |
| BIG COILS, LONG WEAVE, MID FALL, SCALP ROWS, CROWN LIFT, CHEST LENGTH | after three mechanical fixes they still ran a straight edge for 7–9 rows against a locked limit of 6. |

**A cook that fails a law is not a cook, it is a regression with new names.**

---

## THREE MECHANICAL CAUSES, FOUND AND FIXED — AND THEY IMPROVED THE WHOLE GAME

1. **THE PARTING WAS A BARCODE.** The 2:1 loc ratio is his and exact, and it stayed; what
   was wrong is that the parting ran dead straight the whole length of the head. Rendered
   at 9x, a long loc style was three ruled bars. It drifts by one cell now — and the first
   drift **stepped every two cells, which at 112 is four pixel rows, exactly the length the
   law calls a straight run.** *A jitter whose step equals the thing you are hiding from
   hides nothing.*
2. **A BRAID IS A ROPE, NOT A NET.** `(_ph%3===2)&&(_pq%3===2)` skipped only where two
   stripes crossed — a grid of holes, which rendered as a punched card. And the first fix
   cut the second hair column on every other row, which **severed the rope**: LONG WEAVE
   came out as black debris on the shoulders.
3. **A FALL SWAYS.** Below the jaw the mass hangs off one fixed span, so a long style's
   edge only moved when a three-way hash happened to change — four- and six-row straight
   edges by construction. It **alternates** now, so the edge is guaranteed to move every
   cell; the direction still comes off the seed, so it is not a metronome.

Plus: **the strand pass now runs on textured styles.** Its header said locs and braids
"already carry their own marks at his approved 2:1 ratio" — they do, but that ratio counts
CELLS, so every one of those marks is two pixels wide, and 8/25 clause 2 asks for a mark
**one** pixel wide. A style can be textured and still be drawn at 56.

**Measured across the whole game, including the fifteen that were already canon:**

| | before | after |
|---|---|---|
| hair edge rows in a straight run of 4+ | 19.5% | **17.2%** (pin tightened) |
| longest straight edge anywhere | 6 | **6** |
| canon hairstyles | 15 | **24** |
| distinct haircuts the portrait can draw | 56 | **92** |

---

## AND TWO MORE BROKEN RULERS, WHICH IS FIVE AND SIX THIS WEEK

- **`hairline_gate` counted PIECES, not paint.** A loc style draws two hairs and one
  parting, so the paint is separate ropes *on purpose*; flood-filling it reported ROPE
  LOCKS and LONG WEAVE broken on all five facings. The mask is **closed by one pixel**
  first — wide enough to swallow a one-cell parting, far too narrow to swallow a real
  break. **This is not an exemption for textured styles**, which is the shape of thing that
  let a 23% faction share sit under a green gate two days ago: it is the same measurement
  for every haircut, asked of the silhouette instead of the paint.
- **Its neck check could not tell a waist from a tail.** It took the narrowest row over the
  widest and flagged a ponytail, which is narrow on purpose. The bug he named was a
  **waist** — narrow with wide *above and below*. It measures the flare-back now.
- **`craft_law_gate` clause 4 was pinning characters** — `/return \(_ph%3===2\)/` — directly
  under its own comment saying, twice, PIN THE BEHAVIOUR NOT THE CHARACTERS. **Fourth time
  that gate has done it to itself**, and its own comment predicted every one. It extracts
  `texSkip` and measures the ratio now.
- **`hairline_gate`'s piece cap was a COUNT on a list that is supposed to grow.** Set at 5
  when the game had fifteen haircuts, it went red at thirty-five on a build whose *rate*
  had improved. An absolute count on a growing list is a gate against cooking, which is the
  opposite of what it is for. It is a share.

---

## THE RULE

> **A HAIRCUT IS NOT DONE UNTIL IT READS FROM ALL EIGHT DIRECTIONS.** Cook it, render every
> facing, and look. A shape that only works head-on is not a haircut with a bug in it, it
> is a haircut that does not exist yet, and the batch ships without it.

The two mechanisms that are not finished — **the crest** and **the tie** — are named rows,
not silent omissions. Nobody in the valley has their hair up, and in a desert that is a
real hole.

---
Tab: **CHARACTER** (try them on, and the face maker picks from all 24) / **RUN** (the
crowd) / **LOOK** (the reference sheet, every cut, every way he turns).
Record: `records/BOHEMIA_A_HAIRCUT_READS_FROM_EVERY_ANGLE_8_28_26.txt`.
Gates: `hair_gate.js`, `hairline_gate.js`, `portrait_haircut_gate.js`, `craft_law_gate.js`.

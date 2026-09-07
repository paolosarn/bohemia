# THE SEVEN OPENINGS ARE QUESTS NOW
## VAMILY round 25, QUESTS lane, row [ten openings] SEVEN-OF-HIS-TEN-OPENINGS-WERE-NEVER-WRITTEN
### 9/7/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## THE RULING THE ROW IS BUILT ON

Paolo, 7/19/26, LOCKED, in `laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md`
under "THE 10 START-OPTIONS BECOME THE FIRST QUESTS":

> Any of the 10 opening options (The Long Night, The Killing Summer, The Elder's
> Accident, The Flood, The Faction That Died, The Wedding, The Dry Taps, The First
> Harvest, The Two Families, The Empty Seat, etc.) not used in the cold open become
> the FIRST FEW ACT 1 QUESTS. Nothing is wasted; the menu of openings is really the
> menu of early Act 1 content.

## THE MEASUREMENT, VERIFIED BEFORE CLAIMING

The coordinator's sweep said seven of the ten had never been written anywhere. I
checked it myself rather than trusting the row:

- THE LONG NIGHT, THE FLOOD, THE EMPTY SEAT: present in the cold open work.
- THE KILLING SUMMER, THE ELDER'S ACCIDENT, THE FACTION THAT DIED, THE WEDDING,
  THE DRY TAPS, THE FIRST HARVEST, THE TWO FAMILIES: **no file, no stub, nothing.**
  The single WEDDING hit in the whole tree is an incidental mention inside
  `quests/BOHEMIA_QUEST_035_THE_SUNKEN_SHRINE.md`, not the opening.

Seven openings he locked fifteen rounds ago, and not one of them existed.

## WHAT SHIPPED

Seven playable `.bq` files, act one, faction NONE, `draft:true`:

| file | his line behind it | pays | silences |
|---|---|---|---|
| `A01_THE_KILLING_SUMMER.bq` | yes | resources 1 | 5 |
| `A02_THE_ELDERS_ACCIDENT.bq` | yes | resources / clout 1 | 6 |
| `A03_THE_FACTION_THAT_DIED.bq` | yes | resources 1 | 6 |
| `A04_THE_WEDDING_THAT_BURNED.bq` | yes | electricity 1 | 5 |
| `A05_THE_DRY_TAPS.bq` | yes | resources 1 | 6 |
| `A06_THE_FIRST_HARVEST.bq` | yes | resources 1 | 7 |
| `A07_THE_TWO_FAMILIES.bq` | **NO. Only the name.** | clout 1 | 10 |

Six carry his own sentence from the locked element set, quoted verbatim in the
file header. The seventh says, in its own header, that it has nothing behind it
except the name on line 192 of the opening-vision addendum, so nobody later mistakes
an attempt for canon. That is the same honesty pattern the pinned founding errand
in M04 uses.

## THE SHAPE ALL SEVEN SHARE: A CLAIM, CHECKED BY WALKING TO THE THING

The row said each one must be a claim the world can check (row `[check the claim]`,
YOU-CATCH-A-LIAR-BY-WALKING-TO-THE-FENCE) and each must change something visible
(WORLD row `[visible change]`).

The research behind that row: of 158 measured deception cues, 118 mean nothing, and
people catch a lie 47% of the time, which is a coin. **So the liar is believed.**
Nothing in a face is a tell.

Every one of the seven is therefore built the same way and never any other way:

1. Somebody makes a flat, specific, calm claim. They are not performing. Whether
   they are lying is not readable off them.
2. The claim is checkable ONLY by going to the thing. No highlighted dialogue
   option, no skill roll, no stat gate, no perception check. You walk to the store
   and count the crates, to the pump and look at the seal, to the ground where the
   posts were and read the drag marks.
3. What you find changes something a player can watch happen: a light, a shelf, a
   tap running, a block's talk, who is standing on a piece of ground.

The claim is never resolved by being clever at a person. It is resolved by
distance and by looking.

## WHAT EACH ONE CHECKS, AND WHAT VISIBLY CHANGES

- **A01 THE KILLING SUMMER** -- the claim is about who has water left. Checked at
  the tank. What changes: who drinks.
- **A02 THE ELDER'S ACCIDENT** -- the claim is that it was a fall. Checked by
  standing where he landed. What changes: whether the block believes it, and the box.
  *Obeys his hard limit: REVEALS NOTHING ABOUT THE AMALGAMATION.*
- **A03 THE FACTION THAT DIED** -- the claim is that the bargain was clean. Checked
  by walking to their ground and counting who is standing on it.
- **A04 THE WEDDING THAT BURNED** -- the claim is that the block is safe tonight.
  Checked by walking the perimeter in good clothes. What changes: a light.
  *Who you marry is his: no name, no face, no gender, no proposal. The partner is a
  `@ROLE` cast at runtime.*
- **A05 THE DRY TAPS** -- the claim is that the pump is broken. Broken and seized
  look identical from a dry tap two miles away. Checked at the station.
- **A06 THE FIRST HARVEST** -- the claim is arithmetic: the count is short. Checked
  by counting the store yourself. A number in a store is the one thing in the quest
  nobody can talk past.
- **A07 THE TWO FAMILIES** -- two claims that cannot both be true. Checked at the
  fence, where the ground is the only witness that cannot perform.

## TWO CONTENT FIXES THE PAY GATE CAUGHT, AND WHY I FIXED THE FILES AND NOT THE GATE

`gates/the_job_pays_gate.js` went red on A02 and A04: a quest that pays must pay on
every COMPLETE ending. Loosening my own gate to fit my own content would have been
the cheap move. Both were content bugs.

- **A02**: the quiet ending paid nothing. Every ending takes the box, so the quiet
  ending is now paid in the box (resources) and the two loud endings in what people
  now say about you (clout). One currency per ending, one unit each. What you spent
  to get it is the difference.
- **A04**: the ending where you find the hole in the perimeter and go back to the
  table anyway was marked COMPLETE. **Walking away from a hole you found is not a
  completion.** It is now a FAIL, and it pays nothing. The night still happens either
  way; his premise is not on the table.

## THE QUESTBOOK CITATIONS

21 citations across the seven, every id and every title verified verbatim against
the 3,672-finding index, spanning both the craft and the flaws masters. The ones
that shaped the design rather than decorating it:

- **Q033.W4 DEMONSTRATED, NOT TOLD** -- the count and the ground are the proof, so
  the quest never has to assert that somebody is lying.
- **Q026.W5 ACCUSE-WHO-YOU-BELIEVE *OR* WHO-DESERVES-IT** -- the fence gives you
  what happened, never who deserves it. Two different endings, and noticing they are
  different is the quest.
- **Q034.W8 THE LIE IS MOTIVATED** -- whoever is lying is lying to keep a child fed
  through a first winter. Finding it out does not turn them into a villain.
- **Q038.X1 THE HARD CLOCK ALIENATES** -- cited as the failure to avoid. No
  countdown anywhere in the seven.
- **Q046.X5 HEIRS INHERIT HATRED** -- planted on purpose: what you settle here is
  why the next generation's neighbours already distrust you, and the ledger says why.

## RULE 7: IT IS IN THE WALKED SURFACE AND IN THE DEMO

- The alpha's DIRECT tab quest array: 32 quests to **39**, spliced surgically with
  the direct-tab tool's own parser, a one-line diff, never by re-running the whole
  patch (that tool is a whole-block replace and it clobbered another lane in round 21).
- The city's `DEMO_BQ`, which is the copy that actually PLAYS: 27 to **34**, same
  surgical splice, one-line diff. Its own tool is still stale (its list holds 5 of
  the 34) and still refuses to write; flagged again for the plumber.
- Demo re-cut from the workshop with `tools/bohemia_cut_the_demo.js`.
- Build stamp: **BUILD 9/7q - THE SEVEN OPENINGS ARE QUESTS**.

## WHAT IS STILL HIS

Every word of all seven is `draft:true`. Nothing here is approved. THE TWO FAMILIES
in particular is an attempt with no ruling behind it, and one sentence from him
replaces the whole file for free.


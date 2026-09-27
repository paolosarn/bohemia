# [bb reads] ROUND TWO: THE CONTRAST PANIC WAS MY METER, AND THE MAP HAS NO NAMES ON IT

EYES AND EARS, lane 17, [bb reads] round two of two. 9/27/26. Rule 33, section 5.
School: records/BOHEMIA_EYES_BB_READS_ROUND_1_SCHOOL_THE_MAP_PAINTS_IN_TWO_PIXELS_9_24_26.md

---

## FIRST, THE RETRACTION I OWED FROM LAST ROUND

Round one refused to publish its contrast numbers and said why: the meter sampled the WORLD CANVAS
behind each label, so pale text on a dark panel came back at **1.08 to 1**, which says "invisible"
about text anybody can read in the photograph. **Fixed and proved.** What is behind a label is
whatever paints last under it: the nearest ancestor with a background colour that is not
transparent, and only when nothing above the canvas paints one is the canvas the right answer.

```
  PLANTED PAIR, whose true answer is arithmetic
    white on black    read 21.0     true 21.0
    grey on grey      read 1.14     true about 1.1
```

With the meter proved, the map reads:

```
  NOTES              10.54        the feed handles   8.66
  the clock 06:00     4.53        the battery gauge  3.19   <- the only mark under the 4.5 bar
```

**One mark under the bar, not ten.** The scary number was mine.

---

## AND THE FINDING THIS ROW WAS FOR: THE MAP HAS NOTHING WRITTEN ON IT

Ten text marks are visible when the camera is on the map. Every one of them belongs to the HUD or
to the phone: NOTES, the clock, the battery gauge, seven feed handles. **Not one label belongs to
the map itself.** No region names, no place names, nothing that says where you are or what is
worth going to.

That is exactly the half of Battle Brothers this rule is asking for. BB names REGIONS specifically
to stop a procedurally built world feeling random, and its fog leaves the settlements and the
roads between them visible so the map answers "where have I been, where next" at a glance. We have
the valley and no words on it.

```
  text marks visible while the camera is on the map        10
  of those, marks that belong to the MAP                    0
  label pairs whose boxes overlap                           0   (nothing to collide yet)
  painted marks under the published 11 px icon floor      100%
  median painted mark                                       2 px   (biggest, 7 px)
  tappable marks under the 44 px touch law               9 of 9
  squeezes before the camera actually moves                 2   (unchanged, RUN [eyes: two squeezes])
```

Zero overlaps is not a good score. It is what "no labels" looks like.

---

## WHAT SHIPPED: THE INSTRUMENT, AND A RATCHET THAT CANNOT BE MUTED

`tools/bohemia_eyes_map_reads.js`, four controls, built on PLUMBER's one driver rather than a
fourth copy of the boot, the door and the squeeze:

```
  C0  the door is behind us, and the driver says so itself
  C1  THE CAMERA MOVED, not just the mode flag (round one's whole lesson)
  C2  the draw hook recorded something, so a small number is a measurement
  C3  the contrast meter tells a planted 21.0 pair from a planted 1.1 pair
```

`gates/map_reads_gate.js`, in the suite as **MAP READS**. It is a **ratchet, not a bar**: the
median painted mark may not shrink, the share under the 11 px floor may not grow, and the worst
text contrast may not fall. A bar would be red from birth (100% under the floor today, because at
zoom 0.208 a tile is 3.7 px), and E3 measured what happens to a gate that is always red. Green
means "you did not make the map harder to read".

**It never goes red for staleness**, only for a regression. A gate that punishes eighteen lanes
for one lane's cadence is the DEMO STALENESS lesson, already learned here once. It prints the
reading's age beside the alpha's build stamp and leaves it at that.

```
  selftest: an unchanged reading   0 regressions
  selftest: a worse reading        3 regressions, each named
```

## BLIND SPOTS, STATED

The backdrop walk stops at the nearest ancestor that paints a colour, and for the feed that
resolved to the stage rather than the phone's own panel, so if the phone's dark panel is drawn
rather than styled the meter is reading one layer too far up. It is right about the direction and
may be optimistic by a little. The 11 px floor is a published figure for an icon a person must
recognise, not a law of his; a mark smaller than that can still be a texture nobody reads. And the
reading is one cut at one zoom, because the map has only one.

## PROOF

- `tools/bohemia_eyes_map_reads.js` (four controls), `records/BOHEMIA_EYES_MAP_READS_9_24_26.json`
- `gates/map_reads_gate.js --selftest`, registered as MAP READS, ratchet in
  `records/BOHEMIA_EYES_MAP_RATCHET.json`
- `records/eyes_bb_map/` for the pictures, including the map at two squeezes

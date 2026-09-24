# [bb reads] ROUND ONE, SCHOOL: THE MAP PAINTS IN TWO PIXELS, AND IT TAKES TWO SQUEEZES TO GET THERE

EYES AND EARS, lane 17, [bb reads] round one of two. 9/24/26. Rule 33 (THE OVERWORLD IS BATTLE
BROTHERS, Paolo 9/24), section 5: *"how BB's map reads at a glance and what fails at 390 px wide;
the instrument for our map when RUN ships it."*

Rule 33(a) says the map IS the city view we already have, reached by one squeeze out. So this
school round took a real first reading instead of describing one.

---

## THE FINDING THAT CAME OUT OF THE FIRST SQUEEZE

**One squeeze flips the game's own mode flag to "city" and leaves the picture on the street. The
camera moves on the SECOND squeeze.** Measured on both surfaces, with the game's own state:

```
                         mode     tile width   czoom
  at the street          human        18        1
  one squeeze, +10 s     city         18        1      the picture is still the street
  a second squeeze       city         3.7       0.208   now it is the map
```

Ten full seconds after the first squeeze, nothing had moved. Identical on the deployed cut and on
the alpha, so it is not the cut. RUN's board says the seam is crossed in one squeeze
(CZOOM 1 to 0.208) and that half is true of the MODE; the zoom is a squeeze behind it. A player
squeezing once sees the street and is told nothing. -> RUN `[eyes: two squeezes]`.

**And my own probe believed the flag.** Its first version asked "did mode change", got yes, and
photographed the street while calling it the map. The control now demands the CAMERA moved, and
the number of squeezes is part of the report.

---

## THE FIRST READING OF THE MAP, THREE CONTROLS GREEN

```
  squeezes the camera needed                    2
  text marks on the map                        10
  smallest text height                         11 px
  smallest font                                 5 px
  tappable text marks under the 44 px law    9 of 9
  the smallest thing PAINTED on the map         2 px
  the median thing painted on the map           2 px
```

**The median painted mark on the map is two pixels.** At czoom 0.208 a tile is 3.7 px wide, so the
whole valley is drawn in marks of about two pixels. The published floor for a map icon a person
must recognise is about **11 px**, and the touch floor this lane has measured against since round
two is **44 x 44**. Nine of the nine tappable marks on the map are under it.

That is not a complaint about art. It is the number the instrument exists to produce, and it says
the current city view is a picture of a place rather than a map you can read or press.

---

## WHAT BATTLE BROTHERS ACTUALLY DOES, AND WHAT THE WORLD SAYS ABOUT SMALL MAPS

**BB, from its own dev blogs:** the world is procedurally generated, so it names REGIONS to give a
random world "a feeling of history and purpose"; fog of war starts with only the settlements and
the roads between them uncovered, so the map shows "at a glance where you've already been and
where to explore next"; water crossings carry their own marks so you always know where you can
cross. **And reviewers are not kind to the rest of it:** a confusing UI with plenty going on,
information windows displayed over other things so an overview is hard to get, and a layout
reviewers called poorly designed on consoles. Rule 33(g) already says where we differ: BB is a
still, we move.

**The real world, on small maps:**

- a map icon has to be recognisable at about **11 px**, and simple enough to survive that
- a touch target is **44 x 44**, which is four times the icon floor: a thing you must TAP is not
  the same size as a thing you must SEE
- print cartography's floors are **0.3 mm** for a point symbol and **0.25 mm** between parallel
  lines, and the smartphone study that re-derived this for pixel densities from 228 to 801 ppi
  did it at a 30 cm viewing distance, which is the phone-in-hand case
- crowded labels are handled by **priority and collision**: the important labels stay, the rest
  appear only when there is room, and leader lines pull a label out of a congested area rather
  than letting it sit on top of another one

**What that gives us for round two:** the map needs a legibility floor per mark (icon >= 11 px,
tap >= 44 px), a label priority so the valley does not print ten handles at 9 px, and one number
for "what fraction of the map's marks are under the floor".

---

## THE CONTRAST NUMBERS ARE NOT TRUSTED YET, AND I AM SAYING SO INSTEAD OF PUBLISHING THEM

The probe reads each label's colour and samples the canvas directly behind its box, which gives a
WCAG ratio. On the map every mark came back under the 4.5 bar, worst 1.08. **I do not believe
that number**, and the reason is in the method: the feed sits on a dark phone panel, and the
sampler reads the WORLD CANVAS behind that panel, not the panel. Pale text on a near-black panel
cannot be 1.08. So the sizes above are measurements and the contrasts are a broken instrument.
Round two samples the rendered screenshot instead, where what is behind the text is whatever the
player actually sees.

## BLIND SPOTS, STATED

I could not reach BB's own dev blog or the cartography paper from this box (the network policy
blocks both domains), so the BB specifics and the symbol-size numbers come from search results
quoting them rather than from the primary pages. The reading is one cut at one zoom; the map has
no other zoom yet. And the two-squeeze finding is about the CAMERA, not about whether a squeeze is
the right gesture, which is RUN's call.

## PROOF

- `tools/bohemia_eyes_map_reads.js`, three controls, built on PLUMBER's one driver rather than a
  fourth copy of the boot and the squeeze
- `records/BOHEMIA_EYES_MAP_READS_9_24_26.json`, and `records/eyes_bb_map/` for the pictures
- the squeeze table above is re-runnable and was taken on both surfaces

# BOHEMIA ADDENDUM — NAME IT OR DON'T DRAW IT (Paolo 7/26/26, LOCKED)

## HIS WORDS

> "So first off what the fuck is at the bottom of the screen like bro every time
> you make something you have to be able to describe what it is. It's so
> upsetting to me just hallucinate bullshit. You don't know what's going on...
> is a radioactive barrel on fire, but there's no radiation problems in Bohemia
> so what the fuck is going on... there's one door that's not set up to the
> walkway... you have a door that's a picture of a door. You have weird ass
> assets like sitting wrongly on top of each other... it's crazy that I can see
> a huge fucking difference between the assets that I approved of and the ones
> that you made it's really bad"

He was looking at a band of pixels across the bottom of the target screen that
nobody could name. It was an invented "perimeter wall seen from behind." It had
no reason to exist, it wasn't in any bank, and it wasn't anything.

---

## THE LAW

**Nothing goes on screen that cannot be described in one plain-English
sentence, out loud, without hedging.** If you can't say what a thing IS, what
it's DOING there, and where its PIXELS came from, it doesn't get drawn. Not
"placeholder", not "texture", not "framing element". Named or gone.

### 1. THE MANIFEST IS MANDATORY

Every art tool that composes a scene emits a manifest next to the render:
`records/target/BOHEMIA_TARGET_MANIFEST.txt` is the reference shape. One entry
per thing:

- **NAME** — what a person calls it ("the burning oil drum")
- **WHAT** — one plain sentence, minimum 18 characters, that a human would
  actually say. "a rusted 55-gallon drum with a fire going in it — somebody on
  this block is still awake and still cold at night" passes. "prop" does not.
- **FROM** — the approved bank and index, or an explicit
  `+ massing geometry` admission that pixels were invented
- **AT** — position and size in tiles

### 2. NAMING IS STRUCTURAL, NEVER BOLTED ON

The name is a **required parameter of the drawing call**. There is no way to
place a thing anonymously. Every primitive that stamps an object also calls
`drew()`; the build **dies** if the count of things drawn ever exceeds the
count of things named.

This clause exists because the first cut of the manifest was written as a
separate call sitting *beside* the drawing call, and it silently missed four
props — a barrel, two piles of rubble and a boulder. A manifest that can be
out of date is not a manifest, it's a comment.

### 3. TWO THINGS MAY NOT STAND ON THE SAME GROUND

> "You have weird ass assets like sitting wrongly on top of each other."

Object footprints may not overlap by more than 0.3 of a tile. This is checked
at build time and **fails the build**, not at review time in a screenshot.
Surfaces (road, yard, walk) may overlap freely; a door belongs to its wall and
is a `detail` of its parent.

### 4. EVERY DOOR HAS A PATH TO IT, AND IS A HOLE, NOT A PICTURE

> "there's one door that's not set up to the walkway... you have a door that's
> a picture of a door"

- A door's walk/driveway starts **at the door's own column** and runs to the
  street. A door with no path is not a door.
- A door is an **opening**: a reveal, a dark interior behind it, a floor inside,
  a lit lintel, a threshold at its base. A door-shaped picture glued to a wall
  is banned.

### 5. THE CROSSING CROSSES

> "The crosswalk isn't correct like go on the correct crossing the street"

A crosswalk spans **kerb to kerb**, its bars run **across the direction traffic
drives**, and it lines up with the walk that feeds it. A patch of stripes
stranded in the middle of a carriageway with a car parked on it is not a
crossing.

### 6. NO RADIATION IN BOHEMIA. EVER.

> "is a radioactive barrel on fire, but there's no radiation problems in
> Bohemia"

This is a **LORE** ruling, not an art one. Bohemia is a post-**economic**
apocalypse. There was no meltdown, no fallout, no contamination. Radiation
trefoils, hazmat chevrons and biohazard marks are **BANNED from every surface**,
including on assets that are otherwise approved art. The banned faces are
registered by bank and index; using one kills the build.

(Skull-and-crossbones faces are on the same banned list. Nothing in the corpus
should be labelling generic poison either — if a specific thing needs a warning
mark, it gets a ruling first.)

### 7. INVENTED PIXELS ARE A LAST RESORT AND ARE DECLARED

> "it's crazy that I can see a huge fucking difference between the assets that I
> approved of and the ones that you made"

That gap is the real problem and the honest answer is **draw less**. Anything
not from an approved bank must (a) be unavoidable, (b) say so in its manifest
`FROM` line, and (c) be structure only — massing, shading, shadow — with every
surface it exposes filled by approved material. Invented *decoration* (fences,
wires, ornamental bands) is deleted on sight. Three were deleted the day this
law landed: a chain-link fence, an overhead wire, and the nameless bottom band.

---

## THE GATE

`gates/target_screen_gate.py` holds all of it: the manifest exists and every
entry has a real name / a real sentence / a real source; drawn count equals
named count; no two objects overlap; no banned face is referenced; the crossing
spans the full carriageway and shares a column with its walk; the door shares a
column with its walk; street lamps are at least 3 tiles tall.

A law without a machine gate is not enforced.

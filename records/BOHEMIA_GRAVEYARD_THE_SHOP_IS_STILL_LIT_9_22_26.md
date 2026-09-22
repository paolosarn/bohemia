# GRAVEYARD — THE SHOP IS STILL LIT (9/21), KILLED BY PAOLO 9/22
# POST-MORTEM. LIFE + CITY.
# id: lifecity-the-shop-is-still-lit-9-21   vote: DOWN
# his words: "Not analog horror enough"

And on the battery shed, which he voted UP the same round: **"More analog horror
good idea get direction"**. Both notes say the same thing and both name the same
chat, so this is one ruling written twice.

---

## 1. WHAT WAS WRONG, READ OFF DIRECTION'S OWN TEN RULES

`records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md`.

### RULE 1: THE ORDINARY FRAME, ONE WRONG THING.
> "Two wrong things is a haunted house; zero is a screenshot."

**I BROKE THIS IN MY OWN DOCSTRING.** The dead file says *"the frame is completely
ordinary"* and then, in the same sentence, lists:

    a CRACKED lot
    three FADED awnings, one of them TORN
    a BLANK pylon sign
    DEAD trees
    stall paint MOSTLY GONE
    and then the lit shop

**Six wrong things, and then the one that was supposed to be the wrong thing.** Six
is not six times the dread. It is a ruin, and a ruin is a picture of a ruin. Nothing
in that frame could be THE wrong thing because everything in it was wrong. I wrote
the rule down at the top of the file and broke it four lines later.

### RULE 7: THE LIT STREET WITH NOBODY HOME.
> "Drawn from world data, never faked. MEASURE: the wrongness traces to a real
> world-state row."

**AND I PAINTED THE EMPTY SHELVES.** Seven bare runs because seven looked right.
They traced to nothing at all. The game has had a real stock ledger the whole time
(`engine/bohemia_economy.js`, `makeLedger`: water, food, salvage, meds, fuel per
block, deterministic per seed, with `scavDecay`'s own comment *"the easy shelves
empty"*). The single wrong thing in the frame was invented, which under rule 7 means
it was not a wrong thing, it was decoration.

### WHAT WAS NOT WRONG, AND IS NOT BEING THROWN AWAY
The building. The top-down geometry, the recessed glazing, the palette read live out
of the commercial district, the light with a real fixture behind the glass. He voted
on the TONE, not on the shop, so the shop is carried over and the tone is rebuilt.

## 2. WHAT REPLACED IT

`lifecity-the-shop-that-is-open-9-22`, **THE SHOP THAT IS OPEN**,
`tools/bohemia_the_shop_that_is_open_factory.py`.

Built the other way round:

**THE FRAME IS ORDINARY EVERYWHERE, ON PURPOSE.** Daylight. The awnings are whole
and their colours clean. The trees are alive. The stall paint is fresh and all of it
is there. The walk is swept. The sign is lit and carries writing. There is nothing
to look at.

**THE ONE WRONG THING, IN ONE SENTENCE, WHICH IS RULE 1'S OWN TEST:**

> **THE SHOP IS OPEN, THE LIGHTS ARE ON, AND THERE IS NOTHING ON ANY SHELF.**

**AND IT TRACES TO A ROW.** How many runs still hold anything is read by RUNNING the
ledger, not by reimplementing it:

    food on the block          287
    eaten                      34.0 a day
    scavDecay at day 240       0.397
    left                       113.9
    DAYS OF SUPPLY             3.35
    -> 5 of 7 runs BARE, 2 still hold something

Change the economy and this picture changes. The factory **refuses to run** if it
cannot reach the ledger, because a made-up number there is the exact defect being
buried here.

## 3. THREE THINGS THE FIRST RE-CUT STILL GOT WRONG, FOUND BY LOOKING

- **The trees were boulders.** I coloured the canopy with palette code 13, which is
  the ROOFTOP PLANT: painted metal, a warm grey. Code 22 is the olive the commercial
  district actually plants with, and it is the colour of the bed they stand in.
- **The sign read as a keypad.** The board is sixteen pixels across and I drew
  letters in it; a three-pixel glyph is not type. At this scale writing reads as even
  dark rows of uneven length.
- **The door read as a crate** parked against the window. A door is a hole with a
  frame: dark on all four sides, the same light inside it that the room has, and the
  leaf folded back against the jamb.

## 4. THE LESSON, WHICH IS THE ONE THIS LANE KEEPS EARNING

**WRITING THE RULE AT THE TOP OF THE FILE IS NOT OBEYING IT.** The dead factory
quotes rule 1 and rule 20 correctly and then does the opposite in the next sentence,
and every gate it had was green. A law without a machine gate is not enforced, and
the gate for rule 1 does not exist yet: **name the one wrong thing in one sentence,
and prove the frame has no others.** Until it does, this lane reads the ten rules by
hand, out loud, against its own picture, before it registers anything.

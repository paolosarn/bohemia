# COMBAT T9 — EXPOSURE HAS A PRICE, AND TWO THINGS I SHIPPED GET PULLED (8/1/26)

Paolo's T9 list, worked item by item. **Two of these are rejections of things I
shipped. Those get pulled, not re-argued.** Everything below was proven on the
real surface before it shipped. Combat gate 583 -> 598, all green.

---

## 1. "IT SHOULD BE REALLY HARD TO GET THAT GREEN" — the hole was embarrassing

> *"if I'm currently not don't have cover and I'm fully exposed... as long as I
> press the green action button when people are popping in and out... it should
> be more punishing... if there's three or four enemies with cover like I'm fully
> exposed no cover it should be really hard to get that green like really hot
> depending on how many enemies obviously it slides with how many enemies have
> cover trying to shoot at you"*

He is right and the gap is bad: **standing in the open against four covered guns
pulled the exact same dial as standing behind a wall against one.** The dial has
had a FLOOR mechanism since v95 (the chain ramp) and the most basic tactical fact
in the game was not using it.

PRESSURE IS A FLOOR now, the same shape, so his 7/27 point-blank ruling survives
intact — closing the distance still buys a friendlier dial, it just can no longer
cancel the cost of standing in the open. It counts **only** the situation he
described: a gun that is behind cover, holding a line on you, that you have no
cover from. A gun in the open is a target, not pressure; a gun you are covered
from is not shooting at you.

| covered guns on you | dial floor |
|---|---|
| 1 | none — it is a duel |
| 2 | HARD |
| 3 | V.HARD |
| 4+ | **BOHEMIAN** |

MEASURED: 1→0, 2→2, 3→3, 4→4, and taking cover from one of three drops the count
to two. And the headline **says why**: `IN THE OPEN · 3 COVERED GUNS ON YOU`,
because a difficulty that changes without telling you is the tally mistake in a
new costume.

## 2. THE THIRD SHOT IS BOHEMIAN, FLAT

> *"that third shot, I want it to be a Bohemian difficulty pattern not even very
> hard just straight up Bohemian difficulty pattern"*

The v95 ramp (V.HARD then BOHEMIAN) is deleted, not re-tuned. Past the allowance
there is one answer. That is also the cleaner promise: **the allowance is the
whole negotiation.**

## 3. THE ORANGE, SEVENTH REPORT — and this time it was not the dial

Instrumented again. The ghost fans v107 killed stayed dead. What was lighting up
the kill:

```
232x  stroke rgba(232,214,172,0.92)   the deck KICK RAIL
 29x  fillRect rgba(232,214,172,0.95) the STAIR TREAD lips
145x  stroke rgba(186,170,132,0.5)    the dial's major ticks
```

**It was THE TWO-STOREY, the brightest warm object in the game.** And the cause
was DRAW ORDER, not colour: the killshot dim (v94) fired inside the FLOOR block,
and the deck, the stairs and the cars all draw *after* it at full brightness. The
one thing the dim exists to push back was the one thing exempt from it.

Two fixes, because seven reports is enough evidence that dimming is not removing:
the dim now lands **after the whole environment**, and the highlights go dark **at
the source** during a kill. MEASURED AFTER: zero `rgba(232,214,172)` draws during
a killshot.

## 4. "THIS OPAQUE BLACK TRANSPARENT SHADOW RECTANGLE THAT POPS UP NOWHERE"

Found by instrument and it is exactly what he called it:
`fillRect rgba(0,0,0,0.28) rect -41,566,74,74` — a grid of **solid** 74x74
squares that merge into one hard black rectangle, slid into frame by the killshot
zoom. The code's own comment says *"a scaffold throws a BROKEN shadow, because it
has gaps"* and then drew a slab. **The comment was right and the code was lying.**
Slatted now, from the same board count that casts it.

## 5. "THERE'S INVISIBLE PILLARS SOMETIMES" — 1.7%, and it was mine

MEASURED: **10 of 588 cars across 300 rolled arenas had no nose cell** — solid
cover with no sprite.

A car is six pillar cells and only the flagged NOSE cell draws (v104). The deck
is built after the cars and evicted pillars under its slab **cell by cell**, so a
deck corner landing on a car deleted its nose and left five invisible solid cells
behind. A per-cell filter on a multi-cell object was always going to do this.
**A car is evicted whole or not at all.** MEASURED AFTER: 0 of 572.

## 6. THE BEADS COME BACK

They were never removed. They were dialled **down twice on his own instruction**
(7/3 "an indicator, never a dominator", 7/4 "down another 40%"), which left red at
0.30 alpha on a 430px phone. *"I want them to come back for now"* reverses that.
Red and amber back up; his ORDERING (danger outranks its warning, tucked stays
nearly invisible) untouched.

## 7. SPRINT IS ONE TILE

His ruling. The distance cheat is gone; **the verb is the whole point** — a
movement action that does not end your turn.

## 8. THE WAREHOUSE IS OFF — a rejection, not a note

> *"The warehouse arena is dog shit it gives me anxiety looking at it like it
> looks really bad. The only one I'm comfortable playing on is street."*

Second time the two-storey arena has come back at me. **It is off.** Not argued,
not re-tuned. `buildWarehouse()` is NOT deleted — nothing is graveyarded without
his word — it is unreachable. Every fight is the street.

## 9. A DYING MAN DOES NOT STAND UP

> *"if they're like crawling then they stand up when I get next to them to finish
> them off"*

Exactly right, and it was one line: `handsup112` is a **standing** hands-up pose.
The v32 intent was KNEEL AND BEG and the clip that got wired put a man on his
feet, so walking over to finish a dying man stood him up. handsup belongs to the
BROKEN, who surrendered without ever falling.

And *"when I do finish them off they don't do any animation"*: `finishHim` set the
clip clock 1200ms in the past, starting the 12-frame death clip at frame 8 — four
frames, from a body already lying flat, into an end pose also lying flat. **There
was nothing to see because nothing moved.** Frame 5 now. A purpose-cut execution
beat is an art request, not something to fake.

## 10. TWO BULLETS, TWO BANGS — on one clock this time

Second time he has said it, so re-tuning the delay again would have been the
fourth-version mistake. The real defect: the report fired on a `setTimeout` while
the second bullet spawns off the killshot's own travel fraction. **Two clocks
agreeing only by luck.** The second report now fires *from* the killshot when the
round leaves the muzzle. See two, hear two, by construction.

---

# NOT DONE, AND WHY — three of his items

- **THE TWO-STOREY REBUILD + THE RESEARCH HE ASKED FOR.** *"you need to work long
  and hard do big brain online video game pixel asymmetric research of how games
  create second stories... I'm very unhappy with your two story system right
  now."* This turn made it stop screaming during a kill and stop throwing a black
  slab, and v106 made the stairs walkable with a real edge rule. **That is not the
  rebuild he asked for.** What he actually named — how the camera should behave
  when you are behind it, what happens at the edge when you are on top, whether
  you can jump off — is a design job that deserves the research first, and doing
  it badly a third time is the failure mode the STOP PRODUCING law names. It is
  the top item and it is next.
- **SWAPPING IN THE NEW CHARACTER MODELS / HAIRSTYLES / CLOTHING.** He is right
  that they exist and right that combat should use them. **That is another
  session's system** (character/wardrobe), and ONE SYSTEM ONE SESSION says this
  lane does not reach into it. It needs a handoff, not a raid.
- **A PURPOSE-CUT EXECUTION BEAT**, and the third distinct death fall from v109 —
  both on the animation request board, neither cooked here.

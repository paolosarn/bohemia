# THE PORTRAIT IS THE SAME PERSON AS THE SPRITE
## PORTRAIT lane, row [matches body], round 1 (9/20/26)

**Paolo, 9/20, opening this chat:** "remember it has to be connected to the hairs and eye
color and shit."
**Paolo, 9/14:** eye colour, hair colour and the hairstyle "damn near the same" on the small
overworld sprite and the HD portrait.

Tab: **CHARACTER**, and every person in the RUN and the CITY. The demo was not re-cut
(rule 14a, only RUN cuts it).

---

## WHAT WAS MEASURED, BEFORE A LINE WAS CHANGED

200 citizens, **dressed exactly as the crowd dresses them** (BOH_PERSONLOOK.lookFor plus
NPCFactory's equipment, front facing, idle), each rendered twice: the HD portrait that pops
up when they talk, and the body standing in front of you.

| | result |
|---|---|
| the haircut | **200 of 200 agreed** — 8/28 fixed it and it has held |
| the eye colour | **135 of 200 exactly right, 0 wrong.** The body draws that person's own iris at exactly 0.55 of the portrait's. The other 65 have **no eye visible on the body at all** |
| **the hair colour** | **23 of 200 were two different people.** Worst case **15.4 times apart in brightness** — a near-white portrait over a near-black head |

Every one of the 23 carried the **ART DEFAULT** hair colour (NPCFactory entry 4, `null`).
25 citizens in 200 carry it; **23 of those 25 were wrong**, and the two that were right were
the two wearing no cut at all.

Proof sheet, before over after, six art-default citizens with no hat so the hair is actually
visible on the body: `records/target/BOHEMIA_PORTRAIT_MATCHES_BODY_9_20_26.png`.
Every number above: `records/target/BOHEMIA_PORTRAIT_MATCHES_BODY.json`, written by
`tools/bohemia_the_portrait_is_the_same_person.js`.

---

## THE CAUSE WAS ONE WRONG READ, AND IT WAS REFUTED EIGHT LINES ABOVE ITSELF

`hairColor === null` means "use the painted art default". **There are two painted art
defaults, and that is the whole bug.**

- `faceFor` read `PD_DATA.ramps[_np.equipped.hair]` — the painted hair **LAYER**, whose mid
  is `[237,232,220]`, near white.
- The body draws `worn.hair` — a genHair **CUT** (DEEP TAPER, ROPE LOCKS, SHAG…), in the
  ramp that cut was **authored** with, mostly near black.

**92.4% of citizens wear that cut, and that number was measured on 9/11 in the same commit,
eight lines above the code that got this wrong.** The 9/12 cook fixed the colour for
everyone who has a palette colour and wrote down, correctly, that "a worn garment makes the
draw skip the PD hair layer" — then resolved the null case off the layer it had just said
nobody draws.

This is the third time the same shape has been caught on this pair of renderers: the haircut
SHAPE on 8/28, the hair COLOUR for palette colours on 9/12, the hair colour for the art
default now.

---

## THE FIX: THE CUT SAYS WHAT COLOUR IT WAS AUTHORED IN, AND BOTH SURFACES ASK IT

No new table, no second picker, nothing kept in step by hand.

1. **`genHair` writes it down on its first line.** `HAIR_AUTHORED[opt.name] = opt.ramp`,
   behind a `typeof` guard — `clothes_4x_gate` rebuilds that function with `new Function`
   where the name does not exist, and any other form throws there and moves 560 pinned
   garment hashes. The file already records that lesson eight lines down; this follows it.
2. **`window.hairAuthoredRamp(cutName)` hands it back.** A cut never drawn is primed by
   calling that garment's own `gen` with an **empty head** — genHair records the ramp on its
   first line and returns `{}` the moment it finds no head pixels, so nothing is drawn and
   no pixel moves.
3. **`faceFor` asks the cut first**, and falls back to the layer only for the citizens who
   really are drawn from it. `lookFor` is now read **once**, above the colour and used again
   for the dials, instead of twice at two different times — two reads of one fact is the
   shape that drifts.

**AFTER: 0 of 200 differ.** The whole crowd now sits at or under 2.01x in brightness — the
exact ceiling the 175 citizens on the path that already worked already had.

---

## THE RULER, AND THE TWO WAYS IT WAS WRONG FIRST

**It finds the pixels by what they respond to, never by a colour it guessed.** The eyes are
the pixels that change when you change that person's iris; the hair is the pixels that change
when you hand them another colour.

**MY FIRST HAIR PROBE MIS-BLAMED 26 OF 200 PEOPLE.** I probed with an off-palette colour.
`hairWear()` only answers to a colour the palette knows, so the probe fell through to the
cut's authored ramp — and when the person's real colour **was** that ramp, the render did not
change and perfect agreement read as "the body ignores the colour". The probe has to be a
colour **the game's own palette knows**. Twenty-six innocent citizens, and the reading looked
exactly like a finding.

**MY FIRST HUE RULER FLAGGED TWO GREYS AS DIFFERENT COLOURS.** It bucketed hue into 30-degree
bins, so two colours 0.03 degrees apart across a bin edge read as a mismatch, and two greys at
3% and 8% saturation read 75 and 137 degrees apart. The colour law's own gate already solved
both: a circular **distance** with `NEAR = 30`, and a **drab guard** — a colour with no
saturation has no hue to lose. `faction_colour_gate.js:426`. One ruler, two lanes, no
argument about what "the same colour" means.

**THE BRIGHTNESS BUDGET IS MEASURED, NOT PICKED.** A 64px portrait and a 26px head never
shade the same, so some gap is honest. The 175 citizens on the working path: median 1.24x,
99th 1.98x, **max 2.01x**. The 25 on the broken path: 1.04x to **15.40x**. The budget is
**2.20**, ten percent over a measured ceiling, and the two populations do not overlap — it is
a wall between them, not a preference.

---

## AND THEN MY OWN FIX WENT RED IN SOMEBODY ELSE'S GATE, TWICE, AND NEITHER WAS SWALLOWED

`talking_portrait_gate` was **29/0 on a clean origin/main worktree** and **26/3** on my tree.
All three were mine. That worktree is the only way to know.

**RED 1 — the gate's own helper held the bug it was checking for.** `effHair()` computed the
art default off the PD hair **layer**, the same wrong place `faceFor` read, so the two
confirmed each other at 100% while 23 of every 25 art-default citizens were two people. **A
ruler built from the same mistake as the code reports perfect agreement.** It asks the cut
now, through the same one resolver. **Proved:** with the fix reverted the arm now reads 90%
and goes red; under the old helper that same revert passed.

**REDS 2 AND 3 — two face-distance floors fell, because a lie was removed from them.** The
metric averages luminance over all 4,096 pixels of a portrait, and 7 of those 60 faces had
near-white hair that **no body in the valley ever drew**. Near-white sits far from everyone,
so those seven were inflating both numbers.

**Proved pair by pair rather than asserted.** On origin/main the closest eight pairs contain
**no** art-default citizen and the closest is `25/31` at 0.0194. After the fix, the five pairs
that move ahead of it **every one** contains an art-default citizen, and `25/31` is still
0.0194, unmoved. The crowd did not get less varied. It stopped being measured against a
colour that was not there.

**The floors were re-grounded with the OLD headroom, not a new opinion.** 9/11 pinned 0.017
against a measured 0.0194 (87.6%) and 0.085 against 0.0884 (96.1%). The same two fractions of
today's honest 0.01634 and 0.07632 give 0.0143 and 0.0733. Nothing else was chosen.

**AND THE REAL WORK IS NAMED, NOT SWALLOWED.** This is the second time colour has been caught
carrying identity the **geometry** was supposed to carry — `faceFor` says so in its own hand
on 8/27, widened its skull ranges for exactly that reason, and the number it won back was
partly this same lie. **The faces are genuinely too alike.** Widening them is this lane's row
**[blank faces]**, school first, and these floors may only go up from here.

---

## MEASURED AND NOT FIXED, ROUTED

**65 of 200 citizens show no eyes on the body at all** — 53 behind opaque shades, 7 under a
hat, 5 neither. The colour is right for all 135 that do. But a person wearing shades on the
street has **bare eyes in their portrait**, which is ONE ID ONE WHOLE PERSON pointing the
other way: the portrait does not wear the glasses the body is wearing. That is a new line for
this lane, not this row, and it is not touched here.

**The 5 with neither shades nor a hat** are not explained yet. Named, not guessed at.

---

## GATES

**NEW: `gates/portrait_matches_body_gate.js` — 11 passed, 0 failed.** Registered in the suite
as **PORTRAIT MATCHES BODY**. It holds the hair colour on rendered pixels, the art-default
population specifically, that every canon cut can say what it was authored in, that the body
draws that person's own eyes, the haircut, and two negative controls ("not passing because
everybody is bald", "eyes reach most of the crowd at all").

**MUTATION-PROVED THREE WAYS, each on the right claim:**

| mutation | result |
|---|---|
| the portrait reads the painted layer again (the old bug) | **RED** — 17 of 120 differ, worst 10.88x |
| the body reads the player's face again (pre-8/27) | **RED** — 0 of 120 bodies draw their own eyes |
| a cut stops recording the ramp it was authored in | **RED** — 0 of 11 cuts can answer, and the hair claim falls with it |

Restored: **11/0**, and the tree is byte-identical to before the mutations.

**PRE-PUSH PASS** (the gates that read what this diff touches):

```
clothes_4x        13/0   <- all 1,744 pinned garment hashes UNMOVED, the genHair risk
talking_portrait  29/0   (29/0 on origin/main; my 3 reds fixed at root, not widened)
portrait_haircut  12/0      hair            39/0      hairline        12/0
craft_law         39/0      face_maker      13/0      hair_graveyard  13/0
family            15/0      become          28/0      alpha_loads     20/0
portrait_matches_body 11/0  NEW
face_thumb        22/1   <- IDENTICAL 22/1 on a clean origin/main worktree. NOT MINE.
```

Full suite: unmeasured by this lane this round. Rule 13's honest sentence: **pre-push pass
green; full suite 107 red at ad23d875, and of those, none are named as this lane's.**

---

## RULE 18

Shipped to the alpha under **18(f)** — his direct ask, small, and it touches none of the
three things the playable cut is held for (loading, walking, the fight). It is also the
fourth thing's material: rule 19(d) puts a person at his door **with a portrait**, and that
portrait had white hair over a black-haired body. **The demo was not re-cut.**

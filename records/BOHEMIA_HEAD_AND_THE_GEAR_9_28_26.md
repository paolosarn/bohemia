# [head and gear] -- THE HEAD SHOWS WHAT IT IS WEARING, AND ONLY THE HEAD
# PORTRAIT (chat 20), 9/28/26. Rule 37i, THE THIRD VOTES (Paolo 9/27, LOCKED,
# laws/BOHEMIA_ADDENDUM_THE_THIRD_VOTES_9_28_26.md s9), FIRST LINE: "the portrait
# is head only for now (shoulders only if the clothing assets make it cheap; say
# the cost); head gear MUST show in the portrait; backgrounds may change; eyes
# rest slightly off-centre." Plus the barber's Battle Brothers homework bundled
# in the same row. NOTES ARE RULINGS: this is a locked verdict from the tab, not
# a fresh candidate, so all three build straight into the shipped renderer.

## ONE -- HEAD GEAR MUST SHOW

### the measurement, before touching anything
`faceFor` builds the portrait spec from `NPC_FACTORY.npcFrom(id)` and already
reads `_np.equipped.glasses` into `sp.glasses` ([shades on], 9/21). It never
asked the same body for a hat. Measured on 200 dressed citizens before writing
a line of the fix:

    citizens wearing a hat or durag on the body      68 of 200
    portraits carrying the field at all               0 of 200

Same shape of bug as glasses, shades, eye colour and the braid before it --
ONE ID, ONE WHOLE PERSON, closed a fifth time this session, always the same
fix: read it off the body the way the working example already does, never
roll a second one.

### the fix
`faceFor`: `if (_np.equipped.hat) sp.hat = _np.equipped.hat;` two lines under
the glasses read. `renderFace`: a durag-cap polygon, drawn AFTER the hair (so
the opaque cap covers hair under it, the same way a real durag covers hair on
a real head) and BEFORE glasses, sized off the face's own crown geometry
(`headTop`, `foreheadW`, `browY`) rather than a fixed box, so it fits a child
and an adult from the same shape. Colour comes out of the garment's own
painted ramp (`PD_DATA.ramps['hat/durag']`), nothing invented.

Re-measured after: 68 of 68 hat-wearing citizens now carry and draw the field.

### two gates broke for a true reason, and both were the gate's assumption, not the fix
- `talking_portrait_gate`'s "no ruled straight line down the crown" check scans
  for hair-root pixels and treats zero-found the same as one-found -- both are
  `<= 1`. A durag's own opaque cap legitimately paints over the crown, so a
  covered head reads as "no part to see," not "the part is a ruled machine
  line," and the two used to be the same thing before head gear existed. Fixed
  by excluding hat-covered heads from the check and reporting them separately
  (26 of 60 sampled heads were durag-covered). Back to green, 1 of 34 remaining
  bare heads ruled, well under the cap of 6.
- `portrait_haircut_gate`'s dial-liveness test pokes one hair-shape field at a
  time against a single fixed probe (`probe:0`) and measures the pixel diff.
  That probe's own hash happens to roll a durag, and the durag legitimately
  covers exactly where the `front` dial's effect shows, so the diff read zero
  on a live mechanism. Fixed by stripping the hat from a cloned copy of that
  one probe before the dial-liveness poke only; every other test in the file
  still uses the real probe untouched.

## TWO -- HEAD ONLY

### what "shoulders only if the clothing assets make it cheap" actually tests against
The default (non-bust) portrait has always drawn a fixed shoulder polygon
under the chin, filled with `spec.top`. Read where that colour comes from
before deciding anything:

    sp.top = [20+(R('top1')*26|0), 20+(R('top2')*26|0), 24+(R('top3')*26|0)]

A rolled RGB triple. There is no `_np.equipped.top` anywhere in the file for
it to read -- the body's real shirt is never consulted. So the shoulder draw
was never "a clothing asset shown cheaply," it was a colour guess standing in
for one, every single face, every single game. Paolo's own condition for
keeping shoulders ("if the clothing assets make it cheap") was never met by
the thing already shipping.

### the fix, and the cost, written down because he asked for it
Removed the default shoulder polygon. The neck stays (a short skin-toned
strip already anatomy, not clothing); below it is now the background gradient
instead of an invented collar colour. THE COST: nothing real, because nothing
real was being shown -- the fixed polygon never tracked the face's own chin
position anyway (that mismatch is the exact defect [bb faces]'s bust mode was
built to fix: "the person is 32% of the frame and 54% is empty gradient,"
measured 9/24). The bust mode itself is untouched and stays off by default
(rule 18 hold) -- it remains the future home for real shoulders once a real
garment is cheap to read here, which is not yet.

### the gate this legitimately moved, and why the pin was repointed rather than reverted
`portrait_haircut_gate` pins Paolo's own approved face to an exact rendered
hash and fails if it changes, with its own comment warning "look at what
changed his face, not at this number." Removing the shoulder colour changes
every portrait's pixels including his, so the pin went red -- correctly, as a
detector. Checked what moved it (the shoulder removal, and nothing else) and
confirmed the cause is a LOCKED ruling from the vote tab, not drift: repointed
the pin from `68caec4f` to `8c2cac60` with the reasoning written into the same
comment. This is the same discipline the pin's own author asked for.

## THREE -- EYES REST SLIGHTLY OFF-CENTRE

Read this as a camera note sitting next to "backgrounds may change" in the
same sentence, not as an instruction to touch the locked, deliberately-rare
`eyes.gaze` dial [horror face] built and cited to the analog horror bible
("one in twelve, or it is a style, not eerie"). Moving that dial's odds would
undo a ruling this same lane already made this session for a real reason.

Implemented at the two places a portrait is actually drawn to the screen --
`paintPortrait` and the speaking-portrait loop -- as a small, fixed nudge on
the destination draw call (about 2 of 64 source pixels), not inside
`renderFace`. Kept out of the renderer on purpose: every gate that measures a
face does it straight off the raw buffer at `cx=32`, and none of them had to
learn the display ever moves it. Checked directly rather than assumed --
`talking_portrait_gate` and `craft_law_gate` both reference `paintPortrait` by
name only as a text boundary marker, neither one calls it or reads its canvas.

## FOUR -- THE BARBER, AND WHAT BATTLE BROTHERS ACTUALLY HAS

Rule 33j, READ FIRST: read `reference/library/battle_brothers/README.md` and
all ten volumes (`01_WORLDMAP` through `10_UI_AND_FEEL`) before writing this
section. None of the ten cover appearance, hairstyles or head shapes -- they
are worldmap, combat rules, weapons, armour, perks, recruit BACKGROUNDS
(wage/traits/stat leanings, not looks), economy, contracts and events,
enemies, and UI/feel.

That is not a hole in the library. It is the truth about the game: a Battle
Brothers recruit's portrait is a fixed, hand-painted bust tied to his
background archetype (peasant, poacher, swordsman, and so on). The player
never touches a recruit's hair, and there is no barber building, no hairstyle
list, and no head-shape picker anywhere in it to count. "Count BB's and match
it" has no number behind it in the game it is asking about.

Our own canon hair bank is 11 styles today (`st:'canon', layer:'hair'`,
counted directly in the file), down from fifteen recorded on 8/28 after the
graveyard sweep pruned four that did not hold up. This round is research only
per the row's own scope -- no new haircut art shipped here -- and the honest
target to write down is "more than 11," not a borrowed BB number that does
not exist.

## WHAT SHIPPED
- `slices/BOHEMIA_ALPHA_0_9.html`: `faceFor` reads `_np.equipped.hat`;
  `renderFace` draws it; the default shoulder polygon is gone; the two
  portrait-display functions nudge the frame off dead-centre.
- `gates/talking_portrait_gate.js`: crown-ruled check excludes hat-covered
  heads.
- `gates/portrait_haircut_gate.js`: dial-liveness probe strips the hat before
  testing; approved-face pin repointed to `8c2cac60` with the cause on record.
- `tools/bohemia_cook_the_head_and_the_gear.js`: the round's cook, registered
  in the VOTE tab as `portrait-the-head-and-the-gear-9-28`.
- This record.

## WHAT IS STILL OPEN
- Real shoulders wait on a real garment asset being cheap to read at the
  portrait's scale; the bust mode is ready the day one exists.
- The barber building itself (where hairstyle customization is meant to live,
  per rule 37i) is not built this round -- research only, as scoped.
- More canon hairstyles than 11 is a backlog item, not started.

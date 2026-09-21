# THE LIST IS EMPTY: A STRANGER MEETS ZERO FACES IN FIVE MINUTES
## PORTRAIT lane, row [faces first], round 1 (9/21/26)

The row says: *"the first faces to redo are the ones a stranger meets in the demo's first
five minutes; list them from the one driver's walk, redo those before any other."*

**THE LIST CAME BACK EMPTY, AND THE FACES ARE NOT THE REASON. THEY CANNOT BE REACHED.**

Tab: the faces live in the cold open, which is **NOT IN A TAB YET** for a demo player.
The four candidates are now in the **VOTE** tab in the alpha, behind the gear.

---

## WHAT THE WALK MEASURED

Walked with the one driver (rule 14g) on a **fresh cut of the current alpha**, made with
the real cutter into a throwaway file so the committed demo was never touched, phone
profile, 4x CPU throttle.

| | |
|---|---|
| walk length | 300 s after the door |
| taps on things a player can see | **139** |
| `renderFace` calls | 33 |
| distinct faces among them | **1, and it is the player's own** (PUNK, hair 216,208,192, iris 150,160,150) |
| `faceFor` specs built | 25 (the family four, three times each; thirteen faction ids once each) |
| faces ever shown on the glass | **0** |

Door at 75.5 s at 4x, 18.5 s at 1x. 13 controls on screen at the door, none of them a
person.

---

## THE CAUSE, READ OFF THE PAGE AND NOT GUESSED

There is exactly one surface in this game that shows a face: `#openFace`, 56x56, driven by
`openCaption` in the cold open. `openStart` is called from **one** place: a click on
`#openWatch`, the button on an invite banner.

Walking the wrapper's ancestors, 10 s after the door, in the demo:

```
#openWrap    display none      0x0     <- the cold open itself
#p-run       display none      0x0     <- THE PANEL IT LIVES IN
#stage       display block   390x844
#app         display flex    390x844
body         display block   390x844
```

**The cold open sits inside `#p-run`, and the demo shows `#p-city`.** The whole opening is
inside a panel the demo never displays.

And the invite that would start it is stuck:

```
openShould()      true      <- the game agrees the opening should be offered
openHasProgress() false     openFrontUp() false     OPEN_MIDFLIGHT false
#openInvite       parent #p-city   dataset.want "1"   display "none"
CITY_BUSY         false
```

`want=1` means `openInviteShow()` ran and did its job. `display:none` with `CITY_BUSY`
false at the same moment is a state the code cannot get out of on its own: the only line
that turns the banner back on lives inside `cityChromeIn`, which runs on a `message` from
the city. Once the city has stopped posting, a banner hidden during a busy moment stays
hidden. **The story hook is invisible and the game thinks it is showing.**

---

## THE FOUR FACES THAT DO EXIST, AND WHAT THEY SAY

Driving `openStart()` directly, the opening plays in full: **67 caption beats, 43 of them
spoken lines, four speakers.**

| speaker | lines | hair | eyes | skin | cut | age |
|---|---|---|---|---|---|---|
| mother (DENISE) | 16 | 32,30,27 | 80,110,150 | brown | ROPE LOCKS | adult |
| father (RAY) | 11 | 150,120,80 | 80,110,150 | fair | LAYERED FALL | adult |
| sibling_older (MARCO) | 10 | 26,28,40 | 80,110,150 | tan | SHAG | teen |
| sibling_lost (NINA) | 6 | 32,30,27 | 80,110,150 | tan | LAYERED FALL | child |

Sheet: `records/target/BOHEMIA_THE_FOUR_FACES_HE_MEETS_9_21_26.png`, each at the real 56px
and at 5x.

**All four have the same eyes.** 80,110,150 for every one of them. That is heredity working
as written (eye colour is copied from a parent, never averaged, by design since 8/31) and it
is still four out of four, which is worth knowing before anybody calls it variety.

---

## I LOOKED AT THEM, WHICH IS THE ONLY REASON THE NEXT PART IS HONEST

At 5x, three things are wrong on all four faces, and they are the same three things:

1. **The eye is a white rectangle with a solid block of colour in it.** No pupil, no dark
   ring, no lid shadow. It reads as a bead, not an eye.
2. **The mouth is a flat rectangle.** No lip line, no corners, no shadow under the lower lip.
3. **There is no light.** Nothing on the face mass is shaded: no brow shadow, no nose
   shadow, no chin, no cheek turn. A face with no light source has no form, and "blank" is
   exactly what that looks like.

The hair is the best thing on all four; it has texture and volume and it reads.

At the **real** 56px the faces are a dark shape with two pale dots, which is word for word
what EYES saw on the street on 9/15. **These three go to [blank faces] as the measured
starting point. No face was redrawn this round** -- that row is SCHOOL FIRST and jumping it
is how this lane would produce a fourth version of something nobody asked for.

---

## MY OWN INSTRUMENT WAS WRONG TWICE AND A CONTROL CAUGHT IT BOTH TIMES

**FIRST: absent and hidden read the same.** My visibility poller did `if(!el) return;` and
only recorded when a face was shown, so "0 faces on glass" could equally have meant the
element does not exist. Two different findings, one number.

**SECOND, AND IT IS THE ONE THAT MATTERS: THE POLLER WAS BLIND AND I NEARLY REPORTED ITS
ZERO AS THE GAME'S.** I forced `#openFace` visible as a positive control and the poller
still counted zero. The first control was my own mistake -- I opened the child while its
wrapper stayed hidden. **The second control opened the wrapper too, and it was STILL zero.**
A CSS-reading poller cannot see through an ancestor chain it is not walking.

So the instrument was thrown away and replaced with **the game's own signal**: hook
`openCaption`, the one function that decides a face is shown and for whom. Positive control:
plant a caption, the recorder goes 0 -> 1. **It works, and only then is a zero worth
anything.** Every number in this record comes from the version that passed its control.

This is the fourth ruler in this lane's short history to report perfection because it could
not see its target. The rule it keeps proving: **a zero is not a measurement until something
has made it move.**

---

## THE DRIVER GREW ONE OPT-IN HOOK

Rule 14(g) says every lane that walks the five minutes uses the one driver or extends it.
`opts.arm` runs a string of JavaScript on every new document **before any page script**, in
the page and the city frame. A question like "whose face does a stranger meet" is a list of
calls that have already happened; anything attached after boot has missed them. Off unless a
caller passes it, the same shape as PLUMBER's `opts.serve`. This lane's own [a human being]
round took three cuts to learn the same lesson.

---

## WHAT I DID NOT TOUCH, AND WHY

The demo cut, `#p-run`, and the invite banner belong to RUN and UI. ONE SYSTEM, ONE SESSION.
Reaching into another lane's surface to make my own row shippable is the violation STOP
PRODUCING names by its right name. **Routed, with the measurement, not with an opinion.**

`[faces first]` stays **CLAIMED, not shipped.** Its ship test is faces a stranger meets, and
until somebody can reach a face there is nothing to test. Marking it shipped because I did a
lot of work would be the half-done line rule 6 warns about.

---

## IN THE VOTE TAB NOW

Four `face` candidates, one per person, each showing the real 56px beside a 6x blow-up, so
his comment lands on one face and not on a sheet. That is the direction channel this lane's
MODE line names: he speaks along per face, and the next candidate quotes his words back.
Registry: `records/target/BOHEMIA_VOTE_REGISTRY.json`, ids
`portrait-face-{denise,ray,marco,nina}-9-21`; the cards themselves in `slices/vote/`.

The first cut put those four PNGs in `records/target/vote/` because that is where the
registry lives, and the vote gate went red: `vote/...` is resolved relative to the TAB
PAGE, which is in `slices/`. The gate caught a link that would have been four broken
images in production and a row he taps that shows nothing. 28/0 once they moved.

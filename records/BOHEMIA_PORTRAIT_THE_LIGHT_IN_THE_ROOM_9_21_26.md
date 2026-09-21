# THE LIGHT THAT WAS IN THE ROOM
## PORTRAIT lane, row [horror face] inside [faces first], round 3 (9/21/26)

**Rule 22: a making lane cooks every round.** This is the cook. Four faces, lit by the
fixture their own scene names. **VOTE** tab, in the alpha, behind the gear, one card each.

Bible rule 4: *"every lumen has a source you can point at (sky, CRT, sign, lamp) ... no
mood gradient, ever."*

---

## THE SCENE HAS BEEN NAMING ITS OWN LIGHT THE WHOLE TIME AND NO FACE EVER READ IT

The authored scene data carries a `light` field on its beats. Counted across the alpha:

| value | scenes |
|---|---|
| `dim_interior` | 4 |
| `warm_interior` | 2 |
| `open_sky` | 1 |

`warm_interior` appears **exactly twice in the whole file**, and both are the scene data
itself. **Zero mentions in any renderer.** The family sit at a table under a bulb, the game
writes that down, and then paints their faces with nothing.

So the fixture did not have to be invented, argued for, or asked about. It was already his,
in the file, waiting to be read. MECHANISM MINE, CONTENTS HIS.

---

## WHAT A ROOM DOES TO A FACE, MEASURED

Left-half against right-half mean luminance, skin only, rendered pixels. `m` is the whole
face's mean, which is how a dim room differs from a bright one:

| face | now | open sky | warm interior | dim interior |
|---|---|---|---|---|
| DENISE | spread **1.9** | 6.0, m83.4 | **16.6**, m78.5 | 14.4, m68.1 |
| RAY | spread **4.4** | 7.5, m149.3 | **26.8**, m141.1 | 22.5, m123.2 |
| MARCO | spread **2.1** | 7.2, m124.3 | **21.1**, m118.4 | 17.4, m104.5 |
| NINA | spread **1.8** | 8.9, m126.0 | **23.7**, m119.4 | 18.6, m104.9 |

A bulb a foot from somebody's face is a point source: narrow lit band, fast falloff, big
spread. The sky is broad and even: small spread. A dim room is the bulb's shape with the key
pulled down: the mean drops 12 to 16 points while the spread stays high. The three fixtures
do not overlap on either number.

---

## WHAT THE FIXTURE CHANGES, AND WHAT IT DELIBERATELY DOES NOT

**It changes the shape of the light.** Falloff and key.

**It does not change the hue.** A warm bulb really is amber, and painting that means
inventing colours this face does not own. STRUCTURE-NOT-COLOR, and the same rule this lane
held last round: every shaded pixel lands on one of the four entries that face already has.
**Said out loud rather than quietly shipping a colour nobody approved.** If he wants the
amber, that is a ruling and a palette, not a thing I take on my own.

---

## THE IDLE, AGAINST THE BIBLE'S OWN NUMBER

Rule 6, THE STILL FACE, measure: *"idle portrait: at most one micro-move per 8 beats."* At
120 BPM a beat is 500 ms, so the budget is one move per 4000 ms.

Simulated on the real `facePerform`, ten minutes per face, four faces, counting every blink
and every brow drift as it starts: **585 moves, one every 4103 ms, 8.21 beats.**

**It passes, by 2.6%.** Worth saying plainly: a rule held with 2.6% of headroom is one tweak
from red, and nobody has ever run this check before. The number comes from a simulation of
the shipped function rather than from algebra on its constants, because the algebra cannot
see a bug in the code.

---

## I LOOKED AT THE FIRST CUT AND FIXED TWO THINGS THE NUMBERS COULD NOT SEE

**THE TERMINATOR WAS A RECTANGLE.** The first pass centred the turn on each row's own span.
A row's span jumps wherever hair crosses skin, so the terminator wandered and came out as a
blocky patch on the cheek: it read as a swatch laid over the face, not as light wrapping a
head. RAY showed it plainly and no number in the table above moved. **One centre and one
half-width for the whole head now**, taken from the mass itself.

**THE HAIR WAS UNLIT.** The pass lit skin and stopped, and hair is the biggest mass on every
one of these heads, so a head read as **a lit face glued to a flat wig**. If the lumen is
real it lands on everything in the room. The hair is shaded with the **two values the spec
already carries**, `hair.color` and `hair.roots`: lit side keeps the colour, shadow side
takes the roots. No third value is derived, so no colour is invented and the hair palette
this lane fixed on 9/20 is untouched.

**The weakness that is left, named rather than hidden:** with only two hair values the hair
terminator is a hard split rather than a turn. Fixing it means a third hair value, which is
a palette decision, not mine to take.

---

## WHAT IT DOES NOT DO

**It does not change the shipped renderer.** Rule 18 keeps code off the play surface and
rule 15 says he sees it in VOTE first, so `renderFace` is untouched and the face Paolo
approved has not moved. The cook is a tool
(`tools/bohemia_cook_the_light_in_the_room.js`), and it is last round's pass with the
fixture made a parameter rather than a second lighting model. REUSE-FIRST.

`[faces first]` and `[horror face]` both stay **CLAIMED, not shipped.** A stranger still
meets no faces at all: the only face surface in the game sits inside `#p-run`, a panel the
demo never shows. Still routed to RUN and UI, still not mine to reach into.

---

## IN THE VOTE TAB

`portrait-room-{denise,ray,marco,nina}-9-21`, now beside the bulb at 7x, cards in
`slices/vote/`. Sheet with all three fixtures:
`records/target/BOHEMIA_THE_LIGHT_IN_THE_ROOM_9_21_26.png`. Numbers:
`records/target/BOHEMIA_THE_LIGHT_IN_THE_ROOM.json`.

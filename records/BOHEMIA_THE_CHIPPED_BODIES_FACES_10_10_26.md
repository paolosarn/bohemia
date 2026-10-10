# THE CHIPPED BODIES' FACES -- PORTRAIT, 10/10/26, [the chipped bodies' faces]

VIA GROK (the dead are chipped bodies, never magic), WORDS' [the enemies' names]
(the twelve zombie rows renamed, rule 63 locked), this lane's own [the enemy
faces] (10/9, which named this row's whole premise out of scope then, honestly,
rather than guessing at it).

## WHAT WAS ALREADY THERE, READ NOT REINVENTED

`records/target/bb/enemies.json`'s zombie faction carries 12 rows. WORDS already
renamed all 12 to this valley's own words: a chipped body, chipped-paired,
chipped-in-nomad-gear, chipped-and-armored, a fallen hero (plain and named),
a betrayer, a treasure hunter, a relic bearer, plus two that are NOT bodies at
all -- the Necromancer (Grok's own line: the handler holding the controller for
every chipped body here) and the Geist (a speaker rig faking a voice). This
round leaves those two out on purpose; a controller and a loudspeaker have no
face to give.

## THE ASK, THREE TELLS

"A person's face with the chip's tell (one eye lit, the jaw slack, the skin
grey where the chip sits), never a skull." Built from two mechanisms, one of
them entirely free:

- **The jaw needed no new code at all.** `renderFace`'s mouth has drawn four
  shapes since 8/27 (closed/mid/open/wide), and `'open'` is already described
  in its own comment as "a real dark hole, jaw down one row" -- that IS a
  slack jaw. A chipped face just asks for that mouth the same way any spoken
  line would.
- **The eye-and-patch is one new, small, additive block** in `renderFace`,
  right before `return buf`, gated on `opts.chipped` -- undefined for every
  citizen and every enemy this game has ever rendered before today, so the
  block has never run once outside this round's own cook tool. One eye is
  overridden to a fixed "lit" colour (`[150,232,238]`, never the natural
  iris) with a bright core pixel, drawn AFTER the normal blink-aware eye
  loop so it always reads lit and never blinks -- a mechanical eye, not a
  tired one. The skin beside it, at the temple, is tinted toward grey with a
  new `tint()` helper that reads the pixel already there before blending
  toward the target, so it discolours real skin (or real hair, whatever is
  actually drawn there) instead of floating a flat shape past the edge of
  the face -- the same honesty test that kept the 10/9 fade effect and the
  9/14 3-D shading from faking anything.

## MEASURED

Six chipped bodies shown, the row's own number, spanning WORDS' naming from
lightest to heaviest (`enemies.json`'s own `armor_body`): CHIPPED (2-30),
CHIPPED NOMAD GEAR (15-105), CHIPPED ARMORED (27-115), FALLEN (85-260), THE
BETRAYER (85-260), THE RELIC BEARER (400). Which temple the chip sits at is
seeded off each one's own id, not fixed -- three light-sided, three right.

- **The lit eye is really lit**: the exact pixel at that eye's centre is the
  fixed lit colour on all 6 of 6.
- **Never a skull**: diffed each chipped render against the SAME face with
  the chip switched off (excluding the already-proven eye box), to measure
  what the mark actually covers rather than guess from a colour band. The
  mark is 2.8% to 4.1% of the drawn face on the six shown -- and overall,
  98.0% to 98.5% of each face's pixels are byte-identical to its own
  unmarked self. A tell, not a replacement.
- **Six bodies, not one costume**: pairwise compared with the shared
  background excluded (the same ruler [the enemy faces] used); closest pair
  (CHIPPED NOMAD GEAR / CHIPPED ARMORED) is 29% identical.

A refusal is built into the cook tool for all four claims -- it would not
have written the sheet if an eye wasn't really lit, if the grey mark grew
past 8% of the face, if a mark left no trace at all, or if two bodies
collapsed into one face.

## PROVED SAFE

The new `renderFace` block and the `tint()` helper only run when
`opts.chipped` is passed; nothing existing calls it. Checked, not assumed:
rendered 100 regular citizens (`faceFor('gate:crowd:0'..'99')`, no chipped
option) on this change and on a clean `git stash`d worktree, hashed every
buffer -- **0 of 100 differ**. His own approved face is the same separate
`buildSpec()`/`pface` path, untouched by construction, verified every round
this session.

GATES: talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker
16/0, hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0,
alpha_loads 20/0, portrait_matches_body 11/0, reference_check_gate 412/0.

## NOT DONE, NAMED HONESTLY

- **No lane has dressed a chipped body's actual outfit yet.** [the enemy
  faces] matched each living brigand tier's hair to a real `FACTION_LOOKS`
  look CHARACTER had already built. Grepped the whole repo for "chipped",
  "zombie" and "wiederganger": nothing outside WORDS' own naming page and one
  quest file. So this round's six faces are rolled portraits with the chip's
  tell on them, not matched to a dressed body -- honestly, because there is
  no dressed body yet to match against. CHARACTER's row to build if it
  lands, the same way [the enemy tiers dressed] did for the living.
- **The kill recap screen still does not exist.** Same gap named last round:
  nothing in the game today has a screen to show this face on. When it
  ships, it can call `faceFor('chipped:'+rowId)` with
  `{mouth:'open', chipped:{side}}` the same way this round's cook tool does.

IN VOTE: six heads, `portrait-the-chipped-bodies-faces-10-10`.

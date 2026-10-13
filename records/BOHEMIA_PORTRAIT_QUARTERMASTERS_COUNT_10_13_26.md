# THE QUARTERMASTER'S COUNT, PORTRAIT'S OWN FAMILY -- 10/13/26

## WHAT THIS IS
Rule 100(c) (the coordinator's school, round twelve, THE QUARTERMASTER'S COUNT):
every STUDY FIRST round must open with one machine line over all 294 packs,
"we own N pieces of this family in M packs, K never opened," before any study
or reproduction. PLUMBER's own row for this (`[the quartermaster's count]`) and
COOK's index it will read (`[the whole bank]`) are both still open, not yet
built (checked VAMILY.md fresh this round). Until either lands, this is PORTRAIT's
own small, honest, single-family version of that line, so this lane's own future
study-page headers have a real number to cite instead of waiting.

## THE MACHINE, THE SOURCE, THE CHECK
`tools/bohemia_portrait_counts_the_bank_for_faces.py` reads the same raw source
the general tool will eventually read: `banks/BOHEMIA_HD_TILE_REPO_part1-4.txt`,
the four chunks holding all 294 purchased packs and their 8,674 tiles. It parses
every pack's name (the only text the bank carries per pack) and checks it against
face/portrait/person keywords (face, portrait, head, person, people, human,
character, npc, villager, citizen, avatar, bust).

Before trusting its own answer, the script re-derives the two numbers rule 82a
already cites from COOK's own check (ab6da98f) -- 294 packs, 8,674 tiles -- and
refuses to write anything if its count disagrees. It matched exactly, so this is
a second, independent confirmation of the same bank, not a repeat of COOK's
number by citation.

## THE LINE
**we own 0 pieces of the face/portrait family in 0 packs, 294 never opened.**

## WHAT WAS CHECKED AND REJECTED, NAMED SO NOBODY RE-ASKS
Six packs near-miss on a looser keyword match and were deliberately NOT counted
as a face/portrait hit, with the reason:
- `10. Zombie bodies and bones`, `skeletons and bones` -- bone and corpse props,
  not a living face.
- `Statues and figures`, `Statues and monuments`, `15. Statues and ancient relics`,
  `statues and gargoyles` -- carved sculpture, not a photographic or paintable
  face reference; a statue's face is stone, not skin, and nothing in the pack
  names suggests a portrait crop.
Every one of the other 288 pack names is unambiguously architecture, terrain,
furniture, nature or an item prop (floor tiles, walls, doors, crates, plants,
lamps, pipes, signage). None of the 294 names anything a reasonable reader would
call a person, a face or a portrait.

## WHAT THIS CONFIRMS, AND WHAT IT DOESN'T
This confirms, a second way, what rule 82a and the twin-blocker re-check
(records/BOHEMIA_THE_TWIN_BLOCKER_RECHECKED_10_11_26.md) already found: faces
are a genuine, structural zero across the whole 294-pack library, not a gap
from a chat never looking. It does NOT replace PLUMBER's general tool (every
family, every lane) or COOK's full index (`[the whole bank]`) -- those are the
rows that own the complete picture across all families, not just this one.
This is scoped to exactly the one question PORTRAIT needed answered honestly
before it can write another study-page header.

## PROVED SAFE
Read-only. No pixel drawn, no file in slices/, engine/ or the demo touched.
The script refuses to write if its own recount of the known totals (294 packs,
8,674 tiles) disagrees -- it already ran clean once this round.

## GATES
`handoff_gate`, `open_row_gate`. Nothing else applies: no new slices/engine code,
no new VOTE art item (this is a data count, not a look -- `show.how:"text"`
precedent from the portrait generation contract applies if this is ever
registered, but a bare count line does not need a VOTE item at all).

## NOT DONE, NAMED HONESTLY
Still blocked, same as the round before: no pack piece of a face to reproduce
through a pipe, and no pipe (Aseprite, the rig, the gun) exists yet to reproduce
one through. This round adds a second, independently-sourced number to that
finding; it does not unblock it.

# THE QUARTERMASTER'S COUNT, PORTRAIT'S OWN FAMILY -- 10/13/26

## CORRECTED 10/16, NAMED HONESTLY, NOT QUIETLY EDITED AWAY
The literal "0 pieces" below was too strong. COOK's [the two holes] swept the
PIXELS of all 8,674 tiles (a stronger method than this file's pack-NAME check)
and found about a dozen actual drawn human faces, printed on posters, banners
and signs in a neon cyberpunk style (records/BOHEMIA_THE_TWO_HOLES_IN_PIXELS_
10_16_26.md). Not one is a character portrait or head-only, and none is in
this world's look -- so the PRACTICAL finding below (no usable face pack piece
to reproduce as a portrait twin) still holds, now confirmed by a better method
than this file used, but the exact number "0" was wrong and is corrected here
rather than left standing. The rest of this file is kept as written, for the
record of what was actually measured and reasoned at the time.

## WHAT THIS IS
Rule 100(c) (the coordinator's school, round twelve, THE QUARTERMASTER'S COUNT):
every STUDY FIRST round must open with one machine line over all 294 packs,
"we own N pieces of this family in M packs, K never opened," before any study
or reproduction. This tool was built and run before COOK's `[the whole bank]`
landed this same round (checked VAMILY.md fresh at the start; it was still
OPEN). COOK's index shipped moments later (577d7fd9, pulled in by this round's
rebase) -- so this is no longer the only count, it is now the THIRD one, and
all three agree (see below). PLUMBER's own general tool, `[the quartermaster's
count]` (every family, every lane, reading COOK's index), is still open.

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
Three independent sources now agree on the same zero: rule 82a's own cited
number (from COOK's earlier ab6da98f check), this script's fresh read of the
raw bank, and COOK's just-shipped full index (`reference/art_bank_index/
INDEX.json`, records/BOHEMIA_THE_WHOLE_BANK_10_13_26.md). COOK's index sorts
all 294 packs into exactly NINE families -- road (18), ground (53), prop
(115), settlement (67), door (14), marking (8), weapon (3), lamp (15), animal
(1) -- summing to 294 with no tenth category. There is no face/portrait/
person family at all, not even as a zero-count row: the bank does not contain
the concept, not merely a count of zero inside it. This does NOT replace
PLUMBER's general tool (`[the quartermaster's count]`, every family, every
lane, reading COOK's index) -- that row still owns the complete, standing
machine check across every family, not just this one. This script answered
exactly the one question PORTRAIT needed before COOK's index existed, and
now stands as a second confirmation of it, built independently rather than
by trusting one source.

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

# THE HAIR MATCH REGRESSION GATE -- PORTRAIT, 10/10/26

## THE ROW
[hair match regression gate]: PORTRAIT keeps the dials, the hair bank and the gates
while COOK THREE repaints the pixels (rule 87). Five times this session a portrait
silently drifted from the body it is supposed to agree with:

1. cut SHAPE (8/28) -- the portrait rolled its own shape dials, unrelated to the cut
2. hair COLOUR (9/20) -- the portrait read the wrong "art default" layer
3. the braid sentinel (9/24) -- `braid:-1` meant NONE and -1 is truthy; every face drew one
4. the face-maker's dropped dials (10/9) -- the maker copied 4 of 6 fields, dropping tex and fade
5. the whole crowd's random texture (10/9) -- faceFor rolled hair.tex at random for everybody

Every one of these is the same shape: the portrait says X, the real worn cut says Y,
and nothing ever compared them before it shipped. This round built that comparison as
a standing gate, so the sixth time this bug tries to happen it is caught before a
round ships, not found by hand after.

## WHAT THE GATE CHECKS, AND WHERE EACH SOURCE OF TRUTH COMES FROM
- **200 synthetic citizens** (`gate:crowd:0..199`, the same id shape every other
  portrait gate in this suite already uses): the real worn cut is read a SECOND time,
  independently, via `window.BOH_PERSONLOOK.lookFor(id, canonPool).worn.hair` --
  the exact public call `faceFor()` itself makes -- so a future bug inside faceFor's
  own wiring has something honest to disagree with.
- **The six shipped enemy tiers** (thug, poacher, marksman, raider, leader, marauder):
  the real worn cut is read fresh every run from `ours.json`'s `people_looks.value.band`
  and the live `window.FACTION_LOOKS` table, never from a cached copy of [the enemy
  faces]'s own cook tool -- a future rename in either source is still caught.
- **All twelve `CITY_CAST_LOOKS`** (the body looks [the hires' faces] reads): the real
  worn cut is read fresh from the live table, using the exact `over.hairName`
  construction `hireFaceSrc()` builds internally. `hireFaceSrc()` itself is also
  smoke-tested directly (it returns an opaque PNG, so its own internals cannot be
  read back, but its wiring to `faceFor` can be, and is).
- **Keepers, named honestly, not faked**: no lane has assigned any keeper kind a real
  dressed body yet ([the keepers' and hires' bodies], still OPEN) -- there is nothing
  to match a keeper's face against. The gate does not pretend otherwise. It checks the
  one real invariant that exists today: the same place+kind always renders the same
  face (determinism), so a future change cannot make a keeper's face silently random
  without this gate noticing. When a real body lands for keepers, this leg upgrades to
  a true match check the same way the other three families already have one.

What it does NOT check, on purpose: hair COLOUR (bug 2) is a different field with its
own proof already in `portrait_matches_body_gate.js`; re-proving it here would be a
second ruler for one fact, which this lane has already warned against building. The
face-maker's own dial-copy (bug 4) is a different code path (the interactive panel's
click handler, not `faceFor` for an NPC id) and stays `face_maker_gate`'s job.

## MUTATION-PROVED, NOT ASSUMED
The comparator itself is unit-tested against four planted cases before it is ever
trusted against a real face (a wrong name, a braid set where the cut owns none, a
missing braid where the cut owns one, and a true agreement that must still read as
agreement) -- 4 of 4 correct.

Then proved live, on the real renderer, by temporarily reintroducing two of the five
historical bugs and reverting after each:

- **Bug 5 reintroduced** (`sp.hair.tex` rolled at random for everybody, ignoring the
  body's own cut): gate went from 13/0 to 12/1, the citizen leg catching 141 of 189
  instead of 189 of 189.
- **The braid sentinel reintroduced** (`sp.hair.braid` always set, ignoring whether
  the cut owns a braid): gate went from 13/0 to 10/3 -- citizens (19/189), all six
  enemy tiers (0/6) and all twelve cast looks (0/12) caught it at once.

Both mutations were reverted and the gate confirmed back at 13/0 with a byte-identical
diff on `slices/BOHEMIA_ALPHA_0_9.html` (`git diff --stat` empty) before this record
was written.

## GATES
`gates/hair_match_regression_gate.js`: 13 passed, 0 failed (4 mutation-proof legs on
the comparator, 2 coverage legs, 2 enemy-tier legs, 2 cast-look legs, 1 hireFaceSrc
smoke test, 1 keeper determinism leg, 1 no-throw leg). New to the suite this round.

## NOT DONE, NAMED HONESTLY
This is a checker, not a cook tool -- it draws no new pixels and registers no art
sheet, so rule 82/87's embargo on portrait art reaching VOTE does not apply to it, the
same way it did not apply to CHARACTER's own [wildlife rig] rig fix this round. The
keeper leg is a determinism check standing in for a real match check until a keeper
kind gets a dressed body; that is [the keepers' and hires' bodies]'s row to close, not
this one's.

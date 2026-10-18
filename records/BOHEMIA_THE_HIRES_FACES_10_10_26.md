# THE HIRES' FACES -- PORTRAIT, 10/10/26, [the hires' faces]

PEOPLE [good bros], `records/target/bb/backgrounds.json` (77 rows, 6 of them
live at a post today). Grok's own "see the hire."

## WHAT WAS ALREADY THERE, READ NOT REINVENTED

`engine/bohemia_goodbros.js` rolls six recruits at a post, one per real
background -- farmhand, messenger, butcher, brawler, thief, militia, every
stat range and hire price sourced from the wiki. `BOHEMIA_SETTLEMENT_SCREEN.
html`'s own `recruitsHere()` (untouched here -- RUN TWO's file, ONE SYSTEM
ONE SESSION) already dresses each recruit in a real body look: `r.look =
'cast_' + [...][seedOf(key+':look:'+i) % 12]`, one of the twelve
`CITY_CAST_LOOKS`, each with its own real `worn.hair` -- the exact same
shape of data `FACTION_LOOKS` gave [the enemy faces]. `hireCard()` draws a
recruit's "face" today as a crop of his body sprite sheet
(`fight_people/<look>.webp`); no HD portrait has ever existed for a hire.

## THE FIX

Nothing new needed in `faceFor`: `over.hairName`, the override [the enemy
faces] built last round, already does the whole match -- a recruit's look
names a real cut the same way a faction does. The one new idea is the id.
A recruit's slot number alone (`'rc0'`..`'rc5'`) is the SAME string at every
post in the game forever, which would give every farmhand who ever lands in
slot 0 the identical face -- the row's own "no two hires match" needs the
instance, not the chair. `hireFaceId(postKey, slot)` folds in the exact key
`recruitsHere()` already rolls everything else from (the settlement's name
and the week), so a face is a function of WHICH recruit this is.

```js
function hireFaceId(postKey, slot){ return 'hire:' + postKey + ':' + slot; }
function hireFaceSrc(postKey, slot, lookId, opts){
  var id = hireFaceId(postKey, slot);
  var look = CITY_CAST_LOOKS.filter(l => l.id === lookId.replace(/^cast_/, ''))[0];
  var over = (look && look.worn.hair) ? { hairName: look.worn.hair } : {};
  var spec = faceFor(id, over);
  return renderFace(spec, { ramp: faceRampFor(spec) }) /* -> canvas -> dataURL */;
}
```

Two small, additive functions in the alpha, right after `keeperFaceSrc`.

## MEASURED

Two example posts (`THE WASH, NORTH LAS VEGAS`, `RED ROCK, SUMMERLIN`), the
same look-rolling formula `recruitsHere()` itself uses, all six real
backgrounds:

- **Hair matches the body look**: 12 of 12 render the exact cut their own
  rolled look's `worn.hair` names.
- **No two hires match**: the SAME background at a DIFFERENT post renders a
  DIFFERENT face, 6 of 6 backgrounds checked -- a farmhand at the Wash and a
  farmhand at Red Rock are two different men.
- **Six at one post, pairwise distinct** (shared background excluded, the
  same ruler every face round this session has used): closest pair
  (farmhand/messenger) 30% identical.
- **Deterministic**: the same post+slot, called twice, renders byte-identical.

The cook tool refuses to write if a hair mismatches, two posts collide, or
a face is not reproducible.

## PROVED SAFE

Both functions only run when explicitly called; nothing existing calls
them. Hashed 100 regular citizens on a clean `git stash`d worktree and on
this change -- 0 of 100 differ.

GATES: talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker
16/0, hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0,
alpha_loads 20/0, portrait_matches_body 11/0, reference_check_gate (own
tool's check carried; one unrelated COOK FOUR tool red on main before this
round, not caused here).

## WHY THIS ROUND DOES NOT REGISTER A VOTE ITEM

Rule 82/87 (coordinator, 10/10, THE SEVENTH VOTES): his NO on three of this
lane's own cooked sheets this month ("dogshit", "needs so much work I can't
even judge it", "didn't load the display"), and on the art fleet-wide
("looks nothing like the assets we downloaded"). COOK THREE now repaints
the portrait paint layer; PORTRAIT keeps the dials, the hair bank and the
gates; **no portrait sheet goes to VOTE until DIRECTION passes COOK
THREE's** -- the same instruction CHARACTER's own [the twin on the
thirteen] row is already working under. So this round cooks the real,
gated, working mechanism (the functions, the proof sheet, this record) and
holds the "show" step: no new `records/target/BOHEMIA_VOTE_REGISTRY.json`
entry this round. When DIRECTION passes a portrait twin sheet, RUN TWO can
wire `hireFaceSrc` straight into `hireCard()` and this record's own sheet
can be registered then.

## NOT DONE, NAMED HONESTLY

`hireCard()` itself was not touched (RUN TWO's file). Placing the real
portrait in the hire card, instead of the body-sprite crop it draws today,
is RUN TWO's wiring once the embargo lifts.

PROOF SHEET (not in VOTE): slices/vote/PORTRAIT_THE_HIRES_FACES.png.

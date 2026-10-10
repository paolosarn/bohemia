# THE KEEPERS' FACES -- PORTRAIT, 10/10/26, [the keepers' faces]

Rule 71a (one painted place), RUN TWO's own note on the row: "the keepers' face
request unanswered in the demo." EVERYBODY HAS A FACE (8/27).

## WHAT WAS ALREADY THERE, READ NOT REINVENTED

`slices/BOHEMIA_SETTLEMENT_SCREEN.html` (RUN TWO's own file, untouched here --
ONE SYSTEM, ONE SESSION) already has a door built and waiting. Its `face(k)`
function (drawing the little canvas beside a keeper's name) posts
`{type:'needFace', who:kp.who}` to its parent the first time it draws a keeper
with no cached face, and reads one back as
`{type:'BOHEMIA_SETTLEMENT_FACE', who, src(dataURL)}` -- the handler for that
reply already exists too (`S.faces[d.who] = d.src`). The five keepers this row
names are `KEEPERS.smith`, `.armourer`, `.barber`, `.clinic`, `.board`, each
with a real `who` id (`settle-smith`, `settle-armour`, `settle-barber`,
`settle-clinic`, `settle-board`) and a real name (RUBÉN THE SMITH, IRMA THE
ARMOURER, CHUY THE BARBER, DOC ROSALES, THE ELDER). PEOPLE's own
`engine/bohemia_keeper_lines.js` ([the keepers speak], 10/9) already writes
each one's real spoken price line, `priceLine(kind, ctx)` for
`'smith'|'armourer'|'barber'|'clinic'|'board'`.

## MEASURED FIRST: NOBODY WAS ANSWERING

Grepped `slices/BOHEMIA_ALPHA_0_9.html` and `slices/BOHEMIA_CITY_WORLD.html`
(the settlement screen's immediate iframe parent -- the chain is
ALPHA -> cityFrame -> `BOHEMIA_CITY_WORLD.html` -> settleFrame ->
`BOHEMIA_SETTLEMENT_SCREEN.html`) for `needFace` and
`BOHEMIA_SETTLEMENT_FACE`: zero hits in either file. Every keeper in the demo
today renders `face()`'s own fallback forever -- a flat dim rectangle with two
pixel eyes, drawn once and never replaced, because nothing anywhere in the game
has ever answered the request. A smith you have visited twenty times still
shows the placeholder on visit twenty-one.

## THE FIX

Two small, additive functions in the alpha
(`slices/BOHEMIA_ALPHA_0_9.html`, right after `speakingPortrait`), built
from parts that already exist and are already approved, nothing reinvented:

```js
function keeperFaceId(place, kind){ return 'keeper:' + place + ':' + kind; }
function keeperFaceSrc(place, kind, opts){
  var id = keeperFaceId(place, kind);
  var spec = faceFor(id);
  var ramp = faceRampFor(spec);
  var tMs = (typeof opts.tMs === 'number') ? opts.tMs : 0;
  var line = opts.line || null;
  var perf = facePerform(id, tMs, line, {});
  var buf = renderFace(spec, { ramp: ramp, mouth: perf.mouth, blink: perf.blink, brow: perf.brow });
  // ...paint buf to a 64x64 canvas, return canvas.toDataURL('image/png')
}
```

- `faceFor(id)` already accepts any string id and rolls a face deterministic
  off its hash -- no new override needed, unlike [the enemy faces]'s
  `over.hairName`, because a keeper has no dressed body yet to match (see NOT
  DONE below).
- **THE ONE REAL GAP**: a keeper's `who` (`'settle-smith'`) is the SAME string
  in every town, so `faceFor(who)` alone would give every smith in the valley
  one identical face -- the opposite of the row's own words, "rolled per
  settlement so two towns' smiths differ." `keeperFaceId` folds the place's
  own name into the id. That is not a new idea about what makes a place
  different: `S.place.name` is the exact string the settlement screen's own
  file already seeds everything per-place with (`rollTraits`, `restock`,
  `nextRumour` all key off it with the same `seedOf(S.place.name + ':' +
  salt)` shape). One convention, reused, not a second source of truth.
- `facePerform(id, tMs, line, {})` already drives the same mouth/blink/brow a
  LIVE talking portrait (`speakingPortrait`, defined just above) uses every
  time a cutscene speaker talks. The cross-iframe protocol can only carry ONE
  static image per message (`src`, a dataURL), so `keeperFaceSrc` renders ONE
  FRAME of that same performance -- a given id, a given line, a given
  millisecond -- to a dataURL. The live version and the snapshot version call
  the identical `facePerform`, so a keeper answered with repeated snapshots a
  `VISEME_MS` (250ms) apart performs exactly like a live `speakingPortrait`
  would, because the same deterministic function drives both.

## MEASURED AFTER

Two example towns (`THE WASH, NORTH LAS VEGAS`, the settlement screen's own
literal default place name, and `RED ROCK, SUMMERLIN`), all five real keeper
kinds, each one's real price line from `BohemiaKeeperLines.priceLine()`:

- **Deterministic**: the same (town, kind) called twice renders the identical
  byte-for-byte image, every one of 5 kinds checked.
- **Rolled per settlement**: the same kind in the two different towns renders
  a DIFFERENT image, every one of 5 kinds checked -- the row's own test,
  passed.
- **Five keepers, not one face five times**: every pair of kinds in the SAME
  town renders a different image from each other too, all 10 pairs checked.
- **Speaks along**: sampled each keeper's face at four points across their
  real price line (0, 250, 500, 750ms); at least 2 of 4 frames differ for
  every one of the 10 (town, kind) renders -- the mouth is actually moving
  across the real words, not a still photo wearing a caption.

A refusal is built into the cook tool itself for any of these four checks
failing, not just a report after the fact -- it would not have written the
sheet if a town collided, a kind collided, or a face never moved.

## PROVED SAFE

Both new functions are purely additive -- nothing inside `faceFor`,
`facePerform`, `renderFace` or `speakingPortrait` changed one byte. Checked,
not assumed: rendered 100 regular citizens (`faceFor('gate:crowd:0'..'99')`,
no keeper id involved) on this change and on a clean `git stash`d worktree,
hashed every rendered buffer -- **0 of 100 differ**. His own approved face is
the same separate `buildSpec()`/`pface` path this lane has verified untouched
every round this session.

GATES: talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker
16/0, hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0,
alpha_loads 20/0, portrait_matches_body 11/0, keeper_lines_gate 48/0
(PEOPLE's own gate for the price-line module this round reuses, re-confirmed
untouched). `settlement_screen_gate.js` could not be run in this environment
(`Cannot find module 'playwright'` -- that gate's own `require('playwright')`
bypasses the absolute path every other gate in this repo uses; checked
against a clean worktree, the same failure exists on main before this
round's change -- not caused here, not this lane's file to fix).

## NOT DONE, NAMED HONESTLY

- **No dressed body to match hair to.** `[the enemy faces]` matched each
  tier's portrait hair to a real `FACTION_LOOKS.worn.hair` because COMBAT had
  already dressed those six bodies from real data. No lane has yet assigned a
  specific body look to a specific keeper kind -- `KEEPERS` in the settlement
  screen carries `{who, name, draft:true}` only, no `worn` field; ANIMATION's
  [the settlement's idle people] baked generic clip sheets for every
  `CITY_CAST_LOOKS`/`FACTION_LOOKS` member but assigns none of them to "the
  smith" specifically. So this round's face is a rolled portrait, not a
  matched one -- honest, because there is nothing real yet to match against.
  If a future round assigns keepers real dressed bodies, the exact same
  `over.hairName` mechanism [the enemy faces] built already supports wiring
  the two together.
- **Who answers `needFace`, and how often, is RUN TWO's placing** -- the row's
  own words, not second-guessed here. `keeperFaceSrc` is built and proved
  correct in isolation; nothing in `BOHEMIA_CITY_WORLD.html` or the settlement
  screen was touched (ONE SYSTEM, ONE SESSION), so the five keepers still show
  the dim placeholder in the live demo until that wiring lands.

IN VOTE: the five keepers, `portrait-the-keepers-faces-10-10`.

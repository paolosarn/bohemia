# THE NEW BODY-BAKING COMMIT, CHECKED AGAINST THIS LANE'S OWN INVARIANT -- PORTRAIT, 10/16/26

## WHY THIS ROUND IS SHORT, NAMED HONESTLY FIRST
Re-synced and read VAMILY.md's front page and this lane's section fresh. Nothing
changed on the two things [the twin on the portraits] is blocked on: no pack piece
of a face exists anywhere in the 294-pack bank (triple-confirmed last round), and
no pipe to reproduce one through exists yet (checked again: no `tools/aseprite/`,
no Aseprite binary, no shipped request-card Action under PLUMBER's [the toolchain]/
[the gun in the repo], both still OPEN). [the keepers' and hires' bodies] is still
waiting on another lane's assignment; nothing new there either. Writing a fourth
round of "still blocked, same two reasons" would be exactly the STOP PRODUCING
tell -- a repeat with nothing new in it. So this round checks something that IS
new instead: whether anything shipped since the last sync put this lane's own
standing invariant (a portrait agrees with the body it belongs to) at risk.

## WHAT'S NEW SINCE LAST SYNC
22 commits landed on main. One of them touches the same crowd data this lane's
gates read: RUN's `tools/bohemia_bake_the_demo_cast.js` (round four of [ten
seconds to play]), which now caches the map's starter people and crowd as static
JSON (`slices/BOHEMIA_DEMO_CAST.json`, `slices/BOHEMIA_DEMO_CROWD.json`) instead
of re-rendering their walked bodies on every boot, to cut load time.

## CHECKED, NOT ASSUMED: DOES THE CACHE CREATE A NEW DRIFT RISK
Five times this session a portrait has silently disagreed with the body it was
supposed to match, each time because a SECOND, independent copy of the same data
existed somewhere and went stale (cut SHAPE, hair COLOUR, the braid sentinel, the
face-maker's dropped dials, the whole crowd's random texture, headwear/eyewear).
A cache is exactly the shape that bug keeps taking, so it was worth fifteen
minutes to check this one by reading the source, not guessing:

- Read `tools/bohemia_bake_the_demo_cast.js` in full: it captures `BOHEMIA_CITY_CAST`
  and `BOHEMIA_CITY_CAST_WALK` postMessage frames -- walked BODY sprite pixels only
  (`looks[].dirs[].breathe`, `walks[].dirs[]`). No occurrence of `face`, `Face`,
  `portrait` or `Portrait` anywhere in the file.
- Re-ran this lane's own two drift gates (`hair_match_regression_gate.js`,
  `portrait_matches_body_gate.js`) and confirmed what their source already says:
  both call `window.BOH_PERSONLOOK.lookFor(id, pool)` LIVE, every time, never
  reading `BOHEMIA_DEMO_CAST.json` or `BOHEMIA_DEMO_CROWD.json`. The new cache
  file is not in either gate's read path at all.

THE FINDING: the bake is a pure walk/breath-frame cache for the map's six starter
people and crowd; it never touches `faceFor()`, `renderFace()` or any portrait
surface, and this lane's two drift gates never read it. No new risk.

## GATES
Ran the full portrait suite after the rebase, all clean, unaffected by the new
commits: talking_portrait 34/0, portrait_haircut 15/0, family 17/0, face_maker
16/0, hair 39/0, hairline 12/0, hair_graveyard 13/0, craft_law 39/0, alpha_loads
20/0, portrait_matches_body 11/0, hair_match_regression 13/0.

## NOT DONE, NAMED HONESTLY
This is a safety check, not a fix -- nothing was broken, so nothing was built.
[the twin on the portraits] and [the keepers' and hires' bodies] are exactly as
blocked as the last round found them; nothing in this check unblocks either one.

# BOHEMIA ADDENDUM — COMBAT / CHARACTER / MENU / ROADMAP (7/4/26)

Session pivot after the music marathon. Paolo tightened combat + character
menus, added menu music, and set the road to a shareable demo. Everything
below is either DONE (shipped this turn, gated) or PENDING (plumbing laid,
his visual/creative call flagged).

## DONE — COMBAT (bohemia_combat_v12.html, all gates green)
1. GET SHOT BEFORE THE DIAL on a bad pop-out. Popping cover INTO exposed
   guns now resolves the enemies' shot FIRST: damage applies, the incoming-
   fire animation plays, and the Dead Eye dial only opens AFTER it finishes
   (deferred via G._afterInc, fired when G.inc completes). Getting shot on a
   bad pop-out now reads exactly like getting shot after a miss. Lethal
   pop-out runs the full incoming cam then loseGame.
2. EXPOSED-SIDE FACING PRIORITY. New stanceFacingAng()/updateStanceFacing():
   the crouched player faces the side they are EXPOSED to (no cover, enemies
   out), even if the other side has equal or more bodies. Only when nobody is
   exposed does it fall back to the side with the most enemies. Hooked into
   renderBoard so facing stays live as enemies peek/duck. (4 east w/ cover +
   4 west exposed = player crouches facing WEST.)
3. RED EXPOSURE LINES down another 40% (red 0.25->0.15, amber 0.15->0.09).
   Indicator, never a dominator.

## DONE — EXPORT AUDIT (Paolo has begged for this; now hardened)
Full sweep of every export path:
- MUSIC export: .txt, SHARE FILE (navigator.share w/ real File) + COPY
  (execCommand + clipboard fallback) + DOWNLOAD (blob), human-readable
  first. WORKS.
- RIG export (BOHEMIAN_RIG.html): .json download to Files (fine — Files
  keeps it) + SHARE FILE + COPY. WORKS.
- COMBAT juice verdicts: posts .txt up to the parent alpha's export modal
  (SHARE / COPY / DOWNLOAD). WORKS.
- Parent relay: alpha listens for bohemiaExport, pops the export modal.
  WORKS.
- BUG SEALED: the export modal's fallback name defaulted to
  'bohemia_export.json'. iOS blanks .json on share-sheet handoff to a chat
  app — the exact failure Paolo kept hitting. Now defaults .txt. Combat
  already sends juice_verdicts.txt; music already .txt.
NOTE for Paolo: to hand a file to Claude in chat, SHARE FILE or DOWNLOAD
then attach, OR paste the human-readable block / screenshot. Combat-tab
attachments have historically arrived blank to Claude regardless; the
paste/screenshot path always works.

## DONE — RIG <-> ENGINE INTEGRATION (verified intact)
Traced the full pipeline: a rig edit posts BOHEMIA_RIG_STATE -> alpha
updates BAKED.layers/skeleton/pose/swingAmt/layerOverride -> rebuildFromRig()
-> nulls the combat sprite key -> re-bakes after 1.5s of rig quiet (never
mid-drag) -> posts BOHEMIA_SPRITES -> combat decodes into SPR.cv. RIG SYNC
badge confirms "character + animation rebuilt". Animations, clothing, and
rig all still talk to the engine. Paolo can keep building rig/clothing/anims.

## DONE — MENU MUSIC (drumless, two candidates for Paolo to pick)
Brief: sounds NOTHING like gameplay (no hats, no drums). Beautiful synth
~2-min loop capturing the crisis-with-hope: economic apocalypse + tech crash
made everything terrible, but you still wake as the sun rises, purple sky.
Built two drumless candidates (kick:[] hat:[]), tagged MENU category:
- MENU — PURPLE DAWN: launchpad pad swell + glasskeys, airpad wash, wistful
  major-with-a-6th, half-time. The purple-sky sunrise.
- MENU — FIRST MORNING: warmpad + bellpad over solarhum, warmer/higher,
  first light coming clean.
Both wear NEW badges, thumbable/auditionable in the studio like everything
else. Paolo picks; the loser graveyards. NOTE: Paolo referenced an older
synth loop from a couple sessions back as the vibe reference; if he wants
that exact melody recovered, it's in a prior transcript and can be pulled.

## DONE — DUAL-RANK + VIBE CATEGORIES + VOLUME LAW
(Filed in full in the rhythm/grid addendum Part 66; summarized here because
it's live plumbing.) Every song carries an individual tier (S/A/B/C) AND
vibe-category tags; MUS.pool(cat)/pickFromPool(cat) return category songs
weighted by tier. MENU is now a category. Studio tagging UI is [PENDING
Paolo's layout call]. MASTER VOLUME-BALANCE pass is a locked late-stage
requirement: re-volumize every song's parts to one reference, then balance
music master vs the game SFX bus. A too-loud song is a MIX issue, not a bad
song.

## PENDING — HAIR OCCLUSION (plumbing laid, visual pass next session)
Problem: on front/side views, hair (e.g. the curtain bob) paints only its
own pixels and lets head SKIN bleed through; only back views (N/NE/NW)
currently cap the head. Paolo's rule: if hair sits on the head it OCCLUDES
the scalp, UNLESS the style intentionally shows skull — fade, balding,
mohawk.
Laid this turn: a per-style `scalp` flag on the hair spec (default false =
hair caps the head; true = shows skin). Next session: the render-verified
coverage pass — extend hair to occlude part-1 head skin down to the style's
length boundary (reuse the hat HAT_MAX_Y southern-boundary mechanism),
protect the face rows, and assign scalp:true only to the intentional-skull
styles. Held from shipping blind because a wrong hair-cover eats the face —
needs frames rendered + Paolo's eyes. [PENDING Paolo direction + verify.]

## PENDING — FACE-FEATURE PLACEMENT (plumbing laid)
Portrait and face-customization are ONE. Paolo wants to nudge the location
of eyes / nose / lips / ears per head-facing direction, modular across skin
tones and eye colors.
Laid this turn: FACE_OFFSETS[dir][feature]=[dx,dy] table (8 dirs x 4
features, default [0,0]), eyeColor as an independent modular field,
faceOffset()/setFaceOffset() helpers, and both persist in the saved look
schema. Next session: wire the offsets into the portrait + face renderer,
build the per-direction nudge UI, and Paolo tunes the values live. [PENDING
Paolo's per-direction values + portrait wiring.]

## PENDING — BOHEMIA LOGO (creative direction = Paolo's call)
Paolo wants "the most fire logo of all time." This is CREATIVE DIRECTION —
Claude does not pick the look. What the CODE needs, so it's ready the moment
Paolo locks a direction:
- a menu-screen logo slot (target the main-menu canvas over the purple-dawn
  track), resolution + safe-area defined for portrait iPhone,
- optional animation hooks (reveal/idle shimmer) tied to the menu music
  intro,
- render at the game's pixel scale with Scale2x/EPX (no nearest-neighbor).
[PENDING Paolo's call on wordmark style / motif / palette. Claude will then
produce candidates.]

## NEXT-SESSION ROADMAP — TOWARD A SHAREABLE DEMO
Paolo's stated targets, in the order they unlock a demo:
1. GRID POSITIONING SYSTEM. The core "I move you move" placement on the
   grid — player position, movement cost, the zoomed-in ("animal") fine
   grain vs the zoomed-out city view. Nothing placed until this exists.
2. TERRAIN. The ground layer. THREE versions each to support the three Acts
   (the rebuild changes the land across ~100 years).
3. BUILDINGS. Placeable structures. THREE versions each (Act 1/2/3).
4. ROADS. Connective layer. THREE versions each (Act 1/2/3).
5. KILL/APPROVE (thumbs) PIPELINE for terrain, buildings, AND roads — same
   verdict workflow as music/juice: Claude produces at volume, Paolo
   thumbs, rejects graveyard. Runs in the zoomed-in animal view.
6. ANIMAL-VIEW -> CITY-VIEW TRANSLATION. How an approved terrain/building/
   road tile in the fine-grain view reads when the camera pulls out to the
   city view (the two-scale camera: big steps skip small things). Each
   asset needs both representations.
FILES CONFIRMED PRESENT for next session: _build23.py, bohemia_combat_v12.html,
bohemia_engine.js, BOHEMIAN_RIG.html, all test gates (bohemia_tests.js,
_smoke.js, _hstest_head.js, _flicker.js, _music_parity.js), _baked.json /
_bones.json / _ref.json, scale2x.js. Grid/terrain/building/road systems will
land in the engine + a new BOHEMIA_ADDENDUM_WORLDBUILD when Paolo starts them.

## COMBAT RESOLUTION MODEL — LOCKED CANON (Paolo 7/4/26)
The dial's four zones, damage, and return fire, now exact:
- NO DAMAGE BEFORE THE DIAL, ever. Popping breaks cover but never costs HP on
  its own. Pop clean on green; the risk is realized only on a MISS.
- MISS zone: your turn ends and RETURN FIRE lands (endTurnReturn). The only
  thing that damages you.
- HIT zone: deals damage, ends your turn CLEAN (endTurnClean) — NO return
  fire that turn.
- VITAL zone: deals damage AND stuns the target 2 turns (tgt.stun=2, with a
  stunCooldown so no perma-lock), chain continues, NO return fire.
- KILL zone: KILL_DMG = 100 base damage, applied through armor (applyDamage),
  NOT an instakill flag. Demo enemies are <=100 HP with 0 armor so it reads as
  a one-shot. Elites/bosses/robots with more HP or armor take 100-minus-armor
  and CAN SURVIVE. Death is always just hp<=0, same as every zone. The kill arc
  ALWAYS buys the clean turn: chain on, NO return fire from that target whether
  it died or survived. "power is loud and safe" — landing the arc neutralizes
  the turn regardless of the health wall.

PLUMBING ADDED:
- enemy spawn carries `armor` (flat mitigation, default 0; elites/bosses/robots
  set it later).
- KILL_DMG=100 constant + applyDamage(tgt,raw) helper (raw minus armor, floors
  at 0). Kill, vital, and hit damage all route through applyDamage so armor
  works uniformly.
- kill branch: if the target survives the 100 (future boss), it plays a "KILL
  ARC — still up, chain on" beat and continues the turn with no return fire.

## HAIR — FULL HEAD COVER (Paolo 7/4/26, curtain bob fixed + plumbing)
Problem (from Paolo's 8-dir screenshots): the curtain bob let head/skull skin
peek through on S, gave too much forehead on E/W, and wasn't a true full cover.
FIXED + plumbing for mass production:
- HAIR_COVER_TYPE map: a per-style coverage tag. 'full' = the style caps the
  WHOLE head (scalp + forehead down to the brow + side drapes to the jaw),
  leaving only a face opening, so NO skin peeks and the hairline sits low.
  Other tags intentionally show skin: 'swoopL' / 'swoopR' (parted, one side
  scalp shows), 'bald', 'mohawk', 'partial'. Unlisted default = 'partial'
  (paint-only, legacy). Every mass-produced style gets tagged here.
- curtain-bob tagged 'full'. Render-verified all 8 dirs: S no skull peek, N/NE/
  NW full cover, E/W profiles capped with a low hairline, face opening intact
  (eyes/nose/mouth never eaten). All gates green (smoke, 80/80, head 14/14,
  flicker 0 holes).
- Shape knobs HAIR_FULL={browFrac:0.46, faceHalf:0.60, jawFrac:0.82} control
  how low the hairline sits, how wide the face opening is, and how far the side
  drapes fall. Tunable by render; Paolo's eyes make the final call on the look.
- Implementation: for a 'full' style, part-1 head-skin cells outside the face
  opening take the nearest hair color (ring search over the hair pixels), so it
  binds to the actual painted hair, no flat fill. Back views cover fully.

## COVER-STANCE FACING MATH — LOCKED CANON (Paolo 7/4/26)
Which way the crouched player faces is a WEIGHTED THREAT VOTE, not a body count.
Every threatening enemy (out: peeking/firing, OR a melee closing in) votes toward
its direction. Vote weight stacks three ways:
- RANGE: closer = louder. weight = 1/(0.15 + distT). Point-blank ~6.7x vs a far
  enemy ~0.87x. A blade a tile away drowns a shooter across the map.
- MELEE: a melee/charging enemy weights heavier the closer it gets:
  x(1 + (1-distT)*3). A charging blade at point-blank = up to 4x on top of range.
- EXPOSURE is the GATE, not a multiplier. If ANYONE is exposed to you (no cover
  from them), ONLY the exposed enemies vote and the emergency owns your body. If
  you're covered on every side, DEFENSE MODE: every out enemy votes and you face
  the 180 deg window holding the most range-weighted enemies.
Facing = 8-way snap of the weighted resultant vector, which by construction points
into the half-plane with the most threat weight (so "face the fullest 180 window"
falls out for free).
PROVEN (headless, this turn):
- 3 close melee W vs 5 far guns E -> faces W. (close melee cluster wins)
- exposed pool 4 E (others covered) -> faces E. (exposed priority)
- fully covered, 2 far N vs 5 mid S -> faces S. (fullest window)
PLUMBING: FACE_W={rangeK:0.15, meleeK:3.0} knobs (range floor + melee bonus).
ARCH archetypes carry melee:false by default; a melee/charging archetype sets
melee:true and the facing respects it with no further wiring. All gates green.
FUTURE HOOK (noted, not built): tall-cover LEAN vs short-cover CROUCH, wall-corner
+ pillar cover, and the pop-out-one-tile animation from tall cover, come with the
grid/movement system next session; the facing math already outputs the direction
those animations will play toward.

## FACING SPIN KILLED + DEMO SPAWN VARIETY (Paolo 7/4/26)
- SPIN BUG: the cover-stance facing was recomputing off who was PEEKING/FIRING
  each frame, so the body twitched around chasing whoever popped up on the beat.
  FIX: facingThreatPool is now POSITIONAL (all living, non-stunned enemies), not
  peek-state. Facing is stable per turn and only changes when cover is toggled or
  an enemy dies. Turn-based, no spin.
- DEMO SPAWN LAYOUTS: NEW ENCOUNTER no longer always rings the player 360. It
  rolls one of: 'oneside' (all in one ~90 deg arc), 'twoside_opp' (two opposite
  clusters, e.g. W+E), 'twoside_adj' (two adjacent, e.g. N+E), 'cluster_flank'
  (most one way, a lone flanker opposite), or 'ring' (full 360). Makes the facing
  math readable when toggling cover. G._spawnLayout records the roll. [demo
  variety only; real encounters place enemies from the world/grid later.]

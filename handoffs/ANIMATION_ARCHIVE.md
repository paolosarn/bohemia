# ANIMATION ARCHIVE (rule 96: the blocks older than the lane's two newest, newest first; moved by tools/bohemia_trail_sweep.js, nothing deleted)

<!-- moved 10/16 (CORRECT: AI and AK (the hearback's NEGATIVE folded in; sweep AK: the trail file's round 2 first, one commit)) -->
ANIMATION (animation-lr9y9i): 10/11 (b) LATEST -- *** THE PARTY WALKS AS ONE, IN VOTE AS FINAL? (a look row, a cook
round under rule 100). TAB: VOTE, the real map before beside now at his phone's pixels. ***
MAP_PARTY_AS_ONE in slices/BOHEMIA_CITY_WORLD.html, OFF in the file: on, no banner (pole + cloth: his 'shadow line'
and 'arrow') and the two trail close behind on the glass, depth-ordered. PARTY AS ONE 7/0, 4 mutations. WHEN HE SAYS
FINAL: set on:true, re-run PARTY AS ONE and THE PARTIES WALK, stamp. The banner is COOK's; it comes back on COOK's new
marker if he wants it. Stamp 10/11d, CUE 9.8 STANDBY.
[eight through the rig] waits on DIRECTION's master rig (no tools/3d scene, no Blender on this box): not started.
NEXT: [the beast in eight] (hold lifted for it).

ANIMATION (animation-lr9y9i): 10/11 (a) LATEST -- *** THE FALL, V2 THE LAST, IN VOTE AS FINAL? (the hold lifts for this
row because he asked). TAB: VOTE, playing, eight facings, before beside now, one art pixel to one phone pixel. ***
fall-down (2 beats) and take-hit (1) in the rig, posed per facing; the fall posed upright and the finished picture
turned over the heel (rollFrame) so long coats draw right; TERMINAL so the dead stay down. THE FALL READS 12/0, 5
mutations. NOT in the fight (rule 100). WHEN HE SAYS FINAL: rebake the fight's sheets with take-hit / fall-down / its
last picture as hit / fall / dead, and COMBAT's frameFor reads the table. Stamp 10/11b, CUE 9.7 STANDBY.
NEXT (hold lifted for it): [the beast in eight]. Still held: [eight through the rig], [the party walks as one],
[hands in the box] (parked at 70abd71 on claude/animation-vamily-lr9y9i), [flee runs], [the bestiary walks].
NOTE: a_merge_did_not_delete_a_system_gate flags any EDITED line as lost (and its control is red on main).

ANIMATION (animation-lr9y9i): 10/10 (a) LATEST -- *** ON HOLD (rule 88, Paolo 10/10: 'prioritize how it looks'). ***
[hands in the box] was built when the hold landed and is PARKED, not shipped: branch claude/animation-vamily-lr9y9i
at 70abd71 (handsInBox in the rig, gate HANDS IN THE BOX 7/0, 3 mutations, VOTE sheet, record). Not on main, no
VOTE row, nothing in the alpha. Row back to OPEN with the note. When he lifts the hold: rebase 70abd71, re-run the
gate (6 min), take the next stamp letter, ship. Also waiting from rule 86 for this lane: THE SHOT KICKS IN EVERY
DIRECTION, NOBODY WALKS ON A WALL OR A ROOF. FOR CHARACTER (whenever their look round reaches it): the church's
flat cap touches the top of the 112 box while he only stands, every facing (head top row 9, cap 9 px).

ANIMATION (animation-lr9y9i): 10/9 (e) LATEST -- *** FOUR LEGS: the first beast moves. A lab dire wolf walks,
lopes, bites and falls, three pictures a beat like the men. TAB: VOTE playing (the fight NOT IN A TAB YET). ***

[four legs] SHIPPED. engine/bohemia_quadruped.js (pure) + tools/bohemia_fight_beasts_bake.js -> slices/fight_beasts
(dire_wolf.webp, fight_beasts.json in fight_people's shape: idle, step, run, bite, fall, dead). FOUR LEGS 22/0,
11 mutations. FOR COMBAT: read fight_beasts.json beside fight_people.json; frame = cols[floor(progress * n)].
NEXT: [hands in the box], [flee runs], [the bestiary walks] (new: the rest of rule 42's beasts on the same engine).

ANIMATION (animation-lr9y9i): 10/9 (d) LATEST -- *** THE SHOT KICKS: two new firing clips (rifle, pistol) in
the bank and on the fight's sheets; the gun kicks, he rocks back and settles. TAB: VOTE playing. ***

[the shot kicks] SHIPPED. Correction: deadeye and others DO recoil (weakly); last round's record said otherwise.
fire-2h / fire-1h, one beat; fight sheets 26 -> 34 columns, table shot / shot_1h / aim. FIGHT CLIPS TABLE 14/0.
FOR COMBAT (still): frameFor reads DB.people.clips; a ranged man plays shot or shot_1h by his weapon.
NEXT: [four legs], [hands in the box], [flee runs] (new, rule 68).

ANIMATION (animation-lr9y9i): 10/9 (c) LATEST -- *** THE TOWN IS ALIVE: the town screen's people, baked and
ready: keepers at their doors, the stall keeper haggling, hires at the posts, a crowd walking. TAB: VOTE playing. ***

[the settlement's idle people] SHIPPED as clips (the row: RUN TWO places them). slices/settlement_people: 25 outfits,
3 facings, eight pictures of nine bank clips, a clip table with facings, the scale from the picture's ruler (a man
75 px at 42.9 px a metre). SETTLEMENT PEOPLE 8/0, 4 mutations. records/BOHEMIA_THE_TOWN_IS_ALIVE_10_9_26.md.
FOR RUN TWO: draw settlement_people at their doors (scale.draw_frame_at picture px, feet on the step); a keeper plays
wait/smoke, greet when the finger nears his building, beckon while it is on it, trade while his shop is open.
FOUND: the rig's 112 box cuts a raised hand on tall outfits (hail, 9 of 25): new row [hands in the box].
NEXT: [the shot kicks], [four legs], [hands in the box].

ANIMATION (animation-lr9y9i): 10/9 (b) LATEST -- *** THE PARTIES WALK: on the map you travel as three people
walking, and every roaming party walks and slides between blocks. TAB: MAP, VOTE playing. ***

[the marker walks] SHIPPED. The cast reached the map with no walk (my own 9/5 bake said so); the alpha now bakes
each look's walk after boot, one look per idle callback, and the map attaches it by name. Parties glide (a two-block
tick glides, more than three is a cut) and walk while gliding; his stride comes from his glide; two of his company
walk at his shoulders (mapCompanyDraw). PARTIES WALK 10/0, 3 mutations. records/BOHEMIA_THE_PARTIES_WALK_10_9_26.md.
FOR RUN: faster on road than dirt is your step timing (one block a beat everywhere); the feet keep pace with any step.
NEXT: [the settlement's idle people], [the shot kicks], [four legs] (new, rule 42/81).

ANIMATION (animation-lr9y9i): 10/9 (a) LATEST -- *** THE FIGHT'S CLIPS: the fight's sheets now carry a
breathing idle, a fall and a man struck down who crawls; the dead lie flat. TAB: VOTE playing. ***

Rule 78 put the lane back to work; top row [the fight's clips in the new fight] SHIPPED. Twelve columns appended
to all 26 fight_people sheets (the fourteen the fight reads unchanged byte for byte) and a CLIP TABLE in
fight_people.json (idle, step, swing, shot, hit, fall then down, down, dead). Looking turned it round: the fall
(floor-rise backwards) ends SITTING, where the crawl starts, so sitting = alive, flat = dead. FIGHT CLIPS TABLE
11/0, 5 mutations. records/BOHEMIA_THE_FIGHTS_CLIPS_10_9_26.md.
FOR COMBAT (its file untouched, as the row said): frameFor reads DB.people.clips[event]; a fallen man plays fall
then down, or dead; a waiting man plays idle. Its rebuilt-fight gate expects 'sleep' seen, which dead still is.
FOR THE COORDINATOR: one Grok ask: how does Battle Brothers draw a man struck down but alive, on the board?
NEXT: the jump list on the board: [the marker walks], [the settlement's idle people], [the shot kicks].

ANIMATION (animation-lr9y9i): 10/1 (a) LATEST -- *** A TRADER FACING YOU: haggling and bowing move
facing the camera now. TAB: VOTE playing (the near end of the zoom, rule 50). ***

Rules 49-51 landed; none gives this lane a new row. 46f (the fight's floor first) HOLDS the fight ranking,
so [facing you] took the next two off the list its gate prints, the two a person does to your face at the
near end of the zoom: haggle 13 -> 25% facing you (6 -> 19 from behind), bow 20 -> 39% (14 -> 29). Smaller
wins, said so; a hand crossing the black coat draws as a smudge, so nothing crosses it. Side facings
byte-identical. READS FACING YOU 23/0, mutation 21/2.
MY OWN RED, FIXED: COAT ON LEGS was red for three rounds (tent 1.32x), bisected to MY 59861c44 (the walk's
passing step). "Red on main too" was main carrying my commit. Fixed in the coat: in profile the hem flares
2.5 cells, not 3; 1.21x, 10/0. records/BOHEMIA_A_TRADER_FACING_YOU_10_1_26.md.
NOT MINE, routed: HEM FOLLOWS THE LEG 9/2 (13 new garments not in the hem table) and SHAPE FROZEN 11/1 (two
pauldrons unfrozen) are CHARACTER's rows, red identically before this round.
NEXT: inspect-ground, retch, dig off the same list while the fight is held; bat-arc when the floor reads.

ANIMATION (animation-lr9y9i): 9/30 (a) LATEST -- *** FAST TRAVEL STILL GLIDES: the map stays
smooth at every speed the new travel pad will have. TAB: MAP, VOTE playing. ***

Rules 41-48 landed; none gives this lane a new row. Rule 44 (the pad is travel speed, PAUSE 1x 2x 3x 5x)
touches [glide]: measured with the game clock driven, the one-beat glide fell behind and JUMPED three
blocks in a frame at 3x and 5x (25.9 / 30 px). Fixed: a glide lasts the gap between steps (cap one beat);
a far jump no longer sets the pace. 1x 1.0, 2x 1.4, 3x 2.0, 5x 3.2 px, 0 jumps. MAP GLIDES 14/0.
records/BOHEMIA_FAST_TRAVEL_STILL_GLIDES_9_30_26.md. UI [speed pad] builds the buttons; the map is ready.
WATCH: rule 42 (the beasts: dire wolves, hyenas, horses, lions, bears, mammoths) will need four-legged
motion; nothing on the board asks this lane for it yet.
NEXT: [facing you] by the ranking (bat-arc 0.59, cover-fire 0.60, dash / get-shoved / stumble 0.61, kick).

ANIMATION (animation-lr9y9i): 9/29 (a) LATEST -- *** TAKING A HIT FACING YOU: getting hit and
the shove move facing the camera now. TAB: COMBAT (the fight), VOTE playing. ***

Rules 39 and 40 landed (build it, don't ask; the fight quicker, the world gets the hours). The map
is RUN's this round ([bb map], 40f wants his party marker drawn), so this lane stayed off it; the
glide mechanism in renderCity is what any marker RUN draws will ride.
DONE: stagger-hit 40 -> 71% facing you (gate N 20.1 -> 46); shove 42 -> 57% (gate N 24.2 -> 30.6,
the smaller win, stopped at the second version -- the first was invisible against the black coat).
Side facings byte-identical. READS FACING YOU 21/0, 2 mutations. records/BOHEMIA_TAKING_A_HIT_FACING_YOU_9_29_26.md.
NEXT by the ranking: bat-arc 0.59, cover-fire 0.60, dash / get-shoved / stumble 0.61, kick 0.62.
[glide]: the fight movers wait on COMBAT (building the house-tile fight now, rule 39a); the map
marker waits on RUN [bb map]. Both ride the glide mechanism when they land.

ANIMATION (animation-lr9y9i): 9/28 (c) LATEST -- *** A HIT FACING YOU: throw and heavy punch
move facing the camera now. TAB: COMBAT (the fight), VOTE playing. ***

WHY: rule 38 was corrected the same hour -- A COMBAT TILE IS A HOUSE, the fight uses the full
112 body. So the fight clips at full detail are what he sees next. Ranked at 112, facing you vs
best side: throw 34/85, stagger-hit 40/92, punch-heavy 38/85 (crouch-aims excluded, holds).
DONE: throw 34 -> 69%, punch-heavy 38 -> 68% (gate ruler N 20.8 -> 34.9, 16.5 -> 39.9). Side
facings byte-identical. The first punch put the fist at his side (looked, read as a lean); the
cross-the-chest fix flipped an elbow (ELBOW went 9 flips, red, mine) and the forearm now bends one
way. READS FACING YOU 19/0, 2 mutations. records/BOHEMIA_A_HIT_FACING_YOU_9_28_26.md.
[glide]: the map is done; the FIGHT's movers are COMBAT's system and COMBAT is mid-rebuild on
[house tiles back] -- one system, one session, so this lane does not touch them. Waits on that.
NEXT: stagger-hit facing you (40 vs 92), then lunge-stretch, shove. The key picker (seam pair).
[bb facing] BB dropped character animation on purpose to keep gear readable; routed to CHARACTER
(armour attachments must stay readable through a swing).

ANIMATION (animation-lr9y9i): 9/28 (b) LATEST -- *** THE MAP GLIDES. His up-vote note on
the map page ("very very smooth, not boom boom boom, the animation plays to the BPM inside
the thing that slides") is built. TAB: MAP (the zoomed-out city), VOTE playing. ***

[glide] CLAIMED 9/28, round one done: the map. What is left on the row is COMBAT's board
movers (the same rule, routed) -- the street body already slides since his SLIDE vote.

=== MEASURED BEFORE, the game's own clock driven
one step: the camera moved 18 px on ONE frame of 36, then held. Two steps half a beat
apart: two jumps up to 10.3 px.
=== NOW (slices/BOHEMIA_CITY_WORLD.html, __THE_MAP_GLIDES__)
the drawn position eases over one beat, linear; a step mid-glide continues from where the
picture is; never more than 1 px a frame; still by frame 30. The pin hops once per beat
while travelling (2 px at default zoom), 0 at rest. A far jump (>2 cells) cuts.
city.x/city.y untouched. renderCity is the city app's own code, not an inlined engine
module, so the module resync does not overwrite it (checked).
=== THIS LANE'S OWN EARLIER CALL WAS THE OPPOSITE
[bb marker] round one picked "one lot per beat". He voted that page up and said glide.
MARKER ON BEAT stays as the honest record of the two options shown; MAP GLIDES holds the game.
=== PROOF
gates/the_map_glides_gate.js (MAP GLIDES) 11/0; 4 mutations caught (no glide, no far snap,
a four-beat crawl, no hop); 2 controls. records/BOHEMIA_THE_MAP_GLIDES_9_28_26.md.

ANIMATION (animation-lr9y9i): 9/28 (a) LATEST -- *** HIS THIRD VOTES KILLED THE ONE-CELL
SPRITE MID-ROUND. Shipped at full detail: TWO MOVES THAT WERE DEAD (brace, shadowbox).
Found and STOPPED: the key picker drops frames. TAB: ANIMATION, VOTE playing. ***

[glide] CLAIMED 9/28 (8b76a0f5), FIRST LINE, NOT STARTED YET -- it is next.
[small clips] round three done; what is left waits on the tile OPTIONS (37a).

=== WHAT HE SAID ABOUT THIS LANE (9/27 votes)
  he-walks-at-one-cell   DOWN "I don't wanna treat a whole new character" -> graveyard,
                         records/BOHEMIA_GRAVEYARD_THE_ONE_CELL_SPRITE_9_28_26.md
  how-you-cross-the-map  UP   "very very smooth... not boom boom boom... the animation plays
                         to the BPM inside the thing that slides" -> [glide]
  the-other-half, the-directions, facing-you-he-did-nothing  UP

=== SHIPPED (records/BOHEMIA_TWO_MOVES_THAT_WERE_DEAD_9_28_26.md)
brace 2 pictures / 1% facing you -> 9-12 / 62-83%. shadowbox 30% facing you -> 68%.
RE-AIMED: round-one gate CELL 28 -> 112 and its vacuous cut claim deleted; round-two VOTE
page re-cut at full size, its row reworded; the one-cell page marked KILLED on its face;
READS FACING YOU's side table untouched (it only moved under the picker fix, now reverted).

=== FOUND AND NOT SHIPPED: THE KEY PICKER DROPS FRAMES
poseHoldResolve does `acc = 0` after each key: the faster a clip moves the fewer keys it
gets (walk 8 of 12, dig 6, shadowbox facing you 3). Three repairs: carry the remainder
(95 of 103 richer, coat pops 25.1% facing you vs a 22% ceiling, main 19%); head-on lift
swept and ruled out (25.1% at every value); nearest-bucket placement (coat 23.2%, brace and
shadowbox under floors). THE THIRD WAS THE STOP. The whole difference sits on ONE frame
pair facing S at the loop seam, 22 -> 23 (25% vs 19%): that is where to start.

=== PROOF
gates/the_brace_and_the_shadowbox_move_gate.js (BRACE AND SHADOWBOX) 9/0; mutations: old
brace caught; greedy picker caught by the ceiling on everybody (my first cost control
watched only the holds and missed it). FOUR AT ONE CELL 13/0 at 112, mutation re-checked.
COAT ON LEGS 9/1: the one red (1.32x tent) is red on clean main too, not mine.

=== NEXT, IN ORDER
1. [glide]. NOTE: MARKER ON BEAT holds the OPPOSITE of his ruling (I picked step-on-the-beat
   in round one; he voted for glide). That gate's premise flips with this row.
2. The key picker, from the seam pair.
3. [facing you]: punch-heavy N 38%, throw N 34% vs the walk's 43%.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/27 (c) LATEST -- *** SIX MORE WALKS HAD THE SAME
LIMP, AND FOUR WERE BROKEN IN EVERY DIRECTION. All fixed. TAB: ANIMATION for the
clips, VOTE for the item, playing. ***

[small clips] CLAIMED, round two done. [bb marker] round one done. [redo killed]
12 of 47. [judge two] and [facing you] wait on his thumbs.

=== THE QUESTION, ASKED OF EVERY GAIT THIS TIME
Round one found the plain walk drawing THREE pictures instead of four, because a
step has two leg crossings and the code drew them as one picture. Every gait in
the file is built from the same sine, so I asked all nine of the others. Measured
on the drawn pixels, ph 0 against ph 0.5, eight facings, at 112 and at 28:
  tired-walk 8/8 identical   swagger 8/8   gun-walk 8/8
  sneak      7/8             wander  5/8   push     4/8       FORTY OF FORTY-EIGHT
  drunk 0/8, flee-sprint 0/8, flee-scramble 0/8 -- ALREADY CLEAN, and the reason
  is worth keeping: EACH CARRIES A SECOND CLOCK AT A DIFFERENT FREQUENCY. That is
  the only thing that kept their two crossings apart, and nobody designed it.

=== AND IT WAS IN THE SHARED HEAD-ON BRANCH, AT THE SOURCE
nsGait, the N/S gait every walking clip falls back to, is a pure function of s, so
it returns one legs-together pose at BOTH crossings by construction. walk and run
escaped there only because the pose-hold resolver happened to put their keys
elsewhere. That is luck, not a fix, and it is fixed now.

=== THE CLEARANCE IS PER GAIT, BECAUSE THEY ARE DIFFERENT WALKS
  sneak 0.30  push 0.30  gun-walk 0.40  wander 0.50  swagger 0.65
  (walk 0.55 and run 0.70 from round one)
All six to 0/8. Worst bar 5 pictures -> 8-9. And the number that matters: the two
crossings now differ by 5.4% to 13.1% OF THE BODY AT ONE CELL, where every one of
them was 0.0%.

=== I BROKE THE COAT, AND ANOTHER GATE OF MINE CAUGHT IT
The first head-on lift, 0.13, took COAT ON LEGS from 12.1% to 25.7% of the coat's
own area in one frame against its 22% ceiling. Red, and mine.
A WRONG FIX, MEASURED AND THROWN AWAY THE SAME HOUR: I squared the bell on the
theory that the kink at the stride extreme was the pop. It made the pop WORSE,
25.7 -> 30.3, because narrowing a bell steepens its flanks.
THEN THE AMPLITUDE WAS SWEPT INSTEAD OF PICKED:
  0.13 -> 25.7%   0.09 -> 18.6%   0.06 -> 18.6%   0.04 -> 18.6%
0.09 is the LARGEST value the coat does not notice at all, so it is the top of the
range and not a retreat from it. The sweep is written into the source beside the
number so nobody has to re-derive it.

=== THE CUT TOOK NOTHING, ELEVEN TIMES OVER
For all eleven gaits the picture count at 28 is EXACTLY the count at 112, facing
for facing. Round one's conclusion again with eleven clips instead of two.

=== THE IDLE, WHICH THIS ROW ALSO NAMES
7 to 9 pictures a bar at BOTH sizes, 23% to 40% of the body moving, and the sole
planted on all eight facings at 112 and at 28. It survives with nothing to fix.

=== TWO RULERS OF MINE THAT NEEDED CHECKING, BOTH CAUGHT BEFORE THEY BECAME FINDINGS
(a) My first sweep sampled 12 evenly spaced phases because POSEHOLD.keys is 12,
and reported "103 of 103 clips draw fewer than 12 pictures". Not the grid: the
resolver picks keys by EQUAL ARC LENGTH out of 24 buckets and 12 is a target, not
a schedule; a hold legitimately resolves two. THE GAME ALREADY HAS THE COUNTER,
poseHoldCount, AND NOTHING HAS EVER READ IT.
(b) I thought the idle's foot was lifting at one cell. My foot ruler read the
FIRST row of the leg region, which is the hip and is supposed to move. The foot is
the LAST row and it never moves. A RULER POINTED AT THE WRONG END OF THE LEG IS
NOT A FINDING.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-six-more-walks-had-the-same-limp-9-27, and it PLAYS: every picture in it
is the real one-cell sprite cut by the game's own cut, at 4x so it can be seen,
with his true size beside it.
[bb clips] school page (rule 33f): BB has NO body on the map, just a marker with
footstep sound, and spends its fight budget on the moment a weapon lands. Counted
ours: WE SPEND THE SAME ON A STROLL AS ON A PUNCH, and air-guitar is nearly twice
a spear through the chest. THE OBVIOUS FIX IS WRONG FOR US: at one cell a hit
cannot carry eight readable pictures, so the walk keeps the frames and the hit has
to be carried by sound and by the board. Routed to SOUNDS and COMBAT.

=== PROOF
records/BOHEMIA_SIX_MORE_WALKS_HAD_THE_SAME_LIMP_9_27_26.md
records/BOHEMIA_BB_SCHOOL_WHERE_A_BODY_SPENDS_ITS_PICTURES_9_27_26.md
gates/the_walk_has_four_pictures_at_one_cell_gate.js -- 14 claims now (was 9), 3
mutations caught, and the third is the one that earns its claim: the lift kept but
made too small to see, where push came out NOT byte-identical (1.5%) and the
visibility floor failed it anyway. A FLOOR THAT ONLY CATCHES BYTE-IDENTITY IS NOT
A FLOOR. The three already-clean gaits sit in the table as a control on the fix.
Pre-push pass: FOUR AT ONE CELL 14/0, COAT ON LEGS 9/1, ENVELOPE RAMP 10/0, READS
FACING YOU 17/0, SLIDE AND TURN 17/0, NECK HOLDS HEAD 8/0, HEAD SNAPS 13/0, ELBOW
BENDS 10/0, ELDER STOOPS 9/0, VOTE TAB 30/1.
THE TWO REDS ARE BOTH BASELINED on a clean origin/main worktree, byte for byte:
the coat 1.32x the body's widest row, and tapping VOTE in the gear. Not mine.

=== NEXT, IN ORDER
1. [small clips] round three: the fight clips at one cell (punch, shiv, spear,
   kick, throw), which this row has not touched.
2. [bb marker] round two: speed that carries information, other parties on the
   same clock.
3. The remaining killed clips with the worst single facing.
4. [judge two] and [facing you] wait on his thumbs.
5. [bake approved] -- several of the 23 carry the head-on hole.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/27 (b) LATEST -- *** THE CUT TO ONE CELL SURVIVES,
AND IT FOUND THE WALK HAD THREE PICTURES INSTEAD OF FOUR, AT EVERY SIZE, THE
WHOLE TIME. Fixed in the source. TAB: ANIMATION for the clips, VOTE for the item,
playing. ***

[small clips] CLAIMED, the FIRST LINE under rule 34, and round one is done.
[bb marker] round one done. [redo killed] 12 of 47. [judge two] and [facing you]
wait on his thumbs.

=== WHY THIS ROW WENT FIRST
Rule 34 (TWO SCALES ONE GAME, Paolo 9/27, LOCKED) makes the walked person ONE
CELL, about 28 px, one cell per step, and kills THE STEP IS A HOUSE. That is the
law this lane's walk, step and body-size work was built on, and the coordinator
marked [small clips] FIRST LINE. It goes before the rows still claimed here.

=== THE QUESTION THE WHOLE ROW HANGS ON
Cut 112 down to 28: is there still an animation in there? Measured at 112, at 56
(what ships to the street today) and at 28, with the game's OWN nearest cut:
                         112      56      28
  body rows, facing S     98      49      24
  lit pixels           2,732     680     168
  colours                 22      22      15
  identical facings, of 28 pairs   0   0   0
  lonely pixels at 28                      0
THE CUT SURVIVES. Nothing had to be redrawn; the 112 art is the source, as he
said.

=== AND THE SAME SWEEP FOUND A DEFECT THAT WAS THERE AT EVERY SIZE
6 identical pairs of 48 for the walk, THE SAME SIX at 112, 56 and 28, so it was
never the cut:
  NE 0=0.5 | E 0=0.5 | SE 0=0.5 | SW 0=0.5 | W 0=0.5 | NW 0=0.5
and run had exactly the same six.
THE CAUSE IS ONE LETTER: the lateral walk is driven entirely by
s = sin(ph*2*Math.PI), and SIN IS ZERO AT ph 0 AND AT ph 0.5, so both keys
resolve to the same legs-together pose, byte for byte.
THE SIDE WALK HAD THREE PICTURES, NOT FOUR. At 112 you might not notice. At 24
rows it reads as a limp.

=== THE FIX IS ANATOMY, NOT A NUDGE
The two crossings differ because one leg is PASSING FORWARD. What tells them
apart is the direction of travel (cos: +1 at ph 0, -1 at ph 0.5), and the
passing foot CLEARS THE GROUND.
  const c = Math.cos(ph*2*Math.PI), pass = 0.55*F;
  shinR: m*(F*Math.max(0,-s) + pass*Math.max(0,-c)),
  shinL: m*(F*Math.max(0, s) + pass*Math.max(0, c)),
6 of 48 -> 0, AT 28 AND AT 112, because the defect was never the cut and a fix
that only held small would be a fix in the wrong place. Run the same, bigger
clear.

=== A HYPOTHESIS I MEASURED AND THREW AWAY
The 28 px sheet read SPECKLED to me, so I wrote a second cut: area-average the
block, snap to a colour the art already uses, require most of a block to be ink.
THE RULER SAID ZERO LONELY PIXELS IN BOTH. There was no speckle; the light marks
are his hands and the coat's highlights and they are connected. The second cut
moved 105 pixels, added a colour and fixed nothing. Deleted.
A HYPOTHESIS THAT MEASURES THE SAME IS NOT A FIX.

=== WHAT THIS ROUND DID NOT DO, SAID PLAINLY
The GRID is a rebuild (the law says so) and belongs to the world and the map, not
here. CAST_PX, the one body-size constant, is untouched; moving it is the
rebuild's call. The street still runs on the old grid. What this lane owns is
that THE CLIPS ARE READY at the new size when it lands.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-he-walks-at-one-cell-9-27, and it PLAYS: the walk at one cell on three
side facings, three pictures beside four, on the real clock, with a panel at HIS
ACTUAL SIZE so the page cannot flatter it.

=== PROOF
records/BOHEMIA_THE_WALK_HAD_THREE_PICTURES_9_27_26.md
gates/the_walk_has_four_pictures_at_one_cell_gate.js -- 9 claims, 3 mutations
caught (passing foot removed; the lift driven off abs(cos) so both crossings lift
the same; an EMPTY cut), with a CONTROL that the cut draws a real body and not an
empty box, because a cut that drew nothing would score zero duplicates and zero
lonely pixels and pass everything by drawing nothing.
AND A NOTE FOR EVERY LANE: `git checkout` CANNOT RESTORE A MUTATED GATE THAT IS
STILL UNTRACKED. My restore step failed silently and the "restored" run printed
4/5. Copy the file aside before mutating a new gate, or restore by hand.
Regression after touching walk and run, all green: SLIDE AND TURN 17/0, NECK
HOLDS HEAD 8/0, HEAD SNAPS 13/0, ELBOW BENDS 10/0, READS FACING YOU 17/0,
ENVELOPE RAMP 10/0, ELDER STOOPS 9/0.

=== NEXT, IN ORDER
1. [small clips] round two: the idle, the turn and the fight clips checked the
   same way at one cell, and the same two-crossings question asked of every OTHER
   gait clip (sneak, tired-walk, wander, drunk, gun-walk all use the same sine).
2. [bb marker] round two: speed that carries information, other parties on the
   same clock.
3. The remaining killed clips with the worst single facing.
4. [judge two] and [facing you] wait on his thumbs.
5. [bake approved] -- several of the 23 carry the head-on hole.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/27 (a) LATEST -- *** [bb marker] ROUND ONE, THE
SCHOOL PAGE, AND THE MAP IS DEAD: the walk pad moves him ZERO lots out there
against twenty-two on the street. The fork is picked and built. TAB: CITY for the
map, VOTE for the item, playing. ***

[bb marker] CLAIMED and round one is done. [redo killed] 12 of 47, [judge two]
and [facing you] wait on his thumbs.

=== WHY THIS ROW AND NOT THE CLIPS
Rule 33(f) is a standing ask from Paolo, one page per round, every chat. This
lane skipped it last round to finish the clips, so it went first this round. It
is also the first OPEN line in the section.

=== WHAT THE MAP DOES TODAY (measured first, rule 12)
  street   one press moves him 22 lots, and the world moves on 32 of 60 drawn
           frames in one beat, biggest single frame 76.6% of the screen
  map      TWENTY-FOUR PRESSES IN ALL EIGHT DIRECTIONS MOVE HIM ZERO
THERE IS NO PARTY MARKER AND THE WALK PAD IS DEAD ON THE MAP.

=== TWO OF MY OWN INSTRUMENTS FAILED FIRST AND BOTH FAILURES WERE MINE
1. The first read document.querySelector('canvas') with toDataURL and scored the
   STREET at 0 frames moved, on a street with a breathing crowd. Identical ink on
   street and map (3176 both) was the tell: I was photographing a canvas the game
   does not draw to.
2. The second read the right canvas but asked WITH NOTHING PRESSED, and 0 is the
   CORRECT answer there: render() with no step in flight is deterministic, so
   stubbing the clock draws the same frame sixty times.
Rebuilt on this lane's own walk-gate instrument (REUSE-FIRST), and THE STREET IS
A CONTROL INSIDE THE GATE now, so a zero on the map can never again be my own
broken probe.

=== THE FORK, AND IT IS THE SAME SHAPE THE INTERFACE CHAT FOUND
BATTLE BROTHERS MOVES ITS MARKER IN CONTINUOUS REAL TIME AND LETS YOU PAUSE.
The 120 BPM law says movement is a REQUEST EXECUTED ON THE 500 ms BEAT, "a world
law, not a mode rule", and rule 24 says one game mode. Those cannot both be true.
A school round that only copied would have shipped the thing his own rules ban.
PICKED THE BEAT: his two rules agreeing, and the SLIDE feel he voted up on 9/21
one zoom out (one beat is one lot, eased, landing on the beat). A is built beside
it so he can say A with one letter.

=== AND THE CLAIM THAT STOPS THE CHEAT
A marker that merely crawled would pass "it stops at the beat" and be a WORSE
GAME. Filmed off the page's own canvases, 80 samples 25 ms apart:
                 holds still     biggest step     ground covered
  A real time     8 of 79            6 px         3.65 px a sample
  B on the beat  25 of 78           12 px         3.54 px a sample
THEY COVER THE SAME GROUND. What differs is the shape. The mutation that turns B
into a crawl is caught by exactly that claim.

=== WHAT IS NOT MINE, SAID PLAINLY
The marker ART is COOK's bank, embedded unchanged and BYTE-COMPARED to it rather
than eyeballed. Where he can go and what a tap means is the map's business. The
trail he leaves already exists and is not redrawn.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-how-you-cross-the-map-9-27, and it PLAYS: both ways travelling on the
real 120 BPM clock, two options and no more, asked once, no control in the page.

=== PROOF
records/BOHEMIA_BB_SCHOOL_HOW_THE_MARKER_TRAVELS_9_27_26.md
gates/the_map_marker_travels_on_the_beat_gate.js -- 12 claims, 3 mutations caught
(B made constant, B made a crawl, the marker redrawn), TWO CONTROLS: the street
still moves, and the ruler can actually FIND a marker, because a ruler that sees
none reports "held" on every sample and passes the main claim by being blind.

=== NEXT, IN ORDER
1. [bb marker] round two: speed that carries information (a road is fewer beats a
   lot than dirt), and other parties travelling on the same clock. The map's own
   movement system is NOT mine; this lane hands the motion over and says so.
2. The remaining killed clips with the worst single facing, one at a time.
3. [judge two] and [facing you] wait on his thumbs.
4. [bake approved] -- and NOTE: several of the 23 carry the head-on hole, so
   baking them verbatim ships the defect.
5. [horror motion] is still OPEN under the bible.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/24 (d) LATEST -- *** THE SAME QUESTION ASKED THE
OTHER WAY ROUND, AND THE ANSWER WAS WORSE: THE NOD WAS INVISIBLE FROM THE SIDE.
Three more of his forty-seven fixed and in the game. TAB: VOTE, playing, and
ANIMATION for the clips. ***

[redo killed] continues, 12 of 47. [judge two] waits on his thumb.

=== THE MIRROR QUESTION
Last round swept all 47 killed clips on all 8 facings and fixed three dead FACING
THE CAMERA. The mirror question is whether any clip is dead IN PROFILE while
alive head-on. That is worse when it happens, because a head or a chest move is
MOST visible from the side.

  clip          head-on best   side best   dead sideways
  nod              17.2%         12.8%     NE E SE SW NW  (five of six)
  point            42.1%         20.1%     SW NW
  chest-thump      35.7%         29.8%     NW
  inject           14.3%         25.8%     SW W NW

point, chest-thump and inject are the OCCLUSION family: on the back-side facings
the reaching arm is behind the body and the compositor is first-wins. That is the
feature he killed three times, so this lane is stopped on it.
NOD IS THE REAL ONE, and it is the inverse defect.

=== WHY THE NOD WAS INVISIBLE FROM THE SIDE (eleven characters)
    head: f*(0.12 + 0.14*s)
  0.12 is a PERMANENT TILT: his head sits tipped forward the whole time, so the
       swing starts from an offset instead of from rest.
  0.14 rad is EIGHT DEGREES. His head is 22 px tall. That is about a pixel and a
       half. A nod you can only find with a ruler.
Centred on zero, swung to 0.42, neck and shoulders and a hip bob following:
        NE    E    SE   SW   W    NW
  before 4.1  9.7  6.6  9.1  12.8 5.5
  after 14.5 22.8 17.6 15.6  21.8 13.5
Head-on untouched (14.7 and 17.2) and that is its own gate claim, because the fix
is in the lateral branch and a leak the other way would show up there.

=== AND LAST ROUND'S BUG TWICE MORE, WHICH MAKES IT A CLASS
A THRUST GOES FORWARD, AND FORWARD IS INTO THE SCREEN. spear-drive and shiv-jab
both aim with gunT and write every body term as spF, which is zero on N and S, so
facing you the whole attack was a man standing still.
  spear-drive   N 12.3 -> 55.5%   S 18.9 -> 65.2%
  shiv-jab      N 12.6 -> 45.1%   S 16.2 -> 55.5%
ALL TWELVE side facings across both clips unchanged to a tenth of a point.

=== GATE
gates/a_clip_reads_facing_you_gate.js -- 17 claims, 3 more mutations caught: drop
spear-drive's head-on branch (its own claim, back to 12.3%), put nod's permanent
tilt back (the profile claim, worst side facing 7.6%), and let shiv-jab's head-on
branch leak into the lateral path (the unchanged claim, all six named).
AND THE CONTROL MOVED. It used to stand on nod. nod is a SUBJECT of this gate now,
and A CONTROL THAT STANDS ON A CLIP THE ROUND EDITED IS ARGUING WITH ITSELF. It
reads drunk, which this round did not touch.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-the-other-half-9-24, and it PLAYS: the nod from the side and both
thrusts facing him, what he killed beside what they are, twelve frames a bar on
the real clock. No control in the page.

=== WHERE [redo killed] STANDS
12 of 47 touched: idle (voted UP); eat, drink, smoke, cough, whistle (their MOTION
only, the face-reach redo graveyarded by ruling); point, taunt, chest-thump; nod,
spear-drive, shiv-jab.
THE ORDER IS THE MEASUREMENT, NOT TASTE: whichever remaining clip has the worst
single facing goes next. The HOLDS (pistol, sleep, lean, pray, hands-up, the
crouch-aims) are still on all eight ON PURPOSE and are never "fixed". The
occlusion family is never touched until he asks.

=== PROOF
records/BOHEMIA_THE_OTHER_HALF_OF_THE_DIRECTIONS_9_24_26.md
Pre-push pass green: READS FACING YOU 17/0, ENVELOPE RAMP 10/0, NECK HOLDS HEAD
8/0, HAND TO FACE 1/0, ELDER STOOPS 9/0, SLIDE AND TURN 17/0, HEAD SNAPS 13/0,
ELBOW BENDS 10/0, VOTE TAB 30/0, HANDOFF 9/0.
Red and NOT mine, reproduced on a clean origin/main: ONE NUMBER BODY 5/1
(cross-origin postMessage throw), PAGES PUBLISH 17/1 (over the size cap).
Full suite: 107 red at ad23d875; mine are none on that list.

=== NEXT, IN ORDER
1. The remaining killed clips with the worst single facing, one at a time, with a
   picture each. Never the holds, never the occlusion family.
2. [judge two] is not SHIPPED until he judges pickup and laugh.
3. [bake approved] -- 23 thumbed-up candidates go in verbatim. NOTE: several of
   them (cower, psych-up, air-guitar, pat-pockets, scratch-back) carry the same
   head-on hole, so baking them verbatim ships the defect.
4. [horror motion] is still OPEN under the bible.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/24 (c) LATEST -- *** "SOME OF THE DIRECTIONS LOOK
LIKE DOG SHIT" IS NOW A NUMBER, ON ALL FORTY-SEVEN CLIPS HE KILLED. 21 of 47 have a
direction where he does nothing. Three fixed and in the game. TAB: VOTE, playing,
and ANIMATION for the clips. ***

[redo killed] continues, 9 of 47. [judge two] waits on his thumb.

=== THE HALF OF HIS SENTENCE NOBODY HAD MEASURED
Paolo 9/7, handing over the thumbs on the whole clip list:
  "A lot of the ones I thumbed down were because some of the DIRECTIONS look like
   dog shit: when it's facing north-east the hand was behind the head even though
   it's supposed to be in front."
The SECOND half was answered 9/13 (draw order) and 9/23 (the _face declaration,
whose clips he then killed three times). THE FIRST HALF WAS NEVER MEASURED,
because "some of the directions" names a SPREAD and not a defect.

=== THE SWEEP: 47 CLIPS x 8 FACINGS, ON THE DRAWN PICTURE
The share of body pixels the worst key of the bar changes against that clip's own
rest frame.
  21 OF 47 HAVE AT LEAST ONE DEAD FACING (under 12%).
  The gap between a clip's best and worst direction runs to 126 POINTS
  (lunge-stretch W 153.5% against N 27.7%).
  Worst spreads: lunge-stretch 125.8, throw 108, bat-arc 97, dig 93.1,
  spear-drive 89.8, drunk 85.3, stagger-hit 84.4, shout 80.8, flee-sprint 76.6.
A LOW NUMBER IS NOT A DEFECT BY ITSELF: pistol, sleep and lean are HOLDS, still on
all eight on purpose. The defect is a clip ALIVE on one facing and DEAD on another.

=== THREE FIXED, ONE CAUSE EACH, ALL DEAD FACING THE CAMERA
                  cause                                   N        S
  point      gunT pushes a point FORWARD ALONG      3.1 -> 30.6   7.2 -> 42.1
             THE FACING; facing you that is
             into the screen, cos(angle) ~ 0
  taunt      the arch and the thrown-back head     10.7 -> 34.9  13.1 -> 40.4
             are both spF terms, and spF is
             ZERO on N and S
  chest-thump the chin lift and the arch, same      8.2 -> 27.5  17.6 -> 35.7
THE SIX SIDE FACINGS OF ALL THREE ARE UNCHANGED TO A TENTH OF A POINT, and that is
its own gate claim: a head-on branch leaking into the lateral path would pass every
other claim in the file.

=== ONE CUT THROWN AWAY BY LOOKING
taunt's first head-on branch put both arms out at 1.15 rad. EVERY NUMBER WAS BETTER
AND THE SILHOUETTE READ AS A RIG IN ITS BIND POSE -- the one shape in this game that
says BROKEN. Lowered to 0.82 with more elbow and a bigger bounce, then looked at
again. This is the graveyard's lesson being applied the round after writing it.

=== AND ONE CLIP I DELIBERATELY DID NOT TOUCH
inject is dead on N, SW, W and NW. Its cause is woundPt, the chest point pushed
along the facing -- same family -- but the back-side deaths are OCCLUSION: the
reaching arm is behind the body and the compositor is first-wins. That is the
feature he killed three times on 9/23, and this lane is stopped on it by ruling.
Same reason point and chest-thump keep a low SW and NW. Named, not chased.

=== MY OWN GATE BUG, CAUGHT BY READING ITS OUTPUT
The first cut of the three new claims stored the whole reading instead of its
percentage, so they printed [object Object]% -- and the "side facings unchanged"
claim silently compared an object to a number. Math.abs(obj - num) is NaN, NaN >
0.05 is false, so it reported "0 drifted" and PASSED VACUOUSLY.
A COMPARISON THAT CANNOT FAIL IS NOT A CLAIM.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-the-directions-9-24, and it PLAYS: all three facing him, what he killed
beside what they are, twelve frames a bar on the real clock. No control in the page.

=== PROOF
records/BOHEMIA_SOME_OF_THE_DIRECTIONS_9_24_26.md
gates/a_clip_reads_facing_you_gate.js -- 13 claims, 3 more mutations caught: drop
point's branch (its own claim), let taunt's branch leak into the six side facings
(the unchanged claim, all six named in the failure), and wire chest-thump to S only
(the N leg). Floors per clip, set OVER what the bug scored.
Pre-push pass green: READS FACING YOU 13/0, ENVELOPE RAMP 10/0, NECK HOLDS HEAD
8/0, HAND TO FACE 1/0, ELDER STOOPS 9/0, SLIDE AND TURN 17/0, HEAD SNAPS 13/0,
ELBOW BENDS 10/0, VOTE TAB 30/0, HANDOFF 9/0.
Red and NOT mine, reproduced on a clean origin/main: ONE NUMBER BODY 5/1
(cross-origin postMessage throw), PAGES PUBLISH 17/1 (271 MB against a 260 MB cap).
Full suite: 107 red at ad23d875; mine are none on that list.

=== NEXT, IN ORDER
1. The 18 killed clips that still have a dead facing, worst spread first
   (lunge-stretch, throw, bat-arc, dig, spear-drive, drunk, stagger-hit, shout,
   flee-sprint), one at a time with a picture each.
2. [judge two] is not SHIPPED until he judges pickup and laugh.
3. [bake approved] -- 23 thumbed-up candidates go in verbatim.
4. [horror motion] is still OPEN under the bible.
NEVER: the hand-at-face occlusion family, until he asks.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/24 (b) LATEST -- *** HIS SECOND VOTES LANDED
MID-ROUND AND THEY CHANGED WHAT I SHIPPED. The hand at the face is killed a third
time and is in the graveyard. What survives is the motion fix, which is the thing
he named in his first four words. TAB: VOTE, playing, and ANIMATION for the clips. ***

[redo killed] continues. [judge two] CLAIMED this round.

=== THE RULING, AND I OBEYED IT MID-FLIGHT
`laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md` s7: "The hand at the face,
killed twice: graveyard, ANIMATION stops on it this session."
His three verdicts, in order:
  "...it looks like all of them Northeast and south tweaking"
  "Nahhhhhhhhhh it looks bad glitchy and clipping and shit"
  "WTF U MADE IT LOOK LIKE HES SCRATCHING THE BACK OF HIS HEAD ARE YOU FUCKING FR"
I had a vote item on those same five clips BUILT, measured and registered when the
ruling arrived. I PULLED IT and deleted its files rather than show him a fourth
version. The code fix stays, because it is a jitter removed from clips that are
already in his game, not a re-cook of the killed thing.
POST-MORTEM: records/BOHEMIA_GRAVEYARD_THE_HAND_AT_THE_FACE_9_24_26.md

=== THE POST-MORTEM'S OWN FINDING, AND IT IS THE ONE THAT MATTERS
My gate scored the redo 40 of 40. What 40 of 40 measured was HAND PIXELS NEAR FACE
PIXELS. On a back view, a hand pulled in front of a head you are looking at the
BACK of is a hand at the back of that head. The number was true and the picture
was wrong. A RULER THAT SCORES WHAT YOU BUILT CANNOT TELL YOU WHAT IT LOOKS LIKE:
I looked at pictures to build the ruler and never at the pictures it passed.
And his first four words named the real defect while I spent three rounds on
placement.

=== WHAT SHIPPED, PART ONE: THE MOTION (details in 9/24 (a) below)
Four envelopes in POSE. The body is posed on twelve keys a bar (POSEHOLD.keys) and
an envelope may not ramp faster than that. Reversals 26 -> 0 on the two facings he
named, 43 -> 5 overall, worst jump between two drawn keys 10.44 px -> 7.28.
gates/an_envelope_ramps_slower_than_the_grid_gate.js, 9 claims, 3 mutations.

=== AND A SWEEP I BUILT AND THREW AWAY THE SAME ROUND
I generalised that ruler over all 105 clips, called any (facing,joint) pair with 4+
reversals a bar "aliased", and it named 20 clips. Then I slowed shiver from FIVE
shakes a bar to THREE -- strictly better, twelve keys cannot hold five -- AND THE
COUNT WENT UP, 29 pairs to 53. It has to: a clean 3-cycle shake reverses six times
a bar honestly while a 5-cycle one aliases DOWN to fewer apparent turns. The sweep
is dead, shiver and rage are back untouched, and the limit is written into the
gate's own header so nobody generalises it again.

=== WHAT SHIPPED, PART TWO: A CLIP THAT BENDS FORWARD DIES FACING THE CAMERA
Found by LOOKING at the two clips on [judge two] before registering them, which is
the graveyard's whole lesson applied the same round.
`spF` (spine-forward) is ZERO on N and S by its own definition, so every term
written spF(d)*x vanishes on the two facings he looks at most.
MEASURED on the drawn frame, worst key against the clip's own rest frame:
  pickup   126% / 10.37 px from the side   vs   36% / 0.87 px facing you
  laugh     28% /  1.28 px                 vs   10% / 1.00 px  (standing still)
The fix pattern was already in the file (nod, drunk, the gaits all branch on
headOn), so it is applied not invented. AFTER: pickup 5.52 px / 68.7%, laugh
4.22 px / 40.7%, BOTH head-on facings, side views untouched.
STILL OPEN AND PRINTED: 15 of 105 clips have the same hole, each with its numbers.
Two were on the board; quietly rewriting forty is forty untested changes.
records/BOHEMIA_FACING_YOU_HE_DID_NOTHING_9_24_26.md
gates/a_clip_reads_facing_you_gate.js -- 9 claims, 3 mutations, and THE SECOND ONE
CHANGED THE GATE: a single pixel floor of 35% sat BELOW what the broken pickup
already scored (36.4%), so removing the fix left the claim green. A FLOOR UNDER THE
BUG IS NOT A FLOOR; the floors are per clip now. The third mutation is this lane's
own turn bug written again (wired to one of the two head-on facings).

=== COOKED THIS ROUND (rule 22, rule 25)
animation-facing-you-he-did-nothing-9-24, and it PLAYS: both clips facing him, what
they were beside what they are, twelve frames a bar on the real clock. No control
inside the page; the row asks once.

=== PROOF
Pre-push pass green: ENVELOPE RAMP 9/0, READS FACING YOU 9/0, NECK HOLDS HEAD 8/0,
HAND TO FACE 1/0, ELDER STOOPS 9/0, SLIDE AND TURN 17/0, HEAD SNAPS 13/0, ELBOW
BENDS 10/0, VOTE TAB 30/0, HANDOFF 9/0.
Red and NOT mine, reproduced on a clean origin/main checkout: ONE NUMBER BODY 5/1
(a cross-origin postMessage throw), PAGES PUBLISH 17/1 (271 MB against a 260 MB
cap, identical on main).
Full suite: 107 red at ad23d875; mine are none on that list.

=== NEXT, IN ORDER
1. [judge two] is not SHIPPED until he judges the two. It waits on him.
2. The 15 clips with the head-on hole, one at a time, with a picture each.
3. The other 42 killed clips ([redo killed] minus the five now graveyarded).
4. [bake approved] -- 23 thumbed-up candidates go in verbatim.
5. [horror motion] is still OPEN under the bible.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/24 (a) LATEST -- *** WHAT "TWEAKING" WAS: AN
ENVELOPE THAT RAMPS FASTER THAN THE GAME DRAWS. His words are answered and the
fix is IN THE ALPHA. TAB: VOTE, playing, and ANIMATION for the clips. ***

[redo killed] continues.

=== HIS WORDS, AND WHAT THEY TURNED OUT TO BE
Paolo 9/21, voting down the five hand clips: "it looks like all of them Northeast
and south tweaking." Last round proved it is NOT placement -- on those two facings
the sheets bake BYTE-IDENTICAL before and after the redo. So it is the MOTION.

THE DEFECT GENERALISES INTO A LAW, and this repo had already met it once and never
written it down: THE BODY IS POSED ON A GRID OF POSEHOLD.keys KEYS A BAR, TWELVE,
and nothing between two of them is ever drawn. An envelope written as a smooth
continuous curve can still move a joint further between two DRAWN keys than the
eye reads as travel, and then the joint does not appear to move, it appears to
JUMP, and to jump BACK. That is what tweaking is.
  eat    |sin(ph*2pi)| = TWO bites a bar. The hand crossed 13 px between two drawn
         keys, three times a bar, reversing at every hump.
  cough  max(0,sin(t*3pi))*(t<0.6) sampled at i/12 is 0,1,0,0,0,0. THE WHOLE
         CONVULSION IS ONE KEY WIDE: the head moved 10.44 px on north-east and
         came straight back inside a single drawing, twice a bar.
SAME FAMILY as the tweeze bug the file already carried IN A COMMENT ("sin(2*pi*6*t)
sampled at t=i/12 is ZERO at every keyframe"). Nobody generalised it, so it came
back. A NOTE IS NOT A GATE.

=== THE RULER, AND WHY FIVE ROUNDS MISSED THIS
Directional, not a distance: a step that goes BACK the way the last one came
(flipped by more than 120 degrees) between two drawn keys. That shape is invisible
to every how-far-did-it-move ruler, which is exactly what every earlier round used.

MEASURED over 5 clips, 5 joints, his two facings plus east:
  reversals on the two he NAMED       26 -> 0
  reversals adding east               43 -> 5
  worst jump between two drawn keys   10.44 px -> 7.28 (body is ~98 rows)
  drawn keys the cough occupies       2 of 12 -> 6 of 12
The 5 left are PRINTED and named: four are the cough's own duck and return, which
is a cough and not a jitter, and the fifth is whistle's far hand breathing, which
reads identical before and after and was never mine to claim.

=== WHAT SHIPPED
Four envelopes in POSE (eat, drink, smoke, cough). No new art, no rig change, no
draw-order change. NECK HOLDS HEAD is still 15 detached and green.

=== AND THE FIFTH HEIGHT SWEEP CONFIRMED THE FOURTH, SO IT STOPS HERE
The five REDONE reaching poses are still OUT of the alpha. Good news that is still
not enough: the spread envelopes alone took their cost from 22/23 detached to 19 --
FOUR FRAMES FROM GREEN, all four on the profile facings, where the forearm reaching
the mouth owns rows 26-29 inside the neck's own columns while the neck's top row is
30. Then seven reach heights, whole-suite detached each: +0 19, +1 20, +1.5 22,
+2 21, +2.5 25, +3 25, +4 22. EVERY LIFT IS WORSE. That is the fifth attempt at the
same knob and it confirms the fourth: named, not nudged a sixth time.

=== A RULER I BUILT AND THREW AWAY THE SAME ROUND
I had a replacement for the detached ruler that would have passed those four frames:
flood the drawn pixels 8 ways and ask whether the head blob and the torso blob are
one island, which is what his eye actually asks. Mutation-tested it BEFORE believing
it: with _neckHolds neutered the old ruler goes 15 -> 48 (reproducing the historical
number exactly) and the island ruler stays 0 -> 0. IT CANNOT SEE THE DEFECT AT ALL.
Deleted, ratchet untouched.
A RULER THAT PASSES THE THING YOU WANT TO SHIP IS THE FIRST ONE TO MUTATION-TEST.

=== COOKED THIS ROUND (rule 22, rule 25)
animation-the-tweak-is-gone-9-24, and it PLAYS: eating and coughing on south and
north-east, what is in the game now beside the fix, twelve frames a bar on the real
120 BPM clock, cropped to the head and hand at twice the pixels. No control inside
the page; the row asks once.

=== PROOF
records/BOHEMIA_WHAT_TWEAKING_WAS_9_24_26.md
gates/an_envelope_ramps_slower_than_the_grid_gate.js -- 9 claims, 3 mutations
caught (eat's bug back, cough's bug back, and the ruler itself blinded, which only
the CONTROL catches: it pushes the cough bug's own shape through the SAME walk and
requires reversals, so one ruler serves both).
Pre-push pass green: ENVELOPE RAMP 9/0, NECK HOLDS HEAD 8/0, HAND TO FACE 1/0,
ELDER STOOPS 9/0, SLIDE AND TURN 17/0, HEAD SNAPS 13/0, ELBOW BENDS 10/0, VOTE TAB
29/1 (the one red was my row's empty sha, now filled). ONE NUMBER BODY 5/1 is RED
ON A CLEAN origin/main TOO (a cross-origin postMessage throw, not mine).
Full suite: 107 red at ad23d875; mine are none on that list.

=== NEXT, IN ORDER
1. The seven profile frames stay NAMED, not chased. Anything new has to come from
   the rig or the draw order, not from moving the hand.
2. The other 42 killed clips ([redo killed] is 5 of 47).
3. [bake approved] -- 23 thumbed-up candidates go in verbatim.
4. [judge two] -- pickup and laugh.
5. [horror motion] is still OPEN under the bible.

[PENDING Paolo] Nothing.

ANIMATION (animation-lr9y9i): 9/23 (b) LATEST -- *** A CLIP DECLARES A HAND AT THE
FACE, AND THE BACK VIEWS ARE CLOSED: 9 of 40 -> 40 of 40. The flag shipped, the
poses did not, and I say why. TAB: VOTE, playing. ***

[redo killed] continues.

=== THE PIECE THE ROW WAS WAITING ON, AND IT WORKS
Paolo 9/7: "when it's facing north-east the hand was behind the head even though
it's supposed to be in front." Two rounds established the back views were never a
pose problem: facing away, a hand at the mouth is behind the skull, the compositor
is first-wins, and the reaching hand is never drawn at all.
A clip DECLARES it now, exactly like a gun clip declares _gun, and handOrder
brings the working arm-unit forward. A declaration is constant for the whole clip,
so unlike the rules retired 7/26 it cannot flip mid-swing.

    pictures where the hand reads at the face, 5 clips x 8 facings
        killed                     9 of 40
        redo, no declaration      33 of 40    (facing N: 45 to 49 px away)
        redo + the declaration    40 OF 40    (facing N: 6.6 to 7.3 px)

=== AND THE POSES ARE STILL OUT, WITH THE COST NOW ISOLATED
NECK HOLDS HEAD, ceiling 15. THREE TREES, ONE RULER:
    flag + ORIGINAL poses      8/0 GREEN
    flag OFF, redone poses     22 detached
    flag ON,  redone poses     23 detached
The POSES cost 7 frames, the order rule 1. The mechanism is clean.
AND THE CAUSE IS NOT OCCLUSION: the gate reports 0 frames draw NO NECK (it was
31), so nothing covers the throat. The head blob sits 3px off the body in profile,
and the OLD gun-target arm ran horizontally across the chest and bridged that gap.
Taking it away uncovers a separation that was always there.

=== FOUR ATTEMPTS, AND THE FOURTH IS WHERE I STOPPED
three target heights (9/21); a sideways slide clear of the skull (9/21, fixed N on
two clips and broke NW on three); the FACE behind the working arm so the arm
bridges jaw to shoulder (9/23, measured IDENTICAL at 23 either way, deleted);
halving the head rotation on the three offenders (9/23, still 23 and drink went
3px to 4px). STOP PRODUCING: named, not nudged a fifth time.

=== AND SOMETHING HE SAID THAT THIS DOES NOT ANSWER
His verdict was "all of them Northeast and south tweaking". THE DECLARATION FIXES
THE FACINGS HE DID NOT NAME. On S and NE the hand was already 5 to 8 px from the
face before and after, and the two sheets bake BYTE-IDENTICAL there, which is how
it was caught. So his complaint about those two is about MOTION, not placement,
and it is OPEN. Whoever picks this up next: do not re-measure placement on S and
NE, it is not the problem.

=== A BUG IN MY OWN GATE
HAND TO FACE keyed "is the redo in the build" on the HELPER FUNCTIONS. They landed
this round with the declaration while the poses stayed out, so a deliberate hold
turned into four red claims. A GATE THAT READS THE PLUMBING INSTEAD OF THE PRODUCT
WILL ALWAYS DO THAT. It reads the CLIPS now.

=== THE GATES
NECK HOLDS HEAD 8/0 on the tree being pushed. HAND TO FACE 1/0 (it says the redo
is out rather than going red over a deliberate hold). VOTE TAB 30/0.
Rule 13: pre-push pass green; full suite 107 red at ad23d875, none named as mine.

=== WHAT IS LEFT OF [redo killed]
The seven profile frames, which are a head-to-body gap the old arm was hiding and
not a draw-order problem. His "tweaking" note on S and NE, which is motion.
And the other 42 killed clips.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/23 (a) LATEST -- *** THE RIG CAN BEND A SPINE NOW.
The old man was a young man 3% shorter; he is 11.6% shorter and stooped, on every
facing, in the game. TAB: VOTE for the clip, and he is in the walked city too. ***

[spine bend] SHIPPED.

=== THE NOTE THAT WAS A PLAN, NOT A FEATURE
Paolo 9/21, on ages he had just voted YES to: "the old person looks like shit."
CHARACTER measured why: young adult, adult and elder within 3% of each other,
because the only dials were HEIGHT and LEG FRACTION and the elder shared its
height with the young adult and carried no bias at all.
AND THE RIG'S OWN NOTE, one line above the elder's, already said what was missing:
"old age compresses the spine, it does not narrow the shoulders." Nothing in the
rig could compress a spine. A NOTE THAT NAMES A MECHANISM NOBODY BUILT IS A PLAN,
NOT A FEATURE, and it read like a decision for as long as the elder existed. Worth
carrying: when a comment explains an absence, check whether the thing it explains
was ever built.

=== THE BEND
One pivot above the hips (15% of waist to crown). Everything above it moves on a
SQUARED curve of its height above the pivot, so the back ROUNDS instead of the
torso tipping like a plank; arms come with the shoulders; a per-facing sign brings
the upper body round the way he points, or the curve does not read in a 45 view.
0.20 was LOOKED AT, not picked: under 0.12 is bad posture on a young man, over 0.28
his head passes his toes and he is bent double, not old.

=== MEASURED, EIGHT FACINGS
                                        before     after
    shorter than the adult                2.4%     11.6%
    head out over his own hip            0.00px    2.65px
    drawn crown, rows lower on screen        2         8
    facings whose DRAWN body differs       0/8       8/8

=== THE LOAD-BEARING CLAIM: HIS LEGS DO NOT MOVE
0 leg joints off where the height scale puts them, worst 0.18px. A stoop that
drags a knee is a body falling over, not an old man.
AND MUTATING IT TAUGHT THE SHAPE OF ITS OWN GUARD: adding the leg joints to the
bend's list is a NO-OP, because the clamp makes anything below the pivot score zero
travel. The legs are protected BY CONSTRUCTION, not by a list somebody must
remember. The mutation that does move them removes the clamp: 0 -> 32 joints,
worst 10.7px.

=== THE RULER NEARLY LIED, ELEVENTH TIME
The first bake set G.age, rendered, and got THREE IDENTICAL BODIES. I was one step
from reporting that the bend does not read. G.age alone draws nothing:
rebuildFromRig() is what turns a stage into a body package. Same tell as always, a
result too clean to be true, caught by looking at the picture.

=== THE GATE
ELDER STOOPS 9/0, in the suite. Three mutations caught. It carries a CONTROL that
the young adult is untouched, so a global change cannot pass by showing up worst on
the elder, and it checks the DRAWN frame as well as the skeleton, because a
skeleton that moved while the art did not would pass every joint claim and this
lane has shipped that exact green before.
VOTE TAB 30/0. Rule 13: pre-push pass green; full suite 107 red at ad23d875, none
named as mine.

=== FOR CHARACTER, NAMED NOT CROSSED
The bend lives in the REST skeleton, so it reaches every clip and every facing
without a per-clip edit. If you want the elder's SHOULDERS or HIPS to change too,
that is the bias block next to it and it is yours; the note above the elder
explicitly says old age does not narrow the shoulders, so I did not touch them.

=== WHAT THIS LANE HOLDS
[redo killed] CLAIMED. Its next piece is unchanged: the draw-order flag (a clip
DECLARES hand-at-the-face, the way a gun clip declares _gun), which unlocks BOTH
the back views and the profile throat-crossing for the five hand clips.
[horror motion] OPEN.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/22 (b) LATEST -- *** HIS VOTES CAME IN. SLIDE IS
THE FEEL, THE TAPE IS DELETED, AND THE TWO HE VOTED UP ARE IN THE GAME. The hand
clips come back PLAYING. TABS: CITY for the walk, turn and idle; VOTE for the hand. ***

=== WHAT HE SAID, AND IT REWROTE THE ROUND
    the idle, redone            UP
    the turn takes the beat     UP
    the step drops a frame      UP
    how a step is drawn         UP, and: "I want slide immedialy"
    the hand reaches the face   DOWN: "How dare you show me pictures of animations
      and not the fucking actual Animation never fucking do that ever again it
      looks like all of them Northeast and south tweaking"

=== SLIDE (rule 26). THE TAPE WAS NEVER HIS.
It was the manager's default off this lane's own measurement, built over three
rounds. DELETED, not left as a dead option somebody can cycle into: two feels, GRID
and SLIDE, default SLIDE, and the stations, the worth-it test and the drop-a-frame
in the body clip go with it.
WHAT DOES NOT GO IS WHY SLIDE WAS NOT ALREADY WHAT HE HAD: the glide's handwritten
four-cell ceiling, written when a step was ONE cell, killed every full step on its
first drawn frame, so the chip said SLIDE and what he walked was GRID.
Measured on the pixels the game draws, sixty frames of one beat:
    SLIDE moves the world on 31 of 60.   GRID on 0.

=== THE IDLE HE VOTED UP IS IN THE GAME (rule 15c)
Three clocks that never line up. Under the one law that can break it: the feet move
in 0 OF 56 FRAMES across all eight facings, on the DRAWN frame, with a control that
the body is not simply frozen (1429 to 2644 body pixels a frame).

=== THE TURN WAS WIRED AT ONE PLACE OF SEVEN, WHICH IS NOT WIRED
The facing is assigned in SEVEN places: the walk, four door branches, two indoor
steps. The turn went into ONE of them, so every other way of changing direction
still snapped. One setFace() now, and everything goes through it.
Measured with the honest ruler, does the DRAWING ever skip a compass point:
    wired at one site     10 skips, worst FOUR points at once
    wired at all seven     4 skips, worst two

=== AND THAT NUMBER IS PRINTED, NOT GATED, ON PURPOSE
The same gate on the same tree then read 8 skips, worst three. It swings because the
WALK swings: walls redirect him, no two sweeps turn the same corners, and this box
draws about a third of the frames a beat holds. A FLAKY RATCHET IS WORSE THAN NO
RATCHET -- it fails honest work, gets switched off, and costs the gate everything
else it holds. The jumps are reported every run; the claim holds what does not
swing, which is that the facing is set in one place and that place starts a turn.

=== TWO RULERS FOR THE TURN WERE BUILT AND THROWN AWAY FIRST
(1) HFACE before and after a press -- but a held walk steps every beat, so N to W
usually happens as N to NW then NW to W, two one-point turns with nothing in between,
and it scored the code red for drawing exactly what it should. (2) Watch the turn
object -- but a turn that re-aims mid-flight becomes a new object and the re-aims
counted as failures. BOTH MEASURED THE MECHANISM INSTEAD OF THE RESULT. What the
feature means on screen is one thing: the drawing never skips a compass point.

=== THE HAND CLIPS COME BACK PLAYING (rule 25), AND THE STILLS PAGE WAS MINE
Eight real frames a clip, killed beside redone, on the beat, in the two facings he
named. NO vote inside the page (rule 25: asked once, on the row).
THE DEAD PAGE STAYS IN THE REPO, marked KILLED on its own face: its registry row
carries his verdict, and the vote gate requires every registered row to have
something behind it, so deleting it turns the whole registry invalid for every lane.
Tried that first; put it back.
The clips are STILL NOT IN THE ALPHA. The arm that reaches the mouth in profile
crosses the throat and takes NECK HOLDS HEAD from 15 detached frames to 22. That is
the draw-order flag named last round (a clip DECLARES hand-at-the-face, the way a gun
clip declares _gun) and it is the next piece of [redo killed].

=== THE GATES
TAPE SKIP is retired and replaced by SLIDE AND TURN, 17/0, covering slide, the turn,
the idle and the ceiling. VOTE TAB is 27/1 on my tree AND 27/1 on clean origin/main,
same claim (#openNot never appears), triaged in a worktree: NOT MINE, it is the
alpha's notes opener. NECK HOLDS HEAD 8/0 on the tree being pushed.
Rule 13: pre-push pass green; full suite 107 red at ad23d875, none named as mine.

=== WHAT THIS LANE HOLDS
[redo killed] CLAIMED. Next piece is the draw-order flag, which unlocks BOTH the
back views (hand behind the skull) and the profile views (forearm over the throat).
[horror motion] OPEN.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/22 (a) LATEST -- *** FIVE KILLED CLIPS REDONE AND
IN VOTE, AND DELIBERATELY NOT IN THE ALPHA. The hand never reached the face: 9 of
40 pictures read right, 33 now. TAB: VOTE. ***

[redo killed] continues. Batch two is eat, drink, smoke, cough and whistle.

=== ONE HELPER USED FOR THE WRONG JOB, AND IT IS HIS OWN SENTENCE
Paolo 9/7: "some of the DIRECTIONS look like dog shit: when it's facing north-east
the hand was behind the head even though it's supposed to be in front." That was
TWO PROBLEMS WEARING ONE COAT. The draw-order half was fixed 9/13. The other half:
ALL FIVE AIMED WITH gunT, THE GUN TARGET -- the chest point pushed FORWARD along
the facing. Right for a pistol held out, wrong for a hand at the mouth, and because
the push follows the facing it lands somewhere different every time he turns.
The head is 18 px crown to neck. The hand never came closer than 12.9 px and was
usually about 20. A WHOLE HEAD AWAY, in every single direction, on all five.

=== TWO RULERS DISAGREED AND BOTH WERE RIGHT. THAT IS THE FINDING.
The JOINT ruler scored the redo 2.9 px from the mouth on north-east, its best cell
of forty. The PICTURE ruler -- buildFrame's part id under every drawn pixel, so it
measures what is on screen -- said 45. The picture showed an arm reaching past the
head with no hand near it.
Facing away, a hand at the mouth is BEHIND the skull, the compositor is first-wins,
and the reaching hand is never drawn at all; the only hand pixels left in the frame
are the resting one at the hip. A DISTANCE BETWEEN TWO JOINTS CANNOT SEE WHAT IS IN
FRONT OF WHAT. Tenth ruler of this family this lane has thrown away, and the only
reason it was caught is that a picture was looked at after the numbers came back
good.

=== THE REDO, ON THE PICTURE RULER
    pictures where the hand reads at the face    9 of 40  ->  33 of 40
    closest the hand ever gets                    10.7px  ->   3.9px
    still not reading      facing N on all five, plus drink/W and smoke/SW
    regressed                                   drink/W, 16.7 -> 49

=== AND IT IS NOT IN THE ALPHA, BECAUSE IT COSTS A LAW WE ALREADY HAVE
NECK HOLDS HEAD (9/18) goes from 15 detached frames to 22 with the redo in. EVERY
NEW ONE IS FACING EAST: the forearm that reaches the mouth in profile passes over
the throat, which is the one thing that law exists to stop.
AND IT CANNOT BE NUDGED OUT. Raising the hand so the arm arrives under the jaw made
BOTH numbers worse: 24 detached and 31 of 40. Three heights and three target shapes
were tried. STOP PRODUCING, 7/26: a third version means the attempt is wrong, so it
is named instead of nudged a fourth time.

=== BOTH HALVES WANT THE SAME MISSING PIECE, AND THE SHAPE ALREADY EXISTS HERE
The back views vanish because the hand draws behind the skull. The profile views
cut the head off because the forearm draws over the neck. BOTH ARE DRAW ORDER.
A CLIP THAT BRINGS A HAND TO THE FACE SHOULD DECLARE IT, the way a gun clip
declares _gun, and handOrder should order that arm-unit and the neck off the flag.
A flag is constant for the whole clip, so unlike the two rules retired on 7/26 it
cannot flip mid-swing, and unlike reading the pose it cannot disagree with itself
between phases. THAT IS THE NEXT ROUND OF THIS ROW, and it unlocks both.

=== SO WHAT SHIPPED AND WHAT DID NOT
SHIPPED: the vote page and sheet (rendered from the real build, both halves), the
gate, the record with the code verbatim, and the board.
NOT SHIPPED: the alpha. It is byte-untouched. NEVER SHIP RED is absolute and this
would have taken a green law red to land a nicer-looking clip.

=== THE GATE
gates/the_hand_reaches_the_face_gate.js, NEW, in the suite as HAND TO FACE. It SAYS
the redo is not in the build rather than going red over a thing nobody shipped, and
it holds the ratchet (33 of 40, may only go up) from the round the flag lands. Two
mutations caught. THE FIRST CUT OF ITS CONTROL WAS VACUOUS: it asked whether ANY
cell was away from the face, and a build with the hand welded to the head still
scored 10 away, because the back views are occluded whatever the pose does. It asks
the REST PHASE now: 21 of 32 cells travel, 0 of 32 with the weld in.
NECK HOLDS HEAD 8/0 on the tree being pushed (it is 6/2 with the redo in, which is
the whole reason the redo is out). VOTE TAB 28/0. Rule 13: pre-push pass green;
full suite 107 red at ad23d875, none named as mine.

=== STILL TRUE, UNCHANGED
- [tape skip] shipped 9/21: the walk is a tape skip, filmed frame by frame.
- HC 11 is the one walk camera; one lot is 275 px there.
- The fight gets 112 and the street gets 56; CAST_PX stays 56.
- A weight shift over planted feet is not expressible on this rig.
- The standalone city page has NO player sprites; bodies are posted in from the
  alpha, so any body measurement runs on the alpha.
- PAGES PUBLISH was over its 260 MB cap on clean main last round. Not re-checked.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/21 (d) LATEST -- *** [tape skip] IS SHIPPED. THE
WALK IS FILMED FRAME BY FRAME ON THE PIXELS THE GAME DRAWS: 2 of 60 frames move
the world, against 20 for the old slide. Cooked THE TURN into VOTE. ***

=== THE THING THAT UNBLOCKED IT WAS GIVING UP ON THE SAMPLER
Two rounds of this row ended with the same sentence: nobody has watched the walk at
sixty frames a second, because this box clamps a headless page to about twenty and
a beat holds sixty. I built four cuts of a sampler before the obvious move.
A RULER THAT SAMPLES SLOWER THAN THE THING IT MEASURES CANNOT WORK. THE CLOCK IS
THE THING TO CHANGE, NOT THE SAMPLER. performance.now() is stubbed, render() is
called once at each of the sixty moments a sixty-frame beat would land on, and the
real canvas is read back. Nothing reconstructed: these are the pixels the game
draws, at the moments it would draw them. That is a different mechanism, not a
fifth cut of the fourth.

=== AND THE QUESTION IS NOT "DID ANYTHING CHANGE"
The crowd breathes and the signals blink, so some pixel always changes. A GROUND
MOVE REPAINTS THE STREET: even five pixels of scroll changes nearly every ground
pixel. The first cut counted any changed pixel and scored TAPE WORSE THAN SLIDE,
48 frames against 30, which is the opposite of the truth and was pure world churn.
The measure is how many drawn frames move MORE THAN A TWENTIETH OF THE SCREEN.

=== THE NUMBER THE ROW WAS OPENED FOR
Of sixty drawn frames in one beat, how many move the world:
    on the alpha, walking       GRID 0      SLIDE 20      TAPE 2
    on the city page, twice     GRID -      SLIDE 33/27   TAPE 3/3
TAPE is 3 by construction (two dropped frames and the landing) and measured 3 both
times, so that is the design and not a sample. SLIDE swings with world churn and is
never near it. The captured strip agrees with the numbers: three frames of held
street, a jump, a frame, a second jump, then a settled street.

=== WHY I MARKED IT SHIPPED, AND THE ONE THING I DECIDED
The written ship test says "zero skating pixels, the body's screen position changes
only on the beat". The RULING on the same line says "two or three frames of the walk
clip, a drop-out". Those are different things: taken literally the test asks for
zero moves, which is GRID, which is what shipped by accident and what this row was
opened to replace. I flagged it last round, built to the RULING, and the ruling's
own number is met exactly: two dropped frames, then the landing. Saying it out loud
rather than quietly picking one. If the coordinator wants the literal test, the row
reopens and the answer is the GRID feel, which is one string.

=== WHAT THE THREE ROUNDS ACTUALLY FIXED
  1. A four-cell teleport ceiling written when a step was ONE cell, against a step
     that is now 25, which had silently killed every full glide.
  2. The ground: hold, two dropped frames, land on the beat.
  3. The body on the same clock, so his legs stop striding while the street is still.
  4. Short presses do not skip: 9 of 12 presses are cut short and a drop-out over
     two cells is a twitch.
  5. The walk frame picked in ONE place where there were two.

=== COOKED (rule 22): THE TURN TAKES THE BEAT
TODAY THERE IS NO TURN AT ALL. HFACE=dirOf(dx,dy) assigns the facing the instant
the step runs, so he is facing south and then he is a different drawing facing east
on the very next frame. He already has eight drawings, one per direction, so a turn
is those drawings in order on the same hold-and-drop clock the street uses.
NO NEW ART. animation-the-turn-takes-the-beat-9-21 in VOTE.
NOT IN THE GAME and deliberately so: the turn is not a row on this board, rule 10
says only the coordinator adds rows, and rule 22(b) says a cook goes to VOTE. If he
votes it up it is a row, and it is a small one.

=== THE GATE
TAPE SKIP 31 claims -> 35, green on two consecutive runs. The new claim is
mutation-proven: ease the tape like a slide and it goes 3 of 60 to 37 of 60, and
the control collapses with it. It carries a vacuous-pass guard (a feel whose step
was never caught FAILS rather than passes) and a control (the same ruler must see
the slide moving many times more often, or it is measuring a broken renderer
instead of a held ground).
WALK NEVER MISSES 19/0. VOTE TAB 28/0 (see below, the red I routed is fixed).
HANDOFF 8/0. NO SHOTS 4/0.
Rule 13: pre-push pass green; full suite 107 red at ad23d875, none named as mine.

=== THE VOTE TAB RED I ROUTED LAST ROUND IS FIXED, AND THE ROUTING IS WHY
Last round DIRECTION registered an item with kind "verdict" and the whole registry
went invalid; by the time I looked again SOUNDS had added four more with kind
"sound", so five cooked things were sitting in a file the gate called broken. I
named it in this block and left it alone, because the registry says never edit
somebody else's object and UI owns the list its gate holds. UI has since added both
words to KINDS and the gate is 28/0 green. Worth keeping as a pattern: a lane cooks
what its lane makes, so the list will keep needing words, and the fix belongs to the
lane that owns the list, not the lane that trips over it.

=== PAGES PUBLISH IS STILL OVER ITS CAP ON CLEAN MAIN
261 MB against a 260 MB cap, measured on a clean checkout last round. slices 152 MB,
records/target 107 MB, engine 5 MB; the biggest single files are
BOHEMIA_RUN_CURRENT.html at 21.4 MB and BOHEMIA_VOTE_CURRENT.html at 6.2 MB, and
records/target carries full-size screenshots (one is 3.9 MB). This is the thing that
puts the game on his phone. PLUMBER's and RUN's, not this lane's to cross into.

=== STILL TRUE, UNCHANGED
- HC 11 is the one walk camera; one lot is 275 px there.
- The fight gets 112 and the street gets 56 from the same render; CAST_PX stays 56.
- Two live numbers for a lot: the lattice says 24, step and body say 25.
- A weight shift over planted feet is not expressible on this rig.
- The standalone city page has NO player sprites at all (PLAYER_CV is empty); the
  bodies are posted in from the alpha, so any body measurement runs on the alpha.

WHAT THIS LANE HOLDS NOW: [redo killed], still CLAIMED and frozen off the play
surface (four gun frames draw a detached head; beats two and three are one
per-facing problem; four clips still snap, worst 12.6 px; POSEHOLD key density).
[horror motion] is OPEN and is the next line if nobody moves one above it.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/21 (c) LATEST -- *** THE GROUND LEARNED TO SKIP
LAST ROUND AND THE BODY KEPT WALKING SMOOTH THROUGH IT. Both read one clock now.
Cooked a clip into VOTE. TABS: VOTE for it, CITY for the walk. ***

ROW [tape skip] CONTINUES, still CLAIMED, still not SHIPPED.

=== HALF A FIX THAT FIGHTS ITSELF LOOKS DELIBERATE
Round one taught the GROUND to hold and then drop. The BODY was still picking its
walk frame off a straight ramp across the same beat. So while the street stood
still his legs strode on the spot, and while the street jumped 94 px his legs
advanced one pose. THAT IS THE MOONWALK THIS ROW EXISTS TO KILL, REBUILT FROM THE
OTHER SIDE, and it would have read as a choice rather than a bug.

=== ONE CLOCK, ASKED BY BOTH
walkStation(k) is new and is the only thing that decides when the skip happens.
The ground asks it for a distance, the body asks it for a pose, so they cannot
disagree. Measured on the REAL surface (the alpha's shipped 4-frame walk; the
standalone city has NO player sprites at all, PLAYER_CV is empty there because the
bodies are posted in from the alpha, so the body half can only be measured where
he plays it):
    feel     poses drawn   pose changes   longest held pose
    GRID               4              3              125 ms
    SLIDE              4              3              125 ms
    TAPE               3              2              274 ms
The street is still for 275 ms of the beat and the body now holds for 274. GRID
and SLIDE keep their even cycle untouched, so nothing he has already seen changes
unless he is on TAPE.

=== THE STATION PICKS THE POSE, NOT THE DISTANCE
First cut picked the frame off how far the ground had travelled. That made the
LAST authored pose flash for a single millisecond and never land, because the
stations stop at 0.67 of the way and the beat supplies the rest. Station 0 is the
held pose, the last station is the LANDED pose. With 4 frames and 3 stations one
pose is skipped: that is the effect, not a loss.

=== A DROP-OUT NEEDS A DISTANCE, AND A PRESS IS NOT A LOT AS OFTEN AS IT SOUNDS
16 presses, cells moved: 2, 25, 25, 25, 23, 22, 13, 19, 19, 15, 4, 2, 19, 17, 25, 2.
FOUR were a full lot. FOUR were two to four cells. WALK NEVER MISSES agrees from
its own instrument: 15.2 cells a press against a 25 cell step. Over two cells
there is no distance to show and the same three stations are a twitch in place, so
the skip is used only above half a lot (137 px at the one walk camera) and a short
press lands on the beat. After: 11 of 14 skipped, 3 landed.

=== ONE PICK WHERE THERE WERE TWO
The walk frame was chosen in two places, outdoors and indoors. Two copies of a
frame index is how the player's legs do one thing in the street and another in a
room. One helper now, and the gate holds it at zero hand-rolled picks.

=== COOKED (rule 22)
animation-the-step-drops-a-frame-9-21 in VOTE: both walks side by side on the beat,
drawn off the shipped 4-frame walk sheet taken from the real body. NO NEW ART.

=== THE GATES
TAPE SKIP went 24 claims -> 31, all green. Three new mutations, caught one at a
time: the body back on a straight ramp while the ground skips reds the hold claim;
every step skipping however short reds the short-press claim; the body frozen on
one pose reds the GRID/SLIDE control. Both distance claims carry a VACUOUS-PASS
GUARD IN BOTH DIRECTIONS -- a sweep with no long presses, or no short ones, fails
rather than passes, because a rule whose whole job is telling them apart proves
nothing on a sample that has only one kind.
WALK NEVER MISSES 19/0. walk_feel 17/3, the same 3 it is on clean main, triaged
last round. VOTE TAB 28/0. Walked the demo with the one driver: TAPE live, step 25,
ceiling 100, no page error, the pinch still crosses the seam.
Rule 13: pre-push pass green; full suite 107 red at ad23d875, none named as mine.

=== ONE THING FOR THE COORDINATOR, NOT A [PENDING Paolo]
This row's written ship test says "zero skating pixels, the body's screen position
changes only on the beat". The RULING in the same line says "two or three frames
of the walk clip, a drop-out". Those are different things: taken literally the test
asks for GRID, which is what shipped by accident and what this row was opened to
replace. Built to the ruling and saying so rather than quietly picking one.

=== WHAT IS LEFT ON THIS ROW
The frame-by-frame look on a real phone at sixty frames a second. This box clamps a
headless page to about twenty, fewer than a beat holds, so everything above is
measured off the seam the renderer itself picks with and off real presses on the
real surface -- but nobody has watched the drop-out with their eyes yet.

=== A RED THAT IS EVERYBODY'S AND IS THE DEPLOY ITSELF, NAMED NOT CROSSED
PAGES PUBLISH is RED ON CLEAN MAIN: the published surface is 261 MB against its own
260 MB cap. It read 256 MB two rounds ago and 257 MB last round, so it is growing
about 2 MB a round across the fleet and it has just crossed. This is the thing that
puts the game on his phone, so it is worth someone's round. Where it sits, measured:
slices 152 MB, RECORDS/TARGET 107 MB, engine 5 MB. The single biggest files are
BOHEMIA_RUN_CURRENT.html at 21.4 MB and BOHEMIA_VOTE_CURRENT.html at 6.2 MB, and
records/target is carrying full-size screenshots (one PAOLO_ png is 3.9 MB). This
lane added 28 KB to it this round and is not the cause. It is _config.yml and the
deploy, which is PLUMBER's and RUN's, not this lane's to cross into.

AND A SECOND ONE THAT ARRIVED WHILE I WAS PUSHING, NAMED NOT CROSSED: VOTE TAB went
red on main (db8e829). DIRECTION registered direction-fight-verdict-round-3-9-21 with
kind "verdict", and the registry's kinds are song, face, haircut, outfit, tile,
animation, line, ui, redo. It is ONE word and it makes the whole registry invalid, so
the gate that guards the one place he votes is red for every lane until it is fixed.
Two clean fixes and neither is mine: DIRECTION changes its own object (the registry
says never edit somebody else's), or UI adds the kind to the list its gate holds.

=== STILL TRUE, UNCHANGED
- HC 11 is the one walk camera; one lot is 275 px there.
- The fight gets 112 and the street gets 56 from the same render; CAST_PX stays 56.
- Two live numbers for a lot: the lattice says 24, step and body say 25.
- A weight shift over planted feet is not expressible on this rig (9/21 (b)).

[redo killed] stays CLAIMED and frozen off the play surface: four gun frames still
draw a detached head; beats two and three are one per-facing problem; four clips
still snap, worst 12.6 px; POSEHOLD key density.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/21 (b) LATEST -- *** THE WALK GLIDE HAS BEEN DEAD
SINCE THE STEP BECAME A HOUSE, AND NOBODY KNEW. Cooked two things into VOTE.
TABS: VOTE for both, CITY for the walk. ***

RULE 22 (Paolo 9/21) is the new law and it is the shape of this round: a making
lane COOKS EVERY ROUND, registered in the VOTE tab, or the round did not happen.
"Measure your part" as a round's whole output is dead. Two cooks landed, and the
measuring rode beside them instead of replacing them.

=== COOK ONE: THE IDLE, REDONE  (1cc165e, in VOTE)
`idle` is on his ORIGINALS THUMBS DOWN list and it is the most-seen clip in the
game: every standing person in the city plays it. What he killed was one sine wave
on two arms, exactly out of phase, forever, with nothing else on the body moving --
a street of forty people is forty metronomes in lock step.
THE REDO IS THREE CLOCKS THAT NEVER LINE UP: a real breath (fast in over 0.45 of a
beat, slow out over 1.15, then held), a weight drift at 0.75x the loop rate so three
runs against four, and one late head turn that DOES NOT TURN BACK. The turn is rule
20's shape: the frame is ordinary and one thing in it does not resolve.
Measured off the sheet he actually looks at, 4 facings x 16 frames:
    pixels that change each frame   86 -> 128
    biggest change in one frame    335 -> 519
    arms a perfect mirror          yes -> no
    feet move                    never -> never   (IDLE LAW holds)
NOT IN POSE.idle AND THE ALPHA IS UNTOUCHED (rule 18). The clip is in the record
verbatim, ready to paste the round he votes it up.

A RIG FINDING THAT CAPS EVERY STANDING CLIP, named not fixed: IDLE LAW broke twice
building this. Vertical breath in hipOff lifts the feet; lateral weight moves them
above 0.40, which is the maximum legal lateral hip; and legCompress does the
OPPOSITE of what it sounds like -- the FEET travel 1-6px and the hip travels 0. So
A WEIGHT SHIFT OVER PLANTED FEET IS NOT EXPRESSIBLE ON THIS RIG.

ANIMATION (animation-lr9y9i): 9/21 (a) LATEST -- *** HOLD ROUND 2, RULE 18. Nothing
pushed to the alpha. ONE PRESS IS TWENTY-FIVE REAL PACES AND THE LEGS DO ONE. TAB:
ANIMATION, unchanged; no build. ***

Rule 18 holds this lane. [redo killed] stays CLAIMED, the alpha is untouched, and the
round bought numbers for WALKING. Rule 20 (ANALOG HORROR) is new and does NOT name
this lane in its WHO list, and DIRECTION's bible is not written, so writing a motion
bible here would be producing while frozen and ahead of the lane that owns it. Not done.

=== THE PIECE OF WALKING NOBODY HAD MEASURED
His words: "a stride that lands on the next standable place toward the press". The
camera and the body size were measured last round. THE STRIDE HAD NOT BEEN. It is this
lane's, and it is what he is looking at while he walks.

=== THE STEP IS A WHOLE HOUSE NOW, WHICH IS CORRECT
STEP_CELLS reads 25 ON THE LIVE SURFACE. (The source still carries
STEP_CELLS_QUARTER = 5 from the 9/15 part one, and the live value has moved past it --
READING THE SOURCE GIVES THE WRONG NUMBER, so it was read live.) A fine cell is
0.75 m, so one press moves him 25 x 0.75 = 18.75 METRES. Rule 16 landed.

=== BUT THE LEGS STILL WALK ONE PACE
Walk stride measured on the rig along the facing axis, relative to the body: 8 px
facing the camera, 31 px in profile, median 17.7, on a body 98 px tall. At HC 11 (the
one camera where a house fits) the drawn body is 112 px and the rig is 112, so rig px
are screen px:
    dir | the body travels | the feet depict | feet cover | SKATE per press
      N |            275px |             8px |        3%  |         267 px
     NE |            389px |          14.8px |        4%  |         374 px
      E |            275px |            31px |       11%  |         244 px
     SE |            389px |          17.7px |        5%  |         371 px
THE FEET COVER 3% TO 11% OF THE DISTANCE. The body skates 244 to 374 px every press,
on a phone 390 px wide. He crosses most of the screen in one press while his legs do
one small pace. That is a strong candidate for why walking feels worse than it was.

=== AND IT CANNOT BE TUNED, BECAUSE THE NUMBERS ARE NOT CLOSE
A pace is about 0.75 m, so ONE PRESS IS 25 REAL PACES. At 120 BPM, one step per beat,
that is 18.75 m in 0.5 s = 37.5 m/s = 135 KM/H. A person walks 1.4 m/s. A stride long
enough to depict it would be 2.5x the body's own height.
THIS IS NOT A BAD NUMBER IN A CLIP. It is a walk cycle being asked to depict something
that is not a walk. The honest options are (1) the body plays MANY gait cycles across
one press, about 25, so the legs read as covering ground, or (2) the press is not a
walk and needs its own motion. Both are this lane's and both are frozen. WHICH ONE IS
NOT A MEASUREMENT, so it is not decided here.

=== AND THERE ARE TWO LIVE NUMBERS FOR A LOT, WHICH RULE 16 FORBIDS
    BOH_LATTICE.LOT_FINE = 24 fine cells   (the lattice's lot)
    BODY_SCALE.lotFine   = 25 fine cells   ("measured median lot pitch")
    STEP_CELLS           = 25 fine cells   (what a press actually moves)
Rule 16: "ONE NUMBER IN ONE PLACE... a second copy anywhere is the bug." There are
two. Step and body agree at 25; the lattice says 24. It is one cell, so nothing looks
broken, which is exactly why it will sit there. [FOR WHOEVER OWNS THE LATTICE] named,
not touched.
Record: records/BOHEMIA_ONE_STEP_IS_TWENTYFIVE_PACES_9_21_26.md

NOTHING BUILT, NOTHING PUSHED TO THE ALPHA, NO BUILD STAMP, no gate added or changed.
This round's diff is a record and this block.

STILL TRUE FROM LAST ROUND, for the same three:
- the body takes THREE sizes across the pinch and SHRINKS as he zooms in between the
  first two stops; HC 11 is the only walk zoom where a house fits a phone, so it is
  the one camera, and there the body is 0.407 of a lot against his ruled 0.5.
- the same stop is 4x different between a phone and a 628px window (HC 22 is 56px
  against 224px), because the size reads cv.width.
- THE FIGHT AND THE STREET ARE NOT THE SAME BODIES: 112 to the fight, 56 to the
  street, from the same render.
- CAST_PX MUST STAY 56. My "raise it to 112" advice was wrong as a standalone
  instruction; it only works paired with the city's ladder reading m.w.

WHAT IS LEFT OF [redo killed], FROZEN UNTIL THE CUT HOLDS
- Four gun-clip frames still draw a detached head; NECK HOLDS HEAD prints them.
- Beats two and three are ONE problem, per-facing; two causes for beat three measured
  DEAD and printed by FOUR BEATS.
- Four clips still snap, all small, worst 12.6px. Pose problems.
- POSEHOLD key density; the 47 blocked on UI [vote tab] (rule 15).

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/20 (a) LATEST -- *** HOLD ROUND, RULE 18. Nothing
pushed to the alpha. THE BODY CHANGES SIZE THREE TIMES WHEN HE PINCHES AND ONE OF
THE CHANGES GOES BACKWARDS. Measured, not built. TAB: ANIMATION, unchanged. ***

RULE 18 (Paolo 9/20): only LOADING, WALKING and THE FIGHT ship; every other building
lane HOLDS. This lane holds. [redo killed] stays CLAIMED, the alpha is untouched,
and the round bought numbers for the three, which is what the MODE line asks.
His two sentences that name this lane's output: "the body ONE FIXED SIZE that never
changes while he walks or pinches" (18, WALKING) and "the SAME BODIES at the ruled
size" (17, THE FIGHT).

=== WALKING: THREE SIZES, AND THE FIRST CHANGE GOES THE WRONG WAY
At the four walk-zoom stops a pinch actually reaches (HLEVELS, the city's own ladder,
not values invented for the test), on a 390-wide phone:
    HC | a lot on screen | house fits a phone? | THE BODY | body / lot
    11 |           275px |             ** yes **|  ** 112px **|     0.407
    22 |           550px |                  no |  ** 56px **|     0.102
    44 |          1100px |                  no |     112px |     0.102
    88 |          2200px |                  no |     224px |     0.102
THREE DISTINCT BODY SIZES. His rule says one. And the first change is the ugly one:
PINCHING IN FROM HC 11 TO HC 22 HALVES THE BODY, 112 -> 56, WHILE THE WORLD DOUBLES.
The body shrinks as he zooms in.

[FOR RUN, [one camera]] THE ONE CAMERA IS HC 11, and that is measured not argued: a
lot is 25 fine cells, so it is 275px at HC 11 and 550px or more at every other stop,
and HIS RULE IS "where a house fits". HC 11 is the only walk zoom where a house fits
a phone. At HC 11 the body is 112px against a 275px lot = 0.407 OF A LOT against his
ruled 0.5; the rung ladder offers 28/56/112/224, so 112 is the nearest rung and the
next one up (224) would be 0.81 of a lot.

=== AND THE SAME PINCH GIVES A DIFFERENT BODY ON A DIFFERENT WINDOW
    HC | body on a 378px phone | body on a 628px window
    22 |             ** 56px **|            ** 224px **
A 4x DIFFERENCE AT THE SAME STOP, decided by cv.width. Rule 14 says the phone is the
only measure, so the phone column is the truth -- but a lane measuring on a desktop
reads HC 22 as 224 and is wrong by four times. I NEARLY DID: my first run of this was
on the default window, disagreed with the phone run, and that disagreement is the only
reason it was caught.

=== THE FIGHT: THE TWO SURFACES ARE NOT THE SAME BODIES
    the rig renders           112x112, a standing body 98 rows of it (88% of the frame)
    this lane ships THE FIGHT      112 -- native, every pixel the rig drew
    this lane ships THE STREET      56 -- the same render, halved
A 2.0x RESOLUTION DIFFERENCE FROM THE SAME RENDER. At HC 11, the one legal camera,
the street draws a 112px body by DOUBLING a 56px picture that was itself a halved
112, while the fight gets the real 112. Same person, two resolutions, on the two
surfaces he is asked to believe are one place. That is this lane's half of rule 17's
"the same bodies".

=== A CORRECTION I OWE ON MY OWN STANDING ADVICE
*** THIS BLOCK HAS TOLD THE FLEET FOR THREE ROUNDS TO "RAISE CAST_PX TO 112". AS A
STANDALONE INSTRUCTION THAT IS WRONG. *** Working backwards from the box the city
draws into and the doublings it applies, at every stop and on both window widths:
    HC | box | doublings | so CAST_PX must be
    11 | 112 |        2x |                 56
    22 |  56 |        1x |                 56
    44 | 112 |        2x |                 56
    88 | 224 |        4x |                 56
56 IS ALREADY CORRECT AT EVERY STOP. Raising it alone puts a double-size picture in
the same box at every zoom, which is what ONE NUMBER FOR A BODY bites on.
The sharpness point stands ONLY AS A PAIR and must be said that way: the city's
ladder learns the shipped size off m.w AND this lane raises CAST_PX in the same
round, so the multiplier drops by one and the pixels become real instead of invented.
Said as "raise CAST_PX to 112" it reads as a one-lane job and it is not.
Record: records/BOHEMIA_THE_BODY_CHANGES_SIZE_WHEN_HE_PINCHES_9_20_26.md

NOTHING WAS BUILT, NOTHING PUSHED TO THE ALPHA, NO BUILD STAMP. Gates unchanged and
not re-run as a ship gate; this round's diff is a record and this block.

WHAT IS LEFT OF [redo killed], FROZEN UNTIL THE CUT HOLDS
- Four gun-clip frames still draw a detached head (was 12 before the missed exits
  were found last round). NECK HOLDS HEAD prints them every run.
- Beats two and three are ONE problem: every beat reads differently per facing (b2
  knee 37-159 deg, b3 hand lag 17-200%, b4 holds on 1 of 8, b1 on 8 of 8). Two causes
  for beat three measured DEAD and printed by FOUR BEATS.
- Four clips still snap, all small, worst 12.6px. Pose problems, not rig problems.
- POSEHOLD key density on clips whose keys are too far apart to read as motion.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands (rule 15).

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/18 (a) LATEST -- *** THE NECK IS THE ONLY THING
HOLDING THE HEAD ON. His oldest unfixed complaint, the one he pointed at in his own
frame, is fixed. TAB: ANIMATION. Build 9/18e. ***

ROW STILL CLAIMED: [redo killed]. Rule 14: ships to the alpha only; RUN cuts the demo.

=== WHAT HE POINTED AT, AND IT WAS SITTING ON THE LIST SINCE 9/7
records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg: on NE the head sits up and
to the right of the shoulders with a visible gap. Looking again, the same reads on SE
and SW; N, E and S look attached.

=== MEASURED, WITH A RULER THIS LANE ALREADY OWNED (reuse-first)
The direction-free blob ruler from the head snap gate, swept over 105 clips x 8
facings x 4 phases = 3,360 frames: 48 FRAMES DRAW THE HEAD DETACHED BY 2 TO 8 PX,
across 18 clips, concentrated on NE, E, SE and SW -- his facings.
AND THE CAUSE IS NOT THE POSE. 31 of those frames draw NO NECK AT ALL and EVERY ONE
is detached, against 0.7% of the 1,666 that do draw one. Sampling the line from the
neck joint to the head joint, the pixels along it are part ids 5 and 6: THE ARMS. On
cheer E the entire line is arm 6.
WHY THE ARM WINS: the per-facing layerOverride puts the NEAR arm at index 0 on NE, E
and SE -- nearer than the torso, nearer than the neck at index 4 or 5. Right for an
arm at your side; wrong the moment the pose RAISES it, because the sleeve sweeps
across the throat and erases the one part connecting the head to the body.

=== THE RULE: THE NECK DRAWS IN FRONT OF THE ARMS
Same family as THE NEAR HAND DRAWS IN FRONT (this lane 9/13), except covering the
neck destroys the read of the whole figure, so the neck wins outright.
MONOTONIC, MEASURED BOTH WAYS: detached 48 -> 15, frames with no neck 31 -> 2,
worst gap 8px -> 4px, and not one frame got worse.
*** AND THE RULE FIRST REACHED ONLY HALF THE EXITS, WHICH IS THE THIRD VACUOUS CLAIM
OF THIS SESSION. *** The first cut scored 48 -> 23 and I wrote that the 23 remaining
were "all gun clips, a different defect". WRONG, and my own claim hid it: measuring
the gun frames, the neck sat at index 7 while the arms sat at 0 and 2 -- the rule had
never run on them. handOrder has FOUR order-returning exits; my search-and-replace
matched two. The other two return a bare `ord` and, in the GUN-UNIT branch,
`_headBetween(o2)` with a different variable. THE GATE SAID EVERY EXIT WAS COVERED
because its claim counted occurrences of MY OWN PATTERN. It parses handOrder's body
now: 4 of 4. With all four wrapped the gun frames went 12 -> 4.
A CLAIM BUILT FROM THE SHAPE OF MY OWN EDIT WILL ALWAYS PASS MY OWN EDIT. Third time
this session (after "both paths exercised" and "CAST_PX is one of the rungs"); the fix
every time was to ask the code instead. Looked at before/after on his own facings: a skin-toned neck now
connects head to shoulders on greet SE, preach SE, cheer E, hands-up E, pour NE,
smoke NE, where before the head sat on a black wedge.

=== AND MY FIRST CUT BROKE SOMETHING, CAUGHT BY MY OWN OLDER GATE
The first version inserted the neck at the first arm's index. On S, W and NW the
order opens [7,5,...] -- the HAND nearest, then its own forearm -- so the neck landed
BETWEEN a hand and the arm it belongs to. THE NEAR HAND DRAWS IN FRONT (9/13) went
red at once: 2,304 frames of 6,720. Triaged against clean origin/main, where it was
green, so it was mine. A hand and its arm are ONE UNIT, so the neck now steps in
front of the whole unit.
*** THE NECK GATE ALONE WOULD HAVE SHIPPED THAT REGRESSION -- it stayed 8/0 through
it. The older gate is what caught it. That is the case for keeping narrow gates
around after their round is over. ***

GATES: NECK HOLDS HEAD 8/0, NEW and in the suite, 26 s. Its load-bearing claim ASKS
THE LIVE DRAW ORDER on every facing rather than reading a line out of the source --
last round's lesson, where a guard that regex'd one line stayed green while the thing
it guarded moved. Ceilings are the measurement (23 / 10 / 6px) so the count can only
fall. PRINTS the 23 that remain, of which 12 are GUN clips (two-hand, deadeye,
crouch-aim-2h) whose cause is the separate GUN-UNIT law -- named, not chased.
Four mutations caught, including my own regression and the rule dropped from only ONE
of handOrder's two exits.
Record: records/BOHEMIA_THE_NECK_HOLDS_THE_HEAD_ON_9_18_26.md

PRE-PUSH PASS (rule 13): green except two, BOTH verified identical on a clean
origin/main checkout this round, neither mine:
 - CITY CAST (B6, the neighbour wears one of them) -- the standing red.
 - PAGES PUBLISH -- STILL RED, THIRD ROUND RUNNING, and still nobody's. "every folder
   _config.yml KEEPS is copied by the workflow -- graveyard". Cause named two rounds
   ago: COOK created a top-level graveyard/ folder (d8e1f43), _config.yml keeps it,
   the workflow copies slices/ engine/ records/target only, and the gate binds those
   lists on purpose. [FOR WHOEVER OWNS THE PIPE] one line in either file. Not crossed
   into; that pipe is not this lane's.
FULL SUITE: 107 red at ad23d875; mine are none that I have found.

WHAT IS LEFT OF [redo killed]
- FOUR GUN-CLIP FRAMES still detached (was 12 before the missed exits were found).
  These MAY be the real GUN-UNIT interaction, but that is now a claim about four
  frames and not twelve. The gate prints them every run.
- Beats two and three are ONE problem: every beat reads differently per facing (b2
  knee 37-159 deg, b3 hand lag 17-200%, b4 holds on 1 of 8, b1 on 8 of 8). Two causes
  for beat three measured DEAD and printed by FOUR BEATS. The arm's inertia IS real in
  the sim; delivery to the screen fails.
- Four clips still snap, all small, worst 12.6px. Pose problems, not rig problems.
- POSEHOLD key density on clips whose keys are too far apart to read as motion.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands (rule 15).
  Checked again this round: still OPEN.
- THE STREET STILL DRAWS BLURRY BODIES at C 14 to 22, quadrupling the 56 this lane
  ships (itself a halved 112). Two changes must land together or ONE NUMBER FOR A BODY
  bites: the city's ladder reads the shipped size off m.w, and this lane raises
  CAST_PX to 112 the same round. 2.14x wire, 0.94x bake, 0.95x phone pixels.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/16 (a) LATEST -- *** A GUARD THAT READS A LINE IS
MEASURING SOMETHING NARROWER THAN IT NAMES. The hole was in my own guard, and two
of my own claims were vacuous. TAB: ANIMATION. No build change, nothing to look at. ***

=== CHARACTER FIXED WHAT I REPORTED, AND BETTER
My last block said the chain was "armed and waiting on one global", BOHEMIA_STEP_FINE,
read once and written nowhere. CHARACTER found the same and went further, in their
own words in the file: RUN had named its constant STEP_CELLS, so their wire was
DANGLING ("a second name for one number, the exact bug the law is about, committed by
the lane quoting it"), AND repointing it would have been worse -- STEP_CELLS is 5, so
the ruled branch would have fired at today's camera and asked for 550 px of person on
a 378 px screen. RUN had measured the same thing: "a person taller than a doorway".
THE TRIGGER IS NOT THE STEP NOW. It is WHETHER A HOUSE FITS ON THE SCREEN, self
measuring off the real camera, which cannot make a giant on a tight camera by
construction. That is a better answer than the one I wrote down and it is theirs.
MY LAST BLOCK'S "[FOR RUN] one global nobody publishes" IS THEREFORE SPENT. Do not
route it; it is answered.

=== AND IT PUT A HOLE STRAIGHT THROUGH MY OWN GUARD
bodyLadder has TWO paths now: a legacy ladder and a ruled one. MY GUARD REGEX'D THE
LEGACY LINE out of the city source. MEASURED, THE RULED PATH IS ALREADY LIVE: in
human mode at C 14 to 22 the city draws the body into a 224 px box TODAY, not the
112 my guard was checking. It would have stayed green while the real box doubled.
    C | path   | box | sprite from a 56 ship | agree
    6 | RULED  |  56 |          1x ->     56 | yes
    8 | RULED  | 112 |          2x ->    112 | yes
   14 | RULED  | 224 |          4x ->    224 | yes
   22 | RULED  | 224 |          4x ->    224 | yes
   28 | legacy |  56 |          1x ->     56 | yes
   44 | legacy | 112 |          2x ->    112 | yes
   88 | legacy | 224 |          4x ->    224 | yes
Same shape as every ruler bug in this clip -- seconds read as fractions, 56-space
numbers on a 112 rig, two endpoints called a peak, an eighth of a fall called a fall,
one facing called a measurement. SIXTH OF THIS SESSION, and the first one inside a
guard I wrote to prevent exactly this.
THE INVARIANT THAT COVERS BOTH PATHS, asked of the city's own functions at every
zoom: THE SPRITE THE CITY BUILDS FROM WHAT THIS LANE SHIPS MUST EQUAL THE BOX IT
DRAWS INTO. 14 zooms, both paths, green at CAST_PX=56 because the rungs 28/56/112/224
are exactly 0.5x/1x/2x/4x of 56. Raise CAST_PX alone and 0 OF 14 agree.

=== AND MY SECOND CLAIM WAS VACUOUS, CAUGHT BY MUTATION
I added "both paths were exercised" so the check could not quietly go single-path.
It asked lotFitsOnScreen ITSELF, which measures the CONDITION, not the branch.
Hardcoding bodyLadder to its legacy line leaves the condition true and the branch
dead, and that mutation scored 12 passed 0 failed. It wraps the real function and
asks bodyLadder now, so the claim is "bodyLadder CONSULTED the condition". The same
mutation reports 0 consultations and goes red.
TWO VACUOUS CONTROLS IN TWO ROUNDS, BOTH MINE, both caught by mutation and not by
reading. A claim about code must be made by RUNNING the code, and a claim that a path
exists must be made by WATCHING THAT PATH GET TAKEN.

=== ONE MUTATION THAT WAS NOT A HOLE, AND SAYING SO
I changed the city's top rung 224 -> 448 expecting red and it stayed green, correctly:
bodySpriteC DERIVES its answer from bodyLadder, so the sprite follows the box by
construction. Only CAST_PX moving (caught) or the draw code's multiplier mapping can
break the agreement. A mutation that does not bite is not automatically a gate bug,
and calling it one would send the next round hunting a defect that is not there.

GATES: ONE NUMBER FOR A BODY 12/0, behavioural end to end (it opens the city page and
asks its functions). Nothing about the rig, the constant or the street changed.
Record: records/BOHEMIA_A_GUARD_THAT_READS_A_LINE_9_16_26.md

PRE-PUSH PASS (rule 13): green except two, BOTH VERIFIED IDENTICAL ON A CLEAN
origin/main CHECKOUT THIS ROUND, neither mine:
 - CITY CAST (B6, the neighbour wears one of them) -- the standing red.
 - PAGES PUBLISH, and THIS ONE IS NEW AND FLEET-WIDE: "every folder _config.yml KEEPS
   is copied by the workflow -- graveyard". CAUSE FOUND, not guessed: COOK created a
   top-level graveyard/ folder ([car recook] r6, d8e1f43, killing twenty barrels,
   which is GRAVEYARD IS FINAL working). _config.yml keeps it, the workflow's copy
   list is slices/ engine/ records/target only, and the gate binds those two lists on
   purpose. [FOR WHOEVER OWNS THE PIPE] it is one line in either file. Not fixed here:
   _config.yml and the pages workflow are not this lane's, and crossing in is the
   boundary rule. Named rather than left for somebody to rediscover.
FULL SUITE: 107 red at ad23d875; mine are none that I have found.

[FOR WHOEVER OWNS THE STREET DRAW] STILL TRUE AND NOW SHARPER: at C 14 to 22 the city
already draws a 224 px body by QUADRUPLING the 56 this lane ships, and that 56 is the
rig's native 112 halved. Two changes make it sharp and must land together or the guard
bites: the city's ladder reads the shipped size off m.w, and this lane raises CAST_PX
to 112 the same round. Cost measured: 2.14x wire, 0.94x bake, 0.95x phone pixels.

WHAT IS LEFT OF [redo killed], UNCHANGED THIS ROUND
- Beats two and three are ONE problem: every beat reads differently per facing (b2
  knee 37-159 deg, b3 hand lag 17-200%, b4 holds on 1 of 8, b1 on 8 of 8). Two causes
  for beat three measured DEAD and printed by the gate. The arm's inertia IS real in
  the sim; delivery to the screen fails.
- Four clips still snap, all small, worst 12.6px. Pose problems, not rig problems.
- POSEHOLD key density; the NE head-off-shoulders gap in his own frame.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands (rule 15).
  Checked again this round: still OPEN.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/15 (c) LATEST -- *** THE BODY IS WAITING ON ONE
GLOBAL, AND RAISING THE BAKE ALONE IS A REGRESSION. I nearly shipped it and the
measurement stopped me. TAB: ANIMATION. No build change; nothing new to look at. ***

MY OWN LAST HANDOFF SAID THIS LANE "WAITS ON RUN'S CONSTANT". RULE 12 SAYS A
DEPENDENCY IS A PREMISE, NOT A GATE, SO I MEASURED IT AND IT WAS WRONG BOTH WAYS.

=== THE SIZE ALREADY EXISTS, AS A RATIO, AND NOBODY HAD TO PICK IT
LIFE+CITY's BOH_LATTICE: LOT_FINE 24 fine cells, LOT_M 18 m, BODY_LOTS 0.5.
CHARACTER's BODY_SCALE: lotFine 25 (measured median lot pitch), bodyLots 0.5.
His "about half a lot tall" is a RATIO and it is already named, so this lane was
never blocked on a number.

=== THE WHOLE CHAIN IS ARMED AND SWITCHED OFF, AND IT IS ONE GLOBAL
[FOR RUN] BODY_SCALE.stepFine() reads window.BOHEMIA_STEP_FINE and falls back to 1,
with CHARACTER's own comment "RUN'S ONE NUMBER, when it lands... the day RUN sets it
the body moves with the street". MEASURED ACROSS EVERY SLICE, ENGINE MODULE AND
TOOL: ONE READ, ZERO WRITES. Nothing sets it. So stepFine() is 1, bodyLadder takes
its `if (step <= 1)` legacy branch and NEVER REACHES the half-a-lot line.
    at the walk zoom HC=44
    his ruled size   0.5 lots x 25 fine x 44 px = 550 px, nearest rung 224
    what is drawn    the legacy branch, C>=32   = 112 px
HIS RULING IS WIRED END TO END AND WAITING ON ONE GLOBAL NOBODY PUBLISHES. That is
RUN's (the law gives RUN the step), so it is reported and not touched. It is not a
bug in anybody's code: every piece does the right thing the moment it lands.

=== AND THE OBVIOUS FIX IS A REGRESSION, MEASURED ON THE CITY'S OWN LADDER
The street draws bodies into a 112px box today; this lane ships 56, which is the
rig's native 112 HALVED. So every person out there is a 112px body made by doubling
a 56px image that was itself a halved 112 -- real pixels thrown away, then guessed
back. Side by side at the size he sees, the 56 path is 4px blocks with a mush face
and the 112 path has eyes, separated legs and shoes.
EVERY NUMBER SAID RAISE IT: payload 2.14x, bake time 0.94x, page errors 0, and
PHONE-SIDE PIXELS 0.95x, because arriving at 112 removes a whole rung from the EPX
ladder the city caches. Cheaper on the phone AND sharper.
*** AND RAISING IT ALONE WOULD STILL HAVE BEEN A REGRESSION: ***
    ship |  epx2 -> _hd | what C>=32 uses | drawn into a box of
      56 |          112 |             112 |                 112
     112 |          224 |             224 |                 112
The city builds its ladder by DOUBLING WHATEVER IT IS SENT, exactly once at the
walk zoom. Ship 56 and it hands over exactly 112. SHIP 112 AND IT HANDS A 224px
PICTURE TO A 112px BOX. I would have shipped that if I had trusted the arithmetic
instead of running it. The shipped size is already in the message (m.w) so the
receiving side can learn it in one change, but that file belongs to the lane that
owns the draw, so THE COUPLING IS GUARDED, NOT CROSSED.

GATES: ONE NUMBER FOR A BODY 12/0 (was 9). Nothing about the rig or the constant
changed this round; what shipped is the guard.
*** THE FIRST CUT OF THE GUARD WAS WRONG AND A MUTATION CAUGHT IT. *** I asserted
"CAST_PX is one of the city's rungs and every rung is a doubling away from it".
CAST_PX=112 PASSED THAT -- 112 IS a rung and 28/56/112/224 are all powers of two
from it -- so the exact regression I was guarding against walked straight through.
The real invariant is narrower: at the walk zoom the city doubles the shipped sprite
EXACTLY ONCE into the rung it draws at, so 2 x CAST_PX must equal that rung. 112, 48
and 28 are all caught now.

PRE-PUSH PASS (rule 13): the body and rig gates plus the shared ones, green. ONE
RED, NOT MINE: CITY CAST (B6, the neighbour wears one of them), the identical
failure verified on a clean origin/main checkout last round. HEAD FOLLOWS RIG is
green again this round, confirming last round's read that its one red was my own
harness starting browsers back to back.
FULL SUITE: 107 red at ad23d875; mine are none that I have found.

[FOR WHOEVER OWNS THE STREET DRAW] two changes make the body sharp and they must
land together or the gate bites: (1) the city's sprite ladder reads the shipped size
off m.w instead of assuming 56; (2) this lane raises CAST_PX to 112 the same round.
2.14x on the wire, 0.95x on the phone.

WHAT IS LEFT OF [redo killed], UNCHANGED THIS ROUND
- Beats two and three are ONE problem: every beat reads differently per facing
  (beat 2 knee peak 37-159 deg, beat 3 hand lag 17-200%, beat 4 holds on 1 of 8,
  beat 1 on 8 of 8). Two causes for beat three are measured DEAD and the gate prints
  both. The arm's inertia IS real in the sim; delivery to the screen fails.
- Four clips still snap, all small, worst 12.6px. Pose problems, not rig problems.
- POSEHOLD key density; the NE head-off-shoulders gap in his own frame.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands (rule 15).
  Checked again this round: still OPEN, so the blocker stands.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/15 (b) LATEST -- *** ONE NUMBER FOR A BODY. His
new ruling (rule 16, THE STEP IS A HOUSE) came in and it names this lane, so it
beat the claim. TAB: ANIMATION. Build 9/15o. ***

RULE 16 (Paolo 9/15) gives this lane exactly one job: "the rig at the new size,
the clips unchanged in content", and gives the fleet one rule: "ONE NUMBER IN ONE
PLACE... NOTHING IS BAKED ONCE. A second copy anywhere is the bug."
[redo killed] STAYS CLAIMED and is untouched this round; his ask beat it (rule 8).

=== WHAT WAS MEASURED BEFORE ANYTHING WAS TOUCHED
The rig renders 112x112 with a 98-row standing body. The bake that ships bodies to
the street HALVES it to 56 before sending. Across eight facings the halve keeps
4,691 of 18,739 body pixels (25%) and a 49-row body, while 158 of 160 colours
survive (99%). THE LOSS IS RESOLUTION, NOT PALETTE. The city then doubles it back
up with Scale2x to draw it, inventing the pixels just discarded.
AND IT WAS NOT A MISTAKE, IT WAS AN EXPIRED CONTRACT. The bake's own note says both
exports "keep the size they PROMISE", and 56 WAS the rig's native size when that
promise was made. The rig later moved to 112 (RIG_RS 2); COMBAT got the benefit
(bake112 stops upscaling once the frame arrives at 112) while the city kept being
handed a half-size body. Nothing was broken until his ruling made the cost real.

=== THE SIX COPIES, AND THE SEVENTH
The number lived in SIX places: twice in the bake, and in the w/h typed into each
of the five senders (city player, city cast, the cast append, the faction cast, the
run slice). THE SEVENTH WAS THE BAKE'S OWN NAME -- a function called bake56 that
bakes at a constant is the copy that misleads the next reader. It is bakeCast now.
SHIPPED: const CAST_PX=56, and every one of those places asks it.

=== THE SAFETY CLAIM WAS PROVED, NOT ASSERTED
At 56 this is BYTE-IDENTICAL to what shipped before: 48 baked frames (8 facings x
3 clips x bordered and borderless) compared byte for byte through the real cast
path against origin/main. 48 identical, 0 different. Re-proved a second time after
rebasing onto another lane's [bigger bodies] work. That is why it is safe to land
before RUN's step constant exists.
GROWING THE STREET'S BODIES IS NOW ONE EDIT, and at 112 the halve stops happening
by itself because f.CW===CAST_PX is true and the frame ships native.
*** WHEN IT GROWS IS NOT THIS LANE'S CALL. *** The law gives RUN the one constant
and gives this lane "the rig at the new size". Nothing about the street was changed
here; the pipe was made ready and the cost measured so the decision is informed.
NO COLLISION CHECKED, not assumed: origin/main carries 0 CAST_PX, and the other
lane's [bigger bodies] work is the LATTICE ("a house is 25 cells"), not body pixels.

GATES: ONE NUMBER FOR A BODY 9/0, NEW and in the suite. The load-bearing claim is
BEHAVIOURAL, not a source scan (PLUMBER proved a scan cannot see a typed list once
strings are stripped): it intercepts the real postMessage traffic and checks that
what every sender PROMISES is what the bake actually SHIPS.
*** THE CITY IFRAME IS LAZY AND THAT NEARLY MADE IT VACUOUS. *** #cityFrame does
not exist until the CITY tab opens and every sender begins
`if(!fr||!fr.contentWindow)return false`, so the FIRST CUT CAUGHT ZERO SENDERS AND
SCORED "0 of 0 agree" AS A PASS -- the same vacuous-control trap this lane hit once
on HEAD IN FRAME. The gate installs a target so the real sender code runs, and THE
SENDER COUNT IS NOW ITS OWN CLAIM. CONTROL: combat's separate 112 promise untouched.
Five mutations; moving the constant to 112 stays GREEN ON PURPOSE, because the gate
forbids a SECOND COPY and never the ruling being executed.
Record: records/BOHEMIA_ONE_NUMBER_FOR_A_BODY_9_15_26.md

PRE-PUSH PASS (rule 13): the body and rig gates plus the shared ones, green on the
merged tree. TWO REDS, NEITHER MINE, both verified on a clean origin/main checkout
this round: CITY CAST (B6, the neighbour wears one of them) and RIG CHECK. HEAD
FOLLOWS RIG flagged red once in my own harness and is NOT red: three consecutive
direct runs exit 0 at 5/0, identical on clean main -- it was my runner starting
browsers back to back, and I am saying so rather than routing a flake at somebody.
FULL SUITE: 107 red at ad23d875. Mine are none that I have found; I have not run
the other 105 and am not claiming them either way.

=== THE NEW SIZE IS PRICED, FOR RUN AND PLUMBER
The MODE line asks for the eight facings AT the new size. The number is RUN's, so
this was measured on a COPY with a knob and NOTHING WAS SHIPPED. One city cast bake,
eight facings x five frames (idle + the four breath phases the city receives):
    size | frames | payload bytes | bake time | page errors
      56 |     40 |        29,706 |    487 ms |           0
     112 |     40 |        63,620 |    460 ms |           0
GOING TO 112 COSTS 2.14x THE PAYLOAD AND 0.94x THE BAKE TIME. The bigger bake is
slightly FASTER, because the halve is a per-pixel pass that stops happening once the
frame arrives at the asked-for size. THE COST OF HIS RULING ON THIS PIPE IS BYTES,
NOT CPU -- per person, over CITY_LOOKS bodies. The body is 98 rows instead of 49 on
every facing and the city stops doubling it with Scale2x. ZERO page errors at either
size. The law says "whichever measures cleaner and cheaper on a phone; PLUMBER holds
the fps budget" -- those are the two numbers that choice needs.
[FOR RUN] flipping this lane's half is one edit: const CAST_PX in the alpha. The
gate stays green when you move it; it only refuses a second copy.

WHAT IS LEFT OF [redo killed], UNCHANGED THIS ROUND
- Beats two and three are ONE problem: every beat reads differently per facing
  (beat two's knee peak 37 to 159 degrees, beat three's hand lag 17% to 200%, beat
  four holds on 1 of 8, beat one on 8 of 8). Two causes for beat three are measured
  DEAD (a collapsing bone; the knock projection) and the gate prints both so nobody
  re-runs them. The arm's inertia IS real in the sim; delivery to the screen fails.
- Four clips still snap, all small, worst 12.6px. Pose problems, not rig problems.
- POSEHOLD key density on clips whose keys are too far apart to read as motion.
- The NE head-off-shoulders gap in his own frame. Pose too.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands (rule 15).
  Checked again this round: that row is still OPEN, so the blocker stands.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/15 (a) LATEST -- *** ONE FACING IS NOT A
MEASUREMENT. A correction I owe on my own last round, two dead hypotheses, and no
rig change on purpose. TAB: ANIMATION. No new build; nothing new for him to look
at this round. ***

ROW STILL CLAIMED: [redo killed]. RULE 14: ships to the ALPHA only; RUN cuts the demo.
RULE 15 IS NEW (Paolo 9/14, ONE VOTE TAB) AND IT CHANGES THIS LANE'S DELIVERY.
Everything wanting his thumb goes to the VOTE tab in the demo; no lane draws its
own judge page again. So the ONES YOU KILLED filter I built in JUDGE ALL is now an
archive and presents nothing. MEASURED rather than assumed (rule 12): UI [vote tab]
is still OPEN, there is no registry to write into, and rule 15(d) gives UI the
shell, queue, registry and vanish gate. So the 47 repaired clips CANNOT reach him
until that lands. This lane's row for it is [into the vote tab], still OPEN.
(slices/BOHEMIA_VOTE_CURRENT.html exists but is dated 9/12, two days before the
ruling, and is not that tab.)

=== THE CORRECTION I OWE
Last round I shipped a claim reading "BEAT FOUR LANDS". It came from a gate that
called hsReset('S') and nothing else. Swept across eight facings, beat four is
16.8px on S and about -0.9 on the other seven. TRUE ON ONE FACING OUT OF EIGHT,
and I had not looked at the rest. It reads "BEAT FOUR LANDS ON S" now and names
how many facings hold. Same shape as every ruler bug in this clip: the ruler
measured something smaller than the thing it named. FIFTH of this session.

=== WHAT THE EIGHT FACINGS SAY, AND IT IS THE ROUND'S REAL DELIVERABLE
    dir | b1 head/waist | b2 knee peak -> end | b3 body/hand (lag%) | b4 arms in
      N |      10.8/6.4 |           102 -> 10 |          24/3 (88%) |        2
     NE |      10.8/6.4 |           121 -> 22 |       19/-19 (200%) |     -0.3
      E |      11.2/5.4 |          142 -> 144 |          15/9 (40%) |     -0.2
     SE |        10/3.2 |            80 -> 30 |          13/5 (62%) |      0.5
      S |        10/4.1 |             38 -> 5 |         12/10 (17%) |       16
     SW |        10/4.1 |             37 -> 0 |          12/5 (58%) |     -0.9
      W |      20.6/5.8 |          159 -> 130 |          26/8 (69%) |      0.6
     NW |      10.8/5.8 |           101 -> 27 |       21/-17 (181%) |     -0.3
BEAT ONE HOLDS ON 8 OF 8 (last round's work, now verified not assumed). BEAT FOUR
HOLDS ON 1 OF 8. Beat two's knee peak runs 37 to 159 degrees; beat three's hand lag
runs 17% to 200%. The same clip is a different animation depending only on which
way he was knocked. That is the thing to fix, and it is bigger than any one beat.

=== TWO HYPOTHESES FOR BEAT THREE, BOTH KILLED, NEITHER SHIPPED
1. A BONE COLLAPSING under the RIGID LIMB LAW (the sim shoulder-to-hand distance
   hits 0.9px on W, and a near-zero vector deciding a limb's direction is the bug
   this lane already found once). MEASURED over 26,880 bone-frames: no bone below
   60% of rest, 0 under a quarter. The 0.9px was shoulder-to-HAND with a folded
   elbow, which is anatomy, not a bone. DEAD.
2. THE KNOCK PROJECTION turning a backward lag into screen-down, positive on the
   north facings and negative on the south. MEASURED: the sim backward lag is
   2.7px at most, its screen term 0.1px, and the two-term split misses the real
   motion by 31.6px -- because the RIGID LIMB LAW and the TRACKING CAMERA both run
   AFTER the projection, so sk is not the projection's output. DEAD.
WHAT IS TRUE: the arm's inertia is real and large in the SIM (the shoulder drops
19px while the hand drops 7.6, a 60% lag; the arm swings 200->247 degrees against
the spine). His mechanism EXISTS. The delivery to the screen fails and its cause is
STILL OPEN. Do not re-run either hypothesis; the gate prints both every run.

=== TWO KNOBS THAT DO NOT REACH, BOTH DELETED
- hand/elbow damping in his window, swept 0.38 -> 0.05 (7x, on a value deliberately
  set as v1's "subtle linger"): worst facing 17% -> 27%, and four rendered rows side
  by side are nearly indistinguishable.
- rotating the whole rendered arm about the shoulder to resist the shoulder's
  screen-downward travel (beat one's own trick): 3.16px at most, and the decay
  cancels it exactly when the drop peaks.
A 7x parameter change that is invisible on screen is a knob that does not reach.
Shipping either would be chasing the gate's number instead of what he sees.

GATES: FOUR BEATS 10/0, now sweeping ALL EIGHT facings and printing every beat on
every one, plus both dead hypotheses so nobody spends another round on them. Two
new claims, both mutation-proved: that the eight are swept, AND THAT THEY ARE
EIGHT DIFFERENT RUNS -- my first cut of the sweep reset to each facing then posed a
hardcoded 'S', hsPose re-resets when the key differs, all eight rows came back
byte-identical, and the gate called that eight facings. A COUNT OF FACINGS IS NOT A
SWEEP. The new claim catches exactly that bug.
Record: records/BOHEMIA_ONE_FACING_IS_NOT_A_MEASUREMENT_9_15_26.md

PRE-PUSH PASS (rule 13): the body and rig gates plus the shared ones, all green.
FULL SUITE: 107 red at ad23d875 (the front page's suite line). Mine are NONE that I
have found: RIG CHECK and REUSE-FIRST are the two this lane's diff touches and both
were verified red on a clean origin/main checkout last round, so neither is mine.
I have not run the other 105 and am not claiming them either way.

WHAT IS LEFT OF THE ROW
- BEATS TWO AND THREE, and they are now ONE problem, not two: every beat reads
  differently per facing and nobody had measured that because the gate looked at S.
  Beat three's mechanism exists in the sim and does not survive to the screen; two
  reasons why are dead. Find the third before building anything.
- BEAT FOUR is 1 of 8 and that is new information, not a regression.
- Four clips still snap, all small: crouch-aim-2h 4, crouch-aim-1h 2, spear-drive 2,
  shiv-jab 1, worst 12.6px. Pose problems, not rig problems.
- Clips whose keys are too far apart to read as motion: POSEHOLD key density.
- On NE in his own frame (records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg)
  the head sits up and right of the shoulders with a visible gap. Pose too.
- THE 47 ARE REPAIRED AND CANNOT REACH HIM until UI [vote tab] lands. That is the
  row's real blocker now, and it is not this lane's to build.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/14 (b) LATEST -- *** THE HEAD WAS WELDED TO THE
SPINE. Beat one of his headshot spec is BUILT after defeating three attempts, and
the reason all three failed is now measured and written into the code so a fourth
is never tried. TAB: ANIMATION. Build 9/14p. ***

ROW STILL CLAIMED: [redo killed] FORTY-SEVEN-CLIPS-ARE-REDONE-NOT-DELETED.
RULE 14 (9/13): ships to the ALPHA only. RUN cuts the demo. No five-minute break
on this lane's first line, so it holds its claim and adds nothing to the demo.

=== THE PIN, WHICH IS THE WHOLE POINT OF THIS ROUND
Last round's record said FIND THE PIN before writing a fourth kick. Found, and it
is exact: THE HEAD HAS ZERO FREEDOM IN THE SIM. Head angle minus spine angle is
0.0000 degrees on every step of every fall, with a 5px impulse on the head and
without one. The GLUE LAW block in hsStep rewrites headTop off the spine frame
every single step, so every impulse was overwritten in the step it was applied.
That is why 2.6 and 5.0 measured the same number, and why attempt three failed:
it exempted the one joint in the rig that has no freedom to use.
The sim's lever is the NECK, already kicked at 3.4 px/frame -- and the horizontal
speed cap clips it to 1.6 on the first step while the waist's 1.2 passes through.
That is the whole of why the head LEADS instead of snapping.
LIFTING THAT CAP BUILDS BEAT ONE AND KILLS BEAT FOUR, swept and measured:
    neck ceiling      0/1.6   2.2    2.8    3.4+
    beat 1 ratio       1.24   1.73   2.22   2.73
    beat 4 arms in     +16    -0.6   -2.9   -13.3   (his floor is 12)
Same bad trade the leg window offered last round. The cap is NOT touched.

=== WHAT SHIPPED: THE NECK JOINT, WHICH THE SIM DOES NOT HAVE
In hsPose, on the rendered head, inside his window only: a pulse that peaks 30%
in and returns to glued by the end. The glue law's own sentence is "the stiffest
neck: ONE WHIP with the shot, then it rides the body" and that is exactly this.
THE SIM IS NEVER TOUCHED, so beats two three and four measure IDENTICAL on all
eight facings -- verified against the previous build, not assumed. The RIGID LIMB
LAW right below forces the neck bone back to rest length, which is why the head
cannot come off: worst head-to-body gap 1px, eight facings, out to 0.9 rad.
Amplitude 0.45 rad (26 deg) was LOOKED AT in a zoomed strip, not picked off a
table: 0.6 reads long-necked, 0.8 lifts the head off the collar.
HIS FOUR BEATS NOW: beat 1 BUILT (head peaks 10.0px against the waist's 4.1),
beat 2 NOT BUILT, beat 3 NOT BUILT, beat 4 BUILT (hand closes 16.0px). Two of four.

=== THREE RULERS WERE WRONG THIS ROUND AND ALL THREE ARE FIXED
1. A head-attachment ruler looked DOWNWARD for the neck and called the shipped
   glued build 19% attached with a 9-row gap. Once a body is lying down the neck
   is BESIDE the head. Replaced with a direction-free blob distance: 1px, always.
2. FOUR BEATS' beat-one ruler was two ENDPOINTS, at(0.08) minus at(0). A snap
   that whips and returns is invisible between them -- it scored the same 6.1px
   at every amplitude from 0.1 to 0.6 rad. It measures the PEAK now.
3. MOTION VISIBLE could only ever see an EIGHTH OF THE FALL. hsPose clamps to
   dt=0.05 and steps once per call, so its seven samples reached HS.t=0.4 of a
   3.22s fall. Its tops read 9,8,8,9,10,10,10 -- it was scoring its 2px floor on
   a 1px UPWARD wobble. Sampled across the whole fall the same clip drops 46px
   and widens 61. Floors are 20 and 20 now; the gate got about TEN TIMES
   STRONGER and still catches the frozen sprite it was born for (0px, 4 red).
FOURTH RULER BUG OF THIS SESSION, always the same shape: a unit or a span that is
not what the ruler's sentence claims. Seconds read as fractions, 56-space numbers
on a 112 rig, two endpoints called a peak, an eighth of a fall called a fall.
WORTH HUNTING A FIFTH TIME.

=== ONE THING WAS BUILT AND DELETED, ON PURPOSE
A guard stopping the head's whip from dragging the tracking camera. It measured
IDENTICAL on every gate and every number with and without it -- the body never
moved (0 of 40 steps) and the sprite-top change was the head's own 2px drop from
rotating 26 degrees on an 18px bone. Written on a hypothesis the measurement had
already disproved. Deleted rather than shipped.

GATES: HEAD SNAPS 13/0 (NEW, in the suite; 7 mutations caught; the load-bearing
claim is the WHIP -- peak head travel over the travel at the window END, because
a head that merely leads moves monotonically and scores exactly 1.00, which is
what the build before this scored on all eight facings). FOUR BEATS 8/0 (beat one
left its NOT BUILT list). MOTION VISIBLE 24/0 with the stronger floors.
Record: records/BOHEMIA_THE_HEAD_WAS_WELDED_TO_THE_SPINE_9_14_26.md

PRE-PUSH PASS (rule 13): the body and rig gates plus the shared ones. All green
except RIG CHECK and REUSE-FIRST, BOTH VERIFIED RED ON A CLEAN origin/main
CHECKOUT THIS ROUND and neither mine (haircut-turns joint claim; a REUSE CHECK
block missing from bohemia_there_are_enemies_patch.py). MOTION VISIBLE went red on
my change, was triaged first, and is green on its own merits now.
FULL SUITE: no SUITE LINE on the front page yet; PLUMBER [suite line] owns it.

WHAT IS LEFT OF THE ROW, unchanged from last round except beat one:
- BEATS TWO AND THREE need a MECHANISM, not a window. For the arms to hold up the
  hands have to resist while the torso goes. Moving windows just trades beats.
- BEAT TWO IS NOT WHAT THE BOARD ASSUMES, and it was measured this round before
  being left. The knee peak tracks |K[0]| exactly, because ONE canonical sim is
  projected onto eight knock axes: E and W (pure lateral, |K[0]|=1) fold to 142
  and 159 degrees and STAY folded; the other six fold and straighten back out
  (N 102->14, NE 122->22, SE 80->29, S 38->5, SW 37->3, NW 102->31). Facings
  sharing a K share their numbers, which is the check on that reading. So the
  sim already folds the knee nearly DOUBLE -- the question is not how to make
  knees fold, it is whether a fold that reads on E and W can survive the
  projection onto the other six, or must be authored per-projection. A real
  fork, and it wants measuring. Table is in the record.
- W IS THE ONE FACING THE SNAP DOES NOT CLEANLY HOLD and the gate prints it every
  run: the snap happens (head 20px against the waist's 5px) but W's own fall is
  the most violent of the eight and outruns the whip by the window's end. W's knee
  peaks at 159 degrees, worst of the eight. That is BEAT TWO's defect.
- Four clips still snap, all small: crouch-aim-2h 4, crouch-aim-1h 2, spear-drive
  2, shiv-jab 1, worst 12.6px. Pose problems, not rig problems.
- Clips whose keys are too far apart to read as motion (crouch-aim-2h NW is
  arm-down at k2 and arm-out at k3): POSEHOLD key density.
- On NE in his own frame (records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg)
  the head sits up and right of the shoulders with a visible gap. Pose too.
- The 47 are repaired and visible in JUDGE ALL under ONES YOU KILLED. Next
  verdict is HIS.

Nothing [PENDING Paolo].

ANIMATION (animation-lr9y9i): 9/13 (c) LATEST -- *** A ONE-PIXEL VECTOR HAS NO
DIRECTION. The third time this rig was caught deciding something big with a
measurement too small to carry it, and it was the single cause of the ten clips
his verdict left broken. TAB: ANIMATION and CHARACTER. Build 9/13zc. ***
(THE ROUND-ONE BLOCK BELOW WAS LOST FROM THIS FILE by somebody's rebase between
9/13 (b) and now -- rewritten here rather than left missing. Take main's file and
re-apply your own block; never resolve this file with --theirs.)

ROW STILL CLAIMED: [redo killed] FORTY-SEVEN-CLIPS-ARE-REDONE-NOT-DELETED.
SHIPPED BEFORE IT, all three of his 9/7 rig complaints: [elbows bend] 9/11,
[coat follows] 9/12, [facing order] 9/13.

RULE 14 (9/13): this lane ships to the ALPHA and the workshop and does NOT re-cut
the demo. RUN cuts it. ANIMATION has no five-minute break on its first line, so it
holds its claim and adds nothing to the demo -- what its own MODE line says.
CHECKED, because it was worth knowing whether this lane even reaches his five
minutes: the walked city has NO buildFrame and NO drawChar in it at all (zero
references in BOHEMIA_CITY_WORLD.html). It draws people from CAST_CV, canvases the
alpha BAKES LIVE from the rig at load and posts into the iframe (citySendCast). So
the rig fixes DO reach the walked surface, through the bake and not the renderer.

=== ROUND ONE: THE 47 WERE RE-ANALYSED AND THE REDO LIST IS TEN, NOT FORTY-SEVEN
The board quotes the last third of what he said on 9/7. The whole thing is in
records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt: "...some of the DIRECTIONS look like dog
shit ... WE GOTTA RE-ANALYZE A LOT OF THESE. IF I KILLED IT I DON'T WANT IT GONE."
He named the REASON, and it is the three defects this lane has since fixed.
Measured against the alpha at b923fc3^, all 47 x 8 facings x 24 buckets:
  THE FACING ORDER hit EVERY ONE and all of it is gone: 144 far-arm-over-head
  frames on every clip -> 0; 192 -> 0 hand-behind-its-own-arm on six gun clips.
  THE ELBOW: nine clips had a joint crossing 30px in one frame; most now under 5.
A ruler was thrown away there too: ranking by how far an elbow MOVES put
JUMPING-JACKS top with 218 offences -- a clip that is supposed to fling its arms --
while a real 30px flip sat below it. Distance measures speed. Record:
records/BOHEMIA_THE_FORTY_SEVEN_RE_ANALYSED_9_13_26.md

=== ROUND TWO: THE CAUSE OF ALL TEN, IN THE RIG
crouch-aim-1h facing E, two consecutive frames: the shoulder moved 1 pixel, the
hand 2.2, THE ELBOW 31 -- [49,48] to [74,29], one side of the body to the other,
on an arm whose whole reach is 32. solveIK takes a = atan2(target - shoulder) and
puts the elbow at a + off on a 16-pixel radius, and this clip holds the hand ONE
PIXEL from the shoulder. Frame 14 that vector is (0,+1), frame 15 it is (0,-1):
`a` flips 180 degrees and the elbow swings the diameter of the arm. The pose did
not change. The rounding did.
  9/11 the elbow SIDE was a knife-edge height comparison
  9/12 the coat's HIP was one scanline a swinging arm kept covering
  9/13 the elbow ANGLE is a vector one pixel long
Same shape three times. Watch for a fourth.
FIX: below a quarter of the arm's own reach the direction blends toward the REST
arm's direction -- what a folding arm really does, the elbow stays where the upper
arm points instead of orbiting the shoulder. At the threshold the blend IS the
target's direction, so nothing above a quarter reach moves by a pixel.
crouch-aim-1h 31.4px -> 3.2px, crouch-aim-2h 27px -> 4px.

TWO RULERS WERE WRONG AND THE FIX EXPOSED BOTH. This is the part to carry forward.
  1 JOINT SNAP's floor was 4px. When the fix took the worst frame from 31.4 to
    3.2, THE GATE REPORTED MORE SNAPPING CLIPS, NOT FEWER -- where the hand is
    parked on the shoulder the ratio's denominator sits at its 0.5 guard and a
    smooth 4px move scores 8x. A ruler that gets worse when the thing it measures
    gets better is measuring the wrong thing. Floor is 8px now, half the upper
    arm, and the three builds separate monotonically:
        before any rig fix   11 clips  60x  36.0px
        after the elbow rule  7 clips  14x  31.4px
        after this fix        4 clips 4.1x  12.6px
  2 ELBOW ONE WAY went 7 -> 9 flips and looked like my regression. It is not.
    sideOf is the cross product against the SHOULDER-TO-HAND vector, the same
    one-pixel vector: it called the 31.4px jump CLEAN and the 3.2px repair A FLIP.
    Backwards. The guard was already half-written -- "a near-straight arm has no
    meaningful side" -- and a FOLDED arm has none either. The hand must sit >4px
    from the shoulder before its side counts. The guard skips 267 of 42,000
    arm-frames (0.64%, ceiling 2%) and that share is a claim of its own, so it can
    never swallow the measurement. Flips are back to the same 7 (cover-rise 3,
    cover-drop 3, bat-arc 1) the 9/11 record already named as real sweeps.

GATES: JOINT SNAP 6/0 (new absolute ceiling: no joint crosses 15px in one frame
while its limb stands still, against 36 before; 4 mutations caught including the
blend threshold zeroed, which reproduces the pre-fix numbers exactly and is the
proof the blend is what did it). ELBOW ONE WAY 10/0. NEAR HAND 6/0.
Record: records/BOHEMIA_A_ONE_PIXEL_VECTOR_HAS_NO_DIRECTION_9_13_26.md

PRE-PUSH PASS (rule 13): the 53 gates that draw a body. 44 green, 9 red. SIX are
the standing set, each verified red on a clean checkout this round: MOTION
VISIBLE, RIG CHECK, FIELD SURGERY, OUTFITS 13, CAST SHAPES, CITY CAST. TWO MORE
ARE FRESHNESS AND NOT MINE, both red on the alpha before my change: FACE THUMB
(the face bank is 25h behind the alpha; rebake with
tools/bohemia_face_candidates.js -- CHARACTER/COOK) and DRESS (317 banked against
318 canon, MISSING: TEAL WORK PANTS -- whoever added that garment). The ninth was
ELBOW ONE WAY, handled above.
FULL SUITE: no SUITE LINE on the front page yet; PLUMBER [suite line] owns it.

WHAT IS LEFT OF THE ROW. Four clips still snap and all small: crouch-aim-2h 4,
crouch-aim-1h 2, spear-drive 2, shiv-jab 1, worst 12.6px. Those are pose problems,
not rig problems. And the crouch-aims have a second one no joint fix can touch:
NEITHER OF THEM CROUCHES IN PROFILE. They stand. That is the clip content, and it
is the rest of [redo killed] along with the 37 that are clean and just need to go
back in front of him, and the two headshots which carry HIS OWN LOCKED SPEC
(laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md section 9, four
beats, verbatim) and get redone to that text regardless.
ALSO STILL OPEN, not draw order: on NE in his own frame
(records/target/PAOLO_THE_COAT_AND_THE_ELBOWS_9_7_26.jpg) the head sits up and to
the right of the shoulders with a visible gap. That is the pose too.

Nothing [PENDING Paolo].
ANIMATION (animation-lr9y9i): 9/14 LATEST -- *** HIS FOUR BEATS ARE FRACTIONS OF
THE FALL AND THE SIM READ THEM AS SECONDS. Beat four now lands. TAB: ANIMATION,
clip headshot. Build 9/14d. ***

ROW STILL CLAIMED: [redo killed]. Rounds: 1 re-analysed the 47; 2 fixed the rig
cause of the ten still broken; 3 put the answer in front of him (JUDGE ALL, ONES
YOU KILLED); 4 got his head back inside the frame; 5 is this.
RULE 14: alpha and workshop only; RUN cuts the demo.

HIS SPEC, section 9 of laws/BOHEMIA_ADDENDUM_ANIMATION_REBUILD_AND_ANATOMY_7_2_26.md,
verbatim: "4 beats: head snaps back on impact (0 to 0.08), torso/body gives FIRST
and knees fold (0.10 to 0.45), arms hold UP on inertia while the body drops (0.15
to 0.35), torso falls BACK ... arms come in slightly LAST (0.72 to 1)."

THE FIND. Those are FRACTIONS -- the fourth beat ends at 1, and nothing about a
ragdoll ends one second after it starts. The windows in hsStep were 0.08, 0.18,
0.22 and 0.24 SECONDS and the fall settles at 3.22s, so every beat ran over about
a fifth of its length and all of them were finished inside the first 7% of it. The
number 0.08 is in both, once as a fraction and once as seconds. THAT IS THE SECOND
UNIT BUG IN THIS FILE IN TWO ROUNDS -- last round it was four cameras still typed
for a 56-row canvas on a 112-row rig. Worth looking for a third.

ONLY THE ARMS-UP WINDOW IS CONVERTED, AND THE MEASUREMENT IS WHY. All four were
converted first and each beat measured with its own ruler, in his own windows:
    measured                    seconds(before)  arms-up only  all four
    B1 head travel vs waist      6.1 / 4.1        5.1 / 4.1     5.1 / 4.1
    B2 knee peak -> end          38 -> 1          38 -> 5       16 -> 17
    B3 hand lag behind the body  13%              17%           53%
    B4 hand closes to the chest  5.1 px           16.0 px       0.6 px
Damping the legs across a third of the fall drops the body 30px instead of 12
inside beat three, which is what lifts the lag to 53% -- and it lands the body
where the arms never come in, so HIS FOURTH BEAT DIES TO BUY HIS THIRD. Arms-up
alone improves three of four and worsens none. BEAT FOUR LANDS: 5.1 -> 16.0px.

BEAT ONE IS NOT BUILT AND THREE ATTEMPTS ARE WHY -- READ THIS BEFORE TRYING A
FOURTH. An impulse on headTop+neck (2.6), on headTop alone (5.0), and exempting the
head from the horizontal speed cap inside the snap window so a bigger kick could
survive: ALL THREE MEASURED 5.1px of head travel against the waist's 4.1, identical
to three figures AND identical to the build with no kick at all. Something
downstream pins the head's ANGLE. It is not the speed cap (removing the exemption
changed nothing) and not the impulse size (2.6 and 5.0 are the same number on
screen). Suspect the RIGID LIMB LAW chain in hsPose or a neck constraint in
hsStep's iteration. FIND THE PIN FIRST. A fourth kick is the STOP PRODUCING tell.

GATE: gates/his_four_beats_gate.js, in the suite as FOUR BEATS. Seven claims. It
READS HIS FOUR WINDOWS OUT OF THE LAW FILE rather than copying them, so the code
cannot drift from his text. CONTROL: the CRUMPLE keeps its own timings in seconds
(Paolo 7/17 ruled a head shot destroys motor control instantly and v2 is flaccid;
a change that swept every window into fractions would have taken that ruling with
it). And it PRINTS the three beats still not built on every run, so the clip is
never read as finished because a gate went green.
4 mutations caught, the fourth only after the code claim was tightened: it looked
for hsIn('armsUp') ANYWHERE, the elbow line still matched, and the elbow alone
still carries beat four so the data claim could not see it either. Both call sites
are named now.

PRE-PUSH PASS (rule 13a): the 56 gates that draw a body. 50 green, 6 red, and all
six are the standing set with the same numbers, each verified red on a clean
checkout in this lane's earlier rounds: RIG CHECK, FIELD SURGERY, FACE THUMB
(freshness, CHARACTER/COOK rebake with tools/bohemia_face_candidates.js), OUTFITS
13, CAST SHAPES, CITY CAST.
FULL SUITE: no SUITE LINE on the front page yet; PLUMBER [suite line] owns it.

WHAT IS LEFT OF THE ROW.
  1 beat one, above: find the pin.
  2 beats two and three: their windows are still in SECONDS with their real units
    named in the code. Moving them is not the job -- the table above shows moving
    windows just trades beats. The job is the MECHANISM: for the knees to fold the
    waist has to drop between planted feet, and for the arms to hold up the hands
    need to resist while the torso goes.
  3 clips whose keys are too far apart to read as motion (crouch-aim-2h NW is
    arm-down at k2 and arm-out at k3, nothing between). POSEHOLD key density.
  4 the pose defect on NE in his own frame: the head sits up and to the right of
    the shoulders with a visible gap.
  5 the 47 are repaired and visible in JUDGE ALL; the next verdict is HIS.

Nothing [PENDING Paolo].
ANIMATION (animation-lr9y9i): 9/6 LATEST -- *** THE HOSTILES WALK AT YOU NOW.
DIRECTION said they read as the crowd; measured, they were STILLER than the crowd,
and the moment they "came for you" was a teleport. TAB: RUN. Nothing to judge. ***

TAB: RUN. Build 9/6r - THEY WALK AT YOU.
Walk toward a crew that has a reason to want you. They step off their corner.

ROW SHIPPED: [walks at you] THE-APPROACH-IS-THE-TELL.

THE BRIEF: DIRECTION judged the shipped hostiles at phone size and all three
questions came back NO -- not dangerous, not Cartel, not at all: THEY ARE THE CROWD.
The research says the fix is free, because MOTION is a preattentive channel and
everybody else walks past while a hostile walks AT YOU.

*** MEASURED FIRST, AND WORSE THAN THE BRIEF ASSUMED. *** Walking a crew down from
ten cells:
    dist 8..4   watch   every body STILL, on its corner, facing you
    dist 3      close   four bodies TELEPORT to [-1,0][-1,1][1,0][0,1]
    dist 3,2,1,0        those offsets NEVER CHANGE again
No approach anywhere in it -- and one of those four appears on the FAR SIDE of you,
which nothing walked past to reach. Every one drawn with set.idle, A SINGLE STILL
FRAME. So since [crowd moves] shipped last round, the residents BREATHE and the
hostiles do not: THE MOST STATIC BODIES ON THE STREET WERE THE DANGEROUS ONES.

WHERE THE TELL GOES: streetFightOnStep posts the encounter on the SAME STEP the
state turns close, so there is no beat between closing and fighting for an approach
to live in. But WATCH runs from eight cells out to four -- five cells of walking
where the crew is on screen, looking at you, and not yet a fight.

SHIPPED: the bodies step off their corner toward you and WALK while they do it; the
lean grows as you close and GIVES GROUND BACK if you widen it, so walking toward
them or away both make motion along the line between you. Leash 1.5 cells,
deliberately shorter than closeAt (3), so a watching body can never stand on top of
you. Pace 0.34 cells a beat -- at the player's own 1.0 the whole lean was covered in
ONE beat and the walk cycle never played. A body first seen starts ON ITS CORNER.
Measured after: 8.0 -> 6.7 -> 5.4 -> 4.1 -> 2.8 -> 1.0, continuous, no jump. NO NEW ART:
the player bake already ships a four-frame walk per facing and this pass was drawing
idle in every state.

WHAT IT DOES NOT TOUCH: crew.at is still the crew, stateOf still measures from it,
so the fight triggers on exactly the beat it did before. This lane says what the
approach LOOKS like; where the crew IS stays RUN's. That is what the leash is for.

*** THE RULER THAT WAS SATISFIED BY THE PLAYER'S OWN LEGS. *** The gate's first
claim compared nearest-body-to-player at the start of the walk-in against the end.
That shrinks whether or not anybody approaches, BECAUSE THE PLAYER IS THE THING
WALKING -- mutated to leash 0, the exact old behaviour, and it still passed. The
honest measure is the GAP THEY OPEN ON THEIR OWN CORNER: how much nearer the player
they are than their corner is. Standing still that gap is zero at every distance.
Same shape as last round's gate, where TIME supplied the variety instead of the offset.

GATE: gates/the_approach_is_the_tell_gate.js, 9 claims, 3 MUTATIONS CAUGHT -- the
approach deleted, the approach done by TELEPORTING, and the approach drawn as a
STILL FRAME.

FILES
  slices/BOHEMIA_CITY_WORLD.html            hostilePass, __THE_APPROACH_IS_THE_TELL__
  gates/the_approach_is_the_tell_gate.js    9 claims, 3 mutations caught
  records/BOHEMIA_THE_APPROACH_IS_THE_TELL_9_6_26.md

*** BOUNCED TO RUN, NOT PATCHED FROM HERE (both are engine/bohemia_hostiles.js and
streetFightOnStep, which are RUN's) ***
1. THE RING IS A TELEPORT. At closeAt the four bodies are PLACED on cells adjacent
   to the player, including behind him, with no travel. This lane now walks them
   onto it, which hides the worst of it, but the placement is the engine's.
2. THE FIGHT FIRES ON THE SAME STEP THE STATE TURNS CLOSE, so nothing that happens
   in the closing beat can ever be seen. If a crew is meant to ARRIVE, the trigger
   wants a beat or two of daylight after the state flips.

*** WHAT COMES NEXT FOR THIS LANE ***
1. [enemy walks] A-HOSTILE-MOVES-LIKE-A-HOSTILE is the sibling row and is still
   OPEN: this round made the APPROACH read; that row is whether the WALK ITSELF
   reads hostile (pace, gait, the head). The clips are all measured already --
   THE-63-CLIP-AUDIT flagged 15 and swagger/stomp/sneak are the obvious raw
   material, reuse before cooking.
2. [clips redone] RECOOK-WHAT-HE-KILLS still waits on his thumbs in ANIMATION ->
   JUDGE ALL. Nothing recooks before that; his 8/25 order says so in those words.
3. [hurt shows] and [cloud turn] are both coordinator-decided and unblocked.
ANIMATION (animation-lr9y9i): 9/5 LATEST -- *** THE LIST HE COULD NEVER JUDGE FROM
NOW MOVES. Every one of the 105 animations plays on its own row, next to its own
thumbs, with what the audit measured about it. TAB: ANIMATION, the JUDGE ALL
button. His thumbs are the next thing and nothing recooks until he presses them. ***

TAB: ANIMATION. Build 9/5ad - THE LIST YOU CAN ACTUALLY JUDGE.
Open ANIMATION, tap JUDGE ALL, and every row is a little person doing that clip.

ROW SHIPPED: [your verdicts] SHOW-HIM-THE-LIST.

*** THE SURFACE ALREADY EXISTED AND HAD NEVER TAKEN A SINGLE VERDICT. *** JUDGE ALL
has been in the ANIMATION tab since 7/19. Opened this round it read "105 clips, 105
UNJUDGED" -- not some, ALL. So the job was never "build him a judging page"; one was
there. The job was finding out why it has never once been used.

BECAUSE EVERY ROW WAS A WORD AND TWO THUMBS. Measured: the judge list starts 1,464 PX
BELOW THE CANVAS. To judge `beckon` he tapped the word, scrolled up nearly two phone
screens to watch it, scrolled back down to press a thumb. A hundred and five times.
That is the BOTTOM-UP law exactly -- anything he has to scroll up for does not exist
-- and the empty verdict count is the proof that nobody can judge from memory.

SHIPPED: a live canvas per row playing that clip on the beat (G.t0 + BEAT_MS, the one
clock) at 72px, above the size the game draws it; the audit's finding on each row so
he judges informed ("moves 15%", "QUIET", "head-on only 12% of side-on", "STATIC
HOLD"); filters ALL / UNJUDGED / THE AUDIT FLAGGED (15); the .txt export untouched.
The notes are GENERATED from the audit raw file, never typed, so a number on his
screen always came from a measurement.

REUSE, NOT A NEW RENDERER: the loop is the CLOTHES tab's -- ~12fps not 60, viewport
culling, and RELEASING THE BACKING STORE well off screen (its 8/20 lesson: refusing
to render off-screen is not the same as letting go of the pixels; 258 garments held
96.8 MB until it did). Drawing is drawChar, HD_CACHE-backed.

THE FIRST LAYOUT WAS WRONG AND THE PICTURE IS WHAT SAID SO: letting the note wrap to
its own line made rows ~200px, FOUR clips a screen, 26 screens for the set. Every
number passed. Canvas left, everything else in a tight column: ~80px, ten a screen.

*** THREE RULERS BROKE ON THE WAY, ALL THREE INSIDE MY OWN GATE. *** Each would have
been a green gate lying:
  1. It asked for the CLIP_NOTE global and got ZERO -- the table is const inside the
     panel's closure. It was measuring SCOPE, and would have gone red with the notes
     rendering perfectly. Now it reads the notes off the rendered rows; the DOM is the
     surface, the table is an implementation detail.
  2. It grepped the raw file for the literal percentage and found 8 strays. They were
     not strays: 100.89 rounds to 101 and "101" is nowhere in a file storing 100.89.
     IT WAS TESTING MY ROUNDING, NOT THE DATA.
  3. Then it failed two HONEST notes on a half-cent: drunk is 82.50% and flee-scramble
     90.50%. The notes are generated in Python (%.0f rounds half to EVEN -> 82, 90);
     the gate re-rounded in JS (Math.round rounds half UP -> 83, 91). Two rounding
     modes met on an exact .5 and the gate called his screen a liar.

GATE: gates/judge_list_moves_gate.js, 10 claims, 3 MUTATIONS CAUGHT -- the canvas
removed, A STILL FRAME per row, and a fabricated number. The still-frame case is the
one that matters: it satisfies "has a picture" and "has a body" and is STILL a list
he cannot judge from.

FILES
  slices/BOHEMIA_ALPHA_0_9.html      the judge rows (in the p-anim panel's JUDGE ALL)
  gates/judge_list_moves_gate.js     10 claims, 3 mutations caught
  records/BOHEMIA_SHOW_HIM_THE_LIST_9_5_26.md

*** WHAT COMES NEXT FOR THIS LANE ***
1. HIS THUMBS. [clips redone] RECOOK-WHAT-HE-KILLS is the next OPEN row and it waits
   on what he presses. Do NOT recook before that: his 8/25 order says show him the
   list first, in those words, and now there is a list worth showing.
2. THE AUDIT FLAGGED 15 and that filter is the short path: jump (arms carry it, no
   crouch), whistle (a static hold), the quiet four (pray, eat, smoke, whistle), and
   the head-on amplitude question. pistol/two-hand are DESIGN, not defects -- the note
   on their row says "steady on purpose (aiming)" so he is not asked to kill a man
   holding a gun still.
3. THE 41 CANDIDATES have never been judged and several are combat verbs
   (crouch-aim-1h/2h, cover-fire, take-cover, shiv-jab, bat-arc, spear-drive). Worth
   asking whether COMBAT wants them before this lane spends a turn on them.


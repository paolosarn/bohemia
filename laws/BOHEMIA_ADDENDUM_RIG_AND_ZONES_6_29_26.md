# BOHEMIA — ADDENDUM: CHARACTER RIG, REGION MAP, LIGHTING & CONTENT PIPELINE
*6.29.26 — folds into the character-art canon. Read alongside BOHEMIA_ART_PHILOSOPHY.md*

## THE REGION MAP (foundation for clothing + animation + lighting)
Every directional sprite gets a per-pixel **region map** authored once. Zones:
HEAD, FACE, TORSO, ARM-L, ARM-R, LEGS, FEET, plus **RES-L / RES-R** (design reserve).
- Structural zones (head, face, torso, legs, feet) are **auto-derived** from the layer art
  (feet=shoe layer, legs=pants, face=face layer, head=skull blob, torso=body). Not hand-work.
- **Arm zones + reserve + pivots are Paolo's hand** — they encode intent, not geometry.
- Tool: `BOHEMIA_region_editor.html` (auto-seeds the full map; Paolo fixes arms, claims
  reserve, sets pivots, flags front/behind, SWING-tests, exports JSON).

## THE ARM RIG (locked principles)
- **Never invent arms.** The aim/animation rig LIFTS the real arm pixels from the sprite and
  pivots them about the shoulder. Nothing redrawn. (Correction from this session — drawing new
  stick-arms broke consistency.)
- **Reserve = "everything that rotates with the arm,"** not just the tight limb. Claimable empty
  space outboard of the arm for loose sleeves, fringe, spikes, straps, a flag off the elbow.
  Paint it now; clothing painted into it later animates for free.
- **The one rule:** don't claim pixels the torso body actually fills. The shoulder seam is the
  hinge; outboard of it is free, inboard rips a hole when the arm lifts.
- **Front/behind flag per arm per direction:** front-facing (S/SE/SW) arms draw in front;
  back-facing (N/NE/NW) draw behind so raising to aim tucks behind the back, never over the head;
  profile (E/W) near arm front, far arm behind.

## E/W ONE-ARM PROBLEM — BLADE THE STANCE (locked)
In profile you only see one side, so blade it like real life.
- **Pistol:** near arm only on the gun; far arm rests hidden behind the body.
- **Shotgun:** far hand comes forward across onto the forend (you see both hands on the gun out
  front); the far **upper arm tucks behind the torso and doesn't draw**. Reads as a true two-hand
  hold without cheating the angle.

## LIGHTING (sprites are already friendly — locked approach)
- Day/night + walking under a lamp = a **lighting LAYER over the scene**, not per-sprite. Night =
  multiply scene by a cool dark tint; a lamp = additive warm glow blob brightening whatever's
  inside its radius. Works on ALL custom art with zero extra per-sprite work.
- **Emissive mask (to add):** tag the bits that stay bright in the dark — cigarette ember,
  Amalgamation eye, neon, glowing screens. They ignore the night tint and glow. Cheap, cinematic.
- True per-pixel directional lighting (normal maps) is NOT the style (Stardew doesn't do it) and
  not needed.

## CONTENT PIPELINE (why this matters)
Once the region map exists per direction, clothing generation becomes targeted:
"make a battle jacket" = paint into TORSO + ARM-L/R + reserve, already aligned at all 8 facings,
instead of guessing and correcting for half a day. Every arm-covering clothing item is authored
**arm-aware** (torso part on torso, sleeve part inside the arm region, protrusions in reserve) so
it lines up clean AND animates. This is the unlock for cranking out lots of clothing without
hand-holding.

## POSES (pending, on the horizon)
- 4 more naked base poses still to build (sit / sleep / crouch / lean-on-wall). Lean-on-wall is
  where the real resting aim-arm lives.
- **Each pose gets its own region map** (different silhouette). The rig + zone system generalizes
  to all of them.
- All clothing made so far must be re-checked against each new pose.

## FILES
- `BOHEMIA_region_editor.html` — the region map editor (current tool)
- `BOHEMIA_arm_editor.html` — earlier arm-only editor (superseded by region editor)
- `bohemia_assets/tools/dead_eye_arms.py` — shoulder anchors + rig notes
- export key (window.storage): `region_map`

---

## THE DEAL (locked 6.29.26)
Zones are **anchors, not walls.** They tell me where a body part is so clothing lines up; they
never clip or cap a garment. A coat spans as many zones as it wants and busts past their edges
(New Rock boots climb from FEET straight up past the knee). **The only hard border in the entire
system is the ARM region** — physics, because clothing there tears when the arm moves. RESERVE is
**minimum guaranteed swing space, not a fence**; if art sticks out further, we grow it. So Paolo
only ever hand-marks the animation-critical pieces; every other zone I auto-seed as a loose anchor
and neither of us treats it as a border. Imagination stays wide open forever.

## CATEGORY DICTIONARY — what every category means to me, game-wide
(not just the dial: clothing cranking, poses, animation, lighting)

ANCHOR ZONES (auto-seeded, loose references):
- **HEAD** — skull. Anchors hats, hair, durag, helmets, face-paint top. Pose: a rigid unit I
  reposition whole. Lighting: top catch-light.
- **FACE** — front facial plane / eye-line. Anchors glasses, masks, visors, the micro-expression
  system, cigarette, blood streak, scars. Separate from HEAD so a mask maps to face, a hat to head.
- **NECK** — bridge head↔torso. Anchors collars, scarves, chains, gorgets, hood-down pooling, neck
  tattoos. Where most tops terminate; the hide-the-neck rule lives here; head pivots on it in
  look/turn poses.
- **TORSO** — chest/belly mass, the biggest clothing canvas: shirts, jackets, vests, armor,
  harnesses, front backpack straps. Stays rigid while arms move; the core block everything hangs off.
- **LEGS** — leg mass: pants, skirts, kilts, leg armor, holsters, knee-high boots climbing up.
  Bends at the knee for sit/crouch/kneel.
- **FEET** — foot/ankle. Shoes/boots anchor here and grow UP uncapped.

ARM RIG (hard border + skeleton, Paolo's hand):
- **ARM-L / ARM-R** — real arm pixels (upper+forearm). THE hard border: sleeves live here or tear.
  Rotates at shoulder, bends at elbow. Every arm-covering garment authored against this.
- **HAND-L / HAND-R** — the grip end. Locks to weapon grips; duplicated to the far grip for profile
  two-handers; takes gloves/rings; the contact point for anything held or carried.
- **RES-L / RES-R** — guaranteed swing space outboard of the arm. Room loose sleeves, fringe, spikes,
  straps occupy and still animate. Grown anytime.

JOINTS (the skeleton, Paolo's hand):
- **SHOULDER-L/R** — arm anchor, top of the two-bone chain (the pivot).
- **ELBOW-L/R** — the bend; turns stick-swing into real articulation; lets both hands reach a
  two-hander.
- **KNEE-L/R** — leg bend; boot/knee-pad alignment; hinge for sit/crouch/kneel poses.

FLAGS:
- **FRONT/BEHIND per arm per direction** — draw order vs the body. Back-facing and the profile far
  arm draw BEHIND; otherwise FRONT.

WHAT IT UNLOCKS:
- **Clothing cranking:** a garment = paint into the relevant anchors → aligned at all 8 facings on
  the first try, no half-day of corrections.
- **Poses:** the skeleton + zones transfer; a new pose = re-place joints + re-map zones, and
  clothing follows the skeleton instead of being redrawn.
- **Animation:** walk, aim, melee, reach, sit, all driven by the joints; arm garments ride the rig.
- **Lighting:** zones can later carry a height/normal hint; emissive tagged on face/accessories.

---

## ADDED 6.29.26 (second pass)

### The torso hole — UNDER-ARM underlayer (locked)
On any turned facing (E/W/SE/NW, slightly-turned S) the arm sits OVER the body, so cutting it
out to swing leaves a hole. Fix = **underlayer**: the torso is authored COMPLETE behind the arm
rest, so when the arm swings away a finished patch is already there. The **UNDER-L / UNDER-R**
zones mark where I author that hidden torso fill. Not a smear/bleed (mush at this res) and not
limiting the pose. In the editor the SWING preview patches the hole live with a sampled torso
color as a stand-in for the real authored underlayer.

### Face on the turn (locked)
FACE tapers S → SE → E, narrowing toward the ear. At full profile FACE is only the front slice
(brow-line to chin) and the **ear is the seam between FACE and HEAD**. That seam is why the two
are separate zones.

### Walk animation per facing (locked direction)
Same skeleton drives every facing; I author walk angles per direction, never 8 hand-drawn cycles.
- Profile (E/W): big visible fore/back arm sweep.
- Front/back (S/N): arms swing toward/away from camera, so on screen it reads as hands rising and
  dropping with the elbow rocking, a depth swing, not a sideways sweep. The elbow sells it.
- Legs run opposite-phase off the knees.

### Grid movement timing (locked)
Tap a direction = one walk cycle plays, carries one tile, settles to idle. Hold = the cycle loops
seamlessly tile after tile. Animation is decoupled from the logical step (step is instant, anim is
the smooth skin). Nobody moves until the player does, so every NPC's walk is driven by the
player's steps; the whole world animates in lockstep and nothing animates while standing still.

### Crouch / sneak (locked as a pose)
Crouch is its own skeleton pose (lower shoulders, deep knee bend, dropped head) with its own region
map and its own crouch-walk cycle off the same joints. "Looking cool crouched" is silhouette +
arm carry, free once the pose exists.

### Female & child models (locked approach)
They INHERIT this skeleton. Same joint logic, positions nudged to the new silhouette (narrower
shoulders, different torso, smaller proportions); zones re-seed against their layers; all clothing
inherits because it's authored against the skeleton. Solve "what is an arm" once on the male; the
others tweak, not re-solve.

---

## OVER-L / OVER-R — the mirror of UNDER (locked, added 6.29.26)

UNDER and OVER are a pair. They handle the two things that happen at the seam where the arm
meets the body when the arm swings.

- **UNDER-L/R** = the TORSO that hides *behind* the arm. Authored complete; revealed (hole-filled)
  when the arm swings off the body. Same torso layer, flagged sub-area.
- **OVER-L/R** = body-anchored detail that rides *on top of* the arm at rest and must STAY PINNED
  when the arm swings away, then get redrawn over the arm. It does NOT swing with the arm.

The canonical OVER case for Babypunk: **the black braid down his right side.** It overlaps the
right shoulder/arm but is attached to the head, so when the right arm swings it stays put. Marked
OVER-R. Other OVER cases: chest straps, a slung weapon strap, a scarf tail, a necklace cord, any
pinned accessory that crosses the arm.

Editor: OVER-L/OVER-R are stacking overlay planes (same system as RES/UNDER), they sit ON TOP of
the base without erasing it. In SWING and the aim animations the OVER region is drawn pinned at its
rest position on top of everything, so you can watch the braid hold still while the arm swings under
and past it. Empty by default; Paolo marks them per facing where a pinned detail crosses an arm.

## Far-arm derivation across SE → E → NE (locked clarification)

The far arm is NEVER hand-mapped as a moving part. You map the near arm and set the FRONT/BEHIND
flag; the rig derives the far arm:

- **Diagonals (SE, NE):** the far arm visible in the sprite can be marked and flipped BEHIND. When
  it moves, it is NOT redrawn as a detailed sleeve. It is a flat darkened SHADOW-CLONE of the near
  arm's shape (silhouette filled with a darkened tone sampled from the near arm). Already running in
  the PISTOL/SHOTGUN tester on SE and NE.
- **Profile (E):** the far arm is not in the sprite at all. Fully synthesized: upper arm tucked
  behind the torso and not drawn; for a two-hander the far hand swings forward onto the forend.

So far-arm work is a RIG job, not a MAPPING job. It is partly in now (shadow-clone) and gets fully
locked when per-facing combat aim poses are built. Paolo never waits on it to finish mapping a
facing.

## Auto-mapped facings (6.29.26) — SE / E / NE / N

South stays Paolo's hand-locked map. SE/E/NE/N were auto-mapped from the real sprite silhouettes
using South's rules (head shell + face inside, arm columns as the hard border, reserve outboard,
under inboard, hip at torso-meets-legs). Face tracks the turn: full on S, right-biased on SE, front
strip on E, gone on NE/N. E uses the blade stance (near arm only, torso behind, far arm synthesized).
These are a starting attempt for Paolo to refine in the editor, NOT locked. Confidence: N/NE/SE high,
E profile most likely to need his eye on the torso-vs-near-arm split.

---

## ALL FIVE FACINGS LOCKED (6.29.26) — Paolo hand-mapped

Update: SE/E/NE/N are no longer auto-attempts. Paolo hand-mapped and LOCKED all five facings
(S, SE, E, NE, N) himself. Canon lives in BOHEMIA_region_map.json and is baked as the editor seed.

Convention he set, now locked: **ARM-L / ARM-R are CHARACTER-relative, not screen-relative.** The
character's left arm is ARM-L (it appears on screen-RIGHT when the character faces S toward the
viewer). Same for HAND-L/R, RES-L/R, UNDER-L/R, shoulderL/R, elbowL/R, kneeL/R. This holds across
every facing.

Locked facing data (cells: base / overlay): S 640/156 both-front · SE 600/146 both-front ·
E 363/67 L-behind R-front (profile blade) · NE 600/127 both-front · N 640/160 both-front. Hips:
S/N [12,28], SE [12,28], E [10,28], NE [13,28]. W/SW/NW mirror E/SE/NE at runtime.

Next: mirror to the west side, then female/child inheritance, then far-arm combat poses.

---

## FULL 8-DIRECTION TURNAROUND COMPLETE (6.29.26)

W / SW / NW are now baked as horizontal mirrors of E / SE / NE: geometry x -> 23-x, with all
character-relative L/R designations swapped (ARM-L<->ARM-R, HAND, RES, UNDER, OVER, shoulder, elbow,
knee, front flag), and a flipped copy of each clothing layer image. They live in the canon
BOHEMIA_region_map.json (8 dirs total) and as editor tabs.

W front = {L:true, R:false} (near arm is the character's left, the mirror of E). SW/NW both-front.
Aim angles filled for all 8 (W=pi, SW=3pi/4, NW=-3pi/4). The editor now has all eight direction
tabs and composes W/SW/NW from the mirrored sprites. This delivers the full 8-direction naked-body
turnaround (the permanent base skeleton for all human bodies) that was the long-open task.

Note: W/SW/NW are derived mirrors, so if Paolo edits E/SE/NE he can re-mirror to keep them in sync.

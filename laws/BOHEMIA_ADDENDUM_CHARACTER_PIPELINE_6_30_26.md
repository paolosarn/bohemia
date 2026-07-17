# BOHEMIA — ADDENDUM: CHARACTER PIPELINE (BOHEMIAN RIG)
*6.30.26 — the paint-and-skin character system. Supersedes the two-part rig approach in BOHEMIA_ADDENDUM_RIG_AND_ZONES_6_29_26.md for everything about how bodies are authored and animated. The lore/zone dictionary in that older doc still informs clothing intent; the mechanics below replace its rig internals.*

---

## WHY THIS DOC EXISTS

This captures days of hard-won work that kept getting lost to context compaction. It is written down so it is permanent. **The file is the memory.** If a chat dies, this doc plus BOHEMIAN_RIG.html is the whole character system, recoverable cold.

The short story of how we got here: the old system stored one body part per pixel. When two limbs overlapped (a hand resting on a leg, an arm crossing the torso in profile), one got destroyed on save. That single flaw caused every "it reverted," every hole in animation, every heartbreak. The cure was to rebuild on the technique real studios use, and the result is BOHEMIAN_RIG.

---

## THE CORE MODEL — SKELETAL / CUTOUT ANIMATION WITH RIGID SKINNING

Every part of the character is authored once in a rest pose, bound to a bone, and moved by posing the bones. This is standard **cutout / skeletal animation** (the Spine / DragonBones model), and it is the correct, industry-proven foundation.

Three things make up the character, identical structure in all 8 directions:

1. **Painted limb pixels** (the art, on a 56×56 canvas).
2. **A skeleton** of joints and bones.
3. **A bind** connecting every painted pixel to exactly one bone.

Animation moves the bones; the bound pixels follow. An animation is written once and plays in every direction and on every body and every outfit automatically, because it only touches bones, never pixels.

### Rigid skinning (one bone per pixel) — locked choice

Each painted pixel is owned by exactly one bone. Not weighted, not blended across bones. This is deliberate: smooth/weighted skinning causes the "candy-wrapper" pinch and blur that destroys pixel art. Rigid one-bone-per-pixel keeps every pixel crisp. **The part color you paint with IS the bone assignment.** Paint with ARM-L and those pixels belong to the left-arm bones. No separate rigging step, the palette does it.

---

## THE CANVAS & THE 12 PARTS

**Canvas: 56×56, square.** Chosen over the old 24-wide so limbs have room to spread and never fight for pixels. Square so Paolo can judge a pixel game on a true grid, not a slant.

The 12 parts (each its own color chip, each binds to its bone group):

`HEAD · FACE · NECK · TORSO · ARM-L · ARM-R · HAND-L · HAND-R · LEG-L · LEG-R · FOOT-L · FOOT-R`

L/R are **character-relative**, not screen-relative (locked convention, carried from the old rig). The character's left arm is ARM-L even though it appears on screen-right when facing south.

---

## THE SKELETON (verbatim from the build)

Joints:
`headTop · neck · waC · waA · waB · shL · shR · elL · elR · handL · handR · knA · knB · footA · footB`

Bones (each bone = two joints; the pixels bound to it rotate about the parent joint):
- **head**: neck → headTop
- **torso**: waC → neck
- **left arm**: shL → elL (upper), elL → handL (fore)
- **right arm**: shR → elR (upper), elR → handR (fore)
- **left leg**: waA → knA (thigh), knA → footA (shin)
- **right leg**: waB → knB (thigh), knB → footB (shin)

### The 3-point waist (locked, Paolo's spec)

The waist is NOT a single pivot. It is a **bar of three points**: `waC` (center, where the spine/torso drops in), `waA` (left hip end), `waB` (right hip end). The spine runs neck→waC. **Each leg hangs from its own end of the bar** (left thigh from waA, right thigh from waB), the way real hips work, not both legs from one shared center point. All three points move independently, per direction.

This is also the **E/W profile solution**: in a side view the pelvis is seen edge-on, so the three waist points default compact and Paolo arranges the near-hip and far-hip himself per profile. Editable per direction is the fix, not a formula.

---

## THE TWO BREAKTHROUGHS THAT KILLED THE OLD BUGS

### 1. LAYERS — overlap is lossless (killed the "it reverted" bug)

Every part paints to its **own layer**, per direction. A single coordinate can hold ARM **and** LEG **and** TORSO at the same time. Painting the leg behind an arm never wipes the arm. Verified in build: 20 overlapping pixels that a one-per-cell system would have destroyed all survived, and posing the arm away revealed the full solid leg underneath.

This is the permanent cure for the hole-covering workflow Paolo needs: pose a limb out of the way, paint the body underneath it, both are real and both persist. It is also why profiles (E/W) with heavy limb overlap are now safe: the near part draws on top, the far part stays fully intact underneath. Overlap is a **draw-order** question now, never a data-loss event.

### 2. INVERSE SAMPLING — no holes when limbs move (killed the gaps/holes bug)

Old rendering did forward mapping: throw each rest pixel to its new posed spot. Rotating a limb spread those thrown pixels apart, and the gaps were the holes. The fix flips the direction. For **every screen pixel** of a posed limb, map backward into the rest art (`screenToRest`: find the nearest bone, project the screen point back into rest space along that bone, read the color that lands there). Every output pixel gets filled, so limbs stay solid at any angle. Same math a GPU uses to sample a texture. Verified solid at a hard 70° swing with zero gaps.

At rest the map is identity, so the rest pose is pixel-perfect to what Paolo painted. Inverse sampling only kicks in when posed or animating.

**Remaining known artifact (cosmetic, not a hole):** at extreme joint angles a 1px seam can show right where two bones meet (elbow/knee). Different problem from holes; fixable later with edge-bleed. Does not touch or reshape the painted regions.

---

## THE SACROSANCT RULE (locked, hard, permanent)

**Claude never touches, normalizes, auto-reshapes, meshes, or "fixes" body-part geometry. Ever.** The painted regions Paolo exports are baked VERBATIM, exactly as pasted, all parts all 8 directions. No rectangle rule, no bounding-box fill, no auto-mirroring of shapes, no auto-anything on the mesh.

This rule exists because an auto-normalizer silently bulldozed hand-painted legs on every load, for multiple sessions, and cost real sleep. It was removed. It never comes back. Re-fitting clothing to Paolo's regions is fine (that only READS the shapes). Reshaping regions is forbidden.

Corollary: animations rotate regions as **rigid groups** about the joints. They never deform or reshape the painted cells. The regions stay verbatim even in motion.

---

## THE TOOL — BOHEMIAN_RIG.html (current build: rev9)

Two modes, switched top-left:

- **PAINT:** the 12 part chips (color-coded, scroll sideways). Pick a part, then Brush / Erase / Fill, size 1·2·3, Undo, Clear. Drag to draw continuous strokes. Paint binds to bone by the part color.
- **POSE (Edit Skeleton):** tap a joint (it reports GRABBED + live coordinates so you know it registered), then move it by drag OR by the on-screen arrow buttons (arrows exist because raw drag was unreliable on iOS; arrows write the same joint state and cannot be eaten by touch quirks). Reset dir snaps a direction's joints back to authored values.

Cross-mode: **a pose set in Pose mode carries over into Paint mode**, so you can pose an arm away and paint the exposed area under it. (Deliberately kept as two modes so you never grab a joint by accident mid-stroke. Paint-and-pose on one finger is available to wire if wanted, not built.)

Speed features:
- **Fill from reference:** the old body sits under the canvas faded at ~30% as a tracing guide (toggle with Reference). Fill can flood a reference region into the current color, so the body blocks in fast.
- **Mirror:** paint ARM-L and it auto-places ARM-R on the other side with the correct part code (part-swapped, not a dumb duplicate).

Build stamp: a green **rev** tag sits bottom-left. It is the insurance against stale cached copies (the exact failure that caused "your change didn't work" during the leg saga). If the corner rev doesn't match the latest shipped rev, the device loaded an old cached file and nothing will save right. Rev matches = you're on the real build.

### Export / round-trip (the contract with the game)

EXPORT writes JSON containing, for all 8 directions: the **per-part layers** (every part preserved, overlap intact), a **flattened base** for the game to consume, and the **full skeleton** (all joints including the 3-point waist). Paste it back, it bakes verbatim. This is the round-trip that makes the tool trustworthy: what you paint is what saves, what saves is what the game reads. Test export already confirmed clean round-trip.

---

## HOW THIS FEEDS THE GAME (the "eats and feeds" contract Paolo insisted on)

BOHEMIAN_RIG is not a separate toy. It emits, and reads back, the exact region+joint+draw-order format the game engine consumes. Nothing the rig produces is a format the game can't digest; nothing the game saves gets reshaped on the way back in. The procedural bodies used during development were only a way to generate that same structure for testing; the real master is Paolo's hand-painted art dropped into the same slots.

Chain of custody: **paint in BOHEMIAN_RIG → export → bake verbatim → the game's render layer rasterizes the bound pixels between posed joints each frame.** The character system is a citizen of the engine's render layer (see the engine architecture addendum): the sim moves joints, the renderer draws pixels, they never touch each other's data.

---

## ANIMATIONS RIDE THE SKELETON (work is not lost, it transfers)

Every animation built so far and every one built later is a pose recipe over these bones. The omnidirectional run work already proved the four laws that all future gaits inherit:

- **Contralateral swing** (opposite arm to opposite leg) — a walking-creature law, free for every gait.
- **Draw-order / near-far layering per direction** — the engine knows which limb is camera-near and draws it on top; saved as data, so no re-solving per clip.
- **The mirror law** — W/SW/NW are exact mirrors of E/SE/NE (geometry, joints, draw order, and art), so a clip authored on the 5 painted facings plays all 8, forward, never moonwalking. 5 facings of effort, not 8.
- **The flat-rig depth cheat** — head-on (N/S) can't show a real stride, so depth is faked: feet-anchored vertical squash/stretch, subtle, leg-driven, with walk and run tuned separately (run bounce ~2.26× walk). No sideways sway on N/S. This trick is in the pocket for anything moving toward/away from camera.

Because animations only move bones, **rebinding a new body or a new outfit does not require redoing any animation.** This is the whole payoff of the pipeline.

### Pixel-art rotation safety (locked)

Pixel art can't hold its shape under naive rotation (jaggies, dropped/added pixels). The proven fix, already Paolo's practice: scale the sprite up (scale2x HD) before transforming, and never zoom the camera into a body part. Inverse sampling further protects it by filling every output pixel. These rules stay.

---

## BODIES: MALE / FEMALE / CHILD (approach locked)

- **Male** is the master, Paolo's hand-painted art, being painted now.
- **Female** inherits the same skeleton and pipeline. A parametric **bust-and-hip line** (a silhouette rule every woman body follows) rides the same bones; set once, applies across all 8 directions and every animation. Built as tunable sliders in the earlier procedural pass; the real female body gets painted against the female skeleton the same honest way the male is.
- **Child** inherits too: same joint logic, shorter proportions, bigger head.

"What is an arm" is solved once on the male. The others nudge joint positions and repaint to their silhouette; they never re-solve the system. All clothing inherits automatically because it binds to the skeleton, not to a specific body.

---

## CLOTHING (next stage, foundation now ready)

Clothing is the same model one layer up: garments are swappable sets of part-images bound to the same bones (Spine calls these "skins"). Paint a jacket once against the parts, it rides every direction and every animation with no re-tailoring. The under-arm fill (torso authored complete behind the arm rest) means no holes when arms swing over clothed torso. Paolo's canon, locked in this chat: **the per-limb mask framework and the exact painted pixel data are the shared foundation for BOTH the skeleton AND all clothing.** One source of truth, not a separate confusing clothing system. This is why the painting stage matters, it's the substrate everything else binds to.

The FACE stays its own system (parametric face engine + micro-expressions + portrait mode), NOT the garment-sheet model, because facial identity lives in 1-2px relationships that a paint-sheet can't hold cleanly. Two systems on purpose: body/clothing = regions + bound texture; face = parametric spec. The only shared wire is the collar slice (the bit of garment at the shoulders that shows in the portrait).

---

## ROADMAP FROM HERE (Paolo's stated order)

1. **Paint the master male body** (in progress).
2. Convert existing animations onto the painted skinned skeleton.
3. Front-page animation hub (bring back the animation playback UI, cleaner, so all clips are reviewable in one place — the good parts of the old anim module, tighter buttons, no weird camera box).
4. Mesh with the character customization module.
5. Female + child bodies (female bust/hip line).
6. Clothing skins on the bones (the mass-production payoff).

---

## FILES

- `BOHEMIAN_RIG.html` — the paint+skin character tool (current, rev9). THE character authoring tool. Everything else about bodies is superseded by this.
- Superseded: the two-part `BOHEMIA_region_editor.html` rig internals and the anim module as separate tools (their lore/zone intent still informs clothing; their rig mechanics are replaced).
- Export payload: per-direction layers + flattened base + full skeleton JSON. Bakes verbatim.

---

*BOHEMIA — Character Pipeline (BOHEMIAN RIG) — 6.30.26*
*Rigid skinning, layered lossless overlap, inverse sampling, 3-point waist, sacrosanct geometry. The system that ended the animation hellhole.*

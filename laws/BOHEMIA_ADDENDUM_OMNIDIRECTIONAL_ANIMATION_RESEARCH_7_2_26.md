# BOHEMIA — ADDENDUM: OMNIDIRECTIONAL ANIMATION RESEARCH (how 2D games fake 3D across 8 directions)
### By Paolo Alexandre Sarnataro (Babypunk / Punk4Prez)
### Living document — updated every working session. The file IS the memory.
### 7.2.26 — deep research pass. Question: who else is doing 8-direction animated characters in a 2D world that sells as 3D, how do they do it, what does each approach cost, and what does it teach Bohemia. Sourced claims are marked with the source. Where a claim is from general industry knowledge rather than a document pulled today, it is stated plainly and kept conservative.

---

## THE FIVE WAYS ANYONE HAS EVER DONE THIS

Every 2D game that sells omnidirectional depth uses one of five approaches, or a hybrid. Ordered by when the industry invented them:

### 1. HAND-DRAW EVERY DIRECTION (the brute force)
Draw every frame of every clip for every facing by hand.

**Who:** Hyper Light Drifter (8-dir hand pixel), CrossCode, Children of Morta, Eastward, the entire 16-bit lineage. Stardew itself is the cheap end: 4 directions only, side view mirrored, tiny frame counts, which is exactly why Stardew characters read flat next to what Bohemia is attempting.

**The cost curve, and it is brutal:** cost = directions x clips x frames x characters x outfits. Enter the Gungeon's Marine has over 500 sprites per costume for ONE character (source: sprite archive documentation), and Gungeon only hand-draws a handful of body facings. Full 8-direction hand animation at Bohemia's clip count (19 clips) with outfit variety is multiple artist-years. This approach is for teams with animators on payroll. It is the one approach that is flatly impossible for a solo creative director, which Paolo already knew in his bones when he built the rig instead.

### 2. MIRROR AND CHEAT DOWN THE DIRECTION COUNT
Author E, mirror for W. Author 5 facings, get 8. Put asymmetric details (logos, holsters) on a separate layer or eat the flip.

**Who:** essentially everyone, layered under every other approach. Factorio explicitly ships mirrored sprites where geometry allows (source: Factorio forums on rotation handling). Gungeon flips side views and accepts the gun swapping hands.

**Bohemia status:** already law. W/SW/NW are mirror-negated E-family, locked in the motion laws, and today's ELBOW MIRROR fix was exactly this law being enforced in the run clip. The mirrored-logo garment question in the open forks is the known cost of this approach, every mirror game pays it.

### 3. PRE-RENDER 3D TO SPRITES AT BUILD TIME (the industrial approach)
Model and animate in 3D once, render out N directions x M frames as sprite sheets, ship the sheets.

**Who, verified today:** Factorio: "almost everything in Factorio comes from 3D models created in Blender," rendered through an automated Blender + After Effects pipeline into sprite atlases (source: FFF-146, FFF-194). Historic lineage from general knowledge, stated conservatively: Diablo II, StarCraft, Age of Empires, Commandos all shipped pre-rendered 3D as directional 2D sprites; Diablo II's armor-visible-on-character system famously multiplied its sprite counts across 8+ directions per animation per gear look.

**The costs, from Factorio's own mouth:** ~2.4 GB of VRAM for sprites alone at high res, atlas management, mipmaps to stop zoom-out framerate collapse, and they declined directional corpse sprites for a boss because directional variants were "technically difficult and expensive on VRAM" (source: FFF-227, FFF-442). Pre-rendering buys perfect runtime cheapness and pays in storage and inflexibility: a new outfit or a new pose means re-rendering and reshipping sheets.

**Runtime variant:** Total Annihilation kept actual 3D models and rendered them to sprites on the fly (source: Factorio forum discussion). Project Zomboid does the modern version, 3D characters composited into a 2D isometric world. This is "2D world trying to be 3D" solved by giving up on 2D characters entirely.

### 4. 3D-TO-PIXEL AT BUILD TIME, PIXEL-ART OUTPUT (the Dead Cells pipeline)
Same as 3, but the render target IS pixel art: low-res, cel-shaded, no anti-aliasing, so it reads as hand-pixeled while being 3D-authored.

**Who, verified today:** Dead Cells. One artist for the entire first year. Basic 3DS Max models + skeletons ("would make the eyes of any credible 3D artist bleed" per the artist, and it does not matter at 50px tall), rendered through a homebrew tool with cel shading, no AA, 30fps animation output. The killer advantage the artist names: RETUNABILITY. When a designer wants a weapon to feel heavier, dozens of animation timings change in minutes instead of redrawing frames (source: Gamasutra deep dive by Thomas Vasseur; 80.lv interview).

**The confession that matters most to Bohemia:** they never solved "the problem of flickering pixels," stray junk pixels in the low-res output frames (source: same deep dive). The single most successful pixel-art pipeline of the modern era shipped with the exact defect Paolo pointed at this morning. Bohemia's bind coherence + per-pixel-guarded seam cleanup + interior hole fill IS the solve for that class of artifact, built and tested today. Dead Cells lived with it; Bohemia does not have to.

### 5. RUNTIME SKELETAL DEFORMATION OF 2D ART (puppet/cutout, and Bohemia's rare cousin)
Keep one set of art, deform it live along bones every frame.

**Who:** the smooth-vector version is everywhere (Spine, Live2D, puppet rigs, Cult of the Lamb style), and it never looks like pixel art because subpixel interpolation destroys the pixel grid. Segmented-parts pixel games (Nuclear Throne lineage) bolt whole sprite pieces to positions without deforming them, cheap but stiff. Rain World does full procedural creature animation and is universally cited as one of a kind.

**Where Bohemia actually sits:** runtime bone deformation IN PIXEL SPACE of hand-painted regions, with the width law (crunch along the bone only, width never scales), pixel snap, per-direction candidate bones, and now the cleanup laws. Doing skeletal deformation while preserving a legible pixel grid is the rare thing: it is why the smooth-puppet crowd cannot look like Stardew, and why the hand-drawn crowd cannot afford 8 directions solo. Bohemia's rig is genuinely in thin company here. The closest published philosophy is Dead Cells (author once, animate by system, retune in minutes) but executed live in 2D pixel space instead of baked from 3D.

## WHAT EACH TEACHES BOHEMIA, CONCRETELY

1. **The Gungeon lesson, separate weapon layer:** Gungeon's body has few facings; the GUN is its own freely-rotating layer with the hands attached to it, which is what makes 360-degree aiming read on a sprite that only faces a few ways. Bohemia's dial combat aims at all angles; the weapon (and the Dead Eye presentation) as its own layered element over the 8-facing body is the proven pattern. The rig already layers hands nearer than arms by law, the weapon layer slots the same way. [PENDING, Paolo's call: weapon as separate rotating layer vs baked into clips per facing]

2. **The Factorio lesson, bake what you replay:** their entire performance model is "author flexibly, ship baked sheets, manage the atlas." Bohemia's FrameCache built today is exactly this pattern applied at runtime: the rig deforms once per (dir, clip, bucket, look), the cache replays. The natural next step the research supports: PRE-BAKE the common clips (idle, walk, run x 8 dirs) into sheets at load or at build via the harness, so even first-lap cost disappears, while rare clips stay runtime. FrameCache was designed payload-agnostic for exactly this.

3. **The Dead Cells lesson, retunability is the whole point:** their one-artist miracle came from animation being DATA (3D curves) instead of pixels. Bohemia's clips are already data (pose functions on the heartbeat), which is why today's inward-arm and elbow-mirror changes took minutes, not redraws. This is the strongest validation in the research: the industry's best-known solo-artist pipeline chose systemic animation for the same reason the rig exists. And their unsolved flicker problem is solved in our stack.

4. **The Diablo II warning, outfit multiplication:** visible gear across 8 directions is what exploded their sprite counts. Bohemia dodges this structurally: garments are rest-space color layers deformed by the SAME bones at runtime, so a new jacket costs one painting, not 8 directions x 19 clips of frames. The wardrobe system is already on the right side of the industry's most famous cost explosion. Keep it that way: any future pipeline change that requires per-direction garment frames is a regression.

5. **The mirror tax:** every mirror game eats flipped asymmetries. The mirrored-logo garment fork already on the books is not a Bohemia flaw, it is the standard tax of approach 2, and the standard payments are: symmetric designs, a logo-on-separate-layer exemption, or authored W-side art for the few asymmetric pieces. [PENDING, Paolo's call, already filed]

6. **VRAM/memory is the pre-render tax Bohemia mostly avoids:** Factorio pays gigabytes for baked directions. Bohemia's live rig pays CPU per frame instead, and FrameCache converts that to a few hundred cached 56x56 frames, kilobytes not gigabytes. On iPhone this is the right side of the trade. If pre-baked sheets ever ship (lesson 2), budget them like Factorio budgets atlases: bake only what is hot.

## THE ONE-LINE ANSWER TO THE RESEARCH QUESTION

Nobody in the published record is doing exactly what Bohemia does: live skeletal deformation of hand-painted pixel regions across 8 directions with width-law pixel integrity on a phone. The industry splits into hand-drawers who cannot afford 8 directions solo, pre-renderers who pay in gigabytes and reship for every change, and puppet riggers who lose the pixel grid. The closest published relative (Dead Cells) validates the philosophy, authored-once systemic animation, and shipped with the stray-pixel defect Bohemia fixed this morning. The proven patterns worth stealing are Gungeon's separate weapon layer and Factorio's bake-the-hot-path, both of which the current architecture already has the hooks for.

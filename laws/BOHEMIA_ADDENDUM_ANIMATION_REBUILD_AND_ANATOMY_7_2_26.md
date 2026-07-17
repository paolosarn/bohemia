# BOHEMIA ADDENDUM: ANIMATION REBUILD + ANATOMY LAWS
Date: 7/2/26. Status: LOCKED by Paolo unless marked pending. Ships in ALPHA 0.6.

## 1. RIG v2 IS CANON
Paolo's updated rig export (jaw fix, E/W face repaint) pasted in chat, written to disk verbatim as `_baked_v2.json`, promoted to `_baked.json`, baked into engine RigData and Alpha 0.6. v1 backed up as `_baked_v1_backup.json`. The rig download button failed for Paolo; paste worked. NOTE: the export's redundant flat `base` grids were not re-stored (the `layers` regions are the canon pixels and are verbatim); everything that renders reads `layers`.

## 2. CONTRALATERAL LAW (locked)
Walking or running, the arm and leg on the same screen side ALWAYS swing opposite. Bug was legs being screen-side remapped in applyPose while arms stayed body-side, syncing right arm with right leg on E/W. Fixed by flipping arm phase in walk and run. Verified E and W: hand and foot horizontal motion oppose.

## 3. ANATOMY LAW (locked)
Naked body: ONE skin tone head to toe (head no longer lighter), far LIMBS one ramp step darker for depth (head/torso/neck never depth-shaded), and every limb border visible: any skin pixel meeting a different part darkens one step. Verified: face interior and torso interior share the exact base tone; 3 distinct skin shades on the naked E walk.

## 4. PIXEL SNAP LAW (locked)
The posed skeleton snaps to integer pixels before skinning. Kills the E/W shimmer/tweaking from float joint positions flipping cells frame to frame.

## 5. SWING LAW (locked)
The swing amplitude slider now drives every clip's amplitude (0.5 = 1x neutral, 0 to 1 = 0.1x to 2x). Wired through idle, walk, run, and the N/S crunch gait.

## 6. HAIR COVER LAW (locked)
Facing N, NE, or NW, equipped hair covers the entire head part. No more bald back-of-head.

## 7. JACKET OPEN FRONT LAW (locked, production rule)
Jackets are drawn with NOTHING in the middle front so the shirt underneath shows. Applies to all garment production going forward. Paolo's existing painted jackets are canon as-is.

## 8. ALL CLIPS REBUILT ON THE NEW RIG (first pass, Paolo tunes by eye)
Full clip list live in ANIMATION: idle, walk, run, pistol, two-hand, deadeye, melee, reload, hurt, crouch, kneel, lean, lean-x, lean-p, lean-2h, sleep, headshot, ragdoll, death. All parametric on the v2 pose base, all retarget through the same applyPose, all obey the laws (contralateral, N/S crunch, arm pivot at shoulder, pixel snap, 120 BPM beats). These are inspired by the old alpha set but rebuilt for this rig and universe.

## 9. HEADSHOT CLIP (locked physicality, Paolo's spec verbatim)
4 beats: head snaps back on impact (0 to 0.08), torso/body gives FIRST and knees fold (0.10 to 0.45), arms hold UP on inertia while the body drops (0.15 to 0.35), torso falls BACK with a hard resistance clamp so it NEVER folds into the waist (spine clamped at -0.55), arms come in slightly LAST (0.72 to 1). Verified distinct phases at t=0.1/0.5/0.95.

## 10. E/W FACE POSITION
Handled by Paolo's own v2 rig paint (face at the leading border, jaw fixed). His art, his fix, now canon everywhere via the one-package pipeline.

## 11. CODING FORESIGHT (research, filed before building)
1. Frame caching: at 120 BPM with pixel snap, each (dir, clip) has a small finite set of distinct frames. Caching ~8 to 16 frames per clip turns per-frame skinning into a lookup. THE iPhone perf move when combat integrates. [NEXT ENGINE PASS]
2. Determinism: no randomness in any clip; same phase in, same frame out. Keeps fold determinism laws intact and makes frames cacheable.
3. Clip phases normalized to beats so combat, scheduler, and heartbeat phase-lock for free.
4. Arm inertia stays keyframed, not physics-simulated: cheaper, deterministic, tunable. Real ragdoll physics only if a clip provably cannot sell it.
5. Rig persistence gap still open (localStorage eviction risk on iOS): app-side ownership of rig state is the fix, scheduled with combat-native integration.
6. Combat merge must namespace its globals before leaving the iframe.

## Open forks pending Paolo
- Headshot timing/amplitudes tune by eye
- Clip-by-clip review of the rebuilt set
- Gloves slot (coversHands exemption exists)
- Female/child rigs
- Mirrored-facing asymmetric garment art (logos flip on W/SW/NW)

## Files
`_baked.json` (v2 canon), `bohemia_engine.js` (RigData v2), `_build20.py` -> `BOHEMIA_ALPHA_0_6.html`, `alpha06_verify_strip.png`.

## 12. ANATOMY LAW v2 (supersedes section 3, LOCKED 7/2/26, ships in ALPHA 0.7)
Rejected: two-layer shading with dark edges everywhere. New rule, Paolo's exact spec:
- ONE base skin tone + ONE darker tone only. NO black shadows anywhere, ever.
- 1px contour in the darker tone per LIMB GROUP: each arm+hand is one group, each leg+foot is one group, torso is one group. The line runs from the shoulder down the outer arm, around the hand, back up the inner arm and ENDS in the armpit; from the feet up the outer leg, back down the inner leg, and along the torso edge to the armpit. Limb carries the border where limb meets torso (no double lines). Hand-arm and foot-leg junctions have NO line (same group).
- HEAD and FACE: never bordered, base tone only.
- NIPPLES: placed off the rig skeleton at shoulder-line +5px. Front views (S/SE/SW): two, at torso center plus/minus 3. Profiles (E/W): one, first torso pixel inside the facing chest edge. Back views (N/NE/NW): none.
Verified: exactly 2 tones on the naked body, zero black, zero head border pixels, 35/35 arm silhouette pixels dark, nipples S=2 E=1 W=1 N=0.

## 13. GARMENT TOUCH-UP EDITOR (ships in ALPHA 0.7)
A pencil EDIT button beside every slot row in CHARACTER. Opens a full-screen pixel editor for the equipped piece: paint with the piece's own ramp, erase, per direction, pointer/touch drag. SAVE applies live in-session (one package: the very next frame re-reads it). EXPORT dumps {garment, ramps, layers} JSON into a textarea for Paolo to copy and send to Claude, which is the durable save path. BODY's edit button routes to the RIG tab because body regions are sacred and only edited in the rig tool.
FORWARD FLAGS (filed, not blocking): (1) editor saves are session-only until exported or the piece is re-baked into the build, same iOS persistence gap as the rig, fixed together by app-owned state; (2) edited pixels are auto-lawful visually because the GARMENT CONTACT LAW clips at composite, but exported garments should be law-clipped at bake time too; (3) no undo yet, close-without-save is the undo.

## 14. WIDTH LAW (LOCKED 7/2/26, ships in ALPHA 0.8)
Limb compression crunches pixels together ALONG the bone only. Width perpendicular to the bone NEVER changes. Implemented at the transform level (anisotropic seg in the Skinner, engine + kit copies): along-bone axis scales with bone length, perpendicular axis never scales. Pure rotations are identical to before, so every clip is untouched. Verified: crouch leg width == idle leg width exactly; direct engine test, 40 percent compression, width 6==6 and 5==5.
KNOWN 1PX NOTE: at extreme compression (headshot mid-fall), one row can bulge 1px where two crunched rest rows meet. Fix candidate filed: per-bone row-consistent sampling. Not the skinny-limb bug Paolo flagged; that is dead.

## 15. SHOULDER + WAIST BLEND (LOCKED 7/2/26, ships in ALPHA 0.8)
The body is ONE piece, not a Lego set:
- WAIST: legs meeting the torso get NO border line, ever. Verified zero.
- SHOULDER: the top-inside pixels where the arm meets the torso (shoulder row +1) stay base tone so arm and torso are not two countries with a border. The inner border resumes below, down into the armpit. Verified zero border px in the blend zone.
- Legs still border EACH OTHER at the crotch (legs are separate), arms still border the torso below the blend zone (armpit line), silhouettes still contoured. Head/face still untouched.

## 16. SKIN DETAIL LAYER ARCHITECTURE (LOCKED as design 7/2/26, BUILD NEXT CHAT)
Paolo's ruling: the rig is the be-all end-all LAW OF THE LAND for geometry (regions, skeleton, pose). Everything else stacks ON TOP of it:
- LAYER 0: rig regions + skeleton (edited ONLY in the rig tool, sacred)
- LAYER 1: SKIN DETAIL overlay, a paintable layer in the skin ramp that holds nipples and any skin touches. My nipple algorithm seeds the defaults; Paolo's edits override, per direction. Edited in the touch-up editor via the BODY row (the "EDIT IN RIG" button becomes "EDIT SKIN", and a separate smaller "RIG" link keeps geometry access).
- LAYER 2: garments, as today, contact-law clipped.
So editing a nipple never touches the rig, and editing the rig never wipes skin details. Same export-to-Claude durable save as garments.
[BUILD NEXT CHAT: skin detail layer + seeded nipples + BODY editor rewire]

## 17. EDIT BUTTONS REAL + RIG WIDTH LAW (LOCKED 7/2/26, ships in ALPHA 0.9)
- FACIAL edit button now opens the real face editor (the ramp editor: skin tone, eye color, lip color, brow color) and scrolls to it. Works across all skintones because it IS the tone system.
- BODY edit button is now EDIT SKIN: opens the skin editor with (a) skin tone swatches that retint body + face live across every view, (b) the SKIN DETAIL layer brush (3 skin ramp steps + erase) painting directly on the live naked body per direction, nipples and any skin touch editable here, (c) EXPORT dumps {skinTone, skinDetail} JSON for Claude, the durable save. A separate RIG button still jumps to the rig for geometry. Sec 16 architecture delivered: rig = geometry law, skin detail paints on top, garments above.
- WIDTH LAW ported into BOHEMIAN_RIG.html itself: the rig's own pose preview no longer stretches pixels in weird ways when the skeleton moves, bones stretch/crunch along their axis only, width never scales, rotations unchanged. Bake: 2026-07-02-widthlaw. Regions untouched, transform code only.
FORESIGHT (filed): (1) skin detail is authored per skeleton pose, extreme clip deformation moves detail pixels with their bound part, correct but worth eyeballing on headshot; (2) SKIN_DETAIL export must fold into the next build's baked defaults, same as garment edits: send exports, Claude bakes; (3) once female/child rigs land, skin detail layers are per-rig; (4) frame caching still the next perf move before combat-native.

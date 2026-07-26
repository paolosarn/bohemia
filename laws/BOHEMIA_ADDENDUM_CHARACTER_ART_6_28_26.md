# BOHEMIA — ADDENDUM: CHARACTER CUSTOMIZATION, NPC SYSTEM & ART DIRECTION
**6.28.26 — Paolo / Babypunk.** Captured from a design conversation (dial work paused). Tags:
**[LOCKED INTENT]** Paolo wants it · **[OPEN]** unresolved · **[PARKED]** recorded, build later.
Extends GDD v2 §20–21 (visual identity / ghost layer); does not override.

---

## THE SPINE — PAPER-DOLL LAYERED SPRITES  [LOCKED INTENT]
Characters are **not drawn whole.** A naked **base body** is drawn first; every shirt, jacket,
hat, tattoo, etc. is a **separate transparent layer** snapped onto the body at fixed **anchor
points** and stacked at runtime. This one decision drives almost everything below.

**Customization and NPC generation are the SAME system.** Randomize the layer choices → a thousand
distinct strangers from the same parts. Player customization and crowd variety cost the same work.

---

## THE NAKED BASE BODY — built first, everything stacks on it  [FOUNDATION, built first pass]
The base is a **naked humanoid drawn FIRST**; every other layer snaps on top. **Skin is a parameter,
not art** — the base takes a skin palette (light / shadow / line / blush) so any tone is free with zero
redraw (proven across PALE/TAN/DEEP, `bohemia_base_skintones.png`). Generator: `tools/basebody.py`
in the asset pack (regenerates the base for any direction + pose + skin).
- **Correction:** the earlier Babypunk sprites were **composite look-tests** (clothes painted onto one
  sprite), NOT the layered system. They proved the look; they were never reusable layers. The real
  pipeline = this base + separate snap-on PNGs, which is what makes any item slap onto any NPC of the
  same bodyType by slot + anchor.
- **Draw order is law (fixes the leg-over-shirt artifact):** pants draw BEFORE shirt, so the **shirt
  hem always hangs over the pants waist.** The manifest order was already right; only the hand-painted
  mockup broke it. Every layer obeys `drawOrder`, never hand-stacking.
- **Head is BLANK [LOCKED].** No eyes/brows/nose/mouth baked into the base. Face is the separate
  `facial` layer. Silhouette cues only (ear/nose bump, occiput) live in the head's outline shape.
- First pass built + tightened: STAND across the 5 drawn directions, blank heads, real side depth
  (`bohemia_base_directions.png`). Pose range roughed: STAND / CROUCH / SIT / SLEEP-DEAD
  (`bohemia_pose_matrix.png`).
- **FIRST REAL LAYER PACK authored (Babypunk, 5 directions): 45 snap-on PNGs** in
  `characters/<slot>/` — body, pants (leather+legwarmer), shoes, shirt (cowl-hoodie, **full long
  sleeve over shoulders+arms** so no skin shows under the open jacket), jacket (hoodDown + hoodUp),
  hair (**platinum all over, jaw-length, no black crown** — earlier black top was a beanie mistake),
  hat (beanie, optional). Proven by exploded stack, dressed 5 dirs, hood A/B. Every layer drops onto
  any male-mid body. Generators in `tools/`. Combat arm = rough placeholder until mounted on the dial.
- **ASSEMBLER BUILT — `tools/compose.py`.** The manifest-driven runtime assembler: give it an outfit
  spec (`{skin, slots:{body,pants,shirt,jacket,...}}`) + a direction, it loads the right layer PNGs in
  `drawOrder` and stacks them into a finished character. Skin is remapped on the body at compose time
  (one body asset = any tone; clothing is skin-agnostic). hood-up suppresses hair+hat and its opening
  is transparent so the body's real skin shows. **Proven (`bohemia_compose_proof.png`): 3 different
  characters from the SAME files** (pale punk hood-down, deep NPC hood-up+beanie, tan civ no-jacket).
  Definitive answer to "real layers or JPEGs": real, and any layer shifts onto any male-mid character.

---

## WHAT THE PAPER-DOLL SOLVES (Paolo's questions, answered)
- **Blood & tears — AUTOMATED, not hand-made per character.** A tear is an **alpha hole** punched in
  the clothing layer; the body underneath shows through, so it matches **any skin color for free.**
  Blood = a red splatter **overlay** on top. No per-skin-tone variants of anything.
- **Bandage / wound at a health threshold — conditional layer.** Cross e.g. **50% HP** → a sling /
  arm-wrap **wound layer** switches on over the limb. Same mechanism as any other layer.
- **Fixed body heights [LOCKED — the key affordability decision].** All males one height, all
  females one height, **children a third**. One shirt then fits **every** male with zero refitting.
  This is what makes the whole paper-doll affordable. (Fat variant + facial features are their own
  base-body variants/layers — see slots.)

---

## POSE FAMILIES  [LOCKED INTENT — 4 world families + the dial rig]
A "pose" is expensive only when it changes the silhouette enough that clothing must be redrawn.
**Four world pose families**, each authored across the 5 drawn directions and mirrored to 8:
1. **Upright** — idle + walk (one family, animated).
2. **Crouch / in-cover** — torso scrunch + legs bend. Bohemia combat read.
3. **Downed / dead** — full re-author per outfit, lying on the floor. Grounded death (Paolo's call
   over the cheap tip-over-and-desaturate version), because one-shot lethality means real bodies.
   **The pose reads as SLEEP or DEAD from the same art** (`bohemia_sleep_dead_pose.png`): on the side,
   knees gently drawn up, one arm draped forward, eyes closed. **Context disambiguates** — on a
   bedroll it's asleep (reused by the save), with a blood pool + sprawled limb it's dead. Needs all 8
   directions (which way the body's oriented).
4. **Sit** — **mostly LOWER-body** (legs bend, torso drops); upper-body layers can often REUSE the
   upright torso shifted down, so it's cheaper per-layer than crouch. Needs all 8 directions.
   Context (car seat / ground / chair / bedroll) is drawn AROUND the character on the same leg art;
   the **bedroll save** can reuse the downed pose laid out peacefully.
Plus the **dial combat-arm rig** (counted separately, GDD combat).
**Faked at runtime, NOT drawn (zero clothing art):** hit-flinch (white flash + shake), knockback
(shove the upright sprite). Deferred until their systems exist: tool-use / work poses.

## DIRECTION MODEL  [LOCKED INTENT — 8-direction, corrected]
**WORLD = 8 directions:** cardinals **N E S W** + intercardinals **NE SE SW NW**.
**Left-right mirroring → only 5 unique angles drawn per item, 8 shown:**
- **S (down)** drawn once · **N (up)** drawn once · **E (side)** → mirror for **W** ·
  **NE (up-diagonal)** → mirror for **NW** · **SE (down-diagonal)** → mirror for **SW**.
- Saves drawing W, NW, SW entirely (≈⅓ off every item) while keeping diagonal movement/facing.

**DIAL = separate system.** The combat dial keeps its own **8-facing aim rig + swinging weapon
arm**. World walk rig and combat arm rig are two different rigs; neither pays the other's tax.

**SHOOTING IS NOT A POSE [LOCKED — Paolo, scope win].** There is **no separate shooting pose family.**
At shoot time the idle/crouch sprite simply **HIDES its arm(s)** and the **combat arm becomes part of
the dial** — one small arm+weapon piece pinned at the shoulder, rotated to the dial angle. **Pistol /
light SMG = right arm only. Shotgun / rifle = both arms** (main + support hand). Torso and legs stay
in whatever pose they're already in. The arm is drawn across the 5 angles, mirrored to 8, riding the
dial's existing rig; sleeve + glove travel with it. This deletes a whole pose category before it was
ever drawn — the only remaining cost is authoring the detachable arm to rotate cleanly.
**Same asset, two behaviors:** the PLAYER swings this arm on the dial; an ENEMY uses the identical
asset snapped to aim at the player and held static (+ muzzle flash + recoil), since enemies have no
dial. One arm asset covers both shooter and target.

**WHY 8 IS THE WHOLE POINT [Paolo, GOTY-scope call].** Stardew and Rogue Fable only ever face
**N/S/E/W** — no true diagonal in the world, movement reads as up/down/left/right. Bohemia commits to
real diagonal facing everywhere. It is extra work and Paolo is explicitly choosing to pay it; this is
a headline differentiator, not a nice-to-have.

---

## PORTRAIT CUSTOMIZATION — FOR EVERYONE  [LOCKED INTENT, Paolo]
The big **dialogue portraits are ALSO a paper-doll**, same spine as the body: face shape, skin tone,
eyes, brows, nose, mouth, facial hair, hair, headwear, glasses, plus a **garmentCollar** layer that
shows the bit of whatever shirt/jacket they're wearing at the shoulders so the portrait matches the
in-world fit. Once a library of face parts exists it is nearly free to:
- **Random NPC → shuffle** the face layers = an endless crowd of distinct faces.
- **Main / quest NPC → fixed** layer set (a saved combo) so a recurring character always looks the same.
This is the piece Paolo flagged as lifting the game to "portrait customization for everyone." Manifest
block `portraits` holds layer order + selection rule. Portrait canvas starts 64x64 (Stardew-class).

**ONE FACE CREATOR, TWO OUTPUTS [LOCKED — Paolo].** At world start you build your face like you'd
build a Stardew portrait (the 64x64 paper-doll). That same selection is **mapped down to a derived
overworld facial layer** stamped onto the blank sprite head. Build once → the big portrait AND the
tiny in-world face stay the same identity. NPCs: random shuffles the face set, main/quest NPCs carry
a fixed set, so a recurring character's portrait and overworld face always match.

**Babypunk portrait v1 BUILT** (`bohemia_punk_portrait.png`): 64x64 bust, platinum shaggy jaw-length
hair, dark brows, light eyes, septum ring, black top. First output of the face-creator pipeline; the
derived overworld facial layer comes off this same identity. Generator `tools/portrait.py`.
**Now generalized into a parametric FACE SYSTEM** (`BOHEMIA_ADDENDUM_FACE_SYSTEM_6.28.26.md`): every
face is a spec built from regions (skin/forehead/brows/eyes/nose/cheeks/jaw/chin/mouth/hair/details),
rendered by `tools/face_compose.py`, with a fixed analysis protocol for turning any sent photo into a
spec. `face_schema.json` is the data skeleton; `faces_punk.json` is Paolo's saved face.

---

## PROPORTIONS — TALLER THAN STARDEW  [LOCKED: MID]
Stardew's people read **compact / short** (~3.2 heads, 16x32). Paolo wants Bohemia's world people
**taller and less compacted.** Compared STARDEW ~3.2 · MID ~4.5 · TALL ~5.5
(`bohemia_proportions_guide.png`). **Paolo picked MID (~4.5 heads).** Grounded-tall, not lanky.
`manifest.proportions.chosen = "mid"`; bodyTypes set to mid scale (male 46 / female 44 / child 35 px).
Every body + clothing layer is authored to this grid from here on. Tall reference render retired.

---

## THE REAL COSTS (the multipliers to plan around)
Per clothing/hair/shoe item, textures multiply across:
1. **Angles:** 5 drawn (mirrored to 8).
2. **Pose:** **4 world families** (upright, crouch, downed, sit) — see POSE FAMILIES. Upper-body
   items hit hardest by crouch/downed; sit is mostly lower-body so upper layers often reuse upright.
3. **Walk frames** (animation).
4. **Damaged state** (alpha tears / wear).
5. **[Combat arm — net SAVING] Detachable aim arm:** the dial hides the idle arm(s) and swings a
   separate pivoting arm+weapon piece, so **sleeves and gloves are authored once as a rotatable arm**
   instead of a full shooting pose family. Real cost, but it REPLACES a whole pose category rather
   than adding one.

Paolo's "8–10 textures per item" is right for simple slots; a full upper-body item (angles × poses ×
walk × damaged × combat-arm) climbs past that. **The paper-doll keeps it sane: you pay per LAYER,
never per combination.**

---

## APPAREL SLOTS — ~13, in draw order (back → front)  [LOCKED INTENT, list open]
1. Body (+ **fat variant**) 2. Facial features 3. Tattoos 4. Pants 5. Shoes 6. Belt 7. Shirt
8. Gloves 9. Neck 10. Jacket 11. Hair 12. Hat 13. Glasses.
**Variants live inside slots, not as new slots:** **legwarmers = a PANTS variant** (leather + fuzzy
legwarmer bottom is one pants item, per Paolo); **jacket = hoodDown / hoodUp variant** (hoodUp pulls
the fuzzy hood over the head and suppresses hair + hat).
**Known conflicts:** hat-over-hair (need **hat-compatible hair**), jacket-over-shirt (jacket
**sleeves must fully cover** the shirt sleeve), jacket.hoodUp hides hair/hat. Worn-backwards hoodie
reads as a **front cowl** (shirt slot).

**[OPEN]** final slot list; how fat-body interacts with each clothing layer (likely a fat-fitted
variant of body-hugging items only).

---

## PARKED FEATURES — recorded, build later  [PARKED]
- **EYES KILL CAM.** A cinematic finisher: screen letterboxes (top + bottom blacked out), zoom to
  **the player's eyes, then the NPC's eyes**, that's it, then play continues. Slots straight into the
  existing cinematic killshot style system (SHARP/HAMMER/ORBIT/etc.) as a new style.
- **3D UI OVER THE 2D WORLD.** World stays 2D pixel Stardew; the **UI is 3D** for textural contrast.
  Must look right on **iPhone and widescreen TV**.
- **PORTRAIT ↔ LANDSCAPE / ONE-HAND CAMERA.** Same gameplay vertical or horizontal; what changes is
  **camera framing + zoom**. One-handed phone play must look good. Paolo expects this is the easy part.
- **TONED-DOWN HIGHLIGHTS + LINE OF SIGHT.** Carry the combat module's green/red ready-state idea onto
  the **world sprites**, but at **very low opacity** — barely-there tints, not bright fills. Same for
  **line-of-sight**: a faint low-opacity line, never an ugly bright-red beam. Fits the paranoid/
  grounded look and rides the **Ghost Time Layer** visual language (GDD §20).

---

## NEAR-TERM TASK
- **Babypunk: Mid locked.** Hood-down vs fuzzy-hood-up A/B drawn (`bohemia_babypunk_mid_hoods.png`).
  Outfit decomposed (`BOHEMIA_ADDENDUM_BABYPUNK_6.28.26.md`).
- **NEXT:** pick the iconic hood state → draw clean Babypunk across the **5 angles** (S,N,E,NE,SE),
  then crouch / sit / downed, then the **detachable combat arm**, then the **64x64 portrait**. That
  finished set is the scope yardstick for building the whole world.
- **Pending:** girlfriend **Keira** photo (character #2), built after Babypunk is final.

## STATUS
Paper-doll + fixed heights + 8-dir/5-drawn world + **shooting = detach idle arm onto the dial (no new
pose)** + **portrait customization for everyone (one creator → portrait + overworld face)** + ~13
slots (legwarmers = pants variant) + **proportions = MID** + **blank base head** = **locked.**
**BUILT:** naked base (skin-parametric) · 5 tightened directions · STAND/CROUCH/SIT/SLEEP-DEAD pose
range · **full Babypunk layer pack (45 PNGs, 5 dirs)** · generators in `tools/`. Combat arm = rough.
Eyes kill cam, 3D UI, portrait/landscape camera, low-opacity highlights/LOS = **parked.**
Open: tighten crouch/sit fronts + author clothing onto crouch/sit/downed; combat arm on the dial;
fat-body fitting; iconic hood state.

## DIRECTIONAL VIEWS — REAL side & back authored  [6.28.26]
Side and back are now genuinely drawn, not the front faked:
- **SE (front 3/4):** real rotation — whole body mass shifts to the facing side, near arm swings forward with the **hand hanging down**, far arm tucks back. No longer 'S with a shrunk arm'.
- **NE (back 3/4):** the one Paolo liked — back-of-head + hood + asymmetry sells the turn.
- **E (side):** narrow profile, one front arm with a **visible hand poking below the jacket cuff** (drawn on the jacket layer so the hip/pants can't bury it). With hair = hair + nose; bald = clean profile.
- **NE / N (back):** **no face.** Bald = back of the skull. Dressed = back of the platinum hair + the **fuzzy black hood of the Japanese jacket hanging between the shoulder blades** (solid jacket back, no front zipper). `L_jacket` branches on `co['face']` to draw the hood lump.
- **Sprite-scale identity carry-over (hard limit):** only **eyebrow / eye / lip color relative to skin** survive the down-rez. That + hair + silhouette is the identity at world scale.
Files: `bohemia_sprite_bald_noshirt.png`, `bohemia_punk_dressed_dirs.png`. Engine: `tools/punk_full.py` (per-direction layer branching), `tools/compose.py`.

## [DECISION — LOCKED] 2x HD RESOLUTION STANDARD  [6.29.26]
Whole game renders at **2x resolution**. This is the permanent standard for EVERYTHING (bodies, faces, clothing, portraits, cover art). Reason: must look great on a 4K HD TV without turning into crude squares, while keeping the Stardew pixel soul.

**HD IS THE ONLY TEXTURE. END OF STORY (Paolo, hard rule 6.29.26).** There is exactly ONE texture set and it is HD. We will NEVER maintain two sets of textures. The 1x grid is NOT a texture set — it's the internal editor surface the parametric generators draw on (like the wireframe under a 3D model): never shown, never approved, never shipped. Every texture that exists, every image presented to Paolo, the character lab, all of it is HD. No 1x deliverables, no 1x-vs-2x comparisons going forward.
- **Method = scale2x / EPX global pass.** 1 logical pixel -> 4, staircase diagonals rounded for free. Rounds skull / shoulders / jaw / feet / hair / jacket edges with zero re-authoring. Tool: `tools/hd.py` :: `scale2x(img)`.
- **Source art stays editable at 1x** (24x50 body, 64x64 face) so pixel feedback is still one-number-easy; everything EXPORTS through the scale2x pass to 2x (48x100 body, 128x128 face).
- **STOP AT 2x.** It's the sweet spot. 4x/8x loses the pixel charm and multiplies authoring. Parametric, so resolution can be pushed later if ever wanted.
- **Caveat (honest):** scale2x rounds existing art but cannot invent detail — it rounds an eye, doesn't give it a white/pupil. For REAL added face detail (eye-whites, shaded nose, finer ears) we AUTHOR the parametric generators at the 2x grid. Faces/portraits are exactly where that real-detail authoring matters; bodies/clothing ride scale2x fine.
Files: `bohemia_punk_naked_hd.png`, `bohemia_punk_dressed_hd.png`, `bohemia_hd_compare.png` (1x vs 2x). Pipeline: `tools/hd.py`.

## [LOCKED] BASE HUMAN BODY — full 8-dir naked turnaround  [6.29.26]
The permanent skeleton every human is built on. Naked, hairless, skin-parametric. 5 drawn (S/SE/E/NE/N) + 3 mirrored (NW<-NE, W<-E, SW<-SE). Approved by Paolo.
- **SE = NE's exact silhouette, just front-facing.** KEY INSIGHT: SE and NE are the *same horizontal rotation* (one faces toward you, one away), so they SHARE a build. The earlier sticking-out forward-arm SE was wrong; stealing NE's clean both-arms-at-sides + feet-together stance fixed it. SE/SW and NE/NW are now a matched set. Front-3/4 turn reads subtler than back-3/4 because the back gets the back-of-head as a free cue — that's a permanent constraint, not a bug.
- **EARS on every facing** (no more Lego heads), tucked one pixel INSIDE the head silhouette (never poking out):
  - S / front: both ears at the head side-edges.
  - E / profile: one ear at the BACK of the head.
  - N / straight back: both ears.
  - NE / NW (3/4 back): **only the NEAR ear** (far one hidden) — NE = right side, NW = left side.
- **Sprite face marks** (derived overworld face, the only identity carriers at world scale): brows, light eyes, single-pixel nose (no philtrum/streak), darkened lip so the mouth reads. E profile: brow + eye dropped to sit by the nose + ear at back. Front cowl collar sits at the NECK only (y11-13), never up over the chin/mouth like a bandanna.
Files: `bohemia_punk_naked_all8.png`, `bohemia_se_vs_ne.png`, `bohemia_back_ears.png`. Engine: `tools/punk_full.py`, `tools/overworld_face.py`, `tools/compose.py`, `tools/hd.py`.

## [BUILT] THE CHARACTER LAB — live customization app + feedback tool  [6.29.26]
`bohemia_character_lab.html` — self-contained, runs in the Claude app on Paolo's iPhone. **This IS the in-game character-customization screen**, doubling as the fast like/don't-like feedback tool (replaces the slow render-screenshot loop). Real compositing + real scale2x run in-browser, so what's shown == what the pipeline ships.
- **One iPhone screen, NO scroll** (hard rule). Bohemian-world background: night desert Vegas, broken Strip skyline w/ survival lights + one magenta Amalgamation light, the moon (hope), ghost-time 5D streaks, surveillance scanlines + vignette.
- **Tap-your-body to dress** (hit-zones, mirrored per facing): torso->shirt, arms->jacket, legs->pants, feet->shoes, hands->gloves, head->hair. Menus = bottom sheet.
- **Hair menu includes live HAIR-COLOR swatches** (luminance-tint recolor of the hair layer): platinum/black/blonde/auburn/white/violet/pink.
- **Bohemian compass** (top-right, rusted ring + Amalgamation eye + needle): tap any point to turn through all 8 facings.
- **Gender pill** taps through male/female/child (no dropdown). female/child ride the male base until those bodies are drawn.
- **Dead Eye Dial preview:** target-icon toggle; drag thumb to swing an arm inside a **180° window oriented to the body's facing** (FACE_ANG per dir). Feel-preview shape, not the final sprite arm.
- **Pose stubs** (stand live; sit/crouch/sleep wired, art pending). **Notes** pinned bottom, auto-save via window.storage, **Claude-burst icon = copy** (no "copy notes" text).
- Adds as we build: new garments/characters/skin tones drop in as real cycle options.

## [BUILT — LOCKED] BOHEMIA THEME (music)  [6.29.26]
`bohemia_assets/music/bohemia_theme.wav` (+ `.mp3` embedded in the lab, **music ON by default**, unlocks on first tap per browser autoplay rules). My best attempt at the sound of Bohemia: **D minor, 120 BPM, 32s seamless loop.** Progression i-VI-III-VII (Dm-Bb-F-C) = minor dread lifting toward hope. Layered detuned pads + sub bass + a soft **heartbeat pulse** (the family core) + filtered wind/static (Amalgamation presence) + a **lonely bell in cycle 1 that blooms into a full hopeful motif in cycle 2**. Convolution reverb w/ wrapped tail for seamless loop. "Hans Zimmer conducting the end of the world with a reason to hope." One track for now; the lab's music icon plays this one option.

## [v2 fixes] NAKED BODY + LAB  [6.29.26]
Naked 360 perfected (priority: lock stand before other poses):
- **SE/SW handedness fix (LOCKED insight):** the body must be HORIZONTALLY FLIPPED while the face stays. SE was reusing NE's silhouette wholesale, which left the body facing opposite the head. Fix baked in `punk_full.save()`: any `_SE` non-facial layer is mirrored + shifted +2px to re-align the head to x9-16; the facial layer stays normal. SW = full mirror of corrected SE. Both now turn the same way as their heads.
- **Feet = skin** (SK[0]) with toe-separation notches, NOT the old tan SK[1] that read as shoes.
- **Nipples** (two SK[2] pixels) on front views (S, SE). **Censored groin** = small pixel-mosaic block (mixed tones) on front views — deliberate "censored" look. **Butt** = center crease + cheek undershadow on all back views (N, NE, NW).
Lab v2.1 fixes: notes font 16px (kills iOS auto-zoom); music preloads + plays on first gesture, icon hard-toggles (music files live in `bohemia_assets/music/`); **compass now drag-to-spin** (thumb slide), not just tap; moon shrunk/dimmed/cornered; **Dead Eye Dial 1-HAND/2-HAND toggle** (2-hand braces both arms onto the weapon). Lab re-embeds the updated body art automatically.
OPEN: portrait→sprite-face translation request (clarifying: show 64px portrait in lab, or push more likeness into the sprite face). Female/child bodies + sit/crouch/sleep poses still stubbed.

## [v2.3 fixes + handoff]  [6.29.26]
- **Skin tint now recolors ears/nose:** the facial layer was using `SKINRAMP['pale']` while the body used a different `SK` ramp, so the lab's skin-tint missed the face. Unified — `overworld_face` ear/nose now use the body SK ramp `(194,164,142)/(150,118,98)`, so skin tone drives the whole sprite (body + face) as one.
- **Censored groin** centered on the leg-gap and parked at the crotch (final position).
- **Skin tones = 7** (added `ebony`, darkest).
- **Music** rebuilt on Web Audio + `<audio>` fallback + a diagnostic toast on the music tap (so we can see why it's silent in-app). Still chasing in-app playback; likely env/mute-switch.
- **WORKFLOW LOCKED:** Paolo tests in the lab only — Claude changes code, rebuilds lab, presents lab. No PNG/JPEG renders.
- **3D vs 2D decided:** stay 2D paper-doll (lighter on mobile engine, keeps handcrafted pixel soul, fast lab-verify loop). 3D only as optional posing reference.
- **SESSION HANDOFF system created:** `BOHEMIA_SESSION_HANDOFF.md` (the one doc that lists what to upload + current state + next-up) and `bohemia_handoff_bundle.zip` (asset pack + lab + all canon). Claude OWNS re-dropping both every session; Paolo shouldn't have to remind.
- **Portrait maker = the immediate next build.** Logged hard: when cropping the circle/square, frame LOWER so the jaw isn't cut off (past mistake). Two-way link: edit face/skin → portrait + sprite both update.

## [v2.4 — naked 360 LOCKED + clothing/lab pass]  [6.29.26]
**NAKED STANDING 360 = LOCKED. Paolo signed off ("we finally did it"). This is the base skeleton all poses derive from.**
- **Hair redone** (`platinum-fall`): was a "helmet / polar-bear scalp." Now a sleek platinum BOB — rounded crown (corners cleared), thin dark-root center part (CROWN), smooth 2px curtains to the JAW (never past shoulders) that curl inward at the jaw, PSH strand-wave texture. Back view stops above the nape so the NECK shows on N.
- **Balenciaga shoe redone**: chunky stacked look — bulky upper over the ankle, lighter MIDSOLE stripe (74,74,84), wider SOLE outsole, TOE/heel caps. Reads as a chunky sneaker now, not a flat black shoe.
- **hoodUp deleted** (generation + PNGs gone). **Renames (display names in lab):** cowl-hoodie -> "Black Hoodie Backwards"; japanese-fuzz_hoodDown -> "Japanese Jacket".
- **Skin tones = 9** (added `olive` between fair/tan = the in-between tone; `onyx` near-black African). Skin recolors body + face as one ramp.
- **Per-garment color = YES, implemented** (confirmed feasible, not too much for a 2D game). Generic luminance recolor `tintLayer`; jacket/shirt/pants/shoes menus now have a Color row (red/blue/green/purple/sand/white/default).
- **Remove-all-clothing button** (the ✕ by the wordmark): every press strips shirt/jacket/pants/shoes/hat/gloves (keeps hair/body). Not a toggle.
- **MUSIC FIXED (hopefully):** dropped the embedded mp3 entirely (it was almost certainly the decode/sandbox failure). Lab now plays a **live procedural Web Audio synth** of the theme (Dm-Bb-F-C pads + sub bass + heartbeat kick + hopeful bell motif, 16s loop). Lab shrank 637KB -> 41KB. The rendered `bohemia_theme.wav/.mp3` still lives in `bohemia_assets/music/` for the game.

## [NEXT BUILDS — committed]
1. **POSES** (standing 360 is the locked base): **sit** (simple, sit-anywhere), **sleep** (looks dead or asleep), **crouch** (reasonable, strategic for cover), and a NEW category **lean-on-wall** (chilling on a wall OR taking cover about to pop out and shoot — ties into the cover mechanic that uses wall corners / crouch-under spots).
2. **Portrait maker into the lab + two-way face<->portrait link** (skin + every facial trait drive both; crop framed LOWER so the jaw isn't cut off).

## [HAIR PHILOSOPHY — LOCKED, Paolo's rule]  [6.29.26]
**Hair is SUBTRACTIVE. Shape comes from negative space, never from a border.** Rules:
- NO outline/border on hair (the dark border is wasted real estate and is what makes hair read like a helmet). `L_hair` returns the raw shape, never `outline()`.
- Fill the scalp region, then CARVE the face open and delete pixels to define the cut. Do not stack strands on top of a bald-head shape to build volume.
- Less is more. No speckle/strand-dot shading. Round the crown by clearing corner pixels. Delete stray transparent pixels inside the shape.
- Result locked: clean platinum BOB — rounded crown, dark-root center part, clean 2px curtains to the jaw with inward curl tips, face fully open, neck shows on N.

## [v2.5 fixes]  [6.29.26]
- **Hair rebuilt** per the philosophy above (no border, subtractive, minimal). Big improvement; face keeps its real estate.
- **Hoodie Backwards** (renamed from Black Hoodie Backwards; the cowl shirt): now a **turtleneck** — front/side collar covers the NECK only (2px shorter, off the chin/face). BACK view shows the bare nape (hood is worn on the front, so no lump on the back).
- **Per-garment colors** now include **dark brown + grey** (plus red/blue/green/purple/sand/white/default) on jacket/shirt/pants/shoes.
- **Hands hit-zone fixed:** tapping the hands now opens the Gloves menu (shows "coming soon" until gloves are built).

## [v2.6 — PORTRAIT IN THE LAB + hat + naming rule]  [6.29.26]
- **PORTRAIT MAKER v1 is LIVE in the lab** (gold ☻ circle button, top bar). `face_compose.py` ported to pure JS (`renderFace`, verified by rendering in node before shipping, NOT blind). Shows the 64px Babypunk portrait in a CIRCLE frame (in-game social/feed default), **jaw fully in frame (not cut off)**. **Reflects the chosen skin tone live** (portraitRamp derived from the lab skin ramp). NEXT for portrait: facial-trait sliders (brows/eyes/nose/jaw/lips) + the two-way sprite<->portrait link so editing either updates both.
- **HAT category added:** tap the TOP of the head = Hat (beanie); tap the LOWER head/face = Hair. Hat is colorable too.
- **NAMING RULE LOCKED:** never name anything by a color (colors are all customizable now). `platinum-fall` -> **`curtain-bob`** ("Curtain Bob"), files + key + display all renamed. Apply this rule to every future asset.
- **Dial honesty (told Paolo straight):** the lab Dead Eye Dial is a FEEL-PREVIEW with an abstract arm. The real rig — hide the resting arm, pivot 1 or 2 real arm sprites from the shoulder, look clean — needs the body authored with detachable arms + arm sprites. That's a combat/pose-rig job, built properly with the poses/combat, not faked as done.
- **Synths/songs save** as rendered audio in `bohemia_assets/music/` (e.g. `bohemia_theme.wav/.mp3`). The lab's menu music is a live-synth (code in the lab). New songs (e.g. a ska-blend menu track) get rendered to that folder.

## [v2.7 — beanie/glasses + portrait live hair color + lab taps]  [6.29.26]
- **Beanie remade** = tight durag/skullcap: hugs the skull, sits LOW over the forehead to the brow (just above the eyes), rounded crown, no border, durag tie down the back on N. (was way too bulky.)
- **Glasses added** (`shades`): new `glasses` slot (draws above facial, below hair). Dark shades + glint on front/side; temple arm on side/back. Colorable.
- **Portrait now reflects HAIR COLOR live** (and skin) — pick a hair color anywhere and the portrait updates. (Facial-trait sliders still the next portrait pass.)
- **Portrait button moved UNDER the compass** (gold ☻).
- **Lab tap map updated:** crown = Hat/Hair chooser; **eyes = Glasses**; lower face = Hair; hands = Gloves; torso = Shirt; arms = Jacket; legs = Pants; feet = Shoes.
- **NEXT: lean-on-wall pose** (combat-or-chill, reconfirmed) + the rest of the poses, and the portrait facial-trait sliders + sprite link.

## [CONSISTENCY RULE — LOCKED, the most important process fix]  [6.29.26]
Paolo's core pain: directions drifted (front great, back/side inconsistent). ROOT CAUSE: authoring each facing with its own ad-hoc logic. **FIX (mandatory from now on):**
1. Every hair/clothing piece is built from ONE coverage rule applied to the head box across ALL directions (e.g. "cover crown to brow, full width, every facing"), so directions can't drift.
2. Claude renders the FULL 8-direction turnaround and eyeballs it side-by-side HIMSELF before shipping anything. No more shipping a piece checked on one angle.
3. When Paolo has a specific look in mind, he sends a reference image (front + side) so Claude matches a real consistent object instead of inventing volume per-angle.

## [v2.8 — consistency pass + durag + live portrait editor]  [6.29.26]
- **Curtain Bob rebuilt CONSISTENT** across all 8 dirs (same jaw length + volume front/side/back; verified on a turnaround sheet).
- **Beanie renamed DURAG and remade consistent**: uniform full-crown coverage to a STRAIGHT brow hem on every facing, no bald spots, tie down the back. (Files hat/beanie_* -> hat/durag_*.)
- **LIVE PORTRAIT under the compass** (replaces the smiley button): renders the real face, updates live with skin + hair + every facial trait.
- **PORTRAIT EDITOR** (tap the live portrait): Skin, Hair color, Eyes (iris), Lips, Brows, Nose width, + toggles Stubble / Blood / Cigarette / Braid L-R. Skin + hair also drive the sprite simultaneously. (Remaining: pushing iris/lip/brow changes down into the tiny SPRITE face too = full two-way link, next portrait pass.)
- Known minor: a stray skin pixel above the head on the E/W profile (pre-existing body-profile artifact) — to clean next body pass.
- **Dead Eye Dial real arm rig** still owed — builds with the lean-on-wall/combat pose.

## [v2.9 — durag solid fix + facial translation + philosophy doc]  [6.29.26]
- **Durag fixed SOLID:** full crown coverage to a straight brow hem, no cleared corners (killed the center "bald spot"), and **E/W fixed** (was offset off the narrower x9-14 side head). Verified durag-alone AND durag+bob composite on the full 8-dir turnaround.
- **Eyebrows: KEEP AS-IS** (Paolo's call — they're good, just could read as lashes; do not edit). New rule: **keep everything Claude makes, catalog it, curate/repackage near ship** — no mid-stream deletion.
- **Facial traits now translate to the SPRITE:** `tintFacial` remaps the sprite face's brow / eye / lip pixels live from the portrait editor choices (eye color, lip color, brow color), so the portrait and the in-game character match. (Skin + hair already did.)
- **Portrait editor: live portrait is now STICKY** at the top of the sheet — it stays visible while you scroll the controls.
- **WROTE THE ART PHILOSOPHY DOWN:** `BOHEMIA_ART_PHILOSOPHY.md` (keep-everything, 8-dir consistency, male-hair-reads-male-every-angle, headwear-assumes-hair-underneath, simple-solid-shapes, subtractive-hair, reference-images-win). Re-read before authoring anything.
- Bob back-of-head (N/NE) reads slightly curled/feminine — Paolo said leave it for now, but it's flagged against rule #3 for a later pass.

## [v3.0 — shades rebuilt as one object, durag baseline width, bald toggle, portrait angle]  [6.29.26]
- **SHADES rebuilt as ONE logical 3D object** (lenses over eyes; temple arms back to and stopping at the ears; SIDE = lens in front over the eye + arm back; BACK = arm by the ear only, killed the floating skull line). Verified bald on the full 8-dir turnaround.
- **DURAG = baseline hat fit: +2px each side on EVERY angle** (sits over hair). All future hats inherit at least this width. Logged as philosophy rule #9.
- **Portrait angle answered + locked:** Paolo's reference (IMG_3620) is frontal + ~15° high angle (camera above eye line). Locked as the standard for all portraits (philosophy rule #10).
- **Portrait shoulders shifted NORTH** (~5px up), face unchanged — more shoulder/body in frame. Verified render.
- **LAB: BALD toggle button** (top bar) hides hair instantly to spin-check headwear on a bald skull.
- **LAB: portrait editor updates IN PLACE** — tapping a swatch no longer rebuilds the sheet or resets scroll; selection + live portrait + sprite update without jumping.
- **Accessory philosophy rule #8 written:** accessories are one object rotated, not 8 independent drawings — the root-cause fix for the E/W and back-of-head failures.

## [v3.1 — DRAW pixel editor + eye-on-border + durag -1]  [6.29.26]
- **IN-LAB PIXEL EDITOR ("DRAW" button):** Paolo edits any equipped layer, any direction, directly on a zoomed pixel grid. Tools: Paint / Erase / Pick(eyedropper) / Undo, a palette auto-built from the layer's own colors + staples + a custom color input. Edits update the live composited character instantly and persist via window.storage. Mirror directions (W/SW/NW) edit their source (E/SE/NE) and are labeled as such. A gold guide line marks ~where the head ends.
  - **Bake loop (edit -> code):** "Export" copies a JSON of all hand-edits to the clipboard. Paolo pastes it back; Claude decodes each layer PNG and writes it into characters/<slot>/, making the hand-edit the canonical asset (generator output was just the base). Keep-everything still applies: generated base + hand-edited final both retained.
  - Note: render still applies skin/hair/garment TINT over edited layers, so for literal painted colors keep the item color at default while editing; shape/placement edits are unaffected.
- **Eye-on-border (E/W):** profile eye moved onto the front contour (not sunken); shades lens + brow follow. Philosophy rule #11.
- **Durag width -1 each side** -> now +1/+1 over the head (still the baseline hat fit, just tightened per Paolo).

## [v3.2 — crash fix + HD-resolution editing]  [6.29.26]
- **CRASH FIX:** the DRAW overlay was emitted AFTER the <script>, so wiring ran against elements that didn't exist yet and threw on load. Overlay now sits BEFORE the script; all editor wiring is null-guarded.
- **EDITOR NOW WORKS AT HD (48x100), the resolution Paolo actually sees and ships** — not the coarse 24x50 base. Render refactored to per-layer HD: each layer is its scale2x base OR a hand-painted HD override (hdEdits). Editing carves shape at full resolution; Erase can refine beyond the generated silhouette. Added a Zoom button (cell sizes 8/11/15/20) for tight head work. Banner confirms the exact target (dispName · slot · facing). Persists to window.storage key `bohemia_hdedits`; Export copies HD PNGs for Claude to bake.

## [v3.3 — UI consolidation + home screen + per-item editing]  [6.29.26]
- **Home screen:** lab opens to a BOHEMIA splash with two launches — Character Lab (works) and Combat · VR Training (stub; needs the latest combat HTML to merge). Framing locked: Character Lab = the in-game character customization screen; Combat module = the VR training layer (train for partial XP, ~10% of real-life gain).
- **Top bar cleaned:** removed the standalone skin button (skin lives only in the portrait editor now). The X + BALD merged into ONE nude-cycle button with a figure icon: tap = bald, tap again = bald + naked (clothing hidden, not deleted), third tap = dressed again (badge shows stage). Gender is now three icons (man / woman / kid).
- **Per-item editing through the normal UI:** every garment/accessory option in its menu has an **Edit** button that equips it and opens the pixel editor on that exact item. Added **Body** and **Face** edit buttons in the top bar. The old standalone DRAW button is gone.
- **Editor zoom/pan fixed:** added a **Pan** tool (frees native scroll) and **− / +** zoom (cell sizes 6/9/13/18/26). Painting and panning no longer fight.
- **Hat-width floor encoded:** `hat_bounds()` in punk_full.py; philosophy rule #13.

# BOHEMIA — ADDENDUM: FACE / PORTRAIT SYSTEM
**6.28.26 — Paolo / Babypunk.** The portrait equivalent of the body paper-doll. **Every character in
the game can have a portrait.** A face is DATA (a spec), not a drawing. Same spec drives the 64x64
portrait AND the derived overworld facial layer. NPC = randomized spec; main/quest = fixed saved spec.

Files: `bohemia_assets/face_schema.json` (the data skeleton), `tools/face_compose.py` (the parametric
renderer), `bohemia_assets/faces_punk.json` (Paolo's saved spec), `bohemia_face_system.png` (proof:
Punk + 3 randomized NPCs from one engine).

---

## THE SKELETON — a face is built from REGIONS, each a parameter  [LOCKED INTENT]
`face_compose.py` renders a spec. The face SHAPE is built from skeleton widths (forehead / cheek / jaw
/ chin) at vertical levels; the FEATURES (brows, eyes, nose, mouth) are placed components with their
own params; hair is a styled mass; skin is a ramp. Change a param, get a different person. Randomize
all params, get an endless crowd. This is the same philosophy as the body compositor: **author the
system once, generate infinite faces.**

Regions (full list in `face_schema.json`): **skin tone · forehead · brows · eyes · nose · cheeks ·
jaw · chin · mouth · hairstyle · details** (stubble / piercings / moles / freckles / scars).

---

## THE ANALYSIS PROTOCOL — how Claude reads any face Paolo sends
When Paolo sends a face to turn into a portrait, Claude analyzes the **straight (front) perspective**
region by region and writes a spec. This is the fixed checklist, every time:

1. **Skin tone** — pick from the ramp (fair/pale/tan/olive/brown/deep) + note undertone (warm/cool).
2. **Forehead** — height (hairline→brow) and width.
3. **Brows** — thickness, darkness/color, shape (straight / arched / angled), spacing.
4. **Eyes** — size, spacing (close/wide), shape (almond / round / hooded / downturned / upturned),
   tilt, iris color.
5. **Nose** — length, width, bridge (straight / curved), tip.
6. **Cheeks** — cheekbone prominence, cheek fullness (gaunt → full).
7. **Jaw** — width, angle (soft / angular / square).
8. **Chin** — width, shape (pointed / round / square / cleft), length.
9. **Mouth** — width, lip fullness (upper vs lower), color.
10. **Hairstyle** — texture (straight / wavy / curly / coily), length, part, color + roots, messiness.
11. **Details** — facial hair/stubble, piercings (septum etc.), moles, freckles, scars, makeup.

Output = a spec JSON (like `faces_punk.json`). That spec is the character's permanent face.

---

## PAOLO'S FACE (analyzed from refs, saved as `faces_punk.json`)
- **skin** fair, cool.  **head** good bald skull required first: wide cranium/temples, **SHARP angular
  jaw** tapering to a defined chin (this is a signature — don't let it go soft).
- **brows** THICK, dark, fairly straight with slight angle, close-set — signature.
- **eyes** light grey-green, medium, deep-set / intense, close together.
- **nose** LONG, straight, narrow, defined bridge.  **cheeks** prominent cheekbones.
- **jaw** sharp/angular.  **chin** defined.
- **mouth** full lips.
- **hair** bleached blonde, **wavy**, shoulder-ish length, **middle part, DARK (near-black) roots at
  the crown**, messy.
- **details** light stubble, small **nostril stud** (NOT a septum — earlier "septum" was a
  misread **blood streak**). Blood streak + cigarette = optional overlays he can toggle.

## HEAD-SHAPE-FIRST RULE  [LOCKED — Paolo]
The bald skull must be a good head on its own. `render_face(spec, bald=True)` shows it. Forehead /
cheeks / jaw / chin define the head; hair is an overlay, never a cover for weak bone structure.
Overlays (blood streak, cigarette, sweat, dirt, bruise) and piercings sit on top as toggles.

## ALWAYS 90° STRAIGHT-ON  [LOCKED — Paolo, whole project]
Every portrait renders **dead-on, straight at the camera.** If Paolo sends a photo that isn't a
perfect front shot, Claude makes the **smart interpretation to a straight-on front view** rather than
copying the angle. This holds for every face for the rest of the project.

## NECKS  [Paolo]
Neck is **minimal/optional**, usually tucked under the garment collar. Not seeing a neck is fine.

## BABYPUNK HAIR  [LOCKED]
Bleached blonde, wavy, shoulder length, middle part, near-black roots at the crown, **full side
volume** (falls well past the jaw — not 1-2px slivers), and a **black braid down his RIGHT side**
(viewer-left) just inside the hairline. Braid + side volume are hair params (`face_schema.json`).

---

## PORTRAIT FRAMING  [LOCKED — circle default]
In-game portraits care about the **FACE** — zoomed in, **near-black background that's only barely
distinguishable from the (black) shirt**, shoulders/body present but unimportant.
- **CIRCLE = default** (social/feed profile pic — reinforces the feed-is-the-world theme; a circle is
  also an eye, so it doubles as Amalgamation iconography). Carries a **low-opacity Amalgamation static
  / scanline overlay** and a **3D bevel ring** (light top-left, dark bottom-right) for the 2D-pixel
  "hovering 3D UI" look. `tools/circle_portrait.py`, see `bohemia_circle_portrait.png`.
- **SQUARE = reserved** for dossiers / wanted posters / Network surveillance files. Circle = social &
  alive; square = filed & watched.

## PORTRAIT → SPRITE BRIDGE  [BUILT]
The same spec drives the world sprite's face. `tools/overworld_face.py :: derive_overworld_face(spec,
dir)` **down-rezzes the portrait into a few pixels** (brows / eyes / nose / mouth, colored from the
spec) placed on the sprite's tiny head per direction, saved as the **`facial` layer**
(`characters/facial/punk-face_<DIR>.png`). `compose.py` stacks it like any other layer.
- **Face shows only on front-facing dirs (S/SE/E); back (NE/N) = no face**, just hair. Proven:
  `bohemia_sprite_with_face.png` (all 8 via mirror) + `bohemia_portrait_to_sprite.png` (the bridge).
- This is what lets **every character carry one identity** across portrait + world — powering the
  **kill cam** and **proc-gen NPC dialogue** (NPC's portrait and their walking face are the same person).

## HOW IT CONNECTS
- **One face creator → two outputs:** the player builds these regions like sliders/options; the spec
  renders the 64x64 portrait AND a shrunk overworld facial layer stamped on the blank sprite head.
- **NPCs:** random shuffle within `face_schema` ranges = infinite distinct faces. Main/quest NPCs get
  a fixed saved spec so they always look the same.
- **Pipeline parity:** faces are data + a renderer, exactly like the body is layers + a compositor.

---

## STATUS  [INFRASTRUCTURE BUILT · Punk face v4]
Parametric engine + bald-skull head shape + sharp jaw + overlay toggles (blood/cigarette) all working
(`bohemia_punk_face_v4.png`). Punk corrected: no septum, sharp angular jaw, long straight nose, dark
roots, nostril stud. All driven by spec params. Open: keep polishing render (lip shape, hair texture,
eye/brow micro-spacing); add upper-lip + ear params; build the overworld-facial down-rez from the same
spec; run the NPC shuffle for crowds.

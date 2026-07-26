# BOHEMIA ADDENDUM: GARMENT CONTACT + MOTION LAWS
Date: 7/2/26. Status: LOCKED by Paolo unless marked pending.

## 1. GARMENT CONTACT LAW (locked) - the mass-production rule
Each garment slot may ONLY touch/communicate with its allowed body parts. Any garment obeying this law drops into the game clean. Engine implementation: `Skinner.SLOT_CONTACT` + `Skinner.garmentContactLaw()`, enforced at composite in rest space, plus cover-fill maps trimmed to match.

- **PANTS**: right leg, right foot, left leg, left foot ONLY (parts 9,10,11,12). Never torso/waist.
- **SHOES**: their respective foot only (11,12; side lock via CANDD binding). May reach up to a MAXIMUM of 2 pixels beneath the knee pivot. Anything higher is clipped.
- **SHIRT**: torso, right arm, left arm (4,5,6). NECK (part 3) only if the garment has turtleneck vibe (neck-rated), otherwise never touches the neck.
- **JACKET**: same law as shirt. This kills the japanese-fuzz eating the whole body: its leg pixels are now clipped by law.
- **HAT**: upper half of the head only, stops right before the eyes. THE DURAG IS THE ULTIMATE SKELETON: it defines the minimum hat shape and the MAXIMUM any hat may travel south on the head. Implemented: HAT_MAX_Y per direction = durag's southernmost row; any hat pixel below it is clipped.
- **NECK GRANDFATHER RULE**: Paolo's existing painted garments that already touch the neck keep it (currently: shirt/cowl-hoodie). New garments default to no-neck unless Paolo rates them.
- Hair/glasses/facial: unchanged, head-anchored. No law stated yet. [PENDING if Paolo wants contact rules for them]

## 2. IDLE LAW (locked)
Idle is BREATHING. Feet NEVER move. No floating up and down. Just a gentle 1px pixel-snapped chest/head rise once per cycle (all facings) plus very slight arm movement. The old hipOff float is deleted. Verified: bottom rows byte-identical across the full idle cycle.

## 3. N/S ARM CRUNCH LAW (locked)
Walking north or south, both arms pivot INWARD (fixed lean, no left-right swing) and COMPRESS toward the shoulder, opposite-synced to the leg compression, selling the head-on depth exactly like the legs do. New retarget primitives: `armCompressL/R` in applyPose (mirrors legCompress). Amplitudes (0.10 inward, 0.25 compression) are first-pass numbers, Paolo tunes by eye.

## 4. APP CHANGES (Alpha 0.5)
- COMBAT tab added: bohemia_combat_v12.html embedded whole, lazy-loads on first tap. Native engine integration is the next step, this gets it playable in-app today.
- RAMPS tab removed. The ramp editor now lives at the bottom of CHARACTER as COLORS. What it does: every garment stores colors as ramp indexes, tap the color input on a row to retint that whole piece (light/dark structure preserved, outline locked). One jacket becomes fifty without repainting.
- BODY row rebuilt: it is the rig picker. MALE = Paolo's rig, selected. Female / child rigs land here when they exist. [PENDING: female + child rigs]
- RIG SYNC badge under the tabs: flashes green with a timestamp every time a rig edit lands and rebuilds the character. Live proof the bridge fires. Also proven headless: a simulated rig pose edit changed the character render.
- Face regions per direction: PAOLO'S PAINT TASK in the rig tool so eyewear reads right at all angles. Not an engine change.

## 5. HEADACHE RESEARCH (things that will bite later, flagged now)
1. **Mirrored facings flip art**: W/SW/NW reuse mirrored E/SE/NE garments. Any asymmetric design (logo, zipper side) will flip sides. Either accept it, or garments get optional dedicated W-side art later. [PENDING Paolo's call when the first logo garment appears]
2. **Rig persistence on iPhone**: the rig tool autosaves to localStorage inside its frame. On iOS this can silently vanish (storage eviction, file:// contexts). The live bridge covers the session; long-term the app should persist the last rig state itself and feed it back on boot. Flagged for the engine-integration pass.
3. **Garment authoring standard**: all garments are 24x50 anchored at offset (16,3) into the 56 grid. Every new garment MUST be authored on that canvas or the contact law clips it wrong. This is the spec for mass production.
4. **Body swap refits**: female/child rigs mean different silhouettes; garments authored on male will need refit passes (allowed: refitting clothing reads regions only, never reshapes them). Budget one refit pass per new rig.
5. **Scale2x on 1px details**: glasses and thin straps can smear under Scale2x. If a piece looks melted in HD, it needs a 2px minimum feature size. Authoring rule of thumb.
6. **Combat merge namespacing**: combat v12 and the alpha both use a global G. Iframe isolation hides it today; the native integration must namespace (Combat.G) before code merges.
7. **Bridge chattiness**: rig broadcasts at most every 700ms on change; 8 Skinner rebinds per sync is fine on iPhone, but if painting feels janky later, raise the debounce.

## Files
`bohemia_engine.js` (Skinner: garmentContactLaw, SLOT_CONTACT, headBob breathing; Retarget: armCompress), `_skinner.js` + `bohemia_retarget.js` synced, `_build19.py` -> `BOHEMIA_ALPHA_0_5.html`.

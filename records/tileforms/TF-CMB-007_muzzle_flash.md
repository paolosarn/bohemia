# TILE FORM TF-CMB-007 — THE MUZZLE FLASH

## A. IDENTITY
- NAME: The muzzle flash (the light at the end of the gun when it goes off)
- FAMILY/SET: COMBAT FX. Standalone. One short strip plus its per-weapon sizes.
- THE JOB, ONE SENTENCE: this tile exists so that the single most-seen frame in
  the entire game, the moment the shot leaves, is a drawn thing instead of a
  code-drawn triangle.

## B. WHY
- DEMANDED BY: the COMBAT NORTH STAR (Paolo 7/27/26): combat must feel
  **"snappy and violent and human and fun"**. The flash is the frame that
  carries "violent", it fires on every single shot, and the demo already has the
  full rig around it: `WEAPON_MUZZLE` gives a per-weapon barrel-exit offset
  (pistol 1.5, smg 2.5, rifle 4, shotgun 3.5 in sprite units), `G._muzzle`
  carries the exact world point and angle, and the whole thing is quantised to
  the 120 BPM grid. Every hook the art needs is already in place and wired.
- WHAT LOOKS BROKEN TODAY: `fxShot()` pushes a `muzzle` particle with a 0.09s
  life that draws as a solid alpha-faded shape at the barrel point, plus three
  grey circles for smoke. It is one flat colour and one shape for every weapon
  in the game. A pistol and a shotgun produce the same picture.
- SHOPPING CHECK:
  * `banks/BOHEMIA_PARTICLE_LOOP_BANK_7_14_26.txt`, 5 clips:
    `o_fx_flame_burst_00` (6 frames), `o_fx_smoke_puff_01` (8),
    `o_fx_smoke_small_04` (8), `o_fx_ember_trail_05` (8),
    `o_fx_spark_burst_06` (6). **PARTIAL HIT and two of them should be used
    immediately: `o_fx_smoke_puff_01` / `o_fx_smoke_small_04` are exactly the
    grey circles this code is faking, and `o_fx_spark_burst_06` is the impact
    spark.** Those are reuse, not cooks, and they are named as such below.
  * What the bank does NOT have: a MUZZLE flash. `flame_burst` is a fire
    explosion, radially symmetric, and a muzzle flash is directional, cone-and-
    star shaped, anchored to a barrel, and lasts about a twentieth of the time.
    Firing a fire-burst out of a pistol would be wrong in a way anyone would
    notice.
  * `banks/BOHEMIA_FX_STRIPS_7_10_26.txt` (17 strips, 3 to 15 frames): checked,
    these are generic fx-pack strips, none of them a directional weapon flash.
  * FIRE_FLICKER_BANK: campfire loops, already routed to the mobile camp.
    Wrong shape, wrong duration, wrong job.

## C. WHERE
- SURFACE + TAB: COMBAT (the fight field, the SLICE tab). Anywhere a gun fires.
- DISTRICT FAMILIES: n/a. It is anchored to a weapon, not to a place.
- LAYER: **prop** (an fx sprite drawn in the body pass at the shooter's depth,
  not a world tile).
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: the barrel end. It has ONE legal anchor and the code already
  computes it (`G._muzzle` = the barrel exit point plus the firing angle).
- NEVER BESIDE: nothing. It has no neighbours. It must NEVER be drawn detached
  from a gun, and never for a weapon that did not fire this beat.
- EDGE CONTRACT: SINGLE PLACEMENT.

## D. WHEN
- ACT: 1
- BEST TIME: both, **and at night it is the brightest thing on the screen**,
  which is the one moment the fight lights itself. That is a genuine
  LIGHT=TERRITORY moment and worth the extra variant.
- WEATHER STATES: unchanged by weather. It happens too fast.
- LIT/UNLIT variant: it IS the light.
- ANIMATION: **a loop, and its length is already law.** The demo's flash life is
  0.09s, and every visual duration in this lane is quantised to
  `BohemiaFreeze.note(d) = BEAT * (4/d)` at BEAT=0.5s, 120 BPM. A 16th note is
  0.125s, and `LEGAL=[1,2,4,8,16,32]` means a 32nd is 0.0625s. **3 to 4 frames
  landing on a 32nd or a 16th.** Whichever it is, it must be one of the legal
  notes: EVERY DURATION IS A NOTE
  (laws/BOHEMIA_ADDENDUM_EVERY_DURATION_IS_A_NOTE_7_27_26.md).

## E. HOW
- EXACT SIZE: authored at the human sprite's scale (the rig is the ruler, not
  the 44px tile grid, because this hangs off a body). Four sizes matching the
  existing per-weapon barrel offsets: pistol smallest, then shotgun, smg,
  rifle largest.
- VIEW: 45-degree world view, and this one is a genuine puzzle worth stating:
  a flash seen from behind-and-above is a STAR, and seen from the side is a
  CONE. The field draws bodies at 8 bearings, so the flash needs at minimum a
  toward-viewer form and an across-viewer form; the code already knows the angle
  and can pick.
- PALETTE: constitution ceiling. **This is one of the few objects permitted to
  sit at the very top of the value range**, because it is a light source. It
  must NOT be orange-brown: this lane spent five turns hunting a persistent
  orange wash Paolo hated, and the answer is that a muzzle flash is WHITE-HOT at
  the core with a thin warm edge, never a warm blob.
- LIGHT: it is the light. The one global direction does not apply to a self-lit
  object, but everything it lights must respect it.
- SHADOWS: none, obviously. If it ever casts light on the shooter that is a
  separate pass and a separate ask.
- SCALE ANCHORS: the barrel length on the canon rig's held weapon. The flash is
  roughly as long as the barrel for a pistol and shorter in proportion for a
  rifle, which is real and reads.
- WEAR LEVEL: n/a.
- VARIANTS: 2 orientations (toward viewer, across viewer) x 4 weapon sizes.
  Colorways are not a thing here.

## F. THE CAPTION
```json
{
  "id": "TF-CMB-007",
  "name": "muzzle flash",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "any, brightest at night",
  "best_location": "at the barrel exit point of a weapon that fired this beat, at the firing angle",
  "place_next_to": ["the barrel end"],
  "never_next_to": ["anything detached from a gun", "a weapon that did not fire"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": {"frames": 4, "note": 32, "beats": 0.125, "bpm": 120},
  "tags": ["fx", "combat", "muzzle", "self-lit", "directional", "quantised"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: `o_fx_spark_burst_06` and `o_fx_smoke_puff_01` from the
  approved PARTICLE_LOOP_BANK. **These two ship WITH this flash and are reuse,
  not cooks**: the flash is the new frame, the smoke and sparks around it
  already exist and should be wired the same turn.
- NAMED OUTSIDE REFERENCE: **Hotline Miami** for a muzzle flash that is a
  single hard white-hot shape lasting one or two frames in a top-down game, and
  which reads as violence precisely because it is short and bright rather than
  big and orange. **Nuclear Throne** for the discipline that fx frames stay
  under a handful and never smear.
- REAL-WORLD GROUNDING: a real muzzle flash is burning propellant gas leaving
  the barrel. It is white to pale yellow at the core, not orange; it is
  directional and asymmetric (a star or a cone depending on where you stand);
  and at normal camera speeds it exists for a few thousandths of a second, which
  is why it should feel like a stamp and not a burn. A shotgun and a rifle throw
  visibly bigger flashes than a pistol because there is more powder, which is
  why the four sizes are real and not decoration.

## H. DON'T WANT
- **NOT orange.** This lane has a five-turn history with an orange wash Paolo
  hated and this object is the most likely place to reintroduce it. White-hot
  core, thin warm edge, gone.
- NOT a fireball. `flame_burst` is radially symmetric and this is directional.
- NOT long. If it lingers past its note it stops reading as a shot.
- NOT the same size for every weapon.
- NOT detached from the gun, ever.
- NOT drawn during a freeze. A pinned clock does not stop a drawing, it welds it
  on at its brightest, and this lane has now fixed that exact bug four separate
  times (laws/BOHEMIA_ADDENDUM_THE_PAUSE_IS_EMPTY_7_27_26.md). The flash must be
  gated on the freeze like everything else.

## I. ACCEPTANCE
- [ ] the frame duration is a LEGAL NOTE (`BohemiaFreeze.note`, one of
      1/2/4/8/16/32), asserted by the gate, not eyeballed
- [ ] freeze proof: during a kill freeze the flash is NOT on screen
- [ ] palette ceiling green; measured NOT orange-dominant at the core
- [ ] four weapon sizes measured distinct
- [ ] both orientations render correctly at the 8 body bearings
- [ ] ON THE REAL SURFACE: screenshot at the real firing moment, at night and by
      day, beside the current code-drawn triangle
- [ ] the approved smoke and spark clips are WIRED in the same delivery, so the
      bank stops having zero consumers
- [ ] caption JSON parses and matches sections C and D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: COMBAT lane | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 56 | VERDICT: —
- LANE NOTE: this is COMBAT FX and it is NOT the character animation revamp
  running in another session. It touches no rig, no pose, no clip, no BAKED
  pose. ONE SYSTEM, ONE SESSION is intact.

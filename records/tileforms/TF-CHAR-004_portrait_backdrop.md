# TILE FORM TF-CHAR-004 — PORTRAIT BACKDROP (what sits behind the face in the
# portrait disc)

## A. IDENTITY
- NAME: Portrait backdrop (the surface behind a head in the round portrait)
- FAMILY/SET: standalone
- THE JOB, ONE SENTENCE: this tile exists so that a face in the portrait disc
  is read against something, instead of being cut out and pasted on a flat
  brown hole.

## B. WHY
- DEMANDED BY: VERIFY ON THE REAL SURFACE (7/18) applied to the FACE. The
  portrait is the surface Paolo taps to judge and edit a face ("tap portrait
  to edit face"), and it is also the face's only presentation anywhere in the
  game, so it is the surface every facial verdict is made on.
- WHAT LOOKS BROKEN TODAY: **measured — it is one flat CSS colour.**
  `#portraitCv{...background:#12100c;...}`. A very dark brown disc behind a
  pale face. Two consequences: the face has maximum contrast against the
  background so every skin verdict is taken under a lighting situation that
  exists nowhere in the game; and the hair, which is near-white
  (`hair/curtain-bob` ramp tops at 237,232,220), floats on black with no
  material behind it to sit in.
- SHOPPING CHECK: `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`:
  - INTERIOR POOL (465 UP, 12 room buckets) — the strongest candidate, and
    genuinely re-usable if the art lane crops a quiet wall bucket. Why it does
    not close the form as-is: those tiles are authored at world tile scale for
    a receding 45-degree floor/wall, and the portrait is a FLAT head-on disc
    at a different scale — dropping one in unchanged puts a perspective wall
    behind a straight-on face. Named here so the art lane can reuse its
    values and material rather than cook from nothing.
  - HOUSE SKINS (30/30 UP) — exterior wall art, same scale/perspective
    mismatch, plus it reads as a specific house.
  - STARTER TILESET (42, CBB) — frozen, md5-locked to RUN, and world-scaled.
  - GORE OVERLAYS — no.
  - Nothing in the index is a portrait-scale backdrop. Confirmed gap.

## C. WHERE
- SURFACE + TAB: CHARACTER tab, the portrait disc (`#portraitCv`, 120x120
  display). Also wherever a portrait is later used to show a person (dialogue
  and the cast bridge are the obvious future consumers, which is an argument
  for it being a real asset and not a CSS colour).
- DISTRICT FAMILIES: none — it is a UI presentation surface, not a place.
- LAYER: structure (it is a wall behind a person)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: the portrait disc's own border (`2px solid #2e2416`) and
  nothing else; it is clipped to a circle.
- NEVER BESIDE: any world surface. It must never leak into RUN or CITY, and
  no district may adopt it.
- EDGE CONTRACT: SINGLE PLACEMENT — it is clipped to a 120px circle and never
  repeats. (Explicitly NOT seamless: nothing tiles inside a disc, and building
  it seamless would waste the art lane's time.)

## D. WHEN
- ACT: 1
- BEST TIME: day default. A night state is genuinely wanted later, because a
  face lit by the 12% owned light is a different face, but it is NOT required
  for this form to ship and should not hold it up.
- WEATHER STATES: none — it is indoors/abstract and weather never reaches it.
- LIT/UNLIT variant needed? Not for v1. See BEST TIME.
- ANIMATION: static. A moving portrait background would fight the face, which
  is the only thing being judged.

## E. HOW
- EXACT SIZE in px: authored to fill a 120x120 disc with a little bleed
  (~132x132) so the circular clip never shows a corner. Authored at 1x —
  this is a UI surface, so it must not be a resampled world tile.
- VIEW: **head-on flat**, and this is the one deliberate exception to the
  45-degree read that must be stated out loud: the portrait is a straight-on
  bust, so its backdrop is a flat far wall with no receding floor. It is a
  backdrop, not a location — the 45 DEGREE ART LAW governs objects in the
  world, and putting a receding floor behind a head-on face is what would
  actually look wrong. Flagging it here so the art lane does not get bounced.
- PALETTE: constitution ceiling; the STRUCTURE value band, chosen MID. The
  whole point is to come up off `#12100c` so the face is not floating on
  near-black, while staying clearly darker than the palest skin (224,211,203)
  and clearly separated from the near-white hair (237,232,220).
- LIGHT: the one global direction, gently — a slight fall-off away from the
  light so the disc has some form. NO keyline. NO dither.
- SHADOWS: none baked. A soft contact shade where the head meets the backdrop
  is allowed and wanted, since that is what stops the head reading as a cutout.
- SCALE ANCHORS: the head itself (the canon head is ~10px wide in sprite
  space, blown up in the disc) — any material texture must be scaled to the
  HEAD, not to the world grid, or it will read as a giant wall behind a tiny
  person.
- WEAR LEVEL: dead world, quiet. Chalked stucco with faint staining. Same
  restraint as the stage (TF-CHAR-002): present, never busy.
- VARIANTS: one. A night variant later is a colorway, not a new form.

## F. THE CAPTION
```json
{
  "id": "TF-CHAR-004",
  "name": "portrait backdrop",
  "layer": "structure",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "day; a night colorway is wanted later but not required",
  "best_location": "behind a head in the portrait disc, CHARACTER tab and any future dialogue portrait",
  "place_next_to": ["the portrait disc border"],
  "never_next_to": ["any RUN or CITY surface", "any district material"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["character", "portrait", "ui-surface", "backdrop", "not-world", "head-on"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the CHARACTER STAGE (TF-CHAR-002) — these two are the same
  room seen two ways, and they must share a material and a value family or
  the tab will look like two different games. Value anchor is the frozen CBB
  target screen's structure band.
- NAMED OUTSIDE REFERENCE: **Disco Elysium**'s portrait treatment — a
  desaturated, textured, mid-value ground behind the face that gives the head
  somewhere to sit without ever pulling focus. For the pixel execution
  specifically, **Papers, Please** — flat, grim, low-saturation portrait
  backgrounds that read as a real wall at tiny scale with almost no detail.
- REAL-WORLD GROUNDING: the same Las Vegas tan-stucco-over-CMU wall the stage
  is built from, seen close. Researched detail at this range: sun-chalked
  stucco is not a flat colour up close — UV powders the surface so it reads
  as a fine, slightly uneven pale grain, and decades of that leaves a
  mottled, bleached surface rather than a clean one. That fine mottle is
  exactly the amount of texture a portrait backdrop wants: visible as
  material, invisible as pattern.

## H. DON'T WANT
- **NOT near-black.** That is the thing being replaced. A face on black is a
  cutout, and it makes every skin verdict a lie.
- **NOT a vignette.** A darkened rim is a UI effect, not a wall, and it fakes
  depth the constitution wants earned by value.
- **NOT a gradient.** Same reason the stage rejects one: a smooth ramp is not
  a material, and it is the current failure on the preview canvas.
- **NOT busy, NOT patterned.** Any repeating motif behind a face at this size
  reads as wallpaper and steals the eye. Material, not pattern.
- **NOT purple** (PURPLE RESERVATION — the Amalgamation's alone).
- **NOT a receding 45-degree floor.** Stated as an anti-reference precisely
  because the law says the opposite everywhere else — see VIEW. A floor
  plane behind a head-on bust is the failure mode here.
- **NOT high-saturation.** The face is the only warm thing in the disc.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT, clipped to a circle)
- [ ] Palette ceiling + structure value band + one-light checks green; no
      dither; purity sweep clean (no purple)
- [ ] CONTRAST PROOF: the canon face's palest skin (224,211,203) AND the
      curtain-bob's near-white hair (237,232,220) both measured as separable
      against the backdrop. The hair is the harder case and is the one that
      decides the value.
- [ ] Squint test: at the 120px display size it must read as a WALL, not as a
      texture swatch and not as a blur
- [ ] 3x3 TILED PROOF: n/a — instead, the disc rendered with three different
      skin tones and both hair colorways, proving it works for the cast and
      not just for Paolo's own character
- [ ] ON THE REAL SURFACE: screenshot of the actual CHARACTER tab portrait
      wearing it, beside the current flat `#12100c` for contrast
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: CHARACTER lane | DATE: 7/28/26 | PRIORITY: LOW
- BOARD ROW #: 13 | VERDICT: —

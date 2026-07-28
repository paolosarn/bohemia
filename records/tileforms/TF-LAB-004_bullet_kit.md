# TILE FORM TF-LAB-004 — THE BULLET KIT (what the companion lays out)

## A. IDENTITY
- NAME: The bullet kit — instruments laid out on a cloth, for the thing you
  cannot do to yourself
- FAMILY/SET: CAMP FIRST AID set. Distinct silhouette from TF-LAB-003 (a laid-
  out spread, not a soft roll), so it is its own form per rule 1.
- THE JOB, ONE SENTENCE: this tile exists so that the first thing a companion
  is ever mechanically FOR — digging a bullet out of you — has a visible scene
  at the camp instead of being a button that changes a number.

## B. WHY
- DEMANDED BY: laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md clause 8,
  Paolo 7/27/26: "a place a companion can pull out a bullet from your body."
  That clause is recorded in the law as THE FIRST RULED MECHANICAL ROLE FOR A
  COMPANION in the whole game, and it is gate-locked (camp_dial_gate B30/B31:
  alone you cannot, with a companion you can). Clause 15 makes a serious wound
  the rare case that actually sends you to camp, so this is the payoff prop for
  the rarest and most memorable camp visit.
- WHAT LOOKS BROKEN TODAY: the moment currently renders as a text button reading
  "have the bullet pulled out (companion)" and an 11x17px blue rectangle beside
  the fire standing in for the companion. The single most dramatic beat the
  survival system has is two boxes and a sentence.
- SHOPPING CHECK (index, then banks, then all 87 pack names):
  * NO MEDICAL PACK EXISTS IN THE APPROVED CORPUS (enumerated: zero packs match
    medic/hospital/clinic/pharm/chem in
    banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt). Same total gap as TF-LAB-003.
  * "14. Trash and junk props" (14 UP) and "7. Trash and debris" (20 UP) — the
    nearest thing to "small metal objects on the ground" in the corpus. Checked
    and disqualified: junk is drawn to read as WORTHLESS at a glance, which is
    the exact opposite of what this prop must communicate (deliberate, cared
    for, laid out in order). Reusing junk here would make the scene read as
    litter next to a wounded person.
  * GORE OVERLAYS (20 UP) — the wound, not the instruments; this prop is
    authored to sit beside them.
  * INTERIOR POOL (465 UP, 12 buckets) — no medical bucket; kitchen/tool props
    are the near-miss and a kitchen knife on a rag is a DIFFERENT and worse
    read than instruments (it says butchery, not treatment).
  Total gap.

## C. WHERE
- SURFACE + TAB: RUN, at the camp, during the treatment. Also friendly-shelter
  interiors (clause 13: same verbs under a real roof). No CITY or MAP presence.
- DISTRICT FAMILIES: all, via the camp.
- LAYER: prop
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: the deployed camp (TF-LAB-001) — it is laid out AT it; the
  dressings (TF-LAB-003) which are used in the same scene; the COMPANION
  standing/kneeling over it (that figure is CHARACTER/ANIMATION's ask, not
  this form's — flagged, not requested here); an approved gore overlay for the
  wound itself; the approved firelight, because in Act 1 this happens by the
  fire or it happens in the dark.
- NEVER BESIDE: the supply pool's ration containers (medical is not in the
  clumped pool per clause 4); anything that makes it read as a workbench or a
  crafting station — Bohemia has NO food crafting by clause 4 and this must not
  smuggle a crafting surface in through the medical door.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats. One authored spread.

## D. WHEN
- ACT: 1
- BEST TIME: both, but its true home is NIGHT AT A LIT CAMP — by clause 13 Act 1
  has almost nowhere friendly, so being shot means this happens in the dark
  beside your own fire. Author it to be judged in firelight.
- WEATHER STATES: sunny baseline; cloudy no change; RAIN — instruments bead and
  the cloth they sit on darkens and clings, which is a good grim note.
- LIT/UNLIT: no self-light, but METAL IS THE POINT: this is the one prop at the
  camp with specular metal, so the catch-lit variant against the approved fire
  loops is where it earns its keep.
- ANIMATION: static. The treatment's motion is the companion's animation, not
  this prop's. Leaf-pixel law would apply if anything moved, and nothing should.

## E. HOW
- EXACT SIZE: about one tile as a laid-out spread (the cloth is the footprint,
  the instruments sit on it), authored at starter-set native px.
- VIEW: 45-degree world view (law). The cloth is a flat plane showing its
  sky-lit top; the instruments are small cylinders and blades ON that plane and
  get the ellipse treatment where round (the blessed lamp bank is the
  reference). NEVER a flat side-on layout diagram.
- PALETTE: constitution ceiling; PROP value band. The cloth sits mid-band; the
  instruments are the brightest specular hits in the scene, which is how a
  handful of small metal things read as important without a single glow.
- LIGHT: the one global direction. NO keyline. NO dither.
- SHADOWS: none baked; tight contact shadows under each instrument from the
  separate pass — that is what will make them sit ON the cloth rather than float.
- SCALE ANCHORS: a human hand (rig). Instruments are finger-length. The whole
  spread is smaller than a bedroll and much smaller than the 2-tile door.
- WEAR LEVEL: the instruments are CLEAN AND OLD — scrubbed, scratched, boiled
  many times, not sterile-new and not rusty. Rust would say "this will kill
  you"; factory-new would break the dead world. The cloth is stained and
  laundered. This register is the tile's whole meaning: somebody keeps these
  ready for you.
- VARIANTS: (1) laid out ready, (2) used — one instrument moved, cloth marked,
  the bullet itself sitting on it. Two states of one job. The bullet on the
  cloth is the trophy of the scene and should read at a glance.

## F. THE CAPTION
```json
{
  "id": "TF-LAB-004",
  "name": "bullet kit",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": ["all", "camp", "friendly-interiors"],
  "best_time": "night",
  "best_location": "laid out at the deployed camp when a companion treats a serious wound",
  "place_next_to": ["camp deployed", "field dressings", "gore overlays", "campfire loop (approved bank)", "companion figure"],
  "never_next_to": ["supply pool rations", "any crafting or workbench surface"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "SINGLE PLACEMENT",
  "anim": null,
  "tags": ["medical", "companion-only", "bullet", "treatment", "camp", "night", "specular-metal"]
}
```

## G. REFERENCES
- APPROVED ANCHOR: the approved campfire/cookfire loops
  (banks/BOHEMIA_FIRE_FLICKER_BANK_7_13_26.txt) — this prop is authored to be
  judged in their light, since firelight on metal is the entire visual idea.
  Plus the approved gore overlays for the wound in the same scene, and the
  blessed lamp bank for how metal cylinders are drawn at 45 degrees here.
- NAMED OUTSIDE REFERENCE: Red Dead Redemption 2's field-medicine and camp
  scenes for one thing — a small deliberate arrangement of objects on cloth
  reads as CARE, and care is what makes a violent moment land. Take the
  arrangement logic, not its photoreal materials. Second: Darkest Dungeon's
  sanitarium props for how a tiny 2D medical spread stays legible at small size
  by using silhouette instead of detail.
- REAL-WORLD GROUNDING (researched 7/28): what real field bullet removal
  actually needs is small and unglamorous — forceps or a haemostat, a scalpel or
  blade, tweezers, a probe, and the same rolled cotton gauze from TF-LAB-003 to
  pack the wound afterwards, all laid on a clean cloth because a flat sterile
  field is the whole technique. Las Vegas grounding: this happens in a camp in a
  drainage wash or storm tunnel, which is where the real Vegas camps are, and
  those are places with dust and no running water — so the cloth is the only
  clean surface available and the boiled-not-sterile register is the truthful
  one. The instruments are the kind of thing looted from a clinic or a casino
  EMT station years ago and kept because they do not wear out.
  Sources: North American Rescue / first-aid-product.com (wound packing gauze,
  trauma dressing practice); reviewjournal.com and newsnationnow.com for the
  Vegas tunnel and drainage-canal camp conditions.

## H. DON'T WANT
- NOT a surgical tray from a hospital drama. No stainless kidney dish, no blue
  paper drape, no operating-theatre cleanliness.
- NOT a torture-kit read. Grimy pliers and a hacksaw would make the companion a
  threat instead of the person keeping you alive, which inverts clause 8.
- NOT rusty. Rust reads as tetanus and makes the treatment look like a mistake.
- NOT a crafting bench, a workbench, or anything with a recipe UI logic to it —
  clause 4 killed crafting and this must not reintroduce it visually.
- NOT an inventory-icon product shot (no rim light, no slot shadow).
- NOT green, NOT purple (PURPLE RESERVATION), NOT flat side-on (45 DEGREE LAW).
- NOT so detailed it becomes noise at walk zoom — silhouette first, per the
  Darkest Dungeon note. Five readable objects beat fifteen unreadable ones.

## I. ACCEPTANCE
- [ ] Seam measured: n/a (SINGLE PLACEMENT)
- [ ] Palette ceiling + PROP band + one-light green; purity sweep clean; the
      used variant's red checked against the approved gore bank
- [ ] Squint test: at walk zoom the spread reads as a deliberate arrangement,
      not as scattered junk — if it reads as litter it has failed, and the
      approved junk packs are the control to compare against
- [ ] 3x3 tiled proof: n/a — instead the TWO-STATE PAIR (ready, used with the
      bullet on the cloth) at 1x
- [ ] ON THE REAL SURFACE: at the deployed camp at NIGHT with the approved
      campfire loop lit, beside TF-LAB-003 and an approved gore overlay — the
      whole treatment scene in one frame, which is the only way this prop can be
      honestly judged
- [ ] Caption JSON parses and matches C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: LAB (mobile camp law clause 8, the companion's
  first ruled mechanical role) | DATE: 7/28/26 | PRIORITY: MED
- BOARD ROW #: 82 | VERDICT: —

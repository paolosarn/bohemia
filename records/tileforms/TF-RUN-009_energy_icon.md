# TILE FORM TF-RUN-009 — THE ENERGY ICON (jerrycan + AA battery + lightning bolt, ONE mark)

## A. IDENTITY
- NAME (plain words a person would say): The energy icon — a jerrycan, an AA
  battery and a lightning bolt, drawn as one thing
- FAMILY/SET: THE THREE CURRENCY MARKS (TF-RUN-008/009/010). Judged together;
  they must not be confusable.
- THE JOB, ONE SENTENCE: this tile exists so the player can tell at thumb size
  how much *stored power* the dynasty has, in a city where only 12% of the
  lights are on and light is territory.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: `laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26.md`
  (Paolo 7/28, LOCKED — his pick, and his rule that the parts combine into one
  mark), implementing the ELECTRICITY currency of
  `THREE_CURRENCIES_CENTURY_7_26_26`.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: no energy readout exists. This is the
  currency most tied to the game's own emotional core — CLUSTERED POWER (12%
  lit), LIGHT=TERRITORY, `bohemia_powergrid`, the substation/solar/battery
  districts that are already generated — and it has no face at all.
- SHOPPING CHECK (`records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`): walked.
  **The approved corpus contains no UI icons of any kind** — it is all world
  art. The LAMP DARK VARIANTS bank (7 approved) is the nearest thing in spirit
  (a manufactured object about light) but it is a world prop drawn at world
  scale, not a mark. Genuine hole.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: the PHONE (Wallet, and any power cost), the city builder's
  build costs, and any world readout of a lit/owned block.
- DISTRICT FAMILIES: n/a — UI layer. (Though it is *about* solar, substation,
  battery and every lit block.)
- LAYER: prop (UI overlay; never on the world grid)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: a number; the other two currency marks.
- NEVER BESIDE: itself repeated as a count; world tiles.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, never tiles.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1, and unchanged across all three acts.
- BEST TIME: any. UI is not lit by the world.
- WEATHER STATES: n/a.
- LIT/UNLIT variant needed? A **dimmed/insufficient** colorway, same as the
  others. **AND A DELIBERATE WARNING:** the temptation to make this one GLOW,
  because it is the electricity icon, is enormous and it is BANNED — the act-1
  glow ceiling is measured (`max_hot_frac` in the visual constitution) and
  "act 1 windows are DEAD DARK GLASS. Never..." is the constitution's own line.
  The energy mark says *stored*, not *switched on*.
- ANIMATION: static. No sparks, no pulse, no flicker in this form.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: reads at **32px**, holds at 2x/3x. Square.
- VIEW: UI layer, but drawn in the same attitude as the world art so the game
  looks like one game.
- PALETTE: constitution ceiling. Must read against dark phone chrome AND the
  pale desert HUD.
- LIGHT: one direction, matching the world's. NO black keyline. NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: the three parts are wildly different real sizes (a jerrycan is
  waist-high, an AA battery fits in a palm, a bolt has no size at all). That is
  a composition problem, not a realism problem — see the rule below.
- WEAR LEVEL: dead world. The jerrycan is dented and its paint is chalked (Vegas
  sun bleaches, it does not rust); the battery is a scavenged cell, not a fresh
  one. Wear is a hint, not the subject.
- VARIANTS: the mark, plus a dimmed/can't-afford colorway.

### THE COMPOSITION RULE (the part that decides whether this works)
- **ONE SILHOUETTE**, composed by overlap/union so the outer edge is a single
  shape.
- **ONE DOMINANT PART, TWO SUPPORTING.** Recommended (art lane may argue): the
  **jerrycan** is the dominant mass — it has the strongest, most unmistakable
  outline of the three (the asymmetric handle-and-spout profile) — with the
  **lightning bolt** cutting across or through it and the **AA battery** small
  at the base. One big rectangle-ish mass, one zigzag, one small cylinder.
- **THE BOLT IS THE ONE TO WATCH.** A lightning bolt is a high-frequency zigzag:
  it is the single part most likely to turn to mush at 32px, and the part most
  likely to dominate everything else if drawn too large. It should be a
  *decisive accent*, not the subject — the subject is the container.
- **WATCH THE COLLISION WITH RESOURCES:** the jerrycan is a hard-edged container
  and so is nothing in the resources mark — good. But an AA battery is a small
  cylinder and a **tin can is also a small cylinder**; tin can is NOT in the
  resources mark, so this collision is avoided by his pick. Do not reintroduce
  it.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-009",
  "name": "energy currency mark",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "any",
  "best_location": "UI only — the Wallet app, power costs, lit-block readouts; never on the world grid",
  "place_next_to": ["a quantity number", "the resources mark", "the clout mark"],
  "never_next_to": ["itself repeated as a count", "world ground tiles"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["ui", "icon", "currency", "energy", "electricity", "composite-mark", "jerrycan", "aa-battery", "lightning-bolt", "no-glow"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: none exists (first UI art in the game) — the anchor is the
  frozen visual constitution: palette ceiling, value bands, one light, no
  keyline, and specifically the **glow ceiling**, which this icon is the most
  likely in the game to break.
- NAMED OUTSIDE REFERENCE: the **standardized electrical bolt** itself — the
  zigzag was fixed as the international electricity mark in the early 20th
  century and carries the sky-god weight that makes it read *before* you think.
  That is why it is in the mark and why it must not be the whole mark.
  **Fallout**'s energy-cell iconography for scavenged power as a physical object
  you carry rather than an abstract meter.
- REAL-WORLD GROUNDING: in a valley whose grid has been down for a decade,
  energy is not "electricity" in the abstract — it is **things you carry that
  hold a charge or a burn.** A **jerrycan** is the NATO-pattern fuel can,
  ubiquitous in the American southwest for generators and hauling; in Vegas sun
  its paint chalks matte rather than rusting through. An **AA cell** is the
  scavenger's real currency — flashlights, radios, anything small. The **bolt**
  is what the surviving grid does when it is briefly alive. Together they are
  precisely what "energy" means to a household in Bohemia: fuel, cells, and the
  rare live circuit.

## H. DON'T WANT (the anti-reference)
- **NOT GLOWING.** The most likely failure and the one that breaks a measured
  law. No emissive, no bloom, no hot pixels.
- NOT purple (Amalgamation reservation) — and "electric purple" is the single
  most common palette instinct for an energy icon, so this is a live risk.
- NOT three separate icons in a row. He ruled ONE mark.
- NOT bolt-dominant. If the lightning bolt eats the composition, this becomes
  the generic power symbol every game already has and his other two picks were
  pointless.
- NOT a black keyline.
- NOT clean/new. Scavenged, chalked, dented.
- NOT rusted-through — wrong climate. Vegas bleaches metal, it does not rot it.

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] **THE SOLID-BLACK TEST:** filled solid black, it is still recognisably
      ENERGY and not confusable with the other two marks. The gate that decides
      this form.
- [ ] Readable at 32px, verified by rendering at 32/64/96 and looking
- [ ] **GLOW CEILING GREEN** — measured, not assumed. This icon is the most
      likely in the game to break it.
- [ ] PURITY GREEN — no purple.
- [ ] Palette ceiling + one-light + NO-KEYLINE + no-dither checks green
- [ ] The bolt still reads as a bolt at 32px and has NOT become a smear
- [ ] Shown ON THE REAL SURFACE: in the Wallet app at true phone size, beside
      its number, in a row with the other two marks
- [ ] THE ROW TEST: three marks side by side at 32px, nameable without labels
- [ ] Dimmed/can't-afford colorway rendered beside the normal one
- [ ] Caption JSON parses and matches sections C/D

## NOTE (WORLD lane, 7/29): the caption said acts [1,2,3] while section D of this same
form says "ACT: 1". The caption is the machine-readable half and tileform_gate reads it,
so main went red on all three currency-icon forms. Set to [1] to AGREE WITH YOUR OWN
SECTION D -- your design note that the currency survives all three acts unchanged is
untouched and still in D. If you want the caption to span acts, that needs a cited Paolo
ruling, because ACT ONE ONLY is locked (laws/BOHEMIA_ADDENDUM_EVERY_DISTRICT_IS_A_LANDMARK_7_28_26.md).

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: Paolo direct (7/28 pick + composition ruling)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 100 | VERDICT: —

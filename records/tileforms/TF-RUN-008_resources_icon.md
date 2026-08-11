# TILE FORM TF-RUN-008 — THE RESOURCES ICON (apple + hammer + duct tape, ONE mark)

## A. IDENTITY
- NAME (plain words a person would say): The resources icon — an apple, a
  hammer and a roll of duct tape, drawn as one thing
- FAMILY/SET: THE THREE CURRENCY MARKS (TF-RUN-008/009/010). One drawing job in
  three parts; they are judged together because they must not be confusable.
- THE JOB, ONE SENTENCE: this tile exists so the player can tell, at a glance
  and at thumb size, how much *stuff to live on and build with* the dynasty has.

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY: `laws/BOHEMIA_ADDENDUM_COMBINED_CURRENCY_ICONS_7_28_26.md`
  (Paolo 7/28, LOCKED, his pick and his composition rule: *"the point of my
  picks is they combine into one icon"*), which closes the `[PENDING]` third
  sub-icon in `THREE_CURRENCIES_CENTURY_7_26_26`.
- WHAT LOOKS BROKEN TODAY WITHOUT IT: there is no resources icon anywhere in the
  game. The WALLET app exists as a tile with nothing to show, and the whole
  100-year city-builder economy — buildings produce resources — has no readout.
  Three currencies were locked on 7/26 and none of them has a face.
- SHOPPING CHECK (`records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md`): walked for
  anything icon-shaped. The corpus is WORLD art — house skins, perimeter walls,
  door clips, markings, lamps, fire loops, gore overlays, the interior pool,
  desert/terrain, street pools, seam-fixed surfaces, the starter tileset,
  wardrobe. **There is not a single UI icon in the approved corpus.** The
  markings bank is road paint (arrows, lane lines), not iconography. Genuine
  hole, and the first of its kind — this is the game's first UI-layer art.

## C. WHERE (place — the game code reads this)
- SURFACE + TAB: the PHONE (Wallet app, and any app that shows a cost), the
  city-builder's build costs, and any world-surface pickup readout. It is UI, so
  it never sits in the world grid.
- DISTRICT FAMILIES: n/a — UI layer.
- LAYER: prop (UI overlay; it is not a world tile and must never be placed on
  the ground)
- SOLID? no — ENTERABLE? no
- MUST SIT BESIDE: a number (always — an icon with no quantity is meaningless
  here), and the other two currency marks in a row of three.
- NEVER BESIDE: itself repeated as a quantity (three apples never means "3
  resources" — the number does that); world tiles.
- EDGE CONTRACT: SINGLE PLACEMENT — never repeats, never tiles.

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1 (and it must survive all three acts unchanged — the currency does not
  change when the city rebuilds, only the amount does)
- BEST TIME: any. UI is not lit by the world.
- WEATHER STATES: n/a (UI layer, unaffected).
- LIT/UNLIT variant needed? No. But it needs a **dimmed/insufficient state** —
  when you cannot afford something, this mark greys. That is a colorway, not a
  new form.
- ANIMATION: static by default. A one-shot pulse on gain/spend is wanted
  eventually and is NOT part of this form.

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px: authored so it reads at **32px** (the research floor for a
  status icon) and holds up at 2x and 3x on a phone. Square.
- VIEW: this is UI, so the 45-DEGREE ART LAW does not bind it the way it binds
  world tiles — BUT the three objects should be drawn in the same
  three-quarter-ish attitude the game's world art uses, so the UI and the world
  look like one game rather than two.
- PALETTE: constitution ceiling. This is the first UI art in the game, so it
  sets the precedent: it should read against BOTH the dark phone chrome and the
  pale desert HUD.
- LIGHT: one direction, consistent with the world's. NO black keyline (the
  constitution's rule — and the temptation on an icon is enormous). NO dither.
- SHADOWS: none baked.
- SCALE ANCHORS: **relative size between the parts is the whole composition.**
  A hammer is much bigger than an apple in life; in the mark, one part must
  dominate and the others resolve it (see the composition rule below).
- WEAR LEVEL: this is a dead world and these are scavenged goods. The tape roll
  is part-used, the hammer's handle is worn, the apple is real food in a place
  that struggles for it — but the icon must stay CLEAN enough to read. Wear is a
  hint, not the subject.
- VARIANTS: the mark, plus a dimmed/can't-afford colorway.

### THE COMPOSITION RULE (the part that decides whether this works)
His ruling is that the parts **combine into one icon**. The craft answer, from
the icon research:
- **The three parts make ONE SILHOUETTE**, composed by overlap/union so the
  outer edge is a single memorable shape — not three drawings sitting near each
  other.
- **ONE DOMINANT PART, TWO SUPPORTING.** A three-way equal split is clutter.
  Recommended (art lane may argue): the **duct tape roll** is the dominant
  shape — it is the strongest, most unmistakable silhouette of the three (a ring
  with a core) — with the **hammer** crossing behind it on the diagonal and the
  **apple** nested at the base. That gives one round mass, one diagonal, one
  small round: three different primitives, one outline.
- **THE PARTS MUST BE DIFFERENT PRIMITIVES**, which his pick already satisfies:
  apple = circle, hammer = long diagonal with a head, tape = ring.

## F. THE CAPTION (ships with the tile — machine-readable)
```json
{
  "id": "TF-RUN-008",
  "name": "resources currency mark",
  "layer": "prop",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "any",
  "best_location": "UI only — the Wallet app, build costs, pickup readouts; never on the world grid",
  "place_next_to": ["a quantity number", "the energy mark", "the clout mark"],
  "never_next_to": ["itself repeated as a count", "world ground tiles"],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "single placement",
  "anim": null,
  "tags": ["ui", "icon", "currency", "resources", "composite-mark", "apple", "hammer", "duct-tape"]
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR: none exists — this is the game's FIRST UI icon, so the anchor
  is the frozen visual constitution itself (palette ceiling, value bands, one
  light, no keyline) rather than a corpus item. That is stated plainly because a
  form that claims a false anchor is worse than one that admits there is none.
- NAMED OUTSIDE REFERENCE: **Metro**'s materials icon (a wrench and a bolt read
  as one mark) is the closest working precedent for "two tools, one symbol" —
  take the composition, not the objects. **Don't Starve** for icons that carry
  heavy wear and personality while still reading at HUD size. Heraldry
  generally for the Boolean-union approach: several charges, one shield-shaped
  outline.
- REAL-WORLD GROUNDING: this is the honest inventory of a Las Vegas household
  ten years after the money stopped. **Duct tape** is the actual repair material
  of the American southwest — it is in every garage in the valley and it is what
  you fix a swamp cooler, a window and a boot with when nothing is being
  manufactured. **A hammer** is the one tool that never stops working (no
  power, no fuel, no parts). **An apple** is the hard one and the most
  meaningful: real fresh food in a dead-irrigation desert is genuinely
  precious, which is exactly why it is the right symbol for "resources" and
  not a joke. Vegas imports essentially all its food; a valley that can produce
  an apple again has rebuilt something.

## H. DON'T WANT (the anti-reference)
- NOT three separate icons in a row. He ruled ONE mark. If it reads as a
  shopping list it has failed.
- NOT a wrench. He said hammer. (My own option list offered wrench+bolt and he
  overrode it — nobody substitutes it back.)
- NOT a black keyline around the mark, however tempting on UI art.
- NOT clean/new/shiny. These are scavenged objects in a dead world.
- NOT so worn it stops reading — wear is a hint, the shape is the job.
- NOT a spreadsheet feel: his named anti-reference for the whole currency system
  is *"spreadsheet simulators and I'm not a fan."* This mark should feel like a
  thing you'd hold, not a data label.
- NOT purple (Amalgamation reservation). NOT glowing (act-1 glow ceiling).

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] **THE SOLID-BLACK TEST:** fill the icon solid black. It must still be
      recognisable as RESOURCES and not confusable with the energy or clout
      mark. If the blob is a lump, the composition failed regardless of how
      good the parts look. This is the single gate that decides this form.
- [ ] Readable at 32px, verified by rendering at 32/64/96 and looking
- [ ] Palette ceiling + one-light + NO-KEYLINE + no-dither checks green
- [ ] Purity (no purple) + glow ceiling green
- [ ] Shown ON THE REAL SURFACE: in the Wallet app at true phone size, beside
      its number, in a row with the other two marks
- [ ] THE ROW TEST: the three currency marks side by side at 32px, and a person
      can name which is which without a label
- [ ] Dimmed/can't-afford colorway rendered beside the normal one
- [ ] Caption JSON parses and matches sections C/D

## NOTE (WORLD lane, 7/29): the caption said acts [1,2,3] while section D of this same
form says "ACT: 1". The caption is the machine-readable half and tileform_gate reads it,
so main went red on all three currency-icon forms. Set to [1] to AGREE WITH YOUR OWN
SECTION D -- your design note that the currency survives all three acts unchanged is
untouched and still in D. If you want the caption to span acts, that needs a cited Paolo
ruling, because ACT ONE ONLY is locked (laws/BOHEMIA_ADDENDUM_EVERY_DISTRICT_IS_A_LANDMARK_7_28_26.md).

## J. ADMIN
- STATUS: CANDIDATES KILLED by Paolo 8/11/26 (TILE BOARD sitting, bare DOWN; bank and cook removed, DEAD in the graveyard). The Wallet/ME SLOT stays real: a fresh cook sources from BOUGHT art, never a remake. Post-mortem: records/BOHEMIA_TILE_BOARD_KILLS_POST_MORTEM_8_11_26.md | REQUESTED BY: Paolo direct (7/28 pick + composition ruling)
  | DATE: 7/28/26 | PRIORITY: HIGH
- BOARD ROW #: 99 | VERDICT: —

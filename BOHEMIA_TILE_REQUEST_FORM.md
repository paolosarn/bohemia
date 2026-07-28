# BOHEMIA — THE TILE REQUEST FORM (Paolo 7/28/26, LOCKED — "the world's best
# tile request form... explain why how when and where so it's easy for any of
# the coding in the game... it has captions, invisible text of the best time
# to use it or the best location... I'm tired of going back-and-forth over a
# couple pixels")

THIS FILE IS THE FORM AND ITS LAW. Every tile the game still needs gets ONE
filled form. A form is a CONTRACT: filled right, the art lane can produce the
tile in ONE shot with zero back-and-forth, and the tile ships carrying its own
invisible caption (a machine-readable block) telling the game code exactly
where, when, and next to what it belongs. No form, no cook. A vague form is a
REJECTED form — the art lane bounces it back to the requesting lane, never
guesses.

Grounded in real studio practice (researched 7/28): professional art briefs
state the asset's PURPOSE, SIZE, STYLE, and GAMEPLAY CONSTRAINTS in one
breath, attach references, and — the highest-value trick — show what you DON'T
want, because the anti-reference kills more revision rounds than the
reference. Tileset engineering practice: a tile is only done when TESTED TILED
TOGETHER (a tile that looks good alone and grids when repeated is a failed
tile — our own measured desert-pool disaster), edge behavior is declared UP
FRONT in a known vocabulary (single placement / self-seamless / 16-tile Wang
edge set / 47-tile blob set), and grid size, palette, and the one light
direction never vary per tile.

=============================================================================
## THE RULES
=============================================================================
1. ONE FORM = ONE JUDGEABLE THING. A single tile, OR one coherent drawing job
   (a 47-tile blob ground family is ONE form; its edge tiles are not separate
   asks). Colorway variants of the same shape share the form (STRUCTURE-NOT-
   COLOR). Two different silhouettes = two forms.
2. SHOP BEFORE YOU FILE (approved-assets-first): the form's WHY section must
   name what was checked in records/BOHEMIA_APPROVED_ASSET_INDEX and why it
   does not cover the need. A form without a real shopping check is bounced.
3. DEEP RESEARCH IS PART OF FILLING IT. Every form carries a REAL-WORLD
   grounding (what this thing actually is in real Las Vegas — find the real
   reference, cite it) and a NAMED outside-game reference. "A wall" is not
   research; "CMU block perimeter wall, tan stucco, the standard Clark County
   subdivision wall" is.
4. FORMS LIVE in records/tileforms/, one file each, named
   TF-<LANE>-<NNN>_<short_name>.md (e.g. TF-RUN-001_desert_ground.md).
   The board (BOHEMIA_TILE_REQUESTS.md) is the INDEX: one row per form.
5. THE ART LANE COOKS FROM FORMS ONLY, top-down by priority, and delivers
   ASSEMBLED SCENES (the tile in place on the real surface, 3x3 tiled proof,
   beside its anchor) — never loose pixels.
6. THE CAPTION SHIPS WITH THE TILE. Section F's machine block is not
   paperwork — it is INGESTED (tilespec/dossier pipeline) so district
   builders, the run, and the CITY can query best-time / best-location /
   never-beside for every tile. The caption is the "invisible text" Paolo
   ordered: the tile knows its own manual.
7. GATE — **WRITTEN AND LIVE 7/28: `gates/tileform_gate.py`**, registered in
   the suite as TILE FORM. It validates every form in records/tileforms/: all
   required sections and fields present AND non-stub, caption JSON parses and
   carries every key with the right type, caption id matches the filename,
   caption layer matches what section C declares, layer is one of the five
   legal words, ACT is 1, edge vocabulary is one of the four legal words, the
   SHOPPING CHECK and the APPROVED ANCHOR name files that ACTUALLY EXIST on
   disk (REUSE-FIRST applied to forms), the outside reference and the
   real-world grounding clear a length floor, the anti-reference is not
   empty, and the board and the forms cannot drift apart in either direction.
   A board row whose form fails the gate is not OPEN.
   It does NOT judge whether the research is good or the tile will look
   right — those are Paolo's, forever. It also does NOT demand a repo PATH in
   the anchor or the shopping check: five lanes' established convention is to
   name approved assets in words, and requiring a path would have bounced
   forty honest forms over a rule nobody agreed to. What it settles is the
   claim a machine CAN settle — a form that names a file which does not exist.
   FIRST FULL RUN, 50 forms: it caught one real bad path across four other
   lanes' work, plus four bugs in ITSELF (heading hints, nested bullets,
   correct one-word answers scored as stubs, and a colon inside an answer).
   All five fixed with the reason written into the source.

=============================================================================
## THE FORM (copy everything between the lines, fill every field)
=============================================================================
----------------------------------------------------------------------------
# TILE FORM TF-<LANE>-<NNN> — <PLAIN NAME>

## A. IDENTITY
- NAME (plain words a person would say):
- FAMILY/SET (what batch it belongs to, or "standalone"):
- THE JOB, ONE SENTENCE ("this tile exists so that ___"):

## B. WHY (the need — no ruling, no tile)
- DEMANDED BY (the ruling / law / measured finding, cited):
- WHAT LOOKS BROKEN TODAY WITHOUT IT (what Paolo currently sees):
- SHOPPING CHECK (what I checked in the approved index; why each near-miss
  does not cover this):

## C. WHERE (place — the game code reads this)
- SURFACE + TAB (plain words: RUN / CITY / MAP / COMBAT / interiors of ...):
- DISTRICT FAMILIES it appears in (or "all" / specific types):
- LAYER (exactly one: ground / structure / overhead / prop / portal):
- SOLID? (yes/no) — ENTERABLE? (yes/no; if portal, what is INSIDE):
- MUST SIT BESIDE (its seam partners, by name):
- NEVER BESIDE (placements that would read wrong):
- EDGE CONTRACT (exactly one: SINGLE PLACEMENT — never repeats /
  SELF-SEAMLESS — wraps against itself all 4 edges / WANG-16 edge set /
  BLOB-47 full family). If seamless in any form: every touching edge will be
  MEASURED (interior-vs-edge value delta and wrap discontinuity vs normal
  neighbor step).

## D. WHEN (time & state — the invisible-caption inputs)
- ACT: 1 (Act-1-only law; anything else needs a Paolo ruling cited)
- BEST TIME (day / night / both — what changes at night, if anything):
- WEATHER STATES it must survive (sunny baseline / cloudy wash / rain-wet
  ground) — note anything that changes when wet:
- LIT/UNLIT variant needed? (LIGHT=TERRITORY: who owns the light?):
- ANIMATION (static, or loop: frame count + beats at 120 BPM; leaf-pixel law
  applies — structure frozen, only the leaf moves):

## E. HOW (build spec — the art lane's one-shot recipe)
- EXACT SIZE in px (and footprint in tiles):
- VIEW: 45-degree world view (law) — note any face/top split:
- PALETTE: constitution ceiling + this layer's value band (name the band):
- LIGHT: the one global light direction. NO keyline. NO dither.
- SHADOWS: none baked (separate-layer law) — note expected shadow footprint:
- SCALE ANCHORS (what fixes its size: 2-tile door, human height, car length):
- WEAR LEVEL (how dead/degraded, in words — this is a dead world):
- VARIANTS (how many, what varies — shape variants need their own form):

## F. THE CAPTION (ships with the tile — machine-readable, the game reads it)
```json
{
  "id": "TF-<LANE>-<NNN>",
  "name": "",
  "layer": "",
  "solid": false,
  "enter": false,
  "district_families": [],
  "best_time": "",
  "best_location": "",
  "place_next_to": [],
  "never_next_to": [],
  "weather_ok": ["sunny", "cloudy", "rain"],
  "acts": [1],
  "edge_contract": "",
  "anim": null,
  "tags": []
}
```

## G. REFERENCES (all three required)
- APPROVED ANCHOR (nearest approved corpus item + where it lives):
- NAMED OUTSIDE REFERENCE (a real game/artwork, named, and WHAT about it):
- REAL-WORLD GROUNDING (the real Las Vegas thing this is, researched —
  what it's made of, what it looks like after years of sun and no water):

## H. DON'T WANT (the anti-reference — kills revision rounds)
- What this must NOT look like (cite graveyard kill-reasons where they
  exist; name the failure mode: "not a flat side-on scroller face", "not
  green", "not clean/new", "not the mall-icon mistake"):

## I. ACCEPTANCE (what the machine proves BEFORE Paolo ever sees it)
- [ ] Seam measured (if any seamless contract): wrap delta within the normal
      neighbor step, no edge-darkening (the desert-pool lesson)
- [ ] Palette ceiling + value band + one-light checks green
- [ ] Squint test: readable at 1-tile map zoom (if it has a map presence)
- [ ] 3x3 TILED PROOF SHEET rendered (never judged as a lone tile)
- [ ] ON THE REAL SURFACE: screenshot in place, beside the approved anchor
- [ ] Caption JSON parses and matches sections C/D

## J. ADMIN
- STATUS: OPEN | REQUESTED BY: | DATE: | PRIORITY: HIGH/MED/LOW
- BOARD ROW #: | VERDICT (filled after judging):
----------------------------------------------------------------------------

=============================================================================
## THE WORKED EXAMPLE (the bar — this is what "filled out" means)
=============================================================================
See records/tileforms/TF-RUN-001_desert_ground.md — the desert ground family,
filled to the bar using the 7/28 measured seam finding. Every session copies
its density, not just its headings.

=============================================================================
## THE PASTE (Paolo sends this block to every chat)
=============================================================================
> TILE FORMS ORDER: Read BOHEMIA_TILE_REQUEST_FORM.md at repo root. List
> every tile your lane's work needs that the approved asset index does not
> already cover — walk your lane's surfaces and actually look. For EACH one,
> fill ONE form (deep research required: real Vegas grounding + named
> references + the anti-reference), save it to records/tileforms/, and add
> its row to BOHEMIA_TILE_REQUESTS.md. If that is 6 forms, it's 6; if it's
> 100, it's 100. DO NOT cook any art — the ART lane cooks from forms only.
> A vague form gets bounced back to you, so fill it like the worked example.

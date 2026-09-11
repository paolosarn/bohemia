# THE FONT — WHAT A 2050 DEVICE ACTUALLY DISPLAYS (DIRECTION, 9/11/26)
# [the font] research round, under THE UI MUST NOT LOOK VIBE-CODED (9/11 law).
# The ask: not a pick from the default list. What a worn device from our own
# era would show, what a stamped or painted label on a casing looks like, what
# survives at phone size in pixels — three to five real candidates with
# references beside them, ONE RULED PER ACT into the act cards, and the object
# language with it.

## 0. THE FINDING THAT PROVES US WRONG, AND IT IS MINE
The 9/11 audit counted 150 monospace uses in the alpha shell and 91-97
letter-spaced uppercase labels — and TWO OF THE CARDS ARE MINE. The act cards
(9/6) say "TYPE: stencilled monospace, letter-spaced" and the phone card
(9/11) says "family: monospace". I reached for the same default the model
always reaches for, wrote it into law, and called it a decision. This record
is the correction: fixed-pitch type survives ONLY where the in-world object
is a fixed-pitch device, and letter-spacing stops being the house label style.
The act cards are amended this same commit.

## 1. THE CANDIDATES (real things, references beside each)

### FONT-A  THE ROM FONT (what a dying device actually shows)
- WHERE: Hitachi HD44780U datasheet (CGROM, 208 5x8 glyphs); eleif.net/HD44780.html
  (the pixel data); en.wikipedia.org/wiki/Hitachi_HD44780_LCD_controller
- WHAT IT IS: the character set burned into the display controller itself.
  When the OS is gone, the phone is cracked and the battery sags, THIS is what
  the hardware can still draw — and these controllers (and their clones) still
  ship in industrial panels and dashboards in our own era, chosen for direct-
  sunlight readability. A 2050 survivor device showing its ROM font is not a
  style, it is what would happen.
- AT OUR SIZE: it IS a pixel font by construction (5x8 cells). At an 11 px body
  it renders on a 2 px dot grid with the dot gaps visible — the realism and the
  pixel craft agree.

### FONT-B  DIN 1451, STENCIL EXECUTION (the stamped casing label)
- WHERE: en.wikipedia.org/wiki/DIN_1451; fontsinuse.com/typefaces/1149/din-1451
  (zinc stencils manufactured to the standard since the late 1930s, army use
  with the stencil bars)
- WHAT IT IS: the standard letter for technical equipment — arcs and straight
  lines only, designed so a template can be cut. A painted or stamped label on
  a casing, a crate, a breaker box looks like this because the stencil industry
  standardised on it.
- AT OUR SIZE: caps-only at 9-13 px with the stencil bars kept 1 px wide; the
  bars ARE the act-1 grit (the one visible break the act card already demands
  of its dividers).

### FONT-C  THE SEGMENT REGISTER (DSEG, OFL 1.1)
- WHERE: github.com/keshikan/DSEG; keshikan.net/fonts-e.html (7- and 14-segment
  families, SIL Open Font License 1.1, commercial use allowed)
- WHAT IT IS: what a meter shows. Seven segments for digits, fourteen for the
  strained letters. Battery counts, prices, day counters — hardware truth.
- AT OUR SIZE: segments survive any size because the FORM is the information;
  at 10 px a seven-segment digit is still unmistakably itself.

### FONT-D  THE SMALL-BODY PIXEL WORKHORSES (the licensed pool)
- WHERE: Pixel Operator (OFL, by Jayvee Enaguas); m5x7 / monogram / LanaPixel
  (CC0/free, itch.io and OpenGameArt small-font pools)
- WHAT IT IS: bitmap bodies DESIGNED for 7-11 px, proportional (not
  monospace), with real lowercase. The pool the body text is cut from when a
  surface is not a character-cell device — none of them are on the banned
  list, all are pixel-native, licenses clean.
- AT OUR SIZE: these hold the 11 px floor with lowercase intact, which the
  eighth-grade law needs (all-caps at length is not eighth-grade reading).

### FONT-E  THE STRUCTURE LESSONS (interface department references, no glyphs taken)
- WHERE: FALLOUT 1 (his word, 9/6: act-one look, "2050 rustic") and FINAL
  FANTASY X (the interface study, 8/26) — both legal for this department only.
- WHAT THEY TEACH (structure, never vocabulary, 8/28): Fallout's labels sit ON
  objects — stamped into bevelled metal buttons, so type has a THING under it;
  FFX's menus hold hierarchy with size and placement alone on quiet panels, no
  cards inside cards. No glyph, no font file, no letterform enters our game
  from either.

## 2. THE RULING — ONE PER ACT (into the act cards, same commit)
- ACT 1 (RUSTIC 2050): screens show the ROM REGISTER (FONT-A: our own 5x8
  dot-grid cut, drawn once, fixed-pitch because a character-cell display IS
  fixed-pitch); casing labels are DIN-STENCIL REGISTER (FONT-B: caps, bars,
  painted or stamped, 1 px bleed); meters are SEGMENT REGISTER (FONT-C
  style). Body prose on paper or board surfaces uses a proportional pixel
  body from the FONT-D pool. LETTER-SPACED UPPERCASE IS DEAD as a default:
  a label is spaced only if the stencil that painted it was.
- ACT 2 (MODERN): one proportional grotesque in the DIN 1451 register,
  pixel-cut (printed-again world: the standards letter, printed clean, no
  bars, no damage). Fixed-pitch survives nowhere except real terminals.
- ACT 3 (FUTURISTIC): the 14-SEGMENT REGISTER as display type (light emitting
  its own glyphs) over a thin proportional pixel body; fades legal here only.
- EVERYWHERE, EVERY ACT: no Inter, no Poppins, no Space Grotesk, no Geist, no
  monospace-as-default. Fixed-pitch appears ONLY where the in-world device is
  a character-cell screen (the phone glass, meters, terminals) — that is a
  fact about the object, not a font choice. The phone card's "family:
  monospace" is superseded by "family: ROM register (fixed-cell)" — same
  discipline, named for the reason it exists.

## 3. THE OBJECT LANGUAGE (edges, labels, thickness, what dark means)
- AN EDGE IS A THING'S EDGE: a panel edge is the lit or worn rim of a physical
  object, at least 2 px with a value step, never a 1 px grey hairline floating
  on nothing.
- A LABEL IS APPLIED: painted (stencil bleed), stamped (1 px inner shadow),
  embossed tape, or lit (act 3). A label floating in space with wide tracking
  is the tell; a label ON something is the world.
- THICKNESS IS REAL: every panel reads as having a body (the phone already
  does) — a shadowed lower edge or a visible side, one or the other, always.
- WHAT DARK MEANS: act 1 dark = unlit hardware in a dark room (warm, never
  pure black, the phone card's 0.06-0.12 glow); act 2 dark = a choice the
  printed surface makes; act 3 dark = the room the light-type sits in. Dark
  mode as a reflex is dead; dark as a material is the game.

## 4. MACHINE BLOCK
```json
{
  "card": "THE_FONT_RULING",
  "date": "9/11/26",
  "banned_everywhere": ["Inter", "Poppins", "Space Grotesk", "Geist", "monospace-as-default", "letter-spaced-caps-as-default"],
  "act1": {"screen": "ROM register 5x8 dot grid, fixed-cell", "casing": "DIN-stencil caps with bars, 1px bleed", "meter": "7-segment register", "body": "proportional pixel body, lowercase, 11px floor"},
  "act2": {"display": "DIN 1451 register grotesque, pixel-cut, no bars", "fixed_pitch": "real terminals only"},
  "act3": {"display": "14-segment light register", "body": "thin proportional pixel body", "fades": "legal here only"},
  "fixed_pitch_rule": "only where the in-world device is a character-cell screen",
  "object_language": {"edge_min_px": 2, "hairline_borders": "never", "label": "painted | stamped | embossed | lit, always on a thing", "panel_thickness": "always visible", "dark": "material per act, never a default"},
  "licenses": {"DSEG": "OFL 1.1", "Pixel Operator": "OFL", "small pool": "CC0/free", "ROM cut": "drawn by us from the cell grid"},
  "judge": "UI's options set their type per this block; judged beside a real device photo (character LCD, stencilled crate, segment meter) per act"
}
```

## 5. ROUTED
- UI: the vibe-purge row builds to section 2-3; every option sheet names which
  register each type surface uses.
- COOK: casing labels on cooked objects use the stencil register rules.
- EYES: the tell-counting gate reads section 4's banned list as its spec.
- The act cards and the phone card are amended in this same commit; their
  machine blocks now carry the registers.

Proof: sources in each candidate's WHERE line; the tells audit and his words
in laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md.

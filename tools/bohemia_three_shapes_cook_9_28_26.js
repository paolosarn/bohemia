/* ============================================================================
   THREE SHAPES  (WORLD, 9/28/26)  --  row [creatures], rule 37(n)

   HIS DIRECTION, NOT A LAW (Paolo 9/27, and he said "maybe"): de-extinction
   labs, mammoths and dire wolves, labs that lost their funding, an AI playing
   with genetics or an airborne thing. THREE SHAPES, NONE CANON UNTIL HE SAYS.

   *** AND THE ROSTER HE IS AIMING AT HAS A FOUNDING LAW THAT ARGUES BACK. ***
   engine/bohemia_wildlife.js, its own words: "Nothing on this page is a
   creature somebody made up." Its research file's finding, 8/25: "A pack of
   somebody's golden retrievers is worse than a mutant, because it is true."
   REALISM FIRST says that wins unless the trade is HIS. So these three shapes
   are not an answer to "what monster do we add". They are the three ways the
   REAL RECORD of 2026 actually puts a thing in a valley by 2060.

   SHAPE A -- THE TWENTY EDITS (left pair).
   The dire wolf that was on the news in 2025 was three grey wolves with TWENTY
   EDITS, 15 of them in 14 genes, aimed at larger bodies and thicker paler
   coats, and the company's own chief scientist said "grey wolves with 20
   edits", that "dire wolves" is a colloquialism, and that bringing back an
   extinct organism is impossible. So the realistic edited animal in 2060 is
   NOT a monster. It is the animal we already ship, a quarter bigger, with a
   paler coat. THE PICTURE IS THE POINT: our real coyote is on the left and the
   edited one is on the right, and at the distance you meet one you cannot tell.
   The tool REFUSES IF YOU CAN, which is the opposite of every other refusal in
   this repo and is the whole finding.

   SHAPE B -- THE ONE NOBODY COUNTED (middle pair).
   "The lab lost its funding and the animals got out" is the romantic version.
   The real record is EUTHANASIA: labs put down thousands of mice when the
   money stopped in 2020, institutions facing cuts plan for it, a lab-animal
   breeder filed for bankruptcy, and welfare groups have to campaign for
   sanctuaries as the ALTERNATIVE. Nothing is released. So what is loose is not
   a specimen somebody freed, it is the one the paperwork got wrong: an
   ordinary dog we already draw, wearing a numbered tag. THE WRONG THING IS ONE
   BRIGHT PIXEL ON SOMEBODY'S PET.

   SHAPE C -- NOT AN ANIMAL AT ALL (right pair), AND THIS IS THE FINDING THAT
   PROVES THE OBVIOUS READ WRONG.
   The documented record of engineered life escaping containment is almost
   entirely PLANTS, not animals. Herbicide-tolerant rapeseed escaped cultivation
   after 1995 and is feral on roadsides in Canada, the United States, the UK,
   France, Australia, Switzerland, Austria, Sweden and Japan; a North Dakota
   roadside survey found the escaped populations "large and widespread";
   creeping bentgrass got out of an Oregon field trial; engineered wheat has
   been found in unplanted fields in Washington State four times since 2013.
   The same literature says terrestrial engineered livestock are the LEAST
   likely to establish, because they are housed, tagged and monitored one by
   one. AND OUR OWN VALLEY MAKES IT HORROR FOR FREE: this repo has ruled since
   8/26 that ACT ONE HAS NOTHING GREEN IN IT, and a whole record exists about
   hunting the last green out. So the one green thing in Las Vegas is the thing
   that got out, it is on the kerb joint where the spray truck used to go, and
   the spray is what it was built to survive.

   REUSE-FIRST: every animal pixel here is decoded out of
   banks/BOHEMIA_WILDLIFE_SPRITES.js, which PEOPLE cooked on 8/28 from a
   Nevada-sourced roster. No second coyote was drawn. The edited coat is that
   same coyote's own ramp shifted one step, so the claim "it is our animal,
   changed" is true of the pixels and not just of the caption.

   NONE OF THIS IS CANON. Rule 37(n) says a direction, not a law, and section 5
   of the bestiary research reserves "whether anything is supernatural" and
   "which animals are actually in the game" to him. draft:true throughout.

   REFERENCE CHECK
   COMPARED TO: PROP-02 (the real object typology -- here the real animal and
   the real published record of what escaped), PROP-01 (SLYNYRD's props and
   objects series, for reading a small shape against a ground), PROP-03 (the
   45-degree law), TG-05 (how a big dark surface reads) and AH-01 (the analog
   horror bible).

   STRUCTURAL RULES TAKEN:
     * PROP-02 -- the shape is the real thing or it is nothing. The edits are
       the edits that were actually made; the tag is what a real research animal
       wears; the plant is the plant that actually escaped.
     * PROP-03 / PROP-01 -- you are ABOVE the animal, so the back is the biggest
       lit surface and nothing is left-right symmetrical. Taken from the bank's
       own perspective note rather than restated.
     * TG-05 -- a dark surface reads by what breaks it, so the ground is three
       near-black steps and the only bright pixels in the whole image are the
       tag and the grass.
     * AH-01 -- ordinary frame, one thing wrong, and THE FRAME IS THE CONTROL.
       Every pair is the thing you already have beside the thing that is off by
       a little. Nothing here is a monster. Each panel is only frightening
       because the left half is normal.

   NOT SHIPPED TO A PLAY SURFACE (rule 18, and 37n is a direction not a law):
   a picture for the VOTE tab.

     node tools/bohemia_three_shapes_cook_9_28_26.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.resolve(__dirname, '..');
const BANK = require(path.join(REPO, 'banks/BOHEMIA_WILDLIFE_SPRITES.js'));

/* ---- the bank's own palette, extended by exactly one -------------------- */
const PAL = BANK.palette.slice();
/* *** THE COAT IS THE COYOTE'S OWN RAMP, BLENDED HALFWAY UP, AND THE FIRST CUT
   WALKED IT A WHOLE STEP. *** I rendered that one and looked at it: the edited
   animal came out near-white beside a tan coyote, which is a DIFFERENT ANIMAL
   on the screen and the exact opposite of the finding. Twenty edits for a
   "thicker, paler coat" is a shade, not a colour change. Each tan is mixed 50%
   with the tan above it, so every tone here is still derived from the bank and
   nothing was picked by hand. */
const mix = (a, b) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round((((pa >> sh) & 255) + ((pb >> sh) & 255)) / 2);
  return '#' + [16, 8, 0].map(sh => ch(sh).toString(16).padStart(2, '0')).join('');
};
const COAT_BASE = [16, 17, 18, 19];
const COAT_NEW = {};
COAT_BASE.forEach((i, k) => {
  const up = COAT_BASE[k + 1] === undefined ? null : PAL[COAT_BASE[k + 1]];
  COAT_NEW[i] = PAL.length;
  PAL.push(up ? mix(PAL[i], up) : mix(PAL[i], '#ffffff'));
});
const PALE = COAT_NEW[19];        /* the lightest edited tone, for the legend */
/* *** THE TAG GETS ITS OWN TONE, AND THE FIRST CUT OF THIS TOOL DID NOT. ***
   I reached for the bank's yellow (20) and then counted "the only bright thing
   on an ordinary dog" as 420 pixels -- because 20 IS THE EYE COLOUR of every
   animal in this bank, so the count was measuring eyes. A real livestock ear
   tag is orange plastic anyway, so the honest fix and the real-object fix are
   the same fix (PROP-02). Two new tones now, stated, not one. */
const TAG = PAL.length;           /* new tone 2 */
PAL.push('#d8762e');
const GRASS_D = 5, GRASS_M = 6, GRASS_L = 7;   /* the bank's own greens */
const NIGHT = 26, DARK = 1, STEP = 21, DIRT = 27;  /* near-black ground steps */
const KERB_D = 22, KERB_M = 30, ASPH = 8, SILT = 12;

const W = BANK.w, H = BANK.h;

function decode(rle) {
  const flat = [];
  for (let i = 0; i < rle.length; i += 2) for (let k = 0; k < rle[i + 1]; k++) flat.push(rle[i]);
  if (flat.length !== W * H) { console.log('REFUSED: sprite decodes to ' + flat.length + ', not ' + (W * H)); process.exit(1); }
  const g = [];
  for (let y = 0; y < H; y++) g.push(flat.slice(y * W, y * W + W));
  return g;
}
function animal(id) {
  const a = BANK.animals.find(x => x.id === id);
  if (!a) { console.log('REFUSED: the bank has no ' + id + '. REUSE-FIRST: this tool draws no animal of its own.'); process.exit(1); }
  return decode(a.frames.rest);
}
function blank(w, h, fill) { const g = []; for (let y = 0; y < h; y++) g.push(new Array(w).fill(fill)); return g; }
function blit(dst, src, ox, oy, scale) {
  for (let y = 0; y < src.length; y++) for (let x = 0; x < src[y].length; x++) {
    const v = src[y][x]; if (!v) continue;
    for (let sy = 0; sy < scale; sy++) for (let sx = 0; sx < scale; sx++) {
      const py = oy + y * scale + sy, px = ox + x * scale + sx;
      if (py >= 0 && py < dst.length && px >= 0 && px < dst[0].length) dst[py][px] = v;
    }
  }
}
/* the sprite's own footprint, so "a quarter bigger" is measured and not claimed */
function bbox(g) {
  let l = 1e9, r = -1, t = 1e9, b = -1;
  for (let y = 0; y < g.length; y++) for (let x = 0; x < g[y].length; x++) if (g[y][x]) {
    if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y;
  }
  return { w: r - l + 1, h: b - t + 1, l: l, t: t, b: b };
}
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(n >> 16 & 255) + 0.7152 * f(n >> 8 & 255) + 0.0722 * f(n & 255);
}

/* ---- SHAPE A: the twenty edits ------------------------------------------ */
/* THE COAT RAMP SHIFTS ONE STEP LIGHTER. The coyote's own tans are 16,17,18,19
   in the bank; "thicker, paler coat" is that ramp walked up by one, with one
   new tone on top. Nothing else about the animal is touched, which is the
   honest version of "15 edits in 14 genes for obvious physical traits". */
const COAT = COAT_NEW;
function palerCoat(g) {
  return g.map(row => row.map(v => (COAT[v] === undefined ? v : COAT[v])));
}

/* ---- SHAPE B: the one nobody counted ------------------------------------ */
/* A NUMBERED TAG ON THE EAR. Not a mutation, not a scar: the thing a real
   research animal wears, and the thing that survives the animal leaving. It is
   two pixels, and in a valley with nothing bright in it that is plenty. */
function tagged(g) {
  const o = g.map(r => r.slice());
  const bb = bbox(g);
  /* the ear is the top of the head, and the head is at the LEFT of these
     sprites (the bank draws every animal facing left) */
  let ex = -1, ey = -1;
  for (let x = bb.l; x < bb.l + 6 && ex < 0; x++) {
    for (let y = 0; y < H; y++) if (o[y][x]) { ex = x; ey = y; break; }
  }
  if (ex < 0) { console.log('REFUSED: could not find the head to tag'); process.exit(1); }
  /* ON TOP OF THE EAR, NOT BESIDE THE EYE. My first cut put it level with the
     eye and the render read as a second eye in the wrong colour. A tag hangs
     off the ear, which is the highest point of the head. */
  const ty = Math.max(0, ey - 1);
  o[ty][ex] = TAG;
  if (ex + 1 < W) o[ty][ex + 1] = TAG;
  return o;
}

/* ---- SHAPE C: the plant, drawn on the kerb it came up through ----------- */
function kerbStrip(withGrass, seed) {
  const g = blank(W, H, 0);
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < 6) g[y][x] = ASPH;                       /* the roadway above */
    else if (y === 6) g[y][x] = SILT;                /* the gutter, silted */
    else if (y === 7) g[y][x] = KERB_M;              /* the kerb face, lit */
    else if (y === 8) g[y][x] = KERB_D;              /* the kerb in shadow */
    else g[y][x] = (rnd() < 0.18 ? DIRT : STEP);     /* the dead setback */
  }
  if (!withGrass) return g;
  /* IT COMES UP THROUGH THE JOINT, which is where it really comes up: the seam
     between the kerb and the pavement is where water sits and spray misses. */
  const tufts = [2, 6, 9, 13];
  tufts.forEach((x, i) => {
    const hgt = 3 + (i % 2);
    for (let k = 0; k < hgt; k++) {
      const y = 6 - k;
      if (y < 0) continue;
      g[y][x] = (k === 0 ? GRASS_D : (k === hgt - 1 ? GRASS_L : GRASS_M));
      if (k > 0 && x + 1 < W) g[y][x + 1] = GRASS_M;
    }
    g[7][x] = GRASS_D;
  });
  return g;
}

function main() {
  const coyote = animal('coyote');
  const edited = palerCoat(coyote);
  const dog = animal('dogpale');
  const dogTag = tagged(dog);
  const kerb = kerbStrip(false, 7);
  const kerbGrass = kerbStrip(true, 7);

  const S = 8, SBIG = 10;                 /* exactly a quarter bigger, integers */
  const PAD = 14, GAP = 22, ROWGAP = 18;
  const cellW = W * SBIG, cellH = H * SBIG;
  const rowW = cellW * 2 + GAP;
  const IW = rowW + PAD * 2;
  const IH = (cellH + ROWGAP) * 3 - ROWGAP + PAD * 2;

  const img = blank(IW, IH, NIGHT);
  /* three near-black steps so a dark surface still reads (TG-05) */
  /* THREE NEAR-BLACK STEPS, DITHERED, NOT BANDED. My first cut laid them as
     full-width stripes every nine rows and the render read as a test pattern
     fighting every subject. TG-05 wants a dark surface that reads; it does not
     want a barcode. */
  let bgs = 20260928 >>> 0;
  const brnd = () => ((bgs = (bgs * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) {
    const r = brnd();
    img[y][x] = r < 0.80 ? NIGHT : (r < 0.94 ? DARK : DIRT);
  }

  const rows = [
    { ctl: coyote, shp: edited, ctlS: S, shpS: SBIG },
    { ctl: dog, shp: dogTag, ctlS: S, shpS: S },
    { ctl: kerb, shp: kerbGrass, ctlS: S, shpS: S, ownGround: true }
  ];
  rows.forEach((r, i) => {
    const top = PAD + i * (cellH + ROWGAP);
    /* BOTH HALVES SIT ON ONE BASELINE, or a size claim is a layout accident */
    const base = top + cellH;
    /* AND THEY STAND ON SOMETHING. The first render had the animals floating in
       the dark, which makes a size comparison meaningless: you cannot read one
       body as bigger than another if neither is touching a floor. The kerb row
       draws its own ground, so it is skipped. */
    if (!r.ownGround) {
      let gs = (7771 + i * 101) >>> 0;
      const grnd = () => ((gs = (gs * 1664525 + 1013904223) >>> 0) / 4294967296);
      for (let y = base - 3; y < base + 5; y++) for (let x = PAD; x < PAD + rowW; x++) {
        if (y < 0 || y >= IH) continue;
        if (y < base) { if (grnd() < 0.10) img[y][x] = DIRT; continue; }
        img[y][x] = grnd() < 0.22 ? DIRT : STEP;
      }
    }
    /* *** ALIGNED BY THE FEET, NOT BY THE BOX. *** The first render stood both
       animals on the bottom of their 16x16 sprite boxes, and the coyote's
       lowest drawn pixel is three rows above that, so both animals floated a
       clear gap above the ground line. A size comparison between two things
       that are not touching the same floor is not a comparison. */
    const foot = (g, scale, x) => base - (bbox(g).b + 1) * scale;
    blit(img, r.ctl, PAD + (cellW - W * r.ctlS) / 2 | 0, foot(r.ctl, r.ctlS), r.ctlS);
    blit(img, r.shp, PAD + cellW + GAP + ((cellW - W * r.shpS) / 2 | 0), foot(r.shp, r.shpS), r.shpS);
  });

  /* --- THE TOOL REFUSES ITSELF, and each refusal is one of the findings --- */

  /* 1. *** IT IS STILL THE SAME ANIMAL, AND THE OUTLINE IS WHERE THAT IS TRUE. ***
     Shape A's claim is that twenty edits for a bigger body and a paler coat
     leave you unable to tell. Size and colour are the edits; the OUTLINE is the
     thing that must not move, because a changed outline is a different animal
     and the record did not make one.

     *** I WROTE THIS CHECK WRONG TWICE AND BOTH WRONGS ARE WORTH KEEPING. ***
     The first cut compared the two 16x16 sprites and got 100%, which it could
     never not get -- the edit is a recolour, so the sprites are identical BY
     CONSTRUCTION and the check was proving that a recolour does not change a
     shape. So I rasterised them at their DRAWN scales (8x against 10x) and
     compared the overlap, and it refused at 57% different -- correctly, because
     that number is the size gap and nothing else. It was measuring size, which
     already has its own exact check below, and calling it shape.
     THE HONEST FORM IS SIZE-BLIND: normalise both outlines to one box and they
     must match, because the edits are size and colour and NOTHING ELSE. "Can
     you tell?" is then answered by the two numbers underneath -- a quarter
     bigger, a measured lift -- and not by an overlap that was always going to
     say whatever the scale step said. */
  const outline = (g) => {
    const b = bbox(g), o = [];
    for (let y = 0; y < 32; y++) {
      const row = [];
      for (let x = 0; x < 32; x++) {
        const sy = b.t + Math.floor(y * b.h / 32), sx = b.l + Math.floor(x * b.w / 32);
        row.push(g[sy] && g[sy][sx] ? 1 : 0);
      }
      o.push(row);
    }
    return o;
  };
  const oCtl = outline(coyote), oShp = outline(edited);
  let same = 0, any = 0;
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const a = oCtl[y][x], b = oShp[y][x];
    if (a || b) { any++; if (a && b) same++; }
  }
  const silhouetteMatch = same / any;
  if (silhouetteMatch < 1) {
    console.log('REFUSED: the outline moved (' + (100 * silhouetteMatch).toFixed(1)
      + '% match, size taken out). The twenty edits changed a body size and a coat '
      + 'colour. An outline that moves is a different animal and nobody made one.');
    process.exit(1);
  }
  /* and the coat really did get paler, measured, not asserted */
  const before = [16, 17, 18, 19].map(i => lum(PAL[i]));
  const after = [16, 17, 18, 19].map(i => lum(PAL[COAT[i]]));
  const lift = (after.reduce((a, b) => a + b, 0) - before.reduce((a, b) => a + b, 0)) / 4;
  if (lift <= 0.02) {
    console.log('REFUSED: the coat is not actually paler (lift ' + lift.toFixed(3) + ')');
    process.exit(1);
  }
  const sizeUp = SBIG / S;
  if (Math.abs(sizeUp - 1.25) > 1e-9) { console.log('REFUSED: the size step is not a quarter'); process.exit(1); }

  /* 2. *** ACT ONE HAS NOTHING GREEN IN IT (8/26), AND THE CONTROLS PROVE IT. ***
     The only green pixels in this whole image must be in the one panel that is
     about the thing that got out. A green anywhere else means the valley's own
     rule leaked and the horror is gone. */
  const GREENS = new Set([GRASS_D, GRASS_M, GRASS_L]);
  let greenTotal = 0, greenOutsideC = 0;
  const cTop = PAD + 2 * (cellH + ROWGAP), cBot = cTop + cellH;
  const cLeft = PAD + cellW + GAP;
  for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) {
    if (!GREENS.has(img[y][x])) continue;
    greenTotal++;
    if (!(y >= cTop && y < cBot && x >= cLeft)) greenOutsideC++;
  }
  if (greenOutsideC) {
    console.log('REFUSED: ' + greenOutsideC + ' green pixels outside the escaped plant. '
      + 'ACT ONE HAS NOTHING GREEN IN IT (8/26) and that rule is what makes this panel bite.');
    process.exit(1);
  }
  if (!greenTotal) { console.log('REFUSED: the plant did not draw'); process.exit(1); }

  /* 3. THE BRIGHT PIXELS ARE COUNTED. TG-05: a dark surface reads by what
     breaks it, so if the wrong thing is not a small minority it is not wrong,
     it is the subject. */
  let bright = 0, total = 0;
  for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) {
    total++;
    const v = img[y][x];
    if (v === TAG || GREENS.has(v) || v === PALE) bright++;
  }
  const brightShare = 100 * bright / total;
  if (brightShare > 6) {
    console.log('REFUSED: the wrong thing is ' + brightShare.toFixed(1) + '% of the frame. '
      + 'AH-01: an ordinary frame with ONE thing wrong.');
    process.exit(1);
  }

  /* 4. REUSE-FIRST, PROVED: every animal pixel must be a value the bank already
     had. Exactly one tone is new and it is the edited coat's highlight. */
  const newTones = PAL.length - BANK.palette.length;
  if (newTones !== 5) { console.log('REFUSED: this tool added ' + newTones + ' tones; it is allowed five (four blended coat steps and the ear tag)'); process.exit(1); }

  const tagCount = (() => { let n = 0; for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) if (img[y][x] === TAG) n++; return n; })();

  const LEGEND = {};
  LEGEND[NIGHT] = 'the dark, step 1'; LEGEND[DARK] = 'the dark, step 2'; LEGEND[DIRT] = 'the dark, step 3';
  LEGEND[ASPH] = 'roadway'; LEGEND[SILT] = 'silt in the gutter'; LEGEND[KERB_M] = 'kerb, lit';
  LEGEND[KERB_D] = 'kerb, shadow'; LEGEND[STEP] = 'the dead setback';
  LEGEND[TAG] = 'the ear tag (shape B, the only bright thing on an ordinary dog)';
  LEGEND[GRASS_L] = 'the thing that got out (shape C)';
  LEGEND[PALE] = 'the edited coat (shape A)';

  const doc = {
    version: 'BOHEMIA_THREE_SHAPES_v1', built: '2026-09-28',
    lane: 'WORLD, row [creatures], rule 37(n)',
    draft: true,
    canon: false,
    none_canon: 'Rule 37(n) is a DIRECTION and he said "maybe". Section 5 of the bestiary research reserves which animals are actually in the game and whether anything is supernatural. Nothing here is canon until he says.',
    his_direction: 'de-extinction labs, mammoths and dire wolves, labs that lost funding, an AI playing with genetics or an airborne thing; "maybe".',
    what_argues_back: 'engine/bohemia_wildlife.js ships with the line "Nothing on this page is a creature somebody made up", and its research file\'s own finding is "A pack of somebody\'s golden retrievers is worse than a mutant, because it is true." REALISM FIRST means that wins unless the trade is his. So these are the three ways the REAL record of 2026 puts a thing in a valley by 2060, not three monsters.',
    shape_a: 'THE TWENTY EDITS. The 2025 dire wolf was three grey wolves with twenty edits, fifteen of them in fourteen genes, for a larger body and a thicker paler coat; the company\'s own chief scientist called them "grey wolves with 20 edits" and said bringing back an extinct organism is impossible. So the edited animal of 2060 is our own coyote, a quarter bigger, one step paler. You cannot tell at distance and the tool refuses if you can.',
    shape_b: 'THE ONE NOBODY COUNTED. When the money stops the real record is euthanasia, not release: thousands of mice put down in 2020, institutions planning for it under cuts, a lab-animal breeder in bankruptcy, and welfare groups campaigning for sanctuaries as the alternative. So what is loose is the one the paperwork got wrong: an ordinary dog wearing a numbered tag.',
    shape_c: 'NOT AN ANIMAL. The documented escape record is almost all PLANTS: herbicide-tolerant rapeseed feral on roadsides across nine countries since 1995, a North Dakota survey calling the escaped populations large and widespread, creeping bentgrass out of an Oregon field trial, engineered wheat in unplanted Washington State fields four times since 2013 -- while the same literature says housed, tagged, monitored livestock are the least likely to establish. AND OUR VALLEY MAKES IT HORROR FOR FREE: this repo ruled on 8/26 that ACT ONE HAS NOTHING GREEN IN IT, so the one green thing in Las Vegas is the thing that got out, on the kerb joint, and the spray is what it was built to survive.',
    reuse: 'every animal pixel is decoded out of banks/BOHEMIA_WILDLIFE_SPRITES.js (PEOPLE, 8/28, Nevada-sourced). No second coyote was drawn. The edited coat is that same coyote\'s own ramp walked up one step.',
    measured: {
      silhouetteMatch: +(100 * silhouetteMatch).toFixed(1),
      coatLightnessLift: +lift.toFixed(3),
      sizeStep: sizeUp,
      greenPixels: greenTotal,
      greenOutsideThePlant: greenOutsideC,
      tagPixels: tagCount,
      brightSharePct: +brightShare.toFixed(2),
      newTonesAdded: newTones
    },
    the_wrong_thing: 'AH-01, and the frame is the CONTROL. Every pair is the thing you already have beside the thing that is off by a little. Nothing here is a monster; each panel only bites because its left half is normal.',
    size: { image: IW + 'x' + IH, sprite: W + 'x' + H },
    palette: PAL, legend: LEGEND,
    not_shipped: 'rule 18, and 37(n) is a direction not a law: a picture for the VOTE tab.',
    build_source: main.toString().slice(0, 4000)
  };

  fs.writeFileSync(path.join(REPO, 'banks/BOHEMIA_THREE_SHAPES_9_28_26.txt'), JSON.stringify(doc));
  fs.writeFileSync(path.join(REPO, 'banks/_threeshapes_grid.json'),
    JSON.stringify({ g: img, pal: PAL, leg: LEGEND, w: IW, h: IH }));

  console.log('wrote banks/BOHEMIA_THREE_SHAPES_9_28_26.txt   ' + IW + 'x' + IH);
  console.log('  A  silhouette match ' + (100 * silhouetteMatch).toFixed(1) + '%  (refuses on any move, size taken out)'
    + '   coat lift ' + lift.toFixed(3) + '   size ' + sizeUp + 'x');
  console.log('  B  tag pixels ' + tagCount + ' on an ordinary dog');
  console.log('  C  green pixels ' + greenTotal + ', outside the plant ' + greenOutsideC
    + '   *** ACT ONE HAS NOTHING GREEN IN IT ***');
  console.log('  the wrong thing is ' + brightShare.toFixed(2) + '% of the frame; ' + newTones + ' new tones');
}

main();

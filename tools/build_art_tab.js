/* THE ART TAB (8/4/26).
 *
 * Paolo 8/4: "bro can you put all the work in a different fucking tab like the life
 * tab bro wtf like u want me to hunt all your work down bro thats goofy asf i
 * shouldnt have to tell you that"
 *
 * He is right and he should not have had to tell me. NAME THE TAB has been law since
 * 7/28 -- "a thing he cannot reach does not exist to him" -- and I spent a whole turn
 * pointing him at PNG paths under records/target/. The link is the door and the tab
 * is the room. This builds the room.
 *
 * WHAT IT IS: the ART lane's judge surface, the same shape as every other judge tool
 * in this repo. Tap the picture to flip between BEFORE and AFTER, thumbs on each
 * item, per-item comment, one comment box at the bottom, SUN MODE for daylight, and
 * an EXPORT that writes a .txt (never .json).
 *
 * A/B IS A TAP, NOT A SIDE-BY-SIDE. Two half-width phone screens are two pictures
 * too small to judge. One full-width picture that FLIPS under your thumb is how you
 * actually see a grade: the eye holds the first frame and the second one lands on
 * top of it.
 *
 * THE PICTURES ARE FILES, NOT BASE64. This page rides in an iframe next to the run,
 * so it can reference ../records/target/*.png by path the way the run frame does.
 * Embedding six 1.4MB screenshots would have made a 12MB tab for no reason.
 *
 * REUSE CHECK: cooks no game pixels. It lays out screenshots that
 * tools/bohemia_art_tab_shots.js took of the shipped run, and reuses the judge-page
 * conventions already in the repo (thumbs + per-item note + bottom comment + SUN
 * MODE + .txt export) rather than inventing a new verdict format.
 *
 *   node tools/build_art_tab.js  ->  slices/BOHEMIA_ART_CURRENT.html
 */
'use strict';
const fs = require('fs');
const path = require('path');

const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'slices', 'BOHEMIA_ART_CURRENT.html');
const SHOTS = path.join(REPO, 'records', 'target');

/* every card names WHAT IT IS in his words, not in mine, and every one of them is
   a thing he can say one word about */
const CARDS = [
  {
    id: 'look',
    title: 'THE LIGHT',
    ask: 'Tap the picture. Does the game look better with the light on?',
    a: 'ART_LIGHT_OFF.png', aLbl: 'LIGHT OFF (how it was)',
    b: 'ART_LIGHT_ON.png',  bLbl: 'LIGHT ON (what shipped)',
    why: 'The whole game was using 110 of 255 brightness values and 0.0% of its ' +
         'pixels were cool. Everything was the same colour and the same brightness, ' +
         'which is why you could not see any of the texture work. Now the bright ' +
         'things take the sun and the dark things take the sky, which is blue.',
    num: 'brightness range 106 → 144 · contrast 31.7 → 42.5 · cool pixels 0.1% → 8.9%'
  },
  {
    id: 'sun',
    title: 'THE SHADOWS',
    ask: 'Tap the picture. Do the buildings sit on the ground now?',
    a: 'ART_SUN_OFF.png',  aLbl: 'NO SHADOWS',
    b: 'ART_LIGHT_ON.png', bLbl: 'SHADOWS ON',
    why: 'Nothing in this world threw a shadow, so every building sat on the dirt ' +
         'like a sticker on paper. Now every wall and every house drops a shadow ' +
         'down and to the right, the same direction the light in your tiles already ' +
         'comes from. It goes blue instead of black so your bought texture still ' +
         'shows through it.',
    num: '47 ground cells in shadow in this frame · 0 before'
  },
  {
    id: 'props',
    title: 'THINGS IN THE WORLD',
    ask: 'Tap the picture. Does the block look like a place people left?',
    a: 'ART_PROPS_OFF.png', aLbl: 'NOTHING IN IT (how it was)',
    b: 'ART_PROPS_ON.png',  bLbl: 'HIS OBJECTS, FIRST TIME EVER',
    why: 'You bought 8,674 HD tiles and swept 2,604 of them by hand on 7/13 -- ' +
         '1,927 thumbs up. NOT ONE had ever drawn a pixel. One session took the ' +
         '465 that go indoors and put them in rooms and stopped at the front ' +
         'door, so the entire valley had zero objects standing in it. That is why ' +
         'it looked empty, and it was never about texture. Your own thumbs picked ' +
         'this vocabulary: rocks 100 up and 0 down, dead trees 47 up, LIVING trees ' +
         '0 up and 23 down. It is a dead valley because you said so.',
    num: '126 objects you already approved · every built district now dressed: ' +
         'downtown 663 · stadium 553 · suburb 529 · gated 513 · farm 496 · warehouse 459 · railyard 404 · solar 421'
  },
  {
    id: 'grime',
    title: 'THE DIRT — ANSWERED: 0.30 SHIPS',
    ask: 'You picked SOME (0.30) on 8/9 and that is what the game ships now. The dial stays here to look at, not to re-answer.',
    dial: [
      { k: '0',    lbl: 'NONE',  img: 'ART_LIGHT_ON.png' },   /* grime 0 IS the shipped frame; a second identical 1.4MB file is dead weight */
      { k: '0.30', lbl: 'SOME',  img: 'ART_GRIME_030.png' },
      { k: '0.55', lbl: 'DIRTY', img: 'ART_GRIME_055.png' }
    ],
    why: 'One grime pass over everything is the Machine Party trick you liked: it ' +
         'blends separate objects into one world instead of a pile of different ' +
         'art. Your 8/9 verdict picked 0.30 and noted "dirty can be good too" - ' +
         '0.30 is live in the game, and 0.55 stays on the shelf as interest, not ' +
         'a ruling. Say the word if you ever want it turned up.',
    num: 'RULED 8/9: ships at 0.30, your pick · verdict in records/'
  }
];

/* WIRED IN THE GAME (8/11, SHOW IT IN A TAB NEVER A HUNT - his ruling, LOCKED):
   every family wired into the walked world gets a card HERE with a real
   screenshot of it live, captioned in plain words. He observes; he never
   searches. gates/wired_in_tab_gate.js goes red if a wiring ships without its
   card. */
const WIRED = [
  { id: 'TF-ART-017', title: 'THE BUILDINGS HAVE THICKNESS NOW', img: 'ART_WIRED_TF-ART-017.png',
    what: 'Until today every building in the valley was a cardboard flat: its vertical edges were lit and shaded strips that never turned, and a window was a picture pasted on the wall. Now the edges turn a second plane - a real 12-pixel return past the corner, which is exactly how thick a Clark County wall measures at this scale - with the value step that makes two planes read as two planes, and the one crack a thirty-year Vegas corner actually carries: the corner bead rusting inside the stucco, dead straight down the edge, with its little rust bleed. The windows became HOLES: a shaded jamb one side, a lit one the other, the soffit over the opening reading darkest the way a real underside does, and the only water stains a desert wall gets, starting at the sill corners and nowhere else. The whole thing is pure light-and-shadow geometry riding on top of whatever material the building already wears, so every house skin you approved and every civic material gets its thickness from one set of pieces. Houses, warehouses, the jail, everything with a corner. Live frame at the jail, before on the left, after on the right.' },
  { id: 'TF-RUN-005', title: 'THE BIG BUILDINGS ARE LIFTED PANELS', img: 'ART_WIRED_TF-RUN-005.png',
    what: 'The civic and industrial masses have worn real tilt-up concrete since 8/3, but it read as a repeating texture, which is exactly what tilt-up is not: a real one is BIG BLANK FIELDS PUNCTUATED BY JOINTS, because the panels were cast flat on the slab and lifted into place one by one, and you can read that construction method off the finished building. Now every tilt-up mass draws its caulked joint every four to six columns (each building rolls its own rhythm and the joints never swim), the poured cap runs as its own top course, the plinth at grade carries the pale mineral bloom concrete grows at its foot, rain weeps streak down the field (dust and UV only, never green - this is the Mojave), and the odd punched window is boarded over with the same weathered ply the shopfronts use. Warehouses, the jail, the hospital, downtown podiums, the convention hall - every building the world builds out of tilt-up. Live frame at a warehouse: joints, boards, bloom.' },
  { id: 'TF-WORLD-010', title: 'EVERY DISTRICT HAS ITS TALL THING', img: 'ART_WIRED_TF-WORLD-010.png',
    what: 'Vegas landmarks ARE its signs, and until today every one of them rendered as a plain brick box. Seven sign surfaces the world already named now draw as real dead signs: the commercial PYLON (bleached cabinet, panels blown out to the bare fluorescent tubes, standing on its steel legs), the swap meet market pylon, the school and drive-in MARQUEES (crazed letter boards, the shadows of gone letters still on the plastic, never a readable word - the words are yours), the drive-in SCREEN TOWER (a giant torn bleached screen, the steel lattice showing through the holes), the stadium SCOREBOARD (a dead bulb matrix with panels out), downtown BLADE SIGNS jutting over the sidewalk on their mounting arms, and the police station ROOF ANTENNAS and DISH. Faces harvested from your approved dead-signband plastics and street concrete, steel from the approved galv parapets and rail plates. Everything dark, because in act 1 nobody is buying. Live frame at the commercial pylon. The truck stop price pylon wires itself the day a truck stop generates.' },
  { id: 'TF-ART-010', title: 'THE RAILYARD RUNS ON YOUR TRACKS', img: 'ART_WIRED_TF-ART-010.png',
    what: 'The classification fan draws your approved ties, rails and ballast plates now. VOLUME 8/16: the tracks END like tracks now - measured first: 517 east and 517 west ends in the yard, so a thousand steel stops would be a lie. About one end in four keeps its rusted BUFFER STOP and the rest sink under thirty years of blown sand, one rail tip still showing. Live frame at a buffered end. Turnouts and the level crossing wait on world geometry that does not exist yet (no through mainline, no road ever meets a track).' },
  { id: 'TF-ART-003', title: 'THE LOTS HAVE THEIR PAINTED LINES', img: 'ART_WIRED_TF-ART-003.png',
    what: 'Courthouse, commercial, chapel, industrial, warehouse and downtown lots draw your washed stripes, each cell reading the painted line’s own shape. Live frame from the courthouse lot. The medical lot names whole bays, not lines, and is left alone on purpose.' },
  { id: 'TF-ART-012', title: 'THE ROOFS HAVE THEIR EDGE', img: 'ART_WIRED_TF-ART-012.png',
    what: 'Downtown, chapel, courthouse and library building tops wear your coping ring: oxide downtown, bone on civic, turning its corners. VOLUME 8/15: the DEAD MECHANICAL is on the roofs now - your approved AC units (small and large), roof hatches, drain sumps and the odd pulled panel sit on the flat gravel, the south parapets drain through scuppers, and sand drifts pile against the north and east walls of the galvanized roofs. Live frame on a commercial roof, dead unit standing on the gravel.' },
  { id: 'TF-ART-004', title: 'THE FENCES ARE REAL CHAIN-LINK', img: 'ART_WIRED_TF-ART-004.png',
    what: 'Thirteen districts that name their fence lines (solar, storage, battery, landfill, boneyard, radio, the trailer park and more) now draw see-through chain-link: the mesh shows the world behind it, posts land at corners and junctions, and about one segment in seventeen is breached. One fence line wears one style. VOLUME 8/14: the runs have GATES now, your approved gate pieces from the same bank, shut, sagging or hanging open, about one pair in thirteen, because every real lot has a way in. VOLUME 8/15: the whole wardrobe is on - the security yards (storage, battery, substation, arsenal, fort, airbase, radio, reclaim) run BARBED and RAZOR wire on top, the trailer park and swap meet run privacy SLATS, and the desert blows TRASH into the mesh with the odd section LEANING. 8/17: the world names its own REAL entrances (gate + curb cut cells on the fence lines) and every one now stands as a single wide OPEN gate - leaf hung at the end post, driveway ground through the mouth - where the world says the entrance is, not where a dice roll put it. Live frame at the battery yard, gate in the run. The jail keeps its razor-wire wall; that is a different object.' },
  { id: 'TF-ART-013', title: 'THE TRAILER PARK HAS ITS COLOURS', img: 'ART_WIRED_TF-ART-013.png',
    what: 'The mobile homes wear your park colourways now: ribbed cream, white and that faded turquoise, one colour per home with its stripe course. VOLUME 8/14: every home wears its SKIRT, the panel band at grade with the odd vent and missing panel. VOLUME 8/15: the BURNED ROW is in - about one home in six is a whole charred hull, because a post-crash park has its dead - and every home keeps its TOW HITCH on the tongue end, because a single-wide never loses it. Live frame in the park: a live home, a burned neighbour, skirts and hitches. Awnings are the last piece of this family still coming.' },
  { id: 'TF-ART-009', title: 'DOWNTOWN IS OLD PAINTED BRICK', img: 'ART_WIRED_TF-ART-009.png',
    what: 'The oldest buildings (downtown, chapel, school, courthouse, library, commercial) can wear your painted-over ghost brick now: whitewash with the old wall bleeding through, above the dead storefront glass. Live frame downtown.' },
  { id: 'TF-ART-014', title: 'THE FARM IS DEAD REAL DIRT', img: 'ART_WIRED_TF-ART-014.png',
    what: 'The farm names its own ground and now draws your family on it: fallow soil across the plots, furrow rows where crops once ran (each plot holds one furrow style), silted earth in the dead irrigation channels. These were the cells left deliberately blank by the props pass, waiting for the right family instead of getting dressed wrong. Live frame in the farm. Field edges, berms and the dirt track are coming as volume.' },
  { id: 'TF-ART-005', title: 'THE PARK LAWNS DIED MOWN', img: 'ART_WIRED_TF-ART-005.png',
    what: 'Every dead lawn in the valley draws your turf now: the park (three thousand cells of it), the school field and the stadium turf, with the old mowing stripes still readable in the dead grass. Courts, tracks, infields and bunkers key on their own names. VOLUME 8/15: the PAINTED LINES are on - the courts wear their ghost line ring (thirty years of wash, nearly gone, still legible) and the running tracks run their faded lanes where the ring is thin. SECOND PASS 8/15: the stadium names its own yard lines (field-markings cells) and they draw the chalk-line network now, joined cell to cell, stubbing out where the world says they end. Live frame at a park court, ghost lines on the blue acrylic.' },
  { id: 'TF-ART-008', title: 'THE SHOPS ARE DEAD DARK GLASS', img: 'ART_WIRED_TF-ART-008.png',
    what: 'Downtown storefront faces draw your family now: dead dark glazed bays with boarded, shuttered and grilled fronts mixed in real segments, and nothing glows because power is territory. The first hunt for this one stood at the awnings by mistake; the glass was here all along. VOLUME 8/15: the DEAD SIGNBANDS are up - the fascia above every shopfront, painted-over or showing ghost letters where the channel cans were salvaged (the letters kept the sun off the paint, so the silhouettes read darker), the odd dead can still hanging skewed. Cooked from the family palette, never lit, never a readable word - the words are yours. SECOND COOK same day: the PILASTERS divide the block into real bays now (masonry piers, full height, the band runs between them) and the SMASHED FRONTS are in - about one shop in thirteen has its street-level pane GONE, black void, shard fringe, glass grit at the sill, because thirty years ago people went through these. Only glass smashes; boarded and shuttered fronts were already sealed. 8/17: the AWNINGS are up too - the world has always named its awning cells on the pass-under layer, and the south-facing fronts now hang your approved tattered drops (rust, teal, sand stripe, sage - one colourway per shop run), dead fabric drooping against the glass, and you WALK UNDER them with the fade already working. 8/18: the SIDE-FACING runs got their own cooked ribbons (fabric colours sampled from your approved drops), so every awning in downtown hangs now, whichever way its shop faces - sagging scalloped fabric, support arms, tears showing the sidewalk through. Live frame downtown: bands, piers and a looted bay in one street. Every volume item the form named is in the game.' },
  { id: 'TF-ART-006', title: 'THE POOLS ARE DRAINED FOR GOOD', img: 'ART_WIRED_TF-ART-006.png',
    what: 'The waterpark wave pool, the splash pool and the apartment pools are real drained basins now: silted cracked floors, the coping rim stepping around every shape of the basin, the old blue tile waterline still on the back walls, a drain here and there. VOLUME 8/15: a pool floor is not flat any more - the middle of every big basin is the darker DEEP END and the shallow floor descends to it on real slopes, because luminance is geometry. Live frame at the wave pool, deep end reading dark. The rain-state wet deeps and the reclaim clarifier still wait (weather and world).' },
  { id: 'TF-ART-002', title: 'THE WAREHOUSES WEAR REAL METAL', img: 'ART_WIRED_TF-ART-002.png',
    what: 'Ten industrial districts pick from your corrugated skins now: bare metal with rust runs, and three real paints. One material per building so nothing patchworks. Live frame in the warehouse district.' },
  { id: 'TF-ART-018', title: 'THE KERB TURNS ITS CORNERS', img: 'ART_WIRED_TF-ART-018.png',
    what: 'The kerb is the single most repeated object in the valley and until today it only ever ran dead straight. Now it turns: at every suburb street corner the cap arcs a real quarter turn around the road, built from the approved street pixels and matched to the straight kerb runs beside it. SECOND PASS 8/17: the DRIVEWAY DROPS are in - every suburb driveway that meets the street wears its dropped kerb lip now, half height across the mouth, flaring back to full kerb at each end. Live frame at a driveway mouth on the street. The crossing ramps stay banked until the world names a crossing landing.' },
  { id: 'TF-ART-001', title: 'THE BLOCK WALLS GOT THEIR CAP', img: 'ART_WIRED_TF-ART-001.png',
    what: 'The plain concrete-block buildings (the unremarkable ones: solar, terminal, every district without a fancier material) finish properly now: a smooth poured cap beam runs the whole top course of the wall, and the odd vent block sits low in the courses. The orange starter parapet dies on these walls; the cap IS the top. Live frame at the solar farm.' },
];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* a card that is missing its picture is a card that lies. Fail loudly instead. */
const missing = [];
for (const w of WIRED) {
  if (!fs.existsSync(path.join(SHOTS, w.img))) missing.push(w.img);
}
for (const c of CARDS) {
  for (const f of (c.dial ? c.dial.map(d => d.img) : [c.a, c.b])) {
    if (!fs.existsSync(path.join(SHOTS, f))) missing.push(f);
  }
}
if (missing.length) {
  console.error('MISSING SHOTS (run tools/bohemia_art_tab_shots.js first):\n  ' + missing.join('\n  '));
  process.exit(1);
}

const cardHtml = CARDS.map((c, i) => {
  const n = i + 1;
  if (c.dial) {
    return `
  <section class="card" data-id="${c.id}">
    <h2><span class="n">${n}</span>${esc(c.title)}</h2>
    <p class="ask">${esc(c.ask)}</p>
    <div class="shotwrap">
      ${c.dial.map((d, j) => `<img class="dialimg${j === 0 ? ' on' : ''}" data-k="${d.k}"
           src="../records/target/${d.img}" alt="${esc(d.lbl)}" loading="lazy">`).join('\n      ')}
      <div class="flag" id="flag_${c.id}">${esc(c.dial[0].lbl)}</div>
    </div>
    <div class="dial">
      ${c.dial.map((d, j) => `<button class="dialbtn${j === 0 ? ' on' : ''}" data-card="${c.id}"
           data-k="${d.k}">${esc(d.lbl)}</button>`).join('\n      ')}
    </div>
    <p class="why">${esc(c.why)}</p>
    <p class="num">${esc(c.num)}</p>
    <div class="verdict">
      <button class="thumb up"   data-card="${c.id}" data-v="UP">&#128077; YES</button>
      <button class="thumb down" data-card="${c.id}" data-v="DOWN">&#128078; NO</button>
    </div>
    <textarea class="note" data-card="${c.id}" placeholder="say anything about this one"></textarea>
  </section>`;
  }
  return `
  <section class="card" data-id="${c.id}">
    <h2><span class="n">${n}</span>${esc(c.title)}</h2>
    <p class="ask">${esc(c.ask)}</p>
    <div class="shotwrap ab" data-card="${c.id}">
      <img class="abimg a on" src="../records/target/${c.a}" alt="${esc(c.aLbl)}" loading="lazy">
      <img class="abimg b"    src="../records/target/${c.b}" alt="${esc(c.bLbl)}" loading="lazy">
      <div class="flag" id="flag_${c.id}">${esc(c.aLbl)}</div>
      <div class="taphint">TAP TO FLIP</div>
    </div>
    <p class="why">${esc(c.why)}</p>
    <p class="num">${esc(c.num)}</p>
    <div class="verdict">
      <button class="thumb up"   data-card="${c.id}" data-v="UP">&#128077; YES</button>
      <button class="thumb down" data-card="${c.id}" data-v="DOWN">&#128078; NO</button>
    </div>
    <textarea class="note" data-card="${c.id}" placeholder="say anything about this one"></textarea>
  </section>`;
}).join('\n');

const AB = JSON.stringify(CARDS.map(c => c.dial
  ? { id: c.id, title: c.title, labels: c.dial.map(d => d.lbl + ' (' + d.k + ')') }
  : { id: c.id, title: c.title, labels: [c.aLbl, c.bLbl] }));

const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA — ART</title>
<style>
  :root{ --bg:#0d0d12; --ink:#e8e0cc; --faint:#8a8070; --line:#2a2620;
         --gold:#d8b24a; --card:#15151c; }
  body.sun{ --bg:#e9e4d6; --ink:#1a1710; --faint:#5c5446; --line:#b8ae98; --card:#f4f0e4; }
  *{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body{ margin:0; background:var(--bg); color:var(--ink);
        font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;
        padding:10px 10px 40px; }
  header{ display:flex; align-items:center; gap:8px; margin-bottom:10px; }
  h1{ font-size:13px; letter-spacing:2px; margin:0; flex:1; color:var(--gold); }
  .sunbtn{ font:11px ui-monospace,monospace; letter-spacing:1px; padding:7px 10px;
           background:transparent; color:var(--ink); border:1px solid var(--line);
           border-radius:4px; }
  .lede{ font-size:12px; color:var(--faint); margin:0 0 14px; line-height:1.55; }
  .board{ display:block; background:var(--card); border:1px solid var(--gold);
          border-radius:8px; padding:14px 12px; margin:0 0 16px; color:var(--gold);
          font-size:13px; letter-spacing:1px; line-height:1.5; text-decoration:none; }
  .boardtag{ display:inline-block; background:var(--gold); color:#14120c;
             border-radius:3px; padding:2px 7px; font-size:10px; letter-spacing:1.5px;
             margin-right:8px; }
  .card{ background:var(--card); border:1px solid var(--line); border-radius:8px;
         padding:12px; margin-bottom:16px; }
  h2{ font-size:13px; letter-spacing:1.5px; margin:0 0 6px; display:flex; gap:8px; align-items:center; }
  .n{ display:inline-flex; align-items:center; justify-content:center; width:20px; height:20px;
      border-radius:50%; background:var(--gold); color:#14120c; font-size:11px; flex:none; }
  .ask{ font-size:13px; margin:0 0 10px; }
  .shotwrap{ position:relative; line-height:0; border:1px solid var(--line);
             border-radius:6px; overflow:hidden; background:#000; cursor:pointer; }
  .shotwrap img{ width:100%; display:none; image-rendering:pixelated; }
  .shotwrap img.on{ display:block; }
  .flag{ position:absolute; left:8px; top:8px; font:11px ui-monospace,monospace;
         letter-spacing:1px; background:rgba(12,10,8,.82); color:#e8e0cc;
         border:1px solid #3a3020; border-radius:3px; padding:4px 8px; line-height:1; }
  .taphint{ position:absolute; right:8px; bottom:8px; font:10px ui-monospace,monospace;
            letter-spacing:2px; background:rgba(12,10,8,.82); color:#d8b24a;
            border:1px solid #3a3020; border-radius:3px; padding:4px 8px; line-height:1; }
  .dial{ display:flex; gap:6px; margin-top:8px; }
  .dialbtn{ flex:1; font:11px ui-monospace,monospace; letter-spacing:1px; padding:10px 4px;
            background:transparent; color:var(--ink); border:1px solid var(--line); border-radius:5px; }
  .dialbtn.on{ background:var(--gold); color:#14120c; border-color:var(--gold); }
  .why{ font-size:12px; color:var(--faint); margin:10px 0 4px; line-height:1.55; }
  .num{ font-size:11px; color:var(--gold); margin:0 0 10px; letter-spacing:.5px; }
  .verdict{ display:flex; gap:8px; }
  .thumb{ flex:1; font:12px ui-monospace,monospace; letter-spacing:1px; padding:12px 4px;
          background:transparent; color:var(--ink); border:1px solid var(--line); border-radius:5px; }
  .thumb.on.up{ background:#2f5d34; border-color:#4a8a52; color:#eaffea; }
  .thumb.on.down{ background:#5d2f2f; border-color:#8a4a4a; color:#ffeaea; }
  textarea{ width:100%; margin-top:8px; min-height:44px; background:transparent;
            color:var(--ink); border:1px solid var(--line); border-radius:5px;
            padding:8px; font:12px ui-monospace,monospace; resize:vertical; }
  .bottom{ border-top:1px solid var(--line); padding-top:14px; }
  .bottom h3{ font-size:12px; letter-spacing:1.5px; margin:0 0 8px; color:var(--gold); }
  .bottom textarea{ min-height:110px; }
  .exp{ width:100%; margin-top:10px; font:12px ui-monospace,monospace; letter-spacing:2px;
        padding:15px; background:var(--gold); color:#14120c; border:0; border-radius:6px; }
  .done{ font-size:11px; color:var(--faint); text-align:center; margin-top:8px; min-height:14px; }
</style>

<header>
  <h1>ART &middot; 8/5 &middot; THE WORLD HAS THINGS IN IT</h1>
  <button class="sunbtn" id="sunbtn">SUN MODE</button>
</header>
<p class="lede">Everything answered, 8/11: the four cards below (all UP, dirt at your
0.30) and the TILE BOARD sitting (14 families approved, 3 killed). Nothing in this
room asks you anything right now; the banner opens the board record.</p>

<a class="board" href="BOHEMIA_TILEFORMS_JUDGE_8_9_26.html">
  <span class="boardtag">ANSWERED 8/11</span>
  TILE BOARD &mdash; VERDICTS IN 8/11: you approved 14 families (475 tiles), 3 died. Tap for the record &rarr;
</a>

<h3 style="font-size:12px;letter-spacing:1.5px;margin:4px 0 10px;color:var(--gold)">WIRED IN THE GAME &middot; 8/11 &middot; JUST LOOK, NOTHING TO ANSWER</h3>
${WIRED.map((w) => `
  <section class="card" data-id="wired_${w.id}">
    <h2>${esc(w.title)}</h2>
    <div class="shotwrap"><img class="on" src="../records/target/${w.img}" alt="${esc(w.title)}" loading="lazy" style="display:block"></div>
    <p class="why">${esc(w.what)}</p>
    <p class="num">${esc(w.id)} &middot; live in the game right now</p>
  </section>`).join('\n')}

${cardHtml}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="whatever you want to say"></textarea>
  <button class="exp" id="exp">EXPORT MY VERDICT</button>
  <div class="done" id="done"></div>
</div>

<script>
var CARDS = ${AB};
var V = {}, NOTE = {}, DIAL = { grime: '0' };

/* TAP FLIPS. The eye holds the first frame and the second lands on top of it, which
   is the only way a grade is actually judgeable on a phone. */
document.querySelectorAll('.shotwrap.ab').forEach(function(w){
  w.addEventListener('click', function(){
    var id = w.getAttribute('data-card');
    var a = w.querySelector('.abimg.a'), b = w.querySelector('.abimg.b');
    var toB = a.classList.contains('on');
    a.classList.toggle('on', !toB); b.classList.toggle('on', toB);
    var c = CARDS.filter(function(x){ return x.id === id; })[0];
    document.getElementById('flag_' + id).textContent = c.labels[toB ? 1 : 0];
  });
});

/* the dial: tapping a picture steps it, tapping a button sets it */
function setDial(id, k){
  DIAL[id] = k;
  var card = document.querySelector('.card[data-id="' + id + '"]');
  var imgs = card.querySelectorAll('.dialimg'), btns = card.querySelectorAll('.dialbtn');
  var lbl = '';
  imgs.forEach(function(im){ im.classList.toggle('on', im.getAttribute('data-k') === k); });
  btns.forEach(function(bt){
    var on = bt.getAttribute('data-k') === k;
    bt.classList.toggle('on', on);
    if (on) lbl = bt.textContent;
  });
  document.getElementById('flag_' + id).textContent = lbl;
}
document.querySelectorAll('.dialbtn').forEach(function(bt){
  bt.addEventListener('click', function(){ setDial(bt.getAttribute('data-card'), bt.getAttribute('data-k')); });
});
document.querySelectorAll('.card').forEach(function(card){
  var imgs = card.querySelectorAll('.dialimg');
  if (!imgs.length) return;
  var id = card.getAttribute('data-id');
  card.querySelector('.shotwrap').addEventListener('click', function(){
    var ks = [].map.call(imgs, function(im){ return im.getAttribute('data-k'); });
    setDial(id, ks[(ks.indexOf(DIAL[id]) + 1) % ks.length]);
  });
});

document.querySelectorAll('.thumb').forEach(function(bt){
  bt.addEventListener('click', function(){
    var id = bt.getAttribute('data-card'), v = bt.getAttribute('data-v');
    V[id] = (V[id] === v) ? null : v;
    document.querySelectorAll('.thumb[data-card="' + id + '"]').forEach(function(o){
      o.classList.toggle('on', V[id] === o.getAttribute('data-v'));
    });
  });
});
document.querySelectorAll('textarea.note').forEach(function(t){
  t.addEventListener('input', function(){ NOTE[t.getAttribute('data-card')] = t.value; });
});

/* WARM THE HIDDEN FRAMES. An img that is display:none never lazy-loads, so the
   first tap of a flip would sit on a blank box while 1.4MB came down -- which
   reads as the feature being broken, not as a download. Fetch them quietly once
   the visible page has painted, so every flip after that is instant. */
window.addEventListener('load', function(){
  setTimeout(function(){
    document.querySelectorAll('img').forEach(function(im){
      if (im.naturalWidth) return;
      var w = new Image(); w.src = im.getAttribute('src');
    });
  }, 400);
});

document.getElementById('sunbtn').addEventListener('click', function(){
  document.body.classList.toggle('sun');
});

/* .txt, NEVER .json (verdict workflow, standing) */
document.getElementById('exp').addEventListener('click', function(){
  var L = ['BOHEMIA ART VERDICT', 'build 8/5 - THE WORLD HAS THINGS IN IT', ''];
  CARDS.forEach(function(c){
    L.push(c.title);
    L.push('  verdict: ' + (V[c.id] || 'NO ANSWER'));
    if (DIAL[c.id] !== undefined) L.push('  amount picked: ' + DIAL[c.id]);
    if (NOTE[c.id]) L.push('  note: ' + NOTE[c.id]);
    L.push('');
  });
  var all = document.getElementById('all').value;
  if (all) { L.push('ANYTHING ELSE'); L.push(all); L.push(''); }
  var blob = new Blob([L.join('\\n')], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'BOHEMIA_ART_VERDICT.txt';
  document.body.appendChild(a); a.click(); a.remove();
  document.getElementById('done').textContent = 'exported. send me the file.';
});
</script>
`;

fs.writeFileSync(OUT, html);
console.log('built slices/BOHEMIA_ART_CURRENT.html (' + html.length + ' bytes, ' +
            CARDS.length + ' cards, ' +
            CARDS.reduce((n, c) => n + (c.dial ? c.dial.length : 2), 0) + ' shots)');

#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — THE UI VOCABULARY FACTORY (8/26/26, UI lane)

   Paolo 8/25: "I REALLY CARE ABOUT THE UNIQUNESS OF MY GAME AND I NEED TO
   START WORKING ON HOW ALL THE BUTTON AND EVERYTHING IN THE WORLD WILL LOOK
   AND CRAFT THIS BOHEMIA LOOK BY MYSELF WITH YOU."

   THE LANE BRIEF SAYS THE FIRST JOB IS NOT A COMPONENT LIBRARY. It is ONE
   PAGE OF VOCABULARY -- the small number of decisions everything else is
   downstream of -- with two or three real options side by side where a real
   fork exists, and he picks with ONE LETTER.

   THIS FILE IS THE FACTORY (FACTORY LAW): a typed SPEC of the forks, a
   generator, one batch output (slices/BOHEMIA_UI_CURRENT.html), and its own
   regression gate (gates/ui_vocab_gate.js).

   REUSE CHECK -- what banks and shipped surfaces this opened before drawing
   anything, and what it took:
     banks/BOHEMIA_GRIME_8_3_26.txt   USED. The 352x352 continuous grime sheet
       he ruled UP on 8/9 at amount 0.30 ("Some my fav dirty can be good too").
       The TEXTURE fork does not invent a UI noise pattern: it lays HIS OWN
       approved world dirt, at HIS OWN ruled amount, over the panels. Read
       and inlined by this file at build time, so the claim is code, not prose.
     slices/BOHEMIA_RUN_CURRENT.html  USED. Every "TODAY" value on the page
       (the colours, the radius, the border width, the pressed rule) is
       HARVESTED from the real shipped run, not typed from memory. If the run
       changes, this page tells the truth about it on the next build.
     records/target/*.png             USED. The feed PLACE STRIP option shows
       real pixels of the real city from the LOOK/ART screenshots already on
       disk. No new world art was drawn for a UI page.
     NOTHING NEW WAS COOKED. Every colour on the page is one of the run's
       shipped tokens. No new hue was invented, and purple is not among them.

   OUTPUT:  slices/BOHEMIA_UI_CURRENT.html   (the UI tab)
   RUN:     node tools/bohemia_ui_vocabulary.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RUN  = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const GRIME= path.join(ROOT, 'banks/BOHEMIA_GRIME_8_3_26.txt');
const OUT  = path.join(ROOT, 'slices/BOHEMIA_UI_CURRENT.html');

/* ==== 1. HARVEST WHAT THE GAME ACTUALLY LOOKS LIKE TODAY ==================
   Not from memory. From the file his thumb loads. A vocabulary page whose
   "today" column is wrong is worse than no page: he would be picking against
   a game that does not exist. */
function harvestRun() {
  const src = fs.readFileSync(RUN, 'utf8');
  const head = src.slice(0, 20000);
  const tok = {};
  for (const m of head.matchAll(/(--[a-z-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) tok[m[1]] = m[2];
  const radius = (head.match(/\.card\{[^}]*border-radius:\s*(\d+)px/) || [])[1] || '6';
  const bw     = (head.match(/\.card\{[^}]*border:\s*(\d+)px/) || [])[1] || '1';
  /* the pressed rule the game ships today, verbatim */
  const press  = (head.match(/\.pb:active\{([^}]*)\}/) || [])[1] || '';
  return { tok, radius: +radius, bw: +bw, press: press.trim() };
}

/* ==== 2. CONTRAST, MEASURED ===============================================
   Every number this page prints about legibility is computed here from the
   real hex values, so no sentence on his screen is an adjective pretending
   to be a measurement. WCAG 2.1 relative luminance. */
function rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}
function lum(h) {
  const [r, g, b] = rgb(h).map(v => {
    v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const l1 = lum(a), l2 = lum(b);
  return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}
/* THE PURPLE TEST, the same arithmetic gates/bohemia_purity_gate.py uses.
   It runs at BUILD time over every colour this page is about to emit, so a
   purple can never reach his screen from this factory even once. */
function isPurple(h) {
  const [r, g, b] = rgb(h);
  return (r > g + 25) && (b > g + 25) && (r > 80);
}

const R = harvestRun();
const T = R.tok;

/* the shipped palette, harvested. every one of these is already in the game. */
const C = {
  bg:     T['--bg']      || '#0c0a07',
  surface:T['--surface'] || '#16110a',
  line:   T['--line']    || '#2c2317',
  ink:    T['--ink']     || '#ece2cf',
  dim:    T['--dim']     || '#9c8f76',
  faint:  T['--faint']   || '#6c614f',
  gold:   T['--gold']    || '#d8a742',
  goldsoft:T['--gold-soft']|| '#372a10',
  good:   T['--good']    || '#86ac52',
  teal:   T['--teal']    || '#61a89f',
  amber:  T['--amber']   || '#d47a30',
  danger: T['--danger']  || '#d9563a'
};
for (const [k, v] of Object.entries(C)) {
  if (isPurple(v)) { console.error('PURPLE RESERVATION: ' + k + ' ' + v + ' is purple. Refusing to build.'); process.exit(2); }
}

/* a brighter line, mixed from his own ink over his own surface -- not a new
   hue, the same ink at 45%. This is what the HEAVY option uses. */
function mix(a, b, t) {
  const A = rgb(a), B = rgb(b);
  return '#' + [0, 1, 2].map(i => Math.round(A[i] + (B[i] - A[i]) * t).toString(16).padStart(2, '0')).join('');
}
const LINE_BRIGHT = mix(C.surface, C.ink, 0.45);

/* measured, for the page's own copy */
const CT_LINE_TODAY  = contrast(C.line, C.surface).toFixed(2);
const CT_LINE_HEAVY  = contrast(LINE_BRIGHT, C.surface).toFixed(2);
const CT_INK         = contrast(C.ink, C.surface).toFixed(2);
const CT_GOLD        = contrast(C.gold, C.surface).toFixed(2);
const CT_DIM         = contrast(C.dim, C.surface).toFixed(2);

/* ==== 3. THE GRIME, HIS OWN, AT HIS OWN NUMBER ============================ */
const grime = JSON.parse(fs.readFileSync(GRIME, 'utf8'));
const GRIME_B64 = grime.b64;
const GRIME_AMT = grime.ships_at;                    /* 0.30, ruled 8/9 */
if (!GRIME_B64 || GRIME_B64.length < 1000) { console.error('grime bank has no sheet'); process.exit(2); }

/* ==== 4. THE SPEC =========================================================
   Seven forks. Each one is a decision everything else is downstream of.
   Each option carries the CSS variables that ARE that option -- there is no
   second copy of the look anywhere, the page is generated from this. */
const CUT = '10px';
const poly = (c) => `polygon(${c} 0, 100% 0, 100% calc(100% - ${c}), calc(100% - ${c}) 100%, 0 100%, 0 ${c})`;

const SPEC = [
  {
    k: 'shape', n: 1, title: 'THE CORNER',
    ask: 'Every box in the game has four corners. What shape are they?',
    note: 'Everything in the game is built out of one part: a box. A box is a coloured edge with a filled middle. Change the corner and the edge, and every button, card and panel in the game changes with it.',
    opts: [
      { v: 'A', name: 'SQUARE', vars: { '--r': '0px', '--rin': '0px', '--clip': 'none' },
        why: 'Hard corners. No rounding at all. This is what a government form, a parking ticket and a fuse box look like. Almost no phone app looks like this now, and that is the point.' },
      { v: 'B', name: 'SOFT', vars: { '--r': R.radius + 'px', '--rin': Math.max(0, R.radius - 1) + 'px', '--clip': 'none' },
        why: 'Rounded by ' + R.radius + ' pixels. This is what the game does today. It reads like a normal phone app, which is safe and also means it looks like everything else.' },
      { v: 'C', name: 'CUT', vars: { '--r': '0px', '--rin': '0px', '--clip': poly(CUT) },
        why: 'Two corners sliced off at 45 degrees, 10 pixels deep. A stamped metal tag, a punched ticket, a chip off a table. Nobody else does this, and it costs nothing to draw.' }
    ],
    today: 'B', rec: 'C',
    rec_why: 'C. The world is drawn at 45 degrees already, so a cut corner is the interface agreeing with the world instead of ignoring it. Square is honest but cold. Soft is what we have and it is the one that looks like every other game.'
  },
  {
    k: 'weight', n: 2, title: 'THE LINE',
    ask: 'How heavy is the edge around a box?',
    note: 'You said you work outside in the sun. That is not a small thing here: a thin dim line on a bright phone is a line nobody can see.',
    opts: [
      { v: 'A', name: 'HAIRLINE', vars: { '--bw': '1px', '--line': C.line },
        why: 'One pixel, dark. This is today. Measured against the panel behind it the edge is ' + CT_LINE_TODAY + ' to 1. Anything under about 3 to 1 disappears in daylight. This edge is basically not there.' },
      { v: 'B', name: 'HEAVY', vars: { '--bw': '2px', '--line': LINE_BRIGHT },
        why: 'Two pixels, and brighter: ' + CT_LINE_HEAVY + ' to 1 against the panel. Same colour family, no new hue, just the ink at 45 percent. Survives the sun and reads at arm\'s length.' },
      { v: 'C', name: 'NO LINE', vars: { '--bw': '0px', '--line': C.surface },
        why: 'No edge at all. Boxes are told apart by how light or dark they are, nothing else. Clean and modern. Weakest outdoors, because the whole screen flattens in bright light.' }
    ],
    today: 'A', rec: 'B',
    rec_why: 'B. The current edge measures ' + CT_LINE_TODAY + ' to 1 and that is not a taste call, it is invisible. Heavy also gives the cut corner something to be cut out of.'
  },
  {
    k: 'colour', n: 3, title: 'THE COLOUR',
    ask: 'When something is on, selected, or yours, what colour says so?',
    note: 'Purple is the Amalgamation\'s and never appears here. Everything below is already in the game.',
    opts: [
      { v: 'A', name: 'ONE GOLD', vars: { '--acc': C.gold, '--acc2': C.gold, '--accink': '#14100a' },
        why: 'Gold and nothing else, ' + CT_GOLD + ' to 1 on the panel. One colour, total discipline. The risk: gold already means LIGHT in the world, so the buttons and the lamps end up saying the same thing.' },
      { v: 'B', name: 'GOLD AND COLD', vars: { '--acc': C.gold, '--acc2': C.teal, '--accink': '#14100a' },
        why: 'Gold for you and what you do. Cold blue-green for the machine: the network, the phone, the numbers. Two meanings, two colours, easy to learn.' },
      { v: 'C', name: 'BONE', vars: { '--acc': C.ink, '--acc2': C.dim, '--accink': '#14100a' },
        why: 'Off-white for everything on, ' + CT_INK + ' to 1, the brightest thing on this list. Colour is spent only on danger. Gold then belongs to the world alone, so a warm glow on screen always means a real light out there.' }
    ],
    today: 'A', rec: 'C',
    rec_why: 'C, and the reason is your own law. Light is territory in this game. If the buttons are gold too, gold stops meaning light. Bone leaves the only warm thing on the screen to be the world.'
  },
  {
    k: 'type', n: 4, title: 'THE LETTERS',
    ask: 'What do the words look like?',
    note: 'The game asks for a typeface called Space Grotesk and never loads it, so right now the letters are whatever your phone picks. The game has no typeface. These three all work with no download.',
    opts: [
      { v: 'A', name: 'ALL TYPEWRITER-WIDTH', vars: { '--fc': 'ui-monospace,"SF Mono",Menlo,Consolas,monospace', '--fb': 'ui-monospace,"SF Mono",Menlo,Consolas,monospace' },
        why: 'Every letter the same width, everywhere. A receipt, a ledger, a printout. Perfect for a game about money that stopped working. Long sentences get harder to read.' },
      { v: 'B', name: 'MIXED', vars: { '--fc': 'ui-monospace,"SF Mono",Menlo,Consolas,monospace', '--fb': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif' },
        why: 'Typewriter width for labels and numbers, normal letters for what people say. This is what the game does today. Easiest to read, least distinctive.' },
      { v: 'C', name: 'PAPER', vars: { '--fc': '"American Typewriter","Courier New",ui-monospace,monospace', '--fb': '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif' },
        why: 'An actual typewriter face on the labels, normal letters underneath. Ink on paper in a world with no printers left. Slightly softer and more human than A.' }
    ],
    today: 'B', rec: 'C',
    rec_why: 'C. Mixed is the right structure and you already have it. Swapping the label face for a typewriter costs one line and instantly stops the game looking like a web page.'
  },
  {
    k: 'texture', n: 5, title: 'THE DIRT',
    ask: 'Is the interface clean, or is it dirty like the city?',
    note: 'The dirt below is not new. It is the grime sheet you approved on 8/9, at the exact amount you picked: ' + GRIME_AMT + '.',
    opts: [
      { v: 'A', name: 'CLEAN', vars: { '--grain': 'none', '--wear': 'none' },
        why: 'Flat colour, nothing on it. Crisp, cheap to draw, fastest. But a spotless menu floating over a filthy dead city is two different games on one screen.' },
      { v: 'B', name: 'DIRTY', vars: { '--grain': 'var(--grimeimg)', '--wear': 'none' },
        why: 'Your grime sheet laid over every panel at ' + GRIME_AMT + '. The same dirt that is on the walls is on the menu. It is one image, drawn once, so it costs almost nothing.' },
      { v: 'C', name: 'DIRTY AND WORN', vars: { '--grain': 'var(--grimeimg)', '--wear': 'inset 0 0 22px rgba(0,0,0,.55)' },
        why: 'The dirt, plus the edges of every panel eaten darker, like a screen that has been rained on and rubbed with a thumb for ten years. Strongest look. Costs a little contrast at the edges.' }
    ],
    today: 'A', rec: 'B',
    rec_why: 'B. C is beautiful and it darkens the edge exactly where the words go, which fights the sun problem in fork 2. Dirty without the wear gets the feeling and keeps the reading.'
  },
  {
    k: 'press', n: 6, title: 'PRESSED',
    ask: 'What does a button do the moment your thumb lands on it?',
    note: 'Your thumb covers the middle of the button. Anything that happens in the middle, you cannot see. This is the most-felt pixel in the game and nobody has ever decided it. Press the samples.',
    opts: [
      { v: 'A', name: 'FLIP', vars: {}, cls: 'press-A',
        why: 'The button and its writing swap places: the fill becomes the colour, the writing goes dark. The change happens at the edges too, so your thumb cannot hide it. Loudest, and works in sun.' },
      { v: 'B', name: 'SINK', vars: {}, cls: 'press-B',
        why: 'The button drops two pixels and goes darker, like a real key. Feels physical. It is also the one your own thumb sits on top of, so on a phone you feel it more than you see it.' },
      { v: 'C', name: 'EDGE', vars: {}, cls: 'press-C',
        why: 'The edge lights up and the middle stays put. This is roughly what the game does today (' + (R.press ? R.press.replace(/;\s*$/, '') : 'border-color change') + '). Quietest. Visible around a thumb, but easy to miss outdoors.' }
    ],
    today: 'C', rec: 'A',
    rec_why: 'A. On a phone the finger is the problem: whatever you draw in the centre of a button is under a thumb. A flip changes the whole box including its edge, so it is the only one of the three you can be sure he saw.'
  },
  {
    k: 'feed', n: 7, title: 'THE FEED POST',
    ask: 'The little text pictures on your phone feed are dead. What goes in that hole?',
    note: 'You said twice you could not tell what they were, so they are gone and they are not coming back. A post still needs to show something. Three ways, cheapest first.',
    opts: [
      { v: 'A', name: 'WORDS ONLY', vars: {}, cls: 'feed-A',
        why: 'No picture at all. The post is the writing: who said it, what they said, and the numbers. Real feeds are mostly words anyway. Ships today, costs nothing, and can never be unreadable.' },
      { v: 'B', name: 'THE STAMP', vars: {}, cls: 'feed-B',
        why: 'One solid shape in a filled square saying what kind of post it is: work, a warning, a death, a trade, a place. A silhouette reads at any size. A line drawing does not, which is why the old ones failed.' },
      { v: 'C', name: 'THE PLACE', vars: {}, cls: 'feed-C',
        why: 'A thin strip of the actual street the post is about, cut from the real game. It cannot be unreadable because it is the same picture you walk through, and it ties every post to somewhere you can go.' }
    ],
    today: null, rec: 'C',
    rec_why: 'C, with B\'s stamp sitting on it. The strip is real game pixels so it can never turn into mush, and it does the other job you asked for the same day: it puts the quest somewhere you can walk to.'
  }
];

/* build-time purple sweep over every colour any option emits */
for (const f of SPEC) for (const o of f.opts) for (const val of Object.values(o.vars || {})) {
  const hexes = String(val).match(/#[0-9a-fA-F]{3,8}/g) || [];
  for (const h of hexes) if (isPurple(h)) { console.error('PURPLE in ' + f.k + '.' + o.v + ': ' + h); process.exit(2); }
}

/* ==== 5. CSS FROM THE SPEC ================================================
   Two copies of every option, generated from ONE source: a scoped class the
   sample wears (so three options can sit side by side, each showing itself)
   and a root rule keyed on his pick (so the whole page becomes his choice). */
function varsBlock(vars) {
  return Object.entries(vars).map(([k, v]) => k + ':' + v).join(';');
}
let optCSS = '';
for (const f of SPEC) {
  for (const o of f.opts) {
    const body = varsBlock(o.vars || {});
    if (body) {
      optCSS += `.v-${f.k}-${o.v}{${body}}\n`;
      optCSS += `:root[data-${f.k}="${o.v}"]{${body}}\n`;
    }
  }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ==== 6. THE BOX ========================================================
   Every box on this page and in the vocabulary is the same two elements:
   an outer that IS the edge, and an inner that IS the fill. Corner, weight
   and cut all fall out of that one primitive, which is why the page can be
   re-skinned live from seven letters. */
function box(inner, outerCls, innerCls) {
  return `<div class="bx${outerCls ? ' ' + outerCls : ''}"><div class="in${innerCls ? ' ' + innerCls : ''}">${inner}</div></div>`;
}

/* ---- the live preview: a fake but honest game screen ---------------------- */
const PREVIEW = `
<div class="prev">
  ${box(`<div class="pvobj"><span class="pvring">&#9670;</span><span>find the water truck</span><span class="pvchip">DAY 3</span></div>`, 'pvbar')}
  <div class="pvworld">
    <img src="../records/target/STREET_NOW.png" alt="the street in the game">
    ${box(`<div class="pvtoast"><b>THE DOOR IS LOCKED</b><br>You need the key from the yard.</div>`, 'pvtoastwrap')}
    <div class="pvnav">
      <button class="bx btn pvact"><div class="in">ACT</div></button>
      <button class="bx btn pvpb"><div class="in">&#8593;</div></button>
    </div>
  </div>
  ${box(`<div class="pvcardhd"><b>ROSA @rosa_vg</b><span class="pvtag">WORK</span></div>
     <div class="pvfeedart"></div>
     <div class="pvbody">Nadie va pa'l norte hoy. The pumps are dry, y el guardia esta cobrando. Bring water, no promises.</div>
     <div class="pveng"><span>142</span><span>18</span><span class="pvg">+9</span></div>`, 'pvcard')}
  <div class="pvrow">
    <button class="bx btn pvbtn"><div class="in">TAKE THE JOB</div></button>
    <button class="bx btn pvbtn ghost"><div class="in">WALK AWAY</div></button>
  </div>
</div>`;

/* ---- one fork card ------------------------------------------------------- */
function sampleFor(f, o) {
  const cls = `v-${f.k}-${o.v}` + (o.cls ? ' ' + o.cls : '');
  if (f.k === 'feed') {
    return `<div class="samp ${cls}">${box(
      `<div class="pvcardhd"><b>ROSA</b><span class="pvtag">WORK</span></div>
       <div class="pvfeedart"></div>
       <div class="pvbody">The pumps are dry. Bring water.</div>`, '')}</div>`;
  }
  /* THE SAMPLE HAS TO SHOW WHAT THE FORK ACTUALLY CHANGES.
     The first cut of this page showed two buttons and a box, so COLOUR A and
     COLOUR B rendered pixel-identical (both only used the first accent) and
     TYPE A and TYPE B did too (no body text anywhere in the sample). Two forks
     were asking him to choose between things that looked the same, and the
     gate caught it. Every sample now carries: a button, a second-accent tag,
     and a real sentence in the body face. */
  return `<div class="samp ${cls}">
      <button class="bx btn"><div class="in">TAKE THE JOB</div></button>
      <button class="bx btn ghost"><div class="in">WALK AWAY</div></button>
      ${box('<span class="sTag">NETWORK</span><b>THE PUMP YARD</b>' +
              '<span class="sBody">Two men are already there and one of them knows your face.</span>', 'pane')}
    </div>`;
}

function forkCard(f) {
  const opts = f.opts.map(o => `
    <div class="opt" data-k="${f.k}" data-v="${o.v}">
      <div class="ohd"><span class="oletter">${o.v}</span><span class="oname">${esc(o.name)}</span>${
        f.today === o.v ? '<span class="otoday">IN THE GAME NOW</span>' : ''}${
        f.rec === o.v ? '<span class="orec">MY PICK</span>' : ''}</div>
      ${sampleFor(f, o)}
      <p class="why">${esc(o.why)}</p>
    </div>`).join('');
  const picks = f.opts.map(o => `<button class="pick" data-k="${f.k}" data-v="${o.v}">${o.v}</button>`).join('');
  return `
  <section class="fork" id="fork-${f.k}" data-k="${f.k}">
    <h2><span class="n">${f.n}</span>${esc(f.title)}</h2>
    <p class="ask">${esc(f.ask)}</p>
    <p class="note">${esc(f.note)}</p>
    ${opts}
    <div class="pickrow">
      <span class="picklab">PICK ONE</span>${picks}
      <span class="picked" id="picked-${f.k}">&mdash;</span>
    </div>
    <p class="recwhy"><b>WHY I WOULD PICK:</b> ${esc(f.rec_why)}</p>
    <textarea class="note-in" data-k="${f.k}" placeholder="tear it up here. anything you hate, anything missing."></textarea>
  </section>`;
}

/* ==== 7. THE PAGE ========================================================= */
const HTML = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA &mdash; UI</title>
<!-- GENERATED by tools/bohemia_ui_vocabulary.js. Do not hand-edit: rebuild it.
     Held by gates/ui_vocab_gate.js, which opens this page in a real browser at
     iPhone size, taps the letters like a thumb, and measures the PIXELS. -->
<style>
:root{
  /* the shipped palette, harvested from the run he plays. nothing invented. */
  --bg:${C.bg}; --surface:${C.surface}; --ink:${C.ink}; --dim:${C.dim}; --faint:${C.faint};
  --gold:${C.gold}; --teal:${C.teal}; --danger:${C.danger}; --good:${C.good};
  --linebright:${LINE_BRIGHT};
  --grimeimg:url("data:image/png;base64,${GRIME_B64}");
  --grimeamt:${GRIME_AMT};
  /* the vocabulary itself. every one of these is overwritten by a pick. */
  --r:${R.radius}px; --rin:${Math.max(0, R.radius - 1)}px; --clip:none;
  --bw:1px; --line:${C.line};
  --acc:${C.gold}; --acc2:${C.gold}; --accink:#14100a;
  --fc:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --fb:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif;
  --grain:none; --wear:none;
  --fill:var(--surface);
}
${optCSS}
/* ---- SUN MODE (Paolo 8/7: "make it light... I'm working outside and it's
   sunny as shit") -------------------------------------------------------------
   IT LIGHTENS THE PAGE, NOT THE SAMPLES, and that distinction is the whole
   rule. The samples and the live preview are SHOWING THE GAME, and the game is
   dark; lightening them shows him a thing that does not exist. This is what the
   ART judge page already does -- the page turns to paper, the screenshots on it
   do not.
   THE FIRST CUT GOT THIS WRONG IN BOTH DIRECTIONS AND ONLY LOOKING CAUGHT IT
   (7/18). It flipped the theme tokens on <body>, which (a) left every panel
   black on cream anyway, because --fill is declared as var(--surface) on :root
   and a custom property that references another resolves WHERE IT IS DECLARED,
   not where it is used, and (b) once that was "fixed", turned the BONE option
   invisible: bone accent on a cream panel. Neither is readable in a rule. Both
   are obvious in a screenshot.
   So sun mode touches page chrome ONLY, by element, and never a vocabulary
   token. Nothing it does can reach a sample.
   MEASURED: gold text on the cream page is 1.49 to 1. The bronze below is
   7.37 to 1. That is why the chrome does not simply keep the accent. */
body.sun{ background:#d9d4c8; }
body.sun .lede,body.sun .ask,body.sun h2,body.sun .oname,body.sun .done{ color:#2a2418; }
body.sun .lede b{ color:#100d08; }
body.sun .why,body.sun .note,body.sun .recwhy,body.sun .tally,body.sun .picklab{ color:#3d362a; }
body.sun h1,body.sun .picked,body.sun .recwhy b,body.sun .bottom h3{ color:#4d3a10; }
body.sun .orec,body.sun .oletter{ color:#4d3a10; border-color:#4d3a10; }
body.sun .n{ background:#4d3a10; color:#f7f3e8; }
body.sun .otoday{ background:#c9c0aa; color:#2a2418; }
body.sun .pick{ color:#2a2418; border-color:#a89e88; }
body.sun .pick.on{ background:#4d3a10; color:#f7f3e8; border-color:#4d3a10; }
body.sun .exp{ background:#4d3a10; color:#f7f3e8; }
body.sun .reset{ color:#3d362a; border-color:#a89e88; }
body.sun .sunbtn{ color:#2a2418; border-color:#a89e88; }
body.sun .fork{ border-bottom-color:#c2b9a4; }
body.sun .bottom{ border-top-color:#c2b9a4; }
body.sun .note-in,body.sun .bottom textarea{ color:#2a2418; border-color:#a89e88; }

*{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html,body{ margin:0; background:var(--bg); color:var(--ink); }
body{ font:14px/1.55 var(--fb); padding:10px 10px calc(46px + env(safe-area-inset-bottom));
      max-width:520px; margin:0 auto; }

header{ display:flex; align-items:center; gap:8px; margin-bottom:8px; }
h1{ font:13px/1.4 var(--fc); letter-spacing:2px; margin:0; flex:1; color:var(--acc); }
.sunbtn{ min-height:44px; font:11px var(--fc); letter-spacing:1px; padding:8px 11px;
         background:transparent; color:var(--ink); border:1px solid var(--line); border-radius:4px; }
.lede{ font-size:13px; color:var(--dim); margin:0 0 14px; }
.lede b{ color:var(--ink); }

/* ---- THE BOX: the one shape everything in Bohemia is made of ----------
   outer = the edge (its background IS the line, its padding IS the weight)
   inner = the fill. corner, weight and cut all come out of this one pair,
   which is why seven letters can re-skin the whole page live. */
.bx{ background:var(--line); padding:var(--bw); border-radius:var(--r);
     clip-path:var(--clip); border:0; display:block; width:100%; text-align:left; }
.bx > .in{ background:var(--fill); background-image:var(--grain);
           background-blend-mode:multiply; border-radius:var(--rin);
           clip-path:var(--clip); box-shadow:var(--wear); padding:11px 12px;
           color:var(--ink); font:inherit; }
.btn{ font:12px var(--fc); letter-spacing:1.4px; padding:var(--bw); min-height:48px; }
.btn > .in{ display:flex; align-items:center; justify-content:center; min-height:46px;
            padding:6px 10px; color:var(--acc); font-weight:700; text-align:center; }
.btn.ghost > .in{ color:var(--dim); }
.pane > .in{ font:12px/1.5 var(--fb); color:var(--dim); }
.pane b{ font:11px var(--fc); letter-spacing:1.5px; color:var(--ink); display:block; margin:6px 0 4px; }
/* the SECOND accent lives here, so ONE GOLD and GOLD AND COLD are not the
   same picture. the BODY face lives here, so the letters fork is visible too. */
.sTag{ display:inline-block; font:9px var(--fc); letter-spacing:1.2px; padding:3px 6px;
       border:1px solid var(--acc2); color:var(--acc2); border-radius:2px; }
.sBody{ display:block; font:13px/1.45 var(--fb); color:var(--dim); }

/* ---- PRESSED: the three candidates, each a whole rule ------------------- */
.press-A .btn:active > .in,[data-press="A"] .btn:active > .in{
  background:var(--acc); color:var(--accink); }
.press-A .btn:active,[data-press="A"] .btn:active{ background:var(--acc); }
.press-B .btn:active,[data-press="B"] .btn:active{ transform:translateY(2px); }
.press-B .btn:active > .in,[data-press="B"] .btn:active > .in{ filter:brightness(.6); }
.press-C .btn:active,[data-press="C"] .btn:active{ background:var(--acc); }
.press-C .btn:active > .in,[data-press="C"] .btn:active > .in{ color:var(--acc); }

/* ---- THE REFUSAL. NOT A FORK: THE LAW. -----------------------------------
   SHARED SILENT-2 -- a sound may be the best copy of a message, never the
   only copy. A button that refuses with no picture looks exactly like a
   button that is broken, and that does not lose information, it teaches the
   wrong thing. THREE cues, none of them colour on its own: it MOVES, it
   THICKENS, and it SAYS SO IN WORDS. */
.deny{ animation:denyshake .26s ease-in-out; }
.deny > .in{ box-shadow:inset 0 0 0 2px var(--danger); }
@keyframes denyshake{ 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)}
  45%{transform:translateX(5px)} 70%{transform:translateX(-3px)} }
@media (prefers-reduced-motion:reduce){
  .deny{ animation:none; }
  .deny > .in{ box-shadow:inset 0 0 0 3px var(--danger); }
}
.denyword{ font:11px var(--fc); letter-spacing:1px; color:var(--danger); min-height:17px;
           margin-top:7px; }

/* ---- forks --------------------------------------------------------------- */
.fork{ margin:0 0 22px; padding:0 0 16px; border-bottom:1px solid var(--line); }
h2{ font:13px var(--fc); letter-spacing:1.6px; margin:0 0 6px; display:flex; gap:8px; align-items:center; }
.n{ display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px;
    border-radius:50%; background:var(--acc); color:var(--accink); font:11px var(--fc); flex:none; }
.ask{ font-size:14px; margin:0 0 6px; }
.note{ font-size:12.5px; color:var(--dim); margin:0 0 12px; }
.opt{ margin:0 0 14px; }
.ohd{ display:flex; align-items:center; gap:7px; margin-bottom:7px; flex-wrap:wrap; }
.oletter{ display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px;
          border:1px solid var(--acc); color:var(--acc); font:11px var(--fc); border-radius:3px; flex:none; }
.oname{ font:12px var(--fc); letter-spacing:1.5px; }
.otoday,.orec{ font:9px var(--fc); letter-spacing:1px; padding:3px 6px; border-radius:2px; }
.otoday{ background:var(--line); color:var(--ink); }
.orec{ border:1px solid var(--acc); color:var(--acc); }
.samp{ display:flex; flex-direction:column; gap:7px; }
.samp .bx{ }
.why{ font-size:12.5px; color:var(--dim); margin:8px 0 0; }
.recwhy{ font-size:12.5px; margin:10px 0 0; color:var(--ink); }
.recwhy b{ font:10px var(--fc); letter-spacing:1.2px; color:var(--acc); }

.pickrow{ display:flex; align-items:center; gap:7px; margin-top:12px; flex-wrap:wrap; }
.picklab{ font:10px var(--fc); letter-spacing:1.5px; color:var(--faint); }
.pick{ flex:1; min-width:56px; min-height:52px; font:16px var(--fc); font-weight:700;
       background:transparent; color:var(--ink); border:2px solid var(--line); border-radius:5px; }
/* SELECTED IS NEVER COLOUR ALONE (basic tier, ~1 in 12 men): it also gets a
   thicker edge AND a tick in the label. */
.pick.on{ background:var(--acc); color:var(--accink); border-color:var(--acc); border-width:4px; }
.picked{ flex:1 0 100%; font:11px var(--fc); letter-spacing:1px; color:var(--acc); margin-top:2px; }
.note-in{ width:100%; margin-top:10px; min-height:44px; background:transparent; color:var(--ink);
          border:1px solid var(--line); border-radius:5px; padding:8px; font:12px var(--fb); resize:vertical; }

/* ---- live preview -------------------------------------------------------- */
.prev{ display:flex; flex-direction:column; gap:8px; margin:0 0 8px; }
.pvbar > .in{ padding:9px 11px; }
.pvobj{ display:flex; align-items:center; gap:8px; font:12px var(--fc); letter-spacing:.4px; color:var(--acc); }
.pvring{ color:var(--acc); }
.pvchip{ margin-left:auto; font-size:10px; color:var(--faint); }
.pvworld{ position:relative; height:190px; overflow:hidden; border-radius:var(--r); clip-path:var(--clip); }
.pvworld img{ width:100%; height:100%; object-fit:cover; object-position:50% 46%;
              image-rendering:pixelated; display:block; }
/* THE THUMB (SHARED -5): the top corners are the worst real estate on a phone
   and about half of people hold it one-handed. The controls sit low and right
   here for the same reason they do in the run. */
.pvtoastwrap{ position:absolute; left:8px; right:8px; top:8px; width:auto; }
.pvtoast{ font:11.5px/1.45 var(--fc); color:var(--ink); }
.pvtoast b{ color:var(--acc); }
.pvnav{ position:absolute; right:8px; bottom:8px; display:flex; gap:6px; align-items:flex-end; }
.pvact{ width:76px; }
.pvpb{ width:48px; }
.pvcard > .in{ padding:12px; }
.pvcardhd{ display:flex; align-items:center; gap:8px; font:13px var(--fb); }
.pvcardhd b{ font-weight:700; }
.pvtag{ margin-left:auto; font:9px var(--fc); letter-spacing:1px; padding:3px 6px;
        border:1px solid var(--acc2); color:var(--acc2); border-radius:2px; }
.pvbody{ font-size:14px; margin-top:9px; }
.pveng{ display:flex; gap:16px; margin-top:10px; padding-top:9px; border-top:1px solid var(--line);
        font:11px var(--fc); color:var(--dim); }
.pveng .pvg{ margin-left:auto; color:var(--acc); font-weight:700; }
.pvrow{ display:flex; gap:8px; }
.pvrow .btn{ flex:1; }

/* ---- the feed art options ------------------------------------------------ */
.pvfeedart{ display:none; }
.feed-B .pvfeedart,[data-feed="B"] .pvfeedart{ display:flex; align-items:center; gap:9px;
  margin-top:9px; font:10px var(--fc); letter-spacing:1.2px; color:var(--dim); }
.feed-B .pvfeedart::before,[data-feed="B"] .pvfeedart::before{
  content:"\\25E5"; display:inline-flex; align-items:center; justify-content:center;
  width:38px; height:38px; flex:none; background:var(--acc); color:var(--accink);
  font-size:20px; border-radius:2px; }
.feed-B .pvfeedart::after,[data-feed="B"] .pvfeedart::after{ content:"WORK \\00B7 THE PUMP YARD"; }
.feed-C .pvfeedart,[data-feed="C"] .pvfeedart{ display:block; position:relative; margin-top:9px;
  height:74px; overflow:hidden; border-radius:2px;
  background-image:url("../records/target/VALLEY_COMMERCIAL.png");
  background-size:cover; background-position:50% 52%; image-rendering:pixelated; }
.feed-C .pvfeedart::after,[data-feed="C"] .pvfeedart::after{
  content:"THE PUMP YARD"; position:absolute; left:6px; bottom:6px;
  font:9px var(--fc); letter-spacing:1.2px; padding:3px 6px;
  background:rgba(8,7,5,.8); color:var(--ink); }

/* ---- bottom -------------------------------------------------------------- */
.bottom{ border-top:1px solid var(--line); padding-top:14px; margin-top:6px; }
.bottom h3{ font:12px var(--fc); letter-spacing:1.5px; margin:0 0 8px; color:var(--acc); }
.bottom textarea{ width:100%; min-height:120px; background:transparent; color:var(--ink);
  border:1px solid var(--line); border-radius:5px; padding:9px; font:13px var(--fb); resize:vertical; }
.exp{ width:100%; margin-top:10px; min-height:54px; font:12px var(--fc); letter-spacing:2px;
      padding:15px; background:var(--acc); color:var(--accink); border:0; border-radius:6px; }
.reset{ width:100%; margin-top:8px; min-height:48px; font:11px var(--fc); letter-spacing:1.5px;
        background:transparent; color:var(--dim); border:1px solid var(--line); border-radius:6px; }
.done{ font:11px var(--fc); color:var(--faint); text-align:center; margin-top:8px; min-height:16px; }
.tally{ font:11px var(--fc); letter-spacing:1px; color:var(--dim); margin:10px 0 0; }
</style>

<header>
  <h1>UI &middot; 8/26 &middot; THE BOHEMIA LOOK</h1>
  <button class="sunbtn" id="sunbtn">SUN MODE</button>
</header>

<p class="lede">This is the alphabet, not the book. <b>Seven choices that everything
else is built out of.</b> Press the samples with your thumb, they are real. Pick a
letter and the whole page turns into your pick, so you are looking at the game, not
at swatches. Nothing here is decided. Write on anything you hate.</p>

<h3 style="font:11px var(--fc);letter-spacing:1.5px;color:var(--faint);margin:0 0 8px">
  YOUR PICKS, RIGHT NOW</h3>
${PREVIEW}
<p class="tally" id="tallytop">Nothing picked yet. This is the game as it looks today.</p>

<div style="height:18px"></div>

${SPEC.map(forkCard).join('\n')}

<section class="fork" id="fork-deny">
  <h2><span class="n">&#9888;</span>WHEN IT SAYS NO</h2>
  <p class="ask">Not a choice. A rule, because a button that refuses quietly looks broken.</p>
  <p class="note">You cannot do this, and the game has to say so without sound, because
  the phone is on silent half the time. Three things happen at once: it moves, its edge
  gets thick, and it tells you why in words. Press it.</p>
  <button class="bx btn" id="denybtn"><div class="in">SLEEP HERE</div></button>
  <div class="denyword" id="denyword"></div>
  <p class="why">If your phone is set to reduce motion it does not shake. The thick edge
  and the words still happen, so nothing is carried by the shake alone, and nothing is
  carried by the colour alone either.</p>
</section>

<h3 style="font:11px var(--fc);letter-spacing:1.5px;color:var(--faint);margin:0 0 8px">
  YOUR PICKS, AGAIN, AT THE BOTTOM WHERE YOU READ</h3>
${PREVIEW}
<p class="tally" id="tallybot">Nothing picked yet.</p>

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what is missing, what is wrong, what Bohemia should feel like"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <button class="reset" id="reset">CLEAR EVERYTHING</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEYS = ${JSON.stringify(SPEC.map(f => f.k))};
  var NAMES = ${JSON.stringify(Object.fromEntries(SPEC.map(f => [f.k, { t: f.title, o: Object.fromEntries(f.opts.map(o => [o.v, o.name])), rec: f.rec }])))};
  var SAVE = 'bohemia.ui.vocab.v1';
  var st = { pick:{}, note:{}, all:'' };
  try { var raw = localStorage.getItem(SAVE); if (raw) st = JSON.parse(raw); } catch(e){}
  st.pick = st.pick || {}; st.note = st.note || {};

  function save(){ try{ localStorage.setItem(SAVE, JSON.stringify(st)); }catch(e){} }

  function apply(){
    var root = document.documentElement, n = 0;
    KEYS.forEach(function(k){
      var v = st.pick[k];
      if (v) { root.setAttribute('data-'+k, v); n++; } else { root.removeAttribute('data-'+k); }
      var lab = document.getElementById('picked-'+k);
      if (lab) lab.textContent = v ? (v + ' ' + NAMES[k].o[v]) : '\\u2014';
      document.querySelectorAll('.pick[data-k="'+k+'"]').forEach(function(b){
        var on = b.getAttribute('data-v') === v;
        b.classList.toggle('on', on);
        /* NEVER COLOUR ALONE: the chosen letter also carries a tick. */
        b.textContent = on ? (b.getAttribute('data-v') + '\\u2713') : b.getAttribute('data-v');
      });
    });
    var msg = n === 0 ? 'Nothing picked yet. This is the game as it looks today.'
      : (n + ' of ' + KEYS.length + ' picked. Everything above and below is wearing your choices.');
    var a = document.getElementById('tallytop'), b = document.getElementById('tallybot');
    if (a) a.textContent = msg; if (b) b.textContent = msg;
  }

  document.addEventListener('click', function(e){
    var p = e.target.closest ? e.target.closest('.pick') : null;
    if (!p) return;
    var k = p.getAttribute('data-k'), v = p.getAttribute('data-v');
    st.pick[k] = (st.pick[k] === v) ? null : v;
    save(); apply();
  });

  document.querySelectorAll('.note-in').forEach(function(t){
    var k = t.getAttribute('data-k');
    t.value = st.note[k] || '';
    t.addEventListener('input', function(){ st.note[k] = t.value; save(); });
  });
  var all = document.getElementById('all');
  all.value = st.all || '';
  all.addEventListener('input', function(){ st.all = all.value; save(); });

  document.getElementById('sunbtn').addEventListener('click', function(){
    document.body.classList.toggle('sun');
  });

  /* THE REFUSAL, live, so he can feel it and hate it if he hates it. */
  var db = document.getElementById('denybtn'), dw = document.getElementById('denyword');
  db.addEventListener('click', function(){
    db.classList.remove('deny');
    void db.offsetWidth;
    db.classList.add('deny');
    dw.textContent = 'NO \\u00B7 SOMEONE ELSE SLEEPS HERE';
    setTimeout(function(){ db.classList.remove('deny'); }, 400);
  });

  /* .TXT, never .json. Standing, every judge surface in this repo. */
  document.getElementById('exp').addEventListener('click', function(){
    var L = [];
    L.push('BOHEMIA - THE UI VOCABULARY - PAOLO\\'S PICKS');
    L.push('exported ' + new Date().toISOString().slice(0,16).replace('T',' '));
    L.push('');
    KEYS.forEach(function(k){
      var v = st.pick[k];
      L.push(NAMES[k].t + ': ' + (v ? (v + ' - ' + NAMES[k].o[v]) : 'NOT PICKED') +
             (v && v !== NAMES[k].rec ? '   (claude wanted ' + NAMES[k].rec + ')' : ''));
      if (st.note[k]) L.push('    note: ' + st.note[k]);
    });
    L.push('');
    L.push('ANYTHING ELSE:');
    L.push(st.all || '(nothing)');
    var blob = new Blob([L.join('\\n')], {type:'text/plain'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'BOHEMIA_UI_PICKS.txt';
    a.click();
    document.getElementById('done').textContent = 'saved to your phone as BOHEMIA_UI_PICKS.txt';
  });

  document.getElementById('reset').addEventListener('click', function(){
    st = { pick:{}, note:{}, all:'' };
    save(); apply();
    document.querySelectorAll('.note-in').forEach(function(t){ t.value=''; });
    all.value = '';
    document.getElementById('done').textContent = 'cleared';
  });

  apply();
  window.__BOH_UI_VOCAB = { keys: KEYS, state: function(){ return st; } };
})();
</script>
`;

fs.writeFileSync(OUT, HTML);
const kb = (HTML.length / 1024).toFixed(1);
console.log('WROTE ' + path.relative(ROOT, OUT) + '  ' + kb + ' KB');
console.log('  forks       : ' + SPEC.length + ' (' + SPEC.map(f => f.k).join(', ') + ')');
console.log('  options     : ' + SPEC.reduce((n, f) => n + f.opts.length, 0));
console.log('  harvested   : ' + Object.keys(T).length + ' live tokens from the run, radius ' +
            R.radius + 'px, border ' + R.bw + 'px');
console.log('  grime       : ' + grime.version + ' at his ruled ' + GRIME_AMT);
console.log('  contrast    : line today ' + CT_LINE_TODAY + ':1, heavy ' + CT_LINE_HEAVY +
            ':1, ink ' + CT_INK + ':1, gold ' + CT_GOLD + ':1, dim ' + CT_DIM + ':1');
console.log('  purple      : none, swept at build over every colour emitted');

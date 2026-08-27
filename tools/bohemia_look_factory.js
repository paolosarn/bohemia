#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- THE LOOK FACTORY  (UI lane, 8/27/26)

   REUSE CHECK: banks/BOHEMIA_TYPEFACE_MONO_8_27_26.txt (the typeface, IBM Plex
   Mono, OFL, downloaded 8/27 on his standing permission and stored as a bank
   like every other asset in this repo). No pixels are cooked here at all -- this
   factory cooks CSS, and its only art input is that bank. The grime bank was
   deliberately NOT opened: he killed THE DIRT, all three options, on 8/27, and
   MP.L01 says grime belongs to the room and not to the readout.

   WHAT THIS IS. On 8/27 06:07 Paolo answered the vocabulary page. Four forks got
   a yes, two got killed outright, one he could not see. Until this file existed
   that verdict lived on a judge page and NOWHERE ELSE -- the game he actually
   plays was still wearing the old chrome. UI-9's acceptance line was one
   sentence: THE RUN WEARS THE LOOK HE PICKED.

   HIS VERDICT IS THE INPUT. Not a copy of it, THE input:
     THE CORNER   C  CUT ............ two corners sliced at 45 degrees, 10px deep
     THE LINE     B  HEAVY .......... 2px, his own ink at 45% over his own surface
     THE COLOUR   B  GOLD AND COLD .. gold is YOU, cold is THE MACHINE
     THE LETTERS  A  ALL TYPEWRITER-WIDTH
     THE DIRT ..... killed, all three. Nothing here is textured.
     THE FEED POST  killed, all three. The slot stays empty.
     PRESSED      A  FLIP ........... ruled 14:12 the same day, once he could SEE it
   Record: records/BOHEMIA_UI_VERDICT_THE_LOOK_8_27_26.txt

   ONE CANONICAL BODY (ENGINE SYNC LAW). The look is written ONCE, to
   engine/bohemia_look.css, and stamped into every surface that wears it between
   LOOK:BEGIN / LOOK:END markers. There is no second copy of the look anywhere.
   Re-running this file is idempotent.

     node tools/bohemia_look_factory.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = (p) => path.join(ROOT, p);

/* ==== 1. HIS PALETTE, READ FROM THE RUN, NEVER RETYPED ==================== */
const RUN_SRC = R('slices/BOHEMIA_RUN_SLICE_7_26_26.html');
const runHtml = fs.readFileSync(RUN_SRC, 'utf8');
const T = {};
(runHtml.match(/--[a-z-]+:#[0-9a-fA-F]{3,8}/g) || []).forEach((d) => {
  const [k, v] = d.split(':'); if (!(k in T)) T[k] = v;
});
const C = {
  bg: T['--bg'] || '#0c0a07', surface: T['--surface'] || '#16110a',
  ink: T['--ink'] || '#ece2cf', dim: T['--dim'] || '#9c8f76',
  faint: T['--faint'] || '#6c614f', gold: T['--gold'] || '#d8a742',
  goldsoft: T['--gold-soft'] || '#372a10', good: T['--good'] || '#86ac52',
  teal: T['--teal'] || '#61a89f', amber: T['--amber'] || '#d47a30',
  danger: T['--danger'] || '#d9563a'
};

/* PURPLE RESERVATION. Purple belongs to the Amalgamation and is never chrome.
   Swept at BUILD time so a purple token cannot reach a screen at all. */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function isPurple(hex) {
  const [r, g, b] = rgb(hex);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 26 || mx < 40) return false;
  let h;
  if (mx === r) h = ((g - b) / (mx - mn)) % 6;
  else if (mx === g) h = (b - r) / (mx - mn) + 2;
  else h = (r - g) / (mx - mn) + 4;
  h = (h * 60 + 360) % 360;
  return h >= 258 && h <= 320;
}
for (const [k, v] of Object.entries(C)) {
  if (isPurple(v)) { console.error('PURPLE RESERVATION: ' + k + ' ' + v + '. Refusing to build.'); process.exit(2); }
}

/* WCAG, so every claim in here is a number and not an adjective */
const lum = (h) => { const c = rgb(h).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
const contrast = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
const mix = (a, b, t) => '#' + [0, 1, 2].map((i) => Math.round(rgb(a)[i] + (rgb(b)[i] - rgb(a)[i]) * t).toString(16).padStart(2, '0')).join('');

/* ==== 2. THE FOUR THINGS HE PICKED, AS NUMBERS =========================== */
const CUT = 10;    /* THE CORNER: C CUT, 10px deep */
const BW  = 2;     /* THE LINE:   B HEAVY, 2px */
const LINE = mix(C.surface, C.ink, 0.45);   /* his own ink at 45%, no new hue */
/* the inner chamfer of THE BOX, inset from the outer one by exactly BW,
   perpendicular. Two parallel 45-degree lines BW apart differ by BW*sqrt2 in
   intercept, so: cutIn = cut - bw*(2 - sqrt2). Not eyeballed. */
const CUTIN = +(CUT - BW * (2 - Math.SQRT2)).toFixed(2);
const poly = (c) => `polygon(${c}px 0, 100% 0, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, 0 100%, 0 ${c}px)`;
/* the sheet variant: a bottom sheet's bottom corners are off the screen, so only
   the top-left cut is ever visible. Same rule, not a second shape. */
const polyTop = (c) => `polygon(${c}px 0, 100% 0, 100% 100%, 0 100%, 0 ${c}px)`;

/* ==== 3. THE TYPEFACE, OUT OF THE BANK =================================== */
const BANK = R('banks/BOHEMIA_TYPEFACE_MONO_8_27_26.txt');
const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
if (bank.advance_width !== 600 || bank.upem !== 1000) {
  console.error('the typeface bank is not the proved monospace'); process.exit(2);
}
if (!/Open Font License/i.test(bank.licence)) {
  console.error('refusing to embed a typeface without an embeddable licence'); process.exit(2);
}
const faces = bank.faces.map((f) =>
`@font-face{ font-family:'BohemiaMono'; font-style:normal; font-weight:${f.weight};
  font-display:block;
  src:url(data:font/woff2;base64,${f.b64}) format('woff2'); }`).join('\n');

/* ==== 4. THE LOOK ========================================================= */
const CT = {
  line:  contrast(LINE, C.surface).toFixed(2),
  gold:  contrast(C.gold, C.surface).toFixed(2),
  cold:  contrast(C.teal, C.surface).toFixed(2),
  ink:   contrast(C.ink, C.surface).toFixed(2),
  press: contrast('#14100a', C.gold).toFixed(2)
};

const CSS = `/* ============================================================================
   BOHEMIA -- THE LOOK. GENERATED by tools/bohemia_look_factory.js. Do not edit.
   Built from Paolo's 8/27 verdict; the verdict is the input, this is the output.
     CORNER  C CUT ${CUT}px  ·  LINE  B HEAVY ${BW}px ${LINE} (${CT.line}:1)
     COLOUR  B GOLD AND COLD  ·  LETTERS  A ALL TYPEWRITER-WIDTH
   ========================================================================== */
${faces}

:root{
  /* --- THE LETTERS. His ruling was a CATEGORY: every letter the same width,
     everywhere, labels and body alike. --sans keeps its name so nothing that
     already asks for it breaks, and it now answers with the typewriter. --- */
  --fmono:'BohemiaMono',ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --mono:var(--fmono);
  --sans:var(--fmono);
  /* THE ONE EXCEPTION, and it is not a letter. The nav ring is eight arrows and
     the typeface carries only two of them, so six would arrive from a different
     face inside the same ring. Eight arrows from one font beats seven from the
     right one. Glyph controls only. Never text. */
  --fglyph:-apple-system,"Segoe UI Symbol","Apple Symbols","Noto Sans Symbols 2",sans-serif;

  /* --- THE CORNER: C CUT. Two corners sliced at 45 degrees, ${CUT}px deep.
     The world is drawn at 45 degrees and now the interface agrees with it. --- */
  --cut:${CUT}px; --cutin:${CUTIN}px; --r:0px;
  --clip:${poly(CUT)};
  --clipin:${poly(CUTIN)};
  --cliptop:${polyTop(CUT)};
  --cliptopin:${polyTop(CUTIN)};

  /* --- THE LINE: B HEAVY. ${BW}px, his own ink at 45% over his own surface.
     ${CT.line} to 1 against the panel. The old hairline measured 1.22. --- */
  --bw:${BW}px; --line:${LINE}; --line-soft:${mix(C.surface, C.ink, 0.22)};

  /* --- THE COLOUR: B GOLD AND COLD, and this is a RULE, not a swatch. --------
     GOLD IS YOU AND WHAT YOU DO. Verbs. The objective. Your choices. Anything
       you are about to press.                      (${CT.gold}:1 on the panel)
     COLD IS THE MACHINE. The phone, the network, counts you did not choose,
       timestamps, readouts, the place-name.         (${CT.cold}:1 on the panel)
     The world has no cold in it, so the interface never competes with a lamp
     (LIGHT = TERRITORY) and the phone reads as a different object from the
     street (FFX.L03: the interface lives in a hue the world does not use).
     NO ESSENTIAL INFORMATION BY COLOUR ALONE: gold and cold say WHOSE a thing
     is, never WHAT it says. Every one of them is also labelled in words. --- */
  --acc:${C.gold}; --accink:#14100a;
  --cold:${C.teal}; --coldsoft:${mix(C.surface, C.teal, 0.22)};
  --acc2:var(--cold);

  --fill:${C.surface};
  /* a thing you can press sits slightly proud of a thing you cannot. Hodent's
     FORM FOLLOWS FUNCTION: pressable has to LOOK pressable before it is pressed,
     not only after. Same family, no new hue. */
  --fill-lift:${mix(C.surface, C.gold, 0.09)};
  /* THE DIRT is dead, all three (8/27). The interface is not textured. */
  --grain:none; --wear:none;
}

/* ---- THE BOX: the one shape everything in Bohemia is made of --------------
   outer = the edge (its background IS the line, its inset IS the weight)
   inner = the fill, chamfered ${CUTIN}px so the line follows the diagonal at
           exactly ${BW}px instead of the cut slicing straight through it.

   IT NEEDS NO EXTRA MARKUP. The judge page could afford a wrapper div per box;
   the game cannot, because its buttons are built by the RUN lane's JavaScript
   and a LOOK lane does not reach into another lane's DOM. So the inner is a
   ::before, held under the text by a stacking context on the element itself.
   Same picture, zero markup, nothing in engine/ has to change. --- */
.bx{ position:relative; isolation:isolate; border:0; background:var(--line);
     -webkit-clip-path:var(--clip); clip-path:var(--clip);
     border-radius:0; }
.bx::before{ content:''; position:absolute; inset:var(--bw); z-index:-1;
     background:var(--fill);
     -webkit-clip-path:var(--clipin); clip-path:var(--clipin); }
/* the sheet: same rule, and only the top-left cut is ever on screen */
.bx-top{ -webkit-clip-path:var(--cliptop); clip-path:var(--cliptop); }
.bx-top::before{ -webkit-clip-path:var(--cliptopin); clip-path:var(--cliptopin); }
/* a box that belongs to the machine wears the cold edge instead of the warm one */
.bx-cold{ background:var(--cold); }

/* ---- PRESSED: A FLIP, AND IT IS HIS, RULED 8/27 14:12. --------------------
   THIS FORK HAD NO VOTE AT 06:07 and he said exactly why: I typed three
   paragraphs about what a press feels like instead of showing him. He was right
   and it was worse than he knew -- A THUMB COVERS THE BUTTON, so the one fork
   whose whole subject is what happens under a finger was the one fork he
   physically could not see.
   The presses were rebuilt to play themselves with a ghost fingertip. He opened
   the page again and answered in one tap. THE FIX FOR A MISSING VOTE WAS NEVER A
   BETTER EXPLANATION, IT WAS SHOWING HIM THE THING.
   FLIP: the whole box inverts to solid gold with dark ink (${CT.press} to 1),
   because a change that only happens in the middle of a button is a change his
   thumb is sitting on. It is the FF10 move -- the selected row is a solid bar,
   not an outline. --- */
.bx:active::before{ background:var(--acc); }
.bx:active{ background:var(--acc); color:var(--accink); }
.bx-cold:active::before{ background:var(--cold); }
.bx-cold:active{ background:var(--cold); color:var(--accink); }

@media (prefers-reduced-motion:reduce){ .bx,.bx::before{ transition:none; } }
`;

/* ==== 5. WRITE IT ONCE, STAMP IT EVERYWHERE ============================== */
const OUT = R('engine/bohemia_look.css');
fs.writeFileSync(OUT, CSS);

const BEGIN = '/* LOOK:BEGIN */';
const END = '/* LOOK:END */';
function stamp(rel) {
  const p = R(rel);
  let h = fs.readFileSync(p, 'utf8');
  const a = h.indexOf(BEGIN), b = h.indexOf(END);
  if (a < 0 || b < 0) { console.error('  ! ' + rel + ' has no LOOK:BEGIN/END markers'); return false; }
  const next = h.slice(0, a + BEGIN.length) + '\n' + CSS + '\n' + h.slice(b);
  if (next === h) { console.log('  = ' + rel + ' already current'); return true; }
  fs.writeFileSync(p, next);
  console.log('  > ' + rel + ' stamped');
  return true;
}


/* ==== 5b. THE SURFACE HE ACTUALLY PLAYS ==================================
   THE RUN TAB DOES NOT SHOW THE RUN. The workshop maps it with one line --
   `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p` -- so tapping RUN
   opens slices/BOHEMIA_CITY_WORLD.html, and slices/BOHEMIA_RUN_CURRENT.html
   sits behind a panel nothing routes to. Putting his look on the run alone was
   the exact failure this whole turn is about, committed again, one file over.

   AND THAT SURFACE WAS FETCHING ITS TYPEFACE FROM GOOGLE. A render-unblocked
   <link> to fonts.googleapis.com for 'Space Grotesk', a proportional sans, with
   system-ui behind it. So on a good network the game he plays contradicts his
   ALL TYPEWRITER-WIDTH ruling, on a bad one it is whatever the phone had, and
   either way the demo phones a third party on load.

   ONLY THE TYPEFACE IS STAMPED HERE, NOT THE LOOK. The city has its own --acc,
   --line, --ink and --bg, older than mine and belonging to another lane. Writing
   my token block over them would repaint somebody else's room from the hallway.
   The letters are HIS RULING and they travel; the colours wait for that lane
   (backlog UI-13). */
const CITY = R('slices/BOHEMIA_CITY_WORLD.html');
const TYPE_ONLY = `/* GENERATED by tools/bohemia_look_factory.js -- the typeface only.
   Paolo 8/27: ALL TYPEWRITER-WIDTH. Embedded, so nothing is fetched at load. */
${faces}
:root{ --fmono:'BohemiaMono',ui-monospace,"SF Mono",Menlo,Consolas,monospace; }
`;
if (fs.existsSync(CITY)) {
  let c = fs.readFileSync(CITY, 'utf8');
  const before = c;
  /* the two external font links go entirely: the face is in the file now */
  c = c.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/g, '');
  c = c.replace(/<noscript><link href="https:\/\/fonts\.googleapis\.com[^<]*<\/noscript>\n?/g, '');
  /* LONGHANDS, NOT THE `font:` SHORTHAND. Every other shipped surface in this
     repo sets type with longhands, and ui_vocab_gate holds that as a rule across
     all of them. The shorthand is NOT broken -- webkit_gate proves both engines
     resolve it identically, and that leg exists because I once claimed it was the
     bug and was wrong. But a consistency rule I wrote is still a rule, and the
     first thing I did with it was break it on somebody else's file. */
  c = c.replace(/font:14px\/1\.4 'Space Grotesk',system-ui,sans-serif/g,
                "font-family:var(--fmono);font-size:14px;line-height:1.4");
  c = c.replace(/font:14px\/1\.4 var\(--fmono\)/g,
                "font-family:var(--fmono);font-size:14px;line-height:1.4");
  const a = c.indexOf('/* LOOK:TYPE:BEGIN */'), b = c.indexOf('/* LOOK:TYPE:END */');
  if (a >= 0 && b >= 0) {
    c = c.slice(0, a + 21) + '\n' + TYPE_ONLY + c.slice(b);
  } else {
    /* first insertion: park it at the top of the city's own stylesheet */
    const st = c.indexOf('<style>');
    c = c.slice(0, st + 7) + '\n/* LOOK:TYPE:BEGIN */\n' + TYPE_ONLY + '/* LOOK:TYPE:END */\n' + c.slice(st + 7);
  }
  if (c !== before) { fs.writeFileSync(CITY, c); console.log('  > slices/BOHEMIA_CITY_WORLD.html got the typeface (and lost two calls to Google)'); }
  else console.log('  = slices/BOHEMIA_CITY_WORLD.html already current');
}

const SURFACES = ['slices/BOHEMIA_RUN_SLICE_7_26_26.html', 'slices/BOHEMIA_ALPHA_0_9.html'];
let allOk = true;
console.log('THE LOOK, built from his 8/27 verdict:');
console.log('  typeface    : ' + bank.family + ' ' + bank.font_version + ', ' +
            bank.faces.map((f) => f.weight).join('/') + ', ' + bank.total_bytes_embedded +
            ' bytes, every glyph ' + bank.advance_width + '/' + bank.upem + ' em');
console.log('  corner      : CUT ' + CUT + 'px outer, ' + CUTIN + 'px inner (computed, not eyeballed)');
console.log('  line        : HEAVY ' + BW + 'px ' + LINE + ' = ' + CT.line + ':1 on the panel');
console.log('  gold is you : ' + C.gold + ' = ' + CT.gold + ':1   cold is the machine: ' + C.teal + ' = ' + CT.cold + ':1');
console.log('  pressed     : FLIP, HIS, ruled 8/27 14:12, ' + CT.press + ':1 inverted');
console.log('  css         : engine/bohemia_look.css (' + CSS.length + ' bytes, one canonical body)');
for (const s of SURFACES) allOk = stamp(s) && allOk;
process.exit(allOk ? 0 : 1);

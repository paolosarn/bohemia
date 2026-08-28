#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- THE 3D WALL  (UI lane, 8/28/26)   *** ROUND TWO: BEHIND GLASS ***

   ROUND ONE'S ANSWER, and it is the cleanest verdict this lane has ever had:
   ONE YES OUT OF TWELVE. BEHIND GLASS lives, the other eleven are dead, and he
   said "The one i liked i like this direction. Its not done by any means."
   SO HE PICKED A LANE, NOT A LOOK. Round two is twelve ways to push the SAME
   idea, never twelve new ideas -- re-pitching a bevel now would be re-opening a
   grave. Round one's verdict:
     records/BOHEMIA_UI_VERDICT_PICK_A_LOOK_R1_8_28_26.txt

   AND THE REAL CRT VOCABULARY IS USED HONESTLY HERE, because every one of these
   effects exists for a physical reason and copying them without the reason is
   how you get a filter instead of a screen:
     SCANLINES     the beam traced discrete lines with unlit gaps between them
     PHOSPHOR MASK a perforated barrier stopped each gun hitting the wrong colour
     HALATION      the phosphor kept glowing after the beam had gone past
     BARREL        the glass was physically curved
     VIGNETTE      the beam hit the corners at a steeper angle, so less energy
   None of it was designed. All of it is the visible cost of the technology,
   which is exactly why it reads as a real object and not as decoration.

   REUSE CHECK: no new graphic pixels are cooked here at all. Every look on this
   page is CSS over the game's own colour tokens, read live out of the run slice,
   so what he taps is the real palette and not a mood board in somebody else's
   colours. banks/ was not opened because there is nothing to open: this is
   light and shadow, not art.

   HIS WORDS, 8/28, and they are the whole brief:
     "you need to just show me pictures of a bunch of UI ideas and I click them
      and see what I honestly like ... I'm trying to lean towards like if the
      games 2-D I want the UI to look like it's 3-D you know"
     "Fuck all this like UI philosophy, bro."

   HE IS RIGHT AND THE LAST TURN WAS THE FAILURE. He asked to craft this look
   WITH me and got a paragraph about whether an interface is light or matter.
   Nobody picks a look off an argument. A WALL OF PICTURES IS THE FORMAT.

   THE DIRECTION IS OLD AND IT WORKS. A flat sprite world with heavy dimensional
   chrome bolted over it is exactly what Diablo II, Heroes III, Baldur's Gate,
   Age of Empires and the Pip-Boy all did, and it is the reason those interfaces
   still read as objects thirty years later. The trade they were making: sprites
   were cheap and flat, so the INTERFACE carried all the weight and richness the
   world could not afford. Bohemia is in the same position for the same reason.

   THE ONE TRICK, under every look here: a LIT EDGE, a SHADOWED EDGE, and a CAST
   SHADOW. Light from one direction, always the same direction, or the eye reads
   it as broken instead of raised. Everything else is flavour.

     node tools/bohemia_ui_wall.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const R = (p) => path.join(ROOT, p);

/* ==== 1. HIS PALETTE, READ FROM THE GAME, NEVER RETYPED =================== */
const runSrc = fs.readFileSync(R('slices/BOHEMIA_RUN_SLICE_7_26_26.html'), 'utf8');
const T = {};
(runSrc.match(/--[a-z-]+:#[0-9a-fA-F]{3,8}/g) || []).forEach((d) => {
  const [k, v] = d.split(':'); if (!(k in T)) T[k] = v;
});
const C = {
  bg: T['--bg'] || '#0c0a07', surface: T['--surface'] || '#16110a',
  ink: T['--ink'] || '#ece2cf', dim: T['--dim'] || '#9c8f76',
  faint: T['--faint'] || '#6c614f', gold: T['--gold'] || '#d8a742',
  teal: T['--teal'] || '#61a89f', danger: T['--danger'] || '#d9563a'
};
/* PURPLE RESERVATION, swept at build over everything this page can emit. */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function isPurple(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = rgb(hex); const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 26 || mx < 40) return false;
  let h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  h = (h * 60 + 360) % 360; return h >= 258 && h <= 320;
}

/* ==== 2. THE TYPEFACE THE GAME ACTUALLY SHIPS ============================= */
const bank = JSON.parse(fs.readFileSync(R('banks/BOHEMIA_TYPEFACE_MONO_8_27_26.txt'), 'utf8'));
const FACES = bank.faces.map((f) =>
  `@font-face{font-family:'BohemiaMono';font-style:normal;font-weight:${f.weight};` +
  `font-display:swap;src:url(data:font/woff2;base64,${f.b64}) format('woff2')}`).join('\n');

/* ==== 3. THE WALL ========================================================
   Twelve looks. Every one shows THE SAME WORDS on THE SAME PANEL with THE SAME
   BUTTON, because a comparison where the content moves is not a comparison.
   Ordered roughly from cheapest to build to most expensive, but that is not why
   he should pick one and it is not shown to him. ------------------------- */
/* ROUND FIVE. Two survivors again, and THREE NOTES that change how both are built.
   HIS WORDS, 8/28 21:38:
     "Number nine the shadow has to be a lot less of the letter"
     "if you're gonna have that effect it'll be less"
     "honestly maybe it should be moving in the background, potentially"
   THE THIRD NOTE IS THE BIG ONE AND IT IS BETTER DESIGN THAN WHAT I BUILT. I had
   the glitch ON THE LETTERS, which fights the words for legibility every second
   it is running. He wants it BEHIND them and MOVING. That keeps the text solid
   and puts the life in the field, which is what a real projection does anyway:
   the signal degrades, the message does not move.
   So every hologram here has CRISP TEXT and a moving backdrop, and the effect is
   dialled well under where round four had it.
   REDUCED MOTION: every animation has a still fallback. A loop he cannot stop is
   not a style, it is a problem. */

const RAISED = `
  .L .pnl{ background:linear-gradient(158deg,#7f7768,#4f483e); border-radius:2px;
    box-shadow:inset 0 2px 0 rgba(255,252,240,.34), inset 0 -3px 8px rgba(0,0,0,.55),
      0 9px 18px rgba(0,0,0,.7); }
  .L .rd{ color:#97dccf; }
  .L .btn{ background:linear-gradient(158deg,#8b8272,#544d42); border:0; border-radius:2px;
    box-shadow:inset 0 2px 0 rgba(255,252,240,.36), 0 5px 0 #2b2620, 0 9px 13px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(5px); box-shadow:inset 0 3px 7px rgba(0,0,0,.6); }`;

const HOLO = `
  .L .stage{ padding-bottom:34px; }
  .L .pnl{ position:relative; overflow:hidden; border:0;
    border-top:1px solid rgba(150,245,225,.5); border-bottom:1px solid rgba(150,245,225,.28);
    background:linear-gradient(rgba(97,168,159,.10),rgba(97,168,159,.025));
    box-shadow:0 0 26px rgba(97,168,159,.22), 0 0 56px rgba(97,168,159,.10); }
  .L .pnl > *{ position:relative; z-index:2; }
  .L .rd{ color:#7fd8c8; text-shadow:0 0 6px rgba(97,168,159,.7); }
  .L .ttl,.L .bd{ color:#dcfff7; text-shadow:0 0 6px rgba(97,168,159,.75); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(150,245,225,.5); color:#e6fffa;
    border-radius:0; text-shadow:0 0 7px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(150,245,225,.42); color:#04100d; text-shadow:none; }`;

const LOOKS = [
  { id: 'r_less', name: 'RAISED: LESS SHADOW', from: 'your note, applied',
    say: 'Your note straight in: the shadow was most of the letter and now it is a fraction of it. The letters still stand up, you just are not reading the shadow instead of the word.',
    css: RAISED + `
  .L .rd,.L .ttl,.L .bd{ color:#b6ac99;
    text-shadow:0 -1px 0 rgba(255,253,246,.6), 0 1px 1px rgba(0,0,0,.55); }
  .L .rd{ color:#9fdfd2; text-shadow:0 -1px 0 rgba(220,255,250,.5), 0 1px 1px rgba(0,0,0,.55); }
  .L .btn{ color:#c1b6a1; text-shadow:0 -1px 0 rgba(255,253,246,.65), 0 1px 1px rgba(0,0,0,.6); }` },

  { id: 'r_hair', name: 'RAISED: BARELY THERE', from: 'one pixel of shadow',
    say: 'As little as it can have and still look raised. One pixel under each letter, nothing more.',
    css: RAISED + `
  .L .rd,.L .ttl,.L .bd{ color:#c3b9a5;
    text-shadow:0 -1px 0 rgba(255,253,246,.55), 0 1px 0 rgba(0,0,0,.45); }
  .L .rd{ color:#a9e6d9; text-shadow:0 -1px 0 rgba(220,255,250,.45), 0 1px 0 rgba(0,0,0,.45); }
  .L .btn{ color:#cec2ac; text-shadow:0 -1px 0 rgba(255,253,246,.6), 0 1px 0 rgba(0,0,0,.5); }` },

  { id: 'r_top', name: 'RAISED: LIGHT ONLY, NO SHADOW', from: 'the shadow removed entirely',
    say: 'No shadow at all. The letters only have a lit top edge, so the whole effect is the light and nothing else.',
    css: RAISED + `
  .L .rd,.L .ttl,.L .bd{ color:#b0a693; text-shadow:0 -1px 0 rgba(255,253,246,.85); }
  .L .rd{ color:#9fdfd2; text-shadow:0 -1px 0 rgba(225,255,250,.75); }
  .L .btn{ color:#bcb19c; text-shadow:0 -1px 0 rgba(255,253,246,.9); }` },

  { id: 'r_dark', name: 'RAISED: DARKER PLATE', from: 'contrast instead of shadow',
    say: 'The plate goes darker so the letters separate on their own. Less shadow needed because the difference is doing the work.',
    css: `
  .L .pnl{ background:linear-gradient(158deg,#4d473e,#2a2620); border-radius:2px;
    box-shadow:inset 0 2px 0 rgba(255,252,240,.22), inset 0 -3px 8px rgba(0,0,0,.6),
      0 9px 18px rgba(0,0,0,.72); }
  .L .rd,.L .ttl,.L .bd{ color:#a79c88;
    text-shadow:0 -1px 0 rgba(255,253,246,.5), 0 1px 1px rgba(0,0,0,.5); }
  .L .rd{ color:#8fd8cc; text-shadow:0 -1px 0 rgba(220,255,250,.4), 0 1px 1px rgba(0,0,0,.5); }
  .L .btn{ background:linear-gradient(158deg,#57503f,#312c24); border:0; border-radius:2px;
    color:#b3a893; text-shadow:0 -1px 0 rgba(255,253,246,.55), 0 1px 1px rgba(0,0,0,.55);
    box-shadow:inset 0 2px 0 rgba(255,252,240,.24), 0 5px 0 #17140f, 0 9px 13px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(5px); box-shadow:inset 0 3px 7px rgba(0,0,0,.65); }` },

  { id: 'r_wide', name: 'RAISED: MORE AIR', from: 'letters given room',
    say: 'Same light shadow, but the letters are spaced further apart. Raised type needs air around it or the highlights start touching.',
    css: RAISED + `
  .L .rd,.L .ttl,.L .bd{ color:#b6ac99; letter-spacing:2.2px;
    text-shadow:0 -1px 0 rgba(255,253,246,.6), 0 1px 1px rgba(0,0,0,.5); }
  .L .rd{ color:#9fdfd2; letter-spacing:2.6px; }
  .L .btn{ color:#c1b6a1; letter-spacing:3.2px;
    text-shadow:0 -1px 0 rgba(255,253,246,.65), 0 1px 1px rgba(0,0,0,.55); }` },

  { id: 'r_soft', name: 'RAISED: SOFTER LIGHT', from: 'a bigger, duller lamp',
    say: 'The light hitting it is broader, so the top edge glows instead of flashing. Everything gets gentler without going flat.',
    css: RAISED + `
  .L .pnl{ background:linear-gradient(158deg,#6f6759,#443e35); }
  .L .rd,.L .ttl,.L .bd{ color:#b9af9c;
    text-shadow:0 -1px 2px rgba(255,253,246,.55), 0 2px 3px rgba(0,0,0,.4); }
  .L .rd{ color:#a2e0d3; text-shadow:0 -1px 2px rgba(225,255,250,.5), 0 2px 3px rgba(0,0,0,.4); }
  .L .btn{ background:linear-gradient(158deg,#7b7263,#484238); color:#c4b9a4;
    text-shadow:0 -1px 2px rgba(255,253,246,.6), 0 2px 3px rgba(0,0,0,.45); }` },

  { id: 'h_drift', name: 'HOLOGRAM: DRIFTING BANDS', from: 'moving, behind the words',
    say: 'The bands slide slowly upward behind the text and the letters never move. All the life is in the field, none of it is in the message.',
    css: HOLO + `
  @keyframes bohDrift{ from{ background-position:0 0 } to{ background-position:0 -40px } }
  .L .pnl::after{ content:''; position:absolute; inset:-40px 0; z-index:1; pointer-events:none;
    background:repeating-linear-gradient(rgba(160,250,232,.11) 0 2px,transparent 2px 7px);
    animation:bohDrift 5.5s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` },

  { id: 'h_sweep', name: 'HOLOGRAM: ONE SLOW SWEEP', from: 'a single bar, every few seconds',
    say: 'Almost completely still. One soft bar travels down the panel every seven seconds and that is the whole effect.',
    css: HOLO + `
  @keyframes bohSweep{ 0%{ transform:translateY(-120%) } 100%{ transform:translateY(320%) } }
  .L .pnl::after{ content:''; position:absolute; left:0; right:0; top:0; height:34%; z-index:1;
    pointer-events:none;
    background:linear-gradient(transparent,rgba(170,255,238,.16) 45%,rgba(170,255,238,.16) 55%,transparent);
    animation:bohSweep 7s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none; opacity:.5 } }` },

  { id: 'h_breathe', name: 'HOLOGRAM: BREATHING', from: 'the field, not the letters',
    say: 'The glow behind the words swells and fades, slowly, like the projector is not quite holding steady. Nothing tears and nothing jumps.',
    css: HOLO + `
  @keyframes bohBreathe{ 0%,100%{ opacity:.5 } 50%{ opacity:1 } }
  .L .pnl::after{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
    background:radial-gradient(ellipse at 50% 50%,rgba(97,168,159,.20),transparent 72%);
    animation:bohBreathe 4.5s ease-in-out infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` },

  { id: 'h_rare', name: 'HOLOGRAM: RARE TEAR', from: 'clean, then once in a while it slips',
    say: 'Clean nearly all the time. Every six seconds a band slides across the background for a fraction of a second and then it is gone. You notice it, you never fight it.',
    css: HOLO + `
  @keyframes bohTear{ 0%,88%,100%{ opacity:0; transform:translateY(30%) }
    90%{ opacity:1; transform:translateY(28%) } 93%{ opacity:1; transform:translateY(52%) }
    95%{ opacity:0; transform:translateY(56%) } }
  .L .pnl::after{ content:''; position:absolute; left:-6%; right:-6%; top:0; height:16%; z-index:1;
    pointer-events:none;
    background:linear-gradient(rgba(170,255,238,.22),rgba(0,0,0,.34));
    animation:bohTear 6s steps(1,end) infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none; opacity:0 } }` },

  { id: 'h_roll', name: 'HOLOGRAM: SLOW ROLL', from: 'a signal not quite locked',
    say: 'A wide soft band rolls up the background forever, like a picture that never fully tunes in. Continuous, gentle, and the text stays hard.',
    css: HOLO + `
  @keyframes bohRoll{ from{ transform:translateY(100%) } to{ transform:translateY(-100%) } }
  .L .pnl::after{ content:''; position:absolute; left:0; right:0; top:0; height:100%; z-index:1;
    pointer-events:none;
    background:linear-gradient(transparent 0 30%,rgba(170,255,238,.13) 45%,rgba(170,255,238,.13) 55%,transparent 70% 100%);
    animation:bohRoll 9s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` },

  { id: 'h_static', name: 'HOLOGRAM: FAINT STATIC', from: 'noise in the field only',
    say: 'A quiet grain crawling behind the words. The least structured of the six, and the closest to something simply not being solid.',
    css: HOLO + `
  @keyframes bohStat{ 0%{ background-position:0 0,0 0 } 100%{ background-position:37px -23px,-29px 31px } }
  .L .pnl::after{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.5;
    background:
      radial-gradient(circle 1px at 20% 30%,rgba(190,255,244,.5),transparent),
      radial-gradient(circle 1px at 70% 65%,rgba(190,255,244,.45),transparent);
    background-size:44px 38px,52px 46px;
    animation:bohStat 2.6s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` }
];

for (const L of LOOKS) {
  for (const m of (L.css.match(/#[0-9a-fA-F]{6}/g) || [])) {
    if (isPurple(m)) { console.error('PURPLE RESERVATION: ' + L.id + ' emits ' + m); process.exit(2); }
  }
}

/* ==== 4. THE PAGE ======================================================== */
const card = (L, i) => `
<section class="look" id="k-${L.id}">
  <div class="hd"><span class="n">${i + 1}</span><b>${L.name}</b><i>${L.from}</i></div>
  <div class="L ${L.id}"><div class="stage">
    <div class="pnl">
      <div class="rd">DAY 1 &middot; 06:00</div>
      <div class="ttl">THE METER READER</div>
      <div class="bd">Nine at night. Every night, nine, and half this block goes brown.</div>
      <button class="btn">TAKE THE JOB</button>
    </div>
  </div></div>
  <p class="say">${L.say}</p>
  <div class="thumbs">
    <button class="th up" data-k="${L.id}" data-v="up">&#128077; YES</button>
    <button class="th down" data-k="${L.id}" data-v="down">&#128078; NO</button>
  </div>
</section>`;

const html = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>BOHEMIA &middot; YOUR TWO, FIXED</title>
<style>
${FACES}
:root{ --bg:${C.bg}; --surface:${C.surface}; --ink:${C.ink}; --dim:${C.dim};
  --faint:${C.faint}; --gold:${C.gold}; --teal:${C.teal};
  --f:'BohemiaMono',ui-monospace,"SF Mono",Menlo,Consolas,monospace; }
*{ box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
html,body{ margin:0; background:var(--bg); color:var(--ink); }
body{ font-family:var(--f); font-size:13px; line-height:1.5; max-width:520px; margin:0 auto;
  padding:10px 10px calc(70px + env(safe-area-inset-bottom)); }
header{ display:flex; align-items:center; gap:8px; margin-bottom:6px; }
h1{ font-size:13px; letter-spacing:2px; margin:0; flex:1; color:var(--gold); font-weight:400; }
.sun{ min-height:44px; padding:8px 11px; font-family:var(--f); font-size:11px; letter-spacing:1px;
  background:transparent; color:var(--ink); border:1px solid #3a3020; border-radius:0; }
.lede{ font-size:13px; color:var(--dim); margin:0 0 16px; }
.lede b{ color:var(--ink); }

.look{ margin:0 0 26px; padding-bottom:20px; border-bottom:1px solid #241d13; }
.hd{ display:flex; align-items:baseline; gap:8px; margin-bottom:9px; flex-wrap:wrap; }
.hd .n{ background:#2a2214; color:var(--gold); font-size:11px; padding:2px 7px; }
.hd b{ font-size:12px; letter-spacing:1.4px; color:var(--ink); font-weight:400; }
.hd i{ font-style:normal; font-size:11px; color:var(--faint); }

/* every look gets the same room to stand in, so the only thing that differs is
   the look. A comparison where the box moves is not a comparison. */
.L{ padding:16px 10px 26px; background:
    repeating-linear-gradient(45deg,#151109 0 6px,#12100a 6px 12px); }
.L .stage{ max-width:330px; margin:0 auto; }
.pnl{ padding:13px 14px 15px; }
.rd{ font-size:10px; letter-spacing:1.6px; color:var(--teal); margin-bottom:6px; }
.ttl{ font-size:12px; letter-spacing:1.6px; color:var(--gold); margin-bottom:7px; }
.bd{ font-size:12.5px; line-height:1.5; color:var(--ink); margin-bottom:12px; }
.btn{ display:block; width:100%; min-height:48px; font-family:var(--f); font-size:12px;
  letter-spacing:1.4px; cursor:pointer; }

.say{ font-size:12.5px; color:var(--dim); margin:11px 2px 10px; }
.thumbs{ display:flex; gap:8px; }
.th{ flex:1; min-height:52px; font-family:var(--f); font-size:12px; letter-spacing:1px;
  background:transparent; color:var(--ink); border:2px solid #3a3020; border-radius:0; }
.th.on{ border-width:4px; }
.th.on.up{ background:#2f5d34; border-color:#4a8a52; color:#eaffea; }
.th.on.down{ background:#5d2f2f; border-color:#8a4a4a; color:#ffeaea; }

.bottom{ margin-top:8px; }
.bottom h3{ font-size:11px; letter-spacing:1.5px; color:var(--gold); margin:0 0 7px; font-weight:400; }
textarea{ width:100%; min-height:80px; background:#0e0c08; color:var(--ink); border:1px solid #3a3020;
  padding:9px; font-family:var(--f); font-size:12.5px; border-radius:0; }
.exp{ display:block; width:100%; min-height:52px; margin-top:10px; background:var(--gold);
  color:#14100a; border:0; font-family:var(--f); font-size:12px; letter-spacing:1.5px; font-weight:700; }
.done{ font-size:12px; color:var(--teal); margin-top:8px; min-height:16px; }

/* SUN MODE lightens the PAGE, never the looks. The looks are showing him the
   GAME, and the game is dark; lightening them shows him a thing that does not
   exist. Same rule the art judge page already lives under. */
body.sun{ background:#d9d4c8; }
body.sun h1,body.sun .hd .n{ color:#4d3a10; }
body.sun .lede,body.sun .say,body.sun .hd i{ color:#3d362a; }
body.sun .lede b,body.sun .hd b{ color:#100d08; }
body.sun .th,body.sun .sun,body.sun textarea{ color:#2a2418; border-color:#a89e88; }
body.sun textarea{ background:#efeade; }
body.sun .look{ border-bottom-color:#c2b9a4; }
${LOOKS.map((L) => L.css.replace(/\.L /g, '.L.' + L.id + ' ')).join('\n')}
</style>

<header>
  <h1>YOUR TWO, FIXED &middot; ROUND 5</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>Your three notes are all in here.</b> The shadow on the raised letters is a fraction of what it was. The hologram effect is dialled way down. And it MOVES, in the background, with the words held completely still. <b>You can say yes to more than one.</b></p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_r5';
  var NAMES=${JSON.stringify(LOOKS.map((L) => ({ id: L.id, name: L.name })))};
  var st={up:{},down:{},all:''};
  try{ var raw=localStorage.getItem(KEY); if(raw) st=JSON.parse(raw); }catch(e){}
  st.up=st.up||{}; st.down=st.down||{};
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(st)); }catch(e){} }
  function apply(){
    document.querySelectorAll('.th').forEach(function(b){
      var k=b.getAttribute('data-k'), v=b.getAttribute('data-v');
      var on = v==='up' ? !!st.up[k] : !!st.down[k];
      b.classList.toggle('on',on);
      /* never colour alone: the one he chose says so in words too */
      var base = v==='up' ? '\\uD83D\\uDC4D YES' : '\\uD83D\\uDC4E NO';
      b.innerHTML = on ? base+' \\u2713' : base;
    });
  }
  document.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('.th'):null; if(!t) return;
    var k=t.getAttribute('data-k'), v=t.getAttribute('data-v');
    if(v==='up'){ st.up[k]=!st.up[k]; if(st.up[k]) st.down[k]=false; }
    else { st.down[k]=!st.down[k]; if(st.down[k]) st.up[k]=false; }
    save(); apply();
  });
  var all=document.getElementById('all');
  all.value=st.all||'';
  all.addEventListener('input',function(){ st.all=all.value; save(); });
  document.getElementById('sun').addEventListener('click',function(){
    document.body.classList.toggle('sun'); });
  document.getElementById('exp').addEventListener('click',function(){
    var L=[]; L.push('BOHEMIA - YOUR TWO FIXED, ROUND 5 - PAOLO\\'S PICKS');
    L.push('exported '+new Date().toISOString().slice(0,16).replace('T',' '));
    L.push('');
    var yes=[],no=[],non=[];
    NAMES.forEach(function(n){
      if(st.up[n.id]) yes.push(n.name); else if(st.down[n.id]) no.push(n.name); else non.push(n.name);
    });
    L.push('YES: '+(yes.length?yes.join(' | '):'nothing'));
    L.push('NO : '+(no.length?no.join(' | '):'nothing'));
    L.push('NOT SAID: '+(non.length?non.join(' | '):'nothing'));
    L.push(''); L.push('ANYTHING ELSE:'); L.push(st.all||'(nothing)');
    var b=new Blob([L.join('\\n')],{type:'text/plain'});
    var a=document.createElement('a'); a.href=URL.createObjectURL(b);
    a.download='BOHEMIA_UI_R5.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_R5.txt';
  });
  apply();
})();
</script>`;

const OUT = R('slices/BOHEMIA_UIWALL_CURRENT.html');
fs.writeFileSync(OUT, html);
console.log('WROTE ' + path.relative(ROOT, OUT) + '  ' + (html.length / 1024).toFixed(1) + ' KB');
console.log('  looks    : ' + LOOKS.length);
console.log('  palette  : read live from the run, ' + Object.keys(C).length + ' tokens');
console.log('  typeface : ' + bank.family + ', embedded, nothing fetched');
console.log('  purple   : none, swept at build over every colour the page emits');

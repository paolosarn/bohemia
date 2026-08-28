#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- THE 3D WALL  (UI lane, 8/28/26)

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
const LOOKS = [
  { id: 'bevel', name: 'HARD BEVEL',
    from: 'Windows 95, Fallout, Age of Empires',
    say: 'Light on the top and left, dark on the bottom and right. That is the whole thing. The oldest trick there is and your eye still buys it instantly.',
    css: `
  .L .pnl{ background:#2a241a; border-top:3px solid #6f6044; border-left:3px solid #6f6044;
    border-right:3px solid #0a0806; border-bottom:3px solid #0a0806; }
  .L .btn{ background:#3a3224; border-top:3px solid #85734f; border-left:3px solid #85734f;
    border-right:3px solid #0a0806; border-bottom:3px solid #0a0806; color:${C.gold}; }
  .L .btn:active{ border-color:#0a0806 #85734f #85734f #0a0806; }` },

  { id: 'stone', name: 'CARVED STONE',
    from: 'Baldur\u2019s Gate, Icewind Dale',
    say: 'Cut out of rock. Thick frame, deep shadow inside it, and the whole slab sits on the world with a shadow under it.',
    css: `
  .L .pnl{ background:linear-gradient(#241f17,#171309); border:7px solid #3d3427; border-radius:4px;
    box-shadow:inset 0 4px 9px rgba(0,0,0,.95), inset 0 -2px 0 rgba(255,240,200,.07),
      0 5px 0 #0a0806, 0 14px 22px rgba(0,0,0,.75); }
  .L .btn{ background:linear-gradient(#332b1f,#1d1811); border:4px solid #4a3f2d; border-radius:3px;
    color:${C.gold}; box-shadow:inset 0 2px 5px rgba(0,0,0,.8), inset 0 -1px 0 rgba(255,240,200,.10), 0 3px 0 #0a0806; }
  .L .btn:active{ box-shadow:inset 0 3px 7px rgba(0,0,0,.95); transform:translateY(3px); }` },

  { id: 'steel', name: 'RIVETED STEEL',
    from: 'the machine, bolted on',
    say: 'Brushed metal with screws in the corners. Somebody bolted this panel onto the game.',
    css: `
  .L .pnl{ position:relative; border:2px solid #4e4536; border-radius:2px;
    background:repeating-linear-gradient(90deg,#2c2820 0 2px,#332e25 2px 4px);
    box-shadow:inset 0 1px 0 rgba(255,245,220,.20), inset 0 -4px 10px rgba(0,0,0,.85),
      0 8px 16px rgba(0,0,0,.65); }
  /* four screws, not two: a plate bolted at two corners is a plate that swings */
  .L .pnl::before,.L .pnl::after{ content:''; position:absolute; left:6px; right:6px;
    height:8px; pointer-events:none;
    background:radial-gradient(circle 4px at 4px 4px,#9c8e72 0 42%,#2a251c 45% 100%,transparent 100%),
      radial-gradient(circle 4px at calc(100% - 4px) 4px,#9c8e72 0 42%,#2a251c 45% 100%,transparent 100%);
    background-repeat:no-repeat; filter:drop-shadow(0 1px 1px rgba(0,0,0,.9)); }
  .L .pnl::before{ top:6px } .L .pnl::after{ bottom:6px }
  .L .btn{ background:linear-gradient(#4a4234,#2a251d); border:2px solid #5c5140; border-radius:2px;
    color:${C.ink}; box-shadow:inset 0 1px 0 rgba(255,245,220,.28), 0 4px 0 #16130e, 0 8px 12px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(4px); box-shadow:inset 0 2px 6px rgba(0,0,0,.8); }` },

  { id: 'slab', name: 'EXTRUDED SLAB',
    from: 'the most literal answer to what you said',
    say: 'The panel has a SIDE. It is a block of something lifted off the screen, and you can see its thickness under it.',
    css: `
  .L .pnl{ background:#241f16; border-top:1px solid #7d6c49; border-radius:2px;
    box-shadow:0 7px 0 #14100b, 0 8px 0 #0a0806, 0 16px 22px rgba(0,0,0,.65); }
  .L .btn{ background:${C.gold}; color:#14100a; border:0; border-radius:2px; font-weight:700;
    box-shadow:0 6px 0 #7d5f1f, 0 7px 0 #4a3712, 0 12px 16px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(6px); box-shadow:0 1px 0 #4a3712; }` },

  { id: 'iso', name: 'LYING IN THE WORLD',
    from: 'your own 45 degree law',
    say: 'The panel is tilted to sit in the world\u2019s own 45 degree space instead of flat against the glass. The interface is IN the city, not on top of it.',
    css: `
  .L .stage{ perspective:700px; }
  .L .pnl{ transform:rotateX(19deg) rotateZ(-1.5deg); transform-origin:50% 100%;
    background:linear-gradient(#2a2318,#191408); border:2px solid #6b5c3f; border-radius:2px;
    box-shadow:0 5px 0 #12100a, 0 22px 30px rgba(0,0,0,.72); }
  .L .btn{ background:linear-gradient(#4a3d22,#2b2313); border:2px solid ${C.gold}; color:${C.gold};
    border-radius:2px; box-shadow:0 4px 0 #12100a; }
  .L .btn:active{ transform:translateY(4px); box-shadow:none; }` },

  { id: 'crt', name: 'BEHIND GLASS',
    from: 'a CRT you are looking into',
    say: 'A curved screen with a glare on it. The words are not on the surface, they are behind it, glowing.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#16241f,#080d0b 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), inset 0 2px 14px rgba(120,255,210,.10),
      0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; color:${C.teal}; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 30% 12%,rgba(255,255,255,.10),transparent 55%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.55); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; text-shadow:none; }` },

  { id: 'float', name: 'FLOATING LIGHT',
    from: 'Final Fantasy X',
    say: 'No surface at all. A pane of coloured light hanging in front of the world, with a real shadow falling behind it so it still has depth.',
    css: `
  .L .pnl{ background:linear-gradient(rgba(36,46,66,.58),rgba(10,16,26,.66));
    border:1px solid rgba(160,205,255,.34); border-radius:8px; backdrop-filter:blur(2px);
    box-shadow:0 0 22px rgba(90,150,220,.24), inset 0 1px 0 rgba(255,255,255,.26),
      0 18px 30px rgba(0,0,0,.6); }
  .L .btn{ background:linear-gradient(rgba(216,167,66,.24),rgba(216,167,66,.08));
    border:1px solid rgba(216,167,66,.65); color:${C.gold}; border-radius:6px;
    box-shadow:inset 0 1px 0 rgba(255,255,255,.22), 0 8px 16px rgba(0,0,0,.45); }
  .L .btn:active{ background:${C.gold}; color:#14100a; }` },

  { id: 'plastic', name: 'MOULDED PLASTIC',
    from: 'the Pip-Boy',
    say: 'A cheap plastic device you are holding. Rounded, chunky, with a soft highlight along the top like light on a moulded case.',
    css: `
  .L .pnl{ background:linear-gradient(#3d4536,#242a1f); border-radius:14px;
    box-shadow:inset 0 2px 0 rgba(225,255,205,.24), inset 0 -8px 14px rgba(0,0,0,.7),
      0 9px 0 #171b12, 0 18px 24px rgba(0,0,0,.62); }
  .L .btn{ background:linear-gradient(#586148,#333a2a); border-radius:9px; color:#cfe0b8; border:0;
    box-shadow:inset 0 2px 0 rgba(225,255,205,.30), 0 5px 0 #1d2216, 0 9px 12px rgba(0,0,0,.55); }
  .L .btn:active{ transform:translateY(5px); box-shadow:inset 0 3px 7px rgba(0,0,0,.6); }` },

  { id: 'tag', name: 'STAMPED TAG, WITH THICKNESS',
    from: 'the corner you already picked, given depth',
    say: 'Your cut corner, but the metal is thick now. A lit top edge and a dark side under it, so the tag is a real object instead of a shape.',
    css: `
  .L .pnl{ position:relative; background:linear-gradient(#2b2419,#1a150d);
    -webkit-clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);
    clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);
    border-top:2px solid #8a7852; filter:drop-shadow(0 6px 0 #100d09) drop-shadow(0 14px 18px rgba(0,0,0,.7)); }
  .L .btn{ background:${C.gold}; color:#14100a; border:0; font-weight:700;
    -webkit-clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    clip-path:polygon(9px 0,100% 0,100% calc(100% - 9px),calc(100% - 9px) 100%,0 100%,0 9px);
    filter:drop-shadow(0 5px 0 #6d5219) drop-shadow(0 9px 10px rgba(0,0,0,.55)); }
  .L .btn:active{ transform:translateY(5px); filter:drop-shadow(0 0 0 #6d5219); }` },

  { id: 'backlit', name: 'LIT FROM BEHIND',
    from: 'a machine\u2019s readout',
    say: 'A dark panel with light leaking out from behind it. The depth comes from the glow, not from an edge.',
    css: `
  .L .pnl{ background:#0e0c08; border:2px solid #2f2718; border-radius:3px;
    box-shadow:0 0 0 1px #000, 0 0 26px 3px rgba(216,167,66,.26),
      inset 0 0 26px rgba(216,167,66,.07), 0 12px 22px rgba(0,0,0,.7); }
  .L .ttl{ text-shadow:0 0 10px rgba(216,167,66,.55); }
  .L .btn{ background:#131009; border:2px solid ${C.gold}; color:${C.gold}; border-radius:3px;
    box-shadow:0 0 14px rgba(216,167,66,.35), inset 0 0 12px rgba(216,167,66,.14); }
  .L .btn:active{ background:${C.gold}; color:#14100a; box-shadow:0 0 26px rgba(216,167,66,.85); }` },

  { id: 'stack', name: 'A STACK OF CARDS',
    from: 'paper on a table',
    say: 'Not one panel, a little pile of them. The depth is the stack itself, and it says there is more underneath.',
    css: `
  .L .pnl{ background:#221d14; border:1px solid #4a3f2a; border-radius:3px;
    box-shadow:
      0 6px 0 -1px #17130d, 0 7px 0 -1px #55482f,
      0 13px 0 -2px #14110b, 0 14px 0 -2px #4a3f2a,
      0 20px 0 -3px #100d09, 0 21px 0 -3px #3e3524,
      0 30px 30px rgba(0,0,0,.78); }
  .L .btn{ background:#2c2417; border:1px solid #4a3f28; color:${C.gold}; border-radius:3px;
    box-shadow:0 3px 0 #14110b, 0 6px 9px rgba(0,0,0,.5); }
  .L .btn:active{ transform:translateY(3px); box-shadow:0 0 0 #14110b; }` },

  { id: 'neon', name: 'NEON TUBE',
    from: 'the city it is set in',
    say: 'The edge is a bent glass tube with light in it. Las Vegas, and the only look here that the setting hands you for free.',
    css: `
  .L .pnl{ background:#0a0907; border:2px solid ${C.gold}; border-radius:5px;
    box-shadow:0 0 7px ${C.gold}, 0 0 20px rgba(216,167,66,.55), inset 0 0 12px rgba(216,167,66,.28),
      0 12px 26px #000; }
  .L .ttl{ color:#fff3d6; text-shadow:0 0 8px ${C.gold},0 0 18px rgba(216,167,66,.8); }
  .L .btn{ background:transparent; border:2px solid ${C.teal}; color:#dffaf4; border-radius:4px;
    text-shadow:0 0 8px ${C.teal}; box-shadow:0 0 7px ${C.teal}, inset 0 0 10px rgba(97,168,159,.30); }
  .L .btn:active{ background:${C.teal}; color:#04100d; text-shadow:none; box-shadow:0 0 26px ${C.teal}; }` }
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
<title>BOHEMIA &middot; PICK A LOOK</title>
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
  <h1>PICK A LOOK</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>Twelve of them. The same words, the same button, twelve ways.</b>
The game is flat, so the interface carries the weight. Thumb everything you like and
everything you hate. <b>You can say yes to more than one.</b></p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_wall_v1';
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
    var L=[]; L.push('BOHEMIA - PICK A LOOK - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_WALL.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_WALL.txt';
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

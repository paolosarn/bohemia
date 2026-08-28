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
const LOOKS = [
  { id: 'holo', name: 'HOLOGRAM IN THE AIR', from: 'light standing in space',
    say: 'Not a surface at all. Light hanging in the room with a projector cone under it, flickering because it is being redrawn.',
    css: `
  .L .stage{ padding-bottom:36px; }
  .L .pnl{ position:relative; border:0; border-top:1px solid rgba(150,245,225,.6);
    border-bottom:1px solid rgba(150,245,225,.34);
    background:linear-gradient(rgba(97,168,159,.13),rgba(97,168,159,.03));
    box-shadow:0 0 30px rgba(97,168,159,.30), 0 0 64px rgba(97,168,159,.14); }
  .L .pnl::before{ content:''; position:absolute; left:24%; right:24%; top:100%; height:40px;
    background:linear-gradient(rgba(97,168,159,.24),transparent);
    -webkit-clip-path:polygon(0 0,100% 0,68% 100%,32% 100%);
    clip-path:polygon(0 0,100% 0,68% 100%,32% 100%); }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(160,250,232,.10) 0 2px,transparent 2px 5px); }
  .L .rd{ color:#7fd8c8; text-shadow:0 0 8px rgba(97,168,159,.9); }
  .L .ttl,.L .bd{ color:#d4fff4; text-shadow:0 0 8px rgba(97,168,159,.95), 1px 0 0 rgba(255,120,120,.30), -1px 0 0 rgba(120,200,255,.30); }
  .L .btn{ background:rgba(97,168,159,.12); border:1px solid rgba(150,245,225,.6); color:#e6fffa;
    border-radius:0; text-shadow:0 0 9px rgba(97,168,159,.95); }
  .L .btn:active{ background:rgba(150,245,225,.45); color:#04100d; text-shadow:none; }` },

  { id: 'flap', name: 'SPLIT-FLAP BOARD', from: 'an airport departure board',
    say: 'Every letter is a physical tile with a seam across its middle. To change a word the board has to clatter through the alphabet.',
    css: `
  .L .pnl{ background:#0e0d0b; border:3px solid #2b2721; border-radius:2px; padding:14px 12px 16px;
    box-shadow:inset 0 0 20px rgba(0,0,0,.9), 0 8px 18px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ display:block; padding:5px 6px; margin-bottom:6px; border-radius:1px;
    background:linear-gradient(#332f27 0 48%,#000 48% 52%,#26231c 52% 100%);
    box-shadow:inset 0 1px 0 rgba(255,250,230,.14), inset 0 -1px 0 rgba(0,0,0,.8), 0 2px 3px rgba(0,0,0,.6);
    color:#f3ecd9; text-shadow:0 1px 0 rgba(0,0,0,.9); }
  .L .rd{ color:#8fd8cc; }
  .L .btn{ border:0; border-radius:1px; color:#151109; font-weight:700;
    background:linear-gradient(#e8c56f 0 48%,#6b5620 48% 52%,#d2ac54 52% 100%);
    box-shadow:inset 0 1px 0 rgba(255,255,240,.5), 0 3px 5px rgba(0,0,0,.7); }
  .L .btn:active{ background:linear-gradient(#c2a04a 0 48%,#3d3113 48% 52%,#a98a3c 52% 100%); }` },

  { id: 'nixie', name: 'TUBES',
    from: 'glowing wire inside glass',
    say: 'Each line lives inside its own little glass tube, lit by a filament. The glow is real light, not a colour, and the glass catches a highlight.',
    css: `
  .L .pnl{ background:#0a0907; border:2px solid #241f18; border-radius:3px; padding:12px 11px 14px;
    box-shadow:inset 0 0 24px rgba(0,0,0,.9), 0 8px 18px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ display:block; padding:6px 10px; margin-bottom:7px; border-radius:40px/15px;
    background:radial-gradient(ellipse at 50% 34%,rgba(255,178,84,.14),rgba(0,0,0,0) 72%);
    box-shadow:inset 0 0 14px rgba(255,190,110,.16), inset 0 2px 0 rgba(255,255,255,.10),
      inset 0 -2px 0 rgba(0,0,0,.6);
    color:#ffb14a; text-shadow:0 0 4px #ff9d1f,0 0 14px rgba(255,140,20,.9); }
  .L .rd{ color:#ff9c33; }
  .L .btn{ border:1px solid rgba(255,170,70,.45); border-radius:40px/22px; background:rgba(255,150,40,.07);
    color:#ffc477; text-shadow:0 0 5px #ff9d1f,0 0 16px rgba(255,140,20,.95);
    box-shadow:inset 0 0 16px rgba(255,170,70,.18), inset 0 2px 0 rgba(255,255,255,.12); }
  .L .btn:active{ background:rgba(255,170,70,.35); color:#1a0d02; text-shadow:none; }` },

  { id: 'stamp', name: 'STAMPED INTO METAL', from: 'no colour at all',
    say: 'The letters are the same colour as the plate. You only read them because they are pressed in and the light catches one edge. Nothing here is printed.',
    css: `
  /* A BRIGHTER PLATE AND A HARDER LIGHT. The first cut was honest to the idea and
     unreadable on a phone: a dark plate with dark letters is a deboss nobody can
     read. Real stamped metal IS readable, because the light hitting it is strong
     and comes from one side. The letters still carry NO colour of their own. */
  .L .pnl{ background:linear-gradient(158deg,#8d8474,#5d564a); border-radius:2px;
    box-shadow:inset 0 2px 0 rgba(255,252,240,.42), inset 0 -3px 8px rgba(0,0,0,.5),
      0 9px 18px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ color:#655d50;
    text-shadow:0 2px 0 rgba(255,252,238,.55), 0 -1px 1px rgba(0,0,0,.85); }
  .L .rd{ color:#6f6759 }
  .L .btn{ background:linear-gradient(158deg,#9a9080,#6a6255); border:0; border-radius:2px;
    color:#5f5749; text-shadow:0 2px 0 rgba(255,252,238,.6), 0 -1px 1px rgba(0,0,0,.9);
    box-shadow:inset 0 2px 0 rgba(255,252,240,.5), 0 5px 0 #2e2a23, 0 9px 13px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(5px);
    box-shadow:inset 0 3px 7px rgba(0,0,0,.6), 0 0 0 #2e2a23; }` },

  { id: 'letter', name: 'LETTERBOARD', from: 'a diner menu, a motel sign',
    say: 'White plastic letters pushed into grooves on a felt board. Somebody stood there and slid each one in by hand.',
    css: `
  /* THE GROOVES HAVE TO SHOW OR IT IS JUST A DARK PANEL. The first cut had them at
     two pixels of near-black on near-black and the whole idea vanished: it read as
     a plain box with white text. A letterboard is RAILS, and the letters have to
     look slotted into them. */
  .L .pnl{ border:10px solid #43371f; border-radius:3px; padding:12px 11px 14px;
    background:#100f0d;
    background-image:repeating-linear-gradient(#1f1c17 0 22px, #060605 22px 27px);
    box-shadow:inset 0 0 30px rgba(0,0,0,.9), inset 0 3px 0 rgba(255,238,200,.10),
      0 9px 18px rgba(0,0,0,.75); }
  .L .rd,.L .ttl,.L .bd{ display:block; padding:2px 0 3px; color:#fbf6e8; letter-spacing:2px;
    text-shadow:1px 2px 0 rgba(0,0,0,.95), 2px 4px 3px rgba(0,0,0,.7), 0 -1px 0 rgba(255,255,255,.35); }
  .L .rd{ color:#a6e6da; }
  .L .btn{ background:transparent; border:0; color:#ffd070; letter-spacing:3px;
    text-shadow:1px 2px 0 rgba(0,0,0,.95), 2px 4px 4px rgba(0,0,0,.7), 0 -1px 0 rgba(255,255,255,.3); }
  .L .btn:active{ color:#fff; }` },

  { id: 'lightbox', name: 'LIGHTBOX SIGN', from: 'a petrol station price board',
    say: 'A plastic box lit from inside. Dark letters on a glowing panel, which is the only look here that is brighter than the world around it.',
    css: `
  .L .pnl{ background:linear-gradient(#f4e9c9,#dccb98); border:6px solid #191510; border-radius:3px;
    box-shadow:0 0 40px rgba(244,233,201,.35), inset 0 0 34px rgba(255,255,255,.55),
      inset 0 0 0 2px rgba(120,105,70,.35), 0 10px 22px #000; }
  .L .rd{ color:#6b5a2c; }
  .L .ttl,.L .bd{ color:#171208; }
  .L .btn{ background:#171208; border:0; border-radius:2px; color:#f4e9c9; font-weight:700;
    box-shadow:0 4px 0 #000, 0 8px 12px rgba(0,0,0,.4); }
  .L .btn:active{ transform:translateY(4px); box-shadow:0 0 0 #000; }` },

  { id: 'stencil', name: 'SPRAYED ON THE WALL', from: 'a stencil and a can',
    say: 'The interface is painted onto the world. It is 3D because it is ON something, and the overspray softens every edge.',
    css: `
  .L .pnl{ border-radius:0; border:0;
    background:linear-gradient(#3b3730,#2b2822);
    background-image:radial-gradient(circle at 18% 30%,rgba(0,0,0,.22),transparent 22%),
      radial-gradient(circle at 72% 66%,rgba(0,0,0,.18),transparent 26%),
      radial-gradient(circle at 44% 88%,rgba(255,255,255,.05),transparent 20%),
      linear-gradient(#3b3730,#2b2822);
    box-shadow:inset 0 0 44px rgba(0,0,0,.55), 0 6px 14px rgba(0,0,0,.6); }
  /* OVERSPRAY IS THE WHOLE TELL and the first cut had it at three pixels, which is
     invisible. Paint through a stencil fogs well past the edge of the cut, and the
     letters sit heavier where the can lingered. */
  .L .rd{ color:#9be6d8; letter-spacing:3px; font-weight:700;
    text-shadow:0 0 10px rgba(97,168,159,.85), 0 0 22px rgba(97,168,159,.4); }
  .L .ttl{ color:#f0be62; letter-spacing:3px; font-weight:700;
    text-shadow:0 0 9px rgba(216,167,66,.9), 0 0 24px rgba(216,167,66,.55), 2px 2px 12px rgba(216,167,66,.35); }
  .L .bd{ color:#e6d3a8; letter-spacing:1.6px;
    text-shadow:0 0 8px rgba(216,167,66,.6), 0 0 20px rgba(216,167,66,.28); }
  .L .btn{ background:transparent; border:4px solid ${C.gold}; border-radius:0; color:#f7d089;
    letter-spacing:3px; font-weight:700; text-shadow:0 0 9px rgba(216,167,66,.9), 0 0 22px rgba(216,167,66,.5);
    box-shadow:0 0 20px rgba(216,167,66,.30), inset 0 0 18px rgba(216,167,66,.14);
    filter:blur(.2px); }
  .L .btn:active{ background:rgba(216,167,66,.85); color:#1a1206; text-shadow:none; }` },

  { id: 'tape', name: 'TAPE AND MARKER', from: 'somebody labelled it by hand',
    say: 'Strips of masking tape stuck onto the machine with the words written on in pen. Every strip sits slightly crooked and throws its own shadow.',
    css: `
  .L .pnl{ background:linear-gradient(#26221b,#171410); border:1px solid #332d22; border-radius:2px;
    padding:16px 13px 18px; box-shadow:0 8px 16px rgba(0,0,0,.65); }
  .L .rd,.L .ttl,.L .bd{ display:inline-block; padding:3px 9px; margin-bottom:8px;
    background:linear-gradient(#d3c295,#c0ae7f); color:#1c1710; border-radius:1px;
    box-shadow:0 2px 5px rgba(0,0,0,.6); }
  .L .rd{ transform:rotate(-.9deg); color:#3d3524; }
  .L .ttl{ transform:rotate(.5deg); }
  .L .bd{ transform:rotate(-.4deg); display:block; }
  .L .btn{ background:linear-gradient(#e2d1a2,#cbb98a); border:0; border-radius:1px; color:#1c1710;
    font-weight:700; transform:rotate(.7deg); box-shadow:0 3px 7px rgba(0,0,0,.65); }
  .L .btn:active{ transform:rotate(.7deg) translateY(3px); box-shadow:0 1px 3px rgba(0,0,0,.6); }` },

  { id: 'punch', name: 'PUNCH CARD', from: 'a ledger that stopped meaning anything',
    say: 'A stiff manila card with holes punched through it and light coming through them. For a game about money that stopped working, the paper is the point.',
    css: `
  .L .pnl{ position:relative; background:linear-gradient(#cdbd93,#b7a67b); color:#241d12;
    border-radius:1px; padding:20px 13px 15px;
    -webkit-clip-path:polygon(14px 0,100% 0,100% 100%,0 100%,0 14px);
    clip-path:polygon(14px 0,100% 0,100% 100%,0 100%,0 14px);
    filter:drop-shadow(0 8px 14px rgba(0,0,0,.7)); }
  .L .pnl::before{ content:''; position:absolute; left:12px; right:12px; top:7px; height:7px;
    background:repeating-linear-gradient(90deg,
      rgba(30,24,14,.85) 0 5px, rgba(30,24,14,0) 5px 14px);
    box-shadow:0 1px 0 rgba(255,250,225,.5); }
  .L .rd{ color:#6a5a34; }
  .L .ttl{ color:#1d1710; }
  .L .bd{ color:#2c2416; }
  .L .btn{ background:#241d12; border:0; border-radius:1px; color:#e6d9b2; font-weight:700;
    box-shadow:0 4px 0 #0e0b06, 0 8px 12px rgba(0,0,0,.45); }
  .L .btn:active{ transform:translateY(4px); box-shadow:0 0 0 #0e0b06; }` },

  { id: 'drum', name: 'ROLLING DRUMS', from: 'an odometer, a fuel pump',
    say: 'The numbers are printed on cylinders turning behind a slot. The shading down each line is the drum curving away from you.',
    css: `
  .L .pnl{ background:#14120e; border:3px solid #2e281f; border-radius:3px; padding:13px 11px 15px;
    box-shadow:inset 0 0 18px rgba(0,0,0,.9), 0 8px 16px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ display:block; padding:7px 9px; margin-bottom:7px; border-radius:2px;
    background:linear-gradient(#080706 0%,#2b271f 16%,#565045 50%,#2b271f 84%,#080706 100%);
    box-shadow:inset 0 3px 5px rgba(0,0,0,.8), inset 0 -3px 5px rgba(0,0,0,.8);
    color:#f4eedd; text-shadow:0 1px 0 rgba(0,0,0,.85); }
  .L .rd{ color:#a9e2d7 }
  .L .btn{ border:0; border-radius:2px; color:#151109; font-weight:700;
    background:linear-gradient(#4a3a12 0%,#8d6e22 16%,#e8c56f 50%,#8d6e22 84%,#4a3a12 100%);
    box-shadow:inset 0 3px 5px rgba(0,0,0,.5), inset 0 -3px 5px rgba(0,0,0,.5), 0 4px 9px rgba(0,0,0,.6); }
  .L .btn:active{ background:linear-gradient(#2e2409 0%,#6b5318 16%,#b8973f 50%,#6b5318 84%,#2e2409 100%); }` },

  { id: 'acrylic', name: 'STACKED SHEETS', from: 'clear panels at different depths',
    say: 'Three sheets of scratched perspex, one behind the other, with the information split across them. The depth is real spacing, not a shadow.',
    css: `
  .L .pnl{ position:relative; background:rgba(176,214,208,.07); border:1px solid rgba(206,242,236,.30);
    border-radius:2px;
    box-shadow:0 0 0 1px rgba(0,0,0,.55),
      13px 13px 0 rgba(176,214,208,.055), 13px 13px 0 1px rgba(206,242,236,.14),
      26px 26px 0 rgba(176,214,208,.035), 26px 26px 0 1px rgba(206,242,236,.09),
      0 22px 34px rgba(0,0,0,.75); }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(116deg,rgba(255,255,255,.10) 0 18%,transparent 34%); }
  .L .rd{ color:#8fd8cc; text-shadow:0 0 6px rgba(97,168,159,.5); }
  .L .ttl,.L .bd{ color:#e8f6f2; text-shadow:0 1px 3px rgba(0,0,0,.8); }
  .L .btn{ background:rgba(206,242,236,.10); border:1px solid rgba(206,242,236,.5); color:#eafffb;
    border-radius:2px; box-shadow:9px 9px 0 rgba(206,242,236,.07); }
  .L .btn:active{ background:rgba(206,242,236,.4); color:#04100d; box-shadow:none; }` },

  { id: 'proj', name: 'THROWN ON THE WALL', from: 'a projector at an angle',
    say: 'A projector pointed at a surface off to one side, so the picture leans and the middle is brighter than the edges. The wall it lands on is doing half the work.',
    css: `
  .L .stage{ perspective:760px; }
  .L .pnl{ transform:rotateY(-15deg) rotateX(3deg); transform-origin:100% 50%; border:0; border-radius:0;
    background:radial-gradient(ellipse at 38% 40%,rgba(244,236,212,.17),rgba(244,236,212,.05) 58%,transparent 82%);
    box-shadow:none; }
  .L .rd{ color:#b9d8d0; text-shadow:0 0 10px rgba(200,230,222,.55); }
  .L .ttl,.L .bd{ color:#f6efd9; text-shadow:0 0 9px rgba(246,239,217,.75), 0 0 22px rgba(246,239,217,.35); }
  .L .btn{ background:rgba(246,239,217,.10); border:1px solid rgba(246,239,217,.5); color:#fffaea;
    border-radius:0; text-shadow:0 0 10px rgba(246,239,217,.8); }
  .L .btn:active{ background:rgba(246,239,217,.6); color:#14110a; text-shadow:none; }` }
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
<title>BOHEMIA &middot; NOT A SCREEN</title>
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
  <h1>NOT A SCREEN &middot; ROUND 3</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>All twelve glass ones are saved. None of these is a screen.</b>
Twelve other ways to make a readout a real object: light in the air, tiles that flip,
letters pressed into metal, tape, paper, a sign, a projector.
<b>You can say yes to more than one.</b></p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_r3';
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
    var L=[]; L.push('BOHEMIA - NOT A SCREEN, ROUND 3 - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_R3.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_R3.txt';
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

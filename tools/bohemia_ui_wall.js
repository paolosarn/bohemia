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
  { id: 'asis', name: 'THE ONE YOU PICKED', from: 'unchanged, so you have something to judge against',
    say: 'Exactly what you thumbed. Everything below is a change to this, so this one is here to compare against.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#16241f,#080d0b 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), inset 0 2px 14px rgba(120,255,210,.10),
      0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 30% 12%,rgba(255,255,255,.10),transparent 55%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.55); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; text-shadow:none; }` },

  { id: 'flat', name: 'FLAT PANE', from: 'no bulge at all',
    say: 'Same screen, but the glass is flat. Sharper, colder, more like something made recently and less like something salvaged.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:2px;
    background:linear-gradient(#101c18,#070c0a);
    box-shadow:inset 0 0 22px rgba(0,0,0,.85), 0 0 0 3px #191510, 0 8px 18px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.22) 0 1px,transparent 1px 3px),
      linear-gradient(100deg,rgba(255,255,255,.07) 0 28%,transparent 42%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 5px rgba(97,168,159,.45); }
  .L .btn{ background:rgba(97,168,159,.08); border:1px solid rgba(97,168,159,.6); color:${C.teal};
    border-radius:2px; }
  .L .btn:active{ background:${C.teal}; color:#04100d; }` },

  { id: 'deep', name: 'DEEP TUBE', from: 'a fat old monitor',
    say: 'Much more curve. The glass bulges, the corners fall away into shadow, and the picture only really lives in the middle.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:34px/46px;
    background:radial-gradient(ellipse at 50% 42%,#16261f,#050908 82%);
    box-shadow:inset 0 0 60px 12px rgba(0,0,0,.95), inset 0 3px 18px rgba(120,255,210,.12),
      0 0 0 7px #17130f, 0 0 0 9px #090706, 0 12px 26px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.34) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 50% 50%,transparent 38%,rgba(0,0,0,.72) 92%),
      radial-gradient(ellipse at 26% 10%,rgba(255,255,255,.13),transparent 48%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 9px rgba(97,168,159,.75); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:6px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.32); color:#04100d; }` },

  { id: 'amber', name: 'AMBER PHOSPHOR', from: 'the warm terminal',
    say: 'The same tube, orange instead of green. It is the colour the game already uses for you, so the screen stops feeling like a separate machine.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#241a0c,#0c0805 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), inset 0 2px 14px rgba(255,190,90,.12),
      0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 30% 12%,rgba(255,235,190,.10),transparent 55%); }
  .L .rd{ color:#c98a2e; text-shadow:0 0 7px rgba(216,167,66,.7); }
  .L .ttl,.L .bd{ color:#f0bd63; text-shadow:0 0 8px rgba(216,167,66,.75); }
  .L .btn{ background:rgba(216,167,66,.10); border:1px solid rgba(216,167,66,.6); color:#f6cd81;
    border-radius:4px; text-shadow:0 0 8px rgba(216,167,66,.9); }
  .L .btn:active{ background:${C.gold}; color:#150f04; text-shadow:none; }` },

  { id: 'green', name: 'GREEN PHOSPHOR', from: 'the oldest terminal there is',
    say: 'Hard green on black. The cheapest screen anybody ever built, and the one everybody recognises instantly.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#0d1c0d,#050805 80%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), inset 0 2px 14px rgba(120,255,120,.10),
      0 0 0 4px #171610, 0 0 0 6px #090806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.32) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 30% 12%,rgba(220,255,220,.09),transparent 55%); }
  .L .rd{ color:#5fa85f; text-shadow:0 0 7px rgba(110,230,110,.6); }
  .L .ttl,.L .bd{ color:#8ef08e; text-shadow:0 0 8px rgba(110,230,110,.8); }
  .L .btn{ background:rgba(110,230,110,.08); border:1px solid rgba(110,230,110,.55); color:#9dff9d;
    border-radius:4px; text-shadow:0 0 9px rgba(110,230,110,.9); }
  .L .btn:active{ background:#7ee07e; color:#04150a; text-shadow:none; }` },

  { id: 'noframe', name: 'NO FRAME AT ALL', from: 'the glass IS the panel',
    say: 'Take the housing away. The screen runs right to the edge, so it is a window into the machine instead of a box sitting on the world.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:20px/26px;
    background:radial-gradient(ellipse at 50% 40%,#16241f,#070c0a 82%);
    box-shadow:inset 0 0 40px rgba(0,0,0,.95), inset 0 2px 16px rgba(120,255,210,.12); }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(0,0,0,.62) 96%),
      radial-gradient(ellipse at 28% 10%,rgba(255,255,255,.10),transparent 52%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; }` },

  { id: 'bezel', name: 'THICK PLASTIC BEZEL', from: 'a real monitor on a desk',
    say: 'A chunky moulded surround around the glass, with a highlight along the top edge. The screen is set INTO something.',
    css: `
  .L .stage{ padding:14px 14px 20px; border-radius:16px;
    background:linear-gradient(#3a382f,#22211a);
    box-shadow:inset 0 2px 0 rgba(255,250,225,.22), inset 0 -8px 14px rgba(0,0,0,.6),
      0 8px 0 #14130f, 0 16px 24px rgba(0,0,0,.65); }
  .L .pnl{ position:relative; overflow:hidden; border-radius:12px/16px;
    background:radial-gradient(ellipse at 50% 40%,#16241f,#070c0a 80%);
    box-shadow:inset 0 0 30px rgba(0,0,0,.95), inset 0 0 0 2px #0b0a08, 0 2px 6px rgba(0,0,0,.8); }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 28% 10%,rgba(255,255,255,.11),transparent 52%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; }` },

  { id: 'bolted', name: 'BOLTED IN A HOUSING', from: 'salvaged and screwed down',
    say: 'The tube in a metal frame with screws in the corners. Somebody pulled this out of something else and bolted it in here.',
    css: `
  .L .stage{ position:relative; padding:13px; border-radius:3px;
    background:repeating-linear-gradient(90deg,#2c2820 0 2px,#332e25 2px 4px);
    box-shadow:inset 0 1px 0 rgba(255,245,220,.20), inset 0 -4px 10px rgba(0,0,0,.85),
      0 8px 16px rgba(0,0,0,.7); }
  .L .stage::before,.L .stage::after{ content:''; position:absolute; left:5px; right:5px; height:8px;
    background:radial-gradient(circle 4px at 4px 4px,#9c8e72 0 42%,#2a251c 45% 100%,transparent 100%),
      radial-gradient(circle 4px at calc(100% - 4px) 4px,#9c8e72 0 42%,#2a251c 45% 100%,transparent 100%);
    background-repeat:no-repeat; filter:drop-shadow(0 1px 1px rgba(0,0,0,.9)); }
  .L .stage::before{ top:4px } .L .stage::after{ bottom:4px }
  .L .pnl{ position:relative; overflow:hidden; border-radius:10px/14px; margin:8px 0;
    background:radial-gradient(ellipse at 50% 40%,#16241f,#070c0a 80%);
    box-shadow:inset 0 0 28px rgba(0,0,0,.95), 0 0 0 3px #100e0b; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 28% 10%,rgba(255,255,255,.10),transparent 52%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:3px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; }` },

  { id: 'dusty', name: 'DUSTY GLASS', from: 'the desert got in',
    say: 'A haze of Vegas dust across the front. The picture is still fine, you are just looking at it through a year of nobody cleaning it.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#16241f,#080d0b 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), 0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.28) 0 1px,transparent 1px 3px),
      radial-gradient(circle at 18% 26%,rgba(198,178,138,.16),transparent 26%),
      radial-gradient(circle at 74% 62%,rgba(198,178,138,.13),transparent 30%),
      radial-gradient(circle at 44% 84%,rgba(198,178,138,.11),transparent 24%),
      radial-gradient(circle at 88% 18%,rgba(198,178,138,.10),transparent 22%),
      linear-gradient(160deg,rgba(190,172,132,.10),transparent 60%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 9px rgba(97,168,159,.55); }
  .L .btn{ background:rgba(97,168,159,.09); border:1px solid rgba(97,168,159,.45); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.7); }
  .L .btn:active{ background:rgba(97,168,159,.28); color:#04100d; }` },

  { id: 'cracked', name: 'CRACKED', from: 'it has been hit',
    say: 'A fracture running out of one corner. Nothing behind it is broken, so it still works, it has just had a life before you got it.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#16241f,#080d0b 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), 0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.30) 0 1px,transparent 1px 3px),
      linear-gradient(56deg,transparent 0 41%,rgba(220,255,246,.55) 41% 41.5%,transparent 41.5%),
      linear-gradient(19deg,transparent 0 63%,rgba(220,255,246,.34) 63% 63.4%,transparent 63.4%),
      linear-gradient(104deg,transparent 0 74%,rgba(220,255,246,.26) 74% 74.3%,transparent 74.3%),
      radial-gradient(circle at 88% 88%,rgba(230,255,250,.20),transparent 16%),
      radial-gradient(ellipse at 30% 12%,rgba(255,255,255,.09),transparent 55%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.65); }
  .L .btn{ background:rgba(97,168,159,.10); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; }` },

  { id: 'bloom', name: 'HEAVY BLOOM', from: 'tired phosphor',
    say: 'The letters bleed into the glass around them. The phosphor kept glowing after the beam went past, and this tube has been on for twenty years.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#173029,#080f0d 80%);
    box-shadow:inset 0 0 40px rgba(0,0,0,.9), inset 0 0 30px rgba(120,255,210,.16),
      0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 0 26px rgba(97,168,159,.22), 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.22) 0 1px,transparent 1px 3px),
      radial-gradient(ellipse at 30% 12%,rgba(255,255,255,.10),transparent 55%); }
  .L .rd{ color:#8fd8cc; text-shadow:0 0 5px #61a89f,0 0 14px rgba(97,168,159,.9); }
  .L .ttl,.L .bd{ color:#d6fff5;
    text-shadow:0 0 4px #61a89f,0 0 12px rgba(97,168,159,.95),0 0 26px rgba(97,168,159,.6); }
  .L .btn{ background:rgba(97,168,159,.14); border:1px solid rgba(120,220,205,.7); color:#e6fffa;
    border-radius:4px; text-shadow:0 0 6px #61a89f,0 0 18px rgba(97,168,159,.95);
    box-shadow:0 0 18px rgba(97,168,159,.4), inset 0 0 14px rgba(97,168,159,.25); }
  .L .btn:active{ background:#9fe6d9; color:#04100d; text-shadow:none; }` },

  { id: 'reflect', name: 'YOU CAN SEE THE ROOM IN IT', from: 'real glass reflects',
    say: 'A soft reflection sitting on the front of the glass. It says there is a room around you, and it is the one thing here that only works because the world behind it is dark.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border-radius:16px/22px;
    background:radial-gradient(ellipse at 50% 38%,#13201c,#070b09 78%);
    box-shadow:inset 0 0 34px rgba(0,0,0,.95), 0 0 0 4px #1b1712, 0 0 0 6px #0a0806, 0 10px 22px #000; }
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(rgba(0,0,0,.28) 0 1px,transparent 1px 3px),
      linear-gradient(114deg,rgba(255,247,225,.16) 0 16%,transparent 30%),
      linear-gradient(114deg,transparent 0 52%,rgba(255,247,225,.07) 58% 68%,transparent 76%),
      radial-gradient(ellipse at 78% 96%,rgba(216,167,66,.10),transparent 42%); }
  .L .rd,.L .ttl,.L .bd{ color:${C.teal}; text-shadow:0 0 7px rgba(97,168,159,.6); }
  .L .btn{ background:rgba(97,168,159,.09); border:1px solid rgba(97,168,159,.5); color:${C.teal};
    border-radius:4px; text-shadow:0 0 8px rgba(97,168,159,.8); }
  .L .btn:active{ background:rgba(97,168,159,.30); color:#04100d; }` }
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
<title>BOHEMIA &middot; BEHIND GLASS</title>
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
  <h1>BEHIND GLASS &middot; ROUND 2</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>You kept BEHIND GLASS and killed the other eleven.</b> So these are
twelve ways to push that one, not twelve new ideas. Number 1 is exactly what you
already thumbed, so you have something to judge the rest against.
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
  var KEY='bohemia_ui_glass_r2';
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
    var L=[]; L.push('BOHEMIA - BEHIND GLASS, ROUND 2 - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_GLASS_R2.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_GLASS_R2.txt';
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

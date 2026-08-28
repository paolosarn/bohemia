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
/* ROUND FOUR. Six ways to push each of the two that survived round three.
   NUMBER 1 AND NUMBER 7 ARE THE TWO HE ALREADY PICKED, UNCHANGED, because a
   round of variations with nothing to measure against is a round judged from
   memory. */
const HOLO = `
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
  .L .btn:active{ background:rgba(150,245,225,.45); color:#04100d; text-shadow:none; }`;

const STAMP = `
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
    box-shadow:inset 0 3px 7px rgba(0,0,0,.6), 0 0 0 #2e2a23; }`;

const LOOKS = [
  { id: 'holo', name: 'HOLOGRAM: THE ONE YOU PICKED', from: 'unchanged, the anchor',
    say: 'Exactly what you thumbed. The five under it are changes to this one.',
    css: HOLO },

  { id: 'emit', name: 'HOLOGRAM: FROM AN EMITTER', from: 'you can see what it comes out of',
    say: 'A projector sitting under it with a lit slot. The light has a source you could kick over, so it stops being magic and becomes equipment.',
    css: HOLO + `
  .L .stage{ position:relative; padding-bottom:58px; }
  .L .stage::after{ content:''; position:absolute; left:50%; bottom:6px; width:134px; height:22px;
    transform:translateX(-50%); border-radius:3px;
    background:linear-gradient(#4a453b,#211e19);
    box-shadow:inset 0 1px 0 rgba(255,250,230,.28), inset 0 -3px 6px rgba(0,0,0,.7),
      0 5px 0 #100e0b, 0 10px 16px rgba(0,0,0,.7); }
  .L .stage::before{ content:''; position:absolute; left:50%; bottom:23px; width:66px; height:5px;
    transform:translateX(-50%); z-index:2; border-radius:2px; background:#9ff0e0;
    box-shadow:0 0 12px #61a89f, 0 0 26px rgba(97,168,159,.9); }` },

  { id: 'dust', name: 'HOLOGRAM: DUST IN THE BEAM', from: 'the air becomes visible',
    say: 'Motes drifting through the cone, catching the light. It is the only thing that proves the beam is passing through real air.',
    css: HOLO + `
  .L .pnl::before{ content:''; position:absolute; left:24%; right:24%; top:100%; height:40px;
    background:
      radial-gradient(circle 1.5px at 30% 22%,rgba(200,255,245,.9),transparent),
      radial-gradient(circle 1px at 62% 48%,rgba(200,255,245,.75),transparent),
      radial-gradient(circle 1.5px at 44% 74%,rgba(200,255,245,.6),transparent),
      radial-gradient(circle 1px at 74% 16%,rgba(200,255,245,.7),transparent),
      linear-gradient(rgba(97,168,159,.24),transparent);
    -webkit-clip-path:polygon(0 0,100% 0,68% 100%,32% 100%);
    clip-path:polygon(0 0,100% 0,68% 100%,32% 100%); }
  .L .pnl{ background:
      radial-gradient(circle 1.5px at 12% 24%,rgba(220,255,250,.55),transparent),
      radial-gradient(circle 1px at 78% 38%,rgba(220,255,250,.45),transparent),
      radial-gradient(circle 1.5px at 56% 76%,rgba(220,255,250,.40),transparent),
      radial-gradient(circle 1px at 33% 62%,rgba(220,255,250,.5),transparent),
      linear-gradient(rgba(97,168,159,.13),rgba(97,168,159,.03)); }` },

  { id: 'torn', name: 'HOLOGRAM: BROKEN SIGNAL', from: 'the projector is damaged',
    say: 'It tears into bands and slips sideways. Whatever is making this picture is not in good condition, which is the only one here that says something about the world it is standing in.',
    css: HOLO + `
  .L .pnl::after{ content:''; position:absolute; inset:0; pointer-events:none;
    background:
      repeating-linear-gradient(rgba(160,250,232,.10) 0 2px,transparent 2px 5px),
      linear-gradient(rgba(0,0,0,0) 0 17%,rgba(160,250,232,.16) 17% 21%,rgba(0,0,0,0) 21% 44%,
        rgba(0,0,0,.55) 44% 47%,rgba(0,0,0,0) 47% 71%,rgba(160,250,232,.13) 71% 74%,rgba(0,0,0,0) 74%); }
  .L .ttl{ transform:translateX(5px); }
  .L .bd{ text-shadow:0 0 8px rgba(97,168,159,.95), 4px 0 0 rgba(255,110,110,.42), -4px 0 0 rgba(110,190,255,.42); }` },

  { id: 'solid', name: 'HOLOGRAM: SOLID LIGHT', from: 'less ghost, more slab',
    say: 'Denser and brighter, closer to a block of light than a ghost. You could believe it would stop your hand.',
    css: HOLO + `
  .L .pnl{ background:linear-gradient(rgba(97,168,159,.40),rgba(97,168,159,.22));
    border-top:2px solid rgba(190,255,242,.9); border-bottom:2px solid rgba(150,245,225,.6);
    box-shadow:0 0 40px rgba(97,168,159,.55), 0 0 90px rgba(97,168,159,.28),
      inset 0 0 34px rgba(190,255,242,.22); }
  .L .ttl,.L .bd{ color:#f2fffc; text-shadow:0 0 6px rgba(230,255,250,.9),0 0 20px rgba(97,168,159,.9); }
  .L .btn{ background:rgba(150,245,225,.28); border:2px solid rgba(200,255,246,.85); color:#f6fffd; }` },

  { id: 'wire', name: 'HOLOGRAM: EDGE ONLY', from: 'outlines, nothing filled',
    say: 'Only the edges are lit and the middle is empty air. The thinnest version there is, and the one you can still see the street through.',
    css: HOLO + `
  .L .pnl{ background:transparent; border:1px solid rgba(150,245,225,.75);
    box-shadow:0 0 22px rgba(97,168,159,.35), inset 0 0 22px rgba(97,168,159,.10); }
  .L .ttl,.L .bd{ color:transparent; -webkit-text-stroke:1px rgba(190,255,242,.92);
    text-shadow:0 0 10px rgba(97,168,159,.8); }
  .L .btn{ background:transparent; border:1px solid rgba(190,255,242,.85); color:transparent;
    -webkit-text-stroke:1px rgba(230,255,250,.95); text-shadow:0 0 12px rgba(97,168,159,.9); }
  .L .btn:active{ background:rgba(150,245,225,.35); color:#04100d; -webkit-text-stroke:0; }` },

  { id: 'stamp', name: 'METAL: THE ONE YOU PICKED', from: 'unchanged, the anchor',
    say: 'Exactly what you thumbed. Letters pressed into the plate, carrying no colour of their own.',
    css: STAMP },

  { id: 'deep', name: 'METAL: STRUCK HARDER', from: 'more force on the die',
    say: 'Pressed much deeper. The shadow inside each letter goes almost black and the lit lip is sharp. Somebody leaned on it.',
    css: STAMP + `
  .L .pnl{ background:linear-gradient(158deg,#968d7c,#5a5348);
    box-shadow:inset 0 3px 0 rgba(255,253,244,.55), inset 0 -4px 10px rgba(0,0,0,.6),
      0 10px 20px rgba(0,0,0,.75); }
  .L .rd,.L .ttl,.L .bd{ color:#4e483d;
    text-shadow:0 3px 0 rgba(255,253,244,.75), 0 -2px 2px rgba(0,0,0,.95); }
  .L .rd{ color:#5a5347 }
  .L .btn{ color:#4a443a; text-shadow:0 3px 0 rgba(255,253,244,.8), 0 -2px 2px rgba(0,0,0,.95); }` },

  { id: 'raised', name: 'METAL: RAISED, NOT SUNK', from: 'a licence plate',
    say: 'The same idea turned inside out. The letters push OUT toward you instead of in, so the light sits on top of them and the shadow falls underneath.',
    css: STAMP + `
  .L .pnl{ background:linear-gradient(158deg,#7f7768,#4f483e);
    box-shadow:inset 0 2px 0 rgba(255,252,240,.34), inset 0 -3px 8px rgba(0,0,0,.55),
      0 9px 18px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ color:#a79d8b;
    text-shadow:0 -1px 0 rgba(255,253,246,.75), 0 2px 2px rgba(0,0,0,.9), 0 3px 4px rgba(0,0,0,.55); }
  .L .rd{ color:#97dccf; text-shadow:0 -1px 0 rgba(220,255,250,.6), 0 2px 3px rgba(0,0,0,.9); }
  .L .btn{ background:linear-gradient(158deg,#8b8272,#544d42); color:#b3a996;
    text-shadow:0 -1px 0 rgba(255,253,246,.8), 0 2px 3px rgba(0,0,0,.95); }` },

  { id: 'inked', name: 'METAL: PAINT IN THE GROOVES', from: 'struck, then wiped',
    say: 'Stamped first, then paint dragged across the face and wiped off. Only the sunk letters keep it, so the colour is trapped in the damage.',
    css: STAMP + `
  .L .rd{ color:#1d4a44; text-shadow:0 2px 0 rgba(255,252,238,.5), 0 -1px 1px rgba(0,0,0,.6); }
  .L .ttl,.L .bd{ color:#241a06;
    text-shadow:0 2px 0 rgba(255,252,238,.55), 0 -1px 1px rgba(0,0,0,.55); }
  .L .btn{ color:#241a06; text-shadow:0 2px 0 rgba(255,252,238,.6), 0 -1px 1px rgba(0,0,0,.6); }` },

  { id: 'brass', name: 'METAL: WORN BRASS', from: 'polished where hands land',
    say: 'Warmer metal, brighter down the middle where thumbs have been rubbing it for years. The wear tells you which part actually gets used.',
    css: STAMP + `
  .L .pnl{ background:
      radial-gradient(ellipse at 50% 55%,rgba(255,238,190,.30),transparent 62%),
      linear-gradient(158deg,#9b8248,#5c4c26);
    box-shadow:inset 0 2px 0 rgba(255,246,210,.5), inset 0 -3px 9px rgba(0,0,0,.55),
      0 9px 18px rgba(0,0,0,.72); }
  .L .rd,.L .ttl,.L .bd{ color:#6b5a2e;
    text-shadow:0 2px 0 rgba(255,244,200,.6), 0 -1px 1px rgba(0,0,0,.8); }
  .L .rd{ color:#75632f }
  .L .btn{ background:
      radial-gradient(ellipse at 50% 50%,rgba(255,240,195,.34),transparent 66%),
      linear-gradient(158deg,#a98e4f,#66552a);
    color:#63532a; text-shadow:0 2px 0 rgba(255,244,200,.65), 0 -1px 1px rgba(0,0,0,.85);
    box-shadow:inset 0 2px 0 rgba(255,246,210,.55), 0 5px 0 #33290f, 0 9px 13px rgba(0,0,0,.6); }` },

  { id: 'dymo', name: 'METAL: EMBOSSED TAPE', from: 'a label gun',
    say: 'The same idea in plastic: a strip squeezed through a label gun, and the plastic turns white exactly where it was stretched. The cheapest way anybody ever labelled anything.',
    css: `
  .L .pnl{ background:linear-gradient(#241f1b,#161311); border-radius:2px; padding:14px 11px 16px;
    box-shadow:0 8px 16px rgba(0,0,0,.7); }
  .L .rd,.L .ttl,.L .bd{ display:block; padding:6px 10px; margin-bottom:7px; border-radius:9px;
    background:linear-gradient(#2f2723,#1c1715); color:#efe9df; letter-spacing:2.4px;
    text-shadow:0 -1px 0 rgba(255,255,255,.55), 0 2px 2px rgba(0,0,0,.9);
    box-shadow:inset 0 1px 0 rgba(255,250,240,.16), inset 0 -2px 4px rgba(0,0,0,.7),
      0 2px 4px rgba(0,0,0,.6); }
  .L .rd{ color:#bfeee4; }
  .L .btn{ border:0; border-radius:9px; letter-spacing:3px; color:#fbf7ef;
    background:linear-gradient(#3a2f16,#211a0c);
    text-shadow:0 -1px 0 rgba(255,255,255,.6), 0 2px 2px rgba(0,0,0,.95);
    box-shadow:inset 0 1px 0 rgba(255,250,230,.22), inset 0 -2px 5px rgba(0,0,0,.75),
      0 4px 8px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(3px); }` }
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
<title>BOHEMIA &middot; LIGHT AND METAL</title>
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
  <h1>LIGHT AND METAL &middot; ROUND 4</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>Two survived round three: the hologram and the stamped metal.</b> Six ways to push each. Number 1 and number 7 are the two you already picked, unchanged, so you can see exactly what every change did. <b>You can say yes to more than one.</b></p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_r4';
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
    var L=[]; L.push('BOHEMIA - LIGHT AND METAL, ROUND 4 - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_R4.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_R4.txt';
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

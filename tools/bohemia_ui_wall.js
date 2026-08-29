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
/* ROUND SEVEN. ALL EIGHT GLASS CARDS DIED, AND I PICKED THAT DIRECTION MYSELF.
   HIS WORDS, 8/29 18:23:
     "Keep cooking I feel like the holographic shit would be at three and
      they're still looking one will be act two"

   *** MY ROUND-SIX FINDING WAS WRONG AND IT COST A WHOLE ROUND. *** I found that
   round two had blanket-approved twelve BEHIND GLASS looks and concluded the
   third master was "already approved, just never narrowed". Eight glass cards,
   zero survivors. A BLANKET SAVE IS NOT A PICK. "Consider all of them saved"
   five rounds ago meant nothing was thrown away yet, and I read it as a standing
   yes -- which is the same mistake as reading the middle of the graveyard and
   acting on it, one day after that lesson was written down.
   The glass is dead now. NEWEST DATE WINS and this is the newest date.

   AND THE REASON IS MEASURABLE, WHICH IS THE USEFUL PART. He asked for a 2D game
   with a 3D interface, so the question was never taste, it was whether the thing
   is dimensional at all. Measured on the button of every card, in rendered
   pixels, sampling the strip just under it against the clean strip further down:
     THE METAL       throws a real cast shadow  (near/far luminance 1.45)
     THE HOLOGRAM    throws none                (0.96 - 1.00)
     ALL EIGHT GLASS throw none                 (0.83 - 0.95)
   THE METAL IS AN OBJECT: it occludes, its button sits up on a hard 5px lip, the
   light lands on one edge. THE HOLOGRAM IS NOT AN OBJECT AND IS RIGHT NOT TO BE:
   light does not occlude, and that missing shadow is the whole reason it reads as
   light instead of matter. Both of them COMMIT.
   THE GLASS COMMITTED TO NEITHER. It did not occlude, so it was not an object,
   and it did not glow into the space around it, so it was not light. Its only
   depth cue was an inner shadow, and this same session had already proved that a
   soft wash reads as a vignette, which is to say as nothing. IT WAS A DARK
   RECTANGLE WITH A HAIRLINE ON IT.

   SO THE RULE FOR THIS ROUND, AND IT IS A HARD ONE: EVERY LOOK COMMITS. Either it
   is an OBJECT -- it throws a shadow onto what is behind it and its button sits at
   a visibly different height -- or it is LIGHT, which throws nothing and glows into
   the space around it. Halfway is a dark rectangle. Six of each.

   AND THE BRIEF IS A HUNT AGAIN, NOT A NARROWING. Round two narrowed and got 12
   of 12 because HE had named the direction. Round six narrowed and got 0 of 8
   because I had. He has not named a direction for the one that is missing, so
   this is twelve different ideas, the way round three was.
   Metal owns OBJECT and the hologram owns LIGHT, so the territory worth hunting
   is objects that are not metal, and light that is not a hologram.

   MOTION IS DELIBERATELY OFF HERE. He settled motion for the hologram this round
   (kept DRIFTING BANDS and SLOW ROLL, killed ONE SLOW SWEEP -- which is the
   quietest of the three and the only one that goes still between events, so
   CONTINUOUS beats occasional, and that is the second time he has killed a thing
   that fires and stops, after RARE TEAR). Adding movement to a hunt round would
   put two questions on one card.

   WHICH ACT WEARS WHICH IS STILL HIS. His sentence reads two ways -- the hologram
   is act three and either the metal is act two with act one still missing, or the
   metal is act one with act two still missing. BOTH READINGS NEED THE SAME WORK:
   one more master that is neither metal nor hologram. So it does not need
   answering to build this, and it is not guessed at. */

const OBJECT_BTN = (face, lip, under) => `
  .L .btn{ background:${face}; border:0; border-radius:2px;
    box-shadow:inset 0 2px 0 ${lip}, 0 5px 0 ${under}, 0 9px 13px rgba(0,0,0,.6); }
  .L .btn:active{ transform:translateY(5px); box-shadow:inset 0 3px 7px rgba(0,0,0,.6); }`;

const LOOKS = [
  /* ---- SIX OBJECTS. Each one occludes: a real cast shadow under the panel, and
     a button standing on a hard lip. None of them is metal. ---- */

  { id: 'o_conc', name: 'OBJECT: POURED CONCRETE', from: 'a slab somebody poured',
    say: 'A heavy grey slab with the stones still showing in it. The light rakes across it from the top so the surface has grain instead of being smooth.',
    css: `
  .L .pnl{ position:relative; border-radius:1px;
    background:
      radial-gradient(circle 1px at 21% 34%,rgba(255,255,255,.05),transparent),
      radial-gradient(circle 2px at 68% 71%,rgba(0,0,0,.22),transparent),
      radial-gradient(circle 1px at 44% 86%,rgba(255,255,255,.04),transparent),
      linear-gradient(168deg,#6d6b66,#3c3a37);
    background-size:37px 31px,53px 47px,41px 43px,auto;
    box-shadow:inset 0 2px 0 rgba(255,255,252,.20), inset 0 -4px 10px rgba(0,0,0,.5),
      0 11px 20px rgba(0,0,0,.74); }
  .L .rd{ color:#93cfc4; } .L .ttl,.L .bd{ color:#cbc7bf; }
  .L .rd,.L .ttl,.L .bd{ text-shadow:0 1px 0 rgba(0,0,0,.4); }
  .L .btn{ color:#d3cfc6; text-shadow:0 1px 0 rgba(0,0,0,.45); }`
    + OBJECT_BTN('linear-gradient(168deg,#77746e,#43413d)','rgba(255,255,252,.22)','#211f1d') },

  { id: 'o_ply', name: 'OBJECT: BARE PLYWOOD', from: 'the board over the window',
    say: 'A sheet of cheap wood, the kind nailed over a window. You can see the grain running one way and the edge is worn light.',
    css: `
  .L .pnl{ position:relative; border-radius:1px;
    background:
      linear-gradient(91deg,transparent 0 17%,rgba(0,0,0,.13) 17% 18%,transparent 18% 41%,
        rgba(0,0,0,.09) 41% 42%,transparent 42% 73%,rgba(0,0,0,.15) 73% 74%,transparent 74%),
      repeating-linear-gradient(93deg,rgba(0,0,0,.07) 0 1px,transparent 1px 9px),
      repeating-linear-gradient(89deg,rgba(255,240,215,.045) 0 1px,transparent 1px 23px),
      repeating-linear-gradient(94deg,rgba(0,0,0,.05) 0 2px,transparent 2px 31px),
      linear-gradient(168deg,#7a6244,#412f1e);
    box-shadow:inset 0 2px 0 rgba(255,236,204,.26), inset 0 -4px 11px rgba(0,0,0,.55),
      0 11px 20px rgba(0,0,0,.74); }
  .L .rd{ color:#9ad6c6; } .L .ttl,.L .bd{ color:#e0cfb2; }
  .L .rd,.L .ttl,.L .bd{ text-shadow:0 1px 0 rgba(0,0,0,.5); }
  .L .btn{ color:#e6d6ba; text-shadow:0 1px 0 rgba(0,0,0,.5); }`
    + OBJECT_BTN('linear-gradient(168deg,#8a704e,#4a3623)','rgba(255,236,204,.28)','#241a11') },

  { id: 'o_rub', name: 'OBJECT: THICK RUBBER', from: 'cut out of a tyre',
    say: 'Matte black rubber, soft at the corners, and it eats the light instead of bouncing it. The heaviest looking one here.',
    css: `
  .L .pnl{ position:relative; border-radius:7px;
    background:linear-gradient(168deg,#3d3d3f,#171718);
    box-shadow:inset 0 2px 0 rgba(255,255,255,.30), inset 0 -6px 16px rgba(0,0,0,.72),
      0 14px 26px rgba(0,0,0,.85); }
  .L .rd{ color:#7fc9bd; } .L .ttl,.L .bd{ color:#c8c8c6;
    text-shadow:0 -1px 0 rgba(255,255,255,.10), 0 1px 0 rgba(0,0,0,.55); }
  .L .btn{ color:#d4d3d0; text-shadow:0 -1px 0 rgba(255,255,255,.12), 0 1px 0 rgba(0,0,0,.6); }`
    + OBJECT_BTN('linear-gradient(168deg,#50504f,#232324)','rgba(255,255,255,.34)','#000000') },

  { id: 'o_tarp', name: 'OBJECT: A STRETCHED TARP', from: 'canvas pulled tight',
    say: 'Heavy cloth pulled tight across a frame. It sags a little in the middle and the weave catches the light.',
    css: `
  .L .pnl{ position:relative; border-radius:2px;
    background:
      repeating-linear-gradient(45deg,rgba(0,0,0,.07) 0 1px,transparent 1px 4px),
      repeating-linear-gradient(-45deg,rgba(255,250,235,.05) 0 1px,transparent 1px 4px),
      radial-gradient(120% 90% at 50% 44%,rgba(0,0,0,.24),transparent 70%),
      linear-gradient(168deg,#8d8067,#584d3c);
    box-shadow:inset 0 2px 0 rgba(255,250,235,.26), inset 0 -4px 12px rgba(0,0,0,.42),
      0 11px 21px rgba(0,0,0,.7); }
  .L .rd{ color:#8fd2c2; } .L .ttl,.L .bd{ color:#eadcc2; }
  .L .rd,.L .ttl,.L .bd{ text-shadow:0 1px 0 rgba(0,0,0,.4); }
  .L .btn{ color:#eee1c8; text-shadow:0 1px 0 rgba(0,0,0,.42); }`
    + OBJECT_BTN('linear-gradient(168deg,#9a8c71,#615544)','rgba(255,250,235,.28)','#312a20') },

  { id: 'o_clay', name: 'OBJECT: FIRED CLAY', from: 'baked out of the ground',
    say: 'A slab of baked earth. Warm, dusty, a little uneven, and it belongs to the desert more than anything else here.',
    css: `
  .L .pnl{ position:relative; border-radius:3px;
    background:
      radial-gradient(circle 2px at 28% 26%,rgba(0,0,0,.16),transparent),
      radial-gradient(circle 1px at 74% 63%,rgba(255,236,206,.08),transparent),
      linear-gradient(168deg,#9a7355,#5a3f2c);
    background-size:47px 39px,61px 51px,auto;
    box-shadow:inset 0 2px 0 rgba(255,236,206,.28), inset 0 -4px 12px rgba(0,0,0,.46),
      0 11px 20px rgba(0,0,0,.72); }
  .L .rd{ color:#9bd9c6; } .L .ttl,.L .bd{ color:#f0dcc4; }
  .L .rd,.L .ttl,.L .bd{ text-shadow:0 1px 0 rgba(0,0,0,.42); }
  .L .btn{ color:#f4e2cc; text-shadow:0 1px 0 rgba(0,0,0,.45); }`
    + OBJECT_BTN('linear-gradient(168deg,#a88062,#654833)','rgba(255,236,206,.3)','#33231a') },

  { id: 'o_sand', name: 'OBJECT: PACKED SAND', from: 'a filled bag, flattened',
    say: 'Sand packed flat and hard. Almost no shine at all, so everything you read is the shape and the shadow.',
    css: `
  .L .pnl{ position:relative; border-radius:5px;
    background:
      radial-gradient(circle 1px at 17% 41%,rgba(0,0,0,.13),transparent),
      radial-gradient(circle 1px at 59% 78%,rgba(0,0,0,.11),transparent),
      linear-gradient(168deg,#9d9075,#605645);
    background-size:23px 19px,29px 27px,auto;
    box-shadow:inset 0 2px 0 rgba(255,248,228,.22), inset 0 -5px 13px rgba(0,0,0,.42),
      0 12px 22px rgba(0,0,0,.72); }
  .L .rd{ color:#8ecfbe; } .L .ttl,.L .bd{ color:#efe6d0; }
  .L .rd,.L .ttl,.L .bd{ text-shadow:0 1px 0 rgba(0,0,0,.38); }
  .L .btn{ color:#f2ead6; text-shadow:0 1px 0 rgba(0,0,0,.4); }`
    + OBJECT_BTN('linear-gradient(168deg,#a89b80,#6a5f4d)','rgba(255,248,228,.24)','#38322a') },

  /* ---- SIX LIGHTS. None of these occludes anything. Each one puts light INTO the
     space around it, which is the cue the hologram earns its read from. And none
     is the hologram: that one is light with nothing behind it, these are light
     meeting something. ---- */

  { id: 'l_back', name: 'LIGHT: THROUGH A SLAB', from: 'lit from behind',
    say: 'A thick pale block with a lamp behind it. The light is inside the material instead of on top of it, brightest in the middle where the slab is thinnest.',
    css: `
  .L .pnl{ position:relative; border:0; border-radius:2px;
    background:
      radial-gradient(120% 100% at 50% 50%,rgba(226,238,224,.22),rgba(226,238,224,.06) 62%,transparent 82%),
      linear-gradient(168deg,rgba(140,160,150,.13),rgba(90,105,98,.07));
    box-shadow:0 0 34px rgba(210,232,220,.16), 0 0 78px rgba(210,232,220,.07),
      inset 0 0 40px rgba(226,238,224,.10); }
  .L .rd{ color:#9fe0cd; } .L .ttl,.L .bd{ color:#f0f7f0; }
  .L .btn{ background:rgba(226,238,224,.13); border:1px solid rgba(226,238,224,.34);
    border-radius:2px; color:#f4faf4; box-shadow:0 0 16px rgba(210,232,220,.18); }
  .L .btn:active{ background:rgba(226,238,224,.42); color:#10161a; }` },

  { id: 'l_wall', name: 'LIGHT: THROWN ON A WALL', from: 'a projector and a rough wall',
    say: 'The words are light landing on a real wall, so the wall shows straight through them. Nothing is floating, but nothing is solid either.',
    css: `
  .L .pnl{ position:relative; border:0; border-radius:0;
    background:
      radial-gradient(circle 2px at 23% 37%,rgba(0,0,0,.20),transparent),
      radial-gradient(circle 1px at 66% 72%,rgba(0,0,0,.16),transparent),
      radial-gradient(115% 96% at 50% 34%,rgba(180,235,220,.16),rgba(180,235,220,.05) 58%,transparent 78%),
      linear-gradient(168deg,#3b3c38,#232421);
    background-size:43px 37px,51px 49px,auto,auto;
    box-shadow:0 0 30px rgba(160,220,205,.10); }
  .L .rd{ color:#9adecb; } .L .ttl,.L .bd{ color:#e2f2ea; text-shadow:0 0 8px rgba(150,225,205,.5); }
  .L .btn{ background:rgba(170,230,215,.07); border:1px dashed rgba(180,235,220,.42);
    border-radius:0; color:#eaf7f0; text-shadow:0 0 8px rgba(150,225,205,.55); }
  .L .btn:active{ background:rgba(180,235,220,.4); color:#0d1512; text-shadow:none; }` },

  { id: 'l_slot', name: 'LIGHT: OUT OF A SLOT', from: 'a gap in something heavy',
    say: 'All the light comes out of one narrow gap along the top and spills down. Everything lower is darker because it is further from the opening.',
    css: `
  .L .pnl{ position:relative; border:0; border-radius:0;
    border-top:2px solid rgba(196,246,232,.85);
    background:linear-gradient(rgba(150,228,210,.20),rgba(150,228,210,.05) 42%,transparent 76%),
      linear-gradient(#1c211f,#0e1211);
    box-shadow:0 -3px 26px rgba(150,228,210,.35), 0 0 60px rgba(150,228,210,.12); }
  .L .rd{ color:#a8ead6; } .L .ttl{ color:#eefaf4; } .L .bd{ color:#c3ded4; }
  .L .btn{ background:rgba(150,228,210,.06); border:1px solid rgba(150,228,210,.3);
    border-radius:0; color:#d8efe6; }
  .L .btn:active{ background:rgba(196,246,232,.42); color:#08100e; }` },

  { id: 'l_punch', name: 'LIGHT: THROUGH PUNCHED HOLES', from: 'drilled plate, lamp behind',
    say: 'A metal sheet with holes drilled in it and a light behind. The dots sit behind the words, never across them, so the plate is doing the talking and the message stays clean.',
    css: `
  .L .pnl{ position:relative; overflow:hidden; border:0; border-radius:1px;
    background:linear-gradient(168deg,#2a2f2d,#151918);
    box-shadow:0 0 30px rgba(150,228,210,.16), 0 0 66px rgba(150,228,210,.07); }
  .L .pnl > *{ position:relative; z-index:2; }
  .L .pnl::after{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
    background:
      radial-gradient(circle 1.5px at 30% 28%,rgba(178,242,226,.44),transparent 70%),
      radial-gradient(circle 1.2px at 74% 61%,rgba(178,242,226,.34),transparent 70%),
      radial-gradient(circle 1.6px at 47% 83%,rgba(178,242,226,.30),transparent 70%);
    background-size:13px 12px,17px 15px,19px 21px; }
  .L .rd{ color:#a3e6d2; } .L .ttl,.L .bd{ color:#eaf8f2;
    text-shadow:0 0 3px #151918,0 0 7px #151918,0 0 12px rgba(150,228,210,.5); }
  .L .btn{ background:rgba(150,228,210,.08); border:1px solid rgba(178,242,226,.44);
    border-radius:1px; color:#f0fbf6;
    text-shadow:0 0 3px #151918,0 0 9px rgba(150,228,210,.6); }
  .L .btn:active{ background:rgba(178,242,226,.44); color:#08100e; text-shadow:none; }` },

  { id: 'l_ember', name: 'LIGHT: STILL WARM', from: 'the thing itself is glowing',
    say: 'Nothing is shining on it. The panel is making its own light, faintly, the way something does after it has been hot for a long time.',
    css: `
  .L .pnl{ position:relative; border:0; border-radius:2px;
    background:
      radial-gradient(130% 100% at 30% 82%,rgba(180,238,220,.17),transparent 62%),
      radial-gradient(110% 90% at 78% 22%,rgba(180,238,220,.10),transparent 58%),
      linear-gradient(168deg,#20262a,#0f1315);
    box-shadow:0 0 26px rgba(150,228,210,.13), 0 0 70px rgba(150,228,210,.06),
      inset 0 0 34px rgba(150,228,210,.07); }
  .L .rd{ color:#9fe2ce; } .L .ttl,.L .bd{ color:#dff0e9; }
  .L .btn{ background:radial-gradient(120% 140% at 50% 120%,rgba(180,238,220,.22),rgba(180,238,220,.04) 70%);
    border:1px solid rgba(180,238,220,.26); border-radius:2px; color:#eaf7f1;
    box-shadow:0 0 18px rgba(150,228,210,.16); }
  .L .btn:active{ background:rgba(180,238,220,.4); color:#0a1210; }` },

  { id: 'l_cloth', name: 'LIGHT: THROUGH CLOTH', from: 'a lamp behind fabric',
    say: 'A lamp sitting behind a sheet. The weave shows up dark against the glow and everything has a soft edge because cloth does not have hard ones.',
    css: `
  .L .pnl{ position:relative; border:0; border-radius:9px;
    background:
      repeating-linear-gradient(90deg,rgba(0,0,0,.13) 0 1px,transparent 1px 4px),
      repeating-linear-gradient(0deg,rgba(0,0,0,.13) 0 1px,transparent 1px 4px),
      radial-gradient(110% 96% at 50% 42%,rgba(206,240,226,.24),rgba(206,240,226,.07) 62%,transparent 84%),
      linear-gradient(168deg,#242a28,#121615);
    box-shadow:0 0 40px rgba(180,235,218,.18), 0 0 90px rgba(180,235,218,.08); }
  .L .rd{ color:#a6e5d3; } .L .ttl,.L .bd{ color:#eef8f3; text-shadow:0 0 7px rgba(160,230,212,.45); }
  .L .btn{ background:rgba(206,240,226,.10); border:1px solid rgba(206,240,226,.3);
    border-radius:7px; color:#f2fbf7; box-shadow:0 0 20px rgba(180,235,218,.16); }
  .L .btn:active{ background:rgba(206,240,226,.42); color:#0b1311; }` }
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
<title>BOHEMIA &middot; THE THIRD ONE</title>
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
  <h1>THE THIRD ONE &middot; ROUND 7</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>The glass is dead, all eight, and I picked that one so that is on me.</b> Here is what I measured afterwards: the metal throws a real shadow underneath it, so it is an object. The hologram throws none at all, which is exactly why it reads as light and not as a thing. The glass did neither, so it was just a dark rectangle. <b>So every one of these twelve picks a side.</b> Numbers 1 to 6 are solid objects that are not metal. Numbers 7 to 12 are light, but never the hologram. Nothing here moves on purpose, because you already settled the movement.</p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_r7';
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
    var L=[]; L.push('BOHEMIA - THE THIRD ONE, ROUND 7 - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_R7.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_R7.txt';
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

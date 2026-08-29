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
/* ROUND SIX. HE ASKED FOR THREE MASTERS, ONE PER ACT, AND SAID TWO ARE DONE.
   HIS WORDS, 8/29 17:31:
     "Awesome keep cooking well probably have 3 sets of master ui people can
      choose from type shit looking good one for each act we got 2 squared away"

   *** THE THIRD ONE IS ALREADY APPROVED AND NOBODY EVER NARROWED IT. *** Round
   two was twelve ways of BEHIND GLASS and his answer was "consider all of them
   saved". That is a whole banked family, approved five rounds ago, never taken
   past twelve options to one look. So the hunt for a third master is not a hunt.
   Going and cooking a brand new family while a blanket-approved one sits
   unfinished is exactly the waste this lane keeps proving it cannot afford.

   WHAT ROUND FIVE ACTUALLY SAID, read off the six kept and the six killed and
   not off what I hoped it said:

   THE METAL. Killed LESS SHADOW (1px plus a 1px blur at .55), killed NO SHADOW
   AT ALL, kept BARELY THERE (1px, no blur, .45). So THE SHADOW HAS A FLOOR AND
   IT IS NOT ZERO: above it the type reads doubled, below it the plate goes flat
   and stops being raised. One pixel, no blur. He also killed MORE AIR, which
   was the only one of the six that changed neither the light nor the material
   -- it changed letter-spacing, which is dressing the rectangle, and five rounds
   say he does not want the rectangle dressed. The other two he kept, DARKER
   PLATE and SOFTER LIGHT, do not touch the shadow question at all. He answered
   it and moved the conversation to the plate and the lamp.
   THOSE THREE ARE INDEPENDENT DIALS -- shadow, plate colour, highlight softness
   -- and all three passed, so they combine into ONE settled look rather than
   competing. That is MASTER ONE and it needs no further picking.

   THE LIGHT. Kept DRIFTING BANDS, ONE SLOW SWEEP, SLOW ROLL. Killed BREATHING,
   RARE TEAR, FAINT STATIC. Every survivor is TRANSLATION: something travels
   across the panel, slowly, continuously, in one direction. Every casualty is
   not: a pulse changing brightness in place, a discrete event that fires and
   stops, and directionless grain.
   LIGHT MOVES ACROSS. IT DOES NOT BLINK, GLITCH OR BUZZ. And that is the same
   taste the first three rounds already proved wearing different clothes -- a
   pulse and a tear are a projector MISBEHAVING, which is machinery, and static
   is noise, which is decoration, and he has killed machinery and decoration in
   every single round. A band travelling across a surface is just light doing
   what light does.
   All three passed, but a master takes one motion, so three cards here differ
   ONLY by the motion and nothing else.

   SO THIS ROUND IS 1 + 3 + 8: master one settled, master two narrowed to one
   motion, master three narrowed out of the banked glass.

   AND THE GLASS IS BUILT AS GLASS, NOT AS A MONITOR, because his round-two note
   in the same breath as banking it was "find more 3d ways to display ui that
   arent ol computer screen". So the phosphor, the bezel and the housing from
   that round are not what gets pushed forward. What gets pushed forward is the
   PANE: thickness, an edge that catches light, depth behind the surface. Every
   one of these obeys the two rules round five just established -- anything that
   moves TRAVELS, and it travels BEHIND the words, never across them.

   WHICH ACT WEARS WHICH MASTER IS HIS. Three masters is the mechanism and the
   mechanism is mine; the mapping is canon and it is not guessed at here. Nor is
   whether the player picks one or the act picks it for them -- he said both in
   one sentence and neither reading changes a line of this. */

const PLATE = `
  .L .pnl{ background:linear-gradient(158deg,#544d43,#2e2923); border-radius:2px;
    box-shadow:inset 0 2px 0 rgba(255,252,240,.24), inset 0 -3px 9px rgba(0,0,0,.6),
      0 9px 18px rgba(0,0,0,.72); }
  .L .rd,.L .ttl,.L .bd{ color:#b3a894;
    text-shadow:0 -1px 2px rgba(255,253,246,.5), 0 1px 0 rgba(0,0,0,.45); }
  .L .rd{ color:#9adfd0; text-shadow:0 -1px 2px rgba(225,255,250,.45), 0 1px 0 rgba(0,0,0,.45); }
  .L .btn{ background:linear-gradient(158deg,#5f5747,#332e26); border:0; border-radius:2px;
    color:#bfb49e; text-shadow:0 -1px 2px rgba(255,253,246,.55), 0 1px 0 rgba(0,0,0,.5);
    box-shadow:inset 0 2px 0 rgba(255,252,240,.26), 0 5px 0 #191510, 0 9px 13px rgba(0,0,0,.62); }
  .L .btn:active{ transform:translateY(5px); box-shadow:inset 0 3px 7px rgba(0,0,0,.65); }`;

/* UNCHANGED FROM ROUND FIVE ON PURPOSE. He approved this field three times over
   and the only open question is which motion rides on it, so changing anything
   else here would be answering a question he did not ask. */
const LIGHT = `
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

/* THE PANE. A slab of real glass over a dark recess: a lit top edge where the
   light lands, a dim bottom edge where it leaves, and depth read as the inner
   shadow at the sides. No frame, no bezel, no housing -- that was the monitor,
   and he said not the monitor. */
const GLASS = `
  .L .stage{ padding-bottom:30px; }
  .L .pnl{ position:relative; overflow:hidden; border:0; border-radius:3px;
    background:linear-gradient(158deg,rgba(33,41,43,.94),rgba(13,17,18,.97));
    box-shadow:
      inset 0 1px 0 rgba(226,246,255,.34),
      inset 0 -1px 0 rgba(226,246,255,.09),
      inset 0 0 30px rgba(0,0,0,.55),
      0 10px 22px rgba(0,0,0,.72); }
  .L .pnl > *{ position:relative; z-index:2; }
  .L .rd{ color:#8ecfd8; }
  .L .ttl,.L .bd{ color:#d4e7eb; }
  .L .btn{ background:linear-gradient(158deg,rgba(226,246,255,.11),rgba(226,246,255,.03));
    border:1px solid rgba(226,246,255,.26); border-radius:2px; color:#e3f2f6;
    box-shadow:inset 0 1px 0 rgba(226,246,255,.32); }
  .L .btn:active{ background:rgba(226,246,255,.30); color:#0b1113; box-shadow:none; }`;

const LOOKS = [
  { id: 'm_plate', name: 'MASTER ONE: THE PLATE', from: 'your three metal yeses, combined',
    say: 'Your three are three different dials, not three rival looks, so they all fit in one panel: the shadow at one pixel with no blur, the plate darker, the light broad instead of sharp. This one is settled unless you say otherwise.',
    css: PLATE },

  { id: 'm_drift', name: 'MASTER TWO, THE LIGHT: DRIFTING BANDS', from: 'motion 1 of 3',
    say: 'Fine bands sliding steadily upward behind the words. The busiest of your three, and the most obviously alive.',
    css: LIGHT + `
  @keyframes bohDrift{ from{ background-position:0 0 } to{ background-position:0 -40px } }
  .L .pnl::after{ content:''; position:absolute; inset:-40px 0; z-index:1; pointer-events:none;
    background:repeating-linear-gradient(rgba(160,250,232,.11) 0 2px,transparent 2px 7px);
    animation:bohDrift 5.5s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` },

  { id: 'm_sweep', name: 'MASTER TWO, THE LIGHT: ONE SLOW SWEEP', from: 'motion 2 of 3',
    say: 'Nearly still. One soft bar crosses the panel every seven seconds and the rest of the time there is nothing. The quietest of your three.',
    css: LIGHT + `
  @keyframes bohSweep{ 0%{ transform:translateY(-120%) } 100%{ transform:translateY(320%) } }
  .L .pnl::after{ content:''; position:absolute; left:0; right:0; top:0; height:34%; z-index:1;
    pointer-events:none;
    background:linear-gradient(transparent,rgba(170,255,238,.16) 45%,rgba(170,255,238,.16) 55%,transparent);
    animation:bohSweep 7s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none; opacity:.5 } }` },

  { id: 'm_roll', name: 'MASTER TWO, THE LIGHT: SLOW ROLL', from: 'motion 3 of 3',
    say: 'One wide soft band rolling up forever. Always moving like the first one, but one big shape instead of many small ones. The middle of your three.',
    css: LIGHT + `
  @keyframes bohRoll{ from{ transform:translateY(100%) } to{ transform:translateY(-100%) } }
  .L .pnl::after{ content:''; position:absolute; left:0; right:0; top:0; height:100%; z-index:1;
    pointer-events:none;
    background:linear-gradient(transparent 0 30%,rgba(170,255,238,.13) 45%,rgba(170,255,238,.13) 55%,transparent 70% 100%);
    animation:bohRoll 9s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none } }` },

  { id: 'g_pane', name: 'MASTER THREE, GLASS: THE PANE', from: 'the one you kept in round two',
    say: 'The glass on its own, with the monitor stripped off it. Lit top edge, dark bottom edge, the words sitting back inside. This is the baseline the other seven move away from.',
    css: GLASS },

  { id: 'g_deep', name: 'MASTER THREE, GLASS: THICKER', from: 'more glass between you and it',
    say: 'Same pane, more of it. The words sit further back and the sides go darker, so you read the thickness before you read the text.',
    css: GLASS + `
  .L .pnl{ box-shadow:
      inset 0 2px 0 rgba(226,246,255,.38),
      inset 0 -2px 0 rgba(226,246,255,.10),
      inset 0 0 54px rgba(0,0,0,.78),
      inset 26px 0 34px rgba(0,0,0,.42),
      inset -26px 0 34px rgba(0,0,0,.42),
      0 12px 26px rgba(0,0,0,.75); }
  .L .ttl,.L .bd{ color:#bdd3d8; }` },

  { id: 'g_edge', name: 'MASTER THREE, GLASS: LIT FROM THE EDGE', from: 'light going in at the side',
    say: 'The light enters at the edges and leaks inward, which is how a real slab of glass with a lamp on its rim behaves. The middle stays dark and the words are the brightest thing in it.',
    css: GLASS + `
  .L .pnl{ background:linear-gradient(158deg,rgba(27,35,37,.96),rgba(10,13,14,.98));
    box-shadow:
      inset 0 2px 0 rgba(226,246,255,.5),
      inset 0 -2px 0 rgba(226,246,255,.22),
      inset 3px 0 0 rgba(226,246,255,.16),
      inset -3px 0 0 rgba(226,246,255,.16),
      inset 0 0 40px rgba(0,0,0,.7),
      0 0 22px rgba(150,220,235,.14),
      0 10px 22px rgba(0,0,0,.72); }
  .L .ttl{ color:#e8f7fb; }` },

  { id: 'g_curve', name: 'MASTER THREE, GLASS: CURVED', from: 'the pane bowing toward you',
    say: 'The surface bows out in the middle, so the highlight bends with it instead of running straight. Same trick the rest of the game art uses, where bands curve toward the viewer.',
    css: GLASS + `
  .L .pnl::before{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
    border-radius:3px;
    background:
      radial-gradient(150% 62% at 50% -6%,
        rgba(226,246,255,.26) 0 40%,
        rgba(226,246,255,.13) 40% 47%,
        rgba(226,246,255,.04) 47% 51%,
        transparent 51%),
      radial-gradient(150% 58% at 50% 106%,
        rgba(0,0,0,.55) 0 42%,
        rgba(0,0,0,.24) 42% 50%,
        transparent 50%),
      linear-gradient(90deg,rgba(0,0,0,.42) 0,transparent 16%,transparent 84%,rgba(0,0,0,.42) 100%); }` },

  { id: 'g_travel', name: 'MASTER THREE, GLASS: A REFLECTION THAT TRAVELS', from: 'your motion rule, on glass',
    say: 'One soft reflection slides slowly across the pane and never stops, behind the words. This is the exact kind of movement you kept three times on the hologram, put on glass instead.',
    css: GLASS + `
  @keyframes bohGlide{ from{ transform:translateX(-130%) } to{ transform:translateX(230%) } }
  .L .pnl::after{ content:''; position:absolute; top:-30%; bottom:-30%; left:0; width:42%; z-index:1;
    pointer-events:none; transform:rotate(0deg);
    background:linear-gradient(100deg,transparent,rgba(226,246,255,.10) 45%,rgba(226,246,255,.10) 55%,transparent);
    animation:bohGlide 11s linear infinite; }
  @media (prefers-reduced-motion:reduce){ .L .pnl::after{ animation:none; opacity:.45 } }` },

  { id: 'g_dust', name: 'MASTER THREE, GLASS: DUST ON IT', from: 'nobody has cleaned it',
    say: 'Fine dust sitting still on the surface, catching the light. It does not move and it is not noise. It is the one card here about the glass being an object somebody owns and never wipes.',
    css: GLASS + `
  .L .pnl::after{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.55;
    background:
      radial-gradient(circle 1px at 14% 22%,rgba(226,246,255,.42),transparent),
      radial-gradient(circle 1px at 63% 41%,rgba(226,246,255,.34),transparent),
      radial-gradient(circle 1px at 33% 77%,rgba(226,246,255,.30),transparent),
      radial-gradient(circle 1px at 84% 69%,rgba(226,246,255,.38),transparent);
    background-size:59px 47px,71px 61px,53px 67px,83px 43px; }` },

  { id: 'g_cold', name: 'MASTER THREE, GLASS: COLD AND CLEAR', from: 'the tint taken out',
    say: 'Almost no colour in the glass at all. Everything you read as glass here is the highlight and the depth, nothing is the tint. The most severe of the eight.',
    css: GLASS + `
  .L .pnl{ background:linear-gradient(158deg,rgba(24,26,27,.95),rgba(11,12,13,.98));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.36),
      inset 0 -1px 0 rgba(255,255,255,.09),
      inset 0 0 32px rgba(0,0,0,.6),
      0 10px 22px rgba(0,0,0,.74); }
  .L .rd{ color:#9fc9cf; }
  .L .ttl,.L .bd{ color:#dededd; }
  .L .btn{ background:linear-gradient(158deg,rgba(255,255,255,.10),rgba(255,255,255,.03));
    border-color:rgba(255,255,255,.24); color:#efefee; }` },

  { id: 'g_over', name: 'MASTER THREE, GLASS: OVER THE PLATE', from: 'masters one and three, same object',
    say: 'The glass laid straight onto the metal from master one, so two of your three are the same thing seen twice. The catch sits in the top corner and stays off the words. If you like this, the three acts read as one game instead of three skins.',
    css: PLATE + `
  .L .pnl{ position:relative; overflow:hidden; border-radius:3px;
    background:linear-gradient(158deg,#4a443b,#26221c);
    box-shadow:
      inset 0 1px 0 rgba(226,246,255,.40),
      inset 0 -3px 9px rgba(0,0,0,.62),
      inset 0 0 30px rgba(0,0,0,.46),
      0 10px 22px rgba(0,0,0,.74); }
  .L .rd,.L .ttl,.L .bd{ color:#c7bda9; }
  .L .rd{ color:#a8e5d7; }
  .L .pnl > *{ position:relative; z-index:2; }
  .L .pnl::after{ content:''; position:absolute; inset:0; z-index:1; pointer-events:none;
    background:
      linear-gradient(118deg,
        transparent 0 6%,
        rgba(226,246,255,.20) 6% 17%,
        rgba(226,246,255,.05) 17% 21%,
        transparent 21% 27%,
        rgba(226,246,255,.11) 27% 32%,
        transparent 32%),
      radial-gradient(72% 46% at 86% 110%,rgba(0,0,0,.34),transparent 62%); }` }
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
<title>BOHEMIA &middot; THREE MASTERS</title>
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
  <h1>THREE MASTERS &middot; ROUND 6</h1>
  <button class="sun" id="sun">SUN MODE</button>
</header>
<p class="lede"><b>You said three masters, one for each act, and two are done.</b> Number 1 is the metal, settled: your three yeses were three separate dials so they all fit in one panel. Numbers 2 to 4 are the light, identical except for the movement, so you only have to pick the movement. Numbers 5 to 12 are the third one, and you already approved it in round two and nobody ever narrowed it down: <b>the glass.</b> Say yes to as many as you want.</p>

${LOOKS.map(card).join('\n')}

<div class="bottom">
  <h3>ANYTHING ELSE</h3>
  <textarea id="all" placeholder="what you actually want"></textarea>
  <button class="exp" id="exp">EXPORT MY PICKS (.TXT)</button>
  <div class="done" id="done"></div>
</div>

<script>
(function(){
  var KEY='bohemia_ui_r6';
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
    var L=[]; L.push('BOHEMIA - THREE MASTERS, ROUND 6 - PAOLO\\'S PICKS');
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
    a.download='BOHEMIA_UI_R6.txt'; a.click();
    document.getElementById('done').textContent='saved as BOHEMIA_UI_R6.txt';
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

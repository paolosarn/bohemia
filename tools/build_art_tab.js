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
    id: 'grime',
    title: 'THE DIRT — PICK A NUMBER',
    ask: 'Three amounts of grime. Which one? NONE, SOME, or DIRTY.',
    dial: [
      { k: '0',    lbl: 'NONE',  img: 'ART_LIGHT_ON.png' },   /* grime 0 IS the shipped frame; a second identical 1.4MB file is dead weight */
      { k: '0.30', lbl: 'SOME',  img: 'ART_GRIME_030.png' },
      { k: '0.55', lbl: 'DIRTY', img: 'ART_GRIME_055.png' }
    ],
    why: 'One grime pass over everything is the Machine Party trick you liked: it ' +
         'blends separate objects into one world instead of a pile of different ' +
         'art. The machine is built and the game currently ships it at ZERO, ' +
         'because you have never seen a dirty frame and picking the amount is ' +
         'yours, not mine.',
    num: 'shipping at 0 until you pick'
  }
];

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* a card that is missing its picture is a card that lies. Fail loudly instead. */
const missing = [];
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
  <h1>ART &middot; 8/4 &middot; THE SUN CAME UP</h1>
  <button class="sunbtn" id="sunbtn">SUN MODE</button>
</header>
<p class="lede">Everything this lane made today, in one place. Three things to judge.
Tap a picture to flip it. Thumbs, then EXPORT at the bottom and send me the file.</p>

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
  var L = ['BOHEMIA ART VERDICT', 'build 8/4 - THE SUN CAME UP', ''];
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

/* ============================================================================
   UI VOCABULARY GATE (8/26/26) — THE BOHEMIA LOOK, HELD ON REAL PIXELS

   Paolo 8/25: "I REALLY CARE ABOUT THE UNIQUNESS OF MY GAME ... CRAFT THIS
   BOHEMIA LOOK BY MYSELF WITH YOU."

   The UI lane's first job is ONE PAGE OF VOCABULARY he can tear up: shape,
   weight, corner, colour, type, texture, and what a thing looks like PRESSED,
   with real options side by side and a pick that takes ONE LETTER.

   A PAGE OF DESIGN OPTIONS HAS ONE CLASSIC WAY OF LYING, and it is not a
   crash: THE OPTIONS ALL LOOK THE SAME. Three swatches, three labels, three
   identical rectangles, and a director who is being asked to choose between
   things that are not different. Every source check ever written passes on
   that page. So the centre of this gate is not "does it load" -- it is
   MEASURE EVERY OPTION'S RENDERED STYLE AND PROVE THE SIBLINGS DIFFER, on the
   real element, in a real browser, at iPhone size (7/18 VERIFY ON THE REAL
   SURFACE).

   The second thing it holds is the half of the PURPLE RESERVATION nobody was
   enforcing. bohemia_purity_gate.py sweeps 33 banks of world art and has never
   looked at the interface. Measured 8/26: the workshop's own tab underline and
   the edge of every selected button on every panel were #c81e8c -- the
   Amalgamation's magenta -- so the most-seen colour in the build was the one
   that is supposed to be rare. Both are gold now, and this gate holds the
   chrome at ZERO and RATCHETS the rest of the file so the number can only ever
   fall.

     node gates/ui_vocab_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT  = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const PAGE  = path.join(ROOT, 'slices/BOHEMIA_UI_CURRENT.html');
const TOOL  = path.join(ROOT, 'tools/bohemia_ui_vocabulary.js');
const GRIME = path.join(ROOT, 'banks/BOHEMIA_GRIME_8_3_26.txt');

/* THE RATCHET. Measured on the alpha the day the chrome was cleaned:
   30 purple hex occurrences remain, none of them in the shared chrome.
   WHAT THEY ARE, so nobody has to re-derive it:
     5  #c81e8c  1 is the Amalgamation fault seam (LEGAL, the law's own
                 blessing), 1 the RIG skeleton debug overlay, 3 in the MUSIC
                 studio and the palette dev tool  -> RIG / MUSIC / CHARACTER
     ~19 song ACCENT colours (acc:'#...') -> MUSIC lane DATA, several attached
                 to songs he has already judged. Not a stylesheet, not mine.
     3  MUSIC mixer chrome (#8f6fd0, #c2a6f5)     -> MUSIC lane
     2  CLOTHES sun-mode headings (#5a3fa0)       -> CLOTHES lane
   The number may fall forever. It may never rise. A lane that adds a purple
   anywhere in the alpha turns this red on its own push. */
const PURPLE_RATCHET = 30;
/* and on the RENDERED page: measured 10 stray pixels, all inside the real
   city screenshots the page embeds (rgb 131,104,132 -- a cool shadow in art
   the bank gate already blessed). A purple PANEL would be tens of thousands.
   The cap is a hair above the measurement, and the computed-style sweep below
   is the one that sits at ZERO. */
const PURPLE_PX_CAP = 60;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* ---- the purple arithmetic, the SAME three clauses the bank gate uses ----- */
function isPurpleHex(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (r > g + 25) && (b > g + 25) && (r > 80);
}

/* ==== 0. THE FILES EXIST ================================================== */
ok('the UI page exists at all', fs.existsSync(PAGE));
ok('the factory that makes it exists', fs.existsSync(TOOL));
if (!fs.existsSync(PAGE) || !fs.existsSync(ALPHA)) {
  console.log('FAIL: ui vocab gate ' + pass + '/' + (pass + fail)); process.exit(1);
}
const alpha = fs.readFileSync(ALPHA, 'utf8');
const page  = fs.readFileSync(PAGE, 'utf8');
const tool  = fs.existsSync(TOOL) ? fs.readFileSync(TOOL, 'utf8') : '';

/* ==== 1. NAME THE TAB (7/28): the door, the room, and not buried ========== */
ok('the alpha has a UI tab in its tab bar', /<div class="tab" data-p="ui">UI<\/div>/.test(alpha));
ok('the UI tab has a panel to open', /id="p-ui"/.test(alpha));
ok('the panel holds the UI page', /data-src="BOHEMIA_UI_CURRENT\.html"/.test(alpha));
{
  const i = alpha.indexOf('data-p="ui"');
  const all = (alpha.match(/class="tab"\s+data-p="/g) || []).length;
  const before = (alpha.slice(0, i).match(/class="tab"\s+data-p="/g) || []).length;
  ok('the UI tab is in the first third of the bar (' + (before + 1) + ' of ' + all + ')',
     i > 0 && before <= Math.max(1, Math.floor(all / 3)));
}

/* ==== 2. IT IS A FACTORY, NOT A HAND-CARVED PAGE (FACTORY LAW) ============ */
ok('the page says which tool generated it', /GENERATED by tools\/bohemia_ui_vocabulary\.js/.test(page));
ok('the factory documents a REUSE CHECK', /REUSE CHECK/.test(tool));
/* a claimed reuse must OPEN the bank in code, not just say so */
ok('and it really opens the grime bank in code',
   /readFileSync\(GRIME/.test(tool) && /BOHEMIA_GRIME_8_3_26/.test(tool));
{
  /* HIS OWN DIRT, HIS OWN NUMBER: the sheet in the page must be byte-identical
     to the one he approved, not a lookalike somebody re-cooked. */
  let bank = null;
  try { bank = JSON.parse(fs.readFileSync(GRIME, 'utf8')); } catch (_e) {}
  ok('the grime in the page is the approved sheet itself',
     !!bank && bank.b64 && page.indexOf(bank.b64) > 0);
  ok('at the amount he ruled (' + (bank ? bank.ships_at : '?') + ')',
     !!bank && page.indexOf('--grimeamt:' + bank.ships_at) > 0);
}

/* ==== 3. THE PURPLE RESERVATION, ON THE SHARED CHROME ===================== */
{
  const style = (alpha.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  const bad = [...new Set((style.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).filter(isPurpleHex))];
  ok('ZERO purple in the alpha\'s shared chrome stylesheet' + (bad.length ? ' (' + bad.join(', ') + ')' : ''),
     bad.length === 0);
  ok('the tab you are standing in is not underlined in the Amalgamation\'s colour',
     /\.tab\.on\{[^}]*border-bottom-color:#d8a742/.test(alpha));
  ok('a selected button is not edged in it either',
     /button\.opt\.on\{[^}]*border-color:#d8a742/.test(alpha));

  const all = (alpha.match(/#[0-9a-fA-F]{6}\b/g) || []).filter(isPurpleHex);
  ok('THE RATCHET: purple in the whole alpha is ' + all.length + ', allowance ' +
     PURPLE_RATCHET + ' (it may fall, never rise)', all.length <= PURPLE_RATCHET);

  const pbad = [...new Set((page.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) || []).filter(isPurpleHex))];
  ok('ZERO purple anywhere in the UI page source' + (pbad.length ? ' (' + pbad.join(', ') + ')' : ''),
     pbad.length === 0);
}

/* ==== 3b. *** THE ONE THAT BROKE IT ON HIS PHONE *** =======================
   Paolo 8/26: "It looks like the fucking UI page was broken."

   ROOT CAUSE: this page set type with the CSS `font:` SHORTHAND carrying a
   var() family -- `font:13px var(--fc)` -- forty-four times, including on
   html,body. Chromium parses that. His phone is an iPhone, which is WebKit,
   and WebKit is where the shorthand-plus-var has always been the fragile one;
   when the declaration is dropped, EVERY element that used it loses its size
   AND its family at once and the page falls back to the browser default. That
   is not a subtle regression, that is the page arriving broken.

   THE TELL WAS SITTING RIGHT THERE AND I DID NOT LOOK: measured across the
   shipped slices, the run uses `font-family:var(--x)` as a LONGHAND 27 times
   and the shorthand-with-var ZERO times. So does the alpha, the ART tab, the
   LOOK tab and the WORDS tab. FIVE SURFACES THAT WORK ON HIS PHONE ALL AVOID
   IT, ONE SURFACE USED IT, AND THAT WAS THE ONE THAT BROKE.

   AND EVERY GATE IN THIS REPO DRIVES CHROMIUM. There is no WebKit binary in
   this container, so no test here can ever reproduce his browser. That is
   exactly why this check is STATIC and why it sweeps EVERY slice rather than
   just this lane's: the machine cannot see his engine, so it holds the shape
   the engine is known to be fragile about, everywhere, forever. */
{
  const dir = path.join(ROOT, 'slices');
  const SHORTHAND = /font:\s*[^;{}"']*var\(--/g;
  const offenders = [];
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const hits = src.match(SHORTHAND);
    if (hits) offenders.push(f + ' x' + hits.length);
  }
  ok('NO SHIPPED SLICE SETS TYPE WITH THE `font:` SHORTHAND AND A var() FAMILY ' +
     '(it is the construct his phone drops)' +
     (offenders.length ? ' -- ' + offenders.slice(0, 4).join(', ') : ''),
     offenders.length === 0);

  /* THE SAME DIFFERENTIAL, GENERALISED. Five slices are proven on his phone
     because he plays them. Anything this page uses that NONE of them use is,
     by definition, untested on the only browser that matters -- so it carries
     its WebKit prefix or it does not ship. Measured 8/26, three constructs were
     unique to this page: clip-path (the CUT corner, one of the three things he
     is voting on), background-blend-mode, and prefers-reduced-motion. */
  for (const [why, re_] of [
    ['the cut corner is drawn with the WebKit prefix as well as the plain one',
     /-webkit-clip-path:\s*var\(--clip\)/],
    ['pixels stay pixels the way the alpha does it, with both spellings',
     /image-rendering:pixelated;\s*image-rendering:crisp-edges/],
  ]) ok(why, re_.test(page));
  {
    const plain = (page.match(/(?<!-)\bclip-path:/g) || []).length;
    const pref  = (page.match(/-webkit-clip-path:/g) || []).length;
    ok('every clip-path has a -webkit- twin (' + pref + ' of ' + plain + ')',
       plain > 0 && pref === plain);
  }

  /* and the page really does set its type the way the working surfaces do */
  const longhands = (page.match(/font-family:\s*var\(--/g) || []).length;
  ok('and the UI page sets font-family as a longhand, like every surface that ' +
     'works on his phone (' + longhands + ' of them)', longhands >= 20);
  /* the body rule is its own selector, not the html,body reset -- match what the
     page actually ships rather than what I assumed it shipped */
  /* collect EVERY rule whose selector list includes a bare `body`, rather than
     guessing which one it is. The first cut anchored on `}body{` and the real
     file has a newline there, so a correct page failed a wrong ruler. */
  let bodyRule = '';
  for (const m of page.matchAll(/([^{}<>]+)\{([^}]*)\}/g)) {
    if (m[1].split(',').map(x => x.trim()).includes('body')) bodyRule += m[2] + ';';
  }
  ok('the body itself has a real family and a real size, declared separately so ' +
     'one bad token cannot take both',
     /font-family:\s*var\(--fb\)/.test(bodyRule) && /font-size:\s*14px/.test(bodyRule));
}

/* ==== 3c. NO EM DASHES. HIS RULE, AND IT HAD NEVER BEEN GATED ============
   CLAUDE.md, under how he works: "Direct, casual, swears freely, zero fluff.
   Never use em dashes anywhere." It has been written down since the first day
   and NOTHING IN THE MACHINE HAS EVER CHECKED IT -- which is the 7/16 ruling
   exactly, a law enforced by memory is not enforced. Measured 8/27: this page
   was shipping NINETEEN of them at him, most of them out of the study corpus.
   A rule about the words on his screen belongs on the surface that carries the
   words, so it is checked here and in the corpus that feeds it. */
{
  const dashes = (page.match(/&mdash;|\u2014/g) || []).length;
  ok('ZERO em dashes on the page he reads (' + dashes + ')', dashes === 0);
  const bookDir = path.join(ROOT, 'uibook');
  let bookDashes = 0;
  if (fs.existsSync(bookDir)) {
    for (const f of fs.readdirSync(bookDir).filter(f => f.endsWith('.md'))) {
      bookDashes += ((fs.readFileSync(path.join(bookDir, f), 'utf8').match(/\u2014/g) || []).length);
    }
  }
  ok('and zero in the study corpus that feeds it (' + bookDashes + ')', bookDashes === 0);
}

/* ==== 4. THE .TXT RULE, standing on every judge surface in this repo ====== */
ok('the export writes .txt, never .json', /download\s*=\s*'BOHEMIA_UI_PICKS\.txt'/.test(page));
ok('there is ONE comment box at the bottom, always', /id="all"/.test(page));
ok('SUN MODE exists (he judges outdoors)', /id="sunbtn"/.test(page) && /body\.sun\{/.test(page));

/* ==== 5. READING LEVEL (Paolo 8/24: talk to him like a person) ============
   Flesch-Kincaid grade over the page's own visible prose. Eighth grade is the
   law, so the bar is 9.0 -- if a sentence on his screen needs college, it is
   not shipped, and this is the only way that stays true after an edit. */
function syllables(w) {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return (w.match(/[aeiouy]{1,2}/g) || ['x']).length;
}
function grade(text) {
  const sents = text.split(/[.!?]+\s/).filter(s => s.trim().split(/\s+/).length > 2);
  const words = text.split(/\s+/).filter(Boolean);
  if (!sents.length || !words.length) return 0;
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  return 0.39 * (words.length / sents.length) + 11.8 * (syl / words.length) - 15.59;
}
/* AN AVERAGE CANNOT SEE ONE BAD SENTENCE, and this gate proved it on itself:
   the first version was mutation-tested by dropping one full paragraph of
   college jargon into the page, and it stayed GREEN -- 1,400 plain words
   drowned it. A checker that cannot tell a good page from a good page with one
   unreadable sentence in it is the broken one (8/1). So the worst sentence is
   measured on its own, twice: how long it is, and how hard its WORDS are. The
   second one is what actually catches jargon, because syllables-per-word does
   not care how short you make the sentence. */
function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 8);
}
function worst(text) {
  let g = 0, sw = 0, gs = '', ss = '';
  for (const s of sentences(text)) {
    const w = s.split(/\s+/).filter(Boolean);
    const syl = w.reduce((n, x) => n + syllables(x), 0);
    const gr = 0.39 * w.length + 11.8 * (syl / w.length) - 15.59;
    const per = syl / w.length;
    if (gr > g) { g = gr; gs = s; }
    if (per > sw) { sw = per; ss = s; }
  }
  return { grade: g, gradeSent: gs, syl: sw, sylSent: ss, n: sentences(text).length };
}

/* ========================================================================== */
/* ==== 6. AND NOW THE REAL SURFACE ======================================== */
(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));

  /* ---- 6a. HIS THUMB'S ROUTE: the alpha, the splash, the tab ------------- */
  await p.goto('file://' + ALPHA);
  await SETTLE(p, 6000);
  await p.click('#front');
  await SETTLE(p, 1200);
  ok('the UI tab is on screen and tappable',
     await p.evaluate(() => { const t = document.querySelector('.tab[data-p="ui"]'); return !!t && !!t.offsetParent; }));
  await p.click('.tab[data-p="ui"]');
  await SETTLE(p, 2500);
  const wired = await p.evaluate(() => {
    const pan = document.getElementById('p-ui'), fr = document.getElementById('uiFrame');
    return { on: !!pan && pan.classList.contains('on'), src: fr && fr.getAttribute('src') };
  });
  ok('tapping UI opens the UI panel', wired.on);
  ok('and the panel actually LOADS the page (not a blank tab)', wired.src === 'BOHEMIA_UI_CURRENT.html');
  ok('the UI page is really in the document',
     !!p.frames().find(f => f.url().indexOf('UI_CURRENT') >= 0));

  /* ---- 6b. the page on its own, where it can be measured ---------------- */
  const q = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const qerr = [];
  q.on('pageerror', e => qerr.push(e.message));
  await q.goto('file://' + PAGE);
  await SETTLE(q, 1500);

  /* ---- 6c. THE FORKS ARE REAL FORKS ------------------------------------- */
  /* THE FINGERPRINT reads the elements the browser actually painted: the box,
     its fill, the second-accent tag, the body sentence and the feed art. If two
     options in one fork produce the same string, they are the same picture and
     he is being asked to choose between nothing. */
  const FP = `(function(root){
    function st(sel, keys){
      var e = root.querySelector(sel); if(!e) return 'x';
      var c = getComputedStyle(e), r = e.getBoundingClientRect();
      return keys.map(function(k){ return String(c[k]).slice(0,70); }).join(',') +
             ',' + Math.round(r.width) + 'x' + Math.round(r.height);
    }
    return [
      st('.bx', ['borderRadius','padding','backgroundColor','clipPath']),
      st('.bx > .in', ['fontFamily','backgroundImage','boxShadow','color','backgroundColor']),
      st('.sTag', ['color','borderTopColor']),
      st('.sBody', ['fontFamily','color']),
      st('.pvfeedart', ['display','backgroundImage','height'])
    ].join('|');
  })`;

  const forks = await q.evaluate((FPSRC) => {
    const fp = eval(FPSRC);
    const out = [];
    /* ONLY THE LOOK FORKS. The study view carries its own answered card (which
       round we studied) and it is not one of the seven things about the look, so
       counting it made a correct page look like it had five answers. */
    document.querySelectorAll('#viewPick .fork[data-k]').forEach(f => {
      const k = f.getAttribute('data-k');
      const opts = [...f.querySelectorAll('.opt')].map(o => {
        const samp = o.querySelector('.samp');
        return {
          v: o.getAttribute('data-v'),
          fp: samp ? fp(samp) : 'NONE',
          hasSample: !!(samp && samp.querySelector('.bx')),
          why: (o.querySelector('.why') || {}).textContent || ''
        };
      });
      out.push({ k, opts, picks: f.querySelectorAll('.thumb').length,
                 answered: f.getAttribute('data-answered'), killed: !!f.getAttribute('data-killed'),
                 samples: f.querySelectorAll('.samp').length });
    });
    return out;
  }, FP);

  /* PRESSED IS THE ONE FORK THAT DOES NOT EXIST AT REST, and it is the most-felt
     pixel in the game. Measuring it the way the others are measured would say
     "all three are the same", which is TRUE standing still and useless. So this
     one is measured the only honest way: press each sample with a real mouse and
     read the style while the thumb is down. */
  const pressFp = [];
  /* *** THIS BLOCK ASSUMED THREE PRESSES AND HE ANSWERED THE FORK (8/27 14:12).
     *** It walked A, B and C, and after his verdict only the one he chose is on
     the page -- so it read null twice and threw inside getComputedStyle.
     THE RULE IT WAS PROTECTING IS THE IMPORTANT ONE AND IT SURVIVES INTACT:
     A PRESS MUST CHANGE THE EDGE OF THE BOX, NOT ONLY ITS MIDDLE, BECAUSE A THUMB
     COVERS THE MIDDLE. That is his 8/27 complaint in one sentence, and it is a
     better test measured against the button's OWN RESTING STATE than against its
     siblings: it holds with one candidate or with three, and it cannot be passed
     by three options that merely differ from each other while all changing only
     the middle. */
  /* *** AND THE TARGET HAD TO CHANGE TOO, FOR A REASON WORTH WRITING DOWN. ***
     The obvious place to test a press is the PRESSED fork's own sample. It is the
     wrong place: those samples PLAY THEMSELVES on a loop now (his 8/27 note, "show
     me what it looks like in action"), and a CSS animation beats :active on the
     same property. Pressing a self-playing demo measures the animation, not the
     press. The demos are proved to be MOVING by webkit_gate, which is the claim
     that belongs to them.
     So the press rule is tested on the page's REAL buttons -- the ones he can
     actually push -- which is also where it matters. It holds no matter how many
     candidates the fork has left. */
  /* *** HIS VERDICT LANDED 8/27, so most of these are not questions any more.
     A fork he ruled on shows what he chose; a fork where he killed everything is
     gone; only what he has not answered still asks. Re-showing thumbs on a
     settled fork is asking him to decide it twice. *** */
  const asking = forks.filter(f => !f.answered && !f.killed);
  const done   = forks.filter(f => f.answered);
  const killed = forks.filter(f => f.killed);

  /* THE PICKS ARE NOT THE LANDING ANY MORE (8/27): the tab opens on photographs
     of the game wearing his look, because that is where the unanswered thumbs
     are. A hidden room has zero-width buttons and no running animations, so the
     gate has to walk into the room before it can measure anything in it. */
  await q.evaluate(() => { const b = document.querySelector('.vbtn[data-view=pick]'); if (b) b.click(); });
  await SETTLE(q, 800);

  const pressed = [];
  const realBtns = await q.evaluate(() => [...document.querySelectorAll('.bx.btn')]
    .filter(e => !e.closest('.demo') && e.getBoundingClientRect().width > 0)
    .slice(0, 3).map((e, i) => { e.setAttribute('data-gate-btn', String(i)); return i; }));
  for (const i of realBtns) {
    const sel = '[data-gate-btn="' + i + '"]';
    const rest = await q.evaluate((s) => {
      const e = document.querySelector(s); if (!e) return null;
      const inn = e.querySelector('.in'); if (!inn) return null;
      e.scrollIntoView({ block: 'center' });
      const r = e.getBoundingClientRect(), c = getComputedStyle(e), ci = getComputedStyle(inn);
      return { at: [r.x + r.width / 2, r.y + r.height / 2],
               edge: [c.backgroundColor, c.transform].join(','),
               mid:  [ci.backgroundColor, ci.color, ci.filter].join(',') };
    }, sel);
    if (!rest) continue;
    await q.mouse.move(rest.at[0], rest.at[1]);
    await q.mouse.down();
    await SETTLE(q, 180);
    const down = await q.evaluate((s) => {
      const e = document.querySelector(s); if (!e) return null;
      const inn = e.querySelector('.in'); if (!inn) return null;
      const c = getComputedStyle(e), ci = getComputedStyle(inn);
      return { edge: [c.backgroundColor, c.transform].join(','),
               mid:  [ci.backgroundColor, ci.color, ci.filter].join(',') };
    }, sel);
    await q.mouse.up();
    await SETTLE(q, 120);
    if (down) pressed.push({ i, rest, down });
  }
  ok('there are real buttons on the page to put a thumb on (' + pressed.length + ')',
     pressed.length >= 1);
  ok('*** A PRESS CHANGES THE EDGE OF THE BOX, NOT ONLY ITS MIDDLE, because a ' +
     'thumb covers the middle *** -- measured against each button\'s own resting ' +
     'state, so it holds whether the fork has one candidate left or three',
     pressed.length >= 1 && pressed.every(x => x.down.edge !== x.rest.edge));
  ok('and the middle moves as well, so the whole box answers and not just its rim',
     pressed.every(x => x.down.mid !== x.rest.mid));
  ok('the PRESSED sample he votes on plays ITSELF, so he never has to cover it ' +
     'with a thumb to see it', await q.evaluate(() => {
       const d = document.querySelector('.fork[data-k="press"] .demo .bx');
       return !!d && getComputedStyle(d).animationName !== 'none';
     }));
  /* *** THESE THREE LEGS COUNTED ROWS AND MEANT A RULE, AND THE COUNTS MOVED
     THE SAME DAY (8/27 14:12). *** They hard-coded "four answered, two killed,
     exactly one still asking". Then he answered PRESSED, and a correct page
     became five answered and none asking -- so the gate went red on the page
     doing exactly what the gate exists to enforce. A NUMBER IS NOT A RULE. The
     rule is that the page agrees with HIS VERDICT, whatever it currently says, so
     the counts are read out of the verdict the page was built from instead of
     being written down here a second time. Two copies of a fact is how one of
     them goes stale, which is the whole reason this page is generated from the
     verdict rather than storing it. */
  const VERDICT_YES = (tool.match(/^\s*[a-z]+:\s*\{\s*yes:\s*'[A-C]'/gm) || []).length;
  const VERDICT_DEAD = (tool.match(/^\s*[a-z]+:\s*\{\s*yes:\s*null,\s*no:\s*\[\s*'[A-C]'/gm) || []).length;
  ok('the verdict itself can be read, so the page and the gate cannot drift ' +
     '(' + VERDICT_YES + ' answered, ' + VERDICT_DEAD + ' killed)',
     VERDICT_YES > 0 && VERDICT_YES + VERDICT_DEAD <= forks.length);
  ok('every fork HE ANSWERED is shown as ANSWERED, not re-asked (' + done.length +
     ' of ' + VERDICT_YES + ')', done.length === VERDICT_YES);
  /* an ANSWERED fork has no options left -- that is the point -- so it is
     checked for SHOWING THE WINNER, not for still offering a choice. The first
     cut counted .opt and went red on a page doing exactly the right thing. */
  ok('and each of them SHOWS the option he chose, wearing it',
     done.every(f => f.answered && f.samples === 1 && f.picks === 0));
  ok('every fork where he killed every option is gone, not re-pitched (' +
     killed.length + ' of ' + VERDICT_DEAD + ')', killed.length === VERDICT_DEAD);
  ok('and a killed fork offers him nothing to vote on again',
     killed.every(f => f.picks === 0));
  ok('NOTHING IS ASKED TWICE: the only forks still asking are the ones his ' +
     'verdict leaves open (' + (asking.length ? asking.map(f => f.k).join(',')
      : 'none, he has answered or killed all seven') + ')',
     asking.length === forks.length - VERDICT_YES - VERDICT_DEAD);
  ok('EVERY OPTION HE VOTES ON HAS A THUMBS UP AND A THUMBS DOWN',
     asking.every(f => f.picks === f.opts.length * 2));
  ok('every option shows a REAL sample, not just a label',
     asking.every(f => f.opts.every(o => o.hasSample)));
  ok('every option carries its own reasoning',
     forks.every(f => f.opts.every(o => o.why.trim().length > 40)));

  /* *** SHOW IT, DO NOT TYPE IT (Paolo 8/27) ***
     "you would try to type out and explain what it's like to press buttons and
     not show me what it looks like in action". A press does not exist until a
     thumb is on the button and a thumb COVERS the button, so the one fork whose
     whole subject is what happens under a finger was the one he could not see.
     It has to MOVE, on its own, with a thumb-sized thing landing on it -- and
     the three have to move DIFFERENTLY or they are three labels again. */
  /* *** AND HIS ANSWER TOOK TWO OF THE THREE AWAY (8/27 14:12). *** This walked
     A, B and C by name and read null twice once PRESSED was answered, because an
     answered fork shows only what he chose.
     THE RULE SURVIVES WHOLE and is what actually gets checked: EVERY press sample
     on the page moves on its own, and a thumb-sized ghost comes down onto the
     MIDDLE of it. Written against whatever candidates are there, so it holds at
     one or at three, and it still fails the moment anything stops moving. */
  const moves = await q.evaluate(async () => {
    const demos = [...document.querySelectorAll('.fork[data-k="press"] .demo')];
    const seen = demos.map(() => new Set());
    const thumbs = demos.map(() => new Set());
    for (let i = 0; i < 22; i++) {
      demos.forEach((d, n) => {
        const box = d.querySelector('.bx'), inn = d.querySelector('.in');
        const c = box ? getComputedStyle(box) : null, ci = inn ? getComputedStyle(inn) : null;
        seen[n].add([c && c.backgroundColor, c && c.transform, ci && ci.backgroundColor].join('|'));
        const g = d.querySelector('.fingertip');
        if (g) thumbs[n].add(Number(getComputedStyle(g).opacity).toFixed(1));
      });
      await new Promise(r => setTimeout(r, 170));
    }
    return demos.map((d, n) => {
      const box = d.querySelector('.bx'), g = d.querySelector('.fingertip');
      const br = box ? box.getBoundingClientRect() : null;
      const gr = g ? g.getBoundingClientRect() : null;
      return {
        cls: d.className,
        states: seen[n].size,
        anim: box ? getComputedStyle(box).animationName : 'NONE',
        thumbStates: thumbs[n].size,
        thumbW: gr ? Math.round(gr.width) : 0,
        coversMiddle: !!(br && gr) &&
          Math.abs((gr.left + gr.width / 2) - (br.left + br.width / 2)) < 6
      };
    });
  });
  ok('there is a PRESSED sample on the page at all (' + moves.length + ')', moves.length >= 1);
  ok('*** THE PRESS PLAYS ITSELF *** -- every sample really changes on its own (' +
     moves.map(m => m.states + ' states').join(', ') + ')',
     moves.length >= 1 && moves.every(m => m.states >= 2 && m.anim !== 'none' && m.anim !== 'NONE'));
  ok('a ghost thumb comes down and lifts off each one (' +
     moves.map(m => m.thumbStates).join(', ') + ' opacities)',
     moves.every(m => m.thumbStates >= 3));
  ok('the ghost is thumb-sized (' + moves.map(m => m.thumbW + 'px').join(', ') +
     '; a fingertip is about 45)',
     moves.every(m => m.thumbW >= 40 && m.thumbW <= 60));
  ok('and it lands ON THE MIDDLE of the button, because covering the middle IS ' +
     'the argument', moves.every(m => m.coversMiddle));
  ok('no two presses share an animation, so they are answers and not labels (' +
     moves.map(m => m.anim).join(', ') + ')',
     new Set(moves.map(m => m.anim)).size === moves.length);
  ok('and a loop that will not stop has a still fallback for reduced motion',
     /prefers-reduced-motion:reduce\)\{[\s\S]{0,400}\.fingertip\{ animation:none/.test(page));

  /* *** THE CENTRE OF THIS GATE ***
     PRESSED is skipped here ON PURPOSE and only here: standing still, the three
     pressed options are supposed to be identical, because a button that has not
     been touched yet looks the same whichever rule you pick. It is measured
     under a real thumb instead, above, and that check is not optional -- if the
     press fork ever stops being measured there, the count below goes to 2 and
     this line goes red. */
  ok('the PRESSED fork is still covered by a real measurement, not skipped ' +
     '(' + moves.length + ' sample(s) watched moving, ' + pressed.length +
     ' real button(s) pressed)',
     moves.length >= 1 && pressed.length >= 1 && forks.some(f => f.k === 'press'));
  const same = [];
  for (const f of forks) {
    if (f.k === 'press') continue;
    const seen = new Map();
    for (const o of f.opts) {
      if (seen.has(o.fp)) same.push(f.k + ':' + seen.get(o.fp) + '=' + o.v);
      seen.set(o.fp, o.v);
    }
  }
  ok('NO TWO OPTIONS IN A FORK RENDER THE SAME' + (same.length ? ' (' + same.join(', ') + ')' : ''),
     same.length === 0);

  /* ---- 6d. THE PAGE OPENS WEARING WHAT HE ALREADY CHOSE ------------------
     His verdict is baked into the build, not stored as a preference, so a phone
     that has never opened this page still shows him HIS game. Making him re-tap
     four things he settled on 8/27 to see his own look is asking him to decide
     them twice. */
  const worn = await q.evaluate(() => {
    const r = document.documentElement;
    return { shape: r.getAttribute('data-shape'), weight: r.getAttribute('data-weight'),
             colour: r.getAttribute('data-colour'), type: r.getAttribute('data-type'),
             texture: r.getAttribute('data-texture'), feed: r.getAttribute('data-feed'),
             clip: getComputedStyle(document.querySelector('.prev .bx')).clipPath,
             pad: getComputedStyle(document.querySelector('.prev .bx')).padding };
  });
  ok('THE PAGE OPENS WEARING HIS VERDICT, cold, with nothing tapped (' +
     'corner ' + worn.shape + ', line ' + worn.weight + ', colour ' + worn.colour +
     ', letters ' + worn.type + ')',
     worn.shape === 'C' && worn.weight === 'B' && worn.colour === 'B' && worn.type === 'A');
  ok('his CUT corner is really cut in the preview, not just recorded',
     /polygon/.test(worn.clip));
  ok('and his HEAVY line is really 2px there (' + worn.pad + ')', worn.pad === '2px');
  ok('and the two he killed are wearing nothing at all',
     !worn.texture && !worn.feed);

  /* ---- and a thumb still behaves like a vote ------------------------------
     *** THIS CLICKED PRESSED/A BY NAME AND HE ANSWERED PRESSED (8/27 14:12), ***
     so the button it reached for no longer exists. The rule is not about that
     button: IT IS THAT A THUMB HE CAN STILL TAP REALLY REGISTERS, VISIBLY, AND
     NEVER BY COLOUR ALONE. So it finds whatever is genuinely unanswered on the
     page -- today that is the photographs of the game wearing his look -- and
     votes on that. If nothing anywhere is unanswered, it falls back to any thumb,
     because the mechanism still has to work. */
  const votable = await q.evaluate(() => {
    const groups = {};
    document.querySelectorAll('.thumb[data-k]').forEach(t => {
      const k = t.getAttribute('data-k');
      (groups[k] = groups[k] || []).push(t);
    });
    const open = Object.keys(groups).find(k => !groups[k].some(t => t.classList.contains('on')));
    const k = open || Object.keys(groups)[0];
    if (!k) return null;
    const up = groups[k].find(t => t.getAttribute('data-t') === 'UP') || groups[k][0];
    const other = groups[k].find(t => t !== up) || null;
    up.setAttribute('data-gate-vote', 'up');
    if (other) other.setAttribute('data-gate-vote', 'other');
    /* AND IT HAS TO SAY WHICH ROOM IT IS IN. The tab has three rooms now and only
       one is on screen at a time, so a thumb in a hidden room cannot be clicked
       -- which is the honest reason the first cut of this timed out rather than
       failing: it had found the right thumb in the wrong room. */
    const room = up.closest('.view');
    return { k, wasOpen: !!open, hasOther: !!other, room: room ? room.id : null };
  });
  ok('there is a thumb on this page he can still tap' +
     (votable ? ' (' + votable.k + (votable.wasOpen ? ', unanswered' : ', already answered') + ')' : ''),
     !!votable);
  if (votable && votable.room) {
    await q.evaluate((id) => {
      const v = document.getElementById(id);
      if (v && !v.classList.contains('on')) {
        const tabs = [...document.querySelectorAll('.vbtn')];
        const want = { viewWears: 'wears', viewPick: 'pick', viewStudy: 'study' }[id];
        const b = tabs.find(t => t.getAttribute('data-view') === want);
        if (b) b.click();
      }
    }, votable.room);
    await SETTLE(q, 700);
  }
  ok('and the room it lives in can actually be opened to reach it (' +
     (votable ? votable.room : 'n/a') + ')',
     await q.evaluate((id) => { const v = document.getElementById(id);
       return !!v && v.classList.contains('on'); }, votable ? votable.room : ''));
  await q.click('[data-gate-vote="up"]');
  await SETTLE(q, 400);
  const stuck = await q.evaluate(() => {
    const b = document.querySelector('[data-gate-vote="up"]');
    const u = document.querySelector('[data-gate-vote="other"]') || b;
    const cb = getComputedStyle(b), cu = getComputedStyle(u);
    const k = b.getAttribute('data-k');
    return { on: b.classList.contains('on'),
             root: b.getAttribute('data-v'),
             bw: cb.borderWidth, uw: cu.borderWidth,
             txt: b.textContent.trim(), utxt: u.textContent.trim(),
             label: (document.getElementById('picked-' + k) || {}).textContent || 'n/a' };
  });
  ok('the thumb sticks when tapped', stuck.on);
  /* *** THESE TWO ASKED ABOUT A FORK VOTE AND THE VOTE MOVED ROOMS. *** A fork
     vote re-skins the whole page and writes his choice back in words under the
     question. A vote on a PHOTOGRAPH of the game does neither, and should not:
     there is nothing to re-skin, the page is showing him the game already.
     So each shape is checked for what it actually owes him, and a fork vote is
     still held to the full old standard whenever one is what got tapped. */
  const isFork = forks.some(f => f.k === (votable && votable.k));
  if (isFork) {
    ok('a fork vote re-skins the WHOLE page, not just the row (' + stuck.root + ')',
       !!stuck.root);
    ok('and it says back in words what he just said (' + stuck.label.slice(0, 30) + ')',
       /YES to /.test(stuck.label));
  } else {
    ok('a vote on a picture of the game registers on the thumb itself, which is ' +
       'all it owes him (' + votable.k + ')', stuck.on === true);
    ok('and it says YES in words, not only in colour (' + stuck.txt + ')',
       /YES/i.test(stuck.txt));
  }
  /* NO ESSENTIAL INFORMATION BY COLOUR ALONE (basic tier; ~1 in 12 men). */
  ok('A VOTE IS NEVER COLOUR ALONE: it also gets a heavier edge (' +
     stuck.uw + ' -> ' + stuck.bw + ')', stuck.bw !== stuck.uw);
  ok('and it also gets a tick in its own label (' + stuck.utxt + ' -> ' + stuck.txt + ')',
     stuck.txt !== stuck.utxt && stuck.txt.length > stuck.utxt.length);

  /* SAYING NO IS A VOTE TOO, and it is the half that used to get thrown away:
     a dead option is a ruling, and GRAVEYARD IS FINAL.
     *** THIS ALSO NAMED PRESSED/B, AND HE ANSWERED PRESSED. *** It taps whatever
     NO is next to the YES it just used, which is the same test on whatever the
     page is actually offering. */
  if (votable && votable.hasOther) {
    await q.click('[data-gate-vote="other"]');
    await SETTLE(q, 300);
  }
  ok('saying NO is a vote too, and there is one to say it with', !votable || votable.hasOther);

  /* ---- 6e. HIS WORK SURVIVES A RELOAD ------------------------------------
     *** AND THE RELOAD CHECK ASKED FOR data-press='A' -- which is now true
     because HE RULED IT, not because the gate had just clicked it. That made the
     leg pass for the wrong reason, which is worse than failing. It checks his
     WHOLE verdict survives instead: every fork he answered is still worn after a
     reload, on a page that has to rebuild itself from what it saved. */
  await q.reload();
  await SETTLE(q, 1200);
  const survived = await q.evaluate(() => {
    const r = document.documentElement;
    const out = {};
    ['shape', 'weight', 'colour', 'type', 'press'].forEach(k => { out[k] = r.getAttribute('data-' + k); });
    return out;
  });
  ok('HIS WHOLE VERDICT SURVIVES A RELOAD, not just the last thing tapped ' +
     '(corner ' + survived.shape + ', line ' + survived.weight + ', colour ' +
     survived.colour + ', letters ' + survived.type + ', pressed ' + survived.press + ')',
     survived.shape === 'C' && survived.weight === 'B' && survived.colour === 'B' &&
     survived.type === 'A' && survived.press === 'A');

  /* ---- 6f. THE THUMB (SHARED -5): iPhone portrait, one hand -------------- */
  const small = await q.evaluate(() => {
    const bad = [];
    document.querySelectorAll('button,textarea').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) return;
      if (r.height < 44) bad.push((e.className || e.tagName) + ' ' + Math.round(r.height));
    });
    return bad;
  });
  ok('every control is at least 44px tall' + (small.length ? ' (' + small.slice(0, 4).join(', ') + ')' : ''),
     small.length === 0);
  const wide = await q.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  ok('nothing runs off the side of the phone', wide);

  /* ---- 6g. IT HAS TO BE READABLE IN THE SUN ----------------------------- */
  function lum(c) {
    const m = c.match(/\d+/g).map(Number);
    const [r, g, bl] = m.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  }
  const dark = await q.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await q.click('#sunbtn');
  await SETTLE(q, 400);
  const light = await q.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok('SUN MODE really turns the page light (' + lum(dark).toFixed(3) + ' -> ' + lum(light).toFixed(3) + ')',
     lum(light) > lum(dark) + 0.35);
  const sunText = await q.evaluate(() => {
    const e = document.querySelector('.ask');
    const c = getComputedStyle(e);
    return [c.color, getComputedStyle(document.body).backgroundColor];
  });
  {
    const l1 = lum(sunText[0]), l2 = lum(sunText[1]);
    const ct = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    ok('and the words still read in sun mode (' + ct.toFixed(2) + ':1, needs 4.5)', ct >= 4.5);
  }
  /* SUN MODE HAS ONE FAILURE NOBODY EVER MEASURES: the page turns to paper and
     the ACCENT-COLOURED text comes with it. Measured on the first cut of this
     page, gold on cream was 1.49 to 1 -- the headline, the pick label and every
     "MY PICK" chip were effectively blank while the body copy read fine, so
     eyeballing one paragraph would have passed it. Every word the PAGE speaks
     is swept. The samples are excluded on purpose: they are showing the game,
     the game is dark, and lightening them would show him a thing that does not
     exist -- the same rule the ART judge page follows with its screenshots. */
  const sunDim = await q.evaluate(() => {
    function L(c) {
      const m = (c || '').match(/[\d.]+/g); if (!m) return null;
      if (m.length > 3 && Number(m[3]) < 0.5) return null;      /* transparent */
      const [r, g, b] = m.slice(0, 3).map(v => { v = Number(v) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function bgOf(e) {
      for (let n = e; n && n !== document; n = n.parentElement) {
        const l = L(getComputedStyle(n).backgroundColor);
        if (l !== null) return l;
      }
      return L(getComputedStyle(document.body).backgroundColor);
    }
    const bad = [];
    document.querySelectorAll('h1,h2,p,span,button,div,b').forEach(e => {
      if (e.closest('.samp') || e.closest('.prev')) return;      /* the game, not the page */
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (txt.length < 3) return;
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const fg = L(getComputedStyle(e).color), bg = bgOf(e);
      if (fg === null || bg === null) return;
      const ct = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      if (ct < 4.5) bad.push(txt.slice(0, 24) + ' @' + ct.toFixed(2));
    });
    return bad;
  });
  ok('EVERY word the page itself says survives the sun' +
     (sunDim.length ? ' (' + sunDim.length + ' too faint: ' + sunDim.slice(0, 3).join(' | ') + ')' : ''),
     sunDim.length === 0);
  await q.click('#sunbtn');
  await SETTLE(q, 300);

  /* ---- 6h. THE REFUSAL HAS A PICTURE, NOT JUST A SOUND ------------------- */
  const deny = await q.evaluate(async () => {
    const btn = document.getElementById('denybtn'), word = document.getElementById('denyword');
    const wordBefore = word.textContent;
    const shBefore = getComputedStyle(btn.querySelector('.in')).boxShadow;
    btn.click();
    await new Promise(r => setTimeout(r, 60));
    return { wordBefore, wordAfter: word.textContent,
             shBefore, shAfter: getComputedStyle(btn.querySelector('.in')).boxShadow,
             moved: btn.classList.contains('deny') };
  });
  ok('a refused button SAYS SO IN WORDS ("' + deny.wordAfter.slice(0, 32) + '")',
     deny.wordBefore.trim() === '' && deny.wordAfter.trim().length > 4);
  ok('and it changes shape as well, so it is not colour alone', deny.shBefore !== deny.shAfter);
  ok('and it moves, so it is not a still picture either', deny.moved);
  ok('with a still fallback when the phone asks for less motion',
     /prefers-reduced-motion:reduce/.test(page) && /\.deny\{ animation:none/.test(page.replace(/\s+/g, ' ')));

  /* ---- 6i. EIGHTH GRADE, ON HIS SCREEN ---------------------------------- */
  const prose = await q.evaluate(() => {
    let t = '';
    document.querySelectorAll('.lede,.ask,.note,.why,.recwhy').forEach(e => { t += e.textContent + ' '; });
    return t.replace(/\s+/g, ' ').trim();
  });
  const g = grade(prose);
  ok('the words on his screen read at eighth grade (' + g.toFixed(1) + ', cap 9.0, ' +
     prose.split(/\s+/).length + ' words)', g <= 9.0);
  const W = worst(prose);
  ok('and NO SINGLE SENTENCE is a long one (worst ' + W.grade.toFixed(1) + ', cap 16, of ' +
     W.n + ': "' + W.gradeSent.slice(0, 46) + '")', W.grade <= 16);
  ok('and NO SINGLE SENTENCE uses college words (worst ' + W.syl.toFixed(2) +
     ' syllables a word, cap 2.30: "' + W.sylSent.slice(0, 46) + '")', W.syl <= 2.30);

  /* ---- 6j. THE EXPORT CARRIES A REAL PICK ------------------------------- */
  const txt = await q.evaluate(() => {
    const KEYS = window.__BOH_UI_VOCAB.keys, st = window.__BOH_UI_VOCAB.state();
    return { keys: KEYS.length, picked: Object.values(st.up || {}).filter(Boolean).length };
  });
  ok('the page can hand back what he chose (' + txt.picked + ' of ' + txt.keys + ')',
     txt.keys === 7 && txt.picked >= 5);

  /* ---- 6k. THE PURPLE TEST, ON THE PIXELS HE SEES ----------------------- */
  const shot = path.join(os.tmpdir(), 'boh_ui_purple_' + process.pid + '.png');
  await q.evaluate(() => window.scrollTo(0, 0));
  await SETTLE(q, 300);
  await q.screenshot({ path: shot, fullPage: true });
  let pj = { purple_px: -1 };
  try {
    pj = JSON.parse(execFileSync('python3', [path.join(__dirname, 'ui_pixel_purple.py'), shot,
                                             '--max', String(PURPLE_PX_CAP)], { encoding: 'utf8' }).trim());
  } catch (e) {
    try { pj = JSON.parse(String(e.stdout || '{}').trim()); } catch (_e) { pj = { purple_px: -1 }; }
  }
  ok('the RENDERED page is purple-free (' + pj.purple_px + ' px of ' + (pj.total_px || '?') +
     ', cap ' + PURPLE_PX_CAP + ')', pj.purple_px >= 0 && pj.purple_px <= PURPLE_PX_CAP);

  /* and ZERO in anything the interface itself paints -- the pixel cap exists
     only because the page embeds real photographs of the city. */
  const uiPurple = await q.evaluate(() => {
    function pur(c) {
      const m = (c || '').match(/\d+/g); if (!m) return false;
      const [r, g, b] = m.slice(0, 3).map(Number);
      if (m.length > 3 && Number(m[3]) === 0) return false;
      return (r > g + 25) && (b > g + 25) && (r > 80);
    }
    const bad = [];
    document.querySelectorAll('*').forEach(e => {
      const c = getComputedStyle(e);
      for (const k of ['color', 'backgroundColor', 'borderTopColor', 'borderBottomColor',
                       'borderLeftColor', 'borderRightColor', 'outlineColor']) {
        if (pur(c[k])) bad.push(e.tagName + '.' + (e.className || '') + ' ' + k + '=' + c[k]);
      }
    });
    return bad;
  });
  ok('and ZERO purple in anything the interface paints' +
     (uiPurple.length ? ' (' + uiPurple.slice(0, 3).join(' | ') + ')' : ''), uiPurple.length === 0);

  /* THE PICTURES IT PROMISES ARE REALLY THERE. The live preview and the feed's
     PLACE STRIP both show real screenshots of the city out of records/target,
     which _config.yml publishes by name -- so this is also the check that the
     page does not go blank IN PRODUCTION while working perfectly on disk (8/6). */
  {
    const refs = [...new Set([...page.matchAll(/\.\.\/records\/target\/([A-Za-z0-9_.-]+\.png)/g)].map(m => m[1]))];
    const gone = refs.filter(f => !fs.existsSync(path.join(ROOT, 'records/target', f)));
    ok('every city picture the page points at is on disk (' + refs.length + ')' +
       (gone.length ? ' MISSING: ' + gone.join(', ') : ''), refs.length >= 2 && gone.length === 0);
    const broken = await q.evaluate(() => {
      const bad = [];
      document.querySelectorAll('img').forEach(i => { if (i.complete && i.naturalWidth === 0) bad.push(i.getAttribute('src')); });
      return bad;
    });
    ok('and none of them is a broken box in the browser' + (broken.length ? ' (' + broken.join(', ') + ')' : ''),
       broken.length === 0);
  }

  ok('the page threw nothing' + (qerr.length ? ' (' + qerr.slice(0, 2).join(' | ') + ')' : ''), qerr.length === 0);
  ok('the alpha threw nothing opening it' + (errs.length ? ' (' + errs.slice(0, 2).join(' | ') + ')' : ''),
     errs.length === 0);

  try { fs.unlinkSync(shot); } catch (_e) {}
  await b.close();
  console.log((fail ? 'FAIL' : 'PASS') + ': ui vocab gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();

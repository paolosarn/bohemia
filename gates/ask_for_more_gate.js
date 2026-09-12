/* ============================================================================
   ASK FOR MORE GATE (9/11/26, QUESTS lane) -- VAMILY [haggling works],
   BB-ASK-FOR-MORE.

   THE ROW, RE-MEASURED BEFORE A LINE WAS WRITTEN: zero hits for counter-offer,
   retainer or advance pay anywhere in the walked city. The three "haggle" hits
   in the alpha are an ANIMATION CLIP NAME, a gesture, nothing to do with money.
   A job here had a length (BB-INSIDE-A-DAY, 9/7) and no price and no terms.

   *** AND THE FIRST HALF OF THE ROW IS THE DISCLOSURE, NOT THE HAGGLE. *** The
   wake card said the title, said nobody had picked it up, and said how long the
   walk was. IT NEVER SAID WHAT THE JOB PAID. You cannot ask for more of a thing
   you were never told about, so the gate demands the pay line before it demands
   the asking.

   WHAT IT HOLDS:

   1. NO BALANCE NUMBER, ANYWHERE. The game he named uses a random 3-6 annoyance
      and a threshold of 9. Those are that game's numbers and copying them in
      would be inventing an economy nobody ruled, dressed as research. The room
      is the size of the menu and the counter is how many times he opened his
      mouth, which is a fact about the conversation and not a dial. This gate
      fails on any stray number in the module's code.

   2. EVERYTHING COSTS ONE SURVIVES IT. A haggle can never produce two. Every
      settlement this module can reach is exactly one unit of exactly one of his
      three currencies -- checked by walking every reachable sequence of asks,
      not by reading the code and believing it.

   3. IT CAN SUCCEED (the row's own first clause). An ask lands, the terms move,
      and what the purse is owed moves with them.

   4. IT CAN BE PUSHED TOO FAR (the second clause), AND HE IS TOLD FIRST. The
      third ask withdraws the offer. The warning is returned BEFORE the ask that
      costs him, because this is deliberate and not a hidden roll -- the house
      already refuses rolls, a claim is checked by going and looking.

   5. AND IT LEAVES A STANDING MARK (the third clause) THROUGH THE LEDGER THAT
      ALREADY EXISTS. Not an invented clout debit: a deed row in the shape
      bohemia_deeds.publish already takes, so the existing witness range, the
      existing grading and the existing feed carry it with nothing new built.

   6. A WITHDRAWN OFFER IS REALLY GONE. Not a sentence on a card: accepting it
      has to fail.

   7. ON THE REAL SURFACE, ON THE RIGHT SIDE OF THE DECISION. The pay line and
      the asks must exist while the offer is still untaken, and the words must be
      on the glass -- not a variable that exists.

   8. AND THE ASK MUST SURVIVE THE REDRAW. This is the check that caught my own
      first cut: showWake() re-rings the offer every time it draws the card, and
      an ask redraws the card, so opening fresh terms in offerRing wiped the ask
      the moment he made it. He would have pressed a button that did nothing.
   ========================================================================== */
'use strict';
const path = require('path');
const fs   = require('fs');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};

global.window = global;
const H  = require(path.join(ROOT, 'engine/bohemia_haggle.js'));
const BQ = require(path.join(ROOT, 'engine/bohemia_bq.js'));
const src  = fs.readFileSync(path.join(ROOT, 'engine/bohemia_haggle.js'), 'utf8');
const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
                .replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""');
/* THE PROSE, UNWRAPPED. A claim about what a file SAYS must not break because
   somebody rewrapped a comment at eighty columns, which is exactly what happened
   to the first version of check 1c: the sentence it looked for was split across
   two lines by the comment prefix and the gate called an honest file dishonest. */
const prose = src.replace(/^\s*\/\/ ?/gm, '').replace(/\s+/g, ' ');

/* ---- 1. NO BALANCE NUMBER ------------------------------------------------ */
/* EVERY NUMBER ALLOWED IN THE CODE IS NAMED HERE WITH WHAT IT IS FOR. A bare
   allowlist would let a threshold in by looking like arithmetic, which is the
   thing this check exists to stop. */
const ALLOWED = {
  '0': 'zero, and the empty delta on a deed row',
  '1': 'ONE, the only amount, locked 7/26',
  '2': 'the size of the menu: a different one, and up front'
};
const stray = (code.match(/\b\d+(\.\d+)?\b/g) || []).filter(n => !ALLOWED[n]);
ok('1a not one stray number in the code (' + stray.length + ' stray: '
   + [...new Set(stray)].slice(0, 6).join(',') + ')', stray.length === 0);
ok('1b the reference game\'s 3-6 annoyance and its threshold of 9 are NOT in here',
   !/\b(3|4|5|6|9)\b/.test(code));
ok('1c and the file says out loud why they are not',
   /it needs no balance number under EVERYTHING COSTS ONE/i.test(prose)
   && /are that game's numbers/i.test(prose));
ok('1d nothing random: a hidden roll would mean he can never know where he stands',
   !/Math\.random/.test(code));
ok('1e the room is the size of the menu, derived, not typed',
   typeof H.room() === 'number' && H.room() === 2);

/* ---- 2. EVERYTHING COSTS ONE, PROVED BY WALKING EVERY SEQUENCE ----------- */
function everySequence(quest) {
  const out = [];
  (function walk(t, depth) {
    out.push(t);
    if (depth > 5 || !t.open) return;
    const list = H.asks(t);
    for (const a of list) walk(H.ask(t, a.id), depth + 1);
    /* AND THE ASK THAT IS NOT ON THE MENU, which a player can reach by pressing a
       stale button on a card that has since redrawn. */
    walk(H.ask(t, 'nonsense:not-a-real-ask'), depth + 1);
  })(H.open(quest), 0);
  return out;
}
const qFiles = fs.readdirSync(path.join(ROOT, 'quests/bq')).filter(f => /\.bq$/.test(f)).sort();
let states = 0, bad = [], reachedWithdrawn = 0, reachedChanged = 0;
for (const f of qFiles) {
  const Q = BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq', f), 'utf8'));
  for (const t of everySequence(Q)) {
    states++;
    if (t.withdrawn) reachedWithdrawn++;
    if (H.changed(t, Q)) reachedChanged++;
    const s = H.settle(t);
    if (s === null) continue;
    const keys = Object.keys(s);
    if (keys.length !== 1) { bad.push(f + ': ' + JSON.stringify(s) + ' is not one currency'); continue; }
    if (H.CURRENCIES.indexOf(keys[0]) < 0) bad.push(f + ': ' + keys[0] + ' is not one of his three');
    if (s[keys[0]] !== 1) bad.push(f + ': ' + JSON.stringify(s) + ' is not ONE');
  }
}
ok('2a every settlement reachable by any sequence of asks is ONE of his three ('
   + states + ' states across ' + qFiles.length + ' quests, ' + bad.length + ' bad)',
   bad.length === 0, bad.slice(0, 3).join(' | '));
ok('2b and the walk really reached the ends it is checking (' + reachedWithdrawn
   + ' withdrawn, ' + reachedChanged + ' moved)', reachedWithdrawn > 0 && reachedChanged > 0);

/* ---- 3. IT CAN SUCCEED --------------------------------------------------- */
const paying = qFiles
  .map(f => ({ f, Q: BQ.parse(fs.readFileSync(path.join(ROOT, 'quests/bq', f), 'utf8')) }))
  .filter(x => H.pays(x.Q).kind === 'one');
ok('3a there are jobs with a single settled price to argue about (' + paying.length + ')',
   paying.length > 0);
const P = paying[0];
const t0 = H.open(P.Q);
ok('3b and the offer says what that is, in words ("' + H.sayPay(H.pays(P.Q)) + '")',
   /^Pays one /.test(H.sayPay(H.pays(P.Q))));
const menu = H.asks(t0);
ok('3c the menu is the two other currencies and taking it up front (' + menu.length + ')',
   menu.length === 3 && menu.filter(a => a.kind === 'swap').length === 2
   && menu.filter(a => a.kind === 'upfront').length === 1);
const swap = menu.find(a => a.kind === 'swap');
const t1 = H.ask(t0, swap.id);
ok('3d an ask lands and the terms actually move',
   t1.currency === swap.currency && t1.currency !== t0.currency && t1.asked === 1);
ok('3e and what the purse is owed moves with them',
   JSON.stringify(H.settle(t1)) === JSON.stringify({ [swap.currency]: 1 }));
const t1b = H.ask(t1, 'upfront');
ok('3f taking it up front is a trade, and the file says what the trade is',
   t1b.upfront === true && /holding it if you walk/i.test(t1b.said || ''));
ok('3g asking changes nothing when nobody asked',
   H.changed(t0, P.Q) === false && H.changed(t1, P.Q) === true);
ok('3h an ask that is not on the menu costs him nothing',
   H.ask(t0, 'nonsense').asked === t0.asked);

/* ---- 4. IT CAN BE PUSHED TOO FAR, AND HE IS TOLD FIRST ------------------- */
ok('4a no warning while there is room', H.warning(t0) === null && H.warning(t1) === null);
ok('4b *** the warning arrives BEFORE the ask that costs him ***',
   typeof H.warning(t1b) === 'string' && /take the job back/i.test(H.warning(t1b)));
const t2 = H.ask(t1b, H.asks(t1b)[0] ? H.asks(t1b)[0].id : 'upfront');
ok('4c the third ask withdraws the offer', t2.withdrawn === true && t2.open === false);
ok('4d and a withdrawn offer is owed nothing at all', H.settle(t2) === null);
/* SAFE ONCE, RISKY TWICE, IMPOSSIBLE THREE TIMES -- the row's own shape. */
ok('4e safe once', H.ask(t0, menu[0].id).withdrawn === false);
ok('4f risky twice: it lands, and it is the last one that will',
   H.ask(t1, 'upfront').withdrawn === false && H.warning(H.ask(t1, 'upfront')) !== null);

/* ---- 5. THE MARK GOES THROUGH THE LEDGER THAT ALREADY EXISTS ------------- */
const D = require(path.join(ROOT, 'engine/bohemia_deeds.js'));
const mark = t2.mark;
ok('5a pushing too far leaves a mark', !!mark);
ok('5b the mark is a deed row in the shape the ledger already takes',
   !!mark && typeof mark.kind === 'string' && typeof mark.clout === 'string'
   && 'delta' in mark && 'faction' in mark);
ok('5c its clout tag is one the deed system already grades ("' + (mark || {}).clout + '")',
   !!mark && typeof D.reachOf(mark.clout) === 'number' && D.reachOf(mark.clout) > 0);
ok('5d and no clout was invented and debited instead',
   !/credit|transferOut|debit|balance/.test(code));
ok('5e the module owns no standing of its own',
   !/Bohemia[A-Za-z]+\s*\.[A-Za-z]+\s*=[^=]/.test(code));

/* ---- 6 and 7 and 8. THE REAL SURFACE ------------------------------------- */
const city = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
ok('6a the module ships in the city, verbatim',
   city.indexOf('BOHEMIA HAGGLE -- ASKING FOR MORE') >= 0);
ok('6b accepting a withdrawn offer is refused in code, not just on a card',
   /OFFER\.terms&&OFFER\.terms\.withdrawn\) return false/.test(city));
ok('8a the terms survive the redraw (keyed on the day and the job)',
   /HAGGLE_KEY === _hk && HAGGLE_TERMS/.test(city));
ok('8b and the file records why that was needed',
   /re-rings the offer every time it draws/.test(city));

const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    let cityF = null;
    for (const f of page.frames()) {
      try { if (await f.evaluate(() => typeof ctTerms === 'function')) { cityF = f; break; } }
      catch (_e) {}
    }
    ok('R1 the terms seam reached the frame the player looks at', !!cityF);

    if (cityF) {
      const got = await cityF.evaluate(() => ({
        t: ctTerms(), rang: window.__OFFER_RANG || 0,
        text: (document.body.innerText || '')
      }));
      console.log('  [on the offer] ' + JSON.stringify(got.t && {
        pays: got.t.pays && got.t.pays.kind, say: got.t.paysSay,
        asks: (got.t.asks || []).map(a => a.id), taken: got.t.taken }));
      ok('R2 a job was actually offered (' + got.rang + ' rang)', got.rang > 0);
      ok('R3 *** and it says what it pays *** ("' + ((got.t || {}).paysSay || '') + '")',
         !!got.t && typeof got.t.paysSay === 'string' && got.t.paysSay.length > 5);
      /* THE SIDE OF THE DECISION. Terms he learns after he agreed are not terms. */
      ok('R4 *** the terms are on the offer BEFORE he takes it ***',
         !!got.t && got.t.taken === false);
      ok('R5 and there is room to argue (' + ((got.t || {}).asks || []).length + ' asks)',
         !!got.t && (got.t.asks || []).length > 0);
      /* AND THE WORDS ARE ON THE GLASS, not a variable that exists. */
      ok('R6 the pay line is really in the text of the card he is looking at',
         !!got.t && got.t.paysSay && got.text.indexOf(got.t.paysSay) >= 0);
      const firstAsk = ((got.t || {}).asks || [])[0];
      ok('R7 and so is the ask he would press',
         !!firstAsk && got.text.indexOf(firstAsk.say) >= 0);

      if (firstAsk) {
        const after = await cityF.evaluate(id => {
          const r = ctAskForMore(id);
          return { t: r, asked: window.__HAGGLE_ASKED || 0,
                   text: (document.body.innerText || '') };
        }, firstAsk.id);
        ok('R8 *** pressing it on the real surface moves the terms *** ("'
           + ((after.t || {}).say || '') + '")',
           !!after.t && after.t.terms && after.t.terms.asked === 1 && after.asked === 1);
        /* *** THE CHECK THAT CAUGHT MY FIRST CUT: the redraw must not wipe it. *** */
        const redrawn = await cityF.evaluate(() => {
          try { showWake(); } catch (_e) {}
          return { t: ctTerms(), text: (document.body.innerText || '') };
        });
        ok('R9 *** and the ask SURVIVES the card redrawing itself ***',
           !!redrawn.t && redrawn.t.terms && redrawn.t.terms.asked === 1);
        ok('R10 the new terms are on the glass ("' + ((redrawn.t || {}).say || '') + '")',
           !!redrawn.t && redrawn.t.say && redrawn.text.indexOf(redrawn.t.say) >= 0);

        /* PUSH IT PAST THE WARNING, ON THE REAL SURFACE. */
        const pushed = await cityF.evaluate(() => {
          let t = ctTerms(), guard = 0;
          while (t && t.terms && !t.terms.withdrawn && guard++ < 6) {
            const a = (t.asks || [])[0];
            t = ctAskForMore(a ? a.id : 'upfront');
          }
          return { t: t, lost: window.__HAGGLE_LOST || 0,
                   accepted: (typeof ctOfferAccept === 'function') ? ctOfferAccept() : null };
        });
        ok('R11 *** pushing past the warning takes the job away ***',
           !!pushed.t && pushed.t.terms && pushed.t.terms.withdrawn === true && pushed.lost > 0);
        ok('R12 *** and a job they took back cannot be accepted ***',
           pushed.accepted === false);
      }
    }
    ok('R13 nothing threw while the terms were argued over (' + errs.length + ')',
       errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('ASK FOR MORE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

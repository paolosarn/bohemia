/* ============================================================================
   SOMEONE LENDS GATE (9/13/26, WORLD lane) -- board row [someone lends] /
   WE-BUILT-THE-COURTHOUSE-AND-NEVER-ISSUED-A-LOAN.

   THE ROW, harvested from ECONOMY round 9: "Everything courtless credit needs is
   LIVE: news walks a real acquaintance graph three hops, memory decays, belonging
   and deeds are recorded, the purse refuses debt. Nothing in the game ever lends
   anybody anything, so the enforcement machine has never had a debt to enforce.
   Let a person or a faction lend you batteries, on a handshake, remembered by the
   machine that already exists; the debt names its lender (with [debt carried]) and
   the street finds out if you do not pay."

   MEASURED AND THE ROW WAS EXACTLY RIGHT: zero hits for lend/loan/borrow anywhere
   in engine/ that are not prose. The only two that read like credit are BARKS --
   "Everything's a loan. The only question is who's holding it." PEOPLE IN THIS
   GAME TALK ABOUT LENDING AND NOBODY LENDS.

   A LOAN IS NOT A NEGATIVE BALANCE, which is why the purse never had to bend: the
   batteries really arrive through its own writer, and the obligation is recorded
   beside them naming who it is to. WHO LENDS is read off bohemia_favour's own
   `owes` flag -- a lender is somebody who gives before you have earned it, and the
   game already says who that is -- so not one threshold is typed. IT COMES BACK
   ONE A NIGHT, the shape the night already has for rent, and IT CAN CLOSE, because
   an interval that cannot close is a sentence and not a relationship (8/18 rule 2).

   node gates/someone_lends_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const L = require(path.join(ROOT, 'engine/bohemia_lend.js'));
const O = require(path.join(ROOT, 'engine/bohemia_owing.js'));
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('SOMEONE LENDS GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (somebody really lends you batteries on a handshake, it names them,'
            + ' it comes back one a night, and the street hears a night you miss)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. *** SOMEBODY LENDS, WHICH NOTHING IN THIS GAME DID *** ---------- */
{
  const book = {};
  const r = L.take(book, 'CARTEL', 3);
  ok('a handshake opens an account (' + JSON.stringify(r.owed) + ')',
     r.took === true && r.owed === 1);
  ok('*** IT HANDS OVER BATTERIES, WHICH IS THE MONEY ***',
     r.got === L.HANDSHAKE && r.currency === 'electricity');
  ok('and it is his ONE, not a dial', L.HANDSHAKE === 1 && L.DUE_A_NIGHT === 1);
  ok('the account names who lent it', r.who === 'CARTEL');
  L.take(book, 'CARTEL', 4);
  ok('going back twice grows the same account, not a second one',
     Object.keys(book).length === 1 && book.CARTEL.batteries === 2);
  ok('asking nobody is refused rather than guessed at', L.take(book, '', 1).took === false);
}

/* ---- 2. A LOAN IS NOT A NEGATIVE BALANCE ------------------------------- */
{
  /* THE PURSE NEVER HAD TO BEND. Its own header: "Balances never go negative, so
     no hidden debt system exists by accident -- debt would be canon, and canon is
     Paolo's." A real loan is two facts, not one negative number. */
  const purse = P.create();
  const book = {};
  const r = L.take(book, 'CHURCH', 1);
  P.credit(purse, r.currency, r.got, 'lent by ' + r.who, r.who, 1);
  const bal = P.balances(purse);
  ok('*** THE BATTERIES REALLY ARRIVE *** (electricity ' + bal.electricity + ')',
     bal.electricity === 1);
  ok('and the purse is still never negative',
     Object.keys(bal).every(k => bal[k] >= 0));
  ok('the obligation is recorded beside them, not inside the purse',
     book.CHURCH.batteries === 1 && !('debt' in bal));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_lend.js'), 'utf8');
  ok('and this module never moves money itself',
     !/BohemiaPurse|require\(.*purse/.test(src.replace(/^[\s\S]*?\(function \(root\)/, '')));
}

/* ---- 3. *** WHO LENDS IS THE GAME'S OWN ANSWER, NOT A NUMBER I PICKED *** */
{
  ok('an outfit whose first move is to GIVE will lend',
     L.offers({ can: true, owes: true }) === true);
  ok('an outfit that wants you to ask first will not',
     L.offers({ can: true, owes: false }) === false);
  ok('an outfit offering nothing will not', L.offers({ can: false, owes: true }) === false);
  ok('and no answer at all is not a lender', L.offers(null) === false);
  /* A CHECK THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1). The
     first cut of this read the whole module body and went red on its own header,
     which EXPLAINS why no threshold is typed by naming the ones it refused to
     type. Comments and strings are stripped, so this is about the code. */
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_lend.js'), 'utf8');
  const code = src.replace(/^[\s\S]*?\(function \(root\)/, '')
                  .replace(/\/\*[\s\S]*?\*\//g, '')
                  .replace(/^\s*\/\/.*$/gm, '')
                  .replace(/'(?:[^'\\]|\\.)*'/g, "''");
  ok('*** no rung, no standing floor and no faction list is typed here ***',
     !/RUNGS|rungOf|standingOf|CARTEL|CHURCH|NETWORK/i.test(code));
  ok('and it never reaches into the favour module to work it out for itself',
     !/BohemiaFavour|bohemia_favour/.test(code));
}

/* ---- 4. ONE A NIGHT, AND IT CAN CLOSE ---------------------------------- */
{
  const book = {};
  L.take(book, 'MOB', 1); L.take(book, 'MOB', 1); L.take(book, 'MOB', 1);
  const d = L.due(book);
  ok('the night asks for one, not the lot (' + JSON.stringify(d) + ')',
     d.length === 1 && d[0].due === 1 && d[0].owed === 3);
  ok('and it says who it is for', d[0].who === 'MOB');
  L.paid(book, 'MOB', 1); L.paid(book, 'MOB', 1);
  ok('paying knocks it down', book.MOB.batteries === 1);
  L.paid(book, 'MOB', 1);
  ok('*** AND AT ZERO THE ACCOUNT IS GONE, NOT KEPT AT ZERO *** (8/18 rule 2:'
     + ' an interval must be able to close)',
     !('MOB' in book) && L.due(book).length === 0);
  ok('a night on an account that does not exist changes nothing',
     L.paid(book, 'NOBODY', 1) === 0 && L.short(book, 'NOBODY', 1) === null);
}

/* ---- 5. A COUNT, NEVER A PRICE ----------------------------------------- */
{
  const ph = L.placeholders();
  ok('every unruled number is enumerable (' + ph.length + ')', ph.length >= 3);
  ok('*** interest ships EMPTY, because a rate is exactly what makes an interval'
     + ' uncloseable ***',
     ph.some(p => /INTEREST/.test(p.where) && p.value === null));
  ok('so does the ceiling and so does their patience',
     ph.some(p => /CEILING/.test(p.where) && p.value === null)
     && ph.some(p => /PATIENCE/.test(p.where) && p.value === null));
  ok('every placeholder cites the law it is waiting on',
     ph.every(p => typeof p.law === 'string' && p.law.length > 4));
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_lend.js'), 'utf8');
  const body = src.replace(/^[\s\S]*?\(function \(root\)/, '');
  const code = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'[^']*'/g, "''");
  const nums = (code.match(/\b\d+\b/g) || []).map(Number).filter(n => n > 1);
  ok('no number over one survives in the code (' + nums.join(',') + ')', nums.length === 0);
  const w = L.words();
  ok('the words are an attempt and none of them names a price',
     Object.keys(w).length > 3 && Object.keys(w).every(k => !/\d/.test(w[k])));
}

/* ---- 6. IT LANDS IN THE ONE BOOK THAT NAMES EVERY LENDER --------------- */
{
  const book = {};
  L.take(book, 'CARTEL', 2); L.take(book, 'CARTEL', 2);
  const rows = O.book({ loans: L.owingRows(book),
                        favours: { CHURCH: 1 },
                        rent: { MOB: { nights: 5, lastDay: 9 } } });
  ok('*** a loan joins the favours and the rent in one book *** ('
     + rows.length + ' accounts)', rows.length === 3);
  const loan = rows.filter(r => r.kind === 'loan')[0];
  ok('and it is a kind of its own, named', !!loan && loan.who === 'CARTEL' && loan.n === 2);
  const said = O.lines(rows).filter(s => /lent you/.test(s))[0];
  ok('it says who lent it and what happens next: "' + said + '"',
     /^CARTEL lent you 2 batteries on a handshake/.test(said));
  ok('one battery reads as a battery, not as "1 batteries"',
     /lent you a battery on a handshake/.test(
       O.lines(O.book({ loans: L.owingRows({ X: { batteries: 1, since: 1 } }) }))[0] || ''));
  const at = O.atFold(rows);
  ok('*** and a loan is a BILL: it dies at the fold with the rest ***',
     at.clears.some(r => r.kind === 'loan'));
  ok('while the lender is still standing there', at.keeps.indexOf('CARTEL') >= 0);
}

/* ---- 7. THE DEED IS AN ACT, NOT A FACTION ------------------------------ */
{
  const book = {};
  L.take(book, 'CARTEL', 1);
  const s = L.short(book, 'CARTEL', 4);
  ok('a night you go short is counted and dated', s.nights === 1 && s.owed === 1);
  ok('*** and it names ONE deed kind for the act, never one per outfit ***',
     s.deed === L.SHORT_DEED && !/CARTEL/.test(L.SHORT_DEED));
  ok('going short does not wipe what you owe', book.CARTEL.batteries === 1);
  const city = fs.readFileSync(CITY, 'utf8');
  ok('the surface publishes that deed through the machine that already exists',
     /ctDeed\(BohemiaLend\.SHORT_DEED/.test(city));
  ok('the kind carries how far the news travels, marked draft',
     /'loan:short':\s*'notable'\s*\/\* draft/.test(city));
  ok('and it has a sentence in both voices, watched and only heard',
     /'loan:short':\s*\{\s*saw:/.test(city) && /heard you did not pay somebody back/.test(city));
}

/* ---- 8. on the surface he walks, and in the demo ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(ctx) {
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaLend };
      const sv = ctBelongSave(), p = purseGet();
      R.lenders = []; R.notLenders = 0;
      BohemiaBelonging.keys().forEach(fid => {
        try {
          const a = BohemiaFavour.askFor(BohemiaBelonging.ruleOf(fid), 0, sv);
          if (BohemiaLend.offers(a)) R.lenders.push(fid); else R.notLenders++;
        } catch (e) {}
      });
      /* *** THE HANDSHAKE, BY PRESSING THE BUTTON A PLAYER PRESSES. ***
         The first cut of this ran BohemiaLend.take and BohemiaPurse.credit here,
         side by side, which is the handler's own two lines copied into the test.
         Deleting the credit from the real handler left this GREEN: A GATE THAT
         RE-IMPLEMENTS THE THING IT IS TESTING CANNOT SEE IT BREAK. So it stands
         next to somebody from a lending outfit, opens their card the way walking
         up to them does, and clicks. */
      function standBeside(who) {
        const at = ctAt(who);
        const around = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
        for (let i = 0; i < around.length; i++) {
          hx = at[0] + around[i][0]; hy = at[1] + around[i][1];
          if (typeof ctAdjacent === 'function' && ctAdjacent() === who) return true;
        }
        return false;
      }
      R.pressed = false; R.subject = null;
      const bases = ctBases() || {};
      outer:
      for (const k in bases) {
        const b = bases[k];
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        const all = ctEveryone();
        for (let i = 0; i < all.length && i < 60; i++) {
          const f = ctFactionOf(all[i]);
          if (!f || R.lenders.indexOf(String(f).toUpperCase()) < 0) continue;
          if (!standBeside(all[i])) continue;
          /* ctSawCell() + ctOpen() is what walking up to somebody does; ctDraw()
             only repaints the world and never builds the card, which is why the
             first cut of this found no button and blamed the button. */
          try { ctSawCell(); ctClose(); ctOpen(); } catch (e) {}
          const btn = document.getElementById('ctlend');
          if (!btn) { R.sawCards = (R.sawCards | 0) + 1; continue; }
          R.subject = String(f).toUpperCase();
          const e00 = BohemiaPurse.balances(p).electricity;
          btn.click();
          await new Promise(s => setTimeout(s, 80));
          R.pressedGained = BohemiaPurse.balances(p).electricity - e00;
          R.pressed = true;
          break outer;
        }
      }
      /* and the book after the real press */
      R.afterPress = JSON.parse(JSON.stringify(LOAN_BOOK));

      const e0 = BohemiaPurse.balances(p).electricity;
      const r = BohemiaLend.take(LOAN_BOOK, R.lenders[0], DAY.day);
      BohemiaPurse.credit(p, r.currency, r.got, 'lent by ' + r.who, r.who, DAY.day);
      loanPersist();
      R.handed = BohemiaPurse.balances(p).electricity - e0;
      R.owed = r.owed;
      R.saved = (localStorage.getItem('boh.city.loans') || '');
      R.negative = Object.keys(BohemiaPurse.balances(p))
        .some(k => BohemiaPurse.balances(p)[k] < 0);

      /* it shows up on the card he already reads */
      R.onCard = false; R.cardText = '';
      for (let n = 0; n < 3 && !R.onCard; n++) {
        advance(20 * 60);
        for (let k = 0; k < 8; k++) {
          const t = (document.getElementById('daycardIn') || {}).textContent || '';
          if (/lent you/.test(t)) { R.onCard = true; R.cardText = t; break; }
          const go = document.querySelector('#daycardIn .dcgo')
                  || document.querySelector('#daycardIn .dcx');
          if (!go) break; go.click();
          await new Promise(s => setTimeout(s, 60));
          if (!document.getElementById('daycard').classList.contains('on')) break;
        }
      }
      R.namedOnCard = R.cardText.indexOf(r.who) >= 0;

      /* a night with batteries pays it back */
      BohemiaLend.take(LOAN_BOOK, R.lenders[0], DAY.day);
      BohemiaPurse.credit(p, 'electricity', 3, 'gate:float', null, DAY.day);
      const b0 = BohemiaPurse.balances(p).electricity;
      loanNight();
      R.paidNight = JSON.parse(JSON.stringify(LOAN_TONIGHT));
      R.tookBack = b0 - BohemiaPurse.balances(p).electricity;

      /* and a night with nothing does not */
      BohemiaLend.take(LOAN_BOOK, R.lenders[0], DAY.day);
      const bal = BohemiaPurse.balances(p).electricity;
      if (bal > 0) BohemiaPurse.debit(p, 'electricity', bal, 'gate:empty', null, DAY.day);
      loanNight();
      R.missedNight = JSON.parse(JSON.stringify(LOAN_TONIGHT));
      R.stillNotNegative = BohemiaPurse.balances(p).electricity >= 0;

      /* and it can be squared */
      BohemiaPurse.credit(p, 'electricity', 9, 'gate:float', null, DAY.day);
      for (let n = 0; n < 8; n++) loanNight();
      R.square = Object.keys(LOAN_BOOK).length === 0;

      /* the weights: measured, not assumed */
      const W = BohemiaStanding.DEED_WEIGHT || {};
      R.weightRows = Object.keys(W).length;
      R.cityKindsWeighted = ['claim:met', 'claim:refused', 'commit', 'favour', 'loan:short']
        .filter(k => Object.prototype.hasOwnProperty.call(W, k));
      return R;
    });
  }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);
  const r = await drive(pg);
  await b.close();

  ok('the lend module reaches the surface he walks', r.module === 'object');
  ok('*** SOMEBODY REALLY LENDS: ' + r.lenders.join(', ') + ', and '
     + r.notLenders + ' outfits will not ***',
     r.lenders.length > 1 && r.notLenders > r.lenders.length);
  ok('*** THE BUTTON A PLAYER PRESSES IS REALLY THERE, on a lending outfit\'s own'
     + ' ground *** (' + r.subject + ')', r.pressed === true);
  ok('*** AND PRESSING IT PUTS A BATTERY IN HIS HAND *** (+' + r.pressedGained
     + ', book ' + JSON.stringify(r.afterPress) + ')',
     r.pressedGained === 1 && Object.keys(r.afterPress || {}).length === 1);
  ok('and the account the press opened names the outfit he pressed it on',
     !!r.subject && Object.keys(r.afterPress || {})[0] === r.subject.replace(/_/g, ' '));
  /* AND GOING BACK A SECOND TIME GROWS THE SAME ACCOUNT. Written before the real
     press existed, this used to assert owed === 1 and went red the moment the
     button opened the account first -- which is the press working, not a fault. */
  ok('going back to them hands over one more and grows the same account (+'
     + r.handed + ', owed ' + r.owed + ')',
     r.handed === 1 && r.owed === 2);
  ok('with no balance anywhere gone negative', r.negative === false);
  ok('the book rides its own key, so a valley reset cannot pay off his debts',
     /batteries/.test(r.saved));
  ok('*** HE READS IT ON THE CARD HE ALREADY READS ***', r.onCard === true);
  ok('*** WITH THE LENDER NAMED ON IT ***', r.namedOnCard === true);
  ok('*** THE NIGHT TAKES ONE BACK *** (' + JSON.stringify(r.paidNight) + ')',
     r.tookBack === 1 && r.paidNight.length === 1 && r.paidNight[0].paid === 1);
  ok('*** AND A NIGHT WITH AN EMPTY PURSE IS A NIGHT YOU WENT SHORT ***',
     r.missedNight.length === 1 && r.missedNight[0].missed === true
     && r.missedNight[0].nights >= 1);
  ok('going short never drives the purse negative', r.stillNotNegative === true);
  ok('*** AND IT CAN BE PAID OFF, SO IT IS A BARGAIN AND NOT A TRAP ***',
     r.square === true);
  ok('MEASURED, NOT ASSUMED: the weight table has ' + r.weightRows + ' rows and '
     + r.cityKindsWeighted.length + ' of the five city deed kinds are in it -- one '
     + 'gap for all of them, routed, never patched with a number invented here',
     r.weightRows > 50 && r.cityKindsWeighted.length === 0);
  ok('no page error across the handshake and four nights'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  /* the demo */
  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  if (!fs.existsSync(demo)) { ok('the demo has been cut', false); return done(); }
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
                  '.png': 'image/png', '.css': 'text/css',
                  '.webmanifest': 'application/manifest+json' };
  const srv = require('http').createServer((rq, rs) => {
    const p = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
    fs.readFile(p, (e, d) => {
      if (e) { rs.statusCode = 404; return rs.end('no'); }
      rs.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream');
      rs.end(d);
    });
  });
  await new Promise(res => srv.listen(0, res));
  const port = srv.address().port;
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  const errs2 = []; p2.on('pageerror', e => errs2.push(e.message));
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
                { waitUntil: 'load', timeout: 180000 });
  await SETTLE(p2, 1500);
  await p2.click('#front', { force: true }).catch(() => {});
  await SETTLE(p2, 2500);
  let fr = null;
  for (let i = 0; i < 200; i++) {
    fr = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr && await fr.$('#daycardIn .dcgo').catch(() => null)) break;
    await SETTLE(p2, 250);
  }
  let d = { module: 'none' };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await drive(fr);
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.module === 'object');
  ok('*** AND THE WHOLE THING RUNS IN THE DEMO TOO: somebody lends, the card names'
     + ' them, the night takes one back, a broke night goes short, and it squares ***',
     d.handed === 1 && d.onCard === true && d.namedOnCard === true
     && d.tookBack === 1 && (d.missedNight || []).length === 1
     && d.missedNight[0].missed === true && d.square === true);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();

/* ============================================================================
   DEBT CARRIED GATE (9/12/26, WORLD lane) -- board row [debt carried] /
   THE-DEBT-NAMES-ITS-LENDER-AND-OUTLIVES-YOU.

   THE ROW, from the 9/5 heir research: "where there is no state, the lender
   collects from the family. Every debt in the ledger names WHO is owed (a
   faction, a person) and survives the generation fold to the heir."

   *** TWO THINGS WERE WRONG AND BOTH WERE MEASURED FIRST. ***

   ONE -- "DEBT" WAS THREE UNRELATED SYSTEMS SHARING A WORD, and nothing asked
   all of them: the favours you took for free (save.meta.owed, with real teeth --
   bohemia_claim lets an outfit you owe bypass the weekly ration and charges you
   an extra rung per unpaid favour when you refuse), the nights you could not pay
   for somebody's ground (OWED_BOOK), and people you did not show up for, which is
   a charge and not an account at all. You could see the first only by standing in
   front of that one outfit and the second only after you died.

   TWO -- THE FOLD RULED THE BILL DIES AND NOTHING EVER EXECUTED IT. Measured on
   the walked surface: twelve favour debts across four outfits went into a fold and
   TWELVE CAME OUT, while engine/bohemia_fold.js has said `debt: dies, ruled:true`
   since 9/7. So the heir inherited the parent's bill and went on paying for it on
   every refusal. A ruling with no machine behind it is an intention.

   WHAT OUTLIVES YOU IS THE LENDER, NOT THE BILL -- the fold's own words, and the
   same reading FACTIONS shipped for rent on 9/12. Which of the two live rulings
   stands is canon-level and is already [PENDING Paolo] on their row; this does not
   ask it twice. It READS the ruling instead, so flipping that one table row flips
   the game with nothing here to edit.

   node gates/debt_carried_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const O = require(path.join(ROOT, 'engine/bohemia_owing.js'));
const F = require(path.join(ROOT, 'engine/bohemia_fold.js'));
const FAV = require(path.join(ROOT, 'engine/bohemia_favour.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('DEBT CARRIED GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (every debt names who is owed, in one book, and at the fold the'
            + ' bill dies and the people do not)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. ONE BOOK, AND EVERY ROW NAMES ITS LENDER ----------------------- */
{
  const rows = O.book({ favours: { CARTEL: 3, CHURCH: 1 },
                        rent: { MOB: { nights: 5, lastDay: 9 } } });
  ok('the book joins both accounts into one list (' + rows.length + ' rows)',
     rows.length === 3);
  ok('*** EVERY ROW NAMES WHO IS OWED ***',
     rows.every(r => typeof r.who === 'string' && r.who.length > 0));
  ok('every row says what it is owed FOR',
     rows.every(r => O.KINDS.some(k => k.kind === r.kind)));
  ok('worst first (' + rows.map(r => r.who + ':' + r.n).join(' ') + ')',
     rows[0].who === 'MOB' && rows[0].n === 5);
  const said = O.lines(rows);
  ok('every row turns into a sentence that names the outfit',
     said.length === 3 && said.every((s, i) => s.indexOf(rows[i].who) === 0));
  ok('the favour sentence and the rent sentence say different things',
     said.some(s => /for nothing/.test(s)) && said.some(s => /their ground/.test(s)));
}

/* ---- 2. A COUNT, NEVER AN AMOUNT --------------------------------------- */
{
  /* WEIGHTS ARE HIS. A sentence may carry the number of TIMES something happened
     and nothing else: no total, no price, no multiplier. The only digits allowed
     in a line are the ones that came straight off a count. */
  const rows = O.book({ favours: { CARTEL: 7 }, rent: { MOB: { nights: 4, lastDay: 3 } } });
  const said = O.lines(rows);
  said.forEach(s => {
    const nums = (s.match(/\d+/g) || []).map(Number);
    ok('no number in "' + s.slice(0, 34) + '..." that is not a count',
       nums.every(n => n === 7 || n === 4));
  });
  ok('nothing in the book is a price, a total or a balance',
     rows.every(r => Object.keys(r).join(',') === 'who,kind,n,lastDay'));
}

/* ---- 3. IT OWNS NOTHING AND REACHES INTO NOTHING ----------------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_owing.js'), 'utf8');
  const body = src.replace(/^[\s\S]*?\(function \(root\)/, '');
  ok('*** it never reads the favour store itself *** (THE DEBT GETS CALLED IN'
     + ' rule 4: two ledgers, two owners, numbers between them)',
     !/save\s*\.\s*meta/.test(body));
  ok('it never calls the favour account\'s writer',
     !/BohemiaFavour|\.settle\s*\(/.test(body));
  ok('it never writes localStorage', !/localStorage/.test(body));
  /* AND IT IS TEXT. The first cut of the merge keyed on a NUL separator and the
     byte went in literally, so the module -- and then the whole walked surface --
     stopped being a text file: grep called it binary and every gate that reads the
     city with a regex was one step from lying about it. A control character in a
     file this gets spliced into is a plumbing fault, not a style note. */
  /* AND THE CHECK ITSELF CARRIES NO CONTROL CHARACTER, which the first cut of it
     did: written as a regex full of backslash-u escapes, every escape landed as a
     LITERAL BYTE and this gate file went binary -- the exact fault it exists to
     catch, in the file doing the catching. Built from char codes now: no escapes,
     nothing for a writer to mangle, and it can say WHERE. */
  const ctrlAt = (s) => {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 9 || c === 11 || c === 12 || (c > 13 && c < 32)) return i;
    }
    return -1;
  };
  ok('*** no control character reaches the surface through this module ***',
     ctrlAt(src) < 0);
  ok('and this gate does not carry one either',
     ctrlAt(fs.readFileSync(__filename, 'utf8')) < 0);
  const cityCtrl = ctrlAt(fs.readFileSync(CITY, 'utf8'));
  ok('and none reaches the walked surface at all'
     + (cityCtrl < 0 ? '' : ' -- one at character ' + cityCtrl), cityCtrl < 0);
  const before = { favours: { CARTEL: 2 }, rent: { MOB: { nights: 1, lastDay: 4 } } };
  const copy = JSON.parse(JSON.stringify(before));
  O.book(before); O.atFold(O.book(before));
  ok('asking the book changes neither store', JSON.stringify(before) === JSON.stringify(copy));
}

/* ---- 4. ONE OUTFIT AND ONE KIND IS ONE ACCOUNT ------------------------- */
{
  /* CAUGHT BY MEASURING, NOT BY READING. The two books spell a faction
     differently (SOCIAL_FORCES against whatever turfAt calls them), so one outfit
     used to leave here as two rows saying the same sentence twice. */
  const rows = O.book({ favours: {}, rent: { MOB: { nights: 2, lastDay: 1 },
                                             Mob: { nights: 1, lastDay: 9 } } });
  ok('*** two spellings of one outfit are one account, not two rows ***',
     rows.length === 1 && rows[0].n === 3);
  ok('and the account keeps the LATER night, not whichever came first',
     rows[0].lastDay === 9);
  const both = O.book({ favours: { MOB: 1 }, rent: { MOB: { nights: 1, lastDay: 2 } } });
  ok('but two DIFFERENT things owed to one outfit stay two rows', both.length === 2);
  ok('and they are still one person at the door', O.creditors(both).length === 1);
}

/* ---- 5. A ZERO IS NOT AN ACCOUNT --------------------------------------- */
{
  const rows = O.book({ favours: { CARTEL: 0 }, rent: { MOB: { nights: 0, lastDay: 9 } } });
  ok('an account settled to zero is not a debt', rows.length === 0);
  ok('and the card says nothing at all rather than an empty heading',
     O.lines(rows).length === 0);
  ok('a missing half is a real state, not an error',
     O.book({}).length === 0 && O.book({ favours: { A: 1 } }).length === 1);
}

/* ---- 6. *** THE RULING IS READ, NEVER COPIED *** ----------------------- */
{
  const row = F.CARRY.filter(c => c.field === O.FOLD_FIELD)[0];
  ok('the fold really carries a row about this account', !!row);
  ok('and it is the shipped ruling that says the bill dies',
     !!row && row.carries === 'dies' && row.ruled === true);

  /* *** THE ONE CHECK THAT MATTERS HERE, AND THE FIRST CUT OF IT WAS A TAUTOLOGY.
     It compared billDies() to the same table it reads, which is true whether the
     module asks or hard-codes the answer -- a hard-coded `return true` passed it.
     A CHECK THAT CANNOT TELL A COPY FROM A READ IS THE BROKEN ONE. So this FLIPS
     the ruling under the module and watches it follow. That is also the whole
     point of the design: whichever way Paolo settles the contradiction FACTIONS
     flagged, one row moves and the game moves with it. */
  const was = row.carries;
  row.carries = 'whole';
  const followed = (O.billDies() === false);
  const clearsNothing = O.atFold(O.book({ favours: { CARTEL: 2 } }));
  row.carries = was;
  ok('*** flip the fold to carry and the module stops saying the bill dies ***',
     followed === true);
  ok('*** and then it clears nothing, while the people are still kept ***',
     clearsNothing.dies === false && clearsNothing.clears.length === 0
     && clearsNothing.keeps.length === 1);
  ok('flipping it back restores the shipped answer', O.billDies() === true);

  ok('it repeats the fold\'s reason rather than writing a second one',
     O.whyDies().length > 40
     && F.CARRY.some(c => c.field === O.FOLD_FIELD && c.why === O.whyDies()));

  const rows = O.book({ favours: { CARTEL: 2 }, rent: { MOB: { nights: 1, lastDay: 3 } } });
  const at = O.atFold(rows);
  ok('*** the bill is cleared *** (' + at.clears.length + ' accounts)',
     at.dies === true && at.clears.length === rows.length);
  ok('*** and the people are kept *** (' + at.keeps.join(', ') + ')',
     at.keeps.length === 2 && at.keeps.indexOf('MOB') >= 0);
  ok('what is kept is a NAME, never an amount',
     at.keeps.every(k => typeof k === 'string' && !/\d/.test(k)));
  ok('the words are attempts', at.draft === true);
}

/* ---- 7. THE FAVOUR ACCOUNT REALLY CLEARS THROUGH ITS OWN WRITER -------- */
{
  const save = { meta: { owed: { CARTEL: 3, 'SOCIAL_FORCES': 2 } } };
  const rows = O.book({ favours: save.meta.owed, rent: {} });
  const at = O.atFold(rows);
  at.clears.forEach(r => { if (r.kind === 'favour') FAV.settle(save, r.who, r.n); });
  ok('*** settling through bohemia_favour clears the whole bill *** ('
     + JSON.stringify(save.meta.owed) + ')',
     Object.keys(save.meta.owed).length === 0);
  ok('and the normalised name still finds a key stored with an underscore',
     FAV.owedOf(save, 'SOCIAL_FORCES') === 0);
}

/* ---- 8. *** ONE LINE PER LENDER, NOT ONE PER ACCOUNT *** ([owe lines], 9/14)
   FACTIONS measured the card he meets at the end of EVERY day on a phone: 916 px in
   a 780 window, and this block was 270 px of it. Measured again with more accounts
   open: 405 px and ELEVEN items, THE BIGGEST BLOCK ON THE CARD. Nothing was
   duplicated -- no two lines were ever byte-identical -- but one outfit can hold
   three accounts, so eleven sentences of the same shape read as the same line over
   and over, and the card ran off the bottom of the phone. -------------------- */
{
  const many = O.book({ favours: { CARTEL: 3, CHURCH: 3, NETWORK: 3 },
                        rent: { MOB: { nights: 2, lastDay: 5 }, CHURCH: { nights: 2, lastDay: 6 } },
                        loans: { CARTEL: { nights: 1, lastDay: 1 }, CHURCH: { nights: 1, lastDay: 1 } } });
  const perAccount = O.lines(many), perLender = O.lenderLines(many);
  ok('the accounts are still all there (' + many.length + ')', many.length === 7);
  ok('*** AND THE CARD SAYS ONE LINE PER LENDER, NOT ONE PER ACCOUNT *** ('
     + perAccount.length + ' accounts -> ' + perLender.length + ' lines)',
     perLender.length < perAccount.length && perLender.length === 4);
  ok('one outfit owed three ways is ONE line ("' + perLender[0] + '")',
     perLender.filter(l => /^CHURCH/.test(l)).length === 1);
  ok('and that line still says all three things',
     /lent/.test(perLender.find(l => /^CHURCH/.test(l)))
     && /taken free/.test(perLender.find(l => /^CHURCH/.test(l)))
     && /nights unpaid/.test(perLender.find(l => /^CHURCH/.test(l))));
  ok('*** EVERY LINE STILL NAMES ITS LENDER ***, which is the whole of this row',
     perLender.every(l => /^[A-Z][A-Z ]+:/.test(l) || /^and \d+ more/.test(l)));
  ok('biggest first (' + perLender.map(l => l.split(':')[0]).join(', ') + ')',
     O.lenders(many)[0].total >= O.lenders(many)[O.lenders(many).length - 1].total);
  /* COUNTS ONLY. The same refusal the per-account line makes: what a favour or a
     night is WORTH is a weight and weights are his. */
  const counted = [3, 2, 1];
  perLender.forEach(l => {
    const nums = (l.match(/\d+/g) || []).map(Number);
    ok('no number in "' + l.slice(0, 34) + '..." that is not a count',
       nums.every(n => counted.indexOf(n) >= 0));
  });
  ok('the line is shorter than the sentence it replaced ('
     + Math.max(...perLender.map(l => l.length)) + ' vs '
     + Math.max(...perAccount.map(l => l.length)) + ' chars)',
     Math.max(...perLender.map(l => l.length)) < Math.max(...perAccount.map(l => l.length)));
}

/* ---- 9. IT IS BOUNDED, AND THE REST IS COUNTED OUT LOUD ----------------- */
{
  const all = {}, rent = {}, loans = {};
  ['REMNANTS','CARTEL','CHURCH','MOB','CARAVANS','TRADES','VOLUNTEERS','BLUES','REDS',
   'ANARCHISTS','NETWORK','HOMELESS','COLORFUL','KARENS','SOCIAL_FORCES','AMALGAMATION']
    .forEach((f, i) => { all[f] = 3; rent[f] = { nights: 2, lastDay: i }; loans[f] = { nights: 1, lastDay: i }; });
  const worst = O.book({ favours: all, rent: rent, loans: loans });
  const lines = O.lenderLines(worst);
  ok('the worst case really is every outfit (' + worst.length + ' accounts, '
     + O.lenders(worst).length + ' lenders)',
     worst.length === 48 && O.lenders(worst).length === 16);
  ok('*** AND THE BLOCK IS BOUNDED however many you owe *** (' + lines.length + ' lines)',
     lines.length === O.SHOW + 1);
  ok('*** THE REST IS COUNTED, NEVER SILENTLY DROPPED *** ("'
     + lines[lines.length - 1] + '")',
     /^and 11 more you owe$/.test(lines[lines.length - 1]));
  ok('the cap is a named constant, not a bare number in a loop', O.SHOW === 5);
  const few = O.lenderLines(O.book({ favours: { MOB: 1 } }));
  ok('and owing one outfit says one line and no remainder',
     few.length === 1 && !/more you owe/.test(few[0]));
}

/* ---- 10. on the surface he walks, and in the demo ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(ctx) {
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaOwing };
      const sv = ctBelongSave();
      /* owe four outfits the real way: take what they hand out for free */
      BohemiaBelonging.keys().forEach(fid => {
        try {
          const rule = BohemiaBelonging.ruleOf(fid); if (!rule) return;
          for (let i = 0; i < 3; i++) BohemiaFavour.take(rule, BohemiaBelonging.gaveOf(sv, fid), sv);
        } catch (e) {}
      });
      /* and go short on somebody's ground, through the writer the night uses */
      try { owedNote('MOB'); owedNote('MOB'); } catch (e) {}
      R.owedBefore = JSON.parse(JSON.stringify(sv.meta.owed || {}));
      R.rent = JSON.parse(JSON.stringify(OWED_BOOK || {}));
      R.book = BohemiaOwing.lines(BohemiaOwing.book(
        { favours: sv.meta.owed || {}, rent: OWED_BOOK || {} })).length;

      /* he reads it on the card he already reads */
      R.onCard = false; R.cardText = '';
      for (let n = 0; n < 3 && !R.onCard; n++) {
        advance(20 * 60);
        for (let k = 0; k < 8; k++) {
          const t = (document.getElementById('daycardIn') || {}).textContent || '';
          if (/WHO YOU OWE/.test(t)) { R.onCard = true; R.cardText = t; break; }
          const go = document.querySelector('#daycardIn .dcgo')
                  || document.querySelector('#daycardIn .dcx');
          if (!go) break; go.click();
          await new Promise(s => setTimeout(s, 60));
          if (!document.getElementById('daycard').classList.contains('on')) break;
        }
      }
      R.namesOnCard = BohemiaOwing.creditors(BohemiaOwing.book(
        { favours: sv.meta.owed || {}, rent: OWED_BOOK || {} }))
        .filter(w => R.cardText.indexOf(w) >= 0).length;

      /* then the generation turns */
      R.ruled = BohemiaOwing.billDies();
      try { ctFold(); } catch (e) { R.threw = e.message; }
      const sv2 = ctBelongSave();
      R.owedAfter = JSON.parse(JSON.stringify(sv2.meta.owed || {}));
      R.billAfter = Object.keys(R.owedAfter).reduce((a, k) => a + (R.owedAfter[k] | 0), 0);
      R.peopleAfter = owingParentCreditors();
      R.rentAfter = JSON.parse(JSON.stringify(OWED_BOOK || {}));
      R.saved = localStorage.getItem('boh.city.owing.parent') || '';
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

  ok('the book reaches the surface he walks', r.module === 'object');
  const billBefore = Object.keys(r.owedBefore).reduce((a, k) => a + (r.owedBefore[k] | 0), 0);
  ok('the instrument can see a positive: he really owes somebody ('
     + JSON.stringify(r.owedBefore) + ', rent ' + Object.keys(r.rent).length + ')',
     billBefore > 0 && Object.keys(r.rent).length > 0);
  ok('*** ONE BOOK ANSWERS WHO HE OWES, ACROSS BOTH KINDS *** (' + r.book + ' accounts)',
     r.book > 1);
  ok('*** AND HE READS IT ON THE CARD HE ALREADY READS ***', r.onCard === true);
  ok('*** WITH EVERY LENDER NAMED ON IT *** (' + r.namesOnCard + ' names)',
     r.namesOnCard > 1);
  ok('the fold rules the bill dies', r.ruled === true);
  ok('*** SO THE BILL DIES AT THE FOLD, AND IT NEVER USED TO: ' + billBefore
     + ' -> ' + r.billAfter + ' ***', billBefore > 0 && r.billAfter === 0);
  ok('*** AND THE PEOPLE HE OWED ARE STILL STANDING THERE *** ('
     + r.peopleAfter.join(', ') + ')',
     r.peopleAfter.length > 1 && r.peopleAfter.every(w => !/\d/.test(w)));
  ok('they ride their own key, so a valley reset cannot forgive everybody',
     /"gen"/.test(r.saved) && /"creditors"/.test(r.saved));
  ok('the rent book is untouched: it is not this lane\'s to clear',
     Object.keys(r.rentAfter).length >= Object.keys(r.rent).length);
  ok('no page error across the fold' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0 && !r.threw);

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
  const dBefore = Object.keys(d.owedBefore || {}).reduce((a, k) => a + (d.owedBefore[k] | 0), 0);
  ok('*** AND THE WHOLE THING RUNS IN THE DEMO TOO: the card names his lenders,'
     + ' the bill dies at the fold (' + dBefore + ' -> ' + d.billAfter
     + ') and the people stay ***',
     d.onCard === true && d.namesOnCard > 1 && dBefore > 0 && d.billAfter === 0
     && (d.peopleAfter || []).length > 1);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();

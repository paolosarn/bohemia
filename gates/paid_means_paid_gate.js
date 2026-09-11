const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   BOHEMIA PAID MEANS PAID GATE (9/11/26, PEOPLE lane).
   VAMILY [paid means paid] -- row THE-CARD-SAYS-PAID-AND-NOTHING-IS-PAID.

   THE ROW: ECONOMY round 26 read this lane's own [make it right] work the round
   after it shipped and found the hole. RIGHT_WORDS carries 'paid': 'PAID THEM
   BACK', the one live caller passed exactly that word, and makeRight had no
   purse, no currency and no amount. THE CARD SAID PAID AND NOTHING WAS PAID.

   THE COORDINATOR RULED IT 9/7: restitution is paid in batteries from the purse
   to the person wronged, WEIGHT FOR WEIGHT, under EVERYTHING COSTS ONE. If the
   purse cannot cover it the apology is still offered and the wronged person
   decides whether words alone will do.

   WHAT THIS GATE HOLDS:
   A. the price is the GRUDGE ITSELF, so it is his dial and not a number typed
      anywhere -- and while the deed table is empty it is honestly zero
   B. *** THE WORD 'paid' IS REFUSED WHEN NOTHING WAS PAID. *** This is the row.
      A caller cannot lie to the ledger even by accident.
   C. and on the real demo the batteries actually LEAVE THE PURSE, as a transfer
      rather than a drain, because restitution goes TO somebody
   D. while a player who cannot afford it can still apologise, and the record
      then says THEY LET IT GO, which is what happened

   node gates/paid_means_paid_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const DEMO = 'file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function head(t) { console.log('\n' + t); }

const S = require(path.join(ROOT, 'engine/bohemia_standing.js'));
const M = require(path.join(ROOT, 'engine/bohemia_memory.js'));
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));

function wronged(weight) {
  S.DEED_WEIGHT['commit'] = weight;
  const m = M.makeMind('victim' + Math.random());
  S.witness([m], 100, '@', 'commit', 0, 0, () => ({ x: 0, y: 0 }));
  return m;
}

(async () => {
  head('A. THE PRICE IS THE GRUDGE ITSELF, NOT A NUMBER ANYBODY TYPED');
  ok('priceOf is reachable at all -- it is what the card and the button both ask',
    typeof S.priceOf === 'function');
  const w3 = wronged(-3);
  ok('*** A WRONG THAT WEIGHS THREE COSTS THREE *** -- the coordinator\'s own '
    + 'words, and weight for weight falls straight out of the sum wouldSquare '
    + 'already adds up', S.priceOf(w3, '@', 100) === 3, String(S.priceOf(w3, '@', 100)));
  const w6 = wronged(-6);
  ok('and a heavier wrong costs more because it IS more', S.priceOf(w6, '@', 100) === 6,
    String(S.priceOf(w6, '@', 100)));
  const wFrac = wronged(-0.2);
  ok('EVERYTHING COSTS ONE: a wrong you can feel cannot cost nothing, so a '
    + 'fraction rounds UP to one battery -- half a battery is not a thing '
    + 'anybody can hand over', S.priceOf(wFrac, '@', 100) === 1,
    String(S.priceOf(wFrac, '@', 100)));
  /* AND THE EMPTY-TABLE CASE IS THE HONEST ONE, NOT A DEFAULT. */
  const keep = S.DEED_WEIGHT['commit'];
  delete S.DEED_WEIGHT['commit'];
  const wNone = M.makeMind('v-none');
  S.witness([wNone], 100, '@', 'commit', 0, 0, () => ({ x: 0, y: 0 }));
  ok('*** AND WHILE HIS DEED TABLE IS EMPTY IT COSTS NOTHING, WHICH IS THE TRUTH '
    + 'AND NOT A HIDDEN DEFAULT *** -- nobody has ruled what a wrong weighs, so '
    + 'nobody is owed anything for it', S.priceOf(wNone, '@', 100) === 0,
    String(S.priceOf(wNone, '@', 100)));
  S.DEED_WEIGHT['commit'] = keep;
  ok('and priceOf never reads a currency, a purse or a balance -- it answers what '
    + 'is OWED, and whether it can be paid is the surface\'s problem',
    !/purse|electricity|balance/i.test(String(S.priceOf)));

  head('B. THE WORD IS REFUSED WHEN NOTHING WAS PAID, AND THAT IS THE ROW');
  const a = wronged(-3);
  const rNo = S.makeRight(a, '@', { how: 'paid', turn: 120 });
  ok('*** ASKING FOR "paid" WITH NOTHING HANDED OVER DOES NOT GET "paid" *** -- '
    + 'the card said PAID THEM BACK and nothing was ever paid, and a caller can '
    + 'no longer do that even by accident',
    rNo.how === 'forgiven' && rNo.paid === 0, rNo.how + ', paid ' + rNo.paid);
  ok('and the wrong is still SETTLED, because the ruling says the apology stands '
    + 'either way -- this refuses the WORD, never the forgiveness', rNo.settled === 1);
  const bm = wronged(-3);
  const rYes = S.makeRight(bm, '@', { how: 'paid', paid: 3, turn: 120 });
  ok('*** AND WITH THREE BATTERIES ACTUALLY HANDED OVER IT IS "paid" ***',
    rYes.how === 'paid' && rYes.paid === 3, rYes.how + ', paid ' + rYes.paid);
  ok('the amount is on the record, so a surface can always say what was paid',
    (bm.deeds.filter(d => d.right)[0] || {}).right.paid === 3);
  const cm = wronged(-3);
  const rWords = S.makeRight(cm, '@', { how: 'forgiven', turn: 120 });
  ok('and forgiving with words alone was always legal and still is',
    rWords.how === 'forgiven' && rWords.settled === 1);

  head('C. THE PURSE IS REAL, AND BATTERIES ARE THE LINE IT COMES OUT OF');
  ok('the purse has exactly the three currencies his law allows',
    P.CURRENCIES.length === 3 && P.CURRENCIES.indexOf('electricity') >= 0,
    P.CURRENCIES.join(', '));
  const purseSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8');
  ok('and ELECTRICITY is the battery line, in the purse\'s own words rather than '
    + 'my reading of them', /ELECTRICITY\s+batteries/.test(purseSrc));

  head('D. AND ON THE REAL DEMO THE BATTERIES ACTUALLY LEAVE');
  const browser = await playwright().chromium.launch({ args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
    await page.goto(DEMO);
    await SETTLE(page, 15000);
    await page.evaluate(() => {
      const f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 12000);
    await new Promise(r => setTimeout(r, 4000));
    const fr = page.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
    ok('the walked city is on screen', !!fr);
    if (fr) {
      const m = await fr.evaluate(() => {
        const o = {};
        for (let q = 0; q < 6; q++) {
          const gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
        try { cardHide(); } catch (e) { }
        T.min = 13 * 60;
        /* HIS OWN DIAL, the real one the DIRECT tab posts. Nothing writes a
           weight by hand here or the price would be measuring this gate. */
        ctDialApply({ 'commit': -6, 'favour': 4 }, false);
        try { render(); } catch (e) { }
        if (!BARK_DREW.length) { o.err = 'nobody drawn'; return o; }
        const t = BARK_DREW[0], at = t.at;
        for (let v = 0; v < 8; v++) {
          const d = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]][v];
          if (pplStandable(at[0]+d[0], at[1]+d[1])) { hx = at[0]+d[0]; hy = at[1]+d[1]; break; } }
        try { render(); } catch (e) { }
        const el = () => { const x = document.getElementById('ctcard');
                           return x ? String(x.textContent || '') : ''; };
        ctDeed('commit', CT_DEED_CLOUT['commit'], 'Cartel');
        ctDeed('favour', CT_DEED_CLOUT['favour'], 'Cartel');
        ctDeed('favour', CT_DEED_CLOUT['favour'], 'Blues');
        try { ctAgainstBump(); render(); } catch (e) { }
        const mind = CT_MINDS[t.p.id];
        o.price = BohemiaStanding.priceOf(mind, '@', ctMinuteNow());

        /* CASE ONE: BROKE. The apology still stands and must NOT say paid. */
        try { const bal = BohemiaPurse.balance(purseGet(), 'electricity');
              if (bal > 0) BohemiaPurse.debit(purseGet(), 'electricity', bal,
                                              'gate', null, DAY.day); } catch (e) { }
        o.broke = BohemiaPurse.balance(purseGet(), 'electricity');
        try { ctOpen(); } catch (e) { }
        o.cardSaysPrice = el().indexOf('TO PUT IT RIGHT') >= 0;
        o.saysCannotAfford = el().indexOf('You do not have it') >= 0;
        const b1 = document.getElementById('ctright'); if (b1) b1.click();
        const d1 = BohemiaStanding.madeRightBy(mind, '@');
        o.brokeSays = d1.length ? d1[0].say : null;
        o.brokeBalance = BohemiaPurse.balance(purseGet(), 'electricity');
        return o;
      });
      ok('nobody was drawn to stand next to' + (m.err ? ': ' + m.err : ''), !m.err);
      ok('the card names the price before he presses anything, off his own dial',
        m.cardSaysPrice && m.price > 0, m.price + ' batteries');
      ok('*** A PLAYER WITH AN EMPTY PURSE IS TOLD SO AND CAN STILL APOLOGISE *** '
        + '-- the ruling\'s own second half', m.broke === 0 && m.saysCannotAfford);
      ok('*** AND THE RECORD THEN SAYS THEY LET IT GO, NOT PAID THEM BACK ***',
        m.brokeSays === 'THEY LET IT GO', String(m.brokeSays));
      ok('and nothing was taken from a purse that had nothing', m.brokeBalance === 0);

      /* CASE TWO: he can afford it. A fresh page, because a wrong can only be
         squared once and this has to be the same road a player walks. */
      const page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page2.goto(DEMO);
      await SETTLE(page2, 15000);
      await page2.evaluate(() => {
        const f = document.getElementById('fronttap') || document.getElementById('front');
        if (f) f.click(); });
      await SETTLE(page2, 12000);
      await new Promise(r => setTimeout(r, 4000));
      const fr2 = page2.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
      ok('the city is on screen for the paying case', !!fr2);
      if (fr2) {
        const n = await fr2.evaluate(() => {
          const o = {};
          for (let q = 0; q < 6; q++) {
            const gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
          try { cardHide(); } catch (e) { }
          T.min = 13 * 60;
          ctDialApply({ 'commit': -6, 'favour': 4 }, false);
          try { render(); } catch (e) { }
          if (!BARK_DREW.length) { o.err = 'nobody drawn'; return o; }
          const t = BARK_DREW[0], at = t.at;
          for (let v = 0; v < 8; v++) {
            const d = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]][v];
            if (pplStandable(at[0]+d[0], at[1]+d[1])) { hx = at[0]+d[0]; hy = at[1]+d[1]; break; } }
          try { render(); } catch (e) { }
          ctDeed('commit', CT_DEED_CLOUT['commit'], 'Cartel');
          ctDeed('favour', CT_DEED_CLOUT['favour'], 'Cartel');
          ctDeed('favour', CT_DEED_CLOUT['favour'], 'Blues');
          try { ctAgainstBump(); render(); } catch (e) { }
          const mind = CT_MINDS[t.p.id];
          BohemiaPurse.credit(purseGet(), 'electricity', 10, 'gate', null, DAY.day);
          o.before = BohemiaPurse.balance(purseGet(), 'electricity');
          o.price = BohemiaStanding.priceOf(mind, '@', ctMinuteNow());
          try { ctOpen(); } catch (e) { }
          const b = document.getElementById('ctright'); if (b) b.click();
          const d = BohemiaStanding.madeRightBy(mind, '@');
          o.says = d.length ? d[0].say : null;
          o.after = BohemiaPurse.balance(purseGet(), 'electricity');
          let h = []; try { h = BohemiaPurse.history(purseGet()) || []; } catch (e) { }
          const row = h.filter(x => x && x.reason === 'restitution').pop();
          o.row = row ? { kind: row.kind, amount: row.amount, currency: row.currency } : null;
          return o;
        });
        ok('nobody was drawn for the paying case' + (n.err ? ': ' + n.err : ''), !n.err);
        ok('*** PRESSING IT PAYS, AND THE BATTERIES REALLY LEAVE THE PURSE ***',
          n.before - n.after === n.price && n.price > 0,
          n.before + ' -> ' + n.after + ', price ' + n.price);
        ok('*** AND NOW THE RECORD SAYS PAID THEM BACK, AND IT IS TRUE ***',
          n.says === 'PAID THEM BACK', String(n.says));
        ok('it is a TRANSFER in the ledger and not a drain, because restitution '
          + 'goes TO the person wronged rather than being consumed',
          !!n.row && n.row.kind === 'transfer' && n.row.currency === 'electricity',
          JSON.stringify(n.row));
      }
    }
    ok('nothing threw on the page' + (errs.length ? ': ' + errs[0] : ''),
      errs.length === 0);
  } finally { await browser.close(); }

  console.log('\nPAID MEANS PAID GATE: ' + pass + ' pass / ' + fail.length + ' fail');
  process.exit(fail.length ? 1 : 0);
})();

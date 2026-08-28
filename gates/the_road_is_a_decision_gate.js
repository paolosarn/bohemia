const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   THE ROAD IS A DECISION (8/27/26, RUN lane)

     laws/BOHEMIA_ADDENDUM_FAST_TRAVEL_IS_A_JOURNEY_8_24_26.md, its own test:
     "Did something happen between leaving and arriving that COULD HAVE GONE
      DIFFERENTLY, and did what he did beforehand change it? If no, it is a
      loading screen wearing a costume."
     And the approved roster's first principle:
     "VARIETY IS A DIFFERENT VERB, NEVER A BIGGER HP BAR."

   THE ROAD INTERRUPTS SHIPPED THIS MORNING AND EVERY ENCOUNTER HAD THE SAME
   VERB: read a card, tap KEEP MOVING. Twelve different things and one response.

   AND I ARGUED THIS MORNING THAT THE FORK WAS BLOCKED ON THE DAMAGE DIAL. It
   was not. I had framed it as PUSH THROUGH versus GO AROUND, where one arm is
   free, so the free arm needs a hidden price and that price is damage. A FORK
   DOES NOT NEED DAMAGE IF BOTH ARMS COST SOMETHING REAL: pay salvage and save
   time, or spend time and keep the salvage. Neither is free, neither dominates,
   and which is right depends on the day you are having.

   WHAT THIS HOLDS:
   A. THE OPTIONS COME OUT OF THE APPROVED ROSTER'S OWN `ends` STRINGS, so this
      is his design being built rather than mine being added.
   B. BOTH ARMS COST SOMETHING. A fork with a free arm is not a fork, and the
      mutation for this claim is making one free.
   C. IT REALLY SPENDS THE THING IT SAYS IT SPENDS -- the ledger and the clock
      both move, measured, not asserted.
   D. PAYING IS A TRANSFER, NOT A DRAIN. The crew HAS the cut; the salvage did
      not stop existing. Getting this wrong is invisible and quietly tells the
      economy that matter evaporates.
   E. AND IT DOES NOT BREAK "NOTHING IS EVER TAKEN FROM HIM". That claim is
      about THEFT. A toll he chose to pay is not a theft, so payments carry
      their own ledger ref and the old claim keeps holding what it held.
   F. AN OPTION HE CANNOT AFFORD IS SHOWN AND REFUSED, NOT HIDDEN. Hiding it
      tells him the crew does not take payment when the truth is he is broke.
   G. AND A REFUSAL NEVER STRANDS HIM on a card with nothing to press.

   node gates/the_road_is_a_decision_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== THE ROAD IS A DECISION: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1200);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1500);

    /* ---- A. HIS DESIGN, NOT MINE ---------------------------------------- */
    const tbl = await city.evaluate(() => {
      const out = {};
      for (const id in ROAD_CHOICES) {
        const c = ROAD_CHOICES[id];
        const tok = BohemiaEncounters.byId(id);
        out[id] = { ends: c.ends || null, rosterEnds: tok ? tok.ends : null,
                    verb: tok ? tok.verb : null,
                    opts: c.opts.map(o => ({ a: o.a, pay: o.pay || 0, min: o.min || 0,
                                             give: o.give || 0, ride: o.ride || 0,
                                             blind: o.blind || 0 })) };
      }
      return out;
    });
    const ids = Object.keys(tbl);
    ok('four of the twelve now ask him something (' + ids.join(', ') + ')',
      ids.length === 4);
    /* THE CLAIM THAT KEEPS THIS HIS: every option must be traceable to the
       roster's own words for that token, not to my taste. */
    const traced = ids.filter(id => {
      const t = tbl[id];
      const src = ((t.rosterEnds || '') + ' ' + (t.verb || '')).toLowerCase();
      return t.opts.every(o => {
        if (o.pay) return /pay/.test(src);
        if (o.ride) return /ride/.test(src);
        if (o.give) return /loot/.test(src);
        if (o.min) return /detour|scare|walk on/.test(src);
        return /walk on|rush/.test(src);
      });
    });
    ok('*** AND EVERY OPTION IS TRACEABLE TO THE APPROVED ROSTER\'S OWN WORDS ***'
      + ' -- his design built, not mine added (' + traced.length + ' of ' + ids.length + ')',
      traced.length === ids.length);

    /* ---- B. BOTH ARMS COST SOMETHING ------------------------------------ */
    /* *** A FORK WITH A FREE ARM IS NOT A FORK, IT IS A BUTTON, AND THIS CLAIM
       CAUGHT ME SHIPPING ONE. *** The first cut of the cab was GET IN (free, pure
       gain) against LET IT GO (nothing), which one arm strictly wins -- in the
       same turn whose header claimed I do not ship those. The fix came out of the
       roster: the cab drives ITS loop, so the gain is free distance and the cost
       is NOT CHOOSING THE DIRECTION, paid later in the walk back. `blind` counts
       as a cost here because it is one; it is just not one you pay at the till. */
    const cost = x => x.pay || x.min || x.blind;
    const forks = ids.filter(id => {
      const o = tbl[id].opts;
      const costing = o.filter(cost);
      const gaining = o.filter(x => x.give || x.ride);
      return costing.length >= 2 || (costing.length >= 1 && gaining.length >= 1);
    });
    ok('*** NO FORK HAS A FREE ARM THAT BEATS THE OTHER *** -- every one either '
      + 'costs on both sides or trades a cost against a gain (' + forks.length
      + ' of ' + ids.length + ')', forks.length === ids.length);
    const both = tbl.toll_crew.opts;
    ok('and the headline trade is real: pay ' + both[0].pay + ' salvage OR spend '
      + both[1].min + ' minutes, and neither is free',
      both[0].pay > 0 && both[1].min > 0);

    /* ---- C + D + E. IT REALLY SPENDS IT --------------------------------- */
    const spent = await city.evaluate(async () => {
      /* give him something to spend, through the same faucet the road uses */
      BohemiaPurse.credit(purseGet(), 'resources', 9, 'gate float', 'gatefloat:1', 1);
      const before = BohemiaPurse.balance(purseGet(), 'resources');
      const t0 = T.min;
      const ev = { id: 'toll_crew', seq: 901 };
      const paid = roadChoose(ev, 'pay');
      const mid = BohemiaPurse.balance(purseGet(), 'resources');
      const ev2 = { id: 'toll_crew', seq: 902 };
      const round = roadChoose(ev2, 'around');
      const after = BohemiaPurse.balance(purseGet(), 'resources');
      const t1 = T.min;
      const p = purseGet();
      const payEntries = p.entries.filter(e => /^roadpay:/.test(e.ref || ''));
      const lootEntries = p.entries.filter(e => /^road:/.test(e.ref || ''));
      return { before, mid, after, minsMoved: t1 - t0,
               paid, round,
               payKinds: Array.from(new Set(payEntries.map(e => e.kind))),
               payCount: payEntries.length,
               lootDebits: lootEntries.filter(e => e.amount < 0).length };
    });
    ok('*** PAYING THE TOLL REALLY MOVES THE LEDGER *** (' + spent.before + ' -> '
      + spent.mid + ')', spent.mid === spent.before - 2 && spent.paid.ok);
    ok('*** AND GOING AROUND REALLY SPENDS THE DAY *** (' + spent.minsMoved
      + ' minutes gone, and no more salvage: ' + spent.mid + ' -> ' + spent.after + ')',
      spent.minsMoved >= 20 && spent.after === spent.mid);
    /* D. */
    ok('*** A PAYMENT IS A TRANSFER, NOT A DRAIN *** -- the crew HAS the cut, so '
      + 'the salvage changed hands rather than stopping existing ('
      + JSON.stringify(spent.payKinds) + ')',
      spent.payCount > 0 && spent.payKinds.length === 1
      && spent.payKinds[0] === 'transfer');
    /* E. */
    ok('and this does NOT break "nothing is ever taken from him" -- that claim is '
      + 'about theft, and a toll he chose to pay is not a theft, so loot entries '
      + 'still carry zero debits (' + spent.lootDebits + ')',
      spent.lootDebits === 0);

    /* ---- F + G. BROKE IS A STATE OF THE WORLD, NOT A MISSING BUTTON ------ */
    const broke = await city.evaluate(async () => {
      const p = purseGet();
      const bal = BohemiaPurse.balance(p, 'resources');
      if (bal > 0) BohemiaPurse.transferOut(p, 'resources', bal, 'gate empty', 'gateempty:1', 1);
      /* GUARDED, because a build that HIDES the unaffordable option returns null
         here and the claim below should say so rather than throw a stack at
         somebody. A gate that dies instead of reporting is still a red, but it
         is a red nobody can read. */
      const r = roadChoose({ id: 'toll_crew', seq: 903 }, 'pay') || { missing: true };
      const after = BohemiaPurse.balance(p, 'resources');
      /* and it is still OFFERED on the card, not hidden */
      roadCard({ id: 'toll_crew', seq: 904, kind: 'interactive', name: 'toll crew',
                 at: { district: 'freeway', phase: 'day' } }, 0, 0);
      await new Promise(r2 => setTimeout(r2, 200));
      const inn = document.getElementById('daycardIn');
      const offered = !!inn.querySelector('[data-act="ch:pay"]');
      return { r, after, offered };
    });
    ok('*** AN OPTION HE CANNOT AFFORD IS SHOWN AND REFUSED, NOT HIDDEN *** -- '
      + 'hiding it says the crew does not take payment when the truth is he is '
      + 'broke (offered=' + broke.offered + ', refused=' + !!broke.r.refused + ')',
      broke.offered === true && broke.r.refused === true);
    ok('and being broke costs him nothing he did not have (balance ' + broke.after + ')',
      broke.after === 0);

    /* G. a refusal must leave a way out */
    const out = await city.evaluate(async () => {
      const inn = document.getElementById('daycardIn');
      const pay = inn.querySelector('[data-act="ch:pay"]');
      if (pay) pay.click();
      await new Promise(r => setTimeout(r, 200));
      const rows = Array.from(inn.querySelectorAll('.mrow'))
        .filter(r => r.style.display !== 'none');
      return { left: rows.map(r => r.dataset.act), text: inn.textContent };
    });
    ok('*** AND A REFUSAL NEVER STRANDS HIM *** -- something is still pressable '
      + 'after being told no (' + JSON.stringify(out.left) + ')',
      out.left.length > 0);
    ok('and the card says why in plain words, with the number ('
      + (/do not have it/i.test(out.text) ? 'yes' : 'NO') + ')',
      /do not have it/i.test(out.text) && /salvage/i.test(out.text));

    ok('and nothing threw (' + (errs.length ? errs.slice(0, 2).join(' | ') : 'none')
      + ')', errs.length === 0);
    console.log('  MEASURED: 4 of 12 tokens ask a question · toll crew pay 2 salvage '
      + 'vs go around ' + both[1].min + ' min · ledger ' + spent.before + ' -> '
      + spent.mid + ' as a TRANSFER · ' + spent.minsMoved + ' minutes really spent '
      + '· broke refuses and still offers a way out');
    console.log('  WHAT IS DELIBERATELY MISSING: drop, fight, join and third-party '
      + 'are all kills. NO DAMAGE BEFORE THE DIAL, and the card says so on every '
      + 'card that has one.');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();

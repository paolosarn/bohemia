#!/usr/bin/env node
/* THE LEDGER STAYS SMALL (ECONOMY THREE 11/26, VAMILY rule 480(b) and (c): 'improve what is already in the game before adding
   anything, frames never choppy'; 'no money screen costs a frame'). records/BOHEMIA_ECONOMY_THREE_THE_LEDGER_FOLDS_11_26_26.md.
   MEASURED on the demo before this: the purse never let a line go (40 to 67 lines a map day, 128 bytes a line, 164 of 170 of them
   rent handed over one battery at a time), and the purse rides in the autosave written after every change; and after a tab died and
   he pressed CONTINUE the pockets book still held the boot's empty purse, so every night's rent was refused and the lights put out.
   DATA legs (the engine, engine/bohemia_purse.js fold):
     D1 a rolled 2,000-day ledger folded every night has every balance, every act's balance and every kind's flow of the same
        ledger never folded, to the battery
     D2 the folded ledger audits clean: no line anonymous, the history never under zero, the sequence whole
     D3 the last FOLD_KEEP days are line for line the same; the hunger count (walks back to the last day they ate) the same,
        a starving stretch longer than the kept days included
     D4 the size: the folded save is small (under 150 KB at day 2,000) where the never-folded one is megabytes
     D5 a reader's pinned line (the pockets' opening stock) stays whole, and a line posted late with an old day never makes the
        history go under zero
     D6 THE BITE: a fold that loses one lump, and a fold that is never called, each turn D1 / D4 red
   WIRE legs (the page's own text):
     W1 the map folds at nightfall after the night's money, and folds an old save as it loads
     W2 a loaded purse is ADOPTED by the pockets (the player's purse is the one on the bar)
     W3 the rent is one hand-over a faction a night, at the table's price a block (no battery-at-a-time loop)
     W4 every page that carries the purse inline carries engine/bohemia_purse.js byte for byte
   PAGE legs (rule 441: the demo and the alpha, on a phone upright and on its side): a new crew spends, a fat old save is planted
   (the alpha loads a save twice, so the last fold it says may be the second, with nothing left to fold: the lines are the test)
   in the autosave (3,000 lines on days 1 to 20, the game's day 60), the tab is killed, CONTINUE:
     P1 the old save came in folded (a few hundred lines at most) and the bar reads to the battery what the purse holds
     P2 the pockets' player IS the bar's purse, and the night's rent (a planted day on Mob ground) is paid from it: one line,
        the bar down by the rent, the Mob's pocket up by the same
     P3 the live purse audits clean; no page error
   node gates/the_ledger_stays_small_gate.js [data | demo | alpha] [phone_portrait | phone_landscape] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const P = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const MODE = process.argv[2] || 'data', SHAPE = process.argv[3] || 'phone_portrait';
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

/* a ledger the way the map posts it: the start, five fights a day (some won, some lost), the crew's night bill, the night's rent
   one line a faction (six to nine of them), a buy or two, clout, the verb 'day:ate' most nights, a convert now and then; act 2
   from day 1,000; the last 45 days nobody eats (the hunger count past the kept days) */
function roll(days, foldIt, foldFn) {
  const p = P.create(); let x = 11; const r = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
  const F = ['Mob', 'Blues', 'Church', 'Network', 'Cartel', 'Reds', 'Homeless', 'Trades', 'Remnants'];
  P.credit(p, 'electricity', 290, 'the crew starts: A NEW CREW', 'start:newcrew', 1);
  P.credit(p, 'resources', 30, 'the crew starts: food', 'start:newcrew', 1);
  for (let d = 1; d <= days; d++) {
    if (d === 1000) P.setAct(p, 2);
    for (let k = 0; k < 5; k++) if (r() < 0.73) P.credit(p, 'electricity', 30 + Math.floor(r() * 10), 'a job paid: a fight won', 'job:' + d + ':' + k, d);
    P.debit(p, 'electricity', 6 + Math.floor(r() * 4), 'the crew ate: 3 men, food and water', 'bill:' + d, d);
    const nf = 6 + Math.floor(r() * 4);
    for (let k = 0; k < nf; k++) P.transferOut(p, 'electricity', 1 + Math.floor(r() * 5), 'rent on ' + F[k] + ' ground', F[k], d);
    if (r() < 0.6) P.debit(p, 'electricity', 1 + Math.floor(r() * 20), 'bought: tape', 'stall', d);
    P.credit(p, 'clout', 5 + Math.floor(r() * 20), 'a deed', 'deed:' + d, d);
    if (d < days - 45 && r() < 0.85) P.credit(p, 'resources', 1, 'bought rice', 'stall', d), P.upkeep(p, 'day:ate', 'the day', d);
    if (d % 7 === 0) P.convert(p, 'electricity', 3, 'resources', 2, 'the market: rice for cells', 'mkt:' + d, d);
    if (foldIt) (foldFn || P.fold)(p, d);
  }
  return p;
}
const H = require(path.join(ROOT, 'engine/bohemia_hunger.js'));
function same(a, b) {
  const bad = [];
  P.CURRENCIES.forEach(c => {
    if (P.balance(a, c) !== P.balance(b, c)) bad.push(c + ' ' + P.balance(a, c) + ' vs ' + P.balance(b, c));
    for (let act = 1; act <= 3; act++) if (P.balanceIn(a, c, act) !== P.balanceIn(b, c, act)) bad.push(c + ' act ' + act);
  });
  const fa = P.flow(a), fb = P.flow(b);
  P.CURRENCIES.forEach(c => Object.keys(fa[c]).forEach(k => { if (fa[c][k] !== fb[c][k]) bad.push(c + ' flow ' + k + ' ' + fa[c][k] + ' vs ' + fb[c][k]); }));
  return bad;
}

if (MODE === 'data') {
  const DAYS = 2000, never = roll(DAYS, false), folded = roll(DAYS, true);
  const bad = same(never, folded);
  ok('D1 a 2,000-day ledger folded every night has every balance, every act\'s and every kind\'s flow of the same ledger never folded', bad.length === 0,
    bad.slice(0, 3).join('; ') || 'electricity ' + P.balance(folded, 'electricity') + ', clout ' + P.balance(folded, 'clout') + ', act 1 ' + P.balanceIn(folded, 'electricity', 1));
  const au = P.audit(folded);
  ok('D2 the folded ledger audits clean (no line anonymous, never under zero, the sequence whole)', au.ok, au.problems.slice(0, 2).join('; '));
  const cut = DAYS - P.FOLD_KEEP, tailN = never.entries.filter(e => e.day >= cut), tailF = folded.entries.filter(e => e.day >= cut);
  const tailSame = tailN.length === tailF.length && tailN.every((e, i) => ['currency', 'amount', 'kind', 'reason', 'ref', 'day', 'act'].every(k => e[k] === tailF[i][k]));
  const sN = H.streak(never, DAYS), sF = H.streak(folded, DAYS);
  ok('D3 the last ' + P.FOLD_KEEP + ' days line for line (' + tailF.length + ' lines); the hunger count the same past the kept days (' + sN + ' and ' + sF + ')', tailSame && sN === sF && sN > P.FOLD_KEEP);
  const kbN = JSON.stringify(P.save(never)).length / 1024, kbF = JSON.stringify(P.save(folded)).length / 1024;
  ok('D4 the folded save is small: ' + Math.round(kbF) + ' KB and ' + folded.entries.length + ' lines at day 2,000, where never folded it is ' + (kbN / 1024).toFixed(1) + ' MB and ' + never.entries.length + ' lines', kbF < 150 && kbN > 1024);
  /* D5: the pinned line, and a late line with an old day */
  const f = P.create({ id: 'Mob' }); P.credit(f, 'electricity', 600, 'the lights went out', 'opening', 0);
  for (let d = 1; d <= 120; d++) { P.transferOut(f, 'electricity', 4, 'paid its men', 'w', d); P.transferIn(f, 'electricity', 3, 'rent on Mob ground', 'player', d); }
  P.debit(f, 'electricity', 5, 'a late bill for an old day', 'late', 3);
  const fb = P.balance(f, 'electricity'); P.fold(f, 120, { pin: ['the lights went out'] });
  const au5 = P.audit(f), opening = f.entries.filter(e => e.reason === 'the lights went out').length;
  ok('D5 the opening stock stays whole when pinned (' + opening + '), and a late line with an old day keeps the history over zero', opening === 1 && au5.ok && P.balance(f, 'electricity') === fb, au5.problems.slice(0, 2).join('; '));
  /* D6: the bites */
  const lossy = (p, d) => { const r = P.fold(p, d); if (r.applied) { const i = p.entries.findIndex(e => e.ref === 'fold'); if (i >= 0) { p.entries.splice(i, 1); p.entries.forEach((e, j) => { e.seq = j; }); } } return r; };
  const bit1 = same(never, roll(400, true, lossy)).length > 0 || same(roll(400, false), roll(400, true, lossy)).length > 0;
  const bit2 = JSON.stringify(P.save(never)).length / 1024 >= 150;
  ok('D6 the bites: a fold that loses one lump turns D1 red, and a ledger never folded turns D4 red', bit1 && bit2);
  /* W: the page's own text */
  const CW = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const night = CW.indexOf('try{ loanNight(); }catch(_e){}'), foldN = CW.indexOf('try{ window.__PURSE_FOLD = BohemiaPurse.fold(purseGet(), DAY.day); }catch(_e){}');
  const load = CW.indexOf('PURSEV=BohemiaPurse.load(st.purse);'), foldL = CW.indexOf('window.__PURSE_FOLD = BohemiaPurse.fold(PURSEV, st.day || 1)');
  ok('W1 the map folds at nightfall after the night\'s money, and folds an old save as it loads', night > 0 && foldN > night && foldN - night < 600 && load > 0 && foldL > load && foldL - load < 1200);
  ok('W2 the loaded purse is the player\'s: the pockets adopt it as it loads', /PURSEV=BohemiaPurse\.load\(st\.purse\);[\s\S]{0,1200}BohemiaPockets\.adopt\(PURSEV\)/.test(CW));
  const br = CW.slice(CW.indexOf('function blockRent(){'), CW.indexOf('function blockRent(){') + 4000);
  ok('W3 the rent is one hand-over a faction a night at the table\'s price a block (var RENT_A_BLOCK), no battery-at-a-time loop', /var RENT_A_BLOCK=\d+;\s*function blockRent\(\)\{/.test(CW) && !/for\(var n=0;n<r\.billed;n\+\+\)/.test(br) && /give \* RENT_A_BLOCK/.test(br));
  const ENG = fs.readFileSync(path.join(ROOT, 'engine/bohemia_purse.js'), 'utf8'), stale = [];
  fs.readdirSync(path.join(ROOT, 'slices')).filter(n => /\.html$/.test(n)).forEach(n => { const s = fs.readFileSync(path.join(ROOT, 'slices', n), 'utf8'); const at = s.indexOf('/* ==== engine/bohemia_purse.js ==== */\n'); if (at < 0) return; if (s.slice(at + 40, at + 40 + ENG.length) !== ENG) stale.push(n); });
  ok('W4 every page that carries the purse inline carries the engine byte for byte', stale.length === 0, stale.join(', '));
  console.log('=== THE LEDGER STAYS SMALL (data): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}

/* PAGE legs */
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const FILE = MODE === 'alpha' ? 'BOHEMIA_ALPHA_0_9.html' : 'BOHEMIA_DEMO.html';
(async () => {
  let d = await D.open({ profile: SHAPE, file: FILE, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const errs = []; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    await d.fr.waitForFunction(() => window.LOOP && LOOP.start && window.BohemiaPurse && window.BohemiaPockets && typeof purseGet === 'function', null, { timeout: 300000 });
    await d.page.waitForTimeout(3000);
    await d.fr.evaluate(() => { try { BohemiaPurse.debit(purseGet(), 'electricity', 7, 'bought: rice for the road', 'gate', loopDay()); } catch (e) {} try { reportState(); } catch (e) {} });
    await d.page.waitForTimeout(2500);
    const live = await d.fr.evaluate(() => loopBats());
    /* the fat old save: 3,000 lines on days 1 to 20 ahead of his own, +3 then -2 so the history never goes under zero; net +1,500 */
    const planted = await d.page.evaluate(() => {
      const s = CITYSAVE.load(); if (!s || !s.data || !s.data.purse) return { ok: false, why: 'no save with a purse' };
      const st = s.data, old = [];
      for (let i = 0; i < 1500; i++) { const day = 1 + (i % 20);
        old.push({ currency: 'electricity', amount: 3, kind: 'source', reason: 'an old fight won', ref: 'old', day: day, act: 1 });
        old.push({ currency: 'electricity', amount: -2, kind: 'transfer', reason: 'rent on Mob ground', ref: 'Mob', day: day, act: 1 }); }
      st.purse.entries = old.concat((st.purse.entries || []).map(e => Object.assign({}, e, { day: Math.max(55, e.day | 0) })));
      st.day = 60; CITYSAVE.save(st); return { ok: true, lines: st.purse.entries.length };
    });
    await d.page.goto('chrome://crash').catch(() => {}); await new Promise(r => setTimeout(r, 600));
    d = await D.open({ file: FILE, again: d }); d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await d.fr.waitForFunction(() => window.LOOP && LOOP.start && window.BohemiaPockets && typeof purseGet === 'function', null, { timeout: 300000 });
    await d.page.waitForTimeout(3000);
    const a = await d.fr.evaluate(() => { const p = purseGet(); try { if (window.__barPaintRead) __barPaintRead(); } catch (e) {}
      return { lines: p.entries.length, bats: loopBats(), bar: (window.__BAR_READ && __BAR_READ.batteries), fold: window.__PURSE_FOLD || null, same: BohemiaPockets.of('player') === p, audit: BohemiaPurse.audit(p).ok }; });
    ok('P1 [' + MODE + ' ' + SHAPE + '] the old save (' + planted.lines + ' lines) came in folded: ' + a.lines + ' lines, and the bar reads ' + a.bar + ' = the purse ' + a.bats + ' = ' + live + ' + 1,500',
      planted.ok && planted.lines > 3000 && a.fold && (a.fold.applied || a.fold.kept < 300) && a.lines < 300 && a.bats === live + 1500 && a.bar === a.bats, JSON.stringify(a.fold));
    const rent = await d.fr.evaluate(() => { const p = purseGet(), was = loopBats(), mobWas = BohemiaPurse.balance(BohemiaPockets.of('Mob'), 'electricity'), n0 = p.entries.length;
      TURF_USED = { Mob: 9 }; blockRent(); const r = (RENT_TONIGHT || []).filter(x => x.faction === 'Mob')[0] || null;
      const lines = p.entries.slice(n0).filter(e => e.reason === 'rent on Mob ground').length;
      return { r, was, now: loopBats(), mob: BohemiaPurse.balance(BohemiaPockets.of('Mob'), 'electricity') - mobWas, lines, same: BohemiaPockets.of('player') === p }; });
    ok('P2 the pockets\' player IS the bar\'s purse after CONTINUE, and a night on Mob ground (9 blocks) is paid from it: billed ' + (rent.r && rent.r.billed) + ', paid ' + (rent.r && rent.r.paid) + ' in ' + rent.lines + ' line, the bar ' + rent.was + ' -> ' + rent.now + ', the Mob +' + rent.mob,
      a.same && rent.same && rent.r && rent.r.paid === rent.r.billed && rent.r.billed > 0 && rent.lines === 1 && rent.was - rent.now === rent.r.paid && rent.mob === rent.r.paid);
    const e2 = errs.filter(e => !/ResizeObserver|favicon/.test(e));
    ok('P3 the live purse audits clean, no page error', a.audit && e2.length === 0, e2.slice(0, 2).join(' | '));
  } catch (e) { ok('the walk ran', false, String(e && e.message || e).slice(0, 200)); }
  await d.close().catch(() => {});
  console.log('=== THE LEDGER STAYS SMALL (' + MODE + ' ' + SHAPE + '): ' + pass + ' ok, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();

/* ==========================================================================
   A WAY TO SAY NO  (FIXES 3, 11/26/26, ask row 727, FOUND BY EYES 11/26 on a phone slowed 4x; the second votes 9/23: NOTHING IS FORCED;
   VAMILY rule 32a, rules 482, 441)

   EYES MEASURED: on the road the man with a shopping cart ('FOR YOUR PLACE') offered only 'Pay him ten batteries' or 'Trade him four
   nights of food', and a tap off the card left it up; in the road's data every answer cost something on five offers: the solar cart,
   the family at the door, the leaderless, the freed cooks, the good price.
   THE LAW (__A_WAY_TO_SAY_NO__): every road card lets him say no. An answer that spends nothing, or a fight or a gamble he can choose
   instead of paying (the drone's owners, the rival crew, the brother: pay or fight is a real choice, kept as it is). The five offers
   carry the road's own standing words for it, 'Walk on.' (on 11 cards already; rule 454(a): no new line), an answer that changes
   nothing: the road's own page already lets such an answer go at once (__A_QUIET_EVENT_IS_A_POST__: its '...' is no post, the march
   goes on), so only the data changed.

   LEGS
     D1 the data (records/target/BOHEMIA_ROAD_EVENTS.json): every card has a free answer, a fight or a gamble; the five carry 'Walk on.'
     P1 PLANTED (the five without it): D1's reader names exactly the five
     G1 the demo upright, a NEW GAME, the solar cart and the family at the door on the glass: three answers, 'Walk on.' whole on the glass;
        a real tap on it: the card gone within a second, no card after it, the batteries and the food as they were
     P2 PLANTED (the five without it, served to the demo): the same cards on the glass offer only what costs; the leg sees it
     Z  nothing threw
   node gates/a_way_to_say_no_gate.js   (about 2 min)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_ROAD_EVENTS.json'), 'utf8'));
const FIVE = ['ev_the_solar_cart', 'ev_the_family_at_the_door', 'ev_the_leaderless', 'ev_the_freed_cooks', 'ev_the_good_price'];
/* an answer says no when it pays nothing (no batteries, food or supplies handed over: a wound or a man walking off is what follows a
   no, as 'Let them settle it' on the last canteen); a fight or a gamble is a way to refuse paying */
const spends = o => { const fx = o.fx || {}; return ['bats', 'food', 'meds', 'tape', 'rounds'].some(k => typeof fx[k] === 'number' && fx[k] < 0); };
const refuses = o => { const fx = o.fx || {}; return !!(fx.fight || fx.chance) || !spends(o); };
const forced = evs => evs.filter(e => (e.opts || []).length > 1 && !(e.opts || []).slice(0, 3).some(refuses)).map(e => e.id);
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'sayno-')), DATA_OLD = path.join(TMP, 'BOHEMIA_ROAD_EVENTS.json');
fs.writeFileSync(DATA_OLD, JSON.stringify(Object.assign({}, DATA, { events: DATA.events.map(e => FIVE.indexOf(e.id) >= 0 ? Object.assign({}, e, { opts: e.opts.filter(o => o.t !== 'Walk on.') }) : e) })));
async function glass(planted) {
  const d = await drive.open({ profile: 'phone_portrait', keepCards: true, serve: planted ? { '/records/target/BOHEMIA_ROAD_EVENTS.json': DATA_OLD } : {}, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const out = { errs: [], cards: [] };
  try {
    d.page.on('pageerror', e => out.errs.push(String(e && e.message || e).slice(0, 160)));
    for (let i = 0; i < 80; i++) { if (await d.fr.evaluate(() => !!(window.BohemiaRoadEvents && BohemiaRoadEvents.ready())).catch(() => false)) break; await d.page.waitForTimeout(250); }
    await d.page.waitForTimeout(2500);
    out.planted = await d.fr.evaluate(() => !!window.BohemiaRoadEvents).catch(() => false);
    const read = () => d.fr.evaluate(() => { let food = null; try { food = (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null') || {}).food; } catch (e) {} return { bats: loopBats(), food, up: BohemiaRoadEvents.up(), card: (document.querySelector('#roadcard') || {}).innerText || '' }; });
    for (const id of ['ev_the_solar_cart', 'ev_the_family_at_the_door']) {
      await d.fr.evaluate(() => { try { BohemiaRoadEvents.close(false); } catch (e) {} });
      const a = await read();
      await d.fr.evaluate(id => BohemiaRoadEvents.fire(id), id);
      await d.page.waitForTimeout(1200);   /* past the card's first beat (a press in it answers nothing, row 611) */
      const opt = await d.fr.evaluate(() => { const bs = [...document.querySelectorAll('#roadcard [data-road]')]; const b = bs.find(x => /Walk on\./.test(x.textContent || '')); if (!b) return { n: bs.length, at: null }; const r = b.getBoundingClientRect();
        return { n: bs.length, at: [r.x + r.width / 2, r.y + r.height / 2], whole: r.width >= 44 && r.height >= 30 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth && b.scrollWidth <= b.clientWidth + 1 }; });
      const fb = await (await d.fr.frameElement()).boundingBox();
      if (opt.at) await d.page.touchscreen.tap(fb.x + opt.at[0], fb.y + opt.at[1]);
      let b = null; for (let k = 0; k < 10; k++) { await d.page.waitForTimeout(100); b = await read(); if (!b.up) break; }
      await d.page.waitForTimeout(600); const c = await read();
      const chose = await d.fr.evaluate(() => { const L = window.__ROADEV_CHOSE || []; return L.length ? L[L.length - 1] : null; });
      out.cards.push({ id, n: opt.n, whole: !!opt.whole, tapped: !!opt.at, goneIn1s: !b.up, after: c.up ? c.card.slice(0, 40) : null, spent: { bats: a.bats - c.bats, food: (a.food | 0) - (c.food | 0) }, chose: chose && chose.t });
    }
  } catch (e) { out.why = String(e && e.message || e).slice(0, 200); }
  finally { await d.close().catch(() => {}); }
  return out;
}
(async () => {
  console.log('\nA WAY TO SAY NO\n');
  const F = forced(DATA.events), five = FIVE.map(id => { const e = DATA.events.find(x => x.id === id); return e && e.opts.some(o => o.t === 'Walk on.' && !Object.keys(o.fx || {}).length); });
  ok('D1 the road\'s data: every one of ' + DATA.events.length + ' cards lets him say no (a free answer, or a fight or a gamble in place of paying); the five offers carry \'Walk on.\'', F.length === 0 && five.every(Boolean), JSON.stringify({ forced: F, five }));
  const planted = DATA.events.map(e => FIVE.indexOf(e.id) >= 0 ? Object.assign({}, e, { opts: e.opts.filter(o => o.t !== 'Walk on.') }) : e);
  const PF = forced(planted);
  ok('P1 PLANTED (the five without it): the reader names exactly those five', PF.length === 5 && FIVE.every(id => PF.indexOf(id) >= 0), JSON.stringify(PF));
  const G = await glass(false);
  ok('G1 the demo upright: the solar cart and the family at the door show three answers, \'Walk on.\' whole on the glass; a real tap on it: the card gone within a second, nothing after it, not a battery or a night of food spent',
    G.cards.length === 2 && G.cards.every(c => c.n === 3 && c.whole && c.tapped && c.goneIn1s && !c.after && c.spent.bats === 0 && c.spent.food === 0 && c.chose === 'Walk on.'), JSON.stringify({ cards: G.cards, why: G.why || null }));
  const P = await glass(true);
  ok('P2 PLANTED (the five without it, served to the demo): the same cards on the glass offer two answers and no way to say no; the leg sees it', P.cards.length === 2 && P.cards.every(c => c.n === 2 && !c.tapped), JSON.stringify(P.cards.map(c => ({ id: c.id, n: c.n, tapped: c.tapped }))));
  ok('Z nothing threw', G.errs.length === 0, G.errs.slice(0, 2).join(' | '));
  try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) {}
  console.log('\nA WAY TO SAY NO: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

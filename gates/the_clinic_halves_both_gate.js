/* THE CLINIC HALVES BOTH GATE (CAMP [the clinic halves the days and the debuff], VAMILY rule 241(e), 10/26/26).
   PAOLO 10/26: 'the clinic has it for 89 batteries, I see how much it's gonna cost... I just want you to make it clear that it has
   the debuff and the time as well... if I did take it to a clinic, I want it to be clear that it would half the days and half the
   debuff'.
   A man struck down (the company's condition fed the fight's own kind of end row through engine/bohemia_condition.js afterFight:
   down, a wiki permanent mark, 7 days: rule 264(h)'s 6 to 8 of ours, odd so a rounded half could not pass for half the debuff),
   then the town's clinic and the crew card, on the phone profile and the computer profile:
     C1 the clinic knows he is hurt (the live game never handed the town its hurt: the clinic reads the company's own condition)
     C2 THE WHOLE TRADE BEFORE HE PAYS: the wound's mark and its word; its debuff, one stat icon and a red DOWN arrow a cut; the days
        on a clock; the clinic's after beside the now: the days cut in two (the clock rounds up) and every arrow halved (the after's figures
        are half the now's); what is his for life and that the clinic cannot touch it; then the price
     C3 PAY (a real press on Treat): the batteries go down by the price; his wound's days left are exactly half, and its debuff
        half for them (engine/bohemia_long_injury.js freshNow); his mark for life untouched; Treat is spent
     C3b ONE HALVING (rule 241(b)): after the press the doc says he walks out with you; his card says TREATED, no second Treat
     C4 THE CREW CARD MATCHES: the crew screen's card shows the same days and the same halved arrows, and says the clinic already cut it
     C5 nothing threw
   node gates/the_clinic_halves_both_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8873;
const LI = require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const MAN = 'TOMAS', MARK = 'missing_eye', DAYS = 7;
const PROFILES = { phone_portrait: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, computer: { viewport: { width: 1280, height: 800 } } };
/* the card's figures as drawn: each chip's stat and value (the hover's own words), each arrow's length, the days on its clock */
const READ_CARD = (sel) => { const c = document.querySelector(sel); if (!c) return null;
  const col = (w) => { const e = c.querySelector('[data-when="' + w + '"]'); return e ? { chips: [...e.querySelectorAll('.injk')].map(k => ({ stat: k.dataset.stat, value: +k.dataset.value, down: !!k.querySelector('.injar.dn'), len: parseFloat(k.querySelector('.injar').style.height), icon: !!k.querySelector('img') || !!k.querySelector('i') })), days: +(e.querySelector('[data-days]') || {}).dataset.days } : null; };
  return { head: (c.querySelector('.injh') || {}).textContent || '', drop: !!c.querySelector('canvas[data-px="drop"]'), clock: !!c.querySelector('canvas[data-px="clock"]'), now: col('now'), after: col('after'),
    life: (c.querySelector('.injlife') || {}).textContent || '', price: (c.querySelector('.injprice') || {}).dataset ? +(c.querySelector('.injprice') || { dataset: {} }).dataset.price : null }; };

async function run(b, profile) {
  const P = profile + ': ', errs = [];
  const ctx = await b.newContext(PROFILES[profile]);
  /* a fresh context is a fresh save: nothing to clear */
  const q = await ctx.newPage(); q.on('pageerror', e => errs.push('town: ' + e.message));
  await q.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html?tier=fortress&place=THE%20FORT');
  await q.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.order && BohemiaSettlement.order().indexOf('clinic') >= 0 && window.BohemiaCondition && window.BohemiaInjuryCard, null, { timeout: 40000 });
  /* the struck-down man, through the module's own entry point, the shape the fight's end row has */
  await q.evaluate((a) => { BohemiaCondition.afterFight([{ name: 'YOU', main: true, hp: 40, hpMax: 60, armH: 0, armHMax: 0, armB: 0, armBMax: 0 },
    { name: a.MAN, hp: 0, hpMax: 52, down: true, laidUpDays: a.DAYS, injury: { id: a.MARK, name: 'Missing Eye', days: a.DAYS }, armH: 0, armHMax: 0, armB: 0, armBMax: 0 }], { day: 1 });
    window.postMessage({ type: 'BOHEMIA_SETTLEMENT_OPEN', batteries: 400, arrival: false }, '*'); }, { MAN, MARK, DAYS });
  await q.waitForTimeout(1500);
  const tap = async (xy) => { if (PROFILES[profile].hasTouch) await q.touchscreen.tap(xy.x, xy.y); else await q.mouse.click(xy.x, xy.y); };
  const xy = await q.evaluate(() => BohemiaSettlement.where('clinic'));
  await tap(xy); await q.waitForTimeout(900);
  const c1 = await q.evaluate((MAN) => ({ wounded: BohemiaCondition.wounded().map(w => w.name), card: !!document.querySelector('.injc[data-man="' + MAN + '"]') }), MAN);
  ok(P + 'C1 the clinic knows he is hurt, from the company\'s own condition', c1.wounded.indexOf(MAN) >= 0 && c1.card, JSON.stringify(c1));
  const card = await q.evaluate(READ_CARD, '.injc[data-man="' + MAN + '"]');
  const fw = LI.freshNow(MARK, DAYS, DAYS), half = DAYS / 2, shown = Math.ceil(half), fh = LI.freshNow(MARK, half, DAYS);
  const nowOk = !!card && !!card.now && card.now.days === DAYS && card.now.chips.length === Object.keys(fw.effects).length && card.now.chips.every(c => c.down && c.icon);
  const afterOk = !!card && !!card.after && card.after.days === shown && card.after.chips.length === card.now.chips.length
    && card.after.chips.every((c, i) => Math.abs(c.value) <= Math.ceil(Math.abs(card.now.chips[i].value) / 2) && Math.abs(c.value) >= Math.floor(Math.abs(card.now.chips[i].value) / 2) && c.len <= card.now.chips[i].len);
  ok(P + 'C2 THE WHOLE TRADE: the wound\'s mark and word, a stat icon and a red DOWN arrow a cut, the days on a clock, the clinic\'s after beside it (days halved, every arrow halved), his for life untouched, the price',
    !!card && card.drop && card.clock && /GRAZED EYE SOCKET/.test(card.head) && nowOk && afterOk && /FOR LIFE: MISSING EYE/.test(card.life) && /cannot touch/.test(card.life) && card.price > 0,
    card ? 'now ' + JSON.stringify(card.now.chips.map(c => c.stat + c.value)) + ' ' + card.now.days + 'd -> after ' + JSON.stringify(card.after && card.after.chips.map(c => c.stat + c.value)) + ' ' + (card.after && card.after.days) + 'd; price ' + card.price : 'no card');
  /* C3 pay */
  const before = await q.evaluate(() => { const b = document.querySelector('.injc[data-man]'); return { bats: +document.body.innerText.match(/(\d+) BATTERIES/i)[1] }; });
  const bt = await q.evaluate((MAN) => { const e = document.querySelector('button[data-treat="' + MAN + '"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, MAN);
  if (bt) { await tap(bt); await q.waitForTimeout(900); }
  const after = await q.evaluate((MAN) => { const m = BohemiaCondition.get().men[MAN]; return { left: m.wound && m.wound.left, of: m.wound && m.wound.of, marks: m.marks, treated: m.wound && m.wound.treated, said: (document.getElementById('sbody') || {}).innerText || '' }; }, MAN);
  const bats1 = await q.evaluate(() => +((document.body.innerText.match(/(\d+) BATTERIES/i) || [0, -1])[1]));
  ok(P + 'C3 PAY (a real press on Treat): the price is paid, his wound\'s days left are exactly half (the clock rounds up) and its debuff half for them, his mark for life untouched',
    !!bt && after.left === half && after.of === DAYS && JSON.stringify(after.marks) === JSON.stringify([MARK]) && !!fh && JSON.stringify(LI.freshNow(MARK, after.left, after.of).effects) === JSON.stringify(fh.effects)
      && fh.effects.ranged_skill_pct === Math.round(fw.effects.ranged_skill_pct * half / DAYS) && bats1 === before.bats - card.price,
    'days ' + DAYS + ' -> ' + after.left + '; debuff ' + JSON.stringify(fw.effects) + ' -> ' + JSON.stringify(fh && fh.effects) + '; batteries ' + before.bats + ' -> ' + bats1 + ' (price ' + (card && card.price) + ')');
  /* C3b ONE HALVING (rule 241(b); EYES [eyes: the clinic twice]: on BUILD 10/26zq the treated card offered 'Treat DESI: 13 days to 7'
     for 26 more and the doc said 'DESI stays with me'): the sheet the press leaves says he walks out with you, shows him TREATED with
     his wound as it is now, and offers nothing more for him */
  const again = await q.evaluate((MAN) => { const c = document.querySelector('.injc[data-man="' + MAN + '"]'), sb = (document.getElementById('sbody') || {}).innerText || '';
    return { offer: !!document.querySelector('button[data-treat="' + MAN + '"]'), side: !!(c && c.querySelector('[data-side]')), kind: c && c.dataset.clinic, said: sb.slice(0, 400) }; }, MAN);
  ok(P + 'C3b ONE HALVING: the doc says he walks out with you; his card says TREATED, shows the wound as it is now, and no second Treat is offered',
    !again.offer && !again.side && again.kind === 'treated' && /walks out with you/.test(again.said) && /TREATED/.test(again.said) && !/stays with me/.test(again.said),
    JSON.stringify(again));
  /* C4 the crew card matches */
  const r = await ctx.newPage(); r.on('pageerror', e => errs.push('crew: ' + e.message));
  await r.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html');
  await r.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await r.waitForTimeout(500);
  const crew = await r.evaluate((a) => { const S = BohemiaRosterScreen.state; let i = S.crew.findIndex(m => BohemiaCondition.canon(m.name, m.main) === a.MAN);
    if (i < 0) { const m = S.crew.filter(x => !x.main)[0]; m.name = a.MAN; i = S.crew.indexOf(m); }
    BohemiaRosterScreen.open({ select: S.crew[i].name }); const c = document.querySelector('#card .hurtbox');
    return { i, head: c ? (c.querySelector('b') || {}).textContent : null, clinic: c ? (c.querySelector('.clinic') || {}).textContent : null }; }, { MAN });
  const ccard = await r.evaluate(READ_CARD, '#card .hurtbox .injc');
  ok(P + 'C4 THE CREW CARD MATCHES: the same days and the same halved arrows the clinic left, and that the clinic already cut it',
    !!ccard && crew.head === 'STRUCK DOWN, THE WOUND ' + shown + ' OF ' + DAYS + ' DAYS' && ccard.now.days === shown && JSON.stringify(ccard.now.chips.map(c => c.stat + c.value)) === JSON.stringify(card.after.chips.map(c => c.stat + c.value)) && /already cut the wound in half/.test(crew.clinic || ''),
    crew.head + ' / ' + JSON.stringify(ccard && ccard.now.chips.map(c => c.stat + c.value)) + ' / ' + crew.clinic);
  ok(P + 'C5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | ') || 'no errors');
  await ctx.close();
}

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  try { for (const p of ['phone_portrait', 'computer']) await run(b, p); }
  catch (e) { ok('the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  await b.close(); srv.close();
  console.log('\nTHE CLINIC HALVES BOTH GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

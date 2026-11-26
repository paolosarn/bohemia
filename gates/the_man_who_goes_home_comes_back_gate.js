#!/usr/bin/env node
/* THE MAN WHO GOES HOME COMES BACK (WORLD 15, 11/26; VAMILY rule 470(h), ask row 708; rule 482; rule 441).
   Paolo (hw03-04): 'make sure there's a limit, like is it gonna come back in a day or two days, three days'. WORDS THREE named it: a man
   who leaves through the road card 'the word from home' ('Go.', or his bedroll gone in the night) was let go for good.
   slices/bohemia_road_more.js __THE_MAN_WHO_GOES_HOME_COMES_BACK__: fx.leaves may carry back {days: [lo, hi], says}; he is let go as
   before, his record kept aside, and on the day he is due he is back where he was, his line on the phone's feed.
     STATIC
     D1 the card: both ways a man leaves through 'the word from home' carry back (1 to 3 days, a line), and its own words are unchanged
     D2 the module keeps him aside and gives him back (the marker, the apply passes back, a new game forgets)
     ON THE PAGE (demo and alpha, upright and sideways)
     M1 he goes: a man of his leaves through the card's own effect; he is out of the company (the hire lock's one truth), the count is
        one less, and he is kept aside with his day
     M2 not yet: a day short of it he is still away
     M3 he is back: on his day he is in the company again, the count as it was, his let-go undone, his line on the feed
     M4 a hired man comes back as he was: his hired row (his stats) back in the hired list
     M5 a man let go with no wait stays gone (the old way, five days on)
     M6 a new game forgets who was away
     M7 nothing threw
   Run: node gates/the_man_who_goes_home_comes_back_gate.js [static|demo|alpha|demo-up|demo-side|alpha-up|alpha-side] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 400) + ']' : '')); };

function statics() {
  console.log('\n-- static --');
  const ev = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_ROAD_EVENTS.json'), 'utf8')).events.filter(e => e.id === 'ev_the_word_from_home')[0];
  const go = ev && ev.opts[0].fx.leaves, night = ev && ev.opts[2].fx.chance && ev.opts[2].fx.chance.no.leaves;
  const good = (b) => !!b && Array.isArray(b.days) && b.days[0] >= 1 && b.days[1] <= 3 && b.days[0] <= b.days[1] && typeof b.says === 'string' && b.says.length > 10 && !/—/.test(b.says);
  ok('D1 the card: both ways he leaves carry a wait of 1 to 3 days and his line; the card\'s own words are as they were',
     !!ev && good(go && go.back) && good(night && night.back) && /walks west at first light/.test(ev.opts[0].fx.say) && /bedroll is gone/.test(ev.opts[2].fx.chance.no.say) && ev.draft === true,
     ev ? JSON.stringify([go && go.back, night && night.back]) : 'no card');
  const rm = fs.readFileSync(path.join(ROOT, 'slices', 'bohemia_road_more.js'), 'utf8');
  ok('D2 the module keeps him aside and gives him back, and a new game forgets', /__THE_MAN_WHO_GOES_HOME_COMES_BACK__/.test(rm) && /leaves\(fx\.leaves\.name, fx\.leaves\.back \|\| null\)/.test(rm) && /function comeBack\(/.test(rm) && /fogNewGame = function \(\) \{ putJ\(AWAY, \[\]\)/.test(rm));
}

async function page(alpha, profile) {
  const W = (alpha ? 'the alpha' : 'the demo') + ', ' + (profile === 'phone_landscape' ? 'sideways' : 'upright');
  console.log('\n-- ' + W + ' --');
  const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
  const d = await open(Object.assign({ profile }, alpha ? { alpha: true } : {}));
  const fr = d.fr, pg = d.page, errs = [];
  pg.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.BohemiaRoadMore && BohemiaRoadMore.comeBack && window.BohemiaHireLock && typeof DAY !== 'undefined' && DAY.day && typeof MODE !== 'undefined' && MODE === 'city'))) break; await pg.waitForTimeout(500); }
    try { await d.toMap(); } catch (e) {}
    const r = await fr.evaluate(() => {
      const RM = BohemiaRoadMore, HL = BohemiaHireLock, out = {}, day0 = DAY.day;
      const origin = (() => { try { return (typeof crewOriginNamed === 'function' && crewOriginNamed()) || null; } catch (e) { return null; } })();
      const inCo = (n) => HL.company(origin).some(m => HL.key(m.name) === HL.key(n));   /* the one truth, his starting crew handed in the way the screens hand it */
      const feedHas = (t) => { try { const F = window.BOHEMIA_FEED; const L = (F && (F.posts || F.list || F.items)) || null; if (Array.isArray(L)) return L.some(p => p && String(p.txt || '').indexOf(t) >= 0); return null; } catch (e) { return null; } };
      let posts = []; const F = window.BOHEMIA_FEED, push0 = F && F.push; if (F) F.push = function (p) { posts.push(p); return push0.apply(this, arguments); };
      /* M1 */
      const man = RM.men().filter(m => !m.hired)[0] || RM.men()[0]; if (!man) return { none: true };
      const c0 = crewCount(), say = 'GATE: {man} is back.';
      const res = RM.apply({ leaves: { name: man.name, back: { days: [2, 2], says: say } } }, {}, { got: [] });
      const away = (JSON.parse(localStorage.getItem('bohemia.roadmore.away.v1') || '[]') || []).filter(x => x.name === man.name)[0] || null;
      out.m1 = { name: man.name, got: res.got, gone: HL.isGone(man.name), inCo: inCo(man.name), c0, c1: crewCount(), away: away && { from: away.from, back: away.back }, day0 };
      /* M2 */
      DAY.day = day0 + 1; RM.comeBack(); out.m2 = { gone: HL.isGone(man.name), c: crewCount() };
      /* M3 */
      DAY.day = day0 + 2; const n3 = RM.comeBack();
      out.m3 = { n: n3, gone: HL.isGone(man.name), inCo: inCo(man.name), men: RM.men().some(m => m.name === man.name), c: crewCount(),
        walkedRoad: (JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]') || []).filter(x => x && x.dismissed && x.why === 'road' && HL.key(x.name) === HL.key(man.name)).length,
        post: posts.some(p => p && p.who === man.name && String(p.txt).indexOf(man.name + ' is back') >= 0) };
      /* M4: a hired man, his stats */
      const hired = JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || [], hire = { name: 'GATEHIRE ROADBACK', look: null, background: 'mechanic', stats: { hp: 61, melee: 47 }, hid: 'hgate01', day: day0 };
      hired.push(hire); localStorage.setItem('bohemia.hired.v1', JSON.stringify(hired));
      const inMen = RM.men().some(m => m.name === hire.name);
      RM.apply({ leaves: { name: hire.name, back: { days: [1, 1], says: '{man} is back.' } } }, {}, { got: [] });
      const outHired = !(JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []).some(x => x && x.name === hire.name);
      DAY.day = day0 + 3; RM.comeBack();
      const backRow = (JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []).filter(x => x && x.name === hire.name)[0] || null;
      out.m4 = { inMen, outHired, back: !!backRow, stats: backRow && backRow.stats, gone: HL.isGone(hire.name) };
      /* M5: no wait, gone for good */
      const other = RM.men().filter(m => m.name !== man.name && m.name !== hire.name)[0];
      if (other) { RM.apply({ leaves: { name: other.name } }, {}, { got: [] }); DAY.day = day0 + 8; RM.comeBack(); out.m5 = { name: other.name, gone: HL.isGone(other.name) }; }
      /* M6 */
      localStorage.setItem('bohemia.roadmore.away.v1', JSON.stringify([{ name: 'NOBODY', from: DAY.day, back: DAY.day + 2 }]));
      try { fogNewGame(false); } catch (e) {}
      out.m6 = { away: (JSON.parse(localStorage.getItem('bohemia.roadmore.away.v1') || '[]') || []).length };
      if (F) F.push = push0; DAY.day = day0;
      out.err = RM.err || null;
      return out;
    });
    if (r.none) { ok(W + ' a man of his to send home', false, 'no man'); return; }
    ok(W + ' M1 he goes: ' + r.m1.name + ' out of the company, the count ' + r.m1.c0 + ' to ' + r.m1.c1 + ', kept aside to day ' + (r.m1.away && r.m1.away.back),
       r.m1.gone && !r.m1.inCo && r.m1.c1 === r.m1.c0 - 1 && !!r.m1.away && r.m1.away.back === r.m1.day0 + 2 && r.m1.got.some(g => / AWAY$/.test(g)), JSON.stringify(r.m1));
    ok(W + ' M2 not yet: a day short of it he is still away', r.m2.gone && r.m2.c === r.m1.c1, JSON.stringify(r.m2));
    ok(W + ' M3 he is back: in the company, the count ' + r.m3.c + ', his let-go undone, his line on the feed', r.m3.n === 1 && !r.m3.gone && r.m3.inCo && r.m3.men && r.m3.c === r.m1.c0 && r.m3.walkedRoad === 0 && r.m3.post, JSON.stringify(r.m3));
    ok(W + ' M4 a hired man comes back as he was (his hired row, his stats)', r.m4.inMen && r.m4.outHired && r.m4.back && !r.m4.gone && r.m4.stats && r.m4.stats.hp === 61 && r.m4.stats.melee === 47, JSON.stringify(r.m4));
    ok(W + ' M5 a man let go with no wait stays gone', !!r.m5 && r.m5.gone, JSON.stringify(r.m5));
    ok(W + ' M6 a new game forgets who was away', r.m6.away === 0, JSON.stringify(r.m6));
    ok(W + ' M7 nothing threw', !errs.length && !r.err, errs.slice(0, 2).join(' | ') + (r.err ? ' ' + r.err : ''));
  } finally { await d.close(); }
}

(async () => {
  const only = process.argv[2];
  if (!only || only === 'static' || only === 'demo' || only === 'alpha') statics();
  if (only !== 'static') {
    for (const [alpha, prof] of [[false, 'phone_portrait'], [false, 'phone_landscape'], [true, 'phone_portrait'], [true, 'phone_landscape']]) {
      if ((only === 'demo' && alpha) || (only === 'alpha' && !alpha)) continue;
      const tag = (alpha ? 'alpha' : 'demo') + '-' + (prof === 'phone_landscape' ? 'side' : 'up');
      if (only && /-(up|side)$/.test(only) && only !== tag) continue;
      try { await page(alpha, prof); } catch (e) { ok((alpha ? 'the alpha ' : 'the demo ') + prof + ' ran', false, String(e.stack || e.message).slice(0, 300)); }
    }
  }
  console.log('\nTHE MAN WHO GOES HOME COMES BACK: ' + (fail ? 'RED' : 'GREEN') + '  ' + pass + '/' + fail);
  process.exit(fail ? 1 : 0);
})();

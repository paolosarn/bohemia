#!/usr/bin/env node
/* ============================================================================
   THE JOB'S STARS GATE (RUN 10/25, rule 146(b) as amended by (e), row [the job's stars]).

   PAOLO 10/24: 'even Battle Brothers has a tiered quest system, one, two or three... jobs should just have stars as well;
   ... make the stars smaller too.'

   On the demo, his phone: every job shows one to three stars from its real party against his company, the same rule as a
   party's plate (partySkulls on partyMath's count), on the phone and at the town's board, and never a skull.
     S1 the rule: for one, two and three skulls the stars are partySkulls(partyMath('job').count), each 1 to 3
     S2 the stars move with his company: a bigger crew makes the same job fewer or the same stars, never more
     S3 the phone's two posts carry those stars (data-stars and the UI's star, one mark each)
     S4 the town's board: every client's row carries the same stars in the UI's star and no skull glyph
     S5 nothing threw
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE JOB\'S STARS GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const d = await open({ profile: 'phone_portrait' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.waitForTimeout(5000);
  const r = await fr.evaluate(() => {
    const rule = [1, 2, 3].map(sk => { const n = partyMath('job', { skulls: sk }).count; return { sk, n, want: partySkulls(n), got: loopJobStars({ skulls: sk }) }; });
    const before = [1, 2, 3].map(sk => loopJobStars({ skulls: sk }));
    localStorage.setItem('bohemia.hired.v1', JSON.stringify([1, 2, 3, 4, 5, 6].map(i => ({ name: 'GATE ' + i, look: null }))));
    const after = [1, 2, 3].map(sk => loopJobStars({ skulls: sk }));
    localStorage.removeItem('bohemia.hired.v1');
    const posts = Array.from(document.querySelectorAll('#bmboard .fp.job')).map(e => ({ stars: +e.dataset.stars, marks: e.querySelectorAll('.bmstar').length, id: e.dataset.job }));
    const shown = (window.__PHONE_BOARD || {}).shown || [];
    return { rule, before, after, posts, shown };
  });
  ok('S1 the rule: a job\'s stars are its party against his company', r.rule.every(x => x.got === x.want && x.got >= 1 && x.got <= 3), r.rule.map(x => x.sk + ' skull ' + x.n + ' men ' + x.got + ' star').join(', '));
  ok('S2 a bigger company never makes a job more stars', r.after.every((v, i) => v <= r.before[i]) && r.after.some((v, i) => v < r.before[i]), r.before.join('') + ' -> ' + r.after.join('') + ' with six hired');
  ok('S3 the phone\'s posts carry those stars, one mark each', r.posts.length >= 1 && r.posts.every(p => p.stars >= 1 && p.stars <= 3 && p.marks === p.stars) && r.shown.every(s => s.stars === Math.max(1, Math.min(3, s.stars))),
     r.posts.map(p => p.id + ' ' + p.stars + '/' + p.marks).join(', '));
  /* the town's board */
  const t = await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 6); if (t) loopOpenTown(t); return t && t.name; });
  await page.waitForTimeout(4000);
  const sf = page.frames().find(f => /SETTLEMENT_SCREEN/.test(f.url()));
  let rows = [];
  if (sf) {
    const xy = await sf.evaluate(() => BohemiaSettlement.where('board'));
    if (xy) await page.touchscreen.tap(xy.x, xy.y);
    await page.waitForTimeout(1500);
    rows = await sf.evaluate(() => Array.from(document.querySelectorAll('.act.client')).map(e => { const s = e.querySelector('[data-job-stars]'); return { n: s ? +s.dataset.jobStars : 0, marks: e.querySelectorAll('.bmstar').length, skull: /☠/.test(e.textContent) }; }));
  }
  ok('S4 the town\'s board: the same stars in the UI\'s star, never a skull', rows.length >= 1 && rows.every(x => x.n >= 1 && x.n <= 3 && x.marks === x.n && !x.skull), t + ': ' + rows.map(x => x.n + '/' + x.marks + (x.skull ? ' SKULL' : '')).join(', '));
  ok('S5 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });

#!/usr/bin/env node
/* ============================================================================
   THE JOB'S STARS GATE (RUN 10/25, rule 146(b) as amended by (e), row [the job's stars]).

   PAOLO 10/24: 'even Battle Brothers has a tiered quest system, one, two or three... jobs should just have stars as well;
   ... make the stars smaller too.'

   On the demo, his phone: every job shows one to three stars from its real party against his company, the same rule as a
   party's plate (partySkulls on partyMath's count), on the phone and at the town's board, and never a skull.
     S1 the rule: UNTIL A JOB IS PLAYED its stars are its skulls (WORLD 10/25, rule 192(a)); once played they are the danger read
        (WORLD 10/26, rule 208: gates/the_job_tells_the_truth_gate.js holds those against 100 plays a job)
     S2 a bigger company keeps an unplayed job's stars and meets a bigger party under them (the party is sized from the skulls on him)
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
    /* WORLD 10/25 (rule 192(a), newest wins over 146(e)'s count rule): THE STARS ARE THE SKULLS; the party is sized from them on
       his company, so a bigger company meets a bigger party under the same stars */
    const rule = [1, 2, 3].map(sk => { const n = partyMath('job', { skulls: sk }).count; return { sk, n, want: sk, got: loopJobStars({ skulls: sk }) }; });
    const before = [1, 2, 3].map(sk => loopJobStars({ skulls: sk })), nBefore = [1, 2, 3].map(sk => partyMath('job', { skulls: sk }).count);
    localStorage.setItem('bohemia.hired.v1', JSON.stringify([1, 2, 3, 4, 5, 6].map(i => ({ name: 'GATE ' + i, look: null }))));
    const after = [1, 2, 3].map(sk => loopJobStars({ skulls: sk })), nAfter = [1, 2, 3].map(sk => partyMath('job', { skulls: sk }).count);
    localStorage.removeItem('bohemia.hired.v1');
    const posts = Array.from(document.querySelectorAll('#bmboard .fp.job')).map(e => ({ stars: +e.dataset.stars, marks: e.querySelectorAll('.bmstar').length, id: e.dataset.job }));
    const shown = (window.__PHONE_BOARD || {}).shown || [];
    return { rule, before, after, nBefore, nAfter, posts, shown };
  });
  ok('S1 the rule: an unplayed job\'s stars are its skulls (rule 192(a); a played job\'s are its read, rule 208)', r.rule.every(x => x.got === x.want && x.got >= 1 && x.got <= 3), r.rule.map(x => x.sk + ' skull ' + x.n + ' men ' + x.got + ' star').join(', '));
  ok('S2 a bigger company keeps the stars and meets a bigger party under them', r.after.every((v, i) => v === r.before[i]) && r.nAfter.every((v, i) => v >= r.nBefore[i]) && r.nAfter.some((v, i) => v > r.nBefore[i]),
    r.before.join('') + ' -> ' + r.after.join('') + ' stars; ' + r.nBefore.join('/') + ' -> ' + r.nAfter.join('/') + ' men with six hired');
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

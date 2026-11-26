#!/usr/bin/env node
// JOBS TWO 11/26 -- ASK ROW 737: THE JOB BOARD FITS FIVE JOBS ON ITS SHEET (rule 402, rule 441). The demo and the alpha, a phone held
// upright (390 x 844) and on its side (844 x 390), A NEW CREW, the valley K7QM9X: the company walks into Caravans, a finger opens the
// BOARD, then the board is crowded to four jobs (the most a board ever deals, records/target/BOHEMIA_BOARD_SHELF.json counts.max) and to
// five the way THE FOURTEEN EYES F533 crowds it (the longest client names, a PAID THERE badge
// on each), but here with the game's own pay lines (stars, batteries, the trip's time). Measured before (this build's card rules taken
// out of the page) and now:
//   the sheet: its content against its height (past it = the board scrolls), the density step the page needed
//   every card: the pay on the client's line or on a row of its own, every job, client and pay whole inside its card
// Writes <out>/board_fits_five.json and a picture per phone (before | now) when --shots is given.
// node tools/bohemia_jobs_the_board_fits_five_on_the_phone.js [--out dir] [--shots dir] [--only demo_up,alpha_side]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_26')), SHOTS = arg('--shots', ''), ONLY = (arg('--only', '') || '').split(',').filter(Boolean);
fs.mkdirSync(OUTD, { recursive: true }); if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const SRC = fs.readFileSync(path.join(ROOT, 'gates/the_fourteen_eyes_found_gate.js'), 'utf8');
const CROWD = SRC.slice(SRC.indexOf('const CROWD = ') + 'const CROWD = '.length, SRC.indexOf('const CARDS = ')).trim().replace(/;$/, '');   /* F533's own crowd, word for word */

/* the sheet and every card, read in the town's page */
const READ = () => { const sh = document.getElementById('sheet'), R = e => e.getBoundingClientRect(), shr = R(sh), cards = [], bad = [];
  [...document.querySelectorAll('#sbody .act.client')].forEach((b, i) => { const br = R(b), em = b.querySelector(':scope > em'), cn = b.querySelector('.cn'), t = b.querySelector('.cl > span');
    let own = null; if (em && cn) { const rs = cn.getClientRects(), last = rs[rs.length - 1], er = R(em); own = !last || er.top >= last.bottom - 2 ? 'own row' : er.left > last.right - 1 ? 'on the client\'s line' : 'beside the job'; }
    [['job', t], ['client', cn], ['pay', em]].forEach(([k, e]) => { if (!e) return; const r = R(e); if (r.bottom > br.bottom + 0.5 || r.right > br.right + 0.5 || r.left < br.left - 0.5) bad.push((i + 1) + ' ' + k + ' cut'); });
    if (br.bottom > shr.bottom + 0.5) bad.push((i + 1) + ' card past the sheet');
    cards.push({ h: Math.round(br.height), pay: em ? String(em.textContent || '').replace(/\s+/g, ' ').trim() : null, where: own }); });
  return { content: sh.scrollHeight, height: sh.clientHeight, scrolls: sh.scrollHeight > sh.clientHeight + 1, step: (sh.className.match(/ns-d\d/g) || []).pop() || 'none', cards, bad }; };
/* the 'before': this build's card rules taken out of the page's own sheet */
const BEFORE = () => { let n = 0; const strip = (list) => { for (let i = list.cssRules.length - 1; i >= 0; i--) { const r = list.cssRules[i];
    if (r.cssRules && !r.selectorText) { strip(r); continue; } if (/#sheet\.ns-d1 #sbody \.act\.client/.test(r.selectorText || '')) { list.deleteRule(i); n++; } } };
  [...document.styleSheets].forEach(s => { try { strip(s); } catch (e) {} }); window.dispatchEvent(new Event('resize')); return n; };

(async () => {
  const rows = [], errs = [];
  for (const alpha of [false, true]) for (const shape of ['phone_portrait', 'phone_landscape']) {
    const tag = (alpha ? 'alpha' : 'demo') + '_' + (shape === 'phone_portrait' ? 'up' : 'side'); if (ONLY.length && ONLY.indexOf(tag) < 0) continue;
    const d = await drive.open({ profile: shape, alpha, fog: false, keepCards: true, engage: true,
      arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
    const fr = d.fr, page = d.page; page.on('pageerror', e => errs.push(tag + ': ' + String(e).slice(0, 160)));
    const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
    const row = { tag };
    try {
      await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
      await page.waitForTimeout(4000);
      const tn = 'Caravans';
      await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
      await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 90000);
      if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
      const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
      await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 30000);
      await page.waitForTimeout(2500);
      let open = false;
      for (let k = 0; k < 4 && !open; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
        if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
        open = await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 10000); }
      row.opened = open; await page.waitForTimeout(2500);
      row.asIs = await sf.evaluate(READ);
      row.crowd4 = await sf.evaluate('(' + CROWD.replace('.length < 5)', '.length < 4)') + ')()'); await page.waitForTimeout(2000);
      row.now4 = await sf.evaluate(READ);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, tag + '_now4.png') });
      row.crowd = await sf.evaluate('(' + CROWD + ')()'); await page.waitForTimeout(2000);
      row.now = await sf.evaluate(READ);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, tag + '_now.png') });
      row.stripped = await sf.evaluate(BEFORE); await page.waitForTimeout(2000);
      row.before = await sf.evaluate(READ);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, tag + '_before.png') });
      await sf.evaluate(() => { const cs = document.querySelectorAll('#sbody .act.client'); cs[cs.length - 1].remove(); window.dispatchEvent(new Event('resize')); }); await page.waitForTimeout(2000);
      row.before4 = await sf.evaluate(READ);
    } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
    rows.push(row);
    const f = (r) => r ? r.content + ' in ' + r.height + (r.scrolls ? ' SCROLLS' : ' fits') + ' (' + r.step + '), pay ' + r.cards.map(c => c.where === 'own row' ? 'R' : c.where === 'beside the job' ? 'J' : 'C').join('') + (r.bad.length ? ' CUT ' + r.bad.slice(0, 3).join(', ') : ' whole') : '-';
    console.log(tag.padEnd(11) + ' the board as dealt: ' + f(row.asIs) + '\n            four jobs (the game\'s most), before: ' + f(row.before4) + '\n            four jobs (the game\'s most), now:    ' + f(row.now4) + '\n            five jobs (F533\'s), before: ' + f(row.before) + '\n            five jobs (F533\'s), now:    ' + f(row.now) + (row.err ? '\n            ERR ' + row.err : ''));
    await d.close();
  }
  fs.writeFileSync(path.join(OUTD, 'board_fits_five.json'), JSON.stringify({ at: new Date().toISOString(), rows, errs }, null, 1));
  console.log('(pay: C on the client\'s line, J beside the job, R a row of its own)' + (errs.length ? '\nerrors: ' + errs.slice(0, 3).join(' | ') : ''));
})();

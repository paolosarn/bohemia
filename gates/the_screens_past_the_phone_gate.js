/* THE SCREENS PAST THE PHONE  (UI [the screens past the phone], 10/22/26; rule 62's four screen classes, rule 74)

   THE ROW: on a tablet and a computer the company screen and the settlement's sheet were the phone's column stretched or
   centred with empty sides. Measured before: the company screen on a tablet was one column 2,068 points tall, the man's
   page 931 points down; a stall's price rows on a computer ran 1,416 points across. Re-laid the Battle Brothers way, by
   media rule in the materials (slices/bohemia_ui_materials.js, ROSTER_CSS and SETTLE_CSS), every class through the one
   driver, on the two screens' own files:
     - THE COMPANY SCREEN from 700 wide: the line and who wears what on the left, his page and the bag beside it on the
       right (the screen's own laptop rule above 1100); upright on a phone it stays one column
     - THE SETTLEMENT'S SHEET from 700 wide: a window at most 1,040 wide and centred, the one you talk to on the left, what
       he sells and your bag on the right, slots a thumb and no bigger than 72, the close X over nothing; upright on a
       phone it stays the drawer
     - nothing wider than the glass on any class
     - two planted defects caught: the company screen back to one column, the sheet stretched back to the glass
   node gates/the_screens_past_the_phone_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE SCREENS PAST THE PHONE: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const WIDE = ['tablet', 'computer', 'phone_landscape'];

/* RE-AIMED UI 10/25 ([the company screen, Battle Brothers simple], rule 172): the screen is him (#man) and the stash (#stash);
   from 700 wide the stash stands BESIDE him and the line runs along the bottom (Battle Brothers' shape); upright on a phone
   the stash is under him */
const ROSTER = () => { const b = id => { const r = document.getElementById(id).getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; };
  const L = b('man'), R = b('stash');
  return { beside: R.l >= L.r - 1 && Math.abs(R.t - L.t) < 40, under: R.t >= L.b - 1, page: document.documentElement.scrollWidth <= innerWidth + 1, L, R }; };
const SHEET = () => { const g = e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height }; };
  const sh = g(document.getElementById('sheet')), who = document.querySelector('#sbody > .who'), right = [...document.querySelectorAll('#sbody > :not(.who)')].map(g).filter(x => x.w > 0);
  const slots = [...document.querySelectorAll('#sheet .slot')].map(g), x = g(document.getElementById('close'));
  const under = [...document.querySelectorAll('#sheet .act,#sheet .slot')].map(g).filter(a => Math.min(a.r, x.r) - Math.max(a.l, x.l) > 0.5 && Math.min(a.b, x.b) - Math.max(a.t, x.t) > 0.5).length;
  const W = innerWidth;
  return { sh, W, who: who ? g(who) : null, right, slots: slots.map(s => Math.round(s.w)), under, page: document.documentElement.scrollWidth <= W + 1,
    window: sh.w <= 1040.5 && Math.abs(sh.l - (W - sh.r)) <= 1.5, side: !!who && right.length > 0 && right.every(a => a.l >= g(who).r - 0.5),
    stacked: !!who && right.length > 0 && right.every(a => a.t >= g(who).b - 0.5), thumb: slots.length > 0 && slots.every(s => s.w >= 44 && s.w <= 72.5) }; };

async function roster(profile) {
  const d = await open({ file: 'BOHEMIA_ROSTER_SCREEN.html', bare: true, profile });
  try {
    await d.page.waitForTimeout(2500);
    const m = await d.page.evaluate('(' + ROSTER.toString() + ')()');
    if (WIDE.indexOf(profile) >= 0) {
      ok('the company screen, ' + profile + ': his page and the bag BESIDE the line, not under it', m.beside, 'left ' + Math.round(m.L.l) + '..' + Math.round(m.L.r) + ', right ' + Math.round(m.R.l) + '..' + Math.round(m.R.r) + ' at ' + Math.round(m.R.t));
      if (profile === 'tablet') {
        const back = await d.page.evaluate(chk => { const s = document.createElement('style'); s.textContent = 'html body #cols{display:block!important}'; document.head.appendChild(s);
          const r = eval('(' + chk + ')')(); s.remove(); return r.beside; }, ROSTER.toString());
        ok('PLANTED: the company screen back to one column is caught', back === false);
      }
    } else ok('the company screen, ' + profile + ': upright on a phone it stays one column (his page under the line)', m.under);
    ok('  nothing wider than the glass', m.page);
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 1).join(''));
  } finally { await d.close(); }
}
async function sheet(profile) {
  const d = await open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true, profile });
  try {
    await d.page.waitForTimeout(2500);
    const at = await d.page.evaluate(() => { const B = window.BohemiaSettlement, o = B.order(), k = o.indexOf('armourer') >= 0 ? 'armourer' : o.find(x => /stall|arms|smith/.test(x)); const w = k && B.where(k); return w && [w.x, w.y, k]; });
    if (!at) { ok('the settlement opened a shop on ' + profile, false); return; }
    if (profile === 'computer') await d.page.mouse.click(at[0], at[1]); else await d.page.touchscreen.tap(at[0], at[1]);
    await d.page.waitForTimeout(900);
    const m = await d.page.evaluate('(' + SHEET.toString() + ')()');
    if (WIDE.indexOf(profile) >= 0) {
      ok('the ' + at[2] + '\'s sheet, ' + profile + ': a window at most 1,040 wide, centred', m.window, Math.round(m.sh.l) + '..' + Math.round(m.sh.r) + ' of ' + m.W);
      ok('  the one you talk to on the left, what he sells and your bag on the right', m.side, m.who && Math.round(m.who.r) + ' | ' + m.right.map(a => Math.round(a.l)).join(' '));
      ok('  every slot a thumb and no bigger than 72', m.thumb, [...new Set(m.slots)].join(' '));
      if (profile === 'computer') {
        const back = await d.page.evaluate(chk => { const s = document.createElement('style'); s.textContent = 'html body #sheet{left:0!important;right:0!important;width:auto!important;margin-left:0!important}'; document.head.appendChild(s);
          const r = eval('(' + chk + ')')(); s.remove(); return r.window; }, SHEET.toString());
        ok('PLANTED: the sheet stretched back to the glass is caught', back === false);
      }
    } else ok('the ' + at[2] + '\'s sheet, ' + profile + ': upright on a phone it stays the drawer, the words above the wares', m.stacked && m.sh.w >= m.W - 1);
    ok('  the close X sits over no row and no slot', m.under === 0, m.under + ' under it');
    ok('  nothing wider than the glass', m.page);
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 1).join(''));
  } finally { await d.close(); }
}

(async () => {
  for (const p of ['tablet', 'computer', 'phone_landscape', 'phone_portrait']) { console.log('\n' + p); await roster(p); await sheet(p); }
  done();
})().catch(e => { console.error(e); process.exit(1); });

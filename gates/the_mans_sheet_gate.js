#!/usr/bin/env node
/* THE MAN'S SHEET (FIGHT SCREEN 11/14/26; VAMILY rule 450(a), ask row 621; rule 449: the fight's unit card is this lane's).
   PAOLO 11/14: 'The card bro, the combat card is UGLY AS SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN FINAL SHIT.'
   MEASURED BEFORE (records/BOHEMIA_FIGHT_SCREEN_THE_TEARDOWN_OF_THE_CARDS_11_14_26.md): a flat pale page with no face, eight bare
   numbers, skill names with no word on what they do; on its side 640 points tall on a 390 point screen.
   THE LAW NOW: a man's sheet says who he is (his face, his name, whose man), how he is (the eight bars each with its word, his
   armour, his nerve), what he hits with (his weapon and its one line) and what he can do (his skills, each telling what it does),
   on the house's dark board; it is never off the glass, never cut and never under 11 points, upright and on its side, whatever
   the man.
   THE LEGS (the fight's own page, a phone upright 390 x 844 and on its side 844 x 390; three men: his man with three skills,
   his man with sixteen, a man of theirs with a lesson):
     M1  IT FITS: the sheet and every piece of it inside the glass, nothing under another piece of it, both ways, all three men
     M2  IT READS: no type under 11 points, no line cut, the ground dark (not the pale page)
     M3  WHO: a drawn face (its colours counted), his name, level and trade; a man of theirs carries the one thing to know
     M4  HOW HE IS: eight bars, each with its word beside it, the word clear of the bar; UI THREE's rows untouched (the numbers
         the bars say are the man's)
     M5  WHAT HE HITS WITH: his weapon's name and its one plain line; its damage a lit bar with no digits; the whole sheet
         carries 14 numbers at most (rule 224(c): fewer numbers, more icons)
     M6  WHAT HE CAN DO: every skill is on it; a finger on a skill reads what it does and the sheet stays; a finger elsewhere
         puts it away
     planted: the fitting taken out (M1 red on its side)
   Run: node gates/the_mans_sheet_gate.js      (about forty seconds) */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
(async () => {
  let chromium = null; try { chromium = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })().chromium; } catch (e) {}
  if (!chromium) { check(false, 'M1', 'no browser on this box'); return done(); }
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.css': 'text/css', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
  let planted = false;
  const srv = http.createServer((q, r) => { const rel = decodeURIComponent(q.url.split('?')[0]), f = path.join(ROOT, rel);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    let body = fs.readFileSync(f);
    if (planted && /BOHEMIA_FIGHT\.html$/.test(rel)) { const s = String(body), t = s.replace("while (d.scrollHeight > avail + 1 && step < steps.length) d.classList.add(steps[step++]);", ";").replace("d.style.maxHeight = avail + 'px';", ''); if (t === s) throw new Error('the plant did not take'); body = Buffer.from(t); }
    r.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(body); });
  await new Promise(res => srv.listen(0, '127.0.0.1', res)); const port = srv.address().port;
  const b = await chromium.launch(), errs = [];
  const OPTS = { why: 'road:1', deploy: false, teach: false, met: 3, district: 'suburb', cell: { gx: 40, gy: 40 }, party: { count: 4, days: 40, difficulty: 1, band: ['watch_captain', 'brigand_thug', 'house_shield', 'brigand_marksman'], rolled: true, faction: 'brigands' },
    company: [{ background: 'militia', level: 2, gear: { main: 'snub_revolver' } }, { name: 'DESI', background: 'militia', level: 3, gear: { main: 'handgonne' }, perks: ['fast_adaptation', 'colossus', 'recover'] }, { name: 'RAUL', background: 'militia', level: 9, gear: { main: 'shortsword', off: 'wooden_shield' } }] };
  const run = async (vp) => { const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: true, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
    await p.addInitScript(o => { window.FIGHT_OPTS = o; }, OPTS); await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_FIGHT.html');
    await p.waitForFunction(() => typeof UI !== 'undefined' && !!UI.board && !!UI.t0, null, { timeout: 45000 }); await p.waitForTimeout(8200);
    await p.evaluate(() => { const r = FIGHT.S.units.find(u => u.name === 'RAUL'); if (r) r.perks = DB.perkNames.rows.map(x => x.id).slice(0, 16); });
    const out = {};
    for (const who of ['DESI', 'RAUL', 'theirs']) out[who] = await p.evaluate((who) => { const S = FIGHT.S, v = who === 'theirs' ? S.units.find(u => u.side === 'them' && u.kind === 'watch_captain') : S.units.find(u => u.name === who);
      UI.sheetSig = null; UI.sheetPerk = null; UI.drawer = false; drawer(v); const d = document.getElementById('drawer'), dr = d.getBoundingClientRect(), vis = e => { const r = e.getBoundingClientRect(), st = getComputedStyle(e); return r.width > 1 && r.height > 1 && st.display !== 'none' && st.visibility !== 'hidden'; };
      const all = [...d.querySelectorAll('*')].filter(vis), txt = all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
      const lum = c => { const m = /rgba?\(([^)]+)\)/.exec(c).slice(1)[0].split(',').map(Number), f = x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }; return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); };
      const cv = d.querySelector('.sh-face'), g = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data, seen = {}; for (let i = 0; i < g.length; i += 16) seen[(g[i] >> 3) + ',' + (g[i + 1] >> 3) + ',' + (g[i + 2] >> 3)] = 1;
      const rows = [...d.querySelectorAll('.sh-slip .bst-row')].map(r => { const ic = r.querySelector('.bst-ic'), bar = r.querySelector('.bst-bar'), word = getComputedStyle(ic, '::after').content.replace(/^"|"$/g, ''), cvs = document.createElement('canvas').getContext('2d'); cvs.font = '11px BohemiaCasing, ui-monospace, monospace';
        const wEnd = ic.getBoundingClientRect().left + 26 + cvs.measureText(word.toUpperCase()).width * 1.08; return { stat: r.dataset.stat, n: +r.dataset.n, word: word, clear: !!bar && bar.getBoundingClientRect().left >= Math.min(wEnd, ic.getBoundingClientRect().right) - 1 && ic.getBoundingClientRect().width >= 100, barW: bar ? Math.round(bar.getBoundingClientRect().width) : 0 }; });
      const pieces = ['.sh-head', '.sh-slip', '.sh-w', '.sh-perks', '.sh-read'].map(s => d.querySelector(s)).filter(e => e && vis(e)).map(e => e.getBoundingClientRect());
      let lap = 0; for (let i = 0; i < pieces.length; i++) for (let j = i + 1; j < pieces.length; j++) { const a = pieces[i], c = pieces[j]; if (Math.min(a.right, c.right) - Math.max(a.left, c.left) > 2 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 2) lap++; }
      return { name: v.name, fit: UI.sheetFit, err: UI.sheetErr || null, inside: dr.top >= -1 && dr.left >= -1 && dr.right <= innerWidth + 1 && dr.bottom <= innerHeight + 1, off: all.filter(e => { const r = e.getBoundingClientRect(); return r.bottom > innerHeight + 1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > dr.bottom + 1; }).length, lap: lap,
        small: txt.map(e => parseFloat(getComputedStyle(e).fontSize)).filter(x => x < 11).length, cut: txt.filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').length, ground: +lum(getComputedStyle(d).backgroundColor).toFixed(3),
        face: Object.keys(seen).length, head: (d.querySelector('.sh-name') || {}).textContent + ' | ' + (d.querySelector('.sh-sub') || {}).textContent.trim(), tell: (d.querySelector('.sh-tell') || {}).textContent || '', rows: rows, real: { hp: v.hp, ms: v.mskill, rs: v.rskill, ini: v.initiative },
        weapon: [(d.querySelector('.sh-w b') || {}).textContent || '', (d.querySelector('.sh-w>span') || {}).textContent || ''],
        dmg: (function () { const c = d.querySelector('.sh-w i.cbar.dmg'), l = c && c.firstElementChild; if (!c || !l) return null; const a = c.getBoundingClientRect(), q = l.getBoundingClientRect(); return { bar: Math.round(a.width), lit: Math.round(q.width), inside: q.left >= a.left - 1 && q.right <= a.right + 1, digits: /\d/.test(c.textContent), lo: +c.dataset.lo, hi: +c.dataset.hi, real: [v.weapon.damage_min, v.weapon.damage_max] }; })(),
        digits: (d.textContent.match(/\d+/g) || []).length, perks: d.querySelectorAll('.sh-perks .p').length, has: v.perks.length, lesson: !!(DB.newEnemies.rows.find(x => x.id === v.kind) || {}).lesson }; }, who);
    /* a finger on a skill, then a finger elsewhere */
    await p.evaluate(() => { UI.sheetSig = null; UI.sheetPerk = null; drawer(FIGHT.S.units.find(u => u.name === 'RAUL')); });
    const at = await p.evaluate(() => { const e = document.querySelectorAll('#drawer .sh-perks .p')[3], r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, id: e.dataset.perk, line: (DB.perkNames.rows.find(x => x.id === e.dataset.perk) || {}).skin || '' }; });
    await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(250);
    out.read = await p.evaluate(() => ({ up: getComputedStyle(document.getElementById('drawer')).display !== 'none', text: (document.querySelector('#drawer .sh-read') || {}).textContent || '', perk: UI.sheetPerk })); out.read.want = at;
    await p.waitForTimeout(800); const hd = await p.evaluate(() => { const r = document.querySelector('#drawer .sh-name').getBoundingClientRect(); return [r.x + 4, r.y + 4]; }); await p.touchscreen.tap(hd[0], hd[1]); await p.waitForTimeout(200);
    out.away = await p.evaluate(() => getComputedStyle(document.getElementById('drawer')).display === 'none');
    await ctx.close(); return out; };
  try {
    const UP = await run({ width: 390, height: 844 }), SIDE = await run({ width: 844, height: 390 }), all = [['upright', UP], ['on its side', SIDE]], men = ['DESI', 'RAUL', 'theirs'];
    const each = (fn) => all.every(([w, R]) => men.every(m => fn(R[m], w, m))), list = (fn) => all.map(([w, R]) => w + ': ' + men.map(m => fn(R[m])).join(', ')).join('; ');
    check(each(x => x.fit && x.fit.fits && x.inside && x.off === 0 && x.lap === 0 && !x.err), 'M1', 'IT FITS: ' + list(x => x.name + ' ' + (x.fit ? x.fit.box[2] + ' x ' + x.fit.box[3] + ' of ' + x.fit.avail + ' (step ' + x.fit.step + ')' : 'NO FIT') + (x.off ? ' ' + x.off + ' OFF' : '') + (x.lap ? ' ' + x.lap + ' LAP' : '')));
    check(each(x => x.small === 0 && x.cut === 0 && x.ground < 0.1), 'M2', 'IT READS: ' + list(x => x.name + ' ' + x.small + ' under 11 pt, ' + x.cut + ' cut, ground ' + x.ground));
    check(each(x => x.face >= 12 && /\S/.test(x.head) && /LEVEL \d+ · \S/.test(x.head) && (!x.lesson || x.tell.length > 20)), 'M3', 'WHO: ' + list(x => x.head + ' (face ' + x.face + ' colours)' + (x.tell ? ' "' + x.tell.slice(0, 40) + '..."' : '')));
    check(each(x => x.rows.length === 8 && x.rows.every(r => r.word.length > 3 && r.clear && r.barW >= 24) && x.rows.find(r => r.stat === 'hp').n === x.real.hp && x.rows.find(r => r.stat === 'initiative').n === x.real.ini), 'M4',
      'HOW HE IS: ' + list(x => x.name + ' ' + x.rows.length + ' bars with words (' + x.rows.filter(r => r.clear).length + ' clear of the bar, the narrowest bar ' + Math.min.apply(null, x.rows.map(r => r.barW)) + ' pt)') + ' | ' + UP.DESI.rows.map(r => r.word).join(', '));
    check(each(x => x.weapon[0].length > 2 && x.weapon[1].length > 12 && x.dmg && x.dmg.bar >= 80 && x.dmg.lit >= 4 && x.dmg.inside && !x.dmg.digits && x.dmg.lo === x.dmg.real[0] && x.dmg.hi === x.dmg.real[1] && x.digits <= 14), 'M5',
      'WHAT HE HITS WITH: ' + men.map(m => UP[m].name + ': ' + UP[m].weapon[0] + ', "' + UP[m].weapon[1] + '", its damage a bar lit ' + (UP[m].dmg ? UP[m].dmg.lit + ' of ' + UP[m].dmg.bar + ' pt, no digits' : 'MISSING') + '; ' + UP[m].digits + ' numbers on the whole sheet').join(' | ') + ' (rule 224(c): fewer numbers, the before was 15)');
    check(each(x => x.perks === x.has) && all.every(([w, R]) => R.read.up && R.read.perk === R.read.want.id && R.read.want.line.length > 8 && R.read.text.indexOf(R.read.want.line) >= 0 && R.away) && !errs.length, 'M6',
      'WHAT HE CAN DO: every skill on the sheet (' + list(x => x.perks + ' of ' + x.has) + '); a finger on a skill reads it and the sheet stays (' + all.map(([w, R]) => w + ': "' + R.read.text.slice(0, 60) + '"').join('; ') + '); a finger elsewhere puts it away; page errors ' + errs.length);
    planted = true; const PS = await run({ width: 844, height: 390 });
    check(men.some(m => !(PS[m].fit && PS[m].fit.fits) || !PS[m].inside || PS[m].off > 0), 'M1 planted', 'the fitting taken out: on its side ' + men.filter(m => !(PS[m].fit && PS[m].fit.fits) || !PS[m].inside || PS[m].off > 0).map(m => PS[m].name + ' needs ' + (PS[m].fit ? PS[m].fit.need + ' of ' + PS[m].fit.avail : '?')).join(', ') + ' and is off the glass');
  } catch (e) { check(false, 'M1', 'the page leg threw: ' + String(e && e.stack || e).slice(0, 300)); }
  await b.close(); srv.close(); done();
})();
function done() { console.log('\nTHE MAN\'S SHEET: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }

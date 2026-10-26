/* THE FACE SHOWS THE WOUND GATE (PORTRAIT [the face shows the wound], VAMILY rule 234(c) and (g), 10/26/26).
   PAOLO 10/26: 'let's get creative with how it's gonna affect their portrait... to be able to visually tell that like either an
   eye patch or a serious brain shit or like blood somewhere like a band-aid there like the ear cut off there like the nose'.
   The row's gate, its own words: every injury row has a mark, an injured man wears it on portrait and thumb, a healed fresh
   wound's band-aid is gone.
     F1 EVERY INJURY ROW HAS A MARK: each of records/target/bb/injuries.json's rows names a mark in
        records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json, every mark it names exists and says what it is; the fresh wound's
        two (the blood, the band-aid) are marks too
     F2 ONE TABLE: the engine's inlined copy (engine/bohemia_wound_faces.js) equals the data file, row for row and in its order;
        the one face painter (engine/bohemia_crew_faces.js) puts the marks over every face it paints, rest and every mouth
     F3 THE MARKS ARE MADE ON HIS OWN FACE: YOU and every man of the starting company (ours.json people_looks.crew) has his atlas,
        made from his own model (the index names his own portrait.json); every mark has a patch at 128 and at 64 on every face
        rendered, or, where his own gear covers it (a collar over the surgeon's scar), the surgeon's tag in his ear stands in
        for it (engine COVERED), so a hurt man in the company never reads whole; at most 1 in 100 of every man's marks are
        covered, and a mark with no tag either at most 2 in 1,000; nothing failed; the runner's base matches the face he wears
        (mean under 2 levels for the company and 95 of every 100 men, and no man past 16, where only the 1-pixel ring round a
        mark could show it)
     F4 THE STAGES (CAMP's reading, engine/bohemia_long_injury.js look() when it is on the page): struck down today, the mark for
        life with the blood and the band-aid; past half his days, the band-aid alone; healed, neither; the mark for life at all three
     F5 *** ON THE REAL SURFACE: THE CREW SCREEN *** (slices/BOHEMIA_ROSTER_SCREEN.html in Chromium, CAMP's book seeded with a man
        struck down): his face canvas wears his marks (dataset.wounds), the pixels moved where the marks are, at the portrait's
        128 and at a 64 thumb drawn by the same painter, and his talking mouths keep them
     F6 A HEALED FRESH WOUND'S BAND-AID IS GONE: his days run out; the band-aid's pixels are his own face's again, the eye patch stays
     F7 A WHOLE MAN IS UNTOUCHED: a man who carries nothing is drawn exactly as he was, and nothing threw
   node gates/the_face_shows_the_wound_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const ROOT = path.join(__dirname, '..');
const J = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };

const D = J('records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json');
const INJ = J('records/target/bb/injuries.json').rows;

console.log('F1 every injury row has a mark');
const noMark = INJ.filter(r => !D.rows[r.id] || !D.marks[D.rows[r.id].mark]);
ok('all ' + INJ.length + ' rows (' + INJ.filter(r => r.kind === 'permanent').length + ' for life, ' + INJ.filter(r => r.kind === 'temporary').length + ' that heal) name a mark that exists', !noMark.length, noMark.map(r => r.id).join(', ') || 'none missing');
ok('every mark says what it is, how long it stays and its layer', Object.keys(D.marks).every(k => D.marks[k].what && D.marks[k].name && /^(life|heals|fresh)$/.test(D.marks[k].life) && typeof D.marks[k].layer === 'number'), Object.keys(D.marks).length + ' marks');
ok('the fresh wound is the blood and the band-aid, both marks, and its stages end in neither', D.fresh.join() === 'blood,bandaid' && D.fresh.every(k => D.marks[k] && D.marks[k].life === 'fresh') && D.stages[D.stages.length - 1].show.length === 0);
const lifeRows = INJ.filter(r => r.kind === 'permanent').map(r => D.rows[r.id].mark);
ok('his own list (rule 234(c)): the lost eye an eye patch, brain damage stitches, the ear cut off, the nose gone, a broken arm a sling',
  D.rows.missing_eye.mark === 'eye_patch' && D.rows.brain_damage.mark === 'skull_stitches' && D.rows.missing_ear.mark === 'ear_gone' && D.rows.missing_nose.mark === 'nose_gone' && D.rows.broken_arm.mark === 'sling', lifeRows.join(' '));

console.log('F2 one table, one painter');
const W = require(path.join(ROOT, 'engine/bohemia_wound_faces.js'));
const rm = {}; Object.keys(D.rows).forEach(k => { rm[k] = D.rows[k].mark; });
ok('the engine inlines the data file\'s rows exactly', JSON.stringify(Object.keys(W.ROW_MARK).sort().map(k => [k, W.ROW_MARK[k]])) === JSON.stringify(Object.keys(rm).sort().map(k => [k, rm[k]])));
ok('and its drawing order', JSON.stringify(W.ORDER) === JSON.stringify(D.order), W.ORDER.length + ' layers');
const CF = fs.readFileSync(path.join(ROOT, 'engine/bohemia_crew_faces.js'), 'utf8');
ok('the one face painter puts the marks over every face it paints (rest and every mouth)', /function paint\(x, im, size, look, key(, dy, life)?\)[\s\S]{0,400}BohemiaWoundFaces[\s\S]{0,240}\.over\(x, look/.test(CF) &&
  /paint\(x, im, size, look, 'rest'\)/.test(CF) && /paint\(x, im, size, look, frames\[key\] \? key : 'rest'\)/.test(CF));

console.log('F3 the marks are made on his own face');
const ours = J('records/target/bb/ours.json'); const pl = (ours.people_looks.value || ours.people_looks).crew;
const want = Array.from(new Set(['you'].concat(pl)));
const OUTD = 'records/target/portrait/wounds/';
const made = fs.readdirSync(path.join(ROOT, OUTD)).filter(f => f.endsWith('.json') && !f.startsWith('BOHEMIA_')).map(f => f.slice(0, -5));
const missing = want.filter(l => made.indexOf(l) < 0);
ok('YOU and the whole starting company have their marks (' + want.length + ' faces)', !missing.length, missing.join(', ') || 'all ' + want.length);
let holes = [], covered = [], bare = [], failed = [], drift = [], driftAll = [], notHis = [], cells = 0;
const crewable = l => l === 'you' || /^person_/.test(l);   // the cast looks and the gangs' speakers carry the breathing frames only
const COVER = 'tag';
made.forEach(l => {
  const X = J(OUTD + l + '.json');
  if (!crewable(l)) return;
  if (!fs.existsSync(path.join(ROOT, X.atlas))) holes.push(l + ' no atlas');
  const own = l === 'you' ? 'records/target/portrait/rig/crew/you/portrait.json' : 'records/target/character/barber/' + l + '/portrait.json';   // his own
  if (X.base.portrait !== own) notHis.push(l);
  const has = (m, n) => { const q = X.rows[m] && X.rows[m].rest && X.rows[m].rest[n]; return !!(q && (q.add || q.cut)); };
  Object.keys(D.marks).forEach(m => { ['128', '64'].forEach(n => {
    cells++;
    if (has(m, n)) return;
    if (m !== COVER && has(COVER, n)) covered.push(l + ':' + m + '@' + n); else bare.push(l + ':' + m + '@' + n);
    if (want.indexOf(l) >= 0 && !(m !== COVER && has(COVER, n))) holes.push(l + ':' + m + '@' + n);
  }); });
  (X.failed || []).forEach(m => failed.push(l + ':' + m));
  const d = X.base.drift_from_this_run && X.base.drift_from_this_run['128'];
  driftAll.push(d ? d.mean : 99);
  if (!d || !(d.mean < 16) || (want.indexOf(l) >= 0 && !(d.mean < 2))) drift.push(l + ' ' + (d ? d.mean : 'unmeasured'));
});
const under2 = driftAll.filter(v => v < 2).length;
ok('every face\'s marks come from his own model (the index names his own portrait)', !notHis.length && made.length > 0, notHis.join(', ') || made.length + ' faces');
ok('YOU and the company: every mark a patch at 128 and at 64, or the tag where his gear covers it', !holes.length, holes.slice(0, 12).join(', ') || want.length + ' faces' + (covered.filter(c => want.indexOf(c.split(':')[0]) >= 0).length ? ', covered: ' + covered.filter(c => want.indexOf(c.split(':')[0]) >= 0).join(', ') : ''));
ok('every man: at most 1 in 100 marks covered by his gear (the tag stands in)', covered.length <= cells / 100, covered.length + ' of ' + cells + ': ' + covered.slice(0, 8).join(', ') + (covered.length > 8 ? ' and ' + (covered.length - 8) + ' more' : ''));
ok('and at most 2 in 1,000 with no tag either', bare.length <= cells * 2 / 1000, bare.length + ' of ' + cells + (bare.length ? ': ' + bare.join(', ') : ''));
ok('no mark failed to build', !failed.length, failed.slice(0, 10).join(', ') || 'none');
ok('the runner\'s base is the face he wears (the company under 2 levels, 95 in 100 men under 2, none past 16)', !drift.length && under2 >= driftAll.length * 0.95, under2 + ' of ' + driftAll.length + ' under 2, worst ' + Math.max.apply(null, driftAll) + (drift.length ? '; ' + drift.join(', ') : ''));

console.log('F4 the stages');
const L = (() => { try { return require(path.join(ROOT, 'engine/bohemia_long_injury.js')); } catch (e) { return null; } })();
global.BohemiaLongInjury = L;
const at = (left, of) => (L && L.look) ? W.marksFor({ marks: ['missing_eye'], wound: { mark: 'missing_eye', left: left, of: of } }) :
  W.marksFor({ marks: ['missing_eye'], fresh: left / of > 0.5 ? 'blood' : left > 0 ? 'bandage' : null });
const s0 = at(36, 36), s1 = at(12, 36), s2 = at(0, 36);
ok('struck down today: the eye patch, the blood, the band-aid' + (L && L.look ? ' (CAMP\'s look())' : ' (the data\'s own stages; CAMP\'s look() not on main yet)'), s0.join() === 'eye_patch,blood,bandaid', s0.join(' '));
ok('past half his days: the eye patch and the band-aid, the blood gone', s1.join() === 'eye_patch,bandaid', s1.join(' '));
ok('healed: the eye patch alone, the band-aid gone', s2.join() === 'eye_patch', s2.join(' '));
ok('a temporary injury shows its mark while it heals and none after', W.marksFor({ injuries: [{ id: 'broken_nose', left: 2 }] }).join() === 'nose_tape' && W.marksFor({ injuries: [{ id: 'broken_nose', left: 0 }] }).length === 0);

console.log('F5 to F7 on the real surface: the crew screen');
(async () => {
  let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ok('playwright', false, e.message); return finish(); }
  const who = made.filter(l => l !== 'you').filter(l => pl.indexOf(l) >= 0)[0] || made.filter(l => l !== 'you')[0];
  if (!who) { ok('a crew face with marks to walk', false); return finish(); }
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); const f = path.join(ROOT, u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(f).toLowerCase();
    res.writeHead(200, { 'Content-Type': ({ '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp' })[ext] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const book = (left) => JSON.stringify({ men: { YOU: { shown: 'YOU', look: 'you', main: true, hpMax: 60, lostHp: 0 },
    GRIZ: { shown: 'GRIZ', look: who, hpMax: 55, lostHp: 54, marks: ['missing_eye'], wound: { mark: 'missing_eye', left: left, of: 36, day: 1 } } }, dead: [] });
  await page.addInitScript((b) => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('bohemia.condition.v1', b); sessionStorage.setItem('seeded', '1'); } } catch (e) {} }, book(36));
  await page.goto(base + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await page.waitForFunction(() => window.BohemiaCrewFaces && window.BohemiaWoundFaces, null, { timeout: 20000 }).catch(() => {});
  await page.evaluate(() => window.BohemiaWoundFaces.still(true));   // the faces breathe (rule 246): held still to compare pixels
  const shot = (look, size, key, plain) => page.evaluate(async ([look, size, key, plain]) => {
    const F = window.BohemiaCrewFaces, W = window.BohemiaWoundFaces;
    const c = document.createElement('canvas'); c.width = c.height = size; document.body.appendChild(c);
    const x = c.getContext('2d');
    const saved = plain ? W.injuryOf(look) : undefined; if (plain) W.set(look, { marks: [], fresh: null });
    if (key === 'rest') F.draw(x, look, size); else { const im = new Image(); im.src = F.src(look, key, size); await im.decode().catch(() => {}); x.drawImage(im, 0, 0, size, size); W.over(x, look, key, size, null); }
    for (let i = 0; i < 60; i++) { await new Promise(r => setTimeout(r, 100)); if (plain || (c.dataset.wounds && W.has(look) && i > 4)) break; }
    if (key !== 'rest' && !plain) W.over(x, look, key, size, null);
    if (plain) W.set(look, null);
    const d = x.getImageData(0, 0, size, size).data; c.remove();
    return { wounds: c.dataset.wounds || '', shown: c.dataset.shown || '', px: Array.from(d) };
  }, [look, size, key, !!plain]);
  const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) + Math.abs(a[i + 3] - b[i + 3]) > 24) n++; return n; };
  const X = J(OUTD + who + '.json');
  const region = (mark, n) => { const q = X.rows[mark] && X.rows[mark].rest && X.rows[mark].rest[n]; return q && q.add; };
  const inR = (r, size) => (i) => { const p = i / 4, x = p % size, y = Math.floor(p / size); return x >= r[4] && x < r[4] + r[2] && y >= r[5] && y < r[5] + r[3]; };
  const cnt = (a, b, r, size) => { if (!r) return -1; let n = 0; const f = inR(r, size); for (let i = 0; i < a.length; i += 4) if (f(i) && Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) + Math.abs(a[i + 3] - b[i + 3]) > 24) n++; return n; };
  for (const n of [128, 64]) {
    const plain = await shot(who, n, 'rest', true), hurt = await shot(who, n, 'rest', false);
    ok('F5 ' + who + ' struck down today wears the eye patch, the blood and the band-aid at ' + n + (n === 64 ? ' (the thumb)' : ' (the portrait)'), hurt.wounds === 'eye_patch blood bandaid', hurt.wounds);
    const ce = cnt(plain.px, hurt.px, region('eye_patch', String(n)), n), cb = cnt(plain.px, hurt.px, region('bandaid', String(n)), n);
    ok('F5 and the pixels moved where the eye patch and the band-aid are (' + n + ')', ce > (n === 128 ? 20 : 6) && cb > (n === 128 ? 10 : 3), 'eye patch ' + ce + ' px, band-aid ' + cb + ' px, whole face ' + diff(plain.px, hurt.px));
  }
  const pA = await shot(who, 128, 'A', true), hA = await shot(who, 128, 'A', false);
  ok('F5 his talking mouth keeps the marks (the A mouth)', /eye_patch/.test(hA.wounds) && cnt(pA.px, hA.px, region('eye_patch', '128'), 128) > 20, hA.wounds);
  // F6: his days run out
  await page.evaluate((b) => localStorage.setItem('bohemia.condition.v1', b), book(0));
  const plain = await shot(who, 128, 'rest', true), healed = await shot(who, 128, 'rest', false);
  ok('F6 healed: the band-aid and the blood are gone, the eye patch stays', healed.wounds === 'eye_patch', healed.wounds);
  /* the band-aid's own pixels (its patch's opaque pixels in the atlas, less any the eye patch also covers): his face again */
  const own = await page.evaluate(async ([look]) => {
    const J = await (await fetch('../records/target/portrait/wounds/' + look + '.json')).json();
    const im = new Image(); im.src = '../' + J.atlas; await im.decode();
    const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d');
    const put = (q, col) => { if (!q) return; x.fillStyle = col; const t = document.createElement('canvas'); t.width = q[2]; t.height = q[3];
      const tx = t.getContext('2d'); tx.drawImage(im, q[0], q[1], q[2], q[3], 0, 0, q[2], q[3]); x.drawImage(t, q[4], q[5]); };
    const b = J.rows.bandaid && J.rows.bandaid.rest['128'], e = J.rows.eye_patch && J.rows.eye_patch.rest['128'];
    const mask = (q) => { x.clearRect(0, 0, 128, 128); put(q && q.add); return Array.from(x.getImageData(0, 0, 128, 128).data).filter((v, i) => i % 4 === 3).map(a => a > 0); };
    const mb = mask(b), me = mask(e);
    return mb.map((v, i) => v && !me[i]);
  }, [who]);
  let changed = 0, owned = 0;
  own.forEach((v, p) => { if (!v) return; owned++; const i = p * 4; if (Math.abs(plain.px[i] - healed.px[i]) + Math.abs(plain.px[i + 1] - healed.px[i + 1]) + Math.abs(plain.px[i + 2] - healed.px[i + 2]) + Math.abs(plain.px[i + 3] - healed.px[i + 3]) > 3) changed++; });
  const ce = cnt(plain.px, healed.px, region('eye_patch', '128'), 128);
  ok('F6 where the band-aid was, his own face again (pixel for pixel), the eye patch still on him', owned > 20 && changed === 0 && ce > 20, 'the band-aid\'s ' + owned + ' own pixels: ' + changed + ' differ from his face; eye patch ' + ce + ' px');
  // F5 the crew screen's own book (before CAMP's [struck down] puts the marks in its book): the same man, the same marks
  await page.evaluate(([look]) => { localStorage.setItem('bohemia.condition.v1', JSON.stringify({ men: { GRIZ: { shown: 'GRIZ', look: look, hpMax: 55, lostHp: 0 } }, dead: [] }));
    localStorage.setItem('bohemia.climb.v1', JSON.stringify({ GRIZ: { xp: 0, level: 1, mark: { id: 'missing_nose', name: 'Missing Nose' }, hurt: { days: 10, of: 36 } } })); }, [who]);
  const viaClimb = await shot(who, 128, 'rest', false);
  ok('F5 read from the crew screen\'s own book too: the nose gone, the band-aid (his days past half)', viaClimb.wounds === 'nose_gone bandaid', viaClimb.wounds);
  await page.evaluate(() => localStorage.removeItem('bohemia.climb.v1'));
  // F5 a mark his own gear covers: the surgeon's tag in his ear stands in for it, so he never reads whole
  const cov = covered.map(c => c.split(':')).filter(c => /@128$/.test(c[1])).sort((a, b) => (want.indexOf(b[0]) >= 0) - (want.indexOf(a[0]) >= 0))[0] || null;   // a man of the company first
  if (cov) {
    const cl = cov[0], cm = cov[1].split('@')[0], row = Object.keys(D.rows).find(k => D.rows[k].mark === cm && INJ.some(r => r.id === k && r.kind === 'permanent')) || Object.keys(D.rows).find(k => D.rows[k].mark === cm);
    const CX = J(OUTD + cl + '.json'), tq = CX.rows.tag && CX.rows.tag.rest && CX.rows.tag.rest['128'];
    const cp = await shot(cl, 128, 'rest', true);
    await page.evaluate(([l, r]) => window.BohemiaWoundFaces.set(l, { marks: [r], fresh: null }), [cl, row]);
    const ch = await shot(cl, 128, 'rest', false);
    await page.evaluate(([l]) => window.BohemiaWoundFaces.set(l, null), [cl]);
    let tn = 0; if (tq && tq.add) { const f = inR(tq.add, 128); for (let i = 0; i < cp.px.length; i += 4) if (f(i) && Math.abs(cp.px[i] - ch.px[i]) + Math.abs(cp.px[i + 1] - ch.px[i + 1]) + Math.abs(cp.px[i + 2] - ch.px[i + 2]) + Math.abs(cp.px[i + 3] - ch.px[i + 3]) > 24) tn++; }
    ok('F5 ' + cl + ' carries ' + row + ' under his gear (' + cm + ' covered): the tag in his ear shows instead', ch.wounds === cm && ch.shown === 'tag' && tn > 4, 'wounds "' + ch.wounds + '", shown "' + ch.shown + '", tag ' + tn + ' px');
  }
  // F7: a man who carries nothing
  const yp = await shot('you', 128, 'rest', true), yw = await shot('you', 128, 'rest', false);
  ok('F7 a whole man is drawn exactly as he was', yw.wounds === '' && diff(yp.px, yw.px) === 0, 'wounds "' + yw.wounds + '", ' + diff(yp.px, yw.px) + ' px');
  ok('F7 nothing threw', !errs.length, errs.slice(0, 3).join(' | ') || 'no page errors');
  await browser.close(); server.close();
  finish();
})().catch(e => { ok('the walk ran', false, e.stack); finish(); });
function finish() { console.log('\nTHE FACE SHOWS THE WOUND: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); }

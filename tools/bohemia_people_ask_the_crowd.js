#!/usr/bin/env node
/* BOHEMIA -- ASK THE CROWD, PROVEN ON THE REAL SCREEN (PEOPLE, 10/19/26, row [ask the crowd]).
 *
 * Opens the real settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html over a local server, the way Pages serves
 * it) at every one of the 26 places and plays the row's whole story with a finger:
 *   1. DAY, FIRST VISIT: taps every person standing in the crowd. Each must be SOMEBODY ON THE STREET with a
 *      'Who are you?' under them (a stranger never shows a name before you ask). Asks every one but the last;
 *      the answer must be the one roll for that place and spot, said in their own mouth, the name reading as the
 *      face they wear.
 *   2. NIGHT, SECOND VISIT (the crowd halves): taps them again. The same spot wears the same look, a person you
 *      asked is named over their mouth with no question left, a person you did not ask is still a stranger.
 *   3. MARKET DAY, THIRD VISIT (the crowd grows by six): the same again, and the new people are strangers.
 *   4. A NEW SESSION (the page reloaded, nothing kept but what the screen saved): the people you asked still are.
 * It also reads every crowd person's face against the skin measurement (records/people/THE_FACE_IS_THE_BODYS.json,
 * written by tools/bohemia_people_skin_measure.py) for rule 120(d), and cuts the VOTE sheet: four phone shots of one
 * person in HENDERSON, from stranger to name to the next visit at night.
 * Writes records/people/ASK_THE_CROWD.json and slices/vote/PEOPLE_ASK_THE_CROWD_10_19.webp.
 *
 *   node tools/bohemia_people_ask_the_crowd.js
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const N = require(path.join(REPO, 'engine/bohemia_names.js'));
const PLACES = JSON.parse(fs.readFileSync(path.join(REPO, 'banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json'), 'utf8')).places;
const SKIN = JSON.parse(fs.readFileSync(path.join(REPO, 'records/people/THE_FACE_IS_THE_BODYS.json'), 'utf8'));
const OUT_JSON = path.join(REPO, 'records/people/ASK_THE_CROWD.json');
const OUT_PNG = path.join(REPO, 'slices/vote/PEOPLE_ASK_THE_CROWD_10_19.webp');   /* a phone loads it: webp, not a 3 MB png */
const SHEET_PLACE = 'HENDERSON';
const PORT = 8700 + Math.floor(Math.random() * 200);
const POST_COUNT = { camp: 2, town: 4, fortress: 6 };   /* the screen's own, no situation moving the post */
const POST_LOOKS = ['longcoat', 'barearms', 'pack', 'skirt', 'widebrim', 'cape', 'apron', 'poncho', 'bedroll', 'shorts', 'satchel', 'shortcoat'];
function seedOf(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

let srv = null;
(async () => {
  srv = cp.spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  let p = await ctx.newPage();
  const errs = []; const watch = pg => pg.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  watch(p);
  const url = 'http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html';

  async function openAt(pl, o) {
    if (!p.url().startsWith(url)) await p.goto(url + '?place=' + encodeURIComponent(pl.name) + '&tier=' + pl.tier);
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length, { timeout: 30000 });
    await p.evaluate(a => BohemiaSettlement.open({ place: { name: a.pl.name, tier: a.pl.tier }, traits: a.o.traits || [], night: !!a.o.night }), { pl, o });
    await p.waitForTimeout(250);
  }
  const crowd = () => p.evaluate(() => BohemiaSettlement.folk().filter(q => q.crowd).map(q => ({ slot: q.slot, look: q.look, x: q.x, y: q.y })));
  const sheet = () => p.evaluate(() => {
    const nm = document.querySelector('.say .nm'), line = document.querySelector('.say p');
    const ask = [...document.querySelectorAll('.acts .act span')].some(s => s.textContent === 'Who are you?');
    const st = BohemiaSettlement.state;
    return { open: st.open, slot: st.person ? st.person.slot : null, nm: nm ? nm.textContent : null, line: line ? line.textContent : null, ask };
  });
  async function shut() { await p.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(100); }
  /* a finger on the person: the picture is panned to the stall the crowd stands by, then the figure is tried from
     the hips up until the screen opens THIS person (a building's tap spot beats the crowd, as the screen rules) */
  /* every point of the glass where the screen's own personAt() answers THIS person (it gives the nearest the eye,
     so a person a nearer one covers may have none); tried in turn until the sheet opens on them, because a
     building's tap spot still wins where the two overlap */
  async function tapPerson(slot) {
    await p.evaluate(() => { const k = BohemiaSettlement.order().indexOf('stall') >= 0 ? 'stall' : 'hall'; BohemiaSettlement.where(k); });
    const pts = await p.evaluate(slot => {
      const q = BohemiaSettlement.folk().filter(z => z.crowd && z.slot === slot)[0], v = BohemiaSettlement._view(), sc = BohemiaSettlement.scale();
      const r = document.getElementById('scene').getBoundingClientRect(); if (!q) return [];
      const cx = v.ox + q.x * v.s, fy = v.oy + q.y * v.s, h = sc.person * v.s, out = [];
      for (const f of [0.3, 0.45, 0.2, 0.6, 0.1, 0.75]) for (let dx = 0; dx <= 24; dx += 2) for (const sg of [1, -1]) {
        const x = cx + sg * dx, y = fy - h * f;
        if (x < 2 || x > r.width - 2 || y < 2 || y > r.height - 2) continue;
        const hit = BohemiaSettlement.personAt(x, y);
        if (hit && hit.crowd && hit.slot === slot) out.push({ x: r.left + x, y: r.top + y });
      }
      return out;
    }, slot);
    for (const pt of pts.slice(0, 8)) {
      await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(200);
      const s = await sheet();
      if (s.open === 'person' && s.slot === slot) return true;
      await shut();
    }
    return false;
  }
  async function pressAsk() {
    const el = await p.$$('.acts .act');
    for (const e of el) { if ((await e.textContent()).indexOf('Who are you?') === 0) { await e.click(); await p.waitForTimeout(250); return true; } }
    return false;
  }
  const rollFor = (pl, q) => N.roll('crowd:' + pl.name + ':' + q.slot, { sex: N.faceReads(q.look) });
  const faceBand = look => { const r = SKIN.looks[look] || {}; const f = r.portrait || r.sheetface; return f ? f.band : null; };
  const bodyBand = look => { const r = SKIN.looks[look] || {}; return r.body ? r.body.band : null; };

  const people = [], visits = [], unreachable = [], keepers = [];
  let sheetSlot = null;   /* the first person in HENDERSON a finger reaches and asks: the sheet follows them */
  const shots = [];
  async function shot(caption) {
    const el = await p.$('#sheet');
    const full = await p.screenshot({ type: 'png' });
    shots.push({ caption, png: full.toString('base64') });
  }
  for (const pl of PLACES) {
    /* 1. day, first visit */
    await openAt(pl, {});
    const day = await crowd();
    (await p.evaluate(() => BohemiaSettlement.folk().filter(q => q.keeper).map(q => ({ k: q.k, look: q.look })))).forEach(q => {
      if (q.k === 'hall' || q.k === 'board') return;   /* the elder is a title; the board speaks QUESTS' written clients */
      const n = N.roll('keeper:' + pl.name + ':' + q.k, { sex: N.faceReads(q.look) });
      keepers.push({ place: pl.name, k: q.k, look: q.look, name: n.full, heritage: n.heritage, faceBand: faceBand(q.look) }); });
    for (let i = 0; i < day.length; i++) {
      const q = day[i], n = rollFor(pl, q);
      const rec = { place: pl.name, tier: pl.tier, slot: q.slot, look: q.look, roll: n.full, heritage: n.heritage, sex: n.sex,
        faceSex: N.faceReads(q.look), skin: n.skin, faceBand: faceBand(q.look), bodyBand: bodyBand(q.look), asked: false };
      if (!(await tapPerson(q.slot))) { unreachable.push(pl.name + ' #' + q.slot); rec.reached = false; people.push(rec); continue; }
      rec.reached = true;
      const s0 = await sheet();
      rec.before = { nm: s0.nm, ask: s0.ask };
      const onSheet = pl.name === SHEET_PLACE && sheetSlot === null && i < day.length - 1;
      if (onSheet) { sheetSlot = q.slot; await shot('A STRANGER. You tap somebody in the crowd.'); }
      if (i < day.length - 1) {
        await pressAsk();
        const s1 = await sheet();
        rec.asked = true; rec.after = { nm: s1.nm, line: s1.line, ask: s1.ask };
        if (onSheet) await shot('YOU ASK. They tell you, in their own words.');
      }
      await shut();
      people.push(rec);
    }
    /* 2. night, 3. market day */
    for (const v of [{ name: 'night', o: { night: true } }, { name: 'market day', o: { traits: ['market_day'] } }]) {
      await openAt(pl, v.o);
      for (const q of await crowd()) {
        const was = people.filter(r => r.place === pl.name && r.slot === q.slot)[0] || null;
        const row = { place: pl.name, visit: v.name, slot: q.slot, look: q.look, sameLook: was ? was.look === q.look : null, asked: !!(was && was.asked) };
        if (!(await tapPerson(q.slot))) { row.reached = false; visits.push(row); continue; }
        row.reached = true;
        const s = await sheet(); row.nm = s.nm; row.ask = s.ask;
        row.expect = row.asked ? rollFor(pl, q).full.toUpperCase() : 'SOMEBODY ON THE STREET';
        if (pl.name === SHEET_PLACE && q.slot === sheetSlot && v.name === 'night') await shot('NEXT TIME, AT NIGHT. Same spot, same person, and the name is theirs.');
        if (pl.name === SHEET_PLACE && v.name === 'market day' && q.slot >= day.length && !shots.some(z => /NEVER ASKED/.test(z.caption))) await shot('NEVER ASKED. A new face on market day is still a stranger.');
        await shut(); visits.push(row);
      }
    }
  }
  /* 4. a new session: the page reloaded, only the screen's own save kept */
  await p.close(); p = await ctx.newPage(); watch(p);
  const reload = [];
  for (const pl of PLACES) {
    await openAt(pl, {});
    for (const q of await crowd()) {
      const was = people.filter(r => r.place === pl.name && r.slot === q.slot)[0];
      if (!was || !was.reached) continue;
      if (!(await tapPerson(q.slot))) continue;
      const s = await sheet(); reload.push({ place: pl.name, slot: q.slot, asked: was.asked, nm: s.nm, ask: s.ask, expect: was.asked ? was.roll.toUpperCase() : 'SOMEBODY ON THE STREET' });
      await shut();
    }
  }
  await b.close(); srv.kill(); srv = null;

  /* the numbers */
  const reached = people.filter(r => r.reached), asked = reached.filter(r => r.asked);
  const strangerFirst = reached.filter(r => r.before.nm === 'SOMEBODY ON THE STREET' && r.before.ask).length;
  const answered = asked.filter(r => r.after.nm === r.roll.toUpperCase() && r.after.line.indexOf(r.roll) >= 0 && !r.after.ask).length;
  const readsFace = asked.filter(r => !r.faceSex || r.sex === r.faceSex).length;
  const vr = visits.filter(r => r.reached);
  const visitRight = vr.filter(r => r.nm === r.expect && r.ask === !r.asked && r.sameLook !== false).length;
  const sameLook = visits.filter(r => r.sameLook !== null);
  const relRight = reload.filter(r => r.nm === r.expect && r.ask === !r.asked).length;
  const skinFace = asked.filter(r => r.faceBand), skinOk = skinFace.filter(r => N.skinAgrees(r.heritage, r.faceBand));
  const bodyFace = reached.filter(r => r.faceBand && r.bodyBand), bodyOk = bodyFace.filter(r => r.faceBand === r.bodyBand);
  /* rule 120(d) over every named person the screens show beside a face: the man at the post (the screen's own key and
     look, the week the game starts), the keepers, the people you asked */
  const post = [];
  PLACES.forEach(pl => { const key = pl.name + ':0'; for (let i = 0; i < POST_COUNT[pl.tier]; i++) {
    const look = 'cast_' + POST_LOOKS[seedOf(key + ':look:' + i) % 12], n = N.roll('post:' + key + ':' + i, { sex: N.faceReads(look) });
    post.push({ place: pl.name, slot: i, look, name: n.full, heritage: n.heritage, faceBand: faceBand(look) }); } });
  const agree = L => L.filter(r => r.faceBand && N.skinAgrees(r.heritage, r.faceBand)).length + ' of ' + L.filter(r => r.faceBand).length;
  const byLook = {};
  post.concat(keepers, asked.map(r => ({ look: r.look, name: r.roll, heritage: r.heritage, faceBand: r.faceBand }))).forEach(r => {
    const b = byLook[r.look] = byLook[r.look] || { faceBand: r.faceBand, bodyBand: bodyBand(r.look), named: 0, disagree: 0, heritages: {} };
    b.named++; b.heritages[r.heritage] = (b.heritages[r.heritage] || 0) + 1; if (r.faceBand && !N.skinAgrees(r.heritage, r.faceBand)) b.disagree++; });
  const out = {
    made: '10/19/26', lane: 'people', row: '[ask the crowd] WHO-ARE-YOU-ON-THE-STREET', draft: true,
    measured: {
      places: PLACES.length, crowd_people: people.length, reached: reached.length, unreachable,
      stranger_first: strangerFirst, asked: asked.length, answered_with_the_roll: answered, name_reads_as_face_sex: readsFace,
      later_visits: vr.length, later_visits_right: visitRight, later_same_look: sameLook.filter(r => r.sameLook).length + ' of ' + sameLook.length,
      new_session: reload.length, new_session_right: relRight,
      different_names: new Set(asked.map(r => r.roll)).size,
      hispanic_reading: asked.filter(r => N.readsHispanic(r.roll)).length,
      skin_name_agrees_with_face: skinOk.length + ' of ' + skinFace.length,
      body_agrees_with_face: bodyOk.length + ' of ' + bodyFace.length,
      name_agrees_with_face_skin: { post: agree(post), keepers: agree(keepers), crowd_asked: agree(asked) },
      page_errors: errs.length, errors: errs.slice(0, 5)
    },
    people, visits, reload, keepers, post, by_look: byLook,
    sheet: { place: SHEET_PLACE, captions: shots.map(s => s.caption) }
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1) + '\n');

  /* the VOTE sheet: the four shots side by side, each with its caption, at the phone's own 2x */
  if (shots.length) {
    const html = '<!doctype html><meta charset=utf-8><body style="margin:0;background:#16110c;font:600 22px ui-monospace,Menlo,monospace;color:#e9dcc4">' +
      '<div style="display:flex;gap:18px;padding:22px">' + shots.map(s =>
        '<div style="width:390px"><div style="height:84px;line-height:1.3">' + s.caption + '</div><img style="width:390px;border:2px solid #3b3026" src="data:image/png;base64,' + s.png + '"></div>').join('') +
      '</div></body>';
    const b2 = await chromium.launch();
    const pg = await b2.newPage({ viewport: { width: 22 + shots.length * 408 + 4, height: 1000 }, deviceScaleFactor: 2 });
    await pg.setContent(html); await pg.waitForTimeout(300);
    const h = await pg.evaluate(() => document.body.scrollHeight);
    await pg.setViewportSize({ width: 22 + shots.length * 408 + 4, height: h });
    const tmp = OUT_PNG.replace(/\.webp$/, '.tmp.png');
    await pg.screenshot({ path: tmp, fullPage: true });
    await b2.close();
    cp.execFileSync('python3', ['-c', 'import sys; from PIL import Image; Image.open(sys.argv[1]).save(sys.argv[2], quality=86, method=6)', tmp, OUT_PNG]);
    fs.unlinkSync(tmp);
  }
  console.log(JSON.stringify(out.measured, null, 1));
  console.log('sheet: ' + shots.length + ' shots -> ' + path.relative(REPO, OUT_PNG));
})().catch(e => { console.error(e); if (srv) srv.kill(); process.exit(1); });

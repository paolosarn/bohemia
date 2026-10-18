#!/usr/bin/env node
/* BOHEMIA -- THE NAMES WIRED IN, PROVEN ON THE REAL SCREEN (PEOPLE, 10/18/26, row [the names wired in]).
 *
 * Opens the real settlement screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html over a local server, the way Pages
 * serves it) at every one of the 26 places, the week the game starts on, with no situation moving the post, and:
 *   1. taps the hall and reads every recruit's card: the name on it and the face the slot drew;
 *   2. taps every keeper's building and reads the name over his mouth, beside the face the place drew for him;
 *   3. counts: the name reads as the face, the five backgrounds and the Hispanic share at the post, how many
 *      different keepers stand in the valley (before: the same nine names in all 26 places);
 *   4. cuts the VOTE sheet from the screen's own hire cards: twelve recruits (a fortress's six, a town's four, a
 *      camp's two), each card as the screen draws it with PORTRAIT's fresh portrait, and under it the one-word name
 *      the old list gave that same slot (the old sixteen are frozen in the names mix bank).
 * Writes records/people/THE_NAMES_WIRED_IN.json (the numbers and the twelve) and
 * slices/vote/PEOPLE_THE_NAMES_WIRED_IN_10_18.png (the sheet, at 2x a phone's points).
 *
 *   node tools/bohemia_people_names_wired_in.js
 */
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const N = require(path.join(REPO, 'engine/bohemia_names.js'));
const PLACES = JSON.parse(fs.readFileSync(path.join(REPO, 'banks/BOHEMIA_WHO_LIVES_WHERE_10_17_26.json'), 'utf8')).places;
const OLD = JSON.parse(fs.readFileSync(path.join(REPO, 'banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json'), 'utf8')).the_post_names.list;
const OUT_JSON = path.join(REPO, 'records/people/THE_NAMES_WIRED_IN.json');
const OUT_PNG = path.join(REPO, 'slices/vote/PEOPLE_THE_NAMES_WIRED_IN_10_18.png');
const SHEET_PLACES = ['THE STRIP (Mob)', 'HENDERSON', 'LAKE MEAD MARINA'];
const PORT = 8700 + Math.floor(Math.random() * 200);

function seedOf(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

(async () => {
  const srv = cp.spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const url = 'http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html';

  async function openAt(pl) {
    await p.goto(url + '?place=' + encodeURIComponent(pl.name) + '&tier=' + pl.tier);
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length, { timeout: 30000 });
    await p.evaluate(pl => BohemiaSettlement.open({ place: { name: pl.name, tier: pl.tier }, traits: [] }), pl);
    await p.waitForTimeout(300);
  }
  async function tap(k) {
    const w = await p.evaluate(k => BohemiaSettlement.where(k), k);
    if (!w) return false;
    await p.mouse.click(w.x, w.y); await p.waitForTimeout(350);
    return true;
  }
  async function shut() { await p.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(120); }

  const recruits = [], keepers = [], cards = [];
  for (const pl of PLACES) {
    await openAt(pl);
    const keeperLooks = await p.evaluate(() => { const o = {}; BohemiaSettlement.folk().forEach(q => { if (q.keeper) o[q.k] = q.look; }); return o; });
    for (const k of await p.evaluate(() => BohemiaSettlement.order())) {
      if (k === 'lot' || k === 'build' || !(await tap(k))) continue;
      const said = await p.evaluate(() => [...document.querySelectorAll('.say .nm')].map(e => e.textContent)[0] || null);
      if (said && keeperLooks[k] && said !== 'THE ELDER') keepers.push({ place: pl.name, k, look: keeperLooks[k], said });   /* the elder is a title */
      if (k === 'hall') {
        await p.waitForTimeout(700);   /* PORTRAIT's fresh portraits draw from files */
        const rs = await p.evaluate(() => (BohemiaSettlement.state.recruits || []).map((r, i) => ({ slot: i, name: r.name, look: r.look, bg: r.backgroundName })));
        const shown = await p.evaluate(() => [...document.querySelectorAll('.hire .nm')].map(e => e.textContent));
        rs.forEach(r => { r.place = pl.name; r.tier = pl.tier; r.onCard = shown.some(t => t.indexOf(r.name + '  ·  ') === 0); recruits.push(r); });
        if (SHEET_PLACES.indexOf(pl.name) >= 0) {
          const els = await p.$$('.hire');
          for (let i = 0; i < els.length; i++) {
            await els[i].scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
            const png = await els[i].screenshot();
            const r = rs[i], key = pl.name + ':0';
            cards.push({ place: pl.name, week: 0, slot: r.slot, look: r.look, name: r.name, background: r.bg,
              was: OLD[seedOf(key + ':name:' + r.slot) % OLD.length], png: png.toString('base64') });
          }
        }
      }
      await shut();
    }
  }

  /* the numbers */
  const agree = (full, look) => { const s = N.MIX.sex[full.split(' ')[0]], f = N.faceReads(look); return !f || s === f || s === 'x'; };
  const recAgree = recruits.filter(r => agree(r.name, r.look)).length;
  const keepNames = keepers.map(x => { const role = x.said.lastIndexOf(', '); return Object.assign(x, { name: role > 0 ? x.said.slice(0, role) : x.said }); });
  const keepAgree = keepNames.filter(x => agree(x.name.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '), x.look)).length;
  const her = {}; let his = 0;
  recruits.forEach(r => { const rr = N.roll('post:' + r.place + ':0:' + r.slot, { sex: N.faceReads(r.look) }); her[rr.heritage] = (her[rr.heritage] || 0) + 1; if (N.readsHispanic(r.name)) his++; });
  const sheet = cards.slice(0, 12);
  /* THE BEFORE, on the same faces: the nine fixed keepers (their names read off the screen before this row) against
     the face each place drew, and how often a company that hires eight men at the posts paid for a name it had */
  const OLD_KEEPER = { hall: 'f', stall: 'f', barber: 'm', bar: 'm', smith: 'm', armourer: 'f', arms: 'm' };   /* LUPE NENA CHUY MANNY RUBEN IRMA TONO */
  const oldKeepFaced = keepers.filter(x => OLD_KEEPER[x.k]);
  const oldKeepWrong = oldKeepFaced.filter(x => N.faceReads(x.look) !== OLD_KEEPER[x.k]).length;
  const LOOKS = ['longcoat','barearms','pack','skirt','widebrim','cape','apron','poncho','bedroll','shorts','satchel','shortcoat'].map(l => 'cast_' + l);
  const slots = [];
  PLACES.forEach(pl => { for (let w = 0; w < 13; w++) for (let i = 0; i < ({ camp: 2, town: 4, fortress: 6 }[pl.tier] || 4); i++) {
    const key = pl.name + ':' + w, look = LOOKS[seedOf(key + ':look:' + i) % 12];
    slots.push({ old: OLD[seedOf(key + ':name:' + i) % OLD.length], now: N.roll('post:' + key + ':' + i, { sex: N.faceReads(look) }).full }); } });
  let dupOld = 0, dupNow = 0, r32 = 12345;
  const rnd = () => { r32 = (Math.imul(r32, 1103515245) + 12345) >>> 0; return r32 / 4294967296; };
  for (let c = 0; c < 10000; c++) {
    const at = new Set(); while (at.size < 8) at.add(Math.floor(rnd() * slots.length));   /* eight different men: nobody is hired twice */
    const pick = [...at].map(j => slots[j]);
    if (new Set(pick.map(x => x.old)).size < 8) dupOld++;
    if (new Set(pick.map(x => x.now)).size < 8) dupNow++;
  }
  const out = {
    made: 'tools/bohemia_people_names_wired_in.js', row: 'PEOPLE [the names wired in]', draft: true,
    measured: {
      places: PLACES.length, recruits: recruits.length, recruits_named_on_their_card: recruits.filter(r => r.onCard).length,
      recruits_name_reads_as_face: recAgree, keepers: keepers.length, keepers_name_reads_as_face: keepAgree,
      keeper_names_different: new Set(keepNames.map(x => x.name)).size,
      recruit_names_different: new Set(recruits.map(r => r.name)).size,
      recruits_heritage: her, recruits_read_hispanic: +(his / Math.max(1, recruits.length)).toFixed(3), page_errors: errs.length,
      before_keepers_with_a_sexed_name: oldKeepFaced.length, before_keeper_name_against_face: oldKeepWrong,
      post_slots_26_places_13_weeks: slots.length,
      companies_of_8_hires_with_a_repeated_name_before: +(dupOld / 10000).toFixed(3),
      companies_of_8_hires_with_a_repeated_name_now: +(dupNow / 10000).toFixed(4)
    },
    cards: sheet.map(c => ({ place: c.place, week: c.week, slot: c.slot, look: c.look, name: c.name, background: c.background, was: c.was }))
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 1) + '\n');

  /* the sheet: the twelve cards as the screen drew them, three across, the old name under each, in the screen's own type */
  await openAt(PLACES.filter(x => x.name === 'HENDERSON')[0]);
  await p.setViewportSize({ width: 1180, height: 900 });
  await p.evaluate(sheet => {
    const css = document.createElement('style');
    [...document.body.children].forEach(e => { e.style.display = 'none'; });
    document.documentElement.style.background = document.body.style.background = '#0d0a07';
    css.textContent = '#namesheet{position:static;display:block;background:#0d0a07;padding:18px 20px}' +
      '#namesheet h1{color:var(--gold,#d9b46a);font-size:18px;letter-spacing:2px;margin:0 0 4px}' +
      '#namesheet p{color:#a8977c;font-size:12px;margin:0 0 14px;letter-spacing:1px}' +
      '#namesheet .g{display:grid;grid-template-columns:repeat(3,370px);gap:14px 16px}' +
      '#namesheet .c img{width:370px;display:block;image-rendering:auto}' +
      '#namesheet .c i{display:block;font-style:normal;color:#8a7a62;font-size:11px;letter-spacing:1px;margin-top:3px}' +
      '#namesheet .c i b{color:#c9a46a;font-weight:400}';
    document.head.appendChild(css);
    const d = document.createElement('div'); d.id = 'namesheet';
    d.innerHTML = '<h1>WHO STANDS AT THE POST</h1><p>THE SCREEN\'S OWN HIRE CARDS, THE FIRST WEEK. THE STRIP, HENDERSON, LAKE MEAD MARINA. UNDER EACH, WHAT THE OLD LIST CALLED HIM.</p><div class="g"></div>';
    const g = d.querySelector('.g');
    sheet.forEach(c => { const e = document.createElement('div'); e.className = 'c';
      e.innerHTML = '<img src="data:image/png;base64,' + c.png + '"><i>WAS <b>' + c.was.toUpperCase() + '</b> &nbsp;·&nbsp; ' + c.place + '</i>'; g.appendChild(e); });
    document.body.appendChild(d);
  }, sheet);
  await p.waitForTimeout(500);
  const h = await p.evaluate(() => document.querySelector('#namesheet').getBoundingClientRect().bottom);
  await p.setViewportSize({ width: 1180, height: Math.ceil(h) });
  await p.waitForTimeout(300);
  fs.mkdirSync(path.dirname(OUT_PNG), { recursive: true });
  await p.screenshot({ path: OUT_PNG });
  await b.close(); srv.kill();
  /* 256 colours, no dither: the cards are flat paper and type, the faces hold up; 1.2 MB becomes about half a MB */
  cp.execFileSync('python3', ['-c', 'import sys\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB")\n' +
    'im.quantize(colors=256,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(sys.argv[1],optimize=True)', OUT_PNG]);
  console.log(JSON.stringify(out.measured));
  console.log(sheet.map(c => c.name + ' (was ' + c.was + ', ' + c.look + ')').join('\n'));
  if (errs.length) console.log('page errors: ' + errs.join(' | '));
})().catch(e => { console.error(e); process.exit(1); });

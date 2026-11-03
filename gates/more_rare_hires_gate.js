/* ==========================================================================
   MORE RARE HIRES, EACH WORTH WANTING, EACH HIS OWN LOOK  (HIRES, 11/3/26, rule 351(a), ask line 361)

   PAOLO 11/3: "I'm at day 20 with like 10 super soldiers damn near I only hired like when I saw it was rare first off. We need
   more more rare characters, bro." He hires ONLY when he sees a rare one, so the rare ones are the reason to grow a crew.
   MEASURED before: three rare men (RUN TWO 10/25), each in whatever body the post's slot happened to deal, so a road knight
   was any townsman in a gold glow. NOW (records/target/bb/rare_recruits.json, __FOURTEEN_RARE_MEN__ in
   slices/BOHEMIA_SETTLEMENT_SCREEN.html, tools/bohemia_hires_the_rare_men.py): fourteen, Battle Brothers' rare backgrounds in
   the valley's skins, each ONE person of the valley in his own body and face, each with the perk his trade taught him and the
   line that says why you want him; the chance a slot holds one is TUNING's row (ours.json rare_at_the_post).

   LEGS:
     H1 the file: at least twelve men, each a real background, a kind of his own, real kit rows, a real perk his edge line
        names, his own line, draft:true; the three RUN TWO made are still there
     H1b HALF OR MORE ARE MELEE (351(a) amended 11/3: 'all the rare guys I saw were ranged only'): his melee weapon in hand
     H2 *** EACH HIS OWN LOOK ***: a look id each, no two alike (the build's own pieces, and the rendered faces and bodies
        measured apart pixel by pixel); his face (rest and four mouths), his eight stills, his walk, his fight sheet and his
        face on the fight's strip all on disk; in the people mix as rare, never fight: true, never in a gang's pool
     H3 *** A REAL EDGE ***: his worst roll beats the best common man at the post in at least one stat, and he walks in
        with a perk; a unique name at the post, never one in the company
     H4 the chance is TUNING's (ours.json rare_at_the_post, inside Battle Brothers' 2.2 to 8.3 a slot) and the screen reads it;
        a town's week holds one about every few visits; a camp only ever holds the village kinds; a common slot never wears a
        rare look; a hired rare man never stands at a post again
     H5 *** THE SEEDED TEST, ON THE PHONE ***: each of the fourteen put in the post's first slot stands on his card in HIS
        body (drawn), with RARE, his edge line, his own words, his three stars; the card fits 390 px; never a glowing border
     H6 *** THE DEMO *** shows one: the demo's own town door, a rare man on the hall's card in his own body
     H7 nothing threw
   node gates/more_rare_hires_gate.js        (BOHEMIA_SHOT_DIR=<dir> keeps the phone shots)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('MORE RARE HIRES: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const has = p => fs.existsSync(path.join(ROOT, p));
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.css': 'text/css' };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });

const RARE = J('records/target/bb/rare_recruits.json'), BGS = J('records/target/bb/backgrounds.json').rows;
const W = J('records/target/bb/weapons.json').rows, A = J('records/target/bb/armor.json'), PERKS = J('records/target/bb/perks.json').rows;
const OURS = J('records/target/bb/ours.json'), ROLL = J('records/hires/BOHEMIA_HIRES_THE_RARE_ROLL.json'), RULES = J('records/target/bb/rules.json');
const FR = J('slices/fight_rig/fight_rig.json');
const STATS = ['hp', 'fatigue', 'resolve', 'initiative', 'melee_skill', 'ranged_skill', 'melee_defense', 'ranged_defense'];
const COMMON = ['farmhand', 'messenger', 'butcher', 'brawler', 'thief', 'militia'];   /* engine/bohemia_goodbros.js: the six at every post */
const VILLAGE = ['beast_slayer', 'retired_soldier', 'witchhunter', 'melee_nomad', 'barbarian'];   /* Battle Brothers' village rares */
const men = RARE.men || [];
const bg = id => BGS.find(b => b.id === id);
const isW = id => W.some(r => r.id === id), isA = (k, id) => (A[k] || []).some(r => r.id === id);

/* ---- H1 ---- */
const bad1 = men.filter(m => !bg(m.background) || !m.kind || !m.look || Object.keys(m.stars || {}).length !== 3 || (m.plan || []).length !== 4
  || [...Object.keys(m.stars), ...m.plan].some(k => STATS.indexOf(k) < 0) || !isW(m.kit.gun) || !isW(m.kit.main) || (m.kit.off && !isA('shields', m.kit.off))
  || (m.kit.body && !isA('body', m.kit.body)) || (m.kit.head && !isA('head', m.kit.head)) || !PERKS.some(p => p.id === m.perk)
  || !(m.edge || '').toUpperCase().startsWith(String((PERKS.find(p => p.id === m.perk) || {}).name || '?').toUpperCase() + ':')
  || !(m.line || '').trim() || m.draft !== true || !(m.base_crowns > 0) || !(m.weight > 0) || !(m.tiers || []).length);
const kinds = new Set(men.map(m => m.kind)), bgsUsed = new Set(men.map(m => m.background));
ok('H1 the file: ' + men.length + ' rare men (at least 12), each a real background and a kind of his own, real kit rows, a real perk his edge line names, his own line, every word draft:true; RUN TWO\'s three still there',
  men.length >= 12 && kinds.size === men.length && bgsUsed.size === men.length && bad1.length === 0 && ['hedge_knight', 'sellsword', 'swordmaster'].every(b => bgsUsed.has(b)) && RARE.draft === true,
  bad1.map(m => m.kind || m.background).join(' ') || 'all real');

/* ---- H1b: rule 351(a) amended (Paolo 11/3: 'more rare melee guys, all the rare guys I saw were ranged only') ---- */
const GUNC = (OURS.gun_classes && OURS.gun_classes.value) || ['dagger', 'firearm', 'crossbow'];
const isMelee = m => { const w = W.find(r => r.id === m.kit.main); return !!w && GUNC.indexOf(w['class']) < 0; };
const melee = men.filter(isMelee);
/* and by the odds a slot deals them, at every kind of place (the coordinator's leg, 11/3: 'of the rare pool, melee is at least half') */
const share = t => { const pool = men.filter(m => (m.tiers || RARE.tiers).indexOf(t) >= 0), w = pool.reduce((a, m) => a + (+m.weight || 1), 0);
  return w ? pool.filter(isMelee).reduce((a, m) => a + (+m.weight || 1), 0) / w : 0; };
const shares = ['camp', 'town', 'fortress'].map(t => [t, Math.round(100 * share(t))]);
ok('*** H1b HALF OR MORE ARE MELEE ***: ' + melee.length + ' of ' + men.length + ' hold a melee weapon in hand (his pistol rides in the bag), every one with his perk; by the odds a slot deals them, melee is ' + shares.map(x => x[1] + '% at a ' + x[0]).join(', '),
  melee.length * 2 >= men.length && melee.every(m => isW(m.kit.gun)) && shares.every(x => x[1] >= 50), melee.map(m => m.kind).join(', '));

/* ---- H2 ---- */
const looks = men.map(m => m.look), lookSet = new Set(looks);
const FACES = ['rest', 'A', 'E', 'O', 'M'], TURNS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const missing = [];
men.forEach(m => { const id = m.look.replace(/^person_/, ''), r = ROLL.find(p => 'person_' + p.id === m.look);
  if (!r) missing.push(m.kind + ': not in the roll');
  FACES.forEach(k => [64, 128].forEach(n => { if (!has('records/target/character/barber/' + m.look + '/face/' + k + '_' + n + '.png')) missing.push(m.kind + ' face ' + k + n); }));
  TURNS.forEach(t => { if (!has('records/target/character/barber/' + m.look + '/rig_' + t + '.png')) missing.push(m.kind + ' still ' + t); });
  if (!has('slices/rig_walk/' + m.look + '.png') || !has('slices/rig_walk/' + m.look + '.json')) missing.push(m.kind + ' walk');
  const L = FR.looks[m.look]; if (!L || !has('slices/fight_rig/' + L.file)) missing.push(m.kind + ' fight sheet');
  if ((FR.faces.order || []).indexOf(m.look) < 0) missing.push(m.kind + ' fight face');
  if (!id) missing.push(m.kind); });
/* no two alike by the build: the roll's own pieces (top and coat; cut and face shape; the whole key) */
const key = p => JSON.stringify([p.skin, p.hair_cut, p.hair, p.face_name, p.facial_hair || null, p.mark_name || null, p.hat || null, p.eyewear || null, p.top, p.coat || null, p.legs, p.feet, p.kit]);
const sameBuild = [];
for (let a = 0; a < ROLL.length; a++) for (let b = a + 1; b < ROLL.length; b++) {
  const x = ROLL[a], y = ROLL[b];
  if (key(x) === key(y) || (x.top === y.top && (x.coat || null) === (y.coat || null)) || (x.hair_cut === y.hair_cut && x.face_name === y.face_name)) sameBuild.push(x.id + '/' + y.id); }
/* the people mix: rare, never fight, never in a gang's pool, never in the fight's crews or bands */
const mixSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people_mix.js'), 'utf8'), win = {}; new Function('window', mixSrc)(win);
const MIX = win.BOHEMIA_PEOPLE_MIX || { people: [], by_gang: {} };
const inMix = looks.filter(l => { const p = MIX.people.find(q => q.look === l); return p && p.rare === true && !p.fight && p.gang === 'rare'; });
const pooled = looks.filter(l => Object.values(MIX.by_gang || {}).some(v => v.indexOf(l) >= 0));
const pl = OURS.people_looks.value, inBands = looks.filter(l => (pl.crew || []).indexOf(l) >= 0 || Object.values(pl.band || {}).some(v => v.indexOf(l) >= 0));
ok('*** H2 EACH HIS OWN LOOK ***: ' + lookSet.size + ' looks for ' + men.length + ' men, no two built alike; face, mouths, stills, walk, fight sheet and fight face on disk for every one',
  lookSet.size === men.length && sameBuild.length === 0 && missing.length === 0, (sameBuild.join(' ') + ' ' + missing.slice(0, 6).join('; ')).trim() || 'all made');
ok('H2b in the people mix as rare (gang rare, never fight: true), in no gang\'s pool and in no fight crew or band, so no common slot, crowd or board deals him',
  inMix.length === men.length && pooled.length === 0 && inBands.length === 0, inMix.length + ' in the mix; pooled ' + pooled.join(' ') + '; banded ' + inBands.join(' '));

/* ---- H3: the edge over the common floor, worked off the files the screen reads ---- */
const cmax = {}; STATS.forEach(k => { cmax[k] = Math.max(...COMMON.map(c => bg(c).stats[k][bg(c).stats[k].length - 1])); });
const NAME = { hp: 'HP', fatigue: 'Fatigue', resolve: 'Resolve', initiative: 'Initiative', melee_skill: 'Melee Skill', ranged_skill: 'Ranged Skill', melee_defense: 'Melee Defense', ranged_defense: 'Ranged Defense' };
const gains = RULES.experience.stat_gains_by_stars.value, lv0 = ((OURS.rare_at_the_post || {}).value || {}).levels ? OURS.rare_at_the_post.value.levels[0] : RARE.levels[0];
const edges = men.map(m => { const s = bg(m.background).stats, fl = RARE.stat_floor, lo = {};
  STATS.forEach(k => { const r = s[k]; lo[k] = r[0] + Math.ceil((r[r.length - 1] - r[0]) * fl); });
  for (let l = 2; l <= lv0; l++) m.plan.forEach(k => { lo[k] += +String(gains[NAME[k]][(m.stars || {})[k] || 0]).split('-')[0]; });
  const over = STATS.filter(k => lo[k] > cmax[k]); return { kind: m.kind, over, perk: m.perk }; });
const noEdge = edges.filter(e => !e.over.length || !e.perk);
ok('*** H3 A REAL EDGE ***: every rare man\'s WORST roll at his lowest level beats the best common man at the post in at least one stat, and he walks in with his trade\'s perk',
  noEdge.length === 0, edges.map(e => e.kind + ' ' + e.over.length + ' (' + e.over.map(k => k.replace('_', ' ')).join(', ') + ')').join('; '));

const ROW = OURS.rare_at_the_post && OURS.rare_at_the_post.value;
ok('H4 the chance is TUNING\'s: ours.json rare_at_the_post ' + (ROW && ROW.chance_per_slot) + ' a slot, inside Battle Brothers\' 2.2 to 8.3 in 100, sourced',
  !!ROW && ROW.chance_per_slot >= 0.022 && ROW.chance_per_slot <= 0.083 && /0370/.test(OURS.rare_at_the_post.source || ''));

(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch(), errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.evaluate(() => { localStorage.clear(); });
  const openAt = async (name, tier, day) => { await p.evaluate(o => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click();
    BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: o.day, batteries: 5000 }); }, { name, tier, day });
    await p.waitForTimeout(300); await p.waitForFunction(() => BohemiaSettlement.ready() && BohemiaSettlement.rareOn(), null, { timeout: 15000 }).catch(() => {}); };

  /* ---- H4: the odds over 400 weeks, and who stands where ---- */
  await openAt('BLUE DIAMOND', 'town', 1);
  const scr = await p.evaluate(() => BohemiaSettlement.rareChance());
  const odds = {};
  for (const [tier, name, slots] of [['town', 'BLUE DIAMOND', 4], ['fortress', 'NELLIS GATE', 6], ['camp', 'DRY WELL', 2]]) {
    await openAt(name, tier, 1);
    odds[tier] = await p.evaluate((slots) => { let n = 0, hit = 0, weeks = 0; const by = {};
      for (let w = 0; w < 400; w++) { const key = BohemiaSettlement.rareKey(w * 7), seen = {}; let any = false;
        for (let i = 0; i < 6; i++) { n++; const r = BohemiaSettlement.rareAt(key, i); if (r) { hit++; by[r.backgroundId] = (by[r.backgroundId] || 0) + 1; } }
        for (let i = 0; i < slots; i++) if (BohemiaSettlement.rareAt(key, i)) { any = true; break; }
        if (any) weeks++; }
      return { n, hit, weeks, by }; }, slots);
  }
  const pct = t => Math.round(1000 * odds[t].hit / odds[t].n) / 10, wk = t => Math.round(100 * odds[t].weeks / 400);
  const ch = ROW ? ROW.chance_per_slot * 100 : 0;
  ok('H4b the screen reads TUNING\'s row (' + scr + '); a slot holds one ' + pct('town') + ' (town) and ' + pct('fortress') + ' (fortress) in 100 against ' + ch + '; a town\'s four hold one ' + wk('town') + '% of weeks (one every ' + (100 / Math.max(1, wk('town'))).toFixed(1) + ' visits), a fortress\'s six ' + wk('fortress') + '%',
    Math.abs(scr - (ROW && ROW.chance_per_slot)) < 1e-9 && Math.abs(pct('town') - ch) <= 2 && Math.abs(pct('fortress') - ch) <= 2 && wk('town') >= 12 && wk('town') <= 40 && wk('fortress') >= 18 && wk('fortress') <= 50);
  const campKinds = Object.keys(odds.camp.by), townKinds = Object.keys(odds.town.by).concat(Object.keys(odds.fortress.by));
  ok('H4c a camp holds only the village kinds (Battle Brothers\' villages: ' + campKinds.join(', ') + '), towns and fortresses deal ' + new Set(townKinds).size + ' kinds',
    odds.camp.hit > 0 && campKinds.every(k => VILLAGE.indexOf(k) >= 0) && new Set(townKinds).size >= 10);
  /* a common slot never wears a rare look; a hired rare man never stands at a post again */
  const common = await p.evaluate((looks) => { let bad = 0, n = 0; for (let w = 0; w < 60; w++) { BohemiaSettlement.open({ place: { name: 'NELLIS GATE', tier: 'fortress' }, traits: [], day: w * 7 + 1, batteries: 5000 });
      BohemiaSettlement.recruits().forEach(r => { n++; if (!r.rare && looks.indexOf(r.look) >= 0) bad++; }); } return { bad, n }; }, looks);
  const after = await p.evaluate((look) => { localStorage.setItem('bohemia.hired.v1', JSON.stringify([{ name: 'TEST MAN', look, hid: 'gate' }])); let seen = 0, rare = 0;
    for (let w = 0; w < 400; w++) { const key = BohemiaSettlement.rareKey(w * 7); for (let i = 0; i < 6; i++) { const r = BohemiaSettlement.rareAt(key, i); if (r) { rare++; if (r.ownLook === look) seen++; } } }
    localStorage.removeItem('bohemia.hired.v1'); return { seen, rare }; }, men[0].look);
  ok('H4d no common slot wears a rare look (' + common.n + ' men over 60 weeks), and a road knight you hired never stands at a post again (' + after.seen + ' of ' + after.rare + ' rare men over 400 weeks)',
    common.n > 100 && common.bad === 0 && after.rare > 50 && after.seen === 0);

  /* ---- H5: the seeded test, every man ---- */
  await openAt('NELLIS GATE', 'fortress', 1);
  const cards = [];
  for (const m of men) {
    await p.evaluate(k => BohemiaSettlement.showRare(k), m.kind);
    const sel = '#sheet.on .hire.rare[data-rare="' + m.background + '"]';   /* his card (the hall lists by ceiling; a rare man the week dealt may stand above him) */
    for (let i = 0; i < 8; i++) { if (await p.evaluate((sel) => BohemiaSettlement.state.open === 'hall' && !!document.querySelector(sel), sel)) break;
      if (await p.evaluate(() => BohemiaSettlement.state.open !== 'hall')) { const hx = await p.evaluate(() => BohemiaSettlement.where('hall')); if (hx) await p.mouse.click(hx.x, hx.y); }
      await p.waitForTimeout(700); }
    await p.waitForFunction((sel) => { const c = document.querySelector(sel + ' canvas.hfig'); return c && c.dataset.drawn === '1'; }, sel, { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(250);
    const c = await p.evaluate((sel) => { const h = document.querySelector(sel); if (!h) return null; const r = h.getBoundingClientRect(), fig = h.querySelector('canvas.hfig');
      const names = [...document.querySelectorAll('#sheet.on .hire .nm')].map(e => e.textContent.split('·')[0].trim());
      return { look: fig && fig.dataset.look, drawn: fig && fig.dataset.drawn === '1', badge: !!(h.querySelector('.hrare b') && /RARE/.test(h.querySelector('.hrare b').textContent)),
        edge: (h.querySelector('.hedge') || {}).textContent || '', perk: (h.querySelector('.hedge') || { dataset: {} }).dataset.perk, says: (h.querySelector('.hsays') || {}).textContent || '',
        arm: (h.querySelector('.hgun') || { dataset: {} }).dataset.arm, armId: (h.querySelector('.hgun') || { dataset: {} }).dataset.gun, figGun: fig && fig.dataset.gun,
        stars: h.querySelectorAll('.hstats .star').length, out: [...h.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > r.right + 1).length,
        glow: /rgba?\(224, 173, 58/.test(getComputedStyle(h).boxShadow), spot: /radial-gradient/.test(getComputedStyle(fig).backgroundImage),
        name: (h.querySelector('.nm') || {}).textContent || '', dupe: names.length !== new Set(names).size, sw: document.getElementById('sheet').scrollWidth, cw: document.getElementById('sheet').clientWidth }; }, sel);
    if (process.env.BOHEMIA_SHOT_DIR) { const el = await p.$(sel); if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'rare_' + m.kind + '.png') }); } }
    cards.push({ m, c });
  }
  const off = cards.filter(({ m, c }) => !c || c.look !== m.look || !c.drawn || (isMelee(m) ? (c.arm !== 'melee' || c.armId !== m.kit.main || c.figGun) : c.arm !== 'gun') || !c.badge || !c.edge.startsWith(m.edge.split(':')[0]) || c.perk !== m.perk || c.says.length < 10 || c.stars !== 3 || c.out || c.glow || !c.spot || c.dupe || c.sw > c.cw);
  ok('*** H5 THE SEEDED TEST ON THE PHONE ***: each of the ' + men.length + ' in the post\'s first slot stands on his card in HIS OWN body, drawn, with RARE, his edge line, his words and three stars; a melee man\'s card shows HIS weapon, never the pistol in his bag; the card fits 390 px; a spotlight under him, never a glowing border; no two names alike at the post',
    cards.length === men.length && off.length === 0, off.map(({ m, c }) => m.kind + ':' + JSON.stringify(c && { look: c.look, drawn: c.drawn, edge: c.edge.slice(0, 20), out: c.out, glow: c.glow, spot: c.spot, dupe: c.dupe })).join(' | ') || cards.map(({ c }) => c.name.split('·')[0].trim()).join(', '));
  /* his name: one man, one name, every post */
  const names = await p.evaluate(async (k) => { const out = []; for (const [n, t] of [['NELLIS GATE', 'fortress'], ['BLUE DIAMOND', 'town']]) {
      BohemiaSettlement.open({ place: { name: n, tier: t }, traits: [], day: 1, batteries: 5000 }); BohemiaSettlement.showRare(k);
      const r = BohemiaSettlement.recruits().find(x => x.rare); out.push(r && r.name); } BohemiaSettlement.showRare(null); return out; }, men[0].kind);
  const all = cards.map(({ c }) => (c && c.name || '').split('·')[0].trim().split(/\s+/)), fn = all.map(w => w[0]), ln = all.map(w => w[w.length - 1]);
  ok('H5b one man, one name: the ' + men[0].kind.replace('_', ' ') + ' is ' + names.join(' at one post and ') + ' at the other; no two of the fourteen share a first name or a surname',
    names[0] && names[0] === names[1] && new Set(fn).size === fn.length && new Set(ln).size === ln.length, all.map(w => w.join(' ')).join(', '));
  ok('H7a nothing threw on the settlement screen', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();

  /* ---- H6: the demo ---- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  let d;
  try { d = await drive.open({ keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok('H6 the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const P = d.page, fr = d.fr;
  try {
    await P.waitForTimeout(2500);
    const town = await fr.evaluate(() => { const bs = ctBases(), names = Object.keys(bs); const n = names.find(k => /^(town|fortress)$/.test(mapTierOf(k))); return { name: n, tier: mapTierOf(n) }; });
    await fr.evaluate((n) => { const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, town.name);
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && BohemiaSettlement.rareOn(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) throw new Error('no town screen at ' + town.name);
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const kind = men[men.length - 1].kind, want = men[men.length - 1].look, sel = '#sbody .hire.rare[data-rare="' + men[men.length - 1].background + '"]';
    await sf.evaluate(k => BohemiaSettlement.showRare(k), kind);
    const box = await (await sf.frameElement()).boundingBox();
    for (let i = 0; i < 6; i++) { if (await sf.evaluate((sel) => BohemiaSettlement.state.open === 'hall' && !!document.querySelector(sel), sel)) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('hall')); if (w) await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(900); }
    await sf.waitForFunction((sel) => { const c = document.querySelector(sel + ' canvas.hfig'); return c && c.dataset.drawn === '1'; }, sel, { timeout: 15000 }).catch(() => {});
    await sf.evaluate((sel) => { const h = document.querySelector(sel); if (h) h.scrollIntoView({ block: 'center' }); }, sel); await P.waitForTimeout(500);
    const seen = await sf.evaluate((sel) => { const h = document.querySelector(sel); if (!h) return null; const f = h.querySelector('canvas.hfig');
      return { look: f.dataset.look, drawn: f.dataset.drawn, edge: (h.querySelector('.hedge') || {}).textContent || '', name: (h.querySelector('.nm') || {}).textContent }; }, sel);
    if (process.env.BOHEMIA_SHOT_DIR) await P.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'rare_in_the_demo.png') });
    ok('*** H6 THE DEMO SHOWS ONE *** (' + town.name + ', the town\'s own door): the ' + kind.replace('_', ' ') + ' on the hall\'s card in his own body', !!seen && seen.look === want && seen.drawn === '1' && seen.edge.length > 20, JSON.stringify(seen));
    await sf.evaluate(() => BohemiaSettlement.showRare(null));
    ok('H7b nothing threw on the demo', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  } catch (e) { ok('H6 the demo leg ran [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();
  done();
})();

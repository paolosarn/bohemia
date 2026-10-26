/* THE ARMOUR HE WEARS SHOWS  (CHARACTER [the armour he wears shows], 10/26/26; rule 272(c), Paolo 10/26, LOCKED: 'the weapons
   and the shield show, but the good armour I have on me doesn't show, like a police helmet... it's not visually shown')

   MEASURED BEFORE (main at a8978753): no screen drew a helmet or a body armour on anybody. The fight drew his body sheet, his
   gun and his shield; the crew card his body and his gun; the camp and the map his body; the portrait his bare head. Every
   head and body row of armor.json was a number and a name only.

   THE DATA (no browser):
     D1 every head row (87) and every body row (78) of armor.json has a class in records/target/bb/armour_looks.json, a class
        the file names, and its piece is drawn in all eight facings in slices/wear/wear.json (a head piece also lying on the
        ground and at portrait size); every cell lies on its sheet: NO INVISIBLE CLASS (the shop sells from these rows)
   ON THE GLASS, PHONE AND COMPUTER, a man in a police riot helmet ('a nose-guard riot helmet') and a police vest ('a basic
   plate carrier'):
     C1 the crew card: his figure is drawn with both pieces (the player's count), and the figure's pixels change where his head
        and chest are against the same figure with nothing drawn
     C2 his portrait on the company's line wears the helmet (the third votes: head gear shows in the portrait)
     F1 the fight: he is drawn with both, facing the glass and facing east, on the fight's own board
     F2 his face on the fight's bar and turn strip wears the helmet
     K1 the camp: the camp screen draws him at the fire with both
     E1 (phone) every class the shop sells is drawn on the man who wears it: each head and body class put on him in turn and
        drawn on his card
     M1 the map, in the demo through its own door: his saved company has him in both; the map draws him in them, and the two men
        at his shoulders in their own pieces
     M2 the map's close end: pinched in and taken to the closest zoom, he still wears both (he never grows; the ground does)
   PLANTED (phone): the drawing switched off (BohemiaWear.off): C1 catches the man drawn bare.
   node gates/the_armour_he_wears_shows_gate.js [--legs=D,C,F,K,E,M] [--shoot] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.css': 'text/css' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const LEGS = (process.argv.find(a => a.startsWith('--legs=')) || '--legs=D,C,F,K,E,M').slice(7).split(',');
const HEAD = 'nasal_helmet', BODY = 'basic_mail_shirt';

function data() {
  console.log('\nTHE DATA');
  const armor = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armor.json')));
  const looks = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/armour_looks.json')));
  const wear = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/wear/wear.json')));
  const bad = [];
  const sizeOf = f => {   /* a WebP's own size, from its first chunk */
    const b = fs.readFileSync(path.join(ROOT, 'slices/wear', f)), t = b.toString('ascii', 12, 16);
    if (t === 'VP8X') return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
    if (t === 'VP8L') { const v = b.readUInt32LE(21); return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]; }
    return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]; };
  const sheets = { main: sizeOf(wear.sheet), face: sizeOf(wear.face_sheet) };
  const onSheet = (q, S) => q && q[0] >= 0 && q[1] >= 0 && q[0] + q[2] <= S[0] && q[1] + q[3] <= S[1] && q[2] > 0 && q[3] > 0;
  for (const slot of ['head', 'body']) {
    const classes = looks[slot + '_classes'] || {};
    for (const r of armor[slot]) {
      const e = looks[slot][r.id];
      if (!e) { bad.push(r.id + ' has no class'); continue; }
      if (!classes[e['class']]) { bad.push(r.id + ' -> ' + e['class'] + ' is not a ' + slot + ' class'); continue; }
      const key = e['class'] + (e.feats || []).slice().sort().map(f => '+' + f).join(''), P = wear.pieces[key] || wear.pieces[e['class']];
      if (!P) { bad.push(r.id + ' (' + key + ') has no piece'); continue; }
      for (const d of wear.dirs) if (!onSheet(P[d], sheets.main)) bad.push(r.id + ' ' + key + ' ' + d);
      if (slot === 'head') { if (!onSheet(P.drop, sheets.main)) bad.push(r.id + ' ' + key + ' drop'); if (!onSheet(P.portrait, sheets.face)) bad.push(r.id + ' ' + key + ' portrait'); }
    }
  }
  const nh = armor.head.length, nb = armor.body.length;
  ok('D1 every one of the ' + nh + ' helmets and ' + nb + ' body armours has a class drawn in all eight facings (and lying, and in the portrait)', bad.length === 0,
    bad.length ? bad.slice(0, 6).join('; ') : Object.keys(looks._counts || {}).length + ' classes, sheets ' + sheets.main.join('x') + ' and ' + sheets.face.join('x'));
}

/* ---------------------------------------------------------------- the glass */
function serve() {
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
    rs.setHeader('content-length', fs.statSync(f).size);
    if (rq.method === 'HEAD') return rs.end();
    fs.createReadStream(f).pipe(rs);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
const PROFILES = {
  phone_portrait: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
  computer: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, hasTouch: false, isMobile: false } };
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t = Date.now(); for (;;) { try { const v = await p.evaluate(fn, arg); if (v) return v; } catch (e) {} if (Date.now() - t > (ms || 30000)) return null; await sleep(200); } }

/* the crew screen alone, its first man in the helmet and the vest */
async function crewCard(b, base, profile, errs) {
  const ctx = await b.newContext(PROFILES[profile]);
  await ctx.addInitScript(() => { try { ['bohemia.company.v1', 'bohemia.company.line.v1', 'bohemia.hired.v1', 'bohemia.climb.v1', 'bohemia.bag.v1'].forEach(k => localStorage.removeItem(k)); } catch (e) {} });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(profile + ' crew: ' + e.message));
  await p.goto(base + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await until(p, () => window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length > 0 && window.BohemiaWear && BohemiaWear.ready(), null, 40000);
  return { ctx, p };
}
const PUT = ([slot, id, sel]) => { const S = BohemiaRosterScreen.state, i = sel == null ? S.sel : sel, m = S.crew[i]; m.gear[slot] = id ? BohemiaRoster.itemOf(slot, id) : null; BohemiaRosterScreen.choose(i); return !!(id ? m.gear[slot] : true); };
const FIG = () => { const c = document.querySelector('.rbody'); if (!c) return null; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i++) h = (h * 31 + d[i]) | 0; return { w: c.width, h: c.height, px: Array.from(d), hash: h }; };
const FACEPX = () => { const c = document.querySelector('.cell.sel canvas.head') || document.querySelector('canvas.head'); if (!c) return null; return Array.from(c.getContext('2d').getImageData(0, 0, c.width, c.height).data); };
const diff = (a, b) => { if (!a || !b || a.length !== b.length) return -1; let n = 0; for (let i = 3; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i - 1] - b[i - 1]) > 24 || Math.abs(a[i - 3] - b[i - 3]) > 24) n++; return n; };

/* --shoot: the man on this screen bare (the drawing off) and wearing it, cut around his head (BohemiaWear.at[who], in the
   drawing context's units: device pixels on the fight's glass, points elsewhere) */
const SHOTS = path.join(ROOT, 'records/target/character/the_armour_shows');
async function shootPair(p, name, who, sel, devicePx, box, ev) {
  if (!process.argv.includes('--shoot')) return;
  ev = ev || p;
  let off = { x: 0, y: 0 };
  if (ev !== p) for (const h of await p.$$('iframe')) if (await h.contentFrame() === ev) { const bb = await h.boundingBox(); off = { x: bb.x, y: bb.y }; }
  const clip = await ev.evaluate(([who, sel, dev, box, off]) => {
    const a = BohemiaWear.at[who], c = document.querySelector(sel); if (!a || !c) return null;
    const r = c.getBoundingClientRect(), k = dev ? (window.devicePixelRatio || 1) : 1;
    return { x: Math.max(0, off.x + r.left + a.x / k - box[0] / 2), y: Math.max(0, off.y + r.top + a.y / k - box[1] * 0.28), width: box[0], height: box[1] };
  }, [who, sel, devicePx, box, off]);
  if (!clip) return;
  await p.screenshot({ path: path.join(SHOTS, 'SCREEN_' + name + '_AFTER.png'), clip });
  await ev.evaluate(() => { BohemiaWear.off = true; try { if (typeof render === 'function') render(); } catch (e) {} }); await sleep(700);   /* the map paints on a change: paint it */
  await p.screenshot({ path: path.join(SHOTS, 'SCREEN_' + name + '_BEFORE.png'), clip });
  await ev.evaluate(() => { BohemiaWear.off = false; try { if (typeof render === 'function') render(); } catch (e) {} }); await sleep(300);
}
async function crewLegs(b, base, profile, errs) {
  const { ctx, p } = await crewCard(b, base, profile, errs);
  try {
    await p.evaluate(PUT, ['head', HEAD]); await p.evaluate(PUT, ['body', BODY]);
    await sleep(2500);
    const seen = await p.evaluate(() => JSON.parse(JSON.stringify(BohemiaWear.seen)));
    const on = await p.evaluate(FIG), faceOn = await p.evaluate(FACEPX);
    await p.evaluate(() => { BohemiaWear.off = true; BohemiaRosterScreen.choose(BohemiaRosterScreen.state.sel); }); await sleep(1500);
    const bare = await p.evaluate(FIG), faceBare = await p.evaluate(FACEPX);
    const seenOff = await p.evaluate(() => JSON.parse(JSON.stringify(BohemiaWear.seen)));
    await p.evaluate(() => { BohemiaWear.off = false; BohemiaRosterScreen.choose(BohemiaRosterScreen.state.sel); }); await sleep(800);
    const c = seen.crew || {}, d = diff(on && on.px, bare && bare.px);
    const cOk = (x, dd) => !!(x['head:riot_helmet'] && x['body:police_vest'] && dd > 120);
    ok('C1 ' + profile + ': the crew card draws him in the police riot helmet and the police vest', cOk(c, d),
      'helmet ' + (c['head:riot_helmet'] | 0) + ' frames, vest ' + (c['body:police_vest'] | 0) + ', ' + d + ' of his pixels changed');
    const f = seen.face || {}, fd = diff(faceOn, faceBare);
    ok('C2 ' + profile + ': his portrait wears the helmet', !!f['head:riot_helmet'] && fd > 200, (f['head:riot_helmet'] | 0) + ' paints, ' + fd + ' pixels of his face changed');
    if (profile === 'phone_portrait') {
      /* PLANTED: switched off, C1's own test on what was drawn while it was off (the frames it added, the pixels against bare) */
      const co = seenOff.crew || {}, added = {}; ['head:riot_helmet', 'body:police_vest'].forEach(k => { added[k] = (co[k] | 0) - (c[k] | 0); });
      ok('PLANTED: the drawing switched off, C1 catches him drawn bare', !cOk(added, diff(bare && bare.px, bare && bare.px)), 'while off: helmet +' + added['head:riot_helmet'] + ', vest +' + added['body:police_vest']);
    }
    if (profile === 'phone_portrait' && LEGS.includes('E')) {
      const L = await p.evaluate(() => BohemiaWear.looks());
      const reps = {};
      for (const slot of ['head', 'body']) for (const [id, e] of Object.entries(L[slot])) if (!reps[slot + ':' + e['class']]) reps[slot + ':' + e['class']] = [slot, id];
      const miss = [];
      for (const [k, [slot, id]] of Object.entries(reps)) {
        await p.evaluate(PUT, [slot === 'head' ? 'body' : 'head', null]);
        const before = await p.evaluate(kk => (BohemiaWear.seen.crew || {})[kk] | 0, k);
        await p.evaluate(PUT, [slot, id]);
        const got = await until(p, ([kk, b0]) => ((BohemiaWear.seen.crew || {})[kk] | 0) > b0, [k, before], 6000);
        if (!got) miss.push(k + ' (' + id + ')');
      }
      ok('E1 every class the shop sells is drawn on the man who wears it (' + Object.keys(reps).length + ' classes)', miss.length === 0, miss.length ? 'not drawn: ' + miss.join(', ') : Object.keys(reps).join(' '));
    }
    if (profile === 'phone_portrait') {
      await p.evaluate(PUT, ['head', HEAD]); await p.evaluate(PUT, ['body', BODY]); await sleep(1500);
      const who = await p.evaluate(() => 'crew:' + (BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel].name));
      await shootPair(p, 'CREW', who, '.rbody', false, [90, 140]);
    }
  } finally { await ctx.close(); }
}

async function fightLeg(b, base, profile, errs) {
  const ctx = await b.newContext(PROFILES[profile]);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(profile + ' fight: ' + e.message));
  /* the company the crew screen hands: its first man in the helmet and the vest */
  const co = await (async () => {
    const cc = await crewCard(b, base, profile, errs);
    await cc.p.evaluate(PUT, ['head', HEAD, 0]); await cc.p.evaluate(PUT, ['body', BODY, 0]);
    const c = await cc.p.evaluate(() => BohemiaRoster.company(BohemiaRosterScreen.state.crew));
    await cc.ctx.close(); return c;
  })();
  await p.addInitScript(c => { window.FIGHT_OPTS = { seed: 7, speed: 1, company: c.slice(0, 6) }; }, co);
  await p.goto(base + '/slices/BOHEMIA_FIGHT.html', { waitUntil: 'load' });
  await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 0, null, 60000);
  const who = co[0].name;
  await until(p, () => ((BohemiaWear.seen.fight || {})['head:riot_helmet'] | 0) > 3, null, 40000);   /* the board is up and he is on it */
  /* he turns: draw him facing the glass, then facing east */
  for (const f of [0, 2]) {
    /* held the way a finger holds him (the fight turns a man it is not dragging to face his nearest foe) */
    await p.evaluate(([n, f]) => { const v = FIGHT.S.units.find(u => u.side === 'you' && u.name === n); if (v) { UI.drag = { u: v, gate: true }; v._face = f; } }, [who, f]);
    await sleep(1200);
  }
  await p.evaluate(() => { if (UI.drag && UI.drag.gate) UI.drag = null; });
  const z = await p.evaluate(() => JSON.parse(JSON.stringify(BohemiaWear.seen.fight || {})));
  /* his face as the fight paints it for the bar (its own painter, his own unit): the helmet's pixels on it, against it painted bare */
  const fz = await p.evaluate(async n => {
    const v = FIGHT.S.units.find(x => x.side === 'you' && x.name === n), paint = () => { const c = document.createElement('canvas'); c.width = c.height = 84; drawPortrait(c.getContext('2d'), v, 84); return c.getContext('2d').getImageData(0, 0, 84, 84).data; };
    const b0 = (BohemiaWear.seen.face || {})['head:riot_helmet'] | 0;
    for (let i = 0; i < 30 && !BohemiaWear.sheet(BohemiaWear.meta().face_sheet); i++) await new Promise(r => setTimeout(r, 100));
    const on = paint(), n1 = ((BohemiaWear.seen.face || {})['head:riot_helmet'] | 0) - b0;
    BohemiaWear.off = true; const bare = paint(); BohemiaWear.off = false;
    let d = 0; for (let i = 0; i < on.length; i += 4) if (Math.abs(on[i] - bare[i]) + Math.abs(on[i + 1] - bare[i + 1]) + Math.abs(on[i + 2] - bare[i + 2]) > 30) d++;
    return { n: n1, d: d };
  }, who);
  const u = await p.evaluate(n => { const v = FIGHT.S.units.find(x => x.side === 'you' && x.name === n); return v && { head: v.headRow && v.headRow.id, body: v.bodyRow && v.bodyRow.id }; }, who);
  const both = d => (z['head:riot_helmet@' + d] | 0) > 0 && (z['body:police_vest@' + d] | 0) > 0;
  ok('F1 ' + profile + ': the fight draws him in the police riot helmet and the police vest, facing the glass and facing east', !!u && u.head === HEAD && u.body === BODY && both('S') && both('E'),
    who + ' wears ' + (u && u.head) + ' / ' + (u && u.body) + '; helmet S ' + (z['head:riot_helmet@S'] | 0) + ', E ' + (z['head:riot_helmet@E'] | 0) + '; vest S ' + (z['body:police_vest@S'] | 0) + ', E ' + (z['body:police_vest@E'] | 0));
  ok('F2 ' + profile + ': his face on the fight\'s bar and turn strip wears the helmet', fz.n > 0 && fz.d > 300, fz.n + ' painted, ' + fz.d + ' of 7056 pixels changed against his bare face');
  if (profile === 'phone_portrait') await shootPair(p, 'FIGHT', await p.evaluate(n => FIGHT.S.units.find(x => x.side === 'you' && x.name === n).id, who), 'canvas', true, [110, 150]);
  await ctx.close();
  return co;
}

async function campLeg(b, base, profile, errs, co) {
  const ctx = await b.newContext(PROFILES[profile]);
  await ctx.addInitScript(c => { try { localStorage.setItem('bohemia.company.v1', JSON.stringify(c)); } catch (e) {} }, co);
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(profile + ' camp: ' + e.message));
  await p.goto(base + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await until(p, () => window.BohemiaSettlement && BohemiaSettlement.ready(), null, 40000);
  await p.evaluate(c => BohemiaSettlement.open({ camp: true, arrival: false, place: { name: 'YOUR CAMP', tier: 'camp', district: 'desert', block: [10, 10] }, batteries: 100, contracts: [], hired: {}, day: 3, min: 600,
    company: c.map(m => ({ look: m.look, name: m.name })) }), co);
  const got = await until(p, () => { const s = (BohemiaWear.seen.camp || {}); return s['head:riot_helmet'] > 2 && s['body:police_vest'] > 2 ? s : null; }, null, 20000);
  const s = got || await p.evaluate(() => JSON.parse(JSON.stringify(BohemiaWear.seen.camp || {})));
  ok('K1 ' + profile + ': at camp he sits by the fire in the police riot helmet and the police vest', !!got, 'helmet ' + (s['head:riot_helmet'] | 0) + ' frames, vest ' + (s['body:police_vest'] | 0) + '; the camp drew ' + Object.keys(s).length + ' pieces');
  if (profile === 'phone_portrait') await shootPair(p, 'CAMP', 'settle:' + co[0].look, 'canvas', false, [110, 150]);
  await ctx.close();
}

/* the map, in the demo through its own door (the one driver): his saved company has him in the helmet and the vest, the way the
   crew screen saves it; he and the two at his shoulders are drawn by the map */
async function mapLeg(profile, errs) {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let d;
  try { d = await D.open({ profile, door: 150000 }); } catch (e) { ok('M1 ' + profile + ': the demo opened', false, String(e.message).slice(0, 120)); return; }
  try {
    const fr = d.fr;
    await until(fr, () => window.BohemiaWear && BohemiaWear.ready() && window.MAP_DREW && MAP_DREW.you && typeof CREW_DEFS !== 'undefined' && CREW_DEFS && LOOP.start && LOOP.start.company, null, 60000);
    await fr.evaluate(([h, b]) => {
      const co = LOOP.start.company.map((m, i) => Object.assign({}, m, { look: m.look || CREW_DEFS.looks[i], name: m.name || (i ? 'M' + i : 'YOU'), main: i === 0 }));
      co[0].gear = Object.assign({}, co[0].gear, { head: h, body: b });
      localStorage.setItem('bohemia.company.v1', JSON.stringify(co));
    }, [HEAD, BODY]);
    await sleep(1200);   /* the saved company is read at most once a second; the map paints when something changes: paint it */
    const got = await until(fr, () => { try { render(); } catch (e) {} const s = BohemiaWear.seen.map || {}; return s['head:riot_helmet'] > 3 && s['body:police_vest'] > 3 ? s : null; }, null, 15000);
    const s = got || await fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaWear.seen.map || {})));
    const others = Object.keys(s).filter(k => !/@/.test(k) && !/riot_helmet|police_vest/.test(k));
    ok('M1 ' + profile + ': on the map he walks in the police riot helmet and the police vest, his two men in theirs', !!got && others.length > 0,
      'helmet ' + (s['head:riot_helmet'] | 0) + ' frames, vest ' + (s['body:police_vest'] | 0) + '; his men: ' + others.join(' '));
    if (profile === 'phone_portrait') await shootPair(d.page, 'MAP', 'map:you', 'canvas', false, [150, 130], fr);
    /* M2 THE CLOSE END: pinched in with two fingers (the driver's pinch), then to the closest the map goes (the game's own
       setZoomAt, which the pinch calls), he still wears both. The ground zooms and he does not grow (THE GROUND MAY ZOOM, THE
       PERSON MAY NOT), so it is the zoom that is checked, and his frames, never his size */
    const far = await fr.evaluate(() => ({ z: CZOOM, n: (BohemiaWear.seen.map || {})['head:riot_helmet'] | 0 }));
    for (let i = 0; i < 3; i++) { try { await d.pinchIn(); } catch (e) {} await sleep(300); }
    await fr.evaluate(() => { try { const zb = zoomBounds(); setZoomAt(zb[1], CVW / 2, CVH / 2); } catch (e) {} });
    await sleep(600);
    const near = await until(fr, f => { try { render(); } catch (e) {} const zb = zoomBounds(), s = BohemiaWear.seen.map || {}, n = s['head:riot_helmet'] | 0;
      return CZOOM >= zb[1] * 0.95 && CZOOM > f.z && n > f.n && (s['body:police_vest'] | 0) > 0 ? { z: CZOOM, zmax: zb[1], n } : null; }, far, 12000);
    ok('M2 ' + profile + ': at the map\'s close end he still wears both', !!near,
      'zoom ' + (+far.z).toFixed(2) + ' -> ' + (near ? (+near.z).toFixed(2) + ' of ' + (+near.zmax).toFixed(2) + ', ' + (near.n - far.n) + ' new helmet frames' : 'not reached or not drawn'));
    if (profile === 'phone_portrait' && near) await shootPair(d.page, 'MAP_CLOSE', 'map:you', 'canvas', false, [220, 220], fr);
    errs.push(...d.errs.map(e => profile + ' map: ' + e));
  } finally { await d.close(); }
}

(async () => {
  if (LEGS.includes('D')) data();
  if (LEGS.some(l => 'CFKEM'.includes(l))) {
    if (process.argv.includes('--shoot')) fs.mkdirSync(SHOTS, { recursive: true });
    const srv = await serve(), base = 'http://127.0.0.1:' + srv.address().port;
    const { chromium } = require('playwright');
    const b = await chromium.launch();
    const errs = [];
    try {
      for (const profile of ['phone_portrait', 'computer']) {
        console.log('\n' + profile);
        if (LEGS.includes('C') || LEGS.includes('E')) await crewLegs(b, base, profile, errs);
        let co = null;
        if (LEGS.includes('F') || LEGS.includes('K')) co = await fightLeg(b, base, profile, errs);
        if (LEGS.includes('K')) await campLeg(b, base, profile, errs, co);
        if (LEGS.includes('M')) await mapLeg(profile, errs);
      }
      ok('nothing threw on any screen', errs.length === 0, errs.slice(0, 3).join(' | '));
    } finally { await b.close(); srv.close(); }
  }
  console.log('\nTHE ARMOUR HE WEARS SHOWS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

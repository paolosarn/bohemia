/* NO TWO PEOPLE ALIKE GATE (RUN TWO, row [no two people alike], 10/23/26; rule 121(i)).
   PAOLO 10/19: 'THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS
   FOR CUSTOMIZATIONS, IT'S INSANE.' Measured before: the game drew 13 gang looks (one man per gang) and 3 barber cuts, so
   a gang's party was one man twice, a town's crowd repeated, and a band of twelve wore six looks.
   THE ROW: every person on every screen rolls his own mix of cut, hair colour, face, skin, beard, mark, hat, face piece,
   top and coat inside his gang's colours, from everything CHARACTER built on the 3D man, and no two people on one screen
   are the same. This gate MEASURES it where he meets it:
     THE ROLL     152 people (8 a gang and 48 of the places' own), no two alike by every piece; the pieces in play counted (cuts, tops, coats, hats, face
                  pieces, beards, marks); no cone hat and no odd wrap on a head (the nineteenth votes)
     THE RENDERS  every rolled person stands in eight turns, walks in eight, and talks under his own head (rest and the four
                  mouths); every gang and the place's people have their map sheet
     THE TOWNS    every tier, by day and night and on market day: every keeper and every man in the crowd is a different
                  rolled person, talking under his own face
     THE MAP      the real map, its parties out on the road: the people drawn on one screen, counted by who they are
     THE HALL, THE CREW, THE FIGHT   land with the fight's renders (the row's second half)
   Run: node gates/no_two_people_alike_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8871;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const ROLL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json'), 'utf8'));
const MIXJS = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people_mix.js'), 'utf8');
const MIX = (() => { const w = {}; new Function('window', MIXJS)(w); return w.BOHEMIA_PEOPLE_MIX; })();
const BARBER = path.join(ROOT, 'records/target/character/barber');
const TURNS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

/* ---- THE ROLL ---- */
{
  const key = p => JSON.stringify([p.hair_cut, p.hair, p.face_name, p.face, p.skin, p.facial_hair, p.mark_name, p.hat, p.eyewear, p.top, p.coat]);
  const keys = ROLL.map(key);
  ok('THE ROLL: 152 people, no two alike by every piece', ROLL.length >= 152 && new Set(keys).size === keys.length, new Set(keys).size + ' different of ' + ROLL.length);
  const n = f => new Set(ROLL.map(f).filter(Boolean)).size;
  const c = { cuts: n(p => p.hair_cut), hair: n(p => JSON.stringify(p.hair)), faces: n(p => p.face_name), skins: n(p => p.tone), tops: n(p => p.top), coats: n(p => p.coat),
    hats: n(p => p.hat), face_pieces: n(p => p.eyewear), beards: n(p => p.facial_hair), marks: n(p => p.mark_name) };
  ok('  every family of pieces is in play, not two options (cuts 15+, tops 40+, coats 25+, hats, face pieces, beards, marks)',
    c.cuts >= 15 && c.tops >= 40 && c.coats >= 25 && c.hats >= 3 && c.face_pieces >= 3 && c.beards >= 5 && c.marks >= 3, JSON.stringify(c));
  const odd = ROLL.filter(p => /CONE|WRAP|TURBAN|STRAW/i.test(p.hat || ''));
  ok('  hair first, hats rare, and no cone hat or odd wrap on a head (the nineteenth votes)', odd.length === 0 && ROLL.filter(p => p.hat).length <= ROLL.length * 0.2,
    ROLL.filter(p => p.hat).length + ' hats of ' + ROLL.length + (odd.length ? ', odd: ' + odd.map(p => p.hat).join(', ') : ''));
  const gangs = new Set(ROLL.map(p => p.gang));
  ok('  every gang has its own people, and the places have theirs', gangs.size >= 14 && [...gangs].every(g => ROLL.filter(p => p.gang === g).length >= 8), [...gangs].map(g => g + ' ' + ROLL.filter(p => p.gang === g).length).join(', '));
}
/* ---- THE RENDERS ---- */
{
  const miss = [];
  MIX.people.forEach(q => {
    const d = path.join(BARBER, q.look);
    TURNS.forEach(t => { if (!fs.existsSync(path.join(d, 'rig_' + t + '.png'))) miss.push(q.look + ' stand ' + t);
      if (!q.stands) for (let k = 0; k < 6; k++) if (!fs.existsSync(path.join(ROOT, 'records/run2/people', q.look, 'rig_Anim_0_' + t + '_k0' + k + '.png'))) miss.push(q.look + ' walk ' + t + k); });   /* the walk is source, kept unpublished */
    ['rest', 'A', 'E', 'O', 'M'].forEach(k => [64, 128].forEach(s => { if (!fs.existsSync(path.join(d, 'face', k + '_' + s + '.png'))) miss.push(q.look + ' face ' + k + s); }));
  });
  ok('THE RENDERS: every rolled person in the game is on the rig, standing in eight turns (walking too, but for the places\' people who only stand), talking under his own head', MIX.people.length >= 152 && !miss.length, MIX.people.length + ' people' + (miss.length ? ', missing ' + miss.slice(0, 3).join('; ') : ''));
  const IX = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/rig_mix/index.json'), 'utf8'));
  const onSheet = {}, walks = {};
  Object.keys(IX.sheets).forEach(n => { const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/rig_mix', n + '.json'), 'utf8'));
    m.gangs.forEach(l => { onSheet[l] = n; }); m.walks.forEach(l => { walks[l] = 1; }); });
  const off = MIX.people.filter(q => !onSheet[q.look] || (!q.stands && !walks[q.look]));
  const tall = Object.keys(IX.sheets).filter(n => IX.sheets[n].length > 12);
  ok('  every gang and the places\' people are on the map\'s sheets (twelve a sheet at most), every walker walking', off.length === 0 && tall.length === 0 && Object.keys(MIX.by_gang).every(g => IX.pools[g]),
    Object.keys(IX.pools).map(g => g + ' ' + IX.pools[g].length).join(', ') + (off.length ? '; off: ' + off.slice(0, 3).map(q => q.look).join(' ') : ''));
}

const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [], missing = [];
  const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); }); };

  /* ---- THE TOWNS ---- */
  const p = await ctx.newPage(); watch(p);
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  const towns = [], twice = [], unrolled = [], faceless = [];
  for (const tier of ['camp', 'town', 'fortress']) for (const name of ['DRY CAMP', 'HENDERSON', 'NELLIS GATE', 'THE WASH, NORTH LAS VEGAS']) for (const t of [[false, []], [true, []], [false, ['market_day']]]) {
    await p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: o.tr, night: o.night }), { tier, name, night: t[0], tr: t[1] });
    await p.waitForTimeout(120);
    const L = await p.evaluate(() => BohemiaSettlement.folk().map(x => ({ look: x.look, face: window.BohemiaCrewFaces ? BohemiaCrewFaces.src(x.look, 'A', 128) : null })));
    const looks = L.map(x => x.look).concat(await p.evaluate(() => BohemiaSettlement.busy ? BohemiaSettlement.busy().map(w => w.look) : []));   /* and the people busy on the paths (rule 131) */
    towns.push(looks.length);
    if (new Set(looks).size !== looks.length) twice.push(tier + ' ' + name + (t[0] ? ' night' : '') + (t[1][0] ? ' market' : ''));
    L.forEach(x => { if (!/^person_/.test(x.look)) unrolled.push(x.look); if (!x.face || x.face.indexOf('/' + x.look + '/face/') < 0) faceless.push(x.look); });
  }
  ok('THE TOWNS: on all 36 screens (3 tiers, 4 places, day, night, market day) nobody is anybody else', twice.length === 0, towns.reduce((a, b) => a + b, 0) + ' people drawn' + (twice.length ? ', a man twice in ' + twice.slice(0, 3).join('; ') : ''));
  ok('  every keeper and every man in the crowd is a rolled person', unrolled.length === 0, unrolled.slice(0, 4).join(' ') || 'all rolled');
  ok('  and each talks under the head of his own model (rest and the four mouths)', faceless.length === 0, faceless.slice(0, 4).join(' ') || 'all his own');
  /* one screen as he sees it: count the different people drawn, from the pixels' own source files */
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ['market_day'], night: false }));
  await p.waitForTimeout(2500);
  const drawn = await p.evaluate(() => [...new Set(performance.getEntriesByType('resource').map(r => r.name).filter(u => /barber\/person_[a-z0-9_]+\/rig_[NSEW]+\.png$/.test(u)).map(u => u.match(/person_[a-z0-9_]+/)[0]))].length);
  ok('  the market-day street loads each person\'s own render (counted off the network, not the list)', drawn >= 15, drawn + ' different people\'s renders');

  /* THE HALL, THE CREW SCREEN AND THE FIGHT: their legs land with the fight's renders (the second half of the row) */

  ok('every file loads', missing.length === 0, missing.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();

  /* ---- THE MAP: the demo's own map, the parties out on the road, at three zooms; every person drawn on the glass counted
     by who he is (the set his pixels come from) ---- */
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open({});
  await d.fr.evaluate(() => { for (let k = 0; k < 12; k++) partiesAdvance(30); render(); });
  await d.page.waitForTimeout(6000);
  for (const z of [null, 1.4, 2.4]) {
    const r = await d.fr.evaluate(z => {
      if (z) { CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; }
      render(); render();
      const seen = [], o = window.mapPersonDraw;
      window.mapPersonDraw = function (set, face, beat, sx, footY) { if (set && sx > -20 && sx < CVW + 20 && footY > -20 && footY < CVH + 60) seen.push(set); return o.apply(this, arguments); };
      try { render(); } finally { window.mapPersonDraw = o; }
      const ids = new Map(); seen.forEach(x => { ids.set(x, (ids.get(x) || 0) + 1); });
      const sheets = Object.keys(RIG_MIX.sheets).filter(n => RIG_MIX.sheets[n].state === 2).length;
      return { zoom: Math.round(CZOOM * 100) / 100, drawn: seen.length, different: ids.size, most: Math.max(0, ...ids.values()), sheets };
    }, z);
    ok('THE MAP at zoom ' + r.zoom + ': nobody on the glass twice', r.drawn > 0 && r.different === r.drawn, r.different + ' different of ' + r.drawn + ' drawn, the most-drawn man ' + r.most + 'x, ' + r.sheets + ' people sheets in');
  }
  await d.close();
  console.log('\nNO TWO PEOPLE ALIKE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

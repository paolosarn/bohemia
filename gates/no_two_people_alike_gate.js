/* NO TWO PEOPLE ALIKE GATE (RUN TWO, row [no two people alike], 10/23/26; rule 121(i)).
   PAOLO 10/19: 'THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS
   FOR CUSTOMIZATIONS, IT'S INSANE.' Measured before: the game drew 13 gang looks (one man per gang) and 3 barber cuts, so
   a gang's party was one man twice, a town's crowd repeated, and a band of twelve wore six looks.
   THE ROW: every person on every screen rolls his own mix of cut, hair colour, face, skin, beard, mark, hat, face piece,
   top and coat inside his gang's colours, from everything CHARACTER built on the 3D man, and no two people on one screen
   are the same. This gate MEASURES it where he meets it:
     THE ROLL     116 people, no two alike by every piece; the pieces in play counted (cuts, tops, coats, hats, face
                  pieces, beards, marks); no cone hat and no odd wrap on a head (the nineteenth votes)
     THE RENDERS  every rolled person stands in eight turns, walks in eight, and talks under his own head (rest and the four
                  mouths); every gang and the place's people have their map sheet
     THE TOWNS    every tier, by day and night and on market day: every keeper and every man in the crowd is a different
                  rolled person, talking under his own face
     THE MAP      the real map, its parties out on the road: the people drawn on one screen, counted by who they are
     THE HALL     the men at the post are rolled people the fight can draw, none already in the company, the crew screen
                  shows the hired man's own body and face
     THE FIGHT    a full band against your company: every man on the board a different look, each from his own sheet
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
  ok('THE ROLL: 116 people, no two alike by every piece', ROLL.length >= 116 && new Set(keys).size === keys.length, new Set(keys).size + ' different of ' + ROLL.length);
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
      for (let k = 0; k < 6; k++) if (!fs.existsSync(path.join(d, 'rig_Anim_0_' + t + '_k0' + k + '.png'))) miss.push(q.look + ' walk ' + t + k); });
    ['rest', 'A', 'E', 'O', 'M'].forEach(k => [64, 128].forEach(s => { if (!fs.existsSync(path.join(d, 'face', k + '_' + s + '.png'))) miss.push(q.look + ' face ' + k + s); }));
  });
  ok('THE RENDERS: every rolled person in the game is on the rig, standing and walking in eight turns, talking under his own head', MIX.people.length >= 116 && !miss.length, MIX.people.length + ' people' + (miss.length ? ', missing ' + miss.slice(0, 3).join('; ') : ''));
  const sheets = Object.keys(MIX.by_gang).map(g => { const j = path.join(ROOT, 'slices/rig_mix', g + '.json'); return fs.existsSync(j) ? [g, JSON.parse(fs.readFileSync(j, 'utf8'))] : [g, null]; });
  ok('  every gang and the place\'s people have their map sheet, every one of them on it', sheets.every(([g, m]) => m && MIX.by_gang[g].every(l => m.gangs.indexOf(l) >= 0) && m.walks.length === m.gangs.length),
    sheets.map(([g, m]) => g + ' ' + (m ? m.gangs.length : 'NONE')).join(', '));
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
    const looks = L.map(x => x.look);
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

  /* ---- THE HALL AND THE CREW ---- */
  const hall = await p.evaluate(() => { BohemiaSettlement.open({ place: { tier: 'fortress', name: 'NELLIS GATE' }, traits: [], night: false });
    const R = BohemiaSettlement.recruits();
    const M = window.BOHEMIA_PEOPLE_MIX, fight = {}; (M ? M.people : []).forEach(p => { if (p.fight) fight[p.look] = 1; });
    return R.map(r => ({ look: r.look, fight: !!fight[r.look], name: r.name })); });
  ok('THE HALL: the men at the post are rolled people who stand on the fight\'s board too, no two alike', hall.length > 0 && hall.every(r => r.fight) && new Set(hall.map(r => r.look)).size === hall.length, hall.map(r => r.look).join(' '));
  await p.evaluate(looks => { localStorage.setItem('bohemia.company.v1', JSON.stringify(looks.map((l, i) => ({ name: 'MAN ' + i, background: 'farmhand', level: 1, look: l, gear: {} })))); }, hall.map(r => r.look));
  const hall2 = await p.evaluate(() => { BohemiaSettlement.open({ place: { tier: 'fortress', name: 'NELLIS GATE' }, traits: [], night: false, day: 7 });
    return BohemiaSettlement.recruits().map(r => r.look); });
  const mine = hall.map(r => r.look);
  ok('  a man already in your company is never at the post again', hall2.every(l => mine.indexOf(l) < 0), hall2.filter(l => mine.indexOf(l) >= 0).join(' ') || hall2.length + ' new faces');
  const r = await ctx.newPage(); watch(r);
  await r.addInitScript(l => { localStorage.setItem('bohemia.company.v1', JSON.stringify(l)); }, mine.map((l, i) => ({ name: 'MAN ' + i, background: 'farmhand', level: 1, look: l, gear: {} })));
  await r.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await r.waitForTimeout(2500);
  const cards = await r.evaluate(() => [...document.querySelectorAll('canvas.face')].map(c => ({ look: c.dataset.look, face: c.dataset.face })));
  const rolled = cards.filter(c => /^person_/.test(c.look));
  ok('THE CREW SCREEN: a hired man wears his own face there', rolled.length > 0 && rolled.every(c => c.face === 'fresh'), rolled.length + ' rolled faces of ' + cards.length + ' on the line');
  const lineLooks = cards.map(c => c.look);
  ok('  and nobody on the company line is anybody else', new Set(lineLooks).size === lineLooks.length, new Set(lineLooks).size + ' of ' + lineLooks.length);

  /* ---- THE FIGHT ---- */
  const f = await ctx.newPage(); watch(f);
  const company = mine.slice(0, 4).map((l, i) => ({ name: 'MAN ' + i, background: 'farmhand', level: 1, look: l, gear: {} }));
  await f.addInitScript(c => { window.FIGHT_OPTS = { seed: 5, speed: 1, company: c, party: [{ kind: 'brigand_thug', count: 8 }, { kind: 'brigand_raider', count: 2 }, { kind: 'brigand_marksman', count: 2 }] }; }, company);
  await f.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_FIGHT.html');
  await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
  await f.waitForTimeout(3000);
  const units = await f.evaluate(() => FIGHT.S.units.filter(u => !u.beast).map(u => ({ side: u.side, look: u.look, sheet: !!(DB.rig.looks[u.look]), guns: !!(DB.rig.looks[u.look] && DB.rig.looks[u.look].guns), face: DB.rig.faces.order.indexOf(u.look) >= 0 })));
  const fl = units.map(u => u.look);
  ok('THE FIGHT: twelve of a band against your men, every man on the board a different look', units.length >= 12 && new Set(fl).size === fl.length, new Set(fl).size + ' different of ' + fl.length + ': ' + fl.join(' '));
  const theirs = units.filter(u => u.side === 'them');
  ok('  the band are rolled people of its gangs, drawn from their own sheets, with their gang\'s guns and their own faces', theirs.filter(u => /^person_/.test(u.look)).length >= theirs.length - 3 && units.every(u => u.sheet && u.face) && units.filter(u => /^person_/.test(u.look)).every(u => u.guns),
    theirs.filter(u => /^person_/.test(u.look)).length + ' rolled of ' + theirs.length + ' of them; ' + units.filter(u => !(u.sheet && u.face)).map(u => u.look).join(' '));
  const loaded = await f.evaluate(() => performance.getEntriesByType('resource').map(r => r.name).filter(u => /fight_rig\/person_[a-z0-9_]+\.webp$/.test(u)).length);
  ok('  and the board fetched each rolled man\'s own sheet', loaded >= units.filter(u => /^person_/.test(u.look)).length, loaded + ' sheets');

  ok('every file loads', missing.length === 0, missing.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nNO TWO PEOPLE ALIKE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

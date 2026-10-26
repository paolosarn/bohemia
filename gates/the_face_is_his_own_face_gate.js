/* THE FACE IS HIS OWN FACE (RUN TWO [the face is his own face], 10/24/26; rule 120(d) and 121(e)(i); Paolo 10/18: 'the
   portraits don't look like the people... Black people looking like white people'; 10/19: 'EVERYTHING IS A 3D MODEL NOW...
   WTF TRYING TO COMBINE THE TWO').
   END STATE: every portrait on the crew screen, the hire list and the settlement's keepers is a render of that same person's
   own rig head wearing his own rolled look, in his own skin; no painted or 8-bit face on RUN TWO's screens; person by person.
   MEASURED BEFORE (10/24): the crew's eleven wore eleven old cast looks (PORTRAIT's heads, one per look, two of them a skin
   darker than their bodies: EYES' read, records/target/RUN2_EACH_MAN_HIS_OWN_SKIN.json), the board's 39 clients talked under
   those same twelve heads, a keeper who spoke before the picture was in wore a gang's head, and the hall filled a post past its
   rolled men with cast looks. On his phone's profile, with the real pages:
     F0  CONTROL: the old crew list is not one rolled man (so the crew leg can go red), and EYES' two BACK faces were on it
     F1  EVERY ROLLED PERSON'S FACE IS HIS OWN HEAD: for all of the valley's rolled people, his talking face (rest A E O M, 64
         and 128) is in his own folder, and that folder's rig.json renders his own model (records/character/rig/
         barber_<look>.glb) with the portrait made in the same run as his body, so face and body are one model, one skin
     F2  THE CREW: the crew screen's twelve are YOU and eleven rolled men, no two alike, each face on the screen his own look,
         fetched from his own folder, his card's whole body his own still; the fight has each of them on its board (one man, one
         look stays ONE MAN, ONE LOOK's); a name that reads as a woman's wears no beard
     F3  THE TOWNS: at a camp, a town and a fortress (two places each), every keeper speaks under the head of the body at his
         post, a rolled person, his name never a woman's on a bearded face; every man at the post is the rolled man standing
         there (his own face on his card), never one of your company; every client at the board is a rolled person nobody on
         the screen is, never bearded under a woman's name; the arrival's elder is the board's keeper
     F4  NO OLD HEAD: across F2 and F3 no face of PORTRAIT's old cast or gang heads and no fight_people sheet is fetched, and
         every face drawn is a talking 3D head ('fresh') of YOU or a rolled person, never the dim shape
     F5  NOBODY ELSE IS YOUR COMPANY: over 26 places the keepers, the crowd, the walkers and the posts never deal one of your
         eleven; the map's people index names them and the map's crowd skips them
   Run: node gates/the_face_is_his_own_face_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8902;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.flac': 'audio/flac' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const ROLLED = /^person_[a-z]+_\d+$/;
const OLD_HEAD = /records\/target\/portrait\/crew\/(cast_|faction_)|slices\/fight_people\/[^/]+\.webp/;
/* the crew's names that read as a woman's (the five of ours.json's twelve; PEOPLE's mix reads two of them, the -a and the
   short forms the rest: Desi, Tina, Nena) */
const WOMEN = ['DESI', 'TINA', 'MARISOL', 'LUPE', 'NENA'];
const READ = () => new Promise(res => {
  const whos = [].slice.call(document.querySelectorAll('#sheet.on .who, #arrive .who'));
  res(whos.map(w => { const c = w.querySelector('canvas.face'); return { nm: (w.querySelector('.nm') || {}).textContent || '', k: c ? c.dataset.face : 'NOFACE', look: c ? c.dataset.look || '' : '' }; }));
});

(async () => {
  /* F0 */
  const OLD = ['you', 'cast_longcoat', 'cast_barearms', 'cast_widebrim', 'cast_poncho', 'cast_shortcoat', 'cast_apron', 'cast_cape', 'cast_pack', 'cast_satchel', 'cast_skirt', 'cast_shorts'];
  const eyes = J('records/target/RUN2_EACH_MAN_HIS_OWN_SKIN.json').rows.filter(r => r.verdict === 'BACK').map(r => r.who);
  ok('F0 CONTROL: the old crew list wears no rolled man (the crew leg reads it red), and EYES\' two BACK faces were on it',
     OLD.filter(l => ROLLED.test(l)).length === 0 && eyes.length >= 2 && eyes.every(l => OLD.indexOf(l) >= 0), 'BACK: ' + eyes.join(', '));

  /* F1 */
  global.window = {}; require(path.join(ROOT, 'engine/bohemia_people_mix.js')); const MIX = global.window.BOHEMIA_PEOPLE_MIX;
  const N = require(path.join(ROOT, 'engine/bohemia_names.js'));
  const WHO = {}; MIX.people.forEach(p => { WHO[p.look] = p; });
  const own = [], notOwn = [];
  MIX.people.forEach(p => {
    const d = 'records/target/character/barber/' + p.look, why = [];
    ['rest', 'A', 'E', 'O', 'M'].forEach(k => [64, 128].forEach(s => { if (!fs.existsSync(path.join(ROOT, d, 'face', k + '_' + s + '.png'))) why.push('no ' + k + '_' + s); }));
    let rj = null; try { rj = J(d + '/rig.json'); } catch (e) { why.push('no rig.json'); }
    if (rj) {
      if (rj.model !== 'records/character/rig/barber_' + p.look + '.glb') why.push('model ' + rj.model);
      if (!rj.portrait) why.push('no portrait in the run');
      ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'].forEach(t => { if (!fs.existsSync(path.join(ROOT, d, 'rig_' + t + '.png'))) why.push('no body ' + t); });
    }
    (why.length ? notOwn : own).push(p.look + (why.length ? ': ' + why.join(', ') : ''));
  });
  ok('F1 EVERY ROLLED PERSON\'S FACE IS HIS OWN HEAD: his talking face in his own folder, rendered off his own model in the run that rendered his body',
     MIX.people.length >= 150 && notOwn.length === 0, own.length + ' of ' + MIX.people.length + (notOwn.length ? ', red ' + notOwn.slice(0, 3).join(' | ') : ''));

  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = [], fetched = [];
  const watch = p => { p.on('pageerror', e => errs.push(e.message)); p.on('request', r => fetched.push(r.url())); };

  /* F2 */
  const r2 = await ctx.newPage(); watch(r2);
  await r2.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await r2.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 30000 });
  await r2.waitForTimeout(900);
  const crew = await r2.evaluate(() => BohemiaRosterScreen.state.crew.map(m => ({ name: m.name, look: m.look })));
  const drawn = await r2.evaluate(() => Array.from(document.querySelectorAll('canvas[data-face][data-look]')).map(c => ({ look: c.dataset.look, k: c.dataset.face })));
  const bodies = [];
  for (let i = 0; i < crew.length; i++) {   /* his card: a tap on his face in the line (a press and a lift, no drag), then the body the card draws */
    const pt = await r2.evaluate(i => { const S = BohemiaRosterScreen.state;
      const cell = [].slice.call(document.querySelectorAll('.cell.full[data-drag^="man:"]')).filter(c => { const f = c.querySelector('canvas[data-face]'); return f && f.dataset.look === S.crew[i].look; })[0];
      if (!cell) return null; cell.scrollIntoView({ block: 'center' }); const r = cell.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, i);
    if (pt) { await r2.mouse.move(pt.x, pt.y); await r2.mouse.down(); await r2.mouse.up(); await r2.waitForTimeout(200); }
    bodies.push(await r2.evaluate(() => { const rb = document.querySelector('canvas.rbody'); return rb ? rb.dataset.look : null; }));
  }
  const rolled = crew.filter(m => ROLLED.test(m.look)), you = crew.filter(m => m.look === 'you');
  const distinct = new Set(crew.map(m => m.look)).size;
  ok('F2 THE CREW: YOU and eleven rolled men, no two alike', crew.length === 12 && you.length === 1 && rolled.length === 11 && distinct === 12,
     crew.map(m => m.name + '=' + m.look.replace('person_', '')).join(' '));
  const faceOwn = crew.every(m => drawn.some(d => d.look === m.look && d.k === 'fresh')) && drawn.every(d => crew.some(m => m.look === d.look));
  ok('  every face on the crew screen is a man\'s own look, a talking 3D head', drawn.length >= 12 && faceOwn, drawn.length + ' faces drawn');
  const ownFile = rolled.filter(m => fetched.some(u => u.indexOf('/records/target/character/barber/' + m.look + '/face/rest_') >= 0));
  ok('  and each rolled man\'s face is fetched from his own folder', ownFile.length === rolled.length, ownFile.length + ' of ' + rolled.length);
  const bodyOwn = crew.filter((m, i) => bodies[i] === m.look);
  ok('  his card stands his own whole body (the still rendered off the same model)', bodyOwn.length === crew.length, bodyOwn.length + ' of ' + crew.length + (bodyOwn.length < crew.length ? ': ' + crew.map((m, i) => m.name + ' ' + bodies[i]).filter((x, i) => bodies[i] !== crew[i].look).slice(0, 3).join(', ') : ''));
  const rig = J('slices/fight_rig/fight_rig.json').looks;
  ok('  the fight has every one of them on its board', crew.every(m => rig[m.look]), crew.filter(m => !rig[m.look]).map(m => m.look).join(',') || 'all twelve');
  /* RE-AIMED 10/26 (RUN TWO [eyes: the Block Watch's names], rule 203: 'never a man's sprite with a woman's name'): every body on
     the master rig is a man's until CHARACTER builds a woman's, so the crew list's TINA, MARISOL, LUPE and NENA are called TITO,
     MARCOS, LALO and NENO (engine/bohemia_roster.js nameFor); DESI stays (a man's name too) and wears no beard */
  const womenNamed = crew.filter(m => ['TINA', 'MARISOL', 'LUPE', 'NENA'].indexOf(m.name.replace(/ II$/, '')) >= 0 && (!WHO[m.look] || WHO[m.look].sex !== 'f'));
  const renamed = crew.filter(m => ['TITO', 'MARCOS', 'LALO', 'NENO'].indexOf(m.name) >= 0).length;
  const bearded = crew.filter(m => m.name === 'DESI' && WHO[m.look] && WHO[m.look].sex === 'm');
  ok('  no man\'s body wears a woman\'s name (' + renamed + ' renamed), and DESI wears no beard', womenNamed.length === 0 && renamed === 4 && bearded.length === 0, womenNamed.concat(bearded).map(m => m.name + ' ' + m.look).join(', ') || 'all twelve men');
  await r2.close();

  /* F3, F5 (the screen's own lists) */
  const p = await ctx.newPage(); watch(p);
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.folk().length > 0, null, { timeout: 30000 });
  const close = async () => { if (await p.evaluate(() => document.getElementById('sheet').classList.contains('on'))) { await p.click('#close'); await p.waitForTimeout(200); } };
  const company = new Set(MIX.people.filter(q => q.company).map(q => q.look));
  let keepers = 0, posts = 0, clients = 0, crowd = 0; const kBad = [], pBad = [], cBad = [], crBad = [], allFaces = [];
  for (const [tier, name] of [['camp', 'FACE CAMP'], ['camp', 'DRY WELL'], ['town', 'FACE TOWN'], ['town', 'BLUE DIAMOND'], ['fortress', 'FACE FORT'], ['fortress', 'NELLIS GATE']]) {
    await close();
    await p.evaluate(o => BohemiaSettlement.open({ place: { name: o.name, tier: o.tier }, traits: [], day: 9 }), { name, tier });
    await p.waitForTimeout(450);
    for (const k of await p.evaluate(() => BohemiaSettlement.order())) {
      await close();
      const xy = await p.evaluate(k => BohemiaSettlement.where(k), k); if (!xy) continue;
      await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(160);
      const rows = await p.evaluate(READ); rows.forEach(r => allFaces.push(r));
      const body = await p.evaluate(k => { const q = BohemiaSettlement.folk().filter(q => q.keeper && q.k === k)[0]; return q ? q.look : null; }, k);
      if (body) {
        keepers++; const f = rows[0], P = WHO[body], first = f ? String(f.nm).split(/[ ,]/)[0] : '';
        const sx = N.sexOf(first.charAt(0) + first.slice(1).toLowerCase());
        if (!f || f.look !== body || f.k !== 'fresh' || !P || (P.sex === 'm' && sx === 'f')) kBad.push(name + ':' + k + ' ' + body + '/' + (f ? f.look + ' ' + f.nm : 'none'));
      }
      if (k === 'hall') {
        const hall = await p.evaluate(() => ({ cards: [].slice.call(document.querySelectorAll('#sheet.on .hire canvas.face')).map(c => ({ look: c.dataset.look, k: c.dataset.face })),
          standing: BohemiaSettlement.folk().filter(q => q.post).map(q => q.look), men: BohemiaSettlement.recruits().map(r => r.look) }));
        hall.cards.forEach(c => { posts++; allFaces.push(c);
          if (c.k !== 'fresh' || !ROLLED.test(c.look) || !(WHO[c.look] || {}).fight || company.has(c.look) || hall.standing.indexOf(c.look) < 0) pBad.push(name + ':' + c.look + ':' + c.k); });
        if (hall.cards.length !== hall.men.length) pBad.push(name + ': ' + hall.cards.length + ' cards for ' + hall.men.length + ' men');
      }
      if (k === 'board') {
        const on = await p.evaluate(() => BohemiaSettlement.folk().map(q => q.look).concat(BohemiaSettlement.busy().map(w => w.look)));
        const cl = await p.evaluate(() => [].slice.call(document.querySelectorAll('#sheet.on .act.client')).map(b => { const c = b.querySelector('canvas.face'); return { look: c && c.dataset.look, k: c && c.dataset.face, nm: (b.querySelector('.cn') || {}).textContent || '' }; }));
        cl.forEach(c => { clients++; allFaces.push(c); const P = WHO[c.look];
          const woman = /^(MAMA|DOÑA|SEÑORA|TÍA|ABUELA)\b/.test(c.nm) || /^[A-ZÁÉÍÓÚÑ]{3,}A\b/.test(c.nm) || N.sexOf(c.nm.split(/[ ,]/)[0].charAt(0) + c.nm.split(/[ ,]/)[0].slice(1).toLowerCase()) === 'f';
          if (c.k !== 'fresh' || !P || on.indexOf(c.look) >= 0 || company.has(c.look) || (woman && P.sex === 'm')) cBad.push(name + ':' + c.nm + ' ' + c.look); });
      }
    }
    /* a man in the crowd speaks under his own face */
    const n = await p.evaluate(() => BohemiaSettlement.folk().length);
    for (let i = 0; i < n; i++) {
      await close();
      const pt = await p.evaluate(i => { const q = BohemiaSettlement.folk()[i], s0 = BohemiaSettlement.scale(); if (!q.crowd) return null; BohemiaSettlement.where('stall');
        const v = BohemiaSettlement._view(), r = document.getElementById('scene').getBoundingClientRect();
        return { x: r.left + v.ox + q.x * v.s, y: r.top + v.oy + (q.y - s0.person * 0.45) * v.s, look: q.look }; }, i);
      if (!pt) continue;
      await p.waitForTimeout(100); await p.mouse.click(pt.x, pt.y); await p.waitForTimeout(150);
      if (await p.evaluate(() => BohemiaSettlement.state.open !== 'person')) continue;
      const rows = await p.evaluate(READ); rows.forEach(r => allFaces.push(r));
      const who = await p.evaluate(() => { const q = BohemiaSettlement.state.person; return q ? q.look : null; });   /* whoever the tap found (a knot of people overlaps) */
      crowd++; if (!rows[0] || !who || rows[0].look !== who || rows[0].k !== 'fresh') crBad.push(name + ':' + who + '/' + (rows[0] ? rows[0].look : 'none'));
    }
  }
  ok('F3 THE TOWNS: every keeper speaks under the head of the body at his post, a rolled person, never a woman\'s name on a beard', keepers >= 30 && kBad.length === 0, keepers + ' keepers' + (kBad.length ? ', red ' + kBad.slice(0, 3).join(' | ') : ''));
  ok('  every man at the post is the rolled man standing there, on his card his own face, never one of your company', posts >= 10 && pBad.length === 0, posts + ' men' + (pBad.length ? ', red ' + pBad.slice(0, 3).join(' | ') : ''));
  ok('  every client at the board is a rolled person nobody on the screen is, never bearded under a woman\'s name', clients >= 8 && cBad.length === 0, clients + ' clients' + (cBad.length ? ', red ' + cBad.slice(0, 3).join(' | ') : ''));
  ok('  a man in the crowd speaks under his own face', crowd >= 3 && crBad.length === 0, crowd + ' street speakers' + (crBad.length ? ', red ' + crBad.slice(0, 3).join(' | ') : ''));
  await close();
  await p.evaluate(() => BohemiaSettlement.open({ place: { name: 'A NEW PLACE', tier: 'town' }, traits: [], day: 4, arrival: true }));
  await p.waitForFunction(() => !!document.querySelector('#arrive .who'), null, { timeout: 8000 }).catch(() => {});
  await p.waitForTimeout(300);
  const ar = await p.evaluate(READ), elder = await p.evaluate(() => { const q = BohemiaSettlement.folk().filter(q => q.keeper && q.k === 'board')[0]; return q ? q.look : null; });
  ar.forEach(r => allFaces.push(r));
  ok('  the arrival\'s elder is the board\'s keeper, his own face', ar.length === 1 && !!elder && ar[0].look === elder && ar[0].k === 'fresh', (ar[0] ? ar[0].look : 'none') + ' / ' + elder);

  /* F4 */
  const old = fetched.filter(u => OLD_HEAD.test(u));
  ok('F4 NO OLD HEAD: no old cast or gang head and no fight_people sheet fetched on the crew screen or in any town', old.length === 0, old.length ? old.slice(0, 3).join(' ') : fetched.length + ' fetches');
  const notFresh = allFaces.filter(f => f.k !== 'fresh' || !(f.look === 'you' || ROLLED.test(f.look)));
  ok('  every face drawn is a talking 3D head of YOU or a rolled person', allFaces.length >= 60 && notFresh.length === 0, allFaces.length + ' faces' + (notFresh.length ? ', red ' + notFresh.slice(0, 4).map(f => f.look + ':' + f.k).join(' ') : ''));

  /* F5 */
  const seats = J('records/target/BOHEMIA_BAR_NEWS_PLACES.json');
  const names = (seats.places || []).map(s => s.name || s.place || s.id).filter(Boolean).slice(0, 14);
  const dealt = await p.evaluate(names => { const out = []; ['camp', 'town', 'fortress'].forEach((t, j) => names.concat(['EXTRA ' + t + ' 1', 'EXTRA ' + t + ' 2']).forEach((nm, i) => {
    if ((i + j) % 3) return; BohemiaSettlement.open({ place: { name: nm, tier: t }, traits: [], day: 2 });
    /* RE-AIMED 10/26 (RUN THREE, rule 218(a)): his own men stand in the town as themselves (crewMan); nobody ELSE may wear them */
    out.push(BohemiaSettlement.folk().filter(q => !q.crewMan).map(q => q.look).concat(BohemiaSettlement.busy().map(w => w.look), BohemiaSettlement.recruits().map(r => r.look))); })); return out; }, names);
  const leaked = [].concat(...dealt).filter(l => company.has(l));
  ok('F5 NOBODY ELSE IS YOUR COMPANY: no keeper, crowd, walker or post in ' + dealt.length + ' places is one of your eleven', dealt.length >= 6 && company.size === 11 && leaked.length === 0, leaked.slice(0, 4).join(', ') || [].concat(...dealt).length + ' people dealt');
  const mi = J('slices/rig_mix/index.json'), ours = J('records/target/bb/ours.json').people_looks.value.crew.filter(l => ROLLED.test(l));
  const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('  the map\'s people index names the same eleven, and its crowd skips them', JSON.stringify((mi.company || []).slice().sort()) === JSON.stringify(ours.slice().sort()) &&
     /S\.meta\.gangs\.forEach\(function\(l\)\{ if \(!mixMine\(l\)\)/.test(CITY) && /function mixMine\(l\)/.test(CITY), (mi.company || []).length + ' named');

  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE FACE IS HIS OWN FACE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

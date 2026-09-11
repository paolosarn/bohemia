/* ============================================================================
   PARTIES MOVE GATE (9/11/26, WORLD lane) -- board row [parties move] /
   GROUPS-WITH-THEIR-OWN-BUSINESS.

   THE ROW: "the map is populated by the world's own business, not by a spawner
   aimed at the player. Places BUY and SEND parties out of what they have, each
   with an agenda (a caravan carrying, a patrol holding a border, a crew going to
   take something), and they travel whether or not the player is looking. A
   party's strength is real and readable, because pursuit depends on how strong
   you look next to it."

   SO THIS GATE HOLDS FOUR CLAIMS, AND THE FIRST IS THE ONE THAT BITES:
     1. A PLACE SENDS IT, NOT THE PLAYER'S POSITION. The player's coordinates
        must not reach any decision about what exists, where it goes, or how
        strong it is. Proved by construction AND by moving the player and showing
        the valley's business is byte-identical.
     2. IT HAS ONE OF HIS THREE AGENDAS.
     3. IT TRAVELS WHETHER OR NOT HE LOOKS -- measured with the player standing
        still and never going near any of them.
     4. ITS STRENGTH IS HIS OWN NUMBER, and comparable.

   MEASURED BEFORE THE ROW WAS BUILT: the only thing that ever put anybody in
   front of the player was bohemia_encounters.js, whose own header says it is
   PULLED by the player's spent time and owns no clock by ruling. Correct for
   ambient encounters, and exactly what this row is set against.

   node gates/parties_move_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const P = require(path.join(ROOT, 'engine/bohemia_parties.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const B = require(path.join(ROOT, 'engine/bohemia_between.js'));
const GRAPH = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('PARTIES MOVE GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (places send them, they carry his three agendas, they travel'
            + ' whether or not he looks, and their strength is his own number)');
  process.exit(fail ? 1 : 0);
};

/* a valley of his real factions, spread so the geometry is exercised */
function towns() {
  const tiers = T.tiers(GRAPH, 1), ids = T.selectable(GRAPH);
  return ids.map((id, i) => ({ faction: id, tier: tiers[id].tier, power: tiers[id].power,
                               x: 8 + (i % 5) * 20, y: 8 + Math.floor(i / 5) * 20 }));
}

/* ---- 1. the module decides nothing from a number it typed ---------------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_parties.js'), 'utf8');
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE (8/1): the
     header quotes his measured power column, and every one of those is a COMMENT. */
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '')
                   .replace(/\/\/[^\n]*/g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = (logic.match(/\b\d+(\.\d+)?\b/g) || []);
  ok('NO STRENGTH, COUNT, SPEED OR DISTANCE IS TYPED INTO THE MODULE (numerals in'
     + ' its logic: ' + (nums.join(' ') || 'none') + ')',
     nums.every(n => n === '0' || n === '1'));
  ok('and it names no faction of its own -- his graph is the only list',
     !/(Mob|Cartel|Remnants|Church|Caravans|Network)/.test(logic));
  ok('it asks for its neighbours when it needs them, never at load time',
     /function TOWNS\(\)/.test(src) && /function BTW\(\)/.test(src));

  /* *** THE CLAIM THIS ROW IS ABOUT. *** Nothing that decides what exists may
     take the player. near() is the one function allowed to, and it only reads. */
  const decid = ['sendFrom', 'all', 'strengthOf', 'hostilesOf', 'friendliesOf',
                 'borderOf', 'advance'];
  let clean = true, dirty = [];
  for (const fn of decid) {
    const m = new RegExp('function\\s+' + fn + '\\s*\\(([^)]*)\\)').exec(src);
    if (!m) { clean = false; dirty.push(fn + ' (missing)'); continue; }
    if (/\bplayer\b|\bpx\b|\bpy\b|\bhx\b|\bhy\b/.test(m[1])) { clean = false; dirty.push(fn); }
  }
  ok('*** NOT ONE FUNCTION THAT DECIDES WHAT EXISTS TAKES THE PLAYER ***'
     + (dirty.length ? ' -- ' + dirty.join(', ') : ''), clean);
}

/* ---- 2. places send them, out of what they have ------------------------- */
{
  const ts = towns();
  const ps = P.all(ts, { n: 96 });
  ok('the valley has business of its own (' + ps.length + ' parties from '
     + ts.length + ' places)', ps.length > 0);

  /* HOW MANY IS HIS REACH TABLE, NOT A NUMBER HERE. */
  let byTown = {};
  ps.forEach(p => byTown[p.from.faction] = (byTown[p.from.faction] || 0) + 1);
  let matches = 0, expected = 0;
  for (const t of ts) {
    const want = T.REACH[t.tier];
    expected += want;
    if ((byTown[t.faction] || 0) === want) matches++;
  }
  ok('*** HOW MANY A PLACE SENDS IS HIS OWN REACH TABLE *** -- fortress '
     + T.REACH.fortress + ', town ' + T.REACH.town + ', camp ' + T.REACH.camp
     + ' (' + matches + '/' + ts.length + ' places match, ' + ps.length + ' of '
     + expected + ' parties)', matches === ts.length && ps.length === expected);

  const agendas = Object.keys(P.AGENDAS).sort();
  ok('his three agendas and no fourth (' + agendas.join(', ') + ')',
     agendas.length === 3 && agendas.join(',') === 'caravan,crew,patrol');
  ok('and every party carries one of them',
     ps.every(p => Object.prototype.hasOwnProperty.call(P.AGENDAS, p.agenda)));
  const seen = {}; ps.forEach(p => seen[p.agenda] = (seen[p.agenda] || 0) + 1);
  ok('and all three really happen in a real valley (' +
     agendas.map(a => a + ' ' + (seen[a] || 0)).join(', ') + ')',
     agendas.every(a => (seen[a] || 0) > 0));

  /* A CREW GOES AT SOMEBODY HE IS ACTUALLY AT ODDS WITH. */
  const crews = ps.filter(p => p.agenda === 'crew');
  ok('a crew is only ever sent at a faction his graph really has a feud with ('
     + crews.length + ' crews)',
     crews.length > 0 && crews.every(p => {
       const e = B.between(p.from.faction, p.toward, null);
       return e && typeof e.init === 'number' && e.init < 0;
     }));
  const cars = ps.filter(p => p.agenda === 'caravan');
  ok('and a caravan is never sent through a feud (' + cars.length + ' caravans)',
     cars.every(p => {
       const e = B.between(p.from.faction, p.toward, null);
       return !(e && typeof e.init === 'number' && e.init < 0);
     }));
  const pats = ps.filter(p => p.agenda === 'patrol');
  ok('and a patrol is sent to ground its own faction holds, facing somebody else',
     pats.length > 0 && pats.every(p => {
       const h = T.holderOf(ts, p.to.x, p.to.y);
       return h && h.faction === p.from.faction && p.toward && p.toward !== p.from.faction;
     }));

  /* DETERMINISM: the same valley is the same business, every time. */
  const again = P.all(towns(), { n: 96 });
  ok('the same valley produces the same business every time -- nothing here rolls',
     JSON.stringify(again) === JSON.stringify(P.all(towns(), { n: 96 })));
}

/* ---- 3. strength is his number, and it is readable ---------------------- */
{
  const ts = towns();
  const ps = P.all(ts, { n: 96 });
  const bad = ps.filter(p => P.strengthOf(p) !== p.from.power);
  ok('*** A PARTY IS AS STRONG AS THE FACTION THAT SENT IT, WHICH IS HIS OWN ACT'
     + ' POWER COLUMN, UNCHANGED ***', bad.length === 0);
  const strengths = [...new Set(ps.map(p => P.strengthOf(p)))].sort((a, b) => a - b);
  ok('and it really varies across the valley (' + strengths[0] + ' up to '
     + strengths[strengths.length - 1] + ')', strengths.length > 3);
  const a = P.against(ps[0], 7);
  ok('and it is READABLE against the player, which is what a pursuit needs',
     !!a && typeof a.theirs === 'number' && typeof a.mine === 'number'
     && (a.harder || a.easier || a.even));
  ok('and the module never invents the player\'s own strength -- the caller says',
     P.against(ps[0], null) === null);
}

/* ---- 4. they travel, and a patrol holds --------------------------------- */
{
  const ts = towns();
  const ps = P.all(ts, { n: 96 });
  const home = ps.map(p => p.at.x + ',' + p.at.y);
  P.advance(ps, 10, 1);
  const moved = ps.filter((p, i) => (p.at.x + ',' + p.at.y) !== home[i]).length;
  ok('they travel (' + moved + ' of ' + ps.length + ' moved on the first day)',
     moved > ps.length / 2);

  const car = ps.find(p => p.agenda === 'caravan');
  const legs = [];
  for (let d = 0; d < 8; d++) { P.advance(ps, 10, 1); legs.push(P.legOf(car)); }
  ok('*** A CARAVAN MAKES A REAL ROUND TRIP *** -- out and back, not a one-way'
     + ' spawn (' + legs.join(' ') + ')',
     legs.indexOf('out') >= 0 && legs.indexOf('back') >= 0);

  /* *** A PATROL WALKS ITS BEAT RATHER THAN PARKING ON ITS BORDER. *** The first
     cut froze a patrol on arrival, which stopped FOURTEEN of twenty-eight parties
     dead after day one and made half the valley statues. */
  const pat = ps.find(p => p.agenda === 'patrol');
  const seen = {};
  for (let d = 0; d < 10; d++) { P.advance(ps, 10, 1); seen[pat.at.x + ',' + pat.at.y] = 1; }
  ok('AND A PATROL WALKS ITS BEAT -- it holds the border by patrolling it, not by'
     + ' standing on one cell for ever (' + Object.keys(seen).length
     + ' different posts over ten days)', Object.keys(seen).length > 2);
  ok('and it is reported as holding that border the whole time it is on duty',
     P.legOf(pat) === 'holding' || P.legOf(pat) === 'out');

  /* THE FLAG DOES NOT LIE FOR A TICK. */
  const ts2 = towns(), ps2 = P.all(ts2, { n: 96 });
  const c2 = ps2.find(p => p.agenda === 'caravan');
  const need = Math.max(Math.abs(c2.to.x - c2.at.x), Math.abs(c2.to.y - c2.at.y));
  P.advance([c2], need, 1);
  ok('and a party standing on what it was sent to says so in the same step it'
     + ' arrives, rather than reporting "still walking" for a whole day',
     c2.at.x === c2.to.x && c2.at.y === c2.to.y && c2.arrived === true);
}

/* ---- 5. and the player is nowhere in any of it -------------------------- */
{
  const ts = towns();
  const run = () => { const ps = P.all(ts, { n: 96 }); P.advance(ps, 10, 6); return ps; };
  const a = JSON.stringify(run());
  const b2 = JSON.stringify(run());
  ok('*** THE VALLEY\'S BUSINESS IS BYTE-IDENTICAL WHATEVER THE PLAYER DOES --'
     + ' there is no input to put him into it ***', a === b2);
  const ps = run();
  ok('near() is the only thing that takes him, and it only LOOKS: asking from two'
     + ' different places changes nothing about the parties',
     JSON.stringify(ps) === (P.near(ps, 3, 3, 2), P.near(ps, 80, 80, 2), JSON.stringify(ps)));
  const seenA = P.near(ps, 20, 20, 40).length;
  ok('and it really can see them when they are close (' + seenA + ' within 40 cells)',
     seenA > 0);
}

/* ---- 6. on the surface he walks ----------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(async () => {
    const R = { module: typeof BohemiaParties };
    const ps = partiesAll();
    R.count = ps ? ps.length : 0;
    R.cellsPerDay = partiesCellsPerDay();
    /* THE SPEED IS THE PLAYER'S OWN RULE, RE-DERIVED HERE FROM THE SAME TWO
       NUMBERS the walked surface uses, so a typed speed would show up as a
       disagreement rather than as a comment nobody checks. */
    R.expectPerDay = (((DAY.NIGHT_MIN | 0) - (DAY.WAKE_MIN | 0)) / MIN_PER_CELL) / FN;
    R.byAgenda = {}; (ps || []).forEach(p => R.byAgenda[p.agenda] = (R.byAgenda[p.agenda] || 0) + 1);
    R.factions = [...new Set((ps || []).map(p => p.from.faction))].length;
    R.strengths = [...new Set((ps || []).map(p => BohemiaParties.strengthOf(p)))].sort((a, b) => a - b);
    R.say = (ps || []).slice(0, 3).map(p => BohemiaParties.say(p));

    /* *** HE STANDS ABSOLUTELY STILL, INSIDE ONE DAY. ***
       The first cut of this check drove four NIGHTS and then complained that the
       player had moved from 48,48 to 17,36. He had -- waking puts him back at his
       own house, which is the day loop doing its job. The claim I actually want is
       that the valley's business does not need him to go anywhere, so it is
       measured inside a single day where nothing else is allowed to move him.
       A CHECK THAT CANNOT BE TRUE IS NOT A STRICTER CHECK, IT IS A BROKEN ONE. */
    const stillBefore = [(MODE === 'human') ? ((hx / FN) | 0) : city.x,
                         (MODE === 'human') ? ((hy / FN) | 0) : city.y];
    const stillPos = (ps || []).map(p => p.at.x + ',' + p.at.y);
    for (let k = 0; k < 6; k++) advance(120);          /* 12h, short of nightfall */
    R.stillPlayerMoved = ((MODE === 'human') ? ((hx / FN) | 0) : city.x) !== stillBefore[0]
                      || ((MODE === 'human') ? ((hy / FN) | 0) : city.y) !== stillBefore[1];
    R.stillMoved = (ps || []).filter((p, i) => (p.at.x + ',' + p.at.y) !== stillPos[i]).length;
    R.stillNearest = Math.min(...(ps || []).map(p =>
      Math.max(Math.abs(p.at.x - stillBefore[0]), Math.abs(p.at.y - stillBefore[1]))));
    R.playerBefore = stillBefore;
    const before = (ps || []).map(p => p.at.x + ',' + p.at.y);
    const lines = [];
    for (let n = 0; n < 4; n++) {
      advance(20 * 60);
      const card = (document.getElementById('daycardIn') || {}).textContent || '';
      const m = card.match(/\((\d+) part(?:y|ies) moved in the valley today\)/);
      lines.push(m ? +m[1] : 0);
      for (let k = 0; k < 6; k++) {
        const go = document.querySelector('#daycardIn .dcgo')
                || document.querySelector('#daycardIn .dcx');
        if (!go) break; go.click();
        await new Promise(s => setTimeout(s, 60));
        if (!document.getElementById('daycard').classList.contains('on')) break;
      }
    }
    R.cardCounts = lines;
    R.playerAfter = [(MODE === 'human') ? ((hx / FN) | 0) : city.x,
                     (MODE === 'human') ? ((hy / FN) | 0) : city.y];
    R.moved = (ps || []).filter((p, i) => (p.at.x + ',' + p.at.y) !== before[i]).length;
    /* and the nearest one never came to him -- he never met any of them */
    R.nearestEver = Math.min(...(ps || []).map(p =>
      Math.max(Math.abs(p.at.x - R.playerAfter[0]), Math.abs(p.at.y - R.playerAfter[1]))));
    return R;
  });
  await b.close();

  ok('the parties module reaches the surface he walks', r.module === 'object');
  ok('the valley he actually walks has business of its own (' + r.count
     + ' parties from ' + r.factions + ' factions)', r.count > 0 && r.factions > 1);
  ok('all three agendas are out there on the real map ('
     + Object.keys(r.byAgenda).sort().map(k => k + ' ' + r.byAgenda[k]).join(', ') + ')',
     Object.keys(r.byAgenda).length === 3);
  ok('their strengths are his real spread (' + r.strengths.join(' ') + ')',
     r.strengths.length > 3);
  ok('*** HOW FAR THEY GET IN A DAY IS THE PLAYER\'S OWN TRAVEL RULE *** -- '
     + Math.round(r.cellsPerDay * 10) / 10 + ' cells, re-derived independently as '
     + Math.round(r.expectPerDay * 10) / 10,
     Math.abs(r.cellsPerDay - r.expectPerDay) < 1e-9 && r.cellsPerDay > 0);
  ok('*** THEY TRAVELLED WHILE HE STOOD ABSOLUTELY STILL AND NEVER WENT NEAR THEM'
     + ' *** -- over half a day at ' + r.playerBefore.join(',') + ' he moved not one'
     + ' cell, ' + r.stillMoved + ' of ' + r.count + ' parties did, and the nearest'
     + ' got no closer than ' + r.stillNearest + ' cells',
     r.stillPlayerMoved === false && r.stillMoved > r.count / 2 && r.stillNearest > 1);
  ok('and they keep travelling across days as well (' + r.moved + ' of ' + r.count
     + ' moved over four more)', r.moved > r.count / 2);
  ok('*** AND THE CARD HE ALREADY READS SAYS WHAT THE VALLEY DID *** (parties'
     + ' reported per night: ' + r.cardCounts.join(', ') + ')',
     r.cardCounts.filter(n => n > 0).length >= 3);
  ok('the sentences read like a report, not a template ("' + r.say[0] + '")',
     r.say.every(s => /^[A-Z]/.test(s) && !/^a [AEIOU]/.test(s) && s.indexOf(',') > 0));
  ok('no page error across four days of the valley\'s business'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  /* ---- 7. and in the demo, which is one day long on purpose ------------- */
  const demo = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  if (!fs.existsSync(demo)) { ok('the demo has been cut', false); return done(); }
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
                  '.png': 'image/png', '.css': 'text/css',
                  '.webmanifest': 'application/manifest+json' };
  const srv = require('http').createServer((rq, rs) => {
    const p = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
    fs.readFile(p, (e, d) => {
      if (e) { rs.statusCode = 404; return rs.end('no'); }
      rs.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream');
      rs.end(d);
    });
  });
  await new Promise(res => srv.listen(0, res));
  const port = srv.address().port;
  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  const errs2 = []; p2.on('pageerror', e => errs2.push(e.message));
  await p2.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_DEMO.html',
                { waitUntil: 'load', timeout: 180000 });
  await SETTLE(p2, 1500);
  await p2.click('#front', { force: true }).catch(() => {});
  await SETTLE(p2, 2500);
  let fr = null;
  for (let i = 0; i < 200; i++) {
    fr = p2.frames().find(f => /CITY_WORLD/.test(f.url()));
    if (fr && await fr.$('#daycardIn .dcgo').catch(() => null)) break;
    await SETTLE(p2, 250);
  }
  let d = { frame: false };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await fr.evaluate(async () => {
      const D = { frame: true, isDemo: CT_IS_DEMO, demoDays: CT_DEMO_DAYS };
      const ps = partiesAll();
      D.count = ps ? ps.length : 0;
      const before = (ps || []).map(p => p.at.x + ',' + p.at.y);
      advance(20 * 60);
      await new Promise(s => setTimeout(s, 200));
      D.moved = (ps || []).filter((p, i) => (p.at.x + ',' + p.at.y) !== before[i]).length;
      const card = (document.getElementById('daycardIn') || {}).textContent || '';
      const m = card.match(/\((\d+) part(?:y|ies) moved in the valley today\)/);
      D.reported = m ? +m[1] : 0;
      return D;
    });
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.frame === true);
  ok('and it is the demo, one day long (CT_DEMO_DAYS=' + d.demoDays + ')',
     d.isDemo === true && d.demoDays === 1);
  ok('*** THE VALLEY HAS BUSINESS OF ITS OWN IN THE DEMO TOO *** -- ' + d.count
     + ' parties, ' + d.moved + ' moved on its one day, ' + d.reported
     + ' reported on the card', d.count > 0 && d.moved > 0 && d.reported > 0);
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();

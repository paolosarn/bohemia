/* ============================================================================
   OWN POWER GATE (9/12/26, WORLD lane) -- board row [own power] /
   YOUR-OWN-POWER-IS-YOUR-WAY-OUT.

   THE ROW, off the 9/5 generator-mafia research: the Lebanese families who built
   their own rooftop solar were buying their way out of the block's owner. "A power
   building you place on your land takes you OFF the block's line: the monthly cut
   stops, your batteries are yours, and the faction that owned the line notices (a
   standing hit, a visit)."

   BOTH HALVES IT NEEDED WERE ALREADY BUILT AND THIS IS THE JOIN:
     [block rent] 9/12 (FACTIONS)   living on a faction's ground costs a cut,
                                    billed per BLOCK through BohemiaTowns.rentOn
     [batteries mined] 9/11 (mine)  solar, battery farm and substation mint

   So this is not a new charge and not a new table. It is THE SAME BILL with your
   own blocks taken out of it, which is why rentOn() is never touched: it belongs
   to another lane and it is already right.

   AND WHAT IS HIS IS NOT INVENTED. "A standing hit, a visit" is a WEIGHT and an
   ENCOUNTER. bohemia_standing.js ships DEED_WEIGHT empty and says why; [block
   rent] made the same call one row earlier in its own words. This gate holds that
   line: the noticing is real, named and said out loud, and NOTHING here writes a
   standing number.

   node gates/own_power_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const OP = require(path.join(ROOT, 'engine/bohemia_ownpower.js'));
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const ST = require(path.join(ROOT, 'engine/bohemia_standing.js'));
const GRAPH = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'), 'utf8'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('OWN POWER GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (a generator on your land takes that block off the line, the same'
            + ' bill with your own blocks out of it, and no weight nobody ruled)');
  process.exit(fail ? 1 : 0);
};

function towns() {
  const tiers = T.tiers(GRAPH, 1), ids = T.selectable(GRAPH);
  return ids.map((id, i) => ({ faction: id, tier: tiers[id].tier, power: tiers[id].power,
                               x: 8 + (i % 5) * 20, y: 8 + Math.floor(i / 5) * 20 }));
}

/* ---- 1. it invents no weight and touches no other lane's rule ----------- */
{
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_ownpower.js'), 'utf8');
  const logic = src.replace(/\/\*[\s\S]*?\*\//g, '')
                   .replace(/\/\/[^\n]*/g, '')
                   .replace(/'(?:\\.|[^'\\])*'/g, "''");
  const nums = (logic.match(/\b\d+(\.\d+)?\b/g) || []);
  ok('NO PRICE, RATE OR WEIGHT IS TYPED INTO THE MODULE (numerals in its logic: '
     + (nums.join(' ') || 'none') + ')', nums.every(n => n === '0' || n === '1'));

  /* *** THE LINE THIS ROW MUST NOT CROSS. *** */
  ok('*** IT WRITES NO STANDING AND NO DEED WEIGHT -- the hit is a weight and'
     + ' weights are his ***',
     !/BohemiaStanding|DEED_WEIGHT|witness\s*\(|standing\s*[-+]?=/.test(logic));
  ok('and DEED_WEIGHT is still empty, which is why ('
     + Object.keys(ST.DEED_WEIGHT).length + ' weights ruled)',
     Object.keys(ST.DEED_WEIGHT).length === 0);
  ok('it never calls the encounter director either -- the visit is his too',
     !/Encounter|encounters/i.test(logic));
  ok('*** AND IT NEVER TOUCHES rentOn, WHICH IS ANOTHER LANE\'S RULE *** -- it'
     + ' hands that function a smaller `used` and reads its answer',
     !/function\s+rentOn/.test(src) && /rentOn\s*\(/.test(src));
  ok('it asks for its neighbours when it needs them, never at load time',
     /function POWERB\(\)/.test(src) && /function TOWNS\(\)/.test(src));
}

/* ---- 2. which ground you are off the line on --------------------------- */
{
  const ts = towns();
  const here = T.holderOf(ts, 10, 10).faction;
  const edits = { cells: { '10,10': 'solar', '11,10': 'battery', '12,10': 'substation',
                           '50,50': 'suburb' } };
  const off = OP.offBlocks(edits, ts, null);
  ok('a power building you placed takes its block off the line (' + off.total
     + ' blocks, ' + JSON.stringify(off.byFaction) + ')', off.total === 3);
  ok('*** AND A BUILDING THAT IS NOT A POWER BUILDING TAKES NOTHING OFF *** -- a'
     + ' house does not generate', !off.blocks.some(b => b.type === 'suburb'));
  ok('and the ground it is on is answered by BB-TURF, which covers the whole'
     + ' valley (' + here + ')', off.blocks.every(b => b.faction === here));

  /* TWO GENERATORS ON ONE BLOCK IS ONE BLOCK, because the bill counts blocks. */
  const one = OP.offBlocks(edits, ts, () => [0, 0]);
  ok('*** AND TWO GENERATORS ON ONE BLOCK IS ONE BLOCK, because the bill counts'
     + ' blocks *** (' + one.total + ')', one.total === 1);
  ok('with nothing placed it takes nothing off, rather than guessing',
     OP.offBlocks({ cells: {} }, ts, null).total === 0);
  ok('and with no towns it answers empty rather than throwing',
     OP.offBlocks(edits, [], null).total === 0);
}

/* ---- 3. the same bill, with your own blocks out of it ------------------ */
{
  const ts = towns();
  const here = T.holderOf(ts, 10, 10).faction;
  const used = {}; used[here] = 9; used.Mob = 4;
  const edits = { cells: { '10,10': 'solar', '11,10': 'battery' } };
  const off = OP.offBlocks(edits, ts, null);

  const cut = OP.discount(used, off);
  ok('the blocks you power come out of what they can bill you for ('
     + JSON.stringify(used) + ' -> ' + JSON.stringify(cut) + ')',
     cut[here] === used[here] - off.byFaction[here] && cut.Mob === 4);
  ok('*** AND IT CAN NEVER GO BELOW ZERO -- you cannot be off the line on more of'
     + ' their ground than you stood on, and a negative would PAY you rent ***',
     (function () { const o = { byFaction: {} }; o.byFaction[here] = 99;
                    return OP.discount(used, o)[here] === 0; })());

  const s = OP.saved(used, off, ts);
  ok('*** IT REALLY COSTS THEM: the bill goes ' + s.was + ' to ' + s.now + ' ***',
     s.saved > 0 && s.now < s.was);
  ok('and the saving is ASKED of the rent rule both ways rather than worked out'
     + ' twice -- whatever a fortress charges, this is the real difference',
     s.was === T.rentOn(used, ts).total && s.now === T.rentOn(cut, ts).total);
  ok('with nothing off the line it saves nothing and says nothing',
     OP.saved(used, { byFaction: {} }, ts).saved === 0
     && OP.say({ total: 0 }, null) === '');

  ok('and it names who noticed (' + OP.noticed(off).join(', ') + ')',
     OP.noticed(off).length === 1 && OP.noticed(off)[0] === here);
  const said = OP.say(off, s);
  ok('and says it in words a player reads -- "' + said + '"',
     /run on your own power now/.test(said) && /noticed/.test(said)
     && new RegExp(here).test(said));
}

/* ---- 4. on the surface he walks, and in the demo ----------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(page, frame) {
    const ctx = frame || page;
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaOwnPower };
      const seats = turfSeats();
      const cx = (MODE === 'human') ? ((hx / FN) | 0) : city.x;
      const cy = (MODE === 'human') ? ((hy / FN) | 0) : city.y;
      for (let d = 0; d < 12; d++) turfNote(cx + d, cy);
      R.used = JSON.parse(JSON.stringify(TURF_USED));

      const p = purseGet();
      BohemiaPurse.credit(p, 'electricity', 40, 'gate:float', null, DAY.day);
      const b1 = BohemiaPurse.balances(p).electricity;
      blockRent();
      R.plain = b1 - BohemiaPurse.balances(p).electricity;

      if (!EDITS.cells) EDITS.cells = {};
      for (let d = 0; d < 12; d++) EDITS.cells[(cx + d) + ',' + cy] = 'solar';
      BohemiaPurse.credit(p, 'electricity', 40, 'gate:float', null, DAY.day);
      const b2 = BohemiaPurse.balances(p).electricity;
      blockRent();
      R.off = b2 - BohemiaPurse.balances(p).electricity;
      R.offLine = OFF_LINE ? { total: OFF_LINE.total, byFaction: OFF_LINE.byFaction } : null;
      R.saved = OFF_SAVED;
      R.say = BohemiaOwnPower.say(OFF_LINE, OFF_SAVED);

      advance(20 * 60);
      await new Promise(s => setTimeout(s, 200));
      R.card = (document.getElementById('daycardIn') || {}).textContent || '';
      return R;
    });
  }

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);
  const r = await drive(pg, null);
  await b.close();

  ok('the own power module reaches the surface he walks', r.module === 'object');
  ok('he really is billed for standing on their ground (' + r.plain
     + ' batteries across ' + JSON.stringify(r.used) + ')', r.plain > 0);
  ok('*** AND A GENERATOR ON HIS OWN GROUND TAKES THOSE BLOCKS OFF THE LINE ***'
     + ' (' + JSON.stringify(r.offLine && r.offLine.byFaction) + ')',
     !!r.offLine && r.offLine.total > 0);
  ok('*** SO THE CUT REALLY STOPS: the bill goes ' + r.plain + ' to ' + r.off
     + ' on the surface he walks ***', r.off < r.plain);
  ok('and the saving the card claims is the real difference',
     !!r.saved && r.saved.saved === r.plain - r.off);
  ok('*** AND THE CARD HE ALREADY READS SAYS SO *** -- "' + r.say + '"',
     /run on your own power now/.test(r.card) && /noticed/.test(r.card));
  ok('no page error' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  /* the demo */
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
  let d = { module: 'none' };
  if (fr) {
    await fr.$eval('#daycardIn .dcgo', el => el.click());
    await SETTLE(p2, 400);
    d = await drive(null, fr);
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.module === 'object');
  ok('*** AND YOU CAN BUY YOUR WAY OFF THEIR LINE IN THE DEMO TOO *** -- the bill'
     + ' goes ' + d.plain + ' to ' + d.off,
     d.plain > 0 && d.off < d.plain && /run on your own power now/.test(d.card || ''));
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();

/* ============================================================================
   BACK OF HOUSE GATE (9/13/26, WORLD lane) -- board row [back of house] /
   THE-CASINO-HAS-NO-BACK.

   THE ROW, harvested from ECONOMY round 6: "Our own economy module has said since
   7/19 that downtown matters for its 'deep casino/resort dry stores', and there is
   no dry store, no laundry, no boiler, no loading dock in any building in this
   game. Every job the city offers happens in a room that does not exist. Build the
   back of house as a real place you can enter, work in, and steal from. Needs COOK
   for the rooms."

   *** MEASURED FIRST, AND THE ROW IS HALF WRONG IN THE MOST USEFUL WAY. ***
   THE ROOMS EXIST: twelve zones of real rooms, a casino is `leisure` and already
   gets concourse, counter, kitchen, locker, restroom and service, a shop already
   gets a stockroom, a warehouse already gets a dock, and bohemia_furnish already
   fills a stockroom wall to wall with racking and pallets. So "needs COOK for the
   rooms" is NOT TRUE -- front-page rule 12 says measure a named blocker rather than
   wait on it, and the rooms are generated and furnished by code, not drawn.

   WHAT WAS REALLY MISSING WAS TWO THINGS.
   ONE -- the one room the economy asks for BY NAME was the one room it never got:
   `leisure` was the goods-heavy zone with no store in its list.
   TWO -- AND NOTHING THAT PAYS YOU COULD SEE ANY ROOM AT ALL. YIELD is two flat
   numbers and bohemia_work did not contain the word room, so a sweep through the
   back of a casino paid exactly what a sweep across a car park paid.

   AND THE FIX INVENTS NO NUMBER: the economy already has SITE and SCAV and already
   says what separates them. A dry store is a site. A concourse is not.

   node gates/back_of_house_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const B = require(path.join(ROOT, 'engine/bohemia_backhouse.js'));
const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const FUR = require(path.join(ROOT, 'engine/bohemia_furnish.js'));
const ECO = require(path.join(ROOT, 'engine/bohemia_economy.js'));
const W = require(path.join(ROOT, 'engine/bohemia_work.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('BACK OF HOUSE GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (a casino has a dry store, and the room you stand in decides what'
            + ' a day of work is)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. *** THE ROOM THE ECONOMY ASKS FOR BY NAME *** ------------------- */
{
  const eco = fs.readFileSync(path.join(ROOT, 'engine/bohemia_economy.js'), 'utf8');
  ok('the economy really does say the dry store is why downtown matters',
     /deep casino\/resort dry stores/.test(eco));
  ok('*** AND A CASINO NOW GETS ONE *** (leisure: '
     + FP.ZONES.leisure.roles.join(',') + ')',
     FP.ZONES.leisure.roles.indexOf('stockroom') >= 0);
  /* REUSE-FIRST: the room is one the game already had, already furnished. A new
     name would have been a new thing to draw and would have needed COOK. */
  ok('*** and it is a room that already existed, not a new one ***',
     !!FUR.ROLES.stockroom && FUR.ROLES.stockroom.pieces.length > 0);
  ok('retail had one all along, which is how we know nothing new is drawn',
     FP.ZONES.retail.roles.indexOf('stockroom') >= 0);
}

/* ---- 2. *** WHICH ROOMS HOLD GOODS IS DERIVED, NOT LISTED *** ----------- */
{
  const rooms = B.storerooms();
  ok('the game has rooms that hold goods (' + rooms.join(', ') + ')', rooms.length >= 4);
  /* THE ANSWER COMES OUT OF THE FURNISHER EVERY TIME. A list typed in the module
     would be a second opinion about the same fact and would be wrong the day
     somebody adds a room. This proves the join by BREAKING the furnisher. */
  const keep = FUR.ROLES.stockroom.pieces;
  FUR.ROLES.stockroom = { pieces: [], per25: 1 };
  const afterEmpty = B.holds('stockroom');
  FUR.ROLES.stockroom = { pieces: keep, per25: 6 };
  ok('*** empty the furniture out of a room and it stops holding goods ***',
     afterEmpty === false && B.holds('stockroom') === true);
  ok('a room with racking holds goods', B.holds('records') === true);
  ok('a room with nothing in it does not', B.holds('restroom') === false
     && B.holds('concourse') === false);
  ok('a room nobody has furnished is NOT a store, which is the safe answer',
     B.holds('a_room_that_does_not_exist') === false);
  ok('the furniture it counts as storage is named and short (' + B.STORES.join(',') + ')',
     B.STORES.length <= 4 && B.STORES.indexOf('racking') >= 0);
}

/* ---- 3. *** NO THIRD NUMBER IS BORN *** --------------------------------- */
{
  ok('the economy still has exactly the two kinds it always had ('
     + B.kinds().join(', ') + ')',
     B.kinds().length === 2 && B.hasKind('site') && B.hasKind('scav'));
  ok('*** a room that holds goods is the economy\'s SITE ***',
     B.workIn('stockroom') === 'site' && B.workIn('dock') === 'site');
  ok('*** and anything else is its SCAV ***',
     B.workIn('concourse') === 'scav' && B.workIn('restroom') === 'scav');
  const src = fs.readFileSync(path.join(ROOT, 'engine/bohemia_backhouse.js'), 'utf8');
  const code = src.replace(/^[\s\S]*?\(function \(root\)/, '')
                  .replace(/\/\*[\s\S]*?\*\//g, '')
                  .replace(/^\s*\/\/.*$/gm, '')
                  .replace(/'(?:[^'\\]|\\.)*'/g, "''");
  const nums = (code.match(/\b\d+(\.\d+)?\b/g) || []).map(Number).filter(n => n > 1);
  ok('there is no yield, rate or multiplier in the module (' + nums.join(',') + ')',
     nums.length === 0);
  ok('and it never touches the economy\'s YIELD table',
     !/YIELD\s*\[|YIELD\s*=/.test(code));
  ok('the yields are still exactly his untuned pair',
     ECO.YIELD.site.salvage === 3.0 && ECO.YIELD.scav.salvage === 1.2);
}

/* ---- 4. *** INSIDE, THE ROOM WINS -- BOTH WAYS *** ---------------------- */
{
  const onJob = { at: () => ({ district: 'commercial' }) };
  const onNothing = { at: () => ({ district: 'suburb' }) };
  ok('outside on a job district is site work, as it always was',
     W.kindAt(onJob, 0, 0) === 'site');
  ok('outside on nothing is a sweep, as it always was',
     W.kindAt(onNothing, 0, 0) === 'scav');
  ok('*** a dry store on a nothing block is STILL A SITE ***',
     W.kindAt(onNothing, 0, 0, 'stockroom') === 'site');
  ok('*** and a casino concourse on a job district is STILL A SWEEP ***',
     W.kindAt(onJob, 0, 0, 'concourse') === 'scav');
  ok('an unknown room falls back to a sweep rather than paying a site',
     W.kindAt(onNothing, 0, 0, 'not_a_room') === 'scav');
  const o = W.offer(onNothing, 0, 0, 7, 900, 'stockroom');
  ok('the offer carries the room and a sentence about it ("' + (o && o.where) + '")',
     !!o && o.room === 'stockroom' && typeof o.where === 'string' && o.where.length > 5);
  ok('and the sentence names no number, because a yield is his',
     !!o && !/\d/.test(o.where));
  const o2 = W.offer(onNothing, 0, 0, 7, 900, 'concourse');
  ok('a room that holds nothing says nothing about where', !!o2 && !o2.where);
}

/* ---- 5. A CASINO REALLY LAYS ONE OUT ------------------------------------ */
{
  let withStore = 0, tried = 0, tiny = 0;
  for (let s = 1; s <= 40; s++) {
    const p = FP.plate(s * 7919, 26 + (s % 9), 18 + (s % 7), { zone: 'leisure' });
    const roles = (p.rooms || []).map(r => r.role);
    tried++;
    if (roles.length < 7) { tiny++; continue; }
    if (roles.indexOf('stockroom') >= 0) withStore++;
  }
  ok('*** a casino big enough for a back of house gets a dry store *** ('
     + withStore + ' of ' + (tried - tiny) + ')',
     tried - tiny > 0 && withStore === tried - tiny);
  /* AND A SMALL ONE HONESTLY DOES NOT. A shack with two rooms has no back of
     house, and forcing one in would be a lie about the building. */
  const small = FP.plate(99, 12, 9, { zone: 'leisure' });
  ok('and a building too small for one does not get one',
     (small.rooms || []).length < 7);
}

/* ---- 6. on the surface he walks, and in the demo ------------------------ */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  async function drive(ctx) {
    return ctx.evaluate(async () => {
      const R = { module: typeof BohemiaBackhouse, rooms: {}, byRoom: {} };
      R.outside = workOffer();
      /* WALK IN. The probe hunts a real door near a real base and goes through it
         the way a player does -- inEnter is the one place a body crosses a
         threshold. */
      const bases = ctBases() || {};
      outer:
      for (const k in bases) {
        const b0 = bases[k];
        for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
          const gx = b0.x * FN + dx, gy = b0.y * FN + dy;
          const c = cellAt(gx, gy);
          if (!c || !c.enter) continue;
          hx = gx - 1; hy = gy;
          let got = false; try { got = inEnter(gx, gy, hx, hy); } catch (e) {}
          if (got && INSIDE) { R.zone = INSIDE.zone; R.label = INSIDE.label; break outer; }
        }
      }
      if (!INSIDE) { R.inside = false; return R; }
      R.inside = true;
      const fp = INSIDE.fp;
      (fp.rooms || []).forEach(r => { R.rooms[r.role] = (R.rooms[r.role] || 0) + 1; });
      /* stand in the middle of every room and ask what the work is */
      (fp.rooms || []).forEach(r => {
        INSIDE.ix = r.x + ((r.w / 2) | 0); INSIDE.iy = r.y + ((r.h / 2) | 0);
        const room = insideRoom(), o = workOffer();
        if (room && !R.byRoom[room]) R.byRoom[room] = { kind: o && o.kind, where: (o && o.where) || null };
      });
      /* and the button says it */
      const store = (fp.rooms || []).filter(r => BohemiaBackhouse.holds(r.role))[0];
      if (store) {
        INSIDE.ix = store.x + ((store.w / 2) | 0); INSIDE.iy = store.y + ((store.h / 2) | 0);
        R.storeRoom = store.role;
        workBtnSync();
        const el = document.getElementById('workbtn');
        R.button = el ? el.textContent : '';
      }
      const plain = (fp.rooms || []).filter(r => !BohemiaBackhouse.holds(r.role))[0];
      if (plain) {
        INSIDE.ix = plain.x + ((plain.w / 2) | 0); INSIDE.iy = plain.y + ((plain.h / 2) | 0);
        workBtnSync();
        const el2 = document.getElementById('workbtn');
        R.plainButton = el2 ? el2.textContent : '';
      }
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
  const r = await drive(pg);
  await b.close();

  ok('the module reaches the surface he walks', r.module === 'object');
  ok('*** HE CAN WALK INTO A REAL BUILDING *** (' + (r.label || '').slice(0, 46) + ')',
     r.inside === true);
  const kinds = Object.keys(r.byRoom || {});
  ok('and the surface knows which room he is standing in (' + kinds.length + ' rooms)',
     kinds.length > 2);
  const sites = kinds.filter(k => r.byRoom[k].kind === 'site');
  const sweeps = kinds.filter(k => r.byRoom[k].kind === 'scav');
  ok('*** AND THE WORK CHANGES ROOM BY ROOM *** (site: ' + sites.join(',')
     + '  sweep: ' + sweeps.join(',') + ')',
     sites.length >= 1 && sweeps.length >= 1);
  ok('every site room really is one that holds goods',
     sites.every(k => r.byRoom[k].where));
  ok('and no sweep room claims to', sweeps.every(k => !r.byRoom[k].where));
  ok('*** THE BUTTON NAMES THE ROOM *** ("' + (r.button || '') + '")',
     /WORK/.test(r.button || '') && (r.button || '').indexOf(' · ') > 0
     && (r.button || '').split(' · ').length === 3);
  ok('and in a room that holds nothing it is a sweep and says nothing extra ("'
     + (r.plainButton || '') + '")',
     /SCAVENGE/.test(r.plainButton || '')
     && (r.plainButton || '').split(' · ').length === 2);
  ok('no page error walking in and round the rooms'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

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
    d = await drive(fr);
  }
  await b2.close(); srv.close();

  ok('the demo opens the city through its splash', d.module === 'object');
  const dk = Object.keys(d.byRoom || {});
  ok('*** AND THE WHOLE THING RUNS IN THE DEMO TOO: he walks in, the rooms are'
     + ' real, and the work changes room by room ***',
     d.inside === true && dk.length > 2
     && dk.some(k => d.byRoom[k].kind === 'site')
     && dk.some(k => d.byRoom[k].kind === 'scav')
     && /WORK/.test(d.button || ''));
  ok('no page error in the demo' + (errs2.length ? ' -- ' + errs2[0] : ''),
     errs2.length === 0);
  done();
})();

/* BOHEMIA ADDRESS GATE (8/26/26, PEOPLE lane) -- the day's job happens in a
 * PLACE, with ONE person, and the game says which way it is.
 *
 * MEASURED ON THE WALKED CITY BEFORE A LINE OF IT WAS WRITTEN, counting outward
 * from the block the player actually wakes up on (a block is 384 m):
 *     within 3 blocks    23 people, and ZERO of them run with anybody
 *     nearest TRADES      5 blocks   (~1.9 km)
 *     nearest NETWORK     6 blocks   (~2.3 km)
 *     of 115 people out to 6 blocks, 6 are affiliated (5.2%)
 * Day one's quest demands faction=TRADES for its one REQUIRED role. The person
 * that quest was about stood a two-kilometre walk from the front door, in an
 * unnamed direction, and NOTHING ON SCREEN SAID SO.
 *
 * AND THE FIRST CUT OF CASTING MADE IT WORSE WITHOUT EVER LOOKING WRONG: it cast
 * against whatever block you stood on, so "the fixer" was a different person on
 * every block and the row said so honestly, "on this block, that is them."
 * A QUEST WHOSE CAST CHANGES WHEN YOU CROSS THE STREET IS NOT A QUEST.
 *
 * AND THE FIRST FIX WAS WRONG TOO, AND THE VALLEY SAID SO. Looking for ONE block
 * that could fill EVERY required role cast day 1 and day 2 and left days 3, 4
 * and 5 with nothing at all -- because THREE OUTFITS NEVER SHARE A BLOCK, which
 * is what holding territory MEANS. A quest does not have an address. IT HAS ONE
 * PER ROLE, and going from one to the other IS the job.
 *
 * PROVES:
 *   A  the rule: one address per role, required parts first, nobody holds two,
 *      the faction demand is never relaxed, and out of range is NULL
 *   B  what the valley actually says, measured live rather than remembered
 *   C  ONE PART, ONE PLACE: one block in a wide sweep casts, it survives walking
 *      away and it rides the save
 *   D  the address is on the glass, in words, and the number counts down
 *   E  and the conversation still opens when you get there
 *
 * WORDS, NOT AN ARROW, AND THAT IS RESEARCHED RATHER THAN PREFERRED. Morrowind
 * put its directions in dialogue and no marker on the map, and what players
 * remember about it is the valley; the marker games trade that memory for the
 * convenience, and their writing gets shorter to match. Bohemia is a city whose
 * phones do not work, so a compass that always knows where everybody is would be
 * the strangest object in it.
 *
 *   node gates/address_gate.js
 */
'use strict';
var path = require('path');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (typeof cond === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var P = require('../engine/bohemia_people.js');

/* ==========================================================================
   A. THE RULE
   ========================================================================== */
head('A. THE RULE');
ok('the identity module can give a role an address',
  typeof P.castAddresses === 'function' && typeof P.bearingOf === 'function'
  && typeof P.addressLine === 'function');

/* A LITTLE WORLD, built so each claim has exactly one way to pass. */
function world(map) {
  return function (x, y) { return map[x + ',' + y] || []; };
}
var BASES = { REDS: [2, 16], BLUES: [11, 0], TRADES: [7, 19] };
function originFor(role) {
  var f = P.roleFaction(role);
  return f ? (BASES[f] || null) : [12, 12];
}
var W = world({
  '2,16': [{ key: 'R1', faction: 'REDS' }, { key: 'R2', faction: 'REDS' }],
  '11,0': [{ key: 'B1', faction: 'BLUES' }],
  '7,19': [{ key: 'T1', faction: 'TRADES' }],
  '12,12': [{ key: 'N1', faction: null }],
  '3,3':   [{ key: 'W1', faction: 'CARTEL' }]
});
var ROLES = [
  { name: 'red_boss', req: true, cond: 'faction=REDS holds_block=true' },
  { name: 'blue_boss', req: true, cond: 'faction=BLUES holds_block=true' },
  { name: 'runner', req: false, cond: 'faction_any knows_the_load=true' }
];
var A = P.castAddresses(ROLES, { peopleAt: W, originFor: originFor, radius: 2,
                                 questId: 'q', factionOf: function (p) { return p.faction; } });
ok('*** EVERY ROLE GETS ITS OWN ADDRESS, NOT ONE FOR THE WHOLE QUEST ***',
  !!A && !!A.red_boss && !!A.blue_boss
  && String(A.red_boss.block) !== String(A.blue_boss.block),
  'red_boss ' + JSON.stringify(A.red_boss.block) + '  blue_boss ' + JSON.stringify(A.blue_boss.block));
ok('and each one lands on its own outfit\'s ground',
  A.red_boss.block[0] === 2 && A.red_boss.block[1] === 16
  && A.blue_boss.block[0] === 11 && A.blue_boss.block[1] === 0);
ok('a role with no outfit is looked for where the player is',
  !!A.runner && A.runner.block[0] === 12 && A.runner.block[1] === 12, A.runner && A.runner.key);
/* THE DEMAND IS NEVER RELAXED. A CARTEL person sits two blocks from the REDS
   base; if the faction filter ever slipped, the ring would take them. */
var tight = P.castAddresses([{ name: 'boss', req: true, cond: 'faction=REDS' }],
  { peopleAt: W, originFor: function () { return [3, 3]; }, radius: 0,
    questId: 'q', factionOf: function (p) { return p.faction; } });
ok('*** AND THE OUTFIT IS NEVER RELAXED TO MAKE A HIT ***',
  !tight.boss, 'a CARTEL body on the searched block was ' + (tight.boss ? 'TAKEN' : 'refused'));
ok('out of range is NULL, not the nearest thing that will do',
  !P.castAddresses([{ name: 'boss', req: true, cond: 'faction=BLUES' }],
    { peopleAt: W, originFor: function () { return [2, 16]; }, radius: 1,
      questId: 'q', factionOf: function (p) { return p.faction; } }).boss);
/* NOBODY HOLDS TWO PARTS, and this is built on a block of ONE person so the
   dedupe is the only thing that can make it pass. That claim was written
   vacuously twice this week; once is enough. */
var solo = P.castAddresses([{ name: 'a', req: true, cond: 'faction=TRADES' },
                            { name: 'b', req: true, cond: 'faction=TRADES' }],
  { peopleAt: world({ '7,19': [{ key: 'ONLY', faction: 'TRADES' }] }),
    originFor: function () { return [7, 19]; }, radius: 0,
    questId: 'q', factionOf: function (p) { return p.faction; } });
ok('*** ONE PERSON NEVER HOLDS TWO PARTS, on a block of exactly one person ***',
  Object.keys(solo).length === 1, JSON.stringify(Object.keys(solo)));
/* REQUIRED FIRST: an optional part must not take the only body. */
var scarce = P.castAddresses([{ name: 'opt_one', req: false, cond: 'faction=TRADES' },
                              { name: 'req_one', req: true, cond: 'faction=TRADES' }],
  { peopleAt: world({ '7,19': [{ key: 'ONLY', faction: 'TRADES' }] }),
    originFor: function () { return [7, 19]; }, radius: 0,
    questId: 'q', factionOf: function (p) { return p.faction; } });
ok('and when only one part can be filled, the REQUIRED one gets them',
  !!scarce.req_one && !scarce.opt_one, JSON.stringify(Object.keys(scarce)));
/* DETERMINISTIC, and not by accident of iteration order: the same world handed
   over with its rings walked from a different corner must answer the same. */
var again = P.castAddresses(ROLES, { peopleAt: W, originFor: originFor, radius: 2,
                                     questId: 'q', factionOf: function (p) { return p.faction; } });
ok('the same quest, the same world, the same people, forever',
  JSON.stringify(Object.keys(A).map(function (k) { return [k, A[k].key, A[k].block]; }))
  === JSON.stringify(Object.keys(again).map(function (k) { return [k, again[k].key, again[k].block]; })));

head('A2. WHICH WAY, AND HOW IT READS');
ok('the four straight bearings',
  P.bearingOf([5, 5], [5, 1]) === 'NORTH' && P.bearingOf([5, 5], [5, 9]) === 'SOUTH'
  && P.bearingOf([5, 5], [9, 5]) === 'EAST' && P.bearingOf([5, 5], [1, 5]) === 'WEST');
ok('and the diagonals, but only when both legs are real',
  P.bearingOf([5, 5], [9, 1]) === 'NORTH EAST' && P.bearingOf([5, 5], [1, 9]) === 'SOUTH WEST'
  && P.bearingOf([5, 5], [12, 6]) === 'EAST',
  'one block sideways on a seven block walk is still EAST');
ok('and standing on it is not a direction', P.bearingOf([5, 5], [5, 5]) === null);
ok('*** THE SENTENCE IS A DISTANCE, A DIRECTION AND WHAT THE GROUND IS ***',
  P.addressLine([12, 12], [7, 16], 'industrial') === '5 blocks south west, out by the workshops',
  JSON.stringify(P.addressLine([12, 12], [7, 16], 'industrial')));
ok('it counts in ones', P.addressLine([12, 12], [12, 11], 'suburb') === 'a block north, out by the houses');
ok('and it says so when you have arrived',
  P.addressLine([12, 12], [12, 12], 'wash') === 'right here, by the wash');
/* A GROUND WORD NOBODY WROTE A PHRASE FOR MUST NEVER COST HIM THE DIRECTION. */
ok('a ground type with no phrase written for it still gives the direction',
  /5 blocks south west/.test(P.addressLine([12, 12], [7, 16], 'some_new_type')),
  P.addressLine([12, 12], [7, 16], 'some_new_type'));

/* ==========================================================================
   B..E  THE WALKED CITY
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 140)); });
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);
    await page.evaluate(function () {
      for (var i = 0; i < 3; i++) {
        var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
        if (g) g.click();
      }
      try { window.DAYOPEN = DQ.openDay(DAY.day); } catch (e) {}
    });
    await SETTLE(page, 2500);

    var m = await page.evaluate(function () {
      var out = {}, nb = BohemiaPopulation.NB, span = nb * FN;
      out.spawnBlock = ctBlockOf(hx, hy);

      /* ---- B. WHAT THE VALLEY ACTUALLY SAYS, counted live ---------------- */
      var near = { people: 0, affiliated: 0 };
      for (var dy = -3; dy <= 3; dy++) for (var dx = -3; dx <= 3; dx++) {
        var l = pplPeople(out.spawnBlock[0] + dx, out.spawnBlock[1] + dy) || [];
        for (var i = 0; i < l.length; i++) {
          near.people++;
          var f = null; try { f = ctFactionOf(l[i]); } catch (e) {}
          if (f) near.affiliated++;
        }
      }
      out.near = near;
      /* and how many outfits really do hold their own ground */
      var bases = ctBases(), held = 0, total = 0, empty = [];
      for (var k in bases) {
        total++;
        var bb = [Math.floor(bases[k].x / nb), Math.floor(bases[k].y / nb)], hit = false;
        for (var r = 0; r <= 2 && !hit; r++)
          for (var yy = -r; yy <= r && !hit; yy++) for (var xx = -r; xx <= r && !hit; xx++) {
            if (Math.max(Math.abs(xx), Math.abs(yy)) !== r) continue;
            var ll = pplPeople(bb[0] + xx, bb[1] + yy) || [];
            for (var j = 0; j < ll.length; j++) {
              var ff = null; try { ff = ctFactionOf(ll[j]); } catch (e) {}
              if (ff && String(ff).toUpperCase() === String(k).toUpperCase()) { hit = true; break; }
            }
          }
        if (hit) held++; else empty.push(String(k).toUpperCase());
      }
      out.outfits = { total: total, held: held, empty: empty };

      /* ---- the day cast ------------------------------------------------- */
      var t = performance.now();
      var d = ctDayCast();
      out.castMs = Math.round(performance.now() - t);
      out.cast = {};
      for (var r2 in (d && d.cast) || {})
        out.cast[r2] = { key: d.cast[r2].key, block: d.cast[r2].block,
                         rings: d.cast[r2].rings, faction: d.cast[r2].faction };
      out.jobRole = ctJobRole();
      out.reqRoles = (DQ.Q.roles || []).filter(function (r) { return r.req; })
        .map(function (r) { return r.name; });

      /* ---- D. THE ADDRESS ON THE GLASS ---------------------------------- */
      try { updQline(); } catch (e) {}
      out.qlineAtHome = (document.getElementById('qline') || {}).textContent;
      var blk = out.cast[out.jobRole] && out.cast[out.jobRole].block;
      out.countdown = [];
      if (blk) [3, 2, 1, 0].forEach(function (n) {
        hx = (blk[0] + n) * span + 8; hy = (blk[1] + n) * span + 8; CT_SPAWN = null;
        try { ctSpawn(); render(); } catch (e) {}
        out.countdown.push((document.getElementById('qline') || {}).textContent);
      });

      /* ---- C. ONE PART, ONE PLACE --------------------------------------- */
      var casts = 0, tried = 0, roleBlocks = {};
      if (blk) for (var bx = blk[0] - 4; bx <= blk[0] + 4; bx++)
        for (var by = blk[1] - 4; by <= blk[1] + 4; by++) {
          hx = bx * span + 8; hy = by * span + 8; CT_SPAWN = null;
          try { ctSpawn(); } catch (e) {}
          tried++;
          var c = ctCast();
          if (!c) continue;
          casts++;
          Object.keys(c).forEach(function (rr) { roleBlocks[rr] = (roleBlocks[rr] || 0) + 1; });
        }
      out.blocksThatCast = casts; out.blocksTried = tried; out.roleBlocks = roleBlocks;

      /* ---- E. AND YOU CAN TALK TO THEM WHEN YOU GET THERE ---------------- */
      if (blk) {
        hx = blk[0] * span + 8; hy = blk[1] * span + 8; CT_SPAWN = null;
        try { ctSpawn(); render(); } catch (e) {}
        out.rolesHere = Object.keys(ctCast() || {});
        var R = ctEveryone(), hit2 = null;
        for (var q = 0; q < R.length; q++)
          if ('P:city:' + R[q].id === out.cast[out.jobRole].key) hit2 = R[q];
        out.personIsHere = !!hit2;
        if (hit2) {
          var at = ctAt(hit2), dd = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (var w = 0; w < dd.length; w++) {
            hx = at[0] + dd[w][0]; hy = at[1] + dd[w][1];
            try { render(); } catch (e) {}
            if (ctAdjacent()) break;
          }
          var vb = document.getElementById('cttalk');
          if (vb && getComputedStyle(vb).display !== 'none') {
            vb.click();
            var cc = document.getElementById('ctcard');
            out.card = cc ? cc.innerText : null;
            var ob = document.getElementById('ctconv');
            out.opener = ob ? ob.textContent : null;
            if (ob) { ob.click();
              out.says = [].map.call(document.querySelectorAll('#ctcard .say'), function (e) { return e.textContent; });
              /* *** AND THE WHOLE POINT: FINISH WITH THIS ONE AND THE ADDRESS
                 MOVES TO THE NEXT. *** Walk the conversation to its end, then ask
                 the HUD again -- it must be pointing somewhere else, at the other
                 part, on the other outfit's ground. That is "going from one to
                 the other IS the job", measured instead of asserted. */
              out.roleBefore = ctJobRole();
              out.addrBefore = ctAddress();
              /* PLAY IT LIKE A PLAYER: answer while there are answers, and press
                 the end button when the scene runs out of questions. A probe
                 that only clicks options would stall on the terminal node the
                 lineman's scene actually ends on. */
              for (var g = 0; g < 8; g++) {
                var nx = document.querySelector('#ctcard button.convopt');
                if (nx) { nx.click(); continue; }
                var fin = document.getElementById('ctconvend');
                if (fin) { fin.click(); }
                break;
              }
              out.roleAfter = ctJobRole();
              out.addrAfter = ctAddress();
              out.stageAfter = DQ.rt.state.stage;
              var ca = out.cast[out.roleAfter];
              out.blockAfter = ca ? ca.block : null;
              out.factionAfter = ca ? ca.faction : null;
            }
            try { ctClose(); } catch (e) {}
          }
        }
      }

      /* ---- __CITY_HUNT__: THE LAST TWO HUNDRED METRES ------------------- */
      /* THE ROLE THE QUEST IS ON *NOW*, not the one it opened on: the section
         above played the first conversation to its end, so the job has already
         handed off to the second part. Measuring the tell at the OLD block is
         how this claim first went red -- it read "5 blocks north west" while
         standing exactly where it had been told to stand. */
      var hRole = ctJobRole();
      var hBlk = (hRole && out.cast[hRole]) ? out.cast[hRole].block : blk;
      out.tellRole = hRole;
      if (hBlk) {
        hx = hBlk[0] * span + 8; hy = hBlk[1] * span + 8; CT_SPAWN = null;
        try { ctSpawn(); render(); updQline(); } catch (e) {}
        out.tellLine = (document.getElementById('qline') || {}).textContent;
        out.peopleOnBlock = ctEveryone().length;
        out.tellOf = (function () {
          try { var q = qkOf(out.cast[hRole].key); return q && q.tell; }
          catch (e) { return null; }
        })();
        /* a stranger standing on the same block must still be a stranger */
        var others = ctEveryone().filter(function (p) {
          return 'P:city:' + p.id !== out.cast[hRole].key; });
        if (others.length) {
          try { ctClose(); } catch (e) {}
          var sa = ctAt(others[0]), sdd = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (var sk = 0; sk < sdd.length; sk++) {
            hx = sa[0] + sdd[sk][0]; hy = sa[1] + sdd[sk][1];
            try { render(); } catch (e) {}
            if (ctAdjacent()) break;
          }
          var svb = document.getElementById('cttalk');
          if (svb && getComputedStyle(svb).display !== 'none') {
            svb.click();
            out.strangerCard = document.getElementById('ctcard').innerText;
            try { ctClose(); } catch (e) {}
          }
        }
      }
      /* AND THE CONFERRED HALF. Day one's lineman is `block=browned`, one of the
         machine flags this deliberately drops, so THE ROW NEVER RENDERS ON DAY
         ONE AT ALL -- which means a claim measured only on day one is a claim
         that can never see the row. (Mutation M32 proved that the hard way: it
         made the row show on every stranger and NOTHING went red.) So the sweep
         finds the first demo day whose role carries a real phrase, walks to that
         person, and reads the card. */
      out.traitDays = [];
      for (var td = 1; td <= 5; td++) {
        try { DQ.openDay(td); } catch (e) { continue; }
        (DQ.Q.roles || []).forEach(function (r) {
          var tw = BohemiaPeople.traitWords(BohemiaPeople.roleTraits(r));
          if (tw.length) out.traitDays.push('day ' + td + ' ' + r.name + ': ' + tw.join(', '));
        });
      }
      out.traitCard = null; out.traitStranger = null; out.traitWant = null; out.traitWhy = [];
      for (var td2 = 1; td2 <= 5 && !out.traitCard; td2++) {
        try { DQ.openDay(td2); } catch (e) { continue; }
        CT_DAYCAST = null; T.day = td2;
        var dc = ctDayCast();
        if (!dc || !dc.cast) { out.traitWhy.push('day ' + td2 + ': no cast'); continue; }
        for (var rn in dc.cast) {
          var tw2 = BohemiaPeople.traitWords(dc.cast[rn].traits);
          if (!tw2.length) continue;
          var tb = dc.cast[rn].block;
          /* *** AND HOW MANY OTHER RESIDENTS SHARE THAT BLOCK, COUNTED RATHER
             THAN ASSUMED. *** Answer: none, on any of the five demo days. The
             one apparent exception was the player's own next-door NEIGHBOUR, an
             authored fixture the people pass appends to whichever neighbourhood
             he spawned in, and it moves when the probe moves. So a claim about
             "a stranger standing on the job's block" has no witness in this
             world today, and the gate says that out loud below instead of
             inventing one. */
          out.traitMates = (pplPeople(tb[0], tb[1]) || []).length - 1;
          hx = tb[0] * span + 8; hy = tb[1] * span + 8; CT_SPAWN = null;
          try { ctSpawn(); render(); } catch (e) {}
          /* *** THE STRANGER HAS TO BE ON THE SAME BLOCK, AND A MUTATION
             TAUGHT ME THAT. *** ctEveryone() returns the 3x3 NEIGHBOURHOOD, so
             the first non-cast body it hands back is usually standing on the
             block next door -- where ctCast() correctly returns null and no row
             could ever appear. M32 made the row show for everybody and this
             claim stayed green, because the person it was reading was not in the
             place the claim is about. */
          var TR = ctEveryone(), th = null, tstranger = null;
          for (var ti = 0; ti < TR.length; ti++) {
            if ('P:city:' + TR[ti].id === dc.cast[rn].key) { th = TR[ti]; continue; }
            if (tstranger) continue;
            var hb = ctBlockOf(TR[ti].home[0], TR[ti].home[1]);
            if (hb[0] === tb[0] && hb[1] === tb[1]) tstranger = TR[ti];
          }
          if (!th) { out.traitWhy.push('day ' + td2 + ' ' + rn + ': not found on the block'); continue; }
          out.traitWant = 'the one who ' + tw2.join(', and ');
          out.traitDay = td2 + ' ' + rn;
          [[th, 'traitCard'], [tstranger, 'traitStranger']].forEach(function (pair) {
            if (!pair[0]) return;
            try { ctClose(); } catch (e) {}
            var pa = ctAt(pair[0]), pd = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (var pk = 0; pk < pd.length; pk++) {
              hx = pa[0] + pd[pk][0]; hy = pa[1] + pd[pk][1];
              try { render(); } catch (e) {}
              if (ctAdjacent()) break;
            }
            var pvb = document.getElementById('cttalk');
            if (pvb && getComputedStyle(pvb).display !== 'none') {
              pvb.click();
              out[pair[1]] = document.getElementById('ctcard').innerText;
              try { ctClose(); } catch (e) {}
            }
          });
          break;
        }
      }
      try { DQ.openDay(1); CT_DAYCAST = null; T.day = 1; } catch (e) {}

      /* ---- AND IT SURVIVES A SAVE --------------------------------------- */
      try {
        var snap = citySnapshot();
        out.savedCast = snap && snap.daycast ? Object.keys(snap.daycast.cast || {}).map(
          function (rr) { return rr + '=' + snap.daycast.cast[rr].key; }).sort().join(',') : null;
        out.liveCast = Object.keys(out.cast).map(function (rr) {
          return rr + '=' + out.cast[rr].key; }).sort().join(',');
      } catch (e) { out.savedCast = 'ERR ' + String(e).slice(0, 60); }

      /* ---- AND EVERY DEMO DAY, not just the one that opens -------------- */
      out.days = [];
      for (var day = 1; day <= 5; day++) {
        try { DQ.openDay(day); } catch (e) { continue; }
        CT_DAYCAST = null; T.day = day;
        var dd2 = ctDayCast();
        var req = (DQ.Q.roles || []).filter(function (r) { return r.req; });
        var filled = req.filter(function (r) { return dd2 && dd2.cast && dd2.cast[r.name]; });
        out.days.push({ day: day, quest: DQ.Q.id,
                        req: req.map(function (r) { return r.name + '=' + P_roleFaction(r); }),
                        filled: filled.length, of: req.length });
      }
      function P_roleFaction(r) { try { return BohemiaPeople.roleFaction(r); } catch (e) { return null; } }
      return out;
    });

    head('B. WHAT THE VALLEY ACTUALLY SAYS');
    ok('nothing threw while measuring it', errs.length === 0, errs.slice(0, 2).join(' | '));
    ok('*** NOBODY WITHIN THREE BLOCKS OF THE FRONT DOOR RUNS WITH ANYBODY ***',
      m.near.people > 10 && m.near.affiliated === 0,
      m.near.people + ' people, ' + m.near.affiliated + ' affiliated, around block '
      + JSON.stringify(m.spawnBlock));
    ok('so a role can only be looked for on its OWN outfit\'s ground',
      m.outfits.held >= Math.ceil(m.outfits.total * 0.6),
      m.outfits.held + ' of ' + m.outfits.total + ' outfits have a member within 2 blocks of '
      + 'their base; the rest hold empty ground: ' + (m.outfits.empty.join(', ') || 'none'));

    head('C. ONE PART, ONE PLACE');
    ok('the day\'s quest really is cast', !!m.jobRole && Object.keys(m.cast).length > 0,
      Object.keys(m.cast).map(function (r) {
        return r + ' @' + JSON.stringify(m.cast[r].block) + ' (' + m.cast[r].faction + ')';
      }).join('  ·  '));
    ok('and finding it costs one search, not one per frame', m.castMs < 3000, m.castMs + ' ms, once');
    ok('*** EVERY REQUIRED PART LANDS ON ITS OWN OUTFIT\'S GROUND ***',
      m.reqRoles.length > 0 && m.reqRoles.every(function (r) {
        return m.cast[r] && m.cast[r].faction && m.cast[r].block; }),
      m.reqRoles.join(', '));
    /* THE CLAIM THE WHOLE TURN IS FOR. Before this, every block with a matching
       body cast; now one block in eighty-one holds the part. */
    ok('*** EXACTLY ONE BLOCK IN THE SWEEP HOLDS THIS PART ***',
      m.blocksTried > 50 && m.blocksThatCast === 1,
      m.blocksThatCast + ' of ' + m.blocksTried + ' blocks cast anybody  ' + JSON.stringify(m.roleBlocks));
    ok('and the cast rides the save, so closing the phone does not re-roll it',
      !!m.savedCast && m.savedCast === m.liveCast, m.savedCast);

    head('D. THE ADDRESS ON THE GLASS');
    ok('*** THE OBJECTIVE LINE SAYS WHICH WAY, IN WORDS ***',
      /blocks? (north|south|east|west)/.test(String(m.qlineAtHome)),
      JSON.stringify(m.qlineAtHome));
    ok('and it never puts an arrow or a marker on anything',
      !/[→←↑↓➡]|marker|waypoint/i.test(String(m.qlineAtHome)));
    ok('*** AND THE NUMBER COMES DOWN AS HE WALKS ***',
      m.countdown.length === 4
      && /3 blocks/.test(m.countdown[0]) && /2 blocks/.test(m.countdown[1])
      && /a block/.test(m.countdown[2]) && /right here/.test(m.countdown[3]),
      m.countdown.map(function (s) { return String(s).split('·').pop().trim(); }).join('  ->  '));
    ok('and the card stops hedging, because the cast no longer moves',
      !!m.card && /THE JOB/.test(m.card) && !/on this block/i.test(m.card),
      String(m.card || '').split('\n').slice(0, 7).join(' | '));

    head('E. AND YOU CAN TALK TO THEM WHEN YOU GET THERE');
    ok('the person the quest wants is standing on the block it named',
      m.personIsHere === true, JSON.stringify(m.rolesHere));
    ok('only the parts whose ground this is are known here',
      m.rolesHere && m.rolesHere.length >= 1 && m.rolesHere.length < Object.keys(m.cast).length + 1,
      JSON.stringify(m.rolesHere) + ' of ' + JSON.stringify(Object.keys(m.cast)));
    ok('*** AND THE CONVERSATION OPENS, WITH THE QUEST\'S OWN WORDS ***',
      !!m.opener && !!m.says && m.says.length > 0,
      JSON.stringify(m.opener) + ' -> ' + JSON.stringify((m.says || [])[0] || ''));
    /* THE CLAIM THE WHOLE DESIGN IS FOR. One address is a waypoint; TWO, in
       order, is a quest. */
    ok('*** FINISH WITH THIS ONE AND THE ADDRESS MOVES TO THE NEXT PART ***',
      !!m.roleBefore && !!m.roleAfter && m.roleAfter !== m.roleBefore
      && !!m.addrAfter && m.addrAfter !== m.addrBefore,
      m.roleBefore + ' (' + m.addrBefore + ')  ->  ' + m.roleAfter + ' (' + m.addrAfter + ')');
    ok('and the next part is on a DIFFERENT outfit\'s ground',
      !!m.blockAfter && !!m.factionAfter
      && String(m.blockAfter) !== String((m.cast[m.roleBefore] || {}).block),
      m.roleAfter + ' @' + JSON.stringify(m.blockAfter) + ' (' + m.factionAfter + ')');

    head('F. EVERY DEMO DAY, NOT JUST THE ONE THAT OPENS');
    var full = m.days.filter(function (d) { return d.filled === d.of; });
    ok('the day the demo opens on can be cast in full',
      m.days[0] && m.days[0].filled === m.days[0].of,
      m.days[0] ? (m.days[0].quest + ' ' + m.days[0].filled + '/' + m.days[0].of) : 'no day 1');
    ok('and most of the demo\'s days can', full.length >= 3,
      m.days.map(function (d) { return 'day ' + d.day + ' ' + d.filled + '/' + d.of; }).join('  ·  '));
    /* SAID OUT LOUD RATHER THAN HIDDEN: the parts that cannot be cast are parts
       whose outfit holds empty ground, and that is a world fact for another lane
       to move, never something to paper over with a stand-in. */
    m.days.filter(function (d) { return d.filled < d.of; }).forEach(function (d) {
      console.log('       day ' + d.day + ' (' + d.quest + ') can fill only ' + d.filled
        + ' of ' + d.of + ': ' + d.req.join(', ') + ' -- an outfit with nobody on its ground');
    });

    head('G. THE LAST TWO HUNDRED METRES');
    ok('the block he walked to really has a crowd on it',
      m.peopleOnBlock > 1, m.peopleOnBlock + ' people standing there');
    /* THE ADDRESS STOPPED BEING USEFUL AT EXACTLY THE MOMENT THE WALK WAS FOR:
       a block with a crowd on it and no way to tell which one the job wants. */
    ok('*** AND WHEN HE ARRIVES, THE LINE SAYS WHICH ONE ***',
      !!m.tellOf && String(m.tellLine).indexOf('look for the one who ' + m.tellOf) >= 0,
      String(m.tellLine || '').split('\u00b7').pop().trim());
    ok('and it is a description, never an arrow over anybody\'s head',
      !/[\u2192\u2190\u2191\u2193\u27a1]|marker|waypoint|arrow/i.test(String(m.tellLine)));
    ok('*** AND A STRANGER ON THE SAME BLOCK IS STILL A STRANGER ***',
      !!m.strangerCard && !/THE JOB/.test(String(m.strangerCard)),
      String(m.strangerCard || '').split('\n').slice(0, 4).join(' | '));
    /* WHAT THE QUEST THINKS THEY ARE, absent where the predicate is a machine
       flag -- 11 of the corpus's 69, including day one's lineman. */
    ok('the corpus really does carry phrases worth saying',
      m.traitDays.length > 0, m.traitDays.slice(0, 4).join('  \u00b7  '));
    /* AND ON THE GLASS, not just in the corpus. Read on the first demo day whose
       role carries a phrase, because day one's does not and a claim that only
       ever looks at day one cannot see this row at all. */
    ok('*** AND THE CARD SAYS WHAT THE JOB THINKS THEY ARE ***',
      !!m.traitCard && !!m.traitWant
      && m.traitCard.indexOf('THE JOB SAYS') >= 0
      && m.traitCard.indexOf(m.traitWant) >= 0,
      'day ' + m.traitDay + ': ' + JSON.stringify(m.traitWant)
      + (m.traitCard ? '' : '   skipped: ' + (m.traitWhy || []).join('; ')));
    /* *** NO SILENT CAPS: THE CASE THIS GATE CANNOT WITNESS, SAID OUT LOUD. ***
       The row is gated on ctCast(), whose block-confinement is already proved
       above (M25 turns "exactly one block" into 81 of 81). The one slice left
       is a NON-CAST PERSON STANDING ON A CAST BLOCK -- and measured across all
       five demo days, THERE IS NEVER ONE: the cast person is the only census
       resident of their block, and the apparent second body was the player's own
       authored neighbour, which follows the probe around. Mutation M32 (drop the
       key check, show the row to everybody) is therefore OBSERVATIONALLY
       IDENTICAL to correct behaviour in this world, and no claim written here
       could catch it. The guard stays, because it is right and it costs nothing,
       and it starts being checkable the day a job block holds two people. */
    console.log('       NOT WITNESSED, and not pretended: no demo day has a second '
      + 'resident on a job block (' + m.traitMates + ' beside the cast person), so '
      + '"a stranger there gets no row" has nobody to be about yet.');

  } catch (e) {
    ok('the address could be measured at all', false, String(e && e.message || e));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\nADDRESS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

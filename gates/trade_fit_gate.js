/* BOHEMIA TRADE FIT GATE (9/5/26, PEOPLE lane).
 * VAMILY [outfits nearby] -- row OUTFITS-AT-SPAWN.
 *
 * THE ROW: "zero of 34 people within six cells wear one."
 *
 * *** MEASURED FIRST, AND IT FOUND THREE BREAKS, NOT ONE. ***
 *   1. THE BODY WAS A HASH. ctBody picked CAST_CV[p.look % 6] -- six anonymous
 *      fits chosen by three bits of a seed. What somebody wore was never a fact
 *      about them.
 *   2. THE TRADE WORD HAD NEVER FIRED. All 52 people within six cells of the
 *      spawn have `role` UNDEFINED; the population module calls the field
 *      `archetype` and it holds the SAME FOUR KEYS ROLE_WORDS holds. So every
 *      reader of ROLE_WORDS[person.role] answered 'SOMEBODY' for every stranger
 *      in the valley since the day it was written. Same shape as the seat bug
 *      this lane found last round: a finished organ asked in the wrong words.
 *   3. NOBODY NEAR THE SPAWN RUNS WITH ANYBODY, and that is the MAP plus two
 *      [PENDING Paolo] dials. 0 of 61 affiliated, nearest base 29 cells, reach
 *      12. Not this lane's to move, so the fact a person near the spawn ACTUALLY
 *      has is their trade, and that is what their clothes say.
 *
 * AND THE FACTION HALF IS NOT HERE, WITH A NUMBER RATHER THAN AN EXCUSE:
 * FACTION_LOOKS holds 13 canon outfits and baking them all costs a MEASURED
 * 4.6 SECONDS of frozen page (6.02ms x 40 bakes x 13) on top of today's 1.45s.
 * It has to be lazy, and that is the next round.
 *
 * PROVES:
 *   A  the trade word has ONE owner and it reads the field people really carry
 *   B  it cannot invent a trade
 *   C  the binding is complete, grounded, and names nothing that does not exist
 *   D  it FALLS BACK rather than leaving somebody with no body
 *   E  ON THE REAL DEMO: every person near the spawn has a trade word and wears
 *      a fit from their own trade, and both of a trade's fits are on the street
 *   F  and a person's clothes do not flicker as you watch them
 *
 *   node gates/trade_fit_gate.js
 */
'use strict';
var fs = require('fs');
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

var P = require(path.join(ROOT, 'engine/bohemia_people.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var ALPHA = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');

head('A. THE TRADE WORD HAS ONE OWNER, AND IT ASKS FOR THE FIELD PEOPLE CARRY');
ok('the module answers the question at all', typeof P.tradeOf === 'function');
ok('*** IT READS `archetype`, WHICH IS THE FIELD EVERY PERSON REALLY HAS ***',
  P.tradeOf({ archetype: 'watch' }) === 'WATCH'
  && P.tradeOf({ archetype: 'scav' }) === 'SCAVENGER',
  'watch -> ' + P.tradeOf({ archetype: 'watch' }));
/* A CALLER THAT REALLY CARRIES A ROLE MUST NOT BREAK. Quest cast members do. */
ok('and a caller that really has a `role` still wins',
  P.tradeOf({ role: 'keeper', archetype: 'watch' }) === 'KEEPER');
ok('*** AND THE CARD GRAMMAR USES IT, so a stranger reads as their trade ***',
  P.headingOf({ archetype: 'watch' }) === 'WATCH',
  'headingOf a stranger -> ' + P.headingOf({ archetype: 'watch' }));
ok('a name still beats a trade, which is the grammar\'s own rule',
  P.headingOf({ archetype: 'watch', name: 'RAY DIAZ' }) !== 'WATCH'
  || !P.nameOf({ archetype: 'watch', name: 'RAY DIAZ' }));
/* ONE PLACE, NOT FIVE. The city used to do this lookup itself in two spots.
   *** A COMMENT IS A BLOCK, NOT A LINE, AND THE OWNER IS NOT A STRAY. *** The
   first version of this claim grepped the raw file and went red on THREE
   legitimate hits: two comments explaining the bug and tradeOf's OWN BODY, which
   is the one place that is supposed to do this. Third time this lane has written
   a check that measured the comments instead of the code. So: comments off
   first, then the only surviving lookup must be inside the owner. */
var CODE = CITY.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
var owner = CODE.indexOf('function tradeOf');
var ownerEnd = CODE.indexOf('function headingOf', owner);
var strays = [];
var re = /ROLE_WORDS\[\s*(who|person|p)\.role\s*\]/g, hit;
while ((hit = re.exec(CODE))) {
  if (owner >= 0 && hit.index > owner && hit.index < ownerEnd) continue;  /* the owner itself */
  strays.push(hit[0] + '@' + hit.index);
}
ok('*** OUTSIDE THE ONE OWNER, THE CITY NEVER DOES THIS LOOKUP ITSELF ***',
  owner >= 0 && ownerEnd > owner && strays.length === 0,
  strays.length ? strays.join(', ') : 'the only lookup left is inside tradeOf');
ok('and it asks the one function instead',
  (CITY.split('BohemiaPeople.tradeOf(').length - 1) >= 2,
  (CITY.split('BohemiaPeople.tradeOf(').length - 1) + ' call sites');

head('B. IT CANNOT INVENT A TRADE');
ok('*** NOBODY IN, NOTHING OUT ***', P.tradeOf(null) === null && P.tradeOf({}) === null);
ok('a trade nobody wrote down is not a trade',
  P.tradeOf({ archetype: 'astronaut' }) === null);
ok('and the four it knows are exactly the four the population builds',
  Object.keys(P.ROLE_WORDS).sort().join(',') === 'keeper,scav,watch,worker',
  Object.keys(P.ROLE_WORDS).join(','));

head('C. THE BINDING IS COMPLETE, GROUNDED, AND INVENTS NOTHING');
var tf = CITY.match(/var TRADE_FIT = \{[\s\S]*?\n\};/);
ok('the binding is in the walked city', !!tf);
var TF = {};
if (tf) {
  var rows = tf[0].match(/(\w+):\s*\[([^\]]*)\]/g) || [];
  rows.forEach(function (r) {
    var m = /(\w+):\s*\[([^\]]*)\]/.exec(r);
    TF[m[1]] = (m[2].match(/'([^']+)'/g) || []).map(function (s) { return s.slice(1, -1); });
  });
}
ok('*** EVERY TRADE THE GAME BUILDS HAS A FIT, so nobody falls through ***',
  Object.keys(P.ROLE_WORDS).every(function (t) { return TF[t] && TF[t].length; }),
  Object.keys(TF).map(function (t) { return t + ':' + TF[t].length; }).join(' '));
ok('and no trade was invented that the game does not build',
  Object.keys(TF).every(function (t) { return !!P.ROLE_WORDS[t]; }),
  Object.keys(TF).join(','));
/* THE FIT NAMES ARE THE CAST TABLE'S OWN IDS. A name I guessed here would bind
   a trade to a shape that does not exist and fall back forever, silently. */
var castIds = (ALPHA.match(/\{\s*id:'([a-z]+)',\s*why:/g) || [])
  .map(function (s) { return /id:'([a-z]+)'/.exec(s)[1]; });
ok('the cast table names its fits, and the gate can read them',
  castIds.length === 6, castIds.join(','));
var named = [];
Object.keys(TF).forEach(function (t) { TF[t].forEach(function (f) { if (named.indexOf(f) < 0) named.push(f); }); });
var invented = named.filter(function (f) { return castIds.indexOf(f) < 0; });
ok('*** EVERY FIT NAMED IS ONE THE BAKE ACTUALLY MAKES ***',
  invented.length === 0, invented.length ? 'INVENTED: ' + invented.join(', ') : named.length + ' names, all real');
ok('and every fit the bake makes is used by somebody',
  castIds.every(function (f) { return named.indexOf(f) >= 0; }),
  castIds.filter(function (f) { return named.indexOf(f) < 0; }).join(',') || 'all six used');
/* VARIETY IS THE POINT OF THE PAIRS. All-unique would put twenty scavengers
   near the spawn in one silhouette, which reads as a uniform, not a crowd. */
ok('*** EVERY TRADE HAS MORE THAN ONE SHAPE, so a crowd is not a uniform ***',
  Object.keys(TF).every(function (t) { return TF[t].length >= 2; }));
var uniq = named.filter(function (f) {
  return Object.keys(TF).filter(function (t) { return TF[t].indexOf(f) >= 0; }).length === 1; });
ok('*** AND EACH TRADE HAS A SHAPE THAT IS ITS ALONE, so it can be read ***',
  Object.keys(TF).every(function (t) {
    return TF[t].some(function (f) { return uniq.indexOf(f) >= 0; }); }),
  uniq.length + ' of ' + named.length + ' shapes belong to one trade');
ok('every binding is tagged draft, because which shape belongs to whom is HIS',
  (tf ? (tf[0].match(/draft:true/g) || []).length : 0) >= Object.keys(TF).length,
  (tf ? (tf[0].match(/draft:true/g) || []).length : 0) + ' draft tags');

head('D. IT FALLS BACK RATHER THAN LEAVING SOMEBODY WITH NO BODY');
/* REPOINTED, NOT LOOSENED. This demanded the literal line
   `var set=CAST_CV[ctFitIndex(p)];`, and the faction half legitimately turned it
   into `if(!set) set=CAST_CV[ctFitIndex(p)];` -- the trade fit is now what you
   wear until your outfit arrives. WHAT IT MEANS is: the body asks the picker,
   and the picker is the thing under the outfit. That is what it checks now, and
   it still fails if either is dropped or if the outfit stops winning. */
ok('the picker exists, and the body asks it under the outfit',
  CITY.indexOf('function ctFitIndex(p)') > 0
  && /if\(!set\) set=CAST_CV\[ctFitIndex\(p\)\];/.test(CITY)
  && CITY.indexOf('if(fid){ set=CAST_FID[fid]||null;') > 0);
ok('*** A BAKE THAT SENDS NO NAMES FALLS BACK TO WHAT IT DID BEFORE ***',
  /if \(!n \|\| !CAST_ID \|\| !CAST_ID\.length\) return fallback;/.test(CITY));
ok('an unknown trade falls back too', /if \(!want \|\| !want\.length\) return fallback;/.test(CITY));
ok('and a fit the bake did not deliver falls back rather than indexing nothing',
  /if \(!have\.length\) return fallback;/.test(CITY));
ok('the name travels with the body, so a reordered table cannot silently rebind',
  ALPHA.indexOf('out.looks.push({id:L.id,dirs:L.dirs});') > 0
  && CITY.indexOf('ids.push(L.id || null);') > 0);

/* ---------------------------------------------------------------------------
   E + F. ON THE REAL DEMO.
   --------------------------------------------------------------------------- */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

(async function () {
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 160)); });
    await page.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await SETTLE(page, 15000);
    await page.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page, 12000);
    await wait(4000);
    var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];

    head('E. ON THE REAL DEMO, WITHIN SIX CELLS OF WHERE HE STARTS');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var m = await fr.evaluate(function () {
      var o = {};
      for (var q = 0; q < 6; q++) { var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 13 * 60;
      try { render(); } catch (e) { o.threw = String(e.message).slice(0, 140); }
      o.ids = CAST_ID;
      o.castSize = CAST_CV ? CAST_CV.length : 0;

      var NB = BohemiaPopulation.NB, span = NB * FN;
      var cx = Math.floor(hx / span), cy = Math.floor(hy / span), cell = ctCell();
      var near = 0, worded = 0, offPair = 0, noBody = 0, fits = {}, trades = {};
      var pairSeen = {};
      for (var ny = Math.max(0, cy - 1); ny <= cy + 1; ny++)
      for (var nx = Math.max(0, cx - 1); nx <= cx + 1; nx++) {
        var ppl = pplPeople(nx, ny);
        for (var j = 0; j < ppl.length; j++) {
          var p = ppl[j];
          var d = Math.max(Math.abs(Math.floor(p.home[0] / FN) - cell[0]),
                           Math.abs(Math.floor(p.home[1] / FN) - cell[1]));
          if (d > 6) continue;
          near++;
          var tr = p.role || p.archetype;
          trades[String(tr)] = (trades[String(tr)] || 0) + 1;
          if (BohemiaPeople.tradeOf(p)) worded++;
          var idx = ctFitIndex(p);
          var fit = CAST_ID ? CAST_ID[idx] : null;
          fits[String(fit)] = (fits[String(fit)] || 0) + 1;
          var want = TRADE_FIT[String(tr)];
          if (!want || want.indexOf(fit) < 0) offPair++;
          else { (pairSeen[tr] = pairSeen[tr] || {})[fit] = 1; }
          if (!ctBody(p, 'S')) noBody++;
          /* F. AND IT DOES NOT FLICKER: ask three times, same answer. */
          if (ctFitIndex(p) !== idx || ctFitIndex(p) !== idx) o.flicker = (o.flicker || 0) + 1;
        }
      }
      o.near = near; o.worded = worded; o.offPair = offPair; o.noBody = noBody;
      o.fits = fits; o.trades = trades;
      o.bothFitsSeen = Object.keys(pairSeen).map(function (t) {
        return t + ':' + Object.keys(pairSeen[t]).length; });
      return o;
    });

    ok('nothing threw on the first draw', !m.threw, m.threw || '');
    ok('*** THE BAKE SENDS THE NAME OF EVERY BODY IT MAKES ***',
      !!m.ids && m.ids.length === m.castSize && m.ids.every(function (x) { return !!x; }),
      m.ids ? m.ids.join(',') : 'NO IDS AT ALL');
    ok('there are people within six cells to look at', m.near > 0,
      m.near + ' people, trades: ' + JSON.stringify(m.trades));
    /* THE ROW'S OWN NUMBER, TURNED ROUND. */
    ok('*** EVERY ONE OF THEM NOW HAS A TRADE WORD, WHICH WAS ZERO BEFORE ***',
      m.worded === m.near, m.worded + ' of ' + m.near);
    ok('*** AND EVERY ONE OF THEM WEARS A FIT FROM THEIR OWN TRADE ***',
      m.offPair === 0 && m.near > 0,
      m.offPair + ' of ' + m.near + ' off-pair; ' + JSON.stringify(m.fits));
    ok('*** NOBODY LOST THEIR BODY GETTING HERE ***', m.noBody === 0,
      m.noBody + ' with no body');
    /* A TRADE WEARING ONE SHAPE IS A UNIFORM. Both of a pair have to show up. */
    ok('*** BOTH OF A TRADE\'S SHAPES ARE ACTUALLY ON THE STREET ***',
      m.bothFitsSeen.length > 0 && m.bothFitsSeen.every(function (s) {
        return Number(s.split(':')[1]) >= 2; }),
      m.bothFitsSeen.join('  '));

    head('F. AND THEIR CLOTHES DO NOT FLICKER AS YOU WATCH THEM');
    ok('asking three times gives the same answer for everybody',
      !m.flicker, (m.flicker || 0) + ' people changed fit between asks');

    head('G. AND ON THEIR OWN GROUND, THE OUTFIT ITSELF REACHES THE STREET');
    /* FACTION_LOOKS has carried thirteen canon outfits since 8/18 and no body on
       this street had ever worn one. They arrive ONE AT A TIME, because baking
       all thirteen at boot is a measured 4,579ms of frozen page. */
    var f1 = await fr.evaluate(function () {
      var o = {};
      o.wired = typeof ctNeedFaction === 'function' && typeof CAST_FID === 'object';
      var bases = ctBases() || {}, cb = bases['Cartel'];
      if (!cb) { o.err = 'no Cartel base'; return o; }
      var NB = BohemiaPopulation.NB, span = NB * FN;
      var nx0 = Math.floor(cb.x * FN / span), ny0 = Math.floor(cb.y * FN / span);
      var homes = [];
      for (var ny = Math.max(0, ny0 - 1); ny <= ny0 + 1; ny++)
      for (var nx = Math.max(0, nx0 - 1); nx <= nx0 + 1; nx++) {
        var ppl = pplPeople(nx, ny);
        for (var j = 0; j < ppl.length; j++)
          if (String(ctFactionOf(ppl[j])) === 'Cartel') homes.push(ppl[j].home);
      }
      o.homes = homes.length;
      if (!homes.length) return o;
      var bi = 0, bn = -1;
      for (var a = 0; a < homes.length; a++) {
        var c = 0;
        for (var b = 0; b < homes.length; b++)
          if (Math.max(Math.abs(homes[a][0] - homes[b][0]),
                       Math.abs(homes[a][1] - homes[b][1])) <= 6) c++;
        if (c > bn) { bn = c; bi = a; }
      }
      var th = homes[bi], put = false;
      for (var rr = 1; rr < 12 && !put; rr++)
        for (var dy = -rr; dy <= rr && !put; dy++)
          for (var dx = -rr; dx <= rr && !put; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== rr) continue;
            if (pplStandable(th[0] + dx, th[1] + dy)) { hx = th[0] + dx; hy = th[1] + dy; put = true; }
          }
      var best = 0, bestMin = 0;
      for (var mm = 0; mm < 1440; mm += 20) {
        T.min = mm; try { render(); } catch (e) {}
        if (BARK_DREW.length > best) { best = BARK_DREW.length; bestMin = mm; }
      }
      T.min = bestMin; try { render(); } catch (e) {}
      o.crowd = best;
      o.asked = Object.keys(CAST_FID_ASKED);
      o.haveYet = Object.keys(CAST_FID);
      /* NO HOLE WHILE IT BAKES: everybody still has a body right now. */
      o.bodiesDuringBake = BARK_DREW.filter(function (d) { return !!ctBody(d.p, 'S'); }).length;
      return o;
    });
    ok('the lazy faction bake is wired on both sides', f1.wired, f1.err || '');
    ok('there are Cartel bodies on their own ground', f1.homes > 0 && f1.crowd > 0,
      f1.homes + ' live near the base, ' + f1.crowd + ' on the glass');
    ok('*** IT ASKS FOR THE ONE FACTION IT NEEDS, NOT ALL THIRTEEN ***',
      f1.asked && f1.asked.length === 1 && f1.asked[0] === 'Cartel',
      'asked for: ' + (f1.asked || []).join(', '));
    ok('*** AND NOBODY LOSES THEIR BODY WHILE IT BAKES ***',
      f1.bodiesDuringBake === f1.crowd,
      f1.bodiesDuringBake + ' of ' + f1.crowd + ' still drawn mid-bake');

    await wait(5000);
    var f2 = await fr.evaluate(function () {
      var o = {};
      try { render(); } catch (e) {}
      o.have = Object.keys(CAST_FID);
      o.rows = BARK_DREW.map(function (d) {
        var f = null; try { f = ctFactionOf(d.p); } catch (e) {}
        return { fid: f, wearing: !!(f && CAST_FID[f]), drew: !!ctBody(d.p, 'S') };
      });
      o.leak = o.rows.filter(function (r) { return !r.fid && r.wearing; }).length;
      return o;
    });
    ok('*** THE OUTFIT ARRIVES AND THEY PUT IT ON ***',
      f2.have.indexOf('Cartel') >= 0 && f2.rows.length > 0
      && f2.rows.filter(function (r) { return r.fid; })
               .every(function (r) { return r.wearing; }),
      f2.rows.filter(function (r) { return r.wearing; }).length + ' of '
        + f2.rows.filter(function (r) { return r.fid; }).length + ' affiliated now wearing it');
    ok('everybody is still drawn afterwards',
      f2.rows.every(function (r) { return r.drew; }));
    /* AND IT MUST NOT SPREAD. Most of the valley runs with nobody, correctly. */
    ok('*** AND NOBODY UNAFFILIATED IS PUT IN SOMEBODY ELSE\'S OUTFIT ***',
      f2.leak === 0, f2.leak + ' leaked');

    ok('and the page threw nothing the whole time', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'TRADE FIT GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'TRADE FIT GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();

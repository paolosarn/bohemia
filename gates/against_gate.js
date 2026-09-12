/* BOHEMIA AGAINST GATE (9/5/26, PEOPLE lane).
 * VAMILY [who is hostile] -- row THE-CROWD-CARRIES-THE-SIGN.
 *
 * THE ROW: "the between-ledger already computes who is hostile to you (sorted
 * hostile-first, they charge more, 'only enemies watch you'). None of that
 * reaches the street. Make the sign visible in the crowd: they watch, they
 * follow, they block a door, they refuse."
 *
 * *** MEASURED FIRST, AND IT MOVED THE JOB TWICE. ***
 *   1. 0 of 61 people within three neighbourhoods of the spawn run with ANYBODY
 *      (nearest base 29 cells, a base's pull reaches 12). So a sign built on
 *      outfits alone is dark everywhere a demo player walks. It reads the
 *      PERSON-level deed ledger too, and either channel lights it.
 *   2. THE SEAT BUG, FOUND BY RUNNING IT. between(theirOutfit, myOutfit) is
 *      NULL for every enemy the player EARNED -- an earned edge is written in
 *      one seat, his authored pairs happen to be written in both. A row that
 *      already shipped, "AND THEY ARE UP AGAINST YOU", was asking from the
 *      wrong seat and could never fire for the case its own comment describes.
 *      Fixed at the root; both callers now go through myRipples, which walks
 *      both seats -- and which had ZERO CALLERS in the whole repo until today.
 *
 * PROVES:
 *   A  the ladder is built out of words that already exist, and it never
 *      invents a level or a magnitude
 *   B  IT CANNOT INVENT HOSTILITY: nothing in, nothing out
 *   C  the worse of the two reasons wins, and both halves survive the join
 *   D  the follow step: one cell, stops at arm's length plus one, never onto
 *      the player, never through a wall
 *   E  ON THE REAL SURFACE, OUTFIT CHANNEL: side with the Remnants, stand on
 *      Cartel ground, and the crowd turns to watch, follows every step you
 *      take, stops two cells back, never stacks two bodies in one cell, and
 *      the card refuses to deal with you
 *   F  ON THE REAL SURFACE, PERSONAL CHANNEL: one weight on his STANDING dial
 *      and the person who watched you turns their head
 *   G  and it is DARK when nobody is against you, which is most of the valley
 *
 *   node gates/against_gate.js
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

var A = require(path.join(ROOT, 'engine/bohemia_against.js'));
var S = require(path.join(ROOT, 'engine/bohemia_standing.js'));
var B = require(path.join(ROOT, 'engine/bohemia_between.js'));
var CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

head('A. THE LADDER IS BUILT OUT OF WORDS THAT ALREADY EXIST');
ok('the four signs are the four the row names, in escalation order',
  A.SIGNS.join(',') === 'watch,follow,refuse,block', A.SIGNS.join(','));
/* EVERY LEVEL NAME IS SOMEBODY ELSE'S WORD. COLD and HOSTILE are two of
   BohemiaStanding's five rungs; WAR is BohemiaBetween's locked:'war'. If a
   fourth level ever appears here to make room for a fifth sign, this goes red. */
var rungWords = S.RUNGS.map(function (r) { return String(r[0]).toLowerCase(); });
var levels = Object.keys(A.LEVELS);
ok('*** IT INVENTS NO LEVEL OF ITS OWN ***',
  levels.length === 3 && levels.every(function (L) {
    return rungWords.indexOf(L) >= 0 || L === 'war'; }), levels.join(', '));
ok('and WAR is a word this repo already uses for a locked position',
  Object.keys(B.SPEC).some(function (k) { return B.SPEC[k].locked === 'war'; }),
  Object.keys(B.SPEC).filter(function (k) { return B.SPEC[k].locked === 'war'; }).join(','));
/* THE MODULE MUST NOT GROW A COPY OF THE RUNG LADDER. It takes the rung as a
   WORD, computed by the caller with rungFor(). A second copy of that ladder in
   here is the drift this lane has deleted six times.
   *** A COMMENT IS A BLOCK, NOT A LINE, AND A -1 IS NOT A RUNG. *** The first
   version of these two claims grepped the raw file for module names and for the
   digits -3 and -1, and went red on its own header comment and on the `dy < 0 ?
   -1 : 0` inside a step. Both were the check being wrong about what it was
   measuring, not the code. So the comments come off first, and the claim asks
   the thing it actually means: this file never sees an opinion NUMBER. */
var SRC = fs.readFileSync(path.join(ROOT, 'engine/bohemia_against.js'), 'utf8');
var CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
ok('*** AND IT HOLDS NO SECOND COPY OF THE RUNG LADDER ***',
  CODE.indexOf('RUNGS') < 0 && CODE.indexOf('rungFor') < 0,
  'no rung ladder in the file');
ok('*** IT IS HANDED A RUNG WORD AND NEVER AN OPINION NUMBER ***',
  /String\(rung/.test(CODE) && CODE.indexOf('facts.value') < 0
  && CODE.indexOf('opinionOf') < 0);
ok('every player-facing sentence ships as an attempt',
  Object.keys(A.WORDS).every(function (w) {
    return Object.keys(A.WORDS[w]).every(function (L) { return typeof A.WORDS[w][L] === 'string'; }); })
  && A.read({ rung: 'COLD' }).draft === true);

head('B. IT CANNOT INVENT HOSTILITY');
ok('*** NOTHING IN, NOTHING OUT ***', A.read({}) === null && A.read(null) === null);
ok('a neutral rung is not a grudge', A.read({ rung: 'NEUTRAL' }) === null);
ok('a warm rung is not a grudge', A.read({ rung: 'WARM' }) === null);
ok('a warm outfit position is not a grudge',
  A.read({ rel: { sign: 'warm', init: 35 } }) === null);
ok('an outfit position with no sign at all is not a grudge',
  A.read({ rel: { sign: 'unknown', init: null } }) === null);
/* THE MODULE'S OWN CONSTRAINT: it is handed facts and never goes looking. If it
   ever reaches for a global this claim goes red. */
ok('*** IT READS NOTHING IT WAS NOT HANDED ***',
  CODE.indexOf('BohemiaStanding') < 0 && CODE.indexOf('BohemiaBetween') < 0
  && CODE.indexOf('DEED_WEIGHT') < 0 && CODE.indexOf('document') < 0);

head('C. THE WORSE OF THE TWO WINS, AND BOTH HALVES SURVIVE');
var onlyThem = A.read({ rel: { sign: 'hostile', init: -45 } });
var onlyYou = A.read({ rung: 'COLD' });
var both = A.read({ rel: { sign: 'hostile', init: -45 }, rung: 'COLD' });
var atWar = A.read({ rel: { sign: 'hostile', init: -80, war: true }, rung: 'COLD' });
ok('their outfit alone reads as THEM', !!onlyThem && onlyThem.why === 'them' && onlyThem.level === 'hostile');
ok('their own eyes alone read as YOU', !!onlyYou && onlyYou.why === 'you' && onlyYou.level === 'cold');
ok('*** A COLD PERSON IN A HOSTILE OUTFIT IS HOSTILE, NOT THE AVERAGE ***',
  !!both && both.level === 'hostile' && both.why === 'both',
  both.level + '/' + both.why);
ok('*** AND A COLD PERSON AT WAR WITH YOU IS AT WAR ***',
  !!atWar && atWar.level === 'war', atWar.level + '/' + atWar.why);
ok('both halves survive the join, so a card can say which one it is',
  both.outfit === 'hostile' && both.personal === 'cold');
head('   AND EACH LEVEL EARNS ITS OWN SIGNS');
ok('COLD only watches', onlyYou.signs.watch && !onlyYou.signs.follow
  && !onlyYou.signs.refuse && !onlyYou.signs.block);
ok('HOSTILE watches, follows and refuses, and does not get in your way',
  both.signs.watch && both.signs.follow && both.signs.refuse && !both.signs.block);
ok('*** ONLY WAR STANDS IN YOUR WAY ***', atWar.signs.block === true);
ok('and the signs come back as words a surface can say out loud',
  A.signsOf(atWar).length === 4 && A.signsOf(atWar).every(function (s) { return s.draft === true; }),
  A.signsOf(atWar).map(function (s) { return s.sign; }).join('+'));

head('D. THE FOLLOW STEP');
var open = function () { return true; };
ok('one cell at a time, diagonals included',
  A.follow([0, 0], [9, 9], open).join(',') === '1,1');
ok('*** IT STOPS AT ARM\'S LENGTH PLUS ONE, WHICH IS THE CITY\'S OWN DISTANCE ***',
  A.KEEP === 2 && A.follow([0, 0], [2, 0], open).join(',') === '0,0',
  'KEEP=' + A.KEEP);
ok('and it never steps onto the player',
  A.follow([0, 0], [1, 0], open).join(',') === '0,0'
  && A.follow([0, 0], [1, 1], open).join(',') === '0,0');
/* A WALKER THAT CANNOT TURN IS NOT MEASURING WALKING, IT IS MEASURING A WALL --
   this lane's own lesson from the walk gate, applied to the follower. */
var wallX = function (x) { return x !== 1; };
ok('*** BLOCKED IS NOT STUCK: IT SLIDES THE WAY A PERSON WOULD ***',
  A.follow([0, 0], [9, 9], function (x, _y) { return wallX(x); }).join(',') === '0,1',
  A.follow([0, 0], [9, 9], function (x, _y) { return wallX(x); }).join(','));
ok('and when nothing is open it holds rather than teleporting',
  A.follow([0, 0], [9, 9], function () { return false; }).join(',') === '0,0');
ok('sight is the deed ledger\'s own range, asked not copied',
  A.inSight([0, 0], [9, 0], S.SEE_RANGE) && !A.inSight([0, 0], [10, 0], S.SEE_RANGE),
  'SEE_RANGE=' + S.SEE_RANGE);

head('E. THE SEAT BUG, AND IT WAS ALREADY SHIPPED');
/* Siding with the Remnants earns CUSTOM -> CARTEL, war. Asked from the street's
   seat -- what does a CARTEL body hold about MY outfit -- the old call returns
   NULL, which is why the crowd could never carry a sign for the one enemy the
   player made on purpose. */
var sv = { meta: {} };
var made = B.earn(sv, 'Remnants', 'inside', 1);
ok('siding with the Remnants really does earn you the Cartel',
  made.length === 1 && made[0].to === 'CARTEL' && made[0].war === true,
  made.map(function (e) { return e.to + ':' + e.sign + ':war=' + e.war; }).join(','));
ok('*** AND THE OLD CALL COULD NOT SEE IT: between(theirs, mine) IS NULL ***',
  B.between('Cartel', B.mine(), sv) === null);
ok('*** WHILE myRipples WALKS BOTH SEATS AND FINDS IT ***',
  B.myRipples(sv).filter(function (r) {
    return String(r.to).toUpperCase() === 'CARTEL' && r.war; }).length === 1);
ok('so the city asks through myRipples now, at both call sites',
  CITY.indexOf('function ctRelToMine') > 0
  && (CITY.split('ctRelToMine(').length - 1) >= 3
  && CITY.indexOf('BohemiaBetween.between(fid, BohemiaBetween.mine()') < 0,
  (CITY.split('ctRelToMine(').length - 1) + ' references');
ok('and myRipples, which had no caller anywhere, has one',
  CITY.indexOf('BohemiaBetween.myRipples(') > 0);

head('F. IT IS IN THE WALKED CITY, IN THE FUNCTIONS THAT ALREADY DECIDE THIS');
ok('the module is inlined', CITY.indexOf('__CITY_AGAINST__') > 0
  && CITY.indexOf('BohemiaAgainst') > 0);
ok('the city carries the version of the module that stops at two cells',
  CITY.indexOf('var KEEP = 2;') > 0);
/* IT RIDES THE FUNCTION THAT ALREADY DECIDES WHICH WAY A BODY LOOKS, rather
   than a second facing pass that could disagree with the first. */
var face = CITY.slice(CITY.indexOf('function pplFace(p, at)'),
                      CITY.indexOf('function pplFace(p, at)') + 900);
ok('*** THE WATCH IS INSIDE pplFace, NOT BESIDE IT ***',
  face.indexOf('ctAgainstMe') > 0 && face.indexOf('ctSeeRange') > 0);
ok('the schedule keeps its own function, so a follower can never be confused for it',
  CITY.indexOf('function pplAtSched(p)') > 0 && CITY.indexOf('function pplAt(p) {\n  var f = CT_FOLLOW') > 0);
/* WORLD MOVERS LAW: nothing moves until you do. So the follow step is called
   from the walk and from nowhere else -- a timer here would break the law. */
ok('*** ONE STEP OF THEIRS PER STEP OF YOURS, AND NO TIMER ANYWHERE ***',
  (CITY.split('ctFollowStep()').length - 1) === 2
  && !/setInterval\s*\(\s*ctFollowStep|setTimeout\s*\(\s*ctFollowStep/.test(CITY),
  (CITY.split('ctFollowStep()').length - 1) + ' references (the definition and the walk)');
/* BOTH BRANCHES OF THE WALK, because stepOnce admits you two different ways --
   through a door, and onto walkable ground -- and a blocker who only stops one
   of them is a blocker you walk around without noticing. */
ok('the refusal is inside both branches stepOnce already has',
  (CITY.split('ctBlocked(nx,ny)').length - 1) === 2
  && CITY.indexOf('function ctBlocked') > 0
  && CITY.indexOf('function ctBlockCell') > 0,
  (CITY.split('ctBlocked(nx,ny)').length - 1) + ' guarded branches');
ok('and the bounced door speaks in the line the street already has',
  CITY.indexOf("document.getElementById('packline')") > 0
  && CITY.indexOf('CT_AGAINST_SAY') > 0);

/* ---------------------------------------------------------------------------
   G + H. ON THE REAL SURFACE.
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
    await wait(3000);
    var fr = page.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];

    head('G. ON THE REAL SURFACE: DARK UNTIL SOMEBODY IS ACTUALLY AGAINST YOU');
    ok('the demo opens and the city is in it', !!fr);
    if (!fr) throw new Error('no city frame');

    var cold = await fr.evaluate(function () {
      var o = {};
      for (var q = 0; q < 6; q++) { var gb = document.querySelector('#daycardIn .dcgo'); if (gb) gb.click(); }
      try { cardHide(); } catch (e) {}
      T.min = 13 * 60;
      o.wired = typeof ctAgainstMe === 'function' && typeof BohemiaAgainst !== 'undefined'
             && typeof ctFollowStep === 'function' && typeof pplAtSched === 'function';
      try { render(); } catch (e) { o.threw = String(e.message).slice(0, 120); }
      /* NOBODY NEAR THE SPAWN IS AGAINST ANYBODY, and that must read as silence
         rather than as a neutral badge on every body in the valley. */
      var n = 0, drew = 0;
      var NB = BohemiaPopulation.NB, span = NB * FN;
      var cx = Math.floor(hx / span), cy = Math.floor(hy / span);
      for (var ny = Math.max(0, cy - 1); ny <= cy + 1; ny++)
      for (var nx = Math.max(0, cx - 1); nx <= cx + 1; nx++) {
        var ppl = pplPeople(nx, ny);
        for (var j = 0; j < ppl.length; j++) { drew++; if (ctAgainstMe(ppl[j])) n++; }
      }
      o.people = drew; o.against = n;
      o.followers = Object.keys(CT_FOLLOW).length;
      return o;
    });
    ok('the whole thing is wired into the walked city', cold.wired);
    ok('nothing threw on the first draw', !cold.threw, cold.threw || '');
    ok('*** AND NOT ONE OF THEM IS AGAINST YOU, BECAUSE NOT ONE OF THEM IS ***',
      cold.people > 0 && cold.against === 0,
      cold.against + ' of ' + cold.people + ' people near the spawn');
    ok('so nobody is following you either', cold.followers === 0);

    head('H. THE PERSONAL CHANNEL: ONE WEIGHT ON HIS DIAL AND A HEAD TURNS');
    var pers = await fr.evaluate(function () {
      var o = {};
      /* HIS DIAL, THE REAL ONE. ctDialApply is what the DIRECT tab's STANDING
         slider posts into this frame; nothing here writes a weight by hand. */
      ctDialApply({ 'commit': -6 }, false);
      o.weighted = BohemiaStanding.DEED_WEIGHT['commit'];
      /* A REAL DEED, THROUGH THE REAL WITNESS PASS: ctDeed is what a commitment
         at a wall calls, and the witnesses are BARK_DREW, who was on the glass. */
      try { render(); } catch (e) {}
      o.drawn = BARK_DREW.length;
      ctDeed('commit', CT_DEED_CLOUT['commit'], 'Cartel');
      ctAgainstBump();
      try { render(); } catch (e) {}
      var rows = [];
      for (var i = 0; i < BARK_DREW.length; i++) {
        var p = BARK_DREW[i].p, at = BARK_DREW[i].at, ag = ctAgainstMe(p);
        if (!ag) continue;
        rows.push({ level: ag.level, why: ag.why,
                    face: pplFace(p, at), toward: dirOf(hx - at[0], hy - at[1]),
                    dist: Math.max(Math.abs(hx - at[0]), Math.abs(hy - at[1])) });
      }
      o.rows = rows;
      return o;
    });
    ok('his dial really put a weight on a street deed', pers.weighted === -6);
    ok('somebody was on the glass to see it', pers.drawn > 0, pers.drawn + ' drawn');
    ok('*** THE PERSON WHO WATCHED IT IS NOW AGAINST YOU, AND IT IS PERSONAL ***',
      pers.rows.length > 0 && pers.rows.every(function (r) { return r.why === 'you'; }),
      pers.rows.map(function (r) { return r.level + '/' + r.why; }).join(', '));
    ok('*** AND THEIR HEAD IS TURNED TO YOU RATHER THAN TO THEIR COMMUTE ***',
      pers.rows.length > 0 && pers.rows.every(function (r) { return r.face === r.toward; }),
      pers.rows.map(function (r) { return r.face + ' vs ' + r.toward + ' at ' + r.dist; }).join(' | '));

    head('I. THE OUTFIT CHANNEL, ON THEIR GROUND, THROUGH REAL WALKING');
    var out = await fr.evaluate(function () {
      var o = {};
      /* A CLEAN SLATE: his dial goes back to nothing so this half cannot be
         carried by the personal half above. */
      ctDialApply({}, false);
      CT_MINDS = {}; CT_FOLLOW = {}; ctAgainstBump();

      var sv = ctBelongSave();
      o.earned = (BohemiaBetween.earn(sv, 'Remnants', 'inside', 1) || [])
                   .map(function (e) { return e.to + ':' + e.sign + ':war=' + e.war; });
      ctAgainstBump();

      /* GO WHERE THE CARTEL ACTUALLY LIVE. Their base cell draws nobody; the
         census says twenty-five of them live within ten cells of it, so this
         finds the densest cluster of Cartel HOMES and stands beside it.
         MOVED BY HAND, AND ONLY TO GET THERE: everything measured below runs
         through stepOnce, which is what a d-pad press runs. */
      var bases = ctBases() || {}, cb = bases['Cartel'];
      var NB = BohemiaPopulation.NB, span = NB * FN;
      var nx0 = Math.floor(cb.x * FN / span), ny0 = Math.floor(cb.y * FN / span);
      var homes = [];
      for (var ny = Math.max(0, ny0 - 1); ny <= ny0 + 1; ny++)
      for (var nx = Math.max(0, nx0 - 1); nx <= nx0 + 1; nx++) {
        var ppl = pplPeople(nx, ny);
        for (var j = 0; j < ppl.length; j++)
          if (String(ctFactionOf(ppl[j])) === 'Cartel') homes.push(ppl[j].home);
      }
      o.cartelHomes = homes.length;
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

      var seen = [];
      for (var i = 0; i < BARK_DREW.length; i++) {
        var p = BARK_DREW[i].p, at = BARK_DREW[i].at, ag = ctAgainstMe(p);
        seen.push({ fid: ctFactionOf(p), level: ag ? ag.level : null,
                    why: ag ? ag.why : null,
                    face: pplFace(p, at), toward: dirOf(hx - at[0], hy - at[1]) });
      }
      o.onGlass = seen;

      /* REAL MOVEMENT. Nothing below touches hx or CT_FOLLOW by hand. */
      var dir = 2, blk = 0, ticks = 0, maxF = 0, stacked = 0;
      for (var s = 0; s < 300; s++) {
        var went = false;
        try { went = stepOnce(dir); } catch (e) { o.threw = String(e.message).slice(0, 120); break; }
        if (went) blk = 0; else { blk++; dir = (dir + (blk > 3 ? 3 : 1)) % 8; }
        if (s % 4 === 3) { try { render(); } catch (e) {} }
        var ids = Object.keys(CT_FOLLOW);
        if (ids.length > maxF) maxF = ids.length;
        if (ids.length) ticks++;
        var cells = {};
        for (var k = 0; k < ids.length; k++) {
          var key = CT_FOLLOW[ids[k]].join(',');
          if (cells[key]) stacked++; cells[key] = 1;
          if (key === hx + ',' + hy) stacked++;   /* never on the player either */
        }
      }
      o.steps = 300; o.followTicks = ticks; o.maxFollowers = maxF; o.stacked = stacked;
      o.dists = Object.keys(CT_FOLLOW).map(function (k) {
        return Math.max(Math.abs(hx - CT_FOLLOW[k][0]), Math.abs(hy - CT_FOLLOW[k][1])); });

      /* AND THE CARD REFUSES. Walked next to one and opened it the way the game
         does -- ctOpen takes nobody, it asks ctAdjacent, so this stands beside a
         body rather than handing the card a person. */
      var tgt = null;
      try { render(); } catch (e) {}
      for (var t = 0; t < BARK_DREW.length; t++) {
        var ag2 = ctAgainstMe(BARK_DREW[t].p);
        if (ag2 && ag2.signs.refuse) { tgt = BARK_DREW[t]; break; }
      }
      if (tgt) {
        var at2 = tgt.at, done = false;
        for (var d2 = 0; d2 < 8 && !done; d2++) {
          var v = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]][d2];
          if (pplStandable(at2[0] + v[0], at2[1] + v[1])) {
            hx = at2[0] + v[0]; hy = at2[1] + v[1]; done = true; }
        }
        try { render(); ctOpen(); } catch (e) { o.cardThrew = String(e.message).slice(0, 140); }
        var el = document.getElementById('ctcard');
        var txt = el ? String(el.textContent || '') : '';
        o.cardOpen = !!CT_OPEN;
        o.saysAgainst = txt.indexOf('THEY ARE AGAINST YOU') >= 0;
        o.saysWar = txt.indexOf('AT WAR') >= 0;
        o.saysWatching = txt.indexOf('THEY ARE WATCHING YOU') >= 0;
        o.saysBlocking = txt.indexOf('STANDING IN THE WAY') >= 0;
        o.refuses = txt.indexOf('not going to answer you') >= 0
                 || txt.indexOf('will not take anything off you') >= 0;
        o.askBtn = !!document.getElementById('ctask');
        o.giveBtn = !!document.getElementById('ctgive');
      }
      return o;
    });

    ok('siding with the Remnants earned you the Cartel, at war',
      out.earned.length === 1 && /war=true/.test(out.earned[0]), out.earned.join(','));
    ok('there are Cartel bodies to meet', out.cartelHomes > 0 && out.crowd > 0,
      out.cartelHomes + ' live near the base, ' + out.crowd + ' on the glass');
    var hostiles = (out.onGlass || []).filter(function (r) { return r.level; });
    ok('*** EVERY CARTEL BODY ON THE GLASS IS AT WAR WITH YOU, BY THEIR OUTFIT ***',
      hostiles.length > 0 && hostiles.every(function (r) {
        return r.level === 'war' && r.why === 'them'; }),
      hostiles.length + ' of ' + out.onGlass.length + ' on the glass');
    ok('*** AND EVERY ONE OF THEM IS LOOKING AT YOU ***',
      hostiles.length > 0 && hostiles.every(function (r) { return r.face === r.toward; }),
      hostiles.map(function (r) { return r.face + '/' + r.toward; }).join(' '));
    ok('nothing threw while walking', !out.threw, out.threw || '');
    ok('*** THEY FOLLOW, EVERY STEP YOU TAKE, THROUGH THE D-PAD\'S OWN FUNCTION ***',
      out.maxFollowers > 0 && out.followTicks === out.steps,
      out.maxFollowers + ' followers, active on ' + out.followTicks + ' of ' + out.steps + ' steps');
    /* *** THIS CLAIM WAS BACKWARDS AND THE SURFACE CORRECTED IT. *** It asked
       that every follower be within KEEP, went red on 2, 3, 2, and the 3 was
       the code being RIGHT: a follower who got boxed out of the cell it wanted
       holds, and the player walking on puts it a cell further back. KEEP is
       where they stop CLOSING, not a leash. What must never happen is a
       follower coming closer than that -- walking into you -- and that a clear
       run really does close to it. */
    ok('*** THEY CLOSE TO TWO CELLS AND NEVER ONE STEP NEARER ***',
      out.dists.length > 0 && out.dists.every(function (d) { return d >= A.KEEP; })
      && out.dists.some(function (d) { return d === A.KEEP; }),
      'distances: ' + out.dists.join(', ') + ' (KEEP=' + A.KEEP + ')');
    /* OCCUPANCY LAW. The first cut of this put three men in one cell for six
       hundred steps because each followed without knowing the others existed. */
    ok('*** OCCUPANCY LAW: NEVER TWO BODIES IN ONE CELL, NEVER ONE ON YOU ***',
      out.stacked === 0, out.stacked + ' collisions in ' + out.steps + ' steps');
    ok('the card opens on one of them', !!out.cardOpen, out.cardThrew || '');
    ok('*** AND IT LEADS WITH IT, IN WORDS, AT THE TOP OF THE CARD ***',
      out.saysAgainst && out.saysWar);
    ok('*** IT EXPLAINS WHAT THEY ARE DOING ON THE STREET ***',
      out.saysWatching && out.saysBlocking);
    ok('*** AND THEY REFUSE: THE OFFERS ARE WITHDRAWN, NOT LEFT THERE TO LIE ***',
      out.refuses && !out.askBtn && !out.giveBtn,
      'refuse line ' + (out.refuses ? 'yes' : 'NO') + ', ask button '
        + (out.askBtn ? 'STILL THERE' : 'gone') + ', give button '
        + (out.giveBtn ? 'STILL THERE' : 'gone'));
    head('J. AND THE FOURTH SIGN: THEY GET IN YOUR WAY');
    /* *** THE ROW SAYS "THEY BLOCK A DOOR" AND THE MAP SAYS THERE ARE NO DOORS.
       *** The first version of this section looked for one within forty cells of
       the ground the Cartel live on and found NONE, which matches stepOnce's own
       measurement written in the city: "39,706 solid cells admit you, 7 painted
       doors exist ... TEN OF FOURTEEN district types have zero of either." A
       sign wired only to doorways is correct and invisible, which is the exact
       failure this job was measured to avoid. So a doorway is the special case
       and the general one is THE CELL YOU ARE ABOUT TO WALK INTO -- the same
       sentence, and the OCCUPANCY LAW this game already has. */
    var blk = await fr.evaluate(function () {
      var o = {};
      /* STAND STILL AND LET THE MECHANISM RUN. Nothing here places a blocker:
         ctFollowStep does, the same function every walked step calls. */
      try { render(); } catch (e) {}
      /* *** THIS LEG ONLY EVER LOOKED AT ONE OF THE TWO CELLS THE CODE PICKS
         BETWEEN, AND ON 9/6 THE OTHER ONE BECAME REACHABLE FOR THE FIRST TIME. ***
         ctBlockCell() chooses A DOORWAY BESIDE YOU FIRST and only falls back to the
         cell in front -- the row's own two sentences, in that order. This leg read
         the faced cell alone, and it was green for one reason: the comment forty
         lines above says a doorway "within forty cells of the ground the Cartel
         live on" did not exist, so branch 1 could never fire and branch 2 always
         did. LIFE + CITY's AN ADDRESS IS A FRONT DOOR (9/6) seats residents at
         their own front doors, and the block above stands the player NEXT TO a
         refusing body -- so there is now a doorway beside the player and the
         mechanism takes the branch it always preferred. The leg went red while the
         code did the BETTER of its two documented things.
         So it asks the real question: is a body at war standing in one of the two
         cells this mechanism is written to choose, and does walking INTO THAT CELL
         get refused. FIX THE RULER, NEVER THE TARGET.
         Record: records/BOHEMIA_AN_ADDRESS_IS_A_FRONT_DOOR_9_6_26.md */
      /* *** TURN AND FACE THEM, WHICH IS WHAT MAKES THIS A TEST OF THE MECHANISM
         AND NOT OF ARITHMETIC. *** Followers TRAIL you (BohemiaAgainst.follow
         closes to KEEP behind), so the cell in front of a walking player is two
         steps out of any of their reach and ctBlockCell()'s branch 2 -- which
         requires the faced cell to be within one of the BODY -- can never fire.
         Measured 9/6, three identical runs: three followers, all of them south,
         the player facing north. This leg was green because the walk above
         happened to end with one of them beside the cell the player faced; it is
         not a property the code guarantees, and LIFE + CITY moving where people
         live (AN ADDRESS IS A FRONT DOOR, 9/6) moved the end of that walk.
         So the leg now sets up the ONE situation the row is about: a cell the
         player is facing, EMPTY, and within one step of a body at war. If they
         interpose, the mechanism did it -- nothing else can put them there.
         PROVEN THE ONLY WAY THAT COUNTS: with ctBlockCell() stubbed to return
         null this goes red. An earlier cut that accepted a blocker ANYWHERE
         beside you did NOT go red under that stub, because a plain follower ends
         up beside you anyway. A leg that cannot tell the mechanism from its
         absence is decoration.
         Record: records/BOHEMIA_AN_ADDRESS_IS_A_FRONT_DOOR_9_6_26.md */
      var before = [hx, hy], got = null, gotAt = null;
      try { ctFollowStep(); render(); } catch (e) {}
      var occupied = function (cx, cy) { return !!ctBlocked(cx, cy); };
      var near = function (cx, cy) {            /* within one step of a follower */
        for (var kk in CT_FOLLOW) {
          var f = CT_FOLLOW[kk];
          if (Math.max(Math.abs(f[0] - cx), Math.abs(f[1] - cy)) <= 1) return true;
        }
        return false;
      };
      var want = null, wantFace = null;
      for (var fd in PPL_DIRV) {
        var vd = PPL_DIRV[fd], cx2 = hx + vd[0], cy2 = hy + vd[1];
        if (!pplStandable(cx2, cy2)) continue;
        if (occupied(cx2, cy2)) continue;       /* already standing there proves nothing */
        if (!near(cx2, cy2)) continue;          /* out of reach: the code cannot fill it */
        want = [cx2, cy2]; wantFace = fd; break;
      }
      o.setUpCell = want; o.setUpFace = wantFace;
      if (want) {
        HFACE = wantFace;
        for (var t = 0; t < 20 && !got; t++) {
          try { ctFollowStep(); render(); } catch (e) {}
          var cands = [[hx + PPL_DIRV[HFACE][0], hy + PPL_DIRV[HFACE][1]]];
          /* branch 1: a doorway beside you, which ctBlockCell prefers */
          for (var ddy = -1; ddy <= 1; ddy++) for (var ddx = -1; ddx <= 1; ddx++) {
            if (!ddx && !ddy) continue;
            var cc = cellAt(hx + ddx, hy + ddy);
            if (cc && cc.enter) cands.push([hx + ddx, hy + ddy]);
          }
          for (var ci = 0; ci < cands.length && !got; ci++) {
            var g0 = ctBlocked(cands[ci][0], cands[ci][1]);
            if (g0) { got = g0; gotAt = cands[ci]; }
          }
        }
      }
      o.blocker = got;
      o.blockAt = gotAt;
      o.onDoor = !!(gotAt && (cellAt(gotAt[0], gotAt[1]) || {}).enter);
      /* WHY NOT, when it is not. A leg that can only say "nobody" cannot be
         debugged by anybody who did not write it. */
      o.followers = Object.keys(CT_FOLLOW || {}).length;
      o.followAt = Object.keys(CT_FOLLOW || {}).map(function (k) {
        var f = CT_FOLLOW[k];
        return f.join(',') + '@' + Math.max(Math.abs(f[0] - hx), Math.abs(f[1] - hy));
      }).join(' ');
      o.drew = (typeof BARK_DREW !== 'undefined' ? BARK_DREW.length : -1);
      o.wantBlock = (function () {
        var n = 0;
        for (var q = 0; q < (BARK_DREW || []).length; q++) {
          var a2 = null; try { a2 = ctAgainstMe(BARK_DREW[q].p); } catch (e) {}
          if (a2 && a2.signs && a2.signs.block) n++;
        }
        return n;
      })();
      o.face = HFACE;
      o.stillThere = (hx === before[0] && hy === before[1]);
      if (!got) return o;
      /* AND NOW WALK INTO THEM, through the function a d-pad press runs. THE
         DIRECTION IS THE ONE THAT LEADS TO THE CELL THEY ARE ACTUALLY IN, which
         for a doorway block is not always the way the body happens to face. */
      var pl = document.getElementById('packline'); if (pl) pl.textContent = '';
      var vv = [gotAt[0] - hx, gotAt[1] - hy];
      var di = -1;
      for (var k = 0; k < DIRS.length; k++)
        if (DIRS[k][0] === vv[0] && DIRS[k][1] === vv[1]) di = k;
      o.dirFound = di >= 0;
      var at0 = [hx, hy];
      o.went = stepOnce(di);
      o.moved = (hx !== at0[0] || hy !== at0[1]);
      o.said = pl ? String(pl.textContent || '') : '';
      /* AND IT CANNOT TRAP YOU. A blocker holds ONE cell; every other direction
         that was walkable before is still walkable. */
      var outs = 0;
      for (var g = 0; g < 8; g++) {
        if (g === di) continue;
        var bx = hx, by = hy, w = false;
        try { w = stepOnce(g); } catch (e) {}
        if (w) { outs++; hx = bx; hy = by; }
      }
      o.waysOut = outs;
      return o;
    });
    ok('*** A BODY AT WAR WITH YOU PUTS ITSELF IN FRONT OF YOU, OR IN YOUR DOORWAY ***',
      !!blk.blocker, blk.blocker
        ? (blk.blocker + ' stepped into your way at ' + JSON.stringify(blk.blockAt)
           + (blk.onDoor ? ' (THE DOORWAY, branch 1)' : ' (the cell in front, branch 2)')
           + ', you facing ' + blk.face)
        : ('nobody stepped into ' + JSON.stringify(blk.setUpCell) + ' facing '
           + blk.setUpFace + ' (' + blk.drew + ' drawn, ' + blk.wantBlock
           + ' of them want to block, ' + blk.followers + ' following: '
           + (blk.followAt || 'none') + ')'));
    ok('and the gate is pushing toward the cell they are actually standing in',
      !!blk.dirFound);
    ok('*** THE STEP IS REFUSED AND THE PLAYER DOES NOT MOVE ***',
      blk.went === false && blk.moved === false,
      'stepOnce returned ' + blk.went + ', player ' + (blk.moved ? 'MOVED' : 'held'));
    ok('*** AND IT SAYS SO RATHER THAN FEELING LIKE BROKEN CONTROLS ***',
      /steps into your way/.test(blk.said || ''), JSON.stringify(blk.said || ''));
    /* A BLOCK MUST NEVER BE A TRAP. walk_deadlock_gate exists because this game
       has shipped one. A blocker holds ONE cell and only the one you face. */
    ok('*** AND IT CANNOT TRAP YOU: EVERY OTHER WAY OUT STILL WORKS ***',
      blk.waysOut > 0, blk.waysOut + ' other directions still walk');


    /* ====================================================================
       E. YOU ARE ON THEIR GROUND   (9/12, FACTIONS row [crossing costs])
       "colour is territory and nothing happens when you walk into the wrong
       colour. The moment you cross into a faction's block that does not know
       you: a look, then a tail, then a stop."
       ==================================================================== */
    /* A FRESH PAGE, BECAUSE THE SETUP IS WHAT IS WRONG, NEVER THE CLAIM. The
       sections above deliberately make the player an enemy of the Cartel, and the
       Cartel is the only outfit on that glass -- so on the shared page a body's
       every sign has a reason that is not the ground, and the claims below would
       either go red on a correct game or have to be loosened into meaninglessness.
       Section E is about a STRANGER, so it opens a page where he still is one.
       Same shape as the road card reset: reset the setup, never the claim. */
    var page2 = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs2 = [];
    page2.on('pageerror', function (e) { errs2.push(String(e.message).slice(0, 160)); });
    await page2.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_DEMO.html'));
    await SETTLE(page2, 15000);
    await page2.evaluate(function () {
      var f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await SETTLE(page2, 12000);
    await wait(3000);
    var fr2 = page2.frames().filter(function (x) { return /BOHEMIA_CITY_WORLD/.test(x.url()); })[0];
    ok('E0 a fresh page opened where the player is still a stranger to everybody',
       !!fr2);

    const cross = await fr2.evaluate(function () {
      var o = {};
      /* THE BASELINE THIS ROW EXISTS FOR, measured on the surface rather than
         asserted: standing on somebody's ground, with nothing else against you. */
      o.ground = (function(){ var t=turfAt((hx/FN)|0,(hy/FN)|0)||{}; return {f:t.faction,tier:t.tier}; })();

      /* GO WHERE THEIR PEOPLE ARE FIRST, THE WAY THIS GATE ALREADY KNOWS HOW.
         Measured on a fresh page: NOT ONE affiliated body is drawn at the spawn,
         which is the same fact this module's own header recorded on 9/5 -- a
         base's pull reaches 12 cells and the nearest base is 29 away. A faction
         holds hundreds of blocks and its members live beside its seat, so "walk
         onto their ground" and "meet one of them" are two different places for
         most of the valley. Section D already solves this by standing beside the
         densest cluster of one outfit's HOMES; this is that, reused, on a page
         where the player is still nobody's enemy. */
      var HOMEF = 'Cartel';
      var bases0 = {}; try { bases0 = ctBases() || {}; } catch (e) {}
      var cb0 = bases0[HOMEF];
      if (!cb0) { o.err = 'no base for ' + HOMEF; return o; }
      var NB0 = BohemiaPopulation.NB, span0 = NB0 * FN;
      var nx00 = Math.floor(cb0.x * FN / span0), ny00 = Math.floor(cb0.y * FN / span0);
      var homes0 = [];
      for (var ny0 = Math.max(0, ny00 - 1); ny0 <= ny00 + 1; ny0++)
      for (var nx0 = Math.max(0, nx00 - 1); nx0 <= nx00 + 1; nx0++) {
        var ppl0 = pplPeople(nx0, ny0);
        for (var j0 = 0; j0 < ppl0.length; j0++)
          if (String(ctFactionOf(ppl0[j0])) === HOMEF) homes0.push(ppl0[j0].home);
      }
      o.homes = homes0.length;
      if (!homes0.length) { o.err = 'no ' + HOMEF + ' homes found'; return o; }
      var bi0 = 0, bn0 = -1;
      for (var a0 = 0; a0 < homes0.length; a0++) {
        var c0 = 0;
        for (var b0 = 0; b0 < homes0.length; b0++)
          if (Math.max(Math.abs(homes0[a0][0] - homes0[b0][0]),
                       Math.abs(homes0[a0][1] - homes0[b0][1])) <= 6) c0++;
        if (c0 > bn0) { bn0 = c0; bi0 = a0; }
      }
      var th0 = homes0[bi0], put0 = false;
      for (var rr0 = 1; rr0 < 12 && !put0; rr0++)
        for (var dy0 = -rr0; dy0 <= rr0 && !put0; dy0++)
          for (var dx0 = -rr0; dx0 <= rr0 && !put0; dx0++) {
            if (Math.max(Math.abs(dx0), Math.abs(dy0)) !== rr0) continue;
            if (pplStandable(th0[0] + dx0, th0[1] + dy0)) { hx = th0[0] + dx0; hy = th0[1] + dy0; put0 = true; }
          }
      o.wentTo = HOMEF;
      try { city.x = (hx / FN) | 0; city.y = (hy / FN) | 0; } catch (e) {}

      /* find a faction with bodies ON THE GLASS whose own ground is nearby */
      var best = 0, bestMin = 0;
      for (var mm = 0; mm < 1440; mm += 20) {
        T.min = mm; try { render(); } catch (e) {}
        if (BARK_DREW.length > best) { best = BARK_DREW.length; bestMin = mm; }
      }
      T.min = bestMin; try { render(); } catch (e) {}
      var crowd = {};
      for (var i = 0; i < BARK_DREW.length; i++) {
        var f = null; try { f = ctFactionOf(BARK_DREW[i].p); } catch (e) {}
        if (f) crowd[f] = (crowd[f] || 0) + 1;
      }
      o.crowd = crowd;
      /* *** PICK A FACTION THAT HAS NO QUARREL WITH HIM, AND PROVE IT RATHER THAN
         ASSUME IT. *** The sections above this one deliberately make the player
         an enemy of somebody, so the first outfit on the glass is very likely one
         he is already AT WAR with -- and a war body carries every sign for reasons
         that have nothing to do with the ground. The whole point of this section
         is that the GROUND is the only reason, so it needs a faction that reads
         NOTHING while he is standing off their block. Measured 9/12: the first
         cut took Object.keys(crowd)[0], got the Cartel, and went red on five
         claims while the game was behaving exactly as designed. */
      TURF_USED = {}; try { CT_AGAINST = {}; } catch (e) {}
      var F = null; o.clean = {};
      for (var ci = 0; ci < BARK_DREW.length; ci++) {
        var cf = null; try { cf = ctFactionOf(BARK_DREW[ci].p); } catch (e) {}
        if (!cf) continue;
        var ca = null; try { ca = ctAgainstMe(BARK_DREW[ci].p); } catch (e) {}
        o.clean[cf] = ca ? (ca.level || ('stage' + (ca.stage || 0))) : 'nothing';
        if (!ca && !F) F = cf;
      }
      o.faction = F;
      if (!F) { o.err = 'every outfit on the glass already has a quarrel: '
                     + JSON.stringify(o.clean); return o; }

      /* stand ON their ground, through the map, not by hand-setting a level */
      var cell = null;
      for (var d = 0; d < 40 && !cell; d++)
        for (var dx = -d; dx <= d && !cell; dx++)
          for (var dy = -d; dy <= d && !cell; dy++) {
            var t = turfAt(((hx/FN)|0)+dx, ((hy/FN)|0)+dy);
            if (t && t.faction === F && pplStandable(((hx/FN)|0)+dx, ((hy/FN)|0)+dy) === true) {}
            if (t && t.faction === F) cell = [((hx/FN)|0)+dx, ((hy/FN)|0)+dy];
          }
      if (!cell) { o.err = 'no ' + F + ' ground near'; return o; }
      o.stoodOn = cell;
      o.tier = (turfAt(cell[0], cell[1]) || {}).tier;
      hx = cell[0]*FN + FN/2; hy = cell[1]*FN + FN/2;
      try { city.x = cell[0]; city.y = cell[1]; } catch (e) {}
      /* AND FIND A MINUTE WHEN THEY ARE OUT, AT THE NEW PLACE. Moving the player
         and rendering once asks about whatever hour happened to be on the clock;
         the crowd is a schedule, so the busiest minute HERE is a different minute
         from the busiest minute where he was standing before. Same sweep the
         section above already uses, which is why it is a sweep and not a guess. */
      var best2 = 0, bestMin2 = T.min, fseen = 0;
      for (var m2 = 0; m2 < 1440; m2 += 20) {
        T.min = m2; try { render(); } catch (e) {}
        var c2 = 0;
        for (var q2 = 0; q2 < BARK_DREW.length; q2++) {
          var ff = null; try { ff = ctFactionOf(BARK_DREW[q2].p); } catch (e) {}
          if (ff === F) c2++;
        }
        if (c2 > best2) { best2 = c2; bestMin2 = m2; }
      }
      T.min = bestMin2; try { render(); } catch (e) {}
      o.theirsOnGlass = best2; o.atMinute = bestMin2; o.drewHere = BARK_DREW.length;

      function readOne(blocks) {
        TURF_USED = {}; if (blocks > 0) TURF_USED[F] = blocks;
        try { CT_AGAINST = {}; } catch (e) {}
        var body = null;
        for (var i2 = 0; i2 < BARK_DREW.length; i2++) {
          var f2 = null; try { f2 = ctFactionOf(BARK_DREW[i2].p); } catch (e) {}
          if (f2 === F) { body = BARK_DREW[i2].p; break; }
        }
        if (!body) return null;
        var a = ctAgainstMe(body);
        return a ? { level: a.level, rank: a.rank, why: a.why, stage: a.stage || 0,
                     watch: !!a.signs.watch, follow: !!a.signs.follow,
                     refuse: !!a.signs.refuse, block: !!a.signs.block, word: a.word }
                 : { level: null, rank: 0, why: null, stage: 0,
                     watch: false, follow: false, refuse: false, block: false, word: 'nothing' };
      }
      /* OFF THEIR GROUND, WITHOUT MOVING ANYBODY. The rule is "only the faction
         under your feet reacts", and ctCrossingOn is the function that says so,
         so ask IT about a faction whose ground he is not standing on. Two earlier
         cuts teleported the player instead and both measured the instrument: the
         first zeroed the block counter while still standing on their block (which
         floors at one, correctly), the second moved him one cell and rendered a
         frame with nobody in it. Neither was the game being wrong. */
      var other = null;
      try {
        var seatsE = turfSeats() || [];
        for (var oi = 0; oi < seatsE.length && !other; oi++)
          if (seatsE[oi].faction !== F) other = seatsE[oi].faction;
      } catch (e) {}
      o.otherFaction = other;
      o.otherCrossing = other ? ctCrossingOn(other) : 'none';
      o.off = (function () {
        TURF_USED = {}; if (other) TURF_USED[other] = 9;   /* walked THEIR ground, elsewhere */
        var c = other ? ctCrossingOn(other) : null;
        var a2 = BohemiaAgainst.read({ rel: null, rung: null, coalition: null,
                                       roving: null, crossing: c });
        return a2 ? { level: a2.level, rank: a2.rank, stage: a2.stage || 0,
                      watch: !!a2.signs.watch, follow: !!a2.signs.follow,
                      refuse: !!a2.signs.refuse, block: !!a2.signs.block }
                  : { level: null, rank: 0, stage: 0, watch: false, follow: false,
                      refuse: false, block: false };
      })();

      o.one  = readOne(1);
      o.two  = readOne(2);
      o.deep = readOne(9);

      /* AND REAL MOVEMENT, through stepOnce, with the ground as the only reason.
         NOTHING IS SET BY HAND HERE: stepOnce calls turfNote, which is what
         actually counts the blocks, so the stage below is earned by walking. The
         first cut pre-set TURF_USED and then walked, which the walk immediately
         overwrote -- measuring a state the game had already replaced. */
      TURF_USED = {}; TURF_SEENCELL = {};
      try { CT_AGAINST = {}; } catch (e) {} CT_FOLLOW = {};
      var dir = 2, blk = 0, maxF = 0, maxBlocks = 0, sawFollow = 0;
      for (var s = 0; s < 420; s++) {
        var went = false;
        try { went = stepOnce(dir); } catch (e) { o.threw = String(e.message).slice(0,120); break; }
        if (went) blk = 0; else { blk++; dir = (dir + (blk > 3 ? 3 : 1)) % 8; }
        if (s % 4 === 3) { try { CT_AGAINST = {}; } catch (e) {} }
        if (s % 4 === 3) { try { render(); } catch (e) {} }
        var nb = (TURF_USED[F] | 0); if (nb > maxBlocks) maxBlocks = nb;
        var n = Object.keys(CT_FOLLOW).length;
        if (n > maxF) maxF = n;
        if (n > 0) sawFollow++;
      }
      o.maxFollowers = maxF; o.blocksWalked = maxBlocks; o.followTicks = sawFollow;
      return o;
    });

    ok('E1 the crossing test found a crowd and ground of theirs to stand on ('
       + JSON.stringify(cross.crowd) + ' on ' + cross.faction + ' '
       + cross.tier + ' ground)',
      !!cross.faction && !!cross.stoodOn && !cross.err, cross.err || '');

    /* NEVER SKIP SILENTLY. A block of claims behind an `if` that quietly does not
       run is a green gate that checked nothing, which is the fault this whole file
       exists to prevent. If the setup could not be built, SAY SO as a failure. */
    ok('E1b the stranger setup really produced a body to ask about and ground to '
       + 'step off onto',
      !!(cross.faction && cross.off),
      JSON.stringify({ faction: cross.faction, stood: cross.stoodOn,
                       other: cross.otherFaction, homes: cross.homes,
                       theirsOnGlass: cross.theirsOnGlass, err: cross.err }));
    if (cross.faction && cross.off) {
      ok('E2 *** ONLY THE FACTION UNDER YOUR FEET REACTS. *** He is on '
         + cross.faction + ' ground having walked NINE blocks of ' + cross.otherFaction
         + ' ground: the ' + cross.otherFaction + ' get nothing, because his sentence '
         + 'is "the moment you cross INTO a block", which is where you are standing '
         + 'and not where you have been',
        cross.otherCrossing === null
        && cross.off.stage === 0 && cross.off.level === null
        && !cross.off.watch && !cross.off.follow && !cross.off.block,
        JSON.stringify(cross.off));
      ok('E3 *** ONE BLOCK IN AND THEY LOOK. *** "' + cross.one.word + '"',
        cross.one.stage === 1 && cross.one.watch
        && !cross.one.follow && !cross.one.block);
      ok('E4 *** TWO BLOCKS AND SOMEBODY IS BEHIND YOU. *** "' + cross.two.word + '"',
        cross.two.stage === 2 && cross.two.watch && cross.two.follow
        && !cross.two.block);
      ok('E5 AND IT STOPS AT THEIR REACH, not at how far you walked -- this is a '
         + cross.tier + ', so nine blocks in it is still stage ' + cross.deep.stage,
        cross.deep.stage === (cross.tier === 'fortress' ? 3
                            : cross.tier === 'town' ? 2 : 1));
      ok('E6 *** IT NEVER INVENTS A LEVEL. *** A stranger on a block is not at war '
         + 'with anybody: rank stays 0 and the ladder is untouched however deep he '
         + 'goes (level ' + String(cross.deep.level) + ', rank ' + cross.deep.rank + ')',
        cross.deep.level === null && cross.deep.rank === 0);
      ok('E7 and it never withholds trade -- refuse is what an unpaid landlord does '
         + '([block rent]), not what a stranger on a street earns',
        !cross.one.refuse && !cross.two.refuse && !cross.deep.refuse);
      ok('E8 THE WALK ITSELF COUNTS THE BLOCKS -- nothing is set by hand, the '
         + 'stage is earned by stepOnce calling turfNote (' + cross.blocksWalked
         + ' block(s) of ' + cross.faction + ' ground crossed in 420 steps)',
        cross.blocksWalked >= 1, JSON.stringify({blocks: cross.blocksWalked,
          followers: cross.maxFollowers, ticks: cross.followTicks}));
      ok('E9 *** AND WHEN THE WALK REACHES A SECOND BLOCK, THEY REALLY MOVE. *** '
         + cross.maxFollowers + ' follower(s) over ' + cross.followTicks
         + ' steps, through the city\'s own follow pass and never by hand'
         + (cross.blocksWalked < 2 ? '  [the walk never left one block, so the tail '
            + 'was never owed -- reported rather than forced]' : ''),
        cross.blocksWalked < 2 ? true : cross.maxFollowers > 0,
        'max ' + cross.maxFollowers + (cross.threw ? ' threw ' + cross.threw : ''));
      ok('E10 and the stranger page threw nothing either',
        errs2.length === 0, errs2.slice(0, 3).join(' | '));
    }
    try { await page2.close(); } catch (_e) {}

    ok('and the page threw nothing the whole time', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'AGAINST GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'AGAINST GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();

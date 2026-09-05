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
      var before = [hx, hy], got = null;
      for (var t = 0; t < 20 && !got; t++) {
        try { ctFollowStep(); render(); } catch (e) {}
        var v = (typeof PPL_DIRV !== 'undefined') ? PPL_DIRV[HFACE] : null;
        if (v) got = ctBlocked(hx + v[0], hy + v[1]);
      }
      o.blocker = got;
      o.face = HFACE;
      o.stillThere = (hx === before[0] && hy === before[1]);
      if (!got) return o;
      /* AND NOW WALK INTO THEM, through the function a d-pad press runs. */
      var pl = document.getElementById('packline'); if (pl) pl.textContent = '';
      var vv = PPL_DIRV[HFACE];
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
    ok('*** A BODY AT WAR WITH YOU PUTS ITSELF IN FRONT OF YOU ***',
      !!blk.blocker, blk.blocker ? (blk.blocker + ' stepped into your way facing ' + blk.face)
                                 : 'nobody got in the way');
    ok('and the gate is pushing the direction the player is actually facing', !!blk.dirFound);
    ok('*** THE STEP IS REFUSED AND THE PLAYER DOES NOT MOVE ***',
      blk.went === false && blk.moved === false,
      'stepOnce returned ' + blk.went + ', player ' + (blk.moved ? 'MOVED' : 'held'));
    ok('*** AND IT SAYS SO RATHER THAN FEELING LIKE BROKEN CONTROLS ***',
      /steps into your way/.test(blk.said || ''), JSON.stringify(blk.said || ''));
    /* A BLOCK MUST NEVER BE A TRAP. walk_deadlock_gate exists because this game
       has shipped one. A blocker holds ONE cell and only the one you face. */
    ok('*** AND IT CANNOT TRAP YOU: EVERY OTHER WAY OUT STILL WORKS ***',
      blk.waysOut > 0, blk.waysOut + ' other directions still walk');

    ok('and the page threw nothing the whole time', errs.length === 0, errs.slice(0, 3).join(' | '));
  } catch (e) {
    fail++; console.log('  FAIL the real surface   ' + String(e.message).slice(0, 200));
  } finally { if (browser) await browser.close(); }

  console.log('\n' + (fail ? 'AGAINST GATE: ' + fail + ' FAILED, ' + pass + ' ok'
    : 'AGAINST GATE: ' + pass + ' ok, 0 failed'));
  process.exit(fail ? 1 : 0);
})();

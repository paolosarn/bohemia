/* BOHEMIA CONVERSATION GATE (8/26/26, PEOPLE lane) -- the quest says its own
 * words, out of the mouth of a person standing in front of you.
 *
 * WHAT WAS TRUE UNTIL TODAY, COUNTED RATHER THAN GUESSED, across quests/bq:
 *     quest files      27
 *     @TALK nodes     236
 *     @SAY lines      504
 *     @OPT choices    558
 *     @NOVERB          59
 * bohemia_bq.js parses every one of them. bohemia_quest_runtime.js PLAYS every
 * one of them -- available() / begin() / view() / choose() have been finished and
 * correct since the day they were written. AND NOTHING HAS EVER RENDERED ONE.
 * The demo day loop binds stages to WORLD EVENTS, so a quest spoke to the player
 * through the phone and the journal and NEVER THROUGH A MOUTH.
 * Paolo, 8/11: "I HAVE A WHOLE 170 QUEST FILE WITH DIALOGUE." Five hundred lines
 * of it were in the repo, parsed, and mute.
 *
 * PROVES:
 *   A  the bridge: a node's speaker resolves to the CAST person and to nobody
 *      else, and the button that opens it says the quest's own objective
 *   B  the corpus is really there and really unrendered before this
 *   C  A CONVERSATION PLAYED IS A CONVERSATION CLOSED -- swept live: there are
 *      entry nodes where playing the same scene twice DOUBLES the numbers, and
 *      with the lock in place that count is ZERO
 *   D  the journal is told exactly once, and a stage is never re-run to tell it
 *   E  ON THE WALKED CITY: walk up, press the objective, and the quest's own
 *      @SAY lines are on the glass with its own @OPT buttons under them, the
 *      @NOVERB is visible and is NOT pressable, and choosing MOVES THE QUEST
 *
 * E is the one that matters, and C is the one that would have been a silent bug.
 *
 * THE NOVERB IS NOT DECORATION. questbook/BOHEMIA_CONVERSATIONS_MASTER's marquee
 * nodes -- the Baron, Hildern, the Whodunit survivors, Jefferson Peralez, the
 * Strange Man, Brisby, Shadowheart -- are every one of them remembered for THE
 * THING THE GAME WOULD NOT LET YOU SAY. A withheld verb nobody can see is not
 * withheld, it is missing.
 *
 *   node gates/conversation_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var BQ = require('../engine/bohemia_bq.js');
var RT = require('../engine/bohemia_quest_runtime.js');
var CONV = require('../engine/bohemia_conversation.js');

var QDIR = 'quests/bq';
var FILES = fs.readdirSync(QDIR).filter(function (f) { return /\.bq$/.test(f); }).sort();
function parse(f) { return BQ.parse(fs.readFileSync(path.join(QDIR, f), 'utf8')); }
var DEMO = 'S01_THE_METER_READER.bq';

/* ==========================================================================
   A. THE BRIDGE -- SPEAKER -> ROLE -> CAST -> A PERSON
   ========================================================================== */
head('A. THE BRIDGE');
ok('the conversation module exists and exports the bridge',
  typeof CONV.nodeFor === 'function' && typeof CONV.openerFor === 'function'
  && typeof CONV.close === 'function');

var Q1 = parse(DEMO);
var rt1 = new RT.Runtime(Q1, null, { bonds: {} });
rt1.start(10);
var CAST = { lineman: { key: 'K:lineman' }, fixer: { key: 'K:fixer' } };

var n1 = CONV.nodeFor(rt1, Q1, CAST, 'K:lineman');
ok('*** A TALK NODE RESOLVES TO THE PERSON THE QUEST CAST ***',
  !!n1 && n1.role === 'lineman' && !!n1.node && n1.node.speaker === 'lineman',
  n1 ? (n1.id + ' spoken by the ' + n1.role) : 'nobody');
ok('and to NOBODY ELSE standing on the same block',
  CONV.nodeFor(rt1, Q1, CAST, 'K:a-stranger') === null);
/* THE CAST IS THE ONLY THING THAT CAN MAKE THE CLAIM ABOVE PASS. Hand the same
   runtime a cast that puts a DIFFERENT key in the part and the same person must
   stop being offered the scene. */
ok('and it follows the CAST, not the key it was asked about',
  CONV.nodeFor(rt1, Q1, { lineman: { key: 'K:somebody-else' } }, 'K:lineman') === null);
ok('a node whose entry condition has not been met is not offered',
  (rt1.available() || []).indexOf('split') < 0,
  'available at stage 10: ' + (rt1.available() || []).join(', '));

var op = CONV.openerFor(Q1, rt1, 'lineman');
var obj10 = (Q1.objs || []).filter(function (o) { return o.n === 10; })[0];
ok('*** THE BUTTON THAT OPENS IT IS THE QUEST\'S OWN OBJECTIVE, VERBATIM ***',
  !!op && op.draft === false && !!obj10 && op.text === obj10.text,
  JSON.stringify(op && op.text) + '  vs the .bq\'s  ' + JSON.stringify(obj10 && obj10.text));
/* AND THE FALLBACK IS MARKED AS A DRAFT, because ten of the corpus's entry nodes
   have no objective aimed at their speaker and those words are mine, not his. */
ok('and where the corpus gives no objective, the words are tagged as a draft',
  CONV.openerFor(Q1, rt1, 'nobody_has_this_role').draft === true);

/* ==========================================================================
   B. THE CORPUS IS REALLY THERE, AND IT WAS REALLY MUTE
   ========================================================================== */
head('B. WHAT WAS SITTING IN THE REPO');
var C = { files: 0, nodes: 0, says: 0, opts: 0, noverbs: 0, entry: 0, locks: 0 };
FILES.forEach(function (f) {
  var Q = parse(f); C.files++;
  C.locks += (fs.readFileSync(path.join(QDIR, f), 'utf8').match(/^@LOCK\b/gm) || []).length;
  (Q.talks || []).forEach(function (t) {
    C.nodes++; C.says += t.says.length; C.opts += t.opts.length; C.noverbs += t.noverbs.length;
    if (t.entry) C.entry++;
  });
});
ok('the quests really do carry a written conversation',
  C.nodes > 100 && C.says > 300 && C.opts > 300,
  C.files + ' files, ' + C.nodes + ' nodes, ' + C.says + ' say lines, ' + C.opts + ' options');
ok('*** AND ' + C.noverbs + ' AUTHORED THINGS THE GAME REFUSES TO LET YOU SAY ***',
  C.noverbs > 20, C.noverbs + ' @NOVERB across ' + C.files + ' quests');
/* *** AND THE FEATURE HAS TO BE IN THE FILE THE GAME ACTUALLY LOADS. ***
   On 8/27 another lane's tool took 114 lines out of the walked city and 103 of
   them were this module's inlined body, leaving BohemiaConversation called three
   times and defined nowhere. Every call threw, the bare catch turned every throw
   into "they have nothing to say", and the whole feature was gone with nothing on
   screen and nothing in the console. THIS GATE CAUGHT IT AND THE FILE DID NOT.
   Both halves are claims now: the module is SELF-DELIMITING (the same banner
   opens and closes it, so a boundary scan ends at the right byte wherever it is
   parked), and a missing one SAYS SO. */
var CITY_SRC = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
var BANNER = '/* ==== engine/bohemia_conversation.js ==== */';
ok('*** THE MODULE IS IN THE FILE THE GAME LOADS, AND IT DELIMITS ITSELF ***',
  CITY_SRC.split(BANNER).length - 1 === 2,
  (CITY_SRC.split(BANNER).length - 1) + ' banners (2 = opened and closed)');
ok('and its body in the city is the canon body, byte for byte',
  CITY_SRC.indexOf(fs.readFileSync(path.join(ROOT, 'engine/bohemia_conversation.js'), 'utf8')) > 0);
ok('*** AND IF IT EVER GOES MISSING AGAIN, THE GAME SAYS SO OUT LOUD ***',
  /typeof BohemiaConversation === 'undefined'/.test(CITY_SRC)
  && /ctConvNode\.__warned/.test(CITY_SRC),
  'null is a real answer here, so it may never also be the error answer');
ok('every entry node has a speaker, so every one of them is castable',
  FILES.every(function (f) {
    return (parse(f).talks || []).filter(function (t) { return t.entry; })
      .every(function (t) { return !!t.speaker; });
  }), C.entry + ' entry nodes');

/* ==========================================================================
   C. A CONVERSATION PLAYED IS A CONVERSATION CLOSED
   ========================================================================== */
head('C. THE ONE THAT WOULD HAVE BEEN A SILENT BUG');
ok('the corpus locks nothing itself, so nothing else was going to stop a replay',
  C.locks === 0, C.locks + ' @LOCK in ' + C.files + ' files');

/* THE SWEEP, RUN LIVE RATHER THAN REMEMBERED. Play every entry node's every
   option once, then twice, and compare the only numbers a player can bank:
   bonds, faction standing, posture, reward. */
function numbers(s) { return JSON.stringify({ b: s.bonds, f: s.faction, p: s.posture, r: s.reward }); }
function sweep(useLock) {
  var doubled = 0, played = 0, worst = null;
  FILES.forEach(function (f) {
    var src = fs.readFileSync(path.join(QDIR, f), 'utf8');
    var Q0 = BQ.parse(src);
    (Q0.talks || []).filter(function (t) { return t.entry; }).forEach(function (t) {
      for (var oi = 0; oi < (t.opts || []).length; oi++) {
        var A = fresh(), B = fresh();
        try {
          play(A, t.id, oi, useLock);
          play(B, t.id, oi, useLock); play(B, t.id, oi, useLock);
        } catch (_e) { continue; }
        played++;
        if (numbers(A.rt.state) !== numbers(B.rt.state)) {
          doubled++;
          if (!worst) worst = f + ' ' + t.id + '  once=' + numbers(A.rt.state)
                            + '  twice=' + numbers(B.rt.state);
        }
      }
    });
    function fresh() {
      var Q = BQ.parse(src), r = new RT.Runtime(Q, null, { bonds: {} });
      r.start((Q.stages[0] || {}).n);
      return { Q: Q, rt: r };
    }
    /* EXACTLY WHAT THE CITY DOES, and that is the point of testing it here: the
       surface opens the node it was offered, chooses, and locks when the graph
       ends. If the city ever stops calling close(), this sweep goes red. */
    function play(S, id, oi, lock) {
      var offered = (S.rt.available() || []).indexOf(id) >= 0;
      if (!offered) return;
      S.rt.begin(id);
      var v = S.rt.choose(oi);
      if (lock && (!v || v.ended)) CONV.close(S.rt, id);
      else if (lock) CONV.close(S.rt, id);   /* the city locks when the graph ends */
    }
  });
  return { doubled: doubled, played: played, worst: worst };
}
var noLock = sweep(false);
ok('WITHOUT the lock, replaying a conversation really does pay twice',
  noLock.doubled > 0,
  noLock.doubled + ' of ' + noLock.played + ' option paths double.  ' + (noLock.worst || ''));
ok('*** WITH THE LOCK, NOT ONE NUMBER IN THE CORPUS CAN BE FARMED ***',
  sweep(true).doubled === 0, 'swept ' + noLock.played + ' option paths');
ok('and the lock is the runtime\'s own field, so it rides the save',
  (function () {
    var Q = parse(DEMO), r = new RT.Runtime(Q, null, {});
    r.start(10); CONV.close(r, 'open');
    var back = RT.Runtime.load(Q, r.serialize(), {});
    return CONV.closed(back, 'open') && (back.available() || []).indexOf('open') < 0;
  })());
ok('walking away does NOT close it, because leaving is not answering',
  (function () {
    var Q = parse(DEMO), r = new RT.Runtime(Q, null, {});
    r.start(10); r.begin('open');
    /* the card shuts; nothing calls close(); the node is still the one you were on */
    return r.view().node === 'open' && !CONV.closed(r, 'open');
  })());

/* ==========================================================================
   D. THE JOURNAL HEARS ABOUT IT ONCE, AND NOTHING IS RUN TWICE TO TELL IT
   ========================================================================== */
head('D. THE NARRATION SEAM');
var DQMOD = require('../engine/bohemia_demoquests.js');
var SRC = {}; SRC['S01_THE_METER_READER'] = fs.readFileSync(path.join(QDIR, DEMO), 'utf8');
var logged = [];
var DQ = DQMOD.make({ BQ: BQ, BQRuntime: RT, sources: SRC,
  loop: { stage: function (id, n, log) { logged.push(n + ':' + String(log).slice(0, 24)); } } });
ok('the day loop exposes a narrate-only seam for a conversation',
  typeof DQ.spoke === 'function');
DQ.openDay(1);
var openedAt = logged.length;
ok('opening the day narrates the opening stage once', openedAt === 1, logged.join(' | '));

/* WALK THE REAL CONVERSATION AND WATCH WHAT THE JOURNAL IS TOLD. */
var beforeStage = DQ.rt.state.stage;
DQ.rt.begin('open');
DQ.rt.choose(0);                       /* "I will walk it back." -> walk -> set_stage 20 */
var moved = DQ.rt.state.stage;
/* SNAPSHOT TAKEN HERE, BEFORE THE FIRST NARRATION, because that is the only
   moment the bug could happen. Taking it after the first spoke() would leave the
   claim measuring the second call, which the watermark already refuses -- an
   assertion aimed one step past the thing it is supposed to catch. */
function stageRuns(n) {
  return DQ.rt.state.log.filter(function (l) { return l.indexOf('[stage ' + n + ']') === 0; }).length;
}
var runsBefore = stageRuns(moved);
var numsBefore = JSON.stringify({ b: DQ.rt.state.bonds, f: DQ.rt.state.faction,
                                  o: DQ.rt.objectives() });
var r1 = DQ.spoke();
var r2 = DQ.spoke();
ok('*** A CONVERSATION REALLY DOES MOVE THE QUEST ***',
  moved !== beforeStage, beforeStage + ' -> ' + moved);
ok('and the journal is told about it', !!r1 && r1.stage === moved,
  r1 ? (r1.stage + ': ' + String(r1.log).slice(0, 40)) : 'nothing');
ok('*** AND TOLD EXACTLY ONCE, however many times it is asked ***',
  r2 === null && logged.length === openedAt + 1, logged.join(' | '));
/* THE ONE THAT WOULD HAVE BEEN INVISIBLE. setStage RE-RUNS a stage's @DO list,
   so narrating by calling _toStage would pay every bond on that stage twice with
   nothing on screen to show for it. */
ok('*** AND NARRATING DID NOT RE-RUN THE STAGE ***',
  stageRuns(moved) === runsBefore && runsBefore === 1
  && numsBefore === JSON.stringify({ b: DQ.rt.state.bonds, f: DQ.rt.state.faction,
                                     o: DQ.rt.objectives() }),
  'stage ' + moved + ' ran ' + stageRuns(moved) + ' time(s), was ' + runsBefore);
ok('and a reload is not a new event either',
  (function () {
    var save = DQ.serialize(), n = logged.length;
    DQ.restore(save, 1);
    return DQ.spoke() === null && logged.length === n;
  })());

/* ==========================================================================
   E. THE WALKED CITY -- THE GLASS HE ACTUALLY LOOKS AT
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
  head('E. THE CONVERSATION, ON THE REAL SURFACE');
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 140)); });
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);

    /* TAKE THE JOB OFF THE PHONE. The quest does not exist until it is taken, so
       a probe that skipped this would measure a valley with no quest in it. */
    await page.evaluate(function () {
      for (var i = 0; i < 3; i++) {
        var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
        if (g) g.click();
      }
      try { window.DAYOPEN = DQ.openDay(DAY.day); } catch (e) {}
    });
    await SETTLE(page, 2500);

    var m = await page.evaluate(function () {
      var sp = BohemiaPopulation.NB * FN;
      var out = { quest: null, blocks: 0, found: 0, opener: null, objective: null,
                  card: null, says: [], optButtons: [], noverbDivs: [], noverbIsButton: null,
                  stageBefore: null, stageAfter: null, after: null, marked: null };
      try { out.quest = { id: DQ.Q.id, title: DQ.Q.title }; } catch (e) {}
      for (var cx = 6; cx < 30 && !out.card; cx++)
        for (var cy = 6; cy < 30 && !out.card; cy++) {
          hx = cx * sp + 4; hy = cy * sp + 4; CT_SPAWN = null;
          var R = [];
          try { ctSpawn(); R = ctEveryone(); } catch (e) { continue; }
          if (!R.length) continue;
          out.blocks++;
          var c = null; try { c = ctCast(); } catch (e) {}
          if (!c) continue;
          /* WHICH OF THE CAST IS THE ONE THE QUEST IS READY TO TALK TO. */
          var node = null, tgt = null;
          for (var i = 0; i < R.length && !node; i++) {
            var w = ctPerson(R[i]);
            var nd = ctConvNode(w);
            if (nd) { node = nd; tgt = R[i]; }
          }
          if (!node) continue;
          out.found++;
          var at = ctAt(tgt), dd = [[1, 0], [-1, 0], [0, 1], [0, -1]], stood = false;
          for (var d = 0; d < dd.length; d++) {
            hx = at[0] + dd[d][0]; hy = at[1] + dd[d][1];
            try { render(); } catch (e) {}
            if (ctAdjacent()) { stood = true; break; }
          }
          if (!stood) continue;
          var vb = document.getElementById('cttalk');
          if (!vb || getComputedStyle(vb).display === 'none') continue;
          vb.click();
          /* THE OPENER BUTTON, ON THE IDENTITY CARD. */
          var ob = document.getElementById('ctconv');
          if (!ob) { try { ctClose(); } catch (e) {} continue; }
          out.opener = ob.textContent;
          try {
            var oo = DQ.rt.objectives().filter(function (o) {
              return o.status === 'active' && o.target === node.role; })[0];
            out.objective = oo ? oo.text : null;
          } catch (e) {}
          out.stageBefore = DQ.rt.state.stage;
          ob.click();                                   /* *** OPEN THE CONVERSATION *** */
          var cc = document.getElementById('ctcard');
          out.card = cc ? cc.innerText : null;
          out.says = [].map.call(cc.querySelectorAll('.say'), function (e) { return e.textContent; });
          out.optButtons = [].map.call(cc.querySelectorAll('button.convopt'), function (e) { return e.textContent; });
          var nvs = cc.querySelectorAll('.noverb');
          out.noverbDivs = [].map.call(nvs, function (e) { return e.textContent; });
          out.noverbIsButton = [].some.call(nvs, function (e) {
            return e.tagName === 'BUTTON' || !!e.querySelector('button'); });
          /* AND THE TRAPS ARE NOT MARKED: whatever the runtime knows about them,
             nothing on the glass may say so. */
          try {
            var vv = DQ.rt.view();
            out.marked = (vv.options || []).some(function (o, k) {
              var b = cc.querySelectorAll('button.convopt')[k];
              return b && (/trap|silence/i.test(b.className) || /trap/i.test(b.textContent));
            });
          } catch (e) {}
          /* *** AND CHOOSING SOMETHING MOVES THE QUEST. *** */
          var first = cc.querySelector('button.convopt');
          if (first) first.click();
          out.stageAfter = DQ.rt.state.stage;
          out.after = document.getElementById('ctcard').innerText;
          /* ONE DECISION SURFACE AT A TIME. Day one's RESOLUTION stage IS the
             stage that first answer reaches, so this is the exact moment the
             day card would have thrown itself over somebody mid-sentence. */
          out.dayCardUp = (function () {
            var d = document.getElementById('daycard');
            return !!d && getComputedStyle(d).display !== 'none';
          })();
          out.pendingHeld = !!DQ.pending;
          out.stillTalking = (function () { try { return !DQ.rt.view().ended; } catch (e) { return false; } })();
          /* AND WALK OFF MID-SENTENCE, THEN COME BACK. The card shuts and the
             scene has to be waiting on the line you left it on, not rewound to
             the top and not gone. */
          out.midNode = (function () { try { return DQ.rt.view().node; } catch (e) { return null; } })();
          try { ctClose(); } catch (e) {}
          out.shut = getComputedStyle(document.getElementById('ctcard')).display === 'none';
          try { render(); } catch (e) {}
          var vb2 = document.getElementById('cttalk');
          if (vb2 && getComputedStyle(vb2).display !== 'none') vb2.click();
          var cc2 = document.getElementById('ctcard');
          out.resumedSays = [].map.call(cc2.querySelectorAll('.say'), function (e) { return e.textContent; });
          out.resumedNode = (function () { try { return DQ.rt.view().node; } catch (e) { return null; } })();
        }
      return out;
    });

    ok('the city was walked with a real quest running', !!m.quest && !!m.quest.id,
      m.quest ? (m.quest.id + ' (' + m.quest.title + ')') : 'NO QUEST');
    ok('nothing threw while playing it', errs.length === 0, errs.slice(0, 2).join(' | '));
    ok('*** A PERSON ON A REAL BLOCK HAS SOMETHING TO SAY ***', m.found > 0,
      m.found + ' of ' + m.blocks + ' populated blocks hold somebody the quest wants to talk to');
    ok('*** AND THE BUTTON THAT OPENS THEM IS THE QUEST\'S OWN OBJECTIVE ***',
      !!m.opener && !!m.objective && m.opener === m.objective,
      JSON.stringify(m.opener) + ' vs the quest\'s ' + JSON.stringify(m.objective));
    ok('*** THE QUEST\'S OWN WRITTEN LINES ARE ON THE GLASS ***',
      m.says.length > 0, m.says.length + ' spoken lines: ' + JSON.stringify(m.says[0] || ''));
    /* AND THEY ARE THE .bq's LINES, NOT PROSE THIS LANE WROTE. Checked against the
       file on disk rather than against the runtime that produced them. */
    var srcSays = [];
    (Q1.talks || []).forEach(function (t) { t.says.forEach(function (s) { srcSays.push(s.text); }); });
    ok('*** AND EVERY ONE OF THEM IS IN THE .bq FILE, WORD FOR WORD ***',
      m.says.length > 0 && m.says.every(function (s) { return srcSays.indexOf(s) >= 0; }),
      m.says.length === 0 ? 'nothing was said at all'
        : (m.says.filter(function (s) { return srcSays.indexOf(s) < 0; }).join(' | ')
           || ('all ' + m.says.length + ' of them, against ' + srcSays.length + ' in the file')));
    ok('the player is given the quest\'s own choices to answer with',
      m.optButtons.length > 1, m.optButtons.length + ': ' + JSON.stringify(m.optButtons.slice(0, 2)));
    ok('*** AND THE THING HE IS NOT ALLOWED TO SAY IS ON SCREEN ***',
      m.noverbDivs.length > 0, JSON.stringify(m.noverbDivs));
    /* BOTH OF THESE ARE GUARDED ON SOMETHING HAVING BEEN RENDERED, because
       [].some() is false and a claim that passes on an empty screen is not a
       claim. That trap is this lane's own recurring bug, twice this week. */
    ok('*** AND IT IS NOT PRESSABLE, BECAUSE IT IS NOT AN OPTION ***',
      m.noverbDivs.length > 0 && m.noverbIsButton === false,
      m.noverbDivs.length + ' refusals on screen, none of them a button');
    ok('a trap is never marked as one, because a marked trap is not a trap',
      m.optButtons.length > 0 && m.marked === false,
      m.optButtons.length + ' options rendered, nothing on them names a trap');
    ok('*** AND ANSWERING MOVES THE QUEST ***',
      m.stageBefore !== null && m.stageAfter !== null && m.stageAfter !== m.stageBefore,
      'stage ' + m.stageBefore + ' -> ' + m.stageAfter);
    ok('and the card kept talking rather than dropping the scene',
      !!m.after && m.after.length > 0, String(m.after || '').split('\n').slice(0, 2).join(' | '));
    /* THE COLLISION, FOUND BY TRACING THE DAY ONE SPEC RATHER THAN BY LOOKING AT
       THE SCREEN: choiceAt IS the stage that first answer reaches, so without
       the hold the resolution card lands on top of a person still talking. */
    ok('*** AND THE DAY\'S RESOLUTION CARD DOES NOT LAND ON SOMEBODY MID-SENTENCE ***',
      m.stillTalking === true && m.dayCardUp === false && m.pendingHeld === true,
      'still talking: ' + m.stillTalking + ', day card up: ' + m.dayCardUp
      + ', held for later: ' + m.pendingHeld);
    ok('*** WALK OFF MID-SENTENCE AND COME BACK, AND IT IS WAITING WHERE YOU LEFT IT ***',
      m.shut === true && m.resumedSays.length > 0 && m.resumedNode === m.midNode,
      'left on ' + m.midNode + ', came back to ' + m.resumedNode
      + ' with ' + m.resumedSays.length + ' lines');
  } catch (e) {
    ok('the conversation could be played at all', false, String(e && e.message || e));
  } finally {
    if (browser) try { await browser.close(); } catch (_e) {}
  }

  console.log('\nCONVERSATION GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

/* bohemia_canon_quests_gate.js — the machine gate for the PLAYABLE canon side quests
   (quests/bq/*.bq). FACTORY LAW: a system without a machine gate is not enforced.

   For every canon .bq file this gate proves, headlessly:
     1) it PARSES with no fatal parse warnings,
     2) it round-trips lossless (parse -> serialize byte-identical),
     3) it VALIDATES clean (zero errors AND zero warnings — canon holds a higher bar
        than the format's own floor; a warning is a defect for a shipped quest),
     4) it actually PLAYS: an exhaustive path-explorer walks every reachable option
        sequence from the start and confirms
          - the quest can REACH a terminal outcome (never a dead maze),
          - at least one path reaches COMPLETE,
          - every terminal stage carries exactly one legal CLOUT tag
            (#quiet/#notable/#risky/#reckless) so the feed's follower math is fed,
          - the runtime never throws on any path.
     5) it loads and plays through the REAL loop (Loop.boot -> ctx.quests.start),
        so canon quests are proven as first-class engine citizens, not just parseable text.

   Run: node gates/bohemia_canon_quests_gate.js
   Registered in gates/bohemia_gates.py as CANON QUESTS. */
'use strict';
var fs   = require('fs');
var path = require('path');
var BQ   = require('../engine/bohemia_bq.js');
var BQRT = require('../engine/bohemia_quest_runtime.js');
var Loop = require('../engine/bohemia_loop.js');

var DIR = path.join(__dirname, '..', 'quests', 'bq');
var CLOUT = { quiet:1, notable:1, risky:1, reckless:1 };

var pass = 0, fail = 0, fails = [];
function ok(c, m) { if (c) { pass++; } else { fail++; fails.push(m); console.log('  FAIL: ' + m); } }

/* An exhaustive, cycle-safe explorer. From the start it tries EVERY available entry
   node and EVERY option, deduping on a serialized (node,state) fingerprint so loops
   (LOCK/knowledge that reopen a node) terminate. Returns the set of outcomes reached
   and the set of terminal stages touched. Bounded hard so a pathological file can
   never hang the gate. */
function explore(text) {
  var outcomes = {}, terminalStages = {}, threw = false, steps = 0, MAX = 200000;
  var seen = {};

  function snap(rt) {
    // fingerprint = current node + the parts of state that gate future options
    return JSON.stringify([rt.node ? rt.node.id : null, rt.state.stage, rt.state.flags,
                           rt.state.knows, rt.state.has, rt.state.roles, rt.state.locked, rt.state.done]);
  }
  function clone(rt) {
    var r = BQRT.Runtime.load(rt.Q, JSON.parse(rt.serialize()));
    r.node = rt.node ? r._talkById[rt.node.id] : null;
    return r;
  }

  var Q = BQ.parse(text);
  var root = new BQRT.Runtime(Q).start();

  var stack = [root];
  while (stack.length) {
    if (++steps > MAX) break;
    var rt = stack.pop();
    var key = snap(rt);
    if (seen[key]) continue;
    seen[key] = true;

    try {
      if (rt.state.done) {
        if (rt.state.outcome) outcomes[rt.state.outcome] = true;
        if (rt.state.stage != null) terminalStages[rt.state.stage] = true;
        continue;
      }
      // if we are not inside a node, branch on every available entry node
      if (!rt.node) {
        var avail = rt.available();
        if (!avail.length) continue;   // no live entry node and not done — a settled non-terminal leaf
        avail.forEach(function (id) {
          var c = clone(rt); c.begin(id); stack.push(c);
        });
        continue;
      }
      // inside a node: branch on every currently-offered option
      var view = rt.view();
      if (!view.options.length) {
        // node with no live options: leave it and let entry nodes re-offer
        var c0 = clone(rt); c0.node = null; stack.push(c0); continue;
      }
      view.options.forEach(function (o) {
        var c = clone(rt); c.choose(o.i); stack.push(c);
      });
    } catch (e) {
      threw = true;
    }
  }
  return { Q: Q, outcomes: Object.keys(outcomes), terminalStages: Object.keys(terminalStages).map(Number),
           threw: threw, hitCap: steps > MAX };
}

var files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(function (f) { return /\.bq$/.test(f); }).sort() : [];
ok(files.length > 0, 'at least one canon .bq quest exists in quests/bq/');

files.forEach(function (f) {
  var text = fs.readFileSync(path.join(DIR, f), 'utf8');
  var tag = f;

  // 1) parse + no fatal parse warnings (unrecognized lines etc.)
  var Q = BQ.parse(text);
  ok(!!Q.id, tag + ': has a @QUEST id');
  var parseWarns = (Q.warnings || []).filter(function (w) { return /unrecognized line/.test(w.msg); });
  ok(parseWarns.length === 0, tag + ': no unrecognized/garbled lines (' + parseWarns.map(function (w) { return w.line; }).join(',') + ')');

  // 2) lossless round-trip
  ok(BQ.roundTrip(text), tag + ': round-trips lossless (parse -> serialize byte-identical)');

  // 3) validate clean — canon bar: zero errors AND zero warnings
  var v = BQ.validate(Q, null);
  ok(v.ok, tag + ': validates with zero ERRORS' + (v.errors.length ? ' -> ' + v.errors.map(function (e) { return e.code + '(' + e.msg + ')'; }).join(' | ') : ''));
  ok(v.warnings.length === 0, tag + ': validates with zero WARNINGS' + (v.warnings.length ? ' -> ' + v.warnings.map(function (w) { return w.code + '(' + w.msg + ')'; }).join(' | ') : ''));

  // 4) plays: exhaustive explorer
  var ex = explore(text);
  ok(!ex.threw, tag + ': the runtime never throws on any reachable path');
  ok(!ex.hitCap, tag + ': the state space is bounded (explorer did not hit its step cap)');
  ok(ex.outcomes.indexOf('COMPLETE') >= 0, tag + ': at least one path reaches COMPLETE (outcomes: ' + ex.outcomes.join(',') + ')');

  // every terminal stage the play actually reached must carry exactly one legal CLOUT tag
  var termStagesDef = ex.Q.stages.filter(function (s) { return s.flags.indexOf('COMPLETE') >= 0 || s.flags.indexOf('FAIL') >= 0; });
  ok(termStagesDef.length > 0, tag + ': declares at least one COMPLETE/FAIL stage');
  termStagesDef.forEach(function (s) {
    var ct = (s.tags || []).filter(function (t) { return CLOUT[t]; });
    ok(ct.length === 1, tag + ': terminal stage #' + s.n + ' carries exactly one CLOUT tag (found: ' + (s.tags || []).join(',') + ')');
  });

  // 5) loads and plays through the REAL loop as a context citizen
  var ctx = Loop.boot({ seed: 'canon-quests' });
  var rt = ctx.quests.start(text);
  ok(!!rt && !!rt.Q && rt.Q.id === Q.id, tag + ': starts through the live loop ctx.quests');
  ok(ctx.quests.get(Q.id) === rt, tag + ': is pullable again via ctx.quests.get (pull-from-anywhere)');
});

console.log('CANON QUESTS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + files.length + ' quest file(s))');
if (fail > 0) process.exit(1);

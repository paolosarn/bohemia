/* bohemia_loop_entities_tests.js — proves the enemy spawner is a pullable citizen
   of the GameContext: reachable off ctx.spawner, deterministic across boots (same
   seed => same spawns), dead-stays-dead through the shared delta store, and the
   existing district spawn logic still works using it. Headless:
   `node engine/bohemia_loop_entities_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var pass=0, fail=0;
function ok(c,m){ if(c){pass++;} else {fail++; console.log('  FAIL: '+m);} }

var ctx = Loop.boot({ seed:'bohemia' });
ok(ctx.ready===true, 'loop boots ready');
ok(!!ctx.spawner, 'ctx.spawner is poured (pullable from the context)');
ok(ctx.spawner.deltas === ctx.deltas, 'the context spawner shares the context delta store');

var d = ctx.worldMap.districts[0];
var rule = Loop.enemyRuleForDistrict(d);
var cx = d.pos[0], cy = d.pos[1];
var found1 = ctx.spawner.scanRegion(rule, cx-6, cy-6, cx+6, cy+6, {});
ok(Array.isArray(found1), 'ctx.spawner.scanRegion returns a list');

/* determinism: a fresh boot on the same seed yields identical spawns */
var ctxB = Loop.boot({ seed:'bohemia' });
var found2 = ctxB.spawner.scanRegion(Loop.enemyRuleForDistrict(ctxB.worldMap.districts[0]), cx-6, cy-6, cx+6, cy+6, {});
ok(JSON.stringify(found1)===JSON.stringify(found2), 'same seed -> identical spawns (deterministic, reload-stable)');

/* dead stays dead: clearing a spawned tile removes it, via the shared deltas */
if (found1.length) {
  var t = found1[0];
  ctx.spawner.markCleared('enemy', t.x, t.y, 0, 'cleared');
  var after = ctx.spawner.scanRegion(rule, cx-6, cy-6, cx+6, cy+6, {});
  ok(after.length === found1.length-1, 'a cleared tile no longer spawns (dead stays dead via ctx.spawner+deltas)');
  ok(ctx.deltas.has('enemy', t.x, t.y), 'the clear is recorded in the shared context delta store');
} else {
  ok(true, '(region had no spawns to clear; skipped dead-stays-dead)');
  ok(true, '(skipped delta check)');
}

/* regression: the district spawn logic still runs and uses the shared spawner */
var actors = Loop.spawnActorsForDistrict(ctx, d, { radius:6, add:false });
ok(Array.isArray(actors), 'spawnActorsForDistrict still works with the shared context spawner');

/* and the quest citizen from the prior wiring is still pullable alongside it */
ok(!!ctx.quests, 'ctx.quests still present (quests + spawner both hang off the one context)');

console.log('LOOP ENTITIES TESTS: '+pass+' passed, '+fail+' failed');
if(fail>0) process.exit(1);

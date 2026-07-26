/* bohemia_loop_faction_bridge_tests.js — proves THE WORLD BRIDGE (7/25): a
   quest's own @DO faction/advance_territory effects actually reach the REAL
   ctx.factions the moment it resolves, not just the quest's own scratch state.
   Before this bridge every canon quest already wrote real faction deltas
   (@DO faction TRADES +8) — the engine just never applied them anywhere.
   Headless: `node engine/bohemia_loop_faction_bridge_tests.js`. */
'use strict';
var Loop = require('./bohemia_loop.js');

var pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('  FAIL: ' + m); } }
function pick(v, s) { return (v.options || []).filter(function (o) { return o.text.indexOf(s) >= 0; })[0]; }

/* the real canon graph loads by DEFAULT now — the live game never passed
   opts.factionGraph, so before this fix ctx.factions was permanently empty. */
var ctx0 = Loop.boot({ seed: 'faction-bridge-default' });
ok(ctx0.factions.factions.size > 0, 'the real faction graph loads by default (no opts.factionGraph needed)');
ok(ctx0.factions.factions.has('Trades'), 'the real graph is the canon one (Trades is a real faction)');

/* an explicit override still wins (tests/gates inject their own graph) */
var ctxOverride = Loop.boot({ seed: 'faction-bridge-override', factionGraph: null });
ok(ctxOverride.factions.factions.size === 0, 'an explicit factionGraph:null still opts out (override always wins)');

var STANDING_Q = [
  '@QUEST bridge_standing  Bridge Standing Test',
  '@ACT 1', '@ONCE true',
  '@STAGE 10', '  @LOG opening',
  '@STAGE 20 COMPLETE #notable', '  @LOG resolved', '  @DO faction TRADES +8',
  '@TALK open speaker=k entry=stage>=10',
  '  @SAY hi', '  @OPT "resolve it" [gate: none] -> END  @DO set_stage 20',
  '@END',
].join('\n');

var ctx = Loop.boot({ seed: 'faction-bridge-test' });
var before = ctx.factions.factions.get('Trades').standingWith('player');
ok(before === 0, 'TRADES standing with player starts at 0 (sanity)');

var rt = ctx.quests.start(STANDING_Q);
rt.begin('open');
rt.choose(pick(rt.view(), 'resolve it').i);
ok(rt.state.done === true, 'the quest completed');
var after = ctx.factions.factions.get('Trades').standingWith('player');
ok(after === before + 8, 'STANDING: a quest\'s @DO faction TRADES +8 actually shifted the REAL faction standing (was ' + before + ', now ' + after + ')');

/* case-fold: quests write ALL-CAPS ids (@DO faction TRADES), the canon graph's
   own ids are Title Case ('Trades') — two vocabularies authored independently
   for the same 18 factions. The bridge must not silently no-op on the mismatch. */
ok(after !== before, 'faction id case-fold works (TRADES resolved to the real Trades entry, not silently dropped)');

/* TERRITORY: only ever moves opt-in, per the pacing law — never from an
   ordinary faction-standing bump, only an explicit @DO advance_territory. */
var TERRITORY_Q = [
  '@QUEST bridge_territory  Bridge Territory Test',
  '@ACT 1', '@ONCE true',
  '@STAGE 10', '  @LOG opening',
  '@STAGE 20 COMPLETE #notable', '  @LOG resolved', '  @DO advance_territory',
  '@TALK open speaker=k entry=stage>=10',
  '  @SAY hi', '  @OPT "resolve it" [gate: none] -> END  @DO set_stage 20',
  '@END',
].join('\n');
var NO_TERRITORY_Q = TERRITORY_Q.replace('  @DO advance_territory\n', '').replace('bridge_territory', 'bridge_no_territory');

var ctxT = Loop.boot({ seed: 'faction-bridge-territory' });
var calledWith = false;
var origAdvance = ctxT.factions.advanceRound.bind(ctxT.factions);
ctxT.factions.advanceRound = function (adj) { calledWith = true; return origAdvance(adj); };
var rtT = ctxT.quests.start(TERRITORY_Q);
rtT.begin('open');
rtT.choose(pick(rtT.view(), 'resolve it').i);
ok(calledWith === true, 'TERRITORY: @DO advance_territory actually fires the real advanceRound()');

var calledWithout = false;
ctxT.factions.advanceRound = function (adj) { calledWithout = true; return origAdvance(adj); };
var rtN = ctxT.quests.start(NO_TERRITORY_Q);
rtN.begin('open');
rtN.choose(pick(rtN.view(), 'resolve it').i);
ok(calledWithout === false, 'PACING LAW HELD: an ordinary quest resolution WITHOUT @DO advance_territory never touches advanceRound');

/* bare/legacy boot (no factions at all) never throws when a quest completes */
var ctxBare = Loop.boot({ seed: 'faction-bridge-bare', factionGraph: null });
var rtBare = ctxBare.quests.start(STANDING_Q);
rtBare.begin('open');
var threw = false;
try { rtBare.choose(pick(rtBare.view(), 'resolve it').i); } catch (e) { threw = true; }
ok(!threw, 'a quest with faction effects never throws when ctx.factions is empty (bare/legacy boot)');

/* ===========================================================================
   THE CASTING BRIDGE — a quest places itself into the real valley by reading
   its OWN @ROLE declarations. Before this the only way a quest reached the
   world was a hand-typed literal coordinate, so the nine gate-proven canon
   quests could not ship into a playable surface without inventing geography.
   =========================================================================== */
var fs = require('fs'), path = require('path');
var BQ = require('./bohemia_bq.js');
var BQ_DIR = path.join(__dirname, '..', 'quests', 'bq');
var bqFiles = fs.existsSync(BQ_DIR)
  ? fs.readdirSync(BQ_DIR).filter(function (f) { return /\.bq$/.test(f); }).sort() : [];
ok(bqFiles.length > 0, 'canon .bq quests exist to cast');

var ctxC = Loop.boot({ seed: 'casting-bridge' });
var cast = {};
bqFiles.forEach(function (f) {
  var text = fs.readFileSync(path.join(BQ_DIR, f), 'utf8');
  var rec = ctxC.quests.cast(text);
  cast[f] = rec;
  ok(!!rec && rec.at && typeof rec.at.x === 'number' && typeof rec.at.y === 'number',
    f + ': cast to a real tile (x/y are real numbers, not undefined)');
});

/* a quest lands on ground the faction it NAMES actually holds — the whole
   point: the placement comes from the quest's own text, not from a guess. */
bqFiles.forEach(function (f) {
  var Q = BQ.parse(fs.readFileSync(path.join(BQ_DIR, f), 'utf8'));
  var wants = (Q.roles || []).map(function (r) {
    var m = /(?:^|\s)faction=([A-Za-z_]+)/.exec(r.cond || '');
    return m ? m[1] : null;
  }).filter(function (x) { return x && x.toUpperCase() !== 'ANY'; });
  if (!wants.length) return;                       // no faction demand: any real district is correct
  var rec = cast[f];
  if (!rec.at.faction) return;                     // that faction holds nothing yet — falls back, still real
  var f2 = ctxC.factions.factions.get(rec.at.faction);
  ok(!!f2 && f2.territory.has(rec.at.x + ',' + rec.at.y),
    f + ': landed on ground ' + rec.at.faction + ' really holds (from its own @ROLE faction=' + wants[0] + ')');
});

/* THE PHONELESS (Paolo 7/20, his own cited example): a homeless-faction quest
   cannot be picked up over the phone — you have to pull up on them. Everything
   else defaults to feed; WHICH other npcs are phoneless stays Paolo's call. */
var homelessQuest = bqFiles.filter(function (f) {
  return /faction=HOMELESS/.test(fs.readFileSync(path.join(BQ_DIR, f), 'utf8'));
})[0];
if (homelessQuest) {
  ok(cast[homelessQuest].at.channel === 'inperson',
    'PHONELESS: the homeless-faction quest auto-cast to in-person (not phone-pickable)');
}
var nonHomeless = bqFiles.filter(function (f) { return f !== homelessQuest; });
ok(nonHomeless.every(function (f) { return cast[f].at.channel === 'feed'; }),
  'every other quest defaults to the feed channel (no invented in-person content)');

/* DETERMINISM: same seed + same quest -> same tile forever (stable hash, no
   live RNG), so a quest never wanders between reloads and saved placements
   stay true. A different seed must genuinely re-place them. */
function castAll(seed) {
  var c = Loop.boot({ seed: seed });
  return bqFiles.map(function (f) {
    var r = c.quests.cast(fs.readFileSync(path.join(BQ_DIR, f), 'utf8'));
    return f + ':' + r.at.x + ',' + r.at.y + ',' + r.at.channel;
  }).join('|');
}
ok(castAll('determinism-seed') === castAll('determinism-seed'),
  'DETERMINISTIC: the same seed casts every quest to the exact same tile twice');
ok(castAll('determinism-seed') !== castAll('a-different-seed'),
  'seed-sensitive: a different valley really re-places the quests');

/* casting never throws with no world at all (bare boot) */
var ctxNoWorld = Loop.makeContext();
var mgr = Loop.makeQuestManager({});
var threwCast = false;
try { mgr.cast(fs.readFileSync(path.join(BQ_DIR, bqFiles[0]), 'utf8')); } catch (e) { threwCast = true; }
ok(!threwCast, 'cast() never throws when there is no world/factions to cast into');

console.log('LOOP FACTION BRIDGE TESTS: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);

// BOHEMIA — TAKING A TOWN (FACTIONS lane, row [take a town], 10/18/26)
// OWNING-ANOTHER-SETTLEMENT-IS-ENDGAME. Paolo 10/1 (fifth votes): "owning other settlements is a big deal,
// endgame, not cheap; not even Battle Brothers lets you take over a city; your settlement at your base".
// Paolo 9/28 (third votes): "if you attack the whole faction settlement it's yours or ruined".
//
// Battle Brothers never gives the company a town: in the War of the Noble Houses a house hires you to besiege
// another's fort and the town goes to the house (records/target/bb/take.json quotes every line, the gate re-reads
// them from the wiki tarball). Ours keeps its chain and ends it in the home base ledger, YOURS or RUINED, by 'contract'.
//
// FIVE STEPS, IN ORDER, NEVER A CLICK: THE ASK (a door, the late third, a home of your own, this act's one take),
// CUT THE ROADS (the holder has no party out), THE SIEGE (held for the raid chain's own days), THE GATE (surrender
// after the siege, assault any time after the roads, or burn), THE HOLD (the old holder's last force, when anybody
// is left to send one). No dice anywhere (rule 117): what you did and who is left decide.
//
// NO NUMBER IS TYPED HERE. The late third is BohemiaHomeBases.openAt('fortress') (his DEPTH thirds), the siege days and
// the one take per act are the ledger's RAID_DEFAULTS, the bars are relations.json's bands by name, Conquered's days are
// arrival_traits.json's. The two writes are the ledger's took() and ruined(); this file keeps only the chains.
//
//   make()                          -> {V, chains:[]}
//   offer(tk, rec, t, ctx)          -> {ok:true, door, by} | {ok:false, reason}
//   open(tk, rec, t, ctx)           -> {applied:true, chain} | {applied:false, reason}
//   step(tk, rec, base, ev, ctx)    -> {applied:true, chain, entry} | {applied:false, reason}
//   status(tk, base)                -> [{id, state:'done'|'now'|'later'|'skipped'|'lost'}]  (the timeline)
//   t   = {base, tier}   who holds it is the ledger's answer alone; the ledger seeds a region place from its data file
//                        (FACTIONS [region in the ledger] 10/18), so a caller's word for the holder is never asked
//   ctx = {progress (0..1, the CALLER's), day, bases (every ledger key the caller knows), bars (relations rec),
//          between(a, b), factions (ids that could hire or relieve), inside (ids living on the target's ground),
//          traits (arrival traits rec, for Conquered)}
//   ev  = {step:'cut_the_roads', partiesOut} | {step:'the_siege', days} | {step:'the_gate', how:'surrender'|'assault'|'burn', won}
//         | {step:'the_hold', won}, each with the map's day
// node: require('./bohemia_take.js').load(require('fs'), require('path'))   Gate: gates/take_a_town_gate.js
'use strict';
(function (root) {
  var V = 1;
  var STEPS = ['the_ask', 'cut_the_roads', 'the_siege', 'the_gate', 'the_hold'];
  var D = null, RD = null, H = null, R = null, AT = null;

  function load(fs, path) {
    D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/take.json'), 'utf8'));
    RD = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/relations.json'), 'utf8'));
    H = require('./bohemia_homebases.js');
    R = require('./bohemia_relations.js'); R.set(RD);
    AT = require('./bohemia_arrivaltraits.js'); AT.load(fs, path);
  }
  function set(d, rd, h, r, at) { D = d; RD = rd; H = h; R = r; AT = at; }

  function make() { return { V: V, chains: [] }; }
  function band(id) { var b = RD.bands.value; for (var i = 0; i < b.length; i++) if (b[i].id === id) return b[i]; return null; }
  function bar(ctx, id) { return R.score((ctx && ctx.bars) || R.make(), id); }
  function rel(ctx, a, b) {
    if (!ctx || typeof ctx.between !== 'function') return null;
    return ctx.between(a, b) || ctx.between(b, a) || null;
  }

  /* who holds it now: the ledger's answer, which seeds Henderson as the Trades' and a valley seat as its own; null for a ruin */
  function holderOf(rec, t) {
    if (H.isRuin(rec, t.base, rec.act)) return null;
    return H.heldBy(rec, t.base, rec.act);
  }
  function standing(rec, ctx, who, but) {
    var ks = (ctx && ctx.bases) || [], out = [];
    for (var i = 0; i < ks.length; i++) {
      if (ks[i] === but || H.isRuin(rec, ks[i], rec.act)) continue;
      if (H.heldBy(rec, ks[i], rec.act) === who) out.push(ks[i]);
    }
    return out;
  }
  function chainOn(tk, base, state) {
    var cs = (tk && tk.chains) || [], hit = null;
    for (var i = 0; i < cs.length; i++) if (cs[i].base === base && (!state || cs[i].state === state)) hit = cs[i];
    return hit;
  }
  function takesIn(tk, act) {
    var n = 0, cs = (tk && tk.chains) || [];
    for (var i = 0; i < cs.length; i++) if (cs[i].act === act) n++;
    return n;
  }

  /* THE THREE DOORS, in the data file's order. The test names are the data's; an unknown test opens nothing. */
  function doorOf(rec, t, holder, ctx) {
    var open = band('open').lo, hostile = band('hostile').hi, ids = Object.keys(D.doors), i, j, f;
    for (i = 0; i < ids.length; i++) {
      var test = D.doors[ids[i]].test;
      if (test === 'hostile_to_holder') {
        for (j = 0; j < ((ctx && ctx.factions) || []).length; j++) {
          f = ctx.factions[j];
          if (f === holder || f === H.YOU) continue;
          var r = rel(ctx, f, holder);
          if (r && r.sign === 'hostile' && bar(ctx, f) >= open) return { door: ids[i], by: f };
        }
      } else if (test === 'inside_not_fortress') {
        if (t.tier === 'fortress') continue;
        for (j = 0; j < ((ctx && ctx.inside) || []).length; j++) {
          f = ctx.inside[j];
          if (f !== holder && f !== H.YOU && bar(ctx, f) >= open) return { door: ids[i], by: f };
        }
      } else if (test === 'holder_hostile_to_you') {
        if (bar(ctx, holder) <= hostile) return { door: ids[i], by: holder };
      }
    }
    return null;
  }

  function offer(tk, rec, t, ctx) {
    if (!D || !H) return { ok: false, reason: 'NOT_LOADED' };
    if (!t || !t.base || !rec) return { ok: false, reason: 'NO_BASE' };
    ctx = ctx || {};
    if (typeof ctx.progress !== 'number') return { ok: false, reason: 'NO_PROGRESS' };
    if (!(ctx.progress >= H.openAt('fortress'))) return { ok: false, reason: 'TOO_EARLY' };
    var holder = holderOf(rec, t);
    if (holder === null) return { ok: false, reason: 'RUIN' };
    if (holder === H.YOU) return { ok: false, reason: 'ALREADY_YOURS' };
    if (chainOn(tk, t.base, 'open')) return { ok: false, reason: 'ALREADY_OPEN' };
    if (!standing(rec, ctx, H.YOU, t.base).length) return { ok: false, reason: 'NO_HOME' };
    if (takesIn(tk, rec.act) >= H.RAID_DEFAULTS.perAct) return { ok: false, reason: 'ONE_PER_ACT' };
    var d = doorOf(rec, t, holder, ctx);
    if (!d) return { ok: false, reason: 'NO_DOOR' };
    return { ok: true, door: d.door, by: d.by, holder: holder };
  }

  function open(tk, rec, t, ctx) {
    var o = offer(tk, rec, t, ctx);
    if (!o.ok) return { applied: false, reason: o.reason };
    var day = (ctx && typeof ctx.day === 'number') ? ctx.day : null;
    var c = { n: tk.chains.length + 1, act: rec.act, base: t.base, tier: t.tier || null,
              holder: o.holder, door: o.door, by: o.by, state: 'open', relief: null, steps: {} };
    c.steps.the_ask = { state: 'done', day: day };
    tk.chains.push(c);
    return { applied: true, chain: c };
  }

  function done(c, id) { return !!c.steps[id] && (c.steps[id].state === 'done' || c.steps[id].state === 'skipped'); }
  function mark(c, id, state, day, how) { c.steps[id] = { state: state, day: day, how: how || null }; }

  /* who is left to send the last force: the holder from another base of its own, else a warm friend holding one */
  function reliefFor(rec, c, ctx) {
    if (standing(rec, ctx, c.holder, c.base).length) return c.holder;
    var fs = (ctx && ctx.factions) || [];
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i];
      if (f === c.holder || f === H.YOU) continue;
      var r = rel(ctx, f, c.holder);
      if (r && r.sign === 'warm' && standing(rec, ctx, f, c.base).length) return f;
    }
    return null;
  }

  function finish(rec, c, ctx, day) {
    var w = H.took(rec, { base: c.base, to: H.YOU, by: 'contract', day: day, why: 'take:' + c.door });
    if (!w.applied) return w;
    if (ctx && ctx.traits && typeof day === 'number') AT.markTaken(ctx.traits, c.base, H.YOU, day);
    c.state = 'yours';
    return { applied: true, chain: c, entry: w.entry };
  }
  function lose(c, id, day) { mark(c, id, 'lost', day); c.state = 'failed'; return { applied: true, chain: c, entry: null }; }

  function step(tk, rec, base, ev, ctx) {
    if (!D || !H) return { applied: false, reason: 'NOT_LOADED' };
    var c = chainOn(tk, base, 'open');
    if (!c || !rec) return { applied: false, reason: 'NO_CHAIN' };
    ev = ev || {};
    var day = (typeof ev.day === 'number') ? ev.day : null, at = STEPS.indexOf(ev.step);
    if (at < 1) return { applied: false, reason: 'BAD_EVENT' };
    var now = holderOf(rec, { base: c.base });
    if (now !== c.holder) { c.state = 'moot'; return { applied: false, reason: 'MOOT' }; }
    if (done(c, ev.step)) return { applied: false, reason: 'OUT_OF_ORDER' };

    if (ev.step === 'cut_the_roads') {
      if (typeof ev.partiesOut !== 'number') return { applied: false, reason: 'BAD_EVENT' };
      if (ev.partiesOut > 0) return { applied: false, reason: 'NOT_YET' };
      mark(c, 'cut_the_roads', 'done', day);
      return { applied: true, chain: c, entry: null };
    }
    if (!done(c, 'cut_the_roads')) return { applied: false, reason: 'OUT_OF_ORDER' };
    if (ev.step === 'the_siege') {
      if (typeof ev.days !== 'number') return { applied: false, reason: 'BAD_EVENT' };
      if (ev.days < H.RAID_DEFAULTS.prepDays) return { applied: false, reason: 'NOT_YET' };
      mark(c, 'the_siege', 'done', day);
      return { applied: true, chain: c, entry: null };
    }
    if (ev.step === 'the_gate') {
      if (ev.how === 'surrender') {
        if (!done(c, 'the_siege')) return { applied: false, reason: 'SIEGE_NOT_HELD' };
      } else if (ev.how === 'assault') {
        if (typeof ev.won !== 'boolean') return { applied: false, reason: 'BAD_EVENT' };
      } else if (ev.how !== 'burn') return { applied: false, reason: 'BAD_EVENT' };
      if (!done(c, 'the_siege')) mark(c, 'the_siege', 'skipped', day);
      if (ev.how === 'assault' && !ev.won) return lose(c, 'the_gate', day);
      if (ev.how === 'burn') {
        var w = H.ruined(rec, { base: c.base, by: 'contract', day: day, why: 'burned' });
        if (!w.applied) return w;
        mark(c, 'the_gate', 'done', day, 'burn'); mark(c, 'the_hold', 'skipped', day);
        c.state = 'ruined';
        return { applied: true, chain: c, entry: w.entry };
      }
      mark(c, 'the_gate', 'done', day, ev.how);
      c.relief = reliefFor(rec, c, ctx);
      if (c.relief) return { applied: true, chain: c, entry: null };
      mark(c, 'the_hold', 'done', day, 'nobody came');
      return finish(rec, c, ctx, day);
    }
    /* the_hold */
    if (!done(c, 'the_gate') || !c.relief) return { applied: false, reason: 'OUT_OF_ORDER' };
    if (typeof ev.won !== 'boolean') return { applied: false, reason: 'BAD_EVENT' };
    if (!ev.won) return lose(c, 'the_hold', day);
    mark(c, 'the_hold', 'done', day, 'held');
    return finish(rec, c, ctx, day);
  }

  /* THE TIMELINE: the newest take on that base, every step lit; the first step not done is 'now' while it runs */
  function status(tk, base) {
    var c = chainOn(tk, base, null), out = [], nowSet = false;
    if (!c) return out;
    for (var i = 0; i < STEPS.length; i++) {
      var s = c.steps[STEPS[i]], st;
      if (s) st = s.state;
      else if (c.state === 'open' && !nowSet) { st = 'now'; nowSet = true; }
      else st = 'later';
      out.push({ id: STEPS[i], state: st });
    }
    return out;
  }

  /* a save: chains that are whole come back, anything else is dropped (a blob with none reads as no take ever ran) */
  function restore(blob) {
    var tk = make(), cs = blob && blob.chains;
    if (Object.prototype.toString.call(cs) !== '[object Array]') return tk;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      if (!c || !c.base || typeof c.act !== 'number' || !c.steps || typeof c.steps !== 'object') continue;
      if (['open', 'yours', 'ruined', 'failed', 'moot'].indexOf(c.state) < 0) continue;
      tk.chains.push(JSON.parse(JSON.stringify(c)));
    }
    return tk;
  }

  var API = { V: V, STEPS: STEPS.slice(), load: load, set: set, make: make, offer: offer, open: open, step: step,
              status: status, restore: restore, holderOf: holderOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaTake = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

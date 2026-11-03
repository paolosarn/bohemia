// BOHEMIA -- THE ARENA (ARENA lane, 11/3/26, VAMILY rule 375, ask lines 402 and 403)
// Paolo 11/3: 'I forgot about the arena system in Battle Brothers holy shit yes I love that... definitely gonna be a part of the
// mob... they host an arena with exotic DNA lab shits... make it easier: your accessory thing is X'd out and it won't apply as you
// enter... easier to choose the three people that go in... a tournament, you can bring five.' AMENDED: 'the mob, they're [held
// together] by fucking duct tape and a thread... barely able to.'
//
// THE MOB'S PIT, Battle Brothers' way (records/BOHEMIA_ARENA_HOW_BATTLE_BROTHERS_DOES_IT_11_3_26.md): you see the whole card before
// you sign (who, how many, the purse); one card a day, a new one when the day turns; three men, five in a tournament; paid only on
// a win; no retreat, no loot; a man who wins climbs the ranks (Pit Fighter, Arena Fighter, Arena Veteran) and keeps the trait;
// every fifth card is a third harder and offers a piece of pit gear found nowhere else (it waits for your next win); a few days
// in eighteen the Strip holds a tournament: five men, three rounds, quit after any round. When the Mob cannot feed its generator
// the big clones are off the card and the small ones come out at half the number.
// Every number is in records/target/bb/arena.json with its source (TUNING's table, section X); nothing here types one.
//
//   BohemiaArena.set(json)                       the data (the browser fetches it; node reads it)
//   BohemiaArena.card(place, day, o)             -> the day's card {id, day, opp, lines, band, purse, fifth, prize, power, men, ...}
//                                                   o: {wins, tournament: {round}} (wins defaults to the save's)
//   BohemiaArena.today(place, day)               -> {card, fought, tournament} what the bookie shows today
//   BohemiaArena.tournament(day)                 -> {on, from, to, left} the Strip's tournament window
//   BohemiaArena.result(card, out)               -> settles a fight: {won, paid, prize, ranks:[{name, rank, was}], state}
//   BohemiaArena.rankOf(name) / ranks(name)      -> a man's arena rank row (or null) / his fights and wins
//   BohemiaArena.trait(name)                     -> {resolve, struck_down_survive, rank} what his rank gives him in any fight
//   BohemiaArena.state() / save(st) / reset()    -> the save: localStorage 'bohemia.arena.v1'
// node: require('./bohemia_arena.js')   gate: gates/the_arena_gate.js
(function (root) {
  'use strict';
  var D = null, NODE = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var KEY = 'bohemia.arena.v1', MEM = null;
  if (NODE) {
    try { var fs = require('fs'), path = require('path'); D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/arena.json'), 'utf8')); } catch (e) {}
  } else if (typeof fetch !== 'undefined') {
    try {
      var here = (typeof location !== 'undefined' && /\/slices\//.test(location.pathname)) ? '../' : '';
      fetch(here + 'records/target/bb/arena.json').then(function (r) { return r.json(); }).then(function (j) { if (!D) D = j; }).catch(function () {});
    } catch (e) {}
  }
  function V(k) { return D && D[k] ? D[k].value : null; }
  function hash(s) { var h = 2166136261 >>> 0; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* ---- the save ---- */
  function blank() { return { wins: 0, fights: 0, men: {}, lastDay: null, prizes: 0, prizeOwed: false, tourney: null, log: [] }; }
  function state() {
    if (MEM) return MEM;
    var st = null;
    try { if (typeof localStorage !== 'undefined') st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    MEM = st && typeof st === 'object' ? st : blank();
    var b = blank(); for (var k in b) if (MEM[k] === undefined) MEM[k] = b[k];
    return MEM;
  }
  function save(st) { MEM = st || MEM || blank(); try { if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(MEM)); } catch (e) {} return MEM; }
  function reset() { MEM = blank(); try { if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY); } catch (e) {} return MEM; }
  function reload() { MEM = null; return state(); }

  /* ---- the Mob's power, a day at a time (draft, rule 375 amended) ---- */
  function power(place, day) {
    var p = V('power') || { out_chance: 0 }; var r = rng(hash('arena:power:' + place + ':' + day))();
    return { out: r < p.out_chance, beast_mult: p.beast_mult, big_off: !!p.big_off };
  }

  /* ---- the tournament window (bb_all/0133: a situation for five days) ---- */
  function tournament(day) {
    var t = V('tournament'); if (!t || day == null) return { on: false };
    var d = Math.floor(day); if (d < t.first_day) return { on: false, next: t.first_day };
    var k = Math.floor((d - t.first_day) / t.every_days), from = t.first_day + k * t.every_days, to = from + t.days - 1;
    if (d <= to) return { on: true, from: from, to: to, left: to - d + 1, id: 'tourney:' + from };
    return { on: false, next: from + t.every_days };
  }

  /* ---- the card (Battle Brothers' weighted pool, unlocked by arena wins; bb_all/0131) ---- */
  function card(place, day, o) {
    o = o || {}; if (!D) return null;
    var st = state(), wins = o.wins != null ? o.wins : st.wins, tr = o.tournament || null;
    var dayN = Math.floor(day || 0);
    var cs = V('count_scale'), T = V('tournament') || {};
    var wEff = wins + (tr ? (T.round_wins_bonus || 0) * (tr.round || 0) : 0);
    var seedKey = 'arena:' + place + ':' + dayN + (tr ? ':t' + tr.id + ':' + tr.round : '');
    var R = rng(hash(seedKey)), pw = tr ? { out: false } : power(place, dayN);
    var pool = (V('opponents') || []).filter(function (op) { return wEff >= op.min_wins && wEff <= op.max_wins && !(pw.out && pw.big_off && op.big); });
    if (!pool.length) pool = (V('opponents') || []).slice(0, 1);
    var tot = pool.reduce(function (a, op) { return a + op.weight; }, 0), pick = R() * tot, opp = pool[0];
    for (var i = 0; i < pool.length; i++) { pick -= pool[i].weight; if (pick < 0) { opp = pool[i]; break; } }
    var fights = st.fights || 0, nextWin = wins + 1, every = (V('fifth') || {}).every || 5;
    var fifth = !tr && (nextWin % every === 0 || !!st.prizeOwed);
    var s = Math.max(0, Math.min(1, (dayN + 2 * wins) / (cs.days_plus_wins_full || 60))) * (cs.easier || 1);
    var lines = [], band = [], extra = 0, count = 0;
    opp.enemies.forEach(function (e) {
      var n = Math.round(e.min + (e.max - e.min) * s + (R() - 0.5) * 0.9);
      n = Math.max(e.min, Math.min(e.max, n));
      if (tr && tr.round > 0 && e === opp.enemies[0]) n += (T.round_count_plus || 0) * tr.round;
      if (fifth) n = Math.max(n, Math.ceil(n * (cs.fifth_mult || 1)));
      if (pw.out && opp.beast) n = Math.max(1, Math.ceil(n * (pw.beast_mult || 1)));
      extra += Math.max(0, n - e.min); count += n;
      lines.push({ id: e.id, n: n });
      for (var k = 0; k < n; k++) band.push(e.id);
    });
    var purse = tr ? ((T.purse || [])[tr.round || 0] || 0) : opp.purse + extra * (V('purse_per_extra') || 0);
    var prizes = (V('fifth') || {}).prizes || [], prize = null;
    if (fifth) { var pi = st.prizes || 0; prize = pi < prizes.length ? prizes[pi] : prizes[Math.floor(R() * prizes.length)]; }
    return {
      id: seedKey, place: place, day: dayN, opp: opp.id, says: opp.says, beast: !!opp.beast, lines: lines, band: band, count: count,
      purse: purse, fifth: fifth, prize: prize, power: pw, men: tr ? V('men_tournament') : V('men'),
      tournament: tr ? { id: tr.id, round: tr.round || 0, rounds: T.rounds, prize: T.prize } : null,
      retreat: !!V('retreat'), loot: !!V('loot'), accessory: !!V('accessory_counts'), crowd: V('crowd'), wins: wins
    };
  }

  function fought(day) { var st = state(); return st.lastDay != null && Math.floor(st.lastDay) === Math.floor(day); }
  function today(place, day) {
    var st = state(), t = tournament(day), tr = null;
    if (t.on) {
      var cur = st.tourney && st.tourney.id === t.id ? st.tourney : null;
      if (!cur || (!cur.done && !cur.out)) tr = { id: t.id, round: cur ? cur.round : 0, left: t.left, entered: !!cur, men: cur ? cur.men : null };
      else tr = { id: t.id, done: true, out: !!cur.out, won: !!cur.won, left: t.left };
    }
    return { card: card(place, day), fought: fought(day), tournament: tr, window: t };
  }

  function rankRow(w) { var rs = V('ranks') || [], r = null; rs.forEach(function (x) { if (w >= x.wins) r = x; }); return r; }
  function ranks(name) { var m = state().men[String(name || '').toUpperCase()]; return m || { fights: 0, wins: 0 }; }
  function rankOf(name) { return rankRow(ranks(name).wins); }
  function trait(name) { var r = rankOf(name); return r ? { rank: r.id, name: r.name, resolve: r.resolve, struck_down_survive: r.struck_down_survive } : null; }

  /* ---- settle a fight: paid only on a win; every man who stood in it counts the fight, the living winners count the win ---- */
  function result(c, out) {
    var st = state(); out = out || {};
    var won = !!out.won, men = out.men || [], gained = [];
    st.fights = (st.fights || 0) + 1;
    if (!c.tournament) st.lastDay = c.day;
    men.forEach(function (m) {
      var k = String(m.name || '').toUpperCase(); if (!k) return;
      var row = st.men[k] || (st.men[k] = { fights: 0, wins: 0 });
      var was = rankRow(row.wins);
      row.fights++; if (won && !m.dead) row.wins++;
      var now = rankRow(row.wins);
      if (now && (!was || was.id !== now.id)) gained.push({ name: m.name, rank: now.id, rank_name: now.name, says: now.says, was: was ? was.id : null });
    });
    var prize = null;
    if (won) {
      st.wins = (st.wins || 0) + 1;
      if (c.fifth && c.prize) { prize = c.prize; st.prizes = (st.prizes || 0) + 1; st.prizeOwed = false; }
    } else if (c.fifth && !c.tournament) st.prizeOwed = true;
    if (c.tournament) {
      var T = V('tournament') || {}, tt = st.tourney && st.tourney.id === c.tournament.id ? st.tourney : (st.tourney = { id: c.tournament.id, round: 0, banked: 0, men: men.map(function (m) { return m.name; }) });
      if (won) { tt.banked = (T.purse || [])[c.tournament.round] || 0; tt.round = c.tournament.round + 1; if (tt.round >= (T.rounds || 3)) { tt.done = true; tt.won = true; prize = T.prize || prize; } }
      else { tt.out = true; tt.done = true; }
    }
    st.log = (st.log || []).concat([{ day: c.day, opp: c.opp, won: won, purse: won ? c.purse : 0, t: c.tournament ? c.tournament.round : null }]).slice(-40);
    save(st);
    return { won: won, paid: won ? c.purse : 0, prize: prize, ranks: gained, state: st };
  }
  /* a tournament quit after a won round keeps what that round paid (bb_all/0131: 'the earlier you quit, the lower the prize') */
  function quit(id) { var st = state(); if (st.tourney && st.tourney.id === id && !st.tourney.done) { st.tourney.done = true; st.tourney.quit = true; save(st); } return st.tourney; }

  var API = { set: function (j) { D = j; return API; }, data: function () { return D; }, ready: function () { return !!D; }, card: card, today: today, fought: fought,
    tournament: tournament, result: result, quit: quit, rankOf: rankOf, ranks: ranks, trait: trait, power: power,
    state: state, save: save, reset: reset, reload: reload, KEY: KEY, V: V };
  if (NODE) module.exports = API; else root.BohemiaArena = API;
})(typeof window !== 'undefined' ? window : this);

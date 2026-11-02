// BOHEMIA -- A JOB PAYS FOR THE TIME AND THE RISK (ECONOMY 2, 11/2/26, rule 323, ask line 320)
// Paolo 11/2, playing: 'I don't have any problem with the hunt the dogs quest, but I just don't think it's giving me enough
// money for the amount of time that I'm doing for it... for most of the quests I want you to feel properly compensated with
// how difficult it was... it's a bit tedious to chase 11 dogs... I'm sure there's a system where it's like how friendly you
// are with the settlement, with a faction.' Rule 303 over it: fair, never stingy.
//
// MEASURED (records/BOHEMIA_ECONOMY_A_JOB_PAYS_FOR_THE_TIME_AND_THE_RISK_11_2_26.md): every board job paid 30 a skull, flat,
// whatever it asked. The dog hunt is one skull and eleven dogs in packs of two to four: about four fights and five legs of
// walking for 30, where a one-fight crew job pays the same 30.
//
// NOW a job's BASE pay is worked out from what it costs him (records/target/bb/job_pay.json, every number with its reason):
//   time   = the job's map hours x what the crew burns an hour x (1 + the margin)
//   fights = THE VIOLENCE PREMIUM: the fights it brings x one fight's worth x the skulls; a HUNT pays per head (a head is a
//            third of a fight, the packs are two to four), so chasing eleven dogs pays for eleven
//   risk   = a walk's twist that may turn into a fight, at the same price times its chance
//   floor  = a killing job never under what it paid before (30 a skull); a job with no killing only the quiet floor (10 a
//            skull), so a walk, a delivery or a search pays clearly less (rule 323 amended 11/2, ask line 321)
// and at the offer the client town's standing with him (the town's own 0 to 100 bar, records/target/bb/relations.json bands)
// bends it: a friendlier town pays a little more and says so; a colder one a little less.
// The base is BAKED into the shelf (tools/bohemia_economy_job_pay.js writes job_pay.json 'pays'; the shelf's baker reads it),
// so nothing at runtime computes a base; the standing is the only live part.
//   BohemiaJobPay.base(offer, kinds)        -> { pay, before, violent, hours, fights, risk, heads, time, fight, why }   (the formula)
//   BohemiaJobPay.violenceWord(id)          -> what the offer says: killing work pays the premium, a walk pays less (rule 323 amended)
//   BohemiaJobPay.standing(score)           -> { band, mult, pct, word }   (word '' at neutral)
//   BohemiaJobPay.scoreOf(place, day)       -> the place's bar as the town keeps it (browser only; 50 with nothing kept)
//   BohemiaJobPay.at(place, day)            -> standing(scoreOf(place, day))
// node: require('./bohemia_job_pay.js')   gate: gates/a_job_pays_for_the_time_and_the_risk_gate.js
(function (root) {
  'use strict';
  var D = null, REL = null, NODE = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  if (NODE) {
    try {
      var fs = require('fs'), path = require('path');
      D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/job_pay.json'), 'utf8'));
      REL = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/relations.json'), 'utf8'));
    } catch (e) {}
  } else if (typeof fetch !== 'undefined') {
    /* the page's own folder is slices/; the data sits beside the engine's records */
    try { fetch('../records/target/bb/job_pay.json').then(function (r) { return r.json(); }).then(function (j) { D = j; }).catch(function () {}); } catch (e) {}
    try { fetch('../records/target/bb/relations.json').then(function (r) { return r.json(); }).then(function (j) { REL = j; }).catch(function () {}); } catch (e) {}
  }
  function v(k, d) { var x = D && D[k]; return x && x.value != null ? x.value : d; }
  function mid(r, d) { return Array.isArray(r) && r.length === 2 ? (r[0] + r[1]) / 2 : d; }
  function sk(n) { n = n | 0; return n >= 1 && n <= 3 ? n : 1; }

  /* the job's kind row and its own row (BOHEMIA_JOB_KINDS.json: kinds and offers) */
  function kindOf(offer, kinds) {
    var row = (kinds && kinds.offers && kinds.offers[offer.id]) || {}, k = row.kind || offer.kind;
    if (!k && kinds && Array.isArray(kinds.guess)) {
      var t = String(offer.title || '').toLowerCase();
      for (var i = 0; i < kinds.guess.length; i++) { try { if (new RegExp(kinds.guess[i].re, 'i').test(t)) { k = kinds.guess[i].kind; break; } } catch (e) {} }
    }
    return { name: k || (kinds && kinds['default']) || 'clear-crew', row: row, kind: (kinds && kinds.kinds && kinds.kinds[k || (kinds && kinds['default'])]) || {} };
  }
  function placeBlocks(row) {
    var P = v('place_blocks', {}), n = row && row.place && (row.place.real || row.place.name);
    return n && P[String(n).toUpperCase()] != null ? +P[String(n).toUpperCase()] : null;
  }

  /* THE FORMULA. Blocks and fights from the kind's own data (the same numbers the map plays the job with), hours at the
     measured minutes a block; every constant is job_pay.json's. */
  function base(offer, kinds) {
    var s = sk(offer.skulls), K = kindOf(offer, kinds), k = K.kind, row = K.row, name = K.name;
    var mpb = v('minutes_per_block', 8.5), crewBlocks = mid(v('crew_blocks', [6, 10]), 8), packSize = mid(k.pack_size, v('pack_size', 3));
    var baseMen = v('base_men', { 1: 4, 2: 6, 3: 8 })[s] || 4, waitHold = v('hold_wait_hours', 6), waitDark = v('dark_wait_hours', 6);
    /* fights: the ones the job is for (the violence); risk: the ones a twist may bring (the chance a walk turns bloody) */
    var pb = placeBlocks(row), blocks = 0, waitH = 0, fights = 0, risk = 0, heads = 0, legs = null, dark = false;
    switch (name) {
      case 'clear-crew': blocks = crewBlocks; fights = 1; break;
      case 'haul-caravan': blocks = (pb != null ? pb : mid(k.dest_blocks, 19)) * (k.pace || 1);
        fights = (k.ambush_by_skulls || [1, 1, 2])[s - 1]; break;
      case 'find-place': blocks = (pb != null ? pb : mid(k.blocks, 13.5)) * 2; risk = (k.twist_rate || 0); break;
      case 'find-person': blocks = (pb != null ? pb : mid(k.blocks, 12.5)) * (1 + (k.pace || 1)); risk = (k.twist_rate || 0); break;
      case 'hunt-kind':
        heads = (row.need != null ? row.need : (k.need_by_skulls || [4, 7, 10])[s - 1]) | 0;
        legs = Math.ceil(heads / packSize) + 1;   /* to each pack, and back to the client */
        blocks = legs * mid(k.pack_blocks, 10.5); fights = heads / packSize; break;
      case 'clear-camp': blocks = pb != null ? pb : crewBlocks; fights = 1 + (k.extra_men || 0) / baseMen; break;
      case 'carry': blocks = pb != null ? pb : mid(k.dest_blocks, 17); risk = (k.twist_rate || 0); break;
      case 'hold-defend': blocks = 0; waitH = waitHold; fights = row.waves != null ? row.waves : (k.waves_by_skulls || [1, 2, 3])[s - 1]; break;
      case 'recover-return': blocks = (pb != null ? pb : mid(k.blocks, 10)) * 2; fights = row.guards === 0 ? 0 : 1; break;
      case 'patrol': blocks = 3 * mid(k.post_blocks, 12); fights = (k.bands_by_skulls || [1, 2, 2])[s - 1]; break;
      default:
        if (Array.isArray(k.legs)) {   /* a kind told as legs: each leg its blocks, a fight where it has one, the dark waited for */
          k.legs.forEach(function (L) {
            if (L.go === 'client') { blocks += mid(k.blocks, 10); return; }
            blocks += mid(L.blocks, mid(k.blocks, 10));
            if (L.wait) waitH += L.wait / 60;
            if (L.dark && !dark) { waitH += waitDark; dark = true; }   /* once dark, the next legs are the same night */
            if (L.fight) fights += 1;
          });
          if (k.twist && k.twist.leg) { blocks += (k.twist.rate || 0) * mid(k.twist.leg.blocks, 0); if (k.twist.leg.fight) risk += (k.twist.rate || 0); }
        } else { blocks = crewBlocks; fights = 1; }
    }
    var hours = blocks * mpb / 60 + waitH;
    var cost = v('crew_cost_per_map_hour', 1.375), margin = v('margin', 1), perFight = v('per_fight', 26), sm = v('skull_mult', { 1: 1, 2: 2, 3: 3 })[s] || s;
    /* THE VIOLENCE PREMIUM (rule 323 amended, ask line 321, Paolo 11/2: 'quests that don't have any combat, you shouldn't be getting
       as much batteries... every time we had to pay for someone to get killed'): a job FOR killing pays every fight it brings at the
       fight's price and never under its old pay; a walk, a delivery or a search pays its hours and the chance it turns bloody, and
       only the quiet floor under it, so it pays clearly less, still over the crew's cost an hour */
    var VI = v('violence', {}), violent = fights >= (VI.min_fights != null ? VI.min_fights : 0.5);
    var time = hours * cost * (1 + margin), fight = (fights + risk) * perFight * sm;
    var floor = violent ? Math.max(s * v('floor_per_skull', 30), offer.before | 0) : s * (VI.quiet_floor_per_skull != null ? VI.quiet_floor_per_skull : 10);
    var pay = Math.max(floor, Math.ceil(time + fight - 1e-9)),   /* rounded up, so no job misses the bar by a rounding */
        floored = pay === floor && time + fight < floor, all = fights + risk;
    return { id: offer.id, kind: name, skulls: s, pay: pay, before: offer.before != null ? offer.before : s * 30, violent: violent,
      hours: Math.round(hours * 10) / 10, fights: Math.round(all * 100) / 100, risk: Math.round(risk * 100) / 100, heads: heads, time: Math.round(time * 10) / 10, fight: Math.round(fight * 10) / 10,
      floored: floored,
      why: (violent ? 'killing work: ' : 'no killing: ') + (Math.round(hours * 10) / 10) + ' h x ' + Math.round(cost * (1 + margin) * 100) / 100 + ' + ' +
        (heads ? heads + ' heads / ' + packSize + ' a fight' : (Math.round(all * 100) / 100) + (all === 1 ? ' fight' : ' fights') + (risk && !violent ? ' (the chance)' : '')) +
        ' x ' + perFight + ' x ' + sm + (floored ? ', the ' + (violent ? 'floor ' : 'quiet floor ') + floor : '') };
  }
  /* what the offer says about the killing (job_pay.json violence words), from the baked table; '' when the job is not in it */
  function violenceWord(id) {
    var r = D && D.pays && D.pays[id], W = v('violence', {}).words || {};
    return r ? String((r.violent ? W.violent : W.quiet) || '') : '';
  }

  /* THE STANDING: the town's bar on the wiki's nine bands, and what each band does to the pay */
  function bandOf(score) {
    var B = (REL && REL.bands && REL.bands.value) || [];
    for (var i = 0; i < B.length; i++) if (score >= B[i].lo && score <= B[i].hi + 0.999) return B[i].id;
    return score < 50 ? 'hostile' : 'allied';
  }
  function standing(score) {
    var s = typeof score === 'number' && isFinite(score) ? score : 50, b = bandOf(s), T = v('standing', {}), row = T[b] || { mult: 1, word: '' };
    var m = +row.mult || 1;
    return { score: Math.round(s * 100) / 100, band: b, mult: m, pct: Math.round((m - 1) * 100), word: m === 1 ? '' : String(row.word || '') };
  }
  /* the place's bar as the town keeps it (bohemia.relations.v1, the settlement's own), drifted toward 50 since he was last
     there (the wiki's 0.25 a dawn) and with what is still on its way to it (bohemia.job.settled.v1), so the phone, the
     board and the map read one number */
  function scoreOf(place, day) {
    var start = (REL && REL.start && REL.start.value) || 50, s = start, rec = null;
    if (typeof localStorage === 'undefined' || !place) return s;
    try { rec = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); } catch (e) {}
    var id = String(place);
    if (rec && rec.bars && typeof rec.bars[id] === 'number') {
      s = rec.bars[id];
      var last = rec.seen && rec.seen[id], d = (REL && REL.drift && REL.drift.value) || { toward: 50, per_dawn: 0.25 };
      if (typeof last === 'number' && typeof day === 'number' && day > last) {
        var n = day - last, t = d.toward;
        s = s < t ? Math.min(t, s + n * d.per_dawn) : Math.max(t, s - n * d.per_dawn);
      }
    }
    try {
      var q = JSON.parse(localStorage.getItem('bohemia.job.settled.v1') || '[]') || [], A = (REL && REL.acts) || {};
      var F = { civilian_contract_done: 10, civilian_contract_poor: 5, fail_civilian_contract: -20, cancel_contract: -10 };
      q.forEach(function (c) { if (c && c.place === id) { var a = A[c.act]; s = Math.max(0, Math.min(100, s + (a ? +a.value : (F[c.act] || 0)))); } });
    } catch (e) {}
    return Math.round(s * 100) / 100;
  }
  function at(place, day) { return standing(scoreOf(place, day)); }
  /* a base pay at a place: the standing's multiplier on it, never under one */
  function bend(pay, st) { return Math.max(1, Math.round((pay | 0) * ((st && st.mult) || 1))); }

  var api = { base: base, violenceWord: violenceWord, standing: standing, scoreOf: scoreOf, at: at, bend: bend, bandOf: bandOf, kindOf: kindOf,
    data: function () { return D; }, set: function (d, rel) { if (d) D = d; if (rel) REL = rel; } };
  if (NODE) module.exports = api; else root.BohemiaJobPay = api;
})(typeof window !== 'undefined' ? window : this);

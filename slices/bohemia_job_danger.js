/* THE JOB TELLS THE TRUTH, IN BLOOD (WORLD [the job tells the truth, in blood], 10/26/26, rule 208; sharpens 146(b) and 192).
   PAOLO 10/25: 'make sure on the job the stars are red, and the button itself looks bloody depending on how difficult the job is,
   especially if it's gonna be super overpowered like wolves... I did a couple two-star quests... that's one of the weak points of
   Battle Brothers, not really accurate, so try to be accurate... depending on the chance of an encounter and how dangerous the
   encounters are... the button looking like some Crashbox blood filter.'
   MEASURED FIRST (EYES, line 114 of his list, BUILDS 10/25w and x): two beasts read 'SOME' and killed the Lone Wolf alone on day
   one; eight raiders 'MANY' against the Block Watch's twelve won with three dead, and the same job taken again wiped; the meet card
   said '4 MEN' for two beasts. The stars were the contract's skulls on the company's strength (53acbf78), Battle Brothers' way, and
   Battle Brothers' way is the weak point he named: they never asked what the fight does to HIS men as they stand.
   NOW A JOB'S STARS ARE PLAYED, NOT GUESSED:
     (a) THE FIGHTS. Every fight the job brings (BohemiaJobKinds.fightsOf: the sure ones as the yes would make them, a twist's at its
         rate) and the road's (the trip's hours at the map's measured rate of a crew that comes for him on the road, job_danger.json).
     (b) EACH ROLLED BY THE FIGHT'S OWN MATH. The fight's rules are read out of BOHEMIA_FIGHT.html itself (its fight-data and
         fight-rules scripts, never a copy, so COMBAT TWO's AUTO brain gets better here the moment it lands there): its setup deals
         the band (the road's faction, a tougher faction's fewer men, the graveyard's dead, the first day's line), and that band is
         what the fight deals (party.band, carried by the shell's door), so the meet card counts what stands on the board.
     (c) EACH PLAYED ON AUTO against his crew as the fight's door would hand it today (the shell's own nfOpts: who is able, who is
         laid up, the line, what each man wears), in a worker, off the frames. RULE 254 (Paolo 10/26: 'I hope it is using the same
         calculator as the auto combat... it should be max bloody if you think I would lose members or members would fall, the same
         as when the combat calculator turns red'): ONE CALCULATOR, ONE SCALE. Each run is worth what the AUTO button counts it (the
         fight's own oddsRunValue: a clean win 1, men down half the share still standing, a death or a loss 0) and the job's number
         is their plain mean, as the AUTO colour's is; 208(a)'s 'one in six laid up is clean' (the coordinator's, 10/26) is STRUCK.
     (d) THE TRIP'S NUMBER is the product over the fights of (1 - p x (1 - worth)): for a job with one sure fight, that fight's own
         AUTO number. ON THE AUTO COLOUR'S OWN LINE (ours.odds_colour, read from the fight, never a copy): at or over its turn (0.8)
         AUTO is green: ONE star and clean tin; under it red: TWO stars and blood rising on the same line; at or under down_value
         (0.5: the run the calculator expects has a man down or dead) the deepest blood and THREE stars.
     (e) THE BLOOD is that number on one continuous scale, painted on the job's button on the town's board, the offer and the
         phone's card: Crashbox clay (UI's kit takes the number straight, rule 254).
     (f) WORKED OUT AGAIN WHEN HIS CREW CHANGES: the read is keyed on the crew the door would hand over; a hire, a death, a man laid
         up, a new coat and it reads again the next time he looks.
   Gate: gates/the_job_tells_the_truth_gate.js. Loaded by BOHEMIA_CITY_WORLD.html. */
(function (root) {
  'use strict';
  var CFG = { runs: 32, prior: 0, cut_one: 0.8, cut_three: 0.5, road_per_hour: 0.0038, blood_from: 0.2, blood_full: 0.5, steps: 6000, slice_ms: 6, stop_from: 12, stop_below: 0.2, near_cut: 0.12, runs_more: 32, runs_max: 96 };
  var BASE = (function () {
    try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/[^\/]*$/, ''); } catch (e) {}
    try { return new URL('.', document.baseURI).href; } catch (e) {}
    return '';
  })();
  try { fetch(BASE + '../records/target/bb/job_danger.json').then(function (r) { return r.json(); }).then(function (j) {
    Object.keys(j || {}).forEach(function (k) { if (j[k] && typeof j[k] === 'object' && 'value' in j[k] && CFG.hasOwnProperty(k) && !(CFG.from_fight && LINES[k])) CFG[k] = j[k].value; }); CFG.loaded = true; }).catch(function () {}); } catch (e) {}
  /* RULE 254: these four are the AUTO colour's own lines; once the fight's rules are read, the fight's numbers stand (the file's copy
     is for a modder's eye and the kit's first paint, and the gate holds the two equal) */
  var LINES = { cut_one: 1, cut_three: 1, blood_from: 1, blood_full: 1 };

  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function ls(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function say(ev, d) { try { root.dispatchEvent(new CustomEvent(ev, { detail: d })); } catch (e) {} }

  /* ---------- THE FIGHT'S OWN RULES, out of the fight's own page ---------- */
  var SRC = null, SRC_P = null, MAIN = null, MAIN_P = null, W = undefined, WERR = null, ROLLN = 0;
  function source() {
    if (SRC_P) return SRC_P;
    /* __ONE_DEPLOY__ (COMBAT [the fight is broken live], a marked line in WORLD's file): the fight's page asked fresh, as its loadAll now
       asks its rules fresh, so the stars never play an old fight against new rules or the other way round (GitHub Pages lets a phone
       keep any file ten minutes) */
    SRC_P = fetch(BASE + 'BOHEMIA_FIGHT.html', { cache: 'no-cache' }).then(function (r) { return r.text(); }).then(function (h) {
      var grab = function (id) { var m = h.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>')); if (!m) throw new Error('the fight has no ' + id); return m[1]; };
      var orv = h.match(/function oddsRunValue\(E\) \{[\s\S]*?\n\}/);
      if (!orv) throw new Error('the fight has no oddsRunValue');
      SRC = { data: grab('fight-data'), rules: grab('fight-rules'), orv: orv[0] };
      return SRC;
    });
    return SRC_P;
  }
  /* the same rules in this window, for the band (a roll is a deal, a couple of milliseconds) and for a phone with no worker */
  function engine() {
    if (MAIN_P) return MAIN_P;
    MAIN_P = source().then(function (s) {
      var mk = new Function(s.data + '\n' + s.rules + '\n' + s.orv + '\nreturn { F: FIGHT, DB: DB, R: R, loadAll: loadAll, seed: function (v) { SEED = v >>> 0; }, run: oddsRunValue };');
      var E = mk();
      /* the fight's loadAll reads its files relative to the page; this page sits beside the fight in slices/ */
      return E.loadAll().then(function () {
        /* RULE 254: the stars' lines are the AUTO colour's own (ours.odds_colour.turn and down_value), read from the fight's rules */
        try { var OC = E.R('ours.odds_colour'); if (OC && OC.turn > 0 && OC.down_value < OC.turn) { CFG.cut_one = OC.turn; CFG.cut_three = OC.down_value;
          CFG.blood_from = +(1 - OC.turn).toFixed(6); CFG.blood_full = +(1 - OC.down_value).toFixed(6); CFG.from_fight = true; } } catch (e) {}
        MAIN = E; say('bohemia-job-danger', { engine: true }); pump(); return E; });
    }).catch(function (e) { WERR = String(e && e.message || e); MAIN_P = null; SRC_P = null; return null; });
    return MAIN_P;
  }
  function workerMain() {
    var JOB = null;
    var CH = new MessageChannel(), NEXT = []; CH.port1.onmessage = function () { var f = NEXT.shift(); if (f) f(); };
    var soon = function (f) { NEXT.push(f); CH.port2.postMessage(0); };
    self.onmessage = function (m) {
      var d = m.data;
      if (d.db) { Object.keys(d.db).forEach(function (k) { DB[k] = d.db[k]; }); return; }
      if (d.ls) { LSV = d.ls; return; }
      JOB = { id: d.id, opts: d.opts, seed: d.seed >>> 0, runs: d.runs, steps: d.steps, stopFrom: d.stopFrom, stopBelow: d.stopBelow, cuts: d.cuts || [], near: d.near || 0, more: d.more || 0, max: d.max || d.runs, n: 0, sum: 0, clean: 0, won: 0, down: 0, dead: 0, hung: 0 };
      var id = d.id; soon(function () { run(id); });
    };
    function run(id) {
      var J = JOB; if (!J || J.id !== id) return;
      try {
        SEED = (J.seed + J.n * 7919) >>> 0;
        FIGHT.setup(J.opts);
        var g = 0; while (!FIGHT.S.over && g <= J.steps) { var v = FIGHT.current(); if (!v) break; FIGHT.aiStep(v); FIGHT.S.events = []; g++; }
        var w = FIGHT.S.over ? oddsRunValue(FIGHT) : 0;   /* the AUTO button's own count (rule 254) */
        if (!FIGHT.S.over) J.hung++;
        if (FIGHT.S.result === 'won') J.won++;
        J.sum += w; if (w === 1) J.clean++;
        FIGHT.S.units.forEach(function (u) { if (u.side === 'you') { if (u.dead) J.dead++; else if (u.down) J.down++; } });
        J.n++;
      } catch (e) { self.postMessage({ id: id, broke: String(e && e.message || e) }); JOB = null; return; }
      var lost = J.stopFrom && J.n >= J.stopFrom && J.sum / J.n < J.stopBelow;
      /* a read that lands where the blood rises (between the lines, near_cut either side) plays on, 32 at a time, to runs_max: there a
         few plays move the blood a stage (measured 10/26: on 32 plays the blood missed the 100-play truth by a third of its scale on 1
         job in 20); outside it the button is clean or soaked whatever the next plays say */
      if (J.n === J.runs && !lost && J.more && J.runs < J.max) { var c = J.sum / J.n; if (J.near && c > Math.min.apply(null, J.cuts) - J.near && c < Math.max.apply(null, J.cuts) + J.near) J.runs = Math.min(J.max, J.runs + J.more); }
      if (J.n < J.runs && !lost) soon(function () { run(id); });
      else { self.postMessage({ id: id, runs: J.n, sum: J.sum, clean: J.clean, won: J.won, down: J.down, dead: J.dead, hung: J.hung }); JOB = null; }
    }
  }
  function worker() {
    if (W !== undefined) return W;
    W = false;
    if (!MAIN || !SRC || typeof Worker === 'undefined' || typeof Blob === 'undefined' || root.__JOB_DANGER_NO_WORKER) return W;
    try {
      var src = 'var LSV = {}; var localStorage = { getItem: function (k) { return LSV[k] === undefined ? null : LSV[k]; }, setItem: function () {}, removeItem: function () {} };\n' +
        SRC.data + '\n' + SRC.rules + '\n' + SRC.orv + '\n(' + workerMain.toString() + ')();';
      var w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
      var db = {}; Object.keys(MAIN.DB).forEach(function (k) { if (k !== 'read') db[k] = MAIN.DB[k]; });
      w.onmessage = heard;
      w.onerror = function (e) { if (e && e.preventDefault) e.preventDefault(); WERR = String(e && e.message || 'worker'); W = false; if (BUSY) { BUSY.viaWorker = false; } pump(); };
      w.postMessage({ db: db });
      W = w;
    } catch (e) { W = false; WERR = String(e && e.message || e); }
    return W;
  }

  /* ---------- THE BAND, ROLLED BY THE FIGHT'S OWN SETUP ---------- */
  function metNow() { return Number(ls('bohemia.fight.met.v1', 0)) || 0; }
  function dayNow() { try { return loopDay() | 0; } catch (e) { return 1; } }
  function crewNow() { try { return crewCount() | 0; } catch (e) { return 3; } }
  function districtAt(at) { try { var t = om.at(at[0] | 0, at[1] | 0); return t ? t.district : null; } catch (e) { return null; } }
  /* party {count, faction, days, difficulty} -> { band: [enemy ids], faction, count }; ctx {key, district} */
  function roll(party, ctx) {
    var E = MAIN; if (!E || !party || !(party.count > 0)) return null;
    ctx = ctx || {};
    var P = { count: party.count | 0, faction: party.faction || 'brigands', days: party.days | 0 || 1, difficulty: party.difficulty | 0, act: party.act };
    /* the first game day's line (RUN's __EVERY_FIGHT_SIZED_TO_THE_CREW__, the shell's door holds the same): the company plus one */
    var cn = crewNow(); if (dayNow() <= 1 && cn > 0 && P.count > cn + 1) { P.count = cn + 1; P.dayOneCap = true; }
    /* the board under the roll is dealt from the seed alone (no district), so the band is the same wherever he meets it; only the
       graveyard's ground deals its own dead */
    var gy = false; try { gy = !!ctx.district && E.F.isGraveyard({ district: ctx.district }); } catch (e) {}
    var o = { auto: true, formation: null, party: P, met: metNow(), district: gy ? ctx.district : null, act: P.act };
    ROLLN++;   /* a roll deals on the same rules a phone's slices play on: the slice in flight starts its run again */
    try {
      E.seed(seedOf('band:' + (ctx.key || '') + ':' + P.count + ':' + P.faction));
      E.F.setup(o);
      var band = E.F.S.units.filter(function (u) { return u.side === 'them'; }).map(function (u) { return u.kind; });
      var fac = E.F.S.roadFaction || (E.F.isGraveyard(o) ? E.R('ours.graveyard').faction : P.faction);
      return { band: band, faction: fac, count: band.length, days: P.days, difficulty: P.difficulty, act: P.act, asked: party.count | 0 };
    } catch (e) { return null; }
  }
  /* what they are, in a word, from what stands: MEN, or the beasts by their own names */
  var KIND_WORDS = { direwolf: ['DIRE WOLF', 'DIRE WOLVES'], frenzied_direwolf: ['DIRE WOLF', 'DIRE WOLVES'], hyena: ['HYENA', 'HYENAS'], frenzied_hyena: ['HYENA', 'HYENAS'] };   /* draft:true */
  var FACTION_WORDS = { beasts: ['BEAST', 'BEASTS'], ghosts: ['DEAD ONE', 'DEAD'], machines: ['MACHINE', 'MACHINES'], kids: ['KID', 'KIDS'] };   /* draft:true */
  function kindWord(band, faction) {
    var n = band && band.length || 0; if (!n) return 'MEN';
    var words = band.map(function (id) { return KIND_WORDS[id] || null; });
    if (words.every(function (w) { return w; })) {
      var plural = {}; words.forEach(function (w) { plural[w[1]] = w; });
      var ks = Object.keys(plural);
      if (ks.length === 1) return n === 1 ? plural[ks[0]][0] : ks[0];
    }
    var F = FACTION_WORDS[faction]; if (F) return n === 1 ? F[0] : F[1];
    return n === 1 ? 'MAN' : 'MEN';
  }
  /* THE ONE DOOR: every encounter's party is rolled here before the meet card shows it (RUN's cityHandOver calls this first) */
  function rollInto(msg) {
    if (!msg || msg.type !== 'BOHEMIA_CITY_ENCOUNTER' || !msg.party || typeof msg.party !== 'object' || Array.isArray(msg.party)) return false;
    if (Array.isArray(msg.party.band) && msg.party.band.length) return true;
    if (!MAIN) { engine(); return false; }
    var at = (msg.at && msg.at.gx != null) ? [msg.at.gx | 0, msg.at.gy | 0] : null;
    if (!at) { try { at = [city.x, city.y]; } catch (e) { at = [0, 0]; } }
    if (!msg.district) msg.district = districtAt(at);
    var r = roll(msg.party, { key: String(msg.why || msg.label || 'encounter') + ':' + (msg.party.count | 0), district: msg.district });
    if (!r || !r.band.length) return false;
    msg.party.band = r.band; msg.party.count = r.band.length; msg.party.faction = r.faction; msg.party.rolled = true;
    msg.party.what = kindWord(r.band, r.faction);
    try { msg.party.word = partyWord(r.band.length); } catch (e) {}
    var beast = r.faction === 'beasts' || r.band.every(function (id) { return !!KIND_WORDS[id]; });
    msg.roster = r.band.map(function () { return { arch: beast ? 'beast' : 'human' }; });
    root.__JOB_ROLLED = { why: msg.why || null, asked: r.asked, band: r.band.slice(), faction: r.faction, what: msg.party.what, at: Date.now() };
    return true;
  }

  /* ---------- HIS CREW AS IT STANDS: the fight's own door ---------- */
  var CREW_K = { at: 0, key: null };
  function doorOpts(party, at) {
    var d = { world: { day: dayNow(), night: (function () { try { return !!isNight(); } catch (e) { return false; } })() }, district: districtAt(at || [0, 0]),
      party: party, crewCount: crewNow(), firstDay: dayNow() <= 1 };
    var o = null, P = null;
    try { P = root.parent && root.parent !== root ? root.parent : null; } catch (e) { P = null; }
    if (P) try {
      if (typeof P.nfOpts === 'function') {
        /* the door is asked, never walked through: what it keeps of a hand-over is put back as it was */
        var nfDay = P.NF ? P.NF.day : undefined, handed = P.__NF_HANDED;
        o = P.nfOpts(d);
        if (P.NF) P.NF.day = nfDay; P.__NF_HANDED = handed;
      }
    } catch (e) { o = null; }
    if (!o) {   /* the map alone (a checker's page): the origin's men */
      o = { kind: null, company: null, party: null };
      try { var st = LOOP.start || {}; if (st.company) { o.company = st.company.slice(0, Math.max(1, crewNow())); o.cap = st.cap; } } catch (e) {}
      if (party) o.party = { count: party.band ? party.band.length : party.count, band: party.band, faction: party.faction, days: party.days, difficulty: party.difficulty, rolled: true };
    }
    o.auto = true; o.odds = false; o.met = 0; o.deploy = false;
    return JSON.parse(JSON.stringify(o));
  }
  /* the crew the door would hand over, as a key: a hire, a death, a man laid up or healed, a new coat, a new line. Never stale:
     the door is asked again whenever anything it reads has changed (measured 10/26: a key kept for a second and a half let fifty
     reads made the moment the crew changed reuse the old crew's plays) */
  var CREW_SRC = ['bohemia.company.v1', 'bohemia.company.line.v1', 'bohemia.hired.v1', 'bohemia.walked.v1', 'bohemia.taken.v1', 'bohemia.fight.after.v1', 'bohemia.fight.formation.v1'];
  function crewSig() {
    var s = dayNow() + '|' + crewNow(); try { s += '|' + JSON.stringify((LOOP.start && LOOP.start.company) || null); } catch (e) {}
    for (var i = 0; i < CREW_SRC.length; i++) s += '|' + ls(CREW_SRC[i], '');
    try { var P = root.parent && root.parent !== root ? root.parent : null; if (P && P.BOH_START && P.BOH_START.picks) s += '|' + JSON.stringify(P.BOH_START.picks()); } catch (e) {}
    return seedOf(s);
  }
  function crewKey() {
    var sig = crewSig(); if (CREW_K.key && CREW_K.sig === sig) return CREW_K.key;
    var o = doorOpts(null, null), c = o.company || [];
    var k = dayNow() + '|' + (o.cap | 0) + '|' + c.map(function (m) { var g = m && m.gear || {}; return [m && m.name, m && m.level, m && m.background, g.main, g.off, g.body, g.head, (m && m.perks || []).length].join(','); }).join(';') +
      '|' + JSON.stringify(o.formation || ls('bohemia.fight.formation.v1', ''));
    CREW_K = { sig: sig, key: String(seedOf(k)) };
    return CREW_K.key;
  }

  /* ---------- THE READS: one job's fights, played ---------- */
  var READS = {}, FIGHTS = {}, Q = [], BUSY = null, JOBN = 0, PLAYED = {}, LAST = {};   /* LAST: the latest finished read of a job at a place, any crew */
  function townOf(place) { try { return BohemiaJobKinds.realPlace(place); } catch (e) { return null; } }
  /* the fights a job (an offer at a place, or a job he holds) brings, each rolled: [{ what, p, band, faction, key }] */
  function fightsFor(o, place) {
    if (!root.BohemiaJobKinds || !BohemiaJobKinds.fightsOf) return null;
    var held = !!(o && o.plays), job = held ? o : null;
    if (!job) { var t = townOf(place); if (!t) return null; job = BohemiaJobKinds.plan(o, { name: t.name, x: t.x, y: t.y }); }
    if (!job) return null;
    var list = BohemiaJobKinds.fightsOf(job, held ? {} : { offer: o, place: place });
    if (!list) return null;
    return list.map(function (f) {
      var party = null; try { party = f.road ? partyMath('roaming', { x: f.at ? f.at.x : 0, y: f.at ? f.at.y : 0 }) : partyMath('job', { skulls: job.skulls }); } catch (e) { party = { count: f.n, days: 1, difficulty: 1 }; }
      party = { count: f.n, faction: f.faction || 'brigands', days: party.days, difficulty: party.difficulty };
      var at = f.at ? [f.at.x | 0, f.at.y | 0] : null, why = f.why || (f.road ? 'road:' + o.id : 'contract:' + o.id + ':' + f.what);   /* the hand-over's own why, so the band read is the band met */
      var r = roll(party, { key: why + ':' + f.n, district: at ? districtAt(at) : null });
      return r ? { what: f.what, why: why, n: f.n, p: f.p, band: r.band, faction: r.faction, days: r.days, difficulty: r.difficulty, at: at, road: !!f.road, hours: f.hours } : null;
    }).filter(Boolean);
  }
  function readKey(o, place) { return String(o && o.id) + '@' + String(place || (o && o.from) || '') + (o && o.plays ? ':held:' + (o.stage || '') + ':' + (o.wave | 0) + ':' + (o.got | 0) + ':' + ((o.ambush || []).length) + ':' + (o.bands | 0) + ':' + (o.holders ? o.holders.n : '') : ''); }
  function fightBase(f, ck) { return ck + '|' + f.band.join(',') + '|' + f.faction + '|' + (f.days | 0) + '|' + (districtAt(f.at || [0, 0]) || ''); }
  /* A SURE FIGHT NEVER BORROWS A LIGHT READ (measured 10/26, rule 254's gate): a job's sure fight and its road fight often share a
     band and a district, and whichever was queued first set the plays: the road's, 8 plays and no playing on, so most sure fights
     were read on 8 (7 of 8 = 0.875 where 100 plays said 0.77). A fight that comes for sure is read full; a fight that only might
     come takes a full read of its band when there is one, else its own light one */
  function fightKey(f, ck, sure) { var b = fightBase(f, ck); if (f.p >= 0.25) return b + '|full';
    return (sure && sure[b]) || (PLAYED[b + '|full'] && !PLAYED[b + '|full'].broke) || FIGHTS[b + '|full'] ? b + '|full' : b + '|light'; }
  function combine(R) {
    var clean = 1, n = 0, all = true, broke = null;
    R.fights.forEach(function (f) {
      var P = PLAYED[f.fk]; if (P && P.broke) broke = P.broke; if (!P || !P.runs) { all = false; return; }
      /* A RUN IS WORTH WHAT THE AUTO BUTTON COUNTS IT (rule 254: one calculator, one scale): the fight's oddsRunValue, and the
         fight's number is the plain mean of its runs, as the AUTO colour's is (prior 0, job_danger.json) */
      var c = (P.sum + CFG.prior) / (P.runs + 2 * CFG.prior);
      f.clean = c; f.runs = P.runs; f.won = P.won;
      clean *= 1 - f.p * (1 - c); n += P.runs;
    });
    if (broke) { R.state = 'broke'; R.broke = broke; return false; }   /* a copy that cannot play reads nothing: the skulls stay */
    if (!all) return false;
    R.clean = clean; R.danger = 1 - clean; R.runs = n; R.state = 'read';
    R.stars = clean >= CFG.cut_one ? 1 : clean <= CFG.cut_three ? 3 : 2;
    R.blood = bloodOf(R.danger);
    if (R.base) LAST[R.base] = { stars: R.stars, danger: R.danger, clean: R.clean, blood: R.blood, crew: R.crew };
    return true;
  }
  /* the read for an offer at a place, or a held job: null until it can start; {state:'reading'} until every fight is played */
  function read(o, place) {
    if (!o || !o.id) return null;
    if (!MAIN) { engine(); return null; }
    var ck = crewKey(), rk = readKey(o, place) + '|' + ck + '|' + dayNow();
    var R = READS[rk];
    if (R) { if (R.state !== 'read' && combine(R)) paintAll(R); return R; }
    var fs = null; try { fs = o.__fights ? o.__fights.map(function (f) { return Object.assign({}, f, { band: f.band.slice() }); }) : fightsFor(o, place); } catch (e) { fs = null; }
    if (!fs) return null;
    var base = readKey(o, place);
    R = READS[rk] = { key: rk, base: base, prev: LAST[base] || null, id: o.id, place: place || o.from || null, crew: ck, fights: fs, state: 'reading', at: Date.now(), els: [] };
    var ks = Object.keys(READS); if (ks.length > 400) ks.sort(function (a, b) { return READS[a].at - READS[b].at; }).slice(0, ks.length - 400).forEach(function (k) { if (READS[k].state !== 'reading') delete READS[k]; });
    /* what he is looking at now goes first: a fight asked for again moves to the front of the line */
    fs.forEach(function (f) { f.opts = doorOpts({ count: f.band.length, band: f.band, faction: f.faction, days: f.days, difficulty: f.difficulty }, f.at); });   /* the hand-over each fight is played with, fixed with the read */
    var sure = {}; fs.forEach(function (f) { if (f.p >= 0.25) sure[fightBase(f, ck)] = 1; });
    fs.slice().reverse().forEach(function (f) { f.fk = fightKey(f, ck, sure);
      if (!PLAYED[f.fk] && !FIGHTS[f.fk]) { FIGHTS[f.fk] = { fk: f.fk, f: f, reads: [rk] }; Q.unshift(f.fk); }
      else if (FIGHTS[f.fk]) { FIGHTS[f.fk].reads.push(rk); if (f.p >= 0.25 && !(FIGHTS[f.fk].f.p >= 0.25)) FIGHTS[f.fk].f = f; var qi = Q.indexOf(f.fk); if (qi > 0) { Q.splice(qi, 1); Q.unshift(f.fk); } } });
    if (!fs.length) { R.clean = 1; R.danger = 0; R.stars = 1; R.blood = 0; R.state = 'read'; R.runs = 0; }
    else if (combine(R)) {}
    pump();
    return R;
  }
  function pump() {
    if (BUSY || !Q.length || !MAIN) return;
    var fk = Q.shift(), F = FIGHTS[fk]; if (!F) return pump();
    var f = F.f, opts = f.opts || doorOpts({ count: f.band.length, band: f.band, faction: f.faction, days: f.days, difficulty: f.difficulty }, f.at);
    /* a fight that only might come (the road's, a twist's) weighs little in the product: fewer plays; a fight that is plainly lost
       stops early (under stop_below after stop_from plays: any job with it in is three stars whatever the rest) */
    var full = /\|full$/.test(fk), runs = full ? (CFG.runs | 0 || 32) : Math.max(8, Math.round((CFG.runs | 0 || 32) / 4));   /* the key says full or light */
    var job = { id: ++JOBN, fk: fk, opts: opts, seed: seedOf('runs:' + fk), runs: runs, steps: CFG.steps, stopFrom: CFG.stop_from, stopBelow: CFG.stop_below,
      cuts: [CFG.cut_one, CFG.cut_three], near: full ? CFG.near_cut : 0, more: CFG.runs_more, max: full ? Math.max(runs, CFG.runs_max | 0) : runs, t0: Date.now() };
    BUSY = job;
    var w = worker();
    if (w) { job.viaWorker = true; w.postMessage({ ls: { 'bohemia.fight.formation.v1': ls('bohemia.fight.formation.v1', null) } }); w.postMessage(job); }
    else { job.viaWorker = false; job.n = 0; job.sum = 0; job.clean = 0; job.won = 0; job.down = 0; job.dead = 0; job.hung = 0; setTimeout(slice, 0); }
  }
  /* a phone with no worker: the frames' slices, the AUTO button's own way (six milliseconds a frame) */
  function slice() {
    var J = BUSY; if (!J || J.viaWorker) return;
    var E = MAIN, t0 = performance.now();
    try {
      while (performance.now() - t0 < CFG.slice_ms && J.n < J.runs && !(J.stopFrom && J.n >= J.stopFrom && J.sum / J.n < J.stopBelow)) {
        if (J.live && J.rolln !== ROLLN) J.live = false;
        if (!J.live) { E.seed((J.seed + J.n * 7919) >>> 0); E.F.setup(J.opts); J.live = true; J.g = 0; J.rolln = ROLLN; }
        var v = E.F.current();
        if (E.F.S.over || !v || J.g > J.steps) {
          var w = E.F.S.over ? E.run(E.F) : 0; if (!E.F.S.over) J.hung++;
          if (E.F.S.result === 'won') J.won++; J.sum += w; if (w === 1) J.clean++;
          E.F.S.units.forEach(function (u) { if (u.side === 'you') { if (u.dead) J.dead++; else if (u.down) J.down++; } });
          J.n++; J.live = false; continue;
        }
        E.F.aiStep(v); E.F.S.events = []; J.g++;
      }
    } catch (e) { done(J, { broke: String(e && e.message || e) }); return; }
    var lost = J.stopFrom && J.n >= J.stopFrom && J.sum / J.n < J.stopBelow;
    if (J.n >= J.runs && !lost && J.more && J.runs < J.max) { var c = J.sum / J.n; if (J.near && c > Math.min.apply(null, J.cuts) - J.near && c < Math.max.apply(null, J.cuts) + J.near) { J.runs = Math.min(J.max, J.runs + J.more); setTimeout(slice, 16); return; } }
    if (J.n >= J.runs || lost) done(J, { runs: J.n, sum: J.sum, clean: J.clean, won: J.won, down: J.down, dead: J.dead, hung: J.hung });
    else setTimeout(slice, 16);
  }
  function heard(m) { var d = m.data, J = BUSY; if (!J || !d || d.id !== J.id) return; done(J, d); }
  function done(J, d) {
    BUSY = null;
    var F = FIGHTS[J.fk]; delete FIGHTS[J.fk];
    PLAYED[J.fk] = d.broke ? { runs: 0, broke: d.broke } : { runs: d.runs, sum: d.sum, clean: d.clean, won: d.won, down: d.down, dead: d.dead, hung: d.hung, ms: Date.now() - J.t0, worker: !!J.viaWorker };
    if (d.broke) WERR = d.broke;
    /* a checker's own setting (rule 192(c)): keep the hand-over and the dice each fight was played on, so the stars gate can replay the
       page's own plays with the fight's own count and get the page's own number back */
    if (root.__JOB_DANGER_KEEP && !d.broke) { PLAYED[J.fk].opts = J.opts; PLAYED[J.fk].seed = J.seed; PLAYED[J.fk].steps = J.steps; PLAYED[J.fk].formation = ls('bohemia.fight.formation.v1', null); }
    if (F) F.reads.forEach(function (rk) { var R = READS[rk]; if (R && R.state !== 'read' && combine(R)) { paintAll(R); say('bohemia-job-danger', { id: R.id, place: R.place, stars: R.stars, danger: R.danger }); } });
    pump();
  }

  /* ---------- WHAT HE SEES: red stars, and the button bleeds ---------- */
  /* the blood on the AUTO colour's line (rule 254(b)): none at or over its turn (AUTO green: danger at or under blood_from, one less
     the turn), rising from the first red, the deepest at or under down_value (danger blood_full: the run the calculator expects has
     a man down or dead). UI's kit reads the same two numbers (cfg()) for a button that only carries the danger */
  function bloodOf(danger) { var a = CFG.blood_from, b = CFG.blood_full; return Math.max(0, Math.min(1, (danger - a) / Math.max(1e-6, b - a))); }
  /* the stars for a job: its read when it is in, else null (the caller keeps its skulls until then, drawn as reading) */
  /* a peek: the stars only once something on the glass asked for the read (bleed), never a read for every ask in the valley */
  function peek(o, place) {
    if (!o || !o.id || !MAIN) return null;
    var ck = crewKey(), rk = readKey(o, place) + '|' + ck + '|' + dayNow(), R = READS[rk];
    if (R && R.state !== 'read' && combine(R)) paintAll(R);
    return R || null;
  }
  function stars(o, place) { var R = peek(o, place); return R && R.state === 'read' ? R.stars : null; }
  var STAGES = 6, CSS_DONE = {}, RIM = '1px 0 0 #efe6d0, -1px 0 0 #efe6d0, 0 1px 0 #efe6d0, 0 -1px 0 #efe6d0, 1px 1px 0 #efe6d0, -1px -1px 0 #efe6d0, 1px -1px 0 #efe6d0, -1px 1px 0 #efe6d0';
  function css(doc) {
    if (CSS_DONE[doc.__jdid || (doc.__jdid = Math.random())]) return; CSS_DONE[doc.__jdid] = 1;
    var u = BASE + 'job_blood/', s = '.jdblood{position:absolute;inset:0;pointer-events:none;z-index:-1;border-radius:inherit;background-repeat:no-repeat;background-size:100% 100%;image-rendering:pixelated}';
    ['n', 'm', 'w'].forEach(function (k) { for (var i = 0; i < STAGES; i++) {
      s += '@keyframes jdh' + k + i + '{0%{background-image:url(' + u + k + i + 'a.png)}50%{background-image:url(' + u + k + i + 'b.png)}}';
      s += '.jdblood.' + k + i + '{background-image:url(' + u + k + i + 'a.png);animation:jdh' + k + i + ' 1s steps(1) infinite}';   /* the clay holds a beat and re-poses, stop-motion (rule 115(d)) */
    } });
    /* WORLD [eyes: the normie hour, world] F28 (EYES round four: 'after a hire or a fight every star on the board sits cream on cream
       for about 40 s while the calculator replays, with nothing said'): a job being read keeps the stars and blood of its last read
       (the crew before) and the stars pulse on the beat, two held poses, until the new read lands; a job never read pulses its own */
    s += '@keyframes jdread{0%{opacity:.95}50%{opacity:.5}}';
    s += '.jdreading .bmstars,.jdreading[data-job-stars]{animation:jdread 1s steps(1) infinite}';
    s += 'html body .jdheavy.jdheavy *{text-shadow:' + RIM + '!important}';   /* the words stay readable through the clay: a hard pixel of bone round each letter, never a glow */
    var st = doc.createElement('style'); st.id = 'jdbloodcss'; st.textContent = s; (doc.head || doc.documentElement).appendChild(st);
  }
  /* the blood on one button: two stages crossfaded, darker as it goes, one continuous scale */
  function paintBlood(el, b) {
    var doc = el.ownerDocument;
    /* __ONE_BLOOD__ (UI [the blood is CRASHBOX], 11da2b8c, a marked line in WORLD's file; rule 208(c) and the coordinator's NOTE:
       'the blood as one continuous crashbox layer... so WORLD only passes the danger number'): where the page carries the UI
       kit's clay layer (slices/bohemia_ui_materials.js bleed), the read's number goes to it and nothing else is drawn here, so a
       button wears ONE blood. data-blood stays this file's 0..1 number; the kit's stage is data-bm-blood. */
    var KM = doc.defaultView && doc.defaultView.BohemiaMaterials;
    if (KM && KM.bleed) { var old = el.querySelectorAll(':scope > i.jdblood'); for (var q = 0; q < old.length; q++) old[q].remove();
      el.classList.remove('jdheavy'); el.style.removeProperty('text-shadow'); el.dataset.blood = b.toFixed(3); KM.bleed(el, +el.dataset.danger, { blood: b }); return; }   /* the read's own blood number (rule 254) */
    css(doc);
    var cs = null; try { cs = doc.defaultView.getComputedStyle(el); } catch (e) {}
    if (cs && cs.position === 'static') el.style.position = 'relative';
    el.style.isolation = 'isolate';
    var L = el.querySelectorAll(':scope > i.jdblood');
    var lo = L[0], hi = L[1];
    if (!lo) { lo = doc.createElement('i'); lo.className = 'jdblood'; lo.setAttribute('aria-hidden', 'true'); el.insertBefore(lo, el.firstChild); }
    if (!hi) { hi = doc.createElement('i'); hi.className = 'jdblood'; hi.setAttribute('aria-hidden', 'true'); el.insertBefore(hi, lo.nextSibling); }
    /* x runs 0..STAGES: under 1 the first stage comes up out of nothing; past it each stage lies full under the next coming in */
    /* the clay rendered for the button's own shape (slices/job_blood: n 2.5 to 1, m 4 to 1, w 10 to 1), so a drip is never stretched */
    var bx = el.getBoundingClientRect(), asp = bx.height > 0 ? bx.width / bx.height : 4, sh = asp >= 6.5 ? 'w' : asp >= 3.2 ? 'm' : 'n';
    var x = Math.max(0, Math.min(1, b)) * STAGES, dark = 1 - 0.28 * Math.max(0, Math.min(1, b));
    if (x < 1) { lo.className = 'jdblood ' + sh + '0'; lo.style.opacity = x.toFixed(3); hi.className = 'jdblood ' + sh + '1'; hi.style.opacity = '0'; }
    else { var k = Math.min(STAGES - 1, Math.floor(x)); lo.className = 'jdblood ' + sh + (k - 1); lo.style.opacity = '1';
      hi.className = 'jdblood ' + sh + k; hi.style.opacity = (x >= STAGES ? 1 : x - k).toFixed(3); }
    el.dataset.bloodShape = sh;
    lo.style.filter = hi.style.filter = 'brightness(' + dark.toFixed(3) + ')';
    el.dataset.blood = b.toFixed(3);
    var heavy = b >= 0.3; el.classList.toggle('jdheavy', heavy);
    if (heavy) el.style.setProperty('text-shadow', RIM, 'important'); else el.style.removeProperty('text-shadow');
  }
  function redStars(el, n, doc) {
    var M = doc.defaultView && doc.defaultView.BohemiaMaterials, old = el.querySelector('[data-job-stars], .bmstars');
    var se = null; try { se = M && M.stars ? M.stars(n, { gap: 0, red: true }) : null; } catch (e) { se = null; }
    if (!se) { se = doc.createElement('span'); se.className = 'bmstars'; se.style.color = '#b3241a'; se.textContent = new Array(n + 1).join('★'); }
    se.dataset.jobStars = n; se.dataset.red = '1';
    if (old && old.parentNode) old.parentNode.replaceChild(se, old);
    return se;
  }
  function paintOne(el, R) {
    if (!el || !el.isConnected) return false;
    var host = el.__jdStars || el;
    if (R.state === 'read') {
      el.classList.remove('jdreading'); host.classList.remove('jdreading');
      if (+el.dataset.jdStars !== R.stars) { redStars(host, R.stars, el.ownerDocument); el.dataset.jdStars = R.stars; }
      el.dataset.danger = R.danger.toFixed(3); el.dataset.clean = R.clean.toFixed(3); delete el.dataset.jdPrev;
      paintBlood(el, R.blood);
    } else {
      host.classList.add('jdreading');
      if (R.prev) {   /* the last read stands, red, while this one plays (F28) */
        if (+el.dataset.jdStars !== R.prev.stars) { redStars(host, R.prev.stars, el.ownerDocument); el.dataset.jdStars = R.prev.stars; }
        el.dataset.danger = R.prev.danger.toFixed(3); el.dataset.jdPrev = '1';
        paintBlood(el, R.prev.blood);
      }
    }
    return true;
  }
  function paintAll(R) { R.els = R.els.filter(function (el) { return paintOne(el, R); }); }
  /* a surface hands its job button: the board's row, the offer's TAKE IT, the phone's card */
  function bleed(el, o, place, starsIn) {
    if (!el || !o) return null;
    if (starsIn) el.__jdStars = starsIn;
    var R = read(o, place);
    try { css(el.ownerDocument); } catch (e) {}
    if (!R) { el.classList.add('jdreading'); var tries = 0, again = function () { if (++tries > 60) return; var R2 = read(o, place); if (R2) { R2.els.push(el); paintSoon(el, R2, 0); } else setTimeout(again, 500); }; setTimeout(again, 500); return null; }
    R.els = R.els.filter(function (e) { return !e.__jdSeen || e.isConnected; });   /* a closed board's buttons are let go (rule 173: nothing held past its screen) */
    if (R.els.indexOf(el) < 0) R.els.push(el);
    paintSoon(el, R, 0);
    return R;
  }
  /* a surface builds its button before it puts it on the glass: paint it the moment it is there */
  function paintSoon(el, R, n) { if (el.isConnected) { el.__jdSeen = 1; paintOne(el, R); return; } if (n < 60) setTimeout(function () { paintSoon(el, R, n + 1); }, 50); }
  /* THE MEET CARD'S OWN READ: the band in front of him, played the same way (rule 151(e)'s stars against his company, now played) */
  function readParty(msg) {
    var p = msg && msg.party; if (!p || !Array.isArray(p.band) || !p.band.length) return null;
    var at = (msg.at && msg.at.gx != null) ? [msg.at.gx | 0, msg.at.gy | 0] : null;
    return { id: 'meet:' + String(msg.why || msg.label || '') + ':' + p.band.join(','), plays: 'meet',
      __fights: [{ what: 'meet', p: 1, band: p.band.slice(), faction: p.faction || 'brigands', days: p.days | 0 || 1, difficulty: p.difficulty | 0, at: at }] };
  }
  function state() {
    var rs = Object.keys(READS).map(function (k) { var R = READS[k]; return { id: R.id, place: R.place, state: R.state, stars: R.stars, danger: R.danger, clean: R.clean, blood: R.blood,
      fights: R.fights.map(function (f) { return { what: f.what, why: f.why, n: f.n, p: f.p, band: f.band.slice(), faction: f.faction, days: f.days, difficulty: f.difficulty, at: f.at, clean: f.clean, runs: f.runs, won: f.won, road: f.road }; }) }; });
    return { engine: !!MAIN, worker: !!W, err: WERR, queue: Q.length, busy: !!BUSY, played: Object.keys(PLAYED).length, reads: rs, cfg: CFG };
  }
  /* a checker's probe: the same hand-over played n times on this window's rules and in a fresh worker (the gate compares them) */
  function probe(opts, n, seed) {
    var E = MAIN; if (!E) return null; var sum = 0;
    for (var r = 0; r < n; r++) { E.seed((seed + r * 7919) >>> 0); E.F.setup(JSON.parse(JSON.stringify(opts)));
      var g = 0; while (!E.F.S.over && g <= CFG.steps) { var v = E.F.current(); if (!v) break; E.F.aiStep(v); E.F.S.events = []; g++; }
      sum += E.F.S.over ? E.run(E.F) : 0; }
    return sum / n;
  }
  root.BohemiaJobDanger = { probe: probe, played: function () { return PLAYED; }, engine: engine, ready: function () { return !!MAIN; }, roll: roll, rollInto: rollInto, kindWord: kindWord, read: read, peek: peek, stars: stars, readParty: readParty, fightsFor: fightsFor,
    bleed: bleed, bloodOf: bloodOf, crewKey: crewKey, doorOpts: doorOpts, state: state, cfg: function () { return CFG; } };
  try { if (document.readyState === 'complete') setTimeout(engine, 1200); else root.addEventListener('load', function () { setTimeout(engine, 1200); }); } catch (e) {}
})(typeof window !== 'undefined' ? window : this);

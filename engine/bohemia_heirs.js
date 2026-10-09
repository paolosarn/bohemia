// BOHEMIA HEIRS -- THE COMPANY INHERITS (10/1/26, DYNASTY lane)
// Board row [heirs] / THE-COMPANY-INHERITS. Rule 39d, three-acts law s11(c) and s12.
//
// HIS QUESTION (9/28): "do the people you hire also belong to the dynasty each act?
// 36 instead of 12?" The default, in VOTE, and now built: YES. Each act starts with
// the HEIRS of the last act's company, prepared from the ledger the way the city is.
//
// HIS HOLE (9/28), AND THE LAW'S ANSWER (s12), WHICH IS THE WHOLE SPEC:
//   - A man dies in act 1  -> his line is gone from acts 2 and 3 on the next flip
//     forward. No heir, unless he already had a kid (a man who has been with the
//     company long enough, or came with a family in his background, leaves one).
//   - A man dies in act 2 or 3 -> NOTHING in the past moves. It is that act's own
//     ledger. You recruit there. Act 3 loses that heir's line on the next flip.
//   - A change in the past re-derives the future's ROSTER and NEVER un-does the
//     future's deeds (the Day of the Tentacle rule, three-acts law s2c).
//   - A man recruited later in act 1 shows up as an heir on the next flip forward.
//   - The main character never dies (37g): he is not in this file at all.
//
// *** THE SHAPE IS "NO ROSTER", BECAUSE THE COMPANY MODULE ALREADY SAID SO. ***
// engine/bohemia_company.js keeps NO list of people (membership is computed from
// bonds and witnesses, and deleting the record deletes the member in the same
// instant). So the heirs are not stored either. They are a PURE FUNCTION of the
// act before, computed every call, exactly like the derived city. What a person
// DOES in an act is the act's own ledger, keyed by that person, and that is the
// only thing kept; it is never touched by a re-derive.
//
// WHAT THE WALKED GAME CAN FEED IT TODAY, MEASURED BEFORE THIS WAS WRITTEN:
//   a person has a key, a trade (role), a looks-seed, a former trade (wasOf) and a
//   name only once you have asked. It has NO age, NO hire day, NO gear, NO family
//   flag, and NOBODY CAN DIE (bohemia_down.js: your people are down, never dead,
//   a 9/11 law; his 9/27 "struck down = 20% dead" is the newer word and nothing
//   has built it). So the three clauses that need a death, a day or a family are
//   built and proved here on the input shape, and the walked game feeds them
//   nothing yet. Said, not hidden: the glass shows the survivors' line only.
//
// EVERY NUMBER BELOW IS A DEFAULT FROM records/BOHEMIA_PAOLO_WHEN_A_MAN_DIES_IN_ONE_ACT_
// 9_28_26.md AND BELONGS TO TUNING [recruit odds]. draft:true. They sit in ROWS so the
// day TUNING's table lands one object is swapped and nothing else reads a literal.
//
// REUSE CHECK: cooks no pixels, opens no bank, owns no list, and draws names from
// the city's own bank (BohemiaPeople.GIVEN / SURNAME) rather than a second one.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  /* ==================================================================== */
  /*  THE ROWS (TUNING's, draft:true). Nothing else in this file is a     */
  /*  number he would feel.                                               */
  /* ==================================================================== */
  var ROWS = {
    daysWithCompany: 60,    /* a man dead after this long with the company had a life: he leaves a kid */
    heirAgeMin: 15,         /* heirs arrive 15 to 35 years old */
    heirAgeMax: 35,
    /* the 35 years between acts is the phone strip's (bohemia_acts.js, +35Y); nothing here reads it */
    traitShare: 0.5,        /* an heir carries roughly half the parent's traits */
    perAct: 12,             /* ~12 men an act, 36 lives a game */
    levelShare: 0.5,        /* an heir starts at half the parent's level, rounded up, at least 1: a child shares half the DNA, a grandchild a quarter (the 9/28 reading), because the share compounds each hop */
    perkShare: 0.5,         /* and the first half of the parent's perks, in the order he took them */
    debtShare: 0.45,        /* standing's own GEN_LOSS: what crosses a generation of a debt or a favour (bohemia_standing.js, not a new number) */
    carryShare: 0.42        /* Paolo 10/2 (rule 67): 'not all of them, maybe like 42%' of the last crew carries */
  };
  var ACTS = [1, 2, 3];

  /* WHY A LINE CONTINUES, OR DOES NOT. These are the whole vocabulary. */
  var WHY = {
    SURVIVED: 'SURVIVED',                /* alive at the act's end: the normal case */
    LONG_ENOUGH: 'LONG_ENOUGH',          /* died after the threshold: had a life */
    FAMILY: 'FAMILY',                    /* came with a family in his background */
    TOO_SOON: 'DIED_TOO_SOON',           /* died early and left no one: the line ends */
    MAIN: 'THE_MAIN_LINE',               /* the main character is not an heir, he is the person */
    CROWDED: 'CROWDED_OUT',              /* more lines than the act has room for */
    LEFT: 'LEFT_BEHIND'                  /* had a line but is not in the share that carries */
  };

  function arr(x) { return Object.prototype.toString.call(x) === '[object Array]' ? x : []; }
  function str(x) { return String(x == null ? '' : x); }
  function num(x, d) { x = +x; return (x === x && isFinite(x)) ? x : d; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* A STRING HASH. Pure, no clock, no Math.random: the same line is the same
     person on every device and every reload, which is the rule GDD v4 58 sets for
     heir selection and bohemia_down.js applies to injuries. FNV-1a, then mixed. */
  function hash32(s) {
    s = str(s);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 16; h = Math.imul(h, 2246822507) >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 3266489909) >>> 0;
    h ^= h >>> 16;
    return h >>> 0;
  }
  function unit(s) { return hash32(s) / 4294967296; }

  function peopleBank() {
    var P = null;
    try { P = HASREQ ? require('./bohemia_people.js') : root.BohemiaPeople; } catch (_e) { P = root.BohemiaPeople || null; }
    return P || {};
  }
  function pick(list, s) { return (list && list.length) ? list[hash32(s) % list.length] : ''; }

  /* ==================================================================== */
  /*  THE LEDGER (what is kept) AND ITS WRITERS                           */
  /* ==================================================================== */
  /* ledger = { acts: { 1: {members:[...], recruits:[], events:{}}, 2: {recruits:[], events:{}}, 3: {...} } }
     act 1's members are handed in LIVE by the caller (the walked game computes its
     company and hands it here, and they are never saved); acts 2 and 3 have no
     members of their own, only what the act's own ledger recorded: recruits and
     events. EVENTS ARE THE ONLY THING KEPT ABOUT A PERSON, keyed by the person
     (a man's death in act 1 is an event of act 1), and they are never deleted. */
  function fresh() {
    return { v: 1, acts: { 1: { recruits: [], events: {} }, 2: { recruits: [], events: {} }, 3: { recruits: [], events: {} } } };
  }
  function slot(led, act) {
    led.acts = led.acts || {};
    var a = led.acts[act] = led.acts[act] || {};
    if (!a.events) a.events = {};
    if (!a.recruits) a.recruits = [];
    return a;
  }
  /* A death is an EVENT in the act it happened in. Nothing else moves. */
  function died(led, act, key, day) {
    act = +act;
    if (ACTS.indexOf(act) < 0 || !key) return { ok: false, why: 'NOT_AN_ACT_OR_KEY' };
    var e = slot(led, act).events;
    e[key] = e[key] || {};
    if (e[key].died) return { ok: false, why: 'ALREADY' };
    e[key].died = { day: num(day, 0) };
    return { ok: true };
  }
  function note(led, act, key, patch) {
    act = +act;
    if (ACTS.indexOf(act) < 0 || !key || !patch || typeof patch !== 'object') return { ok: false, why: 'BAD' };
    var e = slot(led, act).events;
    var cur = e[key] = e[key] || {};
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) {
      if (k === 'died') continue;           /* a death has its own door and its own refusal */
      cur[k] = patch[k];
    }
    return { ok: true };
  }
  /* RECRUITING INSIDE AN ACT STAYS BATTLE BROTHERS HARD. This only RECORDS a man
     the act's own play found; how hard it was is TUNING's. A recruit is never
     capped by this file. */
  function recruit(led, act, member) {
    act = +act;
    if (ACTS.indexOf(act) < 0 || !member || !member.key) return { ok: false, why: 'BAD' };
    var a = slot(led, act);
    for (var i = 0; i < a.recruits.length; i++) if (a.recruits[i].key === member.key) return { ok: false, why: 'ALREADY' };
    a.recruits.push(clone(member));
    return { ok: true };
  }

  /* ==================================================================== */
  /*  DOES A LINE CONTINUE                                                */
  /* ==================================================================== */
  function line(m, rows) {
    rows = rows || ROWS;
    if (!m) return { heir: false, why: WHY.TOO_SOON };
    if (m.main) return { heir: false, why: WHY.MAIN };
    if (!m.died) return { heir: true, why: WHY.SURVIVED };
    if (m.family) return { heir: true, why: WHY.FAMILY };
    var since = m.since, day = m.died && m.died.day;
    if (since != null && day != null && (day - since) >= rows.daysWithCompany) return { heir: true, why: WHY.LONG_ENOUGH };
    return { heir: false, why: WHY.TOO_SOON };
  }

  /* ==================================================================== */
  /*  ONE HEIR                                                            */
  /* ==================================================================== */
  function traitsOf(m) {
    var t = arr(m.traits).slice();
    if (m.was && m.was.keeps) t.push(str(m.was.keeps));
    return t;
  }
  /* A NAME THAT REMEMBERS THEM: the parent's surname, a given name of the heir's
     own. A parent you never asked has no name you could carry, so the heir gets a
     whole name from the bank and the card says whose kid by trade instead. */
  function nameOf(m, key, opts) {
    var P = peopleBank(), G = (opts && opts.given) || P.GIVEN || [], S = (opts && opts.surname) || P.SURNAME || [];
    var given = pick(G, key + '|given');
    var parent = str(m.name).replace(/^\s+|\s+$/g, '');
    var bits = parent ? parent.split(/\s+/) : [];
    var sur = bits.length > 1 ? bits[bits.length - 1] : pick(S, key + '|surname');
    return { name: (given + ' ' + sur).replace(/^\s+|\s+$/g, ''), carriesName: bits.length > 1 };
  }
  function heirOf(m, toAct, why, opts) {
    var rows = (opts && opts.rows) || ROWS;
    var key = 'H' + toAct + ':' + m.key;
    var span = Math.max(0, rows.heirAgeMax - rows.heirAgeMin);
    var age = rows.heirAgeMin + (hash32(key + '|age') % (span + 1));
    var all = traitsOf(m), kept = [];
    /* roughly half: floor(n * share + u) is exactly n*share on average, and one
       trait is a coin the key decides, so a reload never changes who kept what. */
    var want = Math.floor(all.length * rows.traitShare + unit(key + '|traits'));
    var ranked = all.map(function (t) { return { t: t, h: hash32(key + '|' + t) }; })
                    .sort(function (a, b) { return a.h - b.h || (a.t < b.t ? -1 : 1); });
    for (var i = 0; i < want && i < ranked.length; i++) kept.push(ranked[i].t);
    var nm = nameOf(m, key, opts);
    var pk = arr(m.perks), keepPk = pk.slice(0, Math.floor(pk.length * rows.perkShare));
    var gear = Object.prototype.toString.call(m.gear) === '[object Object]'
      ? Object.keys(m.gear).map(function (k) { return m.gear[k]; }).filter(Boolean) : arr(m.gear).slice();
    var stars = {}, sk; if (m.stars && typeof m.stars === 'object')
      for (sk in m.stars) if (Object.prototype.hasOwnProperty.call(m.stars, sk)) stars[sk] = m.stars[sk];
    /* the parent's look: a man's own seed, or for an heir of an heir the seed the
       parent heir was drawn from, so the third generation descends from the second */
    var look = m.look != null ? m.look : (m.lookSeed != null ? m.lookSeed : hash32(m.key + '|look'));
    return {
      key: key,
      act: toAct,
      parent: m.key,
      line: arr(m.line).length ? m.line.concat([key]) : [m.key, key],
      name: nm.name,
      carriesName: nm.carriesName,
      age: age,
      kind: (why === WHY.SURVIVED) ? 'APPRENTICE' : 'KID',  /* a survivor trained one; a man who died left one (draft) */
      role: m.role || null,
      was: m.was ? { id: m.was.id || null, keeps: null } : null,
      traits: kept,
      gear: gear,                           /* gear stays in the family (37g), a crew man's slots flattened */
      level: Math.max(1, Math.ceil(num(m.level, 1) * rows.levelShare - 1e-9)),
      perks: keepPk,
      stars: stars,                         /* talent runs in a family: the stars carry */
      house: m.house != null ? m.house : null,
      debt: m.debt != null ? Math.round(num(m.debt, 0) * rows.debtShare * 100) / 100 : 0,
      /* the body never carries: no stats, no hitpoints, no wounds, no age of the parent are copied (the 9/28 reading) */
      lookFrom: look,                       /* PORTRAIT's heredity takes the parent's look from here */
      lookSeed: hash32(look + '|' + toAct),
      strength: num(m.strength, 0) / 2,     /* an heir starts with half of what the parent had earned */
      why: why,
      draft: true
    };
  }

  /* ==================================================================== */
  /*  THE DERIVE                                                          */
  /* ==================================================================== */
  /* roster(ledger, act, opts) -> everyone in the company IN that act, each with the
     act's own events laid on top. Act 1 is what the caller hands in; act n>1 is
     the heirs of act n-1 PLUS the act's own recruits. Dead men stay in the list,
     marked, because a roster that hides the fallen cannot be told apart from one
     that forgot them, and because their line may continue. */
  function overlay(base, events) {
    var out = [];
    for (var i = 0; i < base.length; i++) {
      var m = clone(base[i]), e = events && events[m.key];
      if (e) for (var k in e) if (Object.prototype.hasOwnProperty.call(e, k)) m[k] = clone(e[k]);
      out.push(m);
    }
    return out;
  }
  function roster(led, act, opts) {
    act = +act;
    led = led || fresh();
    var events = (led.acts && led.acts[act] && led.acts[act].events) || {};
    var base;
    if (ACTS.indexOf(act) < 0) return [];
    base = (act === 1) ? arr(led.acts && led.acts[1] && led.acts[1].members).slice()
                       : heirs(led, act, opts).heirs;
    var rec = arr(led.acts && led.acts[act] && led.acts[act].recruits);
    var seen = {};
    for (var i = 0; i < base.length; i++) seen[base[i].key] = 1;
    for (var j = 0; j < rec.length; j++) if (!seen[rec[j].key]) base.push(rec[j]);
    return overlay(base, events);
  }
  /* heirs(ledger, toAct) -> { act, from, heirs, gone, crowded } : the next act's
     people, computed from the act before and from nothing else. */
  function heirs(led, toAct, opts) {
    toAct = +toAct;
    var rows = (opts && opts.rows) || ROWS;
    var out = { act: toAct, from: toAct - 1, heirs: [], gone: [], crowded: [], left: [] };
    if (ACTS.indexOf(toAct) < 1) return out;
    var from = roster(led, toAct - 1, opts), cands = [];
    for (var i = 0; i < from.length; i++) {
      var v = line(from[i], rows);
      if (!v.heir) { out.gone.push({ key: from[i].key, name: from[i].name || null, why: v.why }); continue; }
      cands.push({ m: from[i], why: v.why });
    }
    /* the room is limited: the strongest lines first, ties by key so the answer
       never depends on the order the caller listed them in. */
    cands.sort(function (a, b) {
      var d = num(b.m.strength, 0) - num(a.m.strength, 0);
      return d || (a.m.key < b.m.key ? -1 : a.m.key > b.m.key ? 1 : 0);
    });
    /* ONLY ABOUT 42% CARRY (his 10/2 ruling), THE STRONGEST FIRST, so what a man earned
       is what decides whether his line is the one that goes on. At least one carries
       whenever anybody qualifies (ceil), or a one-man company would end the dynasty. */
    var share = num(rows.carryShare, 1);
    var keepN = Math.ceil(cands.length * share - 1e-9);
    for (var k = 0; k < cands.length; k++) {
      var c = cands[k], brief = { key: c.m.key, name: c.m.name || null };
      if (k >= keepN) { brief.why = WHY.LEFT; out.left.push(brief); }
      else if (out.heirs.length < rows.perAct) out.heirs.push(heirOf(c.m, toAct, c.why, opts));
      else { brief.why = WHY.CROWDED; out.crowded.push(brief); }
    }
    return out;
  }
  /* WHAT STAYS DONE. Events keyed by somebody who is not in this act's derived
     roster any more (their line was cut in the past). They are NEVER deleted: the
     past rewrites the future's world, never the future's hands. */
  function orphans(led, act, opts) {
    var ev = (led && led.acts && led.acts[act] && led.acts[act].events) || {};
    var here = {}, r = roster(led, act, opts), out = [];
    for (var i = 0; i < r.length; i++) here[r[i].key] = 1;
    for (var k in ev) if (Object.prototype.hasOwnProperty.call(ev, k) && !here[k]) out.push({ key: k, event: clone(ev[k]) });
    return out;
  }
  function living(r) { return arr(r).filter(function (m) { return !m.died; }); }

  /* ==================================================================== */
  /*  THE SAVE. Tolerant: garbage in, a fresh ledger out.                 */
  /* ==================================================================== */
  function save(led) { return JSON.parse(JSON.stringify(led || fresh())); }
  function load(blob) {
    var led = fresh();
    if (!blob || typeof blob !== 'object' || blob.v !== 1 || !blob.acts) return led;
    [1, 2, 3].forEach(function (n) {
      var a = blob.acts[n];
      if (!a || typeof a !== 'object') return;
      arr(a.recruits).forEach(function (m) {
        if (m && typeof m === 'object' && typeof m.key === 'string' && m.key) led.acts[n].recruits.push(clone(m));
      });
      var ev = a.events;
      if (ev && typeof ev === 'object') for (var k in ev) if (Object.prototype.hasOwnProperty.call(ev, k)) {
        var e = ev[k];
        if (!e || typeof e !== 'object') continue;
        var keep = clone(e);
        if (keep.died && typeof keep.died !== 'object') delete keep.died;
        led.acts[n].events[k] = keep;
      }
    });
    return led;
  }

  var API = {
    ROWS: ROWS, WHY: WHY, ACTS: ACTS,
    fresh: fresh, died: died, note: note, recruit: recruit,
    line: line, heirOf: heirOf, heirs: heirs, roster: roster, orphans: orphans, living: living,
    save: save, load: load, hash32: hash32
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaHeirs = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

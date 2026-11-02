/* ==========================================================================
   A JOB'S TIME IS THE TRUTH: THE PROBE  (WORLD 4, 11/2/26, rule 307, ask lines 242 and 299)

   PAOLO 11/2 (the second time): 'the time that it takes on these quests are extremely inaccurate a lot of the times, so that
   needs to get fixed for real... I'm tired of that shit being inaccurate as fuck.'
   EYES once saw ONE job true. Nobody measured many. This does: it drives the real demo (its own map, clock, fights and towns),
   takes jobs of every kind at several towns, from the town's board (standing there) and from the phone (standing at another
   town: the walk to the town, then the job), walks each with the map's own PLAY or with his own taps, wins every fight the way
   the gates do, and logs THE PROMISE (BohemiaJobKinds.trip, the words he reads before the yes) against THE MAP'S CLOCK (every
   minute advance() spends, from the yes to the pay, and to the first arrival), and every stop on the way (fights, meets, the
   road's own events, a camp, a wipe).

   node tools/bohemia_world_job_time_probe.js        (PROBE_N=60 jobs, PROBE_OUT=<file.jsonl>, PROBE_TOWNS=5, PROBE_PROFILE)
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const N = +(process.env.PROBE_N || 60);
const NTOWNS = +(process.env.PROBE_TOWNS || 5);
const OUT = process.env.PROBE_OUT || path.join(ROOT, 'records/target/world_job_time_probe.jsonl');
const PROFILE = process.env.PROBE_PROFILE || 'computer';
const ONLY = process.env.PROBE_KINDS ? process.env.PROBE_KINDS.split(',') : null;

/* THE TABLE: node tools/bohemia_world_job_time_probe.js table <file.jsonl> [<file2.jsonl> ...]
   THE BAR (rule 307): 9 of 10 jobs within 15 of every 100 of the promise; none off by more than 30 without saying why. A promise
   that is a range counts as kept when the walk lands inside it (15 either side); a job that never ended (stuck, past the cap) is
   off. The phone's promise is the walk to the town and the job, the whole of it; hold-defend says no time ('you stay'). */
function table(files) {
  const rows = [];
  files.forEach(f => fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(l => { try { rows.push(JSON.parse(l)); } catch (e) {} }));
  const pct = v => (v >= 0 ? '+' : '') + Math.round(v * 100) + '%';
  const judged = [], skipped = [];
  rows.forEach(r => {
    if (r.skip || r.error || !r.promise) { skipped.push(r); return; }
    if (r.from === 'phone' && r.promise.toTown > 30 && (r.actualToTown || 0) < r.promise.toTown * 0.5) { skipped.push(Object.assign(r, { skip: 'probe fault: a town left open counted as the arrival' })); return; }
    const P = r.promise;
    /* WORLD 4 (rule 307 amended): the hold is timed too (the walk to its gate); a promise under ten minutes is kept within fifteen minutes */
    if (P.plays === 'hold-defend' && !/gate|GATE/.test((P.words || '') + (P.short || '')) && !(P.toTown > 0)) { skipped.push(Object.assign(r, { skip: 'no time promised (you stay)' })); return; }
    if (r.end === 'lost' && (r.cards | 0) > 0) { skipped.push(Object.assign(r, { skip: 'he ended it at a card' })); return; }
    const done = r.end === 'paid' || r.end === 'gone';
    /* the road's own stops (a road event's minutes, chosen on a card that says them; the old road director's 20): not the job's walk, and the words say 'if nobody stops you' */
    r.roadMins = Object.keys(r.src || {}).filter(k => k !== 'step' && !/legsArrive/.test(k)).reduce((a, k) => a + r.src[k], 0);
    let ok, off;
    if (P.exact || P.plays === 'hold-defend') { off = P.all > 0 ? (r.actualAll - P.all) / P.all : 0; ok = done && (Math.abs(off) <= 0.15 || (P.all < 10 && r.actualAll <= P.all + 15)); }
    else { const lo = (P.toTown || 0) + P.lo, hi = (P.toTown || 0) + P.hi; off = r.actualAll < lo ? (r.actualAll - lo) / lo : r.actualAll > hi ? (r.actualAll - hi) / hi : 0; ok = done && r.actualAll >= lo * 0.85 && r.actualAll <= hi * 1.15; }
    const adj = P.all > 0 && P.exact ? (r.actualAll - r.roadMins - P.all) / P.all : off;
    judged.push({ r, ok, off, adj, done, okAdj: done && Math.abs(adj) <= 0.15, said: (!P.exact && !!(P.why || /packs move/.test(P.words || ''))) || (r.roadMins > 0 && /if nobody stops you/.test(P.words || '') && Math.abs(adj) <= 0.30) });
  });
  const okN = judged.filter(j => j.ok).length, bad30 = judged.filter(j => (!j.done || Math.abs(j.off) > 0.30) && !j.said);
  console.log('| # | kind | town | from / walk | day or night | promised (his words) | promised min | walked min | off | end | fights | road events min |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');
  judged.forEach(j => { const r = j.r, P = r.promise;
    console.log('| ' + r.n + ' | ' + r.kind + ' | ' + r.town + ' | ' + r.from + ' / ' + r.mode + ' | ' + (r.night ? 'night' : 'day') + ' | ' + (P.short || '') + ' | ' + (P.exact ? Math.round(P.all) : Math.round((P.toTown || 0) + P.lo) + '-' + Math.round((P.toTown || 0) + P.hi)) + ' | ' + Math.round(r.actualAll) + ' | ' + (j.ok ? '' : '**') + pct(j.off) + (j.ok ? '' : '**') + ' | ' + r.end + ' | ' + (r.fights | 0) + ' | ' + Math.round(r.roadMins || 0) + ' |'); });
  console.log('\nWITHIN 15 OF 100 ONCE THE ROAD\'S OWN STOPS ARE TAKEN OUT (a road card says its minutes; the words say \'if nobody stops you\'): ' + judged.filter(j => j.okAdj).length + ' of ' + judged.length);
  console.log('WITHIN THE BAR: ' + okN + ' of ' + judged.length + ' (' + Math.round(okN / Math.max(1, judged.length) * 100) + '%); off by more than 30 (or never ended) without saying why: ' + bad30.length + (bad30.length ? ' (' + bad30.map(j => '#' + j.r.n + ' ' + j.r.kind).join(', ') + ')' : ''));
  console.log('not judged: ' + skipped.length + (skipped.length ? ' (' + skipped.map(r => '#' + r.n + ' ' + r.kind + ': ' + (r.skip || r.error)).join('; ') + ')' : ''));
  const byKind = {}; judged.forEach(j => { const k = j.r.kind; byKind[k] = byKind[k] || { n: 0, ok: 0 }; byKind[k].n++; if (j.ok) byKind[k].ok++; });
  console.log('by kind: ' + Object.keys(byKind).sort().map(k => k + ' ' + byKind[k].ok + '/' + byKind[k].n).join(', '));
  const ph = judged.filter(j => j.r.from === 'phone'); console.log('from the phone: ' + ph.filter(j => j.ok).length + ' of ' + ph.length + '; the phone and the board at the yes planned the same place: ' + ph.filter(j => j.r.sameAsPhone).length + ' of ' + ph.length);
  const pl = judged.filter(j => j.r.mode === 'play'), tp = judged.filter(j => j.r.mode === 'tap'); console.log('walked with PLAY: ' + pl.filter(j => j.ok).length + ' of ' + pl.length + '; with his taps: ' + tp.filter(j => j.ok).length + ' of ' + tp.length);
  const nt = judged.filter(j => j.r.night), dy = judged.filter(j => !j.r.night); console.log('started at night: ' + nt.filter(j => j.ok).length + ' of ' + nt.length + '; by day: ' + dy.filter(j => j.ok).length + ' of ' + dy.length);
  const hf = judged.filter(j => j.r.half && j.r.half.left > 0 && j.done); console.log('the held job\'s card halfway (what is left, his phone): within 15 of 100: ' + hf.filter(j => Math.abs(j.r.half.off) <= 0.15).length + ' of ' + hf.length + (hf.length ? ' (worst ' + pct(hf.map(j => j.r.half.off).sort((a, b) => Math.abs(b) - Math.abs(a))[0]) + ')' : ''));
  /* the place the promise walked to first against the place the yes made (a town's leg ends on its nearest side, so within 3 blocks; a hunt's packs move, so not asked) */
  const far = j => { const a = j.r.promise.at && j.r.promise.at[0], b = j.r.took && j.r.took.at; return !!(a && b) && Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) > 3; };
  const sp = judged.filter(j => j.r.kind !== 'hunt-kind' && j.r.kind !== 'hold-defend' && far(j)); console.log('the yes made the job somewhere other than the promise (more than 3 blocks off its first place): ' + sp.length + (sp.length ? ' (' + sp.map(j => '#' + j.r.n + ' ' + j.r.kind).join(', ') + ')' : ''));
}
if (process.argv[2] === 'table') { table(process.argv.slice(3)); process.exit(0); }

(async () => {
  const d = await drive.open({ keepCards: true, profile: PROFILE, engage: true });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && !!(window.BOH_REGION && BOH_REGION.ready), null, { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);

  /* THE CLOCK, COUNTED: every minute the map spends goes through advance(); this counts it and says who spent it */
  if (process.env.PROBE_ROAD) await fr.evaluate(() => { window.__PROBE_ROAD = 1; });
  await fr.evaluate(() => {
    window.__ABS = 0; window.__SRC = {}; window.__STEPS = 0;
    const A = window.advance;
    window.advance = function (m) {
      const st = (new Error().stack || '').split('\n'), f = (st[2] || '').trim().replace(/^at /, '').split(' ')[0] || '?';
      const src = /stepOnce/.test(f) ? 'step' : f;
      if (src === 'step') window.__STEPS++;
      window.__ABS += +m || 0; window.__SRC[src] = (window.__SRC[src] || 0) + (+m || 0);
      return A.apply(this, arguments);
    };
    /* the probe walks at the pad's fastest (a block is still one step paying its own clock; only the wall clock is quicker) */
    try { MAP_FAST_ON = true; TRAVEL_SPEEDS = TRAVEL_SPEEDS_ALL; travelSpeedSet(5); } catch (e) {}
    /* the road talks as it does on his phone (CONTENT's road events stay quiet for a scripted browser unless asked) */
    /* PROBE_ROAD=1: the road talks as on his phone (CONTENT's road events stay quiet for a scripted browser unless asked). Off by
       default: a side quest's person talks in a loop a script cannot leave, and the road's own stops are counted from their data */
    if (window.__PROBE_ROAD) window.__ROADEV_ON = true;
  });

  /* a card the road holds up (a face and two or three choices): answered like a player, a pick seeded by the job's number */
  let cardN = 0;
  const roadCard = async (n) => {
    const k = await fr.evaluate((n) => { const b = [...document.querySelectorAll('button[data-road]')].filter(x => x.offsetParent !== null || x.getBoundingClientRect().height > 0);
      if (!b.length) return -1; const i = window.__PROBE_ROAD ? (n * 7 + (window.__PROBE_CARDS | 0) * 3) % b.length : 0; window.__PROBE_CARDS = (window.__PROBE_CARDS | 0) + 1; window.__PROBE_PICKED = (b[i].textContent || '').slice(0, 60);
      b[i].dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true })); return i; }, n).catch(() => -1);   /* the card answers a finger lifting (pointerup), not a click */
    if (k >= 0) { cardN++; await page.waitForTimeout(400); return true; } return false;
  };
  /* a fight the walk met, ended by the checker as won (the gates' own way), so the walk measured is the walk */
  let fights = 0;
  const fightOver = async () => {
    if (!(await page.evaluate(() => !!(typeof CITYFIGHT !== 'undefined' && CITYFIGHT)).catch(() => false))) return false;
    fights++;
    for (let i = 0; i < 120; i++) { const h = await page.$('#fightFrame'); const f = h ? await h.contentFrame() : null;
      if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board && !FIGHT.S.over).catch(() => false)) {
        await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); break; }
      if (!(await page.evaluate(() => !!CITYFIGHT).catch(() => false))) break;
      await page.waitForTimeout(250); }
    await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !CITYFIGHT), 15000);
    await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} }).catch(() => {});
    await waitFor(() => page.evaluate(() => !CITYFIGHT), 20000); await page.waitForTimeout(700);
    return true;
  };

  /* the towns, and the offers of every kind the board shelf has */
  const setup = await fr.evaluate(([NT, ONLY]) => {
    const bs = ctBases() || {}, names = Object.keys(bs).filter(n => { try { return mapTierOf(n) !== 'camp'; } catch (e) { return true; } }).sort();
    const all = Object.keys(bs).sort();
    const pick = [], step = Math.max(1, Math.floor(names.length / NT));
    for (let i = 0; i < names.length && pick.length < NT; i += step) pick.push(names[i]);
    for (let i = 0; i < all.length && pick.length < NT; i++) if (pick.indexOf(all[i]) < 0) pick.push(all[i]);
    const shelf = (BohemiaBoardShelf.shelf && BohemiaBoardShelf.shelf().offers) || [];
    const byKind = {};
    shelf.forEach(o => { const k = BohemiaJobKinds.kindOf(o); if (ONLY && ONLY.indexOf(k) < 0) return; (byKind[k] = byKind[k] || []).push({ id: o.id, title: o.title, pay: o.pay | 0, skulls: o.skulls | 0, kind: k }); });
    return { towns: pick.map(n => ({ name: n, x: bs[n].x | 0, y: bs[n].y | 0 })), byKind, kinds: Object.keys(byKind).map(k => k + ':' + byKind[k].length) };
  }, [NTOWNS, ONLY]);
  console.log('towns: ' + setup.towns.map(t => t.name).join(', ') + ' | kinds on the shelf: ' + setup.kinds.join(' '));

  /* the plan: every kind at every town from the board, and from the phone at another town; PLAY and taps alternate */
  const kinds = Object.keys(setup.byKind).sort();
  const specs = [];
  if (process.env.PROBE_ONLY) { const [id, tn, k] = process.env.PROBE_ONLY.split('@'), o = [].concat.apply([], Object.values(setup.byKind)).filter(x => x.id === id)[0], t = setup.towns.filter(x => x.name === tn)[0];
    for (let i = 0; i < (+k || 6); i++) specs.push({ town: t, offer: o, from: 'town', start: t, mode: 'play', night: i % 2 === 1 }); }
  for (let r = 0; !process.env.PROBE_ONLY && specs.length < N && r < 6; r++) for (let ti = 0; ti < setup.towns.length && specs.length < N; ti++) for (let ki = 0; ki < kinds.length && specs.length < N; ki++) {
    const list = setup.byKind[kinds[ki]], o = list[(ti + r * 3 + ki) % list.length];
    const from = ((ti + ki + r) % 4 === 3) ? 'phone' : 'town';
    specs.push({ town: setup.towns[ti], offer: o, from, start: from === 'phone' ? setup.towns[(ti + 2) % setup.towns.length] : setup.towns[ti],
      mode: ((ti + ki + r) % 3 === 2) ? 'tap' : 'play', night: ((ti * 7 + ki + r) % 2 === 1) });
  }
  const PART = process.env.PROBE_PART ? process.env.PROBE_PART.split('/').map(Number) : null;   /* '0/2': every other job, for two browsers at once */
  if (PART) { const keep = specs.filter((x, i) => i % PART[1] === PART[0]); specs.length = 0; keep.forEach(x => specs.push(x)); }
  fs.writeFileSync(OUT, '');
  console.log(specs.length + ' jobs planned');

  specs.forEach((x, i) => { if (x.n == null) x.n = i; });
  for (let q = 0; q < specs.length; q++) {
    const S = specs[q], n = S.n;
    const rec = { n, id: S.offer.id, title: S.offer.title, kind: S.offer.kind, town: S.town.name, from: S.from, start: S.start.name, mode: S.mode };
    try {
      /* SET UP (not measured): nothing held, nothing walking, standing at the start town's door; at night if asked */
      const r0 = await fr.evaluate(([S]) => {
        try { travelStop(); } catch (e) {} try { loopClose(); } catch (e) {}
        try { if (typeof CAMP !== 'undefined' && CAMP.on) campBreak('probe'); } catch (e) {}
        LOOP.held = []; try { MAP_PLAY.job = null; } catch (e) {} try { PHONE_LIT = null; } catch (e) {}
        const st = S.start, door = townDoor(st.x, st.y) || [st.x, st.y]; city.x = door[0]; city.y = door[1];
        /* the hour he starts at: night (19:00 to 04:00) or day, by the map's own clock (a setup wait, before the count) */
        const hr = () => Math.floor(((T.min % 1440) + 1440) % 1440 / 60), night = () => { const h = hr(); return h >= 19 || h < 4; };
        for (let g = 0; g < 30 && night() !== !!S.night; g++) advance(60);
        try { travelSpeedSet(5); } catch (e) {} try { camHold(); render(); } catch (e) {}
        return { hour: hr(), day: DAY.day };
      }, [S]);
      await page.waitForTimeout(1200);   /* the camera comes to him, as it would have after a walk (a job's place prefers what is on the glass) */
      rec.hour = r0.hour; rec.night = rec.hour >= 19 || rec.hour < 4;
      /* THE PROMISE, as he reads it before the yes (the board standing at the town; the phone's card from the other town) */
      const P = await fr.evaluate(([S]) => { const T = BohemiaJobKinds.trip(S.offer, S.town.name); return T ? JSON.parse(JSON.stringify({ words: T.words, short: T.short, here: T.here, toTown: T.toTown, job: T.job })) : null; }, [S]);
      if (!P || !P.job) { rec.skip = 'no trip'; fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); console.log(n + ' ' + rec.id + ' skip: no trip'); continue; }
      rec.promise = { words: P.words, short: P.short, exact: !!P.job.exact, total: P.job.exact ? P.job.total : null, lo: P.job.exact ? null : P.job.totalLo, hi: P.job.exact ? null : P.job.totalHi,
        toTown: P.toTown ? P.toTown.mins : 0, plays: P.job.plays, back: !!P.job.back, at: P.job.at || null, why: P.job.why || null,
        legs: (P.job.legs || []).map(l => Math.round(l.mins)), backMins: P.job.backMins != null ? Math.round(P.job.backMins) : null, ends: P.job.ends || null };
      rec.promise.all = (rec.promise.toTown || 0) + (rec.promise.exact ? rec.promise.total : (rec.promise.lo + rec.promise.hi) / 2);
      const abs0 = await fr.evaluate(() => { window.__SRC = {}; window.__STEPS = 0; return window.__ABS; });
      const f0 = fights;
      /* FROM THE PHONE: the walk to the town first (the lit town's own tap), then the yes at its board */
      if (S.from === 'phone') {
        await fr.evaluate(([S]) => { townTap({ name: S.town.name, x: S.town.x, y: S.town.y }); try { travelSpeedSet(5); } catch (e) {} }, [S]);
        const t0 = Date.now();
        while (Date.now() - t0 < 180000) {
          if (await roadCard(n)) continue;
          if (await fightOver()) { await fr.evaluate(([S]) => { if (!TRAVEL) townTap({ name: S.town.name, x: S.town.x, y: S.town.y }); try { travelSpeedSet(5); } catch (e) {} }, [S]); continue; }
          const st = await fr.evaluate(([S]) => ({ open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), trav: !!TRAVEL, meet: !!(MEET && MEET.up), at: Math.max(Math.abs(city.x - S.town.x), Math.abs(city.y - S.town.y)) }), [S]);
          if (st.open && st.at <= 3) break;   /* his town's screen, at his town (a town left open by the last job is not the arrival) */
          if (st.open) await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
          if (!st.trav && !st.meet) await fr.evaluate(([S]) => { townTap({ name: S.town.name, x: S.town.x, y: S.town.y }); try { travelSpeedSet(5); } catch (e) {} }, [S]);
          await page.waitForTimeout(300);
        }
        rec.actualToTown = await fr.evaluate((a) => window.__ABS - a, abs0);
        /* the board's promise at the yes, where he now stands */
        const P2 = await fr.evaluate(([S]) => { const T = BohemiaJobKinds.trip(S.offer, S.town.name); return T && T.job ? { total: T.job.exact ? T.job.total : null, lo: T.job.totalLo, hi: T.job.totalHi, exact: !!T.job.exact, words: T.words, at: T.job.at || null } : null; }, [S]);
        rec.boardAtYes = P2;
        rec.sameAsPhone = !!(P2 && JSON.stringify(P2.at) === JSON.stringify(rec.promise.at));
      }
      const absYes = await fr.evaluate(() => window.__ABS);
      rec.promiseJobAtYes = S.from === 'phone' && rec.boardAtYes ? (rec.boardAtYes.exact ? rec.boardAtYes.total : (rec.boardAtYes.lo + rec.boardAtYes.hi) / 2) : null;
      /* THE YES (the board's own take; the town he stands at) */
      const took = await fr.evaluate(([S]) => {
        LOOP.open = { name: S.town.name, x: S.town.x, y: S.town.y };   /* the board he stands at (a delivery's town may still be open) */
        const ok = loopTakeContract(S.offer); try { loopClose(); } catch (e) {} LOOP.open = null;
        const j = LOOP.held.filter(h => h.id === S.offer.id)[0];
        if (!j) return { ok: false };
        const at = (q) => q && q.x != null ? [q.x | 0, q.y | 0] : null;
        const p = j.plays === 'haul-caravan' || j.plays === 'carry' ? at(j.target) : j.plays === 'find-place' || j.plays === 'find-person' ? at(j.ring) : j.plays === 'hunt-kind' ? at((j.packs || [])[0])
          : j.plays === 'clear-camp' ? at(j.camp) : j.plays === 'hold-defend' ? at(j.fromAt) : j.plays === 'recover-return' ? at(j.spot) : j.plays === 'patrol' ? at((j.posts || [])[0]) : at(j.target);
        return { ok: ok, plays: j.plays, stage: j.stage || null, at: p, need: j.need || null, packs: (j.packs || []).length };
      }, [S]);
      rec.took = took;
      if (!took.ok) { rec.skip = 'not taken'; fs.appendFileSync(OUT, JSON.stringify(rec) + '\n'); console.log(n + ' ' + rec.id + ' skip: not taken'); continue; }
      rec.samePlace = !!(rec.promise.at && took.at && rec.promise.at[0] && rec.promise.at[0][0] === took.at[0] && rec.promise.at[0][1] === took.at[1]);
      /* THE WALK: PLAY (the map's own walk to the job) or his taps on the job's next place, until it pays or is lost */
      const t0 = Date.now(); let idle = 0, lastAbs = -1, stages = [], arrive = null, end = null, goes = 0;
      const capMins = Math.max(rec.promise.all * 4, rec.promise.all + 24 * 60, 6 * 60);
      const c0 = cardN, picks = [];
      while (Date.now() - t0 < 300000) {
        if (await roadCard(n)) { idle = 0; picks.push(await fr.evaluate(() => window.__PROBE_PICKED).catch(() => null)); continue; }
        if (await fightOver()) { idle = 0; continue; }
        const st = await fr.evaluate(([id, a]) => {
          const j = LOOP.held.filter(h => h.id === id)[0];
          const paid = (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, lost = (window.__JOB_LOST || []).filter(p => p.id === id).slice(-1)[0] || null;
          return { held: !!j, stage: j ? (j.stage || null) : null, got: j ? (j.got | 0) : 0, open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), trav: !!TRAVEL, meet: !!(MEET && MEET.up), fighting: !!LOOP.fighting,
            spent: window.__ABS - a, paid: paid, lost: lost, at: [city.x, city.y], speed: TRAVEL_SPEED };
        }, [S.offer.id, absYes]);
        if (process.env.PROBE_TRACE) { rec.trace = rec.trace || []; const tl = await fr.evaluate(([S]) => { try { const T = BohemiaJobKinds.trip(S.offer, S.town.name); return T && T.job ? Math.round(T.job.total != null ? T.job.total : T.job.totalHi) : null; } catch (e) { return 'err'; } }, [S]).catch(() => null);
          rec.trace.push([Math.round(st.spent), st.at[0], st.at[1], st.stage, tl, st.trav ? 1 : 0, st.meet ? 1 : 0]); }
        if (!st.held) { end = st; break; }
        if (st.stage !== (stages.length ? stages[stages.length - 1].s : took.stage)) { stages.push({ s: st.stage, m: Math.round(st.spent) }); if (arrive == null) arrive = st.spent; }
        if (st.spent > capMins) { end = Object.assign(st, { cap: true }); break; }
        /* HALFWAY: what the phone's card for the held job says is left, against what is really left (read at the end) */
        if (!rec.half && st.spent >= (rec.promiseJobAtYes || rec.promise.all) / 2 && !st.fighting && !st.meet) {
          rec.half = await fr.evaluate(([S, spent]) => { const T = BohemiaJobKinds.trip(S.offer, S.town.name); return T && T.job ? { at: spent, left: T.job.exact ? T.job.total : (T.job.totalLo + T.job.totalHi) / 2, leftWords: T.short, isLeft: !!T.job.left } : null; }, [S, st.spent]); }
        if (st.open) { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); continue; }
        if (st.trav && st.speed === 0) await fr.evaluate(() => { try { travelSpeedSet(5); } catch (e) {} });
        if (!st.trav && !st.meet && !st.fighting) {
          goes++;
          await fr.evaluate(([id, mode]) => {
            const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return;
            try { travelSpeedSet(5); } catch (e) {}
            /* a FIND stood in its ring: the hint said which way and how far ('Somewhere east of here, 3 blocks or so'); he walks it */
            if ((j.plays === 'find-place' || j.plays === 'find-person') && j.stage === 'look' && !j.holders && j.ring && Math.max(Math.abs(city.x - j.ring.x), Math.abs(city.y - j.ring.y)) <= 1) {
              window.__PROBE_HINT_WALKS = (window.__PROBE_HINT_WALKS | 0) + 1; travelStop(); travelTo(0, 0, [j.spot.x, j.spot.y]); return; }
            if (mode === 'play') { try { MAP_PLAY.chain = 0; mapPlayGo(id); } catch (e) {} return; }
            const nx = BohemiaJobKinds.nextOf(j); if (!nx) return;
            if (nx.town) { const bs = ctBases() || {}; let t = null; for (const k in bs) if (String(k).toUpperCase() === String(nx.name).toUpperCase()) t = { name: k, x: bs[k].x | 0, y: bs[k].y | 0 };
              if (!t) try { t = (window.BOH_REGION && BOH_REGION.placeAt) ? BOH_REGION.placeAt(nx.x | 0, nx.y | 0, 1) : null; } catch (e) {}
              if (t) { townTap(t); return; } }
            travelStop(); travelTo(0, 0, [nx.x | 0, nx.y | 0]);
          }, [S.offer.id, S.mode]);
        }
        if (Math.abs(st.spent - lastAbs) < 0.01 && !st.fighting) idle++; else idle = 0;
        lastAbs = st.spent;
        if (idle > 80) { end = Object.assign(st, { stuck: true }); break; }
        await page.waitForTimeout(250);
      }
      const after = await fr.evaluate(([a, id]) => ({ spent: window.__ABS - a, src: window.__SRC, steps: window.__STEPS,
        said: (LOOP.said || []).slice(-3), paid: (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, lost: (window.__JOB_LOST || []).filter(p => p.id === id).slice(-1)[0] || null }), [absYes, S.offer.id]);
      rec.actualJob = after.spent; rec.firstArrive = arrive; rec.stages = stages; rec.steps = after.steps; rec.goes = goes;
      rec.src = Object.fromEntries(Object.entries(after.src).map(([k, v]) => [k, Math.round(v)]));
      rec.fights = fights - f0; rec.cards = cardN - c0; rec.picks = picks;
      rec.end = end ? (end.cap ? 'cap' : end.stuck ? 'stuck' : after.paid ? 'paid' : after.lost ? 'lost' : 'gone') : 'timeout';
      rec.actualAll = (rec.actualToTown || 0) + rec.actualJob;
      if (rec.half) { rec.half.really = rec.actualJob - rec.half.at; rec.half.off = rec.half.really > 0 ? (rec.half.really - rec.half.left) / rec.half.left : null; }
      /* the job's own part against the promise the yes was made on (the board's, at the yes), and the whole against the first promise */
      const pj = S.from === 'phone' && rec.boardAtYes ? (rec.boardAtYes.exact ? rec.boardAtYes.total : (rec.boardAtYes.lo + rec.boardAtYes.hi) / 2) : (rec.promise.exact ? rec.promise.total : (rec.promise.lo + rec.promise.hi) / 2);
      rec.promiseJob = pj;
      rec.off = rec.promise.all > 0 ? (rec.actualAll - rec.promise.all) / rec.promise.all : null;
      rec.offJob = pj > 0 ? (rec.actualJob - pj) / pj : null;
      rec.inRange = rec.promise.exact ? null : (rec.actualJob >= rec.promise.lo * 0.85 && rec.actualJob <= rec.promise.hi * 1.15);
    } catch (e) { rec.error = String(e.message || e).slice(0, 200); }
    fs.appendFileSync(OUT, JSON.stringify(rec) + '\n');
    console.log(n + ' ' + rec.kind + ' ' + rec.id + ' @' + rec.town + ' ' + rec.from + '/' + rec.mode + (rec.night ? ' night' : ' day') + ' | promised ' + (rec.promise ? Math.round(rec.promise.all) : '?') + ' "' + (rec.promise ? rec.promise.short : '') + '" | walked ' + Math.round(rec.actualAll || 0) + ' | off ' + (rec.off != null ? Math.round(rec.off * 100) + '%' : '-') + ' | ' + (rec.end || rec.error || rec.skip) + ' f' + (rec.fights | 0) + ' ' + JSON.stringify(rec.src || {}));
  }
  console.log('errors: ' + errs.slice(0, 5).join(' | '));
  await d.close();
})().catch(e => { console.error('PROBE FAILED: ' + e.stack); process.exit(1); });

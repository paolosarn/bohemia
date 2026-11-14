#!/usr/bin/env node
// JOBS [the months of jobs] 11/11 -- THE NEW KINDS ON HIS PHONE, PLAYED TO THE END (VAMILY rules 425, 441; the coordinator's round).
// The game on a phone (upright 390 x 844, sideways 844 x 390), the demo or the alpha (--alpha), A NEW CREW picked at the door. For each
// of the four Battle Brothers kinds we did not have (root out, break the ring, get it, restore) and the find-a-person job, the one-skull
// job of the kind: the crew is put at its client's own town, the town opens, a finger taps BOARD and then the client (when today's board
// deals the job; else the card is opened by the board's own offerSpeak, said), the card's WHAT IT ASKS line is read and photographed, a
// finger taps Take it, the town closes, and the job is played to the end where he would meet each part (the crew is put on each stop and
// the map's own arrival is called: the walk is the one shortcut, said): every fight opens on the page, every one of theirs is put down
// (THE LOOP's own way), the end screen's head is read and LEAVE is tapped; a talk card is answered with a finger (its first choice, the
// fight); until the job pays. Each row: the asks words, the fights' heads, the pay and the CLOUT it moved.
// node tools/bohemia_jobs_the_new_kinds_on_the_phone.js [--shapes phone_portrait,phone_landscape] [--alpha] [--out records/target/jobs_11_11] [--tag demo]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0;
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.join(ROOT, arg('--out', 'records/target/jobs_11_11')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
const ONLY = arg('--kinds', '');
const CODE = arg('--code', 'K7QM9X');   /* one valley for every surface and shape (a new game rolls its own; the day's floor differs by valley) */
const PLANT = arg('--plant', '');   /* --plant noasks: asks() taken away in this page only, for the gate's planted fail */
fs.mkdirSync(OUTD, { recursive: true });
/* each kind's three jobs, easiest first: the one his crew meets is the first its own town's board deals today */
const NEW = [
  { kind: 'root-out', word: 'ROOT OUT', ids: ['jb-root-stash', 'jb-root-pures', 'jb-root-skims'] },
  { kind: 'siege', word: 'BREAK THE RING', ids: ['jb-ring-gardens', 'jb-ring-trucks', 'jb-ring-solar'] },
  { kind: 'obtain', word: 'GET IT', ids: ['jb-get-die', 'jb-get-drive', 'jb-get-reels'] },
  { kind: 'restore', word: 'RESTORE', ids: ['jb-restore-school', 'jb-restore-chapel', 'jb-restore-pumps'] },
  { kind: 'find-person', word: 'FIND A PERSON', ids: ['jb-find-singer', 'jb-find-clerk', 'jb-find-dealers'] }];
/* --set r4 (JOBS 11/14, rule 447): escort a caravan, defend a place through a night, a job that changes halfway, a job two towns bid on */
const NEW4 = [
  { kind: 'haul-caravan', word: 'ESCORT', ids: ['jb-escort-water', 'jb-escort-trunks', 'jb-escort-strongbox'] },
  { kind: 'night-watch', word: 'WATCH', ids: ['jb-watch-clinic', 'jb-watch-tunnel', 'jb-watch-depot'] },
  { kind: 'turn', word: 'CHANGES HALFWAY', ids: ['jb-turn-speakers', 'jb-turn-panels', 'jb-turn-courier'] },
  { kind: 'bid', word: 'TWO TOWNS BID', ids: ['jb-bid-water-blues', 'jb-bid-water-reds', 'jb-bid-tv-network', 'jb-bid-tv-anarchists', 'jb-bid-hall-church', 'jb-bid-hall-mob'] }];
const R4 = arg('--set', '') === 'r4', SET = (R4 ? NEW4 : NEW).filter(k => !ONLY || ONLY.split(',').indexOf(k.kind) >= 0);

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], out = []; let board = null;
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  const tapIn = async (frameSel, xy) => { const h = await page.$(frameSel); const b = await h.boundingBox(); await page.touchscreen.tap(b.x + xy[0], b.y + xy[1]); };
  const shot = async (name) => { const p = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_' + name + '.png')); await page.screenshot({ path: path.join(ROOT, p) }); return p; };
  /* one fight on the page, to its end screen and LEAVE: who they were */
  async function fightOut(row, tag) {
    let cf = null;
    for (let i = 0; i < 150 && !cf; i++) { const h = await page.$('#fightFrame'); if (h) { const f = await h.contentFrame(); if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && typeof showOver === 'function').catch(() => false)) cf = f; } if (!cf) await page.waitForTimeout(200); }
    if (!cf) throw new Error('the fight page never stood');
    const th = await cf.evaluate(() => { const t = FIGHT.S.units.filter(u => u.side === 'them'); return { n: t.length, kinds: [...new Set(t.map(u => u.kind))].slice(0, 3) }; });
    await cf.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    let sf = null;
    await waitFor(async () => { const h = await page.$('#spoilsdoor iframe'); if (!h) return false; sf = await h.contentFrame(); return !!sf && await sf.evaluate(() => !!document.getElementById('head') || !!document.getElementById('leave')); }, 20000);
    if (sf) await waitFor(() => sf.evaluate(() => (document.getElementById('head').textContent || '').trim().length > 0), 8000);
    await page.waitForTimeout(900);
    const png = await shot(row.kind + '_fight' + tag);
    const head = sf ? await sf.evaluate(() => (document.getElementById('head').textContent || '').trim()) : null;
    if (sf) { const b = await sf.evaluate(() => { const e = document.getElementById('leave'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
      if (b) await tapIn('#spoilsdoor iframe', b); }
    await waitFor(async () => !(await fightUp()), 20000); await page.waitForTimeout(1200);
    row.fights.push({ head, n: th.n, kinds: th.kinds, png });
  }
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && BohemiaJobKinds.asks && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobDanger && window.LOOP && LOOP.start && PARTY_MATH.loaded && window.BohemiaRenown, null, { timeout: 180000 });
    await page.waitForTimeout(2500);
    if (PLANT === 'noasks') await fr.evaluate(() => { BohemiaJobKinds.asks = null; });
    for (const K of SET) {
      const row = { kind: K.kind, word: K.word, id: null, town: null, dealt: null, asks: null, fights: [], talks: [], paid: null, clout: null, steps: [] };
      try {
        await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; try { loopClose(); } catch (e) {} });
        /* the first board that posts one of the kind's jobs: today's, else the next board's (a board turns every refresh_days; the day's
           floor holds a job back from a new crew while it would lose it more often than win, rule 255) */
        const cands = await fr.evaluate((ids) => { const all = BohemiaBoardShelf.shelf().offers, bs = ctBases() || {}, d0 = 1, step = BohemiaBoardShelf.shelf().refresh_days || 3, out = [];   /* each kind on its own run, from day 1 */
          for (const id of ids) { for (let d = d0; d <= d0 + 8 * step && out.length < 6; d += (d === d0 ? step - ((d0 - 1) % step) : step)) { DAY.day = d; const P = BohemiaBoardShelf.mapPlaces(d) || [];   /* every job of the list on every day it is posted */ const o = all.filter(x => x.id === id)[0]; if (!o) continue; const n = (o.towns || [])[0], p = P.filter(q => q.name === n)[0], b = bs[n]; if (!p || !b) continue;
            const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, d, { traits: p.traits || [], held: [], places: P }) || [];
            if (L.some(x => x.id === id)) out.push({ id, n, x: b.x, y: b.y, day: d }); } }
          return out; }, K.ids);
        if (!cands.length) throw new Error('none of ' + K.ids.join(', ') + ' is posted on its own board in nine windows');
        const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
        let sfH = null, sf = null, t = null; row.misses = [];
        const finger = async (sel) => { for (let k = 0; k < 30; k++) {   /* up to ~10 s: a hint that lies over the board's first person for a few seconds (EYES row 612) goes, as he would wait */
            const c = await sf.evaluate((q) => { const b = document.querySelector(q); if (!b) return null; b.scrollIntoView({ block: 'center', behavior: 'instant' }); const r = b.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2, e = document.elementFromPoint(x, y);
              return { x, y, on: !!e && (e === b || b.contains(e)), cover: e && !(e === b || b.contains(e)) ? ((e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '') + ' ' + String(e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)) : null }; }, sel);
            if (!c) return false; if (c.cover) fingerCover = c.cover;
            if (c.on) { await page.waitForTimeout(250); const c2 = await sf.evaluate((q) => { const r = document.querySelector(q).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);
              if (Math.abs(c2[0] - c.x) < 1 && Math.abs(c2[1] - c.y) < 1) { const hb = await sfH.boundingBox(); await page.touchscreen.tap(hb.x + c.x, hb.y + c.y); return true; } }
            await page.waitForTimeout(300); } return false; };
        let before = null, fingerCover = null;
        for (const cand of cands) {   /* the town on that day, its BOARD with a finger: is the job there, as the deal said */
          t = cand; K.id = row.id = t.id; row.day = t.day; row.town = t.n;
          await fr.evaluate((d) => { try { loopClose(); } catch (e) {} DAY.day = d; }, t.day); await page.waitForTimeout(500);
          before = await fr.evaluate(() => ({ clout: BohemiaRenown.score(), paid: (window.__JOB_PAID || []).length, gifts: ((window.BohemiaRoadMore && BohemiaRoadMore.status && BohemiaRoadMore.status().gifts) || []).length }));
          for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); city.x = t.x; city.y = t.y; townTap({ name: t.n, x: t.x, y: t.y }); }, t); await waitFor(settleOpen, 60000);
            if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
          if (!(await settleOpen())) throw new Error('the town did not open');
          sfH = await fr.$('#settleFrame'); sf = await sfH.contentFrame();
          await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), t.n), 20000);
          for (let k = 0; k < 4; k++) {
            const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox();
            if (xy) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y);
            if (await waitFor(() => sf.evaluate((n) => BohemiaSettlement.state.open === 'board' && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n && document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0, t.n), 8000)) break;   /* this town's board, not the last town's sheet */
          }
          row.dealt = await sf.evaluate((q) => !!document.querySelector(q), '#sheet button.act.client[data-id="' + t.id + '"]');
          if (row.dealt) { fingerCover = null; if (await finger('#sheet button.act.client[data-id="' + t.id + '"]')) { row.tapped = true; break; }
            row.misses.push(t.id + '@' + t.n + ' day ' + t.day + ': on the board, but no finger could reach it (under the finger: ' + (fingerCover || 'it kept moving') + ')'); row.dealt = false; continue; }
          row.misses.push(t.id + '@' + t.n + ' day ' + t.day + ' (the board: ' + (await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id).join(','))) + ', its day ' + (await sf.evaluate(() => { try { return buildDay(); } catch (e) { return '?'; } })) + ')');
        }
        const sel = '#sheet button.act.client[data-id="' + K.id + '"]';
        const clientName = await fr.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; return o && o.client ? String(o.client.name).toUpperCase() : null; }, K.id);
        const cardIs = () => sf.evaluate((nm) => { const e = document.querySelector('#sheet .say .nm'); return !!e && (e.textContent || '').indexOf(nm) >= 0 && !!document.querySelector('#sheet .say .trip.asks'); }, clientName);
        if (!row.dealt) throw new Error('not on its own board when opened: ' + row.misses.join(' | '));
        if (!(await waitFor(cardIs, 15000))) throw new Error('the card is not ' + clientName + "'s, or says nothing of what it asks");
        await sf.evaluate(() => { const e = document.querySelector('#sheet .say .trip.asks'); if (e) e.scrollIntoView({ block: 'center', behavior: 'instant' }); });
        await page.waitForTimeout(700);
        row.asks = await sf.evaluate(() => document.querySelector('#sheet .say .trip.asks').textContent);
        row.card = await shot(K.kind + '_card');
        await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button')].filter(x => /^Take it/.test((x.textContent || '').trim()) && !x.disabled)[0]; if (b) b.setAttribute('data-yes', '1'); });
        if (!(await finger('#sheet button[data-yes="1"]'))) throw new Error('no Take it on the card');
        if (!(await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), K.id), 10000))) throw new Error('Take it made no job');
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(800);
        /* a job two towns bid on: the other town's board, dealt now, no longer has its side */
        row.rival = await fr.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; if (!o || !o.rival) return null; const r = BohemiaBoardShelf.shelf().offers.filter(x => x.id === o.rival)[0], tn = r && (r.towns || [])[0];
          const P = BohemiaBoardShelf.mapPlaces(loopDay()) || [], p = P.filter(q => q.name === tn)[0]; if (!p) return { id: o.rival, town: tn, err: 'no town' };
          const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, loopDay(), { traits: p.traits || [], held: LOOP.held.map(h => h.id), places: P }) || [];
          return { id: o.rival, town: tn, gone: !L.some(x => x.id === o.rival) }; }, K.id);
        /* the job, played to the end */
        for (let s = 0; s < 16; s++) {
          const st = await fr.evaluate((id) => {
            const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return { gone: true };
            const at = (x, y) => { travelStop(); city.x = x; city.y = y; };
            let x, y, what;
            if (j.plays === 'haul-caravan' && !j.__raided) { j.__raided = 1;   /* the raid where the road meets it: he walks the carts a block at a time toward the gate (the raid comes AHEAD on his road) */
              const D = j.dest && !j.dest.made ? null : j.dest, tx = (D && D.x != null) ? D.x : j.target.x, ty = (D && D.y != null) ? D.y : j.target.y;
              for (let k = 0; k < 40 && !LOOP.fighting; k++) { const sx = Math.sign(tx - city.x), sy = Math.sign(ty - city.y); if (!sx && !sy) break; at(city.x + sx, city.y + sy); BohemiaJobKinds.step();
                if (j.raid) { for (let q = 0; q < 12 && !LOOP.fighting && j.raid; q++) { at(city.x + Math.sign(j.raid.x - city.x), city.y + Math.sign(j.raid.y - city.y)); BohemiaJobKinds.step(); } } }
              return { what: 'raid on the road', fight: !!LOOP.fighting }; }
            if (j.legs) { const L = j.legs[j.li | 0]; if (!L) return { stuck: 'no leg' }; x = L.x; y = L.y; what = 'leg ' + (j.li | 0) + ' ' + (L.act || L.go) + (L.twistLeg ? ' (twist)' : ''); }
            else if (j.plays === 'find-person' && j.stage === 'look') { x = j.spot.x; y = j.spot.y; what = 'look'; }
            else { x = j.target.x; y = j.target.y; what = j.stage; }
            at(x, y); const r = BohemiaJobKinds.arrived(x, y) || BohemiaJobKinds.step();
            return { what, fight: !!r };
          }, K.id);
          if (st.gone) break;
          if (st.stuck) throw new Error(st.stuck);
          row.steps.push(st.what);
          await page.waitForTimeout(1200);
          /* a talk card: a finger on its first choice */
          const tb = await fr.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Stand and fight|Take all of it|Finish the job/i.test(x.textContent || '') && x.getBoundingClientRect().width > 0)[0]; if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, (b.textContent || '').trim()]; });
          if (tb) { row.talks.push(tb[2]); await tapIn('#cityFrame', tb); await page.waitForTimeout(1000); }
          if (await waitFor(fightUp, tb || st.fight ? 20000 : 2500)) await fightOut(row, '_' + row.fights.length);
        }
        const after = await fr.evaluate((id) => ({ clout: BohemiaRenown.score(), paid: (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, held: LOOP.held.some(h => h.id === id), gifts: ((window.BohemiaRoadMore && BohemiaRoadMore.status && BohemiaRoadMore.status().gifts) || []).slice(-3).map(g => g.name + (g.waiting ? ' (waits for his place)' : '')) }), K.id);
        row.paid = after.paid; row.clout = after.clout - before.clout; row.done = !after.held && !!after.paid; row.home = after.gifts.slice(Math.max(0, after.gifts.length - 3));
        row.homeNew = await fr.evaluate(() => ((window.BohemiaRoadMore && BohemiaRoadMore.status && BohemiaRoadMore.status().gifts) || []).length) - before.gifts;
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + TAG + ' ' + shape + ' ' + K.word.padEnd(15) + ' ' + K.id + ' at ' + row.town + ' day ' + row.day + (row.dealt ? ' (dealt)' : ' (opened)') + ': ' + (row.err ? 'ERR ' + row.err : (row.done ? 'PAID ' + row.paid.paid + ' of ' + row.paid.of : 'NOT PAID') + ', +' + row.clout + ' CLOUT, fights: ' + row.fights.map(f => f.head).join(' | ') + (row.talks.length ? ', talk: ' + row.talks.join('/') : '') + (row.rival ? ', rival ' + row.rival.id + ' at ' + row.rival.town + (row.rival.gone ? ' GONE' : ' STILL POSTED') : '') + (row.homeNew > 0 ? ', to his place: ' + row.home.join('; ') : '')));
      console.log('      asks: ' + row.asks + '\n      steps: ' + (row.steps || []).join(' > ') + (row.misses && row.misses.length ? '\n      misses: ' + row.misses.join(' | ') : ''));
    }
    /* --set r4, row 610: a board he has read stays what he read until its time is up. Read a town's board with a finger, let the day
       turn inside the board's window (the deal's key moves: the day, the towns' news, the floor), open it again: the same people */
    if (R4) { board = { town: null };
      try { const step = await fr.evaluate(() => BohemiaBoardShelf.shelf().refresh_days || 3);
        const tn = await fr.evaluate(() => { const P = BohemiaBoardShelf.mapPlaces(loopDay()) || []; const q = P.filter(p => p.tier !== 'camp')[0] || P[0]; return q && q.name; });
        board.town = tn;
        const d0 = await fr.evaluate((st) => { let d = loopDay() || 1; if (Math.floor((d + 1) / st) !== Math.floor(d / st)) d++; DAY.day = d; return d; }, step);
        const readBoard = async () => { await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
          await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 60000);
          if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
          const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
          await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 20000);
          for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(); if (xy) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y);
            if (await waitFor(() => sf.evaluate((n) => BohemiaSettlement.state.open === 'board' && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n && document.querySelectorAll('#sheet button.act.client').length > 0, tn), 8000)) break; }
          await page.waitForTimeout(1500);
          const ids = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
          board.log = (board.log || []).concat([await sf.evaluate((n) => JSON.stringify({ read: JSON.parse(localStorage.getItem('bohemia.board.read.v1') || '{}')[n], place: BohemiaSettlement.state.place && BohemiaSettlement.state.place.name, pick: (function () { try { var S2 = BohemiaSettlement.state; return (BohemiaBoardShelf.pick(S2.place, S2.mapDay, { traits: (S2.traits || []).map(function (x) { return x.id; }), held: S2.held.slice(), done: (S2.done || []).slice(), places: S2.places }) || []).map(function (o) { return o.id; }); } catch (e) { return 'ERR ' + e.message; } })(), errs: (window.__SETTLE_ERRS || []).slice(-3), shelfReady: !!(window.BohemiaBoardShelf && BohemiaBoardShelf.ready()), places: (BohemiaSettlement.state.places || []).length, mapDay: (window.BohemiaSettlement && BohemiaSettlement.state && BohemiaSettlement.state.mapDay), held: BohemiaSettlement.state.held, done: BohemiaSettlement.state.done }), tn)]);
          await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600); return ids; };
        board.before = await readBoard(); board.day0 = d0;
        board.day1 = await fr.evaluate(() => { DAY.day = DAY.day + 1; return DAY.day; });
        board.after = await readBoard();
        board.same = board.before.length > 0 && board.before.join(',') === board.after.join(',');
      } catch (e) { board.err = String(e && e.message || e).slice(0, 200); }
      console.log('  ' + TAG + ' ' + shape + ' THE READ BOARD at ' + board.town + ', day ' + board.day0 + ' then ' + board.day1 + ': ' + (board.err ? 'ERR ' + board.err : (board.same ? 'THE SAME ' : 'CHANGED ') + JSON.stringify(board.before) + ' / ' + JSON.stringify(board.after) + ' ' + (board.log || []).join(' ; '))); }
  } catch (e) { out.push({ err: String(e && e.message || e).slice(0, 300) }); console.log('  ' + TAG + ' ' + shape + ' ERR ' + String(e && e.message || e).slice(0, 300)); }
  await d.close().catch(() => {});
  return { shape, alpha: ALPHA, rows: out, errs, board };
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'new_kinds_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_new_kinds_on_the_phone.js', tag: TAG, alpha: ALPHA, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();

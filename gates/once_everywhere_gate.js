/* ==========================================================================
   ONCE, EVERYWHERE  (HOME BASE 4, 11/26/26, VAMILY rule 479(b)(c); the routine's 479(c): 'count every built thing and its people at every
   zoom, both orientations, every camera, every settlement and his place; fix any repeat; do not ask him for a screenshot')

   PAOLO 11/22: 'on the cook, you have these walls and then there's an actual cook guy, but then they repeat like 20 times, so now there's
   like 20 guys... you're not being logical with this shit'. Rule 479(b): ONE THING IS DRAWN ONCE; its people are as many as it really
   holds; a repeat is a bug. Rule 479(c): a check counts it on a phone at every zoom and in every camera.

   ON THE DEMO, upright (390 x 844) and sideways (844 x 390), a new game: his place planted, the grinder, the forge, the yard and the
   lookout built, the camp's cook, blacksmith and surgeon hired (the cook pushes his cart behind him on the map, rule 471):
     O1  THE MAP at eight zooms from its farthest to its closest, walking and camped: he is drawn once, his two men at most twice, each of
         the camp's people at most once (the map's own count of the frame, MAP_DREW: youCount, company, campAt)
     O2  EVERY SETTLEMENT (the fourteen and his place): each person once (who they are, and each name once) and each door once
         (BohemiaSettlement.folk, doorFronts); at his place the footage too: each thing once, each person once (__HOME_FEED_DRAWN)
     O3  THE CAMP: each of his people once (BohemiaSettlement.folk in camp)
     P   PLANTED: a town with one person handed twice reads red; a map frame with him drawn twice reads red (the same checks, run on a
         copy with the repeat put in)
   About 8 minutes. Run: node gates/once_everywhere_gate.js [--only phone_portrait]
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(__dirname, '..', 'tools', 'bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (c || !d ? '' : '  [' + String(d).slice(0, 900) + ']')); };
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
/* the checks, the same on the real counts and on a planted copy */
const mapOnce = (m) => m.you === 1 && m.company <= 2 && m.campAt <= m.staff && m.campIds === m.campAt;
const townOnce = (L, doors) => { const ids = {}, names = {}, rep = [];
  L.forEach(p => { ids[p.id] = (ids[p.id] | 0) + 1; if (p.name && !p.crowd) names[p.name] = (names[p.name] | 0) + 1; });
  Object.keys(ids).forEach(k => { if (ids[k] > 1) rep.push(k + ' x' + ids[k]); }); Object.keys(names).forEach(k => { if (names[k] > 1) rep.push(k + ' x' + names[k]); });
  const o = {}; doors.forEach(k => o[k] = (o[k] | 0) + 1); Object.keys(o).forEach(k => { if (o[k] > 1) rep.push('door ' + k + ' x' + o[k]); });
  return rep; };
(async () => {
  for (const prof of PROFS) {
    console.log('-- ' + prof);
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    try {
      for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaCamp)).catch(() => false)) break; await P.waitForTimeout(250); }
      const set = await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
        const x0 = city.x, y0 = city.y; let at = null;
        for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
        BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 30; w.food = 12; wagonPut(w);
        ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3;
        ['cook', 'blacksmith', 'surgeon'].forEach(id => { try { BohemiaCamp.hire(id); } catch (e) {} });
        return { at, staff: BohemiaCamp.staff().map(s => s.id), zb: zoomBounds(), towns: Object.keys(ctBases()) }; });
      /* O1 THE MAP */
      const zs = []; for (let i = 0; i < 8; i++) zs.push(+(set.zb[0] * Math.pow(set.zb[1] / set.zb[0], i / 7)).toFixed(3));
      const mapAt = async () => { const out = [];
        for (const z of zs) { await F.evaluate((z) => { setZoomAt(z, innerWidth / 2, innerHeight / 2); try { render(); } catch (e) {} }, z); await P.waitForTimeout(600);
          out.push(await F.evaluate(() => { const M = window.MAP_DREW || {}, ca = M.campAt || []; return { z: +CZOOM.toFixed(2), you: M.youCount | 0, company: M.company | 0, campAt: ca.length, campIds: new Set(ca.map(c => c[0] + ',' + c[1])).size, staff: BohemiaCamp.staff().length }; })); }
        return out; };
      const walk = await mapAt();
      ok('O1 THE MAP walking, ' + zs.length + ' zooms (' + zs[0] + ' to ' + zs[zs.length - 1] + '): he once, his two at most twice, each of the camp\'s ' + set.staff.length + ' at most once (' + walk.map(m => m.you + '/' + m.company + '/' + m.campAt).join(' ') + ')', walk.length === 8 && walk.every(mapOnce), JSON.stringify(walk));
      await F.evaluate(() => { try { campMake(); } catch (e) {} });
      for (let i = 0; i < 40; i++) { await P.waitForTimeout(250); if (await F.evaluate(() => { try { return !!(BohemiaCampMap.state().onMap || (LOOP.frame && LOOP.frame.contentWindow.BohemiaSettlement.state.camp)); } catch (e) { return false; } }).catch(() => false)) break; }
      await P.waitForTimeout(1200);
      await F.evaluate(() => { try { if (window.BohemiaCampMap) BohemiaCampMap.peek(true); } catch (e) {} });   /* he looks at the map from his camp */
      for (let i = 0; i < 30; i++) { await P.waitForTimeout(250); if (await F.evaluate(() => { try { render(); } catch (e) {} return ((window.MAP_DREW || {}).campAt || []).length > 0; }).catch(() => false)) break; }
      const camped = await mapAt();
      ok('O1 THE MAP camped, the same zooms: he once, his two, the cook with his cart and the rest each once (' + camped.map(m => m.you + '/' + m.company + '/' + m.campAt).join(' ') + ')', camped.length === 8 && camped.every(mapOnce) && camped.some(m => m.campAt >= 1), JSON.stringify(camped));
      const twice = Object.assign({}, camped[camped.length - 1], { you: 2 });
      ok('O1 planted: a frame with him drawn twice reads red', !mapOnce(twice), JSON.stringify(twice));
      /* O2 EVERY SETTLEMENT */
      await F.evaluate(() => { try { if (window.BohemiaCampMap) BohemiaCampMap.peek(false); } catch (e) {} });
      const sf = async () => { for (let i = 0; i < 60; i++) { for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) return x; await P.waitForTimeout(250); } return null; };
      const read = (fr) => fr.evaluate(() => { const B = BohemiaSettlement, L = (B.folk() || []).map(p => ({ id: p.keeper ? 'k:' + p.k : p.post ? 'p:' + p.rid : p.crewMan ? 'm:' + (p.name || p.look) : p.campMan ? 'c:' + (p.name || p.look) : 'x:' + p.slot, name: (p.name || '').trim(), crowd: !!p.crowd }));
        let doors = []; try { doors = (B.doorFronts() || []).map(o => o.k || o.key || JSON.stringify(o).slice(0, 24)); } catch (e) {}
        const hf = window.__HOME_FEED && window.__HOME_FEED.on && window.__HOME_FEED_DRAWN ? window.__HOME_FEED_DRAWN() : null;
        return { place: B.state.place && B.state.place.name, camp: !!B.state.camp, L, doors, feed: hf ? { pieces: hf.pieces, people: hf.people } : null }; });
      const towns = []; let firstL = null;
      for (const n of set.towns) {
        await F.evaluate((n) => { try { loopClose(); } catch (e) {} const bs = ctBases(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, n);
        await P.waitForTimeout(1200); const fr = await sf(); if (!fr) { towns.push({ n, err: 'no screen' }); continue; } await P.waitForTimeout(1500);
        const r = await read(fr).catch(e => ({ err: e.message })); if (r.err) { towns.push({ n, err: r.err }); continue; }
        const rep = townOnce(r.L, r.doors);
        if (r.feed) { Object.keys(r.feed.pieces).forEach(k => { if (r.feed.pieces[k] > 1) rep.push('piece ' + k); }); Object.keys(r.feed.people).forEach(k => { if (r.feed.people[k] > 1) rep.push('on the footage ' + k); }); }
        if (!firstL && r.L.length > 3) firstL = r;
        towns.push({ n, folk: r.L.length, doors: r.doors.length, feed: !!r.feed, rep }); }
      ok('O2 EVERY SETTLEMENT (' + towns.length + '): each person once, each name once, each door once' + (towns.some(t => t.feed) ? ', and at his place each thing and person on the footage once' : '') + ' (' + towns.map(t => t.n + ' ' + (t.err ? 'ERR' : t.folk + '/' + t.doors)).join(', ') + ')',
        towns.length >= 14 && towns.every(t => !t.err && !t.rep.length) && towns.some(t => t.feed), JSON.stringify(towns.filter(t => t.err || (t.rep && t.rep.length))));
      if (firstL) { const L2 = firstL.L.concat([Object.assign({}, firstL.L.filter(p => p.name && !p.crowd)[0] || firstL.L[0])]);
        ok('O2 planted: ' + firstL.place + ' with one of its people handed twice reads red', townOnce(L2, firstL.doors).length > 0); }
      /* O3 THE CAMP */
      await F.evaluate(() => { try { loopClose(); } catch (e) {} try { campMake(); } catch (e) {} }); await P.waitForTimeout(3500);
      const cf = await sf(); let cr = null;
      if (cf) for (let i = 0; i < 60; i++) { await P.waitForTimeout(250); cr = await read(cf).catch(() => null); if (cr && cr.camp && cr.L.length >= 3) { await P.waitForTimeout(800); cr = await read(cf).catch(() => cr); break; } }   /* the camp comes up in view (CAMP FOUR 11/26l): counted once its people stand */
      const crep = cr ? townOnce(cr.L.map(p => Object.assign({}, p, { crowd: false })), []) : ['no camp'];
      ok('O3 THE CAMP: each of his ' + (cr ? cr.L.length : '?') + ' people once (' + (cr ? cr.L.map(p => p.name).filter(Boolean).join(', ') : '') + ')', !!cr && cr.camp && cr.L.length >= 3 && !crep.length, JSON.stringify(crep));
    } catch (e) { ok('the walk ran (' + prof + ')', false, e && e.message); }
    await d.close();
  }
  console.log('ONCE, EVERYWHERE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

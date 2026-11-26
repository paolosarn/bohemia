/* HOME BASE 4, 11/26/26 (VAMILY rule 480(c), ask row 729): his place on a phone slowed four times (390 x 844 and 844 x 390, Chrome's own CPU throttle): the door in, standing, two camera cuts, the grinder's station open and shut; frames and long tasks per step. --old <file> serves another BOHEMIA_SETTLEMENT_SCREEN.html (the before); --prof and --profcut print a CPU profile. Run: node tools/bohemia_home_base_his_place_on_a_slow_phone_11_26_26.js --out <json> [--only phone_portrait] [--old <file>] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = (arg('--only') || 'phone_portrait,phone_landscape').split(','), OLD = arg('--old');
const res = {};
(async () => {
  for (const prof of PROFS) {
    const opts = { profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } };
    if (OLD) opts.serve = { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': OLD };
    const d = await drive.open(opts);
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
    await F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
      const x0 = city.x, y0 = city.y; let at = null;
      for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
      BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 30; w.food = 12; wagonPut(w);
      ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3;
      BohemiaHomeMap.grinderFight({ outcome: { victory: true, bodies: [{ beast: false }, { beast: false }, { beast: false }] } }); });
    await P.waitForTimeout(2500);
    const rec = async () => { for (const f of P.frames()) await f.evaluate(() => { if (window.__pf) return; window.__pf = { lt: [] }; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__pf.lt.push([e.startTime + performance.timeOrigin, e.duration]))).observe({ type: 'longtask', buffered: false }); } catch (e) {} }).catch(() => {});
      await P.evaluate(() => { window.__fr = []; let last = performance.now(); const go = (t) => { window.__fr.push([t + performance.timeOrigin, t - last]); last = t; window.__frRaf = requestAnimationFrame(go); }; window.__frRaf = requestAnimationFrame(go); }); };
    const stop = async (name) => { const fr = await P.evaluate(() => { cancelAnimationFrame(window.__frRaf); return window.__fr; }); const t0 = fr.length ? fr[0][0] : 0, t1 = fr.length ? fr[fr.length - 1][0] : 0;
      let lt = []; for (const f of P.frames()) lt = lt.concat(await f.evaluate(() => (window.__pf ? window.__pf.lt.splice(0) : [])).catch(() => []));
      const seen = {}; lt = lt.filter(x => { const k = Math.round(x[0]); if (seen[k]) return false; seen[k] = 1; return x[0] >= t0 - 5 && x[0] <= t1 + 5; });
      const ds = fr.slice(1).map(x => x[1]); const r = { secs: +((t1 - t0) / 1000).toFixed(1), fps: +(ds.length / ((t1 - t0) / 1000 || 1)).toFixed(1), hitches: ds.filter(x => x > 50).length, worst: Math.round(Math.max(0, ...ds)), worst3: ds.slice().sort((a, b) => b - a).slice(0, 3).map(Math.round), longest: Math.round(Math.max(0, ...lt.map(x => x[1]))), tasksMs: Math.round(lt.reduce((a, x) => a + x[1], 0)) };
      (res[prof] = res[prof] || {})[name] = r; console.log(prof, name, JSON.stringify(r)); };
    const cdp = await P.context().newCDPSession(P); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await rec();
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 120 && !fr; i++) { await P.waitForTimeout(250); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    await P.waitForTimeout(3000); await stop('1_door_in');
    for (let i = 0; i < 24; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
    await P.waitForTimeout(1500);
    if (process.argv.includes('--prof')) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 1000 }); await cdp.send('Profiler.start'); await P.waitForTimeout(5000); const { profile } = await cdp.send('Profiler.stop');
      const self = {}, byId = {}; profile.nodes.forEach(n => byId[n.id] = n); const dt = profile.timeDeltas, smp = profile.samples; const tot = {};
      for (let i = 0; i < smp.length; i++) { const n = byId[smp[i]], cf = n.callFrame, k = (cf.functionName || '(anon)') + ' ' + (cf.url || '').split('/').pop() + ':' + cf.lineNumber; self[k] = (self[k] || 0) + (dt[i] || 0); }
      const parent = {}; profile.nodes.forEach(n => (n.children || []).forEach(c => parent[c] = n.id));
      for (let i = 0; i < smp.length; i++) { const seen = new Set(); let id = smp[i]; while (id) { const cf = byId[id].callFrame, k = (cf.functionName || '(anon)') + ' ' + (cf.url || '').split('/').pop() + ':' + cf.lineNumber; if (!seen.has(k)) { tot[k] = (tot[k] || 0) + (dt[i] || 0); seen.add(k); } id = parent[id]; } }
      console.log('SELF', JSON.stringify(Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 25).map(x => [x[0], Math.round(x[1] / 1000)])));
      console.log('TOTAL', JSON.stringify(Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 40).map(x => [x[0], Math.round(x[1] / 1000)]))); }
    await rec(); await P.waitForTimeout(4000); await stop('2_standing');
    const profRun = async (label, fn) => { await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start'); await fn(); const { profile } = await cdp.send('Profiler.stop');
      const byId = {}; profile.nodes.forEach(n => byId[n.id] = n); const parent = {}; profile.nodes.forEach(n => (n.children || []).forEach(c => parent[c] = n.id)); const tot = {}, dt = profile.timeDeltas, smp = profile.samples;
      for (let i = 0; i < smp.length; i++) { const seen = new Set(); let id = smp[i]; while (id) { const cf = byId[id].callFrame, k = (cf.functionName || '(anon)') + ' ' + (cf.url || '').split('/').pop() + ':' + cf.lineNumber; if (!seen.has(k)) { tot[k] = (tot[k] || 0) + (dt[i] || 0); seen.add(k); } id = parent[id]; } }
      console.log(prof, label, 'TOTAL', JSON.stringify(Object.entries(tot).sort((a, b) => b[1] - a[1]).slice(0, 28).map(x => [x[0], Math.round(x[1] / 1000)]))); };
    if (process.argv.includes('--profcut')) { for (const c of ['cutA', 'cutB']) await profRun(c, async () => { await rec(); await fr.evaluate(() => window.__HOME_FEED_AGE(99999)); await P.waitForTimeout(3000); await stop(c); }); }
    await rec(); await fr.evaluate(() => window.__HOME_FEED_AGE(99999)); await P.waitForTimeout(3000); await stop('3_cam_cut');
    await rec(); await fr.evaluate(() => window.__HOME_FEED_AGE(99999)); await P.waitForTimeout(3000); await stop('4_cam_cut2');
    const fb = await (await fr.frameElement()).boundingBox();
    const w = await fr.evaluate(() => { const f = window.__HOME_FEED || {}, s = f.slots || {}; const n = Object.keys(s).filter(n => s[n].id === 'grinder')[0]; return n ? window.__HOME_FEED_AT(+n) : null; });
    await rec(); if (w) await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(2500); await stop('5_grinder_open');
    await rec(); await fr.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(2000); await stop('6_shut');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await d.close();
  }
  fs.writeFileSync(arg('--out'), JSON.stringify(res, null, 1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });

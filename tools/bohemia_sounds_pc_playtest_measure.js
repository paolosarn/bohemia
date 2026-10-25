#!/usr/bin/env node
/* BOHEMIA -- THE PC PLAYTEST, THE SOUND'S PART, MEASURED IN THE DEMO (SOUNDS 10/25/26, row [the PC playtest: the sound's
   part], rule 164 items 19, 20, 23; records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md).
   His words: 'they just kept running and running and overlapping each other, and even when I left the city I was still
   hearing them'; 'they're getting repetitive, not that different from each other'; the song after a battle 'so bad, so
   terrible'.

   WHAT IT DOES, on the demo through its own door (tools/bohemia_drive_the_demo.js, the title passed):
   THE TOWN: every squiggle any frame says is logged at the call (the recorded player and the 8/11 voice, in the shell and in
   the settlement screen alike, armed in every frame before its scripts run), with when it is heard and when it was cut;
   a town is opened from the map, its people tapped, he stays a while, then LEAVE (the map's own loopClose) and he waits on
   the map. Out: how many lines, how many pairs overlap (two voices heard at once for 50 ms or more), the longest line,
   and every voice still heard after the frame was hidden, and for how long.
   THE FIGHT (--fight): a road fight through the map's own door on AUTO, seeded; from the fight's BOHEMIA_FIGHT_OVER the
   song the fence says is playing every 250 ms for 30 s, every STING the shell plays, and every song name heard.
   Run: node tools/bohemia_sounds_pc_playtest_measure.js [--town] [--fight] [--out file.json]   (both when neither is named) */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const A = process.argv.slice(2);
const want = k => A.includes('--' + k) || (!A.includes('--town') && !A.includes('--fight'));
const OUT = A.includes('--out') ? A[A.indexOf('--out') + 1] : null;
const PROFILE = A.includes('--profile') ? A[A.indexOf('--profile') + 1] : 'phone_portrait';   /* he played on his PC: --profile computer */
const STAY = A.includes('--stay') ? +A[A.indexOf('--stay') + 1] : 15;                        /* seconds he looks around before and after the taps */

/* armed in every frame: wrap the two voice engines the moment they are assigned, log every line on the top window */
const ARM = `(function(){
  var TOP; try { TOP = window.top; void TOP.document; } catch (e) { TOP = window; }
  var LOG = function () { try { return TOP.__VLOG || (TOP.__VLOG = []); } catch (e) { return (window.__VLOG = window.__VLOG || []); } };
  var here = String(location.pathname).split('/').pop();
  function wrapHandle(h, kind, text, AC, extra) {
    if (!h || !AC) return h;
    var now = Date.now(), st = h.start != null ? h.start : AC.currentTime;
    var e = { frame: here, kind: kind, text: String(text), start: now + (st - AC.currentTime) * 1000, said: now,
              end: now + (st - AC.currentTime + (h.tail || h.seconds || 0)) * 1000, seconds: h.seconds, blips: h.blips, family: h.family, stopAt: null };
    if (extra) for (var k in extra) e[k] = extra[k];
    LOG().push(e);
    var s = h.stop; h.stop = function () { if (e.stopAt == null) e.stopAt = Date.now(); return s && s.apply(h, arguments); };
    return h;
  }
  function hook(name, fix) {
    var v; try { Object.defineProperty(window, name, { configurable: true, get: function () { return v; }, set: function (x) { v = x; try { fix(x); } catch (e) {} } }); } catch (e) {}
  }
  hook('BOH_VOICE_RECORDED', function (M) {
    var mk = M.make; M.make = function () { var P = mk.apply(M, arguments), sy = P.say;
      P.say = function (text, v, AC) { var h = sy.apply(P, arguments); return wrapHandle(h, 'recorded', text, AC); }; return P; };
  });
  hook('BOH_VOICE', function (B) {
    var sy = B.say; B.say = function (text, v, AC) { var h = sy.apply(B, arguments); return wrapHandle(h, 'old', text, AC); };
  });
})();`;

function overlaps(L) {
  const heard = L.map(e => ({ ...e, to: e.stopAt != null ? Math.min(e.end, e.stopAt + 20) : e.end })).filter(e => e.to > e.start);
  const pairs = [];
  for (let i = 0; i < heard.length; i++) for (let j = i + 1; j < heard.length; j++) {
    const a = heard[i], b = heard[j], o = Math.min(a.to, b.to) - Math.max(a.start, b.start);
    if (o >= 50) pairs.push({ a: a.frame + ' "' + a.text + '"', b: b.frame + ' "' + b.text + '"', ms: Math.round(o) });
  }
  return { heard, pairs };
}

(async () => {
  const R = {};
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, arm: ARM + (want('fight') ? `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } }); })();` : ''),
    beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { console.log('the demo did not boot: ' + e.message); process.exit(2); }
  const p = d.page; const perr = []; p.on('pageerror', e => perr.push(String(e.message)));
  const tap = (x, y) => PROFILE === 'computer' ? p.mouse.click(x, y) : p.touchscreen.tap(x, y);
  await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.AC && MUS.AC.state === 'running' && window.SQUIGGLE, null, { timeout: 30000 });
  await p.waitForFunction(() => SQUIGGLE.ready(), null, { timeout: 60000 }).catch(() => {});

  if (want('town')) {
    const name = await d.fr.evaluate(() => { const bs = ctBases(), ks = Object.keys(bs), n = ks[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; });
    let f = null;
    for (let k = 0; k < 80 && !f; k++) { await p.waitForTimeout(500);
      for (const fr of p.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
        const ok = await fr.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false);
        if (ok) f = fr; } }
    const box = f ? await (await f.frameElement()).boundingBox() : null;
    /* he looks around: a first tap anywhere on the picture unlocks the screen's sound (a phone plays nothing before one) */
    if (box) await tap(box.x + box.width * 0.5, box.y + box.height * 0.35);
    await p.waitForTimeout(STAY * 1000);
    /* he talks to everybody who stands still, one after another, the way he did */
    const order = f ? await f.evaluate(() => { try { return BohemiaSettlement.order(); } catch (e) { return []; } }).catch(() => []) : [];
    let tapped = 0;
    for (const key of (order || []).slice(0, 5)) {
      const w = await f.evaluate(k => { try { return BohemiaSettlement.where(k); } catch (e) { return null; } }, key).catch(() => null);
      if (!w || !box) continue;
      await tap(box.x + w.x, box.y + w.y); tapped++;
      await p.waitForTimeout(1300);
      /* and closes the sheet to tap the next (the screen's own hide()) */
      await f.evaluate(() => { try { hide(); } catch (e) {} }).catch(() => {});
      await p.waitForTimeout(500);
    }
    await p.waitForTimeout(STAY * 1000);
    const busy = f ? await f.evaluate(() => { try { return { sq: BohemiaBusyHeard.squiggle(), mutters: BohemiaBusyHeard.log().filter(e => e.kind === 'mutter').length, jobs: BohemiaBusyHeard.log().filter(e => e.kind === 'job').length, walkers: BohemiaSettlement.heardInput().walkers.length, drawn: BohemiaSettlement.heardInput().walkers.filter(w => w.drawn).length, heard: BohemiaHeard.state() }; } catch (e) { return String(e); } }).catch(e => String(e)) : null;
    const leftAt = await p.evaluate(() => Date.now());
    await d.fr.evaluate(() => { loopClose(); });
    await p.waitForTimeout(8000);
    const L = await p.evaluate(() => (window.__VLOG || []).slice());
    const inTown = L.filter(e => e.said <= leftAt);
    const { heard, pairs } = overlaps(inTown);
    const after = heard.filter(e => e.to > leftAt + 150).map(e => ({ frame: e.frame, text: e.text, msAfter: Math.round(e.to - leftAt), cut: e.stopAt != null ? Math.round(e.stopAt - leftAt) : null }));
    const saidAfter = L.filter(e => e.said > leftAt).map(e => ({ frame: e.frame, text: e.text, at: Math.round(e.said - leftAt) }));
    const longest = heard.reduce((m, e) => Math.max(m, (e.to - e.start) / 1000), 0);
    R.town = { name, tapped, busy, floor: await p.evaluate(() => { try { return BOH_VOICE_RECORDED.floor.state(); } catch (e) { return null; } }), lines: inTown.length, frames: [...new Set(inTown.map(e => e.frame))], longestSeconds: +longest.toFixed(2),
      overlapPairs: pairs.length, overlapMs: pairs.reduce((s, x) => s + x.ms, 0), overlapSample: pairs.slice(0, 6),
      heardAfterLeave: after, saidAfterLeave: saidAfter, families: [...new Set(inTown.map(e => e.family).filter(Boolean))],
      lineSeconds: heard.map(e => +((e.to - e.start) / 1000).toFixed(2)) };
    console.log('THE TOWN: ' + JSON.stringify(R.town, null, 1));
  }

  if (want('fight')) {
    await p.evaluate(() => {
      const L = window.__FL = { stings: [], songs: [], over: null };
      const sp = STING.play.bind(STING); STING.play = function (w) { const r = sp(w); L.stings.push({ t: Date.now(), which: w, played: r }); return r; };
      addEventListener('message', ev => { const m = ev.data; if (m && m.type === 'BOHEMIA_FIGHT_OVER' && !L.over) L.over = { t: Date.now(), result: m.result }; });
      setInterval(() => { let nm = null; try { nm = SONGFENCE.now(); } catch (e) {} L.songs.push({ t: Date.now(), song: nm, playing: !!MUS.playing, ok: (function () { try { return SONGFENCE.ok(); } catch (e) { return null; } })() }); }, 250);
    });
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 300 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (f) await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = null;
    for (let i = 0; i < 600 && !over; i++) { over = await p.evaluate(() => window.__FL.over); if (!over) await p.waitForTimeout(500); }
    if (over) await p.waitForTimeout(30000);
    const F = await p.evaluate(() => window.__FL);
    const t0 = F.over ? F.over.t : 0;
    const during = [...new Set(F.songs.filter(s => s.t < t0).map(s => s.song))];
    const afterS = F.songs.filter(s => s.t >= t0);
    const runs = []; afterS.forEach(s => { const k = s.song + (s.playing ? '' : ' (stopped)'); if (!runs.length || runs[runs.length - 1].song !== k) runs.push({ song: k, fromMs: s.t - t0, ok: s.ok }); });
    const swaps = await p.evaluate(() => (window.AFTERSONG && AFTERSONG.swaps || []).map(s => Object.assign({}, s)));
    R.fight = { over: F.over, swaps: swaps.map(s => Object.assign(s, { ms: s.t - t0 })), songsDuring: during, afterTheFight: runs, stings: F.stings.map(s => ({ which: s.which, played: s.played, ms: s.t - t0 })), outside: afterS.filter(s => s.ok === false).length };
    console.log('THE FIGHT: ' + JSON.stringify(R.fight, null, 1));
  }
  R.errors = perr.concat(d.errs || []).slice(0, 5);
  console.log('ERRORS: ' + JSON.stringify(R.errors));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
  await d.close();
})();

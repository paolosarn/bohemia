#!/usr/bin/env node
/* THE THUMB ON LEAVE, THE MOMENT IT LIGHTS (FIXES 4 11/27, ask row 747 FOUND BY JOBS 2, FIGHT SCREEN 3's; the measurement FIXES 3 named:
   'whether a real thumb tapping the drawn LEAVE mid-grow ever misses'). The end screen grows in out of the phone (__NOTHING_POPS__
   'from: phone' on #spoilsdoor) and LEAVE stays faint until the screen has opened on the fight (__LEAVE_WAITS_FOR_THE_SCREEN__).
   A finger taps what it sees, so this measures what it sees: every frame from the moment #spoilsdoor is on the page, on the top page
   itself (requestAnimationFrame), where LEAVE is DRAWN (its box inside the end screen, carried through the frame's own transform:
   the frame's drawn box over its layout box) and whether the page's own hit test there reaches LEAVE (the top page answers the
   frame, the frame answers LEAVE or a child of it), beside whether LEAVE is lit and whether the grow-in is still running.
   Then the thumb: the first moment LEAVE is lit, one real tap (touchscreen) at its drawn middle, and whether it went home.
     node tools/bohemia_fixes_four_leave_mid_grow.js [--throttle 4] [--fights 3] [--alpha]
   Prints one line a fight and a JSON block; nothing in the game is changed. */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const THROTTLE = +arg('--throttle', 4), FIGHTS = +arg('--fights', 3), ALPHA = process.argv.includes('--alpha');
/* --before: LEAVE lights the moment the screen opens (the way before __LEAVE_LIGHTS_ON_THE_GLASS__), for the same walk A/B */
const BEFORE = process.argv.includes('--before');
const ARM = BEFORE ? "(function(){ if (/SPOILS_SCREEN/.test(location.href)) window.__LEAVE_LIGHTS_AT_ONCE = true; })();" : undefined;

const SAMPLER = () => {
  const L = window.__LG = { s: [], t0: null, done: false, top: [] };
  ['pointerdown', 'touchstart', 'touchend', 'click'].forEach(k => addEventListener(k, e => { const t = e.target; L.top.push([k, t && (t.id || t.tagName + '.' + String(t.className || '').slice(0, 30) + (t.dataset && t.dataset.app ? '[' + t.dataset.app + ']' : '') + (t.closest && t.closest('[data-app]') ? '{' + t.closest('[data-app]').dataset.app + '}' : '')), L.t0 === null ? null : Math.round(performance.now() - L.t0), e.defaultPrevented]); }, true));
  const frameOf = () => { const w = document.getElementById('spoilsdoor'); return w ? w.querySelector('iframe') : null; };
  const tick = () => {
    if (L.done) return;
    const f = frameOf();
    if (f) {
      const now = performance.now(); if (L.t0 === null) L.t0 = now;
      const t = Math.round(now - L.t0), w = f.parentElement, r = f.getBoundingClientRect();
      let lit = false, lv = null, hit = null, over = null, cx = null, cy = null, growing = false;
      try { growing = w.getAnimations({ subtree: true }).some(a => a.playState === 'running'); } catch (_e) {}
      try {
        const d = f.contentDocument, e = d && d.getElementById('leave');
        lit = !!(d && d.documentElement.classList.contains('sp-live'));
        if (e && f.clientWidth > 0) {
          const b = e.getBoundingClientRect(), sx = r.width / f.clientWidth, sy = r.height / f.clientHeight;
          lv = [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)];
          cx = r.x + (b.x + b.width / 2) * sx; cy = r.y + (b.y + b.height / 2) * sy;   /* where the eye sees LEAVE's middle */
          const top = document.elementFromPoint(cx, cy);
          if (top !== f) { hit = false; over = top ? (top.id || String(top.className || '') || top.tagName) : 'nothing'; }
          else { const inn = d.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); hit = !!inn && (inn === e || e.contains(inn)); if (!hit) over = inn ? (inn.id || inn.tagName) : 'nothing inside'; }
        }
      } catch (_e) {}
      let wv = ''; try { const cs = getComputedStyle(w); wv = cs.display + '/' + cs.visibility + '/' + (+cs.opacity).toFixed(2) + '/' + (w.checkVisibility ? w.checkVisibility({ visibilityProperty: true }) : '?') + '/' + (cs.translate || '') + '/' + (cs.scale || ''); } catch (_e) {}
      L.s.push({ t, wv, lit, growing, frame: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], lv, at: cx === null ? null : [Math.round(cx), Math.round(cy)], hit, over });
      if (L.s.length > 4000) L.done = true;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

(async () => {
  const out = [];
  for (let n = 0; n < FIGHTS; n++) {
    const d = await drive.open({ keepCards: true, throttle: THROTTLE, alpha: ALPHA || undefined, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } });
    const p = d.page, perr = []; p.on('pageerror', e => perr.push(String(e.message)));
    const row = { fight: n + 1 };
    try {
      await p.evaluate(SAMPLER);
      if (BEFORE) await p.evaluate(() => { window.__LEAVE_LIGHTS_AT_ONCE = true; });
      const f = await drive.roadFightOffTheTown(d, { id: 'toll_crew', name: 'the toll crew', seq: 3 + n });
      if (!f) throw new Error('the road fight never came up');
      for (let i = 0; i < 300 && !(await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board).catch(() => false)); i++) await p.waitForTimeout(150);
      await f.evaluate(() => { FIGHT_UI.auto = true; }).catch(() => {});
      /* the thumb: wait for the end screen, then tap the drawn LEAVE the first moment it is lit */
      let tapped = null;
      for (let i = 0; i < 2400 && !tapped; i++) {
        const s = await p.evaluate(() => { const L = window.__LG; const x = L.s[L.s.length - 1]; return x && x.lit && x.at ? x : null; });
        if (s) {
          const sf = p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
          if (sf) await sf.evaluate(() => { const T = window.__TR = { ev: [] }; ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'click'].forEach(k => document.addEventListener(k, e => T.ev.push(k + ':' + (e.target.id || e.target.tagName) + (e.defaultPrevented ? '(prevented)' : '')), true)); }).catch(() => {});
          await p.evaluate(() => { const T = window.__TRTOP = { msgs: [] }; addEventListener('message', ev => { const m = ev.data; if (m && typeof m === 'object') T.msgs.push(String(m.type || '') + ':' + String(m.act || '')); }); });
          const look = (at) => p.evaluate((a) => { const e = document.elementFromPoint(a[0], a[1]), ph = document.getElementById('bohphone'), cl = document.getElementById('nfclouds');
            return { top: e ? (e.id || e.tagName + '.' + String(e.className || '').slice(0, 24)) : 'nothing', phoneZ: ph ? ph.style.zIndex : null, phoneOn: ph ? ph.classList.contains('on') : null, phoneScr: ph ? ph.dataset.screen : null,
              phoneRect: ph ? (r => [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)])(ph.getBoundingClientRect()) : null, clouds: cl ? +getComputedStyle(cl).opacity : null, t: Math.round(performance.now() - window.__LG.t0) }; }, at);
          row.litState = sf ? await sf.evaluate(() => ({ litAt: BohemiaSpoilsScreen.state.litAt, litWaits: BohemiaSpoilsScreen.state.litWaits, box: BohemiaSpoilsScreen.state.litBox })).catch(e => String(e.message).slice(0, 80)) : null;
          row.before = await look(s.at);
          await p.touchscreen.tap(s.at[0], s.at[1]); tapped = s;
          row.after = await look(s.at);
          await p.waitForTimeout(600);
          row.later = await look(s.at);
          row.trace = sf ? await sf.evaluate(() => ({ litAt: BohemiaSpoilsScreen.state.litAt, litWaits: BohemiaSpoilsScreen.state.litWaits, ev: window.__TR.ev, leaving: BohemiaSpoilsScreen.state.leaving || null, seq: !!BohemiaSpoilsScreen.state.seq, opened: !!BohemiaSpoilsScreen.state.opened })).catch(e => String(e.message).slice(0, 120)) : 'no frame';
          row.topEv = await p.evaluate(() => window.__LG.top.slice(-8));
          row.top = await p.evaluate(() => ({ msgs: window.__TRTOP.msgs.slice(0, 12), left: !!(window.SPOILS && SPOILS.left), frame: !!(window.SPOILS && SPOILS.frame) }));
          break; }
        await p.waitForTimeout(25);
      }
      row.tapped = tapped ? { t: tapped.t, at: tapped.at, growing: tapped.growing, hitThen: tapped.hit } : null;
      let home = false;
      for (let i = 0; i < 30 && !home; i++) { home = await p.evaluate(() => !document.getElementById('spoilsdoor')).catch(() => false); if (!home) await p.waitForTimeout(100); }
      row.homeFirst = home;
      if (!home && tapped) { const s2 = await p.evaluate(() => { const L = window.__LG; return L.s[L.s.length - 1]; }); row.second = { t: s2.t, at: s2.at, hit: s2.hit };
        await p.touchscreen.tap(s2.at[0], s2.at[1]);
        for (let i = 0; i < 40 && !home; i++) { home = await p.evaluate(() => !document.getElementById('spoilsdoor')).catch(() => false); if (!home) await p.waitForTimeout(100); }
        row.secondHome = home; }
      await p.waitForTimeout(300);
      const S = await p.evaluate(() => { window.__LG.done = true; return window.__LG.s; });
      const lit0 = S.find(x => x.lit), grow1 = (() => { let last = null; S.forEach(x => { if (x.growing) last = x; }); return last; })();
      const litMiss = S.filter(x => x.lit && x.hit === false), dark = S.filter(x => !x.lit);
      const darkDrawnOff = dark.filter(x => x.hit === false).length;
      row.home = home;
      /* the first frame LEAVE was lit: the screen at its full box on the glass, its door opaque (wv: display/visibility/opacity/...) */
      const vp = p.viewportSize() || { width: 390, height: 844 };
      row.atLit = lit0 ? { t: lit0.t, frame: lit0.frame, wv: lit0.wv } : null;
      row.onGlassAtLit = !!lit0 && Math.abs(lit0.frame[0]) <= 1 && Math.abs(lit0.frame[1]) <= 1 && Math.abs(lit0.frame[2] - vp.width) <= 1 && Math.abs(lit0.frame[3] - vp.height) <= 1 && /^[^/]*\/visible\/1\.00\//.test(lit0.wv || '');
      row.firstLitMs = lit0 ? lit0.t : null;
      row.growEndsMs = grow1 ? grow1.t : null;
      row.frames = S.length;
      row.litFrames = S.filter(x => x.lit).length;
      row.litMisses = litMiss.length;
      row.litMissSample = litMiss.slice(0, 3);
      row.around = S.filter(x => lit0 && x.t >= lit0.t - 400 && x.t <= lit0.t + 900).map(x => [x.t, x.lit ? 'L' : '-', x.growing ? 'G' : '-', x.frame.join(','), x.at ? x.at.join(',') : '', x.hit, x.over || '', x.wv]);
      row.wrapLog = await p.evaluate(() => { try { return (window.BohemiaPops ? BohemiaPops.log : []).filter(x => x.id === 'end screen').slice(-6).map(x => Object.assign({}, x, { rel: Math.round(x.t - (performance.timeOrigin + window.__LG.t0)) })); } catch (e) { return String(e); } });
      row.darkFrames = dark.length; row.darkHitOff = darkDrawnOff;
      row.litWhileGrowing = S.filter(x => x.lit && x.growing).length;
      row.errors = perr.slice(0, 2);
      row.firstTapPressed = (row.topEv || []).filter(x => x[0] === 'pointerdown').map(x => x[1]).slice(0, 1)[0] || (row.trace && row.trace.ev && row.trace.ev[0]) || null;
      console.log((BEFORE ? 'BEFORE ' : 'NOW ') + 'fight ' + (n + 1) + ' at ' + THROTTLE + 'x: the first tap went home ' + row.homeFirst + '; on the glass when lit ' + row.onGlassAtLit + ' ' + JSON.stringify(row.atLit) + ' (pressed ' + row.firstTapPressed + '; waits ' + JSON.stringify(row.litState) + '); end screen on the page at 0; grow-in running until ' + row.growEndsMs + ' ms; LEAVE lit at ' + row.firstLitMs + ' ms; lit frames ' + row.litFrames + ' (' + row.litWhileGrowing + ' still growing), a tap at LEAVE\'s drawn middle misses on ' + row.litMisses + '; faint frames ' + row.darkFrames + ' (' + row.darkHitOff + ' with the drawn LEAVE off its own hit); the thumb at ' + (tapped ? tapped.t + ' ms, ' + tapped.at.join(',') : 'NEVER') + ' -> ' + (home ? 'HOME' : 'NOT HOME'));
    } catch (e) { row.error = String(e.message).slice(0, 200); console.log('fight ' + (n + 1) + ': ' + row.error); }
    out.push(row);
    await d.close();
  }
  console.log(JSON.stringify(out, null, 1));
})();

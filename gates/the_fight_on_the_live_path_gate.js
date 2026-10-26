#!/usr/bin/env node
/* THE FIGHT ON THE LIVE PATH (COMBAT [the fight is broken live], the coordinator's emergency 10/26; Paolo 10/26: 'the auto combat
   started tweaking out on me and not working during combat... then I was trying to fight manually and it was tweaking on that too...
   that needs to get fixed immediately'; records/BOHEMIA_COMBAT_THE_FIGHT_IS_BROKEN_LIVE_10_26_26.md).
   WHAT BROKE AND WHY NO GATE SAW IT: every fight gate serves the files fresh from disk. The live site does not: GitHub Pages lets a
   phone keep any file ten minutes (max-age=600) and the service worker only forces the PAGE fresh, so for ten minutes after a deploy
   the NEW fight ran on the OLD rules file (records/target/bb/ours.json); AUTO's brain and their first gunman threw on rows the old
   file did not have, every frame, before the board drew. Five deploys landed in the twenty minutes before he played.
   This gate walks the demo the way his phone does, the server answering as GitHub Pages does (max-age=600, an ETag, 304s), with a
   DEPLOY between the map and the fight: the phone boots and walks the map while the server holds a rules file one deploy behind
   (today's file with its newest fight rows taken out and a mark put in), then the server takes today's file (the deploy) and the
   fights begin through the game's one door. Legs, on his phone (390 x 844 at 3x, touch) and his computer (1440 x 900):
   L1 THE FIGHT READS THE DEPLOY IT CAME WITH: the fight's rules are the server's file now, never the copy the phone held;
   L2 AUTO, by a real tap on AUTO: the fight plays to its end, never 8 s with nothing moving while it is not his turn;
   L3 BY HAND, real taps: every turn of his answers (a blow or a walk lands), the fight ends, nothing stands still 8 s on theirs;
   L4 THE DAMAGE CARRIED: the third fight's men walk in with what the condition says they are missing (never under 1, never dead);
   L5 AUTO at 4x by the speed button, to its end;
   L6 AN OLD SAVE (the condition forgotten, as a save from before the damage stayed), the tab killed and the link opened again,
      CONTINUE: a fight on AUTO to its end;
   L7 A TURN THAT THROWS PASSES (the bare fight page, the rules file one deploy behind on purpose): the fight goes on to its end and
      the board keeps drawing; the throw still reaches the page;
   L8 nothing threw on the live path.
   Run: node gates/the_fight_on_the_live_path_gate.js [--profile phone_portrait|computer] [--fightfile F] [--swfile F]
   (--fightfile / --swfile serve another copy of the fight or the worker, to show the gate red on the build before the fix) */
'use strict';
const path = require('path'), fs = require('fs'), os = require('os');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE FIGHT ON THE LIVE PATH GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, opt = k => (argv.indexOf('--' + k) > 0 ? argv[argv.indexOf('--' + k) + 1] : null);
const ONLY = opt('profile'), FIGHTFILE = opt('fightfile'), SWFILE = opt('swfile');
const STILL_MS = 8000, FIGHT_MS = 150000;

/* the rules file one deploy behind: today's, with the newest rows the fight reads taken out and a mark that says so */
const OURS = path.join(ROOT, 'records/target/bb/ours.json');
const BEHIND = ['lessons', 'range_bands', 'range_bands_step_in'];
function behindFile() {
  const j = JSON.parse(fs.readFileSync(OURS, 'utf8'));
  BEHIND.forEach(k => { delete j[k]; });
  if (j.auto_brain && j.auto_brain.value) delete j.auto_brain.value.damage_quantiles;
  j.__one_deploy_behind = { value: true, source: 'gates/the_fight_on_the_live_path_gate.js' };
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fight-live-')), 'ours.json');
  fs.writeFileSync(f, JSON.stringify(j)); return f;
}
async function waitFor(page, fn, ms) { const s = Date.now(); while (Date.now() - s < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(200); } return false; }
const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});";

/* a fight through the game's one door: the road crew, sized as the map sizes them */
async function openFight(d) {
  const page = d.page;
  await d.fr.evaluate(() => { try { contactClear(); } catch (e) {} try { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); } catch (e) {} });
  let f = null;
  await waitFor(page, async () => { const h = await page.$('#fightFrame'); const c = h && await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0 && !!window.FIGHT_UI && !!FIGHT_UI.board)) { f = c; return true; } return false; }, 90000);
  if (f) await page.waitForTimeout(1200);
  return f;
}
async function centre(f, sel) { const h = await f.$(sel); if (!h) return null; const b = await h.boundingBox(); return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null; }
async function tap(d, profile, p) { if (!p) return; if (profile === 'computer') await d.page.mouse.click(p.x, p.y); else await d.page.touchscreen.tap(p.x, p.y); }
const state = f => f.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); return { r: S.round, idx: S.idx, n: S.log.length, over: S.over, res: S.result, anim: FIGHT_UI.anim.length, dep: !!S.deploy, mine: crewControlled(u), side: u && u.side, broke: FIGHT_UI.broke || 0, errs: (window.__fe || []).length }; });

/* play the fight to its end: AUTO plays itself; by hand, his turns are played with real taps (a foe he can strike, else a step
   toward the nearest, else END TURN); every stretch with nothing moving is timed (his own turn by hand is his to take) */
async function play(d, profile, f, how) {
  const page = d.page, fb = async () => (await f.frameElement()).boundingBox();
  if (how === 'auto') await tap(d, profile, await centre(f, '#bauto'));
  else if (await f.evaluate(() => !!FIGHT.S.deploy)) { await tap(d, profile, await centre(f, '#bend')); await page.waitForTimeout(600); }
  const t0 = Date.now(); let last = '', lastT = Date.now(), worst = 0, st = null, turns = 0, answered = 0;
  while (Date.now() - t0 < FIGHT_MS) {
    st = await state(f).catch(() => null); if (!st) break;
    if (st.over) break;
    const key = st.r + ':' + st.idx + ':' + st.n + ':' + st.anim + ':' + st.dep;
    if (key !== last) { last = key; lastT = Date.now(); }
    else if (!(how === 'hand' && st.mine)) worst = Math.max(worst, Date.now() - lastT);
    if (worst > STILL_MS) break;
    if (how === 'hand' && st.mine && !st.anim) {
      turns++;
      const n0 = st.n;
      const aim = await f.evaluate(() => { const u = FIGHT.current(), foes = FIGHT.S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
        const t = foes.find(v => FIGHT.canStrike(u, v));
        if (t) return { x: sx((dx(t) + .5) * FIGHT_UI.tw), y: sy((dy(t) + .5) * FIGHT_UI.th) };
        foes.sort((a, b) => (Math.abs(a.x - u.x) + Math.abs(a.y - u.y)) - (Math.abs(b.x - u.x) + Math.abs(b.y - u.y)));
        const g = foes[0]; if (!g) return null; const sxn = Math.sign(g.x - u.x), syn = Math.sign(g.y - u.y);
        return { x: sx((u.x + sxn + .5) * FIGHT_UI.tw), y: sy((u.y + (sxn ? 0 : syn) + .5) * FIGHT_UI.th) }; });
      const b = await fb();
      if (aim && b) { await tap(d, profile, { x: b.x + aim.x, y: b.y + aim.y }); await page.waitForTimeout(250); await tap(d, profile, await centre(f, '#bend')); await page.waitForTimeout(700); }
      const s2 = await state(f).catch(() => null);
      if (s2 && s2.n > n0) answered++;
      if (s2 && s2.mine && !s2.anim && s2.r === st.r && s2.idx === st.idx) { await tap(d, profile, await centre(f, '#bend')); await page.waitForTimeout(300);
        const s3 = await state(f).catch(() => null); if (s3 && s3.mine && s3.r === st.r && s3.idx === st.idx) await f.evaluate(() => { try { FIGHT.endTurn(FIGHT.current()); take(); } catch (e) {} }); }
    } else await page.waitForTimeout(200);
  }
  return { over: !!(st && st.over), res: st && st.res, round: st && st.r, secs: Math.round((Date.now() - t0) / 1000), worst, turns, answered, broke: st ? st.broke : 0 };
}
async function leave(d) {
  const page = d.page;
  await waitFor(page, () => page.evaluate(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame)), 20000);
  await page.waitForTimeout(600);
  await page.evaluate(() => { try { if (typeof spoilsLeave === 'function') spoilsLeave(); else nfHome(); } catch (e) {} }).catch(() => {});
  await waitFor(page, () => page.evaluate(() => !CITYFIGHT), 20000);
  await page.waitForTimeout(1200);
}

(async () => {
  const behind = behindFile(), errs = [];
  for (const profile of ['phone_portrait', 'computer']) {
    if (ONLY && ONLY !== profile) continue;
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    const serve = { '/records/target/bb/ours.json': behind };
    if (FIGHTFILE) serve['/slices/BOHEMIA_FIGHT.html'] = path.resolve(FIGHTFILE);
    if (SWFILE) serve['/slices/sw.js'] = path.resolve(SWFILE);
    let d = null;
    try {
      /* the phone boots and walks the map on the last deploy's rules file (the map's own frames read it and keep it) */
      d = await D.open({ file: 'BOHEMIA_DEMO.html', profile, engage: true, pages: true, serve, arm: ARM });
      await d.page.waitForTimeout(2500);
      const held = await d.fr.evaluate(() => fetch('../records/target/bb/ours.json').then(r => r.json()).then(j => !!j.__one_deploy_behind)).catch(() => null);
      /* THE DEPLOY: the server has today's rules now */
      delete serve['/records/target/bb/ours.json'];
      const now = JSON.parse(fs.readFileSync(OURS, 'utf8'));
      const rows = [];
      /* L1 + L2: AUTO */
      let f = await openFight(d);
      if (!f) throw new Error('the first fight never opened');
      const read = await f.evaluate(() => ({ behind: !!DB.ours.__one_deploy_behind, keys: Object.keys(DB.ours).sort().join(',') }));
      leg(held === true && !read.behind && read.keys === Object.keys(now).sort().join(','),
        '*** L1 ' + tag + ': THE FIGHT READS THE DEPLOY IT CAME WITH *** (the phone held the last deploy\'s rules file; the fight reads the server\'s)',
        'the phone held the old file: ' + held + '; the fight read the old file: ' + read.behind);
      const a = await play(d, profile, f, 'auto'); rows.push('auto ' + JSON.stringify(a));
      errs.push.apply(errs, (await f.evaluate(() => window.__fe || []).catch(() => [])).map(e => tag + ' fight 1: ' + e));
      leg(a.over && a.worst <= STILL_MS && !a.broke, '*** L2 ' + tag + ': AUTO PLAYS THE FIGHT TO ITS END, NOTHING STANDS STILL ***', JSON.stringify(a));
      await leave(d);
      /* L3: by hand */
      f = await openFight(d);
      if (!f) throw new Error('the second fight never opened');
      const h = await play(d, profile, f, 'hand'); rows.push('hand ' + JSON.stringify(h));
      errs.push.apply(errs, (await f.evaluate(() => window.__fe || []).catch(() => [])).map(e => tag + ' fight 2: ' + e));
      leg(h.over && h.worst <= STILL_MS && h.turns > 0 && h.answered >= Math.ceil(h.turns * 0.6) && !h.broke,
        '*** L3 ' + tag + ': BY HAND, EVERY TURN OF HIS ANSWERS A TAP AND THE FIGHT ENDS ***', JSON.stringify(h));
      await leave(d);
      /* L4 + L5: the damage carried, AUTO at 4x */
      f = await openFight(d);
      if (!f) throw new Error('the third fight never opened');
      const carried = await f.evaluate(() => { const o = window.FIGHT_OPTS || {}, bad = [], seen = [];
        (o.company || []).forEach(function (m, i) { if (!m || !m.cond) return; const u = FIGHT.S.units.find(v => v.side === 'you' && v.id === 'c' + i); if (!u) return;
          const want = Math.max(1, Math.min(u.hpMax, Math.round(u.hpMax - (m.cond.lostHp || 0)))); seen.push(u.name + ' ' + u.hp + '/' + u.hpMax);
          if (!(u.hp === want && u.hp >= 1 && !u.dead)) bad.push(u.name + ' ' + u.hp + ' wanted ' + want); });
        return { bad, seen, handed: (o.company || []).length }; });
      leg(carried.bad.length === 0 && carried.handed > 0, '*** L4 ' + tag + ': THE DAMAGE CARRIED: EACH MAN WALKS IN WITH WHAT HE IS MISSING, NEVER UNDER ONE ***', JSON.stringify(carried).slice(0, 300));
      for (let g = 0; g < 4 && (await f.evaluate(() => FIGHT_UI.hand || 1)) !== 4; g++) { await tap(d, profile, await centre(f, '#bspeed')); await d.page.waitForTimeout(250); }
      const q = await play(d, profile, f, 'auto'); rows.push('4x ' + JSON.stringify(q));
      errs.push.apply(errs, (await f.evaluate(() => window.__fe || []).catch(() => [])).map(e => tag + ' fight 3: ' + e));
      leg(q.over && q.worst <= STILL_MS && !q.broke && (await f.evaluate(() => FIGHT_UI.hand).catch(() => 0)) === 4,
        '*** L5 ' + tag + ': AUTO AT 4x, BY THE SPEED BUTTON, TO ITS END ***', JSON.stringify(q));
      await leave(d);
      await d.page.evaluate(() => { try { localStorage.setItem('bohemia.fight.speed', '1'); } catch (e) {} });
      /* L6: an old save: the condition forgotten (as before the damage stayed), the tab killed, the link opened again, CONTINUE */
      await d.page.evaluate(() => { try { localStorage.removeItem('bohemia.condition.v1'); } catch (e) {} });
      await d.page.waitForTimeout(1500);
      await d.page.goto('chrome://crash').catch(() => {});
      await new Promise(r => setTimeout(r, 600));
      const old = d; d = await D.open({ file: 'BOHEMIA_DEMO.html', profile, engage: true, pages: true, serve, again: old });
      await d.page.waitForTimeout(2500);
      f = await openFight(d);
      const o6 = f ? await play(d, profile, f, 'auto') : { none: true };
      if (f) errs.push.apply(errs, (await f.evaluate(() => window.__fe || []).catch(() => [])).map(e => tag + ' fight 4: ' + e));
      leg(!!f && o6.over && o6.worst <= STILL_MS && !o6.broke && d.title && d.title.via === 'continue',
        '*** L6 ' + tag + ': AN OLD SAVE, REOPENED BY CONTINUE: A FIGHT ON AUTO TO ITS END ***', 'via ' + (d.title && d.title.via) + ' ' + JSON.stringify(o6));
      errs.push.apply(errs, (d.errs || []).map(e => tag + ': ' + e));
      console.log('    ' + tag + ' ' + rows.join(' | '));
    } catch (e) { leg(false, '  ' + tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  /* L7: a turn that throws passes (the bare page on the rules file one deploy behind, AUTO, so every man of ours throws) */
  {
    let d = null;
    try {
      const serve = { '/records/target/bb/ours.json': behind };
      if (FIGHTFILE) serve['/slices/BOHEMIA_FIGHT.html'] = path.resolve(FIGHTFILE);
      const o = { seed: 7, company: [{}, {}, {}], cap: 3, party: { count: 3, faction: 'brigands', days: 5 }, auto: true, deploy: false };
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', serve, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';try{localStorage.setItem("bohemia.fight.speed","4")}catch(e){}' });
      await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round && window.FIGHT_UI && FIGHT_UI.board, null, { timeout: 60000 });
      await d.page.evaluate(() => { window.__drawn = 0; const d0 = window.draw; window.draw = function () { window.__drawn++; return d0.apply(this, arguments); }; });
      const t0 = Date.now(); let st = null;
      while (Date.now() - t0 < 90000) { st = await d.page.evaluate(() => ({ over: FIGHT.S.over, r: FIGHT.S.round, broke: FIGHT_UI.broke || 0, errs: (window.__fe || []).length, drawn: window.__drawn })); if (st.over) break; await d.page.waitForTimeout(300); }
      leg(!!st && st.over && st.broke > 0 && st.errs > 0 && st.drawn > 30,
        '*** L7: A TURN THAT THROWS PASSES: THE FIGHT GOES ON TO ITS END, THE BOARD KEEPS DRAWING, THE THROW STILL REACHES THE PAGE ***', JSON.stringify(st));
    } catch (e) { leg(false, 'L7 ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  leg(errs.length === 0, 'L8 nothing threw on the live path', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

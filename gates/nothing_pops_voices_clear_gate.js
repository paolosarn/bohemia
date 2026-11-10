/* NOTHING POPS, EVERY VOICE CLEAR OF THE PHONE, THE TOOLTIPS  (UI 4, 11/2/26; rule 324 and rule 316's tooltip note; asks 322, 312)
   Paolo 11/2: 'all your pop-ups have to transition... the phone covers up the UI box where people are talking'; 'we still need to
   work on our tooltip [stuff] for real.'  The layer: slices/bohemia_ui_nothing_pops.js. Record: records/BOHEMIA_UI_NOTHING_POPS_
   VOICES_CLEAR_TOOLTIPS_11_2_26.md.
   ON THE DEMO, his phone upright (phone on the right) and sideways (phone on the left), real touches, a recorder in every page that
   reads each pop-up's presence (on the glass x its opacity x its scale) on every frame the browser draws:
     N0 the layer arms every page of the game (the shell, the map, the town, the fight)
     N1 the road's mouth card stands clear of the phone (0 points of it under the phone) and its last choice still takes a tap
     N2 the kills card held low by the phone stands clear of it (in the fight)
     N3 THE FRAMES: the fight's veteran, its weapon card, its end card, the settings and the end screen come in over two or more
        frames (the first drawn frame of each is under 95% present), and the ones that leave leave a copy that shrinks
     N4 TOOLTIPS: a held finger on a town's building says its line and opens nothing (a tap after still opens it); on the phone's
        RELATIONS it says its line and the app does not open; on the fight's bare ground it says its line and nobody moves
     N5 PLANTED (upright): the layer switched off, the road card is under the phone again (the measure can see the defect)
     N6 no page error
   It plays the stranger's game (fog: true): a new game opens in a town, which is where the first holds are.
   node gates/nothing_pops_voices_clear_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const REC = "(function(){ try { if (window.__PREC) return; } catch(e){}\n  var R = window.__PREC = { ev: [], on: true };\n  var SELS = [['road card','#roadcard','.rc'],['meet card','#meetcard','.mc'],['day card','#daycard'],['notes','#notewrap'],['town talk','#cttalk'],\n    ['town sheet','#sheet'],['town warning','#campwarn'],['let him go?','#card .ask'],['level-up','#levelup'],['fight veteran','#vet'],['weapon card','#drawer'],\n    ['fight over','#over',':scope > *'],['injury card','.injc'],['settings','#setwrap',':scope > *'],['kills card','#bkt-card'],['tooltip','#bptip'],\n    ['phone app page','#bohphone .page'],['phone crew page','#bohphone .crewp'],['hints','#cbxsay'],['crew screen','#crewdoor'],['spoils','#spoilsdoor']];\n  function vis(el){ if(!el||!el.isConnected) return 0; var w=el.ownerDocument.defaultView; try{ if(el.checkVisibility && !el.checkVisibility({visibilityProperty:true})) return 0; }catch(e){}\n    var r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return 0;\n    var ix=Math.max(0,Math.min(r.right,w.innerWidth)-Math.max(r.left,0)), iy=Math.max(0,Math.min(r.bottom,w.innerHeight)-Math.max(r.top,0)); var vf=(ix*iy)/(r.width*r.height); if(vf<=0) return 0;\n    var op=1, sc=1; for(var p=el;p&&p.nodeType===1;p=p.parentElement){ var cs=w.getComputedStyle(p); op*=parseFloat(cs.opacity); if(cs.visibility==='hidden') return 0;\n      var s=String(cs.scale||'none'); if(s!=='none'){ s.split(' ').forEach(function(v){ sc=Math.min(sc,Math.abs(parseFloat(v))); }); }\n      var t=cs.transform; if(t&&t!=='none'){ var m=t.match(/matrix\\(([^)]+)\\)/); if(m){ var a=m[1].split(',').map(parseFloat); sc=Math.min(sc,Math.sqrt(Math.abs(a[0]*a[3]-a[1]*a[2]))); } } }\n    return Math.round(Math.min(1,op*Math.min(1,sc)*vf)*100)/100; }\n  var st={};\n  function tick(){ if(!R.on) return requestAnimationFrame(tick); try { tick1(); } catch(e) { R.err=String(e&&e.message||e); } requestAnimationFrame(tick); }\n  function tick1(){ var t=performance.timeOrigin+performance.now(), d=document;\n    SELS.forEach(function(s){ var el=null; try{ var all=d.querySelectorAll(s[1]); for(var i=0;i<all.length;i++){ if(vis(all[i])>0){ el=all[i]; break; } } if(!el && all.length) el=all[0]; }catch(e){}\n      var p=el?vis(el):0; if(el&&s[2]&&p>0){ try{ var inn=el.querySelector(s[2]); if(inn) p=Math.min(p,vis(inn)); }catch(e){} }\n      var gh=0; try{ var g=d.querySelector('[data-pops-ghost=\"'+s[0]+'\"]'); if(g){ gh=1; } }catch(e){}\n      var o=st[s[0]]||(st[s[0]]={p:0,open:null,close:null});\n      if(o.p===0&&p>0){ o.open={id:s[0],ev:'open',t:Math.round(t),seq:[p],doc:location.pathname.split('/').pop()}; R.ev.push(o.open); o.close=null; }\n      else if(o.open&&o.open.seq.length<12&&p>0) o.open.seq.push(p);\n      if(o.p>0&&p===0){ o.close={id:s[0],ev:'close',t:Math.round(t),last:o.p,seq:[gh?'g':0],doc:location.pathname.split('/').pop()}; R.ev.push(o.close); o.open=null; }\n      else if(o.close&&o.close.seq.length<6) o.close.seq.push(gh?'g':p);\n      o.p=p; });\n  }\n  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ requestAnimationFrame(tick); }); else requestAnimationFrame(tick);\n})();\n";
const OVER = () => { const docs = []; const v = (w, d) => { if (d > 4) return; try { if (w.document) docs.push(w); for (let i = 0; i < w.frames.length; i++) v(w.frames[i], d + 1); } catch (e) {} }; v(window, 0);
  let P = null; try { const R = BOH_PHONE_RECT(); if (R && R.on) P = { x: R.left, y: R.top, w: R.width, h: R.height }; } catch (e) {}
  const out = {}; for (const w of docs) for (const s of ['#roadcard .rc', '#meetcard .mc', '#bkt-card', '#bptip', '#vet']) for (const e of w.document.querySelectorAll(s)) {
    const r = e.getBoundingClientRect(); if (r.width < 4 || w.getComputedStyle(e).display === 'none') continue; let x = r.left, y = r.top, ww = w;
    try { while (ww.frameElement) { const f = ww.frameElement.getBoundingClientRect(); x += f.left; y += f.top; ww = ww.parent; } } catch (e2) {}
    const b = { x, y, w: r.width, h: r.height }; out[s] = P ? Math.round(Math.max(0, Math.min(b.x + b.w, P.x + P.w) - Math.max(b.x, P.x)) * Math.max(0, Math.min(b.y + b.h, P.y + P.h) - Math.max(b.y, P.y))) : -1; }
  return out; };
async function side(profile, phoneSide, planted) {
  console.log('\n' + profile + ', the phone on the ' + phoneSide + (planted ? ' (PLANTED: the layer off)' : ''));
  let d; try { d = await open({ profile, door: 120000, fog: true, arm: "try{localStorage.setItem('bohemia.phone.v1', JSON.stringify({side:'" + phoneSide + "'}));" + (planted ? "localStorage.setItem('bohemia.pops.off','1');" : "localStorage.removeItem('bohemia.pops.off');") + "}catch(e){}\n" + REC }); }
  catch (e) { ok(profile + ': the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, M = (f, a) => p.evaluate(f, a), cdp = await p.context().newCDPSession(p);
  const hold = async (x, y) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 7 }] }); await p.waitForTimeout(900); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(600); };
  const box = async f => (await f.frameElement()).boundingBox();
  try {
    await p.waitForTimeout(3000);
    const sf = await (await fr.waitForSelector('#settleFrame', { timeout: 20000 })).contentFrame();
    await sf.waitForFunction(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }, null, { timeout: 30000 });
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(1200);
    if (!planted) {
      const docs = await M(() => BohemiaPops.docs().map(x => x.page).join(','));
      ok('N0 the layer arms the shell, the map and the town', /DEMO|ALPHA/.test(docs) && /CITY_WORLD/.test(docs) && /SETTLEMENT/.test(docs), docs);
      const fb = await box(sf), a = await sf.evaluate(() => { const B = BohemiaSettlement, F = B.fit(), sc = document.getElementById('scene').getBoundingClientRect(), b = B._box('board'); return [sc.left + F.ox + (b[0] + b[2]) / 2 * F.s, sc.top + F.oy + (b[1] + b[3]) / 2 * F.s]; });
      await hold(fb.x + a[0], fb.y + a[1]);
      const tip = await M(() => window.__TIP && window.__TIP.head), opened = await sf.evaluate(() => !!BohemiaSettlement.state.open);
      ok('N4 a held finger on THE BOARD says its line and opens nothing', tip === 'THE BOARD' && !opened, tip + ', sheet ' + (opened ? 'OPENED' : 'shut'));
      await p.waitForTimeout(400); await p.touchscreen.tap(fb.x + a[0], fb.y + a[1]); await p.waitForTimeout(1200);   /* his next touch, on the building: the card goes and the door opens */
      ok('   and a plain tap after still opens it', await sf.evaluate(() => BohemiaSettlement.state.open === 'board'));
      await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await p.waitForTimeout(800);
    }
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await p.waitForTimeout(4000);
    await fr.evaluate(() => { BohemiaRoadEvents.fire('ev_the_hungry_kid'); }); await p.waitForTimeout(1500);
    const o1 = await M('(' + OVER + ')()');
    if (planted) { ok('N5 PLANTED: with the layer off the road card is under the phone again (the measure sees it)', o1['#roadcard .rc'] > 0, o1['#roadcard .rc'] + ' sq pt'); return; }
    ok('N1 the road card stands clear of the phone', o1['#roadcard .rc'] === 0, o1['#roadcard .rc'] + ' sq pt under it');
    const ffb = await box(fr), kb = await fr.evaluate(() => { const bs = [...document.querySelectorAll('#roadcard [data-road]')], e = bs[bs.length - 1], r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    const before = await fr.evaluate(() => JSON.stringify(window.__ROADEV_CARD || {}));
    await p.touchscreen.tap(ffb.x + kb[0], ffb.y + kb[1]); await p.waitForTimeout(1500);
    ok('   its last choice takes a tap (the card moved on)', await fr.evaluate(b => JSON.stringify(window.__ROADEV_CARD || {}) !== b || !document.getElementById('roadcard'), before));
    await fr.evaluate(() => { try { BohemiaRoadEvents.close(); } catch (e) {} }); await p.waitForTimeout(600);
    const c = await M(() => { const e = document.querySelector('#bohphone [data-app="relations"]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
    if (c) { await hold(c[0], c[1]); const t = await M(() => window.__TIP && window.__TIP.head), pg = await M(() => !!document.querySelector('#bohphone .page.on'));
      ok('N4 a held finger on the phone\'s RELATIONS says its line and the app stays shut', t === 'RELATIONS' && !pg, t + ', page ' + (pg ? 'OPENED' : 'shut'));
      const o2 = await M('(' + OVER + ')()'); ok('   the tooltip stands clear of the phone', o2['#bptip'] === 0, o2['#bptip']); await p.touchscreen.tap(30, 120); await p.waitForTimeout(600); }
    else ok('N4 the phone\'s RELATIONS is on the glass', false);
    const g = await M(() => { const e = document.querySelector('#bohphone [data-app="settings"]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.x + r.width / 2, r.y + r.height / 2] : null; });
    if (g) { await p.touchscreen.tap(g[0], g[1]); await p.waitForTimeout(1200); await M(() => { const x = document.getElementById('setclose'); if (x) x.click(); }); await p.waitForTimeout(900); }
    await fr.evaluate(require('../tools/bohemia_drive_the_demo.js').offTheTown).catch(() => null);   /* PLUMBER 8 11/10: off the town's ground first (a town is a door: no road fight starts on it) */
    await fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); });
    let fw = null;
    for (let i = 0; i < 200 && !fw; i++) { if (i === 40) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="go"]'); if (b) b.click(); });
      const h = await p.$('#fightFrame'); if (h) { const cf = await h.contentFrame(); if (cf && await cf.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) fw = cf; } if (!fw) await p.waitForTimeout(200); }
    if (!fw) { ok('the fight opened', false); return; }
    await p.waitForTimeout(5000);
    const wb = await box(fw);
    const gr = await fw.evaluate(() => { const cv = document.querySelector('canvas'), P = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null; for (let y = innerHeight * 0.3; y < innerHeight * 0.6; y += 13) for (let x = 40; x < innerWidth - 40; x += 13) { if (P && P.on && x > P.left - 30 && x < P.right + 30 && y > P.top - 30 && y < P.bottom + 30) continue; const q = tileAt(x, y); if (FIGHT.rowAt(q.x, q.y) === 'flat' && !manAt(x, y) && !buildingSay(q.x, q.y) && document.elementFromPoint(x, y) === cv) return [x, y]; } return null; });
    if (gr) { const b0 = await fw.evaluate(() => JSON.stringify(FIGHT.S.units.map(u => [u.x, u.y]))); await hold(wb.x + gr[0], wb.y + gr[1]);
      const t = await M(() => window.__TIP && window.__TIP.head), b1 = await fw.evaluate(() => JSON.stringify(FIGHT.S.units.map(u => [u.x, u.y])));
      ok('N4 a held finger on the fight\'s bare ground says its line and nobody moves', t === 'OPEN GROUND' && b0 === b1, t + (b0 === b1 ? ', nobody moved' : ', SOMEBODY MOVED'));
      await p.touchscreen.tap(wb.x + 30, wb.y + 120); await p.waitForTimeout(700); }
    else ok('N4 a bare tile on the fight\'s glass to hold', false);
    const man = await fw.evaluate(() => { const u = FIGHT.S.units.find(u => u.side !== 'you' && u.hp > 0); if (!u) return null; for (let y = 60; y < innerHeight - 60; y += 6) for (let x = 20; x < innerWidth - 20; x += 6) if (manAt(x, y) === u) return [x, y]; return null; });
    if (man) { await hold(wb.x + man[0], wb.y + man[1]); await p.waitForTimeout(400); await p.touchscreen.tap(wb.x + 30, wb.y + 120); await p.waitForTimeout(800); }
    await fw.evaluate(() => new Promise(r => { if (window.BohemiaKillTally) return r(); const sc = document.createElement('script'); sc.src = '../engine/bohemia_kill_tally.js'; sc.onload = r; sc.onerror = r; document.head.appendChild(sc); }));   /* the fight loads the tally when it needs it */
    await fw.evaluate(() => { BohemiaKillTally.card(document, [{ name: 'DESI', was: 'x', look: 'person_town_0' }], { x: innerWidth - 60, y: Math.round(innerHeight * 0.8) }); }); await p.waitForTimeout(800);
    const o3 = await M('(' + OVER + ')()'); ok('N2 the kills card held low by the phone stands clear of it', o3['#bkt-card'] === 0, o3['#bkt-card'] + ' sq pt under it');
    await p.touchscreen.tap(wb.x + 30, wb.y + 120); await p.waitForTimeout(700);
    /* PLUMBER 8 11/10: re-aimed to rule 405(a)(c) (RUN FIVE __ONE_END_SCREEN__, 11/4): in the game a won or lost fight's own end card
       is handed to the game's end screen (#over.handed, never shown first), so the end card that comes in is the spoils screen, read below */
    const overHanded = await fw.evaluate(() => { try { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); } catch (e) {} const o = document.getElementById('over'); return !!o && o.classList.contains('handed'); }).catch(() => false); await p.waitForTimeout(1500);
    for (let i = 0; i < 30 && !(await M(() => !!document.getElementById('spoilsdoor'))); i++) await p.waitForTimeout(300);
    await p.waitForTimeout(1500);
    const EV = []; for (const f of p.frames()) { try { const r = await f.evaluate(() => window.__PREC ? window.__PREC.ev : []); r.forEach(x => EV.push(x)); } catch (e) {} }
    for (const id of ['weapon card', 'fight over', 'settings', 'kills card', 'spoils']) {
      const o = EV.filter(e => e.id === id && e.ev === 'open'), cl = EV.filter(e => e.id === id && e.ev === 'close');
      if (id === 'fight over' && overHanded && !o.length) { ok('N3 fight over: handed to the end screen, never shown first (rule 405(a)(c)); the spoils screen opened in its place', EV.some(e => e.id === 'spoils' && e.ev === 'open')); continue; }
      if (!o.length) { ok('N3 ' + id + ': seen opening', false); continue; }
      ok('N3 ' + id + ' comes in over frames (its first drawn frame under 95% there)', o.every(e => e.seq[0] < 0.95), o.map(e => e.seq.slice(0, 5).join(' ')).join(' | '));
      if (cl.length) ok('   and leaves a copy that shrinks (no one-frame vanish)', cl.every(e => e.seq.indexOf('g') >= 0 || e.last < 0.95), cl.map(e => e.last + ' -> ' + e.seq.slice(0, 4).join(' ')).join(' | '));
    }
  } catch (e) { ok(profile + ': ran to the end', false, String(e.message).slice(0, 160)); }
  finally { ok(profile + (planted ? ' (planted)' : '') + ': no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' / ')); await d.close(); }
}
(async () => {
  await side('phone_portrait', 'right', false);
  await side('phone_landscape', 'left', false);
  await side('phone_portrait', 'right', true);
  console.log('\nNOTHING POPS, VOICES CLEAR, TOOLTIPS: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

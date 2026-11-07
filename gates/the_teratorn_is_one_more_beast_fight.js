/* the browser half of gates/the_teratorn_is_one_more_beast_gate.py (WORLD 12, 11/7, rule 431(f)): on the demo, the phone held up,
   a flock of teratorns through the one door: what the fight fields and draws, the win, the kill on the map in its own picture, one
   tap: the food and a roll of hides. Prints one JSON line. */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
(async () => {
  const d = await D.open({ profile: 'phone_portrait' }); const fr = d.fr, p = d.page, errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  const out = { fight: false, errs };
  try {
    await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 60000);
    await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); });
    await fr.evaluate(() => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'teratorns', faction: null, draft: true, roster: [{ arch: 'beast' }, { arch: 'beast' }, { arch: 'beast' }],
      party: { count: 3, faction: 'teratorns', days: 1, difficulty: 1 }, street: true, why: 'gate:teratorn', at: { gx: city.x, gy: city.y }, __met: true }); });
    const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
    if (f) {
      out.fight = true;
      await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(1500);
      out.them = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, beast: !!u.beast, look: u.look || null, hp: u.hp, name: u.name || null })));
      out.sheet = await f.evaluate(async () => { const r = await fetch('fight_rig/fight_rig.json', { cache: 'no-cache' }).then(x => x.json()).catch(() => null); const L = r && r.looks && r.looks.beast_teratorn;
        if (!L) return null; const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(res => { im.onload = res; im.onerror = res; }); return { file: L.file, w: im.naturalWidth, h: im.naturalHeight }; });
      out.killed = await f.evaluate(() => { const o = []; FIGHT.S.units.forEach(u => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; o.push(u.kind); }); return o; });
      await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
      const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
      await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
        if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const b = await lb.boundingBox(); if (b && b.width >= 2) await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(1200); }
        return (await gone()) || null; }, 90000);
      await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME), 15000); await sleep(2000);
      out.kill = await fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1]; if (!c) return null; let pic = false; try { pic = !!BohemiaJobKinds.beastPic(c.faction).im; } catch (e) {}
        return { id: c.id, kind: c.kind, faction: c.faction, n: c.n, pic }; });
      if (out.kill) {
        out.take = await fr.evaluate((id) => { const f0 = (wagonGet() || {}).food | 0; const ok = BohemiaCarcass.take(id); const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]');
          return { ok, food: ((wagonGet() || {}).food | 0) - f0, hides: bag.filter(x => x.trade === 'hides' && x.from === 'a kill').length }; }, out.kill.id);
      }
    }
  } catch (e) { out.err = String(e).slice(0, 300); }
  console.log('RESULT ' + JSON.stringify(out));
  try { await d.close(); } catch (e) {}
})();

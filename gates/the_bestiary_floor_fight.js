/* the browser half of gates/the_bestiary_floor_gate.py (BESTIARY, 11/10, rule 441(a): 'a ship is done only when it plays end to end
   ON THE PAGE he plays... on a phone upright and sideways'). On the demo, for each beast BESTIARY added (records/target/bb/lab_beasts.json,
   added_by BESTIARY), one phone held upright and then sideways: its party comes through the one door every encounter uses (cityHandOver,
   as the teratorn's check does), the fight opens and fields it on its own sheet with its own words, the win sends him home, the kill lies
   on the map in its own picture, and one tap puts its meat in the food and a roll of hides in the bag. AND (rule 443(d)) for each enemy
   type BESTIARY added (bohemia_enemies.json rows, added_by BESTIARY): its faction's party through the same door at the first phase
   that deals it (a party of 8, up to 6 parties, as the map would send them): it is fielded in its own clothes (its own sheet loads), named, armed,
   the fight's words name the party, the win sends him home; and a late road crew until one carries a champion: named from his list,
   his title on him. Prints one JSON line: RESULT {"portrait": {<faction>: {...}, "men": {...}, "champion": {...}}, "landscape": {...}}. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
const BOOK = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/lab_beasts.json'), 'utf8'));
const MINE = BOOK.beasts.filter(b => String(b.added_by || '').startsWith('BESTIARY'));
const NE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')), PH = OURS.enemy_tiers.value.phases;
const MEN = NE.rows.filter(r => String(r.added_by || '').startsWith('BESTIARY') && !r.beast).map(r => {
  const m = NE.mix[r.faction] || {}, ph = PH.filter(p => m[p.name] && m[p.name][r.id])[0];
  return { id: r.id, faction: r.faction, looks: r.looks, days: ph ? ph.from_day + 1 : 1 }; });
const CH = (NE.champions && NE.champions.kinds) || {};
(async () => {
  const want = process.argv[2] ? process.argv[2].split(',') : ['phone_portrait', 'phone_landscape'];
  const res = {};
  for (const profile of want) {
    const d = await D.open({ profile }); const fr = d.fr, p = d.page, errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    const runs = {};
    try {
      await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 90000);
      for (const b of (process.env.ONLY_MEN ? [] : MINE)) {   /* ONLY_MEN: a quick run of the men's half alone (the gate runs both) */
        const fac = b.faction, out = { fight: false };
        try {
          await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); window.__FIGHT_CAME_HOME = null; });
          await fr.evaluate((f) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: f, faction: null, draft: true, roster: [{ arch: 'beast' }, { arch: 'beast' }],
            party: { count: 2, faction: f, days: 1, difficulty: 1 }, street: true, why: 'gate:bestiary', at: { gx: city.x, gy: city.y }, __met: true }); }, fac);
          const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
          if (!f) { runs[fac] = out; continue; }
          out.fight = true;
          await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(1200);
          out.them = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind));
          out.sheets = await f.evaluate(() => { const L = DB.ours.beast_rig_looks && DB.ours.beast_rig_looks.value; return FIGHT.S.units.filter(u => u.side === 'them').map(u => L && L[u.kind]); });
          out.says = await f.evaluate(() => { try { return THEY_ARE[theirFaction()]; } catch (e) { return null; } });
          out.drawn = await f.evaluate(async (look) => { const r = await fetch('fight_rig/fight_rig.json', { cache: 'no-cache' }).then(x => x.json()).catch(() => null); const L = r && r.looks && r.looks[look];
            if (!L) return null; const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(res => { im.onload = res; im.onerror = res; }); return im.naturalWidth > 0; }, 'beast_' + b.animal);
          await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; }); });
          await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
          const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
          await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
            if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const bb = await lb.boundingBox(); if (bb && bb.width >= 2) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(1200); }
            return (await gone()) || null; }, 90000);
          out.home = !!(await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME && window.__FIGHT_CAME_HOME.won === true), 15000)); await sleep(1500);
          out.kill = await fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1]; if (!c) return null; let pic = null; try { const bp = BohemiaJobKinds.beastPic(c.faction); pic = bp && bp.look || (bp && bp.im ? 'yes' : null); } catch (e) {}
            return { kind: c.kind, faction: c.faction, n: c.n, pic }; });
          if (out.kill) {
            const st = await fr.evaluate(() => BohemiaCarcass.state().list.slice(-1)[0].id);
            out.take = await fr.evaluate((id) => { const f0 = (wagonGet() || {}).food | 0; const ok = BohemiaCarcass.take(id); const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]');
              return { ok, food: ((wagonGet() || {}).food | 0) - f0, hides: bag.filter(x => x.trade === 'hides' && x.from === 'a kill').length }; }, st);
          }
        } catch (e) { out.err = String(e).slice(0, 300); }
        runs[fac] = out;
      }
      /* THE NEW MEN and A CHAMPION (rule 443(d)): the same door, the faction's own party */
      const handOver = (f, n, days) => fr.evaluate((o) => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} window.__FIGHT_CAME_HOME = null;
        cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: o.f, faction: null, draft: true, roster: [{ arch: 'bandit' }, { arch: 'bandit' }],
          party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, street: true, why: 'gate:bestiary men', at: { gx: city.x, gy: city.y }, __met: true }); }, { f, n, days });
      const openFight = () => waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
      const winHome = async (f) => {
        await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; }); });
        await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
        const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
        await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
          if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const bb = await lb.boundingBox(); if (bb && bb.width >= 2) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(1200); }
          return (await gone()) || null; }, 90000);
        return !!(await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME && window.__FIGHT_CAME_HOME.won === true), 15000));
      };
      const lookOk = (f, kind) => f.evaluate(async (k) => { const us = FIGHT.S.units.filter(u => u.side === 'them' && u.kind === k); if (!us.length) return null;
        const out = []; for (const u of us) { const L = DB.rig.looks[u.look], own = !!L && lookOf(u) === L; let drawn = false;
          if (L) { const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(r => { im.onload = r; im.onerror = r; }); drawn = im.naturalWidth > 0; }
          out.push({ look: u.look, own, drawn, name: u.name, weapon: u.weapon && u.weapon.name }); } return out; }, kind);
      runs.men = {};
      for (const m of MEN) {
        const o = { fight: false, tries: 0 };
        try {
          for (let t = 0; t < 6 && !o.fielded; t++) {
            o.tries = t + 1; await handOver(m.faction, 8, m.days); const f = await openFight(); if (!f) break; o.fight = true;
            await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(800);
            o.fielded = await lookOk(f, m.id); o.says = await f.evaluate(() => { try { return THEY_ARE[theirFaction()]; } catch (e) { return null; } });
            if (process.env.SHOTS && o.fielded) { await sleep(1500); await p.screenshot({ path: path.join(process.env.SHOTS, 'men_' + m.id + '_' + profile + '.jpg'), quality: 80 }); }
            o.home = await winHome(f); await sleep(800);
          }
        } catch (e) { o.err = String(e).slice(0, 300); }
        runs.men[m.id] = o;
      }
      const ch = { tries: 0 };
      try {
        for (let t = 0; t < 8 && !ch.named; t++) {
          ch.tries = t + 1; await handOver('brigands', 8, 70); const f = await openFight(); if (!f) break;
          await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(800);
          const c = await f.evaluate(() => (FIGHT.S.champions || []).map(x => { const u = FIGHT.byId(x.id); return { kind: x.kind, name: x.name, title: x.title, onBoard: !!u && u.name === x.name && u.champion === true, look: u && u.look }; }));
          if (c.length) { ch.named = c; ch.inList = c.every(x => ((CH[x.kind] || {}).names || []).map(n => String(n).toUpperCase()).indexOf(x.name) >= 0 && x.title === (CH[x.kind] || {}).title);
            ch.hold = await f.evaluate((id) => { try { weaponCard(FIGHT.byId(id)); const d = document.getElementById('drawer'); const t = d && d.innerText; return t ? t.slice(0, 160) : null; } catch (e) { return 'ERR ' + String(e).slice(0, 100); } }, (await f.evaluate(() => FIGHT.S.champions[0].id)));
            if (process.env.SHOTS) { await f.evaluate(() => { try { document.getElementById('drawer').style.display = 'block'; } catch (e) {} }); await sleep(600); await p.screenshot({ path: path.join(process.env.SHOTS, 'champion_' + profile + '.jpg'), quality: 80 }); } }
          ch.home = await winHome(f); await sleep(800);
        }
      } catch (e) { ch.err = String(e).slice(0, 300); }
      runs.champion = ch;
    } catch (e) { runs.err = String(e).slice(0, 300); }
    runs.errs = errs; res[profile.replace('phone_', '')] = runs;
    try { await d.close(); } catch (e) {}
  }
  console.log('RESULT ' + JSON.stringify(res));
})();

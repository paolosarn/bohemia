/* BESTIARY [the lab seven] 11/9 (rule 440(f)): THE SEVEN IN A REAL FIGHT ON A PHONE. On the demo, the phone held up (the drive tool's
   phone_portrait), each new beast party comes through the one door every encounter uses (cityHandOver, as the teratorn's check does),
   the fight opens, and we read what it fields and draws (each 'them' unit's kind and the sheet it is drawn from) and take the phone's
   screenshot. No variable is set to fake a fight: the party is rolled by the game from records/target/bb/bohemia_enemies.json.
     node tools/bohemia_bestiary_the_lab_seven_shots.js [faction,...]   -> records/target/bestiary_lab_seven/fight_<faction>.jpg, close_<faction>.jpg + shots.json */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/bestiary_lab_seven');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
const ALL = ['cheetahs', 'goats', 'stilts', 'longhorns', 'jaguars', 'llamas', 'shrub_oxen'];
const COUNT = { cheetahs: 1, goats: 3, stilts: 4, longhorns: 1, jaguars: 1, llamas: 3, shrub_oxen: 2 };
(async () => {
  const want = (process.argv[2] || ALL.join(',')).split(',');
  fs.mkdirSync(OUT, { recursive: true });
  const res = {};
  for (const fac of want) {
    const d = await D.open({ profile: 'phone_portrait' }); const fr = d.fr, p = d.page, errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    const out = { fight: false, errs };
    try {
      await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 60000);
      await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} });
      await fr.evaluate((o) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: o.fac, faction: null, draft: true, roster: Array.from({ length: o.n }, () => ({ arch: 'beast' })),
        party: { count: o.n, faction: o.fac, days: 1, difficulty: 1 }, street: true, why: 'shots:bestiary', at: { gx: city.x, gy: city.y }, __met: true }); }, { fac, n: COUNT[fac] || 2 });
      const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
      if (f) {
        out.fight = true;
        await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(2500);
        out.them = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, beast: !!u.beast, look: u.look || u.rig || null, hp: u.hp, name: u.name || null })));
        out.drawn = await f.evaluate(() => { try { const L = DB.ours.beast_rig_looks && DB.ours.beast_rig_looks.value; return FIGHT.S.units.filter(u => u.side === 'them').map(u => L && L[u.kind]); } catch (e) { return null; } });
        out.says = await f.evaluate(() => { try { return THEY_ARE[theirFaction()]; } catch (e) { return null; } });
        await p.screenshot({ path: path.join(OUT, 'fight_' + fac + '.jpg'), type: 'jpeg', quality: 80 });
        /* THE CLOSE LOOK: where the party stands on the glass (the fight's own world-to-screen, sx/sy), a drag of the board (a real
           pointer drag, the way a thumb pans) to bring it to the middle, then the phone's screenshot cut round it */
        const where = () => f.evaluate(() => { const t = FIGHT.S.units.filter(u => u.side === 'them' && !u.dead);
          const xs = t.map(u => sx((u.x + 0.5) * UI.tw)), ys = t.map(u => sy((u.y + 0.5) * UI.th));
          return { x: xs.reduce((a, b) => a + b, 0) / xs.length, y: ys.reduce((a, b) => a + b, 0) / ys.length, ox: OX, oy: OY, z: UI.zoom, tw: UI.tw }; });
        const box = await (await p.$('#fightFrame')).boundingBox();
        for (let k = 0; k < 3; k++) {
          const w = await where(); const dx = w.ox - w.x, dy = w.oy - w.y; if (Math.abs(dx) < 30 && Math.abs(dy) < 30) break;
          const x0 = box.x + w.ox, y0 = box.y + w.oy * 0.8;
          await p.mouse.move(x0, y0); await p.mouse.down();
          for (let i = 1; i <= 12; i++) { await p.mouse.move(x0 + dx * i / 12, y0 + dy * i / 12); await sleep(16); }
          await p.mouse.up(); await sleep(900);
        }
        /* and the wheel (the fight zooms toward the pointer, its own handler) until a house tile is about a third of the glass */
        for (let k = 0; k < 8; k++) {
          const w0 = await where(); if (w0.z >= 0.62) break;
          await p.mouse.move(box.x + w0.x, box.y + w0.y); await p.mouse.wheel(0, -260); await sleep(250);
        }
        await sleep(800);
        const w = await where(); out.close = w;
        const half = Math.max(120, Math.round(w.tw * w.z * 1.6));
        await p.screenshot({ path: path.join(OUT, 'close_' + fac + '.jpg'), type: 'jpeg', quality: 85, clip: { x: Math.max(0, box.x + w.x - half), y: Math.max(0, box.y + w.y - half * 1.1), width: half * 2, height: half * 2 } });
      }
    } catch (e) { out.err = String(e).slice(0, 300); }
    res[fac] = out; console.log(fac, JSON.stringify(out).slice(0, 400));
    try { await d.close(); } catch (e) {}
  }
  const file = path.join(OUT, 'shots.json'); let prev = {}; try { prev = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {}
  fs.writeFileSync(file, JSON.stringify(Object.assign(prev, res), null, 1) + '\n');
})();

/* BESTIARY 3 PROOF: THE DRONE OPERATOR (Paolo 11/27, VAMILY rule 490(c): 'a drone controller guy'; ask row 762). The eye in the sky's
   band met where a player meets it: the shipped fight page at phone size (390 by 844) through the one driver, AUTO on both sides, the
   fight's own drawing; nothing staged, nothing moved. The camera follows the first drone the OPERATOR sends (its lit cross over his men,
   the drone over it: operator_drone_*.jpg), then the operator himself at the back (operator_him.jpg); the fight's events are read off
   the page (launch, land, shot down, falls with him).
   node tools/bohemia_bestiary_three_operator_proof.js [days]   (writes records/bestiary_proof/operator_proof.json and its frames) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/bestiary_proof');   /* not published: the site sits at its cap */
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(150); } return false; }
const DAYS = +(process.argv[2] || 30), SEED = +(process.env.SEED || 7);
const man = (id, i) => ({ name: ['YOU', 'DESI', 'RAMON', 'CHUY'][i], main: i === 0, background: 'sellsword', level: 3, perks: [], marks: [],
  gear: { main: id, off: null, body: 'riot_gear_jacket', head: 'football_helmet', bag: [] } });
(async () => {
  const proof = { at: new Date().toISOString(), days: DAYS, seed: SEED, shots: [] };
  const company = [man('boar_spear', 0), man('arming_sword', 1), man('winged_mace', 2), man('pump_shotgun', 3)];
  /* the eye in the sky's band with its operator in it (the band the map deals, the operator's weight 1 in its middle and late mixes) */
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: SEED, speed: 1, auto: true, deploy: false, teach: false, company, party: [{ kind: 'casino_gunner', count: 2 }, { kind: 'casino_doorman', count: 1 }, { kind: 'drone_operator', count: 1 }], days: DAYS }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  try {
    await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 90000);
    await p.evaluate(() => { window.__ev = []; const take0 = window.take; if (typeof take0 === 'function') window.take = function () { try { (FIGHT.S.events || []).forEach(e => { if (e.t === 'skill' && /^drone_/.test(e.skill)) window.__ev.push(e.skill); }); } catch (x) {} return take0.apply(this, arguments); }; });
    proof.operator = await p.evaluate(() => { const u = FIGHT.S.units.find(v => v.kind === 'drone_operator'); return u ? { name: u.name, look: u.look, weapon: u.weapon.name, drones: u.ammo, waistband: (u.bag || []).map(b => b && b.name)[0] || null } : null; });
    const ok = await until(p, () => (FIGHT.S.drones || []).some(dr => { const by = FIGHT.byId(dr.by); return by && by.kind === 'drone_operator'; }), null, 240000);
    proof.flew = ok;
    if (ok) {
      await p.evaluate(() => { const dr = FIGHT.S.drones.find(x => { const by = FIGHT.byId(x.by); return by && by.kind === 'drone_operator'; }); window.__dr = { x: dr.x, y: dr.y, by: dr.by };
        clearInterval(window.__cam); window.__cam = setInterval(() => { UI.zoom = Math.max(UI.zoom, UI.far * 1.5); const q = aimAt(window.__dr.x, window.__dr.y + 1); UI.cx = q[0]; UI.cy = q[1]; }, 16); });
      for (let k = 0; k < 6; k++) {
        await sleep(k ? 450 : 200);
        const f = path.join(OUT, 'operator_drone_' + k + '.jpg');
        await p.screenshot({ path: f, type: 'jpeg', quality: 78 });
        proof.shots.push({ file: path.relative(ROOT, f), up: await p.evaluate(() => (FIGHT.S.drones || []).length) });
      }
      await p.evaluate(() => { clearInterval(window.__cam); const u = FIGHT.byId(window.__dr.by); if (u) { const q = aimAt(u.x, u.y); UI.cx = q[0]; UI.cy = q[1]; } });
      await sleep(300);
      await p.screenshot({ path: path.join(OUT, 'operator_him.jpg'), type: 'jpeg', quality: 78 });
    }
    await until(p, () => FIGHT.S.over, null, 300000);
    proof.over = await p.evaluate(() => ({ result: FIGHT.S.result, rounds: FIGHT.S.round, drone_events: window.__ev || [], words: (UI.feedLines || []).map(l => l.text).filter(t => /drone|OPERATOR|waistband/i.test(t)).slice(-8) }));
    proof.errors = d.errs.slice(0, 10);
  } finally { await d.close(); }
  fs.writeFileSync(path.join(OUT, 'operator_proof.json'), JSON.stringify(proof, null, 1));
  console.log(JSON.stringify({ operator: proof.operator, flew: proof.flew, over: proof.over, errors: proof.errors, shots: proof.shots.map(s => s.up) }));
})().catch(e => { console.error(e); process.exit(1); });

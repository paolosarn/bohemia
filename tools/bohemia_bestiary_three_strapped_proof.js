/* BESTIARY 3 PROOF: EVERYBODY IS STRAPPED (Paolo 11/27, VAMILY rule 489(a): 'human forces probably have at the very least pistols,
   everybody is strapped'). Their men met where a player meets them: the shipped fight page at phone size (390 by 844) through the one
   driver (tools/bohemia_drive_the_demo.js), the fight's own brain on both sides (AUTO), its own drawing; nothing staged, nothing moved.
   A band of raiders (the brigands at day 20: clubs, spears, a flail) walks at three of his men; the first club or blade man of theirs who pulls the pistol
   from his waistband is followed by the camera and photographed while he fires it (strapped_draw_*.jpg), and the fight's own words
   for it are read off its kept feed. Before this build no man of theirs had a pistol to pull (measured headless in the record).
   node tools/bohemia_bestiary_three_strapped_proof.js [faction] [days]   (writes records/bestiary_proof/strapped_proof.json and its frames; the VOTE card's pictures are cut from frames 6 and 7) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/bestiary_proof')   /* not published: the site sits at its cap */;
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(150); } return false; }
const FAC = process.argv[2] || 'brigands', DAYS = +(process.argv[3] || 20), SEED = +(process.env.SEED || 11);
const man = (id, i) => ({ name: ['YOU', 'DESI', 'RAMON'][i], main: i === 0, background: 'sellsword', level: 3, perks: [], marks: [],
  gear: { main: id, off: null, body: 'riot_gear_jacket', head: 'football_helmet', bag: [] } });
(async () => {
  const proof = { at: new Date().toISOString(), faction: FAC, days: DAYS, seed: SEED, shots: [] };
  const company = [man('boar_spear', 0), man('arming_sword', 1), man('winged_mace', 2)];
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: SEED, speed: 1, auto: true, deploy: false, teach: false, company, party: { faction: FAC, count: 5, days: DAYS } }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  try {
    await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 90000);
    proof.theirs = await p.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ name: u.name, kind: u.kind, weapon: u.weapon && u.weapon.name,
      waistband: u.strapped ? (u.bag || []).filter(b => b && b.id === u.strapped).map(b => b.name)[0] : null, rounds: u.strapped && u.bagState && u.bagState[0] ? u.bagState[0].rounds : null })));
    /* the first man of theirs with his pistol out, while the fight plays itself */
    const ok = await until(p, () => !FIGHT.S.over && FIGHT.S.units.some(u => u.side === 'them' && u.strapped && FIGHT.onField(u) && u.weapon && u.weapon.id === u.strapped && (u.bag || []).some(b => b && !b.gun && ['bow', 'crossbow', 'throwing', 'sling'].indexOf(b.class) < 0)), null, 240000);
    proof.drew = ok;
    if (ok) {
      const who = await p.evaluate(() => { const u = FIGHT.S.units.filter(v => v.side === 'them' && v.strapped && FIGHT.onField(v) && v.weapon && v.weapon.id === v.strapped && (v.bag || []).some(b => b && !b.gun && ['bow', 'crossbow', 'throwing', 'sling'].indexOf(b.class) < 0))[0];
        window.__who = u.id; return { id: u.id, name: u.name, kind: u.kind, gun: u.weapon.name, said: objName(u.weapon.of || u.weapon), rounds: u.rounds }; });
      proof.who = who;
      /* the camera on him, closer than the fight's own far stop, for every frame of the next three seconds */
      await p.evaluate(() => { clearInterval(window.__cam); window.__cam = setInterval(() => { const u = FIGHT.byId(window.__who); if (!u) return; UI.zoom = Math.max(UI.zoom, UI.far * 1.6); const q = aimAt(u.x, u.y); UI.cx = q[0]; UI.cy = q[1]; }, 16); });
      for (let k = 0; k < 8; k++) {
        await sleep(k ? 380 : 120);
        const f = path.join(OUT, 'strapped_draw_' + k + '.jpg');
        await p.screenshot({ path: f, type: 'jpeg', quality: 80 });
        const st = await p.evaluate(() => { const u = FIGHT.byId(window.__who); const a = (UI.anim || []).filter(x => x.k === 'attack' && (x.id === window.__who || x.a === window.__who || (x.from && x.from.id === window.__who)));
          return { holds: u && u.weapon ? u.weapon.name : null, rounds: u ? u.rounds : null, firing: a.length > 0, feed: (UI.feedLines || []).slice(-3).map(l => l.text) }; });
        proof.shots.push(Object.assign({ file: path.relative(ROOT, f) }, st));
      }
      await p.evaluate(() => clearInterval(window.__cam));
    }
    /* to the end on AUTO: how many of theirs drew, how many shots their pistols fired, what they said */
    await until(p, () => FIGHT.S.over, null, 300000);
    proof.over = await p.evaluate(() => ({ result: FIGHT.S.result, rounds: FIGHT.S.round,
      words: (UI.feedLines || []).map(l => l.text).filter(t => /waistband/.test(t)) }));
    proof.errors = d.errs.slice(0, 10);
  } finally { await d.close(); }
  fs.writeFileSync(path.join(OUT, 'strapped_proof.json'), JSON.stringify(proof, null, 1));
  console.log(JSON.stringify({ drew: proof.drew, who: proof.who, over: proof.over, errors: proof.errors, shots: proof.shots.map(s => [s.holds, s.rounds, s.firing]) }));
})().catch(e => { console.error(e); process.exit(1); });

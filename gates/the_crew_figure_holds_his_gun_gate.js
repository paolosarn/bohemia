/* THE CREW FIGURE HOLDS HIS GUN, AND HIS NUMBERS ARE THE FIGHT'S  (UI [eyes: the crew figure wears his gear], 10/26/26;
   EYES 10/25 q11, k02: 'the crew screen's figure wears none of the gear he equips'; 'the Lone Wolf's fatigue reads 118 on the
   crew screen and 55 in the fight'; rule 177, Paolo 10/25: 'I'm not seeing all the weapons, armour and off-hand items')

   MEASURED BEFORE (the demo at 85ff5bb7): every man on the crew screen stood bare-handed (the idles' bare set), whatever his
   main hand held; in the fight the same man holds his pistol low in one hand or his long gun across him.

   On the demo, the company screen through the bar's CREW, every man in turn:
     H1 his figure holds what his main hand holds, as the fight names it (fight_rig.json's by_class: a pistol, a rifle, a
        shotgun), and a man with no gun stands bare-handed
     H2 the gun is drawn: his figure with the gun has more painted pixels than his own bare idle at the same facing
     F1 (computer) the crew screen's FATIGUE for every man equals the fight's fatMax for him in a road fight (one number, one
        source, rule 202(c)); EYES' 118 against 55
   PLANTED: the class table emptied: H1 goes red.
   node gates/the_crew_figure_holds_his_gun_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };

const READ = () => {
  const S = BohemiaRosterScreen.state, m = S.crew[S.sel], b = document.querySelector('.rbody');
  const R = window.BohemiaRoster, id = m.gear && m.gear.main ? (m.gear.main.id || m.gear.main) : null, w = id && R.fightWeapon(id);
  const cls = w ? ((w.of && w.of['class']) || w['class']) : null;
  let painted = 0; if (b) { const d = b.getContext('2d').getImageData(0, 0, b.width, b.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) painted++; }
  const fat = ([...document.querySelectorAll('[data-stat=fatigue]')][0] || { dataset: {} }).dataset.shown;
  return { name: m.name, cls, holds: b ? b.dataset.holds : null, idle: b ? b.dataset.idle : null, painted, fat: +fat, look: m.look };
};

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr;
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await p.waitForTimeout(1500);
    await fr.evaluate(() => document.querySelector('#bmtb .t.crew').click()); await p.waitForTimeout(3000);
    let cf = null;
    for (let t = 0; t < 40 && !cf; t++) { for (const f of p.frames().filter(f => /ROSTER_SCREEN/.test(f.url())))
      if (await f.evaluate(() => !!window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length > 0).catch(() => false)) { cf = f; break; }
      if (!cf) await p.waitForTimeout(500); }
    if (!cf) { ok('the company screen opened', false); return; }
    const byClass = await cf.evaluate(async () => { const H = BohemiaRosterScreen.held; for (let i = 0; i < 40 && !(H.byClass && H.hold); i++) await new Promise(r => setTimeout(r, 100)); return H.byClass; });
    const n = await cf.evaluate(() => BohemiaRosterScreen.state.crew.length), men = [];
    for (let k = 0; k < n; k++) {
      await p.waitForTimeout(2200);   /* his sheets in, a few keys drawn */
      const r = await cf.evaluate('(' + READ + ')()');
      /* his own bare idle at the same facing, for the painted count */
      r.bare = await cf.evaluate(async () => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel], B = window.BohemiaIdles, c = document.createElement('canvas'); c.width = 72; c.height = 124;
        let q = null; for (let i = 0; i < 60 && !q; i++) { q = B.frame(m.look, 'crew:gate', performance.now(), 0, { set: 'bare' }); if (!q) await new Promise(r => setTimeout(r, 100)); } if (!q) return null; const x = c.getContext('2d');
        x.drawImage(q.img, q.x, q.y, q.w, q.h, Math.round(36 - (q.foot[0] - q.dx)), Math.round(119 - (q.foot[1] - q.dy)), q.w, q.h);
        const dd = x.getImageData(0, 0, 72, 124).data; let n = 0; for (let i = 3; i < dd.length; i += 4) if (dd[i] > 0) n++; return n; });
      men.push(r);
      await cf.evaluate(() => BohemiaRosterScreen.step(1));
    }
    const want = r => (r.cls && byClass[r.cls]) || '';
    ok('H1 ' + profile + ': every man\'s figure holds what his main hand holds, as the fight names it', men.length > 0 && men.every(r => r.holds === want(r)),
      men.map(r => r.name + ' ' + (r.cls || 'none') + ' -> ' + (r.holds || 'bare') + ' (wants ' + (want(r) || 'bare') + ')').join(', '));
    const armed = men.filter(r => want(r));
    ok('H2 ' + profile + ': the gun is drawn (more of him painted than his bare idle)', armed.length > 0 && armed.every(r => r.bare != null && r.painted > r.bare * 1.02),
      armed.map(r => r.name + ' ' + r.painted + ' vs bare ' + r.bare).join(', '));
    if (profile === 'phone_portrait') {
      await cf.evaluate(() => { const H = BohemiaRosterScreen.held; H.__keep = H.byClass; H.byClass = {}; }); await p.waitForTimeout(1500);
      const pl = await cf.evaluate('(' + READ + ')()');
      ok('PLANTED: the class table emptied, H1 catches a gun man standing bare', !!pl.cls && !!byClass[pl.cls] ? pl.holds !== byClass[pl.cls] : true, pl.name + ' holds ' + (pl.holds || 'bare'));
      await cf.evaluate(() => { const H = BohemiaRosterScreen.held; H.byClass = H.__keep; });
    }
    if (profile === 'computer') {
      await fr.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(600);
      await fr.evaluate(() => roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }));
      let f = null;
      for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
        if (f && await f.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 0).catch(() => false)) break; } await p.waitForTimeout(200); }
      const fu = f ? await f.evaluate(() => FIGHT.S.units.filter(v => v.side === 'you').map(v => ({ name: v.name, fatMax: FIGHT.fatMax(v) }))) : [];
      const pairs = men.map(r => ({ name: r.name, crew: r.fat, fight: (fu.find(u => u.name === r.name) || {}).fatMax }));
      ok('F1 computer: the crew screen\'s FATIGUE is the fight\'s, man for man', pairs.length > 0 && pairs.every(q => q.fight != null && q.crew === q.fight), pairs.map(q => q.name + ' ' + q.crew + '/' + q.fight).join(', '));
    }
  } catch (e) { ok('the gate ran on ' + profile, false, String(e.message).slice(0, 200)); }
  finally { try { await d.browser.close(); } catch (_e) {} try { d.server && d.server.close(); } catch (_e) {} }
}

(async () => {
  await side('phone_portrait');
  await side('computer');
  console.log('\nTHE CREW FIGURE HOLDS HIS GUN: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

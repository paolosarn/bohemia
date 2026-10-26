#!/usr/bin/env node
/* THE ORANGE SAYS WHAT IT IS (COMBAT [eyes: the hatch says nothing], rule 225(d); EYES [double sure, and the normie hour] round
   four 10/26, the normie hour's F22: 'an orange hatch covers the enemy's side; a thug inside it is out of reach... nothing says what
   the hatch is'. DONE WHEN: a stranger can say what the orange means from the screen, in one tap or none).
   READ BEFORE (the fight at 2d4f7989): no line of the fight named the orange; a tap on a hatched tile said only what the ground there does and the free swings on the
   way, by hand or by mouse.
   The rust hatch is their reach (rule 103: the eight tiles round each man of theirs who holds a ring).
   Legs (the real page, his phone and his computer):
   O1 ONE TAP: his man's turn, a man of theirs with a pipe three tiles off: a tap (the phone) or the mouse resting (the computer) on a
      hatched tile says 'Orange stripes: their reach.' first; on a tile in the clear it says nothing of the orange;
   O2 NONE: with the lessons on and a veteran of his on the field, the first time the hatch shows on his turn his veteran says what
      it is (the 'ring' lesson, once: it is kept as taught);
   O3 nothing threw.
   Run: node gates/the_orange_says_what_it_is_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE ORANGE SAYS WHAT IT IS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const ARM = "window.__fe=[];addEventListener('error',function(e){try{window.__fe.push(String(e.message||e).slice(0,160))}catch(_){}});try{localStorage.removeItem('bohemia.fight.taught')}catch(_){}";
  const errs = [];
  for (const profile of ['phone_portrait', 'computer']) {
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    let d = null;
    try {
      const o = { seed: 503, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, teach: true, odds: false, cap: 2,
        company: [{ background: 'companion_ranged', gear: { main: 'light_crossbow', off: null, body: null, head: null, bag: [] } }, { background: 'companion_ranged', gear: { main: 'light_crossbow', off: null, body: null, head: null, bag: [] } }],
        band: ['brigand_thug', 'brigand_thug'] };
      d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: ARM + 'window.FIGHT_OPTS=' + JSON.stringify(o) + ';' });
      const p = d.page;
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
      let mine = false; for (let i = 0; i < 300 && !mine; i++) { mine = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.over && crewControlled(u) && !FIGHT_UI.anim.length; }); if (!mine) await p.waitForTimeout(100); }
      /* the scene: his man on (3,7), a thug with a pipe on (6,7), the other thug far off on (11,2); his second man on (2,9) */
      const sc = await p.evaluate(() => { const S = FIGHT.S, me = FIGHT.current(), mates = S.units.filter(v => v.side === 'you' && v !== me), th = S.units.filter(v => v.side === 'them');
        me.x = 3; me.y = 7; th[0].x = 6; th[0].y = 7; th[1].x = 11; th[1].y = 2; if (mates[0]) { mates[0].x = 2; mates[0].y = 9; } me.ap = me.apTurn;
        S.units.forEach(v => { v._at = undefined; }); FIGHT_UI.pend = null; hud();
        FIGHT_UI.glide = null; FIGHT_UI.pinched = true;   /* the camera held where it stands (his touch's hold, rule 288(c)): the men moved, the frame would glide off the tiles we point at */
        const at = (x, y) => ({ x: sx((x + .5) * FIGHT_UI.tw), y: sy((y + .5) * FIGHT_UI.th) });
        return { ring: at(5, 8), clear: at(3, 9), holds: FIGHT.holdsRing(th[0]), hatch: ringAt(me, 5, 8).length, clearHatch: ringAt(me, 3, 9).length }; });
      const look = async (q) => { await p.evaluate(() => { FIGHT_UI.pend = null; FIGHT_UI.hoverKey = null; say(''); });
        if (profile === 'computer') { await p.mouse.move(q.x - 30, q.y - 30); await p.mouse.move(q.x, q.y, { steps: 4 }); } else await p.touchscreen.tap(q.x, q.y);
        await p.waitForTimeout(250); return p.evaluate(() => document.getElementById('say').innerText.replace(/\s+/g, ' ').trim()); };
      const onRing = await look(sc.ring), onClear = await look(sc.clear);
      leg(sc.holds && sc.hatch > 0 && sc.clearHatch === 0 && onRing.indexOf('Orange stripes: their reach.') === 0 && onClear.indexOf('Orange') < 0,
        '*** O1 ' + tag + ': ONE ' + (profile === 'computer' ? 'MOUSE OVER' : 'TAP') + ' ON THE HATCH NAMES IT *** (rule 225(d))',
        'on the hatch "' + onRing.slice(0, 110) + '"; in the clear "' + onClear.slice(0, 80) + '"');
      /* O2: the lesson, said once by his veteran */
      let said = null; for (let i = 0; i < 120 && !said; i++) { said = await p.evaluate(() => { const V = FIGHT_UI.vet; let T = {}; try { T = JSON.parse(localStorage.getItem('bohemia.fight.taught') || '{}'); } catch (e) {}
          return V && V.k === 'ring' ? { line: V.line, who: V.who } : T.ring ? { taught: true } : null; }); if (!said) await p.waitForTimeout(250); }
      leg(!!said && (said.taught || /orange/i.test(said.line)), '*** O2 ' + tag + ': NONE: THE FIRST HATCH ON HIS TURN, HIS VETERAN SAYS WHAT IT IS ***', JSON.stringify(said));
      errs.push.apply(errs, (await p.evaluate(() => window.__fe || [])).map(e => tag + ': ' + e));
    } catch (e) { leg(false, tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  leg(errs.length === 0, 'O3 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

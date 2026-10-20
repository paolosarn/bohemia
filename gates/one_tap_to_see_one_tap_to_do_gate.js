#!/usr/bin/env node
/* ONE TAP TO SEE, ONE TAP TO DO (COMBAT [one tap to see, one tap to do]; records/BOHEMIA_PAOLO_WHAT_IS_THE_PLAN_FOR_COMBAT_
   TOUCH_UI_UNDERSTANDING_10_19_26.md part C, his 10/19: 'better for the touch'). The first tap on a tile or an enemy shows the
   whole result right there; the second tap on the same spot does it; any other tap changes the choice; the one big button
   bottom right always says what it will do (WALK, SHOOT, END TURN); every touch target 44 points or more; no body ever covers
   a tile you need; the instruction sentences go away once the screen shows it.

   On his phone's profile (390 x 844 at 3x) and on its side (844 x 390), the real page, real taps:
   1. NOTHING PICKED: the big button says END TURN; no tag on the board;
   2. A TILE: the first tap shows the path, a tag on the board over that tile says WALK and the AP the rules charge, the big
      button says WALK with the same AP, and no sentence says 'Walk there' or 'Tap again';
   3. THE BUTTON DOES WHAT IT SAYS: a tap on WALK walks him to that tile for that AP;
   4. AN ENEMY: the first tap shows SHOOT and the chance over the man (the rules' chance), the button says SHOOT with it, his
      bars show what one blow takes; nothing is spent;
   5. ANY OTHER TAP CHANGES THE CHOICE: a tap on a tile after the enemy turns the button to WALK; a tap on his own man clears
      it back to END TURN;
   6. THE SECOND TAP ON THE SAME SPOT DOES IT: the enemy tapped twice is shot at (the AP of a shot comes off);
   7. NO BODY COVERS A TILE HE NEEDS: a tap on a tile an enemy's body is drawn over, when his arm cannot reach that man, picks
      the tile, not the man;
   8. THE BAR: every tap target 44 points or more, upright and on its side, and the tag inside the glass.
   Run: node gates/one_tap_to_see_one_tap_to_do_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const FIGHT_FILE = process.env.FIGHT_FILE || 'BOHEMIA_FIGHT.html';   /* a draft beside the fight can be driven by name */
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const run = async (opts, prof, fn) => { const d = await open({ file: FIGHT_FILE, bare: true, profile: prof, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const p = d.page; try { await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 }); await fn(p, d); leg(d.errs.length === 0, '  the page threw nothing', d.errs[0] || ''); } finally { await d.close(); } };
  const mine = async p => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
    if (st === 'mine') return; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); } };
  /* the pistol man on (12, 6), one thug three tiles east (or d), his turn, the camera on both */
  const stand = async (p, d, who) => { await mine(p);
    await p.evaluate(q => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && new Function('v', 'return ' + q.who)(v))[0], t = S.units.filter(v => v.side === 'them')[0];
      S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
      S.units.forEach(v => { if (v.side === 'you' && v !== u && Math.abs(v.y - 6) <= 2 && v.x >= 10) { v.x = 1; } });   /* his line stays out of the test's rows */
      u.x = 12; u.y = 6; t.x = 12 + q.d; t.y = 6; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; t.hp = t.hpMax * 50; t.hpMax = t.hp;
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.cx = (u.x + q.d / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .3) * FIGHT_UI.th; }, { d, who: who || '!!v.weapon.of' });
    await p.waitForTimeout(400); };
  const at = (p, x, y) => p.evaluate(q => ({ x: sx((q.x + .5) * FIGHT_UI.tw), y: sy((q.y + .5) * FIGHT_UI.th) }), { x, y });
  const tapTile = async (p, x, y) => { const s = await at(p, x, y); await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(250); };
  const read = p => p.evaluate(() => { const be = document.getElementById('bend'), pk = document.getElementById('pick'), u = FIGHT.current(), t = FIGHT.S.units.filter(v => v.side === 'them')[0];
    const r = pk.getBoundingClientRect(), b = be.getBoundingClientRect();
    return { label: be.innerText.replace(/\s+/g, ' ').trim(), go: be.classList.contains('go'), pick: pk.style.display !== 'none' ? pk.innerText.replace(/\s+/g, ' ').trim() : '',
      pickBox: { l: r.left, r: r.right, t: r.top, b: r.bottom }, W: innerWidth, H: innerHeight, bar: innerHeight - BOTH, say: document.getElementById('say').innerText,
      u: { x: u.x, y: u.y, ap: u.ap, id: u.id }, t: { x: t.x, y: t.y, hp: t.hp }, pend: FIGHT_UI.pend ? (FIGHT_UI.pend.target ? 'target' : 'tile') : null,
      cost: FIGHT_UI.pend && FIGHT_UI.pend.tile ? FIGHT.reach(u, null, true).best[FIGHT_UI.pend.tile.y * FIGHT.S.w + FIGHT_UI.pend.tile.x] : null,
      chance: t ? FIGHT.hitChance(u, t).chance : null, endBox: { w: b.width, h: b.height } }; });
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] };

  await run(base, 'phone_portrait', async (p) => {
    await stand(p, 3);
    const a = await read(p);
    leg(/^END TURN/.test(a.label) && !a.go && !a.pick, '*** NOTHING PICKED: THE BIG BUTTON SAYS END TURN, NO TAG ON THE BOARD ***', a.label);
    await tapTile(p, 11, 4);
    const b = await read(p), inGlass = b.pickBox.l >= 0 && b.pickBox.r <= b.W && b.pickBox.t >= 0 && b.pickBox.b <= b.bar;
    leg(b.pend === 'tile' && /^WALK/.test(b.label) && b.go && b.label.indexOf(b.cost + ' AP') >= 0 && b.pick.indexOf('WALK ' + b.cost + ' AP') === 0 && inGlass,
      '*** A TILE: THE TAG ON THE BOARD AND THE BIG BUTTON BOTH SAY WALK AND ITS AP ***', 'button "' + b.label + '", tag "' + b.pick + '", the rules charge ' + b.cost + ' AP');
    leg(!/Walk there|Tap again/.test(b.say), '  no sentence says "Walk there" or "Tap again" any more', JSON.stringify(b.say));
    const eb = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(eb.x, eb.y);
    await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 8000 }).catch(() => {});
    const c = await read(p);
    leg(c.u.x === 11 && c.u.y === 4 && c.u.ap === b.u.ap - b.cost && /^END TURN/.test(c.label), '*** THE BUTTON DOES WHAT IT SAYS: WALK walks him there for that AP, and the button is END TURN again ***',
      '(' + c.u.x + ',' + c.u.y + ') ' + b.u.ap + ' -> ' + c.u.ap + ' AP, "' + c.label + '"');
  });

  await run(base, 'phone_portrait', async (p) => {
    await stand(p, 3);
    const t = await read(p);
    await tapTile(p, t.t.x, t.t.y);
    const a = await read(p);
    const bars = await p.evaluate(() => !!(FIGHT_UI.pend && FIGHT_UI.pend.pv && FIGHT_UI.pend.pv.hp > 0));
    leg(a.pend === 'target' && /^SHOOT/.test(a.label) && a.label.indexOf(a.chance + '%') >= 0 && a.pick.indexOf('SHOOT ' + a.chance + '%') === 0 && a.u.ap === t.u.ap && a.t.hp === t.t.hp && bars,
      '*** AN ENEMY: SHOOT AND THE RULES\' CHANCE OVER HIM AND ON THE BIG BUTTON, WHAT ONE BLOW TAKES ON HIS BARS, NOTHING SPENT ***', 'button "' + a.label + '", tag "' + a.pick + '", the rules say ' + a.chance + '%');
    await tapTile(p, 11, 5);
    const b = await read(p);
    leg(/^WALK/.test(b.label) && b.pend === 'tile', '*** ANY OTHER TAP CHANGES THE CHOICE ***: a tile after the enemy turns the button to WALK', b.label);
    await tapTile(p, 12, 6);
    const c = await read(p);
    leg(/^END TURN/.test(c.label) && !c.pick, '  a tap on his own man clears it back to END TURN', c.label);
    await tapTile(p, t.t.x, t.t.y); await tapTile(p, t.t.x, t.t.y);
    await p.waitForFunction(() => !FIGHT_UI.anim.length, null, { timeout: 8000 }).catch(() => {});
    const d = await read(p);
    leg(d.u.ap < t.u.ap, '*** THE SECOND TAP ON THE SAME SPOT DOES IT ***: the man is shot at, the shot\'s AP comes off', t.u.ap + ' -> ' + d.u.ap + ' AP');
  });

  /* 7: a pipe man (his arm reaches one tile) and a thug drawn over the tile north of him; the pipe man three tiles away */
  await run(base, 'phone_portrait', async (p) => {
    await stand(p, 3, 'v.job === "pipe"');
    const q = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0], u = FIGHT.current();
      /* a point on the thug's body, over the tile above his feet (bodies stand up out of their tiles) */
      const X = sx((t.x + .5) * FIGHT_UI.tw), Yf = sy((t.y + .9) * FIGHT_UI.th), up = Yf - manH() * .75, tile = tileAt(X, up);
      const free = !FIGHT.S.units.some(v => FIGHT.onField(v) && v.x === tile.x && v.y === tile.y) && !!FIGHT.pathTo(u, tile.x, tile.y, FIGHT.reach(u, null, true));
      return { x: X, y: up, tile, free, reach: FIGHT.canStrike(u, t) }; });
    if (!q.free || q.reach) { leg(false, 'NO BODY COVERS A TILE HE NEEDS: the set-up found no free tile under the body', JSON.stringify(q)); return; }
    await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(250);
    const a = await read(p);
    leg(a.pend === 'tile' && /^WALK/.test(a.label) && !/out of reach/.test(a.say), '*** NO BODY COVERS A TILE HE NEEDS ***: a tap on his body over an empty tile his pipe cannot reach him from picks the tile',
      'tile (' + q.tile.x + ',' + q.tile.y + '): "' + a.label + '"' + (a.say ? ', said "' + a.say + '"' : ''));
  });

  for (const prof of ['phone_portrait', 'phone_landscape']) {
    await run(base, prof, async (p) => {
      await stand(p, 3);
      await tapTile(p, 11, 5);
      const m = await p.evaluate(() => { const ids = ['bend', 'bwait', 'bauto', 'card'].map(i => document.getElementById(i).getBoundingClientRect())
        .concat(Array.from(document.querySelectorAll('#skills .sq')).filter(b => b.style.display !== 'none').map(b => b.getBoundingClientRect())).filter(r => r.width > 0);
        const pk = document.getElementById('pick').getBoundingClientRect();
        return { min: Math.round(Math.min.apply(null, ids.map(r => Math.min(r.width, r.height)))), pick: pk.width > 0 && pk.left >= 0 && pk.right <= innerWidth && pk.top >= 0 && pk.bottom <= innerHeight - BOTH }; });
      leg(m.min >= 44 && m.pick, '*** ' + (prof === 'phone_portrait' ? 'UPRIGHT' : 'ON ITS SIDE') + ': EVERY TAP TARGET 44 POINTS OR MORE, THE TAG INSIDE THE GLASS ***', 'smallest ' + m.min + ' pt, tag ' + (m.pick ? 'inside' : 'OUT'));
    });
  }
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== ONE TAP TO SEE, ONE TAP TO DO GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }

#!/usr/bin/env node
/* THE LITTLE THINGS IN THE FIGHT (COMBAT, EYES [the playtest] 10/24's rows on this board, rule 150, Paolo 10/24: 'there's a lot
   that's not really correct and right... this is the shit you have to stay on top of, all these little things; I can't be
   explaining all these little things to you; you have to build these things'; records/BOHEMIA_EYES_THE_PLAYTEST_10_24_26.md).

   Legs, on his phone's profile (390 x 844), the real fight page, slices/BOHEMIA_FIGHT.html:
   1. [eyes: the reason is AP]: a man in reach with too few AP for the blow is told the real reason (the AP it costs, the AP he
      has), never 'out of reach'; a man out of reach still hears 'out of reach';
   2. [eyes: the stale line]: that refusal is gone once the turn passes;
   3. [eyes: the man up stays]: RETREAT ordered on his man's turn, with his AP, he runs for the edge like every other man (he
      moves, or gets out), never left standing where he was;
   4. [eyes: retreat recap]: a retreat with a man caught is never a wipe: the recap says YOU PULLED OUT, how many got out, and
      names who was left behind; the message home says retreat, not wipe;
   5. [eyes: hitpoints drift]: the same company in three fights: every man starts every fight at his own health and numbers;
   6. the page threw nothing.
   Run: node gates/the_little_things_in_the_fight_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE LITTLE THINGS IN THE FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const CREW3 = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  const boot = async (o) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 }); return d; };
  const mine = async p => { for (let i = 0; i < 300; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return FIGHT.S.over ? 'over' : u && crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'busy'; });
    if (st !== 'busy') return st; await p.waitForTimeout(80); } return 'stuck'; };

  /* 1, 2 */
  {
    const d = await boot({ seed: 31, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug'], teach: false, odds: false });
    const p = d.page;
    try {
      await mine(p);
      const r = await p.evaluate(async () => {
        const S = FIGHT.S, u = FIGHT.current(), t = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
        t.x = Math.min(S.w - 1, u.x + 1); t.y = u.y; t.hp = t.hpMax = 9999; u.ap = 0; const need = (FIGHT.strikeWhy(u, t) || {}).need || 4;
        u.ap = Math.max(2, need - 1); FIGHT_UI.pend = null; FIGHT_UI.spentKey = null;   /* a step still affordable: the turn does not end itself */
        const T = { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) };
        return { T, why: FIGHT.strikeWhy(u, t), can: FIGHT.canStrike(u, t), name: u.name, ap: u.ap };
      });
      await p.touchscreen.tap(r.T.x, r.T.y); await p.waitForTimeout(150);
      const said = await p.evaluate(() => document.getElementById('say').innerText);
      const far = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), t = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
        u.ap = u.apTurn; t.x = S.w - 1; t.y = S.h - 1; return FIGHT.strikeWhy(u, t); });
      /* and the walk's line says what a walk will leave, before he commits to it */
      const wl = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); u.ap = u.apTurn; FIGHT_UI.pend = null; FIGHT_UI.glide = null; FIGHT_UI.pinched = true;   /* the camera held (rule 288(c)'s hold): a man moved would glide the frame off the tile we tap */
        const th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0]; th.x = Math.min(S.w - 1, u.x + 3); th.y = u.y;   /* a man of theirs in sight: the line only warns when there is someone to shoot */ const sc = FIGHT.strikeCost(u), f = FIGHT.reach(u, null, true);
        const onGlass = k => { const X = sx((k % S.w + .5) * FIGHT_UI.tw), Y = sy((Math.floor(k / S.w) + .5) * FIGHT_UI.th); return X > 20 && X < W - 20 && Y > TOPH + 20 && Y < H - BOTH - 20; };
        const k = Object.keys(f.best).map(Number).find(k => u.ap - f.best[k] < sc.ap && onGlass(k) && !S.units.some(v => FIGHT.onField(v) && Math.abs(v.x - k % S.w) <= 1 && Math.abs(v.y - Math.floor(k / S.w)) <= 1)); if (k === undefined) return null;
        const x = k % S.w, y = Math.floor(k / S.w);
        return { x: sx((x + .5) * FIGHT_UI.tw), y: sy((y + .5) * FIGHT_UI.th), left: u.ap - f.best[k], need: sc.ap }; });
      if (wl) { await p.waitForTimeout(150); await p.touchscreen.tap(wl.x, wl.y); await p.waitForTimeout(150); }
      const walkSaid = await p.evaluate(() => { const t = document.getElementById('say').innerText; FIGHT_UI.pend = null; return t; });
      leg(wl && new RegExp('Leaves ' + wl.left + ' AP').test(walkSaid), '  and before a walk, the line says what it leaves when that will not pay for his blow or shot',
        wl ? '"' + walkSaid + '" (leaves ' + wl.left + ', costs ' + wl.need + ')' : 'no such tile');
      leg(!r.can && r.why && r.why.why === 'ap' && /Not enough AP/.test(said) && new RegExp('has ' + r.ap).test(said) && !/out of reach/.test(said) && far && far.why === 'range',
        '*** [eyes: the reason is AP] ***: a man in reach with too few AP hears the AP it costs and the AP he has, never \'out of reach\'; out of reach still says so',
        '"' + said + '"; far: ' + JSON.stringify(far));
      /* 2: the turn passes (END TURN) */
      await p.evaluate(() => { const u = FIGHT.current(); FIGHT.endTurn(u); take(); });
      let gone = false; for (let i = 0; i < 40 && !gone; i++) { gone = await p.evaluate(() => !/Not enough AP/.test(document.getElementById('say').innerText)); if (!gone) await p.waitForTimeout(50); }
      leg(gone, '*** [eyes: the stale line] ***: the refusal is gone once the turn passes', gone ? 'cleared' : 'STILL ON THE STRIP');
    } catch (e) { leg(false, 'the refusal page ran', String(e.message).slice(0, 200)); }
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 3, 4: one of his on the edge, the man up in the middle with his AP, one pinned down by a thug at his side */
  {
    const d = await boot({ seed: 32, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3, cap: 12, band: ['brigand_thug', 'brigand_thug'], teach: false, odds: false });
    const p = d.page;
    try {
      await mine(p);
      const set = await p.evaluate(() => { const S = FIGHT.S, me = S.units.filter(v => v.side === 'you' && FIGHT.onField(v)), th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
        const up = FIGHT.current(), others = me.filter(v => v !== up);
        up.x = 4; up.y = Math.floor(S.h / 2); up.ap = up.apTurn; up.fat = 0;
        others[0].x = 0; others[0].y = 1;
        others[1].x = S.w - 3; others[1].y = Math.floor(S.h / 2); others[1].hp = 1;
        th[0].x = S.w - 2; th[0].y = others[1].y; th[1].x = S.w - 4; th[1].y = others[1].y;
        th.forEach(t => { t.hp = t.hpMax = 9999; t.mskill = 200; });
        return { up: up.id, upAt: up.x + ',' + up.y, caught: others[1].name };
      });
      await p.evaluate(() => { FIGHT.retreat(); take(); });
      await p.waitForFunction(() => FIGHT.S.over && !FIGHT_UI.anim.length && (document.getElementById('over').style.display === 'flex'), null, { timeout: 60000 }).catch(() => {});
      const r = await p.evaluate(id => { const u = FIGHT.byId(id), mine = FIGHT.S.units.filter(v => v.side === 'you');
        return { at: u.x + ',' + u.y, escaped: !!u.escaped, down: !!u.down, head: document.getElementById('oh').innerText, body: document.getElementById('ob').innerText, wipe: !!FIGHT_UI.wipe,
          home: homeMessage(FIGHT.S.result), out: mine.filter(v => v.escaped).map(v => v.name), left: mine.filter(v => !v.escaped).map(v => v.name) }; }, set.up);
      leg(r.escaped || r.at !== set.upAt, '*** [eyes: the man up stays] ***: the man up when RETREAT is ordered runs for the edge with his AP',
        'he stood at ' + set.upAt + ', now ' + r.at + (r.escaped ? ', got out' : r.down ? ', caught' : ''));
      const caughtNamed = r.left.length ? r.left.every(n => r.body.indexOf(n) >= 0) && /Left behind/.test(r.body) : true;
      leg(!r.wipe && /YOU PULLED OUT/.test(r.head) && r.out.length > 0 && caughtNamed && r.home.retreat === true && r.home.wipe === false,
        '*** [eyes: retreat recap] ***: a retreat with a man caught is never a wipe: YOU PULLED OUT, how many got out, who was left behind; home says retreat',
        r.head + ' | ' + r.body.split('\n').slice(0, 2).join(' / ') + ' | out ' + r.out.join(',') + ', left ' + r.left.join(',') + ' | home retreat ' + r.home.retreat + ' wipe ' + r.home.wipe);
    } catch (e) { leg(false, 'the retreat page ran', String(e.message).slice(0, 200)); }
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 5: the same company, three fights */
  {
    const seen = [];
    for (const seed of [41, 42, 43]) {
      const d = await boot({ seed, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: CREW3.concat([{ background: 'companion_ranged', main: true, name: 'YOU' }]), cap: 12, band: ['brigand_thug'], teach: false, odds: false });
      seen.push(await d.page.evaluate(() => FIGHT.S.units.filter(v => v.side === 'you').map(v => v.name + ' ' + v.hpMax + '/' + v.mskill + '/' + v.rskill + '/' + v.mdef).sort().join(', ')));
      errs.push.apply(errs, d.errs); await d.close();
    }
    leg(seen[0] === seen[1] && seen[1] === seen[2], '*** [eyes: hitpoints drift] ***: the same company in three fights, every man at his own health and numbers every time', seen.join(' || '));
  }
  leg(!errs.length, 'the page threw nothing', errs.slice(0, 2).join(' | '));
  done();
})();

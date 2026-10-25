#!/usr/bin/env node
/* THE PISTOL IS NEVER A CLUB (COMBAT [the pistol is never a club], rule 195, Paolo 10/25: 'the game still says the pistol is a
   club at one tile I never asked for that shit'; records/BOHEMIA_PAOLO_THE_PISTOL_IS_NEVER_A_CLUB_10_25_26.md; amends 185(g)
   and 83). Every 'club at one' traced to the coordinator's words (rule 83's gloss, 185(g)'s 'unless he chooses to'), built as
   the gun's butt (ours.gun_club, clubFor, armIn) and the WHIP button (whipTap, the skill row's w| key). All of it is gone: a gun
   shoots, from the tile beside him to its reach, and a gunman with no shot does what Battle Brothers' does: he reloads, swaps
   to what rides in his bag (his button: rule 180(g), in his words, 'buttons you can press during combat that aren't fire or
   attack with melee', so AUTO never swaps for him), or moves.

   Measured before (main c2375c0c, the melee gate's own 36 fights): 1,208 shots, 70 at the next tile; the butt struck whenever a
   gun beside a man had no round, no breath or no AP for the shot, and on his WHIP pick.

   Legs:
   C1 the fight's code: no gun-club machinery (clubFor, armIn, shotReady, whipTap, a.whip, u.club, the data-whip square), and no
      string the player can read (comments stripped) says butt, whip, 'club at' or 'clubs with';
   C2 the data: ours.gun_club is gone, and no quote field carries the coordinator's gloss '(the pistol is) a two-tile gun, or a
      club at one' (rule 195(d): his real words only);
   C3 rolled fights, AUTO both sides, the live rules (tools/bohemia_fight_headless.js): his crew from his words (a rifle and two
      spear-and-car-door men), a pistol crew, and TUNING's crews (3, 6 and 12 men, three gear stages, five factions): NOT ONE BLOW
      by a man holding a gun is anything but its shot, both sides; and shots at the next tile are fired;
   C4 in the same fights, his gunmen whose turn starts with no shot (an empty gun he cannot reload, or no breath for it) never
      swing it, never touch the bag (rule 180(g)), and reload, stand or move (Battle Brothers' three);
   on the real page, his phone (390 x 844 at 3x) and his computer (1440 x 900), a pistol man beside a thug on his turn:
   C5 a tap on the thug: the aim says the chance and the rounds, the big button says SHOOT, no WHIP square, nothing says club,
      butt or whip; the weapon card says the reach from the next tile and names no butt;
   C6 his pistol empty, the same tap: RELOAD is the big square, and nothing says club, butt or whip; the shot is refused for the
      round, never swung;
   C7 nothing threw.
   Run: node gates/the_pistol_is_never_a_club_gate.js [--n 120] [--no-glass] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE PISTOL IS NEVER A CLUB GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const argv = process.argv, N = Number(argv[argv.indexOf('--n') + 1]) || 120;
const CLUB_WORDS = /\bbutts?\b|\bwhip|club at|clubs? with|pistol-whip/i;

(async () => {
  const errs = [];
  /* C1: the fight's own text */
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const code = html.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1');
  const machinery = ['clubFor', 'armIn(', 'shotReady', 'whipTap', '.whip', 'u.club', 'a.club', 'v.club', 'data-whip', 'dataset.whip', 'gun_club'].filter(k => code.indexOf(k) >= 0);
  const strs = (code.match(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g) || []).filter(q => CLUB_WORDS.test(q));
  leg(machinery.length === 0, '*** THE GUN\'S BUTT AND THE WHIP ARE GONE FROM THE FIGHT *** (rule 195(a)): no clubFor, armIn, shotReady, whipTap, whip flag, club arm or WHIP square',
    machinery.length ? 'still there: ' + machinery.join(', ') : 'none of ' + 11);
  leg(strs.length === 0, '*** NO FIGHT STRING CALLS A GUN A CLUB, A BUTT OR A WHIP *** (rule 195(e)): every string the page can show, comments stripped',
    strs.length ? strs.slice(0, 3).join(' | ') : 'none');
  /* C2: the data */
  const ours = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
  const gloss = Object.keys(ours).filter(k => ours[k] && typeof ours[k].quote === 'string' && /two-tile gun, or a club at one|unless he chooses/i.test(ours[k].quote));
  leg(!ours.gun_club && gloss.length === 0, '  the data: ours.gun_club is gone, and no quote field carries the coordinator\'s gloss as his words (rule 195(d))',
    (ours.gun_club ? 'gun_club still there; ' : '') + (gloss.length ? 'gloss in ' + gloss.join(', ') : 'clean'));

  /* C3 and C4: rolled fights */
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const B = require(path.join(ROOT, 'tools/bohemia_tuning_auto_brain.js'));
  const ctx = engine({ patch: r => r.replace("emit({ t: 'attack', id: a.id, to: t.id,", "emit({ t: 'attack', gunHeld: isGun(a.weapon), ax: a.x, ay: a.y, tx: t.x, ty: t.y, id: a.id, to: t.id,") });
  const F = ctx.FIGHT, T = F._t, districts = ctx.DB.boardKinds.districts;
  const g = (main, off) => ({ main, off, body: null, head: null, bag: [] });
  const HIS = [{ background: 'companion_ranged', name: 'YOU', main: true, gear: g('light_crossbow', null) },
    { background: 'companion_1hand', name: 'RAUL', gear: g('militia_spear', 'wooden_shield') },
    { background: 'companion_1hand', name: 'JAMAL', gear: g('militia_spear', 'wooden_shield') }];
  const PISTOLS = [{ background: 'companion_ranged', name: 'YOU', main: true, gear: { main: 'dagger', off: null, body: null, head: null, bag: ['militia_spear'] } },
    { background: 'companion_ranged', name: 'NENA', gear: { main: 'knife', off: null, body: null, head: null, bag: ['bludgeon'] } },
    { background: 'companion_1hand', name: 'RAUL', gear: g('militia_spear', 'wooden_shield') }];
  const tally = { fights: 0, shots: 0, close: 0, clubs: [], dry: 0, dryDid: { reload: 0, stood: 0, moved: 0 }, dryBad: [], swaps: [] };
  const play = (label) => {
    const S = F.S; let cur = null, t0 = null, guard = 0;
    const close = () => {
      if (!t0) return;
      const u = t0.u, L = S.log.slice(t0.n).filter(e => e.id === u.id);
      if (L.some(e => e.t === 'swap')) tally.swaps.push(label + ' ' + u.name);
      if (L.some(e => e.t === 'attack' && !e.shot && !e.free)) tally.dryBad.push(label + ' ' + u.name + ' r' + t0.r);
      if (L.some(e => e.t === 'reload')) tally.dryDid.reload++; else if (L.some(e => e.t === 'step')) tally.dryDid.moved++; else tally.dryDid.stood++;
      t0 = null; };
    while (!S.over && S.round <= 60 && guard++ < 200000) {
      const v = F.current(); if (!v) break;
      if (v !== cur) { close(); cur = v;
        /* a gunman of his whose turn starts beside a man with no shot in his hands */
        if (v.side === 'you' && F.onField(v) && F.isGun(v.weapon) && F.isRanged(v.weapon) && v.morale !== 'Fleeing'
          && S.units.some(t => t.side !== v.side && F.onField(t) && Math.max(Math.abs(t.x - v.x), Math.abs(t.y - v.y)) === 1)
          && (F.emptyGun(v) || v.fat + T.skillFat(v, F.strikeSkill(v.weapon)) > F.fatMax(v))) { tally.dry++; t0 = { u: v, n: S.log.length, r: S.round }; } }
      F.aiStep(v);
    }
    close();
    tally.fights++;
    S.log.forEach(e => { if (e.t !== 'attack' || e.sweep) return;
      if (e.gunHeld && !e.shot) { const a = S.units.find(u => u.id === e.id); tally.clubs.push(label + ' ' + (a && (a.name || a.kind)) + ' ' + e.arm); }
      if (e.gunHeld && e.shot) { tally.shots++; if (Math.max(Math.abs(e.ax - e.tx), Math.abs(e.ay - e.ty)) === 1) tally.close++; } });
  };
  for (let k = 0; k < N; k++) {
    const W = B.fightOf(k, districts), days = 1 + (k % 5) * 12;
    const crew = k % 3 === 0 ? HIS : k % 3 === 1 ? PISTOLS : null;
    try {
      if (crew) { ctx.setSeed(W.seed); F.setup({ auto: true, formation: null, company: crew, cap: 3, party: { faction: W.faction, count: 2 + (k % 4), days: days }, days: days, district: W.district, cell: W.cell, act: 1 }); }
      else B.setupFight(ctx, W);
      F.S.deploy = false; play((crew === HIS ? 'his' : crew ? 'pistols' : 'bench') + k);
    } catch (e) { errs.push(k + ': ' + e.message.slice(0, 140)); }
  }
  leg(tally.fights >= N - 2 && tally.clubs.length === 0 && tally.close > 0, '*** NOT ONE GUN STRUCK AS A CLUB, BOTH SIDES *** (rule 195(e)): rolled fights, his crew from his words, a pistol crew and TUNING\'s crews, AUTO both sides',
    tally.fights + ' fights, ' + tally.shots + ' shots, ' + tally.close + ' at the next tile, ' + tally.clubs.length + ' gun blows as a club' + (tally.clubs.length ? ': ' + tally.clubs.slice(0, 3).join('; ') : ''));
  const D = tally.dryDid;
  leg(tally.dry > 0 && tally.dryBad.length === 0 && tally.swaps.length === 0, '*** A GUNMAN WITH NO SHOT DOES WHAT BATTLE BROTHERS\' DOES *** (rule 195(b)): his turn begun beside a man with no shot in it: he reloads, stands or moves, never swings the gun, and AUTO never swaps his bag (rule 180(g))',
    tally.dry + ' such turns: reloaded ' + D.reload + ', moved ' + D.moved + ', stood ' + D.stood + '; swung ' + tally.dryBad.length + ', swapped ' + tally.swaps.length + (tally.dryBad.length ? ' (' + tally.dryBad.slice(0, 3).join('; ') + ')' : ''));

  /* C5 and C6: the real page, both profiles */
  if (!argv.includes('--no-glass')) {
    const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    for (const profile of ['phone_portrait', 'computer']) {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] }) });
      const p = d.page, pageErr = [];
      p.on('pageerror', e => pageErr.push(String(e)));
      try {
        await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
        const tap = async (x, y) => { if (profile === 'computer') await p.mouse.click(x, y); else await p.touchscreen.tap(x, y); };
        for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
          if (st === 'mine') break; if (st === 'theirs') await tap(200, 420); await p.waitForTimeout(150); }
        const place = () => p.evaluate(() => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && !!v.weapon.of)[0], t = S.units.filter(v => v.side === 'them')[0];
          S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
          u.x = 14; u.y = 2; t.x = 15; t.y = 2; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true;
          FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.cx = (u.x + 1) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th; hud();
          return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
        const read = () => p.evaluate(() => ({ say: document.getElementById('say').innerText, big: document.getElementById('bend').textContent,
          row: [...document.querySelectorAll('#skills button')].filter(b => b.style.display !== 'none').map(b => (b.title || '') + ' ' + b.textContent).join(' | '),
          whip: !!document.querySelector('#skills [data-whip]'), reloadBig: (document.getElementById('breload') || { classList: { contains: () => false } }).classList.contains('big') }));
        /* the first touch shows the aim (a finger's first tap; the computer's hover, rule 164 item 16), the second does it */
        let s = await place(); await p.waitForTimeout(250);
        if (profile === 'computer') await p.mouse.move(s.x, s.y); else await tap(s.x, s.y);
        await p.waitForTimeout(350);
        const a = await read();
        const n0 = await p.evaluate(() => FIGHT.S.log.length);
        await tap(s.x, s.y); await p.waitForTimeout(600);
        const did = await p.evaluate(n => { const u = FIGHT.S.units.filter(v => v.side === 'you' && !!v.weapon.of)[0]; return FIGHT.S.log.slice(n).filter(e => e.t === 'attack' && e.id === u.id).map(e => e.shot); }, n0);
        const card = await p.evaluate(() => { const u = FIGHT.current(); try { weaponCard(u); } catch (e) { return 'threw ' + e.message; } const el = document.getElementById('drawer'); const t = el ? el.textContent : ''; if (el) el.style.display = 'none'; return t; });
        leg(/% to hit/.test(a.say) && /SHOOT/.test(a.big) && !a.whip && !CLUB_WORDS.test(a.say + ' ' + a.row + ' ' + a.big) && /Reach\s*1 to 4 tiles/.test(card) && !CLUB_WORDS.test(card) && did.length === 1 && did[0] === true,
          '*** ' + profile.toUpperCase() + ': A PISTOL BESIDE A THUG SHOOTS HIM *** (rule 195): the aim and the rounds, the big button SHOOT, no WHIP square, no club, butt or whip; the card says reach 1 to 4 tiles; the second touch fires, a shot',
          a.say.replace(/\n/g, ' / ').slice(0, 110) + ' | button ' + a.big + ' | card ' + (card.match(/Reach[^A-Z]*tiles?/) || ['no reach'])[0] + ' | did ' + JSON.stringify(did));
        s = await place();
        await p.evaluate(() => { const u = FIGHT.current(); u.ammo = 0; FIGHT_UI.pend = null; hud(); });
        await p.waitForTimeout(250); if (profile === 'computer') await p.mouse.move(s.x, s.y); else await tap(s.x, s.y); await p.waitForTimeout(350);
        const b = await read();
        const why = await p.evaluate(() => { const u = FIGHT.current(), t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { can: FIGHT.canStrike(u, t), why: (FIGHT.strikeWhy(u, t) || {}).why }; });
        leg(!why.can && why.why === 'ammo' && b.reloadBig && !b.whip && !CLUB_WORDS.test(b.say + ' ' + b.row + ' ' + b.big),
          '  ' + profile + ': his pistol empty beside the thug: refused for the round, RELOAD is the big square, nothing swings, nothing says club, butt or whip',
          'refused for ' + why.why + ' | ' + b.say.replace(/\n/g, ' / ').slice(0, 90) + ' | row ' + b.row.slice(0, 90));
      } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
      finally { errs.push.apply(errs, pageErr); await d.close(); }
    }
  }
  leg(errs.length === 0, 'nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

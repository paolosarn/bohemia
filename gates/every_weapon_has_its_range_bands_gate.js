#!/usr/bin/env node
/* EVERY WEAPON HAS ITS RANGE BANDS (COMBAT [every weapon's range bands], rule 187, Paolo 10/25: 'certain weapons will have their
   range accuracy; all weapons can shoot the tile next to them, depending on the type: a rifle shooting one tile next to it might
   be a range debuff; a shotgun, the closer you are, after one or two tiles'; records/BOHEMIA_PAOLO_EVERY_WEAPON_HAS_ITS_RANGE_BANDS_10_25_26.md).
   Measured before (main 3bea8670): every gun took Battle Brothers' own fall of the shot a tile and nothing else (a 60-skill man,
   flat ground: the pistol 75 75 65 55 at 1 to 4 tiles, the rifle 70 falling 3 a tile, the shotgun 65 55), so a rifle was at its
   best in a man's face and a shotgun hit as hard across the street as beside him; AUTO's shotgunners fired from two tiles four
   shots in five.
   Legs:
   B1 the data: every gun job the fight deals has its band in ours.range_bands (the rifle's point-blank, the shotgun's spread);
   B2 the rules, every gun row on open flat ground: the chance at each tile is Battle Brothers' plus the band's points, and the
      damage that arrives is the band's share (the preview and the blow read the same);
   B3 rolled AUTO fights: the hits at each distance land at the chance the rules gave them (within 6 points where a hundred
      shots or more were fired);
   B4 AUTO plays the bands (rule 187(d)): a shotgunner fires from the next tile more than from two and half again as often as
      before; a rifleman fires from the next tile less often than before; his side wins no fewer;
   B5 the page, his phone (390 x 844 at 3x) and his computer (1440 x 900): aiming a rifle at the man beside him the line says
      point-blank and the number on it; aiming a shotgun two tiles off, the share of its damage that arrives;
   B6 nothing threw.
   Run: node gates/every_weapon_has_its_range_bands_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== EVERY WEAPON HAS ITS RANGE BANDS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const KINDS = ['strip', 'suburb', 'culdesac', 'ruin', 'desert', 'freeway'];

(async () => {
  const errs = [];
  const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
  const ctx = engine(), F = ctx.FIGHT, T = F._t, DB = ctx.DB;
  const bands = DB.ours.range_bands.value, guns = (DB.weapons.rows || DB.weapons).filter(w => F.isGun(w));
  const jobs = [...new Set(guns.map(w => F.jobOfWeapon(w)))];
  /* B1 */
  leg(jobs.every(j => bands[j]) && bands.rifle.hit_by_tile['1'] < 0 && bands.shotgun.damage_by_tile['2'] < 1,
    '*** B1 EVERY GUN HAS ITS BAND *** (rule 187(a)): ' + jobs.join(', ') + ' in ours.range_bands; the rifle loses at the next tile, the shotgun\'s damage spreads past one',
    JSON.stringify(bands));
  /* B2: one shooter, one man of theirs, a straight open row of flat ground */
  ctx.setSeed(3); F.setup({ seed: 3, kind: 'scrub', auto: true, formation: null, deploy: false, flat: true, party: { faction: 'brigands', count: 2, days: 1 } });
  const S = F.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them');
  S.units.forEach(u => { if (u !== a && u !== t) u.fled = true; });
  let row = null; for (let y = 0; y < S.h && row === null; y++) { let ok = true; for (let x = 0; x < 9; x++) if (!T.passable(x, y) || F.level(x, y) || S.coverCount[y][x]) ok = false; if (ok) row = y; }
  const zero = () => { const keep = JSON.stringify(bands); Object.keys(bands).forEach(k => { bands[k] = { hit_by_tile: {}, damage_by_tile: {} }; }); return () => { Object.assign(bands, JSON.parse(keep)); }; };
  let checked = 0, badHit = [], badDmg = [];
  guns.forEach(w0 => {
    const w = T.pistolShot(w0) || w0, job = F.jobOfWeapon(w);
    for (let d = 1; d <= 6; d++) {
      a.weapon = w; a.loaded = true; a.ammo = w.mag || null; a.ap = 99; a.fat = 0; a.rskill = 60; t.rdef = 10; t.shield = null; t.armB = 0; t.armH = 0; t.hp = t.hpMax = 999;
      a.x = 0; a.y = row; t.x = d; t.y = row;
      if (!F.canStrike(a, t)) continue;
      const withB = F.hitChance(a, t).chance, pw = F.preview(a, t); const back = zero(); const bare = F.hitChance(a, t).chance, pb = F.preview(a, t); back();
      const want = (bands[job].hit_by_tile || {})[String(d)] || 0, share = (bands[job].damage_by_tile || {})[String(d)];
      checked++;
      if (withB !== Math.max(5, Math.min(95, bare + want)) && Math.abs(withB - (bare + want)) > 1) badHit.push(w0.id + '@' + d + ' ' + bare + '+' + want + '=' + withB);
      const ratio = pw.hp / Math.max(1, pb.hp), wantR = share === undefined ? 1 : share;
      if (Math.abs(ratio - wantR) > 0.03) badDmg.push(w0.id + '@' + d + ' ' + pw.hp + '/' + pb.hp);
    }
  });
  leg(checked >= 30 && badHit.length === 0 && badDmg.length === 0,
    '*** B2 THE RULES READ THE BAND *** (rule 187(a)): every gun row at every tile it reaches, the chance Battle Brothers\' plus the band, the damage the band\'s share',
    checked + ' gun and distance pairs; chance off ' + badHit.length + ', damage off ' + badDmg.length + (badHit.concat(badDmg).length ? ': ' + badHit.concat(badDmg).slice(0, 3).join('; ') : ''));

  /* B3, B4: rolled AUTO fights, with the bands and the step in, and before (the bands zeroed, the old walk, no step in) */
  const play = (before) => {
    const c = engine(before ? { patch: r => r.replace("if (ranged) sc += (wantsClose(w) ? -1 : 1) * Math.min", "if (ranged) sc += Math.min").replace("if (u.side === 'you' && ranged && wantsClose(w) && stepIn(u)) return true;", "") } : {});
    if (before) { const v = c.DB.ours.range_bands.value; Object.keys(v).forEach(k => { v[k] = { hit_by_tile: {}, damage_by_tile: {} }; }); }
    const G = c.FIGHT, by = {}; let won = 0, fights = 0;
    for (const kind of KINDS) for (let seed = 1; seed <= 10; seed++) {
      try {
        c.setSeed(seed); G.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 8, days: 20 } });
        const S2 = G.S; S2.deploy = false; fights++;
        for (let g = 0; g < 6000 && !S2.over && G.current() && S2.round <= 40; g++) {
          const n0 = S2.log.length; G.aiStep(G.current());
          S2.log.slice(n0).forEach(e => { if (e.t !== 'attack' || !e.shot || e.free) return; const x = G.byId(e.id), y = G.byId(e.to); if (!x || !y) return;
            const k = (x.side === 'you' ? 'you:' : 'them:') + G.jobOfWeapon(x.weapon) + '@' + Math.max(Math.abs(x.x - y.x), Math.abs(x.y - y.y));
            const q = by[k] = by[k] || { n: 0, h: 0, ch: 0 }; q.n++; q.ch += e.chance; if (e.hit) q.h++; });
        }
        if (S2.result === 'won') won++;
      } catch (e) { errs.push((before ? 'before ' : '') + kind + seed + ': ' + e.message.slice(0, 120)); }
    }
    return { by, won, fights };
  };
  const now = play(false), was = play(true);
  const off = []; let buckets = 0;
  /* a bucket of n shots at a chance p lands within its own spread: 6 points, or 2.6 of its standard errors where that is wider */
  Object.keys(now.by).forEach(k => { const q = now.by[k]; if (q.n < 100) return; buckets++; const rate = 100 * q.h / q.n, shown = q.ch / q.n, se = 100 * Math.sqrt(shown / 100 * (1 - shown / 100) / q.n);
    if (Math.abs(rate - shown) > Math.max(6, 2.6 * se)) off.push(k + ' ' + Math.round(rate) + '% hit, ' + Math.round(shown) + '% shown, n ' + q.n); });
  leg(buckets >= 6 && off.length === 0, '*** B3 THE HITS LAND AT THE CHANCE THE RULES GAVE *** (rule 187(e)): every gun and distance with a hundred shots or more, both sides, within 6 points or 2.6 of the bucket\'s own spread',
    buckets + ' buckets' + (off.length ? ', off: ' + off.slice(0, 3).join('; ') : ', all within 6'));
  const n = (r, k) => (r.by[k] || { n: 0 }).n, share = (r, j, d) => n(r, 'you:' + j + '@' + d) / Math.max(1, [1, 2, 3, 4, 5, 6].reduce((s, x) => s + n(r, 'you:' + j + '@' + x), 0));
  const sg1 = n(now, 'you:shotgun@1'), sg2 = n(now, 'you:shotgun@2');
  leg(sg1 > sg2 && share(now, 'shotgun', 1) >= 1.5 * share(was, 'shotgun', 1) && share(now, 'rifle', 1) < share(was, 'rifle', 1) && now.won >= was.won - 2,
    '*** B4 AUTO PLAYS THE BANDS *** (rule 187(d)): his shotgunners fire from the next tile more than from two, half again as often as before; his riflemen less point-blank than before; no fewer wins',
    'shotgun next tile ' + n(was, 'you:shotgun@1') + ' -> ' + sg1 + ' (two tiles ' + n(was, 'you:shotgun@2') + ' -> ' + sg2 + '); rifle next tile ' + Math.round(100 * share(was, 'rifle', 1)) + '% -> ' + Math.round(100 * share(now, 'rifle', 1)) + '% of its shots; won ' + was.won + ' -> ' + now.won + ' of ' + now.fights);

  /* B5: the page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const profile of ['phone_portrait', 'computer']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'], teach: false, odds: false }) });
    const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
      for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
      const lines = [];
      for (const [id, dd] of [['crossbow', 1], ['handgonne', 2]]) {
        const set = await p.evaluate(([id, dd]) => { const S = FIGHT.S, u = FIGHT.current(), T = FIGHT._t, th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
          S.units.forEach(v => { if (v.side === 'them' && v !== th[0]) v.fled = true; }); const t = th[0];
          u.weapon = DB.weapons.rows.find(w => w.id === id); u.loaded = true; u.ammo = null; u.ap = u.apTurn; u.fat = 0;
          for (let y = 1; y < S.h - 1; y++) for (let x = 1; x + dd < S.w - 1; x++) {
            if (![0, dd].every(k => T.passable(x + k, y) && !S.units.some(v => v !== u && v !== t && FIGHT.onField(v) && v.x === x + k && v.y === y))) continue;
            u.x = x; u.y = y; t.x = x + dd; t.y = y; if (!FIGHT.canStrike(u, t)) continue;
            FIGHT_UI.pend = null; FIGHT_UI.glide = null; FIGHT_UI.cx = (x + dd / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; clampCam(); hud();
            const qx = sx((x + dd + .5) * FIGHT_UI.tw), qy = sy((y + .5) * FIGHT_UI.th), top = document.getElementById('top').getBoundingClientRect().bottom;
            if (!(qx > 30 && qx < innerWidth - 30 && qy > top + 40 && qy < innerHeight - BOTH - 40)) continue;   /* the man on the glass, clear of the bars */
            return { t: { x: x + dd, y }, chance: FIGHT.hitChance(u, t).chance, band: FIGHT.band(u, t) };
          }
          return null; }, [id, dd]);
        if (!set) { lines.push(id + ': no open row'); continue; }
        await p.waitForTimeout(400);
        const at = await p.evaluate(q => ({ x: sx((q.x + .5 + stagger(q.y)) * FIGHT_UI.tw), y: sy((q.y + .6) * FIGHT_UI.th) }), set.t);
        let said = '';
        for (const dy of [0, -.15, .2]) {   /* his body stands over his tile: a finger that lands beside him is aimed again */
          const a2 = { x: at.x, y: at.y + dy * (await p.evaluate(() => FIGHT_UI.th * FIGHT_UI.zoom)) };
          if (profile === 'computer') { await p.mouse.move(a2.x - 20, a2.y - 20); await p.mouse.move(a2.x, a2.y, { steps: 3 }); } else await p.touchscreen.tap(a2.x, a2.y);
          await p.waitForTimeout(500);
          said = await p.evaluate(() => document.getElementById('say').innerText);
          if (/% to hit/.test(said)) break;
          await p.evaluate(() => { FIGHT_UI.pend = null; hud(); });
        }
        lines.push({ id, said, set });
      }
      const rifle = lines.find(l => l.id === 'crossbow'), shot = lines.find(l => l.id === 'handgonne');
      const okR = rifle && /Point-blank/.test(rifle.said) && new RegExp('-' + (-rifle.set.band.hit) + '%').test(rifle.said) && rifle.said.indexOf(rifle.set.chance + '%') >= 0;
      const okS = shot && /spreads/.test(shot.said) && new RegExp(Math.round(shot.set.band.dmg * 100) + '%').test(shot.said);
      leg(okR && okS, '*** B5 ' + (profile === 'computer' ? 'COMPUTER' : 'PHONE') + ': THE AIM SAYS THE BAND *** (rule 187(c)): a rifle at the man beside him says point-blank and its points, a shotgun two tiles off the share of its damage',
        lines.map(l => typeof l === 'string' ? l : l.id + ' "' + l.said.replace(/\n/g, ' / ').slice(0, 120) + '"').join(' | '));
    } catch (e) { errs.push(profile + ': ' + e.message.slice(0, 160)); }
    finally { await d.close(); }
  }
  leg(errs.length === 0, 'B6 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

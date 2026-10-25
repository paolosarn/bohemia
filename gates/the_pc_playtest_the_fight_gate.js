#!/usr/bin/env node
/* THE PC PLAYTEST: THE FIGHT (COMBAT [the PC playtest: the fight's part], rule 164, Paolo 10/24 evening: 'I'm playing this on my
   PC and I'm so fucking impressed, we've come such a long way, but I have a lot of feedback';
   records/BOHEMIA_PAOLO_THE_PC_PLAYTEST_AND_THE_TWENTY_DOLLARS_10_24_26.md, items 12 to 17 and 26).

   Legs, on his phone's profile (390 x 844), the real fight page, slices/BOHEMIA_FIGHT.html, opened the way the demo's door opens
   it (a company and a party handed, the formation first):
   1. ITEM 12, THE AUTO COLOUR BEFORE ANYTHING ('before I can even press anything... I should know the colour of the Auto
      button'): the instant the loading screen leaves, AUTO already wears its colour, on the formation, before any tap; the
      read began before the board came up;
   2. a fight he cannot win wears red on that first frame, a clean win nearly certain glows green on it;
   3. a man moved on the formation is a new read, and the colour follows the line he set;
   4. a tap on the glowing AUTO on the formation plays the fight out (the formation kept, AUTO at the top pace) to the recap;
   5. no worker on the phone: the frames still read it on the formation, and the real die is where it was;
   6. ITEM 17, WHO IS ON MY TEAM ('it's hard to tell who's on my team'; his 10/2: 'health and armour bars above the people is
      cool'): every man of both sides on the field wears his bars over his head, the rim gold for his and rust for theirs, read
      off the drawn pixels; on a phone and on a computer; the turn strip's faces wear a band of the same colours;
   7. ITEM 14, HEIGHTS THAT MEAN SOMETHING ('one-story versus two-story or even a three-story building, I don't know how that
      helps me and it's hard to tell visually'): every roof deals at its storeys (Battle Brothers' levels 1 to 3, ours.roof_storeys);
      on the live rules: from three up a shot gains the library's +10%, a shot from the street at a man three up loses 30%, his
      gun reaches 3 tiles further and he sees 3 further, and no club reaches him across the gap (one storey up, it does);
   8. what it gives, SHOWN: a ladder leans on every roof you can climb (none on a wall, none on a rise of bare ground), a man on a
      roof stands higher the higher it is with one chevron a level over his head, the tap on a roof says what it gives, the
      walk's tag says ROOF n UP, the aim says the height's points both ways, and a tap on a wall says it is a wall;
   9. ITEM 15, SWITCH WEAPONS FROM THE BAG ('you can't switch weapon... Battle Brothers has two slots to bring shit into combat...
      it takes up stamina'): the crew screen's bag (gear.bag) rides into the fight, an empty one empty, none handed the kit (a
      rifleman a pistol, a pistol man the pipe); a swap costs the library's 4 AP, Quick Hands the first a turn free; the gun keeps
      its rounds in the bag; the bag weighs half its weight on his wind (Bags and Belts: only a two-hander's); a two-hander puts
      the car door on his back and a one-hander brings it back; on AUTO the bag is never touched (rule 180(g): the swap is his button);
   10. shown: a square a bag item with the swap's AP, a tap swaps it (the strike square and the gun in his hands follow), too
      few AP says so; a car door in the bag straps on for 4 AP (never beside a two-hander); the end message says what each hand
      holds when the fight ends;
   11. ITEM 16, BETTER THAN BATTLE BROTHERS ON BOTH ('if Battle Brothers went to mobile... this is one thing that holds them
      back'): on a computer the mouse over a tile shows the walk and its AP (over a man in reach, the aim) and ONE click does it;
      the lines say click, not tap; Battle Brothers' fight keys from the library (Enter starts and ends, Space waits, W A S D
      pan, Page Up zooms, Alt hides the bars, C opens the card, R twice ends the round, 1 to 9 the skill row); on a phone one tap
      shows and a second does, as before;
   12. [eyes: tap again, nothing]: RETREAT's ask stays as long as its arm, so the tap it asks for, read and pressed ten beats
      later, orders the retreat;
   13. the page threw nothing.
   Run: node gates/the_pc_playtest_the_fight_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE PC PLAYTEST: THE FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const CREW3 = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];
/* the moment the loading screen leaves, written down by the page itself (armed before any of its scripts) */
const WATCH = 'document.addEventListener("DOMContentLoaded", function () { var L = document.getElementById("load"); if (!L) return;' +
  ' new MutationObserver(function () { if (L.style.display !== "none" || window.__boardUp) return; var t = document.querySelector("#bauto .tint");' +
  ' window.__boardUp = { at: performance.now(), deploy: !!FIGHT.S.deploy, tint: t ? t.style.backgroundColor : "", glow: document.getElementById("bauto").classList.contains("glow"),' +
  ' shown: ODDS.shown, postAt: ODDS.postAt, worker: !!ODDS.W, tapped: !!FIGHT_UI.tapped }; }).observe(L, { attributes: true, attributeFilter: ["style"] }); });';
const red = t => /^rgba\(208, 48, 32/.test(t), green = t => /^rgba\(46, 160, 67/.test(t);

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const errs = [];
  const boot = async (o) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: WATCH + 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    await d.page.waitForFunction(() => window.__boardUp && FIGHT_UI.board, null, { timeout: 60000 }); return d; };

  /* 1: the demo's own shape: six of his against a party of six, the formation first */
  {
    const crew6 = CREW3.concat([{ background: 'companion_2hand', name: 'GRIZ' }, { background: 'companion_ranged', name: 'NENA' }, { background: 'companion_1hand', name: 'CHEWY' }]);
    const d = await boot({ seed: 21, kind: 'suburb', company: crew6, cap: 12, formation: null, party: { count: 6, days: 3, difficulty: 1, faction: 'brigands' } });
    const b = await d.page.evaluate(() => window.__boardUp);
    leg(b.deploy && !b.tapped && (red(b.tint) || green(b.tint)) && b.shown !== null && b.postAt < b.at,
      '*** ITEM 12: THE INSTANT THE BOARD COMES UP, ON THE FORMATION, BEFORE ANY TAP, AUTO ALREADY WEARS ITS COLOUR ***',
      'formation ' + b.deploy + ', tint ' + (b.tint || 'NONE') + ', the read began ' + Math.round(b.at - b.postAt) + ' ms before the board, worker ' + b.worker);
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 1b: THE REAL SURFACE: the demo's own door (nfOpen, the shell's company and party, the fight behind the clouds) */
  {
    const d = await open({ profile: 'phone_portrait' });
    const p = d.page;
    await p.evaluate(() => nfOpen({ district: 'suburbs', world: { night: false, day: 3 } }));
    const fr = await (await p.waitForSelector('#fightFrame', { timeout: 30000 })).contentFrame();
    await fr.evaluate(WATCH.replace('document.addEventListener("DOMContentLoaded", function () {', '(function () {').replace(/\}\);$/, '})();')).catch(() => {});
    await fr.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && document.getElementById('load').style.display === 'none', null, { timeout: 90000 });
    const b = await fr.evaluate(() => { const t = document.querySelector('#bauto .tint'); return window.__boardUp || { tint: t ? t.style.backgroundColor : '', deploy: !!FIGHT.S.deploy, shown: ODDS.shown, late: true }; });
    const now = await fr.evaluate(() => ({ tint: document.querySelector('#bauto .tint').style.backgroundColor, runs: ODDS.runs }));
    leg((red(b.tint) || green(b.tint)) && b.deploy, '*** ITEM 12 IN THE DEMO: THROUGH THE GAME\'S OWN DOOR, AUTO WEARS ITS COLOUR THE MOMENT THE FIGHT IS SHOWN ***',
      'at the reveal ' + (b.tint || 'NONE') + (b.late ? ' (read just after it)' : '') + ', formation ' + b.deploy + '; now ' + now.tint + ', ' + now.runs + ' runs');
    errs.push.apply(errs, (d.errs || []).filter(e => /BOHEMIA_FIGHT/.test(e))); await d.close();
  }
  /* 2, 3: one of his against five thugs (red), then three of his against one thug (green, glowing) */
  {
    const d = await boot({ seed: 22, kind: 'suburb', flat: true, company: CREW3.slice(0, 1), cap: 1, formation: null, band: Array(5).fill('brigand_thug'), teach: false });
    const b = await d.page.evaluate(() => window.__boardUp);
    const d2 = await boot({ seed: 21, kind: 'suburb', flat: true, company: CREW3, cap: 12, formation: null, band: ['brigand_thug'], teach: false });
    const g = await d2.page.evaluate(() => window.__boardUp);
    leg(b.deploy && red(b.tint) && !b.glow && g.deploy && green(g.tint) && g.glow,
      '  on that first frame: a fight he cannot win wears RED; a clean win nearly certain glows GREEN', 'one v five ' + b.tint + ' glow ' + b.glow + '; three v one ' + g.tint + ' glow ' + g.glow);
    /* 3: move a man on the formation: a new read of the new line */
    const p = d2.page;
    const m = await p.evaluate(() => { const S = FIGHT.S, k0 = ODDS.key, j0 = ODDS.job, u = S.units.filter(v => v.side === 'you')[0];
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if ((x !== u.x || y !== u.y) && FIGHT.deployMove && FIGHT.deployMove(u, x, y)) return { k0, j0, to: x + ',' + y };
      return { k0, j0, to: null }; });
    await p.waitForTimeout(400);
    const m2 = await p.evaluate(() => ({ k: ODDS.key, j: ODDS.job, runs: ODDS.runs, tint: document.querySelector('#bauto .tint').style.backgroundColor }));
    leg(m.to && m2.k !== m.k0 && m2.j > m.j0 && m2.runs > 0 && (green(m2.tint) || red(m2.tint)), '  a man moved on the formation is a new read; the colour follows the line he set', 'moved to ' + m.to + ', job ' + m.j0 + ' -> ' + m2.j + ', ' + m2.runs + ' runs, ' + m2.tint);
    /* 4: the glowing AUTO tapped on the formation plays it out */
    await p.waitForFunction(() => document.getElementById('bauto').classList.contains('glow'), null, { timeout: 10000 }).catch(() => {});
    const a = await p.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(300);
    const f0 = await p.evaluate(() => ({ auto: FIGHT_UI.auto, finish: FIGHT_UI.finish, deploy: !!FIGHT.S.deploy }));
    await p.waitForFunction(() => FIGHT.S.over && document.getElementById('over').style.display === 'flex', null, { timeout: 60000 }).catch(() => {});
    const f1 = await p.evaluate(() => ({ over: FIGHT.S.over, result: FIGHT.S.result }));
    leg(f0.auto && f0.finish && f1.over, '  a tap on the glowing AUTO on the formation plays it out at the top pace to the recap', 'auto ' + f0.auto + ', finishing ' + f0.finish + ', ' + f1.result);
    errs.push.apply(errs, d.errs, d2.errs); await d.close(); await d2.close();
  }
  /* 5: no worker */
  {
    const d = await boot({ seed: 22, kind: 'suburb', flat: true, company: CREW3.slice(0, 1), cap: 1, formation: null, band: Array(5).fill('brigand_thug'), teach: false, oddsWorker: false });
    const p = d.page, s0 = await p.evaluate(() => SEED);
    await p.waitForFunction(() => ODDS.shown !== null || ODDS.broke, null, { timeout: 15000 }).catch(() => {});
    const o = await p.evaluate(() => ({ W: ODDS.W, shown: ODDS.shown, broke: ODDS.broke || '', deploy: !!FIGHT.S.deploy, seed: SEED, tint: document.querySelector('#bauto .tint').style.backgroundColor }));
    leg(o.W === false && o.shown !== null && !o.broke && o.deploy && red(o.tint) && o.seed === s0, '  no worker: the frames read it on the formation, and the real die is where it was', 'worker ' + o.W + ', ' + o.tint + ', the die ' + (o.seed === s0 ? 'untouched' : 'MOVED'));
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 6: who is mine, on the phone and on the computer */
  for (const prof of ['phone_portrait', 'computer']) {
    const crew6 = CREW3.concat([{ background: 'companion_2hand', name: 'GRIZ' }, { background: 'companion_ranged', name: 'NENA' }, { background: 'companion_1hand', name: 'CHEWY' }]);
    const o = { seed: 21, kind: 'suburb', flat: true, company: crew6, cap: 12, formation: null, party: { count: 6, days: 3, difficulty: 1, faction: 'brigands' }, deploy: false, teach: false };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: prof, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    await d.page.waitForTimeout(400);
    const r = await d.page.evaluate(() => {
      const near = (p, hex) => { const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255]; return Math.abs(p[0] - c[0]) + Math.abs(p[1] - c[1]) + Math.abs(p[2] - c[2]) < 40; };
      const g = cv.getContext('2d'), men = FIGHT.S.units.filter(v => FIGHT.onField(v) && FIGHT.shown(v)), now = performance.now(), out = { you: [0, 0], them: [0, 0], bad: [] };
      men.forEach(v => { const b = v._bar, side = v.side === 'you' ? 'you' : 'them'; out[side][1]++;
        if (!b || now - b.at > 500) { out.bad.push(v.name + ' no bars'); return; }
        const px = g.getImageData(Math.floor((b.x + .5) * DPR), Math.floor((b.y + .5) * DPR), 1, 1).data;
        const want = side === 'you' ? (b.lit ? '#f0d296' : SIDE_RIM.you) : (b.lit ? '#f07a5e' : SIDE_RIM.them);
        if (near(px, want)) out[side][0]++; else out.bad.push(v.name + ' rgb(' + px[0] + ',' + px[1] + ',' + px[2] + ') not ' + want); });
      /* the strip: the band at the foot of each face */
      const faces = Array.from(document.querySelectorAll('#order canvas')), line = FIGHT.S.order.slice(FIGHT.S.idx).map(FIGHT.byId).filter(FIGHT.onField).slice(0, 9);
      out.strip = faces.map((c, i) => { const v = line[i], p = c.getContext('2d').getImageData(Math.round(c.width / 2), c.height - Math.max(2, Math.round(c.height * .05)), 1, 1).data;
        return v && near(p, v.side === 'you' ? SIDE_RIM.you : SIDE_RIM.them); });
      out.sides = line.map(v => v.side[0]).join('');
      return out; });
    leg(r.you[1] > 0 && r.them[1] > 0 && r.you[0] === r.you[1] && r.them[0] === r.them[1] && r.strip.length && r.strip.every(Boolean),
      (prof === 'phone_portrait' ? '*** ITEM 17: WHO IS MINE AT A GLANCE: EVERY MAN WEARS HIS BARS, GOLD-RIMMED HIS, RUST-RIMMED THEIRS; THE STRIP\'S FACES THE SAME ***' : '  the same on a computer'),
      prof + ': his ' + r.you[0] + '/' + r.you[1] + ', theirs ' + r.them[0] + '/' + r.them[1] + ' read off the pixels; strip ' + r.sides + ' ' + r.strip.filter(Boolean).length + '/' + r.strip.length + (r.bad.length ? '; ' + r.bad.slice(0, 3).join(', ') : ''));
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 7: the rules, headless */
  {
    const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
    const ctx = engine(), F = ctx.FIGHT, T = F._t;
    let found = null, sd = 0;
    for (sd = 1; sd < 60 && !found; sd++) { ctx.setSeed(sd); F.setup({ kind: 'works', company: CREW3, cap: 12, deploy: false, formation: null, band: ['brigand_thug'] });
      const S = F.S; for (let y = 0; y < S.h && !found; y++) for (let x = 0; x < S.w && !found; x++) if (S.terrain[y][x] === 'height3') found = { x, y }; }
    const S = F.S, kinds = {}; S.terrain.forEach(r => r.forEach(k => kinds[k] = (kinds[k] || 0) + 1));
    const roofs = ['main.0', 'main.1', 'strip.0', 'strip.1', 'ruin.0', 'ruin.1', 'works.0'];
    const tableOk = roofs.every(n => (ctx.DB.ours.roof_storeys.value.blocks[n] || []).length > 0);
    let r = { found: !!found };
    if (found) {
      const me = S.units.filter(v => v.side === 'you' && F.isRanged(v.weapon))[0], foe = S.units.filter(v => v.side === 'them')[0];
      /* an open tile three to four tiles off on the flat */
      let g = null; for (let y = 0; y < S.h && !g; y++) for (let x = 0; x < S.w && !g; x++) { const d = Math.max(Math.abs(x - found.x), Math.abs(y - found.y));
        if (d >= 3 && d <= 4 && S.terrain[y][x] === 'flat' && T.passable(x, y) && T.sees({ x: found.x, y: found.y }, { x, y })) g = { x, y }; }
      const put = (u, q) => { u.x = q.x; u.y = q.y; };
      S.units.forEach(v => { if (v !== me && v !== foe) { v.x = -50; v.y = -50; } });
      me.rskill = 60; foe.rskill = 60; me.rdef = 0; foe.rdef = 0;
      const was = S.terrain[found.y][found.x];
      put(me, found); put(foe, g);
      const upHi = F.hitChance(me, foe); S.terrain[found.y][found.x] = 'flat'; const upFlat = F.hitChance(me, foe); S.terrain[found.y][found.x] = was;
      put(foe, found); put(me, g); const fromBelow = F.hitChance(foe, me), dn = F.hitChance(me, foe); S.terrain[found.y][found.x] = 'flat'; const dnFlat = F.hitChance(me, foe); S.terrain[found.y][found.x] = was;
      put(me, found); put(foe, g);
      const visHi = T.vision(me, foe); S.terrain[found.y][found.x] = 'flat'; const visFlat = T.vision(me, foe); S.terrain[found.y][found.x] = was;
      /* reach: the farthest a gun reaches, from three up and from the flat (the same tile) */
      const reachOf = () => { let m = 0; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { foe.x = x; foe.y = y; if (F.inRange ? F.inRange(me, foe) : F.canStrike(me, foe)) m = Math.max(m, Math.max(Math.abs(x - me.x), Math.abs(y - me.y))); } return m; };
      me.ap = me.apTurn; me.fat = 0; const rHi = reachOf(); S.terrain[found.y][found.x] = 'flat'; const rFlat = reachOf(); S.terrain[found.y][found.x] = was; put(foe, g);
      /* a club at the foot of the wall: across three storeys no; across one, yes */
      let foot = null; for (const [dx, dy] of [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]]) { const q = { x: found.x + dx, y: found.y + dy }; if (S.terrain[q.y] && S.terrain[q.y][q.x] === 'flat' && T.passable(q.x, q.y)) { foot = q; break; } }
      const melee = S.units.filter(v => v.side === 'them' && !F.isRanged(v.weapon))[0];
      let clubHi = null, clubLow = null;
      if (melee && foot) { melee.ap = melee.apTurn; melee.fat = 0; put(melee, foot); put(me, found); clubHi = F.canStrike(melee, me); S.terrain[found.y][found.x] = 'height'; clubLow = F.canStrike(melee, me); S.terrain[found.y][found.x] = was; }
      r = Object.assign(r, { seed: sd - 1, at: found, g, lv: F.level(found.x, found.y), up: [upHi.chance, upFlat.chance, upHi.parts.join('/')], below: [fromBelow.chance, dn.chance, dnFlat.chance], vis: [visHi, visFlat], reach: [rHi, rFlat], club: [clubHi, clubLow], kinds });
    }
    leg(tableOk && r.found && r.lv === 3 && r.up[0] - r.up[1] === 10 && /above/.test(r.up[2]) && r.below[1] - r.below[2] === -30,
      '*** ITEM 14: A ROOF STANDS AT ITS STOREYS: FROM THREE UP +10% TO HIT, FROM THE STREET AT HIM -30% ***', JSON.stringify({ seed: r.seed, at: r.at, level: r.lv, up: r.up, below: r.below, kinds: r.kinds }));
    leg(r.found && r.reach[0] - r.reach[1] === 3 && r.vis[0] - r.vis[1] === 3 && r.club[0] === false && r.club[1] === true,
      '  from three up his gun reaches 3 tiles further and he sees 3 further; no club reaches him across three storeys (across one, it does)', JSON.stringify({ reach: r.reach, sight: r.vis, club: r.club }));
  }
  /* 8: shown, on the page */
  {
    const o = { seed: 5, kind: 'works', flat: false, company: CREW3, cap: 12, formation: null, deploy: false, teach: false, band: ['brigand_thug', 'brigand_thug'] };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_landscape', arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    const mineNow = async () => { for (let i = 0; i < 200; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return FIGHT.S.over ? 'over' : u && crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'busy'; }); if (st !== 'busy') return st; await p.waitForTimeout(80); } return 'stuck'; };
    await mineNow();
    const r = await p.evaluate(() => {
      const S = FIGHT.S, u = FIGHT.current(), out = {};
      const roofs = [], rises = [], walls = [];
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { if (FIGHT.isRoof(x, y)) roofs.push({ x, y, lv: FIGHT.level(x, y) }); else if (FIGHT.level(x, y) > 0) rises.push({ x, y }); else if (FIGHT.rowAt(x, y) === 'obstacles') walls.push({ x, y }); }
      /* one ladder for each roof (a run of one level along a row is one roof) */
      const firsts = roofs.filter(q => !roofs.some(o => o.y === q.y && o.x === q.x - 1 && o.lv === q.lv));
      FIGHT_UI.roofsOf = null; drawLadders();
      out.ladders = (UI.ladders || FIGHT_UI.ladders || []).length; out.roofsOn = firsts.filter(q => { const X = sx((q.x + .8) * FIGHT_UI.tw), F0 = sy((q.y + .93) * FIGHT_UI.th); return X > -40 && X < W + 40 && F0 > -40 && F0 - FIGHT_UI.th * FIGHT_UI.zoom < H + 40; }).length;
      out.ladderOnRise = (FIGHT_UI.ladders || []).some(l => rises.some(q => q.x === l.x && q.y === l.y)); out.ladderOnWall = (FIGHT_UI.ladders || []).some(l => walls.some(q => q.x === l.x && q.y === l.y));
      out.tall = (FIGHT_UI.ladders || []).map(l => [l.lv, Math.round(l.foot - l.top)]);
      /* a man of his on the tallest roof */
      const top = roofs.filter(q => FIGHT._t.passable(q.x, q.y) && !S.units.some(v => FIGHT.onField(v) && v.x === q.x && v.y === q.y)).sort((a, b) => b.lv - a.lv)[0];
      out.top = top; out.walls = walls.length; out.rises = rises.length;
      return out; });
    leg(r.ladders > 0 && r.ladders === r.roofsOn && !r.ladderOnRise && !r.ladderOnWall && r.tall.every((t, i, a) => a.every(q => q[0] <= t[0] || q[1] > t[1])),
      '*** ITEM 14, SHOWN: A LADDER ON EVERY ROOF YOU CAN CLIMB, NONE ON A WALL OR BARE GROUND, LONGER THE HIGHER THE ROOF ***', 'ladders ' + r.ladders + ' of ' + r.roofsOn + ' roofs on the glass; level and length ' + JSON.stringify(r.tall) + '; walls ' + r.walls + ', rises ' + r.rises);
    /* the man on the tallest roof: higher, his chevrons */
    const m = await p.evaluate((top) => { const S = FIGHT.S, u = FIGHT.current(), f = { x: u.x, y: u.y };
      u.x = top.x; u.y = top.y; u._at = undefined; FIGHT_UI.cx = (u.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .5) * FIGHT_UI.th; FIGHT_UI.pinched = true; FIGHT_UI.glide = null;
      return { id: u.id, lv: FIGHT.level(u.x, u.y), rise: riseAt(u.x, u.y), flatRise: riseAt(f.x, f.y) }; }, r.top);
    await p.waitForTimeout(400);
    const ch = await p.evaluate((id) => { const u = FIGHT.byId(id); return u._up && performance.now() - u._up.at < 500 ? u._up.n : 0; }, m.id);
    leg(m.lv === r.top.lv && m.rise > m.flatRise && ch === m.lv, '  a man on a roof stands higher the higher it is, one chevron a level over his head', 'level ' + m.lv + ', rise ' + m.rise + ' of a tile (the street ' + m.flatRise + '), chevrons ' + ch);
    /* the words: a tap on a roof tile in his reach; the aim both ways; a tap on a wall */
    const w = await p.evaluate(() => {
      const S = FIGHT.S, u = FIGHT.current(), out = {};
      const f = FIGHT.reach(u, null, true), cand = [];
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.level(x, y) > 0 && f.best[f.key(x, y)] !== undefined) cand.push({ x, y });
      out.heightSay = cand.length ? heightSay(cand[0].x, cand[0].y) : heightSay(u.x, u.y);
      out.lv = cand.length ? FIGHT.level(cand[0].x, cand[0].y) : FIGHT.level(u.x, u.y);
      const t = S.units.filter(v => v.side === 'them' && FIGHT.onField(v))[0];
      out.above = aimLines(u, t).join(' ');
      out.below = aimLines(t, u).join(' ');
      return out; });
    /* a real tap on a roof tile near him: the line and the tag */
    const tap = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(); u.ap = u.apTurn; const f = FIGHT.reach(u, null, true);
      for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.level(x, y) > 0 && !(x === u.x && y === u.y) && f.best[f.key(x, y)] !== undefined && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) {
        const X = sx((x + .5) * FIGHT_UI.tw), Y = sy((y + .6) * FIGHT_UI.th); if (X > 20 && X < W - 20 && Y > 20 && Y < H - BOTH - 20) return { x, y, X, Y, lv: FIGHT.level(x, y) }; }
      return null; });
    let said = '', tag = '';
    if (tap) { await p.touchscreen.tap(tap.X, tap.Y); await p.waitForTimeout(250);
      said = await p.evaluate(() => document.getElementById('say').textContent); tag = await p.evaluate(() => document.getElementById('pick').innerText.replace(/\s+/g, ' ')); }
    leg(/up: \+10% to hit anyone lower, guns reach \d+ tiles? farther, sees \d+ tiles? farther/.test(w.heightSay) && /From \d+ up: \+10%/.test(w.above.replace(/<[^>]+>/g, '')) && /He is \d+ up: -\d+%/.test(w.below.replace(/<[^>]+>/g, '')) && (!tap || (/up: \+10%/.test(said) && / UP/.test(tag))),
      '  what it gives, said: on the tile he taps, on the walk\'s tag, and in the aim both ways', JSON.stringify({ tile: w.heightSay, tapped: tap ? said + ' | ' + tag : 'no roof in reach', above: w.above.replace(/<[^>]+>/g, '').slice(0, 140), below: w.below.replace(/<[^>]+>/g, '').slice(0, 140) }));
    /* a tap on a wall */
    const wall = await p.evaluate(() => { const S = FIGHT.S; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (FIGHT.rowAt(x, y) === 'obstacles') { const X = sx((x + .5) * FIGHT_UI.tw), Y = sy((y + .6) * FIGHT_UI.th); if (X > 20 && X < W - 20 && Y > 20 && Y < H - BOTH - 20) return { X, Y }; } return null; });
    let wallSay = '';
    if (wall) { await p.evaluate(() => { FIGHT_UI.pend = null; }); await p.touchscreen.tap(wall.X, wall.Y); await p.waitForTimeout(250); wallSay = await p.evaluate(() => document.getElementById('say').textContent); }
    leg(!!wall && /A wall/.test(wallSay) && !/Too far/.test(wallSay), '  a tap on a house that is a wall says it is a wall, never \'too far\'', wallSay);
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 9: the bag, headless */
  {
    const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
    const ctx = engine(), F = ctx.FIGHT, DBo = ctx.DB;
    const rows = DBo.ours.weapon_rows.value;
    const crew = [{ background: 'companion_ranged', name: 'TINA', gear: { main: rows.rifle, off: null, body: null, head: null } },
      { background: 'companion_1hand', name: 'DESI', gear: { main: rows.pistol, off: rows.car_door, body: null, head: null } },
      { background: 'companion_2hand', name: 'RAUL', gear: { main: rows.pipe, off: null, body: null, head: null, bag: [rows.sledge] } },
      { background: 'companion_2hand', name: 'GRIZ', gear: { main: rows.pipe, off: null, body: null, head: null, bag: [] } },
      { background: 'companion_1hand', name: 'NENA', gear: { main: rows.pipe, off: null, body: null, head: null, bag: [rows.car_door, null] } },
      { background: 'companion_2hand', name: 'CHEWY', gear: { main: rows.sledge, off: null, body: null, head: null, bag: [rows.car_door] } }];
    ctx.setSeed(9); F.setup({ company: crew, cap: 12, deploy: false, formation: null, flat: true, band: ['brigand_thug'] });
    const S = F.S, by = n => S.units.filter(u => u.name === n)[0], T = by('YOU'), D = by('DESI'), Ra = by('RAUL'), G = by('GRIZ');
    const nm = u => (u.bag || []).map(w => F.jobOfWeapon(w)).join(',');
    const kit = { TINA: nm(T), DESI: nm(D), RAUL: nm(Ra), GRIZ: nm(G) };
    leg(kit.TINA === 'pistol' && kit.DESI === 'pipe' && kit.RAUL === 'sledge' && kit.GRIZ === '',
      '*** ITEM 15: THE CREW SCREEN\'S BAG RIDES INTO THE FIGHT (AN EMPTY ONE EMPTY); NONE HANDED, THE KIT ***', JSON.stringify(kit));
    /* the swap's cost, Quick Hands, rounds kept */
    const turn = u => { S.order = [u.id].concat(S.order.filter(id => id !== u.id)); S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.swappedFree = false; u.begun = true; };
    turn(T); const ap0 = T.ap, ok1 = F.swap(T, 0), ap1 = T.ap, inHand = F.jobOfWeapon(T.weapon), r0 = T.ammo; T.ammo = r0 - 1;   /* one round fired */
    turn(T); F.swap(T, 0); const back = F.jobOfWeapon(T.weapon); turn(T); F.swap(T, 0); const kept = T.ammo;
    T.perks.push('quick_hands'); turn(T); const q0 = T.ap; F.swap(T, 0); const q1 = T.ap; F.swap(T, 0); const q2 = T.ap;
    leg(ok1 && ap0 - ap1 === 4 && inHand === 'pistol' && back === 'rifle' && kept === r0 - 1 && q0 - q1 === 0 && q1 - q2 === 4,
      '  a swap costs the library\'s 4 AP; Quick Hands makes the first a turn free; the gun in the bag keeps its rounds', JSON.stringify({ cost: ap0 - ap1, out: inHand, back, rounds: [r0, kept], quick: [q0 - q1, q1 - q2] }));
    /* the weight; the slots; the shield */
    turn(D); const half = DBo.rules.fatigue.bag_items_penalty_multiplier.value, pipeW = (D.bag[0] || {}).fatigue;
    const fw = F._t ? F.bagFat(D) : null; D.perks.push('bags_and_belts'); const fwBB = F.bagFat(D), slotsBB = F.bagSlots(D); D.perks.pop();
    const rauBB = (Ra.perks.push('bags_and_belts'), F.bagFat(Ra)); Ra.perks.pop();
    turn(Ra); const sh0 = !!Ra.shield; Ra.shield = DBo.armor.shields.filter(r => r.id === rows.car_door)[0]; F.swap(Ra, 0); const shOut = !!Ra.shield, shBack = !!Ra.shieldBack; turn(Ra); F.swap(Ra, 0); const shIn = !!Ra.shield;
    leg(fw === pipeW * half && fwBB === 0 && rauBB < 0 && slotsBB === 4 && F.bagSlots(T) === 2 && !shOut && shBack && shIn,
      '  the bag weighs half its weight (Bags and Belts: only a two-hander, four slots); a two-hander puts the car door on his back, a one-hander brings it back',
      JSON.stringify({ pipeInBag: fw, withBB: fwBB, sledgeWithBB: rauBB, slots: [F.bagSlots(T), slotsBB], shield: [shOut, shBack, shIn] }));
    /* AUTO: an empty rifle he cannot reload this turn, a loaded pistol in the bag */
    turn(T); T.perks = T.perks.filter(k => k !== 'quick_hands'); if (F.jobOfWeapon(T.weapon) !== 'rifle') F.swap(T, 0); turn(T);
    T.loaded = false; T.ap = T.apTurn; T.fat = F.fatMax(T); const foe = S.units.filter(u => u.side === 'them')[0]; foe.x = T.x + 3; foe.y = T.y;
    const ev0 = S.log.length; F.aiStep(T); const did = S.log.slice(ev0).map(e => e.t);
    /* RE-AIMED 10/25 (rule 180(g), Paolo 10/25, the same day and newer: 'when I mean abilities, I mean buttons you can press during
       combat that aren't fire or attack with melee'): the bag swap is his button, never AUTO's; on AUTO the empty rifle stays
       in his hands (the swap stays one tap away for him, legs above) */
    leg(did.indexOf('swap') < 0 && F.jobOfWeapon(T.weapon) === 'rifle', '  on AUTO an empty gun is never swapped from the bag: the swap is his button (rule 180(g))', did.join(' '));
    /* a shield in the bag: onto a free arm for the library's 4 AP (Quick Hands never makes it free); never beside a two-hander */
    const N = by('NENA'), C = by('CHEWY');
    turn(N); N.perks.push('quick_hands'); const n0 = N.ap, sw = F.swap(N, 0), n1 = N.ap, onArm = !!N.shield, left = N.bag[0];
    turn(C); const cs = F.canSwap(C, 0);
    leg(sw && n0 - n1 === 4 && onArm && left === null && cs === false, '  a car door in the bag straps on for 4 AP (Quick Hands: never free for a shield); never beside a two-hander',
      JSON.stringify({ cost: n0 - n1, onArm, slotAfter: left, twoHander: cs }));
  }
  /* 10: shown */
  {
    const CR = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];
    const o = { seed: 21, kind: 'suburb', flat: true, company: CR, cap: 12, formation: null, deploy: false, teach: false, band: ['brigand_thug', 'brigand_thug'] };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    for (let i = 0; i < 150; i++) { if (await p.evaluate(() => { const u = FIGHT.current(); return u && crewControlled(u) && !FIGHT_UI.anim.length; })) break; await p.waitForTimeout(100); }
    const a = await p.evaluate(() => { const u = FIGHT.current(); u.ap = u.apTurn; hud(); const q = document.querySelector('#skills .sq.bag'); if (!q) return null; const r = q.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height), label: q.innerText.trim(), title: q.title, job: u.job, gun: gunSheet(u, lookOf(u)) ? gunSheet(u, lookOf(u)).row : null, ap: u.ap }; });
    let b = null;
    if (a) { await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(400);
      b = await p.evaluate(() => { const u = FIGHT.current(); const q = document.querySelector('#skills .sq.bag');
        return { job: u.job, ap: u.ap, say: document.getElementById('say').textContent, label: q ? q.innerText.trim() : '', strikeIcon: document.querySelector('#bstrike canvas') ? 1 : 0, gun: gunSheet(u, lookOf(u)) ? gunSheet(u, lookOf(u)).row : null }; }); }
    /* too few AP */
    const held = await p.evaluate(() => { const u = FIGHT.current(), L = spoilsOf().looks.filter(l => l.name === u.name)[0]; return L && L.held; });
    const c = await p.evaluate(() => { const u = FIGHT.current(); u.ap = 1; hud(); bagTap(0); return document.getElementById('say').textContent; });
    leg(!!a && a.w >= 44 && a.h >= 44 && /4 AP/.test(a.label) && b && b.job !== a.job && a.ap - b.ap === 4 && /swaps the \w+ for the \w+ from the bag\. 4 AP\./.test(b.say) && b.gun !== a.gun && /Not enough AP: a swap costs 4/.test(c),
      '*** ITEM 15, SHOWN: A SQUARE FOR THE BAG WITH THE SWAP\'S AP; A TAP SWAPS (THE GUN IN HIS HANDS FOLLOWS); TOO FEW AP SAYS SO ***',
      JSON.stringify({ square: a && (a.title + ' ' + a.label + ' ' + a.w + 'x' + a.h), before: a && a.job, after: b && b.job, said: b && b.say, gunRow: [a && a.gun, b && b.gun], short: c }));
    leg(!!held && held.bag === null && typeof held.main === 'string', '  the end message says what each hand holds when it ends (the kit\'s stand-in bag reported as none: never his)', JSON.stringify(held));
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 11: the computer */
  {
    const CR = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }, { background: 'companion_ranged', name: 'TINA' }];
    const o = { seed: 21, kind: 'suburb', flat: true, company: CR, cap: 12, formation: null, teach: false, band: ['brigand_thug'] };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'computer', arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    d.page.on('pageerror', e => errs.push(String(e)));
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    const st = () => p.evaluate(() => { const u = FIGHT.current(); return { deploy: !!FIGHT.S.deploy, round: FIGHT.S.round, cur: u && u.id, cx: FIGHT_UI.cx, zoom: FIGHT_UI.zoom, barsOff: !!FIGHT_UI.barsOff, drawer: !!FIGHT_UI.drawer, say: document.getElementById('say').textContent }; });
    const mineK = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => { const u = FIGHT.current(); return u && crewControlled(u) && !FIGHT_UI.anim.length; })) return; await p.waitForTimeout(100); } };
    await p.mouse.click(5, 5);
    await p.keyboard.press('Enter'); await p.waitForTimeout(500); const k0 = await st();
    await mineK();
    const a = await st(); await p.keyboard.press('d'); const b = await st(); await p.keyboard.press('PageUp'); const c = await st();
    await p.keyboard.press('Alt'); const e1 = await st(); await p.keyboard.press('Alt');
    await p.keyboard.press('c'); const e2 = await st(); await p.keyboard.press('c');
    await mineK(); const w0 = await st(); await p.keyboard.press(' '); await p.waitForTimeout(300); const w1 = await st();
    await mineK(); const f0 = await st(); await p.keyboard.press('f'); await p.waitForTimeout(300); const f1 = await st();
    leg(k0.deploy === false && b.cx > a.cx && c.zoom > b.zoom && e1.barsOff && e2.drawer && w1.cur !== w0.cur && f1.cur !== f0.cur,
      '*** ITEM 16: BATTLE BROTHERS\' FIGHT KEYS: ENTER STARTS, D PANS, PAGE UP ZOOMS, ALT HIDES THE BARS, C THE CARD, SPACE WAITS, F ENDS THE TURN ***',
      JSON.stringify({ enter: !k0.deploy, pan: Math.round(b.cx - a.cx), zoom: +(c.zoom / b.zoom).toFixed(2), alt: e1.barsOff, c: e2.drawer, space: [w0.cur, w1.cur], f: [f0.cur, f1.cur] }));
    /* hover to see, one click to do */
    await mineK();
    const q = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), f = FIGHT.reach(u, null, true);
      for (const [dx, dy] of [[1, 0], [0, 1], [0, -1], [-1, 0], [1, 1]]) { const x = u.x + dx, y = u.y + dy; if (f.best[f.key(x, y)] !== undefined && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) return { id: u.id, x, y, X: sx((x + .5) * FIGHT_UI.tw), Y: sy((y + .6) * FIGHT_UI.th), from: [u.x, u.y] }; }
      return null; });
    await p.mouse.move(q.X, q.Y, { steps: 3 }); await p.waitForTimeout(250);
    const h = await p.evaluate(() => ({ hover: !!(FIGHT_UI.pend && FIGHT_UI.pend.hover), tag: document.getElementById('pick').innerText.replace(/\s+/g, ' '), bend: document.getElementById('bend').innerText.replace(/\s+/g, ' ') }));
    await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(1500);
    const moved = await p.evaluate((id) => { const u = FIGHT.byId(id); return [u.x, u.y]; }, q.id);
    const words = await p.evaluate(() => { say('Tap a chalk tile to walk.'); return document.getElementById('say').textContent; });
    leg(h.hover && /WALK \d+ AP/.test(h.tag) && moved[0] === q.x && moved[1] === q.y && /^Click a chalk tile/.test(words),
      '  the mouse over a tile shows the walk and its AP; ONE click walks; the lines say click', JSON.stringify({ hover: h, from: q.from, to: [q.x, q.y], now: moved, words }));
    /* R twice ends the round */
    await mineK(); const r0 = await st(); await p.keyboard.press('r'); const r1 = await st(); await p.keyboard.press('r');
    await p.waitForFunction((r) => FIGHT.S.round > r || FIGHT.S.over, r0.round, { timeout: 30000 }).catch(() => {}); const r2 = await st();
    leg(/End the round\?/.test(r1.say) && r2.round > r0.round, '  R asks, R again ends the round: his men skip to the next', 'round ' + r0.round + ' -> ' + r2.round);
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* 11b: the phone keeps one tap to see, one tap to do (a tap that only shows never walks) */
  {
    const CR = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }];
    const o = { seed: 21, kind: 'suburb', flat: true, company: CR, cap: 12, formation: null, deploy: false, teach: false, band: ['brigand_thug'] };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    for (let i = 0; i < 150; i++) { if (await p.evaluate(() => { const u = FIGHT.current(); return u && crewControlled(u) && !FIGHT_UI.anim.length; })) break; await p.waitForTimeout(100); }
    const q = await p.evaluate(() => { const S = FIGHT.S, u = FIGHT.current(), f = FIGHT.reach(u, null, true);
      for (const [dx, dy] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) { const x = u.x + dx, y = u.y + dy; if (f.best[f.key(x, y)] !== undefined && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) return { id: u.id, x, y, X: sx((x + .5) * FIGHT_UI.tw), Y: sy((y + .6) * FIGHT_UI.th), from: [u.x, u.y] }; }
      return null; });
    await p.touchscreen.tap(q.X, q.Y); await p.waitForTimeout(600);
    const one = await p.evaluate((id) => { const u = FIGHT.byId(id); return { at: [u.x, u.y], words: document.getElementById('say').textContent }; }, q.id);
    await p.touchscreen.tap(q.X, q.Y); await p.waitForTimeout(1500);
    const two = await p.evaluate((id) => { const u = FIGHT.byId(id); return [u.x, u.y]; }, q.id);
    leg(one.at[0] === q.from[0] && one.at[1] === q.from[1] && two[0] === q.x && two[1] === q.y, '  on a phone one tap shows, the second walks, as before', JSON.stringify({ afterOne: one.at, afterTwo: two }));
    errs.push.apply(errs, d.errs); await d.close();
  }
  /* [eyes: tap again, nothing] (EYES 10/25 round 2): the ask stays as long as its arm; the tap it asks for, after reading, does it */
  {
    const CR = [{ background: 'companion_2hand', name: 'RAUL' }, { background: 'companion_1hand', name: 'DESI' }];
    const o = { seed: 21, kind: 'suburb', flat: true, company: CR, cap: 12, formation: null, deploy: false, teach: false, band: ['brigand_thug'] };
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(o) });
    const p = d.page;
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil, null, { timeout: 60000 });
    for (let i = 0; i < 150; i++) { if (await p.evaluate(() => { const u = FIGHT.current(); return u && crewControlled(u) && !FIGHT_UI.anim.length; })) break; await p.waitForTimeout(100); }
    const b = await p.evaluate(() => { const r = document.getElementById('bflee').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, beat: beatMs() }; });
    await p.touchscreen.tap(b.x, b.y); await p.waitForTimeout(b.beat * 10);   /* he reads it: longer than the old 8-beat arm */
    const mid = await p.evaluate(() => ({ say: document.getElementById('say').textContent, armed: !!FIGHT_UI.fleeArm }));
    await p.touchscreen.tap(b.x, b.y); await p.waitForTimeout(300);
    const after = await p.evaluate(() => ({ retreat: !!FIGHT.S.retreat, say: document.getElementById('say').textContent }));
    leg(/Tap again/.test(mid.say) && mid.armed && after.retreat, '  [eyes: tap again, nothing]: the ask stays with its arm; the tap it asks for, ten beats later, orders the retreat',
      JSON.stringify({ afterTenBeats: mid, second: after }));
    errs.push.apply(errs, d.errs); await d.close();
  }
  leg(!errs.length, '  the page threw nothing', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate broke: ' + (e && e.stack || e)); fail++; done(); });

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
   7. the page threw nothing.
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
  leg(!errs.length, '  the page threw nothing', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate broke: ' + (e && e.stack || e)); fail++; done(); });

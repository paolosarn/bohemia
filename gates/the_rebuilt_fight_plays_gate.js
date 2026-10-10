#!/usr/bin/env node
/* THE REBUILT FIGHT PLAYS (COMBAT [rebuild], rule 63, Paolo 10/2: "start combat over from the
   ground up; re-create Battle Brothers combat"). The row's one driver gate: it plays whole
   fights in slices/BOHEMIA_FIGHT.html start to end on his phone's profile (390x844 at 3x,
   through the one driver), with REAL taps: a finger walks a man, a finger strikes, a finger
   turns AUTO on for the rest, two fingers pinch the board out to the whole and back in.
   Then it reads the log the rules wrote and checks Battle Brothers' rules actually happened
   in the fight, not just exist in the file: turn order by initiative, hits and misses at the
   rolled chance, head hits, morale moving, the fight ending, YOU never dead, a hire struck
   down either dead or laid up 30 to 40 days, and the length of the fight on the beat.
   Shots: slices/vote/COMBAT_THE_FIGHT_REBUILT_*_10_2.jpg.
   Run: node gates/the_rebuilt_fight_plays_gate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('../tools/bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
/* PROOF SHOTS GO TO A SCRATCH FOLDER UNLESS ASKED (PLUMBER 10/9, [proof shots churn]): `--shoot` or BOHEMIA_SHOOT=1 writes the VOTE picture */
const { proofShot } = require(path.join(__dirname, '..', 'tools', 'bohemia_proof_shot.js'));
const BB = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/rules.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const shot = n => proofShot(path.join(ROOT, 'slices/vote/COMBAT_THE_FIGHT_REBUILT_' + n + '_10_2.jpg'));
/* phone-size jpegs: the published site is already over its cap, so a gate's pictures stay small */
const SHOT = { scale: 'css', type: 'jpeg', quality: 72 };
const FIGHTS = [{ board: 'suburb', seed: 5, taps: true }, { board: 'scrub', seed: 9, taps: false }];
/* every word the fight writes onto its own canvas is counted (rule 46f: names and states live in the bar) */
const WORDS = 'window.__bank=0;window.__bars=0;window.__words=0;(function(){const P=CanvasRenderingContext2D.prototype;["fillText","strokeText"].forEach(function(k){const o=P[k];P[k]=function(){if(this.canvas&&this.canvas.id==="cv")window.__words++;return o.apply(this,arguments);};});const di=P.drawImage;P.drawImage=function(img){if(this.canvas&&this.canvas.id==="cv"&&img&&img.src&&img.src.indexOf("fight_people")>=0)window.__bank++;return di.apply(this,arguments);};const fr=P.fillRect;P.fillRect=function(x,y,w,h){if(this.canvas&&this.canvas.id==="cv"&&h===3)window.__bars++;return fr.apply(this,arguments);};})();';
const SPEED = 6;           /* the beat runs six times fast so a gate fits; the length is counted in beats */
const all = { hit: 0, miss: 0, head: 0, morale: 0, injury: 0, free: 0, down: 0, skill: 0, auto: {} };

async function fight(F, first) {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true,
    arm: WORDS + 'window.FIGHT_OPTS={seed:' + F.seed + ',speed:' + SPEED + ',kind:"' + F.board + '"}' });
  const p = d.page;
  const ev = (f, a) => p.evaluate(f, a);
  const until = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn)) return true; await p.waitForTimeout(60); } return false; };
  const loaded = await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 30000);
  leg(loaded, F.board + ': the ground loads (COMBAT TWO\'s blocks and cover, baked once)');
  if (!loaded) { await d.close(); return; }
  const deal = await ev(() => { const B = FIGHT.S.boardDef, g = B.blocks; let twin = 0;
    g.forEach((r, y) => r.forEach((n, x) => { if ((x && r[x - 1] === n) || (y && g[y - 1][x] === n)) twin++; }));
    return { kinds: B.kinds, lead: g[g.length - 1][0].split('.')[0], twin: twin, name: B.name, al: (DB.ours.board_mix.value.aliases || {}) }; });
  leg(deal.kinds.length >= 2 && deal.twin === 0 && deal.kinds.indexOf(F.board) >= 0 && (deal.al[F.board] || [F.board]).indexOf(deal.lead) >= 0,
    F.board + ': *** THE BOARD IS DEALT FROM MIXED KINDS (sweep L) ***, led by the kind the loop asked for, no block beside its twin', deal.name);
  const s0 = await ev(() => ({ you: FIGHT.alive('you').length, them: FIGHT.alive('them').length,
    zoom: FIGHT_UI.zoom, far: FIGHT_UI.far, near: FIGHT_UI.near, man: FIGHT_UI.th * FIGHT_UI.zoom * 0.86, w: FIGHT.S.w, h: FIGHT.S.h,
    bw: FIGHT_UI.board.width * FIGHT_UI.zoom, bh: FIGHT_UI.board.height * FIGHT_UI.zoom,
    W: innerWidth, avail: innerHeight - document.getElementById('top').offsetHeight - document.getElementById('bot').offsetHeight,
    gap: Math.min.apply(null, FIGHT.alive('you').map(u => Math.min.apply(null, FIGHT.alive('them').map(e => Math.max(Math.abs(u.x - e.x), Math.abs(u.y - e.y)))))),
    ini: FIGHT.S.order.map(id => FIGHT.byId(id).turnIni) }));
  if (first) await p.screenshot(Object.assign({ path: shot('OPEN') }, SHOT));
  leg(s0.you === OURS.field_size.value, F.board + ': twelve of yours on the field (rule 63b)', s0.you + ' v ' + s0.them);
  leg(Math.abs(s0.zoom - s0.near) < 1e-6 && Math.abs(s0.man - 104) <= 2 && s0.w < 20,
    F.board + ': *** IT OPENS ON YOUR LINE WITH THE MAN AT 112, ON A BOARD CUT TO THE PARTIES (rule 79) ***', 'man ' + Math.round(s0.man) + ' px, board ' + s0.w + 'x' + s0.h + ' houses');
  leg(s0.gap >= BB.deployment.min_gap_between_lines_hexes.value, F.board + ': the lines start at least five tiles apart (wiki: "at least 5 hexes between parties")', 'nearest ' + s0.gap);
  leg(s0.ini.every((v, i) => i === 0 || s0.ini[i - 1] >= v), F.board + ': the round goes by initiative, highest first', s0.ini.slice(0, 5).map(Math.round).join(' > '));
  /* YOUR FORMATION (COMBAT [your formation]): the fight waits for his line; a real finger moves a man inside his two
     columns, never outside them; a real finger on FIGHT starts it */
  const ready = await until(() => FIGHT.S.deploy && !FIGHT_UI.glide && performance.now() > FIGHT_UI.openUntil, 8000);
  await p.waitForTimeout(600);
  const d0 = await ev(() => ({ acted: FIGHT.S.log.filter(e => e.t === 'step' || e.t === 'attack').length, label: document.getElementById('bend').textContent.trim(),
    man: Math.abs(FIGHT_UI.zoom - FIGHT_UI.near) < 1e-6 }));
  leg(ready && d0.acted === 0 && d0.label === 'FIGHT' && d0.man, F.board + ': *** THE FIGHT WAITS FOR HIS LINE ***: nothing moves before FIGHT, and he sets it at the man\'s size (rules 21, 79: a drag pans the columns)',
    d0.acted + ' moves, the button reads ' + d0.label + (d0.man ? ', the man at 112' : ', ZOOMED OUT'));
  if (first) {
    const scr = (x, y) => ev((q) => ({ x: (q[0] - FIGHT_UI.cx) * FIGHT_UI.zoom + innerWidth / 2, y: (q[1] - FIGHT_UI.cy) * FIGHT_UI.zoom + TOPH + (innerHeight - TOPH - BOTH) / 2 }), [x, y]);
    const plan = await ev(() => { const S = FIGHT.S, z = FIGHT._t.zoneCols(), u = FIGHT.alive('you')[0]; let t = null, out = null;
      for (let y = 0; y < S.h && !t; y++) for (const x of z) if (FIGHT._t.passable(x, y) && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) { t = { x, y }; break; }
      for (let y = 0; y < S.h && !out; y++) { const x = Math.max.apply(null, z) + 2; if (FIGHT._t.passable(x, y) && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y)) out = { x, y }; }
      return { id: u.id, from: [u.x, u.y], to: t, out, tw: FIGHT_UI.tw, th: FIGHT_UI.th }; });
    /* at the man's size the zone is bigger than the glass (rule 79): pan to the tile first, as his drag would, then tap it */
    const tapTile = async (x, y, dy) => { await ev(q => { FIGHT_UI.glide = null; FIGHT_UI.cx = (q[0] + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (q[1] + .5) * FIGHT_UI.th; }, [x, y]);
      await p.waitForTimeout(120); const q = await scr((x + .5) * plan.tw, (y + (dy || .5)) * plan.th); await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(250); };
    await tapTile(plan.from[0], plan.from[1], .6); if (plan.out) await tapTile(plan.out.x, plan.out.y);
    const stay = await ev(id => { const u = FIGHT.byId(id); return [u.x, u.y]; }, plan.id);
    await tapTile(plan.to.x, plan.to.y);
    const went = await ev(id => { const u = FIGHT.byId(id); return [u.x, u.y]; }, plan.id);
    leg(stay[0] === plan.from[0] && stay[1] === plan.from[1] && went[0] === plan.to.x && went[1] === plan.to.y,
      '*** HE SETS HIS LINE WITH HIS FINGER ***: a man tapped, then a lit tile: he stands there; a tile outside his two columns: he stays',
      plan.from.join(',') + ' -> outside ' + stay.join(',') + ' -> ' + went.join(','));
  }
  const fb = await ev(() => { const r = document.getElementById('bend').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await p.touchscreen.tap(fb.x, fb.y);
  leg(await until(() => !FIGHT.S.deploy, 3000), F.board + ': a finger on FIGHT starts it, and the button reads END TURN again', await ev(() => document.getElementById('bend').textContent.trim()));
  const glided = await until(() => FIGHT_UI.zoom >= FIGHT_UI.near * 0.95 && !FIGHT_UI.glide, 8000);
  leg(glided, F.board + ': then it glides in on your line on the beat', await ev(() => FIGHT_UI.zoom.toFixed(3) + ' near ' + FIGHT_UI.near.toFixed(3)));

  /* THE BAR AT PHONE SIZES (rule 67a): every tapped thing at least 44 points; the bar about 120; the
     turn strip's faces 36 to 44; bars over a man only while he acts or is picked, three points tall */
  if (first) {
    const ui = await ev(() => {
      const box = el => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), id: el.id || el.className }; };
      const taps = ['bend', 'bwait', 'bauto', 'card'].map(id => box(document.getElementById(id)))
        .concat(Array.from(document.querySelectorAll('#skills .sq')).filter(b => b.style.display !== 'none').map(box));
      const faces = Array.from(document.querySelectorAll('#order canvas')).map(c => Math.round(c.getBoundingClientRect().width));
      const css = el => getComputedStyle(el).backgroundImage;
      window.__bars = 0; return { taps, faces, bar: document.getElementById('bot').getBoundingClientRect().height,
        mats: [css(document.getElementById('bot')), css(document.getElementById('bend')), css(document.querySelector('#skills .sq'))].every(b => /url\("?data:image/.test(b)),
        font: getComputedStyle(document.body).fontFamily };
    });
    const small = ui.taps.filter(t => t.w < 44 || t.h < 44);
    leg(small.length === 0, '*** EVERY THING HE TAPS IN THE FIGHT IS AT LEAST 44 POINTS (rule 67a, Apple\'s floor) ***', ui.taps.map(t => t.id + ' ' + t.w + 'x' + t.h).join(', '));
    leg(ui.bar >= 100 && ui.bar <= 150, 'the bar is about 120 points, under a quarter of the glass', Math.round(ui.bar) + ' pt');
    leg(ui.faces.length > 0 && ui.faces.every(f => f >= 36 && f <= 44), 'the turn strip is faces in initiative order, 36 to 44 points', ui.faces.join(' '));
    leg(ui.mats, 'the bar is made of our materials (cardboard, receipt paper, cracked glass), drawn, not flat boxes');
    await p.waitForTimeout(400);
    const bars = await ev(() => window.__bars);
    leg(bars > 0 && bars <= 4 * 25, 'bars over a man only while he acts or is picked, three points tall', bars + ' three-point bars drawn in ~25 frames');
  }
  /* RULE 69: every fighter is the character bank's rig in his own clothes, his face the bank's face */
  const bank = await ev(() => {
    const units = FIGHT.S.units.filter(v => FIGHT.onField(v) && (v.side === 'you' || FIGHT.sideSees('you', v)));
    const loaded = FIGHT.S.units.every(v => { const i = atlasOf(v); return i && i.complete && i.naturalWidth > 0 && !!DB.people.looks[v.look]; });
    window.__bank = 0;
    return { loaded, visible: units.length, looks: new Set(FIGHT.S.units.map(v => v.look)).size, src: DB.people.source,
      handDrawn: /coat|part\(/.test(drawMan.toString()) || !/blitMan/.test(drawMan.toString()), faceFromBank: /atlasOf/.test(drawPortrait.toString()) };
  });
  await p.waitForTimeout(300);
  const blits = await ev(() => window.__bank);
  leg(bank.loaded && /famPaintBody/.test(bank.src) && !bank.handDrawn, F.board + ': *** EVERY FIGHTER IS THE CHARACTER BANK\'S RIG IN HIS CLOTHES (rule 69), nothing hand-drawn ***',
    bank.looks + ' looks on the board, from ' + bank.src.split(':')[0]);
  leg(blits >= bank.visible, F.board + ': the board blits the bank\'s frames for every man it shows', blits + ' bank frames in ~18 frames for ' + bank.visible + ' men');
  leg(bank.faceFromBank, F.board + ': the turn strip and the bar carry his face from the bank (renderFace with his key)');
  const man = await ev(() => Math.round(FIGHT_UI.th * FIGHT_UI.zoom * MAN_OF_TILE));
  leg(man >= 96 && man <= 120, F.board + ': *** THE MAN READS AS A MAN (rule 66): at the idle stop he stands near his 112 box ***', man + ' css px tall (was 17 before round three)');
  if (F.taps) {
    /* ONE MAN IS NOT A WALL, TWO ARE (rule 66), on a corridor cut through a column of houses */
    const walls = await ev(() => {
      const S = FIGHT.S, a = FIGHT.alive('you')[0], es = FIGHT.alive('them').slice(0, 2);
      const keep = { terrain: S.terrain, solid: S.solid, cover: S.cover, cnt: S.coverCount, units: S.units.map(u => [u, u.x, u.y, u.fled]) };
      S.terrain = S.terrain.map(r => r.map(() => 'flat')); S.solid = S.solid.map(r => r.map(() => false));
      S.coverCount = S.coverCount.map(r => r.map(() => 0));
      S.units.forEach(u => { if (u !== a && es.indexOf(u) < 0) u.fled = true; });
      /* the corridor in the middle of whatever board the fight has (rule 79 cuts it to the parties) */
      const cx0 = Math.floor(S.w / 2), Y = Math.floor(S.h / 2) - 1; for (let y = 0; y < S.h; y++) if (y !== Y && y !== Y + 1) S.terrain[y][cx0] = 'blocked';
      a.x = cx0 - 3; a.y = Y;
      const goal = () => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0 + 3, Y)] !== undefined || f.best[f.key(cx0 + 3, Y + 1)] !== undefined; };
      es[0].x = cx0; es[0].y = Y; es[1].x = 0; es[1].y = 0;
      const one = goal();
      const own = FIGHT.reach(a, 99, true); const ownTile = own.best[own.key(cx0, Y)] === undefined;
      es[1].x = cx0; es[1].y = Y + 1;
      const two = goal();
      es[1].x = cx0 + 1; es[1].y = Y + 1; es[0].x = cx0; es[0].y = Y;
      const diag = FIGHT._t.squeezes(cx0, Y + 1, cx0 + 1, Y);
      /* PASS ONE OF YOUR OWN, NEVER TWO (rule 70): a one-wide lane two houses long, cut through the block */
      es.forEach(e => { e.x = 0; e.y = 0; e.fled = true; });
      for (let y = 0; y < S.h; y++) { S.terrain[y][cx0] = y === Y ? 'flat' : 'blocked'; S.terrain[y][cx0 + 1] = y === Y ? 'flat' : 'blocked'; }
      const pals = S.units.filter(u => u.side === 'you' && u !== a).slice(0, 2);
      const far = () => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0 + 3, Y)] !== undefined; };
      pals.forEach(m => { m.fled = false; m.x = 0; m.y = S.h - 1; });
      pals[0].x = cx0; pals[0].y = Y; pals[1].x = 1; pals[1].y = S.h - 1;
      const throughOne = far();
      const standOn = (() => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0, Y)] === undefined; })();
      pals[1].x = cx0 + 1; pals[1].y = Y;
      const throughTwo = far();
      pals.forEach(m => { m.x = 0; m.y = 0; m.fled = true; });
      es[0].fled = false; es[0].x = cx0; es[0].y = Y;
      const throughFoe = far();
      S.terrain = keep.terrain; S.solid = keep.solid; S.coverCount = keep.cnt; keep.units.forEach(k => { k[0].x = k[1]; k[0].y = k[2]; k[0].fled = k[3]; });
      return { one, two, ownTile, diag, throughOne, standOn, throughTwo, throughFoe };
    });
    leg(walls.ownTile, 'a man\'s tile is never walked through');
    leg(walls.one, 'ONE MAN IS NOT A WALL: a lone man in a two-wide gap can be walked past (at the price of his free swing)');
    leg(!walls.two && walls.diag, 'TWO ARE: two men side by side close the gap, and nobody squeezes diagonally between two men');
    leg(walls.throughOne && walls.standOn, '*** PASS ONE OF YOUR OWN (rule 70): a man walks through one of his own company in a one-wide lane, and never stops on him ***');
    leg(!walls.throughTwo && !walls.throughFoe, '  NEVER TWO, NEVER AN ENEMY: two of his own in a row close the lane, and so does one of theirs');
    /* TWO FINGERS: pinch the board out to the whole, then back in (rule 62: the pinch is the map's) */
    const cdp = await p.context().newCDPSession(p);
    const pinch = async (from, to) => {
      const CX = 195, CY = 430, steps = 14;
      for (let i = 0; i <= steps; i++) {
        const r = from + (to - from) * i / steps;
        await cdp.send('Input.dispatchTouchEvent', { type: i === 0 ? 'touchStart' : 'touchMove',
          touchPoints: [{ x: CX - r, y: CY, id: 1 }, { x: CX + r, y: CY, id: 2 }] });
        await p.waitForTimeout(25);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await p.waitForTimeout(250);
    };
    await pinch(150, 8); await pinch(150, 8);
    const out = await ev(() => FIGHT_UI.zoom / FIGHT_UI.far);
    leg(out < 1.02, 'two fingers pinch the board all the way out to the whole of it', 'zoom ' + out.toFixed(2) + 'x the far stop');
    await pinch(20, 170); await pinch(20, 170);
    const back = await ev(() => FIGHT_UI.zoom / FIGHT_UI.far);
    leg(back > 2, 'and back in, one continuous zoom', 'zoom ' + back.toFixed(2) + 'x the far stop');

    /* ONE FINGER WALKS A MAN: wait for one of yours, tap a lit tile twice */
    /* a man boxed in by his own line has nowhere to go: a finger ends his turn and the next of yours is tried */
    for (let tries = 0; tries < 12; tries++) {
      await until(() => { const u = FIGHT.current(); return u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT_UI.glide; }, 30000);
      const free = await ev(() => { const u = FIGHT.current(), f = FIGHT.reach(u, null, true); return Object.keys(f.best).length > 1; });
      if (free) break;
      await p.tap('#bend'); await p.waitForTimeout(150);
    }
    const plan = await ev(() => {
      const u = FIGHT.current(), f = FIGHT.reach(u, null, true); let best = null;
      Object.keys(f.best).forEach(k => { k = +k; const x = k % FIGHT.S.w, y = Math.floor(k / FIGHT.S.w);
        if ((x !== u.x || y !== u.y) && (!best || y < best.y || (y === best.y && f.best[k] > best.c))) best = { x, y, c: f.best[k] }; });
      FIGHT_UI.cx = (best.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (best.y + .5) * FIGHT_UI.th;   /* the tile the finger will press is on the glass */
      return { id: u.id, name: u.name, ap: u.ap, to: best };
    });
    const scr = await ev(t => ({ x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }), plan.to);
    await p.touchscreen.tap(scr.x, scr.y); await p.waitForTimeout(120);
    const lit = await ev(() => !!(FIGHT_UI.pend && FIGHT_UI.pend.path));
    await p.touchscreen.tap(scr.x, scr.y);
    await until(() => !FIGHT_UI.anim.length, 10000);
    const after = await ev(id => { const u = FIGHT.byId(id); return { x: u.x, y: u.y, ap: u.ap }; }, plan.id);
    leg(lit && after.x === plan.to.x && after.y === plan.to.y && after.ap === plan.ap - plan.to.c,
      'a finger walks ' + plan.name + ': the first tap shows the path, the second walks it, the ground\'s AP comes off',
      plan.ap + ' AP -> ' + after.ap + ' (' + plan.to.c + ' for the walk)');
    await p.tap('#bend'); await p.waitForTimeout(150);
    await p.screenshot(Object.assign({ path: shot('WALK') }, SHOT));

    /* AUTO plays the crew until one of yours can strike; then a finger strikes */
    await p.tap('#bauto');
    let struck = null;
    const t0 = Date.now();
    while (!struck && Date.now() - t0 < 120000) {
      const ready = await ev(() => { const u = FIGHT.current(); if (!u || u.side !== 'you' || u.morale === 'Fleeing' || FIGHT.S.over) return null;
        const t = FIGHT.S.units.filter(v => FIGHT.canStrike(u, v) && FIGHT.sideSees('you', v))[0]; return t ? { u: u.id, t: t.id } : null; });
      if (await ev(() => FIGHT.S.over)) break;
      if (ready) {
        await p.tap('#bauto');                      /* AUTO off: the man waits for the finger */
        await until(() => !FIGHT_UI.anim.length, 5000);
        const still = await ev(r => { const u = FIGHT.current(); const t = FIGHT.byId(r.t);
          if (!u || u.id !== r.u || !FIGHT.canStrike(u, t)) return null;
          FIGHT_UI.cx = (t.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (t.y + .5) * FIGHT_UI.th; FIGHT_UI.pend = null;
          return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th), n: FIGHT.S.log.length }; }, ready);
        if (still) {
          await p.touchscreen.tap(still.x, still.y); await p.waitForTimeout(120);
          await p.screenshot(Object.assign({ path: shot('AIM') }, SHOT));
          await p.touchscreen.tap(still.x, still.y); await p.waitForTimeout(80);
          struck = await ev(r => FIGHT.S.log.filter(e => e.t === 'attack' && e.id === r.u && e.to === r.t && !e.free).length, ready) ? ready : null;
          await until(() => !FIGHT_UI.anim.length, 5000);
          await p.screenshot(Object.assign({ path: shot('FIGHT') }, SHOT));
        }
        await p.tap('#bauto');
      }
      await p.waitForTimeout(80);
    }
    leg(!!struck, 'a finger strikes: the first tap on a red man shows his hit chance, the second swings');
  } else {
    await p.tap('#bauto');
  }
  /* THE WHOLE FIGHT, TO ITS END */
  const ended = await until(() => FIGHT.S.over && !FIGHT_UI.anim.length, 300000);
  const R = await ev(() => {
    const S = FIGHT.S, side = id => FIGHT.byId(id).side, c = { hit: 0, miss: 0, head: 0, morale: 0, injury: 0, free: 0, down: 0, skill: 0 };
    S.log.forEach(e => {
      if (e.t === 'attack') { if (e.hit) c.hit++; else c.miss++; if (e.head) c.head++; if (e.free) c.free++; }
      if (e.t === 'skill') c.skill++; if (e.t === 'morale') c.morale++; if (e.t === 'injury') c.injury++; if (e.t === 'down' || e.t === 'dead') c.down++;
    });
    const atk = S.log.filter(e => e.t === 'attack');
    const fair = atk.every(e => e.chance >= 5 && e.chance <= 95);
    const you = S.units.filter(u => u.side === 'you');
    return { result: S.result, rounds: S.round, beats: FIGHT_UI.beats, c, fair,
      mainDead: you.some(u => u.main && u.dead),
      hires: you.filter(u => !u.main && (u.dead || u.down)).map(u => u.dead ? 'dead' : u.laidUp),
      youLeft: FIGHT.alive('you').length, themLeft: FIGHT.alive('them').length,
      overShown: getComputedStyle(document.getElementById('over')).display === 'flex' };
  });
  Object.keys(all).forEach(k => { all[k] += R.c[k]; });
  leg(ended && R.overShown, F.board + ': *** THE WHOLE FIGHT PLAYS TO ITS END, AND THE END IS ON THE SCREEN ***',
    (R.result || 'not over') + ' in ' + R.rounds + ' rounds, ' + R.youLeft + ' of yours standing, ' + R.themLeft + ' of theirs');
  const secs = R.beats * 60 / OURS.beat_bpm.value;
  leg(secs <= 15 * 60, F.board + ': the fight is under 15 minutes on the beat (rule 40a: never past 15)',
    Math.floor(secs / 60) + ':' + String(Math.round(secs % 60)).padStart(2, '0') + ' (' + Math.round(R.beats) + ' beats at ' + OURS.beat_bpm.value + ', not counting your thinking)');
  leg(R.fair, F.board + ': every swing rolled inside the wiki\'s 5 to 95 cap');
  leg(!R.mainDead, F.board + ': YOU are downed, never dead (rule 37)');
  const lu = OURS.struck_down_laid_up_days.value;
  leg(R.hires.every(h => h === 'dead' || (h >= lu[0] && h <= lu[1])), F.board + ': a hire struck down is dead or laid up 30 to 40 days (rule 36b)', R.hires.join(',') || 'nobody fell');
  console.log('  ' + F.board + ': ' + R.c.hit + ' hits, ' + R.c.miss + ' misses, ' + R.c.head + ' to the head, ' + R.c.free + ' free swings, '
    + R.c.morale + ' morale moves, ' + R.c.injury + ' injuries, ' + R.c.skill + ' perk skills used, ' + R.c.down + ' fell');
  const words = await ev(() => window.__words);
  const clips = await ev(() => FIGHT_UI.clipSeen || {});
  leg(['walk', 'stagger-hit', 'sleep'].every(k => clips[k] > 0) && (clips['bat-arc'] > 0 || clips['two-hand'] > 0),
    F.board + ': the bank\'s clips play: the walk, the hit clip when struck, the swing or the aim, the fallen', Object.keys(clips).join(', '));
  const noLog = await ev(() => !document.getElementById('feed') && !/ (hits|misses) /.test(document.getElementById('say').textContent));
  leg(noLog, F.board + ': NO COMBAT LOG ON THE SCREEN (rule 67): the bar never prints who hit whom');
  const recap = await ev(() => { const rows = document.querySelectorAll('#over table tr'); return { rows: rows.length - 1, xp: Array.from(rows).slice(1).some(r => /\+[1-9]/.test(r.children[4].textContent)) }; });
  leg(recap.rows === 12 && (R.result !== 'won' || recap.xp), F.board + ': *** THE RECAP (rule 67): every man of yours, his kills, blood drawn, blood taken, experience ***', recap.rows + ' rows' + (recap.xp ? ', experience earned' : ''));
  leg(words === 0, F.board + ': *** NOT ONE WORD WAS WRITTEN ON THE GROUND THE WHOLE FIGHT (rule 46f) ***: names, misses, morale, injuries are in the bar', words + ' words on the fight canvas');
  if (first) {
    const many = await ev(() => { const out = []; for (let i = 0; i < 12; i++) { SEED = 1000 + i; FIGHT.setup({}); out.push(FIGHT.S.boardDef.blocks.map(r => r.join(',')).join('/') + '|' + FIGHT.S.boardDef.family); } return out; });
    const fams = many.map(m => m.split('|')[1]);
    leg(new Set(many).size === many.length && fams.filter(f => f === 'city').length > fams.length / 2,
      'twelve seeds deal twelve different boards, most of them city (Paolo 9/29: "most of it will be city")', new Set(many).size + ' different, ' + fams.filter(f => f === 'city').length + ' city');
  }
  leg(d.errs.length === 0, F.board + ': no page errors', d.errs.slice(0, 2).join(' | '));
  if (first) await p.screenshot(Object.assign({ path: shot('END') }, SHOT));
  await d.close();
}

/* EVERY KIND THE DEMO'S MAP CAN ASK FOR ENDS (RUN measured a board that stalled at round 60, 10/2;
   a fight that never ends is his 10/1 bug). AUTO on both sides, the beat sixty times fast: each must end
   inside forty rounds, with no page error (the 10/2 freeze was a drawing error that killed the frame loop). */
const DEMO_KINDS = ['strip', 'freeway', 'landfill', 'ruin', 'scrub', 'shore', 'suburb', 'suburb_stem', 'culdesac', 'wash'];
async function sweep() {
  const res = [];
  for (let i = 0; i < DEMO_KINDS.length; i++) {
    const k = DEMO_KINDS[i];
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:' + (31 + i) + ',speed:60,auto:true,kind:"' + k + '"}' });
    /* rule 70b: watch every crew turn AUTO ends (where he stands when his turn is over) */
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT._t && FIGHT.S, null, { timeout: 30000 });
    await d.page.evaluate(() => {
      const T = FIGHT._t, S = FIGHT.S, m = window.M70 = { engaged: 0, alone: 0, walks: 0, ahead: 0, shots: 0, roof: 0, breach: 0 }, orig = FIGHT.aiStep;
      const dd = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
      const from = {};
      FIGHT.aiStep = function (u) {
        const k = u.id + ':' + S.round; if (!from[k]) from[k] = [u.x, u.y];
        const r = orig(u);
        if (r === false && u.side === 'you' && FIGHT.onField(u) && u.morale !== 'Fleeing') {
          const mates = FIGHT.alive('you').filter(f => f !== u && FIGHT.onField(f)), h = T.huntField(u), L = T.lineOf(u, h);
          const eng = FIGHT.alive('them').some(f => dd(f, u) === 1);
          if (eng) { m.engaged++; if (!mates.some(f => dd(f, u) === 1)) m.alone++; }
          else if (from[k][0] !== u.x || from[k][1] !== u.y) { m.walks++; if (L.mid !== null && h(u.x, u.y) < L.mid - (R('ours.formation_depth_lines') - 1)) m.ahead++; }
          if (FIGHT.isRanged(u.weapon)) { m.shots++; if (S.terrain[u.y][u.x] === 'height') m.roof++; if (L.front !== null && h(u.x, u.y) < L.front) m.breach++; }
        }
        return r;
      };
    });
    const t0 = Date.now(); let o = null;
    for (;;) {
      await d.page.waitForTimeout(300);
      o = await d.page.evaluate(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round ? { over: FIGHT.S.over, r: FIGHT.S.round, kinds: FIGHT.S.boardDef.kinds, skills: FIGHT.S.log.filter(e => e.t === 'skill').length } : null);
      if ((o && (o.over || o.r > 40)) || Date.now() - t0 > 90000) break;
    }
    if (o) all.skill += o.skills;
    const m = await d.page.evaluate(() => window.M70);
    Object.keys(m).forEach(k => { all.auto[k] = (all.auto[k] || 0) + m[k]; });
    res.push({ k, ok: !!(o && o.over && o.kinds.indexOf(k) >= 0) && d.errs.length === 0, r: o && o.r, err: d.errs[0] });
    await d.close();
  }
  /* RULE 70b (Paolo 10/4: 'the Auto button, we are far from complete'): AUTO plays his men the way Battle Brothers'
     AI plays its own, formation held. Measured on these ten fights 10/4: old AUTO 6% of shooter turns on a roof,
     21% of fighting turns alone; the new 41% and 16%. */
  const A = all.auto, pc = (a, b) => b ? Math.round(100 * a / b) : 0;
  leg(A.shots > 0 && pc(A.roof, A.shots) >= 25, '*** AUTO TAKES THE HIGH GROUND, ESPECIALLY THE SHOOTERS *** (wiki: \'the AI will try to occupy the high ground whenever possible, especially their ranged units\'): a quarter or more of the shooters\' turns end on a roof',
    A.roof + ' of ' + A.shots + ' = ' + pc(A.roof, A.shots) + '%');
  leg(A.walks > 0 && pc(A.ahead, A.walks) <= 5, '*** AUTO HOLDS THE FORMATION *** (Dev Blog 105: \'better coordination amongst their ranks\'): a man who walked (and did not walk into a fight) ends ahead of the middle of his line by more than the line\'s depth in 5% of his walks or fewer (where the formation set him is his, not the AI\'s)',
    A.ahead + ' of ' + A.walks + ' = ' + pc(A.ahead, A.walks) + '%');
  leg(A.shots > 0 && pc(A.breach, A.shots) <= 5, '*** AUTO SHIELDS THE BACKLINE *** (Dev Blog 105: \'better at protecting their vulnerable units\'): a shooter ends past his front melee man in 5% of his turns or fewer',
    A.breach + ' of ' + A.shots + ' = ' + pc(A.breach, A.shots) + '%');
  leg(A.engaged > 0 && pc(A.alone, A.engaged) <= 20, '*** AUTO DOES NOT FIGHT ALONE ***: a man in a foe\'s reach has a friend beside him in 80% of his turns or more',
    A.alone + ' of ' + A.engaged + ' = ' + pc(A.alone, A.engaged) + '% alone');
  leg(res.every(x => x.ok), '*** EVERY KIND THE DEMO\'S MAP CAN ASK FOR DEALS ITS BOARD AND THE FIGHT ENDS ***, inside 40 rounds, no page error',
    res.map(x => x.k + ' ' + (x.ok ? x.r : 'NO(' + x.r + (x.err ? ' ' + x.err.slice(0, 60) : '') + ')')).join(', '));
}

/* RULE 70b at the table: two foes at a man's elbow, equal but for how often his friends already swung at one this
   round; AUTO takes the other (Developer Posts: 'The AI will not stack all its attacks on the weakest target'). */
async function table70() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:7,speed:1}' });
  await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT._t && FIGHT.S && FIGHT.S.round, null, { timeout: 30000 });
  const r = await d.page.evaluate(() => {
    const S = FIGHT.S, T = FIGHT._t;
    const u = FIGHT.alive('you').filter(v => !FIGHT.isRanged(v.weapon))[0];
    const them = FIGHT.alive('them'), a = them[0], b = them[1];
    them.slice(2).forEach(t => { t.x = -9; t.y = -9; t.fled = true; });
    const empty = (x, y) => T.passable(x, y) && T.level(x, y) === T.level(u.x, u.y) && !S.units.some(v => v !== u && v !== a && v !== b && FIGHT.onField(v) && v.x === x && v.y === y);
    const around = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].map(o => ({ x: x + o[0], y: y + o[1] })).filter(q => empty(q.x, q.y));
    let free = [];
    for (let y = 0; y < S.h && free.length < 2; y++) for (let x = 0; x < S.w && free.length < 2; x++) if (empty(x, y) && around(x, y).length >= 2) { u.x = x; u.y = y; free = around(x, y); }
    if (free.length < 2) return { skip: 'no room' };
    a.x = free[0].x; a.y = free[0].y; b.x = free[1].x; b.y = free[1].y;
    [a, b].forEach(t => { t.hp = 50; t.armB = 0; t.armH = 0; });
    u.ap = u.apTurn; u.fat = 0;
    S.aimed = {}; const first = T.bestTarget(u);
    const other = first === a ? b : a;
    S.aimed = {}; S.aimed['you' + first.id] = 2; const second = T.bestTarget(u);
    S.aimed = {};
    return { first: first && first.id, second: second && second.id, other: other.id };
  });
  leg(!r.skip && r.second === r.other, '*** AUTO SPREADS ITS SWINGS *** (Developer Posts: \'The AI will not stack all its attacks on the weakest target\'): two equal foes, his friends already swung twice at one this round, he takes the other',
    r.skip || ('first pick ' + r.first + ', after two swings on him: ' + r.second));
  await d.close();
}

/* THE NIGHT IS LIT BY THE STREET (COMBAT TWO's lamps and drums, routed to COMBAT 10/2; ours.night_lights): at night the
   board goes dark and every live light cuts its pool back out; a tile whose middle sits in a pool plays as day; the men in
   the dark are the same bank frames, shaded. */
async function nightLights() {
  const arm = 'window.__lamps=0;window.__darkmen=0;window.__litmen=0;(function(){const P=CanvasRenderingContext2D.prototype,di=P.drawImage;P.drawImage=function(img){'
    + 'if(img&&img.src&&img.src.indexOf("fight_ground/light_")>=0)window.__lamps++;'
    + 'if(this.canvas&&this.canvas.id==="cv"&&img&&img.src&&img.src.indexOf("fight_people")>=0){if(img instanceof HTMLCanvasElement)window.__darkmen++;else window.__litmen++;}'
    + 'return di.apply(this,arguments);};})();window.FIGHT_OPTS={seed:31,speed:1,kind:"strip",night:true}';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: arm });
  await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
  await d.page.waitForTimeout(1500);
  const r = await d.page.evaluate(() => {
    const S = FIGHT.S, T = FIGHT._t, L = S.boardDef.lights || [], live = L.filter(l => l.live).length;
    const b = FIGHT_UI.board, g = b.getContext('2d'), tw = b.width / S.w, th = b.height / S.h;
    const lum = (x, y) => { const px = g.getImageData(Math.floor((x + .5) * tw) - 2, Math.floor((y + .5) * th) - 2, 5, 5).data; let s = 0; for (let i = 0; i < px.length; i += 4) s += .3 * px[i] + .59 * px[i + 1] + .11 * px[i + 2]; return s / (px.length / 4); };
    let litL = 0, litN = 0, darkL = 0, darkN = 0;
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const v = lum(x, y); if (T.litAt(x, y)) { litL += v; litN++; } else { darkL += v; darkN++; } }
    /* the rules at the table: one of your shooters, one of theirs, the four ways the light can fall, and the day */
    const a = FIGHT.alive('you').filter(u => FIGHT.isRanged(u.weapon))[0], t = FIGHT.alive('them')[0];
    const sk = FIGHT.strikeSkill(a.weapon), was = S.lit;
    const at = (la, lt) => { S.lit = S.lit.map(row => row.slice()); S.lit[a.y][a.x] = la; S.lit[t.y][t.x] = lt; const c = FIGHT.hitChance(a, t, sk).chance; S.lit = was; return c; };
    const LL = at(true, true), DD = at(false, false), DL = at(false, true), LD = at(true, false);
    S.night = false; const day = FIGHT.hitChance(a, t, sk).chance; S.night = true;
    const far = { x: t.x, y: t.y }; S.lit = S.lit.map(row => row.slice()); S.lit[far.y][far.x] = true; const vLit = T.vision(a, far); S.lit[far.y][far.x] = false; const vDark = T.vision(a, far); S.lit = was;
    return { live, pools: FIGHT_UI.poolsDrawn, litN, litL: litN ? litL / litN : 0, darkL: darkN ? darkL / darkN : 0, LL, DD, DL, LD, day, vLit, vDark,
      lamps: window.__lamps, darkmen: window.__darkmen, litmen: window.__litmen };
  });
  leg(r.live > 0 && r.pools === r.live && r.lamps > 0, '*** AT NIGHT THE STREET\'S OWN LAMPS AND DRUMS STAND ON THE BOARD AND EVERY LIVE ONE THROWS ITS POOL *** (COMBAT TWO\'s lights)', r.lamps + ' lamp and drum sprites drawn, ' + r.pools + ' pools for ' + r.live + ' live lights');
  leg(r.litN > 0 && r.litL >= 1.4 * r.darkL, 'what plays lit is lit on the glass: a lit tile is far brighter than a dark one', 'lit ' + Math.round(r.litL) + ' vs dark ' + Math.round(r.darkL) + ' on ' + r.litN + ' lit tiles');
  leg(r.LL === r.day && r.DD < r.LL && r.DL > r.LL && r.LD < r.DD, '*** A LIT TILE PLAYS AS DAY; STAY OUT OF THE LIGHT ***: both lit is the day\'s chance, both dark the wiki\'s night, a shot out of the dark at a lit man is best, a lit shooter at a dark man worst',
    'day ' + r.day + ', both lit ' + r.LL + ', both dark ' + r.DD + ', dark at lit ' + r.DL + ', lit at dark ' + r.LD);
  leg(r.vLit > r.vDark, 'a man in a pool is seen at day range, a man in the dark at the night\'s (the wiki: -2 vision)', r.vLit + ' vs ' + r.vDark + ' tiles');
  leg(r.darkmen > 0 && d.errs.length === 0, 'the men in the dark are the bank\'s frames shaded the night\'s colour, no page error', r.darkmen + ' shaded, ' + r.litmen + ' lit blits' + (d.errs[0] ? ' ' + d.errs[0] : ''));
  await d.close();
}

/* THE FIGHT ON EVERY SCREEN (rules 62 and 72, Paolo 10/4: 'fit on an iPhone screen, fit differently flipped, on
   widescreen monitors'): the driver opens the fight at the four screen classes; slices/bohemia_screen_class.js names
   the class by rule; wide screens get Battle Brothers' one-row bar. Measured 10/4 before the re-lay: on its side the
   HUD took 49% of the glass, on a monitor the bars ran 1,300 px wide. */
async function screens() {
  const res = [];
  for (const pr of ['phone_portrait', 'phone_landscape', 'tablet', 'computer']) {
    /* the man's size while he sets his line (rule 21; EYES 10/5 f5b8dbec measured him under 45 px on the flipped phone
       and the computer, the camera forced out to fit the nine-deep line) */
    const dd = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: pr, arm: 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip"}' });
    await dd.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await dd.page.waitForTimeout(2500);
    const setMan = await dd.page.evaluate(() => FIGHT.S.deploy ? Math.round(FIGHT_UI.th * FIGHT_UI.zoom * MAN_OF_TILE) : -1);
    /* what does not fit is reached by a drag, never by shrinking him: a real finger drags the line up the glass */
    let panned = null;
    if (pr === 'phone_landscape') {
      const cdp = await dd.page.context().newCDPSession(dd.page), y0 = await dd.page.evaluate(() => FIGHT_UI.cy);
      const at = await dd.page.evaluate(() => ({ x: innerWidth / 2, y: TOPH + (innerHeight - TOPH - BOTH) / 2 }));
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: at.x, y: at.y + 60 }] });
      for (let k = 1; k <= 6; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: at.x, y: at.y + 60 - k * 20 }] }); await dd.page.waitForTimeout(30); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await dd.page.waitForTimeout(200);
      panned = await dd.page.evaluate((y) => ({ dy: Math.round(FIGHT_UI.cy - y), man: Math.round(FIGHT_UI.th * FIGHT_UI.zoom * MAN_OF_TILE) }), y0);
    }
    await dd.close();
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: pr, arm: 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip",deploy:false}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.waitForTimeout(1500);
    const m = await d.page.evaluate(() => {
      const r = id => document.getElementById(id).getBoundingClientRect();
      const taps = ['bend', 'bwait', 'bauto', 'card'].map(r).concat([].slice.call(document.querySelectorAll('#skills .sq')).map(e => e.getBoundingClientRect())).filter(q => q.width > 0);   /* a hidden square (no reload on a pistol) is not a tap */
      const b = r('bot'), t = r('top'), cls = document.documentElement.dataset.screen;
      const inside = [b, t].concat(taps).every(q => q.left >= -1 && q.right <= innerWidth + 1 && q.top >= -1 && q.bottom <= innerHeight + 1);
      return { cls, W: innerWidth, H: innerHeight, glass: Math.round(100 * (innerHeight - TOPH - BOTH) / innerHeight), minTap: Math.round(Math.min.apply(null, taps.map(q => Math.min(q.width, q.height)))),
        oneRow: b.height <= 90 && Math.abs(r('bend').top - r('skills').top) < 30, barW: Math.round(b.width), centred: Math.abs(b.left - (innerWidth - b.right)) <= 2,
        fits: FIGHT_UI.far * FIGHT_UI.board.width <= innerWidth + 1 && FIGHT_UI.far * FIGHT_UI.board.height <= innerHeight - TOPH - BOTH + 1, inside,
        man: Math.round(FIGHT_UI.th * FIGHT_UI.zoom * MAN_OF_TILE) };
    });
    m.pr = pr; m.setMan = setMan; m.panned = panned; m.err = d.errs[0]; res.push(m); await d.close();
  }
  const by = k => res.filter(x => x.pr === k)[0], wide = res.filter(x => x.pr !== 'phone_portrait');
  leg(res.every(x => x.cls === x.pr), '*** ONE RULE NAMES THE SCREEN (rule 62) ***: phone upright, phone on its side, tablet, computer, read from the real viewport', res.map(x => x.pr + '=' + x.cls).join(', '));
  leg(res.every(x => x.glass >= 65), '*** THE BOARD KEEPS TWO THIRDS OF THE GLASS ON EVERY SCREEN *** (on its side the HUD took 49% before)', res.map(x => x.pr + ' ' + x.glass + '%').join(', '));
  leg(wide.every(x => x.oneRow), 'wide screens get Battle Brothers\' one-row bar: face and bars, the skill squares, WAIT and END TURN in one row', wide.map(x => x.pr + (x.oneRow ? ' one row' : ' TWO ROWS')).join(', '));
  leg(['tablet', 'computer'].every(k => by(k).centred && by(k).barW <= 980), 'on a tablet and a computer the bar is a centred plate no wider than 980 (it ran 1,300 wide on a monitor)', ['tablet', 'computer'].map(k => k + ' ' + by(k).barW + (by(k).centred ? ' centred' : ' OFF CENTRE')).join(', '));
  leg(res.every(x => Math.abs(x.man - 104) <= 2 && Math.abs(x.setMan - 104) <= 2), '*** THE MAN STAYS 112 ON EVERY SCREEN *** (rule 21: the ground may zoom, the person may not): setting his line and fighting, upright, flipped, tablet, computer; a drag pans what does not fit (EYES measured under 45 px flipped and on the computer, 10/5)',
    res.map(x => x.pr + ' ' + x.setMan + '/' + x.man + ' px').join(', '));
  const fl = res.filter(x => x.pr === 'phone_landscape')[0].panned;
  leg(fl && fl.dy > 20 && Math.abs(fl.man - 104) <= 2, 'on the flipped phone a real drag pans his line up the glass while he sets it, and he stays 112', fl ? 'the camera moved ' + fl.dy + ' px, the man ' + fl.man + ' px' : 'no drag');
  leg(res.every(x => x.minTap >= 44 && x.inside && x.fits && !x.err), 'every screen: every tap at least 44 points, nothing off the glass, the whole board fits at the far stop, no page error', res.map(x => x.pr + ' ' + x.minTap + 'pt' + (x.inside ? '' : ' OFF') + (x.fits ? '' : ' NOFIT') + (x.err ? ' ' + x.err.slice(0, 50) : '')).join(', '));
}

/* NIGHT YOU CAN READ (rule 73, Paolo 10/4: 'even at its darkest it's really hard to see... full brightness and outside,
   I should still be able to play'; the school page records/BOHEMIA_SCHOOL_PLAYABLE_IN_THE_SUN_10_4_26.md). The same
   board by day and by night, read in relative luminance (WCAG's), on the baked ground and on the glass; the sun is a
   flat 25% white laid over the frame. Measured 10/4 before: the night's dark ground at 0.011 (a fifth of the day's
   0.059), a lit tile 1.77 to 1 over an unlit one, a man 1.41 to 1 off his ground (the day's 1.95). */
const SUN = function (glare) {
  const S = FIGHT.S, T = FIGHT._t, lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const Yof = (d, i) => { let r = d[i], g = d[i + 1], b = d[i + 2]; if (glare) { r = r * .75 + 64; g = g * .75 + 64; b = b * .75 + 64; } return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b); };
  const med = a => { a = a.slice().sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : 0; };
  const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  /* the ground, on the baked board: the middle of every open tile nobody stands on */
  const B = FIGHT_UI.board, bd = B.getContext('2d').getImageData(0, 0, B.width, B.height).data, tw = B.width / S.w, th = B.height / S.h;
  const occ = {}; S.units.forEach(u => { if (FIGHT.onField(u)) occ[u.x + ',' + u.y] = 1; });
  const lit = [], dark = [];
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) {
    if (!T.passable(x, y) || occ[x + ',' + y]) continue;
    const v = []; for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) v.push(Yof(bd, (Math.floor((y + j / 6) * th) * B.width + Math.floor((x + i / 6) * tw)) * 4));
    (T.litAt(x, y) ? lit : dark).push(med(v));
  }
  /* a man against his ground, on the glass: the pixels of his figure that are not his ground, their middle against it */
  const c = document.getElementById('cv'), D = c.width / innerWidth, cd = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  const at = (X, Y) => Yof(cd, (Math.floor(Y * D) * c.width + Math.floor(X * D)) * 4);
  const z = FIGHT_UI.zoom, sx = w => (w - FIGHT_UI.cx) * z + innerWidth / 2, sy = w => (w - FIGHT_UI.cy) * z + TOPH + (innerHeight - TOPH - BOTH) / 2;
  const men = [];
  S.units.forEach(u => { if (!FIGHT.onField(u)) return; const X = sx((u.x + .5) * FIGHT_UI.tw), feet = sy((u.y + .9) * FIGHT_UI.th), h = FIGHT_UI.th * z * .86;
    if (X < 0 || X > innerWidth || feet - h < TOPH || feet > innerHeight - BOTH) return;
    const gr = med([[.08, .2], [.92, .2], [.08, .6], [.92, .6]].map(o => at(sx((u.x + o[0]) * FIGHT_UI.tw), sy((u.y + o[1]) * FIGHT_UI.th))));
    const px = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 18; j++) { const v = at(X - h * .12 + h * .24 * i / 8, feet - h * .95 + h * .85 * j / 17); if (cr(v, gr) > 1.15) px.push(v); }
    if (px.length >= 8) men.push(cr(med(px), gr)); });
  return { dark: med(dark), lit: med(lit), nLit: lit.length, litVsDark: cr(med(lit), med(dark)), man: med(men), men: men.length, pools: FIGHT_UI.poolsDrawn || 0 };
};
async function sunTest() {
  const look = async (night, extra, pre) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: (pre || '') + 'window.FIGHT_OPTS={seed:31,speed:1,kind:"strip",night:' + night + (extra || '') + '}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.waitForTimeout(3000);
    await d.page.evaluate(() => { FIGHT_UI.glide = null; FIGHT_UI.zoom = FIGHT_UI.far * 1.8; });
    await d.page.waitForTimeout(400);
    const r = { plain: await d.page.evaluate(SUN, false), sun: await d.page.evaluate(SUN, true), err: d.errs[0] };
    await d.close(); return r;
  };
  const day = await look(false), night = await look(true), dead = await look(true, ',power:false'),
    bright = await look(true, '', 'try{localStorage.setItem("bohemia.brightness","1")}catch(e){};');
  const f = v => v.toFixed(3), x = v => v.toFixed(2);
  leg(night.plain.dark >= .55 * day.plain.dark, '*** NIGHT IS A COLOUR, NOT A DARKNESS (rule 73) ***: the dark ground at night keeps at least half the day\'s light (it kept a fifth)',
    'day ' + f(day.plain.dark) + ', night ' + f(night.plain.dark) + ' = ' + Math.round(100 * night.plain.dark / day.plain.dark) + '%');
  leg(night.plain.nLit > 0 && night.plain.litVsDark >= 3, '*** A LIT TILE STANDS THREE TO ONE OVER AN UNLIT ONE *** (the floor: 3 to 1 for anything the player must find; it was 1.77)',
    x(night.plain.litVsDark) + ' to 1 (' + f(night.plain.lit) + ' vs ' + f(night.plain.dark) + '); under the sun ' + x(night.sun.litVsDark) + ' to 1');
  leg(night.plain.man >= .9 * day.plain.man && night.sun.man >= .9 * day.sun.man, 'a man stands off his ground at night as well as by day (within a tenth), in the shade and under the sun: the moon lifts him and rims him',
    'day ' + x(day.plain.man) + ', night ' + x(night.plain.man) + '; in the sun day ' + x(day.sun.man) + ', night ' + x(night.sun.man));
  leg(dead.plain.pools === 0 && dead.plain.nLit === 0, 'no power on the block, no lamps: the night stays the moon\'s (the map hands the power over)', dead.plain.pools + ' pools, ' + dead.plain.nLit + ' lit tiles');
  leg(bright.plain.dark > night.plain.dark && !day.err && !night.err && !bright.err, 'BRIGHTNESS lifts the night\'s floor (the settings slider, bohemia.brightness), never the day, no page error',
    'night ' + f(night.plain.dark) + ' -> ' + f(bright.plain.dark) + ' at full brightness');
}

/* YOUR FORMATION at the table: the roster's two rows of nine (ours.formation, Battle Brothers' own) put each man on
   his slot; without a roster the shieldwall in front and the shooters behind; the enemy's backline deploys behind its
   line by its ai.json role; AUTO skips the setting */
async function formation() {
  const at = async (extra) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:7,speed:1,kind:"scrub"' + extra + '}' });
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round, null, { timeout: 30000 });
    const r = await d.page.evaluate(() => { const S = FIGHT.S, col = FIGHT.R ? 0 : 0, c = FIGHT._t.zoneCols();
      return { deploy: S.deploy, cols: c, crew: S.units.filter(u => u.side === 'you').map(u => ({ x: u.x, y: u.y, slot: u.slot, ranged: FIGHT.isRanged(u.weapon) })),
        them: S.units.filter(u => u.side === 'them').map(u => ({ x: u.x, back: u.arche === 'backline' })), h: S.h,
        free: (x, y) => 0 }; });
    const tiles = await d.page.evaluate((cols) => { const S = FIGHT.S, o = {}; for (let y = 0; y < S.h; y++) cols.forEach(x => { o[x + ',' + y] = FIGHT._t.passable(x, y); }); return o; }, r.cols);
    r.tiles = tiles; r.err = d.errs[0]; await d.close(); return r; };
  const want = { front: [11, 10, 9, null, 0, null, 1, 2, 3], back: [4, 5, 6, 7, 8] };
  const handed = await at(',formation:' + JSON.stringify(want));
  const n = 9, mid = (handed.h - 1) / 2, front = handed.cols[0], back = handed.cols[1];
  const misplaced = [];
  [['front', front], ['back', back]].forEach(([row, x]) => want[row].forEach((k, i) => { if (k === null) return;
    const u = handed.crew[k], y = Math.round(mid + i - (n - 1) / 2);
    if (handed.tiles[x + ',' + y] ? !(u.x === x && u.y === y) : u.slot !== row + ':' + i) misplaced.push(k + '@' + u.x + ',' + u.y + ' want ' + x + ',' + y); }));
  leg(misplaced.length === 0 && !handed.err, '*** THE FIGHT OPENS WITH YOUR MEN WHERE THE ROSTER PUT THEM *** (Battle Brothers: two rows of nine, the front line and the back line): every slot to its tile, a house slot to the nearest open tile',
    misplaced.length ? misplaced.join(' ') : 'all twelve on their slots');
  const dflt = await at('');
  const meleeX = Math.min.apply(null, dflt.crew.filter(u => !u.ranged).map(u => u.x)), rangedX = Math.max.apply(null, dflt.crew.filter(u => u.ranged).map(u => u.x));
  leg(rangedX < meleeX, 'without a roster: the shieldwall in front, the shooters behind', 'shooters at column ' + rangedX + ' or behind, the line at ' + meleeX + ' or ahead');
  const band = await at(',band:["brigand_thug","brigand_thug","brigand_thug","lower_brigand_marksman","brigand_poacher"]');
  const lineX = Math.min.apply(null, band.them.filter(u => !u.back).map(u => u.x)), backX = Math.min.apply(null, band.them.filter(u => u.back).map(u => u.x));
  leg(backX > lineX, 'the enemy deploys by its ai.json role: the marksman and the poacher behind the thugs', 'thugs at ' + lineX + ', the backline at ' + backX + ' or behind');
  const auto = await at(',auto:true');
  leg(auto.deploy === false && dflt.deploy === true, 'AUTO skips the setting: the fight starts on its own', 'auto ' + auto.deploy + ', by hand ' + dflt.deploy);
}

/* THE ENEMY MATH (COMBAT [the enemy math], rule 75b, Paolo 10/5: 'the beginning is a lot different from the end'):
   the map hands the party (count, days, difficulty); the fight dresses it by tier from ours.enemy_tiers and arms each
   man from his own enemies.json row. A day-1 party and a day-100 party from the same seed; the difficulty alone; an
   exact list; the origin's field cap; and a day-100 fight plays to its end. */
async function enemyMath() {
  const look = async (opts, play) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=Object.assign({seed:11,speed:60,kind:"strip",auto:true},' + JSON.stringify(opts) + ')' });
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.round, null, { timeout: 30000 });
    const r = await d.page.evaluate(() => { const S = FIGHT.S, them = S.units.filter(u => u.side === 'them'), rows = DB.enemies.rows.map(e => e.id);
      return { n: them.length, crew: S.units.filter(u => u.side === 'you').length, kinds: them.map(u => u.kind), sourced: them.every(u => rows.indexOf(u.kind) >= 0),
        arm: them.reduce((a, u) => a + u.armB + u.armH, 0) / Math.max(1, them.length), raider: (them.filter(u => u.kind === 'brigand_raider')[0] || {}).mskill,
        tierOf: them.filter(u => !/thug|lower|poacher/.test(u.kind)).length / Math.max(1, them.length) }; });
    if (play) { const t0 = Date.now(); while (Date.now() - t0 < 120000) { if (await d.page.evaluate(() => FIGHT.S.over || FIGHT.S.round > 40)) break; await d.page.waitForTimeout(400); }
      r.over = await d.page.evaluate(() => ({ over: FIGHT.S.over, r: FIGHT.S.round, res: FIGHT.S.result })); }
    r.err = d.errs[0]; await d.close(); return r; };
  const one = await look({ party: { faction: 'brigands', count: 3, days: 1, difficulty: 1 } });
  const late = await look({ party: { faction: 'brigands', count: 10, days: 100, difficulty: 1 } }, true);
  const easy = await look({ party: { faction: 'brigands', count: 8, days: 20, difficulty: 0 } });
  const hard = await look({ party: { faction: 'brigands', count: 8, days: 20, difficulty: 3 } });
  const list = await look({ party: [{ kind: 'brigand_thug', count: 2 }] });
  const lone = await look({ cap: 1, party: ['brigand_thug', 'brigand_thug'] });
  const k = r => r.kinds.map(x => x.replace('brigand_', '')).join(' ');
  leg(one.n === 3 && late.n === 10 && one.sourced && late.sourced, '*** THE FIGHT TAKES THE PARTY THE MAP HANDS IT *** (rule 75b: never its own twelve): a day-1 party of three, a day-100 party of ten, every man an enemies.json row', 'day 1: ' + k(one) + ' | day 100: ' + k(late));
  leg(one.kinds.every(x => /thug|lower/.test(x)) && late.kinds.indexOf('brigand_leader') >= 0 && late.kinds.some(x => /marauder/.test(x)),
    '*** THE BEGINNING IS A LOT DIFFERENT FROM THE END *** (the wiki: early thugs and sometimes raiders; late a leader and marauders): day 1 is thugs and lesser raiders, day 100 has its one leader and armoured marauders', 'leaders at day 100: ' + late.kinds.filter(x => /leader/.test(x)).length);
  leg(late.arm >= 1.5 * one.arm, 'the gear rises with the tier (Grok: higher tier is the equipment step): the day-100 party wears far more armour', 'mean head and body ' + Math.round(one.arm) + ' -> ' + Math.round(late.arm));
  leg(hard.tierOf > easy.tierOf, 'the difficulty alone raises the tier (Grok: combat difficulty raises the tier): the same day 20, Legendary fields more of the elite', Math.round(100 * easy.tierOf) + '% elite on Beginner, ' + Math.round(100 * hard.tierOf) + '% on Legendary');
  leg(late.raider === 70 || late.raider === undefined, 'the late days buff the man (Brigand Raider: melee skill 65 before day 40, 70 after)', 'a day-100 raider swings at ' + late.raider);
  leg(list.n === 2 && list.kinds.every(x => x === 'brigand_thug') && lone.crew === 1, 'an exact list is fought as handed; the origin\'s field cap is honoured (Lone Wolf: one man)', list.n + ' thugs; ' + lone.crew + ' of yours on the field');
  leg(late.over && late.over.over && !late.err && !one.err, 'a day-100 fight still plays to its end on AUTO, no page error', late.over ? late.over.res + ' in ' + late.over.r + ' rounds' : 'no end');
}

/* THE WEAPONS SAY WHAT THEY DO (rule 75e, Paolo 10/5: 'weapons that I don't even think you know what they're supposed
   to do yet'): every weapon in weapons.json has its class's line, base and name in weapon_lines.json; a real finger held
   on the strike square, or on a man, brings up his weapon's card with its line and its numbers; a tap puts it away. */
async function weaponCards() {
  const WL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapon_lines.json'), 'utf8')).rows;
  const WR = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8')).rows;
  const bare = WR.filter(r => !(WL[r.class] && WL[r.class].line && WL[r.class].base && WL[r.class].name));
  const bad = Object.keys(WL).filter(k => WL[k].line.length > 98 || /\u2014/.test(WL[k].line));
  leg(bare.length === 0 && WL.shield && bad.length === 0, '*** EVERY WEAPON HAS ITS ONE PLAIN LINE AND ITS BASE *** (rule 75e): all ' + WR.length + ' weapons in weapons.json, and the car door, under 98 characters, no em dash',
    bare.length ? bare.length + ' bare: ' + bare.slice(0, 3).map(r => r.name).join(', ') : Object.keys(WL).length + ' classes, ' + Object.keys(WL).filter(k => /^records\/BOHEMIA_WORDS/.test(WL[k].by)).length + ' in WORDS\' words');
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb",deploy:false,party:{faction:"brigands",count:6,days:60,difficulty:1}}' });
  const p = d.page, cdp = await p.context().newCDPSession(p);
  const hold = async (x, y, ms) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); await p.waitForTimeout(ms);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(250); };
  const card = () => p.evaluate(() => { const e = document.getElementById('drawer'); return { shown: e.style.display === 'block', id: e.dataset.card, text: e.innerText }; });
  await p.waitForFunction(() => { const u = FIGHT.current(); return u && u.side === 'you' && !FIGHT_UI.glide && !FIGHT_UI.anim.length && performance.now() > FIGHT_UI.openUntil; }, null, { timeout: 60000 });
  await p.waitForTimeout(400);
  const me = await p.evaluate(() => { const u = FIGHT.current(), r = document.getElementById('bstrike').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: u.weapon }; });
  await hold(me.x, me.y, 700);
  const c1 = await card(), L1 = WL[me.w.class];
  leg(c1.shown && c1.id === me.w.id && c1.text.indexOf(L1.line) >= 0 && c1.text.indexOf(L1.name) >= 0 && c1.text.indexOf(me.w.damage_min + ' to ' + me.w.damage_max) >= 0,
    '*** HOLD A FINGER ON THE STRIKE SQUARE AND HIS WEAPON SAYS WHAT IT DOES ***: its name, its Battle Brothers base, its line, its numbers from weapons.json', c1.text.split('\n').slice(0, 3).join(' | '));
  await p.touchscreen.tap(200, 300); await p.waitForTimeout(300);
  const gone = !(await card()).shown;
  const e = await p.evaluate(() => { const t = FIGHT.alive('them').filter(v => FIGHT.sideSees('you', v))[0]; FIGHT_UI.glide = null; FIGHT_UI.cx = (t.x + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (t.y + .5) * FIGHT_UI.th;
    return { id: t.id, w: t.weapon, x: innerWidth / 2, y: TOPH + (innerHeight - TOPH - BOTH) / 2 + (.1 * FIGHT_UI.th - .3 * FIGHT_UI.th) * FIGHT_UI.zoom }; });
  await p.waitForTimeout(300);
  await hold(e.x, e.y, 700);
  const c2 = await card(), L2 = WL[e.w.class];
  leg(gone && c2.shown && c2.id === e.w.id && c2.text.indexOf(L2.line) >= 0, 'a tap puts it away; a finger held on one of theirs shows his weapon\'s card', (L2.name + ' (' + e.w.name + ')') + (gone ? '' : ', THE FIRST CARD STAYED'));
  leg(d.errs.length === 0, 'the cards threw nothing', d.errs[0] || '');
  await d.close();
}

/* THE ENEMY PLAYS ITS PART (rule 63b; COMBAT [the enemy plays its part]): each kind alone (or with the men it needs) on
   a flat board, four of yours, its first decisions read off the brain: the thug rushes the nearest; the marksman stands,
   shoots the softest man (the wiki: 'prefer to shoot at shieldless units or rookies') and never steps in; the raider with
   a pike waits rather than lead his thugs, then strikes the man his friends hold; the leader is still until the lines meet
   and stays behind his front man, and his men inside five tiles are led (Captain). And the hit sheet (GROK_110) is all in
   rules.json. */
async function enemyParts() {
  const LOG = function () { window.__dec = []; const T = FIGHT._t, S = FIGHT.S, orig = FIGHT.aiStep;
    FIGHT.aiStep = function (u) { const b = { x: u.x, y: u.y }, n0 = S.log.length; const h0 = T.huntField(u), L0 = T.lineOf(u, h0), contact0 = S.contact;
      const soft = FIGHT.alive('you').filter(f => FIGHT.canStrike(u, f)).map(f => ({ id: f.id, s: T.softness(f) }));
      const r = orig(u);
      if (u.side === 'them') { const att = S.log.slice(n0).filter(e => e.id === u.id && e.t === 'attack')[0], moved = b.x !== u.x || b.y !== u.y;
        if (moved || att) { const tgt = att && FIGHT.byId(att.to);
          window.__dec.push({ kind: u.kind, moved, att: att && att.to, near0: Math.min(...FIGHT.alive('you').map(f => Math.max(Math.abs(f.x - b.x), Math.abs(f.y - b.y)))),
            near1: Math.min(...FIGHT.alive('you').map(f => Math.max(Math.abs(f.x - u.x), Math.abs(f.y - u.y)))), front: L0.front, me: h0(u.x, u.y), contact: contact0,
            soft: soft, held: !!(tgt && S.units.some(f => f.side === 'them' && f !== u && FIGHT.onField(f) && Math.max(Math.abs(f.x - tgt.x), Math.abs(f.y - tgt.y)) === 1)),
            reach: tgt ? Math.max(Math.abs(tgt.x - u.x), Math.abs(tgt.y - u.y)) : null }); } }
      return r; }; };
  const run = async (party, pike) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:30,kind:"strip",flat:true,auto:true,cap:4,days:30,party:' + JSON.stringify(party) + '}' });
    await d.page.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT._t && FIGHT.S && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.evaluate(LOG);
    if (pike) await d.page.evaluate(() => { const r = FIGHT.S.units.find(u => u.kind === 'brigand_raider'); r.weapon = DB.weapons.rows.find(w => w.id === 'pike'); });
    const t0 = Date.now(); while (Date.now() - t0 < 40000) { if ((await d.page.evaluate(() => window.__dec.length)) >= 12 || await d.page.evaluate(() => FIGHT.S.over)) break; await d.page.waitForTimeout(300); }
    const r = { dec: await d.page.evaluate(() => window.__dec), err: d.errs[0] };
    if (party.indexOf('brigand_leader') >= 0) r.led = await d.page.evaluate(() => { const S = FIGHT.S, L = S.units.find(u => u.kind === 'brigand_leader'), T = FIGHT._t;
      return S.units.filter(u => u.side === 'them' && u !== L && FIGHT.onField(u)).map(u => ({ d: Math.max(Math.abs(u.x - L.x), Math.abs(u.y - L.y)), led: T.ledBy(u) })); });
    await d.close(); return r; };
  const of = (r, k) => r.dec.filter(x => x.kind === k).slice(0, 3);
  const thug = of(await run(['brigand_thug']), 'brigand_thug');
  leg(thug.length && thug[0].moved && thug[0].near1 < thug[0].near0 && thug.some(x => x.att), '*** THE THUG RUSHES THE NEAREST *** (the wiki: brigands are too undisciplined to keep formation): his first move closes on the nearest man, then he swings',
    thug.map(x => (x.moved ? 'move ' + x.near0 + '->' + x.near1 : '') + (x.att ? ' hit' : '')).join(', '));
  const mk = of(await run(['brigand_marksman']), 'brigand_marksman'), shots = mk.filter(x => x.att);
  const softest = shots.every(x => { const m = Math.max(...x.soft.map(q => q.s)); return x.soft.filter(q => q.id === x.att)[0].s === m; });
  leg(shots.length && softest && mk.every(x => !x.moved || x.near1 >= x.near0), '*** THE MARKSMAN STANDS AND SHOOTS THE SOFTEST MAN *** (the wiki: \'prefer to shoot at shieldless units or rookies\'): no step toward you, each shot at the softest man he can hit',
    mk.map(x => (x.moved ? 'step ' + x.near0 + '->' + x.near1 : '') + (x.att ? ' shot ' + x.att + ' (softness ' + x.soft.filter(q => q.id === x.att)[0].s + ' of ' + Math.max(...x.soft.map(q => q.s)) + ')' : '')).join(', '));
  const rd = of(await run(['brigand_thug', 'brigand_thug', 'brigand_raider'], true), 'brigand_raider');
  const led0 = rd.filter(x => x.moved && !x.att && x.front !== null && x.me < x.front);
  leg(rd.length && led0.length === 0 && rd.some(x => x.att && x.reach === 2), '*** THE RAIDER WITH A PIKE WAITS, THEN STRIKES FROM TWO TILES *** (the wiki: \'they wait to not get ahead of their melee allies\')',
    rd.map(x => (x.moved ? 'move to ' + x.me + ' (front ' + x.front + ')' : '') + (x.att ? ' hit at ' + x.reach + (x.held ? ' a held man' : '') : '')).join(', '));
  const ldr = await run(['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_leader']), L = of(ldr, 'brigand_leader');
  /* a step up to his front line counts only when his very next act is the swing it was for */
  leg(L.length && L.every(x => x.contact || !x.moved) && L.every((x, i) => !x.moved || x.att || x.front === null || x.me > x.front || (L[i + 1] && L[i + 1].att && !L[i + 1].moved)), '*** THE LEADER DOES NOT HURRY *** (the wiki: \'spawns in the very back and usually does not hurry\'): still until the lines meet, then a step behind his front man unless he steps up to swing',
    L.map(x => (x.moved ? 'move to ' + x.me + ' (front ' + x.front + ')' : 'still') + (x.att ? ' hit' : '')).join(', ') || 'still the whole time');
  leg(ldr.led && ldr.led.every(x => x.led === (x.d <= 5)), 'and his men within five tiles are led (Captain: +15% resolve, range 5)', ldr.led.map(x => x.d + (x.led ? ' led' : ' not')).join(', '));
  const RL = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/rules.json'), 'utf8')), PK = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/perks.json'), 'utf8')).rows;
  const hc = RL.hit_chance, se = (PK.filter(r => r.id === 'shield_expert')[0] || {}).numbers || {};
  const sheet = [['skill minus defence', /skill - defense/.test(hc.main_formula.value)], ['defence over 50 counts half', hc.defense_soft_cap.value.threshold === 50 && hc.defense_soft_cap.value.over_threshold_multiplier === 0.5],
    ['floor 5, ceiling 95', hc.cap.value.min === 5 && hc.cap.value.max === 95], ['surround 5 a man after the first', hc.surround.per_extra_adjacent.value === 5],
    ['height 10 a level', hc.height.higher_attacker_bonus.value === 10 && hc.height.lower_attacker_penalty.value === -10], ['head 25', RL.head_and_critical.base_head_chance_pct.value === 25],
    ['shield expert x1.25', se.shield_defense_bonus_increase_pct === 25]];
  leg(sheet.every(x => x[1]) && [thug, mk, rd, L].every(() => true), 'Grok\'s hit sheet (GROK_110) is all in rules.json, each from the wiki', sheet.map(x => x[0] + (x[1] ? '' : ' MISSING')).join('; '));
}

/* THE BOARD FITS THE PARTY (rule 79, Paolo 10/9: 'the actual combat map doesn't need to be so big... unless it's an
   endgame battle or three raiding parties... I want to see it more zoomed in'): a day-1 party of three gets a board under
   ten houses wide, cut from the dealt board, the lines still five apart and joined, the man at 112; three parties or the
   endgame keep the full 20 by 15. */
async function boardFits() {
  const look = async (extra) => { const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:5,speed:1,kind:"suburb"' + extra + '}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.waitForTimeout(1500);
    const r = await d.page.evaluate(() => { const S = FIGHT.S; return { w: S.w, h: S.h, crop: !!S.crop, man: Math.round(FIGHT_UI.th * FIGHT_UI.zoom * 0.86), near: Math.abs(FIGHT_UI.zoom - FIGHT_UI.near) < 1e-6,
      gap: Math.min(...FIGHT.alive('you').map(u => Math.min(...FIGHT.alive('them').map(e => Math.max(Math.abs(u.x - e.x), Math.abs(u.y - e.y)))))), joined: FIGHT._t ? true : false,
      onBoard: S.units.every(u => u.x >= 0 && u.y >= 0 && u.x < S.w && u.y < S.h), kinds: S.boardDef.kinds, wide: FIGHT_UI.board.width === Math.round(FIGHT_UI.tw * S.w) }; });
    r.err = d.errs[0]; await d.close(); return r; };
  const one = await look(',party:{faction:"brigands",count:3,days:1,difficulty:1}');
  const three = await look(',party:{faction:"brigands",count:10,days:30,difficulty:1,parties:3}');
  const end = await look(',endgame:true');
  leg(one.w < 10 && one.crop && one.near && Math.abs(one.man - 104) <= 2 && one.gap >= 5 && one.onBoard && one.wide && !one.err,
    '*** A DAY-1 PARTY OF THREE OPENS ON A BOARD UNDER TEN WIDE, THE MAN AT 112 *** (rule 79): cut from the dealt board, the lines five apart, everybody on it',
    one.w + 'x' + one.h + ' houses, man ' + one.man + ' px, gap ' + one.gap + ', ' + one.kinds.join(' + '));
  leg(three.w === 20 && three.h === 15 && end.w === 20 && end.h === 15 && !three.err && !end.err, 'three parties at once, or the endgame, keep the full 20 by 15 (\'12 versus 60\')', three.w + 'x' + three.h + ', ' + end.w + 'x' + end.h);
}

/* A TURN YOU CAN READ (VIA GROK 10/9: 'Paolo said the turns are too short'): one of yours against six thugs on a flat
   board at the true beat; his own turn waits for his finger; each of their acts holds the board two beats (one second at
   120), so six men take six seconds or more; the struck man shows his chance and his loss as numbers; a tap on the board
   skips the rest of their turn. */
async function turnPace() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:3,speed:1,kind:"strip",flat:true,deploy:false,cap:1,party:["brigand_thug","brigand_thug","brigand_thug","brigand_thug","brigand_thug","brigand_thug"]}' });
  const p = d.page;
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
  await p.evaluate(() => { window.__acts = []; window.__nums = []; const o = FIGHT.aiStep;
    FIGHT.aiStep = function (u) { const n = FIGHT.S.events.length; const r = o(u);
      if (u.side === 'them' && FIGHT.S.events.slice(n).some(e => e.t === 'step' || e.t === 'attack')) window.__acts.push({ t: performance.now(), id: u.id }); return r; };
    new MutationObserver(() => window.__nums.push(document.getElementById('num').textContent)).observe(document.getElementById('num'), { childList: true, characterData: true, subtree: true }); });
  const mine = () => p.evaluate(() => { const u = FIGHT.current(); return !!u && u.side === 'you' && !FIGHT_UI.anim.length && !FIGHT_UI.glide && performance.now() > FIGHT_UI.openUntil; });
  const wait = async (ms) => { const t = Date.now(); while (!(await mine()) && Date.now() - t < ms) await p.waitForTimeout(80); return mine(); };
  await wait(60000);
  await p.waitForTimeout(3000);
  const still = await mine();
  const end = await p.evaluate(() => { const r = document.getElementById('bend').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await p.touchscreen.tap(end[0], end[1]);
  const tEnd = await p.evaluate(() => performance.now());
  await p.waitForTimeout(500); await wait(90000);
  const tBack = await p.evaluate(() => performance.now());
  const acts = await p.evaluate(e => window.__acts.filter(a => a.t > e), tEnd), gaps = acts.slice(1).map((a, i) => a.t - acts[i].t);
  const nums = await p.evaluate(() => window.__nums);
  leg(still, 'his own turn has no timer: three seconds on, it is still his, waiting for his finger');
  leg(acts.length >= 6 && gaps.every(g => g >= 990) && tBack - tEnd >= 6000, '*** A TURN YOU CAN READ *** (VIA GROK: \'the turns are too short\'): every act of theirs holds the board two beats, six men take six seconds or more',
    acts.length + ' acts in ' + ((tBack - tEnd) / 1000).toFixed(1) + ' s, the shortest gap ' + Math.round(Math.min(...gaps)) + ' ms');
  leg(nums.some(t => /^\d+%$/.test(t)) && nums.some(t => /^-\d+$/.test(t)) && !nums.some(t => /[a-z]/i.test(t)), 'the struck man shows the number: his chance to be hit, then what it cost him, numbers only (no word on the ground, rule 46f)', nums.slice(0, 6).join(' '));
  await p.touchscreen.tap(end[0], end[1]);
  await p.waitForTimeout(1200);
  const theirs = await p.evaluate(() => { const u = FIGHT.current(); return u && u.side === 'them'; });
  const t0 = Date.now(); await p.touchscreen.tap(195, 330); const back = await wait(8000);
  leg(theirs && back && Date.now() - t0 < 1500 && !d.errs.length, 'a tap on the board while they move skips the rest of their turn, and it is his again', (Date.now() - t0) + ' ms' + (d.errs[0] ? ' ' + d.errs[0] : ''));
  await d.close();
}

/* STRUCK DOWN (Paolo's fifth votes, flat 20%; third votes, the main character never dies; the wiki's Permanent Injuries):
   a thousand struck-down rolls on a hire land 17 to 23 percent dead; a thousand on the main character, never; every man who
   lives carries one of the wiki's permanent injuries for the days he is laid up; the recap says so and so does the fight's
   message home; GROK_115's injury sheet is in injuries.json. And rule 73a's day rim: by day every man is drawn with a dark
   one-pixel edge round his silhouette. */
/* THE ART AT ITS OWN PIXELS (DIRECTION 10/9, FIGHT VERDICT 22): close in, the ground is drawn from COMBAT TWO's blocks onto
   the device's pixels, so a tile's edges on the glass match its edges in the file. Measured: the fraction of neighbouring
   pixel pairs that differ by more than a step of light, in one board tile on the glass against the same tile in its block. */
/* THE LIT TILES LOOK LIT (rule 73, rule 88): a lamp's pool is 7 m and a tile 12 m, the lamps on tile edges, so a tile the rules
   call lit showed a lit sliver on a dark tile. Measured as the lamp's own work: every walkable lit tile against ITSELF with the
   block's power off (the same ground, the same night), on three boards; the board-wide median (sunTest) compares asphalt
   against sand and stays where it is */
async function litLooksLit() {
  const grab = async (seed, power) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:' + seed + ',speed:1,night:true' + (power ? '' : ',power:false') + '}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.waitForTimeout(1200);
    const r = await d.page.evaluate(() => { const S = FIGHT.S, T = FIGHT._t, B = FIGHT_UI.board, bd = B.getContext('2d').getImageData(0, 0, B.width, B.height).data, tw = B.width / S.w, th = B.height / S.h;
      const lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }, Y = i => .2126 * lin(bd[i]) + .7152 * lin(bd[i + 1]) + .0722 * lin(bd[i + 2]);
      const t = {}; for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const v = []; for (let i = 1; i < 6; i++) for (let j = 1; j < 6; j++) v.push(Y((Math.floor((y + j / 6) * th) * B.width + Math.floor((x + i / 6) * tw)) * 4)); v.sort((a, b) => a - b); t[x + ',' + y] = v[12]; }
      const lit = []; if (S.lit) for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (S.lit[y][x] && T.passable(x, y)) lit.push(x + ',' + y);
      return { t, lit }; });
    r.err = d.errs[0]; await d.close(); return r;
  };
  const rows = [];
  for (const seed of [31, 3, 7]) { const on = await grab(seed, true), off = await grab(seed, false);
    const rs = on.lit.map(k => (on.t[k] + .05) / (off.t[k] + .05)).sort((a, b) => a - b);
    rows.push({ seed, n: rs.length, min: rs[0] || 0, under: rs.filter(r => r < 3).length, err: on.err || off.err }); }
  leg(rows.every(r => r.n > 0 && r.under === 0 && !r.err), '*** THE LIT TILES LOOK LIT (rule 73) ***: every walkable tile the rules light stands at least three to one over itself with the power off, on three boards (37 of 84 were under, some at 1.06)',
    rows.map(r => 'seed ' + r.seed + ': ' + r.n + ' lit, the dimmest ' + r.min.toFixed(2) + ' to 1').join('; '));
}

/* THE HEAD UNDER THE STRIP (rule 88): every step and swing a man makes ends with his whole box, head to feet, on the glass
   between the turn strip and the bar, on four screens, AUTO driving a whole fight on the beat; and the fight never stalls
   behind a camera that cannot frame a man (the computer froze in round one: the follow glided at a man the clamp could not
   centre, forever) */
async function actFramed() {
  const rows = [];
  for (const profile of ['phone_portrait', 'phone_landscape', 'tablet', 'computer']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:11,speed:4,kind:"strip",deploy:false};window.__hd=[];' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.evaluate(() => { FIGHT_UI.auto = true; let cur = null;
      const look = a => { const u = FIGHT.byId(a.e.id); if (!u) return; const x0 = a.k === 'step' ? a.e.x : u.x, y0 = a.k === 'step' ? a.e.y : u.y;
        const tall = MAN_IDLE * FIGHT_UI.zoom / FIGHT_UI.near, feet = sy((y0 + .9) * FIGHT_UI.th), head = feet - tall, x = sx((x0 + .5) * FIGHT_UI.tw);
        window.__hd.push({ off: x < 0 || x > W || feet < TOPH || head > H - BOTH, cut: head < TOPH - 2 || feet > H - BOTH + 2 }); };
      const loop = () => { const a = FIGHT_UI.anim[0]; if (cur && a !== cur) { look(cur); cur = null; } if (a && a.at && (a.k === 'step' || a.k === 'attack')) cur = a; requestAnimationFrame(loop); };
      requestAnimationFrame(loop); });
    await d.page.waitForTimeout(30000);
    const r = await d.page.evaluate(() => ({ n: __hd.length, bad: __hd.filter(h => h.off || h.cut).length }));
    r.profile = profile; r.err = d.errs[0]; rows.push(r); await d.close();
  }
  leg(rows.every(r => r.n >= 40 && r.bad === 0 && !r.err),
    '*** THE HEAD UNDER THE STRIP (rule 88) ***: every step and swing ends with the whole man on the glass, never under the strip or the bar, and the fight never stalls behind the camera (the computer froze; the flipped phone cut 26 of 56 acts)',
    rows.map(r => r.profile + ' ' + r.bad + ' of ' + r.n).join(', '));
}

/* THE FLIPPED PHONE'S LOOK (rule 88): nothing of the bar lies on the men. On a wide glass the hint sits in the strip beside
   the faces, never over a man's box; on every screen the strip's tape ends at its last face (it was stretched over the
   whole width, a smear over the shop fronts) */
async function flippedLook() {
  const rows = [];
  for (const profile of ['phone_landscape', 'tablet', 'computer', 'phone_portrait']) {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:9,speed:1,kind:"strip",deploy:false}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && document.getElementById('say').textContent, null, { timeout: 30000 });
    await d.page.waitForTimeout(1500);
    const r = await d.page.evaluate(() => { const e = document.getElementById('say').getBoundingClientRect(), o = document.getElementById('order').getBoundingClientRect();
      const faces = Array.from(document.querySelectorAll('#order canvas')).map(c => c.getBoundingClientRect().right), tall = MAN_IDLE * FIGHT_UI.zoom / FIGHT_UI.near;
      const over = FIGHT.S.units.filter(FIGHT.onField).filter(u => { const x = sx((u.x + .5) * FIGHT_UI.tw), y = sy((u.y + .9) * FIGHT_UI.th);
        return x + tall / 4 > e.left && x - tall / 4 < e.right && y > e.top && y - tall < e.bottom && y > TOPH && y - tall < H - BOTH; }).length;
      return { over, inStrip: document.getElementById('say').classList.contains('instrip'), sayBottom: e.bottom, top: TOPH, tape: o.right - Math.max(...faces) }; });
    r.profile = profile; r.err = d.errs[0]; rows.push(r); await d.close();
  }
  const wide = rows.filter(r => r.profile !== 'phone_portrait');
  leg(wide.every(r => r.inStrip && r.sayBottom <= r.top + 2 && r.over === 0 && !r.err),
    '*** THE FLIPPED PHONE\'S LOOK (rule 88) ***: on a wide glass the hint sits in the strip beside the faces and never on a man',
    wide.map(r => r.profile + ' ' + (r.inStrip ? 'in the strip' : 'on the board') + ', ' + r.over + ' men under it').join('; '));
  leg(rows.every(r => r.tape <= 8), '  the strip\'s tape ends at its last face on every screen (it was stretched over the whole glass)',
    rows.map(r => r.profile + ' ' + Math.round(r.tape) + ' pt past the last face').join(', '));
}

async function artPixels() {
  const at = async (profile, night) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS={seed:9,speed:1,kind:"strip",deploy:false,night:' + night + '}' });
    await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
    await d.page.waitForTimeout(2500);
    const run = () => new Promise(res => { const U = FIGHT_UI, G = DB.ground, B = FIGHT.S.boardDef, bt = G.block_tiles, tp = G.tile_px;
      U.glide = null; U.openUntil = 1e12; U.zoom = U.near; U.groundOnly = true;
      const edges = (px, w, h) => { let n = 0, e = 0; const L = i => .3 * px[i] + .59 * px[i + 1] + .11 * px[i + 2];
        for (let y = 0; y < h; y++) for (let x = 0; x + 1 < w; x++) { const i = (y * w + x) * 4; n++; if (Math.abs(L(i) - L(i + 4)) > 24) e++; } return e / n; };
      const measure = () => { const tx = Math.floor(wx(W / 2) / U.tw), ty = Math.floor(wy(TOPH + (H - TOPH - BOTH) / 2) / U.th),
          ox = B.crop ? B.crop.ox : 0, oy = B.crop ? B.crop.oy : 0, bx = Math.floor((tx + ox) / bt), by = Math.floor((ty + oy) / bt),
          im = U.imgs['fight_ground/' + G.blocks[B.blocks[by][bx]].src], pad = 6,
          gx = Math.round(sx(tx * U.tw) * DPR) + pad, gy = Math.round(sy(ty * U.th) * DPR) + pad,
          gw = Math.round(U.tw * U.zoom * DPR) - pad * 2, gh = Math.round(U.th * U.zoom * DPR) - pad * 2;
        const glass = cx.getImageData(gx, gy, gw, gh).data;
        const c = document.createElement('canvas'); c.width = tp[0] - pad * 2; c.height = tp[1] - pad * 2;
        c.getContext('2d').drawImage(im, -(((tx + ox) % bt) * tp[0] + pad), -(((ty + oy) % bt) * tp[1] + pad));
        const file = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        const ay = Math.round(TOPH * DPR), ah = Math.round((H - TOPH - BOTH) * DPR), aw = Math.round(W * DPR);
        return { glass: edges(glass, gw, gh), file: edges(file, c.width, c.height), all: edges(cx.getImageData(0, ay, aw, ah).data, aw, ah), mode: U.groundMode, artPerGlass: U.tw * U.zoom * DPR / tp[0] }; };
      requestAnimationFrame(() => requestAnimationFrame(() => { const now = measure(); U.bakedOnly = true;
        requestAnimationFrame(() => requestAnimationFrame(() => { const was = measure(); U.bakedOnly = false; U.groundOnly = false; U.fps = 0;
          const t0 = performance.now(); let n = 0; U.groundOnly = false;
          const f = () => { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else res({ now, was, fps: n / 1.5, draws: U.gdraws }); }; requestAnimationFrame(f); })); })); });
    const r = await d.page.evaluate(run); r.err = d.errs[0]; await d.close(); return r;
  };
  const day = await at('phone_portrait', false), night = await at('phone_portrait', true), wide = await at('computer', false);
  const ratio = r => r.now.glass / r.now.file, f = v => v.toFixed(3);
  leg(day.now.mode === 'one to one' && Math.abs(day.now.artPerGlass - 1) < .005,
    '*** THE ART AT ITS OWN PIXELS ***: on a phone (three device pixels a point) at the man\'s stop, one art pixel lands on one device pixel',
    day.now.mode + ', ' + day.now.artPerGlass.toFixed(3) + ' art px per device px');
  leg(ratio(day) >= .8 && ratio(day) <= 1.2, '  a tile\'s edges on the glass are within a fifth of its edges in the file (FIGHT VERDICT 22 measured 0.002 against 0.038)',
    'glass ' + f(day.now.glass) + ' vs file ' + f(day.now.file) + ' = ' + Math.round(100 * ratio(day)) + '% (the baked board gave ' + f(day.was.glass) + ' = ' + Math.round(100 * day.was.glass / day.was.file) + '%)');
  leg(ratio(night) >= .5 && night.fps >= 50 && day.fps >= 50 && !day.err && !night.err,
    '  by night too (the night\'s colour costs it some edges, never the art), and the phone holds 60 frames: the ground is drawn once per camera move, not every frame',
    'night ' + Math.round(100 * ratio(night)) + '%, ' + Math.round(day.fps) + ' fps day, ' + Math.round(night.fps) + ' fps night, ' + night.draws + ' ground draws');
  leg(wide.now.mode !== 'baked' && wide.now.all >= .95 * wide.was.all && !wide.err, '  on a computer the ground is drawn from the art too, never softer than the bake (every visible tile, not one: one tile moved with the camera)',
    wide.now.mode + ', the glass ' + f(wide.now.all) + ' vs baked ' + f(wide.was.all));
}

async function struckDown() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS={seed:9,speed:1,kind:"strip",deploy:false}' });
  await d.page.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 30000 });
  await d.page.waitForTimeout(1500);
  const r = await d.page.evaluate(() => {
    const S = FIGHT.S, T = FIGHT._t, hire = S.units.find(u => u.side === 'you' && !u.main), main = S.units.find(u => u.main);
    const keep = S.units.map(u => [u, u.morale, u.dead, u.down, u.hp]);
    const roll = (u) => { u.dead = false; u.down = false; u.hp = 1; u.longInjury = null; u.laidUp = 0; S.events = []; T.fall(u, null); return { dead: u.dead, down: u.down, inj: u.longInjury, days: u.laidUp }; };
    let dead = 0, mainDead = 0, injured = 0, days = [], ids = {};
    for (let i = 0; i < 1000; i++) { const o = roll(hire); if (o.dead) dead++; else if (o.inj) { injured++; days.push(o.days); ids[o.inj.id] = 1; } }
    for (let i = 0; i < 1000; i++) { const o = roll(main); if (o.dead) mainDead++; }
    const perm = DB.injuries.rows.filter(j => j.kind === 'permanent').map(j => j.id);
    roll(hire); let tries = 0; while (hire.dead && tries++ < 50) roll(hire);
    keep.forEach(k => { if (k[0] !== hire) { k[0].morale = k[1]; k[0].dead = k[2]; k[0].down = k[3]; k[0].hp = k[4]; } });
    /* the recap and the message home */
    S.over = true; S.result = 'lost'; showOver('lost'); const sent = homeMessage('lost');
    const recap = document.getElementById('over').innerText;
    /* the day rim: pixels outside his silhouette that the rim fills, and how dark they are */
    const img = atlasOf(hire), day = dayAtlas(img), w = 112, h = 112;
    const a = document.createElement('canvas'); a.width = w; a.height = h; const ag = a.getContext('2d'); ag.drawImage(img, 0, 0, w, h, 0, 0, w, h);
    const b = document.createElement('canvas'); b.width = w; b.height = h; const bg = b.getContext('2d'); bg.drawImage(day, 0, 0, w, h, 0, 0, w, h);
    const A = ag.getImageData(0, 0, w, h).data, B = bg.getImageData(0, 0, w, h).data; let rim = 0, darkRim = 0;
    for (let i = 3; i < A.length; i += 4) if (A[i] === 0 && B[i] > 0) { rim++; if (.3 * B[i - 3] + .59 * B[i - 2] + .11 * B[i - 1] < 40) darkRim++; }
    return { dead, mainDead, injured, perm, ids: Object.keys(ids), dMin: Math.min(...days), dMax: Math.max(...days), range: R('ours.struck_down_laid_up_days'),
      hire: { name: hire.name, inj: hire.longInjury && hire.longInjury.name, days: hire.laidUp }, recap, sent: sent && sent.crew && sent.crew.find(c => c.name === hire.name), rim, darkRim };
  });
  leg(r.dead >= 170 && r.dead <= 230 && r.mainDead === 0, '*** STRUCK DOWN: A THOUSAND ROLLS, 17 TO 23 PERCENT DEAD; THE MAIN CHARACTER NEVER *** (his fifth votes and his third)', r.dead / 10 + '% of a hire, ' + r.mainDead + ' of a thousand for the main character');
  leg(r.injured === 1000 - r.dead && r.ids.every(x => r.perm.indexOf(x) >= 0) && r.ids.length >= 8 && r.dMin >= r.range[0] && r.dMax <= r.range[1],
    'every man who lives carries one of the wiki\'s permanent injuries (each as likely), laid up 30 to 40 days', r.ids.length + ' of the ' + r.perm.length + ' drawn, ' + r.dMin + ' to ' + r.dMax + ' days');
  leg(r.hire.inj && r.recap.toUpperCase().indexOf(r.hire.inj.toUpperCase()) >= 0 && r.recap.indexOf('LAID UP ' + r.hire.days + ' DAYS') >= 0 && r.sent && r.sent.injury && r.sent.injury.name === r.hire.inj && r.sent.laidUpDays === r.hire.days,
    'the recap names his injury and his days, and the message home carries them for the roster\'s pain line', r.hire.name + ': ' + r.hire.inj + ', ' + r.hire.days + ' days' + (r.sent && r.sent.injury ? ' (' + r.sent.injury.line + ')' : ''));
  const INJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/injuries.json'), 'utf8')), mul = INJ.rules.temporary_threshold_formula.multipliers;
  const temp = INJ.rows.filter(j => j.kind === 'temporary'), withT = temp.filter(j => j.threshold_pct_of_max_hp !== null).length;
  leg(mul.inflict_injury_threshold_multiplier_crippling_strikes.value === 0.66 && mul.receive_injury_threshold_multiplier_iron_jaw.value === 1.25 && mul.bonus_head_hit.value === 1.25 && INJ.rules.temporary_base_conditions.min_damage_hitpoints === 10 && withT >= temp.length - 2,
    'Grok\'s injury sheet (GROK_115) is in injuries.json: 10 health at least, the threshold per injury, Crippling Strikes 0.66, Iron Jaw 1.25, a head hit 1.25', withT + ' of ' + temp.length + ' temporary injuries carry a threshold (the other two come only from events)');
  leg(r.rim > 40 && r.darkRim / r.rim > 0.9 && !d.errs.length, '*** THE DAY RIM (rule 73a) ***: by day a man is drawn with a dark one-pixel edge round his silhouette, the way a figure reads on a bright glass', r.rim + ' rim pixels in his idle frame, ' + Math.round(100 * r.darkRim / Math.max(1, r.rim)) + '% dark');
  await d.close();
}

(async () => {
  await litLooksLit();
  await actFramed();
  await flippedLook();
  await artPixels();
  await struckDown();
  await turnPace();
  await boardFits();
  await enemyParts();
  await weaponCards();
  await enemyMath();
  await formation();
  await sunTest();
  await screens();
  await nightLights();
  await table70();
  await sweep();
  for (let i = 0; i < FIGHTS.length; i++) await fight(FIGHTS[i], i === 0);
  leg(all.hit > 0 && all.miss > 0, 'swings hit and miss by the rolled chance', all.hit + ' / ' + all.miss);
  leg(all.head > 0, 'heads get hit for half again (wiki: base 25%, x1.5)', all.head);
  leg(all.morale > 0, 'nerve moves: the morale ladder ran in the fight', all.morale);
  leg(all.injury > 0, 'injuries land apart from hitpoints', all.injury);
  leg(all.skill > 0, 'the brains reach for the skills a perk unlocks (rally, recover, taunt, sidestep, plant the feet, go first), across the twelve fights', all.skill);
  leg(all.free > 0, 'leaving a man\'s reach draws his free swing (zone of control)', all.free);
  console.log('=== THE REBUILT FIGHT PLAYS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); console.log('=== THE REBUILT FIGHT PLAYS GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ==='); process.exit(1); });

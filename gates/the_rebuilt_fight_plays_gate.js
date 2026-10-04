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
const BB = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/rules.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const shot = n => path.join(ROOT, 'slices/vote/COMBAT_THE_FIGHT_REBUILT_' + n + '_10_2.jpg');
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
    zoom: FIGHT_UI.zoom, far: FIGHT_UI.far, bw: FIGHT_UI.board.width * FIGHT_UI.zoom, bh: FIGHT_UI.board.height * FIGHT_UI.zoom,
    W: innerWidth, avail: innerHeight - document.getElementById('top').offsetHeight - document.getElementById('bot').offsetHeight,
    gap: Math.min.apply(null, FIGHT.alive('you').map(u => Math.min.apply(null, FIGHT.alive('them').map(e => Math.max(Math.abs(u.x - e.x), Math.abs(u.y - e.y)))))),
    ini: FIGHT.S.order.map(id => FIGHT.byId(id).turnIni) }));
  if (first) await p.screenshot(Object.assign({ path: shot('OPEN') }, SHOT));
  leg(s0.you === OURS.field_size.value, F.board + ': twelve of yours on the field (rule 63b)', s0.you + ' v ' + s0.them);
  leg(Math.abs(s0.zoom - s0.far) < 1e-6 && s0.bw <= s0.W + 1 && s0.bh <= s0.avail + 1,
    F.board + ': *** IT OPENS WITH THE WHOLE BOARD ON THE GLASS (rule 62) ***', Math.round(s0.bw) + 'x' + Math.round(s0.bh) + ' in ' + s0.W + 'x' + s0.avail);
  leg(s0.gap >= BB.deployment.min_gap_between_lines_hexes.value, F.board + ': the lines start at least five tiles apart (wiki: "at least 5 hexes between parties")', 'nearest ' + s0.gap);
  leg(s0.ini.every((v, i) => i === 0 || s0.ini[i - 1] >= v), F.board + ': the round goes by initiative, highest first', s0.ini.slice(0, 5).map(Math.round).join(' > '));
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
      const cx0 = 10; for (let y = 0; y < S.h; y++) if (y !== 7 && y !== 8) S.terrain[y][cx0] = 'blocked';
      a.x = cx0 - 3; a.y = 7;
      const goal = () => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0 + 3, 7)] !== undefined || f.best[f.key(cx0 + 3, 8)] !== undefined; };
      es[0].x = cx0; es[0].y = 7; es[1].x = 0; es[1].y = 0;
      const one = goal();
      const own = FIGHT.reach(a, 99, true); const ownTile = own.best[own.key(cx0, 7)] === undefined;
      es[1].x = cx0; es[1].y = 8;
      const two = goal();
      es[1].x = cx0 + 1; es[1].y = 8; es[0].x = cx0; es[0].y = 7;
      const diag = FIGHT._t.squeezes(cx0, 8, cx0 + 1, 7);
      /* PASS ONE OF YOUR OWN, NEVER TWO (rule 70): a one-wide lane two houses long, cut through the block */
      es.forEach(e => { e.x = 0; e.y = 0; e.fled = true; });
      for (let y = 0; y < S.h; y++) { S.terrain[y][cx0] = y === 7 ? 'flat' : 'blocked'; S.terrain[y][cx0 + 1] = y === 7 ? 'flat' : 'blocked'; }
      const pals = S.units.filter(u => u.side === 'you' && u !== a).slice(0, 2);
      const far = () => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0 + 3, 7)] !== undefined; };
      pals.forEach(m => { m.fled = false; m.x = 0; m.y = S.h - 1; });
      pals[0].x = cx0; pals[0].y = 7; pals[1].x = 1; pals[1].y = S.h - 1;
      const throughOne = far();
      const standOn = (() => { const f = FIGHT.reach(a, 99, true); return f.best[f.key(cx0, 7)] === undefined; })();
      pals[1].x = cx0 + 1; pals[1].y = 7;
      const throughTwo = far();
      pals.forEach(m => { m.x = 0; m.y = 0; m.fled = true; });
      es[0].fled = false; es[0].x = cx0; es[0].y = 7;
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
      FIGHT.aiStep = function (u) {
        const r = orig(u);
        if (r === false && u.side === 'you' && FIGHT.onField(u) && u.morale !== 'Fleeing') {
          const mates = FIGHT.alive('you').filter(f => f !== u && FIGHT.onField(f)), h = T.huntField(u), L = T.lineOf(u, h);
          const eng = FIGHT.alive('them').some(f => dd(f, u) === 1);
          if (eng) { m.engaged++; if (!mates.some(f => dd(f, u) === 1)) m.alone++; }
          else if (!S.contact) { m.walks++; if (L.mid !== null && h(u.x, u.y) < L.mid - (R('ours.formation_depth_lines') - 1)) m.ahead++; }
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
  leg(A.walks > 0 && pc(A.ahead, A.walks) <= 5, '*** AUTO HOLDS THE FORMATION *** (Dev Blog 105: \'better coordination amongst their ranks\'): walking up, a man is ahead of the middle of his line by more than the line\'s depth in 5% of turns or fewer',
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

(async () => {
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

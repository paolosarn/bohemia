#!/usr/bin/env node
/* THE BULLET LANDS (SOUNDS [the bullet lands], rule 120: guns first, 'the guns were supposed to be the main way this is gonna be
   solved'; rule 126(c): every hit, kill and fall is heard; rule 127: no card, he hears it in his next fight).
   MEASURED BEFORE (slices/vote/guns_heard/now_measured.json, through the game's chain 10/24): a miss and a head hit were SILENT,
   five shots in six played at -41.8 dB (shot_more), the real guns of [the guns heard] sat in a VOTE card, unheard in a fight.

   Legs:
   1. THE SOUNDS ARE REAL: every take of every voice is made of banked recordings with a CC0 line (the Free Firearm Sound
      Library's windows, ESC-50 clips whose authors released them CC0), the sprite peaks under -1 dBFS, no take ends in a click,
      every take at its voice's loudness (tools/bohemia_bullet_lands.py --check);
   2. THE CRACK IS THE BULLET: every crack window was cut from a mic downrange, from the bullet's crack to before the gun's report
      reached that mic (12 to 33 ms later), so no report is inside it;
   3. THE LEVELS HOLD THROUGH THE GAME'S OWN CHAIN (MUS.audio's compressor and brickwall, re-rendered in Chromium): every voice
      at index.json's gain lands within 0.75 dB of what the level tool wrote and never peaks over -1 dBFS after the chain; the
      guns' one gain lands the shotgun's near mic at its mark;
   4. THE ROUTER, with what COMBAT can tell it: the right gun, the bullet in flesh, on a plate, through it, the head, cover by
      what it is made of, the crack past one of his, the dirt over there, the shotgun's spray, a man down dead and alive;
   5. THE ROUTER, with what the fight says today (ev alone): the turn and the last shot name the gun and the side; a miss after
      a swing, a melee blow, a hit long after any shot are never touched; his 'that was you' (hurt) always plays on top;
   6. NEVER THE SAME TAKE TWICE RUNNING, and twelve landings at most ring at once;
   7. THE COUNT-UP: a tick a 16th, 24 at most, the drop on a beat of the song's own grid, up with the bell and down without;
   8. THE GAME CARRIES IT: the alpha and the demo inline both engines byte for byte, the fight's sound line asks BULLET first,
      the effects bus hook is inside playSFX's closure;
   9. THE REAL SURFACE: the demo, a road fight through the map's own door on AUTO: the sprites are in when the fight is, the
      fight's shots are heard as real guns and its landings as real landings, the turn and the roster reached the player,
      nothing threw.
   Run: node gates/bullet_lands_gate.js   (--fast skips leg 9) */
'use strict';
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const LEVEL = require(path.join(ROOT, 'tools/bohemia_bullet_lands_level.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('THE BULLET LANDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

(async () => {
  /* ---------------- 1, 2: the files ---------------- */
  let chk = '';
  try { chk = execFileSync('python3', [path.join(ROOT, 'tools/bohemia_bullet_lands.py'), '--check'], { encoding: 'utf8' }); } catch (e) { chk = String(e.stdout || e.message); }
  leg(/^PASS/m.test(chk), '*** THE SOUNDS ARE REAL ***: every take from banked CC0 recordings, under -1 dBFS, no click, each at its voice\'s loudness', chk.trim().split('\n').slice(0, 4).join(' | '));
  const man = JSON.parse(read('slices/fight_heard/manifest.json')), idx = JSON.parse(read('slices/fight_heard/index.json'));
  const cracks = Object.entries(man.sources.ffsl.windows).filter(([, w]) => w.kind === 'crack');
  const bad = cracks.filter(([, w]) => !(w.report_s > w.window_s[1] && w.window_s[0] < w.onset_s && w.report_s - w.onset_s >= 0.010 && w.report_s - w.onset_s <= 0.035));
  const downrange = cracks.every(([, w]) => /^(far|mid) distance, front of shooter$/.test(w.mic || ''));
  leg(cracks.length >= 10 && !bad.length && downrange, '*** THE CRACK IS THE BULLET ***: ' + cracks.length + ' cracks, each cut from a downrange mic between the bullet\'s crack and the report (12 to 33 ms later), no report inside',
    bad.map(([b, w]) => b + ' ' + JSON.stringify(w.window_s) + ' report ' + w.report_s).join('; ') || cracks.map(([b, w]) => b + ' +' + Math.round((w.report_s - w.onset_s) * 1000) + 'ms').join(' '));
  const want = ['flesh_pistol', 'flesh_rifle', 'flesh_shotgun', 'flesh_mg', 'armour_pistol', 'armour_rifle', 'armour_shotgun', 'armour_mg', 'bone', 'cover_wood', 'cover_stone', 'cover_metal', 'cover_car',
    'ground_far', 'ground_near', 'pellets', 'crack_rifle', 'crack_mg', 'ricochet', 'down_dead', 'down_hurt', 'gun_mg_yours', 'gun_mg_theirs', 'tick', 'tally_up', 'tally_down'];
  const missing = want.filter(v => !idx.voices[v] || !idx.voices[v].takes.length || !man.voices[v]);
  leg(!missing.length && idx.file === man.file, 'every voice the player names is in the sprite and in the index the game reads', missing.join(', '));

  /* ---------------- 3 to 7: a bare page with the two engines ---------------- */
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
    rs.setHeader('content-type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.json') ? 'application/json' : f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html');
    fs.createReadStream(f).pipe(rs);
  });
  const PORT = 8934; await new Promise(r => srv.listen(PORT, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e.message)));
  try {
    await page.goto('http://127.0.0.1:' + PORT + '/slices/fight_heard/index.json');
    await page.addScriptTag({ content: LEVEL.PAGE_LIB });
    const lv = await page.evaluate(async () => {
      const idx = await (await fetch('/slices/fight_heard/index.json')).json(), lands = await dec('/slices/fight_heard/' + idx.file);
      const gun = await dec('/slices/vote/guns_heard/guns_shotgun_yours_a.mp3'), out = {};
      for (const [n, v] of Object.entries(idx.voices)) { const pk = await peakOf(() => voiceDb(lands, v.takes, v.db, false)); out[n] = { heard: await voiceDb(lands, v.takes, v.db, false), want: v.heard, peak: pk }; }
      const gt = [0, 1, 2, 3, 4].map(k => [k * 1.25 + 0.05, 1.0]);
      out.__guns = { heard: await voiceDb(gun, gt, idx.guns_db, false), want: idx.guns_heard_db, peak: await peakOf(() => voiceDb(gun, gt, idx.guns_db, false)) };
      return out;
    });
    const off = Object.entries(lv).filter(([, v]) => Math.abs(v.heard - v.want) > 0.75 || v.peak > -0.99);
    leg(!off.length && Object.keys(lv).length >= want.length + 1, '*** THE LEVELS HOLD THROUGH THE GAME\'S OWN CHAIN ***: every voice within 0.75 dB of its measured level after the compressor and brickwall, none over -1 dBFS',
      off.length ? off.map(([n, v]) => n + ' ' + v.heard.toFixed(1) + ' vs ' + v.want + ' peak ' + v.peak.toFixed(1)).join('; ') : 'guns ' + lv.__guns.heard.toFixed(1) + ' dB; flesh_rifle ' + lv.flesh_rifle.heard.toFixed(1) + '; crack_rifle ' + lv.crack_rifle.heard.toFixed(1) + '; down_dead ' + lv.down_dead.heard.toFixed(1));

    await page.addScriptTag({ url: '/engine/bohemia_guns_heard.js' });
    await page.addScriptTag({ url: '/engine/bohemia_bullet_lands.js' });
    const R = await page.evaluate(async () => {
      let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      const AC = new OfflineAudioContext(1, 44100 * 40, 44100);
      let t = 100000; const clockT = { playing: true, nextT: 0.1, step: 2 };
      const B = BOH_BULLET_LANDS.make({ dir: '/slices/fight_heard/', gunsDir: '/slices/vote/guns_heard/', random: rnd, now: () => t,
        out: () => ({ AC: AC, bus: AC.destination }), clock: () => clockT });
      await B.load(); await B.guns.preload(AC, 'a');
      /* an offline context never plays, so nothing ends: each message starts with the room empty, as it is between shots */
      const say = (m, dt) => { t += dt === undefined ? 300 : dt; B.live = 0; const n0 = B.log.length; const r = B.heard(m);
        return { r: r, played: B.log.slice(n0).map(l => l.dropped ? 'DROPPED ' + l.voice : l.voice ? l.voice + (l.far ? ':far' : ':near') : l.gun ? 'gun_' + l.gun + '_' + l.side : l.reload ? 'reload_' + l.reload : '?') }; };
      const out = { ready: B.ready(), err: B.err };
      /* 4: what COMBAT can say */
      out.withCtx = [
        say({ ev: 'shot', gun: 'rifle', side: 'you' }),
        say({ ev: 'hit', gun: 'rifle', side: 'you', hp: 12, armour: 0 }),
        say({ ev: 'hit', gun: 'crossbow', side: 'you', hp: 0, armour: 20 }),
        say({ ev: 'hit', gun: 'pistol', side: 'you', hp: 6, armour: 10 }),
        say({ ev: 'vital', gun: 'firearm', side: 'you', hp: 30, armour: 0, head: true }),
        say({ ev: 'hurt', gun: 'pistol', side: 'them', hp: 8, armour: 0 }),
        say({ ev: 'miss', gun: 'rifle', side: 'them' }),
        say({ ev: 'miss', gun: 'mg', side: 'them' }),
        say({ ev: 'miss', gun: 'pistol', side: 'them' }),
        say({ ev: 'miss', gun: 'shotgun', side: 'them' }),
        say({ ev: 'miss', gun: 'pistol', side: 'you' }),
        say({ ev: 'miss', gun: 'shotgun', side: 'you' }),
        say({ ev: 'miss', gun: 'rifle', side: 'you', cover: 'car_lane' }),
        say({ ev: 'miss', gun: 'pistol', side: 'you', cover: 'shed' }),
        say({ ev: 'miss', gun: 'pistol', side: 'you', cover: 'dumpster' }),
        say({ ev: 'miss', gun: 'pistol', side: 'you', cover: 'rock_4' }),
        say({ ev: 'kill', gun: 'rifle', side: 'them' }),
        say({ ev: 'went_down', gun: 'pistol', side: 'you' }),
        say({ ev: 'shot', gun: 'mg', side: 'them' }),
        say({ ev: 'mag_home', gun: 'firearm', side: 'you' })
      ];
      /* 5: what the fight says today */
      B.readRoster([{ side: 'you', weapon: { class: 'throwing', of: { class: 'dagger' } } }, { side: 'you', weapon: { class: 'throwing', of: { class: 'dagger' } } }, { side: 'you', weapon: { class: 'crossbow' } },
        { side: 'them', weapon: { class: 'crossbow' } }, { side: 'them', weapon: { class: 'sword' } }]);
      out.sides = B.sides;
      B.started(); t += 5000; B.turn = 'you';
      out.bare = [
        say({ ev: 'shot' }), say({ ev: 'miss' }, 220),
        say({ ev: 'shot' }), say({ ev: 'hit' }, 220), say({ ev: 'kill' }, 600)
      ];
      B.turn = 'them';
      out.bare2 = [say({ ev: 'shot' }, 3000), say({ ev: 'miss' }, 220), say({ ev: 'shot' }), say({ ev: 'hurt' }, 220), say({ ev: 'went_down' }, 700)];
      out.untouched = [say({ ev: 'swing_air' }, 3000), say({ ev: 'miss' }, 220), say({ ev: 'melee_hit' }, 100), say({ ev: 'shot' }), say({ ev: 'hit' }, 3000), say({ ev: 'step_dirt' }), say({ ev: 'mag_home' })];
      /* 6: never the same take twice running; twelve at most */
      const takes = []; for (let i = 0; i < 20; i++) { t += 300; B.live = 0; B.heard({ ev: 'hit', gun: 'rifle', side: 'you', hp: 5, armour: 0 }); takes.push(B.log[B.log.length - 1].take); }
      out.repeats = takes.filter((k, i) => i && k === takes[i - 1]).length; out.takes = takes.join('');
      B.live = 0; let dropped = 0; const n0 = B.log.length; for (let i = 0; i < 20; i++) B.voice('flesh_rifle', { AC: AC, bus: AC.destination }, false);
      dropped = B.log.slice(n0).filter(l => l.dropped).length; out.cap = { live: B.live, dropped: dropped };
      /* 7: the count-up */
      B.live = 0; const c0 = B.log.length;
      const up = B.countUp(240, 270); const upLog = B.log.slice(c0);
      const c1 = B.log.length; const dn = B.countUp(100, 90); const dnLog = B.log.slice(c1);
      clockT.playing = false; const off = B.countUp(5, 8);
      out.count = { up: up, upTicks: upLog.filter(l => l.voice === 'tick').length, upTally: upLog.filter(l => l.voice === 'tally_up').length,
        dn: dn, dnTicks: dnLog.filter(l => l.voice === 'tick').length, dnTally: dnLog.filter(l => l.voice === 'tally_down').length, dnBell: dnLog.filter(l => l.voice === 'tally_up').length, off: off,
        upLand: upLog.filter(l => l.voice === 'tally_up').map(l => l.at)[0], upFirst: upLog.filter(l => l.voice === 'tick').map(l => l.at)[0] };
      return out;
    });
    const P = (i) => R.withCtx[i].played.join(' ');
    const ctxOk = [
      [P(0) === 'gun_rifle_yours' && R.withCtx[0].r === 'done', 'a rifle of yours fires the real rifle, near'],
      [P(1) === 'flesh_rifle:far', 'his rifle into their man: flesh, over there'],
      [/^armour_rifle:far/.test(P(2)), 'a crossbow-class (the RIFLE) on a plate that stopped it: armour'],
      [P(3) === 'armour_pistol:far flesh_pistol:far', 'through the plate: the plate and the flesh'],
      [P(4) === 'flesh_shotgun:far bone:far', 'the shotgun to the head: flesh and bone'],
      [P(5) === 'flesh_pistol:near' && R.withCtx[5].r === null, 'their pistol into his man: flesh near, and his own "that was you" still plays'],
      [P(6) === 'crack_rifle:near', 'their rifle misses his man: the crack past his ear'],
      [P(7) === 'crack_mg:near', 'their machine gun misses: the sweep of cracks'],
      [P(8) === 'ground_near:near', 'their pistol misses: the dirt at his feet'],
      [P(9) === 'pellets:near', 'their shotgun misses: the spray'],
      [P(10) === 'ground_far:far', 'his pistol misses: the dirt over there'],
      [P(11) === 'pellets:far', 'his shotgun misses: the spray over there'],
      [P(12) === 'cover_car:far' || P(12) === 'cover_car:far ricochet:far', 'a miss into a car: steel and glass'],
      [P(13) === 'cover_wood:far', 'a miss into a shed: wood, and wood never ricochets'],
      [/^cover_metal:far/.test(P(14)) && /^cover_stone:far/.test(P(15)), 'a dumpster is steel, a rock is stone'],
      [P(16) === 'down_dead:far', 'theirs shot dead: down, over there'],
      [P(17) === 'down_hurt:near', 'his man struck down by a bullet: down alive, near'],
      [P(18) === 'gun_mg_yours:near' || P(18) === 'gun_mg_theirs:near', 'the machine gun fires its own real burst']
    ];
    ctxOk[17][0] = P(18) === 'gun_mg_theirs:near';
    const ctxOk2 = P(19) === 'reload_shotgun';
    const badCtx = ctxOk.filter(c => !c[0]).map(c => c[1]);
    leg(R.ready && !badCtx.length && ctxOk2, '*** THE ROUTER, WITH WHAT COMBAT CAN TELL IT ***: the right gun, flesh, plate, through, the head, cover by its stuff, the crack past his ear, the dirt, the spray, the falls, the reload',
      badCtx.length ? badCtx.join('; ') + ' | got ' + R.withCtx.map((w, i) => i + ':' + w.played.join('+')).join(' ') : R.withCtx.map(w => w.played.join('+')).join(' | '));
    const B1 = R.bare.map(x => x.played.join('+')), B2 = R.bare2.map(x => x.played.join('+')), U = R.untouched.map((x, i) => i === 3 ? x.r === 'done' : x.r === null && !x.played.length);
    const bareOk = R.sides.you === 'pistol' && R.sides.them === 'rifle'
      && B1[0] === 'gun_pistol_yours' && B1[1] === 'ground_far:far' && B1[2] === 'gun_pistol_yours' && B1[3] === 'flesh_pistol:far' && B1[4] === 'down_dead:far'
      && B2[0] === 'gun_rifle_theirs' && B2[1] === 'crack_rifle:near' && B2[2] === 'gun_rifle_theirs' && B2[3] === 'flesh_rifle:near' && R.bare2[3].r === null && B2[4] === 'down_hurt:near';
    leg(bareOk, '*** THE ROUTER, WITH WHAT THE FIGHT SAYS TODAY ***: the roster names each side\'s gun, the turn names the shooter, the last shot names the landing and the fall',
      JSON.stringify(R.sides) + ' | ' + B1.join(' , ') + ' | ' + B2.join(' , '));
    leg(U.every(Boolean), 'a miss after a swing, a melee blow, a hit three seconds after the last shot, a footstep and a reload the fight did not name: never touched',
      R.untouched.map(x => (x.r === null ? 'null' : JSON.stringify(x.r)) + (x.played.length ? '+' + x.played.join('+') : '')).join(' '));
    leg(R.repeats === 0 && R.cap.dropped === 8, 'never the same take twice running (20 hits: ' + R.takes + '); twelve landings at most ring at once', 'repeats ' + R.repeats + ', dropped ' + R.cap.dropped + ' of 20');
    const C = R.count, stepsToLand = C.up && Math.round((C.up.landMs - C.up.startMs) / C.up.stepMs);
    const countOk = C.up && C.up.ticks === 24 && C.upTicks === 24 && C.upTally === 1 && C.up.onGrid && (2 + stepsToLand) % 4 === 0 && stepsToLand >= 24
      && C.dn && C.dnTicks === 10 && C.dnTally === 1 && C.dnBell === 0 && C.off && C.off.ticks === 3 && !C.off.onGrid && Math.abs(C.upFirst - 0.1) < 0.002;
    leg(countOk, '*** THE COUNT-UP ON THE BEAT ***: 240 to 270 ticks 24 sixteenths from the song\'s next step and drops on its beat with the bell; 100 to 90 ticks 10 and drops dull, no bell; with no song it still counts',
      JSON.stringify({ up: C.up && { ticks: C.up.ticks, steps: stepsToLand, onGrid: C.up.onGrid }, upTicks: C.upTicks, dn: C.dnTicks, dnTally: C.dnTally, bell: C.dnBell, off: C.off && C.off.ticks, first: C.upFirst }));
  } catch (e) { leg(false, 'the engines ran on a bare page', String(e.message).slice(0, 240)); }
  leg(!errs.length, 'nothing threw on the bare page', errs.slice(0, 2).join(' | '));
  await browser.close(); srv.close();

  /* ---------------- 8: the game carries it ---------------- */
  const eng = ['engine/bohemia_guns_heard.js', 'engine/bohemia_bullet_lands.js'].map(f => read(f).trimEnd() + '\n');
  for (const f of ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html']) {
    const s = read(f), a = s.indexOf('<!-- __THE_BULLET_LANDS__ (SOUNDS 10/24, rule 120) -->'), b = s.indexOf('<!-- /__THE_BULLET_LANDS__ -->');
    const blk = a >= 0 && b > a ? s.slice(a, b) : '';
    leg(blk && eng.every(e => blk.indexOf(e) >= 0) && /window\.BULLET = BOH_BULLET_LANDS\.make/.test(blk)
      && /_bl = window\.BULLET \? BULLET\.heard\(d\) : null;/.test(s) && /window\.__sfxOut = function\(\)\{ try\{ MUS\.audio\(\);/.test(s) && /window\.__sfxCounted = function\(n\)\{ SFX_COUNT \+= \(n\|0\); \};/.test(s),
      '*** THE GAME CARRIES IT *** (' + path.basename(f) + '): both engines inlined byte for byte, the fight\'s sound line asks BULLET first, the effects bus hook inside playSFX', blk ? blk.length + ' bytes' : 'no block');
  }
  if (process.argv.includes('--fast')) return done();

  /* ---------------- 9: the real surface ---------------- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  const ARM = `(function(){ if (!/BOHEMIA_FIGHT/.test(location.href)) return; let fo;
    Object.defineProperty(window, 'FIGHT_OPTS', { configurable: true, get: function () { return fo; }, set: function (v) { fo = v ? Object.assign({}, v, { seed: 7 }) : v; } }); })();`;
  let d;
  try { d = await drive.open({ keepCards: true, arm: ARM, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { leg(false, 'the demo boots', String(e.message).slice(0, 160)); return done(); }
  const p = d.page; const perr = []; p.on('pageerror', e => perr.push(String(e.message)));
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && MUS.AC && MUS.AC.state === 'running' && window.BULLET, null, { timeout: 30000 });
    await p.evaluate(() => { const L = window.__BL = { sfx: {}, before: 0 };
      addEventListener('message', ev => { const m = ev.data; if (!m || m.type !== 'BOHEMIA_SFX') return; L.sfx[m.ev] = (L.sfx[m.ev] || 0) + 1; if (!BULLET.ready()) L.before++; }); });
    await d.fr.evaluate(() => { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 7 }); });
    let f = null;
    for (let i = 0; i < 300 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
      if (c && await c.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) throw new Error('the road fight never came up');
    await p.waitForFunction(() => BULLET.ready(), null, { timeout: 60000 });
    await f.evaluate(() => { FIGHT_UI.auto = true; });
    let over = false;
    for (let i = 0; i < 360 && !over; i++) { over = await f.evaluate(() => !!FIGHT.S.over).catch(() => true); if (!over) await p.waitForTimeout(500); }
    await p.waitForTimeout(1500);
    const S = await p.evaluate(() => ({ L: window.__BL, count: BULLET.count, turn: BULLET.turn, sides: BULLET.sides, err: BULLET.err,
      guns: BULLET.log.filter(l => l.gun).length, voices: BULLET.log.filter(l => l.voice).map(l => l.voice), dropped: BULLET.log.filter(l => l.dropped).length }));
    const shots = S.L.sfx.shot || 0, lands = S.voices.filter(v => /^(flesh|armour|ground|pellets|crack|cover|ricochet|bone|down)_?/.test(v)).length;
    const heardGuns = S.guns, voicesSeen = Array.from(new Set(S.voices)).sort();
    leg(over && shots > 0 && heardGuns >= Math.ceil((shots - S.L.before) * 0.6) && lands > 0 && S.turn && (S.sides.you || S.sides.them) && !S.err,
      '*** HE HEARS IT IN HIS NEXT FIGHT ***: the demo\'s road fight on AUTO: its shots as real guns, its bullets landing as real landings, the turn and the roster reached the player',
      'fight over ' + over + '; the fight posted ' + JSON.stringify(S.L.sfx) + ' (' + S.L.before + ' before the sprites were in); real guns ' + heardGuns + ' of ' + shots + ' shots; landings ' + lands + ' ' + JSON.stringify(voicesSeen) + '; turn ' + S.turn + ' sides ' + JSON.stringify(S.sides) + '; dropped ' + S.dropped);
  } catch (e) { leg(false, 'the demo\'s fight ran', String(e.message).slice(0, 220)); }
  leg(!perr.length, 'nothing threw in the demo', perr.slice(0, 2).join(' | '));
  await d.close();
  done();
})();

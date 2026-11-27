#!/usr/bin/env node
/* BOHEMIA -- BOSSES, rule 480(b) and (c) (Paolo 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps
   is never choppy for nothing'; the coordinator's routine 'BOSSES: rule 480': 'before act two, make every boss already built fully baked:
   each found by its sign, each fight plays start to LEAVE, each changes the map as it should, no boss shown off the map's edge... every
   boss fight holds its frames on a slowed phone (390x844, CPU slowed 4x)').

   THE WHOLE LADDER, WALKED FOR REAL, IN ONE NEW GAME. Every boss gate before this one reached its own boss by felling the ones before him
   through the map's own fell() (about forty minutes a way for the 19th); EYES could never reach the later ones (records/BOHEMIA_EYES_
   WALK_THE_11_21_BUILDS_11_21_26.md: THE MIDWIFE NOT REACHED). This walk takes none of that shortcut: for each live boss, in the ladder's
   order, it
     S  waits for his sign to turn up on the map and walks to it; answers his asker's card and his thing's card by a real tap
     F  walks to his place; his card; ENGAGE by a real tap; the fight on AUTO by a real tap, to its end; the spoils; LEAVE by a real tap
        (a boss you MEET, THE MIDWIFE, is the walk to her house: no card asks for a fight)
     M  his fall plays his change on the map (the beat on the tape with its pieces, the after card's line of what changed, his thing in
        your hand); his card answered by a real tap
     E  through his beat's hold, his place is ON THE GLASS (the map's own iso() on the origin the map hands this lane's draw), never off
        the map's edge, and nothing of his is drawn as a pointer at the glass's edge
     R  frames: from ENGAGE to LEAVE (the fight) and from LEAVE to his card (the beat), with the CPU slowed 4 times on a 390 x 844 phone
        (Chrome's own throttle, the one PLUMBER's SMOOTH IS A BUDGET uses), the page's own BohemiaFrameMeter, and every long frame's
        scripts by file and function (Chrome's long-animation-frame entries), so a hitch is named by the code that made it
   The checker steps in only where it says so (an AUTO fight not over in its patience is ended for the walk to go on, and says it).

   node tools/bohemia_bosses_the_whole_ladder_11_26_26.js [profile[:alpha]] [outdir]
   env LADDER_THROTTLE=4 (the slowed phone; 1 to measure the box unslowed), LADDER_ONLY="THE POT,THE TAP" (a part of the ladder: the ones
   before it fall the quick way and say so), LADDER_PATIENCE=600 (seconds an AUTO fight may take on the slowed phone), LADDER_REST=24
   (hours the crew rests between bosses on the map's own clock; 0, the default, walks them back to back with no rest).
*/
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));

const arg = (process.argv[2] || 'phone_portrait').split(':');
const PROF = arg[0], ALPHA = arg[1] === 'alpha';
const OUT = path.resolve(ROOT, process.argv[3] || ('records/target/bosses_the_whole_ladder_11_26/' + PROF + (ALPHA ? '_alpha' : '')));
const THR = +(process.env.LADDER_THROTTLE || 4);
const ONLY = (process.env.LADDER_ONLY || '').split(',').map(s => s.trim()).filter(Boolean);
const PATIENCE = +(process.env.LADDER_PATIENCE || 600);
const REST = +(process.env.LADDER_REST || 0);
const SHOTS = process.env.LADDER_SHOTS === '1';
const SPEED = +(process.env.LADDER_SPEED || 1);   /* the fight's own speed button tapped up to this (a player in a hurry); the frames walk keeps 1 */   /* a picture at each step (the sign, his asker, his card, the fight's open, his fall, his beat) */   /* hours the crew rests after each boss (the map's own clock, advance()), the way a player would */
fs.mkdirSync(OUT, { recursive: true });
const LOG = path.join(OUT, 'ladder.jsonl');
fs.writeFileSync(LOG, '');
const out = (o) => { fs.appendFileSync(LOG, JSON.stringify(o) + '\n'); };
const say = (s) => console.log(s);

(async () => {
  say('THE WHOLE LADDER, WALKED FOR REAL (' + PROF + (ALPHA ? ', the alpha' : ', the demo') + ', CPU slowed ' + THR + 'x in the fights)');
  const d = await open({ profile: PROF, fog: true, alpha: ALPHA });
  const fr = d.fr, page = d.page, cdp = d.cdp;
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140) + ' AT ' + String(e.stack || '').split('\n').slice(1, 3).map(l => l.trim().replace(/https?:\/\/[^/]+\//g, '')).join(' < ')));
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 120; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });

  /* the meter and the long frames, on the top page (the map, the fight and the spoils are its same-origin frames: one main thread) */
  await page.evaluate(() => { try { BohemiaFrameMeter.start(); } catch (e) {}
    const L = window.__LADDER_LOAF = [];
    try { new PerformanceObserver((list) => { for (const e of list.getEntries()) L.push({ t: e.startTime, d: e.duration, block: e.blockingDuration,
        s: (e.scripts || []).map(s => ({ f: String(s.sourceURL || '').split('/').pop().split('?')[0] || s.invoker || '?', fn: s.sourceFunctionName || s.invoker || '', d: Math.round(s.duration), w: s.windowAttribution })) }); })
        .observe({ type: 'long-animation-frame', buffered: true }); window.__LADDER_LOAF_ON = true; } catch (e) { window.__LADDER_LOAF_ON = String(e); } });
  const NOW = () => page.evaluate(() => performance.now());
  const READ = async (a, b) => page.evaluate(([a, b]) => { const r = BohemiaFrameMeter.read(a, b);
      const loaf = (window.__LADDER_LOAF || []).filter(x => x.t >= a && x.t <= b), by = {};
      loaf.forEach(x => x.s.forEach(s => { const k = s.f + (s.fn ? ':' + s.fn : ''); by[k] = (by[k] || 0) + s.d; }));
      r.loaf = loaf.length; r.loafMax = Math.round(Math.max.apply(null, [0].concat(loaf.map(x => x.d))));
      r.blame = Object.keys(by).map(k => [k, by[k]]).sort((p, q) => q[1] - p[1]).slice(0, 6);
      r.top = loaf.slice().sort((p, q) => q.d - p.d).slice(0, 3).map(x => ({ d: Math.round(x.d), at: Math.round(x.t - a), s: x.s.slice().sort((p, q) => q.d - p.d).slice(0, 3).map(s => s.f + (s.fn ? ':' + s.fn : '') + ' ' + s.d) }));
      r.mine = Object.keys(by).filter(k => /bohemia_bosses\.js|bohemia_his_map\.js/.test(k)).map(k => [k, by[k]]).sort((p, q) => q[1] - p[1]).slice(0, 4);
      return r; }, [a, b]);
  const over50 = (a, b) => page.evaluate(([a, b]) => (window.__LADDER_RAF || []).filter(x => x[0] >= a && x[0] <= b && x[1] > 50).length, [a, b]);
  await page.evaluate(() => { const R = window.__LADDER_RAF = []; let p = performance.now(); (function f(now) { R.push([now, now - p]); p = now; if (R.length > 400000) R.splice(0, 100000); requestAnimationFrame(f); })(p); });
  const throttle = async (r) => { try { await cdp.send('Emulation.setCPUThrottlingRate', { rate: r }); } catch (e) { say('  (no throttle: ' + e.message + ')'); } };

  /* his place on the glass: the origin the map hands this lane's draw, kept each frame */
  await fr.evaluate(() => { const B = BohemiaBosses, D0 = B.draw; if (D0 && !B.__ladderWrapped) { B.draw = function (ox, oy) { window.__LADDER_O = [ox, oy]; return D0.apply(this, arguments); }; B.__ladderWrapped = true; } });
  /* his place on the glass through the hold, read inside the very draw that paints it (the origin the map hands this lane's draw that
     frame; read from another frame's callback it can be a frame old, mid-glide, on a slow phone) */
  await fr.evaluate(() => { const H = window.__LADDER_HOLD = {}, B = BohemiaBosses, D1 = B.draw;
    B.draw = function (ox, oy) { const out = D1.apply(this, arguments);
      try { const b = window.__BOSS_BEAT; if (b && !b.done && !H[b.n] && b.phases[b.phases.length - 1] === 'hold') { const f = BohemiaHisMap.state().boss.found[b.n];
          const x = b.at ? b.at[0] : f.x, y = b.at ? b.at[1] : f.y, p = iso(x, y, ox, oy), W = typeof CVW !== 'undefined' ? CVW : innerWidth, Hh = typeof CVH !== 'undefined' ? CVH : innerHeight, gy = p.sy + TH / 2;
          H[b.n] = { at: [x, y], found: [f.x, f.y], sx: Math.round(p.sx), sy: Math.round(gy), W: Math.round(W), H: Math.round(Hh), on: p.sx >= 0 && p.sx <= W && gy >= 0 && gy <= Hh, n: om.n, cam: b.cam || null }; } } catch (e) {}
      return out; }; });
  const onGlass = (n) => fr.evaluate((n) => { const f = BohemiaHisMap.state().boss.found[n], O = window.__LADDER_O; if (!f || !O) return null;
      const x = f.bx != null ? f.bx : f.x, y = f.by != null ? f.by : f.y, p = iso(x, y, O[0], O[1]), W = typeof CVW !== 'undefined' ? CVW : innerWidth, H = typeof CVH !== 'undefined' ? CVH : innerHeight;
      return { at: [x, y], sx: Math.round(p.sx), sy: Math.round(p.sy + TH / 2), W: Math.round(W), H: Math.round(H), on: p.sx >= 0 && p.sx <= W && p.sy + TH / 2 >= 0 && p.sy + TH / 2 <= H, n: om.n }; }, n).catch(e => ({ err: String(e) }));

  const bossCard = async (kind, n, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, n]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  const pressCard = async (i) => { await page.waitForTimeout(700); const h = await fr.$('#roadcard button[data-road="' + i + '"]'); if (!h) return false;
    await h.evaluate((b) => { const r = b.getBoundingClientRect(), c = b.closest('.rc'), cr = c ? c.getBoundingClientRect() : { bottom: innerHeight }; if (r.bottom > Math.min(innerHeight, cr.bottom) + 1) b.scrollIntoView({ block: 'nearest' }); }).catch(() => {});
    return tapEl(h); };
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const toMap = async () => { if (await fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE && !(document.getElementById('settleFrame') && document.getElementById('settleFrame').style.display === 'block')) { swapMode(); return true; } } catch (e) {} return false; }).catch(() => false)) await page.waitForTimeout(1500); };
  const leaveTown = async () => { for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await page.waitForTimeout(1300); }
    await toMap(); };
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await leaveTown();
  /* a meet card that is not a boss's (a roaming crew, a road fight): he falls back, the way a stranger on his way to a boss would */
  const guard = setInterval(() => { fr.evaluate(() => { window.__BOSSES_TALK = true;
    try { if (MEET.up && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, rumours: B.rumours, day: T.day, min: T.min })); });
  const settle = async () => { for (let i = 0; i < 200; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard') || (MEET && MEET.up)).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  const ROWS = await fr.evaluate(() => JSON.parse(JSON.stringify(BohemiaBosses.data().bosses)));
  const LIVE = ROWS.map(r => r.n);
  const ORDER = (await fr.evaluate(() => BohemiaHisMap.data().bosses.map(b => b.n))).filter(n => LIVE.indexOf(n) >= 0);
  const QUIET = ROWS.filter(r => r.quiet).map(r => r.n);
  const anyCard = () => fr.evaluate(() => window.__BOSS_CARD && document.getElementById('roadcard') ? window.__BOSS_CARD.kind + '|' + window.__BOSS_CARD.n : null).catch(() => null);
  /* a card of a boss already met (his after card owed, a rumour's thing) is answered the way a stranger would: its first button */
  const clearCards = async (keep) => { for (let k = 0; k < 6; k++) { const c = await anyCard(); if (!c) return; const kind = c.split('|')[0], n = c.split('|')[1];
      if (n === keep) return; await pressCard(kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); } };
  const waitSign = async (n) => { let s = null; for (let i = 0; i < 200; i++) { await page.waitForTimeout(500); s = await st();
      if ((s.boss.sign && s.boss.sign.n === n && (s.rumours[n] || QUIET.indexOf(n) >= 0)) || s.boss.found[n]) return { s, waited: i / 2 };
      if (i % 40 === 14 && !s.boss.sign) { const st2 = await fr.evaluate(() => { const h = [city.x, city.y], n = om.n; let best = null, bd = 1e9;
          for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 1)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && dd >= 3 && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }).catch(() => null);
        if (st2) { await go(st2); await settle(); } } } return { s, waited: null }; };
  const crew = () => fr.evaluate(() => { try { const C = (typeof ctCrew === 'function' ? ctCrew() : null) || (window.BohemiaCompany && BohemiaCompany.men ? BohemiaCompany.men() : null); return C ? C.length : null; } catch (e) { return null; } }).catch(() => null);

  const quick = async (n) => {   /* LADDER_ONLY: the ones before the part asked for fall the quick way (the map's own fell()), and say so */
    const w = await waitSign(n); let s = w.s;
    /* three tries to stand on his sign, the way the walked path does (MEASURED 11/27: THE CLIMB's flyer, one try, the crew stopped short
       twice in four runs and the whole part failed with nobody walked) */
    for (let k = 0; k < 3; k++) { s = await st(); if (!(s.boss.sign && s.boss.sign.n === n && !s.boss.found[n])) break; await go([s.boss.sign.x, s.boss.sign.y]); await settle(); await clearCards(n); }
    const th = await bossCard('thing', n, 8000); if (th) await pressCard(1); await clearCards(); s = await st(); if (!s.boss.found[n]) return false;
    await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, n); const af = await bossCard('after', n, 30000); if (af) await pressCard(0); await page.waitForTimeout(2500); await clearCards(); s = await st(); return !!s.boss.fallen[n]; };

  const snap = async (n, step) => { if (!SHOTS) return; try { await page.screenshot({ path: path.join(OUT, String(ORDER.indexOf(n) + 1).padStart(2, '0') + '_' + step + '.png'), scale: 'css' }); } catch (e) {} };
  const sum = [];
  for (const n of ORDER) {
    const row = ROWS.filter(r => r.n === n)[0];
    if (ONLY.length && ONLY.every(x => sum.some(r => r.n === x))) break;
    if (ONLY.length && ONLY.indexOf(n) < 0) { const q = await quick(n); out({ n, quick: q }); say('  ' + n + ': fell the quick way (' + q + '), not walked'); if (!q) break; continue; }
    const R = { n, meet: !!row.meet, errs0: errs.length };
    const t0 = Date.now();
    /* S: his sign */
    const w = await waitSign(n); let s = w.s; R.signAfter = w.waited; R.sign = s.boss.sign && s.boss.sign.n === n ? { kind: s.boss.sign.kind, at: [s.boss.sign.x, s.boss.sign.y] } : (s.boss.found[n] ? 'found already' : null);
    await snap(n, 'a_sign');
    /* the camera leads to his place the moment his sign is read (__THE_SIGN_LEADS_TO_HIM__): watched from a timer while the walk goes on */
    let leadShot = false; const leadWatch = SHOTS ? setInterval(async () => { if (leadShot) return; try { const lc = await fr.evaluate((n) => { const c = window.__BOSS_LEAD_CAM; return c && c.n === n && !c.done ? c.phases.slice(-1)[0] : null; }, n);
        if (lc === 'hold') { leadShot = true; await snap(n, 'b2_the_sign_leads_to_him'); } } catch (e) {} }, 250) : null;
    await clearCards(n);
    for (let k = 0; k < 3; k++) { s = await st(); if (!(s.boss.sign && s.boss.sign.n === n && !s.boss.found[n])) break; await go([s.boss.sign.x, s.boss.sign.y]); await settle(); await clearCards(n); }
    const ak = row.quiet ? null : await bossCard('asker', n, 20000);
    if (ak) { await snap(n, 'b_asker'); await pressCard(0); const ay = await bossCard('asker_yes', n, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
    if (leadWatch) clearInterval(leadWatch);
    R.leadCam = await fr.evaluate((n) => { const c = window.__BOSS_LEAD_CAM; return c && c.n === n ? c.phases.join('>') : null; }, n).catch(() => null);
    R.leadMiss = await fr.evaluate(() => (BohemiaBosses.last() || {}).leadMiss || null).catch(() => null);
    const th = await bossCard('thing', n, 12000); if (th) await pressCard(1);
    await page.waitForTimeout(800); await clearCards(n);
    s = await st(); R.found = !!s.boss.found[n]; R.asker = row.quiet ? 'quiet (rule 454(a))' : !!ak; R.thing = !!th;
    if (!R.found) { R.fail = 'not found by his sign'; out(R); sum.push(R); say('  ' + n + ': NOT FOUND by his sign'); break; }
    const f = s.boss.found[n];
    /* F: his place, his fight (or the meeting), to LEAVE */
    await go([f.x, f.y]); let meet = false, metAlready = false;
    for (let i = 0; i < 300 && !meet && !metAlready; i++) { await page.waitForTimeout(500); await leaveTown();
      meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (row.meet) metAlready = !!(await st()).boss.fallen[n];
      if (!meet && !metAlready && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => true)) await go([f.x, f.y]); }
    await throttle(THR);
    let a = await NOW(), fightM = null, beatM = null, lv = null;
    R.card = meet;
    if (row.meet) { R.fight = metAlready ? 'met, never fought (no card asked for one)' : (meet ? 'A FIGHT CARD for a boss you meet' : 'not met'); lv = await NOW(); }
    else if (meet) {
      await page.waitForTimeout(1200); await snap(n, 'c_his_card'); a = await NOW(); await tapEl(await fr.$('#meetcard button[data-meet="go"]'));
      let ff = null; for (let i = 0; i < 240 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
        if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
      R.board = !!ff; let res = null;
      if (ff) {
        R.him = await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.side === 'them' && u.boss)[0]; return u ? u.name : null; }).catch(() => null);
        R.us0 = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side !== 'them').length).catch(() => null);
        R.them0 = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').length).catch(() => null);
        await snap(n, 'd_fight_open');
        for (let i = 0; i < 80; i++) { const en = await ff.evaluate(() => !!(window.__BOSS_ENTRANCE && window.__BOSS_ENTRANCE.entrance)).catch(() => false); if (en) { await page.waitForTimeout(800);
            R.cardSeen = await ff.evaluate(() => { const c = document.querySelector('#bossentrance .be-card'), fe = window.frameElement; if (!c) return { card: false };
              const r = c.getBoundingClientRect(), cs = getComputedStyle(c), fr = fe ? fe.getBoundingClientRect() : { left: 0, top: 0 }, fcs = fe ? window.parent.getComputedStyle(fe) : null;
              const top = fe ? window.parent.document.elementFromPoint(fr.left + r.left + r.width / 2, fr.top + r.top + r.height / 2) : null;
              return { card: true, op: cs.opacity, box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], frame: fcs ? [fcs.display, fcs.visibility, fcs.opacity, fcs.zIndex] : null,
                top: top ? (top.id || top.tagName) : null, vis: document.visibilityState }; }).catch(e => ({ err: String(e) }));
            await snap(n, 'e_his_entrance'); break; } await page.waitForTimeout(200); }
        R.entrance = await ff.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_ENTRANCE || null))).catch(() => null);
        R.layer = await ff.evaluate(() => { const L = document.getElementById('bossentrance'); return L ? { pe: getComputedStyle(L).pointerEvents, kids: L.children.length } : null; }).catch(() => null);
        R.bossWeapon = await ff.evaluate(() => FIGHT.S.boss ? FIGHT.S.boss.weapon : null).catch(() => null);
        const ft0 = Date.now(); await tapEl(await ff.$('#bauto'));
        for (let k = 0; k < 4 && SPEED > 1; k++) { const hs = await ff.evaluate(() => UI.hand || 1).catch(() => 1); if (hs >= SPEED) break; await tapEl(await ff.$('#bspeed')); await page.waitForTimeout(300); }
        let shotHalf = false, shotDown = false;
        for (let i = 0; i < PATIENCE * 2 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
          if (SHOTS && (!shotHalf || !shotDown)) { const hb = await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.boss)[0]; return u ? { f: u.hp / (u.hpMax || u.hp || 1), dead: !!u.dead } : null; }).catch(() => null);
            if (hb && !shotHalf && hb.f <= 0.5) { shotHalf = true; await page.waitForTimeout(300); await snap(n, 'f_his_moment'); }
            if (hb && !shotDown && hb.dead) { shotDown = true; await page.waitForTimeout(200); await snap(n, 'g_his_fall'); } }
          if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
        R.fightS = Math.round((Date.now() - ft0) / 1000); R.auto = res || 'not over in ' + PATIENCE + ' s';
        R.usLeft = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side !== 'them' && !u.dead).length).catch(() => null);
        if (res !== 'won') { R.checker = 'the checker ended it as won (AUTO: ' + R.auto + ') so the walk goes on';
          await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
        await page.waitForTimeout(1200);   /* his fall on the glass (the checker's end too) before the spoils come */
        R.shown = await ff.evaluate(() => (window.__BOSS_ENTRANCE && window.__BOSS_ENTRANCE.shown || []).map(x => x.k).join('>')).catch(() => null);
        R.entranceEnd = await ff.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_ENTRANCE || null))).catch(() => null);
        for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
        await page.waitForTimeout(1500);
        let left = false; for (let k = 0; k < 6 && !left; k++) { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } else await page.waitForTimeout(800); }
        await page.waitForTimeout(800); lv = await NOW();
        R.leave = left ? 'LEAVE tapped' : 'no LEAVE on the screen';
        if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) { await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} }); R.leave += ' (the spoils left by the checker)'; }
        fightM = await READ(a, lv); fightM.over50 = await over50(a, lv);
      }
    }
    /* M + E: his fall, his beat (his place on the glass through its hold), his card */
    let hold = null, beatSeen = [], bt = null;
    for (let i = 0; i < 240; i++) { await page.waitForTimeout(250);
      bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
      if (bt && bt.n === n) beatSeen = bt.phases.slice();
      if (await anyCard() === 'after|' + n) break; }
    hold = await fr.evaluate((n) => (window.__LADDER_HOLD || {})[n] || null, n).catch(() => null);
    try { await page.screenshot({ path: path.join(OUT, String(ORDER.indexOf(n) + 1).padStart(2, '0') + '_' + n.replace(/\W+/g, '_') + '_card.png'), scale: 'css' }); } catch (e) {}
    const af = await bossCard('after', n, 60000); const b2 = await NOW();
    if (hold && SHOTS) {} 
    beatM = await READ(lv || a, b2); beatM.over50 = await over50(lv || a, b2);
    await throttle(1);
    for (let i = 0; i < 15 && af; i++) { if (await fr.evaluate(() => document.querySelectorAll('#roadcard .rcground').length).catch(() => 0)) break; await page.waitForTimeout(200); }   /* his card's lines are laid a moment after it */
    R.cardLines = await fr.evaluate(() => [].slice.call(document.querySelectorAll('#roadcard .rcground')).map(x => x.textContent)).catch(() => null);
    R.cardText = await fr.evaluate(() => { const c = document.getElementById('roadcard'); return c ? c.innerText.replace(/\s+/g, ' ').slice(0, 400) : null; }).catch(e => String(e));
    if (af) await pressCard(0);
    await page.waitForTimeout(1500); await clearCards();
    s = await st();
    const onTape = bt && bt.n === n ? Object.keys(bt).filter(k => typeof bt[k] === 'number' && !/^(started|done)$/.test(k)).reduce((t, k) => t + (bt[k] | 0), 0) : 0;
    R.fallen = !!s.boss.fallen[n]; R.did = s.boss.fallen[n] ? s.boss.fallen[n].did : null; R.verb = !!(row.verb && s.verbs[row.verb.id]);
    R.beat = beatSeen.join('>') || 'none'; R.onTape = onTape;
    R.afterCard = af ? { head: af.head, hand: af.hand ? af.hand.name : null, ground: af.ground || null, text: af.text } : null;
    R.hold = hold;
    R.crew = await crew();
    R.lair = await fr.evaluate((n) => { try { return BohemiaBosses.lair(n); } catch (e) { return null; } }, n).catch(() => null);
    R.cardLines = await fr.evaluate(() => [].slice.call(document.querySelectorAll('#roadcard .rcground')).map(x => x.textContent)).catch(() => null);
    R.frames = { fight: fightM, beat: beatM };
    R.errs = errs.slice(R.errs0); delete R.errs0;
    R.minutes = +((Date.now() - t0) / 60000).toFixed(1); R.gameDay = s.day;
    R.ok = { S: R.found, F: row.meet ? /^met, never fought/.test(R.fight) : (R.board && /LEAVE tapped/.test(R.leave || '')), M: R.fallen && R.verb && !!R.afterCard && (row.meet || onTape >= 1), E: !!(hold && hold.on) };
    out(R); sum.push(R);
    const fm = (m) => m ? m.fps + ' fps, worst ' + m.max + ' ms, ' + m.over50 + ' over 50 ms, longest frame ' + m.loafMax + ' ms' + (m.mine && m.mine.length ? ', this lane: ' + m.mine.map(x => x[0] + ' ' + x[1] + ' ms').join(', ') : '') : 'n/a';
    say('  ' + n + ': S ' + R.ok.S + ' (sign after ' + R.signAfter + ' s) | F ' + R.ok.F + ' (' + (row.meet ? R.fight : 'AUTO ' + R.auto + ' in ' + R.fightS + ' s, ' + R.usLeft + '/' + R.us0 + ' of ours standing' + (R.checker ? ', CHECKER' : '')) + ') | M ' + R.ok.M + ' (' + R.beat + ', ' + onTape + ' on the tape, "' + (R.afterCard ? R.afterCard.ground : '') + '") | E ' + R.ok.E + ' ' + JSON.stringify(hold && [hold.sx, hold.sy, hold.W, hold.H]) + ' | ' + R.minutes + ' min, ' + R.errs.length + ' errors');
    say('      fight: ' + fm(fightM) + '\n      beat:  ' + fm(beatM));
    const tops = (m) => m && m.top ? m.top.map(x => x.d + ' ms at +' + x.at + ' ms [' + x.s.join('; ') + ']').join(' | ') : '';
    say('      longest in the fight: ' + tops(fightM) + '\n      longest in the beat:  ' + tops(beatM));
    if (!R.fallen) { say('  the ladder stops at ' + n + ': he did not fall'); break; }
    if (REST > 0) await fr.evaluate((h) => { try { advance(h * 60); render(); } catch (e) {} }, REST);
  }
  clearInterval(guard);
  const S4 = sum.filter(r => r.ok);
  say('\nTHE WHOLE LADDER: ' + S4.length + ' walked; S ' + S4.filter(r => r.ok.S).length + ', F ' + S4.filter(r => r.ok.F).length + ', M ' + S4.filter(r => r.ok.M).length + ', E ' + S4.filter(r => r.ok.E).length + '; checker in ' + S4.filter(r => r.checker).length + '; page errors ' + errs.length);
  fs.writeFileSync(path.join(OUT, 'errors.txt'), errs.join('\n'));
  await d.close();
  process.exit(0);
})().catch(e => { console.log('THE WALK BROKE: ' + (e && e.stack || e)); process.exit(1); });

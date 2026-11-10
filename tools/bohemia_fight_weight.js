/* THE FIGHT'S WEIGHT -- the measure (MOTION 3, 11/10/26, rule 443(e) and 441; the coordinator's brief: 'measure on the real page first
   which of these read and which do not: a hit, a block on a shield, a miss, a kill, a man struck down, a shot, a reload; then make
   each read on the beat ... at no frame cost on a cheap phone, AUTO at 4x still clear').
   A fight on the demo as he plays it (a road fight off the town, his line set, AUTO by a real tap at 1x or 4x), and for every blow
   and note the fight presents (its own startAnim), every frame the page draws while it plays out: the man it lands on (or the man
   who acts, for a shot and a reload) as the fight draws him (THE PUNCH's knock and white, the dodge, the hit flash, his clip and
   key, the reload in his hands, the fall), the glass's kick (KICK), and every sound the fight asked for (its sfx).
     const W = require('./tools/bohemia_fight_weight.js');
     const r = await W.measure(d, { speed: 4, ms: 40000, fam: '^suburb$', cpu: 4 })   d = tools/bohemia_drive_the_demo.js open()
     r.kinds: { hit, block, miss, kill, down, shot, reload }: each { n, read (share that reads), body, glass, sound, frames (median) }
   A BLOW READS when the man it is about shows ITS OWN read on the glass for 2 drawn frames or 100 ms of screen time (READ below: a hit his white, his
   knock or his hit key; a block his shield up, never a sidestep; a miss the sidestep; a kill or a man struck down the fall; a shot the
   aim; a reload the reload in his hands) AND its own sound is asked for inside its beat; the glass's answer is counted beside it.
   node tools/bohemia_fight_weight.js [--speed 1|4] [--ms 40000] [--fam suburb] [--cpu 4] [--json out.json]
   node tools/bohemia_fight_weight.js --stage [--speed 4] [--cpu 4] [--off]   one block on a shield and one shot, staged (stage below) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

const SAMPLER = function () {
  if (window.__FW) return true;
  const F = window.__FW = { anims: [], frames: 0, snd: [], t0: performance.now(), dt: [] };
  const sa = window.startAnim, sf = window.sfx;
  window.startAnim = function (a) {
    try { const e = (a && a.e) || {}, u = FIGHT.byId(e.id), t = FIGHT.byId(e.to), now = performance.now();
      const ranged = a.k === 'attack' && u ? (e.shot === undefined ? FIGHT.isRanged(u.weapon) : !!e.shot) : false;
      const kinds = [];
      if (a.k === 'attack' && t) { kinds.push(e.hit ? 'hit' : (t.shield && !ranged ? 'block' : 'miss')); if (ranged && FIGHT.isGun(u.weapon)) kinds.push('shot'); }
      if (a.k === 'note' && (e.t === 'dead' || e.t === 'down' || e.t === 'reload')) kinds.push(e.t === 'dead' ? 'kill' : e.t);
      kinds.forEach(function (k) { F.anims.push({ kind: k, at: a.at === undefined ? now : a.at, B: beatMs(), who: (k === 'shot' || k === 'reload' || a.k === 'note') ? e.id : e.to, by: e.id,
        seen: true, f: 0, body: 0, glass: 0, sound: [], maxKnock: 0, keys: {}, ch: {}, ms: {} }); });
    } catch (x) {}
    return sa.apply(this, arguments);
  };
  window.sfx = function (ev) { try { F.snd.push([performance.now(), ev]); } catch (x) {} return sf.apply(this, arguments); };
  let last = performance.now();
  const tick = function () {
    const now = performance.now(); F.lastDraw = now; F.frames++; F.dt.push(now - last); last = now; if (F.dt.length > 4000) F.dt.shift();
    let K = { x: 0, y: 0 }; try { K = eval('KICK'); } catch (x) {}
    const kick = Math.hypot(K.x || 0, K.y || 0), h = manH();
    F.anims.forEach(function (a) {
      /* what the last drawn frame showed stayed on the glass until this one: its screen time */
      if (a.prevCh) { const held = now - a.prevT; Object.keys(a.prevCh).forEach(function (k) { a.ms[k] = (a.ms[k] || 0) + held; }); a.prevCh = null; }
      const end = a.at + Math.max(a.B * (a.kind === 'kill' || a.kind === 'down' ? 1.6 : 1.4), 500);   /* half a second at least: a slowed phone's frame at 4x is longer than the beat */
      if (now < a.at - a.B * 0.1 || now > end) return;
      const v = FIGHT.byId(a.who); if (!v) return;
      const ch = {};   /* what of him the glass shows this frame, channel by channel */
      try { const kn = knockOf(v, h, now), m = Math.hypot(kn.x, kn.y); a.maxKnock = Math.max(a.maxKnock, m); if (m >= 2) ch.knock = 1; } catch (x) {}
      try { if (whiteOf(v, now)) ch.white = 1; } catch (x) {}
      try { if (Math.abs(dodgeLean(v, h, now)) >= 2) ch.lean = 1; } catch (x) {}
      try { if (hitFlash(v, now) > 0.05) ch.flash = 1; } catch (x) {}
      try { const p = poseOf(v, now), c = p && p.clip; if (c) a.keys[c + ':' + p.col] = 1;
        if (c === 'hit') ch.hitclip = 1; if (c === 'fall') ch.fall = 1;
        if (c === 'aim' || c === 'shoot' || c === 'fire') ch.aim = 1;
        if (v._reloadAt !== undefined && now >= v._reloadAt && now - v._reloadAt < beatMs() * 4 / 3) ch.reload = 1;
        if (v._md && now - v._md.at < 50 && v._md.sh && c === 'hit') ch.shield = 1; } catch (x) {}
      try { if (typeof weightOf === 'function') { const w = weightOf(v, now); if (w && w.block) ch.block = 1; if (w && w.flare) ch.flare = 1; } } catch (x) {}
      if (kick >= 0.5) ch.glass = 1;
      a.f++; Object.keys(ch).forEach(function (k) { a.ch[k] = (a.ch[k] || 0) + 1; }); a.prevCh = ch; a.prevT = now;
      if (ch.knock || ch.white || ch.lean || ch.flash || ch.hitclip || ch.fall || ch.reload || ch.block || ch.aim) a.body++; if (ch.glass) a.glass++;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  return true;
};

/* what makes each one READ: its own body channel for 2 drawn frames or more, its own sound, and never another kind's read (a block that
   sidesteps is a dodge, not a block) */
/* SEEN: a read is on the glass for two drawn frames, or for SEEN_MS of screen time (a slowed phone at 4x draws a blow's beat in one or
   two frames, and one frame left up 140 ms is seen) */
const SEEN_MS = 100;
function seen(a, c) { return (a.ch[c] || 0) >= 2 || ((a.ms || {})[c] || 0) >= SEEN_MS; }
const READ = {
  hit:    { body: ['white', 'knock', 'hitclip'], sound: ['hit', 'melee_hit', 'vital', 'hurt'] },
  block:  { body: ['block', 'shield'], sound: ['block'], not: ['lean'] },
  miss:   { body: ['lean'], sound: ['miss'] },
  kill:   { body: ['fall'], sound: ['kill', 'body_land'] },
  down:   { body: ['fall'], sound: ['went_down', 'body_land'] },
  shot:   { body: ['aim'], sound: ['shot'] },
  reload: { body: ['reload'], sound: ['mag_home'] }
};
async function fightIn(d, fam) {
  const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
  const p = d.page, fr = d.fr;
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { HUNT = null; } catch (_e) {} try { contactClear(); } catch (_e) {} });
  const at = await K.cellOf(fr, fam || '^suburb$'); if (!at) return null;
  await p.evaluate(([c, dd]) => { window.nfOpen({ type: 'BOHEMIA_CITY_ENCOUNTER', district: dd, at: { gx: c[0], gy: c[1] }, label: 'the fight\'s weight', draft: true }); }, [at.cell, at.district]);
  let ff = null;
  for (let i = 0; i < 300 && !ff; i++) { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) ff = c; if (!ff) await p.waitForTimeout(200); }
  if (!ff) return null;
  for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !window.NFC || NFC.state === 'off')) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(1000);
  return { ff, at };
}
async function measure(d, o) {
  o = o || {};
  const p = d.page, got = await fightIn(d, o.fam); if (!got) return { err: 'no fight' };
  const ff = got.ff, { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
  for (let k = 0; k < 3 && await ff.evaluate(() => FIGHT.S.deploy).catch(() => false); k++) { await fightPress(p, ff, 'bend', { ms: 8000 }).catch(() => {}); await p.waitForTimeout(1200); }
  if (o.arm) await ff.evaluate(o.arm).catch(() => {});
  await ff.evaluate(SAMPLER);
  let cdp = null; if (o.cpu > 1) { cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: o.cpu }); }
  await ff.evaluate((sp) => { FIGHT_UI.speed = sp; }, o.speed || 1);
  await fightPress(p, ff, 'bauto').catch(() => {});
  const t0 = Date.now();
  while (Date.now() - t0 < (o.ms || 40000)) { const ov = await ff.evaluate(() => FIGHT.S.over).catch(() => true); if (ov) break; await p.waitForTimeout(500); }
  await p.waitForTimeout(800);
  if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
  const raw = await ff.evaluate(() => { const F = window.__FW;
    F.anims.forEach(function (a) { const end = a.at + a.B * 1.6; a.sound = F.snd.filter(s => s[0] >= a.at - Math.max(a.B * 0.75, 400) && s[0] <= Math.max(end, a.at + 500)).map(s => s[1]); });   /* the fight sends a sound ahead by SONG.lat and a lead of up to three of its own frames */   /* a sound is sent ahead of its picture (SONG.lat) */
    const dt = F.dt.slice(5).sort((x, y) => x - y);
    return { anims: F.anims, frames: F.frames, fps: dt.length ? 1000 / dt[Math.floor(dt.length / 2)] : 0, worst: dt.length ? dt[dt.length - 1] : 0, over: FIGHT.S.over, result: FIGHT.S.result, round: FIGHT.S.round }; });
  const kinds = {};
  const med = (xs) => { const s = xs.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  Object.keys(READ).forEach(k => {
    const A = raw.anims.filter(a => a.kind === k && a.f > 0), n = A.length, R = READ[k];
    const bodyOk = (a) => R.body.some(c => seen(a, c)), soundOk = (a) => a.sound.some(x => R.sound.indexOf(x) >= 0);
    const reads = A.filter(a => bodyOk(a) && soundOk(a) && !(R.not || []).some(c => seen(a, c)));
    const chans = {}; A.forEach(a => Object.keys(a.ch).forEach(c => { (chans[c] = chans[c] || []).push(a.ch[c]); }));
    const chMed = {}; Object.keys(chans).forEach(c => { while (chans[c].length < n) chans[c].push(0); chMed[c] = med(chans[c]); });
    const msMed = {}; Object.keys(chans).forEach(c => { msMed[c] = Math.round(med(A.map(a => (a.ms || {})[c] || 0))); });
    kinds[k] = { n, read: n ? Math.round(reads.length / n * 100) : null, body: n ? Math.round(A.filter(bodyOk).length / n * 100) : null, glass: n ? Math.round(A.filter(a => a.glass >= 1).length / n * 100) : null,
      sound: n ? Math.round(A.filter(soundOk).length / n * 100) : null, frames: med(A.map(a => a.f)), ch: chMed, ms: msMed, knock: Math.round(med(A.map(a => a.maxKnock)) * 10) / 10,
      sounds: [...new Set([].concat.apply([], A.map(a => a.sound)))].slice(0, 8) };
  });
  return { at: got.at, speed: o.speed || 1, cpu: o.cpu || 1, fps: Math.round(raw.fps * 10) / 10, worst: Math.round(raw.worst), round: raw.round, over: raw.over, result: raw.result, kinds, n: raw.anims.length };
}
/* ONE OF EACH, STAGED ON THE REAL PAGE: the fight's own queue (UI.anim, played on the beat by its own presenter) handed the fight's
   own event shape on the board as it stands (deploy over, his turn waiting): a club blow that a man of theirs with a shield up takes on it, and a shot of his.
   Nothing in the rules runs (an event is a picture and a sound); the shield is data the armoury already has (a wooden one).
   stage(d, { speed, cpu, fam, off, film }) -> { block: {...}, shot: {...}, hit (film only) }: each its channels (drawn frames), its sounds, its tag, the
   clips the page drew (UI.clipSeen deltas), the frames' middle and worst; film: every drawn frame round the man as PNG. off: window.__FIGHT_WEIGHT_OFF first (the planted fail). */
async function stage(d, o) {
  o = o || {};
  const p = d.page, got = await fightIn(d, o.fam); if (!got) return { err: 'no fight' };
  const ff = got.ff, { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
  for (let k = 0; k < 3 && await ff.evaluate(() => FIGHT.S.deploy).catch(() => false); k++) { await fightPress(p, ff, 'bend', { ms: 8000 }).catch(() => {}); await p.waitForTimeout(1200); }
  const pick = await ff.evaluate((off) => {
    window.__FIGHT_WEIGHT_OFF = !!off;
    const S = FIGHT.S, on = (v) => FIGHT.onField(v) && !v.dead && !v.down;
    const you = S.units.filter(v => v.side === 'you' && on(v) && !v.beast && !v.machine), them = S.units.filter(v => v.side === 'them' && on(v) && !v.beast && !v.machine && !v.ghost);
    const near = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    let best = null; you.forEach(u => them.forEach(t => { const dd = near(u, t); if (!best || dd < best[2]) best = [u, t, dd]; }));
    if (!best) return null;
    const u = best[0], t = best[1], gunner = you.filter(v => FIGHT.isGun(v.weapon))[0] || S.units.filter(v => on(v) && FIGHT.isGun(v.weapon))[0] || null;
    const sh = eval('DB').armor.shields.filter(r => /^wooden_shield$|^heater_shield$|^old_wooden_shield$/.test(r.id))[0] || eval('DB').armor.shields[0];
    if (FIGHT._t.bothHands(t.weapon) || FIGHT.isGun(t.weapon) && t.weapon.hands !== 1) { const club = S.units.map(v => v.weapon).filter(w => w && !FIGHT.isRanged(w) && w.hands === 1)[0]; if (club) t.weapon = club; }
    t.shield = Object.assign({}, sh); t.shieldBack = null;
    return { u: u.id, t: t.id, g: gunner && gunner.id, gt: gunner ? (them.filter(v => v.id !== t.id)[0] || t).id : null, shield: sh.id, tw: t.weapon && t.weapon.id };
  }, !!o.off);
  if (!pick) return { err: 'nobody to stage' };
  await ff.evaluate(SAMPLER);
  let cdp = null; if (o.cpu > 1) { cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: o.cpu }); }
  await ff.evaluate((sp) => { FIGHT_UI.speed = sp; }, o.speed || 1);
  await p.waitForTimeout(3500);   /* his shield's pictures in, the frame clock settled */
  const one = async (kind, ev) => {
    await ff.evaluate(() => { window.__FW.anims = []; window.__FW.snd = []; window.__FW.cs0 = Object.assign({}, FIGHT_UI.clipSeen || {}); window.__FW.tags = [];
      const el = document.getElementById('num'); if (window.__FW.tagObs) window.__FW.tagObs.disconnect();
      window.__FW.tagObs = new MutationObserver(() => { window.__FW.tags.push(el.textContent); });   /* what the tag was set to (on a slowed box at 4x its own beat can hide it before the mark lands) */
      if (el) window.__FW.tagObs.observe(el, { childList: true, characterData: true, subtree: true, attributes: true }); });
    /* on the fight's own queue, so it starts on the beat and the man who acts is posed by the fight itself (his swing, his aim) */
    await ff.evaluate(([ev, film, who]) => { window.__FW.film = [];
      if (film) {   /* every frame the page draws round the man, cut where he stood before it (so the glass's kick shows as the picture moving) */
        const v = FIGHT.byId(who), cvs = document.getElementById('cv'), D = window.devicePixelRatio || 1, h = manH(), U = FIGHT_UI;
        const X = sx((dx(v) + .5) * U.tw), Y = sy((dy(v) + .9) * U.th) - U.th * riseAt(v.x, v.y), w = h * 2.6, hh = h * 1.7, t0 = performance.now();
        const grab = () => { const F = window.__FW; const c = document.createElement('canvas'); c.width = Math.round(w * D / 2); c.height = Math.round(hh * D / 2);
          c.getContext('2d').drawImage(cvs, (X - w / 2) * D, (Y - hh * .86) * D, w * D, hh * D, 0, 0, c.width, c.height); F.film.push([performance.now(), c]);
          if (performance.now() - t0 < 2600) requestAnimationFrame(grab); };
        requestAnimationFrame(grab); }
      FIGHT_UI.anim.push({ k: 'attack', e: ev, dur: beatMs() }); }, [ev, !!o.film, kind === 'shot' ? ev.id : ev.to]);
    await p.waitForTimeout(3000);
    return ff.evaluate((kind) => { const F = window.__FW; if (F.tagObs) F.tagObs.disconnect();
      const a = F.anims.filter(x => x.kind === kind)[0] || null, cs = FIGHT_UI.clipSeen || {}, d = {};
      Object.keys(cs).forEach(k => { const n = cs[k] - (F.cs0[k] || 0); if (n > 0 && /melee:|shield:|hold:|^hit$|^aim$|^fall$/.test(k)) d[k] = n; });
      const end = a ? a.at + a.B * 1.6 : 0;
      const dt = F.dt.slice(-60).sort((x, y) => x - y);
      return { seen: !!a, f: a ? a.f : 0, ch: a ? a.ch : {}, ms: a ? Object.fromEntries(Object.entries(a.ms || {}).map(q => [q[0], Math.round(q[1])])) : {}, sounds: a ? F.snd.filter(s => s[0] >= a.at - a.B * .75 && s[0] <= end).map(s => s[1]) : [],
        tags: [...new Set(F.tags)], clips: d, fmed: dt.length ? Math.round(dt[dt.length >> 1] * 10) / 10 : 0, fworst: dt.length ? Math.round(dt[dt.length - 1]) : 0,
        film: a ? (F.film || []).filter(q => q[0] >= a.at - 70 && q[0] <= a.at + a.B * 1.9).map(q => [Math.round(q[0] - a.at), q[1].toDataURL('image/png')]) : [] }; }, kind);
  };
  const out = { pick, speed: o.speed || 1, cpu: o.cpu || 1, off: !!o.off };
  out.block = await one('block', { t: 'attack', id: pick.u, to: pick.t, hit: false, chance: 40, shot: false, hp: 0, armour: 0 });
  if (pick.g) out.shot = await one('shot', { t: 'attack', id: pick.g, to: pick.gt, hit: false, chance: 40, shot: true, hp: 0, armour: 0 });
  if (o.film && pick.gt && pick.gt !== pick.t) out.hit = await one('hit', { t: 'attack', id: pick.u, to: pick.gt, hit: true, chance: 60, shot: false, hp: 6, armour: 4 });
  out.counts = await ff.evaluate(() => ({ blocks: FIGHT_UI.blocks || 0, flares: FIGHT_UI.flares || 0, flareDrawn: FIGHT_UI.flareDrawn || 0 }));
  if (cdp) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {});
  return out;
}
function table(r) {
  const L = ['THE FIGHT\'S WEIGHT at ' + r.speed + 'x' + (r.cpu > 1 ? ', CPU ' + r.cpu + 'x slower' : '') + ' (' + (r.at && r.at.district) + ', round ' + r.round + ', ' + r.fps + ' fps, worst ' + r.worst + ' ms)',
    '  kind      n   READS  body  glass  sound  frames  knock  channels (median drawn frames / screen ms)  sounds'];
  Object.keys(r.kinds || {}).forEach(k => { const q = r.kinds[k]; L.push('  ' + k.padEnd(8) + String(q.n).padStart(3) + String(q.read == null ? '-' : q.read + '%').padStart(8) + String(q.body == null ? '-' : q.body + '%').padStart(6) + String(q.glass == null ? '-' : q.glass + '%').padStart(7)
    + String(q.sound == null ? '-' : q.sound + '%').padStart(7) + String(q.frames).padStart(8) + String(q.knock).padStart(7) + '  ' + Object.keys(q.ch || {}).map(c => c + ' ' + q.ch[c] + '/' + ((q.ms || {})[c] || 0) + 'ms').join(', ') + '  | ' + q.sounds.join(' ')); });
  return L.join('\n');
}
module.exports = { measure, stage, table, fightIn, SAMPLER, READ, SEEN_MS, seen };

if (require.main === module) {
  const a = process.argv.slice(2), arg = (k, dflt) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : dflt; };
  (async () => {
    const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const d = await open({ profile: arg('--profile', 'phone_portrait'), door: 120000, engage: true });
    await d.page.waitForTimeout(2500);
    const r = a.indexOf('--stage') >= 0 ? await stage(d, { speed: +arg('--speed', 1), fam: arg('--fam', '^suburb$'), cpu: +arg('--cpu', 1), off: a.indexOf('--off') >= 0, film: a.indexOf('--film') >= 0 })
      : await measure(d, { speed: +arg('--speed', 1), ms: +arg('--ms', 40000), fam: arg('--fam', '^suburb$'), cpu: +arg('--cpu', 1), arm: arg('--arm', null) });
    console.log(r.err || (r.block ? JSON.stringify(r, (k, v) => k === 'film' ? (v || []).length + ' frames' : v, 1) : table(r)));
    if (arg('--json')) require('fs').writeFileSync(arg('--json'), JSON.stringify(r, null, 1));
    await d.close();
  })().catch(e => { console.error(e); process.exit(1); });
}

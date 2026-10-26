#!/usr/bin/env node
/* THE FIGHT AS CLOSE AS IT CAN BE (COMBAT TWO 10/26, rows [the fight frames around the phone] and [the fight's camera follows
   the fight]; rules 288(b)(c)(d), 230(a), 213(c)(e); records/BOHEMIA_PAOLO_OFF_CENTRE_ON_THE_MAP_AND_THE_FIGHT_AS_CLOSE_AS_IT_CAN_BE_10_26_26.md).
   PAOLO 10/26: 'from the map into combat we always want everyone, the enemies to the crew, as zoomed in as possible until we
   start touching and moving the camera... so even in combat, as it gets smaller and smaller, it fits the screen and you see the
   details and your characters bigger than when they were zoomed out'.

   Rolled fights in slices/BOHEMIA_FIGHT.html on the phone upright, the phone on its side and a computer, with the phone in the
   right corner and then the left. The phone is put up on the fight's page the way the shell puts it up (its own _paint with its
   own rectangle). THE OPEN AREA IS READ OFF THE GLASS, never off the page's own sums: under the turn strip (#top), over the bar
   (#bot), clear of the phone's rectangle (upright the band from its top down, on its side the band beside it: UI TWO's margin).
   Every frame of every fight is read through the page's own draw. A man's figure is his drawn box: his feet where the page draws
   them, his head manH() over them, his body 0.3 of his height across (0.15 either side of his feet).
   LEGS, each profile and corner:
   1. THE OPEN: the first frame is the tightest frame of every fighter he can see plus a tile (the box of their figures grown by
      half a tile a side touches the open area on one axis, or the camera is at its nearest stop), centred in the open area within
      two points (or as near it as the map around the board allows: the map's edge at the glass's edge on the side it was pushed
      from, no black, said in the line); and the open area's centre sits off the glass's centre, away from the phone.
   2. NEVER A MAN OFF THE GLASS: on no frame is a living fighter's figure (his body, 0.15 of his height either side of his feet,
      head to feet) outside the open area by more than a point; a man who walks out of the dark is read from half a beat after
      his crew first sees him (the camera eases out to him, never a snap), and how many did is said; a man outside it while the
      camera is already gliding to a frame that holds him is being taken in for at most half a beat, and the frames it happened
      are said (a walk that starts between two slow frames).
   3. IT RE-FITS WITHIN A BEAT: on every frame a beat and two frames after the first frame that could see the last walk, fall,
      change of who stands where or the bar standing taller, the frame is that tightest frame again, centred: never larger than it
      must be.
   4. NEVER A SNAP: the camera never moves between two frames when neither is inside a glide (his touch aside).
   5. BIGGER WHEN IT HAS DRAWN TOGETHER: where the fight drew together the camera came in a tenth or more (every profile sees it
      once), and there a man is drawn bigger than at the open; the law's one exception, said in the line: a man at his floor
      (half his size, NOBODY STANDS ON ANYBODY) at both.
   6. THE FLIP (a fight by hand, while he decides): the phone put in the other corner, the open centre goes with it and inside
      two beats the frame is the tightest in the new open area.
   HIS TOUCH (the phones with two real touches through the browser's own input, the computer with the wheel), the same fight:
   the touch moves the camera; through his END TURN and every turn of theirs it does not move a point; at the start of his next
   man's turn the auto-frame takes it back and the frame is the tightest again within two beats.
   PLANTED (the phone upright): the phone's margin ignored by the page turns leg 1 red; a frame a sixth wider than it must be turns
   leg 1 red; a touch that never lets go turns the touch leg red.
   node gates/the_fight_as_close_as_it_can_be_gate.js     (CAMERA_PROFILES=phone_portrait,computer to run fewer). About 6 min */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const PROFILES = (process.env.CAMERA_PROFILES || 'phone_portrait,phone_landscape,computer').split(',').filter(Boolean);
const ONLY = process.env.CAMERA_ONLY ? process.env.CAMERA_ONLY.split(',') : null;   /* e.g. phone_landscape:left: those rolled fights alone (a lane's look) */
const SPEED = 3;
/* one rolled fight a profile and corner, each its own seed and ground */
const FIGHTS = { phone_portrait: [{ seed: 5, kind: 'suburb' }, { seed: 11, kind: 'street' }], phone_landscape: [{ seed: 9, kind: 'scrub' }, { seed: 7, kind: 'suburb' }],
  computer: [{ seed: 3, kind: 'street' }, { seed: 13, kind: 'scrub' }] };
const DRAWN_IN = 1.1;

/* ---- in the page: the phone up in a corner, the way the shell's _paint hands it to every frame ---- */
const PHONE_UP = (side) => {
  const r = BOH_PHONE_RECT(), W = innerWidth, flip = side && side !== r.side;
  const left = flip ? W - r.left - r.width : r.left;
  BohemiaPhone._paint({ on: true, side: side || r.side, screen: 'fight', rect: { left: left, top: r.top, right: left + r.width, bottom: r.bottom, width: r.width, height: r.height, cls: r.cls } });
  return BOH_PHONE_RECT();
};
/* ---- in the page: the sampler, wrapped round the page's own draw ---- */
const SAMPLER = () => {
  const C = window.__CAM = { frames: 0, off: 0, offWhy: [], snaps: 0, snapWhy: [], checks: 0, tightFail: 0, tightWhy: [], first: null, openArea: 0, openMan: 0,
    least: null, busy: 0, outSince: {}, taking: 0, takingMs: 0, sig: '', prev: null, touches: 0, mineFrames: 0, mineMoved: 0, fitsAfterBack: [] };
  /* the bar's top at its tallest since the glass or the phone last changed (the bar's lines change turn to turn) */
  const OPEN = () => {
    const W = innerWidth, H = innerHeight, t = document.getElementById('top').getBoundingClientRect(), b = document.getElementById('bot').getBoundingClientRect();
    const R = BOH_PHONE_RECT(), key = W + 'x' + H + ':' + (R && R.on ? R.side + Math.round(R.left) + ',' + Math.round(R.top) : ''), bt = H - Math.round(H - b.top);
    if (C.barKey !== key) { C.barKey = key; C.barTop = bt; } else C.barTop = Math.min(C.barTop, bt);
    const o = { l: 0, r: W, t: Math.round(t.bottom), b: C.barTop };
    if (R && R.on && !window.__PLANT_NO_PHONE_READ) { if (H >= W) o.b = Math.min(o.b, R.top); else if (R.side === 'right') o.r = Math.min(o.r, R.left); else o.l = Math.max(o.l, R.right); }
    o.w = o.r - o.l; o.h = o.b - o.t; o.cx = (o.l + o.r) / 2; o.cy = (o.t + o.b) / 2; o.phone = R; return o;
  };
  C.OPEN = OPEN;
  const men = () => FIGHT.S.units.filter(v => FIGHT.onField(v) && FIGHT.shown(v));
  const figs = (half) => { const h = manH(); return men().map(v => { const X = sx((dx(v) + .5) * FIGHT_UI.tw), feet = sy((dy(v) + .9) * FIGHT_UI.th); return { id: v.id, l: X - h * half, r: X + h * half, t: feet - h, b: feet }; }); };
  /* the tightest frame: the figures' box grown by half a tile a side, in the open area, touching it on one axis, centred */
  const tight = (o) => {
    const f = figs(0.15); if (!f.length) return { ok: true, why: 'nobody' };
    const tw = FIGHT_UI.tw * FIGHT_UI.zoom, th = FIGHT_UI.th * FIGHT_UI.zoom;
    const fr = { l: Math.min(...f.map(q => q.l)) - tw / 2, r: Math.max(...f.map(q => q.r)) + tw / 2, t: Math.min(...f.map(q => q.t)) - th / 2, b: Math.max(...f.map(q => q.b)) + th / 2 };
    const k = Math.min(o.w / (fr.r - fr.l), o.h / (fr.b - fr.t)), z = FIGHT_UI.zoom;
    const nearest = z >= FIGHT_UI.near * 0.995, farthest = z <= (FIGHT_UI.coverFar || FIGHT_UI.far) * 1.005;
    const fits = k >= 0.97 && (k <= 1.03 || nearest) || (k < 0.97 && farthest);
    /* centred, unless the map around the board ends at the glass's edge on the side it was pushed from (no black, his eleventh
       votes): then as near the centre as the map lets it, every man still inside the open area (leg 2) */
    const bt = DB.ground.block_tiles, rx = SURROUND_BLOCKS * bt * FIGHT_UI.tw, ry = SURROUND_BLOCKS * bt * FIGHT_UI.th;
    const ring = { l: sx(-rx), r: sx(Math.ceil(FIGHT.S.w / bt) * bt * FIGHT_UI.tw + rx), t: sy(-ry), b: sy(Math.ceil(FIGHT.S.h / bt) * bt * FIGHT_UI.th + ry) };
    const dxc = (fr.l + fr.r) / 2 - o.cx, dyc = (fr.t + fr.b) / 2 - o.cy;
    /* the page holds an aim to AIM_PX (1.5 points) and a point of rounding: three points of slack */
    /* the frame sits left of the centre when the camera could go no further left: the map's left edge at the glass's left edge */
    const atX = (dxc < -2 && ring.l >= -3) || (dxc > 2 && ring.r <= innerWidth + 3), atY = (dyc < -2 && ring.t >= TOPH - 3) || (dyc > 2 && ring.b <= innerHeight - BOTH + 3);
    const centred = (Math.abs(dxc) <= 2 || atX) && (Math.abs(dyc) <= 2 || atY);
    if (atX || atY) C.ringHeld = (C.ringHeld || 0) + 1;
    return { ok: fits && centred, k: k, dx: dxc, dy: dyc, z: z, nearest: nearest, why: 'k ' + k.toFixed(3) + (nearest ? ' (nearest)' : '') + ' off ' + dxc.toFixed(1) + ',' + dyc.toFixed(1) + (atX || atY ? ' (the map ends there)' : '') + ' z ' + z.toFixed(3) };
  };
  C.tight = tight;
  const area = () => { const m = men(); if (!m.length) return 0; const xs = m.map(v => v.x), ys = m.map(v => v.y); return (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1); };
  window.OPEN_B = new Function('return OPEN.b');
  if (window.__GDBG) { const g0 = window.glideTo; C.gl = []; window.glideTo = function (x, y, z, ms, hold, at) { const st = (new Error().stack || '').split('\n')[2] || ''; C.gl.push(Math.round(performance.now()) + ' ' + z.toFixed(3) + ' ' + Math.round(ms) + (hold ? 'H' : '') + ' ' + (st.match(/at (\w+)/) || [])[1]); if (C.gl.length > 12) C.gl.shift(); return g0(x, y, z, ms, hold, at); }; }
  const orig = window.draw;
  window.draw = function (now) {
    const U = FIGHT_UI, g0 = U.glide;
    orig(now);
    if (!U.board || FIGHT.S.over) return;
    C.frames++;
    const o = OPEN(), b = beatMs();
    /* 6: the first frame after the phone moved where the camera has landed on the tightest frame of the new open area */
    const FL = window.__FLIP; if (FL && !FL.done && now > FL.at && !U.glide && tight(o).ok) FL.done = now;
    /* 2: every living fighter's body inside the open area. A man who walks out of the dark is drawn where his walk starts the
       moment his crew sees him, and the camera eases out to him (GLIDE_OUT of a beat, never a snap): he is read from then on,
       and the times it happened are said */
    const seen = C.seen = C.seen || {}, ease = b * GLIDE_OUT + 34;
    men().forEach(v => { if (!seen[v.id]) { seen[v.id] = now; if (C.frames > 1) C.dark = (C.dark || 0) + 1; } });
    Object.keys(seen).forEach(id => { if (!men().some(v => v.id === id)) delete seen[id]; });
    /* a man outside it while the camera is already gliding to a frame that holds him (a walk that began between two slow frames)
       is being taken in, inside half a beat of the first frame he stood outside: said, never hidden */
    const holds = (q) => { const g = U.glide; if (!g) return false; const v = FIGHT.byId(q.id), h = manH(g.tz), X = ((dx(v) + .5) * U.tw - g.tx) * g.tz + OX, F = ((dy(v) + .9) * U.th - g.ty) * g.tz + OY;
      return X - h * .15 >= o.l - 1 && X + h * .15 <= o.r + 1 && F - h >= o.t - 1 && F <= o.b + 1; };
    const outNow = {};
    figs(0.15).forEach(q => { const out = Math.max(o.l - q.l, q.r - o.r, o.t - q.t, q.b - o.b); if (out <= 1 || U.pinched || now - seen[q.id] <= ease) return; outNow[q.id] = 1;
      const since = C.outSince[q.id] = C.outSince[q.id] || now;
      if (holds(q) && now - since <= ease) { C.taking++; C.takingMs = Math.max(C.takingMs, now - since); return; }
      { C.off++;
      if (C.offWhy.length < 6) { const v = FIGHT.byId(q.id); C.offWhy.push(q.id + ' by ' + out.toFixed(1) + ' r' + FIGHT.S.round + ' (at ' + v.x + ',' + v.y + ' drawn ' + dx(v).toFixed(2) + ',' + dy(v).toFixed(2)
        + (U.glide ? ', gliding' : '') + ', ' + U.anim.map(a => a.k + (a.e ? ':' + a.e.id : '') + (a.at ? '*' : '')).join(' ') + ')'); } } });
    Object.keys(C.outSince).forEach(id => { if (!outNow[id]) delete C.outSince[id]; });
    /* 4: a move between two frames with no glide on either side of it and no touch */
    const cam = { z: U.zoom, x: U.cx, y: U.cy, g: !!U.glide, g0: !!g0, n: U.touches || 0 };
    if (C.prev && !C.prev.g && !cam.g0 && !cam.g && cam.n === C.prev.n && !U.pinched) {
      const mv = Math.max(Math.abs(Math.log(cam.z / C.prev.z)) * 100, Math.abs(cam.x - C.prev.x) * cam.z, Math.abs(cam.y - C.prev.y) * cam.z);
      if (mv > 0.05) { C.snaps++; if (C.snapWhy.length < 4) C.snapWhy.push(mv.toFixed(2) + ' r' + FIGHT.S.round); }
    }
    C.prev = cam;
    if (U.pinched) { C.mineFrames++; return; }
    /* 3: settled = a beat and two frames since the last walk (played or waiting), fall (played or waiting) or change of who
       stands where; a blow or a shot moves nobody, so the camera is read through them */
    const sig = men().map(v => v.id + '@' + v.x + ',' + v.y).join(' ');
    const falling = FIGHT.S.units.some(v => (v.dead || v.down) && v._fallAt !== undefined && now - v._fallAt < b);
    const moving = U.anim.some(a => a.k === 'step' || (a.k === 'note' && a.e && (a.e.t === 'dead' || a.e.t === 'down')));
    if (sig !== C.sig || moving || falling || o.b !== C.lastB) { C.sig = sig; C.busy = now; C.lastB = o.b; C.quiet = null; }   /* the bar standing taller is a change too */
    else if (C.quiet === null || C.quiet === undefined) { C.quiet = now; C.quietBeat = b; }   /* the first frame the page could see it was over */
    if (window.__GDBG) { (C.ring = C.ring || []).push(Math.round(now) + (moving ? 'M' : '') + (sig !== C.sig ? 'S' : '') + (falling ? 'F' : '') + ':' + U.anim.map(q => q.k[0]).join('')); if (C.ring.length > 14) C.ring.shift(); }
    /* settled: a whole beat (the slower of the beat then and now: their turns run the beat twice as fast) and two frames since the
       first frame the page could see the last change */
    const first = !C.first;
    if (!first && (C.quiet === null || C.quiet === undefined || now - C.quiet < Math.max(b, C.quietBeat || 0) + 34)) return;
    const t = tight(o);
    if (first) { const H = innerHeight, bt = H - Math.round(H - document.getElementById('bot').getBoundingClientRect().top);
      C.first = { ok: t.ok, why: t.why, open: o, stripCy: (Math.round(document.getElementById('top').getBoundingClientRect().bottom) + bt) / 2, man: manH(), z: FIGHT_UI.zoom, area: area(), n: men().length, floor: MAN_IDLE / 2 };
      C.openArea = C.first.area; C.openMan = C.first.man; return; }
    C.checks++; if (!t.ok) { C.tightFail++; if (C.tightWhy.length < 5) { const f = fitBoth(), g = U.glide;
      C.tightWhy.push(t.why + ' r' + FIGHT.S.round + ' (aim z ' + f.z.toFixed(3) + (g ? ', gliding to ' + g.tz.toFixed(3) + ' ' + Math.round(now - g.t0) + '/' + Math.round(g.ms) + ' ms' : '') + ', ' + Math.round(now - C.quiet) + ' ms quiet, open ' + Math.round(o.b) + ' page ' + Math.round(window.OPEN_B()) + ', ' + Math.round(now) + ' ' + (C.gl || []).join(' | ') + ' RING ' + (C.ring || []).join(' ') + (window.__GDBG ? ' CAM ' + [U.cx, U.cy, U.zoom].map(v => v.toFixed(2)).join(',') + ' AIM ' + [f.cx, f.cy].map(v => v.toFixed(2)).join(',') + ' OX ' + OX.toFixed(1) + ' o.cx ' + o.cx.toFixed(1) + ' OPENL ' + new Function('return OPEN.l')() + ' o.l ' + o.l + ' PINCHED ' + U.pinched + ' PTS ' + framePoints().map(q => q.x + ',' + q.y).join(' ') + ' MEN ' + men().map(v => v.id + ':' + dx(v).toFixed(2) + ',' + dy(v).toFixed(2) + (v._at ? '@' : '')).join(' ') : '') + ', extra ' + (() => { const mine = {}; men().forEach(v => { mine[v.x + ',' + v.y] = 1; }); return framePoints().filter(q => !mine[q.x + ',' + q.y]).map(q => q.x + ',' + q.y).join(' '); })() + ')'); } }
    /* 5: the closest the camera came (the tightest settled frame), and the man drawn there */
    if (!C.least || FIGHT_UI.zoom > C.least.z) C.least = { area: area(), man: manH(), z: FIGHT_UI.zoom };
  };
};

async function fight(profile, side, F, plant) {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile,
    arm: (process.env.CAMERA_GDBG ? 'window.__GDBG=1;' : '') + 'try{localStorage.setItem("bohemia.phone.v1",JSON.stringify({side:"' + side + '"}))}catch(e){};window.FIGHT_OPTS={seed:' + F.seed + ',speed:' + SPEED + ',kind:"' + F.kind + '"' + (F.hand ? ',deploy:false' : ',auto:true') + '}' });
  const p = d.page, ev = (f, a) => p.evaluate(f, a);
  const until = async (fn, ms, a) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn, a).catch(() => false)) return true; await p.waitForTimeout(50); } return false; };
  await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 40000);
  await ev('window.__PHONE_UP = ' + PHONE_UP.toString());
  const R = await ev(PHONE_UP, side);
  await ev(SAMPLER);
  return { d, p, ev, until, R };
}
const tag = (pr, sd) => '[' + pr.replace('phone_portrait', 'phone upright').replace('phone_landscape', 'phone on its side') + ', phone ' + sd + ']';

async function rolled(profile, side, F) {
  const T = tag(profile, side);
  const { d, p, ev, until } = await fight(profile, side, F);
  const errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 120)));
  /* the open: a few frames into the board */
  await until(() => !!window.__CAM.first, 8000);
  const O = await ev(() => { const C = window.__CAM, f = C.first; return { ok: f.ok, why: f.why, o: f.open, stripCy: f.stripCy, man: f.man, n: f.n, W: innerWidth, H: innerHeight, side: f.open.phone.side, on: f.open.phone.on, top: f.open.phone.top }; });
  /* off the glass's centre away from the phone: upright, up (unless the bar already stands over the phone's top); on its side, away from its corner */
  const off = O.H >= O.W ? (O.top >= O.o.b + 0.5 ? O.o.cy <= O.stripCy + 0.5 : O.o.cy < O.stripCy - 0.5) : O.side === 'right' ? O.o.cx < O.W / 2 - 0.5 : O.o.cx > O.W / 2 + 0.5;
  ok(T + ' ' + F.kind + ' seed ' + F.seed + ': 1. THE OPEN is the tightest frame of all ' + O.n + ' fighters plus a tile, centred in the open area clear of the phone',
    O.on && O.ok && off, O.why + ', open ' + [O.o.l, O.o.t, O.o.r, O.o.b].map(Math.round).join(',') + ', the man ' + O.man.toFixed(1) + ' px');
  /* the fight plays on AUTO to its end */
  const t0 = Date.now();
  while (Date.now() - t0 < 150000) {
    const s = await ev(() => ({ over: FIGHT.S.over })).catch(() => ({ over: true }));
    if (s.over) break;
    await p.waitForTimeout(250);
  }
  const C = await ev(() => { const C = window.__CAM; return { ringHeld: C.ringHeld || 0, frames: C.frames, off: C.off, dark: C.dark || 0, taking: C.taking, takingMs: C.takingMs, offWhy: C.offWhy, snaps: C.snaps, snapWhy: C.snapWhy, checks: C.checks, tightFail: C.tightFail, tightWhy: C.tightWhy,
    least: C.least, openArea: C.openArea, openMan: C.openMan, openZ: C.first.z, floor: C.first.floor, refits: FIGHT_UI.refits || 0, over: !!FIGHT.S.over, round: FIGHT.S.round }; });
  ok('  2. never a man off the glass: no living fighter outside the open area on ' + C.frames + ' frames', C.frames > 60 && C.off === 0, C.off + ' off' + (C.offWhy.length ? ': ' + C.offWhy.join('; ') : '') + ', ' + C.dark + ' came out of the dark and were taken in half a beat, ' + C.taking + ' frames a man stood outside while the camera already glided to hold him (longest ' + Math.round(C.takingMs) + ' ms), ' + C.round + ' rounds, over ' + C.over);
  ok('  3. it re-fits within a beat of every walk, fall and act, never larger than it must be, centred', C.checks >= 5 && C.tightFail === 0, C.checks + ' settled frames (' + (C.ringHeld || 0) + ' held off the centre by the map\'s edge), ' + C.tightFail + ' not tight' + (C.tightWhy.length ? ': ' + C.tightWhy.join('; ') : '') + ', ' + C.refits + ' glides asked');
  ok('  4. never a snap: the camera moves only inside a glide', C.snaps === 0, C.snaps + (C.snapWhy.length ? ': ' + C.snapWhy.join('; ') : ''));
  ok('  nothing thrown', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  await d.close();
  return { least: C.least, openArea: C.openArea, openMan: C.openMan, openZ: C.openZ, floor: C.floor };
}

/* HIS TOUCH, by hand: a real pinch (two touch points through the browser's own input) or the wheel; it holds through END TURN and
   their turns; it comes back at the start of his next man's turn */
async function touch(profile, side, F, stuck) {
  const T = tag(profile, side) + (stuck ? ' PLANTED (a touch that never lets go)' : '');
  const { d, p, ev, until } = await fight(profile, side, Object.assign({ hand: true }, F));
  await until(() => { const u = FIGHT.current(); return !!u && crewControlled(u) && !FIGHT_UI.anim.length && performance.now() > FIGHT_UI.openUntil && !FIGHT_UI.glide; }, 30000);
  /* 6. THE FLIP, while he decides: the phone to the other corner; inside two beats the frame is the tightest in the new open area */
  if (!stuck) {
    const other = side === 'right' ? 'left' : 'right';
    const f0 = await ev(() => window.__CAM.OPEN());
    await ev((sd) => { window.__PHONE_UP(sd); window.__FLIP = { at: performance.now(), done: null }; }, other);
    const fitted = await until(() => !!window.__FLIP.done, 6000);
    const f1 = await ev(() => ({ o: window.__CAM.OPEN(), t: window.__CAM.tight(window.__CAM.OPEN()), ms: (window.__FLIP.done || performance.now()) - window.__FLIP.at, b: beatMs(), W: innerWidth, H: innerHeight }));
    const mirrored = f1.H >= f1.W ? Math.abs(f1.o.cy - f0.cy) < 0.5 : (other === 'left' ? f1.o.cx > f1.W / 2 : f1.o.cx < f1.W / 2);
    ok(tag(profile, side) + ' 6. THE FLIP: the phone to the ' + other + ' corner, the open centre goes with it and the frame is the tightest there inside two beats',
      fitted && mirrored && f1.ms <= f1.b * 2 + 34, 'open centre ' + Math.round(f0.cx) + ',' + Math.round(f0.cy) + ' -> ' + Math.round(f1.o.cx) + ',' + Math.round(f1.o.cy) + ', ' + f1.t.why + ', ' + Math.round(f1.ms) + ' ms');
    side = other;
  }
  const before = await ev(() => ({ z: FIGHT_UI.zoom, x: FIGHT_UI.cx, y: FIGHT_UI.cy, key: turnNow(), o: window.__CAM.OPEN() }));
  const cx = Math.round(before.o.cx), cy = Math.round(before.o.cy);
  if (profile === 'computer') { await p.mouse.move(cx, cy); await p.mouse.wheel(0, -320); }
  else {
    const cdp = await p.context().newCDPSession(p), pt = (a, b) => [{ x: cx - a, y: cy, id: 1 }, { x: cx + b, y: cy, id: 2 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(30, 30) });
    for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(30 + i * 12, 30 + i * 12) }); await p.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await p.waitForTimeout(120);
  if (stuck) await ev(() => { FIGHT_UI.touchTurn = null; });   /* PLANTED: the hold forgets its turn and never lets go */
  const held = await ev(() => ({ z: FIGHT_UI.zoom, x: FIGHT_UI.cx, y: FIGHT_UI.cy, mine: !!FIGHT_UI.pinched }));
  const moved = Math.abs(Math.log(held.z / before.z)) > 0.05;
  if (!stuck) ok(tag(profile, side) + ' HIS TOUCH: a real ' + (profile === 'computer' ? 'wheel' : 'pinch') + ' moves the camera and it is his', moved && held.mine, 'zoom ' + before.z.toFixed(3) + ' -> ' + held.z.toFixed(3));
  /* END TURN, then every frame until his next man's turn: the camera where his fingers left it */
  /* END TURN by a real key (Battle Brothers' Enter): with the phone up the big button is the phone's (UI TWO, rule 238(a)), and the
     fight's page alone has no phone to press */
  await p.keyboard.press('Enter');
  await ev((h) => { window.__HOLD = { key: turnNow(), worst: 0, frames: 0, theirs: 0, back: null, h: h }; const C = window.__HOLD, o = window.draw;
    window.draw = function (now) { o(now); const U = FIGHT_UI; if (C.back) return;
      if (U.pinched) { C.frames++; const u = FIGHT.current(); if (u && u.side !== 'you') C.theirs++; C.worst = Math.max(C.worst, Math.abs(Math.log(U.zoom / h.z)) * 100, Math.abs(U.cx - h.x) * U.zoom, Math.abs(U.cy - h.y) * U.zoom); }
      else C.back = { at: now, key: turnNow(), side: (FIGHT.current() || {}).side, mine: crewControlled(FIGHT.current()) }; }; }, held);
  const back = await until(() => !!window.__HOLD.back, stuck ? 12000 : 60000);
  const H = await ev(() => window.__HOLD);
  if (stuck) { ok(T + ': the touch leg sees it', !back, back ? 'it came back' : 'never came back, as planted'); await d.close(); return; }
  ok('  it holds through his END TURN and ' + H.theirs + ' frames of their turns: the camera does not move a point', H.frames > 3 && H.worst < 0.5, H.frames + ' frames held, worst ' + H.worst.toFixed(2));
  ok('  at the start of his next man\'s turn the auto-frame takes it back', back && H.back.side === 'you' && H.back.key !== H.key, back ? H.key + ' -> ' + H.back.key : 'never came back');
  /* within two beats and a glide, the tightest frame again */
  if (!back) { await d.close(); return; }
  const fit = await until(() => { const H = window.__HOLD; return !FIGHT_UI.glide && performance.now() - H.back.at > 30 && window.__CAM.tight(window.__CAM.OPEN()).ok; }, 8000);
  const F2 = await ev(() => ({ t: window.__CAM.tight(window.__CAM.OPEN()), ms: performance.now() - window.__HOLD.back.at, b: beatMs() }));
  ok('  and the frame is the tightest again inside two beats', fit && F2.ms <= F2.b * 2 + 200, F2.t.why + ', ' + Math.round(F2.ms) + ' ms, a beat ' + Math.round(F2.b) + ' ms');
  await d.close();
}

/* PLANTS on the phone upright: the page told the phone is not there; the frame a sixth wider than it must be */
async function plants() {
  const { d, ev, until } = await fight('phone_portrait', 'right', { seed: 5, kind: 'suburb', hand: true });
  await until(() => !!window.__CAM.first, 8000);
  const a = await ev(() => window.__CAM.tight(window.__CAM.OPEN()));
  await ev(() => { window.__PADDING = BohemiaPhone.padding; BohemiaPhone.padding = () => ({ top: 0, right: 0, bottom: 0, left: 0 }); window.dispatchEvent(new CustomEvent('bohemia-phone')); });
  await until(() => !FIGHT_UI.glide && FIGHT_UI.refits > 0, 4000); await new Promise(r => setTimeout(r, 600));
  const b = await ev(() => window.__CAM.tight(window.__CAM.OPEN()));
  ok('PLANTED [phone upright]: the page frames as if the phone were not there: leg 1 turns red', a.ok && !b.ok, 'before ' + a.why + ' | planted ' + b.why);
  await ev(() => { BohemiaPhone.padding = window.__PADDING; window.dispatchEvent(new CustomEvent('bohemia-phone')); });
  await new Promise(r => setTimeout(r, 900));
  await ev(() => { window.__FIT = window.fitBoth; window.fitBoth = function (m) { const f = window.__FIT(m); f.z /= 1.17; return f; }; });
  await new Promise(r => setTimeout(r, 900));
  const c = await ev(() => window.__CAM.tight(window.__CAM.OPEN()));
  ok('PLANTED [phone upright]: a frame a sixth wider than it must be: leg 1 turns red', !c.ok, c.why);
  await d.close();
}

(async () => {
  const together = {};
  for (const profile of PROFILES) {
    together[profile] = [];
    for (const [i, side] of ['right', 'left'].entries()) {
      if (ONLY && ONLY.indexOf(profile + ':' + side) < 0) continue;
      try { together[profile].push(await rolled(profile, side, FIGHTS[profile][i])); }
      catch (e) { ok(tag(profile, side) + ' the fight ran', false, String(e.message).slice(0, 160)); }
    }
    /* where the fight drew together the camera came in (DRAWN_IN closer than the open, at least once a profile), and there the man
       is drawn bigger than at the open; the one exception the law makes is his floor (never under half his size, NOBODY STANDS
       ON ANYBODY): a man at his floor at the open grows once MAN_ROWS rows of his ground pass it, and is never smaller */
    const fl = q => q.openMan <= q.floor + 0.5 && q.least.man <= q.floor + 0.5;
    const T = together[profile].filter(q => q.least && q.least.z >= q.openZ * DRAWN_IN);
    ok(tag(profile, 'either') + ' 5. once the fight draws together the camera comes in and a man is drawn bigger than at the open', T.length > 0 && T.every(q => q.least.man > q.openMan + 0.5 || fl(q)),
      together[profile].map(q => q.least ? 'zoom ' + q.openZ.toFixed(3) + ' -> ' + q.least.z.toFixed(3) + ' (box ' + q.openArea + ' -> ' + q.least.area + ' tiles), the man ' + q.openMan.toFixed(1) + ' -> ' + q.least.man.toFixed(1) + ' px'
        + (fl(q) ? ' AT HIS FLOOR (half his size) both times' : '') : 'no settled frame').join(' | '));
  }
  if (ONLY) { console.log('\n=== THE FIGHT AS CLOSE AS IT CAN BE GATE (CAMERA_ONLY, not a ship pass): ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
  for (const [profile, side] of [['phone_portrait', 'right'], ['phone_landscape', 'right'], ['computer', 'left']]) {
    if (PROFILES.indexOf(profile) < 0) continue;
    try { await touch(profile, side, { seed: 21, kind: 'suburb' }); } catch (e) { ok(tag(profile, side) + ' HIS TOUCH ran', false, String(e.message).slice(0, 160)); }
  }
  if (PROFILES.indexOf('phone_portrait') >= 0) {
    try { await plants(); await touch('phone_portrait', 'right', { seed: 21, kind: 'suburb' }, true); } catch (e) { ok('PLANTS ran', false, String(e.message).slice(0, 160)); }
  }
  console.log('\n=== THE FIGHT AS CLOSE AS IT CAN BE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();

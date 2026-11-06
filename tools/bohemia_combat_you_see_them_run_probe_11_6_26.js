#!/usr/bin/env node
/* YOU SEE THEM RUN, MEASURED ON THE GLASS (COMBAT 9, rule 415, Paolo 11/6: 'while retreating, I don't see my people actually run, they
   kind of just disappear. I think it's because you have the retreat edge of the screen less than four tiles away from our back line';
   rule 256: 'in Battle Brothers every time I retreated I watched my people run tile to tile and they always made it').
   The real fight, a retreat ordered by the real button, and every frame the page DRAWS (its own drawMan, wrapped, untouched) is written
   down: for each man of his, the tile he is drawn on (his drawn middle, rounded), the clip he is drawn in, and whether he stands in the
   open area of the glass (clear of the phone, the strip and the bar: the fight's own OPEN box). Per man:
     stood      his tile when the order was given; own = his distance to his own edge (his x), dist = to the nearest edge
     edge       the edge tile the rules took him off from
     between    distinct tiles he was DRAWN on strictly between where he stood and that edge tile (rule 415(c): three or more)
     lastIn     the last tile on the board he was drawn on (rule 415(c): an edge tile, never a tile inside)
     off        frames he was drawn past the board's edge (the short run off the glass, rule 415(a))
     walk       share of his moving frames drawn in the walk clip (his own walk, never a slide)
     onGlass    share of his frames on the board inside the open area (the camera holds them)
   Three ways in: 'lineup' (the bare fight page, RETREAT pressed on the lineup: his men run first, rules 253/365), 'mid' (the bare fight
   page, AUTO into round 2, the order on a turn of his) and 'demo' (the demo's own door: a road fight on the board the map's block lays,
   COMBAT TWO's __THE_BOARD_IS_THE_CITY_AT_THAT_SPOT__, RETREAT pressed on its lineup).
   Module: require(...).probe({ profile, mode, seed, company, band }); CLI: node ... [profile] [mode ...] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));

/* armed before the page runs (every frame of it): the wrap of drawMan once a fight page has made it, the frame log */
const HOOK = `(function(){
  window.__run = { frames: [], order: null };
  function wrap(){
    if (typeof window.drawMan !== 'function' || window.drawMan.__wrapped) return;
    const real = window.drawMan;
    window.drawMan = function (v, tw, th) {
      try {
        if (v && v.side === 'you' && window.__run.order) {
          const p = shownAt(v), X = sx((dx(v) + .5) * UI.tw), Y = sy((dy(v) + .9) * UI.th);
          const pose = (function(){ try { return poseOf(v, performance.now()).clip; } catch (e) { return '?'; } })();
          window.__run.frames.push({ t: performance.now(), id: v.id, x: p.x, y: p.y, tx: Math.round(p.x), ty: Math.round(p.y), clip: pose,
            glass: X >= OPEN.l && X <= OPEN.r && Y >= OPEN.t && Y <= OPEN.b + manH() * .5, fled: !!v.fled });
        }
      } catch (e) {}
      return real.apply(this, arguments);
    };
    window.drawMan.__wrapped = true;
  }
  const iv = setInterval(function(){ wrap(); if (window.drawMan && window.drawMan.__wrapped) clearInterval(iv); }, 20);
})();`;
const READY = () => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!window.FIGHT_UI && FIGHT_UI.board && performance.now() > FIGHT_UI.openUntil && !!window.drawMan && window.drawMan.__wrapped;

async function probe(o) {
  o = o || {};
  const profile = o.profile || 'phone_portrait', mode = o.mode || 'lineup';
  const company = o.company || [{}, {}, {}, {}];
  const opts = { seed: o.seed || 21, speed: 1, kind: o.kind || 'suburb', formation: null, auto: mode === 'mid', deploy: mode === 'lineup', teach: false,
    company, cap: company.length, band: o.band || ['brigand_thug', 'brigand_thug', 'brigand_thug', 'brigand_thug'] };
  /* the demo boots the way the game's own gates boot it now (through the title, the cards kept: CAMP THREE's door; 'engage' crashed the
     page on this box, on main too) */
  const d = mode === 'demo' ? await D.open({ keepCards: true, profile, arm: HOOK, beforeTap: async (pg) => { await require(path.join(ROOT, 'tools/bohemia_through_the_title.js')).throughTheTitle(pg); } })
    : await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: HOOK + 'window.FIGHT_OPTS=' + JSON.stringify(opts) + ';' });
  const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  const R = { profile, mode, errs, men: [] };
  let f = p.mainFrame(), off = { x: 0, y: 0 };
  try {
    if (mode === 'demo') {
      await p.waitForTimeout(3500);
      const settle = () => p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url()));
      if (await d.fr.evaluate(() => !!(LOOP.open && LOOP.open.name)).catch(() => false)) { await require(path.join(ROOT, 'tools/bohemia_leave_the_town.js')).leaveTown(p, settle(), { ms: 5000 }); await p.waitForTimeout(2500); }
      if ((await d.fr.evaluate(() => MODE).catch(() => 'city')) !== 'city') { await d.fr.evaluate(() => { try { swapMode(); } catch (e) {} }); await p.waitForTimeout(1500); }
      /* off the town's safe ground, then the map's own encounter door (cityHandOver, the one CAMP THREE's gate opens a fight through):
         four brigands met on the street, the board laid from the map's block there */
      R.door = await d.fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { contactClear(); } catch (e) {}
        for (let r = 2; r < 14 && townSafeAt(city.x, city.y); r++) { const x0 = city.x, y0 = city.y; for (const q of [[r, 0], [-r, 0], [0, r], [0, -r]]) { city.x = x0 + q[0]; city.y = y0 + q[1]; if (!townSafeAt(city.x, city.y)) break; city.x = x0; city.y = y0; } }
        try { TOWN_EXIT = null; } catch (e) {}
        try { return !!cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', why: 'gate:run', label: 'A CREW', __met: true, party: { count: 4, faction: 'brigands' }, roster: [{ arch: 'human' }, { arch: 'human' }, { arch: 'human' }, { arch: 'human' }], street: true, at: { gx: city.x + 2, gy: city.y } }, null); } catch (e) { return 'threw ' + e; } });
      let ff = null; const t0 = Date.now();
      while (!ff && Date.now() - t0 < 90000) { const h = await p.$('#fightFrame'); const c = h && await h.contentFrame();
        if (c && await c.evaluate(READY).catch(() => false) && await c.evaluate(() => FIGHT.S.deploy).catch(() => false)) ff = c; else await p.waitForTimeout(300); }
      if (!ff) throw new Error('the demo\'s fight never stood on its lineup');
      f = ff; const fb = await (await f.frameElement()).boundingBox(); off = { x: fb.x, y: fb.y };
      R.board = await f.evaluate(() => ({ family: FIGHT.S.boardDef && FIGHT.S.boardDef.family, name: FIGHT.S.board, street: !!(FIGHT.S.boardDef && FIGHT.S.boardDef.laid) }));
    } else await f.waitForFunction(READY, null, { timeout: 60000 });
    if (mode === 'mid') {
      await f.waitForFunction(() => FIGHT.S.round >= 2 || FIGHT.S.over, null, { timeout: 90000 });
      /* AUTO brings it into round 2 (by hand his turns wait for him); the order is pressed on a turn of his */
      await f.waitForFunction(() => { const u = FIGHT.current(); return FIGHT.S.over || (u && u.side === 'you'); }, null, { timeout: 60000 });
    }
    /* the real button where it is on the glass: the phone's own retreat (upright) or the bar's */
    const vis = sel => f.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 3 || r.bottom <= 0 || r.top >= innerHeight) return null;
      const x = r.x + r.width / 2, y = r.y + r.height / 2, t = document.elementFromPoint(x, y); return t && (t === e || e.contains(t)) ? { x, y } : null; }, sel);
    let at = await vis('.fc[data-c=flee]') || await vis('#bflee');
    if (at) at = { x: at.x + off.x, y: at.y + off.y };
    if (!at && mode === 'demo') { const q = await p.evaluate(() => { const e = document.querySelector('.fc[data-c=flee]'); if (!e) return null; const r = e.getBoundingClientRect(); return r.width > 2 && r.bottom > 0 && r.top < innerHeight ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null); at = q; }
    if (!at) throw new Error('no retreat button on the glass');
    R.stood = await f.evaluate(() => { const S = FIGHT.S; window.__run.order = performance.now(); window.__run.L0 = S.log.length;
      return { w: S.w, h: S.h, cols: S.cols.slice(), round: S.round, men: S.units.filter(v => v.side === 'you' && FIGHT.onField(v)).map(v => ({ id: v.id, name: v.name, x: v.x, y: v.y })) }; });
    const tap = async () => { if (profile === 'computer') await p.mouse.click(at.x, at.y); else await p.touchscreen.tap(at.x, at.y); };
    await tap(); await p.waitForTimeout(350);
    if (await f.evaluate(() => !FIGHT.S.retreat && !FIGHT.S.over).catch(() => false)) { await tap(); await p.waitForTimeout(300); }
    /* the run plays; the demo takes the fight away when it ends, so the frames are read as they come */
    let log = null; const t1 = Date.now();
    while (Date.now() - t1 < 180000) {
      const r = await f.evaluate(() => ({ over: FIGHT.S.over && !FIGHT_UI.anim.length, frames: window.__run.frames.length })).catch(() => null);
      if (!r) break;
      log = await f.evaluate(() => ({ frames: window.__run.frames, units: FIGHT.S.units.filter(v => v.side === 'you').map(v => ({ id: v.id, name: v.name, x: v.x, y: v.y, escaped: !!v.escaped, dead: !!v.dead, down: !!v.down })), result: FIGHT.S.result })).catch(() => log);
      if (r.over) { await p.waitForTimeout(1200); log = await f.evaluate(() => ({ frames: window.__run.frames, units: FIGHT.S.units.filter(v => v.side === 'you').map(v => ({ id: v.id, name: v.name, x: v.x, y: v.y, escaped: !!v.escaped, dead: !!v.dead, down: !!v.down })), result: FIGHT.S.result })).catch(() => log); break; }
      await p.waitForTimeout(400);
    }
    if (!log) throw new Error('no frames read');
    R.result = log.result;
    const W = R.stood.w, H = R.stood.h, onEdge = (x, y) => x === 0 || y === 0 || x === W - 1 || y === H - 1, inB = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
    R.stood.men.forEach(m0 => {
      const u = log.units.find(v => v.id === m0.id) || {}, fr = log.frames.filter(q => q.id === m0.id);
      const inside = fr.filter(q => inB(q.tx, q.ty)), last = inside[inside.length - 1];
      const tiles = {}; inside.forEach(q => { tiles[q.tx + ',' + q.ty] = true; });
      const between = Object.keys(tiles).filter(k => k !== m0.x + ',' + m0.y && k !== u.x + ',' + u.y).length;
      const moving = fr.filter(q => Math.abs(q.x - q.tx) > .04 || Math.abs(q.y - q.ty) > .04);
      R.men.push({ name: m0.name, stood: [m0.x, m0.y], out: !!u.escaped, edge: u.escaped ? [u.x, u.y] : null, dist: Math.min(m0.x, m0.y, W - 1 - m0.x, H - 1 - m0.y), own: m0.x,
        between, tiles: Object.keys(tiles).length, lastIn: last ? [last.tx, last.ty] : null, lastInEdge: last ? onEdge(last.tx, last.ty) : false,
        off: fr.filter(q => !inB(q.tx, q.ty)).length, frames: fr.length,
        walk: moving.length ? +(moving.filter(q => q.clip === 'walk' || q.clip === 'carrywalk').length / moving.length).toFixed(2) : 0,
        onGlass: inside.length ? +(inside.filter(q => q.glass).length / inside.length).toFixed(2) : 0 });
    });
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  await d.close().catch(() => {});
  return R;
}
module.exports = { probe };
if (require.main === module) {
  (async () => {
    const prof = process.argv[2] || 'phone_portrait', modes = process.argv.slice(3).length ? process.argv.slice(3) : ['lineup', 'mid'];
    for (const mode of modes) {
      const r = await probe({ profile: prof, mode });
      console.log('== ' + mode.toUpperCase() + ' on ' + prof + (r.err ? ' ERR ' + r.err : '') + (r.board ? ' board ' + JSON.stringify(r.board) : '') + ': ' + (r.stood && r.stood.w + 'x' + r.stood.h + ' cols ' + r.stood.cols) + ', ordered in round ' + (r.stood && r.stood.round) + ', result ' + r.result + ', errors ' + r.errs.length);
      r.men.forEach(m => console.log('  ' + JSON.stringify(m)));
    }
  })();
}

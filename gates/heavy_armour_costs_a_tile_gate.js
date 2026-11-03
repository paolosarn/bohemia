#!/usr/bin/env node
/* HEAVY ARMOUR COSTS A TILE OF WALKING, NEVER A SWING (COMBAT 7, rule 377, ask line 406; Paolo 11/3: 'if you're wearing the
   heaviest... maybe it's gonna be like -2... you can only walk one time less please check the code in the Numbers... please make sure
   that this does not make it impossible to do any sort of attack or abilities. If you didn't move that turn... you get one less
   tile... there's weights... categories'). ours.armour_weight (TUNING's numbers); slices/BOHEMIA_FIGHT.html wornWeight, weightClass,
   walkCap, walkLeft (reach, moveTo, farWalk); engine/bohemia_roster.js weightClass (the shop and the crew card).
   Legs:
   A1 THE RULE IS DATA: ours.armour_weight with source, his words and why; the classes in order, light and medium walk free, the
      heaviest costs one flat tile of a 9 AP turn; every body and head row weighs (a number or the wiki's blank, none)
   A2 STANDING STILL, EVERYTHING HE OWNS (headless): a man in the heaviest class who has not moved strikes with every kind of weapon
      the same man in light armour can strike with, and every ability (adrenaline, recover at 9, rotation, rally, taunt, footwork,
      indomitable, decoy) is his exactly as in light; walk one tile then strike still fits, a two-hander too
   A3 ONE TILE SHORTER ON FLAT (headless): his walking reach is 3 flat tiles in the heaviest, 4 in light and in heavy
   A4 AUTO AND THE ENEMY OBEY THE SAME CAP (headless, AUTO for both sides): no man of either side ever walks more AP in a turn than
      his class allows (the fight before this round: they did)
   A5 THE LIT REACH ON THE GLASS (the upright phone 390 x 844): the tile 4 flat tiles off is lit for him in light armour and dark in
      the heaviest, the tile 3 off lit in both (pixels read off the fight's own canvas)
   A6 THE SHOP AND THE CREW CARD SAY IT (the settlement's shop and the crew screen, upright phone): a coat of plates on a man in a
      full helm reads HEAVIEST, ONE LESS TILE on the shop's card; the crew card names his class
   Run: node gates/heavy_armour_costs_a_tile_gate.js [--headless-only] */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb', f), 'utf8'));
const OURS = J('ours.json'), ARM = J('armor.json'), RULES = J('rules.json');
const HEAVIEST = { body: 'coat_of_plates', head: 'full_helm' }, LIGHT = { body: 'padded_vest', head: 'leather_headband' }, HEAVY = { body: 'reinforced_mail_hauberk', head: 'nasal_helmet' };
const dist = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

/* A1 */
{
  const A = OURS.armour_weight, C = A && A.value && A.value.classes, ap = RULES.ap.per_turn.value, flat = RULES.ap.move_cost.flat.value;
  const ordered = !!C && C.every((c, i) => i === C.length - 1 ? typeof c.below !== 'number' : typeof c.below === 'number' && (i === 0 || c.below > C[i - 1].below));
  const top = C && C[C.length - 1], free = C && C.filter(c => /light|medium/.test(c.id)).every(c => !c.walk_ap);
  const rows = ARM.body.concat(ARM.head), weighs = rows.every(r => r.fatigue === null || typeof r.fatigue === 'number');
  leg(!!(A && A.source && A.quote && A.why) && ordered && free && top && Math.floor((ap - top.walk_ap) / flat) === Math.floor(ap / flat) - 1 && weighs,
    '*** A1 THE RULE IS DATA ***: ours.armour_weight, the classes in order, light and medium walk free, the heaviest one flat tile less, every armour row weighs',
    C && C.map(c => c.name + (c.below ? '<' + c.below : '') + ' -' + c.walk_ap).join(', ') + '; ' + rows.length + ' rows');
}

/* a board with him and the men we need, nothing else on it */
function stage(ctx, gear, weapon, opts) {
  const F = ctx.FIGHT; opts = opts || {};
  ctx.setSeed(opts.seed || 3);
  F.setup({ kind: 'suburb', formation: null, deploy: false, flat: true, company: [{ background: 'sellsword', gear: Object.assign({ main: weapon || 'rondel_dagger' }, gear) }, { background: 'militia' }], cap: 2, band: opts.band || ['brigand_thug', 'brigand_thug'] });
  const S = F.S, me = S.units.filter(u => u.side === 'you')[0], pal = S.units.filter(u => u.side === 'you')[1], th = S.units.filter(u => u.side === 'them');
  S.units.forEach(u => { u.fled = false; });
  me.x = 8; me.y = 6; pal.x = 2; pal.y = 1; th.forEach((t, i) => { t.x = 14 - i; t.y = 1 + i * 2; t.morale = 'Steady'; });
  S.order = [me.id, pal.id].concat(th.map(t => t.id)); S.idx = 0; me.ap = me.apTurn; me.walked = 0; me.fat = 0; me.begun = true; me.turnLog = S.log.length; S.round = Math.max(2, S.round || 1);
  if (opts.breath) me.fatigue = opts.breath;   /* a breath pool that is never the limit: the AP alone is measured */
  return { F, S, me, pal, th };
}

/* A2 */
{
  const ctx = engine(), F = ctx.FIGHT, T = F._t, W = ctx.DB.weapons.rows;
  const byClass = {}; W.forEach(w => { if (!w.class || byClass[w.class + w.hands] || !F.strikeSkill(w) || /net/i.test(w.name)) return; byClass[w.class + w.hands] = w; });
  const sample = Object.keys(byClass).map(k => byClass[k]);
  const tryStrike = (gear, w, real) => {
    const z = stage(ctx, gear, null, { breath: real ? 0 : 400 }); const { me, th, S } = z; me.weapon = Object.assign({}, w); me.loaded = true; me.ammo = me.ammoMax = 9; me.shield = null;
    th[1].x = 0; th[1].y = 0; th[1].fled = true;
    for (let d = 1; d <= 8; d++) { th[0].x = me.x + d; th[0].y = me.y; if (F.canStrike(me, th[0])) break; }
    const cls = T.weightClass(me).id, L0 = S.log.length, can = F.canStrike(me, th[0]), r = can ? F.strike(me, th[0]) : null;
    return { cls, ok: !!r && S.log.slice(L0).some(e => e.t === 'attack' && e.id === me.id), at: dist(me, th[0]) };
  };
  let same = 0, n = 0; const bad = [];
  sample.forEach(w => { const a = tryStrike(LIGHT, w), b = tryStrike(HEAVIEST, w); if (!a.ok) return; n++; if (b.ok && b.cls === 'heaviest') same++; else bad.push(w.id + ' ' + b.cls); });
  /* MEASURED, NOT THIS RULE'S: the armour's older Battle Brothers cost, its weight off his breath (gearFat), on a sellsword's own
     breath: the kinds of weapon he can swing in light and cannot in the heaviest because the swing costs more breath than he has */
  const breathBlocked = sample.filter(w => tryStrike(LIGHT, w, true).ok && !tryStrike(HEAVIEST, w, true).ok).map(w => w.id);
  /* every ability, the same context in light and in the heaviest */
  const ab = gear => F.ACTIVE.map(id => {
    const z = stage(ctx, gear, null, { breath: 400 }), { me, pal, th } = z;
    me.perks = [id]; pal.x = me.x - 1; pal.y = me.y; pal.morale = 'Breaking'; th[0].x = me.x + 1; th[0].y = me.y; me.fat = id === 'recover' ? 40 : 0;
    const can = F.canUse(me, id); let used = false;
    if (can) { const tg = F.needsTarget(id) ? F.skillTargets(me, id)[0] : undefined; used = !!F.useSkill(me, id, tg); }
    return id + ':' + (can ? 'yes' : 'no') + (used ? '/used' : '');
  });
  const lt = ab(LIGHT), hv = ab(HEAVIEST);
  /* walk one tile then strike: a one-hander (4) and a two-hander (6) */
  const walkStrike = main => { const z = stage(ctx, HEAVIEST, main, { breath: 400 }); const { me, th, S } = z; th[1].x = 0; th[1].y = 0; th[1].fled = true; th[0].x = me.x + 2; th[0].y = me.y;
    const moved = F.moveTo(me, me.x + 1, me.y), L0 = S.log.length, r = moved && F.canStrike(me, th[0]) ? F.strike(me, th[0]) : null;
    return T.weightClass(me).id + ' ' + me.weapon.hands + 'h walked ' + me.walked + ' AP: ' + (r && S.log.slice(L0).some(e => e.t === 'attack') ? 'struck' : 'no strike'); };
  const ws = [walkStrike('rondel_dagger'), walkStrike('two_handed_hammer')];
  leg(n >= 8 && same === n && lt.join() === hv.join() && hv.filter(x => /used/.test(x)).length >= 6 && /recover:yes\/used/.test(hv.join()) && ws.every(x => /^heaviest .*struck$/.test(x)),
    '*** A2 STANDING STILL, EVERYTHING HE OWNS ***: in the heaviest, unmoved, he strikes with every kind of weapon he can in light, every ability is his as in light, walk one tile then strike fits',
    same + ' of ' + n + ' weapons' + (bad.length ? ' (' + bad.slice(0, 3).join(', ') + ')' : '') + '; abilities ' + hv.join(' ') + (lt.join() === hv.join() ? '' : ' (light: ' + lt.join(' ') + ')') + '; ' + ws.join('; '));
  console.log('  note the armour\'s older breath cost (Battle Brothers\' weight off his breath, TUNING\'s, not this rule): on a sellsword\'s own breath, ' + breathBlocked.length + ' of ' + n + ' kinds of weapon swing in light and not in the heaviest' + (breathBlocked.length ? ' (' + breathBlocked.join(', ') + ')' : ''));
}

/* A3 */
{
  const ctx = engine(), F = ctx.FIGHT, T = F._t;
  const far = gear => { const z = stage(ctx, gear, null); const { me, th } = z; th.forEach(t => { t.x = 0; t.y = 0; t.fled = true; });
    const f = F.reach(me, null, true), S = F.S; let m = 0; Object.keys(f.best).forEach(k => { k = Number(k); m = Math.max(m, dist(me, { x: k % S.w, y: Math.floor(k / S.w) })); });
    return { cls: T.weightClass(me).id, tiles: m, cap: T.walkCap(me) }; };
  const l = far(LIGHT), h = far(HEAVY), hh = far(HEAVIEST);
  leg(l.tiles === 4 && h.tiles === 4 && hh.tiles === 3 && hh.cls === 'heaviest' && l.cls === 'light',
    '*** A3 ONE TILE SHORTER ON FLAT ***: his walking reach in light, heavy and the heaviest', JSON.stringify({ light: l, heavy: h, heaviest: hh }));
}

/* A4: AUTO for both sides, heavy men on both, every turn's walk against its cap; and the fight before this round */
function a4(ctx) {
  const F = ctx.FIGHT, T = F._t; let over = 0, turns = 0, capped = 0, heavyWalks = 0; const seen = new Set();
  for (let sd = 1; sd <= 8; sd++) {
    ctx.setSeed(100 + sd);
    F.setup({ kind: 'suburb', formation: null, deploy: false, auto: true, company: [{ background: 'sellsword', gear: Object.assign({ main: 'rondel_dagger' }, HEAVIEST) }, { background: 'retired_soldier', gear: Object.assign({ main: 'two_handed_hammer' }, HEAVIEST) }, { background: 'militia', gear: Object.assign({ main: 'crossbow' }, LIGHT) }, { background: 'brawler' }], cap: 4, band: ['fallen_hero', 'barbarian_chosen', 'brigand_thug', 'brigand_raider'] });
    const S = F.S; if (F.startFight) try { F.startFight(); } catch (e) {}
    let g = 0;
    while (!S.over && g++ < 3000) {
      const u = F.current(); if (!u) break;
      const k = u.id + '@' + S.round; F.aiStep(u);
      if (!u.decoy && T.weightClass(u).walk_ap > 0) { seen.add(u.side + ':' + T.weightClass(u).id); if ((u.walked || 0) > 0) heavyWalks++; }
      const cap = (u.apTurn || 0) - (T.weightClass(u).walk_ap || 0);
      if ((u.walked || 0) > cap) over++;
      if (F.current() !== u) { turns++; if (T.weightClass(u).walk_ap > 0 && (u.walked || 0) + 2 > cap && (u.walked || 0) <= cap) capped++; }
    }
  }
  return { over, turns, capped, heavyWalks, seen: Array.from(seen).sort().join(',') };
}
{
  const now = a4(engine());
  /* before: the walk spent the AP only (no cap), the walked count kept so the measure reads the same */
  const was = a4(engine({ patch: r => r.replace("if (budget !== Infinity) budget = Math.min(budget, walkCap(u));", '').replace("if (cost > walkLeft(u)) break;", 'if (cost > u.ap) break;').replace("budget = budget === undefined || budget === null ? walkLeft(u) : budget;", 'budget = budget === undefined || budget === null ? u.ap : budget;').replace('if (spent > walkLeft(u)) break;', 'if (spent > u.ap) break;') }));
  leg(now.over === 0 && now.heavyWalks > 0 && /you:heaviest/.test(now.seen) && /them:heaviest/.test(now.seen) && was.over > 0,
    '*** A4 AUTO AND THE ENEMY OBEY THE SAME CAP ***: 8 fights on AUTO, heaviest men on both sides: no turn walks past its class (the fight before: ' + was.over + ' did)',
    JSON.stringify(now));
}

(async () => {
  if (process.argv.indexOf('--headless-only') > 0) { console.log('\n=== HEAVY ARMOUR COSTS A TILE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  /* A5 the lit reach on the fight's own canvas */
  {
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, company: [{ background: 'sellsword', gear: Object.assign({ main: 'rondel_dagger' }, LIGHT) }], cap: 1, band: ['brigand_thug'] }) });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
    try {
      await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
      for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(200); }
      const r = await p.evaluate(([H, L]) => {
        const S = FIGHT.S, u = FIGHT.current(), th = S.units.filter(v => v.side === 'them');
        /* him in the middle of the open glass, the man of theirs far off, the board as it is */
        th.forEach(t => { t.x = 0; t.y = 0; });
        const row = id => DB.armor.body.concat(DB.armor.head).filter(r => r.id === id)[0];
        const vis = (x, y) => { const X = sx((x + .5) * FIGHT_UI.tw), Y = sy((y + .5) * FIGHT_UI.th); return X > OPEN.l + 8 && X < OPEN.r - 8 && Y > OPEN.t + 8 && Y < OPEN.b - 8 ? { X, Y } : null; };
        let spot = null;
        for (let y = 1; y < S.h - 1 && !spot; y++) for (let x = 4; x < S.w - 5 && !spot; x++) {
          let ok = true; for (let k = 0; k <= 4; k++) if (!FIGHT._t.passable(x + k, y) || FIGHT._t.unitAt(x + k, y) && FIGHT._t.unitAt(x + k, y) !== u) ok = false;
          if (ok && vis(x, y) && vis(x + 4, y)) spot = { x, y };
        }
        if (!spot) return { err: 'no open row of five on the glass' };
        u.x = spot.x; u.y = spot.y; u.ap = u.apTurn; u.walked = 0; FIGHT_UI.pend = null;
        const cv = document.getElementById('cv'), g = cv.getContext('2d'), sc = cv.width / cv.getBoundingClientRect().width;
        const px = (x, y) => { const v = vis(x, y), d = g.getImageData(Math.round(v.X * sc) - 2, Math.round(v.Y * sc) - 2, 5, 5).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s / (d.length / 4) / 3; };
        const shot = (b, h) => { u.bodyRow = row(b); u.headRow = row(h); hud(); draw(performance.now()); return { cls: FIGHT._t.weightClass(u).id, d3: px(spot.x + 3, spot.y), d4: px(spot.x + 4, spot.y) }; };
        const a = shot(L.body, L.head), b = shot(H.body, H.head), c = shot(L.body, L.head);
        return { a, b, c, spot };
      }, [HEAVIEST, LIGHT]);
      const ok = r && !r.err && r.a.cls === 'light' && r.b.cls === 'heaviest' && r.a.d4 - r.b.d4 > 6 && Math.abs(r.a.d3 - r.b.d3) < 3 && Math.abs(r.a.d4 - r.c.d4) < 3;
      leg(ok, '*** A5 THE LIT REACH ON THE GLASS *** [upright 390 x 844]: 4 flat tiles off lit in light, dark in the heaviest; 3 off lit in both', JSON.stringify(r && (r.err || { light: r.a, heaviest: r.b, light_again: r.c })));
    } catch (e) { leg(false, 'A5 ran', String(e.message).slice(0, 200)); }
    leg(errs.length === 0, '  nothing threw (the fight)', errs.slice(0, 2).join(' | ') || 'none');
    await d.close();
  }
  /* A6 the shop's card and the crew card */
  {
    const { chromium } = require('playwright'), http = require('http');
    const srv = http.createServer((q, s) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': /\.html$/.test(f) ? 'text/html' : /\.js$/.test(f) ? 'text/javascript' : /\.json$/.test(f) ? 'application/json' : /\.png$/.test(f) ? 'image/png' : 'application/octet-stream' }); s.end(b); }); });
    await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port;
    const br = await chromium.launch(), errs = [];
    try {
      const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
      const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
      /* his company as the start screen hands it (BOH_START.picks): one man in a full helm and a padded vest */
      await p.addInitScript(() => { window.BOH_START = { picks: () => ({ origin: 'gate', company: [{ background: 'sellsword', stats: { hp: 60, fatigue: 100, resolve: 40, initiative: 100, melee_skill: 55, ranged_skill: 40, melee_defense: 5, ranged_defense: 5 }, perks: [], gear: { main: 'rondel_dagger', head: 'full_helm', body: 'padded_vest' } }] }) }; });
      await p.goto(base + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
      await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
      /* a fortress's armourer, as THE SHOP KEEPS ITS ARMOUR opens it; his finger on each armour piece on the shelf */
      await p.evaluate(() => { try { localStorage.removeItem('bohemia.bag.v1'); } catch (e) {} BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' }, batteries: 9000 }); });
      await p.waitForTimeout(800);
      await p.evaluate(() => { const s = document.getElementById('sheet'); if (s && s.classList.contains('on')) document.getElementById('close').click(); }); await p.waitForTimeout(300);
      const xy = await p.evaluate(() => BohemiaSettlement.where('armourer')); await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(1200);
      await p.waitForFunction(() => BohemiaRoster.data && BohemiaRoster.data.ours, null, { timeout: 20000 });
      const ids = await p.evaluate(() => { const all = [...document.querySelectorAll('#shelfgrid .slot')].filter(x => x.__it && /^(body|head)$/.test(x.__it.kind)).map(x => x.__it.kind + ':' + x.__it.id);
        return all.filter(i => i === 'body:coat_of_plates').concat(all.filter(i => i !== 'body:coat_of_plates')).slice(0, 4); });
      const lines = [];
      for (const id of ids) {
        const at = await p.evaluate(id => { const s = [...document.querySelectorAll('#shelfgrid .slot')].find(x => x.__it && (x.__it.kind + ':' + x.__it.id) === id); if (!s) return null; s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
        if (!at) continue; await p.touchscreen.tap(at.x, at.y); await p.waitForTimeout(500);
        lines.push(await p.evaluate(id => { const l = document.querySelector('.onman .wcls'), box = document.querySelector('.onman'); return { id, man: box && box.dataset.man, line: l ? l.textContent : null, cls: l && l.dataset.cls }; }, id));
      }
      const shop = { lines, said: lines.filter(l => l.line && /^ARMOUR CLASS(LIGHT|MEDIUM|HEAVY|HEAVIEST)( to (LIGHT|MEDIUM|HEAVY|HEAVIEST))?, (WALKS FREE|ONE LESS TILE|\d LESS TILES|SLOWER ON ROUGH GROUND)$/.test(l.line.replace(/^ARMOUR CLASS\s*/, 'ARMOUR CLASS'))).length };
      const crew = await p.evaluate(() => { const W = BohemiaRoster.worn({ stats: {}, perks: [], gear: { body: 'coat_of_plates', head: 'full_helm' } }); return W.weight.say; });
      /* the crew screen's card: a man in the heaviest */
      const q = await ctx.newPage(); q.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
      await q.goto(base + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
      await q.waitForTimeout(2500);
      const card = await q.evaluate(() => { const els = [].slice.call(document.querySelectorAll('.wcls')); return { n: els.length, first: els[0] ? els[0].textContent : null }; });
      const plates = shop.lines.filter(l => l.id === 'body:coat_of_plates')[0];
      leg(shop.lines.length >= 2 && shop.said === shop.lines.length && (!plates || /to HEAVIEST, ONE LESS TILE$/.test(plates.line)) && /HEAVIEST, ONE LESS TILE/.test(crew) && card.n > 0 && /^ARMOUR: (LIGHT|MEDIUM|HEAVY|HEAVIEST)/.test(card.first),
        '*** A6 THE SHOP AND THE CREW CARD SAY IT *** [upright 390 x 844, touch]: every armour piece his finger picks at the armourer names the class he would wear and his walk; a coat of plates on a full helm is HEAVIEST, ONE LESS TILE; the crew card names his class',
        JSON.stringify({ shop: shop.lines.map(l => l.id + ' on ' + l.man + ': ' + l.line), coat_of_plates_and_full_helm: crew, crew_card: card }));
    } catch (e) { leg(false, 'A6 ran', String(e.message).slice(0, 200)); }
    leg(errs.length === 0, '  nothing threw (the shop, the crew screen)', errs.slice(0, 2).join(' | ') || 'none');
    await br.close(); srv.close();
  }
  console.log('\n=== HEAVY ARMOUR COSTS A TILE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env node
/* EVERY WEAPON HAS ITS RANGE BANDS (rule 187, Paolo 10/25: 'certain weapons will have their range accuracy; all weapons can shoot
   the tile next to them, depending on the type: a rifle shooting one tile next to it might be a range debuff; a shotgun, the
   closer you are, after one or two tiles'; records/BOHEMIA_PAOLO_EVERY_WEAPON_HAS_ITS_RANGE_BANDS_10_25_26.md). COMBAT built the
   first bands 10/26 (34e0a072, its own seed numbers 'until TUNING's land'); WEAPONS 11/7 (ask line 108, the coordinator: 'every
   weapon has its RANGE BANDS (a rifle debuffed point-blank, a shotgun deadliest close and weak far, a pistol best short, a scope
   long), shown on the tiles the way reach is lit, numbers in TUNING's one table... gate with planted fails') put TUNING's numbers
   live, gave every ranged weapon its band (the bow, the thrown things, the scoped deer rifle's own), the range card on the ground
   and the storeys' agreement with COMBAT TWO (rule 428(b), handoffs/WEAPONS.md).
   MEASURED BEFORE (main aecbd030): 3 of the 6 ranged families had a band (pistol, shotgun, rifle) and its numbers were COMBAT's
   seed, not the one table's (the rifle -15 where the table says -10, the shotgun 0.7 at two where the table says whole to two);
   the scoped deer rifle fought as a plain rifle (6 tiles, -15 point-blank, best at the next tile but one); a shotgun on a roof hit
   WHOLE at three and four tiles (the band listed only tile 2, so a roof's extra tiles read 1); the tiles showed the band nowhere
   (only the aim line said it), the tape stopped at the row's reach while a roof shot went a tile further, and a bow or a sling had
   no tape at all.
   Legs:
   T1 THE ONE TABLE: ours.range_bands carries exactly the numbers TUNING's one table writes in section N (band.rifle_close,
      band.shotgun_damage, band.scope, band.bow_close), and the table says they are live;
   B1 every ranged row of weapons.json fights by a band; a row that names one (the scoped deer rifle's 'scope') fights by it, at
      the scope's reach;
   B2 the rules, every ranged row at every tile it reaches on open flat ground: the chance is the class's line plus the band's
      points (the scope's own line), the damage that arrives is the band's share (the hit and the preview read the same);
   B3 THE STOREYS ADD, NEVER MULTIPLY (428(b), the agreement): from a roof of 1, 2 and 3 storeys a shotgun reaches 2 + the storeys'
      tiles (reachUp), the band reads the true distance (whole to 2, 0.6 at 3, 0.35 at 4 and past it, never whole again), and the
      chance from the roof is the chance on the flat plus exactly the storeys' points;
   B4 THE RANGE CARD TELLS THE TRUTH (187(c)): every ranged row's card (FIGHT.bandCard) marks a ring weak exactly where the rules'
      own chance there is weak_at below his best ring, or the band cuts it; and his examples hold: the rifle weak point-blank, the
      shotgun best at the next tile, the pistol best short, the scope best from three tiles to its far end;
   B5 rolled AUTO fights: the hits at each distance land at the chance the rules gave them (both sides, every band with a hundred
      shots at a distance);
   B6 AUTO reads the bands (187(d)): AUTO's own estimate of a shot is the chance times the band's share at that distance; and in the
      rolled fights the bows of theirs fire point-blank less than with the bands zeroed;
   B7 the page, his phone (390 x 844 at 3x) and his computer (1440 x 900): a rifleman's ground taped with the next ring hatched in
      his tape and a strip on it, the clean ground his sweet spot (pixels counted on the glass); aiming at the man beside him the line
      says point-blank and the band's points; the scope's words say 1 to 8 tiles, best at 3 to 8;
   P  PLANTED: (1) the rifle's point-blank zeroed in the data: T1 and B4 go red; (2) the scoped deer rifle's band taken off its row:
      B1 goes red; (3) the step broken (a roof's tile past the last listed reads whole): B3 goes red; (4) the page draws no hatch:
      B7's pixels go red;
   B8 nothing threw.
   Run: node gates/every_weapon_has_its_range_bands_gate.js   (BANDS_SKIP_PAGE=1 skips B7 and P4; about 4 minutes in all) */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== EVERY WEAPON HAS ITS RANGE BANDS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const KINDS = ['strip', 'suburb', 'culdesac', 'ruin', 'desert', 'freeway'];
const TABLE = path.join(ROOT, 'records/BOHEMIA_TUNING_THE_ONE_TABLE_10_17_26.md');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const errs = [];
const BROKEN_STEP = s => s.replace('if (i <= n && i >= at) { at = i; m = D[s]; }', 'if (i === n) { at = i; m = D[s]; }');

/* ---- T1: the one table's section N, read as numbers ---- */
function tableBands() {
  const rows = {};
  fs.readFileSync(TABLE, 'utf8').split('\n').forEach(l => { const m = l.match(/^\| (band\.[a-z_]+) \| ([^|]+) \|(.*)$/); if (m) rows[m[1]] = { value: m[2].trim(), rest: m[3] }; });
  const num = (s, re) => { const m = s.match(re); return m ? Number(m[1]) : null; };
  const want = { pistol: { hit: {}, dmg: {} }, shotgun: { hit: {}, dmg: {} }, rifle: { hit: {}, dmg: {} }, scope: { hit: {}, dmg: {} }, bow: { hit: {}, dmg: {} } };
  const r = k => (rows[k] || { value: '' }).value;
  const rc = num(r('band.rifle_close'), /(-\d+) at the next tile/); if (rc !== null) want.rifle.hit['1'] = rc;
  const bc = num(r('band.bow_close'), /(-\d+) at the next tile/); if (bc !== null) want.bow.hit['1'] = bc;
  (r('band.shotgun_damage').match(/x(0\.\d+) at (\d+)/g) || []).forEach(s => { const m = s.match(/x(0\.\d+) at (\d+)/); want.shotgun.dmg[m[2]] = Number(m[1]); });
  const sc = r('band.scope'), s1 = num(sc, /(-\d+) at the next tile/), s2 = num(sc, /(-\d+) at two/), ln = sc.match(/([+-]\d+), -(\d+) a tile past (\d+)/);
  if (s1 !== null) want.scope.hit['1'] = s1; if (s2 !== null) want.scope.hit['2'] = s2;
  if (ln) want.scope.line = { base: Number(ln[1]), per_tile: -Number(ln[2]), free: Number(ln[3]) };
  want.scope.reach = num(sc, /reach 1 to (\d+)/);
  const live = ['band.rifle_close', 'band.shotgun_damage', 'band.scope', 'band.bow_close'].filter(k => !rows[k] || !/\blive\b/.test(rows[k].rest));
  return { want, rows, live };
}
function checkTable(DB) {
  const T = tableBands(), have = DB.ours.range_bands.value, bad = [];
  Object.keys(T.want).forEach(k => {
    const w = T.want[k], h = have[k] || {};
    const same = (a, b) => JSON.stringify(Object.keys(a || {}).sort().map(x => [x, a[x]])) === JSON.stringify(Object.keys(b || {}).sort().map(x => [x, b[x]]));
    if (!same(w.hit, h.hit_by_tile)) bad.push(k + ' hit ' + JSON.stringify(h.hit_by_tile) + ' table ' + JSON.stringify(w.hit));
    if (!same(w.dmg, h.damage_by_tile)) bad.push(k + ' damage ' + JSON.stringify(h.damage_by_tile) + ' table ' + JSON.stringify(w.dmg));
    if (w.line && JSON.stringify(w.line) !== JSON.stringify(h.line)) bad.push(k + ' line ' + JSON.stringify(h.line) + ' table ' + JSON.stringify(w.line));
  });
  return { bad, live: T.live, reach: T.want.scope.reach };
}

/* ---- a shooter and one man of theirs on a straight open row of flat ground ---- */
function lane(ctx) {
  const F = ctx.FIGHT, T = F._t;
  ctx.setSeed(3); F.setup({ seed: 3, kind: 'scrub', auto: true, formation: null, deploy: false, flat: true, party: { faction: 'brigands', count: 2, days: 1 } });
  const S = F.S, a = S.units.find(u => u.side === 'you'), t = S.units.find(u => u.side === 'them');
  S.units.forEach(u => { if (u !== a && u !== t) u.fled = true; });
  let row = null; for (let y = 0; y < S.h && row === null; y++) { let ok = true; for (let x = 0; x < 10; x++) if (!T.passable(x, y) || F.level(x, y) || S.coverCount[y][x]) ok = false; if (ok) row = y; }
  const arm = w0 => { const w = T.pistolShot(w0) || w0; a.weapon = w; a.loaded = true; a.ammo = w.mag || null; a.ap = 99; a.fat = 0; a.rskill = 60; t.rdef = 10; t.shield = null; t.armB = 0; t.armH = 0; t.hp = t.hpMax = 999; a.x = 0; a.y = row; return w; };
  return { F, T, S, a, t, row, arm };
}
/* every row that shoots: the bow, crossbow (the rifle), firearm (the shotgun) and thrown rows, and the pistols, which are dagger rows
   carried as their shot (rule 195, pistolShot) */
const rangedRows = ctx => (ctx.DB.weapons.rows || ctx.DB.weapons).filter(w => ctx.FIGHT.isRanged(ctx.FIGHT._t.pistolShot(w) || w));

/* B1 */
function checkRows(ctx, reach) {
  const F = ctx.FIGHT, bad = [];
  rangedRows(ctx).forEach(w0 => {
    const w = F._t.pistolShot(w0) || w0, b = F.rangeBandOf(w);
    if (!b) { bad.push(w0.id + ': no band'); return; }
    if (/scope/i.test(w0.name) && (b !== ctx.DB.ours.range_bands.value.scope || w0.range_max !== reach)) bad.push(w0.id + ': a scoped rifle fights by ' + (b === ctx.DB.ours.range_bands.value.scope ? 'the scope' : 'another band') + ' at ' + w0.range_max + ' tiles');
    if (w0.band && b !== ctx.DB.ours.range_bands.value[w0.band]) bad.push(w0.id + ': names ' + w0.band + ' and fights by another');
  });
  return bad;
}
/* B2 */
function checkRules(ctx) {
  const L = lane(ctx), { F, a, t, row } = L, bands = ctx.DB.ours.range_bands.value, R = ctx.DB.rules || null;
  let checked = 0; const bad = [];
  rangedRows(ctx).forEach(w0 => {
    const w = L.arm(w0), b = F.rangeBandOf(w), line = F.shotLineOf(w);
    for (let d = 1; d <= 9; d++) {
      a.x = 0; a.y = row; t.x = d; t.y = row; if (!F.canStrike(a, t)) continue;
      const withB = F.hitChance(a, t).chance, pw = F.preview(a, t);
      const keep = JSON.stringify(bands); Object.keys(bands).forEach(k => { bands[k] = { hit_by_tile: {}, damage_by_tile: {} }; });
      const bare = F.hitChance(a, t).chance, bl = F.shotLineOf(w), pb = F.preview(a, t);
      Object.keys(bands).forEach(k => delete bands[k]); Object.assign(bands, JSON.parse(keep));
      const lineDelta = (line.base + line.per * Math.max(0, d - line.free)) - (bl.base + bl.per * Math.max(0, d - bl.free));
      const want = bare + lineDelta + ((b.hit_by_tile || {})[String(d)] || 0);
      checked++;
      if (withB !== Math.max(5, Math.min(95, want)) && Math.abs(withB - want) > 1) bad.push(w0.id + '@' + d + ' chance ' + withB + ' want ' + want);
      const share = F.bandAt(b, d).dmg, ratio = pw.hp / Math.max(1, pb.hp);
      if (Math.abs(ratio - share) > 0.03 && pb.hp > 3) bad.push(w0.id + '@' + d + ' damage ' + pw.hp + '/' + pb.hp + ' want x' + share);
    }
  });
  return { checked, bad };
}
/* B3 */
function checkRoofs(ctx) {
  const L = lane(ctx), { F, S, a, t, row } = L, bad = [], seen = [];
  const sg = ctx.DB.weapons.rows.find(w => w.id === 'pump_shotgun'); L.arm(sg);
  const per = F.reachUp ? null : 'no reachUp'; if (per) return { bad: [per], seen };
  const flat = {}; for (let d = 1; d <= 6; d++) { t.x = d; t.y = row; if (F.canStrike(a, t)) flat[d] = F.hitChance(a, t).chance; }
  const H = ctx.DB.ours.height_is_accuracy.value.above_per_storey, keepT = S.terrain[row][0];
  [['height', 1], ['height2', 2], ['height3', 3]].forEach(([name, n]) => {
    S.terrain[row][0] = name; const lv = F.level(0, row), up = F.reachUp(a, { x: 1, y: row });
    let far = 0;
    for (let d = 1; d <= 7; d++) {
      t.x = d; t.y = row; if (!F.canStrike(a, t)) continue; far = d;
      const bd = F.band(a, t), want = d <= 2 ? 1 : d === 3 ? 0.6 : 0.35, ch = F.hitChance(a, t).chance, chWant = Math.min(95, (flat[Math.min(d, 2)] - (d > 2 ? 10 * (d - 2) : 0)) + H * lv);
      if (Math.abs(bd.dmg - want) > 1e-9) bad.push(name + ' @' + d + ' damage x' + bd.dmg + ' want x' + want);
      if (Math.abs(ch - chWant) > 1) bad.push(name + ' @' + d + ' chance ' + ch + ' want ' + chWant);
      seen.push(lv + 'up@' + d + ':x' + bd.dmg);
    }
    if (far !== 2 + up) bad.push(name + ' reaches ' + far + ' want ' + (2 + up));
  });
  S.terrain[row][0] = keepT;
  return { bad, seen };
}
/* B4 */
function checkCard(ctx) {
  const L = lane(ctx), { F, a, t, row } = L, C = ctx.DB.ours.range_bands_card.value, bad = [], best = {};
  rangedRows(ctx).forEach(w0 => {
    const w = L.arm(w0), card = F.bandCard(a); if (!card) { bad.push(w0.id + ': no card'); return; }
    t.rdef = 0; const ch = {};
    card.rings.forEach(r => { t.x = r.d; t.y = row; if (F.canStrike(a, t)) ch[r.d] = F.hitChance(a, t).chance; });
    const top = Math.max.apply(null, Object.values(ch));
    card.rings.forEach(r => { if (ch[r.d] === undefined) return; const bd = F.bandAt(F.rangeBandOf(w), r.d);
      const weak = bd.hit < 0 || bd.dmg < 1 || ch[r.d] - top <= C.weak_at;
      if (weak !== r.weak) bad.push(w0.id + ' ring ' + r.d + ' card ' + (r.weak ? 'weak' : 'sweet') + ', the rules ' + ch[r.d] + ' of best ' + top); });
    best[w0.id] = card.best;
  });
  const has = (id, f) => best[id] && f(best[id]);
  if (!has('light_crossbow', b => b[0] >= 2)) bad.push('the rifle is not weak point-blank: ' + JSON.stringify(best.light_crossbow));
  if (!has('pump_shotgun', b => b[0] === 1)) bad.push('the shotgun is not best at the next tile: ' + JSON.stringify(best.pump_shotgun));
  if (!has('dagger', b => b[1] <= 2)) bad.push('the pistol is not best short: ' + JSON.stringify(best.dagger));
  if (!has('scoped_deer_rifle', b => b[0] >= 3 && b[1] === ctx.DB.weapons.rows.find(w => w.id === 'scoped_deer_rifle').range_max)) bad.push('the scope is not best far: ' + JSON.stringify(best.scoped_deer_rifle));
  return { bad, best };
}

(async () => {
  const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB;
  /* T1 */
  const tb = checkTable(DB);
  leg(tb.bad.length === 0 && tb.live.length === 0, '*** T1 THE NUMBERS ARE THE ONE TABLE\'S *** (rule 187(b), TUNING section N): the rifle\'s and the bow\'s point-blank, the shotgun\'s spread, the scope\'s line and its close cuts, live in the table',
    tb.bad.concat(tb.live.map(k => k + ' not marked live')).join('; ') || JSON.stringify(DB.ours.range_bands.value));
  /* B1 */
  const rb = checkRows(ctx, tb.reach);
  leg(rb.length === 0, '*** B1 EVERY RANGED WEAPON HAS ITS BAND *** (rule 187(a)): ' + rangedRows(ctx).length + ' ranged rows; the scoped deer rifle fights by the scope, ' + tb.reach + ' tiles', rb.slice(0, 4).join('; '));
  /* B2 */
  const rr = checkRules(ctx);
  leg(rr.checked >= 60 && rr.bad.length === 0, '*** B2 THE RULES READ THE BAND *** (rule 187(a)): every ranged row at every tile it reaches, the chance its line plus the band, the damage the band\'s share',
    rr.checked + ' row and distance pairs' + (rr.bad.length ? ', off: ' + rr.bad.slice(0, 3).join('; ') : ''));
  /* B3 */
  const ro = checkRoofs(ctx);
  leg(ro.bad.length === 0, '*** B3 THE STOREYS ADD, NEVER MULTIPLY *** (rule 428(b), the agreement with COMBAT TWO): a shotgun on 1, 2, 3 storeys reaches 2 + the storeys, its band by the true distance (never whole again past two), its chance the flat\'s plus the storeys\' points',
    ro.bad.length ? ro.bad.slice(0, 3).join('; ') : ro.seen.join(' '));
  /* B4 */
  const cc = checkCard(ctx);
  leg(cc.bad.length === 0, '*** B4 THE RANGE CARD TELLS THE TRUTH *** (rule 187(c)): every ranged row\'s card weak exactly where the rules\' chance is, the rifle weak point-blank, the shotgun best beside him, the pistol best short, the scope best far',
    cc.bad.length ? cc.bad.slice(0, 3).join('; ') : 'best: ' + ['dagger', 'pump_shotgun', 'light_crossbow', 'scoped_deer_rifle', 'hunting_bow', 'staff_sling'].map(k => k + ' ' + JSON.stringify(cc.best[k])).join(', '));

  /* B5, B6: rolled AUTO fights, with the bands, and with them zeroed */
  const keyOf = (G, w) => w.band || (w.of || w).band || G.jobOfWeapon(w);
  const play = zero => {
    const c = engine();
    if (zero) { const v = c.DB.ours.range_bands.value; Object.keys(v).forEach(k => { v[k] = { hit_by_tile: {}, damage_by_tile: {} }; }); }
    const G = c.FIGHT, by = {}; let won = 0, fights = 0, est = 0, estBad = [];
    for (const kind of KINDS) for (let seed = 1; seed <= 10; seed++) {
      try {
        c.setSeed(seed); G.setup({ seed, kind, auto: true, formation: null, deploy: false, party: { faction: 'brigands', count: 8, days: 20 } });
        const S2 = G.S; S2.deploy = false; fights++;
        for (let g = 0; g < 6000 && !S2.over && G.current() && S2.round <= 40; g++) {
          const u = G.current();
          if (!zero && est < 400 && G.isRanged(u.weapon)) G.S.units.filter(t => t.side !== u.side && G.onField(t)).forEach(t => { if (est >= 400 || !G.canStrike(u, t)) return; est++;
            const e = G._t.expected ? G._t.expected(u, t) : null, bd = G.band(u, t), want = G.hitChance(u, t, G.strikeSkill(u.weapon)).chance * (u.weapon.damage_min + u.weapon.damage_max) / 2 * (bd ? bd.dmg : 1) / Math.max(1, t.hp + t.armB);
            if (e === null || Math.abs(e - want) > 1e-6 * Math.max(1, want)) estBad.push(u.weapon.id + '@' + Math.max(Math.abs(u.x - t.x), Math.abs(u.y - t.y))); });
          const n0 = S2.log.length; G.aiStep(u);
          S2.log.slice(n0).forEach(e => { if (e.t !== 'attack' || !e.shot || e.free) return; const x = G.byId(e.id), y = G.byId(e.to); if (!x || !y) return;
            const k = (x.side === 'you' ? 'you:' : 'them:') + keyOf(G, x.weapon) + '@' + Math.max(Math.abs(x.x - y.x), Math.abs(x.y - y.y));
            const q = by[k] = by[k] || { n: 0, h: 0, ch: 0 }; q.n++; q.ch += e.chance; if (e.hit) q.h++; });
        }
        if (S2.result === 'won') won++;
      } catch (e) { errs.push((zero ? 'zeroed ' : '') + kind + seed + ': ' + e.message.slice(0, 120)); }
    }
    return { by, won, fights, est, estBad };
  };
  const now = play(false), was = play(true);
  const off = []; let buckets = 0;
  Object.keys(now.by).forEach(k => { const q = now.by[k]; if (q.n < 100) return; buckets++; const rate = 100 * q.h / q.n, shown = q.ch / q.n, se = 100 * Math.sqrt(shown / 100 * (1 - shown / 100) / q.n);
    if (Math.abs(rate - shown) > Math.max(6, 2.6 * se)) off.push(k + ' ' + Math.round(rate) + '% hit, ' + Math.round(shown) + '% shown, n ' + q.n); });
  leg(buckets >= 6 && off.length === 0, '*** B5 THE HITS LAND AT THE CHANCE THE RULES GAVE *** (rule 187(e)): every band and distance with a hundred shots or more, both sides, within 6 points or 2.6 of the bucket\'s own spread',
    buckets + ' buckets' + (off.length ? ', off: ' + off.slice(0, 3).join('; ') : ', all within'));
  const n = (r, k) => (r.by[k] || { n: 0 }).n, tot = (r, s, j) => [1, 2, 3, 4, 5, 6, 7, 8].reduce((m, d) => m + n(r, s + ':' + j + '@' + d), 0);
  const bowNow = n(now, 'them:bow@1') / Math.max(1, tot(now, 'them', 'bow')), bowWas = n(was, 'them:bow@1') / Math.max(1, tot(was, 'them', 'bow'));
  leg(now.est >= 100 && now.estBad.length === 0 && bowNow < bowWas,
    '*** B6 AUTO READS THE BANDS *** (rule 187(d)): AUTO\'s estimate of every shot it weighs is the chance times the band\'s share there; their bows fire point-blank less than with the bands zeroed',
    now.est + ' shots weighed' + (now.estBad.length ? ', off: ' + now.estBad.slice(0, 3).join('; ') : ', all the band\'s') + '; their bows point-blank ' + Math.round(100 * bowWas) + '% -> ' + Math.round(100 * bowNow) + '% of their shots; won ' + was.won + ' (zeroed) -> ' + now.won + ' of ' + now.fights + ' (wins are noise at 60: over 354 fights each, 200 with the bands, 203 zeroed, WEAPONS 11/7)');

  /* P1 to P3: planted on the headless rules */
  { const c = engine(); c.DB.ours.range_bands.value.rifle.hit_by_tile = {};
    const t1 = checkTable(c.DB), c4 = checkCard(c);
    leg(t1.bad.length > 0 && c4.bad.some(s => /rifle is not weak point-blank/.test(s)), 'P1 PLANTED: the rifle\'s point-blank zeroed in the data: T1 and B4 go red', t1.bad[0] + ' | ' + c4.bad.filter(s => /rifle/.test(s))[0]); }
  { const c = engine(); delete c.DB.weapons.rows.find(w => w.id === 'scoped_deer_rifle').band;
    const b1 = checkRows(c, tb.reach); leg(b1.some(s => /scoped_deer_rifle/.test(s)), 'P2 PLANTED: the scoped deer rifle\'s band taken off its row: B1 goes red', b1[0]); }
  { const c = engine({ patch: BROKEN_STEP }); const b3 = checkRoofs(c);
    leg(b3.bad.some(s => /damage x1 want x0\.35/.test(s)), 'P3 PLANTED: the step broken (a roof\'s tile past the last listed reads whole): B3 goes red', b3.bad.filter(s => /x1 want/.test(s))[0]); }

  /* B7 and P4: the page */
  if (!process.env.BANDS_SKIP_PAGE) {
    const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    const page = async (profile, planted) => {
      const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile, arm: 'window.FIGHT_OPTS=' + JSON.stringify({ seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'], teach: false, odds: false }) });
      const p = d.page; p.on('pageerror', e => errs.push(profile + ': ' + e.message));
      try {
        await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
        for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : crewControlled(u) && !FIGHT_UI.anim.length ? 'mine' : 'wait'; }); if (st === 'mine') break; await p.waitForTimeout(250); }
        if (planted) await p.evaluate(() => { window.mkHatchTape = function () {}; });
        /* a rifleman with an open row of six tiles toward one man of theirs */
        const set = id => p.evaluate(id => { const S = FIGHT.S, u = FIGHT.current(), T = FIGHT._t, th = S.units.filter(v => v.side === 'them' && FIGHT.onField(v));
          S.units.forEach(v => { if (v.side === 'them' && v !== th[0]) v.fled = true; }); const t = th[0];
          u.weapon = DB.weapons.rows.find(w => w.id === id); u.loaded = true; u.ammo = null; u.ap = u.apTurn; u.fat = 0;
          for (let y = 2; y < S.h - 2; y++) for (let x = 2; x + 4 < S.w - 2; x++) {
            let ok = true; for (let k = -1; k <= 4; k++) if (!T.passable(x + k, y) || FIGHT.level(x + k, y) || S.units.some(v => v !== u && v !== t && FIGHT.onField(v) && v.x === x + k && v.y === y)) ok = false;
            if (!ok) continue;
            u.x = x; u.y = y; t.x = x + 1; t.y = y; if (!FIGHT.canStrike(u, t)) continue;
            FIGHT_UI.pend = null; FIGHT_UI.glide = null; FIGHT_UI.cx = (x + 2.5) * FIGHT_UI.tw; FIGHT_UI.cy = (y + .5) * FIGHT_UI.th; clampCam(); hud();
            const qx = sx((x + 1.5) * FIGHT_UI.tw), qy = sy((y + .5) * FIGHT_UI.th), top = document.getElementById('top').getBoundingClientRect().bottom;
            if (!(qx > 30 && qx < innerWidth - 30 && qy > top + 40 && qy < innerHeight - BOTH - 40)) continue;
            return { x, y, t: { x: x + 1, y }, chance: FIGHT.hitChance(u, t).chance, band: FIGHT.band(u, t), words: reachWords(u) };
          }
          return null; }, id);
        const r = await set('light_crossbow');
        if (!r) return { err: 'no open row' };
        await p.waitForTimeout(500);
        /* the glass: his tape's pixels inside the next ring's tile beyond the man (weak, hatched) and inside a tile three out (sweet) */
        const px = await p.evaluate(q => {
          const c = document.getElementById('cv'), g = c.getContext('2d'), out = {};
          for (const [name, dx, dy] of [['weak', -1, 0], ['sweet', 3, 0]]) {
            const X = q.x + dx, Y = q.y + dy;
            const x0 = Math.round(sx((X + .2) * FIGHT_UI.tw) * DPR), y0 = Math.round(sy((Y + .2) * FIGHT_UI.th) * DPR), x1 = Math.round(sx((X + .8) * FIGHT_UI.tw) * DPR), y1 = Math.round(sy((Y + .8) * FIGHT_UI.th) * DPR);
            const d = g.getImageData(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)).data; let n = 0;
            for (let i = 0; i < d.length; i += 4) if (d[i] === 0xca && d[i + 1] === 0xc9 && d[i + 2] === 0xc1) n++;
            out[name] = { n, area: (x1 - x0) * (y1 - y0) };
          }
          return { px: out, lit: FIGHT_UI.bandLit && { weak: FIGHT_UI.bandLit.weak, best: FIGHT_UI.bandLit.best, labels: FIGHT_UI.bandLit.labels } };
        }, r);
        /* the aim at the man beside him */
        const at = await p.evaluate(q => ({ x: sx((q.x + .5 + stagger(q.y)) * FIGHT_UI.tw), y: sy((q.y + .6) * FIGHT_UI.th) }), r.t);
        let said = '';
        for (const dy of [0, -.15, .2]) {
          const a2 = { x: at.x, y: at.y + dy * (await p.evaluate(() => FIGHT_UI.th * FIGHT_UI.zoom)) };
          if (profile === 'computer') { await p.mouse.move(a2.x - 20, a2.y - 20); await p.mouse.move(a2.x, a2.y, { steps: 3 }); } else await p.touchscreen.tap(a2.x, a2.y);
          await p.waitForTimeout(500);
          said = await p.evaluate(() => document.getElementById('say').innerText);
          if (/% to hit/.test(said)) break;
          await p.evaluate(() => { FIGHT_UI.pend = null; hud(); });
        }
        await p.evaluate(() => { FIGHT_UI.pend = null; hud(); });
        const sc = await set('scoped_deer_rifle');
        return { r, px, said, scope: sc && sc.words };
      } catch (e) { return { err: e.message.slice(0, 160) }; }
      finally { await d.close(); }
    };
    for (const profile of ['phone_portrait', 'computer']) {
      const g = await page(profile, false);
      if (g.err) { leg(false, 'B7 ' + profile + ': the page', g.err); continue; }
      const w = g.px.px.weak, s = g.px.px.sweet, lit = g.px.lit || {};
      const okTiles = w.n >= Math.max(12, w.area * .02) && s.n <= w.n / 4 && lit.labels && lit.labels.some(q => q.d === 1);
      const okSay = /Point-blank/.test(g.said) && new RegExp('-' + (-g.r.band.hit) + '%').test(g.said) && g.said.indexOf(g.r.chance + '%') >= 0;
      const okScope = /1 to 8 tiles, best at 3 to 8/.test(g.scope || '');
      leg(okTiles && okSay && okScope, '*** B7 ' + (profile === 'computer' ? 'COMPUTER' : 'PHONE') + ': THE TILES SHOW THE BAND *** (rule 187(c)): the rifle\'s next ring hatched in his tape with its strip, his sweet spot clean, the aim says point-blank and its points, the scope says 1 to 8, best at 3 to 8',
        'tape pixels weak ' + w.n + ' of ' + w.area + ', sweet ' + s.n + '; strips ' + JSON.stringify((lit.labels || []).map(q => q.d + ':' + q.text)) + '; "' + g.said.replace(/\n/g, ' / ').slice(0, 110) + '"; "' + (g.scope || '').trim() + '"');
      if (profile === 'phone_portrait') {
        const pl = await page(profile, true);
        const pw = pl.px ? pl.px.px.weak : { n: -1 };
        leg(!pl.err && pw.n < Math.max(12, (pw.area || 0) * .02), 'P4 PLANTED: the page draws no hatch: B7\'s pixels go red', pl.err || 'tape pixels in the next ring ' + pw.n);
      }
    }
  }
  leg(errs.length === 0, 'B8 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });

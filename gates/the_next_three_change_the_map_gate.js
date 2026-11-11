#!/usr/bin/env node
/* ============================================================================
   THE NEXT THREE CHANGE THE MAP, EACH HIS OWN WAY (BOSSES lane, 11/10/26, VAMILY rules 443(a) and 441; ask lines 167, 522).

   THE COORDINATOR 11/10: 'he voted YES on all three of your bosses. NEXT: the ladder's next three, each found by its own sign, each
   handing its verb, each changing the map its OWN way, kept after a reload, proven on the real page on a phone both ways.' Rule 441:
   done only when it plays end to end on the alpha link and the demo, the phone upright AND on its side.
   Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md. Code: slices/bohemia_bosses.js (11) HIS DARK, (12) HIS HOLE,
   (13) HIS RIGGERS; data records/target/bb/boss_act_one.json; pictures slices/boss_places/drum_*, signpost_*, riggers_*
   (tools/bohemia_bosses_the_next_three_11_10_26.py).

     node gates/the_next_three_change_the_map_gate.js "THE BURN"                 both ways: the demo upright, the alpha on its side
     node gates/the_next_three_change_the_map_gate.js "THE BURN" phone_portrait  one way (add :alpha for the alpha, e.g. phone_landscape:alpha)

   THE STRANGER'S GAME, a new game, the ladder in order:
     T0 every boss before him first: each one's sign read and his fall through the map's own fell(), the door a won fight calls (each
        one is walked whole, fight and all, by his own gate), each one's card answered the way a stranger would
     T1 his sign is in the world and his rumour on the feed; T2 his asker asks, one of YOUR men reads the sign out, his place is marked
     WHILE HE STANDS, HIS OWN WAY (THE BURN: D1 his drums, D2 at night his side sees one block and is painted black, the rest of the
        valley the night's half; THE SURVEYOR: H1 his signposts, H2 walk into his side and out: the map forgets it; THE CLIMB: K1 his
        riggers' party, K2 it comes for you on the map and fights; BOSSES 11/11, THE LOCKSMITH: K1 his gates open by day, K2 at night
        chained, the walk the long way round, never cut off from him and no block between two gates shut off, K3 said and posted; THE CHARGE:
        M1 by day his dug dirt spotted, painted and walked round, M2 at night one nobody spotted goes off and wounds a man; after him V1
        BLOW A HOLE opens a way through a wall for good; THE MACHINIST: N1 his nails cost the walk three times the minutes, N2 said and
        posted, N3 the walk to his door costs the clock; after him his road faster than plain ground, V1 WELD A PIPE GUN into the bag)
     B0 his card first; B1 his fight won; B2 the beat plays his change on the tape, the asker's card says the valley's line, hands his
        thing, and the line under it says what changed on the map, with its numbers
     WHEN HE FALLS, HIS OWN WAY (C1a..C1d), then R1 the same phone opens the game again and it holds
   PLANTED, each must turn its own check red: P2 the while-he-stands change undone, P3 it coming back after the fall, P4 a phone that
   forgot the save. C0 nothing threw.
   Pictures: records/target/the_next_three_change_the_map/<boss>/ (BOSSES_SHOTS=0 to skip; .png ignored, the record keeps .webp).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const NAME = process.argv[2] || 'THE BURN';
const LADDER = ['THE POT', 'THE TAP', 'THE FILTER', 'THE BURN', 'THE SURVEYOR', 'THE CLIMB', 'THE LOCKSMITH', 'THE CHARGE', 'THE MACHINIST'];
const SLUG = NAME.replace(/^THE /, '').toLowerCase();
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'the_next_three_change_the_map', SLUG);
const NIGHT = 22 * 60;

/* ---------------- THE BURN: his dark ---------------- */
const BURN = {
  D2: (q) => !!q && q.inR === q.sight && q.inDark === q.sight && q.outR >= 2 && q.outDark === 0 && q.drawnDark > 0,
  C1a: (q) => !!q && q.r >= 6 && q.dark === 0,
  R1: (q, b) => !!q && q.fallen && q.drums === b.drums && q.r >= 6 && q.dark === 0 && q.lit === b.drums,
  async before(c) {
    const { fr, G } = c;
    let D = await c.fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.darkness(n) || null)), NAME);
    for (let i = 0; i < 20 && (!D || !D.drums.length); i++) { await c.page.waitForTimeout(500); D = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.darkness(n) || null)), NAME); }
    const walkable = D ? await fr.evaluate((L) => L.every(q => !!cityWalkable(q.x, q.y)), D.drums) : false;
    if (!D) { ok('D1 his drums', false, 'none'); return false; }
    /* the block the crew stands on in his dark: inside it, two or fewer from a drum (so the fall's light reaches it), never his own door */
    const tb = await fr.evaluate((a) => { const D = a[0], f = a[1], h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -D.radius + 1; dy <= D.radius - 1; dy++) for (let dx = -D.radius + 1; dx <= D.radius - 1; dx++) { const x = D.at[0] + dx, y = D.at[1] + dy;
        if (!cityWalkable(x, y) || Math.max(Math.abs(x - f.x), Math.abs(y - f.y)) < 2 || loopTownAt(x, y, 1)) continue;
        if (!D.drums.some(q => Math.max(Math.abs(q.x - x), Math.abs(q.y - y)) <= 2)) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue;
        const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, [D, c.f]);
    c.tb = tb; c.D = D;
    if (!tb) { ok('D2 a block in his dark the crew can stand on', false, 'none'); return false; }
    await c.night();
    await c.goTo(tb);
    await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const told = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_DARK_TOLD || null)));
    const qi = await fr.evaluate(() => ({ at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), drawn: (BohemiaBosses.last().drew || {}).dark | 0, night: isNight(),
      drums: ((BohemiaBosses.last().drew || {}).drums || []).filter(q => q.key === 'drum_before').length }));
    /* painted where the phone shows them: read with the crew among them (measured 11/10, run 1: read from his tag 13 blocks off, every drum was off the screen) */
    const dg = await fr.evaluate((D) => { const L = BohemiaBosses.last().drew || {}; let me = null; try { const ox = 0; me = null; } catch (e) {}
      return { loaded: BohemiaBosses.loaded(), mode: MODE, cv: [CVW, CVH], drums: (L.drums || []).map(q => q.key + '@' + q.at), places: (L.places || []).map(p => p.n + '@' + p.x + ',' + p.y), origin: (performance.timeOrigin | 0) % 100000 }; }, D).catch(e => ({ err: String(e).slice(0, 80) }));
    ok('D1 his drums: at least 2 of his stokers\' fire drums stand on street blocks round his yard, painted with his stoker', D.drums.length >= 2 && walkable && qi.drums >= 1,
      D.drums.map(q => q.x + ',' + q.y).join(' ') + ' round ' + D.at.join(',') + ', his dark ' + D.radius + ' blocks, ' + qi.drums + ' painted on the phone at ' + qi.at + ' ' + JSON.stringify(dg));
    await c.shot('2_his_dark_at_night');
    /* and outside it, at night: the night's half, his dark not */
    const ob = await fr.evaluate((D) => { const h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -D.radius - 6; dy <= D.radius + 6; dy++) for (let dx = -D.radius - 6; dx <= D.radius + 6; dx++) { const x = D.at[0] + dx, y = D.at[1] + dy;
        const dd0 = Math.max(Math.abs(dx), Math.abs(dy)); if (dd0 < D.radius + 2 || !cityWalkable(x, y) || loopTownAt(x, y, 2) || x < 1 || y < 1 || x >= om.n - 1 || y >= om.n - 1) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, D);
    await c.goTo(ob); await c.night(); await c.page.waitForTimeout(400);
    const qo = await fr.evaluate(() => ({ at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y) }));
    const q = { sight: G.sight, inR: qi.r, inDark: qi.dark, outR: qo.r, outDark: qo.dark, drawnDark: qi.drawn };
    ok('D2 at night on his side the crew sees ' + G.sight + ' block (the map\'s own fog asks), his side painted black; outside it the night\'s half', BURN.D2(q) && qi.night && !!told && told.n === NAME,
      'in his dark at ' + qi.at + ': sight ' + qi.r + ' (his ' + qi.dark + '), ' + qi.drawn + ' blocks painted black; outside at ' + qo.at + ': sight ' + qo.r + '; said: ' + JSON.stringify(told));
    ok('P2 planted: his dark undone (the night\'s half on his side) turns D2 red', !BURN.D2(Object.assign({}, q, { inR: 3, inDark: 0 })), 'sight 3 in his dark');
    return true;
  },
  card(G, c) { const n = c.D.drums.length; return G.card.replace('{DRUMS}', n + (n === 1 ? ' DRUM' : ' DRUMS')).replace('{light}', c.light); },
  async after(c) {
    const { fr, G } = c;
    await c.goTo(c.tb); await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const q = await fr.evaluate((n) => { const D = BohemiaBosses.darkness(n); return { at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), lit: D.drums.filter(d => BohemiaBosses.lit(d.x, d.y)).length,
      drawn: ((BohemiaBosses.last().drew || {}).drums || []).map(d => d.key), warm: (BohemiaBosses.last().drew || {}).warm | 0, black: (BohemiaBosses.last().drew || {}).dark | 0 }; }, NAME);
    ok('C1a at night on his side the crew sees like in the day by his drums (sight ' + q.r + '), his dark gone', BURN.C1a(q), JSON.stringify({ at: q.at, r: q.r, dark: q.dark }));
    ok('C1b every one of his drums is a fire of yours: lit at night, ' + c.light + ' blocks round each', q.lit === c.D.drums.length, q.lit + ' of ' + c.D.drums.length + ' lit');
    ok('C1c painted with the neighbours warming their hands, the fires glowing, nothing black', q.drawn.length >= 1 && q.drawn.every(k => k === 'drum_after') && q.warm >= 1 && q.black === 0, q.drawn.join(' ') + ', ' + q.warm + ' glowing, ' + q.black + ' black');
    await c.shot('5_his_drums_after');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who + ' and the radio', posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0) && posts.some(p => p.who === '@valleyradio' && /Fires on/.test(p.txt)),
      posts.filter(p => p.who === G.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
    const p3 = await fr.evaluate((n) => { const D = BohemiaBosses.darkness(n), H = BohemiaHisMap.state(), was = D.fell, f = H.boss.fallen[n]; D.fell = null; delete H.boss.fallen[n];
      const o = { r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y) }; D.fell = was; H.boss.fallen[n] = f; return o; }, NAME);
    ok('P3 planted: his dark back after the fall turns C1a red', !BURN.C1a(p3), JSON.stringify(p3));
    return { drums: c.D.drums.length };
  },
  async reload(e, c) {
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} }, NIGHT).catch(() => {});
    await c.goOn(e, c.tb);
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} render(); }, NIGHT).catch(() => {});
    await e.page.waitForTimeout(800);
    return e.fr.evaluate((n) => { const D = BohemiaBosses.darkness(n) || { drums: [] }; return { fallen: !!BohemiaHisMap.state().boss.fallen[n], drums: D.drums.length, at: [city.x, city.y],
      r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), lit: D.drums.filter(d => BohemiaBosses.lit(d.x, d.y)).length }; }, NAME).catch(x => ({ err: String(x) }));
  }
};

/* ---------------- THE SURVEYOR: his hole in the map ---------------- */
const DAYTIME = 12 * 60;
const holeCount = (fr, n) => fr.evaluate((n) => { const H = BohemiaBosses.hole(n); if (!H || !H.at) return { all: 0, seen: 0 }; let all = 0, sn = 0;
  for (let dy = -H.radius; dy <= H.radius; dy++) for (let dx = -H.radius; dx <= H.radius; dx++) { const x = H.at[0] + dx, y = H.at[1] + dy; if (!BohemiaBosses.inHole(n, x, y)) continue; all++; if (fogSeen(x, y)) sn++; }
  return { all, seen: sn }; }, n);
/* the blocks his lines drew, as the game kept them (measured 11/10: the gate planning each route again got a different route after a
   reload, 470 of 557), and every town's own door at the end of its line */
const linesSeen = (fr, n) => fr.evaluate((n) => { const H = BohemiaBosses.hole(n), L = (H && H.lines) || {}, P = L.path || [], D = L.doors || []; let all = 0, sn = 0, doors = 0;
  for (let i = 0; i + 1 < P.length; i += 2) { all++; if (fogSeen(P[i], P[i + 1])) sn++; }
  for (let i = 0; i + 1 < D.length; i += 2) if (fogSeen(D[i], D[i + 1])) doors++;
  return { towns: (L.towns || []).length, drawn: L.drawn | 0, doors, all, seen: sn, frac: all ? sn / all : 0 }; }, n);
const SURVEYOR = {
  H2: (q) => !!q && q.nIn >= 8 && q.nOut === 0 && q.maskA >= 200 && q.snow,
  C1a: (q) => !!q && q.all > 0 && q.seen === q.all,
  R1: (q, b) => !!q && q.fallen && q.posts === b.posts && q.all === b.all && q.seen === q.all && q.lines.towns === b.towns && q.lines.doors === b.towns && q.lines.frac === 1,
  async before(c) {
    const { fr } = c;
    let H = null; for (let i = 0; i < 20 && !(H && H.posts.length); i++) { H = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.hole(n) || null)), NAME); if (!(H && H.posts.length)) await c.page.waitForTimeout(500); }
    if (!H) { ok('H1 his cut sign poles', false, 'none'); return false; } c.H = H;
    c.towns = await fr.evaluate(() => { const bs = ctBases(); return Object.keys(bs).filter(k => bs[k]).length; });
    const pick = (inside) => fr.evaluate((a) => { const H = a[0], f = a[1], inside = a[2], h = [city.x, city.y]; let best = null, bd = 1e9;
      const R = inside ? H.radius - 1 : H.radius + 14;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const x = H.at[0] + dx, y = H.at[1] + dy, d0 = Math.max(Math.abs(dx), Math.abs(dy));
        if (x < 1 || y < 1 || x >= om.n - 1 || y >= om.n - 1 || !cityWalkable(x, y) || loopTownAt(x, y, 2)) continue;
        if (inside ? (Math.max(Math.abs(x - f.x), Math.abs(y - f.y)) < 2 || !BohemiaBosses.inHole(a[3], x, y)) : d0 < H.radius + 9) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, [H, c.f, inside, NAME]);
    c.tb = await pick(true); c.ob = await pick(false);
    if (!c.tb || !c.ob) { ok('H2 a block in his side and one well out of it', false, JSON.stringify([c.tb, c.ob])); return false; }
    await c.day(); await c.goTo(c.tb); await c.day(); await fr.evaluate(() => render()); await c.page.waitForTimeout(800);
    const nIn = (await holeCount(fr, NAME)).seen;
    await fr.evaluate(() => render()); const snowIn = await fr.evaluate(() => (BohemiaBosses.last().drew || {}).holeSnow | 0);
    /* painted where the phone shows them: read with the crew among them (THE BURN's drums, measured 11/10: read from the sign, none on the screen) */
    const drawn = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).posts || []).filter(q => q.key === 'signpost_before').length);
    ok('H1 his cut sign poles: at least 2 on street blocks round his office, painted with the blades cut off and his flagging', H.posts.length >= 2 && drawn >= 1,
      H.posts.map(q => q.x + ',' + q.y).join(' ') + ' round ' + H.at.join(',') + ', his side ' + H.radius + ' blocks, ' + drawn + ' painted on the phone at ' + c.tb);
    await c.shot('2_in_his_side');
    const seenIn = await fr.evaluate((n) => { const H = BohemiaBosses.hole(n), out = []; for (let dy = -H.radius; dy <= H.radius; dy++) for (let dx = -H.radius; dx <= H.radius; dx++) { const x = H.at[0] + dx, y = H.at[1] + dy; if (BohemiaBosses.inHole(n, x, y) && fogSeen(x, y)) out.push([x, y]); } return out; }, NAME);
    await c.goTo(c.ob); await c.day(); await fr.evaluate(() => render()); await c.page.waitForTimeout(1200);
    const q2 = await holeCount(fr, NAME), w = seenIn[0], snowOut = await fr.evaluate(() => (BohemiaBosses.last().drew || {}).holeSnow | 0);
    const maskA = w ? await fr.evaluate((w) => { const S = FOG.S, K = FOG.K; return FOG.cv.getContext('2d').getImageData((w[0] + K) * S, (w[1] + K) * S, 1, 1).data[3]; }, w) : 0;
    const told = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_HOLE_TOLD || null)));
    await c.shot('2b_out_of_his_side');
    const q = { nIn, nOut: q2.seen, maskA, snow: snowOut > snowIn };
    ok('H2 the map forgets his side: ' + nIn + ' of his blocks seen inside it, ' + q2.seen + ' left on the map once the crew walks out, the fog\'s own mask back over them, one of yours says it',
       SURVEYOR.H2(q) && !!told && told.n === NAME, 'inside at ' + c.tb + ': ' + nIn + ' of ' + q2.all + ' seen; out at ' + c.ob + ': ' + q2.seen + ' seen, the mask ' + maskA + '/255 over ' + JSON.stringify(w) + ', the dead signal on ' + snowIn + ' blocks inside, ' + snowOut + ' out; said: ' + JSON.stringify(told));
    ok('P2 planted: a map that keeps his side (nothing forgotten) turns H2 red', !SURVEYOR.H2(Object.assign({}, q, { nOut: nIn, maskA: 0 })), nIn + ' kept');
    return true;
  },
  card(G, c) { return G.card.replace('{TOWNS}', c.towns + (c.towns === 1 ? ' TOWN' : ' TOWNS')); },
  async after(c) {
    const { fr, G } = c;
    for (let i = 0; i < 80; i++) { const L = await fr.evaluate((n) => { const H = BohemiaBosses.hole(n); return H && H.lines ? [H.lines.done, H.lines.towns.length] : null; }, NAME); if (L && L[0] >= L[1]) break; await c.page.waitForTimeout(500); }
    await c.goTo(c.ob); await c.day(); await fr.evaluate(() => render()); await c.page.waitForTimeout(1000);
    const q = await holeCount(fr, NAME), ln = await linesSeen(fr, NAME);
    ok('C1a his side is back on the map for good: all of it seen with the crew well out of it', SURVEYOR.C1a(q), q.seen + ' of ' + q.all);
    ok('C1b his chain lines run out to every town: the map\'s own route from his door to each, out of the fog, every town\'s door on the map', ln.towns >= 2 && ln.towns === c.towns && ln.drawn === ln.towns && ln.doors === ln.towns && ln.frac === 1, ln.towns + ' towns, ' + ln.drawn + ' lines drawn, ' + ln.doors + ' doors seen, ' + ln.seen + ' of ' + ln.all + ' route blocks seen');
    await c.goTo(c.tb); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const dr = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).posts || []).map(q => q.key)), sn = await fr.evaluate(() => (BohemiaBosses.last().drew || {}).holeSnow | 0);
    ok('C1c his sign poles are painted with the blades back on and a fresh stake, and no dead signal is left on his side', dr.length >= 1 && dr.every(k => k === 'signpost_after') && sn === 0, dr.join(' ') + ', ' + sn + ' blocks of static');
    await c.shot('5_his_side_after');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who + ' and the radio', posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0) && posts.some(p => p.who === '@valleyradio' && /last real map/.test(p.txt)),
      posts.filter(p => p.who === G.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
    await c.goTo(c.ob);
    /* P3: his hole forgetting again after the fall (the state un-fallen for one read, the map restored after) */
    const p3 = await fr.evaluate((n) => { const H = BohemiaBosses.hole(n), Hm = BohemiaHisMap.state(), was = H.fell, f = Hm.boss.fallen[n], snap = FOG.seen.slice(); H.fell = null; delete Hm.boss.fallen[n];
      BohemiaBosses.forget(); let all = 0, sn = 0; for (let dy = -H.radius; dy <= H.radius; dy++) for (let dx = -H.radius; dx <= H.radius; dx++) { const x = H.at[0] + dx, y = H.at[1] + dy; if (!BohemiaBosses.inHole(n, x, y)) continue; all++; if (fogSeen(x, y)) sn++; }
      H.fell = was; Hm.boss.fallen[n] = f; for (let i = 0; i < snap.length; i++) if (snap[i] && !FOG.seen[i]) { FOG.seen[i] = 1; fogClear(i % FOG.D - FOG.K, Math.floor(i / FOG.D) - FOG.K, 0.85, false); } fogSave(); return { all, seen: sn }; }, NAME);
    ok('P3 planted: his side forgotten again after the fall turns C1a red', !SURVEYOR.C1a(p3), JSON.stringify(p3));
    return { posts: c.H.posts.length, all: q.all, towns: ln.towns };
  },
  async reload(e, c) {
    await c.goOn(e, c.ob); await e.page.waitForTimeout(800);
    const q = await holeCount(e.fr, NAME).catch(x => ({ err: String(x) })), ln = await linesSeen(e.fr, NAME).catch(() => ({ towns: 0, frac: 0 }));
    const H = await e.fr.evaluate((n) => ({ fallen: !!BohemiaHisMap.state().boss.fallen[n], posts: ((BohemiaBosses.hole(n) || {}).posts || []).length }), NAME).catch(() => ({}));
    return Object.assign({}, q, H, { lines: ln });
  }
};


/* ---------------- THE CLIMB: his riggers ---------------- */
const CLIMB = {
  K2: (q) => !!q && q.moved >= 1 && q.drawn >= 1 && q.meet && q.band && q.down,
  C1a: (q) => !!q && !q.party && !q.fought,
  R1: (q, b) => !!q && q.fallen && b.names.every(n => (q.residents || []).indexOf(n) >= 0) && q.count === b.count && !q.party && q.home === b.home,
  async before(c) {
    const { fr, G } = c;
    let Q = null; for (let i = 0; i < 20 && !(Q && Q.party); i++) { Q = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(n) || null)), NAME); if (!(Q && Q.party)) await c.page.waitForTimeout(500); }
    ok('K1 his riggers: a party at the foot of his hoist, and the people he kept up top waiting on his towers', !!Q && !!Q.party && Q.party.down == null && Q.kept.length >= 2,
      Q ? 'the party at ' + Q.party.x + ',' + Q.party.y + ' by his hoist ' + Q.at.join(',') + ', ' + Q.kept.length + ' kept: ' + Q.kept.map(k => k.name + ' ' + k.x + ',' + k.y).join(', ') : 'none');
    if (!Q) return false; c.Q = Q;
    /* walk into his sight, toward them: they come down the street */
    const tgt = await fr.evaluate((a) => { const Q = a[0], f = a[1], G = a[2], h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -G.sight; dy <= G.sight; dy++) for (let dx = -G.sight; dx <= G.sight; dx++) { const x = Q.at[0] + dx, y = Q.at[1] + dy, d0 = Math.max(Math.abs(dx), Math.abs(dy));
        if (d0 < G.sight - 2 || !cityWalkable(x, y) || loopTownAt(x, y, 1) || Math.max(Math.abs(x - f.x), Math.abs(y - f.y)) < 2) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, [Q, c.f, G]);
    c.tb = tgt;
    await fr.evaluate(() => { window.__GATE_PARTY = true; });
    let meet = null, drawn = 0, moved = 0; await c.go(tgt);
    for (let i = 0; i < 240 && !meet; i++) { await c.page.waitForTimeout(500);
      const r = await fr.evaluate((n) => ({ d: ((BohemiaBosses.last().drew || {}).riggers || []).length, m: ((BohemiaBosses.riggers(n) || {}).party || {}).moved | 0,
        meet: (function () { try { return MEET.up && /^riggers:/.test((MEET.up.msg && MEET.up.msg.why) || '') ? { why: MEET.up.msg.why, what: (MEET.up.msg.party || {}).what } : null; } catch (e) { return null; } })() }), NAME).catch(() => ({}));
      drawn = Math.max(drawn, r.d | 0); moved = Math.max(moved, r.m | 0); meet = r.meet || null;
      if (!meet && i % 12 === 11) { const at = await fr.evaluate(() => [city.x, city.y]); const P = (await fr.evaluate((n) => BohemiaBosses.riggers(n).party, NAME));
        /* he stands still in their sight: walk at them, the way a stranger who wants the fight does */
        if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await c.go([P.x, P.y]); } }
    if (meet) { await c.page.waitForTimeout(1200); await c.shot('2_his_riggers_and_their_card'); }
    const mcard = meet ? await fr.evaluate(() => { const g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]'); return { go: !!g, back: !!b }; }) : null;
    if (meet) await c.tapEl(await fr.$('#meetcard button[data-meet="go"]'));
    let ff = null;
    for (let i = 0; i < 120 && !ff && meet; i++) { await c.page.waitForTimeout(500); const h = await c.page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    let kinds = null, by = 'no fight';
    if (ff) {
      kinds = await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind)).catch(() => null);
      await c.tapEl(await ff.$('#bauto')); let res = null;
      for (let i = 0; i < 240 && !res; i++) { await c.page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null); if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      by = 'AUTO'; if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'not done in 120 s') + ')'; await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      for (let i = 0; i < 40; i++) { await c.page.waitForTimeout(500); if (await c.page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await c.page.waitForTimeout(1200);
      let left = false; try { const sf = c.page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await c.page.waitForTimeout(1200); left = await c.tapEl(await sf.$('#leave')); } } catch (e) {}
      await c.page.waitForTimeout(600); if (!left || await c.page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await c.page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 30; i++) { await c.page.waitForTimeout(500); if ((await fr.evaluate((n) => BohemiaBosses.riggers(n).party.down, NAME)) != null) break; }
    }
    await fr.evaluate(() => { window.__GATE_PARTY = false; });
    Q = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(n))), NAME);
    const q = { moved, drawn, meet: !!meet && !!mcard && mcard.go && mcard.back, band: !!kinds && kinds.length === G.band.length && kinds.every(k => G.band.indexOf(k) >= 0), down: Q.party.down != null };
    ok('K2 his riggers come for the crew on the map: painted in its sight, walking ' + moved + ' blocks toward it, their card first, ' + G.band.length + ' of them on the board, beaten and down', CLIMB.K2(q),
      (meet ? meet.why + ' "' + meet.what + '"' : 'no card') + ', board ' + JSON.stringify(kinds) + ', won by ' + by + ', the party ' + JSON.stringify(Q.party));
    ok('P2 planted: a party that never left the hoist (0 blocks walked) turns K2 red', !CLIMB.K2(Object.assign({}, q, { moved: 0 })), 'moved 0');
    return true;
  },
  card(G, c) { const n = c.Q.kept.length; return G.card.replace('{KEPT}', n + (n === 1 ? ' PERSON' : ' PEOPLE')); },
  async atCard(c) { await c.fr.evaluate(() => render()); await c.page.waitForTimeout(300); c.kd = await c.fr.evaluate(() => ((BohemiaBosses.last().drew || {}).kept || []).map(q => q.key)); },
  async after(c) {
    const { fr, G } = c;
    await fr.evaluate(() => render()); await c.page.waitForTimeout(400);
    let Q = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(n))), NAME);
    /* C1a: back into his sight, no riggers come */
    const f0 = await fr.evaluate(() => (window.__BOSS_PARTY_FIGHT || {}).t || 0);
    await c.goTo(c.tb); await c.page.waitForTimeout(3000);
    const f1 = await fr.evaluate(() => ({ t: (window.__BOSS_PARTY_FIGHT || {}).t || 0, drawn: ((BohemiaBosses.last().drew || {}).riggers || []).length }));
    const qa = { party: f1.drawn > 0, fought: f1.t !== f0 };
    ok('C1a his riggers are gone: walking back into his sight, nobody comes and none is painted', CLIMB.C1a(qa) && Q.fell != null, JSON.stringify(qa));
    /* C1b: the first one, with no place planted: she says she will come the day he plants, and does */
    const k0 = Q.kept[0], k1 = Q.kept[1];
    const res = () => fr.evaluate(() => { const r = BohemiaHomeMap.rec(); return { planted: !!(r && r.planted), names: ((r && r.residents) || []).map(p => p.name), waiting: ((r && r.waiting) || []).map(x => x.id) }; });
    await c.goTo([k0.x, k0.y]); await c.page.waitForTimeout(1500);
    const kd = c.kd || [];   /* read while her card was up, the camera on his towers (measured 11/10: from LUZ's block the others were off the screen) */
    const r0 = await res();
    const w0 = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(n).kept[0])), NAME);
    const pl = await fr.evaluate(() => { const r = BohemiaHomeMap.plantAt(city.x, city.y); return r && r.ok; });
    await fr.evaluate(() => render()); await c.page.waitForTimeout(1500);
    const r1 = await res(), w1 = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(n).kept[0])), NAME), hook = await fr.evaluate(() => BohemiaBosses.prizeWhere('climb'));
    ok('C1b ' + k0.name + ', with no place planted yet, waits for it (HOME BASE\'s one seam); the day he plants she moves in, and his hook stands there', !r0.planted && w0.asked != null && w0.waiting === true && r0.waiting.indexOf('climb:kept:' + k0.name) >= 0 && r0.names.indexOf(k0.name) < 0 && pl && r1.names.indexOf(k0.name) >= 0 && hook === 'placed',
      'before: planted ' + r0.planted + ', waiting ' + JSON.stringify(r0.waiting) + ', she ' + JSON.stringify(w0) + '; planted ' + pl + ', his hook ' + hook + '; after: ' + JSON.stringify(w1) + ', residents ' + JSON.stringify(r1.names));
    /* the next is whoever has not come yet (measured 11/10, on its side: the walk to LUZ passed over DON ARTURO, and he came then, the game right) */
    const left = await fr.evaluate((n) => BohemiaBosses.riggers(n).kept.findIndex(q => q.asked == null), NAME);
    const kk = left >= 0 ? Q.kept[left] : k1;
    if (left >= 0) { await c.goTo([kk.x, kk.y]); await c.page.waitForTimeout(1500); }
    const r2 = await res(), w2 = await fr.evaluate((a) => JSON.parse(JSON.stringify(BohemiaBosses.riggers(a[0]).kept[a[1]])), [NAME, left >= 0 ? left : 1]);
    const moved = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_CAME_DOWN || [])));
    ok('C1c ' + kk.name + ', with the place planted, moves in the moment the crew reaches her; they stood painted at the foot of his towers', left >= 0 && w2.home != null && !w2.waiting && r2.names.indexOf(kk.name) >= 0 && kd.length >= 1 && kd.every(k => k === 'riggers_after'),
      JSON.stringify(w2) + ', residents ' + JSON.stringify(r2.names) + ', painted ' + kd.join(' ') + ', came down ' + JSON.stringify(moved.map(m => m.name + (m.home ? ' home' : ' waits'))));
    await c.shot('5_they_came_down');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who + ', the company, and the radio', posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0) && posts.some(p => p.who === G.feed_home.who && p.txt.indexOf(kk.name) === 0) && posts.some(p => p.who === '@valleyradio' && /top floors/.test(p.txt)),
      posts.filter(p => p.who === G.feed.who || p.who === '@valleyradio' || p.who === G.feed_home.who).map(p => p.who + ': ' + p.txt.slice(0, 60)).join(' | '));
    const p3 = await fr.evaluate((n) => { const Qq = BohemiaBosses.riggers(n), Hm = BohemiaHisMap.state(), was = Qq.fell, f = Hm.boss.fallen[n]; Qq.fell = null; delete Hm.boss.fallen[n]; const pd = Qq.party.down; Qq.party.down = null;   /* a party standing at the hoist again */
      const o = { party: !!BohemiaBosses.partyUp(n), fought: false }; Qq.fell = was; Hm.boss.fallen[n] = f; Qq.party.down = pd; return o; }, NAME);
    ok('P3 planted: his riggers back after the fall turns C1a red', !CLIMB.C1a(p3), JSON.stringify(p3));
    const names = [k0.name, kk.name];
    return { names, count: r2.names.length, home: (await fr.evaluate((n) => BohemiaBosses.riggers(n).kept.filter(q => q.home != null).length, NAME)) };
  },
  async reload(e, c) {
    await c.goOn(e, c.tb); await e.page.waitForTimeout(2500);
    return e.fr.evaluate((n) => { const Q = BohemiaBosses.riggers(n) || { kept: [] }, r = BohemiaHomeMap.rec(); return { fallen: !!BohemiaHisMap.state().boss.fallen[n], residents: ((r && r.residents) || []).map(p => p.name), count: ((r && r.residents) || []).length,
      party: !!BohemiaBosses.partyUp(n) || ((BohemiaBosses.last().drew || {}).riggers || []).length > 0, home: Q.kept.filter(q => q.home != null).length }; }, NAME).catch(x => ({ err: String(x) }));
  }
};

/* ---------------- THE LOCKSMITH: his gates, chained at night (BOSSES 11/11) ---------------- */
const gateWay = (fr, a, b) => fr.evaluate((q) => { const p = cityRoute(q[0][0], q[0][1], q[1][0], q[1][1]); return p ? p.length - 1 : -1; }, [a, b]);
const LOCK = {
  K2: (q) => !!q && q.nightShut === q.gates && q.dayShut === 0 && q.nightWay >= q.dayWay + q.min && q.dayWay === 2 && q.toHim && q.pockets === 0,
  C1a: (q) => !!q && q.shut === 0 && q.way === 2,
  R1: (q, b) => !!q && q.fallen && q.gates === b.gates && q.shut === 0 && q.way === 2,
  async before(c) {
    const { fr, G } = c;
    let C = null;
    for (let i = 0; i < 30 && !(C && C.gates && C.gates.length); i++) { C = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.curfew(n) || null)), NAME); if (!(C && C.gates && C.gates.length)) await c.page.waitForTimeout(500); }
    if (!C || !C.gates.length) { ok('K1 his gates', false, JSON.stringify(C)); return false; }
    /* the gate the crew walks up to: the nearest one it reaches by day, and the street block beside it on each side */
    await c.day();
    const pick = await fr.evaluate((C) => { const h = [city.x, city.y]; let best = null, bd = 1e9;
      C.gates.forEach(g => { const a1 = g.along === 'x' ? [g.x - 1, g.y] : [g.x, g.y - 1], a2 = g.along === 'x' ? [g.x + 1, g.y] : [g.x, g.y + 1];
        const p = cityRoute(h[0], h[1], a1[0], a1[1]); if (!p) return; if (p.length < bd) { bd = p.length; best = { g: [g.x, g.y], a1: a1, a2: a2 }; } }); return best; }, C);
    if (!pick) { ok('K1 a gate the crew reaches', false, 'none'); return false; }
    c.C = C; c.pick = pick;
    await c.goTo(pick.a1); await c.day(); await fr.evaluate(() => render()); await c.page.waitForTimeout(500);
    const dayQ = await fr.evaluate((a) => { const C = BohemiaBosses.curfew(a[0]); return { shut: C.gates.filter(g => BohemiaBosses.lockAt(g.x, g.y)).length, walk: C.gates.filter(g => cityWalkable(g.x, g.y)).length,
      drawn: ((BohemiaBosses.last().drew || {}).gates || []).map(q => q.key), at: [city.x, city.y] }; }, [NAME]);
    const dayWay = await gateWay(fr, pick.a1, pick.a2);
    ok('K1 his gates: ' + C.gates.length + ' chain-link gates across the streets round his shop, open by day (the walk goes through), painted on the phone', C.gates.length >= 2 && dayQ.shut === 0 && dayQ.walk === C.gates.length && dayQ.drawn.indexOf('curfew_day') >= 0,
      C.gates.map(g => g.x + ',' + g.y + ' (' + g.detour + ' longer)').join(' ') + ' round ' + C.at.join(',') + '; by day ' + dayQ.shut + ' shut, the street through ' + dayWay + ' blocks; painted ' + dayQ.drawn.join(' '));
    await c.shot('2_his_gate_by_day');
    /* night: every gate chained, the walk the long way round, never cut off from him */
    await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const nq = await fr.evaluate((a) => { const C = BohemiaBosses.curfew(a[0]), f = BohemiaHisMap.state().boss.found[a[0]], h = [city.x, city.y];
      return { shut: C.gates.filter(g => BohemiaBosses.lockAt(g.x, g.y)).length, drawn: ((BohemiaBosses.last().drew || {}).gates || []).map(q => q.key), toHim: !!cityRoute(h[0], h[1], f.x, f.y),
        told: JSON.parse(JSON.stringify(window.__BOSS_CURFEW_TOLD || null)) }; }, [NAME]);
    const nightWay = await gateWay(fr, pick.a1, pick.a2);
    /* no pockets: every block within 13 of his door that his door reaches by day (gates aside) it still reaches at night (measured 11/11:
       two gates on one street shut the blocks between them off till morning) */
    const pockets = await fr.evaluate((C) => { const B = 13, x0 = C.at[0] - B, y0 = C.at[1] - B, W = 2 * B + 1, gate = {}; C.gates.forEach(g => { gate[g.x + ',' + g.y] = 1; });
      const reach = (night) => { const was = T.min; T.min = night ? 22 * 60 : 12 * 60; const sn = new Uint8Array(W * W), q = [C.at]; sn[(C.at[1] - y0) * W + C.at[0] - x0] = 1;
        for (let i = 0; i < q.length; i++) for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const x = q[i][0] + d[0], y = q[i][1] + d[1]; if (x < x0 || y < y0 || x >= x0 + W || y >= y0 + W) continue;
          const k = (y - y0) * W + x - x0; if (sn[k] || !cityWalkable(x, y)) continue; sn[k] = 1; q.push([x, y]); } T.min = was; return sn; };
      const dd = reach(false), nn = reach(true); let n = 0; for (let k = 0; k < W * W; k++) if (dd[k] && !nn[k] && !gate[(x0 + k % W) + ',' + (y0 + ((k / W) | 0))]) n++; return n; }, C);
    await c.shot('2_his_gate_chained_at_night');
    const q = { gates: C.gates.length, nightShut: nq.shut, dayShut: dayQ.shut, nightWay, dayWay, min: G.min_detour, toHim: nq.toHim, pockets };
    ok('K2 at night every gate is chained: the walk past his gate goes ' + nightWay + ' blocks round instead of ' + dayWay + ', and the crew is never cut off from him', LOCK.K2(q) && nq.drawn.indexOf('curfew_night') >= 0,
      JSON.stringify(q) + ', painted ' + nq.drawn.join(' '));
    ok('K3 one of yours says it and ' + G.feed_shut.who + ' posts it, the first night', !!nq.told && nq.told.n === NAME && (await c.posts()).some(p => p.who === G.feed_shut.who && p.txt.indexOf(G.feed_shut.txt.split('{')[0].trim()) === 0), JSON.stringify(nq.told));
    ok('P2 planted: his gates left open at night turn K2 red', !LOCK.K2(Object.assign({}, q, { nightShut: 0, nightWay: dayWay })), 'open at night');
    ok('P2b planted: two blocks shut in between two gates (a crew locked in till morning) turns K2 red', !LOCK.K2(Object.assign({}, q, { pockets: 2 })), '2 blocks in a pocket');
    await c.day();
    return true;
  },
  card(G, c) { const n = c.C.gates.length; return G.card.replace('{GATES}', n + (n === 1 ? ' GATE' : ' GATES')); },
  async after(c) {
    const { fr, G } = c;
    await c.night(); await c.goTo(c.pick.a1); await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const q = await fr.evaluate((n) => { const C = BohemiaBosses.curfew(n); return { shut: C.gates.filter(g => BohemiaBosses.lockAt(g.x, g.y)).length, drawn: ((BohemiaBosses.last().drew || {}).gates || []).map(d => d.key), night: isNight() }; }, NAME);
    q.way = await gateWay(fr, c.pick.a1, c.pick.a2);
    ok('C1a at night the chains are cut: no gate shut, the street through his gate is ' + q.way + ' blocks', LOCK.C1a(q) && q.night, JSON.stringify(q));
    ok('C1b painted cut: a panel down in the street, the chain in two', q.drawn.length >= 1 && q.drawn.every(k => k === 'curfew_after'), q.drawn.join(' '));
    await c.shot('5_his_gates_cut');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who, posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0), posts.filter(p => p.who === G.feed.who).map(p => p.txt.slice(0, 80)).join(' | '));
    const p3 = await fr.evaluate((n) => { const C = BohemiaBosses.curfew(n), H = BohemiaHisMap.state(), was = C.fell, f = H.boss.fallen[n]; C.fell = null; delete H.boss.fallen[n]; BohemiaBosses.regate();
      const o = { shut: C.gates.filter(g => BohemiaBosses.lockAt(g.x, g.y)).length }; C.fell = was; H.boss.fallen[n] = f; BohemiaBosses.regate(); return o; }, NAME);
    p3.way = 2;
    ok('P3 planted: his gates chained again after the fall turns C1a red', !LOCK.C1a(p3), JSON.stringify(p3));
    return { gates: c.C.gates.length };
  },
  async reload(e, c) {
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} }, NIGHT).catch(() => {});
    await c.goOn(e, c.pick.a1);
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} render(); }, NIGHT).catch(() => {});
    await e.page.waitForTimeout(800);
    const q = await e.fr.evaluate((n) => { const C = BohemiaBosses.curfew(n) || { gates: [] }; return { fallen: !!BohemiaHisMap.state().boss.fallen[n], gates: C.gates.length,
      shut: C.gates.filter(g => BohemiaBosses.lockAt(g.x, g.y)).length, at: [city.x, city.y] }; }, NAME).catch(x => ({ err: String(x) }));
    q.way = await gateWay(e.fr, c.pick.a1, c.pick.a2).catch(() => -1);
    return q;
  }
};

/* ---------------- THE CHARGE: his mines, read by day, deadly at night (BOSSES 11/11) ---------------- */
/* a night the walk keeps (measured 11/11: setting the map's T.min alone lasts one step, the walk syncs it back from the day's own clock;
   the day runs 06:00 to 22:00 and the map's night starts at 18:00, so dusk on the day's clock is a night a walk can be taken in) */
const dusk = (fr) => fr.evaluate(() => { try { DAY.min = 18 * 60 + 10; daySync(); } catch (e) { try { T.min = 18 * 60 + 10; } catch (e2) {} } try { render(); } catch (e) {} });
const mineQ = (fr, n) => fr.evaluate((n) => { const M = BohemiaBosses.mines(n); return M ? JSON.parse(JSON.stringify(M)) : null; }, n);
const MINE = {
  M1: (q) => !!q && q.seen && (q.shut || q.open) && q.drawn,
  M2: (q) => !!q && q.went >= 1 && !!q.hurt && q.wound === q.want && q.blood >= q.wantBlood,
  C1a: (q) => !!q && q.live === 0 && q.shut === 0 && q.newBang === 0,
  V1: (q) => !!q && q.blown && q.walk && q.wayAfter === 2 && q.wayBefore >= 5,
  R1: (q, b) => !!q && q.fallen && q.mines === b.mines && q.live === 0 && q.shut === 0 && q.hole === true,
  async before(c) {
    const { fr, G } = c;
    let M = null;
    for (let i = 0; i < 30 && !(M && M.mines && M.mines.length >= 2); i++) { M = await mineQ(fr, NAME); if (!(M && M.mines && M.mines.length >= 2)) await c.page.waitForTimeout(500); }
    if (!M || M.mines.length < 2) { ok('M1 his mines', false, JSON.stringify(M)); return false; }
    c.M0 = M;
    /* BY DAY: the nearest unspotted mine, and a block two or three from it the crew reaches without stepping on any */
    await c.day();
    const plan = await fr.evaluate((M) => { const h = [city.x, city.y], on = {}; M.mines.forEach(m => { on[m.x + ',' + m.y] = 1; });
      const live = M.mines.filter(m => m.seen == null && m.went == null).sort((a, b) => Math.max(Math.abs(a.x - h[0]), Math.abs(a.y - h[1])) - Math.max(Math.abs(b.x - h[0]), Math.abs(b.y - h[1])));
      for (const m of live) { let best = null, bd = 1e9;
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const d = Math.max(Math.abs(dx), Math.abs(dy)); if (d < 1 || (d > 1 && dx !== 0 && dy !== 0)) continue; const x = m.x + dx, y = m.y + dy;   /* beside it, or straight down the street (the map sees along a street, never round a corner: measured 11/11) */
          if (on[x + ',' + y] || !cityWalkable(x, y)) continue; const p = cityRoute(h[0], h[1], x, y); if (!p || p.some(q => on[q[0] + ',' + q[1]])) continue; if (p.length < bd) { bd = p.length; best = [x, y]; } }
        if (best) { const far = live.filter(o => o !== m).sort((a, b) => Math.max(Math.abs(b.x - m.x), Math.abs(b.y - m.y)) - Math.max(Math.abs(a.x - m.x), Math.abs(a.y - m.y)))[0]; return { m1: [m.x, m.y], near: best, m2: far ? [far.x, far.y] : null }; } }
      return null; }, M);
    if (!plan || !plan.m2) { ok('M1 a mine the crew can walk up to by day', false, JSON.stringify(plan)); return false; }
    c.plan = plan;
    await c.goTo(plan.near); await c.day(); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const q1 = await fr.evaluate((a) => { const M = BohemiaBosses.mines(a[0]), m = M.mines.filter(m => m.x === a[1][0] && m.y === a[1][1])[0];
      return { at: [city.x, city.y], seen: m.seen != null, open: !!m.open, shut: BohemiaBosses.mineShut(m.x, m.y) && !cityWalkable(m.x, m.y), drawn: ((BohemiaBosses.last().drew || {}).mines || []).some(d => d.key === 'mine_before' && d.at[0] === m.x && d.at[1] === m.y),
        told: JSON.parse(JSON.stringify(window.__BOSS_MINE_SEEN || null)) }; }, [NAME, plan.m1]);
    await c.shot('2_his_mine_spotted_by_day');
    ok('M1 by day the crew sees his dug dirt (beside it or down the street, up to ' + G.spot + ' blocks): the mine is spotted for good, painted with a stake and a rag, and the walk goes round it', MINE.M1(q1) && !!q1.told && q1.told.n === NAME,
      JSON.stringify(q1) + ', ' + M.mines.length + ' mines round ' + M.at.join(','));
    /* AT NIGHT: walk onto one nobody spotted (the far one) */
    await dusk(fr);
    /* the one nobody spotted (the day's walk may have spotted more than the first): the farthest from it the crew can reach */
    const m2 = await fr.evaluate((a) => { const M = BohemiaBosses.mines(a[0]), h = [city.x, city.y];
      const f = BohemiaHisMap.state().boss.found[a[0]], off = (p) => !!p && !p.some(q => Math.max(Math.abs(q[0] - f.x), Math.abs(q[1] - f.y)) <= 2);   /* his card stops a walk that goes by his yard (measured 11/11) */
      const c2 = M.mines.filter(m => m.seen == null && m.went == null && off(cityRoute(h[0], h[1], m.x, m.y))).sort((p, q) => Math.max(Math.abs(q.x - a[1][0]), Math.abs(q.y - a[1][1])) - Math.max(Math.abs(p.x - a[1][0]), Math.abs(p.y - a[1][1])));
      return c2[0] ? [c2[0].x, c2[0].y] : null; }, [NAME, plan.m1]);
    if (m2) plan.m2 = m2;
    const m2seen = !m2;
    const went0 = await fr.evaluate((n) => BohemiaBosses.mines(n).mines.filter(m => m.went != null).length, NAME);
    await c.goTo(plan.m2); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const q2 = await fr.evaluate((a) => { const M = BohemiaBosses.mines(a[0]), W = window.__BOSS_MINE_WENT || null, C = BohemiaCondition.get(), man = W && W.hurt ? C.men[W.hurt.key] : null;
      return { went: M.mines.filter(m => m.went != null).length - a[1], at: W && W.at, night: isNight(), crew: [city.x, city.y], hurt: W && W.hurt ? W.hurt.name : null, wound: man && man.wound ? man.wound.mark : null, blood: man ? Math.round(man.lostHp || 0) : 0, n: W && W.n }; }, [NAME, went0]);
    q2.want = G.wound; q2.wantBlood = G.blood;
    await c.shot('2_his_mine_went_off_at_night');
    const posts = await c.posts();
    ok('M2 at night one nobody spotted goes off under the walk: it stops, ' + (q2.hurt || 'one of yours') + ' takes ' + G.wound + ' (' + G.days + ' days, ' + G.blood + ' blood), the radio posts it',
      MINE.M2(q2) && !m2seen && q2.n === NAME && q2.night && posts.some(p => p.who === G.feed_bang.who && p.txt.indexOf(G.feed_bang.txt.split('{')[0].trim()) === 0), JSON.stringify(q2));
    ok('P2 planted: a mine that never goes off at night turns M2 red', !MINE.M2(Object.assign({}, q2, { went: 0 })), 'no bang');
    ok('P2b planted: a spotted mine the walk still goes over turns M1 red', !MINE.M1(Object.assign({}, q1, { shut: false, open: false })), 'walkable');
    await c.day();
    return true;
  },
  async card(G, c) { const n = await c.fr.evaluate((n) => BohemiaBosses.mines(n).mines.filter(m => m.went == null).length, NAME); return G.card.replace('{MINES}', n + (n === 1 ? ' MINE' : ' MINES')); },
  async after(c) {
    const { fr, G } = c;
    await dusk(fr);
    const went0 = await fr.evaluate((n) => BohemiaBosses.mines(n).mines.filter(m => m.went != null).length, NAME);
    await c.goTo(c.plan.m1); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const q = await fr.evaluate((a) => { const M = BohemiaBosses.mines(a[0]); return { at: [city.x, city.y], live: M.fell != null ? 0 : M.mines.filter(m => m.went == null).length,
      shut: M.mines.filter(m => BohemiaBosses.mineShut(m.x, m.y)).length, newBang: M.mines.filter(m => m.went != null).length - a[1], drawn: ((BohemiaBosses.last().drew || {}).mines || []).map(d => d.key), night: isNight() }; }, [NAME, went0]);
    ok('C1a at night his streets are safe: no mine left, none shut, the crew walks onto the one it spotted and nothing goes off', MINE.C1a(q) && q.night && q.at[0] === c.plan.m1[0] && q.at[1] === c.plan.m1[1], JSON.stringify(q));
    ok('C1b painted dug up: the can by its hole, the stake thrown down', q.drawn.length >= 1 && q.drawn.every(k => k === 'mine_after'), q.drawn.join(' '));
    await c.shot('5_his_mines_dug_up');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who, posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0), posts.filter(p => p.who === G.feed.who).map(p => p.txt.slice(0, 80)).join(' | '));
    const p3 = await fr.evaluate((n) => { const M = BohemiaBosses.mines(n), H = BohemiaHisMap.state(), was = M.fell, f = H.boss.fallen[n]; M.fell = null; delete H.boss.fallen[n]; BohemiaBosses.remine();
      const o = { live: M.mines.filter(m => m.went == null).length, shut: M.mines.filter(m => BohemiaBosses.mineShut(m.x, m.y)).length, newBang: 0 }; M.fell = was; H.boss.fallen[n] = f; BohemiaBosses.remine(); return o; }, NAME);
    ok('P3 planted: his mines back after the fall turns C1a red', !MINE.C1a(p3), JSON.stringify(p3));
    /* HIS POWDER: BLOW A HOLE where a wall stands between the crew and a street on its far side */
    await c.day();
    const wb = await fr.evaluate(() => { const h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -12; dy <= 12; dy++) for (let dx = -12; dx <= 12; dx++) { const x = h[0] + dx, y = h[1] + dy; if (!cityWalkable(x, y) || loopTownAt(x, y, 1)) continue;
        const d = Math.max(Math.abs(dx), Math.abs(dy)); if (d >= bd) continue; const w = BohemiaBosses.wallBeside(x, y); if (!w) continue;
        if (['open', 'purify', 'pick'].some(id => { const a = BohemiaBosses.applies(id, x, y); return a && !a.off; })) continue;   /* the phone shows one verb, the order's first (measured 11/11: PICK took a block beside a shop) */
        if (!cityRoute(h[0], h[1], x, y)) continue; bd = d; best = { at: [x, y], w }; } return best; });
    let v = { found: !!wb };
    if (wb) {
      await c.goTo(wb.at);
      const before = await fr.evaluate((w) => { const p = cityRoute(city.x, city.y, w.far[0], w.far[1]); return p ? p.length - 1 : 99; }, wb.w);
      const used = await fr.evaluate(() => { const v = BohemiaBosses.verbHere(); const g = BohemiaBosses.use('blow'); return { verb: v && v.id, got: g && typeof g === 'object' ? g : null }; });
      await fr.evaluate(() => render()); await c.page.waitForTimeout(2600);
      v = await fr.evaluate((a) => { const w = a[0], hole = BohemiaBosses.blown().slice(-1)[0]; const p = hole ? cityRoute(city.x, city.y, w.far[0], w.far[1]) : null;
        return { verb: a[1].verb, hole: hole ? [hole.x, hole.y] : null, blown: !!hole && BohemiaBosses.blownAt(hole.x, hole.y), walk: !!hole && cityWalkable(hole.x, hole.y), wayAfter: p ? p.length - 1 : -1,
          rubble: (BohemiaBosses.state().marks || []).some(m => m.k === 'blow' && hole && m.x === hole.x && m.y === hole.y) }; }, [wb.w, used]);
      v.wayBefore = before; c.hole = v.hole;
      await c.shot('5_a_hole_you_blew');
    }
    ok('V1 BLOW A HOLE: beside a wall between two streets your men blow a way through for good (the walk ' + v.wayBefore + ' blocks before, ' + v.wayAfter + ' through the hole)', MINE.V1(v) && v.verb === 'blow' && v.rubble, JSON.stringify(v));
    ok('P6 planted: a hole that did not open turns V1 red', !MINE.V1(Object.assign({}, v, { walk: false, wayAfter: v.wayBefore })), 'the wall still there');
    return { mines: c.M0.mines.length };
  },
  async reload(e, c) {
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} }, NIGHT).catch(() => {});
    await c.goOn(e, c.plan.m1);
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} render(); }, NIGHT).catch(() => {});
    await e.page.waitForTimeout(800);
    return e.fr.evaluate((a) => { const M = BohemiaBosses.mines(a[0]) || { mines: [] }, hole = a[1]; return { fallen: !!BohemiaHisMap.state().boss.fallen[a[0]], mines: M.mines.length,
      live: M.fell != null ? 0 : M.mines.filter(m => m.went == null).length, shut: M.mines.filter(m => BohemiaBosses.mineShut(m.x, m.y)).length, at: [city.x, city.y],
      hole: !!hole && BohemiaBosses.blownAt(hole[0], hole[1]) && cityWalkable(hole[0], hole[1]) }; }, [NAME, c.hole || null]).catch(x => ({ err: String(x) }));
  }
};

/* ---------------- THE MACHINIST: his nails take your time, his road gives it back (BOSSES 11/11) ---------------- */
const stepQ = (fr, b) => fr.evaluate((b) => ({ k: BohemiaBosses.nailAt(b[0], b[1]), mins: cityStepMins(b[0], b[1]), raw: BohemiaBosses.rawStep(b[0], b[1]) }), b);
const bagQ = (fr) => fr.evaluate(() => { try { return (JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || []).filter(i => i && i.from === 'weld').length; } catch (e) { return -1; } });
const NAIL = {
  N1: (q) => !!q && q.k === 1 && q.raw > 0 && Math.abs(q.mins / q.raw - q.slow) < 1e-6 && q.drawn,
  C1a: (q) => !!q && q.k === 2 && q.raw > 0 && Math.abs(q.mins / q.raw - q.fast) < 1e-6,
  V1: (q) => !!q && q.verb === 'weld' && q.bag === q.bag0 + 1 && q.item === 'PIPE GUN' && q.cooling,
  R1: (q, b) => !!q && q.fallen && q.blocks === b.blocks && q.k === 2 && Math.abs(q.mins / q.raw - b.fast) < 1e-6 && q.bag >= 1,
  async before(c) {
    const { fr, G } = c;
    let Q = null;
    for (let i = 0; i < 30 && !(Q && Q.blocks && Q.blocks.length >= 4); i++) { Q = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.nails(n) || null)), NAME); if (!(Q && Q.blocks && Q.blocks.length >= 4)) await c.page.waitForTimeout(500); }
    if (!Q || Q.blocks.length < 4) { ok('N1 his nails', false, JSON.stringify(Q)); return false; }
    c.Q = Q;
    await c.day();
    /* the nailed block the crew reaches first, never his own door */
    const b = await fr.evaluate((Q) => { const h = [city.x, city.y]; let best = null, bd = 1e9; Q.blocks.forEach(q => { if (q.x === Q.at[0] && q.y === Q.at[1]) return; const p = cityRoute(h[0], h[1], q.x, q.y); if (p && p.length < bd) { bd = p.length; best = [q.x, q.y]; } }); return best; }, Q);
    if (!b) { ok('N1 a nailed block the crew reaches', false, 'none'); return false; }
    c.b = b;
    await c.goTo(b); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const q = await stepQ(fr, b); q.slow = G.slow;
    q.drawn = await fr.evaluate((b) => ((BohemiaBosses.last().drew || {}).nails || []).some(d => d.key === 'nails_before' && d.at[0] === b[0] && d.at[1] === b[1]), b);
    const told = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_NAILS_TOLD || null)));
    await c.shot('2_his_nails');
    const posts = await c.posts();
    ok('N1 his nails: ' + Q.blocks.length + ' street blocks round his shop cost the walk ' + G.slow + ' times the minutes (the map\'s own minutes), painted', NAIL.N1(q), JSON.stringify(q) + ' round ' + Q.at.join(','));
    ok('N2 one of yours says it the first time and ' + G.feed_slow.who + ' posts it', !!told && told.n === NAME && posts.some(p => p.who === G.feed_slow.who && p.txt.indexOf(G.feed_slow.txt.split('{')[0].trim()) === 0), JSON.stringify(told));
    /* the walk by minutes goes round his nails where it can: across his patch (plain blocks on two opposite sides of his door, past the
       nails), the walk by the map's own minutes crosses fewer nailed blocks than the shortest walk by blocks, and never more (measured
       11/11: a nailed block has nailed blocks round it, so the first check, a plain block each side, found none) */
    const way = await fr.evaluate((Q) => { const R = 6, out = [], nailed = (p) => p ? p.filter(q => BohemiaBosses.nailAt(q[0], q[1]) === 1).length : -1;
      const plain = (x, y) => cityWalkable(x, y) && !BohemiaBosses.nailAt(x, y) && !loopTownAt(x, y, 1);
      const near = (x, y) => { for (let r = 0; r <= 2; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (plain(x + dx, y + dy)) return [x + dx, y + dy]; return null; };
      for (const d of [[1, 0], [0, 1], [1, 1], [1, -1]]) { const a = near(Q.at[0] - d[0] * R, Q.at[1] - d[1] * R), z = near(Q.at[0] + d[0] * R, Q.at[1] + d[1] * R); if (!a || !z) continue;
        const pb = cityRoute(a[0], a[1], z[0], z[1]), pm = cityRouteByMinutes(a[0], a[1], z[0], z[1], om.n); if (!pb || !pm) continue;
        out.push({ a, z, byBlocks: nailed(pb), byMinutes: nailed(pm), len: [pb.length - 1, pm.length - 1] }); }
      /* and the clock: the walk by minutes from where the crew stands to his door, its minutes with his nails against the same blocks plain
         (measured 11/11: the streets round his shop are dead ends, so most of the time there is no way round and the clock is what he takes) */
      const h = [city.x, city.y], pd = cityRouteByMinutes(h[0], h[1], Q.at[0], Q.at[1], om.n); let mins = 0, raw = 0;
      (pd || []).slice(1).forEach(q => { mins += cityStepMins(q[0], q[1]); raw += BohemiaBosses.rawStep(q[0], q[1]); });
      return { pairs: out, door: { nailed: nailed(pd), mins: Math.round(mins), raw: Math.round(raw) } }; }, Q);
    const N3 = (w) => !!w && w.pairs.every(o => o.byMinutes <= o.byBlocks) && w.door.nailed >= 1 && w.door.mins > w.door.raw;
    ok('N3 the clock: the walk to his door costs ' + (way && way.door.mins) + ' minutes instead of ' + (way && way.door.raw) + ' across his nails, and the walk by minutes never crosses more of them than the shortest walk', N3(way), JSON.stringify(way));
    ok('P2c planted: a walk to his door that costs no more for his nails turns N3 red', !N3(way ? Object.assign({}, way, { door: Object.assign({}, way.door, { mins: way.door.raw }) }) : null), 'plain minutes to his door');
    ok('P2 planted: his nails costing nothing turns N1 red', !NAIL.N1(Object.assign({}, q, { mins: q.raw })), 'plain minutes');
    return true;
  },
  card(G, c) { const n = c.Q.blocks.length; return G.card.replace('{BLOCKS}', n + (n === 1 ? ' BLOCK' : ' BLOCKS')).replace('{fast}', String(Math.round((1 - G.fast) * 100))); },
  async after(c) {
    const { fr, G } = c;
    await c.day(); await c.goTo(c.b); await fr.evaluate(() => render()); await c.page.waitForTimeout(700);
    const q = await stepQ(fr, c.b); q.fast = G.fast;
    const drawn = await fr.evaluate(() => ((BohemiaBosses.last().drew || {}).nails || []).map(d => d.key));
    ok('C1a his nails swept: the block is his carts\' road, ' + G.fast + ' times the minutes, faster than plain ground', NAIL.C1a(q), JSON.stringify(q));
    ok('C1b painted swept: a broom, a bucket of nails, a cart\'s tracks', drawn.length >= 1 && drawn.every(k => k === 'nails_after'), drawn.join(' '));
    await c.shot('5_his_road');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who, posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0), posts.filter(p => p.who === G.feed.who).map(p => p.txt.slice(0, 80)).join(' | '));
    const p3 = await fr.evaluate((a) => { const Q = BohemiaBosses.nails(a[0]), H = BohemiaHisMap.state(), was = Q.fell, f = H.boss.fallen[a[0]]; Q.fell = null; delete H.boss.fallen[a[0]]; BohemiaBosses.renail();
      const o = { k: BohemiaBosses.nailAt(a[1][0], a[1][1]), mins: cityStepMins(a[1][0], a[1][1]), raw: BohemiaBosses.rawStep(a[1][0], a[1][1]) }; Q.fell = was; H.boss.fallen[a[0]] = f; BohemiaBosses.renail(); return o; }, [NAME, c.b]);
    p3.fast = G.fast;
    ok('P3 planted: his nails back after the fall turns C1a red', !NAIL.C1a(p3), JSON.stringify(p3));
    /* WELD A PIPE GUN beside scrap */
    const at = await fr.evaluate(() => { const h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -16; dy <= 16; dy++) for (let dx = -16; dx <= 16; dx++) { const x = h[0] + dx, y = h[1] + dy; if (!cityWalkable(x, y)) continue; const d = Math.max(Math.abs(dx), Math.abs(dy)); if (d >= bd) continue;
        const a = BohemiaBosses.applies('weld', x, y); if (!a || a.off) continue; if (!cityRoute(h[0], h[1], x, y)) continue; bd = d; best = [x, y]; } return best; });
    let v = { found: !!at };
    if (at) {
      await c.goTo(at);
      const bag0 = await bagQ(fr);
      const u = await fr.evaluate(() => { const v = BohemiaBosses.verbHere(); const g = BohemiaBosses.use('weld'); return { verb: v && v.id, got: g && typeof g === 'object' ? g : null }; });
      await c.page.waitForTimeout(2600);
      v = await fr.evaluate((a) => { const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]') || [], it = bag.filter(i => i && i.from === 'weld').slice(-1)[0], ap = BohemiaBosses.applies('weld', city.x, city.y);
        return { verb: a.verb, item: it ? it.name : null, cooling: !!(ap && ap.off), bagAll: bag.length }; }, u);
      v.bag0 = bag0; v.bag = await bagQ(fr);
      await c.shot('5_a_pipe_gun_welded');
    }
    ok('V1 WELD A PIPE GUN: beside scrap your men weld one into the company\'s bag, once a day', NAIL.V1(v), JSON.stringify(v));
    ok('P6 planted: a weld that made nothing turns V1 red', !NAIL.V1(Object.assign({}, v, { bag: v.bag0 })), 'nothing in the bag');
    return { blocks: c.Q.blocks.length, fast: G.fast };
  },
  async reload(e, c) {
    await c.goOn(e, c.b);
    await e.page.waitForTimeout(800);
    const q = await e.fr.evaluate((a) => { const Q = BohemiaBosses.nails(a[0]) || { blocks: [] }; return { fallen: !!BohemiaHisMap.state().boss.fallen[a[0]], blocks: Q.blocks.length,
      k: BohemiaBosses.nailAt(a[1][0], a[1][1]), mins: cityStepMins(a[1][0], a[1][1]), raw: BohemiaBosses.rawStep(a[1][0], a[1][1]) }; }, [NAME, c.b]).catch(x => ({ err: String(x) }));
    q.bag = await bagQ(e.fr).catch(() => -1);
    return q;
  }
};

const LEGS = { 'THE BURN': BURN, 'THE SURVEYOR': SURVEYOR, 'THE CLIMB': CLIMB, 'THE LOCKSMITH': LOCK, 'THE CHARGE': MINE, 'THE MACHINIST': NAIL };

async function run(prof, alpha) {
  console.log('\n-- ' + NAME + ' on ' + (alpha ? 'the alpha' : 'the demo') + ', ' + prof + ' --');
  const L = LEGS[NAME]; if (!L) { ok('a gate for ' + NAME, false, 'none'); return; }
  const dir = SHOTS ? path.join(SHOTS, prof + (alpha ? '_alpha' : '')) : null;
  if (dir) fs.mkdirSync(dir, { recursive: true });
  const d = await open({ profile: prof, fog: true, alpha: !!alpha });
  const fr = d.fr, page = d.page, errs = [], CUT = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120) + ' AT ' + String(e.stack || '').split('\n').slice(1, 3).map(l => l.trim()).join(' < ')));
  /* the whole phone screen as he sees it (the driver's d.shot crops to the canvas box it measured at the door, and the alpha on its side
     measured that before the map showed: 3 x 3 pixels, measured 11/10) */
  const shot = async (name) => { if (dir) { try { await page.waitForTimeout(500); await page.screenshot({ path: path.join(dir, name + '.png') }); } catch (e) {} } };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 100; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  const rowOf = (n) => fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.data().bosses.filter(b => b.n === n)[0])), n);
  const bossCard = async (kind, n, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, n]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  /* a thumb scrolls a card that runs past the screen's edge before it presses (the card is a scroll box, CONTENT's): the gate does too,
     and says when it had to (rule 441: a button under the edge is one a stranger may never find) */
  const pressCard = async (i) => { await page.waitForTimeout(700); const h = await fr.$('#roadcard button[data-road="' + i + '"]'); if (!h) return false;
    const cut = await h.evaluate((b) => { const r = b.getBoundingClientRect(), c = b.closest('.rc'), cr = c ? c.getBoundingClientRect() : { bottom: innerHeight }; const out = r.bottom > Math.min(innerHeight, cr.bottom) + 1; if (out) b.scrollIntoView({ block: 'nearest' }); return out; }).catch(() => false);
    if (cut) { CUT.push(i); await page.waitForTimeout(300); } return tapEl(h); };
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => { for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await page.waitForTimeout(1300); }
    await toMap(fr); };
  /* the alpha comes out of the town in the close view (measured 11/10 on its side: MODE 'human', no sign placed in 60 s, because the
     bosses live on the map): he pinches out, and the pinch calls the game's own swapMode() */
  const toMap = async (f) => { if (await f.evaluate(() => { try { if (MODE === 'human' && !INSIDE && !(document.getElementById('settleFrame') && document.getElementById('settleFrame').style.display === 'block')) { swapMode(); return true; } } catch (e) {} return false; }).catch(() => false)) await page.waitForTimeout(1500); };
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await leaveTown();
  /* any meet card that is not his (a roaming crew, a road fight) he falls back from, the way a stranger walking to him would; his own
     party's (THE CLIMB's riggers) is this gate's only while it asks for one */
  const guard = setInterval(() => { fr.evaluate(() => { window.__BOSSES_TALK = true;   /* kept set: the alpha can load its map frame again under us (measured 11/10: no boss card after the first one) */
    try { if (MEET.up && !(/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') || (window.__GATE_PARTY && /^riggers:/.test((MEET.up.msg && MEET.up.msg.why) || ''))) && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, rumours: B.rumours })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard') || (MEET && MEET.up)).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  /* walk to a block and stand on it (a card on the road or a fall-back stops the walk short: walk on) */
  const goTo = async (c) => { if (!c) return false; for (let k = 0; k < 6; k++) { await toMap(fr); await go(c); await settle(); await clearCards(); const at = await fr.evaluate(() => [city.x, city.y]); if (at[0] === c[0] && at[1] === c[1]) return true; await page.waitForTimeout(600); } return false; };
  const night = () => fr.evaluate((t) => { try { T.min = t; } catch (e) {} }, NIGHT);
  const day = () => fr.evaluate((t) => { try { T.min = t; } catch (e) {} }, DAYTIME);
  const posts = () => fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || '' })));
  const waitSign = async (n) => { let s = null; for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); s = await st(); if ((s.boss.sign && s.boss.sign.n === n && s.rumours[n]) || s.boss.found[n]) break;
      if (i === 14 && !s.boss.sign) { const st2 = await fr.evaluate(() => { const h = [city.x, city.y], n = om.n; let best = null, bd = 1e9;
          for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 1)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && dd >= 3 && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }).catch(() => null);
        if (st2) { await go(st2); await settle(); } } } return s; };
  /* an earlier boss's own card that turns up while he is felled the quick way is answered the way a stranger would (THE FILTER's gate, 11/9) */
  const clearCards = async () => { for (let k = 0; k < 6; k++) { const c = await fr.evaluate(() => window.__BOSS_CARD && document.getElementById('roadcard') ? window.__BOSS_CARD.kind + '|' + window.__BOSS_CARD.n : null).catch(() => null);
      if (!c) return; const kind = c.split('|')[0], n = c.split('|')[1]; if (n === NAME) return; await pressCard(kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); } };
  const downBy = async (n) => { let s = await waitSign(n); await clearCards();
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); await clearCards(); }
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
    const th = await bossCard('thing', n, 8000); if (th) await pressCard(1);
    await clearCards();
    s = await st(); if (!s.boss.found[n]) return false;
    await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, n);
    const af = await bossCard('after', n, 30000); if (af) await pressCard(0);
    await page.waitForTimeout(2500); await clearCards(); s = await st(); return !!s.boss.fallen[n]; };
  /* his place: walk there, his card, ENGAGE, AUTO (the checker ends it after `patience` and says so), the spoils left */
  const fightAt = async (n, patience) => {
    let s = await st(); const f = s.boss.found[n]; if (!f) return { meet: false, ff: null, by: 'not found' };
    await go([f.x, f.y]); let meet = false;
    for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown();
      meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
    let mc = null;
    if (meet) { await page.waitForTimeout(1500); mc = await fr.evaluate(() => { const d = document.querySelector('#meetcard .mcboss'), g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]');
        return d ? { look: d.dataset.look, face: (BohemiaBosses.last().cardFace || null), text: d.textContent, go: !!g, back: !!b } : null; }).catch(() => null);
      await shot('3_his_card'); await tapEl(await fr.$('#meetcard button[data-meet="go"]')); }
    let ff = null;
    for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    let him = null, res = null, by = 'no fight';
    if (ff) {
      him = await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.side === 'them' && u.boss)[0]; return u ? { name: u.name, look: u.look || null } : null; }).catch(() => null);
      await tapEl(await ff.$('#bauto'));
      for (let i = 0; i < patience * 2 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
        if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      by = 'AUTO';
      if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'not done in ' + patience + ' s') + ')';
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await page.waitForTimeout(1200);
      let left = false; try { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
      await page.waitForTimeout(600);
      if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[n]) break; }
    }
    return { meet, mc, ff: !!ff, him, by };
  };
  const c = { fr, page, d, shot, tapEl, go, goTo, settle, night, day, posts, st, pressCard, bossCard };
  /* the reopened phone walks the same way */
  c.goOn = async (e, to) => { for (let k = 0; k < 4; k++) { await e.fr.evaluate((c) => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); travelSpeedSet(4); travelTo(0, 0, c); travelGoes(); } catch (x) {} }, to).catch(() => {});
    for (let i = 0; i < 100; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => true)) break; }
    await e.page.waitForTimeout(1200); const at = await e.fr.evaluate(() => [city.x, city.y]).catch(() => [0, 0]); if (at[0] === to[0] && at[1] === to[1]) return true; } return false; };

  /* ---------- T0: every boss before him first, the ladder's order ---------- */
  const before = LADDER.slice(0, LADDER.indexOf(NAME)), downs = [];
  for (const n of before) downs.push(n + ' ' + await downBy(n));
  ok('T0 every boss before him first, the ladder\'s order (each one\'s sign read, his fall through the map\'s own fell(), his card answered)', downs.every(x => /true$/.test(x)), downs.join(', '));
  /* ---------- T1, T2 ---------- */
  const row = await rowOf(NAME), key = Object.keys(row).filter(k => ['dark', 'hole', 'riggers', 'curfew', 'mines', 'nails'].indexOf(k) >= 0)[0], G = row[key];
  c.G = G; c.row = row; c.light = (row.verb && row.verb.light_blocks) || 2;
  let s = await waitSign(NAME);
  ok('T1 ' + NAME + ': his sign (the ' + ((s.boss.sign || {}).kind || '?') + ') is in the world and his rumour is on the feed', !!(s.boss.sign && s.boss.sign.n === NAME) && !!s.rumours[NAME],
     s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y + ', his place ' + s.boss.sign.boss.x + ',' + s.boss.sign.boss.y : 'no sign');
  await clearCards();
  const ak = await bossCard('asker', NAME, 140000);
  if (ak) { await shot('0_she_asks'); await pressCard(0); const ay = await bossCard('asker_yes', NAME, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === NAME) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === NAME && !s.boss.found[NAME]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); const f = s.boss.found[NAME]; c.f = f;
  const th = f ? await bossCard('thing', NAME, 12000) : null;
  ok('T2 ' + row.lead.asker.name + ' asks; at the ' + row.lead.thing.head.replace(/^THE /, '').toLowerCase() + ' one of yours reads it out; his place is marked', !!ak && !!f && !!th && th.text === row.lead.thing.says && th.name !== 'YOU',
     (ak ? ak.name + ' asked' : 'nobody asked') + '; ' + (th ? th.name + ': "' + th.text.slice(0, 120) + '..."' : 'no card') + '; marked ' + (f ? f.x + ',' + f.y : 'NO'));
  if (th) { await shot('1_the_sign_read_out'); await pressCard(1); await page.waitForTimeout(600); }
  if (!f) { ok('the walk reached ' + NAME, false, 'the sign was not read'); clearInterval(guard); await d.close().catch(() => {}); return; }
  /* ---------- while he stands, his own way ---------- */
  const okBefore = await L.before(c);
  /* ---------- B0, B1: his card, his fight ---------- */
  const xf = await fightAt(NAME, 120);
  /* where the fight handed him back (the alpha can hand him back in the close view): read, then he pinches out to the map like anybody */
  const diag = await fr.evaluate(() => { const P = window.parent, F = P.document.getElementById('fightFrame'); let up = null; try { up = BohemiaRoadEvents.up(); } catch (e) {}
    return { mode: MODE, fightFrame: F ? F.style.display + '/' + P.getComputedStyle(F).display : null, spoils: !!(P.SPOILS && P.SPOILS.frame), fighting: (function () { try { return !!LOOP.fighting; } catch (e) { return null; } })(),
      card: window.__BOSS_CARD ? window.__BOSS_CARD.kind + ':' + window.__BOSS_CARD.n : null, cardUp: up, talk: !!window.__BOSSES_TALK, origin: (performance.timeOrigin | 0) % 100000, beat: JSON.stringify(window.__BOSS_BEAT ? { n: window.__BOSS_BEAT.n, done: !!window.__BOSS_BEAT.done } : null), town: (function () { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; })() }; }).catch(e => ({ err: String(e).slice(0, 80) }));
  console.log('  ..   after his fight: ' + JSON.stringify(diag));
  await leaveTown(); await toMap(fr);
  ok('B0 ' + NAME + '\'s card first: his own face, his title, his tip, ENGAGE or FALL BACK', xf.meet && !!xf.mc && xf.mc.look === row.boss.look && xf.mc.face === row.boss.look && xf.mc.text.indexOf(row.tip) >= 0 && xf.mc.go && xf.mc.back, JSON.stringify(xf.mc));
  ok('B1 his fight stands with the man himself (' + row.boss.look + ') and is won', xf.ff && !!xf.him && xf.him.name === row.boss.name && xf.him.look === row.boss.look, (xf.him ? xf.him.name + ' in ' + xf.him.look : 'no boss') + ', won by ' + xf.by);
  /* ---------- B2: the beat, the asker's card ---------- */
  const af = await bossCard('after', NAME, 30000);
  const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
  if (af) { await page.waitForTimeout(500); await shot('4_she_says_what_changed'); }
  s = await st();
  const want = okBefore ? await L.card(G, c) : null, onTape = bt ? (bt.drums | 0) + (bt.posts | 0) + (bt.riggers | 0) + (bt.gates | 0) + (bt.mines | 0) + (bt.nails | 0) : 0;
  ok('B2 he falls: the beat plays his change on the tape with his place, ' + row.after.name + ' says the valley\'s line, hands his ' + row.verb.hand.name.replace(/^HIS /, '').toLowerCase() + ', and says what changed on the map',
     !!s.boss.fallen[NAME] && !!s.verbs[row.verb.id] && !!bt && bt.n === NAME && onTape >= 1 && !!af && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.ground === want,
     'fallen ' + !!s.boss.fallen[NAME] + ', ' + row.verb.id.toUpperCase() + ' ' + !!s.verbs[row.verb.id] + ', the beat ' + (bt ? bt.phases.join('>') + ' with ' + onTape + ' pieces on the tape' : 'none') + ', card: ' + (af ? '"' + af.text + '" + ' + (af.hand ? af.hand.name : 'NO THING') + ' + "' + af.ground + '"' : 'none'));
  /* G1 (rule 445, ask line 571): what he gives stands in his settlement through HOME BASE's one seam; before he plants it waits, and her card says which */
  const G1 = (gv, card) => !!gv && gv.name === row.verb.hand.name && gv.from === NAME && /^boss_places\//.test(gv.pic || '') && !!card && card.where === (gv.where === 'placed' ? 'IT STANDS AT YOUR PLACE' : gv.where === 'waiting' ? 'IT WAITS FOR YOUR PLACE' : '?');
  const gv = await fr.evaluate((id) => { const r = BohemiaHomeMap.rec(), k = 'prize:' + id; const t = ((r && r.things) || []).concat((r && r.waiting) || []).filter(x => x.id === k)[0];
    return t ? { name: t.name, from: t.from, pic: t.pic, where: BohemiaBosses.prizeWhere(id), planted: !!(r && r.planted) } : null; }, row.verb.id).catch(() => null);
  ok('G1 what he gives goes to your settlement through HOME BASE\'s seam: ' + row.verb.hand.name + ' from ' + NAME + ', with his picture, and her card says where it is', G1(gv, af && af.hand), JSON.stringify(gv) + ', her card: "' + (af && af.hand ? af.hand.where : 'none') + '"');
  ok('P5 planted: a prize the seam never got turns G1 red', !G1(null, af && af.hand), 'no prize');
  /* the feed keeps its last 14 posts (BOHEMIA_FEED's MAX): read it at the fall too, so a busy alpha cannot scroll his post out before C1d */
  c.fallPosts = await posts().catch(() => []);
  if (L.atCard && af) { try { await L.atCard(c); } catch (e) {} }   /* while her card is up the camera is still on his place: what stands round it is on the screen */
  c.posts = async () => { const all = (c.fallPosts || []).concat(await posts().catch(() => [])), seenP = {}; return all.filter(p => { const k = p.who + '|' + p.txt; if (seenP[k]) return false; seenP[k] = 1; return true; }); };
  if (af) await pressCard(0);
  await page.waitForTimeout(2500);
  /* ---------- when he falls, his own way ---------- */
  const b4 = okBefore ? await L.after(c) : null;
  clearInterval(guard);
  /* ---------- R1 ---------- */
  const saved = () => page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
  for (let i = 0; i < 60 && !(await saved()); i++) await page.waitForTimeout(500);
  await fr.evaluate(() => { try { fogSave(); } catch (e) {} try { saveNow('gate'); } catch (e) {} }).catch(() => {});
  await page.waitForTimeout(3000);
  const reopen = async (wipe) => {
    if (wipe) await page.evaluate(() => { localStorage.removeItem('bohemia.bosses.v1'); localStorage.removeItem('bohemia.hismap.v1'); });
    const e = await open({ again: d, fog: true, alpha: !!alpha });
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined').catch(() => false)) break; }
    for (let i = 0; i < 20; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => { try { return FOG.ready; } catch (x) { return false; } }).catch(() => false)) break; }
    await e.fr.evaluate(() => { window.__BOSSES_TALK = true; }).catch(() => {});
    await e.fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE) swapMode(); } catch (x) {} }).catch(() => {}); await e.page.waitForTimeout(1500);
    const q = await L.reload(e, c);
    return { e, q };
  };
  if (b4) {
    const o1 = await reopen(false);
    if (dir) { try { await o1.e.page.waitForTimeout(500); await o1.e.page.screenshot({ path: path.join(dir, '6_opened_again.png') }); } catch (x) {} }
    ok('R1 the same phone opens the game again: he is still down and what he changed on the map holds', L.R1(o1.q, b4), JSON.stringify(o1.q).slice(0, 260));
    errs.push(...(o1.e.errs || []));
    try { await o1.e.page.close(); } catch (x) {}
    const o2 = await reopen(true);
    ok('P4 planted: a phone that forgot the save turns R1 red', !L.R1(o2.q, b4), JSON.stringify(o2.q).slice(0, 200));
    try { await o2.e.page.close(); } catch (x) {}
  } else ok('R1 the reopen', false, 'the fall\'s change was not reached');
  ok('C0 ' + prof + (alpha ? ' (the alpha)' : '') + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  ok('C2 every boss card\'s buttons showed on the screen without a scroll (rule 441: no button under the edge)', CUT.length === 0, CUT.length ? CUT.length + ' presses had to scroll first' : 'none had to');
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[3];
  const runs = want ? [[want.split(':')[0], /:alpha$/.test(want)]] : [['phone_portrait', false], ['phone_landscape', true]];
  for (const [p, a] of runs) { try { await run(p, a); } catch (e) { ok('the gate ran on ' + p + (a ? ' (the alpha)' : ''), false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\n' + NAME + ' CHANGES THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

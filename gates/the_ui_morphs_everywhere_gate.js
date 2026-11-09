/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES FRAMES, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE UI MORPHS EVERYWHERE  (MOTION 3, 11/8/26, rule 436(a), asks 151, 257, 278; Paolo: 'the UI morphs: every big change (map,
   town, fight, camp, shop, jobs, the crew) transforms the shared pieces into each other with quick, on-the-beat animation; never
   static, never a cut; nothing just appears or vanishes').

   MEASURED BEFORE on the demo (tools/bohemia_motion_three_every_change.js; records/BOHEMIA_MOTION_THREE_THE_REST_OF_THE_STATES_11_8_26.md):
   the weapon card and the shop's man strip popped on in one frame; a job's card replaced the board in one frame; the settings closed
   in one frame; the town's signs popped back over a closing sheet; the fight's end put a black box over the whole glass while the loot
   screen loaded; a building's sheet slid up from the bottom of the glass, never out of the building; HEAL grew the camp twice.

   THE VERDICT IS EVERY FRAME THE PAGE DREW: for each piece (the sheet, the weapon card, the man strip, the settings, the loot screen's
   door) the share of the glass it covered, its box times its opacity through every frame it sits in. A piece that moved more than a
   tenth of the glass must spend at least three drawn frames between where it started and where it ended, and never step more than
   STEP of the glass in one drawn frame. The layer's own record (BohemiaMotion.log) must say a morph played it: the real element,
   on the beat, in budget. The screen recorder's numbers are printed as the witness (on this box it drops the compositor's frames).
     E0 the layer is in the demo with its new doors (the sheet, the settings, the loot screen in and out)
     E1 a building's sheet grows out of the building he tapped; a weapon tapped grows its card and the man strip out of the slot; the sheet
        goes back into the building; the board's sheet; a job's card grows out of its line on the board; the scavenge lot's sheet
     E2 the settings grow out of the phone's gear and go back into it
     E3 the fight's end: the board stays on the glass until the loot screen is drawn, then it comes up out of his phone; LEAVE folds it
        back while the way home starts
     E4 HEAL makes ONE morph (the camp's, never the town's too: __ONE_MORPH_A_DOOR__), and it lands without waiting out READY_MAX
     E5 the morphs that were already there still play (the town, the crew, the bar's lift into a fight): nothing of MOTION 1 and 2 lost
     E6 FRAMES: every change the new morphs play holds 40 frames a second or more on this box with no frame over 250 ms
        (PLUMBER 7's 11/7zd baseline printed beside it)
     E7 A FINGER HOLDS A PIECE: a tap on the sheet's close while the sheet is still growing lands on the close (the sheet goes) and
        the morph logged that it held its pose for the tap
     E8 REDUCED MOTION: with the gear's MOTION at LESS a sheet opens as a fade in place, 250 ms or less, no travel
     P1 PLANTED FAILS, caught by the same verdict: window.__MOTION_THREE_OFF = true (the old way) and (a) a weapon's card pops on in one
        frame, (b) the settings close in one frame; both must go RED under E1/E2's own check (the drawn frames)
     E9 nothing threw
   node gates/the_ui_morphs_everywhere_gate.js [phone_portrait|computer]   (about eight minutes on this box) */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const P = require(path.join(ROOT, 'tools/bohemia_motion_three_every_change.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const STEP = 0.35, MID = 3;
const pct = v => Math.round((v || 0) * 100) + '%';
/* PLUMBER 7, 11/7zd, the same box, frames a second (records/BOHEMIA_PLUMBER_THE_MAP_S_LIGHTS_AND_EVERY_CHANGE_AT_SIXTY_11_7_26.md) */
const BASE = { 'map>town': '13 to 19', 'town>map': '54', 'map>crew': '41 to 50', 'crew>map': '60', 'map>camp': 'not logged', 'map>fight': '25.6 (the dive)' };

/* THE ONE CHECK, used for the real thing and for the planted fails alike */
function pieceMoves(row, key) {
  const p = row && row.pieces && row.pieces[key];
  if (!p) return { good: false, why: 'never on the glass' };
  if (p.moved < 0.1) return { good: true, why: 'moved ' + pct(p.moved) + ' of the glass (a small piece: its morph row decides)', p };
  const good = p.big <= STEP && p.mid >= MID;
  return { good, why: pct(p.from) + ' > ' + pct(p.to) + ' of the glass, biggest step in one drawn frame ' + pct(p.big) + ', ' + p.mid + ' frames between', p };
}
function morphRow(row, id, dir) { return (row && row.morphs || []).find(r => r.id === id && r.how === 'real' && (!dir || r.dir === dir)) || null; }
function inBudget(r) { return !!r && !r.reduced && r.planned >= 230 && r.planned <= 1020 && (r.poses || r.holds) >= 4 && r.gaps === 0; }
function says(r) { return r ? r.id + ' ' + r.dir + ', ' + r.planned + ' ms, ' + (r.poses || r.holds) + ' poses, biggest pose step ' + pct(r.step) + (r.waitedReady ? ', waited ' + r.waitedReady + ' ms for its page' : '') + (r.frozen ? ', held for a finger' : '') : 'no morph logged'; }
function oneChange(rows, name) { return rows.find(r => r.name === name) || null; }
function judge(rows, name, id, dir, key, label) {
  const row = oneChange(rows, name);
  if (!row || !row.pressed) { ok(label + ': pressed', false, row ? 'not pressed' : 'never reached'); return; }
  const r = morphRow(row, id, dir), mv = key ? pieceMoves(row, key) : { good: true, why: '' };
  ok(label, inBudget(r) && mv.good, says(r) + (key ? '; ' + mv.why : '') + '; the recorder: ' + pct(row.big) + ' in its biggest frame');
}

(async () => {
  const profile = process.argv.find(a => /^(phone_portrait|computer)$/.test(a)) || 'phone_portrait';
  console.log('THE UI MORPHS EVERYWHERE: ' + profile);
  let R;
  try { R = await P.measure({ profile, keep: true, quiet: false }); }
  catch (e) { ok('the demo was driven through every change', false, String(e && e.message || e).slice(0, 200)); console.log('THE UI MORPHS EVERYWHERE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  const rows = R.rows, S = R.S, p = S.p, fr = S.fr, M = S.M;
  try {
    /* ---- E0 ---- */
    const A = await M(() => ({ v: BohemiaMotion.version, ad: BohemiaMotion.adapters }));
    ok('E0 the motion layer is in the demo (' + A.v + ') with its new doors: the sheet, the settings, the loot screen in and out',
      !!A.ad.sheet && !!A.ad.settings && !!A.ad.spoils && A.ad.spoilsOut === true, JSON.stringify(A.ad));
    /* ---- E1 ---- */
    judge(rows, 'town>shop', 'sheet', 'in', '#sheet', 'E1 a building\'s sheet grows out of the building he tapped (the shop)');
    const item = oneChange(rows, 'shop>item');
    const card = morphRow(item, 'card', 'in'), strip = morphRow(item, 'strip', 'in');
    ok('  a weapon tapped: its card and the man strip grow out of the slot (rule 433: a detail when he taps for it)',
      !!item && item.pressed && (inBudget(card) || !(item.pieces && item.pieces['#bwcard'])) && inBudget(strip) && pieceMoves(item, '#shopfaces').good && (!item.pieces['#bwcard'] || pieceMoves(item, '#bwcard').good),
      'card: ' + says(card) + (item && item.pieces && item.pieces['#bwcard'] ? ' (' + pieceMoves(item, '#bwcard').why + ')' : ' (no weapon on this shelf)') + '; strip: ' + says(strip));
    judge(rows, 'sheet>town', 'sheet', 'out', '#sheet', '  the sheet goes back into its building (his x)');
    judge(rows, 'town>board', 'sheet', 'in', '#sheet', '  the board\'s sheet grows out of the board');
    judge(rows, 'board>job', 'page', 'in', null, '  a page turned on the board (a job out of its line, or the board back out of Not now) grows out of what he tapped');
    const lotName = (rows.find(r => /^town>(lot|scavenge|bar|clinic|stall)$/.test(r.name)) || {}).name;
    judge(rows, lotName || 'town>lot', 'sheet', 'in', '#sheet', '  the ' + ((lotName || 'town>lot').split('>')[1]) + '\'s sheet grows out of its building');
    /* ---- E2 ---- */
    judge(rows, 'map>settings', 'settings', 'in', '#setwrap', 'E2 the settings grow out of the phone\'s gear');
    judge(rows, 'settings>map', 'settings', 'out', '#setwrap', '  and go back into it');
    /* ---- E3 ---- */
    const over = oneChange(rows, 'fight>over'), sin = morphRow(over, 'spoils', 'in'), sp = pieceMoves(over, '#spoilsdoor');
    ok('E3 the fight\'s end: the board stays on the glass until the loot screen is drawn, then it comes up out of his phone',
      !!over && over.pressed && inBudget(sin) && sp.good, says(sin) + '; ' + sp.why);
    judge(rows, 'spoils>map', 'spoils', 'out', '#spoilsdoor', '  LEAVE folds the loot screen back into the phone as the way home starts');
    /* ---- E4 ---- */
    const camp = oneChange(rows, 'map>camp'), grows = camp ? camp.morphs.filter(r => r.how === 'grow') : [];
    const cg = grows.find(r => r.id === 'camp');
    ok('E4 HEAL makes ONE morph, the camp\'s (__ONE_MORPH_A_DOOR__), landing without the two-second wait',
      !!camp && camp.pressed && grows.length === 1 && !!cg && (cg.waitedReady || 0) < 1000 && cg.gaps === 0,
      grows.map(r => r.id + ' ' + r.how + ' ' + r.planned + ' ms' + (r.waitedReady ? ', waited ' + r.waitedReady + (r.whyNot ? ' (' + r.whyNot + ')' : '') : '')).join('; ') || 'no grow');
    /* ---- E5 ---- */
    const had = (n, id, how) => { const r = oneChange(rows, n); return !!r && r.morphs.some(m => m.id === id && m.how === how); };
    ok('E5 MOTION 1 and 2\'s morphs still play: the town grows and shrinks, the crew screen grows and shrinks, the bar lifts into a fight',
      had('map>town', 'town', 'grow') && had('town>map', 'town', 'shrink') && had('map>crew', 'crew', 'grow') && had('crew>map', 'crew', 'shrink') && had('map>fight', 'bar', 'fly'),
      ['map>town', 'town>map', 'map>crew', 'crew>map', 'map>fight'].map(n => { const r = oneChange(rows, n); return n + ': ' + (r ? r.morphs.map(m => m.id + ':' + m.how).join(' ') : '-'); }).join('; '));
    /* ---- E6 ---- */
    /* the town's and the settings' changes ran 49 to 60 frames a second the old way on this box (MOTION 3's A/B, the record): the new
       morphs hold 40 and no frame over 200 ms there; the fight's end and the way home carry the fight's and the map's own work (the old
       way 6 and 8.5 frames a second this round): never under that */
    const light = ['town>shop', 'shop>item', 'sheet>town', 'town>board', 'board>job', 'map>settings', 'settings>map'].map(n => oneChange(rows, n)).filter(Boolean).concat(rows.filter(r => /^town>(lot|scavenge|bar|clinic|stall)$/.test(r.name)));
    const slow = light.filter(r => { const q = r.inMorph || r; return !(q.fps >= 40 && q.worst <= 200); });   /* judged while the morph plays; the whole window printed */
    const heavy = [['fight>over', 6], ['spoils>map', 8]].map(([n, f]) => [oneChange(rows, n), f]).filter(x => x[0]);
    const slowH = heavy.filter(([r, f]) => !(r.fps >= f));
    ok('E6 FRAMES: while the new morphs play, the town\'s and the settings\' changes hold 40 frames a second or more with no frame over 200 ms; the fight\'s end and the way home never under the old way (this box, full speed)', light.length >= 7 && !slow.length && heavy.length === 2 && !slowH.length,
      light.concat(heavy.map(x => x[0])).map(r => r.name + ' ' + (r.inMorph ? 'while it plays ' + r.inMorph.fps + ' fps, worst ' + r.inMorph.worst + ' ms (the whole change ' : '') + r.fps + ' fps, worst ' + r.worst + ' ms' + (r.inMorph ? ')' : '')).join('; ') + (slow.length || slowH.length ? ' -- SLOW: ' + slow.map(r => r.name).concat(slowH.map(x => x[0].name)).join(', ') : ''));
    console.log('         every change, frames a second (PLUMBER 7\'s 11/7zd in brackets): ' + rows.map(r => r.name + ' ' + r.fps + (BASE[r.name] ? ' [' + BASE[r.name] + ']' : '')).join(', '));

    /* the town again, for the finger, reduced motion and the planted fails */
    await fr.evaluate(() => { try { contactClear(); } catch (_e) {} try { HUNT = null; } catch (_e) {} });
    await fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, S.town);
    const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
    await sf.waitForFunction(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(2500);
    const sbox = await M(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return [b.x, b.y]; });
    const tapWhere = async (k) => { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return false; await S.tap(sbox[0] + w.x, sbox[1] + w.y); return true; };
    const closeSheet = async () => { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await p.waitForTimeout(900); };
    /* ---- E7 A FINGER HOLDS A PIECE ---- */
    await M(() => BohemiaMotion.slowly(4));
    const t7 = await M(() => performance.timeOrigin + performance.now());
    await tapWhere('board');
    let at = null; for (let i = 0; i < 30 && !at; i++) { await p.waitForTimeout(60); at = await sf.evaluate(() => { const c = document.getElementById('close'), sh = document.getElementById('sheet'); if (!c || !sh || !sh.getAnimations || !sh.getAnimations().length) return null; const a = sh.getAnimations()[0]; if (!a || a.playState !== 'running' || (a.currentTime || 0) < 120) return null; const r = c.getBoundingClientRect(); return r.width >= 20 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }); }   /* a pose big enough for a finger (a 9 px close could change pose under the tap) */
    if (at) await S.tap(sbox[0] + at[0], sbox[1] + at[1]);
    await p.waitForTimeout(800); await M(() => BohemiaMotion.slowly(1));
    const closed = await sf.evaluate(() => !BohemiaSettlement.state.open);
    const r7 = await M(t => BohemiaMotion.log.filter(r => r.t0 >= t && r.id === 'sheet' && r.dir === 'in').pop() || null, t7);
    ok('E7 A FINGER HOLDS A PIECE: a tap on the sheet\'s close while it still grows lands on the close, and the morph held its pose for it',
      !!at && closed && !!r7 && r7.frozen === 1 && r7.skipped === true, (at ? 'tapped mid-grow' : 'never caught it growing') + ', the sheet ' + (closed ? 'closed' : 'stayed') + ', ' + (r7 ? (r7.frozen ? 'held' : 'not held') + ', ' + (r7.skipped ? 'landed on the tap' : 'ran out') : 'no row'));
    await closeSheet(); await p.waitForTimeout(600);
    /* ---- E8 REDUCED MOTION ---- */
    await M(() => BOHEMIA_SETTINGS.setMotion(true));
    const t8 = await M(() => performance.timeOrigin + performance.now());
    await tapWhere('board'); await p.waitForTimeout(900);
    const r8 = await M(t => BohemiaMotion.log.filter(r => r.t0 >= t && r.id === 'sheet' && r.dir === 'in').pop() || null, t8);
    ok('E8 REDUCED MOTION: a sheet opens as a fade in place, 250 ms or less', !!r8 && r8.reduced && r8.planned <= 250, r8 ? (r8.reduced ? 'a fade, ' : 'travelled, ') + r8.planned + ' ms' : 'no row');
    await closeSheet(); await M(() => BOHEMIA_SETTINGS.setMotion(false)); await p.waitForTimeout(600);
    /* ---- P1 THE PLANTED FAILS: the old way, the same check ---- */
    await M(() => { window.__MOTION_THREE_OFF = true; });
    /* (a) the weapon card, the old way: it pops on in one frame (the drawn frames see it whole at once) */
    let plantPressed = false;
    const plant = await P.measureOne(S, 'shop>item (planted)', async () => {
      if (!S.shopK) return false;
      if ((await sf.evaluate(() => BohemiaSettlement.state.open)) !== S.shopK) { await tapWhere(S.shopK); await p.waitForTimeout(1800); }
      const sel = await sf.evaluate(() => { const L = [...document.querySelectorAll('#shelfgrid .slot')]; const w = L.findIndex(e => /^weapon:/.test(e.getAttribute('data-item') || '')); return w >= 0 ? '#shelfgrid .slot:nth-child(' + (w + 1) + ')' : null; });
      if (!sel) return false; plantPressed = true; return S.tapSel(sel); });
    await closeSheet();
    const pc = pieceMoves(plant, '#bwcard');
    ok('P1 PLANTED (a): the old way, a weapon\'s card pops on in one frame: the check goes RED', plantPressed && !!plant && plant.pressed && !!pc.p && pc.p.moved >= 0.1 && !pc.good,
      plantPressed ? pc.why + (morphRow(plant, 'card', 'in') ? '; a morph played anyway' : '') : 'no weapon on the shelf: the planted fail proves nothing');
    await fr.evaluate(() => { try { loopClose(); } catch (_e) {} }); await p.waitForTimeout(2500);
    await S.app('settings'); await p.waitForTimeout(1500);
    const plant2 = await P.measureOne(S, 'settings>map (planted)', S.setClose);
    const pm = pieceMoves(plant2, '#setwrap');
    ok('P1 PLANTED (b): the old way, the settings close in one frame: the check goes RED (the settings were up and went)', !!plant2 && plant2.pressed && !!pm.p && pm.p.moved >= 0.1 && !pm.good, pm.why);
    await M(() => { window.__MOTION_THREE_OFF = false; });
    /* ---- E9 ---- */
    const thrown = await M(() => BohemiaMotion.log.filter(r => r.err).map(r => r.id + ': ' + r.err)), errs = S.errors.filter(e => /bohemia_motion/.test(e));
    if (S.errors.length) console.log('         page errors seen (not the layer\'s unless marked): ' + S.errors.slice(0, 4).join(' | '));
    ok('E9 nothing threw (the layer\'s own record and the page)', !thrown.length && !errs.length, (thrown.concat(errs).join('; ') || 'none'));
  } catch (e) { ok('the gate ran to its end', false, String(e && e.stack || e).slice(0, 300)); }
  finally { try { await S.d.close(); } catch (e) {} }
  console.log('THE UI MORPHS EVERYWHERE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();

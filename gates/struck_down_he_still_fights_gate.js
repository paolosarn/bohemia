/* STRUCK DOWN, HE STILL FIGHTS GATE (CAMP [struck down, he still fights], VAMILY rule 234(g), 10/26/26).
   PAOLO 10/26: 'if they fail in combat but they survive to still be in my crew, their health will just be at one, and when you heal
   them they go back up. They're still active. I don't know why you have it so they can't participate in combat anymore, that's why
   I restarted hella runs... they should just have that debuff'; 'I'm gonna have to restart a run and I didn't even make it past the
   first day'.
   WHY THIS WALKS THE DEMO (rule 179): the cut he plays, phone and computer, two real fights in a row from the map's own road door.
   The man is struck down by THE FIGHT'S OWN fall() (its 20 in 100 death roll, its wiki mark, its 6 to 8 of our days, rule 264(h)), never a row typed
   here; AUTO by a real press, LEAVE by a real press.
     S1 fight one: the fight's own fall() strikes his men down one by one (never YOU) until one lives; the fight ends
     S2 the fight's end row for him is down with a wiki permanent mark and ours.json's days (6 to 8), and the company's condition keeps him at
        ONE hitpoint, the mark for life, the fresh wound for those days
     S3 *** STILL IN THE CREW, ACTIVE *** the map's door hands him to the very next fight and he stands on its board, at exactly what
        he was handed (one hitpoint and what the clock healed between); nobody is held out for injury days
     S4 *** THE DEBUFF, NOT THE BENCH *** on that board he carries his mark (the wiki's permanent row, by id) and his fresh wound with
        exactly engine/bohemia_long_injury.js freshNow's effects for the days left
     S5 THE HEAL BAR COUNTS HIM: he is in the company the bar sums, his missing hitpoints in it
     S6 THE CAMP HEALS HIM at the table's rate (records/target/bb/condition.json hp_per_hour_camp): camp made by the map's own call,
        his hitpoints up by the rate times the camped hours (or what he was missing)
     S7 HIS DEBUFF FOR ITS DAYS, HIS MARK FOR LIFE: the map's clock past his days closes the wound; the next hand-over still carries
        the mark and no fresh wound
     S8 THE CREW SCREEN: he is on the line, never on a bench
     S9 AN OLD SAVE WAKES: a save with a man on the crew screen's old bench (the tab killed, the game reopened by CONTINUE) boots with him in the company the door hands, at his saved
        hitpoints or one
     S10 HIS FACE: the condition hands PORTRAIT his marks and the wound's stage (blood, then the band-aid, then the mark alone)
     D1-D4 THE DEAD STAY DEAD (CAMP [eyes: the dead stand up] and [eyes: the dead, again], one system with rule 234), the crew screen
        never opened before he died: D1 the map's count (the bar, the bill, the sizing all read it), the job sizing's roster and the
        HEAL bar count the living and the struck down, never the dead; D2 the next fight neither hands him nor stands him on its
        board; D3 the crew screen, opened after he died, has him dead and says the living count, and the map's count stays right
        after it has read the fight (it empties the queue); D4 after a reload, the same
     S11 nothing threw
   node gates/struck_down_he_still_fights_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const fs = require('fs');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { fightPress } = require(path.join(ROOT, 'tools/bohemia_fight_press.js'));
const LI = require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const SPEED = 6;
const RATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/condition.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const V = (k) => RATES[k].value;
const DAYS = OURS.struck_down_laid_up_days.value;
/* the module's own key (the gate reads the same rule, never a copy of the result) */
function canon(n) { const SAME = { TITO: 'TINA', MARCOS: 'MARISOL', LALO: 'LUPE', NENO: 'NENA' }; const s = String(n || '').trim().toUpperCase(), m = s.match(/^(.*?)( II)?$/); return (SAME[m[1]] || m[1]) + (m[2] || ''); }

const startRoadFight = (d, seq) => d.fr.evaluate(async (seq) => {
  for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
  try { stepOnce(0); stepOnce(4); } catch (_e) {}
  return { started: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: seq }), at: [city.x, city.y] };
}, seq);
const fightFrame = async (d) => {
  for (let i = 0; i < 150; i++) {
    const h = await d.page.$('#fightFrame');
    if (h) { const f = await h.contentFrame();
      if (f) { const ready = await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false);
        if (ready) return { f, box: await h.boundingBox() }; } }
    await d.page.waitForTimeout(200);
  }
  return { f: null, box: null };
};
const press = async (d, x, y) => { if (d.touch) await d.page.touchscreen.tap(x, y); else await d.page.mouse.click(x, y); };
const leaveEnd = async (d) => {
  let sf = null;
  for (let i = 0; i < 120 && !sf; i++) {
    sf = d.page.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    if (sf && !(await sf.evaluate(() => !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened)).catch(() => false))) sf = null;
    if (!sf) await d.page.waitForTimeout(150);
  }
  if (!sf) return false;
  const box = await (await sf.frameElement()).boundingBox(), b = await sf.evaluate(() => { const r = document.getElementById('leave').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await press(d, box.x + b[0], box.y + b[1]);
  return true;
};
const home = async (d) => { for (let i = 0; i < 150; i++) { const s = await d.page.evaluate(() => !CITYFIGHT && !document.getElementById('fightFrame')).catch(() => false); if (s) return true; await d.page.waitForTimeout(100); } return false; };
const units = (f) => f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, main: !!u.main, hp: u.hp, hpMax: u.hpMax,
  injuries: (u.injuries || []).map(j => ({ id: j.id, kind: j.kind, effects: j.effects || null })) })));

/* one whole fight: optionally the fight's own fall() first, then AUTO by a press, LEAVE by a press */
const playFight = async (d, seq, strike, settle) => {
  const st = await startRoadFight(d, seq);
  const { f, box } = await fightFrame(d);
  if (!f) return { st, f: null };
  let struck = null;
  if (strike) struck = await f.evaluate(() => {
    const us = FIGHT.S.units.filter(u => u.side === 'you' && !u.main), them = FIGHT.S.units.filter(u => u.side === 'them'), tried = [];
    /* STRUCK DOWN BY THE FIGHT'S OWN ROLL: the last man of the line falls through FIGHT._t.fall (its 20 in 100 death roll, its wiki mark,
       its 30 to 40 days); a roll that killed him is taken back (the fight's own freeze and thaw, in place; its dice move on) and
       rolled again, so the gate never passes or fails on luck. THE DEAD (CAMP [eyes: the dead stand up]): then the first man of
       the line is killed, by hand, in the fight's own state, so there is a dead man to keep out */
    let lived = null, killed = null;
    const sid = us.length ? us[us.length - 1].id : null;
    for (let t = 0; t < 40 && sid && !lived; t++) {
      const snap = FIGHT.freeze(), u = FIGHT.byId(sid);
      FIGHT._t.fall(u, them[0] || null); tried.push({ name: u.name, dead: !!u.dead, down: !!u.down });
      if (u.down && !u.dead) lived = { name: u.name, days: u.laidUp, injury: u.longInjury ? u.longInjury.id : null };
      else FIGHT.thaw(snap, true);
    }
    if (us.length >= 2) { const k = FIGHT.byId(us[0].id); k.hp = 0; k.dead = true; killed = k.name; }
    /* fight one is always won (a lost fight hands the struck-down man to the crew that beat him, rule 143(e)): one of theirs is
       left at one hitpoint, the rest are down already */
    them.forEach((u, i) => { u.hp = i ? 0 : 1; u.armH = 0; u.armB = 0; if (i) u.dead = true; });
    return { lived, killed, tried };
  });
  const start = await units(f);
  const handed = await d.page.evaluate(() => ({ men: (window.__NF_HANDED && window.__NF_HANDED.men) || null, cond: window.__NF_COND || null })).catch(() => null);
  const C0 = await d.fr.evaluate(() => BohemiaCondition.get()).catch(() => null);
  /* SETTLE (fight two): once its board is read, the other side is down by hand, so the man at one hitpoint walks out of it as he
     walked in and the legs after it read him, not the dice */
  if (settle) await f.evaluate(() => { FIGHT.S.units.filter(u => u.side === 'them').forEach(u => { u.hp = 0; u.dead = true; }); });
  await f.evaluate((sp) => { FIGHT_UI.speed = sp; }, SPEED);
  await fightPress(d.page, f, 'bauto', { mouse: !d.touch });   /* UI TWO (rules 238(a), 286(b)): in the game's fights AUTO is the phone's, pressing the fight's own; the fight's own on the bench */
  const t0 = Date.now();
  while (Date.now() - t0 < 200000) { const o = await f.evaluate(() => FIGHT.S.over).catch(() => true); if (o) break; await d.page.waitForTimeout(400); }
  const rows = await f.evaluate(() => { try { return homeMessage(FIGHT.S.result).crew; } catch (e) { return null; } }).catch(() => null);
  const result = await f.evaluate(() => FIGHT.S.result).catch(() => null);
  await leaveEnd(d); await home(d); await d.page.waitForTimeout(600);
  return { st, f: true, struck, start, handed, rows, result, C0 };
};

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  d.touch = profile !== 'computer';
  const P = profile + ': ';
  try {
    await d.page.waitForTimeout(2500);
    await d.fr.evaluate(() => { try { localStorage.removeItem('bohemia.condition.v1'); localStorage.removeItem('bohemia.fight.after.v1'); } catch (e) {} });

    /* ---- S1 ---- */
    let F1 = null, tries = 0;
    while (tries < 4) { tries++; F1 = await playFight(d, tries, true); if (F1.f && F1.struck && F1.struck.lived && F1.rows) break; }
    const man = F1 && F1.struck && F1.struck.lived;
    ok(P + 'S1 fight one: the fight\'s own fall() struck his men down (never YOU) until one lived, and the fight ended',
      !!man && !!F1.rows, man ? man.name + ' lived (' + man.injury + ', ' + man.days + ' days); tried ' + F1.struck.tried.map(t => t.name + (t.dead ? ' dead' : ' down')).join(', ') + '; ' + F1.result : JSON.stringify(F1 && F1.struck));
    if (!man) return;
    const K = canon(man.name), DEAD = F1.struck.killed, DK = canon(DEAD);
    const counts = (fr) => fr.evaluate((a) => { const o = (LOOP.start && LOOP.start.company) || [], r = BohemiaJobKinds.roster(), c = BohemiaCondition.company(o);
      return { origin: o.length, crew: crewCount(), dead: crewDead(), roster: r.men.map(m => m.name), heal: c.names, taken: crewTaken().length,
        walked: (JSON.parse(localStorage.getItem('bohemia.walked.v1') || '[]') || []).length,
        hired: (JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []).length }; }, null);
    /* what the map's count should be: the origin's men and the hires, less every man any fight here killed (by the module's key), the
       taken and the walked; worked out from the fights' own end rows, never from the list under test */
    const deadSet = new Set(), wantCrew = (c, rowsList) => { rowsList.forEach(rs => (rs || []).forEach(r => { if (r && r.dead && !r.main) deadSet.add(canon(r.name)); }));
      return Math.max(1, c.origin + c.hired - deadSet.size - c.taken - c.walked); };

    /* ---- S2 ---- */
    const row = F1.rows.find(r => r.name === man.name), C1 = await d.fr.evaluate(() => BohemiaCondition.get()), m1 = C1.men[K];
    const kept = !!m1 && Math.abs((m1.hpMax - m1.lostHp) - V('struck_down_hp_left')) <= (C1.healed + 0.5) && (m1.marks || []).indexOf(row.injury.id) >= 0 && !!m1.wound && m1.wound.mark === row.injury.id && m1.wound.of === row.laidUpDays;
    ok(P + 'S2 his end row is down with a wiki permanent mark and ' + DAYS[0] + ' to ' + DAYS[1] + ' days; the condition keeps him at ONE hitpoint, the mark for life, the fresh wound for those days',
      !!row && row.down && !row.dead && !!row.injury && !!LI.byId(row.injury.id) && row.laidUpDays >= DAYS[0] && row.laidUpDays <= DAYS[1] && kept,
      row ? row.injury.id + ', ' + row.laidUpDays + ' days; kept ' + JSON.stringify(m1 && { hp: +(m1.hpMax - m1.lostHp).toFixed(2), of: m1.hpMax, marks: m1.marks, wound: m1.wound }) : 'no row');

    /* ---- D1 the counts, the crew screen never opened ---- */
    const d1 = await counts(d.fr), deadRow = F1.rows.find(r => r.name === DEAD);
    const d1ok = !!deadRow && deadRow.dead && d1.crew === wantCrew(d1, [F1.rows]) && d1.dead.some(n => canon(n) === DK)
      && !d1.roster.some(n => n && canon(n) === DK) && d1.heal.indexOf(DK) < 0 && d1.heal.indexOf(K) >= 0;
    ok(P + 'D1 THE DEAD STAY DEAD, the crew screen never opened: the map\'s count, the job sizing\'s roster and the HEAL bar leave ' + DEAD + ' out and count the struck down',
      d1ok, 'count ' + d1.crew + ' of ' + d1.origin + ' (+' + d1.hired + ' hired); dead ' + JSON.stringify(d1.dead) + '; roster ' + d1.roster.join(',') + '; bar ' + d1.heal.join(','));

    /* ---- S3 / S4 fight two ---- */
    const F2 = await playFight(d, 9, false, true);
    if (!F2.f) { ok(P + 'S3 fight two opened', false, JSON.stringify(F2.st)); return; }
    const on = F2.start.find(u => canon(u.name) === K), handedMen = (F2.handed && F2.handed.men) || [], hc = ((F2.handed && F2.handed.cond) || []).find(x => x && canon(x.name) === K);
    const C2 = F2.C0 && F2.C0.men[K];
    const wantHp = hc && hc.cond ? Math.max(1, Math.round(on ? on.hpMax - hc.cond.lostHp : 0)) : null;
    ok(P + 'S3 *** STILL IN THE CREW, ACTIVE *** the map\'s door hands him to the very next fight and he stands on its board at exactly what he was handed (one hitpoint and what the clock healed)',
      handedMen.some(n => canon(n) === K) && !!on && wantHp != null && on.hp === wantHp && on.hp < on.hpMax,
      on ? man.name + ' on the board at ' + on.hp + '/' + on.hpMax + ' (handed ' + (hc && hc.cond ? hc.cond.lostHp + ' missing' : 'nothing') + ')' : man.name + ' NOT on the board; handed: ' + handedMen.join(', '));
    ok(P + 'D2 THE DEAD STAY DEAD: the next fight neither hands ' + DEAD + ' nor stands him on its board',
      !handedMen.some(n => n && canon(n) === DK) && !F2.start.some(u => canon(u.name) === DK), 'handed ' + handedMen.join(', ') + '; board ' + F2.start.map(u => u.name).join(', '));
    const life = on ? on.injuries.filter(j => j.kind === 'permanent').map(j => j.id) : [];
    const fr = on ? on.injuries.find(j => j.kind === 'fresh') : null;
    const want = C2 && C2.wound ? LI.freshNow(C2.wound.mark, C2.wound.left, C2.wound.of) : null;
    ok(P + 'S4 *** THE DEBUFF, NOT THE BENCH *** on that board he carries his mark (the wiki\'s row) and his fresh wound with exactly freshNow\'s effects for the days left',
      life.indexOf(row.injury.id) >= 0 && (want ? !!fr && fr.id === want.id && JSON.stringify(fr.effects) === JSON.stringify(want.effects) : !fr),
      'mark ' + JSON.stringify(life) + '; fresh ' + JSON.stringify(fr) + ' against ' + JSON.stringify(want && { id: want.id, effects: want.effects }));

    /* ---- S5 the bar counts him ---- */
    const bar = await d.fr.evaluate((K) => { const c = BohemiaCondition.company(LOOP.start && LOOP.start.company), m = BohemiaCondition.get().men[K]; return { names: c.names, hp: c.hp, hpMax: c.hpMax, lost: m ? m.lostHp : null }; }, K);
    ok(P + 'S5 THE HEAL BAR COUNTS HIM: he is in the company the bar sums, his missing hitpoints in it', bar.names.indexOf(K) >= 0 && bar.lost > 0 && bar.hp <= bar.hpMax - bar.lost + 1e-6,
      K + ' in ' + bar.names.length + ' men; ' + Math.round(bar.hp) + '/' + bar.hpMax + ', he is missing ' + (bar.lost == null ? '?' : bar.lost.toFixed(1)));

    /* ---- S6 the camp heals him ---- */
    const quiet = () => d.fr.evaluate(() => { try { contactClear(); } catch (_e) {} try { HUNT = null; HUNT_FLEE = null; } catch (_e) {} try { if (MEET.up && typeof meetClose === 'function') meetClose(); } catch (_e) {} });
    await quiet();
    const c0 = await d.fr.evaluate((K) => { const C = BohemiaCondition.get(); return { lost: C.men[K].lostHp, campHours: C.campHours }; }, K);
    await d.fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} });
    await d.page.waitForTimeout(4200);
    const c1 = await d.fr.evaluate((K) => { const C = BohemiaCondition.get(); return { lost: C.men[K].lostHp, campHours: C.campHours, on: BohemiaMapCamp.on() }; }, K);
    await d.fr.evaluate(() => { try { BohemiaMapCamp.break(); } catch (e) {} });
    const ch = c1.campHours - c0.campHours, got = c0.lost - c1.lost, rate = V('hp_per_hour_camp');
    ok(P + 'S6 THE CAMP HEALS HIM at the table\'s rate (' + rate + ' an hour camped): his hitpoints up by the rate times the camped hours, or what he was missing',
      ch >= 1 && got > 0 && got <= Math.min(c0.lost, (rate + V('cook_hp_per_hour')) * ch) + 0.01 && (c1.lost < 0.01 || got >= rate * ch - rate - 0.01),
      ch.toFixed(1) + ' camp hours, +' + got.toFixed(1) + ' hp, missing ' + c0.lost.toFixed(1) + ' -> ' + c1.lost.toFixed(1));

    /* ---- S10 his face: the stage the condition hands PORTRAIT, fresh now, then the band-aid as the map's clock closes it ---- */
    const s10 = await d.fr.evaluate((K) => { const m = BohemiaCondition.get().men[K], a = BohemiaCondition.injuryOf(m.shown), w = m.wound;
      const to = w ? Math.max(0, w.left - w.of * 0.3) : 0; if (to > 0) BohemiaCondition.elapse(24 * to, {});
      const b = BohemiaCondition.injuryOf(m.shown); return { a: a && a.look, b: b && b.look, left: b && b.wound && b.wound.left }; }, K);
    ok(P + 'S10 HIS FACE: the condition hands PORTRAIT his mark and the wound\'s stage (blood while it is fresh, the band-aid as the clock closes it)',
      !!s10.a && s10.a.marks.indexOf(row.injury.id) >= 0 && s10.a.fresh === 'blood' && !!s10.b && s10.b.fresh === 'bandage', JSON.stringify(s10));

    /* ---- S7 the days pass, the mark stays ---- */
    const s7 = await d.fr.evaluate((K) => { BohemiaCondition.elapse(24 * 45, {}); const m = BohemiaCondition.get().men[K], h = BohemiaCondition.handOver([{ name: 'YOU' }, { name: m.shown }]).company[1];
      return { wound: m.wound || null, marks: m.marks, handedMarks: h.marks || null, handedFresh: h.fresh || null, inj: BohemiaCondition.injuryOf(m.shown) }; }, K);
    ok(P + 'S7 HIS DEBUFF FOR ITS DAYS, HIS MARK FOR LIFE: past his days the wound has closed; the next hand-over carries the mark and no fresh wound',
      !s7.wound && (s7.marks || []).indexOf(row.injury.id) >= 0 && (s7.handedMarks || []).indexOf(row.injury.id) >= 0 && !s7.handedFresh && !!s7.inj && !s7.inj.wound,
      JSON.stringify({ wound: s7.wound, marks: s7.marks, handed: s7.handedMarks, fresh: s7.handedFresh }));

    /* ---- S8 the crew screen ---- */
    /* the game's one door to the company (slices/bohemia_ui_materials.js crewDoor: engine/bohemia_crew_door.js, base '') */
    await d.page.evaluate(() => new Promise(r => { const go = () => { try { if (!BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.open({ base: '' }); } catch (e) {} r(); };
      if (window.BohemiaCrewDoor) return go(); const sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_door.js'; sc.onload = go; document.head.appendChild(sc); }));
    let cf = null; for (let i = 0; i < 60 && !cf; i++) { await d.page.waitForTimeout(250);
      for (const x of d.page.frames().filter(x => /ROSTER_SCREEN/.test(x.url()))) if (await x.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready)).catch(() => false)) { cf = x; break; } }
    /* the game's company comes by message a moment after the screen's own boot: read it once it is here */
    if (cf) for (let i = 0; i < 40; i++) { if (await cf.evaluate(() => !!BohemiaRosterScreen.state.fromOrigin || !BohemiaRosterScreen.state.defaultCrew).catch(() => false)) break; await d.page.waitForTimeout(150); }
    const s8 = cf ? await cf.evaluate((a) => { const S = BohemiaRosterScreen.state, c = (m) => BohemiaCondition ? BohemiaCondition.canon(m.name, m.main) : m.name.toUpperCase();
      const ix = S.crew.findIndex(m => c(m) === a.K), dx = S.crew.findIndex(m => c(m) === a.DK), living = S.crew.filter(m => !m.dead).length;
      return { ix, inLine: S.front.concat(S.back).indexOf(ix) >= 0, strip: document.querySelectorAll('#hurt .cell').length, bench: (JSON.parse(localStorage.getItem('bohemia.company.line.v1') || '{}').bench || []).length,
        deadAlive: dx >= 0 && !S.crew[dx].dead, deadInLine: dx >= 0 && S.front.concat(S.back).indexOf(dx) >= 0, living, title: document.getElementById('title').textContent }; }, { K, DK }) : null;
    ok(P + 'S8 THE CREW SCREEN: he is on the line, never on a bench', !!s8 && s8.ix >= 0 && s8.inLine && s8.strip === 0 && s8.bench === 0, JSON.stringify(s8));
    try { await d.page.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (e) {} }); } catch (_e) {}
    await d.page.waitForTimeout(400);
    const d3 = await counts(d.fr);
    ok(P + 'D3 THE DEAD STAY DEAD after the crew screen has read the fight: it has ' + DEAD + ' dead and off the line, its count is the living, and the map\'s count stays right with the queue emptied',
      !!s8 && !s8.deadAlive && !s8.deadInLine && new RegExp('COMPANY\\s+' + s8.living + '\\s').test(s8.title) && d3.crew === wantCrew(d3, [F1.rows, F2.rows]) && !d3.roster.some(n => n && canon(n) === DK),
      (s8 ? s8.title + '; dead alive ' + s8.deadAlive + ', in line ' + s8.deadInLine : 'no screen') + '; map count ' + d3.crew + ' (want ' + wantCrew(d3, [F1.rows, F2.rows]) + '); queue ' + await d.fr.evaluate(() => localStorage.getItem('bohemia.fight.after.v1')));

    /* ---- S9 an old save wakes (last: it reloads) ---- */
    const old = 'OLDBENCH';
    await d.fr.evaluate((old) => { const hk = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || []; const hl = JSON.parse(localStorage.getItem('bohemia.company.line.v1') || 'null') || { front: [], back: [], men: [] };
      hl.bench = [{ man: { name: old, background: 'militia', level: 2, stats: { hp: 58 } }, until: 999 }]; localStorage.setItem('bohemia.company.line.v1', JSON.stringify(hl)); localStorage.setItem('bohemia.company.v1', JSON.stringify(hk)); }, old);
    /* THE TAB DIES AND HE COMES BACK (the way a phone kills a tab: no pagehide, no last word), on the same phone, through CONTINUE
       (tools/bohemia_drive_the_demo.js opts.again, gates/gear_through_the_save_gate.js's own move) */
    await d.page.waitForTimeout(2500);
    await d.page.goto('chrome://crash').catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    { const old = d; d = await drive.open({ file: 'BOHEMIA_DEMO.html', keepCards: true, engage: true, profile, again: old }); d.touch = profile !== 'computer'; }
    await d.page.waitForTimeout(2500);
    const fr2 = d.fr;
    for (let i = 0; i < 80; i++) { if (await fr2.evaluate(() => !!(window.LOOP && LOOP.start && Array.isArray(LOOP.start.company) && LOOP.start.company.length)).catch(() => false)) break; await d.page.waitForTimeout(250); }
    const s9 = await fr2.evaluate((old) => { const hk = JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || [], hl = JSON.parse(localStorage.getItem('bohemia.company.line.v1') || '{}');
      const m = window.BohemiaCondition ? BohemiaCondition.get().men[old] : null; return { inCo: hk.some(x => x && x.name === old), bench: (hl.bench || []).length, hp: m ? m.hpMax - m.lostHp : null }; }, old).catch(e => ({ err: String(e.message).slice(0, 120) }));
    ok(P + 'S9 AN OLD SAVE WAKES: a man on the crew screen\'s old bench is in the company the door hands, at his saved hitpoints or one', !!s9 && s9.inCo && s9.bench === 0 && s9.hp != null && s9.hp >= 1 && s9.hp <= 58, JSON.stringify(s9));
    const d4 = await counts(fr2).catch(e => ({ err: String(e.message).slice(0, 120) }));
    const hk4 = await fr2.evaluate(() => (JSON.parse(localStorage.getItem('bohemia.company.v1') || '[]') || []).map(m => m && m.name)).catch(() => []);
    ok(P + 'D4 THE DEAD STAY DEAD after a reload: the map\'s count is the living (the woken man added), the hand-over and the sizing never carry ' + DEAD,
      !d4.err && d4.crew === wantCrew(d4, [F1.rows, F2.rows]) && !hk4.some(n => n && canon(n) === DK) && !d4.roster.some(n => n && canon(n) === DK),
      JSON.stringify({ crew: d4.crew, want: d4.err ? null : wantCrew(d4, [F1.rows, F2.rows]), handOver: hk4, origin: d4.origin, hired: d4.hired, taken: d4.taken, walked: d4.walked, dead: d4.dead, err: d4.err }));

    /* ---- S11 ---- */
    ok(P + 'S11 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 160) : 'no errors');
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== STRUCK DOWN, HE STILL FIGHTS GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();

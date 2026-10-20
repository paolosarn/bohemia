#!/usr/bin/env node
/* THE FIRST FIGHT TEACHES (COMBAT [the first fight teaches]; records/BOHEMIA_PAOLO_WHAT_IS_THE_PLAN_FOR_COMBAT_TOUCH_UI_
   UNDERSTANDING_10_19_26.md part D, his 10/19: 'better for people that understand'). No tutorial card, nothing pops up (a
   quest is people; text comes from a mouth with a portrait): one veteran of the company, with his portrait, says three short
   lines at the moments they matter (the first aim, the first time cover matters, the first reload), each once, never in the
   first second, never again after.

   On his phone's profile (390 x 844 at 3x), the real page, real taps, a fresh phone:
   1. THE OPEN IS QUIET: nobody speaks in the first second;
   2. THE FIRST AIM: a finger on a man: the veteran speaks, his face drawn beside his name, a man of the company who is not
      YOU, the aim line; it covers no button and takes no tap (a tap through it still picks the tile under it);
   3. EACH ONCE: a second aim says nothing new;
   4. THE FIRST EMPTY GUN: the reload line, from the same veteran;
   5. THE FIRST TIME COVER MATTERS: a finger on a man standing in cover: the cover line;
   6. NEVER AGAIN: a new fight on the same phone: the aim, the empty gun and the cover say nothing;
   7. ALONE, NOBODY TEACHES AND NOTHING IS SPENT: a fight with YOU alone shows no veteran, and the lesson waits;
   8. THE WORDS: the lesson in English with at most one flavour word, every Spanish word in the lexicon's declared set
      (engine/bohemia_people.js ES_LEX; LANGUAGE NEVER GATES REQUIRED INFORMATION); each line under twelve words.
   Run: node gates/the_first_fight_teaches_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const FIGHT_FILE = process.env.FIGHT_FILE || 'BOHEMIA_FIGHT.html';   /* a draft beside the fight can be driven by name */
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

/* 8: the words, read from the page */
const html = fs.readFileSync(path.join(ROOT, 'slices', FIGHT_FILE), 'utf8');
const tm = html.match(/const TEACH = \{[^\n]*\n([\s\S]*?)\n\};/);
const lines = tm ? Array.from(tm[1].matchAll(/(\w+): '([^']+)'/g)).reduce((o, m) => (o[m[1]] = m[2], o), {}) : {};
const ppl = fs.readFileSync(path.join(ROOT, 'engine/bohemia_people.js'), 'utf8'), lm = ppl.match(/ES_LEX\s*=\s*(\{[\s\S]*?\});/);
const LEX = lm ? eval('(' + lm[1] + ')') : {};
const EN = new Set('one tap shows your odds him again to shoot a man in cover is hard hit and you too makes that click means empty before aim the it'.split(' '));
const bad = [];
Object.keys(lines).forEach(k => { const w = lines[k].replace(/[.,!?]/g, '').split(/\s+/), es = w.filter(x => LEX[x.toLowerCase()] !== undefined && !EN.has(x.toLowerCase()));
  if (es.length > 1) bad.push(k + ': ' + es.join(' ')); if (w.length >= 12) bad.push(k + ': ' + w.length + ' words'); });
leg(['aim', 'cover', 'reload'].every(k => lines[k]) && !bad.length, '*** THE WORDS: THREE LINES, THE LESSON IN ENGLISH, AT MOST ONE FLAVOUR WORD FROM THE LEXICON, UNDER TWELVE WORDS ***',
  bad.length ? bad.join(' | ') : Object.keys(lines).map(k => k + ': "' + lines[k] + '"').join(' | '));

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const mine = async p => { for (let i = 0; i < 80; i++) { const st = await p.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
    if (st === 'mine') return; if (st === 'theirs') await p.touchscreen.tap(200, 420); await p.waitForTimeout(150); } };
  const stand = async (p, d, setup) => { await mine(p);
    await p.evaluate(q => { const S = FIGHT.S, u = S.units.filter(v => v.side === 'you' && !!v.weapon.of && v.main)[0] || S.units.filter(v => v.side === 'you' && !!v.weapon.of)[0], t = S.units.filter(v => v.side === 'them')[0];
      S.units.forEach(v => { if (v.side === 'them' && v !== t) v.fled = true; });
      u.x = 12; u.y = 6; t.x = 12 + q.d; t.y = 6; S.order = [u.id, t.id]; S.idx = 0; u.ap = u.apTurn; u.fat = 0; u.begun = true; t.hp = t.hpMax * 50; t.hpMax = t.hp;
      if (q.setup) new Function('u', 't', 'S', q.setup)(u, t, S);
      FIGHT_UI.anim = []; FIGHT_UI.glide = null; FIGHT_UI.pend = null; FIGHT_UI.cx = (u.x + q.d / 2 + .5) * FIGHT_UI.tw; FIGHT_UI.cy = (u.y + .3) * FIGHT_UI.th; }, { d, setup: setup || '' });
    await p.waitForTimeout(400); };
  const tapThem = async p => { const s = await p.evaluate(() => { const t = FIGHT.S.units.filter(v => v.side === 'them')[0]; return { x: sx((t.x + .5) * FIGHT_UI.tw), y: sy((t.y + .5) * FIGHT_UI.th) }; });
    await p.touchscreen.tap(s.x, s.y); await p.waitForTimeout(300); };
  const vet = p => p.evaluate(() => { const e = document.getElementById('vet'), r = e.getBoundingClientRect(), V = FIGHT_UI.vet, who = V && FIGHT.byId(V.who);
    const fc = document.getElementById('vetface'), px = fc.getContext('2d').getImageData(0, 0, fc.width, fc.height).data; let lit = 0; for (let i = 0; i < px.length; i += 16) if (px[i] + px[i + 1] + px[i + 2] > 120) lit++;
    const tap = ['bend', 'bwait', 'breload', 'bstrike'].map(i => document.getElementById(i).getBoundingClientRect()).filter(q => q.width > 0);
    const over = tap.some(q => !(q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom));
    return { shown: e.style.display !== 'none', k: V && V.k, name: document.getElementById('vetname').textContent, line: V && V.line, who: who ? { main: !!who.main, side: who.side, name: who.name } : null,
      face: lit, over: e.style.display !== 'none' && over, pe: getComputedStyle(e).pointerEvents, t: performance.now() - FIGHT_UI.t0 }; });
  const base = { seed: 5, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'] };

  /* one browser context for the whole phone: what was taught stays taught across fights (6) */
  const d = await open({ file: FIGHT_FILE, bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  const p = d.page;
  /* 1: inside the open (the first second and the beats the board holds still) the veteran refuses to speak */
  await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT_UI.t0 > 0, null, { timeout: 40000 });
  const quiet = await p.evaluate(() => { try { localStorage.removeItem('bohemia.fight.taught'); } catch (_e) {} FIGHT_UI.taughtMem = null;
    const t = performance.now() - FIGHT_UI.t0, said = teach('aim'); return { t: Math.round(t), open: Math.round(FIGHT_UI.openUntil - FIGHT_UI.t0), said, shown: document.getElementById('vet').style.display !== 'none' }; });
  leg(quiet.t < quiet.open && !quiet.said && !quiet.shown, '*** THE OPEN IS QUIET: nobody speaks in the first second, nor while the board holds still ***', 'asked at ' + quiet.t + ' ms of the ' + quiet.open + ' ms open: ' + (quiet.said ? 'SPOKE' : 'quiet'));
  await p.waitForFunction(() => FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
  await stand(p, 3);
  await tapThem(p);
  await p.waitForTimeout(1600);
  const a = await vet(p);
  leg(a.shown && a.k === 'aim' && a.who && a.who.side === 'you' && !a.who.main && a.name === a.who.name && a.face > 50 && a.line,
    '*** THE FIRST AIM: A VETERAN OF THE COMPANY SPEAKS, HIS FACE BESIDE HIS NAME, NEVER YOU ***', a.name + ': "' + a.line + '" (' + a.face + ' lit points on his face)');
  leg(!a.over && a.pe === 'none', '  it covers no button and takes no tap', (a.over ? 'OVER A BUTTON' : 'clear') + ', pointer-events ' + a.pe);
  await p.evaluate(() => { document.getElementById('vet').style.display = 'none'; FIGHT_UI.vet = null; });
  await stand(p, 3); await tapThem(p);
  const b = await vet(p);
  leg(!b.shown, '*** EACH ONCE: a second aim says nothing new ***', b.shown ? b.k + ' again' : 'quiet');
  /* the first empty gun: a pistol with no rounds, a tap that would fire */
  await stand(p, 3, 'u.ammo = 0;'); await tapThem(p); await p.waitForTimeout(300);
  const c = await vet(p);
  leg(c.shown && c.k === 'reload' && c.name === a.name, '*** THE FIRST EMPTY GUN: THE RELOAD LINE, THE SAME VETERAN ***', c.name + ': "' + c.line + '"');
  await p.evaluate(() => { document.getElementById('vet').style.display = 'none'; FIGHT_UI.vet = null; });
  /* the first time cover matters: the thug stands on a cover tile */
  await stand(p, 3, 'u.ammo = u.weapon.mag || u.ammo; S.cover[t.y][t.x] = S.cover[t.y][t.x] || "barrier"; S.coverCount[t.y][t.x] = Math.max(1, S.coverCount[t.y][t.x]);');
  await tapThem(p); await p.waitForTimeout(300);
  const e = await vet(p);
  leg(e.shown && e.k === 'cover', '*** THE FIRST TIME COVER MATTERS: A MAN IN COVER UNDER THE FINGER, THE COVER LINE ***', e.shown ? e.name + ': "' + e.line + '"' : 'nobody spoke');
  /* a new fight on the same phone */
  await p.evaluate(() => { document.getElementById('vet').style.display = 'none'; FIGHT_UI.vet = null; FIGHT_UI.taughtMem = null; document.getElementById('over').style.display = 'none'; return start(); });
  await p.waitForFunction(() => FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
  await stand(p, 3); await tapThem(p);
  const f1 = await vet(p);
  await stand(p, 3, 'u.ammo = 0;'); await tapThem(p);
  const f2 = await vet(p);
  leg(!f1.shown && !f2.shown, '*** NEVER AGAIN: A NEW FIGHT ON THE SAME PHONE, THE AIM AND THE EMPTY GUN SAY NOTHING ***', (f1.shown ? f1.k : 'quiet') + ', ' + (f2.shown ? f2.k : 'quiet'));
  leg(d.errs.length === 0, '  the page threw nothing', d.errs[0] || '');
  await d.close();

  /* 7: YOU alone */
  const d2 = await open({ file: FIGHT_FILE, bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(base) });
  const p2 = d2.page;
  await p2.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
  await p2.evaluate(() => { try { localStorage.removeItem('bohemia.fight.taught'); } catch (_e) {} FIGHT_UI.taughtMem = null; FIGHT.S.units.forEach(v => { if (v.side === 'you' && !v.main) v.fled = true; }); });
  await stand(p2, 3); await tapThem(p2);
  const g = await vet(p2), kept = await p2.evaluate(() => JSON.parse(localStorage.getItem('bohemia.fight.taught') || '{}'));
  leg(!g.shown && !kept.aim, '*** ALONE, NOBODY TEACHES, AND THE LESSON WAITS FOR A FIGHT WITH A VETERAN ***', (g.shown ? 'SPOKE' : 'quiet') + ', kept ' + JSON.stringify(kept));
  await d2.close();
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
function done() { console.log('=== THE FIRST FIGHT TEACHES GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); }

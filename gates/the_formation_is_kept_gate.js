#!/usr/bin/env node
/* THE FORMATION IS KEPT (COMBAT [formation], rule 110b, Paolo 10/16: 'the team member formation is shit'; rule 36a:
   '450 hours... squad formation'). Battle Brothers' deployment before the fight, on the rebuilt fight at his phone's
   profile (390x844 at 3x, through the one driver), with a REAL finger:
     1. the fight opens waiting for his line, and the enemy's line is DRAWN while he sets his (every man of theirs on the
        field, night or day), as Battle Brothers shows the enemy's deployment;
     2. he DRAGS a man to a tile of his two columns and the man stands there; a drag outside the columns leaves him where he
        was; a drag onto a friend trades their places;
     3. the line is WRITTEN DOWN by name the moment he moves a man, and the next fight (the page reloaded, the fight dealt
        again) opens with every man where he left him, the hint saying so;
     4. the memory is by NAME, so a company handed over in another order still puts each man on his own tile;
     5. AUTO holds it: a fight that opens on AUTO skips the setting and starts on the kept line, nobody moved first, and the
        crew's melee men walk as a line (none further ahead of his line's middle than the line's depth, ours.formation_depth_lines);
     6. a clean start (FIGHT_OPTS.formation === null) forgets it and deals the default line again.
   Shots (--shoot): slices/vote/COMBAT_FORMATION_KEPT_10_16.jpg, the default line and the kept line, the same board, side by side.
   Run: node gates/the_formation_is_kept_gate.js [--shoot] */
'use strict';
const fs = require('fs');
const path = require('path');
const { open } = require('../tools/bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const { proofShot } = require(path.join(ROOT, 'tools', 'bohemia_proof_shot.js'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const DEPTH = OURS.formation_depth_lines.value;
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const SHOT = { scale: 'css', type: 'jpeg', quality: 72 };
const NIGHT_SEED = 21, SEED = 22, KIND = 'suburb', SPEED = 6;
/* the enemy drawn: every call of drawMan on a man of theirs is counted while the line is set */
const ARM = 'window.__them=[];window.FIGHT_OPTS={seed:' + NIGHT_SEED + ',speed:' + SPEED + ',kind:"' + KIND + '",night:true};'
  + 'addEventListener("DOMContentLoaded",function(){setTimeout(function(){try{var o=drawMan;drawMan=function(v,a,b){if(v.side==="them"&&__them.indexOf(v.id)<0)__them.push(v.id);return o(v,a,b);};}catch(_e){}},0);});';

async function main() {
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: ARM });
  const p = d.page;
  const ev = (f, a) => p.evaluate(f, a);
  const until = async (fn, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p.evaluate(fn)) return true; await p.waitForTimeout(60); } return false; };
  const loaded = async () => until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && FIGHT.S.deploy && !FIGHT_UI.glide && performance.now() > FIGHT_UI.openUntil, 30000);
  const scr = (x, y) => ev((q) => ({ x: (q[0] - FIGHT_UI.cx) * FIGHT_UI.zoom + innerWidth / 2, y: (q[1] - FIGHT_UI.cy) * FIGHT_UI.zoom + TOPH + (innerHeight - TOPH - BOTH) / 2 }), [x, y]);
  const where = (id) => ev(id => { const u = FIGHT.byId(id); return [u.x, u.y]; }, id);
  const at = (name) => ev(q => { const u = FIGHT.S.units.filter(v => v.side === 'you' && v.name === q)[0]; return u ? [u.x, u.y] : null; }, name);
  const same = (a, b) => !!a && !!b && a[0] === b[0] && a[1] === b[1];
  const restart = (opts) => ev(o => { FIGHT_UI.auto = false; window.FIGHT_OPTS = o; return start(); }, opts);
  /* a finger drags: down on the man's body, six steps to the target tile's middle, up */
  const drag = async (id, tx, ty) => {
    const u = await ev(id => { const u = FIGHT.byId(id); return { x: u.x, y: u.y, tw: FIGHT_UI.tw, th: FIGHT_UI.th }; }, id);
    const a = await scr((u.x + .5) * u.tw, (u.y + .55) * u.th), b = await scr((tx + .5) * u.tw, (ty + .5) * u.th);
    await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.waitForTimeout(60);
    for (let i = 1; i <= 6; i++) { await p.mouse.move(a.x + (b.x - a.x) * i / 6, a.y + (b.y - a.y) * i / 6); await p.waitForTimeout(40); }
    const mid = await ev(() => FIGHT_UI.drag ? { id: FIGHT_UI.drag.u.id } : null);
    await p.mouse.up(); await p.waitForTimeout(200);
    return mid;
  };
  /* ---- 1. the open, waiting for his line, the enemy drawn (at night, where the rules do not see every man) ---- */
  leg(await loaded(), 'the ground loads and the fight waits for his line (FIGHT.S.deploy)');
  await ev(() => { try { localStorage.removeItem(FIGHT.FORMATION_KEY); } catch (_e) {} });
  await restart({ seed: NIGHT_SEED, speed: SPEED, kind: KIND, night: true, formation: null });
  leg(await loaded(), 'a clean start at night (FIGHT_OPTS.formation null): the default line is dealt');
  await p.waitForTimeout(500);
  const o1 = await ev(() => { const S = FIGHT.S; const them = S.units.filter(u => u.side === 'them' && FIGHT.onField(u));
    return { night: S.night, them: them.length, drawn: __them.filter(id => them.some(u => u.id === id)).length, seen: them.filter(u => FIGHT.sideSees('you', u)).length,
      kept: S.formationKept, say: document.getElementById('say').textContent, label: document.getElementById('bend').textContent.trim() }; });
  leg(o1.them > 0 && o1.drawn === o1.them, '*** THE ENEMY\'S LINE IS DRAWN WHILE HE SETS HIS *** (every man of theirs on the field, at night)', o1.drawn + ' of ' + o1.them + ' drawn; the rules see ' + o1.seen + ' of them; night ' + o1.night);
  leg(!o1.kept && /drag a man/i.test(o1.say) && /kept for the next fight/i.test(o1.say) && o1.label === 'FIGHT', 'the first time, the hint says how: drag a man to a lit tile, it is kept for the next fight; the button reads FIGHT', o1.say);
  /* ---- the board the picture is taken on: the same seed by day, before and after ---- */
  await restart({ seed: SEED, speed: SPEED, kind: KIND, night: false, formation: null });
  leg(await loaded(), 'a clean start by day, seed ' + SEED + ': the default line (the BEFORE picture)');
  await p.waitForTimeout(400);
  const before = await p.screenshot(Object.assign({ path: proofShot(path.join(ROOT, 'slices/vote/COMBAT_FORMATION_KEPT_BEFORE_10_16.jpg')) }, SHOT));
  /* ---- 2. the drags: one man to the top corner of the line, one to the bottom corner ---- */
  /* the camera on his two columns first: a finger that drops within DRAG_EDGE of the glass's side pans the board under it by
     design (dragPan), so a drop the leg aims at the very edge lands a tile off (measured 10/20: the friend at 6,5 stood 41 px
     from the left edge on this board, the drag panned 93 world px and the trade never happened) */
  await ev(() => { const z = FIGHT._t.zoneCols(); FIGHT_UI.glide = null; FIGHT_UI.cx = ((Math.min.apply(null, z) + Math.max.apply(null, z)) / 2 + .5) * FIGHT_UI.tw; });
  await p.waitForTimeout(200);
  const plan = await ev(() => { const S = FIGHT.S, z = FIGHT._t.zoneCols(), you = FIGHT.alive('you').filter(u => !u.main);
    const u = you[1] || you[0], u2 = you.filter(v => v !== u).slice(-1)[0], mate = you.filter(v => v !== u && v !== u2)[0];
    const free = (x, y) => y >= 0 && y < S.h && FIGHT._t.passable(x, y) && !S.units.some(v => FIGHT.onField(v) && v.x === x && v.y === y);
    let top = null; for (let y = 0; y < S.h && !top; y++) for (const x of z) if (!top && free(x, y)) top = { x, y };
    let bot = null; for (let y = S.h - 1; y >= 0 && !bot; y--) for (const x of z) if (!bot && free(x, y) && !(top && top.x === x && top.y === y)) bot = { x, y };
    let out = null; const ox = Math.max.apply(null, z) + 2; for (let y = 0; y < S.h && !out; y++) if (free(ox, y)) out = { x: ox, y };
    return { id: u.id, name: u.name, from: [u.x, u.y], to: top, id2: u2 ? u2.id : null, name2: u2 ? u2.name : null, from2: u2 ? [u2.x, u2.y] : null, to2: bot, out,
      mate: mate ? { id: mate.id, at: [mate.x, mate.y] } : null }; });
  leg(!!plan.to && !!plan.to2 && !same([plan.to.x, plan.to.y], plan.from) && !same([plan.to2.x, plan.to2.y], plan.from2), 'two open tiles of his two columns to drag to, the top and the bottom of the line', JSON.stringify([plan.to, plan.to2]));
  if (plan.out) { await drag(plan.id, plan.out.x, plan.out.y); const s = await where(plan.id);
    leg(same(s, plan.from), 'dragged OUTSIDE his two columns, the man goes back where he was', plan.from.join(',') + ' -> ' + s.join(',')); }
  const mid = await drag(plan.id, plan.to.x, plan.to.y);
  const went = await where(plan.id);
  leg(!!mid && mid.id === plan.id, 'while the finger moves, the man is carried under it (FIGHT_UI.drag)');
  leg(same(went, [plan.to.x, plan.to.y]), '*** HE DRAGS A MAN TO A LIT TILE AND THE MAN STANDS THERE ***', plan.name + ' ' + plan.from.join(',') + ' -> ' + went.join(','));
  const say2 = await ev(() => document.getElementById('say').textContent);
  leg(/kept/i.test(say2), 'and the hint says it is kept', say2);
  if (plan.mate) {
    await drag(plan.id, plan.mate.at[0], plan.mate.at[1]);
    const a = await where(plan.id), b = await where(plan.mate.id);
    leg(same(a, plan.mate.at) && same(b, [plan.to.x, plan.to.y]), 'dragged onto a friend, the two trade places', a.join(',') + ' / ' + b.join(','));
    await drag(plan.id, plan.to.x, plan.to.y);   /* back to his tile for the legs below */
  }
  if (plan.id2) { await drag(plan.id2, plan.to2.x, plan.to2.y); leg(same(await where(plan.id2), [plan.to2.x, plan.to2.y]), 'a second man dragged to the bottom of the line stands there', plan.name2 + ' -> ' + plan.to2.x + ',' + plan.to2.y); }
  /* ---- 3. the memory, the next fight ---- */
  const mem = await ev(() => { try { return JSON.parse(localStorage.getItem(FIGHT.FORMATION_KEY)); } catch (_e) { return null; } });
  const row = mem && mem.placed.filter(q => q.name === plan.name)[0];
  const expect = await ev(q => { const z = FIGHT._t.zoneCols(), midR = Math.round((FIGHT.S.h - 1) / 2); return { line: z.indexOf(q[0]), off: q[1] - midR }; }, [plan.to.x, plan.to.y]);
  leg(!!row && row.line === expect.line && row.off === expect.off && mem.placed.length === (await ev(() => FIGHT.alive('you').length)),
    '*** THE LINE IS WRITTEN DOWN BY NAME THE MOMENT HE MOVES A MAN *** (localStorage bohemia.fight.formation.v1: name, line, row off the middle)', JSON.stringify(row) + ' of ' + (mem ? mem.placed.length : 0));
  await p.reload({ waitUntil: 'load' });
  await ev(o => { window.FIGHT_OPTS = o; }, { seed: SEED, speed: SPEED, kind: KIND, night: false });
  const l2 = await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board, 30000);
  if (l2 && !(await ev(() => FIGHT.S.board && !FIGHT.S.night && FIGHT.S.formationKept))) await restart({ seed: SEED, speed: SPEED, kind: KIND, night: false });   /* the arm's night options won the race: the day fight again */
  leg(await loaded(), 'the page reloaded, the same board dealt again by day');
  const r1 = await ev(q => ({ a: (FIGHT.S.units.filter(v => v.side === 'you' && v.name === q[0])[0] || {}), b: (FIGHT.S.units.filter(v => v.side === 'you' && v.name === q[1])[0] || {}), kept: FIGHT.S.formationKept, say: document.getElementById('say').textContent, board: FIGHT.S.board }), [plan.name, plan.name2]);
  leg(r1.a.x === plan.to.x && r1.a.y === plan.to.y && (!plan.id2 || (r1.b.x === plan.to2.x && r1.b.y === plan.to2.y)) && r1.kept, '*** THE NEXT FIGHT OPENS WITH THE MEN WHERE HE LEFT THEM ***', plan.name + ' at ' + r1.a.x + ',' + r1.a.y + '; ' + plan.name2 + ' at ' + r1.b.x + ',' + r1.b.y + ' on ' + r1.board);
  leg(/as you left it/i.test(r1.say), 'and the hint says the line is his, as he left it', r1.say);
  await p.waitForTimeout(400);
  const after = await p.screenshot(Object.assign({ path: proofShot(path.join(ROOT, 'slices/vote/COMBAT_FORMATION_KEPT_AFTER_10_16.jpg')) }, SHOT));
  /* ---- 4. by name: the company handed over in another order ---- */
  await ev(() => { FIGHT_UI.auto = false; const crew = DB.ours.crew.value; const co = [crew[0]].concat(crew.slice(1).reverse()).map(c => ({ name: c.name, background: c.background }));
    window.FIGHT_OPTS = { seed: 23, speed: 6, kind: 'suburb', company: co }; return start(); });
  leg(await loaded(), 'the company handed over in another order (the main man first, the rest reversed), another seed');
  /* on another seed his tile may be a house: then the nearest open tile of his columns is his (the rule), and the memory still held */
  const r2 = await ev(q => { const u = FIGHT.S.units.filter(v => v.side === 'you' && v.name === q[0])[0]; const open = FIGHT._t.passable(q[1], q[2]);
    return { at: u ? [u.x, u.y] : null, open, inZone: !!u && FIGHT.inZone(u.x, u.y), kept: FIGHT.S.formationKept, slot: u && u.slot }; }, [plan.name, plan.to.x, plan.to.y]);
  leg(!!r2.at && r2.kept && r2.slot === 'kept' && (r2.open ? same(r2.at, [plan.to.x, plan.to.y]) : r2.inZone), 'the memory is by NAME: the same man stands on his tile whatever his place in the roster (or the nearest open one of his columns when his is a house here)', plan.name + ' at ' + (r2.at ? r2.at.join(',') : 'missing') + (r2.open ? '' : ', his tile a house on this board'));
  /* ---- 5. AUTO holds it ---- */
  await ev(() => { window.FIGHT_OPTS = { seed: 22, speed: 6, kind: 'suburb', auto: true }; return start(); });
  await until(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && !FIGHT.S.deploy, 30000);
  const a0 = await ev(q => { const u = FIGHT.S.units.filter(v => v.side === 'you' && v.name === q)[0]; return { at: [u.x, u.y], deploy: FIGHT.S.deploy, acted: FIGHT.S.log.filter(e => e.t === 'step' || e.t === 'attack').length }; }, plan.name);
  leg(!a0.deploy && a0.acted === 0 && same(a0.at, [plan.to.x, plan.to.y]), '*** AUTO SKIPS THE SETTING AND STARTS ON THE KEPT LINE *** (nobody has moved yet)', plan.name + ' at ' + a0.at.join(',') + ', ' + a0.acted + ' acts');
  await until(() => FIGHT.S.round >= 4 || FIGHT.S.over, 90000);
  const held = await ev(q => { const S = FIGHT.S, u0 = FIGHT.alive('you')[0]; if (!u0) return null; const hunt = FIGHT._t.huntField(u0);
    const melee = FIGHT.alive('you').filter(u => !FIGHT.isRanged(u.weapon) && u.morale !== 'Fleeing'); const hs = melee.map(u => hunt(u.x, u.y)).filter(isFinite).sort((a, b) => a - b);
    const mid = hs.length ? hs[Math.floor(hs.length / 2)] : null; return { round: S.round, over: S.over, mid, ahead: hs.filter(h => h < mid - q).length, melee: hs.length, hs }; }, DEPTH);
  leg(!!held && held.ahead === 0, 'and the crew walks as a line: by round ' + (held && held.round) + ' no melee man is more than the line\'s depth (' + DEPTH + ') ahead of its middle', held ? ('distances to the fight ' + held.hs.join(' ') + ', middle ' + held.mid) : 'no crew');
  /* ---- 6. forgetting ---- */
  await restart({ seed: SEED, speed: SPEED, kind: KIND, formation: null });
  leg(await loaded(), 'a clean start again (formation null), AUTO off, the fight waiting for his line');
  const r3 = await ev(q => { const u = FIGHT.S.units.filter(v => v.side === 'you' && v.name === q)[0]; return { at: [u.x, u.y], kept: FIGHT.S.formationKept, inZone: FIGHT.inZone(u.x, u.y), acted: FIGHT.S.log.filter(e => e.t === 'step' || e.t === 'attack').length }; }, plan.name);
  leg(!r3.kept && r3.inZone && r3.acted === 0 && !same(r3.at, [plan.to.x, plan.to.y]), 'FIGHT_OPTS.formation null forgets the memory: the default line in his two columns, nothing read back', plan.name + ' at ' + r3.at.join(',') + ' (his kept tile was ' + plan.to.x + ',' + plan.to.y + ')');
  leg(d.errs.length === 0, 'no page errors through all of it', d.errs.slice(0, 3).join(' | '));
  /* the picture (rule 89): the default line and the kept line, the same board by day, side by side at 1:1 (the page is replaced
     for the composite, so this comes after every leg); it lands in the tracked folder only with --shoot (proofShot) */
  {
    const b64 = (b) => 'data:image/jpeg;base64,' + Buffer.from(b).toString('base64');
    await p.setContent('<body style="margin:0;background:#0d0b09"><div id="pair" style="display:flex;gap:12px;padding:8px;width:max-content">'
      + '<div><div style="font:700 13px ui-monospace,monospace;color:#f0d296;padding:4px 0">BEFORE: the default line, every fight</div><img src="' + b64(before) + '" style="display:block;width:390px"></div>'
      + '<div><div style="font:700 13px ui-monospace,monospace;color:#f0d296;padding:4px 0">AFTER: his line, kept into the next fight</div><img src="' + b64(after) + '" style="display:block;width:390px"></div></div></body>');
    await p.waitForTimeout(300);
    const el = await p.$('#pair');
    const pair = proofShot(path.join(ROOT, 'slices/vote/COMBAT_FORMATION_KEPT_10_16.jpg'));
    await el.screenshot(Object.assign({ path: pair }, SHOT));
    console.log('  shot ' + pair);
  }
  await d.close();
}
main().then(() => {
  console.log('=== THE FORMATION IS KEPT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
}).catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); console.log('=== THE FORMATION IS KEPT GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ==='); process.exit(1); });

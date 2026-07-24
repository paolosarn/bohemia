#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — COMBAT ANIM GATE (7/20/26, character session)
   Machine-locks COMBAT MOVES batch #13, built on Paolo's direct order:
     cover-rise / cover-drop  — the crouch <-> gun-ready transitions
     gun-walk                 — repositioning with the pistol up
     cover-fire               — peek-and-snap from the crouch (counter-snap)
     get-shoved               — hard stumble-back reaction to the shove
     floor-rise               — up off the deck after a topple
     shiv-jab / bat-arc / spear-drive — one swing per melee weapon
   Three layers, all locked:
     1. THE CLIPS EXIST and their MECHANICS hold (evaluated, not grepped):
        crouch depths, envelope timing, strike-vs-windup separation.
     2. THE BAKE ships every set into the combat sprite payload.
     3. THE COMBAT SLICE plays them at the right moments (decoded from
        COMBAT_B64): crouch lived in cover phase, rise on pop, drop on turn
        end, gun-walk on reposition, shove/prone/get-up/windup/strike/
        counter-snap on the enemy body — and prone OUTRANKS the hit stagger
        (a man on the deck never staggers standing).
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const alpha = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' -- ' + extra : '')); }
}

/* ---- 1. clips exist + mechanics ---- */
const CLIPS9 = ['cover-rise','cover-drop','gun-walk','cover-fire','get-shoved','floor-rise','shiv-jab','bat-arc','spear-drive'];
const srcs = {};
for (const c of CLIPS9) {
  const m = alpha.match(new RegExp("'" + c + "':\"((?:[^\"\\\\]|\\\\.)*)\""));
  srcs[c] = m ? m[1].replace(/\\"/g, '"') : null;
  ok('CANDIDATE_SRC carries ' + c, !!srcs[c]);
  ok('CAND_BEATS carries ' + c, new RegExp("'" + c + "':[24]").test(alpha));
}

/* stub the rig helpers: the clips only need consistent geometry to prove
   their envelopes. Angles mirror the alpha's FACEANG semantics. */
const FACEANG = {E:0,SE:Math.PI/4,S:Math.PI/2,SW:3*Math.PI/4,W:Math.PI,NW:-3*Math.PI/4,N:-Math.PI/2,NE:-Math.PI/4};
const _lat = d => Math.abs(Math.cos(FACEANG[d])) >= 0.25;
const fwdS = d => -Math.sign(Math.cos(FACEANG[d])) || 1;
const outR = d => 1, outL = d => 1;
const gR = d => _lat(d) ? fwdS(d) : outR(d);
const gL = d => _lat(d) ? fwdS(d) : outL(d);
const spF = d => _lat(d) ? Math.sign(Math.cos(FACEANG[d])) : 0;
const headOn = d => Math.abs(Math.cos(FACEANG[d])) < 0.25;
const RUNMIR = {W:1,SW:1,NW:1};
const ARMSIDE = {NE:-1,SE:-1,SW:-1,NW:-1};
const depthFlip = d => 1;
const SWF = () => 1;
const RF = 12, RR = 6;
const gunT = (d, rf, rr) => { const c=[28,20], a=FACEANG[d];
  return [[c[0]+Math.cos(a)*rf, c[1]+Math.sin(a)*rf], [c[0]+Math.cos(a)*rr, c[1]+Math.sin(a)*rr], a]; };
const gunTA = (d, rf, rr, aim) => { const c=[28,20];
  return [[c[0]+Math.cos(aim)*rf, c[1]+Math.sin(aim)*rf], [c[0]+Math.cos(aim)*rr, c[1]+Math.sin(aim)*rr], aim]; };
const nsGait = (d, ph, k) => { const s=Math.sin(ph*2*Math.PI);
  return {spine:0, legCompressL:0.28*Math.max(0,s)*k, legCompressR:0.28*Math.max(0,-s)*k,
    upL:0.1, upR:0.1, foreL:0.2, foreR:0.2, armCompressL:0.1, armCompressR:0.1, hipOff:[0,-0.3*Math.abs(s)*k]}; };
const POSE = {};
for (const c of CLIPS9) { if (srcs[c]) try { POSE[c] = eval('(' + srcs[c] + ')'); } catch (e) { POSE[c] = null; ok(c + ' evals', false, e.message); } }

const p = (c, d, ph) => POSE[c] ? POSE[c](d, ph) : {};
const hy = o => (o.hipOff || [0,0])[1];
const hx = o => (o.hipOff || [0,0])[0];

/* cover-rise: crouched at the top, gun-ready standing at the end */
ok('cover-rise starts in the crouch (E)', hy(p('cover-rise','E',0.02)) > 3.5 && p('cover-rise','E',0.02).legCompressL > 0.3);
ok('cover-rise ends standing with the gun up (E)', hy(p('cover-rise','E',0.95)) < 1 && !!p('cover-rise','E',0.95).ikR);
ok('cover-rise carries the pistol unit', !!p('cover-rise','E',0.9)._gun);
/* cover-drop: the mirror */
ok('cover-drop starts standing (E)', hy(p('cover-drop','E',0.02)) < 1);
ok('cover-drop ends in the crouch (E)', hy(p('cover-drop','E',0.95)) > 3.5 && p('cover-drop','E',0.95).legCompressL > 0.3);
/* gun-walk: the gun arm is IK-locked while the legs stride, on laterals AND head-on */
{ const e = p('gun-walk','E',0.25), s = p('gun-walk','S',0.25);
  ok('gun-walk (E): pistol up + legs striding', !!e.ikR && !!e._gun && Math.abs(e.thighR || 0) > 0.1);
  ok('gun-walk (S): pistol up + head-on gait', !!s.ikR && !!s._gun && ((s.legCompressL || 0) > 0 || (s.legCompressR || 0) > 0)); }
/* cover-fire: never leaves the crouch, the snap fires, ducks back */
ok('cover-fire stays low at rest (E)', hy(p('cover-fire','E',0.05)) > 3.5);
ok('cover-fire peeks but never stands (E)', hy(p('cover-fire','E',0.33)) > 1.5 && hy(p('cover-fire','E',0.33)) < hy(p('cover-fire','E',0.05)));
ok('cover-fire snaps the gun out', !!p('cover-fire','E',0.4).ikR && !!p('cover-fire','E',0.4)._gun);
ok('cover-fire fires inside the snap', !!p('cover-fire','E',0.46)._fire);
ok('cover-fire ducks back down (E)', hy(p('cover-fire','E',0.9)) > 3.5);
/* get-shoved: backward whip at impact, displaced back, recovered by the end */
{ const im = p('get-shoved','E',0.07), mid = p('get-shoved','E',0.3), end = p('get-shoved','E',0.97);
  ok('get-shoved whips the spine BACK at impact (E)', (im.spine || 0) * spF('E') < -0.15);
  ok('get-shoved flings the arms', Math.abs(im.upL || 0) > 0.4 && Math.abs(im.upR || 0) > 0.4);
  ok('get-shoved travels backward (E)', Math.abs(hx(mid)) > 2);
  ok('get-shoved recovers (E)', Math.abs(hx(end)) < 1.2); }
/* floor-rise: deck -> push -> crouch -> feet */
ok('floor-rise starts ON THE DECK (E)', hy(p('floor-rise','E',0.02)) >= 9);
ok('floor-rise plants the hands early (E)', !!p('floor-rise','E',0.1).ikR && !!p('floor-rise','E',0.1).ikL);
ok('floor-rise passes through the crouch (E)', hy(p('floor-rise','E',0.66)) > 2 && hy(p('floor-rise','E',0.66)) < 9);
ok('floor-rise ends on the feet (E)', hy(p('floor-rise','E',0.97)) < 1.5);
/* the three swings: windup and strike are DIFFERENT bodies, and the three
   weapons are DIFFERENT swings */
{ const dist = o => o.ikR ? Math.hypot(o.ikR[0]-28, o.ikR[1]-20) : 0;
  ok('shiv-jab: the jab extends past the windup', dist(p('shiv-jab','E',0.5)) - dist(p('shiv-jab','E',0.2)) > 4);
  const bw = p('bat-arc','E',0.2), bs = p('bat-arc','E',0.5), br = gR('E');
  ok('bat-arc: windup raises back, swing comes THROUGH', (bw.upR || 0) * br < -0.4 && (bs.upR || 0) * br > 1);
  ok('spear-drive: two-handed thrust extends', dist(p('spear-drive','E',0.5)) - dist(p('spear-drive','E',0.2)) > 6 && !!p('spear-drive','E',0.5).ikL);
  ok('the three swings are three different mechanisms',
    !p('bat-arc','E',0.5).ikR && !!p('shiv-jab','E',0.5).ikR && !!p('spear-drive','E',0.5).ikL && !p('shiv-jab','E',0.5).ikL); }

/* ---- 2. the bake ships every set ---- */
ok('bake: player crouch rides take-cover', /crouch=\[bake112\(d,'take-cover'/.test(alpha));
ok('bake: player rise/drop/gunwalk', /rise=\[0[^\]]*\]\.map\(p=>bake112\(d,'cover-rise'/.test(alpha) &&
  /drop=\[0[^\]]*\]\.map\(p=>bake112\(d,'cover-drop'/.test(alpha) && /gunwalk=\[0[^\]]*\]\.map\(p=>bake112\(d,'gun-walk'/.test(alpha));
ok('bake: enemy shoved/rise/prone/cfire', /shoved112=.*get-shoved/.test(alpha) && /rise112=.*floor-rise/.test(alpha) &&
  /prone112=bake112\(L\.d,'floor-rise',0\.02\)/.test(alpha) && /cfire112=.*cover-fire/.test(alpha));
ok('bake: one swing per blade at full extension', /swing112=\{shiv:sw\('shiv-jab'\),bat:sw\('bat-arc'\),spear:sw\('spear-drive'\)\}/.test(alpha) &&
  /\[0\.2,0\.5,0\.68\]\.map\(p=>bake112\(L\.d,clip,p\)\)/.test(alpha));

/* ---- 3. the combat slice plays them ---- */
const bm = alpha.match(/const COMBAT_B64='([^']+)'/);
ok('alpha carries COMBAT_B64', !!bm);
const demo = Buffer.from(bm[1], 'base64').toString('utf8');
ok('receiver maps the player sets', /crouch:\(d\.dirs\[dir\]\.crouch\|\|\[\]\)\.map\(mk\)/.test(demo) && /gunwalk:\(d\.dirs\[dir\]\.gunwalk\|\|\[\]\)\.map\(mk\)/.test(demo));
ok('receiver maps the enemy sets', /shoved112:L\.shoved112/.test(demo) && /prone112:L\.prone112/.test(demo) && /swing112:L\.swing112/.test(demo));
const ef = demo.slice(demo.indexOf('function enemyFrame'), demo.indexOf('function drawEnemySprite'));
ok('enemyFrame: shove reaction plays', /_shovedAt.*shoved112/.test(ef));
ok('enemyFrame: DOWN holds the deck', /e\.prone>0&&L\.prone112/.test(ef));
ok('enemyFrame: the get-up plays', /_roseAt.*rise112/.test(ef));
ok('enemyFrame: windup holds frame 0, strike swings through', /e\.windup&&L\.swing112\[e\.wpn\]/.test(ef.replace(/L\.swing112&&/g,'')) && /_swingAt/.test(ef));
ok('enemyFrame: counter-snap answers from the crouch', /_snapAt.*cfire112/.test(ef));
ok('enemyFrame: covered fire never stands (V26: gcov is the ONE cover truth, near-stone built in)',
  /firing\(e\)&&e\.gcov&&L\.cfire112/.test(ef));
ok('PRONE OUTRANKS THE STAGGER', ef.indexOf('e.prone>0&&L.prone112') < ef.indexOf('_hitAt') && ef.indexOf('_shovedAt') < ef.indexOf('_hitAt'));
ok('player lives the crouch in cover phase (V23: only with real stone near — Paolo 7/20, "crouching even though there\'s no cover")',
  /G\.phase==='cover'&&!G\.over&&playerNearCover\(\)&&fset\.crouch/.test(demo));
ok('player rises INTO the aim', /_riseAt.*fset\.rise/.test(demo));
ok('player drops back down', /_dropAt.*fset\.drop/.test(demo));
ok('player repositions at gunpoint', /fset\.gunwalk/.test(demo));
ok('doPop arms the rise', /function doPop\(\)[^]*?_riseAt=performance\.now\(\)/.test(demo.slice(0, demo.indexOf('function doPop') + 3000).slice(demo.indexOf('function doPop'))) || /doPop[^]{0,400}_riseAt=performance\.now/.test(demo));
ok('turn end arms the drop (return + clean)', (demo.match(/G\._dropAt=performance\.now\(\)/g) || []).length >= 2);
ok('the shove arms the stumble', /_shovedAt=performance\.now\(\)/.test(demo));
ok('the counter-snap arms the body', /_snapAt=performance\.now\(\)/.test(demo));
ok('prone expiry arms the get-up', /e\._roseAt=performance\.now\(\)/.test(demo));
ok('the strike arms the swing', /e\._swingAt=performance\.now\(\)/.test(demo));
ok('every blade knows its weapon (wpn bug fixed)', /wpn:\(a\.melee\?arch:null\)/.test(demo));

/* ---- 4. NE/NW ARM-UNIT DEPTH LAW (Paolo 7/20: "the hand and arm layering
   behind in front of the torso is fucked up" on NE). The fix is pipeline law
   in handOrder: on the away diagonals the arm and its hand move as ONE UNIT,
   judged by the hand's rest displacement ALONG THE FACING VECTOR (both
   axes), behind head+face+torso when thrown away, nearest when pulled to
   camera, authored baseline inside the deadband. ---- */
const ho = alpha.slice(alpha.indexOf('function handOrder'), alpha.indexOf('const REST_GRID'));
ok('ARM-UNIT: branch covers NE and NW', /d==='NE'\|\|d==='NW'/.test(ho));
ok('ARM-UNIT: signal is the along-facing dot, both axes', /\*_ux\+.*\*_uy/.test(ho));
ok('ARM-UNIT: deadband holds the authored baseline', /f>2\.5/.test(ho) && /f<-2\.5/.test(ho));
ok('ARM-UNIT: arm and hand move TOGETHER', /splice\(hi\+1,0,armP,handP\)/.test(ho) && /unshift\(armP,handP\)/.test(ho));
ok('ARM-UNIT: behind means behind head, face AND torso', /ord\.indexOf\(1\),ord\.indexOf\(2\),ord\.indexOf\(4\)/.test(ho));
ok('ARM-UNIT: subsumes the gun-unit rule on these facings (runs first)',
  ho.indexOf("d==='NE'||d==='NW'") < ho.indexOf('present._gun'));
ok('ARM-UNIT: baked layerOverride untouched (RIG LAW)', !/layerOverride\s*\[/.test(ho.slice(ho.indexOf("d==='NE'"), ho.indexOf('present._gun'))));

/* ---- 5. CROUCH-AIM (Paolo 7/20, animation-chat ask): same 9-angle sweep
   convention as deadeye, crouched. 1h braces the off-hand, 2h shoulders the
   rifle two-handed. Baked into the combat sprite payload the same shape as
   .aim; the actual trigger (when to show it over deadeye/cover-fire) is
   left for combat's live cover/dial state machine. ---- */
for (const c of ['crouch-aim-1h', 'crouch-aim-2h']) {
  ok('CANDIDATE_SRC carries ' + c, !!alpha.match(new RegExp("'" + c + "':\"((?:[^\"\\\\]|\\\\.)*)\"")));
  ok('CAND_BEATS carries ' + c, new RegExp("'" + c + "':4").test(alpha));
}
{
  const g1 = alpha.match(/'crouch-aim-1h':"((?:[^"\\]|\\.)*)"/)[1].replace(/\\"/g, '"');
  const g2 = alpha.match(/'crouch-aim-2h':"((?:[^"\\]|\\.)*)"/)[1].replace(/\\"/g, '"');
  let p1 = null, p2 = null;
  try { p1 = eval('(' + g1 + ')'); p2 = eval('(' + g2 + ')'); } catch (e) { ok('crouch-aim clips eval', false, e.message); }
  if (p1 && p2) {
    ok('crouch-aim-1h stays crouched (E)', p1('E', 0.3).legCompressL > 0.3 && p1('E', 0.3).legCompressR > 0.3);
    ok('crouch-aim-2h stays crouched (E)', p2('E', 0.3).legCompressL > 0.3 && p2('E', 0.3).legCompressR > 0.3);
    ok('crouch-aim-1h sweeps a ONE-HAND pistol (no ikL, off-hand braced)', !!p1('E', 0.3).ikR && !p1('E', 0.3).ikL && p1('E', 0.3)._gun[0] === 'pistol');
    ok('crouch-aim-2h sweeps a TWO-HAND rifle (both hands)', !!p2('E', 0.3).ikR && !!p2('E', 0.3).ikL && p2('E', 0.3)._gun[0] === 'rifle');
    ok('crouch-aim-1h off-hand actually braces (upL/foreL present)', p1('E', 0.3).upL !== undefined && p1('E', 0.3).foreL !== undefined);
    const swept1 = new Set([0.1, 0.3, 0.5, 0.7, 0.9].map(ph => p1('E', ph)._dial[1].toFixed(2)));
    const swept2 = new Set([0.1, 0.3, 0.5, 0.7, 0.9].map(ph => p2('E', ph)._dial[1].toFixed(2)));
    ok('crouch-aim-1h actually sweeps the aim angle across phase', swept1.size >= 4);
    ok('crouch-aim-2h actually sweeps the aim angle across phase', swept2.size >= 4);
  }
}
/* WIRING (owned by the combat session, V29): its own guarded _cclip picker
   ("1h preferred, 2h when the long gun ships") + live crouched-dial-fire
   consumer already existed on main before these clips landed, keyed off a
   single out.dirs[d].caim field -- proven here so nobody re-duplicates it
   as separate caim1h/caim2h fields the way the first pass briefly did. */
ok('bake: the V29 guarded picker prefers 1h, falls back to 2h', /_cclip=CLIPS\.indexOf\('crouch-aim-1h'\)>=0\?'crouch-aim-1h':\(CLIPS\.indexOf\('crouch-aim-2h'\)>=0\?'crouch-aim-2h':null\)/.test(alpha));
ok('bake: caim populates from the picked clip, same 9-angle shape as .aim', /if\(_cclip\)out\.dirs\[d\]\.caim=CSPRITE_OFFS\.map/.test(alpha));
ok('receiver: SPR.cv carries caim (V29, already shipped)', /caim:\(d\.dirs\[dir\]\.caim\|\|\[\]\)\.map/.test(demo));
ok('combat: crouched dial fire actually swaps in the nearest-offset caim frame when tucked near stone', /fset\.caim&&fset\.caim\.length/.test(demo) && /_dd=Math\.abs\(\(_a\.off\|\|0\)-\(G\.angle\|\|0\)\)/.test(demo));
ok('no duplicate caim1h/caim2h machinery left behind (the V29 hook is the one truth)', !/caim1h/.test(alpha) && !/caim2h/.test(alpha) && !/sprCrouchAimFrame/.test(demo));

/* ---- 6. CRAWL-DYING (ROUND 2B, Paolo 7/20 "the DOWNED ruling"): the V30
   crawl-toward-an-ally logic (e._crawlAt) already ran on main with no visual
   -- enemyFrame's downed branch fell back to a static prone hold. This clip
   is the visual: a downed man drags himself, one arm reaching-planting-
   pulling, legs trail straight out (floor-rise's own true prone numbers --
   legCompress near ZERO, NOT crouch-compressed; a first pass copied 0.34
   by mistake and Paolo caught it live, "does not look like crawl dying" --
   compressed legs bunch under the body and read as a kneel/float instead
   of flat-on-the-ground; verified visually via headless Playwright render,
   not just these numeric checks, per VERIFY ON THE REAL SURFACE). ---- */
ok('CANDIDATE_SRC carries crawl-dying', !!alpha.match(/'crawl-dying':"((?:[^"\\]|\\.)*)"/));
ok('CAND_BEATS carries crawl-dying', /'crawl-dying':4/.test(alpha));
{
  const cm = alpha.match(/'crawl-dying':"((?:[^"\\]|\\.)*)"/);
  let pc = null;
  if (cm) try { pc = eval('(' + cm[1].replace(/\\"/g, '"') + ')'); } catch (e) { ok('crawl-dying evals', false, e.message); }
  if (pc) {
    const dist = o => o.ikR ? Math.hypot(o.ikR[0] - 28, o.ikR[1] - 20) : 0;
    const samples = [0, 0.1, 0.18, 0.35, 0.5, 0.6, 0.75, 0.9, 1].map(ph => pc('E', ph));
    ok('crawl-dying stays flat on the deck all through the cycle (E)', samples.every(o => hy(o) >= 9));
    ok('crawl-dying stays flat on the deck all through the cycle (S, head-on)', [0, 0.35, 0.6, 0.9].every(ph => hy(pc('S', ph)) >= 9));
    ok('crawl-dying legs trail straight out (near-zero compress), never crouch-bunched under the body',
      samples.every(o => (o.legCompressL || 0) < 0.15 && (o.legCompressR || 0) < 0.15));
    ok('crawl-dying legs match floor-rise\'s real prone thigh/shin geometry (the reference that actually reads as flat)',
      Math.abs(Math.abs(samples[0].thighL) - 1.3) < 0.01 && Math.abs(Math.abs(samples[0].thighR) - 1.18) < 0.01 &&
      Math.abs(Math.abs(samples[0].shinL) - 0.5) < 0.01 && Math.abs(Math.abs(samples[0].shinR) - 0.42) < 0.01);
    const dists = samples.map(dist);
    ok('crawl-dying: the reaching arm actually sweeps (real reach-then-pull range)', Math.max(...dists) - Math.min(...dists) > 4);
    ok('crawl-dying: the off arm stays put (no independent second sweep)', new Set(samples.map(o => (o.upL || 0).toFixed(2))).size === 1);
    ok('crawl-dying: the body inches forward across the drag (hipOff.x creeps)', hx(pc('E', 0.9)) > hx(pc('E', 0.05)));
  }
}
ok('bake: enemy crawl112 rides crawl-dying (ROUND 2B)', /crawl112=\[0\.05,0\.35,0\.6,0\.9\]\.map\(p=>bake112\(L\.d,'crawl-dying',p\)\)/.test(alpha));
ok('receiver maps the enemy crawl112 set', /crawl112:L\.crawl112/.test(demo));
ok('enemyFrame: the crawl plays on the V30 crawl tick, inside the downed branch', /_crawlAt&&now-e\._crawlAt<640&&L\.crawl112/.test(ef));
ok('enemyFrame: crawl checked after the death-drop sequence, before the static prone fallback',
  ef.indexOf('fseq[Math.min(fseq.length-1,fi)]') < ef.indexOf('_crawlAt') && ef.indexOf('_crawlAt') < ef.indexOf('return L.prone112'));

console.log('\n=== COMBAT ANIM GATE: ' + pass + ' passed, ' + fail + ' FAILED ===');
process.exit(fail ? 1 : 0);

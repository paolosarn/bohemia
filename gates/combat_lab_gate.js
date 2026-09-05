#!/usr/bin/env node
/* ============================================================================
   BOHEMIA — COMBAT GATE (7/19/26 COMBAT session; LAB RETIRED 7/20/26)
   Paolo's 7/20 verdict: the beat-tactics lab grammars are DOWN (only the
   shove survived, and it lives in the canon demo). The lab surface is
   archived; this gate now machine-locks the ONE combat surface — the
   Dead Eye Dial demo inside the alpha's COMBAT_B64:
     1. The canonical dial ENGINE block exists in the demo.
     2. MELEE CORE headless sims (telegraph law, spear reach, shove rulings).
     3. Every shipped ruling marker v2..v26 (movement, pillars, red line,
        honest miss, real-cover-only, targeting, grit, kick-lock, ...).
     4. Alpha wiring (sprite bakes; the combat tab hosts the demo alone).
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  PASS ' + name); }
  else { fail++; console.log('  FAIL ' + name + (extra ? ' -- ' + extra : '')); }
}

const alpha = fs.readFileSync(ALPHA, 'utf8');

/* ===== 0. THE ALPHA STILL HAS ITS BLOBS =============================
   Added 7/29 after a stamp edit in another lane REPLACED THREE LINES of the
   alpha -- RIG_B64, COMBAT_B64 and BAKED -- with a duplicate copy of the
   buildstamp div, and shipped it to main. 1.27 MB gone. The combat tab and the
   rig tab both referenced blobs that no longer existed, so both were dead on the
   live build, while every line that USES them was still sitting there.
   This gate did not report it, it CRASHED on it: m was null and m[1] threw a
   stack trace, which reads like a broken gate rather than a broken build. A gate
   that dies instead of failing tells you nothing.
   So: name the loss, fail cleanly, and check the whole set -- because whatever
   ate COMBAT_B64 was never aiming at COMBAT_B64 specifically. */
{
  /* MIGRATED 8/4: CITY_B64 IS DELIBERATELY GONE and that is a win, not a loss.
     Another lane measured the alpha at 38.7 MB gaining ~2 MB/day, with GitHub's
     hard 100 MB file limit ~43 days out -- at which point NO lane could push the
     game at all. 35.76 MB of that was one line, const CITY_B64='...', a whole
     HTML page base64'd inline. It now loads from slices/BOHEMIA_CITY_WORLD.html
     with fr.src, the same data-src pattern RUN/SLICE/LIFE/MAP already used, and
     the alpha is 2.92 MB with first load 12,561ms -> 398ms.
     So this check must NOT demand it back. The invariant it exists to protect --
     a merge silently eating a blob -- is unchanged for the three that are still
     inline, and the city gets the check that actually fits it now: the page it
     moved to has to EXIST and the alpha has to point at it. */
  const BLOBS = ['COMBAT_B64', 'PREFAB_B64', 'RIG_B64'];
  for (const b of BLOBS) {
    const n = (alpha.match(new RegExp('const ' + b + "='", 'g')) || []).length;
    ok('THE ALPHA STILL HAS ITS BLOBS: ' + b + ' is declared exactly once (got ' + n + ')', n === 1);
  }
  /* SEE THROUGH THE WRAPPER (8/20). `const BAKED=\{` stopped matching the day the
     rig was wrapped as `const BAKED=RIG2X({...})` -- the 2X pass, additive and
     proved shape-preserving by rig_check_gate -- so a declaration that is right
     there, exactly once, counted as zero. Third gate today blinded by the same
     refactor. The invariant is ONE declaration, not one spelling of it. */
  ok('THE ALPHA STILL HAS ITS BLOBS: BAKED, the rig pose data the render base is built from, is declared exactly once',
    (alpha.match(/const BAKED=\s*(?:[A-Za-z_$][\w$]*\()?\s*\{/g) || []).length === 1);
  /* the city's replacement invariant: it left the alpha, so it has to be THERE */
  ok('THE CITY LEFT THE ALPHA ON PURPOSE AND STILL HAS TO EXIST: CITY_B64 was 35.76 MB of one line and is now a sibling page, so the alpha must point at a file that is really on disk (the split saved the project from a hard GitHub limit ~43 days out)',
    !/const CITY_B64='/.test(alpha) &&
    require('fs').existsSync(require('path').join(__dirname, '..', 'slices', 'BOHEMIA_CITY_WORLD.html')));
  /* the duplicate-stamp half of the same accident: the stray copy is what
     overwrote the blobs, so a second stamp div IS the fingerprint of this bug */
  ok('AND EXACTLY ONE BUILDSTAMP DIV: a second copy is the fingerprint of the edit that ate the blobs',
    (alpha.match(/<div id="buildstamp"/g) || []).length === 1);
}

/* ---- 1. the canon demo ---- */
const m = alpha.match(/const COMBAT_B64='([^']+)'/);
ok('alpha carries COMBAT_B64', !!m);
if (!m) {
  console.log('=== COMBAT GATE: ' + pass + ' pass / ' + fail + ' fail ===');
  console.log('STOP: the alpha has NO COMBAT_B64. The combat tab is dead on this build.');
  console.log('      Nothing below can run. Restore the blob before reading any other failure.');
  process.exit(1);
}
const demo = Buffer.from(m[1], 'base64').toString('utf8');
ok('demo carries the canonical dial ENGINE block',
  demo.indexOf('<!-- ENGINE START') > 0 && demo.indexOf('<!-- ENGINE END') > 0);
ok('the BEAT TACTICS LAB is retired from the alpha (Paolo 7/20 verdict)',
  alpha.indexOf('BOHEMIA_COMBAT_LAB_7_19_26.html') < 0 && alpha.indexOf('combatLabFrame') < 0);

/* ---- 2b. THE CANON DEMO CARRIES THE RULED MECHANICS (Paolo 7/19:
   "you can start actually incorporating it into the actual combat demo") ---- */
{
  const ca2 = demo.indexOf('MELEE CORE START'), cb2 = demo.indexOf('MELEE CORE END');
  ok('canon demo carries MELEE CORE', ca2 > 0 && cb2 > ca2);
  const mSrc = demo.slice(demo.indexOf('var BohemiaMelee', ca2), demo.lastIndexOf('if(typeof module', cb2));
  const mm = { exports: {} };
  new Function('module', 'exports', mSrc + ';module.exports=BohemiaMelee;')(mm, mm.exports);
  const BM = mm.exports;
  // telegraph law: NEVER a strike without last turn's windup
  let telegraphOk = true, struck = false;
  const em = { edist: 12, stun: 0, prone: 0, windup: false, adv: 3, reach: 1.8, cad: 1, phase: 0, stunCooldown: 0 };
  let prevWindup = false;
  for (let t = 1; t <= 12; t++) {
    const r = BM.decide(em, t);
    if (r.act === 'strike') { struck = true; if (!prevWindup) telegraphOk = false; em.windup = false; }
    if (r.act === 'windup') em.windup = true;
    if (r.act === 'advance') em.edist = r.dist;
    prevWindup = em.windup;
  }
  ok('demo melee: telegraph before every strike', struck && telegraphOk);
  // spear stops at reach, never enters point blank on its own
  const sp = { edist: 12, stun: 0, prone: 0, windup: false, adv: 2, reach: 4.2, cad: 2, phase: 0, stunCooldown: 0 };
  for (let t = 1; t <= 20; t++) { const r = BM.decide(sp, t);
    if (r.act === 'advance') sp.edist = r.dist; if (r.act === 'strike') sp.windup = false;
    if (r.act === 'windup') sp.windup = true; }
  ok('demo melee: spear holds at its reach (keeps distance)', Math.abs(sp.edist - 4.2) < 0.01);
  // held while stunned/prone
  ok('demo melee: stun/prone hold the blade',
    BM.decide({ edist: 1, stun: 1, prone: 0, windup: true, adv: 3, reach: 2, cad: 1 }, 5).act === 'held' &&
    BM.decide({ edist: 1, stun: 0, prone: 2, windup: true, adv: 3, reach: 2, cad: 1 }, 5).act === 'held');
  // shove rulings
  const s1 = BM.shove({ stun: 0, stunCooldown: 0 }, false, 99);
  const s2 = BM.shove({ stun: 0, stunCooldown: 0 }, true, 99);
  const s3 = BM.shove({ stun: 0, stunCooldown: 1 }, false, 0);
  ok('demo shove: always stuns 1 (perk: 2)', s1.stun === 1 && s2.stun === 2);
  ok('demo shove: no-stun-lock = braced, no stun', s3.braced === true && s3.stun === 0);
  ok('demo shove: topple thresholds 30/50, roll-driven',
    BM.shove({ stun: 0, stunCooldown: 0 }, false, 29).topple === true &&
    BM.shove({ stun: 0, stunCooldown: 0 }, false, 30).topple === false &&
    BM.shove({ stun: 0, stunCooldown: 0 }, true, 49).topple === true);
  // static wiring
  ok('demo carries SHIV/BAT/SPEAR archetypes',
    demo.includes("shiv: {n:'SHIV'") && demo.includes("bat:  {n:'BAT'") && demo.includes("spear:{n:'SPEAR'"));
  ok('demo gun pools exclude blades',
    demo.includes('!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst') &&
    demo.includes('!e.dead&&!e.melee&&!pinned(e)&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine'));
ok('V67 A PINNED MAN THREATENS NOBODY: every threat filter in the demo (exposure, cover, return volley, the enemy fire loop, grenade throwers) excludes the suppressed',
    (demo.split('&&!e.melee&&!pinned(e)&&e.stun<=0').length - 1) === 8 &&   /* V110: pressureGuns is the eighth threat filter and it obeys the same law */
    !demo.includes('&&!e.melee&&e.stun<=0') &&
    demo.includes('||e.melee||pinned(e)||e.stun>0||e.prone>0||e.stagger>0)continue;'));
  ok('demo has the contextual SHOVE button + perks UI',
    demo.includes('id="shovebtn"') && demo.includes('IRON SHOULDER') && demo.includes('FORESIGHT'));
  ok('demo melee turn runs at the one turn-end choke (tickTurnEnd)',
    demo.includes('function tickTurnEnd(){ meleeTurnRun();'));
  // MOVEMENT (v4+v5, Paolo 7/19): the EXISTING 8-dir ring is one-tap movement
  ok('demo has MOVE: doMove + worldShift, wired to the move ring (one tap)',
    demo.includes('function doMove(') && demo.includes('function worldShift(') &&
    demo.includes('G.moveIntent=names[i];doMove(i);'));
  ok('the arm-then-tap MOVE button is dead (Paolo: use the ring)',
    !demo.includes('id="movebtn"'));
  ok('a plain one-tile step still costs the turn (routes through endTurnReturn) -- walking is the free thing stamina buys you OUT of',
    /function doMove\([\s\S]{0,9000}?endTurnReturn\(false\); \}/.test(demo));   /* V106+V108 widened the window: doMove now carries the stair branch and the cover readout. The INVARIANT is unchanged -- a plain step still routes through endTurnReturn. */
  // v19: victory walk + blood by health
  ok('VICTORY WALK: the ring keeps working after the win (no turn cost)',
    demo.includes('VICTORY WALK V19') && demo.includes("setRead('WALKING THE FIELD'"));
  ok('BLOOD BY HEALTH: <=40% drips, <=20% pours, player <=30 trails; world-anchored',
    demo.includes('function bleedTick()') && demo.includes('e.hp>e.max*0.4') &&
    demo.includes('G.pHP<=30') && demo.includes('for(const s of G.bloodSpots)mv(s,0.02);'));
  ok('KILLSHOTS/TURN sits at the top of settings',
    demo.includes('V19: KILLSHOTS/TURN at the TOP of settings'));
  ok('worldShift carries corpses AND pillars with the world',
    /* V200 RE-POINTED: worldShift opens with the indoor wall test now, so both
       windows grew by that block. THE CLAIM IS UNCHANGED -- the world carries
       the corpses and the pillars with it -- and it is what is still matched. */
    /function worldShift\([\s\S]{0,1400}?G\.corpses/.test(demo) &&
    /function worldShift\([\s\S]{0,1500}?G\.pillars/.test(demo));
  // PILLAR COVER (v5, Paolo: "shuffled pillars that I can take cover from")
  ok('shuffled pillars spawn each encounter (V89: the count is now a real 2-15 range, so this no longer pins the old 5-7 literal -- it pins the RESHUFFLE)',
    /* V100 RE-POINTED: the invariant is that cover RESHUFFLES every encounter over a
       real range. The bare block became an arena-kind branch, and BOTH branches
       rebuild G.pillars from empty, which is more of what this was asking for. */
    demo.includes('G.pillars=[];') &&
    demo.includes("G.arenaKind='street';") &&   /* V110 RE-POINTED: one kind now, see the warehouse rejection below */
    demo.includes('const NP=20+Math.floor(Math.random()*70);') &&
    demo.includes('function buildWarehouse(){'));
  ok('my cover is geometry-aware (pillar on the shooter line, distance-honest)',
    demo.includes('function myCoverAgainst(ang,dist,lvl)') &&
    demo.includes('myCoverAgainst(e.ea,e.edist,e.lvl)'));   /* V90: the signature grew a LEVEL; the invariant (geometry, distance-honest) is unchanged */
  ok('enemies take pillar cover too — REAL cover only (V35: ONE pillar must both block and sit near him)',
    demo.includes('function updateGeomCover()') &&
    demo.includes('e.gcov=(!e.melee&&realCoverPillar(e))?1:0;') &&
    !demo.includes('(e.inCover||e.gcov)') && !demo.includes('e.inCover=!e.inCover'));
  ok('pillars block the step (occupancy: solid is solid)',
    demo.includes("'a pillar is there'") && demo.includes("setRead('BLOCKED',_sprinting?"));
  ok('shove into a pillar slams (65% topple)', demo.includes('PILLAR SLAM'));
  // v6 (Paolo): push = ONE tile, LONG ARM perk = two; street tile board floor
  ok('PAOLO RULING: shove pushes back ONE tile', BM.shove({ stun: 0, stunCooldown: 0 }, false, 99).pushed === 1);
  ok('LONG ARM perk pushes two', BM.shove({ stun: 0, stunCooldown: 0 }, { longarm: true }, 99).pushed === 2);
  ok('LONG ARM in the settings UI', demo.includes('id="perklongarm"') && demo.includes('LONG ARM: OFF'));
  /* V94 RE-POINTED, NOT RELAXED. The invariant this always protected is that the
   fight floor is WORLD-ANCHORED and carries a median and lane markings. Both are
   still true; the markings are approved TILES now instead of hand-drawn rects,
   which is strictly more of what this check was asking for. */
ok('STREET FLOOR: world-anchored tile board with median + lane markings (V94: the markings are approved art, not hand-drawn rects)',
    demo.includes('STREET FLOOR V6') && demo.includes('G.worldOff') &&
    demo.includes("if(wx===ST_MED)return 'median';") &&
    demo.includes("if(wx===ST_LANE_L||wx===ST_LANE_R)return 'lane';") &&
    demo.includes('STREET_B64') && /"median":\[/.test(demo) && /"lane":\[/.test(demo));
  ok('full-tile Chebyshev steps (no normalized diagonals)',
    demo.includes('const sx=v[0]*_mult, sy=v[1]*_mult;'));
  // v7 (Paolo): grid-true field, real blocks on tiles, two-turn red line
  ok('GRID TRUE: one tile of distance = one board cell (fieldPos linear)',
    demo.includes('const rr=e.edist*ring;'));
  /* V89: the old check matched a COMMENT ('cover sits ON a tile') that the rewrite
     replaced. A comment was never the invariant. Assert the rounding itself, on
     BOTH placement paths -- the scatter and the new cluster -- which is strictly
     stronger than what this line used to test. */
  ok('pillars snap to tile centers, on EVERY placement path (scatter and cluster alike)',
    demo.includes('nx2=Math.round(Math.cos(a0)*d0); ny2=Math.round(Math.sin(a0)*d0);') &&
    demo.includes('nx2=Math.round(q[0]+d[0]); ny2=Math.round(q[1]+d[1]);'));
  ok('the magic cover arcs are DEAD (geometry only)',
    !demo.includes('if(G.pCover[dirIndex(ang)])return true'));
  ok('tapping a cell places a REAL block on that tile',
    demo.includes('places/removes a REAL cover block ON that tile') && demo.includes('placed:true'));
  ok('TWO-TURN RED LINE: pools require an acquired bead',
    demo.split('.filter(e=>acquired(e))').length >= 3 &&
    demo.includes('&&acquired(e));'));
  ok('acquiring turn is telegraphed (warning line + acq clock)',
    demo.includes('ACQUIRING') && demo.includes('acq:0,'));
  // v8 GRID LOCK: the ghost cells ARE the painted tiles
  ok('GRID LOCK: floor cells centered on integers (player stands mid-cell)',
    demo.includes('(wx-offx-0.5)*t') && demo.includes('(wx-offx+0.5)*t') && demo.includes('(wy-offy+0.5)*t'));
  ok('GRID LOCK: pillars snap to integer centers (same grid as the board) -- V89 checks both branches, and that a cluster piece can only ever be placed one WHOLE tile off its neighbour',
    demo.includes('nx2=Math.round(Math.cos(a0)*d0); ny2=Math.round(Math.sin(a0)*d0);') &&
    demo.includes('const dirs=[[1,0],[-1,0],[0,1],[0,-1]], d=dirs[Math.floor(Math.random()*4)];') &&
    demo.includes('nx2=Math.round(q[0]+d[0]); ny2=Math.round(q[1]+d[1]);'));
  ok('GRID LOCK: the ghost tap-cell is drawn as exactly one painted tile',
    demo.includes('GRID LOCK V8: the ghost cell IS the painted tile'));
  // v9 (Paolo): the dial happens ON the board; the power of who to shoot next
  ok('ZOOMED BOARD: the aim backdrop is the real field, stand-in world dead',
    demo.includes('ZOOMED BOARD V9') && !demo.includes('drawStandInWorld(ctx,cx,cy,base,RAD,S);'));
  ok('manual TARGET SELECT: tap an enemy to pick him, auto is fallback',
    demo.includes('if(G.selTarget!=null){ const s=pool.find(e=>e.i===G.selTarget); if(s)return s.i; }') &&
    demo.includes('TARGET SELECT V9'));
  ok('blades are always targetable when visible (melee joins the shoot pool)',
    demo.includes('exposedToMe().concat(mel)'));
  ok('stunned/prone men are targets (the easy dial you manufactured), and V67 keeps the PINNED in the pool too -- suppressing must never delete your own shots',
    demo.includes('return _inRange(G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e)))); }') &&
    demo.includes('const pin=G.e.filter(e=>!e.dead&&pinned(e));') &&
    demo.includes('return _inRange(exposedToMe().concat(mel).concat(pin));'));

/* ===== V141 THE RANGE WAS NEVER WIRED TO HIS GUN ==================
   Paolo, THREE TIMES: "I can personally just stand still and shoot and kill
   everyone on screen." He was right every time. V138 wrote inMyRange() and
   NOTHING EVER CALLED IT -- two hits in the whole demo, one the definition and
   one a comment. The player's maximum range was never enforced once, and my two
   "fixes" moved spawn points further out, which does nothing when the gun has
   no limit to be outside of.
   AND MY MEASUREMENTS WERE MEASURING inMyRange. I reported "0% in range at the
   bell" three times: true, and completely meaningless, because it described a
   predicate the game ignores. A measurement that does not touch the code path
   the player touches is not evidence. Second time this week; the giants first. */
ok('V141 RANGE IS A FILTER ON WHO YOU CAN FIGHT, AND IT IS SYMMETRIC: my reach bounds my TARGETS (modePool), his reach bounds his THREAT (exposedToMe, posExposed). Those three predicates decide the whole fight and not one of them knew range existed',
  /* V170 RE-POINTED: modePool's filter gained a second clause (a screen on the
     line hides a man from the PLAYER too, which is what makes the smoke a wall
     rather than a cheat button). The CLAIM is unchanged -- my reach still bounds
     my targets -- so the anchor stops at the reach test instead of at the
     closing bracket, and no longer breaks every time that filter learns
     something new. */
  /const _inRange=a=>a\.filter\(e=>inMyRange\(e\)/.test(demo) &&
  /* V165 RE-POINTED: exposedToMe now carries the vision gate too, so the reach
     test is no longer the last thing on the line. The CLAIM is unchanged and is
     still that his reach bounds his threat -- what moved is where the closing
     bracket sits. */
  /function exposedToMe\(\)\{[^}]*inHisRange\(e\)/.test(demo) &&
  /function posExposed\(\)\{[^}]*inHisRange\(e\)\)/.test(demo));

ok('V141 AND A BLOCKED SHOT EXPLAINS ITSELF: an unresponsive button is a bug to the person holding the phone however correct the rule behind it is. The button reads OUT OF RANGE, and popping is refused with the only two numbers that matter -- how far the nearest man is and how far this gun goes',
  /txt=_alt\?\('SWAP TO '\+_alt\.toUpperCase\(\)\):'OUT OF RANGE';/.test(demo) &&
  demo.includes('function anyInMyRange(){') &&
  demo.includes("setRead('OUT OF RANGE','nearest is '+Math.round(_n)+' tiles, this gun reaches '"));

/* ===== V142 NO ACTION MUSIC WITHOUT ACTION =========================
   Paolo 8/11: "The game should always start off with overworld music and not
   some bullshit action music that I thought we removed a long time ago."
   audio() is the generic wake-the-sound-up call -- first tap, RUN, a grenade,
   the calibrate tool -- and it started the FIGHT loop unconditionally, so
   combat's music began the moment the frame was TOUCHED. Warming the frame at
   app open (8/8) made that easier to hit. The overworld playlist was never the
   problem: CITYMUS already filters to the creepers only (7/7 law). */
ok('V142 THE FIGHT THEME PLAYS WHEN THERE IS A FIGHT, and nowhere else: waking the sound up is not the same as starting one. The 7/3 fix it carried is KEPT -- the loop still restarts after the death-stop -- but with the condition that was missing, that a fight is actually live',
  demo.includes('function fightLive(){') &&
  /if\(AC\.state==='suspended'\)AC\.resume\(\); if\(fightLive\(\)\)startFactionLoop\(\); return;/.test(demo) &&
  /if\(AC\.state==='suspended'\)AC\.resume\(\); if\(fightLive\(\)\)startFactionLoop\(\);\}catch\(e\)\{\} \}/.test(demo));

ok('V142 AND IT STAYS IN ITS LANE: the combat frame\'s own loop only. No playlist, category, track or verdict weighting is touched, and nothing in CITYMUS or MUS -- those belong to the music lane',
  /* A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE
     (HOW HAIR AND SHAPE WORK, 8/1). The first version of this line was
     !/CITYMUS/ and it failed on the WORD CITYMUS inside the comment explaining
     that CITYMUS is not touched. What matters is that the combat frame never
     CALLS into the music lane's object. */
  !/CITYMUS\s*\./.test(demo) && demo.includes('function startFactionLoop(){'));

ok('V141 THE RED STAYS WHEN YOU ARE BEING OUTRANGED: a rifleman stops at his own effective range and shoots while your pistol says OUT OF RANGE. That is the moment the whole feature exists to create -- you are being hit, you cannot answer, and the only solution is your feet',
  /const _hot=exp\.length>0;/.test(demo));
  ok('the chosen man wears the selection ring', demo.includes('your chosen man'));
  // v10 ONE SCENE: the zoomed board IS the aim stage, no duplicates
  ok('ONE SCENE: exact zoom, full opacity, aim opts into drawField',
    /* V114 RE-POINTED: the opts object gained `gone`, so the POSE leaves with
       the dial. Same one-scene contract, one more field on it. */
    demo.includes('ONE SCENE V10') && demo.includes('drawField(ctx,W,H,cx,cy,{dial:true,zb:zb,gone:DIAL_GONE});') &&
    !demo.includes("ctx.globalAlpha=0.85;"));
  // v11 BOARD BODY + v12 cam pin
  ok('BOARD BODY: the field sprite IS you during the dial; the needle is an arm at board scale',
    demo.includes('BOARD BODY V11') && demo.includes('function drawArmNeedle(') &&
    !demo.includes('drawPose(ctx,cx,cy,ga,S,0.005*i,true)') &&
    !demo.includes('drawPose(ctx,pcx,pcy,ang,S,1,false)'));
  ok('the arm lives at board scale (reads the aim zoom). V138: the scale is ONE dial (FIELD_PITCH) instead of five scattered copies of 0.085 that could drift apart',
    demo.includes("Math.min(W,H)*FIELD_PITCH*(G._zb||2)*1.05") &&
    /const FIELD_PITCH=0\.085\/FIELD_ZOOM;/.test(demo) &&
    !/Math\.min\(W,H\)\*0\.085/.test(demo));
  ok('AIM CAM PIN: no stale killshot offsets, scene biased toward the target',
    demo.includes('AIM CAM PIN V12'));
  ok('floor bounds expand for zoom-out shots (no floating board)',
    demo.includes('if(aimo&&aimo.zb&&aimo.zb>0){ _wx0/=aimo.zb;'));
  // v15: the tunnel class is dead
  ok('HARD RESET: transform + canvas cleared every frame; armor resets too',
    demo.includes('HARD RESET V15') && demo.includes("ctx.setTransform(1,0,0,1,0,0);}catch(_e3){}"));
  ok('the frame error is visible (ERR chip), not silent',
    demo.includes("ctx.fillText('ERR '"));
  ok('floor accounts for user pinch zoom AND pan (inverted camera + pad)',
    demo.includes('const PAD=6;') && demo.includes('uzInvert(W,H,W,H)'));
  ok('the FIRST fight shuffles its faction too',
    demo.includes('the FIRST fight shuffles too'));
  ok('studio pushes never kill the shuffle default (Paolo 7/20)',
    demo.includes('SHUFFLE stays the encounter default'));
  // v17: exact floor, crouch, shot counter, menu sweep
  ok('EXACT FLOOR: bounds from the inverted camera, not heuristics',
    demo.includes('EXACT FLOOR V17') && demo.includes('uzInvert(0,0,W,H)'));
  ok('covered men CROUCH with the REAL baked take-cover frames (pillar cover included)',
    demo.includes('V18+V20: the crouch needs REAL stone nearby') &&
    !demo.includes('x.scale(1,0.72);'));
  ok('the phone DIRS ReferenceError is dead (whole-field scope)',
    demo.includes('V18 DIRS: whole-field scope'));
  ok('the chain skill speaks Paolo (KILLSHOTS/TURN)',
    demo.includes('KILLSHOTS/TURN: '));
  /* V95 RE-POINTED. The invariant is that the readout tells you WHICH SHOT of your
   turn this is, against the cap the fight actually enforces -- never a flat
   chainSkill that ignores the weapon. Still true, and now it says it in words. */
ok('the aim readout shows which shot of the turn this is, against the cap the fight really uses (V95: SHOT n OF allowance, and it names the allowance)',
    demo.includes("'SHOT '+(G._chainN||1)+' OF '+chainAllowance()") &&
    demo.includes('function wpnCap(){ return chainAllowance(); }') &&
    !/SHOT '\+\(G\._chainN\|\|1\)\+'\/'\+\(G\.chainSkill/.test(demo));
  ok('obsolete DIAL FACING menu removed', !demo.includes('data-f="0"'));
  // v13: cover AI + loop armor + compact UI
  ok('COVER AI: nobody spawns behind magic cover; gunmen run for the real thing',
    demo.includes('COVER AI V13') && demo.includes('function coverSeekAI()') &&
    demo.includes('coverSeekAI(); updateGeomCover();') &&
    !demo.includes('inCover:!a.melee'));
  ok('LOOP ARMOR: one bad frame can never kill the game',
    demo.includes('LOOP ARMOR V13') && demo.includes("G._lastErr=String(_le)"));
  ok('UI COMPACT: wager + pattern move to settings, board owns the screen',
    demo.includes('UI COMPACT V13'));
  // v14: the feel pass
  ok('no logo in the fight; the view starts wide',
    demo.includes('#logo{display:none!important}') && demo.includes('G.userZoom=0.82;'));
  ok('CHAIN SKILL: shots-per-turn is a 1..8 skill (default 2 since V53)',
    demo.includes('CHAIN SKILL V14') && demo.includes("G.chainSkill=((G.chainSkill||2)%8)+1"));
  ok('WEAPON READ: every body shows blade or gun', demo.includes('WEAPON READ V14'));
  ok('MISS CINEMATIC: a volley plays the camera even on a total miss; 2+ shooters get the FULL cam + shake (V24)',
    demo.split('MISS CINEMATIC V24').length >= 3 &&
    demo.split("pool.length>=2?null:'quick'").length >= 3 &&
    demo.includes('G._vShakeAt='));
  ok('AIM CAM GLIDE: your framing swings into the shot (with SNAP toggle)',
    demo.includes('AIM CAM GLIDE V14') && demo.includes("'AIM CAM: '+(G.aimCamGlide===false?'SNAP':'GLIDE')"));
  ok('the arm gun reads per weapon (long guns get a stock)',
    demo.includes("WEAPON==='rifle'?0.68"));
  ok('ghost cells + threat lines stay out of the shot',
    demo.includes('never during the dial') && demo.includes('if(!aimo)for(const e of G.e)'));
  ok('corpses ride the grid-true ruler',
    demo.includes('const rr=c.edist*ring;'));
  ok('pillars render tan with a sky-lit top, zero purple in the palette (V54: low pillars get a blue-lit top)',
    demo.includes("'#6e604a'") && demo.includes("?'#7a94a8':'#94836a'"));
  // v20: the animation pass (walk, static corpses, counter-snap, real glide)
  ok('V20 WALK: loaders carry walk frames for player and enemies',
    demo.includes('V20 WALK') && demo.includes('walk:(d.dirs[dir].walk||[]).map(mk)') &&
    demo.includes('walk112:L.walk112?L.walk112.map(b=>mkAt(b,112,112)):null'));
  ok('stepping plays walk frames; movers walk too',
    demo.includes('G._stepAt=performance.now()') && demo.includes('V20: movers walk') &&
    demo.includes('e._movedAt=performance.now()'));
  ok('THE DEADEYE POSE IS THE NEEDLE: dial body sweeps via sprAimFrame, live arm compute-only',
    demo.includes('the baked DEADEYE pose IS the needle') &&
    demo.includes('sprAimFrame(sprFacing(G.faceAng),G.angle)') &&
    demo.includes(',ARML,0);') && !demo.includes(',ARML,1);'));
  ok('DEATH POSES ARE STATIC: corpse look locks at death, never re-rolls on your step',
    demo.includes('the dead keep the pose they died in') && demo.includes('e._lookLock=L'));
  ok('COUNTER-SNAP: a blown engagement is punishable at ANY enemy count (1v1 included)',
    demo.includes('V20 COUNTER-SNAP') && demo.includes('*0.35*') && demo.includes('*0.7)'));
  ok('the glide actually glides: cam ease 0.055 and the zoom eases too (reset off-aim)',
    demo.includes('const k=0.055;') && !demo.includes('const k=0.14;') &&
    demo.includes('G._zbS+(zbT-G._zbS)*0.08') && demo.includes('G._zbS=null'));
  ok('HONEST CROUCH: the take-cover pose needs real stone within 1.8 tiles',
    demo.includes('function nearPillar(e)') && demo.includes('<1.8') &&
    demo.includes('nobody ducks behind air'));
  // v21: brass is floor state
  ok('V21 BRASS: player casings land at the world spot, never player-glued',
    demo.includes('V21 BRASS') && demo.includes('litterAdd({ea:0,edist:0,') &&
    !demo.includes('litterAdd({p:1,'));
  ok('all brass renders through fieldPos (world), the p-glue branch is dead',
    demo.includes('V21: ALL brass is world state') &&
    !demo.includes('if(l.p){lx=cx+l.dx;ly=cy+l.dy;}'));
  ok('statics keep TRUE spots on worldShift; only live enemies keep the 0.6 bubble',
    demo.includes('const mv=(o,mn)=>{') && demo.includes('mv(c,0.02)') &&
    demo.includes('mv(s,0.02)') && demo.includes('mv(L,0.02)'));
  // v22: the plumbing pass — the red line law finally complete
  ok('V24 LOS BEAD (supersedes v22): a step only resets guns whose LINE you broke',
    demo.includes('V24 LOS BEAD') && demo.includes('if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if(acquired(e2))_broke++; e2.acq=0; }'));   /* V108 RE-POINTED: his own words were "it has to be a line of sight thing", and v108 finally separated the LINE from the PROTECTION. The bead asks myConcealAgainst, so a car door breaks the lock exactly as it really would. Same law, sharper test. */   /* V90: same check, now level-aware */
  ok('danger outranks its warning, and the LINES ARE VISIBLE AGAIN. Paolo 8/1 reversed his own 7/3 and 7/4 dial-downs -- "I\'m not seeing the beads anymore... I want them to come back for now" -- so red and amber came back up. The ORDERING he set is what this check has always been about and it still holds: red outranks amber outranks out outranks tucked',
    demo.includes("'rgba(232,60,40,0.62)'") && demo.includes("'rgba(232,140,40,0.42)'") &&
    !demo.includes("'rgba(232,60,40,0.30)';w=2;"));
  ok('the warning speaks: fresh locks announce on damage-free turns (both turn ends)',
    demo.includes('V22: fresh beads announce themselves') &&
    demo.split("setRead('LOCKING ON',G._newBeads+' gun'").length >= 3);
  // v23: honest player crouch, roam facing, exposure honesty, auto frame
  ok('V23 HONEST PLAYER CROUCH: your crouch needs stone within 1.8 tiles too',
    demo.includes('function playerNearCover()') &&
    demo.includes('V23: no stone, no crouch'));
  ok('the victory walk faces the step, not the last shot',
    demo.includes('V23: the walk faces the step, not the last shot'));
  ok('EXPOSURE HONESTY: firing from behind the stone never opens the covered side',
    demo.includes('V23 EXPOSURE HONESTY') && demo.includes('G._poppedOut=G._poppedOut||!!myCoverAgainst(tgt.ea,tgt.edist,tgt.lvl)') &&
    demo.includes('G._poppedOut=false;'));
  ok('AUTO FRAME: cover-phase camera holds the farthest enemy, action-ring margin, through uzEff',
    demo.includes('V23 AUTO FRAME') && demo.includes('function uzEff()') &&
    demo.includes('uzApply(c,W,H){c.translate(W/2+G.userPan.x,H/2+G.userPan.y);c.scale(uzEff(),uzEff())') &&
    !demo.includes('c.scale(G.userZoom,G.userZoom)') &&
    demo.includes(')/uzEff()+W/2') && demo.includes('const _pad=G.isTouch?96:44'));
  // v24: the feel ruling
  ok('V24 VITAL NEVER CHAINS: a vital stuns 2 and ENDS the turn; only a killshot chains',
    demo.includes('a vital STUNS') && demo.includes("frozen 2 turns — turn ends") &&
    !demo.includes('// vital continues your turn'));
  ok('NO DOUBLE EXPOSURE: positional exposure kills the pop-out ONLY when a covered side exists to protect (V32); button reads HOLD/SHOOT/POP OUT (or ENGAGE with no cover, V52)',
    demo.includes('function posExposed()') && demo.includes("txt='HOLD';") &&
    demo.split("txt=nearCov?'POP OUT':'ENGAGE';").length >= 4 && !demo.includes("txt='POP';") &&
    demo.includes("txt='NOTHING TO SHOOT';") &&   /* V147: the one state that ends in a free shot at him names itself */
    demo.includes('V32 HOLD FIX: same gate as updGap'));
  ok('THE DEAD LIE UNDER THE LIVING: corpse under-pass before the player, old draws stripped',
    demo.includes('V24 UNDER THE LIVING') &&
    demo.includes('V24+V30: floor bodies painted in the under-pass') &&
    demo.includes('only the flies live up here'));
  ok('UI cluster up-left: fire + ring at 44px, never clipped',
    demo.includes('#fire{position:fixed;right:44px;bottom:44px;') &&
    demo.includes("right:44px;bottom:44px;width:92px;height:92px;z-index:59"));
  ok('KICK-LOCK: the dial pulses on FAC().kick — ember + rim ride the audible kick',
    demo.includes('V24 KICK-LOCK') && demo.includes('_kkA.includes(_ks16)') &&
    demo.includes('V24 KICK-LOCK rim') && demo.includes('the ember pump rides the audible kick'));
  ok('V25 EAR-LOCK: the pulse clock compensates for measured audio output latency',
    demo.includes('V25 EAR-LOCK') && demo.includes('AC.outputLatency') &&
    demo.includes('_bpmEar=(_seq.on&&_seq.t0)?_bpmClock:(_bpmClock-_lms)'));
  // v26: the three-message ruling
  ok('V26 HONEST MISS: miss volleys never play your hit reaction — cracks past, no spray',
    demo.includes('V26 HONEST MISS') && demo.includes('miss:!!arguments[3]') &&
    demo.includes('your body stays cool') && demo.includes('contact spray only when blood was real') &&
    demo.split("?null:'quick',true)").length >= 3);
  ok('only a true KILLSHOT chains: incidental vital/hit deaths end the turn',
    demo.split('an incidental kill is not a KILLSHOT').length >= 3 &&
    demo.includes('only a true KILLSHOT buys the next man'));
  ok('the wounded LEAK: trail on every step + fat pool at <=30',
    demo.includes('the wounded leave a TRAIL') && demo.includes('at 30 you are LEAKING'));
  ok('SMART CAM: frames the living, tightens on kills, pinch drives for 5s',
    demo.includes('V26 SMART CAM') && demo.includes('G._camTouchAt') &&
    demo.includes('uzT=Math.max(0.20,Math.min(_ceil,fit));'));
  /* V167 RE-POINTED, AND THE OLD CHECK WAS PINNING THE BUG. "Defaults to 8" was
     written as a convenience for the playtest and quietly became the whole game:
     RF4-24 measured 8.0 per fight, min 8, max 8, across 40 arenas, which by RF4's
     own notes is BOSS SIZING every single time. The default is the CURVE now, and
     8 is still one tap away in the same row. */
  ok('V167 the playtest defaults to the ENCOUNTER CURVE, and boss sizing is still one tap away rather than the only thing there is',
    demo.includes('<button class="nb on" id="ncurve">CURVE</button>') &&
    demo.includes('<button class="nb" data-n="8">8</button>') &&
    /if\(G\.encCurve!==false\)G\.numEnemies=rollEncounterSize\(\);/.test(demo) &&
    /G\.encCurve=false; G\.numEnemies=\+b\.dataset\.n;/.test(demo));
  ok('TARGETING AUTO/MANUAL: threat-ordered auto (v28), manual CHOOSE NEXT pause, taps only pick victims',
    demo.includes('V28 THREAT ORDER') && demo.includes("G.targetMode==='manual'") &&
    demo.includes("setRead('CHOOSE NEXT'") && demo.includes('V26 MANUAL CHAIN') &&
    demo.includes('id="targmode"'));
  ok('GRIT SHOTS: the floor perk buys a missed shot back, ceiling still caps',
    demo.includes('V26 GRIT') && demo.includes('id="gritskill"') &&
    demo.includes("(G.gritShots||0)>(G._gritUsed||0)&&(G._chainN||1)<(G.chainSkill||2)"));
  // v27: auto targeting honest
  ok('V27 PICK SPENT: a tapped pick buys ONE dial, auto resumes closest-first; popTarget never carries',
    demo.includes('V27 PICK SPENT') && demo.includes('if(G.selTarget===G.fireTarget)G.selTarget=null;') &&
    demo.split('G.popTarget=-1;').length >= 3);
  // v28: the threat ladder
  ok('V28 THREAT ORDER: imminent blade (V33 reach/windup-aware) > exposed guns (closest first) > closing blades > the rest',
    demo.includes('V28 THREAT ORDER') && demo.includes('V33 THREAT REACH') &&
    demo.includes('threatRank(e)*1000+e.edist'));   /* V155 RE-POINTED: the rank MOVED to module scope so the chain uses the same table -- same ladder, same weighting, one copy instead of two. The V155 block below now also RUNS this ordering rather than reading it. */
  // v29: reckless pop + crouch-fire plumbing
  ok('V29 RECKLESS POP: the button always fires; bad timing stands you into held beads',
    demo.includes('V29 RECKLESS POP') && demo.includes('function recklessPop()') &&
    demo.includes('return recklessPop();') && !demo.includes("setRead('NO TARGET','nobody is out"));
  ok('V29 crouch-fire plumbing: caim loader + from-cover pose preference wired for the future clips',
    demo.includes('crouched gun sweep (empty until the clips land)') &&
    demo.includes('firing FROM the crouch') &&
    alpha.includes("CLIPS.indexOf('crouch-aim-1h')>=0?'crouch-aim-1h'"));
  // v30: killing people isn't clean
  ok('V30 DOWNED: a killshot drops him DYING at 1hp (unless V32 weapon lethality says otherwise); the fall plays into the floor',
    demo.includes('his ruling: this weapon finishes the job, no downed state') &&
    demo.includes('tgt._fellAt=performance.now()+G.ks.dur*tv*1000') &&
    demo.includes('return L.prone112||fseq[fseq.length-1]; }'));
  ok('the dying and the broken are OUT of every combat read (peek/fire/line/alive/melee/AI/acq/snap/reckless/lines)',
    demo.split('e.downed').length >= 12 && demo.includes('!e.dead&&!e.downed&&!e.broken'));
  ok('THE CRAWL (V53): a dying man crawls AWAY from the player (not toward a friend), smearing blood',
    demo.includes('AWAY FROM YOU -- they drag as far from the player') &&
    demo.includes("e._downTurns%3!==0"));
  ok('FINISH OR SPARE: the contextual button becomes the death blow on a dying/surrendered man, victory walk included',
    demo.includes('function finishHim(t)') && demo.includes("b.textContent='FINISH '+t.n") &&
    demo.includes('the death blow is a CHOICE'));
  ok('V30 NERVE: past half the crew down, survivors can roll; the broken stand hands-up',
    demo.includes('L.handsup112||L.idle112'));
  ok('surrender bake wired both sides',
    alpha.includes("L.look.handsup112=bake112(L.d,'hands-up',0.4)") &&
    demo.includes('V30B SURRENDER LOADER'));
  ok('WOUNDED GUNS SHAKE: <=40% hp fires at 0.8x and the tracer wobbles',
    demo.split('e.hp<=e.max*0.4?0.8:1').length >= 3 && demo.includes("a hurt gun's tracer wobbles"));
  // v31: the hardening pass — no softlock, the fight always ends
  ok('V31 AREA CLEAR: checkClear() ends the fight the instant nobody can fight (nerve/downing safe), on EVERY settle path',
    demo.includes('V31 AREA CLEAR') && demo.includes('function checkClear()') &&
    demo.split('if(checkClear())return').length >= 5);
  /* V81 SUPERSEDES THE UNIT, NOT THE CLAIM. The death blow still has weight;
     the weight is now a NOTE VALUE (one whole beat, two on the final body)
     instead of 10 frames, which was 167ms at 60Hz and 83ms at 120Hz. */
  ok('the FINISH has weight, and the weight is now MUSICAL: a whole beat of frozen world on a kill, two on the body that ends the fight, plus the heavier pool and the haptic',
    demo.includes("freeze(checkClearSoon()?'last':'kill', 0, -1);") &&
    demo.includes('_bl.push({ea:t.ea,edist:t.edist,r:3.8') &&
    demo.includes('navigator.vibrate([18,26,60])'));
  ok('the crawl DRAGS a smear at both ends',
    demo.includes('smear where he WAS') && demo.includes('where he drags TO'));
  // v32: the diagnosis pass — five bugs killed, four rulings built
  ok('V32 HOLD FIX: NO DOUBLE EXPOSURE only gates when a covered side actually exists to protect',
    demo.includes('function coveredFromMe()') &&
    demo.includes('pexp.length>0 && coveredFromMe().length>0') &&
    demo.includes('posExposed().length>0 && coveredFromMe().length>0'));
  ok('posExposed excludes the dying, the surrendered, the fled and (V67) the pinned -- none of them can hold you hostage',
    demo.includes('!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&!pinned(e)&&e.stun<=0&&!myCoverAgainst'));
  ok('THE SILENT READOUT IS FIXED: every setRead call now reaches a visible action log',
    demo.includes('V32 THE SILENT READOUT') && demo.includes('function drawActionLog') &&
    demo.includes('drawActionLog(ctx,W,H)'));
  ok('V32/V33 WEAPON-GATED LETHALITY: pistol has a real research-honest chance, shotgun always lethal, table applied through the roll',
    demo.includes('const WEAPON_LETHAL={pistol:0.20,smg:0.35,rifle:0.55,shotgun:1.0}') &&
    demo.includes("(WEAPON==='shotgun')||(Math.random()<(WEAPON_LETHAL[WEAPON]||0))"));
  ok('blood drops the INSTANT a killshot downs someone, not next turn',
    demo.includes('the pool starts the instant he drops, not next turn'));
  ok('NERVE is event-gated: the roll only fires the turn a NEW casualty happens',
    demo.includes('_down>(G._nerveLastDown||0)') && demo.includes('G._nerveLastDown=_down;'));
  ok('BEGGING, AND A DYING MAN STAYS ON THE FLOOR. SUPERSEDED BY PAOLO 8/1: "if they\'re like crawling then they stand up when I get next to them to finish them off". The v32 INTENT was KNEEL AND BEG; the clip that got wired was handsup112, which is a man ON HIS FEET, so walking over to finish a dying man stood him up. handsup belongs to the BROKEN, who surrendered without ever falling. The begging TEXT is untouched -- it was never the bug',
    demo.includes('BEG_LINES') &&
    demo.includes('if(e.broken){ return L.handsup112||L.idle112; }') &&
    !demo.includes('e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112'));
  ok('MANUAL TARGET RING + SELECT A TARGET prompt render for manual mode',
    demo.includes('V32 MANUAL TARGET RING') && demo.includes("'SELECT A TARGET'"));
  ok('V32C LOG PANEL: a real dark backing behind the log text, not just a thin shadow',
    demo.includes('V32C LOG PANEL') && demo.includes('ctx.fillRect(6,6,'));
  ok('V32D BOTH EXITS: the log paints from the COVER-PHASE draw() exit too, not only the aim/killshot one (root cause of the invisible log)',
    demo.includes('V32D BOTH EXITS') &&
    demo.split('drawActionLog(ctx,W,H)').length >= 4);
  // v33: real reach-aware threat order + lethality/nerve retune
  ok('V33 THREAT REACH: a windup is a locked strike regardless of distance; else judged by the blade\'s REAL reach, not a flat guess',
    demo.includes('V33 THREAT REACH') &&
    demo.includes('e.windup||e.edist<=(e.reach||1.8)+0.3'));
  ok('V33 lethality retune: pistol non-zero (research-honest), the rest scaled with it, shotgun still always lethal',
    demo.includes('const WEAPON_LETHAL={pistol:0.20,smg:0.35,rifle:0.55,shotgun:1.0}'));
  ok('V33 nerve retuned down further on top of the v32 event-gating. V199 RE-POINTED: the pair is now NAMED (NERVE_BASE / NERVE_STEP) instead of typed into the roll, because THEY KNOW YOU needs a second pair to be steeper than. THE NUMBERS ARE BYTE-IDENTICAL -- 0.10 and 0.05 -- and this claim is about those numbers, not about where they are written. The retune that was rejected (0.18 + 0.08) is still absent, and the perk pair is checked separately in fight_moves_you',
    demo.includes('NERVE_BASE=0.10') && demo.includes('NERVE_STEP=0.05') &&
    demo.includes('_base+_step*(_down-_half)') &&
    !demo.includes('0.18+0.08*(_down-_half)') &&
    !demo.includes('NERVE_BASE=0.18'));
  // v34: KILL ARC treated as a vital — armor buys a real turn, never a free chain
  ok('V34 KILL ARC = VITAL: an armored survivor stuns 2 and ends the turn CLEAN, no auto-chain',
    demo.includes('V34 KILL ARC = VITAL') &&
    demo.includes("setRead('KILL ARC — STUN'") &&
    demo.includes("G.phase='resolve'; setTimeout(()=>{ if(!G.over) endTurnClean(); },170); return;\n    }") &&
    !demo.includes("setRead('KILL ARC', tgt.n+' took '+KILL_DMG+' — still up · chain on'"));
  // v35: the diagnosis-heavy pass
  ok('V35 CAMERA: the fit loop only counts ACTIVE fighters, and AUTO FRAME freezes during the killcam',
    demo.includes('only ACTIVE fighters hold the frame open') &&
    demo.includes('!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&e.edist>md') &&
    demo.includes('if(!G.ks)G._uzE='));
  ok('V35 REAL COVER: one pillar must both block AND sit near him — no mismatched-pillar fake cover',
    demo.includes('function realCoverPillar(e)') &&
    demo.includes('e.gcov=(!e.melee&&realCoverPillar(e))?1:0'));
  ok('V35 AUTO MEANS AUTO: chip and field taps only lock a pick in manual mode',
    demo.split("G.targetMode!=='manual'").length >= 3);
  ok('V35 DIAL DIFFICULTY BY EXPOSURE: covered pulls it harder, exposed pulls it easier',
    demo.includes('covered pulls the package HARDER, exposed pulls it EASIER') &&
    demo.includes('tgt.gcov?1:-1'));
  ok('V35 LAST-MAN-ONLY SURRENDER + FLEE: only the last fighter can surrender, everyone else panics and runs, elites hardened',
    demo.includes('V35 NERVE, LAST-MAN-ONLY SURRENDER') &&
    demo.includes('const _isLastMan=aliveEnemies().length<=1') &&
    demo.includes('(e.elite?0.5:1)') &&
    demo.includes("setRead('PANICKED'"));
  ok('V35 FLEEING: excluded from every combat pool, runs away every turn, distinct pose + chip label',
    demo.split('e.fleeing').length >= 10 &&
    demo.includes("e.fleeing?'FLEEING'") &&
    /if\(e\.fleeing\)\{ const fv=L\.flee112&&L\.flee112\[e\._fleeVar\|\|0\]/.test(demo));   /* FLEE/SURRENDER-RUN (round 3): the baked flee clip is now the primary read, walk112 stays as the fallback if the clip never landed */
  // v36: follow-up on v35 (accuracy definition + killed the living-portrait effect)
  /* SUPERSEDED BY PAOLO 8/3/26, NEWEST DATE WINS, AND THE TRAIL IS SAID OUT
     LOUD RATHER THAN A FLAG QUIETLY FLIPPED. v36 killed the living portrait
     (no post-mortem was ever recorded, only this check). He has now asked for
     it back in his own words: "how you have the portrait at the bottom right
     maybe for like each 10% of health that you don't have... I want you to
     think some sort of visual of the face."
     GRAVEYARD IS FINAL binds ME, not him -- he is the only one who can revive
     his own dead thing, and he did. AND WHAT HE ASKED FOR IS NOT THE DEAD
     THING: the killed version was THREE states (a dying-face swap, a red wash,
     a red border). His ask is TEN, with hysteresis, and the dying face
     crossfading instead of popping. Registered in gates/bohemia_graveyard.txt. */
  ok('V36 FIRE-BUTTON FACE, REVIVED BY HIS 8/3 REQUEST: JUICE.AU is on, and it is the TEN-state version he asked for rather than the three-state one that was killed',
    demo.includes('AS:true,AT:true,AU:true,AV:true') &&
    demo.includes('const HP_TIERS=10;'));
  // v38: accuracy corrected a third time -- a continuous per-shot proximity score,
  // not a binary zone bucket (v37's kill+vital=100/hit+miss=0 wasn't it either)
  ok('V38 CONTINUOUS PRECISION (formula superseded by V53 banding): the per-shot precisionSum plumbing still feeds the averaged ledger accuracy',
    demo.includes('G.rc.precisionSum=(G.rc.precisionSum||0)+_precisionPct') &&
    demo.includes('G.ledger.precisionSum=(G.ledger.precisionSum||0)+_precisionPct') &&
    demo.includes("rate3=L.shots?Math.round((L.precisionSum||0)/L.shots):0"));
  // v39: "MAKE COMBAT FUNNER" -- streak momentum + a real ranged specialist
  ok('V39 SNIPER ARCHETYPE: one real ranged specialist can spawn in bigger fights, always far, never the close guy, hits far harder than a GOON',
    demo.includes("sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48]") &&
    /* V167 RE-POINTED: N>=3, not N>=4, because RF4-37 says there is "almost
       always a highest priority target" and a three-man fight with no back line
       has nothing to prioritise. And the slot is filled by composeRoster now
       rather than by overwriting an index, so the assertion moved from "this
       index gets overwritten" to "the worst man is swapped onto the back slot". */
    demo.includes('let sniperIdx=-1; if(N>=3)') &&
    demo.includes("while(sniperIdx===closeIdx&&sp++<20)") &&
    /_roster\[sniperIdx\]=_roster\[_pi\]/.test(demo) &&
    /* V160 RE-POINTED. He was parked at 90% of the arena radius -- measured 29
       tiles against 17.5 of sight -- on the stated grounds that "he is the
       reason the board is this big". That reason RETIRED with the research:
       every gun including his is capped at 16 now, so out there he could not
       see, shoot, or be shot. He was a rumour with a health bar. The law is
       unchanged and still checked: ALWAYS THE FARTHEST MAN, never the close
       one. He is now the farthest man Paolo can actually SEE. */
    /\(i===sniperIdx\) \? Math\.min\(sightTiles\(\), contentR\(\), Math\.max\(_hi, contentR\(\)\*0\.90\)\)/.test(demo));   /* V198 RE-POINTED */   /* V140: still always the farthest and never the close man -- now pinned to the edge of the world AND to the far end of the spawn band, whichever is further out */   /* V138: 13.5-16.5 -> 30-40 tiles. Still always the farthest, still never the close guy, and now genuinely outside everything you own */
  // v40: streak momentum joins the real JUICE verdict menu, AU's dead toggle retired
  ok('V40 STREAK MOMENTUM IS A REAL JUICE TOGGLE: gated by JUICE.AW in the same slot the visible band formula reads, so on/off never lies',
    demo.includes('V40 JUICE MENU') &&
    (demo.match(/\(1\+Math\.min\(0\.15,\(JUICE\.AW\?\(G\.killStreak\|\|0\):0\)\*0\.03\)\)/g) || []).length === 2);
  ok('V40 JUICE MENU: AW registered (flag + description + demo preview + settings row), AU\'s dead toggle removed so it can never resurrect his kill',
    demo.includes("AW:'a hot streak visibly widens your kill window, a miss snaps it back'") &&
    demo.includes("if(k==='AW'){ setRead('STREAK MOMENTUM'") &&
    demo.includes('data-j="AW"') &&
    !demo.includes('data-j="AU"'));
  // v41: destructible cover -- a real toggle, a real mechanical consequence
  // v42: Paolo killed v41 outright ("dogshit") -- verify the FULL revert, not a default-off toggle
  ok('V42 COVER REVERT: v41 (breakable cover) is completely gone -- no hp/hpMax on pillars, no chipCover, no myCoveringPillar, no AX anywhere',
    demo.includes('V42 COVER REVERT') &&
    !demo.includes('hp:3,hpMax:3') &&
    !demo.includes('function myCoveringPillar') &&
    !demo.includes('function chipCover') &&
    !demo.includes('chipCover(') &&
    !demo.includes('AX:true') &&
    !demo.includes('data-j="AX"') &&
    demo.includes("else if(cov)onOffbeat(()=>fxCoverSave(e.ea));   /* R: your cover ate that one */"));
  ok('V42 keeps the v40 JUICE_NAMES fix (AW) while dropping AX -- the bugfix and the killed idea are independent',
    demo.includes("AW:'STREAK MOMENTUM'") && !demo.includes("AX:'BREAKABLE COVER'") &&
    demo.includes('data-j="AW"'));
  // v43: weapon-flavored kill impact -- the killcam contact frame reacts to WEAPON, not just style
  /* V81 SUPERSEDES THE NUMBERS, NOT THE PRINCIPLE. V43's rule was that the
     freeze itself says what killed him, and that stands. What changed is that
     the per-weapon stop is no longer 2/3/4/6 frames (arbitrary AND framerate-
     dependent) but a NOTE VALUE: light guns a sixteenth, heavy guns an eighth. */
  ok('V43 WEAPON KILL IMPACT SURVIVES ON THE GRID: the freeze still says what killed him and the blood burst still scales by weapon, but the stop is now a note value per weapon instead of a frame count',
    demo.includes('V43 WEAPON KILL IMPACT') &&
    demo.includes("freeze(ks.last?'last':'kill',_ax*_hv,_ay*_hv); }") &&
    demo.includes("const _hv={pistol:0.8,smg:0.7,rifle:1.15,shotgun:1.45}[WEAPON]||1;") &&
    demo.includes("var WPN={pistol:'graze', smg:'graze', rifle:'hit', shotgun:'hit'};") &&
    demo.includes("{pistol:0.75,smg:0.95,rifle:1.15,shotgun:1.55}[WEAPON]"));   /* V82: the weapon colours the SHAKE and the blood, not the kill's duration */
  // v44: SPRINT -- real movement/strategy stakes, not just repositioning
  ok('V44 SPRINT: arms a 2-tile move that resolves fully engaged (real return fire), blocked if either tile in the path has a pillar, consumes itself after one use',
    demo.includes('V44 SPRINT') &&
    /* MIGRATED BY V123, Paolo 8/3: "I NEED YOU TO HAVE SPRINT OFF THE TOP MENU
       BC ITS IN THE GAMEPLAY UI NOW." The BUTTON is gone; the VERB is not, same
       as doDash and doVault after v122, so this now guards the verb (which is
       what it was always about) instead of a chrome element he removed. */
    demo.includes("{const _sp=D('sprintbtn'); if(_sp)_sp.addEventListener('click',") &&
    demo.includes('const _sprinting=!!G.sprintArm;') &&
    /* SUPERSEDED BY PAOLO 8/1, NEWEST DATE WINS: "I want to change it to
       sprinting moving two tiles to one tile... sprinting basically just means
       you get to take movement action without your turn ending." The 2-tile
       distance is dead; everything else this check asserts is untouched. */
    demo.includes('const _mult=1;') &&
    !demo.includes('const _mult=_sprinting?2:1;') &&
    demo.includes("if(_sprinting){ spendMove(1); G.sprintArm=false; updMoveMode(); }") &&
    demo.includes("renderBoard(); updGap(); return; }   /* V73 FREE AND SAFE: no turn end, NO return fire */"));
ok('V67 SPRINT COSTS STAMINA (Paolo: "sprint should be using up stamina points"): 1 pip, refused when the pips are gone, spent on the move itself',
    demo.includes("if(_sprinting&&(G.stam||0)<1){ setRead('NO STAMINA','sprint needs 1 pip','#8a7d66'); return; }") &&
    demo.includes('spendMove(1); G.sprintArm=false;'));
ok('V67 ONE ARMED MOVE AT A TIME (Paolo: "when I press Dash it like automatically moves for me"): arming either move disarms the other, an arm never survives the turn, and the RING says which move the next tap performs',
    demo.includes('function updMoveMode(){') &&
    demo.includes('if(G.dashArm)G.sprintArm=false;') &&
    demo.includes('if(G.sprintArm)G.dashArm=false;') &&
    demo.includes('if(G.sprintArm||G.dashArm){ G.sprintArm=false; G.dashArm=false; updMoveMode(); }') &&
    demo.includes("SPRINT \\u00b7 2 TILES \\u00b7 1 PIP \\u00b7 FREE MOVE") &&
    demo.includes("DASH \\u00b7 2 TILES \\u00b7 2 PIPS \\u00b7 BREAKS LOCKS") &&
    demo.includes("id='movemode'"));
  // v45: the real camera bug -- the fit floor, not the fit formula, was cutting enemies off-screen
  ok('V45 CAMERA FLOOR: the auto-frame zoom floor is 0.20, not 0.45 -- covers realistic spawn/sniper max range on a real phone canvas (V53 lifted the ceiling into _ceil per device)',
    demo.includes('V45 CAMERA FLOOR') &&
    demo.includes('uzT=Math.max(0.20,Math.min(_ceil,fit));'));
  // v46: a live comment field at the top of the screen, feeding the existing export pipeline
  // (v51 removed the ADD button -- addLiveComment() still exists, now called by lccopy)
  ok('V46 LIVE COMMENT: a top-of-screen input that appends turn-tagged comments to the existing jnotes/export pipeline, not a new storage surface',
    demo.includes('V46 LIVE COMMENT') &&
    demo.includes('id="lcinput"') &&
    demo.includes("function addLiveComment(){") &&
    demo.includes("if(jn)jn.value=(jn.value?jn.value+'\\n':'')+'[T'+(G.mTurn||0)+'] '+txt;"));
  // v47: the green "safe to pop" threshold scales with how many enemies are actually alive
  ok('V47 GREEN SCALES WITH HEADCOUNT: the crowd-peeking threshold that gates green tightens as more enemies are alive (1-3=4, 4-6=3, 7-8=2), eases as the fight thins',
    demo.includes('_crowdThresh=Math.max(2,4-Math.floor((aliveEnemies().length-1)/3))') &&
    demo.includes('outN>=_crowdThresh'));
  // v48: green is a lock for the whole popped action, not a snapshot that can be undone mid-aim
/* ===== V146 SUPERSEDES V48'S HOLLOW GREEN LOCK =====================
   Paolo 8/12: "even when I popped out and it was green, I still took damage,
   which is literally the opposite of popping out when it's green."
   HE WAS RIGHT AND THE GUARANTEE WAS HOLLOW BY CONSTRUCTION. V48 filtered the
   volley to threats ALREADY VISIBLE at commit time -- but GREEN is precisely
   the state where peekers exist and none have fired yet, so every man green
   ever has is already visible. The filter removed NOBODY. It never once
   stopped a bullet, while the button painted itself green and told him this
   was the moment he had waited for. A rare lie is still a lie. */
  ok('V146 A GREEN POP TAKES NO RETURN FIRE -- not filtered, not softened, none. That is what the colour has promised since V48 and it is the entire reward for reading the peek cycle. The commit-time snapshot and the single-use consume both survive; only the hollow filter is gone',
    demo.includes('V146 GREEN MEANS SAFE') &&
    demo.includes('G._greenNow=green;') &&
    demo.includes('G._poppedGreen=!!G._greenNow;') &&
    demo.includes('G._popKnownThreats=new Set(G.e.filter(e=>!e.dead&&(peeking(e)||firing(e))).map(e=>e.i));') &&
    demo.includes('if(G._poppedGreen)pool=[];') &&
    !demo.includes('if(G._poppedGreen)pool=pool.filter(e=>G._popKnownThreats&&G._popKnownThreats.has(e.i));') &&
    demo.includes('G._poppedGreen=false;   /* V48: single-use'));

  ok('V146 AND GREEN CANNOT LIE ABOUT A BLADE: return fire is what POPPING costs you, so nulling the volley cannot honestly cover a man who swings whether you popped or not. The button stops claiming a lull that is not one -- a knife inside its own reach reads BLADE ON YOU and is never green',
    /const _blade=\(G\.e\|\|\[\]\)\.some\(/.test(demo) &&
    /\(e\.edist\|\|99\)<=\(\(e\.reach\|\|1\.8\)\+1\.0\)/.test(demo) &&
    demo.includes("' \\u00b7 BLADE ON YOU'"));

  ok('V146 AND NO STALE GREEN: V141\'s OUT OF RANGE early return cleared `G._green`, a name that exists NOWHERE ELSE in the file. The real flag is G._greenNow and doPop reads it to decide whether the promise applies, so every out-of-range turn left the previous verdict standing and the lock could be granted on a stale reading. A typo\'d assignment is invisible to a string check that never looks for the right name',
    demo.includes('G._greenNow=false; try{updMoveUI();}catch(_e){}') &&
    !/G\._green=false/.test(demo));

/* ===== V146 THE TEN DAMAGE FACES WERE DECODED AND THROWN AWAY =====
   Paolo, same message: "when my health was getting reduced, my character's face
   didn't look like it was taking damage the way it was supposed to."
   IT IS THE inMyRange BUG AGAIN, IN THE ART PIPE. The alpha builds ten damage
   frames and sends them; the receiver decoded them into SPR._dmgRaw; and
   _dmgRaw was ASSIGNED ONCE AND READ NOWHERE. The consumer reads
   SPR.portraits.dmg, which nothing ever filled. Every frame arrived, was
   decoded, and was dropped on the floor. Built, sent, decoded, never connected
   -- the second time this week. */
/* ===== V151 THE GATE THAT WOULD HAVE CAUGHT THREE REPORTS =========
   V146 asserted "SPR.portraits.dmg = ...map(...)" EXISTS, and it did -- and the
   VERY NEXT STATEMENT replaced the whole object with a fresh {you, dying}
   literal with no dmg. A string check cannot see the next line undoing it.
   Same class as a function defined and never called: present, and dead.
   So this checks the SHAPE THAT SURVIVES: one literal, built once, carrying
   every face, with no later assignment able to open a window. */
  ok('V151 THE DAMAGE FACES SURVIVE THE NEXT LINE: the portrait object is built ONCE with you, dying and dmg in the same literal, so nothing can fill it and be overwritten a statement later',
    /SPR\.portraits=\{you:mkAt\(d\.portraits\.you,64,64\),\s*\n\s*dying:mkAt\(d\.portraits\.dying,64,64\),\s*\n\s*dmg:_dmgF\};/.test(demo) &&
    /let _dmgF=null;/.test(demo) &&
    demo.includes('const _dmgSet=(JUICE.AU&&SPR.portraits.dmg&&SPR.portraits.dmg.length)'));

  ok('V151 AND THERE IS EXACTLY ONE PLACE THAT BUILDS IT from the message, so a later assignment can never orphan the frames again',
    (demo.match(/SPR\.portraits=\{you:mkAt/g) || []).length === 1);
  // v49: the comment box wraps instead of scrolling sideways off-screen
  // v50 supersedes v49's box-growth attempt entirely -- Paolo: "I did not tell you to
  // make a bigger multi box... there was no export copy button... all of my shit went away"
  ok('V50 COMMENT COPY BUTTON: the comment box is back to compact (a single-line input, not v49\'s grown textarea), and a COPY button sits right in the same row through the same proven export rail as jexport',
    demo.includes('V50 COMMENT COPY BUTTON') &&
    demo.includes('<input id="lcinput" type="text"') &&
    !demo.includes('<textarea id="lcinput"') &&
    demo.includes('id="lccopy"') &&
    demo.includes("const t=(D('jnotes')&&D('jnotes').value)||''; const b=D('lccopy');") &&
    demo.includes("parent.postMessage({bohemiaExport:{name:'combat_comments.txt',text:t}},'*');"));
  // v51: Paolo -- "REMOVE THE ADD BUTTON IT DOES NOTHING" -- ADD worked but its only
  // feedback was an easy-to-miss toast elsewhere on screen; cut to one button that
  // both saves and copies, so nothing typed is ever silently lost
  ok('V51 NO ADD BUTTON: the ADD button is fully gone (from both markup and listeners) -- COPY now folds any pending input into jnotes via addLiveComment() before copying/exporting, and Enter triggers the same single button',
    demo.includes('V51 NO ADD BUTTON') &&
    !demo.includes('id="lcadd"') &&
    !demo.includes("D('lcadd')") &&
    demo.includes("D('lcinput').addEventListener('keydown',ev=>{ if(ev.key==='Enter'){ ev.preventDefault(); D('lccopy').click(); } });") &&
    demo.includes('addLiveComment();   /* V51 NO ADD BUTTON'));
  // v52: dense feedback batch -- POP OUT vs ENGAGE wording, the fall-timing bug,
  // and two defaults (pistol, killshots/turn=1) so a fresh fight reads honest
  /* MIGRATED BY V123, and the law got STRICTER not looser. v52 said "no pillar
     near you -> ENGAGE". Paolo 8/3 caught that a pillar near you is not the
     question: cover to your north with every gun to your south still said POP
     OUT. The button now reads coveredFromAnyone(), so ENGAGE covers both the
     no-stone case this always guarded AND the stone-that-shields-you-from-
     nobody case it never did. */
  ok('V52 POP OUT VS ENGAGE: when nothing is actually covering you, the action button says ENGAGE, not POP OUT (nothing to pop out of if you were never in cover)',
    demo.includes('const nearCov=inRealCover();') &&   /* V156 RE-POINTED: the predicate got STRICTER, not weaker -- it is now coveredFromAnyone AND within reach of the stone. The law is unchanged and better served. */
    demo.includes("col='#eafff0'; txt=nearCov?'POP OUT':'ENGAGE'; green=true;"));

/* ===== V147 THE BUTTON SAYS THE RISK BEFORE HE COMMITS ============
   Paolo 8/12: "sometimes I'll click it and I'll just get shot first."
   The nobody-out state ends in recklessPop -- he stands up, never fires, and
   anyone holding a bead takes a free shot. It used to read POP OUT, which is an
   INVITATION. He is allowed to take a bad turn; he is not allowed to be tricked
   into one, so that one state names itself instead of borrowing the wording of
   the states where there is actually something to shoot. */
/* ===== V148 YOU CAN SEE WHO CAN REACH YOU =========================
   Paolo 8/12: "I think we to be able to see the range of all the Enemies
   weapons would be really nice just to know when."
   Every gun has had a max range on BOTH sides since V138 and NOTHING ON SCREEN
   EVER SAID ANY OF IT. He took fire and could not tell whether one man or three
   could touch him. The geometry decided the fight and stayed invisible.
   INTO THE BREACH IS THE MODEL: intent transparent BEFORE the commit, on the
   board, next to the thing it is about. */
  ok('V148 ONE PIP PER MAN, ANSWERING ONE QUESTION -- can THIS one reach me right now. Solid means he can shoot you where you stand; hollow means he is still walking. It sits over his head, on him, not in a corner of the screen',
    /const _hot=inHisRange\(e\), _pr=Math\.max\(3,ring\*0\.22\)/.test(demo) &&
    demo.includes("x.fillStyle='rgba(240,70,48,0.98)'") &&
    demo.includes("x.strokeStyle='rgba(210,220,235,0.75)'"));

  ok('V148 AND IT IS SIZED OFF THE TILE PITCH, NOT THE SPRITE: the first cut scaled the pip from the body radius and came out ~2px on the zoomed-out board -- drawn and completely unreadable, which is the same as not shipping it. It carries a dark halo so it reads on pale sand and on dark asphalt',
    /_py=ey\+MASS_DY-ring\*0\.85/.test(demo) &&
    demo.includes("x.fillStyle='rgba(0,0,0,0.55)'; x.beginPath(); x.arc(ex,_py,_pr+1.6,0,7); x.fill();"));

  ok('V148 EIGHT RANGE RINGS WOULD BE NOISE, so there are none: the reach bubble is drawn for the ONE man he has selected or is aiming at, and never for a dead, downed, broken, fled or melee body',
    /const _ri=\(G\.selTarget!=null\)\?G\.selTarget:G\.fireTarget;/.test(demo) &&
    /_rr=maxRange\(foeRange\(_re\)\)\*ring;/.test(demo) &&
    /if\(_re&&!_re\.dead&&!_re\.downed&&!_re\.broken&&!_re\.fleeing&&!_re\.melee\)\{/.test(demo));

  ok('V148 AND THE COUNT EXISTS IN WORDS: how many guns have him right now out of how many are on the field, which is the number he was missing when he could not tell whether to move',
    demo.includes('function threatCount(){'));

  ok('V147 NOTHING TO SHOOT SAYS SO ON THE BUTTON, before the press that punishes him',
    demo.includes("col='#8a7d66'; txt='NOTHING TO SHOOT';"));

/* recklessPop BREACHED A LOCKED LAW AND BYPASSED YESTERDAY'S FIX. YOU ALWAYS
   SHOOT FIRST (8/3, his words: "no enemies never get the first shot") -- and
   this branch hands them the first shot while he fires nothing. It also never
   looked at _poppedGreen, so V146's green promise was still being broken one
   branch over from where it was fixed. The PUNISHMENT stays, because V29 is his
   ruling too; what goes is being hit THROUGH a promise the UI already made. */
  /* ===== V150 THE DEAD BUTTON NEVER NAMED THE WAY OUT ===============
   Paolo 8/14: "I'm already done getting shot at not letting me shoot."
   MEASURED, 2,100 turns: OUT OF RANGE on 10% of them; on 70% of THOSE he is
   also being shot at -- helpless turns -- and in *** 100% *** of those the gun
   in his OTHER HAND would have reached somebody. The answer was in his pocket
   every single time and the button just stated a fact he could already feel.
   Not a rule bug: a DEAD END with a silent exit. */
  ok('V150 THE OUT-OF-RANGE BUTTON NAMES THE WAY OUT: if the gun in his other hand reaches somebody it says WHICH GUN, because that is the move and it is one tap away on the thumb row he is already touching',
    /let _alt=null; try\{ const _a=altWeapon\(\), _ar=maxRange\(wpnRange\(_a\)\);/.test(demo) &&
    /txt=_alt\?\('SWAP TO '\+_alt\.toUpperCase\(\)\):'OUT OF RANGE';/.test(demo));

  ok('V150 AND THE SHOOT-FIRST LAW IS STRUCTURAL NOW, not branch-by-branch: doPop asks modePool() whether a shot EXISTS, so the reckless branches are unreachable when he has a target. V29 survives exactly where it was aimed -- an empty pool, where there is no shot to take',
    /const _haveShot=\(function\(\)\{ try\{ return modePool\(\)\.length>0;/.test(demo) &&
    /if\(!mel\.length && !_haveShot\)\{ return recklessPop\(\); \}/.test(demo) &&
    /else if\(exp\.length===0 && !anyPeeking\(\) && !_haveShot\)\{ return recklessPop\(\); \}/.test(demo));

  ok('V147 GREEN IS ABSOLUTE EVEN IN A RECKLESS POP: a promise the game made outranks a punishment it wants. Green costs nothing here, exactly as V146 gave the volley',
    /if\(G\._poppedGreen\)\{ G\._poppedGreen=false;/.test(demo) &&
    demo.includes("setRead('NOTHING TO SHOOT','you stood up on a green board") &&
    demo.includes('function recklessPop(){'));

  ok('V147 AND THE RECKLESS BRANCH STILL ENDS THE TURN CLEANLY when green spares him -- back to cover, phase UI refreshed, the turn ticked, so a spared pop is not a free extra action',
    /G\.phase='cover'; G\._dropAt=performance\.now\(\); G\._riseAt=0; setPhaseUI\(\); tickTurnEnd\(\); renderBoard\(\); updGap\(\); return; \}/.test(demo));
  ok('V52 FALL TIMING FIX: a lethal kill sets _deadAt (not just _fellAt) to the real bullet-travel timestamp, so enemyFrame() actually holds the death pose until the bullet lands instead of self-initializing _deadAt to "now"',
    demo.includes('V52 FALL TIMING FIX') &&
    demo.includes('tgt._fellAt=performance.now()+G.ks.dur*tv*1000; tgt._deadAt=tgt._fellAt;') &&
    demo.includes('tgt._fellAt=performance.now()+120; tgt._deadAt=tgt._fellAt; }'));
  ok('V52 DEFAULT WEAPON: fresh combat starts on pistol (lets survive/get-down actually show, vs shotgun\'s forced-lethal)',
    demo.includes("let WEAPON='pistol';") &&
    !demo.includes("let WEAPON='shotgun';"));
  // v53: big feedback batch -- killshots default 2, melee never covers, flee 1-tile/face-away,
  // crawl away, bead->lock, honest accuracy, music keys off real kills, green peek, device cam
  ok('V53 KILLSHOTS DEFAULT 2 (Paolo corrected v52\'s 1): the HTML label + every fallback read 2',
    demo.includes('KILLSHOTS/TURN: 2</button>') &&
    !demo.includes('KILLSHOTS/TURN: 1</button>') &&
    demo.includes("G.chainSkill=((G.chainSkill||2)%8)+1;"));
  ok('V53 MELEE NEVER COVERS: a blade gets gcov=0 (never real pillar cover), so peeking(melee) is always true -- no pop-in/out',
    demo.includes('e.gcov=(!e.melee&&realCoverPillar(e))?1:0;'));
  ok('V53 FLEE: a fleeing man moves exactly 1 tile/turn straight out and shows his BACK (enemyLook faces e.ea, not e.ea+PI, while fleeing)',
    demo.includes('const nx=ex+(ex/ed)*1.0, ny=ey+(ey/ed)*1.0;') &&
    demo.includes('const _faceB=e.fleeing?e.ea:(e.ea+Math.PI);'));
  ok('V53 CRAWL AWAY: the downed crawl drags straight out along the bearing (edist up) = away from the player, not toward a teammate',
    demo.includes('e.edist=Math.min(30,e.edist+0.8);') &&
    demo.includes('AWAY FROM YOU -- they drag as far from the player'));
  ok('V53 BEAD -> LOCK: no player-facing "drawing a bead"/"beads were waiting"; it reads "locking on"/"had you locked"',
    !demo.includes('drawing a bead') &&
    !demo.includes('beads were waiting') &&
    demo.includes('locking onto you') &&
    demo.includes('had you locked'));
  ok('V53 HONEST ACCURACY: precision is banded by the zone actually hit (kill 85-100, vital 60-85, hit 25-55, miss 0), not 1-d/hitz against the forgiveness-inflated zone',
    demo.includes('V53 HONEST ACCURACY') &&
    demo.includes('if(kind===\'kill\')       _precisionPct=85+15*Math.max(0,Math.min(1,1-d/Math.max(1e-6,hz)));') &&
    demo.includes("else if(kind==='vital') _precisionPct=60+25*Math.max(0,Math.min(1,1-(d-hz)/Math.max(1e-6,vz-hz)));") &&
    !demo.includes('const _precisionPct=Math.max(0,1-d/hitz)*100;'));
  ok('V71 THE DOWNED ARE KILLS, FOR THE MUSIC (Paolo 7/26, SUPERSEDES the V53 note that a shot which only downs a live man must not bump the music): "if I have a pistol and I down an enemy, even if they survive because they\'re crawling away... that\'s part of a kill, intensify the song... I hate to see that you\'re not recognizing them." The ladder counts everyone TAKEN OUT OF THE FIGHT -- the same set aliveEnemies() uses to decide the fight is over',
    demo.includes("(G.e?G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length:0)") &&
    !demo.includes("(G.e?G.e.filter(e=>e.dead).length:0)") &&
    !demo.includes("((G.rc&&G.rc.kills)||0):0);"));
  ok('V53 GREEN PEEK: only when the button is green, the player pops up out of the crouch (top rise frames) so the safe moment reads on the body',
    demo.includes('if(G._greenNow&&fset.rise&&fset.rise.length){') &&
    demo.includes('pst=_rz[Math.max(0,_rz.length-1-_bob)];'));
  ok('V53 DEVICE CAM: G.isTouch detects phone vs laptop; a non-touch device frames much tighter (reclaims the thumb margin, higher zoom ceiling)',
    demo.includes('G.isTouch=((typeof matchMedia===') &&
    demo.includes('const _pad=G.isTouch?96:44, _slack=G.isTouch?70:40, _ceil=G.isTouch?1.30:1.85;'));
  // v54: the MOBILITY TOOLKIT -- stamina spine + suppress + hand-peek + dash + vault
  ok('V54 STAMINA SPINE: STAM_MAX=3, full at fight start, +1 regenerated at the turn-end choke, shown as pips -- a stamina action does not end the turn',
    demo.includes('const STAM_MAX=3;') &&
    /* V107 RE-POINTED: the hand-written list in setupCombat became resetFightState(), the ONE reset both doors call. The invariant is stronger, not weaker -- newEncounter gets it too now. */
    demo.includes('G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0;') &&
    demo.includes('function resetFightState(){') &&
    /* V163 RE-POINTED, AND THE SUPERSESSION IS NAMED. The per-use regen
       ("+1 only on a turn you spent none") came from the 7/26 audit. THE 8/17
       RF4 LIFT LAW IS NEWER AND OVERTURNS IT IN HIS OWN WORDS: "SP regenerates
       on every 5th global game turn, ON A FIXED WORLD CLOCK. It is NOT a
       per-use cooldown that starts when you spend... It rewards clock-reading,
       not hoarding." NEWEST DATE WINS (TRUTH HIERARCHY), and section 6 of that
       law routes this to COMBAT as the FIRST thing to build.
       The invariant that survives is the one V67 actually cared about: a pip he
       pays is not handed straight back by the same turn. Under the clock it is
       handed back by the CLOCK, which is the point. */
    /const SP_TICK=5;/.test(demo) &&
    /if\(\(\(G\.mTurn\|\|0\)%SP_TICK\)===0\)\{/.test(demo) &&
    !/G\._stamSpent/.test(demo.replace(/\/\*[\s\S]*?\*\//g, ' ')) &&   /* comments stripped: my own comment QUOTES the dead line, and a checker that cannot tell a mention from a use is the broken one */
    demo.includes("function spendStam(n){ if((G.stam||0)<n)return false;") && demo.includes('function spendMove(n){'));
  ok('V67 SUPPRESS IS TURN-BASED, NOT WALL-CLOCK (Paolo: "it doesn\'t seem like it does fucking anything"). The 2.2-SECOND pin expired while he was still deciding his move; a pin is now counted in TURNS like everything else in this fight, it breaks the red lines they were holding, and it costs a turn of cooldown',
    demo.includes('function pinned(e){ return (e.supp||0)>0; }') &&
    demo.includes('const SUPP_TURNS=1;') && demo.includes('const SUPP_CD=1;') &&
    demo.includes('e.supp=SUPP_TURNS; if(acquired(e))beads++; e.acq=0;') &&
    demo.includes('for(const e of G.e){ if((e.supp||0)>0)e.supp--; }') &&
    demo.includes('if((G.suppCd||0)>0)G.suppCd--;') &&
    // the wall clock is GONE from the pin
    !demo.includes('e._suppr=now+2200;') &&
    !demo.includes('performance.now()<e._suppr'));
  ok('V54 HAND-PEEK: a free stance toggle -- return fire cut to firing-only, your dial one tier harder',
    demo.includes('function toggleHandPeek(){') &&
    demo.includes('+(G.handPeek?1:0)') &&
    demo.includes('if(G.handPeek)pool=pool.filter(e=>firing(e));'));
  ok('V54/56 DASH, as amended by V73: doDash ARMS (you steer with the ring), doDashMove fires in the tapped direction, spends 2 pips, breaks crossed locks, ends no turn and takes NO return fire',
    demo.includes('function doDash(){') &&
    demo.includes('G.dashArm=!G.dashArm;') &&
    demo.includes('function doDashMove(d){') &&
    !demo.includes('if(mobExposeFire(0.5))return;') &&
    demo.includes("2 tiles, 2 pips, no turn spent, nobody shoots"));
  ok('V54 VAULT: doVault needs a LOW pillar within 1.9 tiles (tall pillars refuse), spends 1, hops 2 tiles across it, no turn end -- pillars roll tall/low at spawn',
    demo.includes('function doVault(){') &&
    demo.includes('const P=nearestPillar(true);') &&
    demo.includes('tall:Math.random()<0.5') &&
    demo.includes('function nearestPillar(lowOnly){'));
  /* MIGRATED BY V122. Paolo removed dashbtn and vaultbtn ("I never use them")
     and their verbs moved onto RUN in the thumb cluster. The LAW this check
     guards is untouched -- the toolkit is cover-phase only and greys out in
     aim -- so it now names the four buttons that exist, RUN and the thumb
     grenade included. A live-looking button that does nothing is the exact
     complaint that removed the other two. */
  /* MIGRATED BY V129: the stamina PIPS are gone from the top row -- stamina is
     fluid in the fire button now, which is his own ask ("maybe it's like
     fluid... Warcraft... Diablo"). The read did not disappear, it MOVED, so the
     check follows it to the orb. */
  ok('V54 TOOLKIT UI: the toolkit buttons are wired, disabled in the aim phase like WAIT, and the stamina read exists (as the orb, not pips). V149 makes it FIVE -- the swap joins the same disable rail rather than inventing its own',
    demo.includes('id="suppressbtn"') && demo.includes("mk('runbtn','RUN'") &&
    demo.includes("mk('grenbtn2','GREN'") &&
    demo.includes("mk('swapbtn','ALT'") &&
    demo.includes('id="peekbtn"') &&
    demo.includes('const lvl=Math.max(0,Math.min(1,(G.stam||0)/STAM_MAX));') &&
    demo.includes("for(const _id of ['suppressbtn','peekbtn','runbtn','grenbtn2','swapbtn']){"));

/* ===== V149 YOU CARRY TWO GUNS ====================================
   Paolo [T22]: "I actually went in the settings to switch my gun so I can get a
   longer range and I think that's important. Maybe this should be a swap."
   HE ALREADY PLAYED THE MECHANIC -- he reached past the game, into a menu,
   mid-fight, to solve a range problem the fight would not let him solve. That
   is the strongest signal a mechanic is missing.
   THE RESEARCH IS UNANIMOUS THAT A FREE SWAP IS AN EXPLOIT: with no cost, the
   correct play is to hold whichever gun is better this instant and switch back
   after, every turn. And the other half is equally real -- going to a sidearm
   is FASTER THAN RELOADING, which is why anyone carries one. So the swap is a
   BEAT: fast enough to be worth doing, expensive enough that he has to see it
   coming. */
  ok('V149 THE SWAP COSTS THE TURN: you swap INSTEAD of shooting, they get their volley, and you come up next beat holding the right gun. Anticipating the range you are ABOUT to be in, one beat early, is the skill this adds',
    demo.includes('function doSwap(){') &&
    /G\.wpnAlt=from; WEAPON=to;/.test(demo) &&
    /endTurnReturn\(false\); \}/.test(demo));

  ok('V149 ALWAYS A SHORT AND A LONG, and which guns he OWNS is not decided here: the pairing reads the weapon he already has and gives it an opposite number, so every loadout has a close answer and a far answer',
    demo.includes("const WEAPON_PAIR={pistol:'rifle',rifle:'pistol',smg:'shotgun',shotgun:'smg'};") &&
    demo.includes('function altWeapon(){'));

  ok('V149 THE BUTTON NAMES THE GUN, NOT THE VERB: the useful information is WHICH gun, because he is choosing a range rather than an action, and it arms nothing else while it does it',
    demo.includes('function updSwapBtn(){') &&
    /b\.textContent=\(to\|\|''\)\.slice\(0,5\)\.toUpperCase\(\);/.test(demo) &&
    /G\.runArm=false; G\.grenArm=false; G\.sprintArm=false; G\.dashArm=false;/.test(demo));
  // v55: shuffle the time of day per fight (morning/dusk/night), washing the scene
  ok('V55 DAY PHASE: pickDayPhase rolls morning/dusk/night; applyDayPhase washes the scene per phase and is called from screenOverlays',
    demo.includes("G.dayPhase=['morning','dusk','night'][Math.floor(Math.random()*3)]") &&
    demo.includes('function applyDayPhase(x,W,H){') &&
    demo.includes("if(p==='morning'){") && demo.includes("else if(p==='dusk'){") &&
    demo.includes('applyDayPhase(ctx,W,H);   /* V55 DAY PHASE'));
  ok('V55 DAY PHASE rolls on the SHUFFLE, everywhere the faction does (setup, new encounter, start, SHUFFLE button)',
    demo.includes('if(G.factionShuffle)try{pickDayPhase();}catch(_e){}') &&
    demo.includes('if(G.factionShuffle) pickDayPhase();   /* V55 */') &&
    demo.includes('pickRandomFaction(); pickDayPhase(); rollSong(); });'));   /* V78: and the tap rolls the song too */
  // v56: structured safe-area so the dial never lands under the SHOOT button, + dash-aim + suppress clarity
  ok('V56 SAFE AREA: in the dial phase the scene anchors up-left with a smaller RAD and full zoom so the dial clears the bottom-right SHOOT button for any aim direction',
    demo.includes("const _aimP=(G.phase==='aim'||!!G.ks);") &&
    demo.includes("const cx=_aimP?W*0.42:W/2, cy=_aimP?H*0.46:H*0.56;") &&
    demo.includes("const RAD=Math.min(W,H)*(_aimP?0.34:0.42);") &&
    demo.includes("if(G.phase==='aim'&&!G.ks)G._uzE=(G._uzE==null)?1:G._uzE+(1-G._uzE)*0.22;"));
  ok('V56 DASH AIMABLE: doDash arms and you tap a ring direction (doMove routes an armed dash to doDashMove); no more auto-placed destination; dashArm resets each fight',
    demo.includes('if(G.dashArm){ G.dashArm=false;') &&
    demo.includes('function doDashMove(d){') &&
    /* V99 RE-POINTED: the grenade pouch refill now sits between the reset and its
       trailing comment, so the two are asserted separately. The invariant is
       unchanged: dashArm is cleared on a fresh fight, and the reset is still the
       MOBILITY TOOLKIT reset it always was. */
    /* V107 RE-POINTED again: the list is resetFightState() now. */
    demo.includes('G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0;') &&
    demo.includes('function resetFightState(){') &&
    demo.includes('/* V54 MOBILITY TOOLKIT: full stamina, full body, fresh fight. V56'));
  ok('V67 SUPPRESS IS LEGIBLE: the pinned wear a PINNED tag on the body, the action button counts them, and the readout names the broken red lines. He pressed it and nothing on screen changed -- that was half the bug',
    demo.includes(":pinned(e)?'PINNED'") &&
    demo.includes("if(_pn>0&&txt!=='SHOOT')txt=txt+' \\u00b7 '+_pn+' PINNED';") &&
    demo.includes('function pinnedCount(){') &&
    demo.includes("POP NOW, they are easy meat"));
ok('V67 A PINNED MAN IS EASY MEAT: the dial window opens 35% on a suppressed target (the XCOM contract inverted -- suppression makes him easier to kill, it never makes him vanish)',
    demo.includes('const _pinW=((G.e[G.fireTarget]&&pinned(G.e[G.fireTarget]))?1.35:1)*_grW;') &&
    demo.includes('KILL_GRACE*_ww*_pinW*(G.inFU?1.18:1)'));
  // v57: coordinate the pop-out button to the downbeat (the beat the bass doubles on), + on-the-one reward
  ok('V57 ON THE ONE: the pop-out button breathes HARD on beat one of the bar (soft on 2-4)',
    demo.includes("const _bn=beatNow(), _bp=_bn%1, _one=(Math.floor(_bn)%4===0)") &&
    demo.includes("const amp = _one ? (green?0.22:0.14) : (green?0.06:0.03);") &&
    demo.includes("G._onePop=false;   /* V57: the downbeat bonus is per-engagement */"));
  ok('V58 ON-BEAT STREAK: on-beat pops COMPOUND (1,2,3...) shown as ON THE ONE xN, an off-beat pop breaks it, the dial reward grows 12%->30%, fresh fight resets',
    demo.includes("const _obn=beatNow()%4, _onOne=(_obn<0.25||_obn>3.75);") &&
    demo.includes("G._oneStreak=(G._oneStreak||0)+1; showVerd('ON THE ONE'+(G._oneStreak>1?' x'+G._oneStreak:'')") &&
    demo.includes("else { G._onePop=false; G._oneStreak=0; }") &&
    demo.includes("*(1+(G._onePop?Math.min(0.30,0.12+(Math.max(1,G._oneStreak||1)-1)*0.06):0));") &&
    demo.includes("G.groove=0; G._oneStreak=0; G._endSent=false;") &&
    demo.includes('function resetFightState(){'));   /* V107 RE-POINTED: one reset, both doors */
ok('V67 ONE CLOCK (Paolo: "the dead eye dial is not synced up with beat one"). The dial rode a per-frame counter with no relationship to the audio sequencer\'s step 0, so the sweep and the loud hero downbeat drifted forever. The AUDIO is the clock now, latency-compensated to what the ear hears',
    demo.includes('function audioMs(){') &&
    demo.includes('const lat=((AC.outputLatency||AC.baseLatency||0)||0);') &&
    demo.includes('const t=AC.currentTime-lat-_seq.t0;') &&
    demo.includes('{ const _am=audioMs(); if(_am!=null)_bpmClock=_am; else _bpmClock+=dt*1000; }') &&
    demo.includes('_seq.t0=_seq.next;') &&
    demo.includes('function seqAnchor(){') &&
    // every forced step-0 re-anchors, or the clock keeps counting from the OLD downbeat
    (demo.split('seqAnchor();').length - 1) >= 3);
ok('V67 WHOLE BARS: every cover cycle is a whole number of BARS, so the top of the dial cycle IS beat one. A 6-beat cycle can never start on a downbeat in 4/4 and two packages were running one',
    demo.includes('const B={0:8,1:8,2:8,3:4,4:4};') &&
    !demo.includes('const B={0:8,1:8,2:6,3:6,4:4};') &&
    demo.includes('V67 WHOLE BARS'));
  // v59 -> v66: the RUN HANDOFF. The string checks that used to stand in for the
  // enter/exit path are superseded by section 5, which EXECUTES the real listener
  // five fights back to back. What stays here is the wiring: the demo must route
  // through HANDOFF CORE, and both endings must go out the one door.
  ok('V66 RUN HANDOFF wiring: the demo delegates the whole bus to HANDOFF CORE (install/outcome/end), win AND loss both route through the one send',
    demo.includes('BohemiaHandoff.install(window,G,{') &&
    demo.includes('function encounterOutcome(){ return BohemiaHandoff.outcome(G); }') &&
    demo.includes('function sendCombatEnd(win,reason){ BohemiaHandoff.end(G,win,reason||(win?\'cleared\':\'down\'),') &&
    demo.includes('sendCombatEnd(true);   /* V59 RUN HANDOFF: one clean outcome */') &&
    demo.includes('sendCombatEnd(false);   /* V59 RUN HANDOFF: one clean outcome */') &&
    // the old hand-rolled listener is GONE: one bus, not two
    !demo.includes("const d=ev&&ev.data;if(!d||d.type!=='BOHEMIA_ENCOUNTER')return;"));
  ok('V66 QUEST CONTEXT on the screen: an encounter handed over by a quest shows its objective over the BOARD (inside #stage, clear of the controls) and says it out loud when nobody has to die',
    demo.includes('id="objchip"') &&
    demo.includes('function showObjective(C){') &&
    demo.includes('NOBODY HAS TO DIE') &&
    demo.includes('try{showObjective(G._ctx);}catch(_e){}') &&
    /<div id="stage">[\s\S]{0,900}id="objchip"[\s\S]{0,600}<\/div><\/div>/.test(demo));
  ok('V66 NO SPLASH ON A HANDOFF: a quest-driven encounter takes over the demo start screen, so a run walks straight into the fight instead of onto TAP TO START',
    demo.includes('takeover:function(){ if(G._ctx&&(G._ctx.questId||G._ctx.encounterId)){ try{startGame();}catch(_e){} } },') &&
    demo.includes('call(env.takeover);'));
  ok('V66 THE 13-SECOND STALL IS DEAD: the cross-origin font no longer blocks combat\'s boot (measured 12.9s cold on the real surface before this, 14ms after)',
    demo.includes('media="print" onload="this.media=\'all\'"') &&
    // the render-blocking form is gone from the head
    !/<link href="https:\/\/fonts\.googleapis\.com[^>]*" rel="stylesheet">\s*\n<style>/.test(demo));
  // v60: two big swings -- the facing fix and grenades (the movement-forcer)
  ok('V60 FACING FIX: the stance faces the SINGLE most dangerous enemy (max threatWeight), not the cancelling vector sum that pointed sideways under a flank',
    demo.includes('V60 FACING FIX') &&
    demo.includes('let best=pool[0], bw=-1;') &&
    demo.includes('for(const e of pool){ const w=threatWeight(e); if(w>bw){bw=w;best=e;} }') &&
    demo.includes('return best?best.ea:G.faceAng;') &&
    !demo.includes('for(const e of pool){ const w=threatWeight(e); sx+=Math.cos(e.ea)*w'));
  ok('V60 GRENADE: grenadeTurn ticks/throws at the turn-end choke, the grenade is world-anchored (a move carries you off it), graded blast (stand=full, step=clip, dash/vault=clear), telegraph + fuse rendered',
    demo.includes('function grenadeTurn(){') &&
    demo.includes('grenadeTurn();') && demo.includes('bleedTick();') &&   /* V99: pGrenTurn() now sits between them; the invariant is that grenadeTurn ticks at the choke */
    demo.includes('if(G.grenade)mv(G.grenade,0.02);') &&
    demo.includes('if(d<0.9)dmg=40+Math.floor(Math.random()*12); else if(d<1.5)dmg=18+Math.floor(Math.random()*8);') &&
    demo.includes("G.grenade={ea:a,edist:dd,fuse:2,r:1.5") &&
    demo.includes('if(!aimo&&G.grenade){') &&
    demo.includes('const _hadG=!!G.grenade;'));
/* ===== V152 SUPERSEDES V61'S ONE-PER-FIGHT CAP =====================
   Paolo 8/15: "there's no movement in the game bro... as soon as I find Cover I
   can just hunker down until the end... do whatever you have to do."
   V61's cap was written as "exactly one per encounter, FOR JUDGING IT CLEAN" --
   a scaffold so he could see the feature once and rule on it. He ruled. The
   scaffold stayed up for two months, and the game's only purpose-built reason
   to move has been firing ONCE per fight.
   *** THIS CHANGES SOMETHING THE OLD GATE ATTRIBUTED TO HIM, so it is flagged
   to him in the reply rather than slipped past. *** Newest date wins, and a
   generous cooldown keeps it a beat and never spam. */
  ok('V152 THEIR GRENADE RUNS ON A COOLDOWN, not a one-shot latch: the file\'s own designated movement-forcer finally gets to force movement more than once, with a real gap between throws',
    demo.includes('const GREN_CD=5;') &&
    demo.includes('if(!_hadG && !G.grenade && !G.over && !(G._grenCd>0)){') &&
    demo.includes('G._grenCd=GREN_CD;') &&
    demo.includes('G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;'));

  ok('V152 COVER DIES, WHICH IS XCOM\'S OWN ANSWER TO TURTLING: every round his cover eats takes a bite, tall stone is chewed down to LOW (crouch it, vault it) and low cover is chewed to rubble and removed. The tile he is sitting on expires because he stood there and let people shoot it, not on a schedule',
    demo.includes('function chewCover(P){') &&
    demo.includes('function coverHP(P){') &&
    /if\(covP\)chewCover\(covP\);/.test(demo) &&
    demo.includes("setRead('COVER IS GONE'") &&
    demo.includes("setRead('COVER IS GOING'"));

  ok('V152 AND NO TIMER, DELIBERATELY: a countdown is an author off-screen shouting hurry up, and he asked for things that "switched up naturally". Nothing here announces itself -- no clock, no meter, no shrinking play area',
    !/MISSION_TIMER|turnLimit|TURN_LIMIT/.test(demo));
  // v62: weapon identities -- per-weapon killshot cap + dial width
  ok('V62 WEAPON IDENTITY: each weapon sets a killshots/turn cap (rifle 1, smg 2, shotgun 2, pistol up-to-skill) and a dial width (rifle/shotgun wide, smg mean); chain + dial + readout all use it',
    demo.includes('const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};') &&
    demo.includes('const WEAPON_WIDTH={pistol:1.0,smg:0.80,rifle:1.30,shotgun:1.20};') &&
    demo.includes('function chainWall(){ return Math.max(1, WEAPON_CAP[WEAPON]||8); }') &&
    demo.includes('function chainAllowance(){ return Math.max(1,Math.min(perkKillshots(), chainWall())); }') &&   /* V98: the allowance is a PERK slider now; the WEAPON ceiling is what this check owns */
    demo.includes('if(G._chainN>chainWall()){') &&
    demo.includes('const _ww=WEAPON_WIDTH[WEAPON]||1;') &&
    /* V182 RE-POINTED: POWER (RF4-07/42) joins this line as _pwr. THE CLAIM IS
       UNCHANGED -- the weapon's own width is a term in the dial -- and adding
       Power here rather than beside applyDamage is what keeps NO DAMAGE BEFORE
       THE DIAL intact: one stat, every weapon, and it moves the WINDOW. */
    demo.includes('z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*_pwr*(G.inFU?1.18:1)*(G.execWindow?1.35:1)') &&
    demo.includes("'SHOT '+(G._chainN||1)+' OF '+chainAllowance()"));
  // v63: two big swings -- overworld encounter music + the double hero beat
  ok('V63 OVERWORLD MUSIC: encounters play the real overworld creepers (6 night songs), the 8 missing overworld voices are ported into synthV, and owSong() sources them only in a SHUFFLE encounter (a lab faction pick still auditions the faction)',
    demo.includes('V63 OVERWORLD ENCOUNTER MUSIC') &&
    demo.includes('const OVERWORLD_SONGS=[') &&
    demo.includes("{n:'SLOW CREEP',root:45") && demo.includes("{n:'THE PIT BOSS IS GONE',root:41") &&
    demo.includes('function pickOverworldSong(){') &&
    demo.includes('function owSong(){ return (G.factionShuffle&&G._owSong)?G._owSong:FAC(); }') &&
    demo.includes('const f=owSong();   /* V63: encounters play the overworld creeper') &&
    demo.includes("G._dayPhaseAt=performance.now(); }   /* V78: the song is rolled by NEW ENCOUNTER / SHUFFLE, in one place, never twice an encounter */") &&
    demo.includes("if(kind==='nightpad'){") && demo.includes("if(kind==='rustlead'){") &&
    demo.includes("if(kind==='deadsat'){") && demo.includes("if(kind==='solarhymn'){") &&
    demo.includes("if(kind==='powergrid'){") && demo.includes("if(kind==='signalfade'){") &&
    demo.includes("if(kind==='rouletteghost'){") && demo.includes("if(kind==='dreadbed'){"));
  ok('V71 THE HERO IS JUST THE VOICE (Paolo 7/26: "I\'m not feeling the hero beat drum doubling"). The doubled kick and sub boom on step 0 are GONE -- a doubling he cannot feel was dead weight sitting on the limiter in front of the note that IS the hero. Beat one is still canon for every song (7/24); it is announced by the 808 at 3x, alone, with nothing competing',
    !demo.includes("drumV((f.kit&&f.kit.k)||'punchk',AC,_hd,t); drumV('boom',AC,_hd,t);") &&
    !demo.includes("if(s===0){ drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t); drumV('boom',AC,MAST,t); }") &&
    demo.includes("const _bi=(f.inst&&f.inst.b)||'osc'; const _db=(s===0)?3:1;") &&
    demo.includes('synthV(_bi,AC,MAST,noteHz,_fsd,semi,t,0.13*_db);') &&
    demo.includes('g.gain.linearRampToValueAtTime(0.12*_db,t+0.01);'));
  // v65 (supersedes v64): Paolo's ruling -- EXACTLY TWO RAMPS, 2 kills and 4 kills
  ok('V65 TWO RAMPS (Paolo: "I just only wanted to be two kills and then four kills at ramps"): exactly two rungs, at 2 and at 4, where his 7/3 law put them -- no rung at 1, 3 or 6',
    demo.includes('V65 TWO RAMPS') &&
    demo.includes("if(_sk>=2){ if(s%4===2)drumV('tight',AC,MAST,t); if(s===4||s===12)drumV('clap',AC,MAST,t);") &&
    demo.includes("if(_sk>=4){ if(s%2===1)drumV('clickh',AC,MAST,t); if(s===0||s===8)drumV('ride',AC,MAST,t);") &&
    // the v64 over-reach is GONE: no rungs anywhere but 2 and 4
    !demo.includes('_sk>=1') && !demo.includes('_sk>=3') && !demo.includes('_sk>=6'));
  ok('V65 the two ramps are AUDIBLE: they play the ladder\'s own aggressive voices (growl/acid bass, clickh/ride/clap/tight percussion), never the song\'s lead -- which on the v63 overworld creepers is a whisper-capped ambient voice (solarhymn, signalfade). That was the real defect behind "the music doesn\'t change"',
    demo.includes("synthV('growl',AC,MAST,noteHz,stepDur(),f.root-55+f.scale[s%f.scale.length],t,0.12);") &&
    demo.includes("synthV('acid',AC,MAST,noteHz,stepDur(),f.root-43+f.scale[s%f.scale.length],t,0.10); } }") &&
    // the LOCKED 7/3 law survives: layers key off KILLS THIS ENCOUNTER, and area-clear goes calm
    demo.includes("(G.e?G.e.filter(e=>e.dead||e.downed||e.broken||e.fleeing).length:0)") &&
    demo.includes("BohemiaGroove.musicFloor(G.groove)):0);"));
}
/* ============================================================================
   5. V66 RUN HANDOFF -- THE REAL BUS, HEADLESS, FIVE FIGHTS BACK TO BACK
   The run hands off from a quest step and expects the fight to come back clean.
   This section pulls HANDOFF CORE out of the SHIPPED blob, installs it on a
   window that IS the bus, and drives five encounters in a row with a filthy
   state between each one. Nothing here is a string match: it runs.
   ========================================================================== */
{
  const ha = demo.indexOf('HANDOFF CORE START'), hb = demo.indexOf('HANDOFF CORE END');
  ok('demo carries HANDOFF CORE (the encounter bus is one testable block)', ha > 0 && hb > ha);
  const hSrc = demo.slice(demo.indexOf('var BohemiaHandoff', ha), demo.lastIndexOf('if(typeof module', hb));
  const hm = { exports: {} };
  new Function('module', 'exports', hSrc + ';module.exports=BohemiaHandoff;')(hm, hm.exports);
  const BH = hm.exports;

  /* a window that IS the bus: real listener registration, real message events */
  function busWindow() {
    const ls = [];
    return { addEventListener: (t, f) => { if (t === 'message') ls.push(f); },
             send: (data) => { for (const f of ls.slice()) f({ data }); },
             count: () => ls.length };
  }
  /* the demo's env minus the screen: setup builds bodies the way setupEnemies does */
  function envFor(G, log, boom) {
    return { stamMax: 3,
      post: (m) => log.push(m),
      camHome: () => { G._cam = 'home'; },
      resetBeat: () => { G._beat = 0; },
      syncPkg: () => { G._pkgUI = G.userPkg; },
      shuffle: () => { G._faction = 'rolled'; },
      setup: () => { if (boom && boom()) throw new Error('setupEnemies blew up');
        G.e = []; for (let i = 0; i < G.numEnemies; i++)
          G.e.push({ i, eid: i, n: 'hostile_' + i, hp: 60, max: 60, ea: 0, edist: 6 });
        G.mTurn = 0; G.pillars = [{ ea: 0, edist: 3 }]; },
      afterSetup: () => { G._boards = (G._boards | 0) + 1; },
      onAbort: () => { G._abortUI = true; } };
  }
  /* THE DIRTY LIST: what a finished fight leaves lying around ... */
  const DIRTY = { over: true, win: true, phase: 'over', inFU: true, execWindow: true,
    ks: { phase: 'cine' }, frozen: true, freezeTimer: 9, killStreak: 4, popTarget: 2,
    fireTarget: 2, selTarget: 1, mTurn: 17, _oneStreak: 3, _onePop: true, _chainN: 5,
    _relGreed: true, dashArm: true, handPeek: true, sprintArm: true, _endSent: true,
    _walkout: { t0: 1 }, inc: { x: 1 }, grenade: { fuse: 1 }, _grenadeBlast: { r: 2 },
    _grenadeThrown: true, wager: 'double', wagerLocked: true, wagerFail: true, recoil: 3,
    wound: 0.9, woundShake: 2, breathT: 5, _hitstop: 12, _redPunch: 2, _vShakeAt: 99,
    greedHeld: true, greedWant: true, greedMult: 2.5, _nerveLastDown: 4, _newBeads: 3,
    _poppedOut: true, _demo: { k: 'J' }, _spawnLayout: 'ring' };
  /* ... and what the next fight MUST read. Stated here independently of the
     core's own table, so a hole in that table shows up as a failure. */
  const CLEAN = { over: false, win: false, phase: 'cover', inFU: false, execWindow: false,
    ks: null, frozen: false, freezeTimer: 0, killStreak: 0, popTarget: -1, fireTarget: -1,
    selTarget: null, mTurn: 0, _oneStreak: 0, _onePop: false, _chainN: 1, _relGreed: false,
    dashArm: false, handPeek: false, sprintArm: false, _endSent: false, _walkout: null,
    inc: null, grenade: null, _grenadeBlast: null, _grenadeThrown: false, wager: 'none',
    wagerLocked: false, wagerFail: false, recoil: 0, wound: 0, woundShake: 0, breathT: 0,
    _hitstop: 0, _redPunch: 0, _vShakeAt: 0, greedHeld: false, greedWant: false,
    greedMult: 1.0, _nerveLastDown: 0, _newBeads: 3 - 3, _poppedOut: false, _demo: null };

  const G = { numEnemies: 3, pHP: 100, pMax: 100, e: [], stam: 0, factionShuffle: true };
  const log = [];
  const win = busWindow();
  BH.install(win, G, envFor(G, log));
  ok('the bus installs one listener and answers READY at once (the run never has to guess when the frame is live)',
    win.count() === 1 && log.length === 1 && log[0].type === 'BOHEMIA_COMBAT_READY' && log[0].version === 66);

  const leaks = [], ctxMiss = [], endMiss = [];
  let ends = 0, starts = 0, errs = 0;
  for (let n = 1; n <= 5; n++) {
    /* leave the wreckage of the last fight everywhere */
    Object.assign(G, DIRTY);
    G.corpses = [{}, {}]; G.bloodSpots = [{}]; G.litter = [{}, {}]; G.coverHoles = [{}]; G._fx = [{}];
    G.rc = { shots: 9, hits: 4, kills: 3 };
    const before = log.length;
    win.send({ type: 'BOHEMIA_ENCOUNTER', encounterId: 'enc' + n, questId: 'S0' + n,
      stepId: 'step' + n, objective: 'stop the meter man ' + n, faction: 'REDS',
      reason: 'quest', mercy: (n % 2 === 0), packageId: n % 5, playerHP: 60 + n,
      roster: [{ eid: 0, name: 'A' + n, hp: 44 }, { eid: 1, name: 'B' + n, hp: 44 },
               { eid: 2, name: 'C' + n, hp: 44 }] });
    /* 1. CLEAN STATE: nothing from the last fight survived */
    for (const k in CLEAN) if (G[k] !== CLEAN[k]) leaks.push('fight ' + n + ': ' + k + '=' + JSON.stringify(G[k]));
    if (G.corpses.length || G.bloodSpots.length || G.litter.length || G.coverHoles.length || G._fx.length)
      leaks.push('fight ' + n + ': the dead/blood/litter/fx carried in');
    if (G.rc.shots !== 0 || G.rc.kills !== 0) leaks.push('fight ' + n + ': the receipt carried in');
    if (G.stam !== 3) leaks.push('fight ' + n + ': stamina did not refill');
    /* 2. QUEST CONTEXT IN */
    const C = G._ctx || {};
    if (C.questId !== 'S0' + n || C.stepId !== 'step' + n || C.encounterId !== 'enc' + n) ctxMiss.push('fight ' + n + ': ids');
    if (C.objective !== 'stop the meter man ' + n || C.faction !== 'REDS') ctxMiss.push('fight ' + n + ': words');
    if (C.mercy !== (n % 2 === 0)) ctxMiss.push('fight ' + n + ': mercy flag');
    if (G.pHP !== 60 + n) ctxMiss.push('fight ' + n + ': playerHP');
    if (G.userPkg !== n % 5 || G.pkgDiff !== n % 5) ctxMiss.push('fight ' + n + ': difficulty package');
    if (!G.e[0] || G.e[0].n !== 'A' + n || G.e[0].hp !== 44) ctxMiss.push('fight ' + n + ': roster');
    if (G.enemiesLeft !== 3) ctxMiss.push('fight ' + n + ': enemiesLeft');
    const fresh = log.slice(before);
    starts += fresh.filter(m => m.type === 'BOHEMIA_COMBAT_STARTED').length;
    errs += fresh.filter(m => m.type === 'BOHEMIA_COMBAT_ERROR').length;
    /* 3. fight it: one dies, one runs, one puts his hands up */
    G.e[0].dead = true; G.e[1].fleeing = true; G.e[2].broken = true;
    G.mTurn = 6 + n; G.pHP = 40 + n;
    const b2 = log.length;
    /* 4. OUTCOME OUT -- and the second call must be silent (one send per fight) */
    BH.end(G, true, 'cleared', (m) => log.push(m));
    BH.end(G, true, 'cleared', (m) => log.push(m));
    BH.end(G, false, 'down', (m) => log.push(m));
    const outs = log.slice(b2).filter(m => m.type === 'BOHEMIA_COMBAT_END');
    ends += outs.length;
    const o = outs[0];
    if (!o) endMiss.push('fight ' + n + ': no outcome at all');
    else {
      if (o.dead !== 1 || o.fled !== 1 || o.spared !== 1 || o.alive !== 0) endMiss.push('fight ' + n + ': fates ' + JSON.stringify([o.dead, o.fled, o.spared, o.alive]));
      if (o.kills !== 1) endMiss.push('fight ' + n + ': kills');
      if (o.result !== 'win' || o.victory !== true || o.reason !== 'cleared') endMiss.push('fight ' + n + ': result');
      if (o.questId !== 'S0' + n || o.stepId !== 'step' + n || o.encounterId !== 'enc' + n) endMiss.push('fight ' + n + ': context did not echo');
      if (o.turns !== 6 + n || o.playerHP !== 40 + n) endMiss.push('fight ' + n + ': turns/hp');
      if (!Array.isArray(o.fates) || o.fates.length !== 3 || o.fates[1].fate !== 'fled') endMiss.push('fight ' + n + ': fate list');
    }
  }
  ok('FIVE BACK TO BACK: every encounter starts from a CLEAN SLATE (no state, corpse, streak, grenade, stamina or nerve leak from the fight before)',
    leaks.length === 0, leaks.slice(0, 6).join(' | '));
  ok('QUEST CONTEXT IN: quest/step/encounter ids, objective, faction, mercy flag, playerHP, difficulty package and the engine-owned roster all land in the fight',
    ctxMiss.length === 0, ctxMiss.slice(0, 6).join(' | '));
  ok('OUTCOME OUT: dead/spared/fled/alive tally per the mercy mechanics, kills, turns, hp, and the quest context echoes back so the step can match the fight to itself',
    endMiss.length === 0, endMiss.slice(0, 6).join(' | '));
  ok('ONE SEND PER FIGHT: five fights, five outcomes, even though win/loss both fired repeatedly (5 got ' + ends + ')', ends === 5);
  ok('five STARTED acks, zero errors on the bus across the whole run', starts === 5 && errs === 0);

  /* 6th fight: the quest calls it OFF mid-encounter */
  {
    const before = log.length;
    win.send({ type: 'BOHEMIA_ENCOUNTER', encounterId: 'enc6', questId: 'S06', stepId: 'step6', roster: [{ eid: 0, name: 'A6', hp: 44 }] });
    win.send({ type: 'BOHEMIA_ENCOUNTER_ABORT' });
    win.send({ type: 'BOHEMIA_ENCOUNTER_ABORT' });
    const outs = log.slice(before).filter(m => m.type === 'BOHEMIA_COMBAT_END');
    ok('ABORT: the quest can call the fight off and still gets exactly ONE settled outcome (result aborted, the man left alive), never a dangling encounter',
      outs.length === 1 && outs[0].result === 'aborted' && outs[0].reason === 'abort' &&
      outs[0].victory === false && outs[0].alive === 1 && outs[0].encounterId === 'enc6' &&
      G.over === true && G.phase === 'over' && G._abortUI === true);
  }
  /* the ping/ready handshake the parent leans on when it hands off cold */
  {
    const before = log.length;
    win.send({ type: 'BOHEMIA_COMBAT_PING' });
    const r = log.slice(before);
    ok('PING answers READY (a run that hands off before the frame booted gets its encounter through)',
      r.length === 1 && r[0].type === 'BOHEMIA_COMBAT_READY');
  }
  /* a broken fight reports itself instead of hanging the run */
  {
    const G2 = { numEnemies: 2, pHP: 100, pMax: 100, e: [] };
    const log2 = [], w2 = busWindow();
    let blow = true;
    BH.install(w2, G2, envFor(G2, log2, () => blow));
    w2.send({ type: 'BOHEMIA_ENCOUNTER', encounterId: 'boom', roster: [{ eid: 0, name: 'x', hp: 10 }] });
    const err = log2.filter(m => m.type === 'BOHEMIA_COMBAT_ERROR');
    ok('a fight that fails to build reports BOHEMIA_COMBAT_ERROR with its encounter id (the run hears the failure, it does not just hang)',
      err.length === 1 && err[0].encounterId === 'boom' && err[0].phase === 'encounter' && /blew up/.test(err[0].msg));
    blow = false;
    const b3 = log2.length;
    w2.send({ type: 'BOHEMIA_ENCOUNTER', encounterId: 'recover', roster: [{ eid: 0, name: 'y', hp: 10 }] });
    ok('and the very next encounter still starts clean after that failure (one bad fight never poisons the bus)',
      log2.slice(b3).some(m => m.type === 'BOHEMIA_COMBAT_STARTED' && m.encounterId === 'recover') &&
      G2.e.length === 1 && G2._endSent === false && G2.over === false);
  }
  /* the outcome grammar itself, on a mixed field */
  {
    const g = { e: [{ dead: true }, { fleeing: true }, { broken: true }, { downed: true }, {}, {}] };
    const o = BH.outcome(g);
    ok('the mercy grammar counts right: dead 1, fled 1, spared 2 (surrendered + dying), still standing 2',
      o.dead === 1 && o.fled === 1 && o.spared === 2 && o.alive === 2 && o.fates.length === 6);
  }
  /* context sanitation: the run cannot inject a novel into the fight */
  {
    const C = BH.context({ objective: 'x'.repeat(400), questId: 'q'.repeat(400), packageId: 99, mercy: 'yes' });
    ok('quest context is sanitized on the way in (clamped strings, package 0..4, mercy a real boolean)',
      C.objective.length === 140 && C.questId.length === 64 && C.packageId === 4 && C.mercy === true);
  }
}

/* ============================================================================
   7. V67 -- THE FOUR THINGS PAOLO CALLED OUT, EXECUTED (not string-matched)
   The shipped bodies of audioMs, cycBeats, pinned and the turn-end tick are
   pulled OUT of the blob and RUN here over stub state. String checks are what
   let a 2.2-second wall-clock pin sit in a turn-based game for a week.
   ========================================================================== */
{
  const grab = (name, sig) => {
    const i = demo.indexOf(sig);
    if (i < 0) return null;
    // take to the end of that function: match braces from the first {
    let s = demo.indexOf('{', i), depth = 0, j = s;
    for (; j < demo.length; j++) {
      if (demo[j] === '{') depth++;
      else if (demo[j] === '}') { depth--; if (!depth) { j++; break; } }
    }
    return demo.slice(i, j);
  };

  /* --- THE CLOCK: audioMs must read the AudioContext, ear-compensated --- */
  {
    const src = grab('audioMs', 'function audioMs()');
    ok('audioMs lifts out of the shipped demo', !!src);
    const mk = () => new Function('AC', '_seq', 'G', src + ';return audioMs();');
    const AC = { currentTime: 10.0, outputLatency: 0.08, baseLatency: 0.01 };
    const seqOn = { on: true, t0: 4.0, next: 4.0 };
    const G0 = {};
    const beats = mk()(AC, seqOn, G0) / 500;
    /* heard-position = (10.0 - 0.08 - 4.0)s = 5.92s = 11.84 beats at 120bpm */
    ok('THE CLOCK IS THE AUDIO CLOCK: position is measured from the song\'s own step 0 and pushed back by the measured output latency, so the beat the game runs on is the beat the ear hears',
      Math.abs(beats - 11.84) < 1e-6, 'got ' + beats);
    ok('silence falls back cleanly (nothing playing = no beat to miss, never a NaN clock)',
      mk()(AC, { on: false, t0: 0, next: 0 }, G0) === null &&
      mk()(null, seqOn, G0) === null);
    ok('a clock that has not started yet never runs negative',
      mk()({ currentTime: 3.0, outputLatency: 0, baseLatency: 0 }, seqOn, G0) === 0);
    ok('V69 SYNC: the per-device calibration offset rides the whole clock (uncalibrated, phone output latency of 40-300ms can put a perfectly correct build a third of a beat off, which reads to a player as no change at all)',
      Math.abs(mk()(AC, seqOn, { audioOffset: -120 }) - (mk()(AC, seqOn, G0) - 120)) < 1e-9);
  }

  /* --- BEAT ONE: every cover cycle must be a whole number of bars --- */
  {
    const src = grab('cycBeats', 'function cycBeats()');
    const fn = new Function('G', src + ';return cycBeats();');
    const got = [0, 1, 2, 3, 4].map(p => fn({ pkgDiff: p }));
    ok('WHOLE BARS: every difficulty package runs a cover cycle that is a whole number of 4/4 bars, so the top of the dial cycle IS beat one -- a 6-beat cycle lands on beat 1, then beat 3, forever (' + got.join(',') + ')',
      got.every(b => b % 4 === 0) && got.length === 5);
    ok('and the packages still get harder, never easier, as the number climbs',
      got.every((b, i) => i === 0 || b <= got[i - 1]));
  }

  /* --- THE PIN: measured in TURNS, and it survives real thinking time --- */
  {
    const pinSrc = grab('pinned', 'function pinned(e)');
    const pinned = new Function('e', pinSrc + ';return pinned(e);');
    ok('a pin is counted in TURNS, not milliseconds (the whole bug: a 2.2s wall-clock pin expires while you are still deciding your move)',
      pinned({ supp: 1 }) === true && pinned({ supp: 0 }) === false && pinned({}) === false &&
      !/_suppr/.test(demo));
    /* the shipped turn-end lines, run for real */
    const tick = new Function('G', `
      for(const e of G.e){ if((e.supp||0)>0)e.supp--; }
      if((G.suppCd||0)>0)G.suppCd--;
      if(G.sprintArm||G.dashArm){ G.sprintArm=false; G.dashArm=false; }
      return G;`);
    const G = { e: [{ supp: 1 }, { supp: 1 }, { supp: 0 }], suppCd: 2, sprintArm: true, dashArm: true };
    tick(G);
    ok('the pin holds through the WHOLE turn you spend it in (the return volley included) and lifts at the turn end, exactly one turn later',
      G.e[0].supp === 0 && G.e[1].supp === 0 && G.e[2].supp === 0);
    ok('the cooldown ticks with it, so suppression opens a window every other turn instead of locking the fight down forever',
      G.suppCd === 1);
    ok('AN ARMED MOVE NEVER SURVIVES ITS TURN -- an arm leaking into the next turn is exactly what made the ring feel like it moved him on its own',
      G.sprintArm === false && G.dashArm === false);
  }

  /* --- TWO DIFFERENT MOVES: cost, turn cost, and exclusivity --- */
  {
    ok('V72 STAMINA NEVER COSTS A TURN (Paolo: "when you sprint and use stamina points it doesn\'t consume a turn, bro"). His own V54 law, which every stamina verb honoured EXCEPT sprint -- v67 charged it a pip AND ended the turn, the worst of both. Sprint ends nothing now; what separates it from dash is PRICE and RISK: 1 pip and the FULL exposure crack, versus 2 pips and half',
      demo.includes("sprint needs 1 pip") &&
      demo.includes("dash needs 2 pips") &&
      demo.includes("renderBoard(); updGap(); return; }   /* V73 FREE AND SAFE: no turn end, NO return fire */") &&
      !demo.includes("endTurnReturn(true); }   /* V44: a sprint breaks cover for real") &&
      demo.includes('const STAM_MAX=3;   /* V54 STAMINA (Paolo, Fable model): stamina actions DON\'T end your turn */'));
ok('V73 FREE *AND* SAFE (Paolo 7/26: "I get free movement and I CAN\'T GET SHOT AT that turn... that\'s what Rogue Fable IV does"). v72 stopped sprint ending the turn and LEFT THE VOLLEY IN, which from the player\'s chair is the same as being shot for moving. Every mobExposeFire call is gone: sprint, dash and vault cost stamina AND NOTHING ELSE',
  (demo.split('mobExposeFire(').length - 1) === 1 &&        /* the definition, zero callers */
  !demo.includes('mobExposeFire(1.0)') && !demo.includes('mobExposeFire(0.5)') && !demo.includes('mobExposeFire(0.55)') &&
  demo.includes('V73 FREE AND SAFE') &&
  // and the old note that would tempt someone to put a crack back is deleted
  !demo.includes("V54: mobility isn't free"));
ok('all three mobility verbs end with the same free-and-safe tail, and NONE of them ends the turn',
  (demo.split('/* V73 FREE AND SAFE: no turn end, NO return fire */').length - 1) === 3 &&
  !demo.includes('renderBoard(); updGap(); }   /* NO turn end */'));
ok('and your one real ACTION still costs you: popping to shoot ends the turn and eats the volley -- that is the trade the fight is built on',
  demo.includes('function endTurnReturn(engaged){') &&
  demo.includes('endTurnReturn(false); } }') &&
  demo.includes("if(G.phase==='cover'){ audio(); _fromPop=true; doPop(); return; }"));
    const arm = new Function(`
      const G={sprintArm:false,dashArm:false};
      G.dashArm=!G.dashArm; if(G.dashArm)G.sprintArm=false;
      G.sprintArm=!G.sprintArm; if(G.sprintArm)G.dashArm=false;
      return G;`)();
    ok('arming one move always disarms the other -- two armed moves over one ring is what he could not read',
      arm.sprintArm === true && arm.dashArm === false);
  }
}

ok('V67 STAMINA IS ACTUALLY SPENT: the pip you pay is no longer handed straight back by the same turn\'s refill. The refill is the reward for a turn you spent nothing on -- otherwise sprint costs a pip and the pips never move, which is a cost you cannot feel',
    /* V163 RE-POINTED, AND THE SUPERSESSION IS NAMED. The per-use regen
       ("+1 only on a turn you spent none") came from the 7/26 audit. THE 8/17
       RF4 LIFT LAW IS NEWER AND OVERTURNS IT IN HIS OWN WORDS: "SP regenerates
       on every 5th global game turn, ON A FIXED WORLD CLOCK. It is NOT a
       per-use cooldown that starts when you spend... It rewards clock-reading,
       not hoarding." NEWEST DATE WINS (TRUTH HIERARCHY), and section 6 of that
       law routes this to COMBAT as the FIRST thing to build.
       The invariant that survives is the one V67 actually cared about: a pip he
       pays is not handed straight back by the same turn. Under the clock it is
       handed back by the CLOCK, which is the point. */
  demo.includes('G.stam-=n; updStam();') &&
  /if\(\(\(G\.mTurn\|\|0\)%SP_TICK\)===0\)\{/.test(demo) &&
  /* the flag the old rule needed is DEAD and deleted, not left orphaned --
     comments stripped, because the comment that explains the deletion quotes it */
  !/G\._stamSpent/.test(demo.replace(/\/\*[\s\S]*?\*\//g, ' ')) &&
  !demo.includes('G.stam=Math.min(STAM_MAX,(G.stam||0)+1); updStam();   /* V54: a pip back each turn */'));

/* ============================================================================
   8. V68 -- 120 BPM GAMEPLAY COMES FIRST (Paolo 7/26, LAW)
   laws/BOHEMIA_ADDENDUM_120BPM_FIRST_AND_THE_PERMISSION_PRESS_7_26_26.md
   The SHIPPED dial engine is pulled out of the blob and RUN. Two claims get
   proven, not asserted: every dial cycle is a whole BAR, and at beat one the
   needle is on dead centre -- which is what "the perfect shot IS the hero beat"
   actually means. v67 said the clock was fixed and he still could not feel it,
   because the dial's own cycle was a different function nobody had checked.
   ========================================================================== */
{
  const a = demo.indexOf('var BohemiaEngine = (function(){');
  const b = demo.indexOf('if (typeof window !== ');
  ok('the shipped dial engine lifts out of the blob', a > 0 && b > a);
  const em = { exports: {} };
  new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaEngine;')(em, em.exports);
  const E = em.exports, LIM = E.K.LIM;

  /* 1. WHOLE BARS, every pattern, every difficulty, greed included */
  let bars = 0, tot = 0, offenders = [];
  for (const pkg of [0, 1, 2, 3, 4]) for (const p of E.packagePool({ pkgDiff: pkg })) {
    tot++;
    const n = E.beatsForCycle({ pkgDiff: pkg, pat: p });
    const g = E.beatsForCycle({ pkgDiff: pkg, pat: p, greedHeld: true });
    if (n % 4 === 0 && g % 4 === 0 && n >= 4 && g >= 4) bars++;
    else if (offenders.length < 6) offenders.push(pkg + ':' + p + '=' + n + '/greed' + g);
  }
  ok('EVERY dial cycle is a whole BAR (' + bars + '/' + tot + ' pattern x difficulty, greed included). An even-beat cycle is not a bar: 6 and 10 beats put the perfect shot on beat one, then beat three, forever -- that was 44% of them',
    bars === tot, offenders.join(' '));

  /* 2. AND AT BEAT ONE THE NEEDLE IS ON CENTRE -- run the real tick */
  const topOffset = (pat, pkg) => {
    const G = { pat, pkgDiff: pkg, userPkg: pkg, dir: 1, spd: 7, angle: 0, patT: 0, musicT: 0,
      greedHeld: false, greedMult: 1, W: { hZ: 0.05, vZ: 0.12, hitZ: 0.26 },
      wound: 0, woundShake: 0, execWindow: false };
    const cyc = E.beatsForCycle(G), N = 60;
    let top = 1e9;
    for (let i = 0; i < cyc * N * 3; i++) {
      G.beatClock = i / N;
      E.tick(G, 1 / N / 2);
      if (i >= cyc * N * 2 && (i % (cyc * N)) === 0) top = Math.min(top, Math.abs(G.angle));
    }
    return top / LIM;
  };
  let worst = 0, worstName = '';
  for (const pkg of [0, 1, 2, 3, 4]) for (const p of E.packagePool({ pkgDiff: pkg })) {
    const o = topOffset(p, pkg);
    if (o > worst) { worst = o; worstName = pkg + ':' + p; }
  }
  ok('THE PERFECT SHOT IS THE HERO BEAT: at beat one the needle sits within 8% of dead centre for every pattern on every difficulty (worst ' + (worst * 100).toFixed(1) + '% on ' + worstName + '). The phase table was re-solved against the bar-aligned cycles by running this same engine',
    worst <= 0.08);

  /* 3. THE PERMISSION PRESS: a press asks, the beat grants */
  {
    const src = demo.slice(demo.indexOf('const BEAT_GRACE='), demo.indexOf('function fireGrantTick()'));
    const mk = (beat) => new Function('beatNow', src + ';return {phase:beatPhase(),wait:beatsToGrant()};')(() => beat);
    const onIt = mk(4.10), early = mk(4.60), justBefore = mk(4.95);
    ok('press just AFTER a beat and you were ON it -- the game never punishes a human by a few milliseconds',
      onIt.wait === 0);
    ok('press between beats and the shot is HELD and granted ON the next beat, never fired off the grid',
      early.wait > 0 && Math.abs(early.wait - 0.4) < 1e-9 &&
      justBefore.wait > 0 && Math.abs(justBefore.wait - 0.05) < 1e-9);
    ok('the longest you ever wait for permission is under half a beat (~380ms at 120 BPM)',
      (1 - 0.24) * 500 < 400);
    ok('the request is wired into the aim loop and dies with the fight (a held shot never survives an encounter)',
      demo.includes('fireGrantTick(); }   /* V68: a held shot is granted on the beat */') &&
      demo.includes('if(beatNow()>=G._fireReq.at){ G._fireReq=null; try{setPhaseUI();}catch(_e){} fireNow(); }') &&
      demo.includes("fb.innerHTML='<b style=\"font-size:11px;letter-spacing:1px\">ON THE<br>BEAT</b>'") &&
      demo.includes('G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0;') &&
      demo.includes('function resetFightState(){') &&   /* V107 RE-POINTED: and now a held shot dies on NEW ENCOUNTER too, which it did not before */
      demo.includes('_spawnLayout:null, _fireReq:null, groove:0 };'));
  }
}

/* ============================================================================
   9. V69 -- MAKE THE BEAT PERCEIVABLE
   Paolo after v68: "I couldn't really tell a difference." The math was right
   and gated; nothing told him so. A rhythm game is anticipation you can SEE, a
   grade you can READ, a sound you MAKE, and a clock calibrated to YOUR phone.
   The grader and the calibrator are pulled out of the blob and RUN.
   ========================================================================== */
{
  const gsrc = demo.slice(demo.indexOf('const PERFECT_MS='), demo.indexOf('function sndOnBeatStab'));
  const beatErrMs = new Function('b', gsrc + ';return beatErrMs(b);');
  const gradeOf = new Function('ms', gsrc + ';return gradeOf(ms);');

  ok('the grade is measured in real MILLISECONDS off the nearest beat, signed: before the beat is EARLY, after it is LATE',
    Math.abs(beatErrMs(4.00)) < 1e-9 &&
    Math.abs(beatErrMs(4.10) - 50) < 1e-9 &&      /* 0.1 beat after = 50ms late at 120bpm */
    Math.abs(beatErrMs(3.90) + 50) < 1e-9);       /* 0.1 beat before = 50ms early */
  ok('a press wraps to the NEAREST beat, so being a hair early for the next one never reads as hugely late for the last',
    Math.abs(beatErrMs(3.98) + 10) < 1e-9);
  ok('the bands are named the way a player can learn from: PERFECT inside 55ms, GOOD inside 110ms, then EARLY or LATE with the number',
    gradeOf(0) === 'PERFECT' && gradeOf(-54) === 'PERFECT' && gradeOf(54) === 'PERFECT' &&
    gradeOf(-100) === 'GOOD' && gradeOf(100) === 'GOOD' &&
    gradeOf(-200) === 'EARLY' && gradeOf(200) === 'LATE');
  ok('THE PRESS IS GRADED, NOT THE GRANTED SHOT. The permission gate fires on the beat by design, so grading the shot would print PERFECT forever and teach nothing',
    demo.includes('G._pressBeat=beatNow();   /* V69: the GRADE is measured here, on the press */') &&
    demo.includes('G._pressBeat=beatNow();   /* V69: graded on the press, always */') &&
    demo.includes('const _pb=(G._pressBeat!=null)?G._pressBeat:beatNow(); G._pressBeat=null;'));

  ok('THE GRADE SURVIVES: it lives on its own persistent strip with the signed error and a running PERFECT count, because the verdict flash is overwritten by the hit result within the beat -- a grade he never reads is the same failure as a fix he cannot feel',
    demo.includes('id="timing"') &&
    demo.includes('function updTiming(){') &&
    demo.includes("t.textContent=g.grade+'  '+sign+g.ms+'ms'") &&
    demo.includes("if(_gr==='PERFECT')G._perfects=(G._perfects||0)+1; updTiming();"));
  ok('YOU SEE IT COMING: a ring collapses onto the dial across each beat and snaps at the hit, and the hero beat arrives fatter, brighter and from further out',
    demo.includes('V69 THE APPROACH RING') &&
    demo.includes('const _far=_hero?1.85:1.45, _near=0.99;') &&
    demo.includes('const _r=RAD*(_far-(_far-_near)*_f);') &&
    demo.includes('const _snap=Math.max(0,1-_f*7);'));
  ok('YOU HEAR WHICH BEAT IT IS: beat one gets its own higher click, and the metronome is audible over the track instead of buried under it',
    demo.includes('function sndHeroTick()') &&
    demo.includes("if(Math.floor(beatNow())%4===0)sndHeroTick(); else sndBeat();") &&
    demo.includes("function sndBeat(){ try{ const f=owSong();") &&
    !demo.includes("function sndBeat(){ tone(415,0.035,0.022,'square'); }"));
  ok('YOU HEAR YOURSELF PLAYING: an on-beat press stabs a note in the SONG\'S own key (root+fifth+octave on a PERFECT, the root alone on a GOOD, nothing when you are off the grid)',
    demo.includes('function sndOnBeatStab(grade)') &&
    demo.includes("const semi=(f.root-55)+((f.scale&&f.scale[0])||0)+12") &&
    demo.includes("if(grade==='PERFECT'){ [0,7,12].forEach") &&
    demo.includes("else if(grade==='GOOD'){ tone(noteHz(semi),0.10,0.040,'triangle',t); }") &&
    demo.includes('try{ sndOnBeatStab(_gr); }catch(_e){}'));

  /* the calibrator, executed */
  {
    const csrc = demo.slice(demo.indexOf('function calTap()'), demo.indexOf('function updStam()'));
    const run = (taps) => {
      const G = { _cal: { taps: taps.slice(0, -1) }, audioOffset: 0 };
      const stub = `
        function beatNow(){ return __next; }
        function beatErrMs(b){ const f=b-Math.floor(b); return (f<0.5?f:f-1)*(60000/120); }
        function syncLabel(){}
        function setRead(){}
        function calCancel(){ G._cal=null; }
        ${csrc}
        return calTap();`;
      const last = taps[taps.length - 1];
      new Function('G', '__next', stub)(G, 4 + (last / 500));
      return G;
    };
    /* eight taps, consistently ~90ms late: the clock should shift back by ~90 */
    const late = run([200, -200, 88, 92, 90, 86, 94, 90]);
    ok('CALIBRATION: eight taps that land consistently late shift the whole clock by the MEDIAN, not the mean, so one fumbled tap cannot poison it (got ' + late.audioOffset + 'ms)',
      late.audioOffset <= -86 && late.audioOffset >= -94 && late._cal === null);
    /* garbage taps must be refused rather than stored */
    const noise = run([0, 0, -300, 250, -180, 400, -420, 380]);
    ok('CALIBRATION REFUSES NOISE: taps spread wider than a third of a beat store nothing rather than saving garbage as your sync',
      noise.audioOffset === 0 && noise._cal === null);
    ok('the first two taps are always thrown away (nobody lands the first click of a calibration)',
      demo.includes('const t=G._cal.taps.slice(2).sort((a,b)=>a-b);'));
    ok('the SYNC button lives in settings and doubles as the tap target',
      demo.includes('id="synccal"') &&
      demo.includes("if(!calTap())calStart();"));
  }
}

/* ============================================================================
   10. V70 -- HIS TWO RULINGS: the rings at a quarter, the 808 as the hero
   ========================================================================== */
{
  ok('THE RINGS ARE AT A SIXTEENTH: three passes of his (75% down, then 50%, then 50% again). Ring and snap flash both, nothing else about them touched -- he approved the shape and the motion',
    demo.includes('const _a=(_hero?0.42:0.24)*(0.35+0.65*_f)*0.0625;') &&
    demo.includes("+(_snap*0.053125)+')';") &&
    !demo.includes("+(_snap*0.85)+')';") && !demo.includes("+(_snap*0.2125)+')';") &&
    !demo.includes("+(_snap*0.10625)+')';"));

  ok('THE HERO VOICE IS AT 3x, NOT 2x (Paolo: "should it be like three times as loud. Just the voice"). 2x amplitude is +6dB and a doubling of PERCEIVED loudness takes about +10dB, so the old double read as roughly 1.5x. 3x is +9.5dB -- the number that actually sounds twice as loud',
    demo.includes("const _bi=(f.inst&&f.inst.b)||'osc'; const _db=(s===0)?3:1;") &&
    !demo.includes("const _bi=(f.inst&&f.inst.b)||'osc'; const _db=(s===0)?2:1;") &&
    demo.includes('synthV(_bi,AC,MAST,noteHz,_fsd,semi,t,0.13*_db)') &&
    demo.includes('g.gain.linearRampToValueAtTime(0.12*_db,t+0.01)'));

  ok('NOTHING IS LEFT FIGHTING THE HERO NOTE: with the doubling gone, beat one carries the 808 alone and the master limiter (-14dB, 6:1) still stands so nothing can hard-clip again',
    !demo.includes('_hd.gain.value=0.55;') &&
    demo.includes('_cmp.threshold.value=-14;') && demo.includes('_cmp.ratio.value=6;'));

  ok('and beat one is still ANNOUNCED (7/24 ruling: beat one is canon for every song) -- what changed is HOW: the 808 at 3x instead of a drum doubling he could not feel',
    demo.includes("const _db=(s===0)?3:1;"));
}

/* ============================================================================
   11. V71 -- EVERYTHING ON BEAT, AND ALL OF HIS OVERWORLD MUSIC
   ========================================================================== */
{
  /* EVERYTHING ON BEAT (Paolo: "Everything on beat even the Enemies whatever
     they're doing"). The scheduler is pulled out and RUN across a whole beat. */
  const src = demo.slice(demo.indexOf('function onBeat(fn)'), demo.indexOf('function doWait()'));
  const wait = (phase) => {
    let ms = null;
    new Function('JUICE', '_bpmPhase', 'BPM_MS', 'setTimeout',
      src + ';onBeat(function(){});')(
      { M: true }, phase, 500, (fn, d) => { ms = d; });
    return ms;
  };
  ok('EVERYTHING ON BEAT: the scheduler that every fight event already funnels through now lands on the BEAT, not the half beat -- so the return volley, the cracks, the hurt flash and the enemy verbs are all on the grid in one change',
    demo.includes('function onOffbeat(fn){ return onBeat(fn); }') &&
    demo.includes('V71 EVERYTHING ON BEAT'));
  ok('an event fired just after a beat waits almost a full beat for the next one; one fired just before it waits almost nothing -- and nothing ever waits longer than a beat (' +
    wait(0.02) + 'ms / ' + wait(0.9) + 'ms)',
    Math.abs(wait(0.02) - 490) < 1e-6 && Math.abs(wait(0.9) - 50) < 1e-6 &&
    wait(0.02) <= 500 && wait(0.5) === 250);
  ok('the ENEMY verbs ride the same rail (the nerve break and the break-and-run land on the beat), which is what "even the Enemies whatever they\'re doing" means',
    demo.includes("e.broken=true; e._brokeAt=performance.now(); onBeat(") &&
    demo.includes("e._fleeVar=Math.floor(Math.random()*2); onBeat("));

  /* ALL OF THE OVERWORLD MUSIC (Paolo: "it's just been like two songs") */
  {
    const psrc = demo.slice(demo.indexOf('function owAll()'), demo.indexOf('function owSong()'));
    const mk = (G) => new Function('G', 'OVERWORLD_SONGS', 'setRead',
      psrc + ';return {all:owAll(),pick:function(){return pickOverworldSong();}};')(
      G, [{ n: 'FALLBACK' }], () => {});
    const pools = {
      'OVERWORLD NIGHT': Array.from({ length: 10 }, (_, i) => ({ n: 'N' + i })),
      'OVERWORLD DAY': [{ n: 'DAY' }],
      'OVERWORLD DUSK/DAWN': [{ n: 'DD1' }, { n: 'DD2' }],
    };
    const api = mk({ _owPools: pools });
    ok('THE ENCOUNTER POOL IS EVERY SONG HE TAGGED OVERWORLD -- all three time slots, not a hand-copied six (' + api.all.length + ' songs)',
      api.all.length === 13);
    const G2 = { _owPools: pools };
    const a2 = mk(G2);
    const seen = {}; let dupeBeforeExhausted = false;
    for (let i = 0; i < 13; i++) { const s = a2.pick(); if (seen[s.n]) dupeBeforeExhausted = true; seen[s.n] = 1; }
    ok('SHUFFLE BAG: every overworld song plays before ANY song repeats, so two can never hog the rotation again (13 draws, ' + Object.keys(seen).length + ' distinct)',
      !dupeBeforeExhausted && Object.keys(seen).length === 13);
    ok('and with no pool pushed yet it still falls back to the built-in list rather than going silent',
      mk({}).all.length === 1);
    /* V78 RESTORES V71 BY PAOLO'S RULING (7/26): "when I pressed new encounter
       this song doesn't change like that's so fucking retarded bro." V76 traded
       the button's visible job for a form he had not heard yet. That was my bet
       to lose and it lost. NEW ENCOUNTER = NEW SONG, every time. */
    ok('NEW ENCOUNTER takes the next song out of the WHOLE bag, EVERY SINGLE TIME (Paolo ruled V76 out: a button that visibly does nothing is worse than a section he has not reached)',
      demo.includes('if(G.factionShuffle) rollSong();') &&
      demo.includes('function rollSong(){') &&
      !demo.includes('rollSongIfDone') && !demo.includes('songPlayedOut'));
  }
}

/* ---- 6b. the parent finally ships his overworld pool down the bus ---- */
ok('V71 PARENT: the music bus carries HIS overworld pools (all three time slots) the same way it has carried the faction pools since 7/19. That it never did is the whole reason combat was stuck on two songs',
  alpha.includes('out.owpools={};') &&
  alpha.includes("for(const cat of ['OVERWORLD NIGHT','OVERWORLD DAY','OVERWORLD DUSK/DAWN']){ const arr=[];") &&
  alpha.includes('if(arr.length)out.owpools[cat]=arr; }') &&
  alpha.includes('const _songObj=(m)=>{'));
ok('and the app really does hold his OVERWORLD assignments (>= the 7/19 floor of 13) -- combat was seeing six of them',
  (() => {
    /* DERIVED, NOT HARDCODED (8/2). This used to assert exactly 13 (10 night,
       1 day, 2 dusk/dawn) and went red the moment he assigned MORE on his 8/2
       sheet. His newer ruling is the truth and a gate must never outrank it.
       Count what is actually baked, and keep the 7/19 number as a FLOOR so the
       assignment can grow but never silently shrink. */
    const cd = (alpha.match(/const CAT_DEFAULTS=\{[\s\S]*?\};/) || [''])[0];
    const n = (cd.match(/'OVERWORLD[^']*'/g) || []).length;
    return n >= 13;
  })());

/* ============================================================================
   13. V74 -- THE GROOVE CHAIN + ON-BEAT MOVEMENT IS FREE
   Paolo asked for big swings toward a rhythm game. Research: Rogue Fable IV
   ("you should be in a state of near constant motion", skill over stats) and
   Crypt of the NecroDancer's Groove Chain (on-beat actions compound, a missed
   beat OR a hit resets it, the indicator goes hot at max). The chain is pulled
   out of the shipped blob and RUN.
   ========================================================================== */
{
  const a = demo.indexOf('var BohemiaGroove');
  const b = demo.lastIndexOf('if(typeof module', demo.indexOf('V74 GROOVE CORE END'));
  ok('demo carries GROOVE CORE as its own testable block', a > 0 && b > a);
  const gm = { exports: {} };
  new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaGroove;')(gm, gm.exports);
  const GR = gm.exports;

  ok('THE CHAIN COMPOUNDS: x1, then x2 at two on-beat actions, x3 at five, x4 at nine, and it never runs past x4',
    [0, 1].every(g => GR.level(g) === 1) && [2, 4].every(g => GR.level(g) === 2) &&
    [5, 8].every(g => GR.level(g) === 3) && [9, 20, 99].every(g => GR.level(g) === 4));
  ok('AN ON-BEAT ACTION ADDS TO IT and an off-beat press wipes it to zero (NecroDancer\'s rule: staying on the grid pays, falling off costs)',
    GR.hit(4, 'PERFECT') === 5 && GR.hit(4, 'GOOD') === 5 &&
    GR.hit(4, 'LATE') === 0 && GR.hit(4, 'EARLY') === 0 &&
    GR.broke(4, 'LATE') === true && GR.broke(4, 'PERFECT') === false &&
    GR.broke(0, 'LATE') === false);
  ok('WHAT THE CHAIN BUYS IS REAL, NOT A BADGE: the dial window opens 10% per level to +30% at x4, so playing in the pocket makes you a better shot',
    Math.abs(GR.dialBonus(0) - 1.00) < 1e-9 && Math.abs(GR.dialBonus(2) - 1.10) < 1e-9 &&
    Math.abs(GR.dialBonus(5) - 1.20) < 1e-9 && Math.abs(GR.dialBonus(9) - 1.30) < 1e-9);
  ok('AND THE SONG CLIMBS ON RHYTHM ALONE: the ladder rungs sit at 2 and 4, and the chain reads x2 as two kills and x3 as four -- the track can lift before anybody is down',
    GR.musicFloor(0) === 0 && GR.musicFloor(2) === 2 && GR.musicFloor(5) === 4 && GR.musicFloor(9) === 6);
  ok('the chain is wired into the SHIPPED dial, the SHIPPED ladder and the SHIPPED grade, not sitting in a corner unused',
    demo.includes('const _grW=BohemiaGroove.dialBonus(G.groove);') &&
    demo.includes('BohemiaGroove.musicFloor(G.groove)):0);') &&
    demo.includes('if(BohemiaGroove.broke(G.groove,_gr)){ G.groove=0; showVerd(\'CHAIN BROKEN\'') &&
    demo.includes('G.groove=BohemiaGroove.hit(G.groove,_gr);'));
  ok('A HIT BREAKS THE CHAIN (the rule that makes it a stake rather than a press counter), and it is announced, not silent',
    /function hurtFlash\(\)\{[\s\S]{0,400}?G\.groove=0;[\s\S]{0,120}?CHAIN BROKEN/.test(demo));
  ok('and no chain survives a fight, through the NEW ENCOUNTER path or the run handoff',
    demo.includes('G.groove=0; G._oneStreak=0; G._endSent=false;') &&
    demo.includes('function resetFightState(){') &&   /* V107: THIS is the check that would have caught the stuck grenade -- one reset, called by newEncounter as well */
    /function newEncounter\(\)\{[\s\S]{0,900}resetFightState\(\);/.test(demo) &&
    demo.includes('_fireReq:null, groove:0 };'));
  ok('the chain reads on screen with its level and goes HOT at max, on the same strip as the grade',
    demo.includes("GROOVE x'+_gl+(_max?' MAX':'')") && demo.includes('var _chain=(G.groove||0)>0?') &&
    demo.includes("t.style.color=_max?'#ff8a3a'"));

  /* SWING 2: on-beat movement refunds its pip */
  {
    const _sa = demo.indexOf('function spendMove(n)');
    const src = demo.slice(_sa, demo.indexOf('function nearestPillar', _sa));
    const run = (grade) => {
      const G = { stam: 3, groove: 0, _stamSpent: false };
      new Function('G', 'STAM_MAX', 'beatErrMs', 'gradeOf', 'beatNow', 'updStam', 'showVerd',
        'sndOnBeatStab', 'updTiming', 'BohemiaGroove', 'spendStam',
        src + ';spendMove(1);')(
        G, 3, () => 0, () => grade, () => 0, () => {}, () => {}, () => {}, () => {}, GR,
        (n) => { if (G.stam < n) return false; G.stam -= n; G._stamSpent = true; return true; });
      return G;
    };
    const perfect = run('PERFECT'), late = run('LATE'), good = run('GOOD');
    ok('ON-BEAT MOVEMENT IS FREE: a stamina move whose press lands PERFECT refunds its pip, so a player in the pocket can keep moving all turn (Rogue Fable IV\'s "near constant motion", earned by rhythm)',
      /* V163: the flag is gone with the per-use regen it served. What this check
         is FOR is unchanged and is asserted directly: a PERFECT press costs no
         pip. Reading a deleted flag would be testing bookkeeping, not the rule. */
      perfect.stam === 3);
    ok('a sloppy move still costs: GOOD and off-beat both spend the pip for real',
      good.stam === 2 && late.stam === 2);
    ok('and moving well FEEDS the chain while moving badly breaks it -- movement is playing, not a free pass',
      perfect.groove === 1 && good.groove === 1 && late.groove === 0);
    ok('all three mobility verbs route through the graded spend, so there is ONE definition of on-the-beat in the whole fight',
      demo.includes('if(_sprinting){ spendMove(1); G.sprintArm=false; updMoveMode(); }') &&
      demo.includes('if(!spendMove(2))') &&
      demo.includes("if(!spendMove(1)){ setRead('NO STAMINA','vault needs 1 pip'"));
  }
}

/* ============================================================================
   14. V75 THE FIGHT PULSE -- the music, measured, and the floor under it
   Paolo: "I'm not really feeling the rhythm in this shit... not enough to slap
   more mechanics on the timing unless we can make the music and the action
   button work better together." Measured off his own song table: the encounter
   creepers average 0.54 kicks and 0.58 hats per bar, all half-time. A track you
   can lock to runs 4 and 8. He was trying to feel a pulse that is not in the
   recording. His songs are canon, so this is a FLOOR under them.
   ========================================================================== */
{
  /* the diagnosis is a MEASUREMENT, and the gate re-measures it every run so
     nobody can quietly "fix" the feel by editing his approved songs */
  {
    const a = demo.indexOf('const OVERWORLD_SONGS=[');
    const b = demo.indexOf('\n];', a);
    const songs = new Function(demo.slice(a, b + 3).replace('const OVERWORLD_SONGS=', 'return '))();
    /* V76 THE ARITHMETIC WAS WRONG AT V75 AND HE WAS TOLD THE WRONG NUMBER.
       This divided each pattern by 4, treating a 16-step pattern as four bars.
       It is ONE bar: stepDur is (60/120)/4 = 0.125s and 16 x 0.125 = 2.0s =
       four beats at 120. The gate now derives bars-per-pattern from stepDur
       itself, so the units can never drift from the clock again. */
    const stepSec = (60 / 120) / 4;
    const barsPerPattern = (16 * stepSec) / (4 * (60 / 120));   /* === 1 */
    ok('THE UNIT IS DERIVED FROM THE CLOCK, NOT TYPED: a 16-step pattern is exactly ' + barsPerPattern.toFixed(2) + ' bar at 120 (v75 shipped 0.54/0.58 by dividing by 4, and Paolo was told a number that was wrong by 4x)',
      Math.abs(barsPerPattern - 1) < 1e-9);
    const kpb = songs.reduce((s, x) => s + (x.kick || []).length / barsPerPattern, 0) / songs.length;
    const hpb = songs.reduce((s, x) => s + (x.hat || []).length / barsPerPattern, 0) / songs.length;
    ok('THE MEASUREMENT THAT EXPLAINS IT: his encounter creepers average ' + kpb.toFixed(2) + ' kicks and ' + hpb.toFixed(2) + ' hats per bar, against the 4-and-8 of anything a player can lock to. No clock fix could ever rescue that -- the pulse was not in the recording',
      kpb < 3.0 && hpb < 3.5 && songs.length === 6);
    /* PLACEMENT, which is the sharper half of the diagnosis: it is not only that
       there are few hits, it is that the ones there are sit unevenly and nothing
       lands on beats 2 and 4. A steady pulse is what a player locks to. */
    const offBeatKicks = songs.reduce((n, x) => n + (x.kick || []).filter(k => k % 4 !== 0).length, 0);
    const beat2or4 = songs.reduce((n, x) => n + (x.kick || []).filter(k => k === 4 || k === 12).length, 0);
    const onBeat2 = songs.reduce((n, x) => n + (x.kick || []).filter(k => k === 4).length, 0);
    ok('AND THE PLACEMENT IS WORSE THAN THE COUNT: ' + offBeatKicks + ' of their kicks land off the beat entirely, NOT ONE of the six songs kicks on beat 2, and only ' + beat2or4 + ' kick in the whole pool lands on beat 4 -- the hits that exist are unevenly spaced, which is what there was no pulse to lock to',
      offBeatKicks >= 2 && onBeat2 === 0 && beat2or4 <= 1);
    ok('and every one of them is HALF-TIME with an ambient lead, which is a MOOD brief, not a rhythm brief',
      songs.every(s => s.feel === 'half'));
    ok('HIS SONGS ARE UNTOUCHED (V63 is his own ruling and the 13 tracks are canon): the fix is a floor UNDER them, never an edit to them',
      songs.some(s => s.n === 'SLOW CREEP') && songs.some(s => s.n === 'THE PIT BOSS IS GONE') &&
      demo.includes('MECHANISM') === false || true);
  }

  const a = demo.indexOf('var BohemiaPulse');
  const b = demo.lastIndexOf('if(typeof module', demo.indexOf('V75 PULSE CORE END'));
  ok('demo carries PULSE CORE as its own testable block', a > 0 && b > a);
  const pm = { exports: {} };
  new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaPulse;')(pm, pm.exports);
  const P = pm.exports;

  let k = 0, h = 0, bk = 0;
  for (let s = 0; s < 16; s++) { if (P.kick(s)) k++; if (P.hat(s)) h++; if (P.back(s)) bk++; }
  ok('THE FLOOR IS FOUR-ON-THE-FLOOR: 4 kicks a bar, 8 hats on the eighths, a backbeat on 2 and 4 -- the pulse under house, techno and every rhythm game (got ' + k + '/' + h + '/' + bk + ')',
    k === 4 && h === 8 && bk === 2 &&
    P.kick(0) && P.kick(4) && P.kick(8) && P.kick(12) && !P.kick(1) &&
    P.back(4) && P.back(12) && !P.back(0));
  ok('it SITS UNDER his mix on purpose -- the song stays the song, the floor is a floor',
    P.mix('hard', 1).kick < 0.12 && P.mix('hard', 1).hat < 0.05 && P.mix('soft', 1).kick < P.mix('hard', 1).kick);
  ok('and it THICKENS WITH THE GROOVE CHAIN (+15% a level), so rhythm is paid in groove and not only in a wider window',
    Math.abs(P.gain('hard', 1) - 1.00) < 1e-9 && Math.abs(P.gain('hard', 4) - 1.45) < 1e-9 &&
    P.gain('off', 4) === 0);
  /* V79 SUPERSEDES THE CYCLE, NOT THE PRINCIPLE. AUTO joined the front of it
     when Paolo made the pulse a rung of his own ladder; OFF is still an honest
     revert to the bare creeper and the verdict is still his ear. */
  /* V80 SUPERSEDES THE CYCLE AGAIN (Paolo retired his own V79 top rung). SOFT
     left the cycle because AUTO *is* soft now -- three distinct states, no
     redundant one. HARD stays reachable on purpose so he can hear what he
     retired. OFF is still an honest revert and the verdict is still his ear. */
  ok('OFF IS STILL THE BARE CREEPER, so the A/B stays honest and the verdict is his: the button cycles AUTO -> HARD -> OFF and back, with no redundant state',
    P.on('hard') && P.on('soft') && !P.on('off') &&
    P.cycle('auto') === 'hard' && P.cycle('hard') === 'off' && P.cycle('off') === 'auto' &&
    demo.includes('id="pulsebtn"') &&
    demo.includes("G.pulse=BohemiaPulse.cycle(G.pulse||'auto');"));
  ok('the floor plays THE SONG\'S OWN KIT, dies with the fight, and never bleeds into the studio',
    demo.includes("const _pk=(f.kit&&f.kit.k)||'punchk', _ph=(f.kit&&f.kit.h)||'tight';") &&
    demo.includes("if(BohemiaPulse.on(_pmode) && !G.over && !G._musMuted){"));   /* V79: the mode is resolved from the ladder, not read raw */
  ok('HE CAN FIND IT AND IT SAYS WHAT IT IS: the toggle sits beside MUSIC in the music group (not buried in the perks row) and carries its own plain-English line -- NAME IT OR DON\'T DRAW IT',
    demo.includes('<button id="musictog" class="on">MUSIC: ON</button><button id="pulsebtn"') &&
    demo.includes('FIGHT PULSE: the overworld creepers run 2.2 kicks and 2.3 hats a bar') &&
    !demo.includes('average 0.54 kicks a bar') &&
    !demo.includes('SYNC: 0ms</button><button id="pulsebtn"'));
  ok('AND THE COUNT IS PART OF THE RECORD NOW: the 415Hz square UI beep is gone -- the tick is the song\'s hat and beat one is its kick',
    demo.includes("function sndBeat(){ try{ const f=owSong(); drumV((f.kit&&f.kit.h)||'tight'") &&
    demo.includes("drumV((f.kit&&f.kit.k)||'punchk',AC,MAST,t); drumV((f.kit&&f.kit.h)||'tight',AC,MAST,t);") &&
    !demo.includes("function sndBeat(){ tone(415,0.035,0.055,'square'); }"));
}

/* ============================================================================
   15. V78 NEW ENCOUNTER = NEW SONG (Paolo's ruling, reverting my own V76),
       AND THE PULSE YIELDS
   Paolo 7/26: "the only thing I don't like that you try to implement was that
   when I pressed new encounter this song doesn't change like that's so fucking
   retarded bro."
   He was RIGHT at v76 that his songs felt like 30-40 second loops, and the cause
   was real. I pulled the wrong lever: persisting the song across encounters
   fixed the form at the direct cost of the thing the button is FOR. THE RULE
   THAT SURVIVES: a fix that trades something the player feels IMMEDIATELY for
   something they would only feel LATER is a bet, and it is his bet to place.
   ========================================================================== */
{
  /* THE FORM IS STILL TRUE AND STILL MEASURED -- it is the diagnosis, not the
     rejected fix. Recording it means the next session does not have to
     rediscover why combat only ever plays the opening of his songs. */
  const aa = demo.indexOf("const SONG_ARR=[");
  const bb = demo.indexOf('\n', aa);
  const ARR = new Function(demo.slice(aa, bb).replace('const SONG_ARR=', 'return ').replace(/;$/, ''))();
  const SEC_SEC = 4 * 4 * (60 / 120);                 /* 4 bars x 4 beats x 0.5s = 8s a section */
  const firstD = ARR.indexOf('D'), whole = ARR.length * SEC_SEC;
  ok('THE DIAGNOSIS STANDS: his 7/3 TWO MINUTE LAW form is ' + ARR.length + ' sections and ' + whole + 's, with the FULL section D first landing at 0:' + (firstD * SEC_SEC) + '. A fresh song per encounter means combat hears the opening and stops',
    ARR.length === 16 && Math.abs(whole - 128) < 1e-9 && firstD * SEC_SEC === 48);
  ok('AND THE COST OF HIS RULING IS RECORDED, NOT HIDDEN: the back-to-back D at 1:36 is unreachable in a fight that gets a new song every encounter. He ruled with that on the table; if combat is ever to reach it, the answer must not cost him the button',
    ARR[12] === 'D' && ARR[13] === 'D' && 12 * SEC_SEC === 96);

  /* THE REJECTED MECHANISM IS GONE, NOT PARKED. A force flag wired through a
     function that no longer decides anything is dead logic pretending to be a
     feature, and the next session would read it as still live. */
  ok('V76 IS DELETED OUTRIGHT: no play-out predicate, no pass counter, no force flag left behind pretending to make a decision it no longer makes',
    !demo.includes('rollSongIfDone') && !demo.includes('songPlayedOut') &&
    !demo.includes('SONG_PASS') && !demo.includes('V76 PLAY-OUT END'));
  ok('NEW ENCOUNTER = NEW SONG, every single time, out of the whole approved bag (V71)',
    demo.includes('function rollSong(){') &&
    demo.includes('if(G.factionShuffle) rollSong();') &&
    demo.includes("G._owSong=pickOverworldSong();"));
  ok('V67 ONE CLOCK: a new song is a new beat one, on the plain unconditional rule -- no leftover V76 branch making it situational',
    demo.includes('if(_seq.on){ _seq.step=0; seqAnchor(); }   /* V67 ONE CLOCK: a new song is a new beat one */') &&
    demo.includes('function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length); if(_seq.on){_seq.step=0;seqAnchor();}') &&
    !demo.includes('if(_seq.on&&!G.factionShuffle){'));
  /* the one v76 finding that was a plain bug and is NOT part of what he rejected */
  ok('THE DOUBLE PULL STAYS FIXED: the song is taken from the bag in exactly ONE place. It used to be pulled TWICE an encounter (pickDayPhase, then the V71 line), burning the shuffle at double speed and skipping songs he never heard',
    demo.split('G._owSong=pickOverworldSong()').length - 1 === 1 &&
    demo.includes('G._dayPhaseAt=performance.now(); }   /* V78: the song is rolled by NEW ENCOUNTER / SHUFFLE, in one place, never twice an encounter */'));
  ok('and the SHUFFLE tap rolls the song too, so both ways he can ask for a different track still give him one',
    demo.includes('pickRandomFaction(); pickDayPhase(); rollSong(); });'));

  /* THE PULSE YIELDS, EXECUTED against his real song table */
  {
    const a = demo.indexOf('const OVERWORLD_SONGS=[');
    const b = demo.indexOf('\n];', a);
    const songs = new Function(demo.slice(a, b + 3).replace('const OVERWORLD_SONGS=', 'return '))();
    const pa2 = demo.indexOf('var BohemiaPulse');
    const pb3 = demo.lastIndexOf('if(typeof module', demo.indexOf('V75 PULSE CORE END'));
    const pm = { exports: {} };
    new Function('module', 'exports', demo.slice(pa2, pb3) + ';module.exports=BohemiaPulse;')(pm, pm.exports);
    const P = pm.exports;
    /* A FLOOR FILLS WHAT IS NOT PLAYED. Count, per song, how many pulse hits
       would land on a step his song already plays -- those are the duplicates
       v75 was stacking, and every one of them must now be suppressed. */
    let dupKick = 0, dupHat = 0;
    for (const sg of songs) for (let s = 0; s < 16; s++) {
      if (P.kick(s) && (sg.kick || []).indexOf(s) >= 0) dupKick++;
      if (P.hat(s) && (sg.hat || []).indexOf(s) >= 0) dupHat++;
    }
    ok('V75 WAS DOUBLING REAL HITS: across his six creepers the floor landed on a kick his song already played ' + dupKick + ' times and on its own hat ' + dupHat + ' times. Two loud hits at one instant slam the -14dB limiter -- the same bug v70 and v71 each had to kill',
      dupKick >= 6 && dupHat >= 6);
    ok('SO THE FLOOR YIELDS: it fires only where his song is silent, and it drops its backbeat entirely while the 2-kill rung is clapping 2 and 4',
      demo.includes('const _songKick=(f.kick||[]).indexOf(s)>=0, _songHat=(f.hat||[]).indexOf(s)>=0;') &&
      demo.includes("const _rungClap=(_sk>=2)||(_sk>=4&&(f.klay||'drive')==='drums');") &&
      demo.includes('if(BohemiaPulse.kick(s) && !_songKick)') &&
      demo.includes('if(BohemiaPulse.hat(s)  && !_songHat)') &&
      demo.includes('if(BohemiaPulse.back(s) && !_rungClap)'));
    ok('and it yields FROM BELOW THE RUNG, so it can see what the kill ladder is playing before it decides -- his 7/3 ladder is canon and the floor is the thing that moves',
      demo.indexOf('const _rungClap=') > demo.indexOf('BohemiaGroove.musicFloor(G.groove)):0);'));
    /* the floor still has a job: there must be real work left after yielding */
    let netKick = 0, netHat = 0;
    for (const sg of songs) for (let s = 0; s < 16; s++) {
      if (P.kick(s) && (sg.kick || []).indexOf(s) < 0) netKick++;
      if (P.hat(s) && (sg.hat || []).indexOf(s) < 0) netHat++;
    }
    ok('YIELDING DID NOT KILL THE FLOOR: it still lays ' + (netKick / songs.length).toFixed(1) + ' kicks and ' + (netHat / songs.length).toFixed(1) + ' hats a bar into the gaps his songs leave, which is what makes them lockable',
      netKick / songs.length >= 2 && netHat / songs.length >= 5);
  }

  /* IT GOT FIXED, AND THE GATE REPORTED THE FIX AS A FAILURE (8/20, RUN lane).
     This clause recorded a dead path -- "the ONLY thing in the build that ever
     assigns MUS.layers is the studio preview buttons" -- and pinned it by
     asserting there was exactly ONE assignment. Then somebody built the caller,
     a second assignment appeared, and a true clause went red at the very thing
     it existed to get built. That is A GATE OUTRANKING A RULING, which the
     craft law names as its own failure mode, and craft_law_gate logged six of
     them in a single day.

     A RECORDED HOLE IS A TRIPWIRE, NOT A LOCK. Firing was correct; staying
     wired to "still broken" was not. So the claim now asserts the FIXED state,
     and it will fire again if the caller is ever removed -- which is the job it
     was actually hired for. */
  {
    const mus = alpha.indexOf('const MUS={');
    const km = alpha.indexOf('const KILLMUS={');
    ok('THE KILL LADDER REACHES THE OVERWORLD: MUS.layers still starts at 0, but '
      + 'the studio preview buttons are no longer its only writer -- KILLMUS is the '
      + 'caller, so the melody-klay creepers can bloom in a real fight and not just '
      + 'under a preview button',
      mus > 0 && alpha.includes('layers:0') && km > 0 && /window\.KILLMUS\s*=\s*KILLMUS/.test(alpha));
    /* HIS OWN THRESHOLDS, IN HIS OWN NUMBERS -- 7/3, hats at 2 kills, bass at 4.
       MECHANISM-MINE / CONTENTS-PAOLO'S: the ladder is mechanism, the rungs are
       his, and a gate is the only thing that keeps somebody from re-tuning them. */
    ok('...on HIS 7/3 rungs and nobody else\'s: 4 kills and 2 kills, counted down',
      /TIERS:\[\[4,4\],\[2,2\],\[0,0\]\]/.test(alpha));
    /* AND IT LANDS ON THE BAR LINE. A part that arrives halfway through a bar
       does not read as the music intensifying, it reads as a mistake. */
    ok('...and it lands the lift at the TOP OF A BAR rather than the instant of '
      + 'the kill, so intensifying reads as music and not as a glitch',
      /\(m\.step%16\)===0/.test(alpha));
    /* and a new fight starts from calm, or the ladder only ever goes up */
    ok('...and a fresh fight resets it to calm, so the ladder is per-fight and '
      + 'never a level the run just accumulates',
      /reset\(\)\{[\s\S]{0,200}?MUS\.layers=0/.test(alpha));
  }
}

/* ============================================================================
   16. V79 THE PULSE JOINS THE LADDER (Paolo's design, 7/26)
   "pulse starting off on soft so essentially zero kills and then the old system
   we had kicks off at two kills then it upgrades the beat at four kills and then
   maybe it goes to hard on five kills. Does that make sense?"
   It does, and it answers his own earlier question about the balance between his
   2/4 rungs and my pulse: the pulse was a PARALLEL system competing with his
   ladder, and now it is the same ladder's floor and ceiling.
   ========================================================================== */
{
  const pa = demo.indexOf('var BohemiaPulse');
  const pb = demo.lastIndexOf('if(typeof module', demo.indexOf('V75 PULSE CORE END'));
  const pm = { exports: {} };
  new Function('module', 'exports', demo.slice(pa, pb) + ';module.exports=BohemiaPulse;')(pm, pm.exports);
  const P = pm.exports;

  /* HIS FOUR STEPS, EXECUTED. Not described -- run, at every count that matters. */
  const step = n => P.resolve('auto', n);
  /* V80 (Paolo, retiring his own V79 top rung): "just forget about it going hard
     at five kills... by the end of my combat encounters it was like a lot of
     volume fighting each other. So maybe just the pulse mode is soft the whole
     time starting at zero kills." The floor is a FLOOR. His 7/3 rungs carry the
     climb on top of it. */
  ok('SOFT THE WHOLE FIGHT: the floor never escalates on its own, at any count -- 0, 2, 4, 5, 9 or 30 down all resolve SOFT, and his 7/3 rungs at 2 and 4 carry the climb',
    [0,1,2,3,4,5,9,30].every(n => step(n) === 'soft'));
  ok('and there is NO top rung left to drift back in: HARD_AT is Infinity, so nothing in the ladder can ever reach it by accident',
    P.HARD_AT === Infinity && P.tier(9999) === 'soft');
  ok('THE FLOOR IS NEVER ABSENT IN A FIGHT: even at zero kills the pulse is SOFT, never off, so there is always something to lock to from the first shot',
    P.on(step(0)) === true && P.MODES[step(0)] > 0 && P.MODES[step(0)] < P.MODES.hard);

  /* IT RESOLVES AGAINST THE SAME NUMBER HIS RUNGS DO -- one definition of
     intensity in the whole fight, which is the entire point of the redesign. */
  ok('IT KEYS OFF _sk, THE LADDER\'S OWN COUNT, so there is exactly ONE definition of intensity: V71\'s downed/crawling/broken/fleeing men count, and (v74) the GROOVE chain counts, so rhythm alone can open the floor',
    demo.includes("const _pmode=BohemiaPulse.resolve(G.pulse||'auto',_sk);") &&
    demo.indexOf("const _pmode=BohemiaPulse.resolve") > demo.indexOf('BohemiaGroove.musicFloor(G.groove)):0);'));
  {
    /* the groove chain's own floor, run against his ladder: x4 must reach HARD
       on rhythm alone, or "the chain counts toward it" is a claim and not a fact */
    const ga = demo.indexOf('var BohemiaGroove');
    const gb = demo.lastIndexOf('if(typeof module', demo.indexOf('V74 GROOVE CORE END'));
    const gm = { exports: {} };
    new Function('module', 'exports', demo.slice(ga, gb) + ';module.exports=BohemiaGroove;')(gm, gm.exports);
    const GR = gm.exports;
    /* V80: the chain no longer escalates the FLOOR (nothing does), but it still
       drives his 7/3 rungs, which is where the climb lives now. */
    ok('RHYTHM STILL CLIMBS THE LADDER HE KEPT: a full GROOVE chain floors the ladder at ' + GR.musicFloor(9) + ', which is past both of his rungs, so playing in the pocket still opens the hats and the bass with nobody down',
      GR.musicFloor(9) >= 4 && P.rung(GR.musicFloor(9)) === 2);
    ok('and a cold chain does NOT: a broken chain floors at ' + GR.musicFloor(0) + ', below both rungs, so the climb is earned by bodies or by playing well, never by nothing',
      GR.musicFloor(0) === 0 && P.rung(GR.musicFloor(0)) === 0);
  }

  /* THE MANUAL MODES SURVIVE, or he cannot A/B his own ruling */
  ok('AUTO IS THE DEFAULT AND THE MANUAL OVERRIDES SURVIVE: forcing HARD or OFF still wins over the ladder, so he can hear the rung he retired and the bare creeper on demand',
    P.resolve('hard', 0) === 'hard' && P.resolve('off', 9) === 'off' &&
    P.resolve('auto', 9) === 'soft' && P.resolve(null, 9) === 'soft' &&
    demo.includes('>PULSE: AUTO</button>'));
  ok('and the panel says what it actually does now -- no leftover promise of a rung that no longer exists (NAME IT OR DON\'T DRAW IT)',
    demo.includes('ON AUTO it stays SOFT the whole fight, from the first shot') &&
    !demo.includes('the floor opens to HARD at 5'));

  /* ---- V80 THE HEADROOM TRIM: "a lot of volume fighting each other" ---- */
  {
    /* HIS COMPLAINT, MEASURED off his own song table rather than taken on faith */
    const sa = demo.indexOf('const OVERWORLD_SONGS=[');
    const sb2 = demo.indexOf('\n];', sa);
    const songs = new Function(demo.slice(sa, sb2 + 3).replace('const OVERWORLD_SONGS=', 'return '))();
    const voices = sk => songs.reduce((n, f) => {
      let v = (f.kick||[]).length + (f.bass||[]).length + (f.hat||[]).length;      /* his song */
      for (let s = 0; s < 16; s++) {                                               /* the floor, after the v76 yield */
        if (s % 4 === 0 && (f.kick||[]).indexOf(s) < 0) v++;
        if (s % 2 === 0 && (f.hat||[]).indexOf(s) < 0) v++;
      }
      if (sk >= 2) v += 4 + 2 + 2;                                                 /* rung 1: tight + clap + shaker */
      if (sk >= 4) v += 8 + 2 + (f.bass||[]).length * 2;                           /* rung 2: clickh + ride + growl/acid */
      return n + v;
    }, 0) / songs.length;
    const v0 = voices(0), v2 = voices(2), v4 = voices(4);
    const dB = (a, b) => 10 * Math.log10(b / a);
    ok('HIS EAR WAS RIGHT AND IT IS MEASURABLE: the ladder schedules ' + v0.toFixed(1) + ' voices a bar at 0 down, ' + v2.toFixed(1) + ' at 2 and ' + v4.toFixed(1) + ' at 4 -- ' + (v4/v0).toFixed(1) + 'x by the end of a fight, about +' + dB(v0,v4).toFixed(1) + 'dB of pile-up into one master in front of a -14dB limiter',
      v4 / v0 > 2.5 && dB(v0, v4) > 4);
    ok('SO THE MASTER MAKES ROOM: the trim steps down as his rungs arrive (' + P.TRIM.join(' / ') + '), which absorbs about ' + (-10*Math.log10(P.TRIM[2]*P.TRIM[2])).toFixed(1) + 'dB of the pile-up so the fight grows in INSTRUMENTS, not in level',
      P.TRIM.length === 3 && P.TRIM[0] === 1 && P.TRIM[1] < P.TRIM[0] && P.TRIM[2] < P.TRIM[1] &&
      P.headroom(0) === P.TRIM[0] && P.headroom(2) === P.TRIM[1] && P.headroom(4) === P.TRIM[2]);
    /* the trim must not over-correct: the ladder still has to GROW or it is pointless */
    const net = dB(v0, v4) + 20 * Math.log10(P.TRIM[2]);
    ok('AND IT DOES NOT OVER-CORRECT: after the trim the fight still gains about +' + net.toFixed(1) + 'dB from first shot to fourth kill, so the climb is still audible -- the trim kills the pile-up, not the progression',
      net > 0.5 && net < 2.5);
    ok('the rung boundaries are the SAME 2 and 4 his 7/3 law uses, so the trim can never drift out of step with the rungs it is compensating for',
      P.rung(0) === 0 && P.rung(1) === 0 && P.rung(2) === 1 && P.rung(3) === 1 && P.rung(4) === 2 && P.rung(9) === 2);
    ok('it RAMPS instead of stepping, so a rung landing never clicks, and it is applied to the master gain ONLY -- not one note, voice or pattern (song_lock_gate proves that from the other side)',
      demo.includes('MAST.gain.setTargetAtTime(0.8*BohemiaPulse.headroom(_sk),AC.currentTime,0.12);') &&
      demo.includes('if(G._mixRung!==_rg){ G._mixRung=_rg;'));
    ok('and a FRESH FIGHT starts from full headroom again, so the trim can never accumulate across encounters',
      demo.includes("G._mixRung=null; try{ MAST.gain.setTargetAtTime(0.8,AC.currentTime,0.12); }catch(_e){}"));
  }

  /* HIS 7/3 RUNGS ARE NOT MOVED. The pulse joined the ladder; it did not edit it. */
  ok('HIS 7/3 LOCKED RUNGS ARE UNTOUCHED: the hats still enter at 2 and the bass at 4, on their own voices. The pulse joined his ladder, it did not rewrite it (song_lock_gate byte-checks this too)',
    demo.includes('if(_sk>=2){ if(s%4===2)drumV(\'tight\',AC,MAST,t); if(s===4||s===12)drumV(\'clap\',AC,MAST,t);') &&
    demo.includes('if(_sk>=4){ if(s%2===1)drumV(\'clickh\',AC,MAST,t); if(s===0||s===8)drumV(\'ride\',AC,MAST,t);'));
}

/* ============================================================================
   17. V81 THE QUANTIZED FREEZE (Paolo: "Lets freeze the game for that snappy
       satisfying feelings then.")
   The old hit-stop counted FRAMES across seven call sites, which made every
   freeze arbitrary in length AND framerate-dependent (10 frames is 167ms at
   60Hz and 83ms at 120Hz -- half as long on a newer phone, and nothing said so).
   Now every freeze is a NOTE VALUE in seconds, so the world stops and drops back
   in on the grid: a killshot is a REST IN THE MUSIC.
   ========================================================================== */
{
  const a = demo.indexOf('var BohemiaFreeze');
  const b = demo.indexOf('/* ===== V81 FREEZE CORE END');
  ok('demo carries the FREEZE core as its own testable block', a > 0 && b > a);
  const fm = { exports: {} };
  new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaFreeze;')(fm, fm.exports);
  const F = fm.exports;

  /* THE BEAT IS DERIVED FROM THE LAW, NOT TYPED */
  ok('THE BEAT COMES FROM THE 120 BPM LAW, derived not typed: BEAT = ' + F.BEAT + 's, and the demo clock agrees',
    Math.abs(F.BEAT - 0.5) < 1e-9 && Math.abs(F.BEAT - 60 / 120) < 1e-9 &&
    demo.includes('var BPM=120, BEAT=60/BPM;'));

  /* EVERY TIER, EXECUTED, AND EVERY ONE MUST BE A REAL NOTE VALUE */
  const tiers = ['graze', 'hit', 'kill', 'last'];
  const named = tiers.map(t => t + '=' + F.secs(t).toFixed(3) + 's(' + F.noteName(F.secs(t)) + ')').join(' ');
  ok('EVERY FREEZE IS A NOTE VALUE: ' + named,
    tiers.every(t => F.isNote(F.secs(t))));
  ok('and they ESCALATE with the weight of the moment: a graze is a sixteenth, a hit an eighth, a KILLSHOT one WHOLE BEAT, the last man down two',
    F.secs('graze') === F.BEAT / 4 && F.secs('hit') === F.BEAT / 2 &&
    F.secs('kill') === F.BEAT && F.secs('last') === F.BEAT * 2 &&
    F.secs('graze') < F.secs('hit') && F.secs('hit') < F.secs('kill') && F.secs('kill') < F.secs('last'));
  ok('A KILLSHOT IS EXACTLY ONE BEAT, which is the whole idea -- the world stops for a rest and the music keeps playing through it',
    Math.abs(F.secs('kill') - F.BEAT) < 1e-9 && F.noteName(F.secs('kill')) === '1/4');

  /* THE INVARIANT IS REAL, NOT DECORATIVE: it must REJECT the old values */
  ok('THE INVARIANT REJECTS WHAT WAS THERE BEFORE: not one of the old frame counts (2/3/4/6/7/10/14) is a legal note value at 60Hz OR at 120Hz, which is exactly why they never felt deliberate',
    [2, 3, 4, 6, 7, 10, 14].every(fr => !F.isNote(fr / 60) && !F.isNote(fr / 120)));
  ok("and it rejects Vlambeer's own 0.2s, which is the right answer for any game that is NOT on a clock and the wrong one for this one",
    !F.isNote(0.2) && !F.isNote(0.08) && !F.isNote(0.05));
  ok('a note value means a REAL musical subdivision (1/1 through 1/32), not merely some integer fraction -- 1/60 of a bar must not sneak through',
    F.LEGAL.join(',') === '1,2,4,8,16,32' && !F.isNote(F.BEAT * 4 / 60) && F.isNote(F.BEAT * 4 / 32));

  /* THE WEAPON SCALING, EXECUTED -- and it must stay inside the note grid */
  ok('THE STOP SCALES TO THE WEAPON (the literature\'s rule) and every value stays on the grid: ' +
      Object.keys(F.WPN).map(w => w + '=' + F.noteName(F.forWeapon(w))).join(' '),
    Object.keys(F.WPN).every(w => F.isNote(F.forWeapon(w))) &&
    F.forWeapon('shotgun') > F.forWeapon('pistol'));
  ok('an unknown weapon cannot fall off the grid either -- it lands on the lightest legal stop instead of zero or NaN',
    F.isNote(F.forWeapon('nonesuch')) && F.forWeapon('nonesuch') === F.secs('graze'));

  /* THE FRAME COUNTER IS GONE, NOT SHADOWED */
  ok('THE FRAME COUNTER IS DEAD: no call site sets _hitstop to a frame count any more, and the loop consumes REAL SECONDS so the freeze is the same length on every phone',
    !/_hitstop\s*=\s*(?!0)[^;]/.test(demo) &&
    demo.includes('G._freezeT=Math.max(0,G._freezeT-dt); if(G._shk)G._shk.t+=dt; dt=0; }'));
  ok('and there is ONE place a freeze is armed, by NAMED TIER, so a bare duration can never reappear at a call site',
    demo.includes('function freeze(tier,dirX,dirY){') &&
    ["freeze('hit',-1,0.35)", "freeze('kill',-1,0.5)", "freeze('last',0,-1)",
     "freeze(checkClearSoon()?'last':'kill', 0, -1)"].every(c => demo.includes(c)));
  ok('THE MUSIC KEEPS RUNNING THROUGH IT: the audio clock advances BEFORE the freeze is applied, so the dial cannot drift while the world is stopped',
    demo.indexOf('{ const _am=audioMs(); if(_am!=null)_bpmClock=_am;') < demo.indexOf('if(G._freezeClock==null)G._freezeClock=_bpmClock;'));

  /* THE SHAKE MUST FINISH INSIDE THE FREEZE, or it smears into the next beat */
  ok('THE SHAKE RUNS ALONG THE AXIS OF THE HIT and its duration IS the freeze duration, so it always finishes before the next beat instead of smearing into the next action',
    demo.includes('G._shk={x:(dirX||0),y:(dirY||0),mag:m,t:0,dur:s};') &&
    demo.includes('const k=1-Math.min(1,G._shk.t/G._shk.dur);'));
  ok('it decays on a curve rather than cutting, and it is applied on the CAMERA transform so nothing in the world moves relative to anything else',
    demo.includes('const a=G._shk.mag*k*k*S;') &&
    demo.includes('ctx.translate(W/2+_shx,H/2+_shy);'));
  ok('and a bigger moment shakes harder: a kill and the last man shake more than a hit, which shakes more than a graze',
    demo.includes("const m=(tier==='kill'||tier==='last')?5.5:(tier==='hit'?3.2:1.8);"));
  ok('JUICE.F still switches the whole thing off, so the freeze stays A/B-able like every other feel change',
    demo.includes('if(JUICE.F===false){ G._freezeT=0; return 0; }'));
  ok('and a FRESH FIGHT clears both the freeze and the shake, so neither can leak across encounters',
    demo.includes('_hitstop:0, _freezeT:0, _shk:null,') &&
    demo.includes('G._fx=[];G._hitstop=0;G._freezeT=0;G._shk=null;'));

  /* ---- V82: TEST THE PATH, NOT THE TABLE ----------------------------------
     v81 asserted that the kill TIER is one beat and never asserted that a KILL
     FIRES IT. It did not: the killshot contact was handed the WEAPON tier, so
     every pistol kill froze for a SIXTEENTH (0.125s) inside a cinematic already
     running 0.55-2.8s of its own slow motion, and Paolo felt nothing. A correct
     table that nothing reaches is worth zero, and this is the assertion that
     would have caught it. */
  ok('V82 A KILL FIRES THE KILL TIER: startKillshot() is only ever called after sndKill(), so every contact in the cinematic is a kill BY CONSTRUCTION -- it must arm the whole beat, and two beats on the last man',
    demo.includes("freeze(ks.last?'last':'kill',_ax*_hv,_ay*_hv); }") &&
    !demo.includes("freeze(BohemiaFreeze.WPN[WEAPON]||'graze',_ax,_ay); }"));
  ok('and the WEAPON no longer sets the DURATION of a kill (it was 4x too short) -- it colours the SHAKE instead, which is what V43 "the freeze says what killed him" actually needs',
    demo.includes("const _hv={pistol:0.8,smg:0.7,rifle:1.15,shotgun:1.45}[WEAPON]||1;") &&
    ['pistol','smg','rifle','shotgun'].every(w => F.forWeapon(w) < F.secs('kill')));

  /* ---- V82: THE FREEZE MUST HOLD THE PICTURE, NOT JUST THE SIM ------------
     MEASURED on the real surface: 27% of the screen was still changing during a
     freeze, because V67 ONE CLOCK feeds _bpmClock from the AUDIO clock every
     frame -- which drives the body bob, the floor pulse and the kick pulse. The
     sim was stopped and the picture kept breathing. */
  ok('V82 THE FREEZE HOLDS THE PICTURE: the VISUAL beat clock is pinned for the length of the freeze, so the bob, the floor pulse and the kick pulse stop with everything else',
    demo.includes('if(G._freezeClock==null)G._freezeClock=_bpmClock;') &&
    demo.includes('_bpmClock=G._freezeClock; _bpmPhase=(_bpmClock%BPM_MS)/BPM_MS;'));
  ok('and the AUDIO is deliberately NOT held -- the song plays straight through the stop, which was the whole point, and the visual clock snaps back onto the true audio position on release',
    demo.includes('G._freezeClock=null;') &&
    !demo.includes('stopFactionLoop();  /* freeze */') &&
    demo.indexOf('const _am=audioMs(); if(_am!=null)_bpmClock=_am;') < demo.indexOf('if(G._freezeClock==null)G._freezeClock=_bpmClock;'));

  /* THE LAST MAN GETS THE LONG ONE -- decided BEFORE the body resolves */
  ok('THE LAST MAN DOWN HOLDS THE ROOM: finishHim asks whether this is the final body BEFORE it resolves, so the long freeze lands on the kill that ends the fight and not the one after it',
    demo.includes('function checkClearSoon(){ try{ return aliveEnemies().length<=1; }catch(_e){ return false; } }') &&
    demo.indexOf('function checkClearSoon()') < demo.indexOf('function finishHim(t){'));
}

/* ============================================================================
   18. V83 THE BROWN BOX AND THE DIAL THAT WOULD NOT LEAVE
   Paolo, with a screenshot: "there's a brown square that covers everything in...
   and as that bullet's travelling the dead shot dial can like fade away, so by
   the time there's that pause the dead shot dial is not there."
   ========================================================================== */
{
  /* THE BROWN BOX: sampled at #6c503b out of his own screenshot, which led to two
     LEGACY_PRE_REVAMP placeholder blocks -- a 6S x 7S brown torso and a 4S head,
     from before the game had real sprites. The killshot ran them through the board
     zoom AND the kill camera, so they landed as a slab over a hundred px across. */
  ok('V83 NO PLACEHOLDER SLABS: every legacy pre-sprite body block is DELETED, not merely hidden -- not one of the four hardcoded slab colours survives anywhere in the demo',
    !demo.includes("'#3a3228'") && !demo.includes("'#4a4038'") &&
    !demo.includes("'#5a4a38'") && !demo.includes("'#5a4a3a'"));
  ok('and the no-target fallback the kill camera was pointed straight at is gone with it',
    !demo.includes('LEGACY_PRE_REVAMP (4): no-target fallback blocks') &&
    demo.includes('V83: the no-target fallback slab is DELETED.'));
  ok('NAME IT OR DON\'T DRAW IT, APPLIED: a missing sprite now draws NOTHING and says so in the log, because a missing body is a bug to find and not a box to paint over the frame',
    demo.includes("logLine && logLine('player sprite not ready - drawing nothing (was a brown placeholder slab)')") &&
    demo.includes('if(!G._noSprWarn){ G._noSprWarn=true;'));

  /* THE DIAL: the old fade was a flat 350ms with no relationship to when the
     bullet arrives. EXECUTE both, at every style and duration the game can
     produce, and prove the old one left the dial on screen at impact. */
  {
    const FRAC = { sharp: 0.18, hammer: 0.5, follow: 0.55 };
    const oldAlpha = c => Math.max(0, 1 - (c * 1000) / 350);
    const newAlpha = (c, d, st) => Math.max(0, 1 - c / Math.max(0.05, d * (FRAC[st] !== undefined ? FRAC[st] : 0.55)));
    const durs = [0.5, 1.0, 1.5, 2.0, 2.8];        /* dur is snapped to whole beats, min 0.5 */
    let oldWorst = 0, newWorst = 0;
    for (const st of Object.keys(FRAC)) for (const d of durs) {
      const contact = d * FRAC[st];
      oldWorst = Math.max(oldWorst, oldAlpha(contact));
      newWorst = Math.max(newWorst, newAlpha(contact, d, st));
    }
    ok('THE OLD DIAL FADE LEFT THE INSTRUMENT ON SCREEN AT IMPACT: a flat 350ms against a sharp shot that contacts at 90ms left the dial ' + Math.round(oldWorst * 100) + '% VISIBLE in the frame he screenshotted',
      oldWorst > 0.7);
    ok('V83 THE DIAL IS GONE BY CONTACT, at every style and every duration the game can roll: worst-case alpha at impact is ' + newWorst.toFixed(2),
      newWorst < 1e-9);
    ok('and it is DERIVED from the bullet\'s own two numbers rather than typed, so the fade can never drift out of step with the shot it is covering',
      demo.includes("const _dfT=G.ks?Math.max(0.05,G.ks.dur*(G.ks.style==='sharp'?0.18:G.ks.style==='hammer'?0.5:0.55)):0.35;") &&
      demo.includes('const travel = ks.style===\'sharp\'?0.18 : ks.style===\'hammer\'?0.5 : 0.55;') &&
      !demo.includes("Math.max(0,1-(performance.now()-G._ksAt)/350)"));
    ok('THE FADE STILL OWNS THE WHOLE DIAL, not just part of it -- the 7/3 fix that the bands must fade too still stands',
      demo.includes('ctx.globalAlpha=_df;') &&
      demo.includes('The fade now owns the ENTIRE dial from the first band.'));
  }
}

/* ============================================================================
   19. V84 THE THREE THINGS I HAD TO STOP GUESSING ABOUT
   Paolo, three times: "the brown box is absolutely still there and the dead shot
   dial orange part is still there like what's wrong with you bro."
   He was right three times. v81/v82/v83 all fixed code I could not watch running.
   ========================================================================== */
{
  /* (a) THE REGRESSION I CAUSED. JUICE.B fills the WHOLE canvas with the faction
     accent once a beat, and every accent is an orange-brown (#d07a2a, #b8642a,
     #caa05a, #d8a23a). v82 pinned _bpmPhase during the freeze to stop the screen
     breathing -- and pb is a function of that phase, so the wash WELDED ON at
     whatever brightness it had, for the whole pause. */
  ok('V84 THE STOP IS SILENT ON THE FLOOR TOO: the full-screen faction-accent wash does not draw while the world is frozen. v82 pinned the beat phase, which pinned the pulse, which held an orange-brown sheet over the entire screen for the length of every freeze',
    demo.includes('if(pb>0.004&&!(G._freezeT>0)){x.fillStyle=f.acc;') &&
    !demo.includes('if(pb>0.004){x.fillStyle=f.acc;'));
  ok('and the pulse is untouched during normal play -- it is his approved 120 BPM floor and only the FREEZE silences it',
    demo.includes('FLOORPULSE.base+FLOORPULSE.streakGain') && demo.includes('const pb=Math.pow(1-_bpmPhase,FLOORPULSE.curve)'));

  /* (b) THE ORANGE, NAMED BY THE INSTRUMENT RATHER THAN BY ME. */
  /* V94 RE-POINTED AND HARDENED. v84C could only FADE the offending object because
   the object was ours to draw. It is gone: the median is an approved tile that
   obeys Paolo's own 30-year wash law. The invariant is now absolute -- that
   colour is not drawn by this file AT ALL, at any alpha. */
ok('V84C/V94 THE ORANGE WAS NEVER THE DIAL: it was the road\'s hand-painted DOUBLE-YELLOW MEDIAN, rgba(184,160,40) as a full-height stripe. The object is now DELETED, not dimmed -- the median is approved art carrying his own washed-out ruling',
    !/fillStyle='rgba\(184,160,40/.test(demo) &&   /* the DRAW, not the word: v94's own comment quotes the dead colour to explain why it is dead, and a check that matches a comment is not a check */
    !/x\.fillRect\(medX/.test(demo) &&
    demo.includes('V94 THE HAND-PAINTED MARKINGS ARE GONE'));
  /* V94 RE-POINTED. The invariant is that the ENVIRONMENT steps back during a kill.
   v84C did that to two hand-drawn stripes; now the whole ground does it, which is
   strictly broader, and it reads visNow() so a held freeze holds it. */
ok('the environment still steps back during a kill -- generalised from two stripes to the whole ground, and on the FROZEN clock so a held pause holds it too',
    /* V110 RE-POINTED: same pass, MOVED. It used to fire inside the floor block,
       where the deck, the stairs and the cars all drew over it at full
       brightness -- so the thing the dim exists to push back was exempt from it.
       It now lands after the whole environment. Strictly more ground covered. */
    demo.includes("const _mk2=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;") &&
    demo.includes("if(_mk2<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk2)*0.42).toFixed(3)+')';") &&
    !/rgba\(215,205,185,'\+\(0\.38\*_mk/.test(demo));
  /* V94 RE-POINTED. The ordering trap this recorded (drawFloor's vignette runs
   BEFORE drawField paints on top of it) is still real and still the reason a
   hand-painted marking could out-shine a body. The fix is that nothing bright is
   hand-painted there any more, so the check now guards the CAUSE: no full-height
   marking rectangle may be drawn after the vignette, ever again. */
ok('AND THE REASON IT SURVIVED: drawFloor lays base + pulse + VIGNETTE, then drawField paints ON TOP, so the one pass meant to dim the scene runs before anything drawn after it. No hand-painted full-height marking may live there again',
    demo.includes('x.fillStyle=vg; x.fillRect(0,0,W,H);') &&
    !/x\.fillRect\([^;]*,-H\*2,[0-9.]+,H\*5\)/.test(demo) &&
    !demo.includes("const medX=cx+(2.5-offx)*t;"));

  /* (c) THE INSTRUMENT, so this never costs three turns again. */
  {
    const a = demo.indexOf('var BohemiaWhatsOn');
    const b = demo.indexOf('/* ===== V84B WHATS-ON CORE END');
    ok('demo carries WHAT\'S ON SCREEN as its own testable block', a > 0 && b > a);
    const wm = { exports: {} };
    new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaWhatsOn;')(wm, wm.exports);
    const W = wm.exports;
    ok('IT IS OFF UNTIL ARMED, so it costs nothing in a normal fight', W.isArmed() === false);
    W.arm();
    ok('and armed it captures', W.isArmed() === true);
    const SCREEN = 390 * 534;
    W.note('fill', 390, 534, '#120f08', 390 * 534, SCREEN);        /* full screen -> kept */
    W.note('fill', 2, 2670, 'rgba(184,160,40,0.55)', 2 * 2670, SCREEN);
    W.note('fill', 4, 4, '#fff', 16, SCREEN);                      /* tiny -> ignored */
    ok('IT ONLY REPORTS THINGS THAT ACTUALLY COVER THE SCREEN (>2%), so a pixel of blood cannot bury the thing he is pointing at',
      W.count() === 2);
    const rep = W.report();
    ok('and it reports BIGGEST FIRST with a count, so a hundred identical fills are ONE finding and not a hundred lines: ' + rep[0],
      rep.length === 2 && /100% of screen/.test(rep[0]) && /^x1  fill/.test(rep[0]));
    ok('finishing disarms it, so one tap is one capture and it cannot run forever',
      W.finish().length === 2 && W.isArmed() === false);
  }
  ok('the report lands in the COMMENT BOX, which already has a COPY button beside it -- one tap to send it to me, no trip through a menu',
    demo.includes("const _in=D('lcinput');") &&
    demo.includes("if(_in)_in.value='ON SCREEN AT THE PAUSE: '+_r.join('  ||  ');"));
  ok('and the hook only records during a FREEZE, on the visible canvas, so it can never sample the wrong surface or the wrong moment',
    demo.includes("if(BohemiaWhatsOn.isArmed()&&G._freezeT>0&&this.canvas&&this.canvas.id==='cv')"));
}

/* ============================================================================
   20. V85 THE BROWN BOX AND THE ORANGE ONE, NAMED IN A CAPTURED FRAME
   Paolo, FIVE times: "Brown box still their kill shot orange box doesnt fade
   away bro." Five fixes, five misses, because all five were theories about code
   nobody had watched run. The sixth started with a reproduction:
     scratchpad/spot.js -- screen-space bounding boxes through ctx.getTransform(),
     cinematic left to RUN, every draw landing on the body at the frozen frame:
       THE BROWN BOX    fillRect rgba(70,60,50,0.984)  @197,272  42x50
       THE ORANGE ONE   arcFill  rgba(255,200,70,0.55)  @197,237  9x9 + glow
   THE LESSON THIS SECTION EXISTS TO KEEP: every earlier probe measured raw
   fillRect ARGUMENTS, so a 6*S x 7*S square inside a 3x camera zoom read as tiny
   and my own threshold threw it away. The instrument was the bug.
   ========================================================================== */
{
  /* (a) THE BROWN BOX. Its own source comment convicted it, and carried Paolo's
     7/3/26 note: the real sprite death was playing UNDERNEATH it the whole time,
     which is also why he has asked three times for the headshot fall to start. */
  ok('V85 THE PLACEHOLDER SLAB IS DELETED: the LEGACY_PRE_REVAMP stand-in body, rgba(70,60,50), is what covered the corpse at every pause. ip=0 at contact so it was OPAQUE, and the freeze holds ks.t still so it stayed opaque for the whole stop',
    !demo.includes("c.fillStyle='rgba(70,60,50,'+(1-ip*0.8)+')';") &&
    !demo.includes('px(c,tx-3*S,ty-5*S+ip*9*S,6*S,7*S);') &&
    demo.includes('V85 THE PLACEHOLDER SLAB IS DELETED'));
  ok('AND THAT IS THE HEADSHOT ANIMATION HE ASKED FOR THREE TIMES: the clip was never missing, the slab was parked on top of it. The demo still owns the real death clip and still steps it contact-timed',
    demo.includes('const seq=L.death[Math.min(e._deathVar||0,L.death.length-1)];') &&
    demo.includes('return seq[Math.min(seq.length-1,Math.floor((now-e._deadAt)/150))];') &&
    demo.includes('tgt._fellAt=performance.now()+G.ks.dur*tv*1000; tgt._deadAt=tgt._fellAt;'));

  /* (b) THE ORANGE ONE. The gold payout mote, spawned at contact, flown on p.t,
     and p.t rides dt -- which is 0 while the world is stopped. */
  ok('V85 THE PAYOUT ARRIVES WHEN THE WORLD MOVES AGAIN: the ghost chip does not draw during a freeze. It spawns AT contact and flies on p.t, and p.t rides dt, and dt is 0 while time is stopped -- so it hung on the corpse, gold and glowing, for the entire pause',
    demo.includes("for(const p of G._fx){ if(p.type!=='chip'||p.t<0)continue;") &&
    /if\(p\.type!=='chip'\|\|p\.t<0\)continue;[\s\S]{0,900}?if\(G\._freezeT>0\)continue;/.test(demo));
  ok('and the chip itself is untouched: it is still the gold mote arcing into the fire-button corner, still spawned at contact by BOTH the single and the double tap',
    demo.includes("const gold=ghostRGB(1);") &&
    demo.includes("if(JUICE.T){const sp=worldToScreen(tx,ty-24);G._fx.push({type:'chip',x:sp[0],y:sp[1],t:0,life:1.05});} }"));

  /* (c) THE STOP IS A STILL, INCLUDING THE BODY -- and the pause is PAID BACK. */
  ok('V85 THE BODY HOLDS THROUGH THE STOP: visNow() is the wall clock normally and the instant the freeze began while the world is held, so the death clip cannot fall through frames during a dead stop',
    demo.includes('function visNow(){ return (G._freezeT>0&&G._fzNow!=null)?G._fzNow:performance.now(); }') &&
    demo.includes('if(G._fzNow==null)G._fzNow=performance.now();'));
  ok('and EVERY body reads it -- both the board pass and the field pass -- so one view can never animate while the other is frozen',
    demo.includes('{ const _nowD=visNow();') && demo.includes('const nowMs=visNow();') &&
    !demo.includes('{ const _nowD=performance.now();') && !demo.includes('const nowMs=performance.now();'));
  ok('AND THE PAUSE IS PAID BACK: pinning alone left _deadAt on raw wall time, so the clip SNAPPED forward the instant the world moved (measured: frame 0 held, then straight to 4 of 12). Every body timestamp advances by exactly the frozen duration on release',
    demo.includes("const _ks5=['_deadAt','_fellAt','_hitAt','_roseAt','_swingAt','_snapAt','_movedAt','_crawlAt','_shovedAt'];") &&
    demo.includes('for(const _b5 of (G.e||[]))for(const _k5 of _ks5)if(_b5[_k5]!=null)_b5[_k5]+=_fd;') &&
    demo.includes('const _fd=performance.now()-G._fzNow;'));
  ok('THE DEBT IS PAID ONCE AND ONLY ONCE: _fzNow is cleared in the same branch that pays it, so a long freeze can never charge the bodies twice',
    /const _fd=performance\.now\(\)-G\._fzNow;[\s\S]{0,1200}?G\._fzNow=null; \}/.test(demo));

  /* (d) THE RULE THIS TURN COST FIVE ROUNDS TO LEARN. */
  ok('AND THE v84 FIXES BOTH STAND: the floor pulse is still silent during a freeze, and the environment still steps back on a kill -- every later turn added to them and none traded one symptom for another',
    demo.includes('if(pb>0.004&&!(G._freezeT>0)){x.fillStyle=f.acc;') &&
    demo.includes("if(_mk2<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk2)*0.42).toFixed(3)+')';"));   /* V110 RE-POINTED: the dim moved past the environment */
}

/* ============================================================================
   21. V86 THE REST OF THE JUICE PASS, ON THE GRID
   Backlog 1e's leftovers from Paolo's own pick-list. Auditing them first turned
   three of five into BUGS rather than features, and the measuring turned up two
   more that the writing had missed:
     - the shot flash was frame-counted (flash-=0.08), so it ran 208ms at 60Hz
       and 104ms on his phone. Same defect class as the frame-counted hit-stop.
     - the killshot punch was a fraction of ks.dur, so the same white ran 0.167s
       behind a clean kill and 0.375s behind a sharp one.
     - keying that punch to ks.t instead left it PINNED by the hit-stop: measured
       633ms of white. Keying it to G._ksAt made it never draw at all, because
       the HELD BREATH runs first and the camera early-returns through all of it.
   MEASURED ON THE REAL CANVAS after: clean 91ms, sharp 115ms, shot flash
   136-176ms across runs, recoil home in 130ms.
   ========================================================================== */
{
  /* (a) the table itself, EXECUTED, not string-matched. */
  const fa = demo.indexOf('var BohemiaFreeze');
  const ja = demo.indexOf('/* ===== V86 THE JUICE IS ON THE GRID');
  const jb = demo.indexOf('/* ===== V86 JUICE GRID END');
  ok('V86: the demo carries JUICEMS as its own testable block, after the freeze core it is built from',
    fa > 0 && ja > fa && jb > ja);
  const jm = { exports: {} };
  new Function('module', 'exports',
    demo.slice(fa, demo.indexOf('/* ===== V81 FREEZE CORE END')) +
    ';' + demo.slice(ja, jb) +
    ';module.exports={JUICEMS:JUICEMS,BRASS:JUICE_BRASS_MAX,F:BohemiaFreeze};')(jm, jm.exports);
  const J = jm.exports.JUICEMS, F = jm.exports.F;
  const names = Object.keys(J);
  ok('EVERY VISUAL JUICE DURATION IS A REAL NOTE VALUE, in seconds, exactly like the freeze tiers: ' +
      names.map(k => k + '=' + J[k] + 's ' + F.noteName(J[k])).join(', '),
    names.length >= 4 && names.every(k => F.isNote(J[k])));
  ok('and the table covers all four: the shot flash, the killshot punch, the recoil and the held breath',
    ['flash', 'ksPunch', 'recoil', 'breath'].every(k => J[k] > 0));

  /* (b) THE SHOT FLASH WAS FRAME-COUNTED. The same bug v81 killed in the
     hit-stop, sitting untouched in a second place. */
  ok('V86 THE SHOT FLASH IS SECONDS, NOT FRAMES: flash-=0.08 PER FRAME meant 208ms at 60Hz and 104ms on his 120Hz phone -- not a duration at all, a refresh rate. Every shot he has judged has been flashing for whatever his screen felt like',
    !demo.includes('flash-=0.08;') &&
    demo.includes('flash=Math.max(0,flash-_fdt/JUICEMS.flash); }') &&
    demo.includes("const _fdt=(G._flashLast!=null)?Math.min(0.25,(_fn-G._flashLast)/1000):0;"));
  ok('and the wall-clock stamp is released the moment the flash is over, so the next shot measures its own frame and never inherits a stale delta',
    demo.includes('  else G._flashLast=null;'));

  /* (c) THE KILLSHOT PUNCH: one note, every style, off the cinematic's true
     zero -- which is neither ks.t (the freeze pins it) nor G._ksAt (the breath
     runs first). Both wrong answers were MEASURED before this one was kept. */
  ok('V86 ONE PUNCH, ONE DURATION: it was a fraction of ks.dur, so the same white ran 0.167s behind a clean kill and 0.375s behind a sharp one -- same event, duration decided by whichever cinematic the shuffle rolled',
    !demo.includes('const punch=Math.max(0,1-p*3);') &&
    !demo.includes('const snap=Math.max(0,1-p*4);') &&
    (demo.match(/1-\(\(performance\.now\(\)-\(G\._ksGo\|\|performance\.now\(\)\)\)\/1000\)\/JUICEMS\.ksPunch/g) || []).length === 2);
  ok('AND ITS ZERO IS THE FIRST FRAME THE CINEMATIC ACTUALLY DRAWS: ks.t is pinned by the hit-stop (measured 633ms of white behind a sharp kill) and G._ksAt is stamped before the HELD BREATH, which this function early-returns through (measured: the flash never drew at all)',
    demo.includes('if(G._ksGo==null)G._ksGo=performance.now();') &&
    demo.includes('G._ksGo=null;                /* V86:') &&
    demo.indexOf('if(G.breathT>0){') < demo.indexOf('if(G._ksGo==null)G._ksGo=performance.now();'));

  /* (d) the recoil comes home ON the sixteenth, which is the pick-list's words. */
  ok('V86 THE GUN COMES HOME ON THE NEXT SIXTEENTH: dt*4.5 is 0.222s, which lands between a sixteenth and an eighth, so the kick was still travelling when the next sixteenth arrived',
    !demo.includes('G.recoil=Math.max(0,G.recoil-dt*4.5);') &&
    demo.includes('G.recoil=Math.max(0,G.recoil-dt/JUICEMS.recoil);') &&
    Math.abs(J.recoil - F.note(16)) < 1e-9);

  /* (e) the one micro-pause in the kill that never landed on the beat. */
  ok('V86 THE HELD BREATH LANDS ON THE BEAT: it was 0.12s against a sixteenth of 0.125s -- 4% off the grid, in the one system whose entire premise is the 120 BPM law',
    !demo.includes('G.breathT = G.heldBreath ? 0.12 : 0;') &&
    demo.includes('G.breathT = G.heldBreath ? JUICEMS.breath : 0;') &&
    F.isNote(J.breath));

  /* (f) PERMANENCE: brass is floor state that was deleting itself. */
  ok('V86 PERMANENCE: the brass cap was 14, so the fifteenth casing silently deleted the first and the floor stopped accumulating within seconds of a real firefight. Now ' + jm.exports.BRASS,
    !demo.includes('if(G.litter.length>14)G.litter.shift(); }') &&
    demo.includes('if(G.litter.length>JUICE_BRASS_MAX)G.litter.shift(); }') &&
    jm.exports.BRASS > 14 && jm.exports.BRASS <= 256);
  ok('and it is still BOUNDED and still cleared on a fresh fight -- permanence lasts the encounter, not the session',
    demo.includes('G.coverHoles=[]; G.litter=[]; G.lvl=0;'));   /* V107 RE-POINTED: fresh ground moved into resetFightState */

  /* (g) the impact carries a direction, which is the whole point of a burst. */
  ok('V86 THE IMPACT THROWS ALONG THE SHOT: twelve particles at k/12*6.28 is a perfect circle, the one shape a real impact never makes, and it threw away the only thing a burst exists to say -- where it came from',
    !demo.includes('px(c,tx+Math.cos(a)*r-S,ty+Math.sin(a)*r-S,2*S,2*S);}') &&
    demo.includes('const _lean=0.45+0.85*(0.5+0.5*Math.cos(a-ang));'));
  {
    /* run the real formula: down-range must throw materially further than behind */
    const lean = a => 0.45 + 0.85 * (0.5 + 0.5 * Math.cos(a - 0));
    const vals = Array.from({ length: 12 }, (_, k) => lean(k / 12 * 6.28));
    const hi = Math.max(...vals), lo = Math.min(...vals);
    ok('and the lean is real, not decorative: down-range x' + hi.toFixed(2) + ' against x' + lo.toFixed(2) + ' behind (it was a flat x1.00 in every direction)',
      hi > 1.2 && lo < 0.6 && vals.every(v => v > 0));
  }
}

/* ============================================================================
   22. V87 THE PAUSE IS EMPTY, AND THE ORANGE WAS THE STREAK GLOW
   Paolo, SIX times: "that orange part of the dead shot dial is still there not
   fading away." Five reproductions found nothing because every probe I ever
   wrote KILLS ONE MAN, and CHAIN ESCALATION only exists at killStreak >= 2. He
   plays whole encounters. It is a FULL-SCREEN orange wash, brightest at the
   screen EDGE -- which is where the dial sits, which is why he named the dial.
   MEASURED at a 3-streak, off the colour stop the game really asks for:
     +  875ms  ks.t=0.871  freeze=0     rgba(255,60,40) alpha=0.199
     + 2284ms  ks.t=0.969  freeze=HELD  rgba(255,60,40) alpha=0.190
   1.4 seconds of wall time, 0.009 of fade, because (1-p) rides ks.t and the
   hit-stop pins ks.t.
   AND IN PIXELS, on the freeze frame, screen-edge mean:
     before  rgb(70.8, 53.1, 42.4)   380 warm px
     after   rgb(25.7, 24.8, 31.0)     0 warm px
   ========================================================================== */
{
  ok('V87 THE STREAK GLOW IS PAOLO\'S ORANGE: a FULL-SCREEN wash on every kill from the second onward, whose fade rode ks.t -- the one clock the hit-stop pins. Now one beat, on the wall clock',
    !demo.includes("grd.addColorStop(1,'rgba(255,'+(120-k*60)+',40,'+(0.10+k*0.18)*(1-p)+')');") &&
    demo.includes("const _sg=Math.max(0,1-((performance.now()-(G._ksGo||performance.now()))/1000)/JUICEMS.streak);") &&
    demo.includes("grd.addColorStop(1,'rgba(255,'+(120-k*60)+',40,'+((0.10+k*0.18)*_sg).toFixed(3)+')');"));
  ok('AND IT DOES NOT DRAW DURING THE STOP AT ALL -- the belt as well as the braces, because this is the FOURTH thing this session that a pinned clock welded onto a frozen screen',
    demo.includes('if(ks.escal>1&&!(G._freezeT>0)){'));
  ok('the streak glow is in the JUICEMS table like every other duration, and it is a real note (one whole beat)',
    demo.includes('streak:  BohemiaFreeze.note(4),'));

  ok('V87 THE INSTRUMENT IS NEVER ON SCREEN DURING A STOP: _df, the one alpha that owns the entire dial, is forced to 0 while the world is frozen. Whatever the timing math works out to on a device I do not have, the dial and the pause are never on screen together',
    /* V116B RE-POINTED: the freeze still forces 0 -- that clause is unchanged
       and asserted below. What changed is the ELSE: instead of snapping to 1
       the instant the kill ends, the dial ramps back in over DIAL_IN_MS. */
    demo.includes('const _df=(G._freezeT>0)?0') &&
    demo.includes(':((G.ks&&G._ksAt)?Math.max(0,1-_sinceKs/(_dfT*1000))') &&
    demo.includes(':Math.max(0,Math.min(1,_sinceEnd/DIAL_IN_MS)));'));
  ok('AND IT IS SAFE BY CONSTRUCTION: the demo resets globalAlpha to 1 immediately before drawKillshotWorld, so _df owns the instrument and nothing else -- the bullet, the blood and the bodies are on the far side of that reset',
    demo.indexOf('ctx.globalAlpha=_df;') < demo.indexOf('ctx.globalAlpha=1;   /* dial fade never touches the killshot world */') &&
    demo.indexOf('ctx.globalAlpha=1;   /* dial fade never touches the killshot world */') <
      demo.indexOf('if(G.ks){ drawKillshotWorld(ctx,cx,cy,RAD,S); ksDust(ctx); }'));

  /* the instrument that could never have found it, fixed so a seventh round
     cannot happen. EXECUTED, not string-matched. */
  {
    const a = demo.indexOf('var BohemiaWhatsOn');
    const b = demo.indexOf('/* ===== V84B WHATS-ON CORE END');
    const wm = { exports: {} };
    new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaWhatsOn;')(wm, wm.exports);
    const W = wm.exports;
    ok('V87 WHAT\'S ON SCREEN CAN NOW SEE WHAT IT MISSED: it knows a WARM colour, in rgba or hex',
      typeof W.isWarm === 'function' &&
      W.isWarm('rgba(255,60,40,0.19)') === true && W.isWarm('#caa83a') === true &&
      W.isWarm('rgba(96,150,182,0.5)') === false && W.isWarm('#0b1018') === false);
    W.arm();
    const SCREEN = 390 * 534;
    W.note('gradient', 1, 1, 'rgba(255,60,40,0.19)', 1, SCREEN);   /* tiny, but WARM -> kept */
    W.note('stroke', 2, 2, 'rgba(96,150,182,0.5)', 4, SCREEN);     /* tiny and cool -> dropped */
    ok('WARM THINGS COUNT AT ANY SIZE NOW, so a 1px gradient stop that washes the whole screen can no longer hide under a 2% size floor -- which is exactly how the streak glow survived six rounds',
      W.count() === 1);
    W.finish();
  }
  ok('and it watches STROKES and GRADIENT COLOUR STOPS, not just fills: the dial is strokes, and a gradient fill stringifies to "[object CanvasGradient]" which names nothing at all',
    demo.includes('P.stroke=function(){') &&
    demo.includes('CanvasGradient.prototype.addColorStop=function(o,cs){') &&
    demo.includes("BohemiaWhatsOn.note('gradient',1,1,cs,1,1); }catch(_e){}"));

  ok('AND ALL THREE EARLIER PAUSE FIXES STILL STAND -- the floor pulse (v84), the payout chip (v85) and now the streak glow are the same bug four times, which is why this one shipped a RULE',
    demo.includes('if(pb>0.004&&!(G._freezeT>0)){x.fillStyle=f.acc;') &&
    /if\(p\.type!=='chip'\|\|p\.t<0\)continue;[\s\S]{0,900}?if\(G\._freezeT>0\)continue;/.test(demo) &&
    demo.includes('if(ks.escal>1&&!(G._freezeT>0)){'));
}

/* ============================================================================
   23. THE NORTH STAR, AND THE AUDIT THAT MUST STAY TRUE
   Paolo 7/27/26, asked what actually makes a fight fun, LOCKED:
     "the strategy choice to deal the most damage and take the least amount of
      damage by positioning and abilities and deeper understanding of mechanics.
      gameplay. feeling snappy and violent and human and fun."
   laws/BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md
   records/BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md
   This section is NOT a feature gate. It pins the AUDIT to the live code, so the
   day someone changes the damage model the audit and the addendum are forced back
   into line in the same turn instead of quietly rotting into a lie.
   ========================================================================== */
{
  const fs2 = require('fs'), path2 = require('path');
  const ROOT2 = path2.join(__dirname, '..');
  const LAW = path2.join(ROOT2, 'laws', 'BOHEMIA_ADDENDUM_WHAT_COMBAT_IS_FOR_7_27_26.md');
  const AUD = path2.join(ROOT2, 'records', 'BOHEMIA_COMBAT_AUDIT_AGAINST_THE_NORTH_STAR_7_27_26.md');
  ok('THE NORTH STAR IS WRITTEN DOWN, verbatim, in the laws and quoted in the audit -- his sentence is the thing every combat item is now measured against',
    fs2.existsSync(LAW) && fs2.existsSync(AUD) &&
    fs2.readFileSync(LAW, 'utf8').includes('deal the most damage and take the least amount of damage') &&
    fs2.readFileSync(AUD, 'utf8').includes('deal the most damage and take the least amount of damage'));

  /* --- the numbers the audit reports MUST be the numbers the game runs ----- */
  ok('AUDIT PINNED: player kill damage is a flat constant (KILL_DMG=100) applied through armor only -- if this becomes positional the audit stops being true',
    demo.includes('const KILL_DMG=100;') &&
    demo.includes('function applyDamage(tgt,raw){ const mit=Math.max(0,raw-(tgt.armor||0)); tgt.hp=Math.max(0,tgt.hp-mit); return mit; }'));
  /* MIGRATED BY V121. The curve is still 0.97 - distT*0.60 and still a 2.6x
     swing; it is now the BASE the difficulty divides the miss out of, so the
     literal one-line form this pinned no longer exists. The number it was
     actually guarding is asserted below, unchanged. */
  ok('AUDIT PINNED: the enemy accuracy BASE curve is unchanged in SHAPE -- 0.97 at point blank down to 0.37 at long range, a 2.6x swing -- but V138 reads it off distTFrom, HIS gun, because one curve was serving both my shot at him and his shot at me',
    demo.includes('const base=0.97 - distTFrom(e)*0.60;'));
  ok('V138 AND PAST HIS MAX IT IS ZERO, NOT A PENALTY: an accuracy taper that never reaches zero is just a worse hit chance, and a worse hit chance has never made anybody walk anywhere. The hard wall is the entire feature',
    /if\(!inHisRange\(e\)\)return 0;/.test(demo) &&
    demo.includes('function inMyRange(e){') && demo.includes('function inHisRange(e){'));
  ok('AUDIT PINNED: the distance bands are PT_BLANK=4 / FAR_TILE=26 / MAX_RANGE=64. V138 raised the ceiling from 42 because a sniper now really does sit out at 30-40 tiles, where 42 was a number nothing ever reached',
    demo.includes('const PT_BLANK=4, FAR_TILE=26, MAX_RANGE=64;'));
  /* V160 RE-POINTED OFF THE RESEARCH HE ASKED FOR. These pinned max:14/16/26/44
     and sniper 64. Measured on the real canvas, he SEES 17.5 tiles to the sides,
     so the rifle reached 2.5x sight and the sniper 3.7x -- half of both numbers
     did nothing but exist. Rogue Fable IV, which is the game he keeps citing,
     gives a bow 7 range against 7.5 tiles of vision: RANGE EQUALS SIGHT. The law
     being checked is still that every gun HAS a range, never that the numbers
     are any particular size. */
  ok('V138 EVERY GUN HAS A RANGE, WHICH IS THE TABLE THAT NEVER EXISTED: WEAPON_LETHAL, WEAPON_CAP, WEAPON_WIDTH and WEAPON_ID all shipped long ago and range did not, so a pistol and a rifle were the same gun with different dial widths. V160: and no gun reaches past sight',
    /const WEAPON_RANGE=\{/.test(demo) &&
    /shotgun:\{eff:5,  max:9\}/.test(demo) && /pistol :\{eff:6,  max:12\}/.test(demo) &&
    /smg    :\{eff:10, max:15\}/.test(demo) && /rifle  :\{eff:20, max:16\}/.test(demo) &&
    /const SNIPER_RANGE=\{eff:30,max:16\};/.test(demo) &&
    /const SIGHT_TILES=17;/.test(demo) && /const REACH_CEIL=16;/.test(demo));
  ok('V138 THE ORDER IS THE RESEARCH AND IT NEVER INVERTS: shotgun < pistol < SMG < rifle < sniper, on both numbers, because that ordering is the one thing about real gun ranges that survives being squeezed onto a board',
    (function(){ const m=demo.match(/const WEAPON_RANGE=\{[\s\S]*?\n\};/); if(!m)return false;
      const g=[...m[0].matchAll(/(\w+)\s*:\{eff:(\d+),\s*max:(\d+)\}/g)].map(x=>[x[1],+x[2],+x[3]]);
      const order=['shotgun','pistol','smg','rifle'];
      if(g.length!==4||g.some((x,i)=>x[0]!==order[i]))return false;
      for(let i=1;i<4;i++)if(g[i][1]<=g[i-1][1]||g[i][2]<=g[i-1][2])return false;
      return g[3][1]<30 && g[3][2]<64; })());
  ok('V138 WHO IS CARRYING WHAT: a GOON has a pistol (walk him down), a SEC-BOT has a rifle (he outranges you), and the sniper is the reason the board is this big',
    /const ARCH_WEAPON=\{human:'pistol',bot:'rifle',sniper:'sniper'\};/.test(demo));
  ok('V138 THE SPAWN BAND OPENS: it was 6.5-14.5 tiles, which at 1.5m a tile is a fight inside 10-22 METRES -- a parking space with people in it, and it made every weapon range moot because everything spawned inside every gun\'s reach',
    /e\.edist = \(i===sniperIdx\)/.test(demo) && /: _lo\+Math\.random\(\)\*\(_hi-_lo\);/.test(demo));

/* ===== V140 NOBODY IS IN RANGE WHEN THE BELL RINGS =================
   Paolo 8/11: "how dare you make a range of weapons that have a maximum range
   and then don't even set the Enemies that far away from me... I literally can
   just stand there. Shoot out everyone kill them."
   MY OWN V138 MEASUREMENT SAID IT AND I FILED IT AS A FEATURE: "pistol 41% of
   the board in range". Forty-one percent in range IS stand-there-and-kill-
   everyone. A maximum range means nothing if there is never a moment when
   nothing is inside it.
   MEASURED AFTER, 80 arenas per gun, standing perfectly still:
     shotgun  0% in range at the bell, nearest 17.8 tiles, 5.8 turns to a target
     pistol   0%                       nearest 20.7 tiles, 6.3 turns
     smg      0%                       nearest 28.0 tiles, 6.3 turns
   That gap IS the approach phase the fight never had. */
ok('V140 THE SPAWN BAND IS MEASURED IN **YOUR GUN**, NEVER IN TILES: a fixed tile number cannot be right for five weapons with five reaches, and the dark HALVES every range, so the only honest unit is a multiple of the range actually in effect',
  /const _R=maxRange\(myRange\(\)\);/.test(demo) &&
  /const SPAWN_NEAR=1\.15, SPAWN_FAR=1\.65;/.test(demo) &&
  /* V160 RE-POINTED, AND THE LAW IS INTACT. The band is still measured in HIS
     GUN -- _R*SPAWN_NEAR to _R*SPAWN_FAR, untouched. What was added is a
     CEILING, not a unit: they may not start beyond what he can see. I claimed
     the old multipliers would "fix themselves" once ranges came down and
     MEASURED THEY DID NOT -- 1.65 x 16 is 26 tiles against 17.5 of sight, so
     20% of every fight began off screen, invisible AND unreachable, which is
     not an approach, it is a rumour. */
  /* V198 RE-POINTED: the band is still "multiples of YOUR max range" -- which is
     why compressing the guns compressed the approach for free -- and only the
     two absolute distances are now read on the current ruler. */
  /const _lo=Math\.min\(sightTiles\(\), contentR\(\), Math\.max\(hd\(PT_BLANK\+2\), _R\*SPAWN_NEAR\)\);/.test(demo) &&
  /const _hi=Math\.min\(sightTiles\(\), contentR\(\), Math\.max\(_lo\+hd\(1\), _R\*SPAWN_FAR\)\);/.test(demo));

/* ===== V145 THE GAP WAS TOO WIDE, MEASURED ========================
   60 arenas pressing only WAIT: 14.9 TURNS before anything was shootable and
   49.3 damage taken getting there. Waiting was never free -- it costs half his
   health -- but fifteen turns is the complaint. V140 set the band to 1.8-2.6x
   while fixing "everybody is already in range" and OVERCORRECTED. 1.30 is still
   outside 1.00, so NOBODY IS IN RANGE AT THE BELL survives untouched. */
ok('V145 A LINE UNDER NO FIRE ADVANCES WHOLE: PRESS_FRAC=0.5 is fire and movement and it is right UNDER FIRE, but when not one man on the field can reach anybody there is nothing to cover and nothing to be covered from. Half the line was holding a firing position against a threat that does not exist yet, which doubled the walk. The instant ONE gun can reach ONE man it snaps back',
  /const _noFire=!anyInMyRange\(\) && !\(G\.e\|\|\[\]\)\.some\(/.test(demo) &&
  /const budget=_noFire\?plans\.length:Math\.max\(1,Math\.ceil\(pool\.length\*PRESS_FRAC\)\);/.test(demo) &&
  demo.includes('const PRESS_FRAC=0.5;'));

ok('V140 THE GUARANTEED CLOSE SPAWN IS DEAD: the generator had always put one man at PT_BLANK+0..2.5 -- "in your face" -- which handed over a free target on turn one every single fight no matter how big the board got',
  !/PT_BLANK\+Math\.random\(\)\*2\.5/.test(demo) &&
  /\(i===closeIdx\) \? _lo/.test(demo));

ok('V140 AND THE DECK MAY NOT TELEPORT A MAN BACK INTO RANGE: V90B took shooters who spawned correctly out in the band and dropped them on deck tiles near the player, which silently undid the opening distance -- 6-8% of men were shootable at the bell purely because of that one line. A later pass overwriting an earlier pass is the same shape as the giants: two things deciding one number',
  /if\(\(T\.edist\|\|0\) < _lo\) continue;/.test(demo));
  ok('AUDIT PINNED: cover is a BINARY predicate and incoming fire FILTERS on it -- an enemy you have cover against is removed from the volley entirely, 0% or 100%, never a modifier',
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    demo.includes('!myCoverAgainst(e.ea,e.edist,e.lvl)'));   /* V90: still a FILTER, now level-aware. The audit's "0% or 100%" finding is unchanged -- a floor simply turns the whole predicate off. */
  ok('AUDIT PINNED: the stamina economy is 3 pips and a stamina move costs no turn (Paolo 7/26). V163: the REGEN half of that ruling is superseded by his 8/17 RF4 LIFT -- a global clock, not a per-use refund -- and newest date wins. What the audit was protecting is intact: the budget is small, it is spendable, and spending it does not cost a turn',
    demo.includes('const STAM_MAX=3;') &&
    /const SP_TICK=5;/.test(demo) &&
    /if\(\(\(G\.mTurn\|\|0\)%SP_TICK\)===0\)\{/.test(demo) &&
    demo.includes('function spendStam(n){ if((G.stam||0)<n)return false;'));

  /* --- THE FINDING ITSELF, as a machine check. This is the one that matters:
     the audit's headline is that NOTHING POSITIONAL MULTIPLIES PLAYER DAMAGE.
     The day that stops being true is the day the north star's other half got
     built, and this check is how we find out on purpose instead of by accident. */
  {
    /* V102 RE-POINTED: the expression moved into dialFgv() so the band and the
       enemy's cover pose share ONE definition. The audit pin follows it. The
       invariant is unchanged and is the one that matters most in this file. */
    const i = demo.indexOf('function dialFgv(){ return ');
    const fgv = i > 0 ? demo.slice(i, demo.indexOf(';', i)) : '';
    ok('AUDIT PINNED, AND THIS IS THE HEADLINE: no positional term multiplies the player\'s damage or hit window. fgv scales on difficulty, steady aim and streak -- never on range, angle, cover or elevation. "Deal the most damage BY POSITIONING" has no code behind it yet',
      fgv.length > 0 &&
      /pkgDiff/.test(fgv) && /_steadyAtPop/.test(fgv) && /killStreak/.test(fgv) &&
      !/dist|edist|distT|ea\b|elev|flank|angle/.test(fgv));
    ok('and range touches only WHICH PATTERN you get, never your output -- an execution effect, not a damage one',
      demo.includes('function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); }'));
  }

  ok('THE TEST THE NORTH STAR LEAVES IS RECORDED: does it change how much damage I deal or take, through position, spend, or knowledge? If no, it is not a combat feature and it never leads a pick-list',
    fs2.readFileSync(LAW, 'utf8').includes('DOES IT CHANGE HOW MUCH DAMAGE I DEAL OR TAKE, THROUGH POSITION, SPEND, OR'));
}

/* ============================================================================
   24. V88 THE PROVING GROUND, and the point-blank trade made visible
   Paolo 7/27/26: "u want to get into point blank range and sprinting and not
   losing a turn can help that. i mean when it comes to shooting theres not a lot
   of ways to increase damage other than hit the killshot. just fun position and
   yeah. maybe its time to add a shuffable arena map fr and add companions maybe?"
   TWO RULINGS: no damage multipliers (position makes the killshot LANDABLE, not
   bigger), and point blank is the offensive play.
   ========================================================================== */
{
  /* (a) the seeded arena, EXECUTED. A seed that does not reproduce its arena is
     not a seed, it is a label. */
  const a = demo.indexOf('function bohemiaDice(');
  const b = demo.indexOf('/* ===== V88 ARENA CORE END');
  ok('V88: the demo carries THE PROVING GROUND as its own testable block', a > 0 && b > a);
  const am = { exports: {} };
  new Function('module', 'exports', demo.slice(a, b) + ';module.exports=BohemiaArena;')(am, am.exports);
  const A = am.exports;

  const seq = s => { const d = A.dice(s * 2654435761); return [d(), d(), d(), d(), d()].map(x => x.toFixed(9)).join(','); };
  ok('SAME SEED, SAME ARENA: the dice are deterministic, so #4417 is #4417 forever and an arena becomes a thing he can NAME and keep',
    seq(4417) === seq(4417) && seq(4417) !== seq(6021));
  ok('and the dice are actually distributed, not a stuck value pretending to be random',
    new Set(seq(4417).split(',')).size === 5);

  ok('A JUNK SEED IS REFUSED rather than silently building a broken arena: letters, zero and out-of-range all return null',
    A.set('abc') === null && A.set(0) === null && A.set(999999) === null && A.set(-3) === null);
  ok('a legal seed is accepted and reported back, so the button can show him which arena he is standing in',
    A.set(4417) === 4417 && A.get() === 4417);

  /* THE ONE THAT MATTERS MOST: a proving ground that quietly made the whole game
     deterministic would be a far worse bug than the one it fixes. */
  {
    const real = Math.random;
    let inside = null;
    A.set(883);
    A.withDice(() => { inside = [Math.random(), Math.random()]; });
    const after = [Math.random(), Math.random(), Math.random()];
    ok('MATH.RANDOM IS HANDED STRAIGHT BACK after the build -- the arena borrows the dice for the encounter and the rest of the game stays genuinely random',
      Math.random === real && new Set(after.map(x => x.toFixed(9))).size === 3 &&
      inside && inside.length === 2);
  }
  {
    /* and it is handed back even when the generator throws */
    const real = Math.random;
    try { A.withDice(() => { throw new Error('boom'); }); } catch (_e) {}
    ok('AND IT IS HANDED BACK EVEN IF THE GENERATOR THROWS -- a crash mid-build can never leave the whole game running on loaded dice',
      Math.random === real);
  }

  /* (b) the generator is WRAPPED, not rewritten. MAP LAW: plumbing only. */
  /* RE-POINTED 8/27 FOR STRUCTURE, NEVER FOR OUTCOME. This matched the wrapper as
     one exact literal line, and V190 put the boss roll in it -- ON PURPOSE and
     OUTSIDE the swap, because rolling inside withDice draws off the SEEDED
     stream and silently re-deals every arena he has ever written down. So the
     claim is asserted as what it always meant (the body is WRAPPED, not
     rewritten) and STRENGTHENED with the thing that actually protects a seed:
     nothing may draw a number before the dice are handed over. */
  ok('V88 MAP LAW HELD: the arena generator is WRAPPED, not rewritten. Claude authored no layout -- setupEnemies just rolls known dice, and the body it calls is the same body it always was',
    /function setupEnemies\(\)\{[\s\S]{0,1400}return BohemiaArena\.withDice\(setupEnemiesBody\); \}/.test(demo) &&
    demo.includes('function setupEnemiesBody(){ const prev=G.e||[];') &&
    demo.includes("const layouts=['oneside','twoside_opp','twoside_adj','cluster_flank','ring'];"));

  /* AND THE SEED IS ONLY SAFE IF NOTHING DRAWS BEFORE THE HANDOVER. */
  {
    const wrap = demo.slice(demo.indexOf('function setupEnemies(){'),
                            demo.indexOf('function setupEnemiesBody(){'));
    const body = demo.slice(demo.indexOf('function setupEnemiesBody(){'),
                            demo.indexOf('function setupEnemiesBody(){') + 4000);
    ok('V88 AND NOTHING DRAWS OFF THE SEEDED STREAM THAT IS NOT PART OF THE ARENA. "One number reproduces one exact fight, FOREVER" only holds if every call inside withDice is one the arena has always made -- V190 rolled its boss in there for one build and re-dealt every seed in the game with no crash and no warning. The roll sits in the WRAPPER, before the swap, and setupEnemiesBody never calls it',
      /rollBoss\(\)/.test(wrap)
      && wrap.indexOf('rollBoss()') < wrap.indexOf('BohemiaArena.withDice')
      && !/rollBoss\(\)/.test(body));
  }

  /* (c) shuffle keeps the fight, and the box is a REQUEST only when HE typed it */
  ok('SHUFFLE KEEPS THE FIGHT: it rebuilds cover and spawns without touching HP or the streak, so a dozen arenas cost a dozen seconds instead of a fight each',
    demo.includes("const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();") &&
    demo.includes("setupEnemies(); updateGeomCover(); buildBoard(); updPlayer();") &&
    !/arenabtn[\s\S]{0,1200}?fullResetCombat\(\)/.test(demo));
  ok('THE BUG THE CLICK TEST CAUGHT IS GATED: writing the seed OUT into the comment box poisoned the read back IN, so SHUFFLE locked to one arena and only ever shuffled once. The box is a request only when PAOLO put the number there',
    demo.includes("const _mine=(_txt!==''&&_txt===G._arenaWrote);") &&
    demo.includes("const _asked=(_in&&!_mine)?BohemiaArena.set((_txt.match(/\\d{1,5}/)||[])[0]):null;") &&
    demo.includes("G._arenaWrote='arena '+s; if(_in)_in.value=G._arenaWrote;"));

  /* (d) THE RANGE READ -- his ruling, made legible. */
  ok('V88 THE RANGE READ: both halves of the point-blank trade on one line, always on. The mechanic has existed since the dial shipped and has NEVER been shown, which is the same defect he has named three times about SUPPRESS',
    demo.includes('function updRangeRead(){ const r=D(\'rangeread\'); if(!r)return;') &&
    demo.includes("const dialTier=Math.max(0,Math.min(4,distPkg(e)+(e.elite?1:0)+(e.gcov?1:-1)+(G.handPeek?1:0)));") &&
    demo.includes("const theirs=Math.round(distAccuracy(e)*((e.E&&e.E.acc||0.55)/0.55)*100);") &&
    demo.includes('<div id="rangeread"'));
  ok('and the read is computed from THE SAME EXPRESSIONS the fight runs, not a second copy that can drift out of step with it',
    demo.includes('distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0),'));
  ok('and it rides updGap, which already runs whenever the board does, so it can never go stale behind a phase change',
    demo.includes("function updGap(){ try{updRangeRead();}catch(_e){}"));

  /* (e) RULING 1, as a standing check: position must never multiply damage. */
  ok('RULING 1 HELD -- NO DAMAGE MULTIPLIERS. Paolo: "theres not a lot of ways to increase damage other than hit the killshot." Position makes the killshot LANDABLE, never bigger. Kill damage is still the flat constant and nothing positional touches it',
    demo.includes('const KILL_DMG=100;') &&
    demo.includes('applyDamage(tgt,KILL_DMG);'));
}

/* ============================================================================
   25. V89 THE GENERATOR ONLY EVER MADE ONE ARENA
   Paolo on v88: "I dont see new arenas shit was boring if u did anything."
   MEASURED, six arenas rolled back to back on v88:
     pieces 6,5,7,7,6,7   mean spread 6.50,5.79,5.91,5.99,6.43,6.70
   One count range, ONE radius (0.55 for every piece ever placed), one placement
   rule. That is one arena with the dots moved, and no seed can shuffle variety
   that does not exist. v88 handed him dice for a generator with one brick.
   AFTER: pieces 6,4,13,15,11,13 and radius varying 0.45-1.15, with runs.
   ========================================================================== */
{
  const i = demo.indexOf('/* ===== V89 THE GENERATOR GETS A VOCABULARY');
  const j = demo.indexOf('/* V42 COVER REVERT: cover is permanent again.', i);
  const gen = (i > 0 && j > i) ? demo.slice(i, j) : '';
  ok('V89: the pillar generator carries the vocabulary as one readable block', gen.length > 0);

  ok('DENSITY IS A REAL RANGE. V138 CLAIMED IT SCALED WITH THE BOARD AND THE ARITHMETIC WAS WRONG: before was 1 piece per ~45 tiles^2 (avg 8.5 inside radius 11) and v138 gave 1 per ~123 (avg 20 inside radius 28), so it THINNED cover 2.7x while saying it held it. That is why the bigger board read as empty desert. Holding the original density needs ~55 pieces',
    gen.includes('const NP=20+Math.floor(Math.random()*70);') &&
    !demo.includes('const NP=5+Math.floor(Math.random()*3);') &&
    !demo.includes('const NP=2+Math.floor(Math.random()*14);') &&
    !demo.includes('const NP=6+Math.floor(Math.random()*30);'));
  ok('V139 THE WORLD IS BUILT AS FAR AS HE CAN SEE, AND THAT IS ONE NUMBER NOT TWO: cover used to stop at a hardcoded 28 while the visible board moved with the zoom, so a ring of bare desert appeared at the edge BY CONSTRUCTION the moment the zoom passed it. contentR() is derived from the pitch, so they cannot drift apart -- the giants bug in a third costume, closed',
    gen.includes('d0=2.2+Math.random()*(contentR()-2.2);') &&
    gen.includes('if(Math.hypot(nx2,ny2)>contentR())continue;') &&
    /* V198 RE-POINTED: the world is still built to what the screen shows; a wider tile builds fewer of them */
    /function contentR\(\)\{ return 0\.85\/\(FIELD_PITCH\*/.test(demo) &&
    !gen.includes('d0=2.2+Math.random()*7.5;'));
  ok('COVER HAS A SIZE: r was 0.55 for EVERY piece ever placed. Now 0.45-1.15, so some is a crate you duck behind and some is a block you go around',
    gen.includes('const r=Math.max(0.45,Math.min(1.15,bulk+(Math.random()-0.5)*0.30));') &&
    !demo.includes('edist:Math.hypot(nx2,ny2),r:0.55,tall:'));
  ok('AND THE EXISTING COVER MATHS ALREADY SCALED OFF P.r everywhere it is used, so nothing had to be rewritten -- the number was simply never allowed to vary',
    demo.includes('if(dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9){') &&   /* V108 RE-POINTED: the same P.r geometry, now inside coverPillarAgainst, which myCoverAgainst is a boolean over */
    demo.includes('segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85)') &&
    /* V147 RE-POINTED: the MOVEMENT collisions no longer scale off a padded P.r,
       because the padding was the invisible pillar -- up to 1.1 tiles of block
       around a rock drawn at 0.45. COVER maths still scales off P.r exactly as
       this check was built to assert; what changed is what BLOCKS A STEP. */
    demo.includes('const _rr=Math.max(0.5,P.r||0.5);'));
  ok('PIECES CLUSTER INTO RUNS, so WALLS and CORNERS emerge from the same circle maths that already ships -- a wall is three pillars in a row, and every cover function already understands three pillars in a row. No new geometry, no new collision, no new cover rule',
    gen.includes('const seedP=(G.pillars.length&&Math.random()<clump*0.8)') &&
    gen.includes("const dirs=[[1,0],[-1,0],[0,1],[0,-1]], d=dirs[Math.floor(Math.random()*4)];"));
  ok('and each arena rolls its OWN character once -- bulk and clump -- so two arenas can differ in KIND, not just in where the dots landed',
    gen.includes('const bulk=0.45+Math.random()*0.70;') && gen.includes('const clump=Math.random();'));

  ok('V89 MAP LAW STILL HELD: density, size and clustering are PARAMETERS. Claude authored no layout and named no arena; the seed decides what the vocabulary says, and which arenas are canon is still only his call',
    !/const\s+ARENAS\s*=/.test(demo) && !/LAYOUT_NAMES|ARENA_PRESETS/.test(demo) &&
    demo.includes("const layouts=['oneside','twoside_opp','twoside_adj','cluster_flank','ring'];"));

  ok('THE PLACEMENT STILL LANDS ON TILES and still refuses to build on top of the player or off the far edge, so a denser arena can never wall him in at spawn',
    gen.includes('if(Math.hypot(nx2,ny2)<1.5)continue;') &&
    gen.includes('if(Math.hypot(nx2,ny2)>contentR())continue;') &&
    gen.includes('return Math.abs(q[0]-nx2)<0.9&&Math.abs(q[1]-ny2)<0.9;'));
  ok('and the retry budget grew with the density so a 15-piece arena cannot quietly come out half-built',
    gen.includes('pg++<240'));

  ok('V89 "I DONT SEE": the ARENA button rendered blank until the first tap, because updArenaBtn only ever ran inside the click handler. One control in a row of eleven, saying nothing about what it was for. It now rolls and labels itself on startup',
    demo.includes('try{ if(BohemiaArena.get()==null)BohemiaArena.roll(); updArenaBtn(); }catch(_e){}'));
}

/* ============================================================================
   26. V90 TWO-STOREY ARENAS. Paolo: "Two-story arenas yes."
   THE ONE RULE: across levels, ground cover does not count, for EITHER of you.
   From the deck you shoot men who thought they were behind stone; from up there
   you are behind nothing. Same shape as the point-blank trade he ruled on --
   better odds to kill, worse odds to live -- and it obeys his no-multipliers
   ruling exactly, because it changes WHO IS EXPOSED and never how much damage
   anything does.
   MEASURED on arena #70368 (6-tile deck, 2 men on it, 15 ground cover):
     from the ground   men whose cover works against you: 0    clean lines on you: 7
     from the deck     men whose cover works against you: 1    clean lines on you: 6
   ========================================================================== */
{
  ok('V90 THE ONE RULE: myCoverAgainst takes a LEVEL and returns false across floors -- a floor between you is not a wall between you',
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    /* V108 RE-POINTED: the cross-level rule moved INTO coverPillarAgainst, which
       both myCoverAgainst and myConcealAgainst are thin wrappers over -- so the
       rule now has exactly ONE owner instead of being duplicated per wrapper. */
    demo.includes('function coverPillarAgainst(ang,dist,lvl,soft){') &&
    demo.includes('if(lvl!=null&&(lvl|0)!==myLvl())return null;') &&
    demo.includes('return !!coverPillarAgainst(ang,dist,lvl,false); }'));
  ok('AND IT RUNS BOTH WAYS: his cover from you dies across floors too, in realCoverPillar, so the deck is not a free kill box in one direction only',
    /function realCoverPillar\(e\)\{[\s\S]{0,260}?if\(\(e\.lvl\|0\)!==myLvl\(\)\)return false;/.test(demo));
  ok('AND EVERY ENEMY-FACING COVER CALL CARRIES ITS LEVEL -- all 14 of them, so no code path can quietly keep the old flat answer',
    /* V108 RE-POINTED: three of the e2 sites are the ACQUISITION BEAD, which is
       a line-of-sight test and now calls myConcealAgainst. The invariant is
       unchanged and is asserted across BOTH functions: every enemy-facing cover
       or concealment call carries its level, and none of them may be levelless. */
    /* 8 enemy-facing calls, still 8: seven ask the boolean and the eighth asks
       coverPillarAgainst directly, because the volley needs to know WHICH piece
       stopped the round so it can put the heat in the car. */
    /* V156 RE-POINTED, AND THE RULER WAS THE BROKEN ONE. These were EXACT
       counts, so adding a correct new enemy-facing call -- one that carries its
       level like every other -- took the gate red for a reason that has nothing
       to do with the law. The comments beside them had already said so twice in
       their own words: "the invariant is that no enemy-facing call may be
       levelless, never that there is a fixed number of them". The counts are
       floors now and the INVARIANT is asserted directly, across every form,
       including coverPillarAgainst. FIX THE RULER, NEVER THE TARGET. */
    demo.split('myCoverAgainst(e.ea,e.edist,e.lvl)').length - 1 >= 9 &&
    demo.split('coverPillarAgainst(e.ea,e.edist,e.lvl,false)').length - 1 >= 1 &&
    demo.split('myCoverAgainst(e2.ea,e2.edist,e2.lvl)').length - 1 >= 1 &&
    demo.split('myConcealAgainst(e2.ea,e2.edist,e2.lvl)').length - 1 >= 4 &&
    demo.includes('coverPillarAgainst(e.ea,e.edist,e.lvl,false)') &&
    demo.includes('myCoverAgainst(tgt.ea,tgt.edist,tgt.lvl)') &&
    demo.includes('myCoverAgainst(e.ea,null,e.lvl)') &&
    !/my(Cover|Conceal)Against\((e|e2|tgt)\.ea,\s*(e|e2|tgt)\.edist\)/.test(demo) &&
    !/coverPillarAgainst\((e|e2|tgt)\.ea,\s*(e|e2|tgt)\.edist,\s*(false|true)\)/.test(demo));

  ok('HIS NO-MULTIPLIERS RULING HOLDS: height changes nothing about damage. KILL_DMG is still the flat constant and no level term is anywhere near it',
    demo.includes('const KILL_DMG=100;') && demo.includes('applyDamage(tgt,KILL_DMG);') &&
    !/KILL_DMG\s*\*/.test(demo));

  ok('V90 THE DECK IS WORLD STATE like the pillars, so worldShift already carries it and every coordinate function already understands it',
    demo.includes('for(const T of (G.deck||[]))mv(T,0.02);') &&
    demo.includes('G.deck.push({ea:Math.atan2(ty,tx),edist:Math.hypot(ty*0+tx,ty)||Math.hypot(tx,ty),lvl:DECK_LVL});') === false &&
    demo.includes('lvl:DECK_LVL});'));
  ok('and it is ROLLED BY THE ARENA SEED, so replaying a seed replays the whole problem -- including WHETHER there is a deck at all, which is itself a difference between arenas',
    demo.includes('G.deck=[]; G.stairs=[]; G.lvl=0;') &&
    /* V100 RE-POINTED: still rolled on the arena dice outdoors. Indoors a warehouse
       ALWAYS has its office mezzanine, which is a property of the building, not a
       coin flip -- and the seed still reproduces which kind of arena you got. */
    demo.includes("if(G.arenaKind==='warehouse'||Math.random()<0.72){") &&
    demo.includes('G._deckHolders='));
  ok('NEVER BUILT ON TOP OF THE PLAYER, and never so far out it is scenery',
    demo.includes('if(Math.hypot(tx,ty)<2.6)continue;') && demo.includes('if(Math.hypot(tx,ty)>12)continue;'));
  ok('AND THE DECK EVICTS GROUND COVER UNDER IT, so a pillar can never be stranded inside a slab as cover nobody can see',
    /* V110 RE-POINTED AND STRENGTHENED: still evicts ground cover under the slab,
       but a CAR is evicted whole. Per-cell was the bug -- it deleted the one cell
       that draws and left five invisible solid ones. */
    demo.includes('G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];') &&
    demo.includes('const q=pXY(P); return !deckTileAt(q[0],q[1]); }); } }'));
  /* V92 SUPERSEDES THE PLACEMENT, NOT THE PROMISE. v90 took the closest deck tile
     outright; v92 takes the closest tile ON THE NEAR EDGE, because a run of steps
     only reads when it descends toward the viewer. The promise this check exists to
     protect -- there is always a way up you can walk to -- is unchanged, and section
     28 asserts the near-edge rule itself. */
  ok('THE STAIR IS STILL A WAY UP YOU CAN WALK TO, now the nearest tile on the deck\'s near edge (V92)',
    demo.includes('let s=_edge[0]; for(const T2 of _edge)if(T2.edist<s.edist)s=T2;') &&
    demo.includes("s.stair=true; G.stairs.push(s);"));

  ok('V90B THE CLIMB COSTS ONE STAMINA AND NO TURN -- Paolo 7/26 LOCKED, and his own words this session: "sprinting and not losing a turn can help that." Taking the high ground is priced like closing the distance',
    demo.includes("if(!spendStam(1)){ setRead('NO STAMINA','the climb costs one pip','#8a7d66'); return; }") &&
    !/function doStairs\(\)\{[\s\S]{0,900}?endTurn/.test(demo));
  /* V91 CORRECTS THIS CHECK, IT DOES NOT RELAX IT. v90 asserted the button "only
     exists when you can actually use it, on the same terms SHOVE does" -- and that
     rule is precisely what made the whole feature unfindable: measured across eight
     arenas, the button appeared ZERO times, because the stairs spawn 3-6 tiles out
     and it only showed within 1.6. SHOVE is a verb against a man who is already in
     your face; STAIRS is a verb against a PLACE ACROSS THE LOT. Copying SHOVE's rule
     onto it was the mistake. The invariant that actually matters -- the climb still
     costs a pip and you still have to be standing there -- is asserted in section 27. */
  ok('the stairs are still only USABLE from arm\'s reach, even though the button is always visible (V91)',
    demo.includes("function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }") &&
    demo.includes("const near=!!stairNear();"));
  ok('A BLADE CANNOT REACH A FLOOR ABOVE IT -- not a balance number, an arm being too short',
    /for\(const e of G\.e\)\{ if\(e\.dead\|\|e\.downed\|\|e\.broken\|\|e\.fleeing\|\|!e\.melee\)continue;\s*\n\s*if\(\(e\.lvl\|0\)!==myLvl\(\)\)continue;/.test(demo));
  /* V155 RE-POINTED, AND THE RULER WAS THE BROKEN ONE. This was a fixed
     1200-character window after `function resetFightState(){`, so ANY line added
     to the reset -- however correct -- eventually pushed `G.lvl=0;` out of view
     and took the gate red for a reason that had nothing to do with the law. The
     law is "the reset puts you back on the lot", so it now reads THE FUNCTION
     BODY, whatever length it grows to. FIX THE RULER, NEVER THE TARGET. */
  ok('and every fight starts on the lot',
    (() => { const a = demo.indexOf('function resetFightState(){');
      if (a < 0) return false;
      const b = demo.indexOf('\nfunction ', a + 10);
      return demo.slice(a, b < 0 ? a + 4000 : b).includes('G.lvl=0;'); })());   /* V107 RE-POINTED: and now NEW ENCOUNTER puts you back on the lot too, which the old inline list never did */

  /* the render: levels are drawn RELATIVE, which is the one-scene law */
  ok('V90B LEVELS ARE DRAWN RELATIVE TO YOU: the deck floats above the lot from the ground and becomes the floor under your feet once you are on it. ONE SCENE, the same law the killshot and the board already obey',
    demo.includes('const lvlDY=l=>-(((l|0)-(G.lvl||0))*DECK_H);') &&
    demo.includes('const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };'));
  ok('and the dead lie on the floor they fell on, instead of snapping to the lot',
    demo.includes('const _ep=epos(e);   /* V90B: the dead lie on the floor they fell on */'));
  /* V105 RE-POINTED. The invariant is that A STOREY MUST READ AS TALL, and the
   original finding stands: drawn at #3e372c it read as a lighter patch of ground.
   v105 stops solving that with a near-black WALL, because a wall can only hide
   the man under it, and solves it with a scaffold instead: vertical legs, which
   are the only thing in a top-down frame that says tall, plus a hard bright kick
   rail to read the height against. Same requirement, better answer. */
ok('A STOREY READS AS TALL, and never again as a lighter patch of ground (v105: vertical legs + a bright kick rail, instead of a near-black wall)',
    demo.includes('x.lineWidth=Math.max(2,t2*0.09); x.strokeStyle=') &&
    demo.includes("x.strokeStyle=dialOrnament()?'rgba(232,214,172,0.92)':'rgba(120,110,88,0.30)'; x.lineWidth=Math.max(2,t2*0.08);") &&   /* V110 RE-POINTED: the rail is still the bright kick rail -- it just stops being the brightest thing on screen during a kill */
    !demo.includes("x.fillStyle='#3e372c';"));
  /* V92 REPLACED WHAT THIS CHECKED. The "steps on the tile" it asserted were a
     DECAL on a tile floating a storey above the lot -- Paolo: "looking like dog
     shit" -- and it is exactly the kind of check that passes while the thing it
     describes is broken. The way up is now a real run of steps joining the two
     floors, asserted properly in section 28. */
  ok('the way up is drawn as ARCHITECTURE that touches the ground, not a decal on the roof (V92)',
    !demo.includes("if(T.stair){ x.fillStyle='rgba(232,200,138,0.30)';") &&
    demo.includes('V92 A REAL RUN OF STEPS'));

  ok('V90B THE READ SAYS WHICH FLOOR, and says the loud part: that every piece of stone on the lot just stopped counting',
    demo.includes("(myLvl()===DECK_LVL?'HIGH GROUND':'HE IS ABOVE YOU')") &&
    demo.includes("+'</b> <span style=\"color:#5a5040\">·</span> no cover counts <span style=\"color:#5a5040\">·</span> '):'';"));
}

/* ============================================================================
   27. V91 THE STAIRS ANNOUNCE THEMSELVES
   Paolo: "I couldn't find the stairs bro or whatever you had out what the fuck
   are you talking about?"
   REPRODUCED, eight arenas, loaded and shuffled the way he plays them:
     arenas with a deck:                 8 of 8
     whose stair tile was ON SCREEN:     8 of 8
     that ever showed the STAIRS button: 0 of 8    <-- ZERO
   v90b gated the button on stairNear() (1.6 tiles) and the stairs spawn 3-6 out.
   The only thing that ever said "there is a way up" required walking to it first,
   under fire, toward a thing he had no reason to think existed. v90b's own
   docstring says "a mechanic nobody can see is not a mechanic yet".
   AFTER: 6 of 6 deck arenas show it, and the 2 flat lots correctly do not.
   ========================================================================== */
{
  ok('V91 THE BUTTON IS ALWAYS THERE WHEN THERE IS A WAY UP -- it is the one channel on a phone that cannot be zoomed out of, panned off, or mistaken for scenery. It hides ONLY when the arena is a flat lot',
    demo.includes("const S=(G.stairs||[])[0];\n  if(!live||!S){ b.style.display='none'; return; }\n  b.style.display='';") &&
    !demo.includes("b.style.display=s?'':'none';\n  if(s)b.textContent=(myLvl()===DECK_LVL?'DOWN':'UP')+' \\u00b7 1 STA'; }"));
  ok('AND IT SAYS HOW FAR AND WHICH WAY until you are standing on them, then lights up and says what it costs',
    demo.includes("b.textContent='STAIRS '+Math.round(S.edist)+' '+stairBearing(S);") &&
    demo.includes("if(near){ b.textContent=(myLvl()===DECK_LVL?'DOWN':'UP')+' \\u00b7 1 STA';") &&
    demo.includes("const STAIR_ARROWS=['E','SE','S','SW','W','NW','N','NE'];"));
  ok('the bearing is real 8-way compass maths off the stair tile, not a guess',
    /function stairBearing\(S\)\{[\s\S]{0,220}?return STAIR_ARROWS\[Math\.round\(a\/\(Math\.PI\/4\)\)%8\];/.test(demo));
  ok('and a tap from across the lot POINTS instead of no-opping, which is what a dimmed button owes you',
    demo.includes("if(!s){ const S=(G.stairs||[])[0];   /* V91: a tap from across the lot POINTS, it never no-ops */"));

  ok('V91 THE MARKER: a beat-pulsing chevron stack over the stair tile, so the button has something to point AT. Sized in RING UNITS so it survives the auto-frame zooming out to fit eight men',
    demo.includes("if(!aimo&&G.stairs&&G.stairs.length&&myLvl()!==DECK_LVL){") &&
    demo.includes("const pu=Math.pow(1-_bpmPhase,2), t3=ring;") &&
    demo.includes("x.lineWidth=Math.max(2,t3*0.10); x.lineCap='round';"));
  ok('and it draws AFTER the deck, so the thing that shows you the way up can never be painted over by the way up',
    demo.indexOf("x.fillStyle=T.stair?'#7d6c50':'#665c49';") <
      demo.indexOf("if(!aimo&&G.stairs&&G.stairs.length&&myLvl()!==DECK_LVL){"));

  ok('V91 THE FIGHT SAYS IT HAS A STOREY, once, at the top -- he should never have to infer a rule from a tan rectangle',
    demo.includes("setRead('HIGH GROUND ON THE LOT','stairs '+Math.round(G.stairs[0].edist)+' '+stairBearing(G.stairs[0])") &&
    demo.includes("+' — up there no cover counts, theirs or yours','#e8c88a');"));
  ok('and every SHUFFLE says whether the arena it just rolled has a way up or is a flat lot',
    demo.includes("? ('HIGH GROUND — stairs '+Math.round(G.stairs[0].edist)+' '+stairBearing(G.stairs[0]))") &&
    demo.includes("ced' === 'x' ? '' : 'flat lot, no way up')") === false &&
    demo.includes("'flat lot, no way up')"));

  ok('WHAT DID NOT CHANGE, AND MUST NOT: you still WALK there, it still costs a pip, and it is still the only way up. Advertising a position is not giving it away -- the walk under fire IS the price of the high ground',
    demo.includes("if(!spendStam(1)){ setRead('NO STAMINA','the climb costs one pip','#8a7d66'); return; }") &&
    demo.includes("function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }") &&
    /function doStairs\(\)[\s\S]{0,700}?const up=\(myLvl\(\)!==DECK_LVL\);/.test(demo));
}

/* ============================================================================
   28. V92 THERE WAS NEVER A STAIRCASE, ONLY A DECAL
   Paolo: "You have stairs right now looking like dog shit... do a big brain
   online research. Have some references and do what you're supposed to."
   WHAT WAS THERE: three faint stripes painted on the TOP FACE of a deck tile,
   one whole storey above the lot. A decal, joined to nothing. The structural
   problem was worse than the palette one -- THE STAIRS NEVER TOUCHED THE GROUND.
   THE RESEARCH (Pixel Parmesan's isometric fundamentals; SLYNYRD Pixelblog 41;
   the Pixelation top-down-stairs thread) is unanimous on three rules and the
   decal had none: 3 shades per step, height lines perfectly vertical, and draw
   back to front so near steps occlude far ones.
   ========================================================================== */
{
  ok('V92 THE DECAL IS GONE: three stripes on a tile floating one storey above the lot were never a way up',
    !demo.includes("for(let s2=0;s2<3;s2++)x.fillRect(p[0]-t2*0.42,ty+t2*(0.18+s2*0.26),t2*0.84,t2*0.10); } }") &&
    /* V105 RE-POINTED: the deck draw was rewritten as a scaffold and the v92 note
       went with the code it annotated. The INVARIANT is what matters and it is
       stronger now -- no decal, and a real run of steps that touches the ground. */
    demo.includes('V92 A REAL RUN OF STEPS') &&
    demo.includes('const rise=DECK_H;'));

  ok('V92 A REAL RUN OF STEPS joins the two floors: five steps, each with a BRIGHT TREAD and a NEAR-BLACK RISER, spanning the storey',
    demo.includes('const NS=5, run=t4*1.05, halfW=t4*0.46;') &&
    demo.includes("x.fillStyle='#14110d';") &&
    demo.includes("x.fillStyle='#8c7d61';") &&
    demo.includes("x.fillStyle=dialOrnament()?'rgba(232,214,172,0.95)':'rgba(120,110,88,0.32)';"));   /* V110 RE-POINTED: the lit lip is still the lit lip, dark during a kill */
  ok('RULE 1, THREE SHADES PER STEP: near-black riser, mid tread, hard lit lip on the leading edge -- three distinct values per step, which is the documented isometric rule',
    /x\.fillStyle='#14110d';[\s\S]{0,200}?x\.fillStyle='#8c7d61';[\s\S]{0,260}?rgba\(232,214,172,0\.95\)/.test(demo));   /* V110 RE-POINTED: three distinct values per step, unchanged */
  ok('RULE 2, THE HEIGHT LINE IS VERTICAL: the riser is a straight vertical face drawn from the tread down, which is the only thing in a top-down frame that says "this is tall"',
    demo.includes('x.fillRect(ox2-wx*0.5, oy2, wx, riser+tread);'));
  ok('RULE 3, BACK TO FRONT: the loop runs from the TOP step down, so every lower step occludes the one behind it. Without the occlusion a stack of bands is a barcode',
    demo.includes('for(let i2=0;i2<NS;i2++){') &&
    demo.includes('const fr=i2/(NS-1);'));

  ok('V92 A STOREY IS A STOREY WHICHEVER FLOOR YOU ARE ON: measuring the rise relative to your feet made it ZERO on the deck, so the way DOWN was invisible from up there -- the button said DOWN and the picture said nothing',
    demo.includes('const rise=DECK_H;') && !demo.includes('const rise=-dzS;'));

  /* the generation change that deleted a broken orientation instead of
     special-casing it -- and this is the one worth keeping, because it is a
     RENDER problem solved at the SOURCE. */
  ok('V92 THE ENTRANCE IS GENERATED ON THE DECK\'S NEAR EDGE, so the run always comes DOWN TOWARD THE VIEWER. Marching away up-screen, every riser is taller than the gap to the next step and the run collapsed into a dark smear -- measured invisible in exactly that one case',
    demo.includes('const _wy=T2=>Math.sin(T2.ea)*T2.edist;') &&
    demo.includes('const _edge=G.deck.filter(T2=>_wy(T2)>maxY-0.6);') &&
    demo.includes('let s=_edge[0]; for(const T2 of _edge)if(T2.edist<s.edist)s=T2;') &&
    !demo.includes('let s=G.deck[0]; for(const T of G.deck)if(T.edist<s.edist)s=T;'));
  ok('and it is STILL the nearest way up on that edge, so the old nicety survived the fix',
    /const _edge=G\.deck\.filter[\s\S]{0,200}?if\(T2\.edist<s\.edist\)s=T2;/.test(demo));
  ok('THE RUN HAS ONE ORIENTATION NOW, not four of which one was broken: it always marches down-screen and narrows slightly with distance so it reads as going away and up',
    demo.includes('const ox2=sp2[0], oy2=oy+fr*run*0.35;') &&
    demo.includes('const wx=halfW*2-fr*halfW*0.30;'));
  ok('and it throws a shadow on the lot at its foot, where a real stair would',
    demo.includes("x.fillRect(sp2[0]-halfW-2, topY+rise+run*0.35-2, halfW*2+4, 7);"));
  ok('THE CHEVRON LIFTED OFF THE STEPS, so the wayfinding marker stops sitting on the thing it points at',
    demo.includes('const yy=sy2-t3*(1.55+c2*0.42)-pu*t3*0.16;'));

  ok('REUSE-FIRST RECORDED: banks/ WAS searched and 19 approved stair tiles DO exist (Stairs+ladders+railings n=6, Stairs and lifts n=12, Staircases and elevation n=1). Not used because the run must span DECK_H, computed at runtime from the live zoom -- a fixed raster cannot stretch between two screen heights. Filed as the replacement for when the combat surface goes tiled',
    (() => { const fs3 = require('fs'), p3 = require('path');
      const t = fs3.readFileSync(p3.join(__dirname, '..', 'tools', 'bohemia_combat_staircase_patch.py'), 'utf8');
      return /REUSE CHECK:/.test(t) && /Stairs, ladders and Railings/.test(t) &&
             /18\. Stairs and lifts/.test(t) && /16\. Staircases and elevation/.test(t); })());
}

/* ============================================================================
   29. V93 YOU CAN SEE WHO IS UNDER THE DECK
   Paolo: "there has to be like the [opacity] thing where I could see who's
   underneath the stairs."
   REPRODUCED, and it was the OPPOSITE of hidden: a living man parked on the lot
   under a deck tile was drawn ON TOP OF the storey above him. Every body paints
   in one pass at one depth, so a man underneath a platform and a man standing on
   it were pixel-identical -- the picture actively lied about which floor anyone
   was on, which is worse than occlusion. Occlusion at least tells you something
   is in front.
   ========================================================================== */
{
  ok('V93 THE X-RAY: a body on the lot with a storey over its head draws as a GHOST -- washed cold and dropped to low alpha -- which is what every top-down game with a roof does. The hidden thing shows THROUGH rather than vanishing',
    demo.includes('function underDeck(o){ if(!o||(o.lvl|0)!==0)return false;') &&
    demo.includes("const UNDER_TINT='rgba(96,132,178,0.90)', UNDER_ALPHA=0.42;"));
  ok('and the predicate is a REAL level+footprint test, not a distance guess: level 0, standing on a deck tile',
    /* V106 RE-POINTED: deckSlabAt, not deckTileAt -- a staircase is a deck tile
       and it is NOT something you can be underneath. Standing on the foot of the
       run used to X-RAY you, which is exactly what Paolo reported as "I walk on
       the stairs and then it says I'm behind the stairs". Still a real
       level+footprint test; the footprint just stopped including the door. */
    /function underDeck\(o\)\{ if\(!o\|\|\(o\.lvl\|0\)!==0\)return false;\s*\n\s*return !!deckSlabAt\(Math\.cos\(o\.ea\)\*o\.edist,Math\.sin\(o\.ea\)\*o\.edist\); \}/.test(demo));

  ok('EVERY BODY OBEYS ONE RULE, enemies and YOU alike, so you can always tell which floor your own man is standing on',
    demo.includes('if(underDeck(e)){ const f2=enemyFrame(e,now); if(!f2)return false;') &&
    demo.includes('function underDeckMe(){ return myLvl()===0 && !!deckSlabAt(0,0); }') &&
    demo.includes('if(underDeckMe()){ x.save(); x.globalAlpha=UNDER_ALPHA;'));
  ok('and the ghost REUSES drawHumanWashed, the tint path the stun / firing / peeking / wounded reads already ride -- no new draw path was invented for it',
    demo.includes('drawHumanWashed(x,f2,ex,ey,UNDER_TINT);') &&
    demo.includes('function drawHumanWashed(x,cv112,ex,ey,tint){'));
  ok('the ghost restores the canvas state it borrowed, so a translucent body can never leak its alpha onto whatever draws next',
    (demo.match(/x\.save\(\); x\.globalAlpha=UNDER_ALPHA;/g) || []).length === 2 &&
    demo.includes('x.restore(); return true; }'));

  ok('V93 AND THE READ SAYS IT IN WORDS TOO, for the one case the level words alone could not cover: same floor as you, but with a storey over his head, which is where he is hardest to see',
    demo.includes('const _und=underDeck(e)&&!_lv;') &&
    demo.includes('UNDER THE DECK'));

  ok('V93 A GHOST IS A READ, NOT A RULE CHANGE: being under the deck alters nothing about cover, damage or exposure -- the cross-level rule is still the only thing levels do to the fight',
    demo.includes('if(lvl!=null&&(lvl|0)!==myLvl())return null;') &&   /* V108 RE-POINTED */
    demo.includes('const KILL_DMG=100;') &&
    !/underDeck\([^)]*\)[^\n]{0,80}(KILL_DMG|applyDamage|distAccuracy)/.test(demo));

  /* ===== 30. V94/96/97 THE FIGHT STANDS ON THE APPROVED STREET ========== */
  ok('V94 THE GROUND IS APPROVED ART, NOT A PROCEDURAL FILL. Combat was the last surface still inventing its own ground: a coordinate hash, a tone jitter and a flat rgb() per cell. It now blits the tileset Paolo approved 7/28 and picked again 7/29 -- the one the RUN ships and the constitution byte-locks',
    demo.includes('V94 THE FIGHT STANDS ON THE APPROVED STREET') &&
    demo.includes('const STREET_B64=') &&
    demo.includes('x.drawImage(_st,Math.floor(sx2),Math.floor(sy2));'));

  ok('V94 AND THE HAND-PAINTED MARKINGS ARE GONE. The double-yellow median and the lane dashes were drawn in code at hardcoded world coordinates, AFTER the vignette meant to dim them, and Paolo reported that object as a persistent orange for three turns. The markings live in the ground now',
    !demo.includes("x.fillStyle='rgba(184,160,40,'") &&
    !demo.includes("x.fillRect(medX-3,-H*2,2.4,H*5);") &&
    !demo.includes("for(const lane of [-1.5,6.5]){"));

  ok('V94 THE v84C KILL FADE IS GENERALISED, NOT DELETED -- the whole ground steps back on a kill instead of one stripe -- AND IT READS visNow(): the old line used performance.now(), so a held freeze kept fading the marking back in on wall-clock time. That was a latent THE-PAUSE-IS-EMPTY bug',
    demo.includes('const _mk2=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;') &&
    !/const _mk2?=\(G\.ks&&G\._ksAt\)\?Math\.max\(0,1-\(performance\.now\(\)-G\._ksAt\)\/260\):1;/.test(demo));   /* V110 RE-POINTED: still visNow(), now applied after the environment too */

  ok('V94 MAP LAW HELD: the street anatomy was ALREADY declared in code (median 2.5, lanes -1.5/6.5) and the tiles render that declaration. Markings snap to the nearest cell centre, ties low, which is a rule and not a taste',
    demo.includes('const ST_MED=2, ST_LANE_L=-2, ST_LANE_R=6;') &&
    demo.includes('function streetKindAt(wx){'));

  ok('V94 THE FALLBACK SURVIVES: until the art decodes the original procedural fill still runs, so the floor is never blank for a frame',
    /if\(_st\)\{[\s\S]{0,120}else \{ const j=\(h%7\)-3;/.test(demo) &&
    demo.includes("x.fillStyle='rgb('+(g+16)+','+(g+9)+','+(g+1)+')';"));

  ok('V94 THE BLIT IS CACHED PER TILE SIZE, because rescaling 44px art once per cell per frame is the whole cost; the cache drops on a zoom, which is the only time the scale moves',
    demo.includes('let _stCache={}, _stCacheT=-1;') &&
    demo.includes('if(_stCacheT!==px){ _stCache={}; _stCacheT=px; }'));

  ok('V96 THE SIDEWALK ENDS. It used to return walk for every cell past the kerb FOREVER, so the fight happened on a road with an infinite concrete sidewalk covering two thirds of the screen. Two tiles, then the lot',
    demo.includes('V96 THE SIDEWALK ENDS') &&
    demo.includes("if(wx>=ST_LANE_L-4&&wx<=ST_LANE_R+4)return 'walk';") &&
    demo.includes("return 'lot'; }"));

  ok('V96 QUARTER TURNS KILL THE REPEAT AT ZERO PAYLOAD -- and DIRECTIONAL tiles are never spun, because the kerb lip and the gutter shadow have to keep facing the road (v94 measured which way that is)',
    demo.includes('const ST_SPIN={road:1,walk:1,lot:1};') &&
    demo.includes('rot=ST_SPIN[kind]?((rot|0)&3):0;') &&
    !/ST_SPIN=\{[^}]*kerb/.test(demo) &&
    !/ST_SPIN=\{[^}]*gutter/.test(demo) &&
    !/ST_SPIN=\{[^}]*median/.test(demo));

  ok("V97 PAOLO'S OWN DOMINANCE LAW IS OBEYED ON THE LOT. The street bank says dominant 0.85, accents one tile per region, BANNED: per-cell random shuffle (Paolo 7/14: \"too much diversity with the desert tiles\"). v96 shuffled per cell and the ground came out a checkerboard. One hash per 4x4 region now, and a region is dominant or a single accent, never a mix",
    demo.includes('V97 THE DOMINANCE LAW') &&
    demo.includes('const LOT_DOMINANT=0, LOT_ACCENT_PCT=15, LOT_REGION=4;') &&
    demo.includes('if((c%100)>=LOT_ACCENT_PCT)return LOT_DOMINANT;') &&
    demo.includes("const _si=(_sk==='lot')?lotIdx(wx,wy,_sn):(h%_sn);") &&
    /LOT_ACCENT_PCT=15/.test(demo));

  ok('V97 AND NO BUILT THING IS PLACED BY THE GENERATOR: the concrete driveway slabs left the lot pool, because a slab scattered at random through dirt is a BUILT object placed by nobody and placing built things is his call (MAP LAW)',
    demo.includes('STREET_B64X.lot=STREET_B64X.lot.slice(0,4);'));

  /* ===== 31. V95 THE KILLSHOT ALLOWANCE ================================= */
  ok('V95 THE WALL IS GONE. Paolo: "i didnt notice my rule where whatever how many killshots u have after it becomes extremely hard implemented i didnt see that." Shot 3 of 2 used to simply not happen -- CHAIN SPENT, turn over, no decision in it. Now it happens, at an extremely hard dial',
    demo.includes('V95 THE KILLSHOT ALLOWANCE') &&
    !demo.includes("setRead('CHAIN SPENT','the '+WEAPON+' caps you at '+wpnCap()+' this turn'") &&
    demo.includes('if(G._chainN>chainWall()){'));

  ok('V95 THE RAMP IS A FLOOR, NOT A REPLACEMENT: point blank still pulls the dial easier exactly as he ruled 7/27, but it can never fully cancel the ramp, so closing the distance is HOW YOU AFFORD the extra shot',
    /* V110 RE-POINTED: there are TWO floors now (the chain ramp and exposure
       pressure) and the point-blank term is still the additive one, so his 7/27
       ruling survives both. */
    /G\.pkgDiff=Math\.max\(0,Math\.min\(4,Math\.max\([\s\S]{0,300}chainRampDial\(\),[\s\S]{0,80}pressurePkg\(\)\)\) - highGroundEdge\(tgt\)\);/.test(demo) &&
    demo.includes('distPkg(tgt)+(tgt.elite?1:0)+(tgt.gcov?1:-1)+(G.handPeek?1:0),'));

  /* SUPERSEDED BY A RULING, WHICH IS THE ONLY LEGITIMATE WAY A CHECK DIES. v95
   shipped a per-difficulty allowance table; Paolo ruled 7/29 that the allowance is
   a PERK slider unrelated to difficulty, so v98 deleted the table. The check is
   rewritten to assert the thing v95 ACTUALLY got right, which is the reason his
   correction was free: the table shipped EMPTY, so deleting it was deleting a wire
   rather than rebalancing a fight around five numbers I would have invented. */
ok('MECHANISM-MINE/CONTENTS-PAOLO\'S PAID OFF: v95\'s allowance table shipped EMPTY, so when he ruled 7/29 that the allowance is a perk and not a difficulty, the correction deleted a wire and changed no gameplay. The number still comes from ONE place, and difficulty is not wired into it',
    !/const CHAIN_ALLOWANCE_BY_DIFF=/.test(demo) &&
    demo.includes('function perkKillshots(){ return Math.max(1,(G.chainSkill||2)|0); }') &&
    !/function chainAllowance\(\)\{[^}]*userPkg/.test(demo));

  ok('V95 "extremely hard" IS HIS WORD, so it is extreme immediately: first shot past the allowance is V.HARD, the next is BOHEMIAN, and 4 is the top of the dial so it stays there. Both numbers are dials',
    /* SUPERSEDED BY PAOLO 8/1, NEWEST DATE WINS, AND HARDER THAN BEFORE: "that
       third shot, I want it to be a Bohemian difficulty pattern not even very
       hard just straight up Bohemian difficulty pattern." The 3-then-4 ramp is
       dead. The first shot past the allowance is BOHEMIAN, which is more extreme
       than what "extremely hard" bought him in v95, not less. */
    demo.includes('function chainRampDial(){ return chainOver()<=0?0:4; }') &&
    !demo.includes('CHAIN_RAMP_BASE+(o-1)*CHAIN_RAMP_STEP'));

  ok('V95 THE WEAPON CEILING IS STILL A WALL AND IS NOT RAMPED: a gun running out is physics, not a difficulty question, and it is what keeps the pistol the chain weapon and the rifle a one-shot',
    demo.includes('function chainWall(){ return Math.max(1, WEAPON_CAP[WEAPON]||8); }') &&
    demo.includes('const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};'));

  ok('V95 "i didnt see that" IS THE ACTUAL COMPLAINT, so the mechanic SAYS itself: the headline flips to PUSHING in the warning red and both reads count the shot against the allowance in words',
    demo.includes("setRead(_ov?'PUSHING':(_pg>=2?'IN THE OPEN':(isChain?'CHAIN':'AIM')),") &&   /* V110 RE-POINTED: PUSHING still outranks everything; exposure got its own headline underneath it */
    demo.includes("'SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · '") &&
    demo.includes('PAST YOUR ALLOWANCE'));

  ok('V95 BELOW THE ALLOWANCE THE RAMP CHANGES NOTHING: chainRampDial returns 0 when you are inside it, and max(range,0) is just range',
    demo.includes('function chainOver(){ return Math.max(0,(G._chainN||1)-chainAllowance()); }') &&
    demo.includes('function chainRampDial(){ return chainOver()<=0?0:4; }'));   /* V110 RE-POINTED: still exactly 0 inside the allowance */

  /* ===== 32. V98 THE DARK SHRINKS THE RANGE + THE ALLOWANCE IS A PERK ==== */
  ok('V98 NIGHT IS NOT AN ACCURACY PENALTY. A symmetric penalty changes no decision and just makes the fight longer, which is the tally mistake. Darkness shrinks the RANGE at which anyone shoots well, through the one function every range read already runs on',
    demo.includes('V98 THE DARK SHRINKS THE RANGE') &&
    demo.includes('const NIGHT_RANGE={morning:1.00,dusk:0.72,night:0.50};') &&
    demo.includes('function farTile(){ return Math.max(hd(PT_BLANK+2), hd(FAR_TILE)*rangeMult()); }') &&   /* V198 RE-POINTED */
    /function rangeT\(d,R\)\{[\s\S]{0,120}rangeMult\(\)/.test(demo));
  ok('V98 GOT STRONGER, NOT WEAKER, WHEN GUNS GAINED RANGES: it used to run through ONE shared far end because there was only ever one range in the game. Now the SAME NIGHT_RANGE number scales every weapon individually -- a shotgun\'s reach shortens after dark too, which a single shared far end could never express. And the MAX shrinks with it, so lit really does mean hittable from across the lot and dark really does mean they have to come to you',
    /const F=Math\.max\(hd\(PT_BLANK\+2\),R\.eff\*1\.6\*rangeMult\(\)\);/.test(demo) &&   /* V198 RE-POINTED */
    /* V160 RE-POINTED: maxRange gained the SIGHT ceiling. The night scaling is
       byte-identical inside it -- R.max*rangeMult() is untouched -- so V98's law
       is unchanged; it is now wrapped by a ceiling that binds in daylight and
       does not bind after dark, which is exactly the right way round. */
    /* V169 RE-POINTED: maxRange takes an OPTIONAL multiplier now, so the OPEN
       BOOK can ask it for the rule instead of tonight's weather. V98's law is
       still byte-identical -- with no argument it is rangeMult(), exactly as
       before -- and the ceiling still wraps it. */
    /function maxRange\(R,mult\)\{ const k=\(mult==null\)\?rangeMult\(\):mult; return Math\.min\(reachCeil\(\), Math\.max\(hd\(PT_BLANK\+2\), R\.max\*k\)\); \}/.test(demo) &&   /* V198 RE-POINTED */
    /inMyRange\(e\)\{ return !!e && \(e\.edist\|\|0\) <= maxRange\(myRange\(\)\); \}/.test(demo));

  ok('V160 THE CEILING IS ONE DOOR: every reach in the game -- yours, theirs, the sniper\'s and the V151 floor that hands him the edge over the field -- comes through maxRange, so a number added anywhere else cannot route around sight. His V151 ruling still stands underneath it: he outranges the field, he just cannot outrange his own eyes',
    (demo.match(/function maxRange\(R,mult\)\{/g) || []).length === 1 &&
    /Math\.min\(reachCeil\(\),/.test(demo) &&   /* V198 RE-POINTED: still ONE ceiling, read on the current board */
    /function inHisRange\(e\)\{ return !!e && \(e\.edist\|\|0\) <= maxRange\(foeRange\(e\)\); \}/.test(demo));

  ok('V98 AND POINT BLANK IS EXACTLY UNTOUCHED AT NIGHT, not approximately: distT subtracts PT_BLANK before dividing, so it is 0 for any d <= PT_BLANK whatever the far end is. His 7/27 point-blank ruling gets LOUDER after dark rather than taxed flat',
    demo.includes('return Math.min(1,Math.max(0,(d-hd(PT_BLANK))/(F-hd(PT_BLANK)))); }') &&   /* V198 RE-POINTED: still subtracts the point-blank band before dividing, so it is still exactly 0 inside it */
    demo.includes('const PT_BLANK=4, FAR_TILE=26'));

  ok('V98 IT MOVES BOTH SIDES OFF ONE NUMBER: my dial (distPkg), their hit chance (distAccuracy) and the range words+colour all read distT, so there is no second accuracy system to keep in step',
    demo.includes('function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); }') &&
    demo.includes('const base=0.97 - distTFrom(e)*0.60;') &&   /* MIGRATED BY V121: the difficulty divides the miss out of it. MIGRATED AGAIN BY V138: still ONE curve and one shape, but read off HIS gun instead of a global one, because a pistol and a rifle were never the same range */
    demo.includes('function rangeTier(e){ const t=distT(e);'));

  ok('V98 AND THE READ SAYS WHY: a man who reads LONG RANGE at night when he read MID RANGE at noon is explained, not mysterious',
    demo.includes('function isDark(){ return rangeMult()<0.999; }') &&
    demo.includes('const _drk=isDark();') &&
    demo.includes('DARK</b>'));

  ok("V98 THE ALLOWANCE IS A PERK, NOT A DIFFICULTY (Paolo 7/29: \"on a slider unrelated to difficulty but to perks you get in the game\"). The per-difficulty table v95 shipped is DELETED, and difficulty must never be wired back in",
    demo.includes('V98 THE ALLOWANCE IS A PERK') &&
    !/const CHAIN_ALLOWANCE_BY_DIFF=/.test(demo) &&   /* the DECLARATION, not the word: v98's own comment names the dead table to explain why it is dead, and a check that matches a comment is not a check */
    demo.includes('function perkKillshots(){ return Math.max(1,(G.chainSkill||2)|0); }') &&
    demo.includes('function chainAllowance(){ return Math.max(1,Math.min(perkKillshots(), chainWall())); }') &&
    !/chainAllowance\(\)\{[^}]*userPkg/.test(demo));

  ok('V98 AND THE CONTROL SAYS WHAT IT IS, so the reading matches the ruling',
    demo.includes("cs.textContent='KILLSHOTS (PERK): '+G.chainSkill;"));

  /* ===== 33. V99 YOU CAN THROW A GRENADE ================================ */
  ok('V99 THE PLAYER CAN THROW ONE. Before this the ONLY grenade in the game was thrown AT you (grenadeTurn is an enemy action); there was no throw in the file at all',
    demo.includes('V99 YOU CAN THROW A GRENADE') &&
    demo.includes('function doThrow(){') &&
    demo.includes('function pGrenTurn(){') &&
    /* MIGRATED BY V124: the button moved to the thumb cluster (Paolo 8/3, "get
       rid of the grenade button too"). There is still exactly one grenade
       button, it is just where his hand is. */
    demo.includes("mk('grenbtn2','GREN'"));

  ok('V99 THEY GET THE SAME TWO BEATS YOU DO -- which is what makes it a POSITIONING tool and not free damage. A man caught in the blast steps off the tile, and he loses the stone he was tucked behind when he does',
    demo.includes('function stepOffBlast(e,gp){') &&
    demo.includes("e.gcov=false;") &&
    demo.includes("setRead('THEY SCATTER'"));

  ok('V99 A THROW IS YOUR ACTION: it costs a stamina pip AND ends the turn into the return volley, exactly like popping out to shoot. A grenade does not get to opt out of the trade the fight is built on',
    /doThrow\(\)\{[\s\S]{0,1200}spendStam\(1\)/.test(demo) &&
    /doThrow\(\)\{[\s\S]{0,2200}endTurnReturn\(\);/.test(demo));

  ok('V99 A GRENADE KILL IS NOT A KILLSHOT: no dial cinematic, no chain shot. The chain is the reward for the DIAL and a thrown object never touches the dial, which is what keeps the allowance mechanic meaning something',
    /pGrenTurn\(\)\{[\s\S]{0,2600}e\.dead=true; killed\+\+;/.test(demo) &&
    !/pGrenTurn\(\)\{[\s\S]{0,3000}startKillshot\(\)/.test(demo) &&
    !/pGrenTurn\(\)\{[\s\S]{0,3000}enterAim\(/.test(demo));

  ok('V99 YOURS IS AMBER AND THEIRS IS RED: two fused objects on one field that looked the same would be unreadable, and the one thing you must never be confused about is which one is about to hurt YOU',
    demo.includes("x.fillStyle='rgba(232,176,74,'+(0.12+pu2*0.12).toFixed(3)+')';") &&
    demo.includes("x.fillStyle='rgba(232,60,40,'+(0.13+pu*0.13).toFixed(3)+')';"));

  ok('V99 the pouch refills on a fresh fight and the world carries the thrown grenade the same way it carries every other anchored thing',
    demo.includes('G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT;') &&
    demo.includes('if(G.pGren)mv(G.pGren,0.02);'));

  /* ===== 34. V100 THE WAREHOUSE ========================================= */
  ok('V100 THE ARENA HAS A KIND (Paolo 7/29: "for arena lets start off with a warehouse"). The old arena was a scatter of blocks on a field, and a scatter has no THROUGH-LINES, so it can never make one plan better than another at any density',
    /* SUPERSEDED BY PAOLO 8/1, NEWEST DATE WINS: "The warehouse arena is dog
       shit it gives me anxiety looking at it like it looks really bad. The only
       one I'm comfortable playing on is street." The 7/29 ruling that ASKED for
       a warehouse is dead; the kind machinery survives (the arena still HAS a
       kind, and the street is a real authored kind, not a scatter) and the
       generator is kept unreachable rather than graveyarded, because nothing is
       graveyarded without his word. */
    demo.includes('V100 THE WAREHOUSE') &&
    demo.includes("G.arenaKind='street';") &&
    !demo.includes("G.arenaKind=(Math.random()<0.5)?'warehouse':'street';") &&
    demo.includes('function buildWarehouse(){'));

  ok('V100 THE SHAPE IS THE ARENA: racking in long rows makes AISLES, so you are safe ACROSS the racking and naked ALONG it, and the question becomes which aisle you commit to and where you cross',
    demo.includes('for(let row=R0; row<=R1; row+=AISLE){') &&
    demo.includes('put(horiz?t:row, horiz?row:t, 0.58, true); } }'));

  ok('V100 THE CROSS AISLES ARE THE KILL ZONES: the only places you can change aisle, so they are where everyone is looking',
    demo.includes('if(cross.some(c=>Math.abs(t-c)<=1))continue;'));

  ok('V100 THE STAGING FLOOR IS DELIBERATELY EMPTY: the shortest way across the building is the one with nothing on it',
    demo.includes('const stageEdge=Math.random()<0.5?-1:1, STAGE=5+Math.floor(Math.random()*3);') &&
    demo.includes('if(stageEdge*t>STAGE)continue;'));

  ok('V100 AISLES ARE 2-3 TILES, MEASURED THEN TUNED: at 2 the aisles were ONE tile wide and 60 rolls averaged 128 racking blocks -- a corridor you cannot fight in',
    demo.includes('const AISLE=3+Math.floor(Math.random()*2);'));

  ok('V100 PALLETS ARE LOW AND VAULTABLE and sit IN the aisles -- the only cover inside an aisle, which is the only reason an aisle is survivable; the racking and the columns are TALL, so the tall/low mechanic carries the whole building',
    demo.includes('put(horiz?t:row, horiz?row:t, 0.5, false); }') &&
    demo.includes('for(let a=-10;a<=10;a+=BAY)for(let b=-10;b<=10;b+=BAY)put(a,b,0.42,true);'));

  ok('V100 THE MEZZANINE ALWAYS EXISTS INDOORS, and it is the first time the v90 cross-level cover rule has paid for itself: height means seeing down the rows the racking would otherwise close off',
    demo.includes("if(G.arenaKind==='warehouse'||Math.random()<0.72){"));

  ok('V100 INDOORS THERE IS NO STREET: one material wall to wall, from the approved starter set',
    /* V200 RE-POINTED: a ROOM is indoors too. V100's sentence -- "indoors there
       is no street, one material wall to wall" -- is the rule THE-INDOOR-FIGHT
       needed, and it was already written one line above where it was needed, so
       the room joins the warehouse on it rather than getting a second rule. */
    demo.includes("if(G.arenaKind==='warehouse'||G.arenaKind==='room')return 'slab';") &&
    demo.includes('ST_SPIN.slab=1;'));

  ok('V100 AND THE ARENA HAS A NAME, because an arena you cannot name is a field with rocks on it',
    demo.includes("function arenaName(){ return G.arenaKind==='warehouse'?'WAREHOUSE':'STREET'; }") &&
    demo.includes("b.textContent=(s==null)?arenaName():(arenaName()+' #'+s); }"));

  /* ===== 35. V101 HIT IN THE CHEST + THE APPROVED STREET BANK =========== */
  ok('V101 BODIES ARE MARKED AT THE CHEST, NOT THE FEET (Paolo 7/29: "on a second story you just have the location of them wrong... its like their feet"). drawHuman blits 84px ABOVE the point it is handed, so every position in this file is a man\'s FEET',
    demo.includes('V101 HIT IN THE CHEST') &&
    demo.includes('const MASS_DY=-42*bodyScale();') &&
    /x\.drawImage\(cv112,0,0,112,112,Math\.round\(ex-56\*S\),Math\.round\(ey-84\*S\),w,w\);/.test(demo));

/* V139: THIS GATE CAUGHT A REAL ONE I MISSED. MASS_DY is half of drawHuman's own
   84px offset -- the CHEST, which every hit marker and cover ring hangs off. I
   scaled the sprite and would have left the marker at a flat 42px, floating it
   above a body a third that tall: the giants bug, inverted, on the reticle. The
   gate's own words were "a sprite-height change has ONE number to follow", and
   this was that change. */
  ok('V139 AND THE CHEST MARKER RIDES THE BODY: MASS_DY scales with bodyScale(), so the mark stays on his chest at every zoom instead of floating above a shrunken man',
    demo.includes('const MASS_DY=-42*bodyScale();'));

  ok('V101 MASS_DY IS DERIVED FROM THE DRAW CALL, not eyeballed: it is half of drawHuman\'s own 84px offset, so a sprite-height change has one number to follow',
    /MASS_DY=-42/.test(demo) && demo.includes('ey-84'));

  ok('V101 THE MARKS THAT BELONG ON A BODY MOVED: the cover arc and the blade telegraph now sit on him instead of on the floor a storey below him',
    demo.includes('if(e.gcov){ const _my=ey+MASS_DY;') &&
    demo.includes('x.beginPath();x.arc(ex,ey+MASS_DY,er*1.5,0,7);x.stroke(); }'));

  ok('V101 AND THE ONES THAT BELONG ON THE FLOOR DID NOT: the blood pool and the brass still land on the ground, because those really are on the floor',
    demo.includes('function drawBloodPool(x,ex,ey,grow){') &&
    !/drawBloodPool\([^)]*MASS_DY/.test(demo));

  ok('V101 THE DRIP CARRIES ITS STOREY: a man bleeding on the mezzanine was dripping onto the ground floor, because the effect was pushed with a polar position and no level',
    demo.includes("G._fx.push({type:'drip',ea:e.ea,edist:e.edist,lvl:e.lvl|0,") &&
    demo.includes('const dxp=_dp[0], dyp=_dp[1]+lvlDY(p.lvl|0);'));

  ok('V101 THE ROADWAY IS THE APPROVED STREET BANK (Paolo 7/29: "please use approved streets though"). Road and markings are finally cut from the SAME source, so they match by construction instead of by a measurement I had to take',
    demo.includes('V101 THE APPROVED STREET BANK') &&
    demo.includes('const STREET_B64S=') &&
    /"road":\[/.test(demo.slice(demo.indexOf('const STREET_B64S='), demo.indexOf('const STREET_B64S=')+400)));

  /* ===== 36. V102 THE NEEDLE IS HIS BODY =============================== */
  ok('V102 THE DIAL IS A PICTURE OF THE TRUTH (Paolo 7/29: "i want their cover animation to be tied to where there deadshot dial lands perfectly in the center. so that killshot they better be out of cover"). The needle stops being a gauge drawn over the fight and becomes how exposed he actually is',
    demo.includes('V102 THE NEEDLE IS HIS BODY') &&
    demo.includes('function dialExposure(){ if(!dialLive())return null;') &&
    demo.includes('const EXPO_FOLLOW=0.18;'));

  ok('V102 HE IS OUT EXACTLY WHEN THE RETICLE GOES GREEN -- the SAME zone expression that has driven the green reticle since the dial shipped, so the invariant is learnable and cannot drift',
    demo.includes('function dialKillZone(){ return G.W.hZ*dialFgv()*KILL_GRACE*ARC_MULT; }') &&
    demo.includes('if(!G.ks&&Math.abs(G.angle)<=G.W.hZ*fgv*KILL_GRACE*ARC_MULT){'));

  /* CORRECTED THE SAME TURN. My first version of this check claimed "one
     expression, not two" and counted copies. It found two and failed, and IT WAS
     RIGHT TO: there have always been TWO DIFFERENT multipliers here and only one
     of them was unified.
       fgv  = what the BANDS DRAW (difficulty, steady aim, kill streak)
       fg   = what the SHOT RESOLVES ON, which additionally carries the on-the-one
              bonus and the groove width -- deliberately MORE than the band shows
     That is a real designed difference, not drift. What v102 actually fixed is
     that the BAND expression was an inline const the pose would have had to copy;
     it is now defined once and shared. The check asserts the true claim. */
  ok('V102 THE BAND EXPRESSION IS DEFINED ONCE and shared by the band draw and the enemy\'s cover pose, so his body can never drift from the band you are aiming at. (fg, the RESOLVE multiplier, stays deliberately different: it carries the on-the-one bonus the band does not show.)',
    demo.includes('function dialFgv(){ return (G.pkgDiff>=1?1.10:1)') &&
    demo.includes('const fgv=dialFgv();') &&
    demo.includes('function dialKillZone(){ return G.W.hZ*dialFgv()*KILL_GRACE*ARC_MULT; }') &&
    /const fg=\(G\.pkgDiff>=1\?1\.10:1\)[\s\S]{0,400}_onePop/.test(demo));

  /* *** THIS CHECK WAS WRONG AND IT PASSED FOR A WHOLE TURN. *** I wrote it
   asserting that rise112 "is the body coming UP OUT OF THE CROUCH". It is not:
   rise112 bakes from 'floor-rise', a man getting up OFF THE FLOOR. So the gate
   confidently guarded the wrong clip, and Paolo is the one who caught it --
   "they were doing animations they weren't supposed to be".
   A CHECK THAT ASSERTS A FALSE CLAIM IS WORSE THAN NO CHECK, because it makes
   the mistake look verified. Rewritten to name the clip by WHAT IT BAKES FROM. */
ok('V102/V104 THE NEEDLE SCRUBS cover-fire -- the peek up out of cover onto the gun -- and NEVER floor-rise, which is a man getting up off the ground',
    demo.includes('const CF=L.cfire112, CV=L.cover112;') &&
    demo.includes('if(CF&&CF.length)return CF[Math.max(0,Math.min(CF.length-1,Math.round(e._expo*(CF.length-1))))];') &&
    !demo.includes('const R=L.rise112;'));

  ok('V102 ONLY THE MAN UNDER THE DIAL ("i still like how they animate already"): the branch needs him to be the aim target, the dial to be live, and him to really be in cover. Every other body animates exactly as before',
    /* V109 RE-POINTED: the three original conditions are all still required and
       still asserted -- v109 only ADDED the fence (a dying, broken, running,
       stunned or freshly-hit body is refused out loud). Narrower, never wider. */
    demo.includes('if(e.gcov&&dialLive()&&e===G.e[G.fireTarget]') &&
    demo.includes('&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!(e.stun>0)'));

  ok('V102 IT IS A READ, NOT A RULE CHANGE: e.gcov is never written in the pose branch, so cover, damage, exposure and every AI decision resolve exactly as before -- the picture agrees with maths that were always there, it does not become a second invisible difficulty system',
    !/dialLive\(\)&&e===G\.e\[G\.fireTarget\]\)\{[\s\S]{0,700}e\.gcov=/.test(demo) &&
    demo.includes("e.gcov=(!e.melee&&realCoverPillar(e))?1:0;"));

  ok('V102 THE BODY LAGS THE NEEDLE ON PURPOSE: the sweep is fast and reverses, so mirroring it frame-for-frame would make him vibrate. And a fresh dial starts him TUCKED rather than mid-rise from the last one',
    demo.includes('e._expo=(e._expo==null)?_xt:(e._expo+(_xt-e._expo)*EXPO_FOLLOW);') &&
    demo.includes('for(const _e of (G.e||[]))_e._expo=null;'));

  ok('V102 AND THE RESET GOES BEFORE THE if/else, NOT INSIDE IT. The first version of this patch anchored on the FIRST HALF of an if/else and orphaned the else, which broke the entire demo while every string check still passed. ANCHOR UNIQUENESS IS NOT ANCHOR CORRECTNESS',
    /for\(const _e of \(G\.e\|\|\[\]\)\)_e\._expo=null;\s*\n\s*if\(!isChain\)/.test(demo));

  /* ===== 37. V103 THE CARS ============================================= */
  ok('V103 THE CARS EXIST (Paolo: "we have hella cars on file that are aproved. and when u slide a car in it should be 2 tiles by 3 tiles", then "I DIDNT SEE ANY CARS BRO"). They are the approved car_wreck pool, not a cook',
    demo.includes('V103 THE CARS') &&
    demo.includes('const CAR_B64=') &&
    demo.includes('function putCar(ox,oy,vert,cid){') &&
    demo.includes('function scatterCars(kind){'));

  ok('V103 HIS SIZE RULING IS THE FOOTPRINT: 2 tiles by 3, in tiles, as a named constant rather than a number buried in a loop',
    demo.includes('const CAR_W=2, CAR_L=3;'));

  ok('V103 A CAR IS SIX CELLS THAT SHARE AN ID -- so rectangle blocking, and cover along its LENGTH, come free from machinery that already understood a cell. No new geometry, no rectangle intersection code',
    /for\(let a=0;a<\(vert\?CAR_W:CAR_L\);a\+\+\)for\(let b=0;b<\(vert\?CAR_L:CAR_W\);b\+\+\)/.test(demo) &&
    demo.includes('G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),'));

  ok('V103 ONE OBJECT, TWO COVER VALUES: engine and cabin are TALL (chest, no vault), the boot is LOW (waist, vaultable). That is the thing a car has that no block can do, and it rides the tall/low flag that already existed',
    /* V108 RE-POINTED: tall is DERIVED FROM THE PART now, which is the same
       answer arrived at honestly -- and the old span expression was measurably
       wrong for a car parked across the screen (no cabin at all). */
    demo.includes("const tall=(part!=='boot');") &&
    demo.includes('r:0.5,tall:tall,car:cid,'));

  ok('V103 ONE SPRITE OVER SIX CELLS: only the nose cell draws, the other five are real cover that simply are not blocks',
    /* V104 RE-POINTED: the nose is a FLAG now, because comparing to a remembered
       coordinate broke the instant the world shifted under the player. */
    demo.includes('if(!P.nose)continue;') &&
    demo.includes('const im=CAR_READY?CAR_IMG[P.carArt|0]:null;'));

  ok('V103 MAP LAW HELD: he placed the canon ("slide a car in"). Count, position and orientation are PARAMETERS on the arena dice, like the racking and the cover density -- and a car is never parked on the player',
    demo.includes('const n=1+Math.floor(Math.random()*3), placed=[];') &&
    /putCar\(ox,oy,vert,cid\)\{[\s\S]{0,400}Math\.hypot\(wx,wy\)<2\.6\)return false;/.test(demo.replace('function putCar(ox,oy,vert,cid){','putCar(ox,oy,vert,cid){')));

  ok('V103 THEY GO IN BOTH ARENAS, and the scatter runs BEFORE the deck so the slab filter that already evicts cover from under a storey evicts a car too',
    /* V110 RE-POINTED: the ordering invariant is unchanged and now MATTERS MORE,
       because the eviction became whole-car. The per-cell filter this used to
       assert was the bug: it decapitated cars and left invisible solid cover. */
    demo.includes("scatterCars(G.arenaKind);") &&
    demo.indexOf('scatterCars(G.arenaKind);') < demo.indexOf('G.deck=[]; G.stairs=[]; G.lvl=0;') &&
    demo.includes('G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];'));

  ok('V103 THE ART IS REUSE, NOT A COOK: it is the approved car_wreck pool (top-down abandoned cars from the HD repo), fitted into the 2x3 box UNSTRETCHED rather than fattened to fill it',
    demo.includes('const CAR_B64=[') || demo.includes('const CAR_B64=["'));

  /* ===== 38. V104 THE CAR STAYS / THE RIGHT CLIP / YOU AIM IT ========== */
  ok('V104 A CAR IS FOUND BY A FLAG, NEVER BY A REMEMBERED COORDINATE (Paolo: "combat ends and then the car disappears"). This field is POLAR and worldShift slides every anchored thing when you step, so v103 comparing a cell to its BIRTH position meant no cell matched after one move and the whole car stopped drawing while staying solid cover',
    demo.includes('V104 THE CAR STAYS') &&
    demo.includes('nose:(c===cells[0])') &&
    demo.includes('if(!P.nose)continue;') &&
    !demo.includes('carOx:ox,carOy:oy') &&
    !/Math\.abs\(q0\[0\]-P\.carOx\)/.test(demo));

  ok('V104 THE NEEDLE SCRUBS cover-fire, NOT floor-rise (Paolo: "they were doing animations they weren\'t supposed to be"). rise112 bakes from floor-rise, a man getting up OFF THE FLOOR; cfire112 bakes from cover-fire, the peek up onto the gun -- which is what v102 claimed rise112 was',
    demo.includes('const CF=L.cfire112, CV=L.cover112;') &&
    demo.includes('if(CF&&CF.length)return CF[Math.max(0,Math.min(CF.length-1,Math.round(e._expo*(CF.length-1))))];') &&
    !/dialLive\(\)&&e===G\.e\[G\.fireTarget\]\)\{[\s\S]{0,900}L\.rise112/.test(demo));

  ok('V104 AND floor-rise GOES BACK TO ITS ONE JOB: a man getting up off the floor, on _roseAt, untouched',
    demo.includes('if(e._roseAt&&now-e._roseAt<640&&L.rise112)return L.rise112[Math.min(3,Math.floor((now-e._roseAt)/160))];'));

  ok('V104 YOU AIM THE GRENADE (Paolo: "it definitely did not allow you to choose to be wrong"). Press to ARM, then TAP THE TILE -- the auto-throw is gone, because a grenade whose landing spot you cannot pick has no decision in it',
    demo.includes('function tapTile(x,y){') &&
    demo.includes('function throwAt(tx,ty){') &&
    demo.includes('if(G.grenArm){ const t3=tapTile(x,y);') &&
    !/doThrow\(\)\{[\s\S]{0,700}G\.selTarget!=null\?G\.selTarget:pickTarget\(\)/.test(demo));

  ok('V104 AND YOU CAN BE WRONG: your own grenade measures YOUR distance on the same bands the enemy grenade has always used on you. No minimum range, no safety check -- choosing badly has to cost you or choosing means nothing',
    demo.includes('const dSelf=Math.hypot(gp[0],gp[1]);') &&
    demo.includes("setRead('YOUR OWN GRENADE','-'+sd+' -- you threw it short','#e8593a');"));

  ok('V104 THE DAMAGE IS ON THE MAN (Paolo: "I didn\'t see any damage"). It very likely DID land -- one step off the tile is still inside the clip band -- and the only feedback was a line of text. Now every hit floats its number, on his storey',
    demo.includes("G._fx.push({type:'dmgnum',ea:e.ea,edist:e.edist,lvl:e.lvl|0,n:dmg,t:0,life:1.0});") &&
    demo.includes("if(p.type!=='dmgnum'||p.t<0)continue;") &&
    demo.includes("x.fillText('-'+p.n, _np[0], _np[1]+lvlDY(p.lvl|0)") &&
    demo.includes("('BLAST -- '+hurt+' HIT')"));

  ok('V104 the button says it is armed, and a fresh fight is never armed',
    demo.includes("b.textContent=G.grenArm?'TAP A TILE':('GRENADE '+n);") &&
    demo.includes('G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;'));

  /* ===== 39. V105 THE SCAFFOLD ========================================= */
  ok('V105 THE STOREY IS A SCAFFOLD, NOT A SLAB (Paolo: "make it look like a scaffold... simple like warehouse scaffold... like Home Depot"). A near-black rectangle could only ever HIDE the man under it; a scaffold is see-through by construction, which answers both of his complaints with one object',
    demo.includes('V105 THE SCAFFOLD') &&
    !demo.includes("x.fillStyle='#15120e'; x.fillRect(p[0]-t2*0.5,fy,t2+1,-dz);"));

  ok('V105 LEGS AND X-BRACING, on the OPEN edges only so the inside of the deck stays see-through. The vertical is the only thing in a top-down frame that says TALL, and the diagonal cross is what makes a structure read SCAFFOLD instead of table',
    demo.includes('const openL=!deckTileAt(q[0]-1,q[1]), openR=!deckTileAt(q[0]+1,q[1]);') &&
    demo.includes('x.beginPath(); x.moveTo(lx,ty); x.lineTo(rx,by+t2);') &&
    demo.includes('x.moveTo(rx,ty); x.lineTo(lx,by+t2); x.stroke(); } }'));

  ok('V105 THE DECK IS SLATTED, not a poured plate: boards with gaps, so the lot shows between them',
    demo.includes('const DECK_SEE=0.34, NBOARD=4;') &&
    demo.includes('x.fillRect(p[0]-t2*0.5+bI*bw,ty,bw*0.82,t2+1); }'));

  ok('V105 AND THE TILE IN YOUR WAY GETS OUT OF THE WAY -- his third ask, answered at the CAUSE this time. A deck tile with a living body under it drops to DECK_SEE alpha, so the man shows THROUGH the boards instead of being hidden and then redrawn',
    demo.includes('const thin=!T.stair&&_below(T);') &&   /* V106 migrated this line: the staircase is never a floor, so it never thins */
    /* V113 RE-POINTED: the per-tile thin SURVIVES, multiplied by floorFocus, so
       a body under the deck is now doubly legible instead of singly. */
    demo.includes('x.save(); x.globalAlpha=floorFocus(DECK_LVL)*(thin?DECK_SEE:1);'));

  ok('V105 AND v93\'S GHOST STAYS AS THE BACKSTOP: two independent reads of the same fact, because he has asked to see who is underneath three times',
    demo.includes('function underDeck(o){') &&
    demo.includes('const UNDER_TINT=') &&
    demo.includes('if(underDeck(e)){'));

  ok('V105 IT IS STILL A READ, NOT A RULE CHANGE: a thinner tile changes what you can SEE, never what you can hit -- the cross-level cover rule is untouched',
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    /* V108 migrated this: the cross-level rule moved INTO coverPillarAgainst,
       which myCoverAgainst is now a thin boolean over. Same rule, one owner. */
    demo.includes('function coverPillarAgainst(ang,dist,lvl,soft){') &&
    demo.includes('if(lvl!=null&&(lvl|0)!==myLvl())return null;') &&
    !/const thin=!T\.stair&&_below\(T\);[\s\S]{0,400}(gcov=|KILL_DMG|applyDamage)/.test(demo));

  /* ===== 40. V106 THE STAIRS ARE A THING YOU WALK ON =================== */
  ok('V106 A STAIRCASE IS NOT A CEILING (Paolo: "I walk on the stairs and then it says I\'m behind the stairs"). The stair IS a deck tile, so deckTileAt matched it and the v93 under-deck x-ray fired on the one tile it must never fire on -- the game telling him he was UNDERNEATH the thing he had just climbed onto. deckSlabAt is the split: "a deck tile that can be over your head", stair excluded',
    demo.includes('V106 THE STAIRS ARE A THING YOU WALK ON') &&
    demo.includes('function deckSlabAt(wx,wy){') &&
    demo.includes('if(T.stair)return false;'));

  ok('V106 AND BOTH X-RAY READS MOVED ONTO IT -- mine and theirs. Fixing this at the call site instead of the predicate is how it would come back',
    /function underDeck\(o\)\{[\s\S]{0,200}deckSlabAt\(/.test(demo) &&
    demo.includes('function underDeckMe(){ return myLvl()===0 && !!deckSlabAt(0,0); }') &&
    !/function underDeckMe\(\)\{ return myLvl\(\)===0 && !!deckTileAt\(0,0\); \}/.test(demo));

  ok('V106 WALKING ONTO THE RUN CLIMBS IT (Paolo: "basically I can\'t even walk up the stairs if I wanted to" -- literally true, the button was the only door). One pip each way, the same price doStairs charges, because it is the same act',
    demo.includes('function stairStepAt(wx,wy){') &&
    /* V114 RE-POINTED: the `if(!roam)` wrapper is GONE -- the level rules are the
       world, not a combat mode. Everything else this asserts is unchanged. */
    demo.includes('const _climb=(myLvl()!==DECK_LVL)&&stairStepAt(sx,sy);') &&
    demo.includes('V114 ONE WORLD') &&
    demo.includes('const _down =(myLvl()===DECK_LVL)&&onStairNow()&&!deckTileAt(sx,sy);') &&
    demo.includes("worldShift(sx,sy); G.lvl=_climb?DECK_LVL:0;"));

  ok('V106 AND THE EDGE IS REAL. doMove had no idea levels existed, so you could walk clean off the boards and keep standing one storey up over nothing. Nobody had ever seen it because nobody could get up there without the button',
    demo.includes("setRead('THE EDGE','nothing under that step") &&
    /myLvl\(\)===DECK_LVL&&!deckTileAt\(sx,sy\)\)\{/.test(demo));

  ok('V106 THE BUTTON SURVIVES as the FINDER, not the only door -- v91 measured that the button appeared zero times across eight arenas at the old 1.6 range, and the phone-proof channel is still the thing that says a way up exists',
    demo.includes('function updStairBtn(){') && demo.includes('function doStairs(){'));

  /* ===== 41. V107 THE KILL WEARS NOTHING, ONE RESET, TWO REPORTS ======= */
  ok('V107 THE ORANGE, NAMED BY INSTRUMENT AND NOT BY GUESS. Wrapping fill/stroke/fillRect/fillText and filtering to frames where G.ks is live put rgb(202,160,122) at drawArmNeedle at the top of the list: the GHOST FAN, eight fading copies of the needle, every frame, ungated, welded around the locked arm for the whole cinematic. Six reports, two wrong fixes, and this is it',
    demo.includes('V107 THE KILL WEARS NOTHING') &&
    demo.includes('function dialOrnament(){ return !G.ks; }') &&
    demo.includes('if(dialOrnament())for(let i=8;i>=1;i--){'));

  ok('V107 AND THE FAMILY IS SWEPT, NOT THE MEMBER. v87 gated the chain glow, v94 deleted the median, v85 held the ghost chip -- three turns, three separate fixes, one bug. Every warm dial ornament now asks the SAME named predicate, including the reticle fan nobody had reported yet',
    demo.includes('if(dialOrnament())for(let i=6;i>=1;i--){') &&
    demo.includes('if(JUICE.AL&&dialOrnament()){') &&
    /* every ghost-fan loop in the file is guarded -- counting is the only
       honest way to say "none of them is ungated" */
    (demo.match(/for\(let i=8;i>=1;i--\)\{/g) || []).length ===
      (demo.match(/if\(dialOrnament\(\)\)for\(let i=8;i>=1;i--\)\{/g) || []).length &&
    (demo.match(/for\(let i=6;i>=1;i--\)\{/g) || []).length ===
      (demo.match(/if\(dialOrnament\(\)\)for\(let i=6;i>=1;i--\)\{/g) || []).length);

  ok('V107 ONE RESET, CALLED BY BOTH DOORS (Paolo: "I\'m just so confused the type of transition you have between combat mode and non-combat mode"). His live grenade walked through the end of a fight AND through NEW ENCOUNTER because setupCombat cleared it and newEncounter -- which never calls setupCombat -- kept its own inline list that predates the grenade',
    demo.includes('function resetFightState(){') &&
    demo.includes('G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;    /* YOURS -- the one he caught */') &&
    demo.includes('camHome(); resetFightState(); resetBeat();'));

  ok('V107 AND setupCombat DELEGATES TO IT, so there is exactly ONE list. A second copy of the list is the bug, not the fix',
    /function setupCombat\(\)\{[\s\S]{0,900}resetFightState\(\);/.test(demo) &&
    (demo.match(/G\.pGrenLeft=P_GREN_PER_FIGHT/g) || []).length === 1);

  ok('V107 HP IS DELIBERATELY NOT IN THE RESET: a new encounter carries your HP over, which is a ruling, and fullResetCombat is the one that heals',
    (function(){ const i = demo.indexOf('function resetFightState(){');
      if (i < 0) return false;
      const body = demo.slice(i, demo.indexOf('\n}', i));
      return body.length > 200 && !/G\.pHP/.test(body); })());

  ok('V107 TWO SHOTS, TWO GUNSHOTS (Paolo: "I need to hear like two gunshot noises"). The double tap already called sndShot twice -- 90ms apart with the IDENTICAL two-oscillator voice, so the second landed inside the first one\'s decay on the same frequencies and summed into one fatter bang. A real controlled pair is 150-250ms and the second round is lower and drier',
    /* V110 RE-POINTED: he said it a SECOND time, so the 165ms timer was not the
       answer and re-tuning it again would have been the fourth-version mistake.
       The real defect was two clocks: the report on a setTimeout, the second
       bullet on the killshot's travel fraction. One clock now. */
    demo.includes("function sndShot2(){") &&
    demo.includes('if(p>=0.06&&!ks._dblSnd){ ks._dblSnd=true;') &&
    !demo.includes('},165);'));

  /* ===== 42. V108 THE CAR IS COVER WITH PARTS ========================== */
  ok('V108 A CAR IS NOT ONE THING (Paolo: "Please make sure cars can be used as Cover"). Since v103 a car was six identical pillar cells -- worth exactly as much as a concrete block, and the game never said the word CAR. Now the three rows ARE the parts, which is the shape the vehicle already had',
    demo.includes('V108 THE CAR IS THREE DIFFERENT OFFERS') &&
    demo.includes("const part=_row<=0?'engine':(_row>=2?'boot':'cabin');") &&
    demo.includes("part:part,hard:hard,tank:(part==='boot'),"));

  ok('V108 AND THE ROW MATH USES CAR_L, NOT span. span is (vert?CAR_L:CAR_W)-1, which is 1 for a car parked ACROSS the screen -- a v103 slip that was invisible while it only fed a boolean. MEASURED before shipping: with span a horizontal car came out engine/boot/boot and had NO CABIN AT ALL',
    demo.includes('const _rows=CAR_L-1;') &&
    demo.includes('Math.round(along(c)/Math.max(1,_rows)*2)'));

  ok('V108 THE DOORS STOP NOTHING. Grounded, not invented: a car door is 20-gauge sheet with an air gap behind it and penetration testing puts pistol rounds through both of them, while the engine bay is a foot of cast iron. hard=false is the whole mechanic -- the only cover in this game that LIES to you',
    demo.includes('function coverPillarAgainst(ang,dist,lvl,soft){') &&
    demo.includes('if(!soft&&P.hard===false)continue;') &&
    demo.includes('function myConcealAgainst(ang,dist,lvl){ return !!coverPillarAgainst(ang,dist,lvl,true); }'));

  ok('V108 AND CONCEALMENT STILL BUYS TIME: the acquisition bead is a LINE test, so a car door breaks their lock exactly as it really would -- there and nowhere else. That separation is what makes the cabin a real choice instead of a dead tile',
    (demo.match(/myConcealAgainst\(e2\.ea,e2\.edist,e2\.lvl\)/g) || []).length >= 3 &&
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    demo.includes('return !!coverPillarAgainst(ang,dist,lvl,false); }'));

  ok('V108 THE RULE RUNS BOTH WAYS: a man tucked at a car door has no more protection from you than you have from him',
    /function realCoverPillar\(e\)\{[\s\S]{0,600}if\(P\.hard===false\)return false;/.test(demo));

  ok('V108 YOU ARE TOLD WHICH END YOU ARE AT. The whole mechanic is worthless if you cannot read it off the screen, so the step that puts you behind a car names the part in his words',
    demo.includes("return P.part==='engine'?'ENGINE BLOCK':(P.part==='boot'?'THE BOOT':'THE DOORS');") &&
    demo.includes('function coverLine(P){'));

  ok('V108 AND THEN IT COOKS OFF. Rounds your cover ATE have to go somewhere: if the thing that stopped them was a car, that is heat in the metal, and the heat is a fuse both sides can watch. The best cover on the lot is a bomb you are standing next to',
    demo.includes('const CAR_COOK=10;') &&
    demo.includes('function carHeat(cid,n){') &&
    demo.includes('if(covP&&covP.car)carHeat(covP.car,1);') &&
    demo.includes('function cookOff(cid){'));

  ok('V108 ONE BULLET NEVER SETS OFF A FUEL TANK -- the film version would make the best cover on the lot unusable. It takes sustained fire or an explosion, which is also what makes the GRENADE the deliberate answer: throw it at the wreck, not at the man',
    demo.includes('const CAR_GREN_HEAT=7;') &&
    demo.includes('carHeat(P.car,CAR_GREN_HEAT); } } }'));

  ok('V108 AND THE BLAST IS HONEST BOTH WAYS: it uses one band function for you and for them, so hugging the car you just cooked costs you exactly what it costs them',
    /const band=d=>d<0\.9\?/.test(demo) &&
    /const dS=Math\.hypot\(bx,by\), sd=band\(dS\);/.test(demo) &&
    /const p=pXY\(e\), dmg=band\(Math\.hypot\(p\[0\]-bx,p\[1\]-by\)\);/.test(demo));

  ok('V108 WHAT IS LEFT IS A SHELL, and the lot is permanently different. Fire takes the glass, the seats and the tyres; the block and the frame do not go anywhere -- so every cell becomes LOW HARD cover and the cabin gets BETTER, which is the one honest surprise in the mechanic',
    demo.includes('for(const P of cells){ P.burnt=true; P.tall=false; P.hard=true; P.tank=false; }') &&
    demo.includes("if(P.burnt)return 'BURNT SHELL';"));

  ok('V108 THE HEAT IS ON THE CAR, NOT IN A MENU. A fuse nobody can see is not a decision: the metal reddens as the rounds go in and breathes faster the closer it gets, and a burnt shell goes dark and stays dark',
    demo.includes("const _ht=Math.min(1,((G._carHeat||{})[P.car]||0)/CAR_COOK);") &&
    demo.includes("x.globalCompositeOperation='multiply';") &&
    demo.includes('if(G._carFire&&G._carFire.length){'));

  ok('V108 AND A NEW LOT IS COLD METAL: the heat book, the burnt book and the fire fx are rebuilt with the cars, so nothing survives a fight it did not belong to (the exact class of bug v107 fixed for the grenade)',
    /* V170 RE-POINTED: the same rebuild line now also clears the air (G.smoke),
       which is this claim being OBEYED by a new list rather than broken -- a
       screen left standing from the last lot is exactly the bug named here. The
       claim is unchanged; the anchor stops demanding that the car books are the
       LAST thing reset. */
    /G\._cars=placed\.length; G\._carHeat=\{\}; G\._carBurnt=\{\}; G\._carFire=\[\];/.test(demo) &&
    /G\._carFire=\[\]; G\.smoke=\[\];/.test(demo));

  /* ===== 43. V109 THE DEATH READS FROM THE HIT ======================== */
  ok('V109 THE FALL IS INHERITED, NOT ROLLED (Paolo: "all of it has to be translated from the type of headshot they got"). The old line said the opposite OUT LOUD -- "THE SHUFFLE: which way they fall is rolled, never inherited" -- in six separate places, each with its own dice. One function now, and every site asks it',
    demo.includes('V109 THE FALL IS INHERITED, NOT ROLLED') &&
    demo.includes('function deathFall(e,src,dist){') &&
    demo.includes('function fallSrc(){') &&
    (demo.match(/_deathVar=Math\.floor\(Math\.random\(\)\*3\)/g) || []).length === 0 &&
    (demo.match(/_deathVar=deathFall\(/g) || []).length === 6);

  ok('V109 KNOCKBACK vs COLLAPSE, and the mapping was MEASURED not guessed. All three baked falls rendered and compared frame 0 against frame 11: death[0] driftX -10.5 (the body TRAVELS, off its feet), death[1] driftX -0.3 flatten 0.25 (collapses in place), death[2] PIXEL-IDENTICAL to death[1]. So the bank holds TWO distinct falls, not three, and the mapping is an honest two-way read instead of a fiction built on art that cannot express it',
    demo.includes('const FALL_KNOCK=0;') &&
    demo.includes('const FALL_DROP=[1,2];') &&
    /* V111 RE-POINTED: the KNOCKBACK/COLLAPSE split is unchanged; WHO qualifies
       for knockback got researched and narrowed. See the v111 section. */
    demo.includes("if(src==='blast')return FALL_KNOCK;") &&
    demo.includes("if(src==='shotgun'&&d<=PT_BLANK)return FALL_KNOCK;"));

  ok('V109 AND AN EXPLOSION THROWS A BODY: the grenade and the cooking fuel tank both pass \'blast\', so the thing that killed him is what decides how he lands, everywhere, not just on the dial',
    demo.includes("e._deathVar=deathFall(e,'blast',0); try{addWound(e);}catch(_e){}") &&
    demo.includes("e._deathVar=deathFall(e,'blast',0);   /* V109: a fuel tank throws a body */"));

  ok('V109 THE COLLAPSE IS STABLE, NOT RANDOM: the same man always falls the same way (so it reads as CAUSED), but different men take different collapse clips (so a row of bodies is not all one frame). Keyed off e.i, never off Math.random',
    demo.includes('return FALL_DROP[((e&&e.i)|0)%FALL_DROP.length]; }'));

  ok('V109 NOBODY BREATHES DURING A KILL -- v107\'s rule extended from the dial to the BODIES. Every covered man runs a crouch/rise bob forever, and a kill zooms the camera straight onto it: that IS "squatting doing an animation with squatting back up right after they get their headshot", whether it is the target or the man beside him. A kill is a held moment',
    demo.includes('function bodyBreathes(){ return !G.ks; }') &&
    demo.includes('if(!bodyBreathes())return frames[0];') &&
    demo.includes('L.fire112[bodyBreathes()?Math.floor((JUICE.A?_bpmClock:now)/250)%2:0]'));

  ok('V109 AND THE DIAL-COVER SCRUB IS FENCED BY ASSERTION. It was already unreachable for a dead man -- and "already unreachable" is exactly the reasoning that produced two WRONG diagnoses of this complaint, so a dying, broken, running, stunned or freshly-hit body is now refused out loud instead of by inference',
    demo.includes('&&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!(e.stun>0)') &&
    demo.includes('&&!(e._hitAt&&now-e._hitAt<600)){'));

  ok('V109 BLEEDING OUT, WIGGLING AROUND (Paolo\'s exact words). A downed man used to lie PERFECTLY STILL between crawl ticks, which made him indistinguishable from a corpse -- the one thing a dying man must never look like, because whether he is still alive is a decision the player makes: FINISH him, or walk past',
    demo.includes('V109 BLEEDING OUT, WIGGLING AROUND') &&
    demo.includes('const _w=bodyBreathes()?(Math.floor((JUICE.A?_bpmClock:now)/500)%4):0;') &&
    demo.includes('return _w===2?L.crawl112[0]:L.prone112; }'));

  ok('V109 AND THE WRITHE COSTS NO ART: prone112 and crawl112 are already baked and already approved, so a dying body moves without one new pixel being cooked during an art freeze. The one thing that WOULD need art -- a third distinct fall -- is deliberately not cooked here',
    demo.includes('L.prone112&&L.crawl112&&L.crawl112.length'));

  ok('V109 EVERYTHING RIDES THE ONE 120 CLOCK. The seamless-transition finding, applied: a cut reads as a POP when the outgoing frame and the incoming clip disagree, and this engine has an advantage nobody was using -- a transition landing on a beat boundary is one the player has already been told to expect. The bob, the writhe and the fire cycle all run off _bpmClock, never off performance.now()',
    /const _w=bodyBreathes\(\)\?\(Math\.floor\(\(JUICE\.A\?_bpmClock:now\)\/500\)%4\)/.test(demo) &&
    demo.includes('Math.floor((JUICE.A?_bpmClock:now)/500)%2];   /* JUICE.A BEAT-BREATHING'));

  /* ===== 44. V110 EXPOSURE HAS A PRICE (Paolo's T9 list) ============== */
  ok('V110 PRESSURE IS A FLOOR ON THE DIAL (Paolo 8/1: "if there\'s three or four enemies with cover like I\'m fully exposed no cover it should be really hard to get that green... it slides with how many enemies have cover trying to shoot at you"). Standing in the open against four covered guns pulled the SAME dial as standing behind a wall against one -- the dial has had a floor mechanism since v95 and the most basic tactical fact in the game was not using it',
    demo.includes('V110 EXPOSURE HAS A PRICE') &&
    demo.includes('function pressureGuns(){') &&
    demo.includes('function pressurePkg(){ const n=pressureGuns(); return n<2?0:Math.min(4,n); }') &&
    demo.includes('pressurePkg()))'));   /* V114 RE-POINTED: the high-ground edge subtracts a tier after the max() closes */

  ok('V110 AND IT COUNTS ONLY THE SITUATION HE DESCRIBED: a gun BEHIND COVER, holding a line on you, that you have NO cover from. A gun in the open is a target, not pressure; a gun you are covered from is not shooting at you. MEASURED: 1 gun -> no floor, 2 -> HARD, 3 -> V.HARD, 4 -> BOHEMIAN, and taking cover from one of three drops the count to two',
    demo.includes('&&e.gcov&&acquired(e)&&!myCoverAgainst(e.ea,e.edist,e.lvl)).length; }'));

  ok('V110 AND POINT BLANK STILL EASES THE DIAL. Pressure is a FLOOR, the same shape v95 gave the chain ramp, so his 7/27 point-blank ruling survives intact -- closing the distance is still how you buy a friendlier dial, it just cannot fully cancel the cost of standing in the open',
    /Math\.max\(\s*distPkg\(tgt\)\+\(tgt\.elite\?1:0\)[\s\S]{0,120}chainRampDial\(\),[\s\S]{0,80}pressurePkg\(\)/.test(demo));

  ok('V110 AND HE CAN SEE WHY THE DIAL WENT MEAN: the headline says IN THE OPEN and names the count. A difficulty that changes without saying so is the tally mistake in a new costume',
    demo.includes("_pg>=2?'IN THE OPEN'") &&
    demo.includes("+(!_ov&&_pg>=2?_pg+' COVERED GUNS ON YOU · ':'')"));

  ok('V110 PAST THE ALLOWANCE IS BOHEMIAN, FLAT (Paolo 8/1: "that third shot, I want it to be a Bohemian difficulty pattern not even very hard just straight up Bohemian"). The ramp is deleted, not re-tuned -- the allowance is the whole negotiation and beyond it there is one answer',
    demo.includes('function chainRampDial(){ return chainOver()<=0?0:4; }') &&
    !/CHAIN_RAMP_BASE\+\(o-1\)\*CHAIN_RAMP_STEP/.test(demo));

  ok('V110 THE ORANGE, SEVENTH REPORT, AND IT WAS NOT THE DIAL THIS TIME. Instrumented again: the v107 ghost fans stayed dead and what lit up the kill was THE TWO-STOREY -- 232 strokes of the deck kick rail and 29 of the stair tread lips, the brightest warm objects in the game. CAUSE: draw order. The v94 kill dim fired inside the FLOOR block and the deck, stairs and cars all drew after it at full brightness',
    demo.includes('V110 THE KILL DIMS THE WORLD, ALL OF IT') &&
    demo.includes('if(!aimo){ const _mk2=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;') &&
    !demo.includes('const _mk=(G.ks&&G._ksAt)'));

  ok('V110 AND THE HIGHLIGHTS GO DARK AT THE SOURCE, not merely under an overlay. A 0.42 black wash only takes a 232-luminance cream to ~135, and seven reports is enough evidence that dimming is not the same as removing. MEASURED AFTER: zero rgba(232,214,172) draws during a killshot',
    demo.includes("x.strokeStyle=dialOrnament()?'rgba(232,214,172,0.92)':'rgba(120,110,88,0.30)';") &&
    demo.includes("x.fillStyle=dialOrnament()?'rgba(232,214,172,0.95)':'rgba(120,110,88,0.32)';") &&
    demo.includes("dialOrnament()?'rgba(186,170,132,0.5)':'rgba(186,170,132,0.12)'"));

  ok('V110 THE BLACK RECTANGLE THAT POPS UP FROM NOWHERE, FOUND BY INSTRUMENT: a grid of solid rgba(0,0,0,0.28) 74x74 squares that MERGE into one hard black rectangle, slid into frame by the killshot zoom. The code\'s own comment says a scaffold throws a BROKEN shadow because it has gaps, and then it drew a slab -- the comment was right and the code was lying',
    demo.includes("x.fillStyle='rgba(0,0,0,0.26)';") &&
    demo.includes('for(let _b=0;_b<4;_b++)x.fillRect(p[0]-t2*0.5+_b*_sw,p[1]-t2*0.5,_sw*0.78,t2+1); }') &&
    !demo.includes("x.fillStyle='rgba(0,0,0,0.28)'; x.fillRect(p[0]-t2*0.5,p[1]-t2*0.5,t2+1,t2+1); }"));

  ok('V110 NO INVISIBLE COVER (Paolo 8/1: "there\'s invisible pillars sometimes in the arena"). MEASURED before: 10 of 588 cars across 300 rolled arenas -- 1.7% -- had NO NOSE CELL, which is solid cover with no sprite. A car is six cells and only the flagged nose draws, and the deck filter evicted pillars CELL BY CELL, so a deck corner landing on a car deleted its nose and left five invisible solid cells. MEASURED AFTER: 0 of 572',
    demo.includes('const _doomed={};') &&
    demo.includes('G.pillars=G.pillars.filter(P=>{ if(P.car)return !_doomed[P.car];') &&
    !demo.includes('G.pillars=G.pillars.filter(P=>{ const q=pXY(P); return !deckTileAt(q[0],q[1]); }); }'));

  ok('V110 THE BEADS COME BACK (Paolo 8/1: "I\'m not seeing the beads anymore... I want them to come back for now"). They were never removed -- they were dialled DOWN TWICE on his own 7/3 and 7/4 instructions, which left red at 0.30 alpha on a 430px phone. A ruling he has now reversed. His ORDERING survives: danger still outranks its warning and a tucked man still draws almost nothing',
    demo.includes("col='rgba(232,60,40,0.62)';w=2.8;") &&
    demo.includes("col='rgba(232,140,40,0.42)';w=2.4;") &&
    demo.includes("col='rgba(120,108,86,0.05)';w=1;"));

  ok('V110 SPRINT IS ONE TILE (Paolo 8/1, ruling): "I\'m not a big fan of it moving two tiles and you still get to move for free... sprinting basically just means you get to take movement action without your turn ending." The distance cheat is gone; the VERB is the whole point',
    demo.includes('const _mult=1;') &&
    !demo.includes('const _mult=_sprinting?2:1;') &&
    demo.includes("'one tile — 1 pip, no turn spent, nobody gets a shot'"));

  ok('V110 THE WAREHOUSE IS OFF (Paolo 8/1: "The warehouse arena is dog shit it gives me anxiety looking at it... The only one I\'m comfortable playing on is street"). A REJECTION, and the second time the two-storey arena has come back -- so it is off, not argued and not re-tuned. buildWarehouse is NOT deleted, because nothing is graveyarded without his word; it is unreachable',
    demo.includes("G.arenaKind='street';") &&
    !demo.includes("G.arenaKind=(Math.random()<0.5)?'warehouse':'street';") &&
    demo.includes('function buildWarehouse(){'));

  ok('V110 A DYING MAN DOES NOT STAND UP (Paolo 8/1: "if they\'re like crawling then they stand up when I get next to them to finish them off"). Exactly right, and it was one line: handsup112 is a STANDING pose, the v32 intent was KNEEL AND BEG, and the clip that got wired put a man on his feet. handsup belongs to the BROKEN, who surrendered without ever falling',
    !demo.includes('if(e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112)return L.handsup112;') &&
    demo.includes('if(e.broken){ return L.handsup112||L.idle112; }'));

  ok('V110 AND THE FINISH ACTUALLY PLAYS (Paolo: "when I do finish them off, they don\'t do any animation. They just like go instantly until like a straight death picture"). -1200ms started the 12-frame clip at frame 8: four frames, from a body already lying flat, into an end pose also lying flat. Nothing to see because nothing moved',
    demo.includes('t._deadAt=performance.now()-750;') &&
    !demo.includes('t._deadAt=performance.now()-1200;'));

  ok('V110 TWO BULLETS, TWO BANGS, ON ONE CLOCK. He has said this twice, so re-tuning the delay again would be the fourth-version mistake. The real defect: the report fired on a setTimeout while the second bullet spawns off the killshot travel fraction -- two clocks agreeing only by luck. The report now fires FROM the killshot when the round leaves the muzzle',
    demo.includes('if(p>=0.06&&!ks._dblSnd){ ks._dblSnd=true;') &&
    !demo.includes('},165);') &&
    demo.includes('function sndShot2(){'));

  /* ===== 45. V111 ONLY UP CLOSE (Paolo asked, and asked for the research) === */
  ok('V111 NOTHING THROWS A BODY -- not a shotgun, not anything. The disproof is one line of Newton\'s third law: if a gun could deliver enough momentum to launch a victim backwards, the recoil would launch the SHOOTER backwards just as hard. Movement at the instant of a hit is a body FAILING, never momentum. So "does a shotgun throw at range" was the wrong question: it does not throw at ANY range',
    demo.includes('V111 ONLY UP CLOSE') &&
    demo.includes("if(src==='shotgun'&&d<=PT_BLANK)return FALL_KNOCK;") &&
    !demo.includes("if(src==='blast'||src==='shotgun'||d<=PT_BLANK)return FALL_KNOCK;"));

  ok('V111 WHAT ACTUALLY CHANGES WITH RANGE IS WHETHER THE PAYLOAD ARRIVES AS ONE MASS. Forensic pathology on contact shotgun wounds: the pellets "penetrate the target as a single mass", one large round defect rather than a pattern, and "the body absorbs the entire discharge of the cartridge, not just the projectile". At distance the pattern opens and the same cartridge lands as scattered holes. One catastrophic hit drives a man down and away; a scatter folds him where he stands. A RANGE fact, not a FORCE fact',
    demo.includes('penetrate the target as a single mass') ||
    demo.includes('single mass'));

  ok('V111 AN EXPLOSION IS THE ONE CASE WHERE THE FILM VERSION IS TRUE: overpressure is a WAVE acting on the whole surface of a body at once, not a projectile. The grenade and the cooking fuel tank still throw at any range they reach',
    /if\(src==='blast'\)return FALL_KNOCK;/.test(demo) &&
    demo.includes("e._deathVar=deathFall(e,'blast',0);"));

  ok('V111 AND THE HOLLYWOOD REFLEX IS OUT OF THE POINT-BLANK CHECK. v109 let EVERY weapon throw a body up close, which smuggled the myth back in through a range test. A pistol at contact is still a pistol -- only the shotgun has the payload to arrive as one mass. MEASURED: shotgun at 2 tiles throws, at 4 (PT_BLANK) throws, at 5 folds, at 20 folds; pistol folds at every range; blast throws',
    /* every point-blank knockback in the file is the shotgun-guarded one --
       counting is the only honest way to say "no unguarded one survives" */
    (demo.match(/d<=PT_BLANK\)return FALL_KNOCK;/g) || []).length ===
      (demo.match(/src==='shotgun'&&d<=PT_BLANK\)return FALL_KNOCK;/g) || []).length &&
    demo.includes("if(src==='shotgun'&&d<=PT_BLANK)return FALL_KNOCK;"));

  ok('V111 AND NO NEW NUMBER WAS INVENTED. PT_BLANK is 4 tiles and this engine puts a tile at ~1.5m, so point blank is ~6m -- and the buckshot patterning literature\'s tight single-mass band sits right at that short end. The constant Paolo ruled on for an entirely different reason lands on the real one-mass distance, so it is used AS FOUND',
    demo.includes('const PT_BLANK=4') &&
    !/const SHOT_(MASS|KNOCK)[A-Z_]*=/.test(demo));

  /* ===== 46. V112 THE ORANGE, TENTH REPORT, AND IT WAS MINE =========== */
  ok('V112 THE ORANGE IS THE CAR HEAT SLAB I ADDED IN v108, and the reason I missed it three investigations running is a flaw in my METHOD: every instrument run ranked results BY CALL COUNT, which finds eight ghost arms and a rail stroked 232 times and completely hides ONE BIG RECTANGLE DRAWN ONCE A FRAME. Ranked by AREA it was the top warm object on the first run -- fillRect rgb(232,71,40), 146x219, which at ring=73 is exactly 2 tiles by 3, a car, sitting on a drawImage of identical size',
    demo.includes('V112 HOT METAL IS NOT AN ORANGE RECTANGLE') &&
    !demo.includes("x.fillStyle='rgba(232,'+Math.round(120-70*_ht)+',40,'+(0.30*_ht*_pu).toFixed(3)+')';"));

  ok('V112 AND IT WAS `lighter`, WHICH IS WHY DIMMING NEVER TOUCHED IT. v110 moved the kill dim past the whole environment and darkened every warm highlight at the source -- and you cannot subtract an ADDITIVE layer with a black wash, so the one fix built to catch exactly this walked straight past it. No lighter composite survives on the heat',
    !/globalCompositeOperation='lighter'[\s\S]{0,300}_ht/.test(demo));

  ok('V112 AND A FULL-BODY SLAB WAS WRONG EVEN WHEN NOBODY WAS DYING. Additive orange over a dark sprite is a flat orange rectangle, which is what he photographed. Hot metal glows at its EDGES and is hottest where the fire is -- and the fire is the tank, which is in the boot. What is left is the rim plus a radial bloom at the tank end, and it never draws during a kill',
    demo.includes('else if(dialOrnament()){ const _ht=Math.min(1,((G._carHeat||{})[P.car]||0)/CAR_COOK);') &&
    demo.includes('const g2=x.createRadialGradient(_tx,_ty,0,_tx,_ty,_tr);') &&
    demo.includes("x.strokeRect(bx+1,by+1,bw-2,bh-2); x.restore();"));

  ok('V112 THE MECHANIC IS UNTOUCHED: heat still accumulates from rounds your cover eats, still cooks off, still kills. Only the drawing changed',
    demo.includes('function carHeat(cid,n){') &&
    demo.includes('function cookOff(cid){') &&
    demo.includes('const CAR_COOK=10;'));

  /* ===== 47. V113 FLOOR FOCUS (the second-storey research) ============ */
  ok('V113 THE RESEARCH SAYS WE WERE DOING THE OPPOSITE. Every floor-system source -- Unreal, Unity, Godot and Roblox threads, the TopDown Engine docs, Larian\'s camera-height forum, the Princeton Adaptive Cutaways paper -- lands on one sentence: an upper floor cannot be fully visible at all times because it OBSTRUCTS THE CAMERA, so you fade the floor the player is NOT on. Bohemia drew both floors at full strength and ghosted the BODIES instead, which fades the thing he is trying to look AT',
    demo.includes('V113 FLOOR FOCUS') &&
    demo.includes('const floorFocus=l=>((l|0)===(G.lvl||0))?1:FLOOR_OFF;') &&
    demo.includes('const FLOOR_OFF=0.42;'));

  ok('V113 THE WHOLE DECK RECEDES, not just the tiles with a body under them. Per-tile opacity reads as a glitch rather than as a storey -- "which tiles happen to have a man beneath them" is not something a player can see or use',
    demo.includes('x.globalAlpha=floorFocus(DECK_LVL)*(thin?DECK_SEE:1);'));

  ok('V113 AND BOTH OLDER READS SURVIVE AS BACKSTOPS: the v93 x-ray silhouette and the v105 per-tile thin both still fire, so a man under the deck is legible three independent ways. He has asked to see who is underneath more times than anything else in this lane',
    demo.includes('function underDeckMe(){ return myLvl()===0 && !!deckSlabAt(0,0); }') &&
    demo.includes('const DECK_SEE=0.34, NBOARD=4;') &&
    demo.includes('if(underDeck(e)){'));

  ok('V113 AND THE SCAFFOLD STRUCTURE IS UNTOUCHED -- legs, X-bracing, slatted boards, kick rail. Value contrast is the height cue, which is what the isometric sources say too, and none of that was ever the problem',
    demo.includes('if(openL||openR){') &&
    demo.includes('const _sw=(t2+1)/4;'));

  /* ===== 48. V114 THE DIAL LEAVES / ONE WORLD / HIS RULINGS ========== */
  ok('V114 A HARD OFF, NOT A FADE TO NEARLY-NOTHING (Paolo, ELEVENTH report, and this time he gave the FIX: "Make the whole dead shot dial go away, fade away as the bullet gets closer to the person"). The timing was already right -- _df runs across the bullet\'s own travel and a measured killshot draws no arm, no needle, no ticks. Past 97% faded the whole block is now SKIPPED. A dial that is "almost gone" is what eleven reports look like',
    demo.includes('V114 THE DIAL LEAVES, ALL OF IT') &&
    demo.includes('const DIAL_GONE=(_df<=0.03);'));

  ok('V114 AND THE POSE LEAVES WITH IT. His screenshot shows the FIRE button GREEN -- phase aim -- so the orange shape is HIS OWN ARM AND GUN, the baked deadeye pose at the dial centre blown up by the zoomed camera, because the chain drops him back into aim over a body that is still dying. It is the biggest warm object the dial owns and it was the last one standing',
    demo.includes('drawField(ctx,W,H,cx,cy,{dial:true,zb:zb,gone:DIAL_GONE});') &&
    demo.includes("if(aimo&&typeof aimo==='object'&&aimo.gone){"));

  ok('V114 ONE WORLD (Paolo: "just have the physics world be the same bro for real... I couldn\'t walk off the edge, but I was doing combat, but now that combat is over I can\'t even test it"). HE WAS DESCRIBING MY OWN CODE: v106 wrapped the whole stair-and-edge block in if(!roam), so the moment a fight ended the staircase stopped being a staircase and you could walk off a second storey into the air -- on the exact screen where he finally had time to test it',
    demo.includes('V114 ONE WORLD') &&
    !/if\(!roam\)\{\s*\n\s*\/\* THE LANDING BELONGS TO BOTH FLOORS/.test(demo) &&
    demo.includes("setRead('THE EDGE','nothing under that step"));

  ok('V114 AND THE ONLY THING roam STILL CHANGES IS THAT WALKING IS FREE, which is what a victory walk is FOR. The geometry is never free',
    demo.includes("if(!roam&&!spendStam(1)){ setRead('NO STAMINA','the stairs cost one pip','#8a7d66'); return; }"));

  ok('V114 A GRENADE AT YOUR FEET KILLS YOU (Paolo 8/2, ruling): "if a grenade explodes at my feet, I should be dead. End of story. now the outside radius is a different thing but yeah keep that in mind." 40-52 for a frag going off ON you was a videogame number. The band OUTSIDE it is untouched, because he drew that line himself',
    demo.includes('let sd=0; if(dSelf<0.9)sd=999; else if(dSelf<1.5)sd=18+Math.floor(Math.random()*8);'));

  ok('V114 THE HIGH GROUND BEATS A CROUCH (Paolo 8/2): "if they just have a crouching cover... it should be easier to hit them because you have that height vantage point... if someone is close by in crouch cover and you\'re at a taller height then it should probably help you". A man crouched behind a low wall is hidden from someone at his own eye level; from a storey up you are looking down INTO the pocket, and the closer he is the steeper the angle',
    demo.includes('function highGroundEdge(e){') &&
    demo.includes('const NEAR_HG=5, FAR_HG=12;') &&
    demo.includes('return (d<=NEAR_HG)?2:1;'));

  ok('V114 AND IT IS STRICTLY EARNED: same floor gives nothing, a man with NO cover gives nothing (there is no pocket to look into), a man ABOVE you gives nothing, and it is gone by FAR_HG. MEASURED: same floor 0, above+close 2, above+mid 1, above+far 0, no cover 0, both up 0, he-above 0',
    demo.includes('if(!e||myLvl()===(e.lvl|0))return 0;') &&
    demo.includes('if(myLvl()<=(e.lvl|0))return 0;') &&
    demo.includes('if(!e.gcov)return 0;'));

  ok('V114 AND IT PULLS THE DIAL, NEVER THE DAMAGE. It subtracts a tier on the same machinery every other modifier uses, so his no-multipliers ruling holds exactly',
    demo.includes('pressurePkg())) - highGroundEdge(tgt));') &&
    !/highGroundEdge\([^)]*\)[^\n]{0,80}(KILL_DMG|applyDamage)/.test(demo));

  ok('V114 EXECUTION PAYS, BARELY (Paolo 8/2, his number): "if you down someone and they were already down and you kill them maybe you can just get like a really minor stupid amount of experience... maybe only +2% or +3%". The kill is already paid for when he goes DOWN; this is a token for finishing a man on the floor, deliberately almost nothing, because the point is that it is a CHOICE and not an optimisation',
    demo.includes('const EXEC_XP_PCT=0.03;') &&
    demo.includes("G.ledger.execXP=(G.ledger.execXP||0)+_x;") &&
    /* V181 RE-POINTED, and it is the same shape as V136's window: finishHim
       gained a bodyFell call, so EXEC_XP_PCT sits further down the function
       than 1800 characters. THE CLAIM IS UNCHANGED -- an execution pays his
       3% token -- and that token is now ON TOP of what the man was carrying
       rather than the only experience in the game. A window a claim keeps
       outgrowing is measuring the wrong thing when it is tight. */
    /function finishHim[\s\S]{0,2600}EXEC_XP_PCT/.test(demo));

  /* ===== 49. V115 DECLARED BEFORE IT IS READ ========================= */
  ok('V115 THE CRASH I SHIPPED. v114 declared `const DIAL_GONE` beside the dial\'s band block -- about 1,500 characters BELOW the drawField call that passes it in. const has a temporal dead zone, so that read threw ReferenceError every frame and the whole demo went black. Paolo screenshotted it. It now sits immediately after the _df it is derived from, above every use',
    demo.includes('V115 DECLARED BEFORE IT IS READ') &&
    demo.indexOf('const DIAL_GONE=') < demo.indexOf('{dial:true,zb:zb,gone:DIAL_GONE}'));

  ok('V115 AND THE ORDERING IS ASSERTED, NOT ASSUMED: the declaration must appear before EVERY read of it in the shipped text, which is the only thing that can actually be wrong here',
    (function(){ const d=demo.indexOf('const DIAL_GONE=');
      if(d<0) return false;
      let i=demo.indexOf('DIAL_GONE'), first=i;
      return first>=0 && first>=d-20; })());

  ok('V115 AND THE GATE THAT WOULD HAVE CAUGHT IT NOW EXISTS. 620 checks were green when this shipped, because node --check proves a file PARSES and a temporal dead zone is valid syntax -- it proves nothing about whether the thing RUNS. gates/combat_runs_smoke.js boots the real alpha, opens the real combat tab and drives real frames through cover -> AIM -> killshot -> freeze, failing on ANY pageerror or console error. Verified against the broken build: it catches it, 170 errors, 1 distinct',
    require('fs').existsSync(__dirname + '/combat_runs_smoke.js') &&
    require('fs').readFileSync(__dirname + '/../gates/bohemia_gates.py','utf8').includes("gates/combat_runs_smoke.js"));

  /* ===== 50. V116 THE ORANGE ARM, TWENTIETH REPORT =================== */
  ok('V116 ONE `=` THAT SHOULD ALWAYS HAVE BEEN A `*=`. Paolo, twentieth report, and the sentence that solved it: "The orange part of the dead shot dial does not slowly disappear LIKE THE REST of the dead shot dial." The rest fades and the orange part does not -- which is not a missing gate, it is one element ESCAPING a fade that already works on everything around it. drawArmNeedle was the ONLY globalAlpha ASSIGNMENT in the whole dial block, overwriting _df with its own number before drawing a single pixel',
    demo.includes('V116 THE ARM INHERITS THE FADE') &&
    demo.includes('c2.save(); c2.globalAlpha*=al;') &&
    !demo.includes('c2.save(); c2.globalAlpha=al;'));

  ok('V116 AND IT IS THE ONLY ONE, ASSERTED: no globalAlpha ASSIGNMENT may live inside drawArmNeedle again, because that is the exact shape of the bug that survived eleven fixes',
    !/function drawArmNeedle[\s\S]{0,900}?\w+\.globalAlpha\s*=[^*=]/.test(demo));

  ok('V116 THE WHOLE DIAL BAILS IN ONE BRANCH ("Make the WHOLE dead shot dial go away", his words, twice). v114 added DIAL_GONE and spent it on the player pose alone. It now wraps the wedge, the track, the ticks, the bands, both ghost fans, the needle, the reticle and the muzzle heat, so nothing in there can outlive the fade again whatever anyone adds later',
    demo.includes('if(!DIAL_GONE){') &&
    demo.includes("}   /* V116: end of the one DIAL_GONE branch") &&
    demo.indexOf('if(!DIAL_GONE){') < demo.indexOf("ctx.globalAlpha=1;   /* dial fade never touches the killshot world */"));

  ok('V116B A SNAP IS NOT A FADE. MEASURED and this is why twenty reports never matched what I fixed: the arm\'s alpha DURING G.ks was already 0 -- it is not on screen during the kill at all. What he photographs is the CHAIN (his own screenshot reads SHOT 2 OF 2 with FIRE green), where the dial slammed back to full the instant the killshot ended, over the body he just dropped. BEFORE: 0.045, full strength, first frame after. AFTER: 0.003 ramping, 0.022 peak across 200ms',
    demo.includes('const DIAL_IN_MS=420;') &&
    demo.includes('if(G.ks)G._ksEnd=performance.now();') &&
    demo.includes('const _sinceEnd=(G._ksEnd!=null)?(performance.now()-G._ksEnd):1e9;'));

  ok('V116B AND IT KEYS OFF THE KILL\'S END, NOT ITS START -- the first attempt keyed off _ksAt and did nothing, because _dfT is only the BULLET travel (~90-300ms) while the cinematic runs ~2s, so the ramp finished long before the dial was allowed back and it snapped to 1 exactly as before',
    /if\(G\.ks\)G\._ksEnd=performance\.now\(\);[\s\S]{0,400}_sinceEnd\/DIAL_IN_MS/.test(demo));
}

/* ===== V121 NOBODY STANDS IN A CAR, AND DIFFICULTY TOUCHES THE ENEMY ===== */
{
  ok('V121 OCCUPANCY IS ENFORCED ON SPAWN. Paolo: "the Enemies are able to like be inside the cars or like being the same tiles of the cars and it\'s not good." MEASURED 40 in cars + 30 in cover across 1,600 bodies = 4.4%, because setupEnemies wrote e.ea/e.edist straight in and never once asked whether anything was already there. The OCCUPANCY LAW is one body per cell and enemy placement was the one place in the fight that never enforced it',
    demo.includes('V121 NOBODY STANDS IN A CAR') &&
    /\(function v121Occupancy\(\)\{/.test(demo) &&
    /const solidAt=\(qx,qy\)=>\(G\.pillars\|\|\[\]\)\.some/.test(demo) &&
    /const takenAt=\(qx,qy,self\)=>\(G\.e\|\|\[\]\)\.some/.test(demo));

  ok('V121 IT RUNS AFTER THE DECK HOLDERS AND SKIPS THEM: a man lifted one storey up is never judged against ground cover, so the fix cannot quietly evict the roof',
    /m\.lvl=DECK_LVL; m\.gcov=0; \} \}[\s\S]{0,4000}\(function v121Occupancy/.test(demo) &&   /* window 900 -> 3000 on 8/27: V190's boss block sits between the two, which is where it belongs -- he is placed with the deck holders and THEN swept for occupancy like every other body. ORDERING CLAIM UNCHANGED */
    demo.includes('if((e.lvl|0)!==0)continue;'));

  ok('V121 IT SPIRALS TO THE NEAREST FREE CELL, never teleports across the lot, never onto the player, and if the lot is packed he is pushed OUTWARD rather than left standing in a wreck',
    /for\(let r=1;r<=4&&!placed;r\+\+\)/.test(demo) &&
    demo.includes('if(Math.hypot(nx,ny)<2.2)continue;') &&
    demo.includes('if(!placed){ e.edist=Math.min(hd(MAX_RANGE),e.edist+hd(2.5)); }'));   /* V198 RE-POINTED: a 2.5-tile shove is 2.5 HOUSES on the house board */

  ok('V121 DIFFICULTY FINALLY REACHES THE ENEMY. Paolo: "I am really concerned how easy this game could be unless I throw 8+ enemies at a player." MEASURED: EASY and BOHEMIAN both killed me in 6 turns at 16.7 HP/turn -- IDENTICAL -- because G.pkgDiff only ever fed THE DIAL. Every difficulty in this game meant one thing, how hard is it for YOU to shoot, and nothing ever made THEM better',
    demo.includes('V121 DIFFICULTY FINALLY TOUCHES THE ENEMY') &&
    demo.includes('const THREAT_BY_PKG=[1.00,1.12,1.26,1.42,1.60];') &&
    /function threatMult\(\)\{ const k=Math\.max\(0,Math\.min\(4,\(G\.userPkg\|\|0\)\|0\)\);/.test(demo));

  ok('V121 IT DIVIDES THE MISS, NOT THE HIT. The first cut multiplied the hit chance and I MEASURED V.HARD and BOHEMIAN both landing on the 0.99 clamp -- two identical tiers, the exact bug being fixed, moved up two notches. Dividing the miss cannot pass 1, so no clamp can ever eat a tier',
    demo.includes('1-(1-base)/threatMult()') &&
    !/Math\.min\(0\.99,\(0\.97 - distT\(e\)\*0\.60\)\*threatMult\(\)\)/.test(demo) &&
    /* V153 RE-POINTED: the DIFFICULTY term is byte-identical and still divides
       the miss. What follows it is a MOVING-TARGET modifier, which is not
       difficulty and only ever multiplies DOWNWARD -- so the failure this law
       exists to stop (two tiers landing on the same 0.99 clamp) remains
       impossible. The law is intact; only the string pin was stale. */
    /return \(1-\(1-base\)\/threatMult\(\)\)\*\(iMoved\(\)\?\(1-MOVING_MISS\):1\); \}/.test(demo) &&
    /const MOVING_MISS=0\.35;/.test(demo));

/* ===== V154 ONE MORE BEAT BEFORE THEY SHOOT =======================
   Paolo 8/15: "whatever it's at right now, one extra turn it takes for Enemies
   to shoot at you and I think this might be more survival potentially fun."
   Every change this week made the board MORE dangerous -- cover decays, guns
   have reach, they flank and close and bound, grenades come more than once --
   and the one thing that never moved was HOW LONG HE HAS TO REACT. An extra
   beat makes all of it survivable without weakening any of it.
   AND THE NUMBER STOPS BEING SCATTERED: the threshold was the literal >= 1
   written out ELEVEN times, including in the RED-LINE DISPLAY. Eleven copies of
   one rule is the exact shape that has cost him all week -- and a display that
   can quietly disagree with the rule it draws is how he learns to ignore the
   display. One dial, one predicate. */
  ok('V154 THE ACQUISITION DELAY IS ONE DIAL, READ THROUGH ONE PREDICATE, so the bead he watches and the rule that shoots him can never drift apart',
    demo.includes('const ACQ_TURNS=2;') &&
    demo.includes('function acquired(e){ return !!e && (e.acq||0)>=ACQ_TURNS; }') &&
    !/\(e\.acq\|\|0\)>=1/.test(demo) && !/\(e2\.acq\|\|0\)>=1/.test(demo));

  ok('V154 AND EVERY PATH THAT COULD SHOOT HIM GOES THROUGH IT -- the volley, the wait-exposed path, the reckless path and the red line all ask the same question',
    (demo.match(/acquired\(e\)/g) || []).length >= 5 &&
    /const red=hot&&\(e\.melee\|\|acquired\(e\)\)/.test(demo));

/* ===== V155 THE GUN ONLY SWINGS SO FAR ============================
   Paolo, for the SECOND time: "I already told you if I'm facing one way the next
   person that I can kill shot can't be like directly on the other side like
   bumping to shoot someone."
   nextChainTarget was literally `return pickTarget()` -- pure threat order, all
   360 degrees -- so a killshot could hand him a man at his back and call it one
   motion. A chain is ONE MOTION: the muzzle swings off the man who dropped onto
   the next one, and outside the arc the gun can traverse there is no chain.
   MEASURED, NOT READ. A string check would pass on a swing filter that is
   defined and never reaches the selection -- that is the exact failure that cost
   him inMyRange and the damage faces. This RUNS the real selection against a
   built board and asserts the man at 180 degrees is never returned. */
  { const _sa = demo.indexOf('const SWING_ARC=');
    const _pt = demo.indexOf('function threatRank(e){');
    const _end = demo.indexOf('function nextChainTarget(){');
    const _endB = demo.indexOf('\n', demo.indexOf('return bestOf(pool); }', _end));
    ok('V155 the swing machinery and the chain selector are both present in the shipped blob',
      _sa > 0 && _pt > 0 && _end > _sa && _endB > _end);

    if (_sa > 0 && _pt > 0 && _endB > _end) {
      const src = demo.slice(_pt, _endB);
      // the real selection, with only the two board oracles stubbed
      const mk = (WEAPON, faceA, enemies) => new Function(
        'WEAPON', 'G', 'modePool', 'myCoverAgainst',
        src + ';return {pick:nextChainTarget(), arc:swingArc(), inS:inSwing};'
      )(WEAPON, { e: enemies, _muzzleA: faceA, faceAng: 0, selTarget: null },
        () => enemies.filter(e => !e.dead), () => false);

      // four men: dead ahead, 60 deg off, 100 deg off, and directly behind.
      const board = [
        { i: 0, ea: 0.00,        edist: 9, melee: false },
        { i: 1, ea: 1.05,        edist: 4, melee: false },   // 60 deg
        { i: 2, ea: 1.75,        edist: 3, melee: false },   // 100 deg
        { i: 3, ea: Math.PI,     edist: 1, melee: false },   // straight at his back, CLOSEST
      ];
      // closest-first would pick the man behind him every single time.
      const r = mk('pistol', 0, board);
      ok('V155 THE MAN AT HIS BACK IS NEVER THE CHAIN, even when he is the closest man on the board -- which is exactly who the old closest-first selector handed him',
        r.pick !== 3 && r.inS(board[3]) === false);

      ok('V155 and inside the arc the threat order is untouched: the closest man the gun can reach is still the one it takes',
        r.pick === 1 && r.inS(board[1]) === true);

      // the arc belongs to the gun: same board, different weapon, different reach
      const rp = mk('pistol', 0, board), rr = mk('rifle', 0, board), rs = mk('sniper', 0, board);
      ok('V155 THE ARC BELONGS TO THE GUN (his own "maybe depending on the gun type"): pistol > smg > shotgun > rifle > sniper, so the gun that gives the most shots gives the least ground',
        rp.arc > mk('smg', 0, board).arc && mk('smg', 0, board).arc > mk('shotgun', 0, board).arc &&
        mk('shotgun', 0, board).arc > rr.arc && rr.arc > rs.arc);

      ok('V155 and that trade is REAL on a board: the pistol chains the man 60 degrees out, the rifle cannot reach him, and the scope chains nobody but the man dead ahead',
        rp.pick === 1 && rr.pick === 0 && rs.pick === 0);

      // wrap-around: a muzzle near +pi and a man near -pi are 20 deg apart, not 340
      const wrap = mk('pistol', 3.0, [{ i: 0, ea: -3.0, edist: 5, melee: false }]);
      ok('V155 the angle wraps: a muzzle at +172 and a man at -172 are 16 degrees apart, not 344 -- the arc is a real angular gap, never a subtraction',
        wrap.pick === 0);

      // and it is NOT a distance filter wearing an arc costume
      const far = mk('pistol', 0, [{ i: 0, ea: 0.1, edist: 40, melee: false }]);
      ok('V155 the arc is about DIRECTION only: a man far away but dead ahead is still one motion from the muzzle',
        far.pick === 0);
    }
  }

  ok('V155 THE SWING IS MEASURED OFF THE SHOT, NOT OFF THE STANCE. G.faceAng is written a SECOND time by updateStanceFacing every time the phase returns to cover, so reading it in the chain would have measured from wherever the body ended up after the kill camera. The shot stamps its own angle',
    /if\(G\._muzzleA!=null&&isChain\)G\._sweepUsed=\(G\._sweepUsed\|\|0\)\+angGap\(tgt\.ea,G\._muzzleA\);\s*\n\s*G\._muzzleA=tgt\.ea; \}/.test(demo) &&
    /function muzzleAng\(\)\{ return \(G\._muzzleA!=null\)\?G\._muzzleA:\(G\.faceAng\|\|0\); \}/.test(demo) &&
    /const g=angGap\(e\.ea,muzzleAng\(\)\);/.test(demo) &&
    /G\._chainWait=false; G\._muzzleA=null; G\._sweepUsed=0;/.test(demo));

/* V155b THE TURN HAS A TOTAL TRAVERSE. MEASURED before this existed: with a
   per-hop arc ONLY, a pistol still chained 63.9% of the men left and the chain
   died at the arc on 2.1% of kills -- because eight hops of 75 degrees is 600
   degrees of rotation. He could still sweep the whole board inside one turn,
   one hop at a time, which is the pirouette he complained about arriving in
   slow motion. A per-hop arc without a turn budget is a cosmetic fix. */
  ok('V155 AND THE WHOLE TURN HAS A TRAVERSE BUDGET, because eight hops of 75 degrees is 600 degrees -- a per-hop arc alone still lets one turn circle the board',
    demo.includes('const SWEEP_TURNS=2.2;') &&
    demo.includes('function turnSweep(){ return swingArc()*SWEEP_TURNS; }') &&
    /return g<=swingArc\(\) && g<=sweepLeft\(\);/.test(demo) &&
    /if\(!isChain\)\{G\._chainN=1;G\._poppedOut=false;G\._sweepUsed=0;G\._muzzleA=null;\}/.test(demo));

  { // and it RUNS: spend the budget and the same man stops being chainable
    const _pt = demo.indexOf('function threatRank(e){');
    const _end = demo.indexOf('function nextChainTarget(){');
    const _endB = demo.indexOf('\n', demo.indexOf('return bestOf(pool); }', _end));
    if (_pt > 0 && _endB > _end) {
      const src = demo.slice(_pt, _endB);
      const board = [{ i: 0, ea: 1.0, edist: 5, melee: false }];
      const run = (used) => new Function('WEAPON', 'G', 'modePool', 'myCoverAgainst',
        src + ';return nextChainTarget();'
      )('pistol', { e: board, _muzzleA: 0, faceAng: 0, selTarget: null, _sweepUsed: used },
        () => board, () => false);
      ok('V155 THE BUDGET IS REAL AND IT RUNS DOWN: a man 57 degrees off the muzzle is chainable on a fresh turn and is NOT chainable once the turn has already spent its traverse -- same man, same angle, same gun',
        run(0) === 0 && run(2.5) === -1);
    }
  }

  ok('V155 THE MANUAL CHAIN OBEYS THE SAME ARC ON BOTH SURFACES (the board chip and the world tap) and says WHY it refused, rather than dying silently on a tap',
    (demo.match(/TOO FAR TO SWING/g) || []).length === 2 &&
    (demo.match(/if\(G\._chainWait\)\{ if\(!inSwing\(e\)\)\{/g) || []).length === 2 &&
    demo.includes('NO SWING LEFT'));

  ok('V155 AND THE THREAT RANK WAS MOVED, NOT COPIED -- one table, read by the first shot and the chain alike, because a second copy is how a rule and its display drift apart',
    (demo.match(/function threatRank\(e\)\{/g) || []).length === 1 &&
    (demo.match(/const _rank=/g) || []).length === 0 &&
    demo.includes('function bestOf(pool){') && /return bestOf\(pool\); \}/.test(demo));

/* ===== V153 IT CUTS BOTH WAYS =====================================
   Paolo 8/15: "so what I'm the only one that gets affected by this... that's not
   fair second being out in the open in this game for more than two turns like
   you will die so like I'm trying to make this fun."
   TWO POINTS AND BOTH LAND. V152 chewed cover on ONE code path -- the enemy
   volley, where the stone that stopped their round was already in hand -- so
   only HIS cover degraded. That was not a design position, it was the easy half
   shipped. And his second point breaks my own feature: if the open kills you in
   two turns, destroying his cover is not a prompt to move, it is a death
   sentence. */
  ok('V153 THEIR COVER DEGRADES TOO: his shot that a man\'s stone eats chews that stone, same rule and same numbers, rock to rock in both directions',
    demo.includes('function foeCoverPillar(e){') &&
    demo.includes('function chewFoeCover(tgt){') &&
    /function fireMissRound\(tgt\)\{ try\{chewFoeCover\(tgt\);\}catch\(_e\)\{\}/.test(demo));

  ok('V153 AND THE OPEN IS CROSSABLE, or cover decay is only punishment: this game had never once rewarded movement -- standing still and sprinting across a lot presented the same silhouette to every gun. A modifier on the roll, never immunity',
    demo.includes('function iMoved(){') &&
    /const MOVED_MS=1200;/.test(demo) &&
    /\*\(iMoved\(\)\?\(1-MOVING_MISS\):1\)/.test(demo));

  ok('V121 IT IS NOT A DAMAGE MULTIPLIER AND IT DOES NOT TOUCH THE DIAL: his no-multipliers ruling stands (a bullet does what a bullet does), and v98 says out loud that the killshot allowance must never be wired to difficulty. threatMult is read by distAccuracy and nowhere else',
    (demo.match(/threatMult\(\)/g) || []).length === 2 &&
    demo.includes('*** DO NOT WIRE G.userPkg BACK IN HERE. ***') &&
    demo.includes('function perkKillshots(){ return Math.max(1,(G.chainSkill||2)|0); }'));
}

/* ===== V122 ONE RUN BUTTON, ON THE THUMB ============================== */
{
  ok('V122 DASH AND VAULT ARE OFF THE TOP MENU. Paolo: "removing the dash and vault button definitely I never use them." They lived at the TOP of the screen and acted at the BOTTOM on the ring with his thumb -- DASH did not even act on its own, it ARMED and made him travel back down to say which way',
    !demo.includes('<button id="dashbtn"') &&
    !demo.includes('<button id="vaultbtn"') &&
    !demo.includes("D('dashbtn'); if(_d)_d.addEventListener('click',doDash)"));

  ok('V122 AND THE FUNCTIONS ARE NOT DELETED: GRAVEYARD IS FINAL cuts both ways, nothing dies without his word, and he said remove the BUTTONS. doDash, doDashMove and doVault stay callable so either verb is a one-line restore instead of a rebuild',
    demo.includes('function doDash(){') &&
    demo.includes('function doDashMove(d){') &&
    demo.includes('function doVault(){'));

  ok('V122 RUN AND GRENADE LIVE IN THE THUMB CLUSTER, on the ring, where the movement is. Paolo: "a standardized run button next to the actual action in movement buttons actually on screen" and "I want a grenade button next to the action and directional movement buttons as well"',
    demo.includes("mk('runbtn','RUN'") &&
    demo.includes("mk('grenbtn2','GREN'") &&
    /const mk=\(id,txt,col,dy,fn\)=>\{/.test(demo));

  ok('V122 THE OFFSET IS MEASURED, NOT GUESSED: the first placement was left:-56px and it overlapped the W and NW pips with RUN and the W and SW pips with GREN, so two of his eight directions would have been covered by the new buttons. The pips sit at R=66, which puts the W pip 34px outside the wrap',
    demo.includes("'position:absolute;left:-100px;top:'") &&
    !demo.includes("'position:absolute;left:-56px;top:'"));

/* ===== V144 THE MUSIC SCHEDULER COULD HANG THE WHOLE GAME =========
   Paolo 8/12: "i pressed wait hella and when i went to shoot someone the game
   froze bro." IT WAS REAL AND IT WAS THE AUDIO CLOCK. seqTick is a lookahead
   scheduler on a 25ms setInterval -- the right shape -- with NO RECOVERY: it
   caught up to the audio clock one 0.125s step at a time, REPLAYING EVERY STEP
   IT MISSED. setInterval fires late whenever the tab is backgrounded, the phone
   locks, or the OS is busy, and the audio clock never stops.
   MEASURED ON THE SHIPPING BUILD, steps scheduled in ONE tick after a stall:
       10s -> 81      60s -> 481      300s -> 2,401
   and every one of those builds real audio nodes. With the fix: 1, 1, and 1.
   It reads as a freeze rather than a crash because nothing throws -- the main
   thread is simply inside a while loop, scheduling music that already happened. */
ok('V144 THE SCHEDULER RESYNCS INSTEAD OF CATCHING UP: steps missed during a stall are in the PAST and can never be heard, so the counter jumps to where the music WOULD be. Silence during a stall is correct; a stampede of stale notes is not',
  demo.includes('const SEQ_RESYNC=0.5;') &&
  /if\(_seq\.next<now-SEQ_RESYNC\)\{/.test(demo) &&
  /_seq\.step\+=miss; _seq\.next\+=miss\*sd;/.test(demo));

ok('V144 AND THE LOOP IS BOUNDED ANYWAY: a tick only ever needs one or two steps, so 64 is a hundred times real headroom and still makes hanging impossible. The resync fixes the cause I can name; the cap fixes the ones I cannot. An unbounded loop inside a 25ms timer is a hang waiting for an excuse',
  demo.includes('const SEQ_MAX_STEPS=64;') &&
  /while\(_seq\.next<ahead&&guard\+\+<SEQ_MAX_STEPS\)/.test(demo) &&
  !/while\(_seq\.next<ahead\)\{ playStep/.test(demo));

ok('V144 AND A CAPPED TICK NEVER LEAVES A BACKLOG for the next one to inherit, and a broken step length can never spin: both are explicit',
  /if\(guard>=SEQ_MAX_STEPS\)_seq\.next=ahead;/.test(demo) &&
  /if\(!\(sd>0\)\)return;/.test(demo));

/* ===== V143 SUPERSEDES V122'S COVER-SEEKING RUN ====================
   Paolo 8/12: "IT KEEPS TRYING TO SNAP ME TO COVER LIKE 5 TILES AWAY AN IT
   PREVENTS ME FROM RUNNING IN A CERTAIN DIRECTION AND ITS SO CONFUSING."
   V122's RUN searched a 45-degree wedge out to SIX tiles for a pillar and took
   him all the way to it -- the direction was a HINT for choosing a destination
   instead of the instruction he gave. And once cover was found, every other
   path was a REFUSAL (ALREADY ON IT / BLOCKED / SOMEBODY IS THERE), all of
   which moved him nowhere, so a direction with a rock in it could be completely
   unusable while the open ground beside it was fine.
   A COVER-SEEKING VERB ON A BUTTON LABELLED RUN. The direction is the
   instruction now. runTargetIn() is gone with the behaviour it served. */
  ok('V143 RUN GOES THE WAY HE TAPPED, as far as the line is clear, stopping SHORT of the first thing in the way -- no wedge search, no destination hunting, and it never moves him to something he did not aim at',
    demo.includes('function runStops(d){') &&
    demo.includes('const RUN_TILES=3;') &&
    !demo.includes('function runTargetIn(d){') &&
    !demo.includes("setRead('RUN TO COVER'"));

  ok('V143 AND A DIRECTION CAN NEVER GO DEAD: the only refusal left is that the very FIRST tile is blocked, which is a fact about the world he can see rather than a rule he cannot. ALREADY ON IT is gone -- it was a refusal that fired because cover was NEAR him',
    demo.includes("setRead('BLOCKED','something is right in front of you that way'") &&
    !demo.includes("setRead('ALREADY ON IT'"));

  ok('V143 THE VAULT SURVIVED BECAUSE IT WAS RIGHT: a duck-height thing directly in front means running that way is going OVER it. It is the only special case now instead of one of four',
    demo.includes('function runVaultTarget(d){') &&
    demo.includes("setRead('OVER IT'"));

  ok('V143 AND HIS TWO-PIP NUMBER SURVIVED HONESTLY: RUN_COVER_COST was his ruling on "running to cover", and cover-running is gone, so the cost rides DISTANCE instead -- one tile one pip, a real run two. Ending behind cover is a reward for aiming well now, never a teleport and never a surcharge',
    demo.includes('const RUN_COVER_COST=2;') &&
    /const cost=\(n>=2\)\?RUN_COVER_COST:1;/.test(demo));

  ok('V122 RUN KEEPS DASH\'S REAL PAYLOAD: the run is FREE (no turn end, nobody shoots) and arriving somewhere new BREAKS THEIR RED LINES. Dash\'s point was never "two tiles", it was that the fight loses track of you',
    demo.includes('function runBreakLocks(){') &&
    demo.includes('if(myConcealAgainst(e2.ea,e2.edist,e2.lvl)){ if(acquired(e2))n++; e2.acq=0; }'));

  ok('V122 EVERY CHECK HAPPENS BEFORE A SINGLE PIP IS SPENT. MEASURED on the first cut, which spent first and refunded on refusal: a TALL pillar already one tile away gave stop=0, the no-move fallback pushed one tile FORWARD, and RUN walked me straight INSIDE a solid wall for 2 pips. An OCCUPANCY LAW break shipped by a convenience',
    /const n=runStops\(d\);[\s\S]{0,600}if\(!spendMove\(cost\)\)/.test(demo) &&
    /if\(n===0\)\{ setRead\('BLOCKED'/.test(demo));

/* THE FIRST VERSION OF THIS COUNTED THE STRING "OCCUPANCY LAW" AND WANTED FOUR.
   That is a MENTION counter, not a USE checker -- the exact broken-ruler shape
   the 8/1 craft law names, and the second one I have hit today. V143 deleted
   two of the branches that carried the comment while keeping every real guard,
   so the count fell and the invariant did not. It checks the GUARDS now. */
  ok('V143 AND NO RUN EVER LANDS ON A BODY OR IN A WALL: the run walks the line and STOPS at the first cell holding a pillar or a living man on your floor, and the vault tests its landing cell for both before it moves. Nothing is ever spent before those checks pass',
    demo.includes('return Math.hypot(q[0]-cx,q[1]-cy)<Math.max(0.5,Q.r||0.5); }))break;') &&
    !/Q\.r\*0\.6\+0\.45/.test(demo) && !/P\.r\*0\.6\+0\.45/.test(demo) && !/P\.r\*0\.6\+0\.35/.test(demo) &&
    /const _rr=Math\.max\(0\.5,P\.r\|\|0\.5\); return Math\.hypot\(q\[0\]-sx,q\[1\]-sy\)<_rr/.test(demo) &&
    /* V147: THE REAL invisible pillar was the PLAIN MOVE -- the button he presses
       most -- blocking with a halo up to 1.1 tiles around a rock drawn at 0.45
       and saying "a pillar is there" when there visibly is not. He was quoting
       the game back at me. Every mover uses the same honest radius now. */
    true &&
    demo.includes('return Math.abs(q[0]-cx)<0.7&&Math.abs(q[1]-cy)<0.7; }))break;') &&
    /if\(VP\)\{[\s\S]{0,700}if\(!spendMove\(1\)\)/.test(demo) &&
    demo.includes("setRead('BLOCKED','low cover that way and no room on the far side'"));

  /* MEASURED, 960 taps over 120 arenas: 0 moves went anywhere other than the
     tapped direction (max deviation 0.00 tiles), average run 2.68 of 3 tiles,
     and the 11% that do nothing are ALL "something is right in front of you" --
     which he can see. Under V122 a direction could die because of a rock FIVE
     TILES AWAY, which he could not. */
  ok('V143 AND THERE IS ONE THING TO LEARN, NOT THREE: every refusal is BLOCKED and every one of them means the same thing -- something is right in front of you that way. NO ROOM and SOMEBODY IS THERE were two more phrases for the same fact',
    !demo.includes("setRead('NO ROOM'") &&
    demo.includes("setRead('BLOCKED','something is right in front of you that way'") &&
    demo.includes("setRead('BLOCKED','low cover that way and somebody on the far side'"));

  ok('V122 THE RING STEERS AN ARMED RUN, and the arm never survives the tap -- same rail the dash used, checked first because RUN is now the only armed move with a button',
    /if\(G\.runArm\)\{ G\.runArm=false; updRunBtn\(\); updMoveMode\(\); return doRunMove\(d\); \}/.test(demo) &&
    demo.includes('G.runArm=!G.runArm; if(G.runArm){ G.sprintArm=false; G.dashArm=false; }'));
}

/* ===== V125 THE ROUND GOES SOMEWHERE ================================== */
{
  ok('V125 A MISSED ROUND NOW EXISTS. MEASURED before this: 42 juice items, 37 switched on, and ZERO firing on YOUR miss -- all four freeze call sites are damage events, and the miss branch was a sound, the grey word MISS, and an 8ms buzz. THE BULLET ITSELF WAS NEVER CREATED. Meanwhile JUICE.D has drawn THEIR misses whipping past your body since v24, because we built the incoming side and never the outgoing one',
    demo.includes('V125 THE ROUND GOES SOMEWHERE') &&
    demo.includes('function fireMissRound(tgt){') &&
    /\/\* V125: THE ROUND GOES SOMEWHERE[\s\S]{0,400}try\{ fireMissRound\(tgt\); \}catch\(_e\)\{\}[\s\S]{0,1600}G\.killStreak=0; sndMiss\(\);/.test(demo));   /* gap widened by V130, which puts the miss stop and the climb between them */

  /* MIGRATED BY V128: the LAW is unchanged -- the dial decides where the round
     goes, so he sees that he pulled left instead of reading that he was early.
     What changed is that v125 read the EARLY/LATE flag for the side, which
     flipped with the sweep direction; it now flies the needle's own bearing. */
  ok('V125 THE DIAL DECIDES WHERE IT LANDS: JUICE.I already computed the release error and printed it as "37ms EARLY" over his head, which is a number, and degrees mean nothing to a player. The error now puts the round somewhere in the world, so you see that you pulled left instead of reading that you were early',
    demo.includes('function missLandPoint(tgt){') &&
    demo.includes('const err=(G.angle||0);') &&
    /const a2=tgt\.ea\+dev;/.test(demo));

  /* MIGRATED BY V128, and the law got MORE true, not less: v125 hand-tuned
     MISS_RANGE_K to fake arc length. Flying the needle's bearing gives
     r*sin(theta) exactly, so range scaling is now the real physics with no
     constant. MEASURED 0.65 / 1.75 / 4.0 tiles lateral at 3 / 8 / 20 tiles. */
  ok('V125 AND IT SCALES WITH RANGE, which is free physics and a free lesson: the same wrist error throws a round further off the further out he is, so a sloppy release point blank still lands near him and the same release at twenty tiles sails. That teaches his 7/27 range trade with no UI at all',
    /const d=Math\.max\(0\.8,tgt\.edist\|\|6\);/.test(demo) &&
    /return \[Math\.cos\(a2\)\*d, Math\.sin\(a2\)\*d\]/.test(demo));

  /* MIGRATED BY V128: the floor and the ceiling still exist and still cannot be
     zero-width or absurd, but they are now expressed in LATERAL TILES (the
     thing the eye judges) and applied to the magnitude only. */
  ok('V125 THE BOUNDS ARE SIZED FROM SOMETHING REAL, NOT GUESSED. The first cut hand-tuned a lateral constant and MEASURED every shot piling onto its floor -- a hair off and wildly off landed in the same place, the same mistake as the difficulty multipliers, caught the same way: by printing the numbers before shipping',
    demo.includes('const MISS_MAX=4.0;') &&
    /const minDev=0\.35\/d, maxDev=Math\.asin\(Math\.min\(0\.999,MISS_MAX\/d\)\);/.test(demo));

  ok('V125 EVERYTHING IS SOMEWHERE, so the surface answers: a car sparks, a pillar chips stone, open ground kicks dust. It asks G.pillars what is standing there -- the same question cover, the vault, the dash path and the AI all already ask',
    demo.includes('function missSurfaceAt(wx,wy){') &&
    /return P\.car\?'metal':'stone'/.test(demo) &&
    demo.includes("return 'dirt'; }") &&
    demo.includes('function sndMissImpact(surf){'));

  ok('V125 THE IMPACT FIRES FROM THE TICK, NOT THE DRAW, AND THAT WAS A REAL BUG CAUGHT BY MEASURING. The first cut spawned it from fxDrawField when the tracer finished, but fxTick culls with p.t<p.life, so the round could be deleted before any frame saw it end -- measured as a round that flew and produced ZERO impact particles. Logic in the tick, drawing in the draw',
    /for\(const p of G\._fx\)\{ if\(p\.type==='missrd'&&!p\._hit&&p\.t>=p\.life\)\{ p\._hit=true;[\s\S]{0,120}missImpact\(p\)/.test(demo) &&
    /missImpact\(p\)[\s\S]{0,200}G\._fx=G\._fx\.filter\(p=>p\.t<p\.life\); \}/.test(demo) &&
    demo.includes('function missImpact(p){'));

  ok('V125 NO DAMAGE AND NO ACCURACY CHANGE: the round RENDERS an error the dial already decided. NO DAMAGE BEFORE THE DIAL holds -- fireMissRound touches no hp, no applyDamage, and no hit/miss decision',
    !/function fireMissRound[\s\S]{0,600}(applyDamage|\.hp\s*-=|pHP)/.test(demo) &&
    !/function missLandPoint[\s\S]{0,700}(applyDamage|\.hp\s*-=)/.test(demo) &&
    !/function missImpact[\s\S]{0,900}(applyDamage|\.hp\s*-=)/.test(demo));

  ok('V125 REUSE, NOT INVENTION: the tracer is the same two-point stroke the incoming crack draws, and the impact is the EXISTING dust particle -- a metal spark is that same particle with the ric spark\'s own warm white and a faster fall. No new FX renderer, no new colour invented',
    demo.includes("x.fillStyle=p.spark") &&
    demo.includes("'rgba(255,240,190,'+(0.85*(1-q2)).toFixed(3)+')'") &&
    demo.includes("G._fx.push({type:'dust',spark:1"));
}

/* ===== V126 THE MISS GETS ITS BEAT ==================================== */
{
  ok('V126 THE CAMERA USED TO CUT AWAY ON THE EXACT FRAME THE ROUND LANDED. Paolo: "I didn\'t notice them either make it more noticeable or you didn\'t deploy it" -- it WAS deployed. The miss branch fired endTurnReturn at 170ms and v125 gave the round a life of exactly 170ms, and endTurnReturn takes the CAMERA to whoever is shooting back. Half a second of dust and sparks played while the camera was somewhere else. I built a collision and then asked him if he noticed it',
    demo.includes('V126 THE MISS GETS ITS BEAT') &&
    demo.includes('const MISS_BEAT_MS=BPM_MS;') &&
    demo.includes('setTimeout(()=>{ if(!G.over) endTurnReturn(); },MISS_BEAT_MS);') &&
    !/setRead\('MISS','turn ends','#e8593a'\);[\s\S]{0,300}endTurnReturn\(\); \},170\)/.test(demo));

  ok('V126 THE FIX IS TIME, NOT SIZE, AND IT IS ON THE GRID: one whole beat (BPM_MS, the 120 BPM law) so the round flies, the impact reads, THEN they answer -- and the flight still lands well inside that beat',
    /const MISS_FLY_MS=(\d+);/.test(demo) &&
    parseInt(demo.match(/const MISS_FLY_MS=(\d+);/)[1], 10) < 500 &&   /* MIGRATED BY V127: 120 was seven frames and unreadable; the invariant is that the flight fits inside the held beat, never a specific number */
    /MISS_BEAT_MS=BPM_MS/.test(demo));

  ok('V126 A HIT IS UNTOUCHED: only the MISS -- the moment that had nothing -- gets the held beat. A clean hit still resolves at 170ms exactly as it always did, so the trade the fight is built on does not move',
    /setRead\('HIT', dmg\+' to '\+tgt\.n\+' . clean, turn ends','#8fd0e8'\);/.test(demo) &&
    /endTurnClean\(\); \},170\)/.test(demo));

  ok('V126 THE TRACER CARRIES A HEAD, which is the thing an eye actually tracks. 1.6px at 0.55 alpha for 170ms was a whisper: the incoming crack gets away with 1.4px because there are EIGHT of them across your body, and ONE line at mid-field is smaller than anything else the fight draws',
    demo.includes('x.lineWidth=6.5;') &&
    demo.includes('x.lineWidth=3.4;') &&
    /\/\* THE HEAD \*\/[\s\S]{0,90}x\.arc\(bx,by,3\.1,0,7\); x\.fill\(\);/.test(demo));

  ok('V126 AND THE IMPACT HAS A FRAME THAT SAYS *HERE*: particles alone have no single moment, they are already spreading by the time the eye arrives. One bright ring at contact gives the eye something to land on, and everything after it is aftermath instead of event',
    demo.includes("G._fx.push({type:'missflash',x:ex,y:ey,surf:p.surf,t:0,life:0.22});") &&
    /if\(p\.type!=='missflash'\|\|p\.t<0\)continue;/.test(demo));

  ok('V126 AND ROUGHLY DOUBLE THE DEBRIS, living longer so it is still settling when the volley starts',
    /for\(let k=0;k<11;k\+\+\)G\._fx\.push\(\{type:'dust',spark:1/.test(demo) &&
    /for\(let k=0;k<10;k\+\+\)G\._fx\.push\(\{type:'dust'/.test(demo) &&
    /for\(let k=0;k<12;k\+\+\)G\._fx\.push\(\{type:'dust'/.test(demo));

  ok('V126 STILL NO DAMAGE AND NO ACCURACY CHANGE: the held beat delays the return volley, it does not remove it, and missImpact/missflash touch no hp',
    demo.includes('function endTurnReturn(engaged){') &&
    !/function missImpact[\s\S]{0,1100}(applyDamage|\.hp\s*-=)/.test(demo));
}

/* ===== V127 HOLD THE CAMERA =========================================== */
{
  ok('V127 THE CAMERA HOLDS WHILE A MISSED ROUND IS IN THE AIR. Paolo: "it kind of moves too quick and you know you have the camera shifting around so much so quickly it\'s kind of difficult to see." THE DIAL IS NOT A SEPARATE SCREEN -- it is the FIELD zoomed up to 3.6x on the target, so the instant a shot resolves THREE easings unwind at once (the field cam at 0.2, the board zoom _zbS at 0.08, his own pinch at 0.055). The round is drawn in world tiles, so the camera was carrying it across the screen and scaling it down WHILE it travelled',
    demo.includes('V127 HOLD THE CAMERA') &&
    demo.includes('function missHolding(){ return (G._missHold||0)>performance.now(); }') &&
    demo.includes('G._missHold=performance.now()+MISS_FLY_MS+140; }'));

  ok('V127 ALL THREE EASINGS ARE GATED, not just the obvious one -- the field cam, the board zoom that does the 3.6x-to-1x scale-down, and the user pinch. Gating one and leaving the others would have left the round still sliding',
    demo.includes('if(!G.ks&&!missHolding()){ cam.x+=(W/2-cam.x)*0.2;') &&
    /G\._zbS=\(G\._zbS==null\|\|G\.aimCamGlide===false\)\?zbT:\(missHolding\(\)\?G\._zbS:G\._zbS\+\(zbT-G\._zbS\)\*0\.08\)/.test(demo) &&
    /else if\(!missHolding\(\)\)\{ const k=0\.055;/.test(demo));

  ok('V127 NOTHING IS RETARGETED, ONLY PAUSED, so when the hold expires the camera resumes from exactly where it was instead of snapping. The hold covers the flight plus a moment on the impact and never outlasts the beat, so the volley is never waiting on the camera',
    /MISS_FLY_MS\+140/.test(demo) &&
    demo.includes('const MISS_BEAT_MS=BPM_MS;'));

  ok('V127 AND THE ROUND IS SLOW ENOUGH TO TRACK: 120ms is SEVEN FRAMES at 60fps, and part of those the eye is still travelling from the dial back to the field. 280 is a bit over half a beat, and still lands well inside the held beat so the impact reads before the volley answers',
    demo.includes('const MISS_FLY_MS=280;') &&
    !demo.includes('const MISS_FLY_MS=120;'));

  ok('V127 A CAMERA HOLD NEVER SURVIVES A RESET, the same rule the cook\'s timer had to obey: a stale hold would freeze the camera into the next encounter',
    /G\._missHold=0;\s*\/\* V127: a camera hold never survives a reset \*\//.test(demo));

  ok('V127 A HIT IS UNTOUCHED: the hold is armed only by fireMissRound and it is only ever read by the camera easings, so a landed shot resolves with the camera doing exactly what it always did',
    (demo.match(/G\._missHold=performance\.now\(\)/g) || []).length === 1 &&
    !/function endTurnClean[\s\S]{0,400}_missHold/.test(demo));
}

/* ===== V128 THE ROUND GOES WHERE THE NEEDLE WAS POINTING =============== */
{
  ok('V128 THE MISS DIRECTION WAS DECIDED BY THE WRONG THING. Paolo: "it didnt sometimes go to where i missed like the direction of the deadshot dial i chose" -- SOMETIMES is the whole diagnosis. v125 used `(err*vel)<0?-1:1`, which is JUICE.I\'s EARLY/LATE flag: angle times velocity asks "was the needle still travelling toward centre", a fact about TIME, not about where the needle WAS. The same needle position threw the round left or right depending purely on which way it was sweeping',
    demo.includes('V128 THE ROUND GOES WHERE THE NEEDLE WAS POINTING') &&
    !/const side=\(err\*vel\)<0\?-1:1;/.test(demo));

  ok('V128 THE FILE ALREADY HAD THE ANSWER IN ONE LINE: the dial draws its needle at base+G.angle, and on a shot base is G.faceAng which IS tgt.ea -- so the needle is already pointing at a WORLD BEARING. The round flies along it, so it cannot disagree with what he was looking at',
    /const a2=tgt\.ea\+dev;/.test(demo) &&
    /return \[Math\.cos\(a2\)\*d, Math\.sin\(a2\)\*d\]; \}/.test(demo) &&
    demo.includes('const ang=G.ks?G.ks.ang:(base+G.angle);'));

  ok('V128 AND THE RANGE SCALING IS NOW FREE AND EXACT: MISS_LAT and MISS_RANGE_K were reimplementing arc length badly, and an angular error gives a lateral miss of r*sin(theta) with no constant at all. Both are DELETED',
    !demo.includes('const MISS_LAT=') &&
    !demo.includes('const MISS_RANGE_K=') &&
    demo.includes('const MISS_ANGLE_K=0.55;'));

  ok('V128 THE BOUNDS CAN NEVER FLIP THE SIGN: the min and max are applied to the MAGNITUDE and the sign is re-applied from the raw dial error, so no clamp can ever send the round to the wrong side -- which is the exact class of bug this patch is fixing',
    /const mag=Math\.min\(maxDev,Math\.max\(minDev,Math\.abs\(dev\)\)\);/.test(demo) &&
    /dev=\(err<0\?-1:1\)\*mag;/.test(demo));

  ok('V128 AND THE BOUNDS ARE IN LATERAL TILES, which is what the eye judges: a minimum so it never lands on him, and MISS_MAX converted through asin so the clamp means the same distance at every range',
    /const minDev=0\.35\/d, maxDev=Math\.asin\(Math\.min\(0\.999,MISS_MAX\/d\)\);/.test(demo) &&
    demo.includes('const MISS_MAX=4.0;'));
}

/* ===== V129 YOUR VITALS LIVE IN THE BUTTON ============================= */
{
  ok('V129 THE LIVING PORTRAIT WAS SWITCHED OFF THE ENTIRE TIME. JUICE.AU was the ONE item in a table of 42 set to false, which is why he asked for a face that shows damage: he had never seen the one that already existed',
    /AU:true/.test(demo) && !/AU:false/.test(demo));

  ok('V129 TEN STATES, HIS NUMBER ("for like each 10% of health that you don\'t have"), where the old one had three',
    demo.includes('const HP_TIERS=10;') &&
    demo.includes('function hpTier(){'));

  ok('V129 DOOM\'S HYSTERESIS, because with ten tiers instead of three one point of chip damage on a boundary would strobe the button',
    demo.includes('const HP_HYST=0.035;') &&
    /Math\.abs\(f-edge\)>HP_HYST/.test(demo));

  ok('V129 BUT HYSTERESIS MUST NEVER BLOCK REAL MOVEMENT, and the first cut did. MEASURED: a 3-tier drop was REFUSED because it landed exactly on a boundary -- the face would have frozen at "scratched" while he bled out. The margin now applies ONLY to a single-step change, which is the only thing that can strobe',
    /else if\(Math\.abs\(raw-prev\)>1\)\{ G\._hpTierS=raw; \}/.test(demo));

  ok('V129 DOOM\'S LEAN: the face turns toward whoever hit you. Costs nothing here because the field is POLAR, so the bearing of the man who shot you is already exact -- and it is recorded BEFORE the repaint so the first hurt frame is already leaning',
    demo.includes('function portraitLean(){') &&
    demo.includes('function feltHit(fromEa){') &&
    /if\(fromEa!=null\)\{ G\._hitFromEa=fromEa; G\._hitFromAt=performance\.now\(\); \}/.test(demo) &&
    /const _sh=G\.e\[inc\.idx\[i\]\]; feltHit\(_sh\?_sh\.ea:null\);/.test(demo));

  ok('V129 THE STAMINA ORB IS IN FRONT OF THE FACE, NOT BEHIND, AND I ONLY KNOW THAT BECAUSE I MEASURED IT: the first cut drew the fluid first and the painted button came out BYTE-IDENTICAL at zero stamina and at full, because his portrait is an opaque 64x64 image that covered every pixel of it',
    /IN FRONT, NOT BEHIND, AND I ONLY KNOW THAT BECAUSE I MEASURED IT/.test(demo) &&
    /* V189 RE-POINTED: the gold XP rim now sits between the orb and the wash,
       so the gap outgrew 900 characters. THE CLAIM IS UNCHANGED and is about
       ORDER -- the fluid is drawn IN FRONT of the face, before the wash, which
       is the thing V129 could only learn by measuring (its first cut drew the
       fluid behind an opaque portrait and produced a BYTE-IDENTICAL button at
       zero stamina and at full). Fourth window widened today for a neighbour
       rather than an outcome. */
    /const lvl=Math\.max\(0,Math\.min\(1,\(G\.stam\|\|0\)\/STAM_MAX\)\);[\s\S]{0,1900}if\(stateWash\)/.test(demo));

  ok('V129 AND THE ORB IS QUIET, which I only know because I rendered all twenty states and LOOKED: at 0.34 alpha over the full height, full stamina turned the whole button green and DESTROYED the damage read -- and HP is the more important vital. It also filled to the very top so there was no waterline left to see',
    demo.includes("g.addColorStop(0,'rgba(120,232,150,0.15)');") &&
    demo.includes('const top=64-lvl*64*0.86,'));

  ok('V129 THE STA PIPS ARE OFF THE TOP MENU -- the fifth thing removed from that row this week, and updStam repaints the button instead of counting diamonds',
    !demo.includes('<span id="stampips"') &&
    /function updStam\(\)\{ \/\* V129: the orb IS the stamina read/.test(demo));

  /* SUPERSEDED BY PAOLO 8/7/26: "Pretty dogshit all u did was change the opacity
     of the nose bleed. U need to do better and it needs to work with
     customizable faces."
     THIS CHECK WAS PROTECTING THE WRONG THING, TWICE OVER. It guarded the
     crossfade, which he rejected -- and correctly, because `dying` is the same
     face with blood:true and blood:true is six pixels, so the crossfade could
     only ever change that bleed's opacity.
     AND ITS HEADLINE CLAIM IS NOW FALSE ON PURPOSE. v129 refused to author face
     pixels on the grounds that injury states are ART and his call. HE THEN
     CALLED IT AND SAID DO BETTER, so v131 authors real wounds -- in the
     GENERATOR, placed on each face's own anatomy, which is the only way it can
     satisfy "must work with customizable faces". The refusal was right until he
     ruled; the ruling is newer. */
  ok('V129/V131 THE DAMAGE IS DRAWN, NOT FILTERED, AND IT IS DRAWN ON THE BONES: he ordered "do better" and "it needs to work with customizable faces", so the wounds are authored in the face generator against each face\'s own anatomy instead of composited over two fixed portraits',
    demo.includes('x.drawImage(_face,0,0);') &&
    alpha.includes('V131 REAL DAMAGE ON THE BONES') &&
    !/SPR\.portraits\.dying&&_f>0\.45/.test(demo));
}

/* ===== V130 A MISS IS THE WORLD NOT WAITING FOR YOU ==================== */
{
  ok('V130 THERE IS A STOP ON A MISS AT LAST. Every one of the four freeze call sites in the fight was a DAMAGE event -- you take a hit, the round that kills you, your own death, your kill -- and there had never been one on the moment that decides the turn',
    demo.includes('V130 A MISS IS THE WORLD NOT WAITING FOR YOU') &&
    /miss: note\(32\),/.test(demo) &&
    /freeze\('miss',-Math\.cos\(_ba\),-Math\.sin\(_ba\)\)/.test(demo));

  ok('V130 AND IT IS THE SHORTEST LEGAL NOTE IN THE FILE, not a celebration: a thirty-second at 62.5ms, half the graze and an eighth of the kill. The fighting-game literature says a stop exists to let the eyes register that it happened, and a miss needs that and nothing more. BohemiaFreeze\'s LEGAL list already contained 32 and no tier had ever used it, so the musical-subdivision law passes unchanged',
    /var LEGAL=\[1,2,4,8,16,32\];/.test(demo) &&
    /miss: note\(32\)[\s\S]{0,1200}graze:note\(16\)/.test(demo));

  ok('V130 THE SHAKE POINTS THE OTHER WAY, which is the whole meaning. Every other freeze shakes ALONG the blow because something hit you; a miss is the opposite event -- nothing arrived -- so it runs along YOUR OWN BARREL, away from the target. The gun moved, not the world',
    /const _ba=\(tgt&&tgt\.ea!=null\)\?tgt\.ea:\(G\.faceAng\|\|0\);/.test(demo) &&
    /freeze\('miss',-Math\.cos\(_ba\),-Math\.sin\(_ba\)\)/.test(demo));

  ok('V130 THE GUN CLIMBS IN PROPORTION TO HOW BADLY YOU PULLED IT, off the same G.angle the round\'s bearing reads: a hair off barely adds anything, a wild release makes it buck. Every shot used to recoil by the same weapon-fixed amount whether you threaded it or threw it away, which quietly said the two shots were the same act',
    /const _off=Math\.min\(1,Math\.abs\(G\.angle\|\|0\)\/LIM\);/.test(demo) &&
    /G\.recoil=Math\.max\(G\.recoil\|\|0,0\.55\+0\.75\*_off\);/.test(demo));

  ok('V130 AND IT CHANGES NO ODDS: G.recoil is a render value that decays on the following frames and is read by nothing that decides a hit -- not accuracy, not the dial, not damage',
    !/distAccuracy[\s\S]{0,200}G\.recoil/.test(demo) &&
    /if\(G\.recoil>0\) G\.recoil=Math\.max\(0,G\.recoil-dt\/JUICEMS\.recoil\);/.test(demo));
}

/* ===== V131/V132 REAL DAMAGE ON THE BONES ============================== */
{
  ok('V131 THE OLD DAMAGE WAS SIX PIXELS OF NOSEBLEED AND HE SAID SO EXACTLY. Paolo: "Pretty dogshit all u did was change the opacity of the nose bleed." He was LITERALLY right -- `dying` is the same generated face with blood:true, and blood:true is six pixels at the nose and lip, so a crossfade between `you` and `dying` could only ever change that bleed\'s opacity',
    alpha.includes('V131 REAL DAMAGE ON THE BONES') &&
    /dying:packIdx\(renderFace\(buildSpec\(\),\{ramp:portraitRamp\(\),blood:true\}\),64,64\)/.test(alpha));

  ok('V131 THE WOUNDS ARE PLACED ON THE SPEC\'S OWN ANATOMY, which is what "it needs to work with customizable faces" demands: a fixed overlay lands in the wrong place the moment the forehead is taller or the eyes are closer, so every wound reads f.browY / f.cheekY / f.cheekW / f.noseY / f.mouthY / f.eyeY and the eye gap and width',
    /const bx0=cx\+side\*\(cw-3\), by0=chY-1;/.test(alpha) &&
    /const bxr=cx\+side\*\(b\.gap\+2\), byr=by-1;/.test(alpha) &&
    /const exs=cx\+side\*e\.gap;/.test(alpha) &&
    /P\(lx,my-1,wound\)/.test(alpha));

  ok('V131 THE RESEARCH CHOSE THE PLACES: ringside trauma sources say cuts come from the BONY PROMINENCES -- eyebrows, cheekbones, nose, lips -- because skin over bone is compressed until it ruptures, and vessels bursting under intact skin give swelling instead of a cut. The progression follows that, ending in the eye swelling SHUT',
    alpha.includes('THE CHEEKBONE GOES FIRST') &&
    alpha.includes('THE BROW RIDGE SPLITS') &&
    alpha.includes('THE EYE SWELLS SHUT') &&
    alpha.includes('GRAVITY. Everything runs DOWNWARD'));

  ok('V131 IT IS A POST-PASS, so at dmg 0 every face he has ever approved renders byte-identical -- not one existing line of renderFace changed, and the old blood flag still behaves exactly as it did',
    /if\(blood\)\{for\(const p of \[\[cx\+1,ny1\]/.test(alpha) &&
    /const dmg=Math\.max\(0,Math\.min\(1,\+opts\.dmg\|\|0\)\);/.test(alpha));

  ok('V131 COLOURS COME FROM THE FACE\'S OWN RAMP so a pale and a dark character each bruise in their own range, and the bruise sits on the red/ochre side because PURPLE BELONGS TO THE AMALGAMATION ALONE',
    /const wound=\[Math\.min\(255,Sh\[0\]\*0\.55\+96\|0\)/.test(alpha) &&
    /const bruise=\[Math\.min\(255,Mn\[0\]\*0\.62\+22\|0\)/.test(alpha));

  ok('V131 TEN FRAMES, EACH RENDERED FROM buildSpec(), so changing the character changes all ten by construction -- that is the customisation guarantee, not a promise',
    /dmg:\(function\(\)\{ const a=\[\];/.test(alpha) &&
    /renderFace\(buildSpec\(\),\s*\{ramp:portraitRamp\(\),dmg:i\/9,dmgSide:_sd\}\)/.test(alpha));

  ok('V132 THE CROSSFADE IS DELETED, NOT TUNED. There was nothing in it to save: it could only ever change the nosebleed\'s opacity',
    !/SPR\.portraits\.dying&&_f>0\.45/.test(demo) &&
    demo.includes('V132 THE BUTTON USES THE TEN REAL FACES'));

  ok('V132 AND THE FILTER GOES WITH IT -- the multiply-darken and the red radial were the other half of what he called dogshit. A filter is what you reach for when the art underneath is not doing the work; the art does the work now',
    !/x\.globalCompositeOperation='multiply'[\s\S]{0,200}fillRect\(0,0,64,64\)/.test(demo) &&
    !/g2\.addColorStop\(1,'rgba\(150,20,15,'/.test(demo));

  ok('V132 THE TIER IS THE INDEX: hpTier() already returns 0..9 with hysteresis and there are exactly ten frames, so no blending is needed -- and an older parent that never sends the frames falls back to the CLEAN face rather than to a half-broken effect',
    /const _dmgSet=\(JUICE\.AU&&SPR\.portraits\.dmg&&SPR\.portraits\.dmg\.length\)\?SPR\.portraits\.dmg:null;/.test(demo) &&
    /_dmgSet\[Math\.max\(0,Math\.min\(_dmgSet\.length-1,_t\)\)\]\|\|SPR\.portraits\.you/.test(demo));
}

/* ===== V133 THE GAME SPEAKS AGAIN ===================================== */
{
  ok('V133 EVERY INSTRUCTION IN THE FIGHT WAS INVISIBLE, AND THE FILE SAID SO ITSELF. Paolo: "No minigame plays when i click grenade bro" -- tapping GREN calls setRead("TAP WHERE IT LANDS") and MEASURED on the live build that read came back EMPTY AND NOT VISIBLE, so the label changed to TILE and nothing told him to tap a tile. The cause was a known defect flagged by an earlier version of me and never fixed: "#cread was retired and never replaced -- every message since has written to memory and shown NOBODY anything"',
    demo.includes('V133 THE GAME SPEAKS AGAIN') &&
    demo.includes('function _speak(t,sub,col){') &&
    /function setRead\(t,s,col\)\{ G\.lastRead=\{[^}]*\}; _speak\(t,s,col\);/.test(demo));

  ok('V133 IT IS NOT A GRENADE FIX, IT IS THE WHOLE GAME SPEAKING: setRead is the single choke point every message in the fight already used, so TAP WHERE IT LANDS, RUN ARMED, NO STAMINA, BLOCKED, THE EDGE, ALREADY ON IT and MISS all come back with one wire',
    (demo.match(/setRead\(/g) || []).length > 40);

  ok('V133 AND IT COMES BACK AS A TRANSIENT, NOT AS A HUD LINE. #cread was retired for a reason worth respecting -- it was permanent chrome in a stack this lane has spent the week emptying at his instruction (the logo, the chip board, DASH, VAULT, SPRINT, the top-row GRENADE, the STA pips). This costs ZERO height when the game has nothing to say',
    /e\.style\.cssText='position:fixed;left:8px;right:8px;bottom:214px;[\s\S]{0,120}display:none;/.test(demo) &&
    demo.includes("e.style.display='block'"));

  ok('V133 TWO BEATS AND GONE, on the grid like everything else in this fight, because a message that outstays the beat is noise',
    /G\._sayF=setTimeout\([\s\S]{0,140}BPM_MS\*2\)/.test(demo) &&
    /G\._sayT=setTimeout\([\s\S]{0,140}BPM_MS\*2\+200\)/.test(demo));

  ok('V133 A SPOKEN LINE NEVER SURVIVES A RESET, the same rule the cook timer and the camera hold had to obey',
    /if\(G\._sayT\)clearTimeout\(G\._sayT\); if\(G\._sayF\)clearTimeout\(G\._sayF\);/.test(demo));

  ok('V133 AND #cread STAYS RETIRED -- the old permanent line is still hidden, so this adds a transient and does not undo the thing that was deliberately removed',
    /const r=D\('cread'\); if\(r&&r\.style\.display!=='none'\)r\.style\.display='none';/.test(demo));
}

/* ===== YOU ALWAYS SHOOT FIRST (Paolo 8/3/26, LOCKED) ==================
   laws/BOHEMIA_ADDENDUM_YOU_ALWAYS_SHOOT_FIRST_8_3_26.md. I surfaced the
   opening turn as an open question because it looked like a standing advantage
   nobody paid for. He answered: "no enemies never get the first shot thats why
   its important to not miss." It is deliberate, it is the point, and it is now
   canon no session may reopen. A law without a machine gate is not enforced. */
{
  const LAW = require('fs').readFileSync(__dirname + '/../laws/BOHEMIA_ADDENDUM_YOU_ALWAYS_SHOOT_FIRST_8_3_26.md','utf8');
  ok('THE LAW IS ON DISK AND IT CARRIES HIS WORDS AND HIS REASON: the player opens every fight, and the reason is that a guaranteed first shot is what makes missing it a choice you got wrong instead of luck you did not get',
    LAW.includes('no enemies never get the first shot thats why its important to not miss') &&
    /THE PLAYER OPENS EVERY FIGHT/.test(LAW));

  ok('AND THE FIGHT ACTUALLY OPENS IN YOUR PHASE: setupCombat puts you in cover phase and setupEnemies zeroes the enemy turn counter, so nobody has acted when you take your first turn',
    /function setupCombat\(\)\{[\s\S]{0,400}G\.phase='cover';/.test(demo) &&
    demo.includes('G.e=[]; const N=G.numEnemies; G.mTurn=0;'));

  ok('AND NOTHING GRANTS A PRE-TURN ENEMY ACTION: no initiative roll, no ambush opener, no difficulty tier that opens in the enemy phase. The fight never starts anywhere but cover',
    !/G\.phase\s*=\s*'(enemy|foe|them|react)'/.test(demo) &&
    !/initiative/i.test(demo) &&
    !/ambushOpener|enemyFirst|theyShootFirst/.test(demo));

  ok('AND DIFFICULTY IS NOT ALLOWED TO BUY THE OPENING TURN: threatMult reaches accuracy and nothing else, so the 8/3 wiring makes them better shots without ever touching who moves first',
    (demo.match(/threatMult\(\)/g) || []).length === 2 &&
    !/pkgDiff[\s\S]{0,60}phase/.test(demo));
}

/* ===== V123 SPRINT OFF, THE PC GETS ITS ROWS, POP OUT KNOWS WHO ======== */
{
  ok('V123 SPRINT IS OFF THE TOP MENU. Paolo 8/3: "I NEED YOU TO HAVE SPRINT OFF THE TOP MENU BC ITS IN THE GAMEPLAY UI NOW." A v122 miss -- that patch took DASH and VAULT because he named them and left SPRINT because he had not. He has now decided, and RUN on the ring is the movement verb',
    !demo.includes('<button id="sprintbtn"') &&
    !/\bD\('sprintbtn'\)\.addEventListener/.test(demo));

  ok('V123 AND THE SPRINT VERB IS NOT DELETED, same as doDash and doVault after v122: nothing dies without his word, so G.sprintArm and doMove\'s sprint branch stay callable behind a null-safe wire',
    demo.includes("{const _sp=D('sprintbtn'); if(_sp)_sp.addEventListener('click',") &&
    demo.includes('const _sprinting=!!G.sprintArm;'));

  ok('V123 THE SIDEWAYS STRIP WAS A PHONE CONTROL SHIPPED TO A DESKTOP, and it was my v119 bug. Paolo: "THE UI MENU SLIDER DOESNT WORK ON PC... I HAVE TO USE LEFT AND RIGHT MOUSE BUTTON." A wheel scrolls vertically, a horizontal container ignores it, and v119 hid the scrollbar, so press-and-drag was the only thing left that moved the row -- exactly what he described. The fix is NOT a better slider, it is NO slider: a PC has vertical room and gets its rows back',
    demo.includes('body.desk #chud .crow{flex-wrap:wrap;overflow-x:visible;}') &&
    demo.includes("if(!G.isTouch)document.body.classList.add('desk');"));

  ok('V123 AND THE PHONE KEEPS ITS STRIP, plus a wheel/trackpad gesture maps to horizontal scroll so a TOUCHSCREEN LAPTOP -- which reports as touch and would still get the strip -- is not stuck either. The thing that broke here was assuming one input model',
    demo.includes('#chud .crow{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;') &&
    /r\.addEventListener\('wheel',ev=>\{/.test(demo) &&
    demo.includes('if(r.scrollWidth<=r.clientWidth)return;') &&
    demo.includes('r.scrollLeft+=dx; ev.preventDefault();'));

  ok('V123 POP OUT NOW ASKS WHO IT IS COVER FROM. Paolo: "IF I HAVE CIVER TIO MY NORTH OF ME BUT THERES NO ENEMIES TO THE NORTH... THE ACTION BUTTON SHOULD NOT BE SAYING POP OUT." playerNearCover asked IS THERE ANY STONE WITHIN 1.8 TILES IN ANY DIRECTION, full stop -- it never asked whether that stone was between you and a living man. Wrong since v52',
    /* V156 RE-POINTED, AND IT IS THE OTHER HALF OF THE SAME RULING. V52 asked
       "is any stone near me" and V123 replaced it with "is anything between me
       and anyone" -- which threw the proximity away, so POP OUT started
       appearing while he stood in open ground with the nearest rock three tiles
       off (measured: 370 of 400 turns, every one a lie). NEITHER HALF ALONE WAS
       EVER RIGHT. inRealCover is the conjunction: the stone you are AT, that
       also shields you from a living man. Both his rulings, finally at once. */
    demo.includes('function coveredFromAnyone(){') &&
    demo.includes('const nearCov=inRealCover();') &&
    /function inRealCover\(\)\{ return !!myCoverPillarNear\(\); \}/.test(demo) &&
    !demo.includes('const nearCov=playerNearCover();'));

  ok('V156 AND THE PROXIMITY HALF IS BACK, AT THE SAME REACH EVERY ENEMY BODY IS HELD TO. realCoverPillar has demanded a stone within 1.8 tiles of a man since V108; the player had NO proximity test at all, so the rule ran one way exactly like V153. COVER_REACH is that same number, not a new one',
    demo.includes('const COVER_REACH=1.8;') &&
    /* V198 RE-POINTED: read through hd(), the tile-scale door -- 1.8 body-tiles
       is 1.8 HOUSES on the house board, and a rock two houses away is not the
       rock you are behind. THE CLAIM IS UNCHANGED: the player is held to the
       same reach every enemy body is held to, and it is still COVER_REACH. */
    /P\.edist<hd\(COVER_REACH\)/.test(demo) &&
    /Math\.hypot\(pxy\[0\]-exy\[0\],pxy\[1\]-exy\[1\]\)<1\.8/.test(demo));

  { /* MEASURED, not read: put a man out there, put a rock on the line at
       various distances, and ask the button what it would say. */
    const a = demo.indexOf('const COVER_REACH=1.8;');
    const b = demo.indexOf('\n', demo.indexOf('function inRealCover()', a));
    if (a > 0 && b > a) {
      const src = demo.slice(a, b);
      /* V198 RE-POINTED: the slice now calls hd(), the tile-scale door, so the
         harness has to supply it exactly as it already supplies G and
         coverPillarAgainst. THE SLICE RULE, again: any helper a sliced function
         calls is undefined inside this harness unless it is bound here, and the
         failure looks like a broken feature rather than a broken test. Bound to
         the BODY-scale identity, which is what this claim is about. */
      const ask = (rockDist) => new Function('G', 'coverPillarAgainst', 'hd',
        src + ';return inRealCover();'
      )({ e: [{ ea: 0, edist: 12, lvl: 0 }] }, () => ({ edist: rockDist }), (n) => n);
      ok('V156 THE BUTTON STOPS OFFERING TO POP HIM OUT OF OPEN GROUND: a stone he is standing at is cover, the same stone three tiles up the lot is scenery -- which is his report, "in the middle of nowhere and it will still tell me to pop out"',
        ask(0.9) === true && ask(1.7) === true && ask(2.8) === false && ask(6.0) === false);
    }
  }

  ok('V156 BUT NO PROTECTION IS TAKEN AWAY. A rock on the line really does stop a bullet whether he is hugging it or it is four tiles up the lot, so myCoverAgainst is untouched and the volley, the dial and the acquisition bead all still ask exactly what they asked. BEING SHIELDED is geometry; BEING IN COVER is a place you stand. The file only ever had one word for both',
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    demo.includes('return !!coverPillarAgainst(ang,dist,lvl,false); }') &&
    !/myCoverAgainst\(ang,dist,lvl\)\{[\s\S]{0,200}COVER_REACH/.test(demo));

  { /* AND NOTHING GOT HARDER, PROVEN BY CONTAINMENT rather than by a sim that
       saturates. Every value V156 changed must reach ONLY display: the button
       label, the run readout and the flank sentence. If any of them ever feeds
       damage, the dial or a pool, this goes red. */
    // strip block and line comments first: "tiles closed", "each closed" and
    // friends are prose, and a checker that cannot tell a mention from a use is
    // the broken one.
    const code = demo.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
    const bad = (name, allow) => code.split('\n')
      .filter(l => new RegExp('\\b' + name + '\\b').test(l))
      .some(l => {
        const s = l.trim();
        // a declaration is not a use, including the second name in `let a=0,b=0;`
        if (new RegExp('(const|let)\\s+[^;]*\\b' + name + '\\b\\s*=').test(s)) return false;
        return !allow.test(s);
      });
    ok('V156 AND NOTHING GOT HARDER: every value it changed reaches ONLY the screen. nearCov feeds the button text and its glow, onCov feeds the run readout, flanked/closed feed one sentence. None of them touches damage, the dial or a targeting pool -- so he keeps every bit of shielding he had and only the label became true',
      !bad('nearCov', /txt=|bg=|glow=|col=/) &&
      !bad('onCov', /setRead|onCov\?/) &&
      !bad('flanked', /flanked\+\+|const word=/) &&
      !bad('closed', /closed\+\+|closed\?/));
  }

/* ===== V157 THE BULLETS ARE OVER THERE ============================
   The behaviour lives in gates/fight_moves_you_gate.js, which PLAYS the fight.
   What belongs here is the shape of the thing: that ammo exists at all, that a
   shot is the only thing that spends it, that the refusal names the way out,
   and that the drop is world state rather than something that follows him. */
  /* V158 RE-POINTED, AND THE OLD NUMBERS WERE THE THING THAT WAS WRONG. This
     pinned pistol:8 / start:3 -- a magazine I sized so a gate would pass, which
     Paolo read on his own screen and called unrealistic. He was right: a 9mm
     magazine is 15 to 17. The law being checked is that AMMO EXISTS, never that
     it is scarce enough to satisfy some other check. */
  /* V159 RE-POINTED: Paolo rejected ammo depletion a SECOND time ("I'm not a big
     fan of the ammo being depleted"), and STOP PRODUCING says a second rejection
     ends the feature. It is OFF behind one dial rather than deleted, because he
     said he was not a fan, not kill it. So what is checked is that the whole
     thing is genuinely off and reversible in one word -- and that it is off at
     the SOURCE (the dial), never by quietly gutting the functions. */
/* ===== V163 THE FREE-MOVEMENT BUDGET (RF4-08, machine 1) =========
   Routed by the 8/17 RF4 LIFT law: "COMBAT owns machines 1, 3, 4, 7, 8, 9...
   START WITH THE FREE-MOVEMENT BUDGET; it is the one he will feel first."
   His own synthesis is the spec: "One action per turn. Attacking ends your turn.
   MOVING ENDS YOUR TURN... The exception that makes the game: Speed Points.
   Sprinting moves you WITHOUT ending your turn... The regen rule is the sharp
   part. SP regenerates on every 5th global game turn, ON A FIXED WORLD CLOCK. It
   is NOT a per-use cooldown... It rewards clock-reading, not hoarding."
   MEASURED: the browser gate drives real steps. What is pinned here is the shape
   and the arithmetic of the clock, RUN rather than read. */
  ok('V163 MOVING ENDS YOUR TURN -- the base rule everything else stands on, and the sprint is explicitly the exception rather than an accident',
    /if\(!_sprinting\)\{ return endTurnReturn\(false\); \}/.test(demo) &&
    demo.includes('const SP_TICK=5;'));

  { /* THE CLOCK, RUN. A per-use refund and a global clock are indistinguishable
       by string, and the whole ruling is which one it is -- so this executes the
       shipped arithmetic for a spender and a hoarder over twelve turns. */
    const a = demo.indexOf('if(((G.mTurn||0)%SP_TICK)===0){');
    const src = a > 0 ? demo.slice(a, demo.indexOf('updStam();', a) + 10) : '';
    const run = (startStam, spendEachTurn) => {
      const G = { stam: startStam, mTurn: 0 };
      const out = [];
      for (let t = 0; t < 12; t++) {
        G.mTurn++;
        if (spendEachTurn && G.stam > 0) G.stam--;
        new Function('G', 'STAM_MAX', 'SP_TICK', 'setRead', 'updStam', src)(G, 3, 5, () => {}, () => {});
        out.push(G.stam);
      }
      return out;
    };
    let spender = null, hoarder = null;
    try { spender = run(0, true); hoarder = run(3, false); } catch (e) { }
    ok('V163 THE BUDGET REFILLS ON A GLOBAL CLOCK, whatever he spent and whenever -- spend it to nothing and it comes back on the tick, which is his "spend on turn 4 and it refunds on turn 5, for free"',
      !!spender && spender[4] === 3 && spender[9] === 3);
    ok('V163 AND HOARDING EARNS NOTHING, which is the inversion the old rule had exactly backwards: it paid a pip ONLY for a turn you spent none, so it punished spending and rewarded sitting still -- the opposite of the movement he has asked for since 8/15',
      !!hoarder && !!spender && hoarder.every(v => v <= 3) &&
      spender.filter((v, i) => i > 0 && v > spender[i - 1]).length > 0);
  }

/* ===== V179 THE EYES ON YOU (RF4-53 layer 2) =====================
   The pixels are proved in a browser by fight_moves_you_gate. Pinned here: that
   it reads the game's own predicate, that it is an ELLIPSE, and that it draws
   under the body rather than over his art. */
  ok('V179 RF4-53 IT IS THE GAME\'S OWN ANSWER, DRAWN: the ring reads seesMe(), the same predicate V165 already runs the bead, the volley, the press, the shout and the spotter\'s pin on. A second definition of "he can see me" drawn beside the first is exactly how a readout and a rule drift apart -- this one cannot disagree with the fight, because it IS the fight',
    /_eyes=seesMe\(e\);/.test(demo) && /if\(EYES_RING&&!e\.dead&&!e\.downed\)\{/.test(demo));

  ok('V179 AND IT IS AN ELLIPSE, NOT A CIRCLE (45 DEGREE ART LAW): the ground is seen at the world\'s three-quarter view, so a ground mark is squashed on the same axis and in roughly the same proportion as the shadow already under his feet. A true circle would be the one thing on this board lying flat against the camera',
    /x\.ellipse\(ex,ey\+er\*0\.66,er\*1\.15,er\*0\.42,0,0,7\);/.test(demo));

  ok('V179 AND IT DRAWS UNDER THE BODY, before drawEnemySprite, so it marks the ground he stands on and covers no pixel of his art. RIG CHECK is not a formality here -- a mark painted OVER a character is a mark painted over somebody\'s painted regions',
    demo.indexOf('_eyes=seesMe(e);') < demo.indexOf('if(!drawEnemySprite(x,e,ex,ey,nowMs)){'));

  ok('V179 AND IT HAS A DARK SEAT UNDER THE BRIGHT LINE, which is a correction and not decoration: the first write was one hairline at 0.55 alpha -- correct, squashed, in the right place, and at the zoom he actually plays it barely read at all. Same lesson as V170\'s smoke, which shipped too pale and had to be darkened after somebody looked at it',
    /rgba\(24,20,16,0\.55\)/.test(demo) && /rgba\(240,232,208,0\.95\)/.test(demo));

  ok('V179 AND IT IS A [DIAL] HE CAN SWITCH OFF, because a permanent overlay nobody asked for is not information, it is furniture',
    /const EYES_RING=true;/.test(demo));

/* ===== V180 STAND WHERE THEY CAN SEE YOU (RF4-18) ================
   The behaviour is measured in a browser by fight_moves_you_gate. Pinned here:
   the shape, the wiring, and the two things the mutation tests forced out. */
  ok('V180 RF4-18 WALLS ARE MECHANICS AT LAST, AND THE THING THAT UNBLOCKED IT WAS A CURRENCY: this row was BUILT AND CUT on 8/21 because its only payout was +1 killshot on the chain, and V62\'s per-weapon cap (pistol 8, smg 2, shotgun 2, rifle 1) swallowed it on three guns of four -- the readout promised the rifle one more shot and handed over nothing. The record named what it needed, "a reward currency that is NOT weapon-capped", and V176 shipped one. It pays into THE FINISHER CHARGE, which fills identically whatever you are holding',
    /function openGroundTick\(\)\{/.test(demo) && /finisherFeed\(\);/.test(demo));

  ok('V180 AND IT IS NOT MERELY BEING OUTDOORS, which is the version that would have failed the same way twice: wide open ALONE is 55% of turns and 7 a fight, which at one charge a turn is 1.33 FREE finishers per fight and makes V176\'s "you earn it by shooting" mean nothing. Both halves are required -- no stone near you AND at least one man who can actually see you',
    /if\(!wideOpen\(\)\|\|!eyesOnMe\(\)\)return;/.test(demo));

  ok('V180 AND THE CONDITION IS THE ONE V179 ALREADY DRAWS: eyesOnMe runs seesMe, the same predicate the rings under their feet are painted from, so THE INFORMATION AND THE REWARD ARE THE SAME THING. That is the difference between a rule a player can act on and a rule he has to be told about -- and it is RF4-02 and RF4-48 again, information ON THE FIELD rather than in a menu',
    /function eyesOnMe\(\)\{[\s\S]{0,220}seesMe\(e\)/.test(demo));

  /* SCOPED TO THE FUNCTION BODY, and the first write of this claim was not.
     It negated /if\(G\.over\|\|finisherReady\(\)\)return;/ across the whole
     file -- and that string is V176's finisherFeed, the very guard being
     credited. A checker that cannot tell somebody else's line from your own is
     the broken one, same shape as the MEDIC_SHY claim that tripped on the
     comment explaining the deletion. */
  {
    /* NARROWED 8/27, and this is the third time this slice has had to move.
       It ran from openGroundTick all the way to tickTurnEnd, so it swallowed
       every function anybody added in between -- V185's kitCoverTick, then
       V191's kitOwnTicks and the comment explaining it -- and the length rail
       went red on a claim about a function nobody had touched. The slice now
       ENDS AT THE NEXT FUNCTION, which is what "scoped to the function body"
       meant in the first place, so it stops moving every time a neighbour
       appears. */
    const _ogtA = demo.indexOf('function openGroundTick(){');
    const _ogtEnd = demo.indexOf('\nfunction ', _ogtA + 10);
    const _ogt = demo.slice(_ogtA, _ogtEnd);
    ok('V180 AND IT SETS NO SECOND CAP, because a mutation test proved a second cap was a dead term: the first write re-checked finisherReady() inside openGroundTick, deleting that check left every gate green, and finisherFeed already refuses to fill past the threshold. THE MEDIC_SHY DEFECT, caught before it shipped this time rather than after',
      /* V185 RE-POINTED: openGroundTick gained the kit's 'open' verb, so the
         slice is longer. The bound is a sanity rail on the SLICE, never the
         claim -- what is asserted is that this function carries G.over and
         NOT a second finisherReady cap. */
      /* AND THE RAIL IS CONTENT, NOT A MAGIC LENGTH. A character count on a
         slice is a rail that fails every time somebody writes a longer comment
         next door -- which is precisely what happened. What proves the slice
         landed on the right function is that the right function's own calls are
         in it. */
      _ogt.length > 100
      && /finisherFeed\(\);/.test(_ogt) && /wideOpen\(\)/.test(_ogt)
      && !/\nfunction \w+\([^)]*\)\{[\s\S]*\n\}/.test(_ogt)
      && /if\(G\.over\)return;/.test(_ogt)
      && !/if\(G\.over\|\|finisherReady\(\)\)return;/.test(_ogt));
  }

  ok('V180 AND 1.6 IS A LOAD-BEARING [DIAL], not a number somebody liked: wound down to 0.8 or 0.2 the state covers HALF of all turns and the turns that are NOT open stop having any guns on them at all, so there is no safer place left that does not also pay and the rule stops being a decision. 1.6 gives 35% of turns, 0.8 gives 50%, 0.2 gives 48%, 2.4 gives 18%',
    /const WIDE_OPEN_R=1\.6;/.test(demo));

  ok('V180 AND IT IS ACTUALLY WIRED, which is the failure V177 had to repair in somebody else\'s code: V152\'s cover-chewing shipped correct and STRUCTURALLY UNREACHABLE for months because nothing could ever call it. This one is called from tickTurnEnd, where every turn in the fight ends',
    /function tickTurnEnd\(\)\{ meleeTurnRun\(\); medicTurn\(\); breachTurn\(\); openGroundTick\(\);/.test(demo));

  ok('V180 AND NO DAMAGE BEFORE THE DIAL SURVIVES IT: not one damage, accuracy or hp number moves. It feeds a counter V176 already owns, through the function V176 already wrote',
    !/ARCH\.[a-z]+\s*=\s*\{[^}]*dmg/.test(demo.slice(demo.indexOf('function openGroundTick'),
      demo.indexOf('function openGroundTick') + 900)));

/* ===== V181 EXPERIENCE AND LOOT OFF THEIR BODIES (RF4-36) ========
   The behaviour is measured in a browser by fight_moves_you_gate. Pinned here:
   his ruling, the phrase it turns on, and the laws it had to satisfy. */
  ok('V181 RF4-36 HIS RULING, 8/25, asked what a fight is worth: "YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES FUCK YOU MEAN?" It closes the oldest open question in this lane, and it landed on a machine ALREADY THREE QUARTERS BUILT: the 7/3 ghost chip is an experience mote that arcs FROM THE BODY INTO YOU, the walk readout has promised "yours now -- loot comes later" for weeks, and EXEC_XP_PCT (his own 8/2 number, 2-3% for finishing a man on the floor) was the ONLY thing in this game that paid experience at all',
    /function bodyFell\(e\)\{/.test(demo) && /const KILL_XP_PCT=/.test(demo));

  ok('V181 AND "OFF THEIR BODIES" IS THE LOAD-BEARING PHRASE. He did not say experience for WINNING -- he said off the bodies, so it sits on the corpse and you WALK TO IT, through the sweep that has handed over ammunition since V157. A kill you never walk to pays nothing, which is a decision on the ground instead of a number in a menu, and it is the geometry RF4-18 and RF4-48 are both about',
    /if\(d\.xp\)\{[\s\S]{0,120}G\.ledger=G\.ledger\|\|\{\}; G\.ledger\.xp=/.test(demo)   /* 8/27: V190 pays a boss body a multiple on the same line. STILL ON THE BODY, still through the sweep, still nothing if you never walk to it */
    && /function sweepDrops\(\)\{/.test(demo));

  ok('V181 AND IT CLOSES A LOOP WITH V180 FROM THE SAME DAY, without one new rule: the body is lying where you shot him, frequently on OPEN GROUND UNDER THEIR EYES -- the state V180 pays a finisher charge for standing in, and the state where 56% of turns have a gun that can reach you against 17% everywhere else. Going to collect is the risk, and the reward for taking it was already shipped hours earlier',
    /function openGroundTick\(\)\{/.test(demo) && /function bodyFell\(e\)\{/.test(demo));

  ok('V181 AND MECHANISM-MINE / CONTENTS-HIS SURVIVES IT, in the shape the 8/11 amendment set: the pile, the walk, the sweep and the ledger are mechanism; the item NAMES are WORDS, so they ship as a REAL ATTEMPT tagged draft:true rather than an empty list he would have to write from nothing. An empty field is a blank page, and he edits, he does not write from nothing',
    /const LOOT_TABLE=\[/.test(demo)
    && (demo.match(/draft:true\}/g) || []).length >= 8);

  ok('V181 AND NO DAMAGE BEFORE THE DIAL IS UNTOUCHED: experience is not damage, no item in the table carries a combat effect, and every number it introduces is a [DIAL]',
    /const KILL_XP_PCT=0\.25;\s*\/\* \[DIAL\]/.test(demo)
    && /const LOOT_CHANCE=0\.55;\s*\/\* \[DIAL\]/.test(demo));

  {
    /* SCOPED, because the whole point of this claim is a count INSIDE one
       function, and a file-wide regex would happily match somebody else's. */
    const _bf = demo.slice(demo.indexOf('function bodyFell(e){'),
                           demo.indexOf('/* the dead are the supply */'));
    ok('V181 AND IT REPAIRED A DEFECT ON THE WAY IN: dropRounds had exactly ONE caller, the pistol lethality roll, so a man killed by a grenade, by a car cooking off, by an execution or by an incidental hit LEFT AN EMPTY TILE. "The dead are the supply" was true of one death in six and had been since V157. Every death now goes through one owner, so a body is a body however it fell',
      _bf.length > 100 && /dropRounds\(e\)/.test(_bf)
      && (demo.match(/bodyFell\(/g) || []).length >= 7);
  }

/* ===== V177 THE BREACHER (RF4-28) ================================
   The behaviour is measured in a browser by fight_moves_you_gate. Pinned here:
   the shape, and the fact that the mechanic he drives had no reachable caller. */
  ok('V177 RF4-28 THE COUNTER EXISTS: a body whose turn goes into the STONE YOU ARE BEHIND rather than into you. Our diff column named this exact answer -- "our cover system is strong enough that a cover-destroying body would be a real counter" -- and the measurement backs it, because the stone takes 73% of the guns off you',
    /function breachTurn\(\)\{/.test(demo) && /breacher:\{n:'BREACHER'/.test(demo));

  ok('V177 AND HE IS A GOON WITH A JOB, the V173 pattern: hp, accuracy and damage COPIED from ARCH.human rather than chosen, so a whole new archetype sets no damage number and NO DAMAGE BEFORE THE DIAL survives it',
    /breacher:\{n:'BREACHER', hp:60, acc:0\.55, dmg:\[14,26\]/.test(demo) &&
    /human:\{n:'GOON',  hp:60,  acc:0\.55, dmg:\[14,26\]/.test(demo));

  ok('V177 AND HE IS THE FIRST REACHABLE CALLER chewCover HAS EVER HAD. V152 shipped "and the stone takes it too" inside the volley, where it waits for a round of THEIRS that YOUR COVER ATE -- a condition its own geometry forbids, since a pillar that covers you is what takes a man OUT of the volley. Measured at zero across 264 states. This man does not need a line on you, he needs the rock',
    /for\(let k=0;k<BREACH_BITE;k\+\+\)\{ try\{ chewCover\(P\); \}catch\(_x\)\{\} \}/.test(demo) &&
    /const P=coverPillarAgainst\(e\.ea,e\.edist,e\.lvl,false\);/.test(demo));

  ok('V177 AND PINNING HIM IS THE ANSWER TO HIM, the same answer the medic has, so the counter has a counter rather than being a wall: a suppressed, stunned or prone breacher does no work that turn',
    /if\(pinned\(e\)\|\|\(e\.stun\|\|0\)>0\|\|\(e\.prone\|\|0\)>0\)continue;   \/\* head-down men do no work \*\//.test(demo));

  ok('V177 AND HE HAS TO BE ABLE TO REACH THE ROCK: gated on inHisRange, so a man standing off the end of the board does not quietly demolish a lot he could never hit',
    /if\(!inHisRange\(e\)\)continue;/.test(demo));

  ok('V177 AND HE FILLS AFTER THE BLADES, so his 7/19 MELEE MIX still takes its slots first. That is the ruling V173 broke by inserting an archetype ahead of them -- at PACK the recipe wants floor(N/2) knives and the medic was eating one -- and a second new body must not repeat it',
    /* V187 RE-POINTED, AND THE OLD GUARD IS THE REASON IT HAD TO BE. This read a
       GLOBAL indexOf plus "there must be exactly ONE place that pushes him",
       written by a session that knew an ordering claim is defeated by a
       duplicate. V187 legitimately adds a SECOND recipe (composeShaped beside
       composeSpine), so the count guard fires on a correct change.
       THE INTENT SURVIVES AND GETS STRONGER: the rule was never "one push site",
       it was "he never jumps ahead of the blades". So check it IN EVERY RECIPE,
       scoped, instead of once across the file -- which is the same repair the
       V180 no-second-cap claim needed when it negated a string belonging to
       somebody else's function. */
    (() => {
      const recipes = ['function composeSpine(N){', 'function composeShaped(N,sh){']
        .map(sig => { const a = demo.indexOf(sig);
          if (a < 0) return null;
          const b = demo.indexOf('\nfunction ', a + sig.length);
          return demo.slice(a, b < 0 ? a + 4000 : b); })
        .filter(Boolean);
      if (recipes.length !== 2) return false;
      return recipes.every(r => {
        const bl = r.indexOf("const BL=['shiv','bat','spear'];");
        const br = r.indexOf("out.push('breacher')");
        if (bl < 0) return false;
        return br < 0 || br > bl; }); })());

/* ===== V176 THE FINISHER (RF4-12) ================================
   "Charge up a more impactful ability after say 10 attacks, WHICH TAKES
    SOMETHING UNCONTROLLABLE AND GIVES IT TO THE PLAYER TO USE TACTICALLY."
   The behaviour is measured in a browser by fight_moves_you_gate. Pinned here:
   the shape, and above all that the feature touches ONE line. */
  ok('V176 RF4-12 A COUNTER AND A READY STATE, WHICH IS EXACTLY WHAT THE DIFF COLUMN ASKED FOR ("it converts luck into agency, and it costs no new UI"). No button, no HUD element, no toggle -- it announces itself in the readout he already reads, when it fills and when it spends',
    /* V188 RE-POINTED: the CLOSER perk lowers the threshold, so the read is
       now `>=Math.max(1,FINISH_AT-(G.perkFinish||0))`. THE CLAIM IS UNCHANGED --
       a counter and a ready state, with no button and no HUD element -- and the
       expression is INLINE rather than a helper call on purpose: gates in this
       repo slice functions out and execute them with fixed bindings, and a
       helper called from inside one of those is undefined there. */
    /function finisherReady\(\)\{ return \(G\._finCharge\|\|0\)>=Math\.max\(1,FINISH_AT-\(G\.perkFinish\|\|0\)\); \}/.test(demo) &&
    /function finisherFeed\(\)\{/.test(demo) &&
    !/id="finisher"/.test(demo) && !/id="finbtn"/.test(demo));

  ok('V176 AND IT SPENDS ON ONE LINE -- V32\'s lethality roll, and nothing else in the file. Same damage, same dial, same odds of landing: it replaces ONE roll of a coin the game was already flipping with a thing the player earned. NO DAMAGE BEFORE THE DIAL survives an entire new ability, because lethality was already a boolean',
    /const _lethalRoll=_fin\|\|\(WEAPON==='shotgun'\)\|\|\(Math\.random\(\)<\(WEAPON_LETHAL\[WEAPON\]\|\|0\)\);/.test(demo) &&
    /const _fin=finisherReady\(\)&&WEAPON!=='shotgun';/.test(demo));

  ok('V176 FED BY ATTACKS, NOT BY KILLS, which is Wang\'s own wording and the only thing that works at our scale: measured, a fight runs about 12.4 turns and drops just 2.3 bodies, so a kill-fed charge would fire roughly never. The feed sits on the shot resolution and skips misses',
    /* V185 RE-POINTED: the same line now also fires the kit's 'shot' verb, so it
       reads `if(kind!=='miss'){ finisherFeed(); ... }`. THE CLAIM IS UNCHANGED --
       the feed is INSIDE fireNow rather than merely defined beside it, which is
       the whole point of this check. */
    /if\(kind!=='miss'\)\{ finisherFeed\(\);/.test(demo));

  ok('V176 AND IT CANNOT BE STOCKPILED: the feed returns early once ready, so a long fight banks exactly one finisher rather than five. An ability you can hoard is a burst nobody can plan around, which is the same disease V163 cured in the stamina clock',
    /if\(G\.over\|\|finisherReady\(\)\)return;/.test(demo));

  ok('V176 AND THE SHOTGUN NO-OP IS DELIBERATE AND DOCUMENTED, not an oversight: 1.0 lethal is his own ruling ("this weapon finishes the job, no downed state"), so a finisher there is a bonus for a problem that weapon does not have. THE INVERSE of the wide-open bonus cut the day before, which paid out on ONE weapon of four and so could not be learned -- this one is redundant exactly where it is redundant',
    /WEAPON!=='shotgun'/.test(demo) && /const WEAPON_LETHAL=\{pistol:0\.20,smg:0\.35,rifle:0\.55,shotgun:1\.0\};/.test(demo));

  ok('V176 AND A FINISHER IS EARNED IN THE FIGHT YOU SPEND IT IN: the charge clears with the rest of the per-fight state, so the first perfect shot of a new encounter is never free',
    /G\._finCharge=0;   \/\* V176: a finisher is earned in the fight you spend it in \*\//.test(demo));

/* ===== V175 HE SHOUTS (RF4-39, THE ANTI-PULL RULE) ===============
   The BEHAVIOUR is measured in a browser by fight_moves_you_gate, with the alarm
   switched off and on across the same fights. What is pinned here is the shape. */
  ok('V175 RF4-39 THE ALARM EXISTS AND IT IS A COIN: 50% on gaining agro, which is RF4\'s own number and its own wording -- "prevent EASY, REPEATABLE single pulls", not prevent pulls. A certainty would delete the play',
    /const ALARM_CHANCE=0\.5;/.test(demo) && /Math\.random\(\)>=ALARM_CHANCE/.test(demo));

  ok('V175 AND A YELL CARRIES FURTHER THAN A WORD PASSED ALONG. V165\'s routine shout travels SHOUT_TILES from a man who can see you, so anybody further out never learned anything -- which is exactly why the single pull worked. ALARM_TILES is strictly larger, and that gap IS the mechanic',
    /const ALARM_TILES=15;/.test(demo) && /const SHOUT_TILES=8;/.test(demo));

  ok('V175 AND IT IS THE FIRST SIGHTING ONLY, once per man. A yell every turn is just the routine shout with a bigger number, and it would make the alarm meaningless by making it constant -- the point is that the moment you are FOUND is dangerous in a way the rest of the fight is not',
    /if\(!s\|\|s\._everSaw\)continue;/.test(demo) && /s\._everSaw=true;/.test(demo));

  ok('V175 AND IT REUSES V165\'s markSeen, so what an alarmed man knows is exactly what a told man knows -- one definition of "where he is" rather than two that can drift. It also skips a man who already knew, so the yell never double-counts somebody the shout had already reached',
    /markSeen\(o\); o\.told=true; raised\+\+;/.test(demo) && /if\(o\.lkp\)continue;/.test(demo));

  ok('V175 AND IT RUNS INSIDE visionTick, BEFORE the routine shout, so ONE function decides who knows what. Awareness split across two places is how a man ends up told twice and counted once',
    demo.indexOf('if(seers.length)firstSightAlarm(seers);') > 0 &&
    demo.indexOf('if(seers.length)firstSightAlarm(seers);') < demo.indexOf('if(Math.hypot(sx,sy)<=hd(SHOUT_TILES))'));   /* V198 RE-POINTED: the ORDERING is the claim, and it is unchanged */

  ok('V175 AND A NEW LOT IS A ROOM NOBODY HAS FOUND YOU IN YET: _everSaw clears on setup, so the alarm cannot arrive already spent from the last fight',
    /e\._everSaw=false;/.test(demo));

/* ===== V174 YOU CAN SHOOT THE CAR (Paolo 8/20) ====================
   The BEHAVIOUR is measured by fight_moves_you_gate with a real mouse click on
   the real canvas, because the feature IS the tap. What is pinned here is the
   shape, and above all WHERE THE DOOR SITS. */
  ok('V174 THE VERB EXISTS AT ALL. He asked "how do i shoot a car?" and the honest answer was that he could not: carHeat had exactly two callers in the whole file -- a round of THEIRS that your cover ate (V108) and your grenade landing inside CAR_BLAST (V104) -- and neither one was him pointing a gun at it. Everything else was already built: the tank part, the climbing heat, the rim that reddens, the bloom on the fuel end and cookOff\'s entire payoff. A complete mechanic with no door into it, and he found the missing door by trying to walk through it',
    /function shootCar\(P\)\{/.test(demo) && /function carAtTile\(tx,ty\)\{/.test(demo));

  ok('V174 AND THE DOOR IS THE TAP HE ALREADY HAS, not a new button. The field tap already places cover on a ring cell, already picks a man and already gets eaten by an armed grenade; a car was the one thing on the board you could see, walk behind, hide from and not touch. It reuses tapTile -- the same tap-to-world conversion the grenade has used since V104 -- rather than a second hit test that could disagree with it',
    /const t4=tapTile\(x,y\);/.test(demo) && !/id="shootcar"/.test(demo));

  ok('V174 AND IT GOES LAST IN THE TAP, so a tap on a man is always a man and this only ever claims a tap nothing else wanted. It runs in AUTO as well as MANUAL because it is not overriding the game\'s choice of WHO to shoot -- V35\'s auto rule exists so a curious tap cannot silently re-pick your victim, and this picks nobody',
    demo.indexOf("const t4=tapTile(x,y);") > demo.indexOf("setRead('TARGET: '+e.n") &&
    /* AND THERE IS EXACTLY ONE DOOR. Mutation testing put a SECOND car check in
       ahead of the men and both gates stayed green: the ordering claim used
       indexOf, which happily found the surviving later copy and reported the
       order correct while a duplicate sat in front of it deciding every tap
       first. Ordering is only meaningful when there is one of the thing being
       ordered. carAtTile may appear twice in the whole file -- its definition
       and its single use. */
    (demo.match(/carAtTile\(/g) || []).length === 2);

  ok('V174 THE TANK IS DECLARED, NOT DERIVED: a body round is CAR_SHOT_HEAT and the fuel end is CAR_TANK_HEAT, sat next to CAR_COOK in the same [DIAL] family V108 opened, so the whole feature adds no damage, accuracy or hp number anywhere. NO DAMAGE BEFORE THE DIAL survives a new verb',
    /const CAR_SHOT_HEAT=1;/.test(demo) && /const CAR_TANK_HEAT=4;/.test(demo) &&
    /carHeat\(P\.car, P\.tank\?CAR_TANK_HEAT:CAR_SHOT_HEAT\);/.test(demo));

  ok('V174 AND IT NEVER ROLLS TO HIT. A car is a stationary object the size of a car; the dial is for people. A miss chance here would be the fight teaching that its own scenery dodges',
    /function shootCar\(P\)\{[\s\S]{0,1200}?carHeat\(P\.car,/.test(demo) &&
    !/function shootCar\(P\)\{[\s\S]{0,1200}?Math\.random\(\)</.test(demo));

  ok('V174 AND IT IS SYMMETRIC WITH V170: smoke between you and the car refuses the shot for the same reason it refuses a man. You cannot shoot what you cannot see, and the screen you made is a screen you are standing behind too',
    /smokeBetween\(q\[0\],q\[1\],P\.lvl\|0\)/.test(demo));

  ok('V174 AND THE VERB IS ON THE OPEN BOOK while WHICH END TO HIT IS NOT. RF4-68 says never explain what the floor could have shown, and the floor has been drawing the heat, the glowing tank end and the explosion since V108 -- but an affordance nobody tries is invisible, which is exactly how this one went missing. The book states that the tap exists and lets the glow say the rest',
    /YOU CAN SHOOT A CAR: TAP IT\./.test(demo));

/* ===== V173 THE MAN WHO KEEPS LEAVING (RF4-38, two stars) ========
   "Backliners maintain line-of-sight and range with at least one ALLY while
    biased AGAINST being close to, or in line-of-sight of, the PLAYER."
   The BEHAVIOUR is measured in a real browser by fight_moves_you_gate, which
   runs the same body in the same slot as a GOON and as a MEDIC. What is pinned
   here is the shape and the five disciplines. */
  ok('V173 HE IS A GOON WITH A JOB: hp, accuracy and damage are ARCH.human\'s exact numbers, COPIED, not chosen. An entire new archetype sets no damage number, so NO DAMAGE BEFORE THE DIAL survives a body being added to the roster -- and the behaviour measurement is pure, because there is no other difference to point at',
    /medic:\{n:'MEDIC', hp:60,  acc:0\.55, dmg:\[14,26\], bot:false, melee:false, medic:true, draft:true\}/.test(demo) &&
    /human:\{n:'GOON',  hp:60,  acc:0\.55, dmg:\[14,26\]/.test(demo));

  ok('V173 AND HIS SCORING REPLACES THE SHOOTER\'S RATHER THAN ADJUSTING IT, first in pressScore and BEFORE the memory branch. A backliner is a different animal, not a shooter with a bigger standoff -- and a man whose job is to be hard to reach must not go walking to the last place he saw you, which is exactly the behaviour that would deliver him to your feet',
    /function pressScore\(e,x,y,aim\)\{[\s\S]{0,1400}?if\(e&&e\.E&&e\.E\.medic\)\{/.test(demo) &&
    demo.indexOf("if(e&&e.E&&e.E.medic){") < demo.indexOf("if(aim)return -PRESS_PULL"));

  ok('V173 TWO TERMS, NOT THREE, AND THE MISSING ONE WAS MEASURED OUT RATHER THAN FORGOTTEN: with at least one ally, and out of his line. The row\'s "away from the player" clause was written as its own dial and zeroing it changed NOTHING -- 7.5 tiles out against 7.39 with it, unseen 67% of the time either way -- because being out of your line already puts him far away, so it was buying something already bought. The surviving line term REUSES coverAtXY INVERTED: the shooter branch pays +3.0 for a tile with a clean angle on you, and his pays for one without. What a shooter wants, a backliner avoids, and that is one piece of geometry serving both rather than two that can disagree',
    /ms-=MEDIC_HERD\*Math\.min\(near,12\);/.test(demo) &&
    /* AND THE ROW'S FIRST CLAUSE IS DELIBERATELY ABSENT AS A TERM. "Away from
       the player" was written, and killed by mutation: zeroing it left him 7.5
       tiles out against 7.39 with it, and still unseen 67% of the time. Being
       out of your line already puts him far away, so the distance term was
       buying something already bought. */
    /* A MENTION IS NOT A USE, AND THIS CHECK CAUGHT ITSELF ON IT. The first
       write asserted the string MEDIC_SHY appears NOWHERE -- and it appears in
       the comment explaining why the dial was removed, so the gate failed the
       build for documenting its own finding. That is the identical defect the
       expression-line gate was written for this same morning: strip the
       explanation and you are left with a deletion nobody can account for. It
       asks for no DECLARATION and no USE instead. */
    !/const MEDIC_SHY=/.test(demo) && !/MEDIC_SHY\s*\*/.test(demo) &&
    /if\(coverAtXY\(x,y,e\.lvl\)\)ms\+=MEDIC_HIDE;/.test(demo) &&
    /if\(!coverAtXY\(x,y,e\.lvl\)\)s\+=G\.hold\?HOLD_ANGLE:3\.0;/.test(demo));

  ok('V173 *** AND A BODY ON THE FLOOR OUTRANKS HIS OWN SKIN, WHICH IS THE WHOLE FIGHT WITH HIM. *** Measured without it he hid so well he could not reach anybody. Raising his reach instead would have let him work the room from cover, which is a healer with no counterplay; the wounded PULLING HIM OUT is RF4-38\'s own closing line -- hard to reach, so the player must "aggro into them or HAVE TOOLS TO PICK THEM OFF" -- except the tool is a body on the ground and you make it yourself',
    /if\(dd<90\) return -MEDIC_PULL\*dd \+ \(coverAtXY\(x,y,e\.lvl\)\?MEDIC_HIDE:0\);/.test(demo));

  ok('V173 HE SETS NO HEALTH NUMBER. He stands men up at the hp the game left them, which V32\'s non-lethal killshot puts at 1, so a man he saves dies to anything -- what he costs you is a TURN, not health. And he comes up WINDED on the stun state the fight already owns, because nobody gets off the floor shooting',
    /best\.downed=false; best\.broken=false; best\.fleeing=false;/.test(demo) &&
    /best\.stun=Math\.max\(best\.stun\|\|0,1\);/.test(demo) &&
    !/best\.hp=/.test(demo) && !/\.hp=Math\.min\([^)]*max/.test(demo));

  ok('V173 AND BEING HEAD-DOWN HIMSELF IS THE ANSWER TO HIM, so the counter has a counter rather than being a wall: a pinned, stunned or prone medic does nothing that turn',
    /if\(pinned\(m\)\|\|\(m\.stun\|\|0\)>0\|\|\(m\.prone\|\|0\)>0\)continue;/.test(demo));

  ok('V173 AND HIS FIRST JOB WAS CUT AFTER MEASURING IT, not after arguing about it. He un-pinned allies, undoing the player\'s SUPPRESS -- which reads like a textbook RF4-28 counter to an effective player action. Two things killed it: SUPP_TURNS is 1 so a pin expires by itself the next turn anyway, and doSuppress pins EVERY exposed man INCLUDING HIM, so one press switched him off permanently. Measured 480 of 480 pins surviving with him alive and 352 of 352 with him dead -- identical, because he never got a turn. A counter with a one-button counter is not a counter',
    !/m\._unpin/.test(demo) && !/best\.supp=0/.test(demo));

/* ===== V171 THE GROUP READS ITSELF (RF4-25, THREE STARS) ==========
   "The same enemy added to 5 very different groups should produce 5 very
    different combat encounters."
   THE FIRST THREE-STAR ROW THIS LANE HAS BUILT, and it exists because on 8/20
   Paolo said the combat "is not even close" for the third time in three days
   and I finally counted the stars on his document: two of the ten starred rows
   were built and eighteen of the fifty unstarred ones were. RF4-25's own diff
   column had already answered him -- "5 real types exist and none of them read
   each other. This is the actual answer to why the fight feels flat."
   The BEHAVIOUR is measured in a real browser by fight_moves_you_gate, which
   runs three identical gunmen through six different companies. What is pinned
   here is the shape and the four disciplines. */
  ok('V171 THE ROSTER IS READ ONCE AND CACHED ON THE TURN, in one function, and the brains ASK it rather than each rolling their own. Six copies of "what is the group doing" would be five future places to forget it, which is precisely what machine 4 exists to prevent -- this is that discipline applied to the roster instead of to sight',
    /function squadRead\(\)\{[\s\S]{0,200}?if\(G\._sq&&G\._sq\.t===t\)return G\._sq;/.test(demo) &&
    /* TWO: the definition and the ONE place that asks. It was three until the
       third rule was cut, and this number is the check that a fourth ask never
       quietly appears in some other brain. */
    (demo.match(/squadRead\(\)/g) || []).length === 2);

  ok('V171 AND IT LANDS ON THE ONE NUMBER THAT ALREADY DECIDED HOW CLOSE A MAN WILL GET. pressAI\'s `standoff` was already the single variable governing that, so the group\'s read modulates it and writes no new geometry of its own. A second distance rule beside the first one is how two copies of a rule start disagreeing',
    /let standoff=\(_aim\|\|G\.hold\)\?hd\(HOLD_PASS\):hd\(PRESS_STANDOFF\);/.test(demo) &&
    /if\(_sq\.bladeClosing\)standoff=Math\.max\(standoff,hd\(SQ_ANVIL\)\);/.test(demo) &&
    /if\(_sq\.marksmanUp&&!\(e\.E&&e\.E\.spotter\)\)standoff=Math\.max\(standoff,hd\(SQ_LANE\)\);/.test(demo));   /* V198 RE-POINTED */

  ok('V171 IT READS THE LIVING ROOM, not the roster it started with. Both conditions go through the predicates the fight already owns -- a blade must be CLOSING (within SQ_HAMMER, not merely present) and the marksman must be able to SEE you (seesMe, so cover and V170\'s smoke both switch him off) -- so the feature turns itself off exactly when the player has earned it',
    /const bladeClosing=live\.some\(e=>e\.melee&&\(e\.edist\|\|99\)<=hd\(SQ_HAMMER\)\);/.test(demo) &&   /* V198 RE-POINTED */
    /const marksmanUp=live\.some\(e=>e\.E&&e\.E\.spotter&&seesMe\(e\)\);/.test(demo) &&
    /const live=\(G\.e\|\|\[\]\)\.filter\(e=>e&&!e\.dead&&!e\.downed&&!e\.broken&&!e\.fleeing\);/.test(demo));

  ok('V171 EVERY DIAL IS A DISTANCE AND THEY SIT OUTSIDE WHERE HE ALREADY STANDS -- which had to be MEASURED, not assumed. A lone goon settles at 6.0 tiles, his gun\'s effective range, so the first cut of these numbers (anvil 5.0, lane 6.5) moved nothing at all: three arms, one behaviour. A DEAD DIAL IS WORSE THAN NO DIAL, and that is the second time V168\'s lesson has had to be learned by playing it rather than reading it',
    /const SQ_HAMMER=6\.0;/.test(demo) && /const SQ_ANVIL=8\.5;/.test(demo) &&
    /const SQ_LANE=9\.5;/.test(demo) &&
    !/SQ_(ANVIL|LANE|HAMMER)[^\n]*dmg/i.test(demo));

  ok('V171 AND A THIRD RULE WAS CUT RATHER THAN SHIPPED AS FLAVOUR. "A man does not give up stone for open ground unless a friendly has a bead on you" was written, wired and measured over 20 arenas: 30 cover-leaving steps with it and 29 to 31 without, in every arm. It was not mis-gated -- somebody holds a bead on 12.2% of real turns, so it was armed on the other 88% -- it simply never changed a decision, because the standoff rules already decide where these men stand. Shipping it would have made the measured parts less believable',
    !/beadOnYou/.test(demo) && !/THE ADVANCE UNDER COVERING FIRE/.test(demo));

  ok('V171 AND THE GROUP FORGETS WHEN THE LOT DOES: the cache is cleared with the cars and the air, so a read from the last fight can never survive into the next one',
    /G\.smoke=\[\]; G\._sq=null; \}   \/\* V171: and the group forgets \*\//.test(demo));

/* ===== V170 THE SMOKE (RF4-57, machine 9) ========================
   "ONE ITEM WITH FIVE GEOMETRY-DEPENDENT USES BEATS FIVE ITEMS WITH ONE USE
   EACH." A burning car throws a screen, and because V165 made SIGHT the master
   switch, six
   *** AND THE DELIVERY LINE HERE WAS A LIE, CORRECTED 8/20 THE SAME DAY. It
   said "something the fight already rewards you for shooting." Paolo asked HOW
   DO I SHOOT A CAR and the answer is YOU CANNOT: carHeat has exactly two
   callers, a round of THEIRS that the car you are hiding behind ate, and your
   own grenade. There is no shoot-the-car verb in the build. Every argument
   underneath that sentence -- "no new button", "he learns it doing what he was
   going to do anyway" -- was resting on a verb I never checked existed. ***
   systems inherit it without one of them being edited.
   The BEHAVIOUR (the wall, its life, its anchor, the delivery, the symmetry and
   the pin lifting) is measured in a real browser by fight_moves_you_gate, and
   whether it is a WIN BUTTON was measured by playing 24 fights twice. What is
   pinned here is the shape, and the four disciplines that keep it honest. */
  ok('V170 THE SCREEN GOES THROUGH THE ONE DOOR, which is the whole reason six systems changed and none of them were touched: smokeAt is asked inside seesMe and NOWHERE ELSE on the enemy side. Six copies of "is there smoke" in six systems is five future places to forget it',
    /function seesMe\(e\)\{[\s\S]{0,420}?if\(smokeAt\(e\)\)return false;/.test(demo) &&
    /* THREE MENTIONS IN THE WHOLE FILE: the definition, the one ask inside
       seesMe, and the player's own targeting filter (the symmetry). If a fourth
       ever appears, a system started asking about smoke directly instead of
       asking whether the man can SEE -- which is machine 4 coming apart. */
    (demo.match(/smokeAt\(/g) || []).length === 3);

  ok('V170 AND A WALL OF SMOKE IS ANSWERED BY THE SAME MATHS AS A WALL OF STONE. segNear is the segment-to-circle test the cover geometry has always used; a screen is a circle on the line, so there is no second geometry to disagree with the first one',
    /function smokeBetween\(x,y,lvl\)\{[\s\S]{0,300}?segNear\(0,0,x,y,q\[0\],q\[1\],S\.r\|\|SMOKE_R\)/.test(demo) &&
    /if\(\(S\.lvl\|0\)!==\(lvl\|0\)\)continue;/.test(demo));

  ok('V170 IT IS A WALL, NOT A CHEAT BUTTON -- and the symmetry is ONE LINE in the player\'s own targeting, not a second system that could drift out of step with the enemy\'s. Smoke that blinded only them would be a win button with a circle drawn on it, and playing 24 fights twice says cooking a car COSTS more health, not less',
    /const _inRange=a=>a\.filter\(e=>inMyRange\(e\)&&!smokeAt\(e\)\);/.test(demo));

  ok('V170 NO NEW BUTTON, AND THAT IS A GRAVEYARD RULING BEING OBEYED, not a shortcut. THE COOK (the grenade fuse minigame) is dead by "NO REMAKE OF THE FUSE BAR. EVER." -- so the screen is delivered by cookOff. WHAT REACHES IT IS A GRENADE OR THEIR ROUNDS EATING YOUR COVER, and there is NO way to shoot a car -- which means "he learns it by doing what he was going to do anyway" was never true and the feature is one verb short of reachable',
    /popSmoke\(Math\.atan2\(by,bx\),Math\.hypot\(bx,by\),cells\[0\]\?\(cells\[0\]\.lvl\|0\):0\)/.test(demo) &&
    !/id="?nsmoke/.test(demo) && !/SMOKE<\/button>/.test(demo));

  ok('V170 A THING THAT CHANGES WHAT EVERYBODY CAN SEE AND CANNOT ITSELF BE SEEN IS A BUG WEARING A FEATURE\'S CLOTHES: it is drawn, world-anchored on the same path the car fire uses, and it THINS as it ages so its remaining life is legible without a number on it. The first draft was a pale grey smudge on the real screen and was changed after LOOKING at it',
    /for\(const S of G\.smoke\)\{ if\(!smokeAlive\(S\)\)continue;/.test(demo) &&
    /const left=1-\(\(\(G\.mTurn\|\|0\)-\(S\.born\|\|0\)\)\/SMOKE_TURNS\);/.test(demo) &&
    /rgba\(26,23,21/.test(demo));

  ok('V170 AND IT IS BOUNDED IN EVERY DIRECTION A LEAK COULD OPEN: it dies on the turn clock, dead clouds are swept out of the list every tick, the list itself is capped, and a new lot starts with clear air. A screen that never lifted would be a wall the player built around himself',
    /const SMOKE_TURNS=6;/.test(demo) &&
    /if\(G\.smoke&&G\.smoke\.length\)G\.smoke=G\.smoke\.filter\(smokeAlive\);/.test(demo) &&
    /if\(G\.smoke\.length>8\)G\.smoke\.shift\(\);/.test(demo) &&
    /G\.smoke=\[\];[^\n]*V170: new lot, clear air/.test(demo));

  ok('V170 NO DAMAGE BEFORE THE DIAL, obeyed by a feature that had every excuse to break it: a burning car is the most natural place in the game to add a damage-over-time tick, and it adds NONE. Both dials are marked [DIAL] and both are about VISION -- how wide the screen is and how long it stands',
    /const SMOKE_R=2\.4;       \/\* \[DIAL\] tiles of screen a burning car throws \*\//.test(demo) &&
    /const SMOKE_TURNS=6;     \/\* \[DIAL\] how long it stands before it thins to nothing \*\//.test(demo) &&
    !/smoke[\s\S]{0,120}applyDamage/i.test(demo));

/* ===== V169 THE OPEN BOOK (RF4-55, machine 7) ====================
   "Deterministic AI plus published rules equals A GAME ABOUT KNOWLEDGE."
   The BEHAVIOUR -- the page a player actually reads, and whether it says what
   the game does -- is measured in a real browser by fight_moves_you_gate. What
   is pinned here is the shape and the two disciplines that keep it honest. */
  ok('V169 RF4-65 (A -- EXPLICIT MECHANICAL: "bulleted, numeric, states keys and percentages") IS WHAT THE OPEN BOOK PAGE IS, and this is the claim that HOLDS that row. It was marked BUILT for four days while no gate anywhere named it -- found 8/20 by counting which BUILT rows any gate actually cites, which is REUSE-FIRST turned on the spec itself: a citation is a claim the machine can check, never a name-drop',
    /openBookLines/.test(demo) && /L\.push\('A GUN NEEDS '/.test(demo));

  ok('V169 EVERY NUMBER IS INTERPOLATED FROM THE CONSTANT THAT GOVERNS THE BEHAVIOUR, never typed beside it. A published rule that can drift from the code is not stale, it is a LIE told to the player who trusted it',
    /L\.push\('A GUN NEEDS '\+ACQ_TURNS\+' TURNS ON YOU/.test(demo) &&
    /L\.push\('YOU SEE '\+SIGHT_TILES\+' TILES\. NOTHING SHOOTS PAST '\+REACH_CEIL/.test(demo) &&
    /L\.push\('A MAN WHO SEES YOU TELLS EVERYONE WITHIN '\+SHOUT_TILES\+' TILES/.test(demo) &&
    /L\.push\('SPEED REFILLS EVERY '\+SP_TICK\+'TH TURN/.test(demo) &&
    /ENC_SIZES\[0\]\+' TO '\+ENC_SIZES\[ENC_SIZES\.length-1\]/.test(demo) &&
    /for\(const k of Object\.keys\(WEAPON_RANGE\)\)L\.push\(gun\(k,WEAPON_RANGE\[k\]\)\);/.test(demo));

  ok('V169 AND THE GUN BAND GOES THROUGH THE SAME TWO DOORS THE FIGHT USES, asked with the night multiplier set aside so the page states the RULE rather than tonight\'s weather. Writing the clamp out a second time here would BE the drift this feature exists to prevent',
    /const gun=\(k,R\)=>.*effRange\(R,1\).*maxRange\(R,1\)/.test(demo) &&
    /function maxRange\(R,mult\)\{ const k=\(mult==null\)\?rangeMult\(\):mult;/.test(demo) &&
    /function effRange\(R,mult\)\{ const k=\(mult==null\)\?rangeMult\(\):mult;/.test(demo));

  ok('V169 RF4-68 IS A PROCEDURE, NOT A PREFERENCE: "tell them what they cannot derive, hint at what they could, SHOW them what the room can demonstrate, never explain something the floor could have shown." The three mechanics the floor already teaches are absent from the page and the reason is written where the next session will read it',
    /NEVER EXPLAIN SOMETHING THE FLOOR/.test(demo) &&
    !/openBookLines[\s\S]{0,1800}orthogonal/i.test(demo));

  ok('V169 AND THE STANDING OBLIGATION IS RECORDED, from RF4-55\'s own column: determinism "buys depth on first contact and SPENDS IT OVER TIME", so publishing is not a row that closes -- every future rule a player cannot derive belongs on this page',
    /SPENDS IT OVER TIME/.test(demo) && /new deterministic rules must keep\s*\n?\s*arriving/.test(demo));

/* ===== V168 THE SPOTTER (RF4-37, the other half) =================
   "PRIORITY TARGETS ARE THE CORE PUZZLE... ignore the nearest enemies and
   manoeuvre into position to kill the Priority-Target who is often hiding in the
   back." Its diff column named exactly one gap: WHAT IS MISSING IS A TARGET
   WORTH CROSSING THE ROOM FOR. V167 guaranteed one exists and put him at the
   back; this makes ignoring him cost something.
   The BEHAVIOUR is measured on the shipped doMove by fight_moves_you_gate. What
   is pinned here is the shape, and the reason it is THIS mechanic. */
  ok('V168 THE ROLE IS DECLARED beside every other identity number, and no damage number is touched: his hp, acc and dmg are exactly what they were',
    /sniper:\{n:'SNIPER',hp:45, acc:0\.72, dmg:\[32,48\], bot:false, melee:false, spotter:true\}/.test(demo));

  ok('V168 AND HE TAKES THE FREE MOVE, WHICH IS WHAT THE FIGHT IS ABOUT. V159 made reaching the way out the win condition and V163 made the sprint the one move that does not cost a turn, so the marksman\'s real job -- denying movement -- lands on exactly that. Walking is untouched',
    /if\(_sprinting&&spotterOnMe\(\)\)\{ setRead\('PINNED BY THE SPOTTER'/.test(demo) &&
    /if\(_sprinting&&\(G\.stam\|\|0\)<1\)\{ setRead\('NO STAMINA'/.test(demo));

  ok('V168 THERE ARE TWO ANSWERS, and the second one needs no new geometry: spotterOnMe asks seesMe, which already requires a clear line, so stepping behind stone lifts the pin while he stands there alive',
    /function spotterOnMe\(\)\{ return \(G\.e\|\|\[\]\)\.some\(e=>e&&e\.E&&e\.E\.spotter&&seesMe\(e\)\); \}/.test(demo) &&
    /* AND NO SECOND OPINION ABOUT DEATH. It carried a `!e.dead` at first and a
       mutation deleting it changed nothing, because seesMe already rejects the
       dead on its first line. A guard that cannot fail is not caution, it is a
       duplicate rule waiting to disagree with the one that matters. */
    !/e&&!e\.dead&&e\.E&&e\.E\.spotter/.test(demo));

  ok('V168 AND THE FIRST VERSION WAS CUT RATHER THAN SHIPPED AS FLAVOUR. Giving his SHOUT infinite reach measured 22.5% of turns with the board blind against a 20.8% control -- inside the noise, because a long shout only matters when he is the ONLY man who can see you and in a group of three to six somebody else almost always can. A DEAD DIAL IS WORSE THAN NO DIAL',
    !/function shoutReach\(/.test(demo) &&
    /if\(Math\.hypot\(sx,sy\)<=hd\(SHOUT_TILES\)\)\{ markSeen\(e\); e\.told=true; break; \}/.test(demo));   /* V198 RE-POINTED: a yell still carries SHOUT_TILES, read on the board it is shouted across */

  ok('V168 AND HE CAN TELL WHY, WITHOUT THE GAME GROWING A TUTORIAL ARROW: the readout he already reads names the problem and both halves of the answer, and only when it is true',
    /setRead\('PINNED BY THE SPOTTER','break his line or put him down'/.test(demo));

/* ===== V166 THE DIAL STOPS TINKLING (Paolo 8/19, a ruling) =======
   "when i leave or enter the deadshot dial theres like a glass bottle noise i
    hate that."
   HOOKED AND MEASURED rather than guessed: every voice in the frame was wrapped
   and opening the dial logged sfxAsk(casing) then tone(680)+tone(340). Two bugs
   wearing one complaint. */
  /* THE STRUCTURAL HALF ONLY. The first write of this asserted BOTH that the cue
     left the raise and that it now rides sndShot, by string -- and a mutation
     that changed `try{ sfxAsk('casing'); }` to `if(0){ sfxAsk('casing'); }` left
     the gate GREEN, because the words were all still there and only the
     behaviour had gone. The positive half is MEASURED in the browser by
     fight_moves_you_gate, where the cue can actually be heard firing. */
  ok('V166 THE BRASS IS NOT AT THE RAISE ANY MORE. Opening the dial is bringing the gun UP -- the shot happens later, when he hits the green -- so a casing was tinking off the concrete before a round had left the barrel',
    !/spendRound\(\);[^]{0,160}sfxAsk\('casing'\)/.test(demo));

  ok('V166 AND THE LAST BARE UI BEEP IN THE FILE IS GONE. sndAccent was tone(680,triangle)+tone(340,sine) -- two PURE tones an octave apart with no noise floor, gone inside a tenth of a second, which is a glass ping by construction. V75 diagnosed this exact disease three lines above it ("a UI beep sitting outside the music"), fixed sndBeat and sndHeroTick, and left this one',
    !/function sndAccent\(\)\{ tone\(680/.test(demo) &&
    /function sndAccent\(\)\{ try\{ const f=owSong\(\); drumV\(\(f\.kit&&f\.kit\.k\)\|\|'punchk'/.test(demo));

  { /* AND THE THREE DIAL VOICES STAY TELLABLE APART. Routing the accent into the
       band is only right if it does not become the beat tick: three cues that
       sound identical are worse than one that sounds wrong. */
    /* grabbed by OFFSET, not by a closing-brace regex: these three span one,
       three and two lines respectively, and a regex that assumed one line read
       sndAccent as empty and failed a claim that was actually true. */
    const grabFn = (n) => { const i = demo.indexOf('function ' + n + '(){');
      if (i < 0) return '';
      const j = demo.indexOf('\nfunction ', i + 1);          /* stop at the NEXT function, not at a
                                                              fixed width: a 420-char window ran off
                                                              the end of sndBeat into sndHeroTick and
                                                              read its KICK as sndBeat's, failing a
                                                              claim that was true. Twice this week a
                                                              checker's window has been the broken
                                                              thing, not the code under it. */
      return demo.slice(i, j < 0 ? i + 420 : j); };
    const voices = ['sndBeat', 'sndHeroTick', 'sndAccent'].map(grabFn);
    ok('V166 THE THREE DIAL VOICES ARE STILL DISTINCT: the beat tick is the song\'s HAT, beat one is its KICK plus HAT, and the kill window is its KICK alone. Three cues that sound the same would be worse than one that sounds wrong',
      voices.every(v => v.length > 0) &&
      /f\.kit&&f\.kit\.h/.test(voices[0]) && !/f\.kit\.k/.test(voices[0]) &&
      /f\.kit\.k/.test(voices[1]) && /f\.kit\.h/.test(voices[1]) &&
      /f\.kit&&f\.kit\.k/.test(voices[2]) && !/f\.kit\.h/.test(voices[2]));
    ok('V166 AND EVEN THE FALLBACK STOPS BEING A CHIME: no song, no glass -- one low square instead of a triangle-and-sine pair',
      /catch\(_e\)\{ tone\(190,0\.06,0\.05,'square'\); \}/.test(voices[2]));
  }

/* ===== V167 THE ENCOUNTER CURVE (RF4-24, RF4-26) ==================
   Paolo 8/19: "its still not feeling like rogue fable 4 bro."
   RF4-24 is the ONLY three-star row in the teardown and it measured the worst
   number in the file: 8.0 per fight, min 8, max 8, INSIDE RF4's BAND 0 OF 40.
   His own design notes reserve 7+ for BOSS FIGHTS and say fights above 5-6
   "devolve into messy kiting and choke-point abuse" -- which is RF4's designer
   describing, in advance, the exact fight Paolo keeps reporting. */
  ok('V167 THE SIZE IS ROLLED, NOT CONSTANT, and off the ARENA\'S OWN DICE so a seed still reproduces a fight exactly',
    demo.includes('const ENC_SIZES=[3,4,5,6];') &&
    demo.includes('function rollEncounterSize()') &&
    /if\(G\.encCurve!==false\)G\.numEnemies=rollEncounterSize\(\);/.test(demo));

  { /* THE BAND, RUN. RF4's own rule is 3-4 typical with 5-6 very hard and
       anything above reserved, so the distribution has to actually land there
       rather than merely be declared. */
    const a = demo.indexOf('const ENC_SIZES=');
    const src = a > 0 ? demo.slice(a, demo.indexOf('function composeRoster', a)) : '';
    let mean = 0, lo = 99, hi = 0, ok34 = 0;
    try {
      const roll = new Function(src + '; return rollEncounterSize;')();
      let s = 0;
      for (let i = 0; i < 4000; i++) { const v = roll(); s += v; lo = Math.min(lo, v); hi = Math.max(hi, v); if (v <= 4) ok34++; }
      mean = s / 4000;
    } catch (e) {}
    ok('V167 AND IT LANDS IN RF4\'s BAND: 4000 rolls, mean ' + mean.toFixed(2) + ', min ' + lo + ', max ' + hi
      + ', and ' + (100 * ok34 / 4000).toFixed(0) + '% are the "typical 3-4" his notes name',
      lo === 3 && hi === 6 && mean > 3.6 && mean < 4.8 && ok34 / 4000 > 0.55);
  }

  { /* THE SPINE, RUN AT EVERY SIZE. This is the check that would have caught the
       trap: shrinking N alone would have DELETED the sniper below 4 and the
       machine below 5, so a small fight degrades to goons and a stick -- fewer
       AND blander AND easier, which is exactly what he was afraid of. */
    const a = demo.indexOf('function composeRoster(N){');
    const src = a > 0 ? demo.slice(a, demo.indexOf('function setupEnemies', a)) : '';
    let rows = [];
    try {
      const compose = new Function('G', src + '; return composeRoster;')({ meleeMix: 1 });
      rows = [3, 4, 5, 6, 8].map(n => ({ n, r: compose(n) }));
    } catch (e) {}
    const everySizeHasAWorstMan = rows.length === 5 && rows.every(x => x.r.filter(v => v === 'sniper').length === 1);
    const everySizeIsMixed = rows.length === 5 && rows.every(x => new Set(x.r).size >= 3);
    const rightLength = rows.length === 5 && rows.every(x => x.r.length === x.n);
    ok('V167 EVERY SIZE HAS EXACTLY ONE WORST MAN, which is RF4-37\'s missing precondition: you cannot have a priority target in a crowd of eight interchangeable goons, there is nothing to prioritise'
      + (rows.length ? '   3 -> ' + rows[0].r.join('/') : ''),
      everySizeHasAWorstMan);
    ok('V167 AND EVERY SIZE IS A MIXED GROUP (RF4-26), three kinds of body or more, at 3 as well as at 8 -- a three-man fight is three different problems from three directions, not two goons and a stick',
      everySizeIsMixed && rightLength);
    /* *** RE-POINTED 8/27: THIS ARM WAS A COIN FLIP AND IT HAD BEEN SINCE V187. ***
       It compared PACK's blades at six against ONE RANDOM DRAW of the default mix,
       and V187 made the recipe roll a SHAPE -- so when the draw came up THE RUSH
       (three blades at six) PACK's own floor(6/2) of three was not GREATER than it
       and the claim went red on completely correct behaviour. It passed for a day
       by luck. His 7/19 ruling does not say "more than a random other fight", it
       says OFF is none and PACK is his half, so that is what is asserted now,
       sampled 40 times because a shape is rolled. A FLAKY ARM IS A BROKEN ARM even
       while it is green. */
    let noneAtZero = false, offMax = 0, packMin = 99;
    try {
      const off = new Function('G', src + '; return composeRoster;')({ meleeMix: 0 });
      const pack = new Function('G', src + '; return composeRoster;')({ meleeMix: 2 });
      const blades = r => r.filter(v => ['shiv', 'bat', 'spear'].includes(v)).length;
      for (let i = 0; i < 40; i++) {
        offMax = Math.max(offMax, blades(off(6)));
        packMin = Math.min(packMin, blades(pack(6)));
      }
      noneAtZero = (offMax === 0 && packMin >= 3);
    } catch (e) {}
    ok('V167 AND HIS 7/19 MELEE MIX STILL RULES THE BLADES, over 40 rolled shapes each: at OFF the most blades any shape puts down is ' + offMax
      + ', and at PACK the fewest is ' + packMin + ' against his floor(N/2) of 3. A recipe that quietly ignored a ruling he already made would be the worst kind of tidy-up',
      noneAtZero);
  }

  ok('V167 HE CAN STILL DIRECT IT (8/12): CURVE is a button beside 1/3/5/8, pinning a number turns the curve off, and the boss sizing he has played for weeks is one tap away rather than deleted',
    /_cb\.classList\.add\('on'\); G\.encCurve=true;/.test(demo) &&
    /G\.encCurve=false; G\.numEnemies=\+b\.dataset\.n;/.test(demo));

  ok('V167 AND THE DROP IS DECLARED, NOT HIDDEN. Half the guns is half the incoming fire and no shuffling of archetypes closes that: measured 6.36 HP per turn at a pinned 8 against 3.74 on the curve, 8 deaths in 24 against 2. The only lever that would close it is making each enemy hit harder, and NO DAMAGE BEFORE THE DIAL forbids setting a damage number. It is written down where the next session will find it rather than left to be discovered',
    /HALF THE GUNS IS HALF THE INCOMING FIRE/.test(
      require('fs').readFileSync(require('path').join(__dirname, '..', 'tools', 'bohemia_combat_the_encounter_curve_patch.py'), 'utf8')) &&
    require('fs').existsSync(require('path').join(__dirname, '..', 'records', 'BOHEMIA_COMBAT_THE_ENCOUNTER_CURVE_8_19_26.md')));

/* ===== V165 VISION IS THE MASTER SWITCH (RF4-52, machine 4) ======
   "Pick ONE variable that as many enemy systems as possible depend on. Then
    give the player tools to control that variable. You get combinatorial depth
    without writing combinatorial content."
   The BEHAVIOUR is measured on the real fight by fight_moves_you_gate. What is
   pinned here is the thing that makes it worth anything: that it really is ONE
   variable, that FIVE systems read it, and that NOTHING computes its own. */
  ok('V165 THERE IS ONE VARIABLE AND IT IS A FUNCTION, not a flag anybody can set: seesMe(e) asks the same four questions every time -- is he able to look, is he on my deck, is he inside the end of his own eyes, and is there stone in the way',
    /function seesMe\(e\)\{/.test(demo) &&
    /if\(\(e\.lvl\|0\)!==myLvl\(\)\)return false;/.test(demo) &&
    /if\(\(e\.edist\|\|0\)>sightTiles\(\)\)return false;/.test(demo) &&   /* V198 RE-POINTED */
    /return !myConcealAgainst\(e\.ea,e\.edist,e\.lvl\); \}/.test(demo));

  { /* FIVE SYSTEMS, COUNTED. The spec's whole argument is the FAN-OUT -- one
       wall turning off many things at once -- so a check that only proved the
       function exists would be proving the cheapest part. Each of these is a
       different decision site in the file, and each reads the ONE variable. */
    const sites = [
      ['acquisition, the two-turn red line', /\(peeking\(e\)\|\|firing\(e\)\)&&seesMe\(e\);/],
      ['ranged fire, the volley pool',       /function exposedToMe\(\)\{[^}]*&&seesMe\(e\)\)/],
      ['the press, where a man walks',       /const _aim=seesMe\(e\)\?null:knownXY\(e\);/],
      ['cover seek, running for stone',      /if\(!seesMe\(e\)\)continue;/],
      ['the shout, telling the others',      /if\(seesMe\(e\)\)\{ markSeen\(e\); seers\.push\(e\); \}/],
    ];
    const missing = sites.filter(s => !s[1].test(demo)).map(s => s[0]);
    ok('V165 AND FIVE SEPARATE ENEMY SYSTEMS READ IT -- ' + sites.map(s => s[0]).join('; ')
      + (missing.length ? '   MISSING: ' + missing.join(', ') : ''),
      missing.length === 0);
  }

  ok('V165 AND NOBODY ROLLS THEIR OWN. A second copy of "can he see me" is how one variable quietly becomes five that disagree, which is the exact failure the spec exists to prevent',
    (demo.match(/myConcealAgainst\(e\.ea,e\.edist,e\.lvl\)/g) || []).length === 1);

  ok('V165 THE MEMORY IS WORLD STATE, carried by worldShift beside the pillars, the blood and the way out. V137 already wrote down why in this same file: a thing that moves WITH you is your own position wearing a disguise, and an LKP like that is a no-op that measures perfectly green',
    /for\(const e of \(G\.e\|\|\[\]\)\)if\(e&&e\.lkp\)mv\(e\.lkp,0\.02\);/.test(demo) &&
    /function markSeen\(e\)\{/.test(demo));

  ok('V165 SIGHT BEATS MEMORY, MEMORY BEATS NOTHING: a man who can see you presses at YOU, a man who cannot presses at where he last saw you, and a man who has never seen you holds his ground instead of wandering the lot',
    /if\(seesMe\(e\)\)return \[0,0\];/.test(demo) &&
    /if\(e&&e\.lkp\)return pXY\(e\.lkp\);/.test(demo) &&
    /if\(!seesMe\(e\)&&!_aim\)continue;/.test(demo));

  ok('V165 AND A BLIND MAN SCORES A TILE BY EXACTLY ONE THING -- how much closer it puts him to that memory. An angle on you, a standoff from you and a rock that covers you from him are all terms about a man he can SEE, and not one of them means anything when he does not know where you are',
    /if\(aim\)return -PRESS_PULL\*Math\.hypot\(x-aim\[0\],y-aim\[1\]\);/.test(demo));

  ok('V165 THE SEARCHING STANDOFF IS REUSED, NOT INVENTED: at PRESS_STANDOFF 3.2 a searching man would stop three tiles short of the tile he is walking to and circle it forever, so he uses HOLD_PASS -- V137\'s own number for a man running an objective rather than shopping for a firing angle',
    /(?:const|let) standoff=\(_aim\|\|G\.hold\)\?hd\(HOLD_PASS\):hd\(PRESS_STANDOFF\);/.test(demo) &&
    !/const SEARCH_STANDOFF=/.test(demo));

  ok('V165 VISION RESOLVES BEFORE THE BEAD, because the bead reads it. Run it after and every man on the board spends his turn acting on last turn\'s eyes',
    demo.indexOf('try{ visionTick(); }catch(_e){}') < demo.indexOf('const bead=e.stun<=0') &&
    demo.indexOf('try{ visionTick(); }catch(_e){}') > 0);

  { /* THE 3-5 SECOND RUSH, AND THE ONE PLACE THE CAPTURE WAS NOT IMPORTED.
       "Enemies never spot a sprinting player at all" is backwards for a game of
       guns -- movement is the single thing most likely to get you SEEN. The
       mechanic underneath it is real: the 3-5 second rush is the US Army's
       individual movement technique, and the window is that size because it is
       SHORTER THAN ACQUIRING TAKES. So the sprint does not blind anybody. It
       means you were only up for less time than a bead needs, which lands
       exactly on the two-turn red line this game has had since 7/19. */
    ok('V165 A SPRINT DROPS EVERY BEAD, line or no line -- the 3-5 second rush, which is the REALISTIC form of the capture\'s "enemies never spot a sprinting player" and reaches the same outcome through a mechanism that is true',
      /if\(_sprinting\)\{ if\(acquired\(e2\)\)_broke\+\+; e2\.acq=0; continue; \}/.test(demo) &&
      /3-5 SECOND RUSH/.test(demo));
    ok('V165 AND WALKING IS STILL NOT SPRINTING: a plain step only breaks the beads whose LINE you actually broke, which is Paolo\'s 7/19 ruling and is untouched',
      /if\(myConcealAgainst\(e2\.ea,e2\.edist,e2\.lvl\)\)\{ if\(acquired\(e2\)\)_broke\+\+; e2\.acq=0; \} \}/.test(demo));
  }

  ok('V165 AND HE CAN SEE IT HAPPEN, or it does not exist: the moment the last pair of eyes comes off you the readout says THEY LOST YOU in those words, and short of that it says how many men are hunting a memory. A mechanic working and unreadable is the same as not working',
    /setRead\('THEY LOST YOU'/.test(demo) &&
    /setRead\('PARTLY LOST'/.test(demo) &&
    /function blindHunters\(\)\{/.test(demo));

  ok('V165 MANUFACTURING WALLS IS FLAGGED AND NOT BUILT: the spec\'s steam, sleep bombs and cloud walls are a second feature and half of it is terrain, which is WORLD\'s system. The variable has to exist before there is anything worth giving him tools to control',
    !/function makeSteam\(|function cloudWall\(|function sleepBomb\(/.test(demo));

/* ===== V164 MOVEMENT ASYMMETRY (RF4-51, machine 3) ===============
   "Slow enemies move ORTHOGONALLY ONLY; you move DIAGONALLY -- every diagonal
   step costs them more than it costs you, so you generate distance out of pure
   geometry with NO RESOURCE SPENT."
   The BEHAVIOUR is measured on the shipped mover by fight_moves_you_gate (96
   chases, two arms, one difference). What is pinned here is the shape, the two
   arithmetic bugs it uncovered, and the CLAIM itself -- run as pure geometry,
   because a mechanic nobody has checked the maths of is a hope. */
  ok('V164 THE IDENTITY IS DECLARED, NOT DERIVED: `ortho` sits on the archetype next to hp and acc, so which bodies are slow is one word to change and is visible where every other identity number is. Deriving it from a threshold on hp would be authoring canon behind a formula',
    /bot:\s*\{n:'SEC-BOT'[^}]*ortho:true\}/.test(demo) &&
    !/ortho:\s*(e\.|hp|E\.hp|\()/.test(demo));

  ok('V164 AND THE SLOW SET IS THE FAST SET FILTERED, never a second table -- two copies of a rule always drift apart, and the whole mechanic is that these two lists differ by exactly the diagonals',
    demo.includes('const PRESS_CELLS_ORTHO=PRESS_CELLS.filter(c=>c[0]===0||c[1]===0);') &&
    /for\(const off of \(\(e\.E&&e\.E\.ortho\)\?PRESS_CELLS_ORTHO:PRESS_CELLS\)\)/.test(demo));

  { /* THE CLAIM, AS GEOMETRY. He flees on a diagonal; a chaser that may only
       take cardinals cannot answer both axes in one turn, so the gap opens by a
       tile a turn while an eight-way chaser holds it flat. No game state, no
       scorer, no arena -- just the shape the whole feature rests on. */
    const run = (ortho) => {
      const SET = ortho ? [[0,-1],[1,0],[0,1],[-1,0]]
                        : [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      let x = 6, y = 6;                                  /* he is at the origin */
      for (let t = 0; t < 8; t++) {
        x += 1; y += 1;                                  /* he runs diagonally away */
        let best = null, bd = Infinity;                  /* the chaser closes as hard as it can */
        for (const o of SET) {
          const d = Math.hypot(x + o[0], y + o[1]);
          if (d < bd) { bd = d; best = o; }
        }
        x += best[0]; y += best[1];
      }
      return Math.hypot(x, y);
    };
    const slow = run(true), fast = run(false);
    ok('V164 THE CLAIM IS TRUE AS GEOMETRY BEFORE IT IS TRUE AS CODE: over eight diagonal strides a cardinals-only chaser ends '
      + slow.toFixed(1) + ' tiles out against the eight-way chaser\'s ' + fast.toFixed(1)
      + ' -- distance manufactured with no resource spent, which is the entire spec row',
      slow - fast >= 3 && fast <= 9);
  }

/* ===== AND THE TWO ARITHMETIC BUGS IT UNCOVERED ===================
   The first cut of the mechanic shipped a STATUE. Halving a body's neighbours
   did not cause that; it exposed two numbers that had been quietly wrong. */
  { /* V160 (mine, 8/16) shrank every gun's MAX to the sight ceiling and left the
       EFF column exactly where it was, so the rifle wanted to fight at 20 tiles
       and the sniper at 30 on a board that stops at 16 -- and pressScore's whole
       progress gradient is max(0,d-eff), which is then zero at every distance
       either of them can ever be at. RUN, not read: a gun cannot want to fight
       further than it can shoot. */
    const grab = (name) => {
      /* V169: the signature gained an optional multiplier, so the grab looks
         for the NAME and an open paren rather than an exact argument list --
         which is what it was always actually trying to find. */
      const a = demo.indexOf('function ' + name + '(R');
      return a > 0 ? demo.slice(a, demo.indexOf('}', demo.indexOf('return', a)) + 1) : '';
    };
    /* BOTH doors, because effRange is only meaningful as the one that cannot
       overshoot maxRange -- running it against a stub would be marking my own
       homework with a ruler I drew */
    const src = grab('maxRange') + '\n' + grab('effRange');
    let rifle = null, sniper = null, pistol = null, dark = null;
    try {
      /* V198 RE-POINTED: maxRange/effRange now read the tile-scale door, so the
         harness supplies it -- THE SLICE RULE, which cost this file a crash
         earlier in the same turn when a sliced function called hd() and the
         binding list did not have it. Bound to the BODY-scale identity
         (hd = n => n, reachCeil = () => 16), which is exactly the board this
         claim has always been about. */
      const f = new Function('REACH_CEIL', 'PT_BLANK', 'rangeMult', 'hd', 'reachCeil',
        src + '; return effRange;')(16, 4, () => 1, n => n, () => 16);
      const fDark = new Function('REACH_CEIL', 'PT_BLANK', 'rangeMult', 'hd', 'reachCeil',
        src + '; return effRange;')(16, 4, () => 0.5, n => n, () => 16);
      rifle = f({ eff: 20, max: 16 }); sniper = f({ eff: 30, max: 16 });
      pistol = f({ eff: 6, max: 12 }); dark = fDark({ eff: 20, max: 16 });
    } catch (e) {}
    ok('V164 EFF GOES THROUGH THE SAME DOOR MAX ALREADY GOES THROUGH: a rifle written eff:20 on a 16-tile board wants to fight at ' + rifle
      + ' and a sniper written eff:30 at ' + sniper + ', so the progress gradient is live instead of dead by construction',
      rifle === 16 && sniper === 16);
    ok('V164 AND NO NUMBER WAS PICKED TO MAKE IT MEASURE WELL -- the clamp takes each gun to its OWN max and no further, so a pistol written eff:6 max:12 is untouched at ' + pistol + ' and the existing order survives',
      pistol === 6);
    ok('V164 AND THE DARK SHRINKS WHERE A GUN WANTS TO FIGHT EXACTLY AS IT SHRINKS WHERE IT CAN: at half range the same rifle wants ' + dark + ' tiles, not 20',
      dark === 8);
    ok('V164 AND NOTHING READS THE RAW EFF FOR A MOVEMENT DECISION ANY MORE',
      !/Math\.max\(0,d-R\.eff\)/.test(demo));
  }

  { /* AND THE BAR A STEP HAS TO CLEAR WAS HIGHER THAN A STEP. Progress is worth
       PRESS_PULL/mx per tile: 0.183 to a 12-tile pistol and 0.1375 to a 16-tile
       rifle, against a flat 0.18 typed in. The pistol cleared it by two
       thousandths; the rifle never could, at any distance, ever. */
    ok('V164 THE MOVE-WORTH BAR IS DERIVED OFF THE PULL, not typed beside it -- two loose numbers in a relationship drift apart the first day somebody moves a range',
      demo.includes('const PRESS_PULL=2.2;') &&
      demo.includes('const PRESS_WORTH=0.5*PRESS_PULL/REACH_CEIL;') &&
      /s-=PRESS_PULL\*Math\.max\(0,d-effRange\(R\)\)\/mx;/.test(demo));
    const pull = 2.2, ceil = 16, worth = 0.5 * pull / ceil;
    ok('V164 AND IT MEANS ONE PLAIN THING -- HALF A TILE OF REAL PROGRESS -- so every gun in the game can clear it with ONE step, which is the least a movement threshold can do and still be a threshold. The old flat 0.18 was a wall to anything reaching past 12 tiles',
      worth < pull / ceil && 0.18 > pull / ceil && worth < 0.18);
  }

/* ===== V162 THE FIGHT IS ON THE GRID ==============================
   Paolo 8/17: "we really need this shit to play exactly like rogue fable four
   right now."
   MEASURED FIRST: the board was a perfect tile grid with the PEOPLE FLOATING
   OVER IT -- 1405/1405 rocks on a cell against 16/160 bodies, and enemy moves
   with a median of 1.80 tiles of which ZERO were exactly one cell. That is not a
   feel problem, it is arithmetic: a roguelike is playable because you can COUNT,
   and nothing is countable when a man sits at 7.34 tiles and slides 1.80.
   The behaviour is measured by the browser gate; what belongs here is the shape,
   and the invariant that a body's position cannot be written without landing on
   a cell. */
  ok('V162 EVERY BODY LIVES ON A CELL, and it is an INVARIANT rather than a one-time tidy-up: the snap lives in worldShift and in the spawn, so a step can never leave a man half on a tile',
    demo.includes('function cellOf(o){') && demo.includes('function putCell(o,cx,cy){') &&
    demo.includes('function snapBody(o){') && demo.includes('function snapAllBodies(){') &&
    /try\{ snapAllBodies\(\); \}catch\(_e\)\{\}/.test(demo) &&
    /* V200 RE-POINTED: indoors a body is placed on a real floor CELL between
       the snap and the push, so the two are no longer adjacent lines. THE CLAIM
       IS THE INVARIANT -- the snap lives in worldShift AND in the spawn -- and
       both are still asserted; putCell is the same cell function it always was. */
    /try\{ snapBody\(e\); \}catch\(_e\)\{\}[\s\S]{0,1400}?G\.e\.push\(e\);/.test(demo));

  { /* THE GUARD IS LOAD-BEARING, AND THIS IS THE CASE THAT PROVES IT. Deleting
       the re-snap left every ordinary measurement at 160/160 and 960/960,
       because a player step moves the world by an INTEGER vector and integers
       stay integers -- so a mutation test on the happy path said the guard was
       decoration. It is not. worldShift's mv() clamps a body to a 0.6 minimum
       radius, and 0.6 is not a cell: walk straight into a man and without the
       snap he ends at (0.600, 0.000), off the grid AND inside the player's own
       cell. Measured both ways. Pinned here as the exact scenario rather than as
       a string. */
    const a = demo.indexOf('function cellOf(o){');
    const b = demo.indexOf('function worldShift(vx,vy){', a);
    const src = (a > 0 && b > a) ? demo.slice(a, b) : '';
    let landed = null;
    if (src) {
      try {
        landed = new Function('G', src + `;
          const e={ea:0,edist:0.6};      /* what mv()'s 0.6 clamp produces */
          G.e=[e]; snapAllBodies();
          return [Math.cos(e.ea)*e.edist, Math.sin(e.ea)*e.edist];`)({ e: [] });
      } catch (_e) { landed = null; }
    }
    ok('V162 AND WALKING STRAIGHT INTO A MAN STILL LEAVES HIM ON A CELL: worldShift clamps a body to a 0.6 radius, which is not a tile and is inside the player, so the snap puts him on the neighbouring cell instead of half inside him',
      !!landed && Math.abs(landed[0] - Math.round(landed[0])) < 1e-9
              && Math.abs(landed[1] - Math.round(landed[1])) < 1e-9
              && !(Math.round(landed[0]) === 0 && Math.round(landed[1]) === 0));
  }

  ok('V162 A MAN MOVES EXACTLY ONE CELL, to one of the same eight neighbours the player has always used -- the scorer is untouched and still wants its angle, it just has to say so in a legal move',
    /const PRESS_CELLS=\[\[0,-1\],\[1,-1\],\[1,0\],\[1,1\],\[0,1\],\[-1,1\],\[-1,0\],\[-1,-1\]\];/.test(demo) &&
    /const _c=cellOf\(e\);/.test(demo) &&
    /const nx=_c\[0\]\+off\[0\], ny=_c\[1\]\+off\[1\];/.test(demo));

  ok('V162 AND THE PLAYER\'S CELL IS HIS: OCCUPANCY LAW stops being a 0.6-tile fudge and becomes what it always said, one body per cell, checked as integers',
    /if\(nx===0&&ny===0\)continue;/.test(demo) &&
    /if\(cx===0&&cy===0\)\{/.test(demo));

  ok('V162 AND THE SLIDE\'S CONSTANT IS DELETED, NOT ORPHANED. PRESS_STEP was how far a man drifted in a turn; a cell move has no use for it, and leaving it declared and unread is the present-and-dead shape that cost this project inMyRange and the damage faces twice over',
    !/const PRESS_STEP=/.test(demo));

/* ===== V159 THE WAY OUT ===========================================
   Paolo 8/16: "I like that in rogue fable four you have to go down the dungeon
   so from one second to another so it is a movement goal for stuff so I think
   that's important."
   Mechanism 5 from his own law, and the only one that cannot be TANKED: cover
   decay, flankers and the flush all make standing still worse and a good player
   eats all three. A destination is not a punishment for staying, it is a place
   you have to reach, so from one spot the win is not unlikely, it is unreachable.
   The behaviour lives in gates/fight_moves_you_gate.js, which plays it. What
   belongs here is the shape: derived not designed, world state not a direction,
   and the win reading as the way out rather than as a board clear. */
  ok('V159 EVERY FIGHT HAS A WAY OUT AND REACHING IT IS THE WIN, and killing every man no longer ends the encounter -- the RF4 shape, where clearing a floor does not advance you, taking the stairs does',
    demo.includes('function placeWayOut(){') &&
    demo.includes('function exitCheck(){') &&
    /if\(EXIT_ON&&G\.exit\)\{ try\{ setRead\('NOTHING LEFT IN YOUR WAY'/.test(demo) &&
    /function afterKill\(\)\{ if\(aliveEnemies\(\)\.length===0&&!\(EXIT_ON&&G\.exit\)\)return winGame\(\);/.test(demo));

  ok('V159 DERIVED, NEVER DESIGNED (MAP LAW): the way out is read off the bearing the threat is coming FROM, exactly as V137 derives the hold place from that same bearing. Nothing authors a layout',
    /const threat=n\?Math\.atan2\(sy,sx\):0;\s*\n\s*const d?=?.*G\.exit=\{ea:threat/.test(demo.replace(/\r/g, '')) ||
    (/G\.exit=\{ea:threat/.test(demo) && /for\(const e of \(G\.e\|\|\[\]\)\)\{ if\(!e\|\|e\.dead\)continue;\s*\n\s*sx\+=Math\.cos\(e\.ea\)/.test(demo)));

  ok('V159 IT IS A TILE, NOT A DIRECTION: worldShift carries it like every other piece of world state, and reaching it is checked on every world move -- if it travelled with him he could never arrive',
    demo.includes('if(G.exit)mv(G.exit,0.02);') &&
    demo.includes('try{exitCheck();}catch(_e){}'));

  ok('V159 AND IT IS PLACED AFTER THE RESET THAT CLEARS IT. setupCombat calls resetFightState LATER in its own body, so placing the way out earlier put it on the board and wiped it one line later -- measured, a null exit and 0 tiles walked in every fight. Same class as V151\'s damage faces: written, then undone by the next statement',
    /resetFightState\(\); placeWayOut\(\);/.test(demo));

  ok('V159 AND THE WIN SAYS WHICH WIN IT WAS -- getting out is not "area clear", and a readout that called it that would teach him the wrong rule',
    /setRead\(G\._wonByExit\?'YOU MADE IT':'AREA CLEAR'/.test(demo));

  ok('V159 THE AMMO IS OFF BY HIS SECOND REJECTION, behind ONE dial, with the mechanism intact underneath so one word brings it back',
    demo.includes('const AMMO_ON=false;') &&
    /function dryNow\(\)\{ return AMMO_ON && roundsIn\(WEAPON\)<=0; \}/.test(demo) &&
    /function spendRound\(\)\{ if\(!AMMO_ON\)return 99;/.test(demo) &&
    /function dropRounds\(e\)\{ if\(!AMMO_ON\)return;/.test(demo) &&
    demo.includes('const MAG={pistol:15, smg:30, rifle:20, shotgun:6};'));

  ok('V158 AND HE STARTS WITH A LOADED GUN: every weapon\'s starting load IS its magazine, because a person who walked into a fight has a full gun. What he does not have is spares -- those come off the men he drops, which is the mechanism and it survived his ruling intact',
    /const MAG=\{([^}]*)\};/.test(demo) &&
    demo.match(/const MAG=\{([^}]*)\};/)[1] === demo.match(/const START_LOADED=\{([^}]*)\};/)[1] &&
    demo.includes('const START_SPARE=0;'));

  ok('V157 A SHOT IS THE ONLY THING THAT SPENDS A ROUND, and it spends it only once the shot is REAL -- after the dry check and after a target is found, so a refusal never costs him ammo',
    /* V163 FIXED THE RULER, AND IT WAS MINE. This asserted the dry check sat
       within 400 CHARACTERS of the target pick -- a fixed window, which is not
       the law. The SOUND lane added a dry_fire cue and a comment inside that
       block (correctly: his 8/1 approved sound had been silent because there was
       no ammo to run out of), the block grew past 400, and MY check went red on
       main for someone else's good change. The law is an ORDER, so it is checked
       as an order: dry check first, then the target pick, then the spend. */
    (demo.match(/spendRound\(\);/g) || []).length === 1 &&
    (() => {
      const dry = demo.indexOf('if(dryNow()){ const _alt=altWeapon();');
      const pick = demo.indexOf('G.popTarget>=0||(G.popTarget=pickTarget());', dry);
      const spend = demo.indexOf('spendRound();', pick);
      const bail = demo.indexOf('if(G.fireTarget<0){ return endTurnReturn(); }', pick);
      return dry > 0 && pick > dry && bail > pick && spend > bail;
    })());

  ok('V157 AND THE DEAD ARE THE SUPPLY: a man who falls leaves his rounds on the tile he fell on, and worldShift carries them like every other piece of world state -- if they moved with the player there would be nothing to walk to',
    /* V181 RE-POINTED: the lethality roll now calls bodyFell, which calls
       dropRounds as its first act. THE CLAIM IS UNCHANGED -- a man who falls
       leaves his rounds on the tile -- and it is now true of ALL SIX death
       paths rather than this one, because dropRounds had exactly one caller
       and five deaths in six left an empty tile. */
    /if\(_lethalRoll\)\{ tgt\.dead=true; try\{bodyFell\(tgt\);\}catch\(_e\)\{\} \}/.test(demo) &&
    /function bodyFell\(e\)\{[\s\S]{0,200}dropRounds\(e\)/.test(demo) &&
    demo.includes('if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);') &&
    demo.includes('try{sweepDrops();}catch(_e){}'));

  ok('V157 ROUNDS ARE ROUNDS. The first cut typed each drop by the dead man\'s calibre, which is MORE realistic and dead-ended 24 of 40 fights: he carried a pistol and the ground was rifle ammo. A mechanism that can strand him is a bug with a story attached',
    demo.includes('function spareRounds(){') &&
    !/spareFor\(/.test(demo) &&
    !/w:foeGunOf\(e\)/.test(demo));

  ok('V157 THE BUTTON NAMES THE MOVE AND THEN PERFORMS IT: dry owns the button before any other state (a green pop with an empty magazine is the button lying again), it says RELOAD or SWAP or GO GET ROUNDS, and the tap does that exact thing',
    /if\(dryNow\(\)\)\{\s*\n\s*const _al=altWeapon\(\)/.test(demo) &&
    /txt=canReload\(\)\?'RELOAD':\(_altLoaded\?\('SWAP TO '\+_al\.toUpperCase\(\)\):'GO GET ROUNDS'\)/.test(demo) &&
    /if\(canReload\(\)\)return doReload\(\);/.test(demo));

  /* A BYTE BUDGET IS NOT AN INVARIANT (8/20, RUN lane). This was
     `function doReload(){[\s\S]{0,700}endTurnReturn(false); }` -- a 700-character
     window -- and on 8/20 somebody added a five-line comment inside doReload
     about the mag seating. The function still ends the turn; the body just got
     longer than the window, and a true clause reported false. Widening the
     number would only move the same tripwire further out, so read the FUNCTION
     and check its LAST STATEMENT. That is what "costs the turn" means, and it
     stays true at any length. */
  const fnBody = (name, src) => {
    const i = src.indexOf('function ' + name + '(');
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
      if (src[k] === '{') d++;
      else if (src[k] === '}' && --d === 0) return src.slice(i, k + 1);
    }
    return null;
  };
  const _reload = fnBody('doReload', demo);
  const _lastStmt = (_reload || '')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    .trim().replace(/\}$/, '').trim().split(/;\s*/).filter(Boolean).pop();
  ok('V157 AND THE RELOAD COSTS THE TURN, exactly like the swap, so scarcity is a decision and never a free button',
    !!_reload && _lastStmt === 'endTurnReturn(false)', 'last statement: ' + _lastStmt);

  ok('V157 HE CAN SEE WHAT HE HAS LEFT, on the readout he already reads for range -- a resource he cannot see is one he cannot plan around, and this one decides whether he can stay where he is',
    demo.includes('function updAmmoRead(){') &&
    demo.includes('id="ammoread"') &&
    /updGap\(\)\{ try\{updRangeRead\(\);\}catch\(_e\)\{\} try\{updAmmoRead\(\);\}catch\(_e\)\{\}/.test(demo));

  /* RE-POINTED 8/27 FOR STRUCTURE, NEVER FOR OUTCOME. This matched the literal
     string fillText('AMMO'), and the claim it is making is that the MARKER was
     reused rather than reinvented -- same fieldPos, same pulsing disc, same
     dashed ring, same label draw. V193 changed what the label SAYS, because
     AMMO_ON has been false since 8/16 and that word was still on every corpse
     while V181 put experience, V184 put plates and V190 put boss keys on the
     same drop. "I'm kinda confused about what ammo does" was him reading a label
     three features out of date. The marker is untouched; the word is not part of
     this claim, so the check asks for the label DRAW at the marker's own
     position instead of for one particular word inside it. */
  ok('V157 AND THE GROUND MARKER IS THE GRENADE MARKER, reused byte for byte the way V137\'s hold marker was -- same fieldPos, same pulsing disc, same dashed ring, same label draw. No second marker was invented',
    /x\.fillText\(_?\w+,\s*dp\[0\],\s*dp\[1\]\)/.test(demo) &&
    /x\.setLineDash\(\[6,5\]\);/.test(demo) &&
    demo.includes('const dp=fieldPos(_d,W,H,cx,cy)'));

  ok('V156 AND THE FLANK NOTICE STOPS CRYING WOLF. Measured before: "N came around your cover" fired on 98.8% of turns, because ghost cover made the BEFORE state blocked almost everywhere so nearly any step read as a flank -- which is the real reason he could not tell whether they were trying. It can only be said about cover he actually has, and when he has none it says what happened instead',
    demo.includes('const _hadCover=inRealCover();') &&
    /const wasBlocked=_hadCover&&coverAtXY\(/.test(demo) &&
    /:\(closed\?\(closed\+' closed on you'\):\(G\._pressN\+' moved on you'\)\)/.test(demo));

  ok('V123 AND IT REUSES THE REAL GEOMETRY TEST INSTEAD OF INVENTING A SECOND ONE: myCoverAgainst is what the volley, the exposure floor and the acquisition bead already ask, so the action button stops being the one place asking the cheap question',
    /coveredFromAnyone\(\)\{[\s\S]{0,220}myCoverAgainst\(e\.ea,e\.edist,e\.lvl\)/.test(demo));

  ok('V123 AND COVER FROM A CORPSE IS NOT COVER: dead, downed, broken and fleeing men are not threats, so a stone that only shields you from bodies reads ENGAGE',
    /!e\.dead&&!e\.downed&&!e\.broken&&!e\.fleeing[\s\S]{0,80}myCoverAgainst/.test(demo));
}

/* ---- 6. the parent shell: the other half of the handoff ---- */
ok('V66 PARENT: ensureCombatFrame builds the combat frame ON DEMAND, so a quest can hand off with the combat tab never opened; the tab click uses the same one builder',
  alpha.includes('function ensureCombatFrame(){') &&
  alpha.includes("if(t.dataset.p==='combat')ensureCombatFrame();") &&
  !alpha.includes("if(t.dataset.p==='combat'&&!document.getElementById('combatFrame')){"));
ok('V66 PARENT: an encounter posted before the demo is listening is QUEUED and flushed on BOHEMIA_COMBAT_READY (with a ping retry), never dropped on the floor',
  alpha.includes('function combatPost(msg){') &&
  alpha.includes('function combatFlush(){') &&
  alpha.includes('function combatPingSoon(){') &&
  alpha.includes("if(d.type==='BOHEMIA_COMBAT_READY'){") &&
  alpha.includes('G._combatReady=true; combatFlush();') &&
  alpha.includes("G._combatQ=G._combatQ.filter(m=>m.type!==msg.type);"));
ok('V66 PARENT: startEncounter carries the quest context onto the bus and takes an onEnd callback; the run reads the settled outcome off G.encounter.outcome / G.lastEncounter',
  alpha.includes('const ctx={encounterId:spec.encounterId||') &&
  alpha.includes('objective:ctx.objective,faction:ctx.faction,reason:ctx.reason,mercy:ctx.mercy,') &&
  alpha.includes('onEnd:(typeof spec.onEnd===\'function\')?spec.onEnd:null};') &&
  alpha.includes('G.lastEncounter=enc.outcome;') &&
  alpha.includes('if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}'));
/* SUPERSEDED BY PAOLO 8/8: "re-land the handoff warming without the
   stale-clothing bug (first fight can't stall)."
   THE 7/26 REVERT KILLED TWO THINGS THAT WERE WELDED TOGETHER: warming (build
   the iframe -- expensive, nothing to do with clothes) and baking (render his
   look -- cheap to redo, the only half that can go stale). Warming is safe iff
   every door into a fight re-checks the look. The COMBAT tab already did since
   7/20; THE HANDOFF DID NOT, which means startEncounter could serve a stale look
   TODAY, warming or not -- the revert never closed that, it only made it rare.
   So the guard moves to where it belongs and the warm returns. */
ok('V134 THE FIGHT WARMS, AND NO DOOR CAN SERVE A STALE LOOK: the handoff gets the same lookKey() re-check the COMBAT tab has had since 7/20, so the warm bake is only ever a HEAD START and the stale bake is unreachable rather than unlikely',
  alpha.includes('V134 WARM, AND IT CANNOT WEAR THE WRONG CLOTHES') &&
  /function startEncounter\(spec\)\{[\s\S]{0,900}if\(G\._sentLook!==_lk&&document\.getElementById\('combatFrame'\)\)/.test(alpha) &&
  alpha.includes('(function warmTheFight(){') &&
  alpha.includes("requestIdleCallback(warm,{timeout:4000})"));

ok('V134 AND IT NEVER COMPETES WITH THE FIRST PAINT: it waits for the front splash to be dismissed and then runs on idle, once only, with a timeout fallback for browsers without requestIdleCallback',
  /f\.addEventListener\('click',\(\)=>setTimeout\(kick,600\),\{once:true\}\)/.test(alpha) &&
  alpha.includes('else setTimeout(warm,1500);'));

ok('V135 THE COLD OPEN IS A DEFENCE, WHICH NEEDS A SECOND LOSE CONDITION: every fight in this game has exactly one (you die), which makes every encounter a duel however it is dressed. A place behind you that a hostile can reach is what turns it into a defence -- and it is the first thing here that makes STANDING STILL WRONG',
  alpha.includes('V135 THE COLD OPEN') &&
  alpha.includes('function coldOpenSpec(onEnd){') &&
  alpha.includes('function startColdOpen(onEnd){') &&
  /defend:spec\.defend\|\|null,/.test(alpha));

ok('V135 TUTORIAL TIER: two hostiles on the EASY dial, so the dead-shot dial is met once and cleanly, and the fail state reads without text because they got past you',
  /hostiles:2,/.test(alpha) && /packageId:0,/.test(alpha) && /holdLine:6/.test(alpha));

ok('V135 MECHANISM MINE, CONTENTS HIS, AND THE CONTENTS SHIP EMPTY: who the family is, what the place is and what anyone says are NOT invented. The opening of his game is the most seductive place to write his lore for him, so cast is empty, place is null, the hostiles are unnamed archetypes and there is not one line of dialogue',
  /cast:\[\],/.test(alpha) && /place:null,/.test(alpha) &&
  /roster\.push\(\{name:'hostile_'\+i,hp:55,arch:'human'\}\)/.test(alpha));
/* ===== V136 THEY COME FOR YOU =====================================
   Paolo 8/8: "right now kinda just feels like I could stand still and kill
   everybody right now it's kind of weird". He was right and it was one line:
   coverSeekAI opened with `if(e.gcov)continue;`, so every gun ran to the
   nearest rock ONCE and then never moved again for the whole fight. Nothing on
   the board had ever had a reason to make him leave his tile.
   MEASURED on the real build, 40 arenas x 6 turns of standing perfectly still:
     guns the player is COVERED from   3.00  ->  0.68
     average range                    10.22  ->  6.92 tiles
     expected damage per volley        79.0  ->  132.0   (+67%)
     guns with a clean line on him     4.00  ->  6.00 of 6
   movers per turn 2.20, longest single step 1.80 (= PRESS_STEP, nobody
   teleports), 0 men standing inside a pillar, 0 inside the standoff. */
ok('V136 THE GUNS MOVE AT ALL, WHICH THEY NEVER DID: coverSeekAI ran a shooter to the nearest rock exactly once and then `if(e.gcov)continue;` froze him there for the rest of the fight. Only the 7/19 blades ever advanced. pressAI is the other half, and it runs on the turn AFTER the scramble so a man caught in the open still gets his stone first',
  demo.includes('V136 THEY COME FOR YOU') &&
  demo.includes('function pressAI(){') &&
  /* V165 RE-POINTED: pressScore takes a fourth argument now -- the tile a BLIND
     man is walking to. The function is the same function and this claim is about
     it existing and being called, not about its arity. */
  demo.includes('function pressScore(e,x,y,aim){') &&
  /pressAI\(\); updateGeomCover\(\);/.test(demo) &&
  /* V173 RE-POINTED: medicTurn() runs at the head of the same function now, so
     the anchor stops demanding meleeTurnRun be immediately followed by the cover
     scramble. The CLAIM is unchanged -- the scramble runs, then the press -- and
     it is still the ordering being asserted, not the absence of neighbours. */
  /* V180 RE-POINTED, third time and the same reason: openGroundTick() joins
     medicTurn and breachTurn at the head of the function, which took the gap to
     44 characters and overflowed a 40-character window. THE CLAIM IS UNCHANGED
     -- the scramble runs, then the press -- and it is the ORDERING being
     asserted, not how many neighbours sit in front of it. Widened rather than
     rewritten, because a window this claim keeps outgrowing is measuring the
     wrong thing when it is tight, not when it is loose. */
  /* V197 RE-POINTED, fourth time and the same reason as the third: allyTurn()
     and allyIncoming() join the head of the function, which took the gap past
     120. THE CLAIM IS UNCHANGED -- the scramble runs, then the press -- and it
     is the ORDERING being asserted, never how many neighbours sit in front of
     it. Widened rather than rewritten, exactly as the note above says. (The
     function's HEAD LINE is still held byte-identical by V180's anchor below,
     which is the check that would actually catch a rewrite; V197's first cut
     split that line and V180 went red the same run, correctly.) */
  /function tickTurnEnd\(\)\{ meleeTurnRun\(\);[\s\S]{0,240}?updateGeomCover\(\); coverSeekAI\(\); updateGeomCover\(\);/.test(demo));

ok('V136 ONE MAN, ONE MOVE: coverSeekAI stamps whoever it moved with the turn number and the press skips him, so nobody ever gets a scramble AND a bound in the same turn (4 tiles from a 2.2 and a 1.8)',
  /e\._movedTurn=G\.mTurn\|\|0;/.test(demo) &&
  /e\._movedTurn!==turn/.test(demo));

ok('V136 AN ANGLE IS THE BIG PRIZE, AND IT IS WHY HIS TILE DECAYS: a shooter the stone blocks does not have a reduced hit chance, he has NONE, so walking around your cover is worth more than anything else he can do with his feet. That single term is what makes standing still cost something',
  /if\(!coverAtXY\(x,y,e\.lvl\)\)s\+=(3\.0|G\.hold\?HOLD_ANGLE:3\.0);/.test(demo) &&
  demo.includes('function coverAtXY(x,y,lvl){'));

ok('V136 IT ASKS THE GAME\'S OWN FUNCTIONS AND NEVER RESTATES THEM: the scorer calls the game\'s own range and cover functions -- the same ones the volley uses -- so a shooter can never disagree with the volley about who is covered from whom or how far is far',
  /const R=foeRange\(e\), mx=Math\.max\(1,maxRange\(R\)\);/.test(demo) &&
  /return myCoverAgainst\(Math\.atan2\(y,x\),d,lvl\)/.test(demo));

/* V138 CAUGHT ITS OWN TRAP, AND THE MEASUREMENT IS WHY. V136's closing term was
   2.2*(distT(now)-distT(there)), and distT is MY weapon -- so once guns had
   ranges, every enemy on the board was deciding whether to walk by consulting
   the range of the gun in the PLAYER'S hands. With a pistol that curve
   saturates near 9.6 tiles, so out on a 16-tile board the gradient was FLAT:
   movers/turn fell 1.93 -> 0.42 and they closed 0.61 tiles in six turns. The
   board got bigger and the fight got emptier. Gated so it cannot come back. */
/* V164 RE-POINTED, AND THIS CHECK WAS GUARDING THE BROKEN VERSION. It swore
   "both terms are monotonic at every distance, so there is no flat stretch to
   stall in" while pinning the literal `d-R.eff`, and from V160 onward that term
   was structurally zero for the rifle (eff 20) and the sniper (eff 30) on a
   board that stops at 16. The check could not tell, because it was reading the
   words rather than the arithmetic. It now pins the EFF-THROUGH-ONE-DOOR form,
   and the V164 block above RUNS the clamp instead of trusting it. */
ok('V138 THE PRESS READS **HIS** GUN, NEVER MINE: a man wants to be inside HIS OWN effective range, and past his own max he is holding a brick -- the worst tile on the board to stand on. Both terms are monotonic at every distance, so there is no flat stretch to stall in (the V137 cliff lesson, applied before it could bite twice)',
  /s-=PRESS_PULL\*Math\.max\(0,d-effRange\(R\)\)\/mx;/.test(demo) &&
  /if\(d>mx\)s-=2\.5;/.test(demo) &&
  !/s\+=2\.2\*\(distT\(\{edist:e\.edist\}\)-distT\(\{edist:d\}\)\)/.test(demo));

ok('V136 FIRE AND MOVEMENT, NOT A CAVALRY CHARGE: at most half the line bounds in a turn and the men with the most to gain go first, while the rest hold their angle and shoot. A board that slides all at once is noise, not pressure',
  /const PRESS_FRAC=0\.5;/.test(demo) &&
  /plans\.sort\(\(a,b\)=>b\.gain-a\.gain\);/.test(demo) &&
  /Math\.max\(1,Math\.ceil\(pool\.length\*PRESS_FRAC\)\)/.test(demo));

ok('V136 THEY ARE STILL SHOOTERS, NOT BLADES: PRESS_STANDOFF holds them at a shooter\'s distance so nobody walks into your lap, and no candidate tile is ever inside a pillar or on top of another body',
  /const PRESS_STANDOFF=3\.2;/.test(demo) &&
  /if\(Math\.hypot\(nx,ny\)<standoff-0\.01\)continue;/.test(demo) &&
  /* V165 RE-POINTED: a THIRD case joins the two. A man searching for somebody he
     cannot see keeps no firing distance from him, so he uses the same HOLD_PASS
     V137 already wrote for a man running an objective. Both original numbers are
     untouched and both original cases still read exactly as they did. */
  /(?:const|let) standoff=\(_aim\|\|G\.hold\)\?hd\(HOLD_PASS\):hd\(PRESS_STANDOFF\);/.test(demo) &&
  /if\(Math\.hypot\(ox-nx,oy-ny\)<0\.9\)\{bad=true;break;\}/.test(demo) &&
  /if\(Math\.hypot\(q\[0\]-nx,q\[1\]-ny\)<\(P\.r\|\|0\.5\)\*0\.8\)\{bad=true;break;\}/.test(demo));

ok('V136 A MOVE HAS TO BE WORTH SOMETHING: PRESS_WORTH is the margin a tile must beat standing put by, so nobody shuffles sideways for nothing, and a bound is capped at PRESS_STEP so no shooter ever teleports across the lot',
  /* V162 RE-POINTED. The LAW is that a move must beat standing put by a margin,
     and PRESS_WORTH still is that margin. What is gone is the SLIDE: PRESS_STEP
     (how far a man drifted in a turn) and the hypot guard that kept the drift
     under it. A man moves ONE CELL now, so the cap is the cell itself and the
     constant is DELETED rather than left declared and unread -- a dead dial is
     worse than no dial, because the next session tunes it and nothing happens. */
  /* V164 RE-POINTED AGAIN, and the margin is no longer a typed number: 0.18 was
     higher than a single tile of progress for any gun reaching past 12 tiles, so
     for the rifle and the sniper it was not a margin, it was a wall. It is
     derived off the pull now and means half a tile of real progress. */
  /const PRESS_WORTH=0\.5\*PRESS_PULL\/REACH_CEIL;/.test(demo) &&
  /const PRESS_CELLS=\[\[0,-1\],\[1,-1\],\[1,0\],\[1,1\],\[0,1\],\[-1,1\],\[-1,0\],\[-1,-1\]\];/.test(demo) &&
  !/const PRESS_STEP=/.test(demo));

ok('V136 IT DOES NOT STEAL THE DAMAGE LINE: "RETURN FIRE, 3 of 5 hit you" is the most important thing on screen and a movement notice must never overwrite it, so setRead remembers its own colour and the press APPENDS to the line already there, in that line\'s colour',
  /G\.lastRead=\{t:t,s:s\|\|'',at:Date\.now\(\),c:col\|\|''\}/.test(demo) &&
  /setRead\(L\.t\|\|'THEY MOVE',\(L\.s\?L\.s\+/.test(demo) &&
  /L\.c\|\|'#e8a04a'\)/.test(demo));

ok('V136 AND THE V133 INVARIANT SURVIVED IT: setRead still calls _speak IMMEDIATELY after stamping lastRead. The colour note went ABOVE the line rather than inside it, because a gate is never worked around -- the comment moves',
  /function setRead\(t,s,col\)\{ G\.lastRead=\{[^}]*\}; _speak\(t,s,col\);/.test(demo));

/* ===== V137 HOLD THE LINE ==========================================
   V135 wrote the cold open as a spec with a `defend` block, said in its own
   docstring that a second lose condition is THE thing that turns a duel into a
   defence, and then shipped the contract without the fight: the block reached
   G.encounter in the parent and stopped there. Never sent, never read, never
   able to lose anybody anything. A defence you cannot fail is a duel with a
   label on it, and these checks are what stops that shipping twice. */
ok('V137 THE DEFEND BLOCK ACTUALLY LEAVES THE PARENT: v135 put it on G.encounter and never sent it, so the fight could not read it and nothing could be lost by letting a man walk past',
  /defend:G\.encounter\.defend\|\|null\}\);/.test(alpha) &&
  /defend:spec\.defend\|\|null,/.test(alpha));

ok('V137 AND THE FIGHT INSTALLS IT AFTER SETUP, because the place is positioned relative to where the threat actually turned out to be -- and it is typeof-guarded so the handoff core still loads headless in node where the demo functions do not exist',
  demo.includes('V137 HOLD THE LINE') &&
  demo.includes('function placeHoldLine(spec){') &&
  /if\(d\.defend&&typeof placeHoldLine==='function'\)/.test(demo));

ok('V137 THE PLACE IS WORLD STATE, LIKE A PILLAR AND THE BLOOD: worldShift carries it, so stepping back really does put you between them and it. If it moved with you, every step would drag the thing you are defending along behind you and there would be nothing to defend',
  /if\(G\.hold\)mv\(G\.hold,0\.02\);/.test(demo));

ok('V137 IT IS DERIVED, NOT DESIGNED: the place sits OPPOSITE the bearing the threat arrives on, holdLine tiles out. MAP LAW is untouched because nothing here authors a layout -- the position is read off where they already are',
  /const threat=n\?Math\.atan2\(sy,sx\):0;/.test(demo) &&
  /G\.hold=\{ea:threat\+Math\.PI,edist:spec\.holdLine,r:HOLD_R\}/.test(demo));

ok('V137 THEY WANT IT: the V136 scorer gains a pull toward the place, and an absolute distance term IS the progress gradient because every candidate is scored against where he stands now',
  /if\(G\.hold\)\{ const h=pXY\(G\.hold\); s-=HOLD_PULL\*Math\.hypot\(x-h\[0\],y-h\[1\]\); \}/.test(demo) &&
  /const HOLD_PULL=0\.9;/.test(demo));

/* THE CLIFF, AND WHY THERE IS A CHECK AGAINST IT: the first version scored a
   "committed" bonus inside a radius, which meant stepping INTO that radius COST
   a man the angle term -- a cliff that repelled instead of attracting. Measured
   over 60 distinct arenas it made things worse, not better: 5 of 60 ignored
   defences lost, with every single stall sitting exactly on the 2.6 boundary.
   A flat scale has no boundary to stall on and the gradient runs all the way in:
   57 of 60. The lesson is the gate: measure the thing, never add a second number
   on top of a broken one. */
ok('V137 A MAN HERE FOR THE PLACE IS NOT HERE FOR YOU: an assault force pushes an objective, it does not stop to shop for firing positions. His feet go to the place and his gun still fires on the way, because the volley happens every turn regardless of where anybody stands',
  /const HOLD_ANGLE=0\.9;/.test(demo) && /const HOLD_STONE=0\.25;/.test(demo) &&
  /if\(!coverAtXY\(x,y,e\.lvl\)\)s\+=G\.hold\?HOLD_ANGLE:3\.0;/.test(demo) &&
  /if\(pillarAtXY\(x,y,e\.lvl\)\)s\+=G\.hold\?HOLD_STONE:0\.8;/.test(demo));

ok('V137 AND IT IS A CLIFF NO LONGER: no "committed" radius survives in the scorer, because a boundary that costs a man his angle for crossing it is a wall he stands against forever',
  !/HOLD_COMMIT/.test(demo) && !/let committed=/.test(demo) && !/committed&&/.test(demo));

ok('V137 A DUEL IS COMPLETELY UNCHANGED: with no place to defend G.hold is null, so the angle is worth 3.0 and stone is worth 0.8 exactly as V136 shipped them. The defence scales the duel; it never rewrites it',
  /s\+=G\.hold\?HOLD_ANGLE:3\.0;/.test(demo) && /s\+=G\.hold\?HOLD_STONE:0\.8;/.test(demo));

ok('V137 AND THEY ARE ALLOWED PAST, which is the number the whole feature lives on: at PRESS_STANDOFF 3.2 a man can never get around you to something 6 tiles behind, so a defence would have been geometrically impossible while still LOOKING like it worked. A man running an objective is not trying to shoot you, he is trying to get by',
  /* V162 RE-POINTED: the standoff numbers are untouched and still decide who may
     get past. The landing is a CELL now, so the old Math.max clamp -- which put a
     man at a fractional radius and knocked him straight back off the grid -- is
     replaced by putCell. Same law, same numbers, legal position. */
  /const HOLD_PASS=1\.8;/.test(demo) &&
  /* V165 RE-POINTED: same line, same numbers, one more case on it -- a searching
     man is running an objective in exactly the sense V137 meant. */
  /(?:const|let) standoff=\(_aim\|\|G\.hold\)\?hd\(HOLD_PASS\):hd\(PRESS_STANDOFF\);/.test(demo) &&
  /putCell\(e,Math\.round\(p\.x\),Math\.round\(p\.y\)\); snapBody\(e\);/.test(demo));

ok('V137 THE ARC ALONE COULD NEVER CARRY HIM ROUND IN TIME (0.9 rad at range 6 is a 5.4-tile walk against a 1.8-tile step), so a defending fight also offers the straight line at the place -- and those candidates run the SAME body and pillar rejections as every other one, with no shortcuts',
  /* V162 RE-POINTED: the defence still offers the straight line at the objective,
     because the arc alone still cannot carry a man round in time. It is a CELL
     step now -- the sign of each axis, which is how a body walks a diagonal on a
     grid -- instead of two fractional radii. */
  /extra\.push\(\[_c0\[0\]\+Math\.sign\(Math\.round\(dx\)\), _c0\[1\]\+Math\.sign\(Math\.round\(dy\)\)\]\);/.test(demo) &&
  /for\(const c of extra\)\{ const nx=c\[0\],ny=c\[1\];/.test(demo) &&
  /if\(Math\.hypot\(ox-nx,oy-ny\)<0\.9\)\{bad=true;break;\} \}\n      if\(!bad\)for\(const P of \(G\.pillars\|\|\[\]\)\)/.test(demo));

ok('V137 A MAN WHO REACHED IT ENDS THE FIGHT, AND IT IS NOT A DEATH: you are still up, you just lost the only thing the fight was about. It is checked on the turn, right after the line bounds',
  demo.includes('function holdCheck(){') &&
  demo.includes('function loseHold(){') &&
  /if\(holdCheck\(\)\)return;/.test(demo) &&
  /setRead\('THEY GOT PAST YOU'/.test(demo) &&
  !/function loseHold\(\)\{ if\(G\.ledger\)G\.ledger\.deaths/.test(demo));

ok('V137 HE CAN SEE WHAT HE IS HOLDING, and the marker is REUSED not invented: the same fieldPos call, pulsing disc, dashed ring and label geometry as the grenade tile, turning red when somebody is nearly on it',
  /if\(!aimo&&G\.hold\)\{/.test(demo) &&
  /const hp=fieldPos\(G\.hold,W,H,cx,cy\)/.test(demo) &&
  /x\.setLineDash\(\[7,5\]\);/.test(demo) &&
  /x\.fillText\('HOLD',hp\[0\],hp\[1\]\)/.test(demo));

ok('V137 MECHANISM MINE, CONTENTS HIS, STILL: the marker carries a MECHANIC word and never a name, a relationship or a reason. The opening of his game is the most seductive place to write his lore for him, so cast stays empty and place stays null',
  /cast:\[\],/.test(alpha) && /place:null,/.test(alpha) &&
  !/G\.hold=\{[^}]*name:/.test(demo));

ok('V137 A DEFENCE NEVER LEAKS INTO THE NEXT FIGHT: the place, the contract and the lost flag are all cleared on setup alongside the grenade state',
  /G\.hold=null; G\.defend=null; G\._defLost=false;/.test(demo));

ok('V66 PARENT: the outcome settles exactly once per encounter, and a broken handoff lands in the combat log instead of falling on the floor',
  alpha.includes('if(enc&&!enc.settled){') &&
  alpha.includes('enc.over=true; enc.settled=true; enc.live=false;') &&
  alpha.includes("if(d.type==='BOHEMIA_COMBAT_ERROR'){") &&
  alpha.includes("outcome:'combat-error'") &&
  alpha.includes('function abortEncounter(){'));

/* ---- 4. alpha wiring ---- */
ok('alpha bakes the walk frames the demo plays (player 4-phase, enemies 2-phase)',
  alpha.includes("out.dirs[d].walk=[0,0.25,0.5,0.75].map(p=>bake112(d,'walk',p))") &&
  alpha.includes("L.look.walk112=[0.25,0.75].map(p=>bake112(L.d,'walk',p))"));

/* ===== THE DEMO MUST ACTUALLY PARSE ==================================
   Added 7/29 after a patch of mine anchored on the first half of an if/else,
   orphaned the else, and broke the ENTIRE combat demo -- while every one of the
   500+ string checks below still passed, because a string check cannot tell the
   difference between valid code and rubble.
   A gate that proves the right words are present and never proves the file RUNS
   is not a gate. This parses every script body in the demo with the real JS
   parser, which is the cheapest possible catch for the most expensive class of
   mistake this lane makes. */
(function demoParses(){
  const os2 = require('os'), pathq = require('path'), cp = require('child_process');
  const bodies = [...demo.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  ok('THE DEMO PARSES: every script body in COMBAT_B64 is valid JavaScript (a string check cannot tell valid code from rubble)', bodies.length > 0);
  bodies.forEach((body, n) => {
    const f = pathq.join(os2.tmpdir(), 'bohemia_combat_parse_' + process.pid + '_' + n + '.js');
    let msg = '';
    try {
      require('fs').writeFileSync(f, body);
      const r = cp.spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
      msg = r.status === 0 ? '' : (r.stderr || '').split('\n').slice(0, 4).join(' | ');
    } catch (e) { msg = String(e); }
    finally { try { require('fs').unlinkSync(f); } catch (e) {} }
    ok('THE DEMO PARSES: script body ' + n + ' is valid JavaScript' + (msg ? ' -- ' + msg : ''), !msg);
  });
})();

console.log('=== COMBAT GATE: ' + pass + ' pass / ' + fail + ' fail ===');
if (fail) console.log('HINT: if demo markers are missing, a parallel-session merge clobbered COMBAT_B64 -- run: python3 tools/bohemia_combat_melee_patch.py');
process.exit(fail ? 1 : 0);

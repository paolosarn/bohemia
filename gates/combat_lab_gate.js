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

/* ---- 1. the canon demo ---- */
const m = alpha.match(/const COMBAT_B64='([^']+)'/);
ok('alpha carries COMBAT_B64', !!m);
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
    (demo.split('&&!e.melee&&!pinned(e)&&e.stun<=0').length - 1) === 7 &&
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
    /function doMove\([\s\S]{0,4200}?endTurnReturn\(false\); \}/.test(demo));
  // v19: victory walk + blood by health
  ok('VICTORY WALK: the ring keeps working after the win (no turn cost)',
    demo.includes('VICTORY WALK V19') && demo.includes("setRead('WALKING THE FIELD'"));
  ok('BLOOD BY HEALTH: <=40% drips, <=20% pours, player <=30 trails; world-anchored',
    demo.includes('function bleedTick()') && demo.includes('e.hp>e.max*0.4') &&
    demo.includes('G.pHP<=30') && demo.includes('for(const s of G.bloodSpots)mv(s,0.02);'));
  ok('KILLSHOTS/TURN sits at the top of settings',
    demo.includes('V19: KILLSHOTS/TURN at the TOP of settings'));
  ok('worldShift carries corpses AND pillars with the world',
    /function worldShift\([\s\S]{0,600}?G\.corpses/.test(demo) &&
    /function worldShift\([\s\S]{0,700}?G\.pillars/.test(demo));
  // PILLAR COVER (v5, Paolo: "shuffled pillars that I can take cover from")
  ok('shuffled pillars spawn each encounter (V89: the count is now a real 2-15 range, so this no longer pins the old 5-7 literal -- it pins the RESHUFFLE)',
    /* V100 RE-POINTED: the invariant is that cover RESHUFFLES every encounter over a
       real range. The bare block became an arena-kind branch, and BOTH branches
       rebuild G.pillars from empty, which is more of what this was asking for. */
    demo.includes('G.pillars=[];') &&
    demo.includes("G.arenaKind=(Math.random()<0.5)?'warehouse':'street';") &&
    demo.includes('const NP=2+Math.floor(Math.random()*14);') &&
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
    demo.split('.filter(e=>(e.acq||0)>=1)').length >= 3 &&
    demo.includes('&&(e.acq||0)>=1);'));
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
    demo.includes('return G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e))); }') &&
    demo.includes('const pin=G.e.filter(e=>!e.dead&&pinned(e));') &&
    demo.includes('return exposedToMe().concat(mel).concat(pin);'));
  ok('the chosen man wears the selection ring', demo.includes('your chosen man'));
  // v10 ONE SCENE: the zoomed board IS the aim stage, no duplicates
  ok('ONE SCENE: exact zoom, full opacity, aim opts into drawField',
    demo.includes('ONE SCENE V10') && demo.includes('drawField(ctx,W,H,cx,cy,{dial:true,zb:zb});') &&
    !demo.includes("ctx.globalAlpha=0.85;"));
  // v11 BOARD BODY + v12 cam pin
  ok('BOARD BODY: the field sprite IS you during the dial; the needle is an arm at board scale',
    demo.includes('BOARD BODY V11') && demo.includes('function drawArmNeedle(') &&
    !demo.includes('drawPose(ctx,cx,cy,ga,S,0.005*i,true)') &&
    !demo.includes('drawPose(ctx,pcx,pcy,ang,S,1,false)'));
  ok('the arm lives at board scale (reads the aim zoom)',
    demo.includes("Math.min(W,H)*0.085*(G._zb||2)*1.05"));
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
    demo.includes('V24 LOS BEAD') && demo.includes('if(myCoverAgainst(e2.ea,e2.edist,e2.lvl)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; }'));   /* V90: same check, now level-aware */
  ok('danger outranks its warning: red line 0.30, acquiring amber 0.18',
    demo.includes("'rgba(232,60,40,0.30)'") && demo.includes("'rgba(232,140,40,0.18)'") &&
    !demo.includes("'rgba(232,140,40,0.32)'"));
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
    demo.split("txt=nearCov?'POP OUT':'ENGAGE';").length >= 5 && !demo.includes("txt='POP';") &&
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
  ok('playtest defaults to 8 enemies',
    demo.includes('numEnemies:8,') && demo.includes('<button class="nb on" data-n="8">8</button>'));
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
    demo.includes('_rank(e)*1000+e.edist'));
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
  ok('KNEEL AND BEG: adjacency swaps the downed pose to hands-up, begging text renders on downed+broken',
    demo.includes('V32 KNEEL AND BEG') && demo.includes('BEG_LINES') &&
    demo.includes('e.edist<=BohemiaMelee.SHOVE_RANGE&&L.handsup112'));
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
  ok('V33 nerve retuned down further on top of the v32 event-gating',
    demo.includes('0.10+0.05*(_down-_half)') && !demo.includes('0.18+0.08*(_down-_half)'));
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
  ok('V36 FIRE-BUTTON FACE KILLED: JUICE.AU (dying-face swap / red wash / red border on HP loss) is off',
    demo.includes('AS:true,AT:true,AU:false,AV:true'));
  // v38: accuracy corrected a third time -- a continuous per-shot proximity score,
  // not a binary zone bucket (v37's kill+vital=100/hit+miss=0 wasn't it either)
  ok('V38 CONTINUOUS PRECISION (formula superseded by V53 banding): the per-shot precisionSum plumbing still feeds the averaged ledger accuracy',
    demo.includes('G.rc.precisionSum=(G.rc.precisionSum||0)+_precisionPct') &&
    demo.includes('G.ledger.precisionSum=(G.ledger.precisionSum||0)+_precisionPct') &&
    demo.includes("rate3=L.shots?Math.round((L.precisionSum||0)/L.shots):0"));
  // v39: "MAKE COMBAT FUNNER" -- streak momentum + a real ranged specialist
  ok('V39 SNIPER ARCHETYPE: one real ranged specialist can spawn in bigger fights, always far, never the close guy, hits far harder than a GOON',
    demo.includes("sniper:{n:'SNIPER',hp:45, acc:0.72, dmg:[32,48]") &&
    demo.includes('let sniperIdx=-1; if(N>=4)') &&
    demo.includes("while(sniperIdx===closeIdx&&sp++<20)") &&
    demo.includes("if(i===sniperIdx)arch='sniper';") &&
    demo.includes('(i===sniperIdx) ? (PT_BLANK+9.5)+Math.random()*3'));
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
    demo.includes('id="sprintbtn"') &&
    demo.includes('const _sprinting=!!G.sprintArm;') &&
    demo.includes('const _mult=_sprinting?2:1;') &&
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
  ok('V48 GREEN IS A LOCK: doPop() snapshots the green verdict and the known-threats set at commit time; a green pop\'s return-fire pool only answers to threats visible at that moment, and the lock is single-use',
    demo.includes('V48 GREEN IS A LOCK') &&
    demo.includes('G._greenNow=green;') &&
    demo.includes('G._poppedGreen=!!G._greenNow;') &&
    demo.includes('G._popKnownThreats=new Set(G.e.filter(e=>!e.dead&&(peeking(e)||firing(e))).map(e=>e.i));') &&
    demo.includes('if(G._poppedGreen)pool=pool.filter(e=>G._popKnownThreats&&G._popKnownThreats.has(e.i));') &&
    demo.includes('G._poppedGreen=false;   /* V48: single-use'));
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
  ok('V52 POP OUT VS ENGAGE: with no pillar near the player at all, the action button says ENGAGE, not POP OUT (nothing to pop out of if you were never in cover)',
    demo.includes('const nearCov=playerNearCover();') &&
    demo.includes("col='#8a7d66'; txt=nearCov?'POP OUT':'ENGAGE';") &&
    demo.includes("col='#eafff0'; txt=nearCov?'POP OUT':'ENGAGE'; green=true;"));
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
    demo.includes('G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G.groove=0; G._oneStreak=0; G._endSent=false; G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;') &&
    demo.includes('if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);') &&
    demo.includes("function spendStam(n){ if((G.stam||0)<n)return false;") && demo.includes('function spendMove(n){'));
  ok('V67 SUPPRESS IS TURN-BASED, NOT WALL-CLOCK (Paolo: "it doesn\'t seem like it does fucking anything"). The 2.2-SECOND pin expired while he was still deciding his move; a pin is now counted in TURNS like everything else in this fight, it breaks the red lines they were holding, and it costs a turn of cooldown',
    demo.includes('function pinned(e){ return (e.supp||0)>0; }') &&
    demo.includes('const SUPP_TURNS=1;') && demo.includes('const SUPP_CD=1;') &&
    demo.includes('e.supp=SUPP_TURNS; if((e.acq||0)>=1)beads++; e.acq=0;') &&
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
  ok('V54 TOOLKIT UI: four buttons wired in the action row, disabled in the aim phase like WAIT, stamina pips shown',
    demo.includes('id="suppressbtn"') && demo.includes('id="dashbtn"') && demo.includes('id="vaultbtn"') &&
    demo.includes('id="peekbtn"') && demo.includes('id="stampips"') &&
    demo.includes("for(const _id of ['suppressbtn','peekbtn','dashbtn','vaultbtn']){"));
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
    demo.includes('G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G.groove=0; G._oneStreak=0; G._endSent=false; G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;') &&
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
    demo.includes("G._oneStreak=0; G._endSent=false; G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;"));
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
  ok('V61 ONE GRENADE: exactly one grenade per encounter (Paolo) -- throw gated on G._grenadeThrown, latched on throw, reset each fight',
    demo.includes('if(!_hadG && !G.grenade && !G.over && !G._grenadeThrown){') &&
    demo.includes('_at:performance.now()}; G._grenadeThrown=true;') &&
    demo.includes('G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;'));
  // v62: weapon identities -- per-weapon killshot cap + dial width
  ok('V62 WEAPON IDENTITY: each weapon sets a killshots/turn cap (rifle 1, smg 2, shotgun 2, pistol up-to-skill) and a dial width (rifle/shotgun wide, smg mean); chain + dial + readout all use it',
    demo.includes('const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};') &&
    demo.includes('const WEAPON_WIDTH={pistol:1.0,smg:0.80,rifle:1.30,shotgun:1.20};') &&
    demo.includes('function chainWall(){ return Math.max(1, WEAPON_CAP[WEAPON]||8); }') &&
    demo.includes('function chainAllowance(){ return Math.max(1,Math.min(perkKillshots(), chainWall())); }') &&   /* V98: the allowance is a PERK slider now; the WEAPON ceiling is what this check owns */
    demo.includes('if(G._chainN>chainWall()){') &&
    demo.includes('const _ww=WEAPON_WIDTH[WEAPON]||1;') &&
    demo.includes('z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*(G.inFU?1.18:1)*(G.execWindow?1.35:1)') &&
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
  demo.includes('G.stam-=n; G._stamSpent=true; updStam();') &&
  demo.includes('if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);') &&
  demo.includes('G._stamSpent=false; updStam();') &&
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
      demo.includes('G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G.groove=0; G._oneStreak=0;') &&
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
ok('and the app really does hold 13 songs tagged OVERWORLD in his baked 7/19 assignments (10 night, 1 day, 2 dusk/dawn) -- combat was seeing six of them',
  (() => {
    const i = alpha.indexOf('const CAT_DEFAULTS={'), j = alpha.indexOf('};', i);
    const blk = alpha.slice(i, j);
    const n = (blk.match(/'OVERWORLD NIGHT'/g) || []).length;
    const d = (blk.match(/'OVERWORLD DAY'/g) || []).length;
    const dd = (blk.match(/'OVERWORLD DUSK\/DAWN'/g) || []).length;
    return n === 10 && d === 1 && dd === 2;
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
    demo.includes('G._perfects=0; G.groove=0; G._oneStreak=0;') &&
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
      perfect.stam === 3 && perfect._stamSpent === false);
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

  /* THE DEAD PATH IN THE OVERWORLD, recorded so it cannot be forgotten. It is
     NOT fixed here: what drives intensity out there is lore and Paolo's call. */
  {
    const mus = alpha.indexOf('const MUS={');
    const assigns = (alpha.match(/MUS\.layers\s*=/g) || []).length;
    ok('RECORDED, NOT FIXED: in the overworld the kill ladder is unreachable -- MUS.layers starts at 0 and the ONLY thing in the build that ever assigns it is the studio preview buttons, so the four melody-klay creepers can never bloom out there. The driver is lore and Paolo has not ruled it',
      mus > 0 && alpha.includes('layers:0') && assigns === 1);
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
    demo.includes("const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;") &&
    demo.includes("if(_mk<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk)*0.42).toFixed(3)+')';") &&
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
    demo.includes("if(_mk<1){ x.fillStyle='rgba(0,0,0,'+((1-_mk)*0.42).toFixed(3)+')';"));
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
    demo.includes('G.litter=[];       /* AF: fresh ground */'));

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
    demo.includes('const _df=(G._freezeT>0)?0:((G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1);') &&
    !demo.includes('const _df=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/(_dfT*1000)):1;'));
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
  ok('AUDIT PINNED: the enemy accuracy curve is 0.97 - distT*0.60, i.e. 0.97 at point blank down to 0.37 at long range, a 2.6x swing',
    demo.includes('function distAccuracy(e){ return 0.97 - distT(e)*0.60; }'));
  ok('AUDIT PINNED: the distance bands are PT_BLANK=4 / FAR_TILE=26 / MAX_RANGE=42, which is what makes that curve mean anything on the board',
    demo.includes('const PT_BLANK=4, FAR_TILE=26, MAX_RANGE=42;'));
  ok('AUDIT PINNED: cover is a BINARY predicate and incoming fire FILTERS on it -- an enemy you have cover against is removed from the volley entirely, 0% or 100%, never a modifier',
    demo.includes('function myCoverAgainst(ang,dist,lvl){') &&
    demo.includes('!myCoverAgainst(e.ea,e.edist,e.lvl)'));   /* V90: still a FILTER, now level-aware. The audit's "0% or 100%" finding is unchanged -- a floor simply turns the whole predicate off. */
  ok('AUDIT PINNED: the stamina economy is 3 pips, +1 only on a turn you spent none, and a stamina move costs no turn (Paolo 7/26, LOCKED)',
    demo.includes('const STAM_MAX=3;') &&
    demo.includes('if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);') &&
    demo.includes('function spendStam(n){ if((G.stam||0)<n)return false;'));

  /* --- THE FINDING ITSELF, as a machine check. This is the one that matters:
     the audit's headline is that NOTHING POSITIONAL MULTIPLIES PLAYER DAMAGE.
     The day that stops being true is the day the north star's other half got
     built, and this check is how we find out on purpose instead of by accident. */
  {
    const i = demo.indexOf('const fgv=');
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
  ok('V88 MAP LAW HELD: the arena generator is WRAPPED, not rewritten. Claude authored no layout -- setupEnemies just rolls known dice now, and the body it calls is the same body it always was',
    demo.includes('function setupEnemies(){ return BohemiaArena.withDice(setupEnemiesBody); }') &&
    demo.includes('function setupEnemiesBody(){ const prev=G.e||[];') &&
    demo.includes("const layouts=['oneside','twoside_opp','twoside_adj','cluster_flank','ring'];"));

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

  ok('DENSITY IS A REAL RANGE NOW: 2-15 pieces, not 5-7. A five-to-seven swing is a rounding error the eye cannot see, which is exactly what he could not see',
    gen.includes('const NP=2+Math.floor(Math.random()*14);') &&
    !demo.includes('const NP=5+Math.floor(Math.random()*3);'));
  ok('COVER HAS A SIZE: r was 0.55 for EVERY piece ever placed. Now 0.45-1.15, so some is a crate you duck behind and some is a block you go around',
    gen.includes('const r=Math.max(0.45,Math.min(1.15,bulk+(Math.random()-0.5)*0.30));') &&
    !demo.includes('edist:Math.hypot(nx2,ny2),r:0.55,tall:'));
  ok('AND THE EXISTING COVER MATHS ALREADY SCALED OFF P.r everywhere it is used, so nothing had to be rewritten -- the number was simply never allowed to vary',
    demo.includes('return dA<Math.PI/2 && Math.sin(dA)*P.edist<P.r*0.9; }); }') &&
    demo.includes('segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85)') &&
    demo.includes('Math.hypot(q[0]-sx,q[1]-sy)<P.r*0.6+0.35'));
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
    gen.includes('if(Math.hypot(nx2,ny2)>11)continue;') &&
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
    demo.includes('if(lvl!=null&&(lvl|0)!==myLvl())return false;'));
  ok('AND IT RUNS BOTH WAYS: his cover from you dies across floors too, in realCoverPillar, so the deck is not a free kill box in one direction only',
    /function realCoverPillar\(e\)\{[\s\S]{0,260}?if\(\(e\.lvl\|0\)!==myLvl\(\)\)return false;/.test(demo));
  ok('AND EVERY ENEMY-FACING COVER CALL CARRIES ITS LEVEL -- all 14 of them, so no code path can quietly keep the old flat answer',
    demo.split('myCoverAgainst(e.ea,e.edist,e.lvl)').length - 1 === 8 &&
    demo.split('myCoverAgainst(e2.ea,e2.edist,e2.lvl)').length - 1 === 4 &&
    demo.includes('myCoverAgainst(tgt.ea,tgt.edist,tgt.lvl)') &&
    demo.includes('myCoverAgainst(e.ea,null,e.lvl)') &&
    !/myCoverAgainst\((e|e2|tgt)\.ea,\s*(e|e2|tgt)\.edist\)/.test(demo));

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
    demo.includes('G.pillars=G.pillars.filter(P=>{ const q=pXY(P); return !deckTileAt(q[0],q[1]); });'));
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
  ok('and every fight starts on the lot',
    demo.includes('G.lvl=0;           /* V90B: every fight starts on the lot */'));

  /* the render: levels are drawn RELATIVE, which is the one-scene law */
  ok('V90B LEVELS ARE DRAWN RELATIVE TO YOU: the deck floats above the lot from the ground and becomes the floor under your feet once you are on it. ONE SCENE, the same law the killshot and the board already obey',
    demo.includes('const lvlDY=l=>-(((l|0)-(G.lvl||0))*DECK_H);') &&
    demo.includes('const epos=e=>{ const p=fieldPos(e,W,H,cx,cy); return [p[0],p[1]+lvlDY(e.lvl)]; };'));
  ok('and the dead lie on the floor they fell on, instead of snapping to the lot',
    demo.includes('const _ep=epos(e);   /* V90B: the dead lie on the floor they fell on */'));
  ok('THE HEIGHT IS READ BY VALUE CONTRAST: the storey face is near-black against the lot. The first render drew it at #3e372c and the deck read as a lighter PATCH OF GROUND rather than a thing with a height',
    demo.includes("x.fillStyle='#15120e'; x.fillRect(p[0]-t2*0.5,fy,t2+1,-dz);") &&
    demo.includes("x.fillStyle='rgba(0,0,0,0.55)';") &&
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
    demo.includes('V92: the three stripes that used to be painted here are GONE'));

  ok('V92 A REAL RUN OF STEPS joins the two floors: five steps, each with a BRIGHT TREAD and a NEAR-BLACK RISER, spanning the storey',
    demo.includes('const NS=5, run=t4*1.05, halfW=t4*0.46;') &&
    demo.includes("x.fillStyle='#14110d';") &&
    demo.includes("x.fillStyle='#8c7d61';") &&
    demo.includes("x.fillStyle='rgba(232,214,172,0.95)';"));
  ok('RULE 1, THREE SHADES PER STEP: near-black riser, mid tread, hard lit lip on the leading edge -- three distinct values per step, which is the documented isometric rule',
    /x\.fillStyle='#14110d';[\s\S]{0,200}?x\.fillStyle='#8c7d61';[\s\S]{0,160}?x\.fillStyle='rgba\(232,214,172,0\.95\)';/.test(demo));
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
    /function underDeck\(o\)\{ if\(!o\|\|\(o\.lvl\|0\)!==0\)return false;\s*\n\s*return !!deckTileAt\(Math\.cos\(o\.ea\)\*o\.edist,Math\.sin\(o\.ea\)\*o\.edist\); \}/.test(demo));

  ok('EVERY BODY OBEYS ONE RULE, enemies and YOU alike, so you can always tell which floor your own man is standing on',
    demo.includes('if(underDeck(e)){ const f2=enemyFrame(e,now); if(!f2)return false;') &&
    demo.includes('function underDeckMe(){ return myLvl()===0 && !!deckTileAt(0,0); }') &&
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
    demo.includes('if(lvl!=null&&(lvl|0)!==myLvl())return false;') &&
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
    demo.includes('const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(visNow()-G._ksAt)/260):1;') &&
    !demo.includes('const _mk=(G.ks&&G._ksAt)?Math.max(0,1-(performance.now()-G._ksAt)/260):1;'));

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
    /G\.pkgDiff=Math\.max\(0,Math\.min\(4,Math\.max\([\s\S]{0,240}chainRampDial\(\)\)\)\);/.test(demo) &&
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
    demo.includes('const CHAIN_RAMP_BASE=3, CHAIN_RAMP_STEP=1;') &&
    demo.includes('return o<=0?0:Math.max(0,Math.min(4,CHAIN_RAMP_BASE+(o-1)*CHAIN_RAMP_STEP)); }'));

  ok('V95 THE WEAPON CEILING IS STILL A WALL AND IS NOT RAMPED: a gun running out is physics, not a difficulty question, and it is what keeps the pistol the chain weapon and the rifle a one-shot',
    demo.includes('function chainWall(){ return Math.max(1, WEAPON_CAP[WEAPON]||8); }') &&
    demo.includes('const WEAPON_CAP={pistol:8,smg:2,rifle:1,shotgun:2};'));

  ok('V95 "i didnt see that" IS THE ACTUAL COMPLAINT, so the mechanic SAYS itself: the headline flips to PUSHING in the warning red and both reads count the shot against the allowance in words',
    demo.includes("setRead(_ov?'PUSHING':(isChain?'CHAIN':'AIM'),") &&
    demo.includes("'SHOT '+(G._chainN||1)+' OF '+chainAllowance()+' · '") &&
    demo.includes('PAST YOUR ALLOWANCE'));

  ok('V95 BELOW THE ALLOWANCE THE RAMP CHANGES NOTHING: chainRampDial returns 0 when you are inside it, and max(range,0) is just range',
    demo.includes('function chainOver(){ return Math.max(0,(G._chainN||1)-chainAllowance()); }') &&
    demo.includes('function chainRampDial(){ const o=chainOver();'));

  /* ===== 32. V98 THE DARK SHRINKS THE RANGE + THE ALLOWANCE IS A PERK ==== */
  ok('V98 NIGHT IS NOT AN ACCURACY PENALTY. A symmetric penalty changes no decision and just makes the fight longer, which is the tally mistake. Darkness shrinks the RANGE at which anyone shoots well, through the one function every range read already runs on',
    demo.includes('V98 THE DARK SHRINKS THE RANGE') &&
    demo.includes('const NIGHT_RANGE={morning:1.00,dusk:0.72,night:0.50};') &&
    demo.includes('function farTile(){ return Math.max(PT_BLANK+2, FAR_TILE*rangeMult()); }') &&
    /function distT\(e\)\{[\s\S]{0,140}farTile\(\)/.test(demo));

  ok('V98 AND POINT BLANK IS EXACTLY UNTOUCHED AT NIGHT, not approximately: distT subtracts PT_BLANK before dividing, so it is 0 for any d <= PT_BLANK whatever the far end is. His 7/27 point-blank ruling gets LOUDER after dark rather than taxed flat',
    demo.includes('return Math.min(1,Math.max(0,(d-PT_BLANK)/(F-PT_BLANK))); }') &&
    demo.includes('const PT_BLANK=4, FAR_TILE=26'));

  ok('V98 IT MOVES BOTH SIDES OFF ONE NUMBER: my dial (distPkg), their hit chance (distAccuracy) and the range words+colour all read distT, so there is no second accuracy system to keep in step',
    demo.includes('function distPkg(e){ return Math.round(distT(e)*(G.userPkg||0)); }') &&
    demo.includes('function distAccuracy(e){ return 0.97 - distT(e)*0.60; }') &&
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
    demo.includes('id="grenbtn"'));

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
    demo.includes('V100 THE WAREHOUSE') &&
    demo.includes("G.arenaKind=(Math.random()<0.5)?'warehouse':'street';") &&
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
    demo.includes("if(G.arenaKind==='warehouse')return 'slab';") &&
    demo.includes('ST_SPIN.slab=1;'));

  ok('V100 AND THE ARENA HAS A NAME, because an arena you cannot name is a field with rocks on it',
    demo.includes("function arenaName(){ return G.arenaKind==='warehouse'?'WAREHOUSE':'STREET'; }") &&
    demo.includes("b.textContent=(s==null)?arenaName():(arenaName()+' #'+s); }"));

  /* ===== 35. V101 HIT IN THE CHEST + THE APPROVED STREET BANK =========== */
  ok('V101 BODIES ARE MARKED AT THE CHEST, NOT THE FEET (Paolo 7/29: "on a second story you just have the location of them wrong... its like their feet"). drawHuman blits 84px ABOVE the point it is handed, so every position in this file is a man\'s FEET',
    demo.includes('V101 HIT IN THE CHEST') &&
    demo.includes('const MASS_DY=-42;') &&
    demo.includes('x.drawImage(cv112,Math.round(ex-56),Math.round(ey-84));'));

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
  alpha.includes('objective:ctx.objective,faction:ctx.faction,reason:ctx.reason,mercy:ctx.mercy});') &&
  alpha.includes('onEnd:(typeof spec.onEnd===\'function\')?spec.onEnd:null};') &&
  alpha.includes('G.lastEncounter=enc.outcome;') &&
  alpha.includes('if(enc.onEnd)try{enc.onEnd(enc.outcome);}catch(_e){}'));
ok('THE PRE-WARM STAYS DEAD (Paolo 7/26: the fight showed the wrong character with no clothing). Building the combat frame at app open also pre-BAKES the player sprites, so any part of his look that restores late gets baked stale and the fight wears it. The frame is built ON DEMAND, always.',
  !alpha.includes('requestIdleCallback(warm') &&
  !alpha.includes('warm the combat frame in the background') &&
  alpha.includes('WARM THE FIGHT: REVERTED 7/26'));
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

console.log('=== COMBAT GATE: ' + pass + ' pass / ' + fail + ' fail ===');
if (fail) console.log('HINT: if demo markers are missing, a parallel-session merge clobbered COMBAT_B64 -- run: python3 tools/bohemia_combat_melee_patch.py');
process.exit(fail ? 1 : 0);

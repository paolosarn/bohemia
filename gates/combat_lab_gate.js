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
    demo.includes('!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&!myCoverAgainst') &&
    demo.includes('!e.dead&&!e.melee&&e.stun<=0&&(peeking(e)||firing(e))&&hasLine'));
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
  ok('a move costs the turn (routes through endTurnReturn)',
    /function doMove\([\s\S]{0,2400}?endTurnReturn\(false\); \}/.test(demo));
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
  ok('shuffled pillars spawn each encounter', demo.includes('G.pillars=[]; { const NP=5+'));
  ok('my cover is geometry-aware (pillar on the shooter line, distance-honest)',
    demo.includes('function myCoverAgainst(ang,dist)') &&
    demo.includes('myCoverAgainst(e.ea,e.edist)'));
  ok('enemies take pillar cover too — REAL cover only (V26: fake flag dead, stone must be near HIM)',
    demo.includes('function updateGeomCover()') &&
    demo.includes('e.gcov=(pillarBetweenMe(e)&&nearPillar(e))?1:0;') &&
    !demo.includes('(e.inCover||e.gcov)') && !demo.includes('e.inCover=!e.inCover'));
  ok('pillars block the step (occupancy: solid is solid)',
    demo.includes("setRead('BLOCKED','a pillar is there'"));
  ok('shove into a pillar slams (65% topple)', demo.includes('PILLAR SLAM'));
  // v6 (Paolo): push = ONE tile, LONG ARM perk = two; street tile board floor
  ok('PAOLO RULING: shove pushes back ONE tile', BM.shove({ stun: 0, stunCooldown: 0 }, false, 99).pushed === 1);
  ok('LONG ARM perk pushes two', BM.shove({ stun: 0, stunCooldown: 0 }, { longarm: true }, 99).pushed === 2);
  ok('LONG ARM in the settings UI', demo.includes('id="perklongarm"') && demo.includes('LONG ARM: OFF'));
  ok('STREET FLOOR: world-anchored tile board with median + lane dashes',
    demo.includes('STREET FLOOR V6') && demo.includes('G.worldOff') &&
    demo.includes('rgba(184,160,40') && demo.includes('rgba(215,205,185'));
  ok('full-tile Chebyshev steps (no normalized diagonals)',
    demo.includes('const sx=v[0], sy=v[1];'));
  // v7 (Paolo): grid-true field, real blocks on tiles, two-turn red line
  ok('GRID TRUE: one tile of distance = one board cell (fieldPos linear)',
    demo.includes('const rr=e.edist*ring;'));
  ok('pillars snap to tile centers', demo.includes('cover sits ON a tile'));
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
  ok('GRID LOCK: pillars snap to integer centers (same grid as the board)',
    demo.includes('Math.round(Math.cos(a0)*d0), ny2=Math.round(Math.sin(a0)*d0)'));
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
  ok('stunned/prone men are targets (the easy dial you manufactured)',
    demo.includes('return G.e.filter(e=>!e.dead&&peeking(e)); }'));
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
  ok('the aim readout shows SHOT n/skill',
    demo.includes("SHOT '+(G._chainN||1)+'/'+(G.chainSkill||3)"));
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
  ok('CHAIN SKILL: shots-per-turn is a 1..8 skill (default 3)',
    demo.includes('CHAIN SKILL V14') && demo.includes("G.chainSkill=((G.chainSkill||3)%8)+1"));
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
  ok('pillars render tan with a sky-lit top, zero purple in the palette',
    demo.includes("x.fillStyle='#6e604a'") && demo.includes("x.fillStyle='#94836a'"));
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
    demo.includes('V24 LOS BEAD') && demo.includes('if(myCoverAgainst(e2.ea,e2.edist)){ if((e2.acq||0)>=1)_broke++; e2.acq=0; }'));
  ok('danger outranks its warning: red line 0.30, acquiring amber 0.18',
    demo.includes("'rgba(232,60,40,0.30)'") && demo.includes("'rgba(232,140,40,0.18)'") &&
    !demo.includes("'rgba(232,140,40,0.32)'"));
  ok('the warning speaks: fresh beads announce on damage-free turns (both turn ends)',
    demo.includes('V22: fresh beads announce themselves') &&
    demo.split("setRead('ACQUIRING',G._newBeads+' gun'").length >= 3);
  // v23: honest player crouch, roam facing, exposure honesty, auto frame
  ok('V23 HONEST PLAYER CROUCH: your crouch needs stone within 1.8 tiles too',
    demo.includes('function playerNearCover()') &&
    demo.includes('V23: no stone, no crouch'));
  ok('the victory walk faces the step, not the last shot',
    demo.includes('V23: the walk faces the step, not the last shot'));
  ok('EXPOSURE HONESTY: firing from behind the stone never opens the covered side',
    demo.includes('V23 EXPOSURE HONESTY') && demo.includes('G._poppedOut=G._poppedOut||!!myCoverAgainst(tgt.ea,tgt.edist)') &&
    demo.includes('G._poppedOut=false;'));
  ok('AUTO FRAME: cover-phase camera holds the farthest enemy, action-ring margin, through uzEff',
    demo.includes('V23 AUTO FRAME') && demo.includes('function uzEff()') &&
    demo.includes('uzApply(c,W,H){c.translate(W/2+G.userPan.x,H/2+G.userPan.y);c.scale(uzEff(),uzEff())') &&
    !demo.includes('c.scale(G.userZoom,G.userZoom)') &&
    demo.includes(')/uzEff()+W/2') && demo.includes('-96)'));
  // v24: the feel ruling
  ok('V24 VITAL NEVER CHAINS: a vital stuns 2 and ENDS the turn; only a killshot chains',
    demo.includes('a vital STUNS') && demo.includes("frozen 2 turns — turn ends") &&
    !demo.includes('// vital continues your turn'));
  ok('NO DOUBLE EXPOSURE: positional exposure kills the pop-out; button reads HOLD/SHOOT/POP OUT',
    demo.includes('function posExposed()') && demo.includes("txt='HOLD';") &&
    demo.split("txt='POP OUT';").length >= 5 && !demo.includes("txt='POP';") &&
    demo.includes('never pop around your stone while a side has you lined up'));
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
    demo.includes('_bpmEar=_bpmClock-_lms'));
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
    demo.includes('Math.min(1.30,fit)'));
  ok('playtest defaults to 8 enemies',
    demo.includes('numEnemies:8,') && demo.includes('<button class="nb on" data-n="8">8</button>'));
  ok('TARGETING AUTO/MANUAL: threat-ordered auto (v28), manual CHOOSE NEXT pause, taps only pick victims',
    demo.includes('V28 THREAT ORDER') && demo.includes("G.targetMode==='manual'") &&
    demo.includes("setRead('CHOOSE NEXT'") && demo.includes('V26 MANUAL CHAIN') &&
    demo.includes('id="targmode"'));
  ok('GRIT SHOTS: the floor perk buys a missed shot back, ceiling still caps',
    demo.includes('V26 GRIT') && demo.includes('id="gritskill"') &&
    demo.includes("(G.gritShots||0)>(G._gritUsed||0)&&(G._chainN||1)<(G.chainSkill||3)"));
  // v27: auto targeting honest
  ok('V27 PICK SPENT: a tapped pick buys ONE dial, auto resumes closest-first; popTarget never carries',
    demo.includes('V27 PICK SPENT') && demo.includes('if(G.selTarget===G.fireTarget)G.selTarget=null;') &&
    demo.split('G.popTarget=-1;').length >= 3);
  // v28: the threat ladder
  ok('V28 THREAT ORDER: adjacent blade > exposed guns (closest first) > closing blades > the rest',
    demo.includes('V28 THREAT ORDER') && demo.includes('e.melee&&e.edist<=1.6') &&
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
  ok('V30 DOWNED: a killshot drops him DYING at 1hp; the fall plays into the floor, never a clean delete',
    demo.includes('V30 DOWNED: a killshot drops him DYING') &&
    demo.includes('tgt._fellAt=performance.now()+G.ks.dur*tv*1000') &&
    demo.includes('return L.prone112||fseq[fseq.length-1]; }'));
  ok('the dying and the broken are OUT of every combat read (peek/fire/line/alive/melee/AI/acq/snap/reckless/lines)',
    demo.split('e.downed').length >= 12 && demo.includes('!e.dead&&!e.downed&&!e.broken'));
  ok('THE CRAWL: every 5th turn a dying man crawls one tile toward a downed/dead friend, smearing blood',
    demo.includes('the dying crawl toward their own every 5th turn') &&
    demo.includes("e._downTurns%5!==0"));
  ok('FINISH OR SPARE: the contextual button becomes the death blow on a dying/surrendered man, victory walk included',
    demo.includes('function finishHim(t)') && demo.includes("b.textContent='FINISH '+t.n") &&
    demo.includes('the death blow is a CHOICE'));
  ok('V30 NERVE: past half the crew down, survivors roll (10% +6%/body); the broken stand hands-up',
    demo.includes('V30 NERVE: past half the crew down') &&
    demo.includes('0.10+0.06*(_down-_half)') && demo.includes('L.handsup112||L.idle112'));
  ok('surrender bake wired both sides',
    alpha.includes("L.look.handsup112=bake112(L.d,'hands-up',0.4)") &&
    demo.includes('V30B SURRENDER LOADER'));
  ok('WOUNDED GUNS SHAKE: <=40% hp fires at 0.8x and the tracer wobbles',
    demo.split('e.hp<=e.max*0.4?0.8:1').length >= 3 && demo.includes("a hurt gun's tracer wobbles"));
}
/* ---- 4. alpha wiring ---- */
ok('alpha bakes the walk frames the demo plays (player 4-phase, enemies 2-phase)',
  alpha.includes("out.dirs[d].walk=[0,0.25,0.5,0.75].map(p=>bake112(d,'walk',p))") &&
  alpha.includes("L.look.walk112=[0.25,0.75].map(p=>bake112(L.d,'walk',p))"));

console.log('=== COMBAT GATE: ' + pass + ' pass / ' + fail + ' fail ===');
if (fail) console.log('HINT: if demo markers are missing, a parallel-session merge clobbered COMBAT_B64 -- run: python3 tools/bohemia_combat_melee_patch.py');
process.exit(fail ? 1 : 0);

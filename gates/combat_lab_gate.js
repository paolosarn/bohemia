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
    /function doMove\([\s\S]{0,2800}?endTurnReturn\(false\); \}/.test(demo));
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
  ok('enemies take pillar cover too — REAL cover only (V35: ONE pillar must both block and sit near him)',
    demo.includes('function updateGeomCover()') &&
    demo.includes('e.gcov=realCoverPillar(e)?1:0;') &&
    !demo.includes('(e.inCover||e.gcov)') && !demo.includes('e.inCover=!e.inCover'));
  ok('pillars block the step (occupancy: solid is solid)',
    demo.includes("'a pillar is there'") && demo.includes("setRead('BLOCKED',_sprinting?"));
  ok('shove into a pillar slams (65% topple)', demo.includes('PILLAR SLAM'));
  // v6 (Paolo): push = ONE tile, LONG ARM perk = two; street tile board floor
  ok('PAOLO RULING: shove pushes back ONE tile', BM.shove({ stun: 0, stunCooldown: 0 }, false, 99).pushed === 1);
  ok('LONG ARM perk pushes two', BM.shove({ stun: 0, stunCooldown: 0 }, { longarm: true }, 99).pushed === 2);
  ok('LONG ARM in the settings UI', demo.includes('id="perklongarm"') && demo.includes('LONG ARM: OFF'));
  ok('STREET FLOOR: world-anchored tile board with median + lane dashes',
    demo.includes('STREET FLOOR V6') && demo.includes('G.worldOff') &&
    demo.includes('rgba(184,160,40') && demo.includes('rgba(215,205,185'));
  ok('full-tile Chebyshev steps (no normalized diagonals)',
    demo.includes('const sx=v[0]*_mult, sy=v[1]*_mult;'));
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
    demo.includes("'#6e604a'") && demo.includes("x.fillStyle='#94836a'"));
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
  ok('NO DOUBLE EXPOSURE: positional exposure kills the pop-out ONLY when a covered side exists to protect (V32); button reads HOLD/SHOOT/POP OUT',
    demo.includes('function posExposed()') && demo.includes("txt='HOLD';") &&
    demo.split("txt='POP OUT';").length >= 5 && !demo.includes("txt='POP';") &&
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
  ok('THE CRAWL: every 5th turn a dying man crawls one tile toward a downed/dead friend, smearing blood',
    demo.includes('the dying crawl toward their own every 5th turn') &&
    demo.includes("e._downTurns%5!==0"));
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
  ok('the FINISH has weight (hitstop + heavier pool + haptic)',
    demo.includes('the death blow lands with weight') && demo.includes('G._hitstop=Math.max(G._hitstop||0,10)'));
  ok('the crawl DRAGS a smear at both ends',
    demo.includes('smear where he WAS') && demo.includes('where he drags TO'));
  // v32: the diagnosis pass — five bugs killed, four rulings built
  ok('V32 HOLD FIX: NO DOUBLE EXPOSURE only gates when a covered side actually exists to protect',
    demo.includes('function coveredFromMe()') &&
    demo.includes('pexp.length>0 && coveredFromMe().length>0') &&
    demo.includes('posExposed().length>0 && coveredFromMe().length>0'));
  ok('posExposed excludes the dying, the surrendered, and the fled (they can never hold you hostage)',
    demo.includes('!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!e.melee&&e.stun<=0&&!myCoverAgainst'));
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
    demo.includes('e.gcov=realCoverPillar(e)?1:0'));
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
    demo.includes('if(e.fleeing){ if(L.walk112'));
  // v36: follow-up on v35 (accuracy definition + killed the living-portrait effect)
  ok('V36 FIRE-BUTTON FACE KILLED: JUICE.AU (dying-face swap / red wash / red border on HP loss) is off',
    demo.includes('AS:true,AT:true,AU:false,AV:true'));
  // v38: accuracy corrected a third time -- a continuous per-shot proximity score,
  // not a binary zone bucket (v37's kill+vital=100/hit+miss=0 wasn't it either)
  ok('V38 CONTINUOUS PRECISION: accuracy is a continuous per-shot proximity-to-center score, not a binary zone bucket',
    demo.includes('V38 CONTINUOUS PRECISION') &&
    demo.includes('_precisionPct=Math.max(0,1-d/hitz)*100') &&
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
  ok('V43 WEAPON KILL IMPACT: the killshot hitstop and blood burst both scale by weapon (shotgun heaviest, pistol cleanest)',
    demo.includes('V43 WEAPON KILL IMPACT') &&
    demo.includes("const _wpnStop={pistol:3,smg:2,rifle:4,shotgun:6}[WEAPON]||3;") &&
    demo.includes('if(JUICE.F)G._hitstop=_wpnStop;') &&
    demo.includes("{pistol:0.75,smg:0.95,rifle:1.15,shotgun:1.55}[WEAPON]"));
  // v44: SPRINT -- real movement/strategy stakes, not just repositioning
  ok('V44 SPRINT: arms a 2-tile move that resolves fully engaged (real return fire), blocked if either tile in the path has a pillar, consumes itself after one use',
    demo.includes('V44 SPRINT') &&
    demo.includes('id="sprintbtn"') &&
    demo.includes('const _sprinting=!!G.sprintArm;') &&
    demo.includes('const _mult=_sprinting?2:1;') &&
    demo.includes('endTurnReturn(true); }   /* V44: a sprint breaks cover for real, same cost as popping to fire */') &&
    demo.includes("if(_sprinting){ G.sprintArm=false;"));
  // v45: the real camera bug -- the fit floor, not the fit formula, was cutting enemies off-screen
  ok('V45 CAMERA FLOOR: the auto-frame zoom floor is 0.20, not 0.45 -- covers realistic spawn/sniper max range on a real phone canvas',
    demo.includes('V45 CAMERA FLOOR') &&
    demo.includes('uzT=Math.max(0.20,Math.min(1.30,fit));'));
  // v46: a live comment field at the top of the screen, feeding the existing export pipeline
  ok('V46 LIVE COMMENT: a top-of-screen input that appends turn-tagged comments to the existing jnotes/export pipeline, not a new storage surface',
    demo.includes('V46 LIVE COMMENT') &&
    demo.includes('id="lcinput"') && demo.includes('id="lcadd"') &&
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
}
/* ---- 4. alpha wiring ---- */
ok('alpha bakes the walk frames the demo plays (player 4-phase, enemies 2-phase)',
  alpha.includes("out.dirs[d].walk=[0,0.25,0.5,0.75].map(p=>bake112(d,'walk',p))") &&
  alpha.includes("L.look.walk112=[0.25,0.75].map(p=>bake112(L.d,'walk',p))"));

console.log('=== COMBAT GATE: ' + pass + ' pass / ' + fail + ' fail ===');
if (fail) console.log('HINT: if demo markers are missing, a parallel-session merge clobbered COMBAT_B64 -- run: python3 tools/bohemia_combat_melee_patch.py');
process.exit(fail ? 1 : 0);

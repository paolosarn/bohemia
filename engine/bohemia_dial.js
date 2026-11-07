/* ============================================================================
   BOHEMIA -- THE DEAD SHOT DIAL, ONE MODULE (SCAVENGE 11/7/26; rule 331: "the dial's code (tiers, resolution contract, greed) is
   still in the alpha: lifted into one engine module the fight's important shot can use later"; rule 426(b), Paolo 11/7 YES on the
   scavenge design: 'I want it to be like a fun minigame').

   WHERE IT CAME FROM, BYTE FOR BYTE: the ONE canonical motion engine stamped into the old dial fight, which lives in the alpha as
   COMBAT_B64 (slices/BOHEMIA_ALPHA_0_9.html, "dead eye dial combat"), between its ENGINE START / ENGINE END marks. Its master file
   (engine/bohemia_engine.master.js) is gone from the repo, so the stamped copy was the only one; it is copied here unchanged except:
     - the global is BohemiaDial, never BohemiaEngine (engine/bohemia_engine.js owns that name: its CombatBridge, the RESOLUTION
       CONTRACT {outcome: killshot | hit | miss, zone, greedMult, patMeta}, is the contract every user of this dial reports in);
     - zoneOf(G, W) below: the fight's own resolution (slices/BOHEMIA_ALPHA_0_9.html COMBAT_B64 V53: kill <= hZ, vital <= vZ,
       hit <= hitZ, else miss, every width x ARC_MULT), with no forgiveness stacked on (the old fight's streaks and greed are not
       approved for scavenging, rule 331).
   The old fight still carries its own stamped copy, untouched. Node: module.exports. Gate: gates/scavenge_on_the_dial_gate.js.
   ============================================================================ */
/* ============================================================================
   BOHEMIA ENGINE -- MASTER SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   This is the ONE canonical copy of the Dead Eye Dial motion engine:
   the 52 patterns, the difficulty-package system, the fair-shot slowdown,
   and the wounded-aim model. Every playable demo (combat, dial, future ones)
   gets this exact block stamped into it between ENGINE START / ENGINE END
   markers. NEVER hand-edit the stamped copy inside a demo -- edit THIS file,
   then re-stamp. That is how the demos can never drift apart.

   CONTRACT (what a demo must provide / can rely on):
     - Call BohemiaDial.tick(G, dt)  every frame to advance the dial.
         G  = the demo's state object (must have the engine fields, see
              BohemiaDial.defaultState() ).
         dt = delta seconds since last frame.
     - BohemiaDial.packagePool(G)        -> array of pattern names allowed by G.pkgDiff
     - BohemiaDial.patternSpeedFactor(G,pat) -> speed multiplier for a pattern
     - BohemiaDial.rollPattern(G)        -> pick a new pattern into G.pat (respects package)
     - BohemiaDial.defaultState()        -> a fresh engine state blob to spread into G
     - BohemiaDial.K                     -> engine constants (LIM, MAX_SPD, ARC_MULT, BPM_MS...)
     - BohemiaDial.PAT_DIFF / PAT_CYCLES / ALL_PATS  -> pattern data (read-only)

   The engine touches ONLY engine-owned fields on G (pat, patT, angle, dir,
   spd, pkgDiff, greed*, exec*, wound*, frozen*). Demo-specific state (camera,
   killshot styles, DOM, art) lives elsewhere on G and the engine never reads it.
   ============================================================================ */
var BohemiaDial = (function(){
  'use strict';

  // ---- engine constants ----
  const LIM = Math.PI/3, MAX_SPD = 14.0;
  const ARC_MULT = 1.11;        // all zone arcs 11% bigger across every difficulty
  const BPM_MS = 500;           // 120 BPM grid

  // ---- pattern data (52 patterns) ----
  const PAT_CYCLES={
    snap:4, tick:4, jab:4, dart:4, skip:4, twitch:4,
    heave:6, swing:6, lob:6, sway:6,
    saw:4, rattle:4, strafe:4, spray:4, pingpong:4,
    glide:8, crawl:8, breathe:8,
    pendulum:6, heartbeat:4, spiral:4, stagger:6, wave3:4, snapcenter:4,
    feint:4, lurch:6, coil:4, recoil:6, static:4, magnet:4,
    hitch:6, whip:6, tease:4, quake:4,
    ricochet:4, gallop:4, sidewind:4, jolt:6, flick:6, cascade:6,
    avalanche:6, yoyo:4, drunk:6, piston:6, comet:6, switchback:4, trapdoor:6, flutter2:4, hook:6, seesaw:6, scatter:6, undertow:6,
  };
  const PAT_BPM={
    snap:1.0, tick:1.0, jab:1.0, dart:1.0, skip:1.0, twitch:1.0,
    heave:0.0, swing:0.5, lob:0.5, sway:0.5,
    saw:1.0, rattle:1.0, strafe:1.0, spray:1.0, pingpong:1.0,
    glide:0.5, crawl:0.5, breathe:0.5,
    pendulum:0.5, heartbeat:1.0, spiral:1.0, stagger:0.5, wave3:1.0, snapcenter:1.0,
    feint:1.0, lurch:0.5, coil:1.0, recoil:0.5, static:1.0, magnet:1.0,
    hitch:0.5, whip:0.5, tease:1.0, quake:1.0,
    ricochet:1.0, gallop:1.0, sidewind:1.0, jolt:0.5, flick:0.5, cascade:0.5,
    avalanche:0.5, yoyo:1.0, drunk:0.5, piston:0.5, comet:0.5, switchback:1.0, trapdoor:0.5, flutter2:1.0, hook:0.5, seesaw:0.5, scatter:0.5, undertow:0.5,
  };
  const PAT_DIFF={
    snap:1, lob:1, spray:1, pingpong:1,  snapcenter:1, stagger:1, crawl:1, magnet:1, hitch:1, whip:1, tease:1, quake:1, sidewind:1, cascade:1, comet:1, switchback:1, hook:1, scatter:1, tick:1, saw:1, sway:1,
    jab:2, glide:2, wave3:2, recoil:2, static:2, yoyo:2, drunk:2, undertow:2, heave:2, swing:2, skip:2, ricochet:2, flutter2:2, pendulum:2,
    feint:3, lurch:3, gallop:3, jolt:3, flick:3, seesaw:3, spiral:3,
    dart:4, twitch:4, rattle:4, strafe:4, coil:4, avalanche:4, piston:4, breathe:4, trapdoor:4,
  };

  const ALL_PATS=Object.keys(PAT_CYCLES);
  // PHASE[pat] = cycle-fraction of the pattern's best kill moment. We shift each pattern
  // by it so that moment lands on patT%cyc==0 (an accented DOWNBEAT). Filled at load by
  // computePhases(). This is what makes "release greed on the beat = killshot" true with
  // your eyes closed. Beat = truth lives in the screen; audio just rides the same clock.
  const PHASE=Object.create(null);
  const SHAPE_HARDNESS={1:1.00,2:1.35,3:1.75,4:2.20};
  const PKG_FELT={1:1.00,2:1.60,3:2.20,4:2.90};
  // FIVE packages: 0=EASY(hand-picked,19% slower) 1=NORMAL 2=HARD 3=V.HARD 4=BOHEMIAN
  const PKG_TIERS={1:[1,2],2:[1,2,3],3:[2,3,4],4:[3,4]};
  const EASY_PKG_PATS=['snap','pingpong','heartbeat','snapcenter','crawl','cascade','comet','tick','sway'];
  const EASY_PKG_SLOW=0.81; // 19% slower
  function patternSpeedFactor(G, pat){
    const tier=(G.pkgDiff==null)?1:G.pkgDiff;
    const natural=PAT_DIFF[pat]||2;
    if(tier===0){ let spd=(PKG_FELT[1]/SHAPE_HARDNESS[natural])*EASY_PKG_SLOW; return Math.max(0.30,Math.min(3.0,spd)); }
    let spd=PKG_FELT[tier]/SHAPE_HARDNESS[natural];
    return Math.max(0.35,Math.min(3.0,spd));
  }
  function packagePool(G){
    const tier=(G.pkgDiff==null)?1:G.pkgDiff;
    if(tier===0) return EASY_PKG_PATS.slice();
    const allowed=PKG_TIERS[tier]||[1,2,3,4];
    return ALL_PATS.filter(p=>allowed.includes(PAT_DIFF[p]||2));
  }
  // beats-per-cycle: keep the pattern's CURRENT real-time cycle length, snapped to whole
  // 120-beats. This preserves the felt dial speed on every difficulty; only the song grid
  // is now fixed. N≈2*(old cycle seconds).
  function beatsForCycle(G){
    /* V68 WHOLE BARS (Paolo 7/26, LAW: 120 BPM GAMEPLAY COMES FIRST).
       This used to snap to EVEN beats. Even is not a BAR. A 6- or 10-beat cycle
       puts the perfect shot on beat one, then beat three, then beat one,
       forever -- 44% of pattern x difficulty combinations could never land the
       kill moment on a downbeat, which is exactly why the hero beat never felt
       like the shot. PHASE already parks each pattern's kill moment at the TOP
       of the cycle; the cycle just has to start on beat one. So: whole bars,
       floor of one bar, and greed halves IN BARS. Felt speed still tracks the
       pattern (we round to the nearest bar), the grid is now absolute. */
    const psf=patternSpeedFactor(G,G.pat);
    const BAR=4;
    let n=Math.max(BAR, Math.round( (PAT_CYCLES[G.pat]||4) * 2 / psf / BAR ) * BAR);
    if(G.greedHeld) n=Math.max(BAR, Math.round(n/2/BAR)*BAR);   // greed = ~twice as fast, still whole bars
    return n;
  }
  function tickPat(G, dt){
    const safeDt=Math.min(dt,0.033);
    const execSlow=G.execWindow?0.75:1.0;
    const BR=2;                                      // beats/sec at the fixed 120 BPM master grid
    if(G.beatClock!=null){ G.musicT=G.beatClock; G.patT=G.beatClock; }  // SLAVED: the dial reads the song's own beat clock -> locked by construction
    else { if(G.musicT==null)G.musicT=0; G.musicT+=safeDt*BR; G.patT+=safeDt*BR*(G.greedHeld?2:1)*execSlow; }
    const greedSpeed=G.greedHeld?2.0:1.0;
    const cyc=beatsForCycle(G);                      // N beats per cycle (preserves real-time feel)
    const t=(((G.patT%cyc)/cyc) - (PHASE[G.pat]||0) + 1)%1;   // phase-locked: kill moment -> a 120 grid beat
    const TP=Math.PI*2;
    const D=G.dir;
    const s=Math.min(G.spd,MAX_SPD);
    let target=0;
  
    switch(G.pat){
      // ── PISTOL -- quick & twitchy, hangs near center, snaps to edges ──
      case 'snap':
        // fast pull to one side, snap back through center, little hang
        target = D*(Math.sin(t*TP)*0.55 + Math.sin(t*TP*2)*0.30)*LIM;
        break;
      case 'tick':
        // ratchet -- steps that PAUSE on center so you get a clean shot there
        // 5 stops: edge, mid, CENTER, mid, edge  (-.8, -.4, 0, .4, .8)
        {const stops=[-0.8,-0.4,0,0.4,0.8];
         const idx=Math.floor(t*5)%5;
         const seg=(t*5)%1;
         // ease between stops but linger ~55% of each step holding the stop
         const hold=seg<0.55?0:(seg-0.55)/0.45;
         const cur=stops[idx];
         const nxt=stops[(idx+1)%5];
         const micro=Math.sin(t*TP*10)*0.03;       // tiny life so it isn't frozen
         target = D*((cur+(nxt-cur)*hold)+micro)*LIM;}
        break;
      case 'jab':
        // double-jab: quick out-back, pause, quick out-back the other way
        {const h=t<0.5? Math.sin(t*2*TP) : -Math.sin((t-0.5)*2*TP);
         target = D*h*0.7*LIM;}
        break;
      case 'dart':
        // darts between three positions sharply
        target = D*(Math.sign(Math.sin(t*TP*3))*Math.pow(Math.abs(Math.sin(t*TP*3)),0.4))*0.6*LIM;
        break;
  
      // ── HEAVY -- big slow weighty pendulum, overshoots ──
      case 'heave':
        // huge slow swing with momentum overshoot
        target = D*Math.sin(t*TP)*1.02*LIM;
        target = Math.max(-LIM,Math.min(LIM,target));
        break;
      case 'swing':
        // swings to one side, hangs heavy, swings back
        {const e=t<0.5? Math.pow(Math.sin(t*Math.PI),0.7) : -Math.pow(Math.sin(t*Math.PI),0.7);
         target = D*e*0.96*LIM;}
        break;
      case 'lob':
        // slow rise to far edge, drops fast (like a heavy lob)
        {const up=t<0.7? t/0.7 : 1-(t-0.7)/0.3;
         target = D*(up*2-1)*0.95*LIM;}
        break;
  
      // ── AUTO -- busy mid-speed rhythmic, lots of motion ──
      case 'saw':
        // sawtooth sweep -- mechanical, even
        target = D*((t<0.5? t*2 : 2-t*2)*2-1)*0.9*LIM;
        break;
      case 'rattle':
        // fast oscillation riding a slow sweep -- frantic but readable
        target = D*(Math.sin(t*TP)*0.55 + Math.sin(t*TP*5)*0.30)*LIM;
        break;
      case 'strafe':
        // pans across with a shimmy
        target = D*(Math.sin(t*TP)*0.7 + Math.sin(t*TP*7)*0.14)*LIM;
        break;
  
      // ── BOLT -- ultra slow, one long deliberate arc, very readable ──
      case 'glide':
        // smooth even glide -- the cleanest, most readable slow sweep
        target = D*Math.sin(t*TP)*0.95*LIM;
        break;
      case 'crawl':
        // hangs LONG at each edge then creeps across -- the center passes are brief
        {const e=Math.sin(t*TP);
         target = D*Math.sign(e)*Math.pow(Math.abs(e),1.7)*0.92*LIM;} // flattened at edges, steep mid
        break;
  
      // ── EXTRA PISTOL patterns -- livelier ──
      case 'skip':
        // hops across in 3 lively skips with a bounce at each
        {const seg=t*3%1; const which=Math.floor(t*3);
         const pos=(which-1)*0.5; // -.5,0,.5
         const hop=Math.sin(seg*Math.PI)*0.22;
         target=D*(pos+hop)*1.5*LIM*0.62;}
        break;
      case 'twitch':
        // nervous -- small fast wiggles riding a gentle drift
        target=D*(Math.sin(t*TP)*0.45 + Math.sin(t*TP*9)*0.14 + Math.sin(t*TP*3)*0.10)*LIM;
        break;
  
      // ── EXTRA HEAVY ──
      case 'sway':
        // ASYMMETRIC weight shift -- lurches hard to one side, hangs, drifts lazily back.
        // spends most of the cycle on ONE side, unlike glide's even back-and-forth.
        {const p=t;
         let v;
         if(p<0.35){ v = Math.sin(p/0.35*Math.PI*0.5); }            // quick lurch out
         else if(p<0.75){ v = 1 - (p-0.35)/0.40*0.15; }             // hang heavy near the edge
         else { v = Math.cos((p-0.75)/0.25*Math.PI*0.5)*0.85; }     // lazy drift back through
         target = D*v*0.92*LIM;}
        break;
  
      // ── EXTRA AUTO ──
      case 'spray':
        // busy spray -- mid sweep with a fast chattering overlay
        target=D*(Math.sin(t*TP)*0.6 + Math.sin(t*TP*6)*0.22 + Math.sin(t*TP*11)*0.08)*LIM;
        target=Math.max(-LIM,Math.min(LIM,target));
        break;
      case 'pingpong':
        // bounces edge to edge with little overshoot wobbles
        {const base=(t<0.5? t*2 : 2-t*2)*2-1;
         const wob=Math.sin(t*TP*8)*0.08;
         target=D*(base*0.85+wob)*LIM;}
        break;
  
      // ── EXTRA BOLT ──
      case 'breathe':
        // dwells near CENTER, swells out and eases back -- like a breath. center is the easy shot.
        {const e=Math.sin(t*TP);
         target = D*Math.sign(e)*Math.pow(Math.abs(e),0.45)*0.9*LIM;} // bulged toward center, soft at edges
        break;
  
      // ── NEW PATTERNS -- more variety to learn ──
      case 'pendulum':
        // smooth heavy pendulum that lingers at both edges, races through center
        {const e=Math.sin(t*TP);
         target=D*Math.sign(e)*Math.pow(Math.abs(e),0.6)*0.95*LIM;}
        break;
      case 'heartbeat':
        // two quick pulses then a rest -- lub-dub ... lub-dub
        {const p=t%0.5/0.5;
         const beat=p<0.2?Math.sin(p/0.2*Math.PI):p<0.4?Math.sin((p-0.2)/0.2*Math.PI)*0.6:0;
         target=D*(beat*0.9)*LIM;}
        break;
      case 'spiral':
        // amplitude grows then shrinks across the cycle -- widening then tightening
        {const amp=0.3+0.65*Math.sin(t*Math.PI);
         target=D*Math.sin(t*TP*3)*amp*LIM;}
        break;
      case 'stagger':
        // lurches -- fast jerk, hold, fast jerk, hold
        {const seg=Math.floor(t*6);
         const stops=[-0.7,-0.7,0.1,0.1,0.7,0.7];
         const cur=stops[seg%6];
         const micro=Math.sin(t*TP*12)*0.04;
         target=D*(cur+micro)*LIM;}
        break;
      case 'wave3':
        // three nested sine waves -- complex but rhythmic, rewards real reading
        target=D*(Math.sin(t*TP)*0.5 + Math.sin(t*TP*2)*0.28 + Math.sin(t*TP*4)*0.14)*LIM;
        break;
      case 'snapcenter':
        // hangs at edges, then SNAPS to center and holds -- center is the reward
        {const p=t%0.5/0.5;
         let v;
         if(p<0.35)v=(p<0.175?-0.85:0.85); // sit at an edge
         else v=Math.sin((p-0.35)/0.15*Math.PI*0.5)*0; // collapse to center
         const atCenter=p>=0.35;
         target=D*(atCenter?0:(p<0.175?-0.85:0.85))*LIM + (atCenter?Math.sin(t*TP*10)*0.03*LIM:0);}
        break;
  
      // ── 6 NEW PATTERNS -- all weird, none metronome ──
      case 'feint':
        // FAKE-OUT: darts toward one edge, snaps back through center to the OTHER edge.
        // the first move is a bait -- the real window is the reversal.
        {const p=t;
         let v;
         if(p<0.25){ v = -Math.sin(p/0.25*Math.PI*0.5)*0.8; }         // bait left
         else if(p<0.4){ v = -0.8 + (p-0.25)/0.15*1.7; }              // snap across
         else if(p<0.85){ v = 0.9 - (p-0.4)/0.45*0.1; }               // hold right
         else { v = 0.85*Math.cos((p-0.85)/0.15*Math.PI*0.5); }       // settle center
         target = D*v*LIM;}
        break;
      case 'lurch':
        // PAUSE-AND-DASH: dead still off-center, then a sudden fast dash across, then still again.
        {const p=t;
         let v;
         if(p<0.45){ v=-0.55; }                                       // frozen, waiting
         else if(p<0.58){ v=-0.55 + (p-0.45)/0.13*1.15; }             // explosive dash
         else { v=0.6 + Math.sin((p-0.58)*20)*0.04*(1-(p-0.58)/0.42); } // settle with a shiver
         target = D*v*0.95*LIM;}
        break;
      case 'coil':
        // ACCELERATING SPIN-IN: wide slow swings that tighten and speed toward center.
        {const freq = 1 + t*3;                                        // speeds up over the cycle
         const amp = 0.95*(1-t*0.7);                                  // shrinks toward center
         target = D*Math.sin(t*Math.PI*2*freq)*amp*LIM;}
        break;
      case 'recoil':
        // DOUBLE-BACK: pushes out, jerks back like a kick, pushes out further, jerks back.
        {const p=t;
         const main=Math.sin(p*Math.PI*2)*0.85;
         const kick=Math.sin(p*Math.PI*8)*0.18*Math.sin(p*Math.PI);  // recoil jerks, strongest mid
         target = D*(main - kick)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'static':
        // CHAOS-THEN-CALM: jittery noise that resolves into a clean still center.
        // the window is learning WHEN it calms, not dodging the jitter.
        {const p=t;
         if(p<0.6){
           // deterministic jitter (sum of fast primes -- looks chaotic, fully repeatable)
           const j=Math.sin(p*47)*0.4 + Math.sin(p*83)*0.3 + Math.sin(p*131)*0.2;
           target = D*j*0.7*LIM;
         } else {
           const calm=(p-0.6)/0.4;
           target = D*Math.sin(p*47)*0.7*(1-calm)*LIM;                // jitter fades to center
         }}
        break;
      case 'magnet':
        // CENTER-MAGNET: keeps getting yanked toward center but slingshots past it each time,
        // overshooting less and less -- a decaying bounce around the kill zone.
        {const decay=Math.exp(-t*2.2);
         target = D*Math.sin(t*Math.PI*2*2.5)*decay*0.9*LIM;}
        break;
  
      // ── 6 MORE PATTERNS -- all distinct, no metronome ──
      case 'hitch':
        // STUTTER-STEP: moves a bit, hitches/freezes, moves a bit more, hitches -- jerky crawl across.
        {const steps=5;
         const sIdx=Math.floor(t*steps);
         const sFrac=(t*steps)%1;
         const move=sFrac<0.45? sFrac/0.45 : 1;            // move then freeze each step
         const pos=(sIdx+move)/steps;
         target = D*(pos*2-1)*0.85*LIM;}
        break;
      case 'whip':
        // SLOW LOAD, FAST CRACK: drags slowly to the far edge, then whips back across through center
        // at high speed and overshoots the other side before settling.
        {const p=t;
         let v;
         if(p<0.6){ v = -(p/0.6)*0.9; }                    // slow drag out
         else if(p<0.72){ v = -0.9 + (p-0.6)/0.12*1.85; }  // explosive whip across
         else { v = 0.95*Math.cos((p-0.72)/0.28*Math.PI*1.5)*Math.exp(-(p-0.72)*4); } // overshoot+settle
         target = D*v*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'tease':
        // APPROACH-AND-RETREAT: eases toward center, backs off, eases closer, backs off,
        // finally arrives -- the kill zone keeps getting baited then withheld.
        {const approach=t;
         const wobble=Math.cos(t*TP*3)*0.5*(1-t);          // retreats shrink as it closes in
         target = D*((1-approach)*0.85 + wobble)*Math.sign(0.5-t || 1)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'quake':
        // BUILDING TREMOR: starts as a tiny shiver near center and grows into wide violent shakes,
        // then collapses back to a still center. window is the calm at start or end.
        {const env=Math.sin(t*Math.PI);                    // 0..1..0 amplitude envelope
         target = D*Math.sin(t*47)*env*0.85*LIM;}          // fast shiver scaled by the swell
        break;
  
      // ── 6 MORE -- distinct, no metronome, none camping center ──
      case 'ricochet':
        // BOUNCES off invisible walls at random-feeling but fixed angles -- sharp direction changes,
        // never a smooth arc. like a ball pinging around a box.
        {const segs=[[-0.8,0.6],[0.6,-0.3],[-0.3,0.9],[0.9,-0.7]];
         const n=segs.length;
         const idx=Math.floor(t*n)%n;
         const f=(t*n)%1;
         const [a,b]=segs[idx];
         target = D*(a+(b-a)*f)*LIM;}
        break;
      case 'gallop':
        // GALLOP RHYTHM: two quick steps then a long stride -- da-da-DUM, da-da-DUM.
        // uneven spacing, never even.
        {const p=t%0.5/0.5;
         let v;
         if(p<0.18){ v=Math.sin(p/0.18*Math.PI)*0.5; }       // quick step
         else if(p<0.34){ v=Math.sin((p-0.18)/0.16*Math.PI)*-0.5; } // quick step other way
         else { v=Math.sin((p-0.34)/0.66*Math.PI)*0.95; }    // long stride
         target = D*v*LIM;}
        break;
      case 'sidewind':
        // travels across in ONE direction the whole cycle with a wavy snake motion, then resets.
        // never reverses mid-cycle -- a one-way crawl with wiggle.
        {const across = t*2-1;                                 // -1 -> 1 across the cycle
         const wig = Math.sin(t*TP*5)*0.18;
         target = D*(across*0.85 + wig)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'jolt':
        // sits at one edge, JOLTS to the opposite edge instantly, sits, jolts back -- teleport feel.
        {const p=t;
         let v;
         if(p<0.4){ v=-0.85; }
         else if(p<0.45){ v=-0.85+(p-0.4)/0.05*1.7; }         // near-instant jolt
         else if(p<0.85){ v=0.85; }
         else { v=0.85-(p-0.85)/0.15*1.7; }                   // jolt back
         const micro=Math.sin(t*TP*14)*0.03;
         target = D*(v+micro)*LIM;}
        break;
      case 'flick':
        // long lazy drift one way, then a sudden tiny FLICK past center and back -- the flick is the window.
        {const p=t;
         let v;
         if(p<0.7){ v=-0.6+(p/0.7)*0.5; }                     // slow drift from -0.6 to -0.1
         else if(p<0.82){ v=-0.1+Math.sin((p-0.7)/0.12*Math.PI)*0.7; } // quick flick across+back
         else { v=-0.1 - (p-0.82)/0.18*0.5; }                 // drift back out
         target = D*v*LIM;}
        break;
      case 'cascade':
        // STAIRCASE DOWN then SNAP UP: steps down one side edge-by-edge, then snaps back to the top.
        // descending ratchet, never symmetric.
        {const steps=5;
         const s=Math.floor(t*steps);
         const within=(t*steps)%1;
         const base=0.9-(s/(steps-1))*1.8;                    // 0.9 down to -0.9 in steps
         const settle=within<0.6?0:(within-0.6)/0.4*0.05;
         target = D*(base+settle)*LIM;}
        break;
  
      // ── 12 MORE -- all distinct, no metronome, none camping center ──
      case 'avalanche':
        // builds slow at top, then tumbles down faster and faster in chunks to the bottom, resets.
        {const p=t;
         const accel=p*p;                                   // speeds up as it falls
         const chunk=Math.floor(accel*5)/5;
         target = D*(0.9 - chunk*1.8)*LIM;}
        break;
      case 'yoyo':
        // throws out fast to the edge, walks back slow, throws out fast again -- asymmetric speed.
        {const p=t%0.5/0.5;
         let v;
         if(p<0.25){ v = Math.sin(p/0.25*Math.PI*0.5)*0.9; }   // fast throw out
         else { v = 0.9*(1-(p-0.25)/0.75); }                   // slow walk back
         target = D*(v*2-0.9)*LIM;}
        break;
      case 'drunk':
        // wanders unevenly -- leans one way, catches itself, stumbles the other, never repeating evenly.
        {const a=Math.sin(t*TP*1.0)*0.5;
         const b=Math.sin(t*TP*2.3 + 1.0)*0.3;
         const cc=Math.sin(t*TP*0.7 + 2.0)*0.2;
         target = D*(a+b+cc)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'piston':
        // drives to one edge and PUMPS there in place a few times, then drives to the other and pumps.
        {const p=t;
         if(p<0.45){ const pump=Math.sin((p/0.45)*Math.PI*4)*0.12; target=D*(-0.8+pump)*LIM; }
         else if(p<0.55){ target=D*(-0.8+(p-0.45)/0.1*1.6)*LIM; }   // drive across
         else { const pump=Math.sin(((p-0.55)/0.45)*Math.PI*4)*0.12; target=D*(0.8+pump)*LIM; }
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'comet':
        // streaks fast across the whole arc, then slowly drifts back from the far edge -- one big sweep, one slow return.
        {const p=t;
         let v;
         if(p<0.25){ v=-0.9+(p/0.25)*1.8; }                  // fast streak across
         else { v=0.9-((p-0.25)/0.75)*1.8; }                 // slow drift back
         target = D*v*LIM;}
        break;
      case 'switchback':
        // climbs in zigzag steps up one side, hits the top, zigzags down the other -- mountain road.
        {const z=Math.sin(t*TP*4)*0.25;                      // the zigzag
         const climb=Math.sin(t*TP)*0.7;                     // the overall up-over-down
         target = D*(climb+z)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'trapdoor':
        // hangs perfectly still off to one side... then DROPS through center to the other side suddenly, hangs again.
        {const p=t;
         let v;
         if(p<0.42){ v=0.75; }                               // hang
         else if(p<0.5){ v=0.75-(p-0.42)/0.08*1.5; }         // trapdoor drop
         else if(p<0.92){ v=-0.75; }                         // hang other side
         else { v=-0.75+(p-0.92)/0.08*1.5; }                 // snap back up
         target = D*v*LIM;}
        break;
      case 'flutter2':
        // light fast flutters that slowly travel from one edge to the other -- a butterfly crossing.
        {const travel=t*2-1;                                 // slow drift across
         const flut=Math.sin(t*TP*9)*0.22;
         target = D*(travel*0.7 + flut)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'hook':
        // drives straight toward one edge, then HOOKS sharply back the opposite way at the last moment.
        {const p=t;
         let v;
         if(p<0.6){ v=-(p/0.6)*0.95; }                       // straight drive out
         else { v=-0.95 + Math.pow((p-0.6)/0.4,0.6)*1.9; }   // sharp hook back across
         target = D*v*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
      case 'seesaw':
        // tips slowly to one side under weight, holds, then suddenly TIPS over to the other -- never even timing.
        {const p=t;
         let v;
         if(p<0.4){ v=-0.2-(p/0.4)*0.6; }                    // slow tip down one side
         else if(p<0.5){ v=-0.8; }                           // bottom out hold
         else if(p<0.6){ v=-0.8+(p-0.5)/0.1*1.6; }           // tip over fast
         else if(p<0.95){ v=0.8; }                           // hold high
         else { v=0.8-(p-0.95)/0.05*1.0; }                   // start back
         target = D*v*LIM;}
        break;
      case 'scatter':
        // jumps to a few fixed scattered points in a fixed order -- learnable but feels random, never a sweep.
        {const pts=[0.7,-0.5,0.2,-0.85,0.45,-0.15];
         const n=pts.length;
         const idx=Math.floor(t*n)%n;
         const f=(t*n)%1;
         const ease=f<0.5?0:(f-0.5)/0.5;                     // snap then settle
         const cur=pts[idx], nxt=pts[(idx+1)%n];
         target = D*(cur+(nxt-cur)*ease*0.25)*LIM;}          // mostly holds each point
        break;
      case 'undertow':
        // pulls steadily one direction like a current, with a slow heavy surge layered under it.
        {const drift=Math.sin(t*TP)*0.6;
         const surge=Math.sin(t*TP*0.5 + 0.5)*0.35;
         const pull=Math.sin(t*TP*3)*0.08;
         target = D*(drift+surge+pull)*LIM;
         target=Math.max(-LIM,Math.min(LIM,target));}
        break;
  
      default:
        target=D*Math.sin(t*TP)*0.9*LIM;
    }
  
    // ---- WOUNDED AIM: a hurt shooter's hand shakes. adds TREMOR to the aim, never speed. ----
    // wound 0..1 -> tremor amplitude. a fresh hit spikes woundShake briefly on top.
    const w=G.wound;
    if(w>0.001 || G.woundShake>0.001){
      const shakeAmt=(w*0.10 + G.woundShake*0.18)*LIM;   // small, in radians of arc
      // layered fast tremor (deterministic-ish via patT) so it reads as a shake, not noise
      const tremor=(Math.sin(G.patT*37)*0.6 + Math.sin(G.patT*61+1.3)*0.4)*shakeAmt;
      target += tremor;
      // the closer to critical, the more the hold itself drifts (harder to settle on center)
      target += Math.sin(G.patT*5.5)*w*0.05*LIM;
    }
    if(G.woundShake>0) G.woundShake=Math.max(0,G.woundShake-safeDt*2.2);  // spike decays fast
  
    // fair-shot slowdown (still applies -- the center is always reachable, just shakier when hurt)
    const distFromCenter=Math.abs(G.angle)/LIM;
    const nearKill=1-Math.min(1,distFromCenter/0.28);
    const slowFactor=1-nearKill*0.62;
    if(G.greedHeld){G.greedMult=Math.min(3.0,G.greedMult+safeDt*0.9);}
    // wounded steadiness: a hurt hand reacts a touch LESS crisply (lower resp), so it's harder
    // to snap onto center -- but the dial does NOT move faster. difficulty from shake, not speed.
    const woundResp=1 - w*0.22;
    const resp=Math.min(1,safeDt*(13+s*1.6)*slowFactor*greedSpeed*woundResp);
    G.angle+=(target-G.angle)*resp;
    G.angle=Math.max(-LIM,Math.min(LIM,G.angle));
  }

  // ---- baked per-pattern phase (verified: every pattern lands the KILL zone on the
  //      downbeat, so a blind on-beat greed release = killshot). Computed offline by the
  //      phase search; no page-load cost. Re-bake if pattern math changes. ----
  Object.assign(PHASE,{
    snap:0.4165, tick:0.4825, jab:0.2315, dart:0.1556, skip:0.6235, twitch:0.485,
    heave:0.4865, swing:0.9876, lob:0.632, sway:0.9875, saw:0.223, rattle:0.485,
    strafe:0.4838, spray:0.4265, pingpong:0.21, glide:0.487, crawl:0.485, breathe:0.4924,
    pendulum:0.49, heartbeat:0, spiral:0.9765, stagger:0.6455, wave3:0.4795, snapcenter:0.084,
    feint:0.972, lurch:0.473, coil:0.98, recoil:0.9855, static:0, magnet:0.1705,
    hitch:0.5385, whip:0.329, tease:0, quake:0.0405, ricochet:0.5605, gallop:0.3065,
    sidewind:0.4805, jolt:0.0615, flick:0.2845, cascade:0.478, avalanche:0.216, yoyo:0.1657,
    drunk:0.0655, piston:0.4879, comet:0.359, switchback:0.427, trapdoor:0.028, flutter2:0.4875,
    hook:0.257, seesaw:0.9975, scatter:0.0065, undertow:0.43
  });

  function rollPattern(G){
    const pool = packagePool(G);
    G.pat = pool[Math.floor(Math.random()*pool.length)] || 'snap';
    G.patT = 0; G.musicT = 0; G.angle = 0; G.dir = Math.random()<0.5 ? 1 : -1;
  }

  // ---- a fresh engine-owned state blob; demos spread this into their G ----
  function defaultState(){
    return {
      // motion
      pat:'snap', patT:0, musicT:0, angle:0, dir:1, spd:7,
      // difficulty package (0=EASY 1=NORMAL 2=HARD 3=V.HARD 4=BOHEMIAN)
      pkgDiff:1,
      // greed / follow-up / execution
      greedHeld:false, greedMult:1.0, inFU:false, execWindow:false,
      // freeze (killshot / hit pauses)
      frozen:false, freezeTimer:0,
      // wounded aim
      wound:0, woundShake:0,
      // zone widths for the active weapon (demo can overwrite per weapon)
      W:{hZ:0.05, vZ:0.12, hitZ:0.26}
    };
  }

  // ---- public API ----
  return {
    K: { LIM, MAX_SPD, ARC_MULT, BPM_MS, BPM:60000/BPM_MS, BEAT_RATE:2 },
    PAT_CYCLES, PAT_BPM, PAT_DIFF, ALL_PATS, PHASE,
    SHAPE_HARDNESS, PKG_FELT, PKG_TIERS, EASY_PKG_PATS, EASY_PKG_SLOW,
    patternSpeedFactor, beatsForCycle, packagePool, rollPattern, defaultState,
    tick: tickPat
  };
})();

// UMD-ish: expose for both browser global and any module context
if (typeof window !== 'undefined') window.BohemiaDial = BohemiaDial;
if (typeof module !== 'undefined' && module.exports) module.exports = BohemiaDial;


/* ---- the fight's own resolution, as one function (COMBAT_B64 V53), for anyone who stops the needle ---- */
BohemiaDial.zoneOf = function (G, W) {
  var K = BohemiaDial.K, z = W || (G && G.W) || { hZ: 0.05, vZ: 0.12, hitZ: 0.26 };
  var d = Math.abs((G && G.angle) || 0);
  if (d <= z.hZ * K.ARC_MULT) return 'kill';
  if (d <= z.vZ * K.ARC_MULT) return 'vital';
  if (d <= z.hitZ * K.ARC_MULT) return 'hit';
  return 'miss';
};
/* the resolution contract's outcome for a zone (engine/bohemia_engine.js CombatBridge.resolve reads killshot | hit | miss) */
BohemiaDial.outcomeOf = function (zone) { return zone === 'kill' ? 'killshot' : zone === 'miss' || !zone ? 'miss' : 'hit'; };

if (typeof window !== 'undefined') window.BohemiaDial = BohemiaDial;
if (typeof module !== 'undefined' && module.exports) module.exports = BohemiaDial;

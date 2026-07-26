#!/usr/bin/env python3
"""BOHEMIA - COMBAT v67: THE BEAT, THE PIN, THE TWO MOVES (Paolo 7/26/26).

Four things he called out, all of them real, all of them fixed here.

1. THE DIAL WAS NOT ON BEAT ONE, and could not be.
   The dial's sweep read `_bpmClock`, a counter accumulated per animation frame
   from the moment the page loaded. The music reads the AudioContext clock and
   restarts its 16-step bar at step 0 whenever a song starts or a faction is
   picked. Two clocks, no shared origin, and they drift apart on top of that,
   so the sweep landing on the loud hero downbeat was pure coincidence. Now the
   AUDIO IS THE CLOCK: `_seq.t0` records the AudioContext time of step 0, the
   game clock is derived from it, latency-compensated to what the EAR hears
   (the V25 ear-lock, promoted from a pulse-only trick to the whole clock).
   And cover cycles are now WHOLE BARS, so the top of the dial's cycle IS the
   downbeat instead of landing halfway through a bar forever.

2. SUPPRESS DID NOTHING, and he was right.
   The pin was `performance.now()+2200` -- a two-and-a-bit SECOND wall-clock
   timer in a TURN-BASED game. Press it, think about your move for four
   seconds, and the pin has already expired before you act. Worse, a pinned man
   was dropped from the target pool, so suppressing REMOVED your shots.
   Per the XCOM 2 model (suppression holds until your next turn, and the
   suppressed man is easier to kill, not harder to see) suppression is now
   TURN-BASED: it holds through your whole turn including the return volley,
   the pinned cannot fire and lose any bead they were holding, they STAY
   targetable with a wider dial window, they are labelled PINNED on the body,
   and the action button counts them out loud. One-turn cooldown so it is a
   window you open, not a lock you hold.

3. SPRINT COST NO STAMINA. It does now (1 pip), like every other mobility verb.

4. SPRINT AND DASH WERE THE SAME BUTTON TWICE, and both silently hijacked the
   move ring. Arming one did not disarm the other, so an armed sprint could sit
   there through a dash and fire on the NEXT tap -- "it automatically moves for
   me". They are now mutually exclusive, they auto-disarm at the end of a turn,
   and the ring SAYS which move the next tap performs. And they are finally
   different things on purpose: SPRINT is 2 tiles that ENDS YOUR TURN and eats
   the return volley; DASH is 2 tiles that costs 2 pips and does NOT end your
   turn.

Research this leans on: XCOM 2's suppression contract (aim penalty + reaction
fire, ends at the start of the suppressor's next turn, 2 ammo, no cooldown) and
standard rhythm-game clock discipline (drive gameplay from the audio clock, not
a frame counter, and compensate for output latency so what you SEE is what you
HEAR).

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

REUSE CHECK: no graphic pixels are cooked here (mechanics + HUD text only). The
PINNED body tag reuses the demo's existing status-label rail (DYING / HANDS UP
/ FLEEING) and its palette rather than introducing a new marker.

Usage: python3 tools/bohemia_combat_feel_patch.py
Gate:  node gates/combat_lab_gate.js   (section 7 sims all four headless)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V67 ONE CLOCK'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


def subn(src, old, new, want, tag):
    n = src.count(old)
    if n != want:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, n, want))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # =======================================================================
    # 1. ONE CLOCK: the beat the game runs on is the beat you HEAR
    # =======================================================================
    demo = sub1(demo,
        "let _seq={on:false,step:0,next:0,timer:null};",
        "let _seq={on:false,step:0,next:0,timer:null,t0:0};   /* V67 ONE CLOCK: t0 = the AudioContext time of step 0, the song's own beat one */",
        'seq state')

    demo = sub1(demo,
        "function startFactionLoop(){ if(!AC||_seq.on||G.musicOff||G._musMuted)return; _seq.on=true; _seq.step=0; _seq.next=AC.currentTime+0.05; _seq.timer=setInterval(seqTick,25); }",
        """function startFactionLoop(){ if(!AC||_seq.on||G.musicOff||G._musMuted)return; _seq.on=true; _seq.step=0; _seq.next=AC.currentTime+0.05; _seq.t0=_seq.next; _seq.timer=setInterval(seqTick,25); }
/* V67 ONE CLOCK: whenever the song's step counter is forced back to 0 (a new
   faction, a studio push), the beat-one anchor moves with it. Without this the
   clock keeps counting from the OLD downbeat and the dial drifts off the bar. */
function seqAnchor(){ if(AC)_seq.t0=Math.max(_seq.next,AC.currentTime); }
/* THE CLOCK ITSELF. Returns ms since the song's beat one, as HEARD (output
   latency subtracted), or null when nothing is playing -- the silent fallback
   is the old frame counter, which is fine because there is no beat to miss. */
function audioMs(){
  if(!AC||!_seq.on||!_seq.t0)return null;
  const lat=((AC.outputLatency||AC.baseLatency||0)||0);
  const t=AC.currentTime-lat-_seq.t0;
  return t>0?t*1000:0; }""",
        'start faction loop')

    demo = sub1(demo,
        "function setFaction(i){ G.faction=i; const f=FAC(); if(f){ applySlot(f, pickSongForEncounter(f)); } if(_seq.on){ _seq.step=0; } }",
        "function setFaction(i){ G.faction=i; const f=FAC(); if(f){ applySlot(f, pickSongForEncounter(f)); } if(_seq.on){ _seq.step=0; seqAnchor(); } }   /* V67 ONE CLOCK: a new song means a new beat one */",
        'setFaction anchor')

    demo = sub1(demo,
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length); if(_seq.on)_seq.step=0;",
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length); if(_seq.on){_seq.step=0;seqAnchor();}   /* V67 ONE CLOCK */",
        'pickRandomFaction anchor')

    demo = sub1(demo,
        "G.faction=m.faction; if(m.audit)G.factionShuffle=false; _seq.step=0;",
        "G.faction=m.faction; if(m.audit)G.factionShuffle=false; _seq.step=0; seqAnchor();   /* V67 ONE CLOCK */",
        'music push anchor')

    demo = sub1(demo,
        "  _bpmClock+=dt*1000;_bpmPhase=(_bpmClock%BPM_MS)/BPM_MS;",
        """  /* V67 ONE CLOCK: while the song is playing the AUDIO drives the game clock,
     so the dial's cycle, the body bob, the brass and the kick pulse all sit on
     the same downbeat the player hears. Silent = fall back to the frame count. */
  { const _am=audioMs(); if(_am!=null)_bpmClock=_am; else _bpmClock+=dt*1000; }
  _bpmPhase=(_bpmClock%BPM_MS)/BPM_MS;""",
        'master clock')

    demo = sub1(demo,
        "  const _bpmEar=_bpmClock-_lms;",
        "  const _bpmEar=(_seq.on&&_seq.t0)?_bpmClock:(_bpmClock-_lms);   /* V67 ONE CLOCK: audio-locked clock is ALREADY ear-true, never compensate twice */",
        'ear lock')

    demo = sub1(demo,
        "function cycBeats(){ const B={0:8,1:8,2:6,3:6,4:4}; return B[G.pkgDiff]!=null?B[G.pkgDiff]:8; } // easier=longer/slower cover cycle",
        """function cycBeats(){ const B={0:8,1:8,2:8,3:4,4:4}; return B[G.pkgDiff]!=null?B[G.pkgDiff]:8; }
/* V67 WHOLE BARS (Paolo: the dial has to be synced to beat one). A 6-beat cycle
   can NEVER start on a downbeat in 4/4 -- it lands on beat 1, then 3, then 1,
   forever. Every cover cycle is now a whole number of BARS (2 bars or 1 bar),
   so the top of the cycle IS beat one, every time. Cost of the fix: package 2
   slowed 6 -> 8 beats and package 3 quickened 6 -> 4. [Paolo's call if that
   rebalance is wrong -- the bar alignment is not negotiable, the split is.] */""",
        'cycle beats')

    # =======================================================================
    # 2. SUPPRESSION THAT ACTUALLY PINS
    # =======================================================================
    demo = sub1(demo,
        "function beatNow(){ return _bpmClock/BPM_MS; }",
        """/* V67 SUPPRESSION (Paolo: "if there's four enemies left and I do suppressing
   fire it doesn't seem like it does fucking anything"). He was right, and the
   reason was a clock, not a balance number: the pin was a 2.2 SECOND wall-clock
   timer in a turn-based game, so it expired while he was still deciding. A pin
   is now measured in TURNS, like everything else in this fight. */
function pinned(e){ return (e.supp||0)>0; }
function pinnedCount(){ let n=0; for(const e of G.e)if(!e.dead&&pinned(e))n++; return n; }
function beatNow(){ return _bpmClock/BPM_MS; }""",
        'pinned helper')

    # every threat filter in the file: a pinned man threatens nobody
    demo = subn(demo, "&&!e.melee&&e.stun<=0", "&&!e.melee&&!pinned(e)&&e.stun<=0", 7,
                'threat filters')
    demo = sub1(demo,
        "    if(e.dead||e.downed||e.broken||e.fleeing||e.melee||e.stun>0||e.prone>0||e.stagger>0)continue;",
        "    if(e.dead||e.downed||e.broken||e.fleeing||e.melee||pinned(e)||e.stun>0||e.prone>0||e.stagger>0)continue;   /* V67: pinned guns do not fire */",
        'enemy fire loop')

    demo = subn(demo,
        "if(e._suppr&&performance.now()<e._suppr)return false;",
        "if(pinned(e))return false;",
        2, 'suppress guards')

    # a pinned man stays SHOOTABLE (XCOM: suppression makes him easier to kill,
    # it does not make him disappear)
    demo = sub1(demo,
        "  const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));\n  if(G.engageMode==='shoot') return exposedToMe().concat(mel);\n  return G.e.filter(e=>!e.dead&&peeking(e)); }",
        """  const mel=G.e.filter(e=>!e.dead&&e.melee&&peeking(e));
  /* V67: the PINNED stay in the pool. Suppressing used to delete your own
     targets -- you pinned four men and then had nobody to shoot. A pinned man
     is head-down and helpless, which is the best moment to take him. */
  const pin=G.e.filter(e=>!e.dead&&pinned(e));
  if(G.engageMode==='shoot') return exposedToMe().concat(mel).concat(pin);
  return G.e.filter(e=>!e.dead&&(peeking(e)||pinned(e))); }""",
        'mode pool')

    demo = sub1(demo,
        """function doSuppress(){ if(G.phase!=='cover'||G.over||G.inc)return;
  if(!spendStam(1)){ setRead('NO STAMINA','suppress needs 1 pip','#8a7d66'); return; }
  audio(); let n=0; const now=performance.now();
  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    if(peeking(e)||firing(e)||e.gcov){ e._suppr=now+2200; n++; } }   /* V56: pin ~2 beats so you have time to pop the window */
  sndShot(); fxShot(); G.recoil=0.5;
  setRead('SUPPRESSING',n+' head'+(n===1?'':'s')+' down — POP NOW while they are pinned','#e8c88a');
  updateGeomCover(); renderBoard(); updGap(); }   /* the green recomputes off the pinned count -- NO turn end */""",
        """const SUPP_TURNS=1;    /* V67: holds through THIS whole turn, return volley included (the XCOM contract: until your next turn) */
const SUPP_CD=1;       /* and one turn off, so it opens a window instead of locking the fight */
function doSuppress(){ if(G.phase!=='cover'||G.over||G.inc)return;
  if((G.suppCd||0)>0){ setRead('BARREL IS HOT','suppress again next turn','#8a7d66'); return; }
  if(!spendStam(1)){ setRead('NO STAMINA','suppress needs 1 pip','#8a7d66'); return; }
  audio(); let n=0, beads=0;
  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||e.melee)continue;
    if(peeking(e)||firing(e)||e.gcov){
      e.supp=SUPP_TURNS; if((e.acq||0)>=1)beads++; e.acq=0;   /* V67: the pin BREAKS the red line he was holding */
      e._suppAt=performance.now(); n++; } }
  G.suppCd=SUPP_CD+1;   /* +1 because this turn's own end will tick it down once */
  sndShot(); fxShot(); G.recoil=0.5;
  if(!n) setRead('SUPPRESSING','nothing out to pin — the pips went nowhere','#8a7d66');
  else setRead('PINNED '+n,
    n+' gun'+(n===1?'':'s')+' down'+(beads?' — '+beads+' red line'+(beads>1?'s':'')+' broken':'')+' — POP NOW, they are easy meat',
    '#e8c88a');
  updateGeomCover(); renderBoard(); updGap(); }   /* NO turn end: the pin is the window, spending it is your move */""",
        'doSuppress')

    demo = sub1(demo,
        "function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover(); bleedTick(); grenadeTurn();\n  G.stam=Math.min(STAM_MAX,(G.stam||0)+1); updStam();   /* V54: a pip back each turn */",
        """function tickTurnEnd(){ meleeTurnRun(); updateGeomCover(); coverSeekAI(); updateGeomCover(); bleedTick(); grenadeTurn();
  G.stam=Math.min(STAM_MAX,(G.stam||0)+1); updStam();   /* V54: a pip back each turn */
  /* V67: the pin is measured in TURNS, and an armed move NEVER survives the
     turn you armed it in -- an arm that leaks into the next turn is what made
     the ring feel like it was moving him on its own. */
  for(const e of G.e){ if((e.supp||0)>0)e.supp--; }
  if((G.suppCd||0)>0)G.suppCd--;
  if(G.sprintArm||G.dashArm){ G.sprintArm=false; G.dashArm=false; updMoveMode(); }""",
        'tickTurnEnd')

    # PINNED reads on the body, on the same rail as DYING / HANDS UP / FLEEING
    demo = sub1(demo,
        "        :e.downed?'\u25bc DYING':e.broken?'HANDS UP':e.fleeing?'FLEEING'",
        "        :e.downed?'\u25bc DYING':e.broken?'HANDS UP':e.fleeing?'FLEEING':pinned(e)?'PINNED'",
        'body status tag')

    # a pinned target is EASY MEAT: the dial window opens up on him
    demo = sub1(demo,
        "  const hz=z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*(G.inFU?1.18:1)*(G.execWindow?1.35:1), vz=z.vZ*ARC_MULT*fg*KILL_GRACE*_ww*(G.inFU?1.18:1), hitz=z.hitZ*ARC_MULT*fg*_ww*(G.inFU?1.18:1);\n  const tgt=G.e[G.fireTarget]; if(!tgt){ return; }",
        """  const _pinW=(G.e[G.fireTarget]&&pinned(G.e[G.fireTarget]))?1.35:1;   /* V67: suppression's real payoff — a pinned man is a WIDE window, not a vanished target */
  const hz=z.hZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*(G.inFU?1.18:1)*(G.execWindow?1.35:1), vz=z.vZ*ARC_MULT*fg*KILL_GRACE*_ww*_pinW*(G.inFU?1.18:1), hitz=z.hitZ*ARC_MULT*fg*_ww*_pinW*(G.inFU?1.18:1);
  const tgt=G.e[G.fireTarget]; if(!tgt){ return; }""",
        'pinned dial window')

    # the action button says it out loud
    demo = sub1(demo,
        "  if(fb){\n    const wash=green?",
        """  /* V67: SAY IT ON THE BUTTON. He pressed suppress and the button never
     changed, so the pin may as well not have happened. */
  { const _pn=pinnedCount();
    if(_pn>0&&txt!=='SHOOT')txt=txt+' \\u00b7 '+_pn+' PINNED'; }
  if(fb){
    const wash=green?""",
        'button pinned count')

    # =======================================================================
    # 3+4. SPRINT AND DASH: two different moves, and the ring says which
    # =======================================================================
    # STAMINA THAT IS ACTUALLY SPENT. A pip cost that the same turn's +1 regen
    # hands straight back is not a cost, it is a rounding error -- press sprint,
    # end the turn, pips unchanged. The refill is now the reward for a turn you
    # did NOT spend a pip on. [Tuning is Paolo's call; the economy existing is not.]
    demo = sub1(demo,
        "function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; updStam(); return true; }",
        "function spendStam(n){ if((G.stam||0)<n)return false; G.stam-=n; G._stamSpent=true; updStam(); return true; }   /* V67: mark the turn as spent */",
        'spendStam mark')

    demo = sub1(demo,
        "  G.stam=Math.min(STAM_MAX,(G.stam||0)+1); updStam();   /* V54: a pip back each turn */",
        """  /* V54 + V67: a pip back for a turn you spent NOTHING on. The old
     unconditional refill cancelled every cost in the same turn it was paid. */
  if(!G._stamSpent)G.stam=Math.min(STAM_MAX,(G.stam||0)+1);
  G._stamSpent=false; updStam();""",
        'stamina regen')

    demo = sub1(demo,
        "  const _sprinting=!!G.sprintArm;   /* V44 SPRINT: consumed by this move regardless of outcome below */",
        """  const _sprinting=!!G.sprintArm;   /* V44 SPRINT: consumed by this move regardless of outcome below */
  /* V67 SPRINT COSTS STAMINA (Paolo: "sprint should be using up stamina
     points"). Every other mobility verb pays; this one was free. */
  if(_sprinting&&(G.stam||0)<1){ setRead('NO STAMINA','sprint needs 1 pip','#8a7d66'); return; }""",
        'sprint stamina check')

    demo = sub1(demo,
        "  if(_sprinting){ G.sprintArm=false; const _sb=D('sprintbtn'); if(_sb){_sb.textContent='SPRINT: OFF';_sb.classList.remove('on');} }   /* V44: one use per arm */",
        "  if(_sprinting){ spendStam(1); G.sprintArm=false; updMoveMode(); }   /* V44: one use per arm. V67: and it costs a pip */",
        'sprint consume')

    demo = sub1(demo,
        """function doDash(){ if(G.phase!=='cover'||G.over||G.inc)return;   /* V56: DASH ARMS -- YOU pick the direction on the ring, no auto-placed spot */
  if((G.stam||0)<2){ setRead('NO STAMINA','dash needs 2 pips','#8a7d66'); return; }
  G.dashArm=!G.dashArm; const b=D('dashbtn'); if(b)b.classList.toggle('on',G.dashArm);
  setRead(G.dashArm?'DASH ARMED':'DASH OFF', G.dashArm?'tap a direction on the ring — 2 tiles that way, breaks locks':'dash disarmed','#c0d0e8'); }""",
        """/* V67 ONE ARMED MOVE AT A TIME (Paolo: "I don't know what the difference
   between sprint and dashes... when I press Dash it like automatically moves
   for me"). Two buttons were arming the SAME ring and neither disarmed the
   other, so an armed sprint could sit through a dash and fire on the next tap.
   Now arming one always disarms the other, the ring SAYS which move the next
   tap performs, and an arm never survives the turn.
     SPRINT = 2 tiles, 1 pip, ENDS YOUR TURN, they shoot back.
     DASH   = 2 tiles, 2 pips, FREE (turn continues), breaks their locks. */
function updMoveMode(){
  const sb=D('sprintbtn'), db=D('dashbtn'), lbl=D('movemode');
  if(sb){ sb.textContent='SPRINT: '+(G.sprintArm?'ARMED':'OFF'); sb.classList.toggle('on',!!G.sprintArm); }
  if(db){ db.textContent='DASH'+(G.dashArm?': ARMED':''); db.classList.toggle('on',!!G.dashArm); }
  if(lbl){
    const on=G.sprintArm?'SPRINT \\u00b7 2 TILES \\u00b7 ENDS TURN':(G.dashArm?'DASH \\u00b7 2 TILES \\u00b7 FREE MOVE':'');
    lbl.textContent=on; lbl.style.display=on?'block':'none';
    lbl.style.color=G.sprintArm?'#e8593a':'#c0d0e8'; } }
function doDash(){ if(G.phase!=='cover'||G.over||G.inc)return;   /* V56: DASH ARMS -- YOU pick the direction on the ring, no auto-placed spot */
  if((G.stam||0)<2){ setRead('NO STAMINA','dash needs 2 pips','#8a7d66'); return; }
  G.dashArm=!G.dashArm; if(G.dashArm)G.sprintArm=false;   /* V67: never two armed moves */
  updMoveMode();
  setRead(G.dashArm?'DASH ARMED':'DASH OFF', G.dashArm?'tap a direction on the ring — 2 tiles, 2 pips, your turn KEEPS going':'dash disarmed','#c0d0e8'); }""",
        'doDash')

    demo = sub1(demo,
        """D('sprintbtn').addEventListener('click',()=>{ G.sprintArm=!G.sprintArm;   /* V44 SPRINT */
  D('sprintbtn').textContent='SPRINT: '+(G.sprintArm?'ARMED':'OFF'); D('sprintbtn').classList.toggle('on',G.sprintArm);
  setRead(G.sprintArm?'SPRINT ARMED':'SPRINT OFF',G.sprintArm?'next move covers two tiles — breaks cover for real':'back to a normal tucked move',G.sprintArm?'#e8593a':'#8a7d66'); });""",
        """D('sprintbtn').addEventListener('click',()=>{ G.sprintArm=!G.sprintArm;   /* V44 SPRINT */
  if(G.sprintArm)G.dashArm=false;   /* V67: never two armed moves */
  updMoveMode();
  setRead(G.sprintArm?'SPRINT ARMED':'SPRINT OFF',
    G.sprintArm?'next ring tap runs TWO tiles — 1 pip, and it ENDS YOUR TURN in the open':'back to a normal one-tile step',
    G.sprintArm?'#e8593a':'#8a7d66'); });""",
        'sprint button')

    # the ring itself says what the next tap does
    demo = sub1(demo,
        "  document.body.appendChild(wrap);\n})();",
        """  /* V67: the armed move reads ON THE RING, where the tap happens. */
  const mm=document.createElement('div'); mm.id='movemode';
  mm.style.cssText='position:fixed;left:8px;right:8px;bottom:152px;text-align:center;font-size:10px;letter-spacing:1px;font-weight:700;display:none;pointer-events:none;z-index:60;text-shadow:0 1px 5px #000,0 0 10px #000';
  wrap.appendChild(mm);
  document.body.appendChild(wrap);
})();""",
        'ring mode label')

    demo = sub1(demo,
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G._oneStreak=0;",
        "  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._oneStreak=0;",  # V67: fresh fight, nothing armed, no hot barrel
        'fresh fight reset')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, +%d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()

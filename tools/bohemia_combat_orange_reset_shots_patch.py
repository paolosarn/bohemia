#!/usr/bin/env python3
"""V107: THE ORANGE, ONE RESET, AND TWO REPORTS.

Three of Paolo's T7 notes, all in the same file, none of them a new feature.

--------------------------------------------------------------------------
1. THE ORANGE GOLD THING (his SIXTH report of it)
--------------------------------------------------------------------------
"when I hit someone with the killshot that dead shot dial like orange gold
thing still is not going away like what's wrong with you I thought we handled
that"

I had fixed this twice and been wrong twice, because both times I GUESSED at
which drawing it was. This time the canvas was instrumented: every fill /
stroke / fillRect / fillText wrapped, recording colour, call count and stack,
filtered to frames where G.ks is live. One run of one killshot:

    stroke(path) rgb(202,160,122)   calls: 1008   at drawArmNeedle -> at draw
    fill(path)   rgb(255,200,70)    calls:  184   at screenOverlays -> at draw

#caa07a is the needle arm's warm tan-gold, and it is not one arm: the GHOST
FAN draws EIGHT fading copies of the needle every frame, and it was never
gated on anything. So the moment the needle locks to the firing angle for the
cinematic, eight warm ghosts weld themselves around it and sit there, at
their brightest, for the whole kill. That is the orange.

AND THE REAL LESSON IS THE FAMILY, NOT THE MEMBER. The dial's ornaments keep
surviving into the cinematic one at a time: v87 gated the chain-escalation
glow, v94 deleted the hand-painted median, v85 held the ghost chip through the
freeze. Three fixes, three separate turns, same bug. So this does not gate one
loop -- it names the rule (dialOrnament()) and puts EVERY warm dial ornament
behind it, so the next one is a one-line answer instead of a seventh report.

THE RULE: while the kill is playing, the dial wears nothing. The needle, the
target and the bullet are the only things allowed on screen.

--------------------------------------------------------------------------
2. THE GRENADE THAT SURVIVED THE FIGHT -- and his bigger point
--------------------------------------------------------------------------
"I had a grenade set to explode. I had one turn left, but then all the enemies
I either killed or they gave up and then combat ended... and then even when I
press a new encounter the grenade it just stuck, saying one turn until it
explodes it's very confusing. I'm just so confused the type of transition you
have between combat mode and non-combat mode"

Confirmed by reading, not guessed. The reset

    G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;

lives in setupCombat(). newEncounter() DOES NOT CALL setupCombat() -- it calls
setupEnemies(); buildBoard(); updPlayer() directly and resets its own inline
list of about a dozen fields. That list never included the grenade, because
the grenade was added in v99 and the list was written long before it.

HIS SENTENCE IS THE ACTUAL FINDING. He is not describing one stuck object; he
is describing TWO RESET PATHS that clean up different things, where every new
mechanic has to remember to be added to both and one of them is always
forgotten. The grenade is just the one that showed itself.

So the fix is not a third place to forget. resetFightState() is the ONE reset
and both doors call it. HP is deliberately not in it: newEncounter carries HP
over, and that is a ruling, not an oversight.

--------------------------------------------------------------------------
3. TWO SHOTS SHOULD BE TWO GUNSHOTS
--------------------------------------------------------------------------
"when you do two shots for the killshot cause sometimes I send out two shots.
I need to hear like two gunshot noises do you understand"

The double tap already called sndShot() twice. The gap was 90ms and both
reports were the IDENTICAL two-oscillator voice, so the second landed inside
the first one's 100ms decay, on the same frequencies, and summed into one
fatter bang instead of reading as two. He was hearing exactly what the code
produced; the code was wrong about what a double tap sounds like.
Now: 165ms apart (a real controlled pair is 150-250ms) and the second report
is its own voice -- detuned down, shorter, drier, the way a second round out
of a settling gun actually reads. Two events, not one smear.

REUSE CHECK: this patch cooks NO graphic pixels at all, so no bank supplies
anything and none is opened. It gates two existing draw loops behind a named
predicate, merges two existing reset lists into one, and adds ONE synthesised
audio voice built from the demo's own tone() oscillator primitive -- the same
generator sndShot has used since the first build, not a sample and not a file.
Nothing here is art, so there is nothing to reuse and nothing to cook.
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V107 THE KILL WEARS NOTHING'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')

    if MARK in s:
        print('v107 already in; nothing to do')
        return

    # ---- 1A. the named rule -------------------------------------------
    old = """function sndShot(){ tone(180,0.08,0.10,'sawtooth'); tone(90,0.10,0.08,'sine'); }"""
    new = """function sndShot(){ tone(180,0.08,0.10,'sawtooth'); tone(90,0.10,0.08,'sine'); }
/* V107 SECOND REPORT. Not sndShot() again: two identical voices 90ms apart
   sum into one fatter bang, which is precisely what he heard. Lower, shorter,
   drier -- a second round out of a gun that is still settling. */
function sndShot2(){ tone(152,0.06,0.095,'sawtooth'); tone(76,0.075,0.075,'sine'); }
/* ===== V107 THE KILL WEARS NOTHING ==================================
   THE RULE, named once so it stops being re-fixed one drawing at a time:
   while the killshot cinematic is playing, the dial wears NO ornament. No
   ghost fans, no trails, no echoes. The needle, the target and the bullet.
   Every warm dial ornament asks this function, so the day a new one is added
   it either asks and is correct, or it does not and the combat gate says so. */
function dialOrnament(){ return !G.ks; }"""
    s = subN(s, old, new)

    # ---- 1B. THE GHOST FAN: the 1008 tan-gold strokes ------------------
    old = """  const ARML=Math.min(W,H)*0.085*(G._zb||2)*1.05;   /* one arm ≈ one board tile at the current zoom */
  for(let i=8;i>=1;i--){
    const ga=base + G.angleTrail(i);
    drawArmNeedle(ctx,cx,cy,ga,ARML,0.045*i/8);
  }"""
    new = """  const ARML=Math.min(W,H)*0.085*(G._zb||2)*1.05;   /* one arm ≈ one board tile at the current zoom */
  /* V107: MEASURED AT 1008 STROKES OF rgb(202,160,122) DURING ONE KILLSHOT.
     Eight warm ghost arms, every frame, welded around the locked needle for
     the whole cinematic. This is the orange gold thing, six reports running. */
  if(dialOrnament())for(let i=8;i>=1;i--){
    const ga=base + G.angleTrail(i);
    drawArmNeedle(ctx,cx,cy,ga,ARML,0.045*i/8);
  }"""
    s = subN(s, old, new)

    # ---- 1C. the RETICLE ghost fan: same family, never reported -------
    old = """  for(let i=6;i>=1;i--){
    const ga=base+G.angleTrail(i*1.2);
    const rx=cx+Math.cos(ga)*RAD*0.92, ry=cy+Math.sin(ga)*RAD*0.92;
    ctx.strokeStyle='rgba('+ghostRGB(G._greedT||0)+','+(0.007*i)+')';ctx.lineWidth=1.2*S;
    ctx.beginPath();ctx.arc(rx,ry,3*S,0,7);ctx.stroke();
  }"""
    new = """  /* V107: the SAME family, swept rather than waited for. At full greed
     ghostRGB(1) is rgb(255,200,70) -- literally orange-gold, six echoes,
     ungated, and nobody had reported it yet only because the arm fan was
     louder. Fixing one member and waiting for the next report is the mistake
     this sweep exists to end. */
  if(dialOrnament())for(let i=6;i>=1;i--){
    const ga=base+G.angleTrail(i*1.2);
    const rx=cx+Math.cos(ga)*RAD*0.92, ry=cy+Math.sin(ga)*RAD*0.92;
    ctx.strokeStyle='rgba('+ghostRGB(G._greedT||0)+','+(0.007*i)+')';ctx.lineWidth=1.2*S;
    ctx.beginPath();ctx.arc(rx,ry,3*S,0,7);ctx.stroke();
  }"""
    s = subN(s, old, new)

    # ---- 1D. the needle trail already asked !G.ks: make it ask BY NAME -
    old = """  if(JUICE.AL&&!G.ks){ G._trail=G._trail||[]; const _tn=performance.now();"""
    new = """  if(JUICE.AL&&dialOrnament()){ G._trail=G._trail||[]; const _tn=performance.now();"""
    s = subN(s, old, new)

    # ---- 2. ONE RESET, CALLED BY BOTH DOORS ---------------------------
    old = """function fullResetCombat(){ camHome();"""
    new = """/* ===== V107 ONE RESET, CALLED BY BOTH DOORS =========================
   Paolo 7/31: "I'm just so confused the type of transition you have between
   combat mode and non-combat mode."
   He is right, and the grenade that survived his fight AND survived NEW
   ENCOUNTER is the proof. setupCombat() cleared it; newEncounter() never
   called setupCombat() and kept its own inline list that predates the
   grenade by a hundred versions.
   EVERY PER-FIGHT FIELD LIVES HERE NOW, and both doors call it, so a new
   mechanic gets cleaned up in one place instead of two-minus-one.
   pHP IS DELIBERATELY ABSENT: a new encounter carries your HP over, which is
   a ruling. fullResetCombat is the one that heals you. */
function resetFightState(){
  G.over=false; G.win=false; G.inFU=false; G.execWindow=false; G.ks=null; G.frozen=false;
  G.killStreak=0; G.popTarget=-1; G.fireTarget=-1;
  G.inc=null; G._walkout=null; G.woundShake=0; G._redPunch=0;
  G.steady=0; G._steadyAtPop=0; G._poppedOut=false; G._chainN=1; G._chainWait=false;
  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0;
  G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0;
  G.groove=0; G._oneStreak=0; G._endSent=false;
  G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;   /* THEIRS */
  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;    /* YOURS -- the one he caught */
  G.wager='none'; G.wagerLocked=false; G.wagerFail=false;
  G.coverHoles=[]; G.litter=[]; G.lvl=0;
  G.rc={shots:0,hits:0,kills:0,greedCashed:0,greedWasted:0,best:999,peak:0};
  /* V54 MOBILITY TOOLKIT: full stamina, full body, fresh fight. V56: never carry
     an armed dash. V58: fresh on-beat streak. V59: fresh end-guard. V60: no live
     grenade. V90B: every fight starts on the lot. V99: fresh pouch. V104: never
     armed. -- the history of this list, kept with the list. */
  try{updWagerBtn();}catch(_e){} try{updGrenBtn();}catch(_e){} try{updStam();}catch(_e){}
}
function fullResetCombat(){ camHome();"""
    s = subN(s, old, new)

    # setupCombat delegates
    old = """  G.rc={shots:0,hits:0,kills:0,greedCashed:0,greedWasted:0,best:999,peak:0}; G.steady=0; G._steadyAtPop=0;
  G.woundShake=0; G._redPunch=0; G.inc=null; G._walkout=null;   /* a new fight starts STILL */
  G.wager='none'; G.wagerLocked=false; G.wagerFail=false; updWagerBtn();
  G.coverHoles=[];   /* Y: a new fight, clean cover */
  G.stam=STAM_MAX; G.handPeek=false; G.dashArm=false; G.sprintArm=false; G.suppCd=0; G._fireReq=null; G._grades=[]; G._lastGrade=null; G._pressBeat=null; G._perfects=0; G.groove=0; G._oneStreak=0; G._endSent=false; G.grenade=null; G._grenadeBlast=null; G._grenadeThrown=false;
  G.pGren=null; G.pGrenLeft=P_GREN_PER_FIGHT; G.grenArm=false;   /* V99: fresh fight, fresh pouch. V104: never armed */
  try{updGrenBtn();}catch(_e){}
  updStam();   /* V54 MOBILITY TOOLKIT: full stamina, full body, fresh fight. V56: never carry an armed dash. V58: fresh on-beat streak. V59: fresh end-guard. V60: no live grenade */
  G.litter=[];       /* AF: fresh ground */
  G.lvl=0;           /* V90B: every fight starts on the lot */"""
    new = """  resetFightState();   /* V107: the ONE reset. Everything that used to be
     spelled out here by hand now lives in it, so newEncounter gets the exact
     same clean slate this door gets. */"""
    s = subN(s, old, new)

    # newEncounter delegates
    old = """  camHome(); G.over=false; G.win=false; G.inFU=false; G.execWindow=false; G.ks=null; G.frozen=false; resetBeat();
  G.killStreak=0; G.popTarget=-1; G.fireTarget=-1;"""
    new = """  camHome(); resetFightState(); resetBeat();   /* V107: the SAME reset the
     first fight gets. His live grenade used to walk straight through here. */"""
    s = subN(s, old, new)

    # ---- 3. TWO REPORTS -----------------------------------------------
    old = """  if(dbl)setTimeout(()=>{try{sndShot();fxShot();G.recoil=Math.max(G.recoil,0.7);flash=Math.max(flash,0.55);if(navigator.vibrate)navigator.vibrate(12);}catch(_e){}},90);"""
    new = """  /* V107 TWO SHOTS, TWO GUNSHOTS (Paolo 7/31). 90ms of gap with the
     IDENTICAL voice put the second report inside the first one's decay, on
     the same two frequencies, and they summed into one fatter bang. A real
     controlled pair is 150-250ms and the second round comes out of a gun
     that has already moved, so it is lower and drier. Both fixed. */
  if(dbl)setTimeout(()=>{try{sndShot2();fxShot();G.recoil=Math.max(G.recoil,0.7);flash=Math.max(flash,0.55);if(navigator.vibrate)navigator.vibrate(12);}catch(_e){}},165);"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v107: orange swept, one reset, two reports (%d chars)' % len(s))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""V138 THE BOARD IS A GUNFIGHT, NOT A PARKING SPACE.

Paolo 8/11: "the map has to be wayy bigger... the enemies being close together
when the gun range is like this is so fucking ass. Like imagine different guns
have different ranges and this influence the mobility on the map. There should
be a maximum range and different gun behaviors. We need wayyyyy more movement in
the combat rn."

--------------------------------------------------------------------------
HE IS DESCRIBING THREE SYMPTOMS OF ONE MISSING NUMBER
--------------------------------------------------------------------------
MEASURED IN THE FILE BEFORE TOUCHING IT:

  * Every man spawns between 6.5 and 14.5 tiles out. A tile is 1.5m, so the
    entire fight happens inside TEN TO TWENTY-TWO METRES. That is a parking
    space with people in it, not a gunfight.
  * The visible board is a 10-tile radius (pitch 0.085 against rMax 0.85), so a
    man spawned at 14.5 tiles is OFF SCREEN. The board was smaller than the
    spawn band it was drawing.
  * *** THERE IS NO PER-WEAPON RANGE ANYWHERE IN THIS GAME. *** WEAPON_LETHAL,
    WEAPON_CAP, WEAPON_WIDTH and WEAPON_ID all exist. Range does not. distT runs
    ONE global curve off FAR_TILE=26 for a pistol, a shotgun, an SMG, a rifle and
    a sniper alike, and MAX_RANGE=42 was a number nothing ever reached because
    nobody ever spawned past 16.

So a pistol and a rifle were the same gun with different dial widths, and no
distance on the board ever forbade a shot. With no range there is nothing to
close and nothing to break, which is exactly why he is asking for movement.

--------------------------------------------------------------------------
THE RESEARCH, AND WHAT I DID WITH IT
--------------------------------------------------------------------------
Real numbers (sources in the record):
  handgun   effective ~50yd/46m, but real fights happen at 3-7 YARDS
  shotgun   buckshot 30-50yd; pattern opens roughly an inch per yard (the old
            rule; modern wads are tighter, which is why spread is a DIAL here)
  SMG/PCC   100-150yd, combat hits reported to 300yd
  carbine   excellent at 100m, military effective 300-600m
  sniper    600m+

THOSE NUMBERS CANNOT GO IN RAW and I am not pretending otherwise: a pistol's
46m is 30 tiles, which is already bigger than the whole board, and a rifle's
600m is 400 tiles. Put them in literally and every gun is unlimited again, which
is the bug wearing a lab coat.

WHAT SURVIVES THE TRANSLATION IS THE SHAPE, AND THE SHAPE IS THE POINT:
  1. the ORDER never changes: shotgun < pistol < SMG < rifle < sniper
  2. the RATIOS stay roughly true (a rifle reaches ~3x a pistol, a sniper ~2x
     a rifle)
  3. every gun gets TWO numbers, because that is how guns actually work:
     EFF = inside this he shoots to his full ability
     MAX = past this HE CANNOT FIRE AT ALL. Not "less accurate". Cannot.
  4. the pistol's EFF is built on the FIGHT distance (3-7yd), not the ballistic
     one, because that is the honest number for a street

MAX RANGE IS THE WHOLE FEATURE. An accuracy taper that never reaches zero is
just a worse hit chance, and a worse hit chance has never made anybody walk
anywhere. A hard wall makes the board legible: there is a distance where your
gun is a brick and his is not, and the only answer is your feet.

--------------------------------------------------------------------------
AND IT CUTS BOTH WAYS, WHICH IS WHERE THE MOVEMENT COMES FROM
--------------------------------------------------------------------------
distT was doing two different jobs with one function: MY shot at him, and HIS
shot at me. It read the same global curve for both. Now:
  distT(e)      = MY shot, on MY weapon's range
  distTFrom(e)  = HIS shot, on HIS weapon's range
So a goon with a pistol at 20 tiles is holding a brick and you can walk him
down. A SEC-BOT with a rifle at 30 tiles can hit you when nothing you own can
answer, and standing there is simply losing. THE PRESSURE IS SYMMETRIC and the
answer to both halves is the same: move.

--------------------------------------------------------------------------
THE BOARD GETS BIG ENOUGH TO HOLD IT
--------------------------------------------------------------------------
Ranges mean nothing on a board where everything is already in range, so the
spawn band opens to 6-26 tiles (9-39m) with the sniper out past that, and the
tile pitch drops so the field you can SEE covers what the guns can reach. The
pitch is ONE constant (FIELD_PITCH) used everywhere the board scale is derived,
so the zoom is a single dial rather than five numbers that can drift apart.

MAP LAW HELD: this authors no layout and names no arena. Spawn distance and
board scale are parameters, exactly like the density and clumping the arena dice
already roll. Which arenas are canon is still only his call.

REUSE CHECK: cooks NO graphic pixels. It reuses distT, distAccuracy, rangeTier,
pXY and the existing WEAPON_* tables, and adds range as the missing member of a
family of weapon tables that already existed. No bank is opened because no art
is authored.

TASTE CHECK: authors no art. The taste risk here is REAL and it is the zoom: a
board zoomed too far out is a screen of ants, and he has rejected ugly twice
this month. So the pitch ships as one constant, rendered and LOOKED AT on the
real canvas at several values before one is chosen -- never picked from arithmetic.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. Bodies scale with the board pitch exactly as
  they already did.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V138 THE BOARD IS A GUNFIGHT'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")

# the one dial the whole board scale hangs off. 0.085 was a 10-tile radius.
FIELD_PITCH = '0.038'   # CHOSEN BY LOOKING, not arithmetic: rendered at 0.085/0.050/0.038 on the real
                        # canvas and compared. 0.085 could not even show the spawn band; 0.038 shows the
                        # whole street with the bodies still readable. --pitch= re-runs the look test.


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    pitch = FIELD_PITCH
    for a in sys.argv[1:]:
        if a.startswith('--pitch='):
            pitch = a.split('=', 1)[1]

    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        # the look test re-runs this with a different pitch: just move the dial
        js = re.sub(r'const FIELD_PITCH=[0-9.]+;', 'const FIELD_PITCH=%s;' % pitch, js)
        enc = base64.b64encode(js.encode()).decode()
        ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
        print('v138 already in; pitch set to %s' % pitch)
        return

    # ---- 1. RANGE, THE WEAPON TABLE THAT NEVER EXISTED ------------------
    old = """// ---- DISTANCE & POINT BLANK ----
const PT_BLANK=4, FAR_TILE=26, MAX_RANGE=42;   // tiles (~1.5m each): <=4 point blank (~6m); 26 = long range (~40m); 42 = back of the lot (~63m)"""
    new = """// ---- DISTANCE & POINT BLANK ----
const PT_BLANK=4, FAR_TILE=26, MAX_RANGE=64;   // tiles (~1.5m each): <=4 point blank (~6m); 26 = long range (~40m). V138: MAX_RANGE 42 -> 64, because a sniper now really does sit out there
/* ===== V138 THE BOARD IS A GUNFIGHT, NOT A PARKING SPACE ==========
   Paolo 8/11: "the map has to be wayy bigger... imagine different guns have
   different ranges and this influence the mobility on the map. There should be
   a maximum range and different gun behaviors. We need wayyyyy more movement."
   *** THERE WAS NO PER-WEAPON RANGE ANYWHERE IN THIS GAME. *** WEAPON_LETHAL,
   WEAPON_CAP, WEAPON_WIDTH and WEAPON_ID all existed; range did not. distT ran
   ONE global curve off FAR_TILE for a pistol, a shotgun, an SMG, a rifle and a
   sniper alike, so a pistol and a rifle were the same gun with different dial
   widths, and no distance on the board ever forbade a shot.
   THE RESEARCH: handgun effective ~50yd but FOUGHT at 3-7yd; buckshot 30-50yd
   with the pattern opening about an inch a yard; SMG/PCC 100-150yd; carbine
   excellent at 100m and military-effective 300-600m; sniper 600m+.
   THOSE CANNOT GO IN RAW and this does not pretend otherwise -- a pistol's 46m
   is 30 tiles, already bigger than the board, and a rifle's 600m is 400. Put
   them in literally and every gun is unlimited again, which is the bug wearing
   a lab coat. WHAT SURVIVES IS THE SHAPE: the order never changes, the ratios
   stay roughly true (rifle ~3x pistol, sniper ~2x rifle), and the pistol's
   number is built on the FIGHT distance because that is the honest one.
   *** MAX IS THE WHOLE FEATURE. *** Past MAX the gun CANNOT FIRE. Not "less
   accurate" -- an accuracy taper that never reaches zero is just a worse hit
   chance, and a worse hit chance has never made anybody walk anywhere. A hard
   wall makes the board legible: there is a distance where your gun is a brick
   and his is not, and the only answer is your feet. All DIALS. */
const WEAPON_RANGE={
  shotgun:{eff:5,  max:14},   /* buckshot 30-50yd, and the pattern is open long before that */
  pistol :{eff:6,  max:16},   /* EFF is the FIGHT distance (3-7yd), not the 50yd ballistic one */
  smg    :{eff:10, max:26},   /* pistol-calibre carbine: reaches, but it is not a rifle */
  rifle  :{eff:20, max:44}    /* excellent at 100m; on this board it simply outranges everything you own */
};
const ARCH_WEAPON={human:'pistol',bot:'rifle',sniper:'sniper'};   /* who is carrying what */
const SNIPER_RANGE={eff:30,max:64};   /* 600m+: he is the reason the board is this big */
function wpnRange(w){ return (w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol); }
function myRange(){ return wpnRange(typeof WEAPON!=='undefined'?WEAPON:'pistol'); }
function foeRange(e){ return wpnRange((e&&ARCH_WEAPON[e.arch])||'pistol'); }
/* ===== V98 GETS STRONGER HERE, NOT WEAKER ==========================
   THE DARK SHRINKS THE RANGE (Paolo 7/29, approved) used to run through ONE
   shared far end, farTile(), because there was only ever one range in the game.
   Now that every gun has its own, night scales EVERY ONE of them by the same
   NIGHT_RANGE number -- so a shotgun's reach shortens after dark too, which the
   single shared far end could never express. Same law, more of it.
   AND POINT BLANK IS STILL EXACTLY UNTOUCHED: rangeT subtracts PT_BLANK before
   dividing, so it is 0 for any d <= PT_BLANK whatever the far end is, and MAX
   can never fall below point blank either. His 7/27 ruling gets LOUDER after
   dark instead of taxed flat, exactly as V98 promised. */
function maxRange(R){ return Math.max(PT_BLANK+2, R.max*rangeMult()); }
/* CAN THIS SHOT EVEN HAPPEN. Both directions, same rule, no exceptions. */
function inMyRange(e){ return !!e && (e.edist||0) <= maxRange(myRange()); }
function inHisRange(e){ return !!e && (e.edist||0) <= maxRange(foeRange(e)); }"""
    js = subN(js, old, new)

    # ---- 2. distT SPLITS: my shot on my gun, his shot on his -------------
    old = """function distT(e){ const d=Math.max(1,e.edist||10); const F=farTile();
  return Math.min(1,Math.max(0,(d-PT_BLANK)/(F-PT_BLANK))); }"""
    new = """/* V138: distT was doing TWO different jobs with ONE curve -- my shot at him and
   his shot at me -- which is exactly how five weapons ended up sharing one
   range. Now it is two functions and each reads the right gun.
   distT stays MY shot (my dial, my range words) so every existing caller keeps
   meaning what it meant; distTFrom is HIS. */
function rangeT(d,R){ const F=Math.max(PT_BLANK+2,R.eff*1.6*rangeMult());   /* V98 scales every gun now, not one shared far end */
  d=Math.max(1,d);
  return Math.min(1,Math.max(0,(d-PT_BLANK)/(F-PT_BLANK))); }
function distT(e){ return rangeT(e.edist||10,myRange()); }
function distTFrom(e){ return rangeT(e.edist||10,foeRange(e)); }"""
    js = subN(js, old, new)

    # ---- 3. THEIR accuracy reads THEIR gun, and dies past their max ------
    old = """function distAccuracy(e){ const base=0.97 - distT(e)*0.60;     // point blank ~.97, far ~.37 (they rarely miss up close)
  return 1-(1-base)/threatMult(); }      // V121: difficulty divides the MISS, so it is bounded and every tier is distinct"""
    new = """function distAccuracy(e){
  if(!inHisRange(e))return 0;   /* V138: past HIS max the gun is a brick. Not a penalty -- zero. */
  const base=0.97 - distTFrom(e)*0.60;     // point blank ~.97, far ~.37 (they rarely miss up close)
  return 1-(1-base)/threatMult(); }      // V121: difficulty divides the MISS, so it is bounded and every tier is distinct"""
    js = subN(js, old, new)

    # ---- 4. ONE CONSTANT FOR THE BOARD SCALE ----------------------------
    old = """function fieldPos(e,W,H,cx,cy){ const ring=Math.min(W,H)*0.085, rMin=ring*1.8, rMax=Math.min(W,H)*0.85;"""
    new = """/* V138: the board scale was five copies of 0.085 scattered through the draw,
   which is five numbers that can drift apart and a zoom nobody can change in
   one place. It is ONE dial now. 0.085 drew a 10-tile radius, which was SMALLER
   than the 14.5-tile spawn band it was drawing -- men were spawning off screen. */
const FIELD_PITCH=%(pitch)s;
function fieldPos(e,W,H,cx,cy){ const ring=Math.min(W,H)*FIELD_PITCH, rMin=ring*1.8, rMax=Math.min(W,H)*0.85;""" % {'pitch': pitch}
    js = subN(js, old, new)

    js = subN(js, """  const ring=Math.min(W,H)*0.085;                      // 3x3 cell pitch (tap-friendly)""",
                  """  const ring=Math.min(W,H)*FIELD_PITCH;                      // 3x3 cell pitch (tap-friendly)""")
    js = subN(js, """      const ringF=Math.min(W,H)*0.085; let md=0;""",
                  """      const ringF=Math.min(W,H)*FIELD_PITCH; let md=0;""")
    js = subN(js, """    const ring0=Math.min(W,H)*0.085; const tgtE=G.e[G.fireTarget];""",
                  """    const ring0=Math.min(W,H)*FIELD_PITCH; const tgtE=G.e[G.fireTarget];""")
    js = subN(js, """  const ARML=Math.min(W,H)*0.085*(G._zb||2)*1.05;""",
                  """  const ARML=Math.min(W,H)*FIELD_PITCH*(G._zb||2)*1.05;""")

    # ---- 5. THE BOARD GETS BIG ENOUGH TO HOLD THE RANGES -----------------
    old = """    e.edist = (i===sniperIdx) ? (PT_BLANK+9.5)+Math.random()*3         // V39: always the farthest gun on the board, still inside the supported range
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : (PT_BLANK+2.5)+Math.random()*8; // GRID TRUE V7: the fight lives on the visible board (~6.5-14.5 tiles); long-range returns with the world model"""
    new = """    /* V138 THE SPAWN BAND OPENS. It was 6.5-14.5 tiles: 10 to 22 METRES, a
       parking space with people in it, and it made every weapon range moot
       because everything spawned inside every gun's reach. Ranges are worthless
       on a board where everybody is already in range. MAP LAW held -- spawn
       distance is a parameter on the arena dice exactly like density. */
    e.edist = (i===sniperIdx) ? 30+Math.random()*10                            // V138: a 600m rifle sits where nothing you own can answer
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : 6+Math.random()*20;                             // V138: 6-26 tiles (9-39m) -- a real street, and most of it out of pistol reach"""
    js = subN(js, old, new)

    # ---- 6. THE ARENA SCALES WITH THE BOARD ------------------------------
    # MEASURED before changing it: cover scattered at 2.2-9.7 tiles and was HARD
    # CAPPED at `hypot > 11 -> continue`. That was correct for a 14.5-tile spawn
    # band and is a desert on a 26-tile one -- every piece of cover inside 11
    # tiles and the outer two thirds of the board bare, so a man spawned at 22
    # has nothing to hide behind and neither do you when you walk out to him.
    # A bigger board with the same cover is not a bigger fight, it is the same
    # fight with a lot of empty sand around it, which is the WALKABLE-LAND
    # failure in a different costume: thin content stranded in open ground.
    # Count and radius both scale; DENSITY per square tile stays about where the
    # arena generator already had it.
    old = """    const NP=2+Math.floor(Math.random()*14);"""
    new = """    const NP=6+Math.floor(Math.random()*30);   /* V138: 2-15 was tuned for a 10-tile board; this holds the DENSITY on a 26-tile one */"""
    js = subN(js, old, new)

    old = """      else { const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*7.5;
        nx2=Math.round(Math.cos(a0)*d0); ny2=Math.round(Math.sin(a0)*d0); }
      if(Math.hypot(nx2,ny2)<1.5)continue;
      if(Math.hypot(nx2,ny2)>11)continue;"""
    new = """      else { const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*22;   /* V138: cover reaches the whole board, not just the old 10-tile core */
        nx2=Math.round(Math.cos(a0)*d0); ny2=Math.round(Math.sin(a0)*d0); }
      if(Math.hypot(nx2,ny2)<1.5)continue;
      if(Math.hypot(nx2,ny2)>28)continue;   /* V138: was 11 -- which put every rock inside a third of the new board and left the rest bare desert */"""
    js = subN(js, old, new)

    # ---- 7. AND THE PRESS HAS TO READ **HIS** GUN ------------------------
    # MEASURED, and it is the trap this whole change sets for itself: V136's
    # closing term was `2.2*(distT(now)-distT(there))`, and distT is MY weapon.
    # So every enemy on the board was deciding whether to walk by consulting the
    # range of the gun in the PLAYER'S hands. With a pistol that curve saturates
    # at ~9.6 tiles, so out on a 16-tile board the gradient was FLAT and nobody
    # moved: movers/turn fell 1.93 -> 0.42 and they closed 0.61 tiles in six
    # turns. The board got bigger and the fight got emptier.
    # A man wants to be inside HIS OWN effective range, and past his own max his
    # gun is a brick -- the worst tile on the board to be standing on. Both terms
    # are monotonic at every distance, so there is no flat stretch to stall in
    # (which is the cliff lesson from V137, applied before it could bite again).
    old = """  /* the range is worth exactly what the game already says it is worth */
  s+=2.2*(distT({edist:e.edist})-distT({edist:d}));"""
    new = """  /* V138: THE RANGE THAT MATTERS TO HIM IS HIS OWN. V136 asked distT, which is
     the range of the gun in the PLAYER'S hands -- so with a pistol the curve
     saturated around 9.6 tiles and out on a 16-tile board the gradient was flat
     and nobody walked anywhere. Measured: 0.42 movers a turn, 0.61 tiles closed
     in six. A man wants to be inside HIS effective range, and past his own max
     he is holding a brick, which is the worst tile on the board. Monotonic at
     every distance, so there is no flat stretch to stall in. */
  { const R=foeRange(e), mx=Math.max(1,maxRange(R));
    s-=2.2*Math.max(0,d-R.eff)/mx;
    if(d>mx)s-=2.5; }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v138: guns have ranges and the board is big enough to hold them (pitch %s) -- %d chars' % (pitch, len(js)))


if __name__ == '__main__':
    main()

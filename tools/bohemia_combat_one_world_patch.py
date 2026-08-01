#!/usr/bin/env python3
"""V114 THE DIAL LEAVES, THE WORLD IS ONE WORLD, AND A GRENADE AT YOUR FEET KILLS YOU.

Paolo's list, and the first item is his ELEVENTH report of the same thing.

--------------------------------------------------------------------------
1. "MAKE THE WHOLE DEAD SHOT DIAL GO AWAY. FADE AWAY AS THE BULLET GETS
   CLOSER TO THE PERSON."
--------------------------------------------------------------------------
He has now told me the FIX, not just the symptom, and it is the right one:
stop hunting members of a family and delete the whole family on a schedule
tied to the bullet.

WHAT THE INSTRUMENT SAYS TODAY: the fade (_df) already runs across the
bullet's own travel time, and in a measured killshot NOTHING of the dial
draws -- no arm, no needle, no ticks. So the timing math is right.
WHAT HIS SCREENSHOT ACTUALLY SHOWS: the FIRE button is GREEN and lit, which
means phase 'aim'. That orange shape is the PLAYER'S OWN ARM AND GUN -- the
baked deadeye pose at the dial's centre -- blown up by the zoomed camera. It
is the dial, and it is on screen at a moment he reads as the cinematic,
because the chain puts him straight back into aim over a body that is still
dying.

SO THE FIX IS BOTH HALVES:
  * A HARD OFF. Once the fade is past 97% the ENTIRE dial block is skipped --
    bands, ticks, ghost fans, reticle, AND THE POSE. Not faded to nearly
    nothing, not drawn at alpha 0.01: not drawn. A dial that is "almost gone"
    is what eleven reports look like.
  * THE POSE IS EXPLICITLY INSIDE IT. It is the biggest, warmest object the
    dial owns and it was the last thing still standing.

--------------------------------------------------------------------------
2. "JUST HAVE THE PHYSICS WORLD BE THE SAME BRO FOR REAL"
--------------------------------------------------------------------------
"why when it's combat mode, you have it a certain way and then like it feels
like you turn them off after combat over... I'm trying to test out the stairs
and they look like they were working, I saw improvements, I couldn't walk off
the edge, but I was doing combat, but now that combat is over I can't even
test it."

HE IS DESCRIBING MY OWN CODE AND HE IS EXACTLY RIGHT. v106 wrapped the whole
stair-and-edge block in `if(!roam)`, where roam is the post-victory walk. So
the moment a fight ended, the staircase stopped being a staircase and the
deck edge stopped existing -- you could stroll off a second storey into the
air, on the only screen where he had time to actually test it.

ONE WORLD. The stairs climb, the edge refuses, and the level rules hold
whether or not anyone is shooting. The only thing `roam` still changes is
that walking is free (no turn, no return fire), which is what a victory walk
is FOR.

--------------------------------------------------------------------------
3. "IF A GRENADE EXPLODES AT MY FEET, I SHOULD BE DEAD. END OF STORY."
--------------------------------------------------------------------------
"now the outside radius is a different thing but yeah keep that in mind"

His ruling, and the honest one: 40-52 damage for a fragmentation grenade
going off ON you was a videogame number. Standing on it is death. The bands
outside it are untouched, because he said so explicitly.

--------------------------------------------------------------------------
4. THE HIGH GROUND BEATS A CROUCH
--------------------------------------------------------------------------
"if you're on a second story and you got cover... depending how far people are
from you, if they just have a crouching cover, it should be easier to hit
them because you have that height vantage point... if someone is close by in
crouch cover and an enemy and you're at a taller height than them then it
should probably help you because their crouch cover is maybe potentially
blown"

Physically true and it is the first thing that makes the high ground worth
the climb rather than just a different place to stand. A man crouched behind
a low wall is hidden from someone at his own eye level; from a storey up you
are looking down INTO the pocket he is hiding in. And the closer he is, the
steeper that angle gets, so the advantage is greatest right underneath you
and gone by the far end of the lot.

IT PULLS THE DIAL EASIER, on the same tier machinery everything else uses,
scaled by how close he is. It is NOT a damage multiplier -- his no-multipliers
ruling holds.

--------------------------------------------------------------------------
5. EXECUTION PAYS, BARELY
--------------------------------------------------------------------------
"if you down someone and they were already down and you kill them maybe you
can just get like a really minor stupid amount of experience on top of that
just so it's a little rewarding for psycho maniacs like maybe only +2% or +3%"

His number, his framing. The kill is already paid for when you DOWN him;
finishing a man who is already on the floor adds a token. It is deliberately
almost nothing, because the point is that it is a choice, not an optimisation.

REUSE CHECK: cooks NO graphic pixels. It gates existing draws, moves one
guard, changes two numbers and adds one dial term. No bank is opened because
no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region. It only decides whether the already
  baked player pose is drawn at all.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V114 THE DIAL LEAVES, ALL OF IT'


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
        print('v114 already in; nothing to do')
        return

    # ---- 1. THE HARD OFF -------------------------------------------------
    old = """  ctx.globalAlpha=_df;   /* DIAL FADE FIX (Paolo 7/3/26): v1 faded only from the
     center line down, so the big bands never faded and he saw nothing.
     The fade now owns the ENTIRE dial from the first band. */"""
    new = """  /* ===== V114 THE DIAL LEAVES, ALL OF IT ===========================
     Paolo, ELEVENTH report, and this time he gave me the fix instead of the
     symptom: "Make the whole dead shot dial go away, fade away as the bullet
     gets closer to the person."
     The fade timing was already right -- _df runs across the bullet's own
     travel time and a measured killshot draws no arm, no needle, no ticks.
     What his screenshot actually shows is the FIRE button GREEN, which means
     phase 'aim': the orange shape is HIS OWN ARM AND GUN, the baked deadeye
     pose at the dial's centre, blown up by the zoomed camera, because the
     chain drops him straight back into aim over a body that is still dying.
     SO: A HARD OFF, not a fade to nearly-nothing. Past 97% faded, the whole
     dial block is SKIPPED -- bands, ticks, fans, reticle and THE POSE, which
     is the biggest warmest thing the dial owns and was the last one standing.
     A dial that is "almost gone" is what eleven reports look like. */
  const DIAL_GONE=(_df<=0.03);
  ctx.globalAlpha=_df;   /* DIAL FADE FIX (Paolo 7/3/26): v1 faded only from the
     center line down, so the big bands never faded and he saw nothing.
     The fade now owns the ENTIRE dial from the first band. */"""
    s = subN(s, old, new)

    # the pose: the last thing standing
    old = """    if(underDeckMe()){ x.save(); x.globalAlpha=UNDER_ALPHA;
      drawHumanWashed(x,pst,cx,cy,UNDER_TINT); x.restore(); }
    else if(_sh>0.01)drawHumanWashed(x,pst,cx,cy,'rgba(255,208,110,'+_sh.toFixed(3)+')');
    else drawHuman(x,pst,cx,cy);"""
    new = """    /* V114: THE POSE IS PART OF THE DIAL AND IT LEAVES WITH IT. His arm and
       his gun are the biggest warm object the instrument owns; once the dial
       is gone this must not be the one thing left glowing over a corpse. */
    if(aimo&&typeof aimo==='object'&&aimo.gone){ /* dial is off: draw nothing */ }
    else if(underDeckMe()){ x.save(); x.globalAlpha=UNDER_ALPHA;
      drawHumanWashed(x,pst,cx,cy,UNDER_TINT); x.restore(); }
    else if(_sh>0.01)drawHumanWashed(x,pst,cx,cy,'rgba(255,208,110,'+_sh.toFixed(3)+')');
    else drawHuman(x,pst,cx,cy);"""
    s = subN(s, old, new)

    old = """    drawField(ctx,W,H,cx,cy,{dial:true,zb:zb});"""
    new = """    drawField(ctx,W,H,cx,cy,{dial:true,zb:zb,gone:DIAL_GONE});   /* V114: the pose leaves with the dial */"""
    s = subN(s, old, new)

    # ---- 2. ONE WORLD ----------------------------------------------------
    old = """  if(!roam){
    /* THE LANDING BELONGS TO BOTH FLOORS. Step onto it from the lot and you
       have climbed; step off it onto the lot and you have come down. One pip
       each way, symmetric, and the same price the button charges. */"""
    new = """  /* ===== V114 ONE WORLD =============================================
     Paolo: "just have the physics world be the same bro for real... I'm
     trying to test out the stairs and they look like they were working, I
     couldn't walk off the edge, but I was doing combat, but now that combat
     is over I can't even test it."
     HE IS DESCRIBING MY OWN CODE. v106 wrapped this whole block in
     `if(!roam)`, so the instant a fight ended the staircase stopped being a
     staircase and the deck edge stopped existing -- you could walk off a
     second storey into the air, on the exact screen where he finally had time
     to test it.
     THE LEVEL RULES ARE THE WORLD, NOT A COMBAT MODE. The only thing roam
     still changes is that walking is free, which is what a victory walk is
     for. */
  {
    /* THE LANDING BELONGS TO BOTH FLOORS. Step onto it from the lot and you
       have climbed; step off it onto the lot and you have come down. One pip
       each way, symmetric, and the same price the button charges. */"""
    s = subN(s, old, new)

    # roam must not be blocked by the stamina cost either -- the walk is free
    old = """    if(_climb||_down){
      if(!spendStam(1)){ setRead('NO STAMINA','the stairs cost one pip','#8a7d66'); return; }"""
    new = """    if(_climb||_down){
      if(!roam&&!spendStam(1)){ setRead('NO STAMINA','the stairs cost one pip','#8a7d66'); return; }   /* V114: the victory walk is free, the geometry is not */"""
    s = subN(s, old, new)

    # ---- 3. A GRENADE AT YOUR FEET KILLS YOU ----------------------------
    old = """    let sd=0; if(dSelf<0.9)sd=40+Math.floor(Math.random()*12); else if(dSelf<1.5)sd=18+Math.floor(Math.random()*8);"""
    new = """    /* V114 (Paolo 8/2, ruling): "if a grenade explodes at my feet, I should be
       dead. End of story. now the outside radius is a different thing but yeah
       keep that in mind." 40-52 for a frag going off ON you was a videogame
       number. Standing on it is death. The band outside it is untouched,
       because he drew that line himself. */
    let sd=0; if(dSelf<0.9)sd=999; else if(dSelf<1.5)sd=18+Math.floor(Math.random()*8);"""
    s = subN(s, old, new)

    # ---- 4. THE HIGH GROUND BEATS A CROUCH ------------------------------
    old = """function pressureGuns(){"""
    new = """/* ===== V114 THE HIGH GROUND BEATS A CROUCH ========================
   Paolo 8/2: "if you're on a second story and you got cover... if they just
   have a crouching cover, depending how far they are from you it should be
   easier to hit them because you have that height vantage point... if someone
   is close by in crouch cover and you're at a taller height than them then it
   should probably help you because their crouch cover is maybe potentially
   blown".
   Physically true, and it is the first thing that makes the climb worth
   making instead of just a different place to stand. A man crouched behind a
   low wall is hidden from someone at his own eye level; from a storey up you
   are looking down INTO the pocket. The closer he is the steeper that angle,
   so the advantage is biggest directly beneath you and gone by the far end.
   IT PULLS THE DIAL EASIER, on the same tier machinery as everything else.
   NOT a damage multiplier -- his no-multipliers ruling holds. */
function highGroundEdge(e){
  if(!e||myLvl()===(e.lvl|0))return 0;          /* same floor, no angle */
  if(myLvl()<=(e.lvl|0))return 0;               /* he is above YOU: no gift */
  if(!e.gcov)return 0;                          /* nothing to look over */
  const d=Math.max(1,e.edist||99);
  if(d>FAR_HG)return 0;
  return (d<=NEAR_HG)?2:1;                      /* right under you, or merely below */ }
const NEAR_HG=5, FAR_HG=12;   /* tiles [DIALS] */
function pressureGuns(){"""
    s = subN(s, old, new)

    old = """        chainRampDial(),
        pressurePkg())));   /* V110: exposure is a FLOOR"""
    new = """        chainRampDial(),
        pressurePkg())) - highGroundEdge(tgt));   /* V114: the high ground pulls the dial EASIER over a crouched man, steepest when he is right below you. V110: exposure is a FLOOR"""
    s = subN(s, old, new)

    # ---- 5. EXECUTION PAYS, BARELY --------------------------------------
    old = """  setRead('FINISHED', t.n+' — it is done','#e8593a'); renderBoard(); updGap();"""
    new = """  /* V114 (Paolo 8/2, his number): "if you down someone and they were already
     down and you kill them maybe you can just get like a really minor stupid
     amount of experience on top of that... maybe only +2% or +3%". The kill is
     already paid for when he goes DOWN; this is a token for finishing a man on
     the floor, deliberately almost nothing, because the point is that it is a
     CHOICE and not an optimisation. */
  { const _x=Math.max(1,Math.round((t.max||100)*EXEC_XP_PCT));
    G.ledger=G.ledger||{}; G.ledger.execXP=(G.ledger.execXP||0)+_x;
    G.rc=G.rc||{}; G.rc.execXP=(G.rc.execXP||0)+_x; }
  setRead('FINISHED', t.n+' — it is done  ·  +'+Math.max(1,Math.round((t.max||100)*EXEC_XP_PCT))+' XP','#e8593a'); renderBoard(); updGap();"""
    s = subN(s, old, new)

    old = """function finishHim(t){ /* V30: the death blow — yours to give or withhold */"""
    new = """const EXEC_XP_PCT=0.03;   /* V114: his number, 2-3%. A token, never an optimisation. [DIAL] */
function finishHim(t){ /* V30: the death blow — yours to give or withhold */"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v114: the dial leaves, one world, a grenade at your feet kills (%d chars)' % len(s))


if __name__ == '__main__':
    main()

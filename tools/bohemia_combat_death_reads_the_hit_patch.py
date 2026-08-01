#!/usr/bin/env python3
"""V109 THE DEATH READS FROM THE HIT, AND NOBODY BREATHES DURING A KILL.

Paolo, T7:
  "if I'm using a shotgun everyone fucking dies and when they die they're
   either bleeding out wiggling around which you might have to make a new
   animation for and all of it has to be translated from the type of headshot
   they got"
  "if I killshot someone with a shotgun, they shouldn't be squatting doing an
   animation with squatting back up right after they get their headshot"
  "as we create more animations you have to be smart with this like how you
   connect animation seamlessly together"

--------------------------------------------------------------------------
1. THE FALL WAS ROLLED ON DICE. IT IS INHERITED NOW.
--------------------------------------------------------------------------
The line he is complaining about said, out loud, in the source:

    tgt._deathVar=Math.floor(Math.random()*3);
      /* THE SHUFFLE: which way they fall is rolled, never inherited */

That was a deliberate old decision and it is the exact opposite of what he
now wants: he wants the fall TRANSLATED FROM WHAT KILLED HIM. Six separate
call sites rolled their own dice, which is the same two-lists disease v107
just cured for the reset -- so this is ONE function, `deathFall(src)`, and
every site asks it.

WHAT THE SOURCE ARGUMENT MEANS: the thing that killed him, not the zone.
A shotgun at bad-breath distance throws a body. A pistol round drops one
where it stood. A grenade or a cooking fuel tank throws it hardest of all.

--------------------------------------------------------------------------
AND THE MEASUREMENT THAT DECIDED THE MAPPING -- INCLUDING THE BAD NEWS
--------------------------------------------------------------------------
I did not guess which baked fall means what. Every frame of all three was
rendered and measured (alpha centroid, bounding box, first frame vs last):

    death[0]   driftX -10.5   flatten 0.73   widen 2.33
    death[1]   driftX  -0.3   flatten 0.25   widen 3.64
    death[2]   driftX  -0.3   flatten 0.25   widen 3.64

  * death[0] is THE ONE THAT TRAVELS. The body ends 10px from where it
    started and stays comparatively tall: knocked off its feet, sideways.
  * death[1] collapses straight down in place, 100px tall to 24px.
  * **death[2] ENDS PIXEL-IDENTICAL TO death[1].** Same centroid, same box.

SO THERE ARE NOT THREE FALLS. THERE ARE TWO. That is a real limit on what
"translated from the type of headshot they got" can currently mean, and
pretending otherwise would be building a mapping on top of art that cannot
express it. The mapping ships as the honest two-way read it actually is:

    KNOCKBACK  (shotgun, or point blank, or an explosion)  -> death[0]
    COLLAPSE   (everything else)                           -> death[1]/[2]

and a THIRD distinct fall is an ART REQUEST, not something this lane cooks.

--------------------------------------------------------------------------
2. NOBODY BREATHES DURING A KILL (the squat)
--------------------------------------------------------------------------
I chased this one wrong twice and I am not going to claim a third diagnosis.
What I did instead is make the complaint STRUCTURALLY IMPOSSIBLE, on the
same rule v107 already established for the dial.

Every covered body bobs `cover112[floor(clock/500)%2]` -- crouch, rise,
crouch, rise, forever. That IS a man squatting and standing back up. Two
ways it lands on top of a headshot:
  (a) the kill zooms the camera in, so a NEIGHBOUR's bob suddenly fills the
      screen at the exact moment the shot lands
  (b) the freeze holds _bpmClock and then SNAPS it forward to the true audio
      position on release, which can flip the bob a whole phase in one frame

THE KILL WEARS NOTHING, EXTENDED FROM THE DIAL TO THE BODIES: while G.ks is
live every body HOLDS its pose. A kill is a held moment; men do not do
calisthenics inside one. That kills (a) and (b) together without needing to
know which one he saw.

AND SEPARATELY, THE SCRUB IS FENCED: the v102 dial-cover pose now refuses
any man who is dead, downed, broken, fleeing, stunned or hit within the last
600ms. It was already unreachable for a dead man (enemyFrame tests e.dead
first) but "already unreachable" is exactly the reasoning that produced two
wrong diagnoses, so it is now unreachable BY ASSERTION.

--------------------------------------------------------------------------
3. BLEEDING OUT, WIGGLING AROUND
--------------------------------------------------------------------------
His words, and today a downed man lies PERFECTLY STILL between crawl ticks
-- indistinguishable from a corpse, which is the one thing a dying man must
never look like, because whether he is still alive is a decision the player
makes (FINISH him, or leave him).

Now he WRITHES: a slow alternation between prone112 and the first crawl
frame, on the 120 grid like everything else. Measured centroids 71.5 vs
72.4, so it is a small shift of a body that cannot get up -- not a crawl,
not a corpse. NO NEW ART: both clips are already baked and already approved.

--------------------------------------------------------------------------
4. CONNECTING ANIMATIONS SEAMLESSLY (the research he asked for)
--------------------------------------------------------------------------
The finding, applied here and written up in the record: a cut between two
clips reads as a POP when the outgoing clip's current frame and the incoming
clip's frame 0 disagree about where the body is. Sprite work has two fixes
and only two -- share a pose at the seam, or hold the outgoing frame until
the incoming clip's natural start. This engine has a third advantage nobody
was using: EVERYTHING IS ON THE 120 GRID, so a transition that lands on a
beat boundary is a transition the player's ear has already been told to
expect. That is why the bob, the writhe and the fire cycle all run off the
one shared clock here rather than off performance.now().

REUSE CHECK: cooks NO graphic pixels. Every clip used (death[0..2],
prone112, crawl112, cover112) is already baked into the shipped alpha and
already approved; this patch only CHOOSES between them. No bank is opened
because no art is authored. The one thing that would need art -- a third
distinct fall -- is deliberately NOT cooked here and is written up as a
request instead.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry and reshapes
  nothing. It selects among already-baked clips and changes no joint, no
  region and no pose data.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V109 THE FALL IS INHERITED, NOT ROLLED'


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
        print('v109 already in; nothing to do')
        return

    # ---- 1. ONE function, and it is inherited ------------------------
    old = """function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }"""
    new = """/* ===== V109 THE FALL IS INHERITED, NOT ROLLED ======================
   Paolo: "all of it has to be translated from the type of headshot they got".
   The old line literally read "THE SHUFFLE: which way they fall is rolled,
   never inherited" in six different places. One function now, every site
   asks it, and the answer comes from WHAT KILLED HIM.

   MEASURED, not guessed -- all three baked falls rendered and their alpha
   centroids and boxes compared, first frame against last:
     death[0]  driftX -10.5  flatten 0.73   the body TRAVELS: off its feet
     death[1]  driftX  -0.3  flatten 0.25   collapses straight down in place
     death[2]  driftX  -0.3  flatten 0.25   ENDS PIXEL-IDENTICAL TO death[1]
   So the bank holds TWO distinct falls, not three, and this mapping is
   therefore an honest two-way read. A third fall is an ART REQUEST. */
const FALL_KNOCK=0;                    /* the one that travels */
const FALL_DROP=[1,2];                 /* the two that collapse in place */
function deathFall(e,src,dist){
  /* KNOCKBACK: a shotgun, anything at bad-breath distance, or an explosion.
     A body hit by any of those does not fold up where it stood. */
  const d=(dist!=null)?dist:(e&&e.edist!=null?e.edist:99);
  if(src==='blast'||src==='shotgun'||d<=PT_BLANK)return FALL_KNOCK;
  /* everything else drops. Alternate the two collapse clips off a STABLE
     property of the man rather than dice, so the same man always falls the
     same way and a row of bodies is not all one frame. */
  return FALL_DROP[((e&&e.i)|0)%FALL_DROP.length]; }
function fallSrc(){ return (typeof WEAPON!=='undefined')?WEAPON:'pistol'; }
function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }"""
    s = subN(s, old, new)

    # ---- every site: inherited ----------------------------------------
    # (a) the car cook-off -> an explosion
    old = """    if(e.hp<=0){ e.dead=true; killed++; e._deathVar=Math.floor(Math.random()*3);"""
    new = """    if(e.hp<=0){ e.dead=true; killed++; e._deathVar=deathFall(e,'blast',0);   /* V109: a fuel tank throws a body */"""
    s = subN(s, old, new)

    # (b) the grenade -> an explosion
    old = """      e._deathVar=Math.floor(Math.random()*3); try{addWound(e);}catch(_e){}"""
    new = """      e._deathVar=deathFall(e,'blast',0); try{addWound(e);}catch(_e){}   /* V109: a grenade throws a body */"""
    s = subN(s, old, new)

    # (c) finishing a man already on the floor
    old = """  t._deathVar=Math.floor(Math.random()*3); t._deadAt=performance.now()-1200;"""
    new = """  t._deathVar=deathFall(t,fallSrc(),0); t._deadAt=performance.now()-1200;   /* V109: point blank by definition */"""
    s = subN(s, old, new)

    # (d) THE KILLSHOT
    old = """    tgt._deathVar=Math.floor(Math.random()*3);   /* THE SHUFFLE: which way they fall is rolled, never inherited */"""
    new = """    tgt._deathVar=deathFall(tgt,fallSrc(),tgt.edist);   /* V109 (Paolo 7/31): "all of it has to be translated from the type of headshot they got". THE SHUFFLE IS DEAD -- the fall is inherited from the weapon and the range, so a shotgun at three tiles throws him and a pistol at twenty drops him. */"""
    s = subN(s, old, new)

    # (e) + (f) an incidental kill off a vital / a hit
    old = """      G.killStreak++; G.enemiesLeft=aliveEnemies().length; renderBoard(); tgt._deathVar=Math.floor(Math.random()*3); addWound(tgt); sndKill(); startKillshot();"""
    new = """      G.killStreak++; G.enemiesLeft=aliveEnemies().length; renderBoard(); tgt._deathVar=deathFall(tgt,fallSrc(),tgt.edist); addWound(tgt); sndKill(); startKillshot();   /* V109 */"""
    s = subN(s, old, new, 2)

    # ---- 2. NOBODY BREATHES DURING A KILL ----------------------------
    old = """function enemyFrame(e,now){
  /* one truth for what an enemy's body is doing, every view asks HERE."""
    new = """/* ===== V109 THE KILL WEARS NOTHING -- INCLUDING THE BODIES ==========
   v107 stopped the DIAL wearing ornaments during a killshot. The same rule
   was never applied to the men: every covered body runs a crouch/rise bob on
   the 120 grid, forever, and a kill zooms the camera straight onto it. That
   is a man "squatting and standing back up right after they get their
   headshot", whether it is the target or the man next to him, and the freeze
   snapping _bpmClock forward on release can flip the whole phase in one frame.
   A KILL IS A HELD MOMENT. Bodies hold their pose inside it. */
function bodyBreathes(){ return !G.ks; }
function enemyFrame(e,now){
  /* one truth for what an enemy's body is doing, every view asks HERE."""
    s = subN(s, old, new)

    old = """    return frames[Math.floor((JUICE.A?_bpmClock:now)/500)%2];   /* JUICE.A BEAT-BREATHING: every covered body bobs on the SAME 120 beat */"""
    new = """    if(!bodyBreathes())return frames[0];   /* V109: held, tucked, for the whole kill */
    return frames[Math.floor((JUICE.A?_bpmClock:now)/500)%2];   /* JUICE.A BEAT-BREATHING: every covered body bobs on the SAME 120 beat */"""
    s = subN(s, old, new)

    old = """  if(firing(e)&&L.fire112)return L.fire112[Math.floor((JUICE.A?_bpmClock:now)/250)%2];   /* red = the gun is UP; JUICE.A: on the grid */"""
    new = """  if(firing(e)&&L.fire112)return L.fire112[bodyBreathes()?Math.floor((JUICE.A?_bpmClock:now)/250)%2:0];   /* red = the gun is UP; JUICE.A: on the grid. V109: held during a kill */"""
    s = subN(s, old, new)

    # ---- the v102 scrub is fenced BY ASSERTION ------------------------
    old = """  if(e.gcov&&dialLive()&&e===G.e[G.fireTarget]){"""
    new = """  /* V109: FENCED BY ASSERTION. This branch was already unreachable for a
     dead man (e.dead is tested at the top of this function) -- and "already
     unreachable" is exactly the reasoning that produced two wrong diagnoses
     of Paolo's squatting complaint. A body that is dying, broken, running,
     stunned or freshly hit does not scrub the needle, stated out loud. */
  if(e.gcov&&dialLive()&&e===G.e[G.fireTarget]
     &&!e.dead&&!e.downed&&!e.broken&&!e.fleeing&&!(e.stun>0)
     &&!(e._hitAt&&now-e._hitAt<600)){"""
    s = subN(s, old, new)

    # ---- 3. BLEEDING OUT, WIGGLING AROUND ----------------------------
    old = """    if(e._crawlAt&&now-e._crawlAt<640&&L.crawl112)return L.crawl112[Math.min(3,Math.floor((now-e._crawlAt)/160))];   /* ROUND 2B: the drag plays right on the V30 crawl tick */
    return L.prone112||fseq[fseq.length-1]; }"""
    new = """    if(e._crawlAt&&now-e._crawlAt<640&&L.crawl112)return L.crawl112[Math.min(3,Math.floor((now-e._crawlAt)/160))];   /* ROUND 2B: the drag plays right on the V30 crawl tick */
    /* V109 BLEEDING OUT, WIGGLING AROUND (Paolo 7/31, his words). A downed
       man used to lie PERFECTLY STILL between crawl ticks, which made him
       indistinguishable from a corpse -- the one thing a dying man must never
       look like, because whether he is still alive is a decision the player
       makes (FINISH him, or walk past). Measured centroids: prone 71.5,
       crawl[0] 72.4, so this is a small shift of a body that cannot get up.
       It is not a crawl and it is not a corpse. On the 120 grid like
       everything else, and HELD during a kill with every other body. */
    if(L.prone112&&L.crawl112&&L.crawl112.length){
      const _w=bodyBreathes()?(Math.floor((JUICE.A?_bpmClock:now)/500)%4):0;
      return _w===2?L.crawl112[0]:L.prone112; }
    return L.prone112||fseq[fseq.length-1]; }"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v109: the fall is inherited, bodies hold in a kill, the dying writhe (%d chars)' % len(s))


if __name__ == '__main__':
    main()

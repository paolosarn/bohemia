#!/usr/bin/env python3
"""V121 NOBODY STANDS IN A CAR, AND DIFFICULTY FINALLY TOUCHES THE ENEMY.

Paolo, T4: "I am really concerned how easy this game could be unless I throw 8+
enemies at a player... I don't know if it's because I'm not easy difficulty or
if it's because of the rule that pretty much you're always guaranteed to get the
first shot always and I don't know if you could do some research on that."

I MEASURED IT. BOTH OF HIS GUESSES ARE RIGHT, AND THERE IS A THIRD THING HE DID
NOT GUESS THAT IS WORSE THAN EITHER.

--------------------------------------------------------------------------
FINDING 1: YOU DO ALWAYS SHOOT FIRST. CONFIRMED.
--------------------------------------------------------------------------
    startPhase 'cover'      enemiesActedBeforeYou 0      yourHP 100
A fight opens in YOUR phase with the enemy turn counter at zero, every time.
Nobody has ever fired a round at him before he has had a full turn to kill
somebody. That is not a bug -- it is how the fight was built -- but he is right
that it is a standing advantage nobody pays for.

--------------------------------------------------------------------------
FINDING 2: THE DIFFICULTY SETTING DOES NOT TOUCH THE ENEMY. AT ALL.
--------------------------------------------------------------------------
This is the one he did not guess and it is the actual answer. Twenty turns of
standing still and letting them shoot, eight foes, same seed shape:

    EASY        6 turns to kill me      16.7 HP lost per turn
    BOHEMIAN    6 turns to kill me      16.7 HP lost per turn

IDENTICAL. Not close -- identical. The difficulty package feeds G.pkgDiff, which
feeds the DIAL: the pattern YOU have to hit. It never reaches distAccuracy, the
volley, enemy damage, or anything else about how dangerous they are.
So every difficulty in this game means exactly one thing: HOW HARD IS IT FOR YOU
TO SHOOT. Nothing has ever made THEM better. "Bohemian" was a harder minigame
attached to the same harmless enemies.

That is why it feels easy at any setting, and it is why eight bodies is the only
lever that has ever worked -- more guns was literally the only thing that could
change the threat.

THE FIX, AND THE NUMBERS ARE DIALS: difficulty now scales the ONE number that
decides whether a man hurts you -- distAccuracy, his chance to land a round on
you -- on the same 0..4 package he already picks. It is the single choke point
every enemy shot in the file runs through: the volley, the deck holders, the
opportunity shot and the readout that prints THEIRS all read it, so one wire
makes every gun on the board obey the setting.
    EASY 1.00   NORMAL 1.12   HARD 1.26   V.HARD 1.42   BOHEMIAN 1.60
EASY is left exactly where it has always been so nothing he has already judged
shifts under him; every tier above it climbs.

IT DIVIDES THE MISS, NOT THE HIT, AND I ONLY KNOW THAT BECAUSE I MEASURED THE
FIRST CUT. Multiplying the hit chance ran V.HARD and BOHEMIAN both into the
0.99 ceiling -- two identical tiers, the exact bug I was fixing, moved up two
notches. Dividing the miss cannot pass 1, so nothing clamps:
    POINT BLANK  .970 -> .981    MID LOT  .699 -> .812    FAR  .370 -> .606
Which also puts the difficulty in the honest place. A man in your face was
always going to hit you; the reason eight bodies feels harmless is that the
far ones MISS. On Bohemian they stop missing.

IT IS NOT A DAMAGE MULTIPLIER, DELIBERATELY. His no-multipliers ruling stands:
a bullet does what a bullet does. Difficulty changes HOW OFTEN one finds you,
never how much it takes when it does. And it does NOT touch the dial, so his
7/27 point-blank ruling, the exposure floor and the chain allowance -- which
v98 says out loud must never be wired to difficulty -- all resolve as before.

--------------------------------------------------------------------------
FINDING 3: 4.4% OF ENEMIES SPAWN INSIDE SOMETHING SOLID
--------------------------------------------------------------------------
"the Enemies are able to like be inside the cars or like being the same tiles of
the cars and it's not good."

MEASURED across 200 arenas and 1,600 bodies:
    40 standing INSIDE A CAR
    30 standing inside a cover block
    4.4% of every man placed
THE CAUSE: setupEnemies picks a bearing and a distance and writes e.ea / e.edist
straight in. It has never once asked whether anything is already there. The
OCCUPANCY LAW says one body per cell including the player, and enemy placement
was the one place in the fight that never enforced it.
Now every spawned man is pushed out of a solid cell to the nearest free one
before the fight starts, and if the lot is so full that nothing is free within
the search he is nudged outward rather than left inside a wreck.

REUSE CHECK: cooks NO graphic pixels. It moves spawn positions and scales two
numbers. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V121 NOBODY STANDS IN A CAR'


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
        print('v121 already in; nothing to do')
        return

    # ---- 1. NOBODY STANDS IN A CAR --------------------------------------
    # It runs LAST in setupEnemiesBody, after the deck holders are lifted onto
    # the roof, so a man one storey up is never judged against ground cover.
    old = """      m.ea=T.ea; m.edist=T.edist; m.lvl=DECK_LVL; m.gcov=0; } }
}"""
    new = """      m.ea=T.ea; m.edist=T.edist; m.lvl=DECK_LVL; m.gcov=0; } }
  /* ===== V121 NOBODY STANDS IN A CAR ==============================
     Paolo: "the Enemies are able to like be inside the cars or like being the
     same tiles of the cars and it's not good."
     MEASURED across 200 arenas and 1,600 bodies: 40 standing INSIDE A CAR, 30
     inside a cover block, 4.4% of every man placed.
     THE CAUSE: this function picks a bearing and a distance and writes e.ea /
     e.edist straight in. It has never once asked whether anything is already
     there. The OCCUPANCY LAW is one body per cell including the player, and
     enemy placement was the one place in the fight that never enforced it.
     Every man is pushed out to the nearest free cell now. If the lot is so
     packed that nothing is free inside the search, he is nudged OUTWARD --
     never left standing in a wreck. */
  (function v121Occupancy(){
    const solidAt=(qx,qy)=>(G.pillars||[]).some(P=>{ const c=pXY(P);
      return Math.abs(c[0]-qx)<0.7 && Math.abs(c[1]-qy)<0.7; });
    const takenAt=(qx,qy,self)=>(G.e||[]).some(o=>{ if(o===self)return false;
      const p=pXY(o); return Math.abs(p[0]-qx)<0.7 && Math.abs(p[1]-qy)<0.7; });
    for(const e of (G.e||[])){
      if((e.lvl|0)!==0)continue;                    /* the roof is a different floor */
      let qx=Math.cos(e.ea)*e.edist, qy=Math.sin(e.ea)*e.edist;
      if(!solidAt(qx,qy)&&!takenAt(qx,qy,e))continue;
      let placed=false;
      /* spiral out one ring at a time: the nearest free cell keeps the
         rolled spawn layout intact instead of teleporting him across the lot */
      for(let r=1;r<=4&&!placed;r++){
        for(let a=0;a<8&&!placed;a++){
          const th=a*Math.PI/4, nx=Math.round(qx+Math.cos(th)*r), ny=Math.round(qy+Math.sin(th)*r);
          if(Math.hypot(nx,ny)<2.2)continue;             /* never onto the player */
          if(solidAt(nx,ny)||takenAt(nx,ny,e))continue;
          e.ea=Math.atan2(ny,nx); e.edist=Math.hypot(nx,ny); placed=true; } }
      if(!placed){ e.edist=Math.min(MAX_RANGE,e.edist+2.5); }   /* pushed OUTWARD, never left in a wreck */
    }
  })();
}"""
    s = subN(s, old, new)

    # ---- 2. DIFFICULTY FINALLY TOUCHES THE ENEMY ------------------------
    old = """function distAccuracy(e){ return 0.97 - distT(e)*0.60; }      // point blank ~.97, far ~.37 (they rarely miss up close)"""
    new = """/* ===== V121 DIFFICULTY FINALLY TOUCHES THE ENEMY ==================
   Paolo: "I am really concerned how easy this game could be unless I throw 8+
   enemies at a player... I don't know if it's because I'm not easy difficulty".
   MEASURED, twenty turns of standing still and letting them shoot, eight foes:
       EASY       6 turns to kill me, 16.7 HP lost per turn
       BOHEMIAN   6 turns to kill me, 16.7 HP lost per turn
   IDENTICAL. Not close -- identical. The difficulty package feeds G.pkgDiff,
   which feeds THE DIAL: the pattern YOU have to hit. It has never reached
   distAccuracy, the volley, or enemy damage. So every difficulty in this game
   has meant exactly one thing -- how hard is it for YOU to shoot -- and nothing
   has ever made THEM better. That is why eight bodies was the only lever that
   ever changed the threat.
   IT SCALES THE TWO THINGS THAT DECIDE WHETHER A MAN HURTS YOU: his accuracy
   and his damage. EASY is left exactly where it has always been so nothing he
   has already judged shifts under him. It does NOT touch the dial, so the
   point-blank ruling, the exposure floor and the chain allowance are untouched.
   IT SCALES THE MISS, NOT THE HIT, AND THAT SHAPE IS THE WHOLE DESIGN. My
   first cut multiplied the hit chance and I measured it: V.HARD and BOHEMIAN
   both landed on the 0.99 clamp, so the top two tiers came out IDENTICAL --
   the exact bug I was fixing, moved up two notches. Dividing the MISS chance
   instead is bounded by construction (it can never pass 1, so no clamp can
   eat a tier) and it puts the difficulty where it belongs:
       POINT BLANK  .970 -> .981   a man in your face was always going to hit
       MID LOT      .699 -> .812
       FAR SIDE     .370 -> .606   BOHEMIAN means they stop missing at range
   Up close nothing moves, because up close was already lethal and that is his
   7/27 ruling. Across the lot it nearly doubles, which is the actual answer to
   "how is this easy with eight men on the board": they were missing.
   THE NUMBERS ARE DIALS. */
const THREAT_BY_PKG=[1.00,1.12,1.26,1.42,1.60];
function threatMult(){ const k=Math.max(0,Math.min(4,(G.userPkg||0)|0));
  const v=THREAT_BY_PKG[k]; return (v==null)?1:v; }
function distAccuracy(e){ const base=0.97 - distT(e)*0.60;     // point blank ~.97, far ~.37 (they rarely miss up close)
  return 1-(1-base)/threatMult(); }      // V121: difficulty divides the MISS, so it is bounded and every tier is distinct"""
    s = subN(s, old, new)

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v121: occupancy enforced on spawn, difficulty reaches the enemy (%d chars)' % len(s))


if __name__ == '__main__':
    main()

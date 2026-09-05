#!/usr/bin/env python3
"""
V198 A TILE IS A HOUSE. THE BOARD ZOOMS OUT AND THE GUNS BECOME REACH.

VAMILY job: BB-A-TILE-IS-A-HOUSE, first OPEN line in COMBAT's queue.

  PAOLO 9/4, LOCKED: "instead of each combat tile being the size a human maybe
  each combat tile is the same size as the house and a pistol is like a dagger
  compared to the range of battle brothers and a rifle can do two tiles."
  AND THE SAME DAY: "the size of the 'ground' changes but the player is the same
  size just what they 'walk' on is a more zoomed out city so it really feels like
  war is spilling in the streets."

-------------------------------------------------------------------------
THE ARCHITECTURE WAS ALREADY BUILT FOR THIS AND I DID NOT EXPECT THAT
-------------------------------------------------------------------------
Three things this job needed turned out to be already done, and finding them is
most of why this is small instead of a rewrite:

  * THE SPAWN BAND IS ALREADY DERIVED FROM RANGE. SPAWN_NEAR/SPAWN_FAR are
    "multiples of YOUR max range", so compressing the guns compresses the
    approach with no second edit. The board follows the weapon.
  * A STEP IS ALREADY ONE CELL. V162 deleted PRESS_STEP -- "it was how far a man
    slid in a turn, and a cell..." -- so "a step is one beat, and a step is now
    one house" needed NOTHING. It is true the moment the cell is a house.
  * THE ACCURACY CURVE IS ALREADY A RATIO. rangeT is (d-PT_BLANK)/(F-PT_BLANK)
    with F built out of the gun's own eff. Scale the world, the gun and the
    point-blank band by one number and THE RATIO IS UNCHANGED -- which is how
    "NO accuracy or damage number moves" is satisfied by construction rather
    than by promising. The gate measures it rather than asserting it.

-------------------------------------------------------------------------
AND rangeMult() IS THE WRONG DOOR, WHICH IS WORTH WRITING DOWN
-------------------------------------------------------------------------
rangeMult is described in its own comment as "the ONE DOOR every reach in the
game passes through", and putting house scale in it is the obvious move. IT IS
WRONG: isDark() is literally `rangeMult()<0.999`, so a house-scale board would
have told the entire game it was NIGHT -- V98's dark, the LIGHT IT ability, the
spotter's night band, all of it, silently and with every check green.
THAT DOOR IS THE DARKNESS DOOR. It is not a door for scale. So scale gets its
own, and isDark keeps reading only the night term.

-------------------------------------------------------------------------
HOW IT SHIPS: hd(n), AND AT BODY SCALE IT IS A DIVISION BY ONE
-------------------------------------------------------------------------
hd(n) is "a distance written in body-tiles, on the board we are actually on".
tileK() is 1 at body scale, so hd(n) === n / 1 === n, EXACTLY, for every double.
That is not an argument, it is IEEE 754, and it is why the old board cannot
move: every seeded arena he has written down deals the same cards.
The 8/27 lesson is the one this job names in its own row -- rolling a feature
inside the seeded stream re-dealt every arena in the game with no crash and
every check green -- so the dial adds NO draw and the gate proves the boards
are identical rather than trusting it.

  RANGES, at house scale (his ruling, not derived):
      shotgun 1     pistol 1     smg 1     rifle 2
  A pistol is a dagger. A rifle is a spear. Guns are the new melee.
  WHERE A SCOPED RIFLE STOPS IS HIS: the sniper ships at 3 as an attempt and is
  flagged [PENDING Paolo] rather than silently decided.

  AND THE BLADES COME WITH THEM. A knife at reach 1.8 while a pistol reaches 1
  would OUT-RANGE THE GUN, which inverts the whole ruling. Melee is not divided
  -- it is mapped: everything is adjacent, and the SPEAR, the one long-reach
  melee body, is the one that reaches two. Same sentence as the guns.

NO DAMAGE BEFORE THE DIAL: applyDamage untouched, every archetype's dmg and acc
untouched, WEAPON_RANGE's body-scale numbers untouched. Only distances move.

HE MUST BE ABLE TO DIRECT IT (8/12): a dial in the COMBAT tab's DEMO SETTINGS
beside SHE FIGHTS WITH YOU -- `TILE: A BODY / A HOUSE` -- and a second one,
TILE WIDTH, because the ratio is by eye and the eye is his. The human-scale
board is NOT removed; he plays both.

REUSE CHECK: cooks no graphic pixels and opens no bank. The ground is the tile
render that is already there at a wider pitch; the ranges are the table that is
already there; the spawn band, the approach and the step are untouched code.

TASTE CHECK: two dials in the settings drawer he already opens, nothing new on
the fight screen, and the default is the board he has been playing.

RIG CHECK: THE SPRITE DOES NOT SHRINK -- his sentence, and the gate measures the
drawn body in pixels at both settings and fails if it moves by one.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V198 A TILE IS A HOUSE'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v198: already applied')
        return
    if 'V197 TWO OF YOU' not in d:
        sys.exit('v198 needs v197 -- run the two-of-you patch first')

    # ---- 1. THE SCALE ITSELF ----
    d = sub(d,
        "const SIGHT_TILES=17;   /* [DIAL] measured off the real canvas: 17.5 to the sides */",
        """/* ===== V198 A TILE IS A HOUSE ====================================
   Paolo 9/4: "instead of each combat tile being the size a human maybe each
   combat tile is the same size as the house and a pistol is like a dagger
   compared to the range of battle brothers and a rifle can do two tiles."
   *** AND rangeMult() IS THE WRONG DOOR, WHICH COST NOTHING ONLY BECAUSE IT WAS
   CHECKED. *** Its own comment calls it "the ONE DOOR every reach in the game
   passes through", so scale obviously belongs in it -- except isDark() is
   literally `rangeMult()<0.999`, and a house-scale board would have told the
   whole game it was NIGHT. V98's dark, V191's LIGHT IT, the spotter's night
   band, all of it, silently, with every check green. THAT IS THE DARKNESS DOOR.
   Scale gets its own, and isDark keeps reading only the night term.
   AT BODY SCALE hd(n) IS n/1, WHICH IS EXACTLY n FOR EVERY DOUBLE. The old
   board cannot move, and no seeded stream is touched, so every arena he has
   written down deals the same cards -- the 8/27 lesson, which this job's own
   row names. */
const HOUSE_K=8;        /* [DIAL] body-tiles to one house-tile */
const HOUSE_SIGHT=6;    /* [DIAL] houses you can see: a block. Reach is 1-2, so the approach band stays thick */
const HOUSE_CEIL=3;     /* [DIAL] the house-scale REACH_CEIL. hd(16) is 2, which would clip the scoped rifle to the plain one */
const TILE_WIDE=1.75;   /* [DIAL] a house tile in SPRITE WIDTHS -- his number, by eye, and his to change */
/* *** THE MAX IS HIS RULING. THE EFF IS DERIVED, AND THAT IS WHAT KEEPS THE
   ACCURACY CURVE HONEST. *** A pistol is a dagger and a rifle reaches two: those
   are his numbers and they are typed here. But rangeT is a RATIO built out of
   eff, so a house table with eff picked by hand would have QUIETLY MOVED THE
   ACCURACY CURVE while I was busy claiming it could not -- measured, a rifle at
   its own maximum read 0.556 against the body board's 0.429.
   So EFF CARRIES ACROSS THE BODY TABLE'S OWN eff/max RATIO. A pistol is 6/12 of
   its reach either way. The curve then comes out IDENTICAL at matching fractions
   of reach, which the gate checks rather than believes.
   AND IT IS WHERE "SHOTGUN AND SMG SIT BETWEEN" ACTUALLY LIVES: on a board whose
   only reaches are 1 and 2 there is no room between them in TILES, so the three
   short guns separate by RELIABILITY inside their one tile -- shotgun 0.56,
   pistol 0.50, smg 0.67 of it -- which is the same ordering the body board has.
   [PENDING Paolo] where a scoped rifle stops. 3 is an attempt, not a decision. */
const HOUSE_MAX={ shotgun:1, pistol:1, smg:1, rifle:2, sniper:3 };
function houseOn(){ return !!G.houseTile; }
function houseRange(w){
  const B=(w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol);
  const mx=HOUSE_MAX[w]!=null?HOUSE_MAX[w]:HOUSE_MAX.pistol;
  return {eff:mx*(B.eff/B.max), max:mx}; }
function tileK(){ return houseOn()?HOUSE_K:1; }
function hd(n){ return n/tileK(); }
function sightTiles(){ return houseOn()?HOUSE_SIGHT:SIGHT_TILES; }
function reachCeil(){ return houseOn()?HOUSE_CEIL:REACH_CEIL; }
/* GUNS ARE THE NEW MELEE, and the blades have to come with them: a knife at
   1.8 while a pistol reaches 1 would OUT-RANGE THE GUN and invert the ruling.
   So melee is MAPPED, not divided -- everything is adjacent, and the SPEAR,
   the one long-reach melee body, is the one that reaches two. */
function houseReach(r){ return (r>=3)?2:1; }
const SIGHT_TILES=17;   /* [DIAL] measured off the real canvas: 17.5 to the sides */""",
        what='the scale itself')

    # ---- 2. THE GUNS ----
    d = sub(d,
        "function wpnRange(w){ return (w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol); }",
        """function wpnRange(w){
  /* V198: ONE PLACE. Every reach in this fight reads its numbers here, so the
     house-scale table is swapped in at the door instead of at thirty use sites,
     and the body-scale table below is not touched by one byte. */
  if(houseOn())return houseRange(w);
  return (w==='sniper')?SNIPER_RANGE:(WEAPON_RANGE[w]||WEAPON_RANGE.pistol); }""",
        what='the guns')

    # ---- 3. THE FLOORS AND THE CEILING GO WITH THEM ----
    d = sub(d,
        "function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*k)); }",
        "function maxRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(reachCeil(), Math.max(hd(PT_BLANK+2), R.max*k)); }   /* V198: a floor written in body-tiles would be BIGGER than every house-scale gun and would quietly hand a pistol the rifle's reach */",
        what='maxRange floors')

    d = sub(d,
        "function effRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(maxRange(R,k), Math.max(PT_BLANK, R.eff*k)); }",
        "function effRange(R,mult){ const k=(mult==null)?rangeMult():mult; return Math.min(maxRange(R,k), Math.max(hd(PT_BLANK), R.eff*k)); }   /* V198 */",
        what='effRange floor')

    d = sub(d,
        "function farTile(){ return Math.max(PT_BLANK+2, FAR_TILE*rangeMult()); }",
        "function farTile(){ return Math.max(hd(PT_BLANK+2), hd(FAR_TILE)*rangeMult()); }   /* V198 */",
        what='farTile')

    d = sub(d,
        "function rangeT(d,R){ const F=Math.max(PT_BLANK+2,R.eff*1.6*rangeMult());   /* V98 scales every gun now, not one shared far end */",
        """/* *** V198 AND THIS IS WHERE "NO ACCURACY NUMBER MOVES" IS PROVED RATHER THAN
   PROMISED. *** The curve is a RATIO: (d - blank) / (far - blank). Scale the
   world, the gun's own eff and the point-blank band by the same number and the
   ratio is unchanged, so point blank is still 0.97 and the far end is still
   0.37 -- on one house instead of six body-tiles. The gate measures the curve
   at both settings instead of taking my word for it. */
function rangeT(d,R){ const F=Math.max(hd(PT_BLANK+2),R.eff*1.6*rangeMult());   /* V98 scales every gun now, not one shared far end */""",
        what='rangeT far end')

    d = sub(d,
        "  d=Math.max(1,d);\n  return Math.min(1,Math.max(0,(d-PT_BLANK)/(F-PT_BLANK))); }",
        """  d=Math.max(hd(1),d);   /* V198: A FLOOR OF ONE BODY-TILE IS HALF A HOUSE. Invisible on the old board because PT_BLANK is 4 and swallows it; on the house board it held every shot at 1 tile and bent the curve. Found by printing the numbers instead of deducing them */
  return Math.min(1,Math.max(0,(d-hd(PT_BLANK))/(F-hd(PT_BLANK)))); }   /* V198 */""",
        what='rangeT ratio and its hidden floor')

    d = sub(d,
        "const RANGE_EDGE=3;   /* [DIAL] how many tiles he beats the whole field by, for now */",
        "const RANGE_EDGE=3;   /* [DIAL] how many tiles he beats the whole field by, for now */   /* V198: read through hd() below -- three HOUSES of edge would be the whole board */",
        what='range edge note')

    d = sub(d,
        "  const need=longestFoeReach()+RANGE_EDGE;",
        "  const need=longestFoeReach()+hd(RANGE_EDGE);   /* V198 */",
        what='the player edge')

    # ---- 4. THE BOARD FOLLOWS THE WEAPON (the spawn band is already a multiple of range) ----
    d = sub(d,
        "  const _lo=Math.min(SIGHT_TILES, contentR(), Math.max(PT_BLANK+2, _R*SPAWN_NEAR));\n  const _hi=Math.min(SIGHT_TILES, contentR(), Math.max(_lo+1, _R*SPAWN_FAR));",
        """  /* V198: NOTHING HERE HAD TO CHANGE. SPAWN_NEAR/SPAWN_FAR are already
     "multiples of YOUR max range", so compressing the guns compresses the
     approach for free -- the board follows the weapon, which is what made this
     job small. Only the two absolute distances are read on the current ruler. */
  const _lo=Math.min(sightTiles(), contentR(), Math.max(hd(PT_BLANK+2), _R*SPAWN_NEAR));
  const _hi=Math.min(sightTiles(), contentR(), Math.max(_lo+hd(1), _R*SPAWN_FAR));""",
        what='the spawn band')

    d = sub(d,
        "    e.edist = (i===sniperIdx) ? Math.min(SIGHT_TILES, contentR(), Math.max(_hi, contentR()*0.90))",
        "    e.edist = (i===sniperIdx) ? Math.min(sightTiles(), contentR(), Math.max(_hi, contentR()*0.90))",
        what='the sniper spawn')

    # ---- 5. EYES ----
    d = sub(d,
        "  if((e.edist||0)>SIGHT_TILES)return false;             /* past the end of his eyes */",
        "  if((e.edist||0)>sightTiles())return false;             /* past the end of his eyes */   /* V198 */",
        what='his eyes')
    d = sub(d,
        "    if(sd>SIGHT_TILES)continue;",
        "    if(sd>sightTiles())continue;   /* V198 */",
        n=2, what='the spotter geometry')

    # ---- 6. THE BLADES ----
    d = sub(d,
        "adv:(a.adv||0),reach:(a.reach||0),cad:(a.cad||1),phase:i%2}",
        "adv:(houseOn()?((a.adv||0)?1:0):(a.adv||0)),reach:(houseOn()?((a.reach||0)?houseReach(a.reach):0):(a.reach||0)),cad:(a.cad||1),phase:i%2}",
        what='the blades')
    d = sub(d,
        "    if(b.trait==='quick'){ e.adv=3; e.cad=1; e.reach=1.8; e.melee=true; }",
        "    if(b.trait==='quick'){ e.adv=houseOn()?1:3; e.cad=1; e.reach=houseOn()?houseReach(1.8):1.8; e.melee=true; }   /* V198 */",
        what='the quick boss')

    # ---- 7. THE REST OF THE DISTANCES ----
    d = sub(d,
        "      const q=pXY(o); if(Math.hypot(q[0]-p[0],q[1]-p[1])>MEDIC_REACH)continue;",
        "      const q=pXY(o); if(Math.hypot(q[0]-p[0],q[1]-p[1])>hd(MEDIC_REACH))continue;   /* V198 */",
        what='the medic reach')

    d = sub(d,
        "const ALLY_LEASH=6;        /* [DIAL] how far he will get from you before he comes back */",
        "const ALLY_LEASH=6;        /* [DIAL] how far he will get from you before he comes back */   /* V198: read through hd() -- six HOUSES is the far side of the board */",
        what='ally leash note')
    d = sub(d,
        "  const home=Math.hypot(ax,ay)>ALLY_LEASH;   /* he is a companion, not a scout */",
        "  const home=Math.hypot(ax,ay)>hd(ALLY_LEASH);   /* he is a companion, not a scout */   /* V198 */",
        what='the leash')
    d = sub(d,
        "    lvl:myLvl()|0,ea:a,edist:ALLY_SPAWN,say:'',sayT:-99};",
        "    lvl:myLvl()|0,ea:a,edist:Math.max(1,hd(ALLY_SPAWN)),say:'',sayT:-99};   /* V198: she is still beside you, and beside you is one house now */",
        what='where she stands')


    # ---- 7b. AND THE SQUAD'S STANDOFFS, WHICH ARE THE ONES THAT ACTUALLY
    # BROKE IT. Measured before this block existed: 70% of house-scale fights
    # ended STUCK -- not lost, PINNED, the same failure mode the 1v8 curve
    # showed. The cause was not the guns, it was the AI holding at SQ_LANE 9.5,
    # a number written in BODY-tiles, so men backed off to nine and a half
    # HOUSES and never came back inside a two-tile reach. A DISTANCE CONSTANT
    # THAT DOES NOT KNOW WHAT A TILE IS WILL SIT THERE LOOKING CORRECT.
    d = sub(d,
        "    let standoff=(_aim||G.hold)?HOLD_PASS:PRESS_STANDOFF;",
        "    let standoff=(_aim||G.hold)?hd(HOLD_PASS):hd(PRESS_STANDOFF);   /* V198: THE ONE THAT ACTUALLY PINNED THE HOUSE BOARD. 3.2 body-tiles is 3.2 HOUSES, so every shooter refused to come closer than three houses while his own reach was one -- a whole squad standing in the street unable to shoot and unable to be shot */",
        what='the base standoff')
    d = sub(d,
        "  const bladeClosing=live.some(e=>e.melee&&(e.edist||99)<=SQ_HAMMER);",
        "  const bladeClosing=live.some(e=>e.melee&&(e.edist||99)<=hd(SQ_HAMMER));   /* V198 */",
        what='the hammer')
    d = sub(d,
        "      if(_sq.bladeClosing)standoff=Math.max(standoff,SQ_ANVIL);",
        "      if(_sq.bladeClosing)standoff=Math.max(standoff,hd(SQ_ANVIL));   /* V198 */",
        what='the anvil')
    d = sub(d,
        "      if(_sq.marksmanUp&&!(e.E&&e.E.spotter))standoff=Math.max(standoff,SQ_LANE);",
        "      if(_sq.marksmanUp&&!(e.E&&e.E.spotter))standoff=Math.max(standoff,hd(SQ_LANE));   /* V198 */",
        what='the lane')
    d = sub(d,
        "    if(P&&P.edist<COVER_REACH)return P; }",
        "    if(P&&P.edist<hd(COVER_REACH))return P; }   /* V198: a rock two HOUSES away is not the rock you are behind */",
        what='cover reach')
    d = sub(d,
        "    if(near<=KIT_CLOSE)kitVerb('close'); }catch(_x){} }",
        "    if(near<=hd(KIT_CLOSE))kitVerb('close'); }catch(_x){} }   /* V198 */",
        what='the dog')
    d = sub(d,
        "      if(Math.hypot(ox-sx,oy-sy)>ALARM_TILES)continue;",
        "      if(Math.hypot(ox-sx,oy-sy)>hd(ALARM_TILES))continue;   /* V198 */",
        what='the alarm')
    d = sub(d,
        "        if(Math.hypot(sx,sy)<=SHOUT_TILES){ markSeen(e); e.told=true; break; } } } }",
        "        if(Math.hypot(sx,sy)<=hd(SHOUT_TILES)){ markSeen(e); e.told=true; break; } } } }   /* V198 */",
        what='the shout')

    # ---- 7c. AND THE ONE THAT ACTUALLY PARKED THE FAR GUN OFF THE BOARD.
    # Traced rather than guessed: the sniper sat at 7.28 for eleven turns with a
    # reach of 3 and mine of 3, so nobody could finish him and the fight could
    # not end. He is spawned INSIDE sight and then SHOVED OUT by the occupancy
    # push -- +2.5, which is two and a half HOUSES -- against a ceiling of
    # MAX_RANGE 64, which is sixty-four of them.
    d = sub(d,
        "      if(!placed){ e.edist=Math.min(MAX_RANGE,e.edist+2.5); }   /* pushed OUTWARD, never left in a wreck */",
        "      if(!placed){ e.edist=Math.min(hd(MAX_RANGE),e.edist+hd(2.5)); }   /* pushed OUTWARD, never left in a wreck */   /* V198 */",
        what='the occupancy push')

    # ---- 7d. THE HIGH GROUND, WHICH IS WHERE THE FAR GUN WAS ACTUALLY
    # COMING FROM. Traced, after three wrong guesses that each cost a run: the
    # sniper sat at 7.28 for eleven turns and it was not the spawn band, not the
    # standoff and not the occupancy push. He is a DECK HOLDER, moved onto a
    # rooftop tile whose position comes from the arena's building geometry --
    # which has no idea a tile is a house. V140 added a guard so the deck could
    # not teleport a man INTO your reach; nothing ever guarded the other end, so
    # at house scale it teleports him out of everybody's. V160 wrote the sentence
    # for exactly this: "out there he could not see, shoot, or be shot. He was a
    # RUMOUR WITH A HEALTH BAR."
    # GATED ON THE HOUSE BOARD so the old board is not touched by one byte: at
    # body scale sight is 17 and this guard could bind, and a board that changes
    # is the one thing this job's row forbids.
    d = sub(d,
        "      if((T.edist||0) < _lo) continue;",
        "      if((T.edist||0) < _lo) continue;\n      if(houseOn() && (T.edist||0) > sightTiles()) continue;   /* V198: a roof you cannot see is not high ground, it is absence */",
        what='the high ground')

    # ---- 8. THE GROUND IS WIDER, AND THE SPRITE DOES NOT SHRINK ----
    d = sub(d,
        "const FIELD_PITCH=0.085/FIELD_ZOOM;",
        """const FIELD_PITCH=0.085/FIELD_ZOOM;
/* ===== V198 THE GROUND IS WIDER AND THE PERSON IS NOT ==================
   HIS SENTENCE: "the size of the 'ground' changes but the player is the same
   size just what they 'walk' on is a more zoomed out city so it really feels
   like war is spilling in the streets." So this multiplies the FLOOR PITCH and
   never touches bodyScale, which is what draws the body.
   MEASURED BEFORE PICKING THE NUMBER: a body-scale tile is min(W,H)*0.085/Z
   against a sprite of 112/Z, which is 430*0.085/112 = 0.33 SPRITE WIDTHS -- the
   person is three times wider than the tile he stands on, which is exactly why
   bodies overlap on the old board. His house tile is 1.75 sprite widths, so the
   multiplier is that ratio, DERIVED from the two numbers rather than eyeballed
   (the 8/31 lesson: an eyeballed offset lands inside the torso). */
function tileWideMult(W,H){
  if(!houseOn())return 1;
  const nat=Math.min(W,H)*FIELD_PITCH, spr=112*bodyScale();
  if(!(nat>0)||!(spr>0))return 1;
  return Math.max(1,(TILE_WIDE*spr)/nat); }
function fieldPitch(W,H){ return FIELD_PITCH*tileWideMult(W,H); }""",
        what='the wider ground')

    d = sub(d,
        "function contentR(){ return 0.85/FIELD_PITCH + 2; }",
        "function contentR(){ return 0.85/(FIELD_PITCH*(houseOn()?(TILE_WIDE*112*bodyScale())/(430*FIELD_PITCH):1)) + 2; }   /* V198: the world is built to what the screen shows, so a wider tile builds fewer of them */",
        what='content radius')

    d = sub(d,
        "function fieldPos(e,W,H,cx,cy){ const ring=Math.min(W,H)*FIELD_PITCH, rMin=ring*1.8, rMax=Math.min(W,H)*0.85;",
        "function fieldPos(e,W,H,cx,cy){ const ring=Math.min(W,H)*fieldPitch(W,H), rMin=ring*1.8, rMax=Math.min(W,H)*0.85;   /* V198 */",
        what='field position')

    d = sub(d,
        "  const ring=Math.min(W,H)*FIELD_PITCH;                      // 3x3 cell pitch (tap-friendly)",
        "  const ring=Math.min(W,H)*fieldPitch(W,H);                      // 3x3 cell pitch (tap-friendly)   /* V198 */",
        what='the floor pitch')

    d = sub(d,
        "      const ringF=Math.min(W,H)*FIELD_PITCH; let md=0;",
        "      const ringF=Math.min(W,H)*fieldPitch(W,H); let md=0;   /* V198 */",
        what='the auto frame')

    d = sub(d,
        "    const ring0=Math.min(W,H)*FIELD_PITCH; const tgtE=G.e[G.fireTarget];",
        "    const ring0=Math.min(W,H)*fieldPitch(W,H); const tgtE=G.e[G.fireTarget];   /* V198 */",
        what='the aim ring')

    # ---- 9. WHERE HE FLIPS IT (8/12) ----
    d = sub(d,
        """      <button id="allybtn" class="cbtn" style="border-color:#5fbf6a;color:#8fe89a">SHE FIGHTS WITH YOU: ON</button>""",
        """      <button id="allybtn" class="cbtn" style="border-color:#5fbf6a;color:#8fe89a">SHE FIGHTS WITH YOU: ON</button>
      <button id="housebtn" class="cbtn" style="border-color:#a88a5a;color:#e8c88a">TILE: A BODY</button>
      <button id="widebtn" class="cbtn" style="border-color:#a88a5a;color:#e8c88a">TILE WIDTH: 1.75</button>""",
        what='the dial buttons')

    d = sub(d,
        """    const fb=D('bossforget');""",
        """    /* V198 WHERE HE FLIPS IT (8/12: where does he change this himself). The
       human-scale board is NOT removed -- his row says so in those words -- so
       this is a dial and he plays both. Flipping it REBUILDS THE SAME ARENA:
       the seed is re-set before setupCombat, so no stream is advanced and no
       board he has written down is re-dealt (the 8/27 lesson, in this job's
       own row). */
    const hb=D('housebtn');
    const _paintHouse=()=>{ if(!hb)return;
      hb.textContent='TILE: '+(G.houseTile?'A HOUSE':'A BODY');
      hb.style.borderColor=G.houseTile?'#5fbf6a':'#a88a5a';
      hb.style.color=G.houseTile?'#8fe89a':'#e8c88a'; };
    if(hb)hb.addEventListener('click',()=>{ G.houseTile=!G.houseTile; _paintHouse();
      try{ const _s=BohemiaArena.get(); if(_s!=null)BohemiaArena.set(_s);
           setupCombat(); renderBoard();
           setRead(G.houseTile?'A TILE IS A HOUSE':'A TILE IS A BODY',
             G.houseTile?'a pistol reaches one house, a rifle two':'the old board, unchanged','#e8c88a'); }catch(_e){} });
    _paintHouse();
    const wb=D('widebtn');
    const _paintWide=()=>{ if(wb)wb.textContent='TILE WIDTH: '+(G.tileWide||TILE_WIDE).toFixed(2); };
    if(wb)wb.addEventListener('click',()=>{
      const steps=[1.25,1.50,1.75,2.00,2.50];
      const cur=(G.tileWide||TILE_WIDE);
      let i=steps.findIndex(s=>Math.abs(s-cur)<0.01); i=(i<0?2:i+1)%steps.length;
      G.tileWide=steps[i]; _paintWide();
      try{ renderBoard(); }catch(_e){} });
    _paintWide();
    const fb=D('bossforget');""",
        what='the dial wiring')

    # the width dial has to actually reach the render
    d = sub(d,
        "  return Math.max(1,(TILE_WIDE*spr)/nat); }",
        "  return Math.max(1,(((G.tileWide||TILE_WIDE))*spr)/nat); }",
        what='the width dial reaches the render')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v198: a tile is a house -- %d chars' % len(d))


if __name__ == '__main__':
    main()

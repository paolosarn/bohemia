#!/usr/bin/env python3
"""
V200 THE FIGHT IS THE ROOM. YOU WALK INTO A HOUSE AND FIGHT IN THE HOUSE.

VAMILY job: THE-INDOOR-FIGHT [indoor fights].
  The brief: "the door from the city works (gate 26/0); the indoor entry is the
  missing half."

-------------------------------------------------------------------------
THE ROOM WAS ALREADY BEING SENT, AND COMBAT WAS THROWING IT AWAY
-------------------------------------------------------------------------
This is not a feature that had to be invented. The walked city has posted the
whole building to the fight since V161, and the sending code says what happened
next IN ITS OWN COMMENT:

    "the ROOM rides along -- real dimensions, because INTERIOR-MATCHES-EXTERIOR
     means fp.W x fp.H IS the footprint. COMBAT DOES NOT CONSUME IT YET: walls as
     cover and doorways as chokepoints are the RF4 half... Sending it costs
     nothing and means the spec'd version has it waiting instead of needing
     another wire."

And on the fight's side of the seam, one line:

    if(enc){ enc.fromCity=true; enc.cityRoom=(d&&d.room)||null; }

*** `cityRoom` IS WRITTEN THERE AND READ BY NOTHING. *** One mention in the whole
repository, checked. The city measures the floor, the walls, the furniture, every
doorway and even a RETREAT ANALYSIS of the room, hands the lot to the fight, and
the fight builds a street. You walk through a front door and end up in a firefight
on a road.

So this row is a WIRE and a BOARD, not an invention, which is the fifth time this
lane has found the material already built and unreachable.

-------------------------------------------------------------------------
WHAT THE ROOM ALREADY CARRIES (nothing here is authored by me)
-------------------------------------------------------------------------
  w, h        real footprint -- INTERIOR-MATCHES-EXTERIOR (7/19) means the inside
              IS the outside, so the board is the building's true size
  floor       '#' blocked, '.' a body may stand here
  cover       'C' chest-to-head: blocks the body AND the line
              'l' knee-to-waist: blocks the body, NEVER the line (there is no
                  crouch in this game and a sofa cannot hide you)
  doors       every doorway, as [x,y]
  ground      the hazard classes, and interiors carry none yet
  retreat     whether every cell can reach somewhere it cannot be seen from

-------------------------------------------------------------------------
AND THE BOARD NEEDS NO NEW GEOMETRY, WHICH THE STREET GENERATOR SAYS OUT LOUD
-------------------------------------------------------------------------
    "three pillars in a row IS a wall, and every cover function in the demo
     already understands three pillars in a row. No new geometry, no new
     collision, no new cover rule."

So a wall cell becomes a pillar. 'C' furniture becomes a pillar. 'l' furniture
becomes a pillar with hard:false, which is ALREADY the file's word for "stops the
body, never the shot" -- it was written for glass and it is exactly the rule the
city's legend asks for. Nothing new is invented anywhere in this patch.

  * YOU START AT THE DOOR, because you walked in through it.
  * AND THERE IS NO WAY-OUT WIN INDOORS, which was caught by reading placeWayOut
    rather than trusting it: EXIT_MIN is 10 tiles and a real interior is 11x7, so
    V159's way out lands THROUGH THE WALL -- unreachable the moment walls stop
    bodies, with the HUD still reading "WAY OUT 14T" at it. A readout pointing at
    a tile you can never stand on is worse than no readout. V159 is about
    disengaging from an ambush in the open; you walked into this building on
    purpose, and leaving is the city's door, which already works.
    THE DOOR AS A FIGHTING RETREAT is the honest next piece and is NOT built: you
    start ON the door, so it would be an instant win, and fixing that is a
    mechanic rather than a wire.
  * THEY ARE DEEPER IN THE ROOM than you, on real floor cells, and the roster and
    the composition are untouched -- only WHERE they stand changes.
  * NO CARS INDOORS. scatterCars is skipped, which is not a rule, it is a sofa.

*** AND WALLS STOP PEOPLE NOW, WHICH THEY NEVER DID. *** Measured before writing
it: pillarAtXY has exactly two callers and both are the ENEMY press AI's scoring.
A pillar has never stopped the player from walking through it -- outdoors that is
invisible, because cover is scattered crates you would walk around anyway. In a
room it is the difference between a building and wallpaper: without it you stroll
out through the back wall on turn one.

NO DAMAGE BEFORE THE DIAL: applyDamage untouched, archetypes untouched, no
accuracy, range or resource number moves. This is a board, and who may stand where.

REUSE CHECK: cooks no graphic pixels and opens no bank. The room is the city's
own measurement; the pillars are the shipped pillar record; the blocking test is
the shipped pillarAtXY; the door is the shipped exit.

TASTE CHECK: nothing new on the fight screen and no new button. Indoors the board
is smaller and has walls, which is the whole point.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V200 THE FIGHT IS THE ROOM'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()

    # ================= THE SHELL SIDE: the room reaches the frame =========
    if MARK not in html:
        # 1. the city's room is handed to startEncounter instead of being parked
        html = sub(html,
            "    if(enc){ enc.fromCity=true; enc.cityRoom=(d&&d.room)||null; }",
            """    if(enc){ enc.fromCity=true; enc.cityRoom=(d&&d.room)||null; }""",
            what='city room parked (unchanged)')
        html = sub(html,
            """  const go=()=>{ const enc=startEncounter({
      packageId:(d&&d.packageId!=null)?d.packageId:1,
      roster:(d&&d.roster)||null,""",
            """  const go=()=>{ const enc=startEncounter({
      packageId:(d&&d.packageId!=null)?d.packageId:1,
      roster:(d&&d.roster)||null,
      room:(d&&d.room)||null,   /* V200: THE FIGHT IS THE ROOM. It was measured, sent and parked on enc.cityRoom, where exactly nothing read it */""",
            what='the room goes in')

        # 2. and it is posted to the frame BEFORE the encounter, so the board
        #    that gets built already knows it is a room.
        html = sub(html,
            "  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,",
            """  /* ===== V200 THE FIGHT IS THE ROOM ===============================
     Posted as its OWN message, immediately before the encounter, for two
     reasons. postMessage from one window is ORDERED, so the room is in hand
     before setupCombat runs and the board is built as a room the first time
     rather than being rebuilt into one. And it keeps the HANDOFF CORE -- which
     is a shared engine module -- untouched: adding a field to its contract
     would have made this row an engine change instead of a combat one. */
  combatPost({type:'BOHEMIA_FIGHT_ROOM',room:(spec.room||null)});
  combatPost({type:'BOHEMIA_ENCOUNTER',packageId:G.encounter.packageId,roster:roster,""",
            what='the room is posted first')

    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v200: already applied')
        open(ALPHA, 'w', encoding='utf-8').write(html)
        return
    if 'V199 A FIGHT ENDS WHEN SOMEBODY LEAVES' not in d:
        sys.exit('v200 needs v199 -- run the nerve patch first')

    # ================= THE FRAME SIDE ====================================
    # 3. hear the room. A listener of its own, so the handoff core is untouched.
    d = sub(d,
        "function setupEnemiesBody(){ const prev=G.e||[];",
        """/* ===== V200 THE FIGHT IS THE ROOM =================================
   THE-INDOOR-FIGHT. The walked city has posted the whole building to this fight
   since V161 and the sending code says what happened next in its own comment:
   "the ROOM rides along... COMBAT DOES NOT CONSUME IT YET." On this side it
   landed as `enc.cityRoom`, WRITTEN ONCE AND READ BY NOTHING -- one mention in
   the repository. The city measures floor, walls, furniture, every doorway and a
   retreat analysis of the room, hands it over, and the fight built a street.
   Nothing below is authored: the room is the city's measurement and the pillar
   is the shipped pillar. The street generator already wrote the rule this needs
   -- "three pillars in a row IS a wall, and every cover function in the demo
   already understands three pillars in a row. No new geometry, no new collision,
   no new cover rule." */
try{ window.addEventListener('message',function(ev){
  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIGHT_ROOM')return;
  G.cityRoom=q.room||null; G._roomFree=null; }); }catch(_e){}
function roomAt(R,x,y){ if(!R||!R.floor||x<0||y<0||x>=R.w||y>=R.h)return '#';
  return R.floor.charAt(y*R.w+x)||'#'; }
function roomCover(R,x,y){ if(!R||!R.cover||x<0||y<0||x>=R.w||y>=R.h)return '.';
  return R.cover.charAt(y*R.w+x)||'.'; }
/* WHERE A BODY STANDS IN THE ROOM, in the fight's own coordinates: the player is
   the origin, so a cell is just its offset from the cell he walked in on. */
function roomOff(x,y){ const P=G._roomAt||[0,0]; return [x-P[0],y-P[1]]; }
function buildFightRoom(){
  const R=G.cityRoom; if(!R||!R.w||!R.h||!R.floor)return false;
  /* YOU START AT THE DOOR, because you walked in through it. */
  let px=-1,py=-1;
  if(R.doors&&R.doors.length){ px=R.doors[0][0]|0; py=R.doors[0][1]|0; }
  if(px<0){ for(let y=0;y<R.h&&px<0;y++)for(let x=0;x<R.w;x++)
    if(roomAt(R,x,y)==='.'){ px=x; py=y; break; } }
  if(px<0)return false;
  G._roomAt=[px,py];
  /* EVERY BLOCKED CELL IS A PILLAR, and the two furniture classes are the two
     pillar kinds this file already has. 'l' is knee-to-waist -- it stops the
     body and NEVER the look, which is hard:false, the word written for glass. */
  const free=[];
  for(let y=0;y<R.h;y++)for(let x=0;x<R.w;x++){
    const f=roomAt(R,x,y), c=roomCover(R,x,y);
    const o=roomOff(x,y), dx=o[0], dy=o[1];
    if(!dx&&!dy)continue;                     /* the cell you are standing on */
    if(f==='#'||c==='C'||c==='l'){
      G.pillars.push({ea:Math.atan2(dy,dx),edist:Math.hypot(dx,dy),r:0.62,
        tall:(c!=='l'),hard:(c==='l')?false:true,room:true}); }
    else free.push([dx,dy]); }
  G._roomFree=free;
  /* AND THE OLD WAY OUT IS CLEARED HERE TOO, NOT ONLY REFUSED IN placeWayOut.
     Measured on the real wire: the marker SURVIVED FROM THE PREVIOUS FIGHT and
     the HUD read "WAY OUT" at a tile outside the building. Refusing to place a
     new one is not the same as clearing the old one, and the screen does not
     care which mistake it is. */
  G.exit=null; G._wonByExit=false;
  return true; }
function setupEnemiesBody(){ const prev=G.e||[];""",
        what='the room is heard and built')

    # 4. the board branches on it
    d = sub(d,
        """  G.arenaKind='street';
  G.pillars=[];
  if(G.arenaKind==='warehouse'){ buildWarehouse(); } else {""",
        """  /* V200: a room is an arena kind, beside the street. V110's warehouse stays
     unreachable and undeleted, exactly as he left it. */
  G.arenaKind=(G.cityRoom&&G.cityRoom.floor)?'room':'street';
  G.pillars=[]; G._roomFree=null; G._roomAt=null;
  if(G.arenaKind==='room'){ if(!buildFightRoom())G.arenaKind='street'; }
  if(G.arenaKind==='warehouse'){ buildWarehouse(); } else if(G.arenaKind!=='room'){""",
        what='the board branches')

    # 5. and they stand in the room, not on a polar band
    d = sub(d,
        """    try{ snapBody(e); }catch(_e){}
    G.e.push(e); }""",
        """    try{ snapBody(e); }catch(_e){}
    /* ===== V200 AND THEY ARE IN THE ROOM WITH YOU =====================
       The band above is "multiples of YOUR max range", which is right on a
       street and meaningless inside a house: it would put half of them through
       the wall. WHO they are, how many and what they carry is untouched -- the
       roster, the composition and the archetypes are the same fight. Only WHERE
       they stand changes, and they stand on real floor cells, the far ones
       first so the room reads deep instead of crowding the doorway. */
    if(G.arenaKind==='room'&&G._roomFree&&G._roomFree.length){
      if(!G._roomTaken)G._roomTaken={};
      let best=null,bs=-1;
      for(const c of G._roomFree){ const k=c[0]+','+c[1];
        if(G._roomTaken[k])continue;
        const dd=Math.hypot(c[0],c[1]);
        /* the farthest free cell that nobody has taken, so the last man in is
           not standing on the doorstep with the first */
        if(dd>bs){ bs=dd; best=c; } }
      if(best){ G._roomTaken[best[0]+','+best[1]]=1;
        putCell(e,best[0],best[1]); e.lvl=0; } }
    G.e.push(e); }""",
        what='they stand in the room')

    # 6. no cars indoors
    d = sub(d,
        "  scatterCars(G.arenaKind);   /* V103: after the cover, before the deck, so the",
        "  if(G.arenaKind!=='room')scatterCars(G.arenaKind);   /* V200: no cars indoors. Not a rule, a sofa */   /* V103: after the cover, before the deck, so the",
        what='no cars indoors')

    # 6b. AND THE SCREEN MUST NOT PROMISE A TILE THAT IS NOT THERE.
    # CAUGHT BEFORE SHIPPING, by reading placeWayOut instead of trusting it:
    # EXIT_MIN is 10 tiles and a real interior is 11x7, so V159's way out lands
    # OUTSIDE THE BUILDING -- and the moment walls started stopping bodies
    # (below) that made it permanently unreachable while the HUD kept reading
    # "WAY OUT 14T". A readout pointing at a tile you can never stand on is
    # worse than no readout.
    # SO INDOORS THERE IS NO WAY-OUT WIN. V159 is about disengaging from an
    # ambush in the open; you walked into this building on purpose. Leaving is
    # the CITY's door, which is its own system and already works.
    # THE DOOR AS A FIGHTING RETREAT -- step back onto it and be out -- is the
    # honest next piece and it is NOT built: you start ON the door, so it would
    # be an instant win, and fixing that is a mechanic rather than a wire.
    d = sub(d,
        "function placeWayOut(){ G.exit=null; G._wonByExit=false;\n  if(!EXIT_ON)return;",
        """function placeWayOut(){ G.exit=null; G._wonByExit=false;
  if(!EXIT_ON)return;
  /* V200: not indoors. EXIT_MIN is 10 tiles, a real interior is 11x7, so this
     would place the way out THROUGH THE WALL -- unreachable the moment a wall
     stops a body, with the HUD still reading WAY OUT 14T at it. */
  if(G.arenaKind==='room')return;""",
        what='no way out through a wall')

    # 7. AND WALLS STOP PEOPLE, WHICH THEY NEVER DID
    d = sub(d,
        "function worldShift(vx,vy){",
        """/* ===== V200 A WALL STOPS A BODY, WHICH IT NEVER DID ================
   MEASURED BEFORE WRITING IT: pillarAtXY has exactly two callers and both are
   the enemy press AI's scoring. NOTHING HAS EVER STOPPED THE PLAYER WALKING
   THROUGH COVER. Outdoors that is invisible -- scattered crates are things you
   would walk around anyway -- but in a room it is the difference between a
   building and wallpaper: without it you stroll out through the back wall on
   turn one and the fight is a street again.
   IT ONLY BINDS INDOORS. The street board is not touched, because changing what
   a body may walk through out there is a rule about every fight he has played
   and is not what this row asked for. */
function roomBlocked(dx,dy){
  if(G.arenaKind!=='room')return false;
  const R=G.cityRoom; if(!R||!G._roomAt)return false;
  const x=G._roomAt[0]+dx, y=G._roomAt[1]+dy;
  if(x<0||y<0||x>=R.w||y>=R.h)return true;   /* the footprint IS the board */
  const f=roomAt(R,x,y), c=roomCover(R,x,y);
  return f==='#'||c==='C'||c==='l'; }
function worldShift(vx,vy){
  /* V200: indoors, a step into a wall is refused and says so, instead of walking
     the whole world through the brickwork. */
  if(G.arenaKind==='room'&&roomBlocked(vx,vy)){
    try{ setRead('THAT IS A WALL','the room is the board now','#8a7d66'); }catch(_e){}
    return; }
  if(G.arenaKind==='room'&&G._roomAt){ G._roomAt=[G._roomAt[0]+vx,G._roomAt[1]+vy]; }""",
        what='a wall stops a body')

    # 8. AND IT HAS TO LOOK LIKE A ROOM, WHICH LOOKING AT IT IS WHAT CAUGHT.
    # The geometry was right and the screenshot was a STREET with a fence in it:
    # road, kerbs and sidewalk running away past the walls in every direction.
    # A player cannot be expected to work out he is indoors by bumping into
    # things -- RF4-48, already law in this lane: "if a mechanic can only be
    # understood from a menu, the recreation has failed on RF4's own terms."
    # AND THE ANSWER WAS ALREADY WRITTEN, one line up from where it was needed:
    # streetKindAt opens with `if(G.arenaKind==='warehouse')return 'slab';` under
    # the comment "V100: INDOORS THERE IS NO STREET. ONE MATERIAL, WALL TO WALL."
    # Same sentence, same material, one more arena kind. NOTHING IS COOKED.
    d = sub(d,
        "  if(G.arenaKind==='warehouse')return 'slab';",
        "  if(G.arenaKind==='warehouse'||G.arenaKind==='room')return 'slab';   /* V200: a room is indoors too, and V100 already wrote the rule */",
        what='indoors there is no street')

    # and past the walls there is no board at all, so it stops being painted
    d = sub(d,
        """      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;""",
        """      /* V200: OUTSIDE THE FOOTPRINT THERE IS NO BOARD. Painting the lot out
         past the walls is what turns "a street with a fence in it" into a
         building -- and it is honest, because a wall now stops a body, so
         those cells are somewhere he can never stand. */
      if(G.arenaKind==='room'&&G.cityRoom&&G._roomAt){
        const _rx=(wx-offx)+G._roomAt[0], _ry=(wy-offy)+G._roomAt[1];
        if(_rx<0||_ry<0||_rx>=G.cityRoom.w||_ry>=G.cityRoom.h){
          x.fillStyle='#0b0a08'; x.fillRect(sx2,sy2,t+1,t+1); continue; } }
      const _sk=streetKindAt(wx), _sn=(STREET_B64[_sk]||[1]).length;""",
        what='no board past the walls')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v200: the fight is the room -- %d chars' % len(d))


if __name__ == '__main__':
    main()

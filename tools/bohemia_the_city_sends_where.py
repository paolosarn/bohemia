#!/usr/bin/env python3
"""
THE CITY SENDS WHERE (9/5/26, SOUNDS lane) - BB-THE-CITY-SENDS-WHERE and the
row that rides it, BB-THE-DAY-SONG-PLAYS. One message, four systems.

MEASURED ON THE REAL SURFACE BEFORE TOUCHING ANYTHING, on a headless run that
clicked through the splash and walked:

    __AMB.seen        0        after 25 seconds on the walked surface
    __AMB.kind        null     the ambience bed has never chosen a bed
    __musicPhase()    NIGHT    while the city's own clock said 06:00
    __sfxSpace()      STREET   fixed forever
    __timePassStats   0 rows   the hour chime has never struck
    runFrame src      (none)   the ONE sender never even loads

And the positive control, posting the message by hand from the parent:

    __AMB.seen   -> a timestamp     __musicPhase() -> DAY
    __AMB.kind   -> 'air_day'       __sfxSpace()   -> OPEN

ALL FOUR SYSTEMS ARE FINISHED AND CORRECT. The handler is one branch and it
sets LISTENER.inside (occlusion), AMB.where (the ambience bed), musicPhase (the
day/night music pool) and timePass (the hour chime) in a single line. Nothing
was broken. THE SENDER WAS IN THE WRONG BUILDING: BOHEMIA_RUN_CURRENT.html has
posted BOHEMIA_WHERE every four seconds since 8/1, and the 8/14 migration moved
the walked surface into BOHEMIA_CITY_WORLD.html, which never posts it. The
city's only two hits for that string are FILENAMES INSIDE COMMENTS.

A MIGRATION LIST IS A DELETION LIST FOR EVERYTHING NOT ON IT. Same shape as the
stranded faction world on day 6. Nothing crashed, no gate went red, and four
finished systems have been dark for three weeks.

*** THE DAY SONG IS NOT A SECOND JOB. *** musicPhase() is the ONLY assignment to
CITYMUS.phase in the build and it is called from exactly one place: this
handler. So the walked city has been permanently NIGHT, and THE MARKER ON THE
DOOR -- tagged OVERWORLD DAY by his own hand, the one song he has said he likes
-- has been undrawable there since the migration. The alpha's own 8/4 block
already found and fixed this once, for the run, and the migration undid it. Its
row says VERIFY BY OBSERVED PHASE, NOT BY READING THE CODE, so the gate moves
the city's own clock with the city's own advance() and reads the phase back.

WHAT IT SENDS, and every field is the CITY'S OWN ANSWER, not a new opinion:

    inside  !!INSIDE            the city's interior state, set by inEnter
    night   isNight()           the city's own 19:00-06:00 rule
    min     T.min               the city's clock, the one the HUD prints
    space   ROOM / HALL         the run's own >=140 floor cells rule, ported
            STREET / OPEN       __surfaceOf, the city's OWN footstep classifier

REUSE CHECK: cooks nothing -- no bank, no candidate, no pixel, no new sound.
Every value it sends already existed in the city and every consumer already
existed in the shell. The two rules it needed were taken rather than invented:
the HALL threshold is the run's `cells>=140` verbatim, and STREET is decided by
__surfaceOf, the classifier the city already uses to pick a footstep, so the
road that sounds like asphalt underfoot is the same road that makes a canyon.

AND THE CROSSING IS INSTANT, WHICH THE RUN LEARNED ON 8/14 AND WROTE DOWN: the
four-second tick is right for a slow ambience bed and WRONG for occlusion, which
is a yes/no about the wall you just walked through, and wrong for the air of a
room, because AMB arms its bed on the crossing itself. So the four places the
city changes INSIDE say so the moment they run.

  python3 tools/bohemia_the_city_sends_where.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_CITY_SENDS_WHERE__'

HEARTBEAT = r'''
/* __THE_CITY_SENDS_WHERE__ (9/5, SOUNDS lane) -- ONE MESSAGE, FOUR SYSTEMS.
   MEASURED before this line existed, on the surface he walks: __AMB.seen was 0
   after 25 seconds of walking, __AMB.kind was null, __musicPhase() said NIGHT
   while the clock below said 06:00, and the hour chime had never struck once.
   Posting this same message by hand from the parent moved all four instantly,
   so nothing in the shell was ever broken -- the sender was in the other
   building. BOHEMIA_RUN_CURRENT.html has posted this every four seconds since
   8/1 and the 8/14 migration moved the walked surface here, where the only two
   hits for the string are filenames inside comments.
   ONE AUDIOCONTEXT, THE PARENT'S: this posts, the shell decides. */
function ctWhere(){
  try{
    if(!(window.parent&&window.parent!==window)) return;
    var inside=false; try{ inside=!!INSIDE; }catch(_i){}

    /* WHERE YOU ARE STANDING, in the shell's four-space vocabulary.
       INDOORS: the run's own rule, ported verbatim rather than reinvented --
       ~12x12 of walkable floor and up is a HALL, anything smaller is a ROOM. */
    var space='STREET';
    try{
      if(inside){
        var cells=0, fp=INSIDE.fp;
        if(fp&&fp.grid){
          for(var yy=0;yy<fp.grid.length;yy++)
            for(var xx=0;xx<fp.grid[yy].length;xx++)
              if(fp.grid[yy][xx]&&fp.grid[yy][xx].g==='floor') cells++;
        }
        space=(cells>=140)?'HALL':'ROOM';
      }else{
        /* OUTDOORS: a road within one cell is the canyon, open ground is not.
           __surfaceOf IS THE CITY'S OWN ANSWER -- the classifier that already
           decides whether a step sounds like asphalt -- so the street that
           sounds like a road underfoot is the same street that reflects. */
        var near=false, dx2, dy2, nc;
        for(dx2=-1;dx2<=1&&!near;dx2++) for(dy2=-1;dy2<=1;dy2++){
          try{ nc=cellAt(hx+dx2,hy+dy2);
               if(nc&&__surfaceOf(nc)==='asphalt'){ near=true; break; } }catch(_r){}
        }
        space=near?'STREET':'OPEN';
      }
    }catch(_s){}

    var night=false; try{ night=!!isNight(); }catch(_n){}
    var min=0; try{ min=T.min; }catch(_m){}
    window.parent.postMessage({type:'BOHEMIA_WHERE',
      inside:inside, night:night, min:min, space:space},'*');
  }catch(_e){}
}
window.__ctWhere=ctWhere;          /* so a gate can ask, and so a crossing can call */
setInterval(ctWhere,4000);
ctWhere();                         /* and once now, so the bed does not wait four seconds */
'''

# The four places INSIDE changes. THE RUN LEARNED THIS ON 8/14 AND WROTE IT
# DOWN: a four-second tick is fine for a slow ambience bed and wrong for
# occlusion, which is a yes/no about the wall you just walked through -- a
# neighbour's step three tiles away came back at gain 0.208 because the
# listener still thought it was indoors. AMB also arms its bed ON the crossing,
# so a late report is the air of a room arriving after you are already in it.
WIRES = [
    ('the door in -- inEnter is the ONE place a body goes through a door',
     "  try{ cityFightOnEnter(); }catch(_e){}\n"
     "  advance(0.5); return true;",
     "  try{ cityFightOnEnter(); }catch(_e){}\n"
     "  /* __THE_CITY_SENDS_WHERE__ -- the threshold is the moment, not four\n"
     "     seconds later: occlusion is a yes/no about the wall you just walked\n"
     "     through, and the bed arms on the crossing itself. */\n"
     "  try{ ctWhere(); }catch(_e){}\n"
     "  advance(0.5); return true;"),

    ('the door out -- the only cell that lets you off the plate',
     "      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;\n"
     "      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;",
     "      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;\n"
     "      try{ ctWhere(); }catch(_e){}   /* __THE_CITY_SENDS_WHERE__ */\n"
     "      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;"),

    ('zooming out of the walk leaves the building first',
     "swapMode=function(){ if(INSIDE){ hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null; } "
     "return _inSwap.apply(this,arguments); };",
     "swapMode=function(){ if(INSIDE){ hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;\n"
     "    try{ ctWhere(); }catch(_e){}   /* __THE_CITY_SENDS_WHERE__ */ } "
     "return _inSwap.apply(this,arguments); };"),

    ('waking at your own door, which can put you outdoors from indoors',
     "  hx=s[0]; hy=s[1]; INSIDE=null;\n"
     "  HOME_WAKE_PENDING=false;",
     "  hx=s[0]; hy=s[1]; INSIDE=null;\n"
     "  try{ ctWhere(); }catch(_e){}   /* __THE_CITY_SENDS_WHERE__ */\n"
     "  HOME_WAKE_PENDING=false;"),
]

TAIL = "\n</script>\n</body></html>"


def main():
    src = open(CITY, encoding='utf8').read()
    print('=== THE CITY SENDS WHERE ===')
    print('  %s: %d bytes' % (CITY, len(src)))

    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROL ON THE PREMISE ITSELF. If the city already posted this
    # message the whole job is a fiction, and the row's own claim is that its
    # only two hits are filenames inside comments.
    # AND THE COMMENTS COME OUT FIRST. Seven checks in this repo have matched
    # PROSE instead of code, including one that matched the comment explaining
    # the very fix it was checking for.
    code = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    code = re.sub(r'//[^\n]*', '', code)
    posts = code.count("type:'BOHEMIA_WHERE'")
    if posts:
        print('FAIL: the city already posts BOHEMIA_WHERE %d time(s) -- the '
              'premise of this job is that it does not, and a second sender '
              'would double every hour chime' % posts)
        return 1
    print('  premise holds: the city posts BOHEMIA_WHERE 0 times today')

    for what, anchor, rep in WIRES:
        if anchor not in src:
            print('FAIL: anchor missing for %s' % what)
            return 1
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)' % (what, src.count(anchor)))
            return 1
        src = src.replace(anchor, rep, 1)
        print('  CROSSING  %s' % what)

    if src.count(TAIL) != 1:
        print('FAIL: the end of the city script is not where this expects it')
        return 1
    src = src.replace(TAIL, HEARTBEAT + TAIL, 1)
    print('  HEARTBEAT installed at the end of the script, every 4000ms')

    open(CITY, 'w', encoding='utf8').write(src)
    print('  wrote %d bytes' % len(src))
    print('  FOUR SYSTEMS THIS TURNS BACK ON: the ambience bed (air_day, '
          'air_night, air_inside -- 15 of 15 thumbs up), occlusion, the '
          'day/night music pool, and the hour chime.')
    return 0


if __name__ == '__main__':
    sys.exit(main())

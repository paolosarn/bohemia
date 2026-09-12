#!/usr/bin/env python3
"""
V207 -- THE FIGHT KNOWS WHAT TIME IT IS  (COMBAT lane, [loot kept], third of three)

VAMILY row [loot kept] is three findings on one message. V206 did the two OUTBOUND
ones. This is the INBOUND one, BB-THE-FIGHT-KNOWS-THE-DAY, and the backlog's own
words are the brief:

    "EVERY PIPE FINDING IN THIS STUDY SO FAR HAS BEEN OUTBOUND. THIS IS THE FIRST
     INBOUND ONE: NOTHING GOES IN EITHER. MEASURED: enter(G,d,env) receives the
     player's HP, a roster, a package id and a stamina max. NO HOUR. NO
     TEMPERATURE. NO WEATHER. No memory that you just walked three kilometres to
     get there. And the first thing it does is cleanSlate(G) -- 'nothing from the
     last fight survives.'
     MEANWHILE THE WALKED CITY ORGANISES ITS ENTIRE DAY AROUND THE HEAT... THE
     DESERT IS THE SETTING OF THIS WHOLE GAME AND THE FIGHT TAKES PLACE IN A
     CLIMATE-CONTROLLED ROOM."

RE-MEASURED 9/12 AND STILL TRUE, which is why this row is still open four days
later. The positive control in that record nearly fooled me too and it holds: the
word `heat` appears 42 times in the decoded fight and every single one is MUZZLE
heat (shots stacking inside 2.5 s) or a car cooking off. Not one is temperature.

*** EVERY NUMBER HERE IS THE CITY'S OWN AND NOT ONE OF THEM IS INVENTED. *** That
is the whole discipline of this patch, because the easy version of it makes up a
temperature:
    the clock .......... T.min and T.day, the city's own minute clock
    night .............. isNight(), the city's own function
    the weather ........ BohemiaWeather.at(seed, day, t) -- sunny / cloudy / rain
                         and whether it is raining right now
    the wet ground ..... BohemiaWeather.wetness(...), which the city already dries
                         out over DRY_HOURS
    the heat window .... BohemiaPopulation.HEAT_FROM / HEAT_TO, READ OFF THE
                         POPULATION MODULE rather than copied, because 11:00-16:00
                         is the window every person's heatTol is already judged
                         against and a second copy of it is a second truth
    the shade .......... derived from sunVec() and the SAME cell test shadowPass
                         uses to paint shadows, so "you are in shade" means the
                         same thing as the shadow you can see on the ground

THERE IS NO TEMPERATURE IN DEGREES IN THIS PAYLOAD, ON PURPOSE. Nothing in the
repo holds one: "summer 40C+ afternoons" is a sentence in a comment, and HEAT_FROM
/ HEAT_TO is a WINDOW. MECHANISM-MINE / CONTENTS-PAOLO'S -- inventing 41C would be
authoring the climate of his valley in a patch tool.

IT RIDES AS ITS OWN MESSAGE, which is V200's pattern and its reason is good: the
handoff core is a SHARED ENGINE MODULE, and adding a field to its contract would
make this an engine change instead of a combat one. postMessage from one window is
ordered, so the world is in hand before the fight assembles.

NO DAMAGE BEFORE THE DIAL. *** THE FIGHT NOW KNOWS THE HOUR AND DOES NOTHING WITH
IT, AND THAT IS THE ROW, NOT A SHORTFALL. *** The row asks for the payload to carry
the world. What heat DOES to a fight is a damage dial we are not allowed to touch,
so this carries it, shows it to him in one line, and sends it back out on the way
so a quest can see the fight knew. Nothing reads it to change a number.
"""
import re
import sys
import base64

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__FIGHT_KNOWS_DAY__'


def sub(src, old, new, n=1, what=''):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %s' % (what, n, c, old[:140]))
    return src.replace(old, new, n)


CITY_BLOCK = r"""
/* ===== V207 __FIGHT_KNOWS_DAY__ -- THE WORLD RIDES IN WITH THE FIGHT ========
   BB-THE-FIGHT-KNOWS-THE-DAY: the fight received a roster and a health number and
   nothing about the world it is happening in. The desert is the setting of the
   whole game and the arena was climate controlled.
   EVERY FIELD IS READ OFF A SYSTEM THAT ALREADY OWNS IT. Nothing here decides
   anything about weather, time or heat; it asks the city. */

/* ARE YOU STANDING IN SHADE? Derived from sunVec() and THE SAME CELL TEST
   shadowPass uses to paint the shadows -- walk back along the sun direction and
   see whether a solid cell is close enough for its shadow to reach you -- so the
   answer means the same thing as the shadow he can see on the ground. Two
   separate rules for one shadow would drift the first time either moved. */
function cityShadeAt(gx, gy){
  var S=null; try{ S=(typeof sunVec==='function')?sunVec():null; }catch(_e){}
  if(!S) return true;                 /* the sun is below the horizon: all shade */
  for(var k=1;k<=SHADOW_MAX;k++){
    var c=null;
    try{ c=cellAt(Math.round(gx-k*S.dx), Math.round(gy-k*S.dy)); }catch(_e){}
    if(!c||!c.s) continue;
    var wh=c.wallH||((c.face||c.artPool==='hroof')?WALL_H:1);
    if(k<=Math.max(1,Math.min(SHADOW_MAX,Math.round(S.len*wh)))) return true;
  }
  return false;
}

/* WHAT THE WORLD IS DOING, AT THE PLACE THE FIGHT IS HAPPENING. The place comes
   from the encounter's own `at`, which every entry already fills in, so the shade
   is sampled where the fight is and not where the camera happens to be. */
function cityWorldNow(at){
  var min=T.min|0, day=T.day|0, t=min/1440;
  var w=null, wet=0, seed=0;
  try{ seed=BOH_ONE_SEED(); }catch(_e){}
  try{ w=BohemiaWeather.at(seed, day, t); }catch(_e){}
  try{ wet=BohemiaWeather.wetness(seed, day, t)||0; }catch(_e){}
  /* THE HEAT WINDOW IS THE POPULATION MODULE'S, not a copy of it: 11:00-16:00 is
     what every person's heatTol is judged against, and the valley's people and
     its fights must be hiding from the same sun. */
  var hf=null, ht=null;
  try{ if(typeof BohemiaPopulation!=='undefined' && BohemiaPopulation
        && BohemiaPopulation.HEAT_FROM!=null){
    hf=BohemiaPopulation.HEAT_FROM|0; ht=BohemiaPopulation.HEAT_TO|0; } }catch(_e){}
  var hh=Math.floor(min/60), mm=min%60;
  return {
    day: day, min: min, hour: hh,
    clock: ('0'+hh).slice(-2)+':'+('0'+mm).slice(-2),
    night: (function(){ try{ return !!isNight(); }catch(_e){ return null; } })(),
    state: (w&&w.state)||null,
    raining: !!(w&&w.raining),
    wet: Math.round(wet*100)/100,
    inHeat: (hf!=null)?(min>=hf&&min<ht):null,
    heatWindow: (hf!=null)?[hf,ht]:null,
    heatFrom: 'BohemiaPopulation',   /* so a reader can see it is not a second copy */
    shade: (at&&at.gx!=null)?cityShadeAt(at.gx|0,at.gy|0):null,
    /* NO TEMPERATURE IN DEGREES. Nothing in this repo holds one -- "summer 40C+
       afternoons" is a sentence in a comment -- and inventing a number for the
       climate of his valley is not this tool's to do. */
    degrees: null, draft: true };
}
/* ===== /V207 __FIGHT_KNOWS_DAY__ ===== */
"""


def patch_city():
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('  city slice already patched')
        return
    s = sub(s,
            "function cityHandOver(msg, skin){",
            CITY_BLOCK.strip() + "\nfunction cityHandOver(msg, skin){\n"
            "  /* V207 " + MARK + ": THE WORLD IS STAMPED ON EVERY ENTRY, IN ONE PLACE.\n"
            "     All four ways into a fight already come through this door (V205), so the\n"
            "     hour, the weather and the shade ride with a street bump, a crew, a road\n"
            "     party and a door into a room without four copies of anything -- and an\n"
            "     entry built after this one gets it without knowing it exists. */\n"
            "  try{ if(msg && !msg.world) msg.world=cityWorldNow(msg.at||null); }catch(_e){}",
            1, 'city/stamp')
    open(CITY, 'w', encoding='utf-8').write(s)
    print('V207 applied to', CITY)


BLOB_READ = r"""
/* ===== V207 __FIGHT_KNOWS_DAY__ -- AND THE FIGHT KEEPS IT ==================
   Its own message, for V200's reason: the handoff core is a shared engine module
   and a new field in its contract would make this an engine change. Ordered
   delivery means the world is in hand before the fight assembles, and G.world is
   not in BASE or EMPTY so cleanSlate leaves it alone -- which is exactly how
   G.cityRoom survives the same function. */
try{ addEventListener('message',function(ev){
  var q=ev&&ev.data; if(!q||q.type!=='BOHEMIA_FIGHT_WORLD')return;
  G.world=q.world||null; }); }catch(_e){}
/* AND HE CAN SEE IT, because a fight that secretly knows the hour is the same as
   a fight that does not. ONE LINE, and it never covers something louder: the
   teaching fight owns its readout (V202) and a quest objective owns its own line,
   so this speaks only when neither of those is talking.
   draft:true -- these are real attempts at the words, and the words are WORDS'. */
function worldRead(){
  var w=G.world; if(!w)return false;
  if(G.teachBeat)return false;                      /* the lesson owns the readout */
  if(G._ctx&&G._ctx.objective)return false;         /* his objective owns it */
  var when = w.night?'NIGHT':(w.inHeat?'THE WORST OF THE HEAT':(w.hour<11?'MORNING':'LATE DAY'));
  var bits=[];
  if(w.raining)bits.push('it is raining');
  else if(w.state==='CLOUDY')bits.push('clouded over');
  if(w.wet>0.15&&!w.raining)bits.push('the ground is still wet');
  bits.push(w.shade?'you are in shade':'you are in the open');
  try{ setRead(when+'  ·  '+w.clock, bits.join('  ·  '), '#c9bfa4'); }catch(_e){}
  return true; }
/* ===== /V207 __FIGHT_KNOWS_DAY__ ===== */
"""


def patch_blob(blob):
    if MARK in blob:
        print('  blob already patched')
        return blob, False
    # 1. the listener and the readout, beside the pocket this row's other half added
    blob = sub(blob,
               "/* ===== /V206 __LOOT_KEPT__ ===== */",
               "/* ===== /V206 __LOOT_KEPT__ ===== */\n" + BLOB_READ.strip(),
               1, 'blob/world')
    # 2. it goes back OUT on the way, so a quest can see the fight knew
    blob = sub(blob,
               "             rounds:(G.spare|0) } }; }",
               "             rounds:(G.spare|0) },\n"
               "      /* V207 " + MARK + ": and the world it happened in goes back out with\n"
               "         the result, so a quest step matching an outcome can see the fight knew\n"
               "         what time it was. Echoed, never re-derived: the fight has no clock of\n"
               "         its own and must not grow one. */\n"
               "      world:(G.world||null) }; }",
               1, 'blob/echo')
    # 3. and it is SAID, where the fight already finishes assembling and speaks.
    #    afterSetup is the engine's own "the board is built" hook and the objective
    #    chip is shown from it, which is exactly the company this line belongs in.
    blob = sub(blob,
               "    try{showObjective(G._ctx);}catch(_e){} },",
               "    try{showObjective(G._ctx);}catch(_e){}\n"
               "    /* V207 " + MARK + ": AND THE FIGHT SAYS WHAT IT IS STANDING IN. Here,\n"
               "       after the objective, because worldRead() stands down for an objective and\n"
               "       for the teaching fight -- a line he cannot act on must never cover one he\n"
               "       can. A fight that secretly knows the hour is the same as one that does\n"
               "       not. */\n"
               "    try{worldRead();}catch(_e){} },",
               1, 'blob/spoken')
    return blob, True


def patch_shell():
    s = open(ALPHA, encoding='utf-8').read()
    if MARK in s:
        print('  shell already patched')
        return
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')
    blob, changed = patch_blob(blob)
    if changed:
        s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]

    # the city's world reaches startEncounter
    s = sub(s,
            "      faction:(d&&d.faction)||null, reason:'walked in on them'});",
            "      faction:(d&&d.faction)||null, reason:'walked in on them',\n"
            "      world:(d&&d.world)||null});   /* V207 " + MARK + ": the hour, the weather and the shade */",
            1, 'shell/relay')
    # and it is posted as its own message, immediately before the encounter
    s = sub(s,
            "  combatPost({type:'BOHEMIA_FIGHT_ROOM',room:(spec.room||null)});",
            "  combatPost({type:'BOHEMIA_FIGHT_ROOM',room:(spec.room||null)});\n"
            "  /* V207 " + MARK + ": the same shape as the room above it and for the same\n"
            "     reason -- its own message, so the shared handoff contract is untouched. */\n"
            "  combatPost({type:'BOHEMIA_FIGHT_WORLD',world:(spec.world||null)});",
            1, 'shell/post')
    s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
               r'\g<1>BUILD 9/12j - THE FIGHT KNOWS THE HOUR\g<2>', s, count=1)
    open(ALPHA, 'w', encoding='utf-8').write(s)
    print('V207 applied to', ALPHA)


if __name__ == '__main__':
    patch_city()
    patch_shell()

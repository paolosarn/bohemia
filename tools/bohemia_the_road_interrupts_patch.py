#!/usr/bin/env python3
"""
THE ROAD INTERRUPTS -- FT-JOURNEY, THE MIDDLE
(8/27/26, RUN lane. Wires an APPROVED system that had zero callers.)

    "when it's fast travel it's gonna be like [Frontier] type shit"
    Paolo 8/24, LOCKED: laws/BOHEMIA_ADDENDUM_FAST_TRAVEL_IS_A_JOURNEY_8_24_26.md
    "Crossing the valley is something you PLAY, not something you skip."

AND HE SAID IT AGAIN THIS WEEK, TWICE, FROM TWO DIRECTIONS:
    8/25 playtest dispatch, item 8: ENEMIES, LOOT, and Valheim-style DANGER BY
                                   PLACE. Item 5: the city is dead and DEAD IS
                                   NOT THE DEFAULT.
    8/27, in his own words:        "maybe I wanna fuck around and start putting
                                   dogs and swarms of flies as low tier biome
                                   level one enemies or something."
The approved act-1 roster's token number ONE is `feral_dog_pack`.

=== WHAT THIS IS NOT ========================================================

IT DOES NOT WRITE AN ENCOUNTER SYSTEM. One already exists, and that is the
whole point of this patch.

    engine/bohemia_encounters.js -- THE AMBIENT ENCOUNTER DIRECTOR
    258 lines. Approved by Paolo 7/27 ("Approve all", on the 12-candidate act-1
    roster with the anti-boredom pacing package). Fully gated by
    gates/encounter_gate.js. Green for a month.
    *** AND A REPO-WIDE SEARCH FOR ITS NAME RETURNS ITS OWN GATE AND NOTHING
        ELSE. ZERO CALLERS. ***

That is the failure class this repo keeps naming and keeps repeating: the
seventeen invisible hats, the four Colorful garments worn by nobody for five
weeks, cardHide with no caller, vistaClose with no caller. A finished, approved,
gated thing that the player cannot reach DOES NOT EXIST. REUSE-FIRST is not only
about pixels.

So this file supplies the three things the director asks its caller for and
refuses to invent, and nothing else:
    1. the TIME the player actually spent
    2. a district table
    3. a way to answer its preconditions
and then it puts what comes back ON HIS SCREEN.

=== HOW TRAVEL FEEDS IT =====================================================

stepOnce's city branch already spends TEN MINUTES per marker cell (advance(10)).
That is 600 real seconds of his day, per press, and until now it bought nothing
but a moved marker. Now it is handed to the director, which is exactly the
contract the director was built to: "It is PULLED: the world asks it what happens
as part of a block of time the player actually spent."

NO CLOCK IS ADDED. The director owns none by design ("a world that keeps rolling
at an idle player is the thing the ruling forbids"), and neither does this. Stand
still and nothing happens, forever.

=== THE TABLE, AND WHY IT IS NOT ME INVENTING CANON =========================

MECHANISM-MINE / CONTENTS-PAOLO'S is why the director shipped with no table:
"WHICH tokens appear in WHICH district, and how heavily, is NOT ruled anywhere."

EVERYTHING IS A THUMB (8/9) flipped that default for exactly this case. A spawn
table is not a NAME he reserved and it is not a fork with no defensible answer.
It is work. So it is decided, built, and put where he meets it while playing, and
he corrects what he hates.

EVERY ROW IS DERIVED FROM THE ROSTER'S OWN WORDS, not from taste:
  casino_security_bot  "still enforcing 2020s trespass rules on ITS OLD PROPERTY"
                       -> the Strip and nowhere else.
  toll_crew            "raiders at A LEGIBLE CHOKEPOINT"
                       -> ramps and the interchange, not open surface street.
  spotter_drone        needs 'lit', "PATROLS OWNED LIGHT"  -> lit cells only.
  patrols_collide      needs 'seam', "at A TERRITORY SEAM" -> real owner seams.
  rattlesnake          a desert animal -> the wash and the rail corridor.
  bounty_squad         needs 'murders' -> and nothing can answer that yet, so it
                       never fires. The director's own rule: an unproven need is
                       not a spawn. That is a correct silence, not a hole.

=== WHAT AN ENCOUNTER COSTS, AND WHY IT IS TIME ============================

*** THE FORK IN THE LOCKED SPEC IS BLOCKED, AND NOT BY ME. *** The spec asks:
"did something happen between leaving and arriving that could have gone
differently". A real fork needs a real downside for pushing through, and the
downside of walking into a feral dog pack is DAMAGE. NO DAMAGE BEFORE THE DIAL.
EVER. The dial is his.

So this does not ship a fake choice. A fork whose two arms are "free" and "worse"
is a costume, and shipping one would be the loading screen the spec bans wearing
a second costume.

WHAT IS HONEST, AND IS REAL, AND IS IN THE CURRENCY THE GAME ALREADY SPENDS:
AN INTERRUPTION EATS YOUR DAY. TIME IS SPENT BY ACTIONS is already law, the
journey already costs ten minutes a cell, and a fight in the road plainly costs
more than a coyote walking beside you.

    ambient      0 extra minutes   you saw a thing, you kept walking
    interactive  10                you had to deal with somebody
    forced       20                it did not let you past

WHICH MAKES DANGER BY PLACE REAL WITHOUT A DAMAGE NUMBER: the interchange at
night runs a heavier table than the arterial at noon, so that route genuinely
eats more of his day. Route becomes a cost. That is the half of the spec that can
be built today, and the record says plainly which half cannot.

THE THREE NUMBERS ABOVE ARE MINE, NOT HIS. They print in the gate every run so
they are visible and correctable rather than buried.

=== THE WORDS ===============================================================

Twelve road moments, one per approved token, written as if they ship and tagged
draft:true (ALWAYS MAKE AN ATTEMPT, 8/11 -- an empty field is a blank page and he
edits, he does not write from nothing). Against the VOICE CARD: contracted,
sentence lengths broken on purpose, one physical detail nobody else would name,
nobody wise, no aphorism in the last sentence, not one em dash. The scavenger
asks the player a question and loses his thread mid-sentence, because in 504 NPC
speeches there were two question marks and zero stumbles.

REUSE CHECK: cooks NO pixels. Opens no banks/ because it draws nothing -- the
card is cardShow(), the app's existing modal, which already carries its own
close, scrim-tap and Escape from __EVERY_PANEL_CLOSES__. No new art, no new
modal, no second copy of the director.

Idempotent (marker __THE_ROAD_INTERRUPTS__).
"""
import os
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ENGINE = 'engine/bohemia_encounters.js'
MARK = '__THE_ROAD_INTERRUPTS__'

STEP_OLD = ("    if(cityWalkable(nx,ny)){ city.x=nx; city.y=ny; advance(10); "
            "moversAdvance(); return true; }")

STEP_NEW = """    if(cityWalkable(nx,ny)){ city.x=nx; city.y=ny; advance(10); moversAdvance();
      /* """ + MARK + """: TEN MINUTES OF HIS DAY JUST WENT BY. Hand it to the
         approved director and let the road have its say. This is the whole wiring:
         the time was always being spent, it just never bought anything. */
      try{ roadInterrupt(600); }catch(_e){}
      return true; }"""

ANCHOR = 'function cityWalkable(x,y){'


def block(engine_src):
    return '''/* ==== ''' + ENGINE + ''' (inlined verbatim, ''' + MARK + ''') ====
   ONE CANONICAL BODY. This is a machine copy of the engine file, not a retype,
   and the gate compares the two normalized bodies so they can never drift.
   ENGINE SYNC LAW, held for a module the BOH_* sync gate cannot see (this one is
   an IIFE on window.BohemiaEncounters, not a `const BOH_x=`). */
''' + engine_src + '''
/* ==== end ''' + ENGINE + ''' ==== */

/* ============================================================================
   ''' + MARK + ''' -- FT-JOURNEY, THE MIDDLE (8/27)
   Everything below is the CALLER the director has been waiting a month for. It
   supplies spent time, a district table and an answer to preconditions. It makes
   no pacing decisions: the 70/20/10 mix, the 90 second floor, the storyteller
   budget and the spice cap are all his, approved 7/27, and they live in the
   engine above where they were approved.
   ========================================================================== */

/* WHICH TOKENS RIDE WHICH ROAD. Every row is read off the roster's own verb
   text; see the patch tool's header for the derivation line by line. Only
   ROAD districts appear, because the marker only ever walks roads. */
var ROAD_TABLE = {
  arterial:    { day:   ['coyote_shadow','scavenger_shakedown','feral_dog_pack'],
                 night: ['coyote_shadow','ghost_robotaxi','the_snatcher',
                         'feral_dog_pack','crazed_wanderer'] },
  strip:       { day:   ['ghost_robotaxi','spotter_drone','casino_security_bot'],
                 night: ['ghost_robotaxi','patrols_collide','spotter_drone',
                         'the_snatcher','casino_security_bot'] },
  freeway:     { day:   ['ghost_robotaxi','toll_crew','bounty_squad'],
                 night: ['coyote_shadow','toll_crew','crazed_wanderer'] },
  beltway:     { day:   ['ghost_robotaxi','toll_crew','feral_dog_pack'],
                 night: ['coyote_shadow','toll_crew','feral_dog_pack'] },
  interchange: { day:   ['patrols_collide','toll_crew','bounty_squad'],
                 night: ['patrols_collide','toll_crew','crazed_wanderer'] },
  rail:        { day:   ['coyote_shadow','rattlesnake','feral_dog_pack'],
                 night: ['coyote_shadow','rattlesnake','crazed_wanderer'] },
  wash:        { day:   ['coyote_shadow','rattlesnake','feral_dog_pack'],
                 night: ['coyote_shadow','rattlesnake','feral_dog_pack'] }
};

/* WHAT AN INTERRUPTION COSTS, IN MINUTES OF HIS DAY. Mine, not his (see the
   header: the real fork wants a damage dial and the dial is his). */
var ROAD_COST = { ambient: 0, interactive: 10, forced: 20 };

/* THE TWELVE ROAD MOMENTS. draft:true -- every word of this is his to rewrite in
   the WORDS tab, and none of it was ever put to him for approval. */
var ROAD_WORDS = {
  feral_dog_pack:
    "Six of them come out of the wash, low and quiet. The lead one still has a "
    + "collar on, tag swinging. None of them are barking.",
  coyote_shadow:
    "A coyote picks you up at the corner and just walks. Your speed, thirty feet "
    + "off, never looks over. It'll do a block of that and then it's gone.",
  rattlesnake:
    "Something under the slab moves, then rattles. Dry and close. You've got "
    + "about two seconds to pick where your foot goes.",
  scavenger_shakedown:
    "A guy steps out with a length of pipe and he's already talking. \\"Look. "
    + "Look, I don't want, I'm not, okay. Just what's in the bag. You got water "
    + "in there?\\" His hands aren't steady.",
  toll_crew:
    "Four of them have the ramp. One's sitting on a cooler like it's his desk. "
    + "\\"Toll's a third. Argue if you want. Ramp's been ours since March.\\"",
  the_snatcher:
    "A kid comes off your blind side, takes something off your belt, gone before "
    + "you finish turning. He's already forty feet out. Fast.",
  crazed_wanderer:
    "A man comes up the middle of the road screaming at nobody. No shoes. He "
    + "sees you and he doesn't slow down.",
  bounty_squad:
    "Three of them, spread wide, moving like they've done this before. One's "
    + "carrying a folded piece of paper with your description on it. He checks "
    + "it twice.",
  casino_security_bot:
    "It rolls out from under the porte cochere still running its script. \\"THIS "
    + "PROPERTY IS PRIVATE. PLEASE PRESENT.\\" Half its face is gone. It keeps "
    + "coming.",
  spotter_drone:
    "It's been over you a while and you're only now hearing it. Small, four "
    + "rotors, holding still. Then it climbs and turns north.",
  ghost_robotaxi:
    "An empty cab pulls to the curb ahead and opens its door for nobody. Waits "
    + "its ninety seconds. Pulls off.",
  patrols_collide:
    "Two crews find each other at the seam and it goes off before anybody says "
    + "anything. Six, maybe eight. Neither of them has looked your way."
};

var ROAD_DIR = null, ROAD_LOG = [];

/* THE PRECONDITIONS THE ROSTER STATES OUTRIGHT. Answered off systems that
   already exist; anything this cannot prove returns false, and the director's
   own rule is that an unproven need is not a spawn. */
function roadCan(need){
  try{
    if(need==='lit') return !!(POWER.at(city.x,city.y)||{}).live;
    if(need==='seam'){
      /* A SEAM IS TWO OWNERS TOUCHING. LIGHT=TERRITORY: a live circuit's owner
         is who holds that ground, so a seam is where two different live owners
         are adjacent. Not a metaphor, the grid's own data. */
      var me=POWER.at(city.x,city.y)||{};
      if(!me.live||!me.owner) return false;
      var d=[[1,0],[-1,0],[0,1],[0,-1]];
      for(var i=0;i<d.length;i++){
        var n=POWER.at(city.x+d[i][0],city.y+d[i][1])||{};
        if(n.live&&n.owner&&n.owner!==me.owner) return true;
      }
      return false;
    }
    /* 'murders' HAS NO ANSWER IN THIS BUILD and inventing one would be inventing
       canon. NO DAMAGE BEFORE THE DIAL means there is no kill count to read. So
       the bounty squad correctly never comes, and the day the dial lands it will
       start coming on its own. */
  }catch(_e){}
  return false;
}

function roadDirector(){
  if(ROAD_DIR) return ROAD_DIR;
  if(typeof BohemiaEncounters==='undefined') return null;
  ROAD_DIR = BohemiaEncounters.makeDirector({
    seed: (typeof seed!=='undefined' ? seed : 0),
    /* A TOKEN MAY COME ROUND AGAIN AFTER TWO HOURS OF TRAVEL. Not ruled, so the
       engine has no default and would otherwise fire each token at most ONCE
       per session, which makes the road go permanently quiet after twelve
       moments. Two hours of travel is about twelve cells at ten minutes a cell.
       Mine, and it prints in the gate. */
    repeatAfterS: 7200,
    tableFor: function(district, phase){
      var row = ROAD_TABLE[district];
      /* NO GLOBAL SPAWNS EVER: a district with no row spawns nothing, and there
         is deliberately nothing to fall back on. */
      return row ? (row[phase] || null) : null;
    }
  });
  return ROAD_DIR;
}

/* THE PULL. Called from stepOnce's city branch with the seconds his day just
   lost. Returns the director's answer either way, because a director that
   cannot explain itself cannot be tuned. */
function roadInterrupt(spentSeconds){
  var dir = roadDirector();
  if(!dir) return { fired:false, reason:'NO_DIRECTOR' };
  var cell = null;
  try{ cell = om.at(city.x, city.y); }catch(_e){}
  var world = {
    district: cell && cell.district,
    phase: (typeof isNight==='function' && isNight()) ? 'night' : 'day',
    health: 1, heat: 0,
    can: function(need){ return roadCan(need); }
  };
  var got = dir.consider(world, spentSeconds);
  if(got && got.fired){
    ROAD_LOG.push(got);
    /* THE INTERRUPTION EATS THE DAY. In minutes, through the clock the whole
       game already spends. */
    var mins = ROAD_COST[got.kind] || 0;
    if(mins>0){ try{ advance(mins); }catch(_e){} }
    try{ roadCard(got, mins); }catch(_e){}
  }
  return got;
}

/* WHAT HE SEES. Reuses cardShow, which already gives every card a real close, a
   scrim tap and Escape (__EVERY_PANEL_CLOSES__). No second modal. */
function roadCard(ev, mins){
  if(typeof cardShow!=='function') return;
  var where = (ev.at && ev.at.district ? String(ev.at.district).toUpperCase() : 'THE ROAD');
  var when  = (ev.at && ev.at.phase==='night') ? 'NIGHT' : 'DAY';
  var words = ROAD_WORDS[ev.id] || '';
  var cost  = mins>0 ? ('<div class="rrow"><span class="rk">THAT COST YOU</span>'
                        + '<span class="rv">' + mins + ' MIN</span></div>') : '';
  cardShow(
    '<div class="rk" style="margin-bottom:8px">ON THE ROAD \\u00b7 ' + esc(where)
      + ' \\u00b7 ' + when + '</div>'
    + '<div class="rv" style="text-align:left;margin-bottom:10px">'
      + esc(String(ev.name).toUpperCase()) + '</div>'
    + '<div class="rwhy" data-draft="true">' + esc(words) + '</div>'
    + cost
    + '<div class="mrow" data-act="close"><span class="mgood">KEEP MOVING</span>'
      + '<span class="mprice">\\u2192</span></div>');
}

'''


def main():
    for p in (CITY, ENGINE):
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the road already interrupts')
        return
    eng = open(ENGINE, encoding='utf8').read().rstrip('\n')

    for needle, why in ((ANCHOR, 'where the block goes'),
                        (STEP_OLD, 'the city branch of stepOnce'),
                        ('function cardShow(', 'the card this reuses'),
                        ('function esc(', 'the escaper this reuses')):
        if s.count(needle) != 1:
            sys.exit('FAIL: anchor "%s" matched %d times, expected 1 (%s)'
                     % (needle[:44], s.count(needle), why))

    s = s.replace(ANCHOR, block(eng) + ANCHOR, 1)
    s = s.replace(STEP_OLD, STEP_NEW, 1)
    open(CITY, 'w', encoding='utf8').write(s)
    n = len(re.findall(r'\bid:', eng))
    print('PATCHED %s -- the approved encounter director has a caller '
          '(%d roster ids inlined, %d road districts tabled)'
          % (CITY, n, len(ROAD_DISTRICTS)))


ROAD_DISTRICTS = ['arterial', 'strip', 'freeway', 'beltway', 'interchange', 'rail', 'wash']

if __name__ == '__main__':
    main()

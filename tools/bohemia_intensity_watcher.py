#!/usr/bin/env python3
"""
THE OTHER HALF OF HIS INTENSITY LADDER (8/27/26).

HIS RULING, 8/26, LOCKED:
    "overworld calmness lvl 1 then an enemy trying to hurt you or someone is
     talking to you is lvl 2 then you either kill 2 enemies or theresa whole
     bunch of people close together talking type shit for lvl 3"

Two of the four triggers shipped that day. Two did not, and they were reported
as unwired rather than counted as shipped:

    kills    WIRED    combat posts a killshot outcome
    threat   WIRED    BOHEMIA_COMBAT_STARTED / BOHEMIA_PLAYER_HIT
    talking  UNWIRED  a conversation begins INSIDE the city frame
    crowd    UNWIRED  nothing counted people near you

A ruling half-built is a ruling that does not exist. This is the other half.

REUSE CHECK: cooks nothing -- no bank, no candidate, no voice, no pixel. It adds
one watcher to the shell that READS state the city already publishes.

AND IT DOES NOT TOUCH THE CITY. slices/BOHEMIA_CITY_WORLD.html belongs to another
lane and ONE SYSTEM ONE SESSION means this tool does not reach into it. It does
not have to: the city already exposes `window.__CT`, and measuring it live rather
than reading the source for it, that API answers both questions exactly --

    __CT.everyone()   [{key,tier,name,heading,x,y,d}, ...]   d IS THE DISTANCE
    #ctcard's display  true while a conversation card is up

AND ONE OF THOSE WAS A TRAP THAT ALMOST SHIPPED. The obvious signal for "someone
is talking to you" is __CT.open(), and it is NOT A GETTER:

    open:function(){ ctOpen(); return !!CT_OPEN; }

It OPENS a conversation and then reports that one is open. A watcher polling it
twice a second would have shoved a dialogue card in the player's face
continuously from the moment they stood next to anybody. Probing its RETURN VALUE
looked exactly like a getter -- it answered false, over and over, because nobody
was adjacent in the probe. Only reading its body showed what it does. A NAME IS
NOT A CONTRACT, and a live probe that never triggers the side effect will happily
confirm the wrong model. The watcher reads the visible card instead, which is the
same fact and costs nothing.

So the shell watches the frame it already embeds, same-origin, in a try/catch
that degrades to exactly today's behaviour if a browser ever refuses. No new
message, no new city code, no second copy of any state.

ONE NUMBER IS MINE AND IT IS SAID OUT LOUD. He said "a whole bunch of people
close together" and did not give a count or a radius, so MECHANISM-MINE /
CONTENTS-PAOLO'S applies: the mechanism ships with a defensible default and the
number is his to move. THREE people within FIVE tiles. Three is the smallest
number that is a group rather than a pair, and five tiles is close enough that
they are one gathering rather than three separate people who happen to be on
screen.

AND ONE HONEST LIMIT, STATED RATHER THAN PAPERED OVER. He said people "close
together TALKING". The city does not model people talking to EACH OTHER -- it
models people, where they are, and whether one of them is talking to YOU. So
CROWD is implemented as the nearest observable truth: a cluster of people around
you. If he wants literal chatter between NPCs to be the trigger, that is a city
feature that does not exist yet and this tool cannot invent it.

  python3 tools/bohemia_intensity_watcher.py           # report
  python3 tools/bohemia_intensity_watcher.py --write   # install
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')

MARK = '__INTENSITY_WATCHER__'

# goes in right after the ladder declares itself, so the reader meets the
# triggers next to the thing they drive
ANCHOR = 'window.INTENSITY=KILLMUS;'

BLOCK = r"""
/* ===== __INTENSITY_WATCHER__ (8/27) -- THE OTHER TWO TRIGGERS ==============
   Paolo 8/26, LOCKED: "...an enemy trying to hurt you or SOMEONE IS TALKING TO
   YOU is lvl 2 then you either kill 2 enemies or THERESA WHOLE BUNCH OF PEOPLE
   CLOSE TOGETHER TALKING type shit for lvl 3."
   Kills and threat were wired that day. These two were not, and were reported
   as unwired rather than quietly counted as shipped. A ruling half-built is a
   ruling that does not exist.

   IT READS THE CITY, IT DOES NOT EDIT THE CITY. BOHEMIA_CITY_WORLD.html is
   another lane's file. It does not need touching: the frame already publishes
   window.__CT and the frame's own DOM, and both questions are answerable from
   outside --
     #ctcard's display   a conversation card is up
     __CT.everyone()     [{key,tier,name,heading,x,y,d}...]  and d IS the distance
   Same-origin, in a try/catch, polled off the game's own clock. If a browser
   ever refuses the frame, the catch leaves the ladder exactly where it is
   today rather than breaking it.

   THE TWO NUMBERS ARE MINE AND THEY ARE SAID OUT LOUD. He said "a whole bunch
   close together" and gave no count and no radius, so the mechanism ships with
   a defensible default and the numbers are his to move: THREE people within
   FIVE tiles. Three is the smallest number that is a group rather than a pair;
   five tiles is one gathering rather than three strangers who happen to be on
   screen.

   AND THE LIMIT, STATED: the city models people, where they are, and whether
   one is talking to YOU. It does not model NPCs talking to EACH OTHER. CROWD is
   therefore the nearest observable truth -- a cluster around you -- and if he
   wants literal chatter between them, that is a city feature that does not
   exist yet. */
(function intensityWatcher(){
  var CROWD_MIN = 3;      /* smallest number that is a group, not a pair */
  var CROWD_R   = 5;      /* tiles: one gathering, not three separate people */
  var lastTalk = null, lastCrowd = null;
  function look(){
    try{
      if(!window.INTENSITY) return;
      var f = document.getElementById('cityFrame');
      if(!f) return;
      var w = f.contentWindow;
      if(!w || !w.__CT) return;
      var talking = false, crowd = false;
      /* READ THE CARD, NEVER CALL __CT.open() (8/27, caught before it shipped).
         `open` READS LIKE A GETTER AND IS AN ACTION:
             open:function(){ ctOpen(); return !!CT_OPEN; }
         It OPENS a conversation and then reports that one is open. A watcher
         polling it twice a second would have shoved a dialogue card in the
         player's face continuously from the moment they stood next to anybody.
         Probing its RETURN VALUE looked exactly like a getter; only reading its
         body showed what it does. A NAME IS NOT A CONTRACT.
         The visible card is the same fact and reading it costs nothing. */
      try{
        var card = w.document.getElementById('ctcard');
        talking = !!(card && w.getComputedStyle(card).display !== 'none');
      }catch(_e){}
      try{
        var all = w.__CT.everyone() || [];
        var n = 0;
        for(var i=0;i<all.length;i++){
          var d = all[i] && all[i].d;
          if(typeof d === 'number' && d <= CROWD_R) n++;
        }
        crowd = n >= CROWD_MIN;
      }catch(_e){}
      /* only speak when it CHANGES: INTENSITY.apply() already returns early on
         a repeat, but calling it four times a second forever is noise in every
         profile and in every gate that counts calls */
      if(talking !== lastTalk){ lastTalk = talking; INTENSITY.talking(talking); }
      if(crowd   !== lastCrowd){ lastCrowd = crowd;  INTENSITY.crowd(crowd); }
    }catch(_e){}
  }
  setInterval(look, 500);
  /* exposed so a gate can drive one look without waiting on a timer, and so the
     numbers are inspectable rather than buried */
  window.__intensityWatch = { look: look, CROWD_MIN: CROWD_MIN, CROWD_R: CROWD_R,
    state: function(){ return { talking:lastTalk, crowd:lastCrowd }; } };
})();
"""


def main():
    write = '--write' in sys.argv
    s = open(ALPHA, encoding='utf8').read()

    if MARK in s:
        print('=== INTENSITY WATCHER ===')
        print('  already installed (idempotent, nothing to do)')
        return 0
    if ANCHOR not in s:
        print('FAIL: the ladder does not declare window.INTENSITY where this tool '
              'expects it; refusing to guess where the watcher goes')
        return 1
    # THE LADDER HAS TO EXIST FIRST. Wiring triggers into an object that is not
    # there would install two setters nobody can call, which is the exact defect
    # this tool was written to close.
    for needed in ('talking(on){', 'crowd(on){'):
        if needed not in s:
            print('FAIL: INTENSITY has no %s -- the 8/26 ladder is not in this '
                  'build, so there is nothing to wire' % needed.rstrip('{'))
            return 1

    s = s.replace(ANCHOR, ANCHOR + BLOCK, 1)
    print('=== INTENSITY WATCHER ===')
    print('  wires the two triggers Paolo ruled on 8/26 that shipped unwired:')
    # NOT __CT.open(). That is an action, not a getter, and a tool whose own
    # report names the trap it exists to avoid will teach the next reader the
    # wrong thing.
    print('    talking  <- #ctcard is visible   a conversation card is up')
    print('    crowd    <- __CT.everyone()      3+ people within 5 tiles')
    print('  the city file is NOT touched.')
    if not write:
        print('\n(--write to install)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('  wrote %s' % os.path.relpath(ALPHA, ROOT))
    return 0


if __name__ == '__main__':
    sys.exit(main())

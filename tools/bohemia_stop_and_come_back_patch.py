#!/usr/bin/env python3
"""
STOP AND COME BACK (9/6/26, RUN lane)
VAMILY [title screen] / STOP-AND-COME-BACK, record item H.

ITEM H, 8/25: "the demo has no title screen of its own, no 'what is this', no way
to stop and come back that a stranger would recognise as such."

MEASURED BEFORE BUILDING, and two thirds of it were already there:
  * A TITLE SCREEN OF ITS OWN -- yes. #front carries his wordmark on its plate.
  * "WHAT IS THIS" -- yes. POST-ECONOMIC APOCALYPSE - LAS VEGAS, under the name.
  * A WAY TO STOP -- yes, and it is UI's, shipped 9/5: the gear's QUIT closes the
    game and puts the front door back.
  * *** A WAY TO COME BACK THAT A STRANGER WOULD RECOGNISE -- NO. ***

That last one is the whole job, and it is measured rather than argued. Played to
day 3, 16:20, then reloaded the way coming back does:

    the shell's save holds   {day:3, min:980} on disk
    the front door says      "TAP TO ENTER"

The run is sitting right there and the door says nothing about it. A stranger who
put the game down has no way to know their day survived -- and this lane spent
three rounds making sure it does. The save carries the day, the clock, the
position, the quest, the purse AND the people; the one surface that could say so
was silent.

WHAT THIS DOES, AND IT IS ONE LINE OF THE DOOR:
When a run is waiting, the tap line names it -- CONTINUE, the day, the clock, in
the same vocabulary the HUD uses (DAY 3 - 16:20), because that is what he
navigates by. When there is no run it is untouched: TAP TO ENTER, exactly as it
was.

WHAT IT DELIBERATELY DOES NOT DO:
  * NO START OVER. Wiping is destructive and the save panel already owns it; a
    second door onto a wipe is a second wipe bug, and putting one on the screen
    a stranger taps first is the worst place for it.
  * NO SECOND SCREEN, no menu, no fork. The splash has exactly one thing to do
    and the settings lane's own comment says a second button on it is a fork in
    the only moment that has to be simple. This is the SAME one thing, told the
    truth about.
  * IT DOES NOT CHANGE WHAT THE TAP DOES. Entering already restores the save
    through the handshake. The door was lying by omission, not by action.

REFRESHED WHENEVER THE DOOR IS UP, because UI's QUIT brings it back mid-session
and a line that was right at load would be stale by then. Polled rather than
hooked into doQuit, so this adds no line to a function another lane owns -- the
same choice the settings panel made for the same reason, two lanes agreeing.

IDEMPOTENT: the mark is checked first, anchors asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
MARK = '__STOP_AND_COME_BACK__'


def main():
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    anchor = '<div id="app">'
    assert src.count(anchor) == 1, 'app anchor %d' % src.count(anchor)
    block = r'''<script>
/* ==== ''' + MARK + r''' (9/6, RUN) : THE DOOR SAYS YOUR RUN IS WAITING =======
   Record item H: "no way to stop and come back that a stranger would recognise
   as such." Two thirds of it were already here -- the title, the what-is-this,
   and UI's QUIT that puts this door back. The missing third was measured:

       played to day 3, 16:20, reloaded the way coming back does
       the save held {day:3, min:980} on disk
       THE DOOR SAID "TAP TO ENTER"

   The run was sitting right there and the door said nothing about it. This lane
   spent three rounds making that save carry the day, the clock, the position,
   the quest, the purse and the people; the one surface that could say so was
   silent. So it says so.

   IT CHANGES NOTHING ELSE. No start over -- wiping is destructive, the save
   panel owns it, and the screen a stranger taps first is the worst place for a
   second door onto it. No second screen and no fork: the splash has exactly one
   thing to do. Entering already restored the save; the door was lying by
   omission, not by action.
   Words are attempts, draft:true. */
(function(){
  var TAP = 'TAP TO ENTER';
  function clock(min){
    var m = Math.max(0, min|0), h = Math.floor(m/60)%24, r = m%60;
    return (h<10?'0':'')+h+':'+(r<10?'0':'')+r;
  }
  function waiting(){
    /* THE SHELL'S OWN SAVE, asked the same way the boot handshake asks it. No
       second reader: two things that both decide whether a run exists is how
       they come to disagree. */
    try{
      if(typeof CITYSAVE === 'undefined' || !CITYSAVE.load) return null;
      var s = CITYSAVE.load();
      if(!s || !s.data) return null;
      var d = s.data.day|0;
      if(d < 1) return null;
      return { day:d, min:(typeof s.data.min === 'number') ? s.data.min : null };
    }catch(_e){ return null; }
  }
  function paint(){
    var el = document.getElementById('fronttap');
    if(!el) return;
    var w = waiting();
    var want = w
      ? ('CONTINUE · DAY ' + w.day + (w.min===null ? '' : ' · ' + clock(w.min)))
      : TAP;
    if(el.textContent !== want) el.textContent = want;
  }
  /* ONCE PER SHOWING OF THE DOOR, AND THAT LIMIT IS THE WHOLE POINT.
     UI's QUIT brings this door back mid-session, so a line that was right at
     load would be stale by then -- it has to be re-read. Polled rather than
     hooked into doQuit, so this adds no line to a function another lane owns,
     the same choice the settings panel made for the same reason.
     *** BUT THE FIRST CUT READ THE SAVE ON EVERY TICK AND THAT BROKE THE BEAT.
     CITYSAVE.load() parses the WHOLE run -- day, quest, purse, century, market
     and the people -- and doing that twice a second on the splash is main-thread
     work in the exact window the pulse is measured in. BEAT FIRST caught it:
     green on main, red with this in, twice. 120 BPM IS A LAW AND THE SPLASH IS
     NOT EXEMPT. *** So the tick is a cheap visibility check, and the save is
     read ONCE each time the door appears: at most one parse per showing instead
     of two a second. The flag clears when the door goes away, which is what
     makes QUIT paint a fresh line. */
  var painted = false;
  setInterval(function(){
    try{
      /* A DOOR THAT IS NOT THERE IS A DOOR THAT IS NOT SHOWING, and getting that
         backwards cost a whole gate run: the first cut returned early on a
         missing element WITHOUT clearing the flag, so entering the game never
         reset it and QUIT repainted nothing -- the mid-session line stayed the
         one from load. The settings panel reads !fr the same way, as "the game
         is up". */
      var fr = document.getElementById('front');
      if(!fr){ painted = false; return; }
      var st = getComputedStyle(fr);
      if(st.display === 'none' || +st.opacity === 0){ painted = false; return; }
      if(painted) return;
      /* NOT YET IS NOT AN ANSWER: this script runs before CITYSAVE is defined,
         so a miss here is "ask again next tick", never "there is no run". */
      if(typeof CITYSAVE === 'undefined' || !CITYSAVE.load) return;
      painted = true;
      paint();
    }catch(_e){}
  }, 600);
})();
</script>
''' + anchor
    src = src.replace(anchor, block, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  added    : the front door reads the shell\'s own save and names the run')
    print('  changed  : nothing else -- no start over, no second screen, no new fork')
    print('  wrote    : slices/BOHEMIA_ALPHA_0_9.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())

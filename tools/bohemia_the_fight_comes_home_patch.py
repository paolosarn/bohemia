#!/usr/bin/env python3
"""
THE FIGHT'S OUTCOME REACHED THE WALKED WORLD AND WAS DROPPED
(8/21/26, RUN lane. The fight is one of the three beats the demo is scoped to.)

FOUND WHILE RE-PROBING THE INTEGRATION LEDGER, which is the point of re-probing.

    slices/BOHEMIA_ALPHA_0_9.html:7724
      cf.contentWindow.postMessage({type:'BOHEMIA_CITY_COMBAT_END',
        outcome:outcome||null, at:CITYFIGHT_AT},'*');

Grep the city for BOHEMIA_CITY_COMBAT_END: ZERO HITS. It has five message
listeners -- BOHEMIA_DEED_WEIGHTS, bohemiaCityMusicState, bohemiaPhoneGo,
bohemiaPhoneAccept, BOHEMIA_GOTO_CELL -- and not one of them is this. So he walks
through a door, a fight assembles, he wins or he loses, and THE WORLD HE WALKS
BACK INTO NEVER FINDS OUT. Winning and losing were the same event.

AND THE GATE SAID IT WAS FINE, in the most refined version of this week's disease.
combat_entry_gate claims "the city is TOLD the outcome (observed arriving in the
city frame, not merely sent)" -- and it proves that by INSTALLING ITS OWN
LISTENER inside the city frame:

    await cityFrame.evaluate(() => {
      window.addEventListener('message', ev => {
        if (ev.data.type === 'BOHEMIA_CITY_COMBAT_END') window.__HOME_SEEN = ev.data; });
    });

That proves DELIVERY. It cannot prove CONSUMPTION, because the listener it
observed with is its own. The wording is honest and the reading is not: "the city
is TOLD" sounds like the city knows. A GATE THAT SUPPLIES THE LISTENER IT IS
TESTING FOR IS MEASURING THE POSTMAN.

WHAT THIS BUILDS, and it is deliberately the smallest honest thing:

  1. THE CITY LISTENS. One handler, next to the four that already exist.
  2. IT LANDS WHERE HE READS. The reckoning card already renders the day
     ledger's notes under "WHAT HAPPENED" (CITY:30176), so a fight becomes a
     line on the card he meets at the end of the day. The ledger was already
     built; nothing here invents a place to put things.
  3. IT IS RECORDED AS A FIGHT, not disguised as a quest stage. The day loop
     grew `DAY.happened(line, tag)` for this -- one line, same guard as
     `stage()`, same notes array. Using stage() would have meant lying about the
     shape of the thing to reuse a function.

WHAT IT DELIBERATELY DOES NOT DO, and each of these is somebody's ruling:

  NO DAMAGE BEFORE THE DIAL. No health, no wound, no loss. The reckoning REPORTS
  -- the city's own comment at :20809 says exactly that -- and what a fight costs
  a body is his number, not mine.

  NO TIME COST EITHER. A fight plainly ought to eat part of a day, but the day is
  spent in measured units the walk earns (0.084 per cell) and picking a figure
  for a fight would be inventing a dial. Flagged, not guessed.

  THE WORDS ARE A DRAFT AND SAY SO. Per ALWAYS MAKE AN ATTEMPT (8/11) the line is
  written as if it ships and tagged draft:true so he can find and change it. Per
  MECHANISM-MINE / CONTENTS-PAOLO'S the mechanism is mine and the sentence is his
  to overwrite.

Idempotent.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ENGINE = 'engine/bohemia_dayloop.js'

# ---- 1. the day loop learns to record a thing that is not a quest stage -----
ENG_OLD = """    /* ---- THE RECKONING --------------------------------------------------- */"""
ENG_NEW = """    /* SOMETHING HAPPENED THAT WAS NOT A QUEST STAGE (8/21, RUN lane). The
       fight's outcome had nowhere to land: `stage()` is quest-shaped (questId,
       stageN) and using it for a fight would mean lying about the shape of the
       thing to reuse a function. This is the same notes array the reckoning
       already renders under WHAT HAPPENED, with the same guard -- accepted
       while the day is CLOSING too, because the consequence of a day belongs to
       that day, which is the lesson stage() learned on 8/12. */
    L.happened = function (line, tag) {
      if (L.phase !== 'awake' && L.phase !== 'ended') return L;
      if (line) L.ledger.notes.push(line);
      fire('happened', tag || null, line || null);
      return L;
    };

    /* ---- THE RECKONING --------------------------------------------------- */"""

# ---- 2. the city hears the outcome -----------------------------------------
ANCHOR = """window.addEventListener('message',function(ev){
  var d=ev&&ev.data; if(!d||!d.bohemiaPhoneAccept)return;"""

LISTEN = """/* __THE_FIGHT_COMES_HOME__ (8/21, RUN lane). The shell posts
   {type:'BOHEMIA_CITY_COMBAT_END', outcome, at} into this frame when a fight
   settles, and until now NOTHING IN HERE LISTENED FOR IT -- so he walked through
   a door, fought, and the world he walked back into never found out. Winning and
   losing were the same event.
   combat_entry_gate reported this as fine because it INSTALLED ITS OWN LISTENER
   to watch the message arrive. That proves delivery; it cannot prove
   consumption. This is the consumer.
   IT REPORTS AND IT DOES NOT PUNISH: NO DAMAGE BEFORE THE DIAL, and no time cost
   either, because the day is spent in units the walk earns and a figure for a
   fight would be a dial I do not get to set. The line lands in the day ledger,
   which the reckoning card already renders under WHAT HAPPENED. */
window.addEventListener('message',function(ev){
  var d=ev&&ev.data; if(!d||d.type!=='BOHEMIA_CITY_COMBAT_END')return;
  var o=d.outcome||{};
  /* WON is the explicit flag the shell sends; anything else is not a win. A
     fight that ended some third way is still a thing that HAPPENED to him. */
  var won = !!(o.victory||o.result==='win');
  /* draft:true -- ALWAYS MAKE AN ATTEMPT (8/11). Real words, written as if they
     ship, his to overwrite. */
  var line = won
    ? 'You walked out of that one.'                       /* draft:true */
    : 'It went badly in there. You walked out anyway.';   /* draft:true */
  try{ if(typeof DAY!=='undefined'&&DAY.happened) DAY.happened(line,'fight'); }catch(_e){}
  /* AND HE SEES IT NOW, not only at the reckoning: the objective line is the one
     piece of text on the walked surface he is already reading. */
  try{ var q=document.getElementById('qline'); if(q) q.textContent=line; }catch(_e){}
  try{ window.__FIGHT_CAME_HOME={won:won,at:d.at||null,line:line}; }catch(_e){}
});

""" + ANCHOR


def main():
    for p in (CITY, ENGINE):
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')

    eng = open(ENGINE, encoding='utf8').read()
    if 'L.happened = function' not in eng:
        if ENG_OLD not in eng:
            sys.exit('FAIL: cannot find the reckoning marker in ' + ENGINE)
        open(ENGINE, 'w', encoding='utf8').write(eng.replace(ENG_OLD, ENG_NEW, 1))
        print('PATCHED %s -- DAY.happened(line, tag)' % ENGINE)
    else:
        print('NOOP: %s already has DAY.happened' % ENGINE)

    city = open(CITY, encoding='utf8').read()
    if '__THE_FIGHT_COMES_HOME__' in city:
        print('NOOP: the city already hears the fight come home')
        return
    if city.count(ANCHOR) != 1:
        sys.exit('FAIL: the phone-accept listener is not a unique anchor (%d)'
                 % city.count(ANCHOR))
    open(CITY, 'w', encoding='utf8').write(city.replace(ANCHOR, LISTEN, 1))
    print('PATCHED %s -- the city hears BOHEMIA_CITY_COMBAT_END' % CITY)
    print('NEXT: python3 tools/bohemia_city_module_resync.py  (the dayloop is '
          'inlined in the city and must carry the new canon body)')


if __name__ == '__main__':
    main()

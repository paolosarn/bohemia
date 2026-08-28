#!/usr/bin/env python3
"""
BOHEMIA CITY YOUR-PROBLEM PATCH -- I SHIPPED A PROMISE AND NOTHING KEPT IT.
(8/28/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_YOURPROBLEM__.

==========================================================================
THE PROMISE I SHIPPED YESTERDAY
==========================================================================
The vouch went in with this sentence on the card, in my own words:

    "You are INSIDE with them, so your word is worth something there. It costs
     you a rung of your own standing to spend it, AND AFTER THAT WHAT THIS
     PERSON DOES IS YOURS."

MEASURED: nothing reads the vouch bag except the line that grants the faction.
Nothing anywhere makes that person yours in any sense a player could feel. I
wrote a consequence into a sentence and did not build it.

That is the exact bug this lane has spent a week finding in other people's
code -- a system that says something and does not do it -- and I introduced a
fresh one twelve hours ago while writing a commit message about it.

And it came from the rung's own note, which I quoted as a specification:
    "The newcomer is the old-timer now, and the next newcomer is YOUR PROBLEM."
I built the first half. This is the half that makes it a decision.

==========================================================================
THE RULE: YOUR WORD IS THE ONLY THING HOLDING THEM
==========================================================================
They did not earn their place. YOU did, and you spent it on them. So the place
lasts exactly as long as your standing does.

    When your standing with that outfit falls to A STRANGER, everybody you put
    up there loses their place the same day.

It fires through machinery that already exists and already runs: neglect is
charged at day-end (__CITY_NEGLECT__), so walking away from an outfit drains
you toward zero on its own. Nobody has to invent a decay for this; the sweep
runs on the same hook, immediately after, and only reads what neglect just did.

REALISM IS THE FLOOR, NOT THE CEILING -- another lane's finding this morning and
it is the right correction. The REAL version of this is a number crossing a
threshold. The MEMORABLE version is that you find out by walking past somebody
you helped and seeing they are nobody again, on their card, in a sentence that
says it was you. There is no notification. The world does not tell you.

AND IT IS RECOVERABLE, which is what stops it being a punishment. Once they are
out they run with nobody again, so ctVouchFor offers them to you again -- climb
back to INSIDE and you can put them up a second time, at the same cost. The
door that closed is the same door.

==========================================================================
WHAT IS NOT DECIDED HERE
==========================================================================
The threshold is A STRANGER, which is the ladder's own bottom rung read by name
rather than a number I picked. If Paolo retunes the ladder this follows it.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_YOURPROBLEM__'

# ------------------------------------------- 1. A LOST PLACE IS NOT A PLACE
OLD_READ = """function ctVouchedFaction(p){
  try {
    var bag = ctVouchBag(); if(!bag || !p) return null;
    var v = bag[ctVouchKey(p)];
    return (v && v.faction) ? v.faction : null;
  } catch(_e){ return null; }
}"""
NEW_READ = """function ctVouchedFaction(p){
  try {
    var bag = ctVouchBag(); if(!bag || !p) return null;
    var v = bag[ctVouchKey(p)];
    /* """ + MARKER + """ -- A PLACE YOU LOST IS NOT A PLACE.
       The entry is KEPT rather than deleted, because "they were in, because of
       you, until you let it go" is the whole point and a deleted row cannot
       say it. Their card reads it back. */
    if(v && v.lost) return null;
    return (v && v.faction) ? v.faction : null;
  } catch(_e){ return null; }
}
/* """ + MARKER + """ -- WHAT YOU DID TO THIS PERSON, IF ANYTHING.
   Returns the whole entry including a lost one, which is what the card needs
   and what ctVouchedFaction deliberately refuses to return. */
function ctVouchRecord(p){
  try {
    var bag = ctVouchBag(); if(!bag || !p) return null;
    return bag[ctVouchKey(p)] || null;
  } catch(_e){ return null; }
}
/* THE SWEEP. Runs at day-end on the same hook that charges neglect, straight
   after it, so it only ever reads a number neglect has just finished writing.
   Two writers on one day's standing would be the bug this lane has fixed six
   times; this one does not write standing at all. */
function ctVouchSweep(sv, dayEnded){
  var out = [];
  try {
    if(typeof BohemiaBelonging === 'undefined') return out;
    var bag = (sv && sv.meta) ? sv.meta.vouched : null;
    if(!bag) return out;
    /* THE BOTTOM RUNG BY NAME, never a number I picked. If the ladder is
       retuned this follows it. */
    var floor = (BohemiaBelonging.RUNGS || [])[0];
    if(!floor) return out;
    for(var key in bag){
      var v = bag[key];
      if(!v || v.lost || !v.faction) continue;
      var have = BohemiaBelonging.gaveOf(sv, v.faction);
      var bar = BohemiaBelonging.bargain(BohemiaBelonging.ruleOf(v.faction), have);
      if(!bar || !bar.rung) continue;
      if(String(bar.rung.word) !== String(floor.word)) continue;
      v.lost = (dayEnded != null ? dayEnded|0 : 1);
      out.push({ key:key, faction:v.faction });
    }
  } catch(_e){}
  return out;
}"""

# ------------------------------------------------------ 2. IT RUNS AT DAY END
OLD_HOOK = """    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}"""
NEW_HOOK = """    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}
    /* """ + MARKER + """ -- AND THE PEOPLE YOUR WORD WAS HOLDING UP.
       IMMEDIATELY AFTER the upkeep, on the same hook, because the sweep only
       READS the standing neglect has just finished writing. It never writes
       standing itself -- two writers on one day's number is the bug this lane
       has fixed six times. */
    try { ctVouchSweep(ctBelongSave(), (T && T.day) || 1); } catch(_e){}"""

# ------------------------------------------------- 3. THEIR CARD SAYS IT WAS YOU
OLD_ROW = """  if(!fid){
    /* CT_OPEN, NOT p -- AND MY OWN CATCH HID THAT FOR A ROUND."""
NEW_ROW = """  if(!fid){
    /* """ + MARKER + """ -- AND IF THEY USED TO BE SOMEBODY'S, BECAUSE OF YOU.
       There is no notification for this anywhere in the game. You find out by
       walking past somebody you helped and reading their card. REALISM IS THE
       FLOOR, NOT THE CEILING: the real version of this is a number crossing a
       threshold; the memorable version is a person standing in the street who
       is nobody again, and a sentence that says whose fault that is.
       draft:true -- his to edit. */
    try {
      var ctLost = ctVouchRecord(CT_OPEN);
      if(ctLost && ctLost.lost){
        body += ctRow('THEY WERE IN, ONCE',
          'WITH THE ' + String(ctLost.faction).toUpperCase()
          + ' \\u00b7 BECAUSE OF YOU');
        body += ctNote('Your word put them there and nothing else did. You let '
          + 'it go to nothing with the ' + String(ctLost.faction).toUpperCase()
          + ', so their place went with it. They have not said anything about '
          + 'it.');
      }
    } catch(_e){
      if(!ctIntroRows.__lwarn){ ctIntroRows.__lwarn = 1;
        console.error('BOHEMIA: the lost-vouch row threw and was swallowed. '
          + _e.message); }
    }
    /* CT_OPEN, NOT p -- AND MY OWN CATCH HID THAT FOR A ROUND."""

# --------------------------------------------- 4. AND THE BOARD KEEPS THE LIST
OLD_BOARD = """function ctValleyHtml(){"""
NEW_BOARD = """/* """ + MARKER + """ -- EVERYBODY YOU PUT UP, AND WHETHER THEY ARE STILL IN.
   A place he can check, rather than a notification that interrupts him. The
   world does not tell you these people fell; this is where you can go and
   look. */
function ctVouchedHtml(){
  var bag = ctVouchBag();
  if(!bag) return '';
  var rows = [];
  for(var k in bag){
    var v = bag[k];
    if(!v || !v.faction) continue;
    rows.push({ faction:String(v.faction).toUpperCase(), day:v.day, lost:v.lost });
  }
  if(!rows.length) return '';
  rows.sort(function(a,b){ return (a.day|0)-(b.day|0); });
  var h = '<div class="obhead2">PEOPLE YOU PUT UP</div>';
  for(var i=0;i<rows.length;i++){
    var r = rows[i];
    h += '<div class="obv' + (r.lost ? ' isyours' : '') + '">'
       + '<span class="obvwho">' + r.faction + '</span>'
       + '<span class="obvwhere">' + (r.lost
            ? 'LOST THEIR PLACE ON DAY ' + r.lost
            : 'STILL IN \\u00b7 PUT UP ON DAY ' + (r.day || 1)) + '</span>'
       + '</div>';
  }
  return h;
}
function ctValleyHtml(){"""

# ctOutfitHtml HAS TWO RETURN PATHS AND THE FIRST VERSION PATCHED ONE.
# The empty-state return fires whenever your outfit holds no positions yet --
# which is most of the game, and exactly the state a player is in when they
# start putting people up. So the list rendered in the branch nobody was in.
# Caught by driving the arc rather than by reading the diff. BOTH, or neither.
OLD_EMPTY_TAIL = """      + ' and it does not empty again.</div>' + ctValleyHtml();"""
NEW_EMPTY_TAIL = """      + ' and it does not empty again.</div>' + ctVouchedHtml() + ctValleyHtml();"""

OLD_TAIL = """  return h + ctValleyHtml();
}

function ctOutfitOpen(){"""
NEW_TAIL = """  /* """ + MARKER + """ -- the people you put up sit between your own positions
     and the valley, because they are the one part of this board that is about
     what you DID rather than about where anybody is. */
  return h + ctVouchedHtml() + ctValleyHtml();
}

function ctOutfitOpen(){"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if 'function ctVouchDo' not in s:
        sys.exit('FAIL: run tools/bohemia_city_vouch_patch.py first')

    for old, new, what in ((OLD_READ, NEW_READ, 'the vouch reader'),
                           (OLD_HOOK, NEW_HOOK, 'the day-end hook'),
                           (OLD_ROW, NEW_ROW, 'the lost row'),
                           (OLD_BOARD, NEW_BOARD, 'the board list'),
                           (OLD_EMPTY_TAIL, NEW_EMPTY_TAIL, 'the empty board tail'),
                           (OLD_TAIL, NEW_TAIL, 'the board tail')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY YOUR-PROBLEM: the vouch is only as good as your standing')
    print('  TAB: RUN. Their card says it was you; the ⚔ OUTFIT board keeps the list.')


if __name__ == '__main__':
    main()

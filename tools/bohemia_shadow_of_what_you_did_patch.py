#!/usr/bin/env python3
"""
THE SHADOW OF WHAT YOU DID (9/6/26, RUN lane)
VAMILY [drains shown] / BB-THE-SHADOW-OF-WHAT-YOU-DID.

THE ROW: "the end-of-day card says it in the verb's own words -- the day ate one
food, the night ate two power, the bell ate one tape -- READ STRAIGHT OFF THE
LEDGER'S `drain` REASONS, NEVER A SECOND TABLE. | the card lists today's drains
by verb."

HALF OF THIS WAS ALREADY BUILT AND I FOUND IT BEFORE BUILDING ANYTHING, which is
the rule this repo learned the expensive way. WORLD's [living costs] shipped the
verb lines: grouped by verb and by paid/unpaid, first-happened-first, in each
verb's own words. That work is KEPT, not replaced.

*** WHAT WAS ACTUALLY MISSING IS THE CLAUSE IN CAPITALS. *** SPENT_TODAY is a
SECOND TABLE -- a parallel array that only upkeepPost writes -- and the ledger
has THREE drain writers:

    upkeepPost('day:ate' | 'night:power' | 'fight:plate' | 'ask:leaned')  ON THE CARD
    PURSE.debit(..., 'buy:'   + goodId)   -- everything you BUY at a market  SILENT
    P.debit(...,     'build:' + type)     -- everything you PUT UP           SILENT

So the card named the four things that happen TO you and said nothing about the
two things you DID. Those are the drains a player most obviously caused, and they
were the only ones missing. Reading the ledger instead of the side table fixes
all of it at once, and a fourth writer tomorrow appears for free.

*** AND ONE THING THE LEDGER STRUCTURALLY CANNOT TELL YOU, MEASURED RATHER THAN
ASSUMED. *** bohemia_purse's _post carries the comment "YOU CANNOT SPEND WHAT YOU
DO NOT HAVE, and the refusal is part of the record" -- and the code RETURNS
BEFORE PUSHING AN ENTRY. Proved in Node: a refused debit leaves zero entries. The
comment and the code disagree, in another lane's module, so it is reported and
not touched here.
The consequence for this row is the whole shape of the fix: PAID drains come off
the ledger, where all three writers are; the "and you could not pay it" lines can
only come from SPENT_TODAY, which is the only thing that saw them. They cannot
double-count, because a refused drain has no ledger twin.

IDEMPOTENT: the mark is checked first, anchors asserted to match exactly once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__THE_SHADOW_OF_WHAT_YOU_DID__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    # ---- 1. read the ledger, not the side table ---------------------------
    anchor_fn = 'var SPENT_TODAY=[];'
    assert src.count(anchor_fn) == 1, 'fn anchor %d' % src.count(anchor_fn)
    reader = r'''/* ==== ''' + MARK + r''' (9/6) : WHAT TODAY ACTUALLY TOOK ==============
   BB-THE-SHADOW-OF-WHAT-YOU-DID, and its clause in capitals: read straight off
   the ledger's drain reasons, NEVER A SECOND TABLE.

   SPENT_TODAY is a second table. It is written by upkeepPost alone, and the
   ledger has three drain writers -- the four upkeep verbs, buy: at a market, and
   build: when you put something up. So the card named the four things that
   happen TO you and was silent about the two things you DID. Reading the entries
   fixes all of it at once and a fourth writer tomorrow shows up for free.

   GROUPED BY REASON, because one line per post is a wall: you buy four things
   and hold six lit circuits. EVERYTHING COSTS ONE, so the count IS the amount,
   and the amount is summed off the entries rather than assumed.
   ========================================================================== */
function ctDrainsToday(p, day){
  var out = [], key = {};
  if(!p || !p.entries) return out;
  var verbs = (typeof BohemiaPurse!=='undefined' && BohemiaPurse.VERBS) || {};
  for(var i=0;i<p.entries.length;i++){
    var e = p.entries[i];
    if(!e || e.kind !== 'drain') continue;
    if((e.day|0) !== (day|0)) continue;
    var r = String(e.reason||'');
    if(!key[r]){
      key[r] = { reason:r, currency:e.currency, amount:0, n:0,
                 about:(verbs[r] && verbs[r].about) || ctDrainWords(r) };
      out.push(key[r]);
    }
    key[r].amount += Math.abs(e.amount||0);
    key[r].n++;
  }
  return out;
}

/* WHAT TO CALL A DRAIN THE VERB TABLE DOES NOT NAME. The four upkeep verbs carry
   their own sentence and those are used verbatim. buy: and build: do not, so
   these are attempts in the same voice -- what you did, not what it cost.
   draft:true, his to overwrite. */
function ctDrainWords(reason){
  var s = String(reason||'');
  var i = s.indexOf(':');
  var head = i<0 ? s : s.slice(0,i);
  var what = i<0 ? '' : s.slice(i+1).replace(/[_-]+/g,' ');
  if(head === 'buy')   return what ? ('you bought ' + what) : 'you bought something';
  if(head === 'build') return what ? ('you put up a ' + what) : 'you put something up';
  return what ? (head + ' ' + what) : s;
}

''' + anchor_fn
    src = src.replace(anchor_fn, reader, 1)

    # ---- 2. render from it -------------------------------------------------
    # THE ANCHOR IS BUILT FROM THE FILE'S OWN ESCAPES, not retyped. The source
    # writes the dash and the multiply sign as \u2014 and \u00d7, and a hand-typed
    # anchor with the literal characters matched ZERO times -- twice.
    DASH = chr(92) + 'u2014'
    TIMES = chr(92) + 'u00d7'
    old = ("  var _sk=[], _sg={};\n"
           "  for(var si=0;si<SPENT_TODAY.length;si++){ var sp=SPENT_TODAY[si];\n"
           "    var gk=sp.verb+'|'+(sp.paid?'1':'0');\n"
           "    if(!_sg[gk]){ _sg[gk]={about:sp.about,paid:sp.paid,n:0}; _sk.push(gk); }\n"
           "    _sg[gk].n++; }\n"
           "  for(var sj=0;sj<_sk.length;sj++){ var g=_sg[_sk[sj]];\n"
           "    h+='<li'+(g.paid?'':' style=\"color:#c98a5a\"')+'>'+esc(g.about)\n"
           "      +(g.paid?'' : ' " + DASH + " and you could not pay it')\n"
           "      +(g.n>1?' " + TIMES + "'+g.n:'')+'</li>'; }")
    new = ("  /* " + MARK + " (9/6) -- WHAT WAS PAID COMES OFF THE LEDGER.\n"
           "     This read SPENT_TODAY, which only upkeepPost writes, so the card listed\n"
           "     the four things that happen TO you and said nothing about the two things\n"
           "     you DID -- everything bought at a market and everything you put up. Same\n"
           "     grouping, same order, same voice; the SOURCE is the ledger now, so every\n"
           "     drain shows whoever wrote it, and a fourth writer tomorrow shows up for\n"
           "     free. */\n"
           "  var _drains=[];\n"
           "  try{ _drains = ctDrainsToday(purseGet(), DAY.day) || []; }catch(_e){}\n"
           "  for(var sj=0;sj<_drains.length;sj++){ var g=_drains[sj];\n"
           "    h+='<li>'+esc(g.about)+(g.n>1?' " + TIMES + "'+g.n:'')+'</li>'; }\n"
           "  /* AND WHAT YOU COULD NOT PAY, WHICH ONLY THE SIDE TABLE SAW.\n"
           "     MEASURED, not assumed: bohemia_purse's _post says \"the refusal is part of\n"
           "     the record\" and then RETURNS BEFORE PUSHING AN ENTRY -- proved in Node, a\n"
           "     refused debit leaves zero entries. So the ledger structurally CANNOT report\n"
           "     a shortfall and SPENT_TODAY is the only witness. They cannot double-count:\n"
           "     a refused drain has no ledger twin. (The comment and the code disagreeing\n"
           "     is another lane's module and is reported, not touched.) */\n"
           "  for(var su=0;su<SPENT_TODAY.length;su++){ var sp=SPENT_TODAY[su];\n"
           "    if(sp.paid) continue;\n"
           "    h+='<li style=\"color:#c98a5a\">'+esc(sp.about)\n"
           "      +' " + DASH + " and you could not pay it</li>'; }")
    assert src.count(old) == 1, 'render anchor %d' % src.count(old)
    src = src.replace(old, new, 1)

    open(CITY, 'w', encoding='utf8').write(src)
    print('  added    : ctDrainsToday() -- reads purse.entries, not the side table')
    print('  added    : ctDrainWords() -- attempts for buy: and build:, draft:true')
    print('  changed  : the card lists PAID drains off the ledger (all three writers)')
    print('  kept     : the "could not pay it" lines, the only thing that sees refusals')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())

#!/usr/bin/env python3
"""BOHEMIA WHO WILL VOUCH FOR YOU (9/5/26, PEOPLE lane). VAMILY [your reputation],
BOHEMIA_BACKLOG.md row BB-STANDING-PLAYER.

THE ROW'S OWN SHAPE, IN ITS OWN WORDS: "it is A WEB, NOT A BAR. A job comes from
a PERSON, and that person heard about you from someone. The question a favour
answers is not 'did my bar go up' but 'who will vouch for me now.'"

MEASURED FIRST, AND THE MEASUREMENT MOVED THE JOB. The row says the player is not
a node in the standing graph. Two standing mechanisms exist and I checked both
before writing a line:
  1. engine/bohemia_standing.js -- the PERSON-level web: minds witness deeds,
     gossip carries them, opinionOf sums them, standingOf averages a faction's
     members. THE PLAYER IS ALREADY IN IT: the walked city calls witness(),
     opinionOf() and standingOf() with actor '@' in 25 places.
  2. engine/bohemia_engine.js -- the FACTION world, shiftStanding, and
     playerMandate(playerId), which already reads a faction's standing TOWARD the
     player. The walked city does not build that world at all (0 references) and
     playerMandate has NO CALLERS ANYWHERE.
So the player is not missing from the web. WHAT IS MISSING IS THE WEB'S ANSWER.

*** THE GAP, AND IT IS ONE FIELD. *** This web has always recorded HOW FAR a
story travelled -- hops -- and never WHO CARRIED IT. So the game could total your
reputation and could not answer the only question the row says matters. gossip()
now stamps `from` on a retold deed, and whoVouches() returns PEOPLE instead of a
number: who is warm on you, the one deed that did it, and whether they saw it or
were told, and by whom. Proved in a harness: ana saw it (FWU, hops 0), beto heard
it FROM ANA (WARM, hops 1), caro FROM BETO (NEUTRAL, hops 2).

*** AND IT SHIPS DARK, ON PURPOSE. *** DEED_WEIGHT has ZERO entries because the
82 deed rows are his to rule and he has not. forceOf() returns 0 for an unweighted
deed, so on today's build nobody can vouch for anybody -- which is CORRECT, and
the panel SAYS SO in those words instead of drawing a neutral bar. "Adding a node
must not let this lane invent a standing he never ruled" is the row's own line.
[PENDING Paolo] is in the handoff.

NO NEW DOOR: it renders directly under WHO HAS LAID EYES ON YOU, which is the
panel that already answers "what do they think of me". A second place to look is
a second thing to find.

  python3 tools/bohemia_city_who_vouches_patch.py

Gate: gates/who_vouches_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_WHO_VOUCHES__'

# THE INLINED MODULE'S FENCE IS AN OPEN/CLOSE PAIR WITH DIFFERENT TEXT, not the
# same banner twice like the wildlife bank's. The first cut of this tool assumed
# the pair matched, found no fence, refreshed nothing, and printed success -- so
# the panel landed in the city calling a function the city's own inlined copy did
# not have. A FENCE YOU GUESSED IS NOT A FENCE: these two strings are read off
# the file.
MOD_OPEN = '/* ==== engine/bohemia_standing.js (THE DEED LEDGER, inlined verbatim) ==== */'
MOD_CLOSE = '/* ==== /engine/bohemia_standing.js (THE DEED LEDGER) ==== */'
MOD_SRC = 'engine/bohemia_standing.js'

ANCHOR = """function ctVouchedHtml(){"""

NEW = r"""/* ==== __CITY_WHO_VOUCHES__ : A WEB, NOT A BAR ==============================
   "The question a favour answers is not 'did my bar go up' but WHO WILL VOUCH
   FOR ME NOW." So this names them, says whether they saw it themselves, and
   names the person who told them if they did not.
   ========================================================================== */
function ctWhoVouchesHtml(){
  if (typeof BohemiaStanding === 'undefined' || !BohemiaStanding.whoVouches) return '';
  var minds = [], now = 0;
  try { minds = ctMindsList(); now = ctMinuteNow(); } catch(_e){ return ''; }
  if (!minds.length) return '';
  var vouch = [], wont = [];
  try {
    vouch = BohemiaStanding.whoVouches(minds, '@', now, {limit:5});
    wont  = BohemiaStanding.whoWont(minds, '@', now, {limit:3});
  } catch(_e){ return ''; }

  var h = '<div class="obhead2">WHO WOULD VOUCH FOR YOU</div>';

  /* *** IT SHIPS DARK AND IT SAYS SO. *** DEED_WEIGHT is empty until he rules
     the 82 deed rows, so nobody can hold an opinion at all. Printing an empty
     list would read as "nobody likes you"; printing NEUTRAL would be a number
     he never ruled. It says which of those it is. */
  var ruled = true;
  try { ruled = !!Object.keys(BohemiaStanding.DEED_WEIGHT || {}).length; } catch(_e){}
  if (!ruled) {
    h += '<div class="obv isyours"><span class="obvwho">NOBODY YET</span>'
       + '<span class="obvwhere">' + minds.length + ' PEOPLE CARRY WHAT THEY SAW. '
       + 'WHAT IT IS WORTH IS NOT SET, SO NOTHING HAS TURNED INTO AN OPINION.'
       + '</span></div>';
    return h;
  }
  if (!vouch.length && !wont.length) {
    h += '<div class="obv isyours"><span class="obvwho">NOBODY YET</span>'
       + '<span class="obvwhere">NOBODY HAS SEEN YOU DO ANYTHING WORTH REPEATING</span>'
       + '</div>';
    return h;
  }
  /* *** A NAME IS EARNED, NEVER GIVEN, AND THIS PANEL OBEYS THAT. *** The first
     cut printed the mind's owner id and the panel read "12:12:900 FWU SAW IT",
     which is machine output, not a person. BohemiaPeople.headingOf already owns
     this grammar and states the rule: a stranger is their TRADE, somebody you
     asked is their FIRST NAME. So this asks it rather than inventing a second
     way to say who somebody is -- and somebody who is not on screen right now is
     honestly SOMEBODY, which is headingOf's own answer for a missing person. */
  var seen = {};
  try {
    var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
    for (var b = 0; b < drew.length; b++) if (drew[b] && drew[b].p) seen[drew[b].p.id] = drew[b].p;
  } catch (_e) {}
  function ctVouchWho(id){
    try { return BohemiaPeople.headingOf(seen[id] || null); } catch (_e) { return 'SOMEBODY'; }
  }
  for (var i = 0; i < vouch.length; i++){
    var v = vouch[i];
    var how = v.sawIt
      ? 'SAW IT'
      : (v.from ? 'HEARD IT FROM ' + ctVouchWho(v.from)
                : 'HEARD IT SECOND HAND');
    h += '<div class="obv">'
       + '<span class="obvwho">' + ctVouchWho(v.who) + '</span>'
       + '<span class="obvwhere">' + v.rung + ' · ' + how + '</span>'
       + '</div>';
  }
  /* AND THE OTHER SIDE, BECAUSE SHOWING ONE SIDE OF A WEB IS A BAR. */
  for (var j = 0; j < wont.length; j++){
    var w = wont[j];
    h += '<div class="obv isyours">'
       + '<span class="obvwho">' + ctVouchWho(w.who) + '</span>'
       + '<span class="obvwhere">' + w.rung + ' · WOULD NOT</span>'
       + '</div>';
  }
  return h;
}

function ctVouchedHtml(){"""

CALL_A = """      + ' and it does not empty again.</div>' + ctSeenByHtml() + ctVouchedHtml()"""
CALL_A_NEW = """      + ' and it does not empty again.</div>' + ctSeenByHtml() + ctWhoVouchesHtml() + ctVouchedHtml()"""

CALL_B = """  return h + ctSeenByHtml() + ctVouchedHtml() + ctValleyHtml();"""
CALL_B_NEW = """  return h + ctSeenByHtml() + ctWhoVouchesHtml() + ctVouchedHtml() + ctValleyHtml();"""


def refresh_block(html, opener, closer, src):
    """Copy the inlined module forward EVERY run. A one-shot patch that no-ops on
    its own marker will happily leave a stale copy inlined while the engine file
    on disk is correct -- the invisible-hats shape, which bit this lane twice in
    one hour on 8/30."""
    a = html.find(opener)
    if a < 0:
        sys.exit('FAILED: the inlined module opener is not in %s.' % CITY)
    b = html.find(closer, a + len(opener))
    if b < 0:
        sys.exit('FAILED: the inlined module closer is not in %s.' % CITY)
    cur = html[a + len(opener):b]
    fresh = '\n' + open(src, encoding='utf-8').read()
    if not fresh.endswith('\n'):
        fresh += '\n'
    if cur == fresh:
        return html, False
    return html[:a + len(opener)] + fresh + html[b:], True


def main():
    html = open(CITY, encoding='utf-8').read()
    notes = []
    if MARK not in html:
        steps = [('the vouched panel', ANCHOR, NEW),
                 ('the met-card call site', CALL_A, CALL_A_NEW),
                 ('the standing panel call site', CALL_B, CALL_B_NEW)]
        for name, anchor, _rep in steps:
            if html.count(anchor) != 1:
                sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                         % (name, html.count(anchor), CITY))
        for _name, anchor, rep in steps:
            html = html.replace(anchor, rep, 1)
        notes.append('the WHO WOULD VOUCH FOR YOU panel')
    html, fresh = refresh_block(html, MOD_OPEN, MOD_CLOSE, MOD_SRC)
    if fresh:
        notes.append('the inlined standing module, which was older than the file')
    if not notes:
        print('  already applied  ' + CITY)
        return
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  [' + '; '.join(notes) + ']')


if __name__ == '__main__':
    main()

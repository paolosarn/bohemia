#!/usr/bin/env python3
"""BOHEMIA CITY KNOWN -- overhearing a fact WRITES IT DOWN, and it survives.

THE STREET EXCHANGES SHIPPED THIS MORNING WITH ELEVEN LEAKS AND NOWHERE FOR THEM
TO GO. Each of those eleven conversations says something TRUE about this valley
that is said nowhere else; you overheard it, the bubble faded, and the game
forgot. Q001.P8 "W8 (reward the listener" asks to "gate a solution behind a
detail only an attentive player caught", and a detail that is caught and then
dropped gates nothing. That was atmosphere wearing a mechanic's coat.

WHAT THIS ADDS:
  KNOWN            the log (engine/bohemia_known.js), restored at boot and
                   written the moment anything lands in it.
  boh.city.known   its own localStorage key, exactly the way CT_MET already
                   persists to boh.city.met. It does NOT ride the main save,
                   which belongs to another lane.
  the talk card    two rows: what you last heard, and the question it leaves
                   open. Plus a count, so the log is always reachable.

*** YOU ONLY LEARN IT IF YOU STAY FOR THE WHOLE CONVERSATION. *** The fact is
recorded when the exchange reaches its LAST turn, and the line quoted is that
last turn, because that is where the payoff sits in every one of the eleven.
Walk off halfway and you heard people talking and learned nothing. That is
Q001.P8 taken literally: standing still has to BUY something, and leaving has to
cost it. Measured first: quoting the JOIN turn instead gave rows like
`HEARD: "Where then."`, which is a fact about nothing.

*** AND IT NEVER POINTS AT ANYTHING. *** Q018.W3 THE RUMOR WEB: "a growing map
of known-vs-implied that always gives a thread to pull, with NO waypoints -- the
player follows their own questions." No cell, no arrow, no marker. A fact names
a SUBJECT and asks a QUESTION. Where the answer is, if it is anywhere yet, is
his ruling and MAP LAW's business, not this tool's.

LANE NOTE: PEOPLE-lane code in the CITY lane's file, additive, between markers,
touching no city logic and adding no new button.

REUSE CHECK: cooks no pixels and opens no bank. It adds no drawing of its own --
the two card rows go through ctRow(), the card's own row helper, so they wear
the card's face and there is one place to change how a row looks.

  python3 tools/bohemia_city_known_patch.py
Gate: gates/known_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_known.js')

MOD_BEGIN = '/* ==== engine/bohemia_known.js (WHAT YOU HEARD, 8/17) ==== */'
MOD_END = '/* ==== /engine/bohemia_known.js (WHAT YOU HEARD) ==== */'
MOD_ANCHOR = '/* ==== engine/bohemia_exchanges.js (EXCHANGES, 8/17) ==== */'

RT_BEGIN = '/* ===== BOHEMIA WHAT YOU HEARD (generated) ===== */'
RT_END = '/* ===== END BOHEMIA WHAT YOU HEARD ===== */'
RT_ANCHOR = '/* ===== BOHEMIA STREET EXCHANGES (generated) ===== */'

RUNTIME = RT_BEGIN + r'''
/* ---- THE THINGS YOU HEARD, AND THEY OUTLIVE THE BUBBLE --------------------
   Eleven of the street exchanges say something true that is said nowhere else.
   Until this, hearing one changed nothing at all. Q001.P8 asks that an
   attentive player be REWARDED; this is the reward, and it is deliberately not
   a waypoint (Q018.W3: a thread to pull, never a marker). */
var KNOWN = null;
function knownLoad(){
  if (KNOWN) return KNOWN;
  var data = null;
  try { data = JSON.parse(localStorage.getItem('boh.city.known') || 'null'); } catch (_e) {}
  try { KNOWN = BohemiaKnown.make(data); } catch (_e) { KNOWN = null; }
  return KNOWN;
}
function knownSave(){
  try { localStorage.setItem('boh.city.known', JSON.stringify(knownLoad().serialize())); }
  catch (_e) {}
}
/* RECORD IT. Called only when an exchange reaches its LAST turn, so walking off
   halfway means you heard people talking and learned nothing. */
function knownHeard(x, line){
  if (!x || !x.leaks || !x.subject || !x.implies) return null;
  var k = knownLoad(); if (!k) return null;
  var r = k.note({ id: x.id, subject: x.subject, implies: x.implies,
                   line: line || x.turns[x.turns.length - 1],
                   day: (T && T.day) | 0, min: (T && T.min) | 0 });
  if (r) knownSave();
  return r;
}
/* WHAT THE CARD SHOWS. Newest first, and never more than two, because a card is
   a card and a wall of rumour is not readable at a glance. */
function knownRows(){
  var k = knownLoad(); if (!k || !k.count()) return [];
  return k.all().slice(0, 2);
}
''' + RT_END


def cut(text, begin, end, tail, label):
    i = text.find(begin)
    if i < 0:
        return text, False
    j = text.find(end, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %s has an opening marker and no closing one.' % label)
    k = j + len(end)
    if text[k:k + len(tail)] == tail:
        k += len(tail)
    return text[:i] + text[k:], True


def insert_before(text, anchor, block, label):
    n = text.count(anchor)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))
    return text.replace(anchor, block + anchor, 1)


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    if not os.path.exists(MODULE):
        sys.exit('FAIL: engine/bohemia_known.js is missing')
    s = open(CITY, encoding='utf-8').read()
    before = s

    s, had_mod = cut(s, MOD_BEGIN, MOD_END, '\n', 'the known module')
    s, had_rt = cut(s, RT_BEGIN, RT_END, '\n', 'the known runtime')

    mod_src = open(MODULE, encoding='utf-8').read()
    s = insert_before(s, MOD_ANCHOR, MOD_BEGIN + '\n' + mod_src + '\n' + MOD_END + '\n',
                      'exchanges module')
    s = insert_before(s, RT_ANCHOR, RUNTIME + '\n', 'exchanges runtime')

    # ---- record the fact when the conversation ENDS, not when it starts -----
    old_say = """function xchSay(now){
  if (!XCH.on || XCH.i >= XCH.turns.length) { XCH.on = false; return false; }
  var t = XCH.turns[XCH.i++];"""
    new_say = """function xchSay(now){
  if (!XCH.on || XCH.i >= XCH.turns.length) { XCH.on = false; return false; }
  var t = XCH.turns[XCH.i++];
  /* THE LAST TURN IS WHERE THE FACT IS, in all eleven of them, so this is also
     what makes STAYING the thing that pays. Recorded here rather than at the
     start: an exchange you walked away from taught you nothing. */
  if (XCH.i >= XCH.turns.length) {
    try {
      var full = null;
      for (var q = 0; q < BohemiaExchanges.EXCHANGES.length; q++) {
        if (BohemiaExchanges.EXCHANGES[q].id === XCH.id) { full = BohemiaExchanges.EXCHANGES[q]; break; }
      }
      if (full) knownHeard(full, t.text);
    } catch (_e) {}
  }"""
    if new_say.split('\n')[3] in s:
        pass
    elif old_say in s:
        s = s.replace(old_say, new_say, 1)
    else:
        sys.exit('REFUSING TO WRITE: the xchSay anchor is gone. Look before patching.')

    # ---- and it is READABLE on the card he already opens -------------------
    card_anchor = "  if(ctBtn) body+='<button id=\"ctask\">'+ctBtn+'</button>';"
    card_rows = (
        "  /* __WHAT_YOU_HEARD__ -- the log, on a surface he already opens. Two rows\n"
        "     only: a card is a card and a wall of rumour is not readable at a glance.\n"
        "     Q018.W3 wants KNOWN vs IMPLIED, so both are shown and neither is a\n"
        "     location. Through ctRow() so it wears the card's own face. */\n"
        "  try {\n"
        "    var kk = knownLoad();\n"
        "    if (kk && kk.count()) {\n"
        "      var rows = knownRows();\n"
        "      body += ctRow('YOU HEARD', '\"' + rows[0].line + '\"');\n"
        "      body += ctRow('WHICH LEAVES', rows[0].implies);\n"
        "      body += ctRow('THINGS YOU KNOW', kk.count() + ' ACROSS ' +\n"
        "        kk.subjects().length + ' SUBJECT' + (kk.subjects().length === 1 ? '' : 'S'));\n"
        "    }\n"
        "  } catch (_e) {}\n")
    if '__WHAT_YOU_HEARD__' in s:
        pass
    elif card_anchor in s:
        s = s.replace(card_anchor, card_rows + card_anchor, 1)
    else:
        sys.exit('REFUSING TO WRITE: the talk-card anchor is gone. Look before patching.')

    if s == before:
        print('CITY KNOWN: already exactly this. Nothing written.')
        return
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY KNOWN: module %s, runtime %s'
          % ('moved' if had_mod else 'added', 'moved' if had_rt else 'added'))
    print('  city : %.1f MB' % (os.path.getsize(CITY) / 1e6))


if __name__ == '__main__':
    main()

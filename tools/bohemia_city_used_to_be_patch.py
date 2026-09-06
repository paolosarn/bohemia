#!/usr/bin/env python3
"""BOHEMIA WHAT YOU USED TO BE (9/6/26, PEOPLE lane).
VAMILY [former jobs], BOHEMIA_BACKLOG.md row BB-WHAT-YOU-WERE.

"NOBODY IN THIS VALLEY USED TO BE ANYBODY." Verified before building: no former
trade, no "used to be", no history field anywhere in the identity module or the
population module. A person is one of four words and has always been that thing.

THE ROW'S OWN FINDING IS WHY THIS IS A WORD AND NOT A STAT: "A BACKGROUND IS NOT
WHAT SOMEBODY CAN DO. IT IS WHAT THEY STILL THINK THEY ARE." The occupational
identity outlives the occupation, so the valley is full of people who still
introduce themselves by a job that has not existed for a decade.

THE FIELD IS BohemiaPeople.wasOf, DERIVED FROM THE PERSON'S KEY exactly like
their name -- no storage, same person on any device on any load. Fifteen trades,
weighted so hospitality is ~29% of the roster, which is the real Las Vegas
figure the row supplies. Six back of house against four front, because the back
of house runs the valley and the front of house served money that is gone.

THIS PATCH IS ONLY THE SURFACE: the card says it, once, beside the trade it
already says. The LINES a former trade would open are WORDS' own row
([trade slang] BB-STILL-SAYS-IT, still OPEN), and this lane does not write them.

  python3 tools/bohemia_city_used_to_be_patch.py

Gate: gates/used_to_be_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_USEDTOBE__'

OLD = """  var ctTradeWord = BohemiaPeople.tradeOf(who)||'SOMEBODY';
  if(String(ctTradeWord).toUpperCase() !== String(nm?nm:BohemiaPeople.headingOf(who)).toUpperCase())
    body+=ctRow('TRADE', ctTradeWord);"""

NEW = r"""  var ctTradeWord = BohemiaPeople.tradeOf(who)||'SOMEBODY';
  if(String(ctTradeWord).toUpperCase() !== String(nm?nm:BohemiaPeople.headingOf(who)).toUpperCase())
    body+=ctRow('TRADE', ctTradeWord);
  /* __CITY_USEDTOBE__ -- AND WHAT THEY WERE BEFORE ALL THIS.
     It sits directly under TRADE because that is the whole point of the row:
     what somebody IS now, and what they still think they are. Ten years on, in
     a city where a third of everybody worked hospitality, the pit boss still
     runs a room that way.
     THE SECOND ROW ONLY EXISTS FOR THE HALF THAT STILL MATTERS. A back-of-house
     trade kept a machine running and the machine still runs; a front-of-house
     trade died with the money, and its `keeps` is null so nothing is printed.
     THE EMPTY HALF IS THE POINT and must not be filled with a consolation
     sentence -- "DEALT CARDS" with nothing under it is the joke.
     draft:true, both rows. */
  try {
    var ctWas = BohemiaPeople.wasOf(who);
    if (ctWas) {
      body += ctRow('USED TO BE', ctWas.was);
      if (ctWas.keeps) body += ctNote(ctWas.keeps);
    }
  } catch(_e){}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if html.count(OLD) != 1:
        sys.exit('FAILED: the trade row resolves %d times in %s, expected 1.'
                 % (html.count(OLD), CITY))
    open(CITY, 'w', encoding='utf-8').write(html.replace(OLD, NEW, 1))
    print('  patched  ' + CITY + '  [what you used to be]')


if __name__ == '__main__':
    main()

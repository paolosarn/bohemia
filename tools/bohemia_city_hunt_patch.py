#!/usr/bin/env python3
"""BOHEMIA THE HUNT (8/27/26, PEOPLE lane) -- the last two hundred metres, and
what the quest thinks this person is.

THE ADDRESS GOT HIM TO THE BLOCK. It says "6 blocks south west, out by the
houses" and counts down to "right here". THEN IT STOPS BEING USEFUL, and that is
the moment the walk was for: he is standing on a block with fifteen people on it
and every one of them is a stranger in a coat. The only way to find the one the
job wants is to walk up to all of them.

SO THE ADDRESS GETS FINER WHEN HE ARRIVES, IN THE GAME'S OWN VOCABULARY.
`__CITY_TELL__` has printed WHAT YOU NOTICE about the person you are standing
next to since 8/13 -- the thing they are doing with their hands, de-collided so
nobody on a block has the same one. That is exactly a description of somebody
across a street, and it is already written. So the line becomes:

    right here, by the houses . look for the one who keeps checking the same pocket

Which is the Morrowind answer again, one scale down: a description, never an
arrow over their head. The research is in the address record and it holds at
this range too -- a marker deletes the place it points at, and it would delete
the person as well.

AND THE CARD SAYS WHAT THE QUEST THINKS THEY ARE. The conferred half of a role
has been computed since casting shipped and shown NOWHERE. MEASURED: 69
predicates across 64 roles, 58 of which already read as English -- "keeps the
tunnel", "wronged the dying", "named on the board", "near the end". The other 11
are machine flags and are dropped rather than mangled. A quest does not hunt for
somebody who already keeps the tunnel; it MAKES the person it cast into the one
who keeps it, and this is the game finally saying so out loud.

  python3 tools/bohemia_city_hunt_patch.py

Gate: gates/hunt_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_HUNT__'

# ---- 1. THE ADDRESS GETS FINER WHEN HE ARRIVES --------------------------------
ADDR_ANCHOR = """function ctAddress(){
  var d = ctDayCast(); if (!d || !d.cast) return null;
  var role = ctJobRole(); if (!role) return null;
  var c = d.cast[role]; if (!c || !c.block) return null;
  return BohemiaPeople.addressLine(ctBlockOf(hx, hy), c.block, ctGroundAt(c.block));
}"""
ADDR_NEW = """function ctAddress(){
  var d = ctDayCast(); if (!d || !d.cast) return null;
  var role = ctJobRole(); if (!role) return null;
  var c = d.cast[role]; if (!c || !c.block) return null;
  var here = ctBlockOf(hx, hy);
  var line = BohemiaPeople.addressLine(here, c.block, ctGroundAt(c.block));
  /* __CITY_HUNT__ -- AND WHEN HE GETS THERE, WHO TO LOOK FOR.
     The address stopped being useful at exactly the moment the walk was for: a
     block with fifteen people on it and no way to tell which one the job wants
     except walking up to all of them. The TELL has been printed on the glass
     since 8/13 for whoever he is standing next to, de-collided so nobody on a
     block has the same one, and it is already a description of somebody across
     a street. A DESCRIPTION, NEVER AN ARROW: the research behind the address
     holds at this range too, and a marker over their head would delete the
     person the same way it deletes the place. */
  if (line && here[0] === c.block[0] && here[1] === c.block[1]) {
    var t = null;
    try { var q = qkOf(c.key); t = q && q.tell; } catch(_e){}
    if (t) line += ' \\u00b7 look for the one who ' + t;   /* draft:true */
  }
  return line;
}"""

# ---- 2. AND THE CARD SAYS WHAT THE QUEST THINKS THEY ARE ----------------------
ROW_ANCHOR = """  var ctCN = ctConvNode(who);
  if (ctCN) {"""
ROW_NEW = """  /* __CITY_HUNT__ -- WHAT THE JOB SAYS THEY ARE, which is the conferred half of
     the role and has been computed and shown nowhere since casting shipped. The
     quest does not hunt for somebody who already keeps the tunnel; it makes the
     person it cast INTO the one who keeps it, and this is where it says so.
     ABSENT when the predicate is a machine flag rather than a phrase (11 of the
     corpus's 69 are), because a row that is always there and usually gibberish
     is worse than a row that turns up when there is something to say. */
  try {
    var ctCast0 = ctCast();
    if (ctCast0) for (var ctR in ctCast0) {
      if (!ctCast0.hasOwnProperty(ctR) || ctCast0[ctR].key !== who.key) continue;
      var ctTw = BohemiaPeople.traitWords(ctCast0[ctR].traits);
      if (ctTw.length) body += ctRow('THE JOB SAYS', 'the one who ' + ctTw.join(', and '));
      break;
    }
  } catch(_e){}
  var ctCN = ctConvNode(who);
  if (ctCN) {"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    steps = [('ctAddress', ADDR_ANCHOR, ADDR_NEW),
             ('the opener button block', ROW_ANCHOR, ROW_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (who to look for, and what the job says they are)')


if __name__ == '__main__':
    main()

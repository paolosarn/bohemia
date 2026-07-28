#!/usr/bin/env python3
"""
BOHEMIA — THE CITY IS IN THE RUN TAB (Paolo 7/28/26)

  "Can you put the city in the run tab?"

Yes. Tapping RUN now opens the city — the one isometric view he actually walks
around in — instead of the little quest slice.

ONE CITY, NOT TWO, and that is the whole design decision here. The obvious
implementation is to give the RUN tab its own copy of the city module, and it is
wrong twice over:

  1. TWO INSTANCES ARE TWO WORLDS. Each would carry its own save, its own
     streamed cells, its own built plots. He builds something in one tab, taps the
     other, and it is not there. That is not a bug you find later, it is a bug you
     ship on purpose.
  2. MOVING THE IFRAME INSTEAD RELOADS IT. Reparenting an iframe in the DOM tears
     it down and boots it again in every browser that matters, so he would lose
     where he was standing every time he changed tabs.

So the RUN tab ROUTES to the city panel. One frame, one world, one save. The RUN
tab lights up as normal; only the panel underneath it changes.

WHAT IS DELIBERATELY NOT DESTROYED: the run slice iframe still exists in the
document, so everything in the shell that talks to `runFrame` - the baked-body
cast delivery, the combat handoff, the save hooks - still finds it and does not
throw. Nothing is deleted; a route is added. Reverting is deleting one block.

CROSSING A LANE, SAID OUT LOUD: the RUN tab belongs to the RUN lane and the city
module to the CITY lane, and both were shipping live tonight. This is a five-line
routing change inside the shell, it touches neither module's internals, and Paolo
asked for it directly. It is still a crossing and it is recorded here rather than
quietly done.

  python3 tools/bohemia_city_in_run_tab_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'CITY IN THE RUN TAB'

OLD_ACT = ("  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));\n"
           "  document.getElementById('p-'+t.dataset.p).classList.add('on');\n")
NEW_ACT = ("  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));\n"
           "  /* CITY IN THE RUN TAB (Paolo 7/28: \"Can you put the city in the run tab?\").\n"
           "     ONE city, never two: a second instance would be a second world with a\n"
           "     second save that silently drifts from the first, and MOVING the iframe\n"
           "     into this panel would reload it and throw away where he is standing. So\n"
           "     the RUN tab routes to the city panel. The tab lights up as normal; only\n"
           "     the panel under it changes, and the run slice's iframe stays in the\n"
           "     document so everything that posts to runFrame still finds it. */\n"
           "  var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;\n"
           "  document.getElementById('p-'+PANEL).classList.add('on');\n")

SUBS = [
    ("  if(t.dataset.p==='city'&&!document.getElementById('cityFrame')){",
     "  if(PANEL==='city'&&!document.getElementById('cityFrame')){"),
    ("  else if(t.dataset.p==='city'){ citySendPlayer(); }",
     "  else if(PANEL==='city'){ citySendPlayer(); }"),
]


def main():
    s = open(ALPHA, encoding='utf8').read()
    if MARK in s:
        print('already patched')
        return 0
    if OLD_ACT not in s:
        print('FAIL: the tab activation block is not where this patch expects it. '
              'Somebody moved it; re-read the handler before patching.')
        return 1
    s = s.replace(OLD_ACT, NEW_ACT, 1)
    for a, b in SUBS:
        if a not in s:
            print('FAIL: could not find %r' % a[:60])
            return 1
        s = s.replace(a, b, 1)
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('OK: the RUN tab now opens the city. One frame, one world, one save.')
    return 0


if __name__ == '__main__':
    sys.exit(main())

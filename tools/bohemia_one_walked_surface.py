#!/usr/bin/env python3
"""
ONE WALKED SURFACE OWNS THE REPORT (9/5/26, SOUNDS lane) - the second half of
BB-THE-CITY-SENDS-WHERE, and it is a bug the fix itself created.

WHAT HAPPENED. The walked city now posts BOHEMIA_WHERE every four seconds. The
run slice has posted the same message every four seconds since 8/1. They are two
documents with TWO INDEPENDENT CLOCKS, and the shell's handler is STATEFUL: it
keeps LASTMIN and turns the difference between one report and the next into a
JUMP, and a jump of an hour or more strikes the hour chime.

CAUGHT BY sfx_wired_gate, on the real surface, in as many words:

    THE GAME PLAYED OVER HIM WHILE HE WAS VOTING: the run asked for a sound
    with the judge sheet open and ['time_pass.0' ... 'time_pass.1'] rendered

Twelve strikes. Twelve is STRIKE_MAX, the cap -- so the handler had been told
the clock jumped at least twelve hours, which is what you get when two clocks
that disagree take turns answering the same question. Every four seconds.

*** AND HE HAS REPORTED THIS EXACT SYMPTOM MORE THAN ONCE. *** The gate's own
message says so. The 8/16 ruling behind it is THE GAME DOES NOT PLAY TO AN EMPTY
ROOM: a sound arriving over the judge sheet is the thing he has complained about
by name, and this would have shipped it back to him.

THE LESSON, and it is not "test more". TURNING ON A SECOND SENDER FOR A
STATEFUL HANDLER IS NOT AN ADDITION, IT IS A RACE. Nothing about the city's
message is wrong and nothing about the run's message is wrong; the handler
simply assumed there was one of them, and that assumption was true for three
weeks and invisible because it was never written down anywhere.

THE FIX: ONE WALKED SURFACE OWNS THE REPORT, and it is the one you are standing
on. The city stamps its report `from:'city'`. While a city report has arrived in
the last twelve seconds, the run's report is ignored -- twelve seconds being
three missed heartbeats, the same recency window AMB already uses to decide
whether the surface is even loaded. If the city ever stops reporting, the run's
report is taken again on the next tick and the shell degrades to exactly what it
did before today.

It is deliberately NOT `ev.source`-based. Both frames are children of the shell,
so the source only says "an iframe", and the question here is not who posted but
WHICH SURFACE THE PLAYER IS STANDING ON. The city is the walked surface -- he
asked for the city in the run tab on 7/28 -- so it wins while it is live.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no sound.

  python3 tools/bohemia_one_walked_surface.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__ONE_WALKED_SURFACE__'

SHELL_ANCHOR = """        LISTENER.inside = !!d.inside;
        AMB.where(d);"""

SHELL_REPLACE = """        /* __ONE_WALKED_SURFACE__ (9/5) -- TWO SENDERS, ONE STATEFUL HANDLER.
           The run slice has posted this every four seconds since 8/1 and the
           walked city started posting it today, and they are two documents with
           two independent clocks. timePass keeps LASTMIN and turns the gap
           between one report and the next into a JUMP, so two clocks taking
           turns read as a twelve-hour leap every four seconds -- twelve hour
           strikes, over the judge sheet, which is a thing he has complained
           about by name (8/16, THE GAME DOES NOT PLAY TO AN EMPTY ROOM).
           TURNING ON A SECOND SENDER FOR A STATEFUL HANDLER IS NOT AN ADDITION,
           IT IS A RACE. So one walked surface owns the report, and it is the one
           he is standing on: the city wins while it is live, and twelve seconds
           of silence from it (three missed heartbeats, the same recency window
           AMB uses) hands the report back to the run exactly as before.
           WHICH SURFACE, NOT WHICH WINDOW: both frames are children of this
           document, so ev.source only says "an iframe" and cannot tell the run
           from the city. But it DOES tell an iframe from a direct post, and
           this document's other branch already uses it that way -- a direct
           post from the parent is a probe, a measurement or his own board, not
           a surface, and one of those must always land or nothing can measure
           this handler at all. So the rule is: an IFRAME that is not the city
           stands down while the city is walking. */
        var _wn = Date.now();
        if(d.from === 'city') WHERE_CITY = _wn;
        else if(ev.source !== window && _wn - (WHERE_CITY || 0) < 12000) return;
        LISTENER.inside = !!d.inside;
        AMB.where(d);"""

SHELL_VAR_ANCHOR = "  var LISTENER = { inside: false };"
SHELL_VAR_REPLACE = ("  var LISTENER = { inside: false };\n"
                     "  var WHERE_CITY = 0;   /* __ONE_WALKED_SURFACE__: when the walked "
                     "city last reported */")

CITY_ANCHOR = """    window.parent.postMessage({type:'BOHEMIA_WHERE',
      inside:inside, night:night, min:min, space:space},'*');"""
CITY_REPLACE = """    /* __ONE_WALKED_SURFACE__ -- SAY WHICH SURFACE THIS IS. The run slice
       posts the same message off its own clock, and the shell's handler is
       stateful: two clocks answering the same question read as an hourly leap
       and strike the hour chime every four seconds. */
    window.parent.postMessage({type:'BOHEMIA_WHERE', from:'city',
      inside:inside, night:night, min:min, space:space},'*');"""


def main():
    print('=== ONE WALKED SURFACE OWNS THE REPORT ===')

    city = open(CITY, encoding='utf8').read()
    alpha = open(ALPHA, encoding='utf8').read()

    if MARK in city and MARK in alpha:
        print('  already installed (idempotent, nothing to do)')
        return 0

    if city.count(CITY_ANCHOR) != 1:
        print('FAIL: the city sender is not where this expects it (%d)'
              % city.count(CITY_ANCHOR))
        return 1
    city = city.replace(CITY_ANCHOR, CITY_REPLACE, 1)
    open(CITY, 'w', encoding='utf8').write(city)
    print("  the city stamps its report from:'city'")

    if alpha.count(SHELL_ANCHOR) != 1:
        print('FAIL: the shell handler is not where this expects it (%d)'
              % alpha.count(SHELL_ANCHOR))
        return 1
    if alpha.count(SHELL_VAR_ANCHOR) != 1:
        print('FAIL: the listener declaration is not unique (%d)'
              % alpha.count(SHELL_VAR_ANCHOR))
        return 1
    alpha = alpha.replace(SHELL_VAR_ANCHOR, SHELL_VAR_REPLACE, 1)
    alpha = alpha.replace(SHELL_ANCHOR, SHELL_REPLACE, 1)
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('  the shell takes the city while the city is live, and falls back to '
          'the run after twelve seconds of silence from it')
    return 0


if __name__ == '__main__':
    sys.exit(main())

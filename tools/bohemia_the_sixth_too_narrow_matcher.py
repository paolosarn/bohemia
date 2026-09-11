#!/usr/bin/env python3
"""
THE SIXTH TOO-NARROW MATCHER (9/11/26, SOUNDS lane) - [music owned], round 2b.

*** THE WHOLE CITY INTERFACE WENT SILENT AND MY OWN CENSUS GATE CAUGHT IT. ***

Running this lane's gates found SOUND REACHABLE at 21 passed, 2 FAILED:

    Not reached and with no written reason: ['ui_tap']
    12 heard on the walked surface, 53 with their own written reason

Checked against plain origin/main in a clean worktree BEFORE blaming my own diff:
it fails there identically. Pre-existing, not mine -- but it is this lane's gate
and it CONTRADICTS A SHIPPED CLAIM OF MINE. THE-OTHER-51 was closed on "0
unexplained", and there is one now.

MEASURED, by asking the running city where its own button lives:

    #phonebtn  parent chain: DIV#barright -> DIV#menubar -> DIV.wrap -> BODY
    closest('#topbar>div')   false
    closest('#devtray>div')  false
    closest('button')        false
    ... every selector the classifier tries: false

**THE PHONE BUTTON MOVED FROM #topbar INTO #menubar > #barright**, another lane's
perfectly reasonable UI change, and the city's tap policy names its containers by
id -- so it matched nothing, and ui_tap, ui_back and ui_deny ALL went silent
across the entire walked city.

*** AND THIS IS THE SIXTH TOO-NARROW MATCHER IN A FUNCTION WHOSE OWN COMMENTS
WARN ABOUT THE FOURTH AND THE FIFTH. *** They are still there to read:

    "The first version of this matched only `button` and missed #phonebtn
     entirely -- measured silent on the walk, WHICH IS THE FOURTH TIME THIS WEEK
     A TOO-NARROW MATCHER HAS TOLD ME SOMETHING WAS MISSING when it was my
     selector that was."
    "A FIFTH TOO-NARROW MATCHER, IN THE FUNCTION WHOSE OWN COMMENT ABOVE WARNS
     ABOUT THE FOURTH."

Six of the same bug is not six mistakes. It is one wrong SHAPE, defended five
times. THE SHAPE IS THE BUG: an ALLOWLIST of containers has to be right about
every place a control will ever live, and it is wrong the moment anybody moves a
bar. Adding `#menubar>div` would be the seventh matcher, already waiting.

*** SO THE ALLOWLIST BECOMES A DENYLIST, WHICH IS WHAT THE FUNCTION'S OWN COMMENT
SAID IN THE FIRST PLACE: "everything else is ui_tap". *** A tap sounds unless the
thing tapped is one of the few that already makes its own noise. That list is
short, it is about SOUND rather than about layout, and it cannot go stale when
somebody renames a div:

    the movement pad      already makes a FOOTSTEP
    the world canvas      walking already makes a footstep, and a tick on every
                          step is the 8/4 two-sounds complaint at its worst
    sleep, the day-card   already carry sleep_sink and come_up
    [data-noui]           the escape hatch for anything built later

TWO RULES I TRIED AND MEASURED AND THREW AWAY, so nobody repeats them:
  * `cursor:pointer` -- the obvious "the author said this is clickable" signal.
    MEASURED: three elements in the entire city document have it, and #phonebtn,
    #sleepbtn, #rungbtn and #pad all report `auto`. It would have caught almost
    nothing.
  * `role` / `tabindex` -- null on every one of them.
A PLAUSIBLE RULE THAT THE DOM DOES NOT ACTUALLY CARRY IS WORSE THAN A NARROW ONE,
because it looks general and is empty.

THE ALLOWLIST DOES NOT DISAPPEAR, IT STOPS BEING THE GATE. It still decides WHICH
element's label to read for the back/refusal test, because that has to resolve a
badge SPAN up to the control it sits in. What changed is that failing to match no
longer means silence -- it means "read the label off the thing that was clicked".

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new event. Three
sounds he already approved (ui_tap 3 of 5, ui_back 3 of 5, ui_deny 3 of 5) get
their callers back.

  python3 tools/bohemia_the_sixth_too_narrow_matcher.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_SIXTH_TOO_NARROW_MATCHER__'

GLYPH_CITY_OLD = ("             : (/^(back|close|cancel|done|x|<|\\u2039|\\u00d7|\\u2190)$/"
                  ".test(lab) ? 'ui_back'")
GLYPH_CITY_NEW = (
    "             /* A CLOSE BUTTON IN THIS GAME IS A MULTIPLICATION X (U+00D7) IN\n"
    "                THIS LIST AND A BALLOT X (U+2715) ON SCREEN. MEASURED: #phoneclose\n"
    "                is exactly one character, U+2715, so every close control in the\n"
    "                city has been answering with a TAP instead of a way OUT since the\n"
    "                day this policy shipped. A GLYPH THAT LOOKS LIKE THE ONE YOU\n"
    "                TYPED IS NOT THE ONE YOU TYPED. The ballot and heavy-ballot X and\n"
    "                the vector cross are in now, and they are the ones a designer\n"
    "                actually reaches for. */\n"
    "             : (/^(back|close|cancel|done|x|<|\\u2039|\\u00d7|\\u2190"
    "|\\u2715|\\u2716|\\u2a2f)$/.test(lab) ? 'ui_back'")

GLYPH_SHELL_OLD = "       /^(back|close|cancel|done|x|<|\u2039|\u00d7|\u2190)$/.test(lab)) return window.playSFX('ui_back');"
GLYPH_SHELL_NEW = ("       /* THE SAME GLYPH HOLE AS THE CITY'S, same reason: a close button\n"
                   "          renders U+2715, not the U+00D7 in this list. */\n"
                   "       /^(back|close|cancel|done|x|<|\\u2039|\\u00d7|\\u2190"
                   "|\\u2715|\\u2716|\\u2a2f)$/.test(lab)) return window.playSFX('ui_back');")

NOUI_ANCHOR = "  var NOUI='#pad,#sleepbtn,.dcgo,[data-noui]';"
NOUI_REPLACE = r"""  /* __THE_SIXTH_TOO_NARROW_MATCHER__ (9/11, SOUNDS lane) -- THE DENYLIST IS THE
     POLICY NOW, AND THE ALLOWLIST BELOW ONLY PICKS WHOSE LABEL TO READ.
     MEASURED: #phonebtn moved from #topbar into #menubar > #barright -- another
     lane's ordinary UI change -- and every selector this function tried came
     back false, so ui_tap, ui_back and ui_deny ALL went silent across the whole
     walked city. My own census gate caught it: 12 of 65 heard instead of 13,
     with ui_tap "not reached and with no written reason".
     SIX OF THE SAME BUG IS NOT SIX MISTAKES, IT IS ONE WRONG SHAPE DEFENDED FIVE
     TIMES. The comments below still warn about the fourth and the fifth. An
     ALLOWLIST OF CONTAINERS has to be right about every place a control will
     ever live; `#menubar>div` would have been the seventh, already waiting.
     So a tap SOUNDS unless the thing tapped already makes its own noise, which
     is what the comment under this always said: "everything else is ui_tap".
     THE CANVAS IS IN HERE NOW AND IT MATTERS: walking already makes a footstep,
     and ticking on every step is the 8/4 two-sounds complaint at its worst.
     TWO RULES MEASURED AND THROWN AWAY so nobody tries them again: cursor:pointer
     is set on THREE elements in this whole document and #phonebtn, #sleepbtn,
     #rungbtn and #pad all report `auto`; role and tabindex are null on all of
     them. A PLAUSIBLE RULE THE DOM DOES NOT CARRY IS WORSE THAN A NARROW ONE. */
  var NOUI='#pad,#sleepbtn,.dcgo,canvas,[data-noui]';"""

BTN_ANCHOR = ("      var btn=nov||t.closest('button')||t.closest('.dcbtn')"
              "||t.closest('.tab')||t.closest('.opt')\n"
              "             ||t.closest('#topbar>div')||t.closest('#devtray>div');\n"
              "      if(!btn) return;")

BTN_REPLACE = r"""      var btn=nov||t.closest('button')||t.closest('.dcbtn')||t.closest('.tab')||t.closest('.opt')
             ||t.closest('[id$="btn"]')
             ||t.closest('#topbar>div')||t.closest('#devtray>div');
      /* NOT MATCHING IS NO LONGER SILENCE. The allowlist above now only resolves
         WHICH element's label to read -- a badge SPAN inside PHONE has to come up
         to the control it sits in for the back/refusal test to mean anything. If
         none of it matches, read the label off what was actually clicked and
         tick anyway, because he tapped something and the game answered. */
      if(!btn) btn=t;
      /* EXCEPT THE PAGE ITSELF. Tapping the body or the outer wrapper is not
         tapping a control, and the world layer is already in NOUI above. */
      if(btn===document.body||btn===document.documentElement) return;
      if(btn.classList&&btn.classList.contains('wrap')) return;"""


def main():
    print('=== THE SIXTH TOO-NARROW MATCHER ===')
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor in (('the denylist', NOUI_ANCHOR),
                         ('the control matcher', BTN_ANCHOR)):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)'
                  % (what, src.count(anchor)))
            return 1

    # POSITIVE CONTROL ON THE PREMISE: this only makes sense if the three UI
    # sounds are really the ones this handler posts, and if the phone button is
    # really outside the containers the old selectors named.
    if "bohemiaCitySfx:{ev:ev}" not in src:
        print('FAIL: this handler does not post the ui event, so the premise of '
              'the fix is wrong')
        return 1
    if 'id="phonebtn"' not in src and "id='phonebtn'" not in src:
        print('FAIL: the phone button this was measured against is not in this '
              'file any more; re-measure before trusting the fix')
        return 1

    src = src.replace(NOUI_ANCHOR, NOUI_REPLACE, 1)
    print('  WIDENED  the denylist now carries the world canvas, so walking '
          'cannot tick')
    src = src.replace(BTN_ANCHOR, BTN_REPLACE, 1)
    print('  FIXED    failing to match a container is no longer SILENCE')

    if GLYPH_CITY_OLD in src:
        src = src.replace(GLYPH_CITY_OLD, GLYPH_CITY_NEW, 1)
        print('  FIXED    a close button renders U+2715 and the list only had '
              'U+00D7, so every close in the city answered with a TAP')
    else:
        print('FAIL: the close-glyph test is not where this expects it')
        return 1

    open(CITY, 'w', encoding='utf8').write(src)

    # AND THE SHELL CARRIES THE SAME HOLE, from the same 8/12 policy.
    alpha = open(ALPHA, encoding='utf8').read()
    if GLYPH_SHELL_OLD in alpha:
        open(ALPHA, 'w', encoding='utf8').write(
            alpha.replace(GLYPH_SHELL_OLD, GLYPH_SHELL_NEW, 1))
        print('  FIXED    the shell had the identical glyph hole')
    elif 'u2715' not in alpha:
        print('FAIL: the shell\'s close-glyph test is not where this expects it')
        return 1
    print('  The phone button moved from #topbar into #menubar>#barright and the '
          'whole city interface went quiet. Six of the same bug is one wrong '
          'shape, not six mistakes.')
    return 0


if __name__ == '__main__':
    sys.exit(main())

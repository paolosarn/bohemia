#!/usr/bin/env python3
"""BOHEMIA CITY QUIRK LANGUAGE (8/25/26, PEOPLE lane) -- the line they say to
your face, in the language they speak.

THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED). The quirk line is what somebody says
when you ask their name: the closest, most personal moment this game has, and
the FIRST true thing you ever learn about one specific human. It was the last
monolingual line in the build. The ambient barks you overhear from across the
street got registers this morning; the person standing in front of you did not.
That is exactly backwards.

tools/bohemia_city_quirk_patch.py regenerates the quirk RUNTIME on every run, so
`qkLine(key, lang)` lives there and takes the register. It does NOT regenerate
the two CALL SITES -- they are inserted once, behind a marker, and re-running is
deliberately a no-op so it can never roll back work built on top. So the call
sites are patched here, once, behind their own marker.

TWO CALL SITES, AND THEY MUST NOT DISAGREE:
  the CARD row      THEY SAID "..."      what you read
  the VOICE post    BOHEMIA_VOICE        what you hear
One of them speaking Spanish while the other speaks English would be a person
whose mouth and subtitles disagree, which is worse than either.

  python3 tools/bohemia_city_quirk_lang_patch.py

Gate: gates/language_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_QUIRK_LANG__'

EDITS = [
    # the card row
    ("    var qkSaid = qkLine(who.key);",
     "    /* __CITY_QUIRK_LANG__ -- in the language they speak (8/25). */\n"
     "    var qkSaid = qkLine(who.key, who.lang);"),
    # the spoken line
    ("      var qkS = qkLine(who.key);",
     "      /* __CITY_QUIRK_LANG__ -- the same register the card shows, so a\n"
     "         person's mouth and their subtitle can never disagree. */\n"
     "      var qkS = qkLine(who.key, who.lang);"),
]


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    for old, _new in EDITS:
        if html.count(old) != 1:
            sys.exit('FAILED: %r resolves %d times in %s, expected 1. '
                     'Look before patching.' % (old.strip(), html.count(old), CITY))
    for old, new in EDITS:
        html = html.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (%d call sites carry the register)' % len(EDITS))


if __name__ == '__main__':
    main()

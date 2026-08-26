#!/usr/bin/env python3
"""BOHEMIA CITY REACTION CONTEXT (8/26/26, PEOPLE lane) -- 66 authored reaction
lines, 1,208 people walked, ZERO of them reachable.

MEASURED ON THE REAL SURFACE BEFORE ANY OF THIS WAS WRITTEN:

    reaction lines authored      66
    people walked in the city    1,208
    reachable through the city   0

engine/bohemia_people.js's linesFor() tries REACTIONS first -- what somebody
says because of what you DID -- and falls through to the ambient buckets. The
walked city has exactly one call to it, and barkOpts() returns `at`, `faction`
and `when`. It has never passed a single reaction key, so not one of those 66
lines could ever be said by anybody, on the surface he actually taps.

THIS IS THE BUG gates/reaction_reach_gate.js WAS WRITTEN FOR, IN THE OTHER
FRAME. Its own header says it: "the walked run called linesFor(who) with NO
ARGUMENTS, so every situation bucket was unreachable." That was found and fixed
in slices/BOHEMIA_RUN_CURRENT.html -- which is behind p-run, the panel the RUN
tab does NOT show (the shell maps RUN to p-city). So the fix landed in the frame
nobody looks at and the walked city kept the defect.

WHAT THE CITY ALREADY HOLDS, and none of it is new work:
    CT_MET.metState(key)   the met bucket, chosen by the ledger that owns the
                           bits rather than re-derived here. The city has never
                           called it once: `grep -c CT_MET.metState` was 0.
    ctOpinionOf(id).rung   where you stand with THIS person, summed from the
                           deeds THEY remember with THEIR own decay. It is
                           already on the card as THEY THINK, so the line and
                           the card can never disagree about the same person.

WHAT IS DELIBERATELY LEFT OUT, SAID PLAINLY RATHER THAN HALF-WIRED:
    saw: / heard:          these buckets are keyed by CLOUT CLASS (quiet /
                           notable / risky / reckless), and the deeds the city
                           records are faction deeds (claim:met, claim:refused,
                           commit, favour) which carry no clout tag at all. The
                           run slice gets its class from RUN.clout, which does
                           not exist here. Inventing a class would be inventing
                           a fact about the player, so those two stay dark and
                           this comment is why.

NOT TOUCHED: the __CITY_REACT__ block and CT_DEED_WORDS. That is a SECOND,
city-local reaction path with eight drafted lines about outfits, and it belongs
to the lane that wrote it. This adds nothing to it and takes nothing from it.

  python3 tools/bohemia_city_reaction_ctx_patch.py

Gate: gates/language_gate.js and gates/city_barks_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_REACTION_CTX__'

ANCHOR = """  try { o.faction = p.faction || null; } catch (_e) {}"""

ADD = """  try { o.faction = p.faction || null; } catch (_e) {}
  /* __CITY_REACTION_CTX__ -- *** A REACTION BEATS AN AMBIENT LINE, ALWAYS, and
     for six weeks not one of them could fire here. *** MEASURED: 66 authored
     reaction lines, 1,208 people walked on this surface, 0 reachable, because
     this function returned `at`, `faction` and `when` and linesFor() looks for
     `met` and `rung` before any of those. Somebody who has known you for a
     month opened with the weather.
     BOTH VALUES ARE READ, NEVER DERIVED. metState is the ledger's own choice of
     bucket, living with the bits that back it, so a surface cannot invent its
     own answer to "have we met"; and the rung is the SAME ctOpinionOf() the
     card prints as THEY THINK, so the line and the card can never disagree
     about one person. */
  /* *** ONLY IF YOU HAVE ACTUALLY MET THEM, and the measurement is what taught
     me this. *** metState() answers 'first' for a person with NO RECORD -- which
     is correct for the card, where "first time" is the honest thing to print,
     and catastrophic here: it made every one of the 1,208 strangers in the
     valley match met:first, so THREE lines outranked every role, act, faction
     and weather bucket in the game and the whole street said the same three
     sentences. Reachable went 0 -> 3, and 3 is the tell: a real wiring lights
     up dozens.
     A REACTION IS ABOUT HISTORY. No record means no history, so a stranger gets
     the ambient line, which is what a stranger should get. met:first still
     fires, at the right moment: the city writes the record when you open their
     card, so it belongs to the person you just walked up to and not to
     everybody you have ever walked past. */
  try {
    var _k = 'P:city:' + p.id;
    o.met = CT_MET.get(_k) ? (CT_MET.metState(_k) || null) : null;
  } catch (_e) {}
  /* *** AND THE LANGUAGE THEY SPEAK, WHICH THIS PATH HAS NEVER SEEN. ***
     linesFor() reads the register off `person.lang`, and this function is handed
     a POPULATION RECORD -- id, ns, nx, ny, zone, home, look, face... and no
     `lang` at all. So every ambient bark in the walked valley silently defaulted
     to English while the engine, the card and the quirk line all spoke in
     register. MEASURED: `'lang' in record` was false for every person alive.
     THE CLAIM THAT SAID OTHERWISE WAS MINE, and it was a side door: it built a
     person with ctPerson() and asked THAT, which is not what this path does.
     ctPerson() is the one derivation, so it is asked here rather than the block
     seed being hashed a second time in a second place. */
  try { o.lang = ctPerson(p).lang || null; } catch (_e) {}
  try {
    /* rungFor() returns the WORD ITSELF ('HOSTILE', 'COLD', 'NEUTRAL', 'WARM',
       'FWU'), which is exactly what the rung: buckets are keyed by. Checked
       against both tables rather than assumed: an extra .word here would have
       resolved to undefined on every person and looked identical to no
       standing at all. */
    var _op = ctOpinionOf(p.id);
    o.rung = (_op && typeof _op.rung === 'string') ? _op.rung : null;
  } catch (_e) {}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if html.count(ANCHOR) != 1:
        sys.exit('FAILED: the barkOpts faction line resolves %d times in %s, '
                 'expected 1. Look before patching.' % (html.count(ANCHOR), CITY))
    html = html.replace(ANCHOR, ADD, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (barkOpts carries met + rung)')


if __name__ == '__main__':
    main()

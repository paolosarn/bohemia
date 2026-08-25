#!/usr/bin/env python3
"""BOHEMIA CITY LANGUAGE PATCH (8/25/26, PEOPLE lane) -- the walked city was
deriving everybody's language off ONE seed and off a DIFFERENT KEY than their
name.

THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED). LANG-1 shipped language as a thing
derived from the identity key, weighted to Clark County and CLUSTERED the way
the county's 139 limited-English tracts cluster. Measured on the real city
surface, neither half of that arrived, for two separate reasons in nine lines of
code:

  1. ONE BLOCK, THE WHOLE VALLEY. ctPerson calls personOf(seed, ...) with the
     city's single global seed as the BLOCK seed. blockMixOf() therefore returns
     the same answer for every person in the city, so the entire walked valley
     is either Spanish-speaking ground or none of it is -- a coin flip on load,
     and the neighbourhoods the whole finding was built on cannot exist. It is
     not a wrong number, it is a mechanic that cannot happen.

  2. TWO IDENTITIES FOR ONE PERSON. ctPerson re-keys the person to the CITY
     record AFTER personOf returns ("keyed to the CITY record, valley-unique")
     and re-derives the NAME from the new key. The language was already derived,
     from the OLD one. So a person's name came from one identity and their
     language from another. Nothing visibly broke, which is exactly why it would
     have sat there: both answers are stable, they are just answers about two
     different people.

THE FIX IS ON THIS SIDE, NOT IN THE ENGINE. personOf is right: it is handed a
block seed and it uses it. What is wrong is what the city hands it. The cell
coordinates are already in the record id ("cx:cy:i"), so a real per-block seed
is one hash of numbers this frame already has.

  python3 tools/bohemia_city_language_patch.py

Gate: gates/language_gate.js (claim G measures the walked city's own mix).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_LANGUAGE__'

OLD = """function ctPerson(p){
  var a=ctAgent(p);
  var key='P:city:'+p.id;
  var who=BohemiaPeople.personOf(seed>>>0, a, { asked: CT_MET.asked(key) });
  who.key=key;                              /* keyed to the CITY record, valley-unique */
  if(who.tier==='asked') who.name=BohemiaPeople.generatedName(key);
  return who;
}"""

NEW = """function ctPerson(p){
  var a=ctAgent(p);
  var key='P:city:'+p.id;
  var who=BohemiaPeople.personOf(seed>>>0, a, { asked: CT_MET.asked(key) });
  who.key=key;                              /* keyed to the CITY record, valley-unique */
  if(who.tier==='asked') who.name=BohemiaPeople.generatedName(key);
  /* __CITY_LANGUAGE__ (8/25) -- WHAT THEY SPEAK, OFF THE SAME IDENTITY AS THEIR
     NAME AND OFF THE BLOCK THEY ACTUALLY LIVE ON.
     Two bugs, both invisible because both answers were stable:
       personOf was handed the CITY'S ONE GLOBAL SEED as a block seed, so
       blockMixOf() gave the same answer for every person in the valley and the
       whole city came out as one kind of neighbourhood. The 139 limited-English
       tracts this was built from are a CLUSTERING fact; one block cannot cluster.
       And the language was derived BEFORE the re-key two lines up, so a person's
       name came off the city identity and their language off the block one. Two
       identities for one person is how a body ends up disagreeing with itself.
     The cell is already in the record id ("cx:cy:i"), so the block seed is one
     hash of numbers this frame is already holding. */
  var q=String(p.__id||p.id||'').split(':');
  var cellSeed=BohemiaPeople.hash(seed>>>0, (+q[0]||0)+1, (+q[1]||0)+1);
  who.lang=BohemiaPeople.langOf(cellSeed, key);
  return who;
}"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        if OLD in html:
            sys.exit('FAILED: the mark is present AND the old body is present. '
                     'Two copies of ctPerson, refusing to guess.')
        print('  already applied  ' + CITY)
        return
    if html.count(OLD) != 1:
        sys.exit('FAILED: ctPerson resolves %d times in %s, expected 1.\n'
                 'Somebody changed it; mirror this fix by hand rather than letting '
                 'this tool guess.' % (html.count(OLD), CITY))
    html = html.replace(OLD, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (ctPerson: per-block seed + language re-keyed)')


if __name__ == '__main__':
    main()

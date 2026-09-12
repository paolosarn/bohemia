#!/usr/bin/env python3
"""
V209 -- AN EMPTY STORED HAND NEVER TAKES A KEY OFF YOU  (COMBAT lane)

A FIX FOR A BUG I SHIPPED IN V206 [loot kept] ON 9/12, FOUND BY ANOTHER OF THIS
LANE'S OWN GATES AFTER IT WAS ALREADY ON MAIN. It gets its own tool because V206 is
shipped and its MARK makes it idempotent, so the repair has to be able to land on a
build that already carries it.

*** WHAT BROKE, AND IT IS A REAL LOSS PATH AND NOT A HARNESS ARTIFACT. ***
  1. Every fight's setup calls keysLoad(), which REPLACED KEYS.taken with whatever
     localStorage['bohemia.keys'] held.
  2. On a fresh profile that key had never been WRITTEN. The read returned null, the
     branch was skipped, and keys held in memory survived -- which is why nobody had
     ever been bitten by step 1.
  3. V206 gave the shell a keeper that MIRRORS the published list into that same
     storage key, so the city could finally see what you hold. And the first thing
     the fight publishes on boot is an EMPTY hand.
  4. So from then on the record said "[]", and the next fight's setup handed back
     nothing. Three key-gated abilities (PATCH IT, LIGHT IT, SEND HIM -- the ward,
     burn and dogs keys) dropped out of the kit, and two arms of
     fight_moves_you_gate went red: 170/0 became 168/2.

MEASURED, NOT REASONED: a probe staged the three keys into KEYS.taken, ran the
shipped setupCombat, and read them back as an EMPTY ARRAY.

HOW I MISSED IT, WRITTEN DOWN BECAUSE THE LESSON IS THE USEFUL PART: my lane pass
for V206 ran the loot gate, the zoom gate, the entry gate, the lab gate, the demo
build and the blob integrity -- and NOT fight_moves_you, because I had run it the
round before and it was 170/0. A GATE YOU RAN LAST ROUND IS NOT A GATE YOU RAN.
The bug was in the one I skipped.

THE GUARD IS THE RULE AND NOT THE SYMPTOM, at both ends:
  THE FIGHT  loading is for RESTORING a hand, never for emptying one. If the record
             says nothing and you are holding something, the record is the thing
             that is behind.
  THE SHELL  it never writes an empty hand over a real one, because the cheapest
             place to not lose something is to not write the loss down.
Either guard alone fixes today's bug. Both are here because they are two different
mistakes: one trusts a stale record, the other creates one.

NO DAMAGE BEFORE THE DIAL: nothing here touches a number. It stops a key from being
forgotten.
"""
import re
import sys
import base64

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__KEYS_GUARD__'

OLD_LOAD = "    if(raw){ const o=JSON.parse(raw); if(Array.isArray(o))KEYS.taken=o; } }"
NEW_LOAD = ("    if(raw){ const o=JSON.parse(raw);\n"
            "      /* V209 " + MARK + ": AN EMPTY STORED HAND NEVER TAKES A KEY OFF YOU.\n"
            "         Loading is for RESTORING a hand, never for emptying one: if the record says\n"
            "         nothing and you are holding something, the record is the thing that is\n"
            "         behind. V206 gave the shell a keeper that mirrors the published list into\n"
            "         this key and the first thing the fight publishes is an empty hand, so this\n"
            "         line started handing back nothing at the top of every fight and three\n"
            "         key-gated abilities left the kit. */\n"
            "      if(Array.isArray(o) && (o.length || !KEYS.taken.length))KEYS.taken=o; } }")

OLD_KEEP = """function bohKeepKeys(list){
  try{ window.bohemiaKeys=(list||[]).slice(); }catch(_e){}
  try{ localStorage.setItem(BOH_KEYS_LS,JSON.stringify((list||[]).slice())); }catch(_e){}
}"""
NEW_KEEP = """function bohKeepKeys(list){
  var a=(list||[]).slice();
  try{ window.bohemiaKeys=a; }catch(_e){}
  /* V209 """ + MARK + """: AND IT NEVER WRITES AN EMPTY HAND OVER A REAL ONE. The
     fight reloads this key at the top of every fight, so a stored [] is not a
     neutral value -- it is an instruction to forget. The fight carries its own
     guard for the same reason; this is the other end of it, because the cheapest
     place to not lose something is to not write the loss down. */
  try{ if(a.length){ localStorage.setItem(BOH_KEYS_LS,JSON.stringify(a)); }
       else { var had=localStorage.getItem(BOH_KEYS_LS);
              var prev=null; try{ prev=had?JSON.parse(had):null; }catch(_p){ prev=null; }
              if(!prev||!prev.length)localStorage.setItem(BOH_KEYS_LS,'[]'); } }catch(_e){}
}"""


def main():
    s = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", s)
    if not m:
        sys.exit('no COMBAT_B64')
    blob = base64.b64decode(m.group(1)).decode('utf-8')

    did = False
    if MARK in blob:
        print('  the fight is already guarded')
    elif blob.count(OLD_LOAD) == 1:
        blob = blob.replace(OLD_LOAD, NEW_LOAD, 1)
        did = True
    else:
        sys.exit('ANCHOR blob/keysLoad: expected 1, found %d' % blob.count(OLD_LOAD))
    if did:
        s = s[:m.start(1)] + base64.b64encode(blob.encode('utf-8')).decode('ascii') + s[m.end(1):]

    if MARK in s.replace(base64.b64encode(blob.encode('utf-8')).decode('ascii'), ''):
        print('  the shell is already guarded')
    elif s.count(OLD_KEEP) == 1:
        s = s.replace(OLD_KEEP, NEW_KEEP, 1)
        did = True
    elif 'never writes an empty hand over a real one' in s:
        print('  the shell is already guarded')
    else:
        sys.exit('ANCHOR shell/bohKeepKeys: expected 1, found %d' % s.count(OLD_KEEP))

    if did:
        s = re.sub(r'(<div id="buildstamp"[^>]*>)BUILD [^<]+(</div>)',
                   r'\g<1>BUILD 9/12k - A GUN IS IN ITS OWN WAY UP CLOSE\g<2>', s, count=1)
        open(ALPHA, 'w', encoding='utf-8').write(s)
        print('V209 applied to', ALPHA)


if __name__ == '__main__':
    main()

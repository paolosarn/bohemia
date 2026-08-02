#!/usr/bin/env python3
"""
BOHEMIA — HIS 8/2 MUSIC VERDICTS, BAKED (batch 21 judged)

He judged the whole sheet. Batch 21 went 2 of 4:

  NOBODY CASHES OUT            CANON   (lead LASTRITES, the undertone stack)
  TITHE FOR THE EMPTY PEWS     CANON   (lead TITHEBELL, differential decay)
  THE HOUSE ALWAYS REMEMBERS   DOWN
  THE LAST LIGHT ON THE STRIP  DOWN

Plus one older song went down in the same sitting: WHAT THE PIT BOSS BURIED
(batch 19). Three names in his explicit graveyard line, three buried here.

WHAT "PROCESSING A VERDICT PASTE" MEANS, from the cook prompt: canon baked into
defaults, downs BURIED and excluded from every play pool, kill reasons logged
when given (he gave none this time, so none are invented -- the post-mortem in
the graveyard says what I OBSERVE, and says that it is my inference).

SONG-DEAD-NOT-VOICES (Paolo 7/20): the graveyard is final for SONGS ONLY.
ossuary and dyingfilament are NOT dead. Both are newborn topologies that have
never had a second fashion, and the law explicitly keeps voices alive for new
songs. They stay in the rack, ledgered, legal.

AND ONE BUG FIXED WHILE I WAS IN HERE. His HERO BEAT ruling (CAMPFIRE
CONFESSION#1: BEAT 4) had nowhere to live but localStorage: MUS.load() reads
`d.hero` from the save and there was no HERO_DEFAULTS baked in code, unlike
CANON_DEFAULTS and CAT_DEFAULTS which both exist precisely so his rulings
survive a stale save. So a cleared cache, a new deploy or a second device would
have silently thrown that ruling away. That is the same class of defect the SFX
judge surface had on 8/1 -- HIS VERDICTS ARE A REPO FILE, NOT A COOKIE -- and it
gets the same fix: HERO_DEFAULTS baked in code, the save only overriding it.

Idempotent: re-running rewrites the same three tables rather than stacking.

  python3 tools/bohemia_music_verdicts_8_2.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- his sheet -------------------------------------------------------------
DOWN = ['WHAT THE PIT BOSS BURIED',
        'THE HOUSE ALWAYS REMEMBERS',
        'THE LAST LIGHT ON THE STRIP']
CANON_NEW = ['NOBODY CASHES OUT', 'TITHE FOR THE EMPTY PEWS']

# NEW_VIBES keeps the survivors: they are still the freshest songs in the build
# and still deserve the NEW badge until the next cook answers the dead slots.
NEW_VIBES = CANON_NEW

HERO = {'CAMPFIRE CONFESSION#1': 4}

CATS = {
    'A NAME NOT YET CHOSEN': 'CUSTOM',
    'BROKEN WINDOW ANTHEM': 'ANARCHISTS',
    'CAMPFIRE CONFESSION': 'OVERWORLD NIGHT',
    'DEAD MANS SLIDE': 'HOMELESS',
    'DELTA BLUES': 'NETWORK',
    'FLUORESCENT DAWN': 'CHURCH',
    'GHOST IN THE GRID': 'OVERWORLD NIGHT',
    'HANDS THAT STILL BUILD': 'VOLUNTEERS',
    'HIGHWAY 15 SOUTH': 'CARAVANS',
    'MENU — DEAD VALLEY DAWN': 'MENU',
    'MENU — EMBER VIGIL': 'MENU',
    'MENU — FIRST MORNING': 'MENU',
    'MENU — LIGHTS ACROSS THE VALLEY': 'MENU',
    'MENU — PURPLE DAWN': 'MENU',
    'MENU — WIND OVER THE MESA': 'MENU',
    'PALE RIDER': 'OVERWORLD DAY',
    'PARADE OF LOST BALLOONS': 'COLORFUL',
    'PYREFLIES RISE': 'OVERWORLD DAY',
    'RATTLESNAKE': 'OVERWORLD DAY',
    'REPO MAN': 'OVERWORLD NIGHT',
    'SATELLITE PRAYER': 'OVERWORLD NIGHT',
    'SERVER FARM': 'NETWORK',
    'SLOW BLEED': 'OVERWORLD NIGHT',
    'SLOW CREEP': 'OVERWORLD NIGHT',
    'TAPS FOR THE VALLEY': 'OVERWORLD DAY',
    'THE BOSS TAKES HIS CUT': 'MOB',
    'THE CHOIR THAT STAYED': 'OVERWORLD NIGHT',
    'THE COUNTING ROOM': 'CARTEL',
    'THE FORECLOSURE NOTICE': 'REDS',
    'THE LAST GOOD CHECK': 'BLUES',
    'THE ORGAN IN THE DROWNED CHAPEL': 'OVERWORLD NIGHT',
    'THE PIT BOSS IS GONE': 'OVERWORLD NIGHT',
    'THE VAULT': 'OVERWORLD NIGHT',
    'THE WIND LEARNS WORDS': 'OVERWORLD DUSK/DAWN',
    'THRONE OF STATIC': 'REMNANTS',
    'TWO COINS FOR THE FERRYMAN': 'OVERWORLD DUSK/DAWN',
    'WHAT THE APPRENTICE BUILDS': 'TRADES',
    # 'WIND THROUGH THE COUNTING HOUSE' IS ON HIS SHEET AND IS DELIBERATELY
    # NOT BAKED. That song was graveyarded on 7/19 and GRAVEYARD IS FINAL
    # outranks a stale line in an export: tagging a dead song puts it back
    # into the faction combat pool, which is exactly what the graveyard and
    # combat-pool gates caught when I baked it. The export lists it because
    # the category sheet remembers old assignments, not because he re-canoned
    # the song -- his own DOWN line for it still stands.
}


def main():
    s = open(ALPHA, encoding='utf8').read()
    orig = s

    # ---- 1. CANON_DEFAULTS: approvals in, downs BURIED at 0 ---------------
    m = re.search(r'const CANON_DEFAULTS=\{(.*?)\};', s, re.S)
    if not m:
        print('FAIL: CANON_DEFAULTS not found')
        return 1
    body = m.group(1)
    pairs = dict(re.findall(r"'([^']+)':(-?\d+)", body))
    for n in CANON_NEW:
        pairs[n + '#1'] = '2'
    for n in DOWN:
        pairs[n + '#1'] = '0'        # 0 is what the play pools filter on
    rebuilt = ','.join("'%s':%s" % (k, v) for k, v in pairs.items())
    s = s[:m.start()] + 'const CANON_DEFAULTS={' + rebuilt + '};' + s[m.end():]

    # ---- 1b. DEAD SONGS LEAVE THE WORKING LIST ---------------------------
    # Burying at 0 keeps them out of the play pools, but GRAVEYARD IS FINAL says
    # dead things are out of the WORKING LIST too, and the graveyard gate counts
    # any `n:'NAME'` still sitting in MLOOPS as a LIVE REFERENCE to a dead thing.
    # Every previously-killed song is already gone from MLOOPS; these three go
    # the same way. The 0 entries above stay as tombstones.
    i0 = s.index('const MLOOPS=['); j0 = s.index('\n];', i0)
    head = "const MLOOPS=["
    body = s[i0 + len(head):j0]
    # REBUILD FROM PARSED ENTRIES, never regex-surgery. Cutting a song out with
    # a pattern leaves the neighbouring comma behind, and `},\n,\n{` is an
    # EMPTY SLOT in the array -- the exact hole that crashed MLOOPS[130] earlier
    # today. Split on the entries, drop the dead, join with one comma. A hole
    # becomes impossible rather than merely unlikely.
    entries = [ln.strip().rstrip(',') for ln in body.split('\n')
               if ln.strip().startswith("{n:'")]
    keep, cut = [], []
    for e in entries:
        name = e.split("'")[1]
        (cut if name in DOWN else keep).append(name)
        if name not in DOWN:
            pass
    kept = [e for e in entries if e.split("'")[1] not in DOWN]
    s = s[:i0] + head + '\n ' + ',\n '.join(kept) + s[j0:]
    if cut:
        print('  removed %d dead song(s) from MLOOPS (graveyard final): %s'
              % (len(cut), ', '.join(cut)))

    # ---- 2. CAT_DEFAULTS: his org, baked ----------------------------------
    m = re.search(r'const CAT_DEFAULTS=\{(.*?)\};', s, re.S)
    if not m:
        print('FAIL: CAT_DEFAULTS not found')
        return 1
    cur = dict((k, v) for k, v in re.findall(r"'([^']+)':\[([^\]]*)\]", m.group(1)))
    for song, cat in CATS.items():
        cur[song + '#1'] = "'" + cat + "'"
    # PRUNE TAGS FOR SONGS THAT NO LONGER EXIST. This tool only ever ADDED, so
    # when I wrongly baked a category for the graveyarded WIND THROUGH THE
    # COUNTING HOUSE, deleting it from the list above did not remove it from the
    # alpha -- the table is rebuilt from the file, so the bad entry was sticky
    # and the combat-pool gate stayed red. A tag pointing at a song that is not
    # in MLOOPS is dead weight at best and, per that gate, a real defect: it
    # nominates a corpse for a play pool. GRAVEYARD IS FINAL, applied to
    # categories too.
    live = set(re.findall(r"\{n:'([^']+)'", s[s.index('const MLOOPS=['):]))
    dropped = [k for k in cur if k.rsplit('#', 1)[0] not in live]
    for k in dropped:
        del cur[k]
    if dropped:
        print('  pruned %d tag(s) for songs no longer in MLOOPS: %s'
              % (len(dropped), ', '.join(sorted(dropped))))
    rebuilt = ',\n '.join("'%s':[%s]" % (k, v) for k, v in sorted(cur.items()))
    s = s[:m.start()] + 'const CAT_DEFAULTS={\n ' + rebuilt + '};' + s[m.end():]

    # ---- 3. HERO_DEFAULTS: new, because his 7/23 ruling had no home -------
    hero_lit = ('/* HERO_DEFAULTS (8/2): his hero-beat rulings, baked in CODE.\n'
                '   They used to live ONLY in localStorage -- MUS.load() read d.hero and\n'
                '   there was no baked table, unlike CANON_DEFAULTS and CAT_DEFAULTS which\n'
                '   exist for exactly this reason. A cleared cache or a second device threw\n'
                '   the ruling away silently. HIS VERDICTS ARE A REPO FILE, NOT A COOKIE. */\n'
                'const HERO_DEFAULTS={'
                + ','.join("'%s':%d" % (k, v) for k, v in HERO.items()) + '};\n')
    if 'const HERO_DEFAULTS=' in s:
        s = re.sub(r'/\* HERO_DEFAULTS \(8/2\).*?const HERO_DEFAULTS=\{[^}]*\};\n',
                   hero_lit, s, count=1, flags=re.S)
    else:
        anchor = 'const CAT_DEFAULTS={'
        s = s.replace(anchor, hero_lit + anchor, 1)

    # and make load() actually use it: the save overrides, the bake is the floor
    old_load = "this.hero=(d&&d.hero)||{};"
    new_load = "this.hero=Object.assign({},HERO_DEFAULTS,(d&&d.hero)||{});"
    if old_load in s:
        s = s.replace(old_load, new_load, 1)
    elif new_load not in s:
        print('FAIL: could not wire HERO_DEFAULTS into load()')
        return 1
    # the no-save branch has to bake it too
    old_fresh = "if(!d){this.V=Object.assign({},CANON_DEFAULTS);this.hero={};this.bakeCats();return;}"
    new_fresh = ("if(!d){this.V=Object.assign({},CANON_DEFAULTS);"
                 "this.hero=Object.assign({},HERO_DEFAULTS);this.bakeCats();return;}")
    if old_fresh in s:
        s = s.replace(old_fresh, new_fresh, 1)

    # ---- 4. NEW_VIBES = the survivors -------------------------------------
    m = re.search(r'const NEW_VIBES=\[[^\]]*\];', s)
    s = s[:m.start()] + 'const NEW_VIBES=[' + \
        ','.join("'" + n + "'" for n in NEW_VIBES) + '];' + s[m.end():]

    if s == orig:
        print('nothing changed')
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('HIS 8/2 VERDICTS ARE BAKED.')
    print('  CANON  ' + ', '.join(CANON_NEW))
    print('  BURIED ' + ', '.join(DOWN))
    print('  cats   %d assignments baked' % len(CATS))
    print('  hero   %s (and HERO_DEFAULTS now exists at all)' % HERO)
    print('  NEW_VIBES = the two survivors')
    return 0


if __name__ == '__main__':
    sys.exit(main())

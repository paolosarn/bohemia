"""10/1 LIFE+CITY: register EVERYTHING YOU CAN BUILD. As TEXT, only my own new object; nobody else's bytes move.
Also re-asserts that my two withdrawn, unjudged rows stay out (a merge restored them once already)."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read(); json.loads(s)
for gone in ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']:
    if gone in s: sys.exit('REFUSING: %s is back in the queue; run tools/bohemia_vote_registry_round4.py first.' % gone)
NEW_ID = 'lifecity-everything-you-can-build-10-1'
if NEW_ID in s:
    print('already there'); sys.exit(0)
obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "10/1",
       "title": "EVERYTHING YOU CAN BUILD",
       "why": ("This is the whole build list, all eight things, each one drawn on the street you already "
               "approved. Every one costs 1 battery and 1 day. The two in gold come first in any part of the "
               "city you take: a WALL, which makes nothing but keeps wild hogs out of your gardens, and a WATER "
               "TANK with a lid, which makes water and keeps pigeons from fouling it. Then a SHED (tape, for "
               "fixing armor), a PUMP HOUSE (water), a GARDEN BED (food), a SOLAR PANEL (a battery back every "
               "day), a VENDOR STALL (people learn your name) and a ROOF on a dead house, which puts a family "
               "back in it and is high ground in a fight. Nothing you build makes medicine or bullets: you buy "
               "those, like in Battle Brothers. The words on each card come straight from the game. Thumbs up "
               "and this is the list. Thumbs down and say what is missing or wrong."),
       "show": {"how": "image", "src": "vote/LIFECITY_EVERYTHING_YOU_CAN_BUILD_10_1.png"}}
v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
indent = ' ' * len(s[:close].split('\n')[-1])
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registered', NEW_ID, '->', SHA)

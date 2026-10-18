"""10/9 LIFE+CITY: register BUILT ON THE MAP. As TEXT, only my own new object; nobody else's bytes move.
Also re-asserts that my two withdrawn, unjudged rows stay out (a merge restored them once already)."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read(); json.loads(s)
for gone in ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']:
    if gone in s: sys.exit('REFUSING: %s is back in the queue; run tools/bohemia_vote_registry_round4.py first.' % gone)
NEW_ID = 'lifecity-built-on-the-map-10-9'
if NEW_ID in s:
    print('already there'); sys.exit(0)
obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "10/9",
       "title": "WHAT YOU BUILT, ON THE MAP",
       "why": ("What you build in a town now stands beside that town on the map the next morning, pays into your own purse, and counts in the future your kids inherit. You see it on the map at your base: the left shot is before, the right is the next morning with a wall and a tank."),
       "show": {"how": "image", "src": "vote/LIFECITY_BUILT_ON_THE_MAP_10_9.png"}}
v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
indent = ' ' * len(s[:close].split('\n')[-1])
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registered', NEW_ID, '->', SHA)

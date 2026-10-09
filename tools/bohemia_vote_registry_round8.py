"""10/9 LIFE+CITY: register A DAY ON THE MAP. As TEXT, only my own new object; nobody else's bytes move.
Also re-asserts that my two withdrawn, unjudged rows stay out (a merge restored them once already)."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read(); json.loads(s)
for gone in ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']:
    if gone in s: sys.exit('REFUSING: %s is back in the queue; run tools/bohemia_vote_registry_round4.py first.' % gone)
NEW_ID = 'lifecity-a-day-on-the-map-10-9'
if NEW_ID in s:
    print('already there'); sys.exit(0)
obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "10/9",
       "title": "A DAY ON THE MAP IN TWENTY SECONDS",
       "why": ("This is the real game's map, filmed from the game's own camera, one frame every half hour from "
               "6 in the morning to 9:30 at night. The parties walk with a reason (caravans between towns, "
               "patrols on their border, crews going to take something) and now nobody ever stands on top of "
               "anybody: before this, two or three parties stood on the same spot more than half the time. Each "
               "party leaves footprints in its faction's colour that fade over a day. The towns having a market "
               "day have a bigger crowd at the gate, and when you walk in, it is the same market. Thumbs up and "
               "this is how the map lives. Thumbs down and say what feels wrong."),
       "show": {"how": "image", "src": "vote/LIFECITY_A_DAY_ON_THE_MAP_10_9.gif"}}
v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
indent = ' ' * len(s[:close].split('\n')[-1])
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registered', NEW_ID, '->', SHA)

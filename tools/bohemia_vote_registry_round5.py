"""9/29 LIFE+CITY: register TWO DAYS OF BUILDING. As TEXT, only my own new object; nobody else's bytes move.
Also re-asserts that my two withdrawn, unjudged rows stay out (a merge restored them once already)."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read(); json.loads(s)
for gone in ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']:
    if gone in s: sys.exit('REFUSING: %s is back in the queue; run tools/bohemia_vote_registry_round4.py first.' % gone)
NEW_ID = 'lifecity-two-days-of-building-9-29'
if NEW_ID in s:
    print('already there'); sys.exit(0)
obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "9/29",
       "title": "TWO DAYS OF BUILDING ON YOUR LOT",
       "why": ("You said building is back, in your own home base. This is it running for real on the street "
               "you already approved. You start with 2 batteries. Day 0 you put up a solar panel: costs 1 "
               "battery and a day. Day 1 it's standing, it pays you a battery back, the windows it feeds come "
               "on, and you put up a stall. Day 2 both stand: the panel pays again and the stall makes your "
               "name known. The numbers under each picture are the game's own money, not mine. Everything you "
               "build carries into your kids' generation, and a raid can take it away. There are seven things "
               "on the list: shed, pump house, garden bed, solar panel, stall, a roof back on a dead house "
               "(that one houses a family and is high ground in a fight), and a wall that makes nothing but is "
               "there for the day they come. Two of them are drawn here; the other five get drawn next from "
               "your approved street. Thumbs up and that is the build list. Thumbs down and tell me what "
               "should be on it instead."),
       "show": {"how": "image", "src": "vote/LIFECITY_TWO_DAYS_OF_BUILDING_9_29.png"}}
v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
indent = ' ' * len(s[:close].split('\n')[-1])
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registered', NEW_ID, '->', SHA)

"""9/30 LIFE+CITY: register WHAT YOU HOLD. As TEXT, only my own new object; nobody else's bytes move.
Also re-asserts that my two withdrawn, unjudged rows stay out (a merge restored them once already)."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read(); json.loads(s)
for gone in ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']:
    if gone in s: sys.exit('REFUSING: %s is back in the queue; run tools/bohemia_vote_registry_round4.py first.' % gone)
NEW_ID = 'lifecity-what-you-hold-9-30'
if NEW_ID in s:
    print('already there'); sys.exit(0)
obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "9/30",
       "title": "YOU BUILD WHAT YOU HOLD",
       "why": ("You asked where you get to build. The answer we went with: only on the parts of the city you "
               "hold, and what you hold grows. This is it running for real on the street you approved. "
               "Day 0 the Mob holds this street, so you try to build a wall and the game says no, and it "
               "costs you nothing. Day 1 you take the street. You put up the first two things any place "
               "you hold should get: a wall, because wild hogs eat the gardens, and a water tank with a lid, "
               "because pigeons foul open water. Day 2 both stand and the tank has made its first water. "
               "Day 3 a raid wrecks the street and everything you built falls: the wall is knocked into "
               "rubble and the tank lies on its side. Your kids' generation now inherits 0 of those, "
               "not 2. If someone just takes the street instead of wrecking it, your stuff stands but pays "
               "them, until you take it back. Take the next part of the city and you can build there too; "
               "by act 3 that can be half of Vegas. Thumbs up and that is how building works. "
               "Thumbs down and say what should be different."),
       "show": {"how": "image", "src": "vote/LIFECITY_WHAT_YOU_HOLD_9_30.png"}}
v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
indent = ' ' * len(s[:close].split('\n')[-1])
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registered', NEW_ID, '->', SHA)

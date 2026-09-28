"""EDIT MY OWN OBJECTS IN PLACE, AS TEXT, AND ADD ONE. Never re-serialize the registry: that
re-escapes every other lane's strings. Each of my objects is located by its id and only the
bytes of THAT object are touched. Two of mine were corrected before he voted on them (9/28): the
numbers in their words came from a generate call the game never makes, and one picture's label
had become false. The row cites the commit that carries the pictures."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read()
json.loads(s)

def span_of(s, oid):
    k = s.index('"%s"' % oid)
    a = s.rindex('{', 0, k)
    depth, i = 0, a
    while True:
        c = s[i]
        if c == '"':                      # skip strings whole, braces inside words are words
            i += 1
            while s[i] != '"':
                i += 2 if s[i] == '\\' else 1
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: return a, i + 1
        i += 1

def set_field(s, oid, key, value):
    a, b = span_of(s, oid)
    obj = s[a:b]
    new, n = re.subn(r'("%s":\s*)"(?:[^"\\]|\\.)*"' % key, lambda m: m.group(1) + json.dumps(value), obj, count=1)
    assert n == 1, (oid, key)
    return s[:a] + new + s[b:]

WATER = ('This is not a drawing, it is the dam pulled straight out of the game and coloured by one '
 'question: can you stand here. Green means you can walk on it. Grey is something solid. Top picture is '
 'what the game actually believed: THE WHOLE RESERVOIR IS RED, and red means you could walk out onto it. '
 'Over a third of that block was water you could stand on, 5,832 squares of it, plus the creek at the '
 'fort. It happened because every square has a word saying what it is, one list decides what each word '
 'does, and the word water was not on the list. Anything not on the list quietly becomes floor. Bottom '
 'picture is the same block after the fix: the water is water again and nothing else moved. Empty '
 'fountains and drained pools are still floor like they should be. Thumbs up and the blue is what deep '
 'water looks like from now on. Thumbs down and tell me what water should do to you instead.')
PLACES = ('Six real spots pulled straight out of the game, every square coloured by one answer. Green, you '
 'can walk there. Grey, it is solid. Blue, water. RED means floor walled in with no way in at all: you can '
 'see it and never get there. Across the valley there were 25,055 red squares in 40 places. Top row: a '
 'parking lot sealed off by its own curb, fixed. Middle row: nine ponds where the dirt banks the road runs '
 'along were walls, fixed. Bottom row: the Church\'s home base, where the garden behind the church had a '
 'wall all the way round and no gate, even though the church\'s own notes say there is one. It has two '
 'gates now. Thumbs up if red-means-you-cannot-get-there is the right thing to chase. Thumbs down and tell '
 'me which of these should stay locked on purpose.')
RAID = ('You said fourteen home bases you can raid. These are six of them, pulled straight out of the game, '
 'and RED is floor inside them that nobody can walk onto. If a fight happens here, part of the ground '
 'does not connect to the rest and nothing on the screen tells you. The Remnants\' police station has two '
 'inner yards with no way in. The Volunteers\' medical campus has a parking lot where every single stall is '
 'walled off. The Caravans\' bus terminal has a doorway that opens onto nothing. The church was the worst '
 'one and I fixed it this round; these six are next, biggest first. Thumbs up and I fix these in this order. '
 'Thumbs down and tell me which of these places a raid should never happen in anyway.')

s = set_field(s, 'lifecity-the-water-you-could-stand-on-9-27', 'why', WATER)
s = set_field(s, 'lifecity-the-water-you-could-stand-on-9-27', 'sha', SHA)
s = set_field(s, 'lifecity-places-you-can-see-and-never-enter-9-28', 'why', PLACES)
s = set_field(s, 'lifecity-places-you-can-see-and-never-enter-9-28', 'sha', SHA)

NEW_ID = 'lifecity-where-a-raid-is-fought-9-28'
if NEW_ID not in s:
    obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "9/28",
           "title": "WHERE A RAID IS FOUGHT", "why": RAID,
           "show": {"how": "image", "src": "vote/LIFECITY_WHERE_A_RAID_IS_FOUGHT_9_28.png"}}
    v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
    indent = ' ' * len(s[:close].split('\n')[-1])
    block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
    s = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(s)
io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('registry: 2 corrected, 1 added; items', len(json.loads(s)['items']))

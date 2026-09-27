"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'lifecity-the-same-street-three-times-9-24'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "tile", "lane": "life+city",
  "sha": "830e46dc", "made": "9/24",
  "title": "THE SAME STREET, THREE TIMES",
  "why": "One block. Three dates. Top is the ruin, which is the picture you already gave a thumb up. Middle is the same street reclaimed: the road patched, the power back, solar on a roof and a battery cabinet beside it, the line restrung. Bottom is the same street paying for itself: a second array across the road, the kerbs and the walks rebuilt, a second lamp, and the dead lot turned into a battery swap stand you can work at night. Nothing is ever taken away between one picture and the next, because you said the ruin is the floor. The machine counts that, it does not just say it. And one thing never changes in any of the three: the third house has its lights on and nobody lives in it, in all three acts. Everything around it gets better twice over and it never does. Thumbs up and this is how the city screen draws the act you are in. Thumbs down and tell me which act is wrong.",
  "show": {"how": "image", "src": "vote/LIFECITY_THE_SAME_STREET_THREE_TIMES_9_24.png"}
}
block = '\n'.join('  ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n  \}\n \],', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n  },\n' + block + '\n ],' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

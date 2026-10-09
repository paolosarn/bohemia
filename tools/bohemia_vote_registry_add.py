"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-bb-gear-what-worn-gear-says-10-9'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "outfit", "lane": "character",
  "sha": "pending", "made": "10/9",
  "title": "DO THE THIRTEEN STILL READ APART, SMALL",
  "why": "Battle Brothers reads a man's kit by shape, not colour, because its camera is often far, so I shrank all thirteen gang looks down to a small figure and measured whether each one is still its own shape or colour. Thumbs up, and you see it here, with two pairs honestly flagged as the closest calls for DIRECTION and COOK to look at.",
  "show": {
    "how": "page",
    "src": "vote/CHARACTER_BB_GEAR_WHAT_WORN_GEAR_SAYS.html"
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

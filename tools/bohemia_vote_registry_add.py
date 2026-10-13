"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-body-in-meters-10-13'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/13",
  "title": "THE OLD BODY'S REAL MEASUREMENTS, FOR THE TEAM BUILDING THE REAL ONE",
  "why": "The team building your real 3D body needs to know exactly how tall and wide the old formula's man is, in real meters, so the new one lands in the same spot. I read it straight off the live rig and put a door and a street lamp next to it so the numbers are easy to check by eye. You see it in the record, no tab, nothing was drawn or changed.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md\n\nSeen in: no tab, this is a measurement page, no pixel moved."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

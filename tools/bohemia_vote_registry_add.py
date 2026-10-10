"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-body-scale-gate-was-red-for-the-wrong-reason-10-10'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/10",
  "title": "THE BODY SCALE GATE WAS RED FOR THE WRONG REASON",
  "why": "My own checker for keeping a person one size while he walks was crashing, and it was not the body: the demo now opens on the map by default, so the checker asked for a street nobody was standing on. Fixed the checker, not the game. You see it here, the full story in the record.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_THE_BODY_SCALE_GATE_WAS_MEASURING_NOBODY_10_10_26.txt\n\nSeen in: no tab, this is a gate fix, no pixel moved."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

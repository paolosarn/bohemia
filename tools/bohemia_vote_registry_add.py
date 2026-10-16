"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-is-the-height-range-real-10-16'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/16",
  "title": "THE SHORT-TO-TALL SLIDER NEVER ACTUALLY GOT WIDER",
  "why": "Weeks ago you said yes to people coming in different heights, but I checked the actual game code and that was never built, so I measured exactly how little the slider moves and why the old drawing method cannot go further, for whoever builds your real body model next. You see it in the record, no tab, nothing was drawn or changed.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_IS_THE_HEIGHT_RANGE_REAL_10_16_26.md\n\nSeen in: no tab, this is a verification and a handoff, no pixel moved."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

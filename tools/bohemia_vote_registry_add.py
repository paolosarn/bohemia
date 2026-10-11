"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-look-fix-loop-proven-on-the-coyote-10-11'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/11",
  "title": "TWENTY REAL LOOKS AT ONE COYOTE, LOGGED",
  "why": "Your note said a round that only checks the board is not cooking, so I ran the real render-look-fix loop your new rule asks for on an existing animal, twenty real measurements at three sizes, no pixels touched since that bank is machine made and off limits to hand edits. You see it in the record, no tab, this proves the loop works, nothing here is a final asset.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_THE_COYOTE_LOOK_FIX_LOOP_10_11_26.md\n\nSeen in: no tab, this is a diagnostic/process record, no pixel moved."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

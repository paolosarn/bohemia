"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-dogshit-look-has-one-root-cause-10-11'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/11",
  "title": "EVERY REPAINT SITS ON TOP OF A FORMULA, NOT A DRAWING",
  "why": "You keep saying characters look like dog shit even after a repaint, and I found the one function that draws every body in the game by running numbers instead of real art, which is why paint on top never fixes it. You see it in the record, no tab, this is a diagnostic for the team already building the real replacement.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_THE_DOGSHIT_LOOK_HAS_ONE_ROOT_CAUSE_10_11_26.md\n\nSeen in: no tab, this is a diagnostic record, no pixel moved."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

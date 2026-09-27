"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-one-cell-sprite-9-27'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "animation", "lane": "character",
  "sha": "pending", "made": "9/27",
  "title": "YOUR CHARACTER GOES SMALL",
  "why": "You said your character should stay tiny and move one square at a time, like the game used to. This is the first try at that small body. It plays: it is the game's own walk, shrunk down to the exact size a square will be. Nothing here is hand drawn yet, it is the big body run through a shrinking machine, so a hem or a stripe is gone but the shape and the colour are not. Seven people from seven different groups, each one still readable as themselves and still their own colour, measured, not guessed. Thumbs up and this is the road small bodies go down while somebody draws them by hand. Thumbs down and tell me if it is too small, too blurry, or if two of them look the same.",
  "show": {"how": "page", "src": "vote/CHARACTER_THE_ONE_CELL_SPRITE.html"}
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\}\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n    },\n' + block + '\n  ],\n' + m.group(3) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

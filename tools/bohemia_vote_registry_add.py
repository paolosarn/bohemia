"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-thirteen-are-wearing-it-9-27'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "outfit", "lane": "character",
  "sha": "pending", "made": "9/27",
  "title": "THE THIRTEEN ARE WEARING IT NOW",
  "why": "You said fire on the thirteen new runway shapes, so the thirteen groups put them on. This page PLAYS: every body walks at the speed the game runs at, standing on the street's own road and sidewalk, at the size the game draws a person. Four of them are here instead of thirteen, because these four are the ones that nearly lost their colour when the new clothes went on. The new clothes were searched on SHAPE, so every one of them came out grey or bone, and dressing everybody in them would have washed the colour out of eleven of thirteen groups in one go. Seventeen new colourways fixed that: same coat, same cut, the group's own colour, one line each, no new art. Nobody lost their colour and nobody changed body. Thumbs up and this is who is on your street. Thumbs down and tell me if it is the cut, the colour, or the boots.",
  "show": {"how": "page", "src": "vote/CHARACTER_THE_THIRTEEN_ARE_WEARING_IT.html"}
}
block = '\n'.join('  ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n  \}\n \],', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n  },\n' + block + '\n ],' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

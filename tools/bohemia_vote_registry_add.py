"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-barber-10-1'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "outfit", "lane": "character",
  "sha": "pending", "made": "10/1",
  "title": "THE BARBER",
  "why": "You said you want to change your look at the barber and it should cost a battery. The settlement screen and the barber building itself are a different job, not built yet. What I show here is the two pieces that are mine: the cost, tested with real numbers (a visit really takes one battery, being broke really stops it), and the two editors a barber visit is for, really opening from a real tap, not a mockup. Left is before, closed. Then one tap on your own face opens the face editor. Then one tap on the hair shelf opens the haircut bank, twelve cuts on it today. New hairstyles are a separate job, coming next.",
  "show": {
    "how": "page",
    "src": "vote/CHARACTER_THE_BARBER.html"
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\}\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n    },\n' + block + '\n  ],\n' + m.group(3) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

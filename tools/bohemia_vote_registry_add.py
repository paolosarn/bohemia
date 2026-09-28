"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-the-attachments-trade-9-28'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "outfit", "lane": "character",
  "sha": "pending", "made": "9/28",
  "title": "ARMOUR ATTACHMENTS, THE FIRST ONE",
  "why": "You said you want to customize armor with attachments. I checked our closet first: a cloak and a padded vest were already in there under other names, nobody just called them attachments yet. The one thing missing was a spiked shoulder guard, so that is the one I built. Watch the guy on the right, he is wearing a cloak he already had plus the new spikes, walking. The other guy is wearing the padding. No numbers are attached to any of this yet, that part is a different job. Thumbs up and the spike joins the wardrobe for real. Thumbs down and tell me if the spikes are too small or in the wrong place.",
  "show": {
    "how": "page",
    "src": "vote/CHARACTER_THE_ATTACHMENTS_TRADE.html"
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\}\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n    },\n' + block + '\n  ],\n' + m.group(3) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

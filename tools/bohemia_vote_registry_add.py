"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'lifecity-the-shop-is-still-lit-9-21'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "tile", "lane": "life+city",
  "sha": "f91a6dc3", "made": "9/21",
  "title": "THE SHOP IS STILL LIT, AND EVERY SHELF IN IT IS BARE",
  "why": "A corner store you can walk up to. Three bays, faded awnings, a blank sign out on the lot. Everything in the picture is boring on purpose except ONE thing: the middle shop still has its lights on. Two tubes are still burning in there and what they show you is seven empty shelf runs and a checkout stripped to the counter. A shop that is still open with nothing in it is worse than a dark one. I drew it in the shopping district's own colours so it is the same world you walk. Thumbs up and I build it into the street so you can walk up to a lit shop. Thumbs down and tell me if it is the shop, the light, or the empty shelves.",
  "show": {"how": "image", "src": "vote/LIFECITY_THE_SHOP_IS_STILL_LIT_9_21.png"}
}
block = '\n'.join('  ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n  \}\n \],', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + '\n  },\n' + block + '\n ],' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

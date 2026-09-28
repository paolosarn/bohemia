"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'lifecity-places-you-can-see-and-never-enter-9-28'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "tile", "lane": "life+city",
  "sha": "57b10258", "made": "9/28",
  "title": "PLACES YOU CAN SEE AND NEVER ENTER",
  "why": "Six real spots pulled straight out of the game, every square coloured by one answer. Green, you can walk there. Grey, it is solid. Blue, water. RED means floor that is walled in with no way in at all: you can see it and you can never get there. Across the whole valley there were 25,544 red squares in 40 places. Most were not a missing door, they were something you step over that the game treated as a wall. Top row: a parking lot sealed off by its own curb, fixed, now green. Middle row: nine ponds where the dirt banks between them, the ones the road runs along, were walls, fixed, now green. Bottom row is what is still broken: a stadium field nobody can reach and a church courtyard with no way in. Those need real gates and they are next. From now on none of it can get worse without the checker naming the place. Thumbs up if red-means-you-cannot-get-there is the right thing to chase. Thumbs down and tell me which of these should stay locked on purpose.",
  "show": {"how": "image", "src": "vote/LIFECITY_THE_SAME_STREET_THREE_TIMES_9_24.png"}
}
# LOCATE BY STRUCTURE, NOT BY INDENT. A fixed-indent regex found the end of items[] until
# another lane reformatted the file and it stopped matching entirely -- the SECOND time this
# writer has been broken by somebody else's whitespace. The end of items[] is "the last ']'
# before the "verdicts" key", which is true whatever the indentation is.
v = s.index('"verdicts"')
end = s.rindex(']', 0, v)                 # the ] that closes items[]
close = s.rindex('}', 0, end)             # the } that closes the LAST item
indent = ' ' * (len(s[:close].split('\n')[-1]))
block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
out = s[:close + 1] + ',\n' + block + s[close + 1:]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

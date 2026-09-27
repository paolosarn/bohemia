"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'lifecity-the-water-you-could-stand-on-9-27'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "tile", "lane": "life+city",
  "sha": "a012271e", "made": "9/27",
  "title": "THE WATER YOU COULD STAND ON",
  "why": "This is not a drawing, it is the dam pulled straight out of the game and coloured by one question: can you stand here. Green means you can walk on it. Grey is something solid. Top picture is what the game actually believed until this round: THE WHOLE RESERVOIR IS RED, and red means you could walk out onto it. A third of that block was water you could stand on, 5,329 squares of it, plus the creek at the fort. It happened because every square has a word saying what it is, one list decides what each word does, and the word water was not on the list. Anything not on the list quietly becomes floor. Bottom picture is the same block after the fix: the water is water again, and nothing else moved, the solid stuff is identical in both. The dry stuff stayed walkable too, so empty fountains and drained pools are still floor like they should be. Thumbs up and the blue is what deep water looks like on the map from now on. Thumbs down and tell me what water should do to you instead.",
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

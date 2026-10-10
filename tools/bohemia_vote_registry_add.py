"""INSERT, DO NOT RE-SERIALIZE. Writing the whole registry back through a JSON
dumper re-encodes every other lane's string to whatever escaping this writer
happens to use, and which way that flips depends on who wrote the file last. Two
rounds in a row it produced a diff that touched four other lanes' objects. The
registry rule is never edit somebody else's object, so my object goes in as TEXT
and every byte around it is left exactly as it was found."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'character-wildlife-rig-10-10'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "line", "lane": "character",
  "sha": "pending", "made": "10/10",
  "title": "A COYOTE IS NOT A PHOTOGRAPH OF ITSELF ANYMORE",
  "why": "A coyote on the street used to be its own smaller, blurrier size and never moved a leg; this is a rig fix, not a new look, so no pixel changed and no reference twin exists for an animal nobody has downloaded art of. You see it here, three coyotes forced on screen so you do not have to go find one.",
  "show": {
    "how": "text",
    "src": "records/BOHEMIA_THE_WILDLIFE_RIG_10_10_26.txt; a screenshot sits at slices/vote/CHARACTER_WILDLIFE_RIG.png and the page that frames it at slices/vote/CHARACTER_WILDLIFE_RIG.html, neither is an art sheet under rule 82 (zero new pixels, the coyote bank is untouched) and wildlife is not one of rule 82's named families, so no reference twin was invented.\n\nSeen in: the record and the two files above; no tab yet, this is a rendering mechanism, not a look."
  }
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

"""10/10 LIFE+CITY: RETRACT TAKE THE NEXT PART from VOTE (rule 88: LIFE+CITY is on hold, no VOTE sheet; it was
registered 43 minutes after the hold landed and never judged, so it is pulled back, not killed). As TEXT, only my own
object leaves; nobody else's bytes move. Re-asserts that round13's item stays out."""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
GONE = 'lifecity-take-the-next-part-10-10'
s = io.open(P, encoding='utf-8').read(); d = json.loads(s)
if any(GONE in json.dumps(v) for v in d.get('verdicts', [])):
    sys.exit('REFUSING: %s has a verdict; a judged item is not retracted.' % GONE)
i = s.find('"id": "%s"' % GONE)
if i < 0:
    print('already out'); sys.exit(0)
a = s.rindex('{', 0, i); depth, j = 0, a
while True:
    c = s[j]
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0: break
    j += 1
pre = s[:a].rstrip(); post = s[j + 1:]
if re.match(r'^\s*,', post): s = s[:a].rstrip() + re.sub(r'^\s*,', '', post, count=1)   # an item follows it
else: s = pre[:-1] + post if pre.endswith(',') else pre + post                     # it was the last item
json.loads(s); io.open(P, 'w', encoding='utf-8', newline='').write(s)
print('retracted', GONE)

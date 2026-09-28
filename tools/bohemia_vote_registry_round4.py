"""9/28 round 4, LIFE+CITY. Two of my own UNJUDGED items leave the queue, one new item joins.
Paolo 9/28 ('a combat tile is a house... I read it backwards', records/BOHEMIA_PAOLO_A_COMBAT_TILE_
IS_A_HOUSE_I_READ_IT_BACKWARDS_9_28_26.md) retired the cell-by-cell grid as a fight job, so both
items asked him to decide something no longer on the table, and one said the red floor was ground
he would FIGHT on, which became false. Neither had a verdict. They are removed, never reworded
into something else: an id is never reused and a redo is a new id. Only my own objects move, as
TEXT; nobody else's escaping is touched."""
import io, json, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
SHA = sys.argv[1]
s = io.open(P, encoding='utf-8').read()
d = json.loads(s)
judged = {v.get('id') for v in d['verdicts']}
DROP = ['lifecity-where-a-raid-is-fought-9-28', 'lifecity-places-you-can-see-and-never-enter-9-28']

def span(s, oid):
    k = s.index('"id": "%s"' % oid) if ('"id": "%s"' % oid) in s else s.index('"%s"' % oid)
    a = s.rindex('{', 0, k); depth = 0; i = a
    while True:
        c = s[i]
        if c == '"':
            i += 1
            while s[i] != '"': i += 2 if s[i] == '\\' else 1
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: return a, i + 1
        i += 1

for oid in DROP:
    if oid in judged: sys.exit('REFUSING: %s has a verdict; a judged item is his, not mine to pull.' % oid)
    if oid not in s: continue
    a, b = span(s, oid)
    ls = s.rfind('\n', 0, a) + 1          # start of the object's first line
    j = b
    while s[j] in ' \t': j += 1
    if s[j] == ',':                       # 'obj,\n' -> take the whole lines, comma included
        e = j + 1
        if s[e:e + 2] == '\r\n': e += 2
        elif s[e:e + 1] == '\n': e += 1
        s = s[:ls] + s[e:]
    else:                                 # the last item: take the comma before it instead
        k = a - 1
        while s[k] in ' \t\r\n': k -= 1
        assert s[k] == ',', 'expected a comma before the last item'
        s = s[:k] + s[b:]
    json.loads(s)

NEW_ID = 'lifecity-the-street-falls-and-the-house-stays-lit-9-28'
if NEW_ID not in s:
    obj = {"id": NEW_ID, "kind": "tile", "lane": "life+city", "sha": SHA, "made": "9/28",
           "title": "THE STREET FALLS AND THE EMPTY HOUSE STAYS LIT",
           "why": ("You gave the same-street-three-times picture a thumbs up, and then you said the "
                   "future can get worse. So this is that street in act 3 after three different pasts, "
                   "and the game decides what stands, not me: the numbers come straight from the part "
                   "that computes the future from what you did. Built a lot: panels on both sides, the "
                   "swap stand, a second lamp. Built some: less. Tore it down: the solar rack stripped "
                   "bare, the cabinet door ripped off, the swap stand a burn mark, the windows it fed "
                   "gone dark. The old houses never come down, because the game cannot count wrecking "
                   "the city that was already there yet, so I did not fake it. And in every one of the "
                   "four, the empty house is still lit with nobody in it. Everything around it rises "
                   "or falls and it never changes. Thumbs up and this is how an act draws itself from "
                   "your past. Thumbs down and tell me which future is wrong."),
           "show": {"how": "image", "src": "vote/LIFECITY_THE_STREET_FALLS_AND_THE_HOUSE_STAYS_LIT_9_28.png"}}
    v = s.index('"verdicts"'); end = s.rindex(']', 0, v); close = s.rindex('}', 0, end)
    indent = ' ' * len(s[:close].split('\n')[-1])
    block = '\n'.join(indent + ln for ln in json.dumps(obj, indent=1).split('\n'))
    s = s[:close + 1] + ',\n' + block + s[close + 1:]
d2 = json.loads(s)
io.open(P, 'w', encoding='utf-8', newline='').write(s)
mine = [i['id'] for i in d2['items'] if i.get('lane') == 'life+city']
print('items %d -> %d; my live items: %s' % (len(d['items']), len(d2['items']), ', '.join(mine[-4:])))

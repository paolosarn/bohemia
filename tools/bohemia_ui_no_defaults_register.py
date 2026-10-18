"""INSERT, DO NOT RE-SERIALIZE (the registry rule: never edit somebody else's object; my object goes in as text).
UI [no browser defaults on the HUD], 10/18/26: the card for the before-and-after sheet (rule 114 D10).
python3 tools/bohemia_ui_no_defaults_register.py"""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'ui-no-browser-defaults-10-18'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "ui", "lane": "ui", "sha": "pending", "made": "10/18",
  "title": "THE SCREENS LOSE THE PHONE-APP LOOK",
  "why": "Every game screen had the look that gives away a computer made it (33 soft fades, 26 glows, 71 round corners and 67 lines in your phone's own letters), so this takes all of it out and draws the light back as hard one-pixel edges in the game's own letters, without moving anything you picked. You see the map, the cracked phone, the fight, the settlement and this VOTE tab, each today on the left and stripped on the right; YES and it goes into the game, NO with what is wrong.",
  "show": { "how": "image", "src": "../records/target/ui_no_defaults/UI_NO_BROWSER_DEFAULTS.png" },
  "options": ["YES", "NO"],
  "before_after": {
    "before": "the six screens as they are: 33 gradients, 26 glows, 71 corners over 1 px, 1 purple panel, 67 lines in phone system fonts",
    "after": "the same six screens with the strip laid in the browser: zero of each; the fades flattened to their middle colour with their own lightest and darkest colours as 1 px edges; every word in BohemiaCasing or BohemiaROM",
    "scale": "1:1"
  },
  "draft": True
}
block = '\n'.join('    ' + ln for ln in json.dumps(obj, indent=1).split('\n'))
m = re.search(r'\n(\s*)\],\n(\s*)"verdicts"', s)
assert m, 'cannot find the end of items[]'
out = s[:m.start()] + ',\n' + block + '\n' + m.group(1) + '],\n' + m.group(2) + '"verdicts"' + s[m.end():]
json.loads(out)
io.open(P, 'w', encoding='utf-8', newline='').write(out)
print('spliced; items', len(json.loads(out)['items']))

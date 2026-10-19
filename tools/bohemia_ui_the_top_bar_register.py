"""INSERT, DO NOT RE-SERIALIZE (the registry rule: never edit somebody else's object; my object goes in as text).
UI [the top bar], 10/19/26: the card for the map's bar with more in it and the fight with nothing across the top.
python3 tools/bohemia_ui_the_top_bar_register.py <sha>"""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
M = json.load(open('records/target/ui_the_top_bar/manifest.json'))
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'ui-the-top-bar-10-19'
sha = sys.argv[1] if len(sys.argv) > 1 else 'pending'
if MINE_ID in s:
    # only my own card's sha moves, as text
    s2 = re.sub(r'("id": "' + MINE_ID + r'",\s*"kind": "ui",\s*"lane": "ui",\s*"sha": ")[^"]*(")', lambda m: m.group(1) + sha + m.group(2), s, count=1)
    json.loads(s2); io.open(P, 'w', encoding='utf-8', newline='').write(s2); print('sha set', sha); sys.exit(0)
up = M['sides']['portrait']
obj = {
  "id": MINE_ID, "kind": "ui", "lane": "ui", "sha": sha, "made": "10/19",
  "title": "THE TOP BAR: MORE ON THE MAP, GONE IN THE FIGHT",
  "why": "You said the top bar is weak and that in the fight it never goes away, so on the map it now tells you the day and hour, your batteries, your food and how many days it lasts, and your crew with their health, and in the fight the strip across the top is gone and the round, the turn order and AUTO ride the bottom bar so the board runs to the top of the glass. You see it on the map and in the fight on your phone: the map's top today beside A (one row), B (two rows with all your stores) and C (a card for every man), then the fight today beside the fight with nothing on top; pick one, or NO with what is wrong.",
  "show": { "how": "image", "src": "../records/target/ui_the_top_bar/UI_THE_TOP_BAR.png",
            "first": "../records/target/vote_first/ui-the-top-bar-10-19.webp", "firstAt": M['firstAt'] },
  "options": ["A", "B", "C", "NO"],
  "twin": {
    "src": "records/target/ui_one_screen/twin_19_27.png",
    "diffs": [
      "THE BOARD: his pack's sign is a dark board holding light paper, lit from above with a hard rim; the bar is the same cut cardboard holding the same receipt, darkened in its own pixels, never by a fade.",
      "THE GLASS: his pack has no glass; the stores sit on a pane of the phone's cracked glass so the counts read gold on dark beside the paper, the food's days in red when under three.",
      "THE LETTERS: his pack's are hand-lettered at 5 to 7 pixels; the bar's are the game's casing at 12 to 15 points, so every word passes 4.5 to 1 in the sun."
    ]
  },
  "before_after": {
    "before": "the map's bar says the hour, the place and six stores at 10 pixels, four of them dashes; the fight keeps a strip of the round, the faces and AUTO across the top of the board",
    "after": "the day and the hour, batteries, food and the days it lasts, the crew and a tick of health a man; in the fight nothing across the top, the board to the glass",
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

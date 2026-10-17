"""INSERT, DO NOT RE-SERIALIZE (the registry rule: never edit somebody else's object; my object goes in as text).
UI [one screen], 10/17/26: the FINAL? card for the one bar on the map, the settlement and the fight.
python3 tools/bohemia_ui_one_screen_register.py"""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'ui-one-screen-10-17'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "ui", "lane": "ui", "sha": "pending", "made": "10/17",
  "title": "FINAL? ONE BAR ON THE MAP, THE SETTLEMENT AND THE FIGHT",
  "why": "You said the screen shit looks bad and that the UI must be the same every second, so this is one bar across all three screens: the clock it runs on, the place, your six supplies from your packs on glass, CREW and NOTES in the same spots, with the big action always in the bottom right, and every flat code-drawn box on the settlement and the fight replaced by cardboard, receipt and glass. You see it at the top of the map, the settlement screen and the fight, upright and sideways; say YES, or NO with what is wrong.",
  "show": { "how": "image", "src": "../records/target/ui_one_screen/UI_ONE_AT_A_TIME_ONE_SCREEN.png" },
  "options": ["YES", "NO"],
  "twin": {
    "src": "pack:19. Signs and village boards (#21 the notice board, #27 a paper sign), Signage, menus and cafe accessories (#9), 6. Control panels and consoles (#17)",
    "diffs": [
      "WHAT IS HIS: a dark board holding light paper, the paper 3.4 to 3.9 times the board's light, lit from above, a hard dark rim and no glow; our cardboard holds receipt tags the same way, measured at 3 to 1 or better on the shot.",
      "WHAT CHANGED: his board is wood with nails and hand-drawn letters at 5 to 7 pixels; ours is cut cardboard with its flutes, straight tags with no pins, and the game's CASING face at 11 points so every word passes 4.5 to 1 in the sun.",
      "WHAT IT COSTS: the bar grows from 50 to 110 points upright (the six at their 96 pixels need a strip of their own, the 10/13 rule); the fight's board and the phone sit under it; on its side the bar is one 64-point row."
    ]
  },
  "before_after": {
    "before": "the three screens today: the settlement's flat plates in a system font, the fight's gradient strip, the map's six at 10 pixels",
    "after": "one bar on all three: receipt tags, the six at 96 pixels on glass, CREW and NOTES in the same place, the big action in the same corner",
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

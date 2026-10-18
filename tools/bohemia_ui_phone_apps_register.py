"""INSERT, DO NOT RE-SERIALIZE (the registry rule: never edit somebody else's object; my object goes in as text).
UI [the phone's apps], 10/18/26: the card for the cracked phone's home screen.
python3 tools/bohemia_ui_phone_apps_register.py"""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'ui-the-phones-apps-10-18'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "ui", "lane": "ui", "sha": "pending", "made": "10/18",
  "title": "THE PHONE OPENS ON ITS APPS",
  "why": "You said there is a whole app on the phone to integrate, so tapping the cracked phone now opens a home screen with the screens the game already has as apps (feed, jobs, stash, crew, settings, and the timeline flip once the first crisis hits), every icon cut whole from your packs and no flat rounded boxes or phone fonts left. You see it on the map when you tap the phone, upright and sideways; pick A (cardboard tiles taped to the glass), B (the props straight on the glass), or NO with what is wrong.",
  "show": { "how": "image", "src": "../records/target/ui_phone_apps/UI_ONE_AT_A_TIME_THE_PHONES_APPS.png" },
  "options": ["A", "B", "NO"],
  "twin": {
    "src": "pack:11. Survival props (#21 radio, #33 map, #38 camera, #24 lantern), 16. Loot and survival props (#0 chest, #16 pack), Miscellaneous (#43 torn portrait, #44 WANTED), 15. Workbenches and tools (#23 wrench), 11. Gauges and meters (#0, #1, #5)",
    "diffs": [
      "WHAT IS HIS: every icon is one of his pack props, cut whole at its own pixels (96 on the long side, the two posters smaller as they are in the pack) and shown at one pack pixel to one phone pixel, never redrawn.",
      "WHAT CHANGED: the props sit on our materials (A: a cardboard tile with a strip of tape and a receipt name tag; B: straight on the phone's glass with a hard contact line and the name in amber), in the game's CASING face.",
      "WHAT IT COSTS: the lock screen's big clock and its two message cards go; the clock moves to the home screen's top row, and the messages live inside FEED."
    ]
  },
  "before_after": {
    "before": "the opened phone today: a lock screen with 10 gradients, 18 rounded corners, 14 glows and 46 lines in phone system fonts",
    "after": "a home screen of six apps cut from his packs on glass, cardboard and receipt; zero gradients, blur, glow or system fonts",
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

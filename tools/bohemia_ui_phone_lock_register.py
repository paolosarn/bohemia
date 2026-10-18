"""INSERT, DO NOT RE-SERIALIZE (the registry rule: never edit somebody else's object; my object goes in as text).
UI [the phone's front screen], 10/18/26: the card for the cracked phone's lock screen.
python3 tools/bohemia_ui_phone_lock_register.py"""
import io, json, re, sys
P = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
s = io.open(P, encoding='utf-8').read()
MINE_ID = 'ui-the-phones-front-screen-10-18'
if MINE_ID in s:
    print('already there'); sys.exit(0)
obj = {
  "id": MINE_ID, "kind": "ui", "lane": "ui", "sha": "pending", "made": "10/18",
  "title": "THE PHONE'S FRONT SCREEN, REDONE",
  "why": "You said the phone's front screen looked like dog shit, so the first thing you see when the phone opens is now one clock, one message from the neighbor with his real face, and one READ button, with no rounded boxes, no phone fonts, and the last owner's lock screen burned faintly into the glass. You see it on the map when you tap the phone, upright and sideways, next to the old one; pick A (the message on a receipt taped to the glass), B (printed straight on the glass), or NO with what is wrong.",
  "show": { "how": "image", "src": "../records/target/ui_phone_lock/UI_ONE_AT_A_TIME_THE_PHONES_FRONT_SCREEN.png" },
  "options": ["A", "B", "NO"],
  "twin": {
    "src": "the game: the neighbor's face from the game's own face maker (64 px, shown at 3 phone pixels a face pixel), his real last text from the phone, the HUD's clock; materials: receipt, tape, cardboard",
    "diffs": [
      "WHAT IS THE GAME'S: the face is the one the game already draws for the neighbor, the line is his real text, the time is the map's clock; nothing is made up for the picture.",
      "WHAT CHANGED: one message and one press instead of two cards and a blinking 'tap to unlock'; every word in the game's own CASING face at sharp sizes; the glare drawn as pixels; the last owner's 11:47 and 'MOM (14)' burned into the glass and one dead row of pixels across it.",
      "WHAT IT COSTS: the '41 quests available near you' card leaves the front screen and lives in JOBS, so the first screen never reads like a to-do list (rule 117)."
    ]
  },
  "before_after": {
    "before": "the lock screen today: a 62 px clock in a phone font, two rounded see-through cards with coloured squares for faces, a blinking 'tap to unlock'",
    "after": "one clock, one face with its line, one READ press; zero gradients, blur, glow, rounded corners or phone fonts",
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

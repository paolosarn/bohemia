# CAMP: HEALING STOPS ITSELF AT FULL (rule 278(a)), 10/26/26

Session camp-session_01FfxbakbC. Row [healing stops itself at full] READY-AT-NINETY-NINE (rule 278; the coordinator 07:09: after
[camp holds until he ends it]).

PAOLO 10/26: 'I camp out, time speeds along, and it will stop, pause the game, as soon as my whole team is at 99 health and 99
armour'.

## 1. WHAT HE GETS
He makes camp hurt (the phone's HEAL app, BREAK CAMP's twin): the hours run, an hour a beat. The hour the LAST living man of his
reaches 99 percent of his hit points AND of his armour, the camp breaks itself: he is back on the map, the clock on PAUSE (nothing
starts it but his GO), and one of his men says it, from his mouth with his face (the game's speaking line, BohemiaMaterials.ten): 'Everybody's patched
up. Ready when you are.' (three lines that turn, draft:true). HEAL still ends it sooner. A camp made with everybody already whole is
a rest he asked for (to let the night pass, to wait): it holds until he ends it (rule 267(a)).

## 2. HOW
- engine/bohemia_condition.js company(): the man furthest from whole (the lower of his hit points and his armour, man by man) as
  lowest and lowestOf, and done when lowest is at or above records/target/bb/condition.json camp_done_at 0.99 (his number, one row
  for TUNING's table).
- the map's camp (marked __HEALING_STOPS_ITSELF__): the camp notes whether it was made for mending; after each camped hour, campDone
  breaks it ('healed'), puts the clock on PAUSE (travelInterrupt) and has one of his men say it (BohemiaMaterials.ten, the map's
  spoken line too); window.__CAMP_HEALED says when and what.
- When the tape runs out the armour stops mending and the camp does not reach 99: it holds until he ends it (said, not built: a word
  that the tape is gone is ECONOMY's [no run ends for tape] and the stall's).

## 2b. MEASURED
- On the shipped camp (8db01c53, before this): the gate's F1 red, the camp ran on with the company whole and never stopped (EYES saw
  the same live: a camp made by MAKE CAMP NEARBY ran 49 hours, two days past a whole company; records/BOHEMIA_EYES_ROUND_FIVE_THE_
  NEWEST_ASKS_SEEN_10_26_26.md).
- At TUNING's rates (rule 264(f), 10 hit points an hour camped, armour 30 a piece) the wounds of two road fights close in about two
  camped hours, a second of real time: the camp now opens, heals and stops inside a beat or two. CAMP's own THE HEAL BUTTON gate
  measured its camp over five seconds and read the button after them; RE-AIMED: the button is read while the camp stands, a camp that
  stopped itself at full counts as the camp working, and the living are cut to a tenth of their hit points first so the camp stands
  long enough to be measured (16/0; '6 camp hours (then it stopped itself, every man at 99 percent)').

## 3. THE GATE (rule 278(d)), gates/healing_stops_itself_at_full_gate.js, on the cut, phone and computer
F1 his company hurt in the company's own condition (half of every man's hit points and armour), tape enough: the camp breaks itself
at exactly the hour the table's camp rates say the last man reaches 99 percent of both (never an hour sooner: the camp's hours read
every 60 ms), back on the map, on PAUSE, the line said. F2 camped whole, it stands six hours. F3 hurt and camped, HEAL ends it before
they are whole. F4 nothing threw. 278(b) (a struck-down survivor on the next board) is STRUCK DOWN, HE STILL FIGHTS S3; 278(c) (the bars
in a town) is THE BARS OVER THEIR HEADS B3.

[bb Battle Brothers: camping is a toggle and the company heals while it stands; it never wakes you when the men are whole: you
watch the bars. Ours stops for him, because he asked.]
[analog horror: the clock stops on its own, the fire burns down, and somebody says the thing you were waiting to hear.]

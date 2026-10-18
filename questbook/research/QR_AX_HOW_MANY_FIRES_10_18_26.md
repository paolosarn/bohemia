# QR-AX: HOW MANY FIRES. THE CAMP'S BUDGET ACROSS A HUNDRED HOURS

QUESTION: row [how many fires] (QUESTS, research only), from QR-AU OPEN 1, QR-AV OPEN 4 and QR-AW OPEN 5:
one event a night is a ceiling, not a number. How often may a member's own ask, a veteran's job, a dead follower's voice
and (QR-AW) an ambition's telling fire across a 100-hour game before they read as filler? Battle Brothers' event
cooldowns, the library's one companion quest per companion per game, and the real world (how often a crew's own trouble
comes up on a long stay). A page with a draft budget for TUNING (rule 117: easier and lighter than Battle Brothers).

STATUS: research only (rule 35, laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md). Nothing here is built. Every
number is an attempt, draft:true; TUNING (chat 21) owns every felt number in its one table, MODS (chat 22) owns the data
shape. Pages and design lines only (rule 88), nothing registered in VOTE. Author: QUESTS lane, round 10/18 (f).

SOURCES:
- The 236-study library by id (records/BOHEMIA_QUESTBOOK_LAW_INDEX.json).
- Our own pages and shelf, measured: QR-B (events on the road), QR-K (what makes an event repeat well), QR-M (the company
  on the road), QR-Z (ambitions), QR-AQ (the follower with a job), QR-AR (one event a night), QR-AU, QR-AV, QR-AW; the
  280 designs in questbook/designs; RUN TWO's board shelf records/target/BOHEMIA_BOARD_SHELF.json; rule 84 (an act is a
  year, 300 to 450 days at most), rule 85 (the flip at the first crisis, day 80 to 100), rule 117.
- Battle Brothers, numbers from the wiki dump reference/library/grok/wiki/PAGES_ALL.tar.gz (2,255 pages; source: wiki
  dump, unverified; the Events page itself warns that some requirements may be wrong against the game's code). Every
  event page prints a "Cooldown in Days", a requirement list and a score; 380 pages carry a cooldown and are counted here.
- Battle Brothers' global pace (how often ANY event fires) is not on the wiki. Two mod authors on the Nexus pages give
  it, read through search text only (the hosts do not resolve from this sandbox): "one fires on average every 3-4
  in-game days" (Event Info, nexusmods battlebrothers mod 963) and "roughly one event every five days" in the base game
  (Cultist Origin Event Frequency Increase, mod 426); the Event Frequency mod's author gives about one every 3 days at
  its 50 setting and about one a day at 400. Unverified; marked [M] below. A modder's debug gist (github.com/Suor, read directly) shows the manager
  skips low-score events for a few moments after a battle and records the time of the last event.
- The real world, through search text only (ntrs.nasa.gov and the Red Cross pages do not resolve here):
  (a) Red Cross Service to the Armed Forces, fiscal 2013: nearly 335,000 emergency communication services for 124,000
  military members and their families; death and illness are the two most common reasons (the 2020 programme director,
  344,000 messages that year). The force size used below (about 1.4 million active, about 2.2 million with the reserve)
  is recall, marked [R].
  (b) Stuster 2010, NASA TM-2010-216130, ten ISS astronauts' journals (about 188 days each, 4,247 entries): group
  interaction is the fourth most written-about topic after work, outside communications and adjustment; positive
  remarks about the group fall as the mission goes on and conflict rises in the fourth quarter (as summarised in NASA's
  2022 team-risk evidence report; the category percentages were not reached).
  (c) Bechtel and Berning 1991, the third-quarter phenomenon: in a fixed term of isolation, whatever its length, distress
  centres near the two-thirds mark (more negative social feeling, accidents, assaults, absences), with some recovery in
  the last quarter; a Concordia study (27 people, ten months) found a mid-winter dip; Kanas, Gushin and Yusupova 2021
  argue it is not typical in space. The SHAPE (later, not at the start) is supported; the exact quarter is contested.
  (d) Wiessner 2014 (PNAS 111(39)), as QR-AV read it: about four in five firelit conversations are stories.

[bb how many fires] research line: Battle Brothers keeps its 380 events rare with three dials and never with a list.
A COOLDOWN on every event (the median repeatable one is 50 days for a man's background events, 60 for the rest; 104 of
380 fire once per game); a SCORE that makes the company's make-up pick the event (a Thief steals only if you hired a
thief); and a GLOBAL PACE of about one event every three to five days [M]. A man's small events gate on his level
(median level 4); his once-ever story sits at level 9 to 11 (Cultist Finale 11, Historian Records Adventures 9, Aging
Swordmaster 9). Nothing in the game tells the player an event is waiting.

---

## THE ANSWER IN ONE PARAGRAPH

The shelf had no clock. Of its 56 camp scenes, 35 say nothing about when they may first fire, 2 carry a cooldown or a
"once", and 25 cite "that night's one event", which is a ceiling. As written, every eligible scene fires the first night
it can, so a company that hires four followers in its first week hears four asks on four nights running, and then the
fire goes quiet for the rest of the year: the vending machine and the dead air at once. And where our pages did set a
number they set it above Battle Brothers': QR-M rule 7 allows a member's own ask once per member per ACT (twelve a year
for a twelve-man company), where Battle Brothers gives about one background in five a story of its own, once, and real
life gives a soldier's own emergency to about one person in eleven to eighteen a year; QR-B's global cooldown of one to
two days is denser than Battle Brothers' three to five. So the budget below is three dials, Battle Brothers' own, set
lighter: a PACE (one screen in about five nights on average, never closer than two quiet nights, the night one ceiling
kept), a SHARE (the company's own scenes are at most half of the screens), and a CLOCK THAT BELONGS TO THE MEMBER (an ask
is once in a life, earned by nights or fights, and grows likelier the longer they ride, because real crews' trouble
comes late in a stay, not at the start). For a hundred hours that is about 220 screens, at most about 110 of them the
company's: about 9 member asks, up to 4 voices, up to 36 quarrels and up to about 57 tellings. The shelf holds twice the
asks one game can show (good: the company's make-up picks, as in Battle Brothers) and half the tellings (so tellings,
the cheapest and most human scene, need a generator from the roster's own facts). Every one of the 61 budgeted designs
now carries a BUDGET line.

---

## 1. THE FINDING THAT PROVES US WRONG (measured against the repo)

1. THE SHELF HAD NO CLOCK. A script read the DOOR line of all 280 designs: 67 carry one, 56 name the camp (QD-T17's
   camp is in a parenthesis; its door is the road at dawn, so 55 are camp scenes). Read for any condition on WHEN a scene
   may fire (a day, a count of fights, nights in the company, a cause):
   - 14 gate on fights (the veterans' "about 20 fights", QR-AU), 4 on nights or days with the company, 2 on a death or an
     override, 1 on a day count, 2 on a trigger line;
   - 35 of 56 have NONE: all twenty follower jobs of QR-AQ (only a three-night lead-in, the thing in the camp picture,
     QR-AV rule 3, which is a warning, not a gate), nine of the ten ambition tellings, M03, M05, M07, K04, T07 and T17;
   - 2 of 56 say "cooldown", "once" or "never again" anywhere; 25 say "that night's one event (QR-AR)".
   So the only pace on the camp shelf was QR-AR's ceiling. Played as written: the four act-1 follower scenes (QD-AQ01
   to AQ04) become eligible three nights after each hire and nothing spaces them; the four act-1 veterans (QD-AU01 to
   AU04) all pass 20 fights within days of each other if the company was hired together, which a starting company is.
   That is eight member scenes in the act's first weeks and none in its last nine months: the vending machine
   (`Q066.X1`, `Q084.X6`) and the dead air (`Q046.X1`, `Q087.X3`) in one act. Battle Brothers never does this (section 2),
   and the real world puts a crew's own trouble in the second half of a stay (section 4).
2. OUR CAPS WERE ABOVE BATTLE BROTHERS AND THE REAL WORLD. QR-M rule 7 (9/28): "a member's own ask fires at most once
   per member per act". For the standard origin (cap 12, rule 75) that is twelve asks a year, and across three acts with
   heirs, thirty-six. Battle Brothers: of 55 backgrounds that have events of their own, about 10 have a once-ever event
   that is one man's own story (the Anatomist's three, the Cultist's ritual and finale, the Historian's two, the Disowned
   Noble welcomed back, the Bastard's assassin, the Bowyer's masterwork, the Houndmaster's wolf, the Graverobber's heist,
   the Caravan Hand's cart): about one in five, and a man of that background may never be hired. The real world: about
   124,000 service members' families raised an emergency through the Red Cross in a year, against a force of about 1.4
   million active and 2.2 million with the reserve [R]: about one person in eleven to eighteen a year. Filled to its cap,
   rule 7 is about three times Battle Brothers' share and eight to twelve times the real rate.
3. OUR PACE WAS ABOVE BATTLE BROTHERS'. QR-B rule 3 (9/27): "after an event, no event for the next one to two in-game days
   of travel", and early "one event every two or three trips". Battle Brothers fires one about every three to five days
   [M]. A one-to-two day cooldown allows an event every two to three days. Rule 117 (10/18) says every felt number starts
   easier and lighter than Battle Brothers'. QR-B was written before both the dump and rule 117.
4. NONE OF OUR PAGES COUNTED NIGHTS. Rule 84 makes an act a year at most (300 to 450 days). A full game is about 900 to
   1,350 nights; this page plans on 1,100 (three years of 365). Nobody had put the shelf against that number: 55 camp
   scenes against 1,100 nights.

---

## 2. WHAT BATTLE BROTHERS DOES, COUNTED (the wiki dump, 380 events with a cooldown)

| kind (the Events page's sections) | events | once per game | repeatable cooldown, median | gates |
|---|---|---|---|---|
| by background (a man's own) | 104 | 20 | 50 days (64 of 104 between 31 and 120) | 40 on the man's level (median 4); 68 name a background or trait |
| by trait | 39 | 1 | 35 days | 14 on level; 2 on campaign age (14, 20 days) |
| other (road, company, place) | 132 | 40 | 60 days | 15 on campaign age (5 to 30 days, median 16); 42 daytime |
| origin | 53 | 28 | 15 days | 4 on campaign age |
| late-game crisis | 51 | 7 | 20 days | the crisis itself |

What it adds up to:
- ABOUT ONE EVENT EVERY THREE TO FIVE DAYS [M], of any kind, one at a time. Over a year that is about 75 to 120.
- A MAN'S OWN SHARE. Background and trait events are 143 of 380, 38 percent of the list. A background owns a median of
  3 events (mean 3.5, at most 8 for the Sellsword, Raider, Monk, Hedge Knight and Anatomist), most shared with another
  background ("Hedge Knight vs Raider").
- SMALL EARLY, BIG LATE. A man's small events gate at level 2 to 4 (median 4, a few fights in); the life story at level 9
  to 11 (a veteran). Nothing fires before the company has a history: the "campaign at least N days old" gates sit at 5
  to 30 days.
- THE NIGHT IS NOT ITS DOOR. About 25 of 380 require night; about 67 require daytime; the rest fire "while travelling or
  camping" (08_CONTRACTS_EVENTS.md [R]). Our door is the night camp by rule 113d; the pace transfers, the hour does not.
- THE POOL IS THREE TO FIVE TIMES THE YEAR. 380 written against about 75 to 120 a year shown, and the cooldowns let a repeatable
  one return: a player meets a slice of the list, chosen by the company he hired. Composition is the curator, not a list.
- NOTHING WAITS ON THE PLAYER. No event is on a list, a missed event is not owed, and a man who dies takes his events with
  him (the score needs him alive). Rule 117's "never a to-do list" is already how it works.

---

## 3. WHAT THE LIBRARY SAYS (by id)

- ONE ARC PER COMPANION PER GAME, AND IT CARRIES WEIGHT. The companion's own story is one quest, load-bearing for the
  ending (`Q006.W2`, `Q006.W5`): Jack's (`Q177.W2`), Thane's (`Q219.W5`), Bull's (`Q220.W9`); the party is "a bundle of
  stories, not stat-sticks" (`Q043.W7`, `Q043.P5`), and bonding is content (`Q043.W6`, `Q016.W3`). A bond needs upkeep
  and can break (`Q006.P2`). Never two arcs for one companion; the arc that is resolved "so brief you might miss it"
  vanishes (`Q080.X3`).
- EARNED BY TIME. Sergiu stands outside the booth for 24 days before he asks (`Q108.W1`); secrets surface from contact
  with things over time (`Q076.W4`). Pressure "is absent early and creeps in by day 4-5" (`Q021.W3`); a barrage up front
  nearly loses players (`Q065.X2`); but seed enough early intrigue that they stay (`Q047.X3`).
- THE TWO FAILURES. Too often: the vending machine (`Q066.X1`, `Q066.P9`), the bark with no cooldown (`Q084.X6`,
  `Q084.P9`), the heir re-served the parent's scenes (`Q144.X1`), the twist that becomes the expected beat (`Q148.X3`,
  `Q236.X2`), samey over hundreds of hours (`Q061.X5`, `Q030.X3`). Too rare: the empty world (`Q087.X3`, `Q051.X3`) and
  the dead air between dramatic beats (`Q046.X1`, `Q046.P7`).
- THE STORYTELLER READS STATE. Pick the event the state makes best (`Q044.W2`); quiet, loud, quiet: after a hard hit,
  relief (`Q044.W7`, `Q044.P5`); threat scales with what you have (`Q044.W4`); if the player steamrolls, send the rival
  (`Q048.W9`); the drip comes "just when you might be lost for things to do" (`Q090.W7`). Rhythm is tension: long dread,
  sharp scare, release (`Q039.W4`). Three named storytellers are three paces the player chooses (`Q044.W3`): a slider.
- FREQUENCY-CAPPED SO IT STAYS AN EVENT. A siege the player can schedule is a subscription, not a story (`Q151.X1`,
  `Q151.P3`); one decree "at a meaningful cadence (per season/generation)" (`Q029.P2`); the off-ramp always open is what
  makes staying a choice (`Q151.W7`, `Q126.W3`).
- THE CHEAPEST SCENE IS THE ORDINARY ONE. Banter is the cheapest, highest-impact characterisation (`Q043.P3`, `Q043.W2`);
  at night they "EAT, JOKE, AND PLAY MUSIC" (`Q085.W2`); the bond forms in quiet, ordinary moments (`Q063.W2`); spread
  it so no companion is a stub (`Q043.X4`); a quiet scene must be framed as the event, not dead air (`Q188.X3`).
- REPETITION ACKNOWLEDGED IS DEVOTION. The keeper who fixed the same pump nine winters deserves a line about it, one
  integer per entry (`Q147.X3`); a returning face carries the time (`Q031.W6`, `Q010.W10`); officers who cross remember
  the last captain (`Q144.W7`).
- THE RECEIPT IS NOT OPTIONAL. Each casualty names its cause (`Q137.W1`); an offscreen goodbye is a bug (`Q105.X5`); the
  world must notice (`Q129.X9`); the body remembers (`Q055.W4`).
- RANGE PER BATCH. Any ten span three tones (`Q114.N4`); grim and absurd side by side make both hit (`Q013.W2`); the
  procedural skeleton needs handcrafted flesh (`Q048.W5`); an unplannable small overcoming keeps dread bearable
  (`Q041.W10`); attrition needs pacing so recovery is not busywork (`Q041.X2`). Under the counter: the sympathetic
  documents before the damning one (`Q125.P25`); the stranger's card is the hall's (`Q236.N2`, `Q236.W3`), and walking
  away writes no byte (`Q236.P3`); a delivery with no sting (`Q118.P3`).

---

## 4. WHAT THE REAL WORLD SAYS

1. A PERSON'S OWN TROUBLE REACHING THE UNIT IS RARE. About one service member in eleven (active) to eighteen (with the
   reserve) a year has a family emergency go through the Red Cross [R for the force size]; death and illness lead. A case
   is about 2.7 messages (335,000 for 124,000): one trouble arrives as several touches, which is the camp door's shape
   already (the thing in the picture for nights, the telling, the ask).
2. IT COMES LATE IN A STAY, NOT EARLY. The third-quarter dip (Bechtel and Berning) centres near two-thirds of a fixed
   term; ISS journals show positive group remarks falling and conflict rising in the fourth quarter (Stuster); Concordia's
   crews dipped at mid-winter. Contested for space crews (Kanas and colleagues 2021), so this page takes the direction
   and not the quarter: a member's trouble grows likelier the longer they have ridden.
3. MOST NIGHTS AT THE FIRE ARE STORIES OR NOTHING. About four in five firelit talks are stories (Wiessner, via QR-AV).
   A crew that asks something of each other every night is not a crew at a fire; it is a hall.

---

## 5. THE BUDGET (draft:true; TUNING's numbers; rule 117: easier and lighter than Battle Brothers)

THE SCREENS THE NIGHT CAMP CAN SHOW (the classes every camp design now names in its BUDGET line):
- QUIET NIGHT: the default. No screen. The fire picture, the company asleep, a road line under twelve words at most
  (QR-M rule 11). Four nights in five.
- TELLING: one face, three lines (a story, the thing and the place, then what they want you to know), one [SLEEP]
  button, writes nothing (QR-AV). An AMBITION TELLING is the company's voice for an open ambition (QR-AW).
- ASK: a member's own job: the member is the client, the price on the button, a road (QR-AQ, QR-AU).
- VOICE: the Amalgamation through a device, a dead follower's own words (QR-AU), acts 2 and 3 only.
- QUARREL: two members, a ledger cause, the player walks into it (QR-M rule 6).
- CAUSED: a death named (QR-M rule 8, the RECEIPT), an injury's month (QR-M rule 10), an override reckoned (QR-M rule 12).
- ROAD STOP: QR-AG's ten and QR-AS's five at the night camp (QR-AS: the camp is the stop's door), and crisis events.

THE DIALS (each a row for TUNING's one table; the Battle Brothers number beside it):

| dial | draft | Battle Brothers | why lighter or the same |
|---|---|---|---|
| night ceiling | 1 screen a night (QR-AR) | one at a time | kept |
| pace, average | 1 screen in 5 nights | 1 in 3 to 5 days [M] | its light end (rule 117) |
| pace, closest | 2 quiet nights after any screen (CAUSED excepted) | per-event cooldowns, a short lock after battle | replaces QR-B's 1 to 2 days |
| company share | at most half the screens | 38 percent of the list | more of the company, fewer of them |
| act's first nights | no company screen before the act's 10th night (from entering it, in every act) | campaign-age gates 5 to 30 days, median 16; ECONOMY's free first nine days | the first week is the player's |
| ASK, how many | once in a member's LIFE; per act at most one per five in the company, rounded up (12 gives 3; 16 gives 4; a lone wolf 1) | about 1 background in 5 has a once-ever story | BB's share; above the real world's 1 in 11 to 18 a year by rule 117(d) |
| ASK, earliest | a follower's or member's 20th night in the company; a veteran's 20th fight (QR-AU) | the story at level 9 to 11 | about the same, rounded easier |
| ASK, weight | grows with nights in the company, double by the 60th | trouble later in a stay (section 4) | the member's clock, not the act's |
| ASK, gap | 15 nights between two ASKS; one ASK open at a time (QR-AQ) | per-event cooldowns 31 to 120 days | |
| TELLING, earliest | the teller's 10th night in the company | small events at level 2 to 4 | |
| TELLING, per teller | once in the teller's life for an authored one; no teller at a screen twice in 30 nights | median cooldown 50 days | |
| VOICE | acts 2 and 3; at most 2 an act; 30 nights apart; never within 2 nights of a death | no equivalent | the rarest thing in the game (QR-B: once or twice an act) |
| QUARREL | only on a ledger cause; at most 1 in 30 nights | "vs" events, cooldowns 40 to 150 days | |
| CAUSED | the first fire after its cause, whatever the pace; the next screen waits 2 nights and is kind (`Q044.W7`) | the score of a death is the death | the receipt is never skipped |
| missed or declined | gone; never a list, never owed, never a badge (rule 117(c)) | nothing waits | the same |
| the slider | the pace dial is the one the difficulty sliders move (`Q044.W3`); the default is the light end | three storytellers | |

THE ORDER THE CAMP PICKS IN, when more than one scene is eligible on a night the pace allows (the storyteller reads the
state, `Q044.W2`):
1. CAUSED (it cannot wait).
2. A TELLING bound to a job already taken (QR-AV rule 8, QR-AW rule 4: a telling after the yes needs its road now).
3. A ROAD STOP whose cause is on this road (QR-AS rule 1), unless the last screen was a road stop too.
4. An ASK, if the act's count and the 15-night gap allow, the oldest-riding eligible member first.
5. A TELLING (an ambition's first if one is open), then a QUARREL, then a VOICE.
6. Otherwise quiet. After a CAUSED or a lost fight, only steps 1, 2 and the kind road stops (QR-AG's traveller) may fire.

WHAT A HUNDRED HOURS HOLDS (about 1,100 nights, rule 84; per act divide by three):

| | per act (365 nights) | per game | on the shelf now | the shelf against one game |
|---|---|---|---|---|
| screens of any kind | about 73 | about 220 | | |
| the company's own, at most | about 36 | about 110 | 55 camp scenes + 6 voices at places | about half |
| ASKS (twelve-man company) | 3 | 9 | 21 (8 followers, 12 veterans, 1 member) | 2.3 times: composition picks |
| VOICES | up to 2 (acts 2, 3) | up to 4 | 7 | 1.8 times |
| QUARRELS | up to 12 | up to 36 | 3 | the ledger must generate them (QR-M rule 6) |
| TELLINGS (members and ambitions) | up to about 19 | up to about 57 | 27 (17 members, 10 ambitions) | half: a generator is owed |
| CAUSED | as they come | as they come | 3 | the rule writes them (QR-M rules 8, 10, 12) |

In minutes of play (an estimate: 100 hours over 1,100 nights is about 5.5 minutes a night, fights and screens included):
a screen about every 27 minutes, one of the company's about every 55, a member's ASK about every 11 hours. A five-minute
phone session (QR-G) meets a screen about one time in five and is never asked twice in one sitting.

---

## 6. THE RULES FOR THE BUILDERS (numbered, testable; draft:true)

1. THE NIGHT CEILING STANDS. Test: no night shows two screens (QR-AR rule 5).
2. TWO QUIET NIGHTS. After any screen except CAUSED, the next two nights on the map are quiet. Test: in a 365-night
   simulated act, no two non-CAUSED screens are fewer than three nights apart.
3. ONE IN FIVE. Over a simulated act the screens average one in five nights, within a band TUNING sets (draft 4.5 to
   6). Test: the count over 365 nights is 60 to 81.
4. THE COMPANY IS AT MOST HALF. Test: TELLING + ASK + VOICE + QUARREL screens are no more than half of all screens over
   any 60 nights.
5. THE FIRST TEN NIGHTS OF AN ACT ARE THE PLAYER'S. Test: no company screen before the 10th night from entering an act.
6. AN ASK IS ONCE IN A LIFE. Test: a member id is the client of at most one ASK over the save; an heir is a new life
   (QD-AQ18, AQ20 ask twice across the game, once per life), and an heir is never re-served the parent's scene
   (`Q144.X1`).
7. ONE PER FIVE. Test: per act, ASKS fired are no more than ceil(company size / 5), the size read on the night it fires.
8. EARNED. Test: no ASK before the member's 20th night in the company (a veteran's: the 20th fight), no TELLING before
   the teller's 10th night.
9. THE LONGER THEY RIDE. Test: among eligible ASKS on one night, the pick weight is proportional to nights in the company
   (capped at double by the 60th night).
10. NO LIST. Test: no screen, badge, pin or count anywhere shows a camp scene that is waiting; a declined ASK writes only
    its own spent flag (QR-Z rule 3, QR-M rule 7).
11. THE RECEIPT IS FIRST. Test: a death fires its CAUSED screen at the first fire after it, whatever rule 2 says, and the
    next screen is at least two nights later and from the kind set (`Q044.W7`).
12. VOICES ARE RARE. Test: no VOICE in act 1; at most two per act; 30 nights apart; never within two nights of a death.
13. EVERY CAMP DESIGN NAMES ITS CLASS. Test: every design whose DOOR names the camp, and every VOICE, carries a BUDGET
    line with one class from section 5 (61 now do).

---

## 7. THE SHELF, FIXED IN PLACE

Every design that can take a night now carries one BUDGET line under its DOOR line, with its class, its earliest night or
fight, its count and its "gone, never a list". 61 designs:
- ASK (21): QD-AQ01, AQ06, AQ09, AQ12, AQ15 (followers, the member is the client); QD-AQ18 and AQ20 (once per life, act 1
  and the heir's act 3); QD-AQ19 (an ASK in act 1, a TELLING in act 3); QD-AU01 to AU10, AU14 (veterans, the 20th
  fight); QD-AU20 (the heir carries the veteran's job; the job, never the scene); QD-M01 (Lupe's badge).
- TELLING (17): QD-AQ02, AQ03, AQ04, AQ05, AQ07, AQ08, AQ10, AQ11, AQ13, AQ14, AQ16, AQ17 (the member tells, the stranger
  offers at the hall); QD-AU15; QD-M02, M05, M06, T07.
- AMBITION TELLING (10): QD-AE11 to AE20.
- VOICE (7): QD-AU11 (the CB at the camp); QD-AU12, AU13, AU16, AU17, AU18, AU19 (at places; they share the act's two).
- QUARREL (3): QD-B03, M03, K04.
- CAUSED (3): QD-M04 (a death), M07 (an injury's month), M08 (an override).
QD-T17 keeps no BUDGET line: its door is the road at dawn, a ROAD STOP in the pace.
The board (RUN TWO): of the 39 jobs baked into records/target/BOHEMIA_BOARD_SHELF.json, one has a camp door, QD-AQ03, a
TELLING with the stranger (Señora Garza) alone on the card, as QR-AV wants; the BUDGET line does not touch its client or
SKULLS, so THE BOARD'S QUESTS ARE PEOPLE does not move.

Pages amended in place, marked "(QR-AX)": QR-B rule 3 (the pace), QR-M rule 7 (once in a life, one per five), QR-AR
rule 5 (the ceiling and the pace), QR-AV rule 7 (the next fire the pace allows), QR-K OPEN 2 (the Battle Brothers
numbers), QR-AQ OPEN 1, QR-AU OPEN 1, QR-AV OPEN 4, QR-AW OPEN 5 (answered).

---

## 8. ROUTED (research only; nothing here is built by QUESTS)

- TUNING (chat 21): the fifteen dials of section 5 as rows of the one table (event.pace_nights 5, event.min_gap_nights 2,
  event.company_share 0.5, act.quiet_nights 10, ask.per_people 5, ask.earliest_nights 20, ask.earliest_fights 20,
  ask.weight_double_nights 60, ask.gap_nights 15, telling.earliest_nights 10, telling.teller_gap_nights 30,
  voice.per_act 2, voice.gap_nights 30, quarrel.gap_nights 30, caused.after_gap_nights 2), each with its Battle Brothers
  number and the wiki page it came from; the pace is the dial the difficulty sliders move.
- RUN (the map's night camp): the picker order of section 5 and rules 1 to 12; the camp picture on a quiet night is
  the default, not a blank.
- RUN TWO: nothing to change on the board; QD-AQ03's telling fires the first night after the yes if the hall comes first
  (QR-AV rule 8), so its card may stand before the telling.
- MODS (chat 22): `budget_class` (ask | telling | ambition_telling | voice | quarrel | caused), `earliest`
  (nights_in_company | fights), `once_per: life`, `counts_against` as data fields beside `door`.
- PLUMBER: rule 13 as a gate leg (every camp door and every VOICE has a BUDGET line with a known class), and the
  simulated-act check of rules 2 to 5 once the picker exists.
- DYNASTY: rule 6's "an heir is a new life" against the three acts at once (QD-AQ18, AQ19, AQ20, AU14, AU20).
- PEOPLE and WORDS (WORDS held by rule 88): about thirty TELLINGS a game must come from the roster's own facts (the
  thing on the body, the place passed, the person before the dollar died) on QR-AV's three-line skeleton (`Q048.W5`).
- UI: rule 10, nowhere a list of waiting camp scenes (rule 117(c)).
- Lead line for WORLD (rule 113a): QUESTS made one research page and put a BUDGET line on 61 designs, NOT IN A TAB,
  COOKING.

---

## 9. OPEN (what this round could not answer)

1. Battle Brothers' global pace is two mod authors' estimates through search text [M]; the event manager's own script
   was not reachable. A round with the game's scripts should replace "three to five days" with the code's number.
2. How many real minutes a Battle Brothers day takes on the map is unmeasured, so the minutes in section 5 are ours
   only.
3. Stuster's category percentages and the original Bechtel and Berning chapter were not reached; the "later in a stay"
   direction rests on summaries and is contested for space crews.
4. The Red Cross force size is recall [R]; the case count is search text.
5. Whether every night is a map night (Battle Brothers stops its clock in towns; ours is assumed to as well). If the
   settlement screen runs the clock, the road nights are fewer and the pace dial should be read per road night.
6. Who builds the telling generator (PEOPLE, or WORDS when rule 88 lifts).

---

## CITED FROM

`Q006.W2`, `Q006.W5`, `Q006.P2`; `Q177.W2`; `Q219.W5`; `Q220.W9`; `Q043.W7`, `Q043.P5`, `Q043.W6`, `Q043.P3`, `Q043.W2`,
`Q043.X4`; `Q016.W3`; `Q080.X3`; `Q108.W1`; `Q076.W4`; `Q021.W3`; `Q065.X2`; `Q047.X3`; `Q066.X1`, `Q066.P9`;
`Q084.X6`, `Q084.P9`; `Q144.X1`, `Q144.W7`; `Q148.X3`; `Q236.X2`, `Q236.N2`, `Q236.W3`, `Q236.P3`; `Q061.X5`;
`Q030.X3`; `Q087.X3`; `Q051.X3`; `Q046.X1`, `Q046.P7`; `Q044.W2`, `Q044.W7`, `Q044.P5`, `Q044.W4`, `Q044.W3`;
`Q048.W9`, `Q048.W5`; `Q090.W7`; `Q039.W4`; `Q151.X1`, `Q151.P3`, `Q151.W7`; `Q029.P2`; `Q126.W3`; `Q085.W2`;
`Q063.W2`; `Q188.X3`; `Q147.X3`; `Q031.W6`; `Q010.W10`; `Q137.W1`; `Q105.X5`; `Q129.X9`; `Q055.W4`; `Q114.N4`;
`Q013.W2`; `Q041.W10`, `Q041.X2`; `Q125.P25`; `Q118.P3`.

[ah] THE ANALOG HORROR LINE for the round: the budget is mostly quiet nights, and that is the room the horror needs. Four
nights in five the fire just burns: the same sleepers in the same places, the same pot on the hook. So the night there
is one more bedroll laid out than there are people, rolled out by nobody, the player sees it at once, and nobody at the
fire says a word about it.

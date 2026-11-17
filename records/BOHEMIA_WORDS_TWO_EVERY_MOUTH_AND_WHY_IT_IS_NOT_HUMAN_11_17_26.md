# WORDS TWO: EVERY MOUTH IN THE GAME, AND WHY IT DOES NOT SOUND LIKE A PERSON (11/17/26)

VAMILY rule 454(b), ask row 628. RESEARCH ONLY. draft:true. NOTHING IN THE GAME WAS REWRITTEN, and this record proposes no rewrite.
It names what is there, measures it, and says what is still not known. THE VOICE is his: it is written only from his answers on the
homework cards (records/BOHEMIA_WORDS_TWO_HIS_HOMEWORK_THE_FIRST_TWENTY_11_17_26.md).

PAOLO 11/17: 'every time you have a human talk it's so fucking bad, from the overworld quest cards to whatever settlement bullshit is
going on to your team during combat, all of the dialog is so not human, no swag, no aesthetic... don't do anything to fix it yet... do
big brain research... I already know how I want people to talk in the game, my little swag, from the tweets to everything that
represents human dialog.'

## 0. THE ANSWER FIRST

1. THE GAME HOLDS ABOUT 3,000 LIVE SPOKEN LINES IN SOME 15 MOUTHS (2,738 of them measured here, 34,329 words). Every one is a
   draft:true attempt. They live in a dozen data files and one page; section 1 is the map.
2. HE IS RIGHT, AND IT CAN BE COUNTED. Measured with one ruler against 849 verbatim quotes of his own (about 56,000 words):
   - NOBODY SWEARS. The game: 0.0 swear words per 1,000. Him: 27.5 typed, 14.7 spoken.
   - NOBODY SAYS 'LIKE'. Filler words (like, just, yeah, bro, kinda, you know, I mean): the game 12.2 per 1,000; him 88.2 and 84.6.
   - EVERY LINE ENDS ON A PUNCHLINE. Where a line has two sentences or more, the last one is four words or fewer 50% of the time
     (his men in a fight 90%, the survivor 85%). Him: 19% typed, 8% spoken.
   - EVERYBODY TALKS IN SHORT FINISHED SENTENCES. The game's middle sentence is 5 words and 99% of lines end on a full
     stop. His middle sentence is 12 words typed and 19.0 spoken (a run-on), and 81% of his typed notes end with no mark at all.
   - THE TOWN AND THE ENEMY TALK LIKE A CONTRACT. 'do not', 'cannot', 'it is' per 1,000 words: the why line 40.6, the hires
     46.5, the job givers 13.8. Him: 4.2. The job givers use 2.1 contractions per 1,000; he uses 42.1.
   - ONE SKELETON PER MOUTH. 87% of the 163 why lines are one sentence built 'this, and that'. Every job giver is two sentences
     with the pay in the second. A fight bark is two or three clipped pieces.
   - EVERYBODY IS WISE. 'nobody, everybody, always, never, nothing, everything': the game 13.4 per 1,000, him 3.3.
   - THE SPANISH IS A STICKER. Where a line carries a Spanish tag word, it sits in the first or last two words of its sentence 89% of
     the time (51 of 57 in the road and town files): '..., mijo.'
   - THE FEED TYPES BACKWARDS. A valley post starts with a capital 49% of the time and a far one 8%, and 100% end on a full
     stop. He, on a phone, starts 90% with a capital (the phone does it) and ends 81% with nothing.
3. WHAT THAT ADDS UP TO: ONE WRITER'S VOICE IN FIFTEEN COSTUMES. The kid, the priest, the cartel man and the cook all speak in the
   same clipped, dry, complete sentences that land on a clever last line. That is a writer performing 'gritty'. A person rambles,
   repeats, swears, asks, trails off, and does not know his own best line is coming.
4. WHAT IS NOT KNOWN YET, AND ONLY HE CAN SAY: how much of HIS way of talking belongs in each mouth (does a priest say 'bro'), how
   long a card may run, where the Spanish goes, what funny is. Section 6 lists it; the homework cards ask it.

## 1. EVERY MOUTH, COUNTED, AND WHERE ITS STRINGS LIVE

Counted by walking the data files (records/words_two/measure_every_mouth.py and the three searches of this round). 'The dial' is the
game's Spanglish dial (engine/bohemia_spanglish.js): a mouth that passes it shows its line with the Spanish tag word taken out about
seven times in eight. NOTHING IS INLINED IN THE DEMO'S OWN PAGE: the demo opens the map page, the town page and the fight page, and
they fetch these files.

| Mouth | Lines | Where the strings live | Who draws it, with what face | The dial |
|---|---|---|---|---|
| A ROAD STOP: the stranger | 81 | records/target/BOHEMIA_ROAD_EVENTS.json events[].says (36 rows rewritten by tools/bohemia_world14_road_events_data.py, 45 hand-kept) | slices/bohemia_road_events.js card(); the look the row names, talking | no; its Spanish is written in and always shows |
| A ROAD STOP: what comes back after his choice | 231 | the same file, opts[].fx.say (and under chance / fight) | the same card; about half are a mouth, half are telling | no |
| A ROAD STOP: his own buttons | 200 | the same file, opts[].t | the buttons under the card (the player; never Spanish) | no |
| SIDE QUESTS met on the road | 255 in 15 quests | records/target/BOHEMIA_SIDE_QUESTS.json nodes{}.says[] (baked from quests/bq by tools/bohemia_side_quests_bake.js) | the same card, node by node | no |
| A REAL PLACE you visit | 18 (+52 answers) | records/target/bb/real_places.json places[].visit | slices/bohemia_place_visits.js, the same card | no |
| A BOSS'S ASKER (who sends you) and after | 60 for 12 bosses | records/target/bb/boss_act_one.json bosses[].lead.asker.says / yes_says / no_says, lead.thing.says (one of his men reads it), after.valley | slices/bohemia_bosses.js talk(), the same card | no |
| JOB GIVERS AT THE BOARD | 102 (39 + 63) | records/target/BOHEMIA_BOARD_SHELF.json offers[].says (words in tools/bohemia_run2_board_shelf.py CUTS), records/target/BOHEMIA_JOB_KINDS.json board_people.rows[].says | the town page's offerSpeak(); a rolled valley person matched to the name's sex | no |
| THE ELDER AND THE KEEPERS (hall, stall, smith, armourer, barber, doc, bar, bookie) | about 150: 41 trait lines, 11 rumours, 14 news lines, about 80 literals in the page, 8 of the bookie's | slices/BOHEMIA_SETTLEMENT_SCREEN.html (TIER_LINE, the openB() branches, STALL_WORDS), records/target/settlement_traits.json, records/target/settlement_rumours.json, slices/bohemia_arena_town.js | the town page's speak(); the keeper the place rolled | YES |
| A STRANGER IN THE CROWD | 12 (6 street lines, 5 + 1 name answers) | the town page, STREET_LINES and SAYS_NAME | openPerson(); the crowd body's own face; 'SOMEBODY ON THE STREET' until asked | no |
| A MAN FOR HIRE | 14 | records/target/bb/rare_recruits.json men[].line | the hire card, in quotes, no moving mouth. AN ORDINARY RECRUIT SAYS NOTHING: a name, a trade, one trait | no |
| THE RETINUE | 36 (18 ask, 18 joins) | records/target/bb/retinue.json followers.value[] (baked into engine/bohemia_camp.js) | retinueCard() and retinueSay(), at the hall and at the camp | YES |
| HIS MEN MID-FIGHT | 616 (+165 Spanglish twins) | records/target/bb/crew_voices.json types[18].lines[10 moments], enemy.{ghost, beast, machine} (built by tools/words_personalities/build_bank.py); 20 more inline in slices/BOHEMIA_FIGHT.html (the veteran's lessons, 'breaking') | the fight page's callShow(); a man on his feet, never YOU; his type is hashed off his look | the twins are picked about 1 in 8 |
| THE SURVIVOR'S WORD after a fight | 481 (+90 twins) | the same file, lines.win / lost / ran / wipe and enemy.<kind>.win; picked by engine/bohemia_survivor_word.js | slices/BOHEMIA_SPOILS_SCREEN.html survivorWord(); a man still standing | twins for 4 of 10 kinds |
| THE WHY LINE (the enemy's leader, or one of his men for beasts) | 163 (67 theirs, 96 ours) in 67 rules | records/target/bb/fight_reasons.json rules[].them / .ours; chosen by slices/bohemia_fight_why.js | the card that opens a fight (slices/bohemia_fight_opener.js) and the fight's first line | never, by rule |
| HIS SECOND ON THE MAP (the teaching voice) | 12 | records/target/words/the_second_speaks.json | slices/bohemia_ui_materials.js VOICE.say, a small face plate | no |
| THE CREW CARD (a scar's line, a past) | 28 | engine/bohemia_long_injury.js SCAR_LINES (11), engine/bohemia_roster.js PAIN (17, a past in the third person, in quotes) | slices/BOHEMIA_ROSTER_SCREEN.html | no |
| THE FEED: the valley | 495 (+210 twins), 68 accounts | records/target/bb/feed_kinds.json (built by tools/bohemia_feed_build.py from banks/BOHEMIA_WORDS_THE_FEED_BANK.json and tools/feed/BOHEMIA_FEED_ROWS.json) | slices/bohemia_phone.js, a handle and the words; NO FACE (portrait null on all 105 accounts) | per post |
| THE FEED: far away | 150, 37 accounts | records/target/bb/feed_world.json | the same | no twins |
| THE FEED: a town falling | 64 (4 towns x 16) | records/target/bb/radio_lines.json towns{}.lines[].say | slices/bohemia_radio.js, as @town_gate and the like | no |
| THE FEED: bosses and places | 41 | boss_act_one.json rumour / verb.feed, real_places.json feed | the same strip | no |

WHAT DOES NOT EXIST AS TALK (looked for, not found):
- A BOSS HAS NO LINE OF HIS OWN ON THE GLASS. The 12 bosses share ONE rule of the why line (two sentences between them). 9 of
  them carry a line in the data (boss.says, such as "I see you. You don't see me.") and it only moves the mouth on a card: the words are never printed.
- THE LADDER FILE HOLDS 53 ROWS, NOT 60, AND NO WORDS (engine/bohemia_ladder_data.js: who holds, what it grants).
- ENEMIES SAY NOTHING DURING A FIGHT. Their only words are the why line before it.
- NOBODY TALKS TO ANYBODY AT THE CAMP. The camp's 'doing' lines are told actions; three lines say the camp is done.
- THERE IS NO HAGGLING. A job is 'Take it' or 'Not now'; the haggle engine is only reachable on the dead walk.
- NO OBITUARY, NO LEVEL-UP WORD, NO WORD ON THE THREE NAMES SCREEN. The 15 origin lines on the start door have no speaker.
- A MAN WALKING OVER AN UNPAID NIGHT IS WRITTEN AND SWITCHED OFF (nightly_bill.json walks_when_short 0).
DEAD OR BENCH-ONLY (in the files, never on his glass in the demo): the street-walk talk inlined in slices/BOHEMIA_CITY_WORLD.html
(encounters, conversation, asking, introductions, haggle, asks: barkTick returns early in the demo), engine/bohemia_keeper_lines.js,
engine/bohemia_narrator.js, engine/bohemia_region_news.js, the cold open, the old WORDS tab's street corpus.

## 2. A TRUE SAMPLE FROM EACH (read out of the files by the script that wrote this page; none typed)

- ROAD, begging (ev_the_hungry_kid): "Oye, jefe. Two days no food. I don't want batteries, just something to eat. My brother says ask the ones with guns, they got food." and when he walks on: "Sí. Everybody keeps walking."
- ROAD, a toll (ev_the_toll_kids): "This road is ours today, my loves. Five batteries a head, or ten for all of you because you dress so ugly I feel sorry. Rick Owens would cry."
- ROAD, a threat (ev_the_cartel_checkpoint): "Inspección. What's in the wagon, jefe? We take a tenth of everything, it's the law now. Our law. Or you can try to argue."
- ROAD, grief (ev_the_three_oclock_bell): "I ring it for the ones in the houses who died alone after the money went. Nobody came for them, so I come. Every night a different street. Tonight it's this one. Stand with me a minute, hijo, it's only a minute." then "Thirty-one doors. He says each number out loud. Nobody opens one." or "Go with God. Somebody will ring for you too."
- ROAD, the telling after a choice (ev_the_timeshare_man): "He hands you the deed to week thirty-two of room 1411. The room has no wall on one side. He calls it the view." and "He calls after you that the offer ends today. It has ended today for eleven years."
- HIS OWN MAN (ev_the_short_box): "Boss, the battery box is light. Six short. I counted twice. It was me. My sister in Henderson has a boy on an oxygen machine, and the machine eats batteries. I was going to tell you."
- BOSS'S ASKER (THE POT): "Mijo, wait. A man called THE POT took my kitchen on the strip. My stove, my pots, todo. Now nobody eats there unless they work for him. He put flyers up near here. Go read one, it says where he cooks."
- JOB GIVERS (qd-ae10, qd-s03, qd-c02, qd-ap07): "Seven of them, big as ponies, and they come when the water comes. We cannot pay what you are worth, only {pay} batteries, and if you say no it is fine, everybody says no." / "Two tankers of water to our loading dock before sundown tomorrow. It pays {pay} batteries, we do not negotiate upward, we are already generous." / "Somebody took my cold box with the insulin in it, mija. Bring it back and {pay} batteries are yours." / "The tower is full of air because the Canal boys have the valve. Buy it or take it, I am not asking which, and the camp pays {pay} batteries."
- THE ELDER, arriving: a town "Bienvenido. Batteries talk here, so keep yours where we can hear them.", a camp "Not much out here, mijo. A board, a stall, and whoever is still standing."
- KEEPERS: the stall "I buy and I sell. Half what I charge, more for what this town is short of. No haggling, mijo."; the smith "Fixed, sharpened, loaded. Pick one."; the barber "Sit down. A new cut, a new face, one battery. Who are you becoming?"; a raided town "A crew came through three nights back. Burned the Ortega house. Half of what we had walked out with them, mijo."
- THE BAR: "A trucker swore he saw a dog with a tag in its ear, big as a calf, out by the tower. From the lab, pues."
- A STRANGER: "Órale, you're new here. Don't drink from the wash, it'll eat you up." / "Batteries or nothing, carnal. Nobody takes paper since the dollar died."
- MEN FOR HIRE: "My crew ate each other over a water tank. I walked. I can walk with you." / "Two tours, one pension. The pension died first. Where do you want me?" / "Guns jam. I do not. Ask the men who tried." / "I hit what I aim at. You point, I pull. Simple."
- THE RETINUE'S COOK: "I fed the whole Strip once. I can feed your crew on half of what you are wasting."
- HIS MEN MID-FIGHT: "Ka-ching." / "Done." / "Here they come here they come." / "Missed him by a whole zip code." / "{name}! Don't you dare."
- THE SURVIVOR: "His boots are my size. He won't mind." / "Don't look at their faces. Look at their pockets." / "His last thought was 'oh no.' Relatable." / "{name}'s share splits between us now. Sad. Lucrative."
- THE WHY LINE: "The House holds this road, and you did not pay to use it." / "Somebody paid you to chase us, old man, so chase us." / a boss "You have been asking about me all over the valley, and here I am." / one of his men "They came to our gate in the dark{boss}, and they will not turn back."
- HIS SECOND: "Every night the crew eats. No batteries, a man walks." / "{name} didn't get up, carnal. He's gone."
- THE FEED: "they don't know I have two jugs of water under the bed." / "anybody have a 12 volt charger for a wheelchair battery? it's my dad's. will trade water." / "rest easy Mrs. Alvarado. she fed half the block through the first winter and never wrote any of it down." / a crew's page "Guns stay in the truck at the toll. We'll know if they don't." / far away "the refinery horn still goes off at six every morning. there's no shift anymore. my husband still gets up for it." / a town falling "he says nobody is on the way." then "tower. please answer."

## 3. WHAT MAKES THEM READ AS NOT HUMAN: TWELVE TELLS, EACH ON OUR OWN LINES

THE RULER. Per 1,000 words unless it says percent. 'Short end' is the share of lines of two sentences or more whose last sentence is
four words or fewer. 'Stop' is the share of lines that end on . ! or ?

| Mouth | Lines | Words a line | Words a sentence | Contractions | 'do not, it is' | Swears | Fillers | Short end | Stop | A question |
|---|---|---|---|---|---|---|---|---|---|---|
| road: what the stranger says | 81 | 33 | 7.0 | 16.7 | 14.8 | 0.0 | 6.5 | 14% | 98% | 16% |
| road: the answer after his choice | 231 | 12 | 5.0 | 26.4 | 5.7 | 0.0 | 15.5 | 31% | 99% | 1% |
| road: side quest talk | 255 | 19 | 7 | 42.9 | 23.4 | 0.0 | 11.0 | 22% | 99% | 3% |
| town: job givers at the board | 102 | 28 | 13.0 | 2.1 | 13.8 | 0.0 | 5.2 | 8% | 100% | 0% |
| town: keepers, the Elder, the bar | 66 | 17 | 8 | 5.2 | 15.6 | 0.0 | 8.7 | 11% | 100% | 2% |
| hires: rare men and the retinue | 32 | 14 | 6.0 | 0.0 | 46.5 | 0.0 | 0.0 | 27% | 100% | 3% |
| fight: his men mid-fight | 589 | 4 | 3 | 70.4 | 1.9 | 0.0 | 36.9 | 90% | 100% | 8% |
| fight: the survivor after | 450 | 7 | 3.0 | 65.3 | 1.4 | 0.0 | 15.0 | 85% | 100% | 11% |
| fight: the why line | 163 | 11 | 11 | 0.5 | 40.6 | 0.0 | 5.9 | 0% | 100% | 0% |
| bosses: the asker and after | 60 | 17 | 7.0 | 14.1 | 2.7 | 0.0 | 19.5 | 26% | 100% | 8% |
| feed: the valley | 495 | 14 | 5 | 39.1 | 2.5 | 0.0 | 9.0 | 48% | 99% | 3% |
| feed: far away | 150 | 20 | 6.0 | 13.8 | 12.5 | 0.0 | 11.4 | 33% | 100% | 1% |
| feed: a town falling | 64 | 11 | 4.0 | 42.4 | 3.0 | 0.0 | 1.5 | 65% | 94% | 2% |
| **ALL THE GAME** | 2738 | 11 | 5 | 31.3 | 11.6 | 0.0 | 12.2 | 50% | 99% | 5% |
| **PAOLO, TYPED (his vote notes)** | 411 | 16 | 12 | 42.1 | 4.2 | 27.5 | 88.2 | 19% | 19% | 9% |
| **PAOLO, SPOKEN (voice to text)** | 438 | 73 | 19.0 | 48.7 | 4.3 | 14.7 | 84.6 | 8% | 37% | 13% |

1. NOBODY SWEARS. Zero swear words in 34,329 words, in a valley where the money died and men kill for a living. He swears 27.5 times
   per 1,000 typed. Battle Brothers, the reference for the road, swears in its event text ('What a goatfuck of a situation.',
   reference/library/grok/wiki/pages/0171_Ball on Roof.txt). Whether OUR people swear, and who, is his call (unknown U1).
2. NOBODY SAYS 'LIKE'. No filler, no restart, no 'I mean'. 12.2 per 1,000 against his 88.2. The fight barks are the only mouth with
   any (36.9), and they are words like 'Okay' and 'Right?'.
3. THE LAST LINE IS ALWAYS THE CLEVER ONE. "Two tours, one pension. The pension died first. Where do you want me?" "{name}'s share splits between us now. Sad. Lucrative." "He hands you the deed to week thirty-two of room 1411. The room has no wall on one side. He calls it the view."
   "Go with God. Somebody will ring for you too." A real person does not know his best line is coming, so it is not always last. In the fight 90% of
   two-part barks end this way; he ends 19% of his notes this way.
4. EVERY SENTENCE IS FINISHED. Middle sentence 5 words, a full stop on 99% of lines, no line that trails off, nobody cut off.
   "Boss, the battery box is light. Six short. I counted twice. It was me. My sister in Henderson has a boy on an oxygen machine, and the machine eats batteries. I was going to tell you." is six finished sentences in a row from a man admitting he stole. Count the full stops: a man who is scared does not punctuate.
5. THE CONTRACT VOICE. The board, the why line and the hires are written without contractions: "Seven of them, big as ponies, and they come when the water comes. We cannot pay what you are worth, only {pay} batteries, and if you say no it is fine, everybody says no."
   "The House holds this road, and you did not pay to use it." "Guns jam. I do not. Ask the men who tried." It reads as translated, or as a legal notice.
6. ONE SKELETON PER MOUTH. The why line: 87% are 'A, and B' ("Somebody paid you to chase us, old man, so chase us."). The job giver: always two sentences, the pay in the
   second, because the tool that cut them was told so. The survivor: two or three clipped pieces. After five lines of a mouth he
   has read all of it. EYES found the same from the other side this round (ask row 631: the why line says the road's words whatever
   started the fight).
7. EVERYBODY IS WISE. "Sí. Everybody keeps walking." "Go with God. Somebody will ring for you too." "if you say no it is fine, everybody says no." 'Nobody, everybody,
   always, never' 13.4 per 1,000 against his 3.3. The 8/26 voice card already said NOBODY IN BOHEMIA IS WISE; the lines written since
   went back to it.
8. PEOPLE EXPLAIN THE GAME AND THEIR OWN PAST IN FULL. His second, teaching: "Oye. Posts on the phone are work. Touch one, it lights up." "That's the work, mano: fight, get paid. Batteries feed us."
   A man reading out the manual with 'Oye' in front. The confession above gives the sister, the town, the boy, the machine and what
   the machine eats, in order. (The longest of these, the asker's speech after a boss that explains his new button in five
   sentences, is in the data and never shown: the card takes the short valley line instead.)
9. THE SPANISH IS A STICKER ON THE END. 51 of 57 tag words sit at the edge of the sentence: "I buy and I sell. Half what I charge, more for what this town is short of. No haggling, mijo." "Not much out here, mijo. A board, a stall, and whoever is still standing."
   The town page alone says 'mijo' 8 times. He said it twice: 'Chill with the spanglish bro' (9/21) and 'do not cook a single more
   fucking Spanglish line' (11/3, about 15% of human talk at ship). And the dial already strips most of these on the glass, so the
   same keeper says 'mijo' one visit in eight: the word is not part of how that person talks.
10. THE SAME VOICE IN EVERY COSTUME. A hungry kid: "Oye, jefe. Two days no food. I don't want batteries, just something to eat. My brother says ask the ones with guns, they got food." A priest: 'Nobody came for them, so I come.' A raider:
   "My crew ate each other over a water tank. I walked. I can walk with you." Same length, same dryness, same closing beat. Age, schooling, fear and how well they know him change nothing.
   In a fight, unless the roster names one, a man's type is hashed off his look, so 'the joker' is not a person he hired: it is
   whoever wears that coat.
11. THE FEED IS DRESSED AS CASUAL, BACKWARDS. Lower case and a neat full stop: "the refinery horn still goes off at six every morning. there's no shift anymore. my husband still gets up for it." A phone capitalises for you and nobody
   types the last full stop: his own notes are 90% capital-first and 81% no-stop. The memes are formats ("nobody: / absolutely nobody: / my generator at 3pm: *coughs once and dies*"),
   which read as somebody doing 'a tweet'. His 11/3 verdict on the far posts: 'a lot of it is kinda like what the fuck does that even mean'.
12. NOBODY ASKS HIM ANYTHING. 5% of lines hold a question; the job givers and the why line 0%. Real talk is about 8% questions
   (Switchboard, in records/BOHEMIA_WORDS_TRAINING_FILE.md) and his own notes 9% to 13%. Nobody in the valley is unsure, checks if he
   heard, or wants to know who he is.

## 4. HIS OWN WORDS, THE FIRST SOURCE

THE CORPUS (records/words_two/his_words/): 2,259 distinct quotes of his, each checked to sit word for word in its source; 849 are
VERBATIM (his own typed vote notes and the record blocks a record labels as his words) and only those are counted: about 56,000 words.
stats.md holds every number with the script; about_talk.md holds every quote of his about how the game talks, newest first.
THE COORDINATOR'S QUOTES OF HIM ARE NOT HOW HE SOUNDS. VAMILY's copies of the same speech carry 'like' 10 per 1,000 (he says 40), 'bro'
0.8 (he says 9), and 5.8 semicolons (he has typed none, ever). Learn WHAT he wants from VAMILY; learn HOW he talks only from the
verbatim rows. And voice to text garbles him (quiz = quest, Malay = melee, the feet = the feed): never learn a garble as his word.

HOW HE TALKS, MEASURED:
- LENGTH. A typed note: 16 words in the middle (a quarter under 6, a quarter over 25). Thumb-typed: 13. A spoken message: 75 words,
  with one full stop every 57: it is one breath that keeps going. Cut at his own spoken commas (bro, you know, I mean) a breath is
  9 to 11 words. SO HIS UNIT IS A BREATH OF ABOUT TEN WORDS, CHAINED, NOT A SENTENCE OF FIVE.
- OPENERS. 'bro' starts 1 typed note in 9. 'Also' and 'And' start 124 of 438 spoken messages. A yes opens 'good', 'I', 'bro', 'nice',
  'yeah'. A no opens 'bro'. Bare 'no' opens 5 notes of 411.
- THE WORDS. like: one word in 25. Per 1,000 typed: bro 16, shit 15, any fuck 7, just 7, yeah 6, you know 5. 'dogshit' in 53 of 411
  typed notes. 'type shit' 80 times, 'and shit' 123, vibe 79, fire (good) 8, swag 4. dude 0, homie 0, 'no cap' 0.
- THE MARKS. Typed: 81% end with nothing, 58% have no punctuation at all, 90% start with a capital, 17 notes are ALL CAPS, 5
  exclamation marks and 48 question marks in 405 notes, 4 emoji in 2 notes.
- HIS YES HAS A NO IN IT. 86 of 247 thumbs-up notes still hold an insult: 'good progress not final not even close', 'Bro, it's so bad.
  I actually kinda like it bro that's insane.' Praise and the catch arrive together, the praise first.
- HE COMPARES TO REAL THINGS, PLAINLY. 'like a seventh grader coded it', 'the reverb of like a glass jar', 'like a fucking pyramid'.
  125 'like a' in the corpus; the 60 read were plain likenesses or the filler. Never a figure of speech.
- WHAT HE NEVER SAYS (counted in 51,016 words): semicolons 0, long dashes 0, shall 0, whom 0, perhaps 0, indeed 0, therefore 0,
  moreover 0, thus 0, 'as if' 0, 'as though' 0. however 8, rather 4, quite 4.
- THE ONE GAME LINE HE HAS WRITTEN HIMSELF (11/3, a perk he called decoy): 'did you seriously just walk around with a cardboard cut
  out'. It is a question, it is talking TO the player, it is funny by being exact, and it has no punchline.

WHAT HE HAS SAID ABOUT OUR WORDS (verbatim, his vote box):
- 'Idk what i was reading wtf' (9/21, the twelve road endings). 'Boring asf' (9/21, three line cards).
- 'What makes you think writing a storytime about this would be a good idea rather than actually making pixel art... ' (9/21).
- 'Chill with the spanglish bro some characters might speak Spanglish to you doesn't mean you will' (9/21).
- 'Dont force this on me wtf is "the watch"' (9/22: no made-up job words in a mouth).
- 'It is a cause of concern you kinda suck at sounding like a human tweeting. Some of it is good but a lot of it is kinda like what
  the fuck does that even mean type shit' (11/3, the far feed).
- 'Work in progress' (11/2, the survivor's word: a yes, not a finish).
WHAT HE HAS ASKED FOR, IN HIS WORDS:
- 'I want it to be funny... morbid funny, like real killers' (11/2, after a fight).
- 'this is how I want like the communication to feel sometimes bro this is Bohemian bro this my swag' and 'that sort of like fucked
  up like it breaks your heart kind of vibe like just reading it' (11/3, the last transmissions of a town).
- 'the usernames can tell a real awesome story' (10/26). 'international vibes kind of with Twitter' (11/3).
- 'I want there to be a sentence, just one sentence... why the fuck the enemies are attacking you' (11/14).
- '15% of the human conversation vibe' for Spanglish at ship, and no new Spanglish line (11/3).
- 'Pool pole spear: this is so fire and so funny' (11/2: funny is a real thing made slightly wrong, not a joke told).
THE CAUTION. How he talks to a chat is not yet proof of how a priest, a cook or a boss talks in his game. The numbers above say what
'human' sounds like when the human is him; they do not say which mouths get it. That is the question the cards put to him.

## 5. HOW THE NAMED REFERENCES WRITE A LINE (the library only; no new game; a reference stays in its department)

CITED, NEVER PASTED: reference/library/README.md (8/28) bars the library's words from the game. What follows is how a line is BUILT.
BATTLE BROTHERS (the road, the events, the company, the town). The library now holds its real text: 2,255 wiki pages in
reference/library/grok/wiki/PAGES_ALL.tar.gz, 172 with an event window, 608 spoken lines, 716 button lines.
- AN EVENT IS A NARRATOR IN SECOND PERSON WITH THE SPEECH QUOTED INSIDE IT, about 50 words, and players skim it for the button
  (records/BOHEMIA_WORDS_BB_SCHOOL_THE_SITUATION_IS_THE_PART_NOBODY_READS_9_24_26.md). OURS PUTS EVERY WORD IN THE MOUTH (the 9/20
  law), so our mouth has to carry the scene too. That is where 'people explain everything' (tell 8) comes from.
- ITS PEOPLE SWEAR, STUMBLE AND GET CAUGHT. 'Well he, uh, he's got the ball. Let's get the hell out of here. Our... our work here is
  done.' A brother caught in a lie about his own past: 'I thought you were born outside...?' / 'Oh yeah, that's right. Well, we
  should get moving then, right?' (the Forest Lover event). A stammer, a question, a change of subject.
- THE BUTTON IS THE CAPTAIN'S SHRUG, NOT AN ORDER: 'Sounds fishy to me.' 'Good for him.' 'We march on.' Ours are orders ('Pay the
  tenth.' 'Walk on.'). 44 of its 80 written background events are one screen and one button: a moment, not a decision.
- A HIRE'S STORY IS BUILT FROM PARTS AND PAID OFF LATER by an event; the hire card does not pitch. Ours pitches in three sentences
  and nothing later remembers it.
- A RUMOUR IS ONE LINE AND THE PLACE IT NAMES IS REAL (questbook/research/QR_AH_THE_RUMOUR_AT_THE_BAR_10_9_26.md).
- NOT IN THE LIBRARY: any real line of a contract's client. Our job givers were written with no model.
- TWO OLDER CLAIMS OF OURS ARE CONTRADICTED BY THE DUMP: 'the choice button wording could not be sourced' (9/24; the dump has 716), and
  '85 percent of its roster is a bare stat tooltip, no flavor' (10/9; its men speak at length in events).
MODERN WARFARE 2 (the communication's dread only): 'the war happens to OTHER units on the radio while you are busy. You do not see
them fall; you hear them call, and you hear the calls stop' (records/BOHEMIA_RADIO_ROUND_1_HOW_A_LAST_TRANSMISSION_READS_11_3_26.md).
Its test for a line: 'read it out loud, flat, like a clerk.' The town-falling posts were written to it, and it is the one mouth he
has called his swag.
FALLOUT 1 AND FINAL FANTASY X (the interface): the voice of the dead institution on the machine's own screen, labels stamped on
objects. That is the phone and the signs, not people's mouths.
NOTHING IN THE LIBRARY ON HOW THEY WRITE: Rogue Fable 4 (no dialogue studied), Final Fantasy XII, Fallout: New Vegas (its attitude
only; 'nothing of its content'), Stardew Valley, Ocarina of Time, Assassin's Creed, Valheim, Pocket City 2, Newgrounds.
THE REAL WORLD, already in the library: recorded phone talk is 89% contracted, 7.7% questions and 16 commas per 100 words where ours
had 3.5 (Switchboard, records/BOHEMIA_WORDS_TRAINING_FILE.md); a neighbourhood feed's commonest post is somebody asking for or
offering a thing, with 1.4 replies a post (records/BOHEMIA_WORDS_Q15_HOW_A_FEED_TALKS_9_5_26.md); real radio traffic and the open
mic (the RADIO record); how people who kill for work joke (records/BOHEMIA_WORDS_THE_SURVIVORS_WORD_AND_THE_KILL_TALLY_11_2_26.md).

THIS LANE'S OWN PAST IS A WARNING. The WORDS lane has diagnosed this five times (8/26 the voice card's eight tells, 9/22 a mouth not a
narrator, 9/24 the road words, 10/24 the personalities, 11/3 a tweet sounds like a human), built a gate for four of the five, and the lines
written the round after carried the same tells. A LIST OF TELLS DOES NOT MAKE A VOICE. Each fix was written by the same hand that
made the fault. That is why rule 454 is right to stop the writing and ask him.

## 6. WHAT IS STILL UNKNOWN (this is what picks the next cards)

U1 SWEARING: who swears, how hard, and is there a mouth that never does. U2 HIS WORDS IN THEIR MOUTHS: does anybody but the feed say
bro, like, type shit; does a priest. U3 LENGTH: is a road card one breath or a paragraph; is the punchline allowed. U4 SPANISH: which
people, which words, where in the sentence, never as a sticker. U5 FUNNY: the survivor's morbid line (card 8) against his 'like real
killers'. U6 THE BOSS: should the top dog talk more, less, or not at all. U7 THE WHY LINE: one skeleton or a real sentence per crew.
U8 A HIRE: does a man pitch himself, or does somebody talk about him. U9 THE FEED: capitals, stops, memes, how far a far post may be
from his valley. U10 THE TELLING: the lines with no mouth (what comes back after a choice): who says them. U11 HIS OWN MEN TO HIM:
'Boss'? 'jefe'? his name? U12 AGE AND SCHOOLING: does a kid talk like a kid.
The first twenty cards touch U1 to U9 and U11 once each. Sheet 02 goes where his answers leave a hole.

## 7. ROUTED (found here, not this lane's to fix)

- FIGHT SCREEN, BOSSES: a boss's own line (boss.says, 9 of 12) moves a mouth and is never printed; the 12 bosses share two why sentences;
  the asker's long speech after a boss (after.says, 12) is never shown because the card takes after.valley.
- THE COORDINATOR: the ladder file holds 53 rows, not 60 (the pillar line in CLAUDE.md says 60).
- FEED: every one of the 105 accounts has no face (portrait null); 'everybody has a face' stops at the phone.
- RUN TWO, PORTRAIT: the job shelf's own look for Mama Rosaura (cast_poncho) is a man's face; the town covers it with a rolled person,
  the map's pay line (clientOf in slices/bohemia_ui_materials.js) uses the shelf's look.
- CAMP: a man walking over an unpaid night is written and switched off (walks_when_short 0); nobody speaks to anybody at the fire.
- EYES row 631 (the why line says the road's words whatever started it) is the same fault as tell 6, seen on the glass.
- PLUMBER: slices/BOHEMIA_CITY_WORLD.html inlines about a dozen street-walk talk engines the demo can never reach.

## 8. HOW IT WAS MEASURED, AND WHAT IS WEAK

- records/words_two/measure_every_mouth.py walks the 13 biggest live pools (2,738 lines) and his 849 verbatim quotes with the same
  patterns and writes measure_every_mouth.json. The lines inside the town page (about 80 literals), the side places and the small
  mouths are counted in section 1 from the searches and are NOT in the measured table.
- A blank the game fills ({pay}, {name}) was counted as one word.
- 'Fillers' and 'swears' are closed word lists; 'the last sentence is short' is a count, not a judgment of wit.
- His spoken channel is voice to text: its capitals and stops are the phone's. Only his typed notes say how he punctuates.
- The road's 'what comes back' pool mixes mouths and telling; nobody has sorted the 231.
- Three searches mapped the files (the map and town side, the fight and company side, the library); their counts were made by walking
  the files. Every sample on this page was then read out of the file again by the script that wrote it.
- NOTHING HERE WAS PLAYED. Whether a line is on the glass was read from the code paths, not seen in the running game.

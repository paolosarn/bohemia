# WORDS TWO: HIS HOMEWORK, THE FIRST TWENTY (11/17/26)

VAMILY rule 454(c), ask row 629. BUILD 11/17a - HIS HOMEWORK: THE FIRST TWENTY. draft:true. NOTHING IN THE GAME WAS REWRITTEN.

PAOLO 11/17: 'every time you have a human talk it's so fucking bad, from the overworld quest cards to whatever settlement bullshit is
going on to your team during combat, all of the dialog is so not human, no swag, no aesthetic... don't do anything to fix it yet... do
big brain research... I'm also down to do a little homework for you, 20, 30, 40, 110, but each thing you present to me has to be really
understanding to teach you... I already know how I want people to talk in the game, my little swag, from the tweets to everything that
represents human dialog... you show me one sentence or one dialog caption that you made and then I'll tell you how I want that shit to
sound.'

## WHAT SHIPPED

Twenty cards in the VOTE tab (lane WORDS TWO, kind LINE, ids words-two-hw01-01 to -20). One card is one line:

- THE CARD'S TITLE IS THE LINE ITSELF, in quotes, exactly as the game's data holds it today. It is read out of the game's file by
  tools/bohemia_words_two_homework.js at build time (a JSON path or a pattern with one capture); it is never typed. The sheet
  (records/target/words_two/homework_01.json) names the file and the locator and holds no line.
- UNDER IT, ONE QUESTION AND ONE SENTENCE: HOW SHOULD THIS SOUND? then who says it, to whom, when, and where he sees it (rule 22f:
  two sentences, the last says 'you see it').
- LOOK AT IT shows the line the way the game frames it: the speaker's face cut from the game's own face bank
  (slices/fight_rig/faces.webp, the look the data names), the name and the place the data gives, the game's own type, the choices under
  a road card, a post as the phone shows a post.
- HIS ANSWER GOES IN THE CARD'S OWN BOX. The box is saved when he taps a thumb (either one); EXPORT writes the card's title, which is
  the line, with his words under it. So the export is already the table this lane needs: the line, then how he wants it.
- NO REWRITE OF OURS IS ON ANY CARD.

THE TAB SHOWS TWELVE CARDS BEFORE ITS MORE FOLD (the coordinator's cap in records/target/BOHEMIA_VOTE_TRIAGE.json). Cards 1 to 12 carry
every kind of mouth he named; 13 to 20 are first behind MORE, and they move up when he reopens the tab after voting.

## THE TWENTY, AND WHAT EACH ONE IS THERE TO TEACH

Every line below was printed by the tool from the game's file (slices/vote/words_two_homework_01/pulled.json).

| # | Mouth | The line as the game has it | Read from | It teaches |
|---|---|---|---|---|
| 1 | A ROAD STOP | Oye, jefe. Two days no food. I don't want batteries, just something to eat. My brother says ask the ones with guns, they got food. | records/target/BOHEMIA_ROAD_EVENTS.json | BEGGING, from a kid, in short broken sentences with a Spanish opener: how a desperate person asks, and how much Spanish is right |
| 2 | THE ENEMY'S LEADER | The House holds this road, and you did not pay to use it. | records/target/bb/fight_reasons.json | THE WHY LINE: one sentence from an enemy saying why he is about to kill you; 127 of these share one shape (this, and that) |
| 3 | THE FEED | they don't know I have two jugs of water under the bed. | records/target/bb/feed_kinds.json | A TWEET that is a joke: meme talk, lower case, from somebody with nothing |
| 4 | A JOB GIVER AT THE BOARD | Seven of them, big as ponies, and they come when the water comes. We cannot pay what you are worth, only 199 batteries, and if you say no it is fine, everybody says no. | records/target/BOHEMIA_BOARD_SHELF.json | A JOB OFFER: somebody poor asking armed men for help and naming the pay herself, in two sentences |
| 5 | YOUR MAN, MID-FIGHT | Ka-ching. | records/target/bb/crew_voices.json | A ONE-WORD BARK in the middle of a fight: the shortest thing anybody says, and it is a joke |
| 6 | A ROAD STOP | Inspección. What's in the wagon, jefe? We take a tenth of everything, it's the law now. Our law. Or you can try to argue. | records/target/BOHEMIA_ROAD_EVENTS.json | A THREAT from somebody who has the power and is relaxed about it: how a shake-down sounds |
| 7 | THE ELDER | Bienvenido. Batteries talk here, so keep yours where we can hear them. | slices/BOHEMIA_SETTLEMENT_SCREEN.html | A WELCOME with a warning inside it, one sentence, from the town's top man: the first words every town says |
| 8 | YOUR MAN, AFTER THE FIGHT | His boots are my size. He won't mind. | records/target/bb/crew_voices.json | MORBID FUNNY, your 11/2 ask ('like real killers'): is this the joke you meant |
| 9 | A MAN FOR HIRE | My crew ate each other over a water tank. I walked. I can walk with you. | records/target/bb/rare_recruits.json | A PITCH: a dangerous man selling himself in three short sentences, with his past in it |
| 10 | THE FEED, A TOWN FALLING | tower. please answer. | records/target/bb/radio_lines.json | FEAR over the radio, three words: you called this kind of communication your swag on 11/3, so this card checks our line against that |
| 11 | YOUR MAN, ON THE ROAD | Boss, the battery box is light. Six short. I counted twice. It was me. My sister in Henderson has a boy on an oxygen machine, and the machine eats batteries. I was going to tell you. | records/target/BOHEMIA_ROAD_EVENTS.json | A CONFESSION from one of HIS men to HIM: how his own crew talks to the boss when it is serious |
| 12 | A BOSS | You have been asking about me all over the valley, and here I am. | records/target/bb/fight_reasons.json | A BOSS: the biggest mouth in the game gets the same kind of line as a road thug today; how should the top dog talk |
| 13 | A ROAD STOP | Folks! Ninety minutes of your time and breakfast is on us. Real eggs: we keep chickens on the roof now. Vacation ownership is still the smartest money in Nevada. Ask me about week thirty-two. | records/target/BOHEMIA_ROAD_EVENTS.json | A JOKE card, the longest kind (four sentences): how funny sounds in this world, and how long a card may run |
| 14 | A SHOPKEEPER | I buy and I sell. Half what I charge, more for what this town is short of. No haggling. | slices/BOHEMIA_SETTLEMENT_SCREEN.html | HAGGLING, or refusing to: how somebody who sells for a living talks about money |
| 15 | YOUR MAN, MID-FIGHT | DESI! Don't you dare. | records/target/bb/crew_voices.json | PANIC AND LOVE in four words when a friend drops: the most emotional second of a fight |
| 16 | A ROAD STOP | I ring it for the ones in the houses who died alone after the money went. Nobody came for them, so I come. Every night a different street. Tonight it's this one. Stand with me a minute, hijo, it's only a minute. | records/target/BOHEMIA_ROAD_EVENTS.json | GRIEF said out loud by an old man: how sad sounds without turning into a poem |
| 17 | BEHIND THE BAR | A trucker swore he saw a dog with a tag in its ear, big as a calf, out by the tower. From the lab. | records/target/settlement_rumours.json | GOSSIP: a second-hand story with doubt in it, the way news travels with no phones |
| 18 | THE FEED, FAR AWAY | the refinery horn still goes off at six every morning. there's no shift anymore. my husband still gets up for it. | records/target/bb/feed_world.json | A SAD TWEET from far away: three plain sentences that are supposed to hurt; you said the far posts read like 'what does that even mean' |
| 19 | THE RETINUE | I fed the whole Strip once. I can feed your crew on half of what you are wasting. | records/target/bb/retinue.json | BRAGGING: an older woman who is good at her job and knows it, talking down to the boss a little |
| 20 | A STRANGER IN TOWN | Batteries or nothing, carnal. Nobody takes paper since the dollar died. | slices/BOHEMIA_SETTLEMENT_SCREEN.html | A NOBODY: what a regular person on a corner says to an armed stranger, two short sentences |

TWO LINES HAVE A BLANK THE GAME FILLS, filled here the game's way and kept raw in pulled.json: card 4's {pay} is the pay on the same
row of the job shelf (199); card 15's {name} is the fallen man's name (DESI stands in, a name the demo's crew carries).

FOUR LINES ARE A KEEPER'S, AND A KEEPER'S LINE GOES THROUGH THE GAME'S SPANGLISH DIAL (the town screen's speak(), rule 143(a)): about
seven times in eight the game shows the line with its tag word of Spanish taken out. Cards 7, 14, 17 and 19 show what he usually
reads, made by the game's own function (engine/bohemia_spanglish.js plain), never by hand: card 14 is stored '...No haggling, mijo.'
and usually shown '...No haggling.'; card 17 is stored '...From the lab, pues.' and usually shown '...From the lab.'; cards 7 and 19
come out the same. The road cards, the hire's line, the why lines and the street stranger do not pass the dial: they show as stored.

## HOW THE TWENTY WERE PICKED

One of each thing, never two cards that teach the same thing:
- A DIFFERENT MOUTH: a kid on the road, a cartel man, a salesman, a priest, one of his own men, the Elder, a job giver, a shopkeeper,
  the bar, a stranger in the crowd, a man for hire, the retinue's cook, three of his men in and after a fight, an enemy leader, a boss,
  and three kinds of post (a joke from the valley, a sad one from far away, a town falling).
- A DIFFERENT MOOD: begging (1), threat (2, 6, 12), joking (3, 5, 13), asking for help (4), a welcome with a warning (7), morbid funny
  (8), a pitch (9), fear (10, 15), confession (11), haggling (14), grief (16, 18), gossip (17), bragging (19), a nobody's small talk (20).
- A DIFFERENT LENGTH: one word (5), three or four words (10, 15), one sentence (2, 3, 7, 12), two or three (8, 9, 14, 17, 19, 20), a
  whole card of four to seven sentences (1, 6, 11, 13, 16).
- THREE CARDS ARE ANCHORS TO HIS OWN EARLIER WORDS: card 8 (the survivor's word, his 11/2 'funny, morbid funny, like real killers',
  voted 'Work in progress'), card 10 (the town falling, his 11/3 'this is Bohemian, this is my swag' on how communication should
  feel), card 18 (a far post, his 11/3 'you kinda suck at sounding like a human tweeting... what the fuck does that even mean').
  If he says one of these is right, that line is the first fixed point of THE VOICE.

## PROVEN ON THE PAGE

- The VOTE tab opened on a phone upright (390 x 844) and on its side (844 x 390) with the twenty registered: twelve on the first
  screen and all twelve this lane's, nothing off the side (0 px over), no page error; a card upright is 300 to 430 points tall with
  its box, on its side up to 337; the picture upright is 338 points wide.
- gates/vote_tab_gate.js with the twenty in: 60 ok, 5 failed, and the five are the five that fail on main without this lane's rows
  (two other lanes' sheets on the two-sentence leg, one unmarked art card, the three legs of the alpha landing on VOTE). Run on clean
  main first: 61 ok, 5 failed, the same five.
- tools/bohemia_words_two_homework.js --sheet 01 --check: every registered title is the data's own line (20 of 20).

## WEAK, SAID PLAINLY

- THE PICTURE IS BUILT, NOT PHOTOGRAPHED. It is the game's face, the game's type and the game's words laid out like the game's
  speaking card; it is not a screenshot of the running game at that moment. Twenty moments driven on the live demo (a boss's door, a
  friend shot down, a town falling) would have cost the hour he is giving. The words are exact; the frame is a likeness.
- THE KEEPERS' FACES ARE A TOWN FACE, NOT THE ROLL. The Elder, the stall and the bar get their face from the place's own dice in the
  game; the cards show one face of the same town pool (person_town_1, 4, 6, 9).
- THE JOB GIVER'S FACE IS ONE OF HER KIND, NOT THE ROLL. At the board the game gives a client a rolled valley person matched to the
  name's sex and people (the town screen's clientLook; the shelf's own look, cast_poncho, is only the fallback and is a man's face);
  card 4 shows a woman's face from the same bank (person_woman_1).
- THE BOX SAVES ON A THUMB. The tab keeps a card's box only when he taps a thumb; the card says so. The tab is RUN TWO's file; this
  lane did not change it.
- TWELVE AT A TIME. Eight of the twenty wait behind MORE until he reopens the tab or taps MORE (the coordinator's cap; a red tag on
  these twenty in the triage file would not change that, the cap is twelve either way).

## NEXT (rule 454(c)(d))

When his first sheet comes back: read every answer, write what each one taught (the word he cut, the word he added, the length he
chose, whether the Spanish stayed), and pick the next cards from what is still unknown, up to about a hundred in all. Then THE VOICE:
one page of rules in his words with his rewrites as the examples, and a gate. Only after that, and on his word, is anything rewritten.
The research record (every mouth counted, what reads as not human, his own words as the first source, how the named references write)
is records/BOHEMIA_WORDS_TWO_EVERY_MOUTH_AND_WHY_IT_IS_NOT_HUMAN_11_17_26.md.

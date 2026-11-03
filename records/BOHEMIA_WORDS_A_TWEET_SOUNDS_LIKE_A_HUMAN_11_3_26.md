# A TWEET SOUNDS LIKE A HUMAN (WORDS 2, 11/3/26; VAMILY rule 372, ask line 398)

His words, the VOTE tab, on THE WORLD IN YOUR FEED: "It is a cause of concern you kinda suck at sounding like a human tweeting.
Some of it is good but a lot of it is kinda like what the fuck does that even mean type shit."

## 1. READ EVERY LINE, AS A STRANGER

716 lines the phone's feed can post: the valley's kinds, replies and follow-ups (records/target/bb/feed_kinds.json, built from
banks/BOHEMIA_WORDS_THE_FEED_BANK.json, whose sources are tools/words_feed/*.py, and FEED's rows tools/feed/BOHEMIA_FEED_ROWS.json),
the world feed and its replies (records/target/bb/feed_world.json) and a falling town's lines (records/target/bb/radio_lines.json,
four towns of 16, posted in the feed since rule 371).

What he meant, found by reading: the valley's own posts were mostly fine (a person, a place, a thing that happened); the world
feed was where the riddles were, about one line in three; the falling town read like a radio script, not like people posting.

THE TELLS (each a shape that makes a stranger ask what it means, with a line it caught):
- A THING DOING A PERSON'S THING: "the moon does not know what country it is in"; "the trees do not care about the dollar";
  "the port listens to the wind like a radio"; "i told the calendar".
- A FORMULA NOBODY TYPES: "we wave at seven. that is the phone call now."; "the pub is the last bank in glasgow".
- TWO FRAGMENTS MIRRORED: "minds in the cloud, feet in the rain".
- A PARADOX FOR ITS OWN SAKE: "so chai is free and impossible"; "look what forever bought"; "my sister in lagos says the radio is in
  lagos. a different lagos."; "you can't kill what was never finished"; "They are only unfinished"; "It is waiting".
- THE TURN-AROUND: "the card does not work. the hour does."
- RADIO JARGON A STRANGER CANNOT READ: "73", "keys up", "Four-one, roof. Come back."
- A TRANSCRIPT IN A POST: "04:51:12 TOWER  Roof copies...", "[no reply]", "[carrier lost]".
- AND NO VERB AT ALL, A LIST OF IMAGES: "{man}. That's all. {place}."; "Day one. {company}. {start} batteries and a road."

## 2. WHAT CHANGED: 145 LINES REWRITTEN, NONE CUT

- The world feed: 51 of its 157 lines, each into one plain thing a person would type ("my neighbor says america still owns the moon.
  america doesn't even own america anymore."; "my mom lives on the other side of the bridge. they closed it. we wave at each other
  every night at seven."). Each voice kept (the Glaswegian's "aye", the trucker, the grandmother); the '73' sign-off gone.
- The valley: 30 lines (23 riddles in the bank's sources, 2 in FEED's rows, then 5 that had no verb, one of them shortened to stay
  at 120). The man who
  revives his machines now says what they are ("My machines are not dangerous. They're just not finished yet."), the city states'
  floor and the militia's car said plainly, a dead man's post says he died. A rewritten line drops its old Spanglish twin (7 dropped,
  217 to 210): rule 355 writes no new Spanglish, and the dial still flavours a line at the house rate.
- A town falling: all 64 lines as posts, lowercase, typed fast, scared ("lights on the east road. eight or nine people walking toward
  the gate. everybody get inside."; the relay: "the roof isn't answering."; "lost the signal."; "{town} channel 4 has gone quiet.
  nobody is answering."). Every line still fits its slot in the recording (the read time, A5), the Church still says hail mary and
  the Reds still say comrade.
- Cut: none. Every line that made no sense had a plain thing under it worth keeping.
- Every line 120 or fewer with its fills at their longest (THE FEED HAS A MAX LENGTH 7/0), English only (LANGUAGE 107/0), Bohemia
  (IT IS CALLED BOHEMIA 6/0).

## 3. THE GATE: gates/a_tweet_sounds_like_a_human_gate.js (A TWEET SOUNDS LIKE A HUMAN, in the suite, node only)

T1 no tell in any of the 716 lines; T2 every post a person writes has a verb (a question, a reply of four words or fewer and the
bots exempt: a bot's line is a label, and "how long this time?" is how people talk); T3 no em dash, no old name; P a planted line for
each tell is caught, plain lines pass, a verbless line is caught. RADIO's gate re-aimed for the plain lines (A1 the relay short and
ending on the quiet channel, A3 the call repeated and "the roof isn't answering", D2 reads either case): 16/0.

## 4. WEAK, SAID

- A regex can catch a shape, not a meaning: a new riddle in a new shape passes until somebody names its tell here.
- The verb test is a closed list plus -ed, -ing and contractions; a post built only of nouns and an unlisted verb would read as verbless.

[bb] Battle Brothers' event text is a narrator; nobody in it posts. Ours is 716 people typing, and now they type like people.
ANALOG HORROR: the plainest lines are the worst ones: "the roof isn't answering." and "lost the signal." with the carrier dying under them.

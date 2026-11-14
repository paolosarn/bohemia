# FIGHT SCREEN: THE WHY LINE (11/14/26) -- BUILD 11/14k - EVERY FIGHT SAYS WHY

VAMILY rule 449(a), ask row 617. PAOLO 11/14: 'The combat screen needs a whole reworking. It's been dog shit... ugly as fuck. It doesn't
explain why people are trying to attack you... I want there to be a sentence, just one sentence... why the fuck the enemies are attacking
you or why the fuck the animals are attacking you.' JOB ONE of the fresh lane, shipped alone. JOB TWO (the rework, ask row 616) is next.

## WHAT WAS MEASURED BEFORE A LINE WAS CHANGED (main 843a15e1)
- THE FIGHT SAID NOTHING ABOUT WHY. At the bell the glass carried the paper strip ('Your line, before the fight.'), the veteran's how-to
  ('Drag a man to where you want him.') and, later, the crew's commentary. No word anywhere on why this band was on him.
- THE MAP ALREADY KNEW HOW EVERY FIGHT BEGAN AND THE FIGHT NEVER HEARD IT. Every hand-over the map and its helpers send carries a 'why'
  word: contract:<job>:<leg>, road:<stop>, road:<stop>:caught (a party that was COMING FOR YOU), party:<id> (his second tap on a party),
  raid:<base>, take:<base>, arena:<id>, boss:<name>, machine:<boss>:<n>, riggers:<n>, place:<place>:<option>, crew, tapped. The shell
  kept it for the end screen (window.__FIGHT_NOW, FIXES 11/9) and handed the fight none of it.
- ONLY THE FIGHT KNOWS WHO THEY REALLY ARE. A party handed as plain brigands is re-rolled by the road into one of the valley's factions
  inside the fight (roadOpts), and a boss's machines arrive as 'brigands' with a band of robots. So who they are is read off the board
  (their kinds), never off the map's label.

## WHAT CHANGED
1. `records/target/bb/fight_reasons.json` (new, draft:true, ONE FILE A MODDER EDITS): 13 ways a fight starts (`how`, each with the map's
   words it answers to), 18 groups of enemy (`who`, each with its kinds and its factions: the road crews, the kids, the Mechanic and his machines, the
   heavies, the dead, the House, the Block Watch, the Keepers, the Water People, the pit's fighters, a boss's crew, and seven kinds of
   beast by what drives them), 17 reasons each tied to its source (DYNASTY's seven, the bestiary's habitats, rule 449(a)'s own list),
   and 67 rules joining them, first match wins, 163 sentences. Facts a rule may ask for, each read off the game: THEY HOLD THIS GROUND
   (bohemia_enemies.json road.holds against the board's ground), THE ANIMAL LIVES HERE (its row's habitat), THERE IS FOOD IN HIS CART
   (the wagon's FOOD), HIS NAME IS KNOWN (CLOUT at 1,800, the band 'A NAME IN THE VALLEY').
2. `slices/bohemia_fight_why.js` (new): the chooser. how(why, flags), who(kinds), pick(...). No rules, no dice of the fight's.
3. `slices/BOHEMIA_FIGHT.html`, `__THE_WHY_LINE__`: the card on the glass (#why: a face, a name, the sentence), in the fight's own
   speaking-card look, a red edge and a red name when it is THEIR man, gold when it is HIS; it grows out of its own face (rule 448(a)).
   - FROM A FACE: their leader's when they are men (the boss, else a leader kind, else their toughest man), drawn lit even when he
     stands in the dark; for beasts, the dead and machines with no man among them, his veteran says it (alone, he says it himself and
     the ', boss' is dropped). A beast does not talk.
   - PLAIN ENGLISH, never through the Spanglish dial; every sentence an attempt, draft:true.
   - IT NEVER STOPS THE FIGHT AND NEVER WAITS FOR A TAP: it comes after the open's stillness (never in the first second), types on the
     song's own beat, stands eight beats at any fight speed (at 4x it is still readable), and goes. Taps pass through it.
   - ONE VOICE AT A TIME: the veteran's lesson and the crew's commentary wait until it has gone.
   - NEVER THE SAME WAY TWICE IN A ROW: the wording each rule used last is kept (bohemia.fight.why.v1).
   - The fight reads the door's word from the shell (__FIGHT_NOW.why); FIGHT_OPTS.why hands one to a test. No file of RUN's or COMBAT
     THREE's was edited: the boards, the hand-over and AUTO are as they were.
   - drawPortrait takes one more word (lit): a man who is talking to him is drawn as he is.

## THE GATE: THE WHY LINE (gates/the_why_line_gate.js, registered) 15/0
NO FIGHT STARTS WITHOUT A TRUE REASON. W1 the table reads. W2 every 'why' word in the map's hand-overs has a how (13 words in 7 files).
W3 every enemy kind in the fight's tables is in a named group (80 of 80). THE GATE'S FIRST RUN FOUND 11 THAT WERE NOBODY (the pit's
gladiators and the bosses' crews), and ON THE WAY IN IT WENT RED TWICE MORE on kinds other lanes added the same hour (BOSSES' sergeant, then
kids_horn and heavy_bruiser). So a kind is now grouped by its name, else BY ITS FACTION off the fight's own tables (a new kind a lane adds to a
known faction's mix is somebody with no edit), else, a boss's man or a pit fighter nobody names, by the group kept for that fight; only a
brand new faction is nobody, and the leg plants both. W4 every way x every group x every fact x a man beside him or alone: 1,040
fights, 1,040 said why; men who can talk say it themselves (104 of 104), beasts and the dead never. W5 163 sentences, each one plain
English sentence of 16 words at most. W6 26,520 fights in a row, never the same wording twice running. W7 32 factions dealt by the
fight's own rules, 96 bands, all somebody with a sentence for every start. W8 the page's wiring. W9 on the fight's page on a phone: the
sentence after the first second, the right mouth, a drawn face, the fight moving under it, gone by itself. Planted: a how with no rules,
a kind in no group, a line of two sentences, the page's tick taken out: each red.

## ON THE PAGE HE PLAYS (rule 441(a); tools/bohemia_fight_screen_on_the_page.js)
The real page opened the way a stranger opens it (title, NEW GAME, BEGIN, GO), every fight started through the map's own door: the first
by the map's own road crew, the rest by the map's own hand-over with the message each caller builds. Nine fights a run: a road crew, a
job against the Block Watch, a coyote pack on the road, the Keepers hunting him down, a raid on his place, a fight inside a place, hogs
he chased, a boss's machines, THE POT.
RESULT: 36 of 36 fights said why and were whole on every check: the demo upright 9 of 9, the demo sideways 9 of 9, the alpha upright 9 of 9, the alpha sideways 9 of 9 (390 x 844 and 844 x 390 at 2), 0 page errors. On main's page, the same road fight: no sentence (the BEFORE half of the VOTE card).
In every fight: the sentence came after the first second, from a drawn face with a name, true to the door's word and to the kinds on the
board, from their man for men and his man for beasts and machines, whole on the glass with no word cut; a finger pressed FIGHT and AUTO
while it was up and the fight's log grew under it; it went by itself; the lesson and the commentary never stood with it. The first fight
of each run was played to its end on AUTO and left by the end screen; the rest were pulled out of with RETREAT. Page errors: 0.
A sample, off the demo upright:
- road crew: THUG, 'Leave the batteries and the guns, and you can keep walking.'
- the job: CAPTAIN, 'Somebody paid you to come down our street, and we live here.'
- coyotes, with food in the wagon: DESI, 'It is the cart they want, boss, the food in it.'
- hunted down: FERAL, 'You are not hard to find, and we are done following.'
- the raid: CUTTER, 'Your place has what we need, so we came to take it.'
- inside a place: SHIELD, 'Whatever you came in here for, you are not leaving with it.'
- hogs he chased: DESI, 'We ran them down, boss, and a cornered animal fights.'
- a boss's machines: RAUL, 'They have one order, boss, to stop whoever walks in here.'
- THE POT: 'You came into my place to kill me, so let us see it.'

## WHAT IS NOT IN THIS SHIP, SAID PLAINLY
- THE DEAD HAVE FRIENDS (DYNASTY s2.4) has no sentence: the game keeps no record yet of whose crew he broke, so the reason could not be
  told true. When a lane keeps that record, one rule with needs 'vendetta' adds it.
- The job's own payer is not named in the sentence (the hand-over carries the job's id and its enemy's name, not who pays).
- The count DYNASTY proposed for the end screen ('WHY THEY FOUGHT: 61 JOBS, 22 ROBBERS') is not built; UI.whySaid carries how, who and
  reason for whoever builds it.
- The card's look is the fight's present speaking card. JOB TWO rebuilds the whole glass and this card with it.

## ROUTED (proposals; the coordinator adds jobs)
- WORDS: the 163 sentences are attempts; the file is theirs to rewrite line by line (the gate holds one sentence, 16 words, plain English).
- SOUNDS: the sentence posts BOHEMIA_VOICE with the speaker's look, as the veteran's lesson does; a leader's voice is theirs.
- TUNING: known_from_clout (1,800) is a felt number and sits in the reasons file, named; it belongs in the one table when TUNING takes it.
- EYES: UI.whySaid on the fight's page is what was said and why (how, who, rule, reason, side, by, at).

[bb Battle Brothers never says why a band attacks: the contract's text and the event before the fight carry it, and the tactical screen
opens silent. Ours says it in one line at the bell, from the mouth it belongs to.]
[analog horror: the Block Captain does not threaten; he says 'we live here'. The dead get no reason at all: 'nobody knows why the dead
get up, only that they come for the living.']

*FIGHT SCREEN, 11/14/26.*

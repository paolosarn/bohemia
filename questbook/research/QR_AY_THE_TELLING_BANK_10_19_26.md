# QR-AY: THE TELLING BANK. WHERE THIRTY TELLINGS A GAME COME FROM

QUESTION: row [the telling bank] (QUESTS, research only), from QR-AX OPEN 6 and section 5: a hundred hours holds up to
about 57 TELLINGS at the fire and the shelf has 27 (17 members, 10 ambitions), so about thirty a game must come from the
roster's own facts (the thing on the body, the place passed, the person before the dollar died) on QR-AV's three-line
skeleton. How do Battle Brothers' 104 background events build a small scene from a man's background, level and the
ground (the wiki dump, counted); how does the library write an ambient scene from a character's facts (`Q043.P3`,
`Q048.W5`); how do real people tell a story at a fire (Wiessner, read again)? Hand PEOPLE a generator shape (the fields,
the order, the wrong detail per instance, the once-per-life rule) and twenty example tellings in a bank tagged draft:true.

STATUS: research only (rule 35, laws/BOHEMIA_ADDENDUM_QUESTS_IS_RESEARCH_ONLY_9_27_26.md). Nothing here is built. Every
number is an attempt, draft:true; TUNING (chat 21) owns every felt number, MODS (chat 22) the data shape, PEOPLE builds the
generator, WORDS (held by rule 88) and Paolo own the words. Pages and a bank only (rule 88), nothing registered in VOTE.
Author: QUESTS lane, round 10/19.

THE BANK: banks/BOHEMIA_THE_TELLING_BANK_10_19_26.json (draft:true, tuned:false, nothing live reads it): the generator's
fields, order, bands, wrong-detail kinds and once rule as data; two trades' fragment banks written the Battle Brothers
way; and twenty example tellings TB01 to TB20.

SOURCES:
- The 236-study library by id (records/BOHEMIA_QUESTBOOK_LAW_INDEX.json).
- Our own repo, measured: the 280 designs in questbook/designs (the 27 TELLING designs by their BUDGET line, QR-AX);
  engine/bohemia_roster.js (what a hired man carries: name, background, level, gear, one PAIN line); the starting crew in
  records/target/bb/ours.json (twelve, rule 63b); 77 backgrounds in records/target/bb/backgrounds.json; the armour names in
  records/target/bb/armor.json; the region's 34 named places and 13 ground kinds in engine/BOHEMIA_REGION_LAND.json.
- Battle Brothers, counted from the wiki dump reference/library/grok/wiki/PAGES_ALL.tar.gz (2,255 pages; source: wiki
  dump, unverified; the Events page warns some requirements may be wrong against the code): the Events page's "Events by
  Background" list (104 pages), each page's cooldown, requirement list, score, screen tabs, buttons, the {{EventCycler}}
  variants and the {{EventVariable}} slots; and the developers' own forum posts collected on the Developer Posts page
  (the modular backstory, quoted in section 2).
- The real world, through search text only (pnas.org, pmc, semanticscholar, phys.org and the university hosts do not
  resolve or are refused from this sandbox): (a) Wiessner 2014, "Embers of society", PNAS 111(39), via ScienceDaily's
  summary and the abstract; (b) Smith and colleagues 2017, "Cooperation and the evolution of hunter-gatherer
  storytelling", Nature Communications 8:1853, via UCL's release and the abstract; (c) Labov and Waletzky 1967 and
  Labov's later "most reportable event" and reportability-credibility work, via secondary summaries and an OSU talk
  abstract (2013); (d) Bartlett 1932, "Remembering" (the serial retelling of The War of the Ghosts), via teaching
  summaries; marked [S] where it is only a summary and [R] where it is recall.

[bb the telling bank] research line: Battle Brothers builds a man's small scene from four things it already knows about
him, and never from a contract. HIS TRADE picks the scene (104 events are listed by background; each of our twelve
starting trades has one to nine of its own). HIS LEVEL opens it or closes it (30 gate on "level N or higher", the life
story at 9 to 11; 13 on "level N or LOWER", so the green man's wonder expires). THE GROUND fires it (26 of 104 need a
terrain or a distance to a town: the miner on the mountain, the hunter in the forest, the fisherman on the shore). And A
SECOND MAN at the fire is the foil (20 of the 31 one-screen camp scenes name two men). Of the 80 pages with a written
screen, 44 are ONE screen with ONE button, 31 of them "During camp...", and 37 of those 44 pay a mood and none pays a job.
The backstory that makes it read true was assembled at hire from slotted parts (four groups of three or four options and
%name%), and the developers' own words are that an event pays off what "their background story tells you as much".

---

## THE ANSWER IN ONE PARAGRAPH

The thirty are not missing because nobody wrote them; they are missing because the shelf's tellings are not stories. All
27 TELLING designs have a hall in their DOOR line, and every one whose fire lines can be read ends on a job: "Take the
sister's job", "When he posts the inspector's job, take it", "The pharmacist posts the carry at the ninth-floor window".
The fire, as written, is a job board with a face, where Wiessner's night is 81 percent stories and 4 percent economics,
and where Battle Brothers' one-screen camp scenes pay a mood 37 times in 44 and a contract never. Worse, not one of the 27
belongs to the eleven people the player has from the first minute, and the roster could not feed them if it tried: 70 of
77 trades fall back to "Does not talk about before. You do not ask.", 7 of the 12 starting crew among them, and the hats
and aprons that would be the thing on the body are named "a rag hood" and "a work jacket" on the screen. So the generator
is three fixes in one: an UNBOUND telling (a story that points at nothing), built Battle Brothers' way from TRADE, LEVEL,
GROUND and a FOIL, with the BEFORE assembled from four slotted fragment groups per trade, three bands a life (green
wonder, seasoned before, veteran life, once each), a retelling of the dead by the living that drifts the way Bartlett's
chains drift, and one wrong detail in at most one telling in five. Twenty examples, one per starting crew member and nine
more, are in the bank; none names a job, a price or an ask.

---

## 1. THE FINDING THAT PROVES US WRONG (measured against the repo)

1. EVERY TELLING ON THE SHELF IS A JOB AD. A script read the BUDGET and DOOR lines of the 280 designs: 27 carry
   BUDGET: TELLING (17 member tellings, 10 ambition tellings). 27 of 27 name the hall in their DOOR ("camp, then hall";
   "hall; camp, then hall, when the ambition is open"; "hall, then camp"). Of the 15 whose three fire lines are written
   in the design's FIRE bullet, 15 of 15 end on a job or a person at the hall: QD-AQ04 "Take the sister's job. I'll show
   you where.", AQ05 "When he posts the inspector's job, take it.", AQ17 "The truck stop's posting a job on them. Take
   it.", M02 "The pawn lady posts work at the old tax office. If she does, take it." The ten ambition tellings point at
   the hall card by their DOOR (QD-AE11: "The pharmacist posts the carry at the ninth-floor window. That's the one.").
   QR-AV fixed the ORDER of the lines (a story first, the price on the button) and QR-AX gave them a CLOCK; neither asked
   whether a telling may point at nothing. So if every bound telling fired, the fire's economics share would be 100
   percent of its stories, where Wiessner's firelight is 4 percent (section 4) and Battle Brothers' one-screen camp scenes
   are 0 of 44 (section 2). `Q236.X3` (the client as a vending machine), `Q066.X1` (the story becomes a vending machine),
   `Q085.W2` (at night they eat, joke and play music).
2. THE PEOPLE YOU HAVE FROM MINUTE ONE HAVE NO TELLING. The starting crew is twelve (records/target/bb/ours.json, rule
   63b): YOU and DESI, RAUL, TINA, BOOKIE, OSO, MARISOL, CHEWY, LUPE, GRIZ, DEUCE, NENA. Not one of the 27 tellings has
   any of the eleven as its teller; the shelf's tellers are followers hired later (QD-AQ) and veterans of 20 fights
   (QD-AU15). Battle Brothers gives each of our twelve starting trades scenes of its own (section 2). `Q043.X4` (spread
   the characterisation so no companion is a stub).
3. THE ROSTER HAS NO "BEFORE" FOR MOST MEN. engine/bohemia_roster.js gives a hired man one PAIN line, "said like a person,
   never a stat", from a table of 7 backgrounds (sellsword, militia, brawler, retired soldier, thief, farmhand, beggar);
   the other 70 of the 77 rows get "Does not talk about before. You do not ask." Seven of the starting twelve get that
   line: OSO the miner, MARISOL the hunter, CHEWY the butcher, LUPE the poacher, GRIZ the caravan hand, DEUCE the gambler,
   NENA the daytaler. A generator "from the person before the dollar died" has nothing to read for them.
4. THE THING ON THE BODY IS IN THE DATA AND OFF THE SCREEN. The roster names armour by durability: a head under 40 is "a
   rag hood", a body under 40 "a work jacket" (engine/bohemia_roster.js armourName). Of the twelve starting heads, 8 read
   "a rag hood", among them MARISOL's Hunter's Hat, DEUCE's Feathered Hat, NENA's Straw Hat and RAUL's Leather Headband;
   of the twelve bodies, 7 read "a work jacket", among them CHEWY's Butcher's Apron. The item keeps its own name in its
   'was' field; the generator must read 'was', or the witness of line 2 is "a rag hood" for two thirds of the company.
5. TWO MORE FIELDS ARE NOT ANYWHERE. The roster carries xp and level and no night of joining, so QR-AX's "the teller's
   10th night in the company" cannot be read; and the company's own record (the first fight's place, the dead with their
   names and nights) is not a named field (the deed ledger serves the feed). Both are owed before any generator runs.

What the roster DOES carry is enough for the rest: a trade for every man, a level, gear ids with their own names, marks,
and a region of 34 named places each with a "what" line and 13 ground kinds. The ground is the richest field we have and
no design reads it at the fire.

---

## 2. WHAT BATTLE BROTHERS DOES, COUNTED (the wiki dump, the 104 events by background)

| what | count | what it means for us |
|---|---|---|
| events listed by background | 104 | a man's trade picks his scenes |
| pages with a written screen | 80 | 24 pages carry the requirement table only |
| ONE screen, ONE button (no choice) | 44 of 80 | the telling's shape is Battle Brothers' commonest shape |
| of those, "During camp..." | 31 | the camp is their door too ("Along the way..." 9, "At <town>" 3, road 1) |
| of the 44, pays a mood | 37 (23 mood only) | the effect is how the company feels; 0 pay a contract |
| of the 31 camp ones, name two or more men | 20 | the FOIL: a second man at the fire |
| of the 31, median cooldown | 50 days (21 to 150; 4 once-ever) | a teller is rare; QR-AX's 30 nights per teller is lighter |
| gated "level N or higher" | 30 of 104 | small ones at a median 4; the life story at 9 to 11 |
| gated "level N or LOWER" | 13 of 104 | the green man's scenes EXPIRE (Miner Atop World: level 3 or lower) |
| gated on the ground (terrain) | 11 of 104 | forest, shore, mountain, snow, road |
| gated on distance to a town | 15 of 104 | "within 3 tiles", "more than 6 tiles away" |
| carry written variants ({{EventCycler}}) | 14 of 104 | Fisherman Tells Story 5, Minstrel Writes Song 6, Forest Lover 4, Walkers Bond 3, Player Plays Dice 9 |

How one is put together (read from the pages, not counted):
- THE SLOTS. Every page fills names into fixed text: {{EventVariable|Fisherman}} (the man), Randombrother or Otherguy
  (the foil), Randomtown and Townname (a real place on the map), Companyname (15 of 104 use the company's name). The
  scene is a template with the man poured in; it reads authored because the template was.
- THE GROUND IS THE TRIGGER. Miner Atop World fires only on mountain terrain, daytime, with the miner at level 3 or
  lower: "Years of digging deep into the earth has made this reversal of perspective all the more wonderful." Forest
  Lover fires in a non-frozen forest; Giant Tree in Forest only away from towns; Fish Caught on the shore. A quarter of
  a man's scenes are WHERE he is, not who.
- THE STORY IS CHECKED AGAINST THE RECORD. Forest Lover's first variant: "I used to play through these forests as a kid."
  / "I thought you were born outside <Randomtown>?" / "Oh yeah, that's right." The man's own record catches his story.
  That is a wrong detail made by the data, and it is the model for ours (section 5).
- THE TELLER IS NOT ALWAYS TRUTHFUL, AND THAT IS THE CHARM. Fisherman Tells Story's fifth variant: "I once caught a bass
  about, yeigh, big... Alright I've never caught a bass." Retired Soldier Tale: "If he's lying, it's merely an
  embellishment, as the scars all about his body speak unsightly truths." The scar is the witness.
- THE BUTTON IS THE CAPTAIN'S SHRUG, NOT A CHOICE. "Sounds fishy to me.", "Good for him.", "We march on.", "Killing men
  does make for great bedtime stories." One button, the event ends.
- THE BACKSTORY IS ASSEMBLED, AND EVENTS PAY IT OFF. The developers' forum post (Developer Posts page): "the text part of
  contracts is actually modular as well... here's one from the 'Adventurous Noble' background story... The story is
  randomly put together from a series of parts so that not every adventurous noble will have the exact same story.
  {A minor noble | As the third in the line of succession | A young and brash noble | A skilled swordsman}, %name%'s life
  at court {has grown stale for him | ...}." Four groups, four, three, four and four options. And on the events: "When
  swordmasters get even older, it's because they've been old since you hired them... their background story tells you as
  much when you hire them." The hire PLANTS, the event PAYS. Also: "There are no character deaths at events that can not
  be avoided, and there never will be."

Our twelve starting trades in that list (scenes whose header or requirement names the trade; one-screen ones marked *):
sellsword 9 (Sellsword vs Raider*), poacher 6 (Forest Lover*, Hunt Food*, Poacher vs Thief*), hunter 5 (Forest Lover*,
Hunt Food*), brawler 4 (Brawler vs Brawler*), thief 4 (Mason vs Thief*, Poacher vs Thief*), butcher 4 (Butcher Gives
Pointers*, Butcher vs Wardog*, Farmer vs Butcher*), gambler 3 (Gambler vs Other*, Minstrel Outsmarts Gambler*), miner 2
(Miner Atop World*, Miner Fresh Air), retired soldier 2 (Retired Soldier Tale*), caravan hand 2 (Caravan Hand Cart*),
daytaler 1 (Lend Men to Build). The militia has none of its own.

---

## 3. WHAT THE LIBRARY SAYS (by id)

- THE CHEAPEST SCENE IS THE ORDINARY ONE. Ambient banter is "our cheapest, highest-impact characterization tool"
  (`Q043.P3`, `Q043.W4`); the party reacts to EACH OTHER, the foil (`Q043.W2`); every companion is a protagonist, a
  bundle of stories, not a stat-stick (`Q043.W7`); spread it so no companion is a stub (`Q043.X4`); at night they "eat,
  joke and play music" (`Q085.W2`); the bond forms in ordinary moments (`Q063.W2`); slow-burn officers drawn out over
  voyages (`Q066.W6`); survivors telling stories to each other is load-bearing (`Q030.W8`).
- IDENTITY FIRST, SKELETON PROCEDURAL, FLESH HANDMADE. Generate identity first and make the rest support it (`Q048.W5`);
  the skeleton alone is "a shallow puddle" without authored flesh and voice, but scope the volume (`Q048.X2`, `Q047.X1`);
  author the peaks and let the player's head fill the gaps (`Q048.W7`); smart templated reactivity, scoped (`Q047.P4`);
  take the principles, never a patented form (`Q048.X1`); the body carries the history (`Q048.W6`, `Q055.W4`).
- THE STORYTELLER READS THE STATE. Pick what the state makes best (`Q044.W2`); after a hard hit, relief (`Q044.W7`); a
  pace the player can set (`Q044.W3`); emergent texture under an authored spine (`Q044.P8`); build for retelling
  (`Q044.W9`, `Q045.W8`); the sim is the content (`Q045.W9`), but SURFACE it or nobody sees it (`Q045.X4`, `Q118.X2`).
- ATTACHMENT IS LABOUR, AND THE ROOM MUST SPEAK. Unwritten recruits become losses through invested hours (`Q151.W9`,
  `Q055.W9`), but the interior that never speaks of itself leaves the attachment all on the player's side (`Q151.X3`,
  `Q146.X1`, `Q129.X9`); "if I created my own narrative it'd be in my head, not the game" (`Q055.X1`); the mute
  protagonist lets the player narrate (`Q146.W5`): the captain does not tell; the company does.
- REPETITION, COUNTED, IS DEVOTION; REPEATED, IS NOISE. The ninth-winter pump line, one integer (`Q147.X3`, `Q147.P4`);
  inherited officers speak of the last captain in the past tense (`Q144.W7`); a returning face carries the time
  (`Q031.W6`, `Q010.W10`); the bark with no cooldown becomes the most annoying thing in the game (`Q084.X6`); the heir is
  never re-served the parent's scenes (`Q144.X1`); samey over hundreds of hours (`Q061.X5`, `Q087.X3`); wonder is finite
  and completion depletes it (`Q066.X5`).
- THE DEAD GET A RECEIPT. Each casualty names its cause (`Q137.W1`); the offscreen exit is a bug (`Q105.X5`).
- RANGE PER BATCH. Any ten span three tones (`Q114.N4`); grim and absurd side by side (`Q013.W2`), kept in their own
  registers (`Q013.P12`); the unplannable small triumph keeps dread bearable (`Q041.W10`); quiet framed as the event, not
  dead air (`Q188.X3`); the quiet beat before the plunge (`Q006.W10`); side stories for a sense of place (`Q013.W1`);
  nothing missable is owed (`Q114.W3`).
- EARNED BY TIME, AND NOT IN THE FIRST HOUR. Sergiu waits 24 days before he asks (`Q108.W1`); the scripted ask that fires
  "whether or not you have ever looked at him" is a card with a face (`Q108.X1`); pressure creeps in by day 4 or 5
  (`Q021.W3`); a barrage up front nearly loses players (`Q065.X2`); between the engine's good moments, play reads as
  admin (`Q046.X1`).
- THE SYMPATHETIC BEFORE THE DAMNING. The order of lines (`Q125.P25`), which is QR-AV's line order.
- OBLIQUENESS IS NOT DEPTH. The story told so obliquely it needs a wiki (`Q084.X4`): one wrong detail, said plainly.

---

## 4. WHAT THE REAL WORLD SAYS

1. AT NIGHT, PEOPLE TELL STORIES ABOUT PEOPLE. Wiessner recorded 174 day and night conversations at two Ju/'hoan camps in
   north-west Botswana, each over 20 to 30 minutes with five to fifteen people. By day: 34 percent complaints, criticism
   and gossip, 31 percent economic matters, 16 percent joking, 6 percent stories. By the fire: about 81 percent stories,
   gossip and complaints down to 7, economics to 4 [S: ScienceDaily's summary of the paper; the tables were not reached;
   this corrects QR-AV, which had no daytime story share]. The stories "often [concern] known people": the exploits of
   distant kin, adventures in towns, local politics, truck stories, elephant stories, trance; hunting trips, murders,
   marriages, births, getting lost, bushfires [S: the abstract, Smithsonian, Live Science]; and night talk carries "the
   characteristics of people who are not present and who are in your broader networks" [S]. So a night that points at a
   job is day talk at night; a night that tells who someone was is what the fire is for.
2. GOOD TELLERS ARE WANTED. Among the Agta (about 300 people in 18 camps), skilled storytellers were nearly twice as likely
   to be named as the person you would most like to live with, had on average 0.53 more children, and camps with more of
   them cooperated more [S: UCL's release and the abstract]. The teller is the member people keep.
3. A PERSONAL STORY HAS ONE REQUIRED PART. Labov and Waletzky's six parts (abstract, orientation, complicating action,
   evaluation, resolution, coda): only the complicating action is required, and the evaluation usually sits before the
   resolution [S]. A story is built around its "most reportable event", the least common one with the greatest
   consequence; and reportability runs against credibility, with credibility won by giving voice to "animate and
   inanimate third person witnesses" [S: Labov's 2013 talk abstract]. Our three lines map onto it: line 1 is orientation
   plus the complicating action (a moment with a person in it); line 2 is the INANIMATE WITNESS (the thing on the body,
   the ground under the fire); line 3 is the evaluation (what they want you to know). The thing in line 2 is not
   decoration: it is why line 1 is believed.
4. A RETOLD STORY DRIFTS. In Bartlett's chains each retelling came out shorter and changed, the strange parts were
   rationalised or dropped, and the story moved toward the teller's own culture; the drift grew with each link [S:
   teaching summaries; the primary text was not reached]. So when a living member retells a dead one's story, it should
   be shorter, lose a street or a name, and keep the last line nearly whole. That is drift, honest; it is not the wrong
   detail.

---

## 5. THE GENERATOR SHAPE (for PEOPLE; draft:true; as data in the bank's "generator" block)

THE FIELDS (each says whether it exists):
| field | what it is | where it lives |
|---|---|---|
| GROUND | tonight's camp block kind (13) and the nearest named place within 2 blocks (34, each with a "what" line) | EXISTS: engine/BOHEMIA_REGION_LAND.json |
| TELLER | a living member: name, trade, level | EXISTS: engine/bohemia_roster.js |
| NIGHTS | nights since he joined | OWED |
| BAND | green (level 3 or lower), seasoned (4 to 8), veteran (9 and up) | EXISTS (level) |
| BEFORE | the person before the dollar died, from his trade's four fragment groups | OWED: 7 of 77 trades have one line |
| THING | an item on the body by its own name ('was'), a veteran's thing (QR-AU rule 2), or a mark | EXISTS as ids; looks are ASSET NEEDED |
| COMPANY | the first fight's place, the dead (name, how, night), fights together | PARTLY OWED |
| FOIL | one living member at the fire, named in a line, never a second face | EXISTS |
| TOLD | the spent once-keys: "member:band", "retold:member" | OWED (a list of strings in the save) |

THE ORDER (each step only narrows; identity first, `Q048.W5`):
1. GROUND: read the block and the nearest place.
2. TELLER: eligible if alive, past his 10th night (QR-AX), not the face of any screen in 30 nights, his band's key
   unspent. Score: +2 when his trade matches the ground (the miner on the quarry, the hunter at the refuge, the fisherman
   at the drowned marina: Battle Brothers' quarter of scenes gated on WHERE); +1 when he carries a thing with its own
   name; +1 when a foil whose trade pairs with his is at the fire (Poacher vs Thief, Butcher and Farmer); ties to the
   longest since his last screen.
3. SOURCE BY BAND: green = WONDER (a ground or a first he never had; it expires when he levels past 3, as 13 of Battle
   Brothers' scenes do); seasoned = BEFORE; veteran = LIFE (once-ever, the before tied to the company; Battle Brothers' 9
   to 11); retold = a dead member's own telling, by a living member who rode with him 30 nights.
4. LINE 1, THE STORY: a past moment with a person in it, named or by role (mi papa, my foreman Ramon): orientation and the
   complicating action.
5. LINE 2, THE THING AND THE PLACE: the witness. The thing on the body and the ground under the fire.
6. LINE 3, WHAT THEY WANT YOU TO KNOW: the evaluation. Never a job, never a price, never an ask, never a place to go.
7. THE WRONG DETAIL: roll it (below).
8. THE VOICE: his own Spanglish and his trade's words; three lines, each under 20 words; the player never speaks.
9. SPEND THE KEY. Write nothing else (QR-AV rules 10 and 11).

THE BEFORE, ASSEMBLED (Battle Brothers' own shape): four groups per trade, four options each: WHO he was ("Eleven years in
the gypsum at Blue Diamond"), the PERSON in it ("my foreman, Ramon"), the PLACE BEFORE (a valley place: "the hill the mine
ate"), the MOMENT the dollar died ("the week the pay cards stopped working"). 16 fragments a trade, 256 combinations, and
the person and the place are what line 1 needs. The bank writes the miner's and the daytaler's as the size and voice to
aim at. For the twelve starting trades, 192 fragments; for all 77, about 1,232; a line-3 bank of about 12 per band.

THE ONCE-PER-LIFE RULE: a member tells at most one generated telling per band in his life, so up to three (green,
seasoned, veteran). An heir is a new life and starts green (QR-AX rule 6), and is never handed the parent's lines
(`Q144.X1`). A dead member's telling is retold once, by one living member, at least 30 nights after the death and never
within two nights of any death; the retelling speaks of him in the past tense (`Q144.W7`). The 27 shelf tellings are
bound to jobs and do not count against a member's three.

THE WRONG DETAIL (the analog horror law at the source: an ordinary story, one wrong detail, said plainly, never
explained, never remarked on by anyone at the fire, never gore): at most one telling in five carries one (QR-AF's ratio
for a contract's wrong detail); never two tellings in a row; never more than one per teller in a life. Six kinds, each
made from the record so the data makes it, as Forest Lover's lie is caught by the man's own birthplace:
- COUNT: a number from the company's record, off by one ("Thirteen of us at the wash" when the book has twelve).
- NAME: a person in a story from before the dollar died has the name of a member at the fire, at an age that cannot be
  him.
- COMPANY: the company's own name inside a story from before the company existed.
- THING: the thing is wrong in one plain way: warm, wet, newer than it can be.
- DEAD: a dead member spoken of in the present tense ("He told it to me again last night"), the inversion of `Q144.W7`.
- PLACE: tonight's ground described as it was before it fell, as if seen last week.

THE BOUND AND THE UNBOUND: over any act a bound telling (a shelf telling pointing at a job) is at most one telling in
three, and two bound tellings never fire in a row. That keeps the fire's economics share near a third at worst, which is
still eight times Wiessner's 4 percent; it is the share a mercenary company's fire can carry and stay a fire.

THE MATH OF THIRTY: QR-AX gives up to about 57 tellings a game (about 19 an act). The unbound supply from the starting
eleven alone is 33 band keys (11 times 3) before anyone dies or is hired, and every death adds a retelling. So supply is
not the problem; the generator must CHOOSE, which is why the score reads the ground first. In act one, green and seasoned
keys for eleven are 22 against about 19 tellings an act: the act's tellings are almost all the starting crew's, which is
right, because they are the people the player knows.

---

## 6. THE RULES FOR THE BUILDERS (numbered, testable; draft:true)

1. A TELLING POINTS AT NOTHING. Test: no generated telling's three lines name a job, a fee, a price, a hall, a client or
   a place to go; the bank's twenty pass (0 of 60 lines).
2. THE FIRE IS NOT A JOB BOARD. Test: in a simulated act, bound tellings are at most a third of all tellings and never
   two in a row.
3. EVERY STARTING MEMBER HAS A BEFORE. Test: every background a starting crew can hold carries the four fragment groups;
   no starting member reads "Does not talk about before" (today 7 of 12 do). A hired trade without a bank gets no
   generated BEFORE telling and is not counted as a stub; its green and veteran bands still fire.
4. THE THING IS READ BY ITS OWN NAME. Test: line 2's thing is the item's 'was' name or a named veteran's thing, never the
   roster's display name ("a rag hood", "a work jacket").
5. THE GROUND PICKS. Test: in a simulated act, a teller whose trade matches tonight's ground is picked over an equal one
   whose trade does not.
6. THREE BANDS, ONCE EACH. Test: a member id spends at most one key per band in a save; an heir's keys start empty; no
   heir's telling reuses a parent's line.
7. THE GREEN WONDER EXPIRES. Test: no WONDER telling for a member above level 3.
8. A RETELLING DRIFTS AND IS SHORTER. Test: a retold telling is at least 15 percent shorter than the original's lines
   and is at least 30 nights after the death, never within two nights of any death, once per dead member.
9. ONE WRONG DETAIL, ONE IN FIVE. Test: over 1,100 simulated nights, tellings with a wrong detail are 20 percent or fewer,
   never two in a row, never two for one teller; none is explained or answered in the same scene.
10. ONE FACE, ONE BUTTON, NOTHING WRITTEN. Test: a telling shows one portrait, three lines, [SLEEP], and writes only its
    once-key (a later CAUSED scene may read the key, never a meter, QR-AV rule 11).
11. THE PLAYER DOES NOT TELL. Test: YOU is never a teller; the player never speaks Spanglish (the first votes).

---

## 7. THE TWENTY (the bank's TB01 to TB20; one per starting member and nine more)

| id | teller (trade) | band | ground | the thing | the first line | wrong detail |
|---|---|---|---|---|---|---|
| TB01 | OSO (miner) | green | GASS PEAK | the taped sledge | "At Blue Diamond, my foreman Ramon made us eat lunch in the dark." | |
| TB02 | MARISOL (hunter) | seasoned | CORN CREEK | the sheep tag on the Hunter's Hat | "Mi papa drew one sheep tag in thirty years." | |
| TB03 | CHEWY (butcher), foil NENA | seasoned | an east block | the Butcher's Apron | "Nena, you remember my tia's carniceria on Eastern?" | |
| TB04 | LUPE (poacher), foil BOOKIE | seasoned | JEAN | the rifle | "I did fourteen months in Jean for one bighorn ram." | |
| TB05 | TINA (retired soldier) | veteran | CREECH | the gate sticker on the car door | "Twenty years on the gate at Creech." | |
| TB06 | GRIZ (caravan hand) | seasoned | MOAPA | the fuel card in the vest | "I ran lettuce from Yuma to Salt Lake." | |
| TB07 | DEUCE (gambler) | green | PRIMM | the ticket in the Feathered Hat | "Day before the dollar died, the lotto line here ran to the freeway." | COMPANY |
| TB08 | NENA (daytaler), foil CHEWY | seasoned | a big-box lot | the Straw Hat | "Five a.m., the hardware lot on Lake Mead." | |
| TB09 | RAUL (brawler) | green | the first fight | the Leather Headband | "Coach Benny at the gym on Owens made us skip rope." | |
| TB10 | DESI (militia) | seasoned | a block, the yellow house | the block number on the car door | "Old Mr. Fidel and me walked our block with a list." | |
| TB11 | BOOKIE (thief) | seasoned | roll-up doors | the pistol | "Storage place on Boulder Highway. Unit 41." | |
| TB12 | OSO (miner) | veteran | BLUE DIAMOND | the same sledge | "My grandpa, my dad, then me. Three Osos in that hill." | |
| TB13 | MARISOL (hunter) | veteran | TULE SPRINGS | a dire wolf tooth on a cord | "Mi papa dug here on Saturdays with the volunteers." | THING |
| TB14 | NENA, retelling DESI | retold | a block | Desi's car door | "Desi had a block. Nellis and... I forget." | (drift only) |
| TB15 | GRIZ, retelling RAUL | retold | any | Raul's headband | "Raul's coach made them skip rope till the song ended." | DEAD |
| TB16 | CHATO (fisherman, hired) | seasoned | LAS VEGAS BAY | the key to boat nine | "I rented boats off this ramp." | |
| TB17 | PROFE (historian, hired) | veteran | any | the company book | "First page. The night at {FIRST_FIGHT}." | COUNT |
| TB18 | CHISPA (messenger, hired) | green | VALLEY OF FIRE | the courier's strap | "Thirty runs a day, and never once left the city." | |
| TB19 | DEUCE (gambler), foil BOOKIE | seasoned | RAILROAD PASS | his grandma's hat | "My grandma dealt blackjack at Railroad Pass forty years." | |
| TB20 | CHEWY (butcher) | green | MT CHARLESTON LODGE | snow on the apron | "My tia always said we'd drive up for the snow." | |

Tally: green 5, seasoned 9, veteran 4, retold 2; four wrong details of twenty (one in five: COMPANY, THING, DEAD, COUNT);
four foils; eleven of eleven starting members have one; eleven of the twenty match the teller's trade to the ground;
0 of 60 lines name a job, a price or an ask. Three tones across them (`Q114.N4`): warm (TB03, TB20), grim (TB04, TB05,
TB11), and wrong (TB07, TB13, TB15, TB17). The three hired tellers' names are drafts. Every look not already on the body
is ASSET NEEDED in the bank.

---

## 8. THE SHELF AND THE PAGES, FIXED IN PLACE

- QR-AX section 5's table row "TELLINGS ... half: a generator is owed" and its OPEN 6 ("who builds the telling
  generator") are answered by this page, marked "(QR-AY 10/19)": PEOPLE builds it on this shape.
- QR-AV section 1's Wiessner paragraph said "the daytime story share was not found"; it now carries the daytime numbers
  (6 percent stories; 34, 31 and 16 for complaints, economics and joking) and the night's 7 and 4, marked "(QR-AY
  10/19)"; its OPEN 1 is marked partly answered (the numbers are ScienceDaily's summary; the tables are still unread).
- The 27 bound tellings are left as written: a telling bound to a job is QR-AX's pick-order step 2 and stays legal; rule 2
  above caps their share. Nothing on RUN TWO's board changes (QD-AQ03's client and SKULLS are untouched), so THE BOARD'S
  QUESTS ARE PEOPLE does not move.

---

## 9. ROUTED (research only; nothing here is built by QUESTS)

- PEOPLE (chat 09; held by rule 88 for features, a bank is a page): the generator on section 5; the four fragment groups
  for the twelve starting trades first (192 fragments), then every trade a hire can roll; the line-3 coda bank by band.
- RUN TWO (the roster screen): the hat and the apron are in the data and off the screen; the roster's display names
  ("a rag hood" for 8 of 12 heads) erase the thing a telling needs. Read 'was', or name the item by its look.
- RUN and RUN TWO: a join-night on every member, and the company's record as a field (first fight's place; the dead with
  name, how and night) so NIGHTS and COMPANY can be read.
- TUNING (chat 21): rows for the one table: telling.bound_share_max 0.33, telling.wrong_share_max 0.2,
  telling.green_level_max 3, telling.veteran_level_min 9, telling.retold_after_nights 30, telling.score_ground 2,
  telling.score_thing 1, telling.score_foil 1, each beside its Battle Brothers number in section 2.
- MODS (chat 22): `telling_band` (green | seasoned | veteran | retold), `before_fragments` {who, person, place_before,
  moment} per background as a data file a modder extends, `wrong_kind`, `once_key`, `bound: true|false` on a TELLING.
- DYNASTY: an heir starts green with empty keys; a parent's telling may be retold by a living member, never by the heir.
- WORDS (held by rule 88): the twenty lines are attempts; the Spanglish is light on purpose; the hired tellers' names.
- DIRECTION and COOK THREE: ASSET NEEDED on the bank's things (the taped handle, the tag on the hat, the gate sticker on
  the door, the fuel card, the lottery ticket, the block number, the tooth on a cord, the boat key, the company book, the
  courier's strap), each a small thing on the rig body (rule 115).
- SOUNDS: a telling has no music sting; the fire's bed holds; the wrong detail has no sound cue (said plainly means no
  cue).
- PLUMBER: rules 1, 4 and 11 as a gate leg over the bank and any generator output; rules 2, 5, 8 and 9 in the
  simulated-act check of QR-AX once a picker exists.
- Lead line for WORLD (rule 113a): QUESTS made one research page and a bank of twenty tellings, NOT IN A TAB, COOKING.

---

## 10. OPEN (what this round could not answer)

1. Wiessner's tables and Smith's story-content shares are still unread: the numbers are summaries [S]. A round with the
   papers in hand should check the 81, 6 and 4 before TUNING sets rule 2's third against them.
2. Labov's reportability-credibility paper itself was not reached; the "inanimate witness" reading rests on a talk's
   abstract [S].
3. How many members reach level 9 in a hundred hours is unmeasured, so the veteran band's supply is a guess; TUNING's
   fight bench (rule 117(e)) can count it.
4. Whether a telling should leave a visible good night (Battle Brothers' mood on 37 of 44) under rule 117(c) without
   becoming a meter (QR-AV rule 11). Draft: no number; the teller walks at the front of the party marker the next day,
   which writes nothing. RUN's call.
5. Whether the retelling should be possible across acts (a member of act 1 retold in act 3 by a veteran who rode with
   him). DYNASTY, with the three acts at once.
6. The militia has no Battle Brothers scene of its own; DESI's telling is built on Disowned Noble Reminisces' shape
   (home, level 5). If Paolo wants the block militia to have its own scene kind, it is new, not translated.

---

## CITED FROM

`Q043.P3`, `Q043.W4`, `Q043.W2`, `Q043.W7`, `Q043.X4`; `Q085.W2`; `Q063.W2`; `Q066.W6`, `Q066.X1`, `Q066.X5`; `Q030.W8`;
`Q048.W5`, `Q048.X2`, `Q048.W7`, `Q048.X1`, `Q048.W6`; `Q047.X1`, `Q047.P4`; `Q055.W4`, `Q055.W9`, `Q055.X1`; `Q044.W2`,
`Q044.W7`, `Q044.W3`, `Q044.P8`, `Q044.W9`; `Q045.W8`, `Q045.W9`, `Q045.X4`; `Q118.X2`; `Q151.W9`, `Q151.X3`; `Q146.X1`,
`Q146.W5`; `Q129.X9`; `Q147.X3`, `Q147.P4`; `Q144.W7`, `Q144.X1`; `Q031.W6`; `Q010.W10`; `Q084.X6`, `Q084.X4`;
`Q061.X5`; `Q087.X3`; `Q137.W1`; `Q105.X5`; `Q114.N4`, `Q114.W3`; `Q013.W2`, `Q013.P12`, `Q013.W1`; `Q041.W10`;
`Q188.X3`; `Q006.W10`; `Q108.W1`, `Q108.X1`; `Q021.W3`; `Q065.X2`; `Q046.X1`; `Q125.P25`; `Q236.X3`.

[ah] THE ANALOG HORROR LINE for the round: the wrong detail at the fire is never a sound, never a sting, never a look
across the fire. A man says "Thirteen of us at the wash that first night" in the same voice as the other two lines, the
book in his lap says twelve, and the next morning the company marches, and nobody, including the player's own captain,
ever asks him about it.

#!/usr/bin/env python3
"""BOHEMIA BARK FACTORY -- the words the world says when nobody is questing.

TASTE CHECK:
  tools/bohemia_taste_filter.py is a pre-judge KILL pass over PIXELS: flat
  side-on, purple outside the Amalgamation, hard black outline, tan ratio,
  recolor-as-new-shape, pavement-dominant, graveyard reuse. Not one of those can
  be evaluated against a sentence, so running it here would be a checkbox, and a
  filter that cannot fail is not a filter. What IS checkable about words is
  checked instead, by a machine rather than by this comment:
    NO EM DASHES OR EN DASHES ANYWHERE (Paolo, standing, and it covers prose).
      assert_no_dashes() below refuses to write the file, and it was proven by
      planting one and watching the run die.
    NO LINE EXPLAINS THE COLLAPSE (Q056.W8 ATMOSPHERE OVER EXPOSITION). The
      complaint is the water pressure, the shift, the meter, the rent.
    NO PROPER NAMES (W8 + MECHANISM-MINE): who anybody IS stays his ruling.
    EVERY LINE CITES ITS FINDING, id and title verbatim, machine-checked by
      gates/dialogue_catalogue_gate.js.

REUSE CHECK:
  Cooks WORDS, not pixels, so no banks/ tile applies -- but the words half of
  the same law does: DIALOGUE ALWAYS REFERS TO THE CATALOGUE (Paolo 8/11).
  looked at: questbook/ -- 152 studied quests, 3,672 findings, indexed in
    records/BOHEMIA_QUESTBOOK_LAW_INDEX.json. Q043.W4 AMBIENT BANTER AS
    CHARACTERIZATION is the finding that says to build this at all. Every line
    cites the finding it came from; gates/dialogue_catalogue_gate.js checks the
    id resolves and the title is VERBATIM.
  looked at: engine/bohemia_agents.js -- the role and act words are READ OFF the
    agent sim rather than invented here, so no bucket is named something the
    world never says (which is how a full-looking table ships mute).
  looked at: engine/BOHEMIA_faction_graph.json -- the faction bucket names are
    his real factions, not a parallel list.
  used: all three.

Paolo 8/12: "cool another menu.... generate text for now with our quest catalog
we have."

FAIR. The last turn shipped controls and no content. This is content: the mouth
the PEOPLE module has had since day one, finally with something in it.

WHAT WAS EMPTY, AND WHY IT WAS THE BLANK PAGE. engine/bohemia_people.js has
carried `var LINES = {};` with a comment saying "nothing may fill it but him".
That comment is OUT OF DATE -- the 8/11 ALWAYS MAKE AN ATTEMPT ruling overturned
exactly that reading for WORDS, and his own diagnosis of the empty field was
"THATS WHY I HAVENT DONE QUESTS YET". Every person in the walked world already
has a role, a schedule, a faction and a block. They have had nothing to say for
a month.

THE CORPUS SAYS TO DO THIS FIRST, IN SO MANY WORDS.
  Q043.W4 AMBIENT BANTER AS CHARACTERIZATION -- "the cast comes alive through
    OVERHEARD relationships, not just quests -- cheap, high-impact life (a
    solo-dev-friendly technique)". The catalogue names barks as the single best
    return on effort available to a one-person team. This is that.
  Q056.W8 ATMOSPHERE OVER EXPOSITION -- oblique sayings carry a world better
    than lore-dumps. So nobody here explains the collapse. They complain about
    the water bill.
  Q001.W1 TRANSACTION-CARRIES-EMOTION -- never open with the sad story, open
    with the errand. Bohemia is an economic crash simulator, so the errand IS
    the subject: work, water, power, rent, trade, heat.
  Q025.W5 THE BANALITY OF EVIL -- the mundane administration of an unjust order
    is more unsettling than a villain. The Network's people are polite.
  Q031.W3 SCARCITY WEAPONIZES COMPASSION AGAINST YOUR OWN -- kindness to a
    stranger endangers your own, and it shows up in what people say about each
    other three houses down.

FACTORY LAW: typed spec (BUCKETS below), generator (this file), batch output
(records/BOHEMIA_BARKS.json + the LINES table), and its own gate (bark_gate.js).

MECHANISM-MINE / CONTENTS-PAOLO'S, as amended 8/11: every line here is a REAL
attempt tagged draft:true and reachable in the WORDS tab. Nothing here decides
anything -- no names, no deaths, no faction ground, no numbers.

  python3 tools/bohemia_bark_factory.py
Gate: gates/bark_gate.js
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_BARKS.json')
PEOPLE = os.path.join(ROOT, 'engine', 'bohemia_people.js')
IDX = os.path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
WORDS = os.path.join(ROOT, 'records', 'BOHEMIA_WORDS_BOOK.json')

# ---------------------------------------------------------------- citations
# Every bucket names the corpus findings it was written off. Ids resolve in
# records/BOHEMIA_QUESTBOOK_LAW_INDEX.json and the gate checks the titles are
# the corpus's own, verbatim.
CITES = {
    'banter': ('Q043.W4', 'AMBIENT BANTER AS CHARACTERIZATION',
               'the corpus names overheard, ordinary talk the cheapest and highest-impact '
               'characterisation available to a solo dev. Nobody in these lines is talking '
               'to the player; they are talking to each other and you happen to be there.'),
    'atmos':  ('Q056.W8', 'ATMOSPHERE OVER EXPOSITION (vibes + prose + music)',
               'oblique sayings carry a world better than lore-dumps, so not one line here '
               'explains the collapse. They complain about the water pressure.'),
    'errand': ('Q001.W1', 'TRANSACTION-CARRIES-EMOTION',
               'open with the errand and let the weight arrive underneath. Bohemia is an '
               'economic crash simulator, so the errand IS the subject: work, water, power, '
               'rent, trade, heat.'),
    'banal':  ('Q025.W5', 'THE BANALITY OF EVIL',
               'the mundane administration of an unjust order is more unsettling than a '
               'villain with a speech. The people running the worst arrangements in this '
               'valley are unfailingly polite about it.'),
    'scarce': ('Q031.W3', 'SCARCITY WEAPONIZES COMPASSION AGAINST YOUR OWN',
               'mercy to a stranger endangers your own, and that vise shows up in how '
               'people talk about the house three doors down.'),
    'tell':   ('Q009.P2', 'W1 (uncanny behavioral tell',
               'seed the dread in BEHAVIOUR before any reveal -- people who never disagree, '
               'who repeat a phrase, whose grief is smoothed.'),
    'haunt':  ('Q010.W9', 'THE HAUNTED SPACE',
               'the space tells its own story without exposition. What people say about a '
               'block does the same job as what is drawn on it.'),
    'hind':   ('Q010.W8', 'FORESHADOW-IN-HINDSIGHT',
               'a line that only lands later. Half the small talk in a collapsed city is '
               'somebody being wrong about how long this lasts.'),
}

# --------------------------------------------------------------- the barks
# key -> (citation keys, [lines])
# role:act keys match engine/bohemia_agents.js exactly -- roles worker/scav/
# keeper/watch, acts sleep/home/work/free/scav/errand/watch. Nothing invented.
BUCKETS = {
 'worker:work': (['errand', 'banter'], [
    "Third shift this week and the meter still reads the same.",
    "If it runs, it runs. Nobody's paying me to make it pretty.",
    "Hold that. No, HOLD it.",
    "They want it done by dark. Dark's in an hour.",
    "Whoever wired this was in a hurry or a mood.",
    "I'll trade you an hour. I'm not trading two.",
    "Every job in this valley is somebody's old job done worse.",
    "Careful. That's live and it lies about it.",
 ]),
 'worker:home': (['banter', 'scarce'], [
    "Shoes off. I just swept.",
    "We're one bad week from asking my brother for help and I'd rather not.",
    "Did you eat? Don't lie to me.",
    "Leave the door. It's cooler with it open and nobody's coming down here.",
    "I'm not going back tomorrow if they're short again.",
    "Save that. It's still good if you cut the ends off.",
 ]),
 'worker:free': (['banter', 'hind'], [
    "Give it two years. Somebody'll turn the rest of the lights back on.",
    "You remember when this block had two working streetlights? Two.",
    "I'm not saying he stole it. I'm saying he has it.",
    "Sit down, you're making me tired.",
    "That's not a rumour, that's my cousin.",
    "Whole valley's held together with hose clamps and stubbornness.",
 ]),
 'worker:errand': (['errand'], [
    "Four stops and I've done one.",
    "If they're closed I'm not coming back tomorrow.",
    "She said noon. It has been noon for a while.",
    "I'll pay in work. I always pay in work.",
    "Half of getting anything here is knowing which door.",
 ]),
 'worker:sleep': (['atmos'], [
    "...",
    "Turn that off.",
    "Five more minutes and I mean it.",
 ]),
 'worker:scav': (['errand', 'scarce'], [
    "Copper's gone. Everything's gone but the heavy stuff.",
    "Somebody beat us here by about a year.",
    "Take the hinges. People always forget hinges.",
 ]),
 'worker:watch': (['banal'], [
    "Nothing yet. Which is the job.",
    "I count six lit windows from here. Same six as last night.",
 ]),

 'scav:scav': (['errand', 'haunt'], [
    "Anything with a serial number on it, somebody wants.",
    "Don't go in past the second room. Floor's a suggestion.",
    "Whole street's picked. We're late by a decade.",
    "Wire, glass, anything that holds water. That's the list.",
    "You smell that? Then we're not going in.",
    "Third house today with the beds still made.",
    "Take the small stuff first. Small stuff walks.",
    "If it was worth taking it's already taken. So look for what nobody wanted yet.",
 ]),
 'scav:free': (['banter'], [
    "I got two batteries and a story.",
    "Trade you. Don't ask what for.",
    "I found a whole box of forks. FORKS.",
    "Everything out there's either bolted down or already somebody's.",
 ]),
 'scav:home': (['scarce'], [
    "It's not much. It's what there was.",
    "Don't tell your mother where I got it.",
    "I'll go further out tomorrow. It's fine.",
 ]),
 'scav:work': (['errand'], [
    "Sorting's the job. Anybody can pick things up.",
    "That pile's mine, that pile's the block's. Don't mix them.",
 ]),
 'scav:errand': (['errand'], [
    "Dropping this off then I'm done, I mean it.",
    "They asked for glass. I brought glass.",
 ]),
 'scav:sleep': (['atmos'], [
    "...",
    "Wake me if the dogs start.",
 ]),
 'scav:watch': (['banal'], [
    "I'm better at finding than watching.",
    "Anything moves out there, it's a bag in the wind.",
 ]),

 'keeper:home': (['banter', 'scarce'], [
    "Wipe your feet, this is somebody's house.",
    "I keep a list. Everybody on this block is on the list.",
    "You eat here you help here, that's it, that's the whole rule.",
    "If it leaks, tell me. Don't fix it, tell me.",
    "There's water till Thursday. After Thursday there's a conversation.",
    "I know who's short and I know who's lying about being short.",
 ]),
 'keeper:work': (['banal', 'errand'], [
    "Count it in front of me, not after.",
    "One family, one share. I don't care how loud you are.",
    "The book says what the book says.",
    "You want more, bring more. That's not cruelty, that's arithmetic.",
    "I'll hear it, but I'll hear it after.",
 ]),
 'keeper:free': (['banter'], [
    "Sit. You look like a man about to ask me for something.",
    "It ran better when fewer people knew it existed.",
    "Everybody's a good neighbour on a full stomach.",
 ]),
 'keeper:errand': (['errand'], [
    "Two blocks, three promises, one of them's real.",
    "If I'm not back by dark, the list is on the table.",
 ]),
 'keeper:sleep': (['atmos'], [
    "...",
    "It'll keep till morning. Everything keeps till morning.",
 ]),
 'keeper:scav': (['scarce'], [
    "I don't like doing this. I like eating.",
 ]),
 'keeper:watch': (['banal'], [
    "I'd rather be the one awake than the one wondering.",
    "Nothing gets past this porch without saying hello.",
 ]),

 'watch:watch': (['banal', 'atmos'], [
    "State your business or state nothing and keep walking.",
    "It's quiet. Quiet's got a sound and this isn't it.",
    "Two hours to go and then it's somebody else's dark.",
    "You see a light where there wasn't one, you say so.",
    "Nobody comes up this street who doesn't live on it.",
    "Cold out. Been colder.",
    "I'm not stopping you. I'm looking at you.",
    "Whistle if you're one of ours. Everybody knows the whistle.",
 ]),
 'watch:home': (['banter'], [
    "I sleep days. Try to remember that.",
    "Nothing happened, which is the best sentence I know.",
 ]),
 'watch:free': (['banter', 'hind'], [
    "Third night in a row somebody's been on that roof.",
    "One of these years it'll be safe enough to be bored.",
    "You want the shift? Take the shift. I'm not proud.",
 ]),
 'watch:work': (['banal'], [
    "Same post, same window, same six lights.",
    "I write it down. Somebody eventually reads it.",
 ]),
 'watch:errand': (['errand'], [
    "Fast in, fast out. I'm expected somewhere.",
 ]),
 'watch:sleep': (['atmos'], [
    "...",
    "I hear everything, so it had better be worth it.",
 ]),
 'watch:scav': (['scarce'], [
    "Off shift I take what everybody takes.",
 ]),

 # ---- FACTION COLOUR. Who somebody runs with changes the same errand's tone.
 'faction:Reds': (['errand', 'banal'], [
    "Everything's a loan. The only question is who's holding it.",
    "I'll front you. You'll pay it back with interest and a smile.",
    "Ten percent isn't greed, it's the reason there's anything to lend.",
    "We keep the books because somebody has to keep the books.",
 ]),
 'faction:Blues': (['banter', 'scarce'], [
    "We voted. You weren't there, and it still counts.",
    "The well is everybody's or it's nobody's, pick.",
    "Slow's not the same as wrong.",
    "Plant it now and somebody eats in ninety days. That's the whole argument.",
 ]),
 'faction:Anarchists': (['banter'], [
    "Nobody's in charge here and that's on purpose.",
    "You need a permit? From who? Say the name out loud.",
    "We fixed it ourselves and we'll fix it again.",
 ]),
 'faction:Church': (['atmos', 'banal'], [
    "Doors are open. They're always open, that's the point.",
    "Come eat. Sit through the words first if you can stand them.",
    "Nobody's turned away. Nobody's turned away twice, either.",
 ]),
 'faction:Network': (['tell', 'banal'], [
    "It's already handled. It was handled before you asked.",
    "Everything works here. You noticed that.",
    "We don't disagree about it. There's nothing to disagree about.",
    "The lights stay on. That's all anybody actually wants.",
 ]),
 'faction:Trades': (['errand'], [
    "I can fix it. I can't fix it for free.",
    "Bring the part or bring the hours, either way it's the same to me.",
    "Whoever built this knew what they were doing. Whoever touched it after didn't.",
 ]),
 'faction:Caravans': (['errand', 'hind'], [
    "Six days out, six days back, and the road changes both times.",
    "Prices are what the road says they are.",
    "There's a town north that still has a working sign. A SIGN.",
 ]),
 'faction:Volunteers': (['scarce'], [
    "You're bleeding. Sit down, we'll argue about it after.",
    "We don't ask who you run with. We ask where it hurts.",
 ]),
 'faction:Remnants': (['haunt', 'hind'], [
    "This was a real city. I don't mean big. I mean real.",
    "We kept the records. Somebody's going to want them.",
 ]),
 'faction:Cartel': (['banal'], [
    "You want it, there's a price. You don't want it, walk on.",
    "Nobody made you come down here.",
 ]),
 'faction:Mob': (['banal', 'banter'], [
    "The house always has a floor and you're standing on it.",
    "Talk to me like I'm the last friendly face and you'll do fine.",
 ]),
 'faction:Homeless': (['scarce', 'atmos'], [
    "Got a spot out of the sun if you need one. Costs nothing.",
    "Everybody here's from somewhere. Ask sometime.",
 ]),
 'faction:Pures': (['tell'], [
    "We keep to what we know. It's kept us this long.",
 ]),
 'faction:Panthers': (['banter'], [
    "This block looks after this block.",
 ]),
 'faction:La Familia': (['scarce'], [
    "Family eats first. Everybody's family somewhere.",
 ]),
 'faction:Triads': (['banal'], [
    "Terms first. Then the handshake.",
 ]),
 'faction:Colorful': (['banter'], [
    "You should have seen this place at night. You still should.",
 ]),

 # ---- SITUATIONAL. What the world already tracks, finally spoken.
 'when:seen': (['banter'], [
    "Don't know you.",
    "You're the one from the other block.",
    "Long as you're not taking anything.",
    "Morning. Or whatever it is.",
    "Keep walking, no offence.",
    "You looking for somebody?",
 ]),
 'when:night': (['atmos', 'haunt'], [
    "Twelve blocks and you can count the lit ones.",
    "Whatever's out there tonight can stay out there.",
    "Dark's the only thing that's free.",
    "You can hear the freeway when it's this quiet. Nothing on it, but you can hear it.",
 ]),
 'when:brownout': (['errand', 'atmos'], [
    "There it goes. Same hour as always.",
    "Half light's worse than none. Makes you think it's coming back.",
    "Somebody upstream is drinking before we do.",
 ]),
 'when:heat': (['atmos'], [
    "Hundred and ten in the shade and there is no shade.",
    "Don't move till four. Nothing's worth it till four.",
    "Drink before you're thirsty. After's too late out here.",
 ]),
 'when:hungry': (['scarce'], [
    "I'm fine. I ate yesterday.",
    "Half now, half tomorrow. That's how you make it two days.",
 ]),
 'when:market': (['errand', 'banter'], [
    "Say a number. Any number. We'll meet somewhere sad in the middle.",
    "That's not what it was worth last week.",
    "Cash, work, or water. Pick one.",
    "You touch it, you've bought it, that's the rule.",
 ]),
 'when:after_trouble': (['scarce', 'atmos'], [
    "Everybody's accounted for. Everybody on this block.",
    "Board it tonight, fix it properly when it's light.",
    "Nobody's saying anything and everybody's saying it loud.",
 ]),
 'when:rain': (['atmos', 'hind'], [
    "Put out everything that holds water. Everything.",
    "First rain since spring and half of it's on the roof, not in the barrel.",
 ]),
}

# ---- SECOND BATCH (8/12, same turn). 162 lines is a sample, not a world. A
# person you walk past three times should not repeat inside ten minutes, and the
# corpus is explicit that this is where a solo dev's effort pays best. Same
# buckets, more depth, plus the situations the sim already tracks and had no
# words for.
MORE = {
 'worker:work': [
    "Two of us doing four people's day and they call that lean.",
    "Don't help. Seriously. You'll help it into the ground.",
    "It held all winter. It'll hold.",
    "Tell them it's done when it's done.",
 ],
 'worker:home': [
    "The tap's brown again. Let it run, it clears.",
    "I'm not asking them for anything. I'd rather be cold.",
    "Sit with me a minute. Just a minute.",
 ],
 'worker:free': [
    "Somebody's kid is on the roof again.",
    "You hear they've got a generator two streets over? Allegedly.",
    "I'd move if there was anywhere that isn't this.",
    "Twelve years I've walked this street and it's never been this quiet at noon.",
 ],
 'worker:errand': [
    "Tell her I came by. Tell her I came by TWICE.",
    "I'm not arguing, I'm explaining loudly.",
 ],
 'worker:scav': [
    "Everything decent's behind a door somebody welded.",
    "One good find pays a week. One.",
 ],
 'worker:watch': [
    "Anything happens, I'm the one who yells. That's the plan.",
    "Two of us and eleven houses. You do the maths.",
 ],
 'worker:sleep': ["Let me sleep or let me work, not both."],
 'scav:scav': [
    "Anything that used to plug into something, bring it.",
    "That's a load-bearing nothing. Don't lean.",
    "Been in here before. Somebody moved the chairs.",
    "Leave the photos. I know, I know. Just leave them.",
 ],
 'scav:free': [
    "I'd trade the whole bag for a working fridge and I mean it.",
    "You want to know what's out there? Sand and other people's kitchens.",
 ],
 'scav:home': [
    "I'll clean it. It works, it's just ugly.",
    "Nothing today. There's always tomorrow, there's just not always today.",
 ],
 'scav:work': ["Anything shiny goes in the middle pile, I'll look at it after."],
 'scav:errand': ["Two more streets and then I'm somebody's problem, not mine."],
 'keeper:home': [
    "You're welcome here. You're not welcome to everything here.",
    "Take your shoes off and take your side of it off too.",
 ],
 'keeper:work': [
    "I'll write you down for Thursday. Don't make me chase you Thursday.",
    "Everybody thinks they're the exception. Nobody's the exception.",
    "It's not mine. I just hold the key to it.",
 ],
 'keeper:free': [
    "Ask me tomorrow when I'm not counting.",
    "I've buried people who were owed more than you.",
 ],
 'keeper:errand': ["I'm collecting, not visiting. Don't put the kettle on."],
 'watch:watch': [
    "Every hour I don't see anything is an hour that worked.",
    "Somebody's been standing at that corner for twenty minutes.",
    "Go home. I'm not asking twice and I'm not asking rudely.",
    "You get used to the dark. You never get used to the waiting.",
 ],
 'watch:free': ["I sleep with the window open. Habit."],
 'watch:home': ["Don't ask. It was fine. It's always fine until it isn't."],
 'faction:Reds': ["Everybody says they hate the ledger till they need the ledger."],
 'faction:Blues': ["Nobody starves on my watch and nobody eats twice either."],
 'faction:Anarchists': ["We're not disorganised. We're just not YOURS."],
 'faction:Church': ["Bring who you like. Bring who you don't like, especially."],
 'faction:Network': [
    "You'll find it's simpler than you were expecting.",
    "Nobody complains here. Ask around.",
 ],
 'faction:Trades': ["Everything in this valley was built by somebody who's still alive."],
 'faction:Caravans': ["Two weeks of road and the best thing I saw was a bird."],
 'faction:Volunteers': ["We're out of almost everything except being here."],
 'faction:Remnants': ["Somebody has to remember what the street names were."],
 'faction:Cartel': ["Everything's available. Availability isn't the expensive part."],
 'faction:Mob': ["I've known this block since before it was worth knowing."],
 'faction:Homeless': ["I've slept in better and I've slept in worse and I'm still here."],
 'when:seen': [
    "New face. Huh.",
    "Whatever you're selling, walk slower.",
    "You're not from three blocks up, are you.",
 ],
 'when:night': [
    "Nobody patrols the dark. That's not a rule, it's just true.",
    "See a light move where nothing should be? Say nothing and walk faster.",
 ],
 'when:brownout': [
    "Half the block, same as Tuesday.",
    "It's not broken. Somebody's just using more of it than us.",
 ],
 'when:heat': [
    "You can hear the road ticking.",
    "This used to be the fun kind of hot.",
 ],
 'when:hungry': ["I'm saving it. Don't look at me like that."],
 'when:market': [
    "For that? For THAT?",
    "Everybody's an honest trader till the second offer.",
    "I'll take it for what it's worth to me, not what it's worth to you.",
 ],
 'when:after_trouble': [
    "Count the doors. Then count the people.",
    "Whatever you saw, you saw it with us.",
 ],
 'when:rain': ["Kids are out in it. Let them be out in it."],
 # ---- situations the sim already knows about and had no words for
 'when:met_before': [
    "You again. That's not a complaint.",
    "Still walking, then.",
    "I remember you. That's rarer than it sounds.",
 ],
 'when:owed': [
    "You know what you owe me.",
    "I'm not going to bring it up. I'm just going to look at you.",
 ],
 'when:favour': [
    "I'll not forget it. That's worth more here than it used to be.",
    "You did right by me. Say the word sometime.",
 ],
 'when:stranger_block': [
    "This isn't your street.",
    "Ask before you take anything on this block. Ask ME.",
 ],
 'when:work_short': [
    "We're two short today and nobody's saying why.",
    "If they don't show tomorrow I'm putting somebody else on it.",
 ],
}
for k, extra in MORE.items():
    if k in BUCKETS:
        BUCKETS[k][1].extend(extra)
    else:
        BUCKETS[k] = (['banter'], list(extra))


# =========================================================================
# THEY SPEAK SPANGLISH (Paolo 8/25/26, LOCKED) -- THE REGISTER BUCKETS
# =========================================================================
# "make them speak spanglish for our game i like that. have it very poor
# english ro spanglish to give it that flavor ty"
# laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md
#
# Every bucket above has, where a register was written for it, a twin keyed
# `<bucket>@spanglish` and `<bucket>@es`. engine/bohemia_people.js's linesFor
# asks for the twin first and falls back to the plain bucket, so THE FAILURE
# MODE OF A MISSING REGISTER IS ENGLISH, NEVER SILENCE.
#
# THE CRAFT RULES, FROM THE LAW, AND THEY ARE THE WHOLE JOB:
#   SWITCH AT THE JOINT. Switches land at clause and phrase boundaries where
#     both grammars agree (Poplack's equivalence constraint, contested in its
#     universality and useful in its direction). Chopping a phrase in half
#     reads as somebody who has never heard it.
#   SWITCH FOR A REASON. Emotion, family, food, insults, prayer, numbers, and
#     anything with no clean English word. A random switch is the tell.
#   NEVER PHONETIC SPELLING OF AN ACCENT. No "joo" for "you". That is not a
#     register, it is a cartoon, and it is the most common way this goes wrong
#     in a shipped game.
#   REGISTER 3 IS GRAMMAR, NOT VOCABULARY. Dropped articles, dropped
#     auxiliaries, short clauses, words arriving out of order. It is never a
#     misspelling, and it belongs to SOME people, never all of them.
#   THE MEANING SURVIVES THE SPANISH. Nothing in an ambient bark is required
#     information (Q056.W8: nobody here explains the collapse), and every
#     Spanish word ships with an English gloss in ES_GLOSS below.
#
# REGISTER 2 IS A SKILL AND REGISTER 3 IS A GAP. The person saying "y el
# medidor still reads the same" is doing something harder than the person
# saying it in one language, and the lines are written like it.

# ---- THE CLOSED LEXICON: every Spanish word this game may say, and what it
# means. It is not a nice-to-have list; it is the machine half of the hard
# rule. Because the set is CLOSED and DECLARED, gates/language_gate.js can
# sweep every objective, resolution button and job offer in the build and
# prove not one of them contains a word from it. A promise cannot be checked;
# a closed set can. Ships into engine/bohemia_people.js as ES_LEX.
ES_GLOSS = {
    'abuela': 'grandmother', 'agua': 'water', 'ahorita': 'right now, or soon, or never',
    'amá': 'mom', 'apurado': 'in a hurry', 'aquí': 'here', 'así': 'like that',
    'ay': 'oh', 'ayúdame': 'help me', 'bendito': 'blessed',
    'bueno': 'well, or good', 'cabrón': 'bastard', 'calor': 'heat',
    'carnal': 'brother, close friend', 'chamba': 'work, a job', 'chingado': 'damn',
    'claro': 'of course', 'cobre': 'copper', 'comadre': 'a close woman friend, godmother to your kids',
    'cómo': 'how', 'compa': 'buddy', 'con': 'with', 'cuidado': 'careful',
    'de': 'of', 'dios': 'god', 'dinero': 'money', 'el': 'the', 'ella': 'she',
    'está': 'is', 'están': 'they are', 'familia': 'family', 'flojo': 'loose, slack',
    'frío': 'cold', 'gracias': 'thank you', 'güey': 'dude', 'hambre': 'hunger',
    'hermano': 'brother', 'hija': 'daughter', 'hijo': 'son', 'hombre': 'man',
    'la': 'the', 'llave': 'the tap, the faucet', 'lluvia': 'rain', 'los': 'the',
    'luz': 'the light, the power', 'madre': 'mother', 'mano': 'brother, short for hermano',
    'me': 'me', 'medidor': 'the meter', 'mija': 'my daughter, said to anyone younger',
    'mijo': 'my son, said to anyone younger', 'mira': 'look',
    'nada': 'nothing', 'nadie': 'nobody', 'no': 'no', 'noche': 'night',
    'nomás': 'just, only', 'nosotros': 'us', 'oye': 'hey, listen',
    'paga': 'pays', 'para': 'for', 'pero': 'but', 'poco': 'a little',
    'por': 'for', 'porque': 'because', 'primo': 'cousin', 'pues': 'well',
    'que': 'that', 'qué': 'what', 'sí': 'yes', 'siempre': 'always',
    'sol': 'the sun', 'son': 'they are', 'tarde': 'late, or the afternoon',
    'tía': 'aunt', 'tío': 'uncle', 'todo': 'everything', 'todos': 'everybody',
    'ven': 'come', 'viejo': 'old man', 'y': 'and', 'ya': 'already, or enough',
    # ---- and the rest of what the lines below actually say. THIS TABLE IS NOT
    # DECORATION: it is the closed set language_gate sweeps the objectives
    # against, so a word missing from here is a hole in the hard rule, and the
    # factory refuses to write until every one of them is in it.
    'acuerdo': 'I remember, in "me acuerdo"', 'al': 'to the', 'alguien': 'somebody',
    'alguna': 'some', 'ambos': 'both', 'antes': 'before', 'apaga': 'turn it off',
    'bien': 'fine, well', 'buscas': 'are you looking for', 'calle': 'street',
    'camino': 'the road', 'casi': 'almost', 'cerrado': 'closed', 'ciento': 'a hundred',
    'cierra': 'close', 'cinco': 'five', 'comer': 'to eat', 'comida': 'the food',
    'compraron': 'they bought', 'conozco': 'I know', 'cualquier': 'any',
    'cuenta': 'count', 'da': 'gives, in "me da igual"', 'demás': 'the rest',
    'después': 'after, afterwards', 'diciendo': 'saying', 'diez': 'ten',
    'dos': 'two', 'día': 'day', 'en': 'in, on', 'entres': 'go in',
    'es': 'is', 'esa': 'that', 'eso': 'that', 'esquina': 'the corner',
    'esta': 'this', 'estoy': 'I am', 'foto': 'a photo', 'funciona': 'it works',
    'gusta': 'like, in "no me gusta"', 'hace': 'makes', 'hasta': 'until',
    'hay': 'there is', 'hora': 'the hour', 'igual': 'the same',
    'ironía': 'irony', 'las': 'the', 'llegamos': 'we arrived', 'lo': 'the, it',
    'martes': 'Tuesday', 'mañana': 'tomorrow, or the morning', 'mi': 'my',
    'mientas': 'lie to me, in "no me mientas"', 'mires': 'look, in "no me mires"',
    'misma': 'same', 'mismas': 'same', 'niños': 'the kids', 'nos': 'us',
    'o': 'or', 'ocho': 'eight', 'ofender': 'to offend', 'ojalá': 'God willing, hopefully',
    'olvida': 'forget', 'oscuridad': 'the dark', 'otra': 'other, another',
    'pasada': 'last, past', 'peor': 'the worst', 'precio': 'a price',
    'pregunta': 'ask', 'pregúntame': 'ask me', 'puede': 'can', 'puedo': 'I can',
    'puerta': 'the door', 'puertas': 'the doors', 'pájaro': 'a bird',
    'quedarse': 'to stay', 'rato': 'a while', 'regla': 'a rule',
    'revés': 'backwards, in "al revés"', 'sabes': 'you know', 'sabrás': 'you will know',
    'saca': 'put out, take out', 'se': 'itself, in "no se me olvida"',
    'sea': 'whatever it is, in "lo que sea"', 'segunda': 'second', 'seis': 'six',
    'semana': 'the week', 'serio': 'serious, in "en serio"', 'si': 'if',
    'sin': 'without', 'siéntate': 'sit down', 'tampoco': 'either, neither',
    'te': 'you', 'ti': 'you', 'toca': 'is my turn, in "me toca"',
    'trabajo': 'I work, or work', 'traigo': 'I bring', 'tu': 'your',
    'turno': 'the shift', 'tú': 'you', 'una': 'a, one', 'vamos': 'we go, let us go',
    'vez': 'a time, once', 'voy': 'I am going', 'vuelvo': 'I come back', 'yo': 'I',
    # ---- and what the QUIRK lines say (8/25). ONE LEXICON, TWO MOUTHS: the
    # quirk factory imports this table and refuses to write a word that is not
    # in it, so the sweep that proves the hard rule can never have a hole the
    # size of the most personal line in the game.
    'allí': 'there', 'comiste': 'did you eat', 'contando': 'counting',
    'cuarenta': 'forty', 'digas': 'tell, in "no me digas"', 'digo': 'I say',
    'dijeron': 'they said', 'doy': 'I give', 'empiezo': 'I start',
    'entero': 'whole', 'entonces': 'then', 'equivoco': 'get it wrong',
    'espérate': 'hold on', 'estado': 'been', 'esto': 'this', 'feo': 'ugly, bad',
    'invierno': 'winter', 'mamá': 'mom', 'nuevo': 'new, in "de nuevo", again',
    'nunca': 'never', 'oigo': 'I hear', 'pensé': 'I thought', 'perdón': 'sorry',
    'preguntes': 'ask, in "no preguntes"', 'primero': 'first', 'puso': 'it turned',
    'quién': 'who', 'sigue': 'keep going', 'sé': 'I know', 'también': 'also',
    'tengo': 'I have', 'todavía': 'still', 'tuyo': 'yours', 'vendo': 'I sell',
    'ándale': 'go on', 'único': 'the only one',
}

# ---- CITATIONS FOR THE REGISTER WORK. Ids resolve, titles verbatim.
CITES.update({
    'voice':  ('Q036.W1', 'A VOICE AS A WHOLE CHARACTER',
               'the corpus says a way of speaking can carry a whole character on its own, '
               'which is the entire bet of this ruling: nobody here gets a backstory, they '
               'get a register, and the register does the work a backstory would.'),
    'reg':    ('Q129.W6', 'THE REGISTER OF THE AFTERMATH IS MILD',
               'the corpus watched a world keep its voice ordinary through catastrophe. '
               'Switching languages mid sentence is the most ordinary thing in Las Vegas '
               'and it is written here as ordinary, never as an event.'),
    'comm':   ('Q030.W8', 'COMMUNITY AS A SURVIVAL RESOURCE',
               'the street channel is not a downgrade from the official one. For the people '
               'inside it, it is faster and more trusted, and these lines are that channel '
               'talking: the neighbour who never answers the phone feed already knew.'),
    'fam':    ('Q075.W4', 'THE FAMILY IS THE POINT',
               'family is the single most reliable trigger for a switch in the real '
               'research, so where a line reaches for a mother, a cousin or a kid, that is '
               'where the language turns over.'),
    'retell': ('Q045.W8', 'THE RETELLING CULTURE',
               'what a block knows, it knows because somebody told somebody. These are the '
               'lines that carry a rumour one door further.'),
})

# ---- THE REGISTER LINES ---------------------------------------------------
# key -> (citation keys, [lines]). Keys are `<bucket>@spanglish` / `<bucket>@es`.
REG = {
 # ============================== WORKER =====================================
 'worker:work@spanglish': (['errand', 'voice'], [
    "Third shift this week y el medidor still reads the same.",
    "If it runs, it runs. Nadie me paga to make it pretty.",
    "Hold that. No. HOLD it, hombre.",
    "They want it done by dark, y ya son las cinco.",
    "Whoever wired this was apurado or in a mood.",
    "I'll trade you an hour. Two, no.",
    "Cuidado, that's live and it lies about it.",
    "Every job in this valley is somebody's old job done worse. Pero it pays.",
 ]),
 'worker:work@es': (['errand', 'reg'], [
    "Meter say the same. Every week the same.",
    "It works. Is not pretty. Nobody pay me for pretty.",
    "Hold. No. Hold.",
    "They want by dark. Dark is one hour.",
    "Careful. Is live. It lie about it.",
    "I give you one hour. Not two.",
 ]),
 'worker:home@spanglish': (['fam', 'voice'], [
    "Shoes off, mija, I just swept.",
    "We're one bad week from asking mi hermano for help and I'd rather not.",
    "Did you eat? Y no me mientas.",
    "Leave the door. It's cooler open y nobody's coming down here.",
    "Save that. Still good if you cut the ends off.",
    "Siéntate. You've been on your feet since six.",
 ]),
 'worker:home@es': (['fam', 'reg'], [
    "Shoes. I sweep already.",
    "You eat today? Say true.",
    "Leave door open. Is cooler.",
    "Save this one. Cut the end, is still good.",
    "Sit. You work since morning.",
 ]),
 'worker:free@spanglish': (['banter', 'hind'], [
    "Give it two years. Somebody'll turn the rest of the lights back on. Ojalá.",
    "You remember when this block had two working streetlights? Dos.",
    "I'm not saying he stole it. Estoy diciendo he has it.",
    "Siéntate, you're making me tired.",
    "That's not a rumour, that's mi primo.",
    "Whole valley's held together con hose clamps and stubbornness.",
 ]),
 'worker:free@es': (['banter', 'reg'], [
    "Two years maybe. Then lights come back. Maybe.",
    "Before, this block have two lights. Two.",
    "I not say he steal it. I say he have it.",
    "Sit down. You make me tired.",
    "Is not rumour. Is my cousin.",
 ]),
 'worker:errand@spanglish': (['errand'], [
    "Four stops y I've done one.",
    "If they're closed no vuelvo mañana.",
    "She said noon. It has been noon por un rato.",
    "I'll pay in work. Siempre pay in work.",
    "Half of getting anything here is knowing which door. La otra half is knowing who.",
 ]),
 'worker:errand@es': (['errand', 'reg'], [
    "Four stop. I do one.",
    "If close, I not come back tomorrow.",
    "She say noon. Is long time noon.",
    "I pay with work. Always work.",
 ]),
 'worker:sleep@spanglish': (['atmos'], [
    "...",
    "Apaga eso.",
    "Five more minutes y ya.",
 ]),
 'worker:sleep@es': (['atmos'], [
    "...",
    "Off. Please.",
    "Five minute. No more.",
 ]),
 'worker:scav@spanglish': (['errand', 'scarce'], [
    "El cobre's gone. Everything's gone but the heavy stuff.",
    "Somebody beat us here by about a year, güey.",
    "Take the hinges. People always forget hinges.",
 ]),
 'worker:scav@es': (['errand', 'reg'], [
    "Copper is gone. Only heavy thing stay.",
    "Somebody come here before. One year before.",
    "Take the hinge. Everybody forget the hinge.",
 ]),
 'worker:watch@spanglish': (['banal'], [
    "Nothing yet. Which is the job.",
    "Six lit windows from here. Las mismas seis as last night.",
 ]),
 'worker:watch@es': (['banal', 'reg'], [
    "Nothing. Is the job.",
    "Six window with light. Same six like last night.",
 ]),

 # =============================== SCAV ======================================
 'scav:scav@spanglish': (['errand', 'haunt'], [
    "Anything with a serial number on it, somebody wants.",
    "No entres past the second room. Floor's a suggestion.",
    "Whole street's picked. Llegamos late by a decade.",
    "Wire, glass, anything that holds agua. That's the list.",
    "You smell that? Then we're not going in.",
    "Third house today with the beds still made. No me gusta.",
    "Take the small stuff first. Small stuff walks.",
 ]),
 'scav:scav@es': (['errand', 'reg'], [
    "Serial number, somebody want it. Always.",
    "Not go past second room. The floor is bad.",
    "Street is empty already. We come ten year late.",
    "Wire. Glass. Thing that hold water. Is all.",
    "You smell? Then no. We not go in.",
    "Three house today, the bed still made.",
 ]),
 'scav:errand@spanglish': (['errand'], [
    "Two more doors y nos vamos.",
    "He said he'd be here. Pues, he said.",
    "I'm not carrying that. Tú carry that.",
 ]),
 'scav:errand@es': (['errand', 'reg'], [
    "Two more door. Then we go.",
    "He say he come. He say.",
    "I not carry this. You carry.",
 ]),
 'scav:free@spanglish': (['banter', 'retell'], [
    "Best thing I ever pulled out of a house? Una foto. Kept it.",
    "You go where nobody's hungry enough to have gone yet.",
    "My tío did this before the crash and called it a job.",
    "Everything worth having is behind something heavy.",
    "Ask me in a year if it's still worth it. Pregúntame in a year.",
 ]),
 'scav:free@es': (['banter', 'reg'], [
    "Best thing I find? A photo. I keep it.",
    "You go where nobody go yet. Is all.",
    "My uncle do this before. He call it a job.",
    "Everything good is behind something heavy.",
 ]),
 'scav:home@spanglish': (['fam', 'scarce'], [
    "Don't ask where it came from, mijo. Eat.",
    "I brought back nada today and I'm telling you first.",
    "Wash your hands. En serio, wash them.",
    "Put it under the bed con lo demás.",
 ]),
 'scav:home@es': (['fam', 'reg'], [
    "No ask where. Only eat.",
    "Today nothing. I tell you first.",
    "Wash the hand. Really wash.",
    "Put under bed, with the other.",
 ]),
 'scav:sleep@spanglish': (['atmos'], ["...", "Ya. Mañana."]),
 'scav:sleep@es': (['atmos'], ["...", "Enough. Tomorrow."]),
 'scav:watch@spanglish': (['banal'], [
    "I watch the street porque nobody else does.",
    "Two people out. Ambos I know.",
 ]),
 'scav:watch@es': (['banal', 'reg'], [
    "I watch. Nobody else watch.",
    "Two people. I know both.",
 ]),
 'scav:work@spanglish': (['errand'], [
    "It's work if somebody pays. Si no, it's Tuesday.",
    "Hands, not machines. Nothing here runs anyway.",
 ]),
 'scav:work@es': (['errand', 'reg'], [
    "If they pay, is work. If no, is Tuesday.",
    "Only hand. No machine. Machine not work here.",
 ]),

 # ============================== KEEPER =====================================
 'keeper:work@spanglish': (['errand', 'banal'], [
    "Everything on this shelf has a price y a story, and only one is free.",
    "You want it now or you want it cheap? No los dos.",
    "I open when I open. Ask the block, todos know.",
    "Count it in front of me. Por favor.",
    "That's the last one till the road opens.",
    "Traigo lo que puedo. What I can't, somebody else brings.",
 ]),
 'keeper:work@es': (['errand', 'reg'], [
    "Everything have price. And a story. Only one is free.",
    "Now, or cheap. Not both.",
    "I open when I open. Ask anybody.",
    "Count in front of me. Please.",
    "Is the last one. Until road open.",
 ]),
 'keeper:home@spanglish': (['fam'], [
    "I fed half the block today y I still have to feed you.",
    "Sit down. La comida's not going anywhere.",
    "Nobody in this house goes to sleep con hambre, that's it, that's the rule.",
    "Your abuela did it this way and she was right.",
 ]),
 'keeper:home@es': (['fam', 'reg'], [
    "I feed the block today. Now I feed you.",
    "Sit. The food not go anywhere.",
    "In this house nobody sleep hungry. Is the rule.",
    "My mother do it this way. She is right.",
 ]),
 'keeper:free@spanglish': (['banter', 'retell'], [
    "I hear everything and I repeat casi nothing.",
    "Everybody on this block owes everybody. Así funciona.",
    "You want to know who's short this week? Ask me qué compraron.",
    "I'm not gossiping, I'm keeping track.",
    "Twenty years en la misma esquina. You learn things.",
 ]),
 'keeper:free@es': (['banter', 'reg'], [
    "I hear all. I repeat almost nothing.",
    "Here everybody owe everybody. Is how it work.",
    "You want know who is short? Look what they buy.",
    "Twenty year, same corner. You learn.",
 ]),
 'keeper:errand@spanglish': (['errand'], [
    "I close for one hour y everybody notices.",
    "Voy y vuelvo. Don't touch anything.",
 ]),
 'keeper:errand@es': (['errand', 'reg'], [
    "One hour close. Everybody see it.",
    "I go, I come back. Touch nothing.",
 ]),
 'keeper:scav@spanglish': (['errand'], ["Even I go looking. No hay de otra."]),
 'keeper:scav@es': (['errand', 'reg'], ["Even me, I look. Is no other way."]),
 'keeper:sleep@spanglish': (['atmos'], ["...", "Cerrado. Come back at six."]),
 'keeper:sleep@es': (['atmos'], ["...", "Close. Come back six."]),
 'keeper:watch@spanglish': (['banal'], [
    "I know every face on this street. Tú I don't know yet.",
    "Nothing moves out there that I don't see twice.",
 ]),
 'keeper:watch@es': (['banal', 'reg'], [
    "I know every face here. You, not yet.",
    "Nothing move out there. I see it two time.",
 ]),

 # =============================== WATCH =====================================
 'watch:watch@spanglish': (['banal', 'voice'], [
    "Nothing. Y eso es bueno.",
    "You learn the hours. Two to four es lo peor.",
    "I'm not looking for trouble, estoy looking for the hour it starts.",
    "Same dog barks at the same nothing every night.",
    "Light moves out there? Mira first, say nothing.",
    "Ocho hours and the best part is when it's boring.",
 ]),
 'watch:watch@es': (['banal', 'reg'], [
    "Nothing. Is good.",
    "You learn the hour. Two to four is the bad one.",
    "I not look for trouble. I look for when it start.",
    "Same dog. Same nothing. Every night.",
    "Eight hour. The best part is when is boring.",
 ]),
 'watch:free@spanglish': (['banter'], [
    "I sleep when everybody's awake. Al revés, always.",
    "Ask me what the street looks like at four. Nadie asks.",
    "Somebody has to stand out there y me toca.",
 ]),
 'watch:free@es': (['banter', 'reg'], [
    "I sleep when everybody wake. Always backward.",
    "Ask me how the street look at four. Nobody ask.",
    "Somebody must stand there. Is me.",
 ]),
 'watch:home@spanglish': (['fam'], [
    "Wake me at nine, no antes.",
    "I saw the sun come up. Otra vez.",
    "Cierra la puerta. Yes I know. I still say it.",
 ]),
 'watch:home@es': (['fam', 'reg'], [
    "Wake me nine. Not before.",
    "I see the sun come up. Again.",
    "Close the door. I know you know. I say it.",
 ]),
 'watch:errand@spanglish': (['errand'], ["Quick, before it's dark. Yo trabajo at dark."]),
 'watch:errand@es': (['errand', 'reg'], ["Fast. Before dark. I work at dark."]),
 'watch:scav@spanglish': (['errand'], ["I take what nobody's watching. Ironía, I know."]),
 'watch:scav@es': (['errand', 'reg'], ["I take what nobody watch. Is funny, I know."]),
 'watch:sleep@spanglish': (['atmos'], ["...", "Es de día. Let me sleep."]),
 'watch:sleep@es': (['atmos'], ["...", "Is day. Let me sleep."]),
 'watch:work@spanglish': (['banal'], [
    "Standing is the work. Todo el turno.",
    "You'll know if something happens. Ya lo sabrás.",
 ]),
 'watch:work@es': (['banal', 'reg'], [
    "Stand. Is the work. All the shift.",
    "If something happen, you know it.",
 ]),

 # ============================ SITUATIONAL ==================================
 'when:heat@spanglish': (['atmos', 'voice'], [
    "Ciento diez in the shade and there is no shade.",
    "Don't move till four. Nada's worth it till four.",
    "Drink before you're thirsty. Después is too late out here.",
    "You can hear the road ticking.",
    "This used to be the fun kind of calor.",
 ]),
 'when:heat@es': (['atmos', 'reg'], [
    "Hundred ten. And no shade.",
    "Not move until four. Nothing is worth it.",
    "Drink now. Not when thirsty. Too late then.",
    "Listen. The road is ticking.",
 ]),
 'when:night@spanglish': (['atmos', 'voice'], [
    "Twelve blocks y you can count the lit ones.",
    "Whatever's out there tonight puede quedarse out there.",
    "La oscuridad's the only thing that's free.",
    "You can hear the freeway when it's this quiet. Nothing on it, pero you hear it.",
    "Nobody patrols the dark. No es una regla, it's just true.",
    "See a light move where nothing should be? Say nada and walk faster.",
 ]),
 'when:night@es': (['atmos', 'reg'], [
    "Twelve block. Count the light. Is quick.",
    "What is out there tonight, it can stay out there.",
    "The dark is the only free thing.",
    "So quiet you hear the freeway. Nothing on it. You hear it.",
    "Nobody go in the dark. Is not a rule. Is true.",
 ]),
 'when:market@spanglish': (['errand', 'voice'], [
    "Say a number. Cualquier number. We'll meet somewhere sad in the middle.",
    "That's not what it was worth la semana pasada.",
    "Cash, work, or agua. Pick one.",
    "You touch it, you bought it. Esa es la regla.",
    "For that? Por ESO?",
    "Everybody's an honest trader hasta la segunda offer.",
 ]),
 'when:market@es': (['errand', 'reg'], [
    "Say a number. Any number. We meet in the middle. Sad middle.",
    "Last week is not this price.",
    "Money, work, or water. One.",
    "You touch, you buy. Is the rule.",
    "For that? For THAT?",
 ]),
 'when:hungry@spanglish': (['scarce', 'fam'], [
    "Estoy bien. I ate yesterday.",
    "Half now, half tomorrow. Así it's two days.",
    "I'm saving it. No me mires así.",
 ]),
 'when:hungry@es': (['scarce', 'reg'], [
    "I am fine. Yesterday I eat.",
    "Half now. Half tomorrow. Is two day.",
    "I save it. Not look at me like this.",
 ]),
 'when:brownout@spanglish': (['banal', 'comm'], [
    "There it goes. La misma hora as always.",
    "Half light's worse than none. Te hace think it's coming back.",
    "Somebody upstream is drinking before nosotros.",
    "Half the block, igual que el martes.",
    "It's not broken. Somebody's just using more of it than us.",
 ]),
 'when:brownout@es': (['banal', 'reg'], [
    "There. Same hour. Always.",
    "Half light is worse than no light. You think it come back.",
    "Somebody up there drink before us.",
    "Half the block. Same like Tuesday.",
    "Is not broken. Somebody use more.",
 ]),
 'when:rain@spanglish': (['atmos', 'fam'], [
    "Saca everything that holds water. Everything.",
    "First rain since spring y half of it's on the roof, not in the barrel.",
    "Los niños are out in it. Let them be out in it.",
 ]),
 'when:rain@es': (['atmos', 'reg'], [
    "Put out all thing that hold water. All.",
    "First rain since spring. Half go on the roof.",
    "The kids are in it. Let them.",
 ]),
 'when:seen@spanglish': (['banter', 'comm'], [
    "No te conozco.",
    "You're the one from the other block.",
    "Long as you're not taking anything.",
    "Morning. O lo que sea.",
    "Keep walking, sin ofender.",
    "Buscas a alguien?",
    "New face. Huh.",
 ]),
 'when:seen@es': (['banter', 'reg'], [
    "I not know you.",
    "You are from other block. The one.",
    "Is fine. If you take nothing.",
    "Morning. Or whatever is.",
    "Keep walk. No offence.",
    "You look for somebody?",
 ]),
 'when:after_trouble@spanglish': (['comm', 'retell'], [
    "Everybody's accounted for. Todos on this block.",
    "Board it tonight, fix it bien when it's light.",
    "Nobody's saying nada and everybody's saying it loud.",
    "Cuenta las puertas. Then count the people.",
    "Whatever you saw, you saw it con nosotros.",
 ]),
 'when:after_trouble@es': (['comm', 'reg'], [
    "Everybody is here. All this block.",
    "Board it tonight. Fix it good in the light.",
    "Nobody say nothing. Everybody say it loud.",
    "Count the door. Then count the people.",
    "What you see, you see it with us.",
 ]),
 'when:met_before@spanglish': (['banter'], [
    "Tú otra vez. That's not a complaint.",
    "Still walking, then.",
    "Me acuerdo de ti. That's rarer than it sounds.",
 ]),
 'when:met_before@es': (['banter', 'reg'], [
    "You again. Is not a complaint.",
    "Still walking. Good.",
    "I remember you. Is not common.",
 ]),
 'when:owed@spanglish': (['banal'], [
    "Ya sabes what you owe me.",
    "I'm not going to bring it up. Nomás voy a look at you.",
 ]),
 'when:owed@es': (['banal', 'reg'], [
    "You know what you owe.",
    "I not say it. I only look at you.",
 ]),
 'when:favour@spanglish': (['comm'], [
    "No se me olvida. That's worth more here than it used to be.",
    "You did right by me. Say the word alguna vez.",
 ]),
 'when:favour@es': (['comm', 'reg'], [
    "I not forget this. Here that is worth much.",
    "You do right with me. Say the word one day.",
 ]),
 'when:stranger_block@spanglish': (['banter'], [
    "Esta no es tu calle.",
    "Ask before you take anything on this block. Ask ME.",
 ]),
 'when:stranger_block@es': (['banter', 'reg'], [
    "Is not your street.",
    "Ask before you take. Ask me.",
 ]),
 'when:work_short@spanglish': (['errand'], [
    "We're two short today y nobody's saying why.",
    "If they don't show mañana I'm putting somebody else on it.",
 ]),
 'when:work_short@es': (['errand', 'reg'], [
    "Two people missing. Nobody say why.",
    "Tomorrow they not come, I put other people.",
 ]),

 # ============================== FACTIONS ===================================
 'faction:La Familia@spanglish': (['fam', 'voice'], [
    "La familia eats first. Everybody's family somewhere.",
    "You sat at the table, so you're ours now. Así de simple.",
 ]),
 'faction:La Familia@es': (['fam', 'reg'], [
    "Family eat first. Everybody is family from some place.",
    "You sit at the table. Now you are ours.",
 ]),
 'faction:Church@spanglish': (['comm'], [
    "Las puertas are open. They're always open, that's the point.",
    "Ven a comer. Sit through the words first if you can stand them.",
    "Nobody's turned away. Nobody's turned away twice, tampoco.",
 ]),
 'faction:Church@es': (['comm', 'reg'], [
    "The door is open. Always open. Is the point.",
    "Come eat. First the words. If you can.",
    "Nobody go away. Nobody go away two time also.",
 ]),
 'faction:Trades@spanglish': (['errand'], [
    "I can fix it. No puedo fix it for free.",
    "Bring the part or bring the hours, me da igual.",
    "Whoever built this knew what they were doing. Whoever touched it after, no.",
 ]),
 'faction:Trades@es': (['errand', 'reg'], [
    "I fix it. Not for free.",
    "Bring the part, or bring the hour. Same to me.",
    "The one who build this, he know. The one who touch after, no.",
 ]),
 'faction:Homeless@spanglish': (['comm', 'scarce'], [
    "Got a spot out of el sol if you need one. Costs nothing.",
    "Everybody here's from somewhere. Pregunta sometime.",
 ]),
 'faction:Homeless@es': (['comm', 'reg'], [
    "I have a place out of the sun. Cost nothing.",
    "Everybody here is from some place. Ask one day.",
 ]),
 'faction:Caravans@spanglish': (['retell'], [
    "Six days out, six days back, y the road changes both times.",
    "Prices are what el camino says they are.",
    "Two weeks of road and the best thing I saw was un pájaro.",
 ]),
 'faction:Caravans@es': (['retell', 'reg'], [
    "Six day go. Six day come. The road change two time.",
    "The road say the price. Not me.",
    "Two week on the road. Best thing I see is a bird.",
 ]),
 'faction:Cartel@spanglish': (['banal'], [
    "You want it, hay un precio. You don't want it, walk on.",
    "Nadie made you come down here.",
 ]),
 'faction:Cartel@es': (['banal', 'reg'], [
    "You want, is a price. You not want, you walk.",
    "Nobody make you come here.",
 ]),
}
for k, (cites, lines) in REG.items():
    if k in BUCKETS:
        raise SystemExit('register bucket collides with a plain bucket: ' + k)
    base = k.split('@')[0]
    if base not in BUCKETS:
        raise SystemExit('register bucket has no English bucket to fall back to: ' + k)
    BUCKETS[k] = (cites, list(lines))


TOKEN = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ']+")

# ENGLISH WORDS THIS GAME HAS NEVER SAID BEFORE, named one at a time on purpose.
# The vocabulary yardstick below is our own corpus, so a genuinely new English
# word trips the Spanish check. That is the check working, not the check being
# wrong -- and the answer is to write the word down here where the next reader
# can see it, never to loosen the rule until it stops catching things.
EN_EXTRA = {
    'boring', 'copper', 'gossiping', 'machines', 'thirsty', 'backward',
    'hinge', 'window', 'block', 'shift', 'sweep', 'ticking', 'barrel',
    'offence', 'complaint', 'suggestion', 'serial', 'photo', 'uncle',
    'repeat', 'crash', 'having', 'barks', 'steal', 'irony', 'funny',
    'sweeping', 'shade', 'thirst', 'nice',
}


# THE ONLY THINGS THAT MAY FOLLOW AN APOSTROPHE AND STILL LEAVE A WORD BEHIND.
# Ships into the engine as ES_CLITIC so the runtime, the gate and this file all
# read ONE list. Two copies of one rule that drift is the exact family of bug
# this lane has already paid for twice (two tab switchers, one routing rule).
CLITICS = ('s', 't', 're', 've', 'll', 'd', 'm')


def base_forms(word):
    """A token, and the same token with an English contraction taken off.

    "el cobre's gone" is a SPANISH noun wearing an ENGLISH possessive, which is
    Spanglish doing exactly the thing the law describes, and a checker that
    cannot see the noun inside it would demand a gloss for a word that does not
    exist. Splitting at the apostrophe is what lets the lexicon stay a lexicon.

    AND IT SPLITS ONLY ON A REAL CLITIC, WHICH A MEASUREMENT TAUGHT ME. The
    first cut split on any apostrophe, so it read "o'clock" as the Spanish word
    "o" plus noise -- and the sweep it feeds flagged two perfectly good English
    objectives ("Nine o'clock. Watch.") out of 507. THAT IS THE FAILURE THAT
    KILLS A GATE: not a miss, a FALSE ALARM, because a claim that cries wolf
    gets weakened until it catches nothing. Caught by running the sweep against
    the real quests before the gate was written rather than after.
    """
    w = word.lower()
    out = [w]
    # A LEADING APOSTROPHE IS A QUOTE MARK, NOT A CLITIC. The quirk lines open
    # with a spoken quote ("'He turn. He give the name.") and the tokenizer keeps
    # the mark, so the first word arrived as "'he" and was reported as an
    # unglossed Spanish word. Measured the first time the two mouths were checked
    # against one lexicon. Strip it before anything else looks at the token.
    if w.startswith("'"):
        w = w.lstrip("'")
        out = [w]
    if "'" in w:
        head, _sep, tail = w.partition("'")
        if head and tail in CLITICS:
            out.append(head)
    # NEVER RETURN NOTHING. A lone apostrophe reduces to the empty string and the
    # caller indexes [-1] on this list; an empty list is an IndexError in a
    # CHECKER, which is the worst place for one. A token with nothing left in it
    # is not a word, so it comes back as itself and matches nothing.
    out = [x for x in out if x]
    return out or [word.lower()]


def english_vocabulary():
    """EVERY WORD THIS GAME HAS ALREADY SAID IN ENGLISH.

    Built from our OWN corpus, not from a dictionary we do not ship: the plain
    English bark buckets plus records/BOHEMIA_WORDS_BOOK.json, which is every
    authored player-facing line in Bohemia. That is a few thousand real English
    words written for this game, which is exactly the right yardstick -- a word
    the game has never said in English before is a word worth looking at.

    *** AND IT READS ONLY THE ENGLISH LINES, WHICH A GREEN-THEN-RED TAUGHT ME
    THE SAME HOUR. *** The words book is harvested FROM the barks this file
    writes. The first cut walked the whole book, so on the SECOND run every
    Spanish word I had just shipped came back in as "a word this game says in
    English" -- the lexicon's sweep list collapsed from 183 words to 5 and the
    hard rule's claim quietly stopped catching anything. A CHECKER WHOSE INPUT
    IS ITS OWN OUTPUT IS NOT A CHECKER, and the tell was that the build gave a
    different answer depending on what order the two tools were run in.
    The `lang` field LANG-2 put on every line is what makes the filter exact.
    """
    vocab = set(EN_EXTRA)
    for key, (_c, lines) in BUCKETS.items():
        if '@' in key:
            continue
        for t in lines:
            vocab.update(w.lower() for w in TOKEN.findall(t))
    try:
        book = json.load(open(WORDS, encoding='utf-8'))
    except Exception:
        return vocab
    for b in book.get('books', []):
        for ln in b.get('lines', []):
            if (ln.get('lang') or 'en') != 'en':
                continue
            vocab.update(w.lower() for w in TOKEN.findall(str(ln.get('text') or '')))
    return vocab


def assert_every_spanish_word_is_glossed():
    """THE LEXICON CANNOT DRIFT FROM THE MOUTH.

    LANGUAGE NEVER GATES REQUIRED INFORMATION is the hard rule, and the way
    gates/language_gate.js proves it is by sweeping the objectives, the
    resolution buttons and the phone's job offers for any word from the CLOSED
    SET of Spanish this game may say. A closed set with a hole in it is not a
    closed set: a Spanish word I wrote and forgot to gloss would be invisible to
    that sweep, and the claim would go green while the bug walked past it.

    So: every token in a register line that this game has never said in English
    must appear in ES_GLOSS with its meaning. Forgetting one refuses the write.
    Returns the words actually used, which is what ships as ES_LEX -- derived
    from the lines rather than maintained beside them.
    """
    vocab = english_vocabulary()
    used, missing = {}, {}
    for key, (_c, lines) in BUCKETS.items():
        if '@' not in key:
            continue
        for t in lines:
            for w in TOKEN.findall(t):
                forms = base_forms(w)
                hit = next((f for f in forms if f in ES_GLOSS), None)
                if hit:
                    used[hit] = ES_GLOSS[hit]
                elif not any(f in vocab for f in forms):
                    missing.setdefault(forms[-1], []).append(t)
    if missing:
        raise SystemExit(
            'THESE SPANISH WORDS SHIP WITHOUT A MEANING, and a closed set with a\n'
            'hole in it cannot prove the hard rule. Add them to ES_GLOSS:\n  '
            + '\n  '.join('%-14s %s' % (w, missing[w][0]) for w in sorted(missing)))
    return used, vocab


def assert_no_dashes(lines):
    """THE TASTE CHECK, AS A MACHINE AND NOT A COMMENT.

    Paolo has banned em dashes for months and the ban covers the words too, so a
    factory that CAN emit one will eventually ship one. This refuses to write
    rather than reporting after the fact. Bare hyphens are fine; it is the
    typographic dashes he does not want.

    ROWS ARE DICTS, and the first cut of this function in the sibling reaction
    factory iterated them raw -- `'-' in {...}` is a KEY test, always False, so a
    deliberately planted em dash sailed through a green check. A checker that
    cannot see its own subject is the broken one (8/1). It raises now if a row
    ever stops carrying text, because silently checking nothing is the exact
    failure this exists to prevent.
    """
    words = []
    for row in lines:
        t = row if isinstance(row, str) else row.get('text')
        if not isinstance(t, str):
            raise SystemExit('TASTE: a line carries no text to check: %r' % (row,))
        words.append(t)
    bad = [t for t in words if '—' in t or '–' in t]
    if bad:
        raise SystemExit('TASTE: em/en dash in a line, and he has banned them:\n  '
                         + '\n  '.join(bad[:5]))
    return len(words)


def main():
    idx = json.load(open(IDX, encoding='utf-8'))
    laws = idx['laws']

    # every citation must resolve, and its title must be the corpus's own
    bad = []
    for key, (cid, title, applied) in CITES.items():
        e = laws.get(cid)
        if not e:
            bad.append(cid + ' (no such law)')
        elif str(e.get('title', '')).strip() != title.strip():
            bad.append('%s title is "%s", corpus says "%s"' % (cid, title, e.get('title')))
    if bad:
        raise SystemExit('citations do not check out: ' + '; '.join(bad))

    used, en_vocab = assert_every_spanish_word_is_glossed()

    out, n = {}, 0
    for key in sorted(BUCKETS):
        cite_keys, lines = BUCKETS[key]
        rows = []
        for i, t in enumerate(lines):
            rows.append({
                'id': key + '#' + str(i),
                'text': t,
                'draft': True,
                'study': [{'id': CITES[c][0], 'title': CITES[c][1], 'applied': CITES[c][2]}
                          for c in cite_keys],
            })
            n += 1
        out[key] = rows

    payload = {
        '_meta': {
            'what': 'What people in the walked world say when no quest is talking.',
            'why': 'Paolo 8/12: "generate text for now with our quest catalog we have." '
                   'engine/bohemia_people.js has carried an EMPTY LINES table since it was '
                   'written; the 8/11 ALWAYS MAKE AN ATTEMPT ruling overturned the reading '
                   'that kept it empty, and the corpus (Q043.W4) names ambient banter as the '
                   'highest-return characterisation a solo dev has.',
            'generator': 'tools/bohemia_bark_factory.py',
            'buckets': len(out), 'lines': n,
            'registers': 'THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED). A bucket keyed '
                         '<bucket>@spanglish or <bucket>@es is the same bucket in that '
                         'register; engine/bohemia_people.js asks for the register first '
                         'and falls back to plain English, so a missing register is never '
                         'silence. Every Spanish word ships with an English meaning in '
                         'ES_LEX, and gates/language_gate.js sweeps the objectives, the '
                         'resolution buttons and the job offers to prove none of them '
                         'contains one.',
            'lexicon': len(ES_GLOSS),
            # THE ENGLISH WORDS THIS GAME HAD NEVER SAID BEFORE, shipped so
            # gates/language_gate.js can rebuild the same vocabulary yardstick
            # this file used and re-derive the answer instead of trusting it.
            'englishAdditions': sorted(EN_EXTRA),
            'keys': 'role:act (roles and acts are engine/bohemia_agents.js\'s own words), '
                    'faction:<id> (from engine/BOHEMIA_faction_graph.json), when:<situation>',
            'draft': 'every line is draft:true and editable in the WORDS tab',
        },
        'barks': out,
    }
    assert_no_dashes([t for v in out.values() for t in v])
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)

    # ---- WIRE IT INTO THE MOUTH ------------------------------------------
    src = open(PEOPLE, encoding='utf-8').read()
    flat = {k: [r['text'] for r in v] for k, v in out.items()}
    table = json.dumps(flat, ensure_ascii=False, indent=2)
    new = (
        '  // ---- THE LINES TABLE -- FILLED 8/12 (tools/bohemia_bark_factory.py)\n'
        '  // Paolo 8/12: "generate text for now with our quest catalog we have."\n'
        '  // It shipped EMPTY with a comment saying nothing may fill it but him. That\n'
        '  // comment predates ALWAYS MAKE AN ATTEMPT (8/11), which overturned exactly\n'
        '  // that reading for WORDS -- his own diagnosis of the empty field was "THATS\n'
        '  // WHY I HAVENT DONE QUESTS YET". Every one of these is a draft he can retype\n'
        '  // in the WORDS tab, and every bucket cites the questbook findings it was\n'
        '  // written off (Q043.W4 names ambient banter as the best return a solo dev\n'
        '  // has). STILL HIS AND STILL EMPTY: KNOWN_AT_START and NAMED_CAST -- who\n'
        '  // anybody IS remains a decision, and none is made here.\n'
        '  // DO NOT HAND-EDIT: re-run the factory.\n'
        '  var LINES = ' + table + ';\n'
    )
    src = re.sub(r'  // ---- THE LINES TABLE[\s\S]*?\n  var LINES = [\s\S]*?;\n', new, src, count=1)

    # ---- AND THE LEXICON, WHICH IS THE HARD RULE'S ONLY MOVING PART --------
    # ES_LEX is the whole declared set, used lines included and reserve words
    # included, because it is the NET gates/language_gate.js sweeps the
    # objectives with -- a word held in reserve is a word somebody could
    # accidentally put in an objective next month, and catching that is the
    # entire point. ES_ONLY is the subset that cannot be mistaken for English,
    # DERIVED against this game's own English corpus rather than judged by
    # hand: "no", "son", "me" and "ya" are Spanish AND English, so sweeping for
    # them would fail every English objective in the build and the claim would
    # have to be weakened until it caught nothing. A claim that cries wolf gets
    # switched off, which is the same as never having written it.
    es_only = sorted(w for w in ES_GLOSS if w not in en_vocab)
    lex_js = (
        '  var ES_LEX = ' + json.dumps(ES_GLOSS, ensure_ascii=False, indent=2, sort_keys=True) + ';\n'
        '  /* THE HALF OF THE LEXICON THAT CANNOT BE MISTAKEN FOR ENGLISH.\n'
        '     Derived by the factory against this game\'s own English corpus, never\n'
        '     hand-picked: "no", "son", "me" and "ya" are words in both languages, and a\n'
        '     sweep that flagged them would go red on every English objective in the\n'
        '     build. THIS is the list language_gate claim C sweeps the required-\n'
        '     information surfaces with. DO NOT HAND-EDIT: re-run the factory. */\n'
        '  var ES_ONLY = ' + json.dumps(es_only, ensure_ascii=False) + ';\n'
        '  /* WHAT MAY FOLLOW AN APOSTROPHE AND STILL LEAVE A WORD BEHIND. ONE LIST,\n'
        '     shipped from the factory, read by esWordsIn below and by the gate through\n'
        '     it -- never re-typed into a second regex somewhere. */\n'
        '  var ES_CLITIC = ' + json.dumps(list(CLITICS)) + ';\n'
        '  /* ONE TOKEN, EVERY FORM WORTH LOOKING UP -- and this is the THIRD time this\n'
        '     lane has paid for two copies of one rule. The Python side learned that a\n'
        '     LEADING apostrophe is a quote mark and not a clitic ("\'He turn." opens a\n'
        '     spoken line), fixed it there, and the gate\'s own tokenizer went red on the\n'
        '     very same two lines because the rule had not travelled. It lives HERE now\n'
        '     and everything that needs it calls it: esWordsIn below, and the gate. */\n'
        '  function esStems(word) {\n'
        '    var w = String(word == null ? "" : word).toLowerCase();\n'
        '    while (w.charAt(0) === "\'") w = w.slice(1);\n'
        '    if (!w) return [];\n'
        '    var out = [w], ap = w.indexOf("\'");\n'
        '    if (ap > 0 && ES_CLITIC.indexOf(w.slice(ap + 1)) >= 0) out.push(w.slice(0, ap));\n'
        '    return out;\n'
        '  }\n')
    pat = (r'\n  var ES_LEX = [\s\S]*?;\n'
           r'(  /\* THE HALF[\s\S]*?var ES_ONLY = [\s\S]*?;\n)?'
           r'(  /\* WHAT MAY FOLLOW[\s\S]*?var ES_CLITIC = [\s\S]*?;\n)?')
    if not re.search(pat, src):
        raise SystemExit('engine/bohemia_people.js has no ES_LEX slot to fill')
    src = re.sub(pat, '\n' + lex_js, src, count=1)

    # and the lookup gets the situational keys it never had
    old_lookup = ("      return (LINES[person.key] || LINES[person.role] || []).slice();")
    new_lookup = (
        "      /* MOST SPECIFIC FIRST. A person's KEY beats their role-and-what-they-are-\n"
        "         doing, which beats their role, which beats their faction, which beats\n"
        "         the situation. `at` is the schedule's own act word (sleep/home/work/\n"
        "         free/scav/errand/watch) so the world's existing mechanism picks the\n"
        "         line and this module still invents nothing. */\n"
        "      var at = (opts && opts.at) || person.act || null;\n"
        "      var fac = (opts && opts.faction) || person.faction || null;\n"
        "      var when = (opts && opts.when) || null;\n"
        "      var pick = LINES[person.key]\n"
        "        || (at && LINES[person.role + ':' + at])\n"
        "        || LINES[person.role]\n"
        "        || (fac && LINES['faction:' + fac])\n"
        "        || (when && LINES['when:' + when])\n"
        "        || [];\n"
        "      return pick.slice();")
    src = src.replace(old_lookup, new_lookup)
    src = src.replace("    linesFor: function (person) {", "    linesFor: function (person, opts) {")
    src = src.replace(
        "    // what a person says when no quest is talking. EMPTY until he writes them:\n"
        "    // an empty list is honest, and a placeholder line becomes canon by shipping.",
        "    // what a person says when no quest is talking. FILLED 8/12 by\n"
        "    // tools/bohemia_bark_factory.py, every line a draft he can retype in WORDS.")
    with open(PEOPLE, 'w', encoding='utf-8') as f:
        f.write(src)

    roles = len([k for k in out if ':' in k and k.split(':')[0] in ('worker', 'scav', 'keeper', 'watch')])
    print('BARK FACTORY: %d lines in %d buckets' % (n, len(out)))
    print('  role x act : %d buckets' % roles)
    print('  faction    : %d' % len([k for k in out if k.startswith('faction:')]))
    print('  situational: %d' % len([k for k in out if k.startswith('when:')]))
    print('  -> ' + os.path.relpath(OUT, ROOT))
    print('  -> engine/bohemia_people.js  (LINES table filled, lookup widened)')


if __name__ == '__main__':
    main()

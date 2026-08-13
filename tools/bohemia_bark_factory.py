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

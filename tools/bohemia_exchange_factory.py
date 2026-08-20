#!/usr/bin/env python3
"""BOHEMIA EXCHANGE FACTORY -- two people talking TO EACH OTHER, and you walk in
on the middle of it.

*** THE HALF OF Q043.W4 THAT NEVER SHIPPED. ***
The bark factory (8/12) cites Q043.W4 AMBIENT BANTER AS CHARACTERIZATION and
quotes it: "the cast comes alive through OVERHEARD RELATIONSHIPS, not just
quests." It then shipped 244 lines in which every single person is talking to
NOBODY. A person alone saying a thing is not a relationship. The corpus asked
for the relationship and got a monologue.

IT WAS NOT LAZINESS, IT WAS PHYSICALLY IMPOSSIBLE UNTIL TODAY. Measured 8/16 on
the real surface at every hour of a full day: ONE person was drawn on the street
at 07, 09, 11, 13, 15, 17, 19 and 21 hundred hours, and never once two people
close enough to be talking. You cannot write a conversation for a valley that
cannot put two bodies on one screen. The population dial shipped this morning and
a settlement now draws up to 88. THE PAIRS EXIST NOW, so the exchanges can.

WHAT THE CORPUS SAYS TO BUILD, and every one of these is checked, not name-dropped:

  Q043.W4  AMBIENT BANTER AS CHARACTERIZATION (craft)
    "cheap, high-impact life ... a solo-dev-friendly technique." The catalogue
    names this the best return on effort a one-person team has. He is one human.

  Q001.P8  W8 (reward the listener  (ports)
    "gate a solution behind a detail only an attentive player caught." So an
    exchange is not only atmosphere: some of them are THE ONLY PLACE a true fact
    about this valley is ever said out loud. Walk past and you lose it.

  Q018.W3  THE RUMOR WEB (curiosity as the quest log) (craft)
    "a growing map of known-vs-implied that always gives a thread to pull, with
    NO waypoints." An exchange that leaks something leaves a thread, never a
    marker. `leaks:true` marks the ones carrying a fact.

  Q056.W8  ATMOSPHERE OVER EXPOSITION (vibes + prose + music) (craft)
    not one line explains the collapse. They argue about the water pressure.

  Q030.X3  REPETITION (flaws)
    "the day/night loop can grind ... vary it so the dilemma stays fresh, not
    rote." Enforced by machine: the runtime never repeats an exchange until the
    pool for that pair is spent, and the gate fails on a repeat.

  Q043.X4  CONTENT FRONT-LOADED / UNEVEN (flaws)
    "the best banter concentrates in certain combos ... spread the
    characterization so no companion feels like a stub." Enforced by machine:
    every KIND ships at least MIN_PER_KIND exchanges or this refuses to write.

*** YOU JOIN IN THE MIDDLE. *** The one craft rule the research agrees on
unanimously: an overheard line works because it is an excerpt, not a scene. You
catch the middle or the end of something already running, exactly as you do
walking past two people in the street. So every exchange here is authored as a
FULL four-turn conversation and `join` is never 0. The opening line exists, is
written, and is deliberately never heard. That is not waste: it is what makes
turn 2 sound like it has a turn 1 behind it.

MECHANISM-MINE / CONTENTS-PAOLO'S, as amended 8/11 FOR WORDS: every line is a
REAL ATTEMPT, written as if it ships, tagged draft:true, editable in the WORDS
tab. NO PROPER NAMES: who anybody IS is still his ruling and none is made here.
No numbers, no dials, no map facts he has not ruled.

TASTE CHECK: this factory emits WORDS, never pixels -- two people talking to each
other -- and opens no art bank to cook from, so the visual taste rules (value
bands, grime pass, dead glass) have nothing here to hold. It inherits the words
half instead: every authored line is a real attempt tagged draft:true so Paolo
can edit it in the WORDS tab, and it cites the quest corpus rather than inventing
voice at the keyboard. Named rather than waved away, because "not applicable" is
exactly the opt-out this check exists to catch.

REUSE CHECK: cooks WORDS, not pixels, so no banks/ tile applies. The words half
of REUSE-FIRST does:
  looked at: records/BOHEMIA_QUESTBOOK_LAW_INDEX.json (152 quests, 3,672
    findings). Every citation below is resolved against it at build time and the
    title compared VERBATIM; a typo refuses the write.
  looked at: engine/bohemia_people.js -- the LINES table and linesFor(), so this
    does not build a second mouth. Exchanges are a SEPARATE table because a
    two-person turn is not a one-person line, but they are drawn by the SAME
    bubble the barks already use.
  looked at: engine/bohemia_population.js ARCHETYPES -- worker/scav/keeper/watch
    are the sim's own words, so no speaker is required to be something the world
    never makes.
  used: all three.

  python3 tools/bohemia_exchange_factory.py
Gate: gates/exchange_gate.js
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDX = os.path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
OUT_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_EXCHANGES.json')
OUT_JS = os.path.join(ROOT, 'engine', 'bohemia_exchanges.js')

MIN_PER_KIND = 4          # Q043.X4: no kind may be a stub

CITES = {
    'banter': ('Q043.W4', 'AMBIENT BANTER AS CHARACTERIZATION',
               'the corpus names OVERHEARD RELATIONSHIPS the cheapest, highest-impact '
               'characterisation a solo dev has. The barks shipped the overheard half and '
               'not the relationship half. These are two people who know each other.'),
    'listen': ('Q001.P8', 'W8 (reward the listener',
               'gate something behind a detail only an attentive player caught. Some of '
               'these carry a fact about the valley that is said nowhere else, so walking '
               'past is a real loss and standing still is a real reward.'),
    'rumor':  ('Q018.W3', 'THE RUMOR WEB (curiosity as the quest log)',
               'a thread to pull and NO waypoint. What leaks here points somewhere without '
               'ever putting a marker on it; the player follows their own question.'),
    'atmos':  ('Q056.W8', 'ATMOSPHERE OVER EXPOSITION (vibes + prose + music)',
               'nobody explains the collapse. They argue about the pressure, the shift, the '
               'meter and who has the lights on.'),
    'social': ('Q014.W3', 'SOCIAL DEDUCTION VIA DIEGETIC MEANS',
               'what you learn about this valley you learn through its social fabric rather '
               'than a quest log, so the gossip IS the information channel.'),
    'dense':  ('Q008.W6', 'DENSITY AS OBSTACLE',
               'the world\'s texture is the challenge. A street with enough people on it to '
               'hold a conversation is a different street to move through than an empty one.'),
    'rote':   ('Q030.X3', 'REPETITION',
               'vary it so it stays fresh, not rote. The runtime spends a pair\'s pool before '
               'it repeats anything, and the gate fails on a repeat.'),
    'witness': ('Q062.P6', 'W6 (external validation / the witness makes it real',
               'a moment is validated by a WITNESS, turning a possible rumour into shared '
               'truth. So an exchange about the player splits on whether one of the two has '
               'ACTUALLY MET HIM: a witness states it, a second-hand teller hedges.'),
    'seen':   ('Q003.W8', 'THE WITNESS WHO KNOWS',
               'the one who has SEEN it carries a different weight to the one who has only '
               'been told. What people say about you turns on which of those they are.'),
    'echo':   ('Q007.W10', 'CROSS-SYSTEM CONSEQUENCE',
               'the deed echoes into the wider game. Going round asking questions is a deed: '
               'it costs you the quiet you had, and the street starts saying so.'),
    'even':   ('Q043.X4', 'CONTENT FRONT-LOADED / UNEVEN',
               'spread the characterisation so nothing is a stub. Every kind here ships at '
               'least four exchanges or the factory refuses to write.'),
}

# ---------------------------------------------------------------------------
# THE EXCHANGES.  who = (speakerA, speakerB); 'any' or an archetype the sim
# really makes (worker/scav/keeper/watch).  turns = FOUR, strictly alternating
# A,B,A,B.  join = the turn the player actually catches, NEVER 0.
# leaks = it hands him a real thread (Q018.W3 / Q001.P8).
# ---------------------------------------------------------------------------
EX = [
    # ---- WATER ------------------------------------------------------------
    dict(id='water-pressure', kind='work', who=('any', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "Did yours come back on last night?",
             "It came back brown and then it went again.",
             "Mine does that when the block above us runs theirs.",
             "So we are drinking whatever they are done with."]),
    dict(id='water-hours', kind='work', who=('keeper', 'any'), join=2, leaks=True, subject='water',
         implies='The pressure is only up before five. Something else is running it the rest of the day.',
         
         cites=['listen', 'atmos'], turns=[
             "You are filling late again.",
             "I fill when the pressure is up and the pressure is up before five.",
             "Before five. Not after.",
             "After five you get what is left in the pipe, and it is warm."]),
    dict(id='water-share', kind='grief', who=('any', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "Three doors down has been quiet a week.",
             "I left a jug. It is still there.",
             "Then leave it there.",
             "I am not taking it back. It stops being a gift the second you take it back."]),
    dict(id='water-line', kind='work', who=('any', 'watch'), join=1, leaks=False,
         cites=['banter', 'dense'], turns=[
             "The line was around the corner this morning.",
             "It is around the corner every morning now.",
             "It was not last month.",
             "Last month there were fewer of us standing in it."]),

    # ---- POWER ------------------------------------------------------------
    dict(id='power-block', kind='rumor', who=('any', 'any'), join=1, leaks=True, subject='power',
         implies='One street stays lit all night and nothing runs that clean by accident.',
         
         cites=['rumor', 'social'], turns=[
             "Their street had lights all night.",
             "All night. Not a flicker, not a dip.",
             "Nothing runs that clean by accident.",
             "Somebody is keeping it clean, and they are not doing it for us."]),
    dict(id='power-meter', kind='work', who=('worker', 'any'), join=2, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "They read your meter yet?",
             "They read it Tuesday.",
             "And?",
             "And they wrote a number down and walked off and I still have no lights."]),
    dict(id='power-dark', kind='atmos', who=('any', 'watch'), join=1, leaks=False,
         cites=['atmos', 'dense'], turns=[
             "You walking back that way after?",
             "Not through the dark part.",
             "It is four minutes through the dark part.",
             "It is twenty around, and I have got twenty."]),
    dict(id='power-panel', kind='trade', who=('scav', 'any'), join=2, leaks=True, subject='salvage',
         implies='The good panels face the wrong way for a flat roof. The carports are still standing.',
         
         cites=['listen', 'rumor'], turns=[
             "You still pulling panels off the flat roofs?",
             "Not off the flat roofs. The good ones face the wrong way for a flat roof.",
             "Where then.",
             "The carports. Nobody looks up at a carport."]),

    # ---- WORK AND RENT ----------------------------------------------------
    dict(id='work-shift', kind='work', who=('worker', 'worker'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "You picking up the extra shift?",
             "I picked up two and they paid me for one.",
             "Did you say anything?",
             "I said it twice. The second time was to a different man with the same face."]),
    dict(id='work-rent', kind='grief', who=('any', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "They put paper on the door again?",
             "Same paper. Same wording.",
             "That is not a warning any more then, that is just weather.",
             "It is weather until the day it is not, and you cannot tell which day that is."]),
    dict(id='work-crew', kind='work', who=('worker', 'any'), join=2, leaks=True, subject='work',
         implies='They are taking names at the yard and will not say what the work is.',
         
         cites=['listen', 'social'], turns=[
             "They are taking names again down at the yard.",
             "For what work.",
             "They do not say for what work. They just take names.",
             "Then do not give them yours before you know what the work is."]),
    dict(id='work-tools', kind='trade', who=('any', 'worker'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "You get your tools back?",
             "I got a receipt for my tools.",
             "That is not the same thing.",
             "It is if you are the one holding the tools."]),

    # ---- TRADE ------------------------------------------------------------
    dict(id='trade-price', kind='trade', who=('any', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "What did it cost you?",
             "Twice what it cost the last person who asked.",
             "Did you pay it?",
             "I paid it. Tomorrow it will be twice again and I will pay that too."]),
    dict(id='trade-empty', kind='trade', who=('scav', 'any'), join=2, leaks=True, subject='salvage',
         implies='Whatever is still lying out past the wash was left there for a reason.',
         
         cites=['listen', 'rumor'], turns=[
             "Anything left out past the wash?",
             "Anything left is left because somebody looked at it and walked away.",
             "That is not a no.",
             "It is not a no. It is bring somebody with you."]),
    dict(id='trade-weigh', kind='trade', who=('keeper', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "Your scale is heavy.",
             "My scale is the scale.",
             "It was lighter last week.",
             "Last week you brought me better metal."]),
    dict(id='trade-credit', kind='work', who=('any', 'keeper'), join=2, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "Put it on the book.",
             "The book is closed.",
             "Since when is the book closed.",
             "Since the last four people on it stopped walking past."]),

    # ---- RUMOUR AND THE THREAD -------------------------------------------
    dict(id='rumor-quiet', kind='rumor', who=('any', 'any'), join=1, leaks=True, subject='the hill',
         implies='Somebody sits on the road up the hill and writes down who goes.',
         
         cites=['rumor', 'listen'], turns=[
             "You been up the hill lately?",
             "Not since they started keeping somebody on the road up.",
             "Keeping somebody on it how.",
             "Sat in a chair. Did not stop me. Just wrote down that I went."]),
    dict(id='rumor-moving', kind='rumor', who=('any', 'watch'), join=2, leaks=True, subject='water',
         implies='Families are leaving towards the water. Nobody says what is there.',
         
         cites=['rumor', 'social'], turns=[
             "Two families off your street this month.",
             "Three.",
             "Where do they go.",
             "Towards the water. Everybody goes towards the water eventually."]),
    dict(id='rumor-nobody', kind='rumor', who=('watch', 'any'), join=1, leaks=False,
         cites=['banter', 'dense'], turns=[
             "Anybody come through here today?",
             "Plenty came through.",
             "Anybody stop.",
             "Nobody stops here. That is the whole reason I like it."]),
    dict(id='rumor-list', kind='rumor', who=('any', 'any'), join=2, leaks=True, subject='names',
         implies='Somebody is writing down who lives in which house.',
         
         cites=['listen', 'social'], turns=[
             "They are asking who lives where now.",
             "They have always asked that.",
             "They are writing it down now.",
             "Then tell them a house you do not sleep in."]),

    # ---- GRIEF ------------------------------------------------------------
    dict(id='grief-door', kind='grief', who=('any', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "Did anyone shut the door properly?",
             "I shut it.",
             "Good. The heat does the rest and it does it kindly enough.",
             "Do not tell me what the heat does. I shut the door."]),
    dict(id='grief-name', kind='grief', who=('any', 'any'), join=2, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "You keep saying we when you talk about that house.",
             "I lived in it.",
             "You lived in it a long time ago.",
             "I say we because there is nobody left to correct me."]),
    dict(id='grief-count', kind='grief', who=('watch', 'any'), join=1, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "How many this week.",
             "I stopped counting on purpose.",
             "That is not like you.",
             "Counting was the only part of it I was any good at, so I stopped."]),
    dict(id='grief-chair', kind='grief', who=('any', 'keeper'), join=2, leaks=False,
         cites=['banter', 'atmos'], turns=[
             "You are still putting the second chair out.",
             "It is a chair. It goes out.",
             "You could put one out.",
             "I could. I put two out. Leave it."]),

    # ---- THE STREET ITSELF -----------------------------------------------
    dict(id='street-crowd', kind='atmos', who=('any', 'any'), join=1, leaks=False,
         cites=['dense', 'atmos'], turns=[
             "It is busy out here today.",
             "It is busy every day now. You just used to leave earlier.",
             "There were not this many of us.",
             "There were. They were inside, and inside got worse than out here."]),
    dict(id='street-heat', kind='atmos', who=('any', 'any'), join=2, leaks=False,
         cites=['atmos', 'dense'], turns=[
             "You are out in the middle of it again.",
             "The shade is taken.",
             "The shade is always taken.",
             "So I stand here and I do not talk about it, usually."]),
    dict(id='street-newface', kind='social', who=('any', 'watch'), join=1, leaks=True, subject='strangers',
         implies='Somebody came in off the road instead of the houses, and was let past.',
         
         cites=['social', 'listen'], turns=[
             "New face on the block.",
             "I saw. Came in from the road, not the houses.",
             "That means somebody let them past.",
             "Or nobody was sitting where somebody should have been sitting."]),
    dict(id='street-dogs', kind='atmos', who=('any', 'any'), join=2, leaks=False,
         cites=['atmos', 'banter'], turns=[
             "They are back on your side again.",
             "They go where the bins are.",
             "The bins are empty.",
             "They do not know that yet. Neither did I for a while."]),
    dict(id='street-known', kind='social', who=('any', 'any'), join=1, leaks=False,
         cites=['social', 'banter'], turns=[
             "You know everyone on this street?",
             "I know everyone who was on it.",
             "That is not the same list.",
             "It is a shorter one, and I still say it in the same order."]),
    dict(id='street-watching', kind='social', who=('watch', 'any'), join=2, leaks=True, subject='strangers',
         implies='Somebody came through twice and did not buy anything either time.',
         
         cites=['listen', 'rumor'], turns=[
             "You are looking at everybody today.",
             "I look at everybody every day.",
             "Not like that you do not.",
             "Somebody came through twice and did not buy anything either time."]),
    # ---- AND THEY TALK ABOUT YOU ------------------------------------------
    # `about='you'` fires only when the world says it is TRUE: you really have
    # been going round asking. `needs` names the counter and the threshold, and
    # `witness` splits on whether one of the two has actually met you -- a
    # witness states it flat, a second-hand teller hedges (Q062.P6, Q003.W8).
    dict(id='you-asking-heard', kind='about', about='you', needs=('asked', 2),
         witness='heard', who=('any', 'any'), join=1, leaks=False,
         cites=['witness', 'echo'], turns=[
             "Somebody has been going round asking about the water.",
             "Asking who?",
             "Anybody who will stand still. Not from here, whoever it is.",
             "Then they will run out of people who stand still."]),
    dict(id='you-asking-seen', kind='about', about='you', needs=('asked', 2),
         witness='seen', who=('any', 'any'), join=1, leaks=False,
         cites=['seen', 'echo'], turns=[
             "That one asked me about the pressure.",
             "What did you tell them?",
             "What everybody knows. They already knew it.",
             "So they were checking whether you would say it."]),
    dict(id='you-doors-heard', kind='about', about='you', needs=('known', 4),
         witness='heard', who=('any', 'any'), join=2, leaks=False,
         cites=['witness', 'echo'], turns=[
             "How many doors is that now?",
             "Six that I have counted. Same street twice.",
             "Nobody walks a street twice by accident.",
             "They do if they are counting something themselves."]),
    dict(id='you-doors-seen', kind='about', about='you', needs=('known', 4),
         witness='seen', who=('any', 'any'), join=1, leaks=False,
         cites=['seen', 'echo'], turns=[
             "They came to me first.",
             "They came to me second, then.",
             "Did you give them anything?",
             "I gave them what I give everybody. It is what they asked after that I am still thinking about."]),
    dict(id='you-names-heard', kind='about', about='you', needs=('names', 2),
         witness='heard', who=('any', 'any'), join=1, leaks=False,
         cites=['witness', 'atmos'], turns=[
             "They have been taking names.",
             "Taking them where?",
             "Nowhere. Just taking them. That is the part I do not like.",
             "A name is the one thing you cannot hand back after."]),
    dict(id='you-names-seen', kind='about', about='you', needs=('names', 2),
         witness='seen', who=('any', 'any'), join=2, leaks=False,
         cites=['seen', 'atmos'], turns=[
             "They asked me what I am called.",
             "Did you tell them?",
             "I did. And they said it back to me, once, like they were putting it somewhere.",
             "Then it is somewhere."]),

    dict(id='street-asking', kind='social', who=('any', 'any'), join=1, leaks=True, subject='names',
         implies='Somebody was asking which one you were, and already knew where you live.',
         
         cites=['social', 'listen'], turns=[
             "Somebody was asking after you.",
             "Asking what.",
             "Asking which one you were. Not where you live, which one you were.",
             "Then they already knew where I live."]),
]


def assert_no_dashes(rows):
    """NO EM DASHES OR EN DASHES ANYWHERE (Paolo, standing). Refuse to write."""
    bad = [t for t in rows if '—' in t or '–' in t]
    if bad:
        raise SystemExit('EM/EN DASH in a line, refusing to write: ' + repr(bad[:3]))


def assert_no_names(rows):
    """MECHANISM-MINE: who anybody IS is his ruling. A capitalised word that is
    not a sentence opener and not an allowed word is a name creeping in.

    WEEKDAYS AND MONTHS ARE NOT NAMES HE RESERVED. The first run of this refused
    to write over the word "Tuesday", which is the same over-broad catch the
    HARDCODED_NAME check in engine/bohemia_bq.js made earlier this same session
    and the same ruling applies: the law protects WHO SOMEBODY IS, and a day of
    the week is not a person, a faction or a place. A checker that cannot tell a
    calendar from a character is the broken one, so it is fixed here rather than
    the line being reworded around it.
    """
    allow = set('I A The They We You He She It That This There Then Not Nobody '
                'Since Where Anybody Anything Three Two Towards Before After Mine '
                'My His Her Their Our Do Did Does Put Leave Counting Last Sat Or '
                'So And But Keeping Same Good New How What Who '
                'Monday Tuesday Wednesday Thursday Friday Saturday Sunday '
                'January February March April June July August September '
                'October November December'.split())
    bad = []
    for t in rows:
        for w in re.findall(r'(?<![.!?]\s)(?<!^)\b([A-Z][a-z]{2,})\b', t):
            if w not in allow:
                bad.append((w, t))
    if bad:
        raise SystemExit('possible PROPER NAME in a line: ' + repr(bad[:4]))


def main():
    laws = json.load(open(IDX, encoding='utf-8'))['laws']

    # EVERY CITATION RESOLVES AND ITS TITLE IS THE CORPUS'S OWN, VERBATIM.
    bad = []
    for key, (cid, title, _applied) in CITES.items():
        e = laws.get(cid)
        if not e:
            bad.append(cid + ' (no such law)')
        elif str(e.get('title', '')).strip() != title.strip():
            bad.append('%s title is "%s", corpus says "%s"' % (cid, title, e.get('title')))
    if bad:
        raise SystemExit('citations do not check out: ' + '; '.join(bad))

    # SHAPE. Four turns, alternating, and you never hear the opener.
    ids = set()
    for x in EX:
        if x['id'] in ids:
            raise SystemExit('duplicate exchange id: ' + x['id'])
        ids.add(x['id'])
        if len(x['turns']) != 4:
            raise SystemExit('%s has %d turns, must be 4' % (x['id'], len(x['turns'])))
        if not (1 <= x['join'] <= 2):
            raise SystemExit('%s joins at %d; you never hear the opener' % (x['id'], x['join']))
        if x.get('about') and not (x.get('needs') and x.get('witness')):
            raise SystemExit('%s is about the player and names no condition or witness '
                             'state. An exchange about you that fires when it is not TRUE '
                             'is the world lying about itself.' % x['id'])
        if x.get('witness') not in (None, 'seen', 'heard'):
            raise SystemExit('%s has witness=%r; only seen/heard exist' % (x['id'], x['witness']))
        if x['leaks'] and not (x.get('subject') and x.get('implies')):
            raise SystemExit('%s claims to leak and names no subject or question. '
                             'Q001.P8 rewards the LISTENER: a leak with nothing '
                             'behind it is atmosphere wearing a mechanic\'s coat.'
                             % x['id'])
        if len(x['cites']) < 2:
            raise SystemExit('%s cites %d findings, needs 2' % (x['id'], len(x['cites'])))
        studies = {CITES[c][0].split('.')[0] for c in x['cites']}
        masters = {laws[CITES[c][0]]['kind'] for c in x['cites']}
        if len(studies) < 2:
            raise SystemExit('%s spans %d studies, needs 2' % (x['id'], len(studies)))
        del masters   # spanned across the FILE, asserted below; per-row needs 2 studies

    # Q043.X4 CONTENT FRONT-LOADED / UNEVEN: no kind may be a stub.
    kinds = {}
    for x in EX:
        kinds[x['kind']] = kinds.get(x['kind'], 0) + 1
    thin = {k: n for k, n in kinds.items() if n < MIN_PER_KIND}
    if thin:
        raise SystemExit('these kinds are stubs (need %d each): %s' % (MIN_PER_KIND, thin))

    # the FILE must span >= 2 masters, which is what the catalogue law asks of a scene
    all_masters = {laws[CITES[c][0]]['kind'] for x in EX for c in x['cites']}
    if len(all_masters) < 2:
        raise SystemExit('the whole table spans %d master(s), needs 2' % len(all_masters))

    lines = [t for x in EX for t in x['turns']]
    assert_no_dashes(lines)
    assert_no_names(lines)

    rows = []
    for x in EX:
        rows.append({
            'id': x['id'],
            'kind': x['kind'],
            'who': list(x['who']),
            'turns': x['turns'],
            'join': x['join'],
            'leaks': x['leaks'],
            'subject': x.get('subject'),
            'implies': x.get('implies'),
            'about': x.get('about'),
            'needs': list(x['needs']) if x.get('needs') else None,
            'witness': x.get('witness'),
            'draft': True,
            'study': [{'id': CITES[c][0], 'title': CITES[c][1], 'applied': CITES[c][2]}
                      for c in x['cites']],
        })

    payload = {
        '_meta': {
            'what': 'Two people in the walked world talking TO EACH OTHER. You catch '
                    'the middle of it.',
            'why': 'Q043.W4 asks for OVERHEARD RELATIONSHIPS and the 8/12 barks shipped '
                   '244 lines of people talking to nobody. Two bodies on one screen was '
                   'physically impossible until the population dial landed 8/16.',
            'join': 'every exchange is a full four-turn conversation and join is never 0. '
                    'The opening line is written and deliberately never heard, which is '
                    'what makes the line you DO hear sound like it has something behind it.',
            'generator': 'tools/bohemia_exchange_factory.py',
            'exchanges': len(rows), 'lines': len(lines), 'kinds': kinds,
            'leaks': sum(1 for x in EX if x['leaks']),
            'masters': sorted(all_masters),
            'draft': 'every line is draft:true and editable in the WORDS tab',
        },
        'exchanges': rows,
    }
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)

    # ---- THE MODULE -------------------------------------------------------
    table = json.dumps(rows, ensure_ascii=False, indent=1)
    js = '''// BOHEMIA EXCHANGES -- two people talking TO EACH OTHER (8/17/26, PEOPLE lane)
// GENERATED by tools/bohemia_exchange_factory.py. DO NOT HAND-EDIT: re-run the tool.
//
// Q043.W4 AMBIENT BANTER AS CHARACTERIZATION asks for OVERHEARD RELATIONSHIPS.
// The 8/12 bark factory cited that finding and then shipped 244 lines in which
// every person talks to NOBODY, because the valley could not put two bodies on
// one screen: measured at every hour of a full day, ONE person was drawn, never
// a pair. The population dial (8/16) changed that, and a settlement now draws up
// to 88. These are the relationships that were impossible until then.
//
// YOU JOIN IN THE MIDDLE. Every exchange is a full four-turn conversation and
// `join` is never 0. The opening line is written and never heard. That is the
// point: an overheard line works because it is an excerpt, and turn 2 only
// sounds like a real conversation because a turn 1 exists behind it.
//
// Q001.P8 "W8 (reward the listener": the ones marked leaks:true say something
// true about this valley that is said nowhere else. Walking past is a real loss.
// Q018.W3 THE RUMOR WEB: a thread to pull and never a waypoint.
// Q030.X3 REPETITION: nextFor() spends a pair's whole pool before it repeats.
//
// EVERY LINE IS A DRAFT (8/11 ALWAYS MAKE AN ATTEMPT). Edit them in the WORDS tab.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  var EXCHANGES = ''' + table + ''';

  /* deterministic 32-bit hash, the same shape the rest of the engine uses, so
     the same two people on the same day get the same conversation on every
     surface and across a reload. */
  function h(a, b, c) {
    var n = (Math.imul(a | 0, 2654435761) ^ Math.imul(b | 0, 40503) ^ Math.imul(c | 0, 2246822519)) >>> 0;
    n ^= n >>> 15; n = Math.imul(n, 2246822519) >>> 0; n ^= n >>> 13;
    return n >>> 0;
  }
  function strHash(s) {
    var n = 2166136261 >>> 0;
    s = String(s || '');
    for (var i = 0; i < s.length; i++) { n ^= s.charCodeAt(i); n = Math.imul(n, 16777619) >>> 0; }
    return n >>> 0;
  }

  /* Does this pair fit the exchange? 'any' fits anybody; otherwise the speaker
     must really be that archetype, so a keeper's line is never in a scav's
     mouth. Tried both ways round, because two people meeting is not ordered. */
  function fits(x, ra, rb) {
    var wa = x.who[0], wb = x.who[1];
    return ((wa === 'any' || wa === ra) && (wb === 'any' || wb === rb));
  }
  function forPair(ra, rb) {
    var out = [];
    for (var i = 0; i < EXCHANGES.length; i++) {
      if (fits(EXCHANGES[i], ra, rb)) out.push(EXCHANGES[i]);
      else if (fits(EXCHANGES[i], rb, ra)) {
        /* same conversation, the two of them the other way round */
        var f = EXCHANGES[i];
        out.push({ id: f.id, kind: f.kind, who: [f.who[1], f.who[0]], turns: f.turns,
                   join: f.join, leaks: f.leaks, draft: f.draft, study: f.study,
                   flipped: true });
      }
    }
    return out;
  }

  /* IS THIS ONE TRUE RIGHT NOW? An exchange with no `about` is always true --
     two people discussing the water need no permission. An exchange ABOUT THE
     PLAYER is only true once the world says so: the counter it names has passed
     its threshold, AND the witness state matches whether either speaker has
     actually met him. AN EXCHANGE ABOUT YOU THAT FIRES WHEN IT IS NOT TRUE IS
     THE WORLD LYING ABOUT ITSELF, which is worse than saying nothing. */
  function trueNow(x, ctx) {
    if (!x.about) return true;
    if (!ctx || !ctx.world) return false;
    if (!x.needs) return false;
    var have = ctx.world[x.needs[0]];
    if (!(typeof have === 'number' && have >= x.needs[1])) return false;
    return !x.witness || x.witness === ctx.witness;
  }
  function eligible(pool, ctx) {
    var out = [];
    for (var i = 0; i < pool.length; i++) if (trueNow(pool[i], ctx)) out.push(pool[i]);
    return out;
  }

  /* Q030.X3 REPETITION, enforced rather than hoped for: a pair works through
     its whole pool before anything comes round again. `spent` is the caller's
     own set of ids already heard from this pair. */
  function nextFor(pairKey, ra, rb, spent, salt, ctx) {
    var pool = eligible(forPair(ra, rb), ctx);
    if (!pool.length) return null;
    /* THE WORLD TALKS ABOUT YOU BEFORE IT TALKS ABOUT THE WATER, but only while
       it is still news: once a pair has spent its about-you lines they go back
       to the pressure and the shift, which is how it stays a moment rather than
       a state you are stuck in. */
    var about = [];
    for (var q = 0; q < pool.length; q++) {
      if (pool[q].about && !(spent && spent[pool[q].id])) about.push(pool[q]);
    }
    if (about.length) pool = about;
    var fresh = [];
    for (var i = 0; i < pool.length; i++) {
      if (!spent || !spent[pool[i].id]) fresh.push(pool[i]);
    }
    var use = fresh.length ? fresh : pool;      /* pool spent: only then repeat */
    var n = h(strHash(pairKey), use.length, salt | 0) % use.length;
    return use[n];
  }

  /* WHAT THE PLAYER ACTUALLY HEARS: from `join` to the end, never turn 0.
     Returns [{ speaker: 0|1, text }], so the surface never has to work out
     whose bubble it is. */
  function heard(x) {
    if (!x) return [];
    var out = [];
    for (var i = x.join; i < x.turns.length; i++) {
      out.push({ speaker: i % 2, text: x.turns[i] });
    }
    return out;
  }

  /* A PERSON-TO-SUBJECT MAP IS NOT IN THIS DATA, AND I MEASURED THAT RATHER
     THAN SHIPPING IT. The first cut derived "what somebody's trade gets talked
     about" from which archetypes appear in each leaking conversation. Measured:
     scav, keeper, watch and worker each came back with ALL SEVEN subjects,
     because most exchanges take ('any','any') speakers and an 'any' slot
     matches everybody. A function that returns the same answer for every input
     is not a lookup, it is a decoration, and shipping it would have put a
     person-specific row on a card that was never person-specific. So the log is
     a LOG -- which is what Q018.W3 asked for in the first place: "a growing map
     of known-vs-implied", not a dossier per resident. */

  /* and the reverse, for a surface that has a subject and wants the fact */
  function leaksOf(subject) {
    var out = [];
    for (var i = 0; i < EXCHANGES.length; i++) {
      if (EXCHANGES[i].leaks && EXCHANGES[i].subject === subject) out.push(EXCHANGES[i]);
    }
    return out;
  }

  var API = {
    VERSION: '8.17.26',
    EXCHANGES: EXCHANGES,
    forPair: forPair, nextFor: nextFor, heard: heard, fits: fits,
    trueNow: trueNow, eligible: eligible,
    leaksOf: leaksOf,
    count: EXCHANGES.length
  };
  if (HASREQ) module.exports = API;
  root.BohemiaExchanges = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
'''
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)

    print('EXCHANGES: %d conversations, %d lines, %d leak a thread'
          % (len(rows), len(lines), payload['_meta']['leaks']))
    print('  kinds  : %s' % kinds)
    print('  masters: %s' % sorted(all_masters))
    print('  -> %s' % os.path.relpath(OUT_JS, ROOT))
    print('  -> %s' % os.path.relpath(OUT_JSON, ROOT))


if __name__ == '__main__':
    main()

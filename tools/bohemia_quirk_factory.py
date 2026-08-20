#!/usr/bin/env python3
"""BOHEMIA QUIRK FACTORY -- one endearing or funny thing that is THEIRS, and you
meet it the moment you ask their name.

*** BACKLOG 0t, AND IT IS THE ATTACHMENT HALF OF THE DEMO'S COLD OPEN. ***
The tone research (records/BOHEMIA_TONE_RESEARCH_R1_8_12_26.md, finding 1) put it
in one sentence: A CHARACTER NOBODY LAUGHED WITH IS A CHARACTER NOBODY MOURNS.
The demo's whole ask is that the sibling dies and it lands. It cannot land in a
valley of 297 people who are all interchangeable, because the player has never
once been charmed by anybody.

R1 also named the slot, exactly: "the ask-their-name system is a built-in JOKE
DELIVERY SLOT -- what a stranger says when you ask their name is where Undertale
would put the first laugh." That slot has been shipped and empty since 7/31. You
ask, you get a surname and five mechanical rows. Nobody says anything that is
theirs.

MEASURED BEFORE WRITING A WORD (the barks are real and they are not this):
  engine/bohemia_people.js LINES  = 58 keys, every one a BUCKET
    (faction:Blues, scav:work, when:night ...). Every Blue in the valley says
    the same five sentences. That is a faction having a voice, which is good and
    which is NOT a person having a self.
  engine/bohemia_people.js REACTIONS = 19 keys, all about the PLAYER
    (saw:/heard:/rung:/met:). Also good, also not a person.
  So: 0 of 297 people carry one thing that is only theirs. This file is that.

===== FUNNY AND SCARY ARE ONE DIAL, NOT TWO -- AND WE ALREADY OWN THE DIAL =====
R1 finding 3 (benign violation theory, McGraw/HuRL): humour is a VIOLATION
appraised as SAFE. Fear and laughter are the same event with a different safety
reading, and psychological distance is the switch. "The design consequence:
funny->traumatizing whiplash is not mixing two tones, it is MOVING ONE DIAL."

THE VALLEY ALREADY HAS THAT DIAL AND IT IS PHYSICAL. LIGHT=TERRITORY plus the
12% clustered power grid means the city is literally divided into safe and
unsafe ground, and the walked surface already answers `dayDark()` off the real
POWER grid. So:

  EVERY QUIRK IS AUTHORED TWICE, AS THE SAME PERSON.
  In a lit block it plays as the joke. In the dark the SAME trait, the SAME
  person, the SAME object, plays as the thing that is wrong with them.

That is the point and it is what makes this uncanny rather than a mode switch:
it is never a different quirk, and it is never a different person. You liked
them on a lit corner. You meet them again two blocks over where the power stops,
and the thing you liked is the thing that frightens you. R1 named the outcome
("walking between them IS the tone transition"); this is the mechanism, and it
costs no new system.

===== WHY A FACTORY AND NOT 297 HAND-WRITTEN ROWS (FACTORY LAW) =====
A quirk is SHAPE x SPECIFIC.
  the SHAPE    is the human pattern, played deep -- craft card item 2, "every
               speaker has ONE quirk, played deep and consistently."
  the SPECIFIC is the noun that makes the image sharp -- craft card item 1,
               "SPECIFICITY: never the generic noun."
Specifics are TYPED (object / place / ritual) and a shape declares which type it
takes, so the machine can never pair "they are superstitious about" with a place
it does not read as. That typing is the difference between a factory and a
mad-lib.

DERIVED, NEVER STORED. Same doctrine bohemia_people.js runs on: a person is
(blockSeed, house, slot) and resolves to the same human on any device, on any
load, forever. So is their quirk. Nothing is saved and nothing can desync.

===== MECHANISM-MINE / CONTENTS-PAOLO'S, as amended 8/11 FOR WORDS =====
Every line here is a REAL ATTEMPT, written as if it ships, tagged draft:true,
and reachable in the WORDS tab where he edits. NO PROPER NAMES: who anybody IS
is his ruling and none is made here -- not one person is named, and not one
establishment is named either, because which casinos still stand is map canon
and map canon is his. The nouns are things, not brands.

REUSE CHECK (REUSE-FIRST, Paolo 7/22 -- the words half):
  opened, in code, and used:
    records/BOHEMIA_QUESTBOOK_LAW_INDEX.json -- 152 quests, 3,672 findings.
      Every citation below is resolved against it AT BUILD TIME and the title
      compared VERBATIM; a typo refuses the write.
    engine/bohemia_people.js -- read LINES (58 bucket keys) and REACTIONS (19)
      to prove this is not a second copy of an existing mouth, and read
      generatedName()'s string hash (imul-31 then a mix) so the derivation here
      matches the module's own documented pattern instead of inventing a rival
      one. mix32 is NOT exported, so the mixer is restated with the same
      constants and a DIFFERENT salt -- different on purpose, so a person's
      quirk is not correlated with the name they were given.
    records/BOHEMIA_TONE_RESEARCH_R1_8_12_26.md + _R2_ -- the tone canon, the
      benign-violation dial, and the routed DIALOGUE CRAFT CARD, whose six rules
      this file is written against.
  cooks WORDS, not pixels, so no banks/ tile applies.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
OUT_JS = os.path.join(ROOT, 'engine', 'bohemia_quirk.js')
OUT_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_QUIRKS.json')

# ===========================================================================
# THE SPECIFICS. Typed, so a shape can never be handed a noun it cannot read.
# Craft card 1: SPECIFICITY WINS. Every one of these is a concrete image from a
# city that ran on tourism and then stopped. None of them names an establishment
# -- what is still standing is map canon and map canon is Paolo's.
#
# ===== THE GRAMMAR CONTRACT, AND WHY IT IS A CONTRACT AND NOT A STYLE NOTE ====
# The first build of this file read, on the real module output:
#     "Mine's the same as his was. a slot handle snapped off at the base, both
#      of us."
#     "counting the lit windows before bed. That's how I know."
# Both are the same bug wearing two hats: a phrase authored to sit in the middle
# of a sentence was dropped at the START of one. Template substitution has no
# grammar, so the grammar has to live in the SPEC and be MACHINE-CHECKED, or a
# solo writer eyeballs forty-four lines times forty nouns and misses some. So:
#   1. A NOUN IS NEVER SENTENCE-INITIAL. Every slot sits after a verb or a
#      preposition, mid-sentence. check_shapes() refuses a line that opens a
#      sentence with a slot -- capitalisation stops being a problem that exists.
#   2. AN OBJECT PHRASE CARRIES NO INTERNAL COMMA. "a pool towel, folded square"
#      embeds as garbage after "carrying". "a folded pool towel" embeds anywhere.
#   3. A RITUAL IS A BARE GERUND AND PERSON-NEUTRAL. It is spoken in the first
#      person ("I'm {r}") and must never smuggle in a "their".
# All three are asserted below and in gates/quirk_gate.js.
# ===========================================================================
SPECIFICS = {
    # things you can hold. Sixteen, because the object shapes are the most of
    # them and the object shapes are the ones that repeat on a block.
    'object': [
        "a drink token from a floor that closed",
        "a keno card with the numbers still circled",
        "a room key with the plastic melted flat",
        "one blue chip",
        "a marquee bulb that never blew",
        "a valet ticket numbered forty-one",
        "a cocktail straw still in its paper",
        "a folded pool towel",
        "a slot handle snapped off at the base",
        "a laminated buffet menu",
        "a lanyard with somebody else's photo on it",
        "a nickel that will not spend anywhere",
        "a house deck with the queens missing",
        "a room-service pen that still writes",
        "half a pair of dice",
        "a luggage tag for a flight that left",
    ],
    # places on the walked surface. Twelve. Every one of them is a kind of place
    # this valley demonstrably has -- a dock, a garage, a stairwell -- never a
    # named district, because districts are the MAP and the map is his.
    'place': [
        "the loading dock behind the kitchens",
        "the third floor of the parking garage",
        "the drained pool deck",
        "the stairwell that still has its light",
        "the service corridor under the floor",
        "the bus shelter with the ad still lit",
        "the roof of the laundry",
        "the dry fountain basin",
        "the long ramp where the buses turned",
        "the loading bay with the clock over it",
        "the pump house at the end of the row",
        "the alley behind the shuttered row",
    ],
    # small repeated acts. Twelve. These are the cheapest and truest human
    # detail there is: what somebody does the same way every single day. Bare
    # gerunds, person-neutral, so the same phrase reads right in their mouth.
    'ritual': [
        "counting the lit windows",
        "saying the day of the week out loud",
        "checking the same dead payphone",
        "straightening what is already straight",
        "tapping the doorframe twice on the way out",
        "washing up before eating",
        "winding a watch that does not run",
        "reading the expiry dates out loud",
        "walking the block backwards once a week",
        "keeping one light on for somebody",
        "shaking out boots before putting them on",
        "saying goodnight to the block",
    ],
}

# ===========================================================================
# THE SHAPES. Each one is a person, played deep, twice.
#   tell : what you can SEE about them, third person. No dialogue.
#   lit  : what they say when you ask their name on a powered block. The joke.
#   dark : the SAME person, the SAME trait, where the power stops. The dread.
# {it} is filled from the shape's declared kind. Nothing else is substituted.
#
# PROTECT THE HIT (craft card 5): none of these is a joke about somebody dying.
# The comedy is people being stubbornly, specifically themselves in a city that
# stopped paying them, which is the only kind this game gets to have.
# ===========================================================================
SHAPES = [
    # ---- OBJECT ----------------------------------------------------------
    dict(key='shows-you-first', kind='object',
         tell="carries one thing everywhere and will get it out of their coat given any excuse",
         lit="Yeah, in a second. Look at this first. I've been carrying {it} two years now.",
         dark="You want a name out here? Fine. Hold {it} where I can see your hands."),
    dict(key='not-for-trade', kind='object',
         tell="answers questions with one hand over a pocket",
         lit="Sure. And before you work up to it, I'm not trading {it}. Nothing personal.",
         dark="Whatever you came for, you're not getting {it} either. Keep walking, friend."),
    dict(key='belonged-to-somebody', kind='object',
         tell="keeps two of the same small thing when one would do",
         lit="Mine's the same as his was. We both carried {it}. I kept the pair when he stopped needing his.",
         dark="He carried {it} too. He isn't here. Neither's the name, if you're following me."),
    dict(key='collects-them', kind='object',
         tell="stops mid-sentence to add to a count nobody asked about",
         lit="Hang on. Forty. Forty-one. Sorry, I'm counting. Number one was {it} and I never stopped.",
         dark="Forty-one. I started on {it} and I have to reach fifty before it's light or it doesn't count."),
    dict(key='superstitious-about-it', kind='object',
         tell="will not answer while holding a certain thing, and is embarrassed about it",
         lit="Not while I'm carrying {it}. I know. I know it's stupid. Ask me tomorrow and you'll get it.",
         dark="Not while I'm carrying {it}. Not out here. You wouldn't either, if you'd been out here longer."),
    dict(key='writes-it-down', kind='object',
         tell="does not say things out loud that can be written instead",
         lit="I'll write it. I don't say it, I write it. Give me a second, I'm using {it}.",
         dark="I'm not saying it out loud tonight. I'll put it down with {it} and you read it somewhere else."),
    dict(key='thinks-it-is-worth-something', kind='object',
         tell="talks about a sale that has not happened for a long time",
         lit="Ask me again once I've sold {it}. I'll have a nicer name by then. People say it nicer.",
         dark="The night I sell {it} I'm gone. You won't need to know what to call me."),
    dict(key='talks-about-it-instead', kind='object',
         tell="answers a question with an offer",
         lit="Sure, sure. Have you eaten? I've got {it}. That's not food, I know that. I was getting to the food.",
         dark="Don't need my name. Need you to take {it} and go on up the street. Please. Take it."),
    dict(key='narrates-themselves', kind='object',
         tell="says out loud what they are doing while they do it",
         lit="'They turn. They give the name. They are still holding {it}.' Sorry. I do that. I've been alone a lot.",
         dark="'They do not give the name. They are still holding {it}.' ...That's how it goes tonight."),
    dict(key='mishears-and-runs-with-it', kind='object',
         tell="answers the question they wanted rather than the one asked",
         lit="My what? Oh. I thought you said trade. I'd much rather talk trade. Look at {it}, go on.",
         dark="What? Speak up, I can't hear anything out here past {it} rattling in my coat."),
    # ---- PLACE -----------------------------------------------------------
    dict(key='swears-by-a-place', kind='place',
         tell="mentions the same location in every conversation regardless of subject",
         lit="Ask me at {p}. I'm better there. Everybody's better there, that's not just me.",
         dark="Not here. Come to {p} and I'll say it. I won't say it anywhere else, so."),
    dict(key='will-not-go-there', kind='place',
         tell="routes around one specific place, every time, without explaining",
         lit="You'll get it out of me anywhere except {p}. Don't ask, it's the stupidest reason you ever heard.",
         dark="It went wrong at {p}. You want a name, don't stand this close to {p}."),
    dict(key='slept-there-once', kind='place',
         tell="mentions a winter they do not elaborate on",
         lit="I slept a whole winter at {p}. Ask me anything except that and I'm an open book.",
         dark="I slept at {p}. I still hear it. Stand still a second. You hear it?"),
    dict(key='keeps-a-place-clean', kind='place',
         tell="tidies a public place nobody has asked them to tidy",
         lit="Give me a minute, I'm doing {p}. Nobody asked me. Somebody has to and nobody asked me.",
         dark="I still do {p}. Nobody comes through there any more. I still do it."),
    dict(key='waiting-at-a-place', kind='place',
         tell="looks past you toward the same direction while you talk",
         lit="I'm supposed to be met at {p}. Have been supposed to for a while now. It's fine.",
         dark="They're coming to {p}. They said so. You didn't see anybody at {p}, did you."),
    dict(key='gives-the-wrong-one-first', kind='place',
         tell="gives an answer with the air of somebody who has a second one ready",
         lit="The one I give first isn't the real one. Not a trick, just habit. Ask me again by {p}.",
         dark="You already got the one I give out. Ask again by {p}. If I'm still standing there."),
    dict(key='asks-yours-first', kind='place',
         tell="will not go first",
         lit="You go. That's the rule at {p} and I've decided it's the rule everywhere now.",
         dark="You first. Whoever was at {p} tonight got asked the same and they didn't answer either."),
    # ---- RITUAL ----------------------------------------------------------
    dict(key='finish-it-first', kind='ritual',
         tell="cannot be interrupted partway through a small routine",
         lit="Hang on, I'm {r}. You can't interrupt it. It doesn't work if you interrupt it.",
         dark="Don't. I'm {r}. If I lose count I start again and I don't want to be out here that long."),
    dict(key='apologises-for-it', kind='ritual',
         tell="does a small thing and apologises for it in the same motion",
         lit="Sorry. I know. I keep {r}. My mother did it, I hated it, and here we absolutely are.",
         dark="I keep {r}. I know exactly what it looks like. I'd stop if it were safe to stop."),
    dict(key='insists-you-do-it-too', kind='ritual',
         tell="expects other people to observe their routine and is genuinely wounded when they do not",
         lit="You didn't. You're meant to. Try {r}. Go on, I'll wait. There. Now we're properly introduced.",
         dark="You have to as well. Start {r}. I'm not telling you my name until you've done it."),
    dict(key='keeps-time-by-it', kind='ritual',
         tell="does not read clocks",
         lit="What day is it. No, don't tell me. I get it from {r}. That's how I know, and I'm never wrong.",
         dark="I get it from {r}. It's the only clock I trust and it's been wrong twice this week."),
    dict(key='remembers-everybody', kind='ritual',
         tell="greets people by trade before they have spoken",
         lit="I know yours already. I know everybody's on this block. It's {r}, that's the whole trick.",
         dark="I know yours. I know who's stopped being on this block, too. Six. It's {r}."),
]

# ===========================================================================
# THE CITATIONS. QUEST STUDY LAW / DIALOGUE ALWAYS REFERS TO THE CATALOGUE:
# a citation is a claim the machine checks, never a name-drop. Ids resolve
# against the index and titles are compared VERBATIM at build time.
# ===========================================================================
STUDY = [
    dict(id='Q013.W4', title='ABSURD WITH HEART (never JUST a gag)',
         applied="the corpus's rule is that the joke is the wrapper and the heart is the gift. "
                 "So no quirk here is a gag with nothing under it: every shape is a real human "
                 "core under collapse -- loneliness, pride, superstition, somebody kept waiting -- "
                 "and the funny half is only how it comes out of their mouth."),
    dict(id='Q013.W5', title='COMMITMENT TO THE BIT',
         applied="\"half-committed comedy dies.\" A quirk that only existed in one line would be "
                 "half-committed, so every one of these is authored TWICE as the same person and "
                 "carries a visible TELL as well as a line -- the bit is mechanical, not decorative, "
                 "and it survives being met a second time in worse light."),
    dict(id='Q014.W9', title='PERSONALITY AS THE PUZZLE',
         applied="\"reading WHO they are IS how you solve it -- characterization doubles as the "
                 "deduction mechanic.\" The quirk is the first true thing you ever learn about a "
                 "specific person here, and it arrives through the ask-their-name beat, so "
                 "characterisation and the game's one social verb are the same action."),
    dict(id='Q022.P4', title='W5 (humanize the functional',
         applied="\"nothing is just a system; everyone is someone.\" The valley's people were "
                 "scheduled bodies with faction voices: a Blue said Blue things and a scavenger "
                 "said scavenger things, and no individual said anything. This is the port of that "
                 "finding onto the generic cast rather than onto named quest-givers."),
    dict(id='Q031.X2', title='STRESS/BLEAKNESS IS RELENTLESS',
         applied="the corpus files unbroken bleakness as a FLAW, not a virtue: \"let the grimness "
                 "have texture + the occasional small warmth so it's endurable.\" The lit register "
                 "is that warmth, placed on the map rather than sprinkled -- it lives where the "
                 "power is on, which is where the player is actually safe."),
    dict(id='Q017.W3', title='READ-THE-PERSON (partly randomized)',
         applied="\"responses shuffle so you must READ the individual, not memorize.\" A quirk is "
                 "derived from the person's own three numbers, so it is stable for THAT human "
                 "forever and unguessable across humans -- you cannot learn the table, you can "
                 "only learn people."),
]


def load_index():
    with open(INDEX, 'r', encoding='utf-8') as f:
        return json.load(f)


def check_citations(idx):
    """A CITATION IS A CLAIM THE MACHINE CHECKS. Refuses to write on a bad id, a
    title that is not verbatim, a thin `applied`, or a set that does not span
    the corpus's own breadth requirement."""
    laws = idx['laws']
    studies, masters, bad = set(), set(), []
    for c in STUDY:
        e = laws.get(c['id'])
        if not e:
            bad.append(c['id'] + ' does not resolve')
            continue
        if e['title'].strip() != c['title'].strip():
            bad.append(c['id'] + ' title not verbatim: index has ' + repr(e['title']))
        if len(c['applied'].strip()) < 40:
            bad.append(c['id'] + ' applied is a name-drop, not a sentence')
        studies.add(e['study'])
        masters.add(e['kind'])
    if len(studies) < 2:
        bad.append('spans %d studies, needs >= 2' % len(studies))
    if len(masters) < 2:
        bad.append('spans %d masters, needs >= 2' % len(masters))
    if bad:
        sys.stderr.write('QUIRK FACTORY REFUSES TO WRITE:\n  ' + '\n  '.join(bad) + '\n')
        sys.exit(1)
    return sorted(studies), sorted(masters)


SLOT = {'object': '{it}', 'place': '{p}', 'ritual': '{r}'}


def check_specifics():
    """THE GRAMMAR CONTRACT, HALF ONE: the nouns. See the block comment above
    SPECIFICS for what each of these caught in the first build."""
    bad = []
    for kind, pool in SPECIFICS.items():
        if len(pool) != len(set(pool)):
            bad.append(kind + ' has a duplicate noun')
        for n in pool:
            if kind == 'object' and ',' in n:
                bad.append(repr(n) + ': an object phrase with a comma does not embed')
            if kind == 'ritual':
                if not re.match(r'^[a-z]+ing\b', n):
                    bad.append(repr(n) + ': a ritual must be a bare gerund')
                if re.search(r'\b(their|his|her|my|your)\b', n):
                    bad.append(repr(n) + ': a ritual must be person-neutral, it is spoken aloud')
            if n != n.strip() or n.endswith('.'):
                bad.append(repr(n) + ': a noun carries no sentence punctuation')
            if n[:1].isupper():
                bad.append(repr(n) + ': a noun is never capitalised, it is never sentence-initial')
    return bad


def check_shapes():
    """The typed half, plus THE GRAMMAR CONTRACT, HALF TWO.

    A shape declares which kind of noun it takes and its two lines must both
    actually USE that slot -- a shape with an unused slot is a line that reads
    identically for all sixteen nouns, which is the mad-lib failure the typing
    exists to prevent. And no slot may open a sentence, because a phrase written
    to sit after a verb reads as a fragment when it lands at a full stop, and
    substitution has no way to know the difference."""
    bad, seen = check_specifics(), set()
    for s in SHAPES:
        if s['key'] in seen:
            bad.append(s['key'] + ' duplicate key')
        seen.add(s['key'])
        if s['kind'] not in SPECIFICS:
            bad.append(s['key'] + ' unknown kind ' + s['kind'])
            continue
        slot = SLOT[s['kind']]
        for reg in ('lit', 'dark'):
            line = s[reg]
            if slot not in line:
                bad.append(s['key'] + ' ' + reg + ' never uses its ' + s['kind'] + ' slot')
            for other in SLOT.values():
                if other != slot and other in line:
                    bad.append(s['key'] + ' ' + reg + ' uses a slot it did not declare')
            # NO SLOT OPENS A SENTENCE. Start of line, or anything following a
            # terminator, is sentence-initial and refuses.
            for m in re.finditer(re.escape(slot), line):
                before = line[:m.start()]
                if not before.strip() or re.search(r'[.!?…]["\']?\s+$', before):
                    bad.append(s['key'] + ' ' + reg + ' opens a sentence with its noun')
        if s['lit'].strip() == s['dark'].strip():
            bad.append(s['key'] + ' lit and dark are the same line')
        if not s['tell'].strip():
            bad.append(s['key'] + ' has no tell')
        if '{' in s['tell']:
            bad.append(s['key'] + ' tell carries a slot: a tell is third person and the '
                                  'nouns are authored for a first-person mouth')
    if bad:
        sys.stderr.write('QUIRK FACTORY REFUSES TO WRITE:\n  ' + '\n  '.join(bad) + '\n')
        sys.exit(1)


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def build():
    idx = load_index()
    studies, masters = check_citations(idx)
    check_shapes()

    combos = sum(len(SPECIFICS[s['kind']]) for s in SHAPES)
    by_kind = {}
    for s in SHAPES:
        by_kind[s['kind']] = by_kind.get(s['kind'], 0) + 1

    # ---- the record he can read, and the source the WORDS tab harvests ----
    rec = {
        '_meta': {
            'what': 'ONE THING THAT IS THEIRS. Every person in the valley carries a quirk, '
                    'derived from the same three numbers they are derived from, delivered '
                    'through the ask-their-name beat.',
            'why': 'backlog PEOPLE 0t + tone research R1 finding 1: a character nobody laughed '
                   'with is a character nobody mourns.',
            'how': 'SHAPE x SPECIFIC, typed. Authored twice as the same person: the lit register '
                   'is the joke, the dark register is the same trait where the power stops.',
            'generated_by': 'tools/bohemia_quirk_factory.py',
            'draft': 'every line is a draft attempt under ALWAYS MAKE AN ATTEMPT (8/11). '
                     'Editable in the WORDS tab.',
            'shapes': len(SHAPES),
            'specifics': {k: len(v) for k, v in SPECIFICS.items()},
            'combinations': combos,
            'lines': len(SHAPES) * 2,
            'spans': {'studies': studies, 'masters': masters},
        },
        'quirks': [
            dict(id=s['key'], kind=s['kind'], tell=s['tell'], lit=s['lit'], dark=s['dark'],
                 draft=True, study=STUDY)
            for s in SHAPES
        ],
        'specifics': SPECIFICS,
    }
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(rec, f, ensure_ascii=False, indent=1)
        f.write('\n')

    # ---- the module ------------------------------------------------------
    L = []
    A = L.append
    A('// BOHEMIA QUIRK -- one thing that is theirs, and you meet it when you ask.')
    A('//')
    A('// GENERATED by tools/bohemia_quirk_factory.py. EDIT THE TOOL, NEVER THIS FILE.')
    A('//')
    A('// A CHARACTER NOBODY LAUGHED WITH IS A CHARACTER NOBODY MOURNS (tone research R1,')
    A('// finding 1). The valley had 58 bucket lines and 19 player-reactions and ZERO things')
    A('// that belonged to one specific human. Every Blue said the same five sentences.')
    A('//')
    A('// FUNNY AND SCARY ARE ONE DIAL. R1 finding 3, benign violation theory: humour is a')
    A('// violation appraised as SAFE, and the switch is perceived distance. LIGHT=TERRITORY')
    A('// already draws that switch across the map in 12% clustered power, so every quirk is')
    A('// authored TWICE AS THE SAME PERSON -- lit is the joke, dark is the same trait with')
    A('// the safety taken out. Never a different quirk. Never a different person.')
    A('//')
    A('// DERIVED, NEVER STORED. Same doctrine as bohemia_people.js: a person is')
    A('// (blockSeed, house, slot), so their quirk is too. Nothing saved, nothing to desync.')
    A('//')
    A('// CONTENTS ARE DRAFTS (ALWAYS MAKE AN ATTEMPT, 8/11). Every line is a real attempt,')
    A('// tagged draft:true in records/BOHEMIA_QUIRKS.json, editable in the WORDS tab. No')
    A('// person is named and no establishment is named -- both are Paolo\'s canon.')
    A('(function (root) {')
    A("  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');")
    A('')
    A('  /* THE TYPED NOUNS. A shape declares which of these it can read, so the machine')
    A('     can never hand a ritual to a shape that wanted a thing you can hold. */')
    A('  var SPECIFICS = {')
    for k in ('object', 'place', 'ritual'):
        A('    ' + k + ': [')
        for v in SPECIFICS[k]:
            A('      ' + js_str(v) + ',')
        A('    ],')
    A('  };')
    A('')
    A('  /* THE SHAPES. tell = what you can SEE (third person, never dialogue).')
    A('     lit/dark = what they SAY when you ask, on a powered block and off one. */')
    A('  var SHAPES = [')
    for s in SHAPES:
        A('    { key: ' + js_str(s['key']) + ', kind: ' + js_str(s['kind']) + ',')
        A('      tell: ' + js_str(s['tell']) + ',')
        A('      lit:  ' + js_str(s['lit']) + ',')
        A('      dark: ' + js_str(s['dark']) + ' },')
    A('  ];')
    A('')
    A('  var SLOT = { object: /\\{it\\}/g, place: /\\{p\\}/g, ritual: /\\{r\\}/g };')
    A('')
    A('  /* THE DERIVATION. bohemia_people.js hashes a key string with imul-31 and then')
    A('     mixes; mix32 is not exported, so the same documented pattern is restated here')
    A('     with the same constants and a DIFFERENT salt. Different on purpose: a person\'s')
    A('     quirk must not be correlated with the name they were given, or every ODELL in')
    A('     the valley would count lit windows.')
    A('     TWO INDEPENDENT STREAMS. The shape and the noun are drawn from separately mixed')
    A('     words, because drawing both off one number makes shape and noun move together --')
    A('     which reads, on a block, as three people with the same bit. */')
    A('  function mix32(h) {')
    A('    h = (h ^ (h >>> 16)) >>> 0;')
    A('    h = Math.imul(h, 0x85ebca6b) >>> 0;')
    A('    h = (h ^ (h >>> 13)) >>> 0;')
    A('    h = Math.imul(h, 0xc2b2ae35) >>> 0;')
    A('    return (h ^ (h >>> 16)) >>> 0;')
    A('  }')
    A('  function strHash(key) {')
    A('    var h = 0, s = String(key == null ? "" : key);')
    A('    for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;')
    A('    return h >>> 0;')
    A('  }')
    A('  var SALT_SHAPE = 0x71717 >>> 0;   /* not 0x9e3779b9: that is generatedName\'s */')
    A('  var SALT_NOUN  = 0x1d3f5b >>> 0;')
    A('')
    A('  /* THE ONE LOOKUP. Takes a person, a person KEY, or anything with .key. */')
    A('  function keyOf(who) {')
    A('    if (who == null) return null;')
    A("    if (typeof who === 'string') return who;")
    A('    return who.key || null;')
    A('  }')
    A('  /* THE ONE PLACE SUBSTITUTION HAPPENS. Both the plain draw and the block spread')
    A('     come through here, so a person met on the card and the same person counted in')
    A('     the spread can never be rendered by two different bits of code. */')
    A('  function render(key, s, noun) {')
    A('    return { key: key, shape: s.key, kind: s.kind, specific: noun,')
    A('             tell: s.tell,')
    A('             lit:  s.lit.replace(SLOT[s.kind], noun),')
    A('             dark: s.dark.replace(SLOT[s.kind], noun) };')
    A('  }')
    A('  function quirkOf(who) {')
    A('    var key = keyOf(who);')
    A('    if (!key) return null;')
    A('    var h = strHash(key);')
    A('    var s = SHAPES[mix32((h ^ SALT_SHAPE) >>> 0) % SHAPES.length];')
    A('    var pool = SPECIFICS[s.kind];')
    A('    return render(key, s, pool[mix32((h ^ SALT_NOUN) >>> 0) % pool.length]);')
    A('  }')
    A('')
    A('  /* ---- NOBODY ON YOUR BLOCK HAS YOUR BIT --------------------------------')
    A('     MEASURED, not assumed: 304 combinations drawn 32 times (one block of people)')
    A('     is a BIRTHDAY PROBLEM, and it lands where the maths says -- 1.63 duplicate')
    A('     pairs per block on average and SEVEN on the worst block in 300. The hash is')
    A('     fine; all 22 shapes and all 304 combinations come out evenly. The POOL is just')
    A('     smaller than a block, and it always will be, because a bigger pool only moves')
    A('     the number instead of removing it.')
    A('')
    A('     So the guarantee is made EXACT instead of probabilistic. Hand this the keys of')
    A('     everybody on a block and it walks them in sorted order -- sorted so the answer')
    A('     can never depend on which order the caller happened to iterate -- and moves')
    A('     anybody who landed on a taken combination to the next free one.')
    A('')
    A('     IT ADVANCES THE NOUN BEFORE THE SHAPE, on purpose. Four people on a block who')
    A('     all drew `finish-it-first` become four people with four different routines,')
    A('     which is a street. Four people pushed onto four different shapes would flatten')
    A('     the shape distribution to hide a collision nobody would have seen.')
    A('')
    A('     STILL DERIVED, STILL STORES NOTHING. Same block, same people, same answer, on')
    A('     any device, on any load. */')
    A('  function spreadOver(keys) {')
    A('    var out = {}, taken = {}, list = [], i;')
    A('    for (i = 0; i < (keys || []).length; i++) {')
    A('      var k = keyOf(keys[i]);')
    A('      if (k && !out.hasOwnProperty(k)) { out[k] = null; list.push(k); }')
    A('    }')
    A('    list.sort();')
    A('    for (i = 0; i < list.length; i++) {')
    A('      var q = quirkOf(list[i]), placed = null;')
    A('      var tries = candidatesFor(q);')
    A('      for (var t = 0; t < tries.length; t++) {')
    A('        var id = tries[t].shape.key + "\\u0000" + tries[t].noun;')
    A('        if (taken[id]) continue;')
    A('        taken[id] = 1;')
    A('        placed = render(list[i], tries[t].shape, tries[t].noun);')
    A('        break;')
    A('      }')
    A('      /* MORE PEOPLE THAN COMBINATIONS is not a bug to hide: with the pool spent the')
    A('         honest answer is the person\'s own draw, and the caller gets a duplicate it')
    A('         can see rather than a silent reshuffle. */')
    A('      out[list[i]] = placed || q;')
    A('    }')
    A('    return out;')
    A('  }')
    A('  /* EVERY COMBINATION, IN THE ORDER THIS PERSON WOULD PREFER IT: their own draw')
    A('     first, then the rest of their own shape\'s nouns, then every other shape. One')
    A('     flat list, taken in order -- no arithmetic to get wrong. */')
    A('  function candidatesFor(q) {')
    A('    var out = [], i, j, si = 0, ni = 0;')
    A('    for (i = 0; i < SHAPES.length; i++) if (SHAPES[i].key === q.shape) si = i;')
    A('    var own = SPECIFICS[SHAPES[si].kind];')
    A('    for (j = 0; j < own.length; j++) if (own[j] === q.specific) ni = j;')
    A('    for (j = 0; j < own.length; j++)')
    A('      out.push({ shape: SHAPES[si], noun: own[(ni + j) % own.length] });')
    A('    for (i = 1; i < SHAPES.length; i++) {')
    A('      var sh = SHAPES[(si + i) % SHAPES.length], pool = SPECIFICS[sh.kind];')
    A('      for (j = 0; j < pool.length; j++)')
    A('        out.push({ shape: sh, noun: pool[(ni + j) % pool.length] });')
    A('    }')
    A('    return out;')
    A('  }')
    A('')
    A('  /* WHAT THEY SAY WHEN YOU ASK. The CALLER decides `dark`, because what counts as')
    A('     dark belongs to the surface, not to a word table.')
    A('     AND THE WALKED SURFACE LEARNED THIS THE HARD WAY, so do not re-derive it:')
    A('     "on a live circuit" ALONE is the wrong question. Measured on the real city,')
    A('     358 of 9,216 valley tiles are live (3.9%) and 131 of 5,007 people live on one')
    A('     (2.6%) -- so a register decided by the power grid alone makes 97.4% of every')
    A('     conversation the dark one and the joke never plays. An unpowered lot at noon is')
    A('     a lot. The city asks `isNight() && !POWER.live`, which is the same test its own')
    A('     renderer uses to decide whether a room is dark. Ask it that way. */')
    A('  function lineFor(who, dark) {')
    A('    var q = quirkOf(who);')
    A('    return q ? (dark ? q.dark : q.lit) : null;')
    A('  }')
    A('  /* WHAT YOU CAN SEE. Third person, no quotes, same in any light -- a habit does')
    A('     not change with the power, only what it sounds like does. */')
    A('  function tellFor(who) {')
    A('    var q = quirkOf(who);')
    A('    return q ? q.tell : null;')
    A('  }')
    A('  function count() {')
    A('    var n = 0;')
    A('    for (var i = 0; i < SHAPES.length; i++) n += SPECIFICS[SHAPES[i].kind].length;')
    A('    return n;')
    A('  }')
    A('')
    A('  var API = { VERSION: ' + js_str('8.19.26') + ', SHAPES: SHAPES, SPECIFICS: SPECIFICS,')
    A('              quirkOf: quirkOf, spreadOver: spreadOver,')
    A('              lineFor: lineFor, tellFor: tellFor, count: count };')
    A('  if (HASREQ) module.exports = API; else root.BohemiaQuirk = API;')
    A("})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));")
    A('')

    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L))

    print('QUIRK FACTORY')
    print('  shapes      %d  (%s)' % (len(SHAPES), ', '.join(
        '%s:%d' % (k, by_kind.get(k, 0)) for k in ('object', 'place', 'ritual'))))
    print('  specifics   %d object, %d place, %d ritual'
          % (len(SPECIFICS['object']), len(SPECIFICS['place']), len(SPECIFICS['ritual'])))
    print('  quirks      %d distinct, each authored in TWO registers = %d utterances'
          % (combos, combos * 2))
    print('  authored    %d lines + %d tells + %d nouns'
          % (len(SHAPES) * 2, len(SHAPES),
             sum(len(v) for v in SPECIFICS.values())))
    print('  cites       %d findings, %d studies, %d masters (%s)'
          % (len(STUDY), len(studies), len(masters), ', '.join(masters)))
    print('  wrote       engine/bohemia_quirk.js, records/BOHEMIA_QUIRKS.json')


if __name__ == '__main__':
    build()

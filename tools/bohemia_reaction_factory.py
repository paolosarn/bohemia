#!/usr/bin/env python3
"""BOHEMIA REACTION FACTORY -- what people say BECAUSE OF WHAT YOU DID.

Paolo: "we are trying to create the best funnest deepest videogame ever."

DEPTH IS REACTIVITY, AND THE NUMBER IS PUBLISHED. Hades ships four bosses and
about 21,020 reactive lines; the reason it feels bottomless is not content
volume for its own sake, it is that the game KNOWS WHAT YOU JUST DID AND WHO
SAW IT, and somebody mentions it. Bohemia already computes both halves and has
never had a word to say about either.

WHAT ALREADY EXISTS AND WAS MUTE:
  engine/bohemia_standing.js  RUNGS -- HOSTILE / COLD / NEUTRAL / WARM / FWU.
     A real per-person, per-faction standing.
  engine/bohemia_deeds.js     witness() -- WHO ACTUALLY SAW IT, with the deed's
     own loudness (#quiet / #notable / #risky / #reckless) deciding how far the
     news carries and how many hops of gossip it earns. Paolo's own 7/21 law,
     RECKLESS BEATS QUIET, finally applied to reputation on 8/6.
  engine/bohemia_people.js    makeLedger -- per person: how many times you have
     met, whether you ASKED them their name, whether you were HONEST.
Three systems that know exactly what a person thinks of you and why, feeding a
mouth that said the same ambient line to everybody.

THIS IS THE WORDS FOR ALL THREE. Nothing new is computed and no state is
invented: every key below is a value one of those modules already produces.

THE CORPUS ON REACTIVITY, cited per bucket:
  Q002.N4 NODE HECK_PAYOUT -- "Same node, six different texts, depending on WHAT
    you tell him and WHETHER Ted is alive and WHAT Ted saw." The catalogue's
    cleanest statement of the thing: one moment, many texts, chosen by what the
    world actually knows.
  Q038.P5 -- taboo and extreme acts carry coherent, SEVERE, PERSISTENT
    consequences. A reckless deed should still be in somebody's mouth later.
  Q043.W4 AMBIENT BANTER AS CHARACTERIZATION -- overheard relationships, the
    best return a solo dev has.
  Q010.W8 FORESHADOW-IN-HINDSIGHT -- a line that only lands later.
  Q031.W3 SCARCITY WEAPONIZES COMPASSION AGAINST YOUR OWN.
  Q025.W5 THE BANALITY OF EVIL.

MECHANISM-MINE / CONTENTS-PAOLO'S, as amended 8/11: every line is a draft
tagged draft:true, reachable and rewritable in the WORDS tab. Nothing here
decides anything -- no names, no deaths, no faction ground, no numbers.

  python3 tools/bohemia_reaction_factory.py
Gate: gates/dialogue_catalogue_gate.js (reactions section)
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records', 'BOHEMIA_REACTIONS.json')
PEOPLE = os.path.join(ROOT, 'engine', 'bohemia_people.js')
IDX = os.path.join(ROOT, 'records', 'BOHEMIA_QUESTBOOK_LAW_INDEX.json')
STANDING = os.path.join(ROOT, 'engine', 'bohemia_standing.js')
LOOP = os.path.join(ROOT, 'engine', 'bohemia_loop.js')

CITES = {
    'sixtexts': ('Q002.N4', 'NODE HECK_PAYOUT',
                 'the corpus\'s cleanest statement of reactivity: ONE node, six different '
                 'texts, chosen by what you told him, whether Ted is alive, and what Ted '
                 'saw. Every key in this file is a fact the world already knows, and the '
                 'line is chosen by it rather than by a die roll.'),
    'persist':  ('Q038.P5', 'W6/W7/W9 (narrative consistency + persistent reputation + pursuing consequence',
                 'the banked principle is that extreme acts carry coherent, SEVERE and '
                 'PERSISTENT consequences. A reckless deed is still in somebody\'s mouth '
                 'days later, and that is what makes standing worth playing around.'),
    'banter':   ('Q043.W4', 'AMBIENT BANTER AS CHARACTERIZATION',
                 'the cast comes alive through overheard relationships rather than quest '
                 'text. These are people talking about you, mostly not to you.'),
    'hind':     ('Q010.W8', 'FORESHADOW-IN-HINDSIGHT',
                 'a line that only lands later. Somebody being wrong about you in front of '
                 'you is the cheapest version of that there is.'),
    'scarce':   ('Q031.W3', 'SCARCITY WEAPONIZES COMPASSION AGAINST YOUR OWN',
                 'mercy to a stranger endangers your own, so a favour done for you is a '
                 'risk somebody took, and it shows in how they talk afterwards.'),
    'banal':    ('Q025.W5', 'THE BANALITY OF EVIL',
                 'the mundane administration of an unjust order. Hostility here is '
                 'procedural, not theatrical -- you are a problem being processed.'),
}

# ---------------------------------------------------------------------------
# KEYS. Every one is a value a shipped module already produces:
#   rung:<R>       engine/bohemia_standing.js RUNGS
#   saw:<clout>    engine/bohemia_deeds.js witness(), clout from bohemia_loop.js
#   heard:<clout>  same, but it reached them by gossip hops rather than sight
#   met:<state>    engine/bohemia_people.js makeLedger
REACTIONS = {
 # ---- WHERE YOU STAND WITH THEM --------------------------------------------
 'rung:HOSTILE': (['banal', 'persist'], [
    "No. Whatever it is, no.",
    "You've got a lot of road to be walking down this one.",
    "I know what you did. Everybody on this street knows what you did.",
    "Don't stand where I can see you.",
    "There's nothing here for you. There's nothing here for you tomorrow either.",
    "You come back with the whole block behind you or you don't come back.",
 ]),
 'rung:COLD': (['banal', 'hind'], [
    "I'm not going to be rude about it. I'm just not going to help.",
    "We're square. Let's keep it that way.",
    "I heard. I'm not going to say what I heard.",
    "You'll want to talk to somebody else.",
    "It's not personal. It's just recent.",
 ]),
 'rung:NEUTRAL': (['banter'], [
    "You're the one who's been around.",
    "I don't know you well enough to have an opinion and that's fine by me.",
    "Ask. I might answer.",
    "Haven't decided about you yet.",
 ]),
 'rung:WARM': (['scarce', 'banter'], [
    "There's a chair. Sit in it.",
    "You've been decent to people I like. That travels.",
    "Take it. Pay me back whenever, or don't.",
    "I put a word in for you. Didn't have to. Did anyway.",
    "You need something, you ask me before you ask a stranger.",
 ]),
 'rung:FWU': (['scarce', 'persist'], [
    "Anything I have. I mean that and I'd rather you didn't test it.",
    "You're not a guest here. Stop knocking.",
    "Half this block would stand up for you and the other half doesn't know you yet.",
    "Whatever happens, you've got a door here.",
 ]),

 # ---- THEY SAW IT THEMSELVES -----------------------------------------------
 'saw:quiet': (['sixtexts', 'banter'], [
    "I saw. I don't think anybody else did.",
    "You handled that without a crowd. I noticed.",
    "Nobody's going to hear it from me.",
    "Quiet work. Rarer than you'd think.",
 ]),
 'saw:notable': (['sixtexts', 'persist'], [
    "I was standing right there.",
    "Half the block watched you do that.",
    "People are going to be talking about that at dinner.",
    "You didn't hide it. I don't know yet if that was brave or stupid.",
 ]),
 'saw:risky': (['sixtexts', 'persist'], [
    "You could have got somebody killed doing that.",
    "I saw it and I've been thinking about it since.",
    "That was a lot. That was a LOT.",
    "I'm not saying you were wrong. I'm saying my hands were shaking.",
 ]),
 'saw:reckless': (['sixtexts', 'persist', 'banal'], [
    "I was there. I'll be answering questions about it for a month.",
    "Whatever you were trying to prove, you proved it.",
    "You did that in front of children.",
    "I can't unsee it and neither can anybody else on that corner.",
    "There's no walking that back. You know that, right?",
 ]),

 # ---- IT REACHED THEM SECOND-HAND -------------------------------------------
 'heard:quiet': (['sixtexts', 'hind'], [
    "Somebody mentioned you. Only somebody.",
    "I heard a version of it. Probably the wrong version.",
 ]),
 'heard:notable': (['sixtexts', 'banter'], [
    "You're the one from the thing.",
    "It got to me third-hand and it still had your name on it.",
    "I've heard two different stories about you this week.",
 ]),
 'heard:risky': (['sixtexts', 'persist'], [
    "Word came up this way about you. It didn't lose anything on the trip.",
    "I heard, and I heard who was standing near you when it happened.",
 ]),
 'heard:reckless': (['persist', 'banal'], [
    "Everybody's heard. That's the whole point of what you did, isn't it.",
    "Two blocks and a caravan and it still got here before you.",
    "I'd never met you and I already had an opinion.",
 ]),

 # ---- WHAT THEY REMEMBER OF YOU PERSONALLY ---------------------------------
 'met:first': (['banter'], [
    "Don't think we've done this.",
    "New. Alright.",
    "I'll get your name eventually or I won't.",
 ]),
 'met:again': (['banter', 'hind'], [
    "You. Again.",
    "That's twice. Three times and I'll learn your name.",
    "Still walking around, I see.",
 ]),
 'met:known': (['scarce', 'banter'], [
    "There he is.",
    "I was wondering when you'd come back around.",
    "Same as always? Course it is.",
 ]),
 'met:asked': (['banter'], [
    "You asked. Most people don't ask.",
    "You remembered. That's not nothing here.",
 ]),
 'met:honest': (['scarce', 'persist'], [
    "You told me straight when you didn't have to.",
    "I've been lied to by better dressed people than you. You didn't.",
 ]),
 'met:lied': (['persist', 'banal'], [
    "You told me a thing that wasn't true and I found out on my own.",
    "I'm not angry. I'm just done taking your word.",
 ]),
}


def main():
    idx = json.load(open(IDX, encoding='utf-8'))
    laws = idx['laws']
    bad = []
    for k, (cid, title, applied) in CITES.items():
        e = laws.get(cid)
        if not e:
            bad.append(cid + ' (missing)')
        elif str(e.get('title', '')).strip() != title.strip():
            bad.append('%s title is "%s", corpus says "%s"' % (cid, title, e.get('title')))
    if bad:
        raise SystemExit('citations do not check out: ' + '; '.join(bad))

    # THE KEYS MUST BE THE WORLD'S OWN, or a reaction is a line that never fires.
    # Read the rung names and the clout tags off the shipped modules rather than
    # retyping them -- retyping is exactly how a table drifts out of the world.
    st = open(STANDING, encoding='utf-8').read()
    m = re.search(r'var RUNGS=\[(.*?)\];', st, re.S)
    rungs = re.findall(r"\['([A-Z]+)'", m.group(1)) if m else []
    lp = open(LOOP, encoding='utf-8').read()
    m2 = re.search(r'CLOUT_WEIGHTS\s*=\s*\{([^}]*)\}', lp)
    clouts = re.findall(r'(\w+)\s*:', m2.group(1)) if m2 else []
    if not rungs or not clouts:
        raise SystemExit('could not read RUNGS / CLOUT_WEIGHTS off the shipped modules')

    alien = []
    for key in REACTIONS:
        head, _, tail = key.partition(':')
        if head == 'rung' and tail not in rungs:
            alien.append(key + ' (rungs are ' + '/'.join(rungs) + ')')
        if head in ('saw', 'heard') and tail not in clouts:
            alien.append(key + ' (clouts are ' + '/'.join(clouts) + ')')
    if alien:
        raise SystemExit('keys the world never produces: ' + '; '.join(alien))

    out, n = {}, 0
    for key in sorted(REACTIONS):
        cks, lines = REACTIONS[key]
        rows = []
        for i, t in enumerate(lines):
            rows.append({'id': key + '#' + str(i), 'text': t, 'draft': True,
                         'study': [{'id': CITES[c][0], 'title': CITES[c][1],
                                    'applied': CITES[c][2]} for c in cks]})
            n += 1
        out[key] = rows

    payload = {
        '_meta': {
            'what': 'What people say BECAUSE OF WHAT YOU DID -- keyed to standing, to '
                    'whether they saw it or only heard it, and to what they remember of you.',
            'why': 'Depth is reactivity. Hades ships ~21,020 reactive lines because the game '
                   'knows what you just did and who saw it. Bohemia computes both already '
                   '(bohemia_standing.js RUNGS, bohemia_deeds.js witness(), '
                   'bohemia_people.js makeLedger) and had no words for any of it.',
            'generator': 'tools/bohemia_reaction_factory.py',
            'keys': 'rung:<' + '|'.join(rungs) + '>  saw:<' + '|'.join(clouts) +
                    '>  heard:<same>  met:<first|again|known|asked|honest|lied>',
            'read_from': 'RUNGS off engine/bohemia_standing.js, clout tags off '
                         'engine/bohemia_loop.js -- never retyped here',
            'buckets': len(out), 'lines': n,
        },
        'reactions': out,
    }
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)

    # ---- WIRE IT: REACTION BEATS AMBIENT ---------------------------------
    src = open(PEOPLE, encoding='utf-8').read()
    flat = {k: [r['text'] for r in v] for k, v in out.items()}
    table = json.dumps(flat, ensure_ascii=False, indent=2)
    block = (
        '  // ---- REACTIONS -- WHAT THEY SAY BECAUSE OF WHAT YOU DID -------------\n'
        '  // Generated by tools/bohemia_reaction_factory.py. DO NOT HAND-EDIT.\n'
        '  // Depth is reactivity. Three shipped systems already know exactly what a\n'
        '  // person thinks of you and why -- standing RUNGS, deeds witness() (who\n'
        '  // actually SAW it, and how far its loudness carried), and the ledger (how\n'
        '  // many times you have met, whether you asked, whether you were honest) --\n'
        '  // and all three fed a mouth that said the same ambient line to everybody.\n'
        '  // Every key here is a value one of those modules already produces; the\n'
        '  // factory reads the rung names and clout tags OFF those modules rather\n'
        '  // than retyping them, because a retyped key is a line that never fires.\n'
        '  var REACTIONS = ' + table + ';\n'
    )
    if 'var REACTIONS = ' in src:
        src = re.sub(r'  // ---- REACTIONS[\s\S]*?\n  var REACTIONS = [\s\S]*?;\n', block, src, count=1)
    else:
        src = src.replace('  // ---- THE FOUR WORDS THE WORLD ALREADY USES',
                          block + '\n  // ---- THE FOUR WORDS THE WORLD ALREADY USES', 1)

    old = "      var pick = LINES[person.key]\n"
    new = ("      /* *** A REACTION BEATS AN AMBIENT LINE, ALWAYS. *** Somebody who watched\n"
           "         you do something reckless yesterday does not open with the weather.\n"
           "         Most specific first: what they SAW, then what they HEARD, then where\n"
           "         you STAND with them, then what they remember of you, and only then\n"
           "         the ambient buckets. Every one of these is a value a shipped module\n"
           "         already computes -- nothing here invents a fact about the player. */\n"
           "      var saw = (opts && opts.saw) || null;      // deeds.witness(), by clout\n"
           "      var heard = (opts && opts.heard) || null;  // same, reached by gossip\n"
           "      var rung = (opts && opts.rung) || null;    // standing.js RUNGS\n"
           "      var met = (opts && opts.met) || null;      // people.js makeLedger\n"
           "      var pick = (saw && REACTIONS['saw:' + saw])\n"
           "        || (heard && REACTIONS['heard:' + heard])\n"
           "        || (rung && REACTIONS['rung:' + rung])\n"
           "        || (met && REACTIONS['met:' + met])\n"
           "        || LINES[person.key]\n")
    src = src.replace(old, new)
    src = src.replace('    makeLedger: makeLedger, clock: clock,',
                      '    makeLedger: makeLedger, clock: clock, REACTIONS: REACTIONS,')
    with open(PEOPLE, 'w', encoding='utf-8') as f:
        f.write(src)

    print('REACTION FACTORY: %d lines in %d buckets' % (n, len(out)))
    print('  rungs read off standing.js : ' + '/'.join(rungs))
    print('  clouts read off loop.js    : ' + '/'.join(clouts))
    print('  -> ' + os.path.relpath(OUT, ROOT))
    print('  -> engine/bohemia_people.js  (REACTIONS wired ABOVE the ambient lines)')


if __name__ == '__main__':
    main()

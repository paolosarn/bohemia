#!/usr/bin/env python3
"""BOHEMIA INTRODUCTIONS -- the sixteen ways you come to know somebody (8/12/26, PEOPLE lane)

Paolo, 8/12: "lets do more than faction memeory please."

Fair. Six turns of this lane went into what factions REMEMBER about you. This is
the other half and it is the half he has already written: HOW YOU MEET THEM.

WHAT WAS SITTING THERE UNREAD. Every one of the sixteen faction dossiers
(records/factions/*.md, thumbed UP 8/2/26) carries a section called WHEN YOU ASK
THEIR NAME, and every one of them describes a DIFFERENT MECHANIC. Not flavour --
mechanic. Half of them say the word:

    TRADES     "HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED, which makes
                the Trades the one faction where the earned-name mechanic is
                earned with WORK instead of words."
    MOB        "Ask directly and you get a polite non-answer plus a small
                permanent mark against you for not knowing how this works."
    CARTEL     "The one faction where the name mechanic runs backwards."
    BLUES      "the earned-name mechanic is gated by REPUTATION rather than by
                conversation."

And the game does ONE thing for all of them: you press "Ask their name" and you
get a full name. Sixteen authored mechanics, one uniform button. That is the
authored-but-unread disease (gates/authored_unread_gate.py, this lane, 8/9) at
the largest scale it has ever been in this repo -- 1,089 lines of approved canon
and the only two files that had ever opened them were the generator that wrote
them and the gate that checks they exist.

THIS IS ALSO WHAT HE MEANT ON 8/12 BY THE PHILOSOPHICAL CLOTHES:

    "when I said different clothes, I meant it kind of in a philosophical way as
     well like it's just dressed differently... it's bigger than that."

Meeting a stranger is the single most repeated act in the game. The Church takes
your name before you can ask for theirs and never forgets it. The Trades give you
a trade and you buy the name with two jobs. The Mob will not be asked at all --
somebody vouches or you stay a stranger, and asking marks you. Same act, sixteen
sets of clothes. That is the ruling made mechanical.

MECHANISM-MINE / CONTENTS-PAOLO'S, and the line is sharp here:
  - the MECHANIC VOCABULARY (opener / first / earn / cost, and the state machine
    that runs them) is mine.
  - WHICH faction does WHICH is 100% his, thumbed 8/2, and it is not typed by
    hand in this file: every rule below carries an ANCHOR, a verbatim fragment of
    its own dossier, and this generator REFUSES TO RUN if the anchor is not found
    in the dossier it claims to come from. Reword the canon and this dies until a
    human re-reads it. That is what stops the shape drifting off the words.
  - NO NAMES, NO LINES, NO WORDS ARE INVENTED. Every label the mechanic shows is
    derived from something the engine already owns (the generated name, the role
    word, the faction's own name, the person's work line). This module has no
    dialogue table and the gate fails if it grows one -- LINES is Paolo's and
    people_gate.js already guards it.

REUSE CHECK (7/22 law):
  - records/factions/*.md ......... USED. Opened, parsed, and the canon sentence
    is carried into the baked module verbatim. This is the whole point.
  - engine/bohemia_people.js ...... READ. The labels reuse its generatedName
    stream, its ROLE_WORDS, its tier vocabulary. No name pool is cooked here.
  - engine/bohemia_dress.js ....... OPENED IN CODE, parsed for the FACTION_LOOK
    colours the page paints each card's dot with. His 8/2 palette, not a new one.
  - engine/bohemia_introductions.js ... OPENED IN CODE and inlined whole into the
    page, so what he looks at is the REAL organ running (VERIFY ON THE REAL
    SURFACE, 7/18). A judge page that re-implements the system is a lie about it.
  - slices/BOHEMIA_WHAT_IT_COST_8_11_26.html ... COPIED BY HAND, NOT BY CODE, and
    saying otherwise would be the exact overclaim this law exists to stop. Its
    shell (dark palette, SUN MODE toggle, card grammar) was retyped into the
    template below because he already knows how to read that page. No bytes of it
    are opened at build time and none are lifted.
  - nothing is drawn. This cooks TEXT and one baked module.

  python3 tools/bohemia_introductions.py

Writes: engine/bohemia_introductions.js                    (the organ)
        records/BOHEMIA_INTRODUCTIONS.json                 (machine copy)
        slices/BOHEMIA_THE_SIXTEEN_INTRODUCTIONS_8_12_26.html  (the page)

Law:  laws/BOHEMIA_ADDENDUM_THE_SIXTEEN_INTRODUCTIONS_8_12_26.md
Gate: gates/introductions_gate.js
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
DOSSIERS = os.path.join(ROOT, 'records', 'factions')
OUT_JS = os.path.join(ROOT, 'engine', 'bohemia_introductions.js')
OUT_JSON = os.path.join(ROOT, 'records', 'BOHEMIA_INTRODUCTIONS.json')
OUT_HTML = os.path.join(ROOT, 'slices', 'BOHEMIA_THE_SIXTEEN_INTRODUCTIONS_8_12_26.html')

# ---------------------------------------------------------------------------
# THE MECHANIC VOCABULARY. Four axes, and between them they express all sixteen
# without a single special case in the runtime.
#
#   opener  WHO MOVES FIRST.
#     you-ask         nothing happens until the player asks.            (default)
#     they-offer      it arrives unprompted on the first meeting.
#     they-ask-first  they ask YOU something before you can ask them.
#     third-party     you are introduced or you are not; asking is the mistake.
#     they-know-yours they use YOUR name. You never gave it.
#
#   first   WHAT THE FIRST CONTACT ACTUALLY GIVES YOU. A handle, not a name,
#           unless it says full-name.
#     full-name  surname  given-only  trade-word  group-name
#     name+route  name+terms  name+position  your-own-name  nothing
#
#   earn    WHAT TURNS THE HANDLE INTO THE NAME.
#     none-needed (you already have it)  ask  work  vouch  standing
#     honesty  overheard  never
#
#   cost    WHAT GETTING IT WRONG COSTS YOU.
#     none  insult-once  permanent-mark  on-a-list  ends-conversation
#     never-again  refused
#           `cost_on` says WHICH wrong move is charged for -- 'ask' (the default,
#           and the one the button can make) or 'lie'. The Homeless price is for
#           lying about where you sleep, not for asking, and hanging it off the
#           ask button would have put a threat on the wrong action. 'meet' charges
#           at the first meeting (a Karen writes your name down whether you ask her
#           anything or not) and 'blocked' charges only on the one forbidden
#           question (asking a Red who they answer to).
#
# `asks` is the question THEY put to YOU when opener is they-ask-first. All three
# are verbatim canon; none is invented.
# ---------------------------------------------------------------------------

RULES = [
    dict(
        key='REMNANTS', faction='THE REMNANTS',
        opener='you-ask', first='surname', earn='overheard', cost='none',
        next='HEAR SOMEBODY ELSE USE IT',
        anchor='THEY GIVE YOU A SURNAME ON THE FIRST ASK AND A FIRST NAME ALMOST NEVER',
        mech='A surname is what goes on a roster and a roster is public. The '
             'first name arrives from somebody ELSE, or never.',
    ),
    dict(
        key='CARTEL', faction='THE CARTEL',
        opener='they-know-yours', first='your-own-name', earn='never', cost='refused',
        next='NOTHING. EVER.',
        anchor='THEY KNOW YOUR NAME BEFORE YOU ASK THEIRS, AND YOU NEVER GET THEIRS',
        mech='The mechanic runs backwards. Being KNOWN is the threat, and asking '
             'gets a smile and a redirect every time, forever.',
    ),
    dict(
        key='NETWORK', faction='THE NETWORK',
        opener='they-offer', first='full-name', earn='none-needed', cost='none',
        next='NOTHING TO EARN. THAT IS THE TELL.',
        anchor='THEY GIVE YOU THEIR NAME UNPROMPTED, ON THE FIRST MEETING, WARMLY',
        mech='Everyone else in the valley has to be asked. This is the only '
             'faction that hands it over before you open your mouth.',
    ),
    dict(
        key='HOMELESS', faction='THE HOMELESS',
        opener='they-ask-first', first='nothing', earn='honesty', cost='never-again',
        cost_on='lie',   # the price is for LYING, not for asking. See COST_ON below.
        asks='WHERE YOU SLEEP',
        next='ANSWER WHERE YOU SLEEP, HONESTLY',
        anchor='THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP',
        mech='The real question: competition, weather-literate, or about to die. '
             'Answer honestly and the name follows on its own. Lie and you never '
             'get either.',
    ),
    dict(
        key='MOB', faction='THE MOB',
        opener='third-party', first='nothing', earn='vouch', cost='permanent-mark',
        next='BE INTRODUCED BY SOMEBODY WHO VOUCHES',
        anchor='YOU ARE INTRODUCED, YOU DO NOT ASK',
        mech='A third person supplies the name and that person is vouching. Ask '
             'directly and you get a polite non-answer plus a small permanent '
             'mark for not knowing how this works.',
    ),
    dict(
        key='CARAVANS', faction='THE CARAVANS',
        opener='they-offer', first='name+route', earn='none-needed', cost='none',
        next='NOTHING TO EARN. BEING KNOWN IS THEIR ARMOUR.',
        anchor='THE NAME COMES WITH A ROUTE, UNPROMPTED, BECAUSE BEING KNOWN IS THEIR ARMOUR',
        mech='A caravanner who will not give their name and their run is one '
             'nobody vouches for. Treat that as the warning it is.',
    ),
    dict(
        key='CHURCH', faction='THE CHURCH',
        opener='they-ask-first', first='nothing', earn='ask', cost='none',
        asks='YOUR NAME',
        next='ASK. THEY WILL ANSWER, AND THEY WILL NEVER FORGET YOURS.',
        anchor='THEY ASK YOUR NAME FIRST, BEFORE YOU CAN ASK THEIRS, AND THEN THEY NEVER FORGET IT',
        mech='The one faction that inverts the mechanic by moving first, and the '
             'payoff is real: met once and walked away from, they greet you by '
             'name a year later, in front of people.',
        remembers=True,
    ),
    dict(
        key='VOLUNTEERS', faction='THE VOLUNTEERS',
        opener='they-ask-first', first='nothing', earn='ask', cost='none',
        asks='WHAT HURTS',
        next='ASK. IT ARRIVES INSTANTLY AND WITHOUT CEREMONY.',
        anchor='THEY DO NOT ASK YOUR NAME. THEY ASK WHAT HURTS',
        mech='You can know a Volunteer for a month of game time without learning '
             'what to call them, because they genuinely never got round to it.',
    ),
    dict(
        key='TRADES', faction='THE TRADES',
        opener='you-ask', first='trade-word', earn='work', earn_n=2, cost='none',
        next='HIRE THEM TWICE',
        anchor='YOU GET A TRADE, NOT A NAME',
        mech='It is not a nickname, it is how the hall lists them. The one '
             'faction where the earned-name mechanic is earned with WORK instead '
             'of words.',
    ),
    dict(
        key='REDS', faction='THE REDS',
        opener='they-offer', first='name+terms', earn='none-needed',
        cost='ends-conversation', cost_on='blocked',
        next='NOTHING TO EARN. A NAME YOU CAN HOLD TO ACCOUNT IS THE PRODUCT.',
        anchor='THE NAME COMES WITH THE TERMS, IN THE SAME SENTENCE',
        mech='What they do NOT tell you is who they answer to, and that is the '
             'one question that ends the conversation politely.',
        blocked='WHO THEY ANSWER TO',
    ),
    dict(
        key='BLUES', faction='THE BLUES',
        opener='you-ask', first='group-name', earn='standing', cost='none',
        next='DO SOMETHING THE GROUP HAS AN OPINION ABOUT',
        anchor="YOU GET THE GROUP'S NAME FIRST AND THEIRS LAST",
        mech='Ask a Blue who they are and you are told which body they speak for. '
             'The only faction where a stranger can be introduced to you by a vote.',
    ),
    dict(
        key='ANARCHISTS', faction='THE ANARCHISTS',
        opener='they-offer', first='given-only', earn='never', cost='insult-once',
        next='NOTHING. THE CHOSEN NAME IS THE TRUE ONE.',
        anchor='THEY GIVE YOU A CHOSEN NAME IMMEDIATELY AND THE BIRTH NAME NEVER',
        mech='It is not an alias and treating it as one is the insult. Asking '
             '"no, your REAL name" is the wrong move, and the game lets the '
             'player make that mistake once.',
    ),
    dict(
        key='COLORFUL', faction='THE COLORFUL',
        opener='they-offer', first='full-name', earn='none-needed', cost='none',
        asks='WHO YOU CAME WITH',
        next='NOTHING TO EARN. THE SECOND QUESTION IS THE SCREENING.',
        anchor='NAMES BOTH WAYS IN THE FIRST BREATH, AND THEN THE SECOND QUESTION IS WHO YOU CAME WITH',
        mech='The name was the small talk. Answer the second question well and '
             'you are introduced onward to three people; answer it badly and you '
             'are still treated kindly and never introduced to anybody.',
        opens=3,
    ),
    dict(
        key='KARENS', faction='THE KARENS',
        opener='they-ask-first', first='name+position', earn='none-needed',
        cost='on-a-list', cost_on='meet', asks='YOUR NAME, AND SHE WRITES IT DOWN',
        next='NOTHING TO EARN. THE POSITION IS THE POINT.',
        anchor='THEY ASK YOUR NAME AND THEY WRITE IT DOWN',
        mech='The one group where being ASKED is the threat: the question is not '
             'friendliness, it is intake. A Karen introduces herself as an office.',
    ),
    dict(
        key='SOCIAL_FORCES', faction='THE SOCIAL FORCES',
        opener='they-ask-first', first='nothing', earn='never', cost='none',
        asks='WHAT YOU ARE',
        next='NOTHING. THE NAME NEVER MATTERED TO THEM.',
        anchor='THEY ASK WHAT YOU ARE BEFORE THEY ASK WHO YOU ARE',
        mech='The cleanest way to detect one with no label on screen: the only '
             'person in the valley who asked a question about you and did not '
             'want the answer, only the category.',
    ),
    dict(
        key='AMALGAMATION', faction='THE AMALGAMATION',
        opener='they-know-yours', first='your-own-name', earn='never', cost='none',
        next='NOTHING.',
        anchor='IT KNOWS EVERY NAME AND IT IS NEVER THE ONE SPEAKING',
        mech='A stranger you never asked greets you by the name you only ever '
             'told one person.',
        # canon, verbatim: "In act one that must land as a HAUNTING and nothing on
        # screen may explain it." So the runtime is FORBIDDEN from printing the
        # mechanic line for this one. The flag is the law, in the data.
        explain=False,
    ),
]

# The default, for the ~85% of the valley that runs with nobody. This is exactly
# what the game does today (YOU HAVE TO ASK, Paolo 7/31), so wiring the organ in
# changes nothing for an unaffiliated stranger. Additive, never a regression.
DEFAULT = dict(
    key='NOBODY', faction='NOBODY IN PARTICULAR',
    opener='you-ask', first='full-name', earn='ask', cost='none',
    next='ASK THEM',
    anchor=None,
    mech='Nobody in particular. You ask, they answer. (Paolo 7/31, YOU HAVE TO ASK.)',
)

# dossier file -> rule key. Derived, not typed: the file IS the key.
DOSSIER_FILE = 'BOHEMIA_FACTION_%s.md'

# every spelling of a faction the rest of the engine might hand us. The graph ids,
# the dress keys, and the quest @ROLE faction= tokens are three vocabularies for
# the same sixteen; resolving them here means no caller has to know that.
ALIASES = {
    'SOCIALFORCES': 'SOCIAL_FORCES', 'SOCIAL FORCES': 'SOCIAL_FORCES',
    'PURES': 'SOCIAL_FORCES', 'PANTHERS': 'SOCIAL_FORCES',
    'LA FAMILIA': 'SOCIAL_FORCES', 'LAFAMILIA': 'SOCIAL_FORCES',
    'TRIADS': 'SOCIAL_FORCES',
    'THE NETWORK': 'NETWORK', 'AMALGAM': 'AMALGAMATION',
}


def read_dossier(key):
    p = os.path.join(DOSSIERS, DOSSIER_FILE % key)
    if not os.path.exists(p):
        sys.exit('MISSING DOSSIER: ' + p)
    with open(p, 'r', encoding='utf-8') as f:
        return f.read()


def section(text, head):
    m = re.search(r'^###\s+' + re.escape(head) + r'\s*$(.*?)(?=^###\s|\Z)',
                  text, re.M | re.S)
    return re.sub(r'\s+', ' ', m.group(1)).strip() if m else ''


def build():
    out = []
    for r in RULES:
        doc = read_dossier(r['key'])
        canon = section(doc, 'WHEN YOU ASK THEIR NAME')
        talk = section(doc, 'HOW THEY TALK')
        if not canon:
            sys.exit('NO NAME RULE SECTION in dossier for ' + r['key'])
        # THE ANCHOR CHECK. This is the whole safety of the file: the mechanic
        # shape below is a READING of his canon, so the sentence it was read from
        # is pinned to it. Reword the dossier and this generator dies here rather
        # than letting a stale shape ship under fresh canon.
        if r['anchor'] not in canon:
            sys.exit('ANCHOR DRIFT in %s\n  expected: %s\n  dossier now: %s'
                     % (r['key'], r['anchor'], canon[:160]))
        row = dict(r)
        row['canon'] = canon
        row['talk'] = talk
        out.append(row)
    d = dict(DEFAULT)
    d['canon'] = ''
    d['talk'] = ''
    return out, d


# ---------------------------------------------------------------------------
JS_HEAD = '''// BOHEMIA INTRODUCTIONS -- the sixteen ways you come to know somebody.
//
// GENERATED by tools/bohemia_introductions.py. EDIT THE TOOL, NEVER THIS FILE.
//
// Paolo 8/12: "lets do more than faction memeory please." This is the other half
// of the lane: not what a faction REMEMBERS about you, but how you MEET one.
//
// Every rule below is his, thumbed UP 8/2/26, and it is carried out of
// records/factions/*.md with the canon sentence attached. The generator refuses
// to run if a rule's ANCHOR is no longer in the dossier it claims to come from,
// so the mechanic can never quietly drift off the words.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the four-axis vocabulary and the state
// machine are mine; which faction does which is entirely his. THERE IS NO
// DIALOGUE HERE AND THERE MUST NEVER BE. Every string this module returns is
// third-person mechanical narration of the same class as "FIRST TIME" -- never a
// character speaking. LINES stays empty and is Paolo's (people_gate.js).
//
// LABELS ARE DERIVED, NEVER COOKED. A surname is the second half of
// BohemiaPeople.generatedName; a trade word is the engine's own ROLE_WORDS entry;
// a group name is the faction's own name. This file invents no names and no words.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

'''

JS_TAIL = r'''
  // resolve any of the three faction vocabularies (graph id, dress key, quest
  // @ROLE token) to a rule. Unknown or absent -> the default, which is exactly
  // what the game already does for a stranger who runs with nobody.
  function ruleOf(fid){
    if(!fid) return DEFAULT;
    var k=String(fid).toUpperCase().replace(/[^A-Z_ ]/g,'');
    if(RULES[k]) return RULES[k];
    if(ALIASES[k] && RULES[ALIASES[k]]) return RULES[ALIASES[k]];
    var squashed=k.replace(/[\s_]/g,'');
    if(ALIASES[squashed] && RULES[ALIASES[squashed]]) return RULES[ALIASES[squashed]];
    for(var key in RULES){ if(key.replace(/[\s_]/g,'')===squashed) return RULES[key]; }
    return DEFAULT;
  }

  /* THE HANDLE. What the first contact leaves you holding, built ONLY out of
     things the engine already owns. ctx carries them in so this module never
     reaches for a name pool of its own:
       full      "RUBEN HOLLAND" (BohemiaPeople.generatedName)
       trade     "SCAVENGER"     (BohemiaPeople.ROLE_WORDS)
       faction   "BLUES"         (the faction's own name)
       work      "CLINIC, DAYS"  (BohemiaPeople.workLineOf) */
  function handle(rule, ctx){
    ctx=ctx||{};
    var full=ctx.full||'', parts=full.split(' ');
    switch(rule.first){
      case 'full-name':     return full||null;
      case 'surname':       return parts.length>1?parts[parts.length-1]:(full||null);
      case 'given-only':    return parts[0]||null;
      case 'trade-word':    return ctx.trade||null;
      case 'group-name':    return rule.faction||null;
      case 'name+route':    return full? (ctx.work? full+' · '+ctx.work : full) : null;
      case 'name+terms':    return full||null;
      case 'name+position': return full? (ctx.trade? full+' · '+ctx.trade : full) : null;
      case 'your-own-name': return null;   /* they used YOURS. You learned nothing. */
      case 'nothing':       return null;
      default:              return null;
    }
  }

  /* IS THE HANDLE THE WHOLE NAME? Only the first-class ones are. A surname, a
     trade, a group or a chosen name is a handle you are still short of a name on,
     which is what makes `earn` mean something. */
  function handleIsName(rule){
    return rule.first==='full-name' || rule.first==='name+route'
        || rule.first==='name+terms' || rule.first==='name+position';
  }

  /* DOES THE FIRST CONTACT HAPPEN BY ITSELF? Three of the five openers arrive
     without the player pressing anything: they offer, they ask you something
     first, or they use your own name at you. */
  function unprompted(rule){
    return rule.opener==='they-offer' || rule.opener==='they-ask-first'
        || rule.opener==='they-know-yours';
  }

  /* HAS THE EARNING CONDITION BEEN MET? st is whatever the surface can honestly
     answer today; anything it cannot answer is simply false, and the mechanic
     stays where it is. No condition is ever assumed true. */
  function earned(rule, st){
    st=st||{};
    switch(rule.earn){
      case 'none-needed': return true;
      case 'ask':         return !!st.asked;
      case 'work':        return (st.hires|0) >= (rule.earnN||2);
      case 'vouch':       return !!st.vouched;
      case 'standing':    return !!st.standing;
      case 'honesty':     return st.honest===true;
      case 'overheard':   return !!st.overheard;
      case 'never':       return false;
      default:            return false;
    }
  }

  /* THE WHOLE MECHANIC IN ONE CALL. Give it the rule, what the engine knows
     about the person, and what has happened between you. It answers what you
     know right now, what it is called, and what would move it.

     tier:  'stranger' -> you have nothing
            'handle'   -> you have something to call them that is not their name
            'named'    -> you have their name
     shown: the string to put on the card, or null
     next:  what would move it (empty once there is nothing left to earn)
     asks:  the question THEY put to YOU, when there is one (verbatim canon)
     used:  true when they used YOUR name and you never gave it */
  function meeting(rule, ctx, st){
    rule=rule||DEFAULT; ctx=ctx||{}; st=st||{};
    var open = unprompted(rule) || !!st.asked || !!st.introduced;
    var h    = open ? handle(rule, ctx) : null;
    var got  = earned(rule, st);
    var name = (got && (handleIsName(rule) ? h : (ctx.full||null))) || null;
    /* an unprompted opener that hands you nothing (they ask YOU something) is
       still a meeting: you learned their question, not their name. */
    var tier = name ? 'named' : (h ? 'handle' : 'stranger');
    return {
      key:     rule.key,
      tier:    tier,
      shown:   name || h || null,
      isName:  !!name,
      opener:  rule.opener,
      first:   rule.first,
      earn:    rule.earn,
      next:    (tier==='named' && rule.earn==='none-needed') ? '' :
               (tier==='named' ? '' : (rule.next||'')),
      asks:    (open && rule.asks) ? rule.asks : '',
      used:    rule.first==='your-own-name' && open,
      blocked: rule.blocked||'',
      opens:   rule.opens||0,
      /* canon, CHURCH: "a Church member you met once and walked away from greets
         you by name a year later, in front of people." Surfaced the moment you
         are named, so the flag is USED and not a field nobody reads. */
      remembers: (rule.remembers===true && !!name),
      /* a price charged by the MEETING itself, not by anything the player
         pressed. A Karen writes your name down for showing up. */
      cost:    (rule.costOn==='meet' && open) ? (COSTS[rule.cost]||'') : '',
      /* canon: the Amalgamation must land as a haunting and NOTHING ON SCREEN
         MAY EXPLAIN IT. The flag is the law, so a surface cannot forget -- and it
         is carried out explicitly rather than inferred from an empty string,
         because "no words" and "explaining is forbidden" are not the same fact. */
      explain: rule.explain!==false,
      why:     (rule.explain===false) ? '' : (rule.mech||'')
    };
  }

  /* WHAT PRESSING THE ONE BUTTON DOES. The button is the same button it has
     always been; sixteen different things happen behind it.
       got   'name' | 'handle' | 'nothing'
       cost  what it cost you to ask that way, or '' */
  function askOutcome(rule, ctx, st){
    rule=rule||DEFAULT;
    var before=meeting(rule, ctx, st);
    var after =meeting(rule, ctx, Object.assign({}, st||{}, {asked:true}));
    var moved = after.shown && after.shown!==before.shown;
    var got = after.isName && moved ? 'name' : moved ? 'handle' : 'nothing';
    /* the price is only charged for the wrong move it is actually written
       against. Homeless charges for lying, not for asking. */
    var charged = (rule.costOn||'ask')==='ask';
    return { got: got, shown: after.shown, moved: !!moved,
             cost: charged ? (COSTS[rule.cost]||'') : '',
             costKind: charged ? rule.cost : 'none',
             next: after.next, after: after };
  }

  /* THE ONE BUTTON'S LABEL, or null when there is nothing to press. Grammar
     lives in one place -- the run stopped doing grammar the day it shipped
     "TALK TO THE RUBEN" (bohemia_people.js).

     A BUTTON THAT DOES NOTHING IS A LIE, so it only appears when asking either
     MOVES something, or is a mistake his canon deliberately lets the player make
     ("the game should let the player make that mistake once" -- ANARCHISTS).
     Three of the sixteen end up with no button at all, and in all three the canon
     is that the name was never the transaction. That silence is the feature. */
  function buttonFor(rule, ctx, st){
    rule=rule||DEFAULT;
    var m=meeting(rule, ctx, st);
    if(m.isName) return null;                        /* nothing left to ask for */
    var o=askOutcome(rule, ctx, st);
    var mistake = !!o.cost;
    if(!o.moved && !mistake) return null;
    if(rule.opener==='third-party')          return 'Ask anyway';
    if(rule.first==='given-only')            return 'Ask for their real name';
    if(rule.first==='surname'    && m.shown) return 'Ask for a first name';
    if(rule.first==='trade-word' && m.shown) return 'Ask for a name';
    if(rule.first==='group-name' && m.shown) return 'Ask for a name';
    return 'Ask their name';
  }

  /* THE OTHER BUTTON, and it only exists for the factions that asked YOU
     something first. The Homeless do not want your name, they want to know where
     you sleep, and answering honestly is the whole unlock -- so the move has to
     be pressable or the mechanic is decoration. Returns null for everyone else. */
  function answerFor(rule, ctx, st){
    rule=rule||DEFAULT; st=st||{};
    if(rule.earn!=='honesty' || !rule.asks) return null;
    if(earned(rule, st)) return null;
    return { label:'Tell them the truth', sets:{honest:true} };
  }

  var API={ RULES:RULES, DEFAULT:DEFAULT, ALIASES:ALIASES, COSTS:COSTS,
            ruleOf:ruleOf, handle:handle, handleIsName:handleIsName,
            unprompted:unprompted, earned:earned, meeting:meeting,
            askOutcome:askOutcome, buttonFor:buttonFor, answerFor:answerFor,
            keys:function(){ return Object.keys(RULES); } };
  if(HASREQ) module.exports=API; else root.BohemiaIntros=API;
})(typeof globalThis!=='undefined'?globalThis:this);
'''

COSTS = {
    'none': '',
    'insult-once': 'AN INSULT. YOU GET TO MAKE IT ONCE.',
    'permanent-mark': 'A SMALL PERMANENT MARK AGAINST YOU.',
    'on-a-list': 'YOUR NAME IS WRITTEN DOWN.',
    'ends-conversation': 'THE CONVERSATION ENDS, POLITELY.',
    'never-again': 'LIE AND YOU NEVER GET EITHER.',
    'refused': 'A SMILE AND A REDIRECT. EVERY TIME. FOREVER.',
}


def js_literal(rows, default):
    def one(r):
        d = {k: r[k] for k in
             ('key', 'faction', 'opener', 'first', 'earn', 'cost', 'next', 'mech',
              'canon', 'talk')
             if r.get(k)}
        for k in ('asks', 'blocked', 'anchor'):
            if r.get(k):
                d[k] = r[k]
        if r.get('cost_on'):
            d['costOn'] = r['cost_on']
        for k in ('earn_n', 'opens'):
            if r.get(k):
                d['earnN' if k == 'earn_n' else k] = r[k]
        for k in ('remembers',):
            if r.get(k):
                d[k] = True
        if r.get('explain') is False:
            d['explain'] = False
        return d

    body = {r['key']: one(r) for r in rows}
    return ('  var RULES=' + json.dumps(body, indent=2, ensure_ascii=False)
            .replace('\n', '\n  ') + ';\n\n'
            '  var DEFAULT=' + json.dumps(one(default), indent=2, ensure_ascii=False)
            .replace('\n', '\n  ') + ';\n\n'
            '  var ALIASES=' + json.dumps(ALIASES, indent=2, ensure_ascii=False)
            .replace('\n', '\n  ') + ';\n\n'
            '  var COSTS=' + json.dumps(COSTS, indent=2, ensure_ascii=False)
            .replace('\n', '\n  ') + ';\n')


# ---------------------------------------------------------------------------
PAGE = r'''<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>THE SIXTEEN INTRODUCTIONS</title>
<style>
:root{--bg:#0d0b09;--ink:#e9e2d2;--dim:#8b8272;--line:#2a251d;--card:#161310;--hot:#cdbd8a}
body.sun{--bg:#efe9dc;--ink:#1a1712;--dim:#5d564a;--line:#c9c0ac;--card:#fdfaf2;--hot:#6b5a24}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
 font:14px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;-webkit-text-size-adjust:100%}
header{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--line);
 padding:14px 14px 10px}
h1{margin:0;font-size:16px;letter-spacing:.09em}
.sub{color:var(--dim);font-size:11.5px;margin-top:5px;line-height:1.45}
.bar{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
button{font:inherit;font-size:11px;letter-spacing:.06em;background:var(--card);color:var(--ink);
 border:1px solid var(--line);border-radius:7px;padding:7px 11px}
button.on{background:var(--hot);color:var(--bg);border-color:var(--hot)}
main{padding:12px 12px 60px;max-width:760px;margin:0 auto}
.c{background:var(--card);border:1px solid var(--line);border-radius:11px;padding:13px;margin:11px 0}
.nm{font-weight:700;letter-spacing:.09em;font-size:13.5px;display:flex;align-items:center;gap:8px}
.dot{width:11px;height:11px;border-radius:3px;flex:none}
.canon{color:var(--ink);font-size:12px;line-height:1.55;margin:9px 0 0;
 border-left:2px solid var(--hot);padding-left:9px;opacity:.93}
.axes{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0 0}
.ax{font-size:9.5px;letter-spacing:.07em;border:1px solid var(--line);border-radius:5px;
 padding:3px 6px;color:var(--dim)}
.ax b{color:var(--ink);font-weight:700}
.play{margin:11px 0 0;border-top:1px dashed var(--line);padding-top:10px}
.step{display:flex;gap:9px;align-items:flex-start;margin:7px 0}
.n{flex:none;width:17px;height:17px;border-radius:5px;background:var(--line);color:var(--ink);
 font-size:10px;display:flex;align-items:center;justify-content:center;margin-top:1px}
.t{flex:1;font-size:12px;line-height:1.5}
.t .lab{color:var(--hot);font-weight:700;letter-spacing:.05em}
.t .no{color:var(--dim)}
.cost{color:#d98a6a;font-size:11px;letter-spacing:.04em;margin-top:3px}
body.sun .cost{color:#9d3d12}
.next{color:var(--dim);font-size:11px;letter-spacing:.05em;margin-top:8px}
.next b{color:var(--ink)}
.foot{color:var(--dim);font-size:11px;padding:16px 2px;line-height:1.6}
</style></head><body>
<header>
<h1>THE SIXTEEN INTRODUCTIONS</h1>
<div class="sub">Every faction dossier you thumbed up on 8/2 has a section called WHEN YOU ASK
THEIR NAME, and every one of them is a different mechanic. The game did one thing for all
sixteen. This is them running. <b>Nothing here needs a verdict</b> &mdash; it is your canon, wired.</div>
<div class="bar">
 <button id="sun">SUN MODE</button>
</div>
</header>
<main id="m"></main>
<script>
__PAYLOAD__
__ENGINE__
var LOOK=__LOOK__;
/* one worked example, same person every card, so the SIXTEEN are the only thing
   that changes between them. Everything here comes out of the engine's own
   vocabulary: a generated name, a role word, a work line. */
var CTX={ full:'RUBEN HOLLAND', trade:'SCAVENGER', work:'NORTH ROAD RUN' };
var STAGES=[
 {label:'FIRST MEETING', st:{}},
 {label:'YOU PRESSED ASK', st:{asked:true}},
 {label:'AFTER THE WORK IS DONE', st:{asked:true,hires:2,vouched:true,standing:true,honest:true,overheard:true,introduced:true}}
];
/* the cost chip has to name WHICH wrong move is charged, or the Homeless card
   reads as though asking is what costs you -- and asking is not the wrong move
   there, lying is. */
var COSTLABEL={ask:'ASKING WRONG', lie:'LYING COSTS', meet:'MEETING THEM COSTS',
                blocked:'THE ONE QUESTION COSTS'};
function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
function row(n, label, body, cost){
  return '<div class="step"><div class="n">'+n+'</div><div class="t">'
    +'<span class="lab">'+esc(label)+'</span><br>'+body
    +(cost?'<div class="cost">COST &middot; '+esc(cost)+'</div>':'')+'</div></div>';
}
function card(key){
  var r=BohemiaIntros.RULES[key];
  var col=(LOOK[key]&&LOOK[key].color)||'#8b8272';
  var h='<div class="c"><div class="nm"><span class="dot" style="background:'+col+'"></span>'
    +esc(r.faction)+'</div>';
  h+='<div class="canon">'+esc(r.canon)+'</div>';
  h+='<div class="axes">'
    +'<span class="ax">MOVES FIRST <b>'+esc(r.opener)+'</b></span>'
    +'<span class="ax">YOU GET <b>'+esc(r.first)+'</b></span>'
    +'<span class="ax">EARNED BY <b>'+esc(r.earn)+(r.earnN?(' ×'+r.earnN):'')+'</b></span>'
    +'<span class="ax">'+esc(COSTLABEL[r.costOn||'ask'])+' <b>'+esc(r.cost)+'</b></span></div>';
  h+='<div class="play">';
  STAGES.forEach(function(s,i){
    var m=BohemiaIntros.meeting(r, CTX, s.st);
    /* step 2 is not "you pressed ask" for the six factions with no button to
       press. Saying so is the point of the whole feature. */
    var label=s.label;
    if(i===1){ var bl=BohemiaIntros.buttonFor(r, CTX, {});
      label = bl ? ('YOU PRESSED: '+bl.toUpperCase()) : 'THERE IS NO BUTTON TO PRESS'; }
    var body='';
    if(m.asks) body+='THEY ASK YOU: <b>'+esc(m.asks)+'</b><br>';
    if(m.used) body+='THEY USED <b>YOUR</b> NAME. YOU NEVER GAVE IT.<br>';
    body+= m.shown
      ? ('YOU KNOW THEM AS <b>'+esc(m.shown)+'</b>'+(m.isName?' &mdash; that is their name.':' &mdash; that is not their name.'))
      : '<span class="no">YOU KNOW NOTHING TO CALL THEM.</span>';
    if(m.blocked) body+='<br><span class="no">CANNOT ASK: '+esc(m.blocked)+'</span>';
    if(m.opens) body+='<br>ANSWER IT WELL AND YOU ARE INTRODUCED ONWARD TO '+m.opens+' PEOPLE.';
    var cost='';
    if(i===1){ var o=BohemiaIntros.askOutcome(r, CTX, s.st.asked?{}:s.st); cost=o.cost; }
    h+=row(i+1, label, body, cost);
  });
  h+='</div>';
  var last=BohemiaIntros.meeting(r, CTX, STAGES[STAGES.length-1].st);
  h+='<div class="next">HOW YOU GET THE REST &middot; <b>'+esc(r.next)+'</b></div>';
  if(last.why) h+='<div class="next">'+esc(last.why)+'</div>';
  h+='</div>';
  return h;
}
function draw(){
  var keys=BohemiaIntros.keys();
  document.getElementById('m').innerHTML=keys.map(card).join('')
   +'<div class="foot">Sixteen mechanics, one button. The rule text in the quote block is '
   +'yours, verbatim, out of records/factions/ &mdash; the generator refuses to run if a '
   +'single one of them changes without a human re-reading it. The three steps under each '
   +'card are the real module running, not a mock-up: the same engine/bohemia_introductions.js '
   +'the RUN calls.</div>';
}
document.getElementById('sun').addEventListener('click',function(){
  document.body.classList.toggle('sun'); this.classList.toggle('on'); });
draw();
</script></body></html>
'''


def main():
    rows, default = build()

    js = JS_HEAD + js_literal(rows, default) + JS_TAIL
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js)

    payload = {'rules': {r['key']: r for r in rows}, 'default': default,
               'aliases': ALIASES, 'costs': COSTS}
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(payload, f, indent=1, ensure_ascii=False)
        f.write('\n')

    # the page runs the REAL module, inlined, or it is a lie about the system
    # (VERIFY ON THE REAL SURFACE, 7/18 -- a reimplementation on a judge page is
    # exactly the side door that law was written about).
    look = {}
    dress = os.path.join(ROOT, 'engine', 'bohemia_dress.js')
    if os.path.exists(dress):
        with open(dress, 'r', encoding='utf-8') as f:
            src = f.read()
        for m in re.finditer(r"([A-Z_]+)\s*:\s*\{[^}]*color\s*:\s*'(#[0-9a-fA-F]{3,8})'", src):
            look[m.group(1)] = {'color': m.group(2)}
    html = (PAGE
            .replace('__ENGINE__', js.replace('</script>', '<\\/script>'))
            .replace('__PAYLOAD__', '/* the module below IS engine/bohemia_introductions.js */')
            .replace('__LOOK__', json.dumps(look, ensure_ascii=False)))
    with open(OUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)

    print('INTRODUCTIONS: %d rules baked' % len(rows))
    for r in rows:
        print('  %-14s %-15s -> %-14s earn:%-11s cost:%s'
              % (r['key'], r['opener'], r['first'], r['earn'], r['cost']))
    print('  wrote %s' % os.path.relpath(OUT_JS, ROOT))
    print('  wrote %s' % os.path.relpath(OUT_JSON, ROOT))
    print('  wrote %s' % os.path.relpath(OUT_HTML, ROOT))


if __name__ == '__main__':
    main()

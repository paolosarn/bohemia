#!/usr/bin/env python3
"""
BOHEMIA FAVOUR GENERATOR -- WHAT YOU CAN ASK OF THEM.  (8/16/26, FACTIONS lane)

Writes engine/bohemia_favour.js. EDIT THIS FILE, NEVER THE OUTPUT.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). No graphic pixels; the duty for a
mechanism is DO NOT BUILD A SECOND ONE, and on 8/15 I failed this check and
overwrote a shipped module. So the sweep comes first and is written down:
  - `ls engine/` read in full before naming. Nothing called favour/patron/
    ask/grant/give exists. The near names are bohemia_claim (what THEY ask of
    YOU -- this is the mirror), bohemia_commitment (how far in you are) and
    bohemia_standing (what people think of you from deeds they saw). None of
    them models a resource moving from the outfit TO the player.
  - engine/bohemia_belonging.js RULES -- what each outfit PAYS IN and what it
    HOLDS is already canon, already gated, and this reads it. Nothing new is
    invented about any outfit.
  - engine/bohemia_belonging.js firstMove -- ALREADY CANON, AND IT HAS NEVER
    DONE ANYTHING. It carries three values across his sixteen dossiers and its
    only effect to date is one warning row on the card. It is the whole spine
    of this module.
  - engine/bohemia_claim.js -- the reciprocal half. A favour RECORDS a debt;
    it does not open a claim itself, because a second opener is how two
    systems start disagreeing. The surface connects them.

--------------------------------------------------------------------------
THE HOLE. The ladder pointed at nothing.
--------------------------------------------------------------------------
8/12 built the ladder, 8/15 the wall, 8/16 the claim. So an outfit can now
COUNT you and start leaning on you. What it could never do is GIVE YOU
ANYTHING. `pays` and `hold` -- his 8/2 canon, sixteen real economies -- were
card text and nothing else: verified by sweep, there was no ask/request/
receive/grant anywhere in engine/. You could climb to INSIDE and the only
thing that changed was a word on a card.

--------------------------------------------------------------------------
THE RESEARCH, and his own canon got there first
--------------------------------------------------------------------------
SCOTT 1972, PATRON-CLIENT POLITICS AND POLITICAL CHANGE IN SOUTHEAST ASIA
(Am. Pol. Sci. Rev. 66:91-113): a patron "uses his own influence and resources
to provide protection or benefits" to a client, who "reciprocates by offering
general support and assistance". Asymmetric, personal, and NOT a market trade.

EISENSTADT & RONIGER 1984, PATRONS, CLIENTS AND FRIENDS: the tie carries "a
strong element of unconditionality and of LONG-RANGE CREDIT AND OBLIGATIONS",
with "diffuse obligation and durability". THAT PHRASE IS THE MECHANIC. A
patron-client tie is not a transaction, it is a RUNNING ACCOUNT. You do not pay
for a favour; you carry one.

AND PAOLO'S CARTEL DOSSIER ALREADY SAYS IT, in his own words, from 8/2:
  "They want you to OWE them. Not to work for them, not yet. The first thing
   they give you is free and it is exactly the thing you needed that week."
That is Eisenstadt & Roniger's long-range credit, written as a faction. The
research did not tell me what to build; it told me what he had already built
and I had not read as a mechanic.

--------------------------------------------------------------------------
THE THREE ECONOMIES, ALL READ OUT OF CANON
--------------------------------------------------------------------------
firstMove already sorts his sixteen outfits three ways, and each one wants a
completely different answer to "can I ask you for something":
  you-give-first (11)  Earn first. They will not hand you anything until they
                       COUNT you, and asking SPENDS the standing you built.
  they-give-first (4)  CARTEL, CHURCH, NETWORK, SOCIAL_FORCES. They give from
                       the very first meeting, it costs no standing, and it
                       puts you in DEBT. That debt is what they collect later.
  never (1)            THE AMALGAMATION. Never. Not at any depth.

MECHANISM-MINE / CONTENTS-PAOLO'S: when they will give, what it costs and how
the debt behaves are mechanism. WHAT they give is his `pays` line verbatim, and
this file names no outfit and invents no resource. HOW MUCH is not decided here
either -- a favour is ONE favour under EVERYTHING COSTS ONE (8/15) and carries
its placeholder tag so his tuning pass finds it.
"""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'engine/bohemia_favour.js')
BELONGING = os.path.join(ROOT, 'engine/bohemia_belonging.js')
CLAIM = os.path.join(ROOT, 'engine/bohemia_claim.js')

ANCHORS = [
    (BELONGING, 'var RUNGS=[', 'the ladder a favour reads its threshold off'),
    (BELONGING, '"firstMove": "they-give-first"',
     'the canon axis this whole module is built on'),
    (BELONGING, '"firstMove": "you-give-first"', 'the other side of that axis'),
    (CLAIM, 'function answer(save, fid, said, given)',
     'the reciprocal half a debt is eventually collected by'),
]

# WHEN THEY WILL GIVE, by his own firstMove axis. The RUNG NAMES are read from
# the shipped ladder at build time, never typed as numbers.
GIVES = {
    'they-give-first': dict(
        fromRung=None,                    # from the very first meeting
        costsStanding=False,
        owes=True,
        word='THEY ARE OFFERING',
        note='It is free. That is the point of it, and it is the part to be '
             'careful about.',
        refusedWord=None),
    'you-give-first': dict(
        fromRung='COUNTED',
        costsStanding=True,
        owes=False,
        word='YOU CAN ASK THEM FOR',
        note='It will cost you some of what you built. They do not do favours '
             'for people who have not turned up.',
        refusedWord='NOT YET. THEY DO NOT KNOW YOU WELL ENOUGH TO OWE YOU '
                    'ANYTHING.'),
    'never': dict(
        fromRung=None,
        costsStanding=False,
        owes=False,
        never=True,
        word=None,
        note=None,
        refusedWord='THEY GIVE NOTHING TO ANYBODY. THAT IS NOT A DEPTH '
                    'PROBLEM.'),
}

WORDS = dict(
    owed='YOU OWE THEM',
    owed_note='You have taken what they were offering {n}. Nobody has mentioned '
              'it. They will.',
    took='YOU TOOK IT',
    took_free='YOU TOOK IT, AND IT WAS FREE',
    spent='IT COST YOU SOME STANDING',
    ask='Ask them for it',
    take='Take it',
)


def read(p):
    with open(p, 'r', encoding='utf-8') as fh:
        return fh.read()


def check_anchors():
    bad = []
    for path, frag, why in ANCHORS:
        if not os.path.exists(path):
            bad.append('MISSING %s (%s)' % (path, why))
        elif frag not in read(path):
            bad.append('ANCHOR MOVED in %s\n    wanted: %s\n    why: %s'
                       % (os.path.relpath(path, ROOT), frag, why))
    if bad:
        sys.stderr.write('bohemia_favour: REFUSING TO GENERATE.\n'
                         'A citation a machine cannot check is a name-drop.\n\n'
                         + '\n'.join('  - ' + b for b in bad) + '\n')
        sys.exit(2)


def rung_index(word):
    """READ the ladder, never retype it."""
    src = read(BELONGING)
    i = src.index('var RUNGS=[')
    j = src.index('\n  ];', i)
    rungs = json.loads(src[i + len('var RUNGS='):j + 4].strip().rstrip(';'))
    for n, r in enumerate(rungs):
        if r.get('word') == word:
            return n, rungs
    sys.stderr.write('bohemia_favour: no rung named %s in the ladder.\n' % word)
    sys.exit(2)


def main():
    check_anchors()
    counted, rungs = rung_index('COUNTED')
    gives = {}
    for k, v in GIVES.items():
        g = dict(v)
        g['fromRungIndex'] = counted if v.get('fromRung') == 'COUNTED' else None
        gives[k] = g
    js = TEMPLATE % dict(
        gives=json.dumps(gives, indent=2).replace('\n', '\n  '),
        words=json.dumps(WORDS, indent=2).replace('\n', '\n  '),
        counted=counted,
        rungs=json.dumps([r['word'] for r in rungs]),
    )
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(js)
    print('wrote %s' % os.path.relpath(OUT, ROOT))
    print('  three economies off his firstMove axis; earned favours need rung %d (%s) of %s'
          % (counted, 'COUNTED', json.dumps([r['word'] for r in rungs])))


TEMPLATE = r'''// BOHEMIA FAVOUR -- WHAT YOU CAN ASK OF THEM.
//
// GENERATED by tools/bohemia_favour.py. EDIT THE TOOL, NEVER THIS FILE.
//
// THE HOLE. The ladder pointed at nothing. An outfit could COUNT you and start
// leaning on you (bohemia_claim, 8/16) and it could never GIVE YOU ANYTHING.
// His `pays` and `hold` lines -- sixteen real economies, thumbed 8/2 -- were
// card text: swept engine/ and there was no ask/request/receive/grant anywhere.
// You could climb to INSIDE and the only thing that changed was a word.
//
// SCOTT 1972 (Am. Pol. Sci. Rev. 66:91-113): a patron "uses his own influence
// and resources to provide protection or benefits" to a client who
// "reciprocates by offering general support and assistance". Asymmetric,
// personal, and NOT a market trade.
//
// EISENSTADT & RONIGER 1984, PATRONS, CLIENTS AND FRIENDS: the tie carries "a
// strong element of unconditionality and of LONG-RANGE CREDIT AND OBLIGATIONS".
// That is the mechanic. A patron tie is not a transaction, it is a RUNNING
// ACCOUNT: you do not pay for a favour, you carry one.
//
// AND HIS CARTEL DOSSIER SAID IT FIRST, on 8/2, in his own words: "They want
// you to OWE them... The first thing they give you is free and it is exactly
// the thing you needed that week." The research did not tell me what to build.
// It told me what he had already written and I had not read as a mechanic.
//
// THREE ECONOMIES, ALL READ OUT OF CANON. firstMove already sorts his sixteen
// outfits three ways and its only effect until now was one warning row:
//   they-give-first  give from the first meeting, cost nothing, and OWE
//   you-give-first   give only once they COUNT you, and it SPENDS standing
//   never            give nothing to anybody, at any depth
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: when they give, what it costs and how the
// debt behaves are mechanism. WHAT they give is his `pays` line verbatim. This
// file names no outfit and invents no resource, and a favour is ONE favour
// under EVERYTHING COSTS ONE with its placeholder tag attached.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  /* the three economies, keyed by his own firstMove value. fromRungIndex is
     DERIVED from the shipped ladder %(rungs)s at build time -- COUNTED is index
     %(counted)s -- so retuning the ladder moves this with it. */
  var GIVES = %(gives)s;

  var WORDS = %(words)s;
  var DRAFT = true;

  /* ONE FAVOUR IS ONE. EVERYTHING COSTS ONE (Paolo 8/15): the SIZE of a favour
     and what a refusal costs in standing are prices, and a price with no ruling
     behind it is 1, tagged, enumerable. */
  var FAVOUR_SIZE = 1;
  var STANDING_COST = 1;

  function belongingModule(){
    if(typeof BohemiaBelonging!=='undefined') return BohemiaBelonging;
    if(root && root.BohemiaBelonging) return root.BohemiaBelonging;
    if(HASREQ){ try { return require('./bohemia_belonging.js'); } catch(_e){} }
    return null;
  }
  function norm(f){ return String(f||'').toUpperCase().replace(/[\s_]/g,''); }

  /* ---- THE LEDGER OF WHAT YOU HAVE TAKEN --------------------------------
     ONE WRITER, spelling normalised in one place. Six times this class has bit. */
  function owedMap(save){
    if(!save || !save.meta) return {};
    return save.meta.owed || (save.meta.owed = {});
  }
  function keyIn(map, fid){
    var want=norm(fid);
    for(var k in map) if(norm(k)===want) return k;
    return fid;
  }
  function owedOf(save, fid){
    var m=owedMap(save); return (m[keyIn(m,fid)]|0);
  }

  /* ---- CAN YOU ASK, AND FOR WHAT ----------------------------------------
     Returns null only when the outfit is unknown. Otherwise it always answers,
     because "no, and here is why" is a real answer the card should show -- a
     button that silently is not there teaches nobody anything. */
  function askFor(rule, given, save){
    var B = belongingModule();
    if(!B || !rule) return null;
    var g = GIVES[rule.firstMove] || GIVES['you-give-first'];
    var idx = -1;
    var bar = B.bargain(rule, given|0);
    if(bar && bar.rung)
      for(var i=0;i<B.RUNGS.length;i++) if(B.RUNGS[i].word===bar.rung.word) idx=i;

    /* WHAT they give is HIS LINE, verbatim, never a thing invented here. */
    var what = rule.pays || null;

    if(g.never)
      return { can:false, why:g.refusedWord, what:null, key:rule.key,
               faction:rule.faction, draft:DRAFT };
    if(!what)
      return { can:false, why:'THEY HAVE NOTHING TO GIVE ANYBODY.',
               what:null, key:rule.key, faction:rule.faction, draft:DRAFT };
    if(g.fromRungIndex != null && idx < g.fromRungIndex)
      return { can:false, why:g.refusedWord, what:what, key:rule.key,
               faction:rule.faction, needRung:B.RUNGS[g.fromRungIndex].word,
               draft:DRAFT };

    return { can:true, what:what, word:g.word, note:g.note,
             label: g.owes ? WORDS.take : WORDS.ask,
             costsStanding: !!g.costsStanding, owes: !!g.owes,
             cost: g.costsStanding ? STANDING_COST : 0,
             size: FAVOUR_SIZE,
             key:rule.key, faction:rule.faction, draft:DRAFT };
  }

  /* ---- TAKING IT --------------------------------------------------------
     Returns a DELTA for the count and lets the caller apply it through
     bohemia_belonging, exactly as a refused claim does. The count has one
     writer and it is not this file. */
  function take(rule, given, save){
    var a = askFor(rule, given, save);
    if(!a || !a.can) return { took:false, why:(a&&a.why)||'NOT OFFERED' };
    var m = owedMap(save), k = keyIn(m, rule.key);
    if(a.owes) m[k] = (m[k]|0) + 1;
    return { took:true, what:a.what,
             delta: a.costsStanding ? -STANDING_COST : 0,
             owes: !!a.owes, owed: (m[k]|0),
             word: a.owes ? WORDS.took_free : WORDS.took,
             note: a.costsStanding ? WORDS.spent : null,
             draft:DRAFT };
  }

  /* what the card says about a running account. THE DEBT IS NOT COLLECTED
     HERE: bohemia_claim owns asking, and a second opener is how two systems
     start disagreeing. This only reports that the account exists. */
  function owedRow(save, fid){
    var n = owedOf(save, fid);
    if(!n) return null;
    /* "1 times" is the tell of a string nobody read out loud. */
    var times = (n === 1) ? 'once' : (n === 2 ? 'twice' : (n + ' times'));
    return { word: WORDS.owed,
             note: WORDS.owed_note.replace('{n}', times),
             n: n, draft: DRAFT };
  }

  /* every unruled number, enumerable, per EVERYTHING COSTS ONE section 5. */
  function placeholders(){
    return [
      { where:'bohemia_favour.FAVOUR_SIZE', value:FAVOUR_SIZE, placeholder:true,
        law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what:'how much one favour actually hands over' },
      { where:'bohemia_favour.STANDING_COST', value:STANDING_COST, placeholder:true,
        law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what:'how much standing an earned favour spends' }
    ];
  }
  function words(){
    return Object.keys(WORDS).map(function(k){
      return { id:'favour.'+k, text:WORDS[k], draft:DRAFT, speaker:null,
               scene:'the person card, asking an outfit for something' };
    });
  }

  var API = { GIVES:GIVES, WORDS:WORDS, FAVOUR_SIZE:FAVOUR_SIZE,
              STANDING_COST:STANDING_COST,
              askFor:askFor, take:take, owedOf:owedOf, owedRow:owedRow,
              placeholders:placeholders, words:words };
  if(HASREQ) module.exports=API; else root.BohemiaFavour=API;
})(typeof globalThis!=='undefined'?globalThis:this);
'''


if __name__ == '__main__':
    main()

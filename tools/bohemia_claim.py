#!/usr/bin/env python3
"""
BOHEMIA CLAIM GENERATOR -- WHAT BEING INSIDE COSTS YOU.  (8/16/26, FACTIONS lane)

Writes engine/bohemia_claim.js. EDIT THIS FILE, NEVER THE OUTPUT.

REUSE CHECK (REUSE-FIRST, Paolo 7/22). No graphic pixels. The duty for a
mechanism is DO NOT BUILD A SECOND ONE, and last turn I failed exactly this
check and overwrote engine/bohemia_standing.js. So this time the sweep came
first and it is written down:
  - `ls engine/` read in full before naming this file. The near names are
    bohemia_standing.js (what people THINK of you, from deeds they SAW) and
    bohemia_commitment.js (how far IN you are). Neither models an OBLIGATION
    RUNNING THE OTHER WAY, which is what this is. Nothing called claim/duty/
    obligation/favour exists.
  - engine/bohemia_belonging.js RULES -- what each outfit WANTS is already
    canon and already gated. A claim asks for THAT, never something new, so
    this file invents no wants.
  - engine/bohemia_commitment.js -- the rungs, the wall and the neglect price
    are already there. A claim READS the rung and RETURNS a rung delta; it
    does not keep a second ladder.
  - engine/bohemia_resolve.js makeRation() -- APPROVED by Paolo 7/26 and STILL
    UNADOPTED (the ceiling half was adopted 8/15, this is the other half). A
    claim is rationed by COUNT PER WINDOW, which is exactly what makeRation
    does, so this ADOPTS it rather than writing a second limiter.

--------------------------------------------------------------------------
THE HOLE. Being inside was all upside.
--------------------------------------------------------------------------
8/12 built the ladder, 8/15 built the wall. Both model what YOU do to THEM.
Nothing ever came back the other way: you could reach COUNTED with the Church
and they would never once ask you for anything. Every faction system in every
game models membership as a thing you spend to get benefits from.

PORTES 1998, SOCIAL CAPITAL: ITS ORIGINS AND APPLICATIONS IN MODERN SOCIOLOGY
(Annual Review of Sociology 24:1-24) names four NEGATIVE consequences of social
capital, and the second is the one nobody builds: EXCESS CLAIMS ON GROUP
MEMBERS. Membership is not a wallet you draw on. It is a relationship that can
make demands of you, and the demands scale with how far in you are. Portes'
own examples are of members bled dry by obligations they could not refuse
without losing the standing that made them worth asking.

So: once an outfit COUNTS you, it starts asking. Refusing costs you the rung
that made you worth asking. That is the whole mechanism and it is symmetric
with the ladder rather than bolted beside it.

GOULDNER 1960, THE NORM OF RECIPROCITY, is why a claim has a CLOCK and not a
price: an obligation persists, and the interval between the asking and the
answering is where the relationship actually lives. An unanswered claim is not
neutral -- it is a debt ageing in public.

MECHANISM-MINE / CONTENTS-PAOLO'S: when an outfit asks, how refusing lands and
how the debt ages are mechanism. WHAT they ask for is HIS, read straight out of
bohemia_belonging's RULES, which carry his 8/2 dossier canon. This file names
no outfit and invents no want.

WORDS: every player-facing string here ships as a real attempt tagged
draft:true (ALWAYS MAKE AN ATTEMPT, Paolo 8/11) so he can find and edit each
one. None of it is character speech -- this lane's organs carry mechanical
narration only, the same rule bohemia_ties states about itself.
"""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'engine/bohemia_claim.js')
BELONGING = os.path.join(ROOT, 'engine/bohemia_belonging.js')
COMMITMENT = os.path.join(ROOT, 'engine/bohemia_commitment.js')
RESOLVE = os.path.join(ROOT, 'engine/bohemia_resolve.js')

# ---------------------------------------------------------------- THE ANCHORS
# Same law as this lane's other four organs: a citation a machine cannot check
# is a name-drop, so the generator REFUSES if a fragment it depends on moved.
ANCHORS = [
    (BELONGING, 'var RUNGS=[', 'the ladder a claim reads its trigger off'),
    (BELONGING, 'function ruleOf', 'what an outfit wants is read, never invented here'),
    (COMMITMENT, 'function wallOf', 'the wall the rung sits against'),
    (RESOLVE, 'function makeRation(limits)',
     'the approved rationing mechanism this adopts rather than rebuilding'),
]

# WHEN AN OUTFIT STARTS ASKING. Not a number I picked: it is the rung at which
# his own ladder says you are COUNTED, read out of the shipped table by NAME so
# that retuning the ladder moves this with it.
TRIGGER_RUNG_WORD = 'COUNTED'

# THE WORDS. Real attempts, tagged draft, editable in the WORDS tab. Mechanical
# narration, never a character speaking.
WORDS = dict(
    asked='THEY ARE ASKING YOU',
    asked_note='Not offering. Asking.',
    due='THEY EXPECT AN ANSWER',
    overdue='YOU HAVE NOT ANSWERED',
    overdue_note='It has been {days} days. Nobody has said anything, which is '
                 'the part that should worry you.',
    yes='Do it',
    no='Tell them no',
    refused='YOU TOLD THEM NO',
    refused_note='They counted you and you said no. That is the rung gone, and '
                 'they will remember which way you went.',
    kept='YOU DID IT',
    kept_note='Nothing changes, which is the point. This is the rent on being '
              'counted.',
    spent='THEY HAVE ASKED ENOUGH THIS WEEK',
    spent_note='Even an outfit that owns you does not ask every day.',
    worked_off='You did it, and it came off what you owed them. Some of it.',
    refused_owing='They gave you things {n} times and you said no. That is not '
                  'a rung lost, that is a decision about what you are to them.',
    owing='THEY ARE NOT WAITING',
    owing_note='You owe them. The polite gap between asks is for people who do not.',
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
        sys.stderr.write(
            'bohemia_claim: REFUSING TO GENERATE.\n'
            'Every rule below cites something outside this file, and a citation a\n'
            'machine cannot check is a name-drop.\n\n'
            + '\n'.join('  - ' + b for b in bad) + '\n')
        sys.exit(2)


def trigger_index():
    """WHICH RUNG STARTS THE ASKING, found by NAME in the shipped ladder.

    Read rather than typed so that retuning RUNGS moves the trigger with it and
    cannot silently leave the claim firing at the wrong depth."""
    src = read(BELONGING)
    i = src.index('var RUNGS=[')
    j = src.index('\n  ];', i)
    rungs = json.loads(src[i + len('var RUNGS='):j + 4].strip().rstrip(';'))
    for n, r in enumerate(rungs):
        if r.get('word') == TRIGGER_RUNG_WORD:
            return n, rungs
    sys.stderr.write('bohemia_claim: no rung named %s in the ladder; the trigger '
                     'cannot be derived.\n' % TRIGGER_RUNG_WORD)
    sys.exit(2)


def main():
    check_anchors()
    idx, rungs = trigger_index()
    js = TEMPLATE % dict(
        words=json.dumps(WORDS, indent=2).replace('\n', '\n  '),
        trigger_index=idx,
        trigger_word=TRIGGER_RUNG_WORD,
        rungs=json.dumps([r['word'] for r in rungs]),
    )
    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(js)
    print('wrote %s' % os.path.relpath(OUT, ROOT))
    print('  claims start at rung %d (%s) of %s' % (idx, TRIGGER_RUNG_WORD,
                                                    json.dumps([r['word'] for r in rungs])))


TEMPLATE = r'''// BOHEMIA CLAIM -- WHAT BEING INSIDE COSTS YOU.
//
// GENERATED by tools/bohemia_claim.py. EDIT THE TOOL, NEVER THIS FILE.
//
// THE HOLE. The ladder (8/12) and the wall (8/15) both model what YOU do to
// THEM. Nothing ever came back: you could be COUNTED by the Church and they
// would never once ask you for anything. Membership was a wallet you drew on.
//
// PORTES 1998 (Annu. Rev. Sociol. 24:1-24) names four negative consequences of
// social capital and the second is the one games never build: EXCESS CLAIMS ON
// GROUP MEMBERS. Being inside is a relationship that can make demands of you,
// and the demands scale with how far in you are. Refusing costs the standing
// that made you worth asking -- which is why it is a real decision and not a
// menu.
//
// GOULDNER 1960, THE NORM OF RECIPROCITY: an obligation PERSISTS, and the
// interval between the asking and the answering is where the relationship
// lives. So a claim has a CLOCK, not a price. An unanswered claim is not
// neutral; it is a debt ageing in public.
//
// ADOPTED, NOT REBUILT: the ration is BOH_RESOLVE.makeRation, approved by Paolo
// on 7/26 and unadopted until now (its sibling, makeCeiling, was adopted 8/15).
// An outfit that owns you still does not ask every day, and the limit is a
// COUNT PER WINDOW rather than a price -- which is the whole finding that
// verdict recorded.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: when they ask, how refusing lands and how
// the debt ages are mechanism. WHAT they ask for is read out of
// bohemia_belonging's RULES -- his 8/2 dossier canon -- and this file names no
// outfit and invents no want. Every string is mechanical narration, never a
// character speaking, and ships tagged draft for the WORDS tab.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  /* THE TRIGGER, DERIVED. Claims start when an outfit COUNTS you -- index %(trigger_index)s
     of the shipped ladder %(rungs)s, found by NAME at build time so retuning the
     ladder moves this with it instead of leaving it firing at the wrong depth. */
  var TRIGGER_RUNG = %(trigger_index)s;
  var TRIGGER_WORD = '%(trigger_word)s';

  /* WORDS: real attempts, editable, tagged draft (ALWAYS MAKE AN ATTEMPT 8/11). */
  var WORDS = %(words)s;
  var DRAFT = true;

  function belongingModule(){
    if(typeof BohemiaBelonging!=='undefined') return BohemiaBelonging;
    if(root && root.BohemiaBelonging) return root.BohemiaBelonging;
    if(HASREQ){ try { return require('./bohemia_belonging.js'); } catch(_e){} }
    return null;
  }
  function resolveModule(){
    if(typeof BOH_RESOLVE!=='undefined') return BOH_RESOLVE;
    if(root && root.BOH_RESOLVE) return root.BOH_RESOLVE;
    if(HASREQ){ try { return require('./bohemia_resolve.js'); } catch(_e){} }
    return null;
  }

  /* THE RATION IS THE APPROVED ONE, and it is a DEPENDENCY not a fallback --
     same rule the wall follows. A silent second limiter is how two systems
     start disagreeing. The LIMITS are the caller's: this file does not decide
     how many times a week an outfit may lean on you, because that is exactly
     the [PENDING Paolo] the 7/26 verdict reserved (item c, RATION LIMITS). */
  /* ONE RATION PER SAVE, NOT ONE PER PROCESS. The first version cached a single
     module-level instance, which meant the LIMITS were frozen at whatever the
     first caller passed and the SPENT COUNTS leaked across saves -- so a second
     game in the same session started with the week already used up. The gate
     caught it as four separate failures with one cause.
     A WeakMap keyed on the save is the right scope: the ration belongs to the
     game it is limiting, and it goes away with it.
     HONEST LIMIT, stated rather than hidden: these counts are not IN the save,
     so a reload inside one week forgets that an outfit already asked. It cannot
     produce a DOUBLE ask -- an unanswered claim is still open in the save and
     open() refuses ALREADY_OPEN -- it can only let them ask again sooner after
     you have already answered. The day the limits become a ruling, that is the
     moment to move the counts into the save with them. */
  var _rations = (typeof WeakMap!=='undefined') ? new WeakMap() : null;
  function ration(save, limits){
    var R = resolveModule();
    if(!R || typeof R.makeRation!=='function')
      throw new Error('bohemia_claim: BOH_RESOLVE.makeRation is required and absent. '
        + 'This module ADOPTS the approved ration (Paolo 7/26); it does not carry a second one.');
    if(!_rations) return R.makeRation(limits || {});
    var r = _rations.get(save);
    if(!r){ r = R.makeRation(limits || {}); _rations.set(save, r); }
    return r;
  }

  function norm(f){ return String(f||'').toUpperCase().replace(/[\s_]/g,''); }

  /* ---- WHERE A CLAIM LIVES ------------------------------------------------
     ONE WRITER, and it normalises the spelling, exactly as the count and the
     commitment do. The three-spellings problem has bitten this codebase five
     times and it is solved in one place per fact. */
  function claimsOf(save){
    if(!save || !save.meta) return {};
    return save.meta.claims || (save.meta.claims = {});
  }
  function keyIn(map, fid){
    var want = norm(fid);
    for(var k in map) if(norm(k)===want) return k;
    return fid;
  }
  function openOf(save, fid){
    var m = claimsOf(save); return m[keyIn(m, fid)] || null;
  }

  /* ---- DOES ONE EXIST -----------------------------------------------------
     A claim OPENS on the day you become COUNTED, and re-opens once answered.
     Deterministic: no roll decides whether they ask, because "sometimes they
     forget about you" is not what being counted means. What is rationed is how
     OFTEN, and that is the caller's window. */
  function claimFor(rule, given, day, save, opts){
    opts = opts || {};
    var B = belongingModule();
    if(!B || !rule) return null;
    var bar = B.bargain(rule, given|0);
    if(!bar || !bar.rung) return null;
    var rungIdx = B.RUNGS.indexOf ? -1 : -1;
    /* the rung INDEX, by identity against the shipped table rather than by
       re-deriving a threshold here. */
    var idx = -1;
    for(var i=0;i<B.RUNGS.length;i++) if(B.RUNGS[i].word===bar.rung.word) idx=i;
    if(idx < TRIGGER_RUNG) return null;            // they do not ask the uncounted

    /* THE KEY IS THE IDENTITY, THE FACTION IS THE LABEL. rule.faction is a
       display name ("THE CHURCH"); rule.key is the id ("CHURCH"). Looking the
       save up by the label found nothing, forever, and silently -- the same
       three-spellings class that has now bitten this codebase six times. The
       save is ALWAYS keyed by rule.key; only rows on screen use .faction. */
    var cur = openOf(save, rule.key);
    if(!cur) return null;                          // nothing open; caller opens it
    var age = Math.max(0, (day|0) - (cur.since|0));
    return {
      faction: rule.faction,
      key: rule.key,
      what: bar.wantWord,                          // HIS canon, never invented here
      wantKey: rule.wants,
      since: cur.since|0,
      days: age,
      overdue: age > 0,
      ask: WORDS.asked,
      askNote: WORDS.asked_note,
      dueWord: age > 0 ? WORDS.overdue : WORDS.due,
      dueNote: age > 0
        ? WORDS.overdue_note.replace('{days}', String(age))
        : null,
      yes: WORDS.yes, no: WORDS.no,
      draft: DRAFT
    };
  }

  /* THEY START ASKING. Called by a surface when it sees a counted rung and no
     open claim. Rationed through the approved mechanism, so an outfit that owns
     you still does not lean on you every single day. */
  function open(save, fid, day, when, limits, owed){
    if(!save || !save.meta || !fid) return null;
    /* THE DEBT IS WHY THEY DO NOT WAIT (8/18). makeRation has carried a BYPASS
       slot since Paolo approved it on 7/26 -- "the birthday shape: an occasion
       that ignores both windows" -- and NOTHING HAS EVER CALLED IT. This is what
       it was for: an outfit you owe does not respect the polite weekly limit,
       because the limit models restraint and a creditor has none.
       The multiplier stays 1 (EVERYTHING COSTS ONE): owing changes WHETHER they
       wait, not how much they take in one go. */
    var bypass = ((owed|0) > 0) ? { allow:true, multiplier:1 } : null;
    var r = ration(save, limits).spend('claim:'+norm(fid), when, bypass);
    if(!r.allowed) return { opened:false, reason:r.reason,
                            word:WORDS.spent, note:WORDS.spent_note, draft:DRAFT };
    var m = claimsOf(save), k = keyIn(m, fid);
    if(m[k]) return { opened:false, reason:'ALREADY_OPEN' };
    m[k] = { since: day|0 };
    return { opened:true, since: day|0 };
  }

  /* ---- ANSWERING IT ------------------------------------------------------
     YES holds everything: nothing goes up, because meeting an obligation is the
     RENT on being counted, not a way to climb. That asymmetry is Portes' whole
     point and it is the part that makes membership cost something.
     NO costs the rung that made you worth asking. This returns the delta and
     lets the caller apply it, because the count lives in bohemia_belonging and
     a second writer is how two ladders start disagreeing. */
  function answer(save, fid, said, given, owed){
    var m = claimsOf(save), k = keyIn(m, fid);
    if(!m[k]) return { answered:false, reason:'NOTHING_ASKED' };
    delete m[k];
    var B = belongingModule();
    if(said === 'yes'){
      /* DOING WHAT THEY ASK PAYS THE ACCOUNT DOWN, one favour per claim met.
         A debt you can never clear is a sentence, not a relationship -- Gouldner's
         interval has to be able to CLOSE. The caller applies this through
         bohemia_favour.settle, which is the debt's one writer; this file only
         says how much was worked off. */
      return { answered:true, said:'yes', delta:0,
               settle: ((owed|0) > 0) ? 1 : 0,
               word:WORDS.kept,
               note: ((owed|0) > 0) ? WORDS.worked_off : WORDS.kept_note,
               draft:DRAFT };
    }
    /* THE COST OF NO: you fall out of the rung that made you worth asking.
       Derived -- it is the distance back to the rung below the trigger, read
       off the shipped ladder, never a typed number. */
    var back = 0;
    if(B && B.RUNGS[TRIGGER_RUNG]){
      var floor = B.RUNGS[TRIGGER_RUNG].at|0;
      back = Math.max(0, (given|0) - (floor - 1));
    }
    /* REFUSING A CREDITOR COSTS MORE THAN REFUSING A FRIEND. One rung per
       unpaid favour on top of the fall, tagged as a placeholder like every other
       unruled number here. This is the whole reason the free thing was free. */
    var extra = Math.max(0, owed|0);
    return { answered:true, said:'no', delta:-(back + extra),
             owedWhenRefused: extra,
             word:WORDS.refused,
             note: extra ? WORDS.refused_owing.replace('{n}', String(extra))
                         : WORDS.refused_note,
             settle:0, draft:DRAFT };
  }

  /* every drafted string, so the WORDS tab can list and edit them without
     anybody remembering they exist. */
  function words(){
    return Object.keys(WORDS).map(function(k){
      return { id:'claim.'+k, text:WORDS[k], draft:DRAFT,
               speaker:null, scene:'the person card, an outfit that counts you' };
    });
  }

  /* every unruled number in this module, per EVERYTHING COSTS ONE section 5. */
  function placeholders(){
    return [
      { where:'bohemia_claim.refusalSurchargePerDebt', value:1, placeholder:true,
        law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what:'extra rungs lost per unpaid favour when you refuse a creditor' },
      { where:'bohemia_claim.settlePerClaimMet', value:1, placeholder:true,
        law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
        what:'how many favours one met claim works off' }
    ];
  }

  var API = { WORDS:WORDS, TRIGGER_RUNG:TRIGGER_RUNG, TRIGGER_WORD:TRIGGER_WORD,
              placeholders:placeholders,
              claimFor:claimFor, open:open, answer:answer,
              openOf:openOf, claimsOf:claimsOf, words:words };
  if(HASREQ) module.exports=API; else root.BohemiaClaim=API;
})(typeof globalThis!=='undefined'?globalThis:this);
'''


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
BOHEMIA COMMITMENT GENERATOR -- THE WALL YOU CANNOT GRIND THROUGH, AND WHO
FINDS OUT WHEN YOU PASS IT.  (8/15/26, FACTIONS lane)

Writes engine/bohemia_commitment.js. EDIT THIS FILE, NEVER THE OUTPUT.

REUSE CHECK (REUSE-FIRST, Paolo 7/22):
  - THIS COOKS NO GRAPHIC PIXELS AT ALL, so banks/ is not the relevant shelf.
    The equivalent duty for a mechanism is: do not build a second one. So the
    check I actually owed was against engine/, and it found the thing already
    built and never called:
  - engine/bohemia_resolve.js makeCeiling() -- APPROVED BY PAOLO 7/26
    (records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt: "CEILING -- a cap that only
    moves on a COMMITMENT, never on more points, with neglect allowed to grow
    as you get closer" ... "APPROVE unlocks volume: the owning lanes may now
    adopt these without asking again"). It has had ZERO CALLERS for twenty
    days -- verified by grep across engine/, slices/ and gates/, not assumed.
    THIS MODULE CALLS IT. It does not reimplement the clamp, because a second
    clamp is the two-systems-disagreeing bug this lane has now fixed four
    times.
  - engine/bohemia_belonging.js RUNGS -- the ladder shipped 8/12 and is gated.
    Every wall here is DERIVED from that table by an index rule, never typed.
  - engine/bohemia_ties.js tiesOf() -- the acquaintance graph shipped 8/12 and
    has exactly one consumer (the vouch). WORD TRAVELS is its second consumer
    and needs no new data: no dice are rolled that were not already rolled.

  *** AND THE ONE I GOT WRONG, WRITTEN HERE BECAUSE IT IS THE WHOLE POINT OF
      THIS CHECK. This module was first called bohemia_standing.js -- and
      engine/bohemia_standing.js ALREADY EXISTED, shipped 8/2 by the PEOPLE
      lane, gated 35/35, with a commit literally titled "WORD TRAVELS". I
      overwrote it, and its gate, because my reuse check swept for a CALLER of
      makeCeiling instead of asking the only question that mattered: DOES A
      MODULE FOR THIS ALREADY EXIST. Restored from git the same turn.
      THE BOUNDARY, so nobody builds a third:
        bohemia_standing.js  WHAT PEOPLE THINK OF YOU. Deeds you were SEEN
                             doing, remembered by individual minds, decaying,
                             retold at a penalty per hop. Opinion is derived,
                             never stored; a faction's view is its members'.
        bohemia_commitment.js (this) HOW FAR IN YOU ARE WITH AN OUTFIT. A
                             ceiling on what turning up can buy, passed only by
                             a declared commitment, plus which outfits are
                             structurally positioned to hear about that
                             declaration.
      Different questions -- what you DID versus how far IN you are -- but they
      overlap on the words "standing" and "word travels", and BOTH now carry a
      RUNGS table. FLAGGED FOR CONSOLIDATION, not merged blind on the turn I
      found it.

WHAT WAS MISSING, AND IT IS THE WHOLE POINT OF A LADDER.
The lane shipped a five-rung ladder on 8/12 and you could climb all of it by
pressing the same button ten times. There was nothing at the top and nothing in
the way. A ladder with no wall is a progress bar, and a progress bar is not a
decision.

--------------------------------------------------------------------------
THE FOUR THINGS THE 7/26 VERDICT LEFT [PENDING Paolo], AND WHY NONE OF THEM
IS INVENTED HERE. This is the part to check rather than trust.
--------------------------------------------------------------------------
The verdict parked "(d) THE STANDING LADDER. The faction states, where each
wall sits, what commitment moves it, and what neglect costs at each rung."
Taken as one blob that reads as "build nothing". Split into its four actual
parts, three of them were never numbers at all:

  THE FACTION STATES     -- a SHAPE, not a number, and his own approved
                            sentence names them: "you only pass it by
                            COMMITTING (TAKING A SIDE, BURNING A BRIDGE)".
                            Two named acts, so three states. Read out of his
                            words, not chosen.
  WHERE EACH WALL SITS   -- DERIVED from bohemia_belonging RUNGS, which
                            shipped 8/12 and is gated. The rule is one
                            sentence: EACH COMMITMENT BUYS EXACTLY ONE MORE
                            RUNG, so a state's ceiling is one below the
                            threshold of the rung it does NOT buy you.
                            Computed from the table at build time; if the
                            table moves, these move with it and the gate
                            re-derives rather than trusting.
  WHAT COMMITMENT MOVES IT -- his words again, same sentence.
  WHAT NEGLECT COSTS     -- THE ONLY ACTUAL NUMBER, and it is answered by a
                            LAW NEWER THAN THE PENDING: EVERYTHING COSTS ONE
                            (Paolo 8/15, LOCKED) -- "every resource cost,
                            price, payout and yield is 1 ... plus any future
                            resource price anybody is tempted to invent."
                            Standing IS this game's currency by our own lab
                            finding (7/31: "TEN YEARS COLD, MONEY IS NOT THE
                            CURRENCY. STANDING IS"), so neglect is a price and
                            the law covers it. It is 1 per stage, TAGGED
                            placeholder per that law's section 5, and
                            enumerable so his tuning pass finds it.
TRUTH HIERARCHY: 8/15 is newer than 7/26 and the newest date wins. Nothing
here decided a number; one law answered it and the rest were never numbers.

--------------------------------------------------------------------------
THE RESEARCH, because the interesting half is not the wall, it is the cost
--------------------------------------------------------------------------
A wall alone is just a gate with extra steps. What makes committing a DECISION
is that it is visible to people who are not in the room.

PORTES 1998, SOCIAL CAPITAL: ITS ORIGINS AND APPLICATIONS IN MODERN SOCIOLOGY
(Annual Review of Sociology 24:1-24). The four negative consequences of social
capital: exclusion of outsiders, EXCESS CLAIMS ON GROUP MEMBERS, restrictions
on individual freedom, and downward levelling norms. Being inside is not a
reward you collect, it is a relationship that can make demands of you. Games
almost universally model the first half and never the second.

BURT, STRUCTURAL HOLES / SIMMEL'S TERTIUS GAUDENS ("the third who benefits").
An actor whose network spans a hole between two disconnected groups brokers
the flow between them and gains from it -- better information, earlier, and
the standing that comes with being the only route.

TERTIUS DOLENS ("the third who suffers"), Organization Science 2024, Interalter
Conflict and Its Negative Impact on Broker Performance. THE CORRECTION TO THE
ABOVE, and the reason this is a game and not a free lunch: when the two sides
you broker between are IN CONFLICT WITH EACH OTHER, spanning the hole stops
paying and starts costing. Same position, opposite sign, decided entirely by
whether your two sides are connected.

LIPSET & ROKKAN 1967 / COSER 1956 / DAHRENDORF 1959, CROSS-CUTTING CLEAVAGES.
When people who oppose each other on one dimension are allies on another,
polarisation drops and conciliation gets likelier; when the cleavages REINFORCE
(the same split every time), conflict intensifies. THE ENGINE ALREADY CARRIES
THIS AND HAS NEVER USED IT: bohemia_ties has exactly three foci -- home, work,
faction -- so a home or work tie IS a cross-cutting cleavage against the
faction one. Word about your commitment that reaches a rival through a shared
roof or a shared job site lands SOFT. Word that reaches them faction-to-faction
the whole way lands HARD. No new data, no new dice.

MECHANISM-MINE / CONTENTS-PAOLO'S: the wall, the graph walk and the landing
rule are mechanism. WHICH outfits exist, what they want and who runs with them
is his, read out of bohemia_belonging, and nothing here ranks an outfit, names
a rival, or decides that any two of them are enemies.
"""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'engine/bohemia_commitment.js')
BELONGING = os.path.join(ROOT, 'engine/bohemia_belonging.js')
RESOLVE = os.path.join(ROOT, 'engine/bohemia_resolve.js')
VERDICT = os.path.join(ROOT, 'records/BOHEMIA_LAB_PORT_VERDICT_7_26_26.txt')

# --------------------------------------------------------------------------
# THE ANCHORS. Same law as the other three organs in this lane: every rule
# carries a verbatim fragment of the thing it claims to come from, and this
# generator REFUSES TO RUN if the fragment moved. A citation a machine cannot
# check is a name-drop.
# --------------------------------------------------------------------------
ANCHORS = [
    (VERDICT, 'CEILING — a cap that only moves on a COMMITMENT, never on more points',
     'the ceiling mechanism is his approved verdict, not this lane\'s idea'),
    (VERDICT, 'APPROVE unlocks volume: the owning lanes may now adopt these without asking',
     'adoption without re-asking is explicitly permitted by the same verdict'),
    (RESOLVE, 'function makeCeiling(stages)',
     'the mechanism being adopted still exists and is still called makeCeiling'),
    (BELONGING, 'var RUNGS=[',
     'the ladder every wall is derived from'),
]

# THE COMMITMENT STATES. Read out of the verdict's own sentence -- "you only
# pass it by COMMITTING (taking a side, burning a bridge)" -- which names two
# acts and therefore three states. The words on the cards are drafted per the
# 8/11 ALWAYS MAKE AN ATTEMPT law and carry draft:true so he can find them.
STATES = [
    dict(state='none',
         word='NOTHING SAID',
         note='You have committed to nobody. Everything you have done for them, '
              'you could walk away from tomorrow and they would shrug.',
         passBy=None,
         passWord=None,
         passNote=None),
    dict(state='sided',
         word='YOU TOOK A SIDE',
         note='You said out loud that you are with them. Nobody had to write it '
              'down for it to be true.',
         passBy='take-a-side',
         passWord='Say you are with them',
         passNote='Said in front of people. That is the whole mechanism and it '
                  'is enough.'),
    dict(state='burned',
         word='YOU BURNED A BRIDGE',
         note='You cost yourself somewhere else to be here. This is the one that '
              'cannot be walked back.',
         passBy='burn-a-bridge',
         passWord='Burn a bridge for them',
         passNote='Something you had with somebody else is gone now, and they '
                  'know which somebody.'),
]

# HOW WORD LANDS.
#
# THE FIRST VERSION OF THIS WAS DEAD CODE AND THE GRAPH PROVED IT. It split the
# news into cross-cutting (soft) and reinforcing (hard), straight out of the
# cleavage literature. Then the walk was run on a real roster and `reinforced`
# could not fire even once -- because a FACTION focus only ever links two people
# in the SAME faction, so the walk cannot cross a faction line without stepping
# through a home or work tie. Every bridge between two outfits is cross-cutting
# BY CONSTRUCTION.
#
# That is not a bug to patch around, it is Feld 1981 being right: the structure
# of the foci decides the structure of the network. A mechanic that can never
# fire is the authored-but-unread disease, so the label is now on the thing that
# actually varies -- DISTANCE -- and the cross-cutting theorem is asserted by the
# gate instead of pretended to be a dial.
#
# Granovetter 1973 is the reason distance is the right axis: weak ties carry
# information FURTHER, and what arrives at the end of a chain is not what was
# said at the start. One hop is a witness. Three hops is a rumour.
LANDING = {
    'direct': dict(word='AS FACT',
                   note='Somebody who shares a roof or a job with one of theirs '
                        'was close enough to know. It reaches them as a thing '
                        'that happened, not a thing they heard.'),
    'secondhand': dict(word='AS A RUMOUR',
                       note='It gets to them down a chain of people who each '
                            'only half know you. They will hear that you did '
                            'something. They will not hear exactly what.'),
    'silent': dict(word='NOT AT ALL',
                   note='There is no line between them and you. Nobody who could '
                        'carry it knows anybody who would care.'),
}


def read(path):
    with open(path, 'r', encoding='utf-8') as fh:
        return fh.read()


def check_anchors():
    """REFUSE TO RUN if any claim this file makes about another file is stale."""
    bad = []
    for path, frag, why in ANCHORS:
        if not os.path.exists(path):
            bad.append('MISSING FILE %s (%s)' % (path, why))
            continue
        if frag not in read(path):
            bad.append('ANCHOR MOVED in %s\n    wanted: %s\n    why it matters: %s'
                       % (os.path.relpath(path, ROOT), frag, why))
    if bad:
        sys.stderr.write(
            'bohemia_commitment: REFUSING TO GENERATE.\n'
            'Every rule below cites something outside this file, and a citation a\n'
            'machine cannot check is a name-drop. Fix the source or fix the anchor.\n\n'
            + '\n'.join('  - ' + b for b in bad) + '\n')
        sys.exit(2)


def rungs_from_belonging():
    """THE LADDER, READ OUT OF THE SHIPPED MODULE rather than retyped here.

    Retyping it would create a second copy that drifts the first time somebody
    tunes the real one -- exactly the bug the ANCHOR law exists to stop. So the
    thresholds are parsed out of bohemia_belonging.js's own RUNGS array."""
    src = read(BELONGING)
    i = src.index('var RUNGS=[')
    j = src.index('\n  ];', i)
    blob = src[i + len('var RUNGS='):j + 4].strip().rstrip(';')
    rungs = json.loads(blob)
    if len(rungs) < 3:
        sys.stderr.write('bohemia_commitment: RUNGS has %d entries; the wall rule '
                         'needs at least three.\n' % len(rungs))
        sys.exit(2)
    return rungs


def walls(rungs):
    """EACH COMMITMENT BUYS EXACTLY ONE MORE RUNG.

    So a state's ceiling is one below the threshold of the rung it does NOT buy
    you, and the last state has no wall at all. With the shipped ladder
    (0/1/3/6/10 -> stranger/peripheral/useful/counted/inside) that means:

      none    ceiling 5   you can be USEFUL by turning up. You cannot be COUNTED.
      sided   ceiling 9   you can be COUNTED. You cannot be INSIDE.
      burned  no ceiling  INSIDE is reachable.

    NOT ONE OF THOSE NUMBERS IS TYPED. Change the ladder and they follow."""
    out = []
    for n, st in enumerate(STATES):
        blocked_i = n + 3          # stranger+peripheral are free; +1 per commitment
        if blocked_i < len(rungs):
            ceiling = rungs[blocked_i]['at'] - 1
            blocked = rungs[blocked_i]
        else:
            ceiling = None         # serialises to Infinity: the last state has no wall
            blocked = None
        reach_i = min(n + 2, len(rungs) - 1)
        out.append(dict(st,
                        ceiling=ceiling,
                        reaches=rungs[reach_i]['word'],
                        blocks=(blocked['word'] if blocked else None),
                        # EVERYTHING COSTS ONE (8/15): the only real number here,
                        # one per stage, tagged so his tuning pass enumerates it.
                        neglect=n,
                        neglectPlaceholder=True))
    return out


def main():
    check_anchors()
    rungs = rungs_from_belonging()
    stages = walls(rungs)

    js = HEAD % dict(
        stages=json.dumps(stages, indent=2).replace('\n', '\n  '),
        landing=json.dumps(LANDING, indent=2).replace('\n', '\n  '),
        rungs=json.dumps([r['at'] for r in rungs]),
    ) + BODY

    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write(js)
    print('wrote %s' % os.path.relpath(OUT, ROOT))
    print('  states  : ' + ', '.join(
        '%s(ceiling %s, neglect %s)' % (s['state'],
                                        'none' if s['ceiling'] is None else s['ceiling'],
                                        s['neglect']) for s in stages))
    print('  derived from RUNGS at ' + json.dumps([r['at'] for r in rungs]))


HEAD = r'''// BOHEMIA COMMITMENT -- THE WALL YOU CANNOT GRIND THROUGH, AND WHO FINDS OUT.
//
// GENERATED by tools/bohemia_commitment.py. EDIT THE TOOL, NEVER THIS FILE.
//
// THE HOLE THIS FILLS. On 8/12 this lane shipped a five-rung ladder from
// stranger to inside, and you could climb the whole thing by pressing one
// button ten times. Nothing stopped you, nothing noticed, and no other outfit
// in the valley ever heard about it. A ladder with no wall is a progress bar.
//
// TWO THINGS ARE ADDED AND THEY ONLY MATTER TOGETHER:
//   THE WALL   favours run out of road. You can turn up for the Church until
//              they call you USEFUL and not one act further; the rest of the
//              way is not for sale at any quantity of the same thing.
//   THE COST   the only thing that passes a wall is a COMMITMENT, and a
//              commitment is visible. Word travels the acquaintance graph to
//              every other outfit that has a line to this one.
//
// ADOPTED, NOT REBUILT. The clamp is BOH_RESOLVE.makeCeiling -- Paolo APPROVED
// it 7/26 ("a cap that only moves on a COMMITMENT, never on more points, with
// neglect allowed to grow as you get closer") and it has had zero callers for
// twenty days. This module calls it rather than writing a second clamp,
// because two clamps is the two-systems-disagreeing bug this lane has already
// fixed four times.
//
// GROUNDED, NOT INVENTED:
//   PORTES 1998 (Annu. Rev. Sociol. 24:1-24), the four dark sides of social
//     capital -- exclusion of outsiders, EXCESS CLAIMS ON GROUP MEMBERS,
//     restriction of individual freedom, downward levelling norms. Being
//     inside is a relationship with obligations, never a prize you collect.
//   BURT / SIMMEL, TERTIUS GAUDENS -- the third who benefits. Spanning a hole
//     between two disconnected outfits is a real advantage.
//   TERTIUS DOLENS (Organization Science 2024) -- the third who SUFFERS. When
//     the two sides you span are connected and in conflict, the identical
//     position costs you instead. Same standing, opposite sign.
//   LIPSET & ROKKAN 1967 / COSER 1956, CROSS-CUTTING CLEAVAGES -- when
//     opponents on one dimension are allies on another, conflict moderates.
//     bohemia_ties already carries three foci (home, work, faction), so a home
//     or work tie IS a cross-cut against the faction split. This module reads
//     that; it generates nothing.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: the wall, the walk and the landing rule
// are mechanism. Which outfits exist and what they want is his. NOTHING HERE
// NAMES A RIVAL OR DECIDES THAT TWO OUTFITS ARE ENEMIES -- it only reports who
// is in a position to hear, and how the news would reach them.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  /* THE COMMITMENT STATES AND THEIR WALLS.
     Every ceiling below is DERIVED from bohemia_belonging's RUNGS at build
     time by one rule -- each commitment buys exactly one more rung -- and none
     of them is typed by hand. The ladder this was derived from was at %(rungs)s.
     `ceiling: null` means no wall at all, which is the last state by
     construction rather than by choice.
     `neglect` is the one genuine number and it is 1 per stage under
     EVERYTHING COSTS ONE (Paolo 8/15): it carries neglectPlaceholder so his
     tuning pass can enumerate every unruled number in the game in one list. */
  var STAGES = %(stages)s;

  /* HOW THE NEWS LANDS. Labels on a derived answer; there is no dial here. */
  var LANDING = %(landing)s;
'''

BODY = r'''
  /* ---- THE WALL ----------------------------------------------------------
     BOH_RESOLVE.makeCeiling is the approved mechanism and it is a DEPENDENCY,
     not a fallback. If it is absent the honest answer is to say so loudly
     rather than quietly clamp with a second implementation -- a silent
     substitute is how two systems start disagreeing. */
  function resolveModule(){
    if(typeof BOH_RESOLVE !== 'undefined') return BOH_RESOLVE;
    if(typeof root !== 'undefined' && root.BOH_RESOLVE) return root.BOH_RESOLVE;
    if(HASREQ){ try { return require('./bohemia_resolve.js'); } catch(_e){} }
    return null;
  }
  var _ceiling = null;
  function ceiling(){
    if(_ceiling) return _ceiling;
    var R = resolveModule();
    if(!R || typeof R.makeCeiling !== 'function')
      throw new Error('bohemia_commitment: BOH_RESOLVE.makeCeiling is required and '
        + 'absent. This module ADOPTS the approved ceiling (Paolo 7/26); it does '
        + 'not carry a second one.');
    /* makeCeiling wants a real number and rejects a decreasing run, so the
       no-wall state serialises to Infinity here. */
    _ceiling = R.makeCeiling(STAGES.map(function(s){
      return { state:s.state,
               ceiling: (s.ceiling==null ? Infinity : s.ceiling),
               neglect: s.neglect };
    }));
    return _ceiling;
  }

  function stageOf(state){
    for(var i=0;i<STAGES.length;i++) if(STAGES[i].state===state) return STAGES[i];
    return STAGES[0];
  }
  function stateIndex(state){
    for(var i=0;i<STAGES.length;i++) if(STAGES[i].state===state) return i;
    return 0;
  }
  function firstState(){ return STAGES[0].state; }

  /* WHERE YOU ARE AGAINST THE WALL, in one call, for a card that has a rung
     count and a commitment state and wants to say what is actually stopping
     you. Returns atWall true when more of the same thing will do nothing --
     which is the whole point, and it has to be legible BEFORE you press, not
     discovered after. */
  function wallOf(state, given){
    var st = stageOf(state), C = ceiling();
    var cap = C.ceilingFor(st.state);
    var n = given|0;
    /* THE PASS BELONGS TO THE STATE YOU ARE MOVING TO, NOT THE ONE YOU ARE IN.
       Read off the current stage first and the player standing at the first
       wall was offered nothing at all, because 'none' is the state you are
       given rather than one you commit to. The question a card asks is always
       "what gets me PAST this", so the answer comes from next. */
    var nx = (stateIndex(st.state) < STAGES.length-1)
               ? STAGES[stateIndex(st.state)+1] : null;
    return {
      state:    st.state,
      word:     st.word,
      note:     st.note,
      ceiling:  cap,
      atWall:   C.isWalled(st.state, n),
      reaches:  st.reaches,
      blocks:   st.blocks,
      room:     (cap===Infinity ? Infinity : Math.max(0, cap - n)),
      passBy:   nx ? nx.passBy   : null,
      passWord: nx ? nx.passWord : null,
      passNote: nx ? nx.passNote : null,
      next:     nx
    };
  }

  /* doing the thing they want, clamped. THE CLAMP IS THE APPROVED ONE. */
  function give(state, given, amount){
    var r = ceiling().add(stageOf(state).state, given|0,
                          (amount==null?1:amount)|0);
    return { points:r.points, gained:r.gained, capped:r.capped, ceiling:r.ceiling };
  }

  /* THE ONLY THING THAT MOVES A WALL. `gate` is the caller's, exactly as the
     approved mechanism intends -- this file does not decide what earns a
     commitment. It refuses when you have not even filled the current room,
     because committing to people you have barely met is not a decision, it is
     a typo. */
  function commit(state, given){
    var w = wallOf(state, given);
    if(!w.next) return { state:state, moved:false, reason:'FINAL' };
    var r = ceiling().advance(state, given|0,
              { requiredPoints: (w.ceiling===Infinity ? 0 : w.ceiling) });
    if(!r.moved) return { state:state, moved:false, reason:r.reason,
                          need:r.need, have:given|0 };
    return { state:r.state, moved:true, reason:'COMMITTED',
             ceiling:r.ceiling, neglect:r.neglect,
             word:stageOf(r.state).word, note:stageOf(r.state).note };
  }

  function neglectFor(state){ return ceiling().neglectFor(stageOf(state).state); }

  /* ---- WORD TRAVELS ------------------------------------------------------
     WHICH OTHER OUTFITS LEARN THAT YOU COMMITTED, and how the news gets to
     them. Nothing is rolled: this walks the acquaintance graph bohemia_ties
     already builds out of foci the world already decided.

     THE WALK. Start from everybody who runs with the outfit you committed to.
     Step outward along real ties. Every person carries their own outfit, so
     the first time the walk touches somebody from another outfit, that outfit
     has heard -- at that distance, along that path.

     BFS, not depth-first, because the SHORTEST path is the one that decides
     how the news lands and a deep walk would find a long ugly route first. */
  function whoHears(fid, roster, cell, opts){
    opts = opts || {};
    var T = opts.ties || (typeof BohemiaTies!=='undefined' ? BohemiaTies : null);
    if(!T || !fid || !roster || !roster.length) return [];
    var keyOf = opts.keyOf || function(a){ return String(a && a.id); };
    var maxHops = (opts.maxHops!=null ? opts.maxHops : 3);
    var want = norm(fid);

    var byKey = {};
    roster.forEach(function(a){ byKey[keyOf(a)] = a; });
    function facOf(k){ var a=byKey[k]; return a && a.faction ? norm(a.faction) : null; }

    /* the front line: everybody in the outfit you committed to. */
    var seen = {}, queue = [];
    roster.forEach(function(a){
      if(facOf(keyOf(a)) !== want) return;
      var k = keyOf(a); seen[k]=true;
      queue.push({ key:k, hops:0, crossed:false });
    });
    if(!queue.length) return [];

    var heard = {};
    for(var qi=0; qi<queue.length; qi++){
      var cur = queue[qi];
      if(cur.hops >= maxHops) continue;
      var ties = T.tiesOf(cur.key, roster, cell, keyOf);
      for(var i=0;i<ties.length;i++){
        var t = ties[i];
        if(seen[t.key]) continue;
        seen[t.key] = true;
        /* A CROSS-CUTTING STEP. home and work are the other two dimensions;
           travelling either of them means the split was crossed on the way,
           and the cleavage literature says that is what softens it. */
        var crossed = cur.crossed || (t.via === 'home' || t.via === 'work');
        var f = facOf(t.key);
        if(f && f !== want && !heard[f]){
          heard[f] = { faction:f, hops:cur.hops+1, via:t.via,
                       crossed:crossed, through:t.key };
        }
        queue.push({ key:t.key, hops:cur.hops+1, crossed:crossed });
      }
    }
    /* ---- THE ONES WHO WERE ALREADY WATCHING (8/26) ----------------------
       MEASURED FIRST, BUILT SECOND. A sweep of the live city -- every base,
       every affiliated person, real whoHears against the real roster -- found
       TWO hearing pairs in the entire valley, Mob<->Network, and NEITHER of
       them is a pair canon holds a position on. So the canon wars were priced,
       wired to the surface, and structurally unable to fire: the acquaintance
       walk needs a chain of housemates and workmates between two outfits, and
       in a thin population there almost never is one.

       AND THE CHAIN IS THE WRONG TEST FOR THIS CASE ANYWAY, which is the part
       that makes this a fix and not a cheat. This module's own STAGES say what
       a commitment IS:
           sided  -- "Said in front of people. That is the whole mechanism and
                      it is enough."
           burned -- "Something you had with somebody else is gone now, AND
                      THEY KNOW WHICH SOMEBODY."
       A public declaration does not travel by rumour. The Remnants have been
       at war with the Cartel for longer than anyone alive; they do not need
       your housemate to tell them who the Cartel just took in. They are
       already looking.

       SO: an outfit that CANON says holds a position on the outfit you are
       committing to hears it as FACT, at zero hops, with no tie required.
       Nothing here decides who those outfits are -- opts.watching supplies
       them, and the only supplier is BohemiaBetween, which reads
       BOHEMIA_faction_graph.json and invents nothing.

       ORDER MATTERS AND IT IS DELIBERATE:
         - a real tie at 0-1 hops WINS, because it is richer: it names the
           room the news went through, and "your own housemate runs with them"
           is the interesting half.
         - a rumour at 2+ hops is UPGRADED, because an outfit that is watching
           does not settle for half the story. The chain is kept in `through`
           so the surface can still say who else knew.
       OPT-IN, exactly like the between module in costs(): a caller that passes
       nothing gets the old walk unchanged, so no surface moves under a lane
       that has not been told. */
    var W = opts.watching;
    if(W && typeof W.ripples === 'function'){
      var rip = [];
      try { rip = W.ripples(fid) || []; } catch(_e){ rip = []; }
      for(var wi=0; wi<rip.length; wi++){
        var wf = norm(rip[wi].to);
        if(!wf || wf === want) continue;
        /* A NEUTRAL ARRANGEMENT IS NOT SURVEILLANCE, and the shipped sentence
           is what settled it. The Cartel hold `hands-off` on the Volunteers,
           init 0, and the first run of this made the Volunteers hear about
           every Cartel commitment and charge a flat price for it -- while the
           words printed underneath that very row read "Nobody is going to hold
           this against you. There is no side to be on here."
           A surface that contradicts itself in two adjacent lines is worse
           than one that says nothing. Hostile and warm are POSITIONS, and a
           position is a reason to be looking. Neutral is the absence of one. */
        if(rip[wi].sign !== 'hostile' && rip[wi].sign !== 'warm') continue;
        var had = heard[wf];
        if(had && had.hops <= 1) continue;          /* a real tie is richer */
        heard[wf] = { faction:wf, hops:0, via:'watch', crossed:false,
                      through:(had ? had.through : null),
                      watching:rip[wi],
                      /* kept so a surface can say the rumour ALSO exists */
                      alsoHeardAt:(had ? had.hops : null) };
      }
    }

    var out = Object.keys(heard).map(function(k){ return heard[k]; });
    out.sort(function(a,b){ return a.hops-b.hops || (a.faction<b.faction?-1:1); });
    return out;
  }

  /* HOW IT LANDS with one outfit that heard.
     DISTANCE decides it, because distance is the thing that varies -- see the
     note on LANDING above for why the cross-cutting half is a theorem here
     rather than a dial. One hop and somebody who was close to it tells them.
     Further and it arrives down a chain, as a rumour. */
  function landing(h){
    if(!h) return { key:'silent', word:LANDING.silent.word, note:LANDING.silent.note };
    var k = (h.hops <= 1) ? 'direct' : 'secondhand';
    return { key:k, word:LANDING[k].word, note:LANDING[k].note,
             hops:h.hops, faction:h.faction, via:h.via, through:h.through,
             /* true for every bridge across a faction line, always, by the
                construction of the foci. Reported so a surface can say WHICH
                shared setting leaked it -- that your own housemate runs with
                them is the interesting half. */
             crossed:h.crossed };
  }

  /* ---- TERTIUS -----------------------------------------------------------
     THE BROKER'S POSITION, and its sign. You have real standing with two
     outfits. Burt/Simmel: if they are DISCONNECTED you span a structural hole
     and that is an advantage -- you are the only route between them. The 2024
     tertius dolens finding is the correction that makes it a game: if they are
     CONNECTED, the identical position costs you, because both sides can see
     the other half of what you are doing.

     `heard` is the whoHears output for the outfit you just committed to, so
     "connected" here is a measured fact about this valley's graph, not an
     opinion about whether two outfits like each other. NOTHING IN THIS FILE
     DECIDES THAT ANY TWO OUTFITS ARE ENEMIES. */
  function tertius(standings, heard){
    var others = Object.keys(standings||{}).filter(function(k){
      return (standings[k]|0) > 0; });
    if(others.length < 2) return null;
    var reached = {};
    (heard||[]).forEach(function(h){ reached[norm(h.faction)] = h; });
    var exposed = others.filter(function(k){ return !!reached[norm(k)]; });
    if(!exposed.length)
      return { key:'gaudens', word:'YOU ARE THE ONLY ROUTE BETWEEN THEM',
               note:'The outfits you stand with have no line to each other. '
                  + 'Nobody on either side can see the other half of what you '
                  + 'are doing, and that is worth more than either standing.',
               others:others, exposed:[] };
    return { key:'dolens', word:'BOTH SIDES CAN SEE YOU',
             note:'The outfits you stand with are connected, so the position '
                + 'that would have made you the only route between them makes '
                + 'you the person both of them are watching instead.',
             others:others, exposed:exposed };
  }

  function norm(f){ return String(f||'').toUpperCase().replace(/[\s_]/g,''); }

  /* ---- THE SAVE ----------------------------------------------------------
     ONE WRITER, same law as bohemia_belonging.record -- the three-spellings
     problem has bitten this codebase four times and it is solved in one place
     per fact, never in each caller. */
  function stateOf(save, fid){
    var s = save && save.meta && save.meta.commit;
    if(!s || !fid) return firstState();
    var want = norm(fid);
    for(var k in s) if(norm(k)===want) return s[k];
    return firstState();
  }
  function setState(save, fid, state){
    if(!save || !save.meta || !fid) return firstState();
    var s = save.meta.commit || (save.meta.commit={});
    var want = norm(fid), hit = null;
    for(var k in s) if(norm(k)===want) hit = k;
    s[hit||fid] = state;
    return state;
  }

  /* EVERY UNRULED NUMBER IN THIS MODULE, enumerable, so the tuning pass that
     EVERYTHING COSTS ONE section 5 asks for can generate its list instead of
     remembering it. The ceilings are NOT in here on purpose: they are derived
     from a shipped gated table, so they are not waiting on a ruling. */
  /* ---- WHAT IT COSTS YOU SOMEWHERE ELSE ----------------------------------
     THE STAGE HAS SAID THIS SINCE 8/15 AND NOTHING EVER DID IT. `burned` reads
     "You cost yourself somewhere else to be here. This is the one that cannot
     be walked back", and grep says BohemiaBelonging.adjust was only ever called
     on the outfit you are standing in front of. Word already travelled -- other
     outfits heard, AS FACT at one hop and AS A RUMOUR beyond -- and then nothing
     happened to them. The favour that was never collected, one system over.

     COSER, LIPSET & ROKKAN: a tie to one side is a LIABILITY with the other,
     and that liability is the entire mechanism by which cross-cutting ties damp
     conflict -- everybody ends up partially compromised. So this needs NO
     rivalry table and invents none of his canon: taking a side is exclusive by
     construction, and what it costs you is with whoever finds out.

     THREE THINGS FALL OUT OF SHIPPED TEXT RATHER THAN OUT OF MY PREFERENCE:

     1. A RUMOUR CANNOT COST YOU. LANDING.secondhand says it itself: "They will
        hear that you did something. THEY WILL NOT HEAR EXACTLY WHAT." You
        cannot lose standing over a thing nobody can pin on you. Only `direct`
        -- somebody who shares a roof or a job with one of theirs was close
        enough to know -- costs.
     2. YOU CANNOT FALL BELOW A STRANGER. An outfit that never counted you has
        nothing to take away; belonging does not go negative and commitment_gate
        part F is the proof of why that matters.
     3. THE AMOUNT IS THE STAGE INDEX, exactly like neglect: nothing said out
        loud costs nothing, taking a side costs one, burning a bridge costs two.
        Derived from position, never typed -- add a stage and it follows.

     AND THIS IS WHAT MAKES TERTIUS A DECISION INSTEAD OF A CAPTION. Standing
     where the outfits have no line to each other (gaudens) means nobody hears
     as fact, so it costs you NOTHING. Burt's structural hole finally pays out
     in the numbers rather than in a row of text.

     *** AND THE FOURTH THING, WHICH WAS MISSING UNTIL 8/26 AND IS THE WHOLE
         REASON THIS FUNCTION GREW A FOURTH ARGUMENT. ***
     Every hearer was charged THE SAME. `var lose = stateIndex(state)` is one
     number for everybody, so the Remnants -- who are at PERMANENT WAR with the
     Cartel in canon, written down in BOHEMIA_faction_graph.json, priced in
     FactionCanon.REL_SPEC at -80 -- took exactly what the Church took, and the
     Church have no canon position on the Cartel at all. The game held a war
     and this function could not feel it.

     PAOLO 8/26: "...But, yeah, for the other factions." The other outfits'
     positions on EACH OTHER are the missing term. engine/bohemia_between.js
     holds them (canon only, nothing invented) and `opts.between` passes it in.

     IT IS AN OPTION, NOT A DEPENDENCY, and that is deliberate rather than
     lazy: whoHears still decides WHETHER it lands, this only decides HOW HARD.
     A caller with no between module gets exactly the old numbers, so no
     surface silently changes underneath a lane that has not been told. A
     caller that passes one gets a war that costs like a war.

     A ZERO IS A ROW, NOT A GAP. Adjacency can take the cost to nothing, and
     "they heard and they did not mind" is a real outcome the player should
     see -- it is what standing beside somebody's ally BUYS you. Dropping the
     row would hide the payoff and make the module look like it did nothing.
     ---------------------------------------------------------------------- */
  function costs(state, heard, standings, opts){
    var lose = stateIndex(state);
    if(lose <= 0) return [];
    var B = opts && opts.between, sided = opts && opts.sided;
    var out = [];
    (heard||[]).forEach(function(h){
      if(landing(h).key !== 'direct') return;   /* a rumour names nothing */
      var want = norm(h.faction), have = 0;
      for(var k in (standings||{})) if(norm(k)===want) have = standings[k]|0;
      if(have <= 0) return;                     /* nothing to take */
      var base = lose, rel = null, moved = 0;
      if(B && sided && typeof B.weigh === 'function'){
        var w = B.weigh(sided, h.faction, lose);
        base = w.weighted; rel = w.why; moved = w.moved;
      }
      var take = Math.min(base, have);          /* never below a stranger */
      /* THE WORD DESCRIBES WHAT ACTUALLY HAPPENED, NOT WHAT THE RELATION
         WANTED. Two ways the raw `moved` lies if you print it:
           - a 2 -> 3 move is not "double", it is more, and saying double when
             the number says 3 is the surface disagreeing with itself;
           - the never-below-a-stranger clamp can eat the whole increase. Have
             2 standing, permanent war doubles a cost of 2 to 4, and they still
             only take 2 -- so the war cost you NOTHING EXTRA in the end and a
             row crowing about it would be a lie about the number beside it.
         So the comparison is against what a FLAT cost would have taken from
         this same person, after the same clamp. */
      var flatTake = Math.min(lose, have);
      var real = take - flatTake;
      out.push({ faction:h.faction, had:have, lose:take,
                 flat:lose, flatLose:flatTake, moved:moved, realMoved:real,
                 rel:rel,
                 through:h.through, via:h.via, hops:h.hops,
                 word: take === 0 ? 'THEY HEARD, AND THEY DID NOT MIND'
                     : real > 0   ? 'THEY HEARD, AND IT COST YOU EXTRA'
                     : real < 0   ? 'THEY HEARD, AND THEY LET IT GO CHEAP'
                     : 'THEY HEARD, AND IT COST YOU',
                 note: rel
                     ? (rel.cost || rel.note)
                     : 'Somebody close enough to know told them what you did. '
                     + 'You are somebody else\'s now, and they have adjusted '
                     + 'what you are worth to them accordingly.' });
    });
    return out;
  }

  function placeholders(){
    return STAGES.filter(function(s){ return s.neglectPlaceholder; })
      .map(function(s){
        return { where:'bohemia_commitment.STAGES.' + s.state + '.neglect',
                 value:s.neglect, placeholder:true,
                 law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
                 what:'what neglecting this outfit costs per day at this state' };
      })
      /* the OTHER price, and it is a different fact from neglect even though
         both derive from the stage index -- one is the upkeep of a commitment,
         one is what somebody else charges you for having made it. A shared
         derivation is not a shared mechanism (8/18, the RUNGS finding). */
      .concat(STAGES.map(function(s, i){
        return { where:'bohemia_commitment.costs(' + s.state + ')',
                 value:i, placeholder:true,
                 law:'EVERYTHING COSTS ONE (Paolo 8/15/26)',
                 what:'what an outfit that HEARS about this commitment takes '
                    + 'off your standing with them' };
      }).filter(function(x){ return x.value > 0; }));
  }

  var API = { STAGES:STAGES, LANDING:LANDING,
              stageOf:stageOf, firstState:firstState, states:function(){
                return STAGES.map(function(s){ return s.state; }); },
              wallOf:wallOf, give:give, commit:commit, neglectFor:neglectFor,
              whoHears:whoHears, landing:landing, tertius:tertius, costs:costs,
              stateOf:stateOf, setState:setState,
              placeholders:placeholders };
  if(HASREQ) module.exports=API; else root.BohemiaCommitment=API;
})(typeof globalThis!=='undefined'?globalThis:this);
'''


if __name__ == '__main__':
    main()

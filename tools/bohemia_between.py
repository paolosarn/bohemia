#!/usr/bin/env python3
"""
BOHEMIA BETWEEN GENERATOR -- WHAT THE OUTFITS ARE TO EACH OTHER, AND WHY IT
COSTS YOU DIFFERENTLY DEPENDING ON WHO IS LISTENING.  (8/26/26, FACTIONS lane)

Writes engine/bohemia_between.js. EDIT THIS FILE, NEVER THE OUTPUT.

--------------------------------------------------------------------------
THE RULING THIS IS BUILT FROM (Paolo 8/26, verbatim)
--------------------------------------------------------------------------
  "custom is your own personal faction!!!!!! and you can imagine if you play
   the game with your custom faction the values arent just for you its for how
   your factions treated bro but u prob Already have that. But, yeah, for the
   other factions."

TWO HALVES AND THEY ARE DIFFERENT JOBS.
  HALF ONE -- YOURS.   The standing is not a number about a person, it is a
    number about an OUTFIT. Custom is his, canon calls it "Player faction", and
    what an outfit thinks is about the thing you run with, not about you alone.
  HALF TWO -- THEIRS.  "for the other factions." The other outfits have
    positions on each other that have nothing to do with the player, and those
    positions are the reason the same act costs different amounts to different
    ears. That is this module.

--------------------------------------------------------------------------
REUSE CHECK -- AND THE ONE THAT NEARLY REPEATED THE 8/15 MISTAKE
--------------------------------------------------------------------------
This cooks no graphic pixels, so banks/ is not the shelf. The equivalent duty
for a mechanism is: DO NOT BUILD A SECOND ONE. What that check turned up:

  * engine/bohemia_standing.js ALREADY EXISTS (PEOPLE lane, 8/2, gated 35/35).
    I was going to call this bohemia_standing.js. tools/bohemia_commitment.py
    carries a post-mortem of the exact same near-miss on 8/15, where that name
    was taken and the existing module was overwritten and restored from git the
    same turn. I read that post-mortem BEFORE writing a line, which is the only
    reason this file is called bohemia_between.js. The boundary, so nobody
    builds a fourth:
        bohemia_standing.js    WHAT PEOPLE THINK OF YOU. Individual minds,
                               decaying, retold at a penalty per hop.
        bohemia_belonging.js   HOW FAR IN YOU ARE with one outfit. The rungs.
        bohemia_commitment.js  THE WALL, and WHO IS POSITIONED TO HEAR.
        bohemia_between.js     (this) WHAT TWO OUTFITS ARE TO EACH OTHER.
                               Not about you at all. It is the world's own
                               shape, and everything above bends around it.

  * engine/BOHEMIA_faction_graph.json IS THE CONTENT AND IT IS ALREADY CANON.
    Its own _meta says: "relations are directional labels the engine reads for
    spillover, war state, and AI. All canon; nothing invented." Six labels
    exist across nine directed edges. NOT ONE OF THEM IS TYPED HERE. This file
    reads that JSON and bakes what it finds. If Paolo adds an enemy tomorrow,
    he adds it there and reruns this, and no mechanism changes.

  * engine/bohemia_engine.js FactionCanon.REL_SPEC IS THE NUMBERS AND THEY ARE
    ALREADY WRITTEN. Somebody encoded every one of those six labels into an
    init standing and a constraint clamp, with a research note explaining why
    invariants are clamps and not starting values. It has exactly one caller
    (bohemia_loop.js at boot) and the loop NEVER REACHES GLOBAL SCOPE IN THE
    CITY -- the city's own CT_BASES comment says so in as many words, and
    `grep -c BohemiaEngine slices/BOHEMIA_CITY_WORLD.html` is 0. So the numbers
    exist, they are good, and the surface Paolo walks has never seen them.
    THIS FILE DOES NOT RETYPE THEM. It PARSES REL_SPEC OUT OF bohemia_engine.js
    at build time and bakes what it finds, so the two can never drift. A second
    hand-typed copy of that table is the two-systems-disagreeing bug this lane
    has now fixed six times, and it would have been so easy here.

--------------------------------------------------------------------------
THE HOLE THIS FILLS, MEASURED BEFORE IT WAS WRITTEN
--------------------------------------------------------------------------
bohemia_commitment.costs() charges every outfit that hears about your
commitment EXACTLY THE SAME:

    var lose = stateIndex(state);          // one number, for everybody

The Remnants and the Cartel are in PERMANENT WAR in canon. The Church has no
canon position on the Cartel at all. Side with the Cartel where both can hear,
and today they charge you the identical amount. That is the whole finding: the
game holds a canon war and the cost engine cannot feel it.

--------------------------------------------------------------------------
THE MECHANISM (mine), AND WHERE ITS NUMBERS COME FROM (not mine)
--------------------------------------------------------------------------
MECHANISM-MINE / CONTENTS-PAOLO'S. Nothing below names a rival, decides two
outfits are enemies, or invents a label. It only says what an ALREADY CANON
position does to an ALREADY EXISTING cost.

  THE SIGN comes from REL_SPEC's own init value. init < 0 is a hostile
  position, init > 0 is a warm one, init == 0 is neither. That is a reading of
  the existing table, not a second table.

  THE WEIGHT is init/100 -- the canon standing on its own -100..100 scale --
  applied to the cost that whoHears already established:

      weighted = clamp0( base + round(base * (-init / 100)) )

  Permanent war (init -80) roughly doubles it. Adjacency (init +35) shaves it.
  Nothing is multiplied by a number I chose; the only choice is the SHAPE, and
  the shape is "the canon standing, as a proportion."

  THE FLOOR IS ZERO AND ZERO IS NOT A REWARD. A warm position can take the
  cost to nothing -- "they heard and they did not mind" is a real outcome, and
  it is visible. It never goes NEGATIVE, because paying you for helping your
  friends' friends is a REWARD CHANNEL, and inventing one of those is a much
  bigger step than bending a cost that already exists. If Paolo wants that, it
  is his ruling, not a side effect of mine.

  WORD MUST STILL TRAVEL. This does not bypass whoHears. An outfit at war with
  the people you just sided with still has to FIND OUT -- the war changes how
  hard it lands, never whether it lands. Two organs, composed, each still doing
  its own job.

--------------------------------------------------------------------------
YOUR OWN OUTFIT, AND WHY IT IS EMPTY ON PURPOSE
--------------------------------------------------------------------------
mine() reads the graph for the faction whose note says it is the player's, and
finds Custom -- "Player faction. No preset philosophy. Identity emerges from
three generations of action." Its relations are {} AND THAT IS CORRECT: an
emergent faction has not made enemies yet. The mechanism is live and empty. The
day Paolo writes one line into that JSON, his outfit has a war and every
surface below already knows what to do with it. That is MECHANISM-MINE /
CONTENTS-PAOLO'S working exactly as intended, not a gap.
"""

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GRAPH = os.path.join(ROOT, 'engine', 'BOHEMIA_faction_graph.json')
ENGINE = os.path.join(ROOT, 'engine', 'bohemia_engine.js')
OUT = os.path.join(ROOT, 'engine', 'bohemia_between.js')


def read_rel_spec():
    """PARSE REL_SPEC OUT OF bohemia_engine.js. Never retype it.

    The block is a const object literal with `// comment` lines between the
    entries, so this walks it line by line and pulls the four fields it needs.
    If the block is not found this RAISES rather than falling back to a typed
    copy: a silent substitute is precisely how two tables start disagreeing,
    and the loud failure is the honest one.
    """
    src = open(ENGINE, encoding='utf-8').read()
    m = re.search(r'const REL_SPEC = \{(.*?)\n\};', src, re.S)
    if not m:
        raise SystemExit(
            'REL_SPEC not found in engine/bohemia_engine.js. It is the SOURCE '
            'of every number in bohemia_between.js and this generator refuses '
            'to substitute a typed copy for it.')
    spec = {}
    for line in m.group(1).split('\n'):
        row = re.match(r"\s*'([^']+)':\s*\{(.*?)\}", line)
        if not row:
            continue
        label, body = row.group(1), row.group(2)
        entry = {}
        for k in ('init', 'max', 'min'):
            hit = re.search(r'\b' + k + r':\s*(-?\d+)', body)
            if hit:
                entry[k] = int(hit.group(1))
        locked = re.search(r"locked:\s*'([^']+)'", body)
        if locked:
            entry['locked'] = locked.group(1)
        protects = re.search(r"protects:\s*'([^']+)'", body)
        if protects:
            entry['protects'] = protects.group(1)
        if 'init' not in entry:
            raise SystemExit('REL_SPEC entry %r has no init; cannot derive a '
                             'sign or a weight from it.' % label)
        spec[label] = entry
    if not spec:
        raise SystemExit('REL_SPEC parsed to nothing.')
    return spec


# THE PLAIN ENGLISH FOR EACH CANON LABEL. These are WORDS, not decisions
# (ALWAYS MAKE AN ATTEMPT, Paolo 8/11: every player-facing string ships with a
# real attempt tagged draft so he can find and edit it). They describe a
# position the canon already took; they do not create one. A label with no
# entry here still WORKS -- it falls back to the label itself -- because a
# missing sentence must never silently drop a canon war.
WORDS = {
    'permanent-war': {
        'word': 'AT WAR, AND IT DOES NOT END',
        'they': 'They are at war with them. Not a feud, not a bad season. It '
                'has been going long enough that nobody alive is trying to '
                'finish it, only to survive it.',
        'you': 'You just picked the people they bury. Whatever you were worth '
               'to them, halve it and then some.',
        'draft': True,
    },
    'prey-tax': {
        'word': 'THEY TAX THEM',
        'they': 'They take a cut off them and call it protection. It is not '
                'war because war would be expensive, and this pays.',
        'you': 'You helped their livestock. They do not hate you for it. They '
               'do lower what you are worth.',
        'draft': True,
    },
    'preyed-taxed': {
        'word': 'THEY GET TAXED BY THEM',
        'they': 'They pay, every time, and there is nothing at the far end of '
                'refusing that they have ever come back from.',
        'you': 'You helped the people who bleed them. They will not forget '
               'which side of that you stood on.',
        'draft': True,
    },
    'adjacent': {
        'word': 'THEY RUN CLOSE',
        'they': 'Different names, near enough the same argument. They do not '
                'love each other. They are not going to move against each '
                'other either.',
        'you': 'You helped somebody they already work beside. It costs you '
               'less with them, and it may cost you nothing at all.',
        'draft': True,
    },
    'professional-respect': {
        'word': 'THEY RESPECT THEM',
        'they': 'Two outfits that know exactly what the other one is, and '
                'have both decided that is worth more standing than fighting.',
        'you': 'They understand why you did it. That is not approval. It is '
               'the reason they are not charging you full price.',
        'draft': True,
    },
    'hands-off': {
        'word': 'THEY LEAVE THEM ALONE',
        'they': 'Everybody has agreed, without ever agreeing, not to touch '
                'them. It is the one line the valley keeps.',
        'you': 'Nobody is going to hold this against you. There is no side to '
               'be on here.',
        'draft': True,
    },
}


def main():
    graph = json.load(open(GRAPH, encoding='utf-8'))
    spec = read_rel_spec()
    defs = graph['factions']

    # THE PAIRS, BAKED FROM CANON. Directional, exactly as the graph writes
    # them. A pair whose label REL_SPEC does not know is a REAL PROBLEM and it
    # is carried through as unknown rather than dropped -- a canon relation the
    # numbers cannot price should be visible, not invisible.
    pairs = []
    unpriced = []
    for fid, d in sorted(defs.items()):
        for other, label in sorted((d.get('relations') or {}).items()):
            row = {'from': fid, 'to': other, 'label': label}
            if label in spec:
                row['init'] = spec[label]['init']
            else:
                unpriced.append('%s -> %s (%s)' % (fid, other, label))
            pairs.append(row)

    # WHO IS THE PLAYER'S. Read from the graph's own note, never typed. If the
    # note ever moves, this moves with it; if it vanishes, mine() returns null
    # and every caller has to cope with that honestly.
    mine = None
    for fid, d in sorted(defs.items()):
        if 'player faction' in str(d.get('note', '')).lower():
            mine = fid
            break

    # POWER, per act, straight off the graph. Used for nothing but display:
    # who is bigger than who is a fact he can read, and it is already written.
    power = {fid: {'act1': d.get('act1_power'), 'act3': d.get('act3_power')}
             for fid, d in sorted(defs.items())
             if d.get('act1_power') is not None}

    align = {fid: d.get('align') for fid, d in sorted(defs.items())
             if d.get('align')}

    js = TEMPLATE % {
        'pairs': json.dumps(pairs, indent=2),
        'spec': json.dumps(spec, indent=2, sort_keys=True),
        'words': json.dumps(WORDS, indent=2, sort_keys=True),
        'mine': json.dumps(mine),
        'power': json.dumps(power, indent=2, sort_keys=True),
        'align': json.dumps(align, indent=2, sort_keys=True),
        'nlabels': len(spec),
        'npairs': len(pairs),
    }
    open(OUT, 'w', encoding='utf-8').write(js)
    print('wrote %s' % OUT)
    print('  %d canon directed pairs, %d priced labels, player outfit = %s'
          % (len(pairs), len(spec), mine))
    if unpriced:
        print('  *** UNPRICED CANON RELATIONS (visible, not dropped):')
        for u in unpriced:
            print('      ' + u)


TEMPLATE = r'''// BOHEMIA BETWEEN -- WHAT THE OUTFITS ARE TO EACH OTHER.
//
// GENERATED by tools/bohemia_between.py. EDIT THE TOOL, NEVER THIS FILE.
//
// This module is not about the player. It is the shape of the valley: which
// outfits are at war, which tax which, which run close enough that helping one
// is nearly helping the other. Everything the player does gets bent by it.
//
// PAOLO 8/26: "custom is your own personal faction!!!!!! ... the values arent
// just for you its for how your factions treated ... But, yeah, for the other
// factions." The second half is this file. The other outfits have positions on
// each other that have nothing to do with you, and those positions are the
// reason the same act costs different amounts to different ears.
//
// NOTHING HERE IS INVENTED. Every pair below is copied out of
// engine/BOHEMIA_faction_graph.json, whose own _meta reads "relations are
// directional labels the engine reads for spillover, war state, and AI. All
// canon; nothing invented." Every number below is parsed out of
// engine/bohemia_engine.js FactionCanon.REL_SPEC at build time. Neither was
// typed by hand here, so neither can drift from its source.
//
// THE HOLE IT FILLS, MEASURED: bohemia_commitment.costs() charged every outfit
// that heard about your commitment the identical amount --
//     var lose = stateIndex(state);   // one number, for everybody
// -- so the Remnants, who are at PERMANENT WAR with the Cartel in canon, and
// the Church, who have no canon position on the Cartel at all, both took the
// same thing off you for siding with the Cartel. The game held a canon war and
// the cost engine could not feel it.
//
// IT DOES NOT BYPASS WORD TRAVELS. An outfit at war with the people you just
// sided with still has to FIND OUT. whoHears decides whether it lands; this
// decides how hard. Two organs, composed, each still doing its own job.
(function(root){
  var HASREQ=(typeof module!=='undefined'&&module.exports&&typeof require!=='undefined');

  /* THE CANON PAIRS. %(npairs)d directed edges, straight from the graph. */
  var PAIRS = %(pairs)s;

  /* THE NUMBERS, PARSED FROM FactionCanon.REL_SPEC. %(nlabels)d labels.
     `init` is the canon standing on the -100..100 scale that
     engine/bohemia_factions.js uses. Its SIGN is the position and its
     MAGNITUDE is the weight; both are readings of this table, never a second
     table. */
  var SPEC = %(spec)s;

  /* THE PLAIN ENGLISH. draft:true on every one -- ALWAYS MAKE AN ATTEMPT
     (Paolo 8/11): these ship written and playable and he edits them later in
     the WORDS tab. They describe a position canon already took. */
  var WORDS = %(words)s;

  /* YOUR OUTFIT. Read from the graph note "Player faction", never typed. */
  var MINE = %(mine)s;

  /* Ordinal power per act, and the alignment word. Display facts, already
     written in canon, never used to compute a cost. */
  var POWER = %(power)s;
  var ALIGN = %(align)s;

  function norm(f){ return String(f||'').toUpperCase().replace(/[\s_]/g,''); }

  /* ---- WHAT ARE THESE TWO TO EACH OTHER? ---------------------------------
     DIRECTIONAL, and it matters: the Cartel 'prey-tax' the Caravans and the
     Caravans are 'preyed-taxed' by the Cartel. Same relationship, two seats,
     and the graph writes both. Asking A about B gets A's seat.
     Returns null when canon says nothing, and NULL IS A REAL ANSWER -- most
     pairs in this valley have no written position and pretending otherwise
     would be inventing canon. */
  function between(a, b){
    var A=norm(a), B=norm(b);
    if(!A || !B || A===B) return null;
    for(var i=0;i<PAIRS.length;i++){
      var p=PAIRS[i];
      if(norm(p.from)===A && norm(p.to)===B) return decorate(p);
    }
    return null;
  }

  /* The same question asked from either seat: is there ANY canon position
     between these two, whichever way it was written down. Used when the
     question is "do these two have history", not "what does A think". */
  function either(a, b){ return between(a,b) || between(b,a); }

  function decorate(p){
    var s = SPEC[p.label] || null;
    var w = WORDS[p.label] || null;
    var init = (s && s.init != null) ? s.init : null;
    return {
      from: p.from, to: p.to, label: p.label,
      init: init,
      /* THE SIGN IS A READING OF init, not a third table. */
      sign: init == null ? 'unknown' : (init < 0 ? 'hostile'
                                      : init > 0 ? 'warm' : 'neutral'),
      war: !!(s && s.locked === 'war'),
      protected: !!(s && s.protects),
      word: w ? w.word : String(p.label).toUpperCase().replace(/-/g,' '),
      note: w ? w.they : null,
      cost: w ? w.you : null,
      draft: w ? !!w.draft : false
    };
  }

  /* EVERY canon position this outfit holds, both seats, for a board he can
     read. Sorted hostile-first because that is the half that gets you killed.

     ONE ROW PER OTHER OUTFIT, and the dedupe is not cosmetic. The graph writes
     BOTH SEATS of the pairs somebody bothered to write twice -- Cartel says
     'prey-tax' about the Caravans and the Caravans say 'preyed-taxed' about
     the Cartel -- so a naive walk lists the Remnants twice on the Cartel's
     board and reads as two separate wars. The outfit's OWN seat wins, because
     a board about them should say what THEY hold, not what is held about them;
     a mirrored row only survives when canon never wrote their side. */
  function ripples(fid){
    var A=norm(fid), out=[], byOther={};
    if(!A) return out;
    for(var i=0;i<PAIRS.length;i++){
      var p=PAIRS[i], row=null;
      if(norm(p.from)===A) row = decorate(p);
      else if(norm(p.to)===A) row = flip(decorate(p));
      if(!row) continue;
      var k = norm(row.to), had = byOther[k];
      if(had && !had.mirrored) continue;      /* their own seat already stands */
      if(had && row.mirrored) continue;       /* neither seat is theirs; keep one */
      if(had){ out.splice(out.indexOf(had), 1); }
      byOther[k] = row;
      out.push(row);
    }
    var rank={hostile:0, unknown:1, neutral:2, warm:3};
    out.sort(function(x,y){
      var d=(rank[x.sign]||1)-(rank[y.sign]||1);
      return d !== 0 ? d : String(x.to).localeCompare(String(y.to));
    });
    return out;
  }

  /* The other seat of an edge written from the far side. The LABEL is not
     mirrored -- 'prey-tax' seen from the prey is still 'prey-tax', that is
     what is being done TO them -- but the from/to swap so the row reads about
     the outfit you asked about. */
  function flip(d){
    return { from:d.to, to:d.from, label:d.label, init:d.init, sign:d.sign,
             war:d.war, protected:d.protected, word:d.word, note:d.note,
             cost:d.cost, draft:d.draft, mirrored:true };
  }

  /* ---- WHAT THIS DOES TO A COST ALREADY ESTABLISHED -----------------------
     `base` is what bohemia_commitment.costs() already decided this hearer
     takes off you. `sided` is the outfit you sided WITH; `hearer` is the
     outfit that found out. The canon position the hearer holds on the sided
     outfit bends the number:

         weighted = max(0, base + round(base * (-init / 100)))

     -80 (permanent war) roughly doubles it. +35 (adjacent) shaves it. The
     only thing chosen here is the SHAPE -- "the canon standing, as a
     proportion" -- and every magnitude comes off REL_SPEC.

     THE FLOOR IS ZERO AND ZERO IS NOT A REWARD. A warm position can take the
     cost to nothing, and "they heard and they did not mind" is a real, visible
     outcome. It never goes negative: paying somebody for helping their
     friends' friends is a REWARD CHANNEL, and inventing one of those is
     Paolo's ruling to make, not a side effect of mine.

     *** AND A CANON POSITION ALWAYS BITES AT LEAST ONE. *** The proportion
     alone has a dead zone and it was found by running it rather than reasoning
     about it: the Cartel TAX the Caravans in canon (init -45), and at base 1
     that is round(0.45) = 0, so the most common case in the game charged
     nothing at all for a hostile position the lore spent a line writing down.
     A relation the engine holds and the player never feels is this lane's
     oldest bug wearing a new coat. So the sign is an INVARIANT, not a hint:
     hostile always takes more than base, warm always takes less (down to
     zero), neutral moves nothing. That is FactionCanon's own lesson --
     "a starting value decays; an invariant holds" -- applied to the cost side.

     Returns the full working, not just a number, so the surface can say WHY
     and so a gate can check the arithmetic instead of trusting it. */
  function weigh(sided, hearer, base){
    var b = base|0;
    var rel = between(hearer, sided);
    var out = { base:b, weighted:b, rel:rel, moved:0, why:null };
    if(!rel || rel.init == null || b <= 0) return out;
    var w = b + Math.round(b * (-rel.init / 100));
    if(rel.init < 0 && w <= b) w = b + 1;    /* hostile always costs more */
    if(rel.init > 0 && w >= b) w = b - 1;    /* warm always costs less */
    if(w < 0) w = 0;
    out.weighted = w;
    out.moved = w - b;
    out.why = rel;
    return out;
  }

  /* ---- YOUR OUTFIT --------------------------------------------------------
     PAOLO 8/26: "custom is your own personal faction!!!!!!" -- and canon says
     so too: the graph's note on Custom reads "Player faction. No preset
     philosophy. Identity emerges from three generations of action."

     Its relations are {} AND THAT IS CORRECT, NOT A GAP. An emergent faction
     has not made its enemies yet. The mechanism is live and empty. The day one
     line goes into that JSON, your outfit has a war and every surface below
     already knows what to do with it. */
  function mine(){ return MINE; }
  function isMine(fid){ return !!MINE && norm(fid) === norm(MINE); }
  function myRipples(){ return MINE ? ripples(MINE) : []; }

  /* Power is an ORDINAL RANK per act (1 = weakest), straight off the graph.
     Returned raw with the act asked for; nothing here converts it to a
     strength, because canon says rank and rank is what it says. */
  function powerOf(fid, act){
    var A=norm(fid);
    for(var k in POWER) if(norm(k)===A)
      return (act>=3 ? POWER[k].act3 : POWER[k].act1);
    return null;
  }
  function alignOf(fid){
    var A=norm(fid);
    for(var k in ALIGN) if(norm(k)===A) return ALIGN[k];
    return null;
  }

  /* Every outfit canon has anything to say about, for a gate to sweep. */
  function keys(){
    var seen={}, out=[];
    for(var k in POWER){ if(!seen[k]){ seen[k]=1; out.push(k); } }
    for(var i=0;i<PAIRS.length;i++){
      if(!seen[PAIRS[i].from]){ seen[PAIRS[i].from]=1; out.push(PAIRS[i].from); }
      if(!seen[PAIRS[i].to]){ seen[PAIRS[i].to]=1; out.push(PAIRS[i].to); }
    }
    return out.sort();
  }

  var API = { PAIRS:PAIRS, SPEC:SPEC, WORDS:WORDS, POWER:POWER, ALIGN:ALIGN,
              between:between, either:either, ripples:ripples, weigh:weigh,
              mine:mine, isMine:isMine, myRipples:myRipples,
              powerOf:powerOf, alignOf:alignOf, keys:keys };
  if(HASREQ) module.exports=API; else root.BohemiaBetween=API;
})(typeof globalThis!=='undefined'?globalThis:this);
'''


if __name__ == '__main__':
    main()

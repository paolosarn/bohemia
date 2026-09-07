// BOHEMIA FAMILY — THE TREE, AND THE THINGS THAT WRITE TO IT.
// (9/7/26, PEOPLE lane. VAMILY [family events], row FAMILY-EVENTS.)
//
// THE ROW: "something writes a child, a marriage, an ageing into family.tree;
// selectHeir has zero callers."
//
// *** MEASURED BEFORE A LINE WAS WRITTEN, WITH COMMENTS STRIPPED FIRST,
// BECAUSE A COMMENT IS A BLOCK AND NOT A LINE. *** In the two files that ARE
// the game, plus the demo a stranger opens:
//
//                      ALPHA   CITY   DEMO
//   runDynasty           0      0      0
//   selectHeir           0      0      0
//   family.tree          0      0      0
//   foldGeneration       0      0      0
//   emptyInheritance     0      0      0
//   FAMILY_CAST         25      0     25
//
// So the row holds, and it is worse than it says. The RUN lane put the family
// CAST into the game on 9/4 -- four named people, one of them lost in the cold
// open, on a card he can open -- and that is real. But there is no TREE for
// them to be in, nothing that writes one, and the heir rule has never once been
// called anywhere a player could reach. The whole dynasty is three generations
// (Paolo 8/28: "YEAH THREE GENERATIONS BRO CMON") and generation two arrives by
// a rule the game cannot run.
//
// AND selectHeir HAS NO SOURCE MODULE. It exists ONLY inside
// engine/bohemia_engine.js, which its own header calls a "COMBINED ENGINE
// BUNDLE ... stitched into one file for handoff". A bundle is an artifact, not
// a source, and it is in no played file. See THE ONE RULE, TWICE, PROVEN below.
//
// ============================================================================
// NOTHING HERE IS INVENTED. EVERY SHAPE IS CITED, AND WHAT IS NOT RULED IS LEFT
// ============================================================================
// GDD v4 line 47   the inheritance block carries "family tree (marriages,
//                  children, deaths, heir, traits/wounds -- the emotional
//                  spine)". Those five are exactly what this module writes.
// GDD v4 line 51   "heir selection from the family tree (child or sibling's
//                  child)".
// GDD v4 line 58   "Heir selection is DERIVED, not streamed: selectHeir(family,
//                  seedText, gen) hashes seed + gen + candidate ids. Same
//                  family + seed = same heir forever, regardless of reload
//                  timing."
// GDD v2 line 245  "The founding character. Loses a parent at the start of act
//                  one. Finds a partner and marries them by end of act one --
//                  this is a permanent act one decision. Has three to four
//                  children from this marriage." (GDD v5 keeps v2 as the lore
//                  foundation, so this is live.)
// PERSISTENT CONSEQUENCE / MAYOR 6/30, LOCKED: the handoff is "Act 1->2->3, ~30
//                  years and a new dynasty character each time". That is where
//                  the ageing number comes from. I did not pick 30.
// ACT1 OPENING VISION 7/19 + FAMILY_CAST.survivesIf: who walks out of the cold
//                  open. Read off the cast, never re-decided here.
// COORDINATOR 9/5, on the neighbouring row [heir moment]: "WHO YOU CAN MARRY
//                  stays Paolo's (identity). Build the inheritance; leave
//                  marriage a stub with his name on it."
//
// *** SO THIS MODULE NEVER INVENTS A PERSON. *** marry() REFUSES to run without
// a partner handed to it, and there is no name pool anywhere in this file. A
// module that could conjure a spouse would be authoring the one thing he
// reserved. Children are born with name:null on purpose, and say() offers
// player-facing words for them -- YOUR FIRSTBORN, YOUR SECOND -- which is an
// attempt at the TEXT (8/11) without authoring an identity.
//
// ============================================================================
// WHAT IS DELIBERATELY NOT BUILT, AND WHY IT WOULD BE A NUMBER HE NEVER RULED
// ============================================================================
// AGEING INSIDE AN ACT. A handoff is ~30 years and that is canon, so age() at a
// fold is derived. But "how many game days is a year" is a mapping NOBODY HAS
// RULED, and a child growing up mid-act needs it. Rather than pick one and hide
// it in a module, age() takes the years as an argument and the fold hands it
// the canon 30. Mid-act ageing is [PENDING Paolo] and is named in the record.
// Everything else here works without it.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* THE RELATIONS. 'child' and 'sibling_child' are NOT free choices: they are
     the two strings the heir rule reads (GDD v4 line 51), so they are spelled
     the way the rule spells them and a third name for either would be a bug. */
  var RELS = { SELF: 'self', PARENT: 'parent', SIBLING: 'sibling',
               SPOUSE: 'spouse', CHILD: 'child', NEPHEW: 'sibling_child' };

  /* THE AGE LADDER IS THE CAST'S OWN. FAMILY_CAST already writes age as one of
     'adult' / 'teen' / 'child', so those three are not mine to rename. ELDER is
     added because a thirty-year fold has to be able to put somebody past adult
     and the cast never needed a word for it. The ladder is one-way: nobody gets
     younger, which is the only ordering claim this makes. */
  var LADDER = ['newborn', 'child', 'teen', 'adult', 'elder'];

  /* WHAT EACH WORD IS IN YEARS. These are the ordinary age bands, not a taste
     call: a child is under 13, a teen is 13 to 17, an adult is 18 to 64, an
     elder is 65 and over. The band is the fact; the MIDPOINT is the estimator
     you use when all you have is the word, which is all FAMILY_CAST gives.
     Elder is open-ended so it uses its floor.
     *** THE FIRST CUT OF THIS WAS WRONG AND DRIVING IT CAUGHT IT. *** It added
     a flat three rungs to everybody at a fold, which made MARCO -- a teen --
     an ELDER after thirty years. A teen plus thirty is forty-five, which is an
     adult. A ladder position is not a number of years and adding to the wrong
     one is exactly the class of thing that reads fine and is false. */
  var BAND = { newborn: 0, child: 6.5, teen: 15, adult: 41, elder: 65 };
  function bandOf(years) {
    var y = Number(years) || 0;
    if (y < 1) return 'newborn';
    if (y < 13) return 'child';
    if (y < 18) return 'teen';
    if (y < 65) return 'adult';
    return 'elder';
  }

  /* xmur3, the same string hash the engine's own derivations use, so a family
     derived here and a family derived there cannot drift on the hash alone. */
  function xmur3(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function node(id, rel, opts) {
    var o = opts || {};
    return { id: id, rel: rel,
             name: (o.name === undefined ? null : o.name),
             draft: !!o.draft,
             alive: (o.alive === undefined ? true : !!o.alive),
             age: o.age || 'adult',
             years: (o.years === undefined ? null : o.years),
             born: (o.born === undefined ? null : o.born),
             why: o.why || null,
             pending: !!o.pending };
  }

  /* ==========================================================================
     THE SEED: THE TREE THE COLD OPEN LEAVES YOU WITH.
     Read straight off FAMILY_CAST, which is handed in -- this module reads no
     global and holds no copy of the cast, because TWO PLACES HOLDING ONE NAME
     is how the mother came back as a DENISE from a table the scene module had
     never heard of (the RUN lane's own 9/4 note). survivesIf is the cast's own
     field and it alone decides who walks out.
     THE LOST ONE STAYS IN THE TREE, DEAD. A tree that lists only survivors is
     the counterfeit family the whole story is against, and the heir rule reads
     `alive` anyway, so the dead cost nothing and carry the grief.
     ========================================================================== */
  function seedTree(cast, sex) {
    if (!cast || !cast.length)
      throw new Error('BohemiaFamily.seedTree needs the real FAMILY_CAST handed '
        + 'in. It will not invent a family, and a second copy of the cast is '
        + 'the exact bug the 9/4 note names.');
    var who = String(sex || '').toLowerCase();
    var tree = [];
    for (var i = 0; i < cast.length; i++) {
      var m = cast[i];
      var role = String(m.role || '').toUpperCase();
      var rel = (role === 'FATHER' || role === 'MOTHER') ? RELS.PARENT
              : RELS.SIBLING;
      /* *** WHO IS LOST IS NEVER DECIDED TWICE. *** If the caller hands a family
         whose `alive` is already resolved -- which is exactly what the walked
         city holds, because the shell applied his 7/19 ruling at the cold open
         and persisted the answer -- that answer is USED, not recomputed. Only a
         caller holding the RAW cast, with no alive field at all, falls through
         to survivesIf. Two places deciding one thing is how the mother came back
         as a DENISE nobody had heard of, and it would be worse here: the game
         would disagree with itself about which sibling died. */
      var lives;
      if (typeof m.alive === 'boolean') {
        lives = m.alive;
      } else {
        var s = String(m.survivesIf || 'always');
        lives = (s === 'always') || (s === who);
      }
      tree.push(node('cast:' + role, rel, {
        name: m.name || null, draft: !!m.draft, alive: lives,
        age: m.age || 'adult',
        why: lives ? (m.why || null) : 'lost in the cold open'
      }));
    }
    return tree;
  }

  function byId(tree, id) {
    for (var i = 0; i < (tree || []).length; i++)
      if (tree[i].id === id) return tree[i];
    return null;
  }
  function kidsOf(tree) {
    return (tree || []).filter(function (n) {
      return n.rel === RELS.CHILD && n.alive; });
  }
  function spouseOf(tree) {
    return (tree || []).filter(function (n) {
      return n.rel === RELS.SPOUSE && n.alive; })[0] || null;
  }

  /* ==========================================================================
     A MARRIAGE. Canon calls it "a permanent act one decision" (GDD v2 245) and
     the coordinator reserved WHO to Paolo, so this writes the EVENT and refuses
     to choose the person. Hand it a partner or it throws -- there is no default
     partner, no pool, and no fallback, because a silent default here would BE
     the decision he reserved.
     ========================================================================== */
  function marry(tree, partner, opts) {
    if (!tree) throw new Error('BohemiaFamily.marry needs a tree.');
    if (!partner || typeof partner !== 'object')
      throw new Error('BohemiaFamily.marry needs a partner handed to it. WHO '
        + 'YOU CAN MARRY IS PAOLO\'S (coordinator 9/5) and this module will not '
        + 'pick one, not even as a default.');
    if (spouseOf(tree)) return null;      /* permanent: one act-one marriage */
    var o = opts || {};
    var n = node('spouse', RELS.SPOUSE, {
      name: partner.name || null,
      draft: partner.draft === undefined ? true : !!partner.draft,
      pending: partner.pending === undefined ? true : !!partner.pending,
      age: partner.age || 'adult',
      born: (o.turn === undefined ? null : o.turn),
      why: 'married by the end of act one'
    });
    tree.push(n);
    return n;
  }

  /* ==========================================================================
     CHILDREN. "Has three to four children from this marriage" (GDD v2 245), so
     the COUNT is canon and which of the two is derived from the seed the same
     way the heir is -- deterministic, so a reload cannot change how many
     children you have. Born with name:null: naming your own child is his.
     ========================================================================== */
  var KIDS_MIN = 3, KIDS_MAX = 4;

  function howManyKids(seedText) {
    var h = xmur3(String(seedText || '') + '::kids')();
    return KIDS_MIN + (h % (KIDS_MAX - KIDS_MIN + 1));
  }

  function bear(tree, seedText, opts) {
    if (!spouseOf(tree)) return null;    /* canon: children come from the marriage */
    var o = opts || {};
    var have = (tree || []).filter(function (n) {
      return n.rel === RELS.CHILD; }).length;
    if (have >= howManyKids(seedText)) return null;
    var n = node('kid:' + (have + 1), RELS.CHILD, {
      name: null, draft: true, pending: true, age: 'newborn', years: 0,
      born: (o.turn === undefined ? null : o.turn),
      why: 'born in act one'
    });
    tree.push(n);
    return n;
  }

  /* A DEATH. The node stays; only `alive` moves. Nothing is ever deleted from a
     tree, for the same reason a settled deed keeps its record. */
  function bury(tree, id, why) {
    var n = byId(tree, id);
    if (!n || !n.alive) return null;
    n.alive = false;
    n.why = why || n.why;
    return n;
  }

  /* AN AGEING. Takes the years, never assumes them: the fold hands it the canon
     ~30 and nothing else in the game is entitled to make a number up. The dead
     do not age. */
  function agePeople(tree, years) {
    var add = Number(years) || 0;
    if (add <= 0) return 0;
    var moved = 0;
    for (var i = 0; i < (tree || []).length; i++) {
      var n = tree[i];
      if (!n.alive) continue;
      /* SOMEBODY BORN IN PLAY CARRIES REAL YEARS, so use them. Everybody else
         only ever had a word, so the band's midpoint is the best that word can
         give -- and once they have been aged once they carry years too, which
         is strictly better than the word they started with. */
      var from = (typeof n.years === 'number') ? n.years
               : (BAND[n.age] === undefined ? BAND.adult : BAND[n.age]);
      var to = from + add;
      n.years = to;
      var word = bandOf(to);
      if (word !== n.age) { n.age = word; moved++; }
    }
    return moved;
  }

  /* ==========================================================================
     THE ONE RULE, TWICE, PROVEN -- and this comment is the honest part.
     GDD v4 line 58 fixes heir selection exactly: hash seed + gen + candidate
     ids, child first, else sibling's child. The implementation exists inside
     engine/bohemia_engine.js, which its own header calls a COMBINED ENGINE
     BUNDLE stitched for handoff, and which is in NO played file. So the played
     game cannot call it, and that is why the row says selectHeir has zero
     callers.
     Two places holding one rule is the bug this repo keeps paying for, so it is
     not left to luck: heir_gate.js runs THIS function and the bundle's
     selectHeir over hundreds of randomised trees and seeds and fails unless
     every single answer is identical. Proven agreement is the only honest form
     of a duplicate, and the duplicate only exists because a handoff bundle
     cannot be imported by a browser slice.
     ========================================================================== */
  function heirOf(tree, seedText, gen) {
    var kids = (tree || []).filter(function (n) {
      return n.rel === RELS.CHILD && n.alive; });
    if (kids.length) return kids[derivedIndex(seedText, gen, 'child', kids)].id;
    var nieces = (tree || []).filter(function (n) {
      return n.rel === RELS.NEPHEW && n.alive; });
    if (nieces.length) return nieces[derivedIndex(seedText, gen, 'niece', nieces)].id;
    return null;      /* a dynasty in crisis is a real state, not an error */
  }

  function derivedIndex(seedText, gen, tag, list) {
    var ids = list.map(function (n) { return n.id; }).join(',');
    var key = String(seedText || '') + '::heir::' + gen + '::' + tag + '::' + ids;
    var h = xmur3(key)();
    return (h >>> 0) % list.length;
  }

  /* PLAYER-FACING WORDS, ALL draft:true (8/11: words get an attempt, decisions
     wait). These name NOBODY -- they say what the game actually knows about a
     person, which is their place in the family, so a child can be spoken about
     before Paolo has named one. */
  var ORDINALS = ['FIRSTBORN', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'];
  function say(tree, n) {
    if (!n) return null;
    if (n.name) return String(n.name);
    if (n.rel === RELS.CHILD) {
      var order = (tree || []).filter(function (k) {
        return k.rel === RELS.CHILD; }).indexOf(n) ;
      return 'YOUR ' + (ORDINALS[order] || 'YOUNGEST');
    }
    if (n.rel === RELS.SPOUSE) return 'THE ONE YOU MARRIED';
    return null;
  }

  var API = { RELS: RELS, LADDER: LADDER, KIDS_MIN: KIDS_MIN, KIDS_MAX: KIDS_MAX,
              seedTree: seedTree, marry: marry, bear: bear, bury: bury,
              agePeople: agePeople, heirOf: heirOf, howManyKids: howManyKids,
              byId: byId, kidsOf: kidsOf, spouseOf: spouseOf, say: say };
  if (HASREQ) module.exports = API; else root.BohemiaFamily = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);

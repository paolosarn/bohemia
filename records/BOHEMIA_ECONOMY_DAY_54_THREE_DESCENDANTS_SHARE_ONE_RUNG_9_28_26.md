# ECONOMY -- ROUND 54, Q52 [inherited trust], ROUND ONE OF TWO
# 9/28/26. MODE: RESEARCH -- NOTHING IN THIS FILE IS IMPLEMENTED.
# Board row: VAMILY.md, economy-vamily-knxaeh.
# "trust is inherited across generations (Algan and Cahuc, immigrants' descendants) and the
#  fold has no field for it; standings is one outfit's opinion, trust is whether a stranger
#  deals straight. Two rounds: what inherited trust does to prices, lending and who gets the
#  first battery (Q49), and the one integer shape it could take."

THE HEADLINE: ROUND 50 SAID WE HAVE NO TRUST FIELD. MEASURED THIS ROUND, THE SHARPER AND
STRANGER TRUTH IS THE OPPOSITE PROBLEM. This game already has a gate-tested, three-generation
reputation-decay mechanism sitting unused, AND a completely separate rung system that gates
real lending and asking today -- and that second system does not decay at all across a
generation, it does not reset either, IT IS SHARED, INSTANTLY AND COMPLETELY, BY ALL THREE
NAMED DESCENDANTS AT ONCE, because nothing in the save distinguishes which of the three you
currently are. The real record's finding (inherited trust decays slowly but never vanishes) is
a case this game does not model in EITHER direction: not decay, not reset, just one shared
number three different people are all reading off at the same time.

===========================================================================
0. A FALSE START THIS ROUND, CAUGHT BEFORE IT WAS PUBLISHED
===========================================================================
My first pass assumed bohemia_standing.js's rung system (opinionOf/rungFor, driven by
witnessed deeds) was the SAME pipe that gates `askFor`/`bargain` (round 49's subject). It is
not. Checked by reading both functions rather than trusting the shared word "rung":
`bohemia_favour.askFor` calls `B.bargain(rule, given)` where B is `bohemia_belonging.js`, and
that module's own RUNGS ladder is keyed by `given` -- a raw count of favours done for a
faction, read from `save.meta.gave` -- with no `require()` of bohemia_standing.js anywhere in
the file. THEY ARE TWO SEPARATE RUNG SYSTEMS, keyed two different ways, and this record keeps
them apart throughout rather than repeating my own first mistake.

===========================================================================
1. WHAT THE REPO DOES TODAY -- MEASURED, THREE SEPARATE MECHANISMS TRACED
===========================================================================
### 1a. NO TRUST FIELD, RECONFIRMED (round 50's finding, checked fresh)

engine/bohemia_fold.js's CARRY list, read directly from source, still thirteen fields:
standings, deeds, territory, builds, economyCapacity, invest, karma, virtues, family, wounds,
blindSpot, recordedKnown, debt. No trust field exists. `standings` (a per-faction number,
-100..100, decaying at STANDING_DECAY_TO_NEUTRAL=0.25 a generation, so 0.75 survives) is the
nearest thing, and it is measurably NOT trust: the only place it is ever read on the whole
walked surface is `keys(l.standings).length` inside `whatYouKept()`, which counts how many
outfits have an opinion for a reckoning-card sentence and never reads the actual NUMBER for
anything. A real, inherited, decaying reputation field exists, carries forward correctly, and
has exactly one caller, which only counts its keys.

### 1b. A GATE-TESTED, THREE-GENERATION REPUTATION MECHANISM ALREADY EXISTS, UNUSED

engine/bohemia_standing.js's `inherit(minds, parentId, childId, turn, alive)` is a real,
working, already-shipped function (9/22, [rumours travel] / 9/23 [creditor stands]), and
gates/standing_gate.js proves it across THREE GENERATIONS with real distinct ids, output
pasted from reading the gate directly:

    S.inherit([only], 'FATHER', 'CHILD', 30*365*1440)
      -> "A QUIET DEED DIES WITH THE WITNESS: one person saw it, nobody was ever told, and
          a generation later the child inherits NOTHING"
    S.inherit([a,b,c], 'FATHER', 'CHILD', 30*365*1440)  (a deed that WAS retold)
      -> "A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR: it travelled ... and
          the child starts owing a debt they did not run up"
    S.inherit([a,b,c], 'CHILD', 'GRANDCHILD', 60*365*1440)
      -> "AND IT FADES EACH GENERATION -- three generations on, only the loudest thing your
          grandfather did still registers at all"

That is EXACTLY the real record's shape (Algan and Cahuc: inherited, causal, and NOT
invariant -- it moves, slowly) modelled correctly, tested correctly, three generations deep,
deterministic, and inventing nothing (a fresh heir against an empty weight table reads
exactly 0). IT IS NOT A GAP. IT IS A FINISHED MECHANISM WITH NOWHERE TO STAND.

Its only two live callers on the walked surface, `ctFold()` and `ctFoldBeat()`
(slices/BOHEMIA_CITY_WORLD.html:75840, :76057), both call it as:

    BohemiaStanding.inherit(minds, '@', '@', ctMinuteNow(), ctStillHere())

PARENT AND CHILD ARE THE SAME LITERAL STRING, BOTH TIMES. Whatever this call is folding, it
is not folding one person's reputation onto a DIFFERENT person's. Read plainly, all it can do
with parentId===childId is decide whether a not-yet-retold memory of "you" survives because a
witness to it is still standing nearby -- a private memory-freshness pass on one continuous
identity, not a handoff between two people. THE THREE-GENERATION MACHINE GATES ALREADY PROVE
THE FUNCTION WORKS WITH REAL DISTINCT IDS; NOTHING ON THE REAL SURFACE EVER GIVES IT ANY.

### 1c. THE RUNG THAT ACTUALLY GATES LENDING IS A DIFFERENT SYSTEM, AND IT IS PERFECTLY,
    INSTANTLY SHARED BY ALL THREE NAMED DESCENDANTS AT ONCE

`bohemia_belonging.js`'s RUNGS ladder (stranger=0, showed-up=1, useful=3, counted=6, ...) is
the one round 49 measured as gating who can ask a faction for anything. It is keyed by
`gaveOf(save, fid)`, which reads `save.meta.gave[fid]` -- ONE counter per faction, in ONE
global save object (`ctBelongSave()`, hydrated once into `window.__CT_BELONG`). Searched every
caller of `gaveOf` and every writer of `save.meta.gave` on the whole surface: NONE of them key
by an act number, a descendant id, or anything that would tell three named people apart. The
three-acts-at-once flip (rule 31) itself is just a state toggle --

    var CURRENT = 1;
    function flip(n){ ... CURRENT = n|0; return {moved:true, from:from, to:CURRENT}; }

-- CURRENT is which SCREEN is showing, not which SAVE record is read. `gaveOf` never consults
it. So THE HONEST MEASURED ANSWER TO PART OF THE ROW'S OWN QUESTION -- what does inherited
trust do to lending and who gets the first battery -- IS: TODAY IT IS NOT INHERITED AT ALL, IT
IS SHARED. Whichever of the three named descendants (rule 32d, THE THREE NAMES) the player is
currently tapped to, every favour ever done for a faction by ANY of the three already counts
for ALL of the three, in full, the instant you flip. A third-generation descendant who has
never met anyone starts at whatever rung the first-generation descendant worked their whole
life to reach, not a fraction of it and not zero of it -- the whole thing, because the
mechanism was never built to know there are three different people at all.

### 1d. AND THE ACTUAL PLACE THIS SHOULD BE DECIDED IS AN ADMITTED STUB

Rule 31 section 2(a) says the future is DERIVED, never authored: "Act 2's city and act 3's
city are computed from the earlier acts' ledgers ... every time he flips forward." The
function that is supposed to say what an act inherited from the one before it already exists
and already says, in its own words, that it does nothing yet:

    function groundDiffers(){ return { differs: false, why: 'NO_DERIVE_YET', draft: DRAFT }; }

So there are, measured, THREE separate half-built systems that could plausibly carry
"inherited trust" and none of them is connected to either of the other two: (i)
bohemia_engine.js's foldGeneration + family/heir apparatus (a real chosen heir, per round 50,
zero callers outside the retired slice), (ii) bohemia_standing.inherit(), gate-proven for real
distinct people, called only with the same id twice, (iii) the belonging rung, which does not
distinguish people at all and is the one that actually matters for lending today. Whichever of
these the eventual derive (rule 31, DYNASTY [the derive] / WORLD [future city], already open
per round 51's routing) ends up using decides this question; nobody has decided yet.

===========================================================================
2. AISLE TWO -- PRICE, SPECIFICALLY
===========================================================================
No new measurement needed here: round 40 and round 52 already established that every market
shares one unkeyed price ledger and the four frozen purse verbs never read distance, headcount
or, by the same shape, WHO is buying. There is no per-person price anywhere in the pricing
engine for inherited trust, earned trust, or anything else to move. If a stranger and a
third-generation local both reach the shelf, they pay the same one number. Whatever "trust
affects prices" would mean here, it would have to move ACCESS (can you even trade at all, can
a faction be asked), never a price figure -- the same conclusion round 52 reached for Battle
Brothers' town-to-town spread, from the same law (EVERYTHING COSTS ONE).

===========================================================================
3. THE REAL RECORD
===========================================================================
Round 50 already sourced the core finding and it is cited rather than re-run: descendants of
US immigrants carry a trust level predicted by their forebears' country of origin and year of
arrival, decades and generations later, with a real causal effect on growth -- persistent, and
explicitly NOT invariant, meaning it moves, slowly, rather than freezing or vanishing.

THE SHAPE THAT MATTERS FOR THIS ROUND, STATED PRECISELY: real inherited trust is a MIDDLE
CASE between two extremes, and this game currently has neither extreme built correctly and
does not have the middle case at all.
  - ONE EXTREME: a fresh descendant starts as a total stranger, no better than Q49's "he
    cannot ask" opener. NOT WHAT WE HAVE (the belonging rung is fully shared).
  - THE OTHER EXTREME: a fresh descendant starts with the FULL, undivided rung the last one
    earned, as if no generation had passed and no new person exists. THIS IS EXACTLY WHAT WE
    HAVE, measured in section 1c, and it is the less realistic of the two extremes, not the
    more forgiving one: the real record says trust moves and fades; ours neither moves nor
    fades, it is simply the same account read by three different names.
  - THE REAL SHAPE: partial and decaying, which is precisely what bohemia_standing.inherit()
    already computes correctly (section 1b) for a completely different field (witnessed deeds,
    not belonging-rung favours), sitting one generation away from being useful here.

===========================================================================
4. THE FINDING
===========================================================================
INHERITED TRUST IS NOT MISSING FROM THIS GAME. IT IS DOUBLE-BUILT AND MIS-ROUTED. One
mechanism (bohemia_standing.inherit) models exactly the real record's decay shape, three
generations deep, gate-proven, and is never called with two different people. A second,
completely unrelated mechanism (the belonging rung) is the one that actually gates lending and
the first battery today, and it does not model inheritance at all -- it accidentally grants
PERFECT, INSTANT INHERITANCE by never distinguishing the three named descendants in the first
place. The real record disagrees with the second mechanism specifically: trust this
complete and this immediate, passed without any decay at all across three real generations,
is not what any measured population does. And the actual seam where this gets decided --
rule 31's derive -- is an admitted stub that has not chosen yet which of the game's existing,
half-finished mechanisms it will lean on.

===========================================================================
5. WHAT THIS ROUND DID NOT MEASURE, SAID PLAINLY
===========================================================================
- Whether the belonging rung's sharing across the three descendants is an intentional
  simplification (three descendants as facets of "the family" rather than three strangers to
  each faction) or simply unbuilt. Not stated anywhere in the module's own comments; not
  guessed at here.
- Any callers of foldGeneration / the family-heir system outside the retired slice. Round 50
  already measured zero and this round did not re-run that search.
- What DYNASTY's own [the derive] work, if any has started, currently plans to use. Not this
  lane's file to read without being told to.

===========================================================================
6. ROUTED
===========================================================================
DYNASTY / WORLD   [the derive], already open per round 51's routing (records/BOHEMIA_
                  COORDINATOR_ROUND_9_24_26.md): when the derive is built, section 1b hands it
                  a working three-generation decay mechanism already gate-tested for exactly
                  this shape, if a witnessed-deed-style reputation is what should cross; section
                  1c is the thing to explicitly NOT copy uncritically, because it is the shape
                  that currently ships and it grants full inheritance by omission, not by
                  design.
PEOPLE            bohemia_standing.inherit()'s three-generation test is your own row's
                  ([rumours travel]/[creditor stands]) unused asset; nothing broken, just
                  named so it is not forgotten under the wrong module.
COORDINATOR       a canon-shape question, not ruled here: does "the future is derived" (rule 31
                  s2) intend the three named descendants to be TRUE STRANGERS RE-EARNING every
                  faction relationship, or FAMILY MEMBERS WHO SHARE STANDING because they are
                  one household? The real record supports a middle position (partial, decaying)
                  that this game currently has no field for in either mechanism. Flagging
                  because it decides which of two already-built machines gets connected, not
                  because a number is missing.

===========================================================================
7. THE [bb ...] SCHOOL LINE (rule 33, every chat, continuously)
===========================================================================
[inherited trust] Battle Brothers starts a fresh recruit from zero relationship with a
company; there is no "your grandfather fought for this banner" mechanic in the reference
game at all -- a mercenary company is a business relationship, not a household, so BB simply
never had this question to answer. Ours does, because rule 31 gave the player three named
DESCENDANTS on purpose, and that is a design BB's own economy never had to solve.

===========================================================================
8. THE ANALOG HORROR LINE (rule 20h, every chat)
===========================================================================
Three different names, three different faces, three different lifetimes decades apart from
each other -- and every faction in the valley greets all three of them exactly the same way,
because as far as the ledger is concerned they have always been the same account. THE HORROR
IS THE FACTION THAT NEVER NOTICES THE FAMILY CHANGED: it says the same warm thing to a
grandchild it has genuinely never met that it earned from a grandparent it actually knew.

===========================================================================
9. NOT IN A TAB YET
===========================================================================
This record is research. THE THREE NAMES and the flip between them are live in the demo (rule
31, rule 32d); the belonging rung and bohemia_standing.inherit() are both live code reachable
by playing; nothing about connecting inherited trust to either of them has been built.

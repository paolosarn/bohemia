# THE GAME HELD A WAR AND THE COST ENGINE COULD NOT FEEL IT

**8/26/26 — FACTIONS lane. Record, not a decision.**

## THE RULING THIS CAME FROM

Paolo, 8/26, verbatim:

> "custom is your own personal faction!!!!!! and you can imagine if you play the
> game with your custom faction the values arent just for you its for how your
> factions treated bro but u prob Already have that. But, yeah, for the other
> factions. But, yeah,"

Two halves, and they are different jobs.

**HALF ONE, YOURS.** The standing is not a number about a person. It is what an
outfit thinks of THE OUTFIT YOU RUN WITH. He is right that some of it existed:
the ledger, the rungs, the wall. What did not exist was the surface ever SAYING
whose the number is.

**HALF TWO, THEIRS.** "But, yeah, for the other factions." The other outfits
have positions on each other that have nothing to do with the player. That half
did not exist at all.

## WHAT WAS ALREADY THERE, AND HAD NEVER BEEN READ

`engine/BOHEMIA_faction_graph.json`, whose own `_meta` says:

> "relations are directional labels the engine reads for spillover, war state,
> and AI. All canon; nothing invented."

Nine directed relations across five labels, sitting in the repo the whole time:

| from | to | label |
|---|---|---|
| Remnants | Cartel | permanent-war |
| Cartel | Remnants | permanent-war |
| Cartel | Caravans | prey-tax |
| Caravans | Cartel | preyed-taxed |
| Remnants | Mob | professional-respect |
| Mob | Remnants | professional-respect |
| Reds | Network | adjacent |
| Network | Reds | adjacent |
| Cartel | Volunteers | hands-off |

And `engine/bohemia_engine.js` `FactionCanon.REL_SPEC` had already priced every
one of those labels on 7/2, with a research note that turns out to be the key
idea in the whole system:

> "'permanent war' and 'protected neutrality' are LORE INVARIANTS. They must
> hold no matter what the player does... So they're enforced as a clamp applied
> on every standing change, not as a starting value that can drift away. A
> starting value decays; an invariant holds."

**The city has never read either one.** `grep -c BohemiaEngine
slices/BOHEMIA_CITY_WORLD.html` was **0**. `bohemia_loop.js` boots FactionCanon,
and the loop never reaches global scope in the city — the city's own CT_BASES
comment says so in as many words.

## THE HOLE, IN ONE LINE

`bohemia_commitment.costs()`:

```js
var lose = stateIndex(state);          // one number, for everybody
```

Side with the Cartel where both can hear, and the Remnants — at permanent war
with the Cartel since before anyone alive — took **exactly** what the Church
took, and the Church have no canon position on the Cartel whatsoever.

## THE THREE DEFECTS, AND HOW EACH WAS FOUND

None of them was visible in a diff. All three were visible in a card.

### 1. THE DEAD ZONE

The weight is the canon standing as a proportion: `base + round(base * -init/100)`.
The Cartel tax the Caravans at init **-45**. At base cost **1** — the single most
common case in the game — that is `round(0.45)` = **0**.

A canon hostile position that costs nothing. Found by printing the table, not by
reasoning about the formula.

**The fix is FactionCanon's own lesson applied to the cost side:** the sign is an
INVARIANT, not a hint. Hostile always takes more than flat, warm always takes
less, neutral moves nothing.

### 2. THE ROW BEHIND THE WRONG GUARD

The world-fact row ("AND ARE UP AGAINST") went into `ctHearRows`, which looked
obviously right. Then a real Cartel card was opened — an outfit with three
hostile canon positions — and the row was not there.

`ctHearRows` is called from exactly one place:

```js
if(ctLadder && ctWall && ctWall.atWall && ctWall.blocks){ ... }
```

Every row in it exists only once you have hit the wall. Correct for the
who-will-hear rows, which preview a commitment. Wrong for a fact that is true
whether or not the player has ever met these people.

**This is the same bug this lane has now fixed seven times:** a row placed behind
a guard that excludes the case it is most about. The tertius row was after an
early return on the exact condition it described.

### 3. THE CARD THAT CONTRADICTED ITSELF

There are **two** `whoHears` calls in the city. `ctHearRows` walks the graph for
the display rows; `ctSideCost` walks it again for the price. Teaching one about
watchers and not the other shipped this:

```
WILL HEAR IT AS FACT :: CARAVANS, REMNANTS
IT GETS OUT THROUGH  :: NOBODY. THEY WERE ALREADY WATCHING.
AND IT COSTS YOU     :: NOTHING. NOBODY WHO COULD CHARGE YOU FOR IT IS
                        CLOSE ENOUGH TO KNOW.
```

Each row was individually correct about its own opinion of the same graph. The
city's own comment beside the tertius row already said it: *"two calls are two
opinions about one graph."*

## AND THE WHOLE THING COULD NOT FIRE, WHICH WAS MEASURED FIRST

Before building the watcher rule, the live city was swept: every base, every
affiliated person, the real `whoHears` against the real roster.

**Two hearing pairs in the entire valley.** Mob ↔ Network. Neither is a pair
canon holds a position on.

So the weighted cost was correct code that was structurally unable to fire. The
acquaintance walk needs a chain of housemates or workmates between two outfits,
and a thin population does not have one.

**And the chain is the wrong test for this case anyway**, which is what makes the
fix a fix rather than a cheat. The module's own STAGES already say what a
commitment IS:

- `sided` — "Said in front of people. That is the whole mechanism and it is enough."
- `burned` — "Something you had with somebody else is gone now, **and they know which somebody**."

A public declaration does not travel by rumour. The Remnants do not need your
housemate to tell them who the Cartel just took in. They have been looking for
years.

`whoHears` grew `opts.watching`: an outfit that canon says holds a position on
the outfit you are committing to hears it as fact, at zero hops, no tie required.
A real tie still wins (it names the room the news went through). A rumour at 2+
hops gets upgraded.

**A neutral arrangement is not surveillance.** The first run of this made the
Volunteers (hands-off, init 0) hear about every Cartel commitment and charge a
flat price for it — printed directly underneath their own shipped sentence,
*"Nobody is going to hold this against you. There is no side to be on here."* A
surface that contradicts itself in two adjacent lines is worse than one that says
nothing. Watchers are hostile or warm only; a position is a reason to be looking,
and neutral is the absence of one.

## WHAT IS ON THE CARD NOW — **RUN TAB**, iPhone portrait

```
RUNS WITH            :: CARTEL  PREDATORY
AND ARE UP AGAINST   :: CARAVANS, REMNANTS
YOU ARE              :: COUNTED · 4 MORE TO INSIDE · AND SO IS THE CUSTOM
THE WALL             :: TURNING UP GETS YOU NO FURTHER THAN USEFUL.
WILL HEAR IT AS FACT :: CARAVANS, REMNANTS
IT GETS OUT THROUGH  :: NOBODY. THEY WERE ALREADY WATCHING.
AND IT COSTS YOU     :: CARAVANS -2!, REMNANTS -2!
BECAUSE              :: CARAVANS: THEY GET TAXED BY THEM  ·
                        REMNANTS: AT WAR, AND IT DOES NOT END
```

`!` = they hold something against the people you are siding with.
`~` = they run close to them, so it went cheap.

## THE BOUNDARY, SO NOBODY BUILDS A FIFTH

`tools/bohemia_commitment.py` carries a post-mortem of nearly overwriting
`engine/bohemia_standing.js` on 8/15 because the name was taken. That
post-mortem was read before a line of this was written, which is the only reason
the new module is called `bohemia_between.js`.

| module | question |
|---|---|
| `bohemia_standing.js` | What PEOPLE think of you. Individual minds, decaying, retold at a penalty per hop. |
| `bohemia_belonging.js` | How far IN you are with one outfit. The rungs. |
| `bohemia_commitment.js` | The wall, and who is positioned to hear. |
| **`bohemia_between.js`** | **What two OUTFITS are to each other. Not about you at all.** |

## HIS OWN OUTFIT IS EMPTY AND THAT IS CORRECT

`Custom` has `relations: {}`. Canon's note on it:

> "Player faction. No preset philosophy. Identity emerges from three generations
> of action."

An emergent faction has not made its enemies yet. The mechanism is live and
empty. The day one line goes into that JSON, his outfit has a war and every
surface already knows what to do with it.

That is MECHANISM-MINE / CONTENTS-PAOLO'S working, not a gap. **On 8/21 this lane
reported his own faction as a defect for exactly this shape of emptiness and he
had to correct it.** Gate claim C4 exists so that does not happen twice.

## STANDING FINDINGS, NOT MINE TO FIX

1. **The valley is too thin for word to travel.** Two hearing pairs across the
   whole map. The watcher rule routes around it for canon-related outfits; it
   does nothing for the other 200-odd pairs. Whatever eventually thickens the
   population or the tie graph will make a lot of already-built machinery start
   firing at once.

2. **`Blues` and `Anarchists` have bases at the top edge (y=0, y=3) and zero
   members.** Karens, Social Forces and Amalgamation have belonging rules and no
   base at all. Five of sixteen outfits are unreachable.

3. **The commitment rows all live behind the wall guard.** Correct for a
   commitment preview, but it means most of the word-travels system is invisible
   until you have ground one outfit to its ceiling.

## GATE

`gates/faction_between_gate.js` — 40 claims, 0 failed. Registered as
**FACTION BETWEEN**. Eleven claims load the shipped city in a real browser at
390x844 and read the rows a person would see.

Seven mutations run, each biting the claim written for it:

| mutation | claims that went red |
|---|---|
| revert the min-bite to pure proportion | B1, B2, B6 |
| the naive both-seats `ripples` | C1 |
| teach only one of the two `whoHears` calls | F3, G7 |
| revert the NOTHING row to its single sentence | F3, G5, G7 |
| delete the world-fact row from the ordinary card | G3, G4, G9b |
| promote a professional-respect to a permanent-war | A1 |
| type the player's outfit instead of reading the graph | A5, C4 |

One weak mutation was found and replaced: deleting a single line of the
`ripples` dedupe left the second guard still deduping, so it applied without
biting. **A mutation that applies but changes no behaviour looks exactly like a
claim that does not bite.**

## WHAT COMES AFTER, AND WHY IT IS THE SAME RULING

His half one, taken to its conclusion. The card now NAMES the outfit that
carries the standing ("AND SO IS THE CUSTOM"), which is honest but is still a
label on a number keyed per-player in `save.meta.gave`.

**THE NEXT BUILD: YOUR OUTFIT EARNS ITS ENEMIES.**

Canon's note on Custom is not decoration, it is an instruction:

> "Player faction. No preset philosophy. **Identity emerges from three
> generations of action.**"

`Custom.relations` is `{}` and the mechanism around it is already live. So:
when you publicly side with the Cartel, YOUR outfit acquires a position with
the Remnants, because that is what taking a side in a war means. Then
`ripples('Custom')` stops being empty, the AND ARE UP AGAINST row works for
your own outfit, and the standing is a property of the faction rather than a
label on one.

**AND THE BOUNDARY THAT KEEPS IT LEGAL.** Writing relations INTO
`BOHEMIA_faction_graph.json` would be writing canon, which is his. So the
earned relations live in **the save**, never in the graph. The graph stays the
authored world; the save carries what this particular player's outfit did to
itself. `between()` already returns null for pairs canon says nothing about,
so the merge point is one function and the authored half always wins.

That is MECHANISM-MINE / CONTENTS-PAOLO'S with the mechanism being exactly the
one canon asked for in writing.

## THE SWEEP CAUGHT ME, WHICH IS THE POINT OF HAVING IT

`tools/bohemia_organ_reach.js` is this lane's own detector for organs nothing
calls. It was pointed at the new module the same turn it shipped and reported
**seven of ten functions with no caller anywhere**.

- `either`, `isMine`, `powerOf` — **DELETED.** Written because they were the
  obvious things a module like this "should" have. Nothing called them. The
  sweep's own sentence is the ruling: *"An organ with no caller is not a
  shipped feature. It is a candidate on a sheet."*
- `alignOf` — **WIRED**, not exempted. The alignment word is canon
  (predatory, territorial, psyop, evangelical) and no surface had ever shown
  it. It rides the existing RUNS WITH row, so it cost no rows:
  `RUNS WITH :: CARTEL  PREDATORY`.
- `myRipples`, `keys` — declared TOOLING_ONLY with written reasons, same as
  `BohemiaBelonging.keys` and `BohemiaIntros.keys` already were.

**WIRE IT OR KILL IT. An exemption was never the third option.**

### AND THE SWEEP ITSELF WAS WRONG TWICE, IN THE SAME WAY

Both found by pointing it at a module written the way this codebase actually
writes them.

1. **It could not see the guarded injection.** Its detector was
   `[:(,]\s*Global\s*[,)}]`, which matches `{ties:BohemiaTies}` but never
   `between:(typeof BohemiaBetween!=='undefined'?BohemiaBetween:null)` — where
   the name is followed by `:null)`. The guarded form is the one used almost
   everywhere, because a module that might not be inlined must not throw.

2. **It could not follow the alias even once it saw the injection.** The
   engine tier excludes dotted calls (`[^.a-zA-Z]`) so that `Module.fn(` is not
   double counted as an internal helper. That same exclusion blinds it to
   `B.fn(`, which is the *only* way an injected module is ever called.
   `engine/bohemia_commitment.js:479` reads `var w = B.weigh(...)` and the
   sweep called `weigh` dead.

Both fixed in the tool. **A SWEEP THAT CANNOT TELL AN INJECTED MODULE FROM A
DEAD ONE IS THE BROKEN THING, NOT THE MODULE** — the file's own docstring, and
it turned out to be about the file. FIX THE RULER, NEVER THE TARGET.

The alias tier excludes the standard-library receivers by name, or
`Object.keys(` would make every module's `keys()` look alive forever. That is
the opposite failure and a much quieter one.

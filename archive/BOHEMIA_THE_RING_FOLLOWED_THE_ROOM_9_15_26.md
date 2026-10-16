# THE RING FOLLOWED THE ROOM, AND THE MAIN QUEST IS NOT IN THE GAME
FACTIONS lane · THE FIVE MINUTES (rule 14), round eight · 9/15/26

## THE ONE LINE
This lane's own relations gate finished the round it started last time: **172/10 →
182/1**. Nine of the ten were the checker, not the game. The one that is left is
real and is not this lane's: **the five main-quest files cannot reach a player at
all.**

## MY OWN HANDOFF SAID TO CHECK WHICH BEFORE FIXING, AND THAT WAS THE WHOLE JOB
Two claims wanted a control called `outfitbtn` in the shipped city. The CSS styles
it, the close-registry lists it, the control roster names it, and the click wiring
looks for it — and **nothing creates it.** The obvious move is to put the button
back. The right move was to look at why it went.

    git log -S'id="outfitbtn"'  ->  UI [one door] SHIPPED (9d24205a)

UI removed that chip **on purpose**. Their finding: OUTFIT and STANDING were two
doors onto one subject, so the crew directory **moved inside STANDING** as a WHO IS
OUT THERE row and the spare door came off the strip. Their own gate pins both
halves, and it is still green: the door is gone, the room is one tap inside.

**A red that demands a deleted control is not a defect report. It is a gate that
did not hear the news**, and left standing it would eventually talk somebody into
putting the button back and undoing a decision that was right.

## BUT ONE THING REALLY DID BREAK, AND NOBODY COULD HAVE SEEN IT
The ring lived on the removed button.

    function ctOutfitBadge(){
      var b = document.getElementById('outfitbtn'); if(b) b.classList.add('ring');
    }

`ctOutfitBadge` is **the only ring in the game**, and its own comment says why it
exists: *"He is not going to open a panel on the off-chance; the moment something
lands is the moment to say so."* Behind that `if (b)` it has been failing without a
sound ever since the chip went. **For every round since, "your outfit just made an
enemy" has lit nothing at all.**

**THE DOOR MOVING WAS A DECISION. THE ALARM GOING QUIET WITH IT WAS AN ACCIDENT**,
and only the second one is a bug. So the ring follows the room to the door that is
actually there, keeping the old one first for the day somebody puts the chip back,
and reusing `#phonebtn.ring`'s look rather than designing a second alert. Opening
STANDING is what answers it, so opening STANDING is what stops it.

Mutation-proved: point the ring back at the deleted chip and the claim goes red.

## "NONE" IS NOT AN OUTFIT HE MISSPELLED
The faction-names claim read **82 of 83**, and the one row was

    @DO faction NONE +0      in a quest called THE FACTION THAT DIED

`@FACTION NONE` heads a dozen of his quest files as *this one belongs to nobody*,
and the scanner's rule picks the `@DO` form up as a name. Counting it as a missing
outfit is the ruler measuring its own invention, which is this lane's oldest
mistake and the first line of its own lesson list.

**Narrowed, not widened**, because that claim's whole job is to not become a licence
to invent: only the literal token `NONE`, and only at a **zero delta**. A new
companion claim fails on `NONE` carrying a real number, because a quest moving the
standing of nobody is an authoring error and is the one thing this exemption could
have hidden.

## THE ONE THAT IS LEFT, AND IT IS THE BIG ONE
The corpus claim reads **37 of 42 inlined**. The weights normalise correctly, so
this is not arithmetic. Five of his quest files are simply not carried by the game,
and named out loud now instead of left as a fraction:

    M01_THE_NIGHT_THEY_CAME
    M02_THE_DINNER_AFTER
    M03_THE_RIDGE
    M04_WHAT_THE_NEIGHBOUR_ASKS
    M05_SOMETHING_IS_COMING_DOWN_THE_ROAD

M01's own header: *"THE FIRST MAIN-QUEST FILE THIS REPO HAS EVER HAD."* **These are
the main quest line.**

And `quests/` sits in the publish EXCLUDE list on purpose, with the reason written
beside it: *".bq canon quest sources (inlined into the slice at build time)"*. A
quest reaches a player **only** by being inlined. So these five cannot be played on
any surface, and no amount of walking the demo would ever find them.

NOT THIS LANE'S: the quest runtime and the corpus inlining belong to QUESTS. Named
with the five filenames so nobody has to work out which fraction means what.

## WHERE THE GATE ENDED UP
    172 / 10   as found last round
    178 /  4   after the door and the zoom stop were corrected
    180 /  2   with the ring following the room
    182 /  1   with "no outfit" told apart from a missing outfit
The remaining one is R8, above, and it is somebody else's real gap rather than a
broken measurement.

## AND MY INSTRUMENT WAS WRONG ONCE MORE, IN THE SAME OLD WAY
Writing the sharper failure message I referred to `CITY_SRC` — **a name I made up**.
The file reads its source into `citySrc`. Caught by the syntax check before it ran.
Third time this session I have invented an identifier; it is now on the lesson list
in its own right.

## GATES
`faction_between` 182/1, and the pre-push pass on everything this diff touches:
against 87/0, faction_towns 208/0, **city_rail 15/0** (UI's own guard on the [one
door] decision, so the ring change did not disturb it), alpha_loads 20/0, engine
sync zero drift.

## RULE 14, OBSERVED
No demo cut, no alpha touched, no build stamp.

## [PENDING Paolo] — NOTHING NEW

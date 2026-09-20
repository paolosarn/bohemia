# NOBODY IS AT THE DOOR, AND THE TWENTY-ONE WHO ARE HAVE NO NAMES
## QUESTS round 42, row [a person asks], 9/20/26

VAMILY row `[a person asks]` THE-FIRST-ASK-IS-A-PERSON-WITH-A-FACE-AT-HIS-DOOR,
un-held under rule 18 because it is the fourth thing in the playable cut.

> PAOLO 9/20, rule 19: "Unless the quest has actors and I moved to things and
> picked things up in the overworld, you can't just be putting things on the
> screen and pretend they're the quest. It has to be people, characters, items
> to pick up, locations to go, text coming from people's voice, and when they
> speak it shows the character portrait. The whole enchilada."

The ship test is one sentence: **a face on screen speaking within sixty seconds,
no card.** This round measured every part of that against the walked city, before
building anything, because rule 12 says a named dependency is a premise.

## WHAT IS ACTUALLY THERE, AT 06:00, ON THE REAL SURFACE

| what the row needs | what is there |
|---|---|
| a person at his door | **21 bodies on his block** |
| a NAMED person | **0 of 21 have a name** |
| who SAYS the ask | **nobody on the block can speak at all** |
| with a portrait | **no face anywhere a person speaks** |
| no card | **a pop-up card is the first thing on screen** |

### 1. THE FIRST THING ON SCREEN IS THE THING RULE 19 KILLED
The day card is up before anything else, reading "Something came in on your phone
overnight. THE METER READER. nobody has picked it up yet." No person, no mouth,
no face. That is the pop-up rule 19(a) kills, and it is currently the ONLY way
the first ask reaches the player.

### 2. BODIES AT THE DOOR ARE NOT THE MISSING PART
21 people stand on the waking block itself and 40 more one block out. The row
reads as though somebody has to be put there. Nobody does.

### 3. NOT ONE OF THEM HAS A NAME
All 21 answer `SOMEBODY`. Checked BOTH call shapes on purpose, because getting
this wrong would have blamed another lane for my own mistake: `nameOf` returns
null for the wrapper AND for the person inside it, and the person carries no
`name` field and no `tier` field at all. So it is not a call-shape error. PEOPLE's
own rule is that a stranger is their trade until you have asked, which is a good
rule; the point is that the first ask cannot come from "SOMEBODY".

### 4. THE PERSON WHO ASKS CANNOT SPEAK AT THE DOOR, AND THE REASON IS STRUCTURAL
The conversation surface exists and is good: `ctConvNode` / `ctConvBody` put the
quest's own `@TALK` lines in a real mouth. It cannot open at the door because
`ctCast()` keeps ONLY cast standing on **your** block, and day one's required
role casts **six blocks away** -- the game's own offer card says "about 4 and a
half hours on foot, about 8 and a half hours there and back".

So today the order is: a card tells you about a job, you accept on the card, you
walk four and a half hours, and only then can a person say a word about it. Rule
19 wants the opposite order.

The distance is not arbitrary and not a bug: the quest's own role condition is
`lineman REQ faction=TRADES block=browned`, and the nearest TRADES member is six
blocks out. **THE ASKER AND THE WORK HAVE TO BECOME TWO DIFFERENT PEOPLE**, which
is what the row already says: the person is at his door, the place is six blocks
east. Nothing in the mechanism does that today.

### 5. NOTHING DRAWS A FACE WHERE A PERSON SPEAKS
The conversation renderer writes a heading and the lines and never a face. The
city already draws faces for bodies (`pplFace`, `FACE` are live globals), so the
portrait is a wiring job, not a new organ. Rule 19(c) makes it mandatory: no
player-facing sentence outside the phone without a named speaker and their
portrait on screen.

## THE MISTAKE I MADE TWICE IN ONE ROUND, WRITTEN DOWN BECAUSE IT KEEPS HAPPENING
The first pass of this measurement said **0 people at the door and the cast 34
blocks away**. Both were false. I computed the block as `(hx/FN)|0`, which is a
different, finer grid: the game's own `ctBlockOf(hx,hy)` answers `[12,12]` where
that answers `[48,48]`. Re-measured with the game's own helper, it is 21 people
and 6 blocks, and 6 blocks is exactly what the game's own offer card has been
saying all along.

This is the same error this lane recorded on 9/13 ([first ask], circuit -1) and
it survived a whole probe again. **THE RULE: never derive a coordinate the game
already has a function for, and check a surprising number against something the
game says out loud before writing it down.** The offer card was sitting there
saying "six blocks" while my probe said thirty-four.


## SECOND PASS, AND IT INVERTS THE OBVIOUS FIX

The obvious fix after the first pass was: the quest's own role condition is
`lineman REQ faction=TRADES block=browned`, the caster keeps `block=browned` only
as a LABEL and never as a place, so honour it and the lineman lands on the
browned block instead of six blocks out. His own lines even argue for it --
"everybody on this block knows my face, man. I've got a kid." The fiction says he
is a neighbour; the cast says he is a four-and-a-half-hour walk away.

**MEASURED BEFORE BUILDING IT, AND IT WOULD NOT HAVE WORKED.**

    within one block of the door    61 people
    of those, TRADES                *** 0 ***
    the factions actually there     Church 3, no outfit 18 (on the block itself)
    the player's own block          POWER.at -> {live:false, id:-1}

Two things kill it. There is **no TRADES member within a block of the door** to
cast, however the condition is read. And `id:-1` does not mean a dark circuit, it
means **no circuit here at all** -- the exact reading this lane got wrong on 9/12
and wrote down ([check the claim]: "a reader that answers nothing everywhere is
not a quiet world, it is a wrong question"). So the player's block is not
"browned" either. The condition cannot be satisfied at the door by any change to
the caster.

I nearly shipped a caster change that would have moved nobody.

## SO THE FORK IS REAL, AND IT IS THE ROW'S OWN SENTENCE

The row already allows the split: "a NAMED PERSON ... at his door" and "the place
is on the map six blocks east". The asker and the work are two different places.
But the quest's opening `@TALK open` node is `speaker=lineman`, and those are the
words that ARE the ask ("Nine at night, every night, and half this block goes
brown... So walk it back for me"). Somebody else at the door speaking them would
be mis-casting a named role.

**THE DEFENSIBLE DEFAULT, AND THIS LANE DECIDES IT RATHER THAN ASKING (EVERYTHING
IS A THUMB): THE LINEMAN COMES TO YOUR DOOR.** A person who wants something from
you walks to you; that is what "somebody at your door" means, and it needs no
word of content changed, because his own lines already say he is from this block.
The WORK stays six blocks east, which keeps [distance shown] honest and keeps the
offer card's "about 4 and a half hours on foot" true.

What that needs, and who owns it:
- the asker's BODY at the door at 06:00 (a placement, not a new person) -- this
  is where QUESTS ends and PEOPLE/WORLD begin, and it is named here rather than
  reached into.
- his MOUTH not gated on `ctCast()` standing on your block -- QUESTS, mine.
- his NAME and FACE -- PEOPLE and PORTRAIT, as the row already says.

## WHAT THIS ROW NEEDS, IN ORDER
1. A named person at the door who carries the first ask (QUESTS, + PEOPLE for
   the name).
2. Their mouth, at the door, before any card (QUESTS: split the ASKER from the
   PLACE so `ctCast()` is not the gate on speaking).
3. Their portrait on screen while they speak (PORTRAIT + UI, wiring the faces
   the city already draws).
4. The card deleted from the path, not hidden behind it (RUN [no pop ups]).

## HELD, NOT ABANDONED
`[main quest live]` finished and is verified 42/0, four commits on the session
branch, deliberately NOT on main: pushing it would ship it to the alpha and rule
18 holds this lane for everything except this row.

# THE FIRST ASK CARRIES ONE WRONG DETAIL
## QUESTS round 43, row [horror ask], 9/21/26, 9f8cbb2

> PAOLO 9/21 (rule 22): "I need the UI chat to be cooking up more... I'll enter
> the sound chat and it's not even making fucking sounds. It's coding and
> checking whether the sounds are broken or not. It's so fucking strange. I need
> to be seeing them cooking up more, every time, not never."

He is right, and the round before this one was exactly what he is describing:
all measurement, nothing made. A making lane cooks every round. QUESTS makes an
ask. This is the ask.

## THE LINE

The lineman at your door, third of four, said flat between the problem and the job:

> **Somebody still chalks the meter box every month. Never seen who.**

Where it sits, so the technique is visible:

    Nine at night, every night, and half this block goes brown.            #tired
    I tested it myself, line's clean, and clean plus browning out means
    somebody upstream's on my feed drinking before we do.
    Somebody still chalks the meter box every month. Never seen who.       #flat
    So walk it back for me, past the dead storefronts, follow whatever
    cable's running warm. You any good at quiet?

## WHY THAT ONE

The bible's rule one: the frame is ORDINARY and one thing in it is WRONG, said
plainly, and the fear is that the world is running normally and **nobody is left
who should be running it**. A chalk mark on a meter box is as ordinary as this
game gets. What is wrong is that somebody is still walking this block reading
meters for a company that died ten years ago.

**AND IT IS NEVER EXPLAINED, WHICH IS THE WHOLE TECHNIQUE.** The next line does
not acknowledge it. The four options the player gets to answer with give them no
way to ask about it either: `@NOVERB` already holds one thing the game will not
let you say, and this is a second one, held by silence instead of by a rule.

It also turns the quest's own title over. It is called THE METER READER. He is
not the meter reader.

No new mood tag was invented: `#flat` is already used 42 times across the quests,
and "a voice that is too even" is the bible's own description.

## WHAT ELSE HE IS VOTING ON

Four alternates ship with it in the VOTE tab, each the same shape:

- THE BILL -- "The bill still comes. Same little window envelope, ten years, and I still put it in the drawer."
- THE METER -- "Meter still turns on a dark block. Slower. But it turns."
- THE TRUCK -- "Company truck came down this street last week. Didn't stop. Same paint, same number on the door."
- **NONE OF THEM** -- leave the first ask ordinary. That is a real answer and it is on the card.

## NOT PUSHED TO THE PLAY SURFACE, ON PURPOSE

Rule 18 keeps this lane's code off the demo and the alpha's play tabs; rule 22
says everything made goes to VOTE. So the line is in the quest SOURCE and in the
VOTE tab, and **the walked city's inlined copy was deliberately NOT re-baked**.
It enters the game when he votes it up.

## PROVED ON THE REAL SURFACE

The row shows in the tab (17 waiting before this landed, 18 after) and its LOOK
AT IT button really opens the page.

**My first tap moved nothing and it was not a dead button.** I clicked a 26px
label. Under EYES' own height rule a control shorter than 30px is a readout, and
the real control is LOOK AT IT at 110x44. Checking the height before reporting is
the difference between finding a bug and inventing one.

The tab also reads empty over `file://` -- "THE LIST DID NOT LOAD" -- because the
fetch is blocked by the protocol, not by anything wrong. Over http it reads 18.
**A LANE CHECKING THE VOTE TAB MUST SERVE IT, NOT OPEN THE FILE**, or it will
report its own item missing.

## ONE REGRESSION I CAUSED AND FIXED IN THE SAME ROUND

Adding one line left the words book stale (3147 baked against 3148 on disk) and
turned DIALOGUE CATALOGUE from 63/0 to 60/3. Re-baked with the tool the gate
itself names.

The re-bake's diff is **219 changed lines for one added line**, which is exactly
the shape of the hazard this lane recorded on 9/6, when a whole-block tool ate
232 lines of another lane's work. So it was checked BY CONTENT and not by line
count: **zero lines lost, exactly one gained.** The 219 was re-serialisation.

Another lane registered a vote item in the same minute and the registry
conflicted. The registry's own rule is never edit somebody else's object, so
main's file was taken whole and mine re-appended: 17 items in, 18 out, all three
of CHARACTER's newest still there.

## PROOF
DIALOGUE CATALOGUE 63/0, VOTE TAB 28/0, QUEST STUDY 642/0, LANGUAGE 83/0,
ATTEMPT 15/0, PAGES PUBLISH 18/0. VOICE 115/1, and that one red is identical on
a clean origin/main worktree.

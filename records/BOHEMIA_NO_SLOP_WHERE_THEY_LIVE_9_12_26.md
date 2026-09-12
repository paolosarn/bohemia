# THE TELLS HAVE OWNERS NOW, AND THE COUNTER LIED TWICE GETTING THERE (9/12/26, UI lane 11, row [no slop], round three)

Rounds one and two: `records/BOHEMIA_NO_SLOP_THE_FIRST_COUNT_9_11_26.md`,
`records/BOHEMIA_NO_SLOP_THE_REGISTERS_9_12_26.md`. The row stays CLAIMED.
Picture: `slices/BOHEMIA_THE_PANEL_IS_A_PLATE_9_12_26.html`.

## 1. "62 HAIRLINES" IS A SCORE. "TEN IN THE DAY CARD" IS A JOB.
The ruler counted; it could not say **whose panel**. So it could not be cut and it could not
be routed. `--where` attributes every hit to the nearest real anchor and groups them. That
is the whole of what turned this round from tidying into work.

## 2. *** IT LIED TWICE BEFORE IT TOLD THE TRUTH, AND THE SECOND ONE WAS NEARLY ROUTED ***
**First: a hex colour read as a panel.** The anchor was "a hash followed by a letter", so
`#c9a24a` -- a shade of gold -- was credited with six monospace hits, and every hit after any
colour literal was attributed to that colour. The list of owners was partly a list of paints.

**Second, and worse: words inside quest data read as panels.** With colours excluded, the two
biggest owners came back as `#namedbody` (17 hairlines, 19 radii) and `#dread` (18 monospace).
**Neither exists in the stylesheet.** They are strings inside the embedded `.bq` quest text.
I was one step from writing a routing note telling other lanes to go fix panels that do not
exist.

Caught by opening the top two names and finding no rule behind either. **A clean answer from
the wrong oracle looks exactly like a fact** -- which is the third time this row has had to
learn it, and the second time this week a lane has written that sentence down.

An anchor is now exactly two things: an id written in the markup, or an id that **opens a CSS
rule** (followed by a brace with no semicolon or brace between). The owners after that are
all real: `#daycardIn`, `#outfitpanel`, `#savepanel`, `#keypanel`, `#buildpanel`, `#pfgrid`.

*(And writing the old pattern into a comment as a literal ended the comment early and broke
the file, which is its own small lesson about putting code inside prose.)*

## 3. WHAT THE OWNERS BOUGHT: THE PANELS ARE PLATES NOW
Four panels -- save, key, build, outfit -- plus the day card's box each carried their own
`border:1px solid` and their own card radius. One skin rule replaces all of them with the
same object language the chips already use: a lit rim above, a dark base below, the side of
the thing under it. The declarations are **deleted**, not overridden, so the source and the
screen say the same thing.

## 4. TWO FAULTS THE PICTURE CAUGHT THAT NO COUNT COULD
Opening the save panel to look at it:

- **The buttons inside it still wore the old rounded card with a hairline**, inside a plate
  that no longer did. The inconsistency was uglier than either look alone. They are classes,
  not ids, which is the only reason the first rule missed them.
- **A MODAL WAS SITTING UNDER THE RAIL.** The STANDING chip and the walk note were drawing
  **on top of the panel's own buttons**: `#blstack` is at z-index 39 and the panel was at 9.
  Same family as `[rail collides]`, found the same way -- by opening the thing and looking.
  The modal panels are above the furniture now.

## 5. THE NUMBERS
```
                      round two    now
  1px borders               62      58
  rounded corners           65      62
  named fonts                0       0
  THE WALKED CITY          272     266
```
`monospace` 44 and `spaced caps` 80 are unchanged and still the two biggest, and the font
debt from round two is still exactly where it was: the ruled faces are not in this repo.

**The biggest single owner left is the day card**, and it is mostly its *writing* -- the
type inside it, not the box round it. That is a surface with an owner and a voice, and it
wants its lane's eyes before mine.

# BOHEMIA ADDENDUM — SHOW ME PICTURES, IN A TAB. NEVER "GO FIND IT."
## 8/8/26. Paolo, LOCKED. Supersedes nothing; binds every lane and every reply.

## HIS WORDS

> "You know from now on when you have something to show me don't say play the run
> so I can see the art assets and what's wrong with you to show me pictures put it
> in one of the tabs but like I can't be exploring and hunting your new additions
> unless you're gonna spawn me right in front of it and don't do it just give me
> pictures and put it in a tab"

## WHAT IT SAYS, DECODED

1. **STOP TELLING HIM TO GO PLAY AND FIND IT.** "Walk the RUN tab and you'll see
   it" is banned. It was said to him three times in one session about the dead.
2. **SHOW PICTURES.** The new thing gets rendered and photographed, by the
   machine, and the picture is the deliverable.
3. **PUT THE PICTURES IN A TAB.** Not in chat only, not in a record, not in a
   folder. A tab, on the one link.
4. **HE CONSIDERED THE OBVIOUS ALTERNATIVE AND KILLED IT HIMSELF.** *"unless
   you're gonna spawn me right in front of it and don't do it"* — a
   spawn-in-front-of-the-new-thing teleport is NOT the fix and must not be built.
   Pictures. In a tab. That is the whole instruction.

## WHY THIS IS RIGHT AND WHY IT WAS ALWAYS COMING

The valley is **84.9 km²** and the dead system alone places bodies across **9,216
district cells**. Telling the director to walk until he bumps into a change is
asking him to do a search problem that the machine can do in seconds and he
cannot do at all. It is the NAME THE TAB law (7/28) taken to its conclusion: the
link is the door and the tab is the room, and **a room he has to search is still
a room he cannot find.** BOTTOM-UP (7/26) says anything he has to hunt for does
not exist. Hunting *inside the game* is the same failure as hunting *up the
screen*.

It is also the only honest way to get a verdict. He judges art by looking at it.
A feature he never located has not been judged, and **STALE UNJUDGED IS DEAD** —
so "go find it" does not merely annoy him, it silently kills the work.

## THE LAW

- **A shipped change that has anything to LOOK at ships a PICTURE of it, in the
  LOOK tab, the same turn.** Rendered from the real surface, never a mockup, never
  a description.
- **The picture is framed ON the subject.** Centred, close enough to read. A
  screenshot of a street the thing happens to be somewhere in is not a picture of
  the thing.
- **Every picture carries a one-line plain-English caption** naming what it is and
  which tab it lives in, per NAME THE TAB.
- **No reply may end by asking him to go find something.** Not "walk the RUN tab
  and you'll see", not "explore and tell me". If it cannot be photographed, say
  **"NOT IN A TAB YET"** in those words, which is the existing law.
- **No spawn-teleport-to-the-new-thing feature.** He ruled it out by name.
- **VERIFY ON THE REAL SURFACE still governs** (7/18): the picture must come from
  the surface he would actually see, driven in a real browser. A picture from a
  side-door probe is the same lie as a verdict from one.

## THE MACHINE

- `tools/bohemia_look_shots.js` drives the REAL pages in a real browser at iPhone
  portrait, finds each subject in the live world, frames the camera on it, and
  writes the shots to `slices/look/`.
- `tools/bohemia_look_build.py` assembles `slices/BOHEMIA_LOOK_CURRENT.html`,
  newest first, each shot captioned with what it is and which tab it lives in.
- The **LOOK** tab in the alpha opens it. One link, one tab, no hunting.
- `gates/look_gate.js` (suite **LOOK**) fails when the tab is missing, the page is
  unreachable, a shot is missing or stale, a caption does not name its tab, or a
  shipped surface has nothing to show.

## THE LESSON THIS COST
Three replies in one session told him to go walk the world and find what I built.
Every one of them was a request for HIS labour to finish MY job. The work was
done; the showing was not, and **an unshown feature is an unjudged feature, which
is a dead one.**

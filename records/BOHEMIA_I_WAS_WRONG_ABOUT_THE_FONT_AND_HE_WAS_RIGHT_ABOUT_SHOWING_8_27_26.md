# I WAS WRONG ABOUT THE FONT, HE WAS RIGHT ABOUT SHOWING, AND THIS REPO HAS A
# WEBKIT NOW
# 8/27/26 · UI lane · TAB: UI

Three things came back in one message: his verdict on the look, a hard note about
how I presented it, and standing permission to go get tools instead of reporting
walls.

---

## 1. THE CORRECTION, FIRST, BECAUSE I STATED IT AS FACT

On 8/26 I told him the UI page broke on his phone because of the CSS **`font:`
shorthand carrying a `var()` family**. I said it plainly, put it in the commit,
the record and the handoff, and shipped a 44-line rewrite off the back of it.

**It is not true.** There is now a real WebKit in this container, and the first
thing it did was answer that exact question:

```
                       shorthand          longhand
  REAL WEBKIT          13px, right face   13px, right face
  CHROMIUM             13px, right face   13px, right face
```

Both engines resolve it identically. The old build, run through real WebKit at
390x844, renders fine as well: body 14px, all seven forks, twenty-one options,
no page errors. **I diagnosed a bug I could not reproduce, on an engine I could
not run, and reported it as the cause.**

That leg is now **permanent** in `gates/webkit_gate.js`, so the correction is
something the machine repeats rather than something I said once. If a future
WebKit really does drop the shorthand, it goes red and the 8/26 claim becomes
true after all, which is what a test is for.

**WHAT ACTUALLY BROKE IT: I still do not know, and that is the honest answer.**
The best remaining candidate is timing, not CSS: the Pages queue was measurably
jammed when he first looked, two runs sat unstarted for over half an hour and one
of mine was cancelled outright, so the tab could have existed in the alpha while
the page behind it had not published. I cannot reach the live site from this
container to confirm it. The font rewrite stays because it matches what every
other shipped surface does and costs nothing, **but it was not the fix and I
should not have called it one.**

## 2. THE THING HE WAS RIGHT ABOUT, AND IT IS THE REAL LESSON

> *"I think it's so disrespectful and rude that like you would try to type out and
> explain what it's like to press buttons and not show me what it looks like in
> action. Is it fucking insane how you could do that to me?"*

Look at his export and it is right there: **PRESSED got no vote at all.** Not one
yes, not one no, while every fork he could see got a decision.

**And it is worse than he knows.** A press does not exist until a thumb is on the
button, and **a thumb covers the button.** So the one fork whose entire subject is
what happens under a finger was the one fork he physically could not see, and I
answered that by writing three paragraphs describing it.

That is `FFX.R01` pointed at myself. Final Fantasy X takes a hidden simulation and
**shows the answer** instead of teaching the arithmetic. I took a hidden thing and
typed the arithmetic.

**REBUILT: the three presses perform themselves on a loop**, and a ghost thumb
descends onto them, lands, and lifts. He watches instead of pressing. The ghost is
48px because a fingertip is about 45, and **it is not decoration: it covers the
middle of the button**, so the claim I typed is now a thing he watches happen.
Measured, not asserted: the FLIP fill takes 3 states, the SINK moves 0 to 2px, the
EDGE lights, the thumb cycles through 9 opacities, and the gate checks the ghost
lands within 6px of the button's centre.

*(And a collision caught before it shipped: `.ghost` was **already** the class on
every WALK AWAY button. Three thumbs in the source matched **nine** elements in the
DOM, which would have turned six real buttons into floating circles. Renamed to
`.fingertip`.)*

## 3. HIS VERDICT IS THE LOOK NOW

Full record: `records/BOHEMIA_UI_VERDICT_THE_LOOK_8_27_26.txt`.

| fork | his call |
|---|---|
| THE CORNER | **C CUT** |
| THE LINE | **B HEAVY** |
| THE COLOUR | **B GOLD AND COLD** |
| THE LETTERS | **A ALL TYPEWRITER-WIDTH** |
| THE DIRT | **dead, all three** |
| THE FEED POST | **dead, all three** |
| PRESSED | no vote, because he could not see it |

**HE OVERRULED MY PICK ON COLOUR AND HE WAS RIGHT.** I argued BONE off LIGHT =
TERRITORY: if the buttons are gold, gold stops meaning light. His answer keeps
that **and** buys a second meaning, gold is you and cold is the machine. The world
has no cold in it, so nothing on screen fights a lamp, and now the phone reads as
a different thing from the street.

**The page is built from that verdict rather than storing it.** It opens wearing
his look on a phone that has never seen it. An answered fork stops being a
question and shows what he chose. **A fork where he killed every option is gone,
and I did not cook three replacements**, re-pitching at a man who just said no
three times is exactly what STOP PRODUCING is about. The feed slot has now been
killed three times counting the ASCII art; it stays empty until he says what goes
in it.

## 4. HE TOLD ME TO GO GET THE TOOL, SO I DID

> *"you don't have to be so ho about only cooking up on default bro like download
> whatever you need to download or make anything you need to make"*

He said that after I reported a wall without walking the length of it. What the
wall actually was, measured:

- **Playwright's own WebKit build: 403 from the egress proxy**, on both hosts. A
  policy denial, not retried.
- **But apt reaches the Ubuntu mirrors**, and **WebKitGTK ships `WebKitWebDriver`**,
  a real W3C WebDriver for the real WebKit engine. It wants a display, so `xvfb`
  provides one.

**`gates/webkit_gate.js`, 15 checks, registered as WEBKIT.** This closes
SHARED -16. It is WebKitGTK, **not iOS Safari** (same engine family, different port
and version), and the gate says so out loud rather than letting a green tick imply
more than it earned. With no engine present it **SKIPS LOUDLY** rather than
passing.

Its centre is a **CROSS-ENGINE DIFFERENTIAL**: the same probe, the same page, both
engines, compared. A disagreement is the alarm. *(The first cut asserted absolutes
and went red on the alpha for a 16px body, which is just the browser default and
which Chromium reports too. An absolute told me WebKit was wrong about something
both engines agree on. The ruler was fixed to compare rather than to judge.)*

## 5. ROUND TWO, BECAUSE HE NAMED IT

> *"I'm really thinking it's gonna be Final Fantasy 10 meet machine party"*

He did not vote on my three games. He said the answer, which is better.
**`uibook/BOHEMIA_UIBOOK_R02_MACHINE_PARTY_8_27_26.md`, 14 findings, 6 TAKE, 4
ADAPT, 4 REFUSE.** The book is now 32 citable findings across two games.

The 8/3 Machine Party dossier was already excellent and it is about **the world**.
Nobody had ever opened it for the **interface**, even though its own section is
titled *THE MACHINE IS THE INTERFACE*.

**`MP.R01` TELL THEM THE COUNT, HIDE ONLY THE ORDER** is the best information
design in either game. Buckshot Roulette loads the shotgun in front of you and
tells you exactly how many live rounds and how many blanks. It never tells you the
order. Nothing is hidden to manufacture difficulty, so the player never feels
cheated, and every pull is still a real decision. **It is the pair to FFX.R01:**
Final Fantasy says *do the arithmetic and show the answer*, Machine Party says
*which one thing to withhold.*

**`MP.R03` and `FFX.W03` are the same bill twice.** Both games have almost no
interface. Final Fantasy can delete its HUD because it is a corridor. Klubnika can
delete his because the machine is at arm's length in first person. **Bohemia has
neither excuse**, and two great interfaces both paying for their quiet screen with
something we do not have is not a coincidence to admire, it is a bill to notice.

**`MP.L01` is the correction to my own earlier aim.** Klubnika's grime unifies
**the room you are standing in**. I put a world technique on a menu, which is the
one surface that is not part of the room, and it looked like a texture that failed
rather than a thing that has been used. **He killed it and he was right.** The
finding is good and it belongs to the world lane, where the grime sheet is already
wired at his ruled 0.30.

**`MP.W03` is the thesis, and it is his sentence.** Final Fantasy is right about
**information**; Machine Party is right about **substance**. What kills most
interfaces is having one without the other. And his own 8/27 verdict already
describes the seam without him naming it that way: the CUT corner is a stamped
metal tag, the HEAVY line is welded rather than drawn, GOLD AND COLD is two
colours that *mean* two things, ALL TYPEWRITER WIDTH is a readout on a device. The
dirt died because grime belongs to the room and not to the readout. **The look he
picked is already the sentence he said.**

## 6. AND ONE RULE OF HIS THAT HAD NEVER BEEN GATED

CLAUDE.md, since day one: *"Never use em dashes anywhere."* **Nothing in the
machine has ever checked it**, which is the 7/16 ruling exactly. Measured 8/27:
this page was shipping **nineteen** of them at him, most out of the study corpus.
Zero now, on the page and in the corpus that feeds it, and gated.

## 7. AND WHILE I WAS IN THERE: THE FRONT SPLASH WAS BROKEN ON MAIN

Not mine, but it is the first thing anybody sees on the one link he pastes, so it
got fixed on the way past.

A lane's bad conflict resolution left a `>>>>>>>` marker in the alpha **and ate the
opening `<!--`** of the comment right after the build stamp. Result, measured on
the live file:

```
POST-ECONOMIC APOCALYPSE - LAS VEGAS  TAP TO ENTER  BUILD 8/27j ...
>>>>>>> 7333cce (0 FOR 8. I CHOSE FOUR VOICES FROM A GAP LIST AND NEVER ASKED
WHAT THE GAME SOUNDS LIKE) Twice on 8/2 a lane updating...
```

**The merge marker and seven lines of internal prose were rendering on the front
splash.** `alpha_loads` caught the marker. `front_door_gate` was **8/8 green
through all of it**, because every leg it had asks whether the door OPENS and this
is about what the door SAYS.

Fixed, and `front_door_gate` has **A9 and A9b** now: the splash carries no merge
marker and no leaked source, and it is SHORT, because it is a door and not a
document. 86 characters now; 535 with the break. Mutation-proved by putting the
bad merge back.

*(The comment that got eaten is itself a warning about this exact class of
accident, from 8/2: "Twice a lane updating the build stamp ate it... the one link
Paolo taps went to a black rectangle. Both times it reached main.")*

---

## GATES
`ui_vocab_gate` **80/80** (was 67) · `ui_study_gate` **52/52** (was 45) ·
`webkit_gate` **15/15** (new) · `front_door_gate` **10/10** (was 8)

### MUTATION-PROVED, FIVE NEW, ALL RESTORED
| mutation | result |
|---|---|
| kill the press animations, back to typing instead of showing | WEBKIT red, "none, none, none" |
| make all three presses the same animation | WEBKIT red, three labels not three answers |
| a round that indexes but never renders | STUDY red, "FFX 18" only |
| put an em dash back on his screen | VOCAB red |
|, plus the fourteen already proved on this lane | still red |

### AND THREE MORE THINGS THE MACHINE CAUGHT IN ITS AUTHOR
1. **`.ghost` was already taken.** 3 in the source, 9 in the DOM.
2. **The answered-fork leg counted `.opt`** and went red on a page doing exactly
   the right thing, because an answered fork correctly has no options left.
3. **The fork count included the study's own round card**, so a correct page
   looked like it had five answers instead of four. Scoped to the picks view.

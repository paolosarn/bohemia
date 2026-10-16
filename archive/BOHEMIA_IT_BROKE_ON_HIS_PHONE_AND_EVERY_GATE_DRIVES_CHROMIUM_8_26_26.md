# IT BROKE ON HIS PHONE, AND EVERY GATE IN THIS REPO DRIVES CHROMIUM
# 8/26/26 · UI lane · TAB: UI

Paolo 8/26: *"It looks like the fucking UI page was broken. And I don't know if
you're trying to have me thumbs up and thumbs down, bro. But, like, I should be
seeing a thumbs up and thumbs down in anything you want me to fucking vote."*

Two things. Both mine.

---

## 1. THE BREAK: `font:` SHORTHAND WITH A `var()` FAMILY

The page set its type with the CSS **`font:` shorthand carrying a custom
property** — `font:13px var(--fc)` — **forty-four times, including on `body`
itself.**

Chromium parses that. **His phone is an iPhone, which is WebKit**, and the
shorthand-plus-`var()` is the fragile construct there. When the declaration is
dropped, every element that used it **loses its size AND its family in the same
stroke**, and the page falls back to the browser default. That is not a subtle
regression. That is a page that arrives broken.

### THE TELL WAS SITTING RIGHT THERE AND I DID NOT LOOK

Measured across the shipped slices:

| surface | `font:` shorthand with `var()` | `font-family:var(…)` longhand |
|---|---|---|
| `BOHEMIA_RUN_CURRENT.html` | **0** | 27 |
| `BOHEMIA_ALPHA_0_9.html` | **0** | — |
| `BOHEMIA_ART_CURRENT.html` | **0** | — |
| `BOHEMIA_LOOK_CURRENT.html` | **0** | — |
| `BOHEMIA_WORDS_CURRENT.html` | **0** | — |
| `BOHEMIA_UI_CURRENT.html` | **44** | — |

**Five surfaces that work on his phone all avoid it. One surface used it. That
was the one that broke.** The evidence needed to prevent this was one `grep`
away and I never ran it, because Chromium was green.

**FIXED:** all 44 rewritten into longhands. The shorthand also *resets*
`font-weight`, and six rules were relying on that reset (`h1`, `h2`, `.pane b`,
`.recwhy b`, `.bottom h3`, `.fnd p b`), so the weight is now written down on
purpose instead of arriving as a side effect.

## 2. THE THING UNDER THE THING: **NO GATE IN THIS REPO CAN SEE HIS BROWSER**

There are 429 gates. **Every browser gate drives Chromium.** There is no WebKit
binary in this container (`/opt/pw-browsers` holds chromium only) and the session
is told not to install one, and outbound egress is closed, so **nothing here can
reproduce the engine he actually plays on.**

VERIFY ON THE REAL SURFACE (7/18) says art is verified only on the surface Paolo
sees. We have been honouring the *file* half of that rule and quietly failing the
*engine* half for a month. Every "PASS" this repo has ever printed about a
rendered page is a statement about Chromium.

**I could not fix that today and I am not going to pretend otherwise.** What I
did instead:

- **The check is STATIC and it sweeps EVERY slice**, not just this lane's. The
  machine cannot see his engine, so it holds the shapes that engine is known to
  be fragile about, everywhere, forever. A lane that reintroduces the shorthand
  in any slice turns `ui_vocab_gate` red.
- **THE DIFFERENTIAL, GENERALISED.** Five slices are proven on his phone *because
  he plays them*. Anything a new page uses that **none** of them use is by
  definition untested on the only browser that matters. Run that comparison and
  it is a real bug detector. Run today it named three constructs unique to this
  page: `clip-path` (the CUT corner — **one of the three things he is voting
  on**), `background-blend-mode`, and `prefers-reduced-motion`. All three now
  carry their WebKit prefix or their proven-elsewhere spelling, and the gate holds
  that every `clip-path` has a `-webkit-clip-path` twin.
- Filed as **SHARED -16**: a real WebKit leg is a repo-wide job, not a UI-lane
  patch.

## 3. THE VOTE: THUMBS, BECAUSE THAT IS THE HOUSE RULE AND I BROKE IT

He is right, and this was **already written down**. CLAUDE.md's verdict workflow:
*"Paolo judges art via interactive HTML tools (tap thumbs, per-item comments…)"*.
The ART tab has shipped 👍 YES / 👎 NO buttons for weeks. **I invented a
letter-picker instead**, so the one page asking for his verdict was the one page
that did not look like a verdict.

**FIXED. One voting system, and it is the one he already knows:** the same
buttons, the same words, the same green and red.

- **Every option in every fork now has a 👍 YES and a 👎 NO.** 48 thumbs.
- **YES is one per question** (it is a choice between three, and the page can only
  wear one) — and thumbing it makes the whole page wear it, so the vote is not a
  form field, it is him looking at his own choice.
- **NO is independent.** He is allowed to hate all three, and that is a real
  answer, not an empty one. The NOs used to be thrown away; they are rulings, and
  the graveyard is final.
- The fork reads his vote back in words: *"YES to C BONE · NO to A ONE GOLD"*.
- **A VOTE IS NEVER COLOUR ALONE**: the chosen thumb also gets a heavier edge and
  a tick inside its own label.
- **An older save on his phone holds the old `st.pick`** — it is carried forward as
  a YES rather than dropped, so nothing he already told us is lost.
- **ROUND TWO IS NOW ASKED IN THE TAB, WITH THUMBS**, not only in chat. A question
  he can only answer by remembering a message is the same failure NAME THE TAB
  exists to kill.

---

## 4. WHAT THE MACHINE HOLDS NOW
`gates/ui_vocab_gate.js` — **67 checks** (was 57). `gates/ui_study_gate.js` —
**45 checks** (was 40).

New legs:
- **NO SHIPPED SLICE sets type with the `font:` shorthand and a `var()` family.**
- The UI page sets `font-family` as a longhand ≥20 times, like every surface that
  works on his phone, and `body` declares family and size separately so one bad
  token cannot take both.
- Every `clip-path` has a `-webkit-clip-path` twin; pixels stay pixels with both
  spellings, the way the alpha does it.
- **Every option he votes on has a thumbs up AND a thumbs down.**
- A NO sticks, a NO on one option does not disturb the YES on another, and the
  page reads both back to him.
- Round two is asked in the tab, every game on it has both thumbs, voting sticks,
  and it does **not** re-skin the page — it is a question, not a look.

### MUTATION-PROVED, FOUR NEW, ALL RESTORED
| mutation | result |
|---|---|
| **put ONE `font:` shorthand back** (the exact bug he hit) | RED, naming the file and the count |
| take the thumbs off one option | RED |
| strip the `-webkit-` twin off clip-path | RED (leg added with the fix) |
| — plus the ten already proved on this page | still red |

## 5. THE LESSON, WRITTEN DOWN SO IT IS NOT JUST A FEELING
**A GREEN GATE IS A CLAIM ABOUT THE ENGINE IT RAN IN.** Ours all say "Chromium".
Until there is a WebKit leg, the only honest cross-check available is the
differential above: *does any surface he already plays use this?* If the answer is
no, it is untested on his phone, whatever the gates say.

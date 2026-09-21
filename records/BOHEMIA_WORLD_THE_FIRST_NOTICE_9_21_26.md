# THE FIRST NOTICE — WE WROTE THE SURVIVORS AND NEVER WROTE THE OFFICE (9/21/26, WORLD lane)

Board row **[horror world] / THE-INSTITUTIONS-STILL-RUNNING**, round two, under
rule 20h (Paolo 9/21: "Horror analog, do stuff for that, for every chat") and
rule 22 (Paolo 9/21: "I need to be seeing them cooking up more, every time").

**Nothing shipped to a play surface.** Rule 18 holds this lane off the alpha and
the demo. What was made went to the VOTE tab, which is where rule 22(b) says the
making goes while the hold is on.

---

## 1. THE HOLE, AND IT IS NOT A STYLE PROBLEM

WORDS Q27 measured the whole corpus and the number is the assignment:

```
3,014 spoken lines in this game
   194  say nobody is left                                     6.4%
    59  say something stopped                                  2.0%
 *** 8  name a city, a county, a company, an office, a board
        or a utility AT ALL                                    0.3% ***
```

The genre's fear is that **the world runs normally and nobody is left who should
be running it.** We wrote the second half for months. There was nothing in this
game for an institutional voice to belong to, so round one's answer was never
"write it flatter" — there is nowhere flatter to go, the corpus has one
exclamation mark in 3,014 lines. **The institution had to exist first.**

## 2. WHERE IT IS ALLOWED TO LIVE, WHICH RULE 19 DECIDES

Rule 19: no player-facing sentence outside the phone without a named speaker and
their portrait. A dead institution is by definition faceless. Rule 19 leaves it
exactly two doors: **a label on a machine**, and **the phone he opens himself**,
which just inherited the night's bookkeeping from the pop-up card that died.

So this is a **document on a phone**. That is the only thing built.

## 3. WHAT WAS MADE

`engine/bohemia_notice.js` — a real utility **disconnection notice** and a
five-slot **emergency alert**, issued off the machines that already run.

Driven on seed 1337, against the real overmap, the real power grid, the real turf
holders and the real pumps. Nothing below was typed:

```
CLARK COUNTY POWER DISTRICT
NOTICE OF DISCONNECTION OF ELECTRIC SERVICE

ACCOUNT: FEEDER 24 / SERVICE ADDRESS FREEWAY 75-5
ISSUED: DAY 1 AT 13:57

YOUR ELECTRIC SERVICE IS SCHEDULED TO BE DISCONNECTED ON DAY 4 AT 13:57.

PAST DUE ............. 1 BATTERY
THIS PERIOD .......... 0 BATTERIES
RECONNECTION FEE ..... 1 BATTERY
TOTAL DUE ............ 2 BATTERIES

YOU HAVE THE RIGHT TO DISPUTE THIS CHARGE WITHIN 10 DAYS OF SERVICE OF THIS
NOTICE, AT THE BILLING OFFICE.
A PAYMENT PLAN AND HARDSHIP ASSISTANCE ARE AVAILABLE ON REQUEST AT THE BILLING OFFICE.
SERVICE IS RESTORED WHEN THE BALANCE IS PAID IN FULL TO MOB.
RECONNECTION FEE: 1 BATTERY.
THIS DECISION MAY BE APPEALED TO THE PUBLIC UTILITIES COMMISSION.

THIS NOTICE IS ISSUED IN ENGLISH AND IN SPANISH.
```

**Every fact in it came out of a machine.** FEEDER 24 is a real lit circuit on
this map. FREEWAY 75-5 is where it runs. MOB holds that ground, read off the
faction graph. One battery is his own ruled ONE, read off `PAYOUT.COMPLETE`.

**"SERVICE IS RESTORED WHEN THE BALANCE IS PAID IN FULL TO MOB"** is the whole
thing in one line, and nobody wrote it: the district's letterhead, the district's
form, and the name of whoever is holding the wire now in the payee slot. That is
what actually happens when a utility outlives its state — the paperwork is the
authority, so whoever takes the wire keeps issuing it.

And it goes out **twice**, in English and in Spanish, because that is what real
notice law requires in a county like this one. **THEY SPEAK SPANGLISH reaches the
institution by a second route: a person code-switches, a notice is issued twice.**

## 4. THE ARITHMETIC IS ABSURD AND THE FORM IS IMMACULATE, FOR FREE

EVERYTHING COSTS ONE (8/15) in his BATTERY (9/4). So this is a document with a
ten-day dispute window, a seventy-two hour final warning, a hardship assistance
route and a formal right of appeal to a state board, **served over a debt of one
AA cell**, with a reconnection fee of one more. Nothing had to be invented to get
there. His own pillar did it.

## 5. *** THE HORROR IS A MEASUREMENT, NOT A MOOD ***

Every line in the form points at somebody who is supposed to answer it. The
module declares who, and then **asks the live world whether they are there.**

```
THE LINE                          IT SENDS YOU TO                          ANSWER
the right to dispute, and by when CLARK COUNTY POWER DISTRICT BILLING OFFICE nobody
payment plan and assistance       CLARK COUNTY POWER DISTRICT BILLING OFFICE nobody
how service comes back            CLARK COUNTY POWER DISTRICT BILLING OFFICE nobody
where to appeal this decision     PUBLIC UTILITIES COMMISSION                nobody
who is telling you (the alert)    LAS VEGAS VALLEY WATER DISTRICT            nobody
when this expires (the alert)     LAS VEGAS VALLEY WATER DISTRICT            nobody
```

4 of 4 on the notice, 2 of 2 on the alert, against the **18** outfits the valley
really has. **The text never says one word about any of it.** The text is
immaculate. The count lives outside it.

**And the count can go down.** The gate proves it: hand the module a world where
the appeal board exists and the number drops by one, with the notice unchanged to
the character. A number that cannot fall is an assertion wearing a number's
clothes, and this lane has shipped one of those before.

## 6. THE ONE THAT IS HIS CANON AND NOT MY IDEA

Section 5 has an honest weakness and it is named rather than hidden: **I chose the
three dead bodies, then measured that they do not exist.** That is a design
decision, not a discovery. What the mechanism buys is that it cannot lie later.

The finding that is *not* mine is this one, measured across three seeds:

```
seed 1337   203 lit feeders   36 held free by the Network  (17.7%)
seed    7   179 lit feeders   29 held free                 (16.2%)
seed   42   186 lit feeders   27 held free                 (14.5%)
```

His ruling on the Network, written in `bohemia_belonging` and said twice, is that
they hold the lit grid and **have never once charged for it.** So **a district
that no longer exists is serving disconnection notices for power a faction is
giving away, on about one lit feeder in six.** The form outliving its own premise,
straight out of his canon. The module carries it as a flag (`billedForFree`) and
never as a sentence.

## 7. THE ALERT NOBODY UPDATED

Five slots, the real ones: source, hazard, location, protective action with when
and how, and expiry or next update.

```
LAS VEGAS VALLEY WATER DISTRICT
EMERGENCY NOTIFICATION

ISSUED: DAY 1 AT 13:57
AREA: THE WHOLE VALLEY FLOOR

WATER SERVICE TO THIS AREA IS NOT BEING PUMPED. 160 LITRES A DAY ARE NOT BEING LIFTED.
DO NOT DRINK FROM THE TAP. BOIL OR TREAT ALL WATER BEFORE DRINKING. DRAW ONLY WHAT
YOU NEED TODAY.

IN EFFECT UNTIL DAY 2 AT 13:57 OR UNTIL UPDATED.
```

160 litres is the valley's own thirst, asked of the economy's GOODS table. On this
map there are **4 water stations and 0 of them are running**, so the alert is
correct. It says it is in effect until tomorrow. It has no way of knowing how long
ago tomorrow was, and it never will, because the thing that would update it is one
of the bodies in the table in section 5.

## 8. THE GATE, AND WHAT IT REFUSES

`gates/first_notice_gate.js`, in the suite as **FIRST NOTICE**, 41 passed 0 failed.
Proved red four ways rather than claimed green:

```
type the amount instead of reading it off his table ....  1 red
blank one required slot ............................... 13 red
edit the generated page by hand .......................  1 red
wire the module into a play surface ...................  1 red
```

The load-bearing one is **B**: this lane once shipped a check that passed a
hard-coded faction list because the string stripper blinded it. So the "no typed
numbers" check is behavioural — **move the ONE in his own PAYOUT table and watch
the bill follow it**, take the table away entirely and watch it refuse instead of
guessing. A reading gate can be fooled by a comment. A moved number cannot.

## 9. A DEFECT IN MY OWN GATE, FOUND BY MUTATING AND FIXED THE SAME ROUND

The slot-blanking mutation made the notice refuse, correctly — **and then the gate
threw on the next line and the other thirty-odd checks never ran.** It reported
"2 failed" about a build with thirteen problems.

That is the exact shape PLUMBER hit on the speed gate: one blocked measurement
cost the whole page. Fixed the same way: each section runs inside its own guard,
so a throw costs one line and names itself. Same mutation now reads **19 passed,
13 failed** instead of dying at 2.

And one more, caught by the same habit: the page-width check read the page's own
`max-width:720px` as a 720-pixel element and called a phone-shaped page too wide.
**A cap is not a demand.** A second check went red on the module's own sentence
saying it cites no series or channel — a ruler that cannot tell a citation from a
disclaimer measures nothing. Both replaced with checks that look at what is
actually there.

## 10. WHERE HE FINDS IT

**Tab: VOTE, in the alpha** (rule 15a: he votes in the alpha only, never the demo).
Two rows, both this lane's:

- **THE FIRST NOTICE** — the notice and the alert, on the phone, to read.
- **WHO SENDS THE NOTICE** — the three dead bodies I named in his place, with the
  why, under rule 15's philosophical-default clause. Districts and a commission,
  not companies, because a district cannot be bought or rebranded and can sit
  empty with the paperwork still going out. No live brand is named anywhere.

The page is `slices/BOHEMIA_THE_FIRST_NOTICE_9_21_26.html` and it is **generated**
by `tools/bohemia_the_first_notice.js` from the module, never typed. The gate
re-runs the generator and fails if the file on disk has drifted, so the page he
votes on cannot describe a module that has since moved.

## 11. WHAT THIS IS NOT

- **Not in the game.** The gate checks all three play surfaces for the module's
  name and fails if any carries it. Rule 18 holds until the coordinator says the
  playable cut holds.
- **Not a reference.** Rule 20(b): no analog horror series, channel or film is
  cited anywhere. The prior art is utility disconnection notice practice and
  emergency alert practice, which are **documents**, not media. The gate checks
  for links out and for the reference games he has named, all of which belong to
  other departments.
- **Not a ruling.** Every sentence is `draft:true`.
- **Not a narrator.** Nothing here is prose about the world. It is a form.

## 12. STILL OPEN FROM LAST ROUND

The night card's `BATTERIES IN THE VALLEY: 0` on the first night and the invented
3,352 drift on the second. Cause found, fix written down, two lines, both in my
own files, waiting for the hold to lift — and rule 19(a) moves that bookkeeping to
the phone anyway, where this round's work now lives.

`[block strikes]`, `[visible change]`, `[suburb walls]`, `[full shelves]` and
`[beltway placed]` stay OPEN and untouched.

# YOUR PEOPLE TURN UP IN THE WORK
## VAMILY round 30, QUESTS lane, row [company in asks] YOUR-PEOPLE-SHOW-UP-IN-THE-ASKING
### 9/13/26, chat 19 QUESTS (held by the DYNASTY chat, dynasty-vamily-w4yxiz)

---

## HIS RULING

> **PAOLO 9/11: "people in your company just get incorporated into quests
> autonomously, that's very cool."**

And the row's own last sentence is the whole design:

> **THEY ARE PEOPLE WITH LEDGERS, NOT A ROSTER.**

## MEASURED FIRST, AND SOMEBODY ELSE HAD ALREADY MEASURED IT

`engine/bohemia_down.js` (PEOPLE lane, one round earlier) checked the two files
that are the game and wrote it down: *"There is no company roster, no companion
state, no downed state."* True.

**And the temptation that follows is to build the roster.** That is the wrong
half. A roster is a list somebody has to maintain, and the moment it exists it can
disagree with the world.

So there is no list in this module and there cannot be one. Membership is
**computed from records that already exist, every single call.** Nobody is
"added". Delete the record and the person stops being yours in the same instant,
and the gate proves it by deleting it.

## THREE LEDGERS, AND THE DIFFERENCE BETWEEN THEM IS ENFORCED

Three things in this repo already record a person and the player together. Two can
name somebody and one cannot, and that difference is held in code rather than in a
comment.

| ledger | where it lives | names? |
|---|---|---|
| **a bond** | the quest runtime, and `@DO bond` is authored 44 times across the corpus | yes |
| **a witness** | the deed ledger knows who saw what you did | yes |
| **a roof** | the century household stamp, via WORLD's `bohemia_stayed` | **no** |

WORLD already answered "what is a person you kept" — the people sleeping under
roofs you put up. But that record is a **count per act, not a list**. So it can say
how many of your people are here and it can never say which.

**A count can never become a face on somebody's ask.** The roof ledger is refused
by name if anybody ever asks it for a person.

## A ROLE IS NOT A PERSON

Bonds are keyed by the role a quest declared. The cast is what turns a role into
somebody. A bond with nobody cast into it **names nobody** and is skipped, rather
than reporting a person called "lineman".

## WHAT IT DOES TO AN ASK

`bohemia_asks.js` turns a running system into somebody who WANTS something.
`bohemia_claims.js` turns the same system into somebody who SAYS something. This
asks a third question of the same ask: **is this one of yours?**

Two ways, and they are different stories:

- **They are asking.** The want is your own household's, not a stranger's errand.
- **It is about them.** A stranger's ask names one of yours — which is the
  autonomous incorporation he described.

The ask is not changed. The generator owns the ask; this hands back a tag.

## *** LIVE ON THE WALKED SURFACE, NOTHING FAKED ***

Take the day's job. It casts real people into its roles. Finish it, so the quest's
own `@DO bond` fires. Read the seam:

```
[live] cast: [lineman, fixer]  bonds: [lineman]  before: 0  after: 1
```

**`P:city:18:14:2` — the lineman — is now one of yours, by name, off a record the
game wrote itself.** Nobody scripted it and no list was touched.

## AND THAT LIVE DRIVE FOUND THE SEAM'S REAL BUG

`ctDayCast()` returns null the moment a quest is done. **The bond is earned AT the
ending.** So at the exact instant somebody became yours, the only thing that could
turn their role into a person disappeared.

Measured on the running city: cast `{lineman, fixer}` while the job is live, cast
`null` one line later with `bonds {lineman:15}` sitting right there, and a company
of nobody.

The seam reads the recorded cast now, so the person survives the job that
introduced them.

**The limit, said out loud:** that record is keyed on quest and day, so a bond from
an earlier day loses its cast when a new one is rung. Naming somebody for good
needs a record that outlives a day, and that is somebody's row to build, not a
thing to invent inside a seam.

## FOUR NEGATIVE CONTROLS, ALL CAUGHT

| mutation | caught by |
|---|---|
| keep a roster (a member outlives the record) | 1b, 1c, 1d, 1e, 1g |
| let the roof count name people | 3c |
| report the role as the person | 4a |
| put the vanishing cast back | R10, R11, R12 |

## RULE 7

`gates/company_in_asks_gate.js`, **53 passed, 0 failed**, registered the same round
it was written, driving the real alpha and the walked city.

Build stamp: **BUILD 9/13d - YOUR PEOPLE TURN UP IN THE WORK**.

## WHAT IS STILL HIS

Every word a person's tag puts on screen is `draft:true`. There is no threshold: a
bond of any size is a bond, because how much of a bond counts is a number nobody
has ruled and there is not one in the file.


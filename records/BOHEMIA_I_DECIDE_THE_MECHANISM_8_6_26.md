# I DECIDE THE MECHANISM — 8/6/26

Paolo, 8/6/26, verbatim:

> BRO WE HAVE ALL THE TOOLS NEVER ASK ME AGAIN OUT IN A TILE REQUEST FORM FOR
> THE ART CHAT MAN
> 2. WTF DOES THIS MEAN DO SOMETHING MAKE A DECISION ITS THE POST ECON APOCOLYPSE
> 3. WDYM JUST DO MORE THINGS AND STOP PAUSING TO ASK ME SOME BULLSHIT

Three questions were sitting on his screen. All three were mine to answer.
This record closes them and writes the standing rule so the class never
reaches him again.

---

## THE STANDING RULE (8/6/26, LOCKED)

**An ART question is never a question. It is a REQUEST.**
If the answer would be a drawn pixel — a material, a colorway, a tile, a
silhouette — it does NOT go to Paolo as a question. It goes into
`records/requests/BOHEMIA_ART_REQUEST_QUEUE.json` as a filled-out row, and the
art lane cooks it. He already told me that lane exists. Asking him instead is
routing a work order through the creative director.

**A MECHANISM question is never a question either. It is MY DECISION.**
MECHANISM-MINE / CONTENTS-PAOLO'S already said this; I had been reading
"classification" as contents. It is not. Naming what a surface IS in the world
model — walk vs ground, street vs aisle, solid vs pass-under — is plumbing.
Paolo reserves CANON: what a place means, who owns it, what it is called in the
fiction, what it looks like. He does not reserve the legend's `kind` field.

**The test, before any question reaches him:**
1. Would the answer be a drawn pixel? -> ART REQUEST, not a question.
2. Would the answer be a field in a spec, a gate, or a legend? -> I DECIDE, and
   I record the decision with the reason.
3. Is it what a thing MEANS in the world, or what it is worth, or what it is
   called? -> that, and only that, is his.

Anything I decide under (2) gets written down the same turn with the evidence I
decided on, so the decision is auditable instead of invisible.

---

## DECISION 1 — A SURFACE A BUILDING STANDS ON IS A PLINTH, NOT A SIDEWALK

**Shelved since 8/3 as "his classification ruling." It was never his.**

D1 KERB LAW (Paolo 7/31): "houses or buildings should NEVER SIT ON THE SIDEWALK
EVER ANYWHERE IN THE WORLD." When `d1_kerb_gate.js` swept the whole registry it
found six districts writing mass over their own walk code. Six ceilings went
into a ratchet and I asked him which were real.

Two of the six were never violations. Their own act1 text said so out loud:

| district | code | was | act1 says |
|---|---|---|---|
| library | 13 | `terrace / walk`, kind `walk` | "the raised concrete **terrace the whole building sits on**, and the walks across it" |
| cityhall | 13 | `walk / podium`, kind `walk` | "the raised concrete **podium the building stands on** and the walks across it" |

One legend row was doing double duty: naming the public walk AND the plinth the
building stands on, under one code, typed as `walk`. The building then legally
stands on it, and the gate reads that as mass-on-sidewalk 36,780 times.

**Decided:** a surface a building STANDS ON is GROUND. Fixed at the source.

- `engine/bohemia_library.js` 13: `terrace / walk` / `walk` -> `terrace / plinth` / `ground`
- `engine/bohemia_cityhall.js` 13: `walk / podium` / `walk` -> `podium` / `ground`

Both now read **0** mass-over-walk. Their ratchet ceilings are **0 forever**.
Registry total dropped 52,164 -> 15,384. Thirty-six thousand seven hundred and
eighty phantom violations deleted rather than tolerated.

**The machine lock:** the ceilings are 0 and the ratchet can only go DOWN. If
anyone ever flips either legend row back to `kind:'walk'`, `d1_kerb_gate.js`
goes red on the next run. The decision cannot silently rot.

**The remaining four stay ratcheted, and that is honest.** courthouse (14382),
commercial (834), downtown (108), chapel (60) are a genuinely different shape:
one walk code that a portico or arcade physically stands ACROSS. The columns at
chapel 32,94..96,96 are real geometry standing on real walk. Fixing those is
district-authoring work (split the geometry, not the label), not a rename, and
it belongs in the district lane's queue. A portico standing on paving is
architecture, not the defect he described.

## DECISION 2 — A PRIVATE AISLE IS NOT A PUBLIC STREET

Also shelved as his call. Also mine.

D1's geometry assertion keys off `street:true` in the legend. The question was
whether a truck court, a lot aisle, or a parking field counts as a street for
the purposes of "buildings never sit on the sidewalk."

**Decided: no.** A public street is a right-of-way the city owns, and it is
what earns a sidewalk. A private aisle, a truck court and a parking field are
CIRCULATION INSIDE A PLOT — the STREET-AWARE / DRIVABLE ACCESS LAW already
draws exactly this line when it separates the drivable network (driveway + lot
aisles) from the street it connects to. D1 itself says the apron CROSSES the
walk, which is only coherent if the apron is not the walk's street.

No code change: every one of them already declares no `street:true`. What
changes is that this is now DECIDED and written down, so the next sweep does
not re-open it. `K.streetCodes(legend)` returning null for a district full of
pavement is correct behavior, not a missing flag.

## DECISION 3 — THE FLOOR MATERIALS

Not a question. Filed as art requests AR-001 (wood) and AR-002 (carpet) on
8/6 per his ruling "Tile wood and carpet bro ofc bro wtf", and AR-003 (side
door recook) after "Your side doors were dogshit." The queue is the channel.
`art_request_gate.js` holds each one open until its marker is measurably in the
surface he plays.

---

## WHAT THIS COST

Three questions on his screen for three days, two of which had their own answer
written in the file I was asking about. The tell I missed: when the evidence for
a decision is already IN the repo, in the thing's own description, it is not a
decision that needs an owner. It needs someone to read it.

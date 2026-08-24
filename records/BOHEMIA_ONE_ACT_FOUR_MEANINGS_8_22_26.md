# ONE ACT, FOUR MEANINGS (8/22/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Turn an outfit down in front of people. The
## one who runs with that outfit, somebody from a rival, and a bystander each say
## a different thing about the same moment.

---

## MORE LINES IS FILLER. LINES THAT DEPEND ON WHO SAW IT IS DEPTH.

Yesterday shipped witnesses saying what they saw out loud: sixteen drafted lines,
four acts by saw/heard by two variants. Backlog 0r's Hades math says the
multiplier is the point, and the honest read of that is **not** "write more lines
of the same four acts". That is padding.

The multiplier is **who is speaking**.

## THE CORPUS HAS ALWAYS AUTHORED THIS

`bohemia_deeds` says it, quoting his own quest file:

> "ONE ACT, TWO MEANINGS, and the corpus was already saying this out loud. S17
> stage 32 is `faction CARAVANS +12` AND `faction BLUES -6`: taking the credit is
> a good customer to the traders and a betrayal to the growers."

And `bohemia_standing` ships `opts.only` for exactly this reason, in its own
words: *"one act can mean opposite things to two factions and nothing at all to a
third."*

## WHAT IT SAYS NOW

The same refusal, measured on the real surface:

| who is speaking | what they say |
|---|---|
| the outfit you refused | *Said no. To us. Standing right there.* |
| somebody from a rival | *Turned them down. Good.* |
| an unaffiliated bystander | *Told them no. Right to their face.* |
| anyone who only heard | *Heard somebody turned them down.* |

Four acts by four audiences by two variants: **32 drafted lines**, still
pronoun-free, still cycling so none repeats until its pool is spent.

## THE RETELLING LOSES THE DETAIL, AND THAT IS THE DESIGN

The deed remembers which outfit it was about, stamped on the eyewitness copies,
never carried in the KIND, because a kind per faction would grow Paolo's
`DEED_WEIGHT` table with the roster and he weighs an act **once**.

`gossip()` copies actor, kind, turn, position, hops, and the fields it knows. It
does **not** copy `fid`. That is not a limitation I worked around:

**THE SPECIFIC DETAIL IS THE FIRST THING A RETELLING LOSES.** An eyewitness knows
who you turned down. Somebody who only heard knows that somebody got turned down.
So second-hand news is vague *by construction* rather than by a rule I wrote, and
the gate asserts the retold copy has no outfit on it. A mutation that lets `fid`
survive a retelling goes red.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_city_deeds_patch.py` | the outfit stamp, four audience pools, the upgrade paths |
| `gates/city_deeds_gate.js` | 36 -> 43 claims |

Both city tools idempotent together, md5-identical over three runs.

| mutation | result |
|---|---|
| everybody reads the act the same way | **3 red** |
| let the outfit survive a retelling | **2 red** |

## TWO THINGS THIS GOT WRONG FIRST

**EVERY FORM A TOOL HAS EVER SHIPPED NEEDS AN UPGRADE PATH.** The tool refused
outright when the city held the intermediate form (tagged, no outfit) and only
V1 and fresh-anchor pairs existed. **Refusing was the right failure**, it said so
plainly and changed nothing, rather than reporting success over a half-wired
city, but the fix is a pair per shipped form, each narrow and span-matched on
both halves. Three forms now, three paths.

**FIFTH TIME: AN ASSERTION THAT PINS TODAY'S ANSWER INSTEAD OF TODAY'S RULE.**
Three assertions matched the exact argument list of the `ctDeed` call and went red
for the call legitimately **growing an argument**, a clout tag yesterday, the
outfit today. They match the call now, not its arguments, so the next argument
cannot break them. This lane has met this shape five times; the fix is always the
same and it is always to the ruler, never the target.

## WHAT COMES AFTER

1. **THE AFTERMATH SET PROPER.** 0r asks for reactions *different for killed vs
   spared*. That needs a boss, which is COMBAT's; the channel is built, and it now
   has audiences too. **Theirs to trigger, this lane's to word.**
2. **HE TURNS THE STANDING DIAL.** One row in DIRECT makes all of this judge him
   instead of merely remember him. **His.**
3. **The other dials**, `SEE_RANGE`, the gossip window, the halflives. Worth
   saying plainly: these are SET and WORKING with written arguments, unlike
   `DEED_WEIGHT` which was empty and blocking. The 8/12 law's test is about things
   he has to rule on; nine mechanism sliders would be the technical-question trap
   wearing a UI. If it ships, it ships as ONE creative fork about how the world
   feels, in his words, not as a tuning panel.
4. **Walking is silent**, 97 approved sounds unplayed. SOUNDS.

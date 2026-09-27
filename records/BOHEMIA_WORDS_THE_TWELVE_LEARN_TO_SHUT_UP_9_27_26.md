# WORDS [bb event writing] ROUND TWO -- THE TWELVE LEARN TO SHUT UP

**LANE** WORDS (12). **MODE** SCHOOL THEN WRITE, this is the WRITING half of the
question school opened on 9/24 (`records/BOHEMIA_WORDS_BB_SCHOOL_THE_SITUATION
_IS_THE_PART_NOBODY_READS_9_24_26.md`). The row shipped as SHIPPED (school) only;
this closes the second round.

---

## 1. THE SHAPE, FROM SCHOOL, AND WHAT IT MEANS FOR TWELVE ALREADY-WRITTEN LINES

School's answer in one line: *a Battle Brothers event is a narrator's paragraph
with buttons under it, and Battle Brothers' own players say they stop reading
the paragraph.* Section 4 gave six rules for us. Applying them to the twelve
`ROAD_WORDS` entries this lane already had written:

1. **THE SITUATION IS NOT TEXT, IT IS WHAT HE SEES.** This lane cannot build the
   art that would show six dogs coming out of a wash. What it CAN do is stop
   writing the paragraph a picture should carry, and cut every line down to what
   is left once the scene-setting is gone.
2. **THE WORDS GO WHERE THEY SURVIVE: THE CHOICE AND THE CONSEQUENCE.** Untouched
   this round -- `ROAD_CHOICES`' button labels and `say` lines were already short
   and already survive. The defect was only ever in `ROAD_WORDS`.
3. **A MOUTH SAYS IT.** Three of the twelve already had a quoted line sitting
   inside a narrator wrapper. Lead with it; cut the wrapper.
4. **NOT EVERY MOMENT DESERVES WORDS.** Nine of the twelve have no established
   speaker -- an animal, a machine, or a crowd nobody has named. Rule 19 asks for
   a mouth WITH A PORTRAIT. None of these nine has one. Inventing a voice for them
   to hit the shape would be the exact defect this round exists to fix, worn a
   different way: a line with nobody behind it.

**SO THE HONEST MOVE FOR THE NINE IS NOT TO GIVE THEM A MOUTH. IT IS TO STOP
WRITING THEM LIKE ONE IS SPEAKING WHEN NONE IS.** They are trimmed captions, not
speech, and whether they ever need an actual attributed speaker is left open --
that is a design decision this record does not make, because this lane does not
hold the canon for "does a coyote or a robotaxi get a voice."

## 2. MEASURED BEFORE WRITING, AGAINST THE GATE'S OWN NUMBERS

The 9/24 readiness gate pinned two debts at the twelve's original shape:

```
too long (>98 characters)     12 of 12
narrate the player as SUBJECT  3 of 12
```

## 3. THE TWELVE, BEFORE AND AFTER

| id | before (chars) | after (chars) | what changed |
|---|---|---|---|
| feral_dog_pack | 122 | 86 | cut the scene-setting, kept the collar and the silence |
| coyote_shadow | 137 | 71 | cut "picks you up... your speed" (player-as-object narration), one clean fact |
| rattlesnake | 105 | 77 | cut "you've got about two seconds to pick where **you**r foot goes" -- the subject-of-verb violation |
| scavenger_shakedown | 179 | 87 | led with the quote, cut the wrapper describing him stepping out |
| toll_crew | 129 -> 86 | kept "four hold the ramp" so the headcount stays visible (see section 5) |
| the_snatcher | 128 | 92 | cut "gone before **you** finish turning" -- the other subject-of-verb violation |
| crazed_wanderer | 116 | 86 | cut "he sees **you** and he doesn't slow down" -- the third violation |
| bounty_squad | 149 | 81 | cut "moving like they've done this before... he checks it twice" |
| casino_security_bot | 151 | 83 | led with the announcement, cut "rolls out from under the porte cochere" |
| spotter_drone | 122 | 73 | cut "it's been over **you** a while and **you**'re only now hearing it" |
| ghost_robotaxi | 113 | 76 | cut "pulls to the curb ahead", kept what it does |
| patrols_collide | 137 | 76 | cut "before anybody says anything... has looked **your** way" |

**ALL TWELVE UNDER THE 98-CHARACTER HOLD. ZERO NARRATE THE PLAYER.** Verified
against the gate's own regexes, read out of the gate file and run against the
drafts before a single line was written to the source -- not a reimplementation
that could quietly disagree with the real checker.

## 4. WHAT DID NOT MOVE, AND WHY THAT IS THE POINT

- `ROAD_CHOICES`, `ROAD_PARTY`, `ROAD_LEAVINGS`, `ROAD_COST`, `roadContactFight`
  -- untouched. This round is words only. The mechanism that will one day deliver
  these lines through a body instead of a dead card is not this lane's canon.
- The nine without a speaker were NOT given one. That decision is stated, not
  hidden: whoever builds the body these events attach to gets to decide whether
  a coyote's caption becomes an actual bark, or stays an unattributed line the
  world shows near the thing itself.

## 5. THE HEADCOUNT AUDIT, AND A REGRESSION I ALMOST SHIPPED

The comment above `ROAD_PARTY` cites literal ROAD_WORDS substrings as the
evidence trail for its hard-coded headcounts ("Four of them have the ramp" -> 4,
etc.), with the standing rule *"nothing here invents a headcount."*

**MY FIRST DRAFT OF `toll_crew` BROKE THAT TRAIL.** Leading straight with the
quote ("Toll's a third...") dropped the only place the number FOUR appeared
anywhere in the line, so `ROAD_PARTY.toll_crew.n:4` would have had nothing in the
words to back it. Caught by checking every draft against what the audit comment
actually cites, not just against the two machine-gated rulers -- a machine can
only refuse what it was told to look for. Fixed: `"Four hold the ramp. \"Toll's a
third...\""` keeps the count in four words and still leads into the mouth
immediately after.

The other eight human/machine counts survived by accident of grammar (a singular
pronoun -- "His hands", "It", "A man", "A kid" -- or an explicit number -- "Three
of them", "Six, maybe eight" -- was already load-bearing in the shortened line).
**Checked each one by hand rather than trusting that accident**, and updated the
audit comment itself to quote the current text, so the next reader is not
handed a comment pointing at a string that no longer exists in the file.

## 6. THE GATE, RE-PINNED TO ZERO

Both ratchets on `gates/road_words_are_sayable_gate.js` came back at zero:

```
too long        0 of 12   (was 12)
narrate him     0 of 12   (was 3)
```

Re-pinned `DEBT_TOO_LONG` and `DEBT_NARRATES` to 0. **Zero is the floor, so a
thirteenth violation of either kind now fails on arrival rather than hiding
inside a debt.** Mutation-proved: planted one narrator line back in
(`coyote_shadow`, restoring "before you know it, you turn and it is gone"),
`RED: 8 passed, 1 failed`, naming the count; restored, `GREEN: 9 passed, 0
failed`.

## 7. WHAT THIS DOES NOT PROVE

- **Nothing about whether any of the twelve is good.** Shorter and unnarrated is
  not the same as well-written. All twelve stay `draft:true`, his to rewrite.
- **Whether the nine speakerless events ever need a voice at all** is still
  undecided, on purpose, and is not this record's call.
- `roadCard` still has zero callers. This is still readiness, not delivery.

## ROUTED
- **WHOEVER BUILDS THE BODY FOR A ROAD MOMENT** -- the nine without a speaker are
  the ones to look at first: do they stay unattributed captions, or does one of
  them turn out to want a real person and a portrait.

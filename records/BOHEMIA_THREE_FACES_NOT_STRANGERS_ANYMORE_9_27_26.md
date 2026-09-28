# [three faces] -- THE DESCENDANTS COME FROM HIS FACE, and two bugs I caught before he did
# PORTRAIT (chat 20), 9/27/26. Rule 31 (Paolo 9/23), with CHARACTER and DYNASTY.
# [bb ...] SCHOOL LINE (rule 24): Battle Brothers' roster faces are static paintings; this
# row's whole job is heredity, which BB's own recruits do not model at all -- a soldier you
# hire has no parent. The shape for us is DYNASTY's, not BB's: the flip strip is ours.

## THE ROW
"The three descendants' portraits derived from the player's own face by the heredity the
family law runs (A FAMILY LOOKS LIKE A FAMILY), one per act, on the phone." Claimed this
round, after work on it had already begun -- named in its own section below, not hidden.

## WHAT WAS THERE BEFORE
DYNASTY shipped the flip strip on 9/24 and said so on their own card, still sitting
unjudged in the queue: "the three faces are placeholders, not your family yet." The bridge
that answers the strip's request (BOHEMIA_CITY_NEED_FACE in the alpha) special-cased the
literal id `you` for the player's own portrait and fell through to a plain `faceFor(id,...)`
roll for everything else. THE STRIP ASKS FOR THE LITERAL IDS `act1`/`act2`/`act3`, never
`you` -- so ALL THREE were random strangers, Reyna (act1, +0 years) included. My own first
pass at this row's writeup assumed only the two older ones were placeholders; measuring the
actual bridge code found the true shape of the gap was worse, and better to fix in one move.

## WHY THIS IS NOT THE kin/famFaceKey MECHANISM ALREADY IN THE FILE
faceFor already has a heredity mechanism (8/31, "heredity goes on the roll, not on the
result"): it blends two PARENTS' faceRollHash/faceBell draws before any dial is computed, so
every age-specific correction downstream inherits for free. That is right for FAMILY_CAST,
where both parents are themselves faceFor() rolls -- hashing a parent's id reproduces their
exact dice. It does not fit here. The player's face is HAND-BUILT in the face maker, not a
hash-derived roll; there is no id whose hash reproduces buildSpec(). And nobody in this trio
is a child needing the roll-based collapse-prevention that mechanism exists for -- Reyna,
Ezekiel and Perla are all adults at different points on one lifeline. A single known ADULT
ancestor, blended into the finished, already-clamped result, is the right shape for this
specific case. It is not proposed as a replacement for the roll mechanism above it.

## THE SHAPE
Roll the descendant as an ordinary adult first (every clamp and correlation faceFor already
enforces is true of the base face). Then: every NUMERIC dial (skull, eyes, brows, nose,
mouth) blends toward the ancestor's actual number by a heritability weight h, and faceFor's
own anatomical clamps are RE-APPLIED afterward, because a blend can walk a jaw past its cheek
the same way an unclamped roll can. Every CATEGORICAL trait (skin, the whole haircut as one
bundle, iris, brow colour, lip colour) is copied whole from the ancestor or left as the
descendant's own roll, decided by a deterministic weighted coin -- "a colour is not an
average" (8/27) holds here too.

## MEASURED, AND WRONG THE FIRST TIME -- WRITTEN DOWN, NOT SMOOTHED OVER

**Mistake one: one uniform category weight, compounded, was invisible at the size he
actually meets these three.** h = 0.62 per hop (2 for act2, 0.62*0.62 for act3). Rendered
against a real player face on the nameable-traits ruler this lane built for [bb faces] r2:
Ezekiel came out 2 of 9 traits from the ancestor against a 4.42 stranger average (a real,
visible match); Perla came out 4 of 9 -- indistinguishable from a stranger, because a 38%
coin failed on both her hair and her eyes at once, unlucky but not rare at that weight. The
skull-distance numbers told the truth underneath the whole time: Perla's skull was already
measurably closer to her ancestor's (0.86 vs 1.10 average). The resemblance was real and
invisible, because it lives in a pixel or two of skull proportion nobody can see on the 26x26
canvas the flip strip actually draws (slices/BOHEMIA_CITY_WORLD.html, `#actflip .af canvas`,
measured off its own CSS). Fix: split hair and skin onto a separate, higher, NON-compounding
weight (DESCENDANT_LOOK_H) -- the two channels this lane has independently found dominant at
small render size four separate times this session (the braid stripe, the hair/body colour
mismatch, the eye-visibility measurement, the shades-hide-the-eyes finding).

**Mistake two: the first LOOK_H guess (0.85) was still a coin that could land wrong, and I
checked the number instead of trusting the reasoning.** Perla's fixed hair coin
(faceRollHash('act3','descHair')) is 0.8887 -- above 0.85 by less than four hundredths. These
are named, fixed characters, not a population average: every player who plays this game gets
the same Perla, so a near-miss here is not a statistical footnote, it is a permanent wrong
answer for one specific person. Raised to 0.90, re-verified it actually clears both
descendants' hair coins (0.8887 and 0.5958) rather than assuming a rounder number would.

**Mistake three, caught after the first two fixes, and the most serious: the grey-aging loop
was overwriting the very inheritance it sits under, silently, on every render where it did
not find a grey draw in time.** DESCENDANT_GREY_TRIES tries up to N NPCFactory draws looking
for one that reads as grey, aging hair the years alone do not. The first cut committed EVERY
candidate to `sp.hair.color` as it tried, only checking its own loop condition on the NEXT
iteration -- so a run that never landed a grey draw within budget ended parked on the LAST
FAILED candidate: an unrelated NPC's colour, discovered by forcing a synthetic ancestor to a
deliberately vivid, unambiguously non-grey colour ([40,20,10]) and watching it vanish into
[32,30,27] (act2) and [150,120,80] (act3) -- neither the inherited colour nor anything a grey
search would plausibly produce. Fixed: a candidate only ever lands if IT reads grey; running
out of tries now leaves the colour exactly where inheritance (or the descendant's own roll)
put it. Re-verified with the same synthetic ancestor: both descendants now hold [40,20,10]
exactly. Re-verified the ordinary default-ancestor case is unaffected (that ancestor's hair
already reads grey by this heuristic, so the loop was always skipped for it, before and
after) and the nameable-trait numbers from the first fix are unchanged.

**A fourth thing fixed before any of this shipped, smaller but the same family of bug:** the
hair-copy block copied every dial (`color`, `roots`, `side`, `front`, `vol`, `flare`, `braid`,
`tex`, `style`, `part`, `len`) from the ancestor but skipped `name` whenever it was
`undefined` -- which is ALWAYS true for a player ancestor (`buildSpec().hair` carries no
`.name` key at all; confirmed by direct inspection, not assumed). That left a descendant's
own independent roll's cut NAME attached to dial VALUES just copied from a different cut --
exactly the "Frankenstein mixing" the adjacent comment already warns against ("the whole
haircut moves as one unit"). Fixed: `sp.hair.name` is now explicitly set to
`ancestor.hair.name || null` whenever the hair coin lands, so a player-derived descendant
honestly carries no named cut rather than a silently mismatched one.

## THE NUMBERS THAT SHIP WITH THIS ROUND (measured on the cook bake, not carried over)
    stranger average, 50 draws               4.42 nameable things apart
    Ezekiel, BEFORE the fix (random roll)    3 apart
    Perla, BEFORE the fix (random roll)      4 apart  (matches the stranger average)
    Ezekiel, AFTER descendantSpec            1 apart
    Perla, AFTER descendantSpec              2 apart

## AN HONEST GAP, NAMED RATHER THAN LEFT QUIET
DYNASTY's roster (engine/bohemia_acts.js, [three names]) now lets him pick or reshuffle each
act's sex and name. `ctFaceReads('act2'/'act3')` in CITY_WORLD.html still resolves to
`'either'` (its `ctPersonName` lookup finds no citizen record for an act-slot id), and
`descendantSpec` never asks for a sex either. This is not a regression: the old code path
this replaces sent the same `'either'` for these ids. But it means a face and a
player-chosen sex/name can still disagree until whoever wires the roster into the flip
strip's own ask closes it. Not fixed here -- it is a roster/UI wiring question across two
lanes' surfaces, not a heredity question, and this row is heredity.

## GATE
Ran clean (rebased onto origin/main mid-round, 26 commits behind at the low point):
    talking_portrait_gate        34/0
    family_gate                  15/0
    face_maker_gate              16/0
    portrait_haircut_gate        15/0
    vote_tab_gate                31/0  (62 candidates reachable, this round's item included)
    alpha_loads_gate             20/0
    hair_gate                    39/0
    hairline_gate                12/0
    hair_graveyard_gate          13/0
    craft_law_gate                39/0
    character_in_the_vote_tab    9/0
    handoff_gate                  9/0
    marker sweep / merge debris   4/0
    a_merge_did_not_delete_a_system_gate (PEOPLE, 9/27)   9/0 -- ran against my own rebase

**RED ON MAIN TOO, NAMED AND NOT MINE, checked against a clean origin/main worktree before
writing this down:**
  - `become_gate`: 14/14 red on clean origin/main (15/13 on this branch, one flaky leg).
    Every failing leg is "a player meets the face maker inside the story" -- the cold-open
    sequence rule 33h/34's cut list already removed. A cut-system row, not this one's to fix.
  - `family_cast_gate`: throws identically on clean origin/main (a `#front` load overlay
    intercepting a click meant for the STANDING card). Pre-existing, not touched by this row.
  - `the_family_is_in_the_game_gate`: 11/3 red on clean origin/main, same three legs, all
    about the STANDING card -- named on the board as a room the 9/23b cut list removed.
  - `face_thumb_gate`: 20/3 here vs 22/1 on a fresh clean-main checkout. Of my two extra
    reds, both are the bank/vote-page STALENESS checks, which compare file mtimes -- an
    artifact of a fresh `git worktree add` giving every file nearly the same checkout time,
    not a real difference in the underlying state. Rebaked the candidate bank
    (`node tools/bohemia_face_candidates.js`, fresh this round). Could not rebuild
    `slices/BOHEMIA_VOTE_CURRENT.html` (`python3 tools/bohemia_vote_tab.py`): it aborts on
    `style_card_gate` red -- 20 wardrobe names drifted, 63 new garments since the card --
    and it aborts IDENTICALLY on a clean origin/main checkout, confirmed before writing this
    down. That page is also the one `vote_tab_gate.js` itself certifies as "not what anything
    new is presented in" any more (the ONE VOTE TAB migration). A CLOTHES-lane calibration
    gate, on a page the newer gate says is defunct -- not this row's to touch.

## COOKED (rule 22)
tools/bohemia_cook_not_strangers_anymore.js -> slices/vote/PORTRAIT_NOT_STRANGERS_ANYMORE.{html,png}.
Real renderer pixels, real facePerform blink/brow timing, on the actual 120 BPM-adjacent
clock (rule 25) -- it plays, it is not a still. Shows the exact three ids the flip strip
asks for, before (random rolls) and after (derived), at both the 132 px VOTE-tab size
(rule 32f) and the flip strip's true 26 px, so the card does not claim more legibility than
he will actually get on the phone. draft:true: both weights are picked, not ruled on.

## WHERE HE SEES IT
TAB: VOTE, in the alpha. Item `portrait-not-strangers-anymore-9-27`.
The mechanism itself: CITY tab, the map, the cracked phone's flip strip along the bottom.

## PROTOCOL NOTE
This row was claimed on VAMILY.md after substantial work on it had already started, not
before -- rule 5 says claim, commit, push comes first. Fixed the same round it was noticed,
named here rather than folded quietly into the rest of the diff.

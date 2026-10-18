# EYES AND EARS -- THE BLIND PASS, THE FIVE TELLS, AND THE QUEUE (10/18/26)

Lane 17, the QA lead (rule 113a). Opened by the coordinator (rule 112), on Opus because the fleet's Fable ran out
(the chat before this one stopped mid-round; nothing of its uncommitted work survived, nothing here re-uses it).
Three rows, one round: [the blind pass] (CLAIMED 10/16), [the keep rate and the queue], [the five tells by hand].
Everything here is READ ONLY: no registry, triage, tab or art file was edited.

## 1. [the blind pass] -- SHIPPED, both rounds in one sitting

Tool: tools/bohemia_eyes_the_blind_pass_10_18_26.py. Output: records/target/EYES_THE_BLIND_PASS.json.
Suite: THE BLIND PASS (selftest, planted cards).

ROUND ONE (school, REUSE FIRST). PLUMBER's cook gate already refuses a look item with no before_after at 1:1
(rule 89); that test is ported unchanged as leg 5, so the two can never disagree (they agree today: both name the
two COOK FOUR roof cards). Nothing in the repo read the WORDS on a card. The school's teacher is him: his 467
verdicts, of which 21 say he could not tell what the card was ("I'm so confused", "what is the purpose", "when
would I see this", "why are you asking me", "can't tell difference", "no fucking clue").

WHAT THE SCHOOL FOUND (it changed the build). The first cut BACKed 90 percent of his confused cards and 82 percent
of his clear ones: a filter that sends everything back is a wall, not a filter. Measured leg by leg:

| test on the card's own words                      | his confused (21) | his clear (446) | lift |
|---------------------------------------------------|------------------:|----------------:|-----:|
| never says WHERE in the game he meets it          | 24%               | 7%              | 3.7  |
| never says what he is deciding                    | 24%               | 22%             | 1.1  |
| a sentence over 28 words / over four sentences    | 67%               | 57%             | 1.2  |
| a code word or a file path                        | 0%                | 1%              | 0    |
| team business (gate, chat, lane, coordinator)    | 5%                | 12%             | 0.4  |
| (kind is ui)                                      | 29%               | 16%             | 1.8  |

Length does not predict him: the longest-sentence and word-count curves of the two sets lie on top of each other at
every threshold from 25 to 100. What predicts him is the card never saying where he will meet the thing. His
confusion is mostly about the THING (UI cards, things he will never see in play), not the sentence.

THE LEGS AS BUILT. Rulings (his words; they stand whatever they predict): a thing to see or hear (first votes 9/21),
no code word (8/24), the before and after at 1:1 (rule 89), no team business (rule 113d). Predictor: WHERE HE MEETS
IT (lift 3.7). Notes only, never a BACK: what he decides, length. The selftest goes red if the predictor stops
BACKing his confused cards at twice the clear rate.

THIS ROUND, the 11 cards no one has sorted yet: 8 PASS, 3 BACK.
- BACK cook4-the-family-in-the-valley-tans-10-18: no before_after field at 1:1 (the picture shows one; the card
  does not say it; PLUMBER's cook gate is red on the same two).
- BACK cook4-the-motel-straight-roof-10-18: the same.
- BACK cook3-the-thug-through-the-rig-10-18: team business on the card ("The people chat built the thug").
Pass rate by lane: direction 3 of 3, sounds 2 of 2, animation 1 of 1, run 2 1 of 1, tuning 1 of 1, cook 4 0 of 2,
cook 3 0 of 1. The tab filter that obeys a BACK is UI's (the row's constraint); the coordinator reads the file.

## 2. [the keep rate and the queue] -- SHIPPED

Tool: tools/bohemia_eyes_the_keep_rate_and_the_queue_10_18_26.py (--json, --gate). Suite: THE QUEUE ON HIM
(red when more than twenty wait; planted first).

A sitting is one export (one 'when' plus one 'at'); the 10/10 night held four exports under one 'when' and the file
cannot split them, said here rather than hidden.

| sitting | judged | yes | keep | lowest lanes (3+ judged) |
|---------|-------:|----:|-----:|--------------------------|
| 9/21    | 83     | 38  | 46%  | world 0 of 6, portrait 15% of 13 |
| 9/23    | 31     | 21  | 68%  | sounds 25% of 4 |
| 9/27    | 55     | 31  | 56%  | people 0 of 3, factions 20% of 5 |
| 9/30    | 62     | 40  | 65%  | combat 20% of 5 |
| 10/2    | 91     | 67  | 74%  | dynasty 25% of 4, ui 25% of 4 |
| 10/9    | 38     | 17  | 45%  | portrait 0 of 3 |
| 10/10   | 57     | 44  | 77%  | animation 50% of 4 |
| 10/17   | 51     | 35  | 69%  | sounds 40% of 10, cook 50% of 4 |

Never under 40 percent; the floor sitting was the first (46). THE QUEUE: 11 items wait on him (all 11 not sorted
yet by the coordinator; 104 gray and 37 green wait on nobody). Cap about 20: green.

## 3. [the five tells by hand] -- this round's measurements (standing until PLUMBER's ten gates exist)

Tool: tools/bohemia_eyes_the_five_tells_10_18_26.py, measured AGAINST DIRECTION's new style guide
(records/target/BOHEMIA_STYLE_GUIDE.json, 077f30f) and calibrated on HIS YES (field 18, tie-breaker 1: a number that
fails the robot and the truck is the wrong number). Output: records/target/EYES_THE_FIVE_TELLS.json.

WHAT HIS YES CHANGED IN THE RULER (three of the research page's five tells, as written, fail his own YES):
- COLOURS: the robot has 37 of 68 sprites over the guide's 11.1 percent top-eight share; DIRECTION already moved the
  cap to the SOURCE palette (field 5). Reported, never culled on an output sheet.
- HUE SHIFT: 68 of 68 robot ramps walk under 8 degrees on the OUTPUT; the guide holds 8 degrees on the source palette
  (G4, gated by style_guide_gate.py). Reported, never culled on output.
- LIGHT: the sphere's 155.4 is not what a figure reads; a tall figure's highlight-minus-shadow leans vertical (head in
  the sun, legs in shade). His rig YES sits at 96 to 140 degrees (interior pixels, ring and contact shadow out); that
  band is the ruler. On the PACK road his YES spans 87 to 278 degrees and has no calm area (median 0.05), so light and
  rest cannot judge pack art: reported only there and on UI screens; pixel size culls on every road.
- REST: calm = 5x5 luminance spread under 8, the smallest spread at which both maquettes pass on 90 percent of
  sprites (robot 67 of 68, truck 16 of 17); a quarter is the guide.
- ZOOMS: an n-times sprite whose size over n matches a 1:1 sprite on the same sheet is a labelled zoom, not a mixel.

THE LINES (one per new sheet):
| sheet | road | pixel sizes | colours max / top8 | light outside his YES | output ramps under 8 deg | rest | verdict |
|---|---|---|---|---|---|---|---|
| DIRECTION look bible, everything the same | rig | 1 (+2x zoom) | 53,484 / 21.8% | 5 of 16 | 20 of 25 | 10 of 16 | PASS |
| DIRECTION style guide do and don't | rig | 1, 2, 3 | 9,917 / 23.3% | 1 of 30 | 29 of 32 | 27 of 30 | the 2x is field 2's own DON'T (deliberate); not a defect |
| DIRECTION hand finish raw and finished | rig | 1 (+3x zoom) | 5,870 / 58.5% | 2 of 28 | 19 of 19 | 26 of 28 | PASS |
| COOK FOUR family in the valley's tans | pack | 1 | 30,937 / 68.8% | (report) | 19 of 23 | 0 of 22 | PASS (pixel size) |
| COOK FOUR motel straight roof | pack | 1 | 30,360 / 68.8% | (report) | 10 of 11 | 0 of 11 | PASS (pixel size) |
| RUN TWO who is wearing what | ui | 1 | 2,691 / 91.2% | (report) | 56 of 64 | 58 of 61 | PASS, see the finding |
| COOK THREE the thug through the rig | rig | 1 (+4x zoom) | 8,905 / 85.8% | 3 of 8 | 17 of 19 | 13 of 21 | PASS |

No sheet fails a tell that his own YES passes. The coordinator culls nothing on these numbers this round.

## 4. FINDINGS (I show, I don't fix)

- RUN TWO [who is wearing what] / COOK: THE RIFLE IS A PISTOL. The crew screen draws every crossbow-class weapon
  (labelled "rifle": Desi's bag, Marisol, Lupe) with slices/market_icons/w_rifle.png, and that file is a revolver,
  the same family as the pistol icon. On his phone a rifle and a pistol look like the same gun. Owner of the screen
  RUN TWO; owner of the icon whichever cook drew market_icons.
- COOK THREE: the thug card's words name "the people chat"; team business on a card (rule 113d). One word to change.
- COOK FOUR: the two roof cards carry their before and after in the picture but not on the card (before_after
  field); PLUMBER's cook gate is red on the same two. One field each.
- DIRECTION / PLUMBER: three of rule 114's five tells, read on an output render, fail his own YES; the style guide
  already put two of them at the source. PLUMBER's [the not vibe coded gates] should measure gate 2 and gate 4 on
  the source palette (as G2/G4 say) and gate 3 against the maquettes' band, not the sphere's angle, or the gates
  will cull the robot.

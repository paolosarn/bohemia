# TUNING [how long a life is] THREE SETS FOR DYING OF AGE, MEASURED ACROSS THREE ACTS (10/18/26)
# Row: VAMILY TUNING [how long a life is] RANDOM-LIFESPANS-THAT-ARE-FUN. Research only (rule 38g); nothing is built.
# His 9/27 vote: "maybe it's a random variable number, procedure generated, how old people can live, do big brain research
# on it, come up with a mechanic that's fun." Bounded by: AN ACT IS A YEAR (rule 84, 10/10: "most people will only spend a
# maximum of 300 to 450 days in a single act, so a year passes"); a fold is about 30 years (canon); the future is computed
# from the past (rule 31); the future goes both ways (the third votes); EASIER THAN BATTLE BROTHERS (rule 117, 10/18).
# Builds on my 9/28 page (records/BOHEMIA_TUNING_LIFESPANS_HOW_OLD_PEOPLE_LIVE_IS_A_ROLL_9_28_26.md); its two recall-grade
# facts are now checked online (section 2).

## 1. WHAT CHANGED SINCE THE 9/28 PAGE
- AN ACT IS ONE YEAR. So inside an act a person gets ONE yearly roll at most. Dying of age is a thing that happens
  BETWEEN acts (thirty rolls at once, at the fold) and almost never while you play. The felt number is not "a lifespan",
  it is two numbers: how many people you know die of age while you play an act, and how many of them are still there
  when you flip to the next one.
- THE THREE ACTS RUN AT ONCE (rule 31). He flips between them; the people of act 2 are computed from act 1. So a
  person's fate across the fold must be rolled ONCE, seeded, and never re-rolled when he flips back and forth.
- RULE 117: the real curve is the hard end of the slider, not the start.

## 2. THE REAL WORLD, CHECKED THIS ROUND
- Adults in hard places mostly get old: Gurven and Kaplan, 'Longevity Among Hunter-Gatherers', Population and Development
  Review 33(2), 2007, pp. 321-365: the modal age of adult death is about 72 (range 68 to 78).
- A crash cuts the middle-aged: Notzon et al., 'Causes of Declining Life Expectancy in Russia', JAMA 279(10), 1998,
  793-800: men 63.8 -> 57.7 and women 74.4 -> 71.2 from 1990 to 1994; deaths at 25 to 64 were over three quarters of
  the fall; heart disease and injuries about 65 percent of it.
- Risk of dying doubles about every 8 years in adults (Gompertz 1825; Makeham's flat term is accidents and violence).

## 3. HOW OTHER GAMES SET IT (a genre study; none is a reference game)
- BATTLE BROTHERS: men do not age. Its deaths matter because a man carried a history, not because of a clock.
- CRUSADER KINGS III: from 25, a 7.5 percent chance a year to lose 0.125 health, rising 2.2 points a year; a death roll
  only below health 3; players see rulers go infirm near 50 and die near 60 to 70, past 100 with strong traits
  (Steam threads quoting the game's wiki and defines; PCGamesN, Gamepressure analyses).
- THE SIMS 4: a fixed span per life stage, set by the player: the elder stage lasts 7, 14 or 56 Sim days on Short,
  Normal, Long, and an elder dies within a few days of the minimum (community guides, 2023). The span is a choice he
  makes, not a roll.
- RIMWORLD (9/28 page): age shows in the body first (a bad back, cataracts, frailty), so a death is foreshadowed.
What players keep, all four: a death of age is a story when you SAW IT COMING, something YOU DID moved it, and it LANDS on
a moment. Crusader Kings shows the decline as health; The Sims lets the player set the span; neither surprises.

## 4. THE THREE SETS, MEASURED (tools/bohemia_tuning_lifespans_sim.js, seed 1; 20,000 lives a cell; 2,000 towns of 40
## named adults for the per-act counts; the fold 30 years; two futures: played WELL crash > hard > good, BADLY crash >
## crash > hard)
| | A THE REAL ROLL | B THE KIND ROLL | C THE STORY SPAN |
|---|---|---|---|
| how it works | a yearly risk doubling every 8.2 years, plus bad luck; the times set both | the same curve, NO bad luck (violence lives in the fight), the times softer, nobody named dies of age before 60, the body shows it at a 2 percent yearly risk | each person rolls the age he dies at when you meet him (a bell around 72 / 78 / 84 by the times), never re-rolled, the stoop five years before |
| of 40 people you know, die of age while you play ONE act | 0.49 | 0.16 (one in six acts) | 0.76 |
| of 40, die of age across ONE fold | 17 | 9 | 12 |
| of those, how many die of 'age' before 60 | 46 in 100 | 0 | 6 in 100 |
| met at 20, still there in act 2 | 79 | 100 | 100 |
| met at 20, still there in act 3 (well / badly) | 36 / 24 | 55 / 48 | 33 / 19 |
| met at 40, still there in act 2 | 55 | 80 | 61 |
| met at 60, still there in act 2 | 7 | 15 | 1 |
| met at 20: dies of age, 1 in 10 before / median / 1 in 10 after (well) | 36 / 74 / 93 | 67 / 82 / 96 | 68 / 78 / 86 |

## 5. WHAT EACH ONE FEELS LIKE ACROSS THREE GENERATIONS
- A, THE REAL ROLL: realistic and cruel in the wrong place. Almost half its 'deaths of age' land before 60, which on screen
  reads as a man dropping dead at 41 for no reason. Act 2 has lost nearly half the 40-year-olds you knew. It is the true
  hard end of the slider, and the realism-first law's default; rule 117 moves the start off it.
- B, THE KIND ROLL (RECOMMENDED START): almost nobody you know dies while you play an act (0.16 of 40: one death of age
  every six acts); deaths of age happen across the fold, to old people, after the body warned you. Eight in ten of the
  40-year-olds you knew are there in act 2, and HOW YOU PLAYED shows in act 3: of the 20-year-olds you met, 55 are alive
  if you played well against 48 if badly. That is rule 31 paid in years and it is still the real shape (the Gompertz
  curve), just without the dice that belong to the fight.
- C, THE STORY SPAN: known in advance, so nothing you do moves it except a hack (a better future adds half the difference
  of the middles); the old men you meet bunch their deaths into the act you meet them (0.76 of 40 an act, the highest of
  the three); and the bell is narrow, so nobody reaches 95. Dropped.

## 6. THE MECHANIC, AS ROWS (the start is B; the slider goes to A; the rows are in the one table's section E as rule 117
## levers: life.bad_luck_by_times, life.stress_by_times, life.no_age_death_before, life.omen_at_yearly_risk)
1. Each named person carries a yearly risk: B x 2^(age / 8.2) x stress(times), B = 0.00006. Bad luck 0 at the start.
2. The times of the years between two acts are the times the EARLIER act earned (rule 31): the fold after a ruined act 1
   is lived at crash stress, the fold after a rebuilt act 2 at good.
3. At a fold the 30 rolls are made once, seeded by the person and the act, and stored; flipping back never re-rolls.
4. Inside an act: one roll at the act's end, never in a fight, never in the first hour.
5. The omen: at a 2 percent yearly risk the body shows it (THE ELDER STOOPS is already cut; grey at the barber; a cough
   in his lines); at 10 percent he says it out loud from a mouth with a portrait. No death of age without a warning.
6. His marks raise his stress a little each (the 9/28 page's MARK_STRESS, x1.08 a mark, draft); rest, a doctor, a home
   base lower it. Nothing shown as a number.
7. The main three: NOT decided here. [PENDING, Paolo's call] since 9/28, carried by the coordinator: can the main three die
   of age? Default no.

## ROUTED
- PEOPLE: rows 1, 4, 5, 6 (the person, the omen lines). DYNASTY: rows 2 and 3 (the fold, the seed, the flip).
- ANIMATION: the stoop is the first omen (cut). SOUNDS: the cough.
- MODS: banks/BOHEMIA_TUNING_LIFESPANS_THREE_SETS_10_18_26.json holds the three sets as data.

## SOURCES
- Gurven and Kaplan 2007: https://paa2006.populationassociation.org/papers/61883 (and the podcast quote at https://joshuaspodek.com/guests/michael-gurven/)
- Notzon et al. 1998: https://api.crossref.org/works/10.1001/JAMA.279.10.793 ; https://www.suicideinfo.ca/resource/siecno-19980804/
- Crusader Kings III: https://steamcommunity.com/app/1158310/discussions/0/3410928883779659089 ; https://www.pcgamesn.com/crusader-kings-3/death ; https://www.gamepressure.com/newsroom/analyzing-common-death-causes-in-crusader-kings-3/z52568
- The Sims 4: https://simscommunity.info/2023/03/15/the-sims-4-life-span-update-sim-age/ ; https://www.thegamer.com/sims-every-stage-of-life-length/

[bb Battle Brothers never ages a man; the lesson we keep is that a death lands because of the history, so ours land at the fold, on old people, after a warning.]
[analog horror: the omen is the horror, not the death: the stoop, the cough on the tape, the face greying a little each time you flip back; named for PEOPLE and SOUNDS, not moved.]

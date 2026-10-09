# TUNING ROUND 5 -- [death rule] WHAT "20% DEAD" DOES TO A WHOLE COMPANY (9/30/26)
# Row: VAMILY TUNING [death rule], MODE RESEARCH (rule 38g, build nothing). His rulings: rule 36b (9/27: "only a 20%
# chance your character can die, else a debilitating injury 30 to 40 days"), rule 37g (9/27 votes: THE MAIN CHARACTER
# NEVER DIES; a veteran of about 20 fights dies at 10%; the struck-down keep their gear, damaged).
# Sources: our repo (NERVE, fight length record); Battle Brothers injury and survival mechanics are RECALL-GRADE and
# marked; everything numeric below is arithmetic (Monte Carlo, 20,000 lives a setting, seed 3), script in section 6.

## 1. HOW BATTLE BROTHERS HANDLES THE SAME MOMENT (recall-grade; to verify online next round)
- Two separate things: an INJURY (a hit that takes a big share of hitpoints in one go has a chance to leave a
  named injury with stat penalties that heal over days, some permanent) and DEATH (hitpoints reach zero).
- The vanilla safety valve players remember: a man who falls in a fight you WIN can survive as a "left for
  dead" case with a permanent injury instead of dying, so a won fight is kinder than a lost one. The 20% we
  chose is the same idea with one fixed number; BB makes it depend on how the fight ended.
- IRONMAN: death is permanent and the save cannot be reloaded, which is what makes every death felt. Ours has no
  reload either (7/26), so the roll has to carry that weight.
- WHAT PLAYERS SAY (recall): losing a man you have named and geared is the game's real story; losing one you
  never learned is not. Both Legends and vanilla players mod for MORE ways a man is hurt, not fewer deaths.

## 2. THE THING NOBODY HAD MULTIPLIED: "20% DEAD" DOES NOTHING ALONE
The felt number is not "20% of the struck-down die". It is HOW OFTEN A MAN IS STRUCK DOWN PER FIGHT. Two rows
make the whole feel, and only one of them was ruled. (Struck-down chance per man per fight = the missing row.)
Measured, a man who dies at 20%, and at 10% once he has 20 fights behind him:
    struck down per fight   median fights he lives   dead before his 20th fight   scars he carries when he dies
     3%                       210                      11%                          8.4
     5%                       122                      17%                          8.2
     8%                        68                      26%                          7.7
    12%                        39                      37%                          7.2
    20%                        18                      54%                          6.3
Read the last row: at 20% struck per fight, HALF of all men die before they ever become veterans, and the
"veteran at 10%" ruling never fires. At 3 to 5% a man lives long enough to matter (a hundred fights, a whole act).
DEFAULT RECOMMENDED: 5% per man per fight on a routine fight (a dial), higher on a tough fight (his three reasons).

## 3. THE FINDING THAT PROVES US WRONG
*** THE DAYS AND THE ODDS EACH LOOK FINE AND TOGETHER THEY CAN EMPTY THE ROSTER. *** Men out at once is just
rate x days (Little's law): fights per day x men fielded x struck chance x 85% injured x days out.
    a fight every 4 days, 6 fielded, 8% struck, 35 days out  -> 3.6 men out at once
    a fight every 2 days, same                               -> 7.1 out (a twelve-man company is mostly in bed)
    a fight every 4 days, 5% struck                          -> 2.2 out
    a fight every 8 days                                     -> 1.8 out
So "30 to 40 days" is safe ONLY if the map spaces fights out (BB's roads and days, rule 33) or the struck chance
stays near 5%. TUNING owns the number and WORLD owns the fight cadence, so this is a joint row, and it is the
reason the days are a table row and not a constant.
SECOND FINDING: the 10%-veteran ruling means a man who survives long carries about EIGHT scars at death. Eight is
too many to read at a glance. Recommended: a man can carry FOUR marks; the fifth is not a scar, it is a RETIREMENT
(he is done fighting and becomes a settlement hand: a trader, a trainer, a family). That is the natural end of a
long life and it feeds DYNASTY's heirs. It also caps the lifespans page's scar stress (1.08 per mark).

## 4. THE RULE, RECOMMENDED (table rows; nothing is built)
A. STRUCK DOWN = hitpoints gone (or, per BB, one hit past a share of max, a row). 5% a fight on routine.
B. THE ROLL: 80% a debilitating injury, 20% dead (10% once fights >= 20). Rows: death.struck 0.20,
   death.veteran 0.10, death.veteran.fights 20, all already in the draft numbers table as ruled-not-built.
C. INJURY: out 30 to 40 days, a permanent mark chosen from a short list (a limp, a lost eye, a bad hand, a
   cough, shaking aim): each one a small named stat change and a body change the PORTRAIT can show. Rows:
   injury.days [30,40], injury.marks_max 4.
D. KEEPS HIS GEAR, DAMAGED (his ruling): the plate hold from the five-points page drops a step; repairing costs
   batteries. So a death is not the only cost of losing.
E. LOSING A FIGHT IS WORSE THAN WINNING IT (BB's kindness, ours): if the company WINS, the struck-down roll
   uses the ruled 20%; if it LOSES or withdraws, it is 30%. One extra row, death.lost_fight_bonus 0.10.
F. THE MAIN CHARACTER NEVER DIES (his ruling). His 20% must not vanish, or a fight has no stake for the man he
   is playing. Recommended: when the main is struck down, the 20% outcome is not death but THE SEVERE MARK: a
   permanent, big change (a lost hand that changes his weapon, a wound that shortens his life via the lifespans
   stress row), and the company he leads takes a morale and battery cost. Death stays for everyone else, so the
   risk is real without ending the story. [PENDING Paolo] via the coordinator only if he wants him to be able to
   die of age (already carried from the lifespans page).

## 5. NUMBERS, ONE PLACE (proposed rows for the table)
death.struck 0.20 (his), death.veteran 0.10 (his), death.veteran.fights 20 (his), injury.days [30,40] (his),
injury.marks_max 4, fight.struck_routine 0.05, fight.struck_tough 0.10, death.lost_fight_bonus 0.10, main.severe_mark 0.20.

## 6. THE SCRIPT (so the numbers can be argued with)
    per man per fight: struck with probability p; if struck, die with 0.2 (0.1 once 20 fights behind him), else
    gain one scar; median fights lived and scars at death over 20,000 men. Men out at once = fights_per_day x
    fielded x p x 0.85 x days. Toy: VOTE, item "WHO DIES".

## ROUTED
- TUNING [numbers table]: section 5 rows; the struck-down chance is the missing row of his ruling.
- WORLD: fight cadence (fights a day) is the other half of section 3.
- PEOPLE: the marks list and the retirement at four; the portrait shows each mark.
- DYNASTY: retirement and the dead man's heir (research row [recruit odds]).
- COMBAT: the withdraw verb (still absent) is the only other way to lose a fight without dying.
- Test material: the toy page is draft:true, never in the game.

## CORRECTED 10/9 (see records/BOHEMIA_TUNING_THE_WIKI_CHECK_WHAT_I_HAD_WRONG_10_9_26.md): the claims above marked recall were checked against the wiki. Corrections to this page are listed there in section 1; where they clash, that page wins.

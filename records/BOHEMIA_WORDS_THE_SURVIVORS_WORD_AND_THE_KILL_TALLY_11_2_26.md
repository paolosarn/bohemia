# THE SURVIVOR'S WORD AND THE KILL TALLY (WORDS, 11/2, rules 315 and 316, ask lines 310 and 311)

Paolo 11/2, his words:
- 315: "on the victory screen, one of your surviving characters provides commentary on how the battle went... a little world
  building into the UI, to replace the 'you won' [banner]... for the enemy type that you just vanquished, or enemy camp, whatever
  group... I want it to be funny, I want my characters to say funny things, like morbid funny, like real killers... think about it
  psychologically, what type of people en masse are going to be like hitmen... these people are going to be insane, they're killing
  people all the time at the numbers we have in the game."
- 316: "Battle Brothers keeps track of how many kills a character has and their strongest opponent... when your mouse was hovering
  over the character... on my phone, maybe when I just hold on him... display the amount of kills they've gotten."

SHIPPED in BUILD 11/3za - THEY SAY HOW IT WENT. NOT YET SEEN by Paolo.

## 1. THE RESEARCH: HOW MEN WHO KILL FOR A LIVING TALK AFTER THE JOB

What the voice is built on (sources from the studio's reading; the claims are the sources' own, the rules after them are ours):

1. **Gallows humour is how front-line workers cope, and it is documented.** Rowe and Regehr, "Whatever Gets You Through Today: An
   Examination of Cynical Humor Among Emergency Service Professionals," *Journal of Loss and Trauma* 15(5), 2010: police, paramedics
   and firefighters use dark, cynical humour as a way to cope with what they see; it builds the group and lowers the weight of the
   job, and outsiders hear it as callous. Watson, "Gallows Humor in Medicine," *Hastings Center Report* 41(5), 2011: ER and hospital
   staff joke about death and bodies among themselves; it is a release valve, and it is never said in front of the patient or
   the family. Sliter, Kale and Yuan, "Is humor the best medicine? The buffering effect of coping humor on traumatic stressors in
   firefighters," *Journal of Organizational Behavior* 35(2), 2014: firefighters who used coping humour showed less burnout and fewer
   trauma symptoms from the same calls.
   **Rule taken:** the joke is said among the crew, about the job, the mess, themselves. It is a way to get through it. It is never
   a sermon and never a laugh at someone who could not fight back.
2. **Killing numbs, and the numbness has a language.** Dave Grossman, *On Killing: The Psychological Cost of Learning to Kill in War
   and Society* (1995): soldiers go through stages after a kill (concern, the kill, exhilaration, remorse, then rationalisation and
   acceptance); men who kill often are conditioned, and the enemy is made distant (physically, culturally, morally) and given cold,
   flat words so it can be done again. Euphemism is the tell: men say "waste," "drop," "take out," "clean," not "kill."
   **Rule taken:** the distance words (done, down, off the road, clocked out, retired), and each personality sits at one of
   Grossman's stages: THE KID is still in exhilaration ("Did you see me?"), THE BELIEVER is in remorse with a joke on it, THE OLD
   HAND and THE DEADPAN are past it into flat acceptance, THE SHELL-SHOCKED never left it.
3. **Hired killers are mostly ordinary, cheap and practical.** Wilson, Yardley and Lynes, "A Taxonomy of Male British Hitmen,"
   *Howard Journal of Criminal Justice* 54(1), 2015 (27 contract killers, 1974-2013): most hits are not the movie, they are cheap,
   done in ordinary streets, by men from ordinary lives, and the talk is about the price.
   **Rule taken:** the joke is about money and stuff. The price of his boots, who carries what, the dead man's tab at the cook,
   whose share splits now. Batteries are the money, so they come up.
4. **How real crews talk after a job.** Wright and Decker, *Armed Robbers in Action: Stickups and Street Culture* (1997): after the
   job the talk is the money and what to spend it on, the rush, and who did well; the job is "work."
   **Rule taken:** the end-of-fight line is the walk back: counting, looting, who did good, who owes who.

THE FIVE RULES OF THE VOICE (in tools/words_personalities/bank_part4.py's head):
1. Flat and practical: boots, pockets, batteries, who carries what, who digs.
2. The distance words for killing, never the gore.
3. The joke punches at the job, at themselves and at the enemy as a TYPE (raiders, robots, a lab animal). Never at the helpless
   and never at a real-world group. THE KIDS (the enemy faction of armed street kids) get no joke at all, only a sober line
   ("Kids with slings. Who sends kids?").
4. Grief comes out sideways and then one quiet beat: "Marco owed me four batteries. Now who pays?", "Rest, Joe. I'll pray.
   You'd hate that.", "Somebody close Joe's eyes. I can't." The Quiet One just says the name.
5. Short: under 12 words a line, read at a glance on a phone. A little Spanglish on the one dial; the player never.

## 2. WHAT SHIPPED: THE SURVIVOR'S WORD (rule 315)

**The end screen (the one after every fight, in the game after the fight; NOT IN A TAB YET as a page of its own):** where YOU WON
stood, ONE of his men says ONE line with his face, his name over it and the line under it. His mouth moves to it.
- **WHO:** a man of his still on his feet, picked at random among them; if only YOU stands, a man alive on the ground (struck down,
  he wakes for it); never YOU, never the dead. Nobody left alive but YOU: the old word stands (YOU WON / YOU LOST).
- **HIS VOICE:** his personality type out of WORDS' bank, picked exactly the way the fight picks it (off his look), so the man
  calling shots in the fight is the same voice on the end screen.
- **HOW IT WENT** (the first that holds): a man lost for good (the line names him), a boss fell (names the boss), a man struck down
  (names him), outnumbered ("Seven of them and you all came back."), close (his men standing end under 35% of their blood),
  flawless (nobody down, everybody over 90%), else the plain win.
- **THE KIND THEY BEAT:** raiders, robots and their mechanic, the kids, the heavies, a lab beast, dire wolves, the dead, a boss, a
  camp (a clear-the-camp job). Each has its own lines any man can say, about a third of the time (60% over beasts, robots and the
  dead, where a line about boots or pockets is never said: the bank's people_only filter).
- **A LOSS, PULLING OUT, A WIPE:** each its own line from whoever is left (lost, ran, and the old wipe lines with who beat you).
- **THE HEAD** under him still says what happened ("THE RAIDERS ARE DOWN", "THE POT'S FOREMAN IS DOWN" for a boss, "YOUR CREW IS
  DOWN", "WIPED OUT"); the generic "THE FIGHT IS WON" is gone. The fight's own win quote below the bar shows only when nobody's word
  took the bar (one voice, one line).
- **THE COUNT:** 18 types x (7 plain wins + 2 Spanglish, 2 lines for each of 6 ways it went, 2 lost, 2 ran, and their twins) = 432 new lines, plus
  31 kind lines (9 kinds). Every line draft:true. Spanglish on the end screen measured 7.3% over 3,000 screens (the dial).

Samples (phone shots, VOTE tab):
- MOTHER HEN, a clean win: "All of you in one piece. Good."
- BELIEVER, Joe lost: "Rest, Joe. I'll pray. You'd hate that."
- DEADPAN, a boss: "The Pot's Foreman. I expected taller."
- any man, dire wolves: "Dire wolves. Extinct twice now."
- HUSTLER, Marco lost: "Marco's share splits between us now. Sad. Lucrative."
- WORRIER, a loss: "I knew it. I said it. Nobody listens."

## 3. WHAT SHIPPED: KILLS AND THE STRONGEST FOE (rule 316)

**Battle Brothers' way:** a brother's sheet keeps his lifetime battles, kills and the most powerful opponent he vanquished (the
enemy with the highest experience value he ever killed, by name). Here the same three, his whole career:
- **THE FIGHT** keeps, at every kill, the strongest man of theirs he put down (the enemy's experience value; a tie goes to the
  higher level) and sends his kills and that foe home with his row; the shell's after-fight queue keeps them.
- **HIS RECORD:** the crew screen folds every fight into his own saved record (the same record that keeps his level, gear and
  wounds): one fight more, his kills, the stronger of the two foes. A renamed man (JOE to JOE II) keeps his record; a dead man keeps
  his. Fights the crew screen has not read yet count on top everywhere the card shows.
- **THE CREW screen:** one short line under his level and wage: "23 KILLS, BEST: THE POT'S FOREMAN" (or "4 KILLS IN 2 FIGHTS" before
  he has a foe worth naming, "NO KILLS YET" before his first fight).
- **A LONG PRESS** (a finger held still about half a second) on one of his men shows a small card: his face, his name, "23 KILLS ·
  10 FIGHTS", "BEST: THE POT'S FOREMAN". Where: in the FIGHT (on top of the weapon card the hold already opened, this fight counted
  in), in the CAMP and a town (on one of his men standing there), on the MAP (hold on him: every man of his company, most kills
  first), and on the END screen (hold a man's row). The next touch anywhere closes it; the lift after a hold is never a tap (it does
  not send him walking on the map).
- **OLD SAVES START AT 0** and count from the first fight after this shipped. Nothing before it was kept.

## 4. PROOF

- New gate THE SURVIVOR'S WORD (gates/the_survivors_word_gate.js, in the suite): the bank's shape; 3,000 end screens never from YOU
  or the dead, a man up first; a man lost and a boss named every time; wolves never hear about boots; Spanglish 6 to 20 in 100;
  the record's arithmetic, a renamed man, the queue on top; ten wires (fight, shell, crew screen, end screen, camp, map). 6 of 6.
- THE SPOILS gate re-aimed (E1: one of his men says how it went where YOU WON stood, never YOU; E2: a loss is the loss, said by
  whoever is left; S2: a wipe still reads WIPED OUT once, now in the head).
- THE LANGUAGE gate: the crew commentary still 13.1% Spanglish over 12,000 lines, the long play 12.2%. Its one stale leg (the
  veteran's lesson moved from TEACH[k] to 'base', still through the dial) re-aimed.
- THE SPOILS gate run on this build: 18 passed, 1 failed; E1 passed in the real game (DESI: "That's the toll. Paid in full." over
  THE RAIDERS ARE DOWN). The failure is the walk's perk tap after D5 (the crew door's #pick), and it fails the same with main's own
  crew screen swapped in, so it is not this round's; it stops the walk before E2 (the loss is shown in the phone shots instead).
- THE CREW'S COMMENTARY gate (the fight's calls, which now draw from 7 win lines per type): 10 of 10 on a good run; its 'a better
  enemy is called by name' leg flakes on main's own fight too (1 of 3 runs failed on main, 2 of 3 on this build): PLUMBER.
- Phone shots: slices/vote/WORDS_THE_SURVIVORS_WORD_11_2.webp (six end-screen bars), slices/vote/WORDS_THE_KILL_TALLY_11_2.webp (the
  hold card on the end screen, 23 kills, best the Pot's Foreman; and the crew screen's line under his level).

## 5. WHAT IS LEFT

- The camp and map holds are proven by the gate's wires, not driven by a finger on a phone yet: EYES on a real phone.
- The shell's one voice (BOHEMIA_VOICE) still says the fight's own win call over the recap card; the end screen's man says his line
  with his mouth only. One voice for the end screen's line is SOUNDS' when they want it.
- Spanglish twins exist for the plain win, flawless, a loss and pulling out; the other five ways it went are English only for now
  (the dial falls back to English).
- Lines are draft:true attempts: the VOTE tab carries the sheet; his picks retune the voice.

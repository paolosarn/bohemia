# WORDS [the keepers' lines] -- ONE ROUND (words-8dqrnq). Rule 80b, THEY SPEAK SPANGLISH.
PEOPLE [the keepers speak] names the mouths; the lines live where RUN TWO already built the
hooks for them (slices/BOHEMIA_SETTLEMENT_SCREEN.html's KEEPERS array and openB(), and
records/target/settlement_traits.json's says{} object). THIS FILE IS THE DELIVERABLE: it
edits neither file (ONE SYSTEM, ONE SESSION, rule 55); RUN TWO and PEOPLE apply what they
want.

## WHAT IS ACTUALLY THERE ALREADY, MEASURED FIRST
Five keepers: RUBEN the smith, IRMA the armourer, CHUY the barber, DOC ROSALES at the
clinic, THE ELDER at the board. Each already has a default hello line (RUBEN "Fixed,
sharpened, loaded. Pick one.", IRMA "If it stops a pipe, I sell it.", CHUY "Sit down. A new
cut, a new face, one battery. Who are you becoming?", DOC ROSALES "Leave them with me. I can
halve the days, if you can pay.", THE ELDER "This is what the block needs. Pay is said now
and it does not change."). Traits (raided, sickness, market day) already exist and already
talk, but only through ONE shared "any" line and one "hall" override; none of the five
keepers below has its own reaction. No rumour hook exists for any of them at all; the bar is
the only building with one.

## THE PRICE: EACH KEEPER'S EXISTING HELLO ALREADY DOES THIS JOB, CHECKED NOT REWRITTEN
Re-read all five hellos against what they actually sell: CHUY's and DOC ROSALES' already
name how the cost is decided (one flat battery; halved days for batteries). RUBEN's and
IRMA's do not name a number because neither keeper HAS one number (every piece and every
set of armour prices itself); THE ELDER's does not either, because every job's pay is its
own skull count. Rewriting these to force a number in would be inventing a flat price where
the game deliberately has none. Nothing to fix; said once, not touched.

## THE TRAIT LINE, FOR RAIDED, SICKNESS AND MARKET DAY, PER KEEPER (new, 15 lines)
RAIDED (price up, stock down, nobody wants to sign on):
  RUBEN: "Everybody wants a blade fixed since the raid. I am three deep already."
  IRMA: "Half my stock walked out the door with the crew that hit us. What is left costs more."
  CHUY: "Nobody wants a new face right now. They want their old one back."
  DOC ROSALES: "Three of mine from the raid are still on the cots. I am not taking anyone new today."
  THE ELDER: "Nobody wants to leave the block long enough to work a job, not since the raid."

SICKNESS (price up a little, nobody wants to sign on, the clinic is busy):
  RUBEN: "Keep your hands off my tools if you have been near the clinic."
  IRMA: "I am not touching a man's armour until the cough clears. Bad luck, same as bad metal."
  CHUY: "No cuts while the cough is going around. I am not catching it off your collar."
  DOC ROSALES: "Half the block is on my cots already. I have no room for anything new."
  THE ELDER: "Nobody wants a job that takes them near the sick houses. I do not blame them."

MARKET DAY (price down, stock up, more recruits):
  RUBEN: "Everybody wants a blade sharp for market day. Busy, but good busy."
  IRMA: "Sold three pieces before noon. Market day does that."
  CHUY: "Everybody wants to look good for market day. Sit, sit, there is a line."
  DOC ROSALES: "Quiet today. Even the sick ones are out at the market."
  THE ELDER: "New faces in town for market day. A few of them want work."

WIRING, NOT A WORDS DECISION: traitLine(k) already falls back to says.any when no
keeper-specific line exists (slices/BOHEMIA_SETTLEMENT_SCREEN.html line 190); adding a 'k'
key alongside the existing 'hall' key in each trait's says{} object in
settlement_traits.json is the whole change, nothing in the lookup logic moves.

## ONE RUMOUR HOOK PER KEEPER (new, 5 lines, the bar's own pattern, never a quest card)
RUBEN: "A guy came through trying to sell me a gun that still had a factory seal on it. Did not ask where he got it."
IRMA: "Somebody is selling car doors off a whole lot out past the wash. Real cheap, if you do not ask why."
CHUY: "A woman asked me for the same haircut three different men had, same week. I did not ask why either."
DOC ROSALES: "A man came in talking about a chip under his skin, swore it kept him alive once. I did not look. Gracias a Dios, some things stay closed."
THE ELDER: "There is a contract nobody has posted yet. Something about the old robotics plant by the airport. Not ready to talk about it."
GROUNDED, NOT INVENTED FRESH: DOC ROSALES' hook reuses this lane's own locked chip-body
canon (the wiederganger finding, rule 63); THE ELDER's hook reuses rule 81's robotics plant,
the same source this round's enemy renaming drew from. Neither rumour claims a new mechanism,
both point at what is already true in the game.
WIRING, NOT A WORDS DECISION: the bar's nextRumour() already rotates a per-place, per-day
seeded pick from a list; the same shape (one line per keeper, said once per visit the way
traitLine already is) is the obvious reuse, not a new mechanism.

## RULE 27 AND THE UNBUILT-RULE CHECK
Spanglish only where that keeper already speaks it in the shipped lines (RUBEN, IRMA, CHUY
and DOC ROSALES all carry a Spanish word in their existing dialogue; THE ELDER carries none,
so THE ELDER's five new lines stay plain English too, matching the voice already set rather
than inventing one). The player never speaks in any of these twenty lines; none of them is a
line he says. Nothing above claims a mechanism the game does not have: the trait lines only
react to states that already exist and already move prices; the rumour hooks name things
already true in the lore, never a new one. All twenty swept for em dash: none found.

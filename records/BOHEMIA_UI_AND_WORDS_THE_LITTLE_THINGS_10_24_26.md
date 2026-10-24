# UI + WORDS -- THE LITTLE THINGS (10/24, rule 150, BUILD 10/24r)

Paolo 10/24: 'there's a lot that's not really correct and right... this is the shit you have to stay on top of, all these
little things; I can't be explaining all these little things to you; you have to build these things.'
EYES' playtest (records/BOHEMIA_EYES_THE_PLAYTEST_10_24_26.md) filed four UI rows and five WORDS rows. WORDS is closed this
round (rule 121), so its five ride with UI, its line files touched for these rows only (a NOTE on WORDS' board).

## UI
- [eyes: the gear on top] (item 14). The shell's floating gear came back whenever a screen covered the map's bar, so it
  floated over the crew screen's FRONT and HITPOINTS and over the town's picture. Now it steps aside for good once the map's
  bar carries its own gear; a screen over the map has its own way out (DONE, LEAVE, the fight's bar) and the settings are one
  tap away on the map's bar. slices/bohemia_ui_materials.js tbPaint.
- [eyes: the empty phone] (item 20). The closed phone was 156 x 338 for two job cards (the bottom 190 points black glass).
  It is now as tall as what it holds: the hour, the jobs, and a 48-point home strip with the home bar drawn on it (the one
  place on the face that opens the phone; a job card marks the road). Measured on the demo map at 390 x 844: 156 x 185, never
  past 19.5 by 9. PHONE_CSS. Gates re-aimed: the phone is never TALLER than 19.5 by 9 (phone_object_gate, the_phone_turns_gate,
  the_phones_look_gate), and the_phones_look_gate holds 'no empty slab' with the old full-height slab planted and caught.
- [eyes: the cut name] (item 25). 'OCTAVIO ELLI' on the fight bar. The plate now shows the whole name when it fits, else the
  first name ('El Guero' keeps its El), and a first name longer than the plate drops a half point at a time (never under 8)
  instead of losing letters. Measured: Octavio Ellison -> Octavio, El Guero Salas -> El Guero, Maximiliano Ellingsworth ->
  Maximiliano, Bartholomew whole. slices/BOHEMIA_FIGHT.html hud().
- [eyes: four spellings] (item 26). '290 BATTERIES', '30 batt', '1 battery', '138b', 'Pay 45 battery'. One way now: in words
  always 'N batteries' / '1 battery'; on a tile with no room, the number and the bar's own battery mark (em.money, the kit's
  supplyIcon). The settlement screen (shop, sell, board, hall, bar, clinic, build), the crew screen's wage ('1 BATTERY A DAY'),
  the hire's night ('2 batteries a night'), the contract line ('Pays 45 batteries').

## WORDS
- [eyes: the broken template] (item 23). 'You dropped his wallet.' and 'I was RIGHT next to Octavio Ellison!'. The fill is
  callName(): a mate by his first name, YOU as 'the boss' (sentence-initial 'The boss'), a man of theirs by his whole name.
  THE CREW'S COMMENTARY gains a leg holding the two broken forms.
- [eyes: the lot's line] (item 27). The lot's keeper is YOU, and traitLine fell back to the place's 'any' line, a keeper's.
  YOU now says only a line written for him (records/target/settlement_traits.json gains a 'lot' line per trait, draft), and
  YOU's lines never roll Spanglish (the first votes: the player does not speak it).
- [eyes: no run saved] (item 28). 'CONTINUE  NO RUN SAVED' -> 'NO GAME SAVED'; 'YOUR RUN' -> 'YOUR GAME'; 'YOUR RUN IS KEPT
  ASIDE' -> 'YOUR GAME IS KEPT ASIDE'; the workshop's export line likewise.
- [eyes: twelve in a fight] (item 29). 'START 290 BATTERIES · 3 MEN · 12 IN A FIGHT' -> '290 BATTERIES · YOU AND 2 MEN · ROOM
  FOR 12 IN A FIGHT' (the first man is YOU; the cap said as room). Three gates re-aimed to the words.
- [eyes: one blocks] (item 30). '@church · 1 BLOCKS W' left the glass with the phone's two jobs (10/24m); the plates and the
  job line that could still say '1 BLOCKS' now say '1 BLOCK'; 'Pay 45 battery' -> 'Pays 45 batteries'.

## NOT DONE, SAID
- The hall says '2 batteries a night' and the crew screen '1 BATTERY A DAY': the spelling is one, the two numbers still
  disagree (EYES item 16, RUN TWO's row [eyes: two cards disagree]).
- The crew screen's '3 / 20' against the bar's '3/12' is RUN TWO's [eyes: one company number].

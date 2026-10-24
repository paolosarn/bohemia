# THE PHONE SHOWS TWO JOBS (UI [the phone shows two jobs], rule 148, 10/24/26)

HIS WORDS (Paolo 10/24, LOCKED): 'the phone really should only be displaying the top two jobs, the two highest paying
jobs in the whole Bohemia city, and it doesn't need to display so much information, it's overkill with the amount of
text you put on the phone.'

## MEASURED BEFORE (the demo, BUILD 10/24j, 390 x 844 phone profile, through tools/bohemia_drive_the_demo.js)

The phone on the map, 156 x 338 points, carried 226 words on its face:

- two job posts, NEAREST first, one per place: a handle and the distance (`@CHURCH · 2 BLOCKS W`), the ask in two
  lines (`Ride shotgun to the salt camp`), the skulls, `30 BATT · JUST POSTED`;
- then the chat stream, twenty-odd posts (`@waterline queue at the standpipe already. bring something to sit on.`),
  repeating, running off the bottom of the glass.

The nearest jobs were 30 and 60 batteries while five jobs in the valley paid 90.

## NOW (BUILD 10/24m)

The face is the hour and two cards, 13 words in all:

```
06:00                     ▮▮▮ [batt]
| Bring the crates            |
| ★★★  [batt]90          MOB  |
| Ride carts to Primm         |
| ★★★  [batt]90         REDS  |
```

- THE TWO THAT PAY MOST IN THE WHOLE VALLEY: every open ask at every place (the same pick the settlement's board makes,
  RUN TWO's shelf), sorted by pay, then stars, then the nearer; two DIFFERENT jobs, from two places when the pay allows
  (measured: the shelf deals the same job to two fortresses, and two cards with the same words read as one job shown
  twice).
- ONE CARD A JOB, 44 points for a thumb: the short what (one line, at most 20 letters, printed in ROM), under it the
  job's stars (146(e): the hire's 7-point star from BohemiaMaterials.stars; the job's skulls until RUN's [the job's
  stars] hands a `stars` field, which the phone reads first), the pay beside the top bar's own drawn battery (no word
  BATT), and the place stamped in CASING at the right. No handle, no distance, no age.
- THE SHORT WHAT is a data file a modder edits, records/target/BOHEMIA_PHONE_JOB_WHAT.json, one line per job id (43:
  the 39 on the shelf and the settlement's 4), draft:true. Cutting titles by rule made nonsense ('Bring the little',
  'Take back', 'Hunt the pack that'), so every line is written. A job with no line shows its own title cut to the glass.
- NOTHING ELSE UNTIL TAPPED. A tap on a card lights it amber, shows the job's full words (`Bring up the crates from
  Sunrise`) and the one touch that goes (`TOUCH MOB ON THE MAP`), marks the road on the map (BOH_PHONE_ROUTE, RUN's map
  draws it) and beats with the road's dots; a second tap clears it; the phone itself does not open. A tap on the rest of
  the phone still opens the phone. Accepting stays at the settlement's board, from a mouth (51c).
- THE CHAT STREAM IS OFF THE FACE: #cityfeedlist and its fade are hidden by the materials; the stream still runs
  underneath for anything that reads it, and nothing in the city file changed.
- The glass under the two cards is the cracked phone's dark screen: his object (9/23 a cracked iPhone, 9/27 one crack)
  keeps its 19.5 by 9 shape.

## FILES

- slices/bohemia_phone_board.js (UI's): the pick (best paid, two jobs), the card, the what table, the tap.
- slices/bohemia_ui_materials.js (UI's): the card's look, the chat stream off the face.
- records/target/BOHEMIA_PHONE_JOB_WHAT.json (new, data, draft:true).
- gates/the_phones_board_gate.js (UI's) re-aimed to rule 148: 18 ok, 0 failed on the demo (the two that pay most, two
  jobs, at most 16 words and no chat post on the glass, one line of at most 20 letters, 44 points, ROM/CASING, the
  stars and the battery drawn, 4.5 to 1 in the sun, the finger marks it and shows the full words, the place's own board
  agrees, taken at the board it leaves the phone, no page error).
- The demo re-cut (BUILD 10/24m - THE PHONE SHOWS TWO JOBS); the demo loads the phone's code live from the city file.

## WHAT THIS DOES NOT DO

- The settlement's own board still draws skulls; that is RUN's [the job's stars], which also decides each job's stars
  from its party against your company. The phone reads `stars` first the moment it exists.
- The opened phone (the full-screen phone a tap on the phone opens) is a separate page and was not cut this round.

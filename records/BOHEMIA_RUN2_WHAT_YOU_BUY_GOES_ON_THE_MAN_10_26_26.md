# WHAT YOU BUY GOES ON THE MAN (RUN TWO, 10/26/26, rule 210)

Paolo 10/26: "I love the idea of shopping for something and seeing where it's best ranked for your company, but then if I
buy it, depending on whichever person I select it looks best on, it auto-equips to them."

## MEASURED BEFORE
- BUY put every piece in the stash ('Yours. It is in your bag.'). To use it he opened the crew screen and dragged it onto
  the man the shop's card had just shown it on.
- A new game has NO crew-screen files at all (no bohemia.company.v1, no bohemia.climb.v1) until the crew screen is opened
  once; measured on the demo's Church at the first visit. So the shop had nothing of the crew screen's to write a man's
  new gear into, and the fight's door hands the origin's rolled men from BOH_START.picks().

## NOW (BUILD 10/26n)
- The card's man (the one it suits best, or the face he tapped in the strip) gets it on ONE tap: 'Buy it, Desi wears it'
  (YOU: 'Buy it and wear it'), the price on the button. His old piece goes to the stash, kept (worn, so chosen; SELL THE
  JUNK leaves it). One plain line (draft:true): 'Desi wears the plated dune plate carrier. His belt-leather padded vest is
  in the stash.'; a weapon is carried; a two-hander is taken in both hands and his shield goes to the stash with his old
  weapon, and the line says both.
- A small dashed 'to the stash' under BUY keeps it unworn (rule 210(c), the coordinator's default).
- A shield for a man holding a two-hander has no hand to go in: the card says so (as before) and BUY goes to the stash.
- engine/bohemia_shop_wear.js (new, 60 lines): the shop writes what each man now wears, one line a man and a slot
  (bohemia.wear.v1). Three readers lay it over the company they have: the shop's own next card (shopCrew), the fight's door
  (the alpha's nfOpts, __WHO_YOU_HIRE_FIGHTS__) and the crew screen (open(), after loadClimb, which then empties the file;
  its climb and hand-over hold the gear from there). A reader that finds a man in a piece the shop never saw puts that
  piece in the stash, so nothing is lost. When the hand-over, a hire's card (bohemia.hired.v1) or the climb already hold the
  man, the shop writes them too, at once. NEW GAME forgets the file.

## GATE
WHAT YOU BUY GOES ON THE MAN 12/0 (gates/what_you_buy_goes_on_the_man_gate.js, in the suite): the demo, a new game,
Church's armourer and smith by real taps, the phone and the computer. B1 the card and BUY name the man, both buttons 48
points; B2 one tap, purse 5000 -> 4975 for the 25 shield, his sedan car door in the stash kept, 'You wear the police riot
shield. Your sedan car door is in the stash.'; B3 the next card reads him in it; B4 the card chose YOU, DESI's face tapped,
DESI wears the plate carrier; B5 'to the stash' keeps it unworn; F1 the fight page, the crew screen never opened, stands
YOU with the kite shield and DESI in the plate carrier; C1 the crew screen by the town's CREW shows both, the car door in
the stash, the file emptied, the hand-over holding them; C2 a buy with the crew screen's files present writes the hand-over
and the climb at once ('Desi carries the good fire axe. His pistol is in the stash.'); K1 the computer by a click; K2 the computer's crew screen shows him in it and took the file.
FOUND AND FIXED ON THE WAY: on the computer the crew screen's own boot can open on the default twelve before the crew door's
post lands (__THE_DOORS_COMPANY_WINS__); taking the lines there gave them to the default men and emptied the file, so DESI
opened in his old heater shield (THE SHOP SAYS W1 caught it once). On the default crew the lines are now only laid over;
the door's company takes them.
Re-aimed: THE SHOP SAYS WHAT IT DOES TO YOUR MAN W1 (it bought to the stash and dragged it on; it buys it onto him now and
reads the crew screen with no drag) 10/0. Green beside it: A TWO-HANDER WEARS ITS OWN NAME 8/0, GEAR NEVER VANISHES 6/0,
equip from the stash, every item has an icon, the one-file loop, the settlement screen, WHO YOU HIRE FIGHTS 21/0, THE
ARRIVAL 37/0 (both red once only when nine browsers ran at once on this box; alone green, and green on clean main),
DEMO BUILD 25/0, ROSTER SCREEN 15/0, THE CREW SCREEN READS THE STASH 23/0, THE COMPANY SCREEN 48/0.

## OWED
- Rule 223/224: the ON A MAN lines still read 'X to Y'; UI's one stat component swaps them when it lands (UI's row).
- EYES sees it live (line 131).

[bb Battle Brothers sells into the stash and every piece is dragged on by hand; ours puts it on the man the card chose.]
[analog horror: the line is a receipt read aloud, the old piece goes in the stash like a coat left on a hook.]

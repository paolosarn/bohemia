# PAOLO 10/26: THE CAMP IS YOUR OWN SETTLEMENT AND IT GROWS; THE BARS OVER THEIR HEADS; NO TILE NAME ON THE BAR; THEY HEAL ON THE MARCH (LOCKED, rules 260, 261, 262; amends 257(b), 259(b)(e))

## HIS WORDS (verbatim, voice to text, three messages)
"Like the visuals of the camp and what's going on the camp and how the camp is growing or whatever like if it's just one person
like it'll just be like one tent you know I don't know maybe two people can fit in a tent you know and maybe there's a shopping cart
remember, you can go go back in the project files like the caravan the first thing it's gonna be a shopping cart right so there's
gonna be an evolution of a bunch of different things and icons and parts of the game, but keep in mind bro, like the camp screen is
gonna be the camp like settlement vibe like it's gonna be very important to me"
"Like I need I need the HP total and the armor repair total like displaying on top of my character right now anytime if they're at
full health with everything then it never has to display you know and if it's if everything's above 90, maybe like it goes away too,
but still like maybe when it's about when when it's above 87% it doesn't display anymore but yeah I need that like immediately cause
I need to be able to see how everyone's healing and when I'm in camp mode then their health if they're fully healed everything's
good nothing will display on top of their heads but yeah I should. It should be a lot easier to see my health type shit. Also on the
top of the UI screen. I don't need to see that I'm on a freeway or something I don't need to see like that can just be for
yourself, but the character doesn't need to see that like they can see that visually right like the type of street tile they're
on or whatever they don't need to see that but yeah."
"And of course, as they walk, their shit is healing too right and maybe even at the same rate but sometimes you just gotta stay in
the same place in here you know, depending on whatever the fuck's going on like so yeah cause you never know as you run around the
city like if you're gonna get attacked or not so yeah"

## THE COORDINATOR'S CORRECTION, HONESTLY
Rules 257(b) and 259(b)(e) (minutes before) told CAMP to stop opening the camp as a screen and to fold RUN TWO's camp screen into the
phone. His words now: the camp screen is the camp, a settlement vibe, very important to him. Those clauses are struck; the two
queued messages that carried them were paused before they were delivered.

## WHAT IS THERE (measured on main)
- The cart: laws/BOHEMIA_ADDENDUM_THE_CART_AND_CAMP_7_24_26.md (LOCKED 7/24): the first carrier is a hand-hauled SHOPPING CART, a
  quest's salvage turns it into the smart cart that follows on its own, cars come late; the camp deploys from it.
- Healing on the march is already built (CAMP 72835dfb, engine/bohemia_condition.js): 1 hit point an hour marching, 2 camped,
  armour mended 3 an hour and twice that camped (Battle Brothers' way: camping speeds it). BUILT, not yet seen by EYES.

## HOW BATTLE BROTHERS DOES IT (rule 33; recall, marked)
In a fight every man carries a small hit point bar and an armour bar under him. On the world map nothing shows over the party. Its
camp is a toggle with a tent icon; the Retinue's followers sit on their own screen. The terrain is never written on the screen; you
see it.

## THE RULINGS
260. THE CAMP IS YOUR OWN SETTLEMENT, AND IT GROWS
(a) THE CAMP SCREEN IS THE CAMP, A SETTLEMENT OF HIS OWN: making camp opens his camp the way a town opens (the settlement screen's
    vibe and its taps): its picture is his camp, each part tappable like a town's building: the tents, the cart (the stash), the
    fire, each follower's spot (the cook's grill, the doc's table); his men in it doing their camp acts by their condition (259(a)).
(b) THE CITY STAYS IN SIGHT: from the camp he pinches out (or taps the map) to the live map, the camp at its spot and time running
    (257(a)); the feed and the news run on the phone; a party coming for the camp is shown and an event asks him first (257(c)).
    It is a place, never a wall that hides the world. AMENDS 257(b) and 259(b)(e): the camp's settlement screen stays.
(c) IT GROWS WITH THE COMPANY: one man, one tent; a tent for each two men; the CART first, a shopping cart hauled by hand (the 7/24
    law), the smart cart after its quest, a bigger carrier later; every follower adds his piece; an upgrade shows in the picture, in
    its icon and on the phone's CAMP app. The evolution is the story told in things.
(d) He can camp in a town too (259(c)): there his camp is in the town's picture.
(e) THE GATE: camp with 1, 2, 5 and 12 men: tents equal men over two rounded up; the cart is drawn and opens the stash; a follower
    hired adds his piece; pinching out shows the live map with the camp at its spot; the phone's app and the picture agree.

261. THE BARS OVER THEIR HEADS, WHEN THEY NEED THEM
(a) Over each of his men, wherever he is drawn outside the fight (the map's party at the close end, the camp, the town's picture), a
    small hit point bar (red) and armour bar (grey), Battle Brothers' fight bars, from the man's own condition.
(b) THEY HIDE WHEN HE IS WELL: when both are at or above 87 percent of the man's maximum, nothing shows over him (his number); a fully
    healed company at camp shows nothing over anyone. As a man heals the bar fills, and it vanishes at 87.
(c) In the fight the bars stay as the fight draws them (rule 230's cover mark beside them).
(d) It ships FIRST in CAMP's queue after 234 (his word 'immediately').
(e) THE GATE: a company with a man at 40 percent hit points, a man with armour at 60 percent and a man at 95 percent of both, on the
    map's close end, at camp and in a town, phone and computer: bars over the first two only; each bar's fill equals his number over
    his maximum within a pixel; at 87 percent the bar is gone.

262. NO TILE NAME ON THE BAR, AND THEY HEAL ON THE MARCH
(a) The top bar never writes what ground he is on ('FREEWAY', a street's kind): he sees it. It may stay in the code for the game's
    own use; never on his screen.
(b) His men heal while they travel, Battle Brothers' way, and faster at camp (built: 1 an hour marching, 2 camped; armour 3 an hour,
    twice camped; TUNING's table); the bars of 261 show it filling as they walk. Camp stays worth it when the road is dangerous.
(c) THE GATE: no screen's bar shows a ground or tile name, phone and computer; a man at 50 percent walking six map hours gains six hit
    points (the table's rate) and his bar shows it.

Rows: CAMP [the bars over their heads] FIRST after 234, [the camp is your own settlement] and [the camp grows] with [you see your men
at camp]; UI [no tile name on the bar]; NOTEs RUN, RUN THREE (the bars' hooks), RUN TWO (its camp screen stays and is the camp's
settlement screen), UI TWO (the CAMP app mirrors the camp), COOK (the camp's pieces and the cart's evolution), ANIMATION; lines 187 to
190; EYES checks.

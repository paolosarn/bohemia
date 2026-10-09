# UI [phone contracts]: THE PHONE SHOWS WHO IS OFFERING WHAT, AND CANNOT ACCEPT (10/9/26, ui-kmqmrf)

The row (rule 51c, Paolo 9/30: 'one main quest, two contracts; the phone only shows'): on the cracked phone in the city
view, the settlements' open contracts right now, as the feed's 'what the world did' posts: a place posts its ask, the
post ages, a taken one disappears; tap one and the map shows the route (RUN); NO accept button on the phone; accepting is
the settlement screen's offer from a mouth.

BUILT:
- slices/bohemia_phone_board.js (new, UI's), included by BOHEMIA_CITY_WORLD.html in one line after the materials.
  ONE SOURCE OF THE JOBS: it fetches RUN TWO's slices/BOHEMIA_SETTLEMENT_SCREEN.html as text and reads its own OFFERS
  and TIER_OFFERS, so the phone can never offer a job the place does not (nothing copied, nothing invented; if the list
  cannot be read the board shows nothing). The places, where they are and how big: the map's ctBases() and mapTierOf();
  what is taken: the map's LOOP.held. Each place offers as many asks as its tier's board does (camp 1, town 2,
  fortress 3), skipping taken ones, the settlement's own rule. 28 open asks in the valley at the start.
- On the glass, above the feed: the TWO NEAREST PLACES' asks, one per place, each a world post: '@CHURCH · 2 BLOCKS W'
  (the way on the 45-degree screen), the ask in the settlement's own words, the skulls drawn, '60 BATT · 3H AGO' (the
  age from the game's clock since the place first posted it).
- A tap marks it: the post lights amber and window.BOH_PHONE_ROUTE = {place, x, y, id, title} with a
  'bohemia-phone-route' event; the tap does not open the phone. A second tap clears it; a taken job clears its mark.
- The look in slices/bohemia_ui_materials.js: MARKS.skull (12x12, cream on the glass, ink on amber), the board's posts
  44 pt and more, CASING handle, ROM ask.

FOR RUN (the row's own split): the map does not draw a route unless the party is travelling (render draws TRAVEL.path
only). Drawing BOH_PHONE_ROUTE's path from the party to (x, y) while it is set, with the same dashes as a travel, is the
other half; listen to 'bohemia-phone-route'. The phone already says the distance and the way, so it is usable before.

MEASURED: gates/the_phones_board_gate.js 15/0 on the demo through the one driver: two posts from two places (Church,
Colorful); nothing on the phone says take, accept or sign; posts 138x66 inside the glass; words 10 to 12.7 to 1 plain, 5.0
to 6.1 in the sun, the marked one 9.0 / 5.1; a real finger marks Church's road crew (47, 50) without opening the phone,
a second tap clears; three game hours later both read 3H AGO; THE PHONE AGREES WITH THE PLACE: Church's own board, opened
with a real finger, offers 'Run the road crew off the corner' at two skulls and 60 batt; taken there with a real finger
(Take it), it is gone from the phone and from every place's asks.
EIGHT MUTATIONS, each restored: no include -> 2 red (and the run stops); an invented job -> 1 (NOT CAUGHT FIRST: the gate compared only the one post on the glass, and a real two-skull job outranked the fake; it now compares every ask the phone holds for that place with the place's whole board); taken stays -> 1; a tap opens the phone -> 3; one place twice -> 1; never ages -> 1; the marked ink stays light -> 1; an accept button -> 1. Clean: 15/0.
VOTE: ui-the-phones-board-10-9, sheet slices/vote/UI_THE_PHONES_BOARD_10_9.png (before, after, a job marked).
NEIGHBOURS: the screen's own face 14/0, the reshuffle mark 9/0, the bar fits his glass 22/0, no two texts overlap 14/0,
the feed is a phone 22/0. THE PHONE'S LOOK went 14/1 with the board on the glass: its sun leg wanted two whole feed
posts and only one fits under the board now; the board's asks ARE world posts, so the leg reads them too (3 posts,
worst 5.12 in the sun) and is 15/0. Widened to count what is on the glass, not loosened.

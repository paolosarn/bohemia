# WORLD TWO [where it sells best] (rule 266(b), Paolo 10/26) -- THE MAP KNOWS WHAT HE KNOWS

HIS WORDS (verbatim, voice to text; 'matt mode' is map mode): "in battle Brothers, you can buy goods from you know whatever type of
settlement it is, bro there's so many like luxury goods that you can you can buy just to move them around to different parts of the
city and sell them off for higher income, so yeah, I don't know if there's a way that we can visually even like let people know that
from the matt mode that was one of the more frustrating parts of my battle Brothers experiences like I didn't know off the bat like
which city like they are they have the best selling price of my goods you know so keep that in mind"
Ruling record: records/BOHEMIA_PAOLO_TAPE_AT_EVERY_STALL_TRADE_GOODS_AND_THE_MAP_SHOWS_WHERE_IT_SELLS_10_26_26.md (266(b), (c)).
Row: WORLD's board, [where it sells best], FOR WORLD TWO, CLAIMED 298119cc.

## 1. HOW BATTLE BROTHERS DOES IT, AND WHAT HE HATED
The ruling's own reading of the wiki copy (ECONOMY day 68 s1b): a trade good is bought where its attached location makes it at the
plain price and sold back there at 15 percent; every other town pays 110 percent; nothing on the world map says which town pays most;
you learn it by visiting. That last part is his frustration. ECONOMY [trade goods] (82b181fc) put the twelve goods and their makers in
records/target/bb/stall_prices.json (trade) and the price call in engine/bohemia_stall_prices.js (tradeSell).

## 2. WHAT WAS BUILT (the map's half; the stash's tap is RUN TWO's)
REALISM FIRST (the 8/4 law): the map shows what HIS COMPANY KNOWS, never the valley for free.
- WHAT A STALL TOLD HIM: arriving in a town, its screen posts what its stall pays for one of each trade good today (one marked line
  in RUN TWO's BOHEMIA_SETTLEMENT_SCREEN.html arrive(), through a new named call tradeSellHere(id): ECONOMY's tradeSell with that
  town's tier, its cards' sell knob and what it thinks of him, relBase = relPrice().buySub as ECONOMY's NOTE says), exposed for the
  stall's own sell button as BohemiaSettlement.tradeSell(id). The map keeps it by town with the day (bohemia.hismap.v1, his game).
- WHAT HE HEARD: window.mapPriceHeard(place, good, value, day) records a price from the feed or the bar (FEED's posts, NOTE); the
  newer of what he saw and what he heard is what he knows.
- THE MARKS: window.mapSellMarks(good) (the stash's tap; null lets go): every town on his map marked by what it would pay for one,
  best first: a battery that grows with the price, the number on a plate ('BEST 44' on the top one, which is ringed), 'HEARD' on a
  heard price; a price fades as it ages (to a third at a month: a rumour); a town he has seen and never priced wears a question
  mark; a town under the static is not on his map unless he heard of it; the best one off the glass waits at the open glass's edge;
  'WHERE SALT SELLS' at the top of the open glass (never under the phone, RUN's mapOpenArea).
- The maker's own low price shows as it is: the Blues make salt and pay 5 for it, the Trades pay 44 (the phone's run below), which is
  Battle Brothers' lesson made visible: carry it away from where it is dug.

## 3. THE GATE: gates/where_it_sells_best_gate.js (WHERE IT SELLS BEST), the stranger's game, phone and computer
W1 standing in the first town, the map knows all twelve prices and each is the stall's own (BohemiaSettlement.tradeSell);
W2 a tap on a second town, the map's own walk: that one known too, nothing else; W3 the marks for SALT: the known towns best first
with their prices, the best ringed, a question mark on the seen and never priced, nothing on the towns under the static; W4 a price
heard for a town never visited marks it HEARD, and twenty days old it fades to 0.35 against 1.0 today; W5 null takes the marks away;
W6 reopened, what he knows is still known; W7 nothing threw.
RESULTS: phone 7/0 (first run: Blues 12 of 12 the stall's own, salt 5; Trades 44; ? Church, Remnants; 10 of 14 towns under the
static); computer: see the handoff.

## 4. ROUTED
RUN TWO: the stash's tap on a trade good calls window.mapSellMarks(id) (the city frame's), and mapSellMarks(null) when it closes;
  BohemiaSettlement.tradeSell(id) is this town's price for one, for the stall's sell button; one marked line and one named call in
  your screen (__HIS_MAP__).
FEED: a post that tells a town's price for a good calls window.mapPriceHeard(place, good, value, day) on the map (the coordinator's
  [prices heard] NOTE; ECONOMY's tradeSell for that town on the post's day).
ECONOMY: the numbers are yours, read as your NOTE says.
EYES: tap a good once the stash holds one.

[bb money] Battle Brothers never tells you which town pays most; you walk it, or you lose the trip. Ours remembers what each stall
  told you and what you heard, and puts it on the map.
[analog horror] an old price fades on the map like a polaroid in a wallet: you knew it once.

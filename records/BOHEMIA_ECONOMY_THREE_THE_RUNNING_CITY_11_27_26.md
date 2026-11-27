# THE RUNNING CITY, AND THE STALL'S DAY (ECONOMY THREE, 11/27/26; VAMILY rule 485(b)(c), rule 441)

Paolo 11/26 (rule 485): 'Lets go cyberpunk vibes but their world has a running economy vibes!' Cyberpunk 2077 belongs to the world's
construction and its running economy. (b) the city's money moves whether he is there or not, and he can see it: people go to work and
come home, stalls open, sell out and close, deliveries and caravans cross the map, gangs collect from their blocks, prices move with
what is scarce, a place that stops earning goes dark and one that earns grows. (c) research first, then built into what exists; nothing
pops up, no icons. This lane owns the money running and the research; WORLD 15 the districts and places showing it; WORLD 13 the
map's people and parties moving it. The first build: THE STALL'S DAY (records/target/bb/stall_prices.json the_day; engine
theDay; the town's stall). Gate: gates/the_stalls_day_gate.js.

## 1. RESEARCH (cited; the research agent's findings, condensed)

CYBERPUNK 2077 IS A FEEL, NOT A SIMULATION. Vendor stock is authored and refreshes on a timer, prices never follow scarcity, no district
grows or dies [general knowledge]; the promised thousand NPCs with routines shipped as an ambient crowd [TweakTown 2020]. What makes the
feel: crowds placed by meaning, none in dangerous Pacifica [eip.gg 2020]; 'vendors crammed into corners and in-between spaces', a shop
at the foot of every block, two urban planners on the team [Aftermath, Cockburn 2025]; background people pinned to a spot looping a job
(cooking, eating at a counter, fixing a car) so a stall reads as working [general knowledge]; wealth as set dressing: Pacifica, a resort
whose investors pulled out, 'unfinished concrete skeletons and half-built towers' [Fextralife wiki]; turf as people standing around
(Valentinos near El Pinche Pollo, Tyger Claws' rackets in Kabuki) [PC Gamer 2020]. OURS RUNS FOR REAL where theirs only looks it.

REAL COLLAPSES. SARAJEVO 1992-96: cigarettes were money in winter 1992-93 [Vreme 1996]; two pounds of potatoes $50, sugar $23, meat $40
[JTA]; the sellers were whoever could cross, aid taxed at checkpoints and diverted to the black market [Andreas, Wilson Center]; the
airport tunnel charged 200 DM a family [Roanoke Times 1993]; when movement opened in 1994 siege prices collapsed [CSM 1994]; shelling
hit market crowds (Markale 1994) [Il Post 2014], so trade hid indoors. LEBANON 2019 ON: blackouts up to 22 hours a day [HRW 2020];
neighbourhood generator owners sold power by the amp [Jadaliyya], 44 percent of a monthly salary [HRW 2023]; the street rate moved
within the day, 'often increasing in the morning and decreasing in the evening' [Al Arabiya 2020]; shops repriced daily [UPI 2021].
VENEZUELA 2015-16: state stores by the last digit of your ID on set days, fingerprints and caps [NPR 2015]; bachaqueros resold at 5 to
10 times [Global Voices 2015], teams holding the front of overnight queues [Al Jazeera 2016]. ARGENTINA 2001-02: barter clubs priced in
créditos, supply and demand, collapsed late 2002 on fake and over-issued scrip [Wikipedia; Saiag 2019]. MOSCOW 1992: kiosks at
Sukharevskaya paying racketeers 'kind of like an insurance policy' [Los Angeles Times 1992].

BATTLE BROTHERS (the floor). 'Attached locations ... influence heavily the available goods' [1765_Settlements and attached
locations.txt]; a good made nearby is 'unusually low in price'; size sets the base (a City Hall with 8 locations buys at 1.34, a Village
Hall with 1 at 0.95) [1244_Market prices for various items.txt]. Situations: Ambushed Trade Routes '+20% buying prices ... -25% items
available', Good Harvest '+100% food available ... -50% food prices', Raided '-50% items available' [0054, 0888, 1626]. 'Locations
restock every 3 days with quality und quantity based on their current resources' [0626_Developer Posts.txt]; 'Buying raises the local
price, selling lowers it; prices recover over days' [reference/library/battle_brothers/07_ECONOMY.md]; caravans reaching a destination
raise both towns' resources, villages out of resources stop sending them [0626].

## 2. BUILT FIRST: THE STALL'S DAY (the research's 'what to build first', item 1)

- THE STALL OPENS AT FIRST LIGHT AND SHUTS AT DUSK (06:00 to 20:00): daylight trade (Sarajevo, Lebanon's generator shifts). At night
  the food, meds and rounds say SHUT and the keeper says the shutters are down; the tape still sells through the back (rule 271: never
  without tape).
- A DAY'S STOCK, BY THE PLACE'S SIZE (food: a camp 6 nights, a town 14, a fortress 30; meds 2, 5, 10; rounds 3, 8, 16 handfuls), put
  out at first light (Battle Brothers restocks every 3 of its days; one of ours holds four to six of them).
- THE TOWN'S OWN PEOPLE BUY IT DOWN while he is away: a calm day leaves a fifth at dusk; a town short of it (its card) runs out
  sooner; each day its own luck, seeded by the place and the day (one town's rice gone by noon, the next one's lasts to dusk: Lebanon's
  price within the day, Venezuela's days by ID). What he buys comes off it too.
- THE PRICE CLIMBS AS THE SHELF EMPTIES, to twice the dawn price at the last unit (Battle Brothers: buying raises the local price;
  far under a black market's five to ten, because the stall is the honest price). The strip says how many are left today.
- SOLD OUT: the box says SOLD OUT and the keeper says what is gone for today.
- NOTHING POPS UP, NO ICON: the box, the keeper's mouth and the strip say it; the stall is what it was at first light.
- Measured on the demo, Caravans (a fortress, a market day): first light 30 nights of food at 3; at 19:30 one left at 6; at 23:00 SHUT,
  tape at 1, 'Shutters are down till first light. The tape is in the back, I can do that much.' (draft:true).

## 3. THE CALLS (rule 485's other owners, and this lane's next)

- WORLD 15 (the places showing it): a stall's keeper at his table by day and gone at night, the shutter down when it is SHUT or SOLD
  OUT, a queue at the scarcest good (Venezuela), a block's windows lit only while its generator is paid (Lebanon), a place that stops
  earning going dark (its treasury, the pockets book, is the earning; this lane can hand you a place's daily take on request).
- WORLD 13 (the map's people and parties): caravans hauling between a maker and a buyer, an arrival raising both towns' stock and a
  wreck lowering it (Battle Brothers' caravans and Ambushed Trade Routes); a gang's collector walking his blocks at a set hour (Moscow's
  kiosks; the rent already lands in the faction's pocket every night, BUILD 11/26e).
- THIS LANE NEXT: the stock follows the town's card (Raided half, a good harvest double: Battle Brothers' situations), a reseller
  outside a sold-out stall at five times (Venezuela), a caravan's arrival restocking the stall.

[bb Battle Brothers: a town restocks every 3 days from its resources and a raid halves what is for sale; ours, every first light, and a
day's buying shows by dusk]
[analog horror: a shutter coming down on a stall at dusk, the last can on the shelf, the price chalked over twice]

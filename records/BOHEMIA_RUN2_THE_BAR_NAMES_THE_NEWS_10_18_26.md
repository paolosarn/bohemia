# RUN TWO [the bar names the news], 10/18/26
# The new age (rules 112 to 117): opened by the coordinator, run to the end, no check-in, no question.

## WHAT IT ANSWERS
ECONOMY day 75 (records/BOHEMIA_ECONOMY_DAY_75_THE_RUMOUR_THE_NEXT_TOWN_HAS_NEWS_94_PERCENT_OF_THE_TIME_AND_THE_BAR_TELLS_NONE_10_18_26.md):
the next town has news 94 percent of the time and the bar had never told one. It read eleven fixed lines and no other
town; three of them promised 'Marked on your map' and nothing on the map draws a mark. The board's row: the keeper
says one line naming one real piece of nearby news on each visit, from a mouth with a fresh portrait, drawn from the
rumour data, nothing on a card; rule 117 minimalist.

## HOW BATTLE BROTHERS DID IT (rule 41, from the library, wiki pages via ECONOMY's page)
- 1931 Tavern Rumors: 'Each time you visit the Tavern you get 1 free rumor.' Up to 4 more for drinks.
- Update 1.4 and Dev Blog 138: rumours about 'situations of nearby settlements... so that you get a better idea of
  trading, recruiting and work opportunities nearby'; flavour cut to make room.
- A rumour never makes the thing it tells; it reads what is already on the map.
- The 2016 blog: the source and the doubt are in the mouth ('a traveler told me').

## WHAT WAS BUILT
- records/target/BOHEMIA_BAR_NEWS_PLACES.json, baked by tools/bohemia_run2_bar_news_places.py (same bytes every run):
  the 14 towns the map's loop arrives at (the faction seats in slices/BOHEMIA_CITY_WORLD.html CT_BASES_BAKED), where
  each is on the valley's 384 m cells, how a keeper says it ('over by the Mob', 'the Mob's place'), the reach (106
  cells, Battle Brothers' 30 of 140 scaled; every valley seat is inside it). Custom, the player's own slot, is never
  gossiped about. The region's far towns are not settlements the loop opens yet, so they are not named.
- records/target/settlement_rumours.json gains 'news': two ways to say each card the map's dice roll (sickness,
  market day) and each card FACTIONS' ledger writes (raided, conquered, well supplied), plus 'quiet'; {at} {of} {dir}
  {by} {ago}; the town and what is happening always in English (the language law), a Spanish word for flavour;
  no digit in a mouth ('two nights back'); draft:true. The eleven old rumours stay.
- slices/bohemia_bar_news.js: BohemiaBarNews.list({here, day, traits, ledger}) gives one item per town in reach:
  the ledger's live mark first (what really happened), else the town's roll from the map's OWN dice
  (engine/bohemia_livingmap.js traitsFor, the roll the map hands the screen on arrival), nearest first; the n-th town
  with the same card takes the next way of saying it, so two market days never come out word for word.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html: the bar's FIRST line each visit is the free one (newsFree), under the
  keeper's fresh talking portrait, nothing spent, posted as act 'news' {free, about, trait, line} for the map; the
  second time the bar opens it is the round's offer; a round (and a stranger with something to say) tells the next
  town before any of the old eleven; a new visit brings a new free one; 'Marked on your map' is gone from the screen
  (the act still posts the mark for the day the map draws one). No new button, no number (rule 117).

## MEASURED
- Over 14 seats x 52 weeks: 5,928 pieces of news, every one exactly the map's dice for that town that day; a free one
  on 728 of 728 visits (the valley's 13 tellable seats at 69 percent each leave about 1 in 4 million visits quiet).
- The Reds raid the Mob on day 2: at the Church on day 4 the first news is 'You hear about the Mob's place? The Reds
  came through two nights back and burned a house.'; on day 9 it is over.
- NEW GATE THE BAR NAMES THE NEWS 22/0 (registered), with a planted-lie control.

## THE FINDING THAT PROVES US WRONG
The screen's own roll for the place you stand in reads S.day, and nothing sets S.day: without the map's traits the
screen rolls week 0 forever. The demo always hands traits (the living map's roll on the map's day), so it never shows,
and the news reads the map's day (buildDay) so it agrees with what you find. Left as is (the living map gate lifts
rollTraits verbatim); noted for the round that touches the roll.

## ROUTED
- RUN (the map's listener, BOHEMIA_CITY_WORLD.html): act 'news' carries {about, trait}; the day the map draws a mark,
  it can mark the town the keeper named. Hand the ledger in BOHEMIA_SETTLEMENT_OPEN (owed since 10/18 c) and the
  keeper tells real raids, not only the dice.
- WORLD [the news down the road, as data]: when it lands, its items join the list in bohemia_bar_news.js; the dice
  and the ledger already cover every seat every week (rule 12: measured, the bar did not wait).
- LIFE + CITY (held): the phone's feed could post the same items as public news (ECONOMY candidate C).
- WORDS: the twelve 'news' lines are draft:true attempts in the keeper's voice.
- TUNING: the free one costs nothing (rule 117(a), easier than Battle Brothers' price for the rest).

[bb school line] Battle Brothers gives one rumour free each tavern visit and since 1.4 tells you what is going on in the
towns nearby; our keeper now does both, from the map's own dice and the raid ledger.
[analog horror line] The keeper says it low while the glass is still wet: they are coughing up north, the clinic has
boards on the windows. Nothing on the map changes. You only know because he told you.

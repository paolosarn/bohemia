# PLUMBER 2: ONE COMPANY, A MAN LET GO IS GONE EVERYWHERE (11/2/26)

Rule 327, ask line 325. Paolo, playing: "when I dismiss someone from my group, they have to be gone from all my [menus]...
it's supposed to be this universal code thing, come on... I dismiss someone in the camp, in the settlements, when I'm in the
menu trying to buy items, it still thinks they're part of my squad... come on."

## THE CAUSE, MEASURED

Every way to let a man go is the crew screen's DISMISS (slices/BOHEMIA_ROSTER_SCREEN.html dismiss), opened over the map (C), a
town's CREW or a camp's CREW; plus the road's "a man leaves" event (slices/bohemia_road_events.js manOut). DISMISS wrote him into
`bohemia.walked.v1` (dismissed:true) and rewrote its own hand-over (`bohemia.company.v1`, `bohemia.company.line.v1`) without him.
A HIRED man stayed in `bohemia.hired.v1`.

The shop's list (slices/BOHEMIA_SETTLEMENT_SCREEN.html shopCrew) read the hand-over, then merged every hired man back in unless
the crew screen's `known` list named him. After a dismissal the crew screen no longer knew him, so he came straight back from the
hired list, and the shop never read the let-go list at all. That list feeds THE SHOP'S GREEN 'ON HIM' MARK (onMan / shopMan) and
HIS MEN IN THE TOWN'S PICTURE (crewTown). That is exactly "when I'm in the menu trying to buy items, it still thinks they're part
of my squad".

The camp's fire (slices/bohemia_camp_look.js companyOf) drew the men the map handed it once at the visit, so a man let go on the
crew screen over the camp stayed at the fire until the camp was left.

The map's count (slices/BOHEMIA_CITY_WORLD.html crewCount: the top bar's number, the nightly bill, the fight's size, the party
plate) was arithmetic: the origin's length + the hired - the let-go - the taken - the dead. Right only while every list agreed.
The phone's company count (slices/bohemia_phone.js P.company) added the hand-over's length to the hired list's length, so a hire
already on the line was counted twice.

## EVERY LIST OF HIS MEN, FOUND

| where | what it shows | before | now |
|---|---|---|---|
| settlement shopCrew | shop's 'on him' mark, the town's picture of his men | merged the hired back, never read the let-go | reads the one company |
| camp_look companyOf (+ settlement campFolk, the old camp path) | the men round the fire | the map's list from the visit | the one gone-list filters it; the camp is laid out again on the change |
| map crewCount | the bar, the bill, the fight's size, the plate, the first-day cap | sums of four lists | the one company's count, by name |
| phone P.company | the phone's crew number | hand-over + hired lengths | the one company's count |
| roster open | the crew screen | hired merged then let-go filtered by name | unchanged (filtered); the hired list no longer carries him |
| alpha __WHO_YOU_HIRE_FIGHTS__ | the fight's company | filters the let-go by name | unchanged; the lists no longer carry him |
| map mapCrewLooks / campCompany | the marker's men, the camp's names | filters the let-go by name and look | unchanged; refreshed on the change |
| map billWages | the hired men's wages | filters the let-go | unchanged; the hired list no longer carries him |
| job_kinds rosterMen | the enemy's sizing | filters the let-go | unchanged |
| condition members | the camp's bars, the heal | filters the let-go | unchanged |
| map kill-tally card | the long-press card of his men | read the hand-over | unchanged; the hand-over no longer carries him |

## THE ONE TRUTH (engine/bohemia_hire_lock.js, loaded by the alpha, the map, the settlement screen and the crew screen)

- `BohemiaHireLock.company(origin, originId)`: the men in the company now. The crew screen's line (YOU first), its bench, the
  hired, the men it keeps off the line; the origin's men only before the crew screen ever kept a company. Never a man let go,
  never the dead (the fight's rows, the hand-over, the climb file, the condition), never the taken.
- `count()`, `isGone(name)`, `gone()`, `key(name)`.
- `dismiss(man, why)`: THE ONE WRITE. Into the let-go list once, then `scrub()` takes him out of the hired, the hand-over and the
  line (the line's front and back renumbered so they still point at real men). The crew screen's DISMISS and the road's manOut
  call it.
- `onChange(fn)`: a screen open when it happens hears it (a storage event from the crew screen's frame, or this page's own
  `bohemia:company`). The map refreshes the bar, the bill and the marker; the settlement drops its town-crew cache and its camp
  gone-list; the camp is laid out again.
- MENDED WHERE READ: every page that loads the hire lock scrubs at load, so an old save's let-go man is taken out of the hired, the
  hand-over and the line the moment the game opens.

## THE GATE

gates/one_company_a_man_let_go_is_gone_gate.js (ONE COMPANY, A MAN LET GO IS GONE, in the suite). The founding twelve plus three
men hired at a post. One let go from a town's CREW, one from a camp's CREW, one on the crew screen alone, each with a real
DISMISS and YES. After each one: he is on none of the shop's list, the shop marks (22 marks, every piece on the arms, smith and
armourer shelves, with the man he picked set to the hire first so every mark named him before), the town's picture, the men at
the camp's fire (13 before, 12 after, him missing), the one company, the hired, the hand-over or the line. The one count equals
the crew screen's line opened again (12) and the map's own crewCount run in the map's page (12), and the marker draws none of
them. An old save with a let-go man still in three lists is mended on open. Green, 9/0, about 35 s.

Also touched: gates/the_company_screen_battle_brothers_simple_gate.js reads the map's crewCount out of the map's file, so its list
of map functions now carries crewOriginNamed and crewMen (47/1, the same as main: its STRANGER'S PATH leg already fails on main).

## NOT DONE

The fight's door in the alpha, the enemy sizing and the condition still build their own lists. They already filter the let-go
list by name, and the lists no longer carry the man, so they agree; folding them onto `company()` is a later cleanup, not this bug.

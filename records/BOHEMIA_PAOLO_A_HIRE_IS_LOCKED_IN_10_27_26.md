# A HIRE IS LOCKED IN (Paolo 10/27, LOCKED, rule 295)

## His words
"Bro, I just got a bug... I just hired someone and it says it's four out of 12 but when I go into crew company camp mode... I'm so
confused... just make sure every time I hire someone like it's not some fucked up glitch shit where they're not really hired bro
cause I'm on day 13... I got my fourth member fully kicked out... this game is running really good bro I'm really proud of it but
there's a bugs bro. Just make sure every time you hire someone it's locked in and like it's not some ghost mystery accidental
bullshit please... run it right now, bro just make sure it doesn't happen again."

## What was measured (the coordinator, the same turn)
Two ways a man he paid for went missing while the bar still counted him:

1. THE NIGHT'S BILL WALKED HIM. `records/target/bb/nightly_bill.json` `walks_when_short` was 1: a night the purse could not
   cover, the map (`crewBillNight` in slices/BOHEMIA_CITY_WORLD.html) wrote the NEWEST HIRE into `bohemia.walked.v1`. One line
   on the phone, nothing asked, gone. By day 13 a thin purse is likely.
2. TWO MEN, ONE NAME. The hall names its men from the county's mix, so names come back. The crew screen
   (slices/BOHEMIA_ROSTER_SCREEN.html) merged the hired list BY NAME (a second JOE was skipped as "already here"), hid the
   walked and the let-go BY NAME (a new JOE vanished with the old one), and kept each man's level, gear and wounds under his
   name (`bohemia.climb.v1`: two JOEs shared one record). The bar counts the hired list's length. So the bar said 4/12 and the
   screen showed 3.

## What shipped
- `walks_when_short` is 0 and the map's default is 0: NOBODY WALKS OVER THE BILL. The purse runs dry; the men stay. A man
  leaves only when HE lets him go (the crew screen's dismiss, `dismissed:true`).
- engine/bohemia_hire_lock.js, loaded by the shell, the map, the town and the crew screen:
  - `uniqueName(name)`: a hire's name is his own in the whole company (the crew screen's records, the line, the hired, the
    let-go, the fights' rows); a second JOE MARSH is JOE MARSH II.
  - `repair()` (runs on load and again when the crew screen opens): an old game is mended where it is read. A man the old
    bill walked COMES BACK (only `dismissed:true` stays in the walked list). A hired man whose name a man before him already
    wore is renamed (JOE MARSH II), so the screen that hid him shows him. Every hire gets an id (`hid`).
- The hall writes a hire once by his id and reads it back; a write that did not land is tried again (`window.__HIRED_LOCKED`).
- Every reader of the walked list (the map's count, the crew screen, the shell's fight door, the condition, the job's sizing)
  counts only the men he let go.

## Measured after (Playwright, local)
An old game with two hires named JOE MARSH, ANA ROJAS walked by the old bill, LUIS PENA let go: the crew screen shows JOE MARSH,
ANA ROJAS (back) and JOE MARSH II; LUIS PENA stays gone. Two fresh hires in the hall: both written with their id, the crew
screen shows all five hired men. `uniqueName('Joe Marsh')` = JOE MARSH III; a new name stays itself.
Gates: THE COMPANY SCREEN, BATTLE BROTHERS SIMPLE 48/0 (its bill leg amended: six short nights leave the crew whole);
THE ROSTER COUNTS WHO CAN FIGHT 6/0; THE SETTLEMENT SCREEN GATE 74/0 (the hiring leg green); THE FIRST HOUR QUICKER's Q10
amended (night two short: nobody walks, the crew stays whole).

## Owed
- TUNING (research only) may propose what a broke night costs instead of a man (Battle Brothers: unpaid men lose mood and
  then desert, with warnings first). Nothing is built from it until Paolo rules; until then the purse simply runs dry.

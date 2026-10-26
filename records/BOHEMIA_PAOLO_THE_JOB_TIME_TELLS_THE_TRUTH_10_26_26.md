# PAOLO 10/26: THE TIME ON A JOB TELLS THE TRUTH (LOCKED, rule 290; on 186(c) and 222)

## HIS WORDS (verbatim, voice to text)
"Also im very concerned with the contracts you can choose it just be straight up lying about the time sometimes it feels mad
innacurate sometimes so please"

## WHERE IT STANDS (coordinator, read on main)
slices/bohemia_job_kinds.js trip() (WORLD [a job says how far] 16c26e78, [a job's time counts the way back] effa8af7): the time is
worked out before the yes by plan() (make() on a copy), costed on the map's road (route) by the map's clock (cityStepMins) at the
party's pace, plus the way back. Places it can still differ from the walk he then takes:
1. THE RANGE FALLBACK: when the plan cannot place the job, the card says a range from the data file (lo x step x 0.5 to hi x step),
   not the job's real trip ('UP TO 5 H').
2. TWO ROUTES: the estimate walks route(); the party then walks whatever [play takes you there] or his own taps pick (RUN's
   pathfinder, townDoorWalk, the off-road rule 186 now asks for). If they are not the same function the time and the walk differ.
3. THE CLOCK'S OTHER RATES: anything that makes the real trip slower or faster than cityStepMins (night, terrain, the carts' pace
   applied on one leg only, a camp, an event stop) and the estimate ignores.
4. A TARGET THAT MOVES: a pack to hunt or a party to catch is costed to where it stands at the yes.
5. THE PHONE AND THE BOARD were once two times for one job (EYES F5); WORLD made them one.

## RULE 290
(a) The time a job shows (the board, the person's words, the phone's card) is the time the trip really takes on the map's clock,
    there and back when he must come back (222).
(b) One route, one clock: the estimate is made by the SAME pathfinder and the SAME pace the party will walk ([play takes you there]),
    with every rate the clock applies on the way (roads and open ground, night, the carts' pace on the legs the carts walk).
(c) Where a job cannot be exact (a target that moves, a place not yet on the map) it says so with an icon and an honest range made
    from rolled walks of that kind, never a guess dressed as a time.
(d) [COORDINATOR'S DEFAULT, rule 205] Once he goes, the job's card counts the time left down live on the phone, so the promise and
    the walk sit side by side.
(e) The gate: 200 rolled jobs of every kind from every town, taken and walked to the end by the live map's own travel (AUTO play,
    fights and his own stops not counted): the shown time against the clock: 95 in 100 within 15 percent, none off by more than 30;
    every miss logged with its cause; the board, the words and the phone say one time.
(f) WORLD [the job's time tells the truth] FIRST after the replay it is running; NOTE RUN (its pathfinder is the one route); NOTE
    UI TWO (the countdown on the card); EYES; line 242.

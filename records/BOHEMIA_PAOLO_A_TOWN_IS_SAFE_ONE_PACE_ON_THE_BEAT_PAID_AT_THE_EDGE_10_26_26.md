# PAOLO 10/26: A TOWN IS SAFE AND HEALS UNDER GHOSTS; ONE PACE ON THE BEAT; PAID AT THE TOWN'S EDGE; A DAMAGE ICON (LOCKED, rules 273, 274, 275; 253 and 256 said again)

## HIS WORDS (verbatim, voice to text, one message)
"OK and one thing I wanted to make note is that if you are in a in a settlement settlement with other people you cannot get attacked
so you can always just hang out there. Heal there like if you're in a settlement you're your squad will always have their if you're
not above like 8687% percent like with your health and with your with your armor then there should be a button somewhere where like I
can't there right so time will pass like people will like when when we have this many people you know, I don't know how we want to do
it but like I want to like look like the amalgamation ghost effect I'm talking about like some fourth dimensional shit like instead of
like it's just being like them Polly like fast forwarding and shit like maybe like it could be like a 2% opacity of like their ghost
line as time moves forward like everyone moving around and then you know at every settlement you can always buy duct tape and healing
shit so you'll always be good and then when you fast forward like you'll see your people healing themselves repairing their armor or
whatever they're doing type shit helping each other repair their shit but that's only when the camp button is clicked in the
settlement menu yeah cause I think it should be fair game like bro if you're in a settlement bro you should not be attacked so if I'm
in the settlement screen, I should be able to heal directly from the settlement without ever having to worry about getting attacked so
keep that in mind and whatever the game counts as like the entrance territory to the city like if I leave a settlement straight and I
haven't moved a single tile and I'm like I'm just like in the map screen, but like I'm in that tile that's like that enter settlement
you know I think it should always be yeah like anyway so but yeah you can camp in the settlement now so like if I leave and then I
didn't move a single map tile and then I press camp like it will be the city settlement that the settlement camp style instead of like
the lonely team in the and whatever street style you're in you know but yeah, keep that in mind
But yeah, keep in mind I should be able to retreat. My whole squad should be able to retreat and not get hit if I do it immediately at
the beginning of the before the battle begins so I should always get that like free retreat kind of vibe and I either have to cancel
and drop the quest or like completely run away yeah and if I retreat retreat, like it, bounces me a couple tiles away to get a
Headstart type shit.
Also, bro, I think it's very important that will help the shop going shit a lot OK so if there's a weapon in the same style and what I
mean style, I mean like one handed, but it can
Also, it's funny. I'm realizing that damage doesn't have its own icon so you should probably make that too like when I'm in the shop
and shit yeah and Juniverse too but yeah.
Also, one thing that's important is that I have to double click to enter the town if I just if I just like if it's like a go back and
get paid type of vibe like as long as I get in the territory of the town like I will get paid you know type shit so I don't have to. I
don't wanna have to get paid. I don't wanna have to enter this settlement mode. Does that make sense?
But yeah, also, bro, like the combat still isn't in sync with the music and and like when I do the auto combat like it like it's not
the same pace like it's some fucked up like it will speed up and slow down however it wants and shit like I want it consistent with
the BPM of the music bro like so it's a smooth thing like not like get really fast really fast and then it goes back to normal really
fast really fast like I hate that shit bro like BPM do the math bro, but it has to go to the BPM and we need a formula for it so it's
consistent with the music bro"
('8687%' is '86 or 87 percent'; 'Polly' reads as 'fast-forwarded'; 'Juniverse' reads as 'the universe', i.e. everywhere; the shop
sentence 'a weapon in the same style... one handed, but it can' is cut off: asked of him once, nothing waits on it.)

## WHY THE FIGHT SPEEDS UP AND SLOWS DOWN (coordinator, measured on main, slices/BOHEMIA_FIGHT.html)
beatMs() = songBeat() / UI.speed / UI.hand / paceNow(), and paceNow() returns THEIRS_PACE = 2 on the enemy's turns, 1 on his, and
FINISH_PACE = 4 once the end is decided. So in AUTO the board runs at the beat on his men's turns, twice as fast on theirs, back to
the beat, twice as fast..., then four times as fast at the end: exactly 'really fast, then back to normal, then really fast'. Rule
207's 'a big difference between their turn and my turn' was about the MUSIC (the intensity), never the tempo.

## THE RULINGS
273. A TOWN IS SAFE, AND HEALING THERE PLAYS UNDER GHOSTS
(a) IN A SETTLEMENT NOBODY ATTACKS HIM: in the settlement screen, and on the map in a town's own entrance territory (the tile he
    arrives on and leaves from), no party can reach or start a fight with his company; the camp's warnings never fire there.
(b) HEAL IN TOWN: the HEAL/CAMP button works in the settlement screen (259(c)); time passes at camp speed, his men heal and mend
    there with the tape and medicine he buys at the stall (265: every stall always has them). Shown when anyone is under 87 percent
    (rule 261's line); a healed company has nothing to heal.
(c) THE GHOST TIME-LAPSE (his words: 'the amalgamation ghost effect, some fourth-dimensional stuff... a 2 percent opacity of their ghost
    line as time moves forward, everyone moving around'): while the hours run, the town's picture and his men leave trails of their own
    past positions at about 2 percent opacity, a long-exposure of the hours passing, not a sped-up film; his men seen healing,
    repairing, helping each other repair, in the town's picture. In the analog horror look.
(d) LEAVE THE TOWN, DON'T MOVE, CAMP = THE TOWN'S CAMP: on the town's entrance tile on the map, HEAL/CAMP makes the settlement-style
    camp (the town around him, safe), not the lone street camp.
(e) THE GATE: on the phone and computer: in a town and on its entrance tile, a hunting party passing never starts a fight; HEAL/CAMP in
    the settlement screen heals at camp speed and shows the 2 percent ghost trails; on the entrance tile, camp opens in the town's
    style.
(f) CAMP [a town is safe] (the safety and the entrance tile); CAMP TWO [the ghost time-lapse] (the look); NOTE RUN THREE (the town's
    picture of his crew); lines 209 to 211.

274. ONE PACE, ON THE BEAT, FOR EVERY TURN (the formula he asked for)
(a) THE FORMULA: every action in the fight starts on the song's beat grid: an action starts at t = t0 + k x (60000 / BPM) / s
    milliseconds, k a whole number, BPM the song's (120), s his own speed button (1, 2 or 4); a step across a tile takes the fight's
    TILE_BEATS beats, a swing one beat, each a whole number of grid points. The same s for his men and theirs, on his turn and theirs,
    from the first turn to the last.
(b) NO HIDDEN PACE: THEIRS_PACE (2) and FINISH_PACE (4) go; the tempo never changes by itself. The difference between their turn and
    his stays in the MUSIC (rule 207's levels), never in the speed.
(c) AUTO NEVER BUNCHES OR STALLS: AUTO's thinking is done ahead (during the beat before) so an action never waits past its grid point
    and never fires off the grid; if a choice is late it takes the next grid point, never two at once.
(d) THE GATE: in rolled AUTO fights and by hand, phone and computer, every action's start lands on the song's grid within 20 ms; the
    interval between actions is a whole number of grid points and the same for both sides; no turn and no fight's end changes the
    tempo; at each speed setting the interval is 1, 1/2 or 1/4 of the beat.
(e) COMBAT [one pace, on the beat] inside the emergency (it may be the 'tweaking'); SOUNDS NOTE (BOHEMIA_BEAT is the clock); line 212.

275. PAID AT THE TOWN'S EDGE, A DAMAGE ICON, AND THE RETREAT SAID AGAIN
(a) PAID AT THE EDGE: a job's 'go back and get paid' is done the moment the party reaches the client town's territory on the map (its
    entrance tile); the pay lands on the bar with its sound; he never has to open the settlement screen to be paid.
(b) DAMAGE HAS ITS OWN ICON, EVERYWHERE: the weapon card, the shop, the crew screen, the fight's card, the level-up: a damage icon like
    every other stat's (rule 224), in the kit's look.
(c) SAID AGAIN (rules 253, 256): on the lineup, RETREAT is free: the whole squad leaves, nobody is hit, before anyone moves; then he
    drops the job or runs; the map BOUNCES the party a couple of blocks (two or three) away from the enemy, a head start. Amends
    253(b)'s 'a step away'.
(d) THE GATE: a held job's return pays on the entrance tile without the settlement screen; the damage icon on every screen that shows
    damage; a lineup retreat leaves the party two or three blocks off.
(e) WORLD [paid at the town's edge] (the job's return); UI THREE [a damage icon] (the stat component); COMBAT and CAMP NOTE (253(b)'s
    bounce); lines 213 to 215.

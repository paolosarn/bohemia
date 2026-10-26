# PAOLO 10/26: FATIGUE COMES BACK EVERY TURN, AND A REST BRINGS MORE (LOCKED, rule 283; a bug and a rule)

## HIS WORDS (verbatim, voice to text)
"And a super important thing you forgot to implement from battle Brothers this is totally why I was dying a lot too among other
things, but in battle Brothers, like let's say you're fatigue is going up and running out like if you stand still for a turn you'll be
able to do the equivalent of get your full tax but yeah like even battle like you'll still be looking like one head off or a few way to
turn right now I have a shield and one hand weapon so right now you have a way that fatigue doesn't get restored or like if I chill
out, it doesn't go down if I'm unable to do something for a turn that means it should go down until then fixes itself so you just have
like fatigue quitting all the way up and then after it's done, I can't attack anymore for the whole image and that's incorrect. You
gotta do that."
('the whole image' is 'the whole fight'; 'fatigue quitting' is 'fatigue creeping'.)

## WHAT THE CODE SAYS AND WHAT HE SEES (coordinator, read on main)
slices/BOHEMIA_FIGHT.html newRound(): every man on the field gets 'u.fat = max(0, u.fat - recovery_per_turn)', 15 a round, Battle
Brothers' number (rules.json fatigue.recovery_per_turn, bb_all/0424: 'Every character recovers 15 fatigue at the start of his turn').
Recover (half the fatigue, 9 AP) exists as a skill. Yet on the live game, with a shield and a one-handed weapon, his fatigue only climbs
and he cannot attack for the rest of the fight. So on the real path either recovery does not run for his men, or a heavy kit (a car door
shield's weight cut from his maximum) leaves so little room that 15 a turn never buys a swing, or the screen shows a stale number.

## HOW BATTLE BROTHERS DOES IT (rules.json, the wiki copy)
Every character recovers 15 fatigue at the start of his turn (Iron Lungs +3); a fully fatigued man can neither strike nor move until it
comes down; the Recover perk (9 AP) halves accumulated fatigue; waiting or ending a turn early saves AP but recovers the same 15.

## THE RULING (rule 283)
(a) FATIGUE COMES BACK EVERY TURN, ALWAYS: 15 at the start of each of his men's turns (Battle Brothers'), every man, every fight, every
    path (AUTO and by hand); what the screen shows is the real number.
(b) A TURN OF REST BRINGS MORE [COORDINATOR'S DEFAULT, rule 205, from his 'if I chill out, it should go down']: a man who ends his turn
    without spending any AP recovers double at his next turn (30); RECOVER (half his fatigue) is a button any man can press when he is
    winded (the perk's effect without the perk while TUNING weighs it; rule 231 kept AUTO off it, and still does).
(c) NEVER LOCKED OUT FOR A WHOLE FIGHT: a man at full fatigue who rests one turn can strike again the turn after with his own weapon;
    if his kit makes even that impossible (the shield and the weapon's weight), his card says so before the fight in a word (the
    weight, an icon, rule 224) so he can lighten it.
(d) THE GATE: in rolled fights, phone and computer, AUTO and by hand: a man with a car door and a one-hander who swings every turn until
    winded, then rests a turn, swings again the next turn; fatigue falls by 15 every turn and by 30 after a rest; RECOVER halves it; no
    man of his is unable to strike for more than two turns running while unhurt.
(e) COMBAT [fatigue comes back every turn] right after [one pace, on the beat] (it kills runs); TUNING NOTE (the rest's double and the
    weight; the stupid-move watch counts winded turns); line 223; EYES checks.

# PAOLO 10/23: THE FIGHT DRIVES THE MUSIC (LOCKED)

## HIS WORDS (voice to text, verbatim)

"Bro i almost played a first day bro the combat should feel alot better we have music that we have a whole intensity system with the music wtf bro"

## WHAT THE COORDINATOR MEASURED (the same turn)

- The intensity system is real and live in the demo: `window.INTENSITY` (KILLMUS) in slices/BOHEMIA_DEMO.html, built 8/20 and 8/26-27. Level 1 calm, level 2 when an enemy is trying to hurt you (a fight starting, your man hit), level 3 after two kills or a crowd; it lifts the song's arrangement (MUS.layers 0, 2, 4) at the top of the next bar.
- The shell listens for four messages: BOHEMIA_COMBAT_STARTED (threat on), BOHEMIA_PLAYER_HIT (threat on), BOHEMIA_SHOT_RESULT with outcome 'killshot' (a kill), BOHEMIA_COMBAT_END (reset).
- The rebuilt fight (slices/BOHEMIA_FIGHT.html, COMBAT 10/2, rule 63) posts NONE of them. It posts BOHEMIA_SFX (sounds), its home message and its formation. So in every fight since 10/2 the music never rises: the system exists and nothing in the new fight drives it. That is what he heard.

## WHAT IT MEANS

1. The fight drives the music: the moment it starts, the song lifts; when your man is hit, it holds high; every kill pushes it; the end brings it down. Through the system that exists, in his allowed songs only (rule 122 stands).
2. "The combat should feel a lot better": the music is the biggest missing piece he named; every hit, kill and fall is also heard (rule 54b's events), never silent.
3. He almost played a whole first day: the game is close to holding him; the fight is where it slips.

## WHERE IT GOES

COMBAT, first on its board: [the fight drives the music]. The fight file posts the four messages the shell already reads; no change to the music engine is needed. No card: he hears it in his next fight.

# BOSSES, 11/26/26: THE FIRST THREE FEEL LIKE BOSSES (rule 482; the coordinator's routine 'BOSSES: rule 482 next')

The routine: 'the 19 bosses play and hold their frames; now make the first three he meets feel like bosses: the sign that leads to him,
his entrance, his look, his fight's moment, what changes on the map when he falls. Ship a build he can see. No act two yet.' Rule 482
(Paolo 11/26): 'More cooking up cleaning up improving things we're already doing type shit.' Ask row 735.

## WHAT HE SAW BEFORE (THE POT, THE TAP, THE FILTER played for real on the demo upright, step by step)
- His sign on the map: a small pixel thing in the dark; read, it gave a card (GO TO HIS PLACE / LATER) about a place he had not seen.
- His card before the fight: his face, his name, his title, his tip, his line, ENGAGE. Good, and kept.
- The fight: the camcorder zoom down, then the board. NOTHING on the board said which man was THE POT. His half-down was a number; his
  fall was one more body (the kill cams are off until the player turns them on). The fight's rules for him were all there (he rallies
  his cooks; THE FILTER's machines drop when he does; THE TAP's shooters hold the pipes); nobody could see them.

## WHAT IS THERE NOW (BUILD 11/26zm)
1. THE SIGN LEADS TO HIM (slices/bohemia_bosses.js __THE_SIGN_LEADS_TO_HIM__): the first time his sign is read, the map's camera goes to
   his place (1 s), holds on it (1.5 s), comes back to the crew (0.8 s), and only then is his card read out: GO TO HIS PLACE is a place
   he has seen. Never under a town's screen or a fight (MEASURED this round: the crew walked into a camp mid-move and the town's screen
   covered it; a town or fight that opens now cuts the move and it plays again on the map). Every phase drawn at least once (rule 480(c)).
   Nothing drawn at the glass's edge (rule 473(d): no waypoints); the camera moves, the map is the map.
2. HIS ENTRANCE (slices/bohemia_boss_entrance.js, loaded by the fight): once the fight is the thing on top of the phone (MEASURED: it
   first played unseen behind the map's zoom down; now it asks which frame is on top), a tape's lower third on the beat: REC, HIS NAME
   large, HIS TITLE under it ('KEEPER OF THE LAST GOOD POT'); a tracking jump in (1 beat), held 4, a tracking collapse out (1); the sound of
   a set coming on (the sounds lane's 'power_on').
3. HIS LOOK: his name rides over his head the whole fight in the boss's red, his blood under it, so the eye finds him in his crew.
4. HIS MOMENT: the first time his blood is half gone the tape tears for 2 beats and his own tip from his card is stamped once ('KILL HIM
   FIRST: HIS COOKS BREAK', 'CLOSE IN FAST ON HIS SHOOTERS', 'SHOOT THE MAN, NOT THE MACHINES'): the line the player already read, now
   when it matters. No new words.
5. HIS FALL: dead, run off the board (THE POT ran once when his line broke and the fight was won), or the fight won with him in it: the
   tape stops for 2 beats (the colour drains, STOP in the corner), his name struck through, DOWN (the game's own word: 'THE POT IS DOWN').
   Then the map's beat already plays what changes when he falls (rule 480's round made every phase of it draw).
- His tip and title now travel with him into the fight (msg.boss.tip; S.boss.title and S.boss.tip in the fight's __THE_BOSS_IS_A_MAN__).
- Nothing of it takes a tap (its layer is pointer-events none); no number of the fight changed; draft:true.
- Analog horror at the source: a VHS lower third with its scanlines and a split edge, a tracking tear, a tape stop. Nothing glows.

## THE GATE
gates/the_boss_arrives_gate.js, THE BOSS ARRIVES (registered): THE POT, THE TAP and THE FILTER played for real in one new game (the
whole-ladder walk, LADDER_ONLY the three): L1 the sign leads (go > hold > back, then the card), E1 his entrance with his name and title
on top, P1 his name over his head on the glass, M1 his moment at half with his own tip and his fall (a lost fight shows none and owes
none), N1 nothing takes a tap, W1 still found by his sign, fought to LEAVE, his map changed, on the glass. Planted fails for each.
EVERY BOSS HOLDS ITS FRAMES now answers the sign's card after the camera's lead, the way a player does.

## RESULTS
- THE BOSS ARRIVES 26 passed, 0 failed (on main as 11/26zi left it; shipped as 11/26zm): all three led by their signs (go > hold > back), each entrance with
  his name and title on top, each name over his head on the glass; THE POT and THE FILTER each had their moment at half with their own
  tip, then their fall; AUTO lost THE TAP and THE FILTER that run, the walk's checker won them, and each fall played; nothing took a tap;
  each still found by his sign, fought to LEAVE, his map changed, his place on the glass.
- EVERY BOSS HOLDS ITS FRAMES 13 passed, 0 failed with the lead camera in (its card answered after the camera, like a player).
- Played step by step with pictures on the demo upright before and after (records/target/bosses_the_boss_arrives_11_26/VOTE.webp).

## THE BOSSES CHECKED
THE POT, THE TAP, THE FILTER (the routine's first three), played end to end. The entrance, the plate, the moment and the fall are
every fought boss's (they read his own row), so the sixteen after them carry them too; only the first three were walked for this.

# COMBAT [the punch] 11/2/26 (ask lines 264, 266; BUILD 11/2z - EVERY BLOW LANDS)

Paolo 10/27 (records/BOHEMIA_PAOLO_NOTES_WHILE_THE_KITCHEN_IS_CLOSED_10_27_26.md note 4): "I'm not super happy with the feel of
combat yet... Nothing feels punchy yet, satisfying punchy, not from the music to the combat to the walking around the city to the
camp shit".

[bb] What a Battle Brothers hit tells you, in order: who struck (the attacker's lunge), how hard (the struck brother jerks, the
blood flies), what it took (the bar loses its piece). Our swag on top: the tape loses its lock on the man for the impact frame.

## MEASURED BEFORE (bench, phone upright, seeded suburb fight 4, AUTO at the song's own speed; a blow of 13 of 55 health)
| ms from the landing | the struck man | striker | red tint | anything else |
|---|---|---|---|---|
| -72 | ALREADY IN HIS HIT KEY | aim | 0 | nothing |
| +28 | hit key | aim | 0.46 | nothing |
| +78 to +378 | hit key | aim, stand | 0.40 down to 0 | nothing |
- The struck man showed his hit key from the swing's first frame, 225 ms BEFORE the blow (UI.hitUntil was set at the start of
  the motion): his reaction came first, so the landing itself changed nothing but a half-red tint. No freeze, no knock, no glass
  kick, the bar just got shorter. A kill (52 of 55): the same, then the fall's three keys.

## WHAT SHIPPED (slices/BOHEMIA_FIGHT.html, THE PUNCH; every number in records/target/bb/ours.json 'punch', drafts for TUNING)
1. He takes the blow when it lands, never before (UI.hitFrom).
2. THE FREEZE: both men hold the impact key for 0.1 beat (a scratch) to 0.24 beat (half his health, the head, or the kill):
   50 to 120 ms at 120 BPM. The sound was already on the beat and never waits.
3. THE WHITE: for the freeze he is blown white with a red and a cyan copy a few pixels apart (the tape losing its lock), on every
   way a man is drawn (his clip, his idle, what he holds).
4. THE KNOCK: thrown from the blow by 5 to 14% of his height, back over 0.35 beat; a club lunges 6% of a man into the blow.
5. THE KICK: the glass kicks along the blow 2 to 7 px in four steps of a sixty-fourth (one sixteenth, 125 ms), stepped like a
   tape's tracking; a body lands on the fall's last key with a 3 px thud.
6. THE CHIP: what the blow took (health and armour) stays bright on his bars, drains over 0.75 beat.
7. A MISS GETS NONE OF IT: no freeze, no white, no kick; he slips aside (the dodge that was there), the ring is grey, and a shot
   that misses throws five motes of dust off the ground past him over half a beat.
- Picture: records/target/combat_punch_11_2/a_blow_frame_by_frame.webp (before row, after row; the impact frame is white).

## MEASURED AFTER (the same fight, the same blow)
| ms | struck man | striker | red | white | knock px | kick px |
|---|---|---|---|---|---|---|
| -99 | STANDS (waits for the blow) | aim | 0 | 0 | 0 | 0 |
| +18 | hit key, frozen | aim, frozen | 0.48 | YES | 4 | 4.4 |
| +84 | hit key, frozen | aim, frozen | 0.39 | YES | 4 | 1.4 |
| +151 | hit key | aim | 0.30 | 0 | 2 | 0 |
| +251 | hit key | aim | 0.17 | 0 | 0 | 0 |
- The kill (52 of 55, a club): the striker lunges 1, 2, 3 px into it from -74 ms; at the landing the dead man is white for
  two frames (120 ms), knocked 8 px, the glass kicks 7 px; the fall's last key lands at +843 ms with a 1.7 px thud.
- The fight's length does not move: three AUTO fights (road day, suburb night, strip day) end the same way in the same rounds
  (7, 8, 8), 152/151/184 beats before and 155/148/182 after (the noise of the bench); 36 to 50 blows punched a fight; nothing
  thrown. Everything lives inside the one beat a blow already held.

## WHAT IS LEFT
- The punch's own sound (a low thump under a kill, a heavier hit for a big blow) is SOUNDS' (the hit's sound is already on the
  beat: SND.resolve at 0.45 of the blow's beat, unchanged).
- Punchy in the music, the city walk and the camp (ask 266) are other lanes' (SOUNDS, MOTION, CAMP).
- The bench draws at about 30 frames a second, so it sees two of the kick's four steps; a phone at 60 sees all four.

[analog horror] for one frame the tape cannot hold the man who was hit: he burns out white and slips into his red and his cyan.

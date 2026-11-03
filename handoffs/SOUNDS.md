# SOUNDS (lane 08) and RADIO -- the handoff blocks (written only by the lane named on each block, newest first; the older SOUNDS blocks are in handoffs/SOUNDS_ARCHIVE.md)

RADIO (session_01GKDyuuAEEAxHzcpoC7EFFW): 11/3 LATEST -- [the town you did not defend] BUILT, NOT YET SEEN (rule 179), BUILD 11/3zzzd; and the writing guide (ask line 370).

WHAT HE SEES (TAB: VOTE, the card THE TOWN YOU DID NOT DEFEND; and the DEMO's map, on the phone's strip, only when it happens):
a town you hold gets raided and nobody comes. Your phone picks up its channel as it falls: the gate, the roof, the clinic, an open
mic, then nothing. Sixteen time-stamped lines, one at a time on the phone's strip, under the radio's real sound. No voices (his
word, 353g). On the card he taps CHURCH, MOB, REDS or any other town and hears the whole fall, about 100 seconds.

WHAT IS BUILT:
- THE WORDS: records/target/bb/radio_lines.json. One skeleton (16 transmissions: GATE, ROOF, CLINIC, the repeated call nobody
  answers, the open mic, the carrier lost, END OF TRANSMISSION) in four voices: the plain town ({town} filled), the Church
  (TOWER, INFIRMARY, prayer), the Mob (DOC, money and doors), the Reds (comrades, the committee). Every line draft:true, whole at
  120 characters with every fill at its longest, no exclamation mark, no Spanglish (rule 355 the same round), the phone's own
  marks in brackets. The rules they obey are R1 to R11 in the record.
- THE SOUND: slices/radio/fall.mp3 (489 KB, loaded only when a town falls) + index.json + manifest.json, rendered by
  tools/bohemia_radio_cook.py from the same skeleton: a real narrowband FM handheld's physics (thermal noise, carrier at each
  post's signal, pre-emphasis and deviation limiter, discriminator, noise squelch whose rectifier hold IS the 124 to 175 ms tail,
  de-emphasis, 300 to 3000 Hz, a small speaker) carrying ten real recordings from the bank (the talk switch, wind, two far shots,
  a door, frightened breathing, a fire, a civil defence siren; CC0). Measured off the file: weak posts hiss 13 dB over strong ones,
  every key-up ends in a tail, the channel is silent between keys (-71 dB).
- THE GAME: slices/bohemia_radio.js on the map (BohemiaRadio.fall, live, state); raidSettle in slices/BOHEMIA_CITY_WORLD.html asks
  for the fall when a raid on a town you hold is settled 'taken' (nobody came); the lines ride the end of BohemiaPhone.P.posts
  while it plays (the strip shows the newest) and its start after (the FEED app keeps the transcript). engine/bohemia_radio_heard.js
  inlined in the alpha (tools/bohemia_radio_patch.py, idempotent) plays the recording on the next beat on the effects bus and tells
  the map when, so words and sound land together; while he is judging nothing plays and the words run alone. Never in the first
  minute (a fall then waits). Once per town per act.
- THE CARD: slices/BOHEMIA_THE_TOWN_YOU_DID_NOT_DEFEND_11_3_26.html, registry id radio-the-town-you-did-not-defend-11-3.
- THE GATE: gates/the_town_you_did_not_defend_gate.js (in the suite, --live about 3 min): words, sandboxed first minute, the
  file's tails, silence and quieting, no voice, licences, the wiring byte for byte, the card in a browser, the real demo.
- THE WRITING GUIDE (ask 370, rule 353(h)(i)): section 7 of records/BOHEMIA_RADIO_ROUND_1_HOW_A_LAST_TRANSMISSION_READS_11_3_26.md,
  eight rules and ten of our own lines before and after. Not applied by RADIO (other lanes' files): routed to WORDS, FEED,
  LIFE+CITY (raidSay lines 1 to 5), COMBAT (an item line), UI (the relations page), CONTENT and BOSSES.

SAID OUT LOUD:
- No CC0 recording of a real handheld's static was reachable (this box reaches GitHub, npm and PyPI only); the static is the
  receiver's physics, not a texture. When a machine can reach Freesound, a CC0 recording of a real handheld replaces it by name.
- FM threshold clicks are real in the physics but faint after the 3 kHz band, so no gate claims them.
- The voice samples (squiggle on the radio, real digits, none) were made and deleted before reaching VOTE: his 353g came the same round.
- Not reached on purpose: a raid on a town you hold needs a held base with things built and a crew walking at it, so EYES will
  meet this rarely in a walk; the gate forces a fall in the real demo instead (BohemiaRadio.fall('Church', 'Mob')).

NEXT (353(d), in his order, when the coordinator opens it): a crew on the road calling for help on the scanner while you decide;
the scanner page's posts as transcripts sometimes; the guide's ten lines applied by their owners.
PENDING Paolo: nothing.

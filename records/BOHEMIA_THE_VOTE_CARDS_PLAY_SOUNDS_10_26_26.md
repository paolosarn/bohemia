# THE VOTE CARDS PLAY WHERE HE PLAYS THEM (SOUNDS 10/26/26, row [the vote cards play], rule 193)

## HIS WORDS
"I went in the vote tab and try to play the music and the music wasn't playing." Then: "I went to Safari and I played the
music and it played just fine."

## WHAT WAS WRONG
The card page played on its own in Chromium. Where he first opened it (an in-app browser or the home-screen app, inside the
alpha's VOTE tab and the card's own frame) three things could keep it silent with nothing on screen: the iPhone's ringer
switch mutes Web Audio; an in-app browser can leave Web Audio suspended however often the page asks; and 2.4 MB loaded and
decoded with no word on the card.

## WHAT CHANGED (slices/BOHEMIA_THREE_LEVELS_10_25_26.html, the template; all thirteen card pages written from it)
- THE RINGER SWITCH: on the tap the page asks the phone for the 'playback' audio session (navigator.audioSession, Safari
  16.4 and later) and starts a silent looping <audio> inside the same tap (older iPhones: that puts the phone's audio in its
  media mode, where the switch does not mute Web Audio); and unlocks Web Audio with one silent sample started inside the tap.
- THE PLAIN PLAYER: if Web Audio is not running a second and a half after the tap, or a file will not decode, the same file
  plays through an <audio> element (it is never muted by the switch); the words say PLAYING (the simple player). No change
  on the bar there (one file plays), but it plays.
- THE WORDS: LOADING THE VAULT: 0 of 3, 1 of 3, 2 of 3; then PLAYING with what the level is; or a plain error: "It did not
  play: the file did not load. Check your signal and tap again." / "the phone blocked it, tap once more."
- On a phone the three levels decode at 24 kHz (37 MB, not 75), so a phone near its memory line keeps the card.

## THE GATE (gates/the_vote_cards_play_gate.js, in the suite as THE VOTE CARDS PLAY), 16/0
The alpha, its door (BEGIN), the VOTE tab, a song card's LOOK AT IT, both frames; the phone profile (an iPhone's user agent,
touch) and the computer profile: first tap plays (LOADING then PLAYING, the context running, the song moving); the page asked
for the playback session; with Web Audio locked the plain player takes the tap; with the file gone a plain error. The
thirteen song cards carry his YES now, so his tab hides them (a vote consumes); the gate's served registry forgets the
verdict on the one card it opens and nothing else.

# PAOLO 10/25: THE MUSIC IN THE VOTE TAB DOES NOT PLAY (LOCKED, rule 193)

## HIS WORDS (verbatim, voice to text)
"Also, I went in the vote tab and try to play the music and the music wasn't playing. What the fuck"

## WHAT THE COORDINATOR MEASURED (20:58, main)
- The card page (slices/BOHEMIA_THREE_LEVELS_THE_VAULT_10_25_26.html) on its own in headless Chromium: loads its list,
  decodes the three mp3s, says level 1 is playing, no errors. The files exist (slices/vote/songs/three_levels/, 20 MB) and the
  Actions deploy copies slices/ whole.
- So the failure is where he plays it: inside the alpha's VOTE panel (an iframe of BOHEMIA_VOTE_TAB.html, which iframes the
  card page), most likely on his iPhone, where Safari mutes Web Audio (the card's AudioContext) when the silent switch is on,
  while an <audio> element still plays; and the card shows nothing while 2.4 MB of three levels load and decode.
## THE RULING (rule 193)
(a) EVERY CARD THAT HAS SOUND PLAYS WHERE HE PLAYS IT: in the alpha's VOTE tab, on his iPhone (silent switch on or off), on
    his computer, first tap. On iOS the card asks for playback audio (navigator.audioSession.type = 'playback' where it
    exists) and falls back to an <audio> element so the silent switch never mutes it.
(b) IT SAYS WHAT IT IS DOING: 'loading, 1 of 3' while it loads; 'playing' with a moving bar when it plays; a plain error
    when it fails ('your phone is on silent: flip the switch' if that is the cause).
(c) THE GATE: the card opened inside the alpha's VOTE tab (both frames), tapped, and the audio graph or element measured
    playing, on the phone profile in WebKit if the sandbox has it, else Chromium's phone profile plus the iOS path checked in
    code.
(d) SOUNDS [the vote cards play], first; it covers every song card, old and new.

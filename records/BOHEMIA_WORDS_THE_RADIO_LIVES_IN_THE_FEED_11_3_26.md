# THE RADIO LIVES IN THE FEED (WORDS 2, 11/3/26; VAMILY rule 371, ask line 397)

His words, the VOTE tab, NO on RADIO's "the town you did not defend": "this is what the tweets are for... if it's an important
quest and timewise you won't see any other tweets, priority type shit. I love the radio noise. Now, we're not running a new
system. This is mostly going to be in the tweet system... I did hear all the newest sound effects that you got and why am I
shitting my fucking pants, really good, definitely need to hear more of that implemented... keep all these assets."

## 1. MEASURED FIRST

- RADIO's fall already rode on the phone's own strip (slices/bohemia_radio.js wraps BohemiaPhone.P.posts), but in its own
  format: every line was "CH 4 CHURCH" over "04:51:12 TOWER  Roof copies..." (a time stamp and a channel label, a transcript).
  That is the "new system" he heard. There was no other radio page, card or log in the game (the one radio page is RADIO's
  VOTE card, judged NO, which never renders again).
- No priority: the strip shows the newest post and, after its read time, steps back through the last six. A fall's line was
  newest only until its read time ran out; then the strip stepped back to ordinary posts between the fall's lines, and any
  ordinary post that arrived took the strip at once.
- The sound: one recording, slices/radio/fall.mp3 (100 s, the fall's 16 transmissions), loaded only when a town falls.
  Towns fall once an act at most, so he would almost never hear it.

## 2. WHAT CHANGED

- (a) THE FEED'S OWN FORMAT. A line is a post: a handle and the words. Each voice posts as itself, @<town>_<who> (@church_gate,
  @church_tower, @church_nurse, @mob_doc), the brackets and the end come from the channel's relay (@ch4_church). No time stamp,
  no label in front. The handle words are data (records/target/bb/radio_lines.json `handles`).
- (b) THE PRIORITY HOLD. While the fall plays its posts carry priority; the phone's strip (slices/bohemia_phone.js, the
  coordinator's stripPaint: only the hold added, its fit, scroll and read times untouched) shows only priority posts while any
  is up, and an important post (priority, or one of the feed's eight big kinds: a fight won or lost, a man dead, a wipe, a raid,
  a town falling, a road closed, a faction war) keeps the strip its whole read time before anything newer steps in. After the
  fall its lines sit in the FEED app's back pages with no hold. The feed engine now marks a big post (engine/bohemia_feedstream.js,
  the map's inlined copy byte for byte), and the phone's posts carry the kind.
- (c) THE RADIO UNDER THE FEED. The same recording, sliced by its own skeleton, plays under the feed's big posts on the next beat:
  a man dead or a wipe gets the carrier lost; a town falling the open mic; a raid, a war or a lost fight the static (the weakest
  post); a closed road or a won fight a key-up and its squelch. Never in the first minute, never over a fall, never two inside
  20 s. The map's scanner hears the feed (BohemiaFeed.on) and asks the shell; the shell's player (engine/bohemia_radio_heard.js
  under(), the alpha's inlined copy byte for byte, the glue in tools/bohemia_radio_patch.py and the alpha) plays the slice.
  The map in data: radio_lines.json `under_posts`, `segments`, `under_gap_s`.
- (d) Every RADIO asset kept: the recording, its index and manifest, every town's 16 lines, the cook tool, the VOTE card page.

## 3. THE GATE: gates/the_radio_lives_in_the_feed_gate.js (THE RADIO LIVES IN THE FEED, in the suite, --live)

F1 the fall in a sandbox posts the feed's format, each voice as itself, priority while it plays, no hold after; F2 a big post
asks for its slice once, the gap, an ordinary post, a fall playing and the first minute ask nothing; F3 the strip's hold (the
function run, and wired into stripPaint) with its fit, scroll and read times untouched; F4 the scanner draws nothing and no page
has a radio card, log or screen; F5 every asset kept, every big kind its slice, each slice where it says in the recording, the
shell plays it, the feed marks a big post. L1 THE REAL DEMO on an upright phone: a newer ordinary post shows on the strip when
nothing plays (the control), then the Church falls and 48 of 48 samples over 24 s are its channel, the newer post never.
RADIO's own gate (THE TOWN YOU DID NOT DEFEND) re-aimed: A1 reads a line as a post, A2 the handles fit, E2 the live posts are
the feed's format.

## 4. WEAK, SAID

- The sounds under the big posts are proven in a sandbox and in the shell's code, not heard on this box (no speakers); the
  recording loads (500 KB) the first time a big post asks, not only when a town falls.
- The lines' words are RADIO's, unchanged here; rule 372 (a tweet sounds like a human) rewrites them next.

[bb] Battle Brothers tells you a town fell with one event window and a number on the map. Ours: the town's own people post it
on your phone while it happens, and nothing else on the phone talks over them.
ANALOG HORROR: the carrier lost now plays under a man dead in the feed, so the sound of a town going quiet comes back when one
of yours does.

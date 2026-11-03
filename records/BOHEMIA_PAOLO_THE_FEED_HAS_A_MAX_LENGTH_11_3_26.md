# THE FEED HAS A MAX LENGTH, AND A POST IS ALWAYS SEEN WHOLE (Paolo 11/3; VAMILY rule 350; ask line 360)

## HIS WORDS (verbatim, transcription kept; "feet" is "feed")
"Also, you need to find a final character count that's the max capacity so whatever you've been doing recently like the upper echelon of
what those numbers have been and then make the text slightly tighter if you need to bro it's OK cause the feet is broken right now I'm
pretty sure it's because the "" tweets are too fat for it probably so it's OK but we can make it tighter bro, like yeah, so you have the
tweets I don't know they're like loading half the time"

## WHAT THE COORDINATOR MEASURED (he was right)
- THE POSTS: 579 feed lines in records/target/bb/feed_kinds.json (73 kinds, English and Spanglish), filled with real names (company THE
  NIGHT SHIFT, a town, a road): median 85 characters, 75% under 99, 90% under 113, 95% under 123, the longest 141. 241 lines are over 90,
  131 over 100, 68 over 110, 34 over 120, 9 over 130. The city's own LIFE posts run 64 to 75.
- THE BOX: the phone is 124 px wide in its own units; the feed strip is 102 px wide and 46 px tall (3 px padding), built for TWO posts
  (each .fp 21 px tall, its words capped at 13.5 px, under two lines at 6.5 px type and 7.5 px lines). Since rule 329 shows ONE post, that
  one post still only gets the old half: the BohemiaROM type at 6.5 px is 3.9 px a letter (measured in Chromium), about 24 letters a
  line, so the words show 25 to 48 letters of a median 85. With three jobs on the phone (jobs3) the post gets 16 px: about one line.
  THAT IS "LOADING HALF THE TIME": most posts are cut off halfway.

## THE LAW (rule 350; the coordinator's numbers, his to change)
1. THE FINAL MAX: a post's words are at most 120 characters, with every fill at its longest real value (the longest company name the game
   allows, the longest town, road and person name). The handle is at most 16. 120 keeps 94% of today's lines as they are; the 34 lines
   over it are rewritten tighter at the source in our own voice (draft:true), never cut off with dots.
2. ONE POST OWNS THE WHOLE STRIP: the single post uses the strip's full height, not the old two-post half.
3. SLIGHTLY TIGHTER TYPE: the size and line height are set so a 120-character post shows WHOLE in the strip (measured: 6 px type is 3.6 px
   a letter, about 26 a line; 5.5 px is 3.3, about 29), still readable on the upright phone at its real scale.
4. WHEN THE STRIP IS SHORT (the three-jobs layout), the post steps up one line on each beat (stop-motion, on the music's clock) until its
   last line has been seen, and its read time (rule 329) counts from there; never cut.
5. A GATE: no feed line in any data file can exceed the max with its longest fills; and on the upright phone a 120-character post shows its
   last word, in both layouts.

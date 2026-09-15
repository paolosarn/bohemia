# NO SLOP, ROUND EIGHT: THE MACHINE HAS A FACE, AND I SHIPPED THE BUG INTO MY OWN SCREENSHOT
UI lane (chat 11), 9/15/26. Row [no slop].
laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md
Gate: gates/casing_face_gate.js, 17 legs. Cut: tools/bohemia_cut_the_rom_face.py.

## WHERE THIS ROW WAS
Three type registers on the walked city: CASING, SCREEN, BODY. Round five gave SCREEN a real
face (BohemiaROM). Round six gave BODY one (BohemiaBody). CASING was still resolving to
'BohemiaMono', which is why the walked city still counted 42 monospace hits: every label,
chip, button and readout on the HUD was being drawn on a character grid, and DIRECTION's
ruling allows that only where the in-world device is a screen. A plate on a machine is not
a screen.

## WHAT SHIPPED
BohemiaCasing, cut from the same 5x8 table as the other two. No third alphabet: REUSE-FIRST
is a law here with a gate behind it. Three things are done to the cut, and each is a property
measured on the page rather than a caption:
  CONDENSED   the column is 100 units against a 125 unit row, so a cap is 0.57 of its own
              height instead of 0.7. Measured live: a cap is 50 wide in a 140 line.
  HEAVY       the ink square stays 125 in a 100 unit column, so neighbouring cells overlap
              and a stem is 1.25 columns wide, the way a stamp bottoms out.
  CAPS ONLY   lowercase IS the cap drawing. A stencil kit is one alphabet.

Tells on the walked city: monospace 42 -> 8, all tells 176 -> 142. The 8 that remain are the
SCREEN register and its canvas fallback, which are legal and deliberate.

## THE THREE THINGS THAT MADE THIS ROUND, IN ORDER OF HOW WRONG I WAS

### 1. I MEASURED THE FALLBACK FONT AND CALLED IT MY FACE
The first word-space measurement said "DAY 1 4" was 38.19px and "DAY 14" was 35.28px, so the
word space was 2.91px and too narrow. Every one of those numbers came from the browser's
default font. A @font-face that nothing on the page has used yet is NEVER FETCHED, so
document.fonts.ready resolved instantly and check() said false. THE TELL WAS THAT THE NUMBERS
DID NOT MOVE WHEN THE FONT CHANGED, which is the same tell that has caught this lane four
times now. The probe now loads the face by name first, keeps a string set in a family that
does not exist as a live control, and REFUSES TO REPORT if a face did not load.
On the real face: 3-column space 2.39px, 5-column 4.39px, cap advance 5.41px, letter gap
1.2px. Five columns, and the reason is written down with the real numbers.

### 2. THE CASING TRACK WAS ON 94 RULES AND THE CASING FACE ON NONE OF THEM
The register existed and almost nothing used it. 94 rules declared letter-spacing:
var(--track-casing) -- "this is casing text" -- and 12 named a face. The rest inherited the
DOCUMENT DEFAULT, which was --fmono: monospace. So "casing" text had been drawn in whatever
the document default was for the whole life of the register.
Found by asking the live page which face each surface computes to, not by reading the file.
The file looked correct.

### 3. *** AND THEN I FIXED IT WRONG, AND ONLY THE PICTURE SAID SO ***
I gave the casing face to all 58 rules that declared the casing track. The tell count went
the right way. No gate went red. Nothing threw.
The day card started SHOUTING: "nobody has picked it up yet" rendered as NOBODY HAS PICKED IT
UP YET, "about 4 and a half hours on foot" as ABOUT 4 AND A HALF HOURS ON FOOT. The casing
face is caps only, and the card is WRITING.
Declaring the casing TRACK does not mean being casing TEXT. The track was being used for
tracking; the register is about voice.
REVERTED, all 58. What replaced it is inheritance, which is what the register work was for:
the register is named on the CONTAINER of each machine surface (#menubar, #hud, #blstack,
#nav, #savepanel, #devtray, #cityfeed) and the cards already carried the body face on theirs.
And before naming any surface, the page was asked how many lowercase words it contains:
  hud 0   nav 0   mode 0   savepanel 0   devtray 0   menubar 0   outfitpanel 0
  blstack 1  ("walking your own block." -- #note, which keeps the prose face)
  keypanel 37 ("Las Vegas Blvd", "FREEWAY (90-degree, always)") -- stays prose
  daycardIn 10 -- stays prose
That count is now a gate leg. It is the leg this file exists for.

## AND ONE GUESS THAT COST TWO PASSES
I named the register on #topbar and #barleft did not change. The walked city has TWO top
strips and the state text lives in #menubar. Found by walking #barleft's real ancestors on
the live page. Reading the file would not have said which strip was which.

## WHAT THE GATE ASKS, AND HOW ITS OWN ORACLE WAS WRONG FIRST
The coverage leg (every character the machine draws is covered by the casing face) was first
written as "does this character measure differently in the face than in a family that does
not exist". It reported 0, 6 and 8 as missing. They are plainly in the table; their advance
simply happens to equal the fallback's. It also reported U+25C6, WHICH WAS REAL -- the left
rail's STANDING chip is written "diamond STANDING" and no face of ours had the diamond, so
one mark on the first control of the game fell through to whatever the browser had. That is
the THIRD glyph found this way, after the phone's signal bar and every card's close mark.
A leg that mixes one true finding with three false ones is worth nothing, because the false
ones teach the next person to ignore it. The question is now asked of the FONT'S OWN cmap.
The diamond is drawn and in all three faces.

## AND THE SAME QUESTION, ASKED OF THE PROSE REGISTER, ANSWERED WORSE
The mutation that replayed the shouting card also dragged the card's characters into the
coverage check, and one of them was U+2014. So the question was asked properly of the BODY
register: the game's own written strings carry em dashes (one is a district summary, "Walled
tract-home neighborhood - cul-de-sac streets off the entrance") and NO FACE OF OURS HAD ONE.
Every one of those prints in whatever the browser falls back to: a second typeface inside a
sentence, invisible unless you go looking.
Drawn and closed in all three faces: em dash, en dash, ellipsis, and the four curly quotes.
The curly quotes REUSE the straight drawings and that is written down as a decision, not left
as an oversight: at five dots wide there is no honest way to draw the difference, and a quote
of slightly the wrong shape beats a quote in a different typeface.
NOTE FOR THE NEXT PERSON: the existing SCREEN FACE gate's coverage leg uses the same width
oracle this round found wrong. It reports the prose card clean, and on the card as it renders
today that is true (49 characters drawn, all covered). It is right by luck of what is on
screen, not by construction. Its oracle should move to the cmap the way this one did.

## STENCIL BRIDGES: BUILT, RENDERED, REJECTED ON EVIDENCE
The word stencil asks for bridges, so they were drawn, built and looked at, at 10, 11 and
12px. THE BRIDGED 8 IS CHARACTER FOR CHARACTER THE 3 IN THE SAME TABLE. 6 loses its left stem
and reads as 8; 9 reads as 3; BUILD came out as 3UILD; "0948" came out as "0943". Batteries
are the money in this game.
AND THE REASON IS GEOMETRY, NOT A BADLY CHOSEN BRIDGE POSITION, which is why it is written
down instead of retried: on a 5x7 cap grid every stroke is exactly one cell thick, so a
bridge deletes skeleton rather than thinning a stroke. Bridges need a finer grid than this
table has. The data stays in the tool behind --bridges so the decision can be re-run, and
option B on this round's sheet shows him the damage.

## THE SHEET
slices/BOHEMIA_FIVE_WAYS_THE_MACHINE_SPEAKS_9_15_26.html -- five real cuts, each one an
actual embedded font rather than a picture of one, shown at 10px which is the size this
register is really used at. A is what shipped.

## WHAT IS NOT DONE
Still on the walked city: rounded corners 60, 1px borders 52. The type work is finished:
all three registers now carry a face we drew, and no register outside SCREEN can fall back
to a grid.

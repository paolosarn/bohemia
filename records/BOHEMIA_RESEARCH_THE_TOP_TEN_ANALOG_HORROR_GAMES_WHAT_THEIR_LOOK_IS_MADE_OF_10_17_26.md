# THE TOP TEN ANALOG HORROR GAMES: WHAT THEIR LOOK IS MADE OF (research, 10/17/26)
# Paolo 10/17: "do research on the top 10 analog horror games of all time, get direction inspiration from them."
# Lane: DIRECTION's analog horror bible (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md) and SOUNDS' school page
# (records/BOHEMIA_WHAT_ANALOG_HORROR_SOUNDS_LIKE_9_21_26.md). This page feeds both. It builds nothing.

*** READ THIS BOX FIRST. THIS IS A GENRE STUDY, NOT A REFERENCE GAME. ***
The reference games are fixed by law: Battle Brothers, Rogue Fable 4, Final Fantasy XII, Final Fantasy X,
Fallout 1, Ocarina of Time, Pocket City 2 (and Machine Party as the one named visual bridge). NONE of the ten
games below joins that list. NEVER ADD A REFERENCE GAME HE HAS NOT NAMED stands in full. He asked for a study of
the GENRE through its ten most cited games, so this page names them the way a film school names ten films: to
take apart HOW the look is built, in numbers, and then throw the games away. No game's assets, UI, fonts, sprites,
sounds or screens are to be copied. What travels is the technique and the number, never the thing. The law's own
words: analog horror is "decided at the source: what is in the frame, how it is lit, how long it holds, what it
sounds like. A scanline shader over a cheerful street is the violation" (laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md s3).
Where this page and the bible disagree, the bible is the law and this page is the school.

## 0. HOW THE TEN WERE PICKED, AND WHAT COULD NOT BE VERIFIED
There is no single authoritative top ten. The list below is the overlap of: itch.io's analog-horror tag rankings
(https://itch.io/games/top-rated/tag-analog-horror), Game Rant's "8 Best Analog Horror Games"
(https://gamerant.com/best-analog-horror-games/), Indie Game Insight's 2026 picks
(https://indiegameinsight.com/best-analog-horror-games/), Best Games All Time's list
(https://bestgamesalltime.com/analog-horror-games-the-scariest-experiences-you-cant-look-away-from), Wikipedia's
tag list (https://en.wikipedia.org/wiki/List_of_horror_games), plus the games that reviewers and Steam tags file
under "analog horror", "found footage", "PSX horror" or "lo-fi horror" and that sold or spread the most. Where a
game is more often called "PS1 horror" than "analog horror" (Mouthwashing, Signalis, Puppet Combo) it is here
because the genre write-ups and the analog horror tag both claim it and because its techniques are the same
family. Sales figures are third-party estimates unless a publisher said the number.

What the web would not give up: exact internal render resolutions for Iron Lung, Mouthwashing, Buckshot Roulette,
Puppet Combo's games and Chilla's Art's games are NOT published by their developers. Where a number below is
marked INFERRED it comes from a reviewer, a community decompile, or a shader the developer pointed at, not from
the developer's mouth. Where it is marked VERIFIED, the developer or an engine document said it. The
"analog horror" label for games is also looser than for web series: the Wikipedia definition is "low-fidelity
graphics, cryptic messages, few to no traditional jump scares, and visual styles reminiscent of late 20th-century
television and analog recordings" (https://en.wikipedia.org/wiki/Analog_horror, genre named from Kris Straub's
Local 58, October 2015, slogan "ANALOG HORROR AT 476 MHz"). Several of the ten break the "few jump scares" rule.
Their LOOK is still the genre's look, and the look is what was asked for.

Dropped from the candidate list after checking: The Mortuary Assistant (2022, DarkStone Digital) is realistic 3D
with no VHS or low-fi layer; reviewers praise its sound and never call it analog horror
(https://indie-hive.com/the-mortuary-assistant/, 2022). Fears to Fathom (2021 to 2024, Rayll) is widely played
but no source describes its look beyond "based on true events" framing
(https://en.wikipedia.org/wiki/Fears_to_Fathom); it is listed as an honourable mention. Voices of the Void
(MrDrNose, 0.9.0 March 2026) is low-poly Unreal with CRT monitors but has no sourced technique write-up
(https://en.wikipedia.org/wiki/Voices_of_the_Void). Paratopic (2018, Arbitrary Metric) is the oldest "PS1 horror
with jump cuts" and is kept as an honourable mention (https://techraptor.net/gaming/reviews/paratopic-review, 2018).

## 1. THE TEN, ONE AT A TIME
Each entry: year, developer, what it is, THE LOOK IN NUMBERS AND TECHNIQUES, and the one line that matters most
for us: WHAT WAS DECIDED AT THE SOURCE versus WHAT IS A FILTER LAID ON TOP.

### 1.1 IRON LUNG (2022, David Szymanski, Unity)
What it is: a convict pilots a one-man submarine through an ocean of blood on a dead moon. The one porthole is
welded shut by pressure. You see the outside ONLY through a grainy still camera that takes a photo on command,
plus a hand-drawn map and proximity sensors (Steam listing, https://store.steampowered.com/app/1846170/Iron_Lung/,
2022; https://en.wikipedia.org/wiki/Iron_Lung_(video_game)). Steam 92% positive on roughly 9,900 reviews; film
adaptation directed by Markiplier announced 21 April 2023 (same Wikipedia page).
The look in numbers and techniques:
- Internal resolution: NOT PUBLISHED. Reviewers describe "low-poly aesthetic reminiscent of early 90s PC gaming".
  Models are deliberately low-poly (the sub interior, the corridor); the game "leans on a low-fidelity aesthetic
  rather than detailed models" (Foro3D technical write-up, May 2026,
  https://foro3d.com/en/2026/mayo/claustrofobia-en-unity-el-diseno-tecnico-de-iron-lung-y-el-horror-de-b.html).
- Palette: INFERRED. The whole game is rust brown, dim yellow bulb light, and the red of the blood ocean seen as
  near-monochrome grey in the camera photos. The camera photo is the only "outside" image and it is grain over a
  nearly black frame: three or four values of grey, no colour.
- Post effects: VERIFIED by the write-up above: Unity shaders applied in real time for chromatic aberration and
  vignetting, plus a script-generated film grain overlay. The camera photo adds heavy noise and a slow "develop".
- Lighting: one practical bulb inside the sub, hard falloff, every instrument glows on its own (the monitor, the
  dials). Outside, one camera flash lights a cone and nothing else.
- Typography: in-world instrument readouts only; the map is a paper drawing; coordinates are typed numbers.
- Sound: the hull creaks, the engine thrums, the proximity sensor beeps; Szymanski composed the score himself
  and listeners say it "captures the atmosphere of being helpless and on your own"
  (https://www.albumoftheyear.org/album/494042/). There is no voice for most of the game.
DECIDED versus FILTER: DECIDED: you cannot look out; the only picture is a still photo you have to ask for and
wait for. That one rule is the whole game. The grain and aberration are a filter and would be nothing without it.

### 1.2 FAITH: THE UNHOLY TRINITY (2017 to 2022, Airdorf Games / Mason Smith, published by New Blood, GameMaker)
What it is: a priest returns to the house of a failed exorcism; a top-down-ish 2D game drawn like an Atari 2600
or Apple II title, with rotoscoped cutscenes and demon voices through a speech synthesizer
(https://en.wikipedia.org/wiki/Faith:_The_Unholy_Trinity; https://nichegamer.com/reviews/faith-the-unholy-trinity-review/, 2022).
The look in numbers and techniques:
- Resolution: VERIFIED 192 x 160 pixels. Smith's own GDC talk is titled "The Art of 'FAITH': Horror at 192x160
  Pixels" (https://gdcvault.com/play/1026045/The-Art-of-FAITH-Horror, 2019). That is 30,720 pixels for the
  whole screen. A character is a stack of a few dozen pixels. The whole look is one decision: a canvas this small.
- Palette: a few flat colours per screen in the 8-bit home computer manner; black backgrounds, one or two
  saturated hues, white for the priest's collar and the cross. The stated targets are "MS-DOS, Atari 2600, Apple
  II, and ZX Spectrum" (GDC page above) and the "Atari/ZX Spectrum/Apple II aesthetic" (Game Developer interview,
  https://www.gamedeveloper.com/design/faith-the-unholy-trinity). Reviewers call the palette "minimalistic" and
  the sprites "blocky" (https://www.nookgaming.com/faith-the-unholy-trinity-review/).
- Animation: sprites step at a few frames; the horror beats are ROTOSCOPED live action traced to the same tiny
  grid, so a real human body suddenly moves at full frame rate inside a world that barely moves ("hand-crafted
  rotoscope animation", official feature list via the same reviews). The contrast is the scare.
- Post effects: almost none. No scanlines, no VHS layer. The canvas itself is the effect.
- Lighting: flat. Black is the night; a lit room is a flat colour rectangle.
- Typography: a bitmap font in the same pixel grid as the sprites; text appears in boxes, no timestamps.
- Sound: "demonic EVPs channeled through abandonware speech synthesizers" (official feature list), i.e. a 1990s
  text-to-speech voice for the demons; sparse chiptune music; long silences.
DECIDED versus FILTER: everything DECIDED. 192 x 160 is a choice, the palette is a choice, the rotoscope is a
choice, the text-to-speech voice is a choice. There is no filter to remove. This is the purest case on the list
and the closest in kind to a pixel game.

### 1.3 PUPPET COMBO: MURDER HOUSE (2020) and NUN MASSACRE (2018) (Ben Cocuzza, Unity)
What it is: slasher-movie survival horror "modeled after early PlayStation games and VHS"
(https://en.wikipedia.org/wiki/Puppet_Combo). Nun Massacre is a "32-bit stealth survival horror" game; Murder
House is the most acclaimed. Cocuzza is "a huge fan of '70s and '80s horror movies, most especially slashers"
(https://www.destructoid.com/puppet-combo-one-mans-take-on-indie-horror-gaming/).
The look in numbers and techniques:
- Internal resolution: NOT PUBLISHED; INFERRED low, in the PS1 band (256 to 320 wide by 240 high) from the
  stated model. Reviewers: "low-rez graphics combined with the '80s VHS-like film grain and menus".
- PS1 layer: VERIFIED. Cocuzza said the look is "actually the psx unity shader" and linked the open-source
  dsoft20/psx_retroshader (https://x.com/PuppetCombo/status/1087849319812743168, 2019;
  https://github.com/dsoft20/psx_retroshader, MIT). That shader does AFFINE texture mapping (textures swim on
  big polygons; the author recommends subdividing meshes), vertex-lit shading, linear fog that CUTS polygons past
  a distance (polygon cut-out driven by the fog colour alpha), and a posterize image effect for low colour depth.
- VHS layer: VERIFIED as a cheap overlay in the early games: "Unity 4 had a lot of limitations (no image effects)
  so the vhs effects were just still images overlaid in front of the camera"
  (https://www.moddb.com/members/puppetcombo/comments). Later games use real post shaders; a community "Puppet
  Combo VHS Pack for Unity" exists (https://www.patreon.com/posts/puppet-combo-vhs-102775407).
- Palette: low, posterized; dominant sodium orange, dark green, VHS grey. Grain over everything.
- Lighting: one flashlight cone or one porch light; fog eats everything past a few metres.
- Typography: chunky retro menu fonts, "bursts of television static and a retro font" (fan project write-up,
  https://www.trustedreviews.com/news/ps1-inspired-hotline-miami-fan-project-looks-bananas-3643968).
- Sound: VHS hiss under everything, slasher synth, a killer's footsteps as the main instrument.
DECIDED versus FILTER: the PS1 geometry rules (affine swim, vertex snap, fog cut) are DECIDED at the mesh level.
The VHS grain and menus were literally a picture laid in front of the camera: a FILTER, and the developer says so.

### 1.4 MOUTHWASHING (2024, Wrong Organ, published by Critical Reflex, Unity)
What it is: the crew of a freight ship after a deliberate crash; first-person psychological horror "on PSX-style
characters" (Steam page, https://store.steampowered.com/app/2475490/). Over 500,000 units by February 2025
(https://www.analogstickgaming.com/news/2025/2/19/critical-reflex-amp-wrong-organs-mouthwashing-marks-500000-units-sold-on-steam);
Steam 95% positive on about 37,800 reviews (https://vaporlens.app/app/2475490/mouthwashing.md).
The look in numbers and techniques:
- Internal resolution: NOT PUBLISHED. Letterboxed on 16:10 screens (Steam Deck review,
  https://steamdeckhq.com/game-reviews/mouthwashing/, 2024). Reviewers see "a dithering that litters the visual
  style alongside block hands" (https://goodgamelobby.substack.com/p/mouthwashing-review-psychological-horror-indie-game-wrong-organ).
- Palette: VERIFIED "sunset colours from the beginning; the sunset in space was a main visual motif" (art director
  Johanna Kasurinen, https://skyboxcritics.com/2025/07/14/mouthwashings-genesis-sick-jokes-and-the-thin-line-between-goofy-and-grotesque-an-interview-with-wrong-organ/, 2025).
  So: orange, magenta, deep blue, with a corporate sky-blue and white for the company branding. Warm, not grey.
- Why low-poly: VERIFIED. Kasurinen "had not made any art or 3D models before, so the style was one she could
  actually execute, and she felt it suited horror by creating unease from the start"; she was "introduced to this
  style by Puppet Combo" (same interview; https://www.vgfacts.com/game/mouthwashing/trivia-19188/).
- Post effects: dithering, soft pixelation; no VHS tracking noise. The camera cuts hard between scenes (jump
  cuts, title cards in the company's clean font).
- Lighting: flat fluorescent in the ship, then one colour flood per scene (red alarm, orange sunset, blue
  medbay). One colour owns the frame.
- Typography: a clean corporate sans for the company (Pony Express) against the grime; the horror is the brand
  staying cheerful.
- Sound: a soft corporate jingle, hum, long quiet, a few loud wrong noises.
DECIDED versus FILTER: the palette, the one-colour-per-scene lighting and the cheerful brand are DECIDED. The
dithering is a filter. Its lesson is that "PS1 horror" does not have to be grey: a sunset palette can be dread.

### 1.5 SIGNALIS (2022, rose-engine, published by Humble Games, Unity)
What it is: a top-down-ish survival horror in a dead off-world mining facility; Resident Evil and Silent Hill
structure, Evangelion and Ghost in the Shell imagery (https://en.wikipedia.org/wiki/Signalis). Metacritic 80 to
84 by platform, OpenCritic 85%, Steam Overwhelmingly Positive on about 30,900 reviews
(https://opencritic.com/game/13889/view). The ONLY game on this list whose camera is mostly top-down, so the
most directly useful to us.
The look in numbers and techniques:
- Resolution: VERIFIED 640 x 360. "The team strictly sticks to a 640 x 360 pixel resolution. Everything in the
  game is rendered at this resolution before it's upscaled" and "the 3D objects had to match the sprites' level
  of detail" (Alex Zwerger interview, https://indiegraze.com/?p=989, 2022). 230,400 pixels, then integer or
  near-integer scaled. The team started in 2D and moved to 3D "to stay as close as possible to the look we had
  already created with 2D assets".
- Palette: INFERRED from the frames: near-monochrome steel grey and dark teal rooms, with ONE saturated red used
  as the signal colour (blood, the eye, the alert text), and white for hard light. Reviewers single out "the
  color palette as a source of the game's oppressive atmosphere" (same interview page).
- Post effects: VERIFIED as toggles: a CRT effect and film grain can be turned off
  (https://steamcommunity.com/app/1262350/discussions/0/3473990693214409304, 2022); chromatic aberration is
  baked in and players asked for a toggle (https://steamcommunity.com/app/1262350/discussions/0/3495383984955765341).
  Hard black letterboxing in cutscenes. Glitch cuts to full-screen text and symbols.
- Animation: characters are 3D rendered down to the 640 x 360 grid so they read as sprites; no sub-pixel motion.
- Lighting: harsh single light sources: a flashlight cone, a red alarm, a monitor. Hard black shadows.
- Typography: a monospace terminal face for in-world screens, a Fraktur-like face for the state's titles, German
  and Chinese stencilling on walls; alarm text in the same calm register as the menu.
- Sound: radio static is a MECHANIC (you tune frequencies), room hum, a distant loop, voices through speakers.
DECIDED versus FILTER: 640 x 360 and "3D must match the sprite detail" are DECIDED and are the whole discipline.
The red-as-signal-colour is decided. The CRT and grain are FILTERS and the developers made them optional, which
tells you they knew it.

### 1.6 BUCKSHOT ROULETTE (2023 itch.io, 2024 Steam via Critical Reflex, Mike Klubnika, Godot)
What it is: Russian roulette with a 12-gauge against a dealer across one table in an underground nightclub;
Steam launch 4 April 2024, 1 million units in about a week, 4 million by 10 December 2024, 8 million reported
23 December 2025 (https://en.wikipedia.org/wiki/Buckshot_Roulette;
https://www.worthplaying.com/article/2024/4/17/news/141624-buckshot-roulette-exceeds-1-million-copies-sold-on-steam/;
https://wnhub.io/news/investment/item-46509).
The look in numbers and techniques:
- Internal resolution: NOT PUBLISHED; INFERRED low from "low poly low resolution game" (itch comment,
  https://mikeklubnika.itch.io/buckshot-roulette/comments?after=6938) and a player asking whether the dev "used a
  dithering shader or shrank the aspect ratio". A secondary write-up claims MagicaVoxel models, nearest-neighbour
  texture filtering and a CRT post shader in Godot (Foro3D, May 2026,
  https://foro3d.com/pt-br/2026/mayo/como-buckshot-roulette-recrea-el-terror-industrial-de-los-90-en-godot.html);
  treat as unverified.
- Palette: near black, one cold white-green fluorescent, skin, the brass of shells, the red of the shotgun's
  glow. Fewer than ten hues read across the whole game.
- Lighting: ONE ceiling fluorescent over the table, everything else falls to black within a metre. A flicker.
  This is the clearest "one light source, hard falloff" on the list.
- Animation: the dealer's small moves, flicker, texture crawl. "Small animations, flickering, and other
  textures" carry it (https://noobfeed.com/reviews/buckshot-roulette-review, 2024).
- Typography: INFERRED from a community decompile: the dealer's lines in Fake Receipt (a thermal-receipt font)
  and DOTMATRI (dot-matrix) (https://steamcommunity.com/app/2835570/discussions/0/4365754355268118722, 2024).
  Both are "machine that prints" faces, not display type.
- Sound: a constant pressing electronic score, faint room sound, then the single loudest sound in the game, the
  shotgun; "the loud blast of the shotgun constantly remind you that every decision has weight" (NoobFeed above).
  An Italian write-up calls it a "rhythmic drum-machine soundtrack" (https://games.gg/it/buckshot-roulette/).
DECIDED versus FILTER: the one light, the one table, the receipt font and the one loud sound are DECIDED. The
pixelation and any CRT pass are a filter. The game would survive without the filter; it would die without the
one light.

### 1.7 ANATOMY (2016, Kitty Horrorshow, Unity)
What it is: you walk an empty suburban house at night collecting cassette tapes; the house changes between
replays and the game's own "tape" degrades more each time you come back
(https://en.wikipedia.org/wiki/Anatomy_(video_game); essay "ANATOMY is a masterpiece of cassette tape horror",
https://www.goodreads.com/author_blog_posts/9978867-anatomy-is-a-masterpiece-of-cassette-tape-horror, 2016).
Horrorshow's work is "in the aesthetic style of early 3D video games" (https://en.wikipedia.org/wiki/Kitty_Horrorshow).
This is the game most often named as the bridge between web-series analog horror and games.
The look in numbers and techniques:
- Resolution: low, early-3D; textures are a few dozen pixels across; no published number.
- Palette: nearly black. Beige walls, brown carpet, one lamp's yellow. Under five hues most of the time.
- Post effects: VERIFIED by the essay: the opening "simulates loading a tape"; "distorted scanlines of a corrupt
  VHS tape obstruct the first-person view"; the tape "looks more degraded on each return". The degradation is
  tied to story progress, not random.
- Lighting: a flashlight-less dark house; the few lamps that are on are the only light.
- Typography: the tape player's own text; otherwise none.
- Sound: a woman's voice on cassette, with hiss and the clunk of the deck, reading an essay about houses as
  bodies. The deck's mechanical sounds are the loudest thing in the game.
DECIDED versus FILTER: the DECISION is that the whole game is a tape, and the tape wears out as you learn. The
scanlines are a filter, but they are tied to a rule (each return = more damage), which is what makes them
content instead of decoration. That rule is the lesson.

### 1.8 CHILLA'S ART: THE CONVENIENCE STORE (2020) and NIGHT DELIVERY (2021) (Chilla's Art, Unity)
What it is: Japanese two-brother studio; a student works the night shift at a konbini; a courier delivers at
night. J-horror pacing. The Convenience Store became a live-action film released 20 February 2026
(https://en.wikipedia.org/wiki/The_Convenience_Store;
https://automaton-media.com/en/news/chillas-arts-horror-hit-the-convenience-store-to-get-movie-adaptation-in-2026/).
The look in numbers and techniques:
- Resolution: photoreal-ish low-poly 3D at normal resolution, then crushed by the filter. The store is the
  listed selling point: "a custom VHS filter that mimics the degradation of analog tape" (Wikipedia above).
- Post effects: VERIFIED by the Night Delivery store text: the VHS effects "emulate the look and feel of CRT
  screens, including phosphor screen trails and bleeding of analog video signals, VHS tape noise, interlacing,
  and jitter" and "can be turned off in the options menu" (https://www.dekudeals.com/items/chillas-art-night-delivery;
  https://www.gamespark.jp/article/2021/04/26/108136.html, 2021). Later titles repeat the toggle
  (https://automaton-media.com/en/?p=15938, The Bathhouse, 2022).
- Palette: real-world lit: the cold white of the store's fluorescents against orange street sodium outside; the
  filter pulls saturation down and bleeds the reds.
- Lighting: FLAT FLUORESCENT. The store is lit evenly and that is the horror: there is nowhere dark to hide
  what is wrong. The road outside is one headlight cone.
- Typography: Japanese shop signage and receipts, in-world; a plain sans for the UI.
- Sound: fluorescent hum, the door chime, the register, long silence, a footstep that should not be there.
DECIDED versus FILTER: the flat-lit ordinary store with one wrong thing is DECIDED (this is the bible's rule 1
and rule 4 in one). The VHS pass is pure FILTER and the studio ships it with an off switch.

### 1.9 LETHAL COMPANY (2023 early access, Zeekerss, Unity)
What it is: four-player co-op salvage on dead moons for a company that does not care; estimated 10 million
copies by January 2024 (https://gamedeveloper.com/business/lethal-company-sold-an-estimated-10-million-copies;
https://en.wikipedia.org/wiki/Lethal_Company). Here because its look is the retro-terminal branch of analog
horror and it is the most played game with that look.
The look in numbers and techniques:
- Resolution: full resolution 3D with "low polygonal assets blended with modern rendering techniques", a
  "retrofuturistic" world where "technology is large, bulky and decaying rapidly"
  (https://www.actugaming.net/jeux/lethal-company/). The UI is pixelated during play.
- Palette: grey-green CRT terminal, orange warning paint, black. Fog eats colour past a few metres.
- Typography: VERIFIED the UI is set only in 3270font, a face based on the IBM 3270 terminal
  (https://fontsinuse.com/uses/68901/lethal-company-video-game). One monospace terminal font for everything.
- Lighting: your flashlight cone, the ship's one interior light, the terminal's glow. Outdoors a flat grey sky.
- Sound: VERIFIED proximity voice that "naturally echoes or muffles based on environmental factors", walkie
  talkies, and "when someone meets their end, their audio is abruptly cut off"
  (https://windowscentral.com/gaming/lethal-company-was-2023-best-indie-game-surprise-so-brilliant-cant-stop-playing, 2023).
  The ship's spectator camera is a low-res security monitor.
DECIDED versus FILTER: the terminal as the company's only voice, the one monospace font, and the voice cut-off
rule are DECIDED. The UI pixelation is a filter.

### 1.10 HOME SAFETY HOTLINE (2024, Night Signal Entertainment, Unity)
What it is: you are a call-centre operator in 1996 matching callers' home problems (mould, pests, and then
things that are not pests) to a database; the whole game is a Windows 95-era desktop
(https://www.gamedeveloper.com/design/home-safety-hotline-interview;
https://bloody-disgusting.com/video-games/3798051/home-safety-hotline-video-game-review-customer-service-meets-analog-horror/, 2024).
The developers "discovered analog horror videos online that felt tailor-made for the secondhand storytelling"
and chose the 1990s because the series they admired drew on '90s educational VHS tapes
(https://dreadcentral.com/interviews/473169/home-safety-hotline-interview-a-love-letter-to-analog-horror, 2024).
A film adaptation was announced April 2026 (https://checkpointgaming.net/news/2026/04/film-adaptation-of-indie-horror-home-safety-hotline-is-in-the-works/).
The look in numbers and techniques:
- Resolution: the desktop is drawn at a 1990s screen's density; "all the images and videos included are
  appropriately pixelated and grainy" (Bloody Disgusting above). Embedded video clips are small, 4:3, and
  degraded.
- Palette: VERIFIED period UI: "we looked into a lot of corporate Windows 95 software from the era and tried
  our best to emulate its look and feel" (Game Developer interview); a player can switch the OS colour scheme
  (https://gamecamisado.substack.com/p/review-home-safety-hotline). So: teal desktop, grey chrome, navy title
  bars, 16-colour icons.
- Typography: period system fonts, bitmap, in dialog boxes. The horror text is a database entry in the same
  type as "frozen pipes".
- Lighting: none; it is a screen. The "light" is the CRT's own glow implied by the hum.
- Sound: VERIFIED "CRT hum, mouse clicks, and OS error sounds" praised as lavish (Game Camisado above); callers'
  voices through a phone line (band-limited), hold music.
DECIDED versus FILTER: the DECISION is that the player only ever sees the institution's screen, and the monster
is a row in its database written in the same calm words as a pest. There is almost no filter at all.

### Honourable mentions (cited, not studied in depth)
Fears to Fathom (2021 to 2024, Rayll / Mukul Negi): five episodes "based on true events", free first episode 2
July 2021 (https://en.wikipedia.org/wiki/Fears_to_Fathom). Paratopic (2018, Arbitrary Metric): PS1 textures and
hard jump cuts, OpenCritic 63 (https://opencritic.com/game/7449/paratopic). The Backrooms 1998 (2022, Steelkrill):
found-footage camcorder filter, 1990s setting (https://giantbomb.com/wiki/Games/The_Backrooms_1998). Voices of
the Void (MrDrNose, in development): CRT monitors and a radio observatory. DEADCAM and SEPTEMBER 1999 (98DEMAKE):
camcorder-POV one-room pieces (https://indiegameinsight.com/best-analog-horror-games/, 2026).

## 2. THE SHARED GRAMMAR: TEN TECHNIQUES MOST OF THEM SHARE, EACH IN A TESTABLE FORM
Each line: the technique, how many of the ten use it, the number or test, and where the number comes from.

G1. RENDER SMALL, THEN SCALE UP WHOLE. 8 of 10. The picture is drawn on a small grid and scaled to the screen
    without blurring. Numbers on record: 192 x 160 (Faith, VERIFIED), 640 x 360 (Signalis, VERIFIED), the PS1
    band 256 x 240 / 320 x 240 / 512 x 240 (the PS1 shader guides, https://github.com/MenacingMecha/godot-psx-style-demo;
    https://github.com/BucketOSoftware/playshader-one). TEST: the internal buffer is at most 640 wide; the scale
    factor to the screen is a whole number or the pixels are nearest-neighbour; no sub-pixel positions.

G2. FEW COLOURS, CRUSHED BLACKS, ONE SIGNAL HUE. 10 of 10. PS1 hardware drew in 15-bit colour (5 bits per
    channel, 32,768 colours) with optional dithering (https://shapes.inc/fandom/playstation-1/deep-dive); the
    shader guides tell you to posterize textures to 15 or 16 levels before import (MenacingMecha above). In
    practice each game's frame reads as under ten hues: Signalis grey plus one red, Buckshot black plus one
    fluorescent green-white, Faith black plus two or three. TEST: count distinct hues at 10% saturation steps in
    a frame: under 10; black occupies over 40% of the frame in a night scene; one hue is reserved for "wrong".

G3. ONE LIGHT, HARD FALLOFF, EVERY LUMEN HAS A FIXTURE. 9 of 10. Buckshot's one fluorescent, Iron Lung's one
    bulb, Anatomy's one lamp, Puppet Combo's one flashlight cone, Chilla's flat store tubes. No ambient fill, no
    mood gradient. TEST: every lit region can name its fixture in the frame; brightness drops to black within
    one tile of the fixture unless a second fixture is in frame. (This is the bible's rule 4 already.)

G4. THE ANIMATION STEPS SLOWER THAN THE CAMERA. 7 of 10. PS1-style characters move at a few keyframes with no
    smoothing, while the camera and the post pass run at full frame rate; Faith's rotoscoped cutscenes invert
    it (the monster moves at full rate while the world barely moves). Bodies at 12 to 15 drawn frames a second
    is the PS1 and VHS-era feel; VHS itself is 29.97 interlaced fields a second with heavy motion smear. TEST:
    body keys at 12 per second or fewer (our 120 BPM twelve-keys-a-bar law already lands here); the thing that
    scares moves at a DIFFERENT rate from everything else, slower or faster, never the same.

G5. TEXTURE SWIM AND VERTEX WOBBLE (3D ONLY). 6 of 10. The PS1 had no perspective-correct texturing and no
    sub-pixel vertex precision, so textures slide and corners jitter (https://github.com/BucketOSoftware/playshader-one;
    https://www.gamepro.de/artikel/ps1-psx-grafik-look-einzigartigkeit,3382561.html). TEST: not applicable to 2D
    sprites; see section 3.

G6. FOG OR BLACK THAT CUTS THE WORLD OFF CLOSE. 7 of 10. Linear fog to a hard cut a few metres out (the PS1
    shader cuts polygons past fogstart plus a distance, https://github.com/dsoft20/psx_retroshader). TEST: the
    visible world ends within a fixed, short distance and the end is a flat colour, not a gradient to a horizon.

G7. THE TAPE LAYER IS A TOGGLE, OR IT IS A RULE. 6 of 10 carry a VHS or CRT pass: Chilla's, Signalis, Puppet
    Combo, Anatomy, Iron Lung's camera, Home Safety's embedded clips. Three of them ship it with an OFF switch
    (Chilla's, Signalis, and Puppet Combo's early overlay was a still image). The one that makes it content is
    Anatomy, where damage increases by rule. The VHS facts behind the look: luma about 240 to 300 lines, chroma
    far lower (a hobbyist estimate puts it near 40 lines across the frame), chroma smearing to the right, head-
    switching noise at the bottom of the frame hidden by TV overscan (https://forum.videohelp.com/showthread.php?p=2161204;
    https://shaders.com/docs/components/vhs). TEST: if a tape effect exists, it is INSIDE an in-world screen or
    tied to a world-state rule; a full-frame pass with no rule fails (the bible's rule 8).

G8. THE INSTITUTION'S TYPE: MONOSPACE, MACHINE-PRINTED, TOO CALM. 8 of 10. IBM 3270 terminal font (Lethal
    Company, VERIFIED), receipt and dot-matrix faces (Buckshot, INFERRED), Windows 95 system bitmap fonts (Home
    Safety), terminal monospace (Signalis), VCR on-screen-display lettering in the web-series branch (VCR OSD
    Mono, four million downloads, https://designbeep.com/2026/04/19/vcr-osd-mono-font/). The alarm is set in the
    same face as the timetable. TEST: one or two typefaces per game, both machine faces; zero decorative type;
    an emergency line and a menu line are the same size, weight and colour. (The bible's rule 5.)

G9. THE ROOM IS NEVER SILENT, AND THE VOICE COMES THROUGH A MACHINE. 10 of 10. Hum (fluorescent, CRT, hull),
    hiss (tape), a mechanical transport sound (deck clunk, register, shotgun pump). Voices: text-to-speech
    (Faith), cassette (Anatomy), phone line (Home Safety), walkie and spectator monitor (Lethal Company), radio
    tuned by hand (Signalis). Guides for the genre's voice: band-limit to roughly 300 Hz to 3 kHz for a line or
    speaker, drop pitch 20 to 50% for a slow tape, add wow and flutter and a constant hiss floor
    (https://speechactors.com/article/what-tts-does-analog-horror-use; https://www.videosdk.live/developer-hub/tts/analog-horror-text-to-speech).
    TEST: no scene bottoms out at digital zero; every voice has a fixture (phone, speaker, deck, radio) and a
    matching band-limit; the loudest sound in the game happens fewer than a handful of times.

G10. THE FRAME IS ORDINARY AND ONE THING IS WRONG, AND THE GAME DOES NOT POINT AT IT. 10 of 10. The konbini is
    just a konbini; the hotline is just a hotline; the table is just a table. Nothing zooms to the wrong thing.
    TEST: name the wrong thing in one sentence; count camera moves triggered by it: zero. (The bible's rules 1
    and 2. The ten games confirm the bible wrote the genre down right.)

Two more that some share: HARD CUTS INSTEAD OF TRANSITIONS (Mouthwashing, Paratopic, Signalis: a cut to black
or to a full-screen word, never a fade), and THE CAMERA YOU DO NOT CONTROL (Iron Lung's still camera, Lethal
Company's monitor, Home Safety's clips: the picture arrives from a device, late, and you cannot pan it).

## 3. WHAT OF IT FITS A TOP-DOWN 45-DEGREE PIXEL GAME ON A PHONE, AND WHAT DOES NOT
Bohemia is 2D pixel art at a fixed 45-degree camera, a Battle Brothers-style map, a tactical fight on house-sized
tiles at 120 BPM, Las Vegas after the dollar died, on a phone. Nine of the ten games above are first-person 3D.
Most of their grammar is about the LENS. We have no lens; the bible says "the lens is an eye" (rule 8). So the
sorting rule is: anything that lives in the world, the light, the type, the sound and the timing TRANSLATES;
anything that lives in the camera or the polygon pipeline DOES NOT.

### 3.1 TRANSLATES TO SPRITES AND TILES
- G1 RENDER SMALL, SCALE WHOLE: we already do this (the 112 px body box, THE GROUND MAY ZOOM, THE PERSON MAY
  NOT). The genre confirms the rule and adds the test: nearest-neighbour only, whole-number scale, no sub-pixel
  body positions. Signalis is the proof that a 640 x 360 top-down frame can carry the whole genre.
- G2 FEW COLOURS, ONE SIGNAL HUE: translates straight to the tile and body palettes. COLOUR IS TERRITORY already
  reserves hues for factions; the genre asks for ONE more reservation: a single "wrong" hue that no faction owns
  and that appears only where something is wrong (Signalis' red, Mouthwashing's alarm red). Test: that hue is
  under 1% of pixels in a normal frame and is never on a costume.
- G3 ONE LIGHT, HARD FALLOFF: translates to the fight board and the settlement screen. A night fight tile is lit
  by what is on it (a sign, a car, a fire, a window) and falls to black one tile out. The bible's rule 4 already
  says this; the ten games say it is the single most shared technique, so it should be the first thing the fight
  board's night pass is measured on.
- G4 STEPPED ANIMATION AT A DIFFERENT RATE: translates perfectly because our bodies already step at twelve keys
  a bar at 120 BPM. The genre's addition: the WRONG thing in a frame moves at a different rate from the crowd,
  slower (Faith's enemies) or in a burst (Faith's rotoscope, Buckshot's flicker). On a tile: one figure that
  holds for 8 beats while the crowd walks, or one sign that flickers off-beat.
- G6 THE WORLD CUTS OFF CLOSE: translates to the fight board edge and to night. A fight board is a piece of the
  city with a hard edge; the edge is black or a flat value, not a soft vignette. On the map at night, the party
  marker's light radius ends hard.
- G10 ORDINARY FRAME, ONE WRONG THING, NO POINTING: translates to every tile, every settlement screen, every
  portrait. Already the bible's rule 1 and 2. The konbini is our bodega; the hotline is our phone feed.
- HARD CUTS: translate to scene changes (map to settlement to fight): a cut to black for one beat, never a fade
  or a zoom. One game mode, no teleport (THE FIRST VOTES) already forbids the fancy transition; this says the
  cut itself should be a hard black beat.

### 3.2 TRANSLATES TO THE UI AND THE PHONE SCREEN
- G8 THE INSTITUTION'S TYPE: translates whole. One or two machine faces (the font ruling's ROM cells, DIN
  stencil, segment displays), alarm words in the same register as timetable words. The 3270 and receipt-font
  lesson: the FEWER typefaces, the more institutional it reads. Test: the HUD, the feed and the fight use the
  same face at the same size.
- G7 THE TAPE LAYER INSIDE A SCREEN: translates ONLY to the cracked iPhone on the city view and to in-world
  screens (a bodega TV, a casino sign). The phone's feed can carry grain, a dropped frame, a timestamp, because
  the phone is a device in the world. Home Safety Hotline is the model: the institution's screen is the whole
  horror and it needs no filter on the world. The Anatomy lesson is the one worth building: if the feed degrades,
  it degrades BY RULE (a dead grid district's posts arrive more broken), never at random.
- THE CAMERA YOU DO NOT CONTROL: translates to the feed and to event portraits: a picture arrives, late, from a
  device, and you cannot pan it. A road event's face can be a still "photo" with a timestamp from a dead CCTV
  (A QUEST IS PEOPLE, PLACES AND THINGS: text still comes from a mouth with a portrait; the portrait can be a
  frame from a camera that was in the world).

### 3.3 TRANSLATES TO SOUND (hands to SOUNDS' school page, which already has most of it)
- G9 THE ROOM, THE MACHINE VOICE, THE RARE LOUD SOUND: translates whole and is already SOUNDS' rules. The ten
  games add two numbers: the voice band-limit (about 300 Hz to 3 kHz for a phone or PA) and the budget for the
  loud sound (Buckshot: one sound is the loudest and it is rare). For us: the dial's important shot can be the
  one loud sound of a fight; routine hits stay inside the room's level.
- The 120 BPM dead pulse is the genre's hum made into music (the bible's rule 9); Buckshot's drum-machine score
  is the closest cousin and it is a reason to keep the beat audible under the room tone.

### 3.4 DOES NOT TRANSLATE. MUST NOT BE COPIED.
- G5 TEXTURE SWIM, VERTEX WOBBLE, AFFINE MAPPING: these are PS1 polygon pipeline artefacts. A 2D sprite has no
  polygons. Faking "wobble" on a sprite is a filter on a cheerful frame: the exact violation the law names.
- FULL-FRAME VHS, CRT, SCANLINE, CHROMATIC ABERRATION, FILM GRAIN PASSES over the world: banned by the bible's
  rule 8 and rule 10 and by GRIME IS BAKED. Three of the ten games made these optional and lost nothing. On a
  phone they also cost frame rate and legibility at 60 fps, which PLUMBER guards.
- FIRST-PERSON FLASHLIGHT CONES AND HEAD BOB: there is no head. The equivalent is a tile's own fixture (G3), not
  a cone that follows the player.
- FOG AS A 3D DRAW-DISTANCE TRICK: ours is a hard board edge and a night value multiply, not a depth fog.
- LETTERBOXING AND 4:3 FRAMES: a phone is a tall screen; cropping it to 4:3 throws away the HUD area and
  violates the one-HUD-at-every-zoom rule (POCKET CITY 2 zoom range). The 4:3 lives only INSIDE the phone's
  feed clips, where a 4:3 clip is a device's clip.
- JUMP SCARES AND GORE: not the genre's grammar (Wikipedia's definition: "few to no traditional jump scares")
  and not the bible's ("NOT A MONSTER"). Puppet Combo and Mouthwashing use them; that part stays with them.
- ANY GAME'S FONT, SPRITE, UI LAYOUT, LOGO, COLOUR SCHEME OR SOUND: none of it. These ten are a genre study.
  The reference list has seven games and Machine Party and that list did not grow by one pixel on this page.

## 4. THE FIVE MOST TRANSLATABLE TECHNIQUES, FOR THE BIBLE'S NEXT PASS (DIRECTION's row)
1. ONE LIGHT, HARD FALLOFF, EVERY LUMEN HAS A FIXTURE (G3): the most shared technique of the ten; measure the
   night fight board on it first.
2. FEW HUES PLUS ONE RESERVED "WRONG" HUE (G2): under ten hues a frame; one hue nobody owns, under 1% of pixels,
   only where something is wrong.
3. STEP THE WRONG THING AT A DIFFERENT RATE (G4): our twelve keys a bar is the base; the wrong figure holds 8
   beats or bursts.
4. ONE OR TWO MACHINE TYPEFACES, ALARM SET LIKE A TIMETABLE (G8): the HUD, the feed and the fight share one face.
5. THE TAPE LIVES INSIDE THE DEVICE AND DEGRADES BY RULE (G7, Anatomy's lesson, Home Safety's frame): the
   cracked iPhone's feed is where grain and timestamps are allowed, and the damage traces to a world-state row.

## 5. WHAT THIS PAGE DID NOT DO
It built nothing, changed no other file, added no reference game, and copied no asset. Numbers marked INFERRED
are not to be cited as fact in any gate; only VERIFIED numbers may become gate thresholds, and then as OUR
numbers (the bible's), not as "what game X does". Next research, if wanted: the Faith GDC talk transcript for the
palette count (members-only vault), and a frame-level measurement of Signalis' hue count, since it is the one
top-down game here and the closest cousin of our camera.

## SOURCES (all cited above; collected)
https://en.wikipedia.org/wiki/Analog_horror | https://itch.io/games/top-rated/tag-analog-horror |
https://gamerant.com/best-analog-horror-games/ | https://indiegameinsight.com/best-analog-horror-games/ |
https://bestgamesalltime.com/analog-horror-games-the-scariest-experiences-you-cant-look-away-from |
https://en.wikipedia.org/wiki/Iron_Lung_(video_game) | https://store.steampowered.com/app/1846170/Iron_Lung/ |
https://foro3d.com/en/2026/mayo/claustrofobia-en-unity-el-diseno-tecnico-de-iron-lung-y-el-horror-de-b.html |
https://gdcvault.com/play/1026045/The-Art-of-FAITH-Horror | https://www.gamedeveloper.com/design/faith-the-unholy-trinity |
https://en.wikipedia.org/wiki/Faith:_The_Unholy_Trinity | https://nichegamer.com/reviews/faith-the-unholy-trinity-review/ |
https://en.wikipedia.org/wiki/Puppet_Combo | https://x.com/PuppetCombo/status/1087849319812743168 |
https://github.com/dsoft20/psx_retroshader | https://www.moddb.com/members/puppetcombo/comments |
https://en.wikipedia.org/wiki/Mouthwashing_(video_game) |
https://skyboxcritics.com/2025/07/14/mouthwashings-genesis-sick-jokes-and-the-thin-line-between-goofy-and-grotesque-an-interview-with-wrong-organ/ |
https://indiegraze.com/?p=989 | https://en.wikipedia.org/wiki/Signalis | https://opencritic.com/game/13889/view |
https://en.wikipedia.org/wiki/Buckshot_Roulette | https://noobfeed.com/reviews/buckshot-roulette-review |
https://steamcommunity.com/app/2835570/discussions/0/4365754355268118722 |
https://en.wikipedia.org/wiki/Anatomy_(video_game) |
https://www.goodreads.com/author_blog_posts/9978867-anatomy-is-a-masterpiece-of-cassette-tape-horror |
https://en.wikipedia.org/wiki/The_Convenience_Store | https://www.dekudeals.com/items/chillas-art-night-delivery |
https://www.gamespark.jp/article/2021/04/26/108136.html | https://en.wikipedia.org/wiki/Lethal_Company |
https://fontsinuse.com/uses/68901/lethal-company-video-game |
https://gamedeveloper.com/business/lethal-company-sold-an-estimated-10-million-copies |
https://www.gamedeveloper.com/design/home-safety-hotline-interview |
https://dreadcentral.com/interviews/473169/home-safety-hotline-interview-a-love-letter-to-analog-horror |
https://bloody-disgusting.com/video-games/3798051/home-safety-hotline-video-game-review-customer-service-meets-analog-horror/ |
https://github.com/MenacingMecha/godot-psx-style-demo | https://github.com/BucketOSoftware/playshader-one |
https://shapes.inc/fandom/playstation-1/deep-dive | https://forum.videohelp.com/showthread.php?p=2161204 |
https://shaders.com/docs/components/vhs | https://designbeep.com/2026/04/19/vcr-osd-mono-font/ |
https://speechactors.com/article/what-tts-does-analog-horror-use |
https://www.videosdk.live/developer-hub/tts/analog-horror-text-to-speech |
https://en.wikipedia.org/wiki/Fears_to_Fathom | https://opencritic.com/game/7449/paratopic |
https://giantbomb.com/wiki/Games/The_Backrooms_1998 | https://en.wikipedia.org/wiki/Voices_of_the_Void

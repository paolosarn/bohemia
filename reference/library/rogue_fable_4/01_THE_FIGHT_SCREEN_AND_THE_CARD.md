# 01 ROGUE FABLE IV: WHAT SITS ON THE SCREEN, AND THE CARD (FIGHT SCREEN THREE, 11/20; sourced)
What this page is for: the studio's fight screen and its cards are compared against it before being called final. Nothing of it enters the design vocabulary: structure only. It names its source the way a measurement names its ruler.

HOW IT WAS SOURCED: web search results that quote the pages. This session's network refused steampowered.com and itch.io, so no page was opened directly and NO SCREENSHOT WAS LOOKED AT. Anything about where a panel sits or how big it is comes only from a quoted sentence; where none exists it says "not found". Numbers in brackets point to SOURCES. Game: Rogue Fable IV by Justin Wang, Early Access on Steam since 26 Jan 2024, also played in a browser [1][3]. Search now shows Steam app 2720010 under the title "Wicked Seed" with the Rogue Fable IV text still on it; a rename is not confirmed [4].

## THE SCREEN
- Built with Phaser, an HTML5 engine; it runs in a browser (itch, Newgrounds, Kongregate) and on Steam [1][34].
- The rule, in the developer's words: the game stays "as free as possible of excessive stat and formula bloat, with most of the critical information presented in the world and on the field of battle itself" [2][1].
- The art pass was made "with the main emphasis being on readability during gameplay" [1].
- Ability damage numbers sit at THE TOP OF THE SCREEN; from Update 0.18 melee and ranged damage moved up there too, "where other abilities display damage" [5].
- There is a HUD with buttons (a "goto" button is named in a patch note) [19]. The mouse can do everything, and each button shows its keyboard key when hovered [27][28].
- It is a fixed-shape canvas, not a layout that reflows: at 3440x1440 it does not display properly and shows a scrollbar [21]; on a 4K monitor a maximised window hides the bottom UI behind a scrollbar [22]; on Steam Deck fullscreen cuts off the sides [23].
- Region sizes as fractions of the screen: NOT FOUND (no screenshot could be measured).

## THE PLAYER'S PANEL
- HP is a bar. Damage taken in the previous turn is drawn IN RED ON THE HP BAR, so a big chunk just lost is visible at a glance [16][14].
- From 1.36 armour, shields and talents all give Protection Points, a separate layer above HP; Block Points are gone [14][15]. Whether Protection is drawn as its own bar: not confirmed.
- One spend resource shows at a time: the UI starts on SP or MP by class (0.22) and there is an SP/MP toggle that is saved (0.24) [7][8].
- An EXP bar; hovering it says whether the next level gives a Talent or an Attribute point [5].
- Status effects are GLYPHS ABOVE THE HEAD, drawn from a font file so they can be coloured [18]. All fear effects show the letter "F" (1.36) [14]. Poison shows its running total in the status effect (0.21) [6].
- The character menu (key C) holds talents and attributes; an unlocked ability's name is clicked there to make a hotbar icon, and dragged off to remove it [27][30].
- The first time HP runs low, a one-time hint explains healing mushrooms and its key (0.18) [5].
- Portrait of the player in the panel: NOT FOUND.

## THE MONSTER'S CARD
- It opens by MOUSE-OVER: the patch notes call it the "mouse over description" [16][17].
- What it carries (from patch notes): the monster's attacks with their damage; defence points including temporary ones (before 1.36); movement traits such as Fast-Swimmer. A "Sniper-Mode" line was cut because "the attack with its damage is enough" [16].
- Hold the View-Target key (V) and hover any monster: the RANGE AND BOUNDS OF ALL ITS ABILITIES are drawn on the tiles; healing and buffs are left out "for clarity" (1.35) [13].
- Hovering a Slow-Charging enemy draws the path of its next moves [16].
- Over the monster's head: its status text. A "K" appears when a Killing-Strike can finish it (1.3) [17].
- The same card covers objects: a door's mouse-over shows its "turns to close" (1.36) [14].
- A picture or portrait inside the card, a lore paragraph, or a bestiary page: NOT FOUND.

## THE ACTIONS
- Ability keys 1 to 7; Tab auto melee, Q auto ranged, Space end turn, Shift+Space rest, E explore, G goto, H nearest healing mushroom, C character, < and > stairs [27][28].
- Every ability has its own icon (0.20); the developer called the icon set "good enough" for the web release [9].
- Range: you can only shoot a valid target, to prevent mis-clicks; hold Z to target any tile (1.17) [19]. A player notes the crosshair goes half red when the target is in range [29].
- An optional setting draws an ability's valid range when it is selected. If a ranged attack is out of range or blocked, the bounds of the valid targets PULSE (1.35) [13]. The targeting preview is highlighted purple (1.36) [14].
- Enemy telegraphs: Fast-Charge, Rocket-Punch and Swoop pulse their path as they fire; a stationary totem pulses its area when it casts (1.35) [13]. Many enemy attacks can be dodged by moving alone [12].

## THE LOG AND THE WORDS ON SCREEN
- At launch there was NO MESSAGE LOG. A player asked for one (to see what was looted and what killed him). The developer (Feb 2024): on the to-do list, held off so it would not become a crutch, and he wants "as much information on screen as possible without text"; he also floated a replay of the last turns before death [20]. Whether either shipped: NOT FOUND.
- Text size: "small, but legible" on Steam Deck [24]; Steam's Deck check flags small text [25].

## A HIT, A MISS, A DEATH
- Hit: the red last-turn chunk on the HP bar [16]. HP and MP gains appear as popups; from 1.36 several sources that fire together merge into "a single combined popup (less spam)" [14].
- Shields: "slightly more clear indicators" when attacking into Ice and Force shields (0.4) [10].
- Warnings: a door vibrates the turn before it closes (1.36) [14]; charge paths and totem areas pulse [13].
- Miss: the player has a strafe dodge (base 20%, plus Evasion) (0.8) [11]; a projectile is aimed at the square you left [31]. How a miss is drawn on screen: NOT FOUND.
- Death: the game writes custom death messages for named attacks (Reflection, Rocket-Punch, Tornado-Suck and others) [16]. How a monster's death is animated: NOT FOUND.

## THE END OF A RUN
- A run is about an hour and ends at the wizard Yendor [3].
- Winning raises a "victory popup" dialog [19].
- Ranked mode: wins and losses move a Skill-Rating and a Rank; the new rank shows in the Ranked menu only after you return to the main menu [3][35].
- A "badge window" lists the classes (1.17) [19]; what a badge marks: NOT FOUND.
- A death screen with killer, depth, turns or totals: NOT FOUND. A run history: requested, not confirmed [20].

## THE LOOK
- Pixel tiles; tile size, tileset author and palette: NOT FOUND.
- Status glyphs come from a font file with colours [18]. Panel material, borders and typeface: NOT FOUND.
- The developer's own verdict: the UI is "probably the single biggest thing holding the game back" from looking professional; he plans "a total overhaul on pretty much the whole UI from menus down to the in game HUD" (date not pinned) [32]. 1.17 (Oct 2024) and 1.35 (2026) were mostly UI updates [19][13].

## WHAT PEOPLE SAY
- Steam: Very Positive, about 93% of roughly 225 to 245 reviews [3][33]. A review digest: praise for challenge, replays and the developer's engagement; complaints about balance, technical problems, likeness to Rogue Fable III, and no formal tutorial [33].
- Readability complaints found: small text on Steam Deck [24][25]; scrollbars and cropping on ultrawide, 4K and Deck [21][22][23]; on a phone browser the game is "too wide", the player cannot move, and the fullscreen button is off the screen [26]; no log to learn what killed you [20]; players unsure what the speed stat does [34].
- A reviewer praising its readability in so many words: NOT FOUND (only the developer's claim [1]).

## BATTLE BROTHERS CHECKED
Sourced, against our recall page (battle_brothers/10_UI_AND_FEEL.md): the hit chance appears after you select a skill and hover a target [36]; a brother has 9 AP as baseline [37]; a turn sequence bar shows the active unit's image [42], and players asked for buttons to scroll the initiative bar [43]; Alt toggles health bars in combat [44]; the enemy tooltip shows head armour, body armour, health and fatigue as bars without numbers (a mod adds the numbers) [45]. After a fight a combat result screen opens with two tabs: Statistics (every brother who fought) and Loot (drag gear straight to the stash) [38]; later its stats got tooltips for living and dead men [39]. The character screen, as designed: paper doll on the left with six slots (body, head, main hand, off hand, ammo, accessory) and four backpack slots, stats top right, a bar of brothers along the bottom that swaps to the stash [40][41]; that is a design-stage mockup, the shipped layout is not confirmed. NOT CONFIRMED from our recall: the turn strip being at the TOP, the skills being a row with AP and fatigue costs. MISSING from our recall: the after-battle screen.

## FIVE STRUCTURAL RULES A PHONE FIGHT SCREEN CAN TAKE
1. Draw danger on the tiles, not in text: ranges, bounds and charge paths pulse on the board [13], because the maker wants information on screen "without text" [20].
2. A press-and-hold on an enemy is the card: its attacks with damage, its defence and its movement first [16], then its reach lit on the tiles (RF4's V-plus-hover) [13].
3. Show the size of the last hit on the bar itself: last turn's damage in red on the HP bar [16].
4. A state is one coloured glyph over the head (F fear, K killable) [14][17][18], and same-moment popups merge into one [14].
5. Build for the narrow glass first and give every hover a touch twin: RF4's fixed canvas overflowed phones, ultrawide and 4K [26][21][22], and its keys are only shown on hover [27].

## SOURCES
[1] https://justin-wang123.itch.io/rogue-fable-iv
[2] https://phaser.io/news/2024/07/rogue-fable-iv
[3] https://store.steampowered.com/app/2720010/Rogue_Fable_IV/
[4] https://store.steampowered.com/app/2720010/Wicked_Seed/
[5] https://justin-wang123.itch.io/rogue-fable-iv/devlog/631234/update-018
[6] https://justin-wang123.itch.io/rogue-fable-iv/devlog/640805/update-021
[7] https://justin-wang123.itch.io/rogue-fable-iv/devlog/642775/update-022
[8] https://justin-wang123.itch.io/rogue-fable-iv/devlog/649309/update-024
[9] https://justin-wang123.itch.io/rogue-fable-iv/devlog/637137/update-020
[10] https://justin-wang123.itch.io/rogue-fable-iv/devlog/566937/update-04
[11] https://justin-wang123.itch.io/rogue-fable-iv/devlog/578956/update-08
[12] https://justin-wang123.itch.io/rogue-fable-iv/devlog/649194/game-design-combat
[13] https://steamcommunity.com/games/2720010/announcements/detail/654854646561505819 (Update 1.35)
[14] https://gameupdatenotifier.com/g/rogue-fable-iv/v/1-36 (Update 1.36)
[15] https://store.steampowered.com/news/app/2720010/view/523126984642921819?l=english (Update 1.36)
[16] https://steamcommunity.com/app/2720010/allnews/ (patch notes listing; individual post dates not pinned)
[17] https://steamdb.info/patchnotes/13482844/ (Update 1.3)
[18] https://steamdb.info/patchnotes/15513053
[19] https://store.steampowered.com/news/posts/?feed=steam_community_announcements&enddate=1728789614 (Update 1.17 and hotfixes)
[20] https://steamcommunity.com/app/2720010/discussions/0/4202490257581667072/ (Log History Box?)
[21] https://steamcommunity.com/app/2720010/discussions/1/6257258483698554783/
[22] https://steamcommunity.com/app/2720010/discussions/1/4202490036017610065/
[23] https://steamcommunity.com/app/2720010/discussions/0/640179539761193938/
[24] https://www.protondb.com/app/2720010
[25] https://steamdb.info/app/2720010/info/
[26] https://itch.io/t/3811539/mobile and https://justin-wang123.itch.io/rogue-fable-iv/community
[27] https://armorgames.com/rogue-fable-iv-game/19423
[28] https://kbhgames.com/game/rogue-fable-4
[29] https://www.kongregate.com/en/games/justin_wang123/rogue-fable-iv
[30] https://itch.io/t/3296942/cant-delete-abilities-added-to-hotbar
[31] https://steamcommunity.com/app/2720010/discussions/0/595140105668181799/
[32] https://steamcommunity.com/app/2720010?l=english
[33] https://niklasnotes.com/dashboard/game/92026/rogue_fable_iv
[34] https://www.newgrounds.com/portal/view/908763
[35] https://steamcommunity.com/app/2720010/discussions/0/595140423952903523/
[36] https://battlebrothers.fandom.com/wiki/Hit_Chance
[37] https://battlebrothers.fandom.com/wiki/Combat_Mechanics
[38] https://battlebrothersgame.com/dev-blog-31-progress-update-orcs-ui-new-weapons/
[39] https://battlebrothersgame.com/dev-blog-96-wrapping-things/
[40] https://www.moddb.com/games/battle-brothers/news/progress-report-inventory-screen
[41] https://battlebrothersgame.com/?p=536 (Dev Blog #10)
[42] https://github.com/Darxo/Hardened
[43] https://battlebrothersgame.com/forums/topic/scrollable-initiative-bar/
[44] https://battlebrothersgame.com/forums/topic/hotkeys/
[45] https://www.nexusmods.com/battlebrothers/mods/266

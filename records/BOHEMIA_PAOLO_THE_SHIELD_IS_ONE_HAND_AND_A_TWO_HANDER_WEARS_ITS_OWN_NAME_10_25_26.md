# PAOLO 10/25: THE SHIELD IS ONE HAND, AND A TWO-HANDER WEARS ITS OWN NAME (LOCKED, rule 194)

## HIS WORDS (verbatim, voice to text)
"Bro, it feels like did you turn the fucking shield into a two handed offhand weapon? It's very strange. I mean it's it's a
decision to make like we could move it forward like the shield is actually like a two headed weapon but you made it. I just
seen it like I can't make a spear shield wall anymore so I mean, I don't know why you made that decision but like it could be
a decision like maybe I'd rather have the shield as one-handed off hand. We need one hand like I tried to put the spear in the
shield and it kept saying this shield was like both hands so I was like what the fuck"

## WHAT THE COORDINATOR MEASURED (main at 2165008f)
NOBODY MADE THE SHIELD TWO-HANDED. The shield is the off hand and one hand everywhere: engine/bohemia_roster.js slotFor puts a
shield in 'off'; handsOf returns 0 for anything that is not a weapon; the fight (slices/BOHEMIA_FIGHT.html bothHands) asks
only the WEAPON. What he hit is THE NAME:
- The shop (slices/BOHEMIA_SETTLEMENT_SCREEN.html CLASSNAME, weaponItem) and the crew screen (engine/bohemia_roster.js line 24)
  name a weapon by its CLASS and a quality word from its price rank: every 'spear' row is 'beat-up / solid / good rebar spear'.
- The spear class on the wiki copy (records/target/bb/weapons.json) holds 6 one-handers AND 2 two-handers: the Warfork (rank
  'solid', hands 2) and the Spetum (rank 'good', hands 2). So a 'solid rebar spear' is either the one-handed Boar Spear or the
  two-handed Warfork, and a 'good rebar spear' is the Fire Lance, the Fighting Spear, or the two-handed Spetum. Same name.
- Put a car door on a man holding the Warfork or the Spetum and the crew screen says 'A shield puts the solid rebar spear in
  the stash' (RUN TWO [two hands], rule 149, 19a2d939). In the fight the car door goes on his back (bothHands). From his chair:
  the shield refuses the spear, so the shield looks two-handed, and the spear-and-shield wall is gone.
- NINE CLASSES MIX ONE- AND TWO-HANDERS UNDER ONE NAME: axe (woodcutter's axe, longaxe, man splitter, heavy rusty axe, bardiche,
  greataxe), cleaver (rusty warblade, two-handed saif, crypt cleaver, two-handed scimitar), dagger (estoc), flail (two-handed
  wooden flail, berserk chain, two-handed flail), hammer (two-handed mallet, two-handed skull hammer, polehammer, two-handed
  hammer), mace (goedendag, two-handed spiked mace, two-handed mace, polemace, two-handed flanged mace), spear (warfork,
  spetum), sword (rhomphaia, warbrand, longsword, executioner's sword, greatsword), throwing (staff sling, nomad sling).
- LIKELY THE SAME CAUSE AS LINE 113 ('the spear and car door shield wall... in the third fight it disappeared'): a man who
  picked up a 'rebar spear' that was a two-hander loses the door to his back with no word. COMBAT [gear never vanishes] checks
  this first.

## HOW BATTLE BROTHERS DOES IT (rule 33)
A shield is always the off hand and one hand. The one-handed spears (Militia Spear, Boar Spear, Fighting Spear) with a shield
are the classic front line: Spearwall and Shieldwall on the same man. The two-handed spear-shaped weapons have their OWN names
(Warfork, Spetum, Pike), and the item's tooltip says Two-Handed before you equip it. A name never hides how many hands it takes.

## THE RULING (rule 194)
(a) THE SHIELD IS ONE HAND, IN THE OFF HAND, ALWAYS (his lean, 'I'd rather have the shield as one-handed off hand', and Battle
    Brothers' way; NOTES ARE RULINGS). Nothing about the shield changes; it never was two-handed in the code. A SPEAR IS ONE
    HAND: a spear and a car door on one man is a spear-and-shield wall, on the crew screen and in the fight, every time.
(b) A TWO-HANDER WEARS ITS OWN NAME. No name in the shop, the crew screen, the loot screen or the fight is shared by a one-hander
    and a two-hander. Each two-handed row in the nine classes above gets its own word (draft:true; WORDS may better it), never
    the one-hander's 'rebar spear', 'fire axe', 'machete', 'pipe' with a quality word. Its card says TWO HANDS in big letters
    before he buys or equips it.
(c) THE WORDS BLAME THE RIGHT THING: when a two-hander and a shield meet, the line says the WEAPON takes both hands (e.g. 'The
    warfork takes both hands. Give him a one-hand weapon to carry the car door.'), never a line that reads as if the shield does.
(d) THE GATE: (1) no display name is shared across hands, read off weapons.json through the shop's and the crew screen's own
    naming; (2) on the phone profile, buy a one-handed spear, put a car door on the same man, open a fight: he holds both;
    (3) a two-hander's card carries TWO HANDS.
(e) Rows: RUN TWO [a two-hander wears its own name] FIRST on its board (it built the names and [two hands]); UI NOTE (the crew
    screen's line, (c)); COMBAT NOTE on [gear never vanishes] (check this cause first); EYES re-checks line 115 on the list.

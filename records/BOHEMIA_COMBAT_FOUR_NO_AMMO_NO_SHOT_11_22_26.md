# COMBAT FOUR: NO AMMO, NO SHOT (BUILD 11/22 - NO AMMO, NO SHOT)

11/22/26. COMBAT FOUR, VAMILY rule 478 (Paolo 11/22, a bug he felt: 'how does the ammo work though, sometimes in auto combat one of my
guys has a pistol in his pocket inventory and he's still shooting even though there's no ammo... did you not make sure that when the
ammo says zero you can't even shoot anymore?'). The coordinator's routine: 'Build it the Battle Brothers way: (a) every gun carries
its own rounds... each shot spends one, AT ZERO IT CANNOT FIRE by hand or on AUTO, and AUTO switches the man to his other weapon or
fists; (b) only the weapon in his hands fires... (c) after the fight his guns refill from the company's ammo stock'. Rules 478, 441,
195 (a gun is never a club), 394 (AUTO weighs a swap), 465 (no line rewritten). Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22ze)
- EVERY FIGHT STARTED FULL: crewUnit/makeUnit gave a man's gun its full load at every bell; nothing was kept from the fight before.
- A PISTOL NEVER RAN DRY: its magazine (5, the javelin row it rides) reloaded whole from nowhere, as often as he liked (reload():
  'a.ammo = a.weapon.mag').
- A RIFLE, A CROSSBOW OR A SHOTGUN COUNTED NO ROUNDS AT ALL: their rows carry no 'ammo', so u.ammo was null and only the chamber
  ('loaded') was ever spent.
- AN EMPTY HAND WAS HANDED A GUN: a man the crew screen left with nothing in his hand (gear.main empty) was given his place's own
  weapon (crewUnit: 'G.main && weaponRow(G.main) || weaponRow(rows[job])'), so a man with a pistol in his POCKET fired a gun that was
  not his, from a full load, every fight. That is the bug he saw.
- THE COMPANY'S ROUNDS WERE NEVER SPENT: the stall sells six rounds for a battery into bohemia.supplies.v1 'rounds' (and the origins
  and the spoils add to it), and nothing ever took one out.

## THE FACTS IT IS BUILT ON (Battle Brothers first, the library's own pages)
- A quiver of arrows or of bolts: 'ammo=For 10 uses' (bb_all/1616, 1617); a large quiver 14 (1141, 1142); a large powder bag 7 (1140).
- 'Arrow and bolt quivers, powder bags and bundles of throwing weapons are automatically refilled after battle' from the company's
  ammunition, a bundle 50 points, a bolt 1 a shot, a handgonne 2 (bb_all/0055_Ammunition, records/target/bb/stash_rates.json).
- An unarmed man's blow: Hand-to-Hand Attack, 5 to 10 damage, 4 AP (bb_all/0933, records/target/bb/beast_attacks.json).
- A weapon swap: 4 AP, Quick Hands the first one a turn free (records/target/bb/rules.json ap.swap_item).
- Their side: Battle Brothers gives its enemies endless quivers (ECONOMY's research, handoffs/ECONOMY_ARCHIVE.md).

## WHAT SHIPPED
- THE NUMBERS (records/target/bb/ours.json 'gun_rounds', draft, TUNING may move them): a pistol (the 'dagger' rows it rides) and a
  rifle or crossbow ('crossbow') carry 10, a quiver's (a load in the gun and the spare); a shotgun ('firearm', the handgonne's) 7, the
  large powder bag's. A bow stays rounds-free (the stall's own words). One round of the company's a shot.
- THE FIGHT (slices/BOHEMIA_FIGHT.html, __NO_AMMO_NO_SHOT__): each gun of his carries its rounds (u.rounds, and each bag gun's in its
  bag state); each shot spends one (his own shot and his free shot); the magazine and the chamber load only from what he carries, so a
  reload never makes rounds; AT NONE THE GUN CANNOT FIRE OR RELOAD, by hand or on AUTO (canStrike, strikeWhy 'ammo', the free shot,
  the brain's counts and every stand-in kit it plans with): it goes on its sling and his FISTS come up (free; his job and perks stay),
  a flash on him (the fight's pop; its words to the kept feed, never on the glass, rule 67); from his fists AUTO weighs the swap to what rides in his bag like any swap (rule 394) at 4 AP, the slung gun
  going into that bag slot. AN EMPTY HAND IS HIS FISTS, never his place's gun; a gun in his bag fires only after a swap brought it out.
  What the end hands home: the slung gun still counts as the gun in his hand ('held.main').
- WHEN THE FIGHT ENDS (settleRounds, once, at the end card): what each gun of his has left is kept by his name (localStorage
  bohemia.rounds.v1, main first, then the bag); then they fill from the company's rounds, his men in their order, one round a shot, as
  far as the stock goes; an empty stock leaves them as they were; the dead keep nothing. The home message carries it ('rounds': spent,
  filled, short, the stock before and after, each man's guns).
- A NEW GAME FORGETS IT: bohemia.rounds.v1 joins the start screen's list of the old company's keys (slices/BOHEMIA_ALPHA_0_9.html).
- THEIR SIDE IS AS IT WAS: no count on their guns.

## THE GATE (gates/no_ammo_no_shot_gate.js, NO AMMO, NO SHOT in the suite)
N1 EVERY SHOT SPENDS ONE AND AT NONE NOTHING FIRES: 16 fights on AUTO with his gunmen walking in low (a pistol 3, a rifle 2, a shotgun 1), 153
shots of his; fired with no round left 0; a gun past what it walked in with 0; 46 guns run dry, then 94 blows with his fists and 41 swaps.
N2 ONLY THE WEAPON IN HIS HANDS FIRES: the empty-handed man (a pistol in his bag) starts with his fists in 16 of 16 fights; a shot from a gun not
in his hands 0. N3 a magazine of 5 with 2 rounds left reloads to 2, with none never. N4 a stock of 4 filled 4 of the 20 his guns lacked and was 0
after; an empty stock filled 0 and kept every gun as it was; the dead keep nothing. N5 their side carries no count. Plants: the round not spent
(caught), the empty hand handed his place's gun (caught). 7 passed, 0 failed.
THE FIGHT'S OTHER GATES (the 55 that play its rules headless, run on this change and on main): every red is red on main on the same legs, but
one: THE RELOAD IS LOUD's dry-tap leg fired the pistol ten times and expected an empty magazine; ten shots now spend all ten rounds and sling it, so
the leg gives him more rounds to carry (17/0). Three were red only under load and pass alone (YOU SEE THEM RUN 7/0, THE FIGHT HOLDS THE WHOLE GRID,
THE REBUILT FIGHT PLAYS at main's own 140/15, its night at 55 frames a second). THE BIG INSIDES 783/0 (AUTO there spends rounds now too).

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js, C3_ROUNDS walks his gunmen in low, C3_STOCK sets the company's rounds)
Four real fights through the map's own door (district suburb), the demo upright, the alpha on its side, the demo on its side, the alpha
upright; his three gunmen (YOU and DESI with pistols, RAUL with a rifle) walked in with 2 rounds a gun and the company's rounds set to 6. Every
time: every gun fired exactly 2, never a third; no shot at none, none past what it walked in with, none from a bag before a swap; each ran dry
and fought on with his fists (13 to 23 blows each, the two later runs counted); at the end 6 spent, 6 filled, the company's rounds 6 to 0 (the
store said 0, the end screen's bar said 0), kept for YOU, DESI and RAUL. 0 page errors. Run two at a time.

## SAID PLAINLY
VOTE card combat4-no-ammo-no-shot-11-22: a real fight where his gunmen walked in with two rounds each: the guns going quiet after their
last round, their fists or a swap after, and the company's rounds filling them when it ends. The feed's words ('out of rounds') and 'Fists' are draft; nothing is written on the glass.

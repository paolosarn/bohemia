# FIGHT SCREEN THREE: THE ROUNDS ON THE CARD -- 11/22/26
BUILD 11/22zv - THE ROUNDS ON THE CARD. VAMILY rule 478(a), this lane's half: 'every gun carries its own rounds,
shown on the man's card' (owner COMBAT FOUR for the fight, ECONOMY THREE for the stock, FIGHT SCREEN 3 for the rounds on the card). Rules 449(b),
450(a), 441. No line of anybody's rewritten (454(a), 465); the card's words are a label for a reader, draft:true.
PAOLO 11/22: 'how does the ammo work though, sometimes in auto combat one of my guys has a pistol in his pocket inventory and he's still shooting
even though there's no ammo... did you not make sure that when the ammo says zero you can't even shoot anymore?'

## WHAT WAS THERE (measured on the demo before touching anything)
The fight keeps a count per gun in his hands: FIGHT.rounds(man) = what is left of what it holds (a pistol's magazine, a one-shot gun's one, a
bundle's throws). It was shown in three places: the mark over the man on the board (roundsMark, red and scanlined when dry), the aim line while
he aims (roundsLine: 'Last round.'), and his sheet ('Rounds left' pips). NOT on the phone's card: the card he looks at every turn, and the only
one on the glass while AUTO plays, showed his blood, armour, wind and AP, and nothing of his gun. With AUTO on, a dry gun was invisible.

## WHAT CHANGED: THE ROUNDS ON THE CARD
- slices/BOHEMIA_FIGHT.html __THE_ROUNDS_ON_THE_CARD__ (hud()): the man on the card's rounds, FIGHT.rounds as it stands, written on the AP row
  (data-rounds 'left/of', data-dry at none). The count itself is COMBAT FOUR's; the card reads it, never a second one.
- slices/bohemia_phone.js __THE_ROUNDS_ON_THE_CARD__ (P.man and manPaint, marked lines and a marked block; the card is this lane's by rule
  449(b)): at the end of his AP row, after a thin rule, a cartridge stood on end for every round his gun holds (eight at most; a magazine past
  eight lights its share): brass with a bright tip for each one in the gun, a dark empty case for each one spent, the last one hot; at none every
  case goes red and pulses on the fight's beat (the phone's own beat, the same pulse as the board's dry mark). A man of theirs with a gun shows
  his after his plate. A man with no gun in his hands shows none. No digit is added (rule 224, pictures not numbers); the words for a reader
  are the label ('5 of 5 rounds', 'no rounds left: his gun is empty').

## ON THE PAGE (rule 441)
RESULT: the demo upright and the alpha on its side, a held job's crew met through the map's own card, ENGAGE by a finger: YOU with his pistol on
the card, 5 brass of 5 inside the card; one spent, 4 lit and one dark case; none left, five red cases pulsing on the beat (read across a beat:
dark red and hot red both seen); a THUG with a Bludgeon, no cartridges; a MARKSMAN of theirs, his one-shot gun empty, one red case after
'LV 5' and his marks. 0 page errors. Picture: records/target/FIGHT_SCREEN_THE_ROUNDS_ON_THE_CARD_11_22.webp (before and now: full, empty, a
marksman of theirs; on its side full and empty).

## GATES
THE MAN'S CARD ON THE PHONE 13/0 (was 11/0): P9 THE ROUNDS ON THE CARD (new leg: the cartridges against the fight's own count, full, one spent,
dry and pulsing, none for a man with no gun, theirs after his plate, all inside the card) and its plant (ROUNDS_PLANT: the drawing taken out,
P9 red). P1 (the phone never grows) and P3 (no digit for his man) hold with the rounds on.
FOUND ON THE WAY: the tool's 'his card' read waited 60 s for his turn; two browsers at once, a MARKSMAN's turn outlasted it and the card read
was theirs (P3, P4 red, no page error). The tool now puts his man on the card the way a finger does when the turn does not come (the same door
the plates use) and says where the fight stood (T.hisAt).
[bb Battle Brothers puts a ranged man's ammo on his own bar, a count beside his action points; ours stands the rounds on end beside his AP]
[analog horror: an empty gun is a row of red cases breathing on the beat, and nothing says it out loud]

# PAOLO 10/26: STRUCK DOWN, HE STILL FIGHTS, AND HIS FACE SHOWS IT (LOCKED, rule 234; amends the 9/27 law s2 and rule 226)

## HIS WORDS (verbatim, voice to text, two messages)
"OK, so another big thing I wanna see happen is that when people like if they if they if they fail in combat, but they survived
to still be in my crew bro like their health will just like be at one and then when you heal them they'll still go back up.
They're still active. I don't know why you have it so like they can't participate in combat anymore that that's why restarted
Hella runs too so yeah people aren't gonna like that so they do have The that don't you mentioned the deep buff that they have
an absolutely like I think they should. They should just have that deep buffing but also super important you know let some let's
get creative with how it's gonna affect their portrait. You know to be able to visually tell that like either like a iPad or a
serious brain shit or like blood somewhere like a Band-Aid there like the ear cut off there like the nose and shit like type shit
so yeah let's it's gonna have to get creative with the portrait shit too so yeah keep that in mind, but they should still be able
to be in combat like it's gonna be part of the healing armor system type shit after fights like the remaining HP of your group
and their armor points. You know it'll display like a total combined type shit so"
"So like, yeah for example I'm gonna have to restart a run and I didn't even like make it past the first day you know so type
shit"
('deep buff' is 'debuff'; 'iPad' is 'eye patch'.)

## WHERE THE BENCH CAME FROM, HONESTLY
The 9/27 law (laws/BOHEMIA_LAW_THE_FIGHT_GETS_DEEP_TUNING_AND_MODS_9_27_26.md s2) wrote 'a DEBILITATING INJURY that takes them out
of fights for 30 to 40 game days'. 'Takes them out of fights' was the coordinator's reading of his 'a debilitating injury'. It
went into records/target/bb/ours.json (struck_down_laid_up_days [30, 40], in a 'quote' field as if he said it), into
engine/bohemia_long_injury.js (PEOPLE 10/9) and into the demo's after-the-fight code (a struck-down man is 'gone' from the next
fight until his days pass). With damage that stays (rule 226, 72835dfb), one bad first fight now benches most of a crew for a
month: he restarted runs without getting past the first day.

## HOW BATTLE BROTHERS DOES IT (rule 33; injuries.json in records/target/bb where it has it, else recall, marked)
A brother struck down who survives gets a PERMANENT injury (the wiki copy's 11 'permanent' rows: Brain Damage, Broken Elbow Joint,
Broken Knee, Partly Collapsed Lung, Maimed Foot, Missing Ear, Missing Eye, Missing Finger, Missing Nose, Traumatized, Weakened
Heart), each a stat penalty for life. Temporary injuries from hits (a broken arm, a cut, a bruise) are debuffs that heal over days
and faster with the Retinue and the temple. An injured brother is NEVER barred from a fight: the player decides who goes in. Some
permanent injuries show on the brother's head (recall: a missing ear, a missing nose, a missing eye, a scar).

## THE RULING (rule 234)
(a) STRUCK DOWN AND ALIVE, HE IS STILL IN THE FIGHTS: he wakes at 1 HIT POINT, in the crew, ACTIVE: he can be picked for the next
    fight like any man. Nothing benches him. The camp heals him back up at the table's rates (rule 226(b)); the HEAL bar shows his
    missing hitpoints in the company's total (226(c)).
(b) THE DEBUFF STAYS, NOT THE BENCH: he carries the injury as a debuff (Battle Brothers' penalty for that injury, from the wiki
    copy, through TUNING's one table): the permanent mark for life, and the fresh-wound part for the 30 to 40 days (the days now
    measure the debuff, never time out of fights). ours.json's struck_down_laid_up_days loses its false 'quote' and becomes the
    debuff's days.
(c) HIS FACE SHOWS IT (his words, 'get creative'): every injury has a mark on his portrait and its thumb, matched to the injury: a
    lost eye an EYE PATCH; brain damage stitches and a shaved patch, or a bandage round the head; a lost ear the ear cut off; a lost
    nose the nose gone; a fresh wound blood and a band-aid that come off as it heals; a broken arm a sling; and the rest PORTRAIT
    invents in the same spirit. The mark reads at the thumb's size. In analog horror (rule ANALOG HORROR), never cartoon gore.
(d) THE WORDS AND ICONS: the crew card shows the injury as an icon and its penalty as an icon with a red down arrow by how much
    (rule 224); the line under it says what happened in a word.
(e) AUTO plays a hurt man sensibly (COMBAT TWO): a man under a third of his hitpoints stands behind the shield men (rule 230) unless
    the fight needs him.
(f) No run is over on its first day because the crew is benched. Rule 208(a)'s 'laid up' reads 'struck down' from here.
(g) THE GATE: in rolled fights a struck-down survivor is in the crew at 1 hit point and can be put on the next fight's board; the
    camp raises him at the table's rate; his debuff is on him for its days and his mark for life; his portrait and thumb show the
    mark; the demo's after-the-fight code holds nobody out for injury days.
(h) Rows: CAMP [struck down, he still fights] FIRST (the bench off, 1 hit point, the heal), with TUNING's numbers; PORTRAIT [the
    face shows the wound] (lifted from the 10/19 pause for this, rule 225); NOTEs COMBAT TWO (e), UI (d), TUNING (b), PEOPLE (the
    long injury module); line 156 on his list; EYES checks.

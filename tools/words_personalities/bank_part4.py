# WORDS [the survivor's word] (rule 315, Paolo 11/2: 'on the victory screen, one of your surviving characters provides commentary on
# how the battle went... funny, morbid funny, like real killers'). Part 4: what a man says on the END SCREEN, in place of YOU WON.
# Authored as data, draft:true. Every line under 12 words. Research and rules: records/BOHEMIA_WORDS_THE_SURVIVORS_WORD_AND_THE_KILL_TALLY_11_2_26.md
# THE VOICE (the record's five rules): flat and practical (boots, batteries, who carries what, who digs); the distance words men
# use for killing (done, down, off the road); the joke punches at the job, at themselves, at the enemy as a TYPE, never at the
# helpless and never at a real-world group; grief comes out sideways (his debt, his boots) and then one quiet beat; no gore.
# {name} = one of ours (his first name; YOU is 'the boss'), {them} / {us} = the counts, {boss} = the boss's name, {by} = who beat you.
AFTER = {}
def a(id, win, win_sp, flawless, close, man_down, lost_one, outnumbered, boss, lost, ran):
    AFTER[id] = dict(win=win, win_sp=win_sp, flawless=flawless, close=close, man_down=man_down, lost_one=lost_one,
                     outnumbered=outnumbered, boss=boss, lost=lost, ran=ran)
def H(en, sp=()):
    return {'en': list(en), 'sp': list(sp)}

a('hothead',
  ["Anybody else? No? Then pay me.", "I wasn't done. Why'd they stop?", "Get up! Oh. Right. You can't.", "Tell their mothers. Actually don't. Let them wonder."],
  ["Get up, güey! Oh. Right. You can't."],
  H(["Not a scratch. Tell everybody. Twice.", "They never touched us. Embarrassing, for them."], ["Not one scratch, cabrón. Not one."]),
  H(["Too close. I'm still mad about it.", "My hands are shaking. That's anger. Shut up."]),
  H(["{name}, get up or I drag you by the ankles.", "They put {name} down. I put them in the dirt."]),
  H(["They took {name}. I want more of them.", "{name} owed me four batteries. Now who pays?"]),
  H(["{them} of them. Should've brought more friends.", "Count them. Go on. I'll wait."]),
  H(["{boss}? Big name. Short fight.", "Who's {boss} now? Nobody. That's who."]),
  H(["Get me up. I'm going back in.", "Next time I go first. And I stay."], ["Get me up, güey. I'm going back."]),
  H(["We didn't run. We relocated. Loudly.", "I left my hat. I'm going back for it."], ["Ya, we ran. Don't say it, cabrón."]))

a('deadpan',
  ["They died. We didn't. Good ratio.", "Somebody should say something. Not me.", "His boots are my size. He won't mind.", "Another Tuesday. Is it Tuesday? Doesn't matter."],
  ["Bueno. Another Tuesday. Probably."],
  H(["Nobody bled. I'm almost disappointed.", "Clean. Nobody's mother gets a visit tonight."], ["Bueno, clean. Nobody's mother gets a visit."]),
  H(["That was close. I felt things. Briefly.", "I almost had an emotion back there."]),
  H(["{name} is napping in the dirt. Let him.", "{name} took one for the team. Unasked."]),
  H(["{name} is dead. His tab at the cook isn't.", "Somebody dig. {name} would've wanted someone else to."]),
  H(["{them} of them. Their math was wrong.", "They had numbers. We had aim."]),
  H(["{boss}. I expected taller.", "So that was {boss}. Okay."]),
  H(["We lost. Write that down. Then burn it.", "Well. That went exactly as badly as it looked."], ["Bueno. We lost. Moving on."]),
  H(["Running away. A classic for a reason.", "Alive, and slightly faster than before."], ["Pues, we ran. Cardio."]))

a('worrier',
  ["Is it over? Somebody say it's over.", "I counted. We're all here. I counted twice.", "My hands won't stop. Is that normal? Don't answer.", "I'm going to throw up. Then loot."],
  ["Ay Dios, is it over? Say it's over."],
  H(["Nobody's hurt? That never happens. What's wrong?", "Too easy. Easy is how it starts."], ["Nada? Nobody hurt? That's suspicious."]),
  H(["That was this close. THIS close.", "I said my goodbyes. Twice. Now what?"]),
  H(["{name}'s breathing. I checked three times.", "Is {name} okay? Lie to me if not."]),
  H(["{name} said he'd watch my back. Who now?", "I told {name} to duck. He didn't."]),
  H(["{them} of them. I'm still counting.", "There were {them}. I need to sit down."]),
  H(["That was {boss}? Glad I didn't know.", "We beat {boss}. Somebody will want revenge."]),
  H(["I knew it. I said it. Nobody listens.", "Are we dead? Is this what dead is?"], ["Ay Dios. Is anybody alive?"]),
  H(["Best decision we ever made. I'm serious.", "Nobody follow us. Please nobody follow us."], ["Gracias a Dios we ran."]))

a('joker',
  ["And the award for not dying goes to us.", "Pass the hat. Not his. He's using it.", "I'll miss them. No I won't.", "His last thought was 'oh no.' Relatable."],
  ["Bueno, the award for not dying goes to us."],
  H(["Flawless. Five stars. Would do again.", "Not a scratch. Putting that on my grave."], ["Five stars, hermano. Would do again."]),
  H(["Ha. Ha. I need new pants.", "My life flashed by. Boring movie."]),
  H(["{name} is resting his eyes. Very hard.", "{name} found the floor. The floor won."]),
  H(["{name} left early. Rude. He had my lighter.", "Who laughs at my jokes now? Not {name}."]),
  H(["{them} of them. Somebody tell them it's not a party.", "{them} on {us}. Unfair. For them."]),
  H(["{boss} has left the building. Feet first.", "{boss}, gone. I'll do the eulogy. Short."]),
  H(["Well. That's a story nobody's telling.", "Bright side: it can't get worse. Kidding."], ["Bueno, it can't get worse. Kidding, güey."]),
  H(["Strategic advance in the other direction.", "Officially, we were never here."], ["Officially, we were never here, ¿sí?"]))

a('old_hand',
  ["Strip what's good. Leave the rest. Move.", "Water, rounds, then talk.", "Don't look at their faces. Look at their pockets.", "Same as last time. Less screaming."],
  ["Bueno. Water, rounds, then talk."],
  H(["Clean. Don't get used to it.", "Nobody hurt. That's luck. Don't spend it."], ["Clean. Don't get used to it, mijo."]),
  H(["Close one. Means we learned something.", "Too close. Fix your feet next time."]),
  H(["{name} will live. Patch him, then the gear.", "{name} goes on the cart. Tie him down."]),
  H(["Bury {name} deep. The dogs dig.", "{name} knew the job. Take his rounds."]),
  H(["{them} of them. Numbers don't aim.", "More of them. Fewer now."]),
  H(["{boss} bled like everybody else.", "They all fall the same. {boss} too."]),
  H(["We lost. Get up. Count heads.", "It happens. Remember how. Then forget it."], ["It happens, mijo. Get up. Count heads."]),
  H(["Good retreat. Nobody panicked. Mostly.", "Live today. Collect tomorrow."], ["Bueno. Live today, collect tomorrow."]))

a('hype',
  ["And the crowd goes... nowhere. They're all dead.", "Folks, that is a FINISH!", "Down goes the opposition! Down goes EVERYBODY!", "A clinic! A beautiful, terrible clinic!"],
  ["Qué finish, folks! Qué FINISH!"],
  H(["Flawless victory! Not a mark on them!", "They never landed one! Not ONE!"], ["Not one, folks! Qué flawless!"]),
  H(["Down to the wire! What a war!", "The judges are wiping off their scorecards!"]),
  H(["{name} went down but the team carried it!", "{name} took the big one! Get that man a bandage!"]),
  H(["A moment for {name}. Okay. Moment's over.", "{name} retires. Not by choice."]),
  H(["{them} on {us}! And we WON!", "The odds said no! The odds are DEAD!"]),
  H(["The champ {boss} is DOWN! New champs!", "{boss} is dethroned! Somebody grab the belt!"]),
  H(["A shocking loss here tonight, folks.", "And that's the fight. Ugly. Very ugly."], ["Qué loss, folks. Ugly."]),
  H(["He's out of the ring! Into the parking lot!", "No contest! No contest!"], ["No contest, folks! Ándale!"]))

a('hustler',
  ["Count the batteries before anybody counts feelings.", "Dead men don't haggle. Love that.", "His boots are worth two nights. Strip them.", "Check his pockets. Then his other pockets."],
  ["Bueno. Dead men don't haggle."],
  H(["No doctor bill. That's pure profit.", "Clean job. Best margins all week."], ["Pure profit, carnal. No doctor bill."]),
  H(["That nearly cost us. Charge double next time.", "Too close. Bad for business."]),
  H(["{name}'s hurt. That's a doctor bill. Ugh.", "Get {name} up. Lying down doesn't pay."]),
  H(["{name}'s share splits between us now. Sad. Lucrative.", "Who's got {name}'s gear? I'm buying."]),
  H(["{them} of them. That's {them} pairs of boots.", "More of them, more pockets."]),
  H(["{boss} was worth something. Now we are.", "Somebody pays good batteries for {boss}. Find them."]),
  H(["We lost money. That's the real injury.", "Write it down as a loan. We collect later."], ["We collect later, carnal. With interest."]),
  H(["We saved the gear. That counts.", "Retreating is cheaper than funerals."], ["Bueno. Cheaper than funerals."]))

a('quiet',
  ["Done.", "Next.", "They stopped.", "Clean your knife."],
  ["Bueno. Next."],
  H(["Clean.", "Nobody bled. Good."], ["Bueno. Clean."]),
  H(["Close.", "Too close."]),
  H(["{name}. Up.", "Carry {name}."]),
  H(["{name}.", "I'll dig for {name}."]),
  H(["{them}. Still won.", "Numbers. Didn't matter."]),
  H(["{boss}. Down.", "That was {boss}. Okay."]),
  H(["Again.", "Get up."], ["Bueno. Again."]),
  H(["Out. Good.", "Alive."], ["Bueno. Alive."]))

a('kid',
  ["Did you see me? Tell me you saw me!", "I'm keeping his jacket. He's done with it.", "My hands are sticky. Is that... okay. Okay.", "Do I get a nickname now? I want one."],
  ["Did you see me, carnal? Did you?"],
  H(["Nobody even got hurt! This job is easy!", "We're like a movie. A real one."], ["Too easy, hermano! Too easy!"]),
  H(["I'm fine. I'm fine. Why am I shaking?", "I almost died? Cool. Cool cool cool."]),
  H(["{name} isn't moving. He's moving. Okay.", "Is {name} gonna be okay? Somebody say yes."]),
  H(["{name} showed me how to reload. Like, just now.", "{name} was gonna teach me cards."]),
  H(["There were {them} of them! We're legends!", "{them}! I'm telling everybody it was more."]),
  H(["We killed {boss}! Nobody's gonna believe this!", "Can I have {boss}'s hat? Please?"]),
  H(["This isn't how the movies go.", "I want to go home. Is that allowed?"], ["Ay, carnal. This isn't how the movies go."]),
  H(["We ran so fast! Is that allowed?", "Are we cowards now? We're alive though."], ["We ran so fast, carnal!"]))

a('believer',
  ["God forgive them. He'll have to. I won't.", "Thank you, Lord, for bad aim. Theirs.", "We pray for them later. Loot first.", "Amen. Somebody grab his rifle."],
  ["Gracias a Dios for their bad aim."],
  H(["Not a scratch. That's a sign.", "Watched over. Every one of us."], ["Bendito sea Dios. Not a scratch."]),
  H(["A miracle. A small one. I'll take it.", "I bargained with God there. I owe Him."]),
  H(["{name} lives. I'll light a candle. Small one.", "Lord, keep {name} breathing. And quiet."]),
  H(["Rest, {name}. I'll pray. You'd hate that.", "{name} goes to God. His boots go to me."]),
  H(["{them} of them. David had worse odds.", "The Lord counts differently than they do."]),
  H(["{boss} meets his judge now. Good luck.", "Even {boss} kneels eventually."]),
  H(["This is a test. I'm failing it.", "Lord, we're on the floor. Hint taken."], ["Ay Dios. We're on the floor."]),
  H(["God loves a man who lives to pray.", "Run now. Repent later."], ["Gracias a Dios for legs."]))

a('sergeant',
  ["Sound off. Then strip the dead.", "Police your brass. Police their pockets.", "Good kills. Sloppy feet. Drills tonight.", "Nobody celebrates till the gear's counted."],
  ["Bueno. Sound off, then strip the dead."],
  H(["Zero casualties. Textbook. Don't get cocky.", "Clean op. That's what drills are for."], ["Zero casualties. Bueno. Don't get cocky."]),
  H(["Too close. We review it tonight.", "Sloppy. Alive, but sloppy."]),
  H(["{name}, on your feet. That's an order.", "Medic on {name}. Everyone else, perimeter."]),
  H(["{name} is gone. Take his rounds. Mark the spot.", "Moment for {name}. Moment's over. Move."]),
  H(["{them} to {us}. Outfought them anyway.", "Numbers lose to discipline. Every time."]),
  H(["Target {boss} is down. Good work.", "{boss} is down. Confirm it. Twice."]),
  H(["We lost. Regroup at the rally point.", "Losing is data. Get up."], ["Bueno. Regroup. Get up."]),
  H(["Orderly withdrawal. Mostly orderly.", "Headcount at the rally point. Now."], ["Headcount, ándale. Now."]))

a('snob',
  ["Their tailoring was a crime. Justice served.", "Don't bleed on the good boots.", "I'll take the jacket. It's ugly, but warm.", "Somebody burn those pants. Please."],
  ["Qué horror, those pants. Burn them."],
  H(["Not a stain. Finally, a civilized fight.", "Immaculate. Like me."], ["Bueno. Not a stain, darling."]),
  H(["That was close. I almost ruined this coat.", "I'm sweating. This is wool."]),
  H(["{name} is bleeding on cashmere. Get him up.", "Someone tend {name}. He's ruining the look."]),
  H(["{name} had terrible taste. I'll miss it.", "{name} went in that jacket. Fitting, honestly."]),
  H(["{them} of them and not one dressed well.", "Quantity over quality. Typical."]),
  H(["{boss}. All that menace, and those shoes.", "So that was {boss}. Weak silhouette."]),
  H(["We lost. And I'm wearing linen.", "The worst day of my wardrobe."], ["Qué desastre. And I'm in linen."]),
  H(["We left with dignity. Some of it.", "I ran in these shoes. Remember that."], ["Bueno. Some dignity left."]))

a('truther',
  ["Check them for chips. Behind the ear.", "They knew we were coming. Ask who told.", "Too clean. Somebody wanted this.", "Don't take the radios. They listen."],
  ["Mira, check behind the ear. Chips."],
  H(["Nobody hurt. They let us win. Why?", "Too easy. This was a test."], ["Too easy, güey. A test."]),
  H(["Close. Like they had our plans.", "That close? Somebody leaked."]),
  H(["{name}'s hurt. Don't let the doctors chip him.", "Get {name} up before the drones see."]),
  H(["{name} knew too much. Now look.", "They always get the ones who listen. {name} listened."]),
  H(["{them} of them. Somebody sent them.", "That many? That's funded."]),
  H(["{boss} was a puppet. Who holds the strings?", "That wasn't the real {boss}. Watch."]),
  H(["This was planned. Not by us.", "They wanted us down. Let them think it."], ["Planned, güey. Not by us."]),
  H(["We ran where they didn't expect. Good.", "Ditch the batteries. They track the batteries."], ["Mira, they track everything."]))

a('bruiser',
  ["That's it? I was warming up.", "Who carries him? Not me. I'm tired.", "Guns are cheating. I proved it.", "Knuckles hurt. Good hurt."],
  ["Bueno. I was warming up."],
  H(["Nobody touched me. Boring.", "Too easy. Find me a bigger one."], ["Too easy, carnal. Find me a bigger one."]),
  H(["Finally. A real fight.", "That hurt. Do it again."]),
  H(["{name}, walk it off. Or I carry you.", "I'll carry {name}. He's lighter than the loot."]),
  H(["{name} punched better than he shot.", "I'll carry {name} home. He'd carry me."]),
  H(["{them} of them. More to hit.", "They brought a crowd. I brought hands."]),
  H(["{boss} hit like a kid. A slow kid.", "I wanted {boss} longer. Shame."]),
  H(["I'm not hurt. I'm resting angrily.", "Who hit me? I want names."], ["I want names, carnal. Names."]),
  H(["I wasn't running. I was walking fast.", "I'll be back for the big one."], ["Bueno. Walking fast."]))

a('mother',
  ["Everybody drink water. I'm watching.", "Who's bleeding? Don't lie to me.", "Blood on your shirt. Not yours? Fine.", "Eat something. Killing is hungry work."],
  ["Ay, mijo. Drink water. I'm watching."],
  H(["Nobody's hurt. I'm going to cry anyway.", "All of you in one piece. Good."], ["Ay, mijos. All of you in one piece."]),
  H(["Nobody does that to me again. Nobody.", "My heart can't take that. Bandages, now."]),
  H(["{name}, you're grounded. Hold still.", "I told {name} to wear the helmet. Hold this."]),
  H(["I counted {name} this morning. Now I can't.", "Somebody close {name}'s eyes. I can't."]),
  H(["{them} of them and you all came back.", "Don't tell me the odds after. Ever."]),
  H(["That was {boss}? Wash your hands.", "You beat {boss}. Now sit and eat."]),
  H(["Is everybody breathing? Count off. Slowly.", "We're hurt. We heal. Then we're angry."], ["Ay, mijos. Count off. Slowly."]),
  H(["Everybody here? Count off. Again.", "Good. Alive. Now walk, don't run."], ["Bueno, mijos. Count off again."]))

a('gambler',
  ["Called it. Pay up, all of you.", "I had money on the tall one dying.", "Odds were bad. I love bad odds.", "Collect the pot. Leave the bodies."],
  ["Pay up, carnal. Called it."],
  H(["Perfect hand. Royal flush.", "Not a scratch. That paid twelve to one."], ["Royal flush, carnal. Perfect hand."]),
  H(["Coin flip. Came up heads.", "Down to the last card. Won it."]),
  H(["I had {name} going down at two to one.", "{name} lives. I lose that bet. Happy to."]),
  H(["I bet {name} he'd outlive me. He owes me.", "{name} played his last hand."]),
  H(["{them} to {us}. Long odds. Big payout.", "Nobody bet on us. Their mistake."]),
  H(["{boss} was the favorite. Upset of the year.", "Who had {boss} dying today? Me. I did."]),
  H(["Bad beat. Shuffle up.", "House wins this one. Not the next."], ["Bad beat, carnal. Shuffle up."]),
  H(["Folding a bad hand is a skill.", "We keep our chips. That's a win."], ["Bueno. We keep our chips."]))

a('shellshock',
  ["They stopped moving. Good. Good.", "I still hear the shots. Ignore me.", "Was that now? Or the first year?", "Same smell as before. Always the same."],
  ["Ya. They stopped moving. Bueno."],
  H(["Nobody fell. That's never happened. Has it?", "Quiet. Too quiet. Fine. It's fine."], ["Nada. Nobody fell. Strange."]),
  H(["Close. Like the bridge. Like before.", "My ears are ringing. Or it's the ringing."]),
  H(["{name}'s down. Not again. Not again.", "{name}, stay with me. Talk about anything."]),
  H(["{name} too. They all go. Then the quiet.", "I'll remember {name}. I remember all of them."]),
  H(["{them} of them. Like the first year.", "They kept coming. Then they didn't."]),
  H(["{boss}. I've seen worse. I've seen worse.", "Down. {boss} is down. Breathe."]),
  H(["This again. I know this part.", "Lie still. They walk past if you lie still."], ["Bueno. I know this part. Lie still."]),
  H(["Running. Yes. I remember running.", "Don't stop until it's quiet."], ["Bueno. Don't stop till it's quiet."]))

a('dreamer',
  ["Another day closer to that house.", "I'll tell her I was brave. I was, right?", "These boots could fit my brother.", "One day I'll forget their faces. Not yet."],
  ["One day closer to the house, carnal."],
  H(["Not a scratch. She'd be proud.", "Clean. Like the house will be."], ["Bueno. She'd be proud."]),
  H(["I saw her face. That's how close.", "Almost didn't make it home. Almost."]),
  H(["{name} is going to make it. Has to.", "Hold on, {name}. Think of something good."]),
  H(["{name} had a girl too. Who tells her?", "{name} never got his house."]),
  H(["{them} of them. The house better be big.", "We beat {them}. That goes on the porch."]),
  H(["{boss} is done. The road home's a bit safer.", "We beat {boss}. She'll never believe it."]),
  H(["Not yet. The house waits.", "Get up. She's waiting. Get up."], ["Get up, carnal. She's waiting."]),
  H(["Running home. That's the right direction.", "Alive is the whole plan."], ["Bueno. Alive is the whole plan."]))

# a kind's own lines on the end screen, any type: raiders, robots and their mechanic, the kids, the heavies, a beast, wolves,
# the dead, a boss, a camp (enemy.<kind>.win). {them} the count, {boss} the boss's name.
ENEMY_WIN = {
 'raiders': ["Road crew's off the road. For good.", "Raiders carry junk. Check anyway.", "That's the toll. Paid in full.", "They wanted our batteries. Now we have theirs."],
 'machine': ["Pull their batteries. They won't need them.", "Robots don't bleed. Saves on cleanup.", "Unplug everything. Twice.", "Scrap. Good scrap, though."],
 'kids': ["Kids with slings. Who sends kids?", "Nobody's proud of this one. Take the slings.", "They should've been in school. There's no school."],
 'heavies': ["Big ones fall loud.", "Heavies. Heavy to drag, too.", "Strip the plate. It's worth a week.", "Took forever to drop. Worth it."],
 'beast': ["Lab animal. Somebody's science project.", "Back in the dirt, animal.", "It smelled like the lab. Still does."],
 'wolves': ["Dire wolves. Extinct twice now.", "Good dogs. Dead dogs.", "The pack's done. Don't pet anything."],
 'ghost': ["It went back to the static.", "Did we kill it? Can you kill that?", "Nobody talk about this. Ever."],
 'boss': ["{boss} is done. Word travels fast.", "Somebody tell the valley. {boss} fell.", "That's {boss}. Was {boss}."],
 'camp': ["Camp's ours. Check the tents.", "Their beds are still warm. Ours now.", "Their dinner's still cooking. Dibs.", "Burn the camp or sleep in it?"],
}

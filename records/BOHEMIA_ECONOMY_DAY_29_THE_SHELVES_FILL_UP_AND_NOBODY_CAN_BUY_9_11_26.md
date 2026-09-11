# ECONOMY ROUND 29 -- Q29 [nothing left]
# THE DAY AFTER THE MONEY DIES, THE SHELVES FILL UP AND NOBODY CAN BUY ANYTHING.
# And the way out of it is already written in our code and has never been called.

MODE: RESEARCH. NOTHING WAS IMPLEMENTED. This file and the bank lines are the
whole deliverable. Every finding becomes a WORLD or LIFE + CITY job later, and
only the coordinator puts it on the board.

THE ROW, VERBATIM:
  Q29 What people do when the last of a currency runs out for good, and the day
  after: real endgames of commodity money (the last coins, the last cigarettes,
  the last cells) and what replaced them, so the valley has a rule for the day
  the batteries are gone. Deliver the rule.

Round 25 [batteries scarce] did the DROUGHT. This one does the END.

---------------------------------------------------------------------------
## 1. WHAT I MEASURED IN OUR OWN CODE FIRST
---------------------------------------------------------------------------

**A CORRECTION I AM CARRYING RATHER THAN HIDING.** My first probe emptied the
whole purse and reported that every verb in the game refuses. That conflated
"the batteries are gone" with "you have nothing at all", which is a different
question and a worse one. I ran it again properly: resources full, clout full,
electricity at zero. The real picture is sharper.

**THE DAY THE BATTERIES ARE GONE, WITH A FULL LARDER AND FULL STANDING:**

    day:ate      (resources)    WORKS
    fight:plate  (resources)    WORKS
    ask:leaned   (clout)        WORKS
    night:power  (electricity)  REFUSED   INSUFFICIENT

    goods you can buy: 0 of 11. THE WHOLE SHELF IS SHUT.

So life goes on and TRADE STOPS. You can eat, you can fight, you can lean on
somebody. You cannot hold a light and you cannot buy one single thing. That is
round 25's finding arriving at its end state: a money drought is not a hard mode,
it is an off switch, and here is the switch in the off position.

**THERE IS NO OVERDRAFT AND NO DEBT.** A debit against an empty pocket returns
`{applied:false, reason:'INSUFFICIENT', have:0, wanted:1, short:1}` and the
balance stays at zero. The ledger's own audit flags any currency that went
negative in history as a problem. The floor is hard. Nobody can go under.

**AND NOTHING NOTICES.** I swept the purse, the payday module and the feed for
anything that fires when a balance reaches zero. There is no event, no post, no
card line, no beat. THE GAME HANDLES THE DEATH OF ITS OWN CURRENCY BY REFUSING
ELEVEN PURCHASES ONE AT A TIME, SILENTLY. The biggest moment an economic crash
simulator can have is currently eleven identical error strings.

**AND THE WAY BACK IS ALREADY BUILT, ALREADY CORRECT, AND HAS NEVER BEEN CALLED.**

    convert(purse, fromCur, fromAmt, toCur, toAmt, reason, ref, day)

It takes ANY rate the caller names, so it does not presume an exchange rate
nobody ruled. It is ATOMIC: if the second leg fails it pops the first entry back
off, with the comment "a half-applied conversion would mint or burn". I ran it:
one resource in, one battery out, balances correct.

    CALLERS OF convert() IN THE WHOLE GAME: ZERO.

Turning what you have into money is exactly what every community in section 3
did when their money ran out. Ours is written, tested by its own gate, and
unreachable from anywhere a player can stand.

---------------------------------------------------------------------------
## 2. THE FINDING THAT PROVES US WRONG
---------------------------------------------------------------------------

The instinct behind "and the day after", mine included, is that the pressure
lifts. The old money dies, a new one arrives, the shops reopen, things get
better.

**THE CLEANEST REAL CASE SAYS THE OPPOSITE, AND IT IS BRUTAL.**

Zimbabwe abandoned the Zimbabwe dollar in 2009, for the US dollar and the South
African rand, after inflation reached 230 million percent. Before that, people
were carrying plastic bags of banknotes to buy bread, with prices moving at least
twice a day. The currency did not limp. It ended.

And the day after, the shelves filled up. Reporting from April 2009 is headlined
almost exactly that: shop shelves fill up but customers stay away. The shops
stocked because the new money was real and worth stocking for.

**ORDINARY PEOPLE STILL COULD NOT FEED THEMSELVES, BECAUSE THEY DID NOT HAVE ANY
OF THE NEW MONEY.**

That is the sentence the whole round turns on. A new currency does not appear in
everybody's pocket at once. IT APPEARS IN SOMEBODY'S FIRST -- whoever was already
holding foreign notes, whoever had family sending money, whoever sold something
to somebody who had it. The shelves coming back is not the recovery. It is the
moment the difference between people becomes visible, because now there is
something on the shelf you can see and cannot have.

FOR US: THE DAY AFTER THE BATTERIES ARE GONE SHOULD LOOK BETTER AND FEEL WORSE.

---------------------------------------------------------------------------
## 3. WHAT ACTUALLY REPLACED THEM, AND THE RULE IT GIVES US
---------------------------------------------------------------------------

The row names the last cigarettes, so here is the cleanest modern case of a
commodity money ending on a known date.

US federal prisons banned smoking in 2004. The cigarette had been the money and
it died almost overnight. **THE ECONOMY DID NOT COLLAPSE. IT AUDITIONED
REPLACEMENTS.** Within a few years three had taken over, with no meeting called
and no announcement made. Stamps were one. The winner in most of the federal
system was a pouch of mackerel.

**AND THE REASON MACKEREL WON IS A DESIGN RULE.** It was worth about a dollar at
the commissary, which made it a clean unit. And NOBODY WANTED TO EAT IT.

    THE MONEY IS THE THING NOBODY WANTS FOR ITSELF.

That is an uncomfortable test for a battery and I am going to say so plainly
rather than route around it, because it is the pressure his own ruling creates
and it is what makes an endgame arrive at all. Everybody wants a battery. The
night eats one per circuit held, by law. So our money is consumed OUT of the
money supply every single night by the exact verb that gives it its value. That
is the salt problem: money you can eat gets eaten. It is not an argument against
BATTERIES ARE THE MONEY, it is the reason [nothing left] is a real question and
not a hypothetical.

**AND THE OTHER ENDING, WHICH IS THE ANTI-GOAL.** Radford's camp did not end in
scarcity. It ended in abundance: at liberation, in his words, every want could be
satisfied without effort, and he drew the conclusion himself -- with infinite
means, economic organisation is redundant. The camp economy stopped because
nothing was scarce any more. That kills an economy just as completely as a
drought does, and it is the failure our game would hit if the valley were ever
made generous.

**WHAT PEOPLE ACTUALLY DID IN BETWEEN: THEY WENT ON THE TAB, AND THE LENDER IS
THE SHOP.**

In Udaipur, more than 60% of people living on under a dollar a day carried a
standing debt. The breakdown is the part to steal:

    37%  from SHOPKEEPERS
    23%  from relatives
    18%  from moneylenders

**THE SHOP IS THE BIGGEST SINGLE SOURCE OF CREDIT FOR POOR PEOPLE. AHEAD OF
FAMILY. AHEAD OF MONEYLENDERS.** And across low and middle income economies,
twice as many adults borrow from informal sources than from a bank.

And barter is not the fallback anybody actually wants. It needs a double
coincidence of wants -- you have the thing I need AND I have the thing you need
-- which is rare, and the time goes into the bartering instead of into the work.
That is the measured ceiling on a barter economy and it is why every one of them
reaches for a replacement money instead of settling.

---------------------------------------------------------------------------
## 4. THE RULE THE ROW ASKED FOR
---------------------------------------------------------------------------

**THE DAY THE LAST BATTERY GOES, THE SHOP DOES NOT SHUT. IT STARTS A TAB.**

That is the rule. Three rungs under it, cheapest first, each landing on something
already built or already found.

  RUNG A -- THE MOMENT HAS TO EXIST AT ALL. Nothing in the game notices zero.
  The last battery leaving the purse is the biggest beat an economic crash
  simulator gets, and today it is eleven identical refusals in a row. One named
  moment, on the reckoning card and in the feed, once. This is the cheapest real
  thing in the round and it needs no ruling: the purse already knows the balance
  and the feed already takes posts.

  RUNG B -- THE TAB. The shop is the lender in the real record by a distance, and
  our shop's only answer to an empty pocket is CANNOT_AFFORD. This is the fifth
  round in a row to walk into the same wall: PURSE.KINDS is
  ["source","drain","convert","transfer"] and there is no OWED. What round 29
  adds is that it is now the ANSWER and not just a gap, with a number behind it.

  RUNG C -- THE AUDITION. When a money ends, people pick a replacement in months,
  by themselves, and they pick the thing nobody wants for itself. convert() does
  the arithmetic already, takes any rate, unwinds cleanly, and has never been
  called. WHAT the valley picks is his ruling. THAT it picks something is the
  mechanism, and the mechanism is done.

**AND THE WARNING THAT GOES WITH ALL THREE: THE NEW MONEY ARRIVES IN SOMEBODY'S
HANDS FIRST.** Whoever holds the replacement on day one is rich and did nothing
to become rich. The shelves fill, and the gap between the people who can reach
them and the people who cannot becomes the only thing anybody can see. That is a
scene, not a bug, and it is the best thing in this round.

---------------------------------------------------------------------------
## 5. ROUTED
---------------------------------------------------------------------------

Nothing here is a job until the coordinator makes it one.

  -> WORLD / LIFE + CITY   RUNG A, the moment. Nothing notices a balance of zero:
                           no event, no post, no card line. The biggest beat in
                           the game is currently eleven error strings.
  -> WORLD                 RUNG C, convert() has zero callers. Turning what you
                           have into money is the historical way out and ours is
                           written, atomic, and unreachable.
  -> WORLD                 the shelf shuts completely: 0 of 11 goods buyable with
                           a full larder and full standing and no batteries.
  -> LIFE + CITY           the day after should look BETTER and feel WORSE. Full
                           shelves, no buyers.
  -> [PENDING Paolo]  (30) WHAT DOES THE VALLEY USE WHEN THE BATTERIES ARE GONE?
                           The mechanism is built and takes any rate. What the
                           thing IS, is his, and the historical test is that it
                           should be something nobody wants for itself.
  -> [PENDING Paolo]  (23, standing, now with evidence) WHEN A MAN CANNOT PAY,
                           DOES THE SHOP TURN HIM AWAY OR LET HIM OWE? Fifth round
                           at this wall, and this round found the number: the shop
                           is the largest single source of credit for poor people,
                           at 37%, ahead of family at 23% and moneylenders at 18%.

---------------------------------------------------------------------------
## 6. WHAT IS NOT HERE, ON PURPOSE
---------------------------------------------------------------------------

I did not pick the replacement currency, did not set an exchange rate, did not
write a card line, and did not decide how big a tab can get. Those are rulings.

I did not re-run round 25's measurements. This round measured the END STATE --
what still works at zero, whether the balance can go under, whether anything
notices, and whether there is a way back -- and nothing here repeats that round.

And I did not treat the mackerel rule as an argument against his battery ruling.
It is the pressure his ruling creates, which is a different thing and the reason
this row exists.

---------------------------------------------------------------------------
## 7. THE GATE NOTE
---------------------------------------------------------------------------

Every gate in this lane's subset went green, and the round found that the game
has no moment for the death of its own currency and that the one function that
would end that death has never been called.

These gates check that a part does what it says. Nothing checks that two parts
agree, that a part keeps working for as long as the game lasts, that it is the
right part to have, or that the parts form a loop that closes. Rounds 16 through
29, same sentence. convert() passes its gate. It has zero callers. A gate asking
"does convert move two currencies atomically" is green; a gate asking "can a
player ever reach this" does not exist.

---------------------------------------------------------------------------
## 8. SOURCES
---------------------------------------------------------------------------

The prison cigarette ban of 2004 and what replaced it:
  https://www.aei.org/carpe-diem/federal-prisonsmackerel-is-the-currency-of-choice/
  https://fee.org/articles/how-a-fish-became-prison-currency/
  https://reason.com/2009/06/16/the-prison-mackerel-economy-co/
Zimbabwe abandoning its dollar in 2009, and the day after:
  https://theconversation.com/zimbabwe-ditches-its-dollar-ending-an-economic-era-43263
  https://www.globalsecurity.org/military/library/news/2009/04/mil-090414-irin02.htm
  https://www.cato.org/sites/cato.org/files/serials/files/cato-journal/2011/5/cj31n2-9.pdf
Radford's camp, and the ending that came from abundance:
  https://en.wikipedia.org/wiki/Richard_A._Radford
  https://syncopate.us/articles/2006/n24a
Informal credit, and who the lender actually is:
  https://bfi.uchicago.edu/wp-content/uploads/2023/03/BFI_RB_Tomy_031023.pdf
  https://www.weforum.org/stories/financial-and-monetary-systems/informal-economies-solutions-recognition/
Barter, the double coincidence of wants, and its ceiling:
  https://courses.lumenlearning.com/wm-macroeconomics/chapter/defining-money-by-its-functions/
  https://www.economicshelp.org/blog/glossary/double-coincidence-wants/

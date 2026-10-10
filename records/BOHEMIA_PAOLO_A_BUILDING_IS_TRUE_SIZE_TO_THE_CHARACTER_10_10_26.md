# PAOLO 10/10 to COOK FOUR: 'you're making houses that are just like two tiles by two tiles at the biggest, are you
# fucking insane... everything that you make that's a building has to be realistic size to the character models that we have'

THE RULING: a building is drawn at the character's own scale. MEASURED: the settlement body (slices/settlement_people,
cast_shortcoat frame 0) paints 100 px in its 112 box = a 1.75 m person = 57 px a metre. So a door is 2.1 m = 120 px,
a storey 3 m = 172 px, a ranch front 11-13 m = 630-740 px, a two-car garage 6 m = 344 px.
HOUSES ONE AND TWO WERE WRONG: 104 and 200 px wide, the size of one pack tile, so a person was as tall as the house.
The fix keeps his pieces at their own pixels (rule 105) and LAYS them side by side the way his pack lays tiles,
never scales one up. tools/bohemia_cook4_house_true_size.py asserts door >= the person and wall >= 1.7 people or refuses.
The sheet (records/target/COOK4_THE_RANCH_TRUE_SIZE.png) stands the character at the door at 1:1.
EVERY BUILDING THIS LANE DRAWS FROM HERE carries the character beside it on its sheet.

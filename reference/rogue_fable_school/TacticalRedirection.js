/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('TacticalRedirection', {
	niceName: 'Tactical Redirection',
	author: 'Random595',
	description: 'Turn enemy strengths into weaknesses. Learn to manipulate foes, turning their own abilities against them to gain the upper hand.',
	lessonList: [

		{
		name: 'Crash Course',
		text: 'A sudden stop is rarely painless.',
		hintText: 'Lunging enemies take damage when they hit a wall. Walk straight in front of them to trigger their ability when the cooldown resets.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'Plunge Into Peril',
		text: 'Some roads are taken only once.',
		hintText: 'Enemies charging into a pit die instantly. Lead them to you, use SP to make them lunge sideways, then align them with the pit for their second lunge.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.removeEnemyAbility(1, 0);
			SchoolLessons.removeEnemyAbility(3, 0);
			SchoolLessons.removeEnemyAbility(4, 0);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 4;
		},
	},
	
	{
		name: 'Collateral Countdown',
		text: 'The hands that summon may also suffer.',
		hintText: 'Use pillars to block ranged attacks and draw enemies into summoned bombs. Hover over bombs to see the impact area.\n\nBe carful, if the bomb blocks the path of the enemy, they will move towards a clear path - avoding the bomb and trapping you.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 20);
			SchoolLessons.removeEnemyAbility(1, 1);

			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'Infernal Oversight',
		text: 'A growing storm knows no allegiance.',
		hintText: 'Stay close to the enemy while behind terrain. When they summon a firestorm, it will expand and damage them.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 20);
			SchoolLessons.removeEnemyAbility(1, 1);

			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},	
	},
	
	{
		name: 'Blaze Of Opportunity',
		text: 'Risk the heat to turn the tide.',
		hintText: 'Stand in the path of an orb of fire to detonate it early, damaging nearby enemies. This is a high-risk strategy! Use it where enemies can\'t kite away.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 6);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 25;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'Hazardous Horizon',
		text: 'A shift in view uncovers new opportunities.',
		hintText: 'Cloud walls are summoned behind the player. Position yourself to block a useful area and use SP to pass through safely.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(2, 10);
			SchoolLessons.removeEnemyAbility(1, 0);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 3;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 2;
		},
	},
	
	{
		name: 'Pause Before The Storm',
		text: 'The most perilous paths often lead to the clearest openings.',
		hintText: 'Channeled abilities leave enemies vulnerable for a turn, use this opening to attack.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 10, dexterity: 10, intelligence: 10}
			debug.addEquipment("WoodenSword")
			
			SchoolLessons.setEnemyHp(1, 8);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 2;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Provoking The Behemoth',
		text: 'A little space can make all the difference.',
		hintText: 'Use the enemy\'s slow speed on diagonals to create a three tile gap, provoking a slow charge.',

		playerClass: 'Warrior',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 7, dexterity: 10, intelligence: 10}
			
			SchoolLessons.setEnemyHp(1, 50);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
]});
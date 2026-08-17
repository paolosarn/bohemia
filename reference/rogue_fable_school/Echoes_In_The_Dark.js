/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('Echoes In The Dark', {
	niceName: 'Echoes In The Dark',
	author: 'Random595',
	description: 'Explore the mechanics of agro and stealth. Learn to manipulate enemy awareness, vanish from sight, and strike from the shadows.',
	lessonList: [

		{
		name: 'Beyond The Reach Of Sound',
		text: 'Distance keeps the peace, proximity brings chaos.',
		hintText: 'Agro enemies that see the player shout every turn, alerting nearby enemies. Unaware enemies hear from six tiles away, sleeping enemies from three.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment("CloakOfStealth", {mod: 2})
			
			gs.getCharWithID(gs.nextCharacterID - 3).isAgroed = true
			gs.getCharWithID(gs.nextCharacterID - 1).isAsleep = true
			
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
		name: 'The Call That Never Came',
		text: 'The silence waits, until the watcher arrives.',
		hintText: 'Agro enemies will only shout to alert others if the player is in vision.',

		playerClass: 'Rogue',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 8, dexterity: 10, intelligence: 10}	
			
			gs.getCharWithID(gs.nextCharacterID - 2).isAgroed = true
			SchoolLessons.setEnemyHp(3, 10);
			
			SchoolLessons.setEnemyHp(1, 20);
			SchoolLessons.setEnemyHp(2, 20);
			SchoolLessons.setEnemyHp(4, 20);
		},
		
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			
			return gs.liveCharacterList().length <= 4 && gs.agroedHostileList().length === 0;
		},
	},
	
	{
		name: 'Hidden In Plain Sight',
		text: 'With the right tools, even sight can be stolen.',
		hintText: 'The rings indicate enemy detection range. It starts at 6 tiles, and is reduced by 1 for every stealth. Use SP to sneak in and grab the stealth items before being detected.',

		playerClass: 'Rogue',
		onStartGame: function () {
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'One Breath Away',
		text: 'The path forward may require a little noise.',
		hintText: 'Even 1 stealth prevents enemies from waking up. Remove your stealth item and stand adjacent to the enemy to wake it up, to prevent taking a hit. Kite it into terrain to kill.',

		playerClass: 'Rogue',
		onStartGame: function () {
			gs.pc.baseAttributes = {strength: 8, dexterity: 10, intelligence: 10}	
			debug.addEquipment('RingOfStealth');
			
			SchoolLessons.setEnemyHp(1, 5);
			gs.getCharWithID(gs.nextCharacterID - 1).isAsleep = true
			
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
		name: 'Vanishing Patience',
		text: 'Even hunters grow weary of the hunt.',
		hintText: 'If you do not have tools to defeat an enemy, run away using SP. If you stay out of vision for 20 turns the enemy will de-agro.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('ShortBow');
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.agroedHostileList().length === 0;
		},
	},
	
	{
		name: 'Chance Of Alarm',
		text: 'Enemies have a 50% chance to shout immediately when they agro. Observe the indications above the enemies to see the difference.\n\nIf they do not shout, you can retreat out of vision using SP to prevent agro of nearby enemies.',
		hintText: 'This is a demonstration level, I wasn\'t expecting anyone to need a hint.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.addEquipment('RingOfArchery');
			gs.pc.baseAttributes = {strength: 10, dexterity: 18, intelligence: 10}
			
		},
		updateStats: function () {
			gs.pc.maxHp = 30;
			gs.pc.maxSp = 5;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.getCharWithID(gs.nextCharacterID - 2) === null && gs.getCharWithID(gs.nextCharacterID - 6) === null && gs.getCharWithID(gs.nextCharacterID - 7) === null && gs.getCharWithID(gs.nextCharacterID - 11) === null && gs.agroedHostileList().length === 0;
		},
	},
	
	{
		name: 'The Final Shout',
		text: 'Enemies have a 50% chance to shout when killed.',
		hintText: 'This is a demonstration level, I wasn\'t expecting anyone to need a hint.',

		playerClass: 'Rogue',
		onStartGame: function () {
			debug.learnTalent('RangeMastery', 'Extended');
			debug.addEquipment('HandCannon', {mod: 2});
			debug.addEquipment('RingOfArchery', {mod: 1});
			debug.addEquipment('RingOfArchery', {mod: 1});
			debug.addEquipment('ArcheryGoggles', {mod: 1});
			gs.pc.baseAttributes = {strength: 10, dexterity: 22, intelligence: 10}
			debug.learnTalent('PowerShot', 'Fast');
			
		},
		updateStats: function () {
			gs.pc.maxHp = 30;
			gs.pc.maxSp = 5;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.getCharWithID(gs.nextCharacterID - 2) === null && gs.getCharWithID(gs.nextCharacterID - 6) === null && gs.getCharWithID(gs.nextCharacterID - 7) === null && gs.getCharWithID(gs.nextCharacterID - 11) === null && gs.agroedHostileList().length === 0;
		},
	},
	
]});
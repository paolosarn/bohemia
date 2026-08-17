/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('ShadowsAndSightlines', {
	niceName: 'Shadows And Sightlines',
	author: 'Random595',
	description: 'Learn how to stay unseen, disrupt enemy tactics, and turn the fog of war into your greatest ally.',
	lessonList: [

		{
		name: 'Fractured Focus',
		text: 'A thread unseen is a thread undone.',
		hintText: 'Shamans require vision of the player and the enemy to summon totems. Hide behind terrain to prevent them from buffing their allies.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('Mace');
			
			SchoolLessons.removeEnemyAbility(1, 0);	
			SchoolLessons.removeEnemyAbility(1, 1);
			SchoolLessons.setEnemyHp(1, 30);
			
			SchoolLessons.setEnemyHp(2, 50);
			
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 50;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 0;
			if(gs.liveCharacterList().length === 4) {
				gs.getCharWithID(gs.nextCharacterID - 1).setMaxHp = 50
				gs.getCharWithID(gs.nextCharacterID - 1).currentHp = 50
			}
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},
	
	{
		name: 'Lost In The Fog',
		text: 'Lost in the fog, forgotten in the fight.',
		hintText: 'Summoners require vision to call their allies. Hide behind the wall and prevent the enemy from acting with knockback.',

		playerClass: 'Ranger',
		onStartGame: function () {
			debug.addEquipment('LongBow');
			debug.learnTalent('PowerShot');
			
			SchoolLessons.setEnemyHp(1, 18);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 15;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 0;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Breaking The Chain',
		text: 'A blind spot is more than just a gap in vision.',
		hintText: 'Healing only triggers for enemies that the healer can see. Kite back diagonally to draw the healer out of sight.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('Mace');
			debug.learnTalent('PowerStrike', 'Stunning')
			debug.learnTalent('Discord');
			gs.pc.baseAttributes = {strength: 9, dexterity: 10, intelligence: 10}	
			
			for (let i = 1; i <= 4; i++) {
			SchoolLessons.setEnemyHp(i, 3);
			}
			
			SchoolLessons.setEnemyHp(5, 20);
			debug.agroAllNPCs();
			
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 1;
			gs.pc.maxMp = 16;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},

	{
		name: 'Sightless Salvation',
		text: 'The unseen can\'t be saved.',
		hintText: 'Healers require vision of the enemy they are healing. Draw the enemy out of vision before you attack.',

		playerClass: 'Warrior',
		onStartGame: function () {
			debug.addEquipment('HandAxe')
			debug.learnTalent('PowerStrike', 'Stunning')
			
			SchoolLessons.removeEnemyAbility(1, 0);	
			SchoolLessons.removeEnemyAbility(1, 2);	

			SchoolLessons.removeEnemyAbility(3, 0);	
			SchoolLessons.removeEnemyAbility(3, 2);
			
			SchoolLessons.setEnemyHp(2, 20);
			
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
		name: 'The Dance Of Elements',
		text: 'A clear path isn\'t always the safest.',
		hintText: 'Mixing fire and water makes steam clouds that block vision. Enemies can only shoot if they have vision of the player.',

		playerClass: 'FireMage',
		onStartGame: function () {
			debug.learnTalent('FireBall');
			gs.pc.baseAttributes = {strength: 10, dexterity: 10, intelligence: 15}
			
			SchoolLessons.setEnemyHp(1, 10);
			SchoolLessons.setEnemyHp(2, 10);
			SchoolLessons.setEnemyHp(3, 10);
			SchoolLessons.setEnemyHp(4, 10);
			
			debug.agroAllNPCs();
		},
		updateStats: function () {
			gs.pc.maxHp = 1;
			gs.pc.maxSp = 0;
			gs.pc.maxMp = 30;
		},
		isComplete: function () {
			return gs.liveCharacterList().length === 1;
		},
	},	
	
]});

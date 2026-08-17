/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('AsymmetricAssault', {
	niceName: 'Asymmetric Assault',
	author: 'Random595',
	description: 'Strike without retaliation. Learn to position, exploit enemy patterns, and use abilities to deal damage while staying safe.',
	lessonList: [

		{
			name: 'Indirect Incineration',
			text: 'Not all paths to destruction are direct.',
			hintText: 'Using the edge of a fireball you can hit the enemy from around a corner.',
			playerClass: 'FireMage',
			onStartGame: function () {
				debug.learnTalent('FireBall');

				SchoolLessons.setEnemyHp(1, 15);
				
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 8;
				debug.agroAllNPCs();
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},
		
		{
			name: 'Arcing Strikes',
			text: 'The right angle can make all the difference.',
			hintText: 'Lightning bolt is able to reach around corners at certain angles. Wait at the starting location and hit the enemy before they move around the corner.',
			playerClass: 'StormMage',
			onStartGame: function () {
				debug.learnTalent('LightningBolt');

				SchoolLessons.setEnemyHp(1, 12);
				debug.agroAllNPCs();
				
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 8;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},
		
		{
			name: 'Unfettered Reach',
			text: 'Magic is not always bound by the laws of physics.',
			hintText: 'Discord can be targeted through objects that prevent ranged attacks. Hide behind a pillar to attack the tower safely.',
			playerClass: 'Enchanter',
			onStartGame: function () {
				debug.learnTalent('Discord');

				SchoolLessons.setEnemyHp(1, 10);
				SchoolLessons.removeEnemyAbility(1, 1);
				
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 8;
				debug.agroAllNPCs();
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},	

		{
			name: 'Edge Of The Storm',
			text: 'A storm can reach beyond the horizon.',
			hintText: 'Using the edge of storm shot you can target around corners or pillars, in a diagonal or straight line.',
			playerClass: 'Ranger',
			onStartGame: function () {
				debug.addEquipment('ShortBow');
				debug.learnTalent('StormShot');
				debug.learnTalent('RangeMastery');

				SchoolLessons.setEnemyHp(1, 1);
				SchoolLessons.setEnemyHp(2, 1);
				SchoolLessons.setEnemyHp(3, 1);
				SchoolLessons.setEnemyHp(4, 1);
				
				SchoolLessons.removeEnemyAbility(1, 1);
				SchoolLessons.removeEnemyAbility(2, 1);
				SchoolLessons.removeEnemyAbility(3, 1);
				SchoolLessons.removeEnemyAbility(4, 1);
				
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
				debug.agroAllNPCs();
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		{
			name: 'Opening The Path',
			text: 'A change in direction can shift the momentum.',
			hintText: 'When an enemy follows you around a corner, it creates room to knock them back. Use this space to cyclone strike without taking damage.',
			playerClass: 'Barbarian',
			onStartGame: function () {
				debug.addEquipment('BroadSword');
				debug.learnTalent('CycloneStrike', 'Fast');

				SchoolLessons.setEnemyHp(1, 15);
				SchoolLessons.setEnemyHp(2, 15);
				SchoolLessons.setEnemyHp(3, 15);
				
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 0;
				debug.agroAllNPCs();
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		{
			name: 'Advance And Withdraw',
			text: 'Victory is found in the balance between advancing and withdrawing.',
			hintText: 'Use charge to deal damage for free. Kite backwards and around terrain until you have the space and resources to charge again.',
			playerClass: 'Barbarian',
			onStartGame: function () {
				debug.addEquipment('WoodenSword');
				debug.learnTalent('Charge');

				SchoolLessons.setEnemyHp(1, 20);
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 1;
				gs.pc.maxMp = 0;
				debug.agroAllNPCs();
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},

		{
			name: 'Fanning The Flames',
			text: 'An ember is just the start of a blaze.',
			hintText: 'Aim at the enemies :P',
			playerClass: 'FireMage',
			onStartGame: function () {
				debug.learnTalent('WallOfFire', 'Quick');

				SchoolLessons.setEnemyHp(1, 10);
				SchoolLessons.setEnemyHp(2, 10);
			
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 0;
				gs.pc.maxMp = 12;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			},
		},
		
]});
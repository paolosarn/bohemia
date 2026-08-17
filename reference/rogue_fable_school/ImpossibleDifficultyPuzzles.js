/*global gs, SchoolLessons, debug*/
'use strict';

SchoolLessons.loadCustomCourse('ImpossibleDifficultyPuzzles', {
	niceName: 'Impossible Difficulty Puzzles',
	author: 'Random595',
	description: 'Every puzzle has a solution.',
	lessonList: [
	
		{
		name: 'The Great Divide',
		text: [
			'An immense chasm separates you from your goal. No clear path to cross, yet, is it truly impassable?\n',
			'Only those with mastery of magic and mechanics can turn the impossible into reality.'
		].join(''),
		
		hintText: [
			'Lose control to start the play,\n',
			'Let timeless death pave the way.'
		].join(''),

		playerClass: 'Enchanter',
		onStartGame: function () {
			gs.pc.setRace(gs.playerRaces.Ogre);
			gs.pc.sprite.frame = gs.pc.getSpriteFrame();
			gs.pc.type.frame = gs.pc.getSpriteFrame();
			
			gs.pc.talents.addTalent('BloodPortal');
			gs.pc.talents.addTalent('PowerShot');
			gs.pc.talents.addTalent('SpectralOrb');
			gs.pc.talents.addTalent('BurstOfWind');
			gs.pc.talents.addTalent('FlamePortal');
			gs.pc.talents.addTalent('FireBall'); 
			gs.pc.talents.addTalent('SummonSkeleton'); 
			gs.pc.talents.addTalent('ShadowStep');
			gs.pc.talents.addTalent('Confusion');
			gs.pc.talents.addTalent('SprintAttack');
			
			debug.addItem("Meat", {amount: 99})
			debug.addItem("PotionOfAmnesia", {amount: 99})
			gs.pc.talentPoints = 7
			gs.pc.baseAttributes = {strength: 20, dexterity: 20, intelligence: 20}
		},
		
		updateStats: function () {
			gs.pc.maxHp = 99;
			gs.pc.maxSp = 99;
			gs.pc.maxMp = 99;
		},
		
		isComplete: function () {
			//return gs.liveCharacterList().length === 1;
		},
	},

]});
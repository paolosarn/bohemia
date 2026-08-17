/*global gs, SchoolLessons, debug*/
'use strict';


SchoolLessons.loadCustomCourse('ExampleCourse', {
	niceName: 'Example Course',
	author: 'Justin Wang',
	description: 'Copy this file to create a new course',
	lessonList: [
		// Example Lesson:
		{
			name: 'ExampleLesson',
			text: 'You can put any text here to describe the lesson.',
			hintText: '', // If this string is empty then no hint will be shown
			playerClass: 'Warrior',
			onStartGame: function () {
				debug.addEquipment('WoodenSword');

				SchoolLessons.setEnemyHp(1, 10);
			},
			updateStats: function () {
				gs.pc.maxHp = 1;
				gs.pc.maxSp = 3;
				gs.pc.maxMp = 0;
			},
			isComplete: function () {
				return gs.liveCharacterList().length === 1;
			}
		}
	]
});
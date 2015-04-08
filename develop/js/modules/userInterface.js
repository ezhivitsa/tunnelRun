define([
		'dataSource',
		'consts'
	],
	function(DataSource, consts) {
		'use strict';

		function Interface(element, diff) {
			this.started = false;

			this.diff = diff;

			this.element = element;

			this.inputContainer = document.querySelector('.theme-container');
			this.inputField = document.querySelector('[name=player-name]');
			this.saveBtn = document.querySelector('#save');
			this.scoreTable = document.querySelector('#score-table');
			this.scoreTableData = JSON.parse(localStorage.getItem('score'));

			this.button = document.querySelector('#paly-restart-btn');

			this.gameStatus = document.querySelector('#game-text');

			this.gameScoreField = document.querySelector('#score');
			this.gameScore = 0;

			this.eventControl('on');
			this.update();
		}

		Interface.prototype.update = function() {
			var self = this,
				myUpdate = 0;

			DataSource.addAnimation(function(delta, now) {
				myUpdate++;
				if (myUpdate == 20) {
					self.gameScore += self.diff.get('speed');
					self.gameScoreField.innerHTML = Math.round(self.gameScore * 10);
					myUpdate = 0;
				}
			});
		};
		Interface.prototype.updateTable = function() {
			var result = '<tr><th class="position">Position</th><th class="player">Player Name</th><th class="scores-num">scores</th></tr>';
			for (var i in this.scoreTableData) {
				result += '<tr><td class="position">' + (parseInt(i)+1) + '</td><td class="player">' + this.scoreTableData[i].player + '</td><td class="scores-num">' + this.scoreTableData[i].score + '</td></tr>';
			}
			this.scoreTable.innerHTML = result;
		};

		Interface.prototype.eventControl = function(action) {
			var self = this;

			if (action === 'on') {
				action = 'addEvent';
			} else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				startRestart: function(e) {
					e.preventDefault();

					if (!self.started) {
						self.element.style.opacity = 1;
						self.button.innerHTML = consts.buttonsText.restart;
						DataSource.startAnimation();
						self.gameStatus.innerHTML = consts.statusText.onGame;
						self.started = true;
					} else {
						self.gameStatus.innerHTML = consts.statusText.restart;
						self.scoreTable.style.display = "none";
						self.inputContainer.style.display = "none";
						self.diff.init();
						DataSource.triggerEvent(document, 'restart', {
							diff: self.diff
						});
						DataSource.paused() && DataSource.startAnimation();
						self.gameStatus.innerHTML = consts.statusText.onGame;
					}
					self.gameScore = 0;
				},
				pause: function(e) {
					if (e.which != 32) {
						return;
					}

					if (DataSource.paused()) {
						DataSource.startAnimation()
						self.gameStatus.innerHTML = consts.statusText.onGame;
						self.element.style.opacity = 1;
					} else {
						DataSource.stopAnimation();
						self.gameStatus.innerHTML = consts.statusText.pause;
						self.element.style.opacity = 0.05;
					}
				},
				end: function(e) {
					DataSource.stopAnimation();
					self.inputContainer.style.display = "block";

					self.scoreTable.parentNode.className = '';
					if (self.scoreTableData && self.scoreTableData.length > 0) {
						self.updateTable();
						self.scoreTable.style.display = "table";
					}
					self.gameStatus.innerHTML = consts.statusText.loss;
					self.element.style.opacity = 0.05;
				},
				saveScore: function() {
					if (!self.inputField.value) {
						self.gameStatus.innerHTML = consts.statusText.badInput;
						return;
					}
					var finalScore = Math.round(self.gameScore * 10),
						changed = false;
					self.inputContainer.style.display = "none";
					if ((self.scoreTableData && self.scoreTableData.length < 10) || !self.scoreTableData) {
						if (self.scoreTableData) {
							self.scoreTableData.push({
								player: self.inputField.value,
								score: finalScore
							})
						} else {
							self.scoreTableData = [{
								player: self.inputField.value,
								score: finalScore
							}];
						}
						changed = true;
					} else {
						if (self.scoreTableData[9].score < finalScore) {
							self.scoreTableData.pop();
							self.scoreTableData.push({
								player: self.inputField.value,
								score: finalScore
							});
							changed = true;
						}
					}
					if (changed) {
						self.scoreTableData.sort(function(a, b) {
							return b.score - a.score;
						});
						localStorage.setItem('score', JSON.stringify(self.scoreTableData));
						self.updateTable();
						self.scoreTable.style.display = "table";
					}
				}
			};

			DataSource
				[action](this.button, 'click', this.events.startRestart)[action](document, 'keydown', this.events.pause)[action](document, ':game-end', this.events.end)[action](document, 'hero.abyss-die', this.events.end)[action](this.saveBtn, 'click', this.events.saveScore);
		};

		return Interface;
	}
);
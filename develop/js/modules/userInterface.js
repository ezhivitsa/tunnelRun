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
					self.gameStatus.innerHTML = consts.statusText.loss;
					self.element.style.opacity = 0.05;
				}
			};

			DataSource
				[action](this.button, 'click', this.events.startRestart)
				[action](document, 'keydown', this.events.pause)
				[action](document, ':game-end', this.events.end)
				[action](document, 'hero.abyss-die', this.events.end);
		};

		return Interface;
	}
);
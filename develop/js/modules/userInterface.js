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

			this.eventControl('on');
		}

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
						DataSource.triggerEvent(document, 'restart', { diff: self.diff });
						DataSource.paused() && DataSource.startAnimation();
						self.gameStatus.innerHTML = consts.statusText.onGame;
					}
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
					console.log('End game');
				}
			};

			DataSource
				[action](this.button, 'click', this.events.startRestart)
				[action](document, 'keydown', this.events.pause)
				[action](document, ':game-end', this.events.end);
		};

		return Interface;
	}
);
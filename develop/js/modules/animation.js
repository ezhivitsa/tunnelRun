define([
		'stats'
	],
	function(Stats) {
		'use strict';

		function Animation() {
			this.actions = [];
			this.pause = false;

			this.stats = new Stats();
			this.stats.setMode(0); // 0: fps, 1: ms

			// align top-left
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';

			document.body.appendChild(this.stats.domElement);
		};

		Animation.prototype.addAction = function(fn) {
			if (typeof(fn) === "function") {
				this.actions.push(fn);
			}
		};

		Animation.prototype.removeAction = function(fn) {
			if (typeof(fn) === "function") {
				var pos = this.actions.indexOf(fn)
			}
		};

		Animation.prototype.start = function() {
			this.pause = false;
			this.startAnimationFrame();
		};

		Animation.prototype.startAnimationFrame = function() {
			var self = this,
				lastTimeMsec = null;

			requestAnimationFrame(function(nowMsec) {
				self.stats.begin();

				if (!this.pause) {
					self.startAnimationFrame.call(self);
				}

				lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
				lastTimeMsec = nowMsec;

				for (var i = 0; i < self.actions.length; i++) {
					self.actions[i](deltaMsec/10, nowMsec/10);
				}

				self.stats.end();
			});
		};

		Animation.prototype.stop = function() {
			this.pause = true;
		};

		return Animation;
	}
)
define([
	'consts'
],
	function (consts) {
		'use strict';

		function Difficulty () {
			this.diff = 0;
			this.iteration = 0;
			this.speed = consts.minSpeed;
			this.fps = 60;
			this.lastFpsTime = 0;
		};

		Difficulty.prototype.update = function (animation) {
			var self = this;

			animation.addAction(function (fpsTime) {
				if ( self.lastFpsTime ) {
					self.fps = fpsTime - self.lastFpsTime;
				}
				self.lastFpsTime = fpsTime;

				if ( this.iteration > 100000 ) {
					( this.diff < 1 ) && ( this.diff += 0.1 );
					( this.speed < consts.maxSpeed ) && ( this.speed += 1 );

					this.iteration = 0;
				}
				//console.log(self.diff, ' ', self.speed);
			});
		};

		Difficulty.prototype.get = function (el) {
			if ( !el ) {
				return {
					diff: this.diff,
					speed: this.speed / 100
				}
			}

			return (el === 'speed') ? this[el] / 100 : this[el];
		};

		return Difficulty;
	}
);
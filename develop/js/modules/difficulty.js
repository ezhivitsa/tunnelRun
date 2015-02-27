define([
	'consts',
	'dataSource'
],
	function (consts, DataSource) {
		'use strict';

		function Difficulty () {
			this.diff = 0;
			this.iteration = 0;
			this.speed = consts.minSpeed;
			this.fps = 60;
			this.lastFpsTime = 0;
		};

		Difficulty.prototype.update = function () {
			var self = this;

			DataSource.addAnimation(function (fpsTime) {
				self.iteration++;

				if ( self.lastFpsTime ) {
					self.fps = fpsTime - self.lastFpsTime;
				}
				self.lastFpsTime = fpsTime;

				if ( self.iteration > 1000 ) {
					( self.diff < 1 ) && ( self.diff += 0.1 );
					( self.speed < consts.maxSpeed ) && ( self.speed += 0.1 );

					self.iteration = 0;
				}
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
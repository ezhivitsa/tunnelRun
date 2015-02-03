define([
	'three'
],
	function (THREE) {
		'use strict';

		var BUTTONS = {
			top: {
				// W button
				which: 119,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.top;
				}
			},
			right: {
				// D button
				which: 100,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.right;
				}
			},
			bottom: {
				// S button
				which: 115,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.bottom;
				}
			},
			left: {
				// A button
				which: 97,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.left;
				}
			},
			moveLeft: {
				// -> button
				which: 37,
				handler: function (event) {

				}
			},
			moveRight: {
				// <- button
				which: 39,
				handler: function (event) {

				}
			}
		};

		var POSITIONS = {
			top: {
				x: 0,
				y: 14,
				moveDim: 'x'
			},
			right: {
				x: 12,
				y: 0,
				moveDim: 'y'
			},
			bottom: {
				x: 0,
				y: -8,
				moveDim: 'x'
			},
			left: {
				x: -12,
				y: 0,
				moveDim: 'y'
			}
		};

		function Hero(options) {
			this.geometry =  new THREE.SphereGeometry( options.radius, options.widthSegments, options.heightSegments );
			this.material = new THREE.MeshLambertMaterial({
				color: 0xffff00
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.currentPosition = {
				side: 0,
				posFromLeft: 12,
				position: POSITIONS.top
			};

			this.addOnPosition();
		}

		Hero.prototype.eventContol = function (action) {
			if ( action !== 'on' ) {
				action = 'addEventListener';
			}
			else {
				action = 'removeEventListener';
			}

			this.events = this.events || {
				onKeydown: function (event) {
					for ( var button in BUTTONS ) {
						if ( button.which === event.which ) {
							button.handler.call(this, event);
							break;
						}
					}
				}
			};

			document[action]('keydown', onKeydown);
		};

		Hero.prototype.addOnPosition = function () {
			this.mesh.position.x = this.currentPosition.position.x;
			this.mesh.position.y = this.currentPosition.position.y;
		};

		return Hero;
	}
);
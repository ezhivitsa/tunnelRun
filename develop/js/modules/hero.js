define([
	'three',

	'consts',
	'dataSource'
],
	function (THREE, consts, DataSource) {
		'use strict';

		var BUTTONS = {
			top: {
				// W button
				which: 87,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.top;
					return 'top';
				}
			},
			right: {
				// D button
				which: 68,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.right;
					return 'right';
				}
			},
			bottom: {
				// S button
				which: 83,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.bottom;
					return 'bottom';
				}
			},
			left: {
				// A button
				which: 65,
				handler: function (event) {
					this.currentPosition.position = POSITIONS.left;
					return 'left';
				}
			},
			moveLeft: {
				// -> button
				which: 39,
				handler: function (event) {

				}
			},
			moveRight: {
				// <- button
				which: 37,
				handler: function (event) {

				}
			}
		};

		var POSITIONS = {
			top: {
				x: 0,
				y: 14,
				z: -3,
				moveDim: 'x',
				rotation: 'x'
			},
			right: {
				x: 11,
				y: 3,
				z: -3,
				moveDim: 'y',
				rotation: '-y'
			},
			bottom: {
				x: 0,
				y: -8,
				z: -3,
				moveDim: 'x',
				rotation: '-x'
			},
			left: {
				x: -11,
				y: 3,
				z: -3,
				moveDim: 'y',
				rotation: 'y'
			}
		};

		var signRegExp = /(-?)(\w+)/;

		function Hero(diff) {
			this.geometry =  new THREE.SphereGeometry( consts.hero.radius, consts.hero.widthSegments, consts.hero.heightSegments );
			this.material = new THREE.MeshLambertMaterial({
				color: 0xffff00,
				shading: THREE.FlatShading
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.currentPosition = {
				side: 0,
				posFromLeft: 12,
				position: POSITIONS.bottom
			};

			this.diff = diff;

			this.addOnPosition();
			this.eventControl('on');
		}

		Hero.prototype.eventControl = function (action) {
			if ( action === 'on' ) {
				action = 'addEvent';
			}
			else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				onKeydown: function (event) {
					for ( var button in BUTTONS ) {

						if ( button.which === event.which ) {
							button.handler.call(this, event);

							// fire custom event of change position
							var fireEvent = new Event(':hero-position');
							document.dispatchEvent(fireEvent);
							break;
						}
					}
				},
				heroPosition: function (event) {

				}
			};

			DataSource[action](document, 'keydown', this.events.onKeydown);
			DataSource[action](document, ':hero-position', this.events.heroPosition);
		};

		Hero.prototype.addOnPosition = function () {
			this.mesh.position.x = this.currentPosition.position.x;
			this.mesh.position.y = this.currentPosition.position.y;
			this.mesh.position.z = this.currentPosition.position.z;
		};

		Hero.prototype.animate = function () {
			var self = this;

			DataSource.addAnimation(function () {
				(function (rot) {
					var sign = rot.match(signRegExp),
						dim = sign[2];

					sign = sign[1] ? -1 : 1;
					self.mesh.rotation[dim] += (0.09*self.diff.get('diff') + 0.05) * sign;

				})(self.currentPosition.position.rotation);
			});
		};

		Hero.prototype.updatePosition = function () {

		};

		return Hero;
	}
);
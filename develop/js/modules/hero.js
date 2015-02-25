define([
	'three',

	'consts',
	'dataSource'
],
	function (THREE, consts, DataSource) {
		'use strict';

		var BUTTONS = {
			'87': 'top', // W button
			'68': 'right', // D button
			'83': 'bottom', // S button
			'65': 'left', // A button
			'39': 'moveLeft', // -> button
			'37': 'moveRight' // <- button
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

			this.position = {
				lastPos: 'bottom',
				nextPos: 'bottom',
				pos: {}
			};

			this.setPosition(POSITIONS.bottom);

			this.diff = diff;

			this.addOnPosition();
			this.eventControl('on');
		}

		Hero.prototype.eventControl = function (action) {
			var self = this;

			if ( action === 'on' ) {
				action = 'addEvent';
			}
			else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				onKeydown: function (event) {
					var position = BUTTONS[event.which];

					if ( position ) {
						// set new position
						if ( self.position.lastPos === self.position.nextPos && position !== self.position.lastPos ) {
							self.position.nextPos = position;

							// fire custom event of change position
							var fireEvent = new Event(':hero-position');
							document.dispatchEvent(fireEvent);
						}

					}
				},
				heroPosition: function (event) {
					self.updatePosition();
				}
			};

			DataSource[action](document, 'keydown', this.events.onKeydown);
			DataSource[action](document, ':hero-position', this.events.heroPosition);
		};

		Hero.prototype.addOnPosition = function () {
			this.mesh.position.x = this.position.pos.x;
			this.mesh.position.y = this.position.pos.y;
			this.mesh.position.z = this.position.pos.z;
		};

		Hero.prototype.animate = function () {
			var self = this;

			DataSource.addAnimation(function () {
				(function (rot) {
					var sign = rot.match(signRegExp),
						dim = sign[2];

					sign = sign[1] ? -1 : 1;
					self.mesh.rotation[dim] += (0.09*self.diff.get('diff') + 0.05) * sign;

				})(self.position.pos.rotation);
			});
		};

		Hero.prototype.updatePosition = function () {
			var self = this;
			DataSource.addAnimation(function anim() {
				var newCoords = POSITIONS[self.position.nextPos];

				if ( self.position.pos.x !== newCoords.x || self.position.pos.y !== newCoords.y ) {
					var  newSystCoord = {
						x: newCoords.x - self.position.pos.x,
						y: newCoords.y - self.position.pos.y
					};

					var currPos = {
						x: consts.hero.changePositionSpeed / Math.sqrt(1 + Math.pow( newSystCoord.y / newSystCoord.x, 2 )),
						y: consts.hero.changePositionSpeed / Math.sqrt(1 + Math.pow( newSystCoord.x / newSystCoord.y, 2 ))
					};

					if ( (currPos.x > newSystCoord.x && newSystCoord.x >= 0) || (currPos.x < newSystCoord.x && newSystCoord.x < 0) ) {
						self.position.pos.x = newCoords.x;
					}
					else {
						if ( newSystCoord.x >= 0 ) {
							self.position.pos.x += currPos.x;
						}
						else {
							self.position.pos.x -= currPos.x;
						}
					}

					if ( (currPos.y > newSystCoord.y && newSystCoord.y >= 0) || (currPos.y < newSystCoord.y && newSystCoord.y < 0) ) {
						self.position.pos.y = newCoords.y;
					}
					else {
						if ( newSystCoord.y >= 0 ) {
							self.position.pos.y += currPos.y;
						}
						else {
							self.position.pos.y -= currPos.y;
						}
					}
				}
				else {
					self.position.lastPos = self.position.nextPos;
					DataSource.removeAnimation(anim);
				}

				self.replaceToCurrentPosition();
			});
		};

		Hero.prototype.replaceToCurrentPosition = function () {
			this.mesh.position.x = this.position.pos.x;
			this.mesh.position.y = this.position.pos.y;	
			this.mesh.position.z = this.position.pos.z;
		};

		Hero.prototype.setPosition = function (pos) {
			this.position.pos.x = (pos.x) ? pos.x : 0;
			this.position.pos.y = (pos.y) ? pos.y : 0;
			this.position.pos.z = (pos.z) ? pos.z : 0;

			this.position.pos.moveDim = (pos.moveDim) ? pos.moveDim : "x";
			this.position.pos.rotation = (pos.rotation) ? pos.rotation : "-x";
		};

		return Hero;
	}
);
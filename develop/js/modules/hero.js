define([
		'three',

		'consts',
		'dataSource'
	],
	function(THREE, consts, DataSource) {
		'use strict';

		var BUTTONS = {
			'87:change': 'top', // W button
			'68:change': 'right', // D button
			'83:change': 'bottom', // S button
			'65:change': 'left', // A button
			'39:move': 'left', // -> button
			'37:move': 'right' // <- button
		};

		var POSITIONS = {
			top: {
				x: 0,
				y: 11,
				z: -3,
				moveDim: 'x',
				rotation: {
					z: 0
				}
			},
			right: {
				x: 11,
				y: 0,
				z: -3,
				moveDim: '-y',
				rotation: {
					z: -Math.PI / 2
				}
			},
			bottom: {
				x: 0,
				y: -11,
				z: -3,
				moveDim: '-x',
				rotation: {
					z: Math.PI
				}
			},
			left: {
				x: -11,
				y: 0,
				z: -3,
				moveDim: 'y',
				rotation: {
					z: Math.PI / 2
				}
			}
		};

		var signRegExp = /(-?)(\w+)/;

		function Hero(diff) {
			this.geometry = new THREE.SphereGeometry(consts.hero.radius, consts.hero.widthSegments, consts.hero.heightSegments);
			this.material = new THREE.MeshLambertMaterial({
				color: 0xffff00,
				shading: THREE.FlatShading
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.opts = {
				lastPos: 'bottom',
				nextPos: 'bottom',
				rot: 0,
				pos: {},
				move: false
			};

			this.init(diff);

			this.eventControl('on');
		}

		Hero.prototype.init = function(obj) {
			this.setPosition(POSITIONS.bottom, 'bottom');

			this.diff = obj.diff;

			this.addOnPosition();
		};

		Hero.prototype.eventControl = function(action) {
			var self = this;

			if (action === 'on') {
				action = 'addEvent';
			} else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				onKeydown: function(event) {
					var movement = BUTTONS[event.which + ':move'],
						position = BUTTONS[event.which + ':change']

					if ( self.opts.lastPos === self.opts.nextPos && position !== self.opts.lastPos && self.move ) {
						if ( movement ) {
							// move hero
							self.move();
							console.log('move')
						}
						else if ( position ) {
							// set new position
							self.opts.nextPos = position;
							self.updatePosition();
						}
					}
				},
				reinit: function(event) {
					self.init.call(self, event);
					var fireEvent = new Event(':hero-position');
					fireEvent.heroPosition = {
						x: self.opts.pos.x,
						y: self.opts.pos.y,
						movement: 'bottom'
					};
					document.dispatchEvent(fireEvent);
				}
			};

			DataSource[action](document, 'keydown', this.events.onKeydown)[action](document, 'restart', this.events.reinit);
		};

		Hero.prototype.addOnPosition = function () {
			this.mesh.position.x = this.opts.pos.x;
			this.mesh.position.y = this.opts.pos.y;
			this.mesh.position.z = this.opts.pos.z;
		};

		Hero.prototype.animate = function() {
			var self = this;

			DataSource.addAnimation(function(delta, now) {
				(function(rot) {
					var sign = rot.match(signRegExp),
						dim = sign[2];

					sign = sign[1] ? -1 : 1;
					self.opts.rot += self.diff.get('speed') * delta / consts.hero.radius;
					self.mesh.rotation[dim] = self.opts.rot * sign;
				})(self.opts.pos.moveDim);
			});
		};

		Hero.prototype.move = function () {
			var sign = this.opts.pos.moveDim.match(signRegExp),
				dim = sign[2];

			sign = sign[1] ? -1 : 1;

			this.opts.pos[dim] += consts.hero.moveSpeed * sign;
			this.mesh.rotation.z += consts.hero.moveSpeed * sign;
			this.mesh.position[dim] += consts.hero.moveSpeed * sign;
		};

		Hero.prototype.updatePosition = function () {
			var self = this;
			DataSource.addAnimation(function anim() {
				var newCoords = POSITIONS[self.opts.nextPos];

				if ( self.opts.pos.x !== newCoords.x || self.opts.pos.y !== newCoords.y ) {
					var  newSystCoord = {
						x: newCoords.x - self.opts.pos.x,
						y: newCoords.y - self.opts.pos.y
					};

					var currPos = {
						x: consts.hero.changePositionSpeed / Math.sqrt(1 + Math.pow(newSystCoord.y / newSystCoord.x, 2)),
						y: consts.hero.changePositionSpeed / Math.sqrt(1 + Math.pow(newSystCoord.x / newSystCoord.y, 2))
					};


					if ( (currPos.x > newSystCoord.x && newSystCoord.x >= 0) || (currPos.x < newSystCoord.x && newSystCoord.x < 0) ) {
						self.opts.pos.x = newCoords.x;
					}
					else {
						if ( newSystCoord.x >= 0 ) {
							self.opts.pos.x += currPos.x;
						}
						else {
							self.opts.pos.x -= currPos.x;
						}
					}

					if ( (currPos.y > newSystCoord.y && newSystCoord.y >= 0) || (currPos.y < newSystCoord.y && newSystCoord.y < 0) ) {
						self.opts.pos.y = newCoords.y;
					}
					else {
						if ( newSystCoord.y >= 0 ) {
							self.opts.pos.y += currPos.y;
						}
						else {
							self.opts.pos.y -= currPos.y;
						}
					}

					// fire custom event of change position of the hero
					var fireEvent = new Event(':hero-position');
					fireEvent.heroPosition = {
						x: self.opts.pos.x,
						y: self.opts.pos.y,
						movement: self.opts.nextPos
					};
					document.dispatchEvent(fireEvent);

				}
				else {					
					self.setPosition(POSITIONS[self.opts.nextPos], self.opts.nextPos);
					DataSource.removeAnimation(anim);
				}

				self.replaceToCurrentPosition();
			});
		};

		Hero.prototype.replaceToCurrentPosition = function () {
			this.mesh.position.x = this.opts.pos.x;
			this.mesh.position.y = this.opts.pos.y;	
			this.mesh.position.z = this.opts.pos.z;
		};

		Hero.prototype.setPosition = function (pos, posName) {
			this.opts.pos.x = (pos.x) ? pos.x : 0;
			this.opts.pos.y = (pos.y) ? pos.y : 0;
			this.opts.pos.z = (pos.z) ? pos.z : 0;

			this.opts.pos.moveDim = (pos.moveDim) ? pos.moveDim : "-x";
			this.mesh.rotation.set(0, 0, (pos.rotation.z) ? pos.rotation.z : 0);
			this.opts.lastPos = this.opts.nextPos = posName;
		};

		return Hero;
	}
);
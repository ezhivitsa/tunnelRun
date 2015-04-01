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
			'39:move': -1, // -> button
			'37:move': 1 // <- button
		};

		var POSITIONS = {
			top: {
				x: 0,
				y: 11,
				z: -10,
				moveDim: 'x',
				rotation: {
					z: 0
				}
			},
			right: {
				x: 11,
				y: 0,
				z: -10,
				moveDim: '-y',
				rotation: {
					z: -Math.PI / 2
				}
			},
			bottom: {
				x: 0,
				y: -11,
				z: -10,
				moveDim: '-x',
				rotation: {
					z: Math.PI
				}
			},
			left: {
				x: -11,
				y: 0,
				z: -10,
				moveDim: 'y',
				rotation: {
					z: Math.PI / 2
				}
			}
		};

		var signRegExp = /(-?)(\w+)/;

		function Hero(options) {
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
				move: false,
				moveDir: {
					forward: 0,
					left: 0,
					right: 0,
					error: 0
				}
			};

			this.init(options);

			this.eventControl('on');
		}

		Hero.prototype.init = function(obj) {
			this.setPosition(POSITIONS.bottom, 'bottom', true);

			for ( var option in obj ) {
				this[option] = obj[option];
			}

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

					if ( self.opts.lastPos === self.opts.nextPos && position !== self.opts.lastPos && !self.opts.move ) {
						if ( movement ) {
							self.opts.move = movement;
						}
						else if ( position ) {
							// set new position
							self.opts.nextPos = position;

							// start movement to the new position
							self.updatePosition();
						}
					}
				},

				onKeyup: function (event) {
					var movement = BUTTONS[event.which + ':move'];

					if ( movement === self.opts.move ) {
						self.opts.move = 0;
					}
				},

				reinit: function(event) {
					self.init.call(self, event);
					DataSource.triggerEvent(document, ':hero-position', { 
						heroPosition: {
							x: self.opts.pos.x,
							y: self.opts.pos.y,
							movement: 'bottom'
						}
					});
				}
			};

			DataSource
				[action](document, 'keydown', this.events.onKeydown)
				[action](document, 'keyup', this.events.onKeyup)
				[action](document, 'restart', this.events.reinit);
		};

		Hero.prototype.addOnPosition = function () {
			this.mesh.position.x = this.opts.pos.x;
			this.mesh.position.y = this.opts.pos.y;
			this.mesh.position.z = this.opts.pos.z;
		};

		Hero.prototype.move = function () {
			var self = this;

			var maxMove = consts.segmentSize.width / 2 - consts.hero.radius;

			DataSource.addAnimation(function anim (delta) {
				var sign = self.opts.pos.moveDim.match(signRegExp),
					currentChange = consts.hero.movePerFrame * delta * !!self.opts.move + self.opts.moveDir.error * !self.opts.move,
					dim = sign[2];

				sign = sign[1] ? -1 : 1;

				self.increaseZ = self.diff.get('speed') * delta * self.opts.moveDir.forward;
				if ( self.opts.pos.z + self.increaseZ > POSITIONS[self.opts.lastPos].z  ) {
					self.mesh.position.z += self.increaseZ;
					self.opts.pos.z += self.increaseZ;
				}
				else {
					self.mesh.position.z = self.opts.pos.z = POSITIONS[self.opts.lastPos].z;
					self.increaseZ = 0;
				}

				if ( self.opts.pos.z > consts.hero.minZPos ) {
					DataSource.triggerEvent(document, ':game-end');
				}

				if ( self.opts.lastPos !== self.opts.nextPos ) {
					return;
				}

				self.opts.rot += (self.diff.get('speed') * delta - self.increaseZ) / consts.hero.radius;
				self.mesh.rotation[dim] = self.opts.rot * sign;

				if ( Math.abs(self.opts.pos[dim] + currentChange * sign * self.opts.move) > maxMove ) {
					self.opts.pos[dim] = maxMove * sign * self.opts.move;
					self.mesh.rotation.z = maxMove * sign * self.opts.move;
					self.mesh.position[dim] = maxMove * sign * self.opts.move;
				}
				else {
					self.opts.pos[dim] += currentChange * sign * (self.opts.move + self.opts.moveDir.left + self.opts.moveDir.right);
					self.mesh.rotation.z += currentChange * sign * (self.opts.move + self.opts.moveDir.left + self.opts.moveDir.right);
					self.mesh.position[dim] += currentChange * sign * (self.opts.move + self.opts.moveDir.left + self.opts.moveDir.right);
				}
			});
		};

		Hero.prototype.moveByZ = function (newSystCoord, delta) {
			var distance = Math.sqrt(Math.pow(newSystCoord.x, 2) + Math.pow(newSystCoord.y, 2));

			if ( distance < 2 * consts.hero.radius * 2 ) {
				var heroObjDistance = distance - consts.hero.radius - consts.figureOptions.pointLength/2, // potential distance between hero and object
					steps = heroObjDistance / consts.hero.changePositionSpeed,
					approximateDisplacement = (heroObjDistance < consts.hero.changePositionSpeed) ? 0 : steps * this.diff.get('speed') * delta;

				var ray = new THREE.Vector3(newSystCoord.x, newSystCoord.y, 0),
					collisionResult = this.collision.runCollisionWhenChangePosition(ray, approximateDisplacement);

				var heroCollisions = collisionResult.heroCollisions,
					object = collisionResult.intersectObject,
					segment = object ? object.parent : null;

				if ( !object ) {
					return;
				}

				var objectCenter = segment.position.z + object.position.z,
					changeDistance = consts.figureOptions.pointLength + consts.hero.radius - Math.abs(objectCenter + approximateDisplacement - this.opts.pos.z);

				if ( heroObjDistance < consts.hero.changePositionSpeed ) {
					if ( !heroCollisions[1] && heroCollisions[2] ) {
						// move hero forward
					}
					else if ( heroCollisions[0] || heroCollisions[1] ) {
						// move hero back
						this.mesh.position.z = objectCenter + consts.figureOptions.pointLength + consts.hero.radius;
						this.opts.pos.z = objectCenter + consts.figureOptions.pointLength + consts.hero.radius;
					}
				}
				else {
					if ( !heroCollisions[1] && heroCollisions[2] ) {
						// move hero forward
						this.mesh.position.z -= changeDistance / steps;
						this.opts.pos.z -= changeDistance / steps;
					}
					else if ( heroCollisions[0] || heroCollisions[1] ) {
						// move hero back
						this.mesh.position.z += changeDistance / steps;
						this.opts.pos.z += changeDistance / steps;
					}
				}
			}
		};

		Hero.prototype.updatePosition = function () {
			var self = this;
			DataSource.addAnimation(function anim(delta) {
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
					
					self.moveByZ(newSystCoord, delta);

					// fire custom event of change position of the hero
					DataSource.triggerEvent(document, ':hero-position', { 
						heroPosition: {
							x: self.opts.pos.x,
							y: self.opts.pos.y,
							movement: self.opts.nextPos
						}
					});
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

		Hero.prototype.setPosition = function (pos, posName, changeZ) {
			this.opts.pos.x = (pos.x) ? pos.x : 0;
			this.opts.pos.y = (pos.y) ? pos.y : 0;

			if ( changeZ ) {
				this.opts.pos.z = (pos.z) ? pos.z : 0;
			}

			this.opts.pos.moveDim = (pos.moveDim) ? pos.moveDim : "-x";
			this.mesh.rotation.set(0, 0, (pos.rotation.z) ? pos.rotation.z : 0);
			this.opts.lastPos = this.opts.nextPos = posName;
		};

		Hero.prototype.removeRestrictions = function () {
			this.opts.moveDir.forward = consts.hero.resumeZSpeed;
			this.opts.moveDir.left = 0;
			this.opts.moveDir.right = 0;
		};

		Hero.prototype.setRestrictions = function (collisions) {
			var restrictionsObject = {
				'left': false,
				'forward-left': false,
				'forward': false,
				'forward-right': false,
				'right': false
			};

			for ( var i = 0; i < collisions.length; i++ ) {
				restrictionsObject[collisions[i].name] = collisions[i];
			}

			if ( restrictionsObject.left || restrictionsObject['forward-left'] ) {
				this.opts.moveDir.left = -1;
			}
			if ( restrictionsObject.right || restrictionsObject['forward-right'] ) {
				this.opts.moveDir.right = 1;
			}
			if ( restrictionsObject.forward || (restrictionsObject['forward-left'] && !restrictionsObject.left) || (restrictionsObject['forward-right'] && !restrictionsObject.right) ) {
				this.opts.moveDir.forward = 1;
			}

			this.opts.moveDir.error = 0;

			// help for gamer
			if ( restrictionsObject['forward-left'] && !restrictionsObject['forward-right'] && !restrictionsObject['right'] && restrictionsObject['forward-left'].distance && restrictionsObject['forward-left'].distance < consts.hero.collisionError ) {
				// move hero to the right on collision length
				this.opts.moveDir.error = restrictionsObject['forward-left'].distance;
			}
			if ( restrictionsObject['forward-right'] && !restrictionsObject['forward-left'] && !restrictionsObject['left'] && restrictionsObject['forward-right'].distance && restrictionsObject['forward-right'].distance < consts.hero.collisionError ) {
				// move hero to the right on collision length
				this.opts.moveDir.error = restrictionsObject['forward-right'].distance;
			}
		}

		return Hero;
	}
);
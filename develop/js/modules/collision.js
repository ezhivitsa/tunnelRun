define([
		'three',

		'consts',
		'dataSource'
	],
	function(THREE, consts, DataSource) {
		'use strict';

		var nextSegment = null,
			currentSegmentPosition = null,
			distance = 0,
			collisions = [];

		var caster = new THREE.Raycaster();

		function Collision() {

			this.rays = {
				forward: new THREE.Vector3(0, 0, -1),
				bottom: {
					right: [ new THREE.Vector3(1, 0, 0),
							new THREE.Vector3(0.93, 0, 0.67),
							new THREE.Vector3(0.98, 0, 0.31) ],
					left: [ new THREE.Vector3(-1, 0, 0),
							new THREE.Vector3(-0.93, 0, 0.67),
							new THREE.Vector3(-0.98, 0, 0.31) ],
					'forward-right': [ new THREE.Vector3(0.31, 0, -0.98),
										new THREE.Vector3(0.67, 0, -0.93),
										new THREE.Vector3(0.93, 0, -0.67),
										new THREE.Vector3(0.98, 0, -0.31) ],
					'forward-left': [ new THREE.Vector3(-0.31, 0, -0.98),
										new THREE.Vector3(-0.67, 0, -0.93),
										new THREE.Vector3(-0.93, 0, -0.67),
										new THREE.Vector3(-0.98, 0, -0.31) ]
				},
				right: {
					right: [ new THREE.Vector3(0, 1, 0),
							new THREE.Vector3(0, 0.93, 0.67),
							new THREE.Vector3(0, 0.98, 0.31) ],
					left: [ new THREE.Vector3(0, -1, 0),
							new THREE.Vector3(0, -0.93, 0.67),
							new THREE.Vector3(0, -0.98, 0.31)],
					'forward-right': [ new THREE.Vector3(0, 0.31, -0.98),
										new THREE.Vector3(0, 0.67, -0.93),
										new THREE.Vector3(0, 0.93, -0.67),
										new THREE.Vector3(0, 0.98, -0.31) ],
					'forward-left': [ new THREE.Vector3(0, -0.31, -0.98),
										new THREE.Vector3(0, -0.67, -0.93),
										new THREE.Vector3(0, -0.93, -0.67),
										new THREE.Vector3(0, -0.98, -0.31) ]
				},
				top: {
					left: [ new THREE.Vector3(1, 0, 0),
							new THREE.Vector3(0.93, 0, 0.67),
							new THREE.Vector3(0.98, 0, 0.31) ],
					right: [ new THREE.Vector3(-1, 0, 0),
							new THREE.Vector3(-0.93, 0, 0.67),
							new THREE.Vector3(-0.98, 0, 0.31) ],
					'forward-left': [ new THREE.Vector3(0.31, 0, -0.98),
										new THREE.Vector3(0.67, 0, -0.93),
										new THREE.Vector3(0.93, 0, -0.67),
										new THREE.Vector3(0.98, 0, -0.31) ],
					'forward-right': [ new THREE.Vector3(-0.31, 0, -0.98),
										new THREE.Vector3(-0.67, 0, -0.93),
										new THREE.Vector3(-0.93, 0, -0.67),
										new THREE.Vector3(-0.98, 0, -0.31) ]
				},
				left: {
					left: [ new THREE.Vector3(0, 1, 0),
							new THREE.Vector3(0, 0.93, 0.67),
							new THREE.Vector3(0, 0.98, 0.31) ],
					right: [ new THREE.Vector3(0, -1, 0),
							new THREE.Vector3(0, -0.93, 0.67),
							new THREE.Vector3(0, -0.98, 0.31)],
					'forward-left': [ new THREE.Vector3(0, 0.31, -0.98),
										new THREE.Vector3(0, 0.67, -0.93),
										new THREE.Vector3(0, 0.93, -0.67),
										new THREE.Vector3(0, 0.98, -0.31) ],
					'forward-right': [ new THREE.Vector3(0, -0.31, -0.98),
										new THREE.Vector3(0, -0.67, -0.93),
										new THREE.Vector3(0, -0.93, -0.67),
										new THREE.Vector3(0, -0.98, -0.31) ]
				}
			};
		};

		var obstacleCollision = function(mesh, obstacles, ray, eventParam) {
			if (!(ray instanceof Array)) {
				ray = [ray];
			}
			var collision = null;
			for (var i in ray) {
				caster.set(mesh.position.clone(), ray[i].clone().normalize());
				collision = caster.intersectObjects(obstacles)[0];
				if (collision && collision.distance <= ray[i].length()) {
					!(collisions.filter(function(element) {
						return element.name === eventParam;
					}).length) && collisions.push({ name: eventParam, distance: consts.hero.radius - Math.abs(ray[i].x ? ray[i].x : ray[i].y) });
					return true;
				}
			}
			return false;
		};

		Collision.prototype.currentPosition = function() {
			caster.set(this.hero.mesh.position, this.rays.forward);

			nextSegment = caster.intersectObjects(this.meshs)[0];
			distance = nextSegment.distance;
			currentSegmentPosition = this.meshs.indexOf(nextSegment.object) + 1;

			this.updated = false;
		};

		Collision.prototype.init = function(segments, diff, hero) {
			var self = this;
			this.segments = segments;
			this.meshs = [];

			this.diff = diff;
			this.hero = hero;
			this.updated = true;

			for (var i in this.segments) {
				this.meshs.push(this.segments[i].mesh);
			}

			DataSource.addEvent(document, 'restart', function() {
				self.updated = true;
			});
		};

		Collision.prototype.getCurrentSegment = function(force) {
			force && this.currentPosition();
			return this.segments[currentSegmentPosition];
		};

		Collision.prototype.getDistance = function(force) {
			force && this.currentPosition();
			return distance;
		};

		Collision.prototype.segmentCollision = function() {
			var borderX = this.meshs[currentSegmentPosition].position.x + consts.segmentSize.width / 2,
				borderY = this.meshs[currentSegmentPosition].position.y + consts.segmentSize.height / 2,
				direction = null;

			if (Math.abs(this.hero.mesh.position.x) + consts.hero.radius > borderX) {
				direction = this.hero.mesh.position.x > 0 ? (this.hero.opts.lastPos == 'bottom' ? 'right' : 'left') : (this.hero.opts.lastPos == 'bottom' ? 'left' : 'right');
				!(collisions.filter(function(element) {
						return element.name === direction;
					}).length) && collisions.push({ name: direction, distance: 0 });
			} else if (Math.abs(this.hero.mesh.position.y) + consts.hero.radius > borderY) {
				fireEvent.direction = this.hero.mesh.position.y > 0 ? (this.hero.opts.lastPos == 'right' ? 'right' : 'left') : (this.hero.opts.lastPos == 'right' ? 'left' : 'right');
				!(collisions.filter(function(element) {
						return element.name === direction;
					}).length) && collisions.push({ name: direction, distance: 0 });
			}
		}

		Collision.prototype.runCollision = function() {
			if (this.hero.opts.lastPos != this.hero.opts.nextPos) {
				self.updated = true;
				return;
			}
			obstacleCollision(this.hero.mesh, this.meshs[currentSegmentPosition].children, this.rays.forward, 'forward');

			for (var key in this.rays[this.hero.opts.lastPos]) {
				obstacleCollision(this.hero.mesh, this.meshs[currentSegmentPosition].children, this.rays[this.hero.opts.lastPos][key], key);
			}

			var obstacleIteration = 0;
			switch (this.hero.opts.lastPos) {
				case 'right':
					obstacleIteration = consts.obstacleOptions.width - 1;
					break;
				case 'top':
					obstacleIteration = (consts.obstacleOptions.width - 1) * 2;
					break;
				case 'left':
					obstacleIteration = (consts.obstacleOptions.width - 1) * 3;
			}

			if (this.segments[currentSegmentPosition].blockMatrix[obstacleIteration] == 2) {
				DataSource.triggerEvent(document, 'hero.abyss-die');
			}
		};

		Collision.prototype.runCollisionWhenChangePosition = function (ray, approximateDisplacement) {
			var positions = [this.hero.mesh.position.clone(), this.hero.mesh.position.clone(), this.hero.mesh.position.clone()],
				heroCollisions = [],
				collision = null,
				intersectObject = null;

			var nextSegmentPosition = currentSegmentPosition ? (currentSegmentPosition - 1) : self.meshs.length - 1;

			positions[0].z -= consts.hero.radius;
			positions[2].z += consts.hero.radius;
			
			positions.forEach(function (pos, index) {
				pos.z += approximateDisplacement;
				caster.set(pos, ray.clone().normalize());

				collision = caster.intersectObjects(this.meshs[currentSegmentPosition].children)[0];
				collision = collision || caster.intersectObjects(this.meshs[nextSegmentPosition].children)[0];

				if (collision && collision.distance <= ray.length()) {
					// debugger;
					heroCollisions[index] = true;
					intersectObject = collision.object;
				}
			}, this);

			return {
				heroCollisions: heroCollisions,
				intersectObject: intersectObject
			};
		};

		Collision.prototype.abyssDetector = function() {
			if (this.hero.opts.lastPos != this.hero.position.nextPos) {
				return;
			}
		}

		Collision.prototype.update = function() {
			var self = this;

			DataSource.addAnimation(function(delta, now) {
				collisions = [];
				self.updated && self.currentPosition();

				distance -= self.diff.get('speed') * delta - self.hero.increaseZ;
				if (distance < 0.1) {
					distance += consts.segmentSize.depth;
					// for (var i = 0; i < 4; i++) {
					// 	self.meshs[currentSegmentPosition].material.materials[i].wireframe = false;
					// }
					currentSegmentPosition = currentSegmentPosition ? (currentSegmentPosition - 1) : self.meshs.length - 1;
					// for (var i = 0; i < 4; i++) {
					// 	self.meshs[currentSegmentPosition].material.materials[i].wireframe = true;
					// }
				}

				//self.segmentCollision();
				self.runCollision();

				self.hero.removeRestrictions();
				if (collisions.length != 0) {
					self.hero.setRestrictions(collisions);
					//var fireEvent = new Event('hero-stop');
					//fireEvent.direction = collisions;
					//document.dispatchEvent(fireEvent);
				}
			});
		};

		return Collision;
	}
);
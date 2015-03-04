define([
		'three',

		'consts',
		'dataSource'
	],
	function(THREE, consts, DataSource) {
		'use strict';

		var nextSegment = null,
			currentSegmentPosition = null,
			distance = 0;

		var caster = new THREE.Raycaster();

		function Collision() {

			this.rays = {
				forward: new THREE.Vector3(0, 0, -1),
				horizontal: {
					right: new THREE.Vector3(1, 0, 0),
					left: new THREE.Vector3(-1, 0, 0),
					'forward-right': new THREE.Vector3(1, 0, -1),
					'forward-left': new THREE.Vector3(-1, 0, -1)
				},
				vertical: {
					up: new THREE.Vector3(0, 1, 0),
					down: new THREE.Vector3(0, -1, 0),
					'forward-up': new THREE.Vector3(0, 1, -1),
					'forward-down': new THREE.Vector3(0, -1, -1)
				}
			};
		};

		var obstacleCollision = function(position,obstacles,ray,event) {
			caster.set(position, ray);
			var collision = caster.intersectObjects(obstacles)[0];
			// console.log(collision)
			if (collision && collision.distance <= consts.hero.radius) {
				var fireEvent = new Event(event);
				document.dispatchEvent(fireEvent);
				return true;
			}
			return false;
		};

		Collision.prototype.currentPosition = function() {
			caster.set(this.hero.mesh.position, this.rays.forward);

			nextSegment =caster.intersectObjects(this.meshs)[0];
			distance = nextSegment.distance;
			currentSegmentPosition = this.meshs.indexOf(nextSegment.object) + 1;

			this.updated = false;
		};

		Collision.prototype.init = function(segments, diff, hero) {
			this.segments = segments;
			this.meshs = [];

			this.diff = diff;
			this.hero = hero;
			this.updated = true;

			for (var i in this.segments) {
				this.meshs.push(this.segments[i].mesh);
			}

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
			var borderX = this.meshs[currentSegmentPosition].position.x + consts.segmentSize.width/2,
				borderY = this.meshs[currentSegmentPosition].position.y + consts.segmentSize.height/2;
			if (Math.abs(this.hero.mesh.position.x) + consts.hero.radius > borderX ) {
				var fireEvent = new Event(this.hero.mesh.position.x > 0 ? 'hero.stop-right' :'hero.stop-left');
				document.dispatchEvent(fireEvent);
			} else if (Math.abs(this.hero.mesh.position.y) + consts.hero.radius > borderY ) {
				var fireEvent = new Event(this.hero.mesh.position.y > 0 ? 'hero.stop-up' :'hero.stop-down');
				document.dispatchEvent(fireEvent);
			}
		}

		Collision.prototype.runCollision = function () {
			if (this.hero.position.lastPos != this.hero.position.nextPos) {
				return;
			}

			if (obstacleCollision(this.hero.mesh.position,this.meshs[currentSegmentPosition].children,this.rays.forward,'hero.stop-forward')) {
				return;
			}

			var plane = (this.hero.position.lastPos == 'top' || this.hero.position.lastPos == 'bottom') ? 'horizontal' : 'vertical';

			for (var key in this.rays[plane]) {
				if (obstacleCollision(this.hero.mesh.position,this.meshs[currentSegmentPosition].children,this.rays[plane][key],'hero.stop-' + key)) {
					return;
				}
			}

			var obstacleIteration = 0;
			switch(this.hero.position.lastPos) {
				case 'right':
					obstacleIteration = consts.obstacleOptions.width - 1;
					break;
				case 'top': 
					obstacleIteration = (consts.obstacleOptions.width - 1) * 2;
					break;
				case 'left':
					obstacleIteration = (consts.obstacleOptions.width - 1) * 3;
			}

			if (this.segments[currentSegmentPosition].blockMatrix[obstacleIteration]==2) {
				var fireEvent = new Event('hero.abyss-die');
				document.dispatchEvent(fireEvent);
			}

		};

		Collision.prototype.abyssDetector = function() {
			if (this.hero.position.lastPos != this.hero.position.nextPos) {
				return;
			}
		}

		Collision.prototype.update = function() {
			var self = this;

			DataSource.addAnimation(function(delta, now) {
				self.updated && self.currentPosition();

				distance -= self.diff.get('speed') * delta;
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

				self.segmentCollision();
				self.runCollision();
			});
		};

		return Collision;
	}
);
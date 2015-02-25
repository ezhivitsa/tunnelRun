define([
	'three',

	'consts',
	'dataSource'
], 
	function (THREE, consts, DataSource) {
		'use strict';

		function Collision() {
			this.caster = new THREE.Raycaster();

			this.rays = {
				forward: new THREE.Vector3(0, 0, -1),
				right: new THREE.Vector3(1, 0, 0),
				left: new THREE.Vector3(-1, 0, 0),
				top: new THREE.Vector3(0, 1, 0),
				bottom: new THREE.Vector3(0, -1, 0)
			}
		};

		Collision.prototype.currentPosition = function () {
			this.caster.set(this.hero.position, this.rays.forward);

			var collisions = this.caster.intersectObjects(this.meshs);

			// console.log(collisions);
		};

		Collision.prototype.init = function(segments, hero) {
			this.segments = segments;
			this.meshs = [];

			this.hero = hero;

			for (var i in this.segments) {
				this.meshs.push(this.segments[i].mesh);
			}

		};

		Collision.prototype.update = function () {		
			var self = this;
			DataSource.addAnimation(function () {				
				self.currentPosition();
			});	
		};

		return Collision;
	}
);
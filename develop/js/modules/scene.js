define([
	'three'
],
	function (THREE) {
		'use strict';

		var MAX_SPEED = 30,
			MIN_SPEED = 5;

		function Scene (renderer, camera, obstacle) {
			this.renderer = renderer;
			this.camera = camera;
			this.obstacle = obstacle;

			// Init scene
			this.scene = new THREE.Scene();	

			this.segments = [];
			this.diff = 0.1;
			this.iteration = 0;
			this.speed = MIN_SPEED;
		};

		Scene.prototype.init = function () {
			this.camera.lookAt(this.scene.position);

			// Init controls
			this.controls = new THREE.TrackballControls(this.camera);

			this.ambientLight = new THREE.AmbientLight(0x202020);
			this.spotLight = new THREE.SpotLight( 0xffffff );
			this.spotLight.position.set( 0, 20, 80);
			this.spotLight.castShadow = true;
			// this.spotLight.shadowDarkness = 0.5;
			// this.spotLight.shadowCameraNear	= 0.01;
			// this.spotLight.shadowCameraFov	= 45;
			// this.spotLight.shadowCameraFar	= 250;
			// this.spotLight.shadowCameraVisible	= false;
			// this.spotLight.shadowBias	= 0.00;
			// this.spotLight.shadowDarkness	= 0.6;
			// this.spotLight.shadowMapWidth = 4096;
			// this.spotLight.shadowMapHeight = 4096;
			// this.spotLight.shadowCameraVisible = true;
		};

		Scene.prototype.render = function () {
			for (var i = 0; i < this.segments.length; i++)
				(function (seg, diff) {
					seg.mesh.position.y = 3;
					seg.mesh.position.z = -380 + i*11.99;
					seg.mesh.receiveShadow = true;

				})(this.segments[i], this.diff);			

			this.scene.add(this.ambientLight); 

			this.scene.add(this.spotLight);
		};

		Scene.prototype.animate = function (animation) {
			var self = this;

			animation.addAction(function (delta, now) {
				self.updateControls.call(self, delta, now);
				self.updateSegments.call(self, delta, now);
			});
		};

		Scene.prototype.updateControls = function (delta, now) {
			this.controls.update();
		};

		Scene.prototype.updateSegments = function (delta, now) {
			for (var i = 0; i < this.segments.length; i++) {
				this.iteration++;

				if ( this.iteration > 100000 ) {
					( this.diff < 1 ) && ( this.diff += 0.1 );
					( this.speed < MAX_SPEED ) && ( this.speed += 1 );

					this.iteration = 0;
				}

				(function (segment, pos, speed, diff, self, delta) {
					if ( Math.floor(pos.z + speed) < (395 - 380) ) {
						pos.z += speed * delta;
					}
					else {
						pos.z += -395 + speed * delta;
						segment.generateMatrix(diff)
						self.obstacle.refreshSegment( segment.mesh, segment.blockMatrix );
					}
				})(this.segments[i], this.segments[i].mesh.position, this.speed / 100, this.diff, this, delta);
			}

			this.renderer.render(this.scene, this.camera);
		};

		Scene.prototype.get = function () {
			return this.scene;
		};

		Scene.prototype.addSegment = function (segment) {
			this.segments.push(segment);
			segment.generateMatrix(this.diff);
			this.obstacle.addToSegment( segment.mesh, segment.blockMatrix );

			this.scene.add(segment.mesh);
		};

		Scene.prototype.addHero = function (hero) {
			this.hero = hero;
			this.scene.add(hero.mesh);
		};

		return Scene;
	}
);
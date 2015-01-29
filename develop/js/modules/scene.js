define([
	'three',
	'stats'
],
	function (THREE, Stats) {
		'use strict';

		var SPEED = 0.1;

		function Scene (renderer, camera) {
			this.renderer = renderer;
			this.camera = camera;

			// Init scene
			this.scene = new THREE.Scene();	

			this.segments = [];
		};

		Scene.prototype.init = function () {
			this.camera.lookAt(this.scene.position);

			this.stats = new Stats();
			this.stats.setMode(0); // 0: fps, 1: ms

			// align top-left
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';

			// Init controls
			this.controls = new THREE.TrackballControls(this.camera);

			this.ambientLight = new THREE.AmbientLight(0x202020);
			this.spotLight = new THREE.SpotLight( 0xffffff );
			this.spotLight.position.set( 0, 10, 60);
			this.spotLight.castShadow = true;
		};

		Scene.prototype.render = function () {			

			document.body.appendChild( this.stats.domElement );

			for (var i = 0; i < this.segments.length; i++) {
				this.segments[i].position.y = 3;
				this.segments[i].position.z = -380 + i*6;
				this.segments[i].receiveShadow = true;
			}

			this.scene.add(this.ambientLight); 

			this.scene.add(this.spotLight);
		};

		Scene.prototype.animate = function () {
			var self = this;
			this.stats.begin();

			this.controls.update();
			// Animate 
			for (var i = 0; i < this.segments.length; i++) {
				// if (segments[i].position.z + step == (400 - 380)) {
				// 	step = 0;
				// 	console.log(segments[i].position.z);
				// }
				this.segments[i].position.z += Math.floor(this.segments[i].position.z + SPEED) != (402 - 380) ? SPEED : -402 + SPEED;
			}


			this.renderer.render(this.scene, this.camera);
			this.stats.end();
			requestAnimationFrame(function () {
				self.animate.apply(self, arguments);
			});
		};

		Scene.prototype.get = function () {
			return this.scene;
		};

		Scene.prototype.addSegment = function (segment) {
			this.segments.push(segment);
			this.scene.add(segment);
		};

		return Scene;
	}
);
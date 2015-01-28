define([
	'three'
],
	function (THREE) {
		'use strict';

		function Scene (renderer, camera) {
			this.renderer = renderer;
			this.camera = camera;

			// Init scene
			this.scene = new THREE.Scene();

			this.segments = [];
		};

		Scene.prototype.init = function () {
			camera.lookAt(scene.position);

			// Init controls
			this.controls = new THREE.TrackballControls(camera);
		};

		Scene.prototype.render = function () {
			this.controls.update();
			renderer.render(scene, camera);
		};

		Scene.prototype.animate = function () {
			requestAnimationFrame(this.render);
		};

		Scene.prototype.get = function () {
			return this.scene;
		};

		Scene.prototype.addSegment = function (segment) {
			this.segments.push(segment);
			this.
		};

		return scene;
	}
);
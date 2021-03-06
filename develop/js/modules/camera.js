define([
	'three'
], 
	function (THREE) {
		'use strict';

		function Camera(fov, width, height, near, far) {
			this.camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
		};
		
		Camera.prototype.setPosition = function (x, y, z) {
			this.camera.position.x = x || 0;
			this.camera.position.y = y || 0;
			this.camera.position.z = z || 0;
		};

		Camera.prototype.get = function () {
			return this.camera;
		};

		return Camera;
	}
);
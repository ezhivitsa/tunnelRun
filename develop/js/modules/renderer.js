define([
	'three'
], 
	function (THREE) {
		'use strict';

		function Renderer(canvasElement, width, height) {
			this.renderer = new THREE.WebGLRenderer({
				antialias: true
			});
			this.renderer.setClearColor(0xeeeeee);
			
			this.renderer.setSize(width, height);
			renderer.shadowMapEnabled = true;
			canvasElement.appendChild(renderer.domElement);
		}

		Renderer.prototype.render = function () {
			this.renderer.render(this.scene, scene.camera);
		}

		return Renderer;
	}
);
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
			this.renderer.shadowMapEnabled = true;
			canvasElement.appendChild(this.renderer.domElement);
		}

		Renderer.prototype.get = function () {
			return this.renderer;
		};

		return Renderer;
	}
);
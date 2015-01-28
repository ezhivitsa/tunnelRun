define([
		'three',

		'scene',
		'renderer',
		'camera'
	],
	function(THREE, Scene, Renderer, Camera) {
		var pageSize = {
				width: window.innerWidth - 10,
				height: window.innerHeight - 20
			},
			canvasElement = document.getElementById("WebGLCanvas");

		var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
			camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 1000),
			scene = new Scene(renderer.get(), camera.get());

		camera.setPosition(0, 0, 11);

		scena.init();
		scena.animate();
	}
);
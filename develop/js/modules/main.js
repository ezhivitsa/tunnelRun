define([
		'three',
		'trackballControls',
		'projector',

		'scene',
		'renderer'
	],
	function(THREE, TrackballControls, Projector, Scene, Renderer) {
		THREE.TrackballControls = TrackballControls;

		var pageSize = {
				width: window.innerWidth - 10,
				height: window.innerHeight - 20
			},
			canvasElement = document.getElementById("WebGLCanvas");

		var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
			scene = new Scene(renderer);

		Scena.init();
		Scena.start();
	}
);
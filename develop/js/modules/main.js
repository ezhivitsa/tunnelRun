define([
		'three',
		'projector',
		'trackballControls',

		'scene',
		'renderer',
		'camera',
		'segment',
		'hero'
	],
	function(THREE, Projector, TrackballControls, Scene, Renderer, Camera, Segment, Hero) {
		'use strict';

		var pageSize = {
				width: window.innerWidth - 10,
				height: window.innerHeight - 20
			},
			heroSize = {
				redius: 5,
				widthSegments: 100,
				heightSegments: 100
			},
			canvasElement = document.getElementById("WebGLCanvas");

		var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
			camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 1000),
			scene = new Scene(renderer.get(), camera.get()),
			hero = new Hero(heroSize);

		camera.setPosition(0, 0, 11);

		scene.init();

		var NUMOFSEGMENT = 67;
		for (var i = 0; i < NUMOFSEGMENT; i++) {
			scene.addSegment( new Segment() );
		}
		scene.addHero(hero);
		scene.render();
		scene.animate();
	}
);
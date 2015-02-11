define([
		'three',
		'projector',
		'trackballControls',

		'dataSource',
		'scene',
		'renderer',
		'camera',
		'segment',
		'hero',
		'difficulty'
	],
	function(THREE, Projector, TrackballControls, DataSource, Scene, Renderer, Camera, Segment, Hero, Difficulty) {
		'use strict';

		var diff = new Difficulty();

		THREE.DefaultLoadingManager.onLoad = function (  ) {

			var pageSize = {
					width: window.innerWidth - 10,
					height: window.innerHeight - 20
				},
				segmentOptions = {
					width: 24,
					height: 24,
					depth: 12
				},
				canvasElement = document.getElementById("WebGLCanvas");

			var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
				camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 700),
				scene = new Scene(renderer.get(), camera.get(), diff),
				hero = new Hero(diff);

			camera.setPosition(0, 0, 11);

			scene.init();

			var NUMOFSEGMENT = 33;
			for (var i = 0; i < NUMOFSEGMENT; i++) {
				scene.addSegment( new Segment(segmentOptions) );
			}
			scene.addHero(hero);
			scene.render();

			scene.animate();
			hero.animate();
			diff.update();

			DataSource.startAnimation();
		};
	}
);
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
		'difficulty',
		'collision'
	],
	function(THREE, Projector, TrackballControls, DataSource, Scene, Renderer, Camera, Segment, Hero, Difficulty, Collision) {
		'use strict';

		var diff = new Difficulty();

		THREE.DefaultLoadingManager.onLoad = function (  ) {

			var pageSize = {
					width: 1024,
					height: 768
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
				hero = new Hero(diff),
				collision = new Collision();

			camera.setPosition(0, 0, 11);

			scene.init();

			var NUMOFSEGMENT = 33;
			for (var i = 0; i < NUMOFSEGMENT; i++) {
				scene.addSegment( new Segment(segmentOptions) );
			}
			scene.addHero(hero);
			scene.render();

			collision.init(scene.getSegments(),diff,hero);

			scene.animate();
			hero.animate();
			diff.update();

			collision.update();

			DataSource.startAnimation();
		};
	}
);
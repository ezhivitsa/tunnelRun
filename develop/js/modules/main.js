define([
		'three',
		'projector',
		'trackballControls',

		'scene',
		'renderer',
		'camera',
		'segment',
		'hero',
		'animation',
		'difficulty'
	],
	function(THREE, Projector, TrackballControls, Scene, Renderer, Camera, Segment, Hero, Animation, Difficulty) {
		'use strict';

		var diff = new Difficulty();

		var animation = new Animation();

		THREE.DefaultLoadingManager.onLoad = function (  ) {

			var pageSize = {
					width: window.innerWidth - 10,
					height: window.innerHeight - 20
				},
				heroSize = {
					radius: 1,
					widthSegments: 20,
					heightSegments: 20
				},
				segmentOptions = {
					width: 24,
					height: 24,
					depth: 12
				},
				// obstacleOptions = {
				// 	width: segmentOptions.width / 2,
				// 	depth: segmentOptions.depth / 2
				// },
				canvasElement = document.getElementById("WebGLCanvas");

			var animation = new Animation();

			var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
				camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 500),
				scene = new Scene(renderer.get(), camera.get(), diff),
				hero = new Hero(heroSize, diff);

			camera.setPosition(0, 0, 11);

			scene.init();

			var NUMOFSEGMENT = 33;
			for (var i = 0; i < NUMOFSEGMENT; i++) {
				scene.addSegment( new Segment(segmentOptions) );
			}
			scene.addHero(hero);
			scene.render();
			scene.animate(animation);
			hero.animate(animation);
			diff.update(animation);

			animation.start();
		};
	}
);
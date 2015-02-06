define([
		'three',
		'projector',
		'trackballControls',

		'scene',
		'renderer',
		'camera',
		'segment',
		'hero',
		// 'obstacle',
		'animation',
		'difficulty'
	],
	function(THREE, Projector, TrackballControls, Scene, Renderer, Camera, Segment, Hero, /*Obstacle,*/ Animation, Difficulty) {
		'use strict';

		var pageSize = {
				width: window.innerWidth - 10,
				height: window.innerHeight - 20
			},
			heroSize = {
				radius: 1,
				widthSegments: 20,
				heightSegments: 20
			},
			segmentSize = {
				width: 24,
				height: 24,
				depth: 12
			},
			canvasElement = document.getElementById("WebGLCanvas");

		var diff = new Difficulty();

		var animation = new Animation();

		var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
			camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 1000),
			//obstacle = new Obstacle( segmentSize.width / 2, segmentSize.depth / 2 ),
			scene = new Scene(renderer.get(), camera.get(), diff),
			hero = new Hero(heroSize, diff);

		camera.setPosition(0, 0, 11);

		scene.init();

		var NUMOFSEGMENT = 33;
		for (var i = 0; i < NUMOFSEGMENT; i++) {
			scene.addSegment( new Segment(segmentSize) );
		}
		scene.addHero(hero);
		scene.render();
		scene.animate(animation);
		hero.animate(animation);
		diff.update(animation);

		animation.start();
	}
);
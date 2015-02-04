define([
		'three',
		'projector',
		'trackballControls',

		'scene',
		'renderer',
		'camera',
		'segment',
		'hero',
		'obstacle'
	],
	function(THREE, Projector, TrackballControls, Scene, Renderer, Camera, Segment, Hero, Obstacle) {
		'use strict';

		var mainTexture = THREE.ImageUtils.loadTexture('/img/8416969.jpg');

		THREE.DefaultLoadingManager.onLoad = function (  ) {
			console.log( arguments );

			mainTexture.wrapS = THREE.RepeatWrapping;
			mainTexture.wrapT = THREE.RepeatWrapping;

			var pageSize = {
					width: window.innerWidth - 10,
					height: window.innerHeight - 20
				},
				heroSize = {
					radius: 1,
					widthSegments: 100,
					heightSegments: 100
				},
				segmentOptions = {
					width: 24,
					height: 24,
					depth: 12,
					texture: mainTexture
				},
				obstacleOptions = {
					width: segmentOptions.width / 2,
					depth: segmentOptions.depth / 2,
					texture: mainTexture
				},
				canvasElement = document.getElementById("WebGLCanvas");

			var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height),
				camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 1000),
				obstacle = new Obstacle( obstacleOptions ),
				scene = new Scene(renderer.get(), camera.get(), obstacle),
				hero = new Hero(heroSize);

			camera.setPosition(0, 0, 11);

			scene.init();

			var NUMOFSEGMENT = 33;
			for (var i = 0; i < NUMOFSEGMENT; i++) {
				scene.addSegment( new Segment(segmentOptions) );
			}
			scene.addHero(hero);
			scene.render();
			scene.animate();
		};
	}
);
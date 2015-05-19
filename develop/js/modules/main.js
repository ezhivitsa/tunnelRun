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
		'collision',
		'userInterface'
	],
	function(THREE, Projector, TrackballControls, DataSource, Scene, Renderer, Camera, Segment, Hero, Difficulty, Collision, Interface) {
		'use strict';

		var diff = new Difficulty();

		THREE.DefaultLoadingManager.onLoad = function (  ) {

			var pageSize = {
					width: 1024,
					height: 630
				},
				segmentOptions = {
					width: 24,
					height: 24,
					depth: 12
				},
				canvasElement = document.getElementById("WebGLCanvas");


			var renderer = new Renderer(canvasElement, pageSize.width, pageSize.height);

			renderer.renderer.domElement.style.opacity = 0;

			var camera = new Camera(75, pageSize.width, pageSize.height, 0.1, 700),
				scene = new Scene(renderer.get(), camera.get(), diff),
				collision = new Collision(),
				hero = new Hero({ diff: diff, collision: collision }),
				ui = new Interface(renderer.renderer.domElement,diff);

			camera.setPosition(0, 0, 11);

			scene.init(renderer.renderer.domElement);

			var NUMOFSEGMENT = 33;
			for (var i = 0; i < NUMOFSEGMENT; i++) {
				scene.addSegment( new Segment(segmentOptions) );
			}
			scene.addHero(hero);
			scene.render();

			collision.init(scene.getSegments(),diff,hero);

			scene.animate();
			diff.update();

			hero.move();
			collision.update();
		};
	}
);
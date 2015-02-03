define([
	'three',
	'stats'
],
	function (THREE, Stats) {
		'use strict';

		var MAX_SPEED = 30,
			MIN_SPEED = 10;

		function Scene (renderer, camera, obstacle) {
			this.renderer = renderer;
			this.camera = camera;
			this.obstacle = obstacle;

			// Init scene
			this.scene = new THREE.Scene();	

			this.segments = [];
			this.diff = 0;
			this.iteration = 0;
			this.speed = MIN_SPEED;
		};

		Scene.prototype.init = function () {
			this.camera.lookAt(this.scene.position);

			this.stats = new Stats();
			this.stats.setMode(0); // 0: fps, 1: ms

			// align top-left
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';

			// Init controls
			this.controls = new THREE.TrackballControls(this.camera);

			this.ambientLight = new THREE.AmbientLight(0x202020);
			this.spotLight = new THREE.SpotLight( 0xffffff );
			this.spotLight.position.set( 0, 10, 60);
			this.spotLight.castShadow = true;
		};

		Scene.prototype.render = function () {			

			document.body.appendChild( this.stats.domElement );

			for (var i = 0; i < this.segments.length; i++)
				(function (seg, diff) {
					seg.mesh.position.y = 3;
					seg.mesh.position.z = -380 + i*11.99;
					seg.mesh.receiveShadow = true;

				})(this.segments[i], this.diff);			

			this.scene.add(this.ambientLight); 

			this.scene.add(this.spotLight);
		};

		Scene.prototype.animate = function () {
			var self = this;
			this.stats.begin();

			this.controls.update();
			// Animate 
			for (var i = 0; i < this.segments.length; i++) {
				this.iteration++;

				if ( this.iteration > 1000 ) {
					( this.diff < 1 ) && ( this.diff += 0.1 );
					( this.speed < MAX_SPEED ) && ( this.speed += 1 );

					this.iteration = 0;
				}

				(function (segment, pos, speed, diff) {
					if ( Math.floor(pos.z + speed) < (395 - 380) ) {
						pos.z += speed;
					}
					else {
						pos.z += -395 + speed;
						segment.generateMatrix(diff)
						self.obstacle.refreshSegment( segment.mesh, segment.blockMatrix );
					}
				})(this.segments[i], this.segments[i].mesh.position, this.speed / 100, this.diff);
			}


			this.renderer.render(this.scene, this.camera);
			this.stats.end();
			requestAnimationFrame(function () {
				self.animate.apply(self, arguments);
			});
		};

		Scene.prototype.get = function () {
			return this.scene;
		};

		Scene.prototype.addSegment = function (segment) {
			this.segments.push(segment);
			segment.generateMatrix(this.diff);
			this.obstacle.addToSegment( segment.mesh, segment.blockMatrix );

			this.scene.add(segment.mesh);
		};

		Scene.prototype.addHero = function (hero) {
			this.hero = hero;
			this.scene.add(hero.mesh);
		};

		return Scene;
	}
);
define([
		'three',

		'dataSource',
		'consts',
		'obstacle'
	],
	function(THREE, DataSource, consts, Obstacle) {
		'use strict';

		var back = THREE.ImageUtils.loadTexture(consts.theme.magma.back);
		back.minFilter = THREE.LinearFilter;

		function Scene(renderer, camera, diff) {
			this.renderer = renderer;
			this.camera = camera;
			this.obstacle = new Obstacle(consts.obstacleOptions);
			this.diff = diff;

			// Init scene
			this.scene = new THREE.Scene();

			this.segments = [];
		};

		Scene.prototype.init = function(canvasElement) {
			this.canvasElement = canvasElement;
			this.camera.lookAt(this.scene.position);
			this.camera.position.y = 2;

			// Init controls
			this.controls = new THREE.TrackballControls(this.camera,this.canvasElement);

			this.ambientLight = new THREE.AmbientLight(0x202020);
			this.spotLight = new THREE.SpotLight(0xffffff);
			this.spotLight.position.set(0, 20, 80);
			this.spotLight.castShadow = consts.enableShadow;

			// this.currrentSegment = null;
			// this.spotLight.shadowDarkness = 0.5;
			// this.spotLight.shadowCameraNear	= 0;
			// this.spotLight.shadowCameraFov	= 45;
			// this.spotLight.shadowCameraFar	= 250;
			// this.spotLight.shadowCameraVisible	= false;
			// this.spotLight.shadowBias	= 0.00;
			// this.spotLight.shadowDarkness	= 0.6;
			// this.spotLight.shadowMapWidth = 4096;
			// this.spotLight.shadowMapHeight = 4096;
			// this.spotLight.shadowCameraVisible = true;

			var sphereGeometry = new THREE.SphereGeometry(300, 32, 32),
				sphereMaterial = new THREE.MeshBasicMaterial({
					map: back,
					side: THREE.DoubleSide
				}),
				sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

			sphere.position.z = -250;

			this.scene.add(sphere);
			this.eventControl('on');
		};

		Scene.prototype.eventControl = function(action) {
			var self = this;

			if (action === 'on') {
				action = 'addEvent';
			} else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				heroPosition: function(event) {
					var camX = -2 / 11,
						camY = -2 / 11;

					self.camera.position.x = event.heroPosition.x * camX;
					self.camera.position.y = event.heroPosition.y * camY;
				},
				reinit: function() {
					self.canvasElement.style.opacity = 0;

					for (var i = 0; i < self.segments.length; i++) {
						(function(segment, pos, diff, self) {
							pos.z = -380 + i * (consts.segmentSize.depth - 0.01);
							segment.generateMatrix(diff);
							self.obstacle.refreshSegment(segment.mesh, segment.blockMatrix);
						})(self.segments[i], self.segments[i].mesh.position, self.diff.get('diff'), self);
					}

					self.canvasElement.style.opacity = 1;
				}
			};

			DataSource[action](document, ':hero-position', this.events.heroPosition)[action](document, 'restart', this.events.reinit);
		};

		Scene.prototype.render = function() {
			for (var i = 0; i < this.segments.length; i++)
				(function(seg, diff) {
					// seg.mesh.position.y = 3;
					seg.mesh.position.z = -380 + i * (consts.segmentSize.depth - 0.01);
					seg.mesh.receiveShadow = consts.enableShadow;

				})(this.segments[i], this.diff);

			this.scene.add(this.ambientLight);

			this.scene.add(this.spotLight);

			// var axes = new THREE.AxisHelper(50);
			// this.scene.add(axes);
		};

		Scene.prototype.animate = function() {
			var self = this;
			DataSource.addAnimation(function(delta, now) {
				self.updateControls.call(self, delta, now);
				self.updateSegments.call(self, delta, now);
			});
		};

		Scene.prototype.updateControls = function(delta, now) {
			this.controls.update();
		};

		Scene.prototype.updateSegments = function(delta, now) {
			for (var i = 0; i < this.segments.length; i++) {
				(function(segment, pos, speed, diff, self, delta) {
					if (Math.floor(pos.z + speed) < (395 - 380)) {
						pos.z += speed * delta;
					} else {
						pos.z += -395 + speed * delta;
						segment.generateMatrix(diff);
						self.obstacle.refreshSegment(segment.mesh, segment.blockMatrix);
					}
				})(this.segments[i], this.segments[i].mesh.position, this.diff.get('speed'), this.diff.get('diff'), this, delta);
			}

			this.renderer.render(this.scene, this.camera);
		};

		Scene.prototype.get = function() {
			return this.scene;
		};

		Scene.prototype.getSegments = function() {
			return this.segments;
		};

		Scene.prototype.addSegment = function(segment) {
			this.currentSegment = this.currentSegment || segment;

			this.segments.push(segment);
			segment.generateMatrix(this.diff.get('diff'));
			this.obstacle.addToSegment(segment.mesh, segment.blockMatrix);

			this.scene.add(segment.mesh);
		};

		Scene.prototype.addHero = function(hero) {
			this.hero = hero;
			this.scene.add(hero.mesh);
		};

		return Scene;
	}
);
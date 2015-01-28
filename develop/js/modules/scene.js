define(["three"], function(THREE) {

	function Scene (renderer) {
		this.renderer = renderer;

		// Init scene
		this.scene = new THREE.Scene();
	}

	Scene.prototype.init = function () {

		// Init camera
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 11;
		this.camera.rotation.y = -Math.PI / 4;
		this.camera.lookAt(this.scene.position);

		// Init controls
		this.controls = new THREE.TrackballControls(this.camera);
	};

	var renderer = null;

	var scene = {
		scene: null,
		camera: null,
		controls: null,
		init: function() {
			// Init scene
			this.scene = new THREE.Scene();

			// Init camera
			

			// Init controls
			this.controls = new THREE.TrackballControls(this.camera);
		},
		start: function() {

			// Add Box
			var wall = THREE.ImageUtils.loadTexture('../../img/Brickwall_texture.jpg'),
				ceiling = THREE.ImageUtils.loadTexture('../../img/Flagstone1.png'),
				floor = THREE.ImageUtils.loadTexture('../../img/kt_rot_4_fade2_drk.jpg');

			wall.wrapS = THREE.RepeatWrapping;
			wall.wrapT = THREE.RepeatWrapping;
			wall.repeat.set(80, 4);
			floor.wrapS = THREE.RepeatWrapping;
			floor.wrapT = THREE.RepeatWrapping;
			floor.repeat.set(4, 80);
			ceiling.wrapS = THREE.RepeatWrapping;
			ceiling.wrapT = THREE.RepeatWrapping;
			ceiling.repeat.set(4, 80);

			var materials = [
				new THREE.MeshLambertMaterial({
					map: wall,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				}),
				new THREE.MeshLambertMaterial({
					map: wall,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				}),
				new THREE.MeshLambertMaterial({
					map: ceiling,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				}),
				new THREE.MeshLambertMaterial({
					map: floor,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				}),
				new THREE.MeshLambertMaterial({
					map: wall,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				}),
				new THREE.MeshLambertMaterial({
					map: wall,
					side: THREE.DoubleSide,
					depthWrite: false,
					combine: THREE.MixOperation,
					transparent: true,
					opacity: 1
				})
			];

			var boxGeometry = new THREE.BoxGeometry(20, 20, 400),
				boxMaterial = new THREE.MeshFaceMaterial(materials),
				box = new THREE.Mesh(boxGeometry, boxMaterial);
			box.position.y = 3;
			box.position.z = -180;
			box.receiveShadow = true;
			this.scene.add(box);

			var cubeGeometry = new THREE.BoxGeometry(5, 2, 2),
				cubeMaterial = new THREE.MeshLambertMaterial({
					color: 0x00ff00
				}),
				cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cube.position.y = -4;
			cube.position.z = -20;
			cube.position.x = 9;
			cube.castShadow = true;
			cube.rotation.y = Math.PI / 2;
			this.scene.add(cube);

			var cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cube2.position.y = 12;
			cube2.position.z = -100;
			cube2.position.x = 5;
			cube2.castShadow = true;
			this.scene.add(cube2);

			var cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cube3.position.y = 9;
			cube3.position.z = -13;
			cube3.position.x = -9;
			cube3.rotation.z = Math.PI / 2;
			cube3.castShadow = true;
			this.scene.add(cube3);

			// Add axes
			var axes = new THREE.AxisHelper(50);
			this.scene.add(axes);

			// Add light
			var ambientLight = new THREE.AmbientLight(0x202020, 1);
			this.scene.add(ambientLight);

			var spotLight = new THREE.SpotLight(0xffffff);
			spotLight.position.set(0, 50, 40);
			spotLight.castShadow = true;
			this.scene.add(spotLight);

			this.render();
		},
		// Rerendering function
		render: function() {
			this.controls.update();
			renderer.render(this.scene, scene.camera);
			requestAnimationFrame(this.scene.renderScene);
		}
	};
	return scene;
});
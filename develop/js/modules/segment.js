define([
	'three'
], 
	function (THREE) {
		'use strict';

		var WIDTH = 24,
			HEIGHT = 24,
			DEPTH = 6;

		var wallTexture = THREE.ImageUtils.loadTexture('/img/Brickwall_texture.jpg'),
			ceilingTexture = THREE.ImageUtils.loadTexture('/img/Flagstone1.png'),
			floorTexture = THREE.ImageUtils.loadTexture('/img/kt_rot_4_fade2_drk.jpg');

		wallTexture.wrapS = THREE.RepeatWrapping;
		wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.repeat.set(1,4);
		floorTexture.wrapS = THREE.RepeatWrapping;
		floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(4,1);
		ceilingTexture.wrapS = THREE.RepeatWrapping;
		ceilingTexture.wrapT = THREE.RepeatWrapping;
		ceilingTexture.repeat.set(4,1);

		var materials = [
			new THREE.MeshLambertMaterial({
				map: wallTexture,
				side: THREE.BackSide
			}),
			new THREE.MeshLambertMaterial({
				map: wallTexture,
				side: THREE.BackSide
			}),
			new THREE.MeshLambertMaterial({
				map: ceilingTexture,
				side: THREE.BackSide
			}),
			new THREE.MeshLambertMaterial({
				map: floorTexture,
				side: THREE.BackSide
			}),
			new THREE.MeshLambertMaterial({
				map: wallTexture,
				side: THREE.BackSide,
				transparent: true, 
				opacity: 0
			}),
			new THREE.MeshLambertMaterial({
				map: wallTexture,
				side: THREE.BackSide,
				transparent: true, 
				opacity: 0
			})
		];

		function Segment() {
			this.geometry =  new THREE.BoxGeometry( WIDTH, HEIGHT, DEPTH );
			this.material = new THREE.MeshFaceMaterial( materials );
			this.mesh = new THREE.Mesh(this.geometry, this.material);
		}

		Segment.prototype.get = function () {
			return this.mesh;
		};

		return Segment;
	}
);
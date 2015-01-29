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

		var MATRIX_SIZE = 44;

		function Segment () {
			this.geometry =  new THREE.BoxGeometry( WIDTH, HEIGHT, DEPTH );
			this.material = new THREE.MeshFaceMaterial( materials );
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.blockMatrix = [];
			this.blockNumber = MATRIX_SIZE;
		};

		Segment.prototype.generateMatrix = function (diff) {
			// diff [0, 1]

			// generating abysses
			var randNum = Math.random(),
				abyssNum = 0,
				sizes = [ 0, 1, 2, 3 ];

			if ( 1 - 0.4*diff <= randNum && randNum < 0.2*diff ) {
				abyssNum = 1;
			}
			else if ( 0.2*diff <= randNum && randNum < 0.05*diff ) {
				abyssNum = 2;
			}
			else if ( 0.05*diff <= randNum && randNum <= 1 ) {
				abyssNum = 3;
			}

			for ( var i = 0; i < abyssNum; i++ ) {
				var randSide = sizes[Math.floor(Math.random() * sizes.length)];

				for ( var j = 11*randSide; j < 11*(randSide + 1); j++ ) {
					this.blockMatrix = 2;
				}
				this.blockNumber -= 10;
			}

			// generation passages
			
			// for ( var i = 0; i < MATRIX_SIZE; i++ ) {

			// }
		};

		Segment.prototype.get = function () {
			return this.mesh;
		};

		return Segment;
	}
);
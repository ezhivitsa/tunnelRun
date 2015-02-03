define([
	'three'
], 
	function (THREE) {
		'use strict';

		var wallTexture = THREE.ImageUtils.loadTexture('/img/Brickwall_texture.jpg'),
			ceilingTexture = THREE.ImageUtils.loadTexture('/img/Flagstone1.png'),
			floorTexture = THREE.ImageUtils.loadTexture('/img/8416969.jpg');

		wallTexture.wrapS = THREE.RepeatWrapping;
		wallTexture.wrapT = THREE.RepeatWrapping;
		wallTexture.repeat.set(2,4);
		floorTexture.wrapS = THREE.RepeatWrapping;
		floorTexture.wrapT = THREE.RepeatWrapping;
		floorTexture.repeat.set(4,2);
		ceilingTexture.wrapS = THREE.RepeatWrapping;
		ceilingTexture.wrapT = THREE.RepeatWrapping;
		ceilingTexture.repeat.set(4,2);

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

		var SIDE_LINES = 11,
			SIDES = 4,
			MATRIX_SIZE = SIDE_LINES * SIDES;

		var PASS = 1,
			ABYSS = 2;

		function Segment (options) {
			this.geometry =  new THREE.BoxGeometry( options.width, options.height, options.depth );
			this.material = new THREE.MeshFaceMaterial( materials );
			this.mesh = new THREE.Mesh(this.geometry, this.material);
		};

		Segment.prototype.generateMatrix = function (diff) {
			this.blockMatrix = [];
			this.blockNumber = MATRIX_SIZE;

			// diff [0, 1]

			// generating abysses
			var randNum = Math.random(),
				abyssNum = 0,
				sides = [];

			for ( var i = 0; i < SIDES; i++ ) {
				sides.push(i);
			}

			if ( 1 - 0.4*diff <= randNum && randNum < 1 - 0.2*diff ) {
				abyssNum = 1;
			}
			else if ( 1 - 0.2*diff <= randNum && randNum < 1 - 0.05*diff ) {
				abyssNum = 2;
			}
			else if ( 1 - 0.05*diff <= randNum && randNum <= 1 ) {
				abyssNum = 3;
			}

			for ( var i = 0; i < abyssNum; i++ ) {
				var sideNum = Math.floor(Math.random() * sides.length),
					randSide = sides[sideNum];
				sides.splice(sideNum, 1);

				for ( var j = SIDE_LINES*randSide; j < SIDE_LINES*(randSide + 1) - 1; j++ ) {
					this.blockMatrix[j] = ABYSS;
				}
				this.blockNumber -= (SIDE_LINES - 1);
			}

			// generation passages
			var passPerSide = Math.floor(SIDE_LINES*Math.pow(Math.random()*0.875 + 0.01, diff*8/3 + 1/3));
			( !passPerSide ) && ( passPerSide = 1 );

			var matrixPositions = [];
			for ( i = 0; i < MATRIX_SIZE; i++ ) {
				if ( this.blockMatrix[i] != ABYSS ) {
					matrixPositions.push(i);
				}
			}

			var randomPos = 0;
			for ( i = 0; i < passPerSide * (SIDES - abyssNum); i++ ) {
				var pos = Math.floor(Math.random() * matrixPositions.length);
				randomPos = matrixPositions[pos];
				this.blockMatrix[randomPos] = PASS;

				matrixPositions.splice(pos, 1);
			}

			return this.blockMatrix;
		};

		Segment.prototype.get = function () {
			return this.mesh;
		};

		return Segment;
	}
);
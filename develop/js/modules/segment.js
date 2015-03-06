define([
	'three',
	'consts'
], 
	function (THREE, consts) {
		'use strict';

		var boxTexture = THREE.ImageUtils.loadTexture(consts.theme.magma.maintexture);
		boxTexture.wrapS = THREE.RepeatWrapping;
		boxTexture.wrapT = THREE.RepeatWrapping;

		var emissive = consts.theme.ice.segmentEmissive;

		var wallTexture = null;

		var floorWallTexture = null;

		var materials = null;

		var SIDE_LINES = 11,
			SIDES = 4,
			MATRIX_SIZE = SIDE_LINES * SIDES;

		var PASS = 1,
			ABYSS = 2;

		var isPosssibleToAddPass = function (array) {
			for ( var i = 0; i < array.length - 1; i++ ) {
				if ( array[i] + 1 === array[i + 1] ) {
					return true;
				}
			}
			return false;
		};

		function Segment (options) {
			this.geometry =  new THREE.BoxGeometry( options.width, options.height, options.depth );

			!wallTexture && ((wallTexture = boxTexture.clone()) &&
			(wallTexture.needsUpdate = true) && 
			wallTexture.repeat.set(2,4));	

			!floorWallTexture && ((floorWallTexture = boxTexture.clone()) &&
			(floorWallTexture.needsUpdate = true) &&
			floorWallTexture.repeat.set(4,2));

			!materials && (materials = [
				new THREE.MeshLambertMaterial({
					map: wallTexture,
					// color: 0xbe34ba,
					side: THREE.BackSide,
					opacity: 0,
					emissive: emissive
				}),
				new THREE.MeshLambertMaterial({
					map: wallTexture,
					// color: 0xbe34ba,
					side: THREE.BackSide,
					opacity: 0,
					emissive: emissive
				}),
				new THREE.MeshLambertMaterial({
					map: floorWallTexture,
					// color: 0xbe34ba,
					side: THREE.BackSide,
					opacity: 0,
					emissive: emissive
				}),
				new THREE.MeshLambertMaterial({
					map: floorWallTexture,
					// color: 0xbe34ba,
					emissive: emissive,
					side: THREE.BackSide,
					opacity: 0,
					// wireframe: true
				}),
				new THREE.MeshLambertMaterial({
					transparent: true, 
					opacity: 0
				}),
				new THREE.MeshLambertMaterial({
					transparent: true, 
					opacity: 0
				})
			]);		

			this.material = new THREE.MeshFaceMaterial( materials );
			this.mesh = new THREE.Mesh(this.geometry, this.material.clone());

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
			var passPerSide = Math.floor(SIDE_LINES * Math.pow(Math.random()*0.875 + 0.01, diff*8/3 + 1/3));
			if ( !passPerSide || passPerSide === 1 ) {
				passPerSide = 2;
			}

			var arrayPositions = [];
			for ( i = 0; i < MATRIX_SIZE; i++ ) {
				if ( this.blockMatrix[i] != ABYSS ) {
					var prevNum = (i - 1 + MATRIX_SIZE) % MATRIX_SIZE,
						nextNum = (i + 1) % MATRIX_SIZE;

					if ( this.blockMatrix[prevNum] == ABYSS && this.blockMatrix[nextNum] ) {
						this.blockMatrix[i] = 1;
					}
					else {
						arrayPositions.push(i);
					}
				}
			}

			var randomPos = 0;
			for ( i = 0; i < passPerSide * (SIDES - abyssNum); i++ ) {
				var pos = Math.floor(Math.random() * arrayPositions.length);
				randomPos = arrayPositions[pos];
				this.blockMatrix[randomPos] = PASS;

				arrayPositions.splice(pos, 1);
				
				if ( this.addNearPass(randomPos, arrayPositions) ) {
					i++;
				}
			}

			return this.blockMatrix;
		};

		Segment.prototype.addNearPass = function (pos, arrayPositions) {
			var newPos = null;
			// if ( pos % SIDE_LINES === 0 ) {
			// 	// pos - position of the first line on the side
			// 	if ( !this.blockMatrix[pos + 1] ) {
			// 		newPos = pos + 1;
			// 	}
			// }
			// else if ( pos % (SIDE_LINES - 1) !== 0 ) {
			// 	// pos - position of the last line on the side
			// 	if ( !this.blockMatrix[pos - 1] ) {
			// 		newPos = pos - 1;
			// 	}
			// }
			// else {
				// pos - position between first and last lines
				var prevPos = (pos - 1 + consts.obstacleOptions.matrixSize) % consts.obstacleOptions.matrixSize,
					nextPos = (pos + 1) % consts.obstacleOptions.matrixSize;
				if ( !this.blockMatrix[prevPos] && !this.blockMatrix[nextPos] ) {
					if ( Math.random() < 0.5 ) {
						newPos = prevPos;
					}
					else {
						newPos = nextPos;
					}
				}
			//}

			if ( newPos ) {
				var p = arrayPositions.indexOf(newPos);
				arrayPositions.splice(p, 1);
				this.blockMatrix[newPos] = PASS;
				return true;
			}
			return false;
		};

		Segment.prototype.get = function () {
			return this.mesh;
		};

		return Segment;
	}
);
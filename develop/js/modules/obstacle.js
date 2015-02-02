define(['three'], function(THREE) {
	'use strict';

	// Init geometries and materials
	var magma = THREE.ImageUtils.loadTexture('/img/lava.png'),		
		planeMaterial1 = new THREE.MeshLambertMaterial({
			map: magma,
			side: THREE.DoubleSide
		}),
		planeMaterial2 = new THREE.MeshBasicMaterial({
			color: 0x000000,
			side: THREE.Doubleside
		}),
		cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

	function Obstacle(vSize,hSize,map) {
		this.vSize = vSize;
		this.hSize = hSize;
		this.map = map;
		this.planeGeometry = new THREE.PlaneGeometry( this.vSize * 2, this.hSize * 2 );
	}

	Obstacle.prototype.addToSegment = function(segment) {

		// Init vars for cycle working
		var iteration = 0,
			blockLength = 0,
			holder = null,
			count = 0;
		
		while(iteration < this.map.length) {
			if (this.map[iteration]) {
				if (this.map[iteration] == 2) {
					iteration+=(this.vSize-1);
					holder = this.addPlane( Math.floor(iteration/(this.vSize-1)), segment.position.z, "ob_" + count );
					count++;
					segment.add(holder);
				} else if (blockLength != 0) {
					holder = addCube( Math.floor(iteration/(this.vSize-1)), iteration%(this.vSize-1) , blockLength, segment.position.z, "ob_" + count);
					blockLength=0;
					count++;
					segment.add(holder);
				}
				iteration++;
			} else {
				if ((iteration+1)%(this.vSize-1) != 0) {
					blockLength++;
				} else {
					holder = addCube( Math.floor(iteration/(this.vSize-1)), iteration%(this.vSize-1) , blockLength, segment.position.z, "ob_" + count);
					blockLength=0;
					count++;
					segment.add(holder);
				}
				iteration++;
			}
		}

		return segment;
	};

	Obstacle.prototype.addPlane = function(location,zPos,serialNumber) {
		var plane = null;

		switch(location) {
			case 0: 
				plane = new THREE.Mesh(this.planeGeometry,planeMaterial1);
				plane.rotation.x = -Math.PI/2;
				plane.position.y = -(this.vSize - 0.1);
				break;
			case 1:
				plane = new THREE.Mesh(this.planeGeometry,planeMaterial1);
				plane.rotation.z = Math.PI/2;
				plane.rotation.y = -Math.PI/2;
				plane.position.x = (this.vSize - 0.1);
				break;
			case 2:
				plane = new THREE.Mesh(this.planeGeometry,planeMaterial2);
				plane.rotation.x = Math.PI/2;
				plane.position.y = (this.vSize - 0.1);
				break;
			default:
				plane = new THREE.Mesh(this.planeGeometry,planeMaterial1);
				plane.rotation.z = -Math.PI/2;
				plane.rotation.y = -Math.PI/2;
				plane.position.x = -(this.vSize - 0.1);
		}

		plane.position.z = zPos;								
		planer.name = serialNumber;

		return plane;
	};

	Obstacle.prototype.addCube = function (location,pos,length,zPos,serialNumber) {
		var figure = null;

		switch(location) {
			case 0:
				figure = new THREE.Mesh(new THREE.BoxGeometry( 2 * length, 2, 2 ),cubeMaterial);
				figure.position.y = -(this.vSize-1);
				figure.position.x = -this.vSize + length + (pos - length + 1) * 2;
				break;
			case 1:
				figure = new THREE.Mesh(new THREE.BoxGeometry( 2 , 2 * length, 2 ),cubeMaterial);
				figure.position.y = -this.vSize + length + (pos - length + 1) * 2;
				figure.position.x = (this.vSize-1);
				break;
			case 2:
				figure = new THREE.Mesh(new THREE.BoxGeometry( 2 * length, 2, 2 ),cubeMaterial);
				figure.position.y = (this.vSize-1);
				figure.position.x = this.vSize - length - (pos - length + 1) * 2;
				break;
			default:
				figure = new THREE.Mesh(new THREE.BoxGeometry( 2 , 2 * length, 2 ),cubeMaterial);
				figure.position.y = this.vSize - length - (pos - length + 1) * 2;
				figure.position.x = -(this.vSize-1);
		}
		figure.position.z = zPos;
		figure.name = serialNumber;
		figure.castShadow = true;

		return figure;
	};
});
define(['three'], function(THREE) {
	'use strict';

	var cubeTexture = THREE.ImageUtils.loadTexture('/img/8416969.jpg');
	cubeTexture.wrapS = THREE.RepeatWrapping;
	cubeTexture.wrapT = THREE.RepeatWrapping;


	function Obstacle(options) {
		this.vSize = options.width;
		this.hSize = options.height;
	}

	Obstacle.prototype.addToSegment = function(segment, map) {
		// Init vars for cycle working
		var iteration = 0,
			blockLength = 0,
			holder = null,
			count = 0,
			sidePos = 0;

		while (iteration < map.length) {
			sidePos = Math.floor(iteration / (this.vSize - 1));
			if (map[iteration]) {
				if (map[iteration] == 2) {
					console.log(sidePos,iteration)
					segment.material.materials[sidePos == 0 ? 3 : sidePos == 1 ? 0 : sidePos == 2 ? 2 : 1].transparent = true;
					iteration += (this.vSize - 2);
					// count++;
					// segment.add(holder);
					continue;
				} else if (blockLength != 0) {
					holder = this.addFigure(sidePos, iteration % (this.vSize - 1), blockLength, "ob_" + count);
					blockLength = 0;
					count++;
					segment.add(holder);
				}
				iteration++;
			} else {
				if ((iteration + 1) % (this.vSize - 1) != 0) {
					blockLength++;
				} else {
					holder = this.addFigure(sidePos, this.vSize - 1, blockLength + 1, "ob_" + count);
					blockLength = 0;
					count++;
					segment.add(holder);
				}
				iteration++;
			}
		}
		console.log(segment)

		segment.myObstacleCount = count;

		return segment;
	};

	Obstacle.prototype.refreshSegment = function(segment, map) {
		console.log(map);

		for (var i = 0; i < segment.myObstacleCount; i++) {
			segment.remove(segment.getObjectByName('ob_' + i));
			for(var j = 0; j < 4; j++) {
				segment.material.materials[j].transparent = false;
			}
		}
		this.addToSegment(segment, map);

		return segment;
	};

	Obstacle.prototype.addFigure = function(location, pos, length, serialNumber) {
		var figure = null;


		var cubeTextureClone = cubeTexture.clone();
		cubeTextureClone.needsUpdate = true;

		var	cubeMaterial = new THREE.MeshLambertMaterial({ map: cubeTextureClone });
		// var	cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x004793 });

		switch (location) {
			case 0:
				cubeMaterial.map.repeat.set(length,1);
				figure = new THREE.Mesh(new THREE.BoxGeometry(2 * length, 2, 2), cubeMaterial);
				figure.position.y = -(this.vSize - 1);
				figure.position.x = -this.vSize + length + (pos - length + 1) * 2;
				break;
			case 1:
				cubeMaterial.map.repeat.set(1,length);
				figure = new THREE.Mesh(new THREE.BoxGeometry(2, 2 * length, 2), cubeMaterial);
				figure.position.y = -this.vSize + length + (pos - length + 1) * 2;
				figure.position.x = (this.vSize - 1);
				break;
			case 2:
				cubeMaterial.map.repeat.set(length,1);
				figure = new THREE.Mesh(new THREE.BoxGeometry(2 * length, 2, 2), cubeMaterial);
				figure.position.y = (this.vSize - 1);
				figure.position.x = this.vSize - length - (pos - length + 1) * 2;
				break;
			default:
				cubeMaterial.map.repeat.set(1,length);
				figure = new THREE.Mesh(new THREE.BoxGeometry(2, 2 * length, 2), cubeMaterial);
				figure.position.y = this.vSize - length - (pos - length + 1) * 2;
				figure.position.x = -(this.vSize - 1);
		}

		var chance = Math.random();
		if (chance < 0.25) {

		}
		figure.position.z = ((chance < 0.25) ? 0 : (chance < 0.5) ? -2 : (chance < 0.75) ? -1 : -3);
		figure.name = serialNumber;
		figure.castShadow = true;

		return figure;
	};

	return Obstacle;
});
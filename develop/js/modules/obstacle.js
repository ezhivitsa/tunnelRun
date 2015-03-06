define(['three', 'consts', 'figure'], function(THREE, consts, Figure) {
	'use strict';

	var cubeTexture = THREE.ImageUtils.loadTexture(consts.theme.magma.maintexture);
	cubeTexture.wrapS = THREE.RepeatWrapping;
	cubeTexture.wrapT = THREE.RepeatWrapping;

	var figureOptions = consts.figureOptions,
		figureFactory = null;

	function Obstacle(options) {
		this.vSize = options.width;
		this.hSize = options.height;

		!figureOptions.texture && (figureOptions.texture = cubeTexture);

		!figureFactory && ((figureFactory = new Figure(figureOptions)) &&
		figureFactory.generate());
	}

	Obstacle.prototype.addToSegment = function(segment, map) {
		// Init vars for cycle working
		var iteration = 0,
			blockLength = 0,
			holder = null,
			count = 0,
			sidePos = 0;
		while (iteration < consts.obstacleOptions.matrixSize) {
			sidePos = Math.floor(iteration / (this.vSize - 1));
			if (map[iteration]) {
				if (map[iteration] == 2) {
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

		segment.myObstacleCount = count;

		return segment;
	};

	Obstacle.prototype.refreshSegment = function(segment, map) {
		for (var i = 0; i < segment.myObstacleCount; i++) {
			segment.remove(segment.getObjectByName('ob_' + i));
			for (var j = 0; j < 4; j++) {
				segment.material.materials[j].transparent = false;
			}
		}
		this.addToSegment(segment, map);

		return segment;
	};

	Obstacle.prototype.addFigure = function(location, pos, length, serialNumber) {
		var figure = null;

		switch (location) {
			case 0:
				figure = figureFactory.getHorizontal(length);
				figure.position.y = -(this.vSize - 1);
				figure.position.x = -this.vSize + length + (pos - length + 1) * 2;
				break;
			case 1:
				figure = figureFactory.getVertical(length);
				figure.position.y = -this.vSize + length + (pos - length + 1) * 2;
				figure.position.x = (this.vSize - 1);
				break;
			case 2:
				figure = figureFactory.getHorizontal(length);
				figure.position.y = (this.vSize - 1);
				figure.position.x = this.vSize - length - (pos - length + 1) * 2;
				break;
			default:
				figure = figureFactory.getVertical(length);
				figure.position.y = this.vSize - length - (pos - length + 1) * 2;
				figure.position.x = -(this.vSize - 1);
		}

		var chance = Math.random();
		figure.position.z = ((chance < 0.25) ? 0 : (chance < 0.5) ? -2 : (chance < 0.75) ? -1 : -3);
		figure.name = serialNumber;
		figure.castShadow = consts.enableShadow;

		return figure;
	};

	return Obstacle;
});
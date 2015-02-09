define(['three'], function(THREE) {
	'use strict';

	var figures = [];

	function Figure(options) {
		this.maxLength = options.maxLength;
		this.pointLength = options.pointLength;
		this.texture = options.texture;
		this.color = options.color;
	}

	Figure.prototype.generate = function() {
		var textureClone = null,
			material = null;

		for (var i = 0; i < this.maxLength; i++) {
			if (this.texture) {
				textureClone = this.texture.clone();
				textureClone.needsUpdate = true;
				textureClone.repeat.set(i + 1, 1);
				material = new THREE.MeshLambertMaterial({
					map: textureClone
				});
			} else {
				material = new THREE.MeshLambertMaterial({
					color: this.color
				});
			}

			figures.push(new THREE.Mesh(new THREE.BoxGeometry(this.pointLength * (i + 1), this.pointLength, this.pointLength), material));
		}
	};

	Figure.prototype.getHorizontal = function(pos) {
		return figures[pos - 1].clone();
	};

	Figure.prototype.getVertical = function(pos) {
		var rez = figures[pos - 1].clone();
		rez.rotation.z += Math.PI / 2;
		return rez;
	};

	return Figure;
});
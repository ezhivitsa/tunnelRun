define([
],
	function () {
		return {
			maxSpeed: 30,
			minSpeed: 10,

			segmentSize: {
				width: 24,
				height: 24,
				depth: 12
			},
			obstacleOptions: {
				width: 12,
				depth: 6
			},

			hero: {
				radius: 1,
				widthSegments: 20,
				heightSegments: 20,
				width: 2,
				height: 2,
				depth: 2
			}
		};
	}
)
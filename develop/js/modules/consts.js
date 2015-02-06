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
			figureOptions: {
				maxLength: 11,
				pointLength: 2,
				color:  0x004793
			}
		};
	}
)
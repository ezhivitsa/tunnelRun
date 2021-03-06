define([
],
	function () {
		return {
			maxSpeed: 30,
			minSpeed: 5,

			buttonsText: {
				play: 'Play',
				restart: 'Restart'
			},

			statusText: {
				standart: 'Press Play to start',
				onGame: 'Your are playing',
				pause: 'Game Paused',
				restart: 'Game Restarted',
				loss: 'Bad luck',
				badInput: 'Enter valid text'
			},

			theme: {
				magma: {
					back: "/img/WP4YLUJW.jpg",
					maintexture: "/img/8416969.jpg",
					segmentEmissive: 0x505050
				},
				ice: {
					back: "/img/cg4.jpg",
					maintexture: "/img/Ice-1.jpg",
					segmentEmissive: 0xffffff
				},
				ice2: {
					back: "/img/galaxy_starfield.png",
					maintexture: "/img/Winterland_Ocean.gif",
					segmentEmissive: 0xffffff
				},
			},
			enableShadow: false,

			segmentSize: {
				width: 24,
				height: 24,
				depth: 12
			},
			obstacleOptions: {
				width: 12,
				depth: 6,
				matrixSize: 44
			},

			hero: {
				radius: 1,
				widthSegments: 20,
				heightSegments: 20,
				width: 2,
				height: 2,
				depth: 2,
				changePositionSpeed: 1,
				movePerFrame: 0.1,
				resumeZSpeed: -0.3,
				minZPos: 0.1,
				collisionError: 0.33
			},

			figureOptions: {
				maxLength: 11,
				pointLength: 2,
				color:  0x004793
			}

		};
	}
)
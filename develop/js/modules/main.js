define([
		'three',
		'scena',
		'trackballControls',
		'projector'
	],
	function(THREE, scena, trackballControls, projector) {
		console.log(projector);

		THREE.TrackballControls = trackballControls;
		console.log(THREE);

		scena.init();
		scena.start();
	}
);
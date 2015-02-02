define([
	'three'
],
	function (THREE) {
		'use strict';

		var BUTTONS = {
			top: {
				// W button
				which: 119,
				handler: function (event) {

				}
			},
			right: {
				// D button
				which: 100,
				handler: function (event) {

				}
			},
			botttom: {
				// S button
				which: 115,
				handler: function (event) {

				}
			},
			left: {
				// A button
				which: 97,
				handler: function (event) {

				}
			},
			moveLeft: {
				// -> button
				which: 37,
				handler: function (event) {

				}
			},
			moveRight: {
				// <- button
				which: 39,
				handler: function (event) {

				}
			}
		};

		function Hero(options) {
			this.geometry =  new THREE.SphereGeometry( options.radius, options.widthSegments, options.heightSegments );
			this.material = new THREE.MeshBasicMaterial({
				color: 0xffff00
			});
			this.mesh = new THREE.Mesh(this.geometry, this.material);

			this.currentPosition = {
				side: 0
			};
		}

		Hero.prototype.eventContol = function (action) {
			if ( action !== 'on' ) {
				action = 'addEventListener';
			}
			else {
				action = 'removeEventListener';
			}

			this.events = this.events || {
				onKeydown: function (event) {
					for ( var button in BUTTONS ) {
						if ( button.which === event.which ) {
							button.handler.call(this, event);
							break;
						}
					}
				}
			};

			document[action]('keydown', onKeydown);
		};

		return Hero;
	}
);
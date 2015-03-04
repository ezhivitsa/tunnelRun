define([
	'stats'
],
	function (Stats) {
		'use strict';

		function startAnimationFrame() {
			var lastTimeMsec = null;

			requestAnimationFrame(function(nowMsec) {
				stats.begin();

				if (!this.pause) {
					startAnimationFrame();
				}

				lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
				lastTimeMsec = nowMsec;

				for (var i = 0; i < animations.length; i++) {
					animations[i](deltaMsec/10, nowMsec/10);
				}
				stats.end();
			});
		}

		var handlers = {},
			animations = [],
			pause = false,
			stats = new Stats();

		stats.setMode(0); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		document.body.appendChild( stats.domElement );

		return {
			addAnimation: function (fn) {
				animations.push(fn);
			},
			removeAnimation: function (fn) {
				if ( !fn ) {
					// remove all animation actions
					animations = [];
				}
				else if ( typeof(fn) === 'function' ) {
					var pos = animations.indexOf(fn);
					animations.splice(pos, 1);
				}
			},
			startAnimation: function () {
				pause = false;
				startAnimationFrame();
			},
			stopAnimation: function () {
				pause = true;
			},

			addEvent: function (elem, event, fn) {
				if ( !handlers[elem] ) {
					handlers[elem] = {};
				}

				if ( !handlers[elem][event] ) {
					handlers[elem][event] = {};
					handlers[elem][event].actions = [];

					handlers[elem][event].dispather = function (e) {
						for ( var i = 0; i < handlers[elem][event].actions.length; i++ ) {
							handlers[elem][event].actions[i].call(elem, e);
						}
					};

					elem.addEventListener(event, handlers[elem][event].dispather);
				}
				handlers[elem][event].actions.push(fn);
			},
			removeEvent: function (elem, event, fn) {
				if ( !event && handlers[elem] ) {
					// remove all events from element
					for ( var e in handlers[elem] ) {
						elem.removeEventListener(e, handlers[elem][e].dispather);
					}

					delete handlers[elem];
					return;
				}

				if ( !fn ) {
					// remove all listeners of the event
					elem.removeEventListener(event, handler[elem][event].dispather);
					delete handler[elem][event];

					if ( !Object.keys(handlers[elem]).length ) {
						delete handlers[elem];
					}

					return;
				}

				var pos = handlers[elem][event].actions.indexOf(fn);
				(pos + 1) && handlers[elem][event].actions.splice(pos, 1);
			}
		};
	}
);
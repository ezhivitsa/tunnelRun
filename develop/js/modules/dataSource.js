define([
],
	function () {
		'use strict';

		var handlers = {},
			animations = [];

		return {
			addAnimation: function (fn) {
				animation.push(fn);
			},
			removeAnimation: function (fn) {
				if ( !fn ) {
					// remove all animation actions
				}
			},
			addEvent: function (elem, event, fn) {
				if ( !handlers[elem] ) {
					handlers[elem] = {};
				}

				if ( !handlers[elem][event] ) {
					handlers[elem][event] = {};
					handlers[elem][event].actions = [];

					handlers[elem][event].dispather = function () {
						for ( var i = 0; i < handlers[elem][event].length; i++ ) {
							handlers[elem][event][i].call(elem, event);
						}
					};

					elem.addEventListener(event, handlers[elem][event].dispather);
				}

				handlers[elem][event].actions.push(fn);
			},
			removeEvent: function (elem, event, fn) {
				if ( !event && handlers[elem] ) {
					// remove all events from element
					for ( var e in handler[elem] ) {
						elem.removeEventListener(e, handlers[elem][e].dispather);
					}

					delete handlers[elem];
					return;
				}

				if ( !fn ) {
					// remove all listeners of the event
					elem.removeEventListener(event, handler[elem][event].dispather);
					delete handler[elem][event];

					if ( !Object.keys(handler[elem]).length ) {
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
define([
	'dataSource',
	'consts'
],
	function (DataSource, consts) {
		'use strict';

		function Interface(element,diff) {
			this.started = false;

			this.diff = diff;

			this.element = element;

			this.button = document.querySelector('#paly-restart-btn');

			this.eventControl('on');
		}

		Interface.prototype.eventControl = function (action) {

			var self = this;

			if (action === 'on') {
				action = 'addEvent';
			} else {
				action = 'removeEvent';
			}

			this.events = this.events || {
				startStop: function(e) {

					e.preventDefault();

					if (!self.started) {
						self.element.style.opacity = 1;
						self.button.innerHTML = consts.buttonsText.restart;
						DataSource.startAnimation();
						self.started = true;
					} else {
						self.diff.init();
						var fireEvent = new Event('restart');
						fireEvent.diff = self.diff;
						document.dispatchEvent(fireEvent);
						DataSource.paused() && DataSource.startAnimation();
					}
				}
			};

			DataSource[action](this.button, 'click', this.events.startStop);
		};

		return Interface;
	}
);
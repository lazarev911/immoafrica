/**
 * Scroller.
 *
 * @access		public
 * @package		View
 * @author		Andrey Lazarev <lazarev911@rambler.ru>
 * @copyright	(c) 2015 Andrey Lazarev
 * @version		1.001 from 12.08.2015
 */

"use strict";

(function($) {

	$.Scroller		    =	{
		viewPortHeight:         0,
		rTimer:                 false,
		selector:               false,
		data:                   {},
		scroller:               {},
		container:              {},
		bar:                    {},
		barTop:                 0,
		scrollerY0:             0,
		drag:                   false,

		_initData:   function(data) {
			return $.extend({
				barOnCls:       '',
				barMinHeight:   20,
				barWidth:       10,
				barPadding:     10,
				barTop:         0,
				barColor:       '#999999',
				scroller:       'scroller',
				wrap:           'scroller-wrapp',
				container:      'scroller-container',
				bar:            'scroller-bar',
				webkitFix:      false
			}, data);
		},

		// Switch on the bar by adding user-defined CSS classname
		_barOn:   function(on) {
			if (on) {
				$(this.bar).addClass(this.data.barOnCls);
			} else {
				$(this.bar).removeClass(this.data.barOnCls);
			}
		},

		_posBar:   function(top, height) {
			var barMinHeight    =   this.data.barMinHeight;

			$(this.bar).css('top', top + 'px');
			if (height !== undefined) {
				if (height > 0 && height < barMinHeight) {
					height = barMinHeight;
				}
				$(this.bar).css({height: height + 'px'});
			}
		},

		// Relation of bar top position to container relative top position
		_k:   function() {
			return this.scroller.clientHeight - this.bar.offsetHeight - (this.data.barTop);
		},

		// Relative container top position to bar top position
		_relToTop:   function(r) {
			return r * this._k() + (this.data.barTop);
		},

		// Bar top position to relative container top position
		_topToRel:   function(t) {
			return (t - this.data.barTop / this._k());
		},

		_dontStartSelect:   function() {
			return false;
		},

		// Text selection preventing on drag
		_selection:   function(on) {
			this._event(document, "selectstart", this._dontStartSelect, on ? 'off' : '');
		},

		// Viewport (re)calculation
		_viewport: function () {
			this.viewPortHeight     =   this.scroller.clientHeight;
		},

		_event:   function (elem, event, func, off) {
			$(elem)[off || 'on'](event, func);
		},

		// Total positions data update, container height dependences included
		_updateScrollBar: function () {
			var containerTop, oldBarHeight,	newBarHeight, height;

			containerTop            =   -(this.scroller.pageYOffset || this.scroller.scrollTop);
			newBarHeight            =   (this.container.offsetHeight != 0) ? this.scroller.clientHeight * this.scroller.clientHeight / this.container.offsetHeight : 0;
			height                  =   this.container.offsetHeight - this.scroller.clientHeight;
			this.barTop             =   (height != 0) ? this._relToTop(-containerTop / height) : 0;

			// We dont need no scrollbat -> making bar 0px height
			if (this.scroller.clientHeight >= this.container.offsetHeight) {
				newBarHeight        =   0;
			}

			// Positioning bar
			if (oldBarHeight !== newBarHeight) {
				this._posBar(this.barTop, newBarHeight);
				oldBarHeight        =   newBarHeight;
			} else {
				this._posBar(this.barTop);
			}

		}
	};


	// data - user defined data, not changed during scroller work
	// Constructor!
	$.Scroller.init =   function (selector, data) {

		this.data       =   this._initData(data);
		var self        =   this;


		// DOM initialization
		var container   =   $(selector).addClass(this.data.container);
		container.wrap("<div class='" + this.data.wrap + "'><div class='" + this.data.scroller + "'></div></div>");
		container.parent().append("<div class='" + this.data.bar + "'></div>");

		this.container  =   $(container, selector)[0];
		this.selector   =   $(container.parent().parent(), selector)[0];
		this.scroller   =   $(container.parent(), selector)[0];
		this.bar        =   $($('.' + this.data.bar), selector)[0];

		// CSS
		$('.' + this.data.wrap).css({
			'position':         'relative',
			'overflow':         'hidden'
		});
		$('.' + this.data.scroller).css({
			'overflow-y':       'scroll'
		});
		$('.' + this.data.container).css({
			'overflow':         'hidden',
			'padding-right':    (this.data.barWidth + this.data.barPadding) + 'px'
		});
		$('.' + this.data.bar).css({
			'position':         'absolute',
			'z-index':          1,
			'right':            0,
			'width':            this.data.barWidth + 'px',
			'background':       this.data.barColor,
			'opacity':          0.5
		});

		// ting webkit bug of horizontal scrolling
		// Can add .scroller::-webkit-scrollbar { width:0; } to css
		if (this.data.webkitFix) {
			$('body').append("<style>.scroller::-webkit-scrollbar { width:0; }</style>");
		}

		// Initialization. Setting scrollbar width BEFORE all other work
		this._barOn(this.scroller.clientHeight < this.container.offsetHeight);
		$(this.scroller).css('width', this.selector.clientWidth + this.scroller.offsetWidth - this.scroller.clientWidth + 'px');

		// Viewport height calculation
		this._viewport();

		// Events initialization onScroll
		this._event(this.scroller, 'scroll', function () {
			self._updateScrollBar();
		});

		// Events initialization Resize
		this._event(window, 'resize', function () {
			// Если новый ресайз произошёл быстро - отменяем предыдущий таймаут
			clearTimeout(this.rTimer);
			// И навешиваем новый
			this.rTimer  =   setTimeout(function () {
				self._viewport();
				self._updateScrollBar();
				self._barOn(self.container.offsetHeight > self.scroller.clientHeight);
			}, 200);
		});

		// Events initialization Drag
		this._event(this.bar, 'mousedown', function(e) {
			e.preventDefault();         // Text selection disabling in Opera... and all other browsers?
			$.Scroller._selection();    // Disable text selection in ie8
			this.drag   =   true;       // Another one byte
		});

		// Enable text selection
		this._event(document, 'mouseup blur', function () {
			$.Scroller._selection(1);
			this.drag   =   false;
		});

		// document, not window, for ie8
		this._event(document, 'mousemove', function (e) {
			if (this.drag) {
				this.scroller.scrollTop = this._topToRel(e.clientY - this.scrollerY0) * (this.container.offsetHeight - this.scroller.clientHeight);
			}
		});

		// document, not window, for ie8
		this._event(document, 'mousedown', function (e) {
			this.scrollerY0 =   e.clientY - this.barTop;
		});

		// First update to initialize bar look
		this._updateScrollBar();

		return this;
	};

})(jQuery);
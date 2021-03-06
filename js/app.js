/**
 * Functions of a project.
 *
 * @access		public
 * @package		View
 * @author		Andrey Lazarev <lazarev911@rambler.ru>
 * @copyright	(c) 2015 Andrey Lazarev
 * @version		1.001 from 04.08.2015
 */

$(document).ready(function() {

	$.Scroller.init('#scroller');

	setTimeout(function() {
		var images      =   [
			{id: "img-layer-34", name: "layer-34.jpg", alt: "slide 1"},
			{id: "img-layer-33", name: "layer-33.jpg", alt: "slide 2"},
			{id: "img-layer-31", name: "layer-31.jpg", alt: "slide 3"},
			{id: "img-ct", name: "ct.jpg", alt: "slide 4"}
		];
		loadImages(images, '/img');
		$(window).on('resize', function() {
			loadImages(images, '/img');
		});

		$(document).foundation();
	} , 0);
});

function loadImages(images, dir) {
	var width   =   $(document).width();
	var prefix  =   '';
	if (width <= 320) {
		prefix  =   '320-';
	} else if (width > 320 && width <= 640) {
		prefix  =   '640-';
	} else if (width > 640 && width <= 1024) {
		prefix  =   '1024-';
	} else if (width > 1025 && width <= 1200) {
		prefix  =   '1200-';
	} else if (width > 1200) {
		prefix  =   '1770-';
	}

	$.each(images, function() {
		var id  =   '#' + this.id;

		if (!$(id).length) {
			$('#orbit-images')
				.append('<li>')
				.find('li:last')
				.append('<img>')
				.find('img')
				.attr('alt', this.alt)
				.attr('id', this.id);
		}

		$(id).attr('src', dir + '/' + prefix + this.name);
	});
}
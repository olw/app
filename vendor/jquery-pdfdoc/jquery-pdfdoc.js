/**
 * jQuery PDF-DOC Plugin
 * 
 * LICENSE
 * 
 * This source file is subject to the Apache Licence, Version 2.0 that is
 * bundled with this package in the file LICENSE.txt. It is also available
 * through the world-wide-web at this URL:
 * http://dev.funkynerd.com/projects/hazaar/wiki/licence If you did not receive
 * a copy of the license and are unable to obtain it through the world-wide-web,
 * please send an email to license@funkynerd.com so we can send you a copy
 * immediately.
 * 
 * @copyright Copyright (c) 2012 Jamie Carl (http://www.funkynerd.com)
 * @license http://dev.funkynerd.com/projects/hazaar/wiki/licence Apache
 *          Licence, Version 2.0
 * @version 0.7
 */

// PDFJS.workerSrc = 'hazaar/js/pdf.js';
PDFJS.disableWorker = true;

(function($) {
	$.fn.PDFDoc = function(options) {
		renderPage = function(pdf, the_page, canvas) {
			// Using promise to fetch the page
			pdf.getPage(the_page).then(function(page) {
				var viewport = page.getViewport((mydoc.width() - 40) / page.getViewport(1.0).width);
				var context = canvas.getContext('2d');

				canvas.height = viewport.height;
				canvas.width = viewport.width;

				page.render({
					canvasContext : context,
					viewport : viewport
				});

				$('#h-page-input').val(the_page);
			});
		};

		var settings = $.extend({
			'page' : 1
		}, options);

		if (!settings.source) {
			$.error('No PDF document source was given');
			return this;
		}

		var mydoc = this;
		var page_count = 0;

		mydoc.addClass('h-pdf-container');

		var timer;
		var canvas_container = $('<div>', {
			'class' : 'h-pdf-canvas-container'
		}).bind('mousewheel', function(event, d, dX, dY) {
			if (d > 0) {
				prev();
			} else {
				next();
			}
			return false;

		}).click(function(event) {
			if (event.offsetX > $(this).width() / 2) {
				next();
			} else {
				prev();
			}
			return false;
		});

		var canvas = $('<canvas>', {
			'class' : 'h-pdf-canvas'
		});

		// ===== Create the toolbar layouts =============================
		var toolbar = $('<div>', {
			'class' : 'h-pdf-toolbar'
		});

		var toolbar_left = $('<div>', {
			'class' : 'h-pdf-toolbar-left'
		});

		var toolbar_right = $('<div>', {
			'class' : 'h-pdf-toolbar-right'
		});

		var toolbar_center = $('<div>').addClass('h-pdf-toolbar-center');

		toolbar.append(toolbar_left).append(toolbar_right).append(toolbar_center);

		mydoc.append(toolbar);

		// ===== Create the nav buttons ================================
		var but_next = $('<div class="h-pdf-button h-pdf-next" title="Next Page"><i class="fa fa-fw fa-chevron-right"></i></div>').click(next);
		var but_prev = $('<div class="h-pdf-button h-pdf-prev" title="Previous Page"><i class="fa fa-fw fa-chevron-left"></i></div>').click(prev);

		function prev() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				timer = null;
				var current_page = mydoc.data('current_page');
				if (current_page > 1) {
					current_page--;
					renderPage(mydoc.data('pdf'), current_page, canvas.get()[0]);
				}
				mydoc.data('current_page', current_page);
			}, 300);
		}

		function next() {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				timer = null;
				var current_page = mydoc.data('current_page');
				if (current_page < page_count) {
					current_page++;
					renderPage(mydoc.data('pdf'), current_page, canvas.get()[0]);
				}
				mydoc.data('current_page', current_page);
			}, 300);
		}

		// ===== Create the page input =================================
		var page_text = $('<span>', {
			'class' : 'h-pdf-pagetext',
			'html' : 'Page:'
		});

		var page_input = $('<input>', {
			'type' : 'text',
			'class' : 'h-pdf-pageinput',
			'value' : settings.page,
			'id' : 'h-page-input'
		});

		page_input.keypress(function(event) {
			if (event.which == 13) {
				current_page = $(this).val();
				renderPage(mydoc.data('pdf'), current_page, canvas.get()[0], mydoc.data('scale'));
				mydoc.data('current_page', current_page);
			} else if ((event.which < 48 || event.which > 57) && (event.which != 8 && event.which != 0)) {
				return false;
			}
		});

		var of_text = $('<span>', {
			'class' : 'h-pdf-pagetext',
			'html' : 'of '
		});

		var pages_text = $('<span>', {
			'class' : 'h-pdf-pagecount',
			'html' : page_count,
			'id' : 'pagecount'
		});

		// ===== Add the * to the center toolbar =======================
		toolbar_center.append($('<div>', {
			'class' : 'h-pdf-toolbar-group'
		}).append(but_prev).append(but_next)).append(page_text).append(page_input).append(of_text).append(pages_text);

		toolbar.append($('<div>', {
			'class' : 'h-pdf-toolbar-center-outer'
		}).append(toolbar_center));

		mydoc.append(canvas_container.append(progress));

		var progress = $('<div>', {
			'class' : 'h-pdf-progress'
		});

		progress.append($('<div>', {
			'class' : 'h-pdf-progress-bar'
		}).append($('<div>', {
			'class' : 'h-pdf-progress-bar-overlay'
		})));

		canvas_container.append(progress);

		PDFJS.getDocument(settings.source).then(function getDocumentCallback(pdf) {
			canvas_container.html(canvas);
			page_count = pdf.numPages;

			$('#pagecount').html(page_count);
			mydoc.data('pdf', pdf);

			renderPage(pdf, settings.page, canvas.get()[0], settings.scale);

		}, function getDocumentError(message, exception) {

		}, function getDocumentProgress(progressData) {
			var pct = 100 * (progressData.loaded / progressData.total);
			progress.children('div').css('width', pct + '%');
		});

		this.data('current_page', settings.page);

		return this;
	};
})(jQuery);

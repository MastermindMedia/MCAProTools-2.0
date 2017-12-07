(function($) {
	$.fn.newsletters_subscribe_form = function() {
		var $form = this, 
			$submit = $form.find(':submit'),
			$fields = $form.find('.newsletters-fieldholder :input'),
			$fieldholders = $form.find('.newsletters-fieldholder'),
			$selectfields = $form.find('select'),
			$filefields = $form.find(':file'),
			$errorfields = $form.find('.has-error'),
			$errors = $form.find('.newsletters-field-error'),
			$wrapper = $form.parent(), 
			$loading = $form.find('.newsletters-loading-wrapper'),
			$scroll = $form.find('input[name="scroll"]'),
			$progress = $form.find('.newsletters-progress'),
			$progressbar = $form.find('.newsletters-progress .progress-bar'),
			$progresspercent = $form.find('.newsletters-progress .sr-only'), 
			$postpageclasses = '.newsletters-management, .entry-content, .post-entry, .entry', 
			$postpagecontainer = $form.closest($postpageclasses);
		
		if ($form.hasClass('newsletters-subscribe-form-ajax')) {
			$form.on('submit', function() {
				
				$($form).trigger('newsletters_subscribe_form_submit');
				
				$loading.show();
				if (typeof $filefields != 'undefined' && $filefields.length > 0) {
					$progress.show();
				}
				
				if (typeof $errors != "undefined") { $errors.slideUp(); }
				if (typeof $errorfields != "undefined") { $errorfields.removeClass('has-error'); }
				$submit.prop('disabled', true);
				$fields.attr('readonly', true);
				
				if ($.isFunction($.fn.select2) && typeof $selectfields != 'undefined' && $selectfields.length > 0) {
					$selectfields.select2('destroy');
					$selectfields.attr('readonly', true);
					$selectfields.select2();
				}
				
				$($form).trigger('newsletters_subscribe_form_submitted');
			});
		}
		
		$fields.on('focus click', function() {
			$(this).removeClass('newsletters_fielderror').nextAll('div.newsletters-field-error').slideUp();	
		});
		
		if ($.isFunction($.fn.select2) && typeof $selectfields != 'undefined' && $selectfields.length > 0) {
			$selectfields.select2();
		}
		
		if (!$form.hasClass('form-inline')) {						
			$postpagecontainer.find($form).find('.newsletters-fieldholder').addClass('col-md-6');
			$postpagecontainer.find($form).find('.newsletters-progress').addClass('col-md-12');
		}
		
		if ($form.hasClass('newsletters-subscribe-form-ajax')) {			
			if ($.isFunction($.fn.ajaxForm)) {
				$form.ajaxForm({
					url: newsletters_ajaxurl + 'action=wpmlsubscribe',
					data: (function() {	
						var formvalues = $form.serialize();							
						return formvalues;
					})(),
					type: "POST",
					cache: false,
					beforeSend: function() {
				        var percentVal = '0%';
				        $progressbar.width(percentVal)
				        $progresspercent.html(percentVal);
				        $($form).trigger('newsletters_subscribe_form_before_ajax');
				    },
				    uploadProgress: function(event, position, total, percentComplete) {
				        var percentVal = percentComplete + '%';
				        $progressbar.width(percentVal)
				        $progresspercent.html(percentVal);
				        $($form).trigger('newsletters_subscribe_form_upload_progress');
				    },
					success: function(response) {	
						if ($('.newsletters-subscribe-form', $('<div/>').html(response)).length > 0) {			
							$wrapper.html($(response).find('.newsletters-subscribe-form'));
						} else {
							$wrapper.html(response);
						}
						
						$wrapper.find('.newsletters-subscribe-form').newsletters_subscribe_form();
						
						if (typeof $scroll != 'undefined' && $scroll.val() == 1) {	
							var targetOffset = ($wrapper.offset().top - 50);
							$('html,body').animate({scrollTop: targetOffset}, 500);
						}
						
						$($form).trigger('newsletters_subscribe_form_success_ajax');
					    
					},
					complete: function(xhr) {
						var percentVal = '100%';
				        $progressbar.width(percentVal)
				        $progresspercent.html(percentVal);
				        
				        $($form).trigger('newsletters_subscribe_form_complete_ajax');
					}
				});
			}
		}
		
		$form.trigger('newsletters_subscribe_form_after_create');
		return $form;
	}
	
	$(function() {
		$('.newsletters-subscribe-form').each( function() {
			$(this).trigger('newsletters_subscribe_form_before_create');
			$(this).newsletters_subscribe_form();
		});
	});
})(jQuery);
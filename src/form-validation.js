$('[wr-type="error"]').hide() // Hide errors
$('.error').removeClass('error') // Remove error state from fields

var formErrors = false

const fieldError = function(field) {
	field.parent().find('[wr-type="error"]').show() // Show error message
  field.addClass('error') // Add error state to this field
  formErrors = true
}

// Click on the Submit button
$('[wr-type="submit"]').click(function() {
  // Check each required field
  $('[wr-type="required-field"]').each(function() {
  	if ($(this).attr('type') === 'checkbox' && !$(this).is(':checked')) { // Checkbox
    	fieldError($(this).siblings('.w-checkbox-input'))
      return
    }
  	if ($(this).val().length === 0) { // If this field is empty
    	fieldError($(this))
    } else if ($(this).attr('type') === 'email' // Validation for email fields
   	  && ( $(this).val().indexOf('@') === -1 || $(this).val().indexOf('.') === -1) ) {
    		fieldError($(this))
    }
  })
  // Submit parent form if there are no errors
  if (!formErrors) $(this).parents('form').submit()
})

// Remove errors from field
$('[wr-type="required-field"], [type="checkbox"]').on('keypress blur', function() {
	$(this).parent().find('.error').removeClass('error')
	$(this).parent().find('[wr-type="error"]').hide()
  formErrors = false
})

// Press Enter
$('input, textarea').keypress(function(e) { 
  if (e.keyCode == 13) {
    e.preventDefault()
    $(this).trigger("change")
    $('[wr-type="submit"]').click()
  }
})

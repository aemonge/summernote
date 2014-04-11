//jQuery( document ).ready(function() {
function _loadedAem () {
	var redactor 	= jQuery('.redactor_.redactor_editor');
	var iframe 		= jQuery('iframe').contents().find('.note-editable');
	console.log('hey', iframe, 'redactor' , redactor);

	iframe.html(redactor.html());
	redactor.hide() ;
}

function _fromBootToReadtor () {
	var redactor 	= jQuery('.redactor_.redactor_editor');
	var iframe 		= jQuery('iframe').contents().find('.note-editable');

	redactor.show();
	console.log(redactor, iframe);
	redactor.html(iframe.html());
}
//});

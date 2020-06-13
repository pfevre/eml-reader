var $ = require('jquery');
require('bootstrap');
const downloadFile = require('save-file');

var params = new window.URLSearchParams(window.location.search);
//console.log(params.get('fx'));
//console.log(params.get('qua'));

$(function() {
	var urlfxqua = 'http://'+params.get('fx')+':4949/'+params.get('qua');
	//console.log('URL to fetch: '+urlfxqua);
	fetchFile(urlfxqua);
	var dropzone = '.dropzone';
	var iframe = '.eml-iframe';
	var downloadPage = '#download-eml';
	var viewPage = '#view-eml';
	var details = '.eml-details';
	var headersContent = '.eml-details__content-headers';
	var attachmentsContent = '.eml-details__content-attachments';

	function fetchFile(url) {

		$.ajax({
			url: '/fetch?urlquarantine='+url,
			processData: false,
			contentType: false,
			type: 'GET',
			success: function (data) {
				$(dropzone).removeClass('dragging');
				$(downloadPage+':visible').slideUp(function(){
					$(viewPage).fadeIn();
				});
				var doc = $(iframe)[0].contentWindow.document;
				$(doc).find('body').html(data.html || '<div style="font-family: courier;">'+data.text.replace(/\r?\n/g, '<br />')+'</div>');
				showDetails({headers: data.headers, attachments: data.attachments})
			}
		});
	}

	function showDetails(data) {
		var headers = data.headers;
		var attachments = data.attachments;

		var headersToDisplay = {'subject':__('subject: '), 'from':__('from: '), 'to':__('to: '), 'cc':__('cc: '), 'date':__('date: '),
					'eml_error':__('This is not a valid eml-file. Please upload a new one!')};
		var headersElements = [];
		for(var headerKey in headersToDisplay) {
			if (headers[headerKey]) {
                               	if (headerKey == 'eml_error') {
                                	var el = document.createElement('div');
                                       	el.setAttribute('id', 'eml_error_header');
                                       	el.appendChild(document.createTextNode(headersToDisplay[headerKey]));
                               	} else {
                                       	var el = document.createElement('div');
                                       	var key = document.createElement('b');
                                       	key.appendChild(document.createTextNode(headersToDisplay[headerKey]));
                                       	var value = document.createElement('span');
                                       	value.appendChild(document.createTextNode(headers[headerKey]));

                                       	el.append(key, value);
                               	}

				headersElements.push(el);
			}
		};
        	$(headersContent).html('').append(headersElements);

		if (attachments && attachments.length > 0) {
			var attachmentsElements = [];
			attachments.forEach(function (attachment) {
				var el = document.createElement('button');
				el.appendChild(document.createTextNode(__('download ') + attachment.fileName));
				el.addEventListener( 'click', function() {
					downloadFile(attachment.content.data, attachment.fileName);
				});
				attachmentsElements.push(el);
			});
			$(attachmentsContent).html('').append(attachmentsElements);
		} else {
			$(attachmentsContent).html(__('No attachments'));
		}

		$(details).show();
	}
});

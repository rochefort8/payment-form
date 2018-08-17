/* ========================================================================
 * Payment form with Stripe/Bootstrap : index.js
 * ========================================================================
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Yuji Ogihara
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ======================================================================== */
'use strict';

$(document).ready(function(){

	// Get stripe public key from server
    $.get('/config')
    .done(function(config) {

	// Create a Stripe client
        var stripe = Stripe(config.stripePublishableKey);

        // Create an instance of Elements
        var elements = stripe.elements();

        // Try to match bootstrap 4 styling
        var style = {
            base: {
                'lineHeight': '1.35',
                'fontSize': '1.11rem',
                'color': '#495057',
                'fontFamily': 'apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif'
            }
        };

        // Card number
        var card = elements.create('cardNumber', {
            'placeholder': '',
            'style': style
        });
        card.mount('#card-number');

        // CVC
        var cvc = elements.create('cardCvc', {
            'placeholder': 'XXX',
            'style': style
        });
        cvc.mount('#card-cvc');

        // Card expiry
        var exp = elements.create('cardExpiry', {
            'placeholder': 'MM / YY',
            'style': style
        });
        exp.mount('#card-exp');

	// Add event to handle real-time validation errors from the card Element.
	createCardElementValidator (card,'.card-number');
	createCardElementValidator (cvc, '.card-cvc');
	createCardElementValidator (exp, '.card-exp');

	// Submit payment
	onSubmitPayment(stripe,card);

	// Rating and feedback
	createFeedbackAndTrigger() ;
	onSubmitFeedback() ;
    });
});

function createCardElementValidator (element,element_id) {
    element.addEventListener('change', function(event) {
        console.log(event);

	if (event.complete) {
	    $(element_id).removeClass('has-error has-success');
	    $(element_id).addClass('has-success');
	} else {
	    $(element_id).removeClass('has-error has-success');
	    $(element_id).addClass('has-error');
	}
	validateCardInfoAndTrigger();
    });
}

function validateCardInfoAndTrigger() {
    if($('.card-number').hasClass('has-success') &&
       $('.card-cvc').hasClass('has-success') &&
       $('.card-exp').hasClass('has-success')) {
	$('input[name="card-validation"]').val('1');
	$('input[name="card-validation"]').trigger('change');
    } else {
	$('input[name="card-validation"]').val('');
	$('input[name="card-validation"]').trigger('change');
    }
}

function onSubmitPayment(stripe,card) {

    $('#payment-submit').on('click', function(e){
        e.preventDefault();

	var name_kanji_family = $('#name_kanji_family').val() ;
	var name_kanji_given = $('#name_kanji_given').val() ;
	var name_kana_family = $('#name_kana_family').val() ;
	var name_kana_given = $('#name_kana_given').val() ;
	var fullname      = name_kanji_family + ' ' + name_kanji_given ;
	var fullname_kana = name_kana_family  + ' ' + name_kana_given ;
	var graduate = $('#graduate').val() ;
	var email = $('#email').val() ;
	var phone = $('#tel').val() ;
	var zip = $('#zip').val() ;
	var pref = $('#pref').val() ;
	var address = $('#address').val() ;
	var building = $('#building').val() ;
	var full_address = zip + ':' + pref + address + ' ' + building;

	// Put name with graduates onto the thanks page
	var thanksTo= graduate + '期' + ' ' + name_kanji_family + name_kanji_given + ' 様' ;
	document.getElementById("thanks-to").textContent=thanksTo;

	startBlockUI() ;
        var cardData = {
	    'name': $('#name').val()
	};

	stripe.createToken(card, cardData).then(function(result) {
            if(result.error && result.error.message){
		alert(result.error.message);
		stopBlockUI();
	    } else {

		// Publish real payment(charge) request to stripe with token and several info
		var token = result.token.id;

		$.post('/charge', {
		            'token': token,
			    'email': email,
			    'graduate': graduate,
			    'fullname': fullname,
			    'fullname_kana': fullname_kana,
			    'phone': phone,
			    'address': full_address
				})

		    // Assign handlers immediately after making the request,
		    .done(function(data, textStatus, jqXHR) {
			    $('#payment-form').hide();
			    $('#thanks').show();
			    stopBlockUI();
			})
		    .fail(function(jqXHR, textStatus, errorThrown) {
			    var errorType = 'Error type : ' + jqXHR.responseJSON.type + '\n'; 
			    var errorMessage = 'Message : ' + jqXHR.responseJSON.message;
			    stopBlockUI();
			    alert('支払いできませんでした。' + '\n' + errorType + errorMessage) ;
			});
	    }
        });
    });
}

function createFeedbackAndTrigger() {

    var element = document.getElementById('rating-g');
    element.addEventListener('change', function(event) {
	validateFeedbackAndTrigger();
    });
    element = document.getElementById('feedback-comment');p
    element.addEventListener('input', function(event) {
	validateFeedbackAndTrigger();
    });
}

function getRatingValue() {
    var ele = document.getElementsByName("rating");
    for ( var a="", i=ele.length; i--; ) {
	if ( ele[i].checked ) {
	    var a = ele[i].value ;
	    break ;
	}
    }
    return a ;
}

function validateFeedbackAndTrigger() {

    var valid = "";
    var a = getRatingValue();

    if (a != '') {
	valid = 'y';
    } else {
	if ($('#feedback-comment').val() != '') {
	    valid = 'y'
	}
    }
    if (valid != '') {
	$('input[name="feedback-validation"]').val('1');
    } else {
	$('input[name="feedback-validation"]').val('');
    }
    $('input[name="feedback-validation"]').trigger('change');
}

function onSubmitFeedback(stripe,card) {

    $('#feedback-submit').on('click', function(e){
        e.preventDefault();
	startBlockUI() ;

	var name_kanji_family = $('#name_kanji_family').val() ;
	var name_kanji_given = $('#name_kanji_given').val() ;
	var fullname      = name_kanji_family + ' ' + name_kanji_given ;
	var graduate = $('#graduate').val() ;
	var email = $('#email').val() ;

	var rating = getRatingValue() ;
	var comment = $('#feedback-comment').val() ;
	startBlockUI() ;
	$.post('/feedback', {
	    'email': email,
	    'graduate': graduate,
	    'fullname': fullname,
	    'rating': rating,
	    'comment': comment
	})
	    .done(function(data, textStatus, jqXHR) {
		$('#payment-form').hide();
		$('#thanks').hide();
		$('#thanks-for-feedback').show();
		stopBlockUI() ;
	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
		$('#payment-form').hide();
		$('#thanks').hide();
		$('#thanks-for-feedback').show();
		stopBlockUI() ;
	    })
    });
}

function startBlockUI() {
    $.blockUI({ css: {
		border: 'none',
		    padding: '15px',
		    backgroundColor: 'none',
		    color: '#333',
		    '-webkit-border-radius': '10px',
		    '-moz-border-radius': '10px',
		    opacity: .8
		    },
		message: $('#tallContent')
	});
}

function stopBlockUI() {
    $.unblockUI();
}

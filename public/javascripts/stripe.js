
$(document).ready(function(){

	// Create a Stripe client
        var stripe = Stripe('pk_test_K3rm5fd3O845Y425biVp6d9D');

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

	// Handle real-time validation errors from the card Element.
	card.addEventListener('change', function(event) {
		console.log(event);
	    });

	// Handle real-time validation errors from the card Element.
	cvc.addEventListener('change', function(event) {
		console.log(event);
	    });

	// Handle real-time validation errors from the card Element.
	exp.addEventListener('change', function(event) {
		console.log(event);
	    });
	/*
 {elementType: "cardCvc", error: undefined, value: undefined, empty: false, complete: false}
	*/


        // Submit
        $('#payment-submit').on('click', function(e){
            e.preventDefault();

	    var name_kanji_family = $('#name_kanji_family').val() ;
	    var name_kanji_given = $('#name_kanji_given').val() ;
	    var graduate = $('#graduate').val() ;
	    var email = $('#email').val() ;

	    // Put name with graduates onto the thanks page
	    var thanksTo= graduate + '期' + ' ' + name_kanji_family + name_kanji_given + ' 様' ;
	    document.getElementById("thanks-to").textContent=thanksTo;

	    $.blockUI({ css: { 
			border: 'none', 
			    padding: '15px',
			    backgroundColor: '#fff',
			    color: '#333', 
			    '-webkit-border-radius': '10px', 
			    '-moz-border-radius': '10px', 
			    opacity: .8 
			    },
			message: $('#tallContent')} 
		);

            var cardData = {
                'name': $('#name').val()
            };
            stripe.createToken(card, cardData).then(function(result) {
                console.log(result);

                if(result.error && result.error.message){
                    alert(result.error.message);
		    $.unblockUI();
                }else{
		    var token = result.token.id;
		    // AJAX - you would send 'token' to your server here.

		    $.post('/charge', {
			    'token': token
			})
			// Assign handlers immediately after making the request,
			.done(function(data, textStatus, jqXHR) {
				$.unblockUI();
				console.log("Success");
				$('#payment-form').hide();
				$('#thanks').show();
			    })
			.fail(function(jqXHR, textStatus, errorThrown) {
				$.unblockUI();
				console.log("Failure");
			    });

                }

            });
       });
});
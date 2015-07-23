'use strict';
//adapted from the original source: 
var AnnotateWatson = AnnotateWatson || {};

AnnotateWatson.App = function() {
	//keep track of the number of answers
	var numAnswers = 0;

	//initialization function
	var init = function() {
		var form = $('#inquiryForm');
		var inquiry = $('#inquiryText');
		var askButton = $('.analyze-btn');

		resetCarousel();

		askButton.click(function() {
			ask(inquiry[0].value);
		});

		// Initialize the 'Slick Carousel'
		$('.single-item').slick({
			dots : true,
			infinite : true,
			speed : 300,
			slidesToShow : 1,
			slidesToScroll : 1
		});
	};

	//asks a question
	//sends a question to our nodejs app in docker
	//receives the annotated answers
	var ask = function(inquiry) {
		resetCarousel();

		var questionText = {
			'question': inquiry
		};

		// POST the question request to the Node.js REST service
		$.ajax({
			type : 'POST',
			data : questionText,
			dataType : "json",
			url : '/question/annotate',
			success : function(r, msg) {
				// Display answers or error
	console.log('type',typeof(r));
				displayAnswers(r);
			},
			error : function(r, msg, e) {
				// Enable search and stop progress indicator
				inquiry.removeAttr("disabled");
				// Display error
				if (r.responseText) {
					alert(e+' '+r.responseText);	
				} else {
					alert(e);
				}
		
			}
		});
	}

	// Display the answers return in the response, r, in 'Slick Carousel' slides.
	var displayAnswers = function(r) {
		var answers = $("#answers");
		numAnswers = r.length;
	
		answers.show();
	
		// Add slides containing answers to the 'Slick Carousel' 
		for (var i = 0; i < numAnswers; i++) {
			$('#panswer' + i).remove();
			answers.slick('slickAdd',createAnswerSlide(i,r));
		}

		// Set to the first answer slide
		answers.slick('goTo',0);
	};

	// Create a 'Slick Carousel' slide that hosts an answer and its confidence
	var createAnswerSlide = function(i, r) {
		var answerContainerDiv, answerDiv;
		answerContainerDiv = $("<div>");

		answerDiv = $("<div>", {
			id : 'answer' + i,
			'text' : r[i].text,
			'class' : 'answerContent'
		});
	
		answerContainerDiv = $("<div>", {
			id : 'panswer' + i
		});
		answerDiv.appendTo(answerContainerDiv);
	
		return answerContainerDiv;
	};

	var createAnnotations = function(answer) {

		for(int i=0;i<answer.entities.length;i++) {
			var shortAbstract = answer.entities[i];
		}
	};

	var createAnnotation = function(text,shortAbstract,annotation) {

	}

	var annotate = function () {
		$('.annotate').html(function (index, oldHTML) {
			return oldHTML.replace(oldHTML.substr(2, 14),
				'<span class="annotation"  data-title="test title" data-content="here is content">' +
				oldHTML.substr(2, 14) + '</span>');
		});

		Tipped.create('.annotation', function(element) {
			return {
				title: $(element).data('title'),
				content: $(element).data('content')
			};
		}, {
			skin: 'light'
		});
	};

	//empty and hide the slick carousel
	var resetCarousel = function() {
		var answers = $('#answers');
		for (var i = numAnswers - 1; i >= 0; i--) {
			answers.slick('slickRemove',i);
		}
		numAnswers = 0;
		answers.hide();
	};


	//expose the init function
	return {
		init : init
	};

}();

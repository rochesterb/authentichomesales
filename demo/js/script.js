$(document).ready(function() {

	//Smooth Scroll
	 //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");
        
        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
      
        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top-85
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });

	// Main Menu
	$('#main-nav').affix({
		offset: {
			top: $('header').height()
		}
	});


	// Top Search
	$("#ss").click(function(e) {
		e.preventDefault();
		$(this).toggleClass('current');
		$(".search-form").toggleClass('visible');
	});


	//Slider
	
	var containerPosition = $('.container').offset();
	var positionPad = containerPosition.left + 15;

	

	// number effect
	$('.top-banner-wrapper1').one('inview', function(event, visible) {
		if (visible == true) {
			$('.count').each(function() {
				$(this).prop('Counter', 0).animate({
					Counter: $(this).text()
				}, {
					duration: 5000,
					easing: 'swing',
					step: function(now) {
						$(this).text(Math.ceil(now));
					}
				});
			});
		}
	});


	//Google Map
   // var get_latitude = $('#google-map').data('latitude');
    //var get_longitude = $('#google-map').data('longitude');

    function initialize_google_map() {
      /*  var myLatlng = new google.maps.LatLng(get_latitude, get_longitude);
        var mapOptions = {
            zoom: 14,
            scrollwheel: false,
            center: myLatlng
        };
        var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });*/
    }
    //google.maps.event.addDomListener(window, 'load', initialize_google_map);
				
		
	$(window).scroll(function() {
    onScroll()
});

});
function onScroll(){
	var windscroll = $(window).scrollTop();
	topsection = $('nav li').eq(0).find("a").attr("href");
	getFirstSectionLen = parseInt($(topsection).height())-200;
    if (windscroll >= getFirstSectionLen) {
		$('#ftheme ul li').removeClass('active');
        $('nav li').eq(1).addClass('active');
        $('#ftheme ul li').each(function(i) {
			getId = $(this).find("a").attr("href");
			if($(getId)){
					getcurrenttop = parseInt($(getId).offset().top)-120;
					if (getcurrenttop <= windscroll) {
						$('#ftheme ul li').removeClass('active');
						$('nav li').eq(i).addClass('active');
					
					}
					if(parseInt(getcurrenttop)-300 <= windscroll){
							var id = $('nav li').eq(i).find('a').attr("href");
							$(id).addClass("o-9");
					}
				
			}
			
        });

    } else {
		$('#ftheme ul li').removeClass('active');
                $('nav li').eq(0).addClass('active');
        
       // $('nav li.active').removeClass('active');
       // $('nav li:first').addClass('active');
    }

}


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * TO DO :
 * 
 * - clickable menu button for smaller viewport DONE
 * - "back to top" button;
 * - click-change for Ozzy images   DONE
 * - zoom for Ozzy images;  DONE
 * - drop-down menu button;   DONE
 * - modal window for bike;
 * 
 */


var main = function () {

    //
    //  WINDOW_EVENTS
    //     
    
    $(window).resize(CheckOnResize);
    $(window).scroll(CheckOnScroll); 
    
    function CheckOnResize(){
        SmallScreenCheck();
        SizeCheck();       
    };
    
    function CheckOnScroll(){
        ViewportCheck();
    };
   
    //
    //  SMALL_SCREEN_DOM_MANIPULATION
    //    
    
    SmallScreenCheck();
       
    function SmallScreenCheck(){
        if ($("header .nav-icon").css("display") !== "none" ) {
            $(".bike .first-p").after($(".bike .image"));
            $(".ozzy .row").prepend($(".ozzy .ozzy-text"));
        } else {
            $(".bike .image-default").append($(".bike .image"));
            $(".ozzy .row").append($(".ozzy .ozzy-text"));
        }
    };  
    
    //
    //  NAVIGATION_CLICK
    //
    
    var tap = 0;
    
    $("header .nav-icon").click(function () {
        $("header .nav-icon").toggleClass("nav-click");
        if (tap === 0) {
            $("header .navigation").css("display", "inline");
            tap = 1;
        } else {
            $("header .navigation").css("display", "none");
            tap = 0;
        }
    });
    
    function SizeCheck(){
        if ($("header .nav-icon").css("display") === "none" ){
            $("header .navigation").css("display", "inline");
            $("header .nav-icon").removeClass("nav-click");
            tap = 0;
        } else if (tap === 0) {
            $("header .navigation").css("display", "none");
        }
    };
    
    //
    //  OZZY_CLICK
    //
    
    var current_ozzy_img = 1;
    var total_ozzy_img = 6;
    
    $(".next-button").click(function () {
        current_ozzy_img++;
        if (current_ozzy_img > total_ozzy_img) {
            current_ozzy_img = 1;
        }
        HideImg();
    });
        
    $(".prev-button").click(function () {
        current_ozzy_img--;
        if (current_ozzy_img < 1) {
            current_ozzy_img = total_ozzy_img;
        }
        HideImg();
    });
    
    function HideImg(){
        $(".ozzy img").css("opacity", "0");
        var timed_change = setTimeout(ChangeAndShowImg, 700);
    };
    
    function ChangeAndShowImg(){
        $(".ozzy img").attr("src", "../media/ozzy_" + current_ozzy_img + ".jpg");
        $(".ozzy #img_main").css("opacity", "1");
    };
    
    //
    //  OZZY_ZOOM
    //
    
    var initial_height = parseInt($(".ozzy img").css("height"));
    var total_resize = 1;
    
    $(".ozzy img").bind("mousewheel DOMMouseScroll", OzzyZoomScroll);
    
    function OzzyZoomScroll(event){
        var delta = ((event.originalEvent.wheelDelta  / 120) || -(event.detail / 3));
        var image_change = initial_height + (20 * delta);
        var resize_factor = image_change / initial_height - 1;
        total_resize = total_resize + resize_factor ;
        total_resize = Math.max(1, (Math.min(2, total_resize)));
        $(".ozzy img").css("transform", "scale(" + total_resize + ")");
        event.preventDefault();
    };
    
    $(".ozzy .photos").on("mouseenter", OzzyZoomMouseenter);
    
    function OzzyZoomMouseenter(){
        $(".ozzy #img_over").css("opacity", "1");
        $(".ozzy #img_main").css("opacity", "0");
        $(".ozzy .photos").on("mousemove", OzzyZoomMousemove);
    };
    
    $(".ozzy .photos").on("mouseleave", OzzyZoomMouseleave);
    
    function OzzyZoomMouseleave(){
        $(".ozzy img").css("transform", "scale(1)");
        total_resize = 1;
        $(".ozzy #img_over").css("opacity", "0");
        $(".ozzy #img_main").css("opacity", "1");
        $(".ozzy .photos").off("mousemove");
    };
    
    function OzzyZoomMousemove(event){
        var ozzy_img_left = $(".ozzy #img_main").offset().left;
        var ozzy_img_top = $(".ozzy #img_main").offset().top;
        var ozzy_photos_left = $(".ozzy .photos").offset().left;
        var user_x = event.clientX;
        var user_y = event.clientY + $(window).scrollTop();
                
        var ozzy_over_left = - user_x + (2 * ozzy_img_left) - ozzy_photos_left;
        var ozzy_over_top = - user_y + ozzy_img_top;
        
        $(".ozzy #img_over").css("left", ozzy_over_left + "px");
        $(".ozzy #img_over").css("top", ozzy_over_top + "px");        
    };
        
    //
    //  IN_VIEWPORT_CHECK
    //   
  
    function ViewportCheck(){
        
        var window_height = $(window).height();
        var window_top = $(window).scrollTop();
        var window_bottom = window_top + window_height;
                
        $(".animated-to-viewport").each(function(){
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top = $element.offset().top;
            var element_bottom = element_top + element_height;
            if ((element_bottom >= window_top) && (element_top <= window_bottom)){
               $element.addClass("in-viewport"); 
            } else {
               $element.removeClass("in-viewport");
            }
        });
    };
         
    
    //
    //  BACK-TO-TOP
    //


    //
    //  BIKE_IN
    // 

};



$(document).ready(main);
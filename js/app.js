/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * TO DO :
 * 
 * - clickable menu button for smaller viewport DONE
 * - "back to top" button;  DONE
 * - click-change for Ozzy images   DONE
 * - zoom for Ozzy images;  DONE
 * - drop-down menu button;   DONE
 * - modal window for family;   DONE
 * 
 */


var main = function () {

    //
    //  WINDOW_EVENTS
    //     
    
    $(window).resize(CheckOnResize);
    $(window).scroll(CheckOnScroll); 
    
    var header_height = $("header").outerHeight() - 4;
    
    function CheckOnResize(){
        SmallScreenCheck();
        SizeCheck();       
    };
    
    function CheckOnScroll(){
        ViewportCheck();
        BackToTopCheck();
    };
   
    //
    //  SMALL_SCREEN_DOM_MANIPULATION
    //    
    
    SmallScreenCheck();
       
    function SmallScreenCheck(){
        if ($("header #nav-icon").css("display") !== "none" ) {
            $("#bike #first-p").after($("#bike #bike-image"));
            $("#ozzy .row").prepend($("#ozzy #ozzy-text"));
        } else {
            $("#bike #image-default").append($("#bike #bike-image"));
            $("#ozzy .row").append($("#ozzy #ozzy-text"));
        }
    };  
    
    //
    //  NAVIGATION_CLICK
    //
    
    var nav_tap = 0;
    
    $("header #nav-icon").click(function () {
        $("header #nav-icon").toggleClass("nav-click");
        if (nav_tap === 0) {
            $("header #navigation").css("display", "inline");
            var header_height_diff = $("header").outerHeight() - 4 - header_height;
            console.log(header_height_diff);
            $("#back-to-top").css("top", "" + header_height_diff + "px");
            nav_tap = 1;
        } else {
            $("header #navigation").css("display", "none");
            $("#back-to-top").css("top", "0");
            nav_tap = 0;
        };
    });
    
    function SizeCheck(){
        if ($("header #nav-icon").css("display") === "none" ){
            $("header #navigation").css("display", "inline");
            $("header #nav-icon").removeClass("nav-click");
            $("#back-to-top").css("top", "0");
            nav_tap = 0;
        } else if (nav_tap === 0) {
            $("header #navigation").css("display", "none");
        } else {
            var header_height_diff = $("header").outerHeight() - 4 - header_height;
            $("#back-to-top").css("top", "" + header_height_diff + "px");
        }
    };
    
    //
    //  OZZY_CLICK
    //
    
    var current_ozzy_img = 1;
    var total_ozzy_img = 6;
    
    $("#next-button").click(function () {
        current_ozzy_img++;
        if (current_ozzy_img > total_ozzy_img) {
            current_ozzy_img = 1;
        }
        HideImg();
    });
        
    $("#prev-button").click(function () {
        current_ozzy_img--;
        if (current_ozzy_img < 1) {
            current_ozzy_img = total_ozzy_img;
        }
        HideImg();
    });
    
    function HideImg(){
        $("#ozzy img").css("opacity", "0");
        setTimeout(ChangeAndShowImg, 700);
    };
    
    function ChangeAndShowImg(){
        $("#ozzy img").attr("src", "../media/ozzy_" + current_ozzy_img + ".jpg");
        $("#ozzy #img_main").css("opacity", "1");
    };
    
    //
    //  OZZY_ZOOM
    //
    
    $("#ozzy .photos").on("mouseenter", OzzyZoomMouseenter);
    
    function OzzyZoomMouseenter(){
        $("#ozzy #img_over").css("opacity", "1");
        $("#ozzy #img_main").css("opacity", "0");
        $("#ozzy .photos").on("mousemove", OzzyZoomMousemove);
        $("#ozzy img").bind("mousewheel DOMMouseScroll", OzzyZoomScroll);
    };
    
    $("#ozzy .photos").on("mouseleave", OzzyZoomMouseleave);
    
    function OzzyZoomMouseleave(){
        $("#ozzy img").css("transform", "scale(1)");
        total_resize = 1;
        $("#ozzy #img_over").css("opacity", "0");
        $("#ozzy #img_main").css("opacity", "1");
        $("#ozzy .photos").off("mousemove");
        $("#ozzy img").unbind("mousewheel DOMMouseScroll", OzzyZoomScroll);
    };

    function OzzyZoomMousemove(event){
        var ozzy_img_left = $("#ozzy #img_main").offset().left;
        var ozzy_img_top = $("#ozzy #img_main").offset().top;
        var ozzy_photos_left = $("#ozzy .photos").offset().left;
        var user_x = event.clientX;
        var user_y = event.clientY + $(window).scrollTop();
                
        var ozzy_over_left = - user_x + (2 * ozzy_img_left) - ozzy_photos_left;
        var ozzy_over_top = - user_y + ozzy_img_top;
        
        $("#ozzy #img_over").css("left", ozzy_over_left + "px");
        $("#ozzy #img_over").css("top", ozzy_over_top + "px");        
    };
 
    var initial_height = parseInt($("#ozzy img").css("height"));
    var total_resize = 1;
    
    function OzzyZoomScroll(event){
        var delta = ((event.originalEvent.wheelDelta  / 120) || -(event.detail / 3));
        var image_change = initial_height + (20 * delta);
        var resize_factor = image_change / initial_height - 1;
        total_resize = total_resize + resize_factor ;
        total_resize = Math.max(1, (Math.min(2, total_resize)));
        $(".ozzy img").css("transform", "scale(" + total_resize + ")");
        event.preventDefault();
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

    function BackToTopCheck(){
        var window_scroll = $(window).scrollTop();
        if (window_scroll > 50) {
            //var header_height = $("header").outerHeight() - 4;
            //console.log(a);
            $("#back-to-top").css("transform", "translate(0 ," + header_height + "px)");
        } else {
            $("#back-to-top").css("transform", "translate(0 ,0)");
        };
    };

    $("#back-to-top").on("click", BackToTopClick);
    
    function BackToTopClick(){
        $("html, body").animate({scrollTop: 0});
    };
    
    //
    //  FAMILY_MODAL
    // 

    $("#family img").click(FamilyModalShow);
    
    var current_family_img = 1;
    var total_family_img = 6;
    var family_data;
    var family_place;
    var family_img;
    var family_gps;
    var family_gps_link;
    
    $.getJSON("../data/family.json", function(data){
        family_data = data;
    });
    
    function FamilyModalShow(){
        var source = $(this).attr("src");
        //$("#familyModal img").attr("src", source);
        current_family_img = source.substr(16, 1);
        SetFamilyModalData();
        $("#familyModal").modal();
        $(window).on("keydown", GetKeyPressed);
    };
    
    $("#familyModal").on("hidden.bs.modal", function () {
        $(window).off("keydown");
    });
    
    function SetFamilyModalData(){
        family_place = family_data.data[current_family_img-1].place;
        family_img = family_data.data[current_family_img-1].img;
        family_gps = family_data.data[current_family_img-1].geo;
        family_gps_link = family_data.data[current_family_img-1].geo_url;
        $("#familyModal h4").html(family_place);
        $("#familyModal img").attr("src", family_img);
        $("#familyModal a").html(family_gps);
        $("#familyModal a").attr("href", family_gps_link);
    };
    
    function GetKeyPressed(event) {
        switch (event.keyCode) {
          case 37:  // left arrow key
            PrevClickModal();
            event.stopImmediatePropagation();
            return;
          case 39:  // right arrow key
            NextClickModal();
            event.stopImmediatePropagation();
            return;
        }
    };    

    $("#next-button-modal").on("click", NextClickModal);
    
    function NextClickModal() {
        current_family_img++;
        if (current_family_img > total_family_img) {
            current_family_img = 1;
        }
        HideImgModal();
    };
        
    $("#prev-button-modal").on("click", PrevClickModal);
            
    function PrevClickModal() {
        current_family_img--;
        if (current_family_img < 1) {
            current_family_img = total_family_img;
        }
        HideImgModal();
    };
    
    function HideImgModal(){
        $("#familyModal h4").css("opacity", "0");
        $("#familyModal a").css("opacity", "0");
        $("#familyModal img").css("opacity", "0");
        setTimeout(ChangeAndShowImgModal, 500);
    };
    
    function ChangeAndShowImgModal(){
        SetFamilyModalData();
        $("#familyModal h4").css("opacity", "1");
        $("#familyModal a").css("opacity", "1");
        $("#familyModal img").css("opacity", "1");
    };
    
};



$(document).ready(main);
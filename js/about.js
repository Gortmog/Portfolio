/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * TO DO :
 * 
 * - "back to top" button;
 * - zoom for Ozzy images;
 * - drop-down menu button;
 * 
 */


var main = function () {
    
    var timed_change;
    var current_ozzy_img = 1;
    var total_ozzy_img = 6;
    
    $(".next-button").click(function () {
        current_ozzy_img++;
        if (current_ozzy_img > total_ozzy_img) {
            current_ozzy_img = 1;
        }
        hideImg();
    });
        
    $(".prev-button").click(function () {
        current_ozzy_img--;
        if (current_ozzy_img < 1) {
            current_ozzy_img = total_ozzy_img;
        }
        hideImg();
    });
    
    var hideImg = function(){
        $(".ozzy img").css("opacity", "0");
        timed_change = setTimeout(changeAndShowImg, 700);
    };
    
    var changeAndShowImg = function(){
        $(".ozzy img").attr("src", "../media/ozzy_" + current_ozzy_img + ".jpg");
        $(".ozzy img").css("opacity", "1");
    };
    
};

$(document).ready(main);
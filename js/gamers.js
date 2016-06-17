/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var main = function () {
    
    var charName;
    
    //
    // START_GAME
    //
    
    document.querySelector(".start-game").addEventListener("click", StartGame);

    function StartGame() {
        document.querySelector(".start").style.display = "none";
        document.querySelector(".intro").style.display = "block";
    }
    
    document.querySelector(".char-name").addEventListener("click", EnterName);
    
    function EnterName() {
        if (document.querySelector("input").value !== "") {
            charName = document.querySelector("input").value;
            document.querySelector("input").style.display = "none";
            document.querySelector(".char-name").style.display = "none";
            document.querySelectorAll(".intro span")[0].innerHTML = charName;
        }
    }
    
};



$(document).ready(main);
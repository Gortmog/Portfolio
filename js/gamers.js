/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var main = function () {
    
    document.querySelector(".start-game").addEventListener("click", StartGame);

    function StartGame() {
        document.querySelector(".start").style.display = "none";
        document.querySelector(".intro").style.display = "block";
    }
    
};



$(document).ready(main);
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var main = function () {
    
    var charName;
    var classIndex;
    var specIndex;
    var gamersData;
    var max_HP;
    var current_HP;
    var player;
    
    //
    // GET_JSON_DATA
    //    

    function loadJSON(file, callback) {   
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }
 

    function load() {
        loadJSON("../data/gamers.json", function(response) {
            gamersData = JSON.parse(response);
        });
    }
    
    //
    // START_GAME
    //
    
    document.querySelector(".start-game").addEventListener("click", StartGame);

    function StartGame() {
        document.querySelector(".start").style.display = "none";
        document.querySelector(".intro").style.display = "block";
        load();
    }
    
    document.querySelector("input").addEventListener("focus", NameInput);
    
    function NameInput() {
        document.querySelector("input").value = "";
    }
    
    document.querySelector(".char-name").addEventListener("click", EnterName);
    
    function EnterName() {
        if ((document.querySelector("input").value !== "") && (document.querySelector("input").value !== "Enter your name...")) {
            charName = document.querySelector("input").value;
            document.querySelector("input").style.display = "none";
            document.querySelector(".char-name").style.display = "none";
            document.querySelectorAll(".intro span")[0].innerHTML = charName;
        }
    }
    
    var classChoices = document.querySelectorAll(".class-choice");
    
    for (var i = 0; i < classChoices.length; i++)
    {
        (function(index){
            classChoices[i].onclick = function(){
                classIndex = Math.floor(index/2);
                specIndex = index%2;
                //console.log(classIndex + " " + specIndex);
                if (charName === undefined) {
                    var forcedName = prompt("The hero like you still should have a name!", "Newbie");
                    if (forcedName !== null) {
                        charName = forcedName;
                    };
                };
                StartJourney();
            };   
        })(i);
    }
    
    function StartJourney() {
        player = new Character(charName, classIndex, specIndex);
        max_HP = player.maxHP;
        current_HP = max_HP;
        console.log(DamageRoll(player.damage));
    }
    
    //
    // CHARACTER_CONSTRUCTOR
    //
    
    function Character(charName, classIndex, specIndex) {
        this.name = charName;
        this.maxHP = gamersData.heroes[classIndex].hp;
        this.hit = gamersData.heroes[classIndex].hit_mark;
        this.class = gamersData.heroes[classIndex].class_name;
        this.spec = gamersData.heroes[classIndex].specs[specIndex].spec_name;
        this.weapon = gamersData.heroes[classIndex].specs[specIndex].weapon;
        this.damage = gamersData.heroes[classIndex].specs[specIndex].damage;
        this.crit = gamersData.heroes[classIndex].specs[specIndex].crit_mark;
        this.initiative = gamersData.heroes[classIndex].specs[specIndex].turn_frequency;
        this.class_img = gamersData.heroes[classIndex].class_image;
        this.spec_img = gamersData.heroes[classIndex].specs[specIndex].spec_image;
    }
    
    //
    // LOCATION_CONSTRUCTOR
    //
    
    //
    // MONSTER_CONSTRUCTOR
    //
    
    //
    // DICE_ROLLS
    //
    
    function D20Roll(hit, crit) {
        var number = Math.floor((Math.random()*20)+1);
        var outcome;
        if (number < hit) {
            outcome = "miss";
        } else if (number < crit) {
            outcome = "hit";
        } else if (number >= crit) {
            outcome = "crit";
        };
        //console.log(number + " " + outcome);
        return {
            number: number,
            outcome: outcome
        };
    }
    
    function DamageRoll(damage) {
        var quantity = damage.substr(0, 1);
        var max_damage = damage.substr(2);
        var output = 0;
        for (i = 1; i <= quantity; i++) {
            output += Math.floor((Math.random()*max_damage)+1);
        };
        return output;
    }
    
};



$(document).ready(main);
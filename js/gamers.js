/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var main = function () {
    
    var char_name;
    var monster_name;
    var class_index;
    var spec_index;
    var gamers_data;
    var player_max_HP;
    var player_current_HP;
    var enemy_max_HP;
    var enemy_current_HP;
    var env;
    var player;
    var enemy;
    var locationName = "Grassland";
    var hp_number = 5;
    
    //
    // GET_JSON_DATA
    //    

    function loadJSON(file, callback) {   
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open("GET", file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }
 

    function load() {
        loadJSON("../data/gamers.json", function(response) {
            gamers_data = JSON.parse(response);
        });
    }
    
    //
    // GAME_INTRO
    //
    
    document.querySelector(".start-game").addEventListener("click", startGame);

    function startGame() {
        document.querySelector(".start").style.display = "none";
        document.querySelector(".intro").style.display = "block";
        load();
    }
    
    document.querySelector("input").addEventListener("focus", nameInput);
    
    function nameInput() {
        document.querySelector("input").value = "";
    }
    
    document.querySelector(".char-name").addEventListener("click", enterName);
    
    function enterName() {
        if ((document.querySelector("input").value !== "") && (document.querySelector("input").value !== "Enter your name...")) {
            char_name = document.querySelector("input").value;
            document.querySelector("input").style.display = "none";
            document.querySelector(".char-name").style.display = "none";
            document.querySelectorAll(".intro span")[0].innerHTML = char_name;
        }
    }
    
    //
    // START_GAME
    //    
    
    var class_choices = document.querySelectorAll(".class-choice");
    
    for (var i = 0; i < class_choices.length; i++) {
        (function(index){
            class_choices[i].onclick = function(){
                class_index = Math.floor(index/2);
                spec_index = index%2;
                if (char_name === undefined) {
                    var forcedName = prompt("The hero like you still should have a name!", "Newbie");
                    if (forcedName === null) {
                        return;
                    } else {
                        char_name = forcedName || "Newbie";
                    }
                };
                startJourney();
            };   
        })(i);
    }
    
    function startJourney() {
        document.querySelector(".intro").style.display = "none";
        document.querySelector(".main-module").style.display = "block";
        createLocation();
        createCharacter();
        createMonster();
    }
    
    function createCharacter() {
        player = new Character(char_name, class_index, spec_index);
        player_max_HP = player.maxHP;
        player_current_HP = player_max_HP;
        document.querySelectorAll(".portrait")[0].src = player.spec_img;
        document.querySelectorAll(".main-module h2")[0].innerHTML = player.name;
        document.querySelector("#player-max-hp").innerHTML = player_max_HP;
        document.querySelector("#player-current-hp").innerHTML = player_current_HP;
        document.querySelector("#hp-number").innerHTML = hp_number;
    }
    
    function createMonster() {
        enemy = new Monster(monster_name);
        enemy_max_HP = enemy.maxHP;
        enemy_current_HP = enemy_max_HP;
        document.querySelectorAll(".portrait")[1].src = enemy.image;
        document.querySelectorAll(".main-module h2")[1].innerHTML = enemy.name;
        document.querySelector("#monster-max-hp").innerHTML = enemy_max_HP;
        document.querySelector("#monster-current-hp").innerHTML = enemy_current_HP;
    }
    
    function createLocation() {
        env = new Location(locationName);
        monster_name = env.monster;
        document.querySelector(".main-module > .container").style.backgroundImage = "url(" + env.image + ")";
        document.querySelector("#location-name").innerHTML = env.name;
        document.querySelector("#location-description").innerHTML = env.description;
        document.querySelectorAll("#next-buttons > button")[0].innerHTML = "Go to " + env.direction_1;
        document.querySelectorAll("#next-buttons > button")[1].innerHTML = "Go to " + env.direction_2;
        if (env.direction_2 === "null") {
            document.querySelectorAll("#next-buttons > button")[1].style.display = "none";
        }
        document.querySelector("#fight-button > button").addEventListener("click", startFight);
        document.querySelector("#log-screen").style.overflowY = "auto";
    }
    
    //
    // CHARACTER_CONSTRUCTOR
    //
    
    function Character(charName, classIndex, specIndex) {
        this.name = charName;
        this.maxHP = gamers_data.heroes[classIndex].hp;
        this.monster_hit = gamers_data.heroes[classIndex].hit_mark;
        this.class = gamers_data.heroes[classIndex].class_name;
        this.spec = gamers_data.heroes[classIndex].specs[specIndex].spec_name;
        this.weapon = gamers_data.heroes[classIndex].specs[specIndex].weapon;
        this.damage = gamers_data.heroes[classIndex].specs[specIndex].damage;
        this.crit = gamers_data.heroes[classIndex].specs[specIndex].crit_mark;
        this.initiative = gamers_data.heroes[classIndex].specs[specIndex].turn_frequency;
        this.class_img = gamers_data.heroes[classIndex].class_image;
        this.spec_img = gamers_data.heroes[classIndex].specs[specIndex].spec_image;
    }
    
    //
    // LOCATION_CONSTRUCTOR
    //
    
    function Location(locationName) {
        for (var i = 0; i < gamers_data.locations.length; i++) {
            if (gamers_data.locations[i].location_name === locationName) {
                this.name = gamers_data.locations[i].location_name;
                this.direction_1 = gamers_data.locations[i].direction_1;
                this.direction_2 = gamers_data.locations[i].direction_2;
                this.monster = gamers_data.locations[i].monster;
                this.monster_number = gamers_data.locations[i].monster_number;
                this.image = gamers_data.locations[i].image;
                this.description = gamers_data.locations[i].description;
            }
        }        
    }
    
    //
    // MONSTER_CONSTRUCTOR
    //
    
    function Monster(monsterName) {
        for (var i = 0; i < gamers_data.monsters.length; i++) {
            if (gamers_data.monsters[i].monster_name === monsterName) {
                this.name = gamers_data.monsters[i].monster_name;
                this.maxHP = gamers_data.monsters[i].hp;
                this.player_hit = gamers_data.monsters[i].hit_mark;
                this.damage = gamers_data.monsters[i].damage;
                this.image = gamers_data.monsters[i].image;
            }
        }
    }
    
    //
    // DICE_ROLLS
    //
    
    function d20Roll(hit, crit) {
        crit = crit || 21;
        var number = Math.floor((Math.random()*20)+1);
        var outcome;
        if (number < hit) {
            outcome = "miss";
        } else if (number < crit) {
            outcome = "hit";
        } else if (number >= crit) {
            outcome = "crit";
        };
        return {
            number: number,
            outcome: outcome
        };
    }
    
    function damageRoll(damage) {
        var quantity = damage.substr(0, 1);
        var max_damage = damage.substr(2);
        var output = 0;
        for (var i = 1; i <= quantity; i++) {
            output += Math.floor((Math.random()*max_damage)+1);
        };
        return output;
    }
    
    //
    // MAIN_CYCLE
    //
    
    
    
    function startFight() {
        
        function drinkPotion(event) {
            drinkHP();
            attackPlayer();
            
            // SCROLL LOG TO THE BOTTOM

            document.querySelector("#log-screen").scrollTop = document.querySelector("#log-screen").scrollHeight;
        }
        
        function attackNow(event) {
            attackEnemy();
            attackPlayer();
            
            // SCROLL LOG TO THE BOTTOM

            document.querySelector("#log-screen").scrollTop = document.querySelector("#log-screen").scrollHeight;
        }
    
        if (hp_number === 0) {
            document.querySelector("#hp-button").className = "btn battle-button inactive-button";
            document.querySelector("#hp-button").removeEventListener("click", drinkPotion);
        } else {
            document.querySelector("#hp-button").className = "btn battle-button";
            document.querySelector("#hp-button").addEventListener("click", drinkPotion);
        };
        document.querySelector("#fight-button").style.opacity = 0;
        setTimeout(function(){
            document.querySelector("#fight-button").style.display = "none";
            document.querySelector("#log-screen").style.display = "block";
            document.querySelector("#battle-buttons").style.display = "block";
            setTimeout(function(){
                document.querySelector("#log-screen").style.opacity = 0.8;
                document.querySelector("#battle-buttons").style.opacity = 1;
            }, 100);
        }, 500);
        var node = document.createElement("p");
        node.innerHTML = "Let the battle begin!";
        document.querySelector("#log-screen").appendChild(node);
        document.querySelector("#attack-button").addEventListener("click", attackNow);
        document.querySelector("#fight-button > button").removeEventListener("click", startFight);
        
        
        
        var monster_turn = true;    // MONSTER ELIGIBILITY TO ATTACK

        var node;

        // PLAYER DRINKS PORION

        function drinkHP() {
            hp_number -= 1;
            document.querySelector("#hp-number").innerHTML = hp_number;
            var hp_regen = Math.floor(Math.random()*20+1);
            var real_hp_regen = Math.min(hp_regen, player.maxHP - player_current_HP);
            player_current_HP += hp_regen;
            player_current_HP = (player_current_HP <= player.maxHP) ? player_current_HP : player.maxHP;
            document.querySelector("#player-current-hp").innerHTML = player_current_HP;
            node = document.createElement("p");
            node.innerHTML = player.name + " drinks a healing potion and regenerates " + real_hp_regen + " health.";
            node.className += " player-text";
            document.querySelector("#log-screen").appendChild(node);
            if (hp_number == 0) {
                document.querySelector("#hp-button").className = "btn battle-button inactive-button";
                document.querySelector("#hp-button").removeEventListener("click", drinkPotion);
            }
        }

        // PLAYER ATTACKS

        function attackEnemy() {
            var player_d20result = d20Roll(enemy.player_hit, player.crit);
            var node = document.createElement("p");
            node.innerHTML = player.name + " rolls " + player_d20result.number;
            node.className += " player-text";
            document.querySelector("#log-screen").appendChild(node);
            if (player_d20result.outcome === "miss") {
                node = document.createElement("p");
                node.innerHTML = player.name + " misses " + enemy.name + ". Damn...";
                node.className += " player-text";
                document.querySelector("#log-screen").appendChild(node);
            } else {
                var player_damage = damageRoll(player.damage);
                if (player_d20result.outcome === "hit") {
                    node = document.createElement("p");
                    node.innerHTML = player.name + " " + player_d20result.outcome + "s " + enemy.name + " for " + player_damage + " damage. Nice.";
                    node.className += " player-text";
                    document.querySelector("#log-screen").appendChild(node);
                } else if (player_d20result.outcome === "crit") {
                    player_damage = player_damage*2;
                    node = document.createElement("p");
                    node.innerHTML = player.name + " " + player_d20result.outcome + "s " + enemy.name + " for " + player_damage + " damage. BOOM!";
                    node.className += " player-text";
                    document.querySelector("#log-screen").appendChild(node);
                }
            }
            enemy_current_HP -= player_damage || 0;
            document.querySelector("#monster-current-hp").innerHTML = ((enemy_current_HP >= 0) ? enemy_current_HP : "0");
            if (enemy_current_HP <= 0) {
                enemy_current_HP = 0;
                death("enemy");
                if (enemy_current_HP > 0) {
                    return;
                }
                var next_direction = document.querySelectorAll("#next-buttons > button");
                for (var i = 0; i < next_direction.length; i++) {
                    (function(index){
                        next_direction[index].onclick = function(){
                            locationName = next_direction[index].innerHTML.slice(6);
                            continueJorney();
                        };   
                    })(i);
                }
                return;
            } 
        }

        // MONSTER ATTACKS

        function attackPlayer() {
            if (enemy_current_HP <= 0) {
                return;
            }
            if (player.initiative == 0) {
                monster_turn = !monster_turn;
            }
            if (monster_turn) {
                for (var i = 0; i <= (player.initiative / 2); i++) {    // CHECK MONSTER TURN FREQUENCY
                    var enemy_d20result = d20Roll(player.monster_hit);    
                    node = document.createElement("p");
                    node.innerHTML = enemy.name + " rolls " + enemy_d20result.number;
                    node.className += " monster-text";
                    document.querySelector("#log-screen").appendChild(node);  
                    if (enemy_d20result.outcome === "miss") {
                        node = document.createElement("p");
                        node.innerHTML = enemy.name + " misses " + player.name + ". Phew! That was close!";
                        node.className += " monster-text";
                        document.querySelector("#log-screen").appendChild(node);
                    } else {
                        var monster_damage = damageRoll(enemy.damage);
                        node = document.createElement("p");
                        node.innerHTML = enemy.name + " " + enemy_d20result.outcome + "s " + player.name + " for " + monster_damage + " damage. Ouch!";
                        node.className += " monster-text";
                        document.querySelector("#log-screen").appendChild(node);
                    }
                    player_current_HP -= monster_damage || 0;
                    document.querySelector("#player-current-hp").innerHTML = ((player_current_HP >= 0) ? player_current_HP : "0");
                    if (player_current_HP <= 0) {
                        player_current_HP = 0;
                        death("player");
                        document.querySelector("#restart-button > button").addEventListener("click", restartJourney);
                        return;
                    }   
                };
            }
        }
 
        // PLAYER'S OR MONSTER'S DEATH
 
        function death(subject) {
            var j;
            var final_text;
            var next_content;
            if (subject === "enemy") {
                j = 1;
                final_text = "YOU WIN";
                next_content = "#next-buttons";
            } else if (subject === "player") {
                j = 0;
                final_text = "GAME OVER";
                next_content = "#restart-button";
            }
            document.querySelectorAll(".portrait")[j].src = "../media/skull.png";
            node = document.createElement("h3");
            node.innerHTML = final_text;
            node.className += " gameover";
            setTimeout(function(){
                document.querySelector("#log-screen").appendChild(node);
                document.querySelector("#log-screen").scrollTop = document.querySelector("#log-screen").scrollHeight;
                
                // ASK PLAYER WETHER TO STAY & SEARCH OR JUST GO ON
                
                if (subject === "enemy") {
                    var answer = confirm("Do you want to stay for a while and search for anything useful?");
                    if (answer == true) {
                        var result = (Math.random() < 0.5) ? "new_enemy" : "new_potion";
                        if (result === "new_enemy") {
                            document.querySelector("#log-screen").innerHTML = "";
                            node = document.createElement("p");
                            node.innerHTML = "While " + player.name + " is searching for anything that could prove useful, another " + enemy.name + " approaches. God damn!";
                            node.className += " ";
                            document.querySelector("#log-screen").appendChild(node);
                            enemy_current_HP = enemy.maxHP;
                            document.querySelector("#monster-current-hp").innerHTML = enemy_current_HP;
                            document.querySelectorAll(".portrait")[j].src = enemy.image;
                            return;
                        } else if (result === "new_potion") {
                            document.querySelector("#log-screen").innerHTML = "";
                            node = document.createElement("p");
                            node.innerHTML = player.name + " finds an untouched healing potion. Hell yeah!";
                            node.className += " player-text";
                            document.querySelector("#log-screen").appendChild(node);
                            hp_number += 1;
                            document.querySelector("#hp-number").innerHTML = hp_number;
                        }
                    }
                }
                
                // PREPARE FOR THE NEXT PART OF THE JOURNEY
                
                document.querySelector("#log-screen").style.overflowY = "hidden";
                document.querySelector("#attack-button").removeEventListener("click", attackNow);
                document.querySelector("#hp-button").removeEventListener("click", drinkPotion);
                document.querySelector("#battle-buttons").style.opacity = 0;
                setTimeout(function(){
                    document.querySelector("#battle-buttons").style.display = "none";
                    document.querySelector(next_content).style.display = "block";
                    setTimeout(function(){
                        document.querySelector(next_content).style.opacity = 1;
                    }, 100);
                }, 500);
            }, 1000);
            
            
        }
    
    
    }
    
    function continueJorney() {
        document.querySelector(".main-module").style.opacity = 0;
        setTimeout(function(){
            createLocation();
            createMonster();
            document.querySelector("#log-screen").style.display = "none";
            document.querySelector("#log-screen").innerHTML = "";
            document.querySelector(".battle-buttons").style.display = "none";
            document.querySelector(".battle-buttons").style.opacity = 0;
            document.querySelector("#next-buttons").style.display = "none";
            document.querySelector("#fight-button").style.display = "block";
            document.querySelector("#fight-button").style.opacity = 1;
            document.querySelector(".main-module").style.opacity = 1;
        }, 500);
    }
    
    function restartJourney() {
        document.querySelector(".main-module").style.opacity = 0;
        setTimeout(function(){
            document.querySelector("#log-screen").style.display = "none";
            document.querySelector("#log-screen").innerHTML = "";
            document.querySelector(".battle-buttons").style.display = "none";
            document.querySelector(".battle-buttons").style.opacity = 0;
            document.querySelector("#next-buttons").style.display = "none";
            document.querySelector("#fight-button").style.display = "block";
            document.querySelector("#fight-button").style.opacity = 1;
            document.querySelector(".main-module").style.display = "none";
            document.querySelector(".main-module").style.opacity = 1;
            document.querySelector(".start").style.display = "block";
            document.querySelector("#restart-button").style.display = "none";
            document.querySelector("#restart-button").style.opacity = 0;
            locationName = "Grassland";
        }, 500);
    }
    
    
    
    
    
};



$(document).ready(main);
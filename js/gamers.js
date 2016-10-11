/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var main = function () {
    
    var charName;
    var monsterName;
    var classIndex;
    var specIndex;
    var gamersData;
    var player_max_HP;
    var player_current_HP;
    var enemy_max_HP;
    var enemy_current_HP;
    var env;
    var player;
    var enemy;
    var locationName = "Grassland";
    var hp_number = 1;
    
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
            gamersData = JSON.parse(response);
        });
    }
    
    //
    // GAME_INTRO
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
    
    //
    // START_GAME
    //    
    
    var classChoices = document.querySelectorAll(".class-choice");
    
    for (var i = 0; i < classChoices.length; i++) {
        (function(index){
            classChoices[i].onclick = function(){
                classIndex = Math.floor(index/2);
                specIndex = index%2;
                if (charName === undefined) {
                    var forcedName = prompt("The hero like you still should have a name!", "Newbie");
                    if (forcedName === null) {
                        return;
                    } else {
                        charName = forcedName || "Newbie";
                    }
                };
                StartJourney();
            };   
        })(i);
    }
    
    function StartJourney() {
        document.querySelector(".intro").style.display = "none";
        document.querySelector(".main-module").style.display = "block";
        CreateLocation();
        CreateCharacter();
        CreateMonster();
    }
    
    function CreateCharacter() {
        player = new Character(charName, classIndex, specIndex);
        player_max_HP = player.maxHP;
        player_current_HP = player_max_HP;
        document.querySelectorAll(".portrait")[0].src = player.spec_img;
        document.querySelectorAll(".main-module h2")[0].innerHTML = player.name;
        document.querySelector("#player-max-hp").innerHTML = player_max_HP;
        document.querySelector("#player-current-hp").innerHTML = player_current_HP;
        document.querySelector("#hp-number").innerHTML = hp_number;
    }
    
    function CreateMonster() {
        enemy = new Monster(monsterName);
        enemy_max_HP = enemy.maxHP;
        enemy_current_HP = enemy_max_HP;
        document.querySelectorAll(".portrait")[1].src = enemy.image;
        document.querySelectorAll(".main-module h2")[1].innerHTML = enemy.name;
        document.querySelector("#monster-max-hp").innerHTML = enemy_max_HP;
        document.querySelector("#monster-current-hp").innerHTML = enemy_current_HP;
    }
    
    function CreateLocation() {
        env = new Location(locationName);
        monsterName = env.monster;
        document.querySelector(".main-module > .container").style.backgroundImage = "url(" + env.image + ")";
        document.querySelector("#location-name").innerHTML = env.name;
        document.querySelector("#location-description").innerHTML = env.description;
        document.querySelectorAll("#next-buttons > button")[0].innerHTML = "Go to " + env.direction_1;
        document.querySelectorAll("#next-buttons > button")[1].innerHTML = "Go to " + env.direction_2;
        if (env.direction_2 === "null") {
            document.querySelectorAll("#next-buttons > button")[1].style.display = "none";
        }
        document.querySelector("#fight-button > button").addEventListener("click", StartFight);
    }
    
    //
    // CHARACTER_CONSTRUCTOR
    //
    
    function Character(charName, classIndex, specIndex) {
        this.name = charName;
        this.maxHP = gamersData.heroes[classIndex].hp;
        this.monster_hit = gamersData.heroes[classIndex].hit_mark;
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
    
    function Location(locationName) {
        for (var i = 0; i < gamersData.locations.length; i++) {
            if (gamersData.locations[i].location_name === locationName) {
                this.name = gamersData.locations[i].location_name;
                this.direction_1 = gamersData.locations[i].direction_1;
                this.direction_2 = gamersData.locations[i].direction_2;
                this.monster = gamersData.locations[i].monster;
                this.monster_number = gamersData.locations[i].monster_number;
                this.image = gamersData.locations[i].image;
                this.description = gamersData.locations[i].description;
            }
        }        
    }
    
    //
    // MONSTER_CONSTRUCTOR
    //
    
    function Monster(monsterName) {
        for (var i = 0; i < gamersData.monsters.length; i++) {
            if (gamersData.monsters[i].monster_name === monsterName) {
                this.name = gamersData.monsters[i].monster_name;
                this.maxHP = gamersData.monsters[i].hp;
                this.player_hit = gamersData.monsters[i].hit_mark;
                this.damage = gamersData.monsters[i].damage;
                this.image = gamersData.monsters[i].image;
            }
        }
    }
    
    //
    // DICE_ROLLS
    //
    
    function D20Roll(hit, crit) {
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
    
    function DamageRoll(damage) {
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
    
    
    
    function StartFight() {
        if (hp_number === 0) {
            document.querySelector("#hp-button").className = "btn battle-button inactive-button";
            document.querySelector("#hp-button").removeEventListener("click", AttackEnemy);
        } else {
            document.querySelector("#hp-button").className = "btn battle-button";
            document.querySelector("#hp-button").addEventListener("click", function() {
                AttackEnemy(1);
            });
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
        document.querySelector("#attack-button").addEventListener("click", function() {
                AttackEnemy(0);
            });
        document.querySelector("#fight-button > button").removeEventListener("click", StartFight);
    }
    
    var monster_turn = true;    // MONSTER ELIGIBILITY TO ATTACK
    
    function AttackEnemy(hp_use) {
        
        var node;
        
        if (hp_use === 1) {
            hp_number -= 1;
            document.querySelector("#hp-number").innerHTML = hp_number;
            var hp_regen = Math.floor(Math.random()*20+1);
            player_current_HP += hp_regen;
            player_current_HP = (player_current_HP <= player.maxHP) ? player_current_HP : player.maxHP;
            document.querySelector("#player-current-hp").innerHTML = player_current_HP;
            node = document.createElement("p");
            node.innerHTML = player.name + " drinks a healing potion and regenerates " + player_d20result.number;
            node.className += " player-text";
            document.querySelector("#log-screen").appendChild(node);
        } else {
        
            // PLAYER ATTACKS

            var player_d20result = D20Roll(enemy.player_hit, player.crit);
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
                var player_damage = DamageRoll(player.damage);
                if (player_d20result.outcome === "hit") {
                    node = document.createElement("p");
                    node.innerHTML = player.name + " " + player_d20result.outcome + "s " + enemy.name + " for " + player_damage + " damage. Nice.";
                    node.className += " player-text";
                    document.querySelector("#log-screen").appendChild(node);
                } else if (player_d20result.outcome === "crit") {
                    node = document.createElement("p");
                    node.innerHTML = player.name + " " + player_d20result.outcome + "s " + enemy.name + " for " + player_damage*2 + " damage. BOOM!";
                    node.className += " player-text";
                    document.querySelector("#log-screen").appendChild(node);
                }
            }
            enemy_current_HP -= player_damage || 0;
            document.querySelector("#monster-current-hp").innerHTML = ((enemy_current_HP >= 0) ? enemy_current_HP : "0");
            if (enemy_current_HP <= 0) {
                enemy_current_HP = 0;
                Death("enemy");
                var next_direction = document.querySelectorAll("#next-buttons > button");
                for (var i = 0; i < next_direction.length; i++) {
                    (function(index){
                        next_direction[index].onclick = function(){
                            locationName = next_direction[index].innerHTML.slice(6);
                            ContinueJorney();
                        };   
                    })(i);
                }
                return;
            }   
        }
        
        // MONSTER ATTACKS
        
        if (player.initiative == 0) {
            monster_turn = !monster_turn;
        }
        if (monster_turn) {
            for (var i = 0; i <= (player.initiative / 2); i++) {    // CHECK MONSTER TURN FREQUENCY
                var enemy_d20result = D20Roll(player.monster_hit);    
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
                    var monster_damage = DamageRoll(enemy.damage);
                    node = document.createElement("p");
                    node.innerHTML = enemy.name + " " + enemy_d20result.outcome + "s " + player.name + " for " + monster_damage + " damage. Ouch!";
                    node.className += " monster-text";
                    document.querySelector("#log-screen").appendChild(node);
                }
                player_current_HP -= monster_damage || 0;
                document.querySelector("#player-current-hp").innerHTML = ((player_current_HP >= 0) ? player_current_HP : "0");
                if (player_current_HP <= 0) {
                    player_current_HP = 0;
                    Death("player");
                    document.querySelector("#restart-button > button").addEventListener("click", RestartJourney);
                    return;
                }   
                
            };
        }
        
        // SCROLL LOG TO THE BOTTOM
        
        document.querySelector("#log-screen").scrollTop = document.querySelector("#log-screen").scrollHeight;
    }
    
    
    function Death(subject) {
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
        document.querySelector("#log-screen").appendChild(node);
        document.querySelector("#log-screen").scrollTop = document.querySelector("#log-screen").scrollHeight;
        document.querySelector("#attack-button").removeEventListener("click", AttackEnemy);
        document.querySelector("#battle-buttons").style.opacity = 0;
        setTimeout(function(){
            document.querySelector("#battle-buttons").style.display = "none";
            document.querySelector(next_content).style.display = "block";
            setTimeout(function(){
                document.querySelector(next_content).style.opacity = 1;
            }, 100);
        }, 500);
    }
    
    function ContinueJorney() {
        document.querySelector(".main-module").style.opacity = 0;
        setTimeout(function(){
            CreateLocation();
            CreateMonster();
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
    
    function RestartJourney() {
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
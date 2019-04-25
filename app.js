new Vue({
    el: "#app",
    data: {
        battlers: ["You", "Monster"],
        startedGame: false,
        you: {
            health: 100,
            specialAttack: 1,
            heal: 2,
            attacking: false,
            healing: false,
            blocking: false,
            specialTriggered: false
        },
        monster: {
            health: 100,
            attacking: false
        },
        turns: [],
        meteorLimit: 0,
        gameLost: false
    },
    methods: {
        startGame: function () {
            let vm = this;
            vm.turns = [];
            vm.startedGame = true;
            vm.gameLost = false;
            vm.you.health = 100;
            vm.you.specialAttack = 1;
            vm.you.heal = 2;
            vm.you.attacking = false;
            vm.you.healing = false;
            vm.you.blocking = false;
            vm.you.specialTriggered = false;
            vm.monster.health = 100;
            vm.monster.attacking = false;

            var name = prompt("What's your Name?", "You");

            if (name) {
                vm.battlers[0] = name;
            }

            vm.meteorLimit = vm.randomNum(4, 8)
        },
        giveUp: function () {
            let vm = this;
            alert("Run! Run for your Life!!");
            vm.startedGame = false;
        },
        randomNum: function (a, b) {
            return Math.floor(Math.random() * (b - a + 1) + a);
        },
        attack: function (min = 5, max = 10) {
            let vm = this;
            let yourAttack = vm.randomNum(min, max);
            let monsterAttack = vm.randomNum(5, 15);


           if(Math.floor((vm.turns.length / 2)) === vm.meteorLimit - 1){
               toastr.error(null, `Meteor Attack Incoming!`, {"positionClass": "toast-top-right", "showDuration": "200"});
           } else if (Math.ceil((vm.turns.length / 2)) === vm.meteorLimit){
               monsterAttack = vm.randomNum(20, 30);
           }




            vm.you.attacking = true;
            vm.monster.attacking = true;

            vm.monster.health -= yourAttack;
            vm.you.health -= monsterAttack;

            vm.turns.push({ points: yourAttack, type: "HITS" });
            vm.turns.push({ points: monsterAttack, type: "HITS" });

            setTimeout(function () {
                vm.you.attacking = false;
                vm.monster.attacking = false;
                vm.you.specialTriggered = false;
            }, 1250);

            //vm.you.attacking = false;
            vm.checkWin();
        },
        specialAttack: function () {
            let vm = this;


            if (vm.you.specialAttack > 0) {
                vm.you.specialTriggered = true;
                vm.attack(10, 20);
                --vm.you.specialAttack;
            }

        },
        shield: function(){
            let vm = this;

            let shield = vm.randomNum(0, 2);
            let monsterAttack;
            vm.monster.attacking = true;
            vm.you.blocking = true;

            if(shield === 0){
                toastr.success("+1 SPECIAL ATTACK  +1 HEAL", "You Performed a Perfect Block!", {"positionClass": "toast-top-left", "showDuration": "200"});
                monsterAttack = 0;
                vm.you.health += vm.randomNum(2, 5);
                ++vm.you.specialAttack
                ++vm.you.heal
            }else{
                if(shield === 1){
                    toastr.error(null, "Shield Was Unsuccessful", {"positionClass": "toast-top-left", "showDuration": "200"});
                }else{
                    toastr.warning(null, `You Blocked  1/${shield} Damage`, {"positionClass": "toast-top-left", "showDuration": "200"});
                }
                monsterAttack = Math.floor(vm.randomNum(10, 15)/shield);
                vm.you.health -= monsterAttack;
            }

            setTimeout(function () {
                vm.monster.attacking = false;
                vm.you.blocking = false;
            }, 1250);

            vm.turns.push({ points: shield, type: "SHIELD" });
            vm.turns.push({ points: monsterAttack, type: "HITS" });

            vm.checkWin();
        },
        heal: function () {
            let vm = this;
            if (vm.you.heal <= 0) {

                toastr.warning(null, "You don't have anymore healing items left!", {"positionClass": "toast-top-left", "showDuration": "200"});

            } else if( vm.you.health >= 100){
                toastr.warning(null, "You Already have full Health!!", {"positionClass": "toast-top-left", "showDuration": "200"});
            }else{

                let heal = vm.randomNum(20, 25);
                let monsterAttack = vm.randomNum(10, 15);
                vm.monster.attacking = true;

                vm.you.healing = true;

                vm.you.health -= monsterAttack;
                vm.you.health += heal;

                vm.turns.push({ points: heal, type: "HEALS" });
                vm.turns.push({ points: monsterAttack, type: "HITS" });

                setTimeout(function () {
                    vm.monster.attacking = false;
                    vm.you.healing = false;
                }, 1250);

                vm.checkWin();

                --vm.you.heal

            }


    },
        checkWin: function () {
            let vm = this;

            if (vm.you.health <= 0 && vm.monster.health <= 0) {
                alert("It's a Draw!! How Poetic!");
                vm.startedGame = false;

            }
            else if (vm.you.health <= 0) {
                vm.gameLost = true;
                alert("You Got Deafeated!!");
                vm.startedGame = false;

            }
            else if (vm.monster.health <= 0) {
                alert("You Won!!");
                vm.startedGame = false;

            }
        }
    }
});

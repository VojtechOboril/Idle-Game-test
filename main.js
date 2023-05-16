class Skill {
    constructor(name, xpNeeded, xp = 0, lvl = 0, increaseXpFunction = function (x) { return x + 1 }, changeHTMLFunction = null) {
        this.name = name
        this.xpNeeded = xpNeeded
        this.xp = xp
        this.lvl = lvl
        this.increaseXpFunction = increaseXpFunction
        this.changeHTMLFunction = changeHTMLFunction
    }

    increaseXp(amount = 1) {
        this.xp += amount
        while (this.xp >= this.xpNeeded) {
            this.xp -= this.xpNeeded
            this.lvl += 1
            this.xpNeeded = this.increaseXpFunction(this.xpNeeded)
        }
        if (this.changeHTMLFunction !== null) {
            this.changeHTMLFunction()
        }
    }
}

class Upgrade {
    constructor(name, cost, increaseCostFunction, changeHTMLFunction, upgradeFunction) {
        this.name = name
        this.cost = cost
        this.lvl = 0
        this.increaseCostFunction = increaseCostFunction    // how does the cost increase
        this.changeHTMLFunction = changeHTMLFunction    // what changes on the page on upgrade
        this.upgradeFunction = upgradeFunction  // what this does on upgrade
    }

    upgrade() {
        if (gameData.gold >= this.cost) {
            gameData.gold -= this.cost
            this.cost = this.increaseCostFunction(this.cost)
            this.changeHTMLFunction()
            this.upgradeFunction(this.lvl)
            this.lvl += 1
        }
    }
}

var gameData = {
    materials: {
        gold: 0,
        wood: 0
    },
    goldPerClick: 1,
    woodPerClick: 1,
    upgradeGoldPerClick: new Upgrade("Gold Per Click", 10, function (x) { return 2 * x }, changeUpgradeGoldPerclick, upgradeUpgradeGoldPerClick),
    skillMiningGold: new Skill("Gold Mining", 10, 0, 0, skillMiningIncrease, changeSkillMineGoldHTML),
    skillMiningWood: new Skill("Wood Mining", 10, 0, 0, skillMiningIncrease, changeSkillMineWoodHTML)
}

function mineGold() {
    gameData.materials.gold += Math.round(gameData.goldPerClick * (1 + gameData.skillMiningGold.lvl / 10))
    document.getElementById("goldMined").innerHTML = gameData.materials.gold + " Gold Mined"
    gameData.skillMiningGold.increaseXp(1)
}

function mineWood() {
    gameData.materials.wood += Math.round(gameData.woodPerClick * (1 + gameData.skillMiningWood.lvl / 10))
    document.getElementById("woodMined").innerHTML = gameData.materials.wood + " Wood Chopped"
    gameData.skillMiningWood.increaseXp(1)
}

function changeUpgradeGoldPerclick() {
    document.getElementById("goldMined").innerHTML = gameData.materials.gold + " Gold Mined"
    document.getElementById("upgradeGoldPerClick").innerHTML = "Upgrade Pickaxe (Currently Level " + gameData.goldPerClick + ") Cost: " + gameData.upgradeGoldPerClick.cost + " Gold"
}

function upgradeUpgradeGoldPerClick(lvl) {
    gameData.goldPerClick += 1
}

function changeSkillMineGoldHTML() {
    document.getElementById("skillMiningGold").textContent = gameData.skillMiningGold.lvl + " Mine Gold Skill,"
    document.getElementById("progressSkillMiningGold").value = gameData.skillMiningGold.xp
    document.getElementById("progressSkillMiningGold").max = gameData.skillMiningGold.xpNeeded
}

function changeSkillMineWoodHTML() {
    document.getElementById("skillMiningWood").textContent = gameData.skillMiningWood.lvl + " Chop Wood Skill,"
    document.getElementById("progressSkillMiningWood").value = gameData.skillMiningWood.xp
    document.getElementById("progressSkillMiningWood").max = gameData.skillMiningWood.xpNeeded
}

function skillMiningIncrease(x) {return x + 1}
/*
var mainGameLoop = window.setInterval(function () {
    mineGold()
}, 1000)*/

/*
var savegame = JSON.parse(localStorage.getItem("goldMinerSave"))
if (savegame !== null) {
    //gameData = savegame
    document.getElementById("goldMined").innerHTML = gameData.materials.gold + " Gold Mined"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currently Level " + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
    document.getElementById("skillMiningGold").innerHTML = gameData.skillMiningGold + " Mine Gold Skill"
}*/

/*
var saveGameLoop = window.setInterval(function () {
    localStorage.setItem("goldMinerSave", JSON.stringify(gameData))
}, 15000)*/
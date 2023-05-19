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
    constructor(name, costFunction, increaseCostFunction, changeHTMLFunction, upgradeFunction) {
        this.name = name
        this.cost = costFunction(0)
        this.costFunction = costFunction
        this.lvl = 0
        this.increaseCostFunction = increaseCostFunction    // how does the cost increase
        this.changeHTMLFunction = changeHTMLFunction    // what changes on the page on upgrade
        this.upgradeFunction = upgradeFunction  // what this does on upgrade
    }

    upgrade() {
        if (this.__checkCosts()) {
            for(let key in this.cost) {
                gameData.materials[key] -= this.cost[key]
            }
            this.upgradeFunction(this.lvl)
            this.lvl += 1
            this.cost = this.costFunction(this.lvl)
            this.changeHTMLFunction()
        }
    }

    __checkCosts() {
        for(let key in this.cost) {
            if(gameData.materials[key] < this.cost[key]) {
                return false
            }
        }
        return true
    }
}

var gameData = {
    materials: {
        gold: 0,
        wood: 0,
        stick: 0
    },
    materialsClickValues: {
        gold: 1,
        wood: 1
    },
    skills: {
        miningGold: new Skill("Gold Mining", 10, 0, 0, skillMiningIncrease, changeSkillMineGoldHTML),
        miningWood: new Skill("Wood Mining", 10, 0, 0, skillMiningIncrease, changeSkillMineWoodHTML)
    },
    upgrades: {
        goldPerClick: new Upgrade("Gold Per Click", upgradeCostGoldPerClick, function (x) { return 2 * x }, changeUpgradeGoldPerclick, upgradeUpgradeGoldPerClick)
    }
}

var craftables = {
    stick: {
        wood: 1,
        result: 2
    }
}

var sellCosts = {
    gold: 1,
    wood: 5,
    stick: 3
}

function updateMaterialHTML() {
    for(key in gameData.materials) {
        document.getElementById(key+"Material").textContent = gameData.materials[key] + " " + key
    }
}

function mineGold() {
    gameData.materials.gold += Math.round(gameData.materialsClickValues.gold * (1 + gameData.skills.miningGold.lvl / 10))
    updateMaterialHTML()
    gameData.skills.miningGold.increaseXp(1)
}

function mineWood() {
    gameData.materials.wood += Math.round(gameData.materialsClickValues.wood * (1 + gameData.skills.miningWood.lvl / 10))
    updateMaterialHTML()
    gameData.skills.miningWood.increaseXp(1)
}

function changeUpgradeGoldPerclick() {
    updateMaterialHTML()
    document.getElementById("upgradeGoldPerClick").innerHTML = "Upgrade Pickaxe (Currently Level " + gameData.materialsClickValues.gold + ") Cost: " + gameData.upgrades.goldPerClick.cost.gold + " Gold"
}

function upgradeUpgradeGoldPerClick(lvl) {
    gameData.materialsClickValues.gold += 1
}

function changeSkillMineGoldHTML() {
    document.getElementById("skillMiningGold").textContent = gameData.skills.miningGold.lvl + " Mine Gold Skill,"
    document.getElementById("progressSkillMiningGold").value = gameData.skills.miningGold.xp
    document.getElementById("progressSkillMiningGold").max = gameData.skills.miningGold.xpNeeded
}

function changeSkillMineWoodHTML() {
    document.getElementById("skillMiningWood").textContent = gameData.skills.miningWood.lvl + " Chop Wood Skill,"
    document.getElementById("progressSkillMiningWood").value = gameData.skills.miningWood.xp
    document.getElementById("progressSkillMiningWood").max = gameData.skills.miningWood.xpNeeded
}

function skillMiningIncrease(x) { return x + 1 }

function upgradeCostGoldPerClick(lvl) {
    return {gold: 2**lvl * 10}
}

function sell() {
    value = document.getElementById("sellDropdown").value
    if(gameData.materials[value] > 0) {
        gameData.materials[value] -= 1
        gameData.materials["gold"] += sellCosts[value]
        updateMaterialHTML()
    }
}

function changeSellButton() {
    var e = document.getElementById("sellDropdown")
    document.getElementById("sellButton").textContent = "Sell 1 " + e.value + " for " + sellCosts[e.value] + " gold"
}

function craft() {
    var e = document.getElementById("craftDropdown").value
    for(let key in craftables[e]) {
        if(key != "result" && gameData.materials[key] < craftables[e][key]) {
            return false
        }
    }
    gameData.materials[e] += craftables[e].result
    for(let key in craftables[e]) {
        if(key != "result") {
            gameData.materials[key] -= craftables[e][key]
        }
    }
    updateMaterialHTML()
}

function changeCraftButton() {
    var e = document.getElementById("craftDropdown")
    document.getElementById("craftButton").textContent = "Craft " + craftables[e.value].result + " " + e
}

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
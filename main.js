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
        xp += amount
        while (xp >= this.xpNeeded) {
            xp -= this.xpNeeded
            lvl += 1
            this.xpNeeded = this.increaseXpFunction(this.xpNeeded)
            if (this.changeHTMLFunction !== null) {
                this.changeHTMLFunction()
            }
        }
    }
}

var gameData = {
    gold: 0,
    goldPerClick: 1,
    goldPerClickCost: 10,
    goldMiningSkill: new Skill("Gold Mining", 10, changeHTMLFunction = changeSkillMineGoldHTML)
}

function buyGoldPerClick() {
    if (gameData.gold >= gameData.goldPerClickCost) {
        gameData.gold -= gameData.goldPerClickCost
        gameData.goldPerClick += 1
        gameData.goldPerClickCost *= 2
        document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
        document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currently Level " + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
    }
}

function mineGold() {
    gameData.gold += Math.round(gameData.goldPerClick * (1 + gameData.goldMiningSkill / 10))
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
    gameData.goldMiningSkill.increaseXp(1)
}

function changeSkillMineGoldHTML() {
    document.getElementById("goldMiningSkill").innerHTML = gameData.goldMiningSkill + " Mine Gold Skill"
}
/*
var mainGameLoop = window.setInterval(function () {
    mineGold()
}, 1000)*/

/*
var savegame = JSON.parse(localStorage.getItem("goldMinerSave"))
if (savegame !== null) {
    //gameData = savegame
    document.getElementById("goldMined").innerHTML = gameData.gold + " Gold Mined"
    document.getElementById("perClickUpgrade").innerHTML = "Upgrade Pickaxe (Currently Level " + gameData.goldPerClick + ") Cost: " + gameData.goldPerClickCost + " Gold"
    document.getElementById("goldMiningSkill").innerHTML = gameData.goldMiningSkill + " Mine Gold Skill"
}*/

/*
var saveGameLoop = window.setInterval(function () {
    localStorage.setItem("goldMinerSave", JSON.stringify(gameData))
}, 15000)*/
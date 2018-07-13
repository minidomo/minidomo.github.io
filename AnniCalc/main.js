var Potion = {
    Regeneration: {
        Cost: 21,
        Recipe: ['empty_bottle', 'nether_wart', 'ghast_tear']
    },
    Swiftness: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'sugar']
    },
    FireResistance: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'magma_cream']
    },
    Healing: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'glistering_melon']
    },
    NightVision: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'golden_carrot']
    },
    Strength: {
        Cost: 21,
        Recipe: ['empty_bottle', 'nether_wart', 'blaze_powder']
    },
    Invisibility: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'golden_carrot', 'fermented_spider_eye']
    },
    Poison: {
        Cost: 8,
        Recipe: ['empty_bottle', 'nether_wart', 'spider_eye']
    },
    Weakness: {
        Cost: 4,
        Recipe: ['empty_bottle', 'fermented_spider_eye']
    },
    Slowness: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'sugar', 'fermented_spider_eye']
    },
    Harming: {
        Cost: 11,
        Recipe: ['empty_bottle', 'nether_wart', 'glistering_melon', 'fermented_spider_eye']
    }
}

var BrewingShop = {
    BrewingStand: 10,
    Bottles: 1,
    NetherWart: 5,
    Redstone: 3,
    FermentedSpiderEye: 3,
    MagmaCream: 2,
    Sugar: 2,
    GlisteringMelon: 2,
    GhastTear: 15,
    GoldenCarrot: 2,
    SpiderEye: 2,
    BlazePowder: 15
}

var IngredientsTable = {
    blaze_powder: 0,
    brewing_stand: 0,
    empty_bottle: 0,
    fermented_spider_eye: 0,
    ghast_tear: 0,
    glistering_melon: 0,
    glowstone_dust: 0,
    golden_carrot: 0,
    gunpowder: 0,
    magma_cream: 0,
    nether_wart: 0,
    redstone: 0,
    spider_eye: 0,
    sugar: 0,
}

var TDTH = {
    remove(id) {
        var firstRow = document.getElementById(id),
            secondRow = document.getElementById(id + '-count');
        firstRow.parentNode.removeChild(firstRow);
        secondRow.parentNode.removeChild(secondRow);
    },
    add(id, val) {
        var tableRowFirst = document.getElementById('ingredients-first-row'),
            tableRowSecond = document.getElementById('ingredients-second-row');

        var th = document.createElement('th');
        th.id = id;
        var img = new Image();
        img.src = 'assets/' + id + '.png';
        th.appendChild(img);

        tableRowFirst.appendChild(th);

        var td = document.createElement('td');
        td.id = id + '-count';
        td.innerHTML = val;

        tableRowSecond.appendChild(td);
    },
    modify(id, val) {
        var td = document.getElementById(id + '-count');
        td.innerHTML = val;
    }
}

var Totals = {
    blaze_powder: 0,
    brewing_stand: 0,
    empty_bottle: 0,
    fermented_spider_eye: 0,
    ghast_tear: 0,
    glistering_melon: 0,
    glowstone_dust: 0,
    golden_carrot: 0,
    gunpowder: 0,
    magma_cream: 0,
    nether_wart: 0,
    redstone: 0,
    spider_eye: 0,
    sugar: 0
}

var showStacks = false;
var includeStand = false;
var excludeRedstoneCost = false;

var update = function (element) {
    var tableRowChildren = element.parentElement.parentElement.childNodes;

    var sets = tableRowChildren[3].childNodes[1].value,
        brewingStands = tableRowChildren[5].childNodes[1].value,
        potionName = tableRowChildren[1].childNodes[1].value,
        extra = 0;

    if (isNum(sets)) {
        sets = parseInt(sets);
        tableRowChildren[3].style.backgroundColor = 'white';
        tableRowChildren[3].childNodes[1].style.backgroundColor = 'white';
    } else {
        if (sets !== '') {
            tableRowChildren[3].style.backgroundColor = '#9DFFF9';
            tableRowChildren[3].childNodes[1].style.backgroundColor = '#9DFFF9';
        } else {
            tableRowChildren[3].style.backgroundColor = 'white';
            tableRowChildren[3].childNodes[1].style.backgroundColor = 'white';
        }
        sets = 0;
    }

    if (isNum(brewingStands)) {
        brewingStands = parseInt(brewingStands);
        tableRowChildren[5].style.backgroundColor = 'white';
        tableRowChildren[5].childNodes[1].style.backgroundColor = 'white';
    } else {
        if (brewingStands !== '') {
            tableRowChildren[5].style.backgroundColor = '#9DFFF9';
            tableRowChildren[5].childNodes[1].style.backgroundColor = '#9DFFF9';
        } else {
            tableRowChildren[5].style.backgroundColor = 'white';
            tableRowChildren[5].childNodes[1].style.backgroundColor = 'white';
        }
        brewingStands = 0;
    }

    if (includeStand) {
        var cell = element.parentElement.cellIndex;
        if (cell === 1) {
            brewingStands = sets;
            tableRowChildren[5].childNodes[1].value = sets === 0 ? '' : sets;
        } else if (cell == 2) {
            sets = brewingStands;
            tableRowChildren[3].childNodes[1].value = brewingStands === 0 ? '' : brewingStands;
        }
    }

    if (potionName.indexOf(' ') >= 0) {
        var arr = potionName.split(' ');
        potionName = '';
        arr.forEach(function (word) {
            if (word === 'Ext.') {
                if (!excludeRedstoneCost)
                    extra += BrewingShop.Redstone;
            } else if (!(word === 'II' || word === 'Splash'))
                potionName += word;
        });
    }

    var goldForRow = (sets * (Potion[potionName].Cost + extra)) + (brewingStands * BrewingShop.BrewingStand);

    tableRowChildren[7].textContent = showStacks ? convertToStacks(goldForRow) : goldForRow;
    readPotionChart();
}

var readPotionChart = function () {
    var tableChildren = document.getElementById('potionChart').childNodes[1].childNodes;
    var total = 0;
    resetTotals();
    for (var x = 2; x <= 22; x += 2) {
        var theTotalGold = tableChildren[x].childNodes[7].innerHTML;
        if (theTotalGold.indexOf(' ') >= 0) {
            var arr = theTotalGold.split(' ');
            if (arr.length > 2)
                continue;
            theTotalGold = '' + convertToBlocks(theTotalGold);
        }
        if (isNum(theTotalGold)) {
            var setcount = tableChildren[x].childNodes[3].childNodes[1].value,
                standcount = tableChildren[x].childNodes[5].childNodes[1].value,
                nameofpotion = tableChildren[x].childNodes[1].childNodes[1].value;

            var hasExt = nameofpotion.indexOf('Ext.') >= 0;

            if (nameofpotion.indexOf(' ') >= 0) {
                var arr = nameofpotion.split(' ');
                nameofpotion = '';
                arr.forEach(function (word) {
                    if (isNum(setcount)) {
                        if (word === 'Ext.')
                            Totals.redstone += parseInt(setcount);
                        else if (word === 'II')
                            Totals.glowstone_dust += parseInt(setcount);
                        else if (word === 'Splash')
                            Totals.gunpowder += parseInt(setcount);
                    }
                    if (!(word === 'II' || word === 'Splash' || word === 'Ext.'))
                        nameofpotion += word;
                });
            }

            if (isNum(standcount) && standcount !== '0')
                Totals.brewing_stand += parseInt(standcount);

            // console.log(setcount);

            if (isNum(setcount) && setcount !== '0') {
                var arr = Potion[nameofpotion].Recipe;
                arr.forEach(function (x) {
                    Totals[x] += parseInt(setcount);
                });
            }

            setcount = isNum(setcount) ? parseInt(setcount) : 0;
            standcount = isNum(standcount) ? parseInt(standcount) : 0;
            var current = (setcount * (Potion[nameofpotion].Cost + (!hasExt ? 0 : (excludeRedstoneCost ? 0 : 3)))) + (standcount * BrewingShop.BrewingStand);
            total += current;
            tableChildren[x].childNodes[7].innerHTML = showStacks ? convertToStacks(current) : current;
        }
    }
    tableChildren[24].childNodes[7].textContent = showStacks ? convertToStacks(total) : total;
    for (var prop in IngredientsTable) {
        // console.log(prop + ': ' + IngredientsTable[prop] + ' ' + Totals[prop]);
        if (IngredientsTable[prop] !== Totals[prop]) {
            if (Totals[prop] === 0) {
                TDTH.remove(prop);
            } else if (IngredientsTable[prop] === 0) {
                TDTH.add(prop, Totals[prop]);
            } else {
                TDTH.modify(prop, Totals[prop]);
            }
            IngredientsTable[prop] = Totals[prop];
        }
    }
}

var resetTotals = function () {
    for (var prop in Totals)
        Totals[prop] = 0;
}

var isNum = function (string) {
    return !isNaN(parseInt(string)) && string.match('\\D') === null;
}

var convertToStacks = function (number) {
    return Math.floor(number / 64) + ' ' + (number % 64);
}

var convertToBlocks = function (stacksAndBlocks) {
    var arr = stacksAndBlocks.split(' ');
    return parseInt(arr[0]) * 64 + parseInt(arr[1]);
}

document.getElementById('getStacks').addEventListener('click', function () {
    showStacks = !showStacks;
    this.textContent = 'Convert to ' + (showStacks ? 'Blocks' : 'Stacks');
    for (var x = 2; x <= 24; x += 2) {
        var totalGoldDisplay = document.getElementById('potionChart').childNodes[1].childNodes[x].childNodes[7];
        totalGoldDisplay.textContent = showStacks ? convertToStacks(parseInt(totalGoldDisplay.textContent)) : convertToBlocks(totalGoldDisplay.textContent);
    }
});

document.getElementById('getStacks').addEventListener('mouseover', function () {
    this.style.backgroundColor = showStacks ? '#D8315B' : 'white';
    this.style.color = showStacks ? '#FFFAFF' : '#D8315B';
});

document.getElementById('getStacks').addEventListener('mouseleave', function () {
    this.style.backgroundColor = !showStacks ? '#D8315B' : 'white';
    this.style.color = !showStacks ? '#FFFAFF' : '#D8315B';
});

document.getElementById('includeStand').addEventListener('click', function () {
    includeStand = !includeStand;
    this.textContent = 'With' + (includeStand ? 'out ' : ' ') + 'Stand';
    // for (var x = 2; x <= 24; x += 2) {
    //     var totalGoldDisplay = document.getElementById('potionChart').childNodes[1].childNodes[x].childNodes[7];
    //     totalGoldDisplay.textContent = includeStand ? convertToStacks(parseInt(totalGoldDisplay.textContent)) : convertToBlocks(totalGoldDisplay.textContent);
    // }
});

document.getElementById('includeStand').addEventListener('mouseover', function () {
    this.style.backgroundColor = includeStand ? '#D8315B' : 'white';
    this.style.color = includeStand ? '#FFFAFF' : '#D8315B';
});

document.getElementById('includeStand').addEventListener('mouseleave', function () {
    this.style.backgroundColor = !includeStand ? '#D8315B' : 'white';
    this.style.color = !includeStand ? '#FFFAFF' : '#D8315B';
});

document.getElementById('excludeRedstoneCost').addEventListener('click', function () {
    excludeRedstoneCost = !excludeRedstoneCost;
    this.textContent = (excludeRedstoneCost ? 'In' : 'Ex') + 'clude Redstone Cost';
    // TODO make this better
    readPotionChart();
});

document.getElementById('excludeRedstoneCost').addEventListener('mouseover', function () {
    this.style.backgroundColor = excludeRedstoneCost ? '#D8315B' : 'white';
    this.style.color = excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
});

document.getElementById('excludeRedstoneCost').addEventListener('mouseleave', function () {
    this.style.backgroundColor = !excludeRedstoneCost ? '#D8315B' : 'white';
    this.style.color = !excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
});
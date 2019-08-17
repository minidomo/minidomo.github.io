$(document).ready(() => {

    const conversionButton = $('#conversionButton');
    conversionButton.click(function () {
        showStacks = !showStacks;
        this.textContent = showStacks ? 'Stacks' : 'Blocks';
        const totalGoldRows = $('.totalGoldRow');
        for (const cell of totalGoldRows) {
            const e = $(cell);
            const current = e.text();
            const converted = showStacks ? convertToStacks(parseInt(current)) : convertToBlocks(current);
            e.text(converted);
        }
    });
    conversionButton.mouseover(function () {
        this.style.backgroundColor = showStacks ? '#D8315B' : 'white';
        this.style.color = showStacks ? '#FFFAFF' : '#D8315B';
    });
    conversionButton.mouseleave(function () {
        this.style.backgroundColor = !showStacks ? '#D8315B' : 'white';
        this.style.color = !showStacks ? '#FFFAFF' : '#D8315B';
    });

    const standButton = $('#includeStand');
    standButton.click(function () {
        includeStand = !includeStand;
        this.textContent = 'With' + (includeStand ? ' ' : 'out ') + 'Stand';
    });
    standButton.mouseover(function () {
        this.style.backgroundColor = includeStand ? '#D8315B' : 'white';
        this.style.color = includeStand ? '#FFFAFF' : '#D8315B';
    });
    standButton.mouseleave(function () {
        this.style.backgroundColor = !includeStand ? '#D8315B' : 'white';
        this.style.color = !includeStand ? '#FFFAFF' : '#D8315B';
    });

    const redstoneButton = $('#excludeRedstoneCost');
    redstoneButton.click(function () {
        excludeRedstoneCost = !excludeRedstoneCost;
        this.textContent = (excludeRedstoneCost ? 'Ex' : 'In') + 'clude Redstone Cost';
        // TODO make this better
        readPotionChart();
    });
    redstoneButton.mouseover(function () {
        this.style.backgroundColor = excludeRedstoneCost ? '#D8315B' : 'white';
        this.style.color = excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
    });
    redstoneButton.mouseleave(function () {
        this.style.backgroundColor = !excludeRedstoneCost ? '#D8315B' : 'white';
        this.style.color = !excludeRedstoneCost ? '#FFFAFF' : '#D8315B';
    });

    const potionChartInputs = $('.potionChartInput');
    for (const input of potionChartInputs) {
        const e = $(input);
        e.keyup(() => update(e));
    }

    const dropdowns = $('.dropdown');
    for (const dropdown of dropdowns) {
        const e = $(dropdown);
        e.mouseup(() => update(e));
    }
});
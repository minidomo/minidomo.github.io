const resetTotals = () => {
    for (let prop in Totals)
        Totals[prop] = 0;
}

const isNum = string => {
    return /^\d+$/.test(string);
}

const convertToStacks = number => {
    return Math.floor(number / 64) + ' ' + (number % 64);
}

const convertToBlocks = stacksAndBlocks => {
    const arr = stacksAndBlocks.split(' ');
    return parseInt(arr[0]) * 64 + parseInt(arr[1]);
}

const TDTH = {
    remove(id) {
        const firstRow = document.getElementById(id),
            secondRow = document.getElementById(id + '-count');
        firstRow.parentNode.removeChild(firstRow);
        secondRow.parentNode.removeChild(secondRow);
    },
    add(id, val) {
        const tableRowFirst = document.getElementById('ingredients-first-row'),
            tableRowSecond = document.getElementById('ingredients-second-row');
        const th = document.createElement('th');
        th.id = id;
        const img = new Image();
        img.src = 'assets/' + id + '.png';
        th.appendChild(img);

        tableRowFirst.appendChild(th);

        const td = document.createElement('td');
        td.id = id + '-count';
        td.innerHTML = val;

        tableRowSecond.appendChild(td);
    },
    modify(id, val) {
        const td = document.getElementById(id + '-count');
        td.innerHTML = val;
    }
}
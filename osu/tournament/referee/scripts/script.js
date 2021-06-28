let values, outputText;

window.onload = () => {
    init();
    addEventListeners();
    createOutputValues();
};

const update = () => {
    assignOutputText();
    let arr = Array.from(document.getElementById('output-values').getElementsByTagName('input'));
    arr.forEach((e, i) => {
        e.value = outputText[i];
    });
};

const assignOutputText = () => {
    outputText = [
        `${values['team1-input']} | ${values['team1-score-input']} - ${values['team2-score-input']} | ${values['team2-input']} // Best of ${values['bestof-input']}, ${values['current-picker-input']} you have 120 seconds to pick a map`,
        'Please roll for pick and bans',
        `${values['team1-input']}, pick or ban first?`,
        `${values['team2-input']}, pick or ban first?`,
        `${values['team1-input']}, what is your ban?`,
        `${values['team2-input']}, what is your ban?`,
        `${values['team1-input']}, what is your pick?`,
        `${values['team2-input']}, what is your pick?`
    ];
};

const init = () => {
    values = {
        'team1-input': document.getElementById('team1-input').value,
        'team1-score-input': document.getElementById('team1-score-input').value,
        'team2-input': document.getElementById('team2-input').value,
        'team2-score-input': document.getElementById('team2-score-input').value,
        'bestof-input': document.getElementById('bestof-input').value,
        'current-picker-input': document.getElementById('current-picker-input').value,
    };
    assignOutputText();
};

const addEventListeners = () => {
    const inputs = Array.from(document.getElementById('input-values').getElementsByTagName('input'));
    inputs.forEach(element => {
        element.addEventListener('input', () => {
            values[element.id] = element.value;
            update();
        });
    });
};

const createOutputValues = () => {
    const outputValuesDiv = document.getElementById('output-values');
    outputText.forEach(text => {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.readOnly = true;
        inputElement.value = text;
        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.innerText = 'Copy';
        copyButton.onclick = () => {
            inputElement.select();
            document.execCommand('copy');
        };
        const divElement = document.createElement('div');
        divElement.className = 'output-value';
        divElement.append(copyButton, inputElement);
        outputValuesDiv.append(divElement);
    });
};
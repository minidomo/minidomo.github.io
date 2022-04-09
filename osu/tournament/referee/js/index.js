/** @type {Object} */
let inputValues;

/** @type {string[]} */
let outputIds = [];

window.onload = () => {
    init();
    addEventListeners();
};

function init() {
    inputValues = {
        'bestof-input-source': '',
        'left-team-name-input-source': '',
        'right-team-name-input-source': '',
        'left-team-points-input-source': '',
        'right-team-points-input-source': '',
        'first-picker-input-source': '',
        'high-roller-input-source': '',
    };

    document.getElementById('output-container')
        .querySelectorAll('input')
        .forEach(e => {
            outputIds.push(e.id);
            update(e.id);
        });
}

function addEventListeners() {
    document.getElementById('input-container')
        .querySelectorAll('input')
        .forEach(e => {
            e.addEventListener('input', () => {
                inputValues[e.id] = e.value;
                outputIds.forEach(update);
            });
        });

    const outputButtonPrefixLength = 'copy-button-'.length;
    document.getElementById('output-container')
        .querySelectorAll('button')
        .forEach(e => {
            e.addEventListener('click', function () {
                const inputId = this.id.substring(outputButtonPrefixLength);

                /** @type {HTMLInputElement} */
                const input = document.getElementById(inputId);
                input.select();
                document.execCommand('copy');
            });
        });
}

/**
 * 
 * @param {string} outputId 
 */
function update(outputId) {
    /** @type {HTMLInputElement} */
    const e = document.getElementById(outputId);
    e.value = getOutputText(outputId);
}

/**
 * 
 * @param {string} outputId 
 * @returns {string}
 */
function getOutputText(outputId) {
    const iv = inputValues;
    switch (outputId) {
        case 'score-text-pick':
            return `${iv['left-team-name-input-source']} | ${iv['left-team-points-input-source']} - ${iv['right-team-points-input-source']} | ${iv['right-team-name-input-source']} // Best of ${iv['bestof-input-source']}, ${getCurrentPicker()} you have 120 seconds to pick a map`;
        case 'score-text-tiebreaker':
            return `${iv['left-team-name-input-source']} | ${iv['left-team-points-input-source']} - ${iv['right-team-points-input-source']} | ${iv['right-team-name-input-source']} // Best of ${iv['bestof-input-source']}, we will now be playing tiebreaker`;
        case 'score-text-winner':
            return `${iv['left-team-name-input-source']} | ${iv['left-team-points-input-source']} - ${iv['right-team-points-input-source']} | ${iv['right-team-name-input-source']} // Best of ${iv['bestof-input-source']}, Congratulations to ${getWinner()}!`;
        case 'roll-text':
            return `Please roll for pick and ban order`;
        case 'warm-up-text':
            return `Would anyone like to select a warm up?`;
        case 'tiebreaker-text':
            return `Would you guys like to play tiebreaker for fun?`;
        case 'high-roll-text':
            return `${iv['high-roller-input-source']} would you like first or second pick or first or second ban?`;
        case 'low-roll-text-ban':
            return `${getLowRoller()} would you like first or second ban?`;
        case 'low-roll-text-pick':
            return `${getLowRoller()} would you like first or second pick?`;
        case 'high-roll-text-first-ban':
            return `${iv['high-roller-input-source']} what is your first ban?`;
        case 'high-roll-text-second-ban':
            return `${iv['high-roller-input-source']} what is your second ban?`;
        case 'low-roll-text-first-ban':
            return `${getLowRoller()} what is your first ban?`;
        case 'low-roll-text-second-ban':
            return `${getLowRoller()} what is your second ban?`;
        default:
            return '';
    }
}

/**
 * 
 * @returns {string}
 */
function getCurrentPicker() {
    const leftPointsStr = inputValues['left-team-points-input-source'];
    const rightPointsStr = inputValues['right-team-points-input-source'];
    if (leftPointsStr === '' || rightPointsStr === '' || inputValues['first-picker-input-source'] === '') {
        return '';
    }
    const totalPoints = parseInt(leftPointsStr) + parseInt(rightPointsStr);
    if (totalPoints % 2 === 0) {
        return inputValues['first-picker-input-source'];
    } else {
        if (inputValues['first-picker-input-source'] !== inputValues['left-team-name-input-source']) {
            return inputValues['left-team-name-input-source'];
        } else {
            return inputValues['right-team-name-input-source'];
        }
    }
}

/**
 * 
 * @returns {string}
 */
function getWinner() {
    const leftPointsStr = inputValues['left-team-points-input-source'];
    const rightPointsStr = inputValues['right-team-points-input-source'];
    if (leftPointsStr === '' || rightPointsStr === '') {
        return '';
    }
    const leftPoints = parseInt(leftPointsStr);
    const rightPoints = parseInt(rightPointsStr);
    if (leftPoints > rightPoints) {
        return inputValues['left-team-name-input-source'];
    } else if (leftPoints < rightPoints) {
        return inputValues['right-team-name-input-source'];
    } else {
        return '';
    }
}

/**
 * 
 * @returns {string}
 */
function getLowRoller() {
    if (inputValues['high-roller-input-source'] === '') {
        return '';
    }
    if (inputValues['high-roller-input-source'] !== inputValues['left-team-name-input-source']) {
        return inputValues['left-team-name-input-source'];
    } else {
        return inputValues['right-team-name-input-source'];
    }
}

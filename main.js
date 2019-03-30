import ntc from './ntc.js';

const dayInMs = 24 * 60 * 60 * 1000;
const nrOfColors = Math.pow(256, 3);
const nrOfAvailableColors = ntc.names.length;

function getPercentageOfDay() {
    const now = new Date().getTime();
    return (now % dayInMs) / dayInMs;
}

/**
 * RGB Color Wheel:
 *
 *     Red        Yellow       Green        Cyan         Blue         Magenta       Red
 *         |------------|------------|------------|------------|------------|------------|
 *R:G:B:  1:0:0       1:1:0        0:1:0       0:1:1         0:0:1       1:0:1         1:0:0
 *         0            1/6          2/6         3/6           4/6         5/6           6/6 = 0
 *
 */
function getRgbColorWheelValue() {
    let perc = getPercentageOfDay();
    let r,
        g,
        b = 0;
    if (perc <= 1 / 6) {
        r = 255;
        g = 6 * perc * 255;
        b = 0;
    } else if (perc <= 2 / 6) {
        r = 6 * (2 / 6 - perc) * 255;
        g = 255;
        b = 0;
    } else if (perc <= 3 / 6) {
        r = 0;
        g = 255;
        b = 6 * (perc - 2 / 6) * 255;
    } else if (perc <= 4 / 6) {
        r = 0;
        g = 6 * (4 / 6 - perc) * 255;
        b = 255;
    } else if (perc <= 5 / 6) {
        r = 6 * (perc - 4 / 6) * 255;
        g = 0;
        b = 255;
    } else if (perc <= 6 / 6) {
        r = 255;
        g = 0;
        b = 6 * (6 / 6 - perc) * 255;
    }
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    let hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    let colorInfo = ntc.name(hex);

    let hsl = ntc.hsl(colorInfo[0]);

    return {
        name: colorInfo[1],
        hex: colorInfo[0],
        r,
        g,
        b,
        hsl
    };
}

/**
 * Linear color function, from 0 (black) to fff (white), by percentage of the day's progress
 */
function getLinearColorForDayTime() {
    let index = Math.floor(nrOfAvailableColors * getPercentageOfDay());
    let color = ntc.names[index];
    let rgb = ntc.rgb(color[0]);
    let hsl = ntc.hsl('#' + color[0]);
    return {
        name: color[1],
        hex: '#' + color[0],
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        hsl
    };
}

/**
 * Random function
 */
function getRandomColorValue() {
    let index = Math.floor(nrOfAvailableColors * Math.random());
    let color = ntc.names[index];
    let rgb = ntc.rgb(color[0]);
    let hsl = ntc.hsl('#' + color[0]);
    let value = {
        name: color[1],
        hex: '#' + color[0],
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        hsl
    };
    return value;
}

function inverseColor(r, g, b) {
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
    };
}

function updateTime(timeEl) {
    let now = new Date();
    timeEl.innerHTML = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
    )}:${String(now.getSeconds()).padStart(2, '0')}`;
}

function update(colorEl, nameEl, timeEl, algorithm) {
    // let colorInfo = getLinearColorForDayTime();
    // let colorInfo = getRgbColorWheelValue();
    let colorInfo = algorithm();
    let inverseCol = inverseColor(colorInfo.r, colorInfo.g, colorInfo.b);
    colorEl.style.backgroundColor = colorInfo.hex;
    nameEl.style.color = `rgb(${inverseCol.r},${inverseCol.g},${inverseCol.b})`;
    nameEl.innerHTML = colorInfo.name + '<br />' + colorInfo.hex;
    timeEl.style.color = `rgb(${inverseCol.r},${inverseCol.g},${inverseCol.b})`;
    if (colorInfo.hsl[2] < 128) {
        // dark background, so light shadow
        timeEl.style.textShadow = '0 2px 1px white';
        nameEl.style.textShadow = '0 1px 0px white';
    } else {
        // ligh background, so dark shadow
        timeEl.style.textShadow = '0 2px 1px black';
        nameEl.style.textShadow = '0 1px 0px black';
    }
}

function startUpdateInterval(intervalInSecs) {
    setInterval(() => {
        update(colorEl, nameEl, timeEl, algoMap[algoChooser.value]);
    }, Number(intervalInSecs) * 1000 || 3000);
}

// ---------------------- main ----------------------------

const settingsContainer = document.getElementById('settings-container');
const settings = document.getElementById('settings');
const closeMenu = document.getElementById('closeMenu');
const algoChooser = document.getElementById('algorithm');
const intervalChooser = document.getElementById('interval');
const colorEl = document.getElementById('main');
const timeEl = document.getElementById('time');
const nameEl = document.getElementById('name');
const fullscreenBtn = document.getElementById('goFullscreen');

const algoMap = {
    getLinearColorForDayTime,
    getRgbColorWheelValue,
    getRandomColorValue
};

ntc.init();
updateTime(timeEl);
update(colorEl, nameEl, timeEl, algoMap[algoChooser.value]);
setInterval(() => {
    updateTime(timeEl);
}, 1000);
let timer = startUpdateInterval(intervalChooser.value);

algoChooser.addEventListener('change', e => {
    update(colorEl, nameEl, timeEl, algoMap[algoChooser.value]);
});

intervalChooser.addEventListener('change', e => {
    clearInterval(timer);
    timer = startUpdateInterval(intervalChooser.value);
});

closeMenu.addEventListener('click', e => {
    e.preventDefault();
    settingsContainer.classList.remove('on');
    return false;
});

document.body.addEventListener('click', () => {
    settingsContainer.classList.add('on');
});

settingsContainer.addEventListener('click', e => {
    e.stopPropagation();
    settingsContainer.classList.remove('on');
});

settings.addEventListener('click', e => {
    e.stopPropagation();
});

fullscreenBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        if (document.fullscreenEnabled) {
            document.body.requestFullscreen();
        }
    }
});

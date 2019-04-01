import ntc from './ntc.js';
ntc.init();

const dayInMs = 24 * 60 * 60 * 1000;
const nrOfAvailableColors = ntc.names.length;

export function getPercentageOfDay() {
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
export function getRgbColorWheelValue() {
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
getRgbColorWheelValue.description = 'RGB Color Wheel Value';

/**
 * Linear color function, from 0 (black) to fff (white), by percentage of the day's progress
 */
export function getLinearColorForDayTime() {
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
getLinearColorForDayTime.description = 'Linear color (from dark to light) per daytime';

/**
 * Random function
 */
export function getRandomColorValue() {
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
getRandomColorValue.description = 'Random color value';

export function inverseColor(r, g, b) {
    return {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
    };
}

export const algoMap = {
    getLinearColorForDayTime,
    getRgbColorWheelValue,
    getRandomColorValue
};

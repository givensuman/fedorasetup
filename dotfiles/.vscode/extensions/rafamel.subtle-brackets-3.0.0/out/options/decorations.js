"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const deep = require("lodash.clonedeep");
const pairs_1 = require("./pairs");
let decorations = {};
function setDecorations(settings) {
    const styles = Object.assign({ global: deep(settings.style) }, Object.keys(pairs_1.default.get()).reduce((acc, id) => {
        const pair = pairs_1.default.get()[id];
        if (pair && pair.style && typeof pair.style === 'object') {
            acc[id] = pair.style;
        }
        return acc;
    }, {}));
    // Build decorations
    decorations = Object.keys(styles).reduce((acc, styleFor) => {
        const style = styles[styleFor];
        // Add default borderColor if the style lacks it
        if (!style.hasOwnProperty('borderColor')) {
            style.borderColor = '#D4D4D4';
            style.light = { borderColor: '#333333' };
        }
        if (!style.hasOwnProperty('borderStyle')) {
            style.borderStyle = 'none none solid none';
        }
        if (!style.hasOwnProperty('borderWidth')) {
            style.borderWidth = '1px';
        }
        acc[styleFor] = vscode.window.createTextEditorDecorationType(style);
        return acc;
    }, {});
    return decorations;
}
function getDecorations() {
    return decorations;
}
exports.default = {
    set: setDecorations,
    get: getDecorations
};
//# sourceMappingURL=decorations.js.map
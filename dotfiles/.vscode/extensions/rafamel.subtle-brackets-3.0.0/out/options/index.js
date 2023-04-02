"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pairs_1 = require("./pairs");
const brackets_1 = require("./brackets");
const decorations_1 = require("./decorations");
let options;
function setOptions(settings) {
    // Pairs must be set/parsed first
    pairs_1.default.set(settings);
    // We can now parse decorations and brackets
    decorations_1.default.set(settings);
    brackets_1.default.set();
    // Regexp
    // Sort them by length (longer will be checked for first)
    const sorted = Object.keys(brackets_1.default.get()).sort((a, b) => b.length - a.length);
    // Build regexp
    const escape = (s) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexp = new RegExp('(' + sorted.map(escape).join('|') + ')', 'g');
    options = {
        brackets: brackets_1.default.get(),
        regexp,
        parse: settings.parse
    };
    return options;
}
function getOptions() {
    return options;
}
exports.default = {
    set: setOptions,
    get: getOptions
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const warn_1 = require("../utils/warn");
const deep = require("lodash.clonedeep");
let pairs = {};
function setPairs(settings) {
    const defArr = [];
    pairs = settings.pairs.reduce((acc, pair) => {
        if (!pair.open || !pair.close) {
            warn_1.default(`Each bracket pair must have an "open" and "close" key. Otherwise they'll be ignored.`);
            return acc;
        }
        if (pair.open === pair.close ||
            defArr.indexOf(pair.open) !== -1 ||
            defArr.indexOf(pair.close) !== -1) {
            warn_1.default(`Opening and closing clauses for bracket pairs must be unique. Otherwise they'll be ignored.`);
            return acc;
        }
        // Avoid duplicates
        defArr.push(pair.open);
        defArr.push(pair.close);
        // Generate id and save pair settings
        acc[uuid_1.v4()] = deep(pair);
        return acc;
    }, {});
    return pairs;
}
function getPairs() {
    return pairs;
}
exports.default = { get: getPairs, set: setPairs };
//# sourceMappingURL=pairs.js.map
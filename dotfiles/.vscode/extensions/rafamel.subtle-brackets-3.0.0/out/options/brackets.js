"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pairs_1 = require("./pairs");
const Bracket_1 = require("./Bracket");
let brackets = {};
function setBrackets() {
    brackets = Object.keys(pairs_1.default.get()).reduce((acc, id) => {
        const pair = pairs_1.default.get()[id];
        acc[pair.open] = new Bracket_1.default(id, true);
        acc[pair.close] = new Bracket_1.default(id, false);
        return acc;
    }, {});
    return brackets;
}
function getBrackets() {
    return brackets;
}
exports.default = {
    set: setBrackets,
    get: getBrackets
};
//# sourceMappingURL=brackets.js.map
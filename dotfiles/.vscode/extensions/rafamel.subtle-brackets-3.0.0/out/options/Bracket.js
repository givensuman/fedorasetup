"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pairs_1 = require("./pairs");
const decorations_1 = require("./decorations");
class Bracket {
    constructor(pairId, open) {
        this.pairId = pairId;
        const pair = pairs_1.default.get()[pairId];
        this.type = open ? 'open' : 'close';
        this.str = pair[this.type];
        this.opposite = pair[open ? 'close' : 'open'];
        // tslint:disable-next-line
        this.parse = !!(pair.parse || pair.parse == undefined);
    }
    get decoration() {
        return decorations_1.default.get()[this.pairId] || decorations_1.default.get().global;
    }
}
exports.default = Bracket;
//# sourceMappingURL=Bracket.js.map
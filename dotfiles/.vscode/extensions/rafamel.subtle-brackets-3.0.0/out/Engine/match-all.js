"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Returns all matches for a regular expression on a string
// - startAt: inclusive
// - endAt: non-inclusive
function matchAll(str, regex, startAt, endAt) {
    // Restart regex exec
    regex.lastIndex = 0;
    let current;
    const next = () => (current = regex.exec(str));
    next();
    const all = [];
    while (current) {
        const index = current.index;
        // Return for endAt; find next for startAt
        if ((endAt || endAt === 0) && index >= endAt)
            return all;
        if ((startAt || startAt === 0) && index < startAt) {
            next();
            continue;
        }
        all.push({ str: current[0], index });
        next();
    }
    return all;
}
exports.default = matchAll;
//# sourceMappingURL=match-all.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Paper_1 = require("./Paper");
const options_1 = require("../options");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class Engine {
    constructor() {
        this.run = () => {
            logger_1.default.debug('run: Engine.run()');
            // Clear the decorations
            this.paper.undecorate();
            // Stop if there's no adjacent bracket
            const adjacent = this.paper.getAdjacent();
            if (!adjacent)
                return;
            // Decorate starting and ending bracket positions.
            const pairMatch = this.traverse(adjacent);
            this.paper.decorate(pairMatch);
        };
        this.reset = () => {
            logger_1.default.debug('begin: Engine.reset()');
            // Clears the decorations and will need to re-parse all matches
            this.paper.undecorate();
            this.paper = new Paper_1.default();
            logger_1.default.debug('end: Engine.reset()');
        };
        this.paper = new Paper_1.default();
    }
    traverse(entryMatch) {
        const getForwards = (bracket) => brackets[bracket].type === 'open';
        // Prevent inifite loops/issues with large files
        let alive = true;
        setTimeout(() => {
            alive = false;
        }, config_1.default.traverseTimeout);
        // Initalize values
        const { brackets } = options_1.default.get();
        const forwards = getForwards(entryMatch.str);
        // Open and close will be reverse when going backwards
        const [OPEN, CLOSE] = forwards ? ['open', 'close'] : ['close', 'open'];
        const stack = [entryMatch];
        const state = {
            start: entryMatch
        };
        let line = entryMatch.line;
        let nextMatches = forwards
            ? this.paper.getMatches(line, entryMatch.index + entryMatch.str.length)
            : this.paper.getMatches(line, false, entryMatch.index).reverse();
        // Using while loop to prevent stack overflows on large file
        pageWhile: while (alive && !state.end) {
            // Each line
            lineFor: for (const match of nextMatches) {
                // Each match
                const bracket = brackets[match.str];
                if (!bracket ||
                    (bracket.opposite !== entryMatch.str &&
                        bracket.str !== entryMatch.str)) {
                    continue lineFor;
                }
                if (bracket.type === OPEN)
                    stack.push(match);
                else if (bracket.type === CLOSE &&
                    stack[stack.length - 1].str === bracket.opposite) {
                    stack.pop();
                    if (!stack.length) {
                        state.end = Object.assign({}, match, { line });
                        break lineFor;
                    }
                }
            }
            // Get next line ready
            if (state.end ||
                (!forwards && line <= 0) ||
                (forwards && line >= this.paper.lines - 1)) {
                break pageWhile;
            }
            line = forwards ? line + 1 : line - 1;
            nextMatches = this.paper.getMatches(line);
            // Reverse next matches order from last to first when going backwards
            if (!forwards)
                nextMatches.reverse();
        }
        return state;
    }
}
exports.default = Engine;
//# sourceMappingURL=Engine.js.map
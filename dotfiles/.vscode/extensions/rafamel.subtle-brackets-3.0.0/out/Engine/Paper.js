"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const options_1 = require("../options");
const match_all_1 = require("./match-all");
const PrismParser_1 = require("./PrismParser");
const logger_1 = require("../utils/logger");
class Paper {
    constructor() {
        logger_1.default.debug('begin: new Paper()');
        this.matches = [];
        this.editor = vscode.window.activeTextEditor;
        if (this.editor)
            this.doc = this.editor.document;
        this.language = this.getLanguage();
        this.parser = this.getParser();
        logger_1.default.debug('end: new Paper()');
    }
    get text() {
        return (this.doc && this.doc.getText()) || '';
    }
    get lines() {
        return (this.doc && this.doc.lineCount) || 0;
    }
    getLine(n) {
        return (this.doc && this.doc.lineAt(n).text) || '';
    }
    getMatches(line, startAt, endAt) {
        this.resetOnLanguage();
        if (!this.matches[line])
            this.matches[line] = this._getMatches(line);
        if (!startAt && !endAt && endAt !== 0)
            return this.matches[line].concat();
        return this.matches[line].filter((match) => {
            if (startAt && match.index < startAt)
                return false;
            if ((endAt || endAt === 0) && match.index >= endAt)
                return false;
            return true;
        });
    }
    getAdjacent() {
        if (!this.editor || !this.doc || this.lines <= 0)
            return;
        const selection = this.editor.selection;
        const range = new vscode.Range(selection.start, selection.end);
        if (!range.isEmpty)
            return;
        const position = {
            line: selection.start.line,
            char: selection.start.character
        };
        // Try right side matches first for cursor-adjacent brackets
        const right = this.getMatches(position.line, position.char);
        if (right.length && right[0].index === position.char) {
            // We've got a right hand match!
            return Object.assign({}, right[0], { line: position.line });
        }
        // Right hand failed, try left hand
        const left = this.getMatches(position.line, false, position.char);
        const last = left.slice(-1)[0];
        if (left.length && last.index === position.char - last.str.length) {
            // We've got a left hand match!
            return Object.assign({}, last, { line: position.line });
        }
    }
    decorate(pos) {
        if (!pos.end || !this.editor)
            return;
        // Set decoration
        const { brackets } = options_1.default.get();
        this.decoration = brackets[pos.start.str].decoration;
        // Set ranges
        const ranges = {
            start: new vscode.Range(new vscode.Position(pos.start.line, pos.start.index), new vscode.Position(pos.start.line, pos.start.index + pos.start.str.length)),
            end: new vscode.Range(new vscode.Position(pos.end.line, pos.end.index), new vscode.Position(pos.end.line, pos.end.index + pos.end.str.length))
        };
        this.editor.setDecorations(this.decoration, [ranges.start, ranges.end]);
    }
    undecorate() {
        logger_1.default.debug('begin: Paper.undecorate()');
        if (this.editor && this.decoration) {
            this.editor.setDecorations(this.decoration, []);
            this.decoration = undefined;
        }
        logger_1.default.debug('end: Paper.undecorate()');
    }
    getLanguage() {
        return (this.doc && this.doc.languageId) || '';
    }
    getParser() {
        return new PrismParser_1.default(this.text, this.language, this.lines);
    }
    resetOnLanguage() {
        // If doc language has changed, parse the document again
        // and clear the matches
        const newLanguage = this.getLanguage();
        if (this.language !== newLanguage) {
            this.language = newLanguage;
            this.parser = this.getParser();
            this.matches = [];
        }
    }
    _getMatches(line) {
        const matches = match_all_1.default(this.getLine(line), options_1.default.get().regexp);
        if (!this.parser.matches.length)
            return matches;
        const { brackets } = options_1.default.get();
        const parsedLine = this.parser.matches[line];
        return matches.filter((match, i) => {
            // If it not should not be parsed, don't filter
            if (!brackets[match.str].parse)
                return true;
            // If it's not found on the parsed doc, don't filter
            if (!parsedLine[i] || parsedLine[i].str !== match.str)
                return true;
            // If type is not punctuation, then filter
            if (this.parser.strategy.indexOf(parsedLine[i].type) === -1)
                return false;
            // Don't filter in any other case
            return true;
        });
    }
}
exports.default = Paper;
//# sourceMappingURL=Paper.js.map
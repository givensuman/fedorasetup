"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prism = require("prismjs");
const match_all_1 = require("./match-all");
const options_1 = require("../options");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
// Initialize Prism languages
let languagesLoad = false;
function loadLanguages() {
    if (languagesLoad)
        return;
    logger_1.default.info('prismjs loadLanguages()');
    languagesLoad = true;
    loadLanguages();
}
class PrismParser {
    constructor(text, language, lines) {
        this.text = text;
        this.strategies = {
            global: ['punctuation', 'interpolation-punctuation', 'delimiter', 'none'],
            markup: ['attr-name', 'none'],
            powershell: ['namespace', 'none']
        };
        logger_1.default.debug('begin: new PrismParser()');
        const endLogger = () => logger_1.default.debug('end: new PrismParser()');
        this.parsed = [];
        this.matches = [];
        this.language = this.getLanguageId(language);
        if (lines > config_1.default.maxPrismLines || !options_1.default.get().parse) {
            return endLogger();
        }
        // Parse
        loadLanguages();
        logger_1.default.debug('run: PrismParser.tokenize()');
        const tokenized = this.tokenize();
        if (!tokenized)
            return endLogger();
        logger_1.default.debug('run: PrismParser.parse()');
        const parsed = this.parse(tokenized);
        this.parsed = parsed.parsed;
        this.matches = parsed.matches;
        return endLogger();
    }
    get strategy() {
        return this.strategies.hasOwnProperty(this.language)
            ? this.strategies[this.language]
            : this.strategies.global;
    }
    tokenize() {
        if (!this.language)
            return;
        const grammar = prism.languages[this.language];
        if (!grammar)
            return;
        try {
            return prism.tokenize(this.text, grammar);
        }
        catch (err) {
            // tslint:disable-next-line
            logger_1.default.warn(err);
        }
    }
    parse(tokenized) {
        function perLine(tokens) {
            if (Array.isArray(tokens))
                return tokens.forEach(perLine);
            if (typeof tokens === 'string')
                return forStrings(tokens, 'none');
            if (tokens.content) {
                if (typeof tokens.content === 'string') {
                    return forStrings(tokens.content, tokens.type);
                }
                perLine(tokens.content);
            }
        }
        function forStrings(str, type) {
            const splitted = str.split('\n');
            // Push first part of string to current line
            const first = splitted.shift();
            // tslint:disable-next-line
            if (first == undefined)
                return;
            if (first) {
                lines[lines.length - 1].push({ str: first, type });
                match_all_1.default(first, regexp).forEach((match) => {
                    matches[matches.length - 1].push({ str: match.str, type });
                });
            }
            // Push following strings to further lines
            splitted.forEach((x) => {
                matches.push([]);
                match_all_1.default(x, regexp).forEach((match) => {
                    matches[matches.length - 1].push({ str: match.str, type });
                });
                if (x)
                    lines.push([{ str: x, type }]);
                else
                    lines.push([]);
            });
        }
        const { regexp } = options_1.default.get();
        const lines = [[]]; // All document, parsed
        const matches = [[]]; // Brackets with their parsed type
        perLine(tokenized);
        return { parsed: lines, matches };
    }
    getLanguageId(languageID) {
        return (() => {
            // @ https://github.com/CoenraadS/BracketPair/blob/master/src/documentDecorationManager.ts
            // VSCode language ids need to be mapped for Prism http://prismjs.com/#languages-list
            switch (languageID) {
                case 'ahk':
                    return ['autohotkey'];
                case 'bat':
                    return ['batch'];
                case 'apex':
                    return ['java'];
                case 'gradle':
                    return ['groovy'];
                case 'html':
                    return ['markup', 'javascript'];
                case 'javascriptreact':
                    return ['jsx'];
                case 'json5':
                    return ['javascript'];
                case 'jsonc':
                    return ['javascript'];
                case 'mathml':
                    return ['markup'];
                case 'nunjucks':
                    return ['twig'];
                case 'razor':
                    return ['markup', 'javascript', 'csharp', 'aspnet'];
                case 'scad':
                    return ['swift'];
                case 'svg':
                    return ['markup'];
                case 'systemverilog':
                    return ['verilog'];
                case 'typescriptreact':
                    return ['tsx'];
                case 'vb':
                    return ['vbnet'];
                case 'vue':
                    return ['markup', 'javascript'];
                case 'xml':
                    return ['markup'];
                default:
                    return [languageID];
            }
        })()[0];
    }
}
exports.default = PrismParser;
//# sourceMappingURL=PrismParser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Engine_1 = require("./Engine");
const logger_1 = require("./utils/logger");
class Controller {
    constructor() {
        this.engine = new Engine_1.default();
        this.engine.run();
        // Subscribe to selection change and editor activation events
        const subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection(( /* event */) => {
            logger_1.default.info('Fired: onDidChangeTextEditorSelection');
            this.engine.run();
        }, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(( /* event */) => {
            logger_1.default.info('Fired: onDidChangeActiveTextEditor');
            this.reset();
        }, this, subscriptions);
        vscode.workspace.onDidChangeTextDocument(( /* event */) => {
            logger_1.default.info('Fired: onDidChangeTextDocument');
            this.reset();
        }, this, subscriptions);
        // Create a combined disposable from both event subscriptions
        this.disposable = vscode.Disposable.from(...subscriptions);
    }
    reset() {
        this.engine.reset();
        this.engine.run();
    }
    dispose() {
        this.engine.reset();
        this.disposable.dispose();
    }
}
exports.default = Controller;
//# sourceMappingURL=Controller.js.map
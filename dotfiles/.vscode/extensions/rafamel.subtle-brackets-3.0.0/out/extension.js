"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Controller_1 = require("./Controller");
const options_1 = require("./options");
const logger_1 = require("./utils/logger");
function getSettings() {
    const settings = vscode.workspace.getConfiguration('subtleBrackets');
    return { settings, string: JSON.stringify(settings) };
}
function disableNative(settings) {
    if (!settings.disableNative)
        return;
    vscode.workspace
        .getConfiguration()
        .update('editor.matchBrackets', false, true);
}
function activate(context) {
    let settings = getSettings();
    disableNative(settings.settings);
    options_1.default.set(settings.settings);
    const controller = new Controller_1.default();
    // Register Save Event
    const saveEv = vscode.workspace.onDidChangeConfiguration(() => {
        logger_1.default.debug('Configuration/settings changed.');
        const current = getSettings();
        if (settings.string === current.string)
            return;
        logger_1.default.debug('Subtle Brackets settings changed.');
        settings = current;
        disableNative(settings.settings);
        options_1.default.set(settings.settings);
        controller.reset();
    });
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller, saveEv);
}
exports.activate = activate;
// Method called when the extension is deactivated
function deactivate(context) {
    // Dispose of subscriptions
    context.subscriptions.forEach((disposable) => disposable.dispose());
    // Reset native 'editor.matchBrackets'
    const disabledNative = vscode.workspace
        .getConfiguration()
        .get('subtleBrackets.disableNative');
    const matchBrackets = vscode.workspace
        .getConfiguration()
        .get('editor.matchBrackets');
    if (disabledNative && !matchBrackets) {
        vscode.workspace
            .getConfiguration()
            .update('editor.matchBrackets', true, true);
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
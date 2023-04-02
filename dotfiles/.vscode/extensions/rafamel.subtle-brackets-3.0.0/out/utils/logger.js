"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("loglevel");
const prefix = require("loglevel-plugin-prefix");
const config_1 = require("../config");
// Set up logger
logger.setLevel(config_1.default.logger);
// Set up prefix
prefix.reg(logger);
prefix.apply(logger, {
    format(level, name, timestamp) {
        return `${level.toUpperCase()}/${timestamp}`;
    }
});
exports.default = logger;
//# sourceMappingURL=logger.js.map
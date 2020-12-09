/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* $lab:coverage:on$ */
const entity_depend_doc_1 = __importDefault(require("./entity-depend-doc"));
module.exports = entity_depend;
module.exports.defaults = {};
module.exports.errors = {};
module.exports.doc = entity_depend_doc_1.default;
function entity_depend(options) {
    const seneca = this;
    return {
        name: 'entity-depend',
    };
}
const intern = (module.exports.intern = {});
//# sourceMappingURL=entity-depend.js.map
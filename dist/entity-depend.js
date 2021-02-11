/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_depend_doc_1 = __importDefault(require("./entity-depend-doc"));
const make_child_msg_1 = require("./lib/make_child_msg");
/* $lab:coverage:on$ */
// TODO: diff action
module.exports = entity_depend;
module.exports.defaults = {};
module.exports.errors = {};
module.exports.doc = entity_depend_doc_1.default;
function entity_depend(_options) {
    const seneca = this;
    seneca
        .fix('sys:entity,rig:depend')
        .message('make:child', make_child_msg_1.make_child_msg);
    return {
        name: 'entity-depend',
    };
}
//# sourceMappingURL=entity-depend.js.map
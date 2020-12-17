/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.make_child_msg = void 0;
const intern_1 = __importDefault(require("./intern"));
/* $lab:coverage:on$ */
function make_child_msg(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let seneca = this;
        let parent_id = yield intern_1.default.resolve_entity_id(seneca, msg, 'parent', { fail: true });
        console.log('PARENT', parent_id, msg);
        let parent_entity = msg.parent.entity$ || { base: msg.base, name: msg.name };
        let parent = yield seneca.entity(parent_entity).load$(parent_id);
        if (null == parent) {
            return seneca.fail('parent-not-found');
        }
        let child = parent.clone$();
        delete child.id;
        if (msg.replace) {
            Object.keys(msg.replace).forEach(fn => {
                let rval = msg.replace[fn];
                child[fn] =
                    'function' === typeof ('rval') ? rval(fn, child, parent, msg) :
                        rval;
            });
        }
        child = yield child.save$();
        // TODO: replace with call to entity-history to handle missing versions etc
        let current_ver = yield seneca.entity('sys/entver').load$(parent_id);
        console.log('CURRENT VER', current_ver);
        // TODO: support who as per entity-history
        let entdep = seneca.entity('sys/entdep').data$({
            child_id: child.id,
            parent_id: parent.id,
            parent_ver_id: current_ver.ver_id,
            parent_rtag: current_ver.ent_rtag,
            base: current_ver.base,
            name: current_ver.name,
            when: Date.now()
        }).save$();
        return {
            ok: true,
            child: child,
            parent: parent,
            entdep: entdep,
        };
    });
}
exports.make_child_msg = make_child_msg;
//# sourceMappingURL=make_child_msg.js.map
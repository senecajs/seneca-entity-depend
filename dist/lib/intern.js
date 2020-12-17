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
Object.defineProperty(exports, "__esModule", { value: true });
/* $lab:coverage:on$ */
const intern = {
    // TODO: move this to entity/util export
    // TODO: parse prefix => always pure and sync, resolve prefix => async
    // Search precendence: name_id: string, name_id: entity, name: string, name: entity
    parse_entity_id(seneca, msg, name, opts) {
        let id = msg[name + '_id'];
        if (null != id && 'string' != typeof (id)) {
            id = id.id;
        }
        if ('string' != typeof (id)) {
            id = msg[name];
        }
        if (null != id && 'string' != typeof (id)) {
            id = id.id;
        }
        if ('string' != typeof (id) && opts && opts.fail) {
            return seneca.fail('missing-entity-id', { name: name });
        }
        return id;
    },
    // Look up entity by unique field value (say user.email)
    // Depends on seneca-promisify
    resolve_entity_id(seneca, msg, name, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = intern.parse_entity_id(seneca, msg, name, Object.assign(Object.assign({}, opts), { fail: false }));
            let field = null;
            let value = null;
            // unique lookup field value provided by param format: name_field
            if ('string' != typeof (id) && opts && opts.entity) {
                // Assume this is the only such field
                let name_prefix = name + '_';
                let param = Object.keys(msg).find(p => p.startsWith(name_prefix));
                if (null != param) {
                    field = param.substring(name_prefix.length);
                    value = msg[param];
                    // Assume it identifies a unique entity        
                    let ent = yield seneca.entity(opts.entity)
                        .load$({ q: { [field]: value } });
                    if (ent) {
                        id = ent.id;
                    }
                }
            }
            if ('string' != typeof (id) && opts && opts.fail) {
                return seneca.fail('missing-entity-id-field', { name: name, field: field, value: value });
            }
            return id;
        });
    }
};
exports.default = intern;
//# sourceMappingURL=intern.js.map
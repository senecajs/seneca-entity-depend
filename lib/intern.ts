/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict'

/* $lab:coverage:on$ */


const intern = {

  // TODO: move this to entity/util export
  // TODO: parse prefix => always pure and sync, resolve prefix => async
  // Search precendence: name_id: string, name_id: entity, name: string, name: entity
  parse_entity_id(seneca: any, msg: any, name: string, opts?: any): string {
    let id: any = msg[name + '_id']

    if (null != id && 'string' != typeof (id)) {
      id = id.id
    }

    if ('string' != typeof (id)) {
      id = msg[name]
    }

    if (null != id && 'string' != typeof (id)) {
      id = id.id
    }

    if ('string' != typeof (id) && opts && opts.fail) {
      return seneca.fail('missing-entity-id', { name: name })
    }

    return id
  },

  // Look up entity by unique field value (say user.email)
  // Depends on seneca-promisify
  async resolve_entity_id(seneca: any, msg: any, name: string, opts?: any): Promise<string> {
    let id = intern.parse_entity_id(seneca, msg, name, { ...opts, fail: false })

    let field = null
    let value = null

    // unique lookup field value provided by param format: name_field
    if ('string' != typeof (id) && opts && opts.entity) {

      // Assume this is the only such field
      let name_prefix = name + '_'
      let param = Object.keys(msg).find(p => p.startsWith(name_prefix))

      if (null != param) {
        field = param.substring(name_prefix.length)
        value = msg[param]
        // Assume it identifies a unique entity        
        let ent = await seneca.entity(opts.entity)
          .load$({ q: { [field]: value } })

        if (ent) {
          id = ent.id
        }
      }
    }

    if ('string' != typeof (id) && opts && opts.fail) {
      return seneca.fail('missing-entity-id-field',
        { name: name, field: field, value: value })
    }

    return id
  }
}

export default intern

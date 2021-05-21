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
  async resolve_entity_id(
    seneca: any,
    msg: any,
    name: string,
    opts?: any
  ): Promise<string> {
    let id = intern.parse_entity_id(seneca, msg, name, { fail: false, ...opts })

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
  },


  async ensure_version(seneca: any, parent: any) {
    let canon = parent.canon$({ object: true })

    let cvmsg = {
      sys: 'entity',
      rig: 'history',
      entity: 'load',
      ent: {
        ent_id: parent.id,
        name: canon.name,
        base: canon.base,
      }
    }
    let current_ver = await seneca.post(cvmsg)
    console.log('CURRENT VER A', cvmsg, current_ver)

    // If no current_ver save parent to get it
    if (!current_ver.ok) {

      // Make sure to wait for the history ents to be saved.
      parent = parent.data$({
        custom$: { history: { wait: true } }
      })
      console.log('CURRENT VER B1', cvmsg, parent)
      parent = await parent.save$()
      //parent = await parent.data$({history_wait:true}).save$()
      console.log('CURRENT VER B2', cvmsg, parent)

      current_ver = await seneca.post(cvmsg)
      console.log('CURRENT VER C', cvmsg, current_ver)
    }


    if (!current_ver.ok) {
      return seneca.fail('no-current-version', { parent })
    }

    return current_ver.entver
  }

}

export default intern

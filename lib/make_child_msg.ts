/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict'

import intern from './intern'

/* $lab:coverage:on$ */


export async function make_child_msg(this: any, msg: {
  base: string,
  name: string,
  parent: any
  child?: {
    id$: string
  },
  replace?: any
  referents?: {
    [field_name: string]: {
      base: string,
      name: string,
      replace: any,
      child?: {
        id$: string
      },
    }
  }
}) {
  let seneca = this

  let parent_id =
    await intern.resolve_entity_id(seneca, msg, 'parent', { fail: true })

  let parent_entity_spec = msg.parent.entity$ || { base$: msg.base, name$: msg.name }
  let parent_entity = seneca.entity(parent_entity_spec)
  let parent_entity2 = seneca.make(parent_entity_spec)

  // console.log('PARENT', parent_id, parent_entity_spec, parent_entity, parent_entity2, msg)

  let parent = await parent_entity.load$(parent_id)

  if (null == parent) {
    return seneca.fail('parent-not-found')
  }


  let child = parent.clone$()
  delete child.id

  if (msg.child && null != msg.child.id$) {
    child.id$ = msg.child.id$
  }


  if (msg.replace) {
    Object.keys(msg.replace).forEach(fn => {
      let rval = msg.replace[fn]

      // TODO: function won't work over network - provide an option for named
      // functions defined in options
      child[fn] =
        'function' === typeof ('rval') ? rval(fn, child, parent, msg) :
          rval
    })
  }


  // TODO: also copy referents
  if (msg.referents) {
    for (let [field, referent] of Object.entries(msg.referents)) {
      if (null != child[field]) {
        let refmsg = {
          parent: child[field],
          base: referent.base,
          name: referent.name,
          replace: referent.replace,
          child: referent.child,
        }
        // console.log('REFERENT A', child, refmsg)

        let referent_child =
          await seneca.post('sys:entity,rig:depend,make:child', refmsg)

        // console.log('REFERENT B', referent_child)

        if (referent_child.ok) {
          child[field] = referent_child.child.id
        }
        else {
          return seneca.fail('referent-failed', { field, referent })
        }
      }
    }
  }


  child = await child.save$()

  let current_ver: any = await intern.ensure_version(seneca, parent)

  // console.log('CV', current_ver)

  // TODO: support who as per entity-history
  let entdep = await seneca.entity('sys/entdep').data$({
    child_id: child.id,
    parent_id: parent.id,
    parent_ver_id: current_ver.ver_id,
    parent_rtag: current_ver.ent_rtag,
    base: current_ver.base,
    name: current_ver.name,
    when: Date.now()
  }).save$()

  return {
    ok: true,
    child: child,
    parent: parent,
    entdep: entdep,
  }
}

/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict'

import intern from './intern'

/* $lab:coverage:on$ */


export async function make_child_msg(msg: {
  base: string,
  name: string,
  parent: any
  replace: any
}) {
  let seneca = this

  let parent_id =
    await intern.resolve_entity_id(seneca, msg, 'parent', { fail: true })


  console.log('PARENT', parent_id, msg)

  let parent_entity = msg.parent.entity$ || { base: msg.base, name: msg.name }

  let parent = await seneca.entity(parent_entity).load$(parent_id)

  if (null == parent) {
    return seneca.fail('parent-not-found')
  }


  let child = parent.clone$()
  delete child.id

  if (msg.replace) {
    Object.keys(msg.replace).forEach(fn => {
      let rval = msg.replace[fn]
      child[fn] =
        'function' === typeof ('rval') ? rval(fn, child, parent, msg) :
          rval
    })
  }

  child = await child.save$()

  // TODO: replace with call to entity-history to handle missing versions etc
  let current_ver = await seneca.entity('sys/entver').load$(parent_id)
  console.log('CURRENT VER', current_ver)

  // TODO: support who as per entity-history
  let entdep = seneca.entity('sys/entdep').data$({
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

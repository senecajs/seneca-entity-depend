/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict'

import Doc from './entity-depend-doc'

import { make_child_msg } from './lib/make_child_msg'

/* $lab:coverage:on$ */


// TODO: diff action

module.exports = entity_depend
module.exports.defaults = {}
module.exports.errors = {}
module.exports.doc = Doc

function entity_depend(_options: any) {
  const seneca = this

  seneca
    .fix('sys:entity,rig:depend')
    .message('make:child', make_child_msg)

  return {
    name: 'entity-depend',
  }
}


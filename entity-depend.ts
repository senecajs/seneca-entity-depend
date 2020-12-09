/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict'

/* $lab:coverage:on$ */

import Doc from './entity-depend-doc'

module.exports = entity_depend
module.exports.defaults = {}
module.exports.errors = {}
module.exports.doc = Doc

function entity_depend(options: any) {
  const seneca = this


  return {
    name: 'entity-depend',
  }
}

const intern = (module.exports.intern = {})

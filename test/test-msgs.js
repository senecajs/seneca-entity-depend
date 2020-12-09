/* Copyright © 2020 Richard Rodger, MIT License */
'use strict'

const MsgTest = require('seneca-msg-test')
const LN = MsgTest.LN

module.exports = {
  print: true,
  test: true,
  fix: 'sys:entity,rig:depend',
  allow: {
    missing: true,
  },
  calls: [
    LN({
      // handle upcoming change role:entity->sys:entity
      pattern: 'sys:entity,role:entity,cmd:save,name:foo',
      params: {
        ent: {
          id$: 'f01',
          x: 1,
          y: 'y01',
        },
      },
      out: {
        id: 'f01',
        x: 1,
        y: 'y01',
        entity$: '-/-/foo'
      },
    }),

    { pattern: 'role:mem-store,cmd:dump' },
  ],
}

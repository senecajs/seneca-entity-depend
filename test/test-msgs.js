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
      name: 'f01',
      // handle upcoming change role:entity->sys:entity
      pattern: 'sys:entity,role:entity,cmd:save,base:zed,name:foo',
      params: {
        ent: {
          id$: 'f01',
          x: 1,
          y: 'y01',
          entity$: '-/zed/foo',
        },
      },
      out: {
        id: 'f01',
        x: 1,
        y: 'y01',
        entity$: '-/zed/foo'
      },
    }),

    { pattern: 'role:mem-store,cmd:dump' },
    
    // make child
    LN({
      pattern:'make:child',
      params: {
        parent:'`f01:out`'
      },
      out: {}
    }),

    { pattern: 'role:mem-store,cmd:dump' },
    

    // change child
    // preview PR
    // change child again
    // preview PR
    
  ],
}
